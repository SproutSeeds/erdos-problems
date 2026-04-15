"""Generator interfaces for frontier-engine."""

from __future__ import annotations

from typing import Protocol

from .contracts import Candidate


class CandidateGenerator(Protocol):
    """Emit raw candidates for the search loop."""

    def generate(self) -> list[Candidate]:
        """Return a batch of candidates."""


class NullGenerator:
    """Placeholder generator until a real GPU-backed implementation lands."""

    def generate(self) -> list[Candidate]:
        return []
