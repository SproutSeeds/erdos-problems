# D3.2_persist_outP2=251_out25=1_smaller=side18

This is a theorem-facing split atom packet for Problem 848. It is intentionally atomic: one split profile, one common matching core, one K-envelope, and deterministic sub-atoms for the next proof pass.

## Summary

- Packet id: `p848_split_atom_packet_D3_2_persist_outP2_251_out25_1_smaller_side18`
- Parent obligation: `D3_p17_matching_lower_bound`
- Target obligation: `D4_matching_bound_implies_sMaxMixed_bound`
- Prime lane: `17`
- Split key: `outP2=251|out25=1|smaller=side18`
- Priority: `supporting_p17_companion_lane`
- Status: `ready_for_symbolic_persistence_work`
- Witnesses: `2` over `7307..7318`
- Common core size: `106`
- K-envelope: `[10,11]`, slack against max K `95`
- Vertex atoms: `212`
- Vertex atoms stable under current split modulus: `2`
- Vertex atoms needing sharper split or parameterization: `210`
- Edge atoms: `106`
- Edge certificate: `literal_edge_obstruction_certificate_verified`
- Edge congruence persistence: `literal_constant_edge_persistence_verified`
- Disjointness: `bounded_disjointness_certified`
- Matching/K certificate: `literal_matching_sampled_k_envelope_verified`

## Goal

Prove that the 106-edge common matching core persists for all p=17 threatening rows in split outP2=251|out25=1|smaller=side18, or replace it with a parameterized extension core.

## Falsifier Boundary

A row in this split loses one of the common-core missing-cross edges before a replacement edge is proved, or its K(N,x) exceeds the symbolic core size.

## Next Theorem Actions

- Promote the literal vertex-presence checks into residue-family vertex formulas if the vertices move with N.
- The current split modulus does not stabilize every vertex compatibility witness; either sharpen the split by the missing square-witness residues or replace literal vertices with parameterized families.
- Group edge obstruction atoms by residue pattern and product-plus-one squarefree check before attempting a symbolic persistence proof.
- Attack the packet until it either becomes a split lemma or emits a sharper sub-split key.

## K Envelope

- Status: `bounded_core_meets_sampled_K_envelope`
- Common core count: `106`
- Max required K: `11`
- Min matching slack: `96`

## Matching And K-Envelope Certificate

- Status: `literal_matching_sampled_k_envelope_verified`
- Proof kind: `literal_disjoint_matching_plus_sampled_k_envelope`
- Matching proof: `literal_matching_disjointness_verified`
- K proof: `sampled_k_envelope_dominated_by_literal_core`
- K inequality: `106 >= 11`
- Proof boundary: A6/A7 are certified for this literal packet. Split discharge still needs the vertex-successor proofs, edge persistence, and row-universe coverage to be assembled without bounded-only overclaim.

## Split Discharge Readiness

- Status: `split_discharge_readiness_blocked`
- Proof kind: `lower_atom_assembly_with_explicit_all_n_handoff`
- Theorem candidate: `blocked_by_lower_atom`
- Blocking lower checks: `1`
- Open all-N handoff gaps: `3`
- Proof boundary: This is readiness for a theorem-facing split lemma candidate, not a final all-N proof. The listed all-N handoff gaps must stay visible until discharged by the row-universe and symbolic K-formula lanes.
- Handoff gap `row_universe_split_coverage` [open]: Prove every future threatening row in the parent lane is covered by an emitted and discharged split profile.
- Handoff gap `universal_k_formula_lift` [open]: Replace the sampled packet K-envelope with the symbolic K(N,x) inequality used by the all-N D2/D3 lane.
- Handoff gap `literal_to_parameterized_vertex_guard` [open_if_vertices_move]: If later rows require moving vertex formulas instead of literal constants, re-run vertex, edge, and disjointness checks on the parameterized families.

## Vertex Presence Stability

- Split modulus: `7225`
- Witness rows: `2`
- Stable under current split modulus: `2`
- Needs sharper split or parametric witness: `210`
- First unstable vertex atom `D3.2_persist_outP2=251_out25=1_smaller=side18.V1.left_57`: side side7, value 57, first square witness {"divisor":2,"square":4,"quotient":3577,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.2_persist_outP2=251_out25=1_smaller=side18.V2.left_82`: side side7, value 82, first square witness {"divisor":3,"square":9,"quotient":2287,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.2_persist_outP2=251_out25=1_smaller=side18.V3.left_157`: side side7, value 157, first square witness {"divisor":2,"square":4,"quotient":9852,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.2_persist_outP2=251_out25=1_smaller=side18.V4.left_257`: side side7, value 257, first square witness {"divisor":2,"square":4,"quotient":16127,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.2_persist_outP2=251_out25=1_smaller=side18.V5.left_307`: side side7, value 307, first square witness {"divisor":3,"square":9,"quotient":8562,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.2_persist_outP2=251_out25=1_smaller=side18.V6.left_357`: side side7, value 357, first square witness {"divisor":2,"square":4,"quotient":22402,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.2_persist_outP2=251_out25=1_smaller=side18.V7.left_457`: side side7, value 457, first square witness {"divisor":2,"square":4,"quotient":28677,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.2_persist_outP2=251_out25=1_smaller=side18.V8.left_532`: side side7, value 532, first square witness {"divisor":3,"square":9,"quotient":14837,"stableUnderCurrentSplitModulus":false}

## Vertex Presence Refinement

- Status: `literal_core_requires_sharper_square_witness_split`
- Deterministic move: `emit_successor_atoms_by_square_witness_residue`
- Refinement condition count: `9`
- Covered unstable atoms: `210`
- Uncovered unstable atoms: `0`
- Proof boundary: These square-witness residue classes explain the bounded literal vertex-presence instability; each successor split still needs a theorem-facing persistence proof before it can support an all-N claim.
- Condition `square_4_outsider_3`: out mod 4 = 3, atoms=144, combined modulus=28900, successor=`outP2=251|out25=1|smaller=side18|out4=3`
- Condition `square_9_outsider_8`: out mod 9 = 8, atoms=47, combined modulus=65025, successor=`outP2=251|out25=1|smaller=side18|out9=8`
- Condition `square_49_outsider_6`: out mod 49 = 6, atoms=8, combined modulus=354025, successor=`outP2=251|out25=1|smaller=side18|out49=6`
- Condition `square_121_outsider_9`: out mod 121 = 9, atoms=3, combined modulus=874225, successor=`outP2=251|out25=1|smaller=side18|out121=9`
- Condition `square_169_outsider_82`: out mod 169 = 82, atoms=3, combined modulus=1221025, successor=`outP2=251|out25=1|smaller=side18|out169=82`
- Condition `square_361_outsider_251`: out mod 361 = 251, atoms=2, combined modulus=2608225, successor=`outP2=251|out25=1|smaller=side18|out361=251`
- Condition `square_1681_outsider_251`: out mod 1681 = 251, atoms=1, combined modulus=12145225, successor=`outP2=251|out25=1|smaller=side18|out1681=251`
- Condition `square_5041_outsider_251`: out mod 5041 = 251, atoms=1, combined modulus=36421225, successor=`outP2=251|out25=1|smaller=side18|out5041=251`
- Condition `square_22801_outsider_251`: out mod 22801 = 251, atoms=1, combined modulus=164737225, successor=`outP2=251|out25=1|smaller=side18|out22801=251`

## Edge Obstruction Certificate

- Status: `literal_edge_obstruction_certificate_verified`
- Proof kind: `literal_product_plus_one_squarefree_missing_edge_certificate`
- Edge atoms: `106`
- Squarefree edge atoms: `106`
- Non-squarefree edge atoms: `0`
- Product-plus-one range: `{"min":3877,"max":51466702}`
- Mod 25 classes: `1`
- Prime-residue classes: `88`
- Prime-square fingerprints: `106`
- Proof boundary: This certifies only the exported literal edge-obstruction atoms for the current split packet. If a later proof replaces literal vertices with moving vertex families, this certificate must be lifted into a symbolic residue-family obstruction proof before it can support an all-N claim.
- Mod25 class `7:18`: edges=106
- Prime-residue class `12:14:16`: edges=3
- Prime-residue class `1:1:2`: edges=2
- Prime-residue class `1:9:10`: edges=2
- Prime-residue class `10:10:16`: edges=2
- Prime-residue class `10:12:2`: edges=2
- Prime-residue class `11:11:3`: edges=2
- Prime-residue class `13:13:0`: edges=2
- Prime-residue class `13:15:9`: edges=2
- Prime-residue class `14:12:16`: edges=2
- Prime-residue class `16:16:2`: edges=2
- Prime-residue class `2:13:10`: edges=2
- Prime-residue class `3:3:10`: edges=2
- Prime-residue class `4:16:14`: edges=2

## Edge Congruence Persistence

- Status: `literal_constant_edge_persistence_verified`
- Proof kind: `constant_pair_squarefree_invariant`
- Edge atoms: `106`
- Verified edge atoms: `106`
- Failed edge atoms: `0`
- Depends on sampled N: `no`
- Depends on witness outsider: `no`
- Proof boundary: This verifies A5 congruence persistence only for the exported literal matching core. It does not prove that future parameterized vertex families preserve the same squarefree edge obstructions.
- Family `D3.2_persist_outP2=251_out25=1_smaller=side18.edge_constant_squarefree_family`: status=`congruence_persistence_family_verified`, edges=106, proof=constant_pair_squarefree_invariant

## Matching Core

- Pair (57, 68); residues mod25 7:18, mod p 6:0, mod p^2 57:68; product+1 mod p^2 120
- Pair (82, 93); residues mod25 7:18, mod p 14:8, mod p^2 82:93; product+1 mod p^2 113
- Pair (157, 118); residues mod25 7:18, mod p 4:16, mod p^2 157:118; product+1 mod p^2 31
- Pair (257, 193); residues mod25 7:18, mod p 2:6, mod p^2 257:193; product+1 mod p^2 183
- Pair (307, 343); residues mod25 7:18, mod p 1:3, mod p^2 18:54; product+1 mod p^2 106
- Pair (357, 293); residues mod25 7:18, mod p 0:4, mod p^2 68:4; product+1 mod p^2 273
- Pair (457, 393); residues mod25 7:18, mod p 15:2, mod p^2 168:104; product+1 mod p^2 133
- Pair (532, 493); residues mod25 7:18, mod p 5:0, mod p^2 243:204; product+1 mod p^2 154
- Pair (557, 593); residues mod25 7:18, mod p 13:15, mod p^2 268:15; product+1 mod p^2 264
- Pair (657, 568); residues mod25 7:18, mod p 11:7, mod p^2 79:279; product+1 mod p^2 78
- Pair (757, 693); residues mod25 7:18, mod p 9:13, mod p^2 179:115; product+1 mod p^2 67
- Pair (857, 793); residues mod25 7:18, mod p 7:11, mod p^2 279:215; product+1 mod p^2 163
- Pair (957, 893); residues mod25 7:18, mod p 5:9, mod p^2 90:26; product+1 mod p^2 29
- Pair (982, 743); residues mod25 7:18, mod p 13:12, mod p^2 115:165; product+1 mod p^2 191
- Pair (1057, 993); residues mod25 7:18, mod p 3:7, mod p^2 190:126; product+1 mod p^2 243
- Pair (1082, 1018); residues mod25 7:18, mod p 11:15, mod p^2 215:151; product+1 mod p^2 98
- Pair (1157, 1093); residues mod25 7:18, mod p 1:5, mod p^2 1:226; product+1 mod p^2 227
- Pair (1207, 1118); residues mod25 7:18, mod p 0:13, mod p^2 51:251; product+1 mod p^2 86
- Pair (1257, 1193); residues mod25 7:18, mod p 16:3, mod p^2 101:37; product+1 mod p^2 270
- Pair (1282, 1243); residues mod25 7:18, mod p 7:2, mod p^2 126:87; product+1 mod p^2 270
- Pair (1357, 1293); residues mod25 7:18, mod p 14:1, mod p^2 201:137; product+1 mod p^2 83
- Pair (1407, 1468); residues mod25 7:18, mod p 13:6, mod p^2 251:23; product+1 mod p^2 283
- Pair (1432, 1393); residues mod25 7:18, mod p 4:16, mod p^2 276:237; product+1 mod p^2 99
- Pair (1457, 1493); residues mod25 7:18, mod p 12:14, mod p^2 12:48; product+1 mod p^2 288
- Pair (1557, 1593); residues mod25 7:18, mod p 10:12, mod p^2 112:148; product+1 mod p^2 104
- Pair (1657, 1693); residues mod25 7:18, mod p 8:10, mod p^2 212:248; product+1 mod p^2 268
- Pair (1757, 1793); residues mod25 7:18, mod p 6:8, mod p^2 23:59; product+1 mod p^2 202
- Pair (1857, 1893); residues mod25 7:18, mod p 4:6, mod p^2 123:159; product+1 mod p^2 195
- Pair (1882, 1918); residues mod25 7:18, mod p 12:14, mod p^2 148:184; product+1 mod p^2 67
- Pair (1957, 1968); residues mod25 7:18, mod p 2:13, mod p^2 223:234; product+1 mod p^2 163
- Pair (2057, 2093); residues mod25 7:18, mod p 0:2, mod p^2 34:70; product+1 mod p^2 69
- Pair (2107, 2143); residues mod25 7:18, mod p 16:1, mod p^2 84:120; product+1 mod p^2 255
- Pair (2157, 1993); residues mod25 7:18, mod p 15:4, mod p^2 134:259; product+1 mod p^2 27
- Pair (2257, 2193); residues mod25 7:18, mod p 13:0, mod p^2 234:170; product+1 mod p^2 188
- Pair (2332, 2293); residues mod25 7:18, mod p 3:15, mod p^2 20:270; product+1 mod p^2 199
- Pair (2357, 2393); residues mod25 7:18, mod p 11:13, mod p^2 45:81; product+1 mod p^2 178
- Pair (2457, 2368); residues mod25 7:18, mod p 9:5, mod p^2 145:56; product+1 mod p^2 29
- Pair (2507, 2818); residues mod25 7:18, mod p 8:13, mod p^2 195:217; product+1 mod p^2 122
- Pair (2557, 2493); residues mod25 7:18, mod p 7:11, mod p^2 245:181; product+1 mod p^2 129
- Pair (2632, 2593); residues mod25 7:18, mod p 14:9, mod p^2 31:281; product+1 mod p^2 42
- Pair (2657, 2693); residues mod25 7:18, mod p 5:7, mod p^2 56:92; product+1 mod p^2 240
- Pair (2757, 2793); residues mod25 7:18, mod p 3:5, mod p^2 156:192; product+1 mod p^2 186
- Pair (2782, 2893); residues mod25 7:18, mod p 11:3, mod p^2 181:3; product+1 mod p^2 255
- Pair (2857, 2993); residues mod25 7:18, mod p 1:1, mod p^2 256:103; product+1 mod p^2 70
- Pair (2957, 3093); residues mod25 7:18, mod p 16:16, mod p^2 67:203; product+1 mod p^2 19
- Pair (3007, 3043); residues mod25 7:18, mod p 15:0, mod p^2 117:153; product+1 mod p^2 273
- Pair (3057, 3193); residues mod25 7:18, mod p 14:14, mod p^2 167:14; product+1 mod p^2 27
- Pair (3157, 3268); residues mod25 7:18, mod p 12:4, mod p^2 267:89; product+1 mod p^2 66
- Pair (3232, 3393); residues mod25 7:18, mod p 2:10, mod p^2 53:214; product+1 mod p^2 72
- Pair (3257, 3293); residues mod25 7:18, mod p 10:12, mod p^2 78:114; product+1 mod p^2 223
- Pair (3357, 3593); residues mod25 7:18, mod p 8:6, mod p^2 178:125; product+1 mod p^2 287
- Pair (3457, 3493); residues mod25 7:18, mod p 6:8, mod p^2 278:25; product+1 mod p^2 15
- Pair (3482, 3693); residues mod25 7:18, mod p 14:4, mod p^2 14:225; product+1 mod p^2 261
- Pair (3557, 3718); residues mod25 7:18, mod p 4:12, mod p^2 89:250; product+1 mod p^2 287
- Pair (3657, 3793); residues mod25 7:18, mod p 2:2, mod p^2 189:36; product+1 mod p^2 158
- Pair (3682, 3893); residues mod25 7:18, mod p 10:0, mod p^2 214:136; product+1 mod p^2 205
- Pair (3732, 3943); residues mod25 7:18, mod p 9:16, mod p^2 264:186; product+1 mod p^2 264
- Pair (3757, 3993); residues mod25 7:18, mod p 0:15, mod p^2 0:236; product+1 mod p^2 1
- Pair (3857, 4168); residues mod25 7:18, mod p 15:3, mod p^2 100:122; product+1 mod p^2 63
- Pair (3907, 4618); residues mod25 7:18, mod p 14:11, mod p^2 150:283; product+1 mod p^2 257
- Pair (3957, 4093); residues mod25 7:18, mod p 13:13, mod p^2 200:47; product+1 mod p^2 153
- Pair (4057, 4193); residues mod25 7:18, mod p 11:11, mod p^2 11:147; product+1 mod p^2 173
- Pair (4132, 4293); residues mod25 7:18, mod p 1:9, mod p^2 86:247; product+1 mod p^2 146
- Pair (4157, 4418); residues mod25 7:18, mod p 9:15, mod p^2 111:83; product+1 mod p^2 255
- Pair (4257, 4393); residues mod25 7:18, mod p 7:7, mod p^2 211:58; product+1 mod p^2 101
- Pair (4357, 4493); residues mod25 7:18, mod p 5:5, mod p^2 22:158; product+1 mod p^2 9
- Pair (4457, 4593); residues mod25 7:18, mod p 3:3, mod p^2 122:258; product+1 mod p^2 265
- Pair (4557, 4693); residues mod25 7:18, mod p 1:1, mod p^2 222:69; product+1 mod p^2 2
- Pair (4582, 4793); residues mod25 7:18, mod p 9:16, mod p^2 247:169; product+1 mod p^2 128
- Pair (4657, 4893); residues mod25 7:18, mod p 16:14, mod p^2 33:269; product+1 mod p^2 208
- Pair (4757, 5068); residues mod25 7:18, mod p 14:2, mod p^2 133:155; product+1 mod p^2 97
- Pair (4807, 4843); residues mod25 7:18, mod p 13:15, mod p^2 183:219; product+1 mod p^2 196
- Pair (4857, 4993); residues mod25 7:18, mod p 12:12, mod p^2 233:80; product+1 mod p^2 145
- Pair (4957, 5093); residues mod25 7:18, mod p 10:10, mod p^2 44:180; product+1 mod p^2 118
- Pair (5032, 5193); residues mod25 7:18, mod p 0:8, mod p^2 119:280; product+1 mod p^2 86
- Pair (5057, 5393); residues mod25 7:18, mod p 8:4, mod p^2 144:191; product+1 mod p^2 50
- Pair (5157, 5293); residues mod25 7:18, mod p 6:6, mod p^2 244:91; product+1 mod p^2 241
- Pair (5182, 5418); residues mod25 7:18, mod p 14:12, mod p^2 269:216; product+1 mod p^2 16
- Pair (5257, 5493); residues mod25 7:18, mod p 4:2, mod p^2 55:2; product+1 mod p^2 111
- Pair (5282, 5543); residues mod25 7:18, mod p 12:1, mod p^2 80:52; product+1 mod p^2 115
- Pair (5307, 5518); residues mod25 7:18, mod p 3:10, mod p^2 105:27; product+1 mod p^2 235
- Pair (5357, 5793); residues mod25 7:18, mod p 2:13, mod p^2 155:13; product+1 mod p^2 282
- Pair (5457, 5593); residues mod25 7:18, mod p 0:0, mod p^2 255:102; product+1 mod p^2 1
- Pair (5482, 5643); residues mod25 7:18, mod p 8:16, mod p^2 280:152; product+1 mod p^2 78
- Pair (5557, 5693); residues mod25 7:18, mod p 15:15, mod p^2 66:202; product+1 mod p^2 39
- Pair (5657, 5968); residues mod25 7:18, mod p 13:1, mod p^2 166:188; product+1 mod p^2 286
- Pair (5707, 5743); residues mod25 7:18, mod p 12:14, mod p^2 216:252; product+1 mod p^2 101
- Pair (5757, 5893); residues mod25 7:18, mod p 11:11, mod p^2 266:113; product+1 mod p^2 3
- Pair (5857, 5993); residues mod25 7:18, mod p 9:9, mod p^2 77:213; product+1 mod p^2 218
- Pair (5932, 6093); residues mod25 7:18, mod p 16:7, mod p^2 152:24; product+1 mod p^2 181
- Pair (5957, 6268); residues mod25 7:18, mod p 7:12, mod p^2 177:199; product+1 mod p^2 255
- Pair (6057, 6193); residues mod25 7:18, mod p 5:5, mod p^2 277:124; product+1 mod p^2 247
- Pair (6157, 6293); residues mod25 7:18, mod p 3:3, mod p^2 88:224; product+1 mod p^2 61
- Pair (6182, 6393); residues mod25 7:18, mod p 11:1, mod p^2 113:35; product+1 mod p^2 199
- Pair (6257, 6418); residues mod25 7:18, mod p 1:9, mod p^2 188:60; product+1 mod p^2 10
- Pair (6357, 6493); residues mod25 7:18, mod p 16:16, mod p^2 288:135; product+1 mod p^2 155
- Pair (6382, 6593); residues mod25 7:18, mod p 7:14, mod p^2 24:235; product+1 mod p^2 150
- Pair (6457, 6693); residues mod25 7:18, mod p 14:12, mod p^2 99:46; product+1 mod p^2 220
- Pair (6507, 6643); residues mod25 7:18, mod p 13:13, mod p^2 149:285; product+1 mod p^2 272
- Pair (6557, 6868); residues mod25 7:18, mod p 12:0, mod p^2 199:221; product+1 mod p^2 52
- Pair (6657, 6793); residues mod25 7:18, mod p 10:10, mod p^2 10:146; product+1 mod p^2 16
- Pair (6757, 6893); residues mod25 7:18, mod p 8:8, mod p^2 110:246; product+1 mod p^2 184
- Pair (6832, 6993); residues mod25 7:18, mod p 15:6, mod p^2 185:57; product+1 mod p^2 142
- Pair (6857, 7193); residues mod25 7:18, mod p 6:2, mod p^2 210:257; product+1 mod p^2 217
- Pair (6957, 7093); residues mod25 7:18, mod p 4:4, mod p^2 21:157; product+1 mod p^2 119
- Pair (7057, 7293); residues mod25 7:18, mod p 2:0, mod p^2 121:68; product+1 mod p^2 137
