# M8 SAT Seed Bundle Schema

The SAT-facing handoff for the first rail should be a seed bundle, not a
certificate bundle.

Why:

- elite families can be valuable exact inputs even when they still contain
  sunflower violations
- a near-miss should not be mislabeled as a witness
- the seed bundle should preserve exact-work provenance without overstating what
  has been proved

## Bundle layout

- `manifest.json`
  - benchmark metadata
  - run summary
  - generator metadata
  - ranked list of seed files
- `rank-XX-<candidate_id>.json`
  - one elite family per file

## Seed file fields

- `schema`
  - fixed value: `frontier_engine.m8_sat_seed/1`
- `problem_id`
  - current value: `857`
- `benchmark_id`
  - current value: `m8_sat_rail`
- `n`
  - current value: `8`
- `k`
  - current value: `3`
- `family_size`
  - current value: `46`
- `family`
  - the candidate bitmask family
- `candidate_id`
  - frontier-engine candidate identifier
- `source`
  - current value: `frontier-engine`
- `observed_sunflower_triple_count`
  - finite-gap metric at export time
- `motif_signature`
  - rarity bucket summary
- `signal_score`
  - structural signal score
- `rarity_score`
  - rarity score at promotion time
- `uniqueness_rating`
  - coarse promotion label

## Interpretation

These files are suitable for:

- SAT-facing seed ingestion
- branch-order experiments
- exact local repair attempts
- witness verification only after a candidate reaches zero observed violations
