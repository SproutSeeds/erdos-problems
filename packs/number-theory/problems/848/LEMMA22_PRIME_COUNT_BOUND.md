# Problem 848 Lemma 2.2 Prime-Count Bound

This note closes the outstanding blocker inside `N848.G1.A6`.

Goal:
- freeze the additive `2 pi(N) / N` term that remained unresolved in
  `LEMMA22_EXPLICIT_BOUND.md`

## Source surface

Primary source:
- Pierre Dusart, `Estimates of Some Functions Over Primes without R.H.`

Publicly visible statement used here:
- for `x > 60184`,
  `pi(x) <= x / (log x - 1.1)`

Reference surface:
- the public full-text view mirrored from `arXiv:1002.0442v1`
- see the theorem summary lines recorded in the local research notes

## Candidate threshold scale

The strongest public candidate threshold discussed in the forum workstream is

- `N = exp(1420)`.

Since `exp(1420) > 60184`, Dusart's bound applies. Therefore for every
- `N >= exp(1420)`,

we have

`2 pi(N) / N <= 2 / (log N - 1.1) <= 2 / (1420 - 1.1)`.

Numerically,

- `2 / (1420 - 1.1) ~= 0.0014095427`.

At the weaker public candidate
- `N = exp(1958)`,

the same bound improves to

- `2 / (1958 - 1.1) ~= 0.0010220247`.

So the prime-count term is now explicit, monotone, and numerically small enough to carry into
the weakest-branch witness budget.

## Honest route consequence

This closes the last unfrozen line item inside the provisional `T = 250` branch budget.

The next live question is no longer:
- how to bound the Lemma 2.2 `+1` contribution

It is:
- how much `eta` and final bookkeeping room survives once that bound is inserted into the full
  weakest-branch ledger?
