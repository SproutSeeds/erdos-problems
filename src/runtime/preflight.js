import {
  getProblem,
} from '../atlas/catalog.js';
import { ensureConfig, loadConfig } from './config.js';
import { fileExists, writeJson } from './files.js';
import { gitSummary } from './git.js';
import {
  getWorkspaceCheckpointIndexPath,
  getWorkspaceConfigPath,
  getWorkspaceDir,
  getWorkspaceQuestionLedgerPath,
  getWorkspaceRegistryBucketDir,
  getWorkspaceRoot,
  getWorkspaceStateMarkdownPath,
  getWorkspaceStatePath,
} from './paths.js';
import { getProblemArtifactInventory } from './problem-artifacts.js';
import { getOrpStatus } from './orp.js';
import { syncState } from './state.js';

function checkpointPath(workspaceRoot) {
  return getWorkspaceCheckpointIndexPath(workspaceRoot);
}

export function buildPreflightReport(options = {}, workspaceRoot = getWorkspaceRoot()) {
  ensureConfig(workspaceRoot);
  const config = loadConfig(workspaceRoot);
  const state = syncState(workspaceRoot);
  const problem = state.activeProblem ? getProblem(state.activeProblem) : null;
  const inventory = problem ? getProblemArtifactInventory(problem) : null;
  const orp = getOrpStatus(workspaceRoot);
  const git = gitSummary(workspaceRoot);

  const checks = {
    erdosRuntime: {
      ok: fileExists(getWorkspaceDir(workspaceRoot)),
      detail: getWorkspaceDir(workspaceRoot),
    },
    configFile: {
      ok: fileExists(getWorkspaceConfigPath(workspaceRoot)),
      detail: getWorkspaceConfigPath(workspaceRoot),
    },
    stateFile: {
      ok: fileExists(getWorkspaceStatePath(workspaceRoot)),
      detail: getWorkspaceStatePath(workspaceRoot),
    },
    stateMarkdown: {
      ok: fileExists(getWorkspaceStateMarkdownPath(workspaceRoot)),
      detail: getWorkspaceStateMarkdownPath(workspaceRoot),
    },
    questionLedger: {
      ok: fileExists(getWorkspaceQuestionLedgerPath(workspaceRoot)),
      detail: getWorkspaceQuestionLedgerPath(workspaceRoot),
    },
    checkpointShelf: {
      ok: fileExists(checkpointPath(workspaceRoot)),
      detail: checkpointPath(workspaceRoot),
    },
    orpProtocol: {
      ok: orp.workspace.protocolPresent,
      detail: orp.workspace.protocolPath,
    },
    orpIntegration: {
      ok: orp.workspace.integrationPresent,
      detail: orp.workspace.integrationPath,
    },
    orpTemplates: {
      ok: orp.workspace.templateNames.length >= 3,
      detail: `${orp.workspace.templateNames.length} template(s)`,
    },
    activeProblem: {
      ok: Boolean(problem),
      detail: problem ? `${problem.problemId} (${problem.title})` : '(none)',
    },
    activeRoute: {
      ok: !problem || problem.harnessDepth !== 'deep' ? true : Boolean(state.activeRoute),
      detail: state.activeRoute || '(none)',
    },
    canonicalDossier: {
      ok: !inventory ? false : inventory.canonicalArtifacts.every((artifact) => artifact.exists),
      detail: inventory ? `${inventory.canonicalArtifacts.filter((artifact) => artifact.exists).length}/${inventory.canonicalArtifacts.length} canonical file(s)` : '(no active problem)',
    },
    upstreamSnapshot: {
      ok: Boolean(inventory?.upstreamSnapshot),
      detail: inventory?.upstreamSnapshot?.kind ?? '(missing)',
    },
    workspaceGit: {
      ok: options.allowDirty ? true : git.clean !== false,
      detail: git.isGitRepo ? `${git.branch || '(unknown branch)'} / ${git.detail}` : git.detail,
    },
  };

  let verdict = 'ok';
  if (!checks.erdosRuntime.ok || !checks.configFile.ok || !checks.stateFile.ok || !checks.activeProblem.ok || !checks.canonicalDossier.ok || !checks.upstreamSnapshot.ok) {
    verdict = 'blocked';
  } else if (!checks.questionLedger.ok || !checks.checkpointShelf.ok || !checks.orpProtocol.ok || !checks.orpIntegration.ok || !checks.orpTemplates.ok || !checks.activeRoute.ok || !checks.workspaceGit.ok) {
    verdict = 'needs_attention';
  }

  const record = {
    checkedAt: new Date().toISOString(),
    workspaceRoot,
    verdict,
    activeProblem: state.activeProblem,
    problemTitle: state.problemTitle,
    activeRoute: state.activeRoute,
    routeBreakthrough: state.routeBreakthrough,
    problemSolved: state.problemSolved,
    continuationMode: state.continuation.mode,
    continuationDisplay: state.continuation.requestedMode === 'phase' ? 'route (phase-style)' : state.continuation.mode,
    activeAgent: config.preferredAgent,
    currentFrontier: state.currentFrontier,
    nextHonestMove: state.nextHonestMove,
    checks,
  };

  const registryPath = `${Date.now()}.json`;
  writeJson(`${getWorkspaceRegistryBucketDir('preflight', workspaceRoot)}/${registryPath}`, record);
  return record;
}
