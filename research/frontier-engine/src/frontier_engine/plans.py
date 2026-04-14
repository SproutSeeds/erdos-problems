"""Named plans for benchmarks and hardware targets."""

from __future__ import annotations


PRIMARY_BENCHMARK = {
    "benchmark_id": "m8_sat_rail",
    "problem_id": "857",
    "family": "sunflower",
    "exact_target": "M(8,3) exactness / target-46 UNSAT route",
    "backend": "sat",
    "primary_hardware_profile": "windows_rtx4090",
    "primary_goal": "Reduce the finite exact frontier before exact solving.",
    "measures": [
        "candidates_per_second",
        "unique_signatures_per_batch",
        "elite_inventory_size",
        "verifier_promotion_rate",
        "useful_exact_followups",
        "frontier_reduction_against_baseline",
    ],
}


PRIMARY_HARDWARE = {
    "profile_id": "windows_rtx4090",
    "os": "windows",
    "gpu": "RTX 4090",
    "role": "primary_cuda_prototype",
}


PRIMARY_SEARCH_PROFILE = {
    "profile_id": "m8_sat_rail_windows_rtx4090_v1",
    "generator": "m8_adaptive_mutation_sampler",
    "runtime_mode": "auto",
    "device": "auto",
    "warm_start": "known_m8_lb45",
    "warm_start_count": 32,
    "seed": 857,
    "initial_batch_size": 64,
    "generations": 5,
    "parent_limit": 8,
    "children_per_parent": 12,
    "mutation_count": 3,
    "random_injections": 16,
}
