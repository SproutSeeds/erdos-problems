# Problem 848 p4217/q61 Repair Candidate Factorization Boundary

Generated: 2026-04-17T05:13:51Z

## Scope

This packet belongs to the q17 endpoint-menu branch
`p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71/p107/q89/p4217/q61`.

The source split is
`P848_q17_p107_q89_p4217_availability_split.json`.

The open child is

`left == 169420141690585054358732178817328088519972453794407467571322168411530879091645805420092749757 mod 265884583394279840187007549369466635122108056254479559599229627196756604148422140623504536900`.

At this representative, the p4217 endpoint is blocked by `61^2`.

## Trial Repair Candidates

- p97 is inside the `28500` window with `k=102`, `delta=-2564`, and no checked square divisor through prime `199999`. Its cross product now has known factors `2 * 29 * 4984999 * 20049382114183789 * 42227912403779999179`; the remaining 141-digit cofactor is composite, has no trial factor through `20000000`, resisted the latest bounded ECM rungs, and completed a bounded Pollard p-1 run at `B=5000000`, `retries=8`, `seed=49848` with no factor.
- p227 is inside the `28500` window with `k=549`, `delta=-13739`, and no checked square divisor through prime `199999`. Its cross product has known factor `13297`; the remaining 181-digit cofactor is composite, no factor was found by local bounded ECM rungs, and a bounded Pollard p-1 run at `B=5000000`, `retries=8`, `seed=22748` completed with no factor.

The bounded scan over prime endpoints `23 <= p <= 50000`, excluding blocked p4217 and outsider p6323, found `17` within-window endpoints. Under trial square checking through `199999`, only p97 and p227 survived as repair candidates. All other within-window endpoints in that scan have an explicit square divisor inherited from the current staircase.

## Boundary

This is not a repair packet. It records the trial-candidate boundary for p4217/q61 and keeps the branch honest until one candidate gets an exact factor certificate or the open leaf is routed into a blocker/theorem ledger.

The p97 boundary is now sharper than the original trial packet: exact certification only needs the remaining 141-digit cofactor, not the earlier 183-digit one, and the latest p-1 attempt did not split it.

The next proof-facing move is a stronger local factor route if one is available, or an explicit p4217/q61 blocker/open-leaf ledger. It is not another sibling endpoint split.
