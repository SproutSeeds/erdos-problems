# Problem 848 Exact Small-`N` Certificate: `1..2000`

This is the first exact bounded-verification certificate frozen in the repo for Problem `848`.

## Claim

For every `N` with `1 <= N <= 2000`, the maximum size of a set `A subseteq [N]` such that
`ab + 1` is never squarefree for all `a, b in A` is equal to the size of the `7 mod 25`
residue class in `[N]`.

This certificate only covers the interval `1..2000`.

## Method class

- `exact_small_n`

## Reproduction

Command used:

```bash
node packs/number-theory/problems/848/compute/problem848_small_n_exact_scan.mjs \
  --min 1 \
  --max 2000 \
  --json-output packs/number-theory/problems/848/EXACT_SMALL_N_1_2000_RESULTS.json
```

The script:
- filters vertices by the loop condition `a^2 + 1` not squarefree
- builds the compatibility graph where `a` and `b` are adjacent exactly when `ab + 1` is not
  squarefree
- computes an exact maximum clique for each `N`
- compares that maximum clique size against the `7 mod 25` class size

## Outcome

- interval: `1..2000`
- result: verified
- every scanned `N` satisfied:
  - `max_clique_size = |{n in [N] : n equiv 7 mod 25}|`

The machine-readable result packet is:
- `EXACT_SMALL_N_1_2000_RESULTS.json`

## Scope warning

This does **not** certify anything above `2000`.
It is a base interval certificate only.

## Why this interval matters

- it creates a real in-repo covered interval, not just a verification plan
- it is large enough to be a meaningful finite-check foothold
- it does not rely on disputed public computation
- it gives the bounded-verification lane a concrete certificate format and reproduction path
