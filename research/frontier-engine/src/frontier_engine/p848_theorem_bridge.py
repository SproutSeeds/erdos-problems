"""Canonical search-to-theorem bridge artifacts for Problem 848."""

from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any

from .artifacts import _serialize


ENGINE_ROOT = Path(__file__).resolve().parents[2]
PROJECT_ROOT = ENGINE_ROOT.parent.parent
PACK_ROOT = PROJECT_ROOT / "packs" / "number-theory" / "problems" / "848"
P848_ARTIFACT_ROOT = ENGINE_ROOT / "artifacts" / "p848-anchor-ladder"
EXPECTED_SHARED_PREFIX = (7, 32, 57, 82, 132, 182)

DEFAULT_BRIDGE_JSON_PATH = PACK_ROOT / "SEARCH_THEOREM_BRIDGE.json"
DEFAULT_BRIDGE_MD_PATH = PACK_ROOT / "SEARCH_THEOREM_BRIDGE.md"


def _load_json(path: Path) -> dict[str, Any] | None:
    """Load a JSON file when it exists and parses cleanly."""

    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def _manifest_evidence_score(path: Path) -> tuple[int, int, int, int, int, int, int, int, str] | None:
    """Score a p848 GPU manifest by theorem-relevant evidence strength."""

    manifest = _load_json(path)
    if manifest is None:
        return None
    summary = manifest.get("summary") or {}
    return (
        int(summary.get("known_failure_packet_count") or 0),
        int(summary.get("family_menu_count") or 0),
        int(summary.get("best_repaired_known_packets") or 0),
        int(summary.get("best_repaired_predicted_families") or 0),
        int(summary.get("best_effective_clean_through") or 0),
        int(summary.get("best_direct_clean_through") or 0),
        int(summary.get("candidates_evaluated") or 0),
        len(manifest.get("candidate_files") or []),
        str(path),
    )


def _latest_gpu_manifest_path(explicit_path: Path | None = None) -> Path | None:
    """Resolve the strongest available p848 GPU bundle manifest."""

    if explicit_path is not None:
        return explicit_path if explicit_path.exists() else None

    scored_manifests = [
        (score, manifest_path)
        for manifest_path in P848_ARTIFACT_ROOT.glob("p848_anchor_ladder-seeds-*/manifest.json")
        if (score := _manifest_evidence_score(manifest_path)) is not None
    ]
    return max(scored_manifests)[1] if scored_manifests else None


def _format_witness_token(prime: int, exponent: int) -> str:
    """Format one witness factor in the same style as the frontier notes."""

    if exponent == 2 and prime in {2, 3}:
        return str(prime**2)
    if exponent == 2:
        return f"{prime}^2"
    return f"{prime}^{exponent}"


def _packet_doc_for_failure(source_root: Path, failure_n: int) -> tuple[Path | None, dict[str, Any] | None]:
    """Locate the frozen packet document for one shared-prefix failure."""

    chunks_root = source_root / "chunks"
    if not chunks_root.exists():
        return None, None

    for packet_path in sorted(chunks_root.glob("six_anchor_frontier_after*/ANCHOR_FIRST_FAILURE_*.json")):
        doc = _load_json(packet_path)
        if doc is None:
            continue
        anchors = tuple(int(anchor) for anchor in doc.get("parameters", {}).get("anchors", []))
        if anchors != EXPECTED_SHARED_PREFIX:
            continue
        first_failure = doc.get("summary", {}).get("firstFailure")
        if isinstance(first_failure, int) and first_failure == failure_n:
            return packet_path, doc
    return None, None


def _packet_entry(
    *,
    source_root: Path,
    failure_n: int,
    seen_square_moduli: set[int],
) -> dict[str, Any]:
    """Build one packet-ledger row from the frozen live frontier."""

    packet_path, packet_doc = _packet_doc_for_failure(source_root, failure_n)
    crt_path = source_root / f"ANCHOR_SINGLETON_CRT_{failure_n}.json"
    crt_doc = _load_json(crt_path)

    obstruction_rows = list((packet_doc or {}).get("obstructionRows", []))
    tuple_tokens: list[str] = []
    square_moduli: list[int] = []

    for row in obstruction_rows:
        square_witnesses = list(row.get("squareWitnesses", []))
        if not square_witnesses:
            tuple_tokens.append("none")
            continue
        factor = square_witnesses[0]
        prime = int(factor["prime"])
        exponent = int(factor["exponent"])
        tuple_tokens.append(_format_witness_token(prime, exponent))
        for witness in square_witnesses:
            witness_prime = int(witness["prime"])
            witness_exponent = int(witness["exponent"])
            if witness_exponent >= 2:
                square_moduli.append(witness_prime * witness_prime)

    ordered_square_moduli: list[int] = []
    for modulus in square_moduli:
        if modulus not in ordered_square_moduli:
            ordered_square_moduli.append(modulus)

    new_square_moduli = [modulus for modulus in ordered_square_moduli if modulus not in seen_square_moduli]
    seen_square_moduli.update(ordered_square_moduli)

    return {
        "n": failure_n,
        "tuple_key": ", ".join(tuple_tokens) if tuple_tokens else None,
        "square_moduli": ordered_square_moduli,
        "new_square_moduli": new_square_moduli,
        "packet_path": str(packet_path) if packet_path is not None else None,
        "singleton_crt_path": str(crt_path) if crt_doc is not None else None,
        "singleton_crt_modulus": (
            int(crt_doc["modulus"])
            if crt_doc is not None and crt_doc.get("modulus") is not None
            else None
        ),
        "singleton_crt_residue": (
            int(crt_doc["residue"])
            if crt_doc is not None and crt_doc.get("residue") is not None
            else None
        ),
    }


def _build_packet_ledger(live_snapshot: dict[str, Any]) -> list[dict[str, Any]]:
    """Build the shared-prefix packet ledger from the live frontier snapshot."""

    source_root = Path(str(live_snapshot["source_root"]))
    seen_square_moduli: set[int] = set()
    ledger: list[dict[str, Any]] = []
    for failure_n in live_snapshot.get("shared_prefix_failure_ns", []):
        entry = _packet_entry(
            source_root=source_root,
            failure_n=int(failure_n),
            seen_square_moduli=seen_square_moduli,
        )
        if entry["packet_path"] is not None:
            ledger.append(entry)
    return ledger


def _display_path(value: str | None) -> str:
    """Render repo-local paths compactly in Markdown output."""

    if not value:
        return "-"
    path = Path(value)
    try:
        return str(path.relative_to(PROJECT_ROOT))
    except ValueError:
        return str(path)


def _tracked_tail_matrix(report: dict[str, Any]) -> list[dict[str, Any]]:
    """Build a stable continuation matrix from one p848 report."""

    rows: list[dict[str, Any]] = []
    for row in sorted(report.get("candidate_rows", []), key=lambda item: int(item["continuation"])):
        family_repairs = row.get("family_menu_repairs") or {}
        frontier_evidence = row.get("frontier_evidence") or {}
        observed = row.get("observed_frontier") or {}
        direct_scan = row.get("direct_scan") or {}
        rows.append(
            {
                "continuation": int(row["continuation"]),
                "observed_status": observed.get("status", "unseen"),
                "observed_clean_through": observed.get("clean_through"),
                "observed_first_failure": observed.get("first_failure_n"),
                "repaired_known_packets": int(row["repaired_known_packets"]),
                "missed_known_packets": len(row.get("missed_known_packets", [])),
                "repaired_known_family_count": family_repairs.get("repaired_known_family_count"),
                "repaired_predicted_family_count": family_repairs.get("repaired_predicted_family_count"),
                "first_missed_predicted_representatives": family_repairs.get(
                    "first_missed_predicted_representatives", []
                ),
                "effective_clean_through": frontier_evidence.get("effective_clean_through"),
                "effective_first_failure": frontier_evidence.get("effective_first_failure"),
                "extension_mode": frontier_evidence.get("extension_mode"),
                "direct_scan_performed": bool(direct_scan.get("performed")),
                "direct_scan_skipped": bool(direct_scan.get("skipped")),
                "plus50_alignment": bool(row.get("plus50_alignment")),
            }
        )
    return rows


def _leader_tie_class(candidate_files: list[dict[str, Any]]) -> list[int]:
    """Return the current tie class at the top of the GPU leaderboard."""

    if not candidate_files:
        return []
    best = candidate_files[0]
    return [
        int(row["continuation"])
        for row in candidate_files
        if int(row.get("repaired_known_packets", -1)) == int(best.get("repaired_known_packets", -2))
        and int(row.get("repaired_predicted_families", -1)) == int(best.get("repaired_predicted_families", -2))
        and int(row.get("effective_clean_through", -1)) == int(best.get("effective_clean_through", -2))
        and int(row.get("direct_clean_through", -1)) == int(best.get("direct_clean_through", -2))
    ]


def _find_known_tail_failure(
    report: dict[str, Any],
    *,
    tail: int,
) -> int | None:
    """Look up the known tail failure n for one continuation if present."""

    for packet in report.get("known_failure_packets", []):
        if packet.get("kind") == "tail_failure" and packet.get("tail") == tail:
            return int(packet["n"])
    return None


def _gpu_leaderboard(manifest: dict[str, Any] | None) -> list[dict[str, Any]]:
    """Normalize the latest GPU leaderboard summary."""

    if manifest is None:
        return []
    rows: list[dict[str, Any]] = []
    for row in manifest.get("candidate_files", []):
        rows.append(
            {
                "rank": int(row["rank"]),
                "continuation": int(row["continuation"]),
                "repaired_known_packets": int(row["repaired_known_packets"]),
                "repaired_predicted_families": int(row["repaired_predicted_families"]),
                "direct_clean_through": int(row["direct_clean_through"]),
                "effective_clean_through": int(row["effective_clean_through"]),
            }
        )
    return rows


def build_p848_theorem_bridge(
    *,
    report: dict[str, Any],
    gpu_manifest_path: Path | None = None,
) -> dict[str, Any]:
    """Build the canonical 848 search/theorem bridge artifact."""

    live_snapshot = report.get("live_frontier_snapshot") or {}
    family_menu_surface = report.get("family_menu_surface") or {}
    packet_ledger = _build_packet_ledger(live_snapshot) if live_snapshot else []
    tracked_tail_matrix = _tracked_tail_matrix(report)

    manifest_path = _latest_gpu_manifest_path(gpu_manifest_path)
    gpu_manifest = _load_json(manifest_path) if manifest_path is not None else None
    gpu_leaderboard = _gpu_leaderboard(gpu_manifest)
    tie_class = _leader_tie_class(gpu_leaderboard)
    gpu_leader = gpu_leaderboard[0] if gpu_leaderboard else None

    strongest_completed_tail = report.get("frozen_frontier", {})
    next_unmatched = family_menu_surface.get("next_unmatched")
    tail_282_failure = _find_known_tail_failure(report, tail=282)
    newest_modulus_events = [
        row for row in packet_ledger if row.get("new_square_moduli")
    ]

    bridge = {
        "schema": "frontier_engine.p848_search_theorem_bridge/1",
        "generated_at_utc": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "problem_id": "848",
        "shared_prefix": live_snapshot.get("shared_prefix", []),
        "sources": {
            "live_frontier_root": live_snapshot.get("source_root"),
            "family_menu_source_path": family_menu_surface.get("source_path"),
            "gpu_manifest_path": str(manifest_path) if manifest_path is not None else None,
        },
        "current_bridge_state": {
            "shared_prefix_failure_count": live_snapshot.get("shared_prefix_failure_count"),
            "latest_shared_prefix_failure": live_snapshot.get("latest_direct_failure"),
            "family_menu_count": family_menu_surface.get("family_count"),
            "known_family_matches": family_menu_surface.get("known_failure_matches"),
            "next_unmatched_representative": next_unmatched,
            "next_unmatched_matches_282_failure": (
                next_unmatched is not None
                and tail_282_failure is not None
                and int(next_unmatched) == int(tail_282_failure)
            ),
            "strongest_completed_structured_tail": {
                "continuation": strongest_completed_tail.get("current_best_continuation"),
                "clean_through": strongest_completed_tail.get("current_best_clean_through"),
            },
            "current_family_aware_leader": {
                "continuation": (
                    gpu_leader["continuation"]
                    if gpu_leader is not None
                    else report.get("summary", {}).get("best_continuation")
                ),
                "repaired_known_packets": (
                    gpu_leader["repaired_known_packets"]
                    if gpu_leader is not None
                    else report.get("summary", {}).get("best_repaired_known_packets")
                ),
                "repaired_predicted_families": (
                    gpu_leader["repaired_predicted_families"]
                    if gpu_leader is not None
                    else report.get("summary", {}).get("best_repaired_predicted_families")
                ),
                "effective_clean_through": (
                    gpu_leader["effective_clean_through"]
                    if gpu_leader is not None
                    else report.get("summary", {}).get("best_effective_clean_through")
                ),
            },
            "top_gpu_tie_class": tie_class,
            "recent_pool_expansion_moduli": [
                modulus
                for row in newest_modulus_events[-4:]
                for modulus in row.get("new_square_moduli", [])
            ],
        },
        "shared_prefix_packet_ledger": packet_ledger,
        "tracked_tail_matrix": tracked_tail_matrix,
        "gpu_leaderboard": gpu_leaderboard,
        "candidate_theorem_hooks": [
            {
                "hook_id": "next_unmatched_equals_282_failure",
                "status": (
                    "supported"
                    if (
                        next_unmatched is not None
                        and tail_282_failure is not None
                        and int(next_unmatched) == int(tail_282_failure)
                    )
                    else "not_yet_supported"
                ),
                "detail": "The next unmatched shared-prefix representative currently coincides with the known first failure of the 282 continuation.",
            },
            {
                "hook_id": "completed_tail_vs_search_leader_split",
                "status": "supported",
                "detail": "The strongest completed structured tail remains 332, while the current family-aware search leader can move on the finite tested window.",
            },
            {
                "hook_id": "repair_pool_not_closed",
                "status": ("supported" if newest_modulus_events else "unclear"),
                "detail": "Recent shared-prefix packets introduced new square moduli into the live family menu, so the repaired local square pool is not yet closed.",
            },
            {
                "hook_id": "top_repair_class_cluster",
                "status": ("supported" if len(tie_class) >= 2 else "weak"),
                "detail": "The current top continuation class shares the same repaired-known, repaired-predicted, and tested-clean-through profile on the live finite window.",
            },
        ],
    }
    return bridge


def _bridge_markdown(doc: dict[str, Any]) -> str:
    """Render the search/theorem bridge as a compact Markdown note."""

    current = doc["current_bridge_state"]
    strongest = current["strongest_completed_structured_tail"]
    leader = current["current_family_aware_leader"]
    packet_rows = doc["shared_prefix_packet_ledger"]
    recent_packets = packet_rows[-6:] if len(packet_rows) > 6 else packet_rows
    tracked_rows = doc["tracked_tail_matrix"]
    gpu_rows = doc["gpu_leaderboard"][:5]
    hooks = doc["candidate_theorem_hooks"]

    lines = [
        "# Problem 848 Search-Theorem Bridge",
        "",
        "This note is the canonical bridge between the live `frontier-engine` search lane and the theorem-facing `erdos-problems` pack.",
        "",
        "## Current state",
        "",
        f"- Shared-prefix failures frozen: `{current['shared_prefix_failure_count']}` through `{current['latest_shared_prefix_failure']}`.",
        f"- Current family menu: `{_display_path(doc['sources']['family_menu_source_path'])}` with `{current['family_menu_count']}` rows and `{current['known_family_matches']}` matched known-family rows.",
        f"- Strongest completed structured tail: `{strongest['continuation']}` clean through `{strongest['clean_through']}`.",
        f"- Current family-aware leader on the tested window: `{leader['continuation']}` with `{leader['repaired_known_packets']}` repaired known packets and `{leader['repaired_predicted_families']}` repaired predicted-family rows.",
        f"- Next unmatched representative: `{current['next_unmatched_representative']}`.",
        f"- `282` tail alignment: `{'matches' if current['next_unmatched_matches_282_failure'] else 'does not match'}` the next unmatched representative.",
        f"- Current top GPU tie class: `{', '.join(str(value) for value in current['top_gpu_tie_class']) if current['top_gpu_tie_class'] else 'none'}`.",
        "",
        "## Recent Packet Ledger",
        "",
        "| n | Tuple | New Square Moduli | CRT Modulus |",
        "| --- | --- | --- | --- |",
    ]
    for row in recent_packets:
        new_moduli = ", ".join(str(value) for value in row["new_square_moduli"]) or "-"
        crt_modulus = str(row["singleton_crt_modulus"]) if row["singleton_crt_modulus"] is not None else "-"
        lines.append(f"| `{row['n']}` | `{row['tuple_key']}` | `{new_moduli}` | `{crt_modulus}` |")

    lines.extend(
        [
            "",
            "## Tracked Tail Matrix",
            "",
            "| Tail | Known Packets | Predicted Families | Effective Clean Through | Observed Status |",
            "| --- | --- | --- | --- | --- |",
        ]
    )
    for row in tracked_rows:
        lines.append(
            f"| `{row['continuation']}` | `{row['repaired_known_packets']}` | "
            f"`{row['repaired_predicted_family_count']}` | `{row['effective_clean_through']}` | "
            f"`{row['observed_status']}` |"
        )

    lines.extend(
        [
            "",
            "## GPU Leaderboard",
            "",
            "| Rank | Tail | Known Packets | Predicted Families | Effective Clean Through |",
            "| --- | --- | --- | --- | --- |",
        ]
    )
    for row in gpu_rows:
        lines.append(
            f"| `{row['rank']}` | `{row['continuation']}` | `{row['repaired_known_packets']}` | "
            f"`{row['repaired_predicted_families']}` | `{row['effective_clean_through']}` |"
        )

    lines.extend(["", "## Theorem Hooks", ""])
    for hook in hooks:
        lines.append(f"- `{hook['hook_id']}`: {hook['status']} | {hook['detail']}")

    lines.extend(
        [
            "",
            "## Refresh",
            "",
            "```bash",
            "python3 research/frontier-engine/src/frontier_engine/cli.py export-p848-theorem-bridge",
            "```",
            "",
        ]
    )
    return "\n".join(lines)


def write_p848_theorem_bridge(
    *,
    report: dict[str, Any],
    output_json_path: Path,
    output_md_path: Path,
    gpu_manifest_path: Path | None = None,
) -> dict[str, Path]:
    """Write the canonical search/theorem bridge artifacts for Problem 848."""

    doc = build_p848_theorem_bridge(report=report, gpu_manifest_path=gpu_manifest_path)
    output_json_path.parent.mkdir(parents=True, exist_ok=True)
    output_md_path.parent.mkdir(parents=True, exist_ok=True)
    output_json_path.write_text(json.dumps(_serialize(doc), indent=2) + "\n", encoding="utf-8")
    output_md_path.write_text(_bridge_markdown(doc), encoding="utf-8")
    return {
        "json_path": output_json_path,
        "md_path": output_md_path,
    }
