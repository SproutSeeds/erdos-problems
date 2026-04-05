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

- Read Sawhney's Proposition 1.1 and enumerate every place where `sufficiently large` enters
  quantitatively.
- Record whether each such place is:
  - already explicit in the note
  - explicit but very weak
  - still purely existential
- Only then decide whether the next serious lane is threshold extraction or direct finite
  computation.
