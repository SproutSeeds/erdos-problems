# Problem 848 Branch Comparison Ledger

This note closes `N848.G1.A8`.

Question:
- does the current shared witness
  - `T = 250`
  - `N >= exp(1420)`
  - `eta = 10^-4`

already dominate the other public case bounds in Sawhney's proof?

Answer:
- yes, at the repo's current explicit level it does

## Shared witness inputs

From the existing explicit notes:
- weakest-branch main term: `0.0376113079`
- `A*` tail at `T = 250`: `0.0005641453`
- two-class Lemma 2.2 tail at `T = 250`: `0.0000491054`
- one-class prime-count term at `N >= exp(1420)`: at most `1 / (1420 - 1.1)`
- two-class prime-count term at `N >= exp(1420)`: at most `2 / (1420 - 1.1)`

These are enough to compare the other public branches without changing the witness.

## Case `0.0358`

Repo explicit bound at the shared witness:
- main term about `0.0356925181`
- visible tail terms about `0.0002943490`
- one-class prime-count term about `0.0007047713`

Total visible bound:
- about `0.0366916384`

Visible reserve to `0.04`:
- about `0.0033083616`

## Case `0.0336`

Repo explicit bound at the shared witness:
- main term about `0.0334753577`
- visible tail terms about `0.0003311781`
- two-class prime-count term about `0.0014095427`

Total visible bound:
- about `0.0352160784`

Visible reserve to `0.04`:
- about `0.0047839216`

## Case `0.0294`

Repo explicit bound at the shared witness:
- main term about `0.0293394076`
- visible tail terms about `0.0000491054`
- two-class prime-count term about `0.0014095427`

Total visible bound:
- about `0.0307980556`

Visible reserve to `0.04`:
- about `0.0092019444`

## Honest comparison conclusion

At the repo's current explicit level:
- the `0.0377` branch remains the tightest branch
- but it is already closed by the shared witness
- the branches `0.0358`, `0.0336`, and `0.0294` all retain strictly larger visible reserve

So the current witness appears to be a whole-proof witness candidate, not just a
weakest-branch patch.

## Remaining caution

This is still a repo witness ledger, not yet a publication-ready explicit-threshold proof.

What remains:
- package the whole argument as a proposition-level explicit candidate
- decide whether to state `N0 <= exp(1420)` as the current repo witness, or to keep it as a
  claim-safe candidate pending a cleaner writeup

But the route no longer points to another hidden branch obstruction.
