"""Rarity and uniqueness scoring for prototype frontier-engine."""

from __future__ import annotations

from collections import Counter
import math

from .contracts import Candidate, ScoreBundle
from .surrogate import SurrogateModel


def uniqueness_label(rarity_score: float) -> str:
    """Map a rarity score to a simple prototype label."""

    if rarity_score >= 1.5:
        return "ultra_rare"
    if rarity_score >= 1.0:
        return "rare"
    if rarity_score >= 0.6:
        return "uncommon"
    return "common"


class RarityScorer(SurrogateModel):
    """Score candidates by stream-relative rarity and signal."""

    def score(self, candidates: list[Candidate]) -> list[ScoreBundle]:
        signatures = [candidate.payload["motif_signature"] for candidate in candidates]
        counts = Counter(signatures)

        bundles: list[ScoreBundle] = []
        for candidate in candidates:
            signature = candidate.payload["motif_signature"]
            count = counts[signature]
            rarity = 1.0 / float(count)
            signal_score = float(candidate.payload.get("signal_score", 0.0))
            sunflower_violations = int(candidate.payload.get("sunflower_triple_count", 0))
            feasibility = math.exp(-sunflower_violations / 250.0)
            promise = (1.4 * rarity) + (1.6 * feasibility) + signal_score

            bundles.append(
                ScoreBundle(
                    candidate_id=candidate.candidate_id,
                    promise=promise,
                    rarity=rarity,
                    metadata={
                        "signature": signature,
                        "signature_count": count,
                        "signal_score": signal_score,
                        "sunflower_triple_count": sunflower_violations,
                        "feasibility_score": feasibility,
                        "uniqueness_rating": uniqueness_label(rarity),
                    },
                )
            )

        return bundles
