# Erdos Problems Problem Schema

Last updated: 2026-03-25

## Purpose

This schema defines the minimum metadata for each problem entry in `erdos-problems`.

The goal is:

- every Erdős problem has a consistent home
- open and solved problems use the same shape
- dossiers can grow without changing the core schema

## Canonical File

Each problem should have:

- `problems/<id>/problem.yaml`

## Required Fields

```yaml
problem_id: "857"
title: "Sunflower Conjecture"
source:
  site: "erdosproblems.com"
  url: "https://www.erdosproblems.com/857"
  external_id: "857"
status:
  site_status: "open"
  repo_status: "active"
family_tags:
  - "sunflower"
  - "extremal-set-theory"
problem_type:
  kind: "open_problem"
statement:
  short: "Normalized problem statement"
  normalized_md_path: "STATEMENT.md"
references_path: "REFERENCES.md"
evidence_path: "EVIDENCE.md"
formalization_path: "FORMALIZATION.md"
```

## Recommended Fields

```yaml
display_name: "Erdos Problem #857"
aliases:
  - "weak sunflower problem"
related_problems:
  - "20"
  - "536"
  - "856"
prize:
  amount_usd: null
  note: null
domain_tags:
  - "combinatorics"
  - "set-systems"
cluster: "sunflower"
repo_links:
  dossier_dir: "problems/857"
  checkpoints_dir: "problems/857/CHECKPOINTS"
  pack: "sunflower"
formalization:
  status: "active"
  lean_modules:
    - "SunflowerLean/Obstruction.lean"
    - "SunflowerLean/ObstructionExport.lean"
research_state:
  open_problem: true
  active_route: "anchored_selector_linearization"
  route_breakthrough: true
  problem_solved: false
```

## Status Vocabulary

### `site_status`

Allowed values:

- `open`
- `solved`
- `partial`
- `unknown`

This reflects the public source.

### `repo_status`

Allowed values:

- `cataloged`
- `active`
- `archived`
- `solved_locally`
- `historical`

This reflects our local posture.

### `research_state`

For deep-harness problems only:

- `open_problem`
- `active_route`
- `route_breakthrough`
- `problem_solved`

This lets us preserve the sunflower ladder without forcing it onto every problem.

## Supporting Files

### `STATEMENT.md`

Contains:

- normalized statement
- source attribution
- concise context

### `REFERENCES.md`

Contains:

- literature references
- source links
- related problem links

### `EVIDENCE.md`

Contains:

- verified constructions
- theorem checkpoints
- computational artifacts
- failed-path summaries

### `FORMALIZATION.md`

Contains:

- Lean status
- code paths
- verification hooks
- outstanding gaps

## Example: Problem 857

```yaml
problem_id: "857"
display_name: "Erdos Problem #857"
title: "Sunflower Conjecture"
aliases:
  - "weak sunflower problem"
source:
  site: "erdosproblems.com"
  url: "https://www.erdosproblems.com/857"
  external_id: "857"
status:
  site_status: "open"
  repo_status: "active"
family_tags:
  - "sunflower"
  - "extremal-set-theory"
domain_tags:
  - "combinatorics"
  - "set-systems"
problem_type:
  kind: "open_problem"
cluster: "sunflower"
related_problems:
  - "20"
  - "536"
  - "856"
statement:
  short: "Bound the weak sunflower number m(n,k) by C(k)^n."
  normalized_md_path: "STATEMENT.md"
references_path: "REFERENCES.md"
evidence_path: "EVIDENCE.md"
formalization_path: "FORMALIZATION.md"
formalization:
  status: "active"
  lean_modules:
    - "SunflowerLean/Obstruction.lean"
    - "SunflowerLean/ObstructionExport.lean"
research_state:
  open_problem: true
  active_route: "anchored_selector_linearization"
  route_breakthrough: true
  problem_solved: false
```

