"""CLI entrypoint for the frontier-engine prototype."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

if __package__ in {None, ""}:
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
    from frontier_engine.artifacts import write_run_artifact
    from frontier_engine.lanes import get_lane_spec, list_lane_specs
    from frontier_engine.m8_search import M8SatRailAdaptiveSampler, M8SearchConfig
    from frontier_engine.p848_anchor_search import (
        P848SearchConfig,
        load_live_p848_frontier_snapshot,
        load_p848_search_profile,
        parse_candidate_csv,
        parse_int_csv,
        run_p848_anchor_search,
    )
    from frontier_engine.p848_bundle import write_p848_anchor_seed_bundle
    from frontier_engine.p848_theorem_bridge import write_p848_theorem_bridge
    from frontier_engine.pipeline import FrontierPipeline
    from frontier_engine.plans import PRIMARY_BENCHMARK, PRIMARY_HARDWARE, PRIMARY_SEARCH_PROFILE
    from frontier_engine.runtime import probe_runtime
    from frontier_engine.verifier_bundle import write_m8_sat_seed_bundle
else:
    from .artifacts import write_run_artifact
    from .lanes import get_lane_spec, list_lane_specs
    from .m8_search import M8SatRailAdaptiveSampler, M8SearchConfig
    from .p848_anchor_search import (
        P848SearchConfig,
        load_live_p848_frontier_snapshot,
        load_p848_search_profile,
        parse_candidate_csv,
        parse_int_csv,
        run_p848_anchor_search,
    )
    from .p848_bundle import write_p848_anchor_seed_bundle
    from .p848_theorem_bridge import write_p848_theorem_bridge
    from .pipeline import FrontierPipeline
    from .plans import PRIMARY_BENCHMARK, PRIMARY_HARDWARE, PRIMARY_SEARCH_PROFILE
    from .runtime import probe_runtime
    from .verifier_bundle import write_m8_sat_seed_bundle


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="frontier-engine")
    subparsers = parser.add_subparsers(dest="command", required=True)

    for command in ("status", "vision", "benchmark-plan", "runtime-probe", "p848-live-frontier"):
        subparsers.add_parser(command)

    list_lanes_parser = subparsers.add_parser("list-lanes")
    list_lanes_parser.add_argument("--json", action="store_true", dest="as_json")

    show_lane_parser = subparsers.add_parser("show-lane")
    show_lane_parser.add_argument("lane_id")
    show_lane_parser.add_argument("--json", action="store_true", dest="as_json")

    p848_run_profile_parser = subparsers.add_parser("p848-run-profile")
    p848_run_profile_parser.add_argument("profile_file")

    p848_export_profile_parser = subparsers.add_parser("export-p848-profile-bundle")
    p848_export_profile_parser.add_argument("profile_file")

    p848_run_parser = subparsers.add_parser("p848-run")
    p848_run_parser.add_argument(
        "--prefix-anchors",
        default="7,32,57,82,132,182",
        help="Comma-separated shared prefix anchors.",
    )
    p848_run_parser.add_argument(
        "--candidates",
        default="157,232,282,332,382,432",
        help="Comma-separated continuation candidates.",
    )
    p848_run_parser.add_argument(
        "--candidate-mode",
        choices=["explicit", "hybrid", "ladder-sweep"],
        default="explicit",
        help="Use explicit candidates, a generated ladder sweep, or both.",
    )
    p848_run_parser.add_argument(
        "--base-tail",
        type=int,
        help="Base continuation for generated ladder sweeps. Defaults to the current best observed tail.",
    )
    p848_run_parser.add_argument(
        "--ladder-step",
        type=int,
        default=50,
        help="Step size for generated ladder continuations.",
    )
    p848_run_parser.add_argument(
        "--ladder-rounds",
        type=int,
        default=0,
        help="Number of forward ladder steps to generate from the base tail.",
    )
    p848_run_parser.add_argument(
        "--perturb-offsets",
        default="0",
        help="Comma-separated offsets added around each generated ladder center.",
    )
    p848_run_parser.add_argument(
        "--runtime",
        choices=["auto", "python", "torch"],
        default="auto",
        help="Backend runtime for the p848 lane.",
    )
    p848_run_parser.add_argument(
        "--device",
        choices=["auto", "cpu", "cuda"],
        default="auto",
        help="Requested device for the selected p848 runtime.",
    )
    p848_run_parser.add_argument(
        "--n-chunk-size",
        type=int,
        default=2048,
        help="How many n values to scan per batched backend chunk.",
    )
    p848_run_parser.add_argument(
        "--value-chunk-size",
        type=int,
        default=32768,
        help="How many candidate values to squarefree-test per backend chunk.",
    )
    p848_run_parser.add_argument(
        "--prime-square-chunk-size",
        type=int,
        default=128,
        help="How many prime squares to test per squarefree subchunk.",
    )
    p848_run_parser.add_argument(
        "--direct-threshold",
        type=int,
        default=250000001,
        help="Direct scan threshold for candidate tails.",
    )
    p848_run_parser.add_argument(
        "--direct-max",
        type=int,
        default=250020000,
        help="Direct scan maximum for candidate tails.",
    )
    p848_run_parser.add_argument("--top-k", type=int, default=8)

    p848_export_parser = subparsers.add_parser("export-p848-bundle")
    p848_export_parser.add_argument(
        "--prefix-anchors",
        default="7,32,57,82,132,182",
        help="Comma-separated shared prefix anchors.",
    )
    p848_export_parser.add_argument(
        "--candidates",
        default="157,232,282,332,382,432",
        help="Comma-separated continuation candidates.",
    )
    p848_export_parser.add_argument(
        "--candidate-mode",
        choices=["explicit", "hybrid", "ladder-sweep"],
        default="explicit",
        help="Use explicit candidates, a generated ladder sweep, or both.",
    )
    p848_export_parser.add_argument(
        "--base-tail",
        type=int,
        help="Base continuation for generated ladder sweeps. Defaults to the current best observed tail.",
    )
    p848_export_parser.add_argument(
        "--ladder-step",
        type=int,
        default=50,
        help="Step size for generated ladder continuations.",
    )
    p848_export_parser.add_argument(
        "--ladder-rounds",
        type=int,
        default=0,
        help="Number of forward ladder steps to generate from the base tail.",
    )
    p848_export_parser.add_argument(
        "--perturb-offsets",
        default="0",
        help="Comma-separated offsets added around each generated ladder center.",
    )
    p848_export_parser.add_argument(
        "--runtime",
        choices=["auto", "python", "torch"],
        default="auto",
        help="Backend runtime for the p848 lane.",
    )
    p848_export_parser.add_argument(
        "--device",
        choices=["auto", "cpu", "cuda"],
        default="auto",
        help="Requested device for the selected p848 runtime.",
    )
    p848_export_parser.add_argument(
        "--n-chunk-size",
        type=int,
        default=2048,
        help="How many n values to scan per batched backend chunk.",
    )
    p848_export_parser.add_argument(
        "--value-chunk-size",
        type=int,
        default=32768,
        help="How many candidate values to squarefree-test per backend chunk.",
    )
    p848_export_parser.add_argument(
        "--prime-square-chunk-size",
        type=int,
        default=128,
        help="How many prime squares to test per squarefree subchunk.",
    )
    p848_export_parser.add_argument(
        "--direct-threshold",
        type=int,
        default=250000001,
        help="Direct scan threshold for candidate tails.",
    )
    p848_export_parser.add_argument(
        "--direct-max",
        type=int,
        default=250020000,
        help="Direct scan maximum for candidate tails.",
    )
    p848_export_parser.add_argument("--top-k", type=int, default=8)
    p848_export_parser.add_argument(
        "--output-dir",
        default="research/frontier-engine/artifacts/p848-anchor-ladder",
        help="Directory for exported p848 seed bundles.",
    )

    p848_bridge_parser = subparsers.add_parser("export-p848-theorem-bridge")
    p848_bridge_parser.add_argument(
        "--prefix-anchors",
        default="7,32,57,82,132,182",
        help="Comma-separated shared prefix anchors.",
    )
    p848_bridge_parser.add_argument(
        "--candidates",
        default="157,232,282,332,382,432,782,832",
        help="Comma-separated continuation tails for the theorem bridge matrix.",
    )
    p848_bridge_parser.add_argument(
        "--runtime",
        choices=["auto", "python", "torch"],
        default="python",
        help="Backend runtime used to build the tracked-tail matrix.",
    )
    p848_bridge_parser.add_argument(
        "--device",
        choices=["auto", "cpu", "cuda"],
        default="auto",
        help="Requested device for the theorem-bridge tracked-tail run.",
    )
    p848_bridge_parser.add_argument(
        "--n-chunk-size",
        type=int,
        default=2048,
        help="How many n values to scan per batched backend chunk.",
    )
    p848_bridge_parser.add_argument(
        "--value-chunk-size",
        type=int,
        default=32768,
        help="How many candidate values to squarefree-test per backend chunk.",
    )
    p848_bridge_parser.add_argument(
        "--prime-square-chunk-size",
        type=int,
        default=128,
        help="How many prime squares to test per squarefree subchunk.",
    )
    p848_bridge_parser.add_argument(
        "--direct-threshold",
        type=int,
        default=250000001,
        help="Direct scan threshold for tracked tails.",
    )
    p848_bridge_parser.add_argument(
        "--direct-max",
        type=int,
        default=250050000,
        help="Direct scan maximum for tracked tails.",
    )
    p848_bridge_parser.add_argument("--top-k", type=int, default=8)
    p848_bridge_parser.add_argument(
        "--output-json",
        default="packs/number-theory/problems/848/SEARCH_THEOREM_BRIDGE.json",
        help="Destination JSON file in the canonical 848 pack.",
    )
    p848_bridge_parser.add_argument(
        "--output-md",
        default="packs/number-theory/problems/848/SEARCH_THEOREM_BRIDGE.md",
        help="Destination Markdown file in the canonical 848 pack.",
    )
    p848_bridge_parser.add_argument(
        "--gpu-manifest",
        help="Optional explicit p848 GPU bundle manifest to cite instead of the latest one.",
    )

    for command in ("prototype-run", "export-m8-bundle", "export-m8-sat-bundle"):
        command_parser = subparsers.add_parser(command)
        command_parser.add_argument(
            "--runtime",
            choices=["auto", "python", "torch"],
            default=PRIMARY_SEARCH_PROFILE["runtime_mode"],
        )
        command_parser.add_argument(
            "--device",
            choices=["auto", "cpu", "cuda"],
            default=PRIMARY_SEARCH_PROFILE["device"],
        )
        command_parser.add_argument(
            "--warm-start",
            choices=["none", "known_m8_lb45"],
            default=PRIMARY_SEARCH_PROFILE["warm_start"],
        )
        command_parser.add_argument(
            "--warm-start-count",
            type=int,
            default=PRIMARY_SEARCH_PROFILE["warm_start_count"],
        )
        command_parser.add_argument("--seed", type=int, default=PRIMARY_SEARCH_PROFILE["seed"])
        command_parser.add_argument(
            "--initial-batch-size",
            type=int,
            default=PRIMARY_SEARCH_PROFILE["initial_batch_size"],
        )
        command_parser.add_argument(
            "--generations",
            type=int,
            default=PRIMARY_SEARCH_PROFILE["generations"],
        )
        command_parser.add_argument(
            "--parent-limit",
            type=int,
            default=PRIMARY_SEARCH_PROFILE["parent_limit"],
        )
        command_parser.add_argument(
            "--children-per-parent",
            type=int,
            default=PRIMARY_SEARCH_PROFILE["children_per_parent"],
        )
        command_parser.add_argument(
            "--mutation-count",
            type=int,
            default=PRIMARY_SEARCH_PROFILE["mutation_count"],
        )
        command_parser.add_argument(
            "--random-injections",
            type=int,
            default=PRIMARY_SEARCH_PROFILE["random_injections"],
        )

    export_parser = subparsers.choices["export-m8-bundle"]
    export_parser.add_argument(
        "--output-dir",
        default="research/frontier-engine/artifacts/m8-sat-rail",
        help="Directory for exported JSON run artifacts.",
    )
    sat_export_parser = subparsers.choices["export-m8-sat-bundle"]
    sat_export_parser.add_argument(
        "--output-dir",
        default="research/frontier-engine/artifacts/m8-sat-seeds",
        help="Directory for exported SAT-seed bundles.",
    )
    return parser


def build_pipeline(args: argparse.Namespace) -> FrontierPipeline:
    config = M8SearchConfig(
        seed=args.seed,
        runtime=args.runtime,
        device=args.device,
        warm_start=args.warm_start,
        warm_start_count=args.warm_start_count,
        initial_batch_size=args.initial_batch_size,
        generations=args.generations,
        parent_limit=args.parent_limit,
        children_per_parent=args.children_per_parent,
        mutation_count=args.mutation_count,
        random_injections=args.random_injections,
    )
    return FrontierPipeline(generator=M8SatRailAdaptiveSampler(config=config))


def build_p848_config(args: argparse.Namespace) -> P848SearchConfig:
    return P848SearchConfig(
        prefix_anchors=parse_candidate_csv(args.prefix_anchors),
        candidates=parse_candidate_csv(args.candidates),
        direct_threshold=args.direct_threshold,
        direct_max=args.direct_max,
        top_k=args.top_k,
        candidate_mode=args.candidate_mode,
        base_tail=args.base_tail,
        ladder_step=args.ladder_step,
        ladder_rounds=args.ladder_rounds,
        perturb_offsets=parse_int_csv(args.perturb_offsets, allow_empty=True),
        runtime=args.runtime,
        device=args.device,
        n_chunk_size=args.n_chunk_size,
        value_chunk_size=args.value_chunk_size,
        prime_square_chunk_size=args.prime_square_chunk_size,
    )


def load_profile_config(profile_file: str) -> tuple[P848SearchConfig, dict[str, object]]:
    return load_p848_search_profile(Path(profile_file))


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.command == "status":
        print("frontier-engine: scaffolded")
        print("mode: build-first, prove-first")
        print("integration: not yet wired into erdos-problems")
        return

    if args.command == "prototype-run":
        report = build_pipeline(args).run_once_report()
        print(json.dumps(report["summary"], indent=2))
        print(json.dumps(report["generator_metadata"], indent=2))
        return

    if args.command == "vision":
        print("frontier-engine loop:")
        print("random generation -> uniqueness scoring -> rare-structure inventory -> exact follow-up")
        return

    if args.command == "benchmark-plan":
        print("primary benchmark:", PRIMARY_BENCHMARK["benchmark_id"])
        print("exact target:", PRIMARY_BENCHMARK["exact_target"])
        print("backend:", PRIMARY_BENCHMARK["backend"])
        print("goal:", PRIMARY_BENCHMARK["primary_goal"])
        print("hardware profile:", PRIMARY_HARDWARE["profile_id"])
        print("hardware gpu:", PRIMARY_HARDWARE["gpu"])
        print("hardware os:", PRIMARY_HARDWARE["os"])
        print("search strategy:", PRIMARY_SEARCH_PROFILE["generator"])
        print("search mode:", PRIMARY_SEARCH_PROFILE["runtime_mode"])
        print("search device:", PRIMARY_SEARCH_PROFILE["device"])
        print("warm start:", PRIMARY_SEARCH_PROFILE["warm_start"])
        print("warm start count:", PRIMARY_SEARCH_PROFILE["warm_start_count"])
        print("batch size:", PRIMARY_SEARCH_PROFILE["initial_batch_size"])
        print("generations:", PRIMARY_SEARCH_PROFILE["generations"])
        return

    if args.command == "runtime-probe":
        print(json.dumps(probe_runtime().to_dict(), indent=2))
        return

    if args.command == "p848-live-frontier":
        snapshot = load_live_p848_frontier_snapshot()
        print(json.dumps(snapshot, indent=2))
        return

    if args.command == "list-lanes":
        if args.as_json:
            print(json.dumps([lane.to_dict() for lane in list_lane_specs()], indent=2))
            return
        for lane in list_lane_specs():
            print(f"{lane.lane_id}: problem {lane.problem_id} | {lane.status}")
        return

    if args.command == "show-lane":
        lane = get_lane_spec(args.lane_id)
        if args.as_json:
            print(json.dumps(lane.to_dict(), indent=2))
            return
        print("lane:", lane.lane_id)
        print("problem:", lane.problem_id)
        print("family:", lane.family)
        print("status:", lane.status)
        print("route posture:", lane.route_posture)
        print("objective:", lane.search_objective)
        print("candidate shape:", lane.candidate_shape)
        print("finite gap:", lane.finite_gap)
        print("hardware:", lane.primary_hardware_profile)
        print("artifact kind:", lane.artifact_kind)
        print("experiment dir:", lane.experiment_dir)
        print("frontier:", json.dumps(lane.frontier_summary, indent=2))
        return

    if args.command == "p848-run":
        report = run_p848_anchor_search(build_p848_config(args))
        print(json.dumps(report["summary"], indent=2))
        print(json.dumps(report["top_candidates"], indent=2))
        return

    if args.command == "p848-run-profile":
        config, profile = load_profile_config(args.profile_file)
        report = run_p848_anchor_search(config)
        print("profile_id:", profile.get("profile_id"))
        print(json.dumps(report["summary"], indent=2))
        print(json.dumps(report["top_candidates"], indent=2))
        return

    if args.command == "export-p848-bundle":
        report = run_p848_anchor_search(build_p848_config(args))
        bundle_dir = write_p848_anchor_seed_bundle(
            report=report,
            output_dir=Path(args.output_dir),
            top_k=args.top_k,
        )
        print("p848_seed_bundle:", bundle_dir)
        print(json.dumps(report["summary"], indent=2))
        return

    if args.command == "export-p848-profile-bundle":
        config, profile = load_profile_config(args.profile_file)
        output_dir = Path(
            str(
                profile.get(
                    "output_dir",
                    "research/frontier-engine/artifacts/p848-anchor-ladder",
                )
            )
        )
        report = run_p848_anchor_search(config)
        bundle_dir = write_p848_anchor_seed_bundle(
            report=report,
            output_dir=output_dir,
            top_k=config.top_k,
        )
        print("profile_id:", profile.get("profile_id"))
        print("p848_seed_bundle:", bundle_dir)
        print(json.dumps(report["summary"], indent=2))
        return

    if args.command == "export-p848-theorem-bridge":
        config = P848SearchConfig(
            prefix_anchors=parse_candidate_csv(args.prefix_anchors),
            candidates=parse_candidate_csv(args.candidates),
            direct_threshold=args.direct_threshold,
            direct_max=args.direct_max,
            top_k=args.top_k,
            candidate_mode="explicit",
            base_tail=None,
            ladder_step=50,
            ladder_rounds=0,
            perturb_offsets=[0],
            runtime=args.runtime,
            device=args.device,
            n_chunk_size=args.n_chunk_size,
            value_chunk_size=args.value_chunk_size,
            prime_square_chunk_size=args.prime_square_chunk_size,
        )
        report = run_p848_anchor_search(config)
        output_paths = write_p848_theorem_bridge(
            report=report,
            output_json_path=Path(args.output_json),
            output_md_path=Path(args.output_md),
            gpu_manifest_path=(Path(args.gpu_manifest) if args.gpu_manifest else None),
        )
        print("p848_theorem_bridge_json:", output_paths["json_path"])
        print("p848_theorem_bridge_md:", output_paths["md_path"])
        print(json.dumps(report["summary"], indent=2))
        return

    if args.command == "export-m8-bundle":
        report = build_pipeline(args).run_once_report()
        artifact_path = write_run_artifact(
            report=report,
            output_dir=Path(args.output_dir),
            benchmark=PRIMARY_BENCHMARK,
            hardware=PRIMARY_HARDWARE,
        )
        print("artifact:", artifact_path)
        print(json.dumps(report["summary"], indent=2))
        return

    if args.command == "export-m8-sat-bundle":
        report = build_pipeline(args).run_once_report()
        bundle_dir = write_m8_sat_seed_bundle(
            report=report,
            output_dir=Path(args.output_dir),
            benchmark=PRIMARY_BENCHMARK,
        )
        print("sat_seed_bundle:", bundle_dir)
        print(json.dumps(report["summary"], indent=2))
        return

    parser.error(f"unknown command: {args.command}")


if __name__ == "__main__":
    main()
