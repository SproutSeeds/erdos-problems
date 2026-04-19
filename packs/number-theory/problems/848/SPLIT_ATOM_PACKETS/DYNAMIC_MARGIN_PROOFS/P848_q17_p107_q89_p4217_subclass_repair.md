# Problem 848 Endpoint Obstruction Subclass Repair

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_subclass`
- Status: `representative_repair_found_availability_split_needed`
- Residual subclass: `left ≡ 760410154648626128533304355898763555393483209652336085943695959179023528577227857 mod 4018151289874337645868852921870587523537603036293953839351606997760601160064480100`
- Window: `28500`
- Blocked endpoint prime: `107`
- Blocked square divisor: `7921`

## Source Obstruction

- t subclass: `t == 17162051 mod 90687529`
- left subclass: `left == 760410154648626128533304355898763555393483209652336085943695959179023528577227857 mod 4018151289874337645868852921870587523537603036293953839351606997760601160064480100`
- witness: `89^2 | left*right+1`

## Representative Repair

- Representative left: `760410154648626128533304355898763555393483209652336085943695959179023528577227857`
- Blocked endpoint: p=`107`, status `known_non_squarefree_from_source_obstruction`, square divisor `7921`.
- Alternate endpoint: p=`4217`, k=`203`, delta=`-5089`, right=`760410154648626128533304355898763555393483209652336085943695959179023528577222768`, status `exact_squarefree`.
- Alternate availability: `k_4217(t) = (445517*t + 203) mod 17783089`, available `1140/17783089`, universal `false`.
- First unavailable residue: `{"tResidue":1,"k":445720}`

## Claims

- Representative repair: `true`
- Subclass coverage: `false`
- Symbolic squarefree hitting: `false`
- All-N: `false`

## Boundary

- This packet repairs the emitted p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71/p107/q89 square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_subclass_by_p4217_availability` [next]: Split the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71/p107/q89 obstruction subclass by the p4217 availability rule and then audit squarefree hitting on the available subfamilies.
- `emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_square_obstruction_successor` [fallback]: If the alternate endpoint cannot be lifted, emit the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71/p107/q89 obstruction subclass as the next deterministic successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_subclass_by_p4217_availability`
