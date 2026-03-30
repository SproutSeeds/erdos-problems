# Deep Research Bundle Spec

Last updated: 2026-03-30

## Purpose

This document defines how `SproutSeeds/erdos-problems` can hold the full public research archive without forcing all of it into the npm package.

The package should keep a two-speed model:

- fast install and immediate dossier/pack handoff through npm
- deeper public research bundles through the GitHub repo

## Repo-only directories

These directories are intended to live in the GitHub repo but stay out of the npm tarball:

- `research/`
- `formal/`
- `paper/`
- `imports/`
- `analysis/`

They remain repo-only by staying outside the `package.json` `files` list.

## Recommended layout

```text
research/
  problems/<id>/
    README.md
    boards/
    checkpoints/
    notes/
    wave-history/

formal/
  lean/
    README.md
    SunflowerLean/

paper/
  README.md
  problems/<id>/
  references/

imports/
  README.md
  external-atlas/
  public-site/

analysis/
  README.md
  problem20/
  problem857/
```

## Problem handoff model

Every serious problem should eventually have three public layers:

### 1. Canonical dossier

Lives in `problems/<id>/`.

Use for:
- source page
- canonical local status
- short statement
- references
- evidence ledger
- formalization posture

### 2. Public pack packet

Lives in `packs/<family>/problems/<id>/`.

Use for:
- active route
- current frontier
- ready queue
- checkpoint/report templates
- concise operational handoff

### 3. Deep research bundle

Lives in `research/problems/<id>/`.

Use for:
- long-form notes
- board exports
- route decompositions
- wave histories
- intermediate artifacts
- deeper public context not needed in the npm install

## Formal bundle

Formalization source should live under `formal/lean/` or another clearly scoped formal directory inside this repo.

Pack packets may point into those repo-local formal files, but should not point back out to `sunflower-coda` once the migration is complete.

## Paper bundle

Paper drafts, publication notes, and public reference-reading order should live under `paper/`.

The npm install does not need all of this by default, but the repo should be able to present it as part of the canonical public archive.

For problem-specific writing, prefer `paper/problems/<id>/` bundles created by `erdos paper init <id>`.

## Import bundle

External imports should live under `imports/` when they are intentionally retained in the repo.

These are not canonical dossier truth. They are imported provenance and reconciliation material.

## Migration order

1. store this directory contract in the repo
2. create the repo-only directories with READMEs
3. migrate flagship public materials for `20` and `857`
4. update pack references from `sunflower-coda/...` to repo-local paths
5. add CLI affordances for pointing users at the deeper repo-held bundles

## Success criteria

- the GitHub repo can hold the full public archive
- npm remains focused on install-critical assets
- a user can understand the shallow-to-deep handoff without guessing
