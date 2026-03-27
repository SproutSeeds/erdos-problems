# Research Loop

`erdos-problems` includes a staged research loop for selecting problems, syncing workspace state, and recording checkpoints.

## Runtime layout

Workspace runtime files live under `.erdos/`:
- `config.json`
- `state.json`
- `STATE.md`
- `QUESTION-LEDGER.md`
- `checkpoints/CHECKPOINTS.md`
- `checkpoints/CHECKPOINTS.json`
- `runs/<run-id>/`
- `archives/<id>/`
- `orp/PROTOCOL.md`
- `orp/AGENT_INTEGRATION.md`
- `orp/templates/`
- `registry/preflight/`
- `registry/compute/`

## Core loop

1. Select or bootstrap a problem.
2. Sync ORP.
3. Sync state.
4. Run preflight.
5. Set continuation mode.
6. Sync checkpoints.
7. Pull or scaffold artifacts.
8. Review public status and agent websearch brief if the problem was freshly seeded.
9. Work the active route.
10. If the pack admits a local scout, run it intentionally and checkpoint the artifact.
11. Sync checkpoints again at honest boundaries.

## Commands

```bash
erdos problem use 857
erdos orp sync
erdos state sync
erdos preflight
erdos continuation use route
erdos checkpoints sync
erdos workspace show
```

For problems that are not yet packaged as native dossiers, the loop can start with one-step self-seeding:

```bash
erdos seed problem 25 --cluster number-theory
erdos preflight
erdos continuation use route
erdos checkpoints sync
```

That flow writes the local dossier into `.erdos/seeded-problems/<id>/`, makes it visible to the atlas inside the current workspace, and immediately syncs the same state/checkpoint machinery used by packaged dossiers.

The seeded dossier also includes starter-loop artifacts:
- `AGENT_START.md`
- `ROUTES.md`
- `CHECKPOINT_NOTES.md`
- `PUBLIC_STATUS_REVIEW.md`
- `AGENT_WEBSEARCH_BRIEF.md`

The ORP kit travels with the workspace too:
- `PROTOCOL.md`
- `AGENT_INTEGRATION.md`
- `templates/CLAIM.md`
- `templates/VERIFICATION_RECORD.md`
- `templates/FAILED_TOPIC.md`

For sunflower compute lanes, ORP sits above `breakthroughs`:
- `erdos sunflower status <id>` evaluates the packaged compute lane with `breakthroughs`
- `erdos sunflower board <id>` exposes the packaged atomic or bridge board for the active sunflower problem
- `erdos sunflower ready <id>` exposes the dependency-satisfied ready queue for the packaged board
- `erdos sunflower ladder <id>` exposes the first-principles ladder for the packaged board
- `erdos sunflower frontier <id>` exposes the compressed frontier view for the active board
- `erdos sunflower routes <id>` exposes the public route table for the packaged board
- `erdos sunflower tickets <id>` exposes the ticket table for the packaged board
- `erdos sunflower route <id> <route-id>` exposes the deeper public route packet
- `erdos sunflower ticket <id> <ticket-id>` exposes the deeper public ticket packet
- `erdos sunflower atom <id> <atom-id>` exposes the deeper public atom packet
- `erdos sunflower compute run <id>` writes a governed local-scout bundle when the packet admits it
- the CLI surfaces the selected rung, dispatch action, and the reason compute is admissible
- this is compute governance and traceability, not an automatic paid or unbounded compute launch

For number-theory starter-pack problems:
- `erdos number-theory status <id>` exposes the current route/frontier posture
- `erdos number-theory frontier <id>` compresses the honest next move
- `erdos number-theory routes <id>` exposes the small route table
- `erdos number-theory tickets <id>` exposes the current ticket/archive packet
- this layer is intentionally lighter than the sunflower pack

For solved problems:
- `erdos archive show <id>` exposes archival posture
- `erdos archive scaffold <id>` creates a method-exemplar bundle under `.erdos/archives/<id>/`

## Status ladder

The public package uses this ladder:
- open problem
- active route
- route breakthrough
- problem solved

The key rule is that route breakthroughs are never silently inflated into solved-problem claims.
