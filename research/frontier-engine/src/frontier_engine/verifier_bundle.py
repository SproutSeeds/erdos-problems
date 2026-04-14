"""Bundle exporters for SAT-facing seed families."""

from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any

from .artifacts import _serialize


def write_m8_sat_seed_bundle(
    *,
    report: dict[str, Any],
    output_dir: Path,
    benchmark: dict[str, Any],
    top_k: int = 8,
) -> Path:
    """Write a seed bundle for SAT-facing follow-up on elite families."""

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    bundle_dir = output_dir / f"{benchmark['benchmark_id']}-sat-seeds-{timestamp}"
    bundle_dir.mkdir(parents=True, exist_ok=True)

    records = list(report.get("inventory_records", []))[:top_k]
    seed_files: list[dict[str, Any]] = []

    for rank, record in enumerate(records, start=1):
        candidate = record.candidate
        payload = candidate.payload
        filename = f"rank-{rank:02d}-{candidate.candidate_id}.json"
        path = bundle_dir / filename
        doc = {
            "schema": "frontier_engine.m8_sat_seed/1",
            "problem_id": benchmark.get("problem_id"),
            "benchmark_id": benchmark["benchmark_id"],
            "n": payload["n"],
            "k": payload["k"],
            "family_size": payload["target_family_size"],
            "family": payload["family_masks"],
            "candidate_id": candidate.candidate_id,
            "source": "frontier-engine",
            "observed_sunflower_triple_count": payload["sunflower_triple_count"],
            "motif_signature": payload["motif_signature"],
            "signal_score": payload["signal_score"],
            "rarity_score": record.rarity_score,
            "uniqueness_rating": record.uniqueness_rating,
        }
        path.write_text(json.dumps(_serialize(doc), indent=2) + "\n", encoding="utf-8")
        seed_files.append(
            {
                "rank": rank,
                "candidate_id": candidate.candidate_id,
                "file": filename,
                "observed_sunflower_triple_count": payload["sunflower_triple_count"],
            }
        )

    manifest = {
        "bundle_version": 1,
        "bundle_kind": "m8_sat_seed_bundle",
        "benchmark": benchmark,
        "summary": report["summary"],
        "generator_metadata": report.get("generator_metadata", {}),
        "seed_files": seed_files,
    }
    (bundle_dir / "manifest.json").write_text(
        json.dumps(_serialize(manifest), indent=2) + "\n",
        encoding="utf-8",
    )
    return bundle_dir
