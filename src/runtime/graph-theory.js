import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { getPackProblemDir } from './paths.js';

function readYamlIfPresent(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return parse(fs.readFileSync(filePath, 'utf8'));
}

function getPackFile(problemId, fileName) {
  return path.join(getPackProblemDir('graph-theory', problemId), fileName);
}

function normalizeQuestionLedger(rawLedger) {
  return {
    openQuestions: rawLedger?.open_questions ?? [],
    activeRouteNotes: rawLedger?.active_route_notes ?? [],
    routeBreakthroughs: rawLedger?.route_breakthroughs ?? [],
    problemSolved: rawLedger?.problem_solved ?? [],
  };
}

function parseOpsDetails(problemId) {
  const opsDetailsPath = getPackFile(problemId, 'OPS_DETAILS.yaml');
  const payload = readYamlIfPresent(opsDetailsPath);
  if (!payload) {
    return null;
  }
  return {
    packetId: payload.packet_id ?? null,
    summary: payload.summary ?? null,
    path: opsDetailsPath,
    routes: payload.routes ?? [],
    tickets: payload.tickets ?? [],
    atoms: payload.atoms ?? [],
  };
}

function findRouteDetail(opsDetails, routeId) {
  if (!opsDetails || !Array.isArray(opsDetails.routes)) {
    return null;
  }
  return opsDetails.routes.find((route) => route.route_id === routeId) ?? null;
}

function firstMatching(items, predicate) {
  if (!Array.isArray(items)) {
    return null;
  }
  return items.find(predicate) ?? items[0] ?? null;
}

function resolveArchiveMode(problem) {
  const siteStatus = String(problem.siteStatus ?? '').toLowerCase();
  if (siteStatus === 'solved') {
    return 'method_exemplar';
  }
  if (siteStatus === 'proved' || siteStatus === 'proved (lean)') {
    return 'proof_archive';
  }
  if (siteStatus === 'decidable') {
    return 'decision_archive';
  }
  return null;
}

function solvedLikeSiteStatus(problem) {
  const siteStatus = String(problem.siteStatus ?? '').toLowerCase();
  return siteStatus === 'solved' || siteStatus === 'proved' || siteStatus === 'proved (lean)';
}

export function buildGraphTheoryStatusSnapshot(problem) {
  const contextPath = getPackFile(problem.problemId, 'context.yaml');
  const contextMarkdownPath = getPackFile(problem.problemId, 'CONTEXT.md');
  const routePacketPath = getPackFile(problem.problemId, 'ROUTE_PACKET.yaml');
  const frontierNotePath = getPackFile(problem.problemId, 'FRONTIER_NOTE.md');
  const routeHistoryPath = getPackFile(problem.problemId, 'ROUTE_HISTORY.md');
  const checkpointTemplatePath = getPackFile(problem.problemId, 'CHECKPOINT_TEMPLATE.md');
  const reportTemplatePath = getPackFile(problem.problemId, 'REPORT_TEMPLATE.md');

  const context = readYamlIfPresent(contextPath) ?? {};
  const routePacket = readYamlIfPresent(routePacketPath);
  const opsDetails = parseOpsDetails(problem.problemId);

  const activeRoute =
    problem.researchState?.active_route
    ?? context.default_active_route
    ?? routePacket?.route_id
    ?? null;
  const archiveMode = resolveArchiveMode(problem);
  const problemSolved = typeof problem.researchState?.problem_solved === 'boolean'
    ? problem.researchState.problem_solved
    : solvedLikeSiteStatus(problem);
  const openProblem = typeof problem.researchState?.open_problem === 'boolean'
    ? problem.researchState.open_problem
    : String(problem.siteStatus ?? '').toLowerCase() === 'open';
  const routeBreakthrough = typeof problem.researchState?.route_breakthrough === 'boolean'
    ? problem.researchState.route_breakthrough
    : problemSolved;

  const activeRouteDetail = findRouteDetail(opsDetails, activeRoute) ?? firstMatching(opsDetails?.routes, () => true);
  const activeTicketDetail = firstMatching(
    opsDetails?.tickets,
    (ticket) => ticket.status === 'active' && (!activeRoute || ticket.route_id === activeRoute),
  );
  const firstReadyAtom = firstMatching(
    opsDetails?.atoms,
    (atom) => atom.status === 'ready' && (!activeRoute || atom.route_id === activeRoute),
  );
  const readyAtoms = Array.isArray(opsDetails?.atoms)
    ? opsDetails.atoms.filter((atom) => atom.status === 'ready')
    : [];

  return {
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    displayName: problem.displayName,
    title: problem.title,
    cluster: problem.cluster,
    familyRole: context.family_role ?? 'graph_theory_pack',
    harnessProfile: context.harness_profile ?? 'starter_workspace',
    activeRoute,
    routeBreakthrough,
    problemSolved,
    openProblem,
    siteStatus: problem.siteStatus,
    archiveMode,
    bootstrapFocus: context.bootstrap_focus ?? null,
    routeStory: context.route_story ?? routePacket?.frontier_claim ?? problem.shortStatement,
    frontierLabel: context.frontier_label ?? activeRoute ?? 'graph_theory_frontier',
    frontierDetail: firstReadyAtom?.summary ?? context.frontier_detail ?? activeRouteDetail?.summary ?? problem.shortStatement,
    checkpointFocus: context.checkpoint_focus ?? activeRouteDetail?.why_now ?? null,
    nextHonestMove:
      firstReadyAtom?.next_move
      ?? activeTicketDetail?.next_move
      ?? context.next_honest_move
      ?? 'Freeze the current graph-theory packet without widening status claims.',
    relatedCoreProblems: context.related_core_problems ?? [],
    literatureFocus: context.literature_focus ?? [],
    artifactFocus: context.artifact_focus ?? [],
    questionLedger: normalizeQuestionLedger(context.question_ledger),
    contextPresent: fs.existsSync(contextPath),
    contextPath,
    contextMarkdownPath,
    routePacketPresent: Boolean(routePacket),
    routePacket,
    routePacketPath,
    frontierNotePresent: fs.existsSync(frontierNotePath),
    frontierNotePath,
    routeHistoryPresent: fs.existsSync(routeHistoryPath),
    routeHistoryPath,
    checkpointTemplatePresent: fs.existsSync(checkpointTemplatePath),
    checkpointTemplatePath,
    reportTemplatePresent: fs.existsSync(reportTemplatePath),
    reportTemplatePath,
    opsDetailsPresent: Boolean(opsDetails),
    opsDetailsPath: opsDetails?.path ?? getPackFile(problem.problemId, 'OPS_DETAILS.yaml'),
    opsDetails,
    activeRouteDetail,
    activeTicketDetail,
    firstReadyAtom,
    readyAtomCount: readyAtoms.length,
  };
}
