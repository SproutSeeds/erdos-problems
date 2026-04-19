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
- `registry/research/openai-live-usage.json`

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
10. Run worktree hygiene at delegation boundaries and after material writeback.
11. Before expanding a branch, search lane, compute sweep, API call, or paid rung, apply the Abstract Before Expanding gate.
12. If the pack admits a local scout, run it intentionally and checkpoint the artifact.
13. Sync checkpoints again at honest boundaries.

## Worktree Hygiene

Use `erdos workspace hygiene --json` as a non-destructive checkpoint for autonomous work. It classifies dirty paths into canonical problem artifacts, source/test/docs changes, runtime research artifacts, scratch/output artifacts, and unclassified paths.

Delegates should use this checkpoint to self-clean and self-heal:
- refresh generated surfaces after material work
- convert useful scratch into canonical artifacts before relying on it
- keep temporary experiments out of tracked source paths
- pause with a blocker when dirty paths are unrelated to the active step or remain unclassified
- avoid destructive cleanup unless explicitly approved

## Abstract Before Expanding

The generated task list includes a hardcoded `abstract-before-expand` gate. Agents should run it before opening more concrete work whenever the next move would expand the surface: another sibling case, selector, search lane, compute sweep, API call, local/remote GPU rung, or paid research call.

The gate must answer:
- what larger family the concrete case represents
- what theorem object would collapse that family
- whether a finite partition, decreasing rank, bulk cover, impossibility theorem, source theorem, or recombination path is available
- whether the next route should be local proof, local compute, budget-guarded API/source audit, paid compute approval, or a blocker packet
- what canonical artifact or task-list writeback preserves the abstraction

Expansion is allowed only when the gate records why the concrete step is finite, cheaper than the collapse theorem this turn, and paired with a decreasing token or blocker boundary.

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

For ORP-backed research API work:
- `erdos orp research status --json` shows whether ORP research and OpenAI reachability are configured
- `erdos orp research ask <problem-id> --question "<question>" --json` creates a planning-only research artifact without paid API execution
- `erdos orp research openai-check --json` creates the smoke-test profile without calling OpenAI
- `erdos orp research usage --json` shows the local paid-call usage ledger and daily cap
- live calls require explicit paid-call intent with `--execute --allow-paid`, or the session env `ERDOS_ORP_RESEARCH_ALLOW_PAID=1`
- use live research when it can unlock a source audit, theorem wedge, external reference check, or repeated local-stall diagnosis; avoid it for routine tests, deterministic local compute, or broad fishing
- `ERDOS_ORP_RESEARCH_DAILY_LIMIT` defaults to `10`; set it to `0` to disable paid research calls for the workspace/session
- `ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT` defaults to `$5`; set it to `0` to disable paid research spend for the workspace/session
- `ERDOS_ORP_RESEARCH_ESTIMATED_COST_USD` overrides the local per-call estimate; otherwise the guard reserves `$1` for a normal research ask and `$0.05` for the smoke check before launching
- this is a local agent/workspace budget guard, not an upstream provider billing hard cap
- research API outputs are discovery/source-audit artifacts until converted into audited claims, verification records, proof packets, exact certificates, or canonical dossier updates

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
