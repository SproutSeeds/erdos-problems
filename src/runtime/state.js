import { getProblem } from '../atlas/catalog.js';
import { ensureConfig, loadConfig } from './config.js';
import { fileExists, readJson, writeJson, writeText } from './files.js';
import { buildGraphTheoryStatusSnapshot } from './graph-theory.js';
import {
  getWorkspaceQuestionLedgerPath,
  getWorkspaceRoot,
  getWorkspaceStateMarkdownPath,
  getWorkspaceStatePath,
} from './paths.js';
import { buildNumberTheoryStatusSnapshot } from './number-theory.js';
import { buildSunflowerStatusSnapshot } from './sunflower.js';
import { readCurrentProblem } from './workspace.js';
import { continuationDisplay, resolveContinuation } from './continuation.js';

function defaultState(config, workspaceRoot) {
  const now = new Date().toISOString();
  return {
    workspaceRoot,
    createdAt: now,
    updatedAt: now,
    activeProblem: null,
    problemTitle: null,
    cluster: null,
    familyRole: null,
    harnessProfile: null,
    activeRoute: null,
    routeBreakthrough: false,
    problemSolved: false,
    openProblem: false,
    activeAgent: config.preferredAgent,
    continuation: resolveContinuation({ requestedMode: config.continuation }),
    currentFrontier: {
      kind: 'idle',
      detail: 'Select or bootstrap an Erdős problem to begin.',
    },
    routeStory: null,
    checkpointFocus: null,
    nextHonestMove: 'Select or bootstrap an Erdős problem to begin.',
    packArtifacts: null,
    activeTicketId: null,
    activeAtomId: null,
    lastCheckpointSyncAt: null,
  };
}

function renderList(items, placeholder) {
  if (!items || items.length === 0) {
    return `- ${placeholder}`;
  }
  return items.map((item) => `- ${item}`).join('\n');
}

function buildQuestionLedger(problemSummary) {
  return `# Question Ledger

## Open Questions

${renderList(problemSummary.questionLedger?.openQuestions, '*(none recorded yet)*')}

## Active Route Notes

${renderList(problemSummary.questionLedger?.activeRouteNotes, '*(none recorded yet)*')}

## Route Breakthroughs

${renderList(problemSummary.questionLedger?.routeBreakthroughs, '*(none recorded yet)*')}

## Problem Solved

${renderList(problemSummary.questionLedger?.problemSolved, '*(none recorded yet)*')}
`;
}

function renderStateMarkdown(state) {
  return `# Erdos Research State

## Status Ladder

- Open Problem: ${state.activeProblem || '(none)'}${state.problemTitle ? ` — ${state.problemTitle}` : ''}
- Cluster: ${state.cluster || '(none)'}
- Active Route: ${state.activeRoute || '(none)'}
- Route Breakthrough: ${state.routeBreakthrough ? 'yes' : 'no'}
- Problem Solved: ${state.problemSolved ? 'yes' : 'no'}

## Working Context

- Workspace Root: ${state.workspaceRoot}
- Family Role: ${state.familyRole || '(none)'}
- Harness Profile: ${state.harnessProfile || '(none)'}
- Active Agent: ${state.activeAgent || '(none)'}
- Continuation Mode: ${continuationDisplay(state.continuation)}
- Last Checkpoint Sync: ${state.lastCheckpointSyncAt || '(never)'}
- Updated At: ${state.updatedAt}

## Current Research Frontier

- Kind: ${state.currentFrontier.kind}
- Detail: ${state.currentFrontier.detail}

## Route Story

- ${state.routeStory || '(none yet)'}

## Checkpoint Focus

- ${state.checkpointFocus || '(none yet)'}

## Pack Artifacts

- Frontier Note: ${state.packArtifacts?.frontierNotePath || '(none)'}
- Route History: ${state.packArtifacts?.routeHistoryPath || '(none)'}
- Checkpoint Template: ${state.packArtifacts?.checkpointTemplatePath || '(none)'}
- Report Template: ${state.packArtifacts?.reportTemplatePath || '(none)'}

## Next Honest Move

- ${state.nextHonestMove}
`;
}

function deriveGenericProblemSummary(problem) {
  const research = problem.researchState ?? {};
  const solvedBySite = String(problem.siteStatus ?? '').toLowerCase() === 'solved';
  const activeRoute = research.active_route ?? null;
  const routeBreakthrough = typeof research.route_breakthrough === 'boolean'
    ? research.route_breakthrough
    : false;
  const problemSolved = typeof research.problem_solved === 'boolean'
    ? research.problem_solved
    : solvedBySite;
  const openProblem = typeof research.open_problem === 'boolean'
    ? research.open_problem
    : !solvedBySite;

  let nextHonestMove = 'Pull the dossier and upstream artifacts into the workspace before making new claims.';
  if (problemSolved) {
    nextHonestMove = 'Archive the solved-problem dossier and move to the next open problem.';
  } else if (routeBreakthrough) {
    nextHonestMove = 'Record a checkpoint for the route breakthrough, then choose the next active route.';
  } else if (activeRoute) {
    nextHonestMove = 'Tighten the active route against the dossier, pull bundle, and evidence record.';
  }

  return {
    familyRole: null,
    harnessProfile: problem.harnessDepth,
    activeRoute,
    routeBreakthrough,
    problemSolved,
    openProblem,
    currentFrontier: {
      kind: activeRoute ? 'active_route' : 'dossier',
      detail: problem.shortStatement || 'No normalized short statement is recorded yet.',
    },
    routeStory: activeRoute
      ? `Advance ${activeRoute} without blurring local route state into global problem status.`
      : 'No active route is recorded for this dossier yet.',
    checkpointFocus: 'Keep dossier truth, import provenance, and local route state sharply separated.',
    nextHonestMove,
    packArtifacts: null,
    activeTicketId: null,
    activeAtomId: null,
    questionLedger: {
      openQuestions: ['What is the next smallest honest route or evidence obligation for this problem?'],
      activeRouteNotes: activeRoute ? [`Current active route: ${activeRoute}`] : [],
      routeBreakthroughs: routeBreakthrough ? ['A route breakthrough is recorded; checkpoint it before widening claims.'] : [],
      problemSolved: problemSolved ? ['This problem is marked solved in local research state.'] : [],
    },
  };
}

function deriveProblemSummary(problem) {
  if (problem.cluster === 'sunflower') {
    const sunflower = buildSunflowerStatusSnapshot(problem);
    const frontierKind = sunflower.firstReadyAtom
      ? 'ready_atom'
      : sunflower.atomicBoardPresent
        ? 'atomic_board'
        : sunflower.activePacket
          ? 'compute_lane'
          : (sunflower.frontierLabel ? 'route_frontier' : 'pack_context');
    const frontierDetail = sunflower.firstReadyAtom
      ? `${sunflower.firstReadyAtom.atomId} — ${sunflower.firstReadyAtom.title}`
      : sunflower.frontierDetail || sunflower.computeSummary || sunflower.bootstrapFocus || problem.shortStatement;
    const routeStory = sunflower.activeTicket
      ? `Work ${sunflower.activeTicket.ticketId} (${sunflower.activeTicket.ticketName}) without blurring ticket-local pressure into solved-problem claims.`
      : (sunflower.activeRouteDetail?.summary || sunflower.routeStory || sunflower.bootstrapFocus || null);
    const checkpointFocus = sunflower.activeTicket
      ? `Keep the board packet honest around ${sunflower.activeTicket.ticketId} while preserving the open-problem / active-route / route-breakthrough ladder.`
      : (sunflower.activeRouteDetail?.whyNow || sunflower.checkpointFocus || null);
    return {
      familyRole: sunflower.familyRole,
      harnessProfile: sunflower.harnessProfile,
      activeRoute: sunflower.activeRoute,
      routeBreakthrough: sunflower.routeBreakthrough,
      problemSolved: sunflower.problemSolved,
      openProblem: sunflower.openProblem,
      currentFrontier: {
        kind: frontierKind,
        detail: frontierDetail,
      },
      routeStory,
      checkpointFocus,
      nextHonestMove:
        sunflower.activeAtomDetail?.nextMove
        || sunflower.activeTicketDetail?.nextMove
        || sunflower.nextHonestMove
        || sunflower.computeNextAction
        || 'Refresh the active route and package a new honest checkpoint.',
      packArtifacts: {
        frontierNotePath: sunflower.frontierNotePath,
        routeHistoryPath: sunflower.routeHistoryPath,
        checkpointTemplatePath: sunflower.checkpointTemplatePath,
        reportTemplatePath: sunflower.reportTemplatePath,
      },
      activeTicketId: sunflower.activeTicket?.ticketId ?? null,
      activeAtomId: sunflower.firstReadyAtom?.atomId ?? null,
      questionLedger: sunflower.questionLedger,
    };
  }

  if (problem.cluster === 'number-theory') {
    const snapshot = buildNumberTheoryStatusSnapshot(problem);
    return {
      familyRole: snapshot.familyRole,
      harnessProfile: snapshot.harnessProfile,
      activeRoute: snapshot.activeRoute,
      routeBreakthrough: snapshot.routeBreakthrough,
      problemSolved: snapshot.problemSolved,
      openProblem: snapshot.openProblem,
      currentFrontier: {
        kind: snapshot.firstReadyAtom ? 'ready_atom' : 'route_frontier',
        detail: snapshot.firstReadyAtom
          ? `${snapshot.firstReadyAtom.atom_id} — ${snapshot.firstReadyAtom.title}`
          : snapshot.frontierDetail,
      },
      routeStory: snapshot.activeRouteDetail?.summary || snapshot.routeStory,
      checkpointFocus: snapshot.checkpointFocus,
      nextHonestMove: snapshot.nextHonestMove,
      packArtifacts: {
        frontierNotePath: snapshot.frontierNotePath,
        routeHistoryPath: snapshot.routeHistoryPath,
        checkpointTemplatePath: snapshot.checkpointTemplatePath,
        reportTemplatePath: snapshot.reportTemplatePath,
      },
      activeTicketId: snapshot.activeTicketDetail?.ticket_id ?? null,
      activeAtomId: snapshot.firstReadyAtom?.atom_id ?? null,
      questionLedger: snapshot.questionLedger,
    };
  }

  if (problem.cluster === 'graph-theory') {
    const snapshot = buildGraphTheoryStatusSnapshot(problem);
    return {
      familyRole: snapshot.familyRole,
      harnessProfile: snapshot.harnessProfile,
      activeRoute: snapshot.activeRoute,
      routeBreakthrough: snapshot.routeBreakthrough,
      problemSolved: snapshot.problemSolved,
      openProblem: snapshot.openProblem,
      currentFrontier: {
        kind: snapshot.firstReadyAtom ? 'ready_atom' : 'route_frontier',
        detail: snapshot.firstReadyAtom
          ? `${snapshot.firstReadyAtom.atom_id} — ${snapshot.firstReadyAtom.title}`
          : snapshot.frontierDetail,
      },
      routeStory: snapshot.activeRouteDetail?.summary || snapshot.routeStory,
      checkpointFocus: snapshot.checkpointFocus,
      nextHonestMove: snapshot.nextHonestMove,
      packArtifacts: {
        frontierNotePath: snapshot.frontierNotePath,
        routeHistoryPath: snapshot.routeHistoryPath,
        checkpointTemplatePath: snapshot.checkpointTemplatePath,
        reportTemplatePath: snapshot.reportTemplatePath,
      },
      activeTicketId: snapshot.activeTicketDetail?.ticket_id ?? null,
      activeAtomId: snapshot.firstReadyAtom?.atom_id ?? null,
      questionLedger: snapshot.questionLedger,
    };
  }

  return deriveGenericProblemSummary(problem);
}

export function loadState(workspaceRoot = getWorkspaceRoot()) {
  const config = loadConfig(workspaceRoot);
  const statePath = getWorkspaceStatePath(workspaceRoot);
  if (!fileExists(statePath)) {
    return defaultState(config, workspaceRoot);
  }

  const raw = readJson(statePath);
  return {
    ...defaultState(config, workspaceRoot),
    ...raw,
    workspaceRoot,
    continuation: resolveContinuation(raw.continuation || { requestedMode: config.continuation }),
  };
}

export function saveState(state, workspaceRoot = getWorkspaceRoot()) {
  const payload = {
    ...state,
    workspaceRoot,
    updatedAt: new Date().toISOString(),
  };
  writeJson(getWorkspaceStatePath(workspaceRoot), payload);
  writeText(getWorkspaceStateMarkdownPath(workspaceRoot), renderStateMarkdown(payload));
  return payload;
}

export function syncState(workspaceRoot = getWorkspaceRoot()) {
  const config = ensureConfig(workspaceRoot);
  const existing = loadState(workspaceRoot);
  const activeProblemId = readCurrentProblem(workspaceRoot);

  if (!activeProblemId) {
    const resetState = {
      ...existing,
      ...defaultState(config, workspaceRoot),
      createdAt: existing.createdAt ?? new Date().toISOString(),
      lastCheckpointSyncAt: existing.lastCheckpointSyncAt ?? null,
    };
    return saveState(resetState, workspaceRoot);
  }

  const problem = getProblem(activeProblemId);
  if (!problem) {
    const resetState = {
      ...existing,
      ...defaultState(config, workspaceRoot),
      createdAt: existing.createdAt ?? new Date().toISOString(),
      activeProblem: activeProblemId,
      currentFrontier: {
        kind: 'unknown_problem',
        detail: 'The active problem is selected in the workspace but missing from the local catalog.',
      },
      nextHonestMove: 'Re-sync the atlas or choose a cataloged problem before continuing.',
    };
    return saveState(resetState, workspaceRoot);
  }

  const summary = deriveProblemSummary(problem);
  const nextState = {
    ...existing,
    workspaceRoot,
    createdAt: existing.createdAt ?? new Date().toISOString(),
    activeProblem: problem.problemId,
    problemTitle: problem.title,
    cluster: problem.cluster,
    familyRole: summary.familyRole,
    harnessProfile: summary.harnessProfile,
    activeRoute: summary.activeRoute,
    routeBreakthrough: summary.routeBreakthrough,
    problemSolved: summary.problemSolved,
    openProblem: summary.openProblem,
    activeAgent: config.preferredAgent,
    continuation: resolveContinuation({ requestedMode: config.continuation }),
    currentFrontier: summary.currentFrontier,
    routeStory: summary.routeStory,
    checkpointFocus: summary.checkpointFocus,
    nextHonestMove: summary.nextHonestMove,
    packArtifacts: summary.packArtifacts,
    activeTicketId: summary.activeTicketId,
    activeAtomId: summary.activeAtomId,
    lastCheckpointSyncAt: existing.lastCheckpointSyncAt ?? null,
  };

  const saved = saveState(nextState, workspaceRoot);
  const ledgerPath = getWorkspaceQuestionLedgerPath(workspaceRoot);
  if (!fileExists(ledgerPath)) {
    writeText(ledgerPath, buildQuestionLedger(summary));
  }
  return saved;
}
