import path from 'node:path';
import { getProblem } from '../atlas/catalog.js';
import { ensureDir, writeJson, writeText } from '../runtime/files.js';
import { getWorkspaceProblemPullDir } from '../runtime/paths.js';
import { scaffoldProblem } from '../runtime/problem-artifacts.js';
import { loadActiveUpstreamSnapshot, syncUpstream } from '../upstream/sync.js';
import { fetchProblemSiteSnapshot } from '../upstream/site.js';

function parsePullArgs(args) {
  const [kind, value, ...rest] = args;
  if (kind !== 'problem') {
    return { error: 'Only `erdos pull problem <id>` is supported right now.' };
  }

  let destination = null;
  let includeSite = false;
  let refreshUpstream = false;

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token === '--dest') {
      destination = rest[index + 1];
      if (!destination) {
        return { error: 'Missing destination path after --dest.' };
      }
      index += 1;
      continue;
    }
    if (token === '--include-site') {
      includeSite = true;
      continue;
    }
    if (token === '--refresh-upstream') {
      refreshUpstream = true;
      continue;
    }
    return { error: `Unknown pull option: ${token}` };
  }

  return {
    problemId: value,
    destination,
    includeSite,
    refreshUpstream,
  };
}

function writeUpstreamOnlyBundle(problemId, destination, upstreamRecord, snapshot) {
  ensureDir(destination);

  if (upstreamRecord) {
    writeJson(path.join(destination, 'UPSTREAM_RECORD.json'), upstreamRecord);
  }

  const generatedAt = new Date().toISOString();
  writeJson(path.join(destination, 'PROBLEM.json'), {
    generatedAt,
    problemId,
    title: `Erdos Problem #${problemId}`,
    cluster: null,
    siteStatus: upstreamRecord?.status?.state ?? 'unknown',
    repoStatus: 'upstream-only',
    harnessDepth: 'unseeded',
    sourceUrl: `https://www.erdosproblems.com/${problemId}`,
    activeRoute: null,
  });

  writeJson(path.join(destination, 'ARTIFACT_INDEX.json'), {
    generatedAt,
    problemId,
    copiedArtifacts: [],
    canonicalArtifacts: [],
    upstreamSnapshot: snapshot
      ? {
          kind: snapshot.kind,
          manifestPath: snapshot.manifestPath,
          indexPath: snapshot.indexPath,
          yamlPath: snapshot.yamlPath,
          upstreamCommit: snapshot.manifest.upstream_commit ?? null,
          fetchedAt: snapshot.manifest.fetched_at,
        }
      : null,
    includedUpstreamRecord: Boolean(upstreamRecord),
  });

  writeText(
    path.join(destination, 'README.md'),
    [
      `# Erdos Problem ${problemId} Pull Bundle`,
      '',
      'This bundle was generated from upstream public metadata.',
      '',
      `- Source: https://www.erdosproblems.com/${problemId}`,
      `- Upstream record included: ${upstreamRecord ? 'yes' : 'no'}`,
      '',
      'This problem is not yet seeded locally as a canonical dossier in this package.',
      '',
    ].join('\n'),
  );
}

async function maybeWriteSiteBundle(problemId, destination, includeSite) {
  if (!includeSite) {
    return { attempted: false, included: false, error: null };
  }

  try {
    const siteSnapshot = await fetchProblemSiteSnapshot(problemId);
    writeText(path.join(destination, 'SITE_SNAPSHOT.html'), siteSnapshot.html);
    writeText(path.join(destination, 'SITE_EXTRACT.txt'), siteSnapshot.text);
    writeJson(path.join(destination, 'SITE_EXTRACT.json'), {
      url: siteSnapshot.url,
      fetchedAt: siteSnapshot.fetchedAt,
      title: siteSnapshot.title,
      previewLines: siteSnapshot.previewLines,
    });
    writeText(
      path.join(destination, 'SITE_SUMMARY.md'),
      [
        `# Erdős Problem #${problemId} Site Summary`,
        '',
        `Source: ${siteSnapshot.url}`,
        `Fetched at: ${siteSnapshot.fetchedAt}`,
        `Title: ${siteSnapshot.title}`,
        '',
        '## Preview',
        '',
        ...siteSnapshot.previewLines.map((line) => `- ${line}`),
        '',
      ].join('\n'),
    );
    return { attempted: true, included: true, error: null };
  } catch (error) {
    writeText(path.join(destination, 'SITE_FETCH_ERROR.txt'), String(error.message ?? error));
    return { attempted: true, included: false, error: String(error.message ?? error) };
  }
}

export async function runPullCommand(args) {
  if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
    console.log('Usage:');
    console.log('  erdos pull problem <id> [--dest <path>] [--include-site] [--refresh-upstream]');
    return 0;
  }

  const parsed = parsePullArgs(args);
  if (parsed.error) {
    console.error(parsed.error);
    return 1;
  }
  if (!parsed.problemId) {
    console.error('Missing problem id.');
    return 1;
  }

  if (parsed.refreshUpstream) {
    await syncUpstream();
  }

  const localProblem = getProblem(parsed.problemId);
  const snapshot = loadActiveUpstreamSnapshot();
  const upstreamRecord = snapshot?.index?.by_number?.[String(parsed.problemId)] ?? null;

  if (!localProblem && !upstreamRecord) {
    console.error(`Problem ${parsed.problemId} is not present in the local dossier set or upstream snapshot.`);
    return 1;
  }

  const destination = parsed.destination
    ? path.resolve(parsed.destination)
    : getWorkspaceProblemPullDir(parsed.problemId);

  let scaffoldResult = null;
  if (localProblem) {
    scaffoldResult = scaffoldProblem(localProblem, destination);
  } else {
    writeUpstreamOnlyBundle(String(parsed.problemId), destination, upstreamRecord, snapshot);
  }


  const siteStatus = await maybeWriteSiteBundle(String(parsed.problemId), destination, parsed.includeSite);

  writeJson(path.join(destination, 'PULL_STATUS.json'), {
    generatedAt: new Date().toISOString(),
    problemId: String(parsed.problemId),
    usedLocalDossier: Boolean(localProblem),
    includedUpstreamRecord: Boolean(upstreamRecord),
    upstreamSnapshotKind: snapshot?.kind ?? null,
    siteSnapshotAttempted: siteStatus.attempted,
    siteSnapshotIncluded: siteStatus.included,
    siteSnapshotError: siteStatus.error,
    scaffoldArtifactsCopied: scaffoldResult?.copiedArtifacts.length ?? 0,
  });

  console.log(`Pull bundle created: ${destination}`);
  console.log(`Local canonical dossier included: ${localProblem ? 'yes' : 'no'}`);
  console.log(`Upstream record included: ${upstreamRecord ? 'yes' : 'no'}`);
  console.log(`Live site snapshot included: ${siteStatus.included ? 'yes' : 'no'}`);
  if (siteStatus.error) {
    console.log(`Live site snapshot note: ${siteStatus.error}`);
  }
  return 0;
}
