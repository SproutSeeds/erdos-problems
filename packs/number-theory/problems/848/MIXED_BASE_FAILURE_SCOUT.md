# Problem 848 Mixed-Base Failure Scout

- Generated: 2026-04-11T20:37:02.856Z
- Method: `exact_mixed_base_clique_on_structural_union_failures`
- Status: `sampled_union_failures_repaired_by_mixed_base_clique`
- Source structural scout: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/STRUCTURAL_TWO_SIDE_SCOUT.json`
- Analyzed rows: `8`
- Mixed failures: `0`
- Minimum mixed margin: `22`
- Max improvement over union: `111`

## Worst Mixed Row

- `{"source":"first_union_failure","N":7307,"p":13,"outsider":1789,"candidateSize":293,"sMaxSide7":111,"sMaxSide18":110,"sMaxUnion":218,"mixedBaseCliqueSize":110,"mixedBaseSide7Count":0,"mixedBaseSide18Count":110,"mixedBaseCliqueMatchesSingleSide":true,"mixedBound":271,"mixedMargin":22,"mixedPass":true,"originalUnionMargin":-86,"improvementOverUnion":108,"vMax":43,"dMax":18,"rGreater":100,"exampleMixedBaseClique":[43,68,143,243,268,293,343,443,518,543,643,743,843,943,968,1043,1143,1193,1243,1343,1418,1443,1468,1543,1643,1743,1843,1868,1943,2043,2093,2143,2243,2318,2343,2443,2543,2643,2693,2743,2768,2843,2918,2943,2993,3043,3143,3218,3243,3343,3443,3543,3643,3668,3743,3768,3843,3893,3918,3943,4043,4068,4118,4143,4243,4343,4443,4493,4543,4568,4618,4643,4743,4793,4843,4943,5018,5043,5143,5243,5343,5443,5468,5543,5643,5693,5743,5843,5918,5943,6043,6143,6243,6293,6343,6368,6418,6443,6543,6593,6643,6668,6743,6818,6843,6943,7043,7143,7243,7268]}`

## Boundary

- Claim level: `sampled_failure_scout_not_full_structural_certificate`
- This scout exactly solves the mixed-base clique on selected union-failure rows from the two-sided structural scout. It does not yet certify every structural breakpoint.
- Next use: Promote this into the full two-sided structural verifier by replacing the union-base overcount with the exact mixed-base clique bound at every breakpoint.
