import { getProblem, listProblems } from '../atlas/catalog.js';
import { syncOrpWorkspaceKit } from '../runtime/orp.js';
import { syncCheckpoints } from '../runtime/checkpoints.js';
import { getProblemArtifactInventory } from '../runtime/problem-artifacts.js';
import { syncState } from '../runtime/state.js';
import { readCurrentProblem, setCurrentProblem } from '../runtime/workspace.js';

function parseListFilters(args) {
  const filters = {};
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--cluster') {
      const cluster = args[index + 1];
      if (!cluster) {
        return { error: 'Missing cluster name after --cluster.' };
      }
      filters.cluster = cluster;
      index += 1;
      continue;
    }
    if (token === '--repo-status') {
      const repoStatus = args[index + 1];
      if (!repoStatus) {
        return { error: 'Missing repo status after --repo-status.' };
      }
      filters.repoStatus = repoStatus;
      index += 1;
      continue;
    }
    if (token === '--harness-depth') {
      const harnessDepth = args[index + 1];
      if (!harnessDepth) {
        return { error: 'Missing harness depth after --harness-depth.' };
      }
      filters.harnessDepth = harnessDepth;
      index += 1;
      continue;
    }
    if (token === '--site-status') {
      const siteStatus = args[index + 1];
      if (!siteStatus) {
        return { error: 'Missing site status after --site-status.' };
      }
      filters.siteStatus = siteStatus;
      index += 1;
      continue;
    }
    return { error: `Unknown list option: ${token}` };
  }
  return { filters };
}

function parseArtifactArgs(args) {
  const parsed = {
    problemId: null,
    asJson: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (!parsed.problemId) {
      parsed.problemId = token;
      continue;
    }
    return { error: `Unknown artifact option: ${token}` };
  }

  return parsed;
}

function printProblemTable(rows, activeProblem) {
  console.log('ID   Site   Repo       Cluster         Depth    Active  Title');
  for (const row of rows) {
    const id = row.problemId.padEnd(4, ' ');
    const site = row.siteStatus.padEnd(6, ' ');
    const repo = row.repoStatus.padEnd(10, ' ');
    const cluster = row.cluster.padEnd(15, ' ');
    const depth = row.harnessDepth.padEnd(8, ' ');
    const active = (row.problemId === activeProblem ? '*' : '-').padEnd(7, ' ');
    console.log(`${id} ${site} ${repo} ${cluster} ${depth} ${active} ${row.title}`);
  }
}

function printProblem(problem) {
  console.log(problem.displayName);
  console.log(`Title: ${problem.title}`);
  console.log(`Source: ${problem.sourceUrl}`);
  console.log(`Site status: ${problem.siteStatus}`);
  console.log(`Site badge: ${problem.siteBadge ?? problem.siteStatus}`);
  console.log(`Repo status: ${problem.repoStatus}`);
  console.log(`Cluster: ${problem.cluster}`);
  console.log(`Harness depth: ${problem.harnessDepth}`);
  if (String(problem.siteStatus).toLowerCase() === 'solved') {
    console.log('Archive mode: method_exemplar');
  }
  console.log(`Prize: ${problem.prize ?? '(none)'}`);
  console.log(`Formalization: ${problem.formalizationStatus}`);
  console.log(`Imported formalized: ${problem.upstreamFormalizedState ?? '(unknown)'}`);
  console.log(`Imported last update: ${problem.upstreamLastUpdate ?? '(unknown)'}`);
  console.log(`Related: ${problem.relatedProblems.join(', ') || '(none)'}`);
  console.log(`Tags: ${problem.familyTags.join(', ') || '(none)'}`);
  console.log(`Statement: ${problem.shortStatement}`);
  if (problem.researchState) {
    console.log('Research state:');
    console.log(`  open problem: ${problem.researchState.open_problem ? 'yes' : 'no'}`);
    console.log(`  active route: ${problem.researchState.active_route}`);
    console.log(`  route breakthrough: ${problem.researchState.route_breakthrough ? 'yes' : 'no'}`);
    console.log(`  problem solved: ${problem.researchState.problem_solved ? 'yes' : 'no'}`);
  }
  if (problem.externalSource) {
    console.log('External import provenance:');
    console.log(`  repo: ${problem.externalSource.repo}`);
    console.log(`  data file: ${problem.externalSource.data_file}`);
    console.log(`  number: ${problem.externalSource.number}`);
  }
}

function printArtifactInventory(problem, inventory, asJson) {
  if (asJson) {
    console.log(JSON.stringify(inventory, null, 2));
    return;
  }

  console.log(`${problem.displayName} canonical artifacts`);
  console.log(`Problem directory: ${inventory.problemDir}`);
  console.log(`Source: ${inventory.sourceUrl}`);
  console.log('Canonical files:');
  for (const artifact of inventory.canonicalArtifacts) {
    console.log(`- ${artifact.label}: ${artifact.exists ? 'present' : 'missing'} (${artifact.path})`);
  }
  if (inventory.starterArtifacts.length > 0) {
    console.log('Starter loop artifacts:');
    for (const artifact of inventory.starterArtifacts) {
      console.log(`- ${artifact.label}: ${artifact.exists ? 'present' : 'missing'} (${artifact.path})`);
    }
  }
  if (inventory.packContext) {
    console.log(`- ${inventory.packContext.label}: ${inventory.packContext.exists ? 'present' : 'missing'} (${inventory.packContext.path})`);
  }
  if (inventory.packProblemArtifacts.length > 0) {
    console.log('Pack problem artifacts:');
    for (const artifact of inventory.packProblemArtifacts) {
      console.log(`- ${artifact.label}: ${artifact.exists ? 'present' : 'missing'} (${artifact.path})`);
    }
  }
  if (inventory.computePackets.length > 0) {
    console.log('Compute packets:');
    for (const packet of inventory.computePackets) {
      console.log(`- ${packet.label}: ${packet.exists ? 'present' : 'missing'} (${packet.path}) [${packet.status}]`);
    }
  }
  if (inventory.upstreamSnapshot) {
    console.log('External import snapshot:');
    console.log(`- kind: ${inventory.upstreamSnapshot.kind}`);
    console.log(`- manifest: ${inventory.upstreamSnapshot.manifestPath}`);
    console.log(`- index: ${inventory.upstreamSnapshot.indexPath}`);
    console.log(`- commit: ${inventory.upstreamSnapshot.upstreamCommit ?? '(unknown)'}`);
  }
  console.log(`Imported record available: ${inventory.upstreamRecordIncluded ? 'yes' : 'no'}`);
}

export function runProblemCommand(args) {
  const [subcommand, value, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos problem list [--cluster <name>] [--repo-status <status>] [--harness-depth <depth>] [--site-status <status>]');
    console.log('  erdos problem show <id>');
    console.log('  erdos problem use <id>');
    console.log('  erdos problem current');
    console.log('  erdos problem artifacts [<id>] [--json]');
    return 0;
  }

  if (subcommand === 'list') {
    const parsed = parseListFilters([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    printProblemTable(listProblems(parsed.filters), readCurrentProblem());
    return 0;
  }

  if (subcommand === 'show') {
    const problemId = value ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    printProblem(problem);
    return 0;
  }

  if (subcommand === 'use') {
    if (!value) {
      console.error('Missing problem id.');
      return 1;
    }
    const problem = getProblem(value);
    if (!problem) {
      console.error(`Unknown problem: ${value}`);
      return 1;
    }
    setCurrentProblem(problem.problemId);
    syncOrpWorkspaceKit();
    syncState();
    const checkpointResult = syncCheckpoints();
    const state = checkpointResult.state;
    console.log(`Active problem set to ${problem.problemId} (${problem.title})`);
    console.log(`Active route: ${state.activeRoute ?? '(none)'}`);
    console.log(`Next honest move: ${state.nextHonestMove}`);
    console.log(`Checkpoint shelf: ${checkpointResult.indexPath}`);
    return 0;
  }

  if (subcommand === 'current') {
    const problemId = readCurrentProblem();
    if (!problemId) {
      console.log('No active problem selected.');
      return 0;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Active problem ${problemId} is not in the catalog.`);
      return 1;
    }
    printProblem(problem);
    return 0;
  }

  if (subcommand === 'artifacts') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const inventory = getProblemArtifactInventory(problem);
    printArtifactInventory(problem, inventory, parsed.asJson);
    return 0;
  }

  console.error(`Unknown problem subcommand: ${subcommand}`);
  return 1;
}
