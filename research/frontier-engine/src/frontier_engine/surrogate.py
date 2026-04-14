"""Surrogate interfaces for frontier-engine."""

from __future__ import annotations

from typing import Protocol

from .contracts import Candidate, ScoreBundle


class SurrogateModel(Protocol):
    """Score candidates for promise and verifier alignment."""

    def score(self, candidates: list[Candidate]) -> list[ScoreBundle]:
        """Return score bundles for each candidate."""


class NullSurrogate:
    """Placeholder surrogate that scores nothing yet."""

    def score(self, candidates: list[Candidate]) -> list[ScoreBundle]:
        return [
            ScoreBundle(candidate_id=c.candidate_id, promise=0.0, metadata={"placeholder": True})
            for c in candidates
        ]
