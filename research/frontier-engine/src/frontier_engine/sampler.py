"""Prototype random sampling for rare-structure search."""

from __future__ import annotations

import random

from .benchmarks.m8_sat_rail import ALL_MASKS, TARGET_FAMILY_SIZE, build_candidate
from .contracts import Candidate
from .generator import CandidateGenerator


class PrototypeRandomSampler(CandidateGenerator):
    """Emit benchmark-shaped family candidates for the M(8,3) rail."""

    def __init__(self, batch_size: int = 64, seed: int = 857) -> None:
        self.batch_size = batch_size
        self.random = random.Random(seed)

    def generate(self) -> list[Candidate]:
        candidates: list[Candidate] = []

        for index in range(self.batch_size):
            family_masks = self.random.sample(ALL_MASKS, TARGET_FAMILY_SIZE)
            candidates.append(build_candidate(candidate_id=f"m8-seed-{index}", family_masks=family_masks))

        return candidates
