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
  if (report.researchStack) {
    console.log('- Research stack:');
    console.log(`  - Canonical source: ${report.researchStack.canonicalSource.sourceUrl}`);
    console.log(`  - Import snapshot: ${report.researchStack.canonicalSource.importSnapshotKind ?? '(missing)'}`);
    console.log(`  - ORP sync: ${report.researchStack.localProtocol.commands.orpSync}`);
    console.log(`  - Checkpoint sync: ${report.researchStack.localProtocol.commands.checkpointsSync}`);
    console.log(`  - Theorem loop: ${report.researchStack.theorem.commands.show ?? '(none)'}`);
    console.log(`  - Theorem refresh: ${report.researchStack.theorem.commands.refresh ?? '(none)'}`);
    console.log(`  - Compute entry: ${report.researchStack.compute.entryCommand ?? '(none)'}`);
    if (report.researchStack.compute.hardwareDoctorCommand) {
      console.log(`  - Hardware doctor: ${report.researchStack.compute.hardwareDoctorCommand}`);
    }
    if (report.researchStack.researchApi) {
      console.log(`  - Research API status: ${report.researchStack.researchApi.statusCommand}`);
      console.log(`  - Research API plan: ${report.researchStack.researchApi.planCommand}`);
      console.log(`  - Research API smoke: ${report.researchStack.researchApi.openaiSmokeCommand}`);
      console.log(`  - Research API usage: ${report.researchStack.researchApi.usageCommand}`);
    }
    console.log(`  - Canonical writeback: ${report.researchStack.writeback.packagedRefreshCommand ?? '(none)'}`);
  }
  console.log('Checks:');
  printChecks(report.checks);
  console.log(`Verdict: ${report.verdict}`);
  return report.verdict === 'blocked' ? 2 : 0;
}
