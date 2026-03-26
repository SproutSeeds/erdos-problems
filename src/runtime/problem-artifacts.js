import fs from 'node:fs';
import path from 'node:path';
import { loadActiveUpstreamSnapshot } from '../upstream/sync.js';
import { copyFileIfPresent, ensureDir, writeJson, writeText } from './files.js';
import { getPackDir, getPackProblemDir } from './paths.js';
import { listSunflowerComputePackets } from './sunflower.js';

const DOSSIER_FILES = [
  ['problem.yaml', 'problemYamlPath', 'problem.yaml'],
  ['STATEMENT.md', 'statementPath', 'STATEMENT.md'],
  ['REFERENCES.md', 'referencesPath', 'REFERENCES.md'],
  ['EVIDENCE.md', 'evidencePath', 'EVIDENCE.md'],
  ['FORMALIZATION.md', 'formalizationPath', 'FORMALIZATION.md'],
];

function getPackContextPath(problem) {
  if (!problem.cluster) {
    return null;
  }
  return path.join(getPackDir(problem.cluster), 'README.md');
}

function collectFiles(rootDir, relativeDir = '') {
  const currentDir = relativeDir ? path.join(rootDir, relativeDir) : rootDir;
  const entries = fs.readdirSync(currentDir, { withFileTypes: true }).sort((left, right) => left.name.localeCompare(right.name));
  const files = [];

  for (const entry of entries) {
    const relativePath = relativeDir ? path.join(relativeDir, entry.name) : entry.name;
    if (entry.isDirectory()) {
      files.push(...collectFiles(rootDir, relativePath));
      continue;
    }
    files.push(relativePath);
  }

  return files;
}

function getPackProblemArtifacts(problem) {
  if (!problem.cluster) {
    return [];
  }

  const packProblemDir = getPackProblemDir(problem.cluster, problem.problemId);
  if (!fs.existsSync(packProblemDir)) {
    return [];
  }

  return collectFiles(packProblemDir).map((relativePath) => {
    const sourcePath = path.join(packProblemDir, relativePath);
    return {
      label: relativePath,
      path: sourcePath,
      relativePath,
      destinationName: relativePath,
      exists: fs.existsSync(sourcePath),
    };
  });
}

export function getProblemArtifactInventory(problem) {
  const snapshot = loadActiveUpstreamSnapshot();
  const upstreamRecord = snapshot?.index?.by_number?.[problem.problemId] ?? null;
  const canonicalArtifacts = DOSSIER_FILES.map(([label, key, destinationName]) => {
    const filePath = problem[key];
    return {
      label,
      path: filePath,
      destinationName,
      exists: fs.existsSync(filePath),
    };
  });

  const packContextPath = getPackContextPath(problem);
  const packContext = packContextPath
    ? {
        label: 'PACK_CONTEXT.md',
        path: packContextPath,
        destinationName: 'PACK_CONTEXT.md',
        exists: fs.existsSync(packContextPath),
      }
    : null;

  const packProblemArtifacts = getPackProblemArtifacts(problem);
  const computePackets = listSunflowerComputePackets(problem.problemId).map((packet) => ({
    label: packet.laneId || packet.packetFileName,
    path: packet.packetPath,
    destinationName: packet.packetFileName,
    exists: fs.existsSync(packet.packetPath),
    status: packet.status,
    claimLevelGoal: packet.claimLevelGoal,
  }));

  return {
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    displayName: problem.displayName,
    title: problem.title,
    sourceUrl: problem.sourceUrl,
    cluster: problem.cluster,
    repoStatus: problem.repoStatus,
    harnessDepth: problem.harnessDepth,
    problemDir: problem.problemDir,
    canonicalArtifacts,
    packContext,
    packProblemArtifacts,
    computePackets,
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
    upstreamRecordIncluded: Boolean(upstreamRecord),
    upstreamRecord,
  };
}

export function scaffoldProblem(problem, destination) {
  ensureDir(destination);
  const inventory = getProblemArtifactInventory(problem);

  const copiedArtifacts = [];
  for (const artifact of inventory.canonicalArtifacts) {
    const destinationPath = path.join(destination, artifact.destinationName);
    if (copyFileIfPresent(artifact.path, destinationPath)) {
      copiedArtifacts.push({
        label: artifact.label,
        sourcePath: artifact.path,
        destinationPath,
      });
    }
  }

  if (inventory.packContext?.exists) {
    const destinationPath = path.join(destination, inventory.packContext.destinationName);
    if (copyFileIfPresent(inventory.packContext.path, destinationPath)) {
      copiedArtifacts.push({
        label: inventory.packContext.label,
        sourcePath: inventory.packContext.path,
        destinationPath,
      });
    }
  }

  const packProblemArtifacts = [];
  const packProblemDir = path.join(destination, 'PACK_PROBLEM');
  for (const artifact of inventory.packProblemArtifacts) {
    if (!artifact.exists) {
      continue;
    }
    const destinationPath = path.join(packProblemDir, artifact.destinationName);
    if (copyFileIfPresent(artifact.path, destinationPath)) {
      packProblemArtifacts.push({
        label: artifact.label,
        sourcePath: artifact.path,
        destinationPath,
      });
    }
  }

  const computeArtifacts = [];
  const computeDir = path.join(destination, 'COMPUTE');
  for (const packet of inventory.computePackets) {
    if (!packet.exists) {
      continue;
    }
    const destinationPath = path.join(computeDir, packet.destinationName);
    if (copyFileIfPresent(packet.path, destinationPath)) {
      computeArtifacts.push({
        label: packet.label,
        sourcePath: packet.path,
        destinationPath,
        status: packet.status,
        claimLevelGoal: packet.claimLevelGoal,
      });
    }
  }

  if (inventory.upstreamRecord) {
    writeJson(path.join(destination, 'UPSTREAM_RECORD.json'), inventory.upstreamRecord);
  }

  const problemRecord = {
    generatedAt: inventory.generatedAt,
    problemId: problem.problemId,
    title: problem.title,
    cluster: problem.cluster,
    siteStatus: problem.siteStatus,
    repoStatus: problem.repoStatus,
    harnessDepth: problem.harnessDepth,
    sourceUrl: problem.sourceUrl,
    activeRoute: problem.researchState?.active_route ?? null,
  };

  const artifactIndex = {
    generatedAt: inventory.generatedAt,
    problemId: problem.problemId,
    bundledProblemDir: problem.problemDir,
    copiedArtifacts,
    packProblemArtifacts,
    computeArtifacts,
    packContext: inventory.packContext,
    canonicalArtifacts: inventory.canonicalArtifacts,
    packProblemArtifactsInventory: inventory.packProblemArtifacts,
    computePackets: inventory.computePackets,
    upstreamSnapshot: inventory.upstreamSnapshot,
    includedUpstreamRecord: inventory.upstreamRecordIncluded,
  };

  writeJson(path.join(destination, 'PROBLEM.json'), problemRecord);
  writeJson(path.join(destination, 'ARTIFACT_INDEX.json'), artifactIndex);
  writeText(
    path.join(destination, 'README.md'),
    [
      `# Erdos Problem ${problem.problemId} Scaffold`,
      '',
      'This scaffold was generated by the erdos CLI.',
      '',
      `- Title: ${problem.title}`,
      `- Cluster: ${problem.cluster}`,
      `- Source: ${problem.sourceUrl}`,
      `- Repo status: ${problem.repoStatus}`,
      `- Harness depth: ${problem.harnessDepth}`,
      `- Upstream record included: ${inventory.upstreamRecordIncluded ? 'yes' : 'no'}`,
      `- Pack problem artifacts copied: ${packProblemArtifacts.length}`,
      `- Compute packets copied: ${computeArtifacts.length}`,
      '',
    ].join('\n'),
  );

  return {
    destination,
    copiedArtifacts,
    packProblemArtifacts,
    computeArtifacts,
    inventory,
  };
}
