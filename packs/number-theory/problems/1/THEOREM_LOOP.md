# Erdos Problem #1 Theorem Loop

This note is the generic theorem-loop surface for the problem pack. It keeps theorem-facing route state visible even when no richer search bridge exists yet.

## Current State

- Theorem loop mode: `baseline`.
- Active route: `distinct_subset_sum_lower_bound`.
- Current claim surface: `route_scaffolding`.
- Repo status: `cataloged`; site status: `open`.
- Route breakthrough: `no`.
- Problem solved: `no`.
- Open problem: `yes`.
- Theorem module: `(none)`.
- Route summary: Keep the problem centered on the exponential-growth lower-bound route implied by distinct subset sums.
- Next honest move: Record the first reduction and checkpoint it without overclaiming theorem progress.

## Theorem Hooks

- `active_route_recorded`: supported | The pack records an active route, currently `distinct_subset_sum_lower_bound`.
- `ready_atom_present`: supported | The live route already has a ready atom, `N1.G1.A1`, which can feed the theorem lane.
- `frontier_note_present`: supported | The pack already carries a frontier note that can anchor theorem-facing updates.

## Theorem Agenda

- `promote_ready_atom`: ready | Turn ready atom `N1.G1.A1` into the next theorem-facing checkpoint. | Record the first reduction and checkpoint it without overclaiming theorem progress.
- `tighten_active_route_claim`: ready | Compress the active route `distinct_subset_sum_lower_bound` into the next honest theorem-facing claim unit. | Record the first reduction and checkpoint it without overclaiming theorem progress.

## Commands

- Problem surface: `erdos problem show 1`
- Canonical theorem loop: `erdos problem theorem-loop 1`
- Refresh theorem loop: `erdos problem theorem-loop-refresh 1`
- Problem artifacts: `erdos problem artifacts 1`
- Cluster status: `erdos number-theory status 1`
- Cluster frontier: `erdos number-theory frontier 1`

## Sources

- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/THEOREM_LOOP.json`
- theoremLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/THEOREM_LOOP.md`
- contextPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/context.yaml`
- routePacketPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/ROUTE_PACKET.yaml`
- frontierNotePath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/FRONTIER_NOTE.md`
- opsDetailsPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/OPS_DETAILS.yaml`
