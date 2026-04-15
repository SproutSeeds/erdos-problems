# D2.2_persist_outP2=99_out25=6_smaller=side18.square_361_out_138

This is a focused successor packet emitted from a Problem 848 split atom refinement condition.

## Summary

- Packet id: `p848_split_atom_successor_packet_D2_2_persist_outP2_99_out25_6_smaller_side18_square_361_outsider_138`
- Parent atom: `D2.2_persist_outP2=99_out25=6_smaller=side18`
- Condition: `square_361_outsider_138`
- Priority: `dominant_refinement_successor`
- Status: `candidate_successor_obligation_verified`
- Successor split: `outP2=99|out25=6|smaller=side18|out361=138`
- Successor modulus: `1525225`
- Square witness: `361`
- Required outsider residue: `138`
- Affected atoms: `1`
- Stabilized atoms: `1`
- Failed atoms: `0`
- Symbolic family lemma: `symbolic_vertex_family_lemma_verified`
- Vertex residue family: `34 mod 361`

## Theorem Obligation

Under outP2=99|out25=6|smaller=side18|out361=138, stabilize the 1 literal vertex-presence atoms whose first square witness is 361.

Boundary: This successor packet stabilizes one vertex-presence subfamily only; it is not a full split lemma until the sibling refinement conditions and matching/edge obligations are promoted too.

## Symbolic Vertex-Family Lemma

If outsider ≡ 138 (mod 361) and vertex ≡ 34 (mod 361), then outsider * vertex + 1 ≡ 0 (mod 361).

Boundary: This proves the square-residue vertex-presence family for this successor condition only; sibling conditions still need their own family lemmas.

## Next Theorem Actions

- Promote this square-residue successor into a symbolic vertex-family lemma.
- After this condition is proved, attack the next sibling square-residue successor condition.
- Do not treat this sub-obligation as a full split proof until all sibling vertex conditions and edge obstructions are handled.

## Affected Vertex Atoms

- `D2.2_persist_outP2=99_out25=6_smaller=side18.V98.left_6532`: side=side7, value=6532, status=`bounded_presence_stabilized_by_successor_square_residue`
