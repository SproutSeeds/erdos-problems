# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_availability_split`
- Status: `first_p79_available_square_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 779309349273202903535037727621392952820934379605640625790372180857 mod 1408341042681974206156866014118961476751887930450704037257698464900`
- Endpoint prime: `79`
- Window: `28500`

## Availability Split

- Formula: `k_79(t) = (22*t + 635) mod 6241`
- Available residues: `1140/6241`
- Unavailable residues: `5101/6241`
- Universal inside window: `false`
- First available residue: `{"tResidue":0,"k":635}`
- First unavailable residue: `{"tResidue":23,"k":1141}`

## First Available Family Audit

- Representative left: `779309349273202903535037727621392952820934379605640625790372180857`
- k/delta/right: `635`, `-15889`, `779309349273202903535037727621392952820934379605640625790372164968`
- Representative status: `exact_squarefree`
- Square obstruction: `71^2 = 5041`
- Root residues: `739,2187` modulo `5041`; selected root `739`.
- Lifted parameter subclass: `t == 4612099 mod 31460881`.
- Lifted left subclass: `left == 6495409093921839827444779121889775729358858393078141245172819622639005957 mod 44307649951233511344970629003140966863675412705245876082384017738101576900`.
- Divisibility: `71^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet splits p79 availability and proves the first available residue family is itself not globally squarefree. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_available_square_obstruction_subclass` [next]: Split the p79-available residue family by the emitted square obstruction and test alternate endpoints on that subclass.
- `route_p79_unavailable_residues` [later]: Route the first p79-unavailable residue family to alternate endpoints or a successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_available_square_obstruction_subclass`
