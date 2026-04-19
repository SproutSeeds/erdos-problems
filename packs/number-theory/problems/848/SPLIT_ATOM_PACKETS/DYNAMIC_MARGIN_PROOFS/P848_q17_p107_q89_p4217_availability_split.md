# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_availability_split`
- Status: `first_p4217_available_square_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 760410154648626128533304355898763555393483209652336085943695959179023528577227857 mod 4018151289874337645868852921870587523537603036293953839351606997760601160064480100`
- Endpoint prime: `4217`
- Window: `28500`

## Availability Split

- Formula: `k_4217(t) = (445517*t + 203) mod 17783089`
- Available residues: `1140/17783089`
- Unavailable residues: `17781949/17783089`
- Universal inside window: `false`
- First available residue: `{"tResidue":0,"k":203}`
- First unavailable residue: `{"tResidue":1,"k":445720}`

## First Available Family Audit

- Representative left: `760410154648626128533304355898763555393483209652336085943695959179023528577227857`
- k/delta/right: `203`, `-5089`, `760410154648626128533304355898763555393483209652336085943695959179023528577222768`
- Representative status: `exact_squarefree`
- Square obstruction: `61^2 = 3721`
- Root residues: `2371,2474` modulo `3721`; selected root `2371`.
- Lifted parameter subclass: `t == 42163704019 mod 66170874169`.
- Lifted left subclass: `left == 169420141690585054358732178817328088519972453794407467571322168411530879091645805420092749757 mod 265884583394279840187007549369466635122108056254479559599229627196756604148422140623504536900`.
- Divisibility: `61^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet splits p4217 availability and proves the first available residue family is itself not globally squarefree. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_available_square_obstruction_subclass` [next]: Split the p4217-available residue family by the emitted square obstruction and test alternate endpoints on that subclass.
- `route_p4217_unavailable_residues` [later]: Route the first p4217-unavailable residue family to alternate endpoints or a successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_available_square_obstruction_subclass`
