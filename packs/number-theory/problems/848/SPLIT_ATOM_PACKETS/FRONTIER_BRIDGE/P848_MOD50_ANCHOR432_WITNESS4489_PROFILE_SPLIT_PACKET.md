# Problem 848 Mod-50 Anchor 432 / Witness 4489 Profile Split

Generated: 2026-04-17T10:16:03.205Z
Status: `finite_group_replay_certified_initial_anchor_profile_split`

## Decision

Rows 236 and 237 for `anchor_432_witness_4489` replay cleanly from the raw family menu. They are not a same-prefix finite duplicate like the earlier 832/529 repeated profile: they split at the initial anchor-7 tuple row, then converge to the same `4250 mod 4489` residue at anchor 132 and preserve it through anchor 182 with zero lift.

## Certified Rows

- Family rows: `236, 237`
- Representative: `1585191353`
- Witness square modulus: `4489 = 67^2`
- Target failure residue for anchor 432: `4250`
- Repair value: `684802664497`
- Replay status: `passed`

## Profile Split

- Profile group count: `2`
- Same prefix through anchor 132: `false`
- Same suffix from anchors 32 through 182: `true`
- Anchor 182 zero lift for every row: `true`

The split is finite and profile-facing, not a universal domain theorem.

## Boundary

This packet closes only the selected finite `432/4489` subprobe from the observed mod-50 census. It does not prove the universal square-witness domain cover, justify a `40501+` rollout, close the p4217 complement, or decide Problem 848.

## Next

Batch-classify the remaining observed top-only mod-50 witness groups using the closed 832/529 and 432/4489 profile patterns, or emit the next deterministic profile split/counterfamily before any 40501+ rollout.
