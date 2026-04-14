# Problem 848 Two-Sided Structural Scout

- Generated: 2026-04-11T20:36:56.648Z
- Method: `bounded_outsider_clique_two_side_structural_scout`
- Status: `side_specific_bounds_pass_but_union_bound_fails`
- Assessed range: `7307..7600`
- Witness blocks: `8`
- Breakpoints: `32`
- Checks: `256`

## Pass/Fail Summary

- Side 7 checks pass: `yes` (0 failures)
- Side 18 checks pass: `yes` (0 failures)
- Union-base checks pass: `no` (64 failures)

## First Failures

- Side 7: `(none)`
- Side 18: `(none)`
- Union: `{"N":7307,"p":13,"p2":169,"rawPlus":43,"rawMinus":43,"vMax":43,"activePlus":40,"activeMinus":39,"sMaxSide7":111,"sMaxSide7Witness":4831,"sMaxSide18":110,"sMaxSide18Witness":1789,"sMaxUnion":218,"sMaxUnionWitness":1789,"dMax":18,"dMaxWitness":{"side":"plus","value":1591},"rGreater":100,"candidateSize":293,"side7CandidateSize":293,"side18CandidateSize":292,"side7Bound":272,"side18Bound":271,"unionBound":379,"side7Margin":21,"side18Margin":22,"unionMargin":-86,"side7Pass":true,"side18Pass":true,"unionPass":false}`

## Worst Rows

- Side 7: `{"N":7307,"p":13,"p2":169,"rawPlus":43,"rawMinus":43,"vMax":43,"activePlus":40,"activeMinus":39,"sMaxSide7":111,"sMaxSide7Witness":4831,"sMaxSide18":110,"sMaxSide18Witness":1789,"sMaxUnion":218,"sMaxUnionWitness":1789,"dMax":18,"dMaxWitness":{"side":"plus","value":1591},"rGreater":100,"candidateSize":293,"side7CandidateSize":293,"side18CandidateSize":292,"side7Bound":272,"side18Bound":271,"unionBound":379,"side7Margin":21,"side18Margin":22,"unionMargin":-86,"side7Pass":true,"side18Pass":true,"unionPass":false}`
- Side 18: `{"N":7343,"p":13,"p2":169,"rawPlus":44,"rawMinus":43,"vMax":44,"activePlus":41,"activeMinus":39,"sMaxSide7":111,"sMaxSide7Witness":4831,"sMaxSide18":112,"sMaxSide18Witness":5309,"sMaxUnion":220,"sMaxUnionWitness":5309,"dMax":18,"dMaxWitness":{"side":"plus","value":1591},"rGreater":100,"candidateSize":294,"side7CandidateSize":294,"side18CandidateSize":294,"side7Bound":273,"side18Bound":274,"unionBound":382,"side7Margin":21,"side18Margin":20,"unionMargin":-88,"side7Pass":true,"side18Pass":true,"unionPass":false}`
- Union: `{"N":7552,"p":13,"p2":169,"rawPlus":45,"rawMinus":45,"vMax":45,"activePlus":42,"activeMinus":41,"sMaxSide7":113,"sMaxSide7Witness":4831,"sMaxSide18":114,"sMaxSide18Witness":1789,"sMaxUnion":225,"sMaxUnionWitness":1789,"dMax":18,"dMaxWitness":{"side":"plus","value":1591},"rGreater":103,"candidateSize":302,"side7CandidateSize":302,"side18CandidateSize":302,"side7Bound":279,"side18Bound":280,"unionBound":391,"side7Margin":23,"side18Margin":22,"unionMargin":-89,"side7Pass":true,"side18Pass":true,"unionPass":false}`

## Boundary

- Claim level: `bounded_scout_not_all_n_proof`
- Safety: The union-base bound is safe but intentionally loose: it allows every compatible element from both principal sides even though a real clique may not be able to mix them.
- Promotion rule: Promote only bounded structural coverage when unionPass is true for every checked witness-prime block and structural breakpoint in the assessed range.
- Next use: Use the first/worst union failures to decide whether we need a sharper mixed-base lemma rather than a raw union overcount.
