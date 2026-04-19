# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_availability_split`
- Status: `first_p103_available_square_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 585406398751232 mod 1393428484109025`
- Endpoint prime: `103`
- Window: `28500`

## Availability Split

- Formula: `k_103(t) = (1766*t + 532) mod 10609`
- Available residues: `1140/10609`
- Unavailable residues: `9469/10609`
- Universal inside window: `false`
- First available residue: `{"tResidue":0,"k":532}`
- First unavailable residue: `{"tResidue":1,"k":2298}`

## First Available Family Audit

- Representative left: `585406398751232`
- k/delta/right: `532`, `-13314`, `585406398737918`
- Representative status: `exact_squarefree`
- Square obstruction: `2^2 = 4`
- Root residues: `1,3` modulo `4`; selected root `1`.
- Lifted parameter subclass: `t == 10609 mod 42436`.
- Lifted left subclass: `left == 14783468194311397457 mod 59131531151650584900`.
- Divisibility: `2^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet splits p103 availability and proves the first available residue family is itself not globally squarefree. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_q13_p103_available_square_obstruction_subclass` [next]: Split the p103-available residue family by the emitted square obstruction and test alternate endpoints on that subclass.
- `route_p103_unavailable_residues` [later]: Route the first p103-unavailable residue family to alternate endpoints or a successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_available_square_obstruction_subclass`
