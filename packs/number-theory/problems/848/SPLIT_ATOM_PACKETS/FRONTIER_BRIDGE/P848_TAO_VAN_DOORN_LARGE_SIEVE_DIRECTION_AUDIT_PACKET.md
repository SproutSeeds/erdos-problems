# P848 Tao-van Doorn Large-Sieve Direction Audit

- Status: `large_sieve_reference_verified_direction_mismatch_blocks_threshold_collapse_claim`
- Generated: `2026-04-17T15:36:11Z`
- Recommended next action: `continue_current_p848_next_rank_batch_cover_lane_and_do_not_claim_tao_van_doorn_threshold_collapse_without_new_dual_argument`

## What Was Audited

A teammate report suggested using Tao-van Doorn Appendix A, Theorem 16 to replace the large-prime tail in Sawhney Lemma 2.1/Lemma 2.2 and possibly lower the explicit threshold to around `10^6` or even below the existing compact exact interval `1..40500`.

Primary sources checked:

- Wouter van Doorn and Terence Tao, `Growth rates of sequences governed by the squarefree properties of its translates`, arXiv:2512.01087.
- Mehtaab Sawhney, `Problem_848.pdf`.

## Direction Check

Tao-van Doorn Theorem 16 controls the size of a set avoiding residue classes modulo `p^2`:

`|A| <= (N + Q^4) / sum_{q <= Q} h(q)`.

Sawhney Lemma 2.1 and Lemma 2.2 are used in Problem 848 to upper-bound a union/hitting set:

- Lemma 2.1 bounds elements that lie in at least one square-obstruction root class.
- Lemma 2.2 bounds elements for which `ab+1` is not squarefree, again a union over square-obstruction classes.

So the direct application has the wrong direction. An upper bound on the avoiding complement does not by itself give the needed upper bound on the union/hitting side.

## Numeric Sanity Check

For the `A*` branch, using `omega(p^2)=2` for primes `p == 1 mod 4`, `p >= 13`, the local check gives:

- `Q=50`: `sum h(q) = 1.0239827222657203`, reciprocal `0.9765789776094514`.
- `Q=100`: `sum h(q) = 1.02607361630732`, reciprocal `0.9745889418722655`.
- `Q=1000`: `sum h(q) = 1.0279035651775665`, reciprocal `0.972853907581548`.
- `Q=10000`: `sum h(q) = 1.0279767441231482`, reciprocal `0.9727846526849087`.

This is nowhere near a `1/25 = 0.04` density bound. The proposed "Q around 50 gives density below 1/25" reading appears arithmetically inverted.

## Impact

This is a real and relevant paper, but it does not currently justify redirecting the 848 loop away from the p4217/frontier abstraction lane.

Allowed future analytic use:

- Find a dual lower bound for the avoiding side that upper-bounds the union.
- Find a different square-moduli sieve result that directly controls union/hitting sets.
- Produce a corrected threshold packet with exact hypotheses and constants.

Until then, do not claim a Tao-van Doorn threshold collapse, do not claim `N0 <= 40500`, and do not stop the current next-rank batch-cover work because of this reference alone.

## Boundary

This packet does not rule out all uses of Tao-van Doorn or square-moduli large sieves. It only blocks the direct threshold-collapse claim from the current report.
