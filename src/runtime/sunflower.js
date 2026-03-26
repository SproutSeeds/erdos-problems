import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { writeJson } from './files.js';
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
  const packets = listSunflowerComputePackets(problem.problemId);
  const activePacket = chooseActivePacket(packets);
  const summary = deriveSummary(activePacket);
  const routeState = deriveRouteState(problem, context);

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
    frontierLabel: context?.frontierLabel ?? (activePacket?.question ? 'compute_packet' : null),
    frontierDetail: context?.frontierDetail ?? activePacket?.question ?? summary.computeSummary,
    checkpointFocus: context?.checkpointFocus ?? null,
    nextHonestMove: context?.nextHonestMove ?? summary.computeNextAction,
    relatedCoreProblems: context?.relatedCoreProblems ?? [],
    literatureFocus: context?.literatureFocus ?? [],
    artifactFocus: context?.artifactFocus ?? [],
    questionLedger: context?.questionLedger ?? defaultQuestionLedger(problem.problemId, routeState),
    contextPresent: Boolean(context),
    contextPath: context?.contextPath ?? null,
    contextMarkdownPath: context?.contextMarkdownExists ? context.contextMarkdownPath : null,
    computeLanePresent: Boolean(activePacket),
    computeLaneCount: packets.length,
    computeSummary: summary.computeSummary,
    computeNextAction: summary.computeNextAction,
    budgetState: summary.budgetState,
    activePacket: compactPacket(activePacket),
    computePackets: packets.map((packet) => compactPacket(packet)),
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
