# Launch Kit

## Positioning

Short version:
- `erdos-problems` is a CLI and workspace for Paul Erdos problems.

Medium version:
- `erdos-problems` is a CLI atlas with local dossiers, workspace scaffolding, and pack-specific views for Paul Erdos problems. It is designed to make the first step concrete without blurring public status, local route state, or verification records.

Long version:
- `erdos-problems` packages problem records, local dossiers, seeded workspaces, and pack-specific packets for the parts of the atlas that already have more structure in this repo. The aim is simple: make it easier to move from a problem listing to a working local workspace, while keeping public status, local route state, and verification records separate.

## Launch Copy

### One-liner
- CLI and workspace for Paul Erdos problems.

### Short post
- I just released `erdos-problems`, a CLI and workspace for Paul Erdos problems. It bundles problem records, local dossiers, self-seeding workspaces, and pack-specific views for the sunflower family and a few other problems. Install with `npm install -g erdos-problems`. GitHub: https://github.com/SproutSeeds/erdos-problems

### Longer post
- I just released `erdos-problems`, a CLI atlas and workspace for Paul Erdos problems. It bundles problem records, local dossiers, ORP-based workspaces, one-step self-seeding for new problems, and more developed pack views for the sunflower family. It is meant to make the move from a problem listing to a working local workspace simpler and more explicit, especially when you want to use coding agents without losing track of public status or verification boundaries.

## Demo Flow

```bash
npm install -g erdos-problems
erdos bootstrap problem 857
erdos sunflower frontier 857
erdos problem artifacts 857 --json
```

Backup demo flow:

```bash
erdos seed problem 25 --cluster number-theory
erdos workspace show --json
```

Archive demo flow:

```bash
erdos graph-theory status 1008
erdos archive scaffold 1008 --json
```

## What To Emphasize

- It bundles problem records with local dossiers and workspaces.
- It keeps public status and local research state separate.
- It works well with coding agents, but it is still usable by hand.
- It includes more developed sunflower views and lighter starter/archive views elsewhere.

## GitHub Presentation Notes

Recommended repo tagline:
- CLI and workspace for Paul Erdos problems.

Recommended social preview:
- editable source: `assets/social-card.svg`
- upload-ready raster: `assets/social-card.png`

Recommended demo assets:
- animated terminal demo: `assets/terminal-demo.gif`
- poster frame: `assets/terminal-demo-poster.png`

Recommended pinned bullets:
- atlas + dossiers
- workspaces + checkpoints
- self-seeding from public sources
- sunflower pack

## npm Presentation Notes

Recommended lead screenshot substitute:
- use the README command examples and the demo GIF
- keep the top short and readable
- lead with install + one concrete next step

## Suggested Release Checklist

- publish npm package
- set GitHub social preview image
- add repo description/tagline
- pin the terminal demo GIF in the announcement thread or repo launch post
- post the one-liner + short post copy

## Live links

- GitHub: https://github.com/SproutSeeds/erdos-problems
- npm: https://www.npmjs.com/package/erdos-problems
