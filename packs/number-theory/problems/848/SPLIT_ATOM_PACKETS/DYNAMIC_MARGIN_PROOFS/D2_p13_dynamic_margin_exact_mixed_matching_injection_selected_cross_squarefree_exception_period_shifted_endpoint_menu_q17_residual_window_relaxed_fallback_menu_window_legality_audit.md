# Problem 848 Endpoint Window Legality Audit

- Active atom: `D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_lift_outP2_70_out25_23_smaller_side7_outsider_6323`
- Scope: q17 residual endpoint selection for `left == 5882 mod 11025` and outsider `6323`.
- Inherited window: `25000`.
- Candidate endpoint window: `28500`.
- Verdict: `28500` is a candidate endpoint-selector relaxation, not yet a matching proof.

## What The Audit Shows

- The live task wording still asks for a `25000`-window endpoint menu.
- The runtime propagates `seedEscapeWindow` from earlier selector packets into the next task language.
- The proof packets repeatedly state that this endpoint-menu lane is cross-squarefree endpoint selection only; collision-free matching remains separate.
- In this audit, the `25000` cap appears to be an inherited selector-window boundary, not yet a proved collision-free matching invariant.
- I did not find a theorem packet showing that endpoints with `25000 < |delta| <= 28500` are illegal.

## Key Repair Row

- First full-menu miss under the `25000` window: `left=34414907`.
- Nearest usable outside-window endpoint: `p=67`, `delta=-28489`, `right=34386418`.
- This endpoint is inside the candidate `28500` window by `11`.
- It satisfies `right == 18 mod 25`.
- It satisfies outsider compatibility because `67^2 | 6323 * right + 1`.
- It is exactly squarefree-certified for `left * right + 1` in the exact first-miss grid.

## Evidence Boundary

- Broad fast grid over `27932207..40000000`: window `25000` covers `1091/1095` full-menu rows and first misses at `34414907`.
- Broad fast grid over the same band: window `28500` covers `1095/1095` full-menu rows.
- Exact first-miss grid over `34414907..34414907`: window `25000` misses and window `28500` covers via p67 exactly.
- This does not prove all-N coverage, collision-free matching, D2/D3 promotion, or full-band exact squarefreeness.

## Theorem Fork

1. Prove `28500` endpoint-window legality for the q17 residual selector, at least for the p67 repair stratum and any follow-on fallback strata.
2. If `25000` is structural, preserve it and route `left=34414907` into a replacement/augmenting-path handoff instead of direct selector relaxation.
3. Convert endpoint availability into residue-class strata so the loop stops extending row by row.

## Recommended Next Action

Prove or falsify `28500` endpoint-window legality. If legal, promote the current p67 repair into the symbolic selector lemma. If illegal, identify the exact matching invariant and switch to an augmentation atom.
