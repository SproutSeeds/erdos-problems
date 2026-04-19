# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_availability_split`
- Status: `first_p107_available_square_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 6495409093921839827444779121889775729358858393078141245172819622639005957 mod 44307649951233511344970629003140966863675412705245876082384017738101576900`
- Endpoint prime: `107`
- Window: `28500`

## Availability Split

- Formula: `k_107(t) = (3757*t + 913) mod 11449`
- Available residues: `1140/11449`
- Unavailable residues: `10309/11449`
- Universal inside window: `false`
- First available residue: `{"tResidue":0,"k":913}`
- First unavailable residue: `{"tResidue":1,"k":4670}`

## First Available Family Audit

- Representative left: `6495409093921839827444779121889775729358858393078141245172819622639005957`
- k/delta/right: `913`, `-22839`, `6495409093921839827444779121889775729358858393078141245172819622638983118`
- Representative status: `exact_squarefree`
- Square obstruction: `89^2 = 7921`
- Root residues: `1499,3302` modulo `7921`; selected root `1499`.
- Lifted parameter subclass: `t == 17162051 mod 90687529`.
- Lifted left subclass: `left == 760410154648626128533304355898763555393483209652336085943695959179023528577227857 mod 4018151289874337645868852921870587523537603036293953839351606997760601160064480100`.
- Divisibility: `89^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet splits p107 availability and proves the first available residue family is itself not globally squarefree. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_available_square_obstruction_subclass` [next]: Split the p107-available residue family by the emitted square obstruction and test alternate endpoints on that subclass.
- `route_p107_unavailable_residues` [later]: Route the first p107-unavailable residue family to alternate endpoints or a successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_available_square_obstruction_subclass`
