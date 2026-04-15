# D2.1_persist_outP2=70_out25=9_smaller=side7

This is a theorem-facing split atom packet for Problem 848. It is intentionally atomic: one split profile, one common matching core, one K-envelope, and deterministic sub-atoms for the next proof pass.

## Summary

- Packet id: `p848_split_atom_packet_D2_1_persist_outP2_70_out25_9_smaller_side7`
- Parent obligation: `D2_p13_matching_lower_bound`
- Target obligation: `D4_matching_bound_implies_sMaxMixed_bound`
- Prime lane: `13`
- Split key: `outP2=70|out25=9|smaller=side7`
- Priority: `high_p13_active_lane`
- Status: `ready_for_symbolic_persistence_work`
- Witnesses: `6` over `7318..7368`
- Common core size: `108`
- K-envelope: `[88,89]`, slack against max K `19`
- Vertex atoms: `216`
- Vertex atoms stable under current split modulus: `3`
- Vertex atoms needing sharper split or parameterization: `213`
- Edge atoms: `108`
- Edge certificate: `literal_edge_obstruction_certificate_verified`
- Edge congruence persistence: `literal_constant_edge_persistence_verified`
- Disjointness: `bounded_disjointness_certified`
- Matching/K certificate: `literal_matching_sampled_k_envelope_verified`

## Goal

Prove that the 108-edge common matching core persists for all p=13 threatening rows in split outP2=70|out25=9|smaller=side7, or replace it with a parameterized extension core.

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
- Max required K: `89`
- Min matching slack: `19`

## Matching And K-Envelope Certificate

- Status: `literal_matching_sampled_k_envelope_verified`
- Proof kind: `literal_disjoint_matching_plus_sampled_k_envelope`
- Matching proof: `literal_matching_disjointness_verified`
- K proof: `sampled_k_envelope_dominated_by_literal_core`
- K inequality: `108 >= 89`
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
- Witness rows: `6`
- Stable under current split modulus: `3`
- Needs sharper split or parametric witness: `213`
- First unstable vertex atom `D2.1_persist_outP2=70_out25=9_smaller=side7.V1.left_7`: side side7, value 7, first square witness {"divisor":2,"square":4,"quotient":9291,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.1_persist_outP2=70_out25=9_smaller=side7.V2.left_82`: side side7, value 82, first square witness {"divisor":3,"square":9,"quotient":48371,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.1_persist_outP2=70_out25=9_smaller=side7.V3.left_107`: side side7, value 107, first square witness {"divisor":2,"square":4,"quotient":142016,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.1_persist_outP2=70_out25=9_smaller=side7.V4.left_207`: side side7, value 207, first square witness {"divisor":2,"square":4,"quotient":274741,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.1_persist_outP2=70_out25=9_smaller=side7.V5.left_307`: side side7, value 307, first square witness {"divisor":2,"square":4,"quotient":407466,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.1_persist_outP2=70_out25=9_smaller=side7.V6.left_407`: side side7, value 407, first square witness {"divisor":2,"square":4,"quotient":540191,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.1_persist_outP2=70_out25=9_smaller=side7.V7.left_507`: side side7, value 507, first square witness {"divisor":2,"square":4,"quotient":672916,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.1_persist_outP2=70_out25=9_smaller=side7.V8.left_532`: side side7, value 532, first square witness {"divisor":3,"square":9,"quotient":313821,"stableUnderCurrentSplitModulus":false}

## Vertex Presence Refinement

- Status: `literal_core_requires_sharper_square_witness_split`
- Deterministic move: `emit_successor_atoms_by_square_witness_residue`
- Refinement condition count: `11`
- Covered unstable atoms: `213`
- Uncovered unstable atoms: `0`
- Proof boundary: These square-witness residue classes explain the bounded literal vertex-presence instability; each successor split still needs a theorem-facing persistence proof before it can support an all-N claim.
- Condition `square_4_outsider_1`: out mod 4 = 1, atoms=145, combined modulus=16900, successor=`outP2=70|out25=9|smaller=side7|out4=1`
- Condition `square_9_outsider_8`: out mod 9 = 8, atoms=48, combined modulus=38025, successor=`outP2=70|out25=9|smaller=side7|out9=8`
- Condition `square_49_outsider_17`: out mod 49 = 17, atoms=9, combined modulus=207025, successor=`outP2=70|out25=9|smaller=side7|out49=17`
- Condition `square_121_outsider_106`: out mod 121 = 106, atoms=3, combined modulus=511225, successor=`outP2=70|out25=9|smaller=side7|out121=106`
- Condition `square_361_outsider_255`: out mod 361 = 255, atoms=2, combined modulus=1525225, successor=`outP2=70|out25=9|smaller=side7|out361=255`
- Condition `square_529_outsider_19`: out mod 529 = 19, atoms=1, combined modulus=2235025, successor=`outP2=70|out25=9|smaller=side7|out529=19`
- Condition `square_841_outsider_263`: out mod 841 = 263, atoms=1, combined modulus=3553225, successor=`outP2=70|out25=9|smaller=side7|out841=263`
- Condition `square_961_outsider_504`: out mod 961 = 504, atoms=1, combined modulus=4060225, successor=`outP2=70|out25=9|smaller=side7|out961=504`
- Condition `square_1681_outsider_266`: out mod 1681 = 266, atoms=1, combined modulus=7102225, successor=`outP2=70|out25=9|smaller=side7|out1681=266`
- Condition `square_2809_outsider_2500`: out mod 2809 = 2500, atoms=1, combined modulus=11868025, successor=`outP2=70|out25=9|smaller=side7|out2809=2500`
- Condition `square_11881_outsider_5309`: out mod 11881 = 5309, atoms=1, combined modulus=50197225, successor=`outP2=70|out25=9|smaller=side7|out11881=5309`

## Edge Obstruction Certificate

- Status: `literal_edge_obstruction_certificate_verified`
- Proof kind: `literal_product_plus_one_squarefree_missing_edge_certificate`
- Edge atoms: `108`
- Squarefree edge atoms: `108`
- Non-squarefree edge atoms: `0`
- Product-plus-one range: `{"min":302,"max":52376577}`
- Mod 25 classes: `1`
- Prime-residue classes: `82`
- Prime-square fingerprints: `108`
- Proof boundary: This certifies only the exported literal edge-obstruction atoms for the current split packet. If a later proof replaces literal vertices with moving vertex families, this certificate must be lifted into a symbolic residue-family obstruction proof before it can support an all-N claim.
- Mod25 class `7:18`: edges=108
- Prime-residue class `4:0:1`: edges=3
- Prime-residue class `5:6:5`: edges=3
- Prime-residue class `7:3:9`: edges=3
- Prime-residue class `0:9:1`: edges=2
- Prime-residue class `10:7:6`: edges=2
- Prime-residue class `11:12:3`: edges=2
- Prime-residue class `11:4:6`: edges=2
- Prime-residue class `11:7:0`: edges=2
- Prime-residue class `12:5:9`: edges=2
- Prime-residue class `2:11:10`: edges=2
- Prime-residue class `2:3:7`: edges=2
- Prime-residue class `2:8:4`: edges=2
- Prime-residue class `3:0:1`: edges=2

## Edge Congruence Persistence

- Status: `literal_constant_edge_persistence_verified`
- Proof kind: `constant_pair_squarefree_invariant`
- Edge atoms: `108`
- Verified edge atoms: `108`
- Failed edge atoms: `0`
- Depends on sampled N: `no`
- Depends on witness outsider: `no`
- Proof boundary: This verifies A5 congruence persistence only for the exported literal matching core. It does not prove that future parameterized vertex families preserve the same squarefree edge obstructions.
- Family `D2.1_persist_outP2=70_out25=9_smaller=side7.edge_constant_squarefree_family`: status=`congruence_persistence_family_verified`, edges=108, proof=constant_pair_squarefree_invariant

## Matching Core

- Pair (7, 43); residues mod25 7:18, mod p 7:4, mod p^2 7:43; product+1 mod p^2 133
- Pair (82, 118); residues mod25 7:18, mod p 4:1, mod p^2 82:118; product+1 mod p^2 44
- Pair (107, 143); residues mod25 7:18, mod p 3:0, mod p^2 107:143; product+1 mod p^2 92
- Pair (207, 243); residues mod25 7:18, mod p 12:9, mod p^2 38:74; product+1 mod p^2 109
- Pair (307, 268); residues mod25 7:18, mod p 8:8, mod p^2 138:99; product+1 mod p^2 143
- Pair (407, 343); residues mod25 7:18, mod p 4:5, mod p^2 69:5; product+1 mod p^2 8
- Pair (507, 368); residues mod25 7:18, mod p 0:4, mod p^2 0:30; product+1 mod p^2 1
- Pair (532, 443); residues mod25 7:18, mod p 12:1, mod p^2 25:105; product+1 mod p^2 91
- Pair (607, 543); residues mod25 7:18, mod p 9:10, mod p^2 100:36; product+1 mod p^2 52
- Pair (707, 568); residues mod25 7:18, mod p 5:9, mod p^2 31:61; product+1 mod p^2 33
- Pair (757, 718); residues mod25 7:18, mod p 3:3, mod p^2 81:42; product+1 mod p^2 23
- Pair (807, 643); residues mod25 7:18, mod p 1:6, mod p^2 131:136; product+1 mod p^2 72
- Pair (907, 843); residues mod25 7:18, mod p 10:11, mod p^2 62:167; product+1 mod p^2 46
- Pair (957, 793); residues mod25 7:18, mod p 8:0, mod p^2 112:117; product+1 mod p^2 92
- Pair (982, 743); residues mod25 7:18, mod p 7:2, mod p^2 137:67; product+1 mod p^2 54
- Pair (1007, 943); residues mod25 7:18, mod p 6:7, mod p^2 162:98; product+1 mod p^2 160
- Pair (1107, 1018); residues mod25 7:18, mod p 2:4, mod p^2 93:4; product+1 mod p^2 35
- Pair (1207, 1068); residues mod25 7:18, mod p 11:2, mod p^2 24:54; product+1 mod p^2 114
- Pair (1307, 1043); residues mod25 7:18, mod p 7:3, mod p^2 124:29; product+1 mod p^2 48
- Pair (1407, 1143); residues mod25 7:18, mod p 3:12, mod p^2 55:129; product+1 mod p^2 167
- Pair (1432, 1243); residues mod25 7:18, mod p 2:8, mod p^2 80:60; product+1 mod p^2 69
- Pair (1507, 1318); residues mod25 7:18, mod p 12:5, mod p^2 155:135; product+1 mod p^2 139
- Pair (1607, 1343); residues mod25 7:18, mod p 8:4, mod p^2 86:160; product+1 mod p^2 72
- Pair (1657, 1468); residues mod25 7:18, mod p 6:12, mod p^2 136:116; product+1 mod p^2 60
- Pair (1707, 1443); residues mod25 7:18, mod p 4:0, mod p^2 17:91; product+1 mod p^2 27
- Pair (1807, 1543); residues mod25 7:18, mod p 0:9, mod p^2 117:22; product+1 mod p^2 40
- Pair (1882, 1618); residues mod25 7:18, mod p 10:6, mod p^2 23:97; product+1 mod p^2 35
- Pair (1907, 1643); residues mod25 7:18, mod p 9:5, mod p^2 48:122; product+1 mod p^2 111
- Pair (1957, 1493); residues mod25 7:18, mod p 7:11, mod p^2 98:141; product+1 mod p^2 130
- Pair (2007, 1743); residues mod25 7:18, mod p 5:1, mod p^2 148:53; product+1 mod p^2 71
- Pair (2032, 1693); residues mod25 7:18, mod p 4:3, mod p^2 4:3; product+1 mod p^2 13
- Pair (2107, 1843); residues mod25 7:18, mod p 1:10, mod p^2 79:153; product+1 mod p^2 89
- Pair (2207, 1918); residues mod25 7:18, mod p 10:7, mod p^2 10:59; product+1 mod p^2 84
- Pair (2307, 1943); residues mod25 7:18, mod p 6:6, mod p^2 110:84; product+1 mod p^2 115
- Pair (2332, 2043); residues mod25 7:18, mod p 5:2, mod p^2 135:15; product+1 mod p^2 167
- Pair (2407, 2143); residues mod25 7:18, mod p 2:11, mod p^2 41:115; product+1 mod p^2 153
- Pair (2507, 2243); residues mod25 7:18, mod p 11:7, mod p^2 141:46; product+1 mod p^2 65
- Pair (2557, 2368); residues mod25 7:18, mod p 9:2, mod p^2 22:2; product+1 mod p^2 45
- Pair (2607, 2343); residues mod25 7:18, mod p 7:3, mod p^2 72:146; product+1 mod p^2 35
- Pair (2707, 2443); residues mod25 7:18, mod p 3:12, mod p^2 3:77; product+1 mod p^2 63
- Pair (2782, 2543); residues mod25 7:18, mod p 0:8, mod p^2 78:8; product+1 mod p^2 118
- Pair (2807, 2643); residues mod25 7:18, mod p 12:4, mod p^2 103:108; product+1 mod p^2 140
- Pair (2907, 2718); residues mod25 7:18, mod p 8:1, mod p^2 34:14; product+1 mod p^2 139
- Pair (3007, 2743); residues mod25 7:18, mod p 4:0, mod p^2 134:39; product+1 mod p^2 157
- Pair (3107, 2818); residues mod25 7:18, mod p 0:10, mod p^2 65:114; product+1 mod p^2 144
- Pair (3207, 2843); residues mod25 7:18, mod p 9:9, mod p^2 165:139; product+1 mod p^2 121
- Pair (3232, 2593); residues mod25 7:18, mod p 8:6, mod p^2 21:58; product+1 mod p^2 36
- Pair (3257, 5168); residues mod25 7:18, mod p 7:7, mod p^2 46:98; product+1 mod p^2 115
- Pair (3307, 2943); residues mod25 7:18, mod p 5:5, mod p^2 96:70; product+1 mod p^2 130
- Pair (3407, 3043); residues mod25 7:18, mod p 1:1, mod p^2 27:1; product+1 mod p^2 28
- Pair (3457, 3268); residues mod25 7:18, mod p 12:5, mod p^2 77:57; product+1 mod p^2 165
- Pair (3507, 3143); residues mod25 7:18, mod p 10:10, mod p^2 127:101; product+1 mod p^2 153
- Pair (3607, 3243); residues mod25 7:18, mod p 6:6, mod p^2 58:32; product+1 mod p^2 167
- Pair (3682, 3343); residues mod25 7:18, mod p 3:2, mod p^2 133:132; product+1 mod p^2 150
- Pair (3707, 3443); residues mod25 7:18, mod p 2:11, mod p^2 158:63; product+1 mod p^2 153
- Pair (3807, 3543); residues mod25 7:18, mod p 11:7, mod p^2 89:163; product+1 mod p^2 143
- Pair (3907, 3643); residues mod25 7:18, mod p 7:3, mod p^2 20:94; product+1 mod p^2 22
- Pair (3957, 3493); residues mod25 7:18, mod p 5:9, mod p^2 70:113; product+1 mod p^2 137
- Pair (4007, 3718); residues mod25 7:18, mod p 3:0, mod p^2 120:0; product+1 mod p^2 1
- Pair (4107, 3743); residues mod25 7:18, mod p 12:12, mod p^2 51:25; product+1 mod p^2 93
- Pair (4132, 3943); residues mod25 7:18, mod p 11:4, mod p^2 76:56; product+1 mod p^2 32
- Pair (4207, 3843); residues mod25 7:18, mod p 8:8, mod p^2 151:125; product+1 mod p^2 117
- Pair (4307, 4043); residues mod25 7:18, mod p 4:0, mod p^2 82:156; product+1 mod p^2 118
- Pair (4357, 4168); residues mod25 7:18, mod p 2:8, mod p^2 132:112; product+1 mod p^2 82
- Pair (4407, 4143); residues mod25 7:18, mod p 0:9, mod p^2 13:87; product+1 mod p^2 118
- Pair (4482, 4243); residues mod25 7:18, mod p 10:5, mod p^2 88:18; product+1 mod p^2 64
- Pair (4507, 4443); residues mod25 7:18, mod p 9:10, mod p^2 113:49; product+1 mod p^2 130
- Pair (4582, 4343); residues mod25 7:18, mod p 6:1, mod p^2 19:118; product+1 mod p^2 46
- Pair (4607, 4543); residues mod25 7:18, mod p 5:6, mod p^2 44:149; product+1 mod p^2 135
- Pair (4707, 4618); residues mod25 7:18, mod p 1:3, mod p^2 144:55; product+1 mod p^2 147
- Pair (4807, 4843); residues mod25 7:18, mod p 10:7, mod p^2 75:111; product+1 mod p^2 45
- Pair (4832, 4643); residues mod25 7:18, mod p 9:2, mod p^2 100:80; product+1 mod p^2 58
- Pair (4907, 4743); residues mod25 7:18, mod p 6:11, mod p^2 6:11; product+1 mod p^2 67
- Pair (5007, 4943); residues mod25 7:18, mod p 2:3, mod p^2 106:42; product+1 mod p^2 59
- Pair (5032, 4393); residues mod25 7:18, mod p 1:12, mod p^2 131:168; product+1 mod p^2 39
- Pair (5107, 5043); residues mod25 7:18, mod p 11:12, mod p^2 37:142; product+1 mod p^2 16
- Pair (5207, 5068); residues mod25 7:18, mod p 7:11, mod p^2 137:167; product+1 mod p^2 65
- Pair (5257, 5518); residues mod25 7:18, mod p 5:6, mod p^2 18:110; product+1 mod p^2 122
- Pair (5307, 5143); residues mod25 7:18, mod p 3:8, mod p^2 68:73; product+1 mod p^2 64
- Pair (5407, 5343); residues mod25 7:18, mod p 12:0, mod p^2 168:104; product+1 mod p^2 66
- Pair (5457, 5293); residues mod25 7:18, mod p 10:2, mod p^2 49:54; product+1 mod p^2 112
- Pair (5482, 5243); residues mod25 7:18, mod p 9:4, mod p^2 74:4; product+1 mod p^2 128
- Pair (5507, 5443); residues mod25 7:18, mod p 8:9, mod p^2 99:35; product+1 mod p^2 86
- Pair (5607, 5543); residues mod25 7:18, mod p 4:5, mod p^2 30:135; product+1 mod p^2 164
- Pair (5707, 5643); residues mod25 7:18, mod p 0:1, mod p^2 130:66; product+1 mod p^2 131
- Pair (5807, 5718); residues mod25 7:18, mod p 9:11, mod p^2 61:141; product+1 mod p^2 152
- Pair (5907, 5743); residues mod25 7:18, mod p 5:10, mod p^2 161:166; product+1 mod p^2 25
- Pair (5932, 5843); residues mod25 7:18, mod p 4:6, mod p^2 17:97; product+1 mod p^2 129
- Pair (6007, 5943); residues mod25 7:18, mod p 1:2, mod p^2 92:28; product+1 mod p^2 42
- Pair (6107, 5968); residues mod25 7:18, mod p 10:1, mod p^2 23:53; product+1 mod p^2 37
- Pair (6157, 6193); residues mod25 7:18, mod p 8:5, mod p^2 73:109; product+1 mod p^2 15
- Pair (6207, 6043); residues mod25 7:18, mod p 6:11, mod p^2 123:128; product+1 mod p^2 28
- Pair (6307, 6243); residues mod25 7:18, mod p 2:3, mod p^2 54:159; product+1 mod p^2 137
- Pair (6382, 6143); residues mod25 7:18, mod p 12:7, mod p^2 129:59; product+1 mod p^2 7
- Pair (6407, 6343); residues mod25 7:18, mod p 11:12, mod p^2 154:90; product+1 mod p^2 3
- Pair (6507, 6418); residues mod25 7:18, mod p 7:9, mod p^2 85:165; product+1 mod p^2 168
- Pair (6607, 6543); residues mod25 7:18, mod p 3:4, mod p^2 16:121; product+1 mod p^2 78
- Pair (6707, 6443); residues mod25 7:18, mod p 12:8, mod p^2 116:21; product+1 mod p^2 71
- Pair (6807, 6643); residues mod25 7:18, mod p 8:0, mod p^2 47:52; product+1 mod p^2 79
- Pair (6832, 6393); residues mod25 7:18, mod p 7:10, mod p^2 72:140; product+1 mod p^2 110
- Pair (6907, 6768); residues mod25 7:18, mod p 4:8, mod p^2 147:8; product+1 mod p^2 163
- Pair (6932, 6743); residues mod25 7:18, mod p 3:9, mod p^2 3:152; product+1 mod p^2 119
- Pair (7007, 6843); residues mod25 7:18, mod p 0:5, mod p^2 78:83; product+1 mod p^2 53
- Pair (7057, 6868); residues mod25 7:18, mod p 11:4, mod p^2 128:108; product+1 mod p^2 136
- Pair (7107, 6943); residues mod25 7:18, mod p 9:1, mod p^2 9:14; product+1 mod p^2 127
- Pair (7207, 7143); residues mod25 7:18, mod p 5:6, mod p^2 109:45; product+1 mod p^2 5
- Pair (7282, 7043); residues mod25 7:18, mod p 2:10, mod p^2 15:114; product+1 mod p^2 21
- Pair (7307, 7168); residues mod25 7:18, mod p 1:5, mod p^2 40:70; product+1 mod p^2 97
