# Problem 848 Lemma 2.2 Explicit Bound

This note is the first half of `N848.G1.A6`.

Goal:
- carry the larger-truncation Lemma 2.1 route into Lemma 2.2 without retreating to
  `T = floor(sqrt(log N))`

## Source surface

Primary source:
- Sawhney, `Problem_848.pdf`, Lemma 2.2, page 2

Support source:
- `LEMMA21_EXPLICIT_BOUND.md`
- `LEMMA21_TRUNCATION_SCAN.md`

## Setup

Fix:
- `q` a perfect square
- `t mod q`
- `1 <= b <= N`

Assume the Lemma 2.2 non-degeneracy condition from the note:
- there is no prime `p` such that `p^2 | q` and `p^2 | (bt + 1)`

Define

`V(N, q, t, b) = {a in [N] : a ≡ t mod q and mu(ab + 1) = 0}`.

Choose any truncation parameter
- `2 <= T <= N^(1/2)`.

## Large-prime tail

If `a in V(N, q, t, b)`, then there exists a prime `p` with
- `p^2 | (ab + 1)`
- `(p, qb) = 1`

For a fixed prime `p` with `(p, qb) = 1`, the condition `p^2 | (ab + 1)` determines exactly
one residue class modulo `p^2` for `a`, because `b` is invertible modulo `p^2`.

Together with `a ≡ t mod q`, this gives at most one residue class modulo `q p^2`, hence

`|{a in [N] : a ≡ t mod q and p^2 | (ab + 1)}| <= N / (q p^2) + 1`.

Summing over primes `p > T` gives the explicit large-prime tail

`sum_{p > T, (p, qb) = 1} (N / (q p^2) + 1)`

and therefore

`<= (N/q) * sum_{p > T, (p, qb) = 1} 1/p^2 + pi(N)`.

## Small-prime reduction to Lemma 2.1

For primes `p <= T` with `(p, qb) = 1`, the condition `p^2 | (ab + 1)` gives exactly one
residue class modulo `p^2`.

So on the truncated range `p <= T`, Lemma 2.2 reduces to Lemma 2.1 with
- `|R_p| = 1`

instead of `|R_p| <= 2`.

Applying the one-sided explicit Lemma 2.1 bound to the small-prime part gives

`|V_small| <= (N/q) * (1 - prod_{p <= T, (p, qb) = 1} (1 - 1/p^2)) + (2^m - 1)`

where
- `m = #{p <= T : (p, qb) = 1}`.

This is sharper than the `A*` branch:
- the discrete remainder is `2^m - 1`, not `3^m - 1`

## One-sided explicit Lemma 2.2 bound

Combining the small-prime reduction with the large-prime tail gives

`|V(N, q, t, b)| <= (N/q) * (1 - prod_{p, (p, qb) = 1} (1 - 1/p^2)) + (2^m - 1) + (N/q) * sum_{p > T, (p, qb) = 1} 1/p^2 + pi(N)`.

This is the explicit one-sided replacement for the note's
- `<< N / sqrt(log N)` error term in Lemma 2.2.

## Specialization to the weakest `0.0377` branch

In the branch with an even `b in A*`, Lemma 2.2 is applied to the two residue classes
- `7 mod 25`
- `18 mod 25`

So `q = 25` and there are two classes total.

In the worst case, `b` excludes no additional primes beyond `2` and `5`, so

- `m <= pi(T) - 2`
- `sum_{p > T, (p, qb) = 1} 1/p^2 <= sum_{p > T, p != 2, 5} 1/p^2`

Hence the total density remainder for `A7 union A18` is bounded by

`(2/N) * (2^m - 1) + (2/25) * sum_{p > T, p != 2, 5} 1/p^2 + 2 pi(N) / N`.

## Witness value `T = 250`

At `T = 250`:
- `pi(250) = 53`
- so the worst-case small-prime count is `m <= 51`
- the discrete remainder is at most `2 * (2^51 - 1) / N`
- the prime-tail sum over all primes `p > 250`, using the same conservative cutoff method as
  before, is about `0.00061382`
- therefore the Lemma 2.2 tail density contribution is about `0.00004911`

At the public candidate threshold `N = exp(1420)`:
- the discrete term is below about `exp(-1384)`

But one term is still unresolved here:
- the additive `pi(N)` contribution coming from the `+1` part of the large-prime count

So for the branch under discussion, Lemma 2.2 no longer looks blocked by its
- `N / (q p^2)` tail
- or its small-prime inclusion-exclusion remainder

but it still needs an explicit prime-counting bound before its full density cost is frozen.

## Honest route consequence

The explicit route can now say:
- Lemma 2.1 is explicit
- Lemma 2.2 is also explicit at the same one-sided level
- but the Lemma 2.2 prime-count tail is not yet numerically frozen

It is:
- how much total slack remains after the outstanding `pi(N)` term is bounded and both lemmas
  are assembled in the weakest branch?
