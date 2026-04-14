# Architecture

`frontier-engine` is a verifier-guided search system.

Its purpose is not to replace exact methods. Its purpose is to reduce the amount
of exact work that remains.

Core loop:

1. generate
2. classify
3. inventory
4. verify
5. learn

## Lane posture

`frontier-engine` should support multiple named lanes rather than one monolithic
search surface.

Each lane should define:

- one problem or tightly related benchmark family
- one candidate shape
- one honest finite-gap metric
- one artifact kind for downstream exact or review work

That lets us reuse the engine while keeping the mathematical semantics of each
lane explicit.

## Core modules

- generator
  - emits candidate structures, partial assignments, motif seeds, or cubes
- rarity
  - scores how unusual a candidate is relative to the current stream
- surrogate
  - predicts promise, hardness, or verifier-alignment
- inventory
  - keeps the rarest and strongest candidates rather than a raw heap
- frontier
  - keeps only the best and most diverse active candidates
- verifier
  - exact backend such as SAT, branch-and-bound, or a certificate checker
- pipeline
  - orchestrates the loop and records artifacts

## Contract boundary

The engine should expose the following logical objects:

- `Candidate`
  - the thing being searched
- `ScoreBundle`
  - surrogate and heuristic scores
- `InventoryRecord`
  - a promoted rare-structure record with rarity and signal metadata
- `FrontierItem`
  - candidate plus retention metadata
- `VerificationRequest`
  - exact work request
- `VerificationResult`
  - exact outcome and proof-facing metadata

## Proof posture

The engine can support proofs, but it is not itself the proof.

Its role is:

- reduce entropy
- isolate hard cases
- surface strong witnesses
- package exact subproblems

The final truth still belongs to the verifier and the mathematical record.

## Hardware posture

The generator and surrogate stack should be GPU-aware but hardware-adaptive.

That means:

- a Windows RTX 4090 rig is the first-class CUDA target during the prototype
  phase
- batch sizing should depend on available VRAM
- kernels should degrade gracefully to smaller cards
- multi-GPU should be an optimization, not an assumption
- artifact formats should be device-independent

For the first `M(8,3)` rail that now means:

- keep a benchmark-specific search config with explicit mutation and batching
  knobs
- keep the CPU scaffold and future CUDA rail on the same candidate contract
- export the same elite bundle shape no matter which runtime produced it
- treat Torch as the first device-aware backend and Triton as a later kernel
  optimization step

## Artifact flow

Internal artifacts should include:

- candidate ledgers
- motif catalogs
- rarity ledgers
- elite inventory snapshots
- scored frontier snapshots
- verifier task bundles
- verifier outcomes
- training snapshots for surrogate improvement

For the first exact handoff this now also includes:

- SAT-seed bundles containing elite family JSONs and a manifest

Only promoted, claim-safe summaries should move into `erdos-problems`.

## First benchmark-specific finite gap

For the `M(8,3)` rail, a candidate is naturally a family of `46` subsets of
`[8]`.

That suggests a benchmark-specific closeness metric:

- `sunflower_triple_count`

where:

- `0` means the candidate family is already 3-sunflower-free
- smaller values mean the candidate is more SAT-worthy
- the engine can optimize this metric before exact solving
