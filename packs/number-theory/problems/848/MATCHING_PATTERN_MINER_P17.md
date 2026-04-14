# Problem 848 Matching Pattern Miner

- Generated: 2026-04-11T20:22:52.793Z
- Method: `bounded_missing_cross_matching_pattern_mining`
- Status: `matching_pattern_witness_packet_ready`
- Target prime: `17`
- Source range: `7307..7600`
- Witness rows: `12`
- Reconstructed matches agree: `yes`
- Saturates smaller side: `yes`
- K range: `10..14`
- Matching range: `106..109`
- Minimum slack: `95`
- Common matching core across witnesses: `4`

## Pattern Summary

- Total witness matching pairs: `1303`
- Outsider residue groups: `[{"key":"38:23","count":10},{"key":"251:1","count":2}]`
- Top right-left deltas: `[{"key":36,"count":306},{"key":-64,"count":246},{"key":136,"count":208},{"key":-39,"count":82},{"key":-89,"count":76},{"key":111,"count":54},{"key":-164,"count":42},{"key":-239,"count":42}]`
- Top product+1 residues mod p^2: `[{"key":154,"count":32},{"key":172,"count":30},{"key":81,"count":30},{"key":220,"count":22},{"key":139,"count":20},{"key":176,"count":20},{"key":185,"count":20},{"key":256,"count":20}]`
- Proof heuristic: The tight-row witnesses share a nonempty stable matching core. Try proving saturation by extending this stable core across residue blocks, then handle boundary insertions separately.

## Split Profiles

- `outP2=38|out25=23|smaller=side7`: witnesses 10, N 7307..7393, K 12..14, min slack 95, common pairs 109, full core exported yes, core >= max K yes
- `outP2=251|out25=1|smaller=side18`: witnesses 2, N 7307..7318, K 10..11, min slack 96, common pairs 106, full core exported yes, core >= max K yes

## Witness Rows

- N=7318, outsider=4373, K=14, matching=109, slack=95, smaller=side7, unmatched larger=2
- N=7343, outsider=4373, K=14, matching=109, slack=95, smaller=side7, unmatched larger=3
- N=7307, outsider=4373, K=13, matching=109, slack=96, smaller=side7, unmatched larger=1
- N=7332, outsider=4373, K=13, matching=109, slack=96, smaller=side7, unmatched larger=2
- N=7337, outsider=4373, K=13, matching=109, slack=96, smaller=side7, unmatched larger=2
- N=7357, outsider=4373, K=13, matching=109, slack=96, smaller=side7, unmatched larger=3
- N=7366, outsider=4373, K=13, matching=109, slack=96, smaller=side7, unmatched larger=3
- N=7368, outsider=4373, K=13, matching=109, slack=96, smaller=side7, unmatched larger=3
- N=7318, outsider=251, K=11, matching=107, slack=96, smaller=side18, unmatched larger=3
- N=7307, outsider=251, K=10, matching=106, slack=96, smaller=side18, unmatched larger=4
- N=7382, outsider=4373, K=12, matching=109, slack=97, smaller=side7, unmatched larger=3
- N=7393, outsider=4373, K=12, matching=109, slack=97, smaller=side7, unmatched larger=3

## Tightest Pair Samples

- N=7318, outsider=4373: [{"leftValue":7,"rightValue":43,"leftMod25":7,"rightMod25":18,"leftModP2":7,"rightModP2":43,"leftModP":7,"rightModP":9,"productPlusOneModP2":13},{"leftValue":82,"rightValue":118,"leftMod25":7,"rightMod25":18,"leftModP2":82,"rightModP2":118,"leftModP":14,"rightModP":16,"productPlusOneModP2":140},{"leftValue":107,"rightValue":143,"leftMod25":7,"rightMod25":18,"leftModP2":107,"rightModP2":143,"leftModP":5,"rightModP":7,"productPlusOneModP2":274},{"leftValue":207,"rightValue":243,"leftMod25":7,"rightMod25":18,"leftModP2":207,"rightModP2":243,"leftModP":3,"rightModP":5,"productPlusOneModP2":16},{"leftValue":307,"rightValue":343,"leftMod25":7,"rightMod25":18,"leftModP2":18,"rightModP2":54,"leftModP":1,"rightModP":3,"productPlusOneModP2":106},{"leftValue":407,"rightValue":443,"leftMod25":7,"rightMod25":18,"leftModP2":118,"rightModP2":154,"leftModP":16,"rightModP":1,"productPlusOneModP2":255},{"leftValue":507,"rightValue":543,"leftMod25":7,"rightMod25":18,"leftModP2":218,"rightModP2":254,"leftModP":14,"rightModP":16,"productPlusOneModP2":174},{"leftValue":532,"rightValue":568,"leftMod25":7,"rightMod25":18,"leftModP2":243,"rightModP2":279,"leftModP":5,"rightModP":7,"productPlusOneModP2":172}]
- N=7343, outsider=4373: [{"leftValue":7,"rightValue":43,"leftMod25":7,"rightMod25":18,"leftModP2":7,"rightModP2":43,"leftModP":7,"rightModP":9,"productPlusOneModP2":13},{"leftValue":82,"rightValue":118,"leftMod25":7,"rightMod25":18,"leftModP2":82,"rightModP2":118,"leftModP":14,"rightModP":16,"productPlusOneModP2":140},{"leftValue":107,"rightValue":143,"leftMod25":7,"rightMod25":18,"leftModP2":107,"rightModP2":143,"leftModP":5,"rightModP":7,"productPlusOneModP2":274},{"leftValue":207,"rightValue":243,"leftMod25":7,"rightMod25":18,"leftModP2":207,"rightModP2":243,"leftModP":3,"rightModP":5,"productPlusOneModP2":16},{"leftValue":307,"rightValue":343,"leftMod25":7,"rightMod25":18,"leftModP2":18,"rightModP2":54,"leftModP":1,"rightModP":3,"productPlusOneModP2":106},{"leftValue":407,"rightValue":443,"leftMod25":7,"rightMod25":18,"leftModP2":118,"rightModP2":154,"leftModP":16,"rightModP":1,"productPlusOneModP2":255},{"leftValue":507,"rightValue":543,"leftMod25":7,"rightMod25":18,"leftModP2":218,"rightModP2":254,"leftModP":14,"rightModP":16,"productPlusOneModP2":174},{"leftValue":532,"rightValue":568,"leftMod25":7,"rightMod25":18,"leftModP2":243,"rightModP2":279,"leftModP":5,"rightModP":7,"productPlusOneModP2":172}]
- N=7307, outsider=4373: [{"leftValue":7,"rightValue":43,"leftMod25":7,"rightMod25":18,"leftModP2":7,"rightModP2":43,"leftModP":7,"rightModP":9,"productPlusOneModP2":13},{"leftValue":82,"rightValue":118,"leftMod25":7,"rightMod25":18,"leftModP2":82,"rightModP2":118,"leftModP":14,"rightModP":16,"productPlusOneModP2":140},{"leftValue":107,"rightValue":143,"leftMod25":7,"rightMod25":18,"leftModP2":107,"rightModP2":143,"leftModP":5,"rightModP":7,"productPlusOneModP2":274},{"leftValue":207,"rightValue":243,"leftMod25":7,"rightMod25":18,"leftModP2":207,"rightModP2":243,"leftModP":3,"rightModP":5,"productPlusOneModP2":16},{"leftValue":307,"rightValue":343,"leftMod25":7,"rightMod25":18,"leftModP2":18,"rightModP2":54,"leftModP":1,"rightModP":3,"productPlusOneModP2":106},{"leftValue":407,"rightValue":443,"leftMod25":7,"rightMod25":18,"leftModP2":118,"rightModP2":154,"leftModP":16,"rightModP":1,"productPlusOneModP2":255},{"leftValue":507,"rightValue":543,"leftMod25":7,"rightMod25":18,"leftModP2":218,"rightModP2":254,"leftModP":14,"rightModP":16,"productPlusOneModP2":174},{"leftValue":532,"rightValue":568,"leftMod25":7,"rightMod25":18,"leftModP2":243,"rightModP2":279,"leftModP":5,"rightModP":7,"productPlusOneModP2":172}]

## Symbolic Use

- Active atom: `D3_p17_matching_lower_bound`
- Construction target: Replace Hopcroft-Karp replay with a residue/block injection that saturates the smaller compatible side of H_{x,N}.
- Proof hint: Each witness records actual missing-cross matching pairs. A human/prover lane should look for a residue-parametric injection from the smaller compatible side into squarefree cross pairs.

## Boundary

- Claim level: `bounded_pattern_witness_not_symbolic_proof`
- Note: This artifact reconstructs matching witnesses for selected bounded threat rows. It does not certify rows outside the source verifier range and does not prove the all-N matching lemma.
- Promotion rule: Promote D2/D3 only after the observed matching pattern is replaced by a symbolic construction and checked against the structural-lift atom.
