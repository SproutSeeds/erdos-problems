import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { getProblemDir, repoRoot } from '../runtime/paths.js';

let cachedProblems = null;

function readProblemRecord(problemId) {
  const problemDir = getProblemDir(problemId);
  const yamlPath = path.join(problemDir, 'problem.yaml');
  const record = parse(fs.readFileSync(yamlPath, 'utf8'));
  return { problemDir, record };
}

function toCatalogProblem(problemDir, record) {
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
  };
}

export function loadLocalProblems() {
  if (cachedProblems) {
    return cachedProblems;
  }
  const problemsRoot = path.join(repoRoot, 'problems');
  const directories = fs
    .readdirSync(problemsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => Number(a) - Number(b));

  cachedProblems = directories.map((problemId) => {
    const { problemDir, record } = readProblemRecord(problemId);
    return toCatalogProblem(problemDir, record);
  });
  return cachedProblems;
}

export function listProblems(filters = {}) {
  const cluster = filters.cluster ? String(filters.cluster).toLowerCase() : null;
  const repoStatus = filters.repoStatus ? String(filters.repoStatus).toLowerCase() : null;
  const harnessDepth = filters.harnessDepth ? String(filters.harnessDepth).toLowerCase() : null;
  const siteStatus = filters.siteStatus ? String(filters.siteStatus).toLowerCase() : null;

  return loadLocalProblems()
    .filter((entry) => (cluster ? entry.cluster === cluster : true))
    .filter((entry) => (repoStatus ? entry.repoStatus === repoStatus : true))
    .filter((entry) => (harnessDepth ? entry.harnessDepth === harnessDepth : true))
    .filter((entry) => (siteStatus ? entry.siteStatus === siteStatus : true));
}

export function getProblem(problemId) {
  return loadLocalProblems().find((entry) => entry.problemId === String(problemId));
}

export function getCluster(clusterName) {
  const name = String(clusterName).toLowerCase();
  const problems = listProblems({ cluster: name });
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

export function listClusters() {
  const names = [...new Set(loadLocalProblems().map((entry) => entry.cluster))].sort();
  return names.map((name) => getCluster(name));
}

export function clearCatalogCache() {
  cachedProblems = null;
}
