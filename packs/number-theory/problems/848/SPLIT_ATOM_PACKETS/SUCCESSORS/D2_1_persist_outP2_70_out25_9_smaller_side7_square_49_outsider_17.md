# D2.1_persist_outP2=70_out25=9_smaller=side7.square_49_out_17

This is a focused successor packet emitted from a Problem 848 split atom refinement condition.

## Summary

- Packet id: `p848_split_atom_successor_packet_D2_1_persist_outP2_70_out25_9_smaller_side7_square_49_outsider_17`
- Parent atom: `D2.1_persist_outP2=70_out25=9_smaller=side7`
- Condition: `square_49_outsider_17`
- Priority: `dominant_refinement_successor`
- Status: `candidate_successor_obligation_verified`
- Successor split: `outP2=70|out25=9|smaller=side7|out49=17`
- Successor modulus: `207025`
- Square witness: `49`
- Required outsider residue: `17`
- Affected atoms: `9`
- Stabilized atoms: `9`
- Failed atoms: `0`
- Symbolic family lemma: `symbolic_vertex_family_lemma_verified`
- Vertex residue family: `23 mod 49`

## Theorem Obligation

Under outP2=70|out25=9|smaller=side7|out49=17, stabilize the 9 literal vertex-presence atoms whose first square witness is 49.

Boundary: This successor packet stabilizes one vertex-presence subfamily only; it is not a full split lemma until the sibling refinement conditions and matching/edge obligations are promoted too.

## Symbolic Vertex-Family Lemma

If outsider ≡ 17 (mod 49) and vertex ≡ 23 (mod 49), then outsider * vertex + 1 ≡ 0 (mod 49).

Boundary: This proves the square-residue vertex-presence family for this successor condition only; sibling conditions still need their own family lemmas.

## Next Theorem Actions

- Promote this square-residue successor into a symbolic vertex-family lemma.
- After this condition is proved, attack the next sibling square-residue successor condition.
- Do not treat this sub-obligation as a full split proof until all sibling vertex conditions and edge obstructions are handled.

## Affected Vertex Atoms

- `D2.1_persist_outP2=70_out25=9_smaller=side7.V31.left_2032`: side=side7, value=2032, status=`bounded_presence_stabilized_by_successor_square_residue`
- `D2.1_persist_outP2=70_out25=9_smaller=side7.V48.left_3257`: side=side7, value=3257, status=`bounded_presence_stabilized_by_successor_square_residue`
- `D2.1_persist_outP2=70_out25=9_smaller=side7.V66.left_4482`: side=side7, value=4482, status=`bounded_presence_stabilized_by_successor_square_residue`
- `D2.1_persist_outP2=70_out25=9_smaller=side7.V102.left_6932`: side=side7, value=6932, status=`bounded_presence_stabilized_by_successor_square_residue`
- `D2.1_persist_outP2=70_out25=9_smaller=side7.V113.right_268`: side=side18, value=268, status=`bounded_presence_stabilized_by_successor_square_residue`
- `D2.1_persist_outP2=70_out25=9_smaller=side7.V134.right_1493`: side=side18, value=1493, status=`bounded_presence_stabilized_by_successor_square_residue`
- `D2.1_persist_outP2=70_out25=9_smaller=side7.V152.right_2718`: side=side18, value=2718, status=`bounded_presence_stabilized_by_successor_square_residue`
- `D2.1_persist_outP2=70_out25=9_smaller=side7.V186.right_5168`: side=side18, value=5168, status=`bounded_presence_stabilized_by_successor_square_residue`
- `D2.1_persist_outP2=70_out25=9_smaller=side7.V204.right_6393`: side=side18, value=6393, status=`bounded_presence_stabilized_by_successor_square_residue`
