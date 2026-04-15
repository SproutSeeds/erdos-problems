"""Torch-backed batched evaluator for the Problem 848 anchor ladder lane."""

from __future__ import annotations

from math import isqrt
from typing import Any

from .runtime import RuntimeProbe

try:
    import torch
except ImportError:  # pragma: no cover - optional dependency
    torch = None


def _build_prime_squares(max_value: int) -> list[int]:
    """Return all prime squares up to the square root of `max_value`."""

    limit = max(2, isqrt(max_value) + 1)
    sieve = bytearray(limit + 1)
    prime_squares: list[int] = []
    for n in range(2, limit + 1):
        if sieve[n]:
            continue
        prime_squares.append(n * n)
        start = n * n
        for value in range(start, limit + 1, n):
            sieve[value] = 1
    return prime_squares


def _torch_squarefree_flags(
    values: "torch.Tensor",
    *,
    prime_squares: "torch.Tensor",
    value_chunk_size: int,
    prime_square_chunk_size: int,
) -> "torch.Tensor":
    """Return a boolean squarefree mask for the provided tensor values."""

    flat = values.reshape(-1)
    flags = torch.ones(flat.shape[0], dtype=torch.bool, device=flat.device)
    if flat.numel() == 0 or prime_squares.numel() == 0:
        return flags.reshape(values.shape)

    for value_start in range(0, flat.numel(), value_chunk_size):
        value_stop = min(value_start + value_chunk_size, flat.numel())
        block = flat[value_start:value_stop]
        block_flags = torch.ones(block.shape[0], dtype=torch.bool, device=flat.device)
        if block.numel() == 0:
            continue

        block_max = int(block.max().item())
        prime_limit = int(torch.searchsorted(prime_squares, block_max, right=True).item())
        relevant_prime_squares = prime_squares[:prime_limit]
        for prime_start in range(0, relevant_prime_squares.numel(), prime_square_chunk_size):
            prime_stop = min(prime_start + prime_square_chunk_size, relevant_prime_squares.numel())
            chunk = relevant_prime_squares[prime_start:prime_stop]
            if chunk.numel() == 0:
                continue
            divisibility = block.unsqueeze(1).remainder(chunk.unsqueeze(0)) == 0
            block_flags &= ~divisibility.any(dim=1)
            if not bool(block_flags.any().item()):
                break

        flags[value_start:value_stop] = block_flags

    return flags.reshape(values.shape)


def _repair_flags_for_targets(
    *,
    continuation_tensor: "torch.Tensor",
    target_ns: list[int],
    prime_squares: "torch.Tensor",
    value_chunk_size: int,
    prime_square_chunk_size: int,
) -> list[list[bool]]:
    """Return continuation-by-target repair flags for the provided target `n` values."""

    if not target_ns:
        return [[] for _ in range(int(continuation_tensor.shape[0]))]

    target_tensor = torch.tensor(target_ns, dtype=torch.int64, device=continuation_tensor.device)
    repair_values = continuation_tensor.unsqueeze(1) * target_tensor.unsqueeze(0) + 1
    repair_squarefree = _torch_squarefree_flags(
        repair_values,
        prime_squares=prime_squares,
        value_chunk_size=value_chunk_size,
        prime_square_chunk_size=prime_square_chunk_size,
    )
    repair_mask = (continuation_tensor.unsqueeze(1) <= target_tensor.unsqueeze(0)) & repair_squarefree
    repair_rows = repair_mask.detach().cpu().tolist()
    return [[bool(value) for value in row] for row in repair_rows]


def evaluate_p848_candidates_torch(
    *,
    prefix_anchors: list[int],
    continuations: list[int],
    known_packet_ns: list[int],
    family_menu_ns: list[int],
    observed_first_failures: dict[int, int],
    direct_threshold: int,
    direct_max: int,
    device: str,
    probe: RuntimeProbe,
    n_chunk_size: int,
    value_chunk_size: int,
    prime_square_chunk_size: int,
) -> dict[str, Any]:
    """Batch-evaluate candidate repairs and direct finite windows with torch."""

    if torch is None:  # pragma: no cover - guarded by runtime resolution
        raise RuntimeError("Torch backend requested, but torch is not installed")

    sorted_prefix = sorted(set(int(anchor) for anchor in prefix_anchors))
    sorted_continuations = sorted(set(int(value) for value in continuations))
    anchor_rows = [sorted(set(sorted_prefix + [continuation])) for continuation in sorted_continuations]
    anchor_rows_by_continuation = {
        continuation: row for continuation, row in zip(sorted_continuations, anchor_rows)
    }
    max_anchor = max(max(row) for row in anchor_rows) if anchor_rows else max(sorted_prefix, default=0)
    packet_max = max(known_packet_ns, default=0)
    max_scan_n = max(direct_max, packet_max)
    max_value = max(2, max_anchor * max_scan_n + 1)

    prime_square_values = _build_prime_squares(max_value)
    prime_squares = torch.tensor(prime_square_values, dtype=torch.int64, device=device)
    continuation_tensor = torch.tensor(sorted_continuations, dtype=torch.int64, device=device)
    anchor_tensor = torch.tensor(anchor_rows, dtype=torch.int64, device=device)

    repair_flags_by_continuation: dict[int, list[bool]] = {}
    known_packet_rows = _repair_flags_for_targets(
        continuation_tensor=continuation_tensor,
        target_ns=known_packet_ns,
        prime_squares=prime_squares,
        value_chunk_size=value_chunk_size,
        prime_square_chunk_size=prime_square_chunk_size,
    )
    for continuation, repair_row in zip(sorted_continuations, known_packet_rows):
        repair_flags_by_continuation[continuation] = repair_row

    family_menu_repair_flags_by_continuation: dict[int, list[bool]] = {}
    family_menu_rows = _repair_flags_for_targets(
        continuation_tensor=continuation_tensor,
        target_ns=family_menu_ns,
        prime_squares=prime_squares,
        value_chunk_size=value_chunk_size,
        prime_square_chunk_size=prime_square_chunk_size,
    )
    for continuation, repair_row in zip(sorted_continuations, family_menu_rows):
        family_menu_repair_flags_by_continuation[continuation] = repair_row

    direct_scans: dict[int, dict[str, Any]] = {}
    checked_count = {continuation: 0 for continuation in sorted_continuations}
    witness_counts = {
        continuation: {anchor: 0 for anchor in row}
        for continuation, row in zip(sorted_continuations, anchor_rows)
    }

    active_indices = [
        index
        for index, continuation in enumerate(sorted_continuations)
        if not (
            continuation in observed_first_failures
            and direct_threshold > int(observed_first_failures[continuation])
        )
    ]

    for continuation in sorted_continuations:
        known_failure = observed_first_failures.get(continuation)
        if known_failure is None or direct_threshold <= int(known_failure):
            continue
        row = anchor_rows_by_continuation[continuation]
        direct_scans[continuation] = {
            "threshold": direct_threshold,
            "max_n": direct_max,
            "performed": False,
            "skipped": True,
            "skip_reason": f"known earlier failure at {known_failure}",
            "first_failure": int(known_failure),
            "clean_through": int(known_failure) - 1,
            "scanned_until": int(known_failure) - 1,
            "checked_count": 0,
            "all_covered_on_window": False,
            "witness_counts": {anchor: 0 for anchor in row},
        }

    if direct_threshold <= direct_max and active_indices:
        unresolved = torch.tensor(active_indices, dtype=torch.int64, device=device)
        positions_cache: dict[int, torch.Tensor] = {}

        for chunk_start in range(direct_threshold, direct_max + 1, n_chunk_size):
            if unresolved.numel() == 0:
                break

            chunk_stop = min(chunk_start + n_chunk_size - 1, direct_max)
            n_values = torch.arange(chunk_start, chunk_stop + 1, dtype=torch.int64, device=device)
            n_values = n_values[n_values.remainder(25) != 7]
            if n_values.numel() == 0:
                continue

            current_anchors = anchor_tensor.index_select(0, unresolved)
            values = current_anchors.unsqueeze(2) * n_values.view(1, 1, -1) + 1
            squarefree = _torch_squarefree_flags(
                values,
                prime_squares=prime_squares,
                value_chunk_size=value_chunk_size,
                prime_square_chunk_size=prime_square_chunk_size,
            )
            available = current_anchors.unsqueeze(2) <= n_values.view(1, 1, -1)
            witness_mask = available & squarefree
            has_witness = witness_mask.any(dim=1)
            failure_mask = ~has_witness
            failure_any = failure_mask.any(dim=1)
            first_failure_idx = torch.argmax(failure_mask.to(torch.int64), dim=1)
            cutoff = torch.where(
                failure_any,
                first_failure_idx,
                torch.full_like(first_failure_idx, n_values.numel()),
            )

            position_tensor = positions_cache.get(int(n_values.numel()))
            if position_tensor is None:
                position_tensor = torch.arange(n_values.numel(), dtype=torch.int64, device=device)
                positions_cache[int(n_values.numel())] = position_tensor

            valid_prefix = position_tensor.unsqueeze(0) < cutoff.unsqueeze(1)
            first_witness = witness_mask & (witness_mask.cumsum(dim=1) == 1)
            counted_witness = first_witness & valid_prefix.unsqueeze(1)
            witness_increment = counted_witness.sum(dim=2).to(torch.int64).detach().cpu().tolist()

            unresolved_list = unresolved.detach().cpu().tolist()
            failure_any_list = failure_any.detach().cpu().tolist()
            failure_idx_list = first_failure_idx.detach().cpu().tolist()
            cutoff_list = cutoff.detach().cpu().tolist()
            n_value_list = n_values.detach().cpu().tolist()
            last_n = int(n_value_list[-1])

            next_unresolved: list[int] = []
            for local_index, candidate_index in enumerate(unresolved_list):
                continuation = sorted_continuations[int(candidate_index)]
                row_anchors = anchor_rows[int(candidate_index)]
                checked_count[continuation] += int(cutoff_list[local_index]) + (
                    1 if bool(failure_any_list[local_index]) else 0
                )
                for anchor_offset, anchor in enumerate(row_anchors):
                    witness_counts[continuation][anchor] += int(witness_increment[local_index][anchor_offset])

                if bool(failure_any_list[local_index]):
                    failure_n = int(n_value_list[int(failure_idx_list[local_index])])
                    direct_scans[continuation] = {
                        "threshold": direct_threshold,
                        "max_n": direct_max,
                        "performed": True,
                        "skipped": False,
                        "skip_reason": None,
                        "first_failure": failure_n,
                        "clean_through": failure_n - 1,
                        "scanned_until": failure_n,
                        "checked_count": checked_count[continuation],
                        "all_covered_on_window": False,
                        "witness_counts": dict(witness_counts[continuation]),
                    }
                    continue

                direct_scans[continuation] = {
                    "threshold": direct_threshold,
                    "max_n": direct_max,
                    "performed": True,
                    "skipped": False,
                    "skip_reason": None,
                    "first_failure": None,
                    "clean_through": last_n,
                    "scanned_until": last_n,
                    "checked_count": checked_count[continuation],
                    "all_covered_on_window": True,
                    "witness_counts": dict(witness_counts[continuation]),
                }
                next_unresolved.append(int(candidate_index))

            unresolved = torch.tensor(next_unresolved, dtype=torch.int64, device=device)

    if direct_threshold > direct_max:
        for continuation, row_anchors in zip(sorted_continuations, anchor_rows):
            if continuation in direct_scans:
                continue
            direct_scans[continuation] = {
                "threshold": direct_threshold,
                "max_n": direct_max,
                "performed": True,
                "skipped": False,
                "skip_reason": None,
                "first_failure": None,
                "clean_through": direct_threshold - 1,
                "scanned_until": direct_threshold - 1,
                "checked_count": 0,
                "all_covered_on_window": True,
                "witness_counts": {anchor: 0 for anchor in row_anchors},
            }

    for continuation, row_anchors in zip(sorted_continuations, anchor_rows):
        if continuation in direct_scans:
            continue
        direct_scans[continuation] = {
            "threshold": direct_threshold,
            "max_n": direct_max,
            "performed": True,
            "skipped": False,
            "skip_reason": None,
            "first_failure": None,
            "clean_through": direct_max,
            "scanned_until": direct_max,
            "checked_count": checked_count[continuation],
            "all_covered_on_window": True,
            "witness_counts": dict(witness_counts[continuation]),
        }

    return {
        "repair_flags_by_continuation": repair_flags_by_continuation,
        "family_menu_repair_flags_by_continuation": family_menu_repair_flags_by_continuation,
        "direct_scans": direct_scans,
        "backend_metadata": {
            "resolved_runtime": "torch",
            "resolved_device": device,
            "probe": probe.to_dict(),
            "n_chunk_size": n_chunk_size,
            "value_chunk_size": value_chunk_size,
            "prime_square_chunk_size": prime_square_chunk_size,
            "prime_square_count": len(prime_square_values),
            "candidate_scan_kind": "many_tails_many_n",
        },
    }
