# Problem 848 Tail-282 Alignment Obstruction Packet

- Representative: `137720141`
- Shared prefix: `7,32,57,82,132,182`
- Target continuation: `282`
- Comparison continuations: `332,432,782,832`
- Status: `mechanism_candidate_family_row_reconstructed`

## Mechanism Readout

- At representative 137720141, continuation 282 is blocked by 841, while comparison continuations 332,432,782,832 are squarefree.
- Target square divisor: `841`
- Comparisons stay squarefree: `true`

## Anchor Witnesses

- a=7: product+1=`964040988`, status=`non_squarefree`, square=`4`
- a=32: product+1=`4407044513`, status=`non_squarefree`, square=`529`
- a=57: product+1=`7850048038`, status=`non_squarefree`, square=`49`
- a=82: product+1=`11293051563`, status=`non_squarefree`, square=`9`
- a=132: product+1=`18179058613`, status=`non_squarefree`, square=`289`
- a=182: product+1=`25065065663`, status=`non_squarefree`, square=`121`

## Continuation Witnesses

- target 282: product+1=`38837079763`, status=`non_squarefree`, square=`841`
- comparison 332: product+1=`45723086813`, status=`squarefree`, square=`(none)`
- comparison 432: product+1=`59495100913`, status=`squarefree`, square=`(none)`
- comparison 782: product+1=`107697150263`, status=`squarefree`, square=`(none)`
- comparison 832: product+1=`114583157313`, status=`squarefree`, square=`(none)`

## Source Audit

- Family menu path exists: `true`
- Target representative in shared-prefix ledger: `false`
- Preceding ledger packet: `136702637`

## Reconstructed CRT

- Anchor class: `n == 137720141 mod 32631532164`; representative matches: `true`
- Target continuation class: `n == 137720141 mod 27443118549924`; representative matches: `true`

## Synthetic Family Rows

- Anchor-only tuple: `4, 23^2, 7^2, 9, 17^2, 11^2`
- With target continuation tuple: `4, 23^2, 7^2, 9, 17^2, 11^2, 29^2`

## Recovered Family Row

- Recovery status: `regenerated_tuple_rows_and_crt`
- Tuple key: `4, 23^2, 7^2, 9, 17^2, 11^2`
- Row formula: `n == 137720141 mod 32631532164`
- tuple 7: square=`4`, residue=`1`, expression=`n*7+1 == 0 mod 4`
- tuple 32: square=`529`, residue=`281`, expression=`n*32+1 == 0 mod 529`
- tuple 57: square=`49`, residue=`6`, expression=`n*57+1 == 0 mod 49`
- tuple 82: square=`9`, residue=`8`, expression=`n*82+1 == 0 mod 9`
- tuple 132: square=`289`, residue=`81`, expression=`n*132+1 == 0 mod 289`
- tuple 182: square=`121`, residue=`119`, expression=`n*182+1 == 0 mod 121`
- repair 282: squarefree=`false`, witnesses=`841`
- repair 332: squarefree=`true`, witnesses=`(none)`
- repair 432: squarefree=`true`, witnesses=`(none)`
- repair 782: squarefree=`true`, witnesses=`(none)`
- repair 832: squarefree=`true`, witnesses=`(none)`

## Target Witness Lift

- Status: `target_witness_subprogression_starts_at_representative`
- Anchor row formula: `n = 137720141 + 32631532164*t`
- Witness condition: `282*n + 1 == 0 mod 841`
- Row-index congruence: `t == 0 mod 841`
- Inside the recovered anchor row, the 841 witness for continuation 282 recurs exactly on t == 0 mod 841; the representative is the first element of that subprogression.
- Boundary: This lifts the witness to a named subprogression of the recovered class. It does not prove first structural unavoidability.

## Boundary

- Proves observed representative mechanism: `true`
- Regenerates family row: `true`
- Lifts target witness to recovered subprogression: `true`
- Proves first structural unavoidability: `false`
- Proves all-N: `false`
- Missing for promotion: Show that the 29^2 target obstruction is structurally first in the family-menu chronology, not only lifted to the recovered subprogression.
- Missing for promotion: Bind the class to bridge falsifiers so future frontier refreshes can promote or break the packet cleanly.

## Next Theorem Options

- `recover_representative_family_row` [done_regenerated]: Recover the missing family-menu row and singleton CRT packet for representative 137720141, or regenerate them locally from available frontier data.
- `lift_841_witness_to_class` [done_subprogression_lift]: Prove that the 29^2 witness for continuation 282 is forced across the recovered obstruction class.
- `prove_first_structural_unavoidability` [next]: Use family-menu chronology or a theorem-facing recurrence argument to show no earlier recovered class can occupy the 282/841 witness subprogression.
- `separate_282_from_leader_tails` [ready_bounded_mechanism]: Use the exact representative checks to keep the 282 obstruction claim narrow and separate from 332/432/782/832 leaderboard behavior.
