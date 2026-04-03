# erdos-problems

Maintained by SproutSeeds. Research stewardship: Fractal Research Group ([frg.earth](https://frg.earth)).

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

- a bundled external atlas import snapshot for provenance and seeding
- local dossiers and workspace bundles
- separate surfaces for public status, local route state, and verification records
- pack-specific views where this repo already has enough structure to support them
- an ORP-based workflow for claims, checkpoints, and run artifacts
- a paper writer bundle mode for public-safe, citation-safe, agent-friendly drafting

## Repo, npm, and External Imports

- `SproutSeeds/erdos-problems` is the canonical public home for this project's atlas, dossiers, packs, and contribution workflow
- the npm package is the installable CLI plus the bundled import snapshot, packaged dossiers, and packaged pack assets
- the GitHub repo is the broader public collaboration space for dossiers, pack packets, docs, issues, discussions, PRs, and future deep research bundles
- `.erdos/` is local workspace state created by the CLI; it is not canonical repo truth
- `erdos import show` reports whether you are using the bundled import snapshot or a workspace-local refreshed import snapshot
- `erdos import sync` currently refreshes an external atlas import snapshot from `teorth/erdosproblems` without mutating the canonical local dossier layer
- `erdos import sync --write-package-snapshot` is the maintainer path for intentionally updating the bundled import snapshot in this repo
- repo-only deep-research directories such as `research/`, `formal/`, `paper/`, `imports/`, and `analysis/` are intentionally kept out of npm by staying outside the `package.json` `files` list
- repo-only public research can live in this GitHub repo without shipping in the npm tarball; see the contribution guide: https://github.com/SproutSeeds/erdos-problems/blob/main/CONTRIBUTING.md

## Start In 60 Seconds

Install:

```bash
npm install -g erdos-problems
```

If you already know the problem you want, the fastest path is:

```bash
erdos bootstrap problem 857
erdos sunflower frontier 857
erdos sunflower ready 857
erdos workspace show --json
```

If you want to start from a new local seed:

```bash
erdos seed problem 25 --cluster number-theory
erdos problem show 25
erdos checkpoints sync
```

## Beginner Flow

This is the zero-assumption path for a new user.

### 1. Install the CLI once

```bash
npm install -g erdos-problems
```

This gives you a global `erdos` command. The workspace state it creates is local to the folder you are in.

### 2. Make a clean working folder

```bash
mkdir erdos-work
cd erdos-work
```

Later, the CLI will create a local `.erdos/` directory here for workspace state, checkpoints, ORP files, and pulled artifacts.

### 3. Browse everything first

```bash
erdos problem list
```

Use this when you do not yet know a problem number or cluster.

### 4. Inspect one problem in plain English

```bash
erdos problem show 857
```

This shows the title, status, cluster, short statement, and research-state posture for that problem.

### 5. Learn the families only after that

```bash
erdos cluster list
erdos cluster show sunflower
```

Once you know what a cluster is, you can narrow the atlas:

```bash
erdos problem list --cluster sunflower
```

### 6. Start a workspace on a well-packaged problem

```bash
erdos bootstrap problem 857
```

What this does:
- creates `.erdos/` in the current folder
- activates the problem locally
- syncs the ORP kit
- scaffolds the workspace for the next research move

### 7. Orient yourself immediately

```bash
erdos workspace show
erdos state show
erdos problem artifacts 857 --json
```

Use these to understand the workspace layout, current route/frontier state, and the artifact surface that already exists for the problem.

### 8. Run the first honest-state sync

```bash
erdos orp sync
erdos state sync
erdos preflight
```

This refreshes the protocol kit, recomputes local research state, and checks whether the workspace is in a sane posture to continue.

### 9. Set your continuation mode

```bash
erdos continuation show
erdos continuation use route
```

For most new users, `route` is the right default. It keeps the loop focused on the current route instead of bouncing between surfaces.

### 10. Sync checkpoints before doing real work

```bash
erdos checkpoints sync
```

This writes the checkpoint shelf and keeps the workspace history honest.

### 11. Look at the actual frontier

```bash
erdos sunflower status 857
erdos sunflower frontier 857
erdos sunflower ready 857
```

This is where the problem becomes actionable instead of just descriptive.

### 12. Drill down to the next unit of work

```bash
erdos sunflower routes 857
erdos sunflower ticket 857 T10
erdos sunflower atom 857 T10.G3.A2
```

That is the real research loop:
- inspect route
- inspect ticket
- inspect atom
- do the next honest move

### 13. Close the loop cleanly

```bash
erdos state sync
erdos checkpoints sync
erdos workspace show
```

If the problem is not already deeply packaged, use one-step local seeding instead of bootstrapping:

```bash
erdos seed problem 25 --cluster number-theory
erdos preflight
erdos continuation use route
erdos checkpoints sync
erdos workspace show
```

In that flow, the seeded dossier is written under `.erdos/seeded-problems/<id>/` and enters the same state/checkpoint loop as packaged dossiers.

## Daily Loop

Once a workspace already exists, this is the main operating loop:

```bash
erdos state sync
erdos preflight
erdos continuation use route
erdos checkpoints sync
erdos workspace show
```

Then inspect the current frontier and active unit of work:

```bash
erdos sunflower frontier 857
erdos sunflower atom 857 T10.G3.A2
```

After a real step, sync checkpoints again:

```bash
erdos checkpoints sync
```

The guiding rule is simple:
- inspect frontier
- work the next honest move
- checkpoint at honest boundaries

Initialize or resume a paper bundle:

```bash
erdos paper init 857
erdos paper show 857
```

Archive a solved problem:

```bash
erdos graph-theory status 1008
erdos archive scaffold 1008 --json
```

## Current Coverage

| Surface | Coverage |
| --- | --- |
| Bundled external atlas snapshot | `1183` problems |
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
- pulls external public metadata into a workspace bundle
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

### 5. Initialize a paper writer bundle

```bash
erdos paper init 857
erdos paper show 857
```

What this does:
- creates or resumes a paper bundle for the problem
- writes machine-readable public evidence and section indexes
- scaffolds claim-safe section drafts, a citation ledger, and a privacy review
- defaults to `paper/problems/<id>/` when run inside this repo and to `.erdos/papers/<id>/` elsewhere

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
- external import provenance when available
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
erdos import drift 857 --json
```

## ORP And Truth Hygiene

`erdos-problems` ships a bundled Open Research Protocol kit:
- `PROTOCOL.md`
- `AGENT_INTEGRATION.md`
- `templates/CLAIM.md`
- `templates/VERIFICATION_RECORD.md`
- `templates/FAILED_TOPIC.md`

The package keeps these layers separate:
- canonical repo truth
- external imported public truth
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

## Canonical Home And External Inputs

- canonical repo: <https://github.com/SproutSeeds/erdos-problems>
- local dossier truth: `problems/<id>/problem.yaml`
- bundled external import snapshot: `data/upstream/erdosproblems/`
- workspace external import snapshot: `.erdos/upstream/erdosproblems/`
- external atlas import repo: <https://github.com/teorth/erdosproblems>
- external public site: <https://www.erdosproblems.com/>

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

`erdosproblems.com` is an external public problem source. `erdos-problems` imports from public sources when helpful, but keeps its canonical dossiers, packs, workflow, and contribution surface in this repo.

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
