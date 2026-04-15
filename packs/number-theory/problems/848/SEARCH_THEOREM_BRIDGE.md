# Problem 848 Search-Theorem Bridge

This note is the canonical bridge between the live `frontier-engine` search lane and the theorem-facing `erdos-problems` pack.

## Current state

- Shared-prefix failures frozen: `24` through `136702637`.
- Current family menu: `research/frontier-engine/experiments/p848-anchor-ladder/live-frontier-sync/2026-04-05/SIX_PREFIX_TWENTY_FOUR_FAMILY_MENU.json` with `280` rows and `25` matched known-family rows.
- Strongest completed structured tail: `332` clean through `250000000`.
- Current family-aware leader on the tested window: `432` with `26` repaired known packets and `242` repaired predicted-family rows.
- Next unmatched representative: `137720141`.
- `282` tail alignment: `matches` the next unmatched representative.
- Current top GPU tie class: `432, 782, 832`.

## Recent Packet Ledger

| n | Tuple | New Square Moduli | CRT Modulus |
| --- | --- | --- | --- |
| `90512581` | `4, 7^2, 11^2, 13^2, 19^2, 9` | `4, 49, 121, 169, 361, 9` | `-` |
| `102428617` | `2^7, 19^2, 13^2, 7^2, 17^2, 9` | `289` | `-` |
| `106393589` | `4, 37^2, 11^2, 9, 7^2, 17^2` | `1369` | `-` |
| `127484267` | `9, 17^2, 4, 29^2, 7^2, 11^2` | `841` | `-` |
| `127682743` | `131^2, 11^2, 2^6, 29^2, 13^2, 9` | `17161` | `-` |
| `136702637` | `4, 43^2, 11^2, 9, 7^3, 19^2` | `1849` | `-` |

## Tracked Tail Matrix

| Tail | Known Packets | Predicted Families | Effective Clean Through | Observed Status |
| --- | --- | --- | --- | --- |
| `157` | `16` | `110` | `19094394` | `fails` |
| `232` | `20` | `201` | `27949927` | `fails` |
| `282` | `25` | `244` | `137720140` | `fails` |
| `332` | `26` | `240` | `250050000` | `clean_through` |
| `382` | `26` | `240` | `250050000` | `unseen` |
| `432` | `26` | `242` | `250050000` | `unseen` |
| `782` | `26` | `242` | `250050000` | `unseen` |
| `832` | `26` | `242` | `250050000` | `unseen` |

## GPU Leaderboard

| Rank | Tail | Known Packets | Predicted Families | Effective Clean Through |
| --- | --- | --- | --- | --- |
| `1` | `432` | `26` | `242` | `250075000` |
| `2` | `782` | `26` | `242` | `250075000` |
| `3` | `832` | `26` | `242` | `250075000` |
| `4` | `332` | `26` | `240` | `250075000` |
| `5` | `382` | `26` | `240` | `250075000` |

## Theorem Hooks

- `next_unmatched_equals_282_failure`: supported | The next unmatched shared-prefix representative currently coincides with the known first failure of the 282 continuation.
- `completed_tail_vs_search_leader_split`: supported | The strongest completed structured tail remains 332, while the current family-aware search leader can move on the finite tested window.
- `repair_pool_not_closed`: supported | Recent shared-prefix packets introduced new square moduli into the live family menu, so the repaired local square pool is not yet closed.
- `top_repair_class_cluster`: supported | The current top continuation class shares the same repaired-known, repaired-predicted, and tested-clean-through profile on the live finite window.

## Refresh

```bash
python3 research/frontier-engine/src/frontier_engine/cli.py export-p848-theorem-bridge
```
