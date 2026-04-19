# Problem 848 p4217/q61 Factorization Blocker Open Leaf

Generated: 2026-04-17T05:17:26Z

## Scope

This packet belongs to the q17 endpoint-menu branch
`p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71/p107/q89/p4217/q61`.

The source boundary packet is
`P848_q17_p4217_q61_repair_candidate_factorization_boundary.json`.

The open leaf is

`left == 169420141690585054358732178817328088519972453794407467571322168411530879091645805420092749757 mod 265884583394279840187007549369466635122108056254479559599229627196756604148422140623504536900`.

At this representative, p4217 is blocked by `61^2`.

## Local Factorization Boundary

- The bounded endpoint screen over prime endpoints `23 <= p <= 50000`, excluding blocked p4217 and outsider p6323, found only p97 and p227 as trial-squarefree within-window candidates through square-prime limit `199999`.
- p97 remains exact-uncertified: it is partially split by `2 * 29 * 4984999 * 20049382114183789 * 42227912403779999179`, with a composite 141-digit cofactor, no trial factor through `20000000`, bounded ECM timeouts, and no Pollard p-1 factor at `B=5000000`, `retries=8`.
- p227 remains exact-uncertified: it is partially split by `13297`, with a composite 181-digit cofactor, bounded ECM timeouts, and no Pollard p-1 factor at `B=5000000`, `retries=8`.

## Boundary

This is not a repair packet. It does not prove p97 or p227 fail. It records that this local/free exact-certification route is stalled, so the branch must be accounted for as an open factorization leaf unless a stronger local factor route becomes available.

No p97 or p227 availability split may be emitted from trial-squarefree evidence alone.

## Next Theorem Move

Define the finite frontier ledger format from this leaf: closed repair handoffs, deterministic square-obstruction children, unavailable complements, exact-factor boundaries, and blocker/open-leaf states.

The verification command remains:

`node --test test/p848-endpoint-menu-compiler.test.js test/p848-282-alignment-obstruction-packet.test.js`
