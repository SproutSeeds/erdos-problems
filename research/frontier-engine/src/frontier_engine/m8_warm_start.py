"""Warm-start helpers for the M(8,3) benchmark rail."""

from __future__ import annotations

from dataclasses import asdict, dataclass
import json
from pathlib import Path
from typing import Any

from .benchmarks.m8_sat_rail import ALL_MASKS, TARGET_FAMILY_SIZE, build_candidate


REPO_ROOT = Path(__file__).resolve().parents[2]
REFERENCE_FAMILY_PATH = (
    REPO_ROOT / "experiments" / "m8-sat-rail" / "reference_m8_lower_bound_45.json"
)


@dataclass
class WarmStartBundle:
    """Warm-start families plus the metadata needed to explain them."""

    families: list[tuple[int, ...]]
    metadata: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return {
            "families": [list(family) for family in self.families],
            "metadata": self.metadata,
        }


def build_warm_start_bundle(mode: str, count: int) -> WarmStartBundle:
    """Return warm-start families for the requested mode."""

    if mode == "none" or count <= 0:
        return WarmStartBundle(
            families=[],
            metadata={"mode": "none", "seed_count": 0},
        )
    if mode != "known_m8_lb45":
        raise ValueError(f"unknown warm-start mode: {mode}")

    reference_doc = json.loads(REFERENCE_FAMILY_PATH.read_text(encoding="utf-8"))
    base_family = tuple(sorted(int(mask) for mask in reference_doc["family"]))
    if len(base_family) != 45:
        raise ValueError("reference warm-start family must contain 45 masks")

    candidates: list[tuple[int, int, float, tuple[int, ...]]] = []
    base_set = set(base_family)
    for add_mask in ALL_MASKS:
        if add_mask in base_set:
            continue
        family = tuple(sorted(base_set | {add_mask}))
        if len(family) != TARGET_FAMILY_SIZE:
            raise ValueError("augmented warm-start family must contain 46 masks")
        candidate = build_candidate(f"warm-start-{add_mask}", list(family))
        candidates.append(
            (
                int(candidate.payload["sunflower_triple_count"]),
                int(add_mask),
                -float(candidate.payload["signal_score"]),
                family,
            )
        )

    candidates.sort()
    selected = candidates[:count]
    families = [family for _, _, _, family in selected]
    top_additions = [
        {
            "added_mask": add_mask,
            "sunflower_triple_count": violations,
        }
        for violations, add_mask, _, _ in selected[:10]
    ]

    return WarmStartBundle(
        families=families,
        metadata={
            "mode": mode,
            "reference_family_path": str(REFERENCE_FAMILY_PATH),
            "reference_family_size": len(base_family),
            "seed_count": len(families),
            "best_observed_sunflower_triple_count": selected[0][0] if selected else None,
            "top_additions": top_additions,
            "provenance": reference_doc.get("provenance", {}),
        },
    )
