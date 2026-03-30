# Paper Writer Mode

Last updated: 2026-03-30

## Purpose

`erdos paper init <id>` creates or resumes a paper bundle for a problem.

The goal is to make paper writing:

- public-safe
- claim-safe
- citation-safe
- resumable
- legible to both humans and agents

## Commands

```bash
erdos paper init [<id>] [--dest <path>] [--json]
erdos paper show [<id>] [--dest <path>] [--json]
```

Behavior:

- if run inside `SproutSeeds/erdos-problems`, the default bundle destination is `paper/problems/<id>/`
- otherwise the default bundle destination is `.erdos/papers/<id>/`
- rerunning `erdos paper init` updates the machine-readable indexes and fills missing files without overwriting existing section drafts

## Bundle Contract

Every initialized bundle includes:

- `MANIFEST.json`
- `PUBLIC_EVIDENCE_INDEX.json`
- `SECTION_INDEX.json`
- `README.md`
- `WRITER_BRIEF.md`
- `SECTION_STATUS.md`
- `OUTLINE.md`
- `STYLE_GUIDE.md`
- `PRIVACY_REVIEW.md`
- `CITATION_LEDGER.md`
- section draft files

Current section draft set:

- `ABSTRACT.md`
- `INTRODUCTION.md`
- `PRELIMINARIES.md`
- `RELATED_WORK.md`
- `MAIN_RESULTS.md`
- `PROOF_OVERVIEW.md`
- `PROOF_DETAILS.md`
- `COMPUTATIONAL_AND_FORMAL_EVIDENCE.md`
- `LIMITATIONS_AND_OPEN_PROBLEMS.md`

## Safety Model

### Privacy

The generated bundle should be safe to commit to the public repo.

Rules:

- no secrets
- no credentials
- no private correspondence
- no local absolute filesystem paths
- no unpublished private notes treated as paper evidence

To support this, the generated indexes store repo-relative paths whenever possible and omit local-only paths from the committed data model.

### Claim Safety

The bundle assumes the paper may describe an open route rather than a finished proof.

Rules:

- theorem language only for claims actually supported by the current public record
- computational evidence stays computational
- formalization posture stays distinct from proof posture
- open seams stay visible
- unresolved tasks must land in `LIMITATIONS_AND_OPEN_PROBLEMS.md`

### Citation Discipline

External claims should enter the paper only through `CITATION_LEDGER.md`.

Rules:

- log the source before relying on it in prose
- use exact identifiers whenever possible
- treat imported atlas records as provenance, not canonical authority

## Agent Workflow

Recommended loop:

1. Read `MANIFEST.json`.
2. Read `PUBLIC_EVIDENCE_INDEX.json`.
3. Read `SECTION_INDEX.json`.
4. Update `OUTLINE.md` and `SECTION_STATUS.md`.
5. Add external sources to `CITATION_LEDGER.md`.
6. Draft or refine one section file at a time.
7. Run the checklist in `PRIVACY_REVIEW.md` before release.

## Current Scope

This first slice gives the repo a structured paper-writing surface.

It does not yet:

- auto-import the full deep paper archive from `sunflower-coda`
- auto-resolve literature citations from external databases into final bibliography form
- emit a final LaTeX source tree or journal-targeted template

Those are natural next steps once the deeper public research migration is in place.
