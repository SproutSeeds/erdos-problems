# Problem 848 Lemma 2.1 Explicit Bound

This note closes the current `N848.G1.A4` task:
- replace the hidden `<<` and `N^(o(1))` steps in Lemma 2.1 with an explicit one-sided bound
- identify which remainder term is actually binding for the `0.0377` branch

Scope:
- this is still not a full explicit threshold proof
- this note only packages the first explicit Lemma 2.1 remainder bound
- the goal is to decide what the next honest analytic move must be

## Source surface

Primary source:
- Sawhney, `Problem_848.pdf`, Lemma 2.1, pages 1-2

Support source:
- `erdosproblems.com/forum/thread/848`

## Setup

Let
- `U(P; N, q, t)` denote the set of `n in [N]` such that `n ≡ t mod q` and
  `n mod p^2 in R_p` for at least one `p in P`
- `|R_p| <= 2`
- `R_p = empty` whenever `(p, q) != 1`
- `T = floor(sqrt(log N))`

Write:
- `P_<= = {p in P : p <= T}`
- `P_> = {p in P : T < p <= N^(1/2)}`
- `x_p = |R_p| / p^2`
- `m = |P_<=|`

The lemma in the note states
- `|U(P; N, q, t) - (N/q) * (1 - prod_{p in P} (1 - x_p))| << N / sqrt(log N)`

For the route, the important question is not the asymptotic statement itself. It is:
- what explicit upper bound can replace the hidden remainder when we only need a one-sided
  inequality for the density casework?

## Explicit large-prime tail

For each `p in P_>` and each `r in R_p`, the congruence conditions
- `n ≡ t mod q`
- `n ≡ r mod p^2`

define at most one residue class modulo `q p^2`, because `(p, q) = 1` whenever `R_p` is
nonempty. Therefore

`|{n in [N] : n ≡ t mod q and n ≡ r mod p^2}| <= N / (q p^2) + 1`.

Summing over the at most two allowed residues gives

`|{n in [N] : n ≡ t mod q and n mod p^2 in R_p}| <= 2N / (q p^2) + 2`.

By a union bound over `p in P_>`,

`|U(P_>; N, q, t)| <= (2N/q) * sum_{p in P_>} 1/p^2 + 2|P_>|`.

So the proof's hidden large-prime tail is explicitly bounded by

`(2N/q) * sum_{p in P, p > T} 1/p^2 + 2 pi(N^(1/2))`.

This is the first source-backed place where the route can choose between:
- the original crude integer tail `sum_{n > T} 1/n^2 < 1/(T - 1)`
- a sharper prime-only tail, which the public forum discussion identifies as the more
  realistic path

## Explicit small-prime inclusion-exclusion remainder

Consider the truncated union over `P_<=`.

For each nonempty subset `S subseteq P_<=`, inclusion-exclusion introduces the intersection

`I_S = | intersection_{p in S} {n in [N] : n mod p^2 in R_p} intersection {n in [N] : n ≡ t mod q} |`.

For a fixed choice of one residue from each `R_p`, the congruence system determines exactly
one residue class modulo `q * prod_{p in S} p^2`. Hence

`I_S = (N/q) * prod_{p in S} x_p + E_S`

with

`|E_S| <= prod_{p in S} |R_p| <= 2^{|S|}`.

Summing these errors through inclusion-exclusion gives

`|U(P_<=; N, q, t) - (N/q) * (1 - prod_{p in P_<=} (1 - x_p))| <= sum_{empty != S subseteq P_<=} 2^{|S|}`

and therefore

`|U(P_<=; N, q, t) - (N/q) * (1 - prod_{p in P_<=} (1 - x_p))| <= 3^m - 1`.

This is the explicit replacement for the note's `N^(o(1))` step.

## One-sided explicit Lemma 2.1 bound

Combining the truncated inclusion-exclusion bound with the large-prime union bound yields

`|U(P; N, q, t)| <= (N/q) * (1 - prod_{p in P} (1 - x_p)) + (3^m - 1) + (2N/q) * sum_{p in P, p > T} 1/p^2 + 2 pi(N^(1/2))`.

This is weaker than the asymptotic note in two ways:
- it is only one-sided
- it keeps discrete counting terms instead of burying them in `o(1)`

But for the route, it is enough:
- the casework only needs an upper bound
- the new expression cleanly separates the tail term from the small-prime discretization

## Specialization to the `A*` branch

In the weakest `0.0377` branch of the proof:
- `q = 25`
- there are `23` residue classes modulo `25` contributing to `A*`
- `P = {p prime : p ≡ 1 mod 4 and p >= 13}`
- each active prime contributes exactly `|R_p| = 2`

So the explicit density bound becomes

`|A*| / N <= (23/25) * (1 - prod_{p ≡ 1 mod 4, p >= 13} (1 - 2/p^2))`

plus the explicit remainder

`(23/N) * (3^m - 1) + (46/25) * sum_{p > T, p ≡ 1 mod 4} 1/p^2 + 46 * pi_{1 mod 4}(N^(1/2)) / N`

where
- `m = |{p <= T : p ≡ 1 mod 4 and p >= 13}|`

## What the explicit bound says at public threshold candidates

The small-prime remainder is not the live problem.

For the public candidate scales mentioned on the forum:

### 1. `N = exp(1420)` so `T = floor(sqrt(log N)) = 37`

Numerical support:
- `m = 4`, so the discrete inclusion-exclusion term is exactly `23 * (3^4 - 1) / N = 1840 / N`
- summing `1/p^2` over primes `p ≡ 1 mod 4`, `p > 37`, up to `5,000,000`, then adding the
  crude tail envelope `1 / 5,000,000`, gives about `0.00251707`
- multiplying by the branch coefficient `46/25` gives a tail-density penalty about
  `0.00463141`

### 2. `N = exp(1958)` so `T = floor(sqrt(log N)) = 44`

Numerical support:
- `m = 5`, so the discrete inclusion-exclusion term is exactly `23 * (3^5 - 1) / N = 5566 / N`
- the same prime-tail computation gives about `0.00192219`
- multiplying by `46/25` gives a tail-density penalty about `0.00353682`

### 3. Comparison with the frozen weakest-branch slack

From `WEAKEST_CASE_BUDGET.md`, the current branch-level slack before analytic error
absorption is about `0.00238869`.

Therefore:
- the small-prime discretization term is negligible at these scales
- the large-prime tail already exceeds the full branch slack at both `exp(1420)` and
  `exp(1958)`
- this happens before paying for Lemma 2.2 or for the final `eta` absorption

If one keeps the proof's even cruder integer-tail estimate
- `sum_{n > T} 1/n^2 < 1/(T - 1)`

then the `A*` density penalty alone is
- about `0.05111` at `T = 37`
- about `0.04279` at `T = 44`

which is completely incompatible with the frozen branch slack.

## Honest route consequence

This closes the current question behind `N848.G1.A4`.

The new exact route reading is:
- Lemma 2.1 is now explicit enough to see the structure of the loss
- the `N^(o(1))` / inclusion-exclusion discretization is not the real blocker
- the large-prime tail is the live analytic bottleneck
- keeping `T = floor(sqrt(log N))` and the crude tail treatment is too lossy for the
  public threshold candidates discussed so far

So the next honest move is no longer
- “make Lemma 2.1 explicit”

It is:
- improve the large-prime tail or the truncation parameter before spending time on more
  bookkeeping

## Numerical method note

The prime-tail support numbers above are not yet formal proof artifacts.

They were obtained by:
- summing over all primes up to `5,000,000`
- restricting to the `1 mod 4` primes for the `A*` branch
- adding the crude tail envelope `sum_{n > 5,000,000} 1/n^2 < 1 / 5,000,000`

This is conservative enough for route guidance, but not yet the final explicit-threshold
certificate.
