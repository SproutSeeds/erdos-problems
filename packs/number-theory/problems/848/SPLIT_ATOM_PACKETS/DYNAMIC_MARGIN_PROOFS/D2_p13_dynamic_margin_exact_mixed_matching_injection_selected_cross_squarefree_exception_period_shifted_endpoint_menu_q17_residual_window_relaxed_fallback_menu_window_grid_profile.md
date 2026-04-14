# Problem 848 Endpoint Window Grid

- Target: `q17 residual window-relaxed fallback endpoint-menu selector window grid`
- Residual class: `left ≡ 5882 mod 11025`
- Scan: `27932207..40000000` over `1095` residual rows
- Windows: `25000,28500,30000,35000,50000`
- Square check: `Fast obstruction screening is present; no checked square divisor is not always an all-prime squarefree proof.`
- Primary menu: `23,31,37,41,61,67`
- Fallback menu: `71,73,79,83,89,97,101,103,107,109,113`
- First screen primary-covered window: `(none)`
- First screen full-menu-covered window: `28500`

## Coverage By Window

- window=25000: primary `1076/1095`, full `1091/1095`, first primary miss `28836257`, first full miss `34414907`
- window=25000 nearest unblocked outside-window endpoint for first full miss: p=67, delta=-28489, right=34386418, status=no_checked_square_divisor
- window=28500: primary `1082/1095`, full `1095/1095`, first primary miss `28836257`, first full miss `(none)`
- window=30000: primary `1083/1095`, full `1095/1095`, first primary miss `28836257`, first full miss `(none)`
- window=35000: primary `1089/1095`, full `1095/1095`, first primary miss `34900007`, first full miss `(none)`
- window=50000: primary `1091/1095`, full `1095/1095`, first primary miss `34900007`, first full miss `(none)`

## Next Theorem Options

- `window_relaxation_candidate` [candidate]: The full menu first covers the bounded scan at window=28500; decide whether that relaxation is theorem-legal or requires a replacement-path handoff.
- `availability_strata_lift` [needed]: Convert the observed window thresholds into residue-class availability strata rather than continuing a row-by-row staircase.

## Boundary

- A window grid is a bounded selector profile. It can identify the next theorem boundary but does not prove all-N coverage or matching by itself.

