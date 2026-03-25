import { getProblem, listProblems } from '../atlas/catalog.js';
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
    return { error: `Unknown list option: ${token}` };
  }
  return { filters };
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
  console.log(`Formalization: ${problem.formalizationStatus}`);
  console.log(`Related: ${problem.relatedProblems.join(', ') || '(none)'}`);
  console.log(`Tags: ${problem.familyTags.join(', ') || '(none)'}`);
  console.log(`Statement: ${problem.shortStatement}`);
  if (problem.researchState) {
    console.log('Research state:');
    console.log(`  open problem: ${problem.researchState.openProblem ? 'yes' : 'no'}`);
    console.log(`  active route: ${problem.researchState.activeRoute}`);
    console.log(`  route breakthrough: ${problem.researchState.routeBreakthrough ? 'yes' : 'no'}`);
    console.log(`  problem solved: ${problem.researchState.problemSolved ? 'yes' : 'no'}`);
  }
}

export function runProblemCommand(args) {
  const [subcommand, value, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos problem list [--cluster <name>] [--repo-status <status>] [--harness-depth <depth>]');
    console.log('  erdos problem show <id>');
    console.log('  erdos problem use <id>');
    console.log('  erdos problem current');
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
    console.log(`Active problem set to ${problem.problemId} (${problem.title})`);
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

  console.error(`Unknown problem subcommand: ${subcommand}`);
  return 1;
}
