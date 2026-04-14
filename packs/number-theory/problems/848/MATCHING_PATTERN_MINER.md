# Problem 848 Matching Pattern Miner

- Generated: 2026-04-11T20:22:52.793Z
- Method: `bounded_missing_cross_matching_pattern_mining`
- Status: `matching_pattern_witness_packet_ready`
- Target prime: `13`
- Source range: `7307..7600`
- Witness rows: `12`
- Reconstructed matches agree: `yes`
- Saturates smaller side: `yes`
- K range: `85..89`
- Matching range: `105..108`
- Minimum slack: `19`
- Common matching core across witnesses: `0`

## Pattern Summary

- Total witness matching pairs: `1281`
- Outsider residue groups: `[{"key":"70:9","count":6},{"key":"99:6","count":5},{"key":"99:14","count":1}]`
- Top right-left deltas: `[{"key":-64,"count":156},{"key":136,"count":152},{"key":-264,"count":128},{"key":36,"count":123},{"key":-164,"count":75},{"key":-189,"count":72},{"key":-364,"count":49},{"key":111,"count":48}]`
- Top product+1 residues mod p^2: `[{"key":130,"count":25},{"key":131,"count":23},{"key":66,"count":23},{"key":5,"count":22},{"key":97,"count":22},{"key":40,"count":21},{"key":42,"count":21},{"key":54,"count":21}]`
- Proof heuristic: The tight-row witnesses do not share one common matching core; split the symbolic construction by outsider residue and saturated side.

## Split Profiles

- `outP2=70|out25=9|smaller=side7`: witnesses 6, N 7318..7368, K 88..89, min slack 19, common pairs 108, full core exported yes, core >= max K yes
- `outP2=99|out25=6|smaller=side18`: witnesses 5, N 7307..7357, K 85..85, min slack 20, common pairs 105, full core exported yes, core >= max K yes
- `outP2=99|out25=14|smaller=side7`: witnesses 1, N 7343..7343, K 88..88, min slack 20, common pairs 108, full core exported yes, core >= max K yes

## Witness Rows

- N=7343, outsider=5309, K=89, matching=108, slack=19, smaller=side7, unmatched larger=4
- N=7318, outsider=5309, K=88, matching=108, slack=20, smaller=side7, unmatched larger=3
- N=7337, outsider=5309, K=88, matching=108, slack=20, smaller=side7, unmatched larger=3
- N=7343, outsider=1789, K=88, matching=108, slack=20, smaller=side7, unmatched larger=3
- N=7357, outsider=5309, K=88, matching=108, slack=20, smaller=side7, unmatched larger=4
- N=7366, outsider=5309, K=88, matching=108, slack=20, smaller=side7, unmatched larger=4
- N=7368, outsider=5309, K=88, matching=108, slack=20, smaller=side7, unmatched larger=4
- N=7307, outsider=4831, K=85, matching=105, slack=20, smaller=side18, unmatched larger=6
- N=7318, outsider=4831, K=85, matching=105, slack=20, smaller=side18, unmatched larger=6
- N=7337, outsider=4831, K=85, matching=105, slack=20, smaller=side18, unmatched larger=6
- N=7343, outsider=4831, K=85, matching=105, slack=20, smaller=side18, unmatched larger=6
- N=7357, outsider=4831, K=85, matching=105, slack=20, smaller=side18, unmatched larger=7

## Tightest Pair Samples

- N=7343, outsider=5309: [{"leftValue":7,"rightValue":43,"leftMod25":7,"rightMod25":18,"leftModP2":7,"rightModP2":43,"leftModP":7,"rightModP":4,"productPlusOneModP2":133},{"leftValue":82,"rightValue":118,"leftMod25":7,"rightMod25":18,"leftModP2":82,"rightModP2":118,"leftModP":4,"rightModP":1,"productPlusOneModP2":44},{"leftValue":107,"rightValue":143,"leftMod25":7,"rightMod25":18,"leftModP2":107,"rightModP2":143,"leftModP":3,"rightModP":0,"productPlusOneModP2":92},{"leftValue":207,"rightValue":243,"leftMod25":7,"rightMod25":18,"leftModP2":38,"rightModP2":74,"leftModP":12,"rightModP":9,"productPlusOneModP2":109},{"leftValue":307,"rightValue":268,"leftMod25":7,"rightMod25":18,"leftModP2":138,"rightModP2":99,"leftModP":8,"rightModP":8,"productPlusOneModP2":143},{"leftValue":407,"rightValue":343,"leftMod25":7,"rightMod25":18,"leftModP2":69,"rightModP2":5,"leftModP":4,"rightModP":5,"productPlusOneModP2":8},{"leftValue":507,"rightValue":368,"leftMod25":7,"rightMod25":18,"leftModP2":0,"rightModP2":30,"leftModP":0,"rightModP":4,"productPlusOneModP2":1},{"leftValue":532,"rightValue":443,"leftMod25":7,"rightMod25":18,"leftModP2":25,"rightModP2":105,"leftModP":12,"rightModP":1,"productPlusOneModP2":91}]
- N=7318, outsider=5309: [{"leftValue":7,"rightValue":43,"leftMod25":7,"rightMod25":18,"leftModP2":7,"rightModP2":43,"leftModP":7,"rightModP":4,"productPlusOneModP2":133},{"leftValue":82,"rightValue":118,"leftMod25":7,"rightMod25":18,"leftModP2":82,"rightModP2":118,"leftModP":4,"rightModP":1,"productPlusOneModP2":44},{"leftValue":107,"rightValue":143,"leftMod25":7,"rightMod25":18,"leftModP2":107,"rightModP2":143,"leftModP":3,"rightModP":0,"productPlusOneModP2":92},{"leftValue":207,"rightValue":243,"leftMod25":7,"rightMod25":18,"leftModP2":38,"rightModP2":74,"leftModP":12,"rightModP":9,"productPlusOneModP2":109},{"leftValue":307,"rightValue":268,"leftMod25":7,"rightMod25":18,"leftModP2":138,"rightModP2":99,"leftModP":8,"rightModP":8,"productPlusOneModP2":143},{"leftValue":407,"rightValue":343,"leftMod25":7,"rightMod25":18,"leftModP2":69,"rightModP2":5,"leftModP":4,"rightModP":5,"productPlusOneModP2":8},{"leftValue":507,"rightValue":368,"leftMod25":7,"rightMod25":18,"leftModP2":0,"rightModP2":30,"leftModP":0,"rightModP":4,"productPlusOneModP2":1},{"leftValue":532,"rightValue":443,"leftMod25":7,"rightMod25":18,"leftModP2":25,"rightModP2":105,"leftModP":12,"rightModP":1,"productPlusOneModP2":91}]
- N=7337, outsider=5309: [{"leftValue":7,"rightValue":43,"leftMod25":7,"rightMod25":18,"leftModP2":7,"rightModP2":43,"leftModP":7,"rightModP":4,"productPlusOneModP2":133},{"leftValue":82,"rightValue":118,"leftMod25":7,"rightMod25":18,"leftModP2":82,"rightModP2":118,"leftModP":4,"rightModP":1,"productPlusOneModP2":44},{"leftValue":107,"rightValue":143,"leftMod25":7,"rightMod25":18,"leftModP2":107,"rightModP2":143,"leftModP":3,"rightModP":0,"productPlusOneModP2":92},{"leftValue":207,"rightValue":243,"leftMod25":7,"rightMod25":18,"leftModP2":38,"rightModP2":74,"leftModP":12,"rightModP":9,"productPlusOneModP2":109},{"leftValue":307,"rightValue":268,"leftMod25":7,"rightMod25":18,"leftModP2":138,"rightModP2":99,"leftModP":8,"rightModP":8,"productPlusOneModP2":143},{"leftValue":407,"rightValue":343,"leftMod25":7,"rightMod25":18,"leftModP2":69,"rightModP2":5,"leftModP":4,"rightModP":5,"productPlusOneModP2":8},{"leftValue":507,"rightValue":368,"leftMod25":7,"rightMod25":18,"leftModP2":0,"rightModP2":30,"leftModP":0,"rightModP":4,"productPlusOneModP2":1},{"leftValue":532,"rightValue":443,"leftMod25":7,"rightMod25":18,"leftModP2":25,"rightModP2":105,"leftModP":12,"rightModP":1,"productPlusOneModP2":91}]

## Symbolic Use

- Active atom: `D2_p13_matching_lower_bound`
- Construction target: Replace Hopcroft-Karp replay with a residue/block injection that saturates the smaller compatible side of H_{x,N}.
- Proof hint: Each witness records actual missing-cross matching pairs. A human/prover lane should look for a residue-parametric injection from the smaller compatible side into squarefree cross pairs.

## Boundary

- Claim level: `bounded_pattern_witness_not_symbolic_proof`
- Note: This artifact reconstructs matching witnesses for selected bounded threat rows. It does not certify rows outside the source verifier range and does not prove the all-N matching lemma.
- Promotion rule: Promote D2/D3 only after the observed matching pattern is replaced by a symbolic construction and checked against the structural-lift atom.
