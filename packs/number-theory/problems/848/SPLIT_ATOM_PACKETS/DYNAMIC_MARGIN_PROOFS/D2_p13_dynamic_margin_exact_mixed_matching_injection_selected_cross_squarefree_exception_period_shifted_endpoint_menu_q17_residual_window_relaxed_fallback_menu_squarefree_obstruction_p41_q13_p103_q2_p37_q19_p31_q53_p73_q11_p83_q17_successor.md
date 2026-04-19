# Problem 848 Endpoint Obstruction Successor

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_successor`
- Status: `successor_atom_emitted`
- Residual subclass: `left ≡ 70434973191454519683340203976042263775739957 mod 101272147580523754927494162392934891769280100`
- Representative left: `70434973191454519683340203976042263775739957`
- Window: `28500`
- Tested finite menu: `23,31,37,41,61,67,73,83,89,97,101,103,107,109,113,127,131,137,139,149,151`

## Source Obstruction

- t subclass: `t == 1384689 mod 1990921`
- left subclass: `left == 70434973191454519683340203976042263775739957 mod 101272147580523754927494162392934891769280100`
- witness: `17^2 | left*right+1`

## Finite-Menu No-Repair Witness

- Within-window usable endpoints: `0`
- Blocked within-window endpoints: `9`
- p=`23`, k=`479`, delta=`-11989`, square divisor `841`, status `non_squarefree`.
- p=`31`, k=`727`, delta=`-18189`, square divisor `2809`, status `non_squarefree`.
- p=`37`, k=`457`, delta=`-11439`, square divisor `361`, status `non_squarefree`.
- p=`41`, k=`1011`, delta=`-25289`, square divisor `169`, status `non_squarefree`.
- p=`61`, k=`395`, delta=`-9889`, square divisor `9`, status `non_squarefree`.
- p=`67`, k=`1084`, delta=`-27114`, square divisor `4`, status `non_squarefree`.
- p=`73`, k=`42`, delta=`-1064`, square divisor `121`, status `non_squarefree`.
- p=`83`, k=`1053`, delta=`-26339`, square divisor `289`, status `non_squarefree`.
- p=`103`, k=`532`, delta=`-13314`, square divisor `4`, status `non_squarefree`.

## Claims

- Emits deterministic successor atom: `true`
- No finite-menu representative repair: `true`
- All-prime no-repair: `false`
- All-N: `false`

## Boundary

- This packet emits an exact endpoint-menu successor atom from a finite tested-menu no-repair witness. It does not prove no repair exists outside the tested finite endpoint menu and does not prove any all-N claim.

## Next Theorem Options

- `attack_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_successor_atom` [next]: Attack the emitted successor atom with a symbolic obstruction proof, a sharper endpoint menu, or a smaller deterministic refinement.
- `route_sibling_unavailable_endpoint_residues` [later]: After this successor branch is routed, return to sibling unavailable endpoint residues from earlier availability splits.

## Recommended Next Action

- `attack_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_successor_atom`
