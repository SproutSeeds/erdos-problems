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

export function getWorkspaceRegistryDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(workspaceRoot, '.erdos', 'registry');
}

export function getWorkspaceComputeRegistryDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceRegistryDir(workspaceRoot), 'compute');
}

export function getWorkspaceStatePath() {
  return path.join(getWorkspaceDir(), 'state.json');
}

export function getCurrentProblemPath() {
  return path.join(getWorkspaceDir(), 'current-problem.json');
}

export function getWorkspaceReportsDir() {
  return path.join(getWorkspaceDir(), 'reports');
}

export function getWorkspaceDiffPath() {
  return path.join(getWorkspaceReportsDir(), 'UPSTREAM_DIFF.md');
}

export function getWorkspaceUpstreamDir() {
  return path.join(getWorkspaceDir(), 'upstream', 'erdosproblems');
}

export function getWorkspaceUpstreamYamlPath() {
  return path.join(getWorkspaceUpstreamDir(), 'problems.yaml');
}

export function getWorkspaceUpstreamIndexPath() {
  return path.join(getWorkspaceUpstreamDir(), 'PROBLEMS_INDEX.json');
}

export function getWorkspaceUpstreamManifestPath() {
  return path.join(getWorkspaceUpstreamDir(), 'SYNC_MANIFEST.json');
}

export function getWorkspaceScaffoldsDir() {
  return path.join(getWorkspaceDir(), 'scaffolds');
}

export function getWorkspaceProblemScaffoldDir(problemId) {
  return path.join(getWorkspaceScaffoldsDir(), String(problemId));
}

export function getWorkspacePullsDir() {
  return path.join(getWorkspaceDir(), 'pulls');
}

export function getWorkspaceProblemPullDir(problemId) {
  return path.join(getWorkspacePullsDir(), String(problemId));
}

export function getWorkspaceProblemArtifactDir(problemId) {
  return path.join(getWorkspaceProblemPullDir(problemId), 'artifacts');
}

export function getWorkspaceProblemLiteratureDir(problemId) {
  return path.join(getWorkspaceProblemPullDir(problemId), 'literature');
}

export function getProblemDir(problemId) {
  return path.join(repoRoot, 'problems', String(problemId));
}

export function getBundledDataDir() {
  return path.join(repoRoot, 'data');
}

export function getBundledUpstreamDir() {
  return path.join(getBundledDataDir(), 'upstream', 'erdosproblems');
}

export function getBundledUpstreamYamlPath() {
  return path.join(getBundledUpstreamDir(), 'problems.yaml');
}

export function getBundledUpstreamIndexPath() {
  return path.join(getBundledUpstreamDir(), 'PROBLEMS_INDEX.json');
}

export function getBundledUpstreamManifestPath() {
  return path.join(getBundledUpstreamDir(), 'SYNC_MANIFEST.json');
}

export function getRepoAnalysisDir() {
  return path.join(repoRoot, 'analysis');
}

export function getRepoUpstreamDiffPath() {
  return path.join(getRepoAnalysisDir(), 'UPSTREAM_DIFF.md');
}

export function getPackDir(packName) {
  return path.join(repoRoot, 'packs', String(packName));
}

export function getPackProblemDir(packName, problemId) {
  return path.join(getPackDir(packName), 'problems', String(problemId));
}
