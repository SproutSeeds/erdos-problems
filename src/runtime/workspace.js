import fs from 'node:fs';
import {
  getCurrentProblemPath,
  getWorkspaceDir,
  getWorkspaceProblemArtifactDir,
  getWorkspaceProblemLiteratureDir,
  getWorkspaceProblemPullDir,
  getWorkspaceProblemScaffoldDir,
  getWorkspaceRoot,
  getWorkspaceStatePath,
  getWorkspaceUpstreamDir,
} from './paths.js';
import { writeJson } from './files.js';

export function readWorkspaceState() {
  const filePath = getWorkspaceStatePath();
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function ensureWorkspaceState() {
  const existing = readWorkspaceState();
  if (existing) {
    return existing;
  }
  const now = new Date().toISOString();
  const state = {
    workspaceRoot: getWorkspaceRoot(),
    createdAt: now,
    updatedAt: now,
  };
  writeJson(getWorkspaceStatePath(), state);
  return state;
}

export function setCurrentProblem(problemId) {
  const existing = ensureWorkspaceState();
  const now = new Date().toISOString();
  writeJson(getCurrentProblemPath(), {
    problemId: String(problemId),
    selectedAt: now,
  });
  writeJson(getWorkspaceStatePath(), {
    workspaceRoot: getWorkspaceRoot(),
    createdAt: existing.createdAt ?? now,
    updatedAt: now,
    activeProblem: String(problemId),
  });
}

export function readCurrentProblem() {
  const filePath = getCurrentProblemPath();
  if (!fs.existsSync(filePath)) {
    return null;
  }
  const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return payload.problemId ?? null;
}

export function getWorkspaceSummary() {
  const state = readWorkspaceState();
  const activeProblem = readCurrentProblem();
  return {
    workspaceRoot: getWorkspaceRoot(),
    stateDir: getWorkspaceDir(),
    hasState: Boolean(state),
    activeProblem,
    upstreamDir: getWorkspaceUpstreamDir(),
    scaffoldDir: activeProblem ? getWorkspaceProblemScaffoldDir(activeProblem) : getWorkspaceProblemScaffoldDir('<problem-id>'),
    pullDir: activeProblem ? getWorkspaceProblemPullDir(activeProblem) : getWorkspaceProblemPullDir('<problem-id>'),
    artifactDir: activeProblem ? getWorkspaceProblemArtifactDir(activeProblem) : getWorkspaceProblemArtifactDir('<problem-id>'),
    literatureDir: activeProblem ? getWorkspaceProblemLiteratureDir(activeProblem) : getWorkspaceProblemLiteratureDir('<problem-id>'),
    updatedAt: state?.updatedAt ?? null,
  };
}
