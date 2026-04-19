# Problem 848 Endpoint Obstruction Subclass Repair

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_subclass`
- Status: `representative_repair_found_availability_split_needed`
- Residual subclass: `left ≡ 585406398751232 mod 1393428484109025`
- Window: `28500`
- Blocked endpoint prime: `41`
- Blocked square divisor: `169`

## Source Obstruction

- t subclass: `t == 119351 mod 284089`
- left subclass: `left == 585406398751232 mod 1393428484109025`
- witness: `13^2 | left*right+1`

## Representative Repair

- Representative left: `585406398751232`
- Blocked endpoint: p=`41`, status `non_squarefree`, square divisor `169`.
- Alternate endpoint: p=`103`, k=`532`, delta=`-13314`, right=`585406398737918`, status `exact_squarefree`.
- Alternate availability: `k_103(t) = (1766*t + 532) mod 10609`, available `1140/10609`, universal `false`.
- First unavailable residue: `{"tResidue":1,"k":2298}`

## Claims

- Representative repair: `true`
- Subclass coverage: `false`
- Symbolic squarefree hitting: `false`
- All-N: `false`

## Boundary

- This packet repairs the emitted p41/q13 square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.

## Next Theorem Options

- `split_q17_p41_q13_subclass_by_p103_availability` [next]: Split the p41/q13 obstruction subclass by the p103 availability rule and then audit squarefree hitting on the available subfamilies.
- `emit_p41_q13_square_obstruction_successor` [fallback]: If the alternate endpoint cannot be lifted, emit the p23/q29/p41/q13 obstruction subclass as the next deterministic successor atom.

## Recommended Next Action

- `split_q17_p41_q13_subclass_by_p103_availability`
