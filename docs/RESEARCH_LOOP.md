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
- `registry/preflight/`
- `registry/compute/`

## Core loop

1. Select or bootstrap a problem.
2. Sync state.
3. Run preflight.
4. Set continuation mode.
5. Sync checkpoints.
6. Pull or scaffold artifacts.
7. Work the active route.
8. Sync checkpoints again at honest boundaries.

## Commands

```bash
erdos problem use 857
erdos state sync
erdos preflight
erdos continuation use route
erdos checkpoints sync
erdos workspace show
```

## Status ladder

The public package uses the same ladder we converged on in the lab:
- open problem
- active route
- route breakthrough
- problem solved

The key rule is that route breakthroughs are never silently inflated into solved-problem claims.
