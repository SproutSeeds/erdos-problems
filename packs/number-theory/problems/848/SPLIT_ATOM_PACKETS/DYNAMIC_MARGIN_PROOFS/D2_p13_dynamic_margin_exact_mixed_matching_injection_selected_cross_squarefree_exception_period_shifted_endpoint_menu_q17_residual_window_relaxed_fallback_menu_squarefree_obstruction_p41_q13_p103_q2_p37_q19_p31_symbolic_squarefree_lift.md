# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_symbolic_squarefree_lift`
- Status: `first_p31_symbolic_squarefree_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 3238057429332580340521457 mod 29223334878926083912844100`
- Endpoint prime: `31`
- Window: `28500`

## Availability Split

- Formula: `k_31(t) = (506*t + 727) mod 961`
- Available residues: `961/961`
- Unavailable residues: `0/961`
- Universal inside window: `true`
- First available residue: `{"tResidue":0,"k":727}`
- First unavailable residue: `null`

## First Available Family Audit

- Representative left: `3238057429332580340521457`
- k/delta/right: `727`, `-18189`, `3238057429332580340503268`
- Representative status: `exact_squarefree`
- Square obstruction: `53^2 = 2809`
- Root residues: `370,2785` modulo `2809`; selected root `370`.
- Lifted parameter subclass: `t == 355570 mod 2699449`.
- Lifted left subclass: `left == 10390944420957176989470317158457 mod 78886902115582138292443092900900`.
- Divisibility: `53^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet disproves the naive p31 symbolic squarefree lift by emitting the first square-divisor subprogression inside the universally window-available subclass. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_square_obstruction_subclass` [next]: Split the p31 square-obstruction subclass by the emitted square divisor and test alternate endpoints on that subclass.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_square_obstruction_subclass`
