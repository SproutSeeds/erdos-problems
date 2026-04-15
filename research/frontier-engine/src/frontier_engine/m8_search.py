"""Benchmark-specific rail search for the M(8,3) proving ground."""

from __future__ import annotations

from dataclasses import dataclass, asdict

from .contracts import Candidate
from .generator import CandidateGenerator
from .m8_backends import M8SearchBackend, build_m8_search_backend
from .m8_warm_start import build_warm_start_bundle


@dataclass
class M8SearchConfig:
    """Tunable search knobs for the first local M(8,3) rail."""

    seed: int = 857
    runtime: str = "auto"
    device: str = "auto"
    warm_start: str = "known_m8_lb45"
    warm_start_count: int = 32
    initial_batch_size: int = 64
    generations: int = 5
    parent_limit: int = 8
    children_per_parent: int = 12
    mutation_count: int = 3
    random_injections: int = 16

    def to_dict(self) -> dict[str, int]:
        """Return a JSON-friendly config payload."""

        return asdict(self)


class M8SatRailAdaptiveSampler(CandidateGenerator):
    """Mutation-guided generator for the M(8,3) benchmark rail."""

    def __init__(self, config: M8SearchConfig | None = None) -> None:
        self.config = config or M8SearchConfig()
        self.backend: M8SearchBackend = build_m8_search_backend(
            runtime_mode=self.config.runtime,
            device=self.config.device,
            seed=self.config.seed,
        )
        self.last_run_metadata: dict[str, object] = {}

    def generate(self) -> list[Candidate]:
        seen_families: set[tuple[int, ...]] = set()
        all_candidates: list[Candidate] = []
        global_elite: dict[tuple[int, ...], Candidate] = {}
        warm_start_bundle = build_warm_start_bundle(
            self.config.warm_start,
            self.config.warm_start_count,
        )
        current_pool = self.backend.initial_family_pool(
            self.config.initial_batch_size,
            seed_families=warm_start_bundle.families,
        )
        best_trace: list[int] = []
        generation_summaries: list[dict[str, object]] = []

        for generation in range(self.config.generations):
            evaluated = self.backend.evaluate_generation(
                generation=generation,
                family_pool=current_pool,
                seen_families=seen_families,
            )
            if not evaluated:
                break

            all_candidates.extend(evaluated)
            ranked = sorted(evaluated, key=self._rank_key)
            for candidate in ranked:
                family_key = tuple(candidate.payload["family_masks"])
                incumbent = global_elite.get(family_key)
                if incumbent is None or self._rank_key(candidate) < self._rank_key(incumbent):
                    global_elite[family_key] = candidate

            elite_ranked = sorted(global_elite.values(), key=self._rank_key)
            parents = elite_ranked[: self.config.parent_limit]
            generation_best_candidate = ranked[0]
            best_candidate = parents[0]
            best_trace.append(int(best_candidate.payload["sunflower_triple_count"]))
            generation_summaries.append(
                {
                    "generation": generation,
                    "evaluated_candidates": len(evaluated),
                    "generation_best_candidate_id": generation_best_candidate.candidate_id,
                    "generation_best_sunflower_triple_count": int(
                        generation_best_candidate.payload["sunflower_triple_count"]
                    ),
                    "generation_best_signal_score": float(
                        generation_best_candidate.payload["signal_score"]
                    ),
                    "best_candidate_id": best_candidate.candidate_id,
                    "best_sunflower_triple_count": int(
                        best_candidate.payload["sunflower_triple_count"]
                    ),
                    "best_signal_score": float(best_candidate.payload["signal_score"]),
                }
            )

            if generation == self.config.generations - 1:
                break

            current_pool = self.backend.expand_from_parents(
                parents,
                children_per_parent=self.config.children_per_parent,
                mutation_count=self.config.mutation_count,
                random_injections=self.config.random_injections,
            )

        best_candidate = min(all_candidates, key=self._rank_key) if all_candidates else None
        self.last_run_metadata = {
            "search_strategy": "m8_adaptive_mutation_sampler",
            "benchmark_id": "m8_sat_rail",
            "config": self.config.to_dict(),
            "unique_candidates": len(all_candidates),
            "generations_completed": len(generation_summaries),
            "best_sunflower_trace": best_trace,
            "best_candidate_id": best_candidate.candidate_id if best_candidate else None,
            "best_sunflower_triple_count": (
                int(best_candidate.payload["sunflower_triple_count"]) if best_candidate else None
            ),
            "generation_summaries": generation_summaries,
            "runtime": self.backend.metadata(),
            "warm_start": warm_start_bundle.metadata,
        }
        return all_candidates

    @staticmethod
    def _rank_key(candidate: Candidate) -> tuple[float, float, float, str]:
        payload = candidate.payload
        return (
            float(payload["sunflower_triple_count"]),
            -float(payload["signal_score"]),
            -float(payload["distinct_pair_intersections"]),
            candidate.candidate_id,
        )
