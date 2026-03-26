import { getProblem } from '../atlas/catalog.js';
import { loadConfig } from '../runtime/config.js';
import { buildGraphTheoryStatusSnapshot } from '../runtime/graph-theory.js';
import { buildNumberTheoryStatusSnapshot } from '../runtime/number-theory.js';
import { buildSunflowerStatusSnapshot } from '../runtime/sunflower.js';
import { getWorkspaceSummary } from '../runtime/workspace.js';

export function runWorkspaceCommand(args) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos workspace show');
    return 0;
  }

  if (subcommand !== 'show') {
    console.error(`Unknown workspace subcommand: ${subcommand}`);
    return 1;
  }

  const asJson = rest.includes('--json');

  const summary = getWorkspaceSummary();
  const config = loadConfig();
  if (asJson) {
    const payload = {
      ...summary,
      preferredAgent: config.preferredAgent,
    };
    if (summary.activeProblem) {
      const problem = getProblem(summary.activeProblem);
      if (problem?.cluster === 'sunflower') {
        payload.sunflower = buildSunflowerStatusSnapshot(problem);
      }
      if (problem?.cluster === 'number-theory') {
        payload.numberTheory = buildNumberTheoryStatusSnapshot(problem);
      }
      if (problem?.cluster === 'graph-theory') {
        payload.graphTheory = buildGraphTheoryStatusSnapshot(problem);
      }
    }
    console.log(JSON.stringify(payload, null, 2));
    return 0;
  }
  console.log(`Workspace root: ${summary.workspaceRoot}`);
  console.log(`State dir: ${summary.stateDir}`);
  console.log(`Initialized: ${summary.hasState ? 'yes' : 'no'}`);
  console.log(`Active problem: ${summary.activeProblem ?? '(none)'}`);
  console.log(`Config path: ${summary.configPath}`);
  console.log(`State file: ${summary.statePath}`);
  console.log(`State markdown: ${summary.stateMarkdownPath}`);
  console.log(`Question ledger: ${summary.questionLedgerPath}`);
  console.log(`Checkpoint shelf: ${summary.checkpointIndexPath}`);
  console.log(`Workspace ORP dir: ${summary.orpDir}`);
  console.log(`Workspace ORP protocol: ${summary.orpProtocolPath}`);
  console.log(`Workspace ORP integration: ${summary.orpIntegrationPath}`);
  console.log(`Workspace ORP templates: ${summary.orpTemplatesDir}`);
  console.log(`Workspace upstream dir: ${summary.upstreamDir}`);
  console.log(`Workspace seeded-problems dir: ${summary.seededProblemsDir}`);
  console.log(`Workspace scaffold dir: ${summary.scaffoldDir}`);
  console.log(`Workspace pull dir: ${summary.pullDir}`);
  console.log(`Workspace artifact dir: ${summary.artifactDir}`);
  console.log(`Workspace literature dir: ${summary.literatureDir}`);
  console.log(`Workspace runs dir: ${summary.runsDir}`);
  console.log(`Workspace archives dir: ${summary.archivesDir}`);
  console.log(`Active seeded dossier dir: ${summary.seededProblemDir}`);
  console.log(`Preferred agent: ${config.preferredAgent}`);
  console.log(`Continuation mode: ${summary.continuationMode ?? config.continuation}`);
  console.log(`Active route: ${summary.activeRoute ?? '(none)'}`);
  console.log(`Route breakthrough: ${summary.routeBreakthrough ? 'yes' : 'no'}`);
  console.log(`Problem solved: ${summary.problemSolved ? 'yes' : 'no'}`);
  console.log(`Checkpoint synced at: ${summary.lastCheckpointSyncAt ?? '(never)'}`);
  console.log(`Next honest move: ${summary.nextHonestMove ?? '(none)'}`);
  if (summary.currentFrontier) {
    console.log(`Current frontier: ${summary.currentFrontier.kind} / ${summary.currentFrontier.detail}`);
  }
  console.log(`Updated at: ${summary.updatedAt ?? '(none)'}`);
  if (summary.activeProblem) {
    const problem = getProblem(summary.activeProblem);
    if (problem?.cluster === 'sunflower') {
      const sunflower = buildSunflowerStatusSnapshot(problem);
      console.log(`Sunflower family role: ${sunflower.familyRole ?? '(none)'}`);
      console.log(`Sunflower harness profile: ${sunflower.harnessProfile ?? '(none)'}`);
      console.log(`Sunflower route: ${sunflower.activeRoute ?? '(none)'}`);
      console.log(`Sunflower frontier: ${sunflower.frontierDetail ?? '(none)'}`);
      console.log(`Sunflower frontier note: ${sunflower.frontierNotePath ?? '(none)'}`);
      console.log(`Sunflower route history: ${sunflower.routeHistoryPath ?? '(none)'}`);
      console.log(`Sunflower board: ${sunflower.atomicBoardPresent ? 'yes' : 'no'}`);
      if (sunflower.atomicBoardSummary) {
        console.log(`Sunflower board title: ${sunflower.atomicBoardSummary.boardTitle ?? '(none)'}`);
        console.log(`Sunflower board ready atoms: ${sunflower.readyAtomCount}`);
        if (sunflower.firstReadyAtom) {
          console.log(`Sunflower first ready atom: ${sunflower.firstReadyAtom.atomId} — ${sunflower.firstReadyAtom.title}`);
        }
      }
      console.log(`Sunflower compute: ${sunflower.computeLanePresent ? 'yes' : 'no'}`);
      if (sunflower.activePacket) {
        console.log(`Sunflower compute lane: ${sunflower.activePacket.laneId} [${sunflower.activePacket.status}]`);
      }
      console.log(`Sunflower compute next: ${sunflower.computeNextAction}`);
    }
    if (problem?.cluster === 'number-theory') {
      const numberTheory = buildNumberTheoryStatusSnapshot(problem);
      console.log(`Number-theory family role: ${numberTheory.familyRole ?? '(none)'}`);
      console.log(`Number-theory harness profile: ${numberTheory.harnessProfile ?? '(none)'}`);
      console.log(`Number-theory route: ${numberTheory.activeRoute ?? '(none)'}`);
      console.log(`Number-theory frontier: ${numberTheory.frontierDetail ?? '(none)'}`);
      console.log(`Number-theory frontier note: ${numberTheory.frontierNotePath ?? '(none)'}`);
      console.log(`Number-theory route history: ${numberTheory.routeHistoryPath ?? '(none)'}`);
      console.log(`Number-theory archive mode: ${numberTheory.archiveMode ?? '(none)'}`);
      console.log(`Number-theory active ticket: ${numberTheory.activeTicketDetail?.ticket_id ?? '(none)'}`);
      console.log(`Number-theory ready atoms: ${numberTheory.readyAtomCount}`);
      if (numberTheory.firstReadyAtom) {
        console.log(`Number-theory first ready atom: ${numberTheory.firstReadyAtom.atom_id} — ${numberTheory.firstReadyAtom.title}`);
      }
    }
    if (problem?.cluster === 'graph-theory') {
      const graphTheory = buildGraphTheoryStatusSnapshot(problem);
      console.log(`Graph-theory family role: ${graphTheory.familyRole ?? '(none)'}`);
      console.log(`Graph-theory harness profile: ${graphTheory.harnessProfile ?? '(none)'}`);
      console.log(`Graph-theory route: ${graphTheory.activeRoute ?? '(none)'}`);
      console.log(`Graph-theory frontier: ${graphTheory.frontierDetail ?? '(none)'}`);
      console.log(`Graph-theory frontier note: ${graphTheory.frontierNotePath ?? '(none)'}`);
      console.log(`Graph-theory route history: ${graphTheory.routeHistoryPath ?? '(none)'}`);
      console.log(`Graph-theory archive mode: ${graphTheory.archiveMode ?? '(none)'}`);
      console.log(`Graph-theory active ticket: ${graphTheory.activeTicketDetail?.ticket_id ?? '(none)'}`);
      console.log(`Graph-theory ready atoms: ${graphTheory.readyAtomCount}`);
      if (graphTheory.firstReadyAtom) {
        console.log(`Graph-theory first ready atom: ${graphTheory.firstReadyAtom.atom_id} — ${graphTheory.firstReadyAtom.title}`);
      }
    }
  }
  return 0;
}
