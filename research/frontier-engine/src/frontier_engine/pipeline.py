"""Prototype search pipeline for frontier-engine."""

from __future__ import annotations

from dataclasses import dataclass, field

from .frontier import FrontierManager
from .generator import CandidateGenerator
from .inventory import InventoryManager
from .m8_search import M8SatRailAdaptiveSampler
from .rarity import RarityScorer
from .surrogate import SurrogateModel
from .verifier import SatSeedBundleVerifier


@dataclass
class FrontierPipeline:
    """Prototype orchestrator for sample -> classify -> inventory -> verify."""

    generator: CandidateGenerator = field(default_factory=M8SatRailAdaptiveSampler)
    surrogate: SurrogateModel = field(default_factory=RarityScorer)
    inventory: InventoryManager = field(default_factory=InventoryManager)
    frontier: FrontierManager = field(default_factory=FrontierManager)
    verifier: SatSeedBundleVerifier = field(default_factory=SatSeedBundleVerifier)

    def run_once_report(self) -> dict[str, object]:
        candidates = self.generator.generate()
        scores = self.surrogate.score(candidates)
        inventory_records = self.inventory.collect(candidates, scores)
        items = self.frontier.retain_inventory(inventory_records)
        requests = self.verifier.build_requests(items)
        results = self.verifier.verify(requests)

        top_signatures = [record.notes.get("signature") for record in inventory_records[:3]]
        top_ratings = [record.uniqueness_rating for record in inventory_records[:3]]
        best_violation_count = None
        if inventory_records:
            best_violation_count = min(
                int(record.notes.get("sunflower_triple_count", 0)) for record in inventory_records
            )

        summary = {
            "candidates": len(candidates),
            "inventory_records": len(inventory_records),
            "frontier_items": len(items),
            "verification_requests": len(requests),
            "verification_results": len(results),
            "best_sunflower_triple_count": best_violation_count,
            "top_signatures": top_signatures,
            "top_ratings": top_ratings,
        }

        return {
            "summary": summary,
            "candidates": candidates,
            "scores": scores,
            "inventory_records": inventory_records,
            "frontier_items": items,
            "verification_requests": requests,
            "verification_results": results,
            "generator_metadata": getattr(self.generator, "last_run_metadata", {}),
        }

    def run_once(self) -> dict[str, object]:
        return dict(self.run_once_report()["summary"])
