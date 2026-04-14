"""Prototype package scaffold for frontier-engine."""

from .contracts import Candidate, FrontierItem, InventoryRecord, ScoreBundle, VerificationRequest, VerificationResult
from .lanes import LaneSpec, get_lane_spec, list_lane_specs
from .pipeline import FrontierPipeline
from .runtime import RuntimeProbe, probe_runtime

__all__ = [
    "Candidate",
    "FrontierItem",
    "FrontierPipeline",
    "InventoryRecord",
    "LaneSpec",
    "RuntimeProbe",
    "ScoreBundle",
    "VerificationRequest",
    "VerificationResult",
    "get_lane_spec",
    "list_lane_specs",
    "probe_runtime",
]
