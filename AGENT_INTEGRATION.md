# ORP Agent Integration

Use this when an agent is working inside an `erdos-problems` workspace.

## Core Rule

Do not let local route progress masquerade as global problem closure.

Do not let research API availability masquerade as permission to spend money.

## Minimum Working Loop

1. select or seed a problem
2. sync ORP kit
3. sync state
4. run preflight
5. sync checkpoints
6. work the next honest move

## Abstract Before Expanding

Every generated task list exposes `agentFlow.modePolicy.abstractBeforeExpand`. Use it before expanding a branch, search lane, compute sweep, API call, paid call, or remote compute rung.

The gate is not a request to keep planning forever. It must produce one of these outcomes:
- collapse the work into a theorem object, recombination path, finite partition, decreasing rank, bulk cover, or impossibility theorem
- route the named unlock to local proof, local compute, budget-guarded API/source audit, or an approval packet
- allow finite expansion only after recording the represented family, the decreasing token, and the blocker boundary if the step fails

If the gate changes the plan, write the abstraction into canonical artifacts and refresh the task list. Chat-only abstraction does not count.

## Worktree Hygiene

Autonomous delegation should not leave a large unclassified dirty worktree. Use `erdos workspace hygiene --json` before long delegation, after material writeback, before paid/API/remote compute, and whenever the dirty set grows unexpectedly.

The hygiene pass is non-destructive:
- classify dirty paths as canonical artifacts, source/test/docs changes, runtime research artifacts, scratch/output, or unclassified
- refresh generated surfaces when they are stale partial outputs
- convert useful scratch into canonical artifacts before relying on it
- pause with a blocker instead of continuing if dirty paths are unrelated to the active step or remain unclassified
- never run destructive cleanup, reset, checkout, or deletion without explicit approval

## Research API Discipline

- Planning-only research commands are safe defaults: `erdos orp research status --json`, `erdos orp research usage --json`, and `erdos orp research ask <problem-id> --question "<question>" --json`.
- Live OpenAI-backed research calls require explicit paid-call intent through `--execute --allow-paid` or `ERDOS_ORP_RESEARCH_ALLOW_PAID=1`.
- Agents should not add `--execute`, add `--allow-paid`, or set `ERDOS_ORP_RESEARCH_ALLOW_PAID` unless the user has explicitly approved that paid call path for the current task.
- Once a paid-call path is approved, use live research when it can unlock a source audit, theorem wedge, external reference check, or repeated local-stall diagnosis. Do not spend budget on routine local tests, deterministic compute, or broad fishing.
- If a live call looks valuable but approval is missing, prepare a short approval packet with the problem id, research question, profile or profile file, expected value, current `erdos orp research usage --json` count/budget, and exact command.
- Respect `ERDOS_ORP_RESEARCH_DAILY_LIMIT`; a value of `0` means live paid research is disabled even if the command contains `--allow-paid`.
- Respect `ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT`; it defaults to `$5/day`, and a value of `0` means live paid research spend is disabled even if the command contains `--allow-paid`.
- Remember that this is a local agent/workspace budget guard, not an upstream provider billing hard cap.

## Canonical Artifact Boundary

Evidence belongs in:
- `problems/<id>/`
- pack artifacts under `packs/`
- workspace pulls and scaffolds under `.erdos/`

Protocol files and ORP templates are process scaffolding only.
