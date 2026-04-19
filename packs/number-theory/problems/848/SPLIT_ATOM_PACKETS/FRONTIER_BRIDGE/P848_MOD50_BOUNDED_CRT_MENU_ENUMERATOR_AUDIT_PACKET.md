# P848 Mod-50 Bounded CRT Menu Enumerator Audit

Generated: 2026-04-17T12:21:38Z

Status: `mod50_bounded_crt_menu_enumerator_exact_restored_menu_reproduction_verified`

## Result

A bounded CRT representative enumerator is now repo-owned at:

`packs/number-theory/problems/848/compute/problem848_mod50_bounded_crt_menu_enumerator.mjs`

Verification command:

`node packs/number-theory/problems/848/compute/problem848_mod50_bounded_crt_menu_enumerator.mjs --pretty`

The enumerator avoids the naive `23^6` tuple search by splitting the six anchors:

- right-half CRT progressions for anchors `82,132,182`;
- bounded representatives `n` up to each restored menu's maximum representative;
- direct square-witness tests for left anchors `7,32,57`;
- distinct square-modulus tuple rows only.
- tie order by representative ascending, then stored `tupleKey` display string ascending, then first `limit` rows.

Across `SIX_PREFIX_NINETEEN` through `SIX_PREFIX_TWENTY_FOUR`:

- every restored menu row is contained in the bounded enumeration;
- no smaller representative is omitted from any restored menu;
- all six restored menus are reproduced exactly under the recovered `tupleKey` tie policy;
- total missing rows: `0`;
- total smaller extras: `0`;
- one extra tuple appears only at the `SIX_PREFIX_TWENTY_FOUR` boundary representative `1837022639`;
- that extra sorts after the included boundary row and is excluded by the finite `limit`.

## Boundary

This proves an exact bounded CRT enumerator for the restored finite menu surfaces, including duplicate/equal-representative ordering. It does not restore the original family-menu generator or prove an all-future symbolic recurrence.

The remaining boundary is:

`p848_mod50_exact_bounded_menu_enumerator_universal_recurrence_boundary`

The known unresolved sample is the same-boundary `SIX_PREFIX_TWENTY_FOUR` tuple:

`n = 1837022639`, tuple `[9, 121, 4, 49, 1681, 529]`

Forbidden shortcut: do not treat exact restored finite-menu reproduction as original generator restoration, universal relevant-pair enumeration, finite `Q` partition, or all-N proof.

## Next Action

`promote_p848_mod50_exact_bounded_menu_enumerator_or_emit_all_future_recurrence_blocker`

Promote the exact bounded CRT menu enumerator as a finite restored-menu replay theorem, then either derive a symbolic all-future relevant-pair recurrence/finite `Q` partition or emit the next blocker at that universal boundary.
