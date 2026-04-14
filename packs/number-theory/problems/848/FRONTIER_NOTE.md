# Problem 848 Frontier Note

Problem 848 is a decidable finite-check problem, not a fresh asymptotic frontier.
The optimization target is full finite-gap closure, not "smallest `N0`" in isolation.

The live route is `finite_check_gap_closure`:
- keep Sawhney's sufficiently-large-`N` theorem exact
- do not widen `decidable` into `solved`
- treat explicit-threshold extraction and finite verification as separate but coupled lanes

Imported public threshold timeline:
- `N0 = 7 x 10^17` on 2026-03-21
- `N0 = 3.3 x 10^17` on 2026-03-22
- `N0 = 2.64 x 10^17` on 2026-03-23

So the repo's current `exp(1420)` candidate should be read as an audited workspace artifact,
not as the best public threshold.

The smallest honest next move is not “solve 848”.
It is:
- keep the current repo candidate claim-safe while turning it into a review unit
- maintain the distinction between:
  - theorem-style repo candidate
  - public review artifact
  - finished publication proof
- use the current explicit witness package as the handoff surface, not as a reason to
  silently upgrade the problem to `solved`

The current package is already internally reviewed enough for handoff:
- the paper bundle now has drafted introduction, preliminaries, and related-work sections
- the surfaced candidate package has no remaining placeholder text
- tests and publish-surface checks are green

Chosen next lane:
- bounded finite verification under the best imported threshold currently tracked

Why this lane wins the next cycle:
- the real objective is to close the finite remainder, not just publish a smaller `N0`
- imported threshold progress already exists, so the repo needs an interval-certification
  surface to make use of it
- the public thread already contains one verification attempt that was later corrected and
  criticized as difficult to verify, so trust and reproducibility have to be first-class

Support bridge:
- the live `frontier-engine` search lane now writes a canonical search/theorem bridge into
  `SEARCH_THEOREM_BRIDGE.md` and `SEARCH_THEOREM_BRIDGE.json`
- that bridge is a support surface for structural conjecture formation, not a theorem by itself
- operational entrypoints:
  - `erdos number-theory dispatch 848`
  - `erdos number-theory bridge 848`
  - `erdos frontier doctor`
  - `erdos number-theory bridge-refresh 848`
- the runtime now chooses the lightest execution mode that matches the task:
  - `system` for bridge refresh when frontier-engine is bundled but not opted in
  - `cpu` for opted-in managed frontier work without CUDA
  - `gpu` for CUDA-ready frontier search and ranking
- the dispatch command is the orchestration entrypoint:
  - it chooses between bridge refresh, CPU family search, GPU ladder sweep, and exact
    small-`N` interval scouting based on the live route state and current runtime

Read next:
- `BOUNDED_VERIFICATION_PLAN.md`
- `VERIFICATION_REGIMES.md`
- `VERIFICATION_CERTIFICATE_SPEC.md`
- `EXTERNAL_VERIFICATION_LEDGER.md`
- `INTERVAL_WORK_QUEUE.yaml`
- `EXACT_SMALL_N_1_40500_CERTIFICATE.md`
- `SEARCH_THEOREM_BRIDGE.md`
