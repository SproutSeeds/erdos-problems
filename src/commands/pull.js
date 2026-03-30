import path from 'node:path';
import { getProblem } from '../atlas/catalog.js';
import { copyFileIfPresent, ensureDir, writeJson, writeText } from '../runtime/files.js';
import {
  getWorkspaceProblemArtifactDir,
  getWorkspaceProblemLiteratureDir,
  getWorkspaceProblemPullDir,
} from '../runtime/paths.js';
import { getProblemArtifactInventory, scaffoldProblem } from '../runtime/problem-artifacts.js';
import { loadActiveUpstreamSnapshot, syncUpstream } from '../upstream/sync.js';
import { fetchProblemSiteSnapshot } from '../upstream/site.js';
import { buildProblemSearchQueries, fetchProblemPublicSearchReview } from '../upstream/public-search.js';
import { fetchCrossrefLiterature, fetchOpenAlexLiterature } from '../upstream/literature.js';

function normalizeClusterLabel(rawTag) {
  return String(rawTag ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inferClusterFromUpstream(upstreamRecord) {
  const normalized = Array.isArray(upstreamRecord?.tags)
    ? upstreamRecord.tags.map(normalizeClusterLabel).filter(Boolean)
    : [];
  if (normalized.includes('number-theory')) {
    return 'number-theory';
  }
  if (normalized.includes('graph-theory') || normalized.includes('chromatic-number')) {
    return 'graph-theory';
  }
  if (normalized.includes('geometry')) {
    return 'geometry';
  }
  if (normalized.includes('analysis')) {
    return 'analysis';
  }
  if (normalized.includes('combinatorics') || normalized.includes('intersecting-family')) {
    return 'combinatorics';
  }
  return null;
}

function parsePullArgs(args) {
  const [kind, value, ...rest] = args;
  if (!['problem', 'artifacts', 'literature'].includes(kind)) {
    return { error: 'Usage: erdos pull problem|artifacts|literature <id> [--dest <path>] [--include-site] [--include-public-search] [--include-crossref] [--include-openalex] [--refresh-upstream] [--json]' };
  }

  let destination = null;
  let includeSite = false;
  let includePublicSearch = false;
  let includeCrossref = false;
  let includeOpenAlex = false;
  let refreshUpstream = false;
  let asJson = false;

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
    if (token === '--include-public-search') {
      includePublicSearch = true;
      continue;
    }
    if (token === '--include-crossref') {
      includeCrossref = true;
      continue;
    }
    if (token === '--include-openalex') {
      includeOpenAlex = true;
      continue;
    }
    if (token === '--refresh-upstream') {
      refreshUpstream = true;
      continue;
    }
    if (token === '--json') {
      asJson = true;
      continue;
    }
    return { error: `Unknown pull option: ${token}` };
  }

  return {
    kind,
    problemId: value,
    destination,
    includeSite,
    includePublicSearch,
    includeCrossref,
    includeOpenAlex,
    refreshUpstream,
    asJson,
  };
}

function buildProblemRecord(problemId, localProblem, upstreamRecord) {
  return {
    generatedAt: new Date().toISOString(),
    problemId: String(problemId),
    title: localProblem?.title ?? `Erdos Problem #${problemId}`,
    cluster: localProblem?.cluster ?? inferClusterFromUpstream(upstreamRecord),
    siteStatus: localProblem?.siteStatus ?? upstreamRecord?.status?.state ?? 'unknown',
    repoStatus: localProblem?.repoStatus ?? 'upstream-only',
    harnessDepth: localProblem?.harnessDepth ?? 'unseeded',
    sourceUrl: localProblem?.sourceUrl ?? `https://www.erdosproblems.com/${problemId}`,
    activeRoute: localProblem?.researchState?.active_route ?? null,
  };
}

function writeUpstreamOnlyBundle(problemId, destination, upstreamRecord, snapshot, readmeTitle) {
  ensureDir(destination);

  if (upstreamRecord) {
    writeJson(path.join(destination, 'UPSTREAM_RECORD.json'), upstreamRecord);
  }

  const problemRecord = buildProblemRecord(problemId, null, upstreamRecord);
  writeJson(path.join(destination, 'PROBLEM.json'), problemRecord);
  writeJson(path.join(destination, 'ARTIFACT_INDEX.json'), {
    generatedAt: problemRecord.generatedAt,
    problemId: String(problemId),
    copiedArtifacts: [],
    canonicalArtifacts: [],
    packProblemArtifactsInventory: [],
    computePackets: [],
    upstreamSnapshot: snapshot
      ? {
          kind: snapshot.kind,
          manifestPath: snapshot.manifestPath,
          indexPath: snapshot.indexPath,
          yamlPath: snapshot.yamlPath,
          upstreamCommit: snapshot.manifest.imported_commit ?? snapshot.manifest.upstream_commit ?? null,
          fetchedAt: snapshot.manifest.fetched_at,
        }
      : null,
    includedUpstreamRecord: Boolean(upstreamRecord),
  });
  writeText(
    path.join(destination, 'README.md'),
    [
      `# ${readmeTitle}`,
      '',
      'This bundle was generated from upstream public metadata.',
      '',
      `- Source: https://www.erdosproblems.com/${problemId}`,
      `- Imported record included: ${upstreamRecord ? 'yes' : 'no'}`,
      '',
      'This problem is not yet seeded locally as a canonical dossier in this package.',
      '',
    ].join('\n'),
  );

  return {
    problemRecord,
    artifactsCopied: 0,
    inventory: null,
  };
}

function writeArtifactsLane(problemId, destination, localProblem, upstreamRecord, snapshot) {
  if (localProblem) {
    return scaffoldProblem(localProblem, destination);
  }

  return writeUpstreamOnlyBundle(problemId, destination, upstreamRecord, snapshot, `Erdos Problem ${problemId} Artifact Bundle`);
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
      siteStatus: siteSnapshot.siteStatus,
      siteStatusRaw: siteSnapshot.siteStatusRaw,
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
        `Site status: ${siteSnapshot.siteStatus}`,
        `Status line: ${siteSnapshot.siteStatusRaw ?? '(unknown)'}`,
        '',
        '## Preview',
        '',
        ...siteSnapshot.previewLines.map((line) => `- ${line}`),
        '',
      ].join('\n'),
    );
    return {
      attempted: true,
      included: true,
      error: null,
      siteStatus: siteSnapshot.siteStatus,
      siteStatusRaw: siteSnapshot.siteStatusRaw,
      title: siteSnapshot.title,
      previewLines: siteSnapshot.previewLines,
    };
  } catch (error) {
    writeText(path.join(destination, 'SITE_FETCH_ERROR.txt'), String(error.message ?? error));
    return {
      attempted: true,
      included: false,
      error: String(error.message ?? error),
      siteStatus: 'unknown',
      siteStatusRaw: null,
      title: null,
      previewLines: [],
    };
  }
}

async function maybeWritePublicSearchBundle(problemId, title, destination, includePublicSearch) {
  const queries = buildProblemSearchQueries(problemId, title);
  const briefLines = [
    `# Erdős Problem #${problemId} Agent Websearch Brief`,
    '',
    'Why this exists:',
    '- do not rely on erdosproblems.com alone as the canonical public truth surface',
    '- compare the site status with current publicized discussion, literature, and formalization chatter',
    '',
    'Suggested queries:',
    ...queries.map((query) => `- ${query}`),
    '',
    'Review prompts:',
    '- Does the problem still appear publicly open?',
    '- Are there recent solution claims, partial claims, or major status updates?',
    '- Are there recent formalization artifacts, surveys, or project pages worth pulling into the dossier?',
    '',
  ];

  writeText(path.join(destination, 'AGENT_WEBSEARCH_BRIEF.md'), briefLines.join('\n'));

  if (!includePublicSearch) {
    writeText(
      path.join(destination, 'PUBLIC_STATUS_REVIEW.md'),
      [
        `# Erdős Problem #${problemId} Public Status Review`,
        '',
        '- A live public search was not requested for this pull bundle.',
        '- Use `AGENT_WEBSEARCH_BRIEF.md` to run the suggested queries before widening public-status claims.',
        '',
      ].join('\n'),
    );
    return {
      attempted: false,
      included: false,
      error: null,
      queries,
      combinedResults: [],
    };
  }

  try {
    const review = await fetchProblemPublicSearchReview(problemId, title);
    writeJson(path.join(destination, 'PUBLIC_STATUS_REVIEW.json'), review);
    writeText(
      path.join(destination, 'PUBLIC_STATUS_REVIEW.md'),
      [
        `# Erdős Problem #${problemId} Public Status Review`,
        '',
        `Fetched at: ${review.fetchedAt}`,
        `Provider: ${review.provider}`,
        '',
        'Queries run:',
        ...review.queries.map((query) => `- ${query}`),
        '',
        'Top public results:',
        ...(review.combinedResults.length > 0
          ? review.combinedResults.map((result) => `- [${result.title}](${result.url})${result.snippet ? ` — ${result.snippet}` : ''}`)
          : ['- *(no results captured)*']),
        '',
        ...(review.errors.length > 0
          ? [
              'Search notes:',
              ...review.errors.map((entry) => `- ${entry.query}: ${entry.error}`),
              '',
            ]
          : []),
      ].join('\n'),
    );
    return {
      attempted: true,
      included: true,
      error: null,
      queries: review.queries,
      combinedResults: review.combinedResults,
    };
  } catch (error) {
    const message = String(error?.message ?? error);
    writeText(
      path.join(destination, 'PUBLIC_STATUS_REVIEW.md'),
      [
        `# Erdős Problem #${problemId} Public Status Review`,
        '',
        '- A live public search was attempted but did not complete cleanly.',
        `- Error: ${message}`,
        '',
        'Suggested queries:',
        ...queries.map((query) => `- ${query}`),
        '',
      ].join('\n'),
    );
    writeText(path.join(destination, 'PUBLIC_STATUS_REVIEW_ERROR.txt'), message);
    return {
      attempted: true,
      included: false,
      error: message,
      queries,
      combinedResults: [],
    };
  }
}

async function maybeWriteLiteratureAdapter(problemId, title, destination, includeAdapter, label, fetcher) {
  if (!includeAdapter) {
    return {
      attempted: false,
      included: false,
      error: null,
      resultCount: 0,
      filePrefix: label.toUpperCase(),
    };
  }

  const filePrefix = label.toUpperCase();

  try {
    const payload = await fetcher(problemId, title);
    writeJson(path.join(destination, `${filePrefix}_RESULTS.json`), payload);
    writeText(
      path.join(destination, `${filePrefix}_RESULTS.md`),
      [
        `# ${label} Results`,
        '',
        `Fetched at: ${payload.fetchedAt}`,
        `Query: ${payload.query}`,
        '',
        ...(payload.results.length > 0
          ? payload.results.map((result) => `- [${result.title || '(untitled)'}](${result.url || '#'})`)
          : ['- *(no results captured)*']),
        '',
      ].join('\n'),
    );
    return {
      attempted: true,
      included: true,
      error: null,
      resultCount: payload.results.length,
      filePrefix,
    };
  } catch (error) {
    const message = String(error?.message ?? error);
    writeText(path.join(destination, `${filePrefix}_ERROR.txt`), message);
    return {
      attempted: true,
      included: false,
      error: message,
      resultCount: 0,
      filePrefix,
    };
  }
}

async function writeLiteratureLane(
  problemId,
  destination,
  localProblem,
  upstreamRecord,
  includeSite,
  includePublicSearch,
  includeCrossref,
  includeOpenAlex,
) {
  ensureDir(destination);

  const includedFiles = [];
  const copied = (sourcePath, destinationName, label) => {
    const destinationPath = path.join(destination, destinationName);
    if (copyFileIfPresent(sourcePath, destinationPath)) {
      includedFiles.push({ label, sourcePath, destinationPath });
      return true;
    }
    return false;
  };

  if (upstreamRecord) {
    writeJson(path.join(destination, 'UPSTREAM_RECORD.json'), upstreamRecord);
  }

  let inventory = null;
  if (localProblem) {
    inventory = getProblemArtifactInventory(localProblem);
    copied(localProblem.referencesPath, 'REFERENCES.md', 'REFERENCES.md');
    copied(localProblem.statementPath, 'STATEMENT.md', 'STATEMENT.md');
    if (inventory.packContext?.exists) {
      copied(inventory.packContext.path, 'PACK_CONTEXT.md', inventory.packContext.label);
    }
    for (const artifact of inventory.packProblemArtifacts) {
      copied(artifact.path, path.join('PACK_PROBLEM', artifact.destinationName), artifact.label);
    }
  }

  const siteStatus = await maybeWriteSiteBundle(problemId, destination, includeSite);
  const publicSearch = await maybeWritePublicSearchBundle(
    problemId,
    localProblem?.title ?? upstreamRecord?.title ?? `Erdos Problem #${problemId}`,
    destination,
    includePublicSearch,
  );
  const literatureTitle = localProblem?.title ?? upstreamRecord?.title ?? `Erdos Problem #${problemId}`;
  const crossref = await maybeWriteLiteratureAdapter(
    problemId,
    literatureTitle,
    destination,
    includeCrossref,
    'Crossref',
    fetchCrossrefLiterature,
  );
  const openalex = await maybeWriteLiteratureAdapter(
    problemId,
    literatureTitle,
    destination,
    includeOpenAlex,
    'OpenAlex',
    fetchOpenAlexLiterature,
  );
  const problemRecord = buildProblemRecord(problemId, localProblem, upstreamRecord);
  writeJson(path.join(destination, 'PROBLEM.json'), problemRecord);
  writeJson(path.join(destination, 'LITERATURE_INDEX.json'), {
    generatedAt: new Date().toISOString(),
    problemId: String(problemId),
    includedFiles,
    includedUpstreamRecord: Boolean(upstreamRecord),
    includedSiteSnapshot: siteStatus.included,
    siteSnapshotError: siteStatus.error,
    siteStatus: siteStatus.siteStatus,
    includedPublicSearch: publicSearch.included,
    publicSearchError: publicSearch.error,
    publicSearchQueries: publicSearch.queries,
    includedCrossref: crossref.included,
    crossrefError: crossref.error,
    includedOpenAlex: openalex.included,
    openAlexError: openalex.error,
  });
  writeText(
    path.join(destination, 'README.md'),
    [
      `# Erdos Problem ${problemId} Literature Bundle`,
      '',
      'This literature lane was generated by the erdos CLI.',
      '',
      `- Local dossier included: ${localProblem ? 'yes' : 'no'}`,
      `- Imported record included: ${upstreamRecord ? 'yes' : 'no'}`,
      `- Live site snapshot included: ${siteStatus.included ? 'yes' : 'no'}`,
      `- Public search review included: ${publicSearch.included ? 'yes' : 'no'}`,
      `- Crossref adapter included: ${crossref.included ? 'yes' : 'no'}`,
      `- OpenAlex adapter included: ${openalex.included ? 'yes' : 'no'}`,
      '',
    ].join('\n'),
  );

  return {
    destination,
    includedFiles,
    siteStatus,
    publicSearch,
    crossref,
    openalex,
  };
}

function writeRootProblemBundle(rootDir, problemId, localProblem, upstreamRecord, snapshot, artifactsDir, literatureDir) {
  ensureDir(rootDir);
  const problemRecord = buildProblemRecord(problemId, localProblem, upstreamRecord);

  if (upstreamRecord) {
    writeJson(path.join(rootDir, 'UPSTREAM_RECORD.json'), upstreamRecord);
  }

  writeJson(path.join(rootDir, 'PROBLEM.json'), problemRecord);
  writeJson(path.join(rootDir, 'PULL_INDEX.json'), {
    generatedAt: new Date().toISOString(),
    problemId: String(problemId),
    rootDir,
    artifactsDir,
    literatureDir,
    snapshotKind: snapshot?.kind ?? null,
    upstreamCommit: snapshot?.manifest.imported_commit ?? snapshot?.manifest.upstream_commit ?? null,
  });
  writeText(
    path.join(rootDir, 'README.md'),
    [
      `# Erdos Problem ${problemId} Pull Bundle`,
      '',
      'This pull bundle contains per-problem workspace lanes for artifacts and literature.',
      '',
      `- Artifacts lane: ${artifactsDir}`,
      `- Literature lane: ${literatureDir}`,
      `- Local canonical dossier available: ${localProblem ? 'yes' : 'no'}`,
      `- Imported record included: ${upstreamRecord ? 'yes' : 'no'}`,
      '',
    ].join('\n'),
  );

  return problemRecord;
}

export async function runPullCommand(args, options = {}) {
  const silent = options.silent === true;
  if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
    if (!silent) {
      console.log('Usage:');
      console.log('  erdos pull problem <id> [--dest <path>] [--include-site] [--include-public-search] [--include-crossref] [--include-openalex] [--refresh-upstream] [--json]');
      console.log('  erdos pull artifacts <id> [--dest <path>] [--refresh-upstream] [--json]');
      console.log('  erdos pull literature <id> [--dest <path>] [--include-site] [--include-public-search] [--include-crossref] [--include-openalex] [--refresh-upstream] [--json]');
    }
    return 0;
  }

  const parsed = parsePullArgs(args);
  if (parsed.error) {
    if (!silent) {
      console.error(parsed.error);
    }
    return 1;
  }
  if (!parsed.problemId) {
    if (!silent) {
      console.error('Missing problem id.');
    }
    return 1;
  }

  if (parsed.refreshUpstream) {
    await syncUpstream();
  }

  const localProblem = getProblem(parsed.problemId);
  const snapshot = loadActiveUpstreamSnapshot();
  const upstreamRecord = snapshot?.index?.by_number?.[String(parsed.problemId)] ?? null;

  if (!localProblem && !upstreamRecord) {
    if (!silent) {
      console.error(`Problem ${parsed.problemId} is not present in the local dossier set or upstream snapshot.`);
    }
    return 1;
  }

  if (parsed.kind === 'artifacts') {
    const destination = parsed.destination
      ? path.resolve(parsed.destination)
      : getWorkspaceProblemArtifactDir(parsed.problemId);
    const result = writeArtifactsLane(String(parsed.problemId), destination, localProblem, upstreamRecord, snapshot);
    if (parsed.asJson) {
      console.log(JSON.stringify({
        kind: 'artifacts',
        problemId: String(parsed.problemId),
        destination,
        localProblemIncluded: Boolean(localProblem),
        upstreamRecordIncluded: Boolean(upstreamRecord),
        artifactsCopied: result.copiedArtifacts?.length ?? result.artifactsCopied ?? 0,
      }, null, 2));
      return 0;
    }
    if (!silent) {
      console.log(`Artifact bundle created: ${destination}`);
      console.log(`Local canonical dossier included: ${localProblem ? 'yes' : 'no'}`);
      console.log(`Imported record included: ${upstreamRecord ? 'yes' : 'no'}`);
      console.log(`Artifacts copied: ${result.copiedArtifacts?.length ?? result.artifactsCopied ?? 0}`);
    }
    return 0;
  }

  if (parsed.kind === 'literature') {
    const destination = parsed.destination
      ? path.resolve(parsed.destination)
      : getWorkspaceProblemLiteratureDir(parsed.problemId);
    const result = await writeLiteratureLane(
      String(parsed.problemId),
      destination,
      localProblem,
      upstreamRecord,
      parsed.includeSite,
      parsed.includePublicSearch,
      parsed.includeCrossref,
      parsed.includeOpenAlex,
    );
    if (parsed.asJson) {
      console.log(JSON.stringify({
        kind: 'literature',
        problemId: String(parsed.problemId),
        destination,
        localProblemIncluded: Boolean(localProblem),
        upstreamRecordIncluded: Boolean(upstreamRecord),
        includedSiteSnapshot: result.siteStatus.included,
        siteStatusError: result.siteStatus.error,
        includedPublicSearch: result.publicSearch.included,
        publicSearchError: result.publicSearch.error,
        includedCrossref: result.crossref.included,
        crossrefError: result.crossref.error,
        includedOpenAlex: result.openalex.included,
        openAlexError: result.openalex.error,
      }, null, 2));
      return 0;
    }
    if (!silent) {
      console.log(`Literature bundle created: ${destination}`);
      console.log(`Local dossier context included: ${localProblem ? 'yes' : 'no'}`);
      console.log(`Imported record included: ${upstreamRecord ? 'yes' : 'no'}`);
      console.log(`Live site snapshot included: ${result.siteStatus.included ? 'yes' : 'no'}`);
      console.log(`Public search review included: ${result.publicSearch.included ? 'yes' : 'no'}`);
      console.log(`Crossref adapter included: ${result.crossref.included ? 'yes' : 'no'}`);
      console.log(`OpenAlex adapter included: ${result.openalex.included ? 'yes' : 'no'}`);
      if (result.siteStatus.error) {
        console.log(`Live site snapshot note: ${result.siteStatus.error}`);
      }
      if (result.publicSearch.error) {
        console.log(`Public search note: ${result.publicSearch.error}`);
      }
      if (result.crossref.error) {
        console.log(`Crossref note: ${result.crossref.error}`);
      }
      if (result.openalex.error) {
        console.log(`OpenAlex note: ${result.openalex.error}`);
      }
    }
    return 0;
  }

  const rootDestination = parsed.destination
    ? path.resolve(parsed.destination)
    : getWorkspaceProblemPullDir(parsed.problemId);
  const artifactDestination = path.join(rootDestination, 'artifacts');
  const literatureDestination = path.join(rootDestination, 'literature');

  writeRootProblemBundle(rootDestination, String(parsed.problemId), localProblem, upstreamRecord, snapshot, artifactDestination, literatureDestination);
  const artifactResult = writeArtifactsLane(String(parsed.problemId), artifactDestination, localProblem, upstreamRecord, snapshot);
  const literatureResult = await writeLiteratureLane(
    String(parsed.problemId),
    literatureDestination,
    localProblem,
    upstreamRecord,
    parsed.includeSite,
    parsed.includePublicSearch,
    parsed.includeCrossref,
    parsed.includeOpenAlex,
  );

  writeJson(path.join(rootDestination, 'PULL_STATUS.json'), {
    generatedAt: new Date().toISOString(),
    problemId: String(parsed.problemId),
    usedLocalDossier: Boolean(localProblem),
    includedUpstreamRecord: Boolean(upstreamRecord),
    upstreamSnapshotKind: snapshot?.kind ?? null,
    artifactLanePath: artifactDestination,
    literatureLanePath: literatureDestination,
    artifactArtifactsCopied: artifactResult.copiedArtifacts?.length ?? artifactResult.artifactsCopied ?? 0,
    literatureFilesCopied: literatureResult.includedFiles.length,
    siteSnapshotAttempted: literatureResult.siteStatus.attempted,
    siteSnapshotIncluded: literatureResult.siteStatus.included,
    siteSnapshotError: literatureResult.siteStatus.error,
    siteStatus: literatureResult.siteStatus.siteStatus,
    publicSearchAttempted: literatureResult.publicSearch.attempted,
    publicSearchIncluded: literatureResult.publicSearch.included,
    publicSearchError: literatureResult.publicSearch.error,
    crossrefAttempted: literatureResult.crossref.attempted,
    crossrefIncluded: literatureResult.crossref.included,
    crossrefError: literatureResult.crossref.error,
    openAlexAttempted: literatureResult.openalex.attempted,
    openAlexIncluded: literatureResult.openalex.included,
    openAlexError: literatureResult.openalex.error,
  });

  if (parsed.asJson) {
    console.log(JSON.stringify({
      kind: 'problem',
      problemId: String(parsed.problemId),
      destination: rootDestination,
      artifactsDir: artifactDestination,
      literatureDir: literatureDestination,
      localProblemIncluded: Boolean(localProblem),
      upstreamRecordIncluded: Boolean(upstreamRecord),
      includedSiteSnapshot: literatureResult.siteStatus.included,
      includedPublicSearch: literatureResult.publicSearch.included,
      includedCrossref: literatureResult.crossref.included,
      includedOpenAlex: literatureResult.openalex.included,
    }, null, 2));
    return 0;
  }

  if (!silent) {
    console.log(`Pull bundle created: ${rootDestination}`);
    console.log(`Artifact lane: ${artifactDestination}`);
    console.log(`Literature lane: ${literatureDestination}`);
    console.log(`Local canonical dossier included: ${localProblem ? 'yes' : 'no'}`);
    console.log(`Imported record included: ${upstreamRecord ? 'yes' : 'no'}`);
    console.log(`Live site snapshot included: ${literatureResult.siteStatus.included ? 'yes' : 'no'}`);
    console.log(`Public search review included: ${literatureResult.publicSearch.included ? 'yes' : 'no'}`);
    console.log(`Crossref adapter included: ${literatureResult.crossref.included ? 'yes' : 'no'}`);
    console.log(`OpenAlex adapter included: ${literatureResult.openalex.included ? 'yes' : 'no'}`);
    if (literatureResult.siteStatus.error) {
      console.log(`Live site snapshot note: ${literatureResult.siteStatus.error}`);
    }
    if (literatureResult.publicSearch.error) {
      console.log(`Public search note: ${literatureResult.publicSearch.error}`);
    }
    if (literatureResult.crossref.error) {
      console.log(`Crossref note: ${literatureResult.crossref.error}`);
    }
    if (literatureResult.openalex.error) {
      console.log(`OpenAlex note: ${literatureResult.openalex.error}`);
    }
  }
  return 0;
}
