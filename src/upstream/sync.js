import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { loadLocalProblems } from '../atlas/catalog.js';
import { ensureDir, readJson, writeJson, writeText } from '../runtime/files.js';
import {
  getBundledUpstreamDir,
  getBundledUpstreamIndexPath,
  getBundledUpstreamManifestPath,
  getBundledUpstreamYamlPath,
  getRepoUpstreamDiffPath,
  getWorkspaceDiffPath,
  getWorkspaceUpstreamDir,
  getWorkspaceUpstreamIndexPath,
  getWorkspaceUpstreamManifestPath,
  getWorkspaceUpstreamYamlPath,
} from '../runtime/paths.js';

const UPSTREAM_REPO_URL = 'https://github.com/teorth/erdosproblems';
const RAW_PROBLEMS_URL = 'https://raw.githubusercontent.com/teorth/erdosproblems/master/data/problems.yaml';
const COMMIT_API_URL = 'https://api.github.com/repos/teorth/erdosproblems/commits?path=data/problems.yaml&per_page=1';

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function normalizeTag(tag) {
  return String(tag).trim().toLowerCase();
}

function normalizeStatus(state) {
  return String(state ?? '').trim().toLowerCase();
}

function normalizeUpstreamRecord(entry) {
  return {
    number: String(entry.number),
    prize: entry.prize ?? null,
    status: {
      state: entry.status?.state ?? 'unknown',
      last_update: entry.status?.last_update ?? null,
    },
    formalized: {
      state: entry.formalized?.state ?? 'unknown',
      last_update: entry.formalized?.last_update ?? null,
    },
    tags: (entry.tags ?? []).map(normalizeTag),
    oeis: entry.oeis ?? [],
  };
}

async function fetchUpstreamCommit() {
  const response = await fetch(COMMIT_API_URL, {
    headers: {
      'User-Agent': 'erdos-problems-cli',
      Accept: 'application/vnd.github+json',
    },
  });
  if (!response.ok) {
    return null;
  }
  const payload = await response.json();
  return payload[0]?.sha ?? null;
}

export async function fetchUpstreamSnapshot() {
  const response = await fetch(RAW_PROBLEMS_URL, {
    headers: {
      'User-Agent': 'erdos-problems-cli',
      Accept: 'text/plain',
    },
  });
  if (!response.ok) {
    throw new Error(`Unable to fetch upstream problems.yaml: ${response.status}`);
  }
  const rawYaml = await response.text();
  const parsed = parse(rawYaml);
  const records = parsed.map(normalizeUpstreamRecord);
  const commit = await fetchUpstreamCommit();
  const manifest = {
    upstream_repo: UPSTREAM_REPO_URL,
    source_url: RAW_PROBLEMS_URL,
    source_file: 'data/problems.yaml',
    fetched_at: new Date().toISOString(),
    upstream_commit: commit,
    raw_sha256: sha256(rawYaml),
    entry_count: records.length,
  };
  const byNumber = Object.fromEntries(records.map((record) => [record.number, record]));
  return {
    rawYaml,
    manifest,
    index: {
      generated_at: manifest.fetched_at,
      entry_count: records.length,
      records,
      by_number: byNumber,
    },
  };
}

function loadSnapshotPaths(preferWorkspace) {
  if (preferWorkspace && fs.existsSync(getWorkspaceUpstreamIndexPath())) {
    return {
      manifestPath: getWorkspaceUpstreamManifestPath(),
      indexPath: getWorkspaceUpstreamIndexPath(),
      yamlPath: getWorkspaceUpstreamYamlPath(),
      kind: 'workspace',
    };
  }
  return {
    manifestPath: getBundledUpstreamManifestPath(),
    indexPath: getBundledUpstreamIndexPath(),
    yamlPath: getBundledUpstreamYamlPath(),
    kind: 'bundled',
  };
}

export function loadActiveUpstreamSnapshot() {
  const paths = loadSnapshotPaths(true);
  if (!fs.existsSync(paths.indexPath) || !fs.existsSync(paths.manifestPath)) {
    return null;
  }
  return {
    kind: paths.kind,
    manifest: readJson(paths.manifestPath),
    manifestPath: paths.manifestPath,
    index: readJson(paths.indexPath),
    indexPath: paths.indexPath,
    yamlPath: paths.yamlPath,
  };
}

function writeSnapshotToDirectory(directory, snapshot) {
  ensureDir(directory);
  const yamlPath = path.join(directory, 'problems.yaml');
  const indexPath = path.join(directory, 'PROBLEMS_INDEX.json');
  const manifestPath = path.join(directory, 'SYNC_MANIFEST.json');
  writeText(yamlPath, snapshot.rawYaml);
  writeJson(indexPath, snapshot.index);
  writeJson(manifestPath, snapshot.manifest);
  return { yamlPath, indexPath, manifestPath };
}

function compareTagSets(localProblem, upstreamRecord) {
  const localTags = new Set((localProblem.familyTags ?? []).map(normalizeTag));
  const upstreamTags = new Set((upstreamRecord.tags ?? []).map(normalizeTag));
  const localOnly = [...localTags].filter((tag) => !upstreamTags.has(tag)).sort();
  const upstreamOnly = [...upstreamTags].filter((tag) => !localTags.has(tag)).sort();
  return { localOnly, upstreamOnly };
}

export function buildUpstreamDiff() {
  const snapshot = loadActiveUpstreamSnapshot();
  if (!snapshot) {
    throw new Error('No upstream snapshot available. Run `erdos upstream sync` first.');
  }

  const localProblems = loadLocalProblems();
  const recordsByNumber = snapshot.index.by_number ?? {};
  const overlaps = [];
  const localOnly = [];

  for (const problem of localProblems) {
    const upstream = recordsByNumber[problem.problemId];
    if (!upstream) {
      localOnly.push(problem.problemId);
      continue;
    }

    const statusMatches = normalizeStatus(problem.siteStatus) === normalizeStatus(upstream.status.state);
    const formalizedMatches = normalizeStatus(problem.upstreamFormalizedState) === normalizeStatus(upstream.formalized.state);
    const tagDiff = compareTagSets(problem, upstream);

    overlaps.push({
      problemId: problem.problemId,
      title: problem.title,
      cluster: problem.cluster,
      localSiteStatus: problem.siteStatus,
      upstreamSiteStatus: upstream.status.state,
      statusMatches,
      localFormalized: problem.upstreamFormalizedState,
      upstreamFormalized: upstream.formalized.state,
      formalizedMatches,
      localPrize: problem.prize,
      upstreamPrize: upstream.prize,
      localOnlyTags: tagDiff.localOnly,
      upstreamOnlyTags: tagDiff.upstreamOnly,
    });
  }

  const upstreamOnly = Object.keys(recordsByNumber)
    .filter((problemId) => !localProblems.some((problem) => problem.problemId === problemId))
    .sort((a, b) => Number(a) - Number(b));

  return {
    snapshot,
    localProblemCount: localProblems.length,
    upstreamProblemCount: snapshot.index.entry_count,
    overlaps,
    localOnly,
    upstreamOnlyCount: upstreamOnly.length,
    upstreamOnlyPreview: upstreamOnly.slice(0, 20),
  };
}

export function renderUpstreamDiffMarkdown(diff) {
  const lines = [];
  lines.push('# Upstream Diff');
  lines.push('');
  lines.push(`Snapshot kind: \
${diff.snapshot.kind}`.replace('\
', ''));
  lines.push(`Upstream commit: ${diff.snapshot.manifest.upstream_commit ?? '(unknown)'}`);
  lines.push(`Fetched at: ${diff.snapshot.manifest.fetched_at}`);
  lines.push(`Local seeded problems: ${diff.localProblemCount}`);
  lines.push(`Upstream total problems: ${diff.upstreamProblemCount}`);
  lines.push(`Upstream-only problems not yet locally seeded: ${diff.upstreamOnlyCount}`);
  lines.push('');
  lines.push('## Overlap');
  lines.push('');
  lines.push('| ID | Cluster | Local site | Upstream site | Status | Local formalized | Upstream formalized | Tags |');
  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const row of diff.overlaps) {
    const status = row.statusMatches ? 'match' : 'DIFF';
    const formalized = row.formalizedMatches ? 'match' : 'DIFF';
    const tagNotes = [];
    if (row.localOnlyTags.length > 0) {
      tagNotes.push(`local-only: ${row.localOnlyTags.join(', ')}`);
    }
    if (row.upstreamOnlyTags.length > 0) {
      tagNotes.push(`upstream-only: ${row.upstreamOnlyTags.join(', ')}`);
    }
    lines.push(`| ${row.problemId} | ${row.cluster} | ${row.localSiteStatus} | ${row.upstreamSiteStatus} | ${status} | ${row.localFormalized ?? '(unset)'} | ${row.upstreamFormalized ?? '(unset)'} | ${tagNotes.join('; ') || 'match'} |`);
  }
  lines.push('');
  lines.push('## Upstream-Only Preview');
  lines.push('');
  lines.push(diff.upstreamOnlyPreview.join(', ') || '(none)');
  lines.push('');
  return lines.join('\n');
}

export async function syncUpstream({ writePackageSnapshot = false } = {}) {
  const snapshot = await fetchUpstreamSnapshot();
  const workspacePaths = writeSnapshotToDirectory(getWorkspaceUpstreamDir(), snapshot);
  let bundledPaths = null;
  if (writePackageSnapshot) {
    bundledPaths = writeSnapshotToDirectory(getBundledUpstreamDir(), snapshot);
  }
  return {
    snapshot,
    workspacePaths,
    bundledPaths,
  };
}

export function writeDiffArtifacts({ writePackageReport = false } = {}) {
  const diff = buildUpstreamDiff();
  const markdown = renderUpstreamDiffMarkdown(diff);
  writeText(getWorkspaceDiffPath(), markdown);
  if (writePackageReport) {
    writeText(getRepoUpstreamDiffPath(), markdown);
  }
  return {
    diff,
    markdown,
    workspaceDiffPath: getWorkspaceDiffPath(),
    repoDiffPath: writePackageReport ? getRepoUpstreamDiffPath() : null,
  };
}
