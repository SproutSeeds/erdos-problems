import { ensureConfig, loadConfig, saveConfig } from '../runtime/config.js';
import { continuationDisplay, continuationModes, resolveContinuation } from '../runtime/continuation.js';
import { syncState } from '../runtime/state.js';

function printContinuation(payload) {
  console.log('Continuation mode');
  console.log(`Requested: ${payload.requestedMode}`);
  console.log(`Resolved: ${continuationDisplay(payload)}`);
  console.log(`Review cadence: ${payload.reviewCadence}`);
  console.log(`Max unattended minutes: ${payload.maxUnattendedMinutes}`);
  console.log(`Checkpoint after load-bearing result: ${payload.checkpointAfterLoadBearingResult ? 'yes' : 'no'}`);
  console.log(`Stop rule: ${payload.stopRule}`);
}

export function runContinuationCommand(args) {
  const [subcommand, value, ...rest] = args;
  const asJson = rest.includes('--json');

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos continuation show [--json]');
    console.log(`  erdos continuation use <${continuationModes().join('|')}> [--json]`);
    return 0;
  }

  if (subcommand === 'show') {
    const config = ensureConfig();
    const continuation = resolveContinuation({ requestedMode: config.continuation });
    if (asJson) {
      console.log(JSON.stringify(continuation, null, 2));
      return 0;
    }
    printContinuation(continuation);
    return 0;
  }

  if (subcommand === 'use') {
    if (!value) {
      console.error('Missing continuation mode.');
      return 1;
    }
    if (!continuationModes().includes(value)) {
      console.error(`Unknown continuation mode: ${value}`);
      return 1;
    }
    const config = loadConfig();
    saveConfig({ ...config, continuation: value });
    const state = syncState();
    if (asJson) {
      console.log(JSON.stringify(state.continuation, null, 2));
      return 0;
    }
    console.log(`Continuation mode set to ${continuationDisplay(state.continuation)}`);
    printContinuation(state.continuation);
    return 0;
  }

  console.error(`Unknown continuation subcommand: ${subcommand}`);
  return 1;
}
