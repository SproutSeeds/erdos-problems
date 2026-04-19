# Problem 848 Endpoint Obstruction Subclass Repair

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_subclass`
- Status: `representative_repair_found_availability_split_needed`
- Residual subclass: `left ≡ 10390944420957176989470317158457 mod 78886902115582138292443092900900`
- Window: `28500`
- Blocked endpoint prime: `31`
- Blocked square divisor: `2809`

## Source Obstruction

- t subclass: `t == 355570 mod 2699449`
- left subclass: `left == 10390944420957176989470317158457 mod 78886902115582138292443092900900`
- witness: `53^2 | left*right+1`

## Representative Repair

- Representative left: `10390944420957176989470317158457`
- Blocked endpoint: p=`undefined`, status `undefined`, square divisor `(none)`.
- Alternate endpoint: p=`73`, k=`42`, delta=`-1064`, right=`10390944420957176989470317157393`, status `exact_squarefree`.
- Alternate availability: `k_73(t) = (5184*t + 42) mod 5329`, available `1140/5329`, universal `false`.
- First unavailable residue: `{"tResidue":1,"k":5226}`

## Claims

- Representative repair: `true`
- Subclass coverage: `false`
- Symbolic squarefree hitting: `false`
- All-N: `false`

## Boundary

- This packet repairs the emitted p41/q13/p103 parity/p37/q19/p31/q53 square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_subclass_by_p73_availability` [next]: Split the p41/q13/p103 parity/p37/q19/p31/q53 obstruction subclass by the p73 availability rule and then audit squarefree hitting on the available subfamilies.
- `emit_p41_q13_p103_q2_p37_q19_p31_q53_square_obstruction_successor` [fallback]: If the alternate endpoint cannot be lifted, emit the p41/q13/p103 parity/p37/q19/p31/q53 obstruction subclass as the next deterministic successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_subclass_by_p73_availability`
