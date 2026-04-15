# D2_p13_side_count_floor_outP2_70_out25_6_smaller_side7

This is a focused side-count floor atom for the Problem 848 p13 non-tight slack-dominance lift.

## Summary

- Packet id: `p848_side_count_floor_packet_D2_p13_side_count_floor_outP2_70_out25_6_smaller_side7`
- Parent lemma: `D2_p13_non_tight_side_count_slack_floor_lift`
- Split key: `outP2=70|out25=6|smaller=side7`
- Priority: `co_weakest_side_count_floor_atom`
- Status: `symbolic_side_count_floor_atom_needed`
- Target slack floor: `20`
- Observed bounded slack-formula floor: `21`
- Observed margin above target: `1`
- Bounded witness rows: `32` over `7307..7600`

## Theorem Obligation

For every future p=13 threat row with outP2=70|out25=6|smaller=side7, prove strictBaseThreshold - 1 - max(compatibleSide7Count, compatibleSide18Count) >= 20.

Equivalent inequality: `max(compatibleSide7Count, compatibleSide18Count) <= strictBaseThreshold - 21`

Boundary: This packet isolates one weakest non-tight side-count stratum. Its bounded witness is not an all-N proof; the symbolic side-count inequality still has to be proved or refined.

## Structural Margin Decomposition

- Status: `bounded_structural_margin_replay_verified_symbolic_margin_lift_needed`
- Inequality: `side18Count + vMax + dMax + rGreater + 21 <= candidateSize`
- Bounded margin range: `1..5`
- First open sublemma: `D2_p13_structural_margin_outP2_70_out25_6_smaller_side7_side18`
- First moving-term subatom: `D2_p13_dmax_bound_outP2_70_out25_6_smaller_side7`
- Boundary: This replays the bounded side-count floor as a structural margin inequality. It is not an all-N proof of the moving compatibility counts, dMax, rGreater, or candidateSize terms.

## Moving-Term Subatoms

- `D2_p13_dmax_bound_outP2_70_out25_6_smaller_side7` [needed]: For every future p=13 threat row with outP2=70|out25=6|smaller=side7, prove dMax <= 18.
- Boundary: This isolates the maximum same-prime cross-degree term from the structural margin. The bounded constant value is not an all-N proof.
- `D2_p13_dynamic_margin_outP2_70_out25_6_smaller_side7_side18` [needed_after_dmax_bound]: Assuming dMax <= 18, prove side18Count + vMax + rGreater + 39 <= candidateSize for outP2=70|out25=6|smaller=side7.
- Inequality: `side18Count + vMax + rGreater + 39 <= candidateSize`
- Boundary: This is the coupled moving-count margin left after budgeting dMax. It still needs a symbolic inequality for compatibility counts, p13 root counts, higher-root events, and the base candidate side.

## Proof Reduction

- Matching saturation: matchingSizeInMissingCrossGraph = min(compatibleSide7Count, compatibleSide18Count)
- K formula: K = compatibleSide7Count + compatibleSide18Count - strictBaseThreshold + 1
- Slack formula: matchingSlack = strictBaseThreshold - 1 - max(compatibleSide7Count, compatibleSide18Count)

## Bounded Witness

- Formula replay passed: `yes`
- Meets target floor: `yes`
- Side-count slack formula range: `21..25`
- Larger side range: `109..113`
- Strict base threshold range: `132..138`
- Candidate size range: `293..304`
- Reconstructed vMax range: `43..45`
- dMax range: `18..18`
- rGreater range: `100..103`

## Next Theorem Actions

- Prove the first moving-term subatom D2_p13_dmax_bound_outP2_70_out25_6_smaller_side7: dMax <= 18.
- After dMax is bounded, prove the residual dynamic margin D2_p13_dynamic_margin_outP2_70_out25_6_smaller_side7_side18: side18Count + vMax + rGreater + 39 <= candidateSize.
- If the symbolic side-count inequality fails, emit a sharper split atom keyed by the first failing side-count term.
- After all co-weakest side-count floor atoms are handled, lift the remaining larger-margin strata by the same inequality template.
