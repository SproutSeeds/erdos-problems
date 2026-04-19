# Problem 848 Endpoint Obstruction Subclass Repair

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_subclass`
- Status: `representative_repair_found_availability_split_needed`
- Residual subclass: `left ≡ 115585962108682363372738011284687343464203647124220284636457 mod 142024253308497297115787186455676067553681891931265213084900`
- Window: `28500`
- Blocked endpoint prime: `29`
- Blocked square divisor: `3481`

## Source Obstruction

- t subclass: `t == 2382553 mod 2927521`
- left subclass: `left == 115585962108682363372738011284687343464203647124220284636457 mod 142024253308497297115787186455676067553681891931265213084900`
- witness: `59^2 | left*right+1`

## Representative Repair

- Representative left: `115585962108682363372738011284687343464203647124220284636457`
- Blocked endpoint: p=`undefined`, status `undefined`, square divisor `(none)`.
- Alternate endpoint: p=`47`, k=`682`, delta=`-17064`, right=`115585962108682363372738011284687343464203647124220284619393`, status `exact_squarefree`.
- Alternate availability: `k_47(t) = (600*t + 682) mod 2209`, available `1140/2209`, universal `false`.
- First unavailable residue: `{"tResidue":1,"k":1282}`

## Claims

- Representative repair: `true`
- Subclass coverage: `false`
- Symbolic squarefree hitting: `false`
- All-N: `false`

## Boundary

- This packet repairs the emitted p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59 square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_subclass_by_p47_availability` [next]: Split the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59 obstruction subclass by the p47 availability rule and then audit squarefree hitting on the available subfamilies.
- `emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_square_obstruction_successor` [fallback]: If the alternate endpoint cannot be lifted, emit the p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59 obstruction subclass as the next deterministic successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_subclass_by_p47_availability`
