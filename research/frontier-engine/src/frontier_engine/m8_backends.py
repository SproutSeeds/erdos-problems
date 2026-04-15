"""Backend implementations for the M(8,3) search rail."""

from __future__ import annotations

from itertools import combinations
import random
from typing import Any, Protocol

from .benchmarks.m8_sat_rail import (
    ALL_MASKS,
    N,
    TARGET_FAMILY_SIZE,
    build_candidate,
    build_candidate_from_metrics,
)
from .contracts import Candidate
from .runtime import RuntimeProbe, probe_runtime, resolve_device, resolve_runtime_mode

try:
    import torch
    import torch.nn.functional as torch_functional
except ImportError:  # pragma: no cover - optional dependency
    torch = None
    torch_functional = None


class M8SearchBackend(Protocol):
    """Backend contract for runtime-specific family generation and evaluation."""

    def initial_family_pool(self, count: int, *, seed_families: list[tuple[int, ...]] | None = None) -> Any:
        """Return an initial family pool."""

    def expand_from_parents(
        self,
        parents: list[Candidate],
        *,
        children_per_parent: int,
        mutation_count: int,
        random_injections: int,
    ) -> Any:
        """Return the next generation family pool."""

    def evaluate_generation(
        self,
        *,
        generation: int,
        family_pool: Any,
        seen_families: set[tuple[int, ...]],
    ) -> list[Candidate]:
        """Evaluate the current pool into concrete candidates."""

    def metadata(self) -> dict[str, object]:
        """Return runtime metadata for artifact logs."""


class PythonM8SearchBackend:
    """Pure-Python baseline backend."""

    def __init__(self, *, seed: int, probe: RuntimeProbe) -> None:
        self.random = random.Random(seed)
        self.seed = seed
        self.probe = probe

    def initial_family_pool(
        self,
        count: int,
        *,
        seed_families: list[tuple[int, ...]] | None = None,
    ) -> list[tuple[int, ...]]:
        seeds = list(seed_families or [])
        remaining = max(0, count - len(seeds))
        return seeds + [self._random_family() for _ in range(remaining)]

    def expand_from_parents(
        self,
        parents: list[Candidate],
        *,
        children_per_parent: int,
        mutation_count: int,
        random_injections: int,
    ) -> list[tuple[int, ...]]:
        pool = [tuple(parent.payload["family_masks"]) for parent in parents]
        for parent in parents:
            family = tuple(parent.payload["family_masks"])
            for _ in range(children_per_parent):
                pool.append(self._mutate_family(family, mutation_count))
        for _ in range(random_injections):
            pool.append(self._random_family())
        return pool

    def evaluate_generation(
        self,
        *,
        generation: int,
        family_pool: list[tuple[int, ...]],
        seen_families: set[tuple[int, ...]],
    ) -> list[Candidate]:
        candidates: list[Candidate] = []
        for index, family in enumerate(family_pool):
            canonical_family = tuple(sorted(family))
            if canonical_family in seen_families:
                continue
            seen_families.add(canonical_family)
            candidates.append(
                build_candidate(
                    candidate_id=f"m8-g{generation}-c{index}",
                    family_masks=list(canonical_family),
                )
            )
        return candidates

    def metadata(self) -> dict[str, object]:
        return {
            "resolved_runtime": "python",
            "resolved_device": "cpu",
            "probe": self.probe.to_dict(),
        }

    def _random_family(self) -> tuple[int, ...]:
        return tuple(sorted(self.random.sample(ALL_MASKS, TARGET_FAMILY_SIZE)))

    def _mutate_family(self, family: tuple[int, ...], mutation_count: int) -> tuple[int, ...]:
        if mutation_count <= 0:
            return family

        indices = self.random.sample(range(TARGET_FAMILY_SIZE), min(mutation_count, TARGET_FAMILY_SIZE))
        family_list = list(family)
        existing_masks = set(family_list)
        available_masks = [mask for mask in ALL_MASKS if mask not in existing_masks]
        replacements = self.random.sample(available_masks, len(indices))

        for index, replacement in zip(indices, replacements):
            family_list[index] = replacement

        return tuple(sorted(family_list))


class TorchM8SearchBackend:
    """Torch-backed backend that can run on CPU or CUDA."""

    def __init__(self, *, seed: int, device: str, probe: RuntimeProbe) -> None:
        if torch is None or torch_functional is None:  # pragma: no cover - guarded by runtime probe
            raise RuntimeError("Torch backend requested, but torch is not installed")

        self.device = device
        self.seed = seed
        self.probe = probe
        generator_device = "cuda" if device == "cuda" else "cpu"
        self.generator = torch.Generator(device=generator_device)
        self.generator.manual_seed(seed)

        self.size_lookup = torch.tensor(
            [mask.bit_count() if hasattr(int, "bit_count") else bin(mask).count("1") for mask in ALL_MASKS],
            dtype=torch.int64,
            device=self.device,
        )
        pair_indices = list(combinations(range(TARGET_FAMILY_SIZE), 2))
        triple_indices = list(combinations(range(TARGET_FAMILY_SIZE), 3))
        self.pair_left_idx = torch.tensor([left for left, _ in pair_indices], dtype=torch.int64, device=self.device)
        self.pair_right_idx = torch.tensor([right for _, right in pair_indices], dtype=torch.int64, device=self.device)
        self.triple_a_idx = torch.tensor([a for a, _, _ in triple_indices], dtype=torch.int64, device=self.device)
        self.triple_b_idx = torch.tensor([b for _, b, _ in triple_indices], dtype=torch.int64, device=self.device)
        self.triple_c_idx = torch.tensor([c for _, _, c in triple_indices], dtype=torch.int64, device=self.device)

    def initial_family_pool(
        self,
        count: int,
        *,
        seed_families: list[tuple[int, ...]] | None = None,
    ) -> "torch.Tensor":
        parts: list[torch.Tensor] = []
        seeds = list(seed_families or [])
        if seeds:
            parts.append(torch.tensor(seeds, dtype=torch.int64, device=self.device))
        remaining = max(0, count - len(seeds))
        if remaining > 0:
            parts.append(self._sample_random_families(remaining))
        if not parts:
            return torch.empty((0, TARGET_FAMILY_SIZE), dtype=torch.int64, device=self.device)
        return torch.cat(parts, dim=0)

    def expand_from_parents(
        self,
        parents: list[Candidate],
        *,
        children_per_parent: int,
        mutation_count: int,
        random_injections: int,
    ) -> "torch.Tensor":
        parent_rows = [parent.payload["family_masks"] for parent in parents]
        parts: list[torch.Tensor] = []

        if parent_rows:
            parts.append(torch.tensor(parent_rows, dtype=torch.int64, device=self.device))
            mutated_children: list[torch.Tensor] = []
            for row in parent_rows:
                family = torch.tensor(row, dtype=torch.int64, device=self.device)
                for _ in range(children_per_parent):
                    mutated_children.append(self._mutate_family(family, mutation_count))
            if mutated_children:
                parts.append(torch.stack(mutated_children))

        if random_injections > 0:
            parts.append(self._sample_random_families(random_injections))

        if not parts:
            return torch.empty((0, TARGET_FAMILY_SIZE), dtype=torch.int64, device=self.device)
        return torch.cat(parts, dim=0)

    def evaluate_generation(
        self,
        *,
        generation: int,
        family_pool: "torch.Tensor",
        seen_families: set[tuple[int, ...]],
    ) -> list[Candidate]:
        family_rows = family_pool.detach().cpu().tolist()
        unique_rows: list[list[int]] = []
        row_indices: list[int] = []

        for index, row in enumerate(family_rows):
            canonical_family = tuple(sorted(int(mask) for mask in row))
            if canonical_family in seen_families:
                continue
            seen_families.add(canonical_family)
            unique_rows.append(list(canonical_family))
            row_indices.append(index)

        if not unique_rows:
            return []

        families = torch.tensor(unique_rows, dtype=torch.int64, device=self.device)
        metrics = self._evaluate_metrics(families)
        size_histories = metrics["size_histograms"].cpu().tolist()
        pair_histories = metrics["pair_histograms"].cpu().tolist()
        coverages = metrics["coverage_counts"].cpu().tolist()
        distinct_counts = metrics["distinct_pair_intersections"].cpu().tolist()
        violation_counts = metrics["sunflower_triple_counts"].cpu().tolist()

        candidates: list[Candidate] = []
        for local_index, family in enumerate(unique_rows):
            candidates.append(
                build_candidate_from_metrics(
                    candidate_id=f"m8-g{generation}-c{row_indices[local_index]}",
                    family_masks=family,
                    size_hist=[int(value) for value in size_histories[local_index]],
                    pair_hist=[int(value) for value in pair_histories[local_index]],
                    coverage=int(coverages[local_index]),
                    distinct_pair_intersections=int(distinct_counts[local_index]),
                    sunflower_violations=int(violation_counts[local_index]),
                )
            )
        return candidates

    def metadata(self) -> dict[str, object]:
        return {
            "resolved_runtime": "torch",
            "resolved_device": self.device,
            "probe": self.probe.to_dict(),
        }

    def _sample_random_families(self, count: int) -> "torch.Tensor":
        if count <= 0:
            return torch.empty((0, TARGET_FAMILY_SIZE), dtype=torch.int64, device=self.device)
        scores = torch.rand((count, len(ALL_MASKS)), generator=self.generator, device=self.device)
        families = torch.topk(scores, TARGET_FAMILY_SIZE, dim=1).indices.to(torch.int64)
        return torch.sort(families, dim=1).values

    def _mutate_family(self, family: "torch.Tensor", mutation_count: int) -> "torch.Tensor":
        if mutation_count <= 0:
            return family.clone()

        child = family.clone()
        actual_mutation_count = min(mutation_count, TARGET_FAMILY_SIZE)
        positions = torch.randperm(
            TARGET_FAMILY_SIZE,
            generator=self.generator,
            device=self.device,
        )[:actual_mutation_count]
        replacement_scores = torch.rand(len(ALL_MASKS), generator=self.generator, device=self.device)
        replacement_scores[child] = -1.0
        replacements = torch.topk(replacement_scores, actual_mutation_count).indices.to(torch.int64)
        child[positions] = replacements
        return torch.sort(child).values

    def _evaluate_metrics(self, families: "torch.Tensor") -> dict[str, "torch.Tensor"]:
        subset_sizes = self.size_lookup[families]
        size_histograms = torch_functional.one_hot(subset_sizes, num_classes=N + 1).sum(dim=1)

        pair_left = families[:, self.pair_left_idx]
        pair_right = families[:, self.pair_right_idx]
        pair_intersections = pair_left.bitwise_and(pair_right)
        pair_sizes = self.size_lookup[pair_intersections]
        pair_histograms = torch_functional.one_hot(pair_sizes, num_classes=N + 1).sum(dim=1)

        sorted_intersections = torch.sort(pair_intersections, dim=1).values
        distinct_pair_intersections = torch.ones(
            (families.shape[0],), dtype=torch.int64, device=self.device
        )
        if sorted_intersections.shape[1] > 1:
            distinct_pair_intersections += (
                sorted_intersections[:, 1:] != sorted_intersections[:, :-1]
            ).sum(dim=1)

        union_masks = families[:, 0].clone()
        for column in range(1, TARGET_FAMILY_SIZE):
            union_masks = union_masks.bitwise_or(families[:, column])
        coverage_counts = self.size_lookup[union_masks]

        triple_a = families[:, self.triple_a_idx]
        triple_b = families[:, self.triple_b_idx]
        triple_c = families[:, self.triple_c_idx]
        ab = triple_a.bitwise_and(triple_b)
        sunflower_triple_counts = (
            ((triple_a.bitwise_and(triple_c) == ab) & (triple_b.bitwise_and(triple_c) == ab))
            .sum(dim=1)
            .to(torch.int64)
        )

        return {
            "size_histograms": size_histograms.to(torch.int64),
            "pair_histograms": pair_histograms.to(torch.int64),
            "coverage_counts": coverage_counts.to(torch.int64),
            "distinct_pair_intersections": distinct_pair_intersections.to(torch.int64),
            "sunflower_triple_counts": sunflower_triple_counts,
        }


def build_m8_search_backend(*, runtime_mode: str, device: str, seed: int) -> M8SearchBackend:
    """Build the requested backend for the current runtime environment."""

    probe = probe_runtime()
    resolved_runtime = resolve_runtime_mode(runtime_mode, probe)
    resolved_device = resolve_device(device, resolved_runtime, probe)

    if resolved_runtime == "torch":
        return TorchM8SearchBackend(seed=seed, device=resolved_device, probe=probe)
    return PythonM8SearchBackend(seed=seed, probe=probe)
