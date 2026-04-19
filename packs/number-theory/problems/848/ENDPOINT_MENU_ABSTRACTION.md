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
- Broad exact-factor window grid profile: `output/p848-endpoint-menu-window-grid-27932207-40000000-factor.md`
- First full-miss window grid profile: `output/p848-endpoint-menu-window-grid-34414907-fast.md`
- Canonical window grid packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_window_grid_profile.md`
- Canonical first window-miss packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_first_window_miss.md`
- Canonical first window-miss exact grid packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_first_window_miss_exact_window_grid.md`
- Canonical window-availability profile: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_window_availability_profile.md`
- Canonical exact-factor window grid packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_window_grid_exact_factor_profile.md`
- Canonical window-legality audit: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_window_legality_audit.md`
- Canonical availability residue-cover handoff: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_availability_residue_cover.md`
- Canonical squarefree-hitting obstruction audit: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_hitting_obstruction.md`
- Canonical obstruction-subclass repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_subclass_repair.md`
- Canonical p41 availability split packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_availability_split.md`
- Canonical p41/q13 subclass repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_subclass_repair.md`
- Canonical p41/q13/p103 availability split packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_availability_split.md`
- Canonical p41/q13/p103/q2 subclass repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_subclass_repair.md`
- Canonical p41/q13/p103/q2/p37 availability split packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_availability_split.md`
- Canonical p41/q13/p103/q2/p37/q19 subclass repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_subclass_repair.md`
- Canonical p41/q13/p103/q2/p37/q19/p31 symbolic squarefree-lift packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_symbolic_squarefree_lift.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53 subclass repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_subclass_repair.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73 availability split packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_availability_split.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11 subclass repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_subclass_repair.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83 factor certificate: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_factor_certificate.json`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83 availability split packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_availability_split.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509 factor certificate: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p83_q17_p509_factor_certificate.json`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17 repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass_repair.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509 availability split packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p83_q17_p509_availability_split.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29 factor certificate: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p509_q43_p29_factor_certificate.json`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43 repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p509_q43_p29_subclass_repair.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29 symbolic squarefree-lift packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p509_q43_p29_symbolic_squarefree_lift.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47 factor certificate: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p29_q59_p47_factor_certificate.json`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59 repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p29_q59_p47_subclass_repair.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47 availability split packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p29_q59_p47_availability_split.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79 factor certificate: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p47_q67_p79_factor_certificate.json`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67 repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p47_q67_p79_subclass_repair.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79 availability split packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p47_q67_p79_availability_split.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71/p107 factor certificate: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p79_q71_p107_factor_certificate.json`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71 repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p79_q71_p107_subclass_repair.md`
- Canonical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71/p107 availability split packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p79_q71_p107_availability_split.md`
- Historical p41/q13/p103/q2/p37/q19/p31/q53/p73/q11/p83/q17 finite-menu successor packet superseded by the p509 screen: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_successor.md`

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
- The modular availability profile proves that `25000` corresponds to `k <= 999`, `28500` corresponds to `k <= 1139`, and the p67 repair at `left=34414907` sits exactly at `k=1139`.
- A broad fast window grid over `27932207..40000000` with primary `{23,31,37,41,61,67}` and fallback `{71,73,79,83,89,97,101,103,107,109,113}` first covers every observed residual row at window `28500`.
- In that broad grid, window `25000` covers `1091/1095` rows with first full-menu miss `34414907`; window `28500` screens `1095/1095`.
- The exact-factor broad grid upgrades that bounded profile: window `28500` proves `1095/1095` selected full-menu endpoints are exactly squarefree over `27932207..40000000`.
- The generated window-legality audit now settles this phase at endpoint-selector scope: `25000` is an inherited `seedEscapeWindow`, `28500` repairs the first miss via the p67 endpoint, and collision-free matching remains a separate downstream handoff.
- The generated availability residue-cover handoff assigns all `1095/1095` bounded q17 residual rows to selected endpoint-prime strata at window `28500`; selected prime counts are led by `23 -> 819`, `31 -> 191`, `37 -> 45`, `41 -> 17`, `61 -> 5`, and `67 -> 5`.
- The squarefree-hitting audit falsifies the naive universal selected-residue-family lemma immediately: the first selected p23 family has bounded row `left=27932207`, `t == 417 mod 529`, but its lifted subclass `t == 139015 mod 444889` has `29^2 | left*right+1`.
- The bounded row remains exact-squarefree because its family parameter is `4 mod 841`, not one of the obstruction roots `262,487 mod 841`.
- The obstruction-subclass repair packet shows the emitted representative `left=1532646257` is not a dead successor atom: p23 is killed by `29^2`, p31 is killed by `2^2`, but p41 gives an exact-squarefree within-window repair with `k=1011`, `delta=-25289`, `right=1532620968`.
- The p41 repair is not yet a full subclass proof: on the p23/q29 subclass, `k_41(h) = (1496*h + 1011) mod 1681`; window `28500` makes `1140/1681` h-residues available, with first unavailable residue `h == 6 mod 1681`.
- The p41 availability split packet audits the first available family `h == 0 mod 1681`: its representative is exact-squarefree, but the lifted subclass `h == 119351 mod 284089` has `13^2 | left*right+1`.
- The p41/q13 subclass representative `left=585406398751232` is repaired by p103: p23 is killed by `29^2`, p31 by `3^2`, p41 by `13^2`, while p103 gives exact-squarefree endpoint `k=532`, `delta=-13314`, `right=585406398737918`.
- The p103 repair is again a split handoff, not a full subclass proof: on the p41/q13 subclass, `k_103(t) = (1766*t + 532) mod 10609`; window `28500` makes `1140/10609` residues available, with first unavailable residue `t == 1 mod 10609`.
- The p103 availability split packet audits the first available family `t == 0 mod 10609`: its representative is exact-squarefree, but the lifted subclass `t == 10609 mod 42436` has `2^2 | left*right+1`.
- The lifted p103 obstruction left class is beyond JavaScript's safe integer range, so the packet records exact string integers: `left == 14783468194311397457 mod 59131531151650584900`.
- The p103/parity subclass representative `left=14783468194311397457` is repaired by p37: p103 is killed by `2^2`, while p37 gives exact-squarefree endpoint `k=457`, `delta=-11439`, `right=14783468194311386018`.
- The p37 repair is a split handoff, not a full subclass proof: on the p103/parity subclass, `k_37(t) = (1359*t + 457) mod 1369`; window `28500` makes `1140/1369` residues available, with first unavailable residue `t == 46 mod 1369`.
- The p37 availability split packet audits the first available family `t == 0 mod 1369`: its representative is exact-squarefree, but the lifted subclass `t == 54760 mod 494209` has `19^2 | left*right+1`.
- The lifted p37 obstruction left class is recorded exactly as string integers: `left == 3238057429332580340521457 mod 29223334878926083912844100`.
- The p37/q19 subclass representative is repaired by p31: p37 is killed by `19^2`, while p31 gives exact-squarefree endpoint `k=727`, `delta=-18189`, `right=3238057429332580340503268`.
- This p31 repair has universal window availability on the p37/q19 subclass: `k_31(t) = (506*t + 727) mod 961`, so all `961/961` residues satisfy the `28500` window. The remaining theorem step is squarefree lifting, not another availability split.
- The p31 symbolic squarefree-lift audit falsifies the naive p31 lift immediately: the first p31 residue family `t == 0 mod 961` has a lifted subclass `t == 355570 mod 2699449` where `53^2 | left*right+1`.
- The lifted p31 obstruction left class is recorded exactly as string integers: `left == 10390944420957176989470317158457 mod 78886902115582138292443092900900`.
- The p31/q53 subclass representative is repaired by p73: p23 is killed by `29^2`, p31 by `53^2`, p37 by `19^2`, p41 by `13^2`, p103 by `2^2`, while p73 gives exact-squarefree endpoint `k=42`, `delta=-1064`, `right=10390944420957176989470317157393`.
- The p73 repair is another split handoff: on the p31/q53 subclass, `k_73(t) = (5184*t + 42) mod 5329`; window `28500` makes `1140/5329` residues available, with first unavailable residue `t == 1 mod 5329`.
- The p73 availability split packet audits the first available family `t == 0 mod 5329`: its representative is exact-squarefree, but the lifted subclass `t == 245134 mod 644809` has `11^2 | left*right+1`.
- The lifted p73 obstruction left class is recorded exactly as string integers: `left == 19337872254145532845356734605486379057 mod 50866984466246403010211938290336428100`.
- The p73/q11 subclass representative is repaired by p83: p23 is killed by `29^2`, p31 by `53^2`, p37 by `19^2`, p41 by `13^2`, p73 by `11^2`, p103 by `2^2`, while p83 gives exact-squarefree endpoint `k=1053`, `delta=-26339`, `right=19337872254145532845356734605486352718`.
- The p83 exact-squarefree claim is backed by the local p83 factor certificate: `left*right+1 = 23 * 4657 * 2760415663598119999 * 1264762023931589436653808864165682723378972133854343`, with no repeated exponent.
- The p83 repair is another split handoff: on the p73/q11 subclass, `k_83(t) = (3454*t + 1053) mod 6889`; window `28500` makes `1140/6889` residues available, with first unavailable residue `t == 1 mod 6889`.
- The p83 availability split packet audits the first available family `t == 0 mod 6889`: its representative is exact-squarefree via the p83 factor certificate, but the lifted subclass `t == 1384689 mod 1990921` has `17^2 | left*right+1`.
- The lifted p83 obstruction left class is recorded exactly as string integers: `left == 70434973191454519683340203976042263775739957 mod 101272147580523754927494162392934891769280100`.
- The earlier p83/q17 repair probe found no within-window repair in the tested finite menu `23,31,37,41,61,67,73,83,89,97,101,103,107,109,113,127,131,137,139,149,151`; every within-window tested endpoint was square-blocked, led by p23/`29^2`, p31/`53^2`, p37/`19^2`, p41/`13^2`, p61/`3^2`, p67/`2^2`, p73/`11^2`, p83/`17^2`, and p103/`2^2`.
- A sharper finite endpoint screen through p1999 repairs the same p83/q17 representative with p509: `k=375`, `delta=-9389`, `right=70434973191454519683340203976042263775730568`, inside the `28500` window.
- The p509 exact-squarefree claim is backed by the local p509 factor certificate: `left*right+1 = 809 * 2793103 * 2195539396243410092983689441253889282236721168599626157191998555816915697520751`, with no repeated exponent.
- The p509 repair is another split handoff: on the p83/q17 subclass, `k_509(t) = (8757*t + 375) mod 259081`; window `28500` makes `1140/259081` residues available, with first unavailable residue `t == 1 mod 259081`.
- The p509 availability split packet audits the first available family `t == 0 mod 259081`: its representative is exact-squarefree via the p509 factor certificate, but the lifted subclass `t == 69433708 mod 479040769` has `43^2 | left*right+1`.
- The lifted p509 obstruction left class is recorded exactly as string integers: `left == 7031700794073966078153710526635826514162061609350757 mod 48513487455255588983234342795722410720087709680396900`.
- The p509/q43 subclass representative is repaired by p29: p29 gives exact-squarefree endpoint `k=330`, `delta=-8264`, `right=7031700794073966078153710526635826514162061609342493`.
- The p29 exact-squarefree claim is backed by the local p29 factor certificate: `left*right+1 = 2 * 67 * 823 * 12037 * 97978513 * 2235673667 * 143217828731233 * 1187302905957091362241434720561633685011285213550064637376692571`, with no repeated exponent.
- The p29 repair is universally window-available on this lifted class: `k_29(t) = (0*t + 330) mod 841`, so no p29 availability split is needed before the symbolic squarefree-lift audit.
- The p29 symbolic squarefree-lift packet falsifies the naive universal p29 lift: the lifted subclass `t == 2382553 mod 2927521` has `59^2 | left*right+1`.
- The lifted p29 obstruction left class is recorded exactly as string integers: `left == 115585962108682363372738011284687343464203647124220284636457 mod 142024253308497297115787186455676067553681891931265213084900`.
- The p29/q59 subclass representative is repaired by p47: p29 is killed by `59^2`, while p47 gives exact-squarefree endpoint `k=682`, `delta=-17064`, `right=115585962108682363372738011284687343464203647124220284619393`.
- The p47 exact-squarefree claim is backed by the local p47 factor certificate: `left*right+1 = 2 * 29 * 3361 * 390610697 * 33791278720298221 * 7797671478854415708509039 * 233692528610037524099190694483 * 2849411401605996688453914854312441`, with no repeated exponent.
- The p47 repair is another split handoff: on the p29/q59 subclass, `k_47(t) = (600*t + 682) mod 2209`; window `28500` makes `1140/2209` residues available, with first unavailable residue `t == 1 mod 2209`.
- The p47 availability split packet audits the first available family `t == 0 mod 2209`: its representative is exact-squarefree via the p47 factor certificate, but the lifted subclass `t == 5487156 mod 9916201` has `67^2 | left*right+1`.
- The lifted p47 obstruction left class is recorded exactly as string integers: `left == 779309349273202903535037727621392952820934379605640625790372180857 mod 1408341042681974206156866014118961476751887930450704037257698464900`.
- The p47/q67 subclass representative is repaired by p79: p47 is killed by `67^2`, while p79 gives exact-squarefree endpoint `k=635`, `delta=-15889`, `right=779309349273202903535037727621392952820934379605640625790372164968`.
- The p79 exact-squarefree claim is backed by the local p79 factor certificate: `left*right+1 = 3 * 7 * 52903 * 389569 * 1403252378755749031676046051559236407594564392331554520514678671451552841628795860237228861794375210886724952257563154291`, with no repeated exponent.
- The p79 repair is another split handoff: on the p47/q67 subclass, `k_79(t) = (22*t + 635) mod 6241`; window `28500` makes `1140/6241` residues available, with first unavailable residue `t == 23 mod 6241`.
- The p79 availability split packet audits the first available family `t == 0 mod 6241`: its representative is exact-squarefree via the p79 factor certificate, but the lifted subclass `t == 4612099 mod 31460881` has `71^2 | left*right+1`.
- The lifted p79 obstruction left class is recorded exactly as string integers: `left == 6495409093921839827444779121889775729358858393078141245172819622639005957 mod 44307649951233511344970629003140966863675412705245876082384017738101576900`.
- The p79/q71 subclass representative is repaired by p107: p79 is killed by `71^2`, while p107 gives exact-squarefree endpoint `k=913`, `delta=-22839`, `right=6495409093921839827444779121889775729358858393078141245172819622638983118`.
- The p107 exact-squarefree claim is backed by the local p107 factor certificate: `left*right+1 = 19 * 41 * 710841267023 * 1867049646607 * 40808164542466917596501274218731812438748288869862163173618591334828108380286084085148858794792218872686834230796360533`, with no repeated exponent.
- The p107 repair is another split handoff: on the p79/q71 subclass, `k_107(t) = (3757*t + 913) mod 11449`; window `28500` makes `1140/11449` residues available, with first unavailable residue `t == 1 mod 11449`.
- The p107 availability split packet audits the first available family `t == 0 mod 11449`: its representative is exact-squarefree via the p107 factor certificate, but the lifted subclass `t == 17162051 mod 90687529` has `89^2 | left*right+1`.
- The lifted p107 obstruction left class is recorded exactly as string integers: `left == 760410154648626128533304355898763555393483209652336085943695959179023528577227857 mod 4018151289874337645868852921870587523537603036293953839351606997760601160064480100`.
- The p107/q89 repair probe finds p197 as the first trial-squarefree within-window candidate (`k=1073`, `delta=-26839`) and p4217 as the next later trial-squarefree candidate (`k=203`, `delta=-5089`) under square checks through prime `199999`.
- p197 remains uncertified: it leaves a composite 162-digit cofactor after factor `3`, and local ECM rungs timed out. p4217 is now exact-certified by ECM plus primality checks.
- The p4217 exact-squarefree claim is backed by the local p4217 factor certificate: `left*right+1 = 3 * 17 * 43 * 6229 * 6750951187 * 6270091598275163324434379142109518770677292373207867188600785275591360843033565925270338223533142120661137719944438330375791446539400296982452943`, with no repeated exponent.
- The p4217 repair is another split handoff: on the p107/q89 subclass, `k_4217(t) = (445517*t + 203) mod 17783089`; window `28500` makes `1140/17783089` residues available, with first unavailable residue `t == 1 mod 17783089`.
- The p4217 availability split packet audits the first available family `t == 0 mod 17783089`: its representative is exact-squarefree via the p4217 factor certificate, but the lifted subclass `t == 42163704019 mod 66170874169` has `61^2 | left*right+1`.
- The lifted p4217 obstruction left class is recorded exactly as string integers: `left == 169420141690585054358732178817328088519972453794407467571322168411530879091645805420092749757 mod 265884583394279840187007549369466635122108056254479559599229627196756604148422140623504536900`.
- The p4217/q61 repair probe found only two trial-squarefree within-window candidates in the bounded prime screen `23 <= p <= 50000`: p97 (`k=102`, `delta=-2564`) and p227 (`k=549`, `delta=-13739`).
- Both candidates remain exact-uncertified: p97 is now partially split as `2 * 29 * 4984999 * 20049382114183789 * 42227912403779999179` times a composite 141-digit cofactor with no trial factor through `20000000` and no factor from a bounded Pollard p-1 run at `B=5000000`, `retries=8`, while p227 leaves a composite 181-digit cofactor after factor `13297` and also has no factor from a bounded Pollard p-1 run at `B=5000000`, `retries=8`.
- This p4217/q61 boundary is not a repair packet and does not license a p97 or p227 availability split until an exact factor certificate proves squarefree. The current leaf is now routed to the p4217/q61 blocker/open-leaf packet so the finite frontier ledger can account for it without extending sibling endpoint work.
- Canonical p107/q89 repair-candidate boundary packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p107_q89_repair_candidate_factorization_boundary.md`
- Canonical p107/q89/p4217 factor certificate: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p107_q89_p4217_factor_certificate.json`
- Canonical p107/q89 repair packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p107_q89_p4217_subclass_repair.md`
- Canonical p107/q89/p4217 availability split packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p107_q89_p4217_availability_split.md`
- Canonical p4217/q61 repair-candidate boundary packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p4217_q61_repair_candidate_factorization_boundary.md`
- Canonical p4217/q61 blocker/open-leaf packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p4217_q61_factorization_blocker_open_leaf.md`
- Canonical frontier ledger format packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_FRONTIER_LEDGER_FORMAT_PACKET.md`
- Canonical frontier transition rule packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_FRONTIER_TRANSITION_RULE_V0_PACKET.md`
- Canonical endpoint availability staircase theorem packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_ENDPOINT_AVAILABILITY_STAIRCASE_THEOREM_V0_PACKET.md`
- Canonical p4217 unavailable-complement refinement packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_UNAVAILABLE_COMPLEMENT_REFINEMENT_PACKET.md`
- Canonical p4217 complement p43 fallback-selector packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_P43_FALLBACK_SELECTOR_PACKET.md`
- The p4217 complement now has an endpoint-availability fallback selector: on the p107/q89 source class, `k_43(left) = (74*left + 1323) mod 1849` collapses to constant `200`, so `right_43 = left - 5014` is inside the `28500` window for all `17781949` p4217-unavailable complement residues. This is not a squarefree proof; it replaces the complement selector obligation with a p43 squarefree-hitting obligation.
- Canonical p4217 complement p43 square-obstruction packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_P43_SQUARE_OBSTRUCTION_PACKET.md`
- The p43 fallback selector is uniformly square-blocked: the source class has `left == 1 mod 4`, `right_43 = left - 5014 == 3 mod 4`, so `left*right_43+1 == 0 mod 4` for every source parameter, including every p4217-complement residue. The complement remains open, now with p43 excluded.
- Canonical p4217 complement p61 availability-refinement packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_P61_AVAILABILITY_REFINEMENT_PACKET.md`
- After p43 is excluded, p61 gives an exact CRT refinement rather than a cover: `k_61(t) = (3330*t + 3360) mod 3721`, so every p4217-complement row splits into `1140` p61-available residues and `2581` p61-unavailable residues modulo `61^2`. The first p61-available child is `t == 48783616077 mod 66170874169`, with a bounded q101 square-obstruction probe recorded for the next audit boundary.
- Canonical p4217 complement p61/q101 square-obstruction packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_P61_Q101_SQUARE_OBSTRUCTION_PACKET.md`
- The first p61-available CRT child now has an exact q101 obstruction subfamily: for `t = 48783616077 + 66170874169*u`, roots `u == 1829,2811 mod 10201` make `101^2 | left*(left - 25364)+1`. The selected first root lifts to `t == 121075312471178 mod 675009087397969`.
- Canonical p4217 complement p61/q101 repair-candidate boundary packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_P61_Q101_REPAIR_CANDIDATE_BOUNDARY_PACKET.md`
- On that q101 child, the established `23 <= p <= 50000` endpoint screen has 17 within-window endpoints. Fourteen are trial-square-blocked through prime `199999`; the first trial-squarefree repair candidate is p443, with p1741 and p2609 retained as reserves. This is not a repair handoff until p443 is exactly certified.
- Canonical p4217 complement p61/q101 p443 factor certificate: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_P61_Q101_P443_FACTOR_CERTIFICATE.json`
- Canonical p4217 complement p61/q101 p443 repair handoff: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_P61_Q101_P443_REPAIR_HANDOFF_PACKET.md`
- The p443 representative repair is exact-certified: `left*right+1 = 809 * 341321 * 1408574789 * P174`, all exponents are one, and `P174` is prime by local SymPy. The repair is still representative-level; on the child parameter `v`, `k_443(v) = (159890*v + 1029) mod 196249`, so p443 availability must be split before subclass coverage is claimed.
- Canonical p4217 complement p61/q101 p443 availability split packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_P61_Q101_P443_AVAILABILITY_SPLIT_PACKET.md`
- The p443 availability split is now exact: `1140` residues are available and `195109` are unavailable modulo `443^2`. The first p443-available family `v == 0 mod 196249` has no square-divisor roots through `89^2`, and the first deterministic child is a q97 obstruction: `t == 858404682506186150932058 mod 1246408897617516648005929` with `97^2 | left*(left - 25739)+1`.
- Canonical p4217 complement p61/q101 p443/q97 repair-candidate boundary packet: `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_P61_Q101_P443_Q97_REPAIR_CANDIDATE_BOUNDARY_PACKET.md`
- On that q97 child, the established `23 <= p <= 50000` endpoint screen has 17 within-window endpoints. Fifteen are trial-square-blocked through prime `199999`; the trial-squarefree candidates are p151 and p479. The first candidate p151 has known factors `3 * 7 * 547 * 14713` and a 203-digit residual after a bounded 180-second SymPy factor attempt timed out, so no q97 repair handoff is certified yet.
- The previously emitted p83/q17 successor packet is now superseded by this p509 repair. It remains useful as historical finite-menu evidence, not as the live highest-value action.

## Next Highest-Value Move

1. Exact-certify the p151 repair candidate for the q97 child, or emit a deterministic blocker/successor boundary.
2. Do not claim p151 or p479 repairs the q97 child until exact squarefree certification exists.
3. Keep the representative p83, p509, p29, p47, p79, p107, and p4217 repairs plus their availability/lift handoffs local; they are not a full subclass proof until the p29/q59/p47/q67/p79/q71/p107/q89/p4217/q61 branch is resolved or routed.
4. Route p73-unavailable, p37-unavailable, p103-unavailable, and earlier p41-unavailable residues after the p37-available q19/p31/q53/p73/q11 branch is handled.
5. Keep collision-free matching and D2/D3 promotion out of this endpoint-selector packet until the matching handoff explicitly asks for them.
