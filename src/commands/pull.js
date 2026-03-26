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

function parsePullArgs(args) {
  const [kind, value, ...rest] = args;
  if (!['problem', 'artifacts', 'literature'].includes(kind)) {
    return { error: 'Usage: erdos pull problem|artifacts|literature <id> [--dest <path>] [--include-site] [--refresh-upstream]' };
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
    kind,
    problemId: value,
    destination,
    includeSite,
    refreshUpstream,
  };
}

function buildProblemRecord(problemId, localProblem, upstreamRecord) {
  return {
    generatedAt: new Date().toISOString(),
    problemId: String(problemId),
    title: localProblem?.title ?? `Erdos Problem #${problemId}`,
    cluster: localProblem?.cluster ?? null,
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
          upstreamCommit: snapshot.manifest.upstream_commit ?? null,
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
      `- Upstream record included: ${upstreamRecord ? 'yes' : 'no'}`,
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

async function writeLiteratureLane(problemId, destination, localProblem, upstreamRecord, includeSite) {
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
  const problemRecord = buildProblemRecord(problemId, localProblem, upstreamRecord);
  writeJson(path.join(destination, 'PROBLEM.json'), problemRecord);
  writeJson(path.join(destination, 'LITERATURE_INDEX.json'), {
    generatedAt: new Date().toISOString(),
    problemId: String(problemId),
    includedFiles,
    includedUpstreamRecord: Boolean(upstreamRecord),
    includedSiteSnapshot: siteStatus.included,
    siteSnapshotError: siteStatus.error,
  });
  writeText(
    path.join(destination, 'README.md'),
    [
      `# Erdos Problem ${problemId} Literature Bundle`,
      '',
      'This literature lane was generated by the erdos CLI.',
      '',
      `- Local dossier included: ${localProblem ? 'yes' : 'no'}`,
      `- Upstream record included: ${upstreamRecord ? 'yes' : 'no'}`,
      `- Live site snapshot included: ${siteStatus.included ? 'yes' : 'no'}`,
      '',
    ].join('\n'),
  );

  return {
    destination,
    includedFiles,
    siteStatus,
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
    upstreamCommit: snapshot?.manifest.upstream_commit ?? null,
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
      `- Upstream record included: ${upstreamRecord ? 'yes' : 'no'}`,
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
      console.log('  erdos pull problem <id> [--dest <path>] [--include-site] [--refresh-upstream]');
      console.log('  erdos pull artifacts <id> [--dest <path>] [--refresh-upstream]');
      console.log('  erdos pull literature <id> [--dest <path>] [--include-site] [--refresh-upstream]');
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
    if (!silent) {
      console.log(`Artifact bundle created: ${destination}`);
      console.log(`Local canonical dossier included: ${localProblem ? 'yes' : 'no'}`);
      console.log(`Upstream record included: ${upstreamRecord ? 'yes' : 'no'}`);
      console.log(`Artifacts copied: ${result.copiedArtifacts?.length ?? result.artifactsCopied ?? 0}`);
    }
    return 0;
  }

  if (parsed.kind === 'literature') {
    const destination = parsed.destination
      ? path.resolve(parsed.destination)
      : getWorkspaceProblemLiteratureDir(parsed.problemId);
    const result = await writeLiteratureLane(String(parsed.problemId), destination, localProblem, upstreamRecord, parsed.includeSite);
    if (!silent) {
      console.log(`Literature bundle created: ${destination}`);
      console.log(`Local dossier context included: ${localProblem ? 'yes' : 'no'}`);
      console.log(`Upstream record included: ${upstreamRecord ? 'yes' : 'no'}`);
      console.log(`Live site snapshot included: ${result.siteStatus.included ? 'yes' : 'no'}`);
      if (result.siteStatus.error) {
        console.log(`Live site snapshot note: ${result.siteStatus.error}`);
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
  const literatureResult = await writeLiteratureLane(String(parsed.problemId), literatureDestination, localProblem, upstreamRecord, parsed.includeSite);

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
  });

  if (!silent) {
    console.log(`Pull bundle created: ${rootDestination}`);
    console.log(`Artifact lane: ${artifactDestination}`);
    console.log(`Literature lane: ${literatureDestination}`);
    console.log(`Local canonical dossier included: ${localProblem ? 'yes' : 'no'}`);
    console.log(`Upstream record included: ${upstreamRecord ? 'yes' : 'no'}`);
    console.log(`Live site snapshot included: ${literatureResult.siteStatus.included ? 'yes' : 'no'}`);
    if (literatureResult.siteStatus.error) {
      console.log(`Live site snapshot note: ${literatureResult.siteStatus.error}`);
    }
  }
  return 0;
}
