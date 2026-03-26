import { runBootstrapCommand } from '../commands/bootstrap.js';
import { runCheckpointsCommand } from '../commands/checkpoints.js';
import { runClusterCommand } from '../commands/cluster.js';
import { runContinuationCommand } from '../commands/continuation.js';
import { runDossierCommand } from '../commands/dossier.js';
import { runMaintainerCommand } from '../commands/maintainer.js';
import { runOrpCommand } from '../commands/orp.js';
import { runPreflightCommand } from '../commands/preflight.js';
import { runProblemCommand } from '../commands/problem.js';
import { runPullCommand } from '../commands/pull.js';
import { runScaffoldCommand } from '../commands/scaffold.js';
import { runSeedCommand } from '../commands/seed.js';
import { runStateCommand } from '../commands/state.js';
import { runSunflowerCommand } from '../commands/sunflower.js';
import { runUpstreamCommand } from '../commands/upstream.js';
import { runWorkspaceCommand } from '../commands/workspace.js';

function printUsage() {
  console.log('erdos-problems CLI');
  console.log('');
  console.log('Usage:');
  console.log('  erdos problem list [--cluster <name>] [--repo-status <status>] [--harness-depth <depth>] [--site-status <status>]');
  console.log('  erdos problem show <id>');
  console.log('  erdos problem use <id>');
  console.log('  erdos problem current');
  console.log('  erdos problem artifacts [<id>] [--json]');
  console.log('  erdos cluster list');
  console.log('  erdos cluster show <name>');
  console.log('  erdos workspace show');
  console.log('  erdos orp show [--json]');
  console.log('  erdos orp sync [--json]');
  console.log('  erdos state sync [--json]');
  console.log('  erdos state show [--json]');
  console.log('  erdos continuation show [--json]');
  console.log('  erdos continuation use <atom|route|phase|milestone> [--json]');
  console.log('  erdos preflight [--allow-dirty] [--json]');
  console.log('  erdos checkpoints sync [--json]');
  console.log('  erdos sunflower status [<id>] [--json]');
  console.log('  erdos sunflower board [<id>] [--json]');
  console.log('  erdos sunflower ready [<id>] [--json]');
  console.log('  erdos sunflower ladder [<id>] [--json]');
  console.log('  erdos sunflower routes [<id>] [--json]');
  console.log('  erdos sunflower tickets [<id>] [--json]');
  console.log('  erdos dossier show <id>');
  console.log('  erdos upstream show');
  console.log('  erdos upstream sync [--write-package-snapshot]');
  console.log('  erdos upstream diff [--write-package-report]');
  console.log('  erdos scaffold problem <id> [--dest <path>]');
  console.log('  erdos bootstrap problem <id> [--dest <path>] [--sync-upstream]');
  console.log('  erdos seed problem <id> [--include-site|--no-site] [--include-public-search|--no-public-search] [--refresh-upstream] [--cluster <name>] [--repo-status <status>] [--harness-depth <depth>] [--title <title>] [--family-tag <tag>] [--related <id>] [--formalization-status <status>] [--active-route <route>] [--route-breakthrough] [--problem-solved] [--allow-non-open] [--dest-root <path>] [--no-activate] [--no-loop-sync] [--force] [--json]');
  console.log('  erdos pull problem <id> [--dest <path>] [--include-site] [--include-public-search] [--refresh-upstream]');
  console.log('  erdos pull artifacts <id> [--dest <path>] [--refresh-upstream]');
  console.log('  erdos pull literature <id> [--dest <path>] [--include-site] [--include-public-search] [--refresh-upstream]');
  console.log('  erdos maintainer seed problem <id> [--from-pull <path>] [--dest-root <path>] [--cluster <name>] [--allow-non-open]');
}

const args = process.argv.slice(2);
const [command, ...rest] = args;

let exitCode = 0;

if (!command || command === 'help' || command === '--help') {
  printUsage();
} else if (command === 'problem') {
  exitCode = runProblemCommand(rest);
} else if (command === 'cluster') {
  exitCode = runClusterCommand(rest);
} else if (command === 'workspace') {
  exitCode = runWorkspaceCommand(rest);
} else if (command === 'orp') {
  exitCode = runOrpCommand(rest);
} else if (command === 'state') {
  exitCode = runStateCommand(rest);
} else if (command === 'continuation') {
  exitCode = runContinuationCommand(rest);
} else if (command === 'preflight') {
  exitCode = runPreflightCommand(rest);
} else if (command === 'checkpoints') {
  exitCode = runCheckpointsCommand(rest);
} else if (command === 'sunflower') {
  exitCode = runSunflowerCommand(rest);
} else if (command === 'dossier') {
  exitCode = runDossierCommand(rest);
} else if (command === 'upstream') {
  exitCode = await runUpstreamCommand(rest);
} else if (command === 'scaffold') {
  exitCode = runScaffoldCommand(rest);
} else if (command === 'bootstrap') {
  exitCode = await runBootstrapCommand(rest);
} else if (command === 'seed') {
  exitCode = await runSeedCommand(rest);
} else if (command === 'pull') {
  exitCode = await runPullCommand(rest);
} else if (command === 'maintainer') {
  exitCode = runMaintainerCommand(rest);
} else {
  console.error(`Unknown command: ${command}`);
  printUsage();
  exitCode = 1;
}

process.exitCode = exitCode;
