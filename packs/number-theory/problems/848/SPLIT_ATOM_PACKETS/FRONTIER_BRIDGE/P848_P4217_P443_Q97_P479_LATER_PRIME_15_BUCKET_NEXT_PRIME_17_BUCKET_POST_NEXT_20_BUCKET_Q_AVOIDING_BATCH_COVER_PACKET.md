# P848 P4217 later-prime 15-bucket next-prime 17-bucket post-next 20-bucket q-avoiding batch cover

- Status: `all_20_bucket_post_next_q_avoiding_classes_have_later_square_obstruction_child`
- Target: `derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover_or_emit_boundary`
- Recommended next action: `run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover`
- Source post-next buckets: 20
- Source rows accounted: 718
- Source post-next q-avoiding classes accounted: 2946810455708641575397311
- Successor buckets: 22
- Successor prime range: 139..263
- Successor root children emitted: 5893620911417283150794622
- Successor q-avoiding rank classes: 111172518226866898571161320153
- Survivor source rows: 0
- Survivor post-next q-avoiding classes: 0

## Successor Bucket Tokens

- q139: 6 source rows, 4725637512006611363898 source post-next q-avoiding classes, 9451275024013222727796 successor root children, 91294591094455724939145462 successor q-avoiding classes.
- q149: 37 source rows, 35217541143700389825659 source post-next q-avoiding classes, 70435082287400779651318 successor root children, 781794195849004953739804141 successor q-avoiding classes.
- q151: 46 source rows, 55017652384272146351727 source post-next q-avoiding classes, 110035304768544292703454 successor root children, 1254347456709020664673023873 successor q-avoiding classes.
- q157: 78 source rows, 128113813555682804177370 source post-next q-avoiding classes, 256227627111365608354740 successor root children, 3157621162706914074559638390 successor q-avoiding classes.
- q163: 85 source rows, 170954053841343132395315 source post-next q-avoiding classes, 341908107682686264790630 successor root children, 4541736348402962998346333605 successor q-avoiding classes.
- q167: 85 source rows, 212136562976080552654139 source post-next q-avoiding classes, 424273125952161105308278 successor root children, 5915852331713958371865974293 successor q-avoiding classes.
- q173: 74 source rows, 224177175878283393674110 source post-next q-avoiding classes, 448354351756566787348220 successor root children, 6708950342509387122485089970 successor q-avoiding classes.
- q179: 77 source rows, 307798971075882376935283 source post-next q-avoiding classes, 615597942151764753870566 successor root children, 9861571234300195474629532037 successor q-avoiding classes.
- q181: 55 source rows, 246375734372590544224577 source post-next q-avoiding classes, 492751468745181088449154 successor root children, 8071022682311693638252917943 successor q-avoiding classes.
- q191: 44 source rows, 248553145791906763016644 source post-next q-avoiding classes, 497106291583813526033288 successor root children, 9066970205342966808084156476 successor q-avoiding classes.
- q193: 32 source rows, 194133894492931695542248 source post-next q-avoiding classes, 388267788985863391084496 successor root children, 7230905168178226863862111256 successor q-avoiding classes.
- q197: 31 source rows, 210369056368096055548121 source post-next q-avoiding classes, 420738112736192111096242 successor root children, 8163791970476703627655931647 successor q-avoiding classes.
- q199: 18 source rows, 135137273852783154266286 source post-next q-avoiding classes, 270274547705566308532572 successor root children, 5351300907296360125790659314 successor q-avoiding classes.
- q211: 15 source rows, 148854773366620573587681 source post-next q-avoiding classes, 297709546733241147175362 successor root children, 6626865655508581315549970439 successor q-avoiding classes.
- q223: 15 source rows, 180046784240798558112153 source post-next q-avoiding classes, 360093568481597116224306 successor root children, 8953186439942189899243032231 successor q-avoiding classes.
- q227: 8 source rows, 140208788287293497341768 source post-next q-avoiding classes, 280417576574586994683536 successor root children, 7224538234079372037529279736 successor q-avoiding classes.
- q229: 2 source rows, 51416015243809534649782 source post-next q-avoiding classes, 102832030487619069299564 successor root children, 2696204423370128187499918298 successor q-avoiding classes.
- q233: 2 source rows, 26575880826932951069542 source post-next q-avoiding classes, 53151761653865902139084 successor root children, 1442724842451709114712226554 successor q-avoiding classes.
- q239: 4 source rows, 88704517384377733995068 source post-next q-avoiding classes, 177409034768755467990136 successor root children, 5066713328478271788064289092 successor q-avoiding classes.
- q241: 1 source rows, 15629825591859901233287 source post-next q-avoiding classes, 31259651183719802466574 successor root children, 907764640549631203728075673 successor q-avoiding classes.
- q251: 1 source rows, 69211151765039331421871 source post-next q-avoiding classes, 138422303530078662843742 successor root children, 4360233350045712840246451129 successor q-avoiding classes.
- q263: 2 source rows, 53452205756349874010782 source post-next q-avoiding classes, 106904411512699748021564 successor root children, 3697128715549451735703758594 successor q-avoiding classes.

## Mechanism

For every recorded row in the deterministic 20-bucket post-next q-avoiding boundary, the previous post-next obstruction prime is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions from the prior first-obstruction classifications; the first later prime with roots of y*(y+delta)+1 modulo s^2 gives a row-uniform square-obstruction child for every descendant class of that row.

## Boundary

This packet batch-classifies the q-avoiding rank boundary emitted by the deterministic 20 post-next buckets: all 2,946,810,455,708,641,575,397,311 source post-next q-avoiding classes have a row-uniform later square-obstruction child by prime 263. It does not close the 5,893,620,911,417,283,150,794,622 successor root children, the 111,172,518,226,866,898,571,161,320,153 successor q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.

## Next Move

Run convergence assembly after the 20-bucket post-next q-avoiding batch cover and choose whether to compress the 22 successor obstruction-prime buckets, prove a structural rank decrease, or emit a deterministic boundary for the enlarged q-avoiding rank surface.
