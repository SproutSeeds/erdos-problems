# Problem 848 Structural Lift Miner

- Generated: 2026-04-11T14:10:06.048Z
- Method: `mixed_base_structural_lift_pattern_mining`
- Status: `structural_lift_obligation_packet_ready`
- Source verifier status: `bounded_full_mixed_base_structural_verifier_certified`
- Assessed range: `7307..7600`
- Exact mixed rows reported: `64`
- Exact mixed rows mined: `64`
- Threatening-outsider rows mined: `1733`
- Coverage complete: `yes`
- Primary exact primes: `13, 17`
- Minimum mixed margin: `20`
- Minimum threat matching slack: `19`

## Prime Profiles

- p=13: rows 32, N 7307..7600, min margin 20, margin delta 2
- p=17: rows 32, N 7307..7600, min margin 96, margin delta 4

## Threat Matching Profiles

- p=13: threats 1285, rows 32, K 26..90, matching 79..111, min slack 19, saturates smaller side yes
- p=17: threats 448, rows 32, K 1..14, matching 103..112, min slack 95, saturates smaller side yes

## Top Families

- `p=17|Nmod25=7|d=minus|clique=side7|outMod25=1`: rows 9, N 7307..7582, min margin 97, max union repair 112
- `p=13|Nmod25=7|d=plus|clique=side7|outMod25=6`: rows 8, N 7307..7482, min margin 21, max union repair 110
- `p=17|Nmod25=18|d=minus|clique=side7|outMod25=1`: rows 7, N 7418..7593, min margin 99, max union repair 112
- `p=13|Nmod25=18|d=plus|clique=side7|outMod25=6`: rows 5, N 7318..7468, min margin 21, max union repair 110
- `p=13|Nmod25=18|d=plus|clique=side18|outMod25=14`: rows 5, N 7493..7593, min margin 23, max union repair 111
- `p=17|Nmod25=18|d=minus|clique=side18|outMod25=23`: rows 5, N 7318..7443, min margin 96, max union repair 110
- `p=13|Nmod25=7|d=plus|clique=side18|outMod25=14`: rows 4, N 7507..7582, min margin 23, max union repair 111
- `p=17|Nmod25=7|d=minus|clique=side18|outMod25=23`: rows 3, N 7332..7382, min margin 97, max union repair 109
- `p=13|Nmod25=18|d=plus|clique=side18|outMod25=9`: rows 2, N 7343..7443, min margin 20, max union repair 110
- `p=13|Nmod25=12|d=plus|clique=side7|outMod25=6`: rows 1, N 7337..7337, min margin 21, max union repair 108

## Worst Rows

- {"N":7343,"certificateMode":"exact_mixed_base","nMod25":18,"p":13,"p2":169,"rawPlus":44,"rawMinus":43,"vMax":44,"activePlus":41,"activeMinus":39,"activeOutsiderCount":80,"dMax":18,"dMaxWitnessSide":"plus","dMaxWitnessValue":1591,"rGreater":100,"candidateSize":294,"strictBaseThreshold":132,"side7Margin":21,"side18Margin":20,"unionMargin":-88,"mixedMargin":20,"sMaxMixed":112,"sMaxMixedWitness":5309,"sMaxMixedWitnessMod25":9,"threateningOutsiderCount":40,"maxImprovementOverUnion":109,"worstOutsider":5309,"worstOutsiderMod25":9,"worstUnionCount":220,"worstMixedCliqueSize":112,"matchingSizeInMissingCrossGraph":108,"compatibleSide7Count":108,"compatibleSide18Count":112,"mixedCliqueSide7Count":0,"mixedCliqueSide18Count":112,"dominantMixedCliqueSide":"side18"}
- {"N":7307,"certificateMode":"exact_mixed_base","nMod25":7,"p":13,"p2":169,"rawPlus":43,"rawMinus":43,"vMax":43,"activePlus":40,"activeMinus":39,"activeOutsiderCount":79,"dMax":18,"dMaxWitnessSide":"plus","dMaxWitnessValue":1591,"rGreater":100,"candidateSize":293,"strictBaseThreshold":132,"side7Margin":21,"side18Margin":22,"unionMargin":-86,"mixedMargin":21,"sMaxMixed":111,"sMaxMixedWitness":4831,"sMaxMixedWitnessMod25":6,"threateningOutsiderCount":39,"maxImprovementOverUnion":108,"worstOutsider":4831,"worstOutsiderMod25":6,"worstUnionCount":216,"worstMixedCliqueSize":111,"matchingSizeInMissingCrossGraph":105,"compatibleSide7Count":111,"compatibleSide18Count":105,"mixedCliqueSide7Count":111,"mixedCliqueSide18Count":0,"dominantMixedCliqueSide":"side7"}
- {"N":7318,"certificateMode":"exact_mixed_base","nMod25":18,"p":13,"p2":169,"rawPlus":43,"rawMinus":43,"vMax":43,"activePlus":40,"activeMinus":39,"activeOutsiderCount":79,"dMax":18,"dMaxWitnessSide":"plus","dMaxWitnessValue":1591,"rGreater":100,"candidateSize":293,"strictBaseThreshold":132,"side7Margin":21,"side18Margin":21,"unionMargin":-87,"mixedMargin":21,"sMaxMixed":111,"sMaxMixedWitness":4831,"sMaxMixedWitnessMod25":6,"threateningOutsiderCount":39,"maxImprovementOverUnion":108,"worstOutsider":4831,"worstOutsiderMod25":6,"worstUnionCount":216,"worstMixedCliqueSize":111,"matchingSizeInMissingCrossGraph":105,"compatibleSide7Count":111,"compatibleSide18Count":105,"mixedCliqueSide7Count":111,"mixedCliqueSide18Count":0,"dominantMixedCliqueSide":"side7"}
- {"N":7337,"certificateMode":"exact_mixed_base","nMod25":12,"p":13,"p2":169,"rawPlus":44,"rawMinus":43,"vMax":44,"activePlus":41,"activeMinus":39,"activeOutsiderCount":80,"dMax":18,"dMaxWitnessSide":"plus","dMaxWitnessValue":1591,"rGreater":100,"candidateSize":294,"strictBaseThreshold":132,"side7Margin":21,"side18Margin":21,"unionMargin":-87,"mixedMargin":21,"sMaxMixed":111,"sMaxMixedWitness":4831,"sMaxMixedWitnessMod25":6,"threateningOutsiderCount":40,"maxImprovementOverUnion":108,"worstOutsider":4831,"worstOutsiderMod25":6,"worstUnionCount":216,"worstMixedCliqueSize":111,"matchingSizeInMissingCrossGraph":105,"compatibleSide7Count":111,"compatibleSide18Count":105,"mixedCliqueSide7Count":111,"mixedCliqueSide18Count":0,"dominantMixedCliqueSide":"side7"}
- {"N":7357,"certificateMode":"exact_mixed_base","nMod25":7,"p":13,"p2":169,"rawPlus":44,"rawMinus":43,"vMax":44,"activePlus":41,"activeMinus":39,"activeOutsiderCount":80,"dMax":18,"dMaxWitnessSide":"plus","dMaxWitnessValue":1591,"rGreater":100,"candidateSize":295,"strictBaseThreshold":133,"side7Margin":21,"side18Margin":21,"unionMargin":-87,"mixedMargin":21,"sMaxMixed":112,"sMaxMixedWitness":4831,"sMaxMixedWitnessMod25":6,"threateningOutsiderCount":40,"maxImprovementOverUnion":109,"worstOutsider":4831,"worstOutsiderMod25":6,"worstUnionCount":217,"worstMixedCliqueSize":112,"matchingSizeInMissingCrossGraph":105,"compatibleSide7Count":112,"compatibleSide18Count":105,"mixedCliqueSide7Count":112,"mixedCliqueSide18Count":0,"dominantMixedCliqueSide":"side7"}
- {"N":7366,"certificateMode":"exact_mixed_base","nMod25":16,"p":13,"p2":169,"rawPlus":44,"rawMinus":44,"vMax":44,"activePlus":41,"activeMinus":40,"activeOutsiderCount":81,"dMax":18,"dMaxWitnessSide":"plus","dMaxWitnessValue":1591,"rGreater":100,"candidateSize":295,"strictBaseThreshold":133,"side7Margin":21,"side18Margin":21,"unionMargin":-87,"mixedMargin":21,"sMaxMixed":112,"sMaxMixedWitness":4831,"sMaxMixedWitnessMod25":6,"threateningOutsiderCount":40,"maxImprovementOverUnion":109,"worstOutsider":4831,"worstOutsiderMod25":6,"worstUnionCount":217,"worstMixedCliqueSize":112,"matchingSizeInMissingCrossGraph":105,"compatibleSide7Count":112,"compatibleSide18Count":105,"mixedCliqueSide7Count":112,"mixedCliqueSide18Count":0,"dominantMixedCliqueSide":"side7"}
- {"N":7368,"certificateMode":"exact_mixed_base","nMod25":18,"p":13,"p2":169,"rawPlus":44,"rawMinus":44,"vMax":44,"activePlus":41,"activeMinus":40,"activeOutsiderCount":81,"dMax":18,"dMaxWitnessSide":"plus","dMaxWitnessValue":1591,"rGreater":100,"candidateSize":295,"strictBaseThreshold":133,"side7Margin":21,"side18Margin":21,"unionMargin":-87,"mixedMargin":21,"sMaxMixed":112,"sMaxMixedWitness":4831,"sMaxMixedWitnessMod25":6,"threateningOutsiderCount":40,"maxImprovementOverUnion":109,"worstOutsider":4831,"worstOutsiderMod25":6,"worstUnionCount":217,"worstMixedCliqueSize":112,"matchingSizeInMissingCrossGraph":105,"compatibleSide7Count":112,"compatibleSide18Count":105,"mixedCliqueSide7Count":112,"mixedCliqueSide18Count":0,"dominantMixedCliqueSide":"side7"}
- {"N":7332,"certificateMode":"exact_mixed_base","nMod25":7,"p":13,"p2":169,"rawPlus":43,"rawMinus":43,"vMax":43,"activePlus":40,"activeMinus":39,"activeOutsiderCount":79,"dMax":18,"dMaxWitnessSide":"plus","dMaxWitnessValue":1591,"rGreater":100,"candidateSize":294,"strictBaseThreshold":133,"side7Margin":22,"side18Margin":22,"unionMargin":-86,"mixedMargin":22,"sMaxMixed":111,"sMaxMixedWitness":4831,"sMaxMixedWitnessMod25":6,"threateningOutsiderCount":39,"maxImprovementOverUnion":108,"worstOutsider":4831,"worstOutsiderMod25":6,"worstUnionCount":216,"worstMixedCliqueSize":111,"matchingSizeInMissingCrossGraph":105,"compatibleSide7Count":111,"compatibleSide18Count":105,"mixedCliqueSide7Count":111,"mixedCliqueSide18Count":0,"dominantMixedCliqueSide":"side7"}

## Lift Obligations

- `p848_cross_side_matching_bound` [critical, bounded_evidence_ready]: For each threatening outsider, the missing cross-edge graph between the 7 mod 25 and 18 mod 25 compatible base sides has a matching large enough to force mixedCliqueSize below the strict base threshold.
- `p848_exact_prime_margin_lift` [critical, bounded_evidence_ready]: For the exact-mixed witness-prime families 13, 17, prove candidateSize > sMaxMixed + vMax + dMax + rGreater either eventually or by a finite periodic residue split.
- `p848_union_bound_tail_lift` [high, bounded_evidence_ready]: Prove that every non-exact witness-prime block is certified by the safe union bound past the base interval, with only finitely many exceptional rows delegated to exact verification.
- `p848_top_repeating_family_lift` [high, bounded_evidence_ready]: Use family p=17|Nmod25=7|d=minus|clique=side7|outMod25=1 as the first symbolic family to formalize.

## Recommended Next Steps

- `mine_matching_pattern_witnesses` [critical]: The active D2 atom needs a symbolic matching construction, and the matching-pattern miner extracts actual tight-row missing-cross pairs without bloating the verifier artifact. | command: `erdos number-theory dispatch 848 --apply --action matching_pattern_miner --matching-pattern-prime 13`
- `formalize_cross_side_matching_bound` [critical]: The full verifier succeeds exactly because mixed-base cliques are much smaller than the safe union overcount; this is the theorem-shaped repair mechanism. | command: `erdos problem formalization-work-refresh 848`
- `formalize_exact_prime_margin_lift` [critical]: The mined rows identify which witness-prime blocks still need symbolic margin control after the union-bound rows are separated. | command: `erdos problem formalization 848`
- `extend_structural_range_after_lift_target` [high]: Once the first symbolic family is named, extend the bounded verifier beyond 7307..7600 to falsify or strengthen the family before claiming a lift. | command: `erdos number-theory dispatch 848 --apply --action full_mixed_base_structural_verifier --structural-min 7307 --structural-max 15200`

## Boundary

- Claim level: `theorem_obligation_packet_not_all_N_proof`
- Note: This miner extracts proof obligations from a bounded structural verifier. It does not certify any N outside the source verifier range.
- Promotion rule: Use this packet to choose and formalize symbolic lemmas. Promote all-N closure only after those lemmas are independently proved and linked to the finite exact base.
