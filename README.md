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

- atlas layer for seeded Erdos problems
- sunflower cluster as the first deep harness pack
- lightweight `.erdos/` workspace state for active-problem selection
- seeded atlas now includes open and solved problems beyond sunflower

Seeded problems:
- `18`, `20`, `89`, `536`, `542`, `856`, `857`, `1008`

## CLI

```bash
erdos problem list
erdos problem list --cluster sunflower
erdos problem list --repo-status historical
erdos problem list --harness-depth deep
erdos problem use 857
erdos problem show
erdos cluster list
erdos cluster show sunflower
erdos workspace show
erdos dossier show
```

## Notes

- `erdos-problems` is the canonical npm package name.
- The compact unscoped alias `erdosproblems` is not publishable because npm rejects it as too similar to `erdos-problems`.

## Docs

- `docs/ERDOS_PROBLEMS_REPO_SPEC.md`
- `docs/ERDOS_PROBLEMS_PROBLEM_SCHEMA.md`
- `docs/ERDOS_SUNFLOWER_CLUSTER_SEED_PLAN.md`
