# Problem 848 Endpoint Obstruction Subclass Repair

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_subclass`
- Status: `representative_repair_found_availability_split_needed`
- Residual subclass: `left ≡ 6495409093921839827444779121889775729358858393078141245172819622639005957 mod 44307649951233511344970629003140966863675412705245876082384017738101576900`
- Window: `28500`
- Blocked endpoint prime: `79`
- Blocked square divisor: `5041`

## Source Obstruction

- t subclass: `t == 4612099 mod 31460881`
- left subclass: `left == 6495409093921839827444779121889775729358858393078141245172819622639005957 mod 44307649951233511344970629003140966863675412705245876082384017738101576900`
- witness: `71^2 | left*right+1`

## Representative Repair

- Representative left: `6495409093921839827444779121889775729358858393078141245172819622639005957`
- Blocked endpoint: p=`undefined`, status `undefined`, square divisor `(none)`.
- Alternate endpoint: p=`107`, k=`913`, delta=`-22839`, right=`6495409093921839827444779121889775729358858393078141245172819622638983118`, status `exact_squarefree`.
- Alternate availability: `k_107(t) = (3757*t + 913) mod 11449`, available `1140/11449`, universal `false`.
- First unavailable residue: `{"tResidue":1,"k":4670}`

## Claims

- Representative repair: `true`
- Subclass coverage: `false`
- Symbolic squarefree hitting: `false`
- All-N: `false`

## Boundary

- This packet repairs the emitted p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71 square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_subclass_by_p107_availability` [next]: Split the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71 obstruction subclass by the p107 availability rule and then audit squarefree hitting on the available subfamilies.
- `emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_square_obstruction_successor` [fallback]: If the alternate endpoint cannot be lifted, emit the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71 obstruction subclass as the next deterministic successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_subclass_by_p107_availability`
