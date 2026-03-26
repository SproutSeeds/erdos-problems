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
  return path.join(getPackProblemDir('number-theory', problemId), fileName);
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

function findActiveRouteDetail(opsDetails, activeRoute) {
  if (!opsDetails || !Array.isArray(opsDetails.routes)) {
    return null;
  }
  return opsDetails.routes.find((route) => route.route_id === activeRoute) ?? opsDetails.routes[0] ?? null;
}

function findActiveTicketDetail(opsDetails, activeRoute) {
  if (!opsDetails || !Array.isArray(opsDetails.tickets)) {
    return null;
  }
  return (
    opsDetails.tickets.find((ticket) => ticket.status === 'active' && (!activeRoute || ticket.route_id === activeRoute))
    ?? opsDetails.tickets.find((ticket) => !activeRoute || ticket.route_id === activeRoute)
    ?? opsDetails.tickets[0]
    ?? null
  );
}

function findFirstReadyAtom(opsDetails, activeRoute) {
  if (!opsDetails || !Array.isArray(opsDetails.atoms)) {
    return null;
  }
  return (
    opsDetails.atoms.find((atom) => atom.status === 'ready' && (!activeRoute || atom.route_id === activeRoute))
    ?? opsDetails.atoms.find((atom) => atom.status === 'ready')
    ?? null
  );
}

function resolveArchiveMode(problem) {
  const siteStatus = String(problem.siteStatus ?? '').toLowerCase();
  if (siteStatus === 'solved') {
    return 'method_exemplar';
  }
  if (siteStatus === 'disproved') {
    return 'counterexample_archive';
  }
  return null;
}

export function buildNumberTheoryStatusSnapshot(problem) {
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
  const routeBreakthrough = typeof problem.researchState?.route_breakthrough === 'boolean'
    ? problem.researchState.route_breakthrough
    : false;
  const archiveMode = resolveArchiveMode(problem);
  const problemSolved = typeof problem.researchState?.problem_solved === 'boolean'
    ? problem.researchState.problem_solved
    : String(problem.siteStatus ?? '').toLowerCase() === 'solved';
  const openProblem = typeof problem.researchState?.open_problem === 'boolean'
    ? problem.researchState.open_problem
    : String(problem.siteStatus ?? '').toLowerCase() === 'open';

  const activeRouteDetail = findActiveRouteDetail(opsDetails, activeRoute);
  const activeTicketDetail = findActiveTicketDetail(opsDetails, activeRoute);
  const firstReadyAtom = findFirstReadyAtom(opsDetails, activeRoute);
  const readyAtoms = Array.isArray(opsDetails?.atoms)
    ? opsDetails.atoms.filter((atom) => atom.status === 'ready')
    : [];

  return {
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    displayName: problem.displayName,
    title: problem.title,
    cluster: problem.cluster,
    familyRole: context.family_role ?? 'number_theory_pack',
    harnessProfile: context.harness_profile ?? 'starter_cockpit',
    activeRoute,
    routeBreakthrough,
    problemSolved,
    openProblem,
    siteStatus: problem.siteStatus,
    archiveMode,
    bootstrapFocus: context.bootstrap_focus ?? null,
    routeStory: context.route_story ?? routePacket?.frontier_claim ?? problem.shortStatement,
    frontierLabel: context.frontier_label ?? activeRoute ?? 'number_theory_frontier',
    frontierDetail: firstReadyAtom?.summary ?? context.frontier_detail ?? activeRouteDetail?.summary ?? problem.shortStatement,
    checkpointFocus: context.checkpoint_focus ?? activeRouteDetail?.why_now ?? null,
    nextHonestMove:
      firstReadyAtom?.next_move
      ?? activeTicketDetail?.next_move
      ?? context.next_honest_move
      ?? 'Pull the dossier, freeze the route note, and preserve public-status honesty.',
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
