# Preliminaries

We write `[n] = {1, ..., n}`. A family `F` of subsets of `[n]` is a
`k`-sunflower if there exist distinct sets `A_1, ..., A_k in F` such that
`A_i cap A_j` is the same set for every `i != j`. Equivalently, if
`K = A_1 cap ... cap A_k`, then the petals `A_1 \ K, ..., A_k \ K` are pairwise
disjoint.

Problem `857` asks for the least integer `m(n,k)` such that every family of
`m(n,k)` subsets of `[n]` contains a `k`-sunflower. The target asymptotic shape
recorded in this repo is an estimate of the form `m(n,k) <= C(k)^n`. This is the
weak or non-uniform sunflower problem, to be contrasted with the more classical
uniform parameter `f_r(w)` governing families of `w`-element sets. The uniform
and weak formulations are not identical, but the methods developed for each have
strongly influenced the other.

Three pieces of background will be used repeatedly in the discussion below.

First, Erdos and Rado proved the classical sunflower lemma, showing that for
fixed `r` there is always some finite threshold forcing an `r`-sunflower inside a
large enough `w`-uniform family. Their conjectural vision is that this threshold
should be exponential in `w` for each fixed `r`.

Second, Erdos and Szemeredi formulated the non-uniform sunflower-free problem in
a way that directly informs problem `857`. For the present draft, that paper
serves as the main historical source for the weak problem rather than merely as a
neighboring result.

Third, when `k = 3`, the weak problem interacts with cap-set-type methods. The
problem page cites Alon, Shpilka, and Umans for this connection and records the
Naslund-Sawin bound
`m(n,3) <= (3 / 2^{2/3})^{(1+o(1))n}`.

Finally, we separate three notions that must not be conflated in this paper:
- proof posture: whether the asymptotic weak sunflower problem has been solved
- route posture: which research lane is currently the live frontier
- formalization posture: whether public theorem modules or verification artifacts
  have been exposed and in what scope

For problem `857`, these are respectively:
- open
- `anchored_selector_linearization`
- active, but not yet a public formal proof bundle for full closure
