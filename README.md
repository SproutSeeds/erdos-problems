# erdos-problems

CLI atlas and staged research harness for Paul Erdos problems.

## Install

```bash
npm install -g erdos-problems
```

Official package:
- `erdos-problems`

Official binary:
- `erdos`

## Current shape

- atlas layer with canonical local `problems/<id>/problem.yaml` records
- bundled upstream snapshot from `teorth/erdosproblems`
- bundled ORP kit with protocol and templates for claim hygiene
- workspace `.erdos/` state for active-problem selection, upstream refreshes, scaffolds, and pull bundles
- sunflower cluster as the first deep harness pack
- quartet-aware sunflower context for `20`, `536`, `856`, and `857`
- packaged compute-lane metadata for deep sunflower problems, surfaced directly in the CLI
- seeded atlas now includes open and solved problems beyond sunflower
- unseeded problems can still be pulled into a workspace from the bundled upstream snapshot

Seeded problems:
- `1`, `2`, `3`, `4`, `5`, `6`, `7`, `18`, `19`, `20`, `21`, `22`, `89`, `536`, `542`, `856`, `857`, `1008`

Native dossier count:
- `18`

## First-run flow

```bash
erdos problem list --cluster sunflower
erdos bootstrap problem 857
erdos problem artifacts 857 --json
erdos sunflower status 857
erdos dossier show 857
```

For an unseeded problem, the one-step self-seeding flow is now:

```bash
erdos seed problem 25 --cluster number-theory
erdos problem show 25
erdos workspace show
```

What `bootstrap` does:
- sets the active workspace problem
- syncs the bundled ORP workspace kit into `.erdos/orp/`
- scaffolds the canonical dossier files into `.erdos/scaffolds/<id>/`
- includes the upstream record when a bundled or workspace snapshot is available
- copies pack-specific context and compute packets when the problem has them
- gives an agent a ready-to-read local artifact bundle immediately after install

What `seed` does:
- creates a pull bundle for any problem in the upstream snapshot
- defaults to a live site snapshot plus a public-search review bundle
- treats a problem as seed-admissible only when the public site says `open`, unless you intentionally pass `--allow-non-open`
- promotes that bundle into `.erdos/seeded-problems/<id>/`
- auto-selects the problem in the workspace
- syncs the bundled ORP workspace kit into `.erdos/orp/`
- syncs the staged research loop state and checkpoint shelf
- makes the new dossier visible to the atlas commands immediately inside that workspace
- writes richer starter artifacts:
  - `AGENT_START.md`
  - `ROUTES.md`
  - `CHECKPOINT_NOTES.md`
  - `PUBLIC_STATUS_REVIEW.md`
  - `AGENT_WEBSEARCH_BRIEF.md`

## Pull lanes

For any problem number in the upstream snapshot, you can create a workspace bundle even if the problem is not yet seeded locally:

```bash
erdos pull problem 857
erdos pull artifacts 857
erdos pull literature 857
erdos pull problem 999 --include-site --include-public-search
erdos pull problem 999 --refresh-upstream
```

What the pull lanes do:
- `erdos pull problem <id>` creates `.erdos/pulls/<id>/` with:
  - a root pull manifest
  - `artifacts/`
  - `literature/`
- `erdos pull artifacts <id>` creates only the artifact lane
- `erdos pull literature <id>` creates only the literature lane
- when a problem is locally seeded, the artifact lane includes the canonical dossier, pack context, and compute packets
- when `--include-site` is used, the literature lane can include a live site snapshot and plain-text extract
- when `--include-public-search` is used, the literature lane also includes:
  - `PUBLIC_STATUS_REVIEW.md`
  - `PUBLIC_STATUS_REVIEW.json`
  - `AGENT_WEBSEARCH_BRIEF.md`

## Maintainer seeding

To turn a pulled bundle into a new canonical dossier in the repo:

```bash
erdos maintainer seed problem 25 \
  --from-pull .erdos/pulls/25 \
  --cluster number-theory
```

What maintainer seeding does:
- reads the pull bundle provenance
- generates a canonical `problems/<id>/` dossier
- writes:
  - `problem.yaml`
  - `STATEMENT.md`
  - `REFERENCES.md`
  - `EVIDENCE.md`
  - `FORMALIZATION.md`
- starter loop files:
  - `AGENT_START.md`
  - `ROUTES.md`
  - `CHECKPOINT_NOTES.md`
- public-truth starter files:
  - `PUBLIC_STATUS_REVIEW.md`
  - `AGENT_WEBSEARCH_BRIEF.md`
- preserves upstream/site provenance in the local record

## Sunflower pack

The first deep pack is the sunflower quartet:
- `20`: strong / uniform sunflower core
- `857`: weak / non-uniform sunflower core
- `536`: natural-density LCM analogue
- `856`: harmonic-density LCM analogue

Deep sunflower problems now also ship route packets:
- `20`: `AGENT_START.md`, `ROUTE_PACKET.yaml`, `CHECKPOINT_PACKET.md`, `REPORT_PACKET.md`
- `857`: `AGENT_START.md`, `ROUTE_PACKET.yaml`, `CHECKPOINT_PACKET.md`, `REPORT_PACKET.md`

Useful sunflower commands:

```bash
erdos cluster show sunflower
erdos sunflower status 20
erdos sunflower status 536
erdos sunflower status 857 --json
```

`erdos sunflower status` surfaces:
- family role
- harness profile
- active route
- route breakthrough state
- problem-solved distinction
- compute posture when a packet exists

## ORP

`erdos-problems` now ships a bundled Open Research Protocol kit:
- `PROTOCOL.md`
- `AGENT_INTEGRATION.md`
- `templates/CLAIM.md`
- `templates/VERIFICATION_RECORD.md`
- `templates/FAILED_TOPIC.md`

Workspace copy:
- `.erdos/orp/PROTOCOL.md`
- `.erdos/orp/AGENT_INTEGRATION.md`
- `.erdos/orp/templates/`

Useful ORP commands:

```bash
erdos orp show
erdos orp sync
```

## CLI

```bash
erdos problem list
erdos problem list --cluster sunflower
erdos problem list --repo-status historical
erdos problem list --harness-depth deep
erdos problem list --site-status solved
erdos problem use 857
erdos problem show
erdos problem artifacts 857
erdos problem artifacts 857 --json
erdos cluster list
erdos cluster show sunflower
erdos workspace show
erdos orp show
erdos orp sync
erdos sunflower status 857
erdos sunflower status --json
erdos dossier show
erdos upstream show
erdos upstream sync
erdos upstream diff
erdos scaffold problem 857
erdos bootstrap problem 857
erdos bootstrap problem 857 --sync-upstream
erdos seed problem 25 --cluster number-theory
erdos pull problem 857
erdos pull artifacts 857
erdos pull literature 857
erdos maintainer seed problem 25 --from-pull .erdos/pulls/25 --cluster number-theory
```

## Canonical sources

- local atlas truth: `problems/<id>/problem.yaml`
- bundled upstream snapshot: `data/upstream/erdosproblems/`
- workspace upstream snapshot: `.erdos/upstream/erdosproblems/`
- live upstream repo: `https://github.com/teorth/erdosproblems`
- live public site: `https://www.erdosproblems.com/`

## Agent-facing artifact model

For each seeded problem, the canonical local dossier lives in `problems/<id>/`:
- `problem.yaml`
- `STATEMENT.md`
- `REFERENCES.md`
- `EVIDENCE.md`
- `FORMALIZATION.md`

Many seeded dossiers now also carry starter-loop artifacts:
- `AGENT_START.md`
- `ROUTES.md`
- `CHECKPOINT_NOTES.md`
- `PUBLIC_STATUS_REVIEW.md`
- `AGENT_WEBSEARCH_BRIEF.md`

The CLI can surface these directly:
- `erdos problem artifacts <id>` shows the canonical inventory
- `erdos problem artifacts <id> --json` emits machine-readable inventory
- `erdos scaffold problem <id>` copies the seeded dossier into the active workspace
- `erdos bootstrap problem <id>` selects the problem and creates the scaffold in one step
- `erdos seed problem <id>` self-seeds an unseeded problem into `.erdos/seeded-problems/` and syncs the loop
- `erdos pull problem <id>` creates a workspace bundle for any problem in the upstream snapshot
- `erdos maintainer seed problem <id>` promotes a pull bundle into a canonical local dossier

For sunflower problems, the CLI also surfaces pack-specific artifacts:
- pack README context
- per-problem context files under `packs/sunflower/problems/<id>/`
- route packets and checkpoint/report packets for `20` and `857`
- compute packets under `packs/sunflower/compute/<id>/` when available
- compute-governance evaluation under `breakthroughs`, surfaced through `erdos sunflower status`

## Notes

- `erdos-problems` is the canonical npm package name.
- The compact unscoped alias `erdosproblems` is not publishable because npm rejects it as too similar to `erdos-problems`.

## Docs

- `docs/ERDOS_PROBLEMS_REPO_SPEC.md`
- `docs/ERDOS_PROBLEMS_PROBLEM_SCHEMA.md`
- `docs/ERDOS_SUNFLOWER_CLUSTER_SEED_PLAN.md`

## Research loop

`erdos-problems` now carries the staged loop we defined in the sunflower lab and the `.gpd`-style harness work:

```bash
erdos problem use 857
erdos state sync
erdos preflight
erdos continuation use route
erdos checkpoints sync
erdos workspace show
```

This runtime writes:
- `.erdos/config.json`
- `.erdos/state.json`
- `.erdos/STATE.md`
- `.erdos/QUESTION-LEDGER.md`
- `.erdos/checkpoints/CHECKPOINTS.md`
- `.erdos/checkpoints/CHECKPOINTS.json`
- `.erdos/orp/PROTOCOL.md`
- `.erdos/orp/AGENT_INTEGRATION.md`
- `.erdos/orp/templates/`
- `.erdos/registry/preflight/`

The public package uses the same status ladder we settled on in the lab:
- open problem
- active route
- route breakthrough
- problem solved

That means a fresh install now supports two clean research starts:
- `erdos bootstrap problem <seeded-id>` for native packaged dossiers
- `erdos seed problem <unseeded-id>` for workspace-local self-seeding with the same loop

See also:
- `docs/RESEARCH_LOOP.md`
