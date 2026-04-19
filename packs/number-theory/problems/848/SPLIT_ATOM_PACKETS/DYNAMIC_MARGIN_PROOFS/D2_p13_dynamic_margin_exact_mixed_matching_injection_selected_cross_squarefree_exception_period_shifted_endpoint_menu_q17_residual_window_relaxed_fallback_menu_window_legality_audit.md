# Problem 848 Endpoint Window Legality Audit

- Active atom: `D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_lift_outP2_70_out25_23_smaller_side7_outsider_6323`
- Scope: q17 residual endpoint selection for `left == 5882 mod 11025` and outsider `6323`.
- Inherited window: `25000` with `k <= 999`.
- Candidate endpoint window: `28500` with `k <= 1139`.
- Status: `selector_layer_window_relaxation_supported_matching_handoff_needed`
- Selector-layer decision: `true`

## Decision

- At endpoint-selector scope, window 28500 is the first profiled exact-factor window that repairs the inherited 25000-window miss without violating side, outsider-compatibility, or cross-squarefree checks.
- Boundary: This decision is endpoint-selector legality only. Collision-free matching and all-N squarefree hitting remain downstream theorem obligations.

## Key Repair Row

- First inherited-window miss: `left=34414907`
- Repair endpoint: `p=67`, `k=1139`, `delta=-28489`, `right=34386418`.
- Inside inherited window: `false`; inside candidate window: `true`.
- Right side: `right == 18 mod 25`.
- Outsider compatibility: `67^2 | 6323 * right + 1`.
- Cross product: `1183405377533127`, status `exact_squarefree`.

## Bounded Evidence

- window=25000: full-menu `1091/1095`, first full miss `34414907`, exact-factor coverage `false`.
- window=28500: full-menu `1095/1095`, first full miss `(none)`, exact-factor coverage `true`.

## Availability Stratum Seed

- Prime: `67`
- inherited window: available residues `1000/4489`, witness available `false`.
- candidate window: available residues `1140/4489`, witness available `true`.
- candidate formula: `k_67(t) = (441*t + 2901) mod 4489`.

## Inherited Boundary Audit

- Predecessor seed window: `25000`.
- The inherited cap is the predecessor nextSubatom.seedEscapeWindow carried into the selector lane.
- Not found: A theorem packet proving that 25000 is a collision-free matching invariant.
- Not found: A theorem packet proving that endpoints with 25000 < |delta| <= 28500 are illegal.
- Not found: A theorem packet showing that the p67 endpoint at left=34414907 breaks right-compatibility or squarefreeness.

## Theorem Fork

- `prove_28500_endpoint_window_legality` [done_at_endpoint_selector_layer]: Decide whether the q17 residual selector may use the candidate 28500 endpoint window.
- `preserve_25000_and_augment` [not_selected_unless_matching_invariant_found]: If 25000 is a real matching invariant, keep the cap and route left=34414907 into a replacement/augmenting-path handoff instead of direct selector relaxation.
- `availability_residue_cover` [next]: Convert the p67 and fallback endpoint availability thresholds into residue-class strata so the loop stops extending by one row at a time.

## Boundary

- Not proved here: All-N coverage for every q17 residual row.
- Not proved here: Collision-free online matching.
- Not proved here: The D2/D3 dynamic-margin promotion.
- Not proved here: A symbolic residue-class squarefree-hitting lemma for the full endpoint menu.

## Recommended Next Action

- `promote_availability_residue_cover`
