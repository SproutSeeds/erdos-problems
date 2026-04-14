# Problem 848 Exact Small-`N` Certificate: `1..10000`

This is the current exact bounded-verification base certificate frozen in the repo for
Problem `848`.

## Claim

For every `N` with `1 <= N <= 10000`, the maximum size of a set `A subseteq [N]` such that
`ab + 1` is never squarefree for all `a, b in A` is equal to the size of the `7 mod 25`
or `18 mod 25` residue class in `[N]`.

This certificate only covers the interval `1..10000`.

## Method class

- `exact_small_n`

## Reproduction

Command used:

```bash
node packs/number-theory/problems/848/compute/problem848_small_n_exact_scan.mjs \
  --min 1 \
  --max 10000 \
  --json-output packs/number-theory/problems/848/EXACT_SMALL_N_1_10000_RESULTS.json
```

The script:
- filters vertices by the loop condition `a^2 + 1` not squarefree
- grows the compatibility graph incrementally as `N` increases
- keeps the current maximum clique and only solves a new exact clique problem when the fresh
  vertex can actually improve the bound
- emits compact machine-readable rows by recording the residue-class witness directly whenever
  the maximum clique is a full `7 mod 25` or `18 mod 25` class

## Outcome

- interval: `1..10000`
- result: verified
- every scanned `N` satisfied:
  - `max_clique_size = max(|{n in [N] : n equiv 7 mod 25}|, |{n in [N] : n equiv 18 mod 25}|)`

The machine-readable result packet is:
- `EXACT_SMALL_N_1_10000_RESULTS.json`

## Scope warning

This does **not** certify anything above `10000`.
It is a base interval certificate only.

## Why this interval matters

- it creates a real in-repo covered interval, not just a verification plan
- it shows that exact coverage can reach substantially farther than the old pre-incremental
  verifier suggested
- it does not rely on disputed public computation
- it gives the bounded-verification lane a concrete certificate format and reproduction path
