"""Lane registry for frontier-engine."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any


@dataclass
class LaneSpec:
    """A named search lane that frontier-engine can support."""

    lane_id: str
    problem_id: str
    family: str
    route_posture: str
    search_objective: str
    candidate_shape: str
    finite_gap: str
    primary_hardware_profile: str
    artifact_kind: str
    status: str
    experiment_dir: str
    evidence_paths: list[str] = field(default_factory=list)
    frontier_summary: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


REPO_ROOT = Path(__file__).resolve().parents[2]


LANE_REGISTRY = {
    "m8_sat_rail": LaneSpec(
        lane_id="m8_sat_rail",
        problem_id="857",
        family="sunflower",
        route_posture="exactness_reduction",
        search_objective="Reduce the exact M(8,3) target-46 frontier before exact solving.",
        candidate_shape="size-46 family on [8]",
        finite_gap="sunflower_triple_count",
        primary_hardware_profile="windows_rtx4090",
        artifact_kind="m8_sat_seed_bundle",
        status="active_proving_ground",
        experiment_dir=str(REPO_ROOT / "experiments" / "m8-sat-rail"),
        evidence_paths=[
            str(REPO_ROOT / "experiments" / "m8-sat-rail" / "README.md"),
            str(REPO_ROOT / "experiments" / "m8-sat-rail" / "reference_m8_lower_bound_45.json"),
        ],
        frontier_summary={
            "current_best_observed_sunflower_triple_count": 3,
            "default_warm_start": "known_m8_lb45",
        },
    ),
    "p848_anchor_ladder": LaneSpec(
        lane_id="p848_anchor_ladder",
        problem_id="848",
        family="number_theory",
        route_posture="finite_check_gap_closure",
        search_objective=(
            "Extend the +50 repair ladder and determine whether recurring repairs arise "
            "from a stable structural obstruction menu."
        ),
        candidate_shape="structured tail continuation {7,32,57,82,132,182,t}",
        finite_gap="maximize direct_clean_through and explained_packet_repairs",
        primary_hardware_profile="windows_rtx4090",
        artifact_kind="anchor_tail_seed_bundle",
        status="runnable_cpu_prototype",
        experiment_dir=str(REPO_ROOT / "experiments" / "p848-anchor-ladder"),
        evidence_paths=[
            str(REPO_ROOT / "experiments" / "p848-anchor-ladder" / "README.md"),
            "/tmp/erdos-problems-848-frontier/packs/number-theory/problems/848/ANCHOR_TAIL_COMPARISON_157_232_282.md",
            "/tmp/erdos-problems-848-frontier/packs/number-theory/problems/848/ANCHOR_332_TAIL_OVERTAKE_LEDGER.md",
            "/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/FRONTIER_NOTE.md",
        ],
        frontier_summary={
            "shared_prefix": [7, 32, 57, 82, 132, 182],
            "known_ladder": {
                "157": {"status": "fails", "first_failure_n": 19094395},
                "232": {"status": "fails", "first_failure_n": 27949928},
                "282": {"status": "fails", "first_failure_n": 137720141},
                "332": {"status": "clean_through", "direct_clean_through": 250000000},
            },
            "current_best_continuation": 332,
            "default_direct_window": [250000001, 250020000],
        },
    ),
}


def list_lane_specs() -> list[LaneSpec]:
    """Return all configured lane specifications."""

    return [LANE_REGISTRY[key] for key in sorted(LANE_REGISTRY)]


def get_lane_spec(lane_id: str) -> LaneSpec:
    """Return one lane specification by id."""

    try:
        return LANE_REGISTRY[lane_id]
    except KeyError as exc:
        raise KeyError(f"unknown lane: {lane_id}") from exc
