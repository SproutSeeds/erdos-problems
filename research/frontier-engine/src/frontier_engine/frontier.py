"""Frontier management for frontier-engine."""

from __future__ import annotations

from .contracts import Candidate, FrontierItem, InventoryRecord, ScoreBundle


class FrontierManager:
    """Retain a small, explicit frontier instead of a raw candidate heap."""

    def retain(self, candidates: list[Candidate], scores: list[ScoreBundle]) -> list[FrontierItem]:
        items: list[FrontierItem] = []
        score_lookup = {score.candidate_id: score for score in scores}

        for candidate in candidates:
            score = score_lookup[candidate.candidate_id]
            items.append(
                FrontierItem(
                    candidate=candidate,
                    scores=score,
                    retained_reason="prototype_frontier",
                )
            )

        items.sort(key=lambda item: item.scores.promise, reverse=True)
        return items

    def retain_inventory(self, records: list[InventoryRecord]) -> list[FrontierItem]:
        """Promote elite inventory items into frontier items for exact follow-up."""

        items = [
            FrontierItem(
                candidate=record.candidate,
                scores=ScoreBundle(
                    candidate_id=record.candidate.candidate_id,
                    promise=float(record.notes.get("promise", record.rarity_score)),
                    rarity=record.rarity_score,
                    metadata={
                        "inventory": True,
                        "uniqueness_rating": record.uniqueness_rating,
                        "signal_score": record.signal_score,
                    },
                ),
                retained_reason="rare_structure_inventory",
            )
            for record in records
        ]
        items.sort(key=lambda item: item.scores.promise, reverse=True)
        return items
