# Problem 857 Multiplicative Reorientation

This note records a research-direction update for the weak sunflower program
around problem `857`.

It does not replace the current public frontier packet. The canonical live route
is still `anchored_selector_linearization`, and problem `857` remains open.

## Why this note exists

The sunflower quartet in this repo already treats
- `857` as the weak / non-uniform sunflower core
- `536` as the natural-density LCM bridge
- `856` as the harmonic-density LCM bridge

A recent preprint sharpens that bridge:

- Quanyu Tang and Shengtong Zhang, "Harmonic LCM patterns and sunflower-free
  capacity", arXiv:2512.20055 (2025),
  <https://arxiv.org/abs/2512.20055>.

At the abstract level, that paper introduces the sunflower-free capacity
`mu_k^S := limsup F_k(n)^(1/n)` together with a harmonic LCM extremal function
`f_k(N)`, and gives comparison bounds between them. It also states that failure
of the Erdős-Szemerédi fixed-`k` sunflower conjecture (`mu_k^S = 2`) is
equivalent to `f_k(N) = (log N)^(1-o(1))`.

That is enough to justify a stronger bridge posture in `erdos-problems`.

## What we can safely adopt now

`Verified`
- `mu_k^S` is now a useful literature-level capacity object for the weak
  sunflower problem.
- Harmonic / multiplicative LCM extremal functions are not just loose analogies;
  they are mathematically coupled to sunflower-free growth rates.
- Problems `536` and `856` should be treated as active bridge problems that can
  influence how we prioritize `857` experiments and documentation.

`Heuristic`
- Prime-support and squarefree representations are reasonable local search
  coordinates for new `857` experiments.
- Capacity estimation, LCM growth tracking, and process-style sunflower-free
  simulations are now higher-value exploratory lanes than generic family-size
  maximization alone.
- The most promising local combination is prime-support optimization plus
  sunflower-free process simulation.

## What we should not overclaim

Do not write any of the following into canonical status files unless a stronger
source or local theorem packet is added first:

- "Problem 857 is equivalent to controlling a single LCM extremal function."
- "The sunflower conjecture is equivalent to `f_k(N)` being sub-polynomial in
  `log N`."
- "The multiplicative reformulation replaces the active anchored-selector
  frontier."

The current source we have justifies comparison bounds and a specific failure-case
criterion. It does not, on its face, justify collapsing the entire `857` program
into one unconditional hard equivalence with the wording above.

## Recommended repo posture

Keep the current public status ladder unchanged:
- open problem
- active route
- route breakthrough
- problem solved

Keep the current public frontier unchanged:
- active route: `anchored_selector_linearization`
- active ticket: `T10`
- next honest move: promote the helper/theorem stack into
  `anchored_selector_linearization_realized`

Add the multiplicative-capacity story as an adjacent research note:
- useful for bridge prioritization
- useful for local compute and experiment design
- not yet a replacement for the live theorem-facing route packet

## Suggested experimental lanes

If we open a new local scout or research lane for `857`, the most compatible
extensions are:

1. Prime-support optimization
   Build squarefree / prime-support families, track overlap structure, and score
   them by both sunflower obstructions and LCM-side growth proxies.
2. Capacity estimation
   Estimate local behavior of `mu_k^S`-style growth indicators and compare them
   against multiplicative proxies rather than raw family size alone.
3. Process simulation
   Run greedy or random sunflower-avoidance processes and record the emergent
   intersection profile instead of only the terminal family size.
4. Structural classification
   Cluster near-extremal families by intersection distribution, degree profile,
   and multiplicative shadow.

## Suggested artifact names

These names fit the proposed pivot, but they should start as local research
artifacts before being promoted into canonical pack evidence:

- `prime_support_family.json`
- `capacity_estimate.json`
- `process_simulation_trace.json`

## Claim discipline

When this note is used in agent handoffs:
- label literature-backed statements as `Verified`
- label bridge extrapolations as `Heuristic`
- label unproved equivalence upgrades as `Conjecture`

That keeps the new direction visible without blurring route progress into
mathematical closure.
