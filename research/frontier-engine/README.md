# Frontier Engine

`frontier-engine` is the standalone prototype surface for GPU-assisted,
near-exact combinatorial search.

It is designed to sit between broad search and exact verification:

- generate candidate structures at GPU scale
- classify them by uniqueness and rarity
- inventory the rare, high-signal structures instead of drowning in raw output
- hand a tiny elite set to an exact backend such as SAT, cube-and-conquer, or a
  certificate checker

This is the right place for systems in the spirit of:

- Motif Classifier
- Pair Surrogate
- Trifield Searcher
- verifier-guided frontier search

Current intended search story:

1. a giant random number generator emits massive batches of candidate
   combinations
2. a motif and rarity layer scores how structurally unusual each candidate is
3. an inventory layer keeps the rarest and highest-signal structures
4. a solver layer works only on that elite inventory

This is the key design move: do not ask exact methods to stare at the whole
search space. Ask them to stare only at the best rare structures the GPU engine
can surface.

## First proving ground

The first exact proving ground should be the weak-sunflower exactness lane
around `M(8,3)`.

That benchmark is a good fit because it has:

- a finite exact target
- a natural SAT-facing backend
- a concrete notion of a reduced exact frontier
- an existing home in the `erdos-problems` sunflower compute surface

## Primary hardware target

The primary CUDA development box for the first engine build is the Windows rig
with an RTX 4090.

That means:

- optimize first for one strong consumer GPU
- make Windows/WSL CUDA workflows first-class during prototyping
- treat larger multi-GPU stories as later scale-up work, not as the entry cost

## Why it lives here first

This engine should be built and proved before it is deeply integrated into
`erdos-problems`.

That means:

- build it as a standalone search engine
- prove that it reduces a measurable finite gap on at least one exact benchmark
- only then connect it back into the CLI and public problem records

`erdos-problems` should remain the mathematical record.
`frontier-engine` should remain the search engine.

## Success criterion

The engine is only worth integrating once it can show a real reduction in exact
work, for example:

- fewer unresolved SAT cubes
- a smaller upper/lower bound gap
- stronger exact witnesses than random or local search
- strong correlation between surrogate ranking and verifier outcome
- a measurable improvement over naive random search because the rarity inventory
  feeds the verifier better candidates

## Layout

- `NAMING.md`: exact naming choice and rejected alternatives
- `ARCHITECTURE.md`: system shape and core contracts
- `VISION.md`: rare-structure search loop and the intended build philosophy
- `ROADMAP.md`: build-first / prove-first milestones
- `ERDOS_ADAPTER.md`: how later integration with `erdos-problems` should work
- `pyproject.toml`: isolated Python package scaffold
- `src/frontier_engine/`: minimal engine package skeleton
- `experiments/`: future benchmark and run bundles
- `artifacts/`: future exported run artifacts

## First runnable rail

The current `M(8,3)` rail is no longer just a toy random sampler.

It now has:

- a configurable mutation-guided search loop
- runtime selection across `python`, `torch`, and `auto`
- a first-class Windows RTX 4090 search profile
- a benchmark-native warm start from the known `M(8,3) >= 45` family
- a portable JSON artifact bundle for elite candidates and verifier handoff
- a SAT-seed bundle export for exact follow-up

Useful commands:

- `python3 research/frontier-engine/src/frontier_engine/cli.py benchmark-plan`
- `python3 research/frontier-engine/src/frontier_engine/cli.py runtime-probe`
- `python3 research/frontier-engine/src/frontier_engine/cli.py list-lanes`
- `python3 research/frontier-engine/src/frontier_engine/cli.py show-lane p848_anchor_ladder`
- `python3 research/frontier-engine/src/frontier_engine/cli.py p848-run`
- `python3 research/frontier-engine/src/frontier_engine/cli.py p848-run-profile research/frontier-engine/experiments/p848-anchor-ladder/windows_rtx4090_search_profile.json`
- `python3 research/frontier-engine/src/frontier_engine/cli.py p848-run --runtime torch --device cuda --n-chunk-size 4096 --value-chunk-size 65536 --prime-square-chunk-size 256`
- `python3 research/frontier-engine/src/frontier_engine/cli.py p848-run --candidate-mode ladder-sweep --base-tail 332 --ladder-rounds 6 --perturb-offsets 0,-5,5`
- `python3 research/frontier-engine/src/frontier_engine/cli.py export-p848-bundle`
- `python3 research/frontier-engine/src/frontier_engine/cli.py export-p848-profile-bundle research/frontier-engine/experiments/p848-anchor-ladder/windows_rtx4090_search_profile.json`
- `python3 research/frontier-engine/src/frontier_engine/cli.py prototype-run`
- `python3 research/frontier-engine/src/frontier_engine/cli.py export-m8-bundle`
- `python3 research/frontier-engine/src/frontier_engine/cli.py export-m8-sat-bundle`

## Build-first rule

Do not wire this into the public CLI as a first-class engine until it has:

1. one benchmark with a finite exact target
2. one measurable frontier-reduction story
3. one artifact schema that `erdos-problems` can ingest honestly
