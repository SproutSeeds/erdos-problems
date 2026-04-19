# P848 p4217 Complement p61/q101 Repair Candidate Boundary

Status: `p4217_complement_p61_q101_p443_repair_candidate_boundary_open`

Generated: 2026-04-17T06:25:06Z

## Target Child

The source child is the first q101 square-obstruction subfamily inside the first p61-available p4217-complement CRT family:

- `t == 121075312471178 mod 675009087397969`
- `left == 486498922978003120137482190528915923361118218280393901731215929409345512449172580645681381785657 mod 2712288635205048649747664011117929144880624281851945987471741427034114118918054256500369780916900`
- inherited obstruction: p61 with `k=1014`, `delta=-25364`, and `101^2 | left*(left - 25364)+1`

## Bounded Repair Screen

Screen scope: established endpoint-menu primes with `23 <= p <= 50000`, outsider `6323`, endpoint window `28500`, and `maxK=1139`.

The screen found 17 within-window endpoints. Fourteen are trial-square-blocked through prime `199999`; three are trial-squarefree candidates.

Blocked endpoints:

- p23: `k=479`, `delta=-11989`, blocked by `29^2`
- p29: `k=330`, `delta=-8264`, blocked by `59^2`
- p31: `k=727`, `delta=-18189`, blocked by `53^2`
- p37: `k=457`, `delta=-11439`, blocked by `19^2`
- p41: `k=1011`, `delta=-25289`, blocked by `13^2`
- p43: `k=200`, `delta=-5014`, blocked by `2^2`
- p47: `k=682`, `delta=-17064`, blocked by `67^2`
- p61: `k=1014`, `delta=-25364`, blocked by `101^2`
- p73: `k=42`, `delta=-1064`, blocked by `11^2`
- p79: `k=635`, `delta=-15889`, blocked by `71^2`
- p83: `k=1053`, `delta=-26339`, blocked by `17^2`
- p103: `k=532`, `delta=-13314`, blocked by `2^2`
- p107: `k=913`, `delta=-22839`, blocked by `89^2`
- p509: `k=456`, `delta=-11414`, blocked by `43^2`

Trial-squarefree candidates:

- p443: `k=1029`, `delta=-25739`, no square divisor found through prime `199999`; known factor `809`; residual has 189 digits.
- p1741: `k=149`, `delta=-3739`, no square divisor found through prime `199999`; known factor `3`; residual has 191 digits.
- p2609: `k=257`, `delta=-6439`, no square divisor found through prime `199999`; known factors `3 * 7 * 13 * 41`; residual has 188 digits.

## Boundary

This packet does not certify p443 as squarefree and does not close the p61/q101 child. It records the bounded repair-selector outcome and reduces the immediate child to exact certification of p443, with p1741 and p2609 retained as reserve candidates.

Next action: `exact_certify_p848_p4217_complement_p61_q101_p443_repair_candidate`.

Verification command: `node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-endpoint-menu-compiler.test.js test/p848-282-alignment-obstruction-packet.test.js`
