# P848 Mod-50 External-Anchor Irrelevance Split Packet

Generated: 2026-04-17T10:52:18.240Z
Status: `external_anchor_counterfamily_split_into_terminal_profiles`

## Summary

The external-anchor counterfamily is now split into deterministic terminal profiles instead of one broad blocker.

- Observed external continuations: `157, 232`
- Terminally split observed 157 events: `2`
- Remaining same-lane external events: `1`
- Remaining companion-gap events: `3`
- No 40501+ rollout used: `true`

## Terminal Split

`157` is outside the `32 mod 50` handoff lane and is square-blocked on both observed boundary rows. This closes the observed 157 nuisance as a finite terminal profile only; it is not a universal outside-lane irrelevance theorem.

## Remaining Bottleneck

`232` is different: it is inside the `32 mod 50` lane, squarefree on the family-275 boundary row, outside the current top-tie/primary-contrast handoff surface, and absent from the GPU top-six handoff surface.

## Companion Gaps

- `top_432_Q49_bad8` family `75`, continuation `382`: primary-contrast companion gap.
- `top_782_Q9_bad6` family `161`, continuation `382`: primary-contrast companion gap.
- `top_782_Q9_bad6` family `161`, continuation `832`: top-tie non-target companion gap.

## Boundary

This packet narrows the blocker. It does not prove universal square-witness domain coverage, does not expand the handoff theorem, and does not justify any 40501+ exact rollout.

## Next Action

Prove the same-lane external-anchor handoff/irrelevance theorem for continuation 232, or emit its dedicated terminal profile split before any 40501+ rollout.

## Verification

Run: `jq '{splitSummary, bottleneck: (.terminalProfiles[] | select(.continuation==232)), missingHypotheses: .blocker.missingHypotheses}' packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_MOD50_EXTERNAL_ANCHOR_IRRELEVANCE_SPLIT_PACKET.json`
