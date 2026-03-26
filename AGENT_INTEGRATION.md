# ORP Agent Integration

Use this when an agent is working inside an `erdos-problems` workspace.

## Core Rule

Do not let local route progress masquerade as global problem closure.

## Minimum Working Loop

1. select or seed a problem
2. sync ORP kit
3. sync state
4. run preflight
5. sync checkpoints
6. work the next honest move

## Canonical Artifact Boundary

Evidence belongs in:
- `problems/<id>/`
- pack artifacts under `packs/`
- workspace pulls and scaffolds under `.erdos/`

Protocol files and ORP templates are process scaffolding only.
