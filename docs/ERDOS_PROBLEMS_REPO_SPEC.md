# Erdos Problems Repo Spec

Last updated: 2026-03-25

## Purpose

This document defines a new public-facing sibling repository:

- repo name target: `erdos-problems`
- npm package target: `erdos-problems`
- CLI executable target: `erdos`

This repo is meant to be the polished atlas and harness for Paul Erdős problems.

`sunflower-coda` remains the experimental proving ground.

`erdos-problems` becomes the clean published surface.

## Product Position

`erdos-problems` should be:

- a problem atlas for Paul Erdős problems
- a research harness with staged workflows for selected problem families
- CLI-first
- dossier-first
- evidence-linked
- formalization-aware

It should not be:

- a clone of `sunflower-coda`
- a raw mirror of every internal experiment
- a generic research framework

## Core Product Model

The repo should have two layers.

### 1. Atlas layer

All Erdős problems live here, including:

- open problems
- solved problems
- prize information
- source links
- tags
- references
- dossier links
- formalization status

Every problem gets a documented home.

### 2. Harness layer

Selected problem families get deeper staged research machinery.

The first deep harness should be:

- `sunflower`

Later families can be added only if they earn it.

## Naming Recommendation

Recommended repo and package name:

- `erdos-problems`

Reason:

- broader than “conjectures”
- matches the actual scope better
- includes solved entries naturally
- leaves room for atlas + dossiers + harnesses

As of 2026-03-25, the following npm names appeared open when checked:

- `erdos-problems`
- `erdos-conjectures`
- `erdos-conjecture`

Recommended binary name:

- `erdos`

## Relationship To Existing Repos

### `sunflower-coda`

Role:

- experimental lab
- theorem-engine proving ground
- route-design incubator
- UI/app experimentation

### `erdos-problems`

Role:

- public atlas
- clean CLI surface
- curated problem dossiers
- stable research harness for selected families

### `ode-to-erdos`

Role:

- narrower theorem-work CLI
- can either remain a focused sibling or be absorbed as an internal package inside `erdos-problems`

Current recommendation:

- keep `ode-to-erdos` as a focused implementation seed
- let `erdos-problems` become the broader public shell above it

## Repository Shape

```text
erdos-problems/
  package.json
  README.md
  bin/
    erdos
  src/
    cli/
    commands/
    atlas/
    dossiers/
    packs/
    reporting/
    adapters/
  problems/
    20/
    536/
    856/
    857/
  packs/
    sunflower/
  schemas/
  templates/
  docs/
```

## Runtime Model

Local runtime folder:

- `.erdos/`

Suggested shape:

```text
.erdos/
  config.json
  state.json
  current-problem.json
  problems.json
  runs/
  registry/
  checkpoints/
  literature/
```

## Problem Entry Model

Every problem directory should contain:

```text
problems/<id>/
  problem.yaml
  STATEMENT.md
  REFERENCES.md
  EVIDENCE.md
  FORMALIZATION.md
  CHECKPOINTS/
```

Not every problem needs a deep route board immediately.

But every problem should have:

- source URL
- normalized statement
- status
- tags
- references
- evidence links

## Harness Model

The first harness pack should be:

- `packs/sunflower/`

That pack should preserve:

- open problem
- active route
- route breakthrough
- problem solved

And also:

- tickets
- gates
- atoms
- ready queue
- generated checkpoints
- literature mapping

## CLI Shape

### Atlas commands

```bash
erdos problem list
erdos problem show 857
erdos problem use 857
erdos cluster list
erdos cluster show sunflower
```

### Dossier commands

```bash
erdos dossier show 857
erdos dossier build 857
erdos checkpoints sync 857
erdos report build 857
```

### Sunflower harness commands

```bash
erdos sunflower setup 857
erdos sunflower warnings 857
erdos sunflower pass 857
erdos sunflower frontier 857
```

## Content Policy

The repo should not blindly mirror `erdosproblems.com` text.

Safer default:

- source URL
- citation
- normalized summary of the problem
- our own dossier and evidence materials

This keeps the repo publishable and reduces licensing ambiguity.

## Launch Strategy

### Phase 1

- create repo
- scaffold CLI
- add core schema
- seed sunflower cluster
- ship atlas-only read commands

### Phase 2

- add dossier generation
- add checkpoint shelf
- add sunflower harness commands

### Phase 3

- deepen route-level automation for sunflower family
- expand to other Erdős clusters carefully

## First Public Promise

The first public promise should be:

> `erdos-problems` is a CLI atlas and staged research harness for Paul Erdős problems, with the sunflower family as the first deeply integrated pack.

