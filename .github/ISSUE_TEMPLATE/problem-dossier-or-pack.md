---
name: Problem dossier or pack update
about: Share evidence or propose a structured change to a problem dossier, pack packet, or research artifact
title: "[problem] "
labels: ["problem"]
assignees: ""
---

## Before you submit

- I searched existing issues and PRs
- I reviewed the current dossier or pack files first
- I am using this template because the submission touches a problem record, pack packet, or research artifact

## Problem

- Problem ID:
- Cluster:
- Current status on erdosproblems.com:

## Submission type

- dossier correction
- new evidence
- pack context update
- route / ticket / atom packet update
- compute packet update
- formal or paper artifact
- other structured research update

## Source surfaces reviewed

- `erdosproblems.com`
- `teorth/erdosproblems`
- local dossier / pack files
- other public references

## Claim and evidence

- Claim level: `Exact | Verified | Heuristic | Conjecture`
- Smallest honest claim this issue is making:
- Canonical artifacts or packets reviewed:
- Verification hook, reproduction path, or exact commands:
- What is still open or uncertain:

## Why this matters

Describe the smallest honest improvement this issue is trying to make.

## Truth-layer notes

State whether this touches:

- imported public provenance
- canonical local dossier truth
- pack-specific harness truth
- paper or formal public artifacts
- local workspace guidance only

## Suggested files or surfaces

List any likely paths, for example:

- `problems/<id>/problem.yaml`
- `problems/<id>/STATEMENT.md`
- `packs/<family>/problems/<id>/CONTEXT.md`
- `packs/<family>/problems/<id>/ATOMIC_BOARD.yaml`
- `paper/problems/<id>/`
- `formal/lean/`

## Review expectations

I understand that:

- maintainers may ask me to tighten the claim or evidence before review continues
- if the submission does not follow the template, it may be closed with a reminder to resubmit in the correct format
- if this becomes a concrete patch, the next step is usually a draft PR from a branch
