# D2.1_persist_outP2=70_out25=9_smaller=side7.square_961_out_504

This is a focused successor packet emitted from a Problem 848 split atom refinement condition.

## Summary

- Packet id: `p848_split_atom_successor_packet_D2_1_persist_outP2_70_out25_9_smaller_side7_square_961_outsider_504`
- Parent atom: `D2.1_persist_outP2=70_out25=9_smaller=side7`
- Condition: `square_961_outsider_504`
- Priority: `dominant_refinement_successor`
- Status: `candidate_successor_obligation_verified`
- Successor split: `outP2=70|out25=9|smaller=side7|out961=504`
- Successor modulus: `4060225`
- Square witness: `961`
- Required outsider residue: `504`
- Affected atoms: `1`
- Stabilized atoms: `1`
- Failed atoms: `0`
- Symbolic family lemma: `symbolic_vertex_family_lemma_verified`
- Vertex residue family: `368 mod 961`

## Theorem Obligation

Under outP2=70|out25=9|smaller=side7|out961=504, stabilize the 1 literal vertex-presence atoms whose first square witness is 961.

Boundary: This successor packet stabilizes one vertex-presence subfamily only; it is not a full split lemma until the sibling refinement conditions and matching/edge obligations are promoted too.

## Symbolic Vertex-Family Lemma

If outsider ≡ 504 (mod 961) and vertex ≡ 368 (mod 961), then outsider * vertex + 1 ≡ 0 (mod 961).

Boundary: This proves the square-residue vertex-presence family for this successor condition only; sibling conditions still need their own family lemmas.

## Next Theorem Actions

- Promote this square-residue successor into a symbolic vertex-family lemma.
- After this condition is proved, attack the next sibling square-residue successor condition.
- Do not treat this sub-obligation as a full split proof until all sibling vertex conditions and edge obstructions are handled.

## Affected Vertex Atoms

- `D2.1_persist_outP2=70_out25=9_smaller=side7.V115.right_368`: side=side18, value=368, status=`bounded_presence_stabilized_by_successor_square_residue`
