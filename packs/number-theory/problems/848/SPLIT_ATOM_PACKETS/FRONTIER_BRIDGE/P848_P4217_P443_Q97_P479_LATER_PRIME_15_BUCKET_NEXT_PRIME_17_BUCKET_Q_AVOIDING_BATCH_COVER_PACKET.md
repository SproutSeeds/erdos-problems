# P848 P4217 later-prime 15-bucket next-prime 17-bucket q-avoiding batch cover

- Status: `all_17_bucket_next_prime_q_avoiding_classes_have_later_square_obstruction_child`
- Target: `derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_or_emit_boundary`
- Recommended next action: `run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover`
- Source next-prime buckets: 17
- Source rows accounted: 718
- Source next q-avoiding classes accounted: 94524741190958970657
- Post-next buckets: 20
- Post-next prime range: 137..239
- Later root children emitted: 189049482381917941314
- Later q-avoiding rank classes: 2946810455708641575397311
- Survivor source rows: 0
- Survivor next q-avoiding classes: 0

## Post-Next Bucket Tokens

- q137: 20 source rows, 839352322695264980 source next q-avoiding classes, 1678704645390529960 later root children, 15752125040022037879660 later q-avoiding classes.
- q139: 58 source rows, 3054364200813414874 source next q-avoiding classes, 6108728401626829748 later root children, 59007261995514361950806 later q-avoiding classes.
- q149: 68 source rows, 4222360759911195055 source next q-avoiding classes, 8444721519822390110 later root children, 93732186509268619025945 later q-avoiding classes.
- q151: 99 source rows, 7877582640472469595 source next q-avoiding classes, 15755165280944939190 later root children, 179601006620131834296405 later q-avoiding classes.
- q157: 85 source rows, 8175198643013119357 source next q-avoiding classes, 16350397286026238714 later root children, 201494120954344352791979 later q-avoiding classes.
- q163: 79 source rows, 8691006259118894935 source next q-avoiding classes, 17382012518237789870 later root children, 230893963286011681738145 later q-avoiding classes.
- q167: 76 source rows, 9917370610130136364 source next q-avoiding classes, 19834741220260272728 later root children, 276565714204699112782868 later q-avoiding classes.
- q173: 76 source rows, 11833933994141803636 source next q-avoiding classes, 23667867988283607272 later root children, 354154142642681757414572 later q-avoiding classes.
- q179: 46 source rows, 8298281418822782998 source next q-avoiding classes, 16596562837645565996 later root children, 265868638377663144472922 later q-avoiding classes.
- q181: 36 source rows, 7433580879628261284 source next q-avoiding classes, 14867161759256522568 later root children, 243516676035742211402556 later q-avoiding classes.
- q191: 23 source rows, 5317503493549124687 source next q-avoiding classes, 10635006987098249374 later root children, 193977209941178519457073 later q-avoiding classes.
- q193: 15 source rows, 3300015282439742223 source next q-avoiding classes, 6600030564879484446 later root children, 122915669225033078580081 later q-avoiding classes.
- q197: 9 source rows, 2043472548813047961 source next q-avoiding classes, 4086945097626095922 later root children, 79301039201787952222527 later q-avoiding classes.
- q199: 7 source rows, 4039942141344799687 source next q-avoiding classes, 8079884282689599374 later root children, 159977668855112722805513 later q-avoiding classes.
- q211: 10 source rows, 3725930931322301818 source next q-avoiding classes, 7451861862644603636 later root children, 165874719131537554635542 later q-avoiding classes.
- q223: 4 source rows, 1719314617886621884 source next q-avoiding classes, 3438629235773243768 later root children, 85496358003648046425668 later q-avoiding classes.
- q227: 3 source rows, 1205548391905416195 source next q-avoiding classes, 2411096783810832390 later root children, 62118291989710380279765 later q-avoiding classes.
- q229: 1 source rows, 270080882503153729 source next q-avoiding classes, 540161765006307458 later root children, 14162771397582878395031 later q-avoiding classes.
- q233: 2 source rows, 1348200131374583186 source next q-avoiding classes, 2696400262749166372 later root children, 73189740531931997418382 later q-avoiding classes.
- q239: 1 source rows, 1211701041072836209 source next q-avoiding classes, 2423402082145672418 later root children, 69211151765039331421871 later q-avoiding classes.

## Mechanism

For every recorded row in the deterministic 17-bucket next-prime q-avoiding boundary, the previous next obstruction prime is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions from the prior first-obstruction classifications; the first later prime with roots of y*(y+delta)+1 modulo s^2 gives a row-uniform square-obstruction child for every descendant class of that row.

## Boundary

This packet batch-classifies the q-avoiding rank boundary emitted by the deterministic 17 next-prime buckets: all 94,524,741,190,958,970,657 source next q-avoiding classes have a row-uniform later square-obstruction child by prime 239. It does not close the 189,049,482,381,917,941,314 later root children, the 2,946,810,455,708,641,575,397,311 later q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.

## Next Move

Run convergence assembly after the 17-bucket next-prime q-avoiding batch cover and choose whether to compress the 20 post-next obstruction-prime buckets, prove a structural rank decrease, or emit a deterministic boundary for the enlarged q-avoiding rank surface.
