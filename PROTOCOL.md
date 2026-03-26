# Open Research Protocol

`erdos-problems` ships a bundled ORP kit so every workspace can start with the same claim hygiene and verification frame.

## Canonical Truth

- Public problem metadata comes from the upstream Erdős snapshot plus the local canonical dossier.
- Pack context, route packets, and workspace state guide the loop but do not silently upgrade global problem status.
- ORP process files are protocol tools, not mathematical evidence.

## Claim Levels

- `Exact`
- `Verified`
- `Heuristic`
- `Conjecture`

When unsure, downgrade rather than overclaim.

## Required Discipline

- keep open problem / active route / route breakthrough / problem solved distinct
- record verification hooks for exact or verified claims
- preserve failed paths as useful artifacts, not invisible dead ends
- keep route claims tied to canonical dossier and pack artifacts

## Workspace ORP Kit

The CLI syncs this protocol into `.erdos/orp/`:
- `PROTOCOL.md`
- `AGENT_INTEGRATION.md`
- `templates/CLAIM.md`
- `templates/VERIFICATION_RECORD.md`
- `templates/FAILED_TOPIC.md`

Use `erdos orp sync` to refresh the workspace copy explicitly.
