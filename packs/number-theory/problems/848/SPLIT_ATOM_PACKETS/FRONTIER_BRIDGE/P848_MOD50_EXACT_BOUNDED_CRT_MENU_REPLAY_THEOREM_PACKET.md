# P848 Mod-50 Exact Bounded CRT Menu Replay Theorem

Generated: 2026-04-17T12:28:04Z

Status: `mod50_exact_bounded_crt_menu_replay_theorem_promoted_recurrence_boundary_open`

## Result

The bounded CRT representative enumerator is promoted from audit evidence to a finite replay theorem for the restored menu surfaces:

`packs/number-theory/problems/848/compute/problem848_mod50_bounded_crt_menu_enumerator.mjs`

Verification command:

`node packs/number-theory/problems/848/compute/problem848_mod50_bounded_crt_menu_enumerator.mjs --pretty`

The theorem scope is exactly the restored finite menus `SIX_PREFIX_NINETEEN` through `SIX_PREFIX_TWENTY_FOUR`.

## Theorem

For each restored finite menu, enumerate distinct right-half CRT progressions for anchors `82,132,182`, enumerate bounded representatives `n` up to the restored menu boundary, directly test anchors `7,32,57` for square witnesses, keep distinct six-square tuple rows, sort by representative and then by stored `tupleKey` display string, and take the first menu limit rows.

Under that rule:

- all six restored menus are reproduced exactly;
- every restored row is contained in the bounded enumeration;
- no smaller representative is omitted;
- duplicate/equal-representative ordering is recovered;
- total missing rows: `0`;
- total smaller extras: `0`;
- same-boundary extras: `1`.

The lone same-boundary extra is in `SIX_PREFIX_TWENTY_FOUR` at `n = 1837022639` with tuple `[9, 121, 4, 49, 1681, 529]` and tuple key `9, 11^2, 4, 7^2, 41^2, 23^2`. It sorts after the included boundary row and is excluded by the finite limit.

## Boundary

This is a finite restored-menu replay theorem. It does not restore the original generator, prove a symbolic all-future relevant-pair recurrence, prove a finite `Q` partition, close contrast-only recombination, justify a `40501+` rollout, cover the p4217 complement, or decide Problem 848.

The next boundary is:

`p848_mod50_all_future_recurrence_source_boundary_after_bounded_replay_theorem`

## Next Action

`derive_p848_mod50_all_future_recurrence_or_emit_source_theorem_blocker`

Prove a symbolic all-future relevant-pair recurrence or finite `Q` partition for the mod-50 square-witness domain; if unavailable locally, emit the precise source-theorem blocker at the universal recurrence boundary.
