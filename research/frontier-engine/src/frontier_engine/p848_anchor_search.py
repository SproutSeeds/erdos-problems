"""Runnable search surface for the Problem 848 anchor ladder lane."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
import json
import os
from pathlib import Path
from typing import Any

from .p848_torch_backend import evaluate_p848_candidates_torch
from .runtime import probe_runtime, resolve_device, resolve_runtime_mode


REPO_ROOT = Path(__file__).resolve().parents[2]
KNOWN_FAILURE_PACKET_PATH = (
    REPO_ROOT / "experiments" / "p848-anchor-ladder" / "known_failure_packets.json"
)
OBSERVED_CONTINUATION_PATH = (
    REPO_ROOT / "experiments" / "p848-anchor-ladder" / "observed_continuations.json"
)
TMP_FRONTIER_ROOT = Path("/tmp/erdos-problems-848-frontier/packs/number-theory/problems/848")
SYNC_FRONTIER_ROOT = REPO_ROOT / "experiments" / "p848-anchor-ladder" / "live-frontier-sync"
EXPECTED_SHARED_PREFIX = (7, 32, 57, 82, 132, 182)


@dataclass
class P848KnownFailurePacket:
    """A frozen frontier failure packet used to score repair power."""

    packet_id: str
    n: int
    kind: str
    tail: int | None = None
    note: str | None = None


@dataclass
class P848ObservedContinuation:
    """Observed frontier evidence for a concrete continuation tail."""

    continuation: int
    status: str
    repaired_known_packets: int
    first_failure_n: int | None = None
    clean_through: int | None = None
    note: str | None = None
    source_paths: list[str] = field(default_factory=list)


@dataclass
class P848SearchConfig:
    """Configuration for anchor-tail continuation ranking."""

    prefix_anchors: list[int]
    candidates: list[int]
    direct_threshold: int
    direct_max: int
    top_k: int = 8
    candidate_mode: str = "explicit"
    base_tail: int | None = None
    ladder_step: int = 50
    ladder_rounds: int = 0
    perturb_offsets: list[int] = field(default_factory=list)
    runtime: str = "auto"
    device: str = "auto"
    n_chunk_size: int = 2048
    value_chunk_size: int = 32768
    prime_square_chunk_size: int = 128
    profile_id: str | None = None
    profile_path: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


class SquarefreeOracle:
    """Reusable squarefreeness and factorization helper."""

    MAX_CACHE_SIZE = 200000

    def __init__(self, max_value: int) -> None:
        self.primes = self._build_prime_list(int(max_value**0.5) + 1)
        self.squarefree_cache: dict[int, bool] = {}

    @staticmethod
    def _build_prime_list(limit: int) -> list[int]:
        sieve = bytearray(limit + 1)
        primes: list[int] = []
        for n in range(2, limit + 1):
            if sieve[n]:
                continue
            primes.append(n)
            step = n
            start = n * n
            for value in range(start, limit + 1, step):
                sieve[value] = 1
        return primes

    def is_squarefree(self, n: int) -> bool:
        cached = self.squarefree_cache.get(n)
        if cached is not None:
            return cached

        x = n
        for prime in self.primes:
            if prime * prime > x:
                break
            if x % prime != 0:
                continue
            x //= prime
            if x % prime == 0:
                self._remember(n, False)
                return False
            while x % prime == 0:
                x //= prime
        self._remember(n, True)
        return True

    def factor_exponents(self, n: int) -> list[dict[str, int]]:
        x = n
        factors: list[dict[str, int]] = []
        for prime in self.primes:
            if prime * prime > x:
                break
            if x % prime != 0:
                continue
            exponent = 0
            while x % prime == 0:
                x //= prime
                exponent += 1
            factors.append({"prime": prime, "exponent": exponent})
        if x > 1:
            factors.append({"prime": x, "exponent": 1})
        return factors

    def _remember(self, key: int, value: bool) -> None:
        if len(self.squarefree_cache) >= self.MAX_CACHE_SIZE:
            self.squarefree_cache.clear()
        self.squarefree_cache[key] = value


def load_known_failure_packets() -> dict[str, Any]:
    """Load the frozen frontier failure ladder for Problem 848."""

    return json.loads(KNOWN_FAILURE_PACKET_PATH.read_text(encoding="utf-8"))


def _load_json_if_exists(path: Path) -> dict[str, Any] | None:
    """Load a JSON document when the file exists and parses cleanly."""

    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def _matches_expected_prefix(anchors: list[int] | tuple[int, ...]) -> bool:
    """Check whether a packet targets the shared six-anchor prefix."""

    return tuple(int(anchor) for anchor in anchors) == EXPECTED_SHARED_PREFIX


def _summarize_family_menu(menu_doc: dict[str, Any], *, path: Path) -> dict[str, Any]:
    """Extract the live repair hierarchy from a six-prefix family menu."""

    repair_anchor_counts: dict[str, dict[str, int]] = {}
    for anchor in menu_doc.get("parameters", {}).get("repairAnchors", []):
        repair_anchor_counts[str(int(anchor))] = {"repairs": 0, "fails": 0}

    next_unmatched = None
    for family in menu_doc.get("families", []):
        if next_unmatched is None and not bool(family.get("matchesKnownFailure")):
            next_unmatched = int(family["representative"])
        for row in family.get("repairRows", []):
            anchor_key = str(int(row["anchor"]))
            bucket = "repairs" if bool(row.get("squarefree")) else "fails"
            if anchor_key not in repair_anchor_counts:
                repair_anchor_counts[anchor_key] = {"repairs": 0, "fails": 0}
            repair_anchor_counts[anchor_key][bucket] += 1

    known_failures = [int(value) for value in menu_doc.get("parameters", {}).get("knownFailures", [])]
    return {
        "source_path": str(path),
        "family_count": int(menu_doc.get("summary", {}).get("familyCount", len(menu_doc.get("families", [])))),
        "known_failure_matches": int(menu_doc.get("summary", {}).get("knownFailureMatches", 0)),
        "known_failures": known_failures,
        "last_known_matched": known_failures[-1] if known_failures else None,
        "next_unmatched": next_unmatched,
        "repair_anchor_counts": repair_anchor_counts,
    }


def _load_live_p848_frontier_snapshot_from_root(root: Path) -> dict[str, Any] | None:
    """Load one six-prefix frontier snapshot from a specific root."""

    if not root.exists():
        return None

    live_chunks_root = root / "chunks"
    shared_prefix_failures: set[int] = set()
    if live_chunks_root.exists():
        for summary_path in sorted(live_chunks_root.glob("six_anchor_frontier_after*/SUMMARY_*.json")):
            summary_doc = _load_json_if_exists(summary_path)
            if summary_doc is None:
                continue
            anchors = summary_doc.get("parameters", {}).get("anchors", [])
            if not _matches_expected_prefix(anchors):
                continue
            first_failure = summary_doc.get("summary", {}).get("firstFailure")
            if isinstance(first_failure, int):
                shared_prefix_failures.add(int(first_failure))

    menu_summaries: list[dict[str, Any]] = []
    for menu_path in sorted(root.glob("SIX_PREFIX_*FAMILY_MENU.json")):
        menu_doc = _load_json_if_exists(menu_path)
        if menu_doc is None:
            continue
        anchors = menu_doc.get("parameters", {}).get("anchors", [])
        if not _matches_expected_prefix(anchors):
            continue
        menu_summary = _summarize_family_menu(menu_doc, path=menu_path)
        shared_prefix_failures.update(menu_summary["known_failures"])
        menu_summaries.append(menu_summary)

    if not shared_prefix_failures and not menu_summaries:
        return None

    best_menu = None
    if menu_summaries:
        best_menu = max(
            menu_summaries,
            key=lambda row: (
                int(row["known_failure_matches"]),
                len(row["known_failures"]),
                int(row["family_count"]),
                row["source_path"],
            ),
        )

    ordered_failures = sorted(shared_prefix_failures)
    latest_direct_failure = ordered_failures[-1] if ordered_failures else None
    return {
        "source_root": str(root),
        "shared_prefix": list(EXPECTED_SHARED_PREFIX),
        "shared_prefix_failure_count": len(ordered_failures),
        "shared_prefix_failure_ns": ordered_failures,
        "latest_direct_failure": latest_direct_failure,
        "best_family_menu": best_menu,
    }


def _candidate_live_frontier_roots() -> list[Path]:
    """Return candidate live-frontier roots ordered by preference."""

    override = os.environ.get("FRONTIER_ENGINE_P848_LIVE_ROOT")
    if override:
        return [Path(override)]

    roots: list[Path] = []
    if TMP_FRONTIER_ROOT.exists():
        roots.append(TMP_FRONTIER_ROOT)

    synced_latest = SYNC_FRONTIER_ROOT / "latest"
    if synced_latest.exists():
        roots.append(synced_latest.resolve())
    return roots


def load_live_p848_frontier_snapshot() -> dict[str, Any] | None:
    """Load the freshest live six-prefix frontier snapshot from temp or repo sync."""

    snapshots = [
        snapshot
        for root in _candidate_live_frontier_roots()
        if (snapshot := _load_live_p848_frontier_snapshot_from_root(root)) is not None
    ]
    if not snapshots:
        return None

    return max(
        snapshots,
        key=lambda snapshot: (
            int(snapshot["shared_prefix_failure_count"]),
            int((snapshot.get("best_family_menu") or {}).get("known_failure_matches", 0)),
            int((snapshot.get("best_family_menu") or {}).get("family_count", 0)),
            snapshot["source_root"],
        ),
    )


def load_best_family_menu_surface(
    snapshot: dict[str, Any] | None = None,
) -> dict[str, Any] | None:
    """Load the richest live six-prefix family menu into a scoring surface."""

    resolved_snapshot = snapshot if snapshot is not None else load_live_p848_frontier_snapshot()
    if resolved_snapshot is None:
        return None

    best_menu = resolved_snapshot.get("best_family_menu")
    if not isinstance(best_menu, dict):
        return None

    source_path = Path(str(best_menu.get("source_path", "")))
    menu_doc = _load_json_if_exists(source_path)
    if menu_doc is None:
        return None

    families = []
    for family in menu_doc.get("families", []):
        families.append(
            {
                "representative": int(family["representative"]),
                "matches_known_failure": bool(family.get("matchesKnownFailure")),
                "tuple_key": family.get("tupleKey"),
            }
        )

    return {
        "source_path": str(source_path),
        "family_count": len(families),
        "known_failure_matches": int(best_menu.get("known_failure_matches", 0)),
        "next_unmatched": best_menu.get("next_unmatched"),
        "families": families,
    }


def load_observed_continuations() -> dict[int, P848ObservedContinuation]:
    """Load frozen continuation evidence earned in the live 848 frontier."""

    raw = json.loads(OBSERVED_CONTINUATION_PATH.read_text(encoding="utf-8"))
    rows: dict[int, P848ObservedContinuation] = {}
    for item in raw["observed_continuations"]:
        continuation = int(item["continuation"])
        rows[continuation] = P848ObservedContinuation(
            continuation=continuation,
            status=str(item["status"]),
            repaired_known_packets=int(item["repaired_known_packets"]),
            first_failure_n=(
                int(item["first_failure_n"]) if item.get("first_failure_n") is not None else None
            ),
            clean_through=(
                int(item["clean_through"]) if item.get("clean_through") is not None else None
            ),
            note=item.get("note"),
            source_paths=[str(path) for path in item.get("source_paths", [])],
        )
    return rows


def load_p848_search_profile(profile_path: Path) -> tuple[P848SearchConfig, dict[str, Any]]:
    """Load a p848 search profile file into a runnable search config."""

    raw = json.loads(profile_path.read_text(encoding="utf-8"))
    if raw.get("lane_id") != "p848_anchor_ladder":
        raise ValueError(f"profile does not target p848_anchor_ladder: {profile_path}")

    config = P848SearchConfig(
        prefix_anchors=[int(value) for value in raw.get("prefix_anchors", [])],
        candidates=[int(value) for value in raw.get("candidates", [])],
        direct_threshold=int(raw["direct_threshold"]),
        direct_max=int(raw["direct_max"]),
        top_k=int(raw.get("top_k", 8)),
        candidate_mode=str(raw.get("candidate_mode", "explicit")),
        base_tail=(
            int(raw["base_tail"]) if raw.get("base_tail") is not None else None
        ),
        ladder_step=int(raw.get("ladder_step", 50)),
        ladder_rounds=int(raw.get("ladder_rounds", 0)),
        perturb_offsets=[int(value) for value in raw.get("perturb_offsets", [])],
        runtime=str(raw.get("runtime_mode", raw.get("runtime", "auto"))),
        device=str(raw.get("device", "auto")),
        n_chunk_size=int(raw.get("n_chunk_size", 2048)),
        value_chunk_size=int(raw.get("value_chunk_size", 32768)),
        prime_square_chunk_size=int(raw.get("prime_square_chunk_size", 128)),
        profile_id=str(raw.get("profile_id")) if raw.get("profile_id") is not None else None,
        profile_path=str(profile_path),
    )
    return config, raw


def parse_int_csv(value: str, *, allow_empty: bool = False) -> list[int]:
    """Parse a comma-separated integer list."""

    if not value.strip():
        if allow_empty:
            return []
        raise ValueError("integer list must not be empty")
    items = [int(token.strip()) for token in value.split(",") if token.strip()]
    if not items:
        raise ValueError("integer list must not be empty")
    return items


def parse_candidate_csv(value: str) -> list[int]:
    """Parse a comma-separated candidate list."""

    return parse_int_csv(value)


def _sorted_unique(values: list[int]) -> list[int]:
    return sorted(set(int(value) for value in values))


def _resolve_p848_runtime(*, requested_runtime: str, requested_device: str) -> tuple[str, str, Any]:
    """Resolve runtime selection for the p848 lane."""

    probe = probe_runtime()
    if requested_runtime == "auto":
        runtime_mode = "torch" if probe.torch_installed and probe.cuda_available else "python"
    else:
        runtime_mode = resolve_runtime_mode(requested_runtime, probe)
    device = resolve_device(requested_device, runtime_mode, probe)
    return runtime_mode, device, probe


def generate_candidate_pool(
    *,
    config: P848SearchConfig,
    observed: dict[int, P848ObservedContinuation],
    default_base_tail: int,
) -> tuple[list[int], dict[str, Any]]:
    """Assemble the continuation pool from explicit and ladder-sweep sources."""

    pool: set[int] = set()
    explicit_candidates = _sorted_unique(config.candidates)
    if config.candidate_mode in {"explicit", "hybrid"}:
        pool.update(explicit_candidates)

    resolved_base_tail = config.base_tail if config.base_tail is not None else default_base_tail
    ladder_offsets = _sorted_unique(config.perturb_offsets or [0])
    generated_candidates: list[int] = []
    if config.candidate_mode in {"hybrid", "ladder-sweep"}:
        lower_bound = max(config.prefix_anchors) + 1
        for step_index in range(config.ladder_rounds + 1):
            center = resolved_base_tail + step_index * config.ladder_step
            for offset in ladder_offsets:
                candidate = center + offset
                if candidate < lower_bound:
                    continue
                generated_candidates.append(candidate)
                pool.add(candidate)

    observed_hits = sorted(candidate for candidate in pool if candidate in observed)
    return _sorted_unique(list(pool)), {
        "mode": config.candidate_mode,
        "explicit_candidates": explicit_candidates,
        "generated_candidates": _sorted_unique(generated_candidates),
        "resolved_base_tail": resolved_base_tail,
        "ladder_step": config.ladder_step,
        "ladder_rounds": config.ladder_rounds,
        "perturb_offsets": ladder_offsets,
        "observed_candidates_in_pool": observed_hits,
    }


def search_first_failure(
    *,
    anchors: list[int],
    threshold: int,
    max_n: int,
    oracle: SquarefreeOracle,
) -> dict[str, Any]:
    """Direct first-failure search on a finite window."""

    witness_counts = {anchor: 0 for anchor in anchors}
    checked_count = 0
    scanned_until = threshold - 1
    sorted_anchors = _sorted_unique(anchors)
    anchor_index = 0

    for n in range(threshold, max_n + 1):
        if n % 25 == 7:
            continue
        checked_count += 1
        scanned_until = n

        while anchor_index < len(sorted_anchors) and sorted_anchors[anchor_index] <= n:
            anchor_index += 1
        usable_anchors = sorted_anchors[:anchor_index]

        witness_anchor = None
        for anchor in usable_anchors:
            if oracle.is_squarefree(anchor * n + 1):
                witness_anchor = anchor
                break

        if witness_anchor is not None:
            witness_counts[witness_anchor] += 1
            continue

        obstruction_rows = []
        for anchor in usable_anchors:
            value = anchor * n + 1
            factors = oracle.factor_exponents(value)
            obstruction_rows.append(
                {
                    "anchor": anchor,
                    "value": value,
                    "square_witnesses": [
                        factor for factor in factors if int(factor["exponent"]) >= 2
                    ],
                }
            )
        return {
            "threshold": threshold,
            "max_n": max_n,
            "performed": True,
            "skipped": False,
            "skip_reason": None,
            "first_failure": n,
            "clean_through": n - 1,
            "scanned_until": scanned_until,
            "checked_count": checked_count,
            "all_covered_on_window": False,
            "witness_counts": witness_counts,
            "obstruction_rows": obstruction_rows,
        }

    return {
        "threshold": threshold,
        "max_n": max_n,
        "performed": True,
        "skipped": False,
        "skip_reason": None,
        "first_failure": None,
        "clean_through": scanned_until,
        "scanned_until": scanned_until,
        "checked_count": checked_count,
        "all_covered_on_window": True,
        "witness_counts": witness_counts,
        "obstruction_rows": [],
    }


def _skipped_direct_scan(
    *,
    anchors: list[int],
    threshold: int,
    max_n: int,
    reason: str,
    first_failure: int,
) -> dict[str, Any]:
    """Return a direct-scan stub when historical evidence already blocks the window."""

    return {
        "threshold": threshold,
        "max_n": max_n,
        "performed": False,
        "skipped": True,
        "skip_reason": reason,
        "first_failure": first_failure,
        "clean_through": first_failure - 1,
        "scanned_until": first_failure - 1,
        "checked_count": 0,
        "all_covered_on_window": False,
        "witness_counts": {anchor: 0 for anchor in anchors},
        "obstruction_rows": [],
    }


def _observed_evidence_row(
    observed: P848ObservedContinuation | None,
) -> dict[str, Any] | None:
    """Serialize frozen continuation evidence for reporting."""

    if observed is None:
        return None
    return {
        "continuation": observed.continuation,
        "status": observed.status,
        "repaired_known_packets": observed.repaired_known_packets,
        "first_failure_n": observed.first_failure_n,
        "clean_through": observed.clean_through,
        "note": observed.note,
        "source_paths": observed.source_paths,
    }


def _build_obstruction_rows(
    *,
    anchors: list[int],
    failure_n: int,
    oracle: SquarefreeOracle,
) -> list[dict[str, Any]]:
    """Build the explicit obstruction packet for a known first failure."""

    obstruction_rows: list[dict[str, Any]] = []
    for anchor in anchors:
        if anchor > failure_n:
            continue
        value = anchor * failure_n + 1
        factors = oracle.factor_exponents(value)
        obstruction_rows.append(
            {
                "anchor": anchor,
                "value": value,
                "square_witnesses": [
                    factor for factor in factors if int(factor["exponent"]) >= 2
                ],
            }
        )
    return obstruction_rows


def _score_family_menu_surface(
    *,
    continuation: int,
    family_menu_surface: dict[str, Any] | None,
    oracle: SquarefreeOracle,
    rescue_flags: list[bool] | None = None,
) -> dict[str, Any] | None:
    """Summarize how well a continuation repairs the live family-menu surface."""

    if family_menu_surface is None:
        return None

    family_rows = list(family_menu_surface.get("families", []))
    if rescue_flags is not None and len(rescue_flags) != len(family_rows):
        raise ValueError("family-menu rescue flag length mismatch")

    repaired_rows: list[dict[str, Any]] = []
    missed_rows: list[dict[str, Any]] = []
    repaired_predicted = 0
    repaired_known = 0
    missed_predicted = 0

    for index, row in enumerate(family_rows):
        representative = int(row["representative"])
        rescued = (
            bool(rescue_flags[index])
            if rescue_flags is not None
            else continuation <= representative and oracle.is_squarefree(continuation * representative + 1)
        )
        scored_row = {
            "representative": representative,
            "matches_known_failure": bool(row.get("matches_known_failure")),
            "rescued": rescued,
            "tuple_key": row.get("tuple_key"),
        }
        if rescued:
            repaired_rows.append(scored_row)
            if scored_row["matches_known_failure"]:
                repaired_known += 1
            else:
                repaired_predicted += 1
        else:
            missed_rows.append(scored_row)
            if not scored_row["matches_known_failure"]:
                missed_predicted += 1

    predicted_count = len(family_rows) - int(family_menu_surface.get("known_failure_matches", 0))
    return {
        "source_path": family_menu_surface["source_path"],
        "family_count": len(family_rows),
        "known_failure_matches": int(family_menu_surface.get("known_failure_matches", 0)),
        "predicted_family_count": predicted_count,
        "next_unmatched": family_menu_surface.get("next_unmatched"),
        "repaired_family_count": len(repaired_rows),
        "repaired_known_family_count": repaired_known,
        "repaired_predicted_family_count": repaired_predicted,
        "missed_family_count": len(missed_rows),
        "missed_predicted_family_count": missed_predicted,
        "first_missed_representatives": [row["representative"] for row in missed_rows[:8]],
        "first_missed_predicted_representatives": [
            row["representative"] for row in missed_rows if not row["matches_known_failure"]
        ][:8],
    }


def _merge_frontier_evidence(
    *,
    observed: P848ObservedContinuation | None,
    direct_scan: dict[str, Any],
) -> dict[str, Any]:
    """Combine historical frontier evidence with the latest finite direct scan."""

    if observed is None:
        return {
            "observed_status": "unseen",
            "observed_clean_through": None,
            "observed_first_failure": None,
            "effective_clean_through": int(direct_scan["clean_through"]),
            "effective_first_failure": direct_scan["first_failure"],
            "live_window_contiguous_with_observed": False,
            "frontier_gain_vs_observed": None,
            "extension_mode": "direct_window_only",
        }

    if observed.first_failure_n is not None:
        return {
            "observed_status": observed.status,
            "observed_clean_through": observed.first_failure_n - 1,
            "observed_first_failure": observed.first_failure_n,
            "effective_clean_through": observed.first_failure_n - 1,
            "effective_first_failure": observed.first_failure_n,
            "live_window_contiguous_with_observed": False,
            "frontier_gain_vs_observed": 0,
            "extension_mode": "historical_failure_locked",
        }

    observed_clean_through = int(observed.clean_through or 0)
    contiguous = bool(direct_scan["performed"]) and int(direct_scan["threshold"]) <= (
        observed_clean_through + 1
    )
    effective_clean_through = observed_clean_through
    effective_first_failure = None
    extension_mode = "historical_clean_preserved"

    if contiguous:
        if direct_scan["first_failure"] is None:
            effective_clean_through = max(
                observed_clean_through,
                int(direct_scan["clean_through"]),
            )
            extension_mode = "contiguous_clean_extension"
        else:
            effective_first_failure = int(direct_scan["first_failure"])
            effective_clean_through = effective_first_failure - 1
            extension_mode = "contiguous_failure_found"

    return {
        "observed_status": observed.status,
        "observed_clean_through": observed_clean_through,
        "observed_first_failure": observed.first_failure_n,
        "effective_clean_through": effective_clean_through,
        "effective_first_failure": effective_first_failure,
        "live_window_contiguous_with_observed": contiguous,
        "frontier_gain_vs_observed": effective_clean_through - observed_clean_through,
        "extension_mode": extension_mode,
    }


def evaluate_continuation(
    *,
    prefix_anchors: list[int],
    continuation: int,
    known_failure_packets: list[P848KnownFailurePacket],
    family_menu_surface: dict[str, Any] | None,
    observed: P848ObservedContinuation | None,
    direct_threshold: int,
    direct_max: int,
    oracle: SquarefreeOracle,
) -> dict[str, Any]:
    """Score one continuation against frozen packets plus a direct scan window."""

    all_anchors = _sorted_unique(prefix_anchors + [continuation])
    repaired_known_packets: list[dict[str, Any]] = []
    missed_known_packets: list[dict[str, Any]] = []

    for packet in known_failure_packets:
        rescued = continuation <= packet.n and oracle.is_squarefree(continuation * packet.n + 1)
        row = {
            "packet_id": packet.packet_id,
            "n": packet.n,
            "kind": packet.kind,
            "rescued": rescued,
            "tail": packet.tail,
        }
        if rescued:
            repaired_known_packets.append(row)
        else:
            missed_known_packets.append(row)

    if observed is not None and observed.first_failure_n is not None and direct_threshold > observed.first_failure_n:
        direct_scan = _skipped_direct_scan(
            anchors=all_anchors,
            threshold=direct_threshold,
            max_n=direct_max,
            reason=f"known earlier failure at {observed.first_failure_n}",
            first_failure=observed.first_failure_n,
        )
    else:
        direct_scan = search_first_failure(
            anchors=all_anchors,
            threshold=direct_threshold,
            max_n=direct_max,
            oracle=oracle,
        )

    frontier_evidence = _merge_frontier_evidence(observed=observed, direct_scan=direct_scan)
    family_menu_repairs = _score_family_menu_surface(
        continuation=continuation,
        family_menu_surface=family_menu_surface,
        oracle=oracle,
    )

    return {
        "continuation": continuation,
        "prefix_anchors": _sorted_unique(prefix_anchors),
        "all_anchors": all_anchors,
        "repaired_known_packets": len(repaired_known_packets),
        "known_packet_repairs": repaired_known_packets,
        "missed_known_packets": missed_known_packets,
        "family_menu_repairs": family_menu_repairs,
        "direct_scan": direct_scan,
        "observed_frontier": _observed_evidence_row(observed),
        "frontier_evidence": frontier_evidence,
        "tail_step_from_182": continuation - 182 if 182 in prefix_anchors else None,
        "plus50_alignment": ((continuation - 132) % 50 == 0) if continuation >= 132 else False,
    }


def _build_repair_rows(
    *,
    continuation: int,
    known_failure_packets: list[P848KnownFailurePacket],
    rescue_flags: list[bool],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Build repaired and missed packet rows from boolean repair flags."""

    repaired_known_packets: list[dict[str, Any]] = []
    missed_known_packets: list[dict[str, Any]] = []
    for packet, rescued in zip(known_failure_packets, rescue_flags):
        row = {
            "packet_id": packet.packet_id,
            "n": packet.n,
            "kind": packet.kind,
            "rescued": bool(rescued),
            "tail": packet.tail,
        }
        if rescued:
            repaired_known_packets.append(row)
        else:
            missed_known_packets.append(row)
    return repaired_known_packets, missed_known_packets


def _build_candidate_row_from_backend(
    *,
    prefix_anchors: list[int],
    continuation: int,
    known_failure_packets: list[P848KnownFailurePacket],
    family_menu_surface: dict[str, Any] | None,
    observed: P848ObservedContinuation | None,
    rescue_flags: list[bool],
    family_menu_rescue_flags: list[bool] | None,
    direct_scan: dict[str, Any],
    oracle: SquarefreeOracle,
) -> dict[str, Any]:
    """Assemble one candidate row from backend outputs."""

    all_anchors = _sorted_unique(prefix_anchors + [continuation])
    repaired_known_packets, missed_known_packets = _build_repair_rows(
        continuation=continuation,
        known_failure_packets=known_failure_packets,
        rescue_flags=rescue_flags,
    )

    if (
        direct_scan["performed"]
        and direct_scan["first_failure"] is not None
        and not direct_scan.get("obstruction_rows")
    ):
        direct_scan = dict(direct_scan)
        direct_scan["obstruction_rows"] = _build_obstruction_rows(
            anchors=all_anchors,
            failure_n=int(direct_scan["first_failure"]),
            oracle=oracle,
        )
    elif "obstruction_rows" not in direct_scan:
        direct_scan = dict(direct_scan)
        direct_scan["obstruction_rows"] = []

    frontier_evidence = _merge_frontier_evidence(observed=observed, direct_scan=direct_scan)
    family_menu_repairs = _score_family_menu_surface(
        continuation=continuation,
        family_menu_surface=family_menu_surface,
        oracle=oracle,
        rescue_flags=family_menu_rescue_flags,
    )
    return {
        "continuation": continuation,
        "prefix_anchors": _sorted_unique(prefix_anchors),
        "all_anchors": all_anchors,
        "repaired_known_packets": len(repaired_known_packets),
        "known_packet_repairs": repaired_known_packets,
        "missed_known_packets": missed_known_packets,
        "family_menu_repairs": family_menu_repairs,
        "direct_scan": direct_scan,
        "observed_frontier": _observed_evidence_row(observed),
        "frontier_evidence": frontier_evidence,
        "tail_step_from_182": continuation - 182 if 182 in prefix_anchors else None,
        "plus50_alignment": ((continuation - 132) % 50 == 0) if continuation >= 132 else False,
    }


def run_p848_anchor_search(config: P848SearchConfig) -> dict[str, Any]:
    """Run the 848 anchor-ladder continuation search."""

    frozen = load_known_failure_packets()
    live_frontier = load_live_p848_frontier_snapshot()
    family_menu_surface = load_best_family_menu_surface(live_frontier)
    observed = load_observed_continuations()
    packets = [
        P848KnownFailurePacket(
            packet_id=str(packet["packet_id"]),
            n=int(packet["n"]),
            kind=str(packet["kind"]),
            tail=(int(packet["tail"]) if packet.get("tail") is not None else None),
            note=packet.get("note"),
        )
        for packet in frozen["known_failure_packets"]
    ]
    seen_packet_keys = {(packet.kind, packet.n, packet.tail) for packet in packets}
    if live_frontier is not None:
        for failure_n in live_frontier["shared_prefix_failure_ns"]:
            packet_key = ("shared_prefix_failure", int(failure_n), None)
            if packet_key in seen_packet_keys:
                continue
            packets.append(
                P848KnownFailurePacket(
                    packet_id=f"shared_prefix_{failure_n}",
                    n=int(failure_n),
                    kind="shared_prefix_failure",
                    tail=None,
                    note="Recovered from the live six-prefix frontier snapshot.",
                )
            )
            seen_packet_keys.add(packet_key)
    packets.sort(key=lambda packet: (packet.n, packet.kind, packet.tail or -1))

    candidates, candidate_generation = generate_candidate_pool(
        config=config,
        observed=observed,
        default_base_tail=int(frozen["current_best_continuation"]),
    )
    if not candidates:
        raise ValueError("candidate pool is empty")

    max_anchor = max(_sorted_unique(config.prefix_anchors + candidates))
    family_menu_ns = (
        [int(row["representative"]) for row in family_menu_surface.get("families", [])]
        if family_menu_surface is not None
        else []
    )
    max_value = max(
        max_anchor
        * max(
            config.direct_max,
            max(packet.n for packet in packets),
            max(family_menu_ns, default=0),
        )
        + 1,
        2,
    )
    oracle = SquarefreeOracle(max_value=max_value)
    runtime_mode, resolved_device, probe = _resolve_p848_runtime(
        requested_runtime=config.runtime,
        requested_device=config.device,
    )

    if runtime_mode == "torch":
        backend_result = evaluate_p848_candidates_torch(
            prefix_anchors=config.prefix_anchors,
            continuations=candidates,
            known_packet_ns=[packet.n for packet in packets],
            family_menu_ns=family_menu_ns,
            observed_first_failures={
                continuation: int(observed_row.first_failure_n)
                for continuation, observed_row in observed.items()
                if observed_row.first_failure_n is not None
            },
            direct_threshold=config.direct_threshold,
            direct_max=config.direct_max,
            device=resolved_device,
            probe=probe,
            n_chunk_size=config.n_chunk_size,
            value_chunk_size=config.value_chunk_size,
            prime_square_chunk_size=config.prime_square_chunk_size,
        )
        candidate_rows = [
            _build_candidate_row_from_backend(
                prefix_anchors=config.prefix_anchors,
                continuation=continuation,
                known_failure_packets=packets,
                family_menu_surface=family_menu_surface,
                observed=observed.get(continuation),
                rescue_flags=backend_result["repair_flags_by_continuation"][continuation],
                family_menu_rescue_flags=backend_result["family_menu_repair_flags_by_continuation"].get(
                    continuation
                ),
                direct_scan=backend_result["direct_scans"][continuation],
                oracle=oracle,
            )
            for continuation in candidates
        ]
        backend_metadata = backend_result["backend_metadata"]
    else:
        candidate_rows = [
            evaluate_continuation(
                prefix_anchors=config.prefix_anchors,
                continuation=continuation,
                known_failure_packets=packets,
                family_menu_surface=family_menu_surface,
                observed=observed.get(continuation),
                direct_threshold=config.direct_threshold,
                direct_max=config.direct_max,
                oracle=oracle,
            )
            for continuation in candidates
        ]
        backend_metadata = {
            "resolved_runtime": runtime_mode,
            "resolved_device": resolved_device,
            "probe": probe.to_dict(),
            "candidate_scan_kind": "scalar_continuation_scan",
        }

    candidate_rows.sort(
        key=lambda row: (
            -int(row["repaired_known_packets"]),
            -int((row.get("family_menu_repairs") or {}).get("repaired_predicted_family_count", 0)),
            -int((row.get("family_menu_repairs") or {}).get("repaired_family_count", 0)),
            -int(row["frontier_evidence"]["effective_clean_through"]),
            -int(row["frontier_evidence"]["observed_clean_through"] or 0),
            row["frontier_evidence"]["effective_first_failure"] is not None,
            not bool(row["plus50_alignment"]),
            int(row["continuation"]),
        )
    )

    top_rows = candidate_rows[: config.top_k]
    best = top_rows[0] if top_rows else None
    return {
        "lane_id": "p848_anchor_ladder",
        "problem_id": "848",
        "config": config.to_dict(),
        "search_profile": (
            {
                "profile_id": config.profile_id,
                "profile_path": config.profile_path,
            }
            if config.profile_id or config.profile_path
            else None
        ),
        "candidate_generation": candidate_generation,
        "backend_metadata": backend_metadata,
        "known_failure_packet_count": len(packets),
        "known_failure_packets": [asdict(packet) for packet in packets],
        "live_frontier_snapshot": live_frontier,
        "family_menu_surface": (
            {
                "source_path": family_menu_surface["source_path"],
                "family_count": family_menu_surface["family_count"],
                "known_failure_matches": family_menu_surface["known_failure_matches"],
                "next_unmatched": family_menu_surface["next_unmatched"],
            }
            if family_menu_surface is not None
            else None
        ),
        "observed_continuations": [
            _observed_evidence_row(observed_row)
            for observed_row in sorted(observed.values(), key=lambda row: row.continuation)
        ],
        "summary": {
            "candidates_evaluated": len(candidate_rows),
            "known_failure_packet_count": len(packets),
            "family_menu_count": family_menu_surface["family_count"] if family_menu_surface else 0,
            "best_continuation": best["continuation"] if best else None,
            "best_repaired_known_packets": best["repaired_known_packets"] if best else None,
            "best_repaired_predicted_families": (
                (best.get("family_menu_repairs") or {}).get("repaired_predicted_family_count")
                if best
                else None
            ),
            "best_effective_clean_through": (
                best["frontier_evidence"]["effective_clean_through"] if best else None
            ),
            "best_direct_clean_through": (
                best["direct_scan"]["clean_through"] if best else None
            ),
        },
        "candidate_rows": candidate_rows,
        "top_candidates": top_rows,
        "frozen_frontier": {
            "shared_prefix": frozen["shared_prefix"],
            "current_best_continuation": frozen["current_best_continuation"],
            "current_best_clean_through": frozen["current_best_clean_through"],
        },
    }
