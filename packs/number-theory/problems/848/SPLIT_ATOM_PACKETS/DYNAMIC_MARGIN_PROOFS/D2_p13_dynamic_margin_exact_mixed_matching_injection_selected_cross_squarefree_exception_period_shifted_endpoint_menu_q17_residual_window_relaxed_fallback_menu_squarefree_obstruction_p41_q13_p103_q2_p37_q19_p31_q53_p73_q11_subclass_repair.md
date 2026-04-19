# Problem 848 Endpoint Obstruction Subclass Repair

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_subclass`
- Status: `representative_repair_found_availability_split_needed`
- Residual subclass: `left ≡ 19337872254145532845356734605486379057 mod 50866984466246403010211938290336428100`
- Window: `28500`
- Blocked endpoint prime: `73`
- Blocked square divisor: `121`

## Source Obstruction

- t subclass: `t == 245134 mod 644809`
- left subclass: `left == 19337872254145532845356734605486379057 mod 50866984466246403010211938290336428100`
- witness: `11^2 | left*right+1`

## Representative Repair

- Representative left: `19337872254145532845356734605486379057`
- Blocked endpoint: p=`undefined`, status `undefined`, square divisor `(none)`.
- Alternate endpoint: p=`83`, k=`1053`, delta=`-26339`, right=`19337872254145532845356734605486352718`, status `exact_squarefree`.
- Alternate availability: `k_83(t) = (3454*t + 1053) mod 6889`, available `1140/6889`, universal `false`.
- First unavailable residue: `{"tResidue":1,"k":4507}`

## Claims

- Representative repair: `true`
- Subclass coverage: `false`
- Symbolic squarefree hitting: `false`
- All-N: `false`

## Boundary

- This packet repairs the emitted p41/q13/p103 parity/p37/q19/p31/q53/p73/q11 square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_subclass_by_p83_availability` [next]: Split the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11 obstruction subclass by the p83 availability rule and then audit squarefree hitting on the available subfamilies.
- `emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_square_obstruction_successor` [fallback]: If the alternate endpoint cannot be lifted, emit the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11 obstruction subclass as the next deterministic successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_subclass_by_p83_availability`
