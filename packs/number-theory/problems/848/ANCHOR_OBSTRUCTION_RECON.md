# Problem 848 Anchor Obstruction Recon

This note records the first strong structural pattern extracted from the exact
bounded-verification packet through `N = 10000`.

## Exact-data facts now frozen

- The exact verifier currently certifies `alpha(G_N) = |{n <= N : n equiv 7 mod 25}|`
  for every `1 <= N <= 10000`.
- The stored witness is always the pure `7 mod 25` class.
- The maximum-clique size only increases when `N equiv 7 mod 25`.
- Equivalently, for every `N <= 10000`,

  `alpha(G_N) = max(0, floor((N - 7) / 25) + 1).`

So the exact packet is already showing a breakpoint law, not just isolated
per-`N` confirmations.

## Four-anchor obstruction pattern

Let

- `a1 = 7`
- `a2 = 32`
- `a3 = 57`
- `a4 = 82`

These are the first four members of the `7 mod 25` class.

Empirical fact from the exact scan:

- for every `30 <= n <= 10000` with `n not equiv 7 mod 25`,
- at least one of
  - `7n + 1`
  - `32n + 1`
  - `57n + 1`
  - `82n + 1`
  is squarefree.

Equivalently, every outsider `n` in that range is incompatible with at least one
of the four fixed anchors `{7, 32, 57, 82}`.

The only failures to this four-anchor witness rule in `1..10000` are the tiny
startup values

`1, 2, 3, 4, 5, 6, 9, 13, 14, 17, 21, 23, 24, 25, 29`.

So from `n >= 30` onward, the obstruction appears to be governed by a fixed
finite anchor set.

## Why this matters

This does **not** yet prove optimality of the `7 mod 25` class by itself.
An outsider being incompatible with one anchor only shows it cannot be added to
the full anchor-containing clique unchanged.

What it does suggest is a more proof-shaped route:

1. Prove a four-anchor obstruction lemma beyond a finite startup range.
2. Convert that obstruction into an exchange or packing inequality for cliques.
3. Reduce the remaining work to a tiny finite stub plus a breakpoint argument.

That route is much closer to a real theorem than “just keep brute-forcing
larger `N`”.

## Immediate research questions

- Can the four-anchor obstruction be proved for all `n >= 30`?
- Is there a smaller anchor set than `{7, 32, 57, 82}` that already works?
- Can every large clique be shown to contain enough of these anchors that
  outsider substitutions cannot preserve clique size?
- Can the breakpoint law
  `alpha(G_N) = alpha(G_{N-1})` for `N not equiv 7 mod 25`
  be derived from the anchor obstruction plus a monotonicity argument?

## Current best guess

The exact verifier is now best used as a structure miner:

- not mainly to chase larger raw intervals,
- but to identify the smallest anchor and breakpoint statements that would turn
  the finite-check lane into a short proof plus a bounded startup table.
