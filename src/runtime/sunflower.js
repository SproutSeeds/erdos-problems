import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { ensureDir, writeJson, writeText } from './files.js';
import { buildBreakthroughsComputeView } from './breakthroughs.js';
import {
  getPackDir,
  getPackProblemDir,
  getWorkspaceComputeRegistryDir,
  getWorkspaceRunDir,
} from './paths.js';
import {
  getProblemClaimLoopSnapshot,
  getProblemClaimPassSnapshot,
  getProblemFormalizationSnapshot,
  getProblemFormalizationWorkSnapshot,
  getProblemTaskListSnapshot,
  getProblemTheoremLoopSnapshot,
} from './theorem-loop.js';

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

function getSunflowerFrontierNotePath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'FRONTIER_NOTE.md');
}

function getSunflowerRouteHistoryPath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'ROUTE_HISTORY.md');
}

function getSunflowerCheckpointTemplatePath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'CHECKPOINT_TEMPLATE.md');
}

function getSunflowerReportTemplatePath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'REPORT_TEMPLATE.md');
}

function getSunflowerOpsDetailsPath(problemId) {
  return path.join(getSunflowerProblemDir(problemId), 'OPS_DETAILS.yaml');
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

function parseOpsRouteEntries(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      routeId: compactText(entry.route_id ?? entry.route),
      title: compactText(entry.title),
      status: compactText(entry.status),
      theoremModule: compactText(entry.theorem_module),
      summary: compactText(entry.summary),
      whyNow: compactText(entry.why_now),
      nextMove: compactText(entry.next_move),
      ticketIds: parseStringList(entry.ticket_ids),
      sourcePaths: parseStringList(entry.source_paths),
    }));
}

function parseOpsTicketEntries(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      ticketId: compactText(entry.ticket_id),
      title: compactText(entry.title ?? entry.ticket_name),
      routeId: compactText(entry.route_id),
      routeLeaf: compactText(entry.route_leaf),
      status: compactText(entry.status),
      summary: compactText(entry.summary),
      gateStory: compactText(entry.gate_story),
      currentBlocker: compactText(entry.current_blocker),
      nextMove: compactText(entry.next_move),
      atomIds: parseStringList(entry.atom_ids),
      sourcePaths: parseStringList(entry.source_paths),
    }));
}

function parseOpsAtomEntries(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry) => entry && typeof entry === 'object')
    .map((entry) => ({
      atomId: compactText(entry.atom_id),
      title: compactText(entry.title),
      ticketId: compactText(entry.ticket_id),
      routeId: compactText(entry.route_id),
      gateId: compactText(entry.gate_id),
      tier: compactText(entry.tier),
      kind: compactText(entry.kind),
      status: compactText(entry.status),
      summary: compactText(entry.summary),
      whyNow: compactText(entry.why_now),
      nextMove: compactText(entry.next_move),
      verificationHook: parseStringList(entry.verification_hook),
      dependencies: parseStringList(entry.dependencies),
      sourcePaths: parseStringList(entry.source_paths),
    }));
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

function readSunflowerOpsDetails(problemId) {
  const opsDetailsPath = getSunflowerOpsDetailsPath(problemId);
  if (!fs.existsSync(opsDetailsPath)) {
    return null;
  }

  const parsed = parse(fs.readFileSync(opsDetailsPath, 'utf8')) ?? {};
  const routes = parseOpsRouteEntries(parsed.routes);
  const tickets = parseOpsTicketEntries(parsed.tickets);
  const atoms = parseOpsAtomEntries(parsed.atoms);

  return {
    packetId: compactText(parsed.packet_id),
    summary: compactText(parsed.summary),
    routes,
    tickets,
    atoms,
    path: opsDetailsPath,
  };
}

function findRouteDetail(opsDetails, routeId) {
  if (!opsDetails || !routeId) {
    return null;
  }
  return opsDetails.routes.find((entry) => entry.routeId === routeId) ?? null;
}

function findTicketDetail(opsDetails, ticketId) {
  if (!opsDetails || !ticketId) {
    return null;
  }
  return opsDetails.tickets.find((entry) => entry.ticketId === ticketId) ?? null;
}

function findAtomDetail(opsDetails, atomId) {
  if (!opsDetails || !atomId) {
    return null;
  }
  return opsDetails.atoms.find((entry) => entry.atomId === atomId) ?? null;
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

function compactOpsDetails(opsDetails) {
  if (!opsDetails) {
    return null;
  }

  return {
    packetId: opsDetails.packetId,
    summary: opsDetails.summary,
    path: opsDetails.path,
    routes: opsDetails.routes,
    tickets: opsDetails.tickets,
    atoms: opsDetails.atoms,
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
  const opsDetails = readSunflowerOpsDetails(problem.problemId);
  const packets = listSunflowerComputePackets(problem.problemId);
  const activePacket = chooseActivePacket(packets);
  const summary = deriveSummary(activePacket);
  const computeGovernance = buildBreakthroughsComputeView(problem, activePacket);
  const routeState = deriveRouteState(problem, context);
  const agentStartPath = getSunflowerAgentStartPath(problem.problemId);
  const checkpointPacketPath = getSunflowerCheckpointPacketPath(problem.problemId);
  const reportPacketPath = getSunflowerReportPacketPath(problem.problemId);
  const frontierNotePath = getSunflowerFrontierNotePath(problem.problemId);
  const routeHistoryPath = getSunflowerRouteHistoryPath(problem.problemId);
  const checkpointTemplatePath = getSunflowerCheckpointTemplatePath(problem.problemId);
  const reportTemplatePath = getSunflowerReportTemplatePath(problem.problemId);
  const theoremLoop = getProblemTheoremLoopSnapshot(problem);
  const claimLoop = getProblemClaimLoopSnapshot(problem);
  const claimPass = getProblemClaimPassSnapshot(problem);
  const formalization = getProblemFormalizationSnapshot(problem);
  const formalizationWork = getProblemFormalizationWorkSnapshot(problem);
  const taskList = getProblemTaskListSnapshot(problem);

  const firstReadyAtom = atomicBoard?.readyQueue?.[0] ?? null;
  const activeRouteDetail = findRouteDetail(opsDetails, routeState.activeRoute ?? atomicBoard?.activeRoute);
  const activeTicketDetail = findTicketDetail(opsDetails, atomicBoard?.activeTicket?.ticketId);
  const activeAtomDetail = findAtomDetail(opsDetails, firstReadyAtom?.atomId);

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
    frontierNotePresent: fs.existsSync(frontierNotePath),
    frontierNotePath: fs.existsSync(frontierNotePath) ? frontierNotePath : null,
    routeHistoryPresent: fs.existsSync(routeHistoryPath),
    routeHistoryPath: fs.existsSync(routeHistoryPath) ? routeHistoryPath : null,
    theoremLoop,
    claimLoop,
    claimPass,
    formalization,
    formalizationWork,
    taskList,
    checkpointTemplatePresent: fs.existsSync(checkpointTemplatePath),
    checkpointTemplatePath: fs.existsSync(checkpointTemplatePath) ? checkpointTemplatePath : null,
    reportTemplatePresent: fs.existsSync(reportTemplatePath),
    reportTemplatePath: fs.existsSync(reportTemplatePath) ? reportTemplatePath : null,
    atomicBoardPresent: Boolean(atomicBoard),
    atomicBoardPath: atomicBoard?.atomicBoardPath ?? null,
    atomicBoardMarkdownPath: atomicBoard?.atomicBoardMarkdownExists ? atomicBoard.atomicBoardMarkdownPath : null,
    atomicBoard,
    activeTicket: atomicBoard?.activeTicket ?? null,
    readyAtomCount: atomicBoard?.readyQueue?.length ?? 0,
    firstReadyAtom,
    mirageFrontierCount: atomicBoard?.mirageFrontiers?.length ?? 0,
    opsDetailsPresent: Boolean(opsDetails),
    opsDetailsPath: opsDetails?.path ?? null,
    activeRouteDetail,
    activeTicketDetail,
    activeAtomDetail,
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
    opsDetails: compactOpsDetails(opsDetails),
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

export function getSunflowerRouteSnapshot(problem, routeId) {
  const snapshot = buildSunflowerStatusSnapshot(problem);
  const boardRoute = snapshot.atomicBoardSummary?.routeStatus?.find((route) => route.route === routeId) ?? null;
  const routeDetail = findRouteDetail(snapshot.opsDetails, routeId);
  if (!boardRoute && !routeDetail) {
    return null;
  }

  return {
    problemId: problem.problemId,
    displayName: problem.displayName,
    routeId,
    activeRoute: snapshot.activeRoute,
    routeBreakthrough: snapshot.routeBreakthrough,
    boardRoute,
    routeDetail,
    activeTicket: snapshot.activeTicket,
    firstReadyAtom: snapshot.firstReadyAtom,
    snapshot,
  };
}

export function getSunflowerTicketSnapshot(problem, ticketId) {
  const snapshot = buildSunflowerStatusSnapshot(problem);
  const boardTicket = snapshot.atomicBoardSummary?.tickets?.find((ticket) => ticket.ticketId === ticketId) ?? null;
  const ticketDetail = findTicketDetail(snapshot.opsDetails, ticketId);
  if (!boardTicket && !ticketDetail) {
    return null;
  }

  return {
    problemId: problem.problemId,
    displayName: problem.displayName,
    ticketId,
    activeTicketId: snapshot.activeTicket?.ticketId ?? null,
    boardTicket,
    ticketDetail,
    firstReadyAtom: snapshot.firstReadyAtom,
    snapshot,
  };
}

export function getSunflowerAtomSnapshot(problem, atomId) {
  const snapshot = buildSunflowerStatusSnapshot(problem);
  const boardAtom = snapshot.atomicBoardSummary?.readyQueue?.find((atom) => atom.atomId === atomId) ?? null;
  const atomDetail = findAtomDetail(snapshot.opsDetails, atomId);
  if (!boardAtom && !atomDetail) {
    return null;
  }

  return {
    problemId: problem.problemId,
    displayName: problem.displayName,
    atomId,
    boardAtom,
    atomDetail,
    firstReadyAtom: snapshot.firstReadyAtom,
    snapshot,
  };
}

export function runSunflowerLocalScout(problem, workspaceRoot) {
  const snapshot = buildSunflowerStatusSnapshot(problem);
  const governance = snapshot.computeGovernance;

  if (!snapshot.activePacket || !governance) {
    throw new Error(`Problem ${problem.problemId} does not have an admitted sunflower compute packet.`);
  }

  if (governance.dispatchResult.action !== 'run_local' || governance.selectedRung.spendClass !== 'local_unmetered') {
    throw new Error(
      `Problem ${problem.problemId} is not currently admitted for a local scout run. Current action: ${governance.dispatchResult.action}.`,
    );
  }

  const runId = `${new Date().toISOString().replaceAll(':', '-')}__sunflower_p${problem.problemId}__${snapshot.activePacket.laneId}`;
  const runDir = getWorkspaceRunDir(runId, workspaceRoot);
  ensureDir(runDir);

  const runRecord = {
    runId,
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    displayName: problem.displayName,
    cluster: problem.cluster,
    laneId: snapshot.activePacket.laneId,
    packetStatus: snapshot.activePacket.status,
    dispatchAction: governance.dispatchResult.action,
    selectedRung: governance.selectedRung,
    question: governance.question,
    currentFrontier: snapshot.firstReadyAtom
      ? `${snapshot.firstReadyAtom.atomId} — ${snapshot.firstReadyAtom.title}`
      : snapshot.frontierDetail,
    artifacts: {
      statusRecordPath: path.join(runDir, 'STATUS_RECORD.json'),
      runSummaryPath: path.join(runDir, 'RUN_SUMMARY.md'),
      runLogPath: path.join(runDir, 'RUN_LOG.txt'),
      governancePath: path.join(runDir, 'GOVERNANCE.json'),
      orpPacketPath: path.join(runDir, 'ORP_COMPUTE_PACKET.json'),
    },
  };

  writeJson(path.join(runDir, 'RUN.json'), runRecord);
  writeJson(path.join(runDir, 'STATUS_RECORD.json'), snapshot);
  writeJson(path.join(runDir, 'GOVERNANCE.json'), governance);
  writeJson(path.join(runDir, 'ORP_COMPUTE_PACKET.json'), governance.orpPacket);
  writeText(
    path.join(runDir, 'RUN_LOG.txt'),
    [
      `sunflower local scout`,
      `problem=${problem.problemId}`,
      `lane=${snapshot.activePacket.laneId}`,
      `action=${governance.dispatchResult.action}`,
      `rung=${governance.selectedRung.label}`,
      `question=${governance.question}`,
      `frontier=${runRecord.currentFrontier}`,
      `when=${governance.when}`,
    ].join('\n') + '\n',
  );
  writeText(
    path.join(runDir, 'RUN_SUMMARY.md'),
    [
      `# Sunflower Local Scout Run`,
      '',
      `- Problem: ${problem.displayName}`,
      `- Lane: ${snapshot.activePacket.laneId}`,
      `- Dispatch action: ${governance.dispatchResult.action}`,
      `- Selected rung: ${governance.selectedRung.label} [${governance.selectedRung.spendClass}]`,
      `- Question: ${governance.question}`,
      `- Current frontier: ${runRecord.currentFrontier}`,
      '',
      'Why this run exists:',
      `- ${snapshot.computeSummary}`,
      `- ${governance.when}`,
      '',
      'Run outputs:',
      '- RUN.json',
      '- STATUS_RECORD.json',
      '- GOVERNANCE.json',
      '- ORP_COMPUTE_PACKET.json',
      '- RUN_LOG.txt',
      '',
      'Important boundary:',
      '- This is a governed local-scout artifact bundle. It does not upgrade problem-level claims by itself.',
      '',
    ].join('\n'),
  );

  return {
    runId,
    runDir,
    runRecord,
    snapshot,
  };
}
