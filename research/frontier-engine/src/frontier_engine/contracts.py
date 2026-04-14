"""Core logical contracts for the frontier-engine prototype."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class Candidate:
    """A search object emitted by a generator."""

    candidate_id: str
    payload: dict[str, Any]
    source: str = "generator"
    tags: list[str] = field(default_factory=list)


@dataclass
class ScoreBundle:
    """Heuristic and surrogate scores attached to a candidate."""

    candidate_id: str
    promise: float
    rarity: float | None = None
    hardness: float | None = None
    diversity: float | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class InventoryRecord:
    """A promoted rare-structure record retained for exact follow-up."""

    candidate: Candidate
    rarity_score: float
    uniqueness_rating: str
    signal_score: float
    notes: dict[str, Any] = field(default_factory=dict)


@dataclass
class FrontierItem:
    """A retained candidate plus bookkeeping metadata."""

    candidate: Candidate
    scores: ScoreBundle
    retained_reason: str
    generation: int = 0


@dataclass
class VerificationRequest:
    """An exact-work request emitted by the frontier manager."""

    request_id: str
    candidate_id: str
    payload: dict[str, Any]
    backend: str


@dataclass
class VerificationResult:
    """The exact verifier's response."""

    request_id: str
    candidate_id: str
    status: str
    proof_artifact: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)
