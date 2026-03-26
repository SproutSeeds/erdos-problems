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

function parseBoardArgs(args) {
  return parseStatusArgs(args);
}

function parseReadyArgs(args) {
  return parseStatusArgs(args);
}

function parseLadderArgs(args) {
  return parseStatusArgs(args);
}

function parseRoutesArgs(args) {
  return parseStatusArgs(args);
}

function parseTicketsArgs(args) {
  return parseStatusArgs(args);
}

function getBoard(snapshot) {
  return snapshot.atomicBoardSummary;
}

function getBoardActiveRoute(snapshot) {
  return snapshot.atomicBoardSummary?.activeRoute ?? snapshot.activeRoute ?? null;
}

function routeProgressLabel(route, snapshot) {
  const strictClosed = route.strictTotal > 0 && route.strictDone >= route.strictTotal;
  const looseClosed = route.looseTotal > 0 && route.looseDone >= route.looseTotal;
  const activeRoute = getBoardActiveRoute(snapshot);

  if (route.route && route.route === activeRoute) {
    return strictClosed ? 'active, strict-closed' : 'active';
  }

  if (strictClosed) {
    return 'strict-closed';
  }

  if (looseClosed) {
    return 'loose-closed';
  }

  return 'open';
}

function ticketProgressLabel(ticket, snapshot) {
  const isActive = snapshot.activeTicket?.ticketId === ticket.ticketId;

  if (isActive && ticket.leafStatus === 'done') {
    return 'active, closed';
  }

  if (isActive) {
    return 'active';
  }

  if (ticket.leafStatus === 'done') {
    return 'closed';
  }

  return 'open';
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
  console.log(`Atomic board present: ${snapshot.atomicBoardPresent ? 'yes' : 'no'}`);
  if (snapshot.atomicBoardSummary) {
    console.log(`Atomic board: ${snapshot.atomicBoardSummary.boardTitle ?? '(none)'}`);
    console.log(`Atomic board profile: ${snapshot.atomicBoardSummary.boardProfile ?? '(none)'}`);
    console.log(`Atomic board route: ${snapshot.atomicBoardSummary.activeRoute ?? '(none)'}`);
    console.log(`Atomic board claim: ${snapshot.atomicBoardSummary.frontierClaim ?? '(none)'}`);
    console.log(`Atomic board module: ${snapshot.atomicBoardSummary.moduleTarget ?? '(none)'}`);
    if (snapshot.activeTicket) {
      console.log(
        `Atomic board active ticket: ${snapshot.activeTicket.ticketId} ${snapshot.activeTicket.ticketName} `
        + `[${snapshot.activeTicket.gatesDone}/${snapshot.activeTicket.gatesTotal} gates, `
        + `${snapshot.activeTicket.atomsDone}/${snapshot.activeTicket.atomsTotal} atoms]`,
      );
    }
    console.log(`Atomic board ready atoms: ${snapshot.readyAtomCount}`);
    console.log(`Atomic board mirage frontiers: ${snapshot.mirageFrontierCount}`);
    if (snapshot.firstReadyAtom) {
      console.log(`Atomic board first ready atom: ${snapshot.firstReadyAtom.atomId} — ${snapshot.firstReadyAtom.title}`);
    }
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

function printSunflowerBoard(snapshot) {
  const board = snapshot.atomicBoardSummary;
  if (!board) {
    console.log(`${snapshot.displayName} has no packaged sunflower board yet.`);
    return;
  }

  console.log(`${snapshot.displayName} sunflower board`);
  console.log(`Title: ${board.boardTitle}`);
  console.log(`Profile: ${board.boardProfile ?? '(none)'}`);
  console.log(`Active route: ${board.activeRoute ?? '(none)'}`);
  console.log(`Frontier claim: ${board.frontierClaim ?? '(none)'}`);
  console.log(`Module target: ${board.moduleTarget ?? '(none)'}`);
  console.log(`Source kind: ${board.sourceKind ?? '(none)'}`);
  console.log(`Source board json: ${board.sourceBoardJson ?? '(none)'}`);
  console.log(`Source board markdown: ${board.sourceBoardMarkdown ?? '(none)'}`);
  console.log(`Board packet: ${board.atomicBoardPath}`);
  console.log(`Board markdown: ${board.atomicBoardMarkdownPath ?? '(missing)'}`);
  console.log(`Ready atoms: ${snapshot.readyAtomCount}`);
  console.log(`Mirage frontiers: ${snapshot.mirageFrontierCount}`);
  if (snapshot.activeTicket) {
    console.log(
      `Active ticket: ${snapshot.activeTicket.ticketId} ${snapshot.activeTicket.ticketName} `
      + `[leaf=${snapshot.activeTicket.routeLeaf ?? '(none)'}, `
      + `status=${snapshot.activeTicket.leafStatus ?? '(none)'}, `
      + `gates=${snapshot.activeTicket.gatesDone}/${snapshot.activeTicket.gatesTotal}, `
      + `atoms=${snapshot.activeTicket.atomsDone}/${snapshot.activeTicket.atomsTotal}]`,
    );
  }

  console.log('Route status:');
  if (board.routeStatus.length === 0) {
    console.log('  (none)');
  } else {
    for (const route of board.routeStatus) {
      console.log(
        `  - ${route.route}: loose ${route.looseDone}/${route.looseTotal}, `
        + `strict ${route.strictDone}/${route.strictTotal}`,
      );
    }
  }

  console.log('Ticket board:');
  if (board.tickets.length === 0) {
    console.log('  (none)');
  } else {
    for (const ticket of board.tickets) {
      console.log(
        `  - ${ticket.ticketId} ${ticket.ticketName}: ${ticket.routeLeaf ?? '(none)'} `
        + `[leaf=${ticket.leafStatus ?? '(none)'}, gates=${ticket.gatesDone}/${ticket.gatesTotal}, `
        + `atoms=${ticket.atomsDone}/${ticket.atomsTotal}]`,
      );
    }
  }

  console.log('First-principles ladder:');
  if (board.ladder.length === 0) {
    console.log('  (none)');
  } else {
    for (const rung of board.ladder) {
      console.log(`  - ${rung.tier}: ${rung.done}/${rung.total}`);
    }
  }

  console.log('Ready queue:');
  if (board.readyQueue.length === 0) {
    console.log('  (none)');
  } else {
    for (const atom of board.readyQueue) {
      console.log(
        `  - ${atom.atomId} (${atom.ticketId} / ${atom.gateId} / ${atom.tier ?? 'tier-unknown'}): ${atom.title}`,
      );
    }
  }

  console.log('Notes:');
  if (board.notes.length === 0) {
    console.log('  (none)');
  } else {
    for (const note of board.notes) {
      console.log(`  - ${note}`);
    }
  }
}

function printSunflowerReady(snapshot) {
  const board = snapshot.atomicBoardSummary;
  if (!board) {
    console.log(`${snapshot.displayName} has no packaged sunflower board yet.`);
    return;
  }

  console.log(`${snapshot.displayName} sunflower ready queue`);
  console.log(`Board: ${board.boardTitle}`);
  console.log(`Active route: ${board.activeRoute ?? '(none)'}`);
  console.log(`Ready atoms: ${snapshot.readyAtomCount}`);
  console.log(`Mirage frontiers: ${snapshot.mirageFrontierCount}`);

  if (board.readyQueue.length === 0) {
    console.log('Ready queue:');
    console.log('  (none)');
    return;
  }

  console.log('Ready queue:');
  for (const atom of board.readyQueue) {
    console.log(
      `  - ${atom.atomId} (${atom.ticketId} / ${atom.gateId} / ${atom.tier ?? 'tier-unknown'} / ${atom.kind ?? 'kind-unknown'}): ${atom.title}`,
    );
  }
}

function printSunflowerLadder(snapshot) {
  const board = getBoard(snapshot);
  if (!board) {
    console.log(`${snapshot.displayName} has no packaged sunflower board yet.`);
    return;
  }

  console.log(`${snapshot.displayName} sunflower ladder`);
  console.log(`Board: ${board.boardTitle}`);
  console.log(`Active route: ${board.activeRoute ?? '(none)'}`);

  if (board.ladder.length === 0) {
    console.log('First-principles ladder:');
    console.log('  (none)');
    return;
  }

  console.log('First-principles ladder:');
  for (const rung of board.ladder) {
    console.log(`  - ${rung.tier}: ${rung.done}/${rung.total}`);
  }
}

function printSunflowerRoutes(snapshot) {
  const board = getBoard(snapshot);
  if (!board) {
    console.log(`${snapshot.displayName} has no packaged sunflower board yet.`);
    return;
  }

  console.log(`${snapshot.displayName} sunflower routes`);
  console.log(`Board: ${board.boardTitle}`);
  console.log(`Profile: ${board.boardProfile ?? '(none)'}`);
  console.log(`Active route: ${getBoardActiveRoute(snapshot) ?? '(none)'}`);
  console.log(`Route breakthrough: ${snapshot.routeBreakthrough ? 'yes' : 'no'}`);
  console.log(`Frontier claim: ${board.frontierClaim ?? '(none)'}`);
  console.log(`Ready atoms: ${snapshot.readyAtomCount}`);
  console.log(`Mirage frontiers: ${snapshot.mirageFrontierCount}`);
  if (snapshot.firstReadyAtom) {
    console.log(`First ready atom: ${snapshot.firstReadyAtom.atomId} — ${snapshot.firstReadyAtom.title}`);
  }

  if (board.routeStatus.length === 0) {
    console.log('Route table:');
    console.log('  (none)');
    return;
  }

  console.log('Route table:');
  for (const route of board.routeStatus) {
    console.log(
      `  - ${route.route} [${routeProgressLabel(route, snapshot)}]: `
      + `loose ${route.looseDone}/${route.looseTotal}, `
      + `strict ${route.strictDone}/${route.strictTotal}`,
    );
  }
}

function printSunflowerTickets(snapshot) {
  const board = getBoard(snapshot);
  if (!board) {
    console.log(`${snapshot.displayName} has no packaged sunflower board yet.`);
    return;
  }

  const closedTickets = board.tickets.filter((ticket) => ticketProgressLabel(ticket, snapshot) === 'closed').length;

  console.log(`${snapshot.displayName} sunflower tickets`);
  console.log(`Board: ${board.boardTitle}`);
  console.log(`Active route: ${getBoardActiveRoute(snapshot) ?? '(none)'}`);
  console.log(`Active ticket: ${snapshot.activeTicket?.ticketId ?? '(none)'}`);
  console.log(`Closed tickets: ${closedTickets}/${board.tickets.length}`);
  console.log(`Ready atoms: ${snapshot.readyAtomCount}`);
  if (snapshot.firstReadyAtom) {
    console.log(`First ready atom: ${snapshot.firstReadyAtom.atomId} — ${snapshot.firstReadyAtom.title}`);
  }

  if (board.tickets.length === 0) {
    console.log('Ticket table:');
    console.log('  (none)');
    return;
  }

  console.log('Ticket table:');
  for (const ticket of board.tickets) {
    console.log(
      `  - ${ticket.ticketId} ${ticket.ticketName} [${ticketProgressLabel(ticket, snapshot)}]: `
      + `${ticket.routeLeaf ?? '(none)'} `
      + `[leaf=${ticket.leafStatus ?? '(none)'}, gates=${ticket.gatesDone}/${ticket.gatesTotal}, `
      + `atoms=${ticket.atomsDone}/${ticket.atomsTotal}]`,
    );
  }
}

export function runSunflowerCommand(args) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos sunflower status [<id>] [--json]');
    console.log('  erdos sunflower board [<id>] [--json]');
    console.log('  erdos sunflower ready [<id>] [--json]');
    console.log('  erdos sunflower ladder [<id>] [--json]');
    console.log('  erdos sunflower routes [<id>] [--json]');
    console.log('  erdos sunflower tickets [<id>] [--json]');
    return 0;
  }

  if (!['status', 'board', 'ready', 'ladder', 'routes', 'tickets'].includes(subcommand)) {
    console.error(`Unknown sunflower subcommand: ${subcommand}`);
    return 1;
  }

  let parsed;
  if (subcommand === 'board') {
    parsed = parseBoardArgs(rest);
  } else if (subcommand === 'ready') {
    parsed = parseReadyArgs(rest);
  } else if (subcommand === 'ladder') {
    parsed = parseLadderArgs(rest);
  } else if (subcommand === 'routes') {
    parsed = parseRoutesArgs(rest);
  } else if (subcommand === 'tickets') {
    parsed = parseTicketsArgs(rest);
  } else {
    parsed = parseStatusArgs(rest);
  }
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

  if (subcommand === 'board') {
    printSunflowerBoard(snapshot);
    return 0;
  }

  if (subcommand === 'ready') {
    printSunflowerReady(snapshot);
    return 0;
  }

  if (subcommand === 'ladder') {
    printSunflowerLadder(snapshot);
    return 0;
  }

  if (subcommand === 'routes') {
    printSunflowerRoutes(snapshot);
    return 0;
  }

  if (subcommand === 'tickets') {
    printSunflowerTickets(snapshot);
    return 0;
  }

  printSunflowerStatus(snapshot, registryPaths);
  return 0;
}
