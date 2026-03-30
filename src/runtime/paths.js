import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const repoRoot = path.resolve(here, '..', '..');

export function getWorkspaceRoot() {
  return process.cwd();
}

export function getWorkspaceDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(workspaceRoot, '.erdos');
}

export function getWorkspaceOrpDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'orp');
}

export function getWorkspaceOrpProtocolPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceOrpDir(workspaceRoot), 'PROTOCOL.md');
}

export function getWorkspaceOrpIntegrationPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceOrpDir(workspaceRoot), 'AGENT_INTEGRATION.md');
}

export function getWorkspaceOrpTemplatesDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceOrpDir(workspaceRoot), 'templates');
}

export function getWorkspaceConfigPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'config.json');
}

export function getWorkspaceRegistryDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'registry');
}

export function getWorkspaceRegistryBucketDir(bucket, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceRegistryDir(workspaceRoot), String(bucket));
}

export function getWorkspaceComputeRegistryDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceRegistryDir(workspaceRoot), 'compute');
}

export function getWorkspaceStatePath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'state.json');
}

export function getWorkspaceStateMarkdownPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'STATE.md');
}

export function getWorkspaceQuestionLedgerPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'QUESTION-LEDGER.md');
}

export function getCurrentProblemPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'current-problem.json');
}

export function getWorkspaceReportsDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'reports');
}

export function getWorkspaceDiffPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceReportsDir(workspaceRoot), 'UPSTREAM_DIFF.md');
}

export function getWorkspaceUpstreamDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'upstream', 'erdosproblems');
}

export function getWorkspaceUpstreamYamlPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceUpstreamDir(workspaceRoot), 'problems.yaml');
}

export function getWorkspaceUpstreamIndexPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceUpstreamDir(workspaceRoot), 'PROBLEMS_INDEX.json');
}

export function getWorkspaceUpstreamManifestPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceUpstreamDir(workspaceRoot), 'SYNC_MANIFEST.json');
}

export function getWorkspaceScaffoldsDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'scaffolds');
}

export function getWorkspaceProblemScaffoldDir(problemId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceScaffoldsDir(workspaceRoot), String(problemId));
}

export function getWorkspacePullsDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'pulls');
}

export function getWorkspaceProblemPullDir(problemId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspacePullsDir(workspaceRoot), String(problemId));
}

export function getWorkspaceProblemArtifactDir(problemId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceProblemPullDir(problemId, workspaceRoot), 'artifacts');
}

export function getWorkspaceProblemLiteratureDir(problemId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceProblemPullDir(problemId, workspaceRoot), 'literature');
}

export function getWorkspaceSeededProblemsDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'seeded-problems');
}

export function getWorkspaceSeededProblemDir(problemId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceSeededProblemsDir(workspaceRoot), String(problemId));
}

export function getWorkspaceCheckpointsDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'checkpoints');
}

export function getWorkspaceRunsDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'runs');
}

export function getWorkspaceRunDir(runId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceRunsDir(workspaceRoot), String(runId));
}

export function getWorkspaceArchivesDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'archives');
}

export function getWorkspaceArchiveDir(problemId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceArchivesDir(workspaceRoot), String(problemId));
}

export function getWorkspacePapersDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'papers');
}

export function getWorkspaceProblemPaperDir(problemId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspacePapersDir(workspaceRoot), String(problemId));
}

export function getWorkspaceProblemCheckpointsDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceCheckpointsDir(workspaceRoot), 'problem-checkpoints');
}

export function getWorkspaceRouteCheckpointsDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceCheckpointsDir(workspaceRoot), 'route-checkpoints');
}

export function getWorkspaceCheckpointIndexPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceCheckpointsDir(workspaceRoot), 'CHECKPOINTS.md');
}

export function getWorkspaceCheckpointJsonPath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceCheckpointsDir(workspaceRoot), 'CHECKPOINTS.json');
}

export function getProblemDir(problemId) {
  return path.join(repoRoot, 'problems', String(problemId));
}

export function getBundledDataDir() {
  return path.join(repoRoot, 'data');
}

export function getBundledOrpProtocolPath() {
  return path.join(repoRoot, 'PROTOCOL.md');
}

export function getBundledOrpIntegrationPath() {
  return path.join(repoRoot, 'AGENT_INTEGRATION.md');
}

export function getBundledOrpTemplatesDir() {
  return path.join(repoRoot, 'templates');
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

export function getRepoPaperDir() {
  return path.join(repoRoot, 'paper');
}

export function getRepoProblemPaperDir(problemId) {
  return path.join(getRepoPaperDir(), 'problems', String(problemId));
}

export function getPackDir(packName) {
  return path.join(repoRoot, 'packs', String(packName));
}

export function getPackProblemDir(packName, problemId) {
  return path.join(getPackDir(packName), 'problems', String(problemId));
}
