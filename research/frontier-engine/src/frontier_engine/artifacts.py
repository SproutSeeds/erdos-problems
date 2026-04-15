"""Artifact serialization for benchmark search runs."""

from __future__ import annotations

from dataclasses import asdict, is_dataclass
from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any


def _serialize(value: Any) -> Any:
    """Convert dataclasses and paths into JSON-safe structures."""

    if is_dataclass(value):
        return _serialize(asdict(value))
    if isinstance(value, dict):
        return {str(key): _serialize(item) for key, item in value.items()}
    if isinstance(value, list):
        return [_serialize(item) for item in value]
    if isinstance(value, tuple):
        return [_serialize(item) for item in value]
    if isinstance(value, Path):
        return str(value)
    return value


def write_run_artifact(
    *,
    report: dict[str, Any],
    output_dir: Path,
    benchmark: dict[str, Any],
    hardware: dict[str, Any],
) -> Path:
    """Write a portable JSON artifact for a benchmark search run."""

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    run_id = f"{benchmark['benchmark_id']}-{timestamp}"
    output_dir.mkdir(parents=True, exist_ok=True)
    artifact_path = output_dir / f"{run_id}.json"

    artifact = {
        "artifact_version": 1,
        "run_id": run_id,
        "created_at_utc": timestamp,
        "benchmark": benchmark,
        "hardware_profile": hardware,
        "summary": report["summary"],
        "generator_metadata": report.get("generator_metadata", {}),
        "elite_inventory": report.get("inventory_records", []),
        "frontier_items": report.get("frontier_items", []),
        "verification_requests": report.get("verification_requests", []),
        "verification_results": report.get("verification_results", []),
    }

    artifact_path.write_text(json.dumps(_serialize(artifact), indent=2) + "\n", encoding="utf-8")
    return artifact_path
