# P848 Anchor Tail Seed Bundle Schema

This bundle records candidate continuation tails for the anchor ladder route.

It is a search bundle, not a theorem certificate.

## Bundle purpose

- rank continuations against the known failure ladder
- preserve direct scan summaries on a chosen frontier window
- export promising tails for deeper compute or proof-facing follow-up

## Manifest fields

- `bundle_version`
- `bundle_kind`
- `lane`
- `summary`
- `candidate_generation`
- `backend_metadata`
- `search_profile`
- `known_failure_packets`
- `observed_continuations`
- `candidate_files`

## Candidate file fields

- `schema`
  - fixed value: `frontier_engine.p848_anchor_tail_seed/1`
- `lane_id`
  - fixed value: `p848_anchor_ladder`
- `problem_id`
  - fixed value: `848`
- `prefix_anchors`
- `continuation`
- `all_anchors`
- `known_packet_repairs`
- `repaired_known_packets`
- `missed_known_packets`
- `direct_scan`
  - threshold
  - max
  - first failure if present
  - clean-through
  - witness counts
- `observed_frontier`
  - frozen status already earned in the live frontier
  - known first failure or clean-through
- `frontier_evidence`
  - effective clean-through after merging frozen evidence with the latest direct scan
  - effective first failure if one is known
  - whether the live window was contiguous with prior evidence

## Backend metadata

The manifest now also records the runtime used to produce the bundle:

- resolved runtime
- resolved device
- chunk sizes for batched scans
- runtime probe snapshot

## Interpretation

These seed files are suitable for:

- deeper direct frontier scans
- batched GPU continuation comparisons
- CRT-family clustering around new failures
- theorem-facing route selection
