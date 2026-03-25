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
  }
}

export function runClusterCommand(args) {
  const [subcommand, value] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos cluster list');
    console.log('  erdos cluster show <name>');
    return 0;
  }

  if (subcommand === 'list') {
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

  printCluster(cluster);
  return 0;
}
