# D2.2_persist_outP2=99_out25=6_smaller=side18

This is a theorem-facing split atom packet for Problem 848. It is intentionally atomic: one split profile, one common matching core, one K-envelope, and deterministic sub-atoms for the next proof pass.

## Summary

- Packet id: `p848_split_atom_packet_D2_2_persist_outP2_99_out25_6_smaller_side18`
- Parent obligation: `D2_p13_matching_lower_bound`
- Target obligation: `D4_matching_bound_implies_sMaxMixed_bound`
- Prime lane: `13`
- Split key: `outP2=99|out25=6|smaller=side18`
- Priority: `high_p13_active_lane`
- Status: `ready_for_symbolic_persistence_work`
- Witnesses: `5` over `7307..7357`
- Common core size: `105`
- K-envelope: `[85,85]`, slack against max K `20`
- Vertex atoms: `210`
- Vertex atoms stable under current split modulus: `4`
- Vertex atoms needing sharper split or parameterization: `206`
- Edge atoms: `105`
- Edge certificate: `literal_edge_obstruction_certificate_verified`
- Edge congruence persistence: `literal_constant_edge_persistence_verified`
- Disjointness: `bounded_disjointness_certified`
- Matching/K certificate: `literal_matching_sampled_k_envelope_verified`

## Goal

Prove that the 105-edge common matching core persists for all p=13 threatening rows in split outP2=99|out25=6|smaller=side18, or replace it with a parameterized extension core.

## Falsifier Boundary

A row in this split loses one of the common-core missing-cross edges before a replacement edge is proved, or its K(N,x) exceeds the symbolic core size.

## Next Theorem Actions

- Promote the literal vertex-presence checks into residue-family vertex formulas if the vertices move with N.
- The current split modulus does not stabilize every vertex compatibility witness; either sharpen the split by the missing square-witness residues or replace literal vertices with parameterized families.
- Group edge obstruction atoms by residue pattern and product-plus-one squarefree check before attempting a symbolic persistence proof.
- Attack the packet until it either becomes a split lemma or emits a sharper sub-split key.

## K Envelope

- Status: `bounded_core_meets_sampled_K_envelope`
- Common core count: `105`
- Max required K: `85`
- Min matching slack: `20`

## Matching And K-Envelope Certificate

- Status: `literal_matching_sampled_k_envelope_verified`
- Proof kind: `literal_disjoint_matching_plus_sampled_k_envelope`
- Matching proof: `literal_matching_disjointness_verified`
- K proof: `sampled_k_envelope_dominated_by_literal_core`
- K inequality: `105 >= 85`
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
- Witness rows: `5`
- Stable under current split modulus: `4`
- Needs sharper split or parametric witness: `206`
- First unstable vertex atom `D2.2_persist_outP2=99_out25=6_smaller=side18.V1.left_32`: side side7, value 32, first square witness {"divisor":3,"square":9,"quotient":17177,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.2_persist_outP2=99_out25=6_smaller=side18.V2.left_57`: side side7, value 57, first square witness {"divisor":2,"square":4,"quotient":68842,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.2_persist_outP2=99_out25=6_smaller=side18.V3.left_157`: side side7, value 157, first square witness {"divisor":2,"square":4,"quotient":189617,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.2_persist_outP2=99_out25=6_smaller=side18.V4.left_257`: side side7, value 257, first square witness {"divisor":2,"square":4,"quotient":310392,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.2_persist_outP2=99_out25=6_smaller=side18.V5.left_357`: side side7, value 357, first square witness {"divisor":2,"square":4,"quotient":431167,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.2_persist_outP2=99_out25=6_smaller=side18.V6.left_457`: side side7, value 457, first square witness {"divisor":2,"square":4,"quotient":551942,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.2_persist_outP2=99_out25=6_smaller=side18.V7.left_482`: side side7, value 482, first square witness {"divisor":3,"square":9,"quotient":258727,"stableUnderCurrentSplitModulus":false}
- First unstable vertex atom `D2.2_persist_outP2=99_out25=6_smaller=side18.V8.left_557`: side side7, value 557, first square witness {"divisor":2,"square":4,"quotient":672717,"stableUnderCurrentSplitModulus":false}

## Vertex Presence Refinement

- Status: `literal_core_requires_sharper_square_witness_split`
- Deterministic move: `emit_successor_atoms_by_square_witness_residue`
- Refinement condition count: `8`
- Covered unstable atoms: `206`
- Uncovered unstable atoms: `0`
- Proof boundary: These square-witness residue classes explain the bounded literal vertex-presence instability; each successor split still needs a theorem-facing persistence proof before it can support an all-N claim.
- Condition `square_4_outsider_3`: out mod 4 = 3, atoms=142, combined modulus=16900, successor=`outP2=99|out25=6|smaller=side18|out4=3`
- Condition `square_9_outsider_7`: out mod 9 = 7, atoms=48, combined modulus=38025, successor=`outP2=99|out25=6|smaller=side18|out9=7`
- Condition `square_49_outsider_29`: out mod 49 = 29, atoms=8, combined modulus=207025, successor=`outP2=99|out25=6|smaller=side18|out49=29`
- Condition `square_121_outsider_112`: out mod 121 = 112, atoms=3, combined modulus=511225, successor=`outP2=99|out25=6|smaller=side18|out121=112`
- Condition `square_961_outsider_26`: out mod 961 = 26, atoms=2, combined modulus=4060225, successor=`outP2=99|out25=6|smaller=side18|out961=26`
- Condition `square_289_outsider_207`: out mod 289 = 207, atoms=1, combined modulus=1221025, successor=`outP2=99|out25=6|smaller=side18|out289=207`
- Condition `square_361_outsider_138`: out mod 361 = 138, atoms=1, combined modulus=1525225, successor=`outP2=99|out25=6|smaller=side18|out361=138`
- Condition `square_1849_outsider_1133`: out mod 1849 = 1133, atoms=1, combined modulus=7812025, successor=`outP2=99|out25=6|smaller=side18|out1849=1133`

## Edge Obstruction Certificate

- Status: `literal_edge_obstruction_certificate_verified`
- Proof kind: `literal_product_plus_one_squarefree_missing_edge_certificate`
- Edge atoms: `105`
- Squarefree edge atoms: `105`
- Non-squarefree edge atoms: `0`
- Product-plus-one range: `{"min":2177,"max":50737402}`
- Mod 25 classes: `1`
- Prime-residue classes: `75`
- Prime-square fingerprints: `105`
- Proof boundary: This certifies only the exported literal edge-obstruction atoms for the current split packet. If a later proof replaces literal vertices with moving vertex families, this certificate must be lifted into a symbolic residue-family obstruction proof before it can support an all-N claim.
- Mod25 class `7:18`: edges=105
- Prime-residue class `0:6:1`: edges=3
- Prime-residue class `12:5:9`: edges=3
- Prime-residue class `2:8:4`: edges=3
- Prime-residue class `5:11:4`: edges=3
- Prime-residue class `6:12:8`: edges=3
- Prime-residue class `9:2:6`: edges=3
- Prime-residue class `1:11:12`: edges=2
- Prime-residue class `1:8:9`: edges=2
- Prime-residue class `10:3:5`: edges=2
- Prime-residue class `10:4:2`: edges=2
- Prime-residue class `10:7:6`: edges=2
- Prime-residue class `11:12:3`: edges=2
- Prime-residue class `2:3:7`: edges=2

## Edge Congruence Persistence

- Status: `literal_constant_edge_persistence_verified`
- Proof kind: `constant_pair_squarefree_invariant`
- Edge atoms: `105`
- Verified edge atoms: `105`
- Failed edge atoms: `0`
- Depends on sampled N: `no`
- Depends on witness outsider: `no`
- Proof boundary: This verifies A5 congruence persistence only for the exported literal matching core. It does not prove that future parameterized vertex families preserve the same squarefree edge obstructions.
- Family `D2.2_persist_outP2=99_out25=6_smaller=side18.edge_constant_squarefree_family`: status=`congruence_persistence_family_verified`, edges=105, proof=constant_pair_squarefree_invariant

## Matching Core

- Pair (32, 68); residues mod25 7:18, mod p 6:3, mod p^2 32:68; product+1 mod p^2 149
- Pair (57, 93); residues mod25 7:18, mod p 5:2, mod p^2 57:93; product+1 mod p^2 63
- Pair (157, 193); residues mod25 7:18, mod p 1:11, mod p^2 157:24; product+1 mod p^2 51
- Pair (257, 293); residues mod25 7:18, mod p 10:7, mod p^2 88:124; product+1 mod p^2 97
- Pair (357, 268); residues mod25 7:18, mod p 6:8, mod p^2 19:99; product+1 mod p^2 23
- Pair (457, 393); residues mod25 7:18, mod p 2:3, mod p^2 119:55; product+1 mod p^2 124
- Pair (482, 468); residues mod25 7:18, mod p 1:0, mod p^2 144:130; product+1 mod p^2 131
- Pair (557, 493); residues mod25 7:18, mod p 11:12, mod p^2 50:155; product+1 mod p^2 146
- Pair (632, 518); residues mod25 7:18, mod p 8:11, mod p^2 125:11; product+1 mod p^2 24
- Pair (657, 593); residues mod25 7:18, mod p 7:8, mod p^2 150:86; product+1 mod p^2 57
- Pair (707, 743); residues mod25 7:18, mod p 5:2, mod p^2 31:67; product+1 mod p^2 50
- Pair (757, 693); residues mod25 7:18, mod p 3:4, mod p^2 81:17; product+1 mod p^2 26
- Pair (857, 793); residues mod25 7:18, mod p 12:0, mod p^2 12:117; product+1 mod p^2 53
- Pair (932, 893); residues mod25 7:18, mod p 9:9, mod p^2 87:48; product+1 mod p^2 121
- Pair (957, 968); residues mod25 7:18, mod p 8:6, mod p^2 112:123; product+1 mod p^2 88
- Pair (1007, 1418); residues mod25 7:18, mod p 6:1, mod p^2 162:66; product+1 mod p^2 46
- Pair (1057, 993); residues mod25 7:18, mod p 4:5, mod p^2 43:148; product+1 mod p^2 112
- Pair (1082, 1193); residues mod25 7:18, mod p 3:10, mod p^2 68:10; product+1 mod p^2 5
- Pair (1157, 1093); residues mod25 7:18, mod p 0:1, mod p^2 143:79; product+1 mod p^2 144
- Pair (1257, 1293); residues mod25 7:18, mod p 9:6, mod p^2 74:110; product+1 mod p^2 29
- Pair (1282, 1393); residues mod25 7:18, mod p 8:2, mod p^2 99:41; product+1 mod p^2 4
- Pair (1357, 1493); residues mod25 7:18, mod p 5:11, mod p^2 5:141; product+1 mod p^2 30
- Pair (1382, 1593); residues mod25 7:18, mod p 4:7, mod p^2 30:72; product+1 mod p^2 133
- Pair (1457, 1868); residues mod25 7:18, mod p 1:9, mod p^2 105:9; product+1 mod p^2 101
- Pair (1557, 1693); residues mod25 7:18, mod p 10:3, mod p^2 36:3; product+1 mod p^2 109
- Pair (1607, 1643); residues mod25 7:18, mod p 8:5, mod p^2 86:122; product+1 mod p^2 15
- Pair (1657, 1793); residues mod25 7:18, mod p 6:12, mod p^2 136:103; product+1 mod p^2 151
- Pair (1757, 1893); residues mod25 7:18, mod p 2:8, mod p^2 67:34; product+1 mod p^2 82
- Pair (1832, 1993); residues mod25 7:18, mod p 12:4, mod p^2 142:134; product+1 mod p^2 101
- Pair (1857, 2093); residues mod25 7:18, mod p 11:0, mod p^2 167:65; product+1 mod p^2 40
- Pair (1957, 2193); residues mod25 7:18, mod p 7:9, mod p^2 98:165; product+1 mod p^2 116
- Pair (2057, 2318); residues mod25 7:18, mod p 3:4, mod p^2 29:121; product+1 mod p^2 130
- Pair (2157, 2293); residues mod25 7:18, mod p 12:5, mod p^2 129:96; product+1 mod p^2 48
- Pair (2232, 2393); residues mod25 7:18, mod p 9:1, mod p^2 35:27; product+1 mod p^2 101
- Pair (2257, 2493); residues mod25 7:18, mod p 8:10, mod p^2 60:127; product+1 mod p^2 16
- Pair (2282, 2543); residues mod25 7:18, mod p 7:8, mod p^2 85:8; product+1 mod p^2 5
- Pair (2357, 2568); residues mod25 7:18, mod p 4:7, mod p^2 160:33; product+1 mod p^2 42
- Pair (2457, 2593); residues mod25 7:18, mod p 0:6, mod p^2 91:58; product+1 mod p^2 40
- Pair (2507, 2768); residues mod25 7:18, mod p 11:12, mod p^2 141:64; product+1 mod p^2 68
- Pair (2557, 2693); residues mod25 7:18, mod p 9:2, mod p^2 22:158; product+1 mod p^2 97
- Pair (2657, 2793); residues mod25 7:18, mod p 5:11, mod p^2 122:89; product+1 mod p^2 43
- Pair (2732, 2893); residues mod25 7:18, mod p 2:7, mod p^2 28:20; product+1 mod p^2 54
- Pair (2757, 2993); residues mod25 7:18, mod p 1:3, mod p^2 53:120; product+1 mod p^2 108
- Pair (2857, 3093); residues mod25 7:18, mod p 10:12, mod p^2 153:51; product+1 mod p^2 30
- Pair (2957, 2918); residues mod25 7:18, mod p 6:6, mod p^2 84:45; product+1 mod p^2 63
- Pair (3057, 3193); residues mod25 7:18, mod p 2:8, mod p^2 15:151; product+1 mod p^2 69
- Pair (3157, 3293); residues mod25 7:18, mod p 11:4, mod p^2 115:82; product+1 mod p^2 136
- Pair (3182, 3393); residues mod25 7:18, mod p 10:0, mod p^2 140:13; product+1 mod p^2 131
- Pair (3257, 3218); residues mod25 7:18, mod p 7:7, mod p^2 46:7; product+1 mod p^2 154
- Pair (3357, 3593); residues mod25 7:18, mod p 3:5, mod p^2 146:44; product+1 mod p^2 3
- Pair (3407, 3443); residues mod25 7:18, mod p 1:11, mod p^2 27:63; product+1 mod p^2 12
- Pair (3457, 3493); residues mod25 7:18, mod p 12:9, mod p^2 77:113; product+1 mod p^2 83
- Pair (3557, 3668); residues mod25 7:18, mod p 8:2, mod p^2 8:119; product+1 mod p^2 108
- Pair (3632, 3693); residues mod25 7:18, mod p 5:1, mod p^2 83:144; product+1 mod p^2 123
- Pair (3657, 3793); residues mod25 7:18, mod p 4:10, mod p^2 108:75; product+1 mod p^2 158
- Pair (3757, 3893); residues mod25 7:18, mod p 0:6, mod p^2 39:6; product+1 mod p^2 66
- Pair (3807, 4118); residues mod25 7:18, mod p 11:10, mod p^2 89:62; product+1 mod p^2 111
- Pair (3857, 3993); residues mod25 7:18, mod p 9:2, mod p^2 139:106; product+1 mod p^2 32
- Pair (3957, 4093); residues mod25 7:18, mod p 5:11, mod p^2 70:37; product+1 mod p^2 56
- Pair (4057, 4193); residues mod25 7:18, mod p 1:7, mod p^2 1:137; product+1 mod p^2 138
- Pair (4082, 4143); residues mod25 7:18, mod p 0:9, mod p^2 26:87; product+1 mod p^2 66
- Pair (4157, 4293); residues mod25 7:18, mod p 10:3, mod p^2 101:68; product+1 mod p^2 109
- Pair (4257, 4393); residues mod25 7:18, mod p 6:12, mod p^2 32:168; product+1 mod p^2 138
- Pair (4307, 4343); residues mod25 7:18, mod p 4:1, mod p^2 82:118; product+1 mod p^2 44
- Pair (4357, 4493); residues mod25 7:18, mod p 2:8, mod p^2 132:99; product+1 mod p^2 56
- Pair (4457, 4568); residues mod25 7:18, mod p 11:5, mod p^2 63:5; product+1 mod p^2 147
- Pair (4532, 4593); residues mod25 7:18, mod p 8:4, mod p^2 138:30; product+1 mod p^2 85
- Pair (4557, 4693); residues mod25 7:18, mod p 7:0, mod p^2 163:130; product+1 mod p^2 66
- Pair (4657, 4768); residues mod25 7:18, mod p 3:10, mod p^2 94:36; product+1 mod p^2 5
- Pair (4682, 4793); residues mod25 7:18, mod p 2:9, mod p^2 119:61; product+1 mod p^2 162
- Pair (4757, 4893); residues mod25 7:18, mod p 12:5, mod p^2 25:161; product+1 mod p^2 139
- Pair (4857, 4993); residues mod25 7:18, mod p 8:1, mod p^2 125:92; product+1 mod p^2 9
- Pair (4957, 5093); residues mod25 7:18, mod p 4:10, mod p^2 56:23; product+1 mod p^2 106
- Pair (4982, 5018); residues mod25 7:18, mod p 3:0, mod p^2 81:117; product+1 mod p^2 14
- Pair (5057, 5193); residues mod25 7:18, mod p 0:6, mod p^2 156:123; product+1 mod p^2 92
- Pair (5157, 5293); residues mod25 7:18, mod p 9:2, mod p^2 87:54; product+1 mod p^2 136
- Pair (5207, 5243); residues mod25 7:18, mod p 7:4, mod p^2 137:4; product+1 mod p^2 42
- Pair (5257, 5368); residues mod25 7:18, mod p 5:12, mod p^2 18:129; product+1 mod p^2 126
- Pair (5357, 5468); residues mod25 7:18, mod p 1:8, mod p^2 118:60; product+1 mod p^2 152
- Pair (5432, 5393); residues mod25 7:18, mod p 11:11, mod p^2 24:154; product+1 mod p^2 148
- Pair (5457, 5493); residues mod25 7:18, mod p 10:7, mod p^2 49:85; product+1 mod p^2 110
- Pair (5507, 5918); residues mod25 7:18, mod p 8:3, mod p^2 99:3; product+1 mod p^2 129
- Pair (5557, 5693); residues mod25 7:18, mod p 6:12, mod p^2 149:116; product+1 mod p^2 47
- Pair (5657, 5593); residues mod25 7:18, mod p 2:3, mod p^2 80:16; product+1 mod p^2 98
- Pair (5757, 5793); residues mod25 7:18, mod p 11:8, mod p^2 11:47; product+1 mod p^2 11
- Pair (5782, 5893); residues mod25 7:18, mod p 10:4, mod p^2 36:147; product+1 mod p^2 54
- Pair (5857, 5993); residues mod25 7:18, mod p 7:0, mod p^2 111:78; product+1 mod p^2 40
- Pair (5882, 6093); residues mod25 7:18, mod p 6:9, mod p^2 136:9; product+1 mod p^2 42
- Pair (5907, 6143); residues mod25 7:18, mod p 5:7, mod p^2 161:59; product+1 mod p^2 36
- Pair (5957, 6293); residues mod25 7:18, mod p 3:1, mod p^2 42:40; product+1 mod p^2 160
- Pair (6057, 6193); residues mod25 7:18, mod p 12:5, mod p^2 142:109; product+1 mod p^2 100
- Pair (6107, 6368); residues mod25 7:18, mod p 10:11, mod p^2 23:115; product+1 mod p^2 111
- Pair (6157, 6393); residues mod25 7:18, mod p 8:10, mod p^2 73:140; product+1 mod p^2 81
- Pair (6257, 6593); residues mod25 7:18, mod p 4:2, mod p^2 4:2; product+1 mod p^2 9
- Pair (6332, 6493); residues mod25 7:18, mod p 1:6, mod p^2 79:71; product+1 mod p^2 33
- Pair (6357, 6693); residues mod25 7:18, mod p 0:11, mod p^2 104:102; product+1 mod p^2 131
- Pair (6457, 6793); residues mod25 7:18, mod p 9:7, mod p^2 35:33; product+1 mod p^2 142
- Pair (6532, 6893); residues mod25 7:18, mod p 6:3, mod p^2 110:133; product+1 mod p^2 97
- Pair (6557, 6818); residues mod25 7:18, mod p 5:6, mod p^2 135:58; product+1 mod p^2 57
- Pair (6657, 7093); residues mod25 7:18, mod p 1:8, mod p^2 66:164; product+1 mod p^2 9
- Pair (6682, 6993); residues mod25 7:18, mod p 0:12, mod p^2 91:64; product+1 mod p^2 79
- Pair (6757, 7193); residues mod25 7:18, mod p 10:4, mod p^2 166:95; product+1 mod p^2 54
- Pair (6782, 7043); residues mod25 7:18, mod p 9:10, mod p^2 22:114; product+1 mod p^2 143
- Pair (6857, 7268); residues mod25 7:18, mod p 6:1, mod p^2 97:1; product+1 mod p^2 98
- Pair (6957, 7293); residues mod25 7:18, mod p 2:0, mod p^2 28:26; product+1 mod p^2 53
