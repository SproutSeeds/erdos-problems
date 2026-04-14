# Problem 848 Endpoint Menu Abstraction

This note records the current atomic breakdown for the active q17 residual window-relaxed fallback-menu target.

## Boundary

- Scope: side18-compatible endpoint selection for the q17 residual class `left == 5882 mod 11025` and outsider `6323`.
- Active atom: `D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_lift_outP2_70_out25_23_smaller_side7_outsider_6323`.
- This layer only proves or falsifies endpoint availability and cross-squarefree hitting.
- This layer does not by itself prove collision-free matching, D2/D3 promotion, or the final all-N handoff.

## Simplified Object

For each menu prime `p`, choose `k_p(left)` modulo `p^2` so that:

```text
p^2 | 6323 * (left - 14 - 25*k_p(left)) + 1
right_p(left) = left - 14 - 25*k_p(left)
```

Then `right_p(left) == 18 mod 25`, and the outsider-compatibility congruence is automatic. The remaining question is whether at least one available endpoint has squarefree `left * right_p(left) + 1`.

## Current Compiler

- Script: `packs/number-theory/problems/848/compute/problem848_endpoint_menu_compiler.mjs`
- Test: `test/p848-endpoint-menu-compiler.test.js`
- Seed profile: `output/p848-endpoint-menu-seed.md`
- Broad fast profile: `output/p848-endpoint-menu-27932207-40000000-fast.md`
- First expanded repair profile: `output/p848-endpoint-menu-first-full-miss-expanded-exact.md`
- P67 broad fast profile: `output/p848-endpoint-menu-27932207-40000000-p67-fast.md`
- P67 first full-miss exact profile: `output/p848-endpoint-menu-p67-first-full-miss-expanded-exact.md`
- Broad window grid profile: `output/p848-endpoint-menu-window-grid-27932207-40000000-fast.md`
- First full-miss window grid profile: `output/p848-endpoint-menu-window-grid-34414907-fast.md`
- Canonical window grid packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_window_grid_profile.md`
- Canonical first window-miss packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_first_window_miss.md`
- Canonical first window-miss exact grid packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_first_window_miss_exact_window_grid.md`
- Canonical window-legality audit: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_window_legality_audit.md`

## Atomic Layers

- `E0_formula_compile`: Derive each affine `k_p(left)` rule modulo `p^2`.
- `E1_window_availability`: Decide whether each prime is always inside the 25000-window or only conditionally available.
- `E2_square_obstruction`: For each endpoint, classify the first square divisor of `left * right + 1` when one is found.
- `E3_primary_menu_hitting`: Test whether `{23,31}` alone covers the residual rows.
- `E4_fallback_menu_hitting`: Test whether `{23,31,37,41,61}` covers the residual rows.
- `E5_repair_prime_discovery`: When the fallback menu misses, search the next menu primes and record the first deterministic repair.
- `E6_symbolic_hitting_lift`: Convert bounded endpoint profiles into residue-class lemmas instead of extending the row staircase.
- `E7_matching_handoff`: Feed the selected endpoint lemma back into the side-count/matching proof without claiming this compiler proves matching by itself.

## Current Evidence

- The known predecessor-blocked seed `left=27932207` is covered by the 25000-window primary menu `{23,31}`.
- Over `27932207..40000000`, fast screening finds the first primary miss at `left=27965282`.
- At `left=27965282`, prime `37` is a within-window fallback candidate.
- The first fast-screen full-menu miss for `{23,31,37,41,61}` appears at `left=28792157`.
- At `left=28792157`, the within-window primary/fallback candidates `23`, `31`, `37`, and `47` are killed by `2^2`; `41`, `61`, `43`, `53`, `59`, `71`, `73`, and `79` are not all simultaneously useful because of window availability or obstruction.
- Prime `67` repairs `left=28792157` with `k=679`, `delta=-16989`, `right=28775168`, `right == 18 mod 25`, and exact squarefree certification in the local exact artifact.
- A broad fast profile with primary menu `{23,31,37,41,61,67}` and fallback `{71,73,79,83,89,97}` covers `1089/1095` rows over `27932207..40000000`; its first full-menu miss is `left=34414907`.
- Therefore `67` is a genuine repair stratum, but it is not the whole symbolic endpoint selector.
- At `left=34414907`, the only within-window endpoints in the expanded exact profile are `23` and `31`, and both are killed by `2^2`.
- At the same row, primes such as `37`, `61`, `67`, `73`, `79`, `89`, `109`, and `113` have exact-squarefree endpoint products but are outside the 25000-window.
- The next obstruction is therefore primarily a window-availability problem, not evidence that squarefree endpoints disappear.
- The exact two-window grid for `left=34414907` proves that window `28500` selects the p67 endpoint exactly squarefree, with delta `-28489`.
- A broad fast window grid over `27932207..40000000` with primary `{23,31,37,41,61,67}` and fallback `{71,73,79,83,89,97,101,103,107,109,113}` first covers every observed residual row at window `28500`.
- In that broad grid, window `25000` covers `1091/1095` rows with first full-menu miss `34414907`; window `28500` screens `1095/1095`.
- The window-legality audit currently finds `25000` as inherited task/seed-window language, while the proof packets still separate endpoint selection from collision-free matching.

## Next Highest-Value Move

1. Prove or falsify `28500` endpoint-window legality before extending the row staircase.
2. Promote `p67` and the next repair primes into availability/obstruction strata instead of treating them as one-off rows.
3. If `28500` is legal, compose the p67 repair into the symbolic endpoint selector; if `25000` is structural, route `34414907` into replacement/augmentation.
4. Run the compiler on those strata rather than scanning every q-prime staircase row.
5. If the p67-expanded miss has its own clean within-window repair after a legitimate theorem-side transformation, emit that repair as a new atom and repeat at the stratum level.
6. Once the repair menu stabilizes, prove the menu hitting lemma as a finite residue-class cover and hand it back to the dynamic-margin theorem packet.
