# Problem 848 Explicit Candidate Review

## Current repo candidate

The current repo candidate is:

- `N >= exp(1420)`
- `T = 250`
- `eta = 10^-4`

and the claim-safe conclusion is:

- if `A subseteq [N]` and `ab + 1` is never squarefree for all `a, b in A`
- and `|A| >= (1/25 - 10^-4) * N`
- then `A` is contained in either the `7 mod 25` class or the `18 mod 25` class

## Why this is review-ready

The repo now has explicit support notes for:
- the weakest branch main term
- explicit Lemma 2.1 and Lemma 2.2 bounds
- the prime-count term
- a weakest-branch assembly ledger
- a branch-comparison ledger for the other public branches
- a certified numerical ledger replacing bare display decimals

Read in this order:
- `packs/number-theory/problems/848/PROPOSITION_EXPLICIT_CANDIDATE.md`
- `packs/number-theory/problems/848/THEOREM_STYLE_EXPLICIT_NOTE.md`
- `packs/number-theory/problems/848/CERTIFIED_NUMERICAL_LEDGER.md`
- `packs/number-theory/problems/848/WEAKEST_BRANCH_T250_ASSEMBLY.md`
- `packs/number-theory/problems/848/BRANCH_COMPARISON_LEDGER.md`

## What this is **not** claiming

This review artifact does **not** claim:
- that Problem 848 is fully solved in the repo
- that the finite range below `exp(1420)` has been closed
- that `exp(1420)` is optimal
- that the current note set is already publication-ready

The current status is:
- explicit repo candidate: yes
- publication-ready explicit theorem artifact: not yet
- full all-`N` closure in this repo: not yet

## Suggested reviewer questions

- Is every displayed decimal used in the witness backed by the certified ledger?
- Does the theorem-style note consume every branch cleanly without hidden extra losses?
- Is the distinction between repo candidate and solved/public-truth claim clear enough?
- Should the next surface be the paper bundle, a public review post, or both?
