# Problem 848 Endpoint Obstruction Subclass Repair

- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_subclass`
- Status: `representative_repair_found_universal_window_squarefree_lift_needed`
- Residual subclass: `left ≡ 3238057429332580340521457 mod 29223334878926083912844100`
- Window: `28500`
- Blocked endpoint prime: `37`
- Blocked square divisor: `361`

## Source Obstruction

- t subclass: `t == 54760 mod 494209`
- left subclass: `left == 3238057429332580340521457 mod 29223334878926083912844100`
- witness: `19^2 | left*right+1`

## Representative Repair

- Representative left: `3238057429332580340521457`
- Blocked endpoint: p=`undefined`, status `undefined`, square divisor `(none)`.
- Alternate endpoint: p=`31`, k=`727`, delta=`-18189`, right=`3238057429332580340503268`, status `exact_squarefree`.
- Alternate availability: `k_31(t) = (506*t + 727) mod 961`, available `961/961`, universal `true`.
- First unavailable residue: `(none)`

## Claims

- Representative repair: `true`
- Subclass coverage: `false`
- Symbolic squarefree hitting: `false`
- All-N: `false`

## Boundary

- This packet repairs the emitted p41/q13/p103 parity/p37/q19 square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.

## Next Theorem Options

- `prove_q17_p41_q13_p103_q2_p37_q19_p31_symbolic_squarefree_lift` [next]: The p31 endpoint is universally inside the window on the p41/q13/p103 parity/p37/q19 subclass; prove the symbolic squarefree lift for that endpoint or emit its first square-divisor subprogression.
- `emit_p41_q13_p103_q2_p37_q19_square_obstruction_successor` [fallback]: If the alternate endpoint cannot be lifted, emit the p41/q13/p103 parity/p37/q19 obstruction subclass as the next deterministic successor atom.

## Recommended Next Action

- `prove_q17_p41_q13_p103_q2_p37_q19_p31_symbolic_squarefree_lift`
