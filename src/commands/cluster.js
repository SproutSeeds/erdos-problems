import { getCluster, listClusters } from '../atlas/catalog.js';

function printCluster(cluster) {
  console.log(`Cluster: ${cluster.name}`);
  console.log(`Problems: ${cluster.problems.map((problem) => problem.problemId).join(', ')}`);
  console.log(`Deep harness: ${cluster.deepHarnessProblems.map((problem) => problem.problemId).join(', ') || '(none)'}`);
  console.log(`Dossier-first: ${cluster.dossierProblems.map((problem) => problem.problemId).join(', ') || '(none)'}`);
  console.log('Summary:');
  if (cluster.name === 'sunflower') {
    console.log('  Weak sunflower core: 857');
    console.log('  Strong sunflower sibling: 20');
    console.log('  Related analogues: 536, 856');
  } else if (cluster.name === 'number-theory') {
    console.log('  Open starter workspace: 1');
    console.log('  Counterexample/archive workspace: 2');
    console.log('  Additional dossier seeds: 3, 4, 5, 6, 7, 18, 542');
  } else if (cluster.name === 'graph-theory') {
    console.log('  Decision archive workspace: 19');
    console.log('  Proof archive workspace: 22');
    console.log('  Lean proof archive workspace: 1008');
  }
}

export function runClusterCommand(args) {
  const [subcommand, value, ...rest] = args;
  const asJson = [value, ...rest].includes('--json');

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos cluster list');
    console.log('  erdos cluster show <name>');
    return 0;
  }

  if (subcommand === 'list') {
    if (asJson) {
      console.log(JSON.stringify(listClusters(), null, 2));
      return 0;
    }
    console.log('Clusters:');
    for (const cluster of listClusters()) {
      console.log(`- ${cluster.name}: ${cluster.problems.length} problems, ${cluster.deepHarnessProblems.length} deep-harness`);
    }
    return 0;
  }

  if (subcommand !== 'show') {
    console.error(`Unknown cluster subcommand: ${subcommand}`);
    return 1;
  }

  if (!value) {
    console.error('Missing cluster name.');
    return 1;
  }

  const cluster = getCluster(value);
  if (!cluster) {
    console.error(`Unknown cluster: ${value}`);
    return 1;
  }

  if (asJson) {
    console.log(JSON.stringify(cluster, null, 2));
    return 0;
  }

  printCluster(cluster);
  return 0;
}
