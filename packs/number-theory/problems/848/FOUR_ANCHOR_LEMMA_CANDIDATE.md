# Problem 848 Four-Anchor Lemma Candidate

This note promotes the anchor recon into a theorem-shaped candidate.

## Candidate lemma

Let

- `a1 = 7`
- `a2 = 32`
- `a3 = 57`
- `a4 = 82`

Then for every integer `n >= 30` with `n not equiv 7 (mod 25)`, at least one of

- `7n + 1`
- `32n + 1`
- `57n + 1`
- `82n + 1`

is squarefree.

Equivalently, every outsider `n >= 30` is incompatible with at least one of the
four fixed anchors `{7, 32, 57, 82}`.

## What is already verified

- Exact clique packet through `N = 10000`:
  - `EXACT_SMALL_N_1_10000_CERTIFICATE.md`
  - `EXACT_SMALL_N_1_10000_RESULTS.json`
- Direct anchor scan for the candidate set:
  - `ANCHOR_OBSTRUCTION_7_32_57_82.json`
- Small-anchor search ledger:
  - `ANCHOR_MINIMALITY_LEDGER.md`
  - `ANCHOR_SUBSET_SEARCH_PREFIX10_K3_K4.json`

The direct anchor scan currently confirms:

- no failures in `30..10000`
- witness usage counts:
  - `7`: `6187`
  - `32`: `2941`
  - `57`: `402`
  - `82`: `42`

So the obstruction is real, uneven, and highly structured.

## Why this lemma matters

If the four-anchor lemma is proved, then the exact packet is no longer only a
large finite certificate. It becomes evidence for a more conceptual route:

1. Every outsider is blocked by a fixed finite anchor set.
2. That obstruction should force a breakpoint law for clique growth.
3. The only remaining work should be a finite startup stub and an exchange or
   monotonicity argument.

That would be much closer to a real closure theorem than continuing exact
verification indefinitely.

## Proof obligations

The current candidate is **not** proved. The main obligations are:

1. Show the four-anchor obstruction for all `n >= 30`, not just `n <= 10000`.
2. Convert anchor obstruction into a clique-size consequence.
3. Explain why the full `7 mod 25` class remains optimal even though the
   obstruction is expressed using only four anchor elements.
4. Close the startup range `n < 30` explicitly.

## Most plausible routes from here

### Route A: modular obstruction proof

Treat each condition `qn + 1` non-squarefree as a union of square-modulus
congruence classes and prove that no `n >= 30`, `n not equiv 7 (mod 25)`,
can lie in all four unions simultaneously.

### Route B: exchange lemma first

Prove that any maximal clique not equal to the `7 mod 25` class must contain
enough of the anchor set that an outsider can be exchanged away without loss.

### Route C: breakpoint law first

Use the exact packet to conjecture and then prove directly that

`alpha(G_N) = alpha(G_{N-1})` for `N not equiv 7 (mod 25)`

and

`alpha(G_N) = alpha(G_{N-1}) + 1` for `N equiv 7 (mod 25), N >= 7`.

The four-anchor lemma would then become the local obstruction that explains the
flat steps.

## Current recommendation

The next serious move should be a proof attempt for the four-anchor lemma,
supported by modular residue analysis and square-divisibility ledgers, not just
another raw exact interval extension.
