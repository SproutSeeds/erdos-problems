# Problem 848 Endpoint Obstruction Subclass Repair

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_subclass`
- Status: `representative_repair_found_availability_split_needed`
- Residual subclass: `left ≡ 779309349273202903535037727621392952820934379605640625790372180857 mod 1408341042681974206156866014118961476751887930450704037257698464900`
- Window: `28500`
- Blocked endpoint prime: `47`
- Blocked square divisor: `4489`

## Source Obstruction

- t subclass: `t == 5487156 mod 9916201`
- left subclass: `left == 779309349273202903535037727621392952820934379605640625790372180857 mod 1408341042681974206156866014118961476751887930450704037257698464900`
- witness: `67^2 | left*right+1`

## Representative Repair

- Representative left: `779309349273202903535037727621392952820934379605640625790372180857`
- Blocked endpoint: p=`undefined`, status `undefined`, square divisor `(none)`.
- Alternate endpoint: p=`79`, k=`635`, delta=`-15889`, right=`779309349273202903535037727621392952820934379605640625790372164968`, status `exact_squarefree`.
- Alternate availability: `k_79(t) = (22*t + 635) mod 6241`, available `1140/6241`, universal `false`.
- First unavailable residue: `{"tResidue":23,"k":1141}`

## Claims

- Representative repair: `true`
- Subclass coverage: `false`
- Symbolic squarefree hitting: `false`
- All-N: `false`

## Boundary

- This packet repairs the emitted p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67 square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_subclass_by_p79_availability` [next]: Split the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67 obstruction subclass by the p79 availability rule and then audit squarefree hitting on the available subfamilies.
- `emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_square_obstruction_successor` [fallback]: If the alternate endpoint cannot be lifted, emit the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67 obstruction subclass as the next deterministic successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_subclass_by_p79_availability`
