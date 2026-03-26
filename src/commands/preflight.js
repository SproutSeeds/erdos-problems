import { buildPreflightReport } from '../runtime/preflight.js';

function printChecks(checks) {
  for (const [label, payload] of Object.entries(checks)) {
    console.log(`- ${label}: ${payload.ok ? 'ok' : 'attention'} (${payload.detail})`);
  }
}

export function runPreflightCommand(args) {
  const asJson = args.includes('--json');
  const allowDirty = args.includes('--allow-dirty');
  const unknown = args.filter((arg) => arg !== '--json' && arg !== '--allow-dirty');

  if (args.length > 0 && (args[0] === 'help' || args[0] === '--help')) {
    console.log('Usage:');
    console.log('  erdos preflight [--allow-dirty] [--json]');
    return 0;
  }

  if (unknown.length > 0) {
    console.error(`Unknown preflight option: ${unknown[0]}`);
    return 1;
  }

  const report = buildPreflightReport({ allowDirty });
  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
    return report.verdict === 'blocked' ? 2 : 0;
  }

  console.log('Research preflight');
  console.log(`- Workspace root: ${report.workspaceRoot}`);
  console.log(`- Open problem: ${report.activeProblem ?? '(none)'}`);
  console.log(`- Active route: ${report.activeRoute ?? '(none)'}`);
  console.log(`- Route breakthrough: ${report.routeBreakthrough ? 'yes' : 'no'}`);
  console.log(`- Problem solved: ${report.problemSolved ? 'yes' : 'no'}`);
  console.log(`- Continuation policy: ${report.continuationDisplay}`);
  console.log(`- Current frontier: ${report.currentFrontier.kind} / ${report.currentFrontier.detail}`);
  console.log(`- Next honest move: ${report.nextHonestMove}`);
  console.log('Checks:');
  printChecks(report.checks);
  console.log(`Verdict: ${report.verdict}`);
  return report.verdict === 'blocked' ? 2 : 0;
}
