# Erdos Problems Repo Spec

Last updated: 2026-03-25

## Purpose

This document defines the public-facing `erdos-problems` repository and npm package.

Targets:
- repo name: `erdos-problems`
- npm package: `erdos-problems`
- CLI executable: `erdos`

`sunflower-coda` remains the experimental lab.
`erdos-problems` is the clean public atlas and harness surface.

## Product position

`erdos-problems` is:
- a problem atlas for Paul Erdős problems
- a dossier-first CLI research harness
- provenance-aware
- formalization-aware
- agent-friendly from first install

It is not:
- a raw mirror of `sunflower-coda`
- a generic research framework
- a place where local route state silently overwrites public upstream truth

## Core model

The repo has three layers.

### 1. Atlas layer

All seeded Erdős problems live here with canonical local dossiers.

### 2. Upstream truth layer

The package ships a bundled snapshot of `teorth/erdosproblems` and can refresh a workspace-local snapshot.

### 3. Harness layer

Selected problem families get deeper pack-specific context.
The first pack is `sunflower`.

## Repository shape

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
    runtime/
    upstream/
  problems/
    <id>/
  packs/
    sunflower/
      README.md
      problems/<id>/
      compute/<id>/
  data/upstream/erdosproblems/
  docs/
```

## Runtime model

Local workspace runtime:

```text
.erdos/
  state.json
  current-problem.json
  upstream/erdosproblems/
  scaffolds/<id>/
  pulls/<id>/
    artifacts/
    literature/
  registry/
```

## Dossier model

Each canonical seeded dossier contains:
- `problem.yaml`
- `STATEMENT.md`
- `REFERENCES.md`
- `EVIDENCE.md`
- `FORMALIZATION.md`

## Pull model

`erdos pull problem <id>` creates a root pull bundle with two sub-lanes:
- `artifacts/`
- `literature/`

`erdos pull artifacts <id>` and `erdos pull literature <id>` target those lanes directly.

## Maintainer model

`erdos maintainer seed problem <id>` promotes a pulled bundle into a canonical local dossier.

This is the disciplined bridge from:
- public upstream/site truth
- to local canonical dossier truth

## Sunflower pack model

The sunflower pack now explicitly covers the quartet:
- `20`: strong sunflower core
- `857`: weak sunflower core
- `536`: natural-density LCM analogue
- `856`: harmonic-density LCM analogue

Pack assets may include:
- pack README context
- per-problem context files
- compute packets for deep problems

## CLI shape

Atlas:
```bash
erdos problem list
erdos problem show 857
erdos problem use 857
erdos cluster list
erdos cluster show sunflower
```

Workspace and artifacts:
```bash
erdos workspace show
erdos problem artifacts 857 --json
erdos scaffold problem 857
erdos bootstrap problem 857
```

Pull and maintainer flow:
```bash
erdos pull problem 1
erdos pull artifacts 857
erdos pull literature 857 --include-site
erdos maintainer seed problem 1 --from-pull .erdos/pulls/1 --cluster number-theory
```

Sunflower pack:
```bash
erdos sunflower status 20
erdos sunflower status 536
erdos sunflower status 857 --json
```

## Canonical truth split

Public upstream truth:
- `teorth/erdosproblems`
- `data/problems.yaml`
- `erdosproblems.com`

Local atlas truth:
- `problems/<id>/problem.yaml`
- dossier markdown files beside it

Local harness truth:
- research state
- checkpoints
- pack context
- compute packets
- workspace pull/scaffold artifacts
