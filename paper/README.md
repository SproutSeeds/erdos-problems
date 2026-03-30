# Paper

This directory is the repo-only home for public paper drafts, publication prep notes, and reference-reading structure.

It is intentionally separate from the npm-shipped dossier and pack surfaces.

## Paper Writer Mode

Use the CLI to initialize or resume a problem-specific paper bundle:

```bash
erdos paper init 857
erdos paper show 857
```

When run inside the canonical repo, the default destination is `paper/problems/<id>/`.

Each bundle is designed to be both human-readable and agent-friendly. It includes:

- `MANIFEST.json` for problem status and bundle policy
- `PUBLIC_EVIDENCE_INDEX.json` for the public research inputs currently available
- `SECTION_INDEX.json` for machine-readable section routing
- `WRITER_BRIEF.md`, `STYLE_GUIDE.md`, `CITATION_LEDGER.md`, and `PRIVACY_REVIEW.md`
- section drafts such as `ABSTRACT.md`, `INTRODUCTION.md`, and `LIMITATIONS_AND_OPEN_PROBLEMS.md`

The bundle is intentionally public-safe:

- repo-relative paths only
- no local absolute paths
- no private notes or correspondence
- explicit claim-safety and citation discipline
