# Problem 848 Endpoint Obstruction Availability Split

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_availability_split`
- Status: `first_p47_available_square_obstruction_subclass_emitted`
- Residual subclass: `left ≡ 115585962108682363372738011284687343464203647124220284636457 mod 142024253308497297115787186455676067553681891931265213084900`
- Endpoint prime: `47`
- Window: `28500`

## Availability Split

- Formula: `k_47(t) = (600*t + 682) mod 2209`
- Available residues: `1140/2209`
- Unavailable residues: `1069/2209`
- Universal inside window: `false`
- First available residue: `{"tResidue":0,"k":682}`
- First unavailable residue: `{"tResidue":1,"k":1282}`

## First Available Family Audit

- Representative left: `115585962108682363372738011284687343464203647124220284636457`
- k/delta/right: `682`, `-17064`, `115585962108682363372738011284687343464203647124220284619393`
- Representative status: `exact_squarefree`
- Square obstruction: `67^2 = 4489`
- Root residues: `2484,3069` modulo `4489`; selected root `2484`.
- Lifted parameter subclass: `t == 5487156 mod 9916201`.
- Lifted left subclass: `left == 779309349273202903535037727621392952820934379605640625790372180857 mod 1408341042681974206156866014118961476751887930450704037257698464900`.
- Divisibility: `67^2 | left*right+1`; cross-product residue `0`.
- Representative avoids emitted obstruction root: `true`.

## Claims

- Availability split: `true`
- Available subfamily squarefree hitting: `false`
- Disproves universal available residue family: `true`
- All-N: `false`

## Boundary

- This packet splits p47 availability and proves the first available residue family is itself not globally squarefree. It does not invalidate the representative repair.

## Next Theorem Options

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_available_square_obstruction_subclass` [next]: Split the p47-available residue family by the emitted square obstruction and test alternate endpoints on that subclass.
- `route_p47_unavailable_residues` [later]: Route the first p47-unavailable residue family to alternate endpoints or a successor atom.

## Recommended Next Action

- `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_available_square_obstruction_subclass`
