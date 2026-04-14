import { getWorkspaceQuestionLedgerPath, getWorkspaceStateMarkdownPath } from '../runtime/paths.js';
import { syncOrpWorkspaceKit } from '../runtime/orp.js';
import { loadState, syncState } from '../runtime/state.js';

function printState(state) {
  console.log('Erdos research state');
  console.log(`Workspace root: ${state.workspaceRoot}`);
  console.log(`Open problem: ${state.activeProblem || '(none)'}`);
  console.log(`Problem title: ${state.problemTitle || '(none)'}`);
  console.log(`Cluster: ${state.cluster || '(none)'}`);
  console.log(`Family role: ${state.familyRole || '(none)'}`);
  console.log(`Harness profile: ${state.harnessProfile || '(none)'}`);
  console.log(`Active route: ${state.activeRoute || '(none)'}`);
  console.log(`Route breakthrough: ${state.routeBreakthrough ? 'yes' : 'no'}`);
  console.log(`Problem solved: ${state.problemSolved ? 'yes' : 'no'}`);
  console.log(`Continuation mode: ${state.continuation.mode}`);
  console.log(`Current frontier: ${state.currentFrontier.kind} / ${state.currentFrontier.detail}`);
  console.log(`Route story: ${state.routeStory || '(none)'}`);
  console.log(`Checkpoint focus: ${state.checkpointFocus || '(none)'}`);
  const frontierLoopLabel = state.frontierLoop?.suggested
    ? `active (${state.frontierLoop?.mode ?? 'unknown'})`
    : 'inactive';
  console.log(`Frontier loop: ${frontierLoopLabel}`);
  if (state.frontierLoop?.suggested) {
    if (state.frontierLoop?.summary) {
      console.log(`Frontier loop summary: ${state.frontierLoop.summary}`);
    }
    if (state.frontierLoop?.primaryCommand) {
      console.log(`Frontier loop entry: ${state.frontierLoop.primaryCommand}`);
    }
    if (state.frontierLoop?.refreshCommand) {
      console.log(`Frontier loop refresh: ${state.frontierLoop.refreshCommand}`);
    }
    if (state.frontierLoop?.mode === 'cpu' && state.frontierLoop?.upgradeCommand) {
      console.log(`Frontier loop upgrade: ${state.frontierLoop.upgradeCommand}`);
    }
  } else if (state.frontierLoop?.activationCommand) {
    console.log(`Frontier loop activation: ${state.frontierLoop.activationCommand}`);
    if (state.frontierLoop?.upgradeCommand) {
      console.log(`Frontier loop GPU path: ${state.frontierLoop.upgradeCommand}`);
    }
  }
  console.log(`Next honest move: ${state.nextHonestMove}`);
  console.log(`State markdown: ${getWorkspaceStateMarkdownPath()}`);
  console.log(`Question ledger: ${getWorkspaceQuestionLedgerPath()}`);
}

export function runStateCommand(args) {
  const [subcommand, ...rest] = args;
  const asJson = rest.includes('--json');

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos state sync [--json]');
    console.log('  erdos state show [--json]');
    return 0;
  }

  if (subcommand === 'sync') {
    syncOrpWorkspaceKit();
    const state = syncState();
    if (asJson) {
      console.log(JSON.stringify(state, null, 2));
      return 0;
    }
    printState(state);
    return 0;
  }

  if (subcommand === 'show') {
    const state = loadState();
    if (asJson) {
      console.log(JSON.stringify(state, null, 2));
      return 0;
    }
    printState(state);
    return 0;
  }

  console.error(`Unknown state subcommand: ${subcommand}`);
  return 1;
}
