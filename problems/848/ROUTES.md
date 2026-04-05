# Routes

## Status Ladder

- Open problem: no
- Active route: finite_check_gap_closure
- Route breakthrough: yes
- Problem solved: no

## Active route

- `finite_check_gap_closure`
- Goal: convert the public sufficiently-large-`N` theorem into a complete all-`N`
  resolution.
- Current support:
  - the public page reports an asymptotic solution by Sawhney
  - the public page describes a stability statement near density `1/25`
  - a public Lean formalization thread exists, but the exact finite closure surface still
    needs review

## Subroutes

- `explicit_threshold_extraction`
  - extract or improve an explicit `N0` from Sawhney's proof
  - likely pressure points:
    - sharpen Lemma 2.1 with better explicit squarefree-counting bounds
    - sharpen Lemma 2.2, which the public thread identifies as the harder obstacle
    - test whether Montgomery-Vaughan style large-sieve inputs materially beat the current
      coarse error budget
- `bounded_finite_verification`
  - once an explicit `N0` is available, close `N < N0` by direct computation
  - public evidence suggests that naive finite verification has only reached relatively
    small ranges so far
- `formalization_coverage_audit`
  - determine exactly what the public Lean files certify
  - separate:
    - asymptotic theorem coverage
    - sample finite checks
    - genuine full finite closure, if any

## Route discipline

- Do not widen `decidable` into `solved` without an explicit finite completion artifact.
- Count a route breakthrough only if we either:
  - extract a fully explicit threshold that reduces the remainder to a bounded finite check, or
  - finish the finite range directly.
- Treat formalization progress as support evidence unless it clearly covers the exact
  remaining finite gap.

## Immediate next move

- Keep the explicit-threshold lane honest: Lemma 2.1 is now explicit enough to show that the
  large-prime tail, not the small-prime discretization, is the current blocker in the weakest
  branch.
- The next serious analytic lane is now clearer:
  - keep the one-sided explicit Lemma 2.1 route
  - enlarge the truncation parameter beyond `T = floor(sqrt(log N))`
  - then carry that larger `T` through Lemma 2.2 and the final weakest-branch bookkeeping
- The current witness value is `T = 250`, which already leaves substantial room in the
  weakest branch after the currently frozen lemma tails.
- The Lemma 2.2 prime-count term is now bounded explicitly at the witness scale.
- The weakest branch now has a working witness `eta = 10^-4`.
- The same witness now appears to dominate the other public branches too.
- The repo now has a proposition-level explicit candidate built from that shared witness.
- The remaining obligations are now split cleanly.
- The current witness is now numerically hardened at the ledger level.
- The repo now has a theorem-style explicit proof note for the current candidate.
- The candidate is now surfaced in both the paper bundle and a dossier-level review artifact.
- The paper bundle now has drafted introduction, preliminaries, and related-work sections.
- The next unresolved move is operational: commit the current surfaced package or open review
  on it without widening the current claim-safe wording.
- Keep the bounded finite-verification lane open in parallel, but do not treat it as a full
  replacement for the analytic threshold work until the explicit `N0` posture is clearer.
