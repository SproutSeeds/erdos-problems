# Canonical Repo Migration Plan

Last updated: 2026-03-30

## Decision

`SproutSeeds/erdos-problems` becomes the canonical public home for:

- the Erdős problem atlas as presented by this project
- canonical seeded dossiers
- pack-specific route, board, and compute packets
- formal artifacts, papers, and deeper research files that are intentionally public
- contribution, issue, and pull-request workflow

External sources remain valuable, but they are inputs, not authorities:

- `erdosproblems.com` remains a public source surface
- `teorth/erdosproblems` remains an import and comparison source when useful
- `sunflower-coda` is treated as a migration source and lab origin, not the long-term public home

## Why

The current architecture mixes two different ownership stories:

- the package, CLI, and curated public harness live in `SproutSeeds/erdos-problems`
- the bundled atlas snapshot and several provenance fields still point at `teorth/erdosproblems` as "upstream truth"

That split is workable for importing data, but confusing for users. It leaves the project with two competing authority stories:

- "this repo is the home"
- "another repo is the truth"

The migration resolves that by keeping one canonical owner and treating outside sources as import feeds with explicit provenance.

## Product Model After Migration

### Canonical public home

- GitHub repo: `SproutSeeds/erdos-problems`
- npm package: installable CLI and packaged public harness assets
- canonical problem records: `problems/<id>/`
- canonical pack context: `packs/<family>/`
- canonical public docs: `docs/`

### External imports

- imported public site snapshots
- imported external atlas snapshots
- imported public literature adapters

These stay visible as provenance, but never outrank the canonical local record.

### Packaging split

The GitHub repo may contain much more than the npm tarball.

GitHub can hold:

- deep research notes
- paper drafts and public reference bundles
- Lean and formalization source
- board JSON exports
- long-form analysis artifacts

The npm package should ship only what is needed for:

- the CLI
- canonical dossiers
- pack packets
- packaged compute packets
- essential docs and templates

## Current State

Today the repo already behaves partly like the canonical home:

- `erdos problem list` and `erdos problem show` are driven by local seeded dossiers under `problems/`
- the public deep harness for `20` and `857` is already expressed in local pack files under `packs/sunflower/`
- the GitHub repo is already the collaboration surface for issues and PRs

But these parts still reflect the old authority model:

- `src/upstream/sync.js` fetches and labels `teorth/erdosproblems` as the upstream repo
- bundled manifest files record that external repo as the source of truth
- dossier `upstream.repo` fields and references point at `teorth/erdosproblems`
- docs describe that external repo as the upstream truth layer
- package shipping boundaries are still broad enough that repo-only deep research would accidentally ship if dropped into currently published directories

## Migration Principles

1. One canonical owner
   `SproutSeeds/erdos-problems` is the only authority users should need to trust.

2. Provenance without ambiguity
   External records stay cited, but only as imported evidence.

3. Fast install, deep repo
   npm stays lean enough for CLI installs, while GitHub can hold the full public research archive.

4. Public handoff first
   A new user should be able to pick up `20` or `857` and immediately see the live route posture, active files, and next honest move.

5. Deep material on demand
   Users should be able to pull or inspect fuller problem bundles from the repo without shipping all of that by default in npm.

## Rollout Phases

## Phase 1: Ownership And Provenance Cleanup

Goal:
- make the docs and metadata say what the product now means

Changes:
- rewrite docs so `SproutSeeds/erdos-problems` is described as canonical
- replace "upstream truth" wording with "external import source" wording
- update dossier schema language to distinguish:
  - canonical local record
  - imported external sources
  - public site snapshots
- update any visible README/help text that suggests the external repo is authoritative

Acceptance:
- a user reading the README should understand there is one canonical repo
- no user-facing docs should describe `teorth/erdosproblems` as the authoritative owner of this package's atlas

## Phase 2: Package Boundary Split

Goal:
- let GitHub hold the full public archive without forcing it into npm

Changes:
- define repo-only directories for deep research
- tighten `package.json` `files` handling or segregate content so deep research is excluded from the tarball
- document which directories are:
  - canonical and shipped
  - canonical but repo-only
  - generated workspace state

Candidate repo-only directories:
- `research/`
- `formal/lean/`
- `paper/`
- `imports/`
- `analysis/`

Acceptance:
- `npm pack --dry-run` excludes repo-only deep research
- GitHub still exposes the full public archive

## Phase 3: Repo Structure For Full Public Research

Goal:
- move the public-facing deep material into this repo in an orderly way

Changes:
- create canonical directories for:
  - problem-deep research bundles
  - Lean / formal source
  - paper drafts and publication support
  - imported external snapshots and reconciliations
- preserve a clear distinction between:
  - concise user-facing handoff packets
  - deeper research inventory

Suggested layout:

```text
erdos-problems/
  problems/<id>/
  packs/<family>/
  research/problems/<id>/
  formal/lean/
  paper/
  imports/
```

Acceptance:
- the repo can absorb public material from `sunflower-coda` without collapsing the package structure

## Phase 4: CLI Surface For Deep Problem Bundles

Goal:
- let users access the deeper repo-held material intentionally

Changes:
- add documented repo-backed bundle concepts, for example:
  - deep research bundle
  - formalization bundle
  - paper/reference bundle
- expose them either as:
  - repo file paths in scaffold outputs
  - new CLI commands
  - both

Possible commands:
- `erdos problem deep 857`
- `erdos problem formal 857`
- `erdos pull repo-bundle 857`

Acceptance:
- a user can start with the lightweight public packet
- then intentionally step into the deeper public archive without guessing where things live

## Phase 5: External Import And Reconciliation Workflow

Goal:
- retain harmony with outside sources without giving away canonical ownership

Changes:
- rename the current "upstream" semantics toward import/reconcile language
- preserve diff tooling, but point it at external comparisons rather than canonical truth
- store imported manifests under an explicitly non-canonical namespace

Possible wording shift:
- current: "upstream snapshot"
- target: "import snapshot" or "external atlas snapshot"

Acceptance:
- a mismatch between an external source and the canonical local record is legible as a reconciliation task, not a contradiction in authority

## Phase 6: Flagship Problem Migration

Goal:
- make `20` and `857` the model examples of the full system

Changes:
- migrate the public `sunflower-coda` materials for those problems into this repo
- replace `sunflower-coda/repo/...` path references with repo-local paths
- ensure the public packet plus deep bundle plus formal bundle line up cleanly

Acceptance:
- a new user can pick up `20` or `857` from this repo alone
- no crucial public handoff step depends on another repo existing

## Risks

### Risk: accidental npm bloat

If deep research lands under currently shipped directories, npm installs become heavier and noisier.

Mitigation:
- separate repo-only directories
- verify with `npm pack --dry-run`

### Risk: provenance confusion

If external import fields disappear entirely, users may lose track of where records originated.

Mitigation:
- keep provenance blocks, but label them as imported or external

### Risk: partial migration

If docs are updated before structure and commands are ready, users may expect deeper repo-backed pulls that do not exist yet.

Mitigation:
- roll out phase by phase
- clearly document what exists now versus what is planned

## Initial Implementation Slice

This change series should start with the smallest durable slice:

1. store this migration plan in the repo
2. update ownership/provenance docs so the repo is described as canonical
3. create the repo-only directory contract and npm boundary rules
4. add minimal scaffolding docs for deep research bundles

That gives the project a correct public model before the larger content migration begins.

## Definition Of Done

The migration is complete when:

- `SproutSeeds/erdos-problems` is clearly the canonical public home in docs, metadata, and CLI wording
- external sources are treated as imports and reconciliation inputs
- the repo can hold public Lean, paper, and deep research artifacts without shipping all of them to npm
- flagship problems like `20` and `857` can be followed from this repo alone
- contributors can update dossiers, packs, and deep research in one place
