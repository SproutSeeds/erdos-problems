# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_availability_split`
- Status: `first_p37_available_square_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 14783468194311397457 mod 59131531151650584900`
- Endpoint prime: `37`
- Window: `28500`

## Availability Split

- Formula: `k_37(t) = (1359*t + 457) mod 1369`
- Available residues: `1140/1369`
- Unavailable residues: `229/1369`
- Universal inside window: `false`
- First available residue: `{"tResidue":0,"k":457}`
- First unavailable residue: `{"tResidue":46,"k":1366}`

## First Available Family Audit

- Representative left: `14783468194311397457`
- k/delta/right: `457`, `-11439`, `14783468194311386018`
- Representative status: `exact_squarefree`
- Square obstruction: `19^2 = 361`
- Root residues: `40,203` modulo `361`; selected root `40`.
- Lifted parameter subclass: `t == 54760 mod 494209`.
- Lifted left subclass: `left == 3238057429332580340521457 mod 29223334878926083912844100`.
- Divisibility: `19^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet splits p37 availability and proves the first available residue family is itself not globally squarefree. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_available_square_obstruction_subclass` [next]: Split the p37-available residue family by the emitted square obstruction and test alternate endpoints on that subclass.
- `route_p37_unavailable_residues` [later]: Route the first p37-unavailable residue family to alternate endpoints or a successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_available_square_obstruction_subclass`
