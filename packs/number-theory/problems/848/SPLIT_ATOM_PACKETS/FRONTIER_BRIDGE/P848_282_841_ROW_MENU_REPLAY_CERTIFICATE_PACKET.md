# Problem 848 282/841 Row-Menu Replay Certificate

Generated: 2026-04-17T09:11:31Z

## Status

Status: `row_level_family_menu_source_restored_and_replayed`.

The raw `SIX_PREFIX_TWENTY_FOUR` family menu has been restored from the local `output/frontier-engine-local` mirror and replayed against the 282/841 row.

## Restored Source

- Raw menu: `output/frontier-engine-local/p848-anchor-ladder/live-frontier-sync/2026-04-05/SIX_PREFIX_TWENTY_FOUR_FAMILY_MENU.json`
- Family rows: `280`
- Known-failure matches: `25`
- Known shared-prefix failures: `24`
- Representatives sorted: `true`

This supersedes only the earlier local raw-menu-source absence claim. The generator command is still not restored.

## Chronology Replay

- First unmatched family index: `25`
- First unmatched representative: `137720141`
- First 282 failure index: `25`
- Prior 282 failure count: `0`
- Prior known-failure match count: `25`

Scanning the restored menu in representative order finds no earlier row whose 282 repair is square-blocked; the first such 282 row is family index 25 at n=137720141.

## Target Row

- Tuple key: `4, 23^2, 7^2, 9, 17^2, 11^2`
- Target continuation: `282`
- Target value: `38837079763`
- Witness square: `841`
- Squarefree: `false`

Comparison repair rows at anchors `157, 232, 332, 382, 432, 782, 832` remain available in the packet for theorem-side audits.

## Activation Replay

- Checker: `p848_132_activation_row_certificate_checker_v1`
- Status: `passed`
- Checked rows: `17`
- Pass/fail: `17/0`
- Target row status: `passed`

## Claims

- Restores raw family-menu source: `true`
- Proves row-level menu chronology for the restored menu: `true`
- Proves the target is the first 282 failure in the restored menu: `true`
- Proves finite-menu activation replay: `true`
- Proves universal recurrence: `false`
- Proves all-N closure: `false`

## Boundary

This packet closes the restored finite-menu chronology boundary for the 282/841 row. It does not regenerate the menu from first principles, prove a recurrence for all future rows, close the p4217 complement, or decide Problem 848.

## Next Action

`formalize_top_repair_class_mechanism`

Use the restored finite-menu replay certificate as closed evidence for the 282/841 row, then formalize the top repair-class mechanism named by the activation replay decision without reopening endpoint selector descent.

## Verification

`node --test test/p848-282-alignment-obstruction-packet.test.js`
