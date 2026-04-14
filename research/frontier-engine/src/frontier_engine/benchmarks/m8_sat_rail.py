"""Benchmark helpers for the M(8,3) SAT rail."""

from __future__ import annotations

from collections import Counter
from itertools import combinations

from frontier_engine.contracts import Candidate


N = 8
K = 3
TARGET_FAMILY_SIZE = 46
ALL_MASKS = list(range(1 << N))


def subset_size(mask: int) -> int:
    """Return the number of set bits in a mask."""

    return mask.bit_count() if hasattr(int, "bit_count") else bin(mask).count("1")


def is_3_sunflower(a: int, b: int, c: int) -> bool:
    """Weak/non-uniform 3-sunflower test for bitmasks."""

    ab = a & b
    return (a & c) == ab and (b & c) == ab


def size_histogram(family_masks: list[int]) -> list[int]:
    """Count family members by subset size."""

    hist = [0] * (N + 1)
    for mask in family_masks:
        hist[subset_size(mask)] += 1
    return hist


def pair_intersection_histogram(family_masks: list[int]) -> list[int]:
    """Count pairwise intersections by intersection size."""

    hist = [0] * (N + 1)
    for left, right in combinations(family_masks, 2):
        hist[subset_size(left & right)] += 1
    return hist


def coverage_count(family_masks: list[int]) -> int:
    """Count how many ground elements appear somewhere in the family."""

    union_mask = 0
    for mask in family_masks:
        union_mask |= mask
    return subset_size(union_mask)


def sunflower_triple_count(family_masks: list[int]) -> int:
    """Count exact 3-sunflower violations in the family."""

    total = 0
    for a, b, c in combinations(family_masks, 3):
        if is_3_sunflower(a, b, c):
            total += 1
    return total


def motif_signature(
    family_masks: list[int],
    *,
    size_hist: list[int],
    pair_hist: list[int],
    sunflower_violations: int,
) -> str:
    """Create a coarse signature for rarity bucketing."""

    size_key = ".".join(str(value) for value in size_hist)
    pair_key = ".".join(str(value) for value in pair_hist[:5])
    violation_bucket = sunflower_violations // 25
    return f"size={size_key}|pair={pair_key}|viol={violation_bucket}"


def structural_signal_score(
    family_masks: list[int],
    *,
    size_hist: list[int],
    pair_hist: list[int],
    sunflower_violations: int,
) -> float:
    """Prototype structural-signal measure for the benchmark."""

    size_support = sum(1 for value in size_hist if value > 0)
    pair_support = sum(1 for value in pair_hist if value > 0)
    distinct_intersections = len({left & right for left, right in combinations(family_masks, 2)})
    feasibility = 1.0 / (1.0 + sunflower_violations / 50.0)
    diversity = (size_support + pair_support + distinct_intersections / 10.0) / 20.0
    return feasibility + diversity


def build_candidate_from_metrics(
    candidate_id: str,
    family_masks: list[int],
    *,
    size_hist: list[int],
    pair_hist: list[int],
    coverage: int,
    distinct_pair_intersections: int,
    sunflower_violations: int,
) -> Candidate:
    """Build a candidate once exact metrics have already been computed."""

    sorted_masks = sorted(set(family_masks))
    if len(sorted_masks) != len(family_masks):
        raise ValueError("family_masks must be unique")
    if len(sorted_masks) != TARGET_FAMILY_SIZE:
        raise ValueError(
            f"family_masks must contain exactly {TARGET_FAMILY_SIZE} masks; "
            f"got {len(sorted_masks)}"
        )

    signal = structural_signal_score(
        sorted_masks,
        size_hist=size_hist,
        pair_hist=pair_hist,
        sunflower_violations=sunflower_violations,
    )

    signature = motif_signature(
        sorted_masks,
        size_hist=size_hist,
        pair_hist=pair_hist,
        sunflower_violations=sunflower_violations,
    )

    return Candidate(
        candidate_id=candidate_id,
        payload={
            "benchmark_id": "m8_sat_rail",
            "n": N,
            "k": K,
            "target_family_size": TARGET_FAMILY_SIZE,
            "family_masks": sorted_masks,
            "family_size_histogram": size_hist,
            "coverage_count": coverage,
            "pair_intersection_histogram": pair_hist,
            "distinct_pair_intersections": distinct_pair_intersections,
            "sunflower_triple_count": sunflower_violations,
            "motif_signature": signature,
            "signal_score": signal,
        },
        source="m8_sat_rail",
        tags=["benchmark:m8_sat_rail", "family_candidate", "sunflower"],
    )


def build_candidate(candidate_id: str, family_masks: list[int]) -> Candidate:
    """Build a benchmark-aligned candidate payload."""

    sorted_masks = sorted(set(family_masks))
    if len(sorted_masks) != len(family_masks):
        raise ValueError("family_masks must be unique")
    if len(sorted_masks) != TARGET_FAMILY_SIZE:
        raise ValueError(
            f"family_masks must contain exactly {TARGET_FAMILY_SIZE} masks; "
            f"got {len(sorted_masks)}"
        )

    size_hist = size_histogram(sorted_masks)
    pair_hist = pair_intersection_histogram(sorted_masks)
    violations = sunflower_triple_count(sorted_masks)
    return build_candidate_from_metrics(
        candidate_id,
        sorted_masks,
        size_hist=size_hist,
        pair_hist=pair_hist,
        coverage=coverage_count(sorted_masks),
        distinct_pair_intersections=len({left & right for left, right in combinations(sorted_masks, 2)}),
        sunflower_violations=violations,
    )
