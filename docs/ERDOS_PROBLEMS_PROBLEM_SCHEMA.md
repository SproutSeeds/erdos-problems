# Erdos Problems Problem Schema

Last updated: 2026-03-30

## Purpose

This schema defines the canonical local dossier record for each seeded problem in `erdos-problems`.

Goals:
- every Erdős problem has a consistent local home
- local dossier truth stays separate from imported public truth
- agents can bootstrap from canonical artifacts immediately after install
- pulled import/site bundles can be promoted into canonical dossiers without losing provenance

## Canonical files

Each seeded problem should have:
- `problems/<id>/problem.yaml`
- `problems/<id>/STATEMENT.md`
- `problems/<id>/REFERENCES.md`
- `problems/<id>/EVIDENCE.md`
- `problems/<id>/FORMALIZATION.md`

Bundled import snapshot artifacts live in:
- `data/upstream/erdosproblems/problems.yaml`
- `data/upstream/erdosproblems/PROBLEMS_INDEX.json`
- `data/upstream/erdosproblems/SYNC_MANIFEST.json`

Pack-specific context may live in:
- `packs/<pack>/README.md`
- `packs/<pack>/problems/<id>/context.yaml`
- `packs/<pack>/problems/<id>/CONTEXT.md`
- `packs/<pack>/compute/<id>/*.yaml`

Workspace-generated artifacts may live in:
- `.erdos/scaffolds/<id>/`
- `.erdos/pulls/<id>/artifacts/`
- `.erdos/pulls/<id>/literature/`
- `.erdos/upstream/erdosproblems/`

## Canonical truth split

Canonical repo truth:
- `SproutSeeds/erdos-problems`
- `problems/<id>/problem.yaml`
- dossier markdown files beside it

External imported public truth:
- tracked, not silently rewritten
- external structured repo: `teorth/erdosproblems`
- public presentation site: `erdosproblems.com`

Local harness truth:
- route state
- evidence notes
- formalization state
- pack context
- compute packets
- workspace pull/scaffold artifacts

## Example canonical problem YAML

```yaml
problem_id: "857"
display_name: "Erdos Problem #857"
title: "Sunflower Conjecture"
source:
  site: "erdosproblems.com"
  url: "https://www.erdosproblems.com/857"
  external_id: "857"
external_source:
  repo: "https://github.com/teorth/erdosproblems"
  data_file: "data/problems.yaml"
  number: "857"
status:
  site_status: "open"
  site_badge: "OPEN"
  repo_status: "active"
  imported_status: "open"
  imported_last_update: "2025-08-31"
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
  imported_state: "no"
  imported_last_update: "2025-08-31"
research_state:
  open_problem: true
  active_route: "anchored_selector_linearization"
  route_breakthrough: true
  problem_solved: false
```

## Optional provenance block

Maintainer-seeded dossiers may also include:

```yaml
provenance:
  seeded_at: "2026-03-25T..."
  seeded_from:
    kind: "pull_bundle"
    imported_record_included: true
    site_snapshot_included: false
```

## Required fields

- `problem_id`
- `display_name`
- `title`
- `source`
- `external_source`
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

## Status vocabulary

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

## Legacy compatibility

During migration, older dossiers may still use an `upstream` block instead of `external_source`.

That legacy spelling should be treated as imported external provenance, not as a statement that another repo outranks the canonical local dossier.

## Scaffold contract

`erdos scaffold problem <id>` should create a workspace-ready bundle containing:
- copied canonical dossier files
- `problem.yaml`
- imported record snapshot when available
- pack README context when available
- per-problem pack context when available
- compute packets when available
- generated artifact index for agent consumption

## Pull contract

`erdos pull problem <id>` should create a broader workspace-ready bundle containing:
- a root pull manifest
- an `artifacts/` lane
- a `literature/` lane
- imported record snapshot when available
- local dossier artifacts when the problem is already seeded locally
- optional live site snapshot and extracted text when `--include-site` is used

## Maintainer seed contract

`erdos maintainer seed problem <id>` should be able to consume a pull bundle and generate:
- `problem.yaml`
- `STATEMENT.md`
- `REFERENCES.md`
- `EVIDENCE.md`
- `FORMALIZATION.md`

The resulting dossier should preserve imported provenance and site provenance and be safe for later manual curation.
