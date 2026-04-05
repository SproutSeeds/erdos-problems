# Problem 848 Theorem-Style Explicit Note

This note closes `N848.G1.A12`.

## Statement

**Repo explicit candidate.**

Let
- `N >= exp(1420)`,
- `A subseteq [N]`,

and suppose that
- `ab + 1` is never squarefree for all `a, b in A`,
- `|A| >= (1/25 - 10^-4) * N`.

Then the current repo candidate says:
- `A` is contained in either the `7 mod 25` class or the `18 mod 25` class.

## Witness parameters

The shared witness used throughout the current repo candidate is:
- truncation value `T = 250`
- threshold scale `N >= exp(1420)`
- stability parameter `eta = 10^-4`

## Proof skeleton

### Step 1. Split into the public branches from Sawhney's proof

The public proof breaks into the branches whose rounded bounds are:
- `0.0377`
- `0.0358`
- `0.0336`
- `0.0294`

### Step 2. Use the shared explicit witness

The repo now has explicit ledger support for the shared witness:
- `LEMMA21_EXPLICIT_BOUND.md`
- `LEMMA21_TRUNCATION_SCAN.md`
- `LEMMA22_EXPLICIT_BOUND.md`
- `LEMMA22_PRIME_COUNT_BOUND.md`
- `CERTIFIED_NUMERICAL_LEDGER.md`

These notes provide the explicit replacements for the original `o(1)` and `<<` steps at the
chosen witness scale.

### Step 3. Close the tightest branch

`WEAKEST_BRANCH_T250_ASSEMBLY.md` shows that the tightest public branch retains a certified
visible reserve of about
- `2.66e-4`

after all currently frozen lemma-level costs and the working choice
- `eta = 10^-4`.

### Step 4. Check the remaining public branches

`BRANCH_COMPARISON_LEDGER.md` shows that the branches `0.0358`, `0.0336`, and `0.0294` all
retain strictly larger visible reserve than the weakest branch under the same witness.

So no new branch obstruction appears at the current explicit level.

### Step 5. Conclude the repo candidate

Since every public branch in the proof skeleton is controlled by the same witness, the repo
arrives at the proposition-level candidate stated above.

## What this note is and is not

This note **is**:
- a theorem-shaped packaging of the current repo candidate
- a bridge artifact for paper-writer mode
- a clean summary of the current explicit witness

This note is **not yet**:
- a final publication-ready proof
- a formal proof-assistant certificate
- a declaration that Problem 848 is fully solved in the repo

## Remaining gap

The remaining work is no longer “find the right witness.”

It is:
- decide whether the current repo candidate is strong enough to publish internally as a public
  review artifact
- port it into the paper bundle
- and, if desired, replace the current repo-level interval reasoning with stronger formal or
  machine-checked certification
