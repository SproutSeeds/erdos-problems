import { runClusterCommand } from '../commands/cluster.js';
import { runDossierCommand } from '../commands/dossier.js';
import { runProblemCommand } from '../commands/problem.js';
import { runWorkspaceCommand } from '../commands/workspace.js';

function printUsage() {
  console.log('erdos-problems CLI');
  console.log('');
  console.log('Usage:');
  console.log('  erdos problem list [--cluster <name>]');
  console.log('  erdos problem show <id>');
  console.log('  erdos problem use <id>');
  console.log('  erdos problem current');
  console.log('  erdos cluster list');
  console.log('  erdos cluster show <name>');
  console.log('  erdos workspace show');
  console.log('  erdos dossier show <id>');
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
} else if (command === 'dossier') {
  exitCode = runDossierCommand(rest);
} else {
  console.error(`Unknown command: ${command}`);
  printUsage();
  exitCode = 1;
}

process.exitCode = exitCode;
