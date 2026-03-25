import { getWorkspaceSummary } from '../runtime/workspace.js';

export function runWorkspaceCommand(args) {
  const [subcommand] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos workspace show');
    return 0;
  }

  if (subcommand !== 'show') {
    console.error(`Unknown workspace subcommand: ${subcommand}`);
    return 1;
  }

  const summary = getWorkspaceSummary();
  console.log(`Workspace root: ${summary.workspaceRoot}`);
  console.log(`State dir: ${summary.stateDir}`);
  console.log(`Initialized: ${summary.hasState ? 'yes' : 'no'}`);
  console.log(`Active problem: ${summary.activeProblem ?? '(none)'}`);
  console.log(`Updated at: ${summary.updatedAt ?? '(none)'}`);
  return 0;
}
