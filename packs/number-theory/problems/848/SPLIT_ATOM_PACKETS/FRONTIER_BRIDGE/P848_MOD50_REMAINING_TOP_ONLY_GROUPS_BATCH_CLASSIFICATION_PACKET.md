# Problem 848 Mod-50 Remaining Top-Only Groups Batch Classification

Generated: 2026-04-17T10:24:25.674Z
Status: `remaining_top_only_groups_batch_classified_with_non_first_target_boundaries`

## Decision

All five remaining observed top-only mod-50 witness groups were replayed from the raw family menu without any `40501+` rollout. The batch splits into two strict target-first finite replay certificates and three deterministic non-first-target profile boundaries.

## Batch Summary

- Checked groups: `5`
- Checked raw family rows: `7`
- Checked observed witness instances: `13`
- Strict target-first groups: `2` (top_432_Q1681_bad8, top_782_Q169_bad15)
- Non-first-target boundary groups: `3` (top_432_Q49_bad8, top_782_Q9_bad6, top_832_Q9_bad7)
- Arithmetic blocker groups: `0`

## Classification

- `top_432_Q1681_bad8`: `target_first_finite_replay_certified`; rows `118`; witness `1681`; target continuation `432`; strict target-first `true`; non-first-target boundary `false`.
- `top_432_Q49_bad8`: `non_first_target_single_profile_boundary`; rows `75`; witness `49`; target continuation `432`; strict target-first `false`; non-first-target boundary `true`.
- `top_782_Q9_bad6`: `non_first_target_multirow_profile_boundary`; rows `107, 161, 275`; witness `9`; target continuation `782`; strict target-first `false`; non-first-target boundary `true`.
- `top_782_Q169_bad15`: `target_first_finite_replay_certified`; rows `234`; witness `169`; target continuation `782`; strict target-first `true`; non-first-target boundary `false`.
- `top_832_Q9_bad7`: `non_first_target_single_profile_boundary`; rows `256`; witness `9`; target continuation `832`; strict target-first `false`; non-first-target boundary `true`.

The three boundary groups still hit and preserve the target square-witness residue. Their only failed strict check is `firstTrackedMatchIsTarget`, caused by earlier or co-tied tracked activations.

## Boundary

This packet classifies the observed finite top-only groups. It does not prove the universal square-witness domain cover, cover contrast-only groups, justify a `40501+` rollout, close the p4217 complement, or decide Problem 848.

## Next

Resolve the three non-first-target top-only profile boundaries by proving their earlier/co-tied tracked activations are contrast/handoff-covered, or emit the next deterministic counterfamily packet before any `40501+` rollout.
