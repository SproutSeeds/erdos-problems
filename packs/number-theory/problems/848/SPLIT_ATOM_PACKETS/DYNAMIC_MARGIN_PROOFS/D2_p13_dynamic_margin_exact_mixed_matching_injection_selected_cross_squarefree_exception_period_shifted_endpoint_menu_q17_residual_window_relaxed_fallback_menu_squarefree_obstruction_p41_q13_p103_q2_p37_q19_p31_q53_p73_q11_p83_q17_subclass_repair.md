# Problem 848 Endpoint Obstruction Subclass Repair

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass`
- Status: `representative_repair_found_availability_split_needed`
- Residual subclass: `left ≡ 70434973191454519683340203976042263775739957 mod 101272147580523754927494162392934891769280100`
- Window: `28500`
- Blocked endpoint prime: `83`
- Blocked square divisor: `289`

## Source Obstruction

- t subclass: `t == 1384689 mod 1990921`
- left subclass: `left == 70434973191454519683340203976042263775739957 mod 101272147580523754927494162392934891769280100`
- witness: `17^2 | left*right+1`

## Representative Repair

- Representative left: `70434973191454519683340203976042263775739957`
- Blocked endpoint: p=`undefined`, status `undefined`, square divisor `(none)`.
- Alternate endpoint: p=`509`, k=`375`, delta=`-9389`, right=`70434973191454519683340203976042263775730568`, status `exact_squarefree`.
- Alternate availability: `k_509(t) = (8757*t + 375) mod 259081`, available `1140/259081`, universal `false`.
- First unavailable residue: `{"tResidue":1,"k":9132}`

## Claims

- Representative repair: `true`
- Subclass coverage: `false`
- Symbolic squarefree hitting: `false`
- All-N: `false`

## Boundary

- This packet repairs the emitted p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17 square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass_by_p509_availability` [next]: Split the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17 obstruction subclass by the p509 availability rule and then audit squarefree hitting on the available subfamilies.
- `emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_square_obstruction_successor` [fallback]: If the alternate endpoint cannot be lifted, emit the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17 obstruction subclass as the next deterministic successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass_by_p509_availability`
