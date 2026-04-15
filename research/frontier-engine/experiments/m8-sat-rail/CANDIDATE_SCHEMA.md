# M8 Candidate Schema

The first benchmark-specific candidate should represent a proposed size-46 family
for the `M(8,3)` exactness rail.

## Candidate payload

- `benchmark_id`
  - fixed value: `m8_sat_rail`
- `n`
  - fixed value: `8`
- `k`
  - fixed value: `3`
- `target_family_size`
  - fixed value: `46`
- `family_masks`
  - sorted unique bitmasks for the proposed family
- `family_size_histogram`
  - counts of set sizes `0..8`
- `coverage_count`
  - number of ground elements touched by the family
- `pair_intersection_histogram`
  - histogram of pairwise intersection sizes
- `distinct_pair_intersections`
  - number of distinct pairwise intersections seen
- `sunflower_triple_count`
  - exact count of 3-sunflower triples inside the family
- `motif_signature`
  - coarse summary used for rarity bucketing
- `signal_score`
  - prototype structural-signal measure

## Interpretation

This candidate schema is useful because it contains:

- enough structure for rarity and motif inventory
- a real finite gap (`sunflower_triple_count`)
- a direct path to an exact verifier bundle

## Promotion rule

The first prototype promotion rule should prefer candidates that combine:

- low `sunflower_triple_count`
- high structural rarity
- high distinctness across pair intersections and set-size profile

## Runtime note

The current CPU scaffold and the future CUDA rail should both emit this exact
candidate shape. Throughput should change. Semantics should not.
