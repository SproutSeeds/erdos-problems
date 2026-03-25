# Erdos Problems Problem Schema

Last updated: 2026-03-25

## Purpose

This schema defines the minimum metadata for each problem entry in `erdos-problems`.

The goal is:

- every Erdős problem has a consistent home
- open and solved problems use the same shape
- local dossier truth and upstream public truth stay explicitly separated
- packaged CLI installs can scaffold problem workspaces from canonical artifacts immediately
- unseeded problems can still be pulled into a workspace bundle from upstream truth

## Canonical Files

Each seeded problem should have:

- `problems/<id>/problem.yaml`
- `problems/<id>/STATEMENT.md`
- `problems/<id>/REFERENCES.md`
- `problems/<id>/EVIDENCE.md`
- `problems/<id>/FORMALIZATION.md`

Bundled upstream snapshot artifacts live in:

- `data/upstream/erdosproblems/problems.yaml`
- `data/upstream/erdosproblems/PROBLEMS_INDEX.json`
- `data/upstream/erdosproblems/SYNC_MANIFEST.json`

Workspace-generated artifacts may live in:

- `.erdos/scaffolds/<id>/`
- `.erdos/pulls/<id>/`
- `.erdos/upstream/erdosproblems/`

## Canonical Truth Split

### External public truth

Tracked, not rewritten by us:

- upstream structured repo: `teorth/erdosproblems`
- upstream data file: `data/problems.yaml`
- public presentation site: `erdosproblems.com`

### Local atlas truth

Authored by this repo:

- `problems/<id>/problem.yaml`
- local dossier markdown files alongside it

### Local research truth

For active harnessed problems:

- route state
- evidence
- formalization status
- checkpoints and generated reports

## Example Canonical Problem YAML

```yaml
problem_id: "857"
display_name: "Erdos Problem #857"
title: "Sunflower Conjecture"
source:
  site: "erdosproblems.com"
  url: "https://www.erdosproblems.com/857"
  external_id: "857"
upstream:
  repo: "https://github.com/teorth/erdosproblems"
  data_file: "data/problems.yaml"
  number: "857"
status:
  site_status: "open"
  site_badge: "OPEN"
  repo_status: "active"
  upstream_status: "open"
  upstream_last_update: "2025-08-31"
cluster: "sunflower"
prize:
  display: "no"
related_problems:
  - "20"
  - "536"
  - "856"
family_tags:
  - "sunflower"
  - "extremal-set-theory"
harness:
  depth: "deep"
statement:
  short: "Bound the weak sunflower number m(n,k) by C(k)^n."
  normalized_md_path: "STATEMENT.md"
references_path: "REFERENCES.md"
evidence_path: "EVIDENCE.md"
formalization_path: "FORMALIZATION.md"
formalization:
  status: "active"
  upstream_state: "no"
  upstream_last_update: "2025-08-31"
research_state:
  open_problem: true
  active_route: "anchored_selector_linearization"
  route_breakthrough: true
  problem_solved: false
```

## Required Fields

- `problem_id`
- `display_name`
- `title`
- `source`
- `upstream`
- `status`
- `cluster`
- `family_tags`
- `harness.depth`
- `statement.short`
- `statement.normalized_md_path`
- `references_path`
- `evidence_path`
- `formalization_path`
- `formalization.status`

## Status Vocabulary

### `status.site_status`

Allowed values:

- `open`
- `solved`
- `partial`
- `unknown`

### `status.repo_status`

Allowed values:

- `cataloged`
- `active`
- `archived`
- `solved_locally`
- `historical`

### `harness.depth`

Allowed values:

- `deep`
- `dossier`

### `formalization.status`

Repo-local examples:

- `active`
- `planned`
- `statement-formalized`
- `site-proved-lean`
- `unstarted`

## Upstream Sync Artifacts

The sync commands should produce:

- raw upstream YAML snapshot
- normalized JSON index keyed by problem number
- sync manifest with commit SHA, timestamp, and hash
- markdown diff report comparing locally seeded problems to upstream state

## Scaffold Contract

`erdos scaffold problem <id>` should create a workspace-ready bundle containing:

- copied canonical local dossier files
- canonical local `problem.yaml`
- upstream record snapshot for that problem when available
- generated artifact index for agent consumption

This is the seeded-problem path.

## Pull Contract

`erdos pull problem <id>` should create a broader workspace-ready bundle containing:

- upstream record snapshot for that problem when available
- generated artifact index for agent consumption
- seeded local dossier files too when the problem already exists in `problems/<id>/`
- optional live site snapshot and extracted text when `--include-site` is used

This makes a fresh npm-installed CLI immediately useful to an agentic workflow even for problems that are not yet fully seeded as local dossiers.
