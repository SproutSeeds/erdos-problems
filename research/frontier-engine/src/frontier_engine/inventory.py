"""Rare-structure inventory for prototype frontier-engine."""

from __future__ import annotations

from .contracts import Candidate, InventoryRecord, ScoreBundle


class InventoryManager:
    """Retain only the rarest and strongest structures from a stream."""

    def __init__(self, limit: int = 8) -> None:
        self.limit = limit

    def collect(self, candidates: list[Candidate], scores: list[ScoreBundle]) -> list[InventoryRecord]:
        score_lookup = {score.candidate_id: score for score in scores}
        records: list[InventoryRecord] = []

        for candidate in candidates:
            score = score_lookup[candidate.candidate_id]
            records.append(
                InventoryRecord(
                    candidate=candidate,
                    rarity_score=float(score.rarity or 0.0),
                    uniqueness_rating=str(score.metadata.get("uniqueness_rating", "unknown")),
                    signal_score=float(score.metadata.get("signal_score", 0.0)),
                    notes={
                        "promise": score.promise,
                        "signature": score.metadata.get("signature"),
                        "signature_count": score.metadata.get("signature_count"),
                        "sunflower_triple_count": score.metadata.get("sunflower_triple_count"),
                        "feasibility_score": score.metadata.get("feasibility_score"),
                    },
                )
            )

        records.sort(
            key=lambda record: (
                float(record.notes.get("feasibility_score", 0.0)),
                record.rarity_score,
                record.signal_score,
            ),
            reverse=True,
        )
        return records[: self.limit]
