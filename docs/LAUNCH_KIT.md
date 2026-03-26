# Launch Kit

## Positioning

Short version:
- `erdos-problems` is a research cockpit for Paul Erdos problems.

Medium version:
- `erdos-problems` is a CLI atlas and agent-ready research harness for Paul Erdos problems. It goes beyond a problem list by shipping dossiers, pack-specific cockpits, ORP-governed workspaces, and structured pull/seed flows that let humans and agents start real research immediately.

Long version:
- `erdos-problems` is built for serious open-problem work. It packages the public Erdős problem atlas, preserves canonical dossier truth, scaffolds agent-ready workspaces, and adds deeper family-specific cockpits where the problem structure is rich enough to justify them. The result is a clean research loop that can move from atlas -> dossier -> route -> checkpoint -> archive without blurring public status, local route pressure, or verification truth.

## Launch Copy

### One-liner
- Research cockpit for Paul Erdos problems.

### Short post
- I just released `erdos-problems`: a CLI atlas and agent-ready research harness for Paul Erdos problems. It ships canonical dossiers, ORP-governed workspaces, self-seeding flows, and deeper cockpits for the sunflower family. Install with `npm install -g erdos-problems`.

### Longer post
- I just released `erdos-problems`, a CLI atlas and staged research harness for Paul Erdos problems. The goal is not just to list problems, but to make them operational for real research. The package bundles upstream problem data, creates canonical dossiers, scaffolds ORP-governed workspaces, supports one-step self-seeding for new problems, and already includes deeper family-specific cockpits for sunflower, number theory, and graph-theory archive work. It is designed so a person or agent can install it at night and start honest, structured work immediately.

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

- It is not just a metadata dump.
- It is agent-ready out of the box.
- It preserves truth hygiene.
- It supports both open and solved problems.
- It already has a deep sunflower cockpit.

## GitHub Presentation Notes

Recommended repo tagline:
- Research cockpit for Paul Erdos problems.

Recommended social preview:
- `assets/social-card.svg`
- export a PNG from it for GitHub social preview if GitHub wants raster upload

Recommended pinned bullets:
- atlas + dossiers
- ORP-governed workspaces
- self-seeding from public sources
- sunflower family cockpit

## npm Presentation Notes

Recommended lead screenshot substitute:
- use the README's command-output sections
- keep the top fast and cinematic
- lead with install + immediate payoff

## Suggested Release Checklist

- publish npm package
- set GitHub social preview image
- add repo description/tagline
- pin a short demo GIF or screenshot later if desired
- post the one-liner + short post copy
