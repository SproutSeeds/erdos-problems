# Erdos Problem #857 Theorem Loop

This note is the generic theorem-loop surface for the problem pack. It keeps theorem-facing route state visible even when no richer search bridge exists yet.

## Current State

- Theorem loop mode: `baseline`.
- Active route: `anchored_selector_linearization`.
- Current claim surface: `frontier_supported_route`.
- Repo status: `active`; site status: `open`.
- Route breakthrough: `yes`.
- Problem solved: `no`.
- Open problem: `yes`.
- Theorem module: `sunflower-coda/repo/sunflower_lean/SunflowerLean/ObstructionExport.lean`.
- Route summary: Export the live anchored-selector helper stack into a route-facing leaf that remains honest about the open-problem boundary.
- Next honest move: Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.

## Theorem Hooks

- `active_route_recorded`: supported | The pack records an active route, currently `anchored_selector_linearization`.
- `theorem_module_registered`: supported | A theorem module is already registered for the active route: `sunflower-coda/repo/sunflower_lean/SunflowerLean/ObstructionExport.lean`.
- `ready_atom_present`: supported | The live route already has a ready atom, `T10.G3.A2`, which can feed the theorem lane.
- `frontier_note_present`: supported | The pack already carries a frontier note that can anchor theorem-facing updates.

## Theorem Agenda

- `promote_ready_atom`: ready | Turn ready atom `T10.G3.A2` into the next theorem-facing checkpoint. | Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.
- `stabilize_theorem_module_boundary`: ready | Align the active route with theorem module `sunflower-coda/repo/sunflower_lean/SunflowerLean/ObstructionExport.lean` and freeze its public claim boundary. | The current claim surface is `frontier_supported_route`, so the next theorem move should sharpen what that module actually certifies.
- `tighten_active_route_claim`: ready | Compress the active route `anchored_selector_linearization` into the next honest theorem-facing claim unit. | Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.

## Commands

- Problem surface: `erdos problem show 857`
- Canonical theorem loop: `erdos problem theorem-loop 857`
- Refresh theorem loop: `erdos problem theorem-loop-refresh 857`
- Problem artifacts: `erdos problem artifacts 857`
- Cluster status: `erdos sunflower status 857`
- Cluster frontier: `erdos sunflower frontier 857`

## Sources

- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/THEOREM_LOOP.json`
- theoremLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/THEOREM_LOOP.md`
- contextPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/context.yaml`
- routePacketPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/ROUTE_PACKET.yaml`
- frontierNotePath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/FRONTIER_NOTE.md`
- opsDetailsPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/OPS_DETAILS.yaml`
