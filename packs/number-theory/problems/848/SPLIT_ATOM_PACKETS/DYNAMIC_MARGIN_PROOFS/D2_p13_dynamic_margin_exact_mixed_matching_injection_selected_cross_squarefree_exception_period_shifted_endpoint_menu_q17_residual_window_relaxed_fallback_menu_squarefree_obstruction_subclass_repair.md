# Problem 848 Endpoint Obstruction Subclass Repair

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_subclass`
- Status: `representative_repair_found_availability_split_needed`
- Residual subclass: `left ≡ 1532646257 mod 4904901225`
- Window: `28500`
- Blocked endpoint prime: `23`
- Blocked square divisor: `841`

## Source Obstruction

- t subclass: `t == 139015 mod 444889`
- left subclass: `left == 1532646257 mod 4904901225`
- witness: `29^2 | left*right+1`

## Representative Repair

- Representative left: `1532646257`
- Blocked endpoint: p=`23`, status `non_squarefree`, square divisor `841`.
- Alternate endpoint: p=`41`, k=`1011`, delta=`-25289`, right=`1532620968`, status `exact_squarefree`.
- Alternate availability: `k_41(t) = (1496*t + 1011) mod 1681`, available `1140/1681`, universal `false`.
- First unavailable residue: `{"tResidue":6,"k":1582}`

## Claims

- Representative repair: `true`
- Subclass coverage: `false`
- Symbolic squarefree hitting: `false`
- All-N: `false`

## Boundary

- This packet repairs the emitted square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.

## Next Theorem Options

- `split_q17_obstruction_subclass_by_p41_availability` [next]: Split the obstruction subclass by the p41 availability rule and then audit squarefree hitting on the available subfamilies.
- `emit_unrepaired_square_obstruction_successor` [fallback]: If the alternate endpoint cannot be lifted, emit the p23/q29 obstruction subclass as the next deterministic successor atom.

## Recommended Next Action

- `split_q17_obstruction_subclass_by_p41_availability`
