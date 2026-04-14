# D3.1_persist_outP2=38_out25=23_smaller=side7

This is a theorem-facing split atom packet for Problem 848. It is intentionally atomic: one split profile, one common matching core, one K-envelope, and deterministic sub-atoms for the next proof pass.

## Summary

- Packet id: `p848_split_atom_packet_D3_1_persist_outP2_38_out25_23_smaller_side7`
- Parent obligation: `D3_p17_matching_lower_bound`
- Target obligation: `D4_matching_bound_implies_sMaxMixed_bound`
- Prime lane: `17`
- Split key: `outP2=38|out25=23|smaller=side7`
- Priority: `supporting_p17_companion_lane`
- Status: `ready_for_symbolic_persistence_work`
- Witnesses: `10` over `7307..7393`
- Common core size: `109`
- K-envelope: `[12,14]`, slack against max K `95`
- Vertex atoms: `218`
- Vertex atoms stable under current split modulus: `2`
- Vertex atoms needing sharper split or parameterization: `216`
- Edge atoms: `109`
- Edge certificate: `literal_edge_obstruction_certificate_verified`
- Edge congruence persistence: `literal_constant_edge_persistence_verified`
- Disjointness: `bounded_disjointness_certified`
- Matching/K certificate: `literal_matching_sampled_k_envelope_verified`

## Goal

Prove that the 109-edge common matching core persists for all p=17 threatening rows in split outP2=38|out25=23|smaller=side7, or replace it with a parameterized extension core.

## Falsifier Boundary

A row in this split loses one of the common-core missing-cross edges before a replacement edge is proved, or its K(N,x) exceeds the symbolic core size.

## Next Theorem Actions

- Promote the literal vertex-presence checks into residue-family vertex formulas if the vertices move with N.
- The current split modulus does not stabilize every vertex compatibility witness; either sharpen the split by the missing square-witness residues or replace literal vertices with parameterized families.
- Group edge obstruction atoms by residue pattern and product-plus-one squarefree check before attempting a symbolic persistence proof.
- Attack the packet until it either becomes a split lemma or emits a sharper sub-split key.

## K Envelope

- Status: `bounded_core_meets_sampled_K_envelope`
- Common core count: `109`
- Max required K: `14`
- Min matching slack: `95`

## Matching And K-Envelope Certificate

- Status: `literal_matching_sampled_k_envelope_verified`
- Proof kind: `literal_disjoint_matching_plus_sampled_k_envelope`
- Matching proof: `literal_matching_disjointness_verified`
- K proof: `sampled_k_envelope_dominated_by_literal_core`
- K inequality: `109 >= 14`
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
- Witness rows: `10`
- Stable under current split modulus: `2`
- Needs sharper split or parametric witness: `216`
- First unstable vertex atom `D3.1_persist_outP2=38_out25=23_smaller=side7.V1.left_7`: side side7, value 7, first square witness {"divisor":2,"square":4,"quotient":7653,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.1_persist_outP2=38_out25=23_smaller=side7.V2.left_82`: side side7, value 82, first square witness {"divisor":3,"square":9,"quotient":39843,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.1_persist_outP2=38_out25=23_smaller=side7.V3.left_107`: side side7, value 107, first square witness {"divisor":2,"square":4,"quotient":116978,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.1_persist_outP2=38_out25=23_smaller=side7.V4.left_207`: side side7, value 207, first square witness {"divisor":2,"square":4,"quotient":226303,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.1_persist_outP2=38_out25=23_smaller=side7.V5.left_307`: side side7, value 307, first square witness {"divisor":2,"square":4,"quotient":335628,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.1_persist_outP2=38_out25=23_smaller=side7.V6.left_407`: side side7, value 407, first square witness {"divisor":2,"square":4,"quotient":444953,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.1_persist_outP2=38_out25=23_smaller=side7.V7.left_507`: side side7, value 507, first square witness {"divisor":2,"square":4,"quotient":554278,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D3.1_persist_outP2=38_out25=23_smaller=side7.V8.left_532`: side side7, value 532, first square witness {"divisor":3,"square":9,"quotient":258493,"stableUnderCurrentSplitModulus":false}

## Vertex Presence Refinement

- Status: `literal_core_requires_sharper_square_witness_split`
- Deterministic move: `emit_successor_atoms_by_square_witness_residue`
- Refinement condition count: `9`
- Covered unstable atoms: `216`
- Uncovered unstable atoms: `0`
- Proof boundary: These square-witness residue classes explain the bounded literal vertex-presence instability; each successor split still needs a theorem-facing persistence proof before it can support an all-N claim.
- Condition `square_4_outsider_1`: out mod 4 = 1, atoms=146, combined modulus=28900, successor=`outP2=38|out25=23|smaller=side7|out4=1`
- Condition `square_9_outsider_8`: out mod 9 = 8, atoms=48, combined modulus=65025, successor=`outP2=38|out25=23|smaller=side7|out9=8`
- Condition `square_49_outsider_12`: out mod 49 = 12, atoms=8, combined modulus=354025, successor=`outP2=38|out25=23|smaller=side7|out49=12`
- Condition `square_121_outsider_17`: out mod 121 = 17, atoms=5, combined modulus=874225, successor=`outP2=38|out25=23|smaller=side7|out121=17`
- Condition `square_169_outsider_148`: out mod 169 = 148, atoms=3, combined modulus=1221025, successor=`outP2=38|out25=23|smaller=side7|out169=148`
- Condition `square_361_outsider_41`: out mod 361 = 41, atoms=2, combined modulus=2608225, successor=`outP2=38|out25=23|smaller=side7|out361=41`
- Condition `square_961_outsider_529`: out mod 961 = 529, atoms=2, combined modulus=6943225, successor=`outP2=38|out25=23|smaller=side7|out961=529`
- Condition `square_24649_outsider_4373`: out mod 24649 = 4373, atoms=1, combined modulus=178089025, successor=`outP2=38|out25=23|smaller=side7|out24649=4373`
- Condition `square_1352569_outsider_4373`: out mod 1352569 = 4373, atoms=1, combined modulus=9772311025, successor=`outP2=38|out25=23|smaller=side7|out1352569=4373`

## Edge Obstruction Certificate

- Status: `literal_edge_obstruction_certificate_verified`
- Proof kind: `literal_product_plus_one_squarefree_missing_edge_certificate`
- Edge atoms: `109`
- Squarefree edge atoms: `109`
- Non-squarefree edge atoms: `0`
- Product-plus-one range: `{"min":302,"max":52924602}`
- Mod 25 classes: `1`
- Prime-residue classes: `81`
- Prime-square fingerprints: `109`
- Proof boundary: This certifies only the exported literal edge-obstruction atoms for the current split packet. If a later proof replaces literal vertices with moving vertex families, this certificate must be lifted into a symbolic residue-family obstruction proof before it can support an all-N claim.
- Mod25 class `7:18`: edges=109
- Prime-residue class `3:5:16`: edges=5
- Prime-residue class `5:7:2`: edges=4
- Prime-residue class `14:1:15`: edges=3
- Prime-residue class `7:9:13`: edges=3
- Prime-residue class `1:3:4`: edges=2
- Prime-residue class `10:14:5`: edges=2
- Prime-residue class `11:4:11`: edges=2
- Prime-residue class `12:16:6`: edges=2
- Prime-residue class `13:15:9`: edges=2
- Prime-residue class `14:14:10`: edges=2
- Prime-residue class `14:16:4`: edges=2
- Prime-residue class `15:11:13`: edges=2
- Prime-residue class `15:15:5`: edges=2

## Edge Congruence Persistence

- Status: `literal_constant_edge_persistence_verified`
- Proof kind: `constant_pair_squarefree_invariant`
- Edge atoms: `109`
- Verified edge atoms: `109`
- Failed edge atoms: `0`
- Depends on sampled N: `no`
- Depends on witness outsider: `no`
- Proof boundary: This verifies A5 congruence persistence only for the exported literal matching core. It does not prove that future parameterized vertex families preserve the same squarefree edge obstructions.
- Family `D3.1_persist_outP2=38_out25=23_smaller=side7.edge_constant_squarefree_family`: status=`congruence_persistence_family_verified`, edges=109, proof=constant_pair_squarefree_invariant

## Matching Core

- Pair (7, 43); residues mod25 7:18, mod p 7:9, mod p^2 7:43; product+1 mod p^2 13
- Pair (82, 118); residues mod25 7:18, mod p 14:16, mod p^2 82:118; product+1 mod p^2 140
- Pair (107, 143); residues mod25 7:18, mod p 5:7, mod p^2 107:143; product+1 mod p^2 274
- Pair (207, 243); residues mod25 7:18, mod p 3:5, mod p^2 207:243; product+1 mod p^2 16
- Pair (307, 343); residues mod25 7:18, mod p 1:3, mod p^2 18:54; product+1 mod p^2 106
- Pair (407, 443); residues mod25 7:18, mod p 16:1, mod p^2 118:154; product+1 mod p^2 255
- Pair (507, 543); residues mod25 7:18, mod p 14:16, mod p^2 218:254; product+1 mod p^2 174
- Pair (532, 568); residues mod25 7:18, mod p 5:7, mod p^2 243:279; product+1 mod p^2 172
- Pair (607, 643); residues mod25 7:18, mod p 12:14, mod p^2 29:65; product+1 mod p^2 152
- Pair (707, 668); residues mod25 7:18, mod p 10:5, mod p^2 129:90; product+1 mod p^2 51
- Pair (757, 793); residues mod25 7:18, mod p 9:11, mod p^2 179:215; product+1 mod p^2 49
- Pair (807, 743); residues mod25 7:18, mod p 8:12, mod p^2 229:165; product+1 mod p^2 216
- Pair (907, 843); residues mod25 7:18, mod p 6:10, mod p^2 40:265; product+1 mod p^2 197
- Pair (982, 943); residues mod25 7:18, mod p 13:8, mod p^2 115:76; product+1 mod p^2 71
- Pair (1007, 1043); residues mod25 7:18, mod p 4:6, mod p^2 140:176; product+1 mod p^2 76
- Pair (1032, 1018); residues mod25 7:18, mod p 12:15, mod p^2 165:151; product+1 mod p^2 62
- Pair (1082, 1143); residues mod25 7:18, mod p 11:4, mod p^2 215:276; product+1 mod p^2 96
- Pair (1107, 1243); residues mod25 7:18, mod p 2:2, mod p^2 240:87; product+1 mod p^2 73
- Pair (1207, 1343); residues mod25 7:18, mod p 0:0, mod p^2 51:187; product+1 mod p^2 1
- Pair (1307, 1443); residues mod25 7:18, mod p 15:15, mod p^2 151:287; product+1 mod p^2 277
- Pair (1407, 1468); residues mod25 7:18, mod p 13:6, mod p^2 251:23; product+1 mod p^2 283
- Pair (1432, 1543); residues mod25 7:18, mod p 4:13, mod p^2 276:98; product+1 mod p^2 172
- Pair (1507, 1643); residues mod25 7:18, mod p 11:11, mod p^2 62:198; product+1 mod p^2 139
- Pair (1607, 1743); residues mod25 7:18, mod p 9:9, mod p^2 162:9; product+1 mod p^2 14
- Pair (1657, 1693); residues mod25 7:18, mod p 8:10, mod p^2 212:248; product+1 mod p^2 268
- Pair (1682, 1768); residues mod25 7:18, mod p 16:0, mod p^2 237:34; product+1 mod p^2 256
- Pair (1707, 1843); residues mod25 7:18, mod p 7:7, mod p^2 262:109; product+1 mod p^2 237
- Pair (1807, 1918); residues mod25 7:18, mod p 5:14, mod p^2 73:184; product+1 mod p^2 139
- Pair (1882, 2043); residues mod25 7:18, mod p 12:3, mod p^2 148:20; product+1 mod p^2 71
- Pair (1907, 1943); residues mod25 7:18, mod p 3:5, mod p^2 173:209; product+1 mod p^2 33
- Pair (2007, 2143); residues mod25 7:18, mod p 1:1, mod p^2 273:120; product+1 mod p^2 104
- Pair (2107, 2243); residues mod25 7:18, mod p 16:16, mod p^2 84:220; product+1 mod p^2 274
- Pair (2207, 2343); residues mod25 7:18, mod p 14:14, mod p^2 184:31; product+1 mod p^2 214
- Pair (2307, 2443); residues mod25 7:18, mod p 12:12, mod p^2 284:131; product+1 mod p^2 213
- Pair (2332, 2368); residues mod25 7:18, mod p 3:5, mod p^2 20:56; product+1 mod p^2 254
- Pair (2407, 2543); residues mod25 7:18, mod p 10:10, mod p^2 95:231; product+1 mod p^2 271
- Pair (2507, 2643); residues mod25 7:18, mod p 8:8, mod p^2 195:42; product+1 mod p^2 99
- Pair (2557, 2593); residues mod25 7:18, mod p 7:9, mod p^2 245:281; product+1 mod p^2 64
- Pair (2607, 2743); residues mod25 7:18, mod p 6:6, mod p^2 6:142; product+1 mod p^2 275
- Pair (2707, 2818); residues mod25 7:18, mod p 4:13, mod p^2 106:217; product+1 mod p^2 172
- Pair (2782, 2943); residues mod25 7:18, mod p 11:2, mod p^2 181:53; product+1 mod p^2 57
- Pair (2807, 2843); residues mod25 7:18, mod p 2:4, mod p^2 206:242; product+1 mod p^2 145
- Pair (2907, 2968); residues mod25 7:18, mod p 0:10, mod p^2 17:78; product+1 mod p^2 171
- Pair (2932, 3043); residues mod25 7:18, mod p 8:0, mod p^2 42:153; product+1 mod p^2 69
- Pair (3007, 3143); residues mod25 7:18, mod p 15:15, mod p^2 117:253; product+1 mod p^2 124
- Pair (3107, 3243); residues mod25 7:18, mod p 13:13, mod p^2 217:64; product+1 mod p^2 17
- Pair (3207, 3268); residues mod25 7:18, mod p 11:4, mod p^2 28:89; product+1 mod p^2 181
- Pair (3232, 2993); residues mod25 7:18, mod p 2:1, mod p^2 53:103; product+1 mod p^2 258
- Pair (3307, 3343); residues mod25 7:18, mod p 9:11, mod p^2 128:164; product+1 mod p^2 185
- Pair (3407, 3443); residues mod25 7:18, mod p 7:9, mod p^2 228:264; product+1 mod p^2 81
- Pair (3457, 3093); residues mod25 7:18, mod p 6:16, mod p^2 278:203; product+1 mod p^2 80
- Pair (3507, 3543); residues mod25 7:18, mod p 5:7, mod p^2 39:75; product+1 mod p^2 36
- Pair (3532, 3293); residues mod25 7:18, mod p 13:12, mod p^2 64:114; product+1 mod p^2 72
- Pair (3607, 3643); residues mod25 7:18, mod p 3:5, mod p^2 139:175; product+1 mod p^2 50
- Pair (3682, 3493); residues mod25 7:18, mod p 10:8, mod p^2 214:25; product+1 mod p^2 149
- Pair (3707, 3743); residues mod25 7:18, mod p 1:3, mod p^2 239:275; product+1 mod p^2 123
- Pair (3807, 3718); residues mod25 7:18, mod p 16:12, mod p^2 50:250; product+1 mod p^2 74
- Pair (3907, 3843); residues mod25 7:18, mod p 14:1, mod p^2 150:86; product+1 mod p^2 185
- Pair (4007, 3943); residues mod25 7:18, mod p 12:16, mod p^2 250:186; product+1 mod p^2 261
- Pair (4057, 4168); residues mod25 7:18, mod p 11:3, mod p^2 11:122; product+1 mod p^2 187
- Pair (4107, 4043); residues mod25 7:18, mod p 10:14, mod p^2 61:286; product+1 mod p^2 107
- Pair (4132, 4143); residues mod25 7:18, mod p 1:12, mod p^2 86:97; product+1 mod p^2 251
- Pair (4207, 4218); residues mod25 7:18, mod p 8:2, mod p^2 161:172; product+1 mod p^2 238
- Pair (4307, 4243); residues mod25 7:18, mod p 6:10, mod p^2 261:197; product+1 mod p^2 265
- Pair (4357, 4393); residues mod25 7:18, mod p 5:7, mod p^2 22:58; product+1 mod p^2 121
- Pair (4407, 4343); residues mod25 7:18, mod p 4:8, mod p^2 72:8; product+1 mod p^2 288
- Pair (4507, 4443); residues mod25 7:18, mod p 2:6, mod p^2 172:108; product+1 mod p^2 81
- Pair (4582, 4543); residues mod25 7:18, mod p 9:4, mod p^2 247:208; product+1 mod p^2 224
- Pair (4607, 4643); residues mod25 7:18, mod p 0:2, mod p^2 272:19; product+1 mod p^2 256
- Pair (4707, 4618); residues mod25 7:18, mod p 15:11, mod p^2 83:283; product+1 mod p^2 81
- Pair (4757, 4893); residues mod25 7:18, mod p 14:14, mod p^2 133:269; product+1 mod p^2 231
- Pair (4807, 4843); residues mod25 7:18, mod p 13:15, mod p^2 183:219; product+1 mod p^2 196
- Pair (4907, 4743); residues mod25 7:18, mod p 11:0, mod p^2 283:119; product+1 mod p^2 154
- Pair (5007, 4943); residues mod25 7:18, mod p 9:13, mod p^2 94:30; product+1 mod p^2 220
- Pair (5032, 5043); residues mod25 7:18, mod p 0:11, mod p^2 119:130; product+1 mod p^2 154
- Pair (5107, 5068); residues mod25 7:18, mod p 7:2, mod p^2 194:155; product+1 mod p^2 15
- Pair (5207, 5143); residues mod25 7:18, mod p 5:9, mod p^2 5:230; product+1 mod p^2 284
- Pair (5257, 5518); residues mod25 7:18, mod p 4:10, mod p^2 55:27; product+1 mod p^2 41
- Pair (5307, 5243); residues mod25 7:18, mod p 3:7, mod p^2 105:41; product+1 mod p^2 260
- Pair (5407, 5343); residues mod25 7:18, mod p 1:5, mod p^2 205:141; product+1 mod p^2 6
- Pair (5482, 5293); residues mod25 7:18, mod p 8:6, mod p^2 280:91; product+1 mod p^2 49
- Pair (5507, 5443); residues mod25 7:18, mod p 16:3, mod p^2 16:241; product+1 mod p^2 100
- Pair (5607, 5543); residues mod25 7:18, mod p 14:1, mod p^2 116:52; product+1 mod p^2 253
- Pair (5657, 5693); residues mod25 7:18, mod p 13:15, mod p^2 166:202; product+1 mod p^2 9
- Pair (5707, 5643); residues mod25 7:18, mod p 12:16, mod p^2 216:152; product+1 mod p^2 176
- Pair (5807, 5743); residues mod25 7:18, mod p 10:14, mod p^2 27:252; product+1 mod p^2 158
- Pair (5907, 5818); residues mod25 7:18, mod p 8:4, mod p^2 127:38; product+1 mod p^2 203
- Pair (5932, 5843); residues mod25 7:18, mod p 16:12, mod p^2 152:63; product+1 mod p^2 40
- Pair (5982, 5943); residues mod25 7:18, mod p 15:10, mod p^2 202:163; product+1 mod p^2 270
- Pair (6007, 5968); residues mod25 7:18, mod p 6:1, mod p^2 227:188; product+1 mod p^2 194
- Pair (6107, 6043); residues mod25 7:18, mod p 4:8, mod p^2 38:263; product+1 mod p^2 169
- Pair (6157, 6193); residues mod25 7:18, mod p 3:5, mod p^2 88:124; product+1 mod p^2 220
- Pair (6207, 6143); residues mod25 7:18, mod p 2:6, mod p^2 138:74; product+1 mod p^2 98
- Pair (6307, 6243); residues mod25 7:18, mod p 0:4, mod p^2 238:174; product+1 mod p^2 86
- Pair (6382, 6343); residues mod25 7:18, mod p 7:2, mod p^2 24:274; product+1 mod p^2 219
- Pair (6407, 6443); residues mod25 7:18, mod p 15:0, mod p^2 49:85; product+1 mod p^2 120
- Pair (6507, 6418); residues mod25 7:18, mod p 13:9, mod p^2 149:60; product+1 mod p^2 271
- Pair (6607, 6543); residues mod25 7:18, mod p 11:15, mod p^2 249:185; product+1 mod p^2 115
- Pair (6707, 6618); residues mod25 7:18, mod p 9:5, mod p^2 60:260; product+1 mod p^2 284
- Pair (6807, 6643); residues mod25 7:18, mod p 7:13, mod p^2 160:285; product+1 mod p^2 228
- Pair (6832, 6743); residues mod25 7:18, mod p 15:11, mod p^2 185:96; product+1 mod p^2 132
- Pair (6907, 6668); residues mod25 7:18, mod p 5:4, mod p^2 260:21; product+1 mod p^2 259
- Pair (7007, 6843); residues mod25 7:18, mod p 3:9, mod p^2 71:196; product+1 mod p^2 45
- Pair (7057, 6868); residues mod25 7:18, mod p 2:0, mod p^2 121:221; product+1 mod p^2 154
- Pair (7082, 5993); residues mod25 7:18, mod p 10:9, mod p^2 146:213; product+1 mod p^2 176
- Pair (7107, 6943); residues mod25 7:18, mod p 1:7, mod p^2 171:7; product+1 mod p^2 42
- Pair (7207, 7143); residues mod25 7:18, mod p 16:3, mod p^2 271:207; product+1 mod p^2 32
- Pair (7282, 7043); residues mod25 7:18, mod p 6:5, mod p^2 57:107; product+1 mod p^2 31
- Pair (7307, 7243); residues mod25 7:18, mod p 14:1, mod p^2 82:18; product+1 mod p^2 32
