import { getProblem } from '../atlas/catalog.js';
import {
  buildNumberTheoryStatusSnapshot,
  getNumberTheoryDispatchSnapshot,
  getNumberTheoryFleetDispatchSnapshot,
  getNumberTheoryFleetRunSnapshot,
  getNumberTheoryAtomSnapshot,
  getNumberTheoryBridgeSnapshot,
  getNumberTheoryRouteSnapshot,
  getNumberTheoryTicketSnapshot,
  refreshNumberTheoryBridge,
  runNumberTheoryFleetDispatch,
  runNumberTheoryDispatch,
} from '../runtime/number-theory.js';
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
    entityId: null,
    apply: false,
    detach: false,
    actionId: null,
    exactMin: null,
    exactMax: null,
    exactChunks: null,
    exactChunkSize: null,
    baseSideMax: null,
    structuralMax: null,
    structuralMin: null,
    mixedBaseMaxRows: null,
    fullMixedRowSampleLimit: null,
    structuralLiftTopRows: null,
    structuralLiftFamilyLimit: null,
    matchingPatternPrime: null,
    matchingPatternTopRows: null,
    matchingPatternPairSampleLimit: null,
    endpointMonotonicity: false,
    reviewAfterHours: null,
    remoteId: null,
    externalSourceDir: null,
    fleetId: null,
    strategyId: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (token === '--apply') {
      parsed.apply = true;
      continue;
    }
    if (token === '--detach') {
      parsed.detach = true;
      continue;
    }
    if (token === '--action') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing action id after --action.' };
      }
      parsed.actionId = nextValue;
      index += 1;
      continue;
    }
    if (token === '--exact-min') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --exact-min.' };
      }
      parsed.exactMin = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--exact-max') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --exact-max.' };
      }
      parsed.exactMax = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--exact-chunks') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --exact-chunks.' };
      }
      parsed.exactChunks = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--exact-chunk-size') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --exact-chunk-size.' };
      }
      parsed.exactChunkSize = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--base-side-max') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --base-side-max.' };
      }
      parsed.baseSideMax = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--structural-max') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --structural-max.' };
      }
      parsed.structuralMax = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--structural-min') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --structural-min.' };
      }
      parsed.structuralMin = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--mixed-base-max-rows') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --mixed-base-max-rows.' };
      }
      parsed.mixedBaseMaxRows = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--full-mixed-row-sample-limit') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --full-mixed-row-sample-limit.' };
      }
      parsed.fullMixedRowSampleLimit = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--structural-lift-top-rows') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --structural-lift-top-rows.' };
      }
      parsed.structuralLiftTopRows = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--structural-lift-family-limit') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --structural-lift-family-limit.' };
      }
      parsed.structuralLiftFamilyLimit = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--matching-pattern-prime') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --matching-pattern-prime.' };
      }
      parsed.matchingPatternPrime = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--matching-pattern-top-rows') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --matching-pattern-top-rows.' };
      }
      parsed.matchingPatternTopRows = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--matching-pattern-pair-sample-limit') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing integer after --matching-pattern-pair-sample-limit.' };
      }
      parsed.matchingPatternPairSampleLimit = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--endpoint-monotonicity') {
      parsed.endpointMonotonicity = true;
      continue;
    }
    if (token === '--review-after-hours') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing number after --review-after-hours.' };
      }
      parsed.reviewAfterHours = Number(nextValue);
      index += 1;
      continue;
    }
    if (token === '--remote-id') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing remote id after --remote-id.' };
      }
      parsed.remoteId = nextValue;
      index += 1;
      continue;
    }
    if (token === '--external-source-dir') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing path after --external-source-dir.' };
      }
      parsed.externalSourceDir = nextValue;
      index += 1;
      continue;
    }
    if (token === '--fleet') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing fleet id after --fleet.' };
      }
      parsed.fleetId = nextValue;
      index += 1;
      continue;
    }
    if (token === '--strategy') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing strategy id after --strategy.' };
      }
      parsed.strategyId = nextValue;
      index += 1;
      continue;
    }
    if (!parsed.problemId) {
      parsed.problemId = token;
      continue;
    }
    if (!parsed.entityId) {
      parsed.entityId = token;
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
  console.log(`Theorem loop: ${snapshot.theoremLoop?.theoremLoopMode ?? '(missing)'}`);
  console.log(`Theorem claim surface: ${snapshot.theoremLoop?.currentState?.currentClaimSurface ?? '(none)'}`);
  console.log(`Theorem note: ${snapshot.theoremLoop?.theoremLoopMarkdownPresent ? snapshot.theoremLoop.theoremLoopMarkdownPath : '(not written yet)'}`);
  console.log(`Theorem command: ${snapshot.theoremLoop?.commands?.theoremLoop ?? '(none)'}`);
  console.log(`Theorem refresh: ${snapshot.theoremLoop?.commands?.theoremLoopRefresh ?? '(none)'}`);
  console.log(`Claim loop: ${snapshot.claimLoop?.claimLoopMode ?? '(missing)'}`);
  console.log(`Claim note: ${snapshot.claimLoop?.claimLoopMarkdownPresent ? snapshot.claimLoop.claimLoopMarkdownPath : '(not written yet)'}`);
  console.log(`Claim command: ${snapshot.claimLoop?.commands?.claimLoop ?? '(none)'}`);
  console.log(`Claim refresh: ${snapshot.claimLoop?.commands?.claimLoopRefresh ?? '(none)'}`);
  console.log(`Claim pass: ${snapshot.claimPass?.claimPassMode ?? '(missing)'}`);
  console.log(`Claim pass note: ${snapshot.claimPass?.claimPassMarkdownPresent ? snapshot.claimPass.claimPassMarkdownPath : '(not written yet)'}`);
  console.log(`Claim pass command: ${snapshot.claimPass?.commands?.claimPass ?? '(none)'}`);
  console.log(`Claim pass refresh: ${snapshot.claimPass?.commands?.claimPassRefresh ?? '(none)'}`);
  console.log(`Formalization: ${snapshot.formalization?.formalizationMode ?? '(missing)'}`);
  console.log(`Formalization note: ${snapshot.formalization?.formalizationMarkdownPresent ? snapshot.formalization.formalizationMarkdownPath : '(not written yet)'}`);
  console.log(`Formalization command: ${snapshot.formalization?.commands?.formalization ?? '(none)'}`);
  console.log(`Formalization refresh: ${snapshot.formalization?.commands?.formalizationRefresh ?? '(none)'}`);
  console.log(`Formalization work: ${snapshot.formalizationWork?.formalizationWorkMode ?? '(missing)'}`);
  console.log(`Formalization work note: ${snapshot.formalizationWork?.formalizationWorkMarkdownPresent ? snapshot.formalizationWork.formalizationWorkMarkdownPath : '(not written yet)'}`);
  console.log(`Formalization work command: ${snapshot.formalizationWork?.commands?.formalizationWork ?? '(none)'}`);
  console.log(`Formalization work refresh: ${snapshot.formalizationWork?.commands?.formalizationWorkRefresh ?? '(none)'}`);
  console.log(`Task list: ${snapshot.taskList?.taskListMode ?? '(missing)'}`);
  console.log(`Task list note: ${snapshot.taskList?.taskListMarkdownPresent ? snapshot.taskList.taskListMarkdownPath : '(not written yet)'}`);
  console.log(`Task list command: ${snapshot.taskList?.commands?.taskList ?? '(none)'}`);
  console.log(`Task list refresh: ${snapshot.taskList?.commands?.taskListRefresh ?? '(none)'}`);
  console.log(`Search/theorem bridge: ${snapshot.searchTheoremBridgePresent ? snapshot.searchTheoremBridgePath : '(missing)'}`);
  console.log(`Bridge data: ${snapshot.searchTheoremBridgeJsonPresent ? snapshot.searchTheoremBridgeJsonPath : '(missing)'}`);
  console.log(`Bridge refresh: ${snapshot.searchTheoremBridgeRefreshCommand ?? '(none)'}`);
  const frontierLoopLabel = snapshot.frontierLoopSuggested
    ? `active (${snapshot.frontierLoop?.mode ?? 'unknown'})`
    : 'inactive';
  console.log(`Frontier loop: ${frontierLoopLabel}`);
  if (snapshot.frontierLoopSuggested) {
    if (snapshot.frontierLoop?.summary) {
      console.log(`Frontier loop summary: ${snapshot.frontierLoop.summary}`);
    }
    if (snapshot.frontierLoop?.primaryCommand) {
      console.log(`Frontier loop entry: ${snapshot.frontierLoop.primaryCommand}`);
    }
    if (snapshot.frontierLoop?.commands?.length) {
      console.log(`Frontier loop commands: ${snapshot.frontierLoop.commands.join(' | ')}`);
    }
    if (snapshot.frontierLoop?.mode === 'cpu' && snapshot.frontierLoop?.upgradeCommand) {
      console.log(`Frontier loop upgrade: ${snapshot.frontierLoop.upgradeCommand}`);
    }
  } else if (snapshot.frontierLoop?.activationCommand) {
    console.log(`Frontier loop activation: ${snapshot.frontierLoop.activationCommand}`);
    if (snapshot.frontierLoop?.upgradeCommand) {
      console.log(`Frontier loop GPU path: ${snapshot.frontierLoop.upgradeCommand}`);
    }
  }
  if (!snapshot.frontierLoopSuggested && snapshot.frontierLoop?.stateReason) {
    console.log(`Frontier loop reason: ${snapshot.frontierLoop.stateReason}`);
  }
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
  console.log(`Search/theorem bridge: ${snapshot.searchTheoremBridgePresent ? snapshot.searchTheoremBridgePath : '(missing)'}`);
  const frontierLoopLabel = snapshot.frontierLoopSuggested
    ? `active (${snapshot.frontierLoop?.mode ?? 'unknown'})`
    : 'inactive';
  console.log(`Frontier loop: ${frontierLoopLabel}`);
  if (snapshot.frontierLoopSuggested && snapshot.frontierLoop?.primaryCommand) {
    console.log(`Frontier loop entry: ${snapshot.frontierLoop.primaryCommand}`);
  } else if (snapshot.frontierLoop?.activationCommand) {
    console.log(`Frontier loop activation: ${snapshot.frontierLoop.activationCommand}`);
  }
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

function printRouteDetail(snapshot) {
  const route = snapshot.routeDetail;
  console.log(`${snapshot.displayName} number-theory route ${snapshot.routeId}`);
  console.log(`Title: ${route.title ?? snapshot.routeId}`);
  console.log(`Status: ${route.status ?? '(unknown)'}`);
  console.log(`Active route: ${route.route_id === snapshot.activeRoute ? 'yes' : 'no'}`);
  console.log(`Summary: ${route.summary ?? '(none)'}`);
  console.log(`Why now: ${route.why_now ?? '(none)'}`);
  console.log(`Next move: ${route.next_move ?? '(none)'}`);
  if (Array.isArray(route.ticket_ids) && route.ticket_ids.length > 0) {
    console.log(`Tickets: ${route.ticket_ids.join(', ')}`);
  }
}

function printTicketDetail(snapshot) {
  const ticket = snapshot.ticketDetail;
  console.log(`${snapshot.displayName} number-theory ticket ${snapshot.ticketId}`);
  console.log(`Title: ${ticket.title ?? snapshot.ticketId}`);
  console.log(`Status: ${ticket.status ?? '(unknown)'}`);
  console.log(`Active ticket: ${ticket.ticket_id === snapshot.activeTicketDetail?.ticket_id ? 'yes' : 'no'}`);
  console.log(`Summary: ${ticket.summary ?? '(none)'}`);
  console.log(`Current blocker: ${ticket.current_blocker ?? '(none)'}`);
  console.log(`Next move: ${ticket.next_move ?? '(none)'}`);
  if (Array.isArray(ticket.atom_ids) && ticket.atom_ids.length > 0) {
    console.log(`Atoms: ${ticket.atom_ids.join(', ')}`);
  }
}

function printAtomDetail(snapshot) {
  const atom = snapshot.atomDetail;
  console.log(`${snapshot.displayName} number-theory atom ${snapshot.atomId}`);
  console.log(`Title: ${atom.title ?? snapshot.atomId}`);
  console.log(`Status: ${atom.status ?? '(unknown)'}`);
  console.log(`Current frontier atom: ${atom.atom_id === snapshot.firstReadyAtom?.atom_id ? 'yes' : 'no'}`);
  console.log(`Summary: ${atom.summary ?? '(none)'}`);
  console.log(`Next move: ${atom.next_move ?? '(none)'}`);
}

function printBridge(snapshot) {
  console.log(`${snapshot.displayName} number-theory bridge`);
  console.log(`Bridge note: ${snapshot.bridgeMarkdownPresent ? snapshot.bridgeMarkdownPath : '(missing)'}`);
  console.log(`Bridge data: ${snapshot.bridgeJsonPresent ? snapshot.bridgeJsonPath : '(missing)'}`);
  console.log(`Frontier-engine: ${snapshot.frontierEnginePresent ? snapshot.frontierEngineRootPath : '(missing)'}`);
  console.log(`Refresh command: ${snapshot.bridgeRefreshCommand ?? '(none)'}`);
  console.log(`Engine command: ${snapshot.bridgeEngineCommand ?? '(none)'}`);
  if (snapshot.bridgeRefreshMode) {
    console.log(`Refresh mode: ${snapshot.bridgeRefreshMode}`);
  }
  if (snapshot.bridgeRefreshResolvedCommand) {
    console.log(`Resolved engine command: ${snapshot.bridgeRefreshResolvedCommand}`);
  }
  if (snapshot.bridgeRefreshReason) {
    console.log(`Refresh mode reason: ${snapshot.bridgeRefreshReason}`);
  }

  if (!snapshot.bridgePresent || !snapshot.bridgeCurrentState) {
    console.log('Bridge state: unavailable.');
    return;
  }

  const state = snapshot.bridgeCurrentState;
  console.log(`Shared-prefix failures frozen: ${state.shared_prefix_failure_count ?? '(unknown)'}`);
  console.log(`Latest shared-prefix failure: ${state.latest_shared_prefix_failure ?? '(unknown)'}`);
  console.log(`Family menu count: ${state.family_menu_count ?? '(unknown)'}`);
  console.log(`Known family matches: ${state.known_family_matches ?? '(unknown)'}`);
  console.log(`Next unmatched representative: ${state.next_unmatched_representative ?? '(unknown)'}`);
  console.log(`Matches 282 tail failure: ${state.next_unmatched_matches_282_failure ? 'yes' : 'no'}`);
  if (state.strongest_completed_structured_tail) {
    console.log(
      `Strongest completed structured tail: ${state.strongest_completed_structured_tail.continuation} through ${state.strongest_completed_structured_tail.clean_through}`,
    );
  }
  if (state.current_family_aware_leader) {
    console.log(
      `Current family-aware leader: ${state.current_family_aware_leader.continuation} (${state.current_family_aware_leader.repaired_known_packets} known packets, ${state.current_family_aware_leader.repaired_predicted_families} predicted families, ${state.current_family_aware_leader.effective_clean_through} clean-through)`,
    );
  }
  const tieClass = Array.isArray(state.top_gpu_tie_class) && state.top_gpu_tie_class.length > 0
    ? state.top_gpu_tie_class.join(', ')
    : '(none)';
  console.log(`Top GPU tie class: ${tieClass}`);
  console.log(`Tracked tails: ${snapshot.bridgeTrackedTailMatrix.length}`);
  console.log(`GPU leaderboard rows: ${snapshot.bridgeGpuLeaderboard.length}`);
  if (snapshot.bridgeTheoremHooks.length > 0) {
    console.log('Theorem hooks:');
    for (const hook of snapshot.bridgeTheoremHooks) {
      console.log(`- ${hook.hook_id ?? hook.hook}: ${hook.status}`);
    }
  }
}

function printDispatch(snapshot) {
  if (!snapshot.available) {
    console.log(`Dispatch: unavailable`);
    console.log(`Error: ${snapshot.error ?? '(unknown)'}`);
    return;
  }

  console.log(`${snapshot.displayName} number-theory dispatch`);
  console.log(`Active route: ${snapshot.activeRoute ?? '(none)'}`);
  if (snapshot.remoteId) {
    console.log(`Target remote: ${snapshot.remoteId}`);
  }
  console.log(`Dispatch summary: ${snapshot.summary}`);
  console.log(`Primary action: ${snapshot.primaryAction?.actionId ?? '(none)'}`);
  console.log(`Primary mode: ${snapshot.primaryAction?.mode ?? '(none)'}`);
  if (snapshot.primaryAction?.reason) {
    console.log(`Primary reason: ${snapshot.primaryAction.reason}`);
  }
  if (snapshot.claimPass?.recommendations?.length) {
    console.log('Claim-pass recommendations:');
    for (const recommendation of snapshot.claimPass.recommendations.slice(0, 4)) {
      console.log(`- ${recommendation.recommendation_id} [${recommendation.priority}] ${recommendation.lane} | ${recommendation.reason}`);
    }
  }
  console.log('Dispatch actions:');
  for (const action of snapshot.actions) {
    const flags = [];
    if (action.primary) {
      flags.push('primary');
    }
    if (action.available) {
      flags.push('available');
    } else {
      flags.push('unavailable');
    }
    if (action.mode) {
      flags.push(action.mode);
    }
    console.log(`- ${action.actionId}${flags.length > 0 ? ` [${flags.join(', ')}]` : ''}`);
    console.log(`  title: ${action.title}`);
    console.log(`  reason: ${action.reason ?? '(none)'}`);
    console.log(`  apply: ${action.applyCommand}`);
    if (action.commandLine) {
      console.log(`  command: ${action.commandLine}`);
    }
    if (action.min && action.max) {
      console.log(`  interval: ${action.min}..${action.max}`);
    }
    if (action.chunkCount && action.chunkSize) {
      console.log(`  rollout: ${action.chunkCount} chunks x ${action.chunkSize}`);
    }
  }
}

function printBridgeRefresh(result) {
  if (!result.ok) {
    console.log(`Bridge refresh: failed`);
    console.log(`Refresh command: ${result.refreshCommand ?? '(none)'}`);
    console.log(`Engine command: ${result.engineCommand ?? '(none)'}`);
    if (result.executionMode) {
      console.log(`Execution mode: ${result.executionMode}`);
    }
    if (result.resolvedCommand) {
      console.log(`Resolved engine command: ${result.resolvedCommand}`);
    }
    if (result.executionReason) {
      console.log(`Execution mode reason: ${result.executionReason}`);
    }
    console.log(`Error: ${result.error ?? '(unknown)'}`);
    if (result.bridge) {
      printBridge(result.bridge);
    }
    return;
  }

  console.log('Bridge refresh: complete');
  console.log(`Refreshed at: ${result.refreshedAt}`);
  console.log(`Refresh command: ${result.refreshCommand ?? '(none)'}`);
  console.log(`Engine command: ${result.engineCommand ?? '(none)'}`);
  if (result.executionMode) {
    console.log(`Execution mode: ${result.executionMode}`);
  }
  if (result.resolvedCommand) {
    console.log(`Resolved engine command: ${result.resolvedCommand}`);
  }
  if (result.executionReason) {
    console.log(`Execution mode reason: ${result.executionReason}`);
  }
  if (result.commandOutput) {
    console.log(`Engine output: ${result.commandOutput}`);
  }
  printBridge(result.bridge);
}

function printDispatchResult(result) {
  if (result.detached) {
    console.log('Number-theory dispatch: detached');
    console.log(`Action: ${result.action.actionId}`);
    console.log(`Mode: ${result.action.mode ?? '(none)'}`);
    console.log(`Reason: ${result.action.reason ?? '(none)'}`);
    console.log(`Reused existing session: ${result.reusedExisting ? 'yes' : 'no'}`);
    if (result.session?.sessionId) {
      console.log(`Frontier session id: ${result.session.sessionId}`);
      console.log(`Frontier session status: ${result.session.status}`);
      console.log(`Frontier session command: erdos frontier session ${result.session.sessionId}`);
    }
    if (result.session?.reviewDueAt) {
      console.log(`Frontier review due: ${result.session.reviewDueAt}`);
      console.log(`Frontier review state: ${result.session.reviewState}`);
    }
    return;
  }

  if (result.action?.actionId === 'gpu_profile_sweep' && result.integrationGap && (result.partial || result.execution?.ok)) {
    console.log('Number-theory dispatch: partial');
    console.log(`Action: ${result.action.actionId}`);
    console.log(`Mode: ${result.action.mode ?? '(none)'}`);
    console.log(`Reason: ${result.action.reason ?? '(none)'}`);
    if (result.runBundle?.runDir) {
      console.log(`Run dir: ${result.runBundle.runDir}`);
    }
    if (result.action.commandLine) {
      console.log(`Command: ${result.action.commandLine}`);
    }
    if (result.remoteSync?.remoteLiveFrontier?.shared_prefix_failure_count !== undefined) {
      console.log(
        `Remote frontier after sync: ${result.remoteSync.remoteLiveFrontier.shared_prefix_failure_count} shared-prefix failures through ${result.remoteSync.remoteLiveFrontier.latest_direct_failure}`,
      );
    }
    if (result.execution?.stdout) {
      console.log(`Search output: ${result.execution.stdout}`);
    }
    console.log(`Integration gap: ${result.integrationGap}`);
    return;
  }

  if (!result.ok) {
    console.log('Number-theory dispatch: failed');
    if (result.action?.actionId) {
      console.log(`Action: ${result.action.actionId}`);
    }
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
    if (result.integrationGap) {
      console.log(`Integration gap: ${result.integrationGap}`);
    }
    if (result.remoteSync?.remoteLiveFrontier?.shared_prefix_failure_count !== undefined) {
      console.log(
        `Remote frontier after sync: ${result.remoteSync.remoteLiveFrontier.shared_prefix_failure_count} shared-prefix failures through ${result.remoteSync.remoteLiveFrontier.latest_direct_failure}`,
      );
    }
    if (result.dispatch) {
      printDispatch(result.dispatch);
    }
    return;
  }

  console.log('Number-theory dispatch: complete');
  console.log(`Action: ${result.action.actionId}`);
  console.log(`Mode: ${result.action.mode ?? '(none)'}`);
  console.log(`Reason: ${result.action.reason ?? '(none)'}`);
  if (result.runBundle?.runDir) {
    console.log(`Run dir: ${result.runBundle.runDir}`);
  }
  if (result.action.commandLine) {
    console.log(`Command: ${result.action.commandLine}`);
  }
  if (result.remoteSync?.remoteLiveFrontier?.shared_prefix_failure_count !== undefined) {
    console.log(
      `Remote frontier after sync: ${result.remoteSync.remoteLiveFrontier.shared_prefix_failure_count} shared-prefix failures through ${result.remoteSync.remoteLiveFrontier.latest_direct_failure}`,
    );
  }
  if (result.action.actionId === 'bridge_refresh' && result.refresh) {
    printBridgeRefresh(result.refresh);
    return;
  }
  if (result.action.actionId === 'claim_pass_refresh' && result.claimPassRefresh) {
    if (result.claimPassRefresh.markdownPath) {
      console.log(`Claim pass note: ${result.claimPassRefresh.markdownPath}`);
    }
    if (result.claimPassRefresh.jsonPath) {
      console.log(`Claim pass JSON: ${result.claimPassRefresh.jsonPath}`);
    }
    for (const recommendation of result.claimPassRefresh.claimPass?.recommendations ?? []) {
      console.log(`- ${recommendation.recommendation_id} [${recommendation.priority}] ${recommendation.lane}`);
      console.log(`  reason: ${recommendation.reason}`);
    }
    return;
  }
  if (result.action.actionId === 'formalization_refresh' && result.formalizationRefresh) {
    if (result.formalizationRefresh.markdownPath) {
      console.log(`Formalization note: ${result.formalizationRefresh.markdownPath}`);
    }
    if (result.formalizationRefresh.jsonPath) {
      console.log(`Formalization JSON: ${result.formalizationRefresh.jsonPath}`);
    }
    if (result.formalizationRefresh.formalization?.currentTarget) {
      console.log(`Formalization target: ${result.formalizationRefresh.formalization.currentTarget.title}`);
      console.log(`Formalization statement: ${result.formalizationRefresh.formalization.currentTarget.statement}`);
    }
    return;
  }
  if (result.action.actionId === 'cpu_family_search' || result.action.actionId === 'gpu_profile_sweep') {
    if (result.execution?.stdout) {
      console.log(`Search output: ${result.execution.stdout}`);
    }
    if (result.bridgeRefresh) {
      printBridgeRefresh(result.bridgeRefresh);
    }
    return;
  }
  if (result.action.actionId === 'exact_interval_scout') {
    if (result.execution?.stdout) {
      console.log(`Exact scout output: ${result.execution.stdout}`);
    }
    if (result.results?.summary) {
      console.log(`Exact scout interval: ${result.results.summary.interval}`);
      console.log(`Exact scout rows: ${result.results.summary.rows}`);
    }
    return;
  }
  if (result.action.actionId === 'structural_verifier_audit') {
    if (result.auditJsonPath) {
      console.log(`Structural verifier audit JSON: ${result.auditJsonPath}`);
    }
    if (result.auditMarkdownPath) {
      console.log(`Structural verifier audit note: ${result.auditMarkdownPath}`);
    }
    if (result.audit?.status) {
      console.log(`Structural verifier audit status: ${result.audit.status}`);
      console.log(`Structural verifier audit blockers: ${result.audit.summary?.blockerCount ?? 0}`);
      console.log(`Structural verifier audit warnings: ${result.audit.summary?.warningCount ?? 0}`);
    }
    return;
  }
  if (result.action.actionId === 'base_side_scout') {
    if (result.scoutJsonPath) {
      console.log(`Base-side scout JSON: ${result.scoutJsonPath}`);
    }
    if (result.scoutMarkdownPath) {
      console.log(`Base-side scout note: ${result.scoutMarkdownPath}`);
    }
    if (result.scout?.status) {
      console.log(`Base-side scout status: ${result.scout.status}`);
      console.log(`Base-side scout side18 exceeds side7: ${result.scout.summary?.maxSide18ExceedsSide7 ? 'yes' : 'no'}`);
      console.log(`Base-side scout max side18-minus-side7: ${result.scout.summary?.globalMaxSide18Minus7 ?? '(unknown)'}`);
    }
    return;
  }
  if (result.action.actionId === 'structural_two_side_scout') {
    if (result.structuralScoutJsonPath) {
      console.log(`Two-sided structural scout JSON: ${result.structuralScoutJsonPath}`);
    }
    if (result.structuralScoutMarkdownPath) {
      console.log(`Two-sided structural scout note: ${result.structuralScoutMarkdownPath}`);
    }
    if (result.structuralScout?.status) {
      console.log(`Two-sided structural scout status: ${result.structuralScout.status}`);
      console.log(`Two-sided structural scout range: ${result.structuralScout.summary?.assessedRange ?? '(unknown)'}`);
      console.log(`Two-sided structural scout union failures: ${result.structuralScout.summary?.unionFailureCount ?? '(unknown)'}`);
    }
    return;
  }
  if (result.action.actionId === 'mixed_base_failure_scout') {
    if (result.mixedBaseScoutJsonPath) {
      console.log(`Mixed-base failure scout JSON: ${result.mixedBaseScoutJsonPath}`);
    }
    if (result.mixedBaseScoutMarkdownPath) {
      console.log(`Mixed-base failure scout note: ${result.mixedBaseScoutMarkdownPath}`);
    }
    if (result.mixedBaseScout?.status) {
      console.log(`Mixed-base failure scout status: ${result.mixedBaseScout.status}`);
      console.log(`Mixed-base failure scout analyzed rows: ${result.mixedBaseScout.summary?.analyzedRowCount ?? '(unknown)'}`);
      console.log(`Mixed-base failure scout remaining failures: ${result.mixedBaseScout.summary?.mixedFailureCount ?? '(unknown)'}`);
    }
    return;
  }
  if (result.action.actionId === 'full_mixed_base_structural_verifier') {
    if (result.fullMixedStructuralJsonPath) {
      console.log(`Full mixed-base structural verifier JSON: ${result.fullMixedStructuralJsonPath}`);
    }
    if (result.fullMixedStructuralMarkdownPath) {
      console.log(`Full mixed-base structural verifier note: ${result.fullMixedStructuralMarkdownPath}`);
    }
    if (result.fullMixedStructuralVerifier?.status) {
      console.log(`Full mixed-base structural verifier status: ${result.fullMixedStructuralVerifier.status}`);
      console.log(`Full mixed-base structural verifier range: ${result.fullMixedStructuralVerifier.summary?.assessedRange ?? '(unknown)'}`);
      console.log(`Full mixed-base structural verifier mixed failures: ${result.fullMixedStructuralVerifier.summary?.mixedFailureCount ?? '(unknown)'}`);
      console.log(`Full mixed-base structural verifier exact outsider checks: ${result.fullMixedStructuralVerifier.summary?.threateningOutsiderCheckCount ?? '(unknown)'}`);
    }
    return;
  }
  if (result.action.actionId === 'structural_lift_miner') {
    if (result.structuralLiftMinerJsonPath) {
      console.log(`Structural lift miner JSON: ${result.structuralLiftMinerJsonPath}`);
    }
    if (result.structuralLiftMinerMarkdownPath) {
      console.log(`Structural lift miner note: ${result.structuralLiftMinerMarkdownPath}`);
    }
    if (result.structuralLiftMiner?.status) {
      console.log(`Structural lift miner status: ${result.structuralLiftMiner.status}`);
      console.log(`Structural lift miner mined rows: ${result.structuralLiftMiner.summary?.minedExactRowCount ?? '(unknown)'}`);
      console.log(`Structural lift miner primary exact primes: ${(result.structuralLiftMiner.summary?.primaryExactPrimes ?? []).join(', ') || '(unknown)'}`);
      console.log(`Structural lift miner next theorem lane: ${result.structuralLiftMiner.summary?.nextTheoremLane ?? '(unknown)'}`);
    }
    return;
  }
  if (result.action.actionId === 'matching_pattern_miner') {
    if (result.matchingPatternMinerJsonPath) {
      console.log(`Matching pattern miner JSON: ${result.matchingPatternMinerJsonPath}`);
    }
    if (result.matchingPatternMinerMarkdownPath) {
      console.log(`Matching pattern miner note: ${result.matchingPatternMinerMarkdownPath}`);
    }
    if (result.matchingPatternMiner?.status) {
      console.log(`Matching pattern miner status: ${result.matchingPatternMiner.status}`);
      console.log(`Matching pattern miner target prime: ${result.matchingPatternMiner.parameters?.targetPrime ?? '(unknown)'}`);
      console.log(`Matching pattern miner witness rows: ${result.matchingPatternMiner.summary?.witnessRowCount ?? '(unknown)'}`);
      console.log(`Matching pattern miner minimum slack: ${result.matchingPatternMiner.summary?.minMatchingSlack ?? '(unknown)'}`);
    }
    return;
  }
  if (result.action.actionId === 'exact_followup_launch') {
    if (result.handoff?.handoffDir) {
      console.log(`Exact handoff dir: ${result.handoff.handoffDir}`);
    }
    if (result.exactFollowup?.followupDir) {
      console.log(`Exact follow-up dir: ${result.exactFollowup.followupDir}`);
    }
    if (result.exactFollowup?.followupJsonPath) {
      console.log(`Exact follow-up JSON: ${result.exactFollowup.followupJsonPath}`);
    }
    if (result.exactFollowup?.followupMarkdownPath) {
      console.log(`Exact follow-up note: ${result.exactFollowup.followupMarkdownPath}`);
    }
    if (result.execution?.stdout) {
      console.log(`Exact follow-up output: ${result.execution.stdout}`);
    }
    if (result.results?.summary) {
      console.log(`Exact follow-up interval: ${result.results.summary.interval}`);
      console.log(`Exact follow-up rows: ${result.results.summary.rows}`);
    }
    return;
  }
  if (result.action.actionId === 'exact_followup_rollout') {
    const rolloutPacket = result.rollout?.packet ?? null;
    if (result.rollout?.rolloutDir) {
      console.log(`Exact rollout dir: ${result.rollout.rolloutDir}`);
    }
    if (result.rollout?.rolloutJsonPath) {
      console.log(`Exact rollout JSON: ${result.rollout.rolloutJsonPath}`);
    }
    if (result.rollout?.rolloutMarkdownPath) {
      console.log(`Exact rollout note: ${result.rollout.rolloutMarkdownPath}`);
    }
    if (rolloutPacket?.completedChunkCount !== undefined) {
      console.log(`Exact rollout completed chunks: ${rolloutPacket.completedChunkCount}/${rolloutPacket.requestedChunkCount}`);
    }
    if (rolloutPacket?.completedInterval) {
      console.log(`Exact rollout covered interval: ${rolloutPacket.completedInterval}`);
    }
    for (const childRun of rolloutPacket?.childRuns ?? []) {
      console.log(`- chunk ${childRun.index}: ${childRun.interval} [${childRun.ok ? 'ok' : 'failed'}]`);
      if (childRun.runId) {
        console.log(`  run id: ${childRun.runId}`);
      }
    }
    if (result.bridgeRefresh) {
      printBridgeRefresh(result.bridgeRefresh);
    }
    return;
  }
  if (result.action.actionId === 'exact_handoff_bundle') {
    if (result.handoff?.handoffDir) {
      console.log(`Exact handoff dir: ${result.handoff.handoffDir}`);
    }
    if (result.handoff?.handoffJsonPath) {
      console.log(`Exact handoff JSON: ${result.handoff.handoffJsonPath}`);
    }
    if (result.handoff?.handoffMarkdownPath) {
      console.log(`Exact handoff note: ${result.handoff.handoffMarkdownPath}`);
    }
    if (result.handoff?.handoff?.exactFocus?.nextUnmatchedRepresentative) {
      console.log(`Next unmatched representative: ${result.handoff.handoff.exactFocus.nextUnmatchedRepresentative}`);
    }
  }
  if (result.action.actionId === 'formalization_work_refresh' && result.formalizationWorkRefresh) {
    if (result.formalizationWorkRefresh.markdownPath) {
      console.log(`Formalization work note: ${result.formalizationWorkRefresh.markdownPath}`);
    }
    if (result.formalizationWorkRefresh.jsonPath) {
      console.log(`Formalization work JSON: ${result.formalizationWorkRefresh.jsonPath}`);
    }
    if (result.formalizationWorkRefresh.formalizationWork?.currentWork) {
      console.log(`Formalization work target: ${result.formalizationWorkRefresh.formalizationWork.currentWork.title}`);
      console.log(`Formalization work summary: ${result.formalizationWorkRefresh.formalizationWork.currentWork.summary}`);
    }
  }
}

function compactDispatchActionForJson(action) {
  if (!action) {
    return null;
  }

  const keys = [
    'available',
    'actionId',
    'kind',
    'mode',
    'source',
    'title',
    'reason',
    'commandLine',
    'applyCommand',
    'remoteProvider',
    'remoteInstanceName',
    'remoteHost',
    'laneId',
    'backendKind',
    'endpointMonotonicity',
    'latestAuditStatus',
    'latestScoutStatus',
    'latestStructuralStatus',
    'latestMixedBaseStatus',
    'latestFullMixedStructuralStatus',
    'latestStructuralLiftStatus',
    'sourceAvailable',
    'max',
    'minStructuralN',
    'maxRows',
    'rowSampleLimit',
    'topRows',
    'familyLimit',
  ];
  return Object.fromEntries(keys
    .filter((key) => action[key] !== undefined)
    .map((key) => [key, action[key]]));
}

function compactDispatchForJson(dispatch) {
  if (!dispatch) {
    return null;
  }

  return {
    available: dispatch.available,
    generatedAt: dispatch.generatedAt ?? null,
    workspaceRoot: dispatch.workspaceRoot ?? null,
    problemId: dispatch.problemId ?? null,
    displayName: dispatch.displayName ?? null,
    remoteId: dispatch.remoteId ?? null,
    activeRoute: dispatch.activeRoute ?? null,
    summary: dispatch.summary ?? null,
    error: dispatch.error ?? null,
    currentBridgeState: dispatch.currentBridgeState ?? null,
    primaryAction: compactDispatchActionForJson(dispatch.primaryAction),
    actions: Array.isArray(dispatch.actions)
      ? dispatch.actions.map(compactDispatchActionForJson)
      : [],
  };
}

function compactRefreshForJson(refresh) {
  if (!refresh) {
    return null;
  }

  return {
    ok: refresh.ok,
    problemId: refresh.problemId ?? null,
    error: refresh.error ?? null,
    jsonPath: refresh.jsonPath ?? null,
    markdownPath: refresh.markdownPath ?? null,
    svgPath: refresh.svgPath ?? null,
    sourceRefresh: refresh.sourceRefresh
      ? {
        ok: refresh.sourceRefresh.ok,
        skipped: refresh.sourceRefresh.skipped,
        command: refresh.sourceRefresh.command ?? null,
        error: refresh.sourceRefresh.stderr ?? null,
      }
      : null,
  };
}

function compactRunBundleForJson(runBundle) {
  if (!runBundle) {
    return null;
  }

  return {
    runId: runBundle.runId ?? null,
    runDir: runBundle.runDir ?? null,
    artifacts: runBundle.runRecord?.artifacts ?? null,
  };
}

function compactDispatchResultForJson(result) {
  if (!result || typeof result !== 'object') {
    return result;
  }

  return {
    ok: result.ok,
    partial: result.partial ?? undefined,
    detached: result.detached ?? undefined,
    reusedExisting: result.reusedExisting ?? undefined,
    error: result.error ?? null,
    integrationGap: result.integrationGap ?? undefined,
    dispatch: compactDispatchForJson(result.dispatch),
    action: compactDispatchActionForJson(result.action),
    refresh: result.refresh
      ? {
        ok: result.refresh.ok,
        problemId: result.refresh.problemId ?? null,
        error: result.refresh.error ?? null,
        bridgePath: result.refresh.bridgePath ?? null,
        markdownPath: result.refresh.markdownPath ?? null,
        resolvedCommand: result.refresh.resolvedCommand ?? null,
      }
      : undefined,
    claimPassRefresh: compactRefreshForJson(result.claimPassRefresh),
    formalizationRefresh: compactRefreshForJson(result.formalizationRefresh),
    formalizationWorkRefresh: compactRefreshForJson(result.formalizationWorkRefresh),
    structuralVerifierAudit: result.audit
      ? {
        status: result.audit.status ?? null,
        summary: result.audit.summary ?? null,
        jsonPath: result.auditJsonPath ?? null,
        markdownPath: result.auditMarkdownPath ?? null,
        conclusion: result.audit.conclusion ?? null,
      }
      : undefined,
    baseSideScout: result.scout
      ? {
        status: result.scout.status ?? null,
        summary: result.scout.summary ?? null,
        jsonPath: result.scoutJsonPath ?? null,
        markdownPath: result.scoutMarkdownPath ?? null,
        firstNWithSide18MaxExceedingSide7: result.scout.firstNWithSide18MaxExceedingSide7 ?? null,
      }
      : undefined,
    structuralTwoSideScout: result.structuralScout
      ? {
        status: result.structuralScout.status ?? null,
        summary: result.structuralScout.summary ?? null,
        jsonPath: result.structuralScoutJsonPath ?? null,
        markdownPath: result.structuralScoutMarkdownPath ?? null,
        firstFailures: result.structuralScout.firstFailures ?? null,
        worstRows: result.structuralScout.worstRows ?? null,
      }
      : undefined,
    mixedBaseFailureScout: result.mixedBaseScout
      ? {
        status: result.mixedBaseScout.status ?? null,
        summary: result.mixedBaseScout.summary ?? null,
        jsonPath: result.mixedBaseScoutJsonPath ?? null,
        markdownPath: result.mixedBaseScoutMarkdownPath ?? null,
        firstMixedFailure: result.mixedBaseScout.firstMixedFailure ?? null,
        worstMixedRow: result.mixedBaseScout.worstMixedRow ?? null,
      }
      : undefined,
    fullMixedBaseStructuralVerifier: result.fullMixedStructuralVerifier
      ? {
        status: result.fullMixedStructuralVerifier.status ?? null,
        summary: result.fullMixedStructuralVerifier.summary ?? null,
        jsonPath: result.fullMixedStructuralJsonPath ?? null,
        markdownPath: result.fullMixedStructuralMarkdownPath ?? null,
        firstMixedFailure: result.fullMixedStructuralVerifier.firstMixedFailure ?? null,
        worstCertifiedRow: result.fullMixedStructuralVerifier.worstCertifiedRow ?? null,
        worstExactMixedRow: result.fullMixedStructuralVerifier.worstExactMixedRow ?? null,
      }
      : undefined,
    structuralLiftMiner: result.structuralLiftMiner
      ? {
        status: result.structuralLiftMiner.status ?? null,
        summary: result.structuralLiftMiner.summary ?? null,
        jsonPath: result.structuralLiftMinerJsonPath ?? null,
        markdownPath: result.structuralLiftMinerMarkdownPath ?? null,
        sourceVerifier: result.structuralLiftMiner.sourceVerifier ?? null,
        liftObligations: result.structuralLiftMiner.liftObligations ?? null,
        recommendedNextSteps: result.structuralLiftMiner.recommendedNextSteps ?? null,
      }
      : undefined,
    matchingPatternMiner: result.matchingPatternMiner
      ? {
        status: result.matchingPatternMiner.status ?? null,
        parameters: result.matchingPatternMiner.parameters ?? null,
        summary: result.matchingPatternMiner.summary ?? null,
        patternSummary: result.matchingPatternMiner.patternSummary
          ? {
            totalWitnessMatchingPairs: result.matchingPatternMiner.patternSummary.totalWitnessMatchingPairs ?? null,
            commonMatchingPairCountAcrossWitnesses: result.matchingPatternMiner.patternSummary.commonMatchingPairCountAcrossWitnesses ?? null,
            allSplitCommonCoresMeetMaxRequiredBound: result.matchingPatternMiner.patternSummary.allSplitCommonCoresMeetMaxRequiredBound ?? null,
            allSplitCommonCoresSaturateMinSmallerSide: result.matchingPatternMiner.patternSummary.allSplitCommonCoresSaturateMinSmallerSide ?? null,
            outsiderResidueGroups: result.matchingPatternMiner.patternSummary.outsiderResidueGroups ?? [],
            splitProfiles: (result.matchingPatternMiner.patternSummary.splitProfiles ?? []).slice(0, 4).map((profile) => ({
              groupKey: profile.groupKey,
              witnessCount: profile.witnessCount,
              minMatchingSlack: profile.minMatchingSlack,
              commonMatchingPairCount: profile.commonMatchingPairCount,
              commonMatchingPairExportComplete: profile.commonMatchingPairExportComplete ?? null,
              commonMatchingPairExportedCount: Array.isArray(profile.commonMatchingPairs)
                ? profile.commonMatchingPairs.length
                : null,
              maxRequiredMatchingLowerBound: profile.maxRequiredMatchingLowerBound,
              commonCoreMeetsMaxRequiredBound: profile.commonCoreMeetsMaxRequiredBound,
            })),
            proofHeuristic: result.matchingPatternMiner.patternSummary.proofHeuristic ?? null,
          }
          : null,
        jsonPath: result.matchingPatternMinerJsonPath ?? null,
        markdownPath: result.matchingPatternMinerMarkdownPath ?? null,
        symbolicUse: result.matchingPatternMiner.symbolicUse ?? null,
        witnessSample: result.matchingPatternMiner.witnesses?.slice(0, 3).map((witness) => ({
          N: witness.N,
          p: witness.p,
          outsider: witness.outsider,
          requiredMatchingLowerBound: witness.requiredMatchingLowerBound,
          reconstructedMatchingSize: witness.reconstructedMatchingSize,
          matchingSlack: witness.matchingSlack,
          smallerSide: witness.smallerSide,
          saturatesSmallerSide: witness.saturatesSmallerSide,
          matchingPairSample: witness.matchingPairSample ?? [],
        })) ?? null,
      }
      : undefined,
    runBundle: compactRunBundleForJson(result.runBundle),
    session: result.session ?? undefined,
    remoteSync: result.remoteSync
      ? {
        ok: result.remoteSync.ok,
        error: result.remoteSync.error ?? null,
        appliedAt: result.remoteSync.appliedAt ?? null,
        remoteLiveFrontier: result.remoteSync.remoteLiveFrontier ?? null,
      }
      : undefined,
    mirroredBundle: result.mirroredBundle
      ? {
        ok: result.mirroredBundle.ok,
        error: result.mirroredBundle.error ?? null,
        manifestSummary: result.mirroredBundle.manifest?.summary ?? null,
      }
      : undefined,
    bridgeRefresh: result.bridgeRefresh
      ? {
        ok: result.bridgeRefresh.ok,
        error: result.bridgeRefresh.error ?? null,
        bridgePath: result.bridgeRefresh.bridgePath ?? null,
        markdownPath: result.bridgeRefresh.markdownPath ?? null,
      }
      : undefined,
  };
}

function printFleetDispatch(snapshot) {
  if (!snapshot.available) {
    console.log('Fleet dispatch: unavailable');
    console.log(`Error: ${snapshot.error ?? '(unknown)'}`);
    return;
  }

  console.log(`${snapshot.displayName} number-theory fleet dispatch`);
  console.log(`Fleet: ${snapshot.fleetId}`);
  console.log(`Action: ${snapshot.actionId}`);
  console.log(`Strategy: ${snapshot.strategyId ?? '(none)'}`);
  console.log(`Dispatch summary: ${snapshot.summary}`);
  console.log(`Review after hours: ${snapshot.reviewAfterHours ?? '(none)'}`);
  console.log(`Ready members: ${snapshot.availableMemberCount}/${snapshot.members.length}`);
  console.log('Members:');
  for (const member of snapshot.members) {
    const flags = [member.available ? 'available' : 'unavailable'];
    console.log(`- ${member.remoteId} [${flags.join(', ')}]`);
    console.log(`  reason: ${member.actionReason ?? member.dispatchError ?? '(none)'}`);
    if (member.assignment) {
      console.log(`  assignment: tail ${member.assignment.center}, window ${member.assignment.directThreshold}..${member.assignment.directMax}`);
    }
    console.log(`  apply: ${member.applyCommand}`);
  }
}

function printFleetDispatchResult(result) {
  if (!result.ok && !result.partial) {
    console.log('Number-theory fleet dispatch: failed');
    console.log(`Fleet: ${result.fleetId ?? result.snapshot?.fleetId ?? '(none)'}`);
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
    if (result.snapshot) {
      printFleetDispatch(result.snapshot);
    }
    return;
  }

  console.log(`Number-theory fleet dispatch: ${result.partial ? 'partial' : 'complete'}`);
  console.log(`Fleet: ${result.fleetId}`);
  console.log(`Action: ${result.actionId}`);
  console.log(`Strategy: ${result.snapshot?.strategyId ?? '(none)'}`);
  console.log(`Launched: ${result.launchedCount}`);
  console.log(`Failed: ${result.failedCount}`);
  console.log(`Skipped: ${result.skippedCount}`);
  if (result.fleetRun?.runId) {
    console.log(`Fleet run id: ${result.fleetRun.runId}`);
    console.log(`Fleet run dir: ${result.fleetRun.runDir}`);
    console.log(`Fleet run command: erdos number-theory fleet-run ${result.fleetRun.runId}`);
  }
  console.log('Member sessions:');
  for (const member of result.fleetRun?.members ?? []) {
    console.log(`- ${member.remoteId}: ${member.status}`);
    if (member.assignment) {
      console.log(`  assignment: tail ${member.assignment.center}, window ${member.assignment.directThreshold}..${member.assignment.directMax}`);
    }
    if (member.sessionId) {
      console.log(`  session: ${member.sessionId}`);
    }
  }
}

function printFleetRun(snapshot) {
  if (!snapshot) {
    console.log('Number-theory fleet run: unavailable');
    return;
  }
  console.log('Number-theory fleet run');
  console.log(`Run id: ${snapshot.runId}`);
  console.log(`Problem: ${snapshot.displayName}`);
  console.log(`Fleet: ${snapshot.fleetId}`);
  console.log(`Action: ${snapshot.actionId}`);
  console.log(`Strategy: ${snapshot.strategyId ?? '(none)'}`);
  console.log(`Run dir: ${snapshot.runDir}`);
  console.log(`Harvested bundles: ${snapshot.harvestedBundleCount}`);
  console.log('Status counts:');
  for (const [status, count] of Object.entries(snapshot.statusCounts ?? {})) {
    console.log(`- ${status}: ${count}`);
  }
  console.log('Members:');
  for (const member of snapshot.members ?? []) {
    console.log(`- ${member.remoteId}: ${member.session?.status ?? member.status}`);
    if (member.assignment) {
      console.log(`  assignment: tail ${member.assignment.center}, window ${member.assignment.directThreshold}..${member.assignment.directMax}`);
    }
    if (member.sessionId) {
      console.log(`  session: ${member.sessionId}`);
    }
    if (member.harvestedBundle?.ok) {
      console.log(`  harvested bundle: ${member.harvestedBundle.localBundleDir}`);
    }
    if (member.harvestedManifestSummary?.best_continuation !== undefined) {
      console.log(
        `  best continuation: ${member.harvestedManifestSummary.best_continuation} through ${member.harvestedManifestSummary.best_effective_clean_through}`,
      );
    }
  }
}

export function runNumberTheoryCommand(args) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos number-theory status [<id>] [--json]');
    console.log('  erdos number-theory frontier [<id>] [--json]');
    console.log('  erdos number-theory bridge [<id>] [--json]');
    console.log('  erdos number-theory bridge-refresh [<id>] [--json]');
    console.log('  erdos number-theory dispatch [<id>] [--apply] [--detach] [--review-after-hours <n>] [--remote-id <id>] [--external-source-dir <path>] [--action <id>] [--exact-min <n>] [--exact-max <n>] [--exact-chunks <n>] [--exact-chunk-size <n>] [--base-side-max <n>] [--structural-min <n>] [--structural-max <n>] [--mixed-base-max-rows <n>] [--full-mixed-row-sample-limit <n>] [--structural-lift-top-rows <n>] [--structural-lift-family-limit <n>] [--matching-pattern-prime <p>] [--matching-pattern-top-rows <n>] [--matching-pattern-pair-sample-limit <n>] [--json]');
    console.log('  erdos number-theory dispatch-fleet [<id>] --fleet <fleet-id> [--apply] [--review-after-hours <n>] [--strategy <id>] [--action <id>] [--json]');
    console.log('  erdos number-theory fleet-run <run-id> [--json]');
    console.log('  erdos number-theory routes [<id>] [--json]');
    console.log('  erdos number-theory tickets [<id>] [--json]');
    console.log('  erdos number-theory route <problem-id> <route-id> [--json]');
    console.log('  erdos number-theory ticket <problem-id> <ticket-id> [--json]');
    console.log('  erdos number-theory atom <problem-id> <atom-id> [--json]');
    return 0;
  }

  if (!['status', 'frontier', 'bridge', 'bridge-refresh', 'dispatch', 'dispatch-fleet', 'fleet-run', 'routes', 'tickets', 'route', 'ticket', 'atom'].includes(subcommand)) {
    console.error(`Unknown number-theory subcommand: ${subcommand}`);
    return 1;
  }

  const parsed = parseArgs(rest);
  if (parsed.error) {
    console.error(parsed.error);
    return 1;
  }

  if (subcommand === 'fleet-run') {
    if (!parsed.problemId) {
      console.error('Missing fleet run id.');
      return 1;
    }
    const snapshot = getNumberTheoryFleetRunSnapshot(parsed.problemId);
    if (!snapshot) {
      console.error(`Unknown number-theory fleet run: ${parsed.problemId}`);
      return 1;
    }
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printFleetRun(snapshot);
    return 0;
  }

  const { problem, error } = resolveNumberTheoryProblem(parsed.problemId);
  if (error) {
    console.error(error);
    return 1;
  }

  if (subcommand === 'route') {
    if (!parsed.entityId) {
      console.error('Missing route id.');
      return 1;
    }
    const snapshot = getNumberTheoryRouteSnapshot(problem, parsed.entityId);
    if (!snapshot) {
      console.error(`Unknown number-theory route: ${parsed.entityId}`);
      return 1;
    }
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printRouteDetail(snapshot);
    return 0;
  }

  if (subcommand === 'ticket') {
    if (!parsed.entityId) {
      console.error('Missing ticket id.');
      return 1;
    }
    const snapshot = getNumberTheoryTicketSnapshot(problem, parsed.entityId);
    if (!snapshot) {
      console.error(`Unknown number-theory ticket: ${parsed.entityId}`);
      return 1;
    }
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printTicketDetail(snapshot);
    return 0;
  }

  if (subcommand === 'atom') {
    if (!parsed.entityId) {
      console.error('Missing atom id.');
      return 1;
    }
    const snapshot = getNumberTheoryAtomSnapshot(problem, parsed.entityId);
    if (!snapshot) {
      console.error(`Unknown number-theory atom: ${parsed.entityId}`);
      return 1;
    }
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printAtomDetail(snapshot);
    return 0;
  }

  if (subcommand === 'bridge') {
    const snapshot = getNumberTheoryBridgeSnapshot(problem);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printBridge(snapshot);
    return 0;
  }

  if (subcommand === 'bridge-refresh') {
    const result = refreshNumberTheoryBridge(problem);
    if (parsed.asJson) {
      console.log(JSON.stringify(result, null, 2));
      return result.ok ? 0 : 1;
    }
    printBridgeRefresh(result);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'dispatch') {
    if (parsed.apply) {
      const result = runNumberTheoryDispatch(problem, {
        actionId: parsed.actionId,
        detach: parsed.detach,
        exactMin: parsed.exactMin,
        exactMax: parsed.exactMax,
        exactChunks: parsed.exactChunks,
        exactChunkSize: parsed.exactChunkSize,
        baseSideMax: parsed.baseSideMax,
        structuralMax: parsed.structuralMax,
        structuralMin: parsed.structuralMin,
        mixedBaseMaxRows: parsed.mixedBaseMaxRows,
        fullMixedRowSampleLimit: parsed.fullMixedRowSampleLimit,
        structuralLiftTopRows: parsed.structuralLiftTopRows,
        structuralLiftFamilyLimit: parsed.structuralLiftFamilyLimit,
        matchingPatternPrime: parsed.matchingPatternPrime,
        matchingPatternTopRows: parsed.matchingPatternTopRows,
        matchingPatternPairSampleLimit: parsed.matchingPatternPairSampleLimit,
        endpointMonotonicity: parsed.endpointMonotonicity,
        reviewAfterHours: parsed.reviewAfterHours,
        remoteId: parsed.remoteId,
        externalSourceDir: parsed.externalSourceDir,
      });
      if (parsed.asJson) {
        console.log(JSON.stringify(compactDispatchResultForJson(result), null, 2));
        return result.ok || result.partial ? 0 : 1;
      }
      printDispatchResult(result);
      return result.ok || result.partial ? 0 : 1;
    }

    const snapshot = getNumberTheoryDispatchSnapshot(problem, {
      detach: parsed.detach,
      exactMin: parsed.exactMin,
      exactMax: parsed.exactMax,
      exactChunks: parsed.exactChunks,
      exactChunkSize: parsed.exactChunkSize,
      baseSideMax: parsed.baseSideMax,
      structuralMax: parsed.structuralMax,
      structuralMin: parsed.structuralMin,
      mixedBaseMaxRows: parsed.mixedBaseMaxRows,
      fullMixedRowSampleLimit: parsed.fullMixedRowSampleLimit,
      structuralLiftTopRows: parsed.structuralLiftTopRows,
      structuralLiftFamilyLimit: parsed.structuralLiftFamilyLimit,
      matchingPatternPrime: parsed.matchingPatternPrime,
      matchingPatternTopRows: parsed.matchingPatternTopRows,
      matchingPatternPairSampleLimit: parsed.matchingPatternPairSampleLimit,
      endpointMonotonicity: parsed.endpointMonotonicity,
      reviewAfterHours: parsed.reviewAfterHours,
      remoteId: parsed.remoteId,
      externalSourceDir: parsed.externalSourceDir,
    });
    if (parsed.asJson) {
      console.log(JSON.stringify(compactDispatchForJson(snapshot), null, 2));
      return snapshot.available ? 0 : 1;
    }
    printDispatch(snapshot);
    return snapshot.available ? 0 : 1;
  }

  if (subcommand === 'dispatch-fleet') {
    if (!parsed.fleetId) {
      console.error('Missing fleet id. Use --fleet <fleet-id>.');
      return 1;
    }
    if (parsed.apply) {
      const result = runNumberTheoryFleetDispatch(problem, {
        actionId: parsed.actionId,
        reviewAfterHours: parsed.reviewAfterHours,
        fleetId: parsed.fleetId,
        strategyId: parsed.strategyId,
      });
      if (parsed.asJson) {
        console.log(JSON.stringify(result, null, 2));
        return result.ok || result.partial ? 0 : 1;
      }
      printFleetDispatchResult(result);
      return result.ok || result.partial ? 0 : 1;
    }

    const snapshot = getNumberTheoryFleetDispatchSnapshot(problem, {
      actionId: parsed.actionId,
      reviewAfterHours: parsed.reviewAfterHours,
      fleetId: parsed.fleetId,
      strategyId: parsed.strategyId,
    });
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printFleetDispatch(snapshot);
    return snapshot.available ? 0 : 1;
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
