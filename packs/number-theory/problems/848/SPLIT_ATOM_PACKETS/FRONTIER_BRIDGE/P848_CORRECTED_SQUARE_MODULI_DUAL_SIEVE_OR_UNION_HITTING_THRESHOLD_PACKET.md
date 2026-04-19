# P848 Corrected Square-Moduli Dual/Union-Hitting Threshold Packet

- Status: `corrected_square_moduli_sieve_no_go_current_sources_handoff_to_p4217`
- Target: `derive_p848_corrected_square_moduli_dual_sieve_or_union_hitting_threshold_packet`
- Recommended next action: `prepare_p848_p4217_complement_theorem_wedge_or_import_source_cover`

## Verdict

- Current corrected route: `no_current_source_valid_threshold_route`
- Duality failure: Combining |A| <= B with |H| = |U| - |A| gives |H| >= |U| - B, a lower bound on the hitting side. It does not give the required upper bound.
- Missing object: A lower bound for the avoiding set, a direct upper-bound sieve for the union/hitting side, or a different explicit threshold theorem with constants strong enough for the Sawhney weakest branch.

## Candidate Routes

- `direct_tao_van_doorn_avoiding_bound` [blocked]: Wrong inequality direction for Sawhney Lemma 2.1/Lemma 2.2 union upper bounds.
- `complement_duality_from_avoiding_upper_bound` [blocked]: The complement identity turns the available avoiding upper bound into a hitting lower bound, not a hitting upper bound.
- `denominator_threshold_shortcut` [blocked]: The largest recomputed A* sum h(q) is 1.0280946719241701, and the largest Lemma 2.2-style sum h(q) in the checked table is 1.1843175651289024; neither is near the direct 25-scale denominator needed for a naive 1/25 bound.
- `existing_lemma21_union_bound_repair` [blocked_by_existing_bottleneck]: The local Lemma 2.1 explicit-bound surface already identifies the large-prime tail as the bottleneck for the union-bound/inclusion-exclusion route.
- `external_or_imported_union_hitting_square_moduli_sieve` [not_present_in_current_repo_sources]: This packet does not rule such a theorem out globally, but no repo-owned source has supplied it with verified hypotheses/constants.

## Handoff

- Decision: `close_current_tvd_shortcut_and_release_p4217_theorem_wedge`
- Released action: `prepare_p848_p4217_complement_theorem_wedge_or_import_source_cover`
- Reason: The analytic shortcut is now atomized enough to know what is missing; spending more q-frontier compute under a false threshold-collapse premise would be worse than returning to the already named p4217 theorem-source gap.

## Boundary

This packet closes only the current Tao-van-Doorn threshold shortcut from repo-owned sources. It proves that the available avoiding-set upper bound and complement identity do not supply the needed union/hitting upper bound, and it records that no corrected threshold theorem is currently present locally. It does not rule out a future imported square-moduli union/hitting theorem, does not compute a valid N0, and does not decide Problem 848.
