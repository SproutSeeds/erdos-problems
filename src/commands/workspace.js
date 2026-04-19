import { getProblem } from '../atlas/catalog.js';
import { loadConfig } from '../runtime/config.js';
import { buildGraphTheoryStatusSnapshot } from '../runtime/graph-theory.js';
import { buildNumberTheoryStatusSnapshot } from '../runtime/number-theory.js';
import { buildResearchStackSummary } from '../runtime/research-stack.js';
import { buildSunflowerStatusSnapshot } from '../runtime/sunflower.js';
import { getProblemArtifactInventory } from '../runtime/problem-artifacts.js';
import { getOrpStatus } from '../runtime/orp.js';
import { getWorkspaceSummary } from '../runtime/workspace.js';
import { buildWorktreeHygieneReport } from '../runtime/worktree-hygiene.js';

function printWorkspaceTheoremLoop(prefix, theoremLoop, claimLoop, claimPass, formalization, formalizationWork, taskList) {
  if (!theoremLoop) {
    return;
  }
  console.log(`${prefix} theorem loop: ${theoremLoop.theoremLoopMode}`);
  console.log(`${prefix} claim surface: ${theoremLoop.currentState?.currentClaimSurface ?? '(none)'}`);
  console.log(`${prefix} theorem command: ${theoremLoop.commands?.theoremLoop ?? '(none)'}`);
  if (theoremLoop.commands?.theoremLoopRefresh) {
    console.log(`${prefix} theorem refresh: ${theoremLoop.commands.theoremLoopRefresh}`);
  }
  console.log(
    `${prefix} theorem note: ${theoremLoop.theoremLoopMarkdownPresent ? theoremLoop.theoremLoopMarkdownPath : '(not written yet)'}`,
  );
  if (claimLoop) {
    console.log(`${prefix} claim loop: ${claimLoop.claimLoopMode}`);
    console.log(`${prefix} claim command: ${claimLoop.commands?.claimLoop ?? '(none)'}`);
    if (claimLoop.commands?.claimLoopRefresh) {
      console.log(`${prefix} claim refresh: ${claimLoop.commands.claimLoopRefresh}`);
    }
    console.log(
      `${prefix} claim note: ${claimLoop.claimLoopMarkdownPresent ? claimLoop.claimLoopMarkdownPath : '(not written yet)'}`,
    );
  }
  if (claimPass) {
    console.log(`${prefix} claim pass: ${claimPass.claimPassMode}`);
    console.log(`${prefix} claim pass command: ${claimPass.commands?.claimPass ?? '(none)'}`);
    if (claimPass.commands?.claimPassRefresh) {
      console.log(`${prefix} claim pass refresh: ${claimPass.commands.claimPassRefresh}`);
    }
    console.log(
      `${prefix} claim pass note: ${claimPass.claimPassMarkdownPresent ? claimPass.claimPassMarkdownPath : '(not written yet)'}`,
    );
  }
  if (formalization) {
    console.log(`${prefix} formalization: ${formalization.formalizationMode}`);
    console.log(`${prefix} formalization command: ${formalization.commands?.formalization ?? '(none)'}`);
    if (formalization.commands?.formalizationRefresh) {
      console.log(`${prefix} formalization refresh: ${formalization.commands.formalizationRefresh}`);
    }
    console.log(
      `${prefix} formalization note: ${formalization.formalizationMarkdownPresent ? formalization.formalizationMarkdownPath : '(not written yet)'}`,
    );
  }
  if (formalizationWork) {
    console.log(`${prefix} formalization work: ${formalizationWork.formalizationWorkMode}`);
    console.log(`${prefix} formalization work command: ${formalizationWork.commands?.formalizationWork ?? '(none)'}`);
    if (formalizationWork.commands?.formalizationWorkRefresh) {
      console.log(`${prefix} formalization work refresh: ${formalizationWork.commands.formalizationWorkRefresh}`);
    }
    console.log(
      `${prefix} formalization work note: ${formalizationWork.formalizationWorkMarkdownPresent ? formalizationWork.formalizationWorkMarkdownPath : '(not written yet)'}`,
    );
  }
  if (taskList) {
    console.log(`${prefix} task list: ${taskList.taskListMode}`);
    console.log(`${prefix} task list command: ${taskList.commands?.taskList ?? '(none)'}`);
    if (taskList.commands?.taskListRefresh) {
      console.log(`${prefix} task list refresh: ${taskList.commands.taskListRefresh}`);
    }
    console.log(
      `${prefix} task list note: ${taskList.taskListMarkdownPresent ? taskList.taskListMarkdownPath : '(not written yet)'}`,
    );
  }
}

function printResearchApi(researchStack) {
  if (!researchStack?.researchApi) {
    return;
  }
  console.log(`Research API status: ${researchStack.researchApi.statusCommand}`);
  console.log(`Research API plan: ${researchStack.researchApi.planCommand}`);
  console.log(`Research API smoke: ${researchStack.researchApi.openaiSmokeCommand}`);
  console.log(`Research API live calls: ${researchStack.researchApi.liveCallsRequireExecute ? 'opt-in with --execute and --allow-paid' : 'not gated'}`);
  if (researchStack.researchApi.usageCommand) {
    console.log(`Research API usage: ${researchStack.researchApi.usageCommand}`);
  }
}

export function runWorkspaceCommand(args) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos workspace show');
    console.log('  erdos workspace hygiene [--json]');
    return 0;
  }

  if (subcommand === 'hygiene') {
    const asJson = rest.includes('--json');
    const report = buildWorktreeHygieneReport(process.cwd());
    if (asJson) {
      console.log(JSON.stringify(report, null, 2));
      return 0;
    }
    console.log(`Worktree hygiene: ${report.status}`);
    console.log(`Dirty paths: ${report.dirtyCount ?? '(unknown)'}`);
    if (report.summary) {
      console.log(`By category: ${Object.entries(report.summary.byCategory).map(([key, value]) => `${key}=${value}`).join(', ') || 'none'}`);
      console.log(`Unclassified: ${report.unclassifiedCount}`);
      console.log(`Scratch/output: ${report.scratchCount}`);
    }
    console.log(`Required action: ${report.requiredAction}`);
    for (const check of report.recommendedNextChecks ?? []) {
      console.log(`Next check: ${check}`);
    }
    return 0;
  }

  if (subcommand !== 'show') {
    console.error(`Unknown workspace subcommand: ${subcommand}`);
    return 1;
  }

  const asJson = rest.includes('--json');

  const summary = getWorkspaceSummary();
  const config = loadConfig();
  const orp = getOrpStatus(summary.workspaceRoot);
  if (asJson) {
    const payload = {
      ...summary,
      preferredAgent: config.preferredAgent,
    };
    if (summary.activeProblem) {
      const problem = getProblem(summary.activeProblem);
      if (problem?.cluster === 'sunflower') {
        payload.sunflower = buildSunflowerStatusSnapshot(problem);
        payload.researchStack = buildResearchStackSummary(problem, getProblemArtifactInventory(problem), orp, payload.sunflower);
      }
      if (problem?.cluster === 'number-theory') {
        payload.numberTheory = buildNumberTheoryStatusSnapshot(problem);
        payload.researchStack = buildResearchStackSummary(problem, getProblemArtifactInventory(problem), orp, payload.numberTheory);
      }
      if (problem?.cluster === 'graph-theory') {
        payload.graphTheory = buildGraphTheoryStatusSnapshot(problem);
        payload.researchStack = buildResearchStackSummary(problem, getProblemArtifactInventory(problem), orp, payload.graphTheory);
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
    const inventory = getProblemArtifactInventory(problem);
    if (problem?.cluster === 'sunflower') {
      const sunflower = buildSunflowerStatusSnapshot(problem);
      const researchStack = buildResearchStackSummary(problem, inventory, orp, sunflower);
      console.log(`Sunflower family role: ${sunflower.familyRole ?? '(none)'}`);
      console.log(`Sunflower harness profile: ${sunflower.harnessProfile ?? '(none)'}`);
      console.log(`Sunflower route: ${sunflower.activeRoute ?? '(none)'}`);
      console.log(`Sunflower frontier: ${sunflower.frontierDetail ?? '(none)'}`);
      console.log(`Sunflower frontier note: ${sunflower.frontierNotePath ?? '(none)'}`);
      console.log(`Sunflower route history: ${sunflower.routeHistoryPath ?? '(none)'}`);
      printWorkspaceTheoremLoop('Sunflower', sunflower.theoremLoop, sunflower.claimLoop, sunflower.claimPass, sunflower.formalization, sunflower.formalizationWork, sunflower.taskList);
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
      console.log(`Research canonical source: ${researchStack.canonicalSource.sourceUrl ?? '(none)'}`);
      console.log(`Research import snapshot: ${researchStack.canonicalSource.importSnapshotKind ?? '(missing)'}`);
      console.log(`Research ORP sync: ${researchStack.localProtocol.commands.orpSync}`);
      console.log(`Research checkpoint sync: ${researchStack.localProtocol.commands.checkpointsSync}`);
      console.log(`Research compute entry: ${researchStack.compute.entryCommand ?? '(none)'}`);
      console.log(`Research writeback: ${researchStack.writeback.packagedRefreshCommand ?? '(none)'}`);
      console.log(`Research claim refresh: ${researchStack.writeback.claimRefreshCommand ?? '(none)'}`);
      console.log(`Research claim pass refresh: ${researchStack.writeback.claimPassRefreshCommand ?? '(none)'}`);
      console.log(`Research formalization refresh: ${researchStack.writeback.formalizationRefreshCommand ?? '(none)'}`);
      console.log(`Research formalization work refresh: ${researchStack.writeback.formalizationWorkRefreshCommand ?? '(none)'}`);
      console.log(`Research task list refresh: ${researchStack.writeback.taskListRefreshCommand ?? '(none)'}`);
      printResearchApi(researchStack);
    }
    if (problem?.cluster === 'number-theory') {
      const numberTheory = buildNumberTheoryStatusSnapshot(problem);
      const researchStack = buildResearchStackSummary(problem, inventory, orp, numberTheory);
      console.log(`Number-theory family role: ${numberTheory.familyRole ?? '(none)'}`);
      console.log(`Number-theory harness profile: ${numberTheory.harnessProfile ?? '(none)'}`);
      console.log(`Number-theory route: ${numberTheory.activeRoute ?? '(none)'}`);
      console.log(`Number-theory frontier: ${numberTheory.frontierDetail ?? '(none)'}`);
      console.log(`Number-theory frontier note: ${numberTheory.frontierNotePath ?? '(none)'}`);
      console.log(`Number-theory route history: ${numberTheory.routeHistoryPath ?? '(none)'}`);
      printWorkspaceTheoremLoop('Number-theory', numberTheory.theoremLoop, numberTheory.claimLoop, numberTheory.claimPass, numberTheory.formalization, numberTheory.formalizationWork, numberTheory.taskList);
      console.log(`Number-theory archive mode: ${numberTheory.archiveMode ?? '(none)'}`);
      const frontierLoopLabel = numberTheory.frontierLoopSuggested
        ? `active (${numberTheory.frontierLoop?.mode ?? 'unknown'})`
        : 'inactive';
      console.log(`Number-theory frontier loop: ${frontierLoopLabel}`);
      if (numberTheory.frontierLoopSuggested) {
        if (numberTheory.frontierLoop?.summary) {
          console.log(`Number-theory frontier loop summary: ${numberTheory.frontierLoop.summary}`);
        }
        if (numberTheory.frontierLoop?.primaryCommand) {
          console.log(`Number-theory frontier loop entry: ${numberTheory.frontierLoop.primaryCommand}`);
        }
        if (numberTheory.frontierLoop?.mode === 'cpu' && numberTheory.frontierLoop?.upgradeCommand) {
          console.log(`Number-theory frontier loop upgrade: ${numberTheory.frontierLoop.upgradeCommand}`);
        }
      } else if (numberTheory.frontierLoop?.activationCommand) {
        console.log(`Number-theory frontier loop activation: ${numberTheory.frontierLoop.activationCommand}`);
        if (numberTheory.frontierLoop?.upgradeCommand) {
          console.log(`Number-theory frontier loop GPU path: ${numberTheory.frontierLoop.upgradeCommand}`);
        }
      }
      console.log(`Number-theory active ticket: ${numberTheory.activeTicketDetail?.ticket_id ?? '(none)'}`);
      console.log(`Number-theory ready atoms: ${numberTheory.readyAtomCount}`);
      if (numberTheory.firstReadyAtom) {
        console.log(`Number-theory first ready atom: ${numberTheory.firstReadyAtom.atom_id} — ${numberTheory.firstReadyAtom.title}`);
      }
      console.log(`Research canonical source: ${researchStack.canonicalSource.sourceUrl ?? '(none)'}`);
      console.log(`Research import snapshot: ${researchStack.canonicalSource.importSnapshotKind ?? '(missing)'}`);
      console.log(`Research ORP sync: ${researchStack.localProtocol.commands.orpSync}`);
      console.log(`Research checkpoint sync: ${researchStack.localProtocol.commands.checkpointsSync}`);
      console.log(`Research compute entry: ${researchStack.compute.entryCommand ?? '(none)'}`);
      console.log(`Research hardware doctor: ${researchStack.compute.hardwareDoctorCommand ?? '(none)'}`);
      console.log(`Research writeback: ${researchStack.writeback.packagedRefreshCommand ?? '(none)'}`);
      console.log(`Research claim refresh: ${researchStack.writeback.claimRefreshCommand ?? '(none)'}`);
      console.log(`Research claim pass refresh: ${researchStack.writeback.claimPassRefreshCommand ?? '(none)'}`);
      console.log(`Research formalization refresh: ${researchStack.writeback.formalizationRefreshCommand ?? '(none)'}`);
      console.log(`Research formalization work refresh: ${researchStack.writeback.formalizationWorkRefreshCommand ?? '(none)'}`);
      console.log(`Research task list refresh: ${researchStack.writeback.taskListRefreshCommand ?? '(none)'}`);
      if (researchStack.writeback.sourceRefreshCommand) {
        console.log(`Research source refresh: ${researchStack.writeback.sourceRefreshCommand}`);
      }
      printResearchApi(researchStack);
    }
    if (problem?.cluster === 'graph-theory') {
      const graphTheory = buildGraphTheoryStatusSnapshot(problem);
      const researchStack = buildResearchStackSummary(problem, inventory, orp, graphTheory);
      console.log(`Graph-theory family role: ${graphTheory.familyRole ?? '(none)'}`);
      console.log(`Graph-theory harness profile: ${graphTheory.harnessProfile ?? '(none)'}`);
      console.log(`Graph-theory route: ${graphTheory.activeRoute ?? '(none)'}`);
      console.log(`Graph-theory frontier: ${graphTheory.frontierDetail ?? '(none)'}`);
      console.log(`Graph-theory frontier note: ${graphTheory.frontierNotePath ?? '(none)'}`);
      console.log(`Graph-theory route history: ${graphTheory.routeHistoryPath ?? '(none)'}`);
      printWorkspaceTheoremLoop('Graph-theory', graphTheory.theoremLoop, graphTheory.claimLoop, graphTheory.claimPass, graphTheory.formalization, graphTheory.formalizationWork, graphTheory.taskList);
      console.log(`Graph-theory archive mode: ${graphTheory.archiveMode ?? '(none)'}`);
      console.log(`Graph-theory active ticket: ${graphTheory.activeTicketDetail?.ticket_id ?? '(none)'}`);
      console.log(`Graph-theory ready atoms: ${graphTheory.readyAtomCount}`);
      if (graphTheory.firstReadyAtom) {
        console.log(`Graph-theory first ready atom: ${graphTheory.firstReadyAtom.atom_id} — ${graphTheory.firstReadyAtom.title}`);
      }
      console.log(`Research canonical source: ${researchStack.canonicalSource.sourceUrl ?? '(none)'}`);
      console.log(`Research import snapshot: ${researchStack.canonicalSource.importSnapshotKind ?? '(missing)'}`);
      console.log(`Research ORP sync: ${researchStack.localProtocol.commands.orpSync}`);
      console.log(`Research checkpoint sync: ${researchStack.localProtocol.commands.checkpointsSync}`);
      console.log(`Research writeback: ${researchStack.writeback.packagedRefreshCommand ?? '(none)'}`);
      console.log(`Research claim refresh: ${researchStack.writeback.claimRefreshCommand ?? '(none)'}`);
      console.log(`Research claim pass refresh: ${researchStack.writeback.claimPassRefreshCommand ?? '(none)'}`);
      console.log(`Research formalization refresh: ${researchStack.writeback.formalizationRefreshCommand ?? '(none)'}`);
      console.log(`Research formalization work refresh: ${researchStack.writeback.formalizationWorkRefreshCommand ?? '(none)'}`);
      console.log(`Research task list refresh: ${researchStack.writeback.taskListRefreshCommand ?? '(none)'}`);
      printResearchApi(researchStack);
    }
  }
  return 0;
}
