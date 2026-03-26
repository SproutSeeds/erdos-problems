import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { writeJson } from './files.js';
import { buildBreakthroughsComputeView } from './breakthroughs.js';
import { getPackDir, getPackProblemDir, getWorkspaceComputeRegistryDir } from './paths.js';

const CLAIM_LEVEL_PRIORITY = {
  Exact: 4,
  Verified: 3,
  Heuristic: 2,
  Conjecture: 1,
};

const STATUS_PRIORITY = {
  paid_active: 7,
  local_scout_running: 6,
  ready_for_paid_transfer: 5,
  ready_for_local_scout: 4,
  active: 3,
  blocked: 2,
  complete: 1,
  unknown: 0,
};

function getSunflowerComputeDir(problemId) {
  return path.join(getPackDir('sunflower'), 'compute', String(problemId));
}

function getSunflowerProblemDir(problemId) {
  return getPackProblemDir('sunflower', problemId);
}

function getSunflowerContextPath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'context.yaml');
}

function getSunflowerContextMarkdownPath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'CONTEXT.md');
}

function getSunflowerRoutePacketPath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'ROUTE_PACKET.yaml');
}

function getSunflowerAgentStartPath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'AGENT_START.md');
}

function getSunflowerCheckpointPacketPath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'CHECKPOINT_PACKET.md');
}

function getSunflowerReportPacketPath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'REPORT_PACKET.md');
}

function getSunflowerAtomicBoardPath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'ATOMIC_BOARD.yaml');
}

function getSunflowerAtomicBoardMarkdownPath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'ATOMIC_BOARD.md');
}

function parseStringList(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((entry) => String(entry ?? '').trim())
    .filter(Boolean);
}

function compactText(value) {
  const text = String(value ?? '').trim();
  return text || null;
}

function parseQuestionLedger(value) {
  if (!value || typeof value !== 'object') {
    return {
      openQuestions: [],
      activeRouteNotes: [],
      routeBreakthroughs: [],
      problemSolved: [],
    };
  }

  return {
    openQuestions: parseStringList(value.open_questions),
    activeRouteNotes: parseStringList(value.active_route_notes),
    routeBreakthroughs: parseStringList(value.route_breakthroughs),
    problemSolved: parseStringList(value.problem_solved),
  };
}

function readComputePacket(packetPath) {
  const parsed = parse(fs.readFileSync(packetPath, 'utf8')) ?? {};
  return {
    laneId: String(parsed.lane_id ?? '').trim(),
    problemId: String(parsed.problem_id ?? '').trim(),
    cluster: String(parsed.cluster ?? 'sunflower').trim(),
    question: String(parsed.question ?? '').trim(),
    claimLevelGoal: String(parsed.claim_level_goal ?? '').trim(),
    status: String(parsed.status ?? 'unknown').trim() || 'unknown',
    priceCheckedLocalDate: String(parsed.price_checked_local_date ?? '').trim(),
    recommendation: String(parsed.recommendation ?? '').trim(),
    approvalRequired: Boolean(parsed.approval_required),
    summary: String(parsed.summary ?? '').trim(),
    packetPath,
    packetFileName: path.basename(packetPath),
    sourceRepo: parsed.source_repo ?? null,
    publicFeature: parsed.public_feature ?? null,
    rungs: Array.isArray(parsed.rungs) ? parsed.rungs : [],
  };
}

export function listSunflowerComputePackets(problemId) {
  const computeDir = getSunflowerComputeDir(problemId);
  if (!fs.existsSync(computeDir)) {
    return [];
  }

  return fs
    .readdirSync(computeDir)
    .filter((entry) => entry.endsWith('.yaml') || entry.endsWith('.yml'))
    .sort()
    .map((entry) => readComputePacket(path.join(computeDir, entry)));
}

export function readSunflowerContext(problemId) {
  const contextPath = getSunflowerContextPath(problemId);
  const contextMarkdownPath = getSunflowerContextMarkdownPath(problemId);
  if (!fs.existsSync(contextPath)) {
    return null;
  }

  const parsed = parse(fs.readFileSync(contextPath, 'utf8')) ?? {};
  return {
    problemId: String(parsed.problem_id ?? problemId).trim(),
    familyRole: compactText(parsed.family_role),
    harnessProfile: compactText(parsed.harness_profile),
    defaultActiveRoute: compactText(parsed.default_active_route),
    bootstrapFocus: compactText(parsed.bootstrap_focus),
    routeStory: compactText(parsed.route_story),
    frontierLabel: compactText(parsed.frontier_label),
    frontierDetail: compactText(parsed.frontier_detail),
    checkpointFocus: compactText(parsed.checkpoint_focus),
    nextHonestMove: compactText(parsed.next_honest_move),
    relatedCoreProblems: parseStringList(parsed.related_core_problems),
    literatureFocus: parseStringList(parsed.literature_focus),
    artifactFocus: parseStringList(parsed.artifact_focus),
    questionLedger: parseQuestionLedger(parsed.question_ledger),
    contextPath,
    contextMarkdownPath,
    contextMarkdownExists: fs.existsSync(contextMarkdownPath),
  };
}

function readSunflowerRoutePacket(problemId) {
  const routePacketPath = getSunflowerRoutePacketPath(problemId);
  if (!fs.existsSync(routePacketPath)) {
    return null;
  }

  const parsed = parse(fs.readFileSync(routePacketPath, 'utf8')) ?? {};
  return {
    routePacketId: compactText(parsed.route_packet_id),
    routeId: compactText(parsed.route_id),
    frontierClaim: compactText(parsed.frontier_claim),
    theoremModule: compactText(parsed.theorem_module),
    checkpointPacket: compactText(parsed.checkpoint_packet),
    reportPacket: compactText(parsed.report_packet),
    readyPrompts: parseStringList(parsed.ready_prompts),
    verificationHook: parseStringList(parsed.verification_hook),
    routePacketPath,
  };
}

function parseBoardCountEntries(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      route: compactText(entry.route),
      tier: compactText(entry.tier),
      looseDone: Number(entry.loose_done ?? 0),
      looseTotal: Number(entry.loose_total ?? 0),
      strictDone: Number(entry.strict_done ?? 0),
      strictTotal: Number(entry.strict_total ?? 0),
      done: Number(entry.done ?? 0),
      total: Number(entry.total ?? 0),
    }));
}

function parseTicketEntries(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      ticketId: compactText(entry.ticket_id),
      ticketName: compactText(entry.ticket_name),
      routeLeaf: compactText(entry.route_leaf),
      leafStatus: compactText(entry.leaf_status),
      gatesDone: Number(entry.gates_done ?? 0),
      gatesTotal: Number(entry.gates_total ?? 0),
      atomsDone: Number(entry.atoms_done ?? 0),
      atomsTotal: Number(entry.atoms_total ?? 0),
    }));
}

function parseReadyQueue(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      atomId: compactText(entry.atom_id),
      ticketId: compactText(entry.ticket_id),
      gateId: compactText(entry.gate_id),
      tier: compactText(entry.tier),
      kind: compactText(entry.kind),
      title: compactText(entry.title),
      status: compactText(entry.status),
    }));
}

function parseMirageFrontiers(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => compactText(entry))
      .filter(Boolean);
  }
  if (value === null || value === undefined) {
    return [];
  }
  const text = compactText(value);
  return text ? [text] : [];
}

function chooseActiveTicket(board) {
  if (!board) {
    return null;
  }

  if (board.activeTicketId) {
    const explicit = board.tickets.find((ticket) => ticket.ticketId === board.activeTicketId);
    if (explicit) {
      return explicit;
    }
  }

  return board.tickets.find((ticket) => ticket.leafStatus !== 'done')
    ?? board.tickets[0]
    ?? null;
}

function readSunflowerAtomicBoard(problemId) {
  const atomicBoardPath = getSunflowerAtomicBoardPath(problemId);
  const atomicBoardMarkdownPath = getSunflowerAtomicBoardMarkdownPath(problemId);
  if (!fs.existsSync(atomicBoardPath)) {
    return null;
  }

  const parsed = parse(fs.readFileSync(atomicBoardPath, 'utf8')) ?? {};
  const board = {
    boardPacketId: compactText(parsed.board_packet_id),
    boardProfile: compactText(parsed.board_profile),
    boardTitle: compactText(parsed.board_title),
    problemId: compactText(parsed.problem_id) ?? String(problemId),
    activeRoute: compactText(parsed.active_route),
    frontierClaim: compactText(parsed.frontier_claim),
    moduleTarget: compactText(parsed.module_target),
    sourceKind: compactText(parsed.source_kind),
    sourceBoardJson: compactText(parsed.source_board_json),
    sourceBoardMarkdown: compactText(parsed.source_board_markdown),
    activeTicketId: compactText(parsed.active_ticket_id),
    routeStatus: parseBoardCountEntries(parsed.route_status),
    tickets: parseTicketEntries(parsed.tickets),
    ladder: parseBoardCountEntries(parsed.ladder),
    readyQueue: parseReadyQueue(parsed.ready_queue),
    mirageFrontiers: parseMirageFrontiers(parsed.mirage_frontiers),
    notes: parseStringList(parsed.notes),
    atomicBoardPath,
    atomicBoardMarkdownPath,
    atomicBoardMarkdownExists: fs.existsSync(atomicBoardMarkdownPath),
  };

  return {
    ...board,
    activeTicket: chooseActiveTicket(board),
  };
}

function chooseActivePacket(packets) {
  if (packets.length === 0) {
    return null;
  }

  const ranked = [...packets].sort((left, right) => {
    const statusDelta =
      (STATUS_PRIORITY[right.status] ?? STATUS_PRIORITY.unknown)
      - (STATUS_PRIORITY[left.status] ?? STATUS_PRIORITY.unknown);
    if (statusDelta !== 0) {
      return statusDelta;
    }
    const claimDelta =
      (CLAIM_LEVEL_PRIORITY[right.claimLevelGoal] ?? 0)
      - (CLAIM_LEVEL_PRIORITY[left.claimLevelGoal] ?? 0);
    if (claimDelta !== 0) {
      return claimDelta;
    }
    return right.laneId.localeCompare(left.laneId);
  });

  return ranked[0];
}

function deriveSummary(packet) {
  if (!packet) {
    return {
      computeSummary: 'No packaged compute lane is registered for this sunflower problem yet.',
      computeNextAction: 'Stay in the dossier, checkpoint, and literature lane until a frozen compute packet is honestly earned.',
      budgetState: 'not_applicable',
    };
  }

  const budgetState = packet.approvalRequired ? 'approval_required' : 'not_required';
  if (packet.summary) {
    return {
      computeSummary: packet.summary,
      computeNextAction:
        packet.status === 'ready_for_local_scout'
          ? 'Run the local scout first, then decide whether paid compute is honestly earned.'
          : packet.status === 'ready_for_paid_transfer'
            ? 'If budget approval is granted, launch the preferred paid rung and mirror the artifacts back into the workspace.'
            : packet.status === 'paid_active'
              ? 'Let the active metered run finish and pull back logs, artifacts, and impact notes before upgrading any claim.'
              : packet.status === 'complete'
                ? 'Review the completed artifact bundle and decide whether the next move is replay, certificate assembly, or a new frozen lane.'
                : 'Refresh the compute lane status before making it part of the next route decision.',
      budgetState,
    };
  }

  if (packet.status === 'ready_for_local_scout') {
    return {
      computeSummary: `${packet.laneId} is packaged and ready for its local scout.`,
      computeNextAction: 'Run the local scout first, then decide whether paid compute is honestly earned.',
      budgetState,
    };
  }

  if (packet.status === 'ready_for_paid_transfer') {
    return {
      computeSummary: `${packet.laneId} cleared the scout and is ready for the ${packet.recommendation || 'paid'} rung.`,
      computeNextAction: 'If budget approval is granted, launch the preferred paid rung and mirror the artifacts back into the workspace.',
      budgetState,
    };
  }

  if (packet.status === 'paid_active') {
    return {
      computeSummary: `${packet.laneId} is actively using metered compute.`,
      computeNextAction: 'Let the active metered run finish and pull back logs, artifacts, and impact notes before upgrading any claim.',
      budgetState,
    };
  }

  if (packet.status === 'complete') {
    return {
      computeSummary: `${packet.laneId} has a completed compute packet.`,
      computeNextAction: 'Review the completed artifact bundle and decide whether the next move is replay, certificate assembly, or a new frozen lane.',
      budgetState,
    };
  }

  return {
    computeSummary: `${packet.laneId} is packaged with status ${packet.status}.`,
    computeNextAction: 'Refresh the compute lane status before making it part of the next route decision.',
    budgetState,
  };
}

function compactPacket(packet) {
  if (!packet) {
    return null;
  }

  return {
    laneId: packet.laneId,
    status: packet.status,
    claimLevelGoal: packet.claimLevelGoal,
    question: packet.question,
    recommendation: packet.recommendation,
    approvalRequired: packet.approvalRequired,
    priceCheckedLocalDate: packet.priceCheckedLocalDate,
    packetFileName: packet.packetFileName,
    sourceRepo: packet.sourceRepo,
  };
}

function compactAtomicBoard(board) {
  if (!board) {
    return null;
  }

  return {
    boardPacketId: board.boardPacketId,
    boardProfile: board.boardProfile,
    boardTitle: board.boardTitle,
    activeRoute: board.activeRoute,
    frontierClaim: board.frontierClaim,
    moduleTarget: board.moduleTarget,
    sourceKind: board.sourceKind,
    sourceBoardJson: board.sourceBoardJson,
    sourceBoardMarkdown: board.sourceBoardMarkdown,
    atomicBoardPath: board.atomicBoardPath,
    atomicBoardMarkdownPath: board.atomicBoardMarkdownExists ? board.atomicBoardMarkdownPath : null,
    activeTicket: board.activeTicket,
    routeStatus: board.routeStatus,
    tickets: board.tickets,
    ladder: board.ladder,
    readyQueue: board.readyQueue,
    mirageFrontiers: board.mirageFrontiers,
    notes: board.notes,
  };
}

function deriveRouteState(problem, context) {
  const researchState = problem.researchState ?? {};
  const solvedBySite = String(problem.siteStatus ?? '').toLowerCase() === 'solved';

  return {
    activeRoute: researchState.active_route ?? context?.defaultActiveRoute ?? null,
    routeBreakthrough:
      typeof researchState.route_breakthrough === 'boolean'
        ? researchState.route_breakthrough
        : false,
    openProblem:
      typeof researchState.open_problem === 'boolean'
        ? researchState.open_problem
        : !solvedBySite,
    problemSolved:
      typeof researchState.problem_solved === 'boolean'
        ? researchState.problem_solved
        : solvedBySite,
  };
}

function defaultQuestionLedger(problemId, routeState) {
  return {
    openQuestions: [`What is the next honest frontier for sunflower problem ${problemId}?`],
    activeRouteNotes: routeState.activeRoute ? [`Current active route: ${routeState.activeRoute}`] : [],
    routeBreakthroughs: routeState.routeBreakthrough ? ['A route breakthrough is already recorded; checkpoint it before upgrading claims.'] : [],
    problemSolved: routeState.problemSolved ? ['This problem is marked solved; preserve archival discipline.'] : [],
  };
}

export function buildSunflowerStatusSnapshot(problem) {
  const context = readSunflowerContext(problem.problemId);
  const routePacket = readSunflowerRoutePacket(problem.problemId);
  const atomicBoard = readSunflowerAtomicBoard(problem.problemId);
  const packets = listSunflowerComputePackets(problem.problemId);
  const activePacket = chooseActivePacket(packets);
  const summary = deriveSummary(activePacket);
  const computeGovernance = buildBreakthroughsComputeView(problem, activePacket);
  const routeState = deriveRouteState(problem, context);
  const agentStartPath = getSunflowerAgentStartPath(problem.problemId);
  const checkpointPacketPath = getSunflowerCheckpointPacketPath(problem.problemId);
  const reportPacketPath = getSunflowerReportPacketPath(problem.problemId);

  const firstReadyAtom = atomicBoard?.readyQueue?.[0] ?? null;

  return {
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    displayName: problem.displayName,
    title: problem.title,
    cluster: problem.cluster,
    activeRoute: routeState.activeRoute,
    routeBreakthrough: routeState.routeBreakthrough,
    openProblem: routeState.openProblem,
    problemSolved: routeState.problemSolved,
    familyRole: context?.familyRole ?? null,
    harnessProfile: context?.harnessProfile ?? null,
    bootstrapFocus: context?.bootstrapFocus ?? null,
    routeStory: context?.routeStory ?? null,
    frontierLabel:
      context?.frontierLabel
      ?? atomicBoard?.activeRoute
      ?? (activePacket?.question ? 'compute_packet' : null),
    frontierDetail:
      context?.frontierDetail
      ?? atomicBoard?.frontierClaim
      ?? activePacket?.question
      ?? summary.computeSummary,
    checkpointFocus: context?.checkpointFocus ?? null,
    nextHonestMove:
      firstReadyAtom
        ? `${firstReadyAtom.atomId} — ${firstReadyAtom.title}`
        : context?.nextHonestMove ?? summary.computeNextAction,
    relatedCoreProblems: context?.relatedCoreProblems ?? [],
    literatureFocus: context?.literatureFocus ?? [],
    artifactFocus: context?.artifactFocus ?? [],
    questionLedger: context?.questionLedger ?? defaultQuestionLedger(problem.problemId, routeState),
    contextPresent: Boolean(context),
    contextPath: context?.contextPath ?? null,
    contextMarkdownPath: context?.contextMarkdownExists ? context.contextMarkdownPath : null,
    routePacketPresent: Boolean(routePacket),
    routePacket,
    agentStartPresent: fs.existsSync(agentStartPath),
    agentStartPath: fs.existsSync(agentStartPath) ? agentStartPath : null,
    checkpointPacketPresent: fs.existsSync(checkpointPacketPath),
    checkpointPacketPath: fs.existsSync(checkpointPacketPath) ? checkpointPacketPath : null,
    reportPacketPresent: fs.existsSync(reportPacketPath),
    reportPacketPath: fs.existsSync(reportPacketPath) ? reportPacketPath : null,
    atomicBoardPresent: Boolean(atomicBoard),
    atomicBoardPath: atomicBoard?.atomicBoardPath ?? null,
    atomicBoardMarkdownPath: atomicBoard?.atomicBoardMarkdownExists ? atomicBoard.atomicBoardMarkdownPath : null,
    atomicBoard,
    activeTicket: atomicBoard?.activeTicket ?? null,
    readyAtomCount: atomicBoard?.readyQueue?.length ?? 0,
    firstReadyAtom,
    mirageFrontierCount: atomicBoard?.mirageFrontiers?.length ?? 0,
    computeLanePresent: Boolean(activePacket),
    computeLaneCount: packets.length,
    computeSummary: summary.computeSummary,
    computeNextAction: summary.computeNextAction,
    budgetState: summary.budgetState,
    computeReason: activePacket?.question ?? null,
    computeWhen: computeGovernance?.when ?? 'No compute packet is currently admitted.',
    computeGovernance,
    activePacket: compactPacket(activePacket),
    computePackets: packets.map((packet) => compactPacket(packet)),
    atomicBoardSummary: compactAtomicBoard(atomicBoard),
  };
}

export function writeSunflowerStatusRecord(problem, snapshot, workspaceRoot) {
  const registryDir = getWorkspaceComputeRegistryDir(workspaceRoot);
  const timestamp = new Date().toISOString().replaceAll(':', '-');
  const timestampedPath = path.join(registryDir, `${timestamp}__p${problem.problemId}.json`);
  const latestPath = path.join(registryDir, `latest__p${problem.problemId}.json`);
  writeJson(timestampedPath, snapshot);
  writeJson(latestPath, snapshot);
  return {
    registryDir,
    timestampedPath,
    latestPath,
  };
}
