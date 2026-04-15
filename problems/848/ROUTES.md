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

## Optimization target

- Primary objective: decide the full truth value by closing the finite remainder.
- Secondary objective: lower the explicit threshold `N0` only insofar as it shrinks the
  finite remainder that still has to be checked.
- Hygiene objective: keep imported public threshold improvements separate from the repo's own
  audited candidate statements.

## Subroutes

- `external_threshold_tracking`
  - record the best imported public `N0` timeline without automatically adopting it as
    canonical repo truth
  - current imported timeline:
    - `7 x 10^17` on 2026-03-21
    - `3.3 x 10^17` on 2026-03-22
    - `2.64 x 10^17` on 2026-03-23
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
- Do not confuse "best imported public threshold" with "repo-owned audited threshold."
- Count a route breakthrough only if we either:
  - extract a fully explicit threshold that reduces the remainder to a bounded finite check, or
  - finish the finite range directly.
- Treat formalization progress as support evidence unless it clearly covers the exact
  remaining finite gap.

## Immediate next move

- The repo now has a committed, claim-safe review package for its own audited explicit
  candidate.
- The imported public thread currently reports a better external threshold
  `N0 = 2.64 x 10^17` on 2026-03-23.
- The repo has now chosen the bounded finite-verification lane for the next cycle.
- The repo now has:
  - a regime split for the finite remainder
  - a certificate format for bounded interval claims
  - an audit ledger for imported verification work
  - an exact verified base interval `1..10000`
  - local ignored exact rollout evidence through `1..40500`, tracked separately from the
    committed raw packet
  - an incremental verifier that makes larger exact tranches practical
- The next concrete task is to turn the four-anchor obstruction clue into a proof-shaped
  lemma candidate and then use it to attack the breakpoint law.
- The right optimization target remains the size of the remaining finite gap, not the
  threshold race in isolation.
