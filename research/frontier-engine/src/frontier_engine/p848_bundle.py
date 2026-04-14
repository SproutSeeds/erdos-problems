"""Artifact export for the Problem 848 anchor ladder lane."""

from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any

from .artifacts import _serialize


def write_p848_anchor_seed_bundle(
    *,
    report: dict[str, Any],
    output_dir: Path,
    top_k: int,
) -> Path:
    """Write the top continuation candidates as a portable bundle."""

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    bundle_dir = output_dir / f"p848_anchor_ladder-seeds-{timestamp}"
    bundle_dir.mkdir(parents=True, exist_ok=True)

    rows = list(report.get("top_candidates", []))[:top_k]
    candidate_files: list[dict[str, Any]] = []

    for rank, row in enumerate(rows, start=1):
        continuation = int(row["continuation"])
        filename = f"rank-{rank:02d}-tail-{continuation}.json"
        path = bundle_dir / filename
        doc = {
            "schema": "frontier_engine.p848_anchor_tail_seed/1",
            "lane_id": "p848_anchor_ladder",
            "problem_id": "848",
            "prefix_anchors": row["prefix_anchors"],
            "continuation": continuation,
            "all_anchors": row["all_anchors"],
            "repaired_known_packets": row["repaired_known_packets"],
            "known_packet_repairs": row["known_packet_repairs"],
            "missed_known_packets": row["missed_known_packets"],
            "family_menu_repairs": row.get("family_menu_repairs"),
            "direct_scan": row["direct_scan"],
            "observed_frontier": row.get("observed_frontier"),
            "frontier_evidence": row.get("frontier_evidence"),
            "plus50_alignment": row["plus50_alignment"],
            "tail_step_from_182": row["tail_step_from_182"],
        }
        path.write_text(json.dumps(_serialize(doc), indent=2) + "\n", encoding="utf-8")
        candidate_files.append(
            {
                "rank": rank,
                "continuation": continuation,
                "file": filename,
                "repaired_known_packets": row["repaired_known_packets"],
                "repaired_predicted_families": (
                    (row.get("family_menu_repairs") or {}).get("repaired_predicted_family_count")
                ),
                "direct_clean_through": row["direct_scan"]["clean_through"],
                "effective_clean_through": row["frontier_evidence"]["effective_clean_through"],
            }
        )

    manifest = {
        "bundle_version": 1,
        "bundle_kind": "anchor_tail_seed_bundle",
        "lane": {
            "lane_id": "p848_anchor_ladder",
            "problem_id": "848",
        },
        "search_profile": report.get("search_profile"),
        "summary": report["summary"],
        "candidate_generation": report.get("candidate_generation", {}),
        "backend_metadata": report.get("backend_metadata", {}),
        "live_frontier_snapshot": report.get("live_frontier_snapshot"),
        "family_menu_surface": report.get("family_menu_surface"),
        "known_failure_packets": report["known_failure_packets"],
        "observed_continuations": report.get("observed_continuations", []),
        "candidate_files": candidate_files,
    }
    (bundle_dir / "manifest.json").write_text(
        json.dumps(_serialize(manifest), indent=2) + "\n",
        encoding="utf-8",
    )
    return bundle_dir
