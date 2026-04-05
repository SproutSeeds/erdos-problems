# Problem 848 Weakest Branch Budget at `T = 250`

This note closes `N848.G1.A6` at a witness-budget level.

Goal:
- test whether the weakest public `0.0377` branch is still blocked once both Lemma 2.1 and
  Lemma 2.2 use a larger witness truncation parameter

Witness choice:
- `T = 250`

Reason for this choice:
- it is large enough to shrink the live `A*` tail materially
- it is still tiny compared with the public candidate scales `exp(1420)` and `exp(1958)`
- the discrete inclusion-exclusion terms remain negligible at those scales

## Frozen main-term branch data

From `WEAKEST_CASE_BUDGET.md`:
- `A*` main term: about `0.0251587645`
- `A7 union A18` main term: about `0.0124525434`
- combined weakest-branch main term: about `0.0376113079`
- branch slack to `1/25 = 0.04`: about `0.0023886921`

## Explicit remainder ledger at `T = 250`

### 1. `A*` via Lemma 2.1

From `LEMMA21_TRUNCATION_SCAN.md`:
- `A*` tail density at `T = 250`: about `0.0005641453`
- `A*` discrete term: `23 * (3^23 - 1) / N`

At `N = exp(1420)`:
- the `A*` discrete density is below about `exp(-1392)`

### 2. `A7 union A18` via Lemma 2.2

From `LEMMA22_EXPLICIT_BOUND.md`:
- Lemma 2.2 tail density at `T = 250`: about `0.0000491054`
- worst-case Lemma 2.2 discrete term: `2 * (2^51 - 1) / N`
- prime-count term from `LEMMA22_PRIME_COUNT_BOUND.md`: at most `0.0014095427` for
  every `N >= exp(1420)`

At `N = exp(1420)`:
- the Lemma 2.2 discrete density is below about `exp(-1384)`

### 3. Combined explicit remainder

Adding the two live tail terms gives

- combined tail density about `0.0006132507`

and the combined discrete terms are still negligible at the public candidate scales.

What is still missing:
- no further lemma-level tail term; the remaining work is branch assembly and `eta`

## Combined weakest-branch budget

Main term plus the live explicit tails:

- `0.0376113079 + 0.0006132507 = 0.0382245586`

So the remaining room to `0.04` is still about

- `0.0017754414`

before the final branch bookkeeping.

After inserting the explicit Lemma 2.2 prime-count bound at `N >= exp(1420)`,

- `0.0017754414 - 0.0014095427 ~= 0.0003658987`

So the currently visible room for
- the final `eta` choice
- and any remaining line-by-line bookkeeping losses

is about `3.66e-4`.

## Honest reading

This does **not** yet prove an explicit threshold.

What it **does** show is:
- once `T` is allowed to move, the weakest branch no longer looks blocked by the two lemma
  `N / p^2` tails themselves
- the discrete inclusion-exclusion losses are no longer the issue
- the Lemma 2.2 prime-count term also fits inside the branch budget at the public candidate
  threshold scale
- the route now has a concrete surviving witness margin of about `3.66e-4` for final
  `eta` and bookkeeping losses

So the live unresolved work is narrower than before:
- write the line-by-line full branch assembly with the larger `T`
- record the exact `eta` room that survives that assembly
- then turn that into a genuine explicit-threshold witness candidate

## Route consequence

This means the current proof skeleton now looks plausibly explicitizable in the weakest
branch at the witness scale `N >= exp(1420)`, provided the remaining line-by-line assembly
does not consume more than about `3.66e-4` of density.

That is a materially stronger posture than the one the repo started with:
- the route is no longer waiting on a mystery bottleneck
- it has a concrete witness truncation value
- and it has a concrete surviving witness margin after all currently frozen lemma-level costs
