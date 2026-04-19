# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_availability_split`
- Status: `first_p41_available_square_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 1532646257 mod 4904901225`
- Endpoint prime: `41`
- Window: `28500`

## Availability Split

- Formula: `k_41(t) = (1496*t + 1011) mod 1681`
- Available residues: `1140/1681`
- Unavailable residues: `541/1681`
- Universal inside window: `false`
- First available residue: `{"tResidue":0,"k":1011}`
- First unavailable residue: `{"tResidue":6,"k":1582}`

## First Available Family Audit

- Representative left: `1532646257`
- k/delta/right: `1011`, `-25289`, `1532620968`
- Representative status: `exact_squarefree`
- Square obstruction: `13^2 = 169`
- Root residues: `71,118` modulo `169`; selected root `71`.
- Lifted parameter subclass: `t == 119351 mod 284089`.
- Lifted left subclass: `left == 585406398751232 mod 1393428484109025`.
- Divisibility: `13^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet splits p41 availability and proves the first available residue family is itself not globally squarefree. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_available_square_obstruction_subclass` [next]: Split the p41-available residue family by the emitted square obstruction and test alternate endpoints on that subclass.
- `route_p41_unavailable_residues` [later]: Route the first p41-unavailable residue family to alternate endpoints or a successor atom.

## Recommended Next Action

- `split_q17_p41_available_square_obstruction_subclass`
