import path from 'node:path';
import { loadLocalProblems, getProblem } from '../atlas/catalog.js';
import { loadConfig } from './config.js';
import { ensureDir, writeJson, writeText } from './files.js';
import {
  getWorkspaceCheckpointIndexPath,
  getWorkspaceCheckpointJsonPath,
  getWorkspaceCheckpointsDir,
  getWorkspaceProblemCheckpointsDir,
  getWorkspaceRoot,
  getWorkspaceRouteCheckpointsDir,
} from './paths.js';
import { getProblemArtifactInventory } from './problem-artifacts.js';
import { buildSunflowerStatusSnapshot } from './sunflower.js';
import { loadState, saveState, syncState } from './state.js';

function safeName(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]+/g, '-');
}

function renderCanonicalArtifacts(inventory) {
  return inventory.canonicalArtifacts
    .map((artifact) => `- ${artifact.label}: ${artifact.exists ? 'present' : 'missing'} (${artifact.path})`)
    .join('\n');
}

function renderProblemCheckpoint(problem, state) {
  const inventory = getProblemArtifactInventory(problem);
  const sunflower = problem.cluster === 'sunflower' ? buildSunflowerStatusSnapshot(problem) : null;
  const research = problem.researchState ?? {};
  const activeRoute = sunflower?.activeRoute ?? research.active_route ?? '(none)';
  const routeBreakthrough = sunflower?.routeBreakthrough ?? Boolean(research.route_breakthrough);
  const problemSolved = sunflower?.problemSolved ?? Boolean(research.problem_solved);
  const nextHonestMove = sunflower?.nextHonestMove
    ?? (activeRoute !== '(none)' ? `Advance ${activeRoute} against the dossier and evidence bundle.` : 'Seed or choose an active route.');
  const frontier = sunflower?.frontierDetail ?? problem.shortStatement;
  const checkpointFocus = sunflower?.checkpointFocus ?? 'Keep local route claims and upstream public status cleanly separated.';

  return `# Problem ${problem.problemId} Checkpoint

## Status Ladder

- Open Problem: ${problem.problemId}
- Active Route: ${activeRoute}
- Route Breakthrough: ${routeBreakthrough ? 'yes' : 'no'}
- Problem Solved: ${problemSolved ? 'yes' : 'no'}

## Problem Record

- Title: ${problem.title}
- Cluster: ${problem.cluster}
- Source: ${problem.sourceUrl}
- Site status: ${problem.siteStatus}
- Repo status: ${problem.repoStatus}
- Harness depth: ${problem.harnessDepth}

## Current Frontier

- ${frontier}

## Checkpoint Focus

- ${checkpointFocus}

## Next Honest Move

- ${nextHonestMove}

## Canonical Artifacts

${renderCanonicalArtifacts(inventory)}

## Continuation Frame

- Active agent: ${state.activeAgent || '(none)'}
- Continuation mode: ${state.continuation.mode}
- Stop rule: ${state.continuation.stopRule}
`;
}

function renderRouteCheckpoint(problem, state) {
  const sunflower = problem.cluster === 'sunflower' ? buildSunflowerStatusSnapshot(problem) : null;
  const frontier = sunflower?.frontierDetail ?? state.currentFrontier.detail;
  const routeStory = sunflower?.routeStory ?? state.routeStory ?? '(none yet)';
  const checkpointFocus = sunflower?.checkpointFocus ?? state.checkpointFocus ?? '(none yet)';

  return `# Problem ${problem.problemId} Active Route Checkpoint

## Status Ladder

- Open Problem: ${problem.problemId}
- Active Route: ${state.activeRoute || '(none)'}
- Route Breakthrough: ${state.routeBreakthrough ? 'yes' : 'no'}
- Problem Solved: ${state.problemSolved ? 'yes' : 'no'}

## Current Frontier

- ${frontier}

## Route Story

- ${routeStory}

## Checkpoint Focus

- ${checkpointFocus}

## Continuation Frame

- Continuation mode: ${state.continuation.mode}
- Stop rule: ${state.continuation.stopRule}
- Next honest move: ${state.nextHonestMove}
`;
}

function renderIndex(state, checkpoints) {
  const problemRows = checkpoints.filter((entry) => entry.kind === 'problem');
  const routeRows = checkpoints.filter((entry) => entry.kind === 'route');

  return [
    '# Erdos Checkpoints',
    '',
    'This is the human-facing checkpoint shelf for the local research-loop runtime.',
    'Canonical truth still lives in dossiers, pack artifacts, upstream snapshots, and generated workspace bundles.',
    '',
    '## Current Status Ladder',
    '',
    `- Open Problem: ${state.activeProblem || '(none)'}`,
    `- Active Route: ${state.activeRoute || '(none)'}`,
    `- Route Breakthrough: ${state.routeBreakthrough ? 'yes' : 'no'}`,
    `- Problem Solved: ${state.problemSolved ? 'yes' : 'no'}`,
    '',
    '## Working Context',
    '',
    `- Continuation Mode: ${state.continuation.mode}`,
    `- Next Honest Move: ${state.nextHonestMove}`,
    '',
    '## Problem Checkpoints',
    '',
    ...(problemRows.length > 0 ? problemRows.map((row) => `- [${row.label}](${row.relativePath})`) : ['- *(none)*']),
    '',
    '## Route Checkpoints',
    '',
    ...(routeRows.length > 0 ? routeRows.map((row) => `- [${row.label}](${row.relativePath})`) : ['- *(none)*']),
    '',
  ].join('\n');
}

export function syncCheckpoints(workspaceRoot = getWorkspaceRoot()) {
  const config = loadConfig(workspaceRoot);
  const state = syncState(workspaceRoot);
  const problems = loadLocalProblems();

  ensureDir(getWorkspaceCheckpointsDir(workspaceRoot));
  ensureDir(getWorkspaceProblemCheckpointsDir(workspaceRoot));
  ensureDir(getWorkspaceRouteCheckpointsDir(workspaceRoot));

  const checkpoints = [];

  for (const problem of problems) {
    const filename = `problem-${problem.problemId}.md`;
    const fullPath = path.join(getWorkspaceProblemCheckpointsDir(workspaceRoot), filename);
    writeText(fullPath, renderProblemCheckpoint(problem, state));
    checkpoints.push({
      kind: 'problem',
      label: `Problem ${problem.problemId}`,
      path: fullPath,
      relativePath: path.relative(getWorkspaceCheckpointsDir(workspaceRoot), fullPath),
    });
  }

  if (state.activeProblem && state.activeRoute) {
    const problem = getProblem(state.activeProblem);
    if (problem) {
      const filename = `problem-${state.activeProblem}--${safeName(state.activeRoute)}.md`;
      const fullPath = path.join(getWorkspaceRouteCheckpointsDir(workspaceRoot), filename);
      writeText(fullPath, renderRouteCheckpoint(problem, state));
      checkpoints.push({
        kind: 'route',
        label: `Problem ${state.activeProblem} / ${state.activeRoute}`,
        path: fullPath,
        relativePath: path.relative(getWorkspaceCheckpointsDir(workspaceRoot), fullPath),
      });
    }
  }

  writeText(getWorkspaceCheckpointIndexPath(workspaceRoot), renderIndex(state, checkpoints));
  writeJson(getWorkspaceCheckpointJsonPath(workspaceRoot), {
    syncedAt: new Date().toISOString(),
    activeProblem: state.activeProblem,
    activeRoute: state.activeRoute,
    continuationMode: state.continuation.mode,
    activeAgent: config.preferredAgent,
    checkpoints,
  });

  const nextState = saveState({
    ...loadState(workspaceRoot),
    lastCheckpointSyncAt: new Date().toISOString(),
  }, workspaceRoot);

  return {
    indexPath: getWorkspaceCheckpointIndexPath(workspaceRoot),
    checkpointJsonPath: getWorkspaceCheckpointJsonPath(workspaceRoot),
    checkpoints,
    state: nextState,
  };
}
