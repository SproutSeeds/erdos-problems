# Problem 857 Statement

Source: <https://www.erdosproblems.com/857>

Canonical public formulation:

Let `m = m(n,k)` be minimal such that every family
`A_1, ..., A_m subseteq {1, ..., n}` contains a sunflower of size `k`,
meaning a subfamily of `k` sets whose pairwise intersections are all equal.
Estimate `m(n,k)`, or, more ambitiously, determine its asymptotic growth.

Working normalization in this repo:
- weak sunflower problem
- non-uniform set systems over `[n]`
- target asymptotic shape: `m(n,k) <= C(k)^n`
- `k = 3` is the most developed nearby case in the public literature

Context notes:
- the Erdos Problems page records that Erdos also asked an equivalent union-formulation version
- the current repo pack treats problem `857` as the weak / non-uniform core of the sunflower cluster
- the active public route is `anchored_selector_linearization`
