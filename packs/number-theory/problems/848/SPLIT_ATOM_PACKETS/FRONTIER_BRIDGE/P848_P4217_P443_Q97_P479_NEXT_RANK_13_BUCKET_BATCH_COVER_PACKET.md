# P848 P4217 next-rank 13-bucket batch cover

- Status: `all_13_bucket_next_rank_q_avoiding_classes_have_later_square_obstruction_child`
- Target: `derive_p848_p4217_p443_q97_p479_next_rank_13_bucket_batch_cover_or_emit_boundary`
- Recommended next action: `run_p848_convergence_assembly_after_next_rank_13_bucket_batch_cover`
- Source q-bucket tokens: 13
- Source rows accounted: 718
- Source next q-avoiding classes accounted: 170308883793
- Later-prime buckets: 15
- Later-prime range: 127..199
- Later root children emitted: 340617767586
- Later q-avoiding rank classes: 3652250197976151
- Survivor source rows: 0
- Survivor next q-avoiding classes: 0

## Later Bucket Tokens

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

## Mechanism

For every recorded row in the deterministic 13-bucket rank boundary, the current next-obstruction prime is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions from the previous first-obstruction classification; the first later prime with roots of y*(y+delta)+1 modulo s^2 gives a row-uniform square-obstruction child for every next q-avoiding descendant class of that row.

## Boundary

This packet batch-classifies the next q-avoiding rank boundary emitted by the deterministic 13-bucket packet: all 170,308,883,793 source next q-avoiding classes have a row-uniform later square-obstruction child by prime 199. It does not close the 340,617,767,586 later root children, the 3,652,250,197,976,151 later q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.

## Next Move

Run convergence assembly after the next-rank 13-bucket batch cover and choose whether to compress the 15 later-obstruction-prime buckets, prove a structural rank decrease, or emit a deterministic boundary for the enlarged later q-avoiding rank surface.
