# P848 P4217 next-rank later-prime 15-bucket rank boundary

- Status: `p479_next_rank_later_prime_15_bucket_deterministic_rank_boundary_emitted`
- Target: `compress_p848_p4217_p443_q97_p479_next_rank_later_prime_buckets_or_emit_rank_boundary`
- Recommended next action: `derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover_or_emit_boundary`
- Source rows accounted: 718
- Source next q-avoiding classes accounted: 170308883793
- Later-prime buckets: 15
- Later primes: 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 191, 193, 197, 199
- Later root children emitted: 340617767586
- Later q-avoiding classes emitted: 3652250197976151
- Survivor source rows: 0
- Survivor next q-avoiding classes: 0

## Boundary Buckets

- q127: 85 source rows, 12889665336 source next q-avoiding classes, 25779330672 later root children, 207871632873672 later q-avoiding classes.
- q131: 126 source rows, 22937421774 source next q-avoiding classes, 45874843548 later root children, 393583220220066 later q-avoiding classes.
- q137: 122 source rows, 25729757450 source next q-avoiding classes, 51459514900 later root children, 482870358064150 later q-avoiding classes.
- q139: 122 source rows, 29208842018 source next q-avoiding classes, 58417684036 later root children, 564285618945742 later q-avoiding classes.
- q149: 87 source rows, 21176915391 source next q-avoiding classes, 42353830782 later root children, 470106344764809 later q-avoiding classes.
- q151: 64 source rows, 18450102856 source next q-avoiding classes, 36900205712 later root children, 420643895013944 later q-avoiding classes.
- q157: 50 source rows, 15688365626 source next q-avoiding classes, 31376731252 later root children, 386671147584022 later q-avoiding classes.
- q163: 27 source rows, 8908531251 source next q-avoiding classes, 17817062502 later root children, 236672949745317 later q-avoiding classes.
- q167: 12 source rows, 4283704500 source next q-avoiding classes, 8567409000 later root children, 119459667391500 later q-avoiding classes.
- q173: 8 source rows, 3580278416 source next q-avoiding classes, 7160556832 later root children, 107146992155632 later q-avoiding classes.
- q179: 8 source rows, 3160334024 source next q-avoiding classes, 6320668048 later root children, 101253941794936 later q-avoiding classes.
- q191: 3 source rows, 1849129299 source next q-avoiding classes, 3698258598 later root children, 67454387698221 later q-avoiding classes.
- q193: 1 source rows, 969137593 source next q-avoiding classes, 1938275186 later root children, 36097467926471 later q-avoiding classes.
- q197: 1 source rows, 433334041 source next q-avoiding classes, 866668082 later root children, 16816394129087 later q-avoiding classes.
- q199: 2 source rows, 1043364218 source next q-avoiding classes, 2086728436 later root children, 41316179668582 later q-avoiding classes.

## Compression Audit

Every stored row in the 15-bucket later-prime boundary has exactly two roots at its first later obstruction prime.
The shared two-root law emits rank children and a large q-avoiding boundary; it does not prove terminal closure of those children.
The buckets mix source next-prime supports unevenly, so this packet records the exact finite partition and hands off a whole-boundary q-avoiding batch cover instead of claiming one closed terminal family.

## Boundary

This packet accounts for every later-prime bucket emitted by the next-rank 13-bucket batch cover and turns the 15-bucket surface into an exact deterministic ranked boundary. It does not close the 340,617,767,586 later root children, the 3,652,250,197,976,151 later q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.

## Next Move

Run a whole-boundary q-avoiding batch cover over all 15 later-prime buckets, or emit an exact survivor/rank boundary if the batch cover does not close.
