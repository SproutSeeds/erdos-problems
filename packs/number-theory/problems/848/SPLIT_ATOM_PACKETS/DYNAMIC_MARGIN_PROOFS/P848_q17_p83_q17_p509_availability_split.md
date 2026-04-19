# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_availability_split`
- Status: `first_p509_available_square_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 70434973191454519683340203976042263775739957 mod 101272147580523754927494162392934891769280100`
- Endpoint prime: `509`
- Window: `28500`

## Availability Split

- Formula: `k_509(t) = (8757*t + 375) mod 259081`
- Available residues: `1140/259081`
- Unavailable residues: `257941/259081`
- Universal inside window: `false`
- First available residue: `{"tResidue":0,"k":375}`
- First unavailable residue: `{"tResidue":1,"k":9132}`

## First Available Family Audit

- Representative left: `70434973191454519683340203976042263775739957`
- k/delta/right: `375`, `-9389`, `70434973191454519683340203976042263775730568`
- Representative status: `exact_squarefree`
- Square obstruction: `43^2 = 1849`
- Root residues: `268,1643` modulo `1849`; selected root `268`.
- Lifted parameter subclass: `t == 69433708 mod 479040769`.
- Lifted left subclass: `left == 7031700794073966078153710526635826514162061609350757 mod 48513487455255588983234342795722410720087709680396900`.
- Divisibility: `43^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet splits p509 availability and proves the first available residue family is itself not globally squarefree. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_available_square_obstruction_subclass` [next]: Split the p509-available residue family by the emitted square obstruction and test alternate endpoints on that subclass.
- `route_p509_unavailable_residues` [later]: Route the first p509-unavailable residue family to alternate endpoints or a successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_available_square_obstruction_subclass`
