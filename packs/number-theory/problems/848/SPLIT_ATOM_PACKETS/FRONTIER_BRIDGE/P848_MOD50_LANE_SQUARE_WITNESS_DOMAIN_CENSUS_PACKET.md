# Problem 848 Mod-50 Square-Witness Domain Census

Generated: 2026-04-17T10:08:10.068Z
Status: `observed_square_witness_domain_decomposed_next_top_risk_group_selected`

## Decision

The 74 finite mod-50 square-witness instances have been decomposed into observed witness-domain groups. This is a census and ranking packet, not the universal square-witness domain theorem.

## Census

- Finite witness instances: `74`
- Witness periods: `9, 49, 169, 289, 361, 529, 1369, 1681, 4489, 66049`
- (Q, bad residue) groups: `15`
- Top-only instances/groups: `28/7`
- Contrast-only instances/groups: `46/11`

## Already Closed

`anchor_832_witness_529` is already closed inside the top repair-class packet: `finite_group_closure_certified_symbolic_domain_split`. Its repeated profile sublane is resolved as `finite_profile_sublane_resolved_as_zero_lift_duplicate`.

## Selected Next Subprobe

`prove_p848_mod50_anchor432_witness4489_domain_or_emit_profile_split`

The next finite-domain subprobe is `anchor_432_witness_4489`: anchor `432`, witness modulus `4489`, family rows `236, 237`, representative `1585191353`.

Why: after the already-resolved `anchor_832_witness_529` group, `anchor_432_witness_4489` is the largest unresolved repeated top-only risk group in the observed domain. It has six pairwise top-only bad-lane instances over the same two raw rows and repaired lanes `6, 7, 24`.

## Boundary

This packet does not prove universal square-witness coverage, does not justify a `40501+` rollout, and does not decide Problem 848. It narrows the blocked mod-50 coverage theorem to the next replayable finite-domain/profile split.

## Next

Replay rows 236 and 237 for anchor_432_witness_4489 from raw tuple rows, decide finite duplicate versus symbolic profile family, and emit either a finite closure/profile split packet or an exact counterfamily/source blocker.
