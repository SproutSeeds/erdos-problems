# Problem 848 Endpoint Obstruction Subclass Repair

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_subclass`
- Status: `representative_repair_found_availability_split_needed`
- Residual subclass: `left ≡ 14783468194311397457 mod 59131531151650584900`
- Window: `28500`
- Blocked endpoint prime: `103`
- Blocked square divisor: `4`

## Source Obstruction

- t subclass: `t == 10609 mod 42436`
- left subclass: `left == 14783468194311397457 mod 59131531151650584900`
- witness: `2^2 | left*right+1`

## Representative Repair

- Representative left: `14783468194311397457`
- Blocked endpoint: p=`103`, status `non_squarefree`, square divisor `4`.
- Alternate endpoint: p=`37`, k=`457`, delta=`-11439`, right=`14783468194311386018`, status `exact_squarefree`.
- Alternate availability: `k_37(t) = (1359*t + 457) mod 1369`, available `1140/1369`, universal `false`.
- First unavailable residue: `{"tResidue":46,"k":1366}`

## Claims

- Representative repair: `true`
- Subclass coverage: `false`
- Symbolic squarefree hitting: `false`
- All-N: `false`

## Boundary

- This packet repairs the emitted p41/q13/p103 parity square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_subclass_by_p37_availability` [next]: Split the p41/q13/p103 parity obstruction subclass by the p37 availability rule and then audit squarefree hitting on the available subfamilies.
- `emit_p41_q13_p103_q2_square_obstruction_successor` [fallback]: If the alternate endpoint cannot be lifted, emit the p41/q13/p103 parity obstruction subclass as the next deterministic successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_subclass_by_p37_availability`
