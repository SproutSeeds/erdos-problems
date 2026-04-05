# Problem 848 Weakest Branch Assembly at `T = 250`

This note closes `N848.G1.A7`.

Goal:
- turn the `T = 250` weakest-branch witness budget into a line-by-line branch ledger
- freeze an honest working `eta` value for this branch

Scope:
- this is only the weakest public `0.0377` branch
- this is not yet a full explicit-threshold proof for Proposition 1.1
- the remaining repo question is whether the same witness closes the other public branches

## Branch setup

Assume:
- `N >= exp(1420)`
- `eta > 0`
- `|A| >= (1/25 - eta) * N`
- the branch with an even element `b in A* = A \\ (A7 union A18)` is active
- truncation witness `T = 250`

## Line-by-line upper bound ledger

### 1. `A*` main term

From `WEAKEST_CASE_BUDGET.md`:
- `A* / N <= 0.0251587645... + remainder`

### 2. `A*` explicit remainder

From `LEMMA21_TRUNCATION_SCAN.md`:
- `A*` tail density at `T = 250`: about `0.0005641453`
- `A*` discrete term: `23 * (3^23 - 1) / N`

At `N >= exp(1420)`, the discrete term is astronomically small and far below the visible
decimal budget.

### 3. `A7 union A18` main term

From `WEAKEST_CASE_BUDGET.md`:
- `(A7 union A18) / N <= 0.0124525434... + remainder`

### 4. `A7 union A18` explicit remainder

From `LEMMA22_EXPLICIT_BOUND.md` and `LEMMA22_PRIME_COUNT_BOUND.md`:
- Lemma 2.2 `N / p^2` tail density at `T = 250`: about `0.0000491054`
- Lemma 2.2 prime-count term at `N >= exp(1420)`: at most `0.0014095427`
- Lemma 2.2 discrete term: `2 * (2^51 - 1) / N`

Again, the discrete term is astronomically small at `N >= exp(1420)`.

## Combined explicit branch bound

Collecting the frozen decimal contributions gives

- branch main term: `0.0376113079`
- `A*` tail: `0.0005641453`
- Lemma 2.2 tail: `0.0000491054`
- Lemma 2.2 prime-count term: `0.0014095427`

So the visible explicit branch bound is

- `0.0376113079 + 0.0005641453 + 0.0000491054 + 0.0014095427`
- `= 0.0396341013` up to rounding in the displayed decimals

This leaves visible room to `1/25 = 0.04` of about

- `0.04 - 0.0396341013 = 0.0003658987`.

## Working `eta` choice

The branch contradiction only needs a positive margin after paying for `eta`.

A conservative working choice is

- `eta_work = 0.0001`.

Then the remaining visible reserve is still about

- `0.0003658987 - 0.0001 = 0.0002658987`.

So with this working choice, the branch still retains about `2.66e-4` of visible room for
the tiny discrete terms and any final rounding/bookkeeping losses.

## Honest branch conclusion

At the witness scale
- `N >= exp(1420)`,
- `T = 250`,
- `eta = 10^-4`,

the weakest public branch now appears explicitly contradictory.

What this does **not** yet prove:
- that `exp(1420)` is a fully verified threshold for the whole proposition
- that the stronger public candidate thresholds are unnecessary
- that every other public branch has already been checked with the same explicit witness

What it **does** prove for the repo route:
- the weakest public branch is no longer the blocker
- the repo now has a concrete explicit branch witness with positive visible reserve

## Next route consequence

The next honest move is:
- carry the same witness philosophy into the other public proof branches
- check whether `T = 250`, `N >= exp(1420)`, and `eta = 10^-4` also close them
- if one branch needs a different witness, record that precisely instead of forcing uniformity
