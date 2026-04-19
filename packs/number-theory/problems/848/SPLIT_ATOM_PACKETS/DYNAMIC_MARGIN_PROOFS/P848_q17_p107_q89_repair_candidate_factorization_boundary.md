# Problem 848 p107/q89 Repair Candidate Factorization Boundary

Generated: 2026-04-17T04:00:53Z

## Scope

This packet belongs to the q17 endpoint-menu branch
`p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71/p107/q89`.

The source split is
`P848_q17_p79_q71_p107_availability_split.json`.

The open child is

`left == 760410154648626128533304355898763555393483209652336085943695959179023528577227857 mod 4018151289874337645868852921870587523537603036293953839351606997760601160064480100`.

At this representative, the p107 endpoint is blocked by `89^2`.

## Trial Repair Candidates

- p197 is inside the `28500` window with `k=1073`, `delta=-26839`, and no checked square divisor through prime `199999`. Its cross product has known factor `3`, but the remaining 162-digit cofactor is composite and no factor was found by the local bounded factor probe through `10000000`.
- p4217 is inside the `28500` window with `k=203`, `delta=-5089`, and no checked square divisor through prime `199999`. Its cross product has known factors `3 * 17 * 43 * 6229`; the remaining 155-digit cofactor was later split by local ECM, producing an exact p4217 factor certificate.

The bounded scan over prime endpoints `23 <= p <= 50000`, excluding p107 and outsider p6323, found `17` within-window endpoints. Under trial square checking through `199999`, only p197 and p4217 survived as repair candidates. p4217 is now superseded by `P848_q17_p107_q89_p4217_factor_certificate.json` and `P848_q17_p107_q89_p4217_subclass_repair.json`; p197 remains uncertified.

## Boundary

This is not the repair packet. It records the trial-candidate boundary and is now superseded for p4217 by the exact p4217 certificate and repair packet. It does not prove p197 squarefree.

The next proof-facing move is the p4217 availability split, not another sibling endpoint search.
