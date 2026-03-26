import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { getProblemDir, getWorkspaceRoot, getWorkspaceSeededProblemsDir, repoRoot } from '../runtime/paths.js';

function readProblemRecordFromDir(problemDir) {
  const yamlPath = path.join(problemDir, 'problem.yaml');
  const record = parse(fs.readFileSync(yamlPath, 'utf8'));
  return { problemDir, record };
}

function toCatalogProblem(problemDir, record, sourceKind) {
  const statementRelative = record.statement?.normalized_md_path ?? 'STATEMENT.md';
  const referencesRelative = record.references_path ?? 'REFERENCES.md';
  const evidenceRelative = record.evidence_path ?? 'EVIDENCE.md';
  const formalizationRelative = record.formalization_path ?? 'FORMALIZATION.md';

  return {
    problemId: String(record.problem_id),
    displayName: record.display_name,
    title: record.title,
    sourceUrl: record.source?.url,
    sourceSite: record.source?.site,
    siteStatus: record.status?.site_status ?? 'unknown',
    siteBadge: record.status?.site_badge ?? String(record.status?.site_status ?? 'unknown').toUpperCase(),
    repoStatus: record.status?.repo_status ?? 'cataloged',
    upstreamStatus: record.status?.upstream_status ?? null,
    upstreamLastUpdate: record.status?.upstream_last_update ?? null,
    cluster: record.cluster ?? 'uncategorized',
    prize: record.prize?.display ?? null,
    familyTags: record.family_tags ?? [],
    relatedProblems: record.related_problems ?? [],
    harnessDepth: record.harness?.depth ?? 'dossier',
    shortStatement: record.statement?.short ?? '',
    formalizationStatus: record.formalization?.status ?? 'unstarted',
    upstreamFormalizedState: record.formalization?.upstream_state ?? null,
    upstreamFormalizedLastUpdate: record.formalization?.upstream_last_update ?? null,
    researchState: record.research_state ?? null,
    upstream: record.upstream ?? null,
    statementPath: path.join(problemDir, statementRelative),
    referencesPath: path.join(problemDir, referencesRelative),
    evidencePath: path.join(problemDir, evidenceRelative),
    formalizationPath: path.join(problemDir, formalizationRelative),
    problemDir,
    problemYamlPath: path.join(problemDir, 'problem.yaml'),
    record,
    sourceKind,
  };
}

function listProblemDirectories(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }
  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(rootDir, entry.name));
}

export function loadLocalProblems(workspaceRoot = getWorkspaceRoot()) {
  const packageRoot = path.join(repoRoot, 'problems');
  const workspaceRootDir = getWorkspaceSeededProblemsDir(workspaceRoot);
  const merged = new Map();

  for (const problemDir of listProblemDirectories(packageRoot)) {
    const { record } = readProblemRecordFromDir(problemDir);
    merged.set(String(record.problem_id), toCatalogProblem(problemDir, record, 'package'));
  }

  for (const problemDir of listProblemDirectories(workspaceRootDir)) {
    const { record } = readProblemRecordFromDir(problemDir);
    merged.set(String(record.problem_id), toCatalogProblem(problemDir, record, 'workspace'));
  }

  return [...merged.values()].sort((left, right) => Number(left.problemId) - Number(right.problemId));
}

export function listProblems(filters = {}, workspaceRoot = getWorkspaceRoot()) {
  const cluster = filters.cluster ? String(filters.cluster).toLowerCase() : null;
  const repoStatus = filters.repoStatus ? String(filters.repoStatus).toLowerCase() : null;
  const harnessDepth = filters.harnessDepth ? String(filters.harnessDepth).toLowerCase() : null;
  const siteStatus = filters.siteStatus ? String(filters.siteStatus).toLowerCase() : null;

  return loadLocalProblems(workspaceRoot)
    .filter((entry) => (cluster ? entry.cluster === cluster : true))
    .filter((entry) => (repoStatus ? entry.repoStatus === repoStatus : true))
    .filter((entry) => (harnessDepth ? entry.harnessDepth === harnessDepth : true))
    .filter((entry) => (siteStatus ? entry.siteStatus === siteStatus : true));
}

export function getProblem(problemId, workspaceRoot = getWorkspaceRoot()) {
  return loadLocalProblems(workspaceRoot).find((entry) => entry.problemId === String(problemId));
}

export function getCluster(clusterName, workspaceRoot = getWorkspaceRoot()) {
  const name = String(clusterName).toLowerCase();
  const problems = listProblems({ cluster: name }, workspaceRoot);
  if (problems.length === 0) {
    return null;
  }
  return {
    name,
    problems,
    deepHarnessProblems: problems.filter((entry) => entry.harnessDepth === 'deep'),
    dossierProblems: problems.filter((entry) => entry.harnessDepth === 'dossier'),
  };
}

export function listClusters(workspaceRoot = getWorkspaceRoot()) {
  const names = [...new Set(loadLocalProblems(workspaceRoot).map((entry) => entry.cluster))].sort();
  return names.map((name) => getCluster(name, workspaceRoot));
}

export function clearCatalogCache() {
  return null;
}
