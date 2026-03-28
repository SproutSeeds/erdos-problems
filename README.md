# erdos-problems

Maintained by Fractal Research Group (`frg.earth`).

> CLI and workspace for Paul Erdos problems.
>
> Browse the atlas, scaffold a dossier, and keep public status, local route state, and verification records separate.

[![npm version](https://img.shields.io/npm/v/erdos-problems?color=111111&label=npm)](https://www.npmjs.com/package/erdos-problems)
[![npm downloads](https://img.shields.io/npm/dm/erdos-problems?color=111111&label=downloads)](https://www.npmjs.com/package/erdos-problems)
[![GitHub stars](https://img.shields.io/github/stars/SproutSeeds/erdos-problems?style=flat&color=111111&label=stars)](https://github.com/SproutSeeds/erdos-problems/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/SproutSeeds/erdos-problems?color=111111&label=issues)](https://github.com/SproutSeeds/erdos-problems/issues)
[![GitHub discussions](https://img.shields.io/github/discussions/SproutSeeds/erdos-problems?color=111111&label=discussions)](https://github.com/SproutSeeds/erdos-problems/discussions)
[![license](https://img.shields.io/npm/l/erdos-problems?color=111111&label=license)](./LICENSE)
[![node](https://img.shields.io/node/v/erdos-problems?color=111111&label=node)](https://www.npmjs.com/package/erdos-problems)

![erdos-problems social card](https://raw.githubusercontent.com/SproutSeeds/erdos-problems/main/assets/social-card.png)

```text
erdos-problems
atlas -> dossier -> pack -> checkpoint -> archive
```

`erdos-problems` is a CLI for working with Paul Erdos problems. It bundles problem records, local dossiers, workspace scaffolding, and pack-specific views for the problems that already have more structure in this repo.

**Links:** [GitHub](https://github.com/SproutSeeds/erdos-problems) · [npm](https://www.npmjs.com/package/erdos-problems)

## Watch It Run

A short example from the first minute:

![erdos-problems terminal demo](https://raw.githubusercontent.com/SproutSeeds/erdos-problems/main/assets/terminal-demo.gif)

## What It Includes

- a bundled snapshot of the Erdős problem atlas
- local dossiers and workspace bundles
- separate surfaces for public status, local route state, and verification records
- pack-specific views where this repo already has enough structure to support them
- an ORP-based workflow for claims, checkpoints, and run artifacts

## Start In 60 Seconds

Install:

```bash
npm install -g erdos-problems
```

Bootstrap a seeded problem:

```bash
erdos bootstrap problem 857
erdos sunflower frontier 857
erdos sunflower ready 857
erdos workspace show --json
```

Seed a new problem into the current workspace:

```bash
erdos seed problem 25 --cluster number-theory
erdos problem show 25
erdos checkpoints sync
```

Archive a solved problem:

```bash
erdos graph-theory status 1008
erdos archive scaffold 1008 --json
```

## Current Coverage

| Surface | Coverage |
| --- | --- |
| Bundled upstream atlas | `1183` problems |
| Native packaged dossiers | `18` |
| Sunflower pack | `20`, `536`, `856`, `857` |
| Number-theory pack | `1`, `2` |
| Graph-theory archive pack | `19`, `22`, `1008` |
| Most developed pack problems | `20`, `857` |

Seeded problems today:
- `1`, `2`, `3`, `4`, `5`, `6`, `7`, `18`, `19`, `20`, `21`, `22`, `89`, `536`, `542`, `856`, `857`, `1008`

## Example Output

```bash
$ erdos sunflower frontier 857
Erdos Problem #857 sunflower frontier
Active route: anchored_selector_linearization
Active ticket: T10
First ready atom: T10.G3.A2
Checkpoint focus: keep the board packet honest around T10 while preserving the open-problem / active-route / route-breakthrough ladder.
```

```bash
$ erdos graph-theory status 1008
Erdos Problem #1008 graph-theory harness
Family role: c4_free_lean_archive
Harness profile: lean_archive_workspace
Archive mode: method_exemplar
Problem solved: yes
First ready atom: G1008.G1.A1 — Freeze the primary Lean-facing archive hook for the `C_4`-free density result
```

## Core Flows

### 1. Bootstrap a seeded problem

```bash
erdos bootstrap problem 857
erdos problem artifacts 857 --json
erdos checkpoints sync
```

What this does:
- sets the active workspace problem
- syncs the bundled ORP kit into `.erdos/orp/`
- scaffolds the dossier into `.erdos/scaffolds/<id>/`
- pulls in pack-specific context where available
- prepares the workspace for the next step

### 2. Seed a new problem

```bash
erdos seed problem 25 --cluster number-theory
```

What this does:
- pulls upstream public metadata into a workspace bundle
- includes live site review and an agent websearch brief by default
- seeds a local dossier into `.erdos/seeded-problems/<id>/`
- syncs state, checkpoints, and ORP automatically

### 3. Pull artifacts without seeding

```bash
erdos pull problem 857
erdos pull literature 857 --include-crossref --include-openalex --json
```

Use this when you want a research bundle first and a canonical dossier later.

### 4. Promote a pulled bundle into a canonical dossier

```bash
erdos maintainer review problem 25 --from-pull .erdos/pulls/25
erdos maintainer seed problem 25 --from-pull .erdos/pulls/25 --cluster number-theory
```

## Packs

### Sunflower Pack

The sunflower pack currently covers this quartet:
- `20`: strong / uniform sunflower core
- `857`: weak / non-uniform sunflower core
- `536`: natural-density LCM analogue
- `856`: harmonic-density LCM analogue

Useful commands:

```bash
erdos sunflower status 857
erdos sunflower board 857
erdos sunflower frontier 857
erdos sunflower routes 857
erdos sunflower tickets 857
erdos sunflower route 857 anchored_selector_linearization
erdos sunflower atom 857 T10.G3.A2
erdos sunflower compute run 857
```

What is included here:
- public board packets
- route / ticket / atom views
- checkpoint and report packets
- governed local-scout compute posture where a packet exists

### Number-Theory Pack

The number-theory pack currently includes:
- `1`: open route-oriented starter pack around a distinct-subset-sum lane
- `2`: counterexample / archive pack

Useful commands:

```bash
erdos number-theory status 1
erdos number-theory frontier 1
erdos number-theory routes 1
erdos number-theory route 1 distinct_subset_sum_lower_bound
erdos number-theory ticket 1 N1
erdos number-theory atom 1 N1.G1.A1
```

### Graph-Theory Archive Pack

The graph-theory archive pack currently includes:
- `19`: decision archive pack
- `22`: proof archive pack
- `1008`: Lean-facing proof archive pack

Useful commands:

```bash
erdos graph-theory status 19
erdos graph-theory frontier 22
erdos graph-theory routes 1008
erdos graph-theory tickets 19
erdos archive scaffold 1008 --json
```

Design rule:
- no fake live frontier for solved or decided problems
- keep the archive usable as a method exemplar
- preserve public status discipline instead of inflating pressure where none exists

## Using It With Agents

If you are using Codex, Claude Code, or another coding agent, the package provides:
- canonical dossier files
- upstream provenance
- pack-aware context where it exists
- `.erdos/` workspace state
- ORP templates and protocol guidance
- checkpoint shelves
- explicit next-step framing
- machine-readable JSON on the main public surfaces

Useful commands for agent workflows:

```bash
erdos problem artifacts 857 --json
erdos workspace show --json
erdos pull literature 857 --include-crossref --include-openalex --json
erdos upstream drift 857 --json
```

## ORP And Truth Hygiene

`erdos-problems` ships a bundled Open Research Protocol kit:
- `PROTOCOL.md`
- `AGENT_INTEGRATION.md`
- `templates/CLAIM.md`
- `templates/VERIFICATION_RECORD.md`
- `templates/FAILED_TOPIC.md`

The package keeps these layers separate:
- upstream public truth
- local canonical dossier truth
- workspace bundle truth
- pack-specific route / checkpoint / run truth

## Command Gallery

```bash
erdos problem list --cluster sunflower
erdos problem show 857
erdos problem artifacts 857 --json

erdos cluster list --json
erdos cluster show graph-theory

erdos workspace show --json
erdos checkpoints sync
erdos preflight

erdos sunflower frontier 857
erdos sunflower ready 857
erdos sunflower compute run 857

erdos number-theory route 1 distinct_subset_sum_lower_bound
erdos graph-theory status 1008

erdos pull problem 857
erdos pull literature 857 --include-crossref --include-openalex --json

erdos seed problem 25 --cluster number-theory
erdos maintainer review problem 25 --from-pull .erdos/pulls/25
erdos archive scaffold 1008 --json
```

## Canonical Sources

- local dossier truth: `problems/<id>/problem.yaml`
- bundled upstream snapshot: `data/upstream/erdosproblems/`
- workspace upstream snapshot: `.erdos/upstream/erdosproblems/`
- live upstream repo: <https://github.com/teorth/erdosproblems>
- live public site: <https://www.erdosproblems.com/>

## Docs

- `docs/ERDOS_PROBLEMS_REPO_SPEC.md`
- `docs/ERDOS_PROBLEMS_PROBLEM_SCHEMA.md`
- `docs/ERDOS_SUNFLOWER_CLUSTER_SEED_PLAN.md`
- `docs/RESEARCH_LOOP.md`
- `docs/LAUNCH_KIT.md`

## Launch Assets

If you are preparing a public post, start here:
- [docs/LAUNCH_KIT.md](docs/LAUNCH_KIT.md)
- `assets/social-card.svg`
- `assets/terminal-demo.gif`

## FAQ

### What is the difference between this and erdosproblems.com?

`erdosproblems.com` is a public problem atlas. `erdos-problems` uses that public record, but adds local dossiers, workspace scaffolding, checkpoints, and pack-specific views for the problems that already have more structure here.

### Can I use this with Codex, Claude Code, or another agent?

Yes. The package can scaffold a local `.erdos/` workspace, expose machine-readable JSON on the main public surfaces, and keep public status, local route state, and verification records separate.

### Which problems are most developed right now?

The sunflower pack is currently the most developed. Problems `20` and `857` have the deepest public pack surface. Problems `536` and `856` are included as bridge-oriented sunflower dossiers. The number-theory and graph-theory packs are lighter.

### Does it only cover open problems?

No. The bundled upstream atlas covers open, solved, and decided problems. Open problems can be seeded into active workspaces. Solved or decided problems can be scaffolded in archive mode and used as method exemplars.

### What is a dossier?

A dossier is the local canonical folder for one problem. It usually includes `problem.yaml`, `STATEMENT.md`, `REFERENCES.md`, `EVIDENCE.md`, and `FORMALIZATION.md`.

### Do I need Lean or ORP to start using it?

No. You can start with `erdos bootstrap problem <id>` or `erdos seed problem <id>`. ORP files are bundled into the workspace for structured claims and checkpoints, and some packs include formalization-specific surfaces, but the first step does not require Lean.

### Why is the npm package called `erdos-problems` and not `erdosproblems`?

`erdos-problems` is the canonical npm package name and it is already live on npm. The compact unscoped alias `erdosproblems` is not publishable because npm rejects it as too similar to `erdos-problems`.
