import { getProblem } from '../atlas/catalog.js';
import { buildNumberTheoryStatusSnapshot } from '../runtime/number-theory.js';
import { readCurrentProblem } from '../runtime/workspace.js';

function resolveNumberTheoryProblem(problemId) {
  const resolvedId = problemId ?? readCurrentProblem();
  if (!resolvedId) {
    return { error: 'Missing problem id and no active problem is selected.' };
  }

  const problem = getProblem(resolvedId);
  if (!problem) {
    return { error: `Unknown problem: ${resolvedId}` };
  }

  if (problem.cluster !== 'number-theory') {
    return { error: `Problem ${resolvedId} is not in the number-theory pack.` };
  }

  return { problem };
}

function parseArgs(args) {
  const parsed = {
    problemId: null,
    asJson: false,
  };

  for (const token of args) {
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (!parsed.problemId) {
      parsed.problemId = token;
      continue;
    }
    return { error: `Unknown number-theory option: ${token}` };
  }

  return parsed;
}

function printStatus(snapshot) {
  console.log(`${snapshot.displayName} number-theory harness`);
  console.log(`Family role: ${snapshot.familyRole}`);
  console.log(`Harness profile: ${snapshot.harnessProfile}`);
  console.log(`Site status: ${snapshot.siteStatus}`);
  console.log(`Archive mode: ${snapshot.archiveMode ?? '(none)'}`);
  console.log(`Active route: ${snapshot.activeRoute ?? '(none)'}`);
  console.log(`Route breakthrough: ${snapshot.routeBreakthrough ? 'yes' : 'no'}`);
  console.log(`Open problem: ${snapshot.openProblem ? 'yes' : 'no'}`);
  console.log(`Problem solved: ${snapshot.problemSolved ? 'yes' : 'no'}`);
  console.log(`Frontier label: ${snapshot.frontierLabel}`);
  console.log(`Frontier detail: ${snapshot.frontierDetail}`);
  console.log(`Checkpoint focus: ${snapshot.checkpointFocus ?? '(none)'}`);
  console.log(`Next honest move: ${snapshot.nextHonestMove}`);
  console.log(`Route packet present: ${snapshot.routePacketPresent ? 'yes' : 'no'}`);
  if (snapshot.routePacket?.route_packet_id) {
    console.log(`Route packet id: ${snapshot.routePacket.route_packet_id}`);
  }
  console.log(`Frontier note: ${snapshot.frontierNotePresent ? snapshot.frontierNotePath : '(missing)'}`);
  console.log(`Route history: ${snapshot.routeHistoryPresent ? snapshot.routeHistoryPath : '(missing)'}`);
  console.log(`Checkpoint template: ${snapshot.checkpointTemplatePresent ? snapshot.checkpointTemplatePath : '(missing)'}`);
  console.log(`Report template: ${snapshot.reportTemplatePresent ? snapshot.reportTemplatePath : '(missing)'}`);
  console.log(`Ops details present: ${snapshot.opsDetailsPresent ? 'yes' : 'no'}`);
  console.log(`Active ticket: ${snapshot.activeTicketDetail?.ticket_id ?? '(none)'}`);
  console.log(`Ready atoms: ${snapshot.readyAtomCount}`);
  if (snapshot.firstReadyAtom) {
    console.log(`First ready atom: ${snapshot.firstReadyAtom.atom_id} — ${snapshot.firstReadyAtom.title}`);
  }
}

function printFrontier(snapshot) {
  console.log(`${snapshot.displayName} number-theory frontier`);
  console.log(`Active route: ${snapshot.activeRoute ?? '(none)'}`);
  console.log(`Frontier label: ${snapshot.frontierLabel}`);
  console.log(`Frontier detail: ${snapshot.frontierDetail}`);
  console.log(`Checkpoint focus: ${snapshot.checkpointFocus ?? '(none)'}`);
  console.log(`Next honest move: ${snapshot.nextHonestMove}`);
  console.log(`Open problem: ${snapshot.openProblem ? 'yes' : 'no'}`);
  console.log(`Archive mode: ${snapshot.archiveMode ?? '(none)'}`);
  console.log(`Frontier note: ${snapshot.frontierNotePresent ? snapshot.frontierNotePath : '(missing)'}`);
  console.log(`Route history: ${snapshot.routeHistoryPresent ? snapshot.routeHistoryPath : '(missing)'}`);
}

function printRoutes(snapshot) {
  console.log(`${snapshot.displayName} number-theory routes`);
  console.log(`Active route: ${snapshot.activeRoute ?? '(none)'}`);
  if (!snapshot.opsDetails?.routes?.length) {
    console.log('Routes: none recorded.');
    return;
  }
  for (const route of snapshot.opsDetails.routes) {
    const flags = [];
    if (route.route_id === snapshot.activeRoute) {
      flags.push('active');
    }
    if (route.status) {
      flags.push(route.status);
    }
    console.log(`- ${route.route_id}${flags.length > 0 ? ` [${flags.join(', ')}]` : ''}`);
    if (route.title) {
      console.log(`  title: ${route.title}`);
    }
    if (route.summary) {
      console.log(`  summary: ${route.summary}`);
    }
    if (route.why_now) {
      console.log(`  why now: ${route.why_now}`);
    }
    if (route.next_move) {
      console.log(`  next move: ${route.next_move}`);
    }
  }
}

function printTickets(snapshot) {
  console.log(`${snapshot.displayName} number-theory tickets`);
  if (!snapshot.opsDetails?.tickets?.length) {
    console.log('Tickets: none recorded.');
    return;
  }
  console.log(`Active ticket: ${snapshot.activeTicketDetail?.ticket_id ?? '(none)'}`);
  for (const ticket of snapshot.opsDetails.tickets) {
    const flags = [];
    if (ticket.ticket_id === snapshot.activeTicketDetail?.ticket_id) {
      flags.push('active');
    }
    if (ticket.status) {
      flags.push(ticket.status);
    }
    console.log(`- ${ticket.ticket_id}${flags.length > 0 ? ` [${flags.join(', ')}]` : ''}`);
    if (ticket.title) {
      console.log(`  title: ${ticket.title}`);
    }
    if (ticket.summary) {
      console.log(`  summary: ${ticket.summary}`);
    }
    if (ticket.current_blocker) {
      console.log(`  blocker: ${ticket.current_blocker}`);
    }
    if (ticket.next_move) {
      console.log(`  next move: ${ticket.next_move}`);
    }
  }
}

export function runNumberTheoryCommand(args) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos number-theory status [<id>] [--json]');
    console.log('  erdos number-theory frontier [<id>] [--json]');
    console.log('  erdos number-theory routes [<id>] [--json]');
    console.log('  erdos number-theory tickets [<id>] [--json]');
    return 0;
  }

  if (!['status', 'frontier', 'routes', 'tickets'].includes(subcommand)) {
    console.error(`Unknown number-theory subcommand: ${subcommand}`);
    return 1;
  }

  const parsed = parseArgs(rest);
  if (parsed.error) {
    console.error(parsed.error);
    return 1;
  }

  const { problem, error } = resolveNumberTheoryProblem(parsed.problemId);
  if (error) {
    console.error(error);
    return 1;
  }

  const snapshot = buildNumberTheoryStatusSnapshot(problem);
  if (parsed.asJson) {
    console.log(JSON.stringify(snapshot, null, 2));
    return 0;
  }

  if (subcommand === 'frontier') {
    printFrontier(snapshot);
    return 0;
  }
  if (subcommand === 'routes') {
    printRoutes(snapshot);
    return 0;
  }
  if (subcommand === 'tickets') {
    printTickets(snapshot);
    return 0;
  }

  printStatus(snapshot);
  return 0;
}
