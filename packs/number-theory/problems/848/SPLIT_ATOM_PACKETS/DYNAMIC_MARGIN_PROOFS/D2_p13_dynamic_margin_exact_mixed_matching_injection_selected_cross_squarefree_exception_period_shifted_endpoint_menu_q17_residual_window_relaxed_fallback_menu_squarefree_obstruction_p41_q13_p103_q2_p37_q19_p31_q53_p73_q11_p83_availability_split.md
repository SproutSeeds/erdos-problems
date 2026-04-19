# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_availability_split`
- Status: `first_p83_available_square_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 19337872254145532845356734605486379057 mod 50866984466246403010211938290336428100`
- Endpoint prime: `83`
- Window: `28500`

## Availability Split

- Formula: `k_83(t) = (3454*t + 1053) mod 6889`
- Available residues: `1140/6889`
- Unavailable residues: `5749/6889`
- Universal inside window: `false`
- First available residue: `{"tResidue":0,"k":1053}`
- First unavailable residue: `{"tResidue":1,"k":4507}`

## First Available Family Audit

- Representative left: `19337872254145532845356734605486379057`
- k/delta/right: `1053`, `-26339`, `19337872254145532845356734605486352718`
- Representative status: `exact_squarefree`
- Square obstruction: `17^2 = 289`
- Root residues: `201,275` modulo `289`; selected root `201`.
- Lifted parameter subclass: `t == 1384689 mod 1990921`.
- Lifted left subclass: `left == 70434973191454519683340203976042263775739957 mod 101272147580523754927494162392934891769280100`.
- Divisibility: `17^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet splits p83 availability and proves the first available residue family is itself not globally squarefree. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_available_square_obstruction_subclass` [next]: Split the p83-available residue family by the emitted square obstruction and test alternate endpoints on that subclass.
- `route_p83_unavailable_residues` [later]: Route the first p83-unavailable residue family to alternate endpoints or a successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_available_square_obstruction_subclass`
