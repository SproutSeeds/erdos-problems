# P848 P4217 later-prime 15-bucket next-prime 17-bucket rank boundary

- Status: `p479_later_prime_15_bucket_next_prime_17_bucket_deterministic_rank_boundary_emitted`
- Target: `compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_buckets_or_emit_rank_boundary`
- Recommended next action: `derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_or_emit_boundary`
- Source rows accounted: 718
- Source later q-avoiding classes accounted: 3652250197976151
- Next-prime buckets: 17
- Next primes: 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223
- Next root children emitted: 7304500395952302
- Next q-avoiding classes emitted: 94524741190958970657
- Survivor source rows: 0
- Survivor later q-avoiding classes: 0

## Boundary Buckets

- q131: 44 source rows, 107615543442484 source later q-avoiding classes, 215231086884968 next root children, 1846575109929582956 next q-avoiding classes.
- q137: 83 source rows, 247941698677850 source later q-avoiding classes, 495883397355700 next root children, 4653121859087210950 next q-avoiding classes.
- q139: 89 source rows, 317273632000207 source later q-avoiding classes, 634547264000414 next root children, 6129409296611999033 next q-avoiding classes.
- q149: 117 source rows, 473503169591427 source later q-avoiding classes, 947006339182854 next root children, 10511296861760087973 next q-avoiding classes.
- q151: 92 source rows, 435776693460196 source later q-avoiding classes, 871553386920392 next root children, 9935272834199008604 next q-avoiding classes.
- q157: 85 source rows, 446002376201291 source later q-avoiding classes, 892004752402582 next root children, 10992620566233219277 next q-avoiding classes.
- q163: 67 source rows, 424043199744197 source later q-avoiding classes, 848086399488394 next root children, 11265555687604081699 next q-avoiding classes.
- q167: 54 source rows, 346049561651826 source later q-avoiding classes, 692099123303652 next root children, 9650284125784471662 next q-avoiding classes.
- q173: 27 source rows, 207452942753013 source later q-avoiding classes, 414905885506026 next root children, 6208444217769420051 next q-avoiding classes.
- q179: 24 source rows, 218451106784544 source later q-avoiding classes, 436902213569088 next root children, 6998955010270005216 next q-avoiding classes.
- q181: 12 source rows, 107648049268380 source later q-avoiding classes, 215296098536760 next root children, 3526442445982860420 next q-avoiding classes.
- q191: 6 source rows, 49375224107610 source later q-avoiding classes, 98750448215220 next root children, 1801158800221505190 next q-avoiding classes.
- q193: 2 source rows, 40857688105846 source later q-avoiding classes, 81715376211692 next root children, 1521826308878445962 next q-avoiding classes.
- q197: 5 source rows, 94183957814347 source later q-avoiding classes, 188367915628694 next root children, 3654996850901364029 next q-avoiding classes.
- q199: 7 source rows, 61500570294233 source later q-avoiding classes, 123001140588466 next root children, 2435361083081332567 next q-avoiding classes.
- q211: 3 source rows, 60476220283629 source later q-avoiding classes, 120952440567258 next root children, 2692340850806879451 next q-avoiding classes.
- q223: 1 source rows, 14098563795071 source later q-avoiding classes, 28197127590142 next root children, 701079281837495617 next q-avoiding classes.

## Compression Audit

Every stored row in the 17-bucket next-prime boundary has exactly two roots at its first next obstruction prime.
The shared two-root law emits rank children and a very large q-avoiding boundary; it does not prove terminal closure of those children.
The buckets mix previous later-prime supports unevenly, so this packet records the exact finite partition and hands off a whole-boundary q-avoiding batch cover instead of claiming one closed terminal family.

## Boundary

This packet accounts for every next-prime bucket emitted by the later-prime 15-bucket q-avoiding batch cover and turns the 17-bucket surface into an exact deterministic ranked boundary. It does not close the 7,304,500,395,952,302 next root children, the 94,524,741,190,958,970,657 next q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.

## Next Move

Run a whole-boundary q-avoiding batch cover over all 17 next-prime buckets, or emit an exact survivor/rank boundary if the batch cover does not close.
