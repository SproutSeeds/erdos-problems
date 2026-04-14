import { runArchiveCommand } from '../commands/archive.js';
import { runBootstrapCommand } from '../commands/bootstrap.js';
import { runCheckpointsCommand } from '../commands/checkpoints.js';
import { runClusterCommand } from '../commands/cluster.js';
import { runContinuationCommand } from '../commands/continuation.js';
import { runDossierCommand } from '../commands/dossier.js';
import { runFrontierCommand } from '../commands/frontier.js';
import { runGraphTheoryCommand } from '../commands/graph-theory.js';
import { runMaintainerCommand } from '../commands/maintainer.js';
import { runNumberTheoryCommand } from '../commands/number-theory.js';
import { runOrpCommand } from '../commands/orp.js';
import { runPaperCommand } from '../commands/paper.js';
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
  console.log('  erdos problem theorem-loop [<id>] [--json]');
  console.log('  erdos problem theorem-loop-refresh [<id>] [--json]');
  console.log('  erdos problem claim-loop [<id>] [--json]');
  console.log('  erdos problem claim-loop-refresh [<id>] [--json]');
  console.log('  erdos problem claim-pass [<id>] [--json]');
  console.log('  erdos problem claim-pass-refresh [<id>] [--json]');
  console.log('  erdos problem formalization [<id>] [--json]');
  console.log('  erdos problem formalization-refresh [<id>] [--json]');
  console.log('  erdos problem formalization-work [<id>] [--json]');
  console.log('  erdos problem formalization-work-refresh [<id>] [--json]');
  console.log('  erdos problem formalization-work-check [<id>] [--json]');
  console.log('  erdos problem task-list [<id>] [--json]');
  console.log('  erdos problem task-list-refresh [<id>] [--json]');
  console.log('  erdos problem task-list-run [<id>] [--passes <n>] [--no-stop-on-convergence] [--json]');
  console.log('  erdos cluster list [--json]');
  console.log('  erdos cluster show <name> [--json]');
  console.log('  erdos archive show <id> [--json]');
  console.log('  erdos archive scaffold <id> [--json]');
  console.log('  erdos frontier doctor [--json]');
  console.log('  erdos frontier lanes [--json]');
  console.log('  erdos frontier remotes [--json]');
  console.log('  erdos frontier fleets [--json]');
  console.log('  erdos frontier fleet <fleet-id> [--json]');
  console.log('  erdos frontier use-remote <remote-id> [--json]');
  console.log('  erdos frontier sessions [--json]');
  console.log('  erdos frontier session <session-id> [--json]');
  console.log('  erdos frontier stop-session <session-id> [--json]');
  console.log('  erdos frontier setup [--base|--cpu|--cuda] [--torch-index-url <url>] [--apply] [--json]');
  console.log('  erdos frontier setup-remote [--remote-id <id>] [--base|--cpu|--cuda] [--torch-index-url <url>] [--apply] [--json]');
  console.log('  erdos frontier create-brev <name> [--gpu-name <name>] [--type <type>] [--provider <provider>] [--count <n>] [--attach] [--enable-paid-rung] [--sync-lane <lane-id>] [--dry-run] [--apply] [--json]');
  console.log('  erdos frontier create-brev-fleet <fleet-id> [--gpu-name <name>] [--type <type>] [--provider <provider>] [--count <n>] [--attach] [--enable-paid-rung] [--sync-lane <lane-id>] [--dry-run] [--apply] [--json]');
  console.log('  erdos frontier attach-ssh --ssh-host <host> [--remote-id <id>] [--engine-root <path>] [--python-command <cmd>] [--apply] [--json]');
  console.log('  erdos frontier attach-brev --instance <name> [--remote-id <id>] [--ssh-host <host>] [--engine-root <path>] [--python-command <cmd>] [--enable-paid-rung] [--apply] [--json]');
  console.log('  erdos frontier enable-paid-remote <remote-id> [--json]');
  console.log('  erdos frontier disable-paid-remote <remote-id> [--json]');
  console.log('  erdos frontier enable-paid-fleet <fleet-id> [--json]');
  console.log('  erdos frontier disable-paid-fleet <fleet-id> [--json]');
  console.log('  erdos frontier sync-ssh [--remote-id <id>] [--ssh-host <host>] [--engine-root <path>] [--python-command <cmd>] [--lane <lane-id>] [--apply] [--json]');
  console.log('  erdos frontier sync-fleet <fleet-id> [--lane <lane-id>] [--apply] [--json]');
  console.log('  erdos graph-theory status [<id>] [--json]');
  console.log('  erdos graph-theory frontier [<id>] [--json]');
  console.log('  erdos graph-theory routes [<id>] [--json]');
  console.log('  erdos graph-theory tickets [<id>] [--json]');
  console.log('  erdos number-theory status [<id>] [--json]');
  console.log('  erdos number-theory frontier [<id>] [--json]');
  console.log('  erdos number-theory bridge [<id>] [--json]');
  console.log('  erdos number-theory bridge-refresh [<id>] [--json]');
  console.log('  erdos number-theory dispatch [<id>] [--apply] [--detach] [--review-after-hours <n>] [--remote-id <id>] [--action <id>] [--exact-min <n>] [--exact-max <n>] [--json]');
  console.log('  erdos number-theory dispatch-fleet [<id>] --fleet <fleet-id> [--apply] [--review-after-hours <n>] [--strategy <id>] [--action <id>] [--json]');
  console.log('  erdos number-theory fleet-run <run-id> [--json]');
  console.log('  erdos number-theory routes [<id>] [--json]');
  console.log('  erdos number-theory tickets [<id>] [--json]');
  console.log('  erdos number-theory route <problem-id> <route-id> [--json]');
  console.log('  erdos number-theory ticket <problem-id> <ticket-id> [--json]');
  console.log('  erdos number-theory atom <problem-id> <atom-id> [--json]');
  console.log('  erdos workspace show [--json]');
  console.log('  erdos orp show [--json]');
  console.log('  erdos orp sync [--json]');
  console.log('  erdos paper init [<id>] [--dest <path>] [--json]');
  console.log('  erdos paper show [<id>] [--dest <path>] [--json]');
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
  console.log('  erdos sunflower frontier [<id>] [--json]');
  console.log('  erdos sunflower route <problem-id> <route-id> [--json]');
  console.log('  erdos sunflower ticket <problem-id> <ticket-id> [--json]');
  console.log('  erdos sunflower atom <problem-id> <atom-id> [--json]');
  console.log('  erdos sunflower compute run [<id>] [--json]');
  console.log('  erdos dossier show <id>');
  console.log('  erdos import show');
  console.log('  erdos import sync [--write-package-snapshot]');
  console.log('  erdos import diff [--write-package-report]');
  console.log('  erdos import drift [<id>] [--include-site] [--json]');
  console.log('  erdos scaffold problem <id> [--dest <path>]');
  console.log('  erdos bootstrap problem <id> [--dest <path>] [--sync-upstream]');
  console.log('  erdos seed problem <id> [--include-site|--no-site] [--include-public-search|--no-public-search] [--refresh-upstream] [--cluster <name>] [--repo-status <status>] [--harness-depth <depth>] [--title <title>] [--family-tag <tag>] [--related <id>] [--formalization-status <status>] [--active-route <route>] [--route-breakthrough] [--problem-solved] [--allow-non-open] [--dest-root <path>] [--no-activate] [--no-loop-sync] [--force] [--json]');
  console.log('  erdos pull problem <id> [--dest <path>] [--include-site] [--include-public-search] [--include-crossref] [--include-openalex] [--refresh-upstream] [--json]');
  console.log('  erdos pull artifacts <id> [--dest <path>] [--refresh-upstream] [--json]');
  console.log('  erdos pull literature <id> [--dest <path>] [--include-site] [--include-public-search] [--include-crossref] [--include-openalex] [--refresh-upstream] [--json]');
  console.log('  erdos maintainer seed problem <id> [--from-pull <path>] [--dest-root <path>] [--cluster <name>] [--allow-non-open]');
  console.log('  erdos maintainer review problem <id> [--from-pull <path>] [--dest-root <path>] [--title <title>]');
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
} else if (command === 'archive') {
  exitCode = runArchiveCommand(rest);
} else if (command === 'frontier') {
  exitCode = runFrontierCommand(rest);
} else if (command === 'graph-theory') {
  exitCode = runGraphTheoryCommand(rest);
} else if (command === 'number-theory') {
  exitCode = runNumberTheoryCommand(rest);
} else if (command === 'workspace') {
  exitCode = runWorkspaceCommand(rest);
} else if (command === 'orp') {
  exitCode = runOrpCommand(rest);
} else if (command === 'paper') {
  exitCode = runPaperCommand(rest);
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
} else if (command === 'upstream' || command === 'import') {
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
