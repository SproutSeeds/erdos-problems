import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(here, '..', '..');

export function getWorkspaceRoot() {
  return process.cwd();
}

export function getWorkspaceDir() {
  return path.join(getWorkspaceRoot(), '.erdos');
}

export function getWorkspaceStatePath() {
  return path.join(getWorkspaceDir(), 'state.json');
}

export function getCurrentProblemPath() {
  return path.join(getWorkspaceDir(), 'current-problem.json');
}

export function getProblemDir(problemId) {
  return path.join(repoRoot, 'problems', String(problemId));
}
