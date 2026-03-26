# erdos-problems

> Research cockpit for Paul Erdos problems.
>
> Seed a problem. Hand it to an agent. Keep the public truth, local route truth, and verification truth sharply separated.

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

`erdos-problems` is a CLI atlas and staged research harness for Paul Erdos problems.
It is built for people who want more than a problem list and for agents that need a real starting surface on day one.

**Links:** [GitHub](https://github.com/SproutSeeds/erdos-problems) · [npm](https://www.npmjs.com/package/erdos-problems)

## Watch It Run

A fast look at the first minute:

![erdos-problems terminal demo](https://raw.githubusercontent.com/SproutSeeds/erdos-problems/main/assets/terminal-demo.gif)

## Why It Feels Different

Most open-problem repos stop at metadata.

`erdos-problems` goes further:
- it ships a canonical atlas of Erdős problems
- it creates agent-ready dossiers and workspace bundles
- it keeps upstream public status separate from local research state
- it adds pack-specific cockpits where deeper structure is honest
- it carries an ORP-governed loop so claims, checkpoints, and runs stay disciplined

## Start In 60 Seconds

Install:

```bash
npm install -g erdos-problems
```

Bootstrap a flagship problem:

```bash
erdos bootstrap problem 857
erdos sunflower frontier 857
erdos sunflower ready 857
erdos workspace show --json
```

Self-seed an unseeded problem into a fresh workspace:

```bash
erdos seed problem 25 --cluster number-theory
erdos problem show 25
erdos checkpoints sync
```

Archive a solved problem cleanly:

```bash
erdos graph-theory status 1008
erdos archive scaffold 1008 --json
```

## What You Get

| Layer | What it does |
| --- | --- |
| Atlas | canonical `problems/<id>/problem.yaml` records plus a bundled upstream snapshot |
| Dossiers | local case files with statement, references, evidence, and formalization paths |
| Workspaces | `.erdos/` state, checkpoints, ORP kit, pull bundles, runs, and archives |
| Packs | deeper family-specific cockpits for problem clusters that deserve them |
| Governance | ORP + `breakthroughs` + public-status review + structured run artifacts |

## Coverage Right Now

| Surface | Coverage |
| --- | --- |
| Bundled upstream atlas | `1183` problems |
| Native packaged dossiers | `18` |
| Sunflower pack | `20`, `536`, `856`, `857` |
| Number-theory cockpit | `1`, `2` |
| Graph-theory archive cockpit | `19`, `22`, `1008` |
| Deep theorem-facing pack problems | `20`, `857` |

Seeded problems today:
- `1`, `2`, `3`, `4`, `5`, `6`, `7`, `18`, `19`, `20`, `21`, `22`, `89`, `536`, `542`, `856`, `857`, `1008`

## Flavor

The package is meant to feel like a research cockpit, not a bag of files.

Example:

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
Harness profile: lean_archive_cockpit
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
- makes the workspace immediately usable by an agent

### 2. Self-seed a new problem

```bash
erdos seed problem 25 --cluster number-theory
```

What this does:
- pulls upstream public metadata into a workspace bundle
- includes live site review and an agent-websearch brief by default
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

The first deep pack is the sunflower quartet:
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

What makes it special:
- mirrored public board packets
- route / ticket / atom cockpit views
- checkpoint and report packets
- governed local-scout compute posture

### Number-Theory Starter Cockpit

The first lighter non-sunflower pack is number theory:
- `1`: open starter cockpit around a distinct-subset-sum route
- `2`: counterexample/archive cockpit

Useful commands:

```bash
erdos number-theory status 1
erdos number-theory frontier 1
erdos number-theory routes 1
erdos number-theory route 1 distinct_subset_sum_lower_bound
erdos number-theory ticket 1 N1
erdos number-theory atom 1 N1.G1.A1
```

### Graph-Theory Archive Cockpit

The first archive-first pack outside sunflower is graph theory:
- `19`: decision archive cockpit
- `22`: proof archive cockpit
- `1008`: Lean-facing proof archive cockpit

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

## Built For Agents

If you are using Codex, Claude Code, or another agent harness, the package gives your agent:
- canonical dossier files
- upstream provenance
- pack-aware context when available
- `.erdos/` workspace state
- ORP templates and protocol guidance
- checkpoint shelves
- explicit next-honest-move framing
- machine-readable JSON on the important public surfaces

Especially useful commands for agent workflows:

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

The package is opinionated about a clean truth ladder:
- upstream public truth
- local canonical dossier truth
- workspace bundle truth
- pack-specific route / checkpoint / run truth

That separation is one of the main product features.

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

If you are about to push the public GitHub launch, start here:
- [docs/LAUNCH_KIT.md](docs/LAUNCH_KIT.md)
- `assets/social-card.svg`

## Notes

- `erdos-problems` is the canonical npm package name.
- the package is already live on npm
- the compact unscoped alias `erdosproblems` is not publishable because npm rejects it as too similar to `erdos-problems`
