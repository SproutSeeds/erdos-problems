# Problem 848 p4217 Complement p61/q101 p443/q97 p151 Blocker Open Leaf

Generated: 2026-04-17T07:58:17Z

## Scope

This packet belongs only to the first q97 square-obstruction child inside the first p443-available family of the p61/q101 branch.

- t == 858404682506186150932058 mod 1246408897617516648005929
- inherited obstruction: 97^2 at endpoint p443
- finite repair screen: established endpoint-menu primes 23 <= p <= 50000

## Blocked Candidate

p151 is the first trial-squarefree repair candidate in this finite q97 screen, but it is not exact-certified.

- endpoint: p151
- k=929, delta=-23239
- no checked square divisor through prime 199999
- known factors: 3 * 7 * 547 * 14713 * 281112363028343503 * 6530015338384483333
- remaining cofactor: 167 composite digits
- latest bounded route: p-1 found no factor through B=1000000/retries=6, then ECM B1=50000/B2=1000000/maxCurve=160 timed out at 240 seconds

## Reserve Candidate

p479 remains the only recorded reserve inside this same finite repair screen.

- endpoint: p479
- k=250, delta=-6264
- no checked square divisor through prime 199999
- known factors: 2 * 7 * 53
- remaining cofactor: 209 digits, not exact-certified

## Boundary

This is not a p151 impossibility proof. It records that the local/free exact-certification route for p151 has stalled, so p151 cannot be used as a repair handoff or availability split without a later exact squarefree certificate.

The q97 child, the q97-avoiding complement, p443-unavailable residues, q101-avoiding residues, other p61-available rows, the p61-unavailable complement, and Problem 848 remain open.

## Next Theorem Move

Exact-certify the p479 reserve candidate inside this same q97 repair screen, or ledger p479 as a blocker/open leaf. After p151 and p479 are certified, blocked, or explicitly ledgered, run convergence assembly before opening any fresh selector child.

Verification:

`node --test test/p848-endpoint-menu-compiler.test.js test/p848-282-alignment-obstruction-packet.test.js`
