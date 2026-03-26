import { getOrpStatus, syncOrpWorkspaceKit } from '../runtime/orp.js';

function printOrpStatus(status) {
  console.log('Open Research Protocol');
  console.log(`Workspace root: ${status.workspaceRoot}`);
  console.log(`Bundled protocol: ${status.bundled.protocolPresent ? status.bundled.protocolPath : '(missing)'}`);
  console.log(`Bundled integration: ${status.bundled.integrationPresent ? status.bundled.integrationPath : '(missing)'}`);
  console.log(`Bundled templates: ${status.bundled.templateNames.join(', ') || '(none)'}`);
  console.log(`Workspace ORP dir: ${status.workspace.orpDir}`);
  console.log(`Workspace protocol: ${status.workspace.protocolPresent ? status.workspace.protocolPath : '(missing)'}`);
  console.log(`Workspace integration: ${status.workspace.integrationPresent ? status.workspace.integrationPath : '(missing)'}`);
  console.log(`Workspace templates: ${status.workspace.templateNames.join(', ') || '(none)'}`);
}

export function runOrpCommand(args) {
  const [subcommand, ...rest] = args;
  const asJson = rest.includes('--json');
  const unknown = rest.filter((arg) => arg !== '--json');

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos orp show [--json]');
    console.log('  erdos orp sync [--json]');
    return 0;
  }

  if (unknown.length > 0) {
    console.error(`Unknown orp option: ${unknown[0]}`);
    return 1;
  }

  if (subcommand === 'show') {
    const status = getOrpStatus();
    if (asJson) {
      console.log(JSON.stringify(status, null, 2));
      return 0;
    }
    printOrpStatus(status);
    return 0;
  }

  if (subcommand === 'sync') {
    const result = syncOrpWorkspaceKit();
    if (asJson) {
      console.log(JSON.stringify(result, null, 2));
      return 0;
    }
    console.log('ORP workspace kit synced');
    console.log(`Workspace ORP dir: ${result.orpDir}`);
    console.log(`Protocol: ${result.protocolPath}`);
    console.log(`Agent integration: ${result.integrationPath}`);
    console.log(`Templates: ${result.templateNames.join(', ') || '(none)'}`);
    return 0;
  }

  console.error(`Unknown orp subcommand: ${subcommand}`);
  return 1;
}
