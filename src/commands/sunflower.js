import { getProblem } from '../atlas/catalog.js';
import { getWorkspaceRoot } from '../runtime/paths.js';
import { buildSunflowerStatusSnapshot, writeSunflowerStatusRecord } from '../runtime/sunflower.js';
import { readCurrentProblem } from '../runtime/workspace.js';

function parseStatusArgs(args) {
  const parsed = {
    problemId: null,
    asJson: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (!parsed.problemId) {
      parsed.problemId = token;
      continue;
    }
    return { error: `Unknown sunflower status option: ${token}` };
  }

  return parsed;
}

function printSunflowerStatus(snapshot, registryPaths) {
  console.log(`${snapshot.displayName} sunflower harness`);
  console.log(`Title: ${snapshot.title}`);
  console.log(`Family role: ${snapshot.familyRole ?? '(none)'}`);
  console.log(`Harness profile: ${snapshot.harnessProfile ?? '(none)'}`);
  console.log(`Active route: ${snapshot.activeRoute ?? '(none)'}`);
  console.log(`Route breakthrough: ${snapshot.routeBreakthrough ? 'yes' : 'no'}`);
  console.log(`Open problem: ${snapshot.openProblem ? 'yes' : 'no'}`);
  console.log(`Problem solved: ${snapshot.problemSolved ? 'yes' : 'no'}`);
  console.log(`Bootstrap focus: ${snapshot.bootstrapFocus ?? '(none)'}`);
  console.log(`Route story: ${snapshot.routeStory ?? '(none)'}`);
  console.log(`Frontier label: ${snapshot.frontierLabel ?? '(none)'}`);
  console.log(`Frontier detail: ${snapshot.frontierDetail ?? '(none)'}`);
  console.log(`Checkpoint focus: ${snapshot.checkpointFocus ?? '(none)'}`);
  console.log(`Next honest move: ${snapshot.nextHonestMove}`);
  console.log(`Related core problems: ${snapshot.relatedCoreProblems.join(', ') || '(none)'}`);
  console.log(`Literature focus: ${snapshot.literatureFocus.join(', ') || '(none)'}`);
  console.log(`Artifact focus: ${snapshot.artifactFocus.join(', ') || '(none)'}`);
  console.log(`Context file: ${snapshot.contextPath ?? '(none)'}`);
  console.log(`Route packet present: ${snapshot.routePacketPresent ? 'yes' : 'no'}`);
  if (snapshot.routePacket) {
    console.log(`Route packet id: ${snapshot.routePacket.routePacketId ?? '(none)'}`);
    console.log(`Route packet route: ${snapshot.routePacket.routeId ?? '(none)'}`);
    console.log(`Route frontier claim: ${snapshot.routePacket.frontierClaim ?? '(none)'}`);
    console.log(`Theorem module: ${snapshot.routePacket.theoremModule ?? '(none)'}`);
  }
  console.log(`Agent start packet: ${snapshot.agentStartPresent ? snapshot.agentStartPath : '(missing)'}`);
  console.log(`Checkpoint packet: ${snapshot.checkpointPacketPresent ? snapshot.checkpointPacketPath : '(missing)'}`);
  console.log(`Report packet: ${snapshot.reportPacketPresent ? snapshot.reportPacketPath : '(missing)'}`);
  console.log(`Compute lane present: ${snapshot.computeLanePresent ? 'yes' : 'no'}`);
  console.log(`Compute lane count: ${snapshot.computeLaneCount}`);
  console.log(`Compute summary: ${snapshot.computeSummary}`);
  console.log(`Compute reason: ${snapshot.computeReason ?? '(none)'}`);
  console.log(`Compute when: ${snapshot.computeWhen}`);
  console.log(`Compute next: ${snapshot.computeNextAction}`);
  if (snapshot.activePacket) {
    console.log(`Compute lane: ${snapshot.activePacket.laneId} [${snapshot.activePacket.status}]`);
    console.log(`Claim level goal: ${snapshot.activePacket.claimLevelGoal}`);
    console.log(`Recommendation: ${snapshot.activePacket.recommendation || '(none)'}`);
    console.log(`Approval required: ${snapshot.activePacket.approvalRequired ? 'yes' : 'no'}`);
    console.log(`Price checked: ${snapshot.activePacket.priceCheckedLocalDate || '(unknown)'}`);
    console.log(`Packet file: ${snapshot.activePacket.packetFileName}`);
  }
  if (snapshot.computeGovernance) {
    console.log(`Breakthroughs engine: ${snapshot.computeGovernance.engine}`);
    console.log(`Dispatch action: ${snapshot.computeGovernance.dispatchResult.action}`);
    console.log(`Dispatch rung: ${snapshot.computeGovernance.selectedRung.label} [${snapshot.computeGovernance.selectedRung.spendClass}]`);
  }
  console.log(`Registry record: ${registryPaths.latestPath}`);
}

export function runSunflowerCommand(args) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos sunflower status [<id>] [--json]');
    return 0;
  }

  if (subcommand !== 'status') {
    console.error(`Unknown sunflower subcommand: ${subcommand}`);
    return 1;
  }

  const parsed = parseStatusArgs(rest);
  if (parsed.error) {
    console.error(parsed.error);
    return 1;
  }

  const problemId = parsed.problemId ?? readCurrentProblem();
  if (!problemId) {
    console.error('Missing problem id and no active problem is selected.');
    return 1;
  }

  const problem = getProblem(problemId);
  if (!problem) {
    console.error(`Unknown problem: ${problemId}`);
    return 1;
  }

  if (problem.cluster !== 'sunflower') {
    console.error(`Problem ${problem.problemId} is not in the sunflower harness.`);
    return 1;
  }

  const snapshot = buildSunflowerStatusSnapshot(problem);
  const registryPaths = writeSunflowerStatusRecord(problem, snapshot, getWorkspaceRoot());

  if (parsed.asJson) {
    console.log(JSON.stringify({ ...snapshot, registryPaths }, null, 2));
    return 0;
  }

  printSunflowerStatus(snapshot, registryPaths);
  return 0;
}
