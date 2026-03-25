# Erdos Sunflower Cluster Seed Plan

Last updated: 2026-03-25

## Purpose

This document defines the first seed cluster for the future `erdos-problems` repo.

The seed cluster is:

- `sunflower`

## Seed Problems

### `857`

- source: `https://www.erdosproblems.com/857`
- role: weak sunflower core problem
- repo posture: primary deep-harness problem

### `20`

- source: `https://www.erdosproblems.com/20`
- role: strong / uniform sunflower problem
- repo posture: deep-harness sibling problem

### `536`

- source: `https://www.erdosproblems.com/536`
- role: related LCM analogue
- repo posture: dossier-first, later harness candidate

### `856`

- source: `https://www.erdosproblems.com/856`
- role: related harmonic/log-density LCM analogue
- repo posture: dossier-first, later harness candidate

## Why These Four

They form the clearest explicit sunflower-related cluster around `857`.

`857` states directly that it is related to:

- `536`
- `856`

and says:

- `20` is the strong sunflower problem

So this is a real cluster, not an arbitrary grouping.

## Initial Repo Policy

### Deep harness now

- `857`
- `20`

### Dossier-first now

- `536`
- `856`

This keeps the system honest.

We should not pretend every related problem already deserves a full ticket/gate/atom board.

## Initial Directory Targets

```text
problems/
  20/
  536/
  856/
  857/

packs/
  sunflower/
```

## Initial Deliverables Per Problem

### For all four

- `problem.yaml`
- `STATEMENT.md`
- `REFERENCES.md`
- `EVIDENCE.md`
- `FORMALIZATION.md`

### For `857` and `20`

Also include:

- route state
- checkpoints
- active frontier summary
- CLI harness wiring

### For `536` and `856`

Also include:

- relation to sunflower cluster
- notes on why the analogy matters
- literature and dependency mapping

## CLI Goals For Seed Phase

```bash
erdos problem list
erdos problem show 857
erdos cluster show sunflower
erdos dossier build 857
erdos sunflower frontier 857
erdos sunflower frontier 20
```

## Immediate Build Order

1. scaffold `erdos-problems`
2. add schema + templates
3. seed problem entries for `20`, `536`, `856`, `857`
4. wire atlas commands
5. wire sunflower pack commands for `857`
6. wire sunflower pack commands for `20`

## Honest Frontier

The first public deep-harness promise should be:

- `857` as the main weak-sunflower frontier
- `20` as the strong-sunflower sibling frontier

The first public atlas promise should be:

- all seeded problems have documented statements, references, evidence, and formalization notes

