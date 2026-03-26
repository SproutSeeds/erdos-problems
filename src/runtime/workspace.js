import fs from 'node:fs';
import {
  getCurrentProblemPath,
  getWorkspaceCheckpointIndexPath,
  getWorkspaceConfigPath,
  getWorkspaceDir,
  getWorkspaceProblemArtifactDir,
  getWorkspaceProblemLiteratureDir,
  getWorkspaceProblemPullDir,
  getWorkspaceProblemScaffoldDir,
  getWorkspaceQuestionLedgerPath,
  getWorkspaceRoot,
  getWorkspaceStateMarkdownPath,
  getWorkspaceStatePath,
  getWorkspaceUpstreamDir,
} from './paths.js';
import { writeJson } from './files.js';

export function readWorkspaceState(workspaceRoot = getWorkspaceRoot()) {
  const filePath = getWorkspaceStatePath(workspaceRoot);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function ensureWorkspaceState(workspaceRoot = getWorkspaceRoot()) {
  const existing = readWorkspaceState(workspaceRoot);
  if (existing) {
    return existing;
  }
  const now = new Date().toISOString();
  const state = {
    workspaceRoot,
    createdAt: now,
    updatedAt: now,
  };
  writeJson(getWorkspaceStatePath(workspaceRoot), state);
  return state;
}

export function setCurrentProblem(problemId, workspaceRoot = getWorkspaceRoot()) {
  const existing = ensureWorkspaceState(workspaceRoot);
  const now = new Date().toISOString();
  writeJson(getCurrentProblemPath(workspaceRoot), {
    problemId: String(problemId),
    selectedAt: now,
  });
  writeJson(getWorkspaceStatePath(workspaceRoot), {
    ...existing,
    workspaceRoot,
    updatedAt: now,
    activeProblem: String(problemId),
  });
}

export function readCurrentProblem(workspaceRoot = getWorkspaceRoot()) {
  const filePath = getCurrentProblemPath(workspaceRoot);
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return payload.problemId ?? null;
}

export function getWorkspaceSummary(workspaceRoot = getWorkspaceRoot()) {
  const state = readWorkspaceState(workspaceRoot);
  const activeProblem = readCurrentProblem(workspaceRoot);
  return {
    workspaceRoot,
    stateDir: getWorkspaceDir(workspaceRoot),
    hasState: Boolean(state),
    activeProblem,
    configPath: getWorkspaceConfigPath(workspaceRoot),
    statePath: getWorkspaceStatePath(workspaceRoot),
    stateMarkdownPath: getWorkspaceStateMarkdownPath(workspaceRoot),
    questionLedgerPath: getWorkspaceQuestionLedgerPath(workspaceRoot),
    checkpointIndexPath: getWorkspaceCheckpointIndexPath(workspaceRoot),
    upstreamDir: getWorkspaceUpstreamDir(workspaceRoot),
    scaffoldDir: activeProblem ? getWorkspaceProblemScaffoldDir(activeProblem, workspaceRoot) : getWorkspaceProblemScaffoldDir('<problem-id>', workspaceRoot),
    pullDir: activeProblem ? getWorkspaceProblemPullDir(activeProblem, workspaceRoot) : getWorkspaceProblemPullDir('<problem-id>', workspaceRoot),
    artifactDir: activeProblem ? getWorkspaceProblemArtifactDir(activeProblem, workspaceRoot) : getWorkspaceProblemArtifactDir('<problem-id>', workspaceRoot),
    literatureDir: activeProblem ? getWorkspaceProblemLiteratureDir(activeProblem, workspaceRoot) : getWorkspaceProblemLiteratureDir('<problem-id>', workspaceRoot),
    updatedAt: state?.updatedAt ?? null,
    continuationMode: state?.continuation?.mode ?? null,
    activeRoute: state?.activeRoute ?? null,
    routeBreakthrough: state?.routeBreakthrough ?? false,
    problemSolved: state?.problemSolved ?? false,
    currentFrontier: state?.currentFrontier ?? null,
    nextHonestMove: state?.nextHonestMove ?? null,
    lastCheckpointSyncAt: state?.lastCheckpointSyncAt ?? null,
  };
}
