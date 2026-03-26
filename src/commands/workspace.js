import { getProblem } from '../atlas/catalog.js';
import { loadConfig } from '../runtime/config.js';
import { buildSunflowerStatusSnapshot } from '../runtime/sunflower.js';
import { getWorkspaceSummary } from '../runtime/workspace.js';

export function runWorkspaceCommand(args) {
  const [subcommand] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos workspace show');
    return 0;
  }

  if (subcommand !== 'show') {
    console.error(`Unknown workspace subcommand: ${subcommand}`);
    return 1;
  }

  const summary = getWorkspaceSummary();
  const config = loadConfig();
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
  }
  return 0;
}
