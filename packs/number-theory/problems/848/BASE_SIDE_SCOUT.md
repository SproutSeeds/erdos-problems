# Problem 848 Base-Side Scout

- Generated: 2026-04-11T20:36:43.797Z
- Method: `bounded_base_side_compatibility_scout`
- Status: `counterexample_to_global_7_side_domination_found`
- Interval: `1..200`
- Outsiders checked: `5`
- Global max side18-minus-side7: `1`
- Max per-outsider side18-minus-side7: `1`

## Strongest Rows

- Strongest global side-18 row: `{"N":143,"maxSide7":2,"maxSide18":3,"maxSide7Outsider":41,"maxSide18Outsider":117,"maxSide18Minus7":1,"maxPerOutsider18Minus7":1,"maxPerOutsider7Minus18":1,"perOutsider18Winner":{"outsider":117,"side7":2,"side18":3,"delta18Minus7":1},"perOutsider7Winner":{"outsider":38,"side7":1,"side18":0,"delta7Minus18":1}}`
- Strongest per-outsider side-18 row: `{"N":143,"maxSide7":2,"maxSide18":3,"maxSide7Outsider":41,"maxSide18Outsider":117,"maxSide18Minus7":1,"maxPerOutsider18Minus7":1,"maxPerOutsider7Minus18":1,"perOutsider18Winner":{"outsider":117,"side7":2,"side18":3,"delta18Minus7":1},"perOutsider7Winner":{"outsider":38,"side7":1,"side18":0,"delta7Minus18":1}}`
- First global side-18 exceedance: `{"N":143,"maxSide7":2,"maxSide18":3,"maxSide7Outsider":41,"maxSide18Outsider":117,"maxSide18Minus7":1,"maxPerOutsider18Minus7":1,"maxPerOutsider7Minus18":1,"perOutsider18Winner":{"outsider":117,"side7":2,"side18":3,"delta18Minus7":1},"perOutsider7Winner":{"outsider":38,"side7":1,"side18":0,"delta7Minus18":1}}`
- First per-outsider side-18 exceedance: `{"N":143,"maxSide7":2,"maxSide18":3,"maxSide7Outsider":41,"maxSide18Outsider":117,"maxSide18Minus7":1,"maxPerOutsider18Minus7":1,"maxPerOutsider7Minus18":1,"perOutsider18Winner":{"outsider":117,"side7":2,"side18":3,"delta18Minus7":1},"perOutsider7Winner":{"outsider":38,"side7":1,"side18":0,"delta7Minus18":1}}`

## Boundary

- Claim level: `bounded_scout_not_proof`
- This scout compares principal-base compatibility counts on a finite interval only. It does not prove all-N base-side domination.
- Next use: A one-sided 7 mod 25 base mask is not safe on this bounded scout; a two-sided structural verifier is needed.
