# Problem 848 Proposition-Level Explicit Candidate

This note closes `N848.G1.A9`.

Public context:
- this note records the repo's audited explicit candidate package
- it does not claim to be the best imported public threshold currently visible on the
  Problem 848 forum thread

## Candidate repo statement

The current repo evidence supports the following **candidate**:

For every
- `N >= exp(1420)`

if
- `A subseteq [N]`
- `ab + 1` is never squarefree for all `a, b in A`
- `|A| >= (1/25 - 10^-4) * N`

then
- `A` is contained in either the `7 mod 25` class or the `18 mod 25` class.

This is the repo's current explicit stability candidate for Sawhney's Proposition 1.1.

## Why the repo can now say this

The supporting chain is now explicit inside the repo:
- `WEAKEST_CASE_BUDGET.md` freezes the weakest public branch main term.
- `LEMMA21_EXPLICIT_BOUND.md` and `LEMMA21_TRUNCATION_SCAN.md` make Lemma 2.1 explicit and
  justify the larger truncation witness `T = 250`.
- `LEMMA22_EXPLICIT_BOUND.md` and `LEMMA22_PRIME_COUNT_BOUND.md` make Lemma 2.2 explicit at
  the same witness scale.
- `WEAKEST_BRANCH_T250_ASSEMBLY.md` freezes the weakest-branch line-by-line witness with
  working `eta = 10^-4`.
- `BRANCH_COMPARISON_LEDGER.md` shows that the same witness also controls the public branches
  rounded as `0.0358`, `0.0336`, and `0.0294`.

So at the repo's current explicit level, the public proof skeleton now has one shared witness
instead of a collection of separate unresolved branches.

## What the repo is **not** claiming yet

This note does **not** yet promote the candidate into canonical solved truth.

The repo is still **not** claiming:
- that a publication-ready explicit proof has been written line by line with every rounding
  and floor/ceiling detail frozen at journal quality
- that `exp(1420)` is the optimal threshold
- that the finite range below `exp(1420)` has been closed here
- that the public theorem page should already be updated from `decidable` to `solved`

So the right reading is:
- explicit repo candidate: yes
- finished publication proof artifact: not yet
- full all-`N` closure inside this repo: not yet

## Honest next move

The next route task is not another branch estimate.

It is:
- write the proof-obligation ledger separating this repo candidate from a publishable explicit
  theorem writeup
- list exactly which remaining details are purely expository/bookkeeping and which would still
  change the mathematics if they failed

That is the remaining gap between the current research workspace and a public-truth update.
