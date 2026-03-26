import path from 'node:path';
import { reviewPullBundleForSeeding, seedProblemFromPullBundle } from '../runtime/maintainer-seed.js';

function parseMaintainerSeedArgs(args) {
  const [kind, problemToken, ...rest] = args;
  if (kind !== 'problem') {
    return { error: 'Only `erdos maintainer seed problem <id>` is supported right now.' };
  }

  const parsed = {
    problemId: problemToken,
    fromPullDir: null,
    destRoot: null,
    cluster: null,
    repoStatus: null,
    harnessDepth: null,
    title: null,
    familyTags: [],
    relatedProblems: [],
    formalizationStatus: null,
    activeRoute: null,
    routeBreakthrough: false,
    problemSolved: false,
    allowNonOpen: false,
    force: false,
  };

  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token === '--from-pull') {
      parsed.fromPullDir = rest[index + 1];
      if (!parsed.fromPullDir) {
        return { error: 'Missing path after --from-pull.' };
      }
      index += 1;
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
    if (token === '--force') {
      parsed.force = true;
      continue;
    }
    return { error: `Unknown maintainer seed option: ${token}` };
  }

  return parsed;
}

export function runMaintainerCommand(args) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos maintainer seed problem <id> [--from-pull <path>] [--dest-root <path>] [--cluster <name>] [--repo-status <status>] [--harness-depth <depth>] [--title <title>] [--family-tag <tag>] [--related <id>] [--formalization-status <status>] [--active-route <route>] [--route-breakthrough] [--problem-solved] [--allow-non-open] [--force]');
    console.log('  erdos maintainer review problem <id> [--from-pull <path>] [--dest-root <path>] [--title <title>]');
    return 0;
  }

  if (!['seed', 'review'].includes(subcommand)) {
    console.error(`Unknown maintainer subcommand: ${subcommand}`);
    return 1;
  }

  const parsed = parseMaintainerSeedArgs(rest);
  if (parsed.error) {
    console.error(parsed.error);
    return 1;
  }
  if (!parsed.problemId) {
    console.error('Missing problem id.');
    return 1;
  }

  try {
    if (subcommand === 'review') {
      const result = reviewPullBundleForSeeding(parsed.problemId, {
        fromPullDir: parsed.fromPullDir ? path.resolve(parsed.fromPullDir) : null,
        destRoot: parsed.destRoot ? path.resolve(parsed.destRoot) : null,
        title: parsed.title,
      });

      console.log(`Prepared maintainer review for problem ${parsed.problemId}`);
      console.log(`Review checklist: ${result.reviewPath}`);
      console.log(`Proposed destination: ${result.destinationDir}`);
      console.log(`Title: ${result.title}`);
      console.log(`Upstream record used: ${result.usedUpstreamRecord ? 'yes' : 'no'}`);
      console.log(`Site snapshot used: ${result.usedSiteSnapshot ? 'yes' : 'no'}`);
      console.log(`Public status review used: ${result.usedPublicStatusReview ? 'yes' : 'no'}`);
      return 0;
    }

    const result = seedProblemFromPullBundle(parsed.problemId, {
      fromPullDir: parsed.fromPullDir ? path.resolve(parsed.fromPullDir) : null,
      destRoot: parsed.destRoot ? path.resolve(parsed.destRoot) : null,
      cluster: parsed.cluster,
      repoStatus: parsed.repoStatus,
      harnessDepth: parsed.harnessDepth,
      title: parsed.title,
      familyTags: parsed.familyTags,
      relatedProblems: parsed.relatedProblems,
      formalizationStatus: parsed.formalizationStatus,
      activeRoute: parsed.activeRoute,
      routeBreakthrough: parsed.routeBreakthrough,
      problemSolved: parsed.problemSolved,
      allowNonOpen: parsed.allowNonOpen,
      force: parsed.force,
    });

    console.log(`Seeded dossier for problem ${parsed.problemId}`);
    console.log(`Destination: ${result.destinationDir}`);
    console.log(`Title: ${result.record.title}`);
    console.log(`Cluster: ${result.record.cluster}`);
    console.log(`Harness depth: ${result.record.harness.depth}`);
    console.log(`Upstream record used: ${result.usedUpstreamRecord ? 'yes' : 'no'}`);
    console.log(`Site snapshot used: ${result.usedSiteSnapshot ? 'yes' : 'no'}`);
    console.log(`Public status review used: ${result.usedPublicStatusReview ? 'yes' : 'no'}`);
    return 0;
  } catch (error) {
    console.error(String(error.message ?? error));
    return 1;
  }
}
