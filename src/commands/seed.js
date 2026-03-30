import path from 'node:path';
import { getProblem } from '../atlas/catalog.js';
import { syncCheckpoints } from '../runtime/checkpoints.js';
import { seedProblemFromPullBundle } from '../runtime/maintainer-seed.js';
import { syncOrpWorkspaceKit } from '../runtime/orp.js';
import { getWorkspaceProblemPullDir, getWorkspaceRoot, getWorkspaceSeededProblemsDir } from '../runtime/paths.js';
import { syncState } from '../runtime/state.js';
import { readCurrentProblem, setCurrentProblem } from '../runtime/workspace.js';
import { runPullCommand } from './pull.js';

function parseSeedArgs(args) {
  const [kind, value, ...rest] = args;
  if (kind !== 'problem') {
    return { error: 'Only `erdos seed problem <id>` is supported right now.' };
  }

  const parsed = {
    problemId: value,
    includeSite: true,
    includePublicSearch: true,
    refreshUpstream: false,
    cluster: null,
    repoStatus: 'local_seeded',
    harnessDepth: 'dossier',
    title: null,
    familyTags: [],
    relatedProblems: [],
    formalizationStatus: 'planned',
    activeRoute: null,
    routeBreakthrough: false,
    problemSolved: false,
    allowNonOpen: false,
    destRoot: null,
    noActivate: false,
    noLoopSync: false,
    force: false,
    asJson: false,
  };

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token === '--include-site') {
      parsed.includeSite = true;
      continue;
    }
    if (token === '--no-site') {
      parsed.includeSite = false;
      continue;
    }
    if (token === '--include-public-search') {
      parsed.includePublicSearch = true;
      continue;
    }
    if (token === '--no-public-search') {
      parsed.includePublicSearch = false;
      continue;
    }
    if (token === '--refresh-upstream') {
      parsed.refreshUpstream = true;
      continue;
    }
    if (token === '--cluster') {
      parsed.cluster = rest[index + 1];
      if (!parsed.cluster) {
        return { error: 'Missing cluster value after --cluster.' };
      }
      index += 1;
      continue;
    }
    if (token === '--repo-status') {
      parsed.repoStatus = rest[index + 1];
      if (!parsed.repoStatus) {
        return { error: 'Missing repo status after --repo-status.' };
      }
      index += 1;
      continue;
    }
    if (token === '--harness-depth') {
      parsed.harnessDepth = rest[index + 1];
      if (!parsed.harnessDepth) {
        return { error: 'Missing harness depth after --harness-depth.' };
      }
      index += 1;
      continue;
    }
    if (token === '--title') {
      parsed.title = rest[index + 1];
      if (!parsed.title) {
        return { error: 'Missing title after --title.' };
      }
      index += 1;
      continue;
    }
    if (token === '--family-tag') {
      const tag = rest[index + 1];
      if (!tag) {
        return { error: 'Missing tag after --family-tag.' };
      }
      parsed.familyTags.push(tag);
      index += 1;
      continue;
    }
    if (token === '--related') {
      const related = rest[index + 1];
      if (!related) {
        return { error: 'Missing problem id after --related.' };
      }
      parsed.relatedProblems.push(related);
      index += 1;
      continue;
    }
    if (token === '--formalization-status') {
      parsed.formalizationStatus = rest[index + 1];
      if (!parsed.formalizationStatus) {
        return { error: 'Missing value after --formalization-status.' };
      }
      index += 1;
      continue;
    }
    if (token === '--active-route') {
      parsed.activeRoute = rest[index + 1];
      if (!parsed.activeRoute) {
        return { error: 'Missing value after --active-route.' };
      }
      index += 1;
      continue;
    }
    if (token === '--route-breakthrough') {
      parsed.routeBreakthrough = true;
      continue;
    }
    if (token === '--problem-solved') {
      parsed.problemSolved = true;
      continue;
    }
    if (token === '--allow-non-open') {
      parsed.allowNonOpen = true;
      continue;
    }
    if (token === '--dest-root') {
      parsed.destRoot = rest[index + 1];
      if (!parsed.destRoot) {
        return { error: 'Missing path after --dest-root.' };
      }
      index += 1;
      continue;
    }
    if (token === '--no-activate') {
      parsed.noActivate = true;
      continue;
    }
    if (token === '--no-loop-sync') {
      parsed.noLoopSync = true;
      continue;
    }
    if (token === '--force') {
      parsed.force = true;
      continue;
    }
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    return { error: `Unknown seed option: ${token}` };
  }

  return parsed;
}

export async function runSeedCommand(args) {
  if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
    console.log('Usage:');
    console.log('  erdos seed problem <id> [--include-site|--no-site] [--include-public-search|--no-public-search] [--refresh-upstream] [--cluster <name>] [--repo-status <status>] [--harness-depth <depth>] [--title <title>] [--family-tag <tag>] [--related <id>] [--formalization-status <status>] [--active-route <route>] [--route-breakthrough] [--problem-solved] [--allow-non-open] [--dest-root <path>] [--no-activate] [--no-loop-sync] [--force] [--json]');
    return 0;
  }

  const parsed = parseSeedArgs(args);
  if (parsed.error) {
    console.error(parsed.error);
    return 1;
  }
  if (!parsed.problemId) {
    console.error('Missing problem id.');
    return 1;
  }

  const workspaceRoot = getWorkspaceRoot();
  const orp = syncOrpWorkspaceKit(workspaceRoot);
  const pullDir = getWorkspaceProblemPullDir(parsed.problemId, workspaceRoot);
  const defaultSeedRoot = getWorkspaceSeededProblemsDir(workspaceRoot);
  const destinationRoot = parsed.destRoot
    ? path.resolve(parsed.destRoot)
    : defaultSeedRoot;
  const seedsIntoWorkspaceOverlay = destinationRoot === defaultSeedRoot;

  const pullArgs = ['problem', String(parsed.problemId), '--dest', pullDir];
  if (parsed.includeSite) {
    pullArgs.push('--include-site');
  }
  if (parsed.includePublicSearch) {
    pullArgs.push('--include-public-search');
  }
  if (parsed.refreshUpstream) {
    pullArgs.push('--refresh-upstream');
  }

  const pullExit = await runPullCommand(pullArgs, { silent: parsed.asJson });
  if (pullExit !== 0) {
    return pullExit;
  }

  const packageProblem = getProblem(parsed.problemId, workspaceRoot);
  const result = seedProblemFromPullBundle(parsed.problemId, {
    fromPullDir: pullDir,
    destRoot: destinationRoot,
    cluster: parsed.cluster ?? packageProblem?.cluster ?? 'uncategorized',
    repoStatus: parsed.repoStatus,
    harnessDepth: parsed.harnessDepth,
    title: parsed.title,
    familyTags: parsed.familyTags,
    relatedProblems: parsed.relatedProblems,
    formalizationStatus: parsed.formalizationStatus,
    activeRoute: parsed.activeRoute ?? (parsed.problemSolved ? null : 'seed_route_pending'),
    routeBreakthrough: parsed.routeBreakthrough,
    problemSolved: parsed.problemSolved,
    allowNonOpen: parsed.allowNonOpen,
    force: parsed.force,
  });

  const activated = !parsed.noActivate && seedsIntoWorkspaceOverlay;
  const loopSynced = !parsed.noLoopSync && activated;

  let state = null;
  let checkpoints = null;
  if (activated) {
    setCurrentProblem(parsed.problemId, workspaceRoot);
  }
  if (loopSynced) {
    state = syncState(workspaceRoot);
    checkpoints = syncCheckpoints(workspaceRoot);
  }

  const payload = {
    problemId: String(parsed.problemId),
    pullDir,
    destinationDir: result.destinationDir,
    cluster: result.record.cluster,
    harnessDepth: result.record.harness.depth,
    title: result.record.title,
    activated,
    loopSynced,
    activeProblem: activated ? readCurrentProblem(workspaceRoot) : null,
    activeRoute: state?.activeRoute ?? null,
    nextHonestMove: state?.nextHonestMove ?? null,
    checkpointShelf: checkpoints?.indexPath ?? null,
    usedUpstreamRecord: result.usedUpstreamRecord,
    usedSiteSnapshot: result.usedSiteSnapshot,
    usedPublicStatusReview: result.usedPublicStatusReview,
    workspaceOverlayVisible: seedsIntoWorkspaceOverlay,
    orpProtocol: orp.protocolPath,
  };

  if (parsed.asJson) {
    console.log(JSON.stringify(payload, null, 2));
    return 0;
  }

  console.log(`Seeded local dossier for problem ${parsed.problemId}`);
  console.log(`Pull bundle: ${pullDir}`);
  console.log(`Destination: ${result.destinationDir}`);
  console.log(`Title: ${result.record.title}`);
  console.log(`Cluster: ${result.record.cluster}`);
  console.log(`Harness depth: ${result.record.harness.depth}`);
  console.log(`Imported record used: ${result.usedUpstreamRecord ? 'yes' : 'no'}`);
  console.log(`Site snapshot used: ${result.usedSiteSnapshot ? 'yes' : 'no'}`);
  console.log(`Public status review used: ${result.usedPublicStatusReview ? 'yes' : 'no'}`);
  console.log(`ORP protocol: ${orp.protocolPath}`);
  console.log(`Workspace overlay visible: ${seedsIntoWorkspaceOverlay ? 'yes' : 'no'}`);
  console.log(`Activated: ${activated ? 'yes' : 'no'}`);
  console.log(`Loop synced: ${loopSynced ? 'yes' : 'no'}`);
  if (!seedsIntoWorkspaceOverlay && (!parsed.noActivate || !parsed.noLoopSync)) {
    console.log('Note: activation and loop sync were skipped because --dest-root points outside .erdos/seeded-problems.');
  }
  if (state) {
    console.log(`Active route: ${state.activeRoute ?? '(none)'}`);
    console.log(`Next honest move: ${state.nextHonestMove}`);
  }
  if (checkpoints) {
    console.log(`Checkpoint shelf: ${checkpoints.indexPath}`);
  }
  return 0;
}
