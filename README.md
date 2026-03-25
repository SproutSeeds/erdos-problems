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
- workspace `.erdos/` state for active-problem selection, upstream refreshes, reports, scaffolds, and pull bundles
- sunflower cluster as the first deep harness pack
- seeded atlas now includes open and solved problems beyond sunflower
- unseeded problems can still be pulled into a workspace from the bundled upstream snapshot

Seeded problems:
- `18`, `20`, `89`, `536`, `542`, `856`, `857`, `1008`

## First-run flow

```bash
erdos problem list --cluster sunflower
erdos bootstrap problem 857
erdos problem artifacts 857 --json
erdos dossier show 857
```

What `bootstrap` does:
- sets the active workspace problem
- scaffolds the canonical dossier files into `.erdos/scaffolds/<id>/`
- includes the upstream record when a bundled or workspace snapshot is available
- gives an agent a ready-to-read local artifact bundle immediately after install

## Pull bundles

For any problem number in the upstream snapshot, you can create a workspace bundle even if the problem is not yet seeded locally:

```bash
erdos pull problem 857
erdos pull problem 999 --include-site
erdos pull problem 999 --refresh-upstream
```

What `pull` does:
- creates `.erdos/pulls/<id>/`
- includes the upstream record when available
- includes the local canonical dossier too when the problem is seeded locally
- can optionally add a live site snapshot and plain-text extract

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
erdos dossier show
erdos upstream show
erdos upstream sync
erdos upstream diff
erdos scaffold problem 857
erdos bootstrap problem 857
erdos bootstrap problem 857 --sync-upstream
erdos pull problem 857
erdos pull problem 857 --include-site
```

## Canonical Sources

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

The CLI can surface these directly:
- `erdos problem artifacts <id>` shows the canonical inventory
- `erdos problem artifacts <id> --json` emits machine-readable inventory
- `erdos scaffold problem <id>` copies the seeded dossier into the active workspace
- `erdos bootstrap problem <id>` selects the problem and creates the scaffold in one step
- `erdos pull problem <id>` creates a workspace bundle for any problem in the upstream snapshot

## Notes

- `erdos-problems` is the canonical npm package name.
- The compact unscoped alias `erdosproblems` is not publishable because npm rejects it as too similar to `erdos-problems`.

## Docs

- `docs/ERDOS_PROBLEMS_REPO_SPEC.md`
- `docs/ERDOS_PROBLEMS_PROBLEM_SCHEMA.md`
- `docs/ERDOS_SUNFLOWER_CLUSTER_SEED_PLAN.md`
