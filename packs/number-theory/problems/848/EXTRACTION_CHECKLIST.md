# Problem 848 Extraction Checklist

This checklist turns the current threshold ledger into the next explicit route task.

Goal:
- identify exactly what must be made numerical before the existential `N0` in Sawhney's note becomes a usable explicit threshold

## Margin ledger from the public note

Target extremal density:
- `1/25 = 0.04`

Rounded case bounds recorded in the note:
- Case 1: `0.0377`
- Case 2: `0.0358`
- Case 3: `0.0336`
- Final mixed-class case: `0.0294`

Current margin to the target:
- Case 1 slack: `0.0400 - 0.0377 = 0.0023`
- Case 2 slack: `0.0400 - 0.0358 = 0.0042`
- Case 3 slack: `0.0400 - 0.0336 = 0.0064`
- Final mixed-class slack: `0.0400 - 0.0294 = 0.0106`

Immediate implication:
- the weakest case is the `0.0377` branch
- any fully explicit threshold extraction has to force the accumulated error terms in that branch below the available `0.0023 N` slack
- before spending that full slack, the repo should freeze the exact main-term constants behind `0.0252` and `0.0125`, since the public note only records rounded decimals

## Proof components to quantify

### A. Lemma 2.1 tail and inclusion-exclusion error

Need:
- explicit control of the prime-square tail `sum_{T <= p <= N^(1/2)} N/p^2`
- explicit control of the small-prime inclusion-exclusion remainder
- an explicit version of the `N^(o(1))` term coming from the small-prime product

Route question:
- can these be made comfortably smaller than the smallest slack without overcomplicating the rest of the proof?

### B. Lemma 2.2 progression error

Need:
- explicit control of the tail over primes dividing `ab+1`
- a quantitative replacement for the `<< N / sqrt(log N)` term

Route question:
- is this the actual bottleneck, as the public forum discussion suggests?

### C. Choice of `eta`

Need:
- identify where the proof requires a small absolute `eta`
- determine whether the proof ever needs a specific lower ceiling on `eta`, or only that `eta` be less than the smallest surviving numerical slack after error absorption

### D. Final case assembly

Need:
- for each case, record the exact main-term bound and the admissible total error budget
- verify which branch determines the final threshold

Current belief:
- the `0.0377` case is the active bottleneck until a sharper calculation says otherwise

## Work order

1. Freeze the exact or conservatively certified main-term slack for the `0.0377` branch.
2. Extract every hidden constant and error input from Lemma 2.1.
3. Extract every hidden constant and error input from Lemma 2.2.
4. Decide whether the proof can realistically beat the usable branch slack with explicit estimates.
5. Only then decide whether to keep pushing analytic extraction or pivot harder into bounded finite computation.

Current repo posture:
- Step 1 is now complete at a conservative numerical level.
- The next unresolved work is Step 2: make the Lemma 2.1 remainder terms explicit against the branch budget.

## What would count as progress

- a line-by-line list of every non-explicit estimate in Lemma 2.1 and Lemma 2.2
- an exact or conservative usable-slack budget for the weakest branch
- an explicit declaration of which branch sets the threshold
- a clean budget statement for how much of the roughly `0.002388` branch slack is available to Lemma 2.1, Lemma 2.2, and `eta`
- a justified statement like:
  - “the current proof architecture plausibly yields an explicit threshold”
  - or
  - “the current proof architecture is too lossy without a new lemma or better error term”
