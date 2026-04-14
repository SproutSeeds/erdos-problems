# P848 Anchor Ladder Lane

This lane is the first non-sunflower search rail implemented in `frontier-engine`.

It targets the structured `+50` repair ladder that has emerged in the current
Problem 848 frontier workspace.

## Why this belongs in the engine

This is a good fit for GPU-assisted structured search because the engine can:

- score many candidate continuations in parallel
- scan many `n` values for each continuation in parallel
- classify first-failure packets by recurring CRT-locked residue shapes
- rank which continuations are real structural repairs rather than transient wins

## Current frontier snapshot

Shared prefix:

- `{7, 32, 57, 82, 132, 182}`

Current completed ladder:

- `157` fails at `19094395`
- `232` fails at `27949928`
- `282` fails at `137720141`
- `332` is clean through `250000000`

That is very suggestive, but it is not yet a theorem.

The live six-prefix classifier has now advanced farther than that frozen ladder:

- the shared prefix has `24` known failures through `136702637`
- the rebuilt twenty-four-family menu recovers those failures with `25` matched
  family rows because `84036163` still appears twice
- the next unmatched family representative is now `137720141`
- that next unmatched representative is also the known first failure of the
  `282` continuation
- the newest packets at `127682743` and `136702637` introduced new witness
  moduli `17161 = 131^2` and `1849 = 43^2`, so the previous repaired square
  pool was not yet closed

So the live theorem-facing question is no longer just “does `332` keep going?”
It is whether the apparent `+50` repair ladder is driven by a stable finite
obstruction menu or whether a later obstruction family eventually breaks the
pattern.

## Candidate shape

The first candidate shape for this lane should be:

- shared anchor prefix plus one continuation tail

For example:

- `{7, 32, 57, 82, 132, 182, t}`

## Finite-gap metric

This lane does not optimize a sunflower count. It should optimize:

- `direct_clean_through`
- `first_failure_n`
- `repaired_packet_count`
- `crt_locked_obstruction_count`

Higher clean-through ranges and more repaired packets are better.

## Engine role

The engine should not claim the recurrence.

Its job is to:

- search continuations
- cluster failure packets
- detect repeated obstruction types
- surface the continuations that look theorem-worthy

## Current runnable prototype

The lane now supports:

- ranking candidate continuations against the frozen failure ladder
- ingesting the live six-prefix frontier packet from `/tmp/erdos-problems-848-frontier`
- scoring continuations against the richest live six-prefix family menu
- merging frozen frontier evidence with new direct-scan windows
- skipping redundant scans when a continuation already has an earlier known failure
- generated ladder sweeps around the current best tail with perturbation offsets
- a Torch batch backend for many tails across many `n` values at once
- counting repaired known packets
- falling back to repo-owned live-frontier sync artifacts when `/tmp` is absent
- direct first-failure scans on a configurable finite frontier window
- export of ranked anchor-tail seed bundles

Current CLI surface:

- `python3 research/frontier-engine/src/frontier_engine/cli.py p848-live-frontier`
- `python3 research/frontier-engine/src/frontier_engine/cli.py p848-run`
- `python3 research/frontier-engine/src/frontier_engine/cli.py p848-run-profile research/frontier-engine/experiments/p848-anchor-ladder/batched_smoke_profile.json`
- `python3 research/frontier-engine/src/frontier_engine/cli.py p848-run-profile research/frontier-engine/experiments/p848-anchor-ladder/windows_rtx4090_search_profile.json`
- `python3 research/frontier-engine/src/frontier_engine/cli.py p848-run --runtime torch --device cuda --n-chunk-size 4096 --value-chunk-size 65536 --prime-square-chunk-size 256`
- `python3 research/frontier-engine/src/frontier_engine/cli.py p848-run --candidate-mode ladder-sweep --base-tail 332 --ladder-rounds 6 --perturb-offsets 0,-5,5`
- `python3 research/frontier-engine/src/frontier_engine/cli.py export-p848-bundle`
- `python3 research/frontier-engine/src/frontier_engine/cli.py export-p848-profile-bundle research/frontier-engine/experiments/p848-anchor-ladder/windows_rtx4090_search_profile.json`
- `python3 research/frontier-engine/src/frontier_engine/cli.py export-p848-theorem-bridge`

## Source frontier

The current frozen frontier state is copied into:

- [FRONTIER_STATE.json](/Volumes/Code_2TB/code/erdos-problems/research/frontier-engine/experiments/p848-anchor-ladder/FRONTIER_STATE.json)
- [observed_continuations.json](/Volumes/Code_2TB/code/erdos-problems/research/frontier-engine/experiments/p848-anchor-ladder/observed_continuations.json)
- [batched_smoke_profile.json](/Volumes/Code_2TB/code/erdos-problems/research/frontier-engine/experiments/p848-anchor-ladder/batched_smoke_profile.json)
- [windows_rtx4090_search_profile.json](/Volumes/Code_2TB/code/erdos-problems/research/frontier-engine/experiments/p848-anchor-ladder/windows_rtx4090_search_profile.json)
- [live-frontier-sync/latest/README.md](/Volumes/Code_2TB/code/erdos-problems/research/frontier-engine/experiments/p848-anchor-ladder/live-frontier-sync/latest/README.md)
- canonical pack bridge: [SEARCH_THEOREM_BRIDGE.md](/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SEARCH_THEOREM_BRIDGE.md)

The live supporting notes currently sit in:

- `/tmp/erdos-problems-848-frontier/packs/number-theory/problems/848/ANCHOR_TAIL_COMPARISON_157_232_282.md`
- `/tmp/erdos-problems-848-frontier/packs/number-theory/problems/848/ANCHOR_332_TAIL_OVERTAKE_LEDGER.md`

Latest family-aware search signal:

- `332` remains the strongest completed structured tail with contiguous evidence
  through `250000000`
- the updated twenty-four-family menu shifts the current family-aware leader to
  `432`; the latest 4090 ladder sweep orders the top finishers as `432`, `782`,
  `832`, `332`, and `382`
- `432`, `782`, and `832` tie on repaired known packets, repaired
  predicted-family rows, and tested clean-through on that window
- `282` now repairs the most predicted-family rows among those tails, but still
  loses overall because it misses its own known obstruction packet at
  `137720141`
