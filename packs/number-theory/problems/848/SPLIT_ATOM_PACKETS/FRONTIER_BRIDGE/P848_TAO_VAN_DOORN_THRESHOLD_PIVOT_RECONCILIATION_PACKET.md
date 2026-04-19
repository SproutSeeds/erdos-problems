# P848 Tao-van Doorn Threshold Pivot Reconciliation

- Status: `tvd_threshold_pivot_reconciled_direct_route_blocked_dual_sieve_required`
- Target: `evaluate_p848_tao_van_doorn_threshold_collapse_claim_before_resuming_frontier`
- Recommended next action: `derive_p848_corrected_square_moduli_dual_sieve_or_union_hitting_threshold_packet`

## Decision

- Delegation: `keep_clawdad_paused_before_more_q_frontier_compute`
- Reason: The q-frontier obligation count is visibly growing, while the proposed analytic shortcut is high-value but not valid in its direct form. The next move should be a corrected analytic packet, not more q-bucket descent and not an all-N claim.

## Direction Check

- Tao-van Doorn controls: `upper_bound_for_sets_avoiding_residue_classes_mod_p_squared`
- Sawhney bottleneck needs: `upper_bound_for_union_or_hitting_sets_in_square_obstruction_classes`
- Mismatch: An upper bound on the avoiding complement does not imply the required upper bound on the union/hitting side.

## Numeric Sanity Check

- Minimum denominator for a direct `1/25`-scale reciprocal bound: `25`
- Max observed A* `sum h(q)`: `1.0280946719241701`
- Feasibility: `blocked_by_denominator_size`

| Q | A* sum h(q) | A* reciprocal | Lemma 2.2-style sum h(q) | Lemma 2.2-style reciprocal |
| ---: | ---: | ---: | ---: | ---: |
| 50 | 1.0239827222657203 | 0.9765789776094514 | 1.177205267161646 | 0.8494695257447287 |
| 100 | 1.02607361630732 | 0.9745889418722655 | 1.1808591037350578 | 0.8468410810713993 |
| 1000 | 1.0279035651775665 | 0.972853907581548 | 1.1840017585185343 | 0.844593340174795 |
| 10000 | 1.0280946719241701 | 0.9726730692304937 | 1.1843175651289024 | 0.8443681234189573 |

## Next Action

Derive a corrected square-moduli dual/union-hitting threshold packet: either prove a valid explicit threshold route with hypotheses/constants, or emit a no-go blocker that returns the loop to the p4217 theorem wedge with the analytic shortcut closed.

## Boundary

This packet is a pivot reconciliation, not a proof of Problem 848. It blocks the direct Tao-van-Doorn threshold-collapse claim by direction and denominator checks, keeps Clawdad paused from further q-frontier expansion, and requires a corrected dual/union-hitting sieve packet before resuming either the analytic shortcut or the p4217 frontier lane.
