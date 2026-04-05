# Problem 848 Proof-Obligation Ledger

This note closes `N848.G1.A10`.

Purpose:
- separate the remaining obligations behind the current proposition-level repo candidate into
  two buckets:
  - obligations that could still change the mathematics
  - obligations that are primarily presentation or publication quality

## Current repo candidate

The current candidate, from `PROPOSITION_EXPLICIT_CANDIDATE.md`, is:
- `N >= exp(1420)`
- `eta = 10^-4`
- shared truncation witness `T = 250`

with the conclusion that near-extremal sets are forced into the `7 mod 25` or `18 mod 25`
classes.

## Obligations that still affect the mathematics

### 1. Certified replacement for displayed decimal approximations

Why it matters:
- several branch ledgers currently use displayed decimals such as `0.0376113079`,
  `0.0005641453`, and `0.0014095427`
- if one of those visible decimals is not backed by a certified upper interval, the current
  witness could in principle be overstated

What would discharge it:
- a machine-checked interval or conservative rational upper bound for every decimal input used
  in the proposition-level candidate

### 2. Explicit domination of the discrete inclusion-exclusion terms

Why it matters:
- the discrete terms are obviously tiny at `N >= exp(1420)`, but the current notes still treat
  them informally as “astronomically small”

What would discharge it:
- one explicit numerical line showing each discrete term is below a fixed reserve such as
  `10^-10`, or far smaller, at `N = exp(1420)` and hence for all larger `N`

### 3. One-sheet theorem-style assembly

Why it matters:
- the current candidate is spread across several notes
- a theorem claim should have one place where every branch bound is assembled in the same
  notation and every input is visibly consumed exactly once

What would discharge it:
- a single proposition-proof ledger using the current witness and citing the supporting notes
  only as lemma justifications, not as extra floating context

## Obligations that are mainly presentation-quality

### 4. Citation polish

Examples:
- pin the exact Dusart theorem/section in a cleaner bibliographic form
- standardize references to Sawhney's note and the forum discussion

These matter for publication quality, but do not presently look like mathematical blockers.

### 5. Reader-facing proof narration

Examples:
- convert the current route notes into a smoother proof narrative
- reduce repeated explanations of why the repo is still claim-safe

This matters for public readability, not for whether the witness currently works.

### 6. Paper-writer integration

Examples:
- seed the explicit candidate into the paper bundle
- turn the proposition candidate into a draft section with theorem/proof/corollary structure

Again, useful, but downstream from the mathematical hardening steps above.

## Honest prioritization

The next mathematically meaningful hardening step is:
- replace the displayed decimal inputs with certified intervals or conservative rational bounds

That is the step most likely to change whether the current repo candidate survives intact.

By contrast, the remaining citation and exposition work is important but does not currently
look like the true blocker.

## Route consequence

The route no longer needs:
- another branch hunt
- another witness search
- or another truncation scan

It now needs:
- one hardening pass on the numerical inputs
- then a theorem-style explicit candidate writeup
