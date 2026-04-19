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
- apply Abstract Before Expanding before branch/search/compute/API/paid expansion; name the represented family, collapse theorem object, tool route, and writeback target before making another piece
- run worktree hygiene during autonomous delegation; classify, refresh, or block dirty paths instead of letting unowned artifacts accumulate

## Research API And Paid-Call Guard

- `erdos orp research ...` defaults to planning-only research artifacts that do not call paid APIs.
- A live ORP/OpenAI call requires both `--execute` and `--allow-paid`, unless the operator has intentionally set `ERDOS_ORP_RESEARCH_ALLOW_PAID=1` for the current session.
- The local daily live-run cap defaults to 10 and is controlled by `ERDOS_ORP_RESEARCH_DAILY_LIMIT`; setting it to `0` disables paid research calls.
- The local daily research API budget defaults to `$5` and is controlled by `ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT`; setting it to `0` disables paid research spend.
- The guard reserves a conservative local estimate before each live call: `$1` for a normal research ask and `$0.05` for the smoke check, unless `ERDOS_ORP_RESEARCH_ESTIMATED_COST_USD` overrides it. If ORP reports cost telemetry, the usage ledger records that value; otherwise it records the local estimate.
- This is a local agent/workspace budget guard, not an upstream provider billing hard cap.
- Check the local usage ledger with `erdos orp research usage --json` before proposing another live call.
- Use live research at high-leverage source-audit, theorem-wedge, external-reference, or repeated-local-stall moments; do not use it for routine local tests, deterministic compute, or broad fishing.
- Treat research API output as discovery/source-audit material. It becomes mathematical evidence only after it is written back as an audited claim, verification record, proof packet, exact certificate, or canonical dossier update.
- Agents must prepare an approval packet instead of running a live paid call when the user has not explicitly approved that paid action.

## Workspace ORP Kit

The CLI syncs this protocol into `.erdos/orp/`:
- `PROTOCOL.md`
- `AGENT_INTEGRATION.md`
- `templates/CLAIM.md`
- `templates/VERIFICATION_RECORD.md`
- `templates/FAILED_TOPIC.md`

Use `erdos orp sync` to refresh the workspace copy explicitly.
