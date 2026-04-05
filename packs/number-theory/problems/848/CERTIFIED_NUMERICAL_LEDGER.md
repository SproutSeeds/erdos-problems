# Problem 848 Certified Numerical Ledger

This note closes `N848.G1.A11`.

Purpose:
- replace the displayed decimal inputs used in the current witness with conservative machine
  intervals

Scope:
- this is still a repo-level certification note, not a formal proof-assistant artifact
- the goal is to eliminate naked decimal approximations from the current witness candidate

## Method

Cutoff:
- enumerate primes up to `5,000,000`

For the Euler-product main terms:
- multiply the truncated product in machine arithmetic
- apply a conservative relative rounding envelope `n * eps / (1 - n * eps)` where `n` is the
  number of factors and `eps = 2^-52`
- apply a missing-tail lower bound using
  - `sum_{p > P} 2 / p^2 <= 2 / P` for the `A*` product
  - `sum_{p > P} 1 / p^2 <= 1 / P` for the `A7 union A18` product

For the tail sums:
- sum the prime-square reciprocals up to the same cutoff
- add both a summation-error envelope and the missing-tail envelope `1 / P`

## Certified upper bounds used by the witness

### 1. `A*` main term

Certified upper bound:
- `A* main <= 0.0251591225`

### 2. `A7 union A18` main term

Certified upper bound:
- `A7 union A18 main <= 0.0124525569`

### 3. `A*` tail at `T = 250`

Certified upper bound:
- `A* tail <= 0.0005641454`

### 4. Two-class Lemma 2.2 tail at `T = 250`

Certified upper bound:
- `Lemma 2.2 tail <= 0.0000491055`

### 5. Two-class prime-count term at `N >= exp(1420)`

From `LEMMA22_PRIME_COUNT_BOUND.md`:
- `2 pi(N) / N <= 0.0014095427`

## Certified weakest-branch witness

Using only the certified upper bounds above, the weakest branch satisfies

- `|A| / N <= 0.0396344729`

for the shared witness scale
- `N >= exp(1420)`
- `T = 250`.

So the certified visible reserve to `1/25 = 0.04` is at least

- `0.04 - 0.0396344729 = 0.0003655271`.

After the working choice
- `eta = 10^-4`,

the certified visible reserve is still at least

- `0.0002655271`.

## Honest consequence

This note removes the main numerical discomfort in the current repo candidate:
- the witness no longer depends only on display decimals copied from exploratory notes

What it still does **not** provide:
- a formal proof-assistant certificate
- a publication-ready theorem writeup

But it does mean the current route can now treat the witness as numerically hardened at the
repo level.
