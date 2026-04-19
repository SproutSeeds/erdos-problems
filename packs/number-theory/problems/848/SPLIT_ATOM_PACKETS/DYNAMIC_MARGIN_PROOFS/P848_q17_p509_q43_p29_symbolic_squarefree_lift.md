# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_symbolic_squarefree_lift`
- Status: `first_p29_symbolic_squarefree_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 7031700794073966078153710526635826514162061609350757 mod 48513487455255588983234342795722410720087709680396900`
- Endpoint prime: `29`
- Window: `28500`

## Availability Split

- Formula: `k_29(t) = (0*t + 330) mod 841`
- Available residues: `1/1`
- Unavailable residues: `0/1`
- Universal inside window: `true`
- First available residue: `{"tResidue":0,"k":330}`
- First unavailable residue: `null`

## First Available Family Audit

- Representative left: `7031700794073966078153710526635826514162061609350757`
- k/delta/right: `330`, `-8264`, `7031700794073966078153710526635826514162061609342493`
- Representative status: `exact_squarefree`
- Square obstruction: `59^2 = 3481`
- Root residues: `2833,3360` modulo `3481`; selected root `2833`.
- Lifted parameter subclass: `t == 2382553 mod 2927521`.
- Lifted left subclass: `left == 115585962108682363372738011284687343464203647124220284636457 mod 142024253308497297115787186455676067553681891931265213084900`.
- Divisibility: `59^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet disproves the naive p29 symbolic squarefree lift by emitting the first square-divisor subprogression inside the universally window-available subclass. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_square_obstruction_subclass` [next]: Split the p29 square-obstruction subclass by the emitted square divisor and test alternate endpoints on that subclass.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_square_obstruction_subclass`
