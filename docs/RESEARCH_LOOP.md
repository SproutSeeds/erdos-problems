# Research Loop

`erdos-problems` now carries the staged research loop that was proven out in the sunflower lab and refined by the `.gpd` flow in `longevity-research`.

## Runtime layout

Workspace runtime files live under `.erdos/`:
- `config.json`
- `state.json`
- `STATE.md`
- `QUESTION-LEDGER.md`
- `checkpoints/CHECKPOINTS.md`
- `checkpoints/CHECKPOINTS.json`
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
10. Sync checkpoints again at honest boundaries.

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

The seeded dossier now also includes starter-loop artifacts:
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

For sunflower compute lanes, ORP now sits above `breakthroughs`:
- `erdos sunflower status <id>` evaluates the packaged compute lane with `breakthroughs`
- the CLI surfaces the selected rung, dispatch action, and the reason compute is admissible
- this is compute governance and traceability, not an automatic compute launch

## Status ladder

The public package uses the same ladder we converged on in the lab:
- open problem
- active route
- route breakthrough
- problem solved

The key rule is that route breakthroughs are never silently inflated into solved-problem claims.
