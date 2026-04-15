# D2.3_persist_outP2=99_out25=14_smaller=side7

This is a theorem-facing split atom packet for Problem 848. It is intentionally atomic: one split profile, one common matching core, one K-envelope, and deterministic sub-atoms for the next proof pass.

## Summary

- Packet id: `p848_split_atom_packet_D2_3_persist_outP2_99_out25_14_smaller_side7`
- Parent obligation: `D2_p13_matching_lower_bound`
- Target obligation: `D4_matching_bound_implies_sMaxMixed_bound`
- Prime lane: `13`
- Split key: `outP2=99|out25=14|smaller=side7`
- Priority: `highest_singleton_profile`
- Status: `ready_for_symbolic_persistence_work`
- Witnesses: `1` over `7343..7343`
- Common core size: `108`
- K-envelope: `[88,88]`, slack against max K `20`
- Vertex atoms: `216`
- Vertex atoms stable under current split modulus: `4`
- Vertex atoms needing sharper split or parameterization: `212`
- Edge atoms: `108`
- Edge certificate: `literal_edge_obstruction_certificate_verified`
- Edge congruence persistence: `literal_constant_edge_persistence_verified`
- Disjointness: `bounded_disjointness_certified`
- Matching/K certificate: `literal_matching_sampled_k_envelope_verified`

## Goal

Prove that the 108-edge common matching core persists for all p=13 threatening rows in split outP2=99|out25=14|smaller=side7, or replace it with a parameterized extension core.

## Falsifier Boundary

A row in this split loses one of the common-core missing-cross edges before a replacement edge is proved, or its K(N,x) exceeds the symbolic core size.

## Next Theorem Actions

- Promote the literal vertex-presence checks into residue-family vertex formulas if the vertices move with N.
- The current split modulus does not stabilize every vertex compatibility witness; either sharpen the split by the missing square-witness residues or replace literal vertices with parameterized families.
- Group edge obstruction atoms by residue pattern and product-plus-one squarefree check before attempting a symbolic persistence proof.
- Attack the packet until it either becomes a split lemma or emits a sharper sub-split key.

## K Envelope

- Status: `bounded_core_meets_sampled_K_envelope`
- Common core count: `108`
- Max required K: `88`
- Min matching slack: `20`

## Matching And K-Envelope Certificate

- Status: `literal_matching_sampled_k_envelope_verified`
- Proof kind: `literal_disjoint_matching_plus_sampled_k_envelope`
- Matching proof: `literal_matching_disjointness_verified`
- K proof: `sampled_k_envelope_dominated_by_literal_core`
- K inequality: `108 >= 88`
- Proof boundary: A6/A7 are certified for this literal packet. Split discharge still needs the vertex-successor proofs, edge persistence, and row-universe coverage to be assembled without bounded-only overclaim.

## Split Discharge Readiness

- Status: `split_discharge_readiness_candidate`
- Proof kind: `lower_atom_assembly_with_explicit_all_n_handoff`
- Theorem candidate: `candidate_with_open_all_n_handoff_gaps`
- Blocking lower checks: `0`
- Open all-N handoff gaps: `3`
- Proof boundary: This is readiness for a theorem-facing split lemma candidate, not a final all-N proof. The listed all-N handoff gaps must stay visible until discharged by the row-universe and symbolic K-formula lanes.
- Handoff gap `row_universe_split_coverage` [open]: Prove every future threatening row in the parent lane is covered by an emitted and discharged split profile.
- Handoff gap `universal_k_formula_lift` [open]: Replace the sampled packet K-envelope with the symbolic K(N,x) inequality used by the all-N D2/D3 lane.
- Handoff gap `literal_to_parameterized_vertex_guard` [open_if_vertices_move]: If later rows require moving vertex formulas instead of literal constants, re-run vertex, edge, and disjointness checks on the parameterized families.

## Vertex Presence Stability

- Split modulus: `4225`
- Witness rows: `1`
- Stable under current split modulus: `4`
- Needs sharper split or parametric witness: `212`
- First unstable vertex atom `D2.3_persist_outP2=99_out25=14_smaller=side7.V1.left_7`: side side7, value 7, first square witness {"divisor":2,"square":4,"quotient":3131,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.3_persist_outP2=99_out25=14_smaller=side7.V2.left_32`: side side7, value 32, first square witness {"divisor":3,"square":9,"quotient":6361,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.3_persist_outP2=99_out25=14_smaller=side7.V3.left_107`: side side7, value 107, first square witness {"divisor":2,"square":4,"quotient":47856,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.3_persist_outP2=99_out25=14_smaller=side7.V4.left_207`: side side7, value 207, first square witness {"divisor":2,"square":4,"quotient":92581,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.3_persist_outP2=99_out25=14_smaller=side7.V5.left_257`: side side7, value 257, first square witness {"divisor":3,"square":9,"quotient":51086,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.3_persist_outP2=99_out25=14_smaller=side7.V6.left_307`: side side7, value 307, first square witness {"divisor":2,"square":4,"quotient":137306,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.3_persist_outP2=99_out25=14_smaller=side7.V7.left_407`: side side7, value 407, first square witness {"divisor":2,"square":4,"quotient":182031,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.3_persist_outP2=99_out25=14_smaller=side7.V8.left_482`: side side7, value 482, first square witness {"divisor":3,"square":9,"quotient":95811,"stableUnderCurrentSplitModulus":false}

## Vertex Presence Refinement

- Status: `literal_core_requires_sharper_square_witness_split`
- Deterministic move: `emit_successor_atoms_by_square_witness_residue`
- Refinement condition count: `10`
- Covered unstable atoms: `212`
- Uncovered unstable atoms: `0`
- Proof boundary: These square-witness residue classes explain the bounded literal vertex-presence instability; each successor split still needs a theorem-facing persistence proof before it can support an all-N claim.
- Condition `square_4_outsider_1`: out mod 4 = 1, atoms=145, combined modulus=16900, successor=`outP2=99|out25=14|smaller=side7|out4=1`
- Condition `square_9_outsider_7`: out mod 9 = 7, atoms=49, combined modulus=38025, successor=`outP2=99|out25=14|smaller=side7|out9=7`
- Condition `square_49_outsider_25`: out mod 49 = 25, atoms=7, combined modulus=207025, successor=`outP2=99|out25=14|smaller=side7|out49=25`
- Condition `square_121_outsider_95`: out mod 121 = 95, atoms=3, combined modulus=511225, successor=`outP2=99|out25=14|smaller=side7|out121=95`
- Condition `square_289_outsider_55`: out mod 289 = 55, atoms=2, combined modulus=1221025, successor=`outP2=99|out25=14|smaller=side7|out289=55`
- Condition `square_529_outsider_202`: out mod 529 = 202, atoms=2, combined modulus=2235025, successor=`outP2=99|out25=14|smaller=side7|out529=202`
- Condition `square_361_outsider_345`: out mod 361 = 345, atoms=1, combined modulus=1525225, successor=`outP2=99|out25=14|smaller=side7|out361=345`
- Condition `square_961_outsider_828`: out mod 961 = 828, atoms=1, combined modulus=4060225, successor=`outP2=99|out25=14|smaller=side7|out961=828`
- Condition `square_1369_outsider_420`: out mod 1369 = 420, atoms=1, combined modulus=5784025, successor=`outP2=99|out25=14|smaller=side7|out1369=420`
- Condition `square_7921_outsider_1789`: out mod 7921 = 1789, atoms=1, combined modulus=33466225, successor=`outP2=99|out25=14|smaller=side7|out7921=1789`

## Edge Obstruction Certificate

- Status: `literal_edge_obstruction_certificate_verified`
- Proof kind: `literal_product_plus_one_squarefree_missing_edge_certificate`
- Edge atoms: `108`
- Squarefree edge atoms: `108`
- Non-squarefree edge atoms: `0`
- Product-plus-one range: `{"min":302,"max":52193902}`
- Mod 25 classes: `1`
- Prime-residue classes: `72`
- Prime-square fingerprints: `108`
- Proof boundary: This certifies only the exported literal edge-obstruction atoms for the current split packet. If a later proof replaces literal vertices with moving vertex families, this certificate must be lifted into a symbolic residue-family obstruction proof before it can support an all-N claim.
- Mod25 class `7:18`: edges=108
- Prime-residue class `10:7:6`: edges=3
- Prime-residue class `2:2:5`: edges=3
- Prime-residue class `3:9:2`: edges=3
- Prime-residue class `5:6:5`: edges=3
- Prime-residue class `6:3:6`: edges=3
- Prime-residue class `7:12:7`: edges=3
- Prime-residue class `8:1:9`: edges=3
- Prime-residue class `9:10:0`: edges=3
- Prime-residue class `0:10:1`: edges=2
- Prime-residue class `1:3:4`: edges=2
- Prime-residue class `1:7:8`: edges=2
- Prime-residue class `10:3:5`: edges=2
- Prime-residue class `11:12:3`: edges=2

## Edge Congruence Persistence

- Status: `literal_constant_edge_persistence_verified`
- Proof kind: `constant_pair_squarefree_invariant`
- Edge atoms: `108`
- Verified edge atoms: `108`
- Failed edge atoms: `0`
- Depends on sampled N: `no`
- Depends on witness outsider: `no`
- Proof boundary: This verifies A5 congruence persistence only for the exported literal matching core. It does not prove that future parameterized vertex families preserve the same squarefree edge obstructions.
- Family `D2.3_persist_outP2=99_out25=14_smaller=side7.edge_constant_squarefree_family`: status=`congruence_persistence_family_verified`, edges=108, proof=constant_pair_squarefree_invariant

## Matching Core

- Pair (7, 43); residues mod25 7:18, mod p 7:4, mod p^2 7:43; product+1 mod p^2 133
- Pair (32, 68); residues mod25 7:18, mod p 6:3, mod p^2 32:68; product+1 mod p^2 149
- Pair (107, 143); residues mod25 7:18, mod p 3:0, mod p^2 107:143; product+1 mod p^2 92
- Pair (207, 243); residues mod25 7:18, mod p 12:9, mod p^2 38:74; product+1 mod p^2 109
- Pair (257, 293); residues mod25 7:18, mod p 10:7, mod p^2 88:124; product+1 mod p^2 97
- Pair (307, 268); residues mod25 7:18, mod p 8:8, mod p^2 138:99; product+1 mod p^2 143
- Pair (407, 343); residues mod25 7:18, mod p 4:5, mod p^2 69:5; product+1 mod p^2 8
- Pair (482, 443); residues mod25 7:18, mod p 1:1, mod p^2 144:105; product+1 mod p^2 80
- Pair (507, 518); residues mod25 7:18, mod p 0:11, mod p^2 0:11; product+1 mod p^2 1
- Pair (607, 543); residues mod25 7:18, mod p 9:10, mod p^2 100:36; product+1 mod p^2 52
- Pair (707, 643); residues mod25 7:18, mod p 5:6, mod p^2 31:136; product+1 mod p^2 161
- Pair (782, 743); residues mod25 7:18, mod p 2:2, mod p^2 106:67; product+1 mod p^2 5
- Pair (807, 843); residues mod25 7:18, mod p 1:11, mod p^2 131:167; product+1 mod p^2 77
- Pair (907, 943); residues mod25 7:18, mod p 10:7, mod p^2 62:98; product+1 mod p^2 162
- Pair (932, 968); residues mod25 7:18, mod p 9:6, mod p^2 87:123; product+1 mod p^2 55
- Pair (982, 1143); residues mod25 7:18, mod p 7:12, mod p^2 137:129; product+1 mod p^2 98
- Pair (1007, 1043); residues mod25 7:18, mod p 6:3, mod p^2 162:29; product+1 mod p^2 136
- Pair (1107, 1243); residues mod25 7:18, mod p 2:8, mod p^2 93:60; product+1 mod p^2 4
- Pair (1157, 1193); residues mod25 7:18, mod p 0:10, mod p^2 143:10; product+1 mod p^2 79
- Pair (1207, 1343); residues mod25 7:18, mod p 11:4, mod p^2 24:160; product+1 mod p^2 123
- Pair (1282, 1418); residues mod25 7:18, mod p 8:1, mod p^2 99:66; product+1 mod p^2 113
- Pair (1307, 1443); residues mod25 7:18, mod p 7:0, mod p^2 124:91; product+1 mod p^2 131
- Pair (1382, 1468); residues mod25 7:18, mod p 4:12, mod p^2 30:116; product+1 mod p^2 101
- Pair (1407, 1543); residues mod25 7:18, mod p 3:9, mod p^2 55:22; product+1 mod p^2 28
- Pair (1507, 1643); residues mod25 7:18, mod p 12:5, mod p^2 155:122; product+1 mod p^2 152
- Pair (1532, 1743); residues mod25 7:18, mod p 11:1, mod p^2 11:53; product+1 mod p^2 77
- Pair (1607, 1868); residues mod25 7:18, mod p 8:9, mod p^2 86:9; product+1 mod p^2 99
- Pair (1707, 1843); residues mod25 7:18, mod p 4:10, mod p^2 17:153; product+1 mod p^2 67
- Pair (1807, 1943); residues mod25 7:18, mod p 0:6, mod p^2 117:84; product+1 mod p^2 27
- Pair (1832, 2043); residues mod25 7:18, mod p 12:2, mod p^2 142:15; product+1 mod p^2 103
- Pair (1907, 2243); residues mod25 7:18, mod p 9:7, mod p^2 48:46; product+1 mod p^2 12
- Pair (2007, 2143); residues mod25 7:18, mod p 5:11, mod p^2 148:115; product+1 mod p^2 121
- Pair (2057, 2093); residues mod25 7:18, mod p 3:0, mod p^2 29:65; product+1 mod p^2 27
- Pair (2107, 2318); residues mod25 7:18, mod p 1:4, mod p^2 79:121; product+1 mod p^2 96
- Pair (2207, 2343); residues mod25 7:18, mod p 10:3, mod p^2 10:146; product+1 mod p^2 109
- Pair (2282, 2443); residues mod25 7:18, mod p 7:12, mod p^2 85:77; product+1 mod p^2 124
- Pair (2307, 2543); residues mod25 7:18, mod p 6:8, mod p^2 110:8; product+1 mod p^2 36
- Pair (2407, 2643); residues mod25 7:18, mod p 2:4, mod p^2 41:108; product+1 mod p^2 35
- Pair (2507, 2768); residues mod25 7:18, mod p 11:12, mod p^2 141:64; product+1 mod p^2 68
- Pair (2607, 2743); residues mod25 7:18, mod p 7:0, mod p^2 72:39; product+1 mod p^2 105
- Pair (2707, 2843); residues mod25 7:18, mod p 3:9, mod p^2 3:139; product+1 mod p^2 80
- Pair (2732, 2693); residues mod25 7:18, mod p 2:2, mod p^2 28:158; product+1 mod p^2 31
- Pair (2807, 2918); residues mod25 7:18, mod p 12:6, mod p^2 103:45; product+1 mod p^2 73
- Pair (2907, 3043); residues mod25 7:18, mod p 8:1, mod p^2 34:1; product+1 mod p^2 35
- Pair (2957, 2993); residues mod25 7:18, mod p 6:3, mod p^2 84:120; product+1 mod p^2 110
- Pair (3007, 2943); residues mod25 7:18, mod p 4:5, mod p^2 134:70; product+1 mod p^2 86
- Pair (3107, 3143); residues mod25 7:18, mod p 0:10, mod p^2 65:101; product+1 mod p^2 144
- Pair (3182, 3243); residues mod25 7:18, mod p 10:6, mod p^2 140:32; product+1 mod p^2 87
- Pair (3207, 3218); residues mod25 7:18, mod p 9:7, mod p^2 165:7; product+1 mod p^2 142
- Pair (3232, 3343); residues mod25 7:18, mod p 8:2, mod p^2 21:132; product+1 mod p^2 69
- Pair (3307, 3443); residues mod25 7:18, mod p 5:11, mod p^2 96:63; product+1 mod p^2 134
- Pair (3407, 3543); residues mod25 7:18, mod p 1:7, mod p^2 27:163; product+1 mod p^2 8
- Pair (3507, 3643); residues mod25 7:18, mod p 10:3, mod p^2 127:94; product+1 mod p^2 109
- Pair (3607, 3743); residues mod25 7:18, mod p 6:12, mod p^2 58:25; product+1 mod p^2 99
- Pair (3632, 3668); residues mod25 7:18, mod p 5:2, mod p^2 83:119; product+1 mod p^2 76
- Pair (3707, 3768); residues mod25 7:18, mod p 2:11, mod p^2 158:50; product+1 mod p^2 127
- Pair (3807, 3843); residues mod25 7:18, mod p 11:8, mod p^2 89:125; product+1 mod p^2 141
- Pair (3857, 3893); residues mod25 7:18, mod p 9:6, mod p^2 139:6; product+1 mod p^2 159
- Pair (3907, 3918); residues mod25 7:18, mod p 7:5, mod p^2 20:31; product+1 mod p^2 114
- Pair (4007, 3943); residues mod25 7:18, mod p 3:4, mod p^2 120:56; product+1 mod p^2 130
- Pair (4082, 4043); residues mod25 7:18, mod p 0:0, mod p^2 26:156; product+1 mod p^2 1
- Pair (4107, 4068); residues mod25 7:18, mod p 12:12, mod p^2 51:12; product+1 mod p^2 106
- Pair (4207, 4118); residues mod25 7:18, mod p 8:10, mod p^2 151:62; product+1 mod p^2 68
- Pair (4307, 4143); residues mod25 7:18, mod p 4:9, mod p^2 82:87; product+1 mod p^2 37
- Pair (4407, 4243); residues mod25 7:18, mod p 0:5, mod p^2 13:18; product+1 mod p^2 66
- Pair (4457, 4568); residues mod25 7:18, mod p 11:5, mod p^2 63:5; product+1 mod p^2 147
- Pair (4507, 4443); residues mod25 7:18, mod p 9:10, mod p^2 113:49; product+1 mod p^2 130
- Pair (4532, 4343); residues mod25 7:18, mod p 8:1, mod p^2 138:118; product+1 mod p^2 61
- Pair (4607, 4543); residues mod25 7:18, mod p 5:6, mod p^2 44:149; product+1 mod p^2 135
- Pair (4707, 4618); residues mod25 7:18, mod p 1:3, mod p^2 144:55; product+1 mod p^2 147
- Pair (4757, 4493); residues mod25 7:18, mod p 12:8, mod p^2 25:99; product+1 mod p^2 110
- Pair (4807, 4843); residues mod25 7:18, mod p 10:7, mod p^2 75:111; product+1 mod p^2 45
- Pair (4907, 4643); residues mod25 7:18, mod p 6:2, mod p^2 6:80; product+1 mod p^2 143
- Pair (4982, 4743); residues mod25 7:18, mod p 3:11, mod p^2 81:11; product+1 mod p^2 47
- Pair (5007, 4943); residues mod25 7:18, mod p 2:3, mod p^2 106:42; product+1 mod p^2 59
- Pair (5107, 5018); residues mod25 7:18, mod p 11:0, mod p^2 37:117; product+1 mod p^2 105
- Pair (5207, 5043); residues mod25 7:18, mod p 7:12, mod p^2 137:142; product+1 mod p^2 20
- Pair (5307, 5143); residues mod25 7:18, mod p 3:8, mod p^2 68:73; product+1 mod p^2 64
- Pair (5407, 5343); residues mod25 7:18, mod p 12:0, mod p^2 168:104; product+1 mod p^2 66
- Pair (5432, 4793); residues mod25 7:18, mod p 11:9, mod p^2 24:61; product+1 mod p^2 113
- Pair (5507, 5243); residues mod25 7:18, mod p 8:4, mod p^2 99:4; product+1 mod p^2 59
- Pair (5607, 5443); residues mod25 7:18, mod p 4:9, mod p^2 30:35; product+1 mod p^2 37
- Pair (5657, 5468); residues mod25 7:18, mod p 2:8, mod p^2 80:60; product+1 mod p^2 69
- Pair (5682, 5543); residues mod25 7:18, mod p 1:5, mod p^2 105:135; product+1 mod p^2 149
- Pair (5707, 5643); residues mod25 7:18, mod p 0:1, mod p^2 130:66; product+1 mod p^2 131
- Pair (5807, 5743); residues mod25 7:18, mod p 9:10, mod p^2 61:166; product+1 mod p^2 156
- Pair (5882, 5693); residues mod25 7:18, mod p 6:12, mod p^2 136:116; product+1 mod p^2 60
- Pair (5907, 5843); residues mod25 7:18, mod p 5:6, mod p^2 161:97; product+1 mod p^2 70
- Pair (6007, 5918); residues mod25 7:18, mod p 1:3, mod p^2 92:3; product+1 mod p^2 108
- Pair (6107, 5943); residues mod25 7:18, mod p 10:2, mod p^2 23:28; product+1 mod p^2 138
- Pair (6207, 6043); residues mod25 7:18, mod p 6:11, mod p^2 123:128; product+1 mod p^2 28
- Pair (6307, 6243); residues mod25 7:18, mod p 2:3, mod p^2 54:159; product+1 mod p^2 137
- Pair (6332, 6143); residues mod25 7:18, mod p 1:7, mod p^2 79:59; product+1 mod p^2 99
- Pair (6407, 6343); residues mod25 7:18, mod p 11:12, mod p^2 154:90; product+1 mod p^2 3
- Pair (6507, 6368); residues mod25 7:18, mod p 7:11, mod p^2 85:115; product+1 mod p^2 143
- Pair (6557, 6293); residues mod25 7:18, mod p 5:1, mod p^2 135:40; product+1 mod p^2 162
- Pair (6607, 6418); residues mod25 7:18, mod p 3:9, mod p^2 16:165; product+1 mod p^2 106
- Pair (6707, 6443); residues mod25 7:18, mod p 12:8, mod p^2 116:21; product+1 mod p^2 71
- Pair (6782, 6543); residues mod25 7:18, mod p 9:4, mod p^2 22:121; product+1 mod p^2 128
- Pair (6807, 6643); residues mod25 7:18, mod p 8:0, mod p^2 47:52; product+1 mod p^2 79
- Pair (6907, 6668); residues mod25 7:18, mod p 4:12, mod p^2 147:77; product+1 mod p^2 166
- Pair (6957, 6593); residues mod25 7:18, mod p 2:2, mod p^2 28:2; product+1 mod p^2 57
- Pair (7007, 6743); residues mod25 7:18, mod p 0:9, mod p^2 78:152; product+1 mod p^2 27
- Pair (7032, 6818); residues mod25 7:18, mod p 12:6, mod p^2 103:58; product+1 mod p^2 60
- Pair (7107, 6843); residues mod25 7:18, mod p 9:5, mod p^2 9:83; product+1 mod p^2 72
- Pair (7207, 6943); residues mod25 7:18, mod p 5:1, mod p^2 109:14; product+1 mod p^2 6
- Pair (7232, 7043); residues mod25 7:18, mod p 4:10, mod p^2 134:114; product+1 mod p^2 67
- Pair (7307, 7143); residues mod25 7:18, mod p 1:6, mod p^2 40:45; product+1 mod p^2 111
