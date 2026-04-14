# Roadmap

## Phase 0: Archaeology

- inventory legacy systems such as Motif Classifier, Pair Surrogate, and
  Trifield Searcher
- identify which ideas are still live
- normalize naming and artifacts

## Phase 1: Finite benchmark

- choose one exact benchmark with a measurable target
- define the finite gap the engine is trying to shrink
- lock one verifier backend

Examples:

- SAT cube count
- exact `M(n,3)` lane reduction
- bounded witness search with exact rejection

Current recommended benchmark:

- exact `M(8,3)` reduction rail
- exact target: certify the target-46 instance route as cheaply as possible
- primary backend: SAT / cube-and-conquer style verifier
- primary hardware: Windows RTX 4090 CUDA box
- first finite gap: count of 3-sunflower triples in a size-46 family on `[8]`

## Phase 2: Generator

- build motif-aware candidate generation
- add canonicalization and symmetry reduction
- make GPU chunking hardware-adaptive
- support a giant random combination stream as the first practical search mode
- validate the first CUDA search rail on the 4090 before worrying about
  multi-GPU scaling

Current status:

- benchmark-specific mutation rail scaffolded
- Windows RTX 4090 profile defined
- runtime probe plus `python` / `torch` backend split implemented
- artifact export contract defined
- SAT-seed bundle export implemented
- native frontier fleet provisioning/sync now supports `2x` / `8x H100`
  independent-sweep workflows
- next step is a true CUDA or Triton hot-path implementation behind the same
  rail shape

Compute topology after the first single-GPU rail:

- Tier A: single-GPU sweeps on `4090` / single `H100`
- Tier B: many independent sweeps in parallel across multiple boxes
- Tier C: multi-GPU shared-lane execution on `2x` or `8x H100`

Recommendation:

- For `p848`, Tier B is the next best step after the current `4090` lane.
- Use additional `H100` boxes for wider sweep fleets only when they improve
  throughput per dollar over the 4090.
- Native workflow:
  - `erdos frontier create-brev-fleet <fleet-id> --type hyperstack_H100 --count 2 --attach --sync-lane p848_anchor_ladder --apply`
  - `erdos frontier sync-fleet <fleet-id> --lane p848_anchor_ladder --apply`
- Do not treat `8x H100` as the default until the lane supports real
  distributed or multi-GPU batching rather than only single-device Torch.

## Phase 3: Rarity and uniqueness

- score candidates by stream-relative rarity
- define uniqueness ratings that survive exact scrutiny
- inventory the rarest, highest-signal structures instead of the whole stream

## Phase 4: Surrogate

- implement pairwise and higher-order scoring surfaces
- measure rank correlation against verifier outcomes
- reject surrogates that are smooth but verifier-misaligned

## Phase 5: Frontier manager

- enforce diversity and deduplication
- keep the engine from collapsing into one narrow basin
- record exact reasons candidates were kept or dropped

## Phase 6: Exact loop

- connect verifier requests to frontier items
- cache verifier outcomes
- teach the surrogate from exact success and exact failure

## Phase 7: Earned integration

Only after the engine shows benchmark value:

- define `erdos-problems` artifact ingest shape
- add CLI adapter hooks
- expose search status without overstating mathematical claims
