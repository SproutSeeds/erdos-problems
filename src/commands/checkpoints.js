import { syncCheckpoints } from '../runtime/checkpoints.js';

export function runCheckpointsCommand(args) {
  const [subcommand, ...rest] = args;
  const asJson = rest.includes('--json');
  const unknown = rest.filter((arg) => arg !== '--json');

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos checkpoints sync [--json]');
    return 0;
  }

  if (subcommand !== 'sync') {
    console.error(`Unknown checkpoints subcommand: ${subcommand}`);
    return 1;
  }

  if (unknown.length > 0) {
    console.error(`Unknown checkpoints option: ${unknown[0]}`);
    return 1;
  }

  const result = syncCheckpoints();
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return 0;
  }

  console.log('Checkpoint shelf synced');
  console.log(`Index path: ${result.indexPath}`);
  console.log(`Checkpoint JSON: ${result.checkpointJsonPath}`);
  console.log(`Checkpoint count: ${result.checkpoints.length}`);
  console.log(`Last checkpoint sync: ${result.state.lastCheckpointSyncAt}`);
  return 0;
}
