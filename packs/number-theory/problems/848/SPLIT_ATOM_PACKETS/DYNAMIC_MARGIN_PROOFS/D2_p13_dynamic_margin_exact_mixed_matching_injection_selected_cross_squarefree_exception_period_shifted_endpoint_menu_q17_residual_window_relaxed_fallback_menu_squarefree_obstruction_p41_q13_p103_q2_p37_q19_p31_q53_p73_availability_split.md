# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_availability_split`
- Status: `first_p73_available_square_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 10390944420957176989470317158457 mod 78886902115582138292443092900900`
- Endpoint prime: `73`
- Window: `28500`

## Availability Split

- Formula: `k_73(t) = (5184*t + 42) mod 5329`
- Available residues: `1140/5329`
- Unavailable residues: `4189/5329`
- Universal inside window: `false`
- First available residue: `{"tResidue":0,"k":42}`
- First unavailable residue: `{"tResidue":1,"k":5226}`

## First Available Family Audit

- Representative left: `10390944420957176989470317158457`
- k/delta/right: `42`, `-1064`, `10390944420957176989470317157393`
- Representative status: `exact_squarefree`
- Square obstruction: `11^2 = 121`
- Root residues: `46,115` modulo `121`; selected root `46`.
- Lifted parameter subclass: `t == 245134 mod 644809`.
- Lifted left subclass: `left == 19337872254145532845356734605486379057 mod 50866984466246403010211938290336428100`.
- Divisibility: `11^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet splits p73 availability and proves the first available residue family is itself not globally squarefree. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_available_square_obstruction_subclass` [next]: Split the p73-available residue family by the emitted square obstruction and test alternate endpoints on that subclass.
- `route_p73_unavailable_residues` [later]: Route the first p73-unavailable residue family to alternate endpoints or a successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_available_square_obstruction_subclass`
