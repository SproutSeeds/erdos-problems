# Problem 848 Weakest-Case Budget

This note freezes the current best source-backed picture of the weakest branch
in Sawhney's proof.

Scope:
- this is only the `0.0377` branch from the proof
- this is not yet an explicit threshold proof
- this is the budget sheet that the next explicit-threshold step must respect

## Where the `0.0377` branch comes from

Source:
- Sawhney, `Problem_848.pdf`, Section 3, pages 2-3

Branch description:
- assume `A*` contains an even element
- then bound `A*` using Lemma 2.1
- bound `A7 ∪ A18` using Lemma 2.2
- add the two contributions

Public bound recorded in the note:
- `|A| / N <= 0.0377`

Target extremal density:
- `1/25 = 0.04`

Recorded slack to the target:
- `0.04 - 0.0377 = 0.0023`

## Main-term decomposition from the note

### A. `A*` contribution

Source:
- Sawhney, `Problem_848.pdf`, pages 1-2, especially the proof lines leading to the first case split

Displayed bound:
- `|A*| / N <= (23/25) * (1 - prod_{p ≡ 1 mod 4, p >= 13} (1 - 2/p^2)) + o(1)`

Rounded numerical contribution recorded in the note:
- `0.0252`

### B. `A7 ∪ A18` contribution

Source:
- Sawhney, `Problem_848.pdf`, pages 1-2, first Lemma 2.2 application in the proof

Displayed bound:
- `|A7 ∪ A18| / N <= (2/25) * (1 - prod_{p != 2,5} (1 - 1/p^2)) + o(1)`

Rounded numerical contribution recorded in the note:
- `0.0125`

### C. Combined branch

Displayed combination:
- `|A| / N <= 0.0252 + 0.0125 = 0.0377`

Important caution:
- the note records four-decimal rounded numerics, not a repo-frozen exact Euler-product evaluation
- therefore the currently usable slack is not yet a rigorously frozen `0.0023`
- before spending the full `0.0023 N` on explicit error terms, the repo should freeze the exact main-term constants or adopt a deliberate safety reserve

## Non-explicit inputs in this branch

### 1. Lemma 2.1 large-prime tail

Source:
- Sawhney, `Problem_848.pdf`, page 1

Public proof move:
- choose `T = floor(sqrt(log N))`
- control the tail by
  `sum_{T <= p <= N^(1/2)} N / p^2 << N / T`

Current status:
- structurally explicit
- not numerically frozen here

### 2. Lemma 2.1 small-prime inclusion-exclusion remainder

Source:
- Sawhney, `Problem_848.pdf`, page 1

Public proof move:
- truncate to primes `p <= T`
- note `prod_{p <= T} p^2 <= N^(o(1))`
- conclude the inclusion-exclusion remainder is `N^(o(1))`

Current status:
- this is one of the main non-explicit steps in the branch
- the proof architecture is clear, but the repo does not yet have a concrete bound replacing `N^(o(1))`

### 3. Lemma 2.2 large-prime tail

Source:
- Sawhney, `Problem_848.pdf`, page 2

Public proof move:
- again choose `T = floor(sqrt(log N))`
- bound the tail by
  `sum_{T <= p <= N} (N / p^2 + 1) << N / T`

Current status:
- structurally explicit
- not numerically frozen here

### 4. Lemma 2.2 reduction to Lemma 2.1

Source:
- Sawhney, `Problem_848.pdf`, page 2

Public proof move:
- for each prime `p <= T` with `(p, qb) = 1`, the condition `p^2 | (ab + 1)` determines one residue class
- the remaining count is then handled by Lemma 2.1

Current status:
- this means the `0.0377` branch inherits the non-explicit part of Lemma 2.1 twice:
  once directly for `A*`, and once indirectly through Lemma 2.2 for `A7 ∪ A18`

### 5. The `eta` absorption step

Source:
- Sawhney, `Problem_848.pdf`, pages 1-2

Public proof move:
- assume `|A| >= (1/25 - eta) N` for a small absolute `eta`
- absorb `eta` and the `o(1)` errors into the strict inequality between the branch bound and `1/25`

Current status:
- no explicit admissible `eta` is frozen here
- explicit threshold extraction must budget for both the analytic error terms and the `eta` slack used in the contradiction

## Honest current bottleneck

The next true bottleneck is not yet “make Lemma 2.2 explicit.”

The first bottleneck is:
- freeze the exact main-term constants behind `0.0252` and `0.0125`
- decide how much of the nominal `0.0023` slack is actually safe to spend on explicit error terms

Until that is done, any explicit-threshold extraction remains numerically underdetermined at the branch level.

## What this changes

- The route no longer needs a generic “find the weakest branch” task; that is now done.
- The next honest move is to replace rounded branch numerics with an exact or conservatively certified usable slack budget.

## Repo numerical freeze

Date:
- April 5, 2026

Method:
- multiply the Euler-product factors directly over all primes up to `5,000,000`
- use a crude tail envelope from `sum_{n > P} 1 / n^2 < 1 / P`
- treat this as a conservative numerical budget note, not yet as a fully formal proof artifact

Numerical outputs:
- `A*` main-term contribution: `0.0251587645...`
- `A7 ∪ A18` main-term contribution: `0.0124525434...`
- combined weakest-branch main term: `0.0376113079...`
- target density: `0.04`
- numerical slack to the target: `0.0023886920...`

Crude omitted-tail envelope from the `5,000,000` cutoff:
- total branch-level tail contribution below about `3.84e-7`

Conservative numerical reading:
- the branch-level main term appears safely below `0.037612`
- the real branch slack appears closer to `0.002389` than to the rounded `0.0023`
- the rounded note therefore seems to hide roughly `8.8e-5` of additional branch slack

What this still does **not** do:
- it does not make Lemma 2.1 explicit
- it does not make Lemma 2.2 explicit
- it does not yet absorb the `eta` term
- it does not produce a final explicit threshold `N0`

What it **does** do:
- it removes uncertainty about whether four-decimal rounding is eating a significant fraction of the apparent branch budget
- it gives the next explicit-extraction step a more honest target: roughly `0.002388` of branch slack before analytic error absorption
