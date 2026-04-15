# M8 Artifact Schema

The first `frontier-engine` benchmark artifacts should be written as portable
JSON bundles so a CPU scaffold and a later CUDA rail can emit the same shape.

## Top-level fields

- `artifact_version`
  - current value: `1`
- `run_id`
  - benchmark-stamped unique identifier
- `created_at_utc`
  - UTC timestamp in compact sortable format
- `benchmark`
  - benchmark metadata for the run
- `hardware_profile`
  - execution target metadata, starting with the Windows RTX 4090 profile
- `summary`
  - compact run summary for quick comparison
- `generator_metadata`
  - search strategy details and generation trace
- `elite_inventory`
  - promoted rare structures kept for exact follow-up
- `frontier_items`
  - explicit promoted frontier objects
- `verification_requests`
  - exact work requests emitted from the frontier
- `verification_results`
  - placeholder or exact verifier responses

## Purpose

This artifact shape matters because it gives us:

- one stable interchange format across CPU and CUDA rails
- a reviewable record of why candidates were promoted
- a direct future ingest packet for SAT-facing verification work
- a claim-safe summary surface for `erdos-problems`

## First invariant

The CUDA rail should be free to change throughput and batching, but it should
not silently change:

- candidate payload semantics
- the finite-gap metric
- the meaning of promoted inventory records
- the artifact bundle fields used by downstream exact tooling
