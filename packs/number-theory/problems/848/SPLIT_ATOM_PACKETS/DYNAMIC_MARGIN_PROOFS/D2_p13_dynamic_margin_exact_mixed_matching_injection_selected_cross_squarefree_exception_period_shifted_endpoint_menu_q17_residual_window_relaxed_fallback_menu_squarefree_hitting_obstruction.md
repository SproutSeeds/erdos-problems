# Problem 848 Endpoint Squarefree-Hitting Audit

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_hitting_residue_cover`
- Status: `first_square_obstruction_residue_subclass_emitted`
- Residual class: `left ≡ 5882 mod 11025`
- Window: `28500`
- Scan start: `27932207`; scan end: `40000000`
- Audited selected families before stop: `1`
- Obstruction-prime limit: `31`

## First Obstruction

- Selected bounded row: `left=27932207`, `t=2533`, endpoint `p=23`, `k=479`, `delta=-11989`, status `exact_squarefree`.
- Endpoint residue family: `t ≡ 417 mod 529`; bounded-family parameter `4`.
- Square obstruction: `29^2 = 841`.
- Obstruction root residues: `262,487` modulo `841`; selected root `262`.
- Lifted t subclass: `t == 139015 mod 444889`.
- Lifted left subclass: `left == 1532646257 mod 4904901225`.
- Endpoint on subclass: `k=479`, `delta=-11989`, `right=1532634268`.
- Divisibility: `29^2 | left*right+1`; cross-product residue `0`.
- Bounded row avoids emitted obstruction root: `true`.

## Claims

- Endpoint formulas: `true`
- Bounded endpoint assignment: `true`
- Symbolic squarefree hitting: `false`
- Disproves universal selected residue family: `true`
- All-N: `false`

## Boundary

- This packet proves that the selected endpoint residue family is not globally squarefree: a square-divisor subprogression exists. It does not invalidate the exact bounded row witness.

## Next Theorem Options

- `split_q17_endpoint_menu_squarefree_obstruction_subclass` [next]: Split the emitted square-obstruction subclass and either choose an alternate endpoint menu on that subclass or emit it as the next deterministic successor atom.
- `bounded_interval_squarefree_certificate` [later]: Keep the bounded exact-factor certificate as bounded evidence only; it cannot stand in for the false universal residue-family lemma.

## Recommended Next Action

- `split_q17_endpoint_menu_squarefree_obstruction_subclass`
