import { getProblem, listProblems } from '../atlas/catalog.js';
import { syncOrpWorkspaceKit } from '../runtime/orp.js';
import { syncCheckpoints } from '../runtime/checkpoints.js';
import { getProblemArtifactInventory } from '../runtime/problem-artifacts.js';
import { syncState } from '../runtime/state.js';
import {
  getProblemClaimPassSnapshot,
  getProblemClaimLoopSnapshot,
  getProblemFormalizationSnapshot,
  getProblemFormalizationWorkSnapshot,
  getProblemTaskListSnapshot,
  getProblemTheoremLoopSnapshot,
  checkProblemFormalizationWork,
  runProblemTaskListLoop,
  refreshProblemFormalization,
  refreshProblemFormalizationWork,
  refreshProblemClaimPass,
  refreshProblemClaimLoop,
  refreshProblemTaskList,
  refreshProblemTheoremLoop,
} from '../runtime/theorem-loop.js';
import { readCurrentProblem, setCurrentProblem } from '../runtime/workspace.js';

function parseListFilters(args) {
  const filters = {};
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--cluster') {
      const cluster = args[index + 1];
      if (!cluster) {
        return { error: 'Missing cluster name after --cluster.' };
      }
      filters.cluster = cluster;
      index += 1;
      continue;
    }
    if (token === '--repo-status') {
      const repoStatus = args[index + 1];
      if (!repoStatus) {
        return { error: 'Missing repo status after --repo-status.' };
      }
      filters.repoStatus = repoStatus;
      index += 1;
      continue;
    }
    if (token === '--harness-depth') {
      const harnessDepth = args[index + 1];
      if (!harnessDepth) {
        return { error: 'Missing harness depth after --harness-depth.' };
      }
      filters.harnessDepth = harnessDepth;
      index += 1;
      continue;
    }
    if (token === '--site-status') {
      const siteStatus = args[index + 1];
      if (!siteStatus) {
        return { error: 'Missing site status after --site-status.' };
      }
      filters.siteStatus = siteStatus;
      index += 1;
      continue;
    }
    return { error: `Unknown list option: ${token}` };
  }
  return { filters };
}

function parseArtifactArgs(args) {
  const parsed = {
    problemId: null,
    asJson: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (!parsed.problemId) {
      parsed.problemId = token;
      continue;
    }
    return { error: `Unknown artifact option: ${token}` };
  }

  return parsed;
}

function parseTaskListRunArgs(args) {
  const parsed = {
    problemId: null,
    passes: 1,
    asJson: false,
    stopOnConvergence: true,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (token === '--passes') {
      const value = args[index + 1];
      if (!value) {
        return { error: 'Missing pass count after --passes.' };
      }
      const passes = Number.parseInt(value, 10);
      if (!Number.isFinite(passes) || passes <= 0) {
        return { error: `Invalid pass count: ${value}` };
      }
      parsed.passes = passes;
      index += 1;
      continue;
    }
    if (token === '--no-stop-on-convergence') {
      parsed.stopOnConvergence = false;
      continue;
    }
    if (!parsed.problemId) {
      parsed.problemId = token;
      continue;
    }
    return { error: `Unknown task-list-run option: ${token}` };
  }

  return parsed;
}

function printProblemTable(rows, activeProblem) {
  console.log('ID   Site   Repo       Cluster         Depth    Active  Title');
  for (const row of rows) {
    const id = row.problemId.padEnd(4, ' ');
    const site = row.siteStatus.padEnd(6, ' ');
    const repo = row.repoStatus.padEnd(10, ' ');
    const cluster = row.cluster.padEnd(15, ' ');
    const depth = row.harnessDepth.padEnd(8, ' ');
    const active = (row.problemId === activeProblem ? '*' : '-').padEnd(7, ' ');
    console.log(`${id} ${site} ${repo} ${cluster} ${depth} ${active} ${row.title}`);
  }
}

function printProblem(problem) {
  console.log(problem.displayName);
  console.log(`Title: ${problem.title}`);
  console.log(`Source: ${problem.sourceUrl}`);
  console.log(`Site status: ${problem.siteStatus}`);
  console.log(`Site badge: ${problem.siteBadge ?? problem.siteStatus}`);
  console.log(`Repo status: ${problem.repoStatus}`);
  console.log(`Cluster: ${problem.cluster}`);
  console.log(`Harness depth: ${problem.harnessDepth}`);
  if (String(problem.siteStatus).toLowerCase() === 'solved') {
    console.log('Archive mode: method_exemplar');
  }
  console.log(`Prize: ${problem.prize ?? '(none)'}`);
  console.log(`Formalization: ${problem.formalizationStatus}`);
  console.log(`Imported formalized: ${problem.importedFormalizedState ?? '(unknown)'}`);
  console.log(`Imported last update: ${problem.importedLastUpdate ?? '(unknown)'}`);
  console.log(`Related: ${problem.relatedProblems.join(', ') || '(none)'}`);
  console.log(`Tags: ${problem.familyTags.join(', ') || '(none)'}`);
  console.log(`Statement: ${problem.shortStatement}`);
  if (problem.researchState) {
    console.log('Research state:');
    console.log(`  open problem: ${problem.researchState.open_problem ? 'yes' : 'no'}`);
    console.log(`  active route: ${problem.researchState.active_route}`);
    console.log(`  route breakthrough: ${problem.researchState.route_breakthrough ? 'yes' : 'no'}`);
    console.log(`  problem solved: ${problem.researchState.problem_solved ? 'yes' : 'no'}`);
  }
  if (problem.externalSource) {
    console.log('External import provenance:');
    console.log(`  repo: ${problem.externalSource.repo}`);
    console.log(`  data file: ${problem.externalSource.data_file}`);
    console.log(`  number: ${problem.externalSource.number}`);
  }
}

function printArtifactInventory(problem, inventory, asJson) {
  if (asJson) {
    console.log(JSON.stringify(inventory, null, 2));
    return;
  }

  console.log(`${problem.displayName} canonical artifacts`);
  console.log(`Problem directory: ${inventory.problemDir}`);
  console.log(`Source: ${inventory.sourceUrl}`);
  console.log('Canonical files:');
  for (const artifact of inventory.canonicalArtifacts) {
    console.log(`- ${artifact.label}: ${artifact.exists ? 'present' : 'missing'} (${artifact.path})`);
  }
  if (inventory.starterArtifacts.length > 0) {
    console.log('Starter loop artifacts:');
    for (const artifact of inventory.starterArtifacts) {
      console.log(`- ${artifact.label}: ${artifact.exists ? 'present' : 'missing'} (${artifact.path})`);
    }
  }
  if (inventory.packContext) {
    console.log(`- ${inventory.packContext.label}: ${inventory.packContext.exists ? 'present' : 'missing'} (${inventory.packContext.path})`);
  }
  if (inventory.packProblemArtifacts.length > 0) {
    console.log('Pack problem artifacts:');
    for (const artifact of inventory.packProblemArtifacts) {
      console.log(`- ${artifact.label}: ${artifact.exists ? 'present' : 'missing'} (${artifact.path})`);
    }
  }
  if (inventory.computePackets.length > 0) {
    console.log('Compute packets:');
    for (const packet of inventory.computePackets) {
      console.log(`- ${packet.label}: ${packet.exists ? 'present' : 'missing'} (${packet.path}) [${packet.status}]`);
    }
  }
  if (inventory.upstreamSnapshot) {
    console.log('External import snapshot:');
    console.log(`- kind: ${inventory.upstreamSnapshot.kind}`);
    console.log(`- manifest: ${inventory.upstreamSnapshot.manifestPath}`);
    console.log(`- index: ${inventory.upstreamSnapshot.indexPath}`);
    console.log(`- commit: ${inventory.upstreamSnapshot.upstreamCommit ?? '(unknown)'}`);
  }
  console.log(`Imported record available: ${inventory.upstreamRecordIncluded ? 'yes' : 'no'}`);
}

function printTheoremLoop(snapshot, asJson) {
  if (asJson) {
    console.log(JSON.stringify(snapshot, null, 2));
    return;
  }

  console.log(`${snapshot.displayName} theorem loop`);
  console.log(`Theorem loop mode: ${snapshot.theoremLoopMode}`);
  console.log(`Source kind: ${snapshot.sourceKind}`);
  console.log(`Active route: ${snapshot.activeRoute ?? '(none)'}`);
  console.log(`Current claim surface: ${snapshot.currentState.currentClaimSurface}`);
  console.log(`Route summary: ${snapshot.currentState.routeSummary}`);
  console.log(`Next honest move: ${snapshot.currentState.nextHonestMove}`);
  console.log(`Theorem module: ${snapshot.theoremModule ?? '(none)'}`);
  console.log(`Theorem loop markdown: ${snapshot.theoremLoopMarkdownPresent ? snapshot.theoremLoopMarkdownPath : '(not written yet)'}`);
  console.log(`Theorem loop data: ${snapshot.theoremLoopJsonPresent ? snapshot.theoremLoopJsonPath : '(not written yet)'}`);
  if (snapshot.commands.sourceRefresh) {
    console.log(`Source refresh: ${snapshot.commands.sourceRefresh}`);
  }
  if (snapshot.currentBridgeState?.next_unmatched_representative !== undefined) {
    console.log(`Next unmatched representative: ${snapshot.currentBridgeState.next_unmatched_representative}`);
  }
  if ((snapshot.theoremHooks ?? []).length > 0) {
    console.log('Theorem hooks:');
    for (const hook of snapshot.theoremHooks) {
      console.log(`- ${hook.hook_id} [${hook.status}]${hook.note ? ` ${hook.note}` : ''}`);
    }
  }
  if ((snapshot.theoremAgenda ?? []).length > 0) {
    console.log('Theorem agenda:');
    for (const item of snapshot.theoremAgenda) {
      console.log(`- ${item.item_id} [${item.status}] ${item.task}${item.why ? ` | ${item.why}` : ''}`);
    }
  }
}

function printTheoremLoopRefresh(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (!result.ok) {
    console.log('Problem theorem-loop refresh: failed');
    console.log(`Problem id: ${result.problemId}`);
    console.log(`Error: ${result.error}`);
    if (result.sourceRefresh?.command) {
      console.log(`Source refresh command: ${result.sourceRefresh.command}`);
    }
    return;
  }

  console.log('Problem theorem-loop refresh: complete');
  console.log(`Problem id: ${result.problemId}`);
  console.log(`Theorem loop markdown: ${result.markdownPath}`);
  console.log(`Theorem loop data: ${result.jsonPath}`);
  if (result.sourceRefresh?.command) {
    console.log(`Source refresh command: ${result.sourceRefresh.command}`);
    console.log(`Source refresh ran: ${result.sourceRefresh.skipped ? 'no' : 'yes'}`);
  }
  console.log(`Theorem loop mode: ${result.theoremLoop.theoremLoopMode}`);
}

function printClaimLoop(snapshot, asJson) {
  if (asJson) {
    console.log(JSON.stringify(snapshot, null, 2));
    return;
  }

  console.log(`${snapshot.displayName} claim loop`);
  console.log(`Claim loop mode: ${snapshot.claimLoopMode}`);
  console.log(`Current claim surface: ${snapshot.currentClaimSurface}`);
  console.log(`Active route: ${snapshot.currentState.activeRoute ?? '(none)'}`);
  console.log(`Claim loop markdown: ${snapshot.claimLoopMarkdownPresent ? snapshot.claimLoopMarkdownPath : '(not written yet)'}`);
  console.log(`Claim loop data: ${snapshot.claimLoopJsonPresent ? snapshot.claimLoopJsonPath : '(not written yet)'}`);
  console.log(`Theorem loop: ${snapshot.commands.theoremLoop}`);
  console.log(`Claim refresh: ${snapshot.commands.claimLoopRefresh}`);
  if (snapshot.commands.sourceRefresh) {
    console.log(`Source refresh: ${snapshot.commands.sourceRefresh}`);
  }
  if ((snapshot.featureExtractors ?? []).length > 0) {
    console.log('Feature extractors:');
    for (const extractor of snapshot.featureExtractors) {
      console.log(`- ${extractor.extractor_id} [${extractor.status}] ${extractor.note}`);
    }
  }
  if ((snapshot.claimGenerators ?? []).length > 0) {
    console.log('Claim generators:');
    for (const generator of snapshot.claimGenerators) {
      console.log(`- ${generator.generator_id} [${generator.status}] ${generator.note}`);
    }
  }
  if ((snapshot.claimFalsifiers ?? []).length > 0) {
    console.log('Claim falsifiers:');
    for (const falsifier of snapshot.claimFalsifiers) {
      console.log(`- ${falsifier.falsifier_id} [${falsifier.status}] ${falsifier.note}`);
    }
  }
  if ((snapshot.verifierAdapters ?? []).length > 0) {
    console.log('Verifier adapters:');
    for (const adapter of snapshot.verifierAdapters) {
      console.log(`- ${adapter.adapter_id} [${adapter.status}] ${adapter.note}`);
    }
  }
  if ((snapshot.candidateClaims ?? []).length > 0) {
    console.log('Candidate claims:');
    for (const claim of snapshot.candidateClaims) {
      console.log(`- ${claim.claim_id} [${claim.status}] ${claim.summary}${claim.why ? ` | ${claim.why}` : ''}`);
    }
  }
}

function printClaimLoopRefresh(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (!result.ok) {
    console.log('Problem claim-loop refresh: failed');
    console.log(`Problem id: ${result.problemId}`);
    console.log(`Error: ${result.error}`);
    return;
  }

  console.log('Problem claim-loop refresh: complete');
  console.log(`Problem id: ${result.problemId}`);
  console.log(`Claim loop markdown: ${result.markdownPath}`);
  console.log(`Claim loop data: ${result.jsonPath}`);
  if (result.theoremRefresh?.jsonPath) {
    console.log(`Theorem loop data: ${result.theoremRefresh.jsonPath}`);
  }
  console.log(`Claim loop mode: ${result.claimLoop.claimLoopMode}`);
}

function printClaimPass(snapshot, asJson) {
  if (asJson) {
    console.log(JSON.stringify(snapshot, null, 2));
    return;
  }

  console.log(`${snapshot.displayName} claim pass`);
  console.log(`Claim pass mode: ${snapshot.claimPassMode}`);
  console.log(`Current claim surface: ${snapshot.currentClaimSurface}`);
  console.log(`Active route: ${snapshot.currentState.activeRoute ?? '(none)'}`);
  console.log(`Latest verified interval: ${snapshot.currentState.latestVerifiedInterval ?? '(none)'}`);
  console.log(`Claim pass markdown: ${snapshot.claimPassMarkdownPresent ? snapshot.claimPassMarkdownPath : '(not written yet)'}`);
  console.log(`Claim pass data: ${snapshot.claimPassJsonPresent ? snapshot.claimPassJsonPath : '(not written yet)'}`);
  console.log(`Claim pass command: ${snapshot.commands.claimPass}`);
  console.log(`Claim pass refresh: ${snapshot.commands.claimPassRefresh}`);
  if (snapshot.commands.sourceRefresh) {
    console.log(`Source refresh: ${snapshot.commands.sourceRefresh}`);
  }
  console.log(`Hook summary: supported=${snapshot.summary?.hooks?.supported ?? 0}, unresolved=${snapshot.summary?.hooks?.unresolved ?? 0}, broken=${snapshot.summary?.hooks?.broken ?? 0}`);
  console.log(`Claim summary: supported=${snapshot.summary?.claims?.supported ?? 0}, actionable=${snapshot.summary?.claims?.actionable ?? 0}, unresolved=${snapshot.summary?.claims?.unresolved ?? 0}, broken=${snapshot.summary?.claims?.broken ?? 0}`);
  if ((snapshot.hookAssessments ?? []).length > 0) {
    console.log('Hook assessments:');
    for (const hook of snapshot.hookAssessments) {
      console.log(`- ${hook.hook_id} [${hook.verdict}] ${hook.rationale}`);
    }
  }
  if ((snapshot.claimAssessments ?? []).length > 0) {
    console.log('Claim assessments:');
    for (const claim of snapshot.claimAssessments) {
      console.log(`- ${claim.claim_id} [${claim.verdict}] ${claim.summary}${claim.rationale ? ` | ${claim.rationale}` : ''}`);
    }
  }
  if ((snapshot.recommendations ?? []).length > 0) {
    console.log('Recommendations:');
    for (const recommendation of snapshot.recommendations) {
      console.log(`- ${recommendation.recommendation_id} [${recommendation.priority}] ${recommendation.lane}${recommendation.reason ? ` | ${recommendation.reason}` : ''}`);
    }
  }
}

function printClaimPassRefresh(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (!result.ok) {
    console.log('Problem claim-pass refresh: failed');
    console.log(`Problem id: ${result.problemId}`);
    console.log(`Error: ${result.error}`);
    return;
  }

  console.log('Problem claim-pass refresh: complete');
  console.log(`Problem id: ${result.problemId}`);
  console.log(`Claim pass markdown: ${result.markdownPath}`);
  console.log(`Claim pass data: ${result.jsonPath}`);
  if (result.claimRefresh?.jsonPath) {
    console.log(`Claim loop data: ${result.claimRefresh.jsonPath}`);
  }
  console.log(`Claim pass mode: ${result.claimPass.claimPassMode}`);
}

function printFormalization(snapshot, asJson) {
  if (asJson) {
    console.log(JSON.stringify(snapshot, null, 2));
    return;
  }

  console.log(`${snapshot.displayName} formalization`);
  console.log(`Formalization mode: ${snapshot.formalizationMode}`);
  console.log(`Current claim surface: ${snapshot.currentClaimSurface}`);
  console.log(`Active route: ${snapshot.currentState.activeRoute ?? '(none)'}`);
  console.log(`Latest verified interval: ${snapshot.currentState.latestVerifiedInterval ?? '(none)'}`);
  console.log(`Formalization markdown: ${snapshot.formalizationMarkdownPresent ? snapshot.formalizationMarkdownPath : '(not written yet)'}`);
  console.log(`Formalization data: ${snapshot.formalizationJsonPresent ? snapshot.formalizationJsonPath : '(not written yet)'}`);
  console.log(`Formalization command: ${snapshot.commands.formalization}`);
  console.log(`Formalization refresh: ${snapshot.commands.formalizationRefresh}`);
  if (snapshot.currentTarget) {
    console.log(`Current target: ${snapshot.currentTarget.title ?? snapshot.currentTarget.focusId ?? '(none)'}`);
    console.log(`Target status: ${snapshot.currentTarget.status ?? '(none)'}`);
    console.log(`Target statement: ${snapshot.currentTarget.statement ?? '(none)'}`);
  }
}

function printFormalizationRefresh(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (!result.ok) {
    console.log('Problem formalization refresh: failed');
    console.log(`Problem id: ${result.problemId}`);
    console.log(`Error: ${result.error}`);
    return;
  }

  console.log('Problem formalization refresh: complete');
  console.log(`Problem id: ${result.problemId}`);
  console.log(`Formalization markdown: ${result.markdownPath}`);
  console.log(`Formalization data: ${result.jsonPath}`);
  if (result.claimPassRefresh?.jsonPath) {
    console.log(`Claim pass data: ${result.claimPassRefresh.jsonPath}`);
  }
  console.log(`Formalization mode: ${result.formalization.formalizationMode}`);
}

function printFormalizationWork(snapshot, asJson) {
  if (asJson) {
    console.log(JSON.stringify(snapshot, null, 2));
    return;
  }

  console.log(`${snapshot.displayName} formalization work`);
  console.log(`Formalization work mode: ${snapshot.formalizationWorkMode}`);
  console.log(`Current claim surface: ${snapshot.currentClaimSurface}`);
  console.log(`Active route: ${snapshot.currentState.activeRoute ?? '(none)'}`);
  console.log(`Latest verified interval: ${snapshot.currentState.latestVerifiedInterval ?? '(none)'}`);
  console.log(`Formalization work markdown: ${snapshot.formalizationWorkMarkdownPresent ? snapshot.formalizationWorkMarkdownPath : '(not written yet)'}`);
  console.log(`Formalization work data: ${snapshot.formalizationWorkJsonPresent ? snapshot.formalizationWorkJsonPath : '(not written yet)'}`);
  console.log(`Formalization work diagram: ${snapshot.formalizationWorkSvgPresent ? snapshot.formalizationWorkSvgPath : '(not written yet)'}`);
  console.log(`Formalization work command: ${snapshot.commands.formalizationWork}`);
  console.log(`Formalization work refresh: ${snapshot.commands.formalizationWorkRefresh}`);
  if (snapshot.currentWork) {
    console.log(`Current work: ${snapshot.currentWork.title ?? snapshot.currentWork.focusId ?? '(none)'}`);
    console.log(`Work status: ${snapshot.currentWork.status ?? '(none)'}`);
    console.log(`Work summary: ${snapshot.currentWork.summary ?? '(none)'}`);
  }
}

function printFormalizationWorkRefresh(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (!result.ok) {
    console.log('Problem formalization-work refresh: failed');
    console.log(`Problem id: ${result.problemId}`);
    console.log(`Error: ${result.error}`);
    return;
  }

  console.log('Problem formalization-work refresh: complete');
  console.log(`Problem id: ${result.problemId}`);
  console.log(`Formalization work markdown: ${result.markdownPath}`);
  console.log(`Formalization work data: ${result.jsonPath}`);
  console.log(`Formalization work diagram: ${result.svgPath ?? '(not written yet)'}`);
  if (result.formalizationRefresh?.jsonPath) {
    console.log(`Formalization data: ${result.formalizationRefresh.jsonPath}`);
  }
  console.log(`Formalization work mode: ${result.formalizationWork.formalizationWorkMode}`);
}

function printFormalizationWorkCheck(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  console.log(`${result.displayName} formalization-work check`);
  console.log(`Status: ${result.status}`);
  console.log(`Current work: ${result.currentWorkTitle ?? result.currentWorkId ?? '(none)'}`);
  console.log(`Checks: ${result.summary.checkCount}`);
  console.log(`Checked rows: ${result.summary.checkedRowCount}`);
  console.log(`Failures: ${result.summary.failCount}`);
  if (result.firstRemainingGap) {
    console.log(`Next gap: ${result.firstRemainingGap}`);
  }
  for (const check of result.checks ?? []) {
    console.log(`- ${check.checkerId}: ${check.status} (${check.passCount}/${check.checkedRowCount} passed)`);
  }
}

function pickTaskListHighestValueStep(taskList) {
  const priorityRank = {
    highest: 0,
    next: 1,
    high: 2,
  };
  const recommended = [...(taskList.nextNeededSteps ?? [])]
    .filter((step) => Object.hasOwn(priorityRank, step.status))
    .sort((left, right) => priorityRank[left.status] - priorityRank[right.status])[0]
    ?? null;
  if (recommended) {
    return {
      stepId: recommended.stepId,
      status: recommended.status,
      task: recommended.task,
      command: recommended.command ?? null,
      packetJsonPath: recommended.packetJsonPath ?? null,
      packetMarkdownPath: recommended.packetMarkdownPath ?? null,
    };
  }

  const currentTask = (taskList.currentTasks ?? []).find((task) => task.status === 'in_progress')
    ?? (taskList.currentTasks ?? []).find((task) => task.taskId === 'execute_current_work_packet')
    ?? (taskList.currentTasks ?? []).find((task) => task.status === 'ready')
    ?? null;
  if (!currentTask) {
    return null;
  }

  return {
    stepId: currentTask.taskId,
    status: currentTask.status,
    task: currentTask.task,
    command: currentTask.command ?? null,
  };
}

function getTaskListModeAssist(taskList) {
  const granular = taskList.granularBreakdownMode ?? null;
  const overlays = taskList.orpModeOverlays?.overlays ?? [];
  const overlayIds = overlays.map((overlay) => overlay.modeId).filter((modeId) => modeId !== granular?.modeId);
  return {
    defaultModeId: taskList.orpModeOverlays?.defaultModeId ?? granular?.modeId ?? null,
    selectionRule: taskList.orpModeOverlays?.selectionRule ?? null,
    nudgeCommand: granular?.commands?.nudge ?? null,
    otherOverlayIds: overlayIds,
  };
}

function printTaskListFrictionlessNext(taskList) {
  const highestValueStep = pickTaskListHighestValueStep(taskList);
  if (highestValueStep) {
    console.log(`Highest-value next step: ${highestValueStep.stepId} [${highestValueStep.status}]`);
    console.log(`Next task: ${highestValueStep.task}`);
    if (highestValueStep.command) {
      console.log(`Next command: ${highestValueStep.command}`);
    }
    if (highestValueStep.packetJsonPath) {
      console.log(`Next packet: ${highestValueStep.packetJsonPath}`);
    }
    if (highestValueStep.packetMarkdownPath) {
      console.log(`Next packet note: ${highestValueStep.packetMarkdownPath}`);
    }
  }

  const modeAssist = getTaskListModeAssist(taskList);
  if (modeAssist.defaultModeId || modeAssist.nudgeCommand || modeAssist.selectionRule) {
    if (modeAssist.nudgeCommand) {
      if (highestValueStep?.command) {
        console.log(`Mode assist: Execute the next command first; if the target feels fuzzy, run ${modeAssist.nudgeCommand}.`);
      } else if (highestValueStep?.packetJsonPath) {
        console.log(`Mode assist: Work the next packet first; if the target feels fuzzy, run ${modeAssist.nudgeCommand}.`);
      } else {
        console.log(`Mode assist: Work the next task first; if the target feels fuzzy, run ${modeAssist.nudgeCommand}.`);
      }
    } else {
      console.log(`Mode assist: ${modeAssist.selectionRule ?? 'Use an ORP mode only when it reduces friction.'}`);
    }
    if (modeAssist.otherOverlayIds.length > 0) {
      console.log(`Optional overlays when useful: ${modeAssist.otherOverlayIds.join(', ')}`);
    }
  }
}

function printTaskList(snapshot, asJson) {
  if (asJson) {
    console.log(JSON.stringify(snapshot, null, 2));
    return;
  }

  console.log(`${snapshot.displayName} task list`);
  console.log(`Task list mode: ${snapshot.taskListMode}`);
  console.log(`Active route: ${snapshot.currentState.activeRoute ?? '(none)'}`);
  console.log(`Current claim surface: ${snapshot.currentState.currentClaimSurface ?? '(none)'}`);
  console.log(`Next honest move: ${snapshot.currentState.nextHonestMove ?? '(none)'}`);
  console.log(`Task list markdown: ${snapshot.taskListMarkdownPresent ? snapshot.taskListMarkdownPath : '(not written yet)'}`);
  console.log(`Task list data: ${snapshot.taskListJsonPresent ? snapshot.taskListJsonPath : '(not written yet)'}`);
  console.log(`Task list command: ${snapshot.commands.taskList}`);
  console.log(`Task list refresh: ${snapshot.commands.taskListRefresh}`);
  printTaskListFrictionlessNext(snapshot);
  if (snapshot.currentObjective) {
    console.log(`Current objective: ${snapshot.currentObjective.title ?? '(none)'}`);
    console.log(`Active work: ${snapshot.currentObjective.activeWorkTitle ?? '(none)'}`);
    console.log(`Active work status: ${snapshot.currentObjective.activeWorkStatus ?? '(none)'}`);
  }
  if ((snapshot.currentTasks ?? []).length > 0) {
    console.log('Current tasks:');
    for (const task of snapshot.currentTasks.slice(0, 8)) {
      console.log(`- ${task.taskId} [${task.status}] ${task.title}${task.command ? ` | ${task.command}` : ''}`);
    }
  }
  if ((snapshot.nextNeededSteps ?? []).length > 0) {
    console.log('Next needed steps:');
    for (const step of snapshot.nextNeededSteps.slice(0, 6)) {
      console.log(`- ${step.stepId} [${step.status}] ${step.task}${step.command ? ` | ${step.command}` : ''}`);
    }
  }
}

function printTaskListRefresh(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (!result.ok) {
    console.log('Problem task-list refresh: failed');
    console.log(`Problem id: ${result.problemId}`);
    console.log(`Error: ${result.error}`);
    return;
  }

  console.log('Problem task-list refresh: complete');
  console.log(`Problem id: ${result.problemId}`);
  console.log(`Task list markdown: ${result.markdownPath}`);
  console.log(`Task list data: ${result.jsonPath}`);
  if (result.formalizationWorkRefresh?.jsonPath) {
    console.log(`Formalization work data: ${result.formalizationWorkRefresh.jsonPath}`);
  }
  if (result.splitAtomPacketWrite?.ok) {
    console.log(`Split atom packets: ${result.splitAtomPacketWrite.packetCount} written`);
    console.log(`Split atom manifest: ${result.splitAtomPacketWrite.manifestJsonPath}`);
    if (result.splitAtomPacketWrite.firstPacketToAttack?.atomId) {
      console.log(`First split atom: ${result.splitAtomPacketWrite.firstPacketToAttack.atomId}`);
    }
  }
  console.log(`Task list mode: ${result.taskList.taskListMode}`);
  printTaskListFrictionlessNext(result.taskList);
}

function printTaskListRun(result, asJson) {
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (!result.ok) {
    console.log('Problem task-list run: failed');
    console.log(`Problem id: ${result.problemId}`);
    console.log(`Error: ${result.error}`);
    return;
  }

  console.log('Problem task-list run: complete');
  console.log(`Problem id: ${result.problemId}`);
  console.log(`Requested passes: ${result.requestedPasses}`);
  console.log(`Executed passes: ${result.executedPasses}`);
  console.log(`Stop reason: ${result.stopReason}`);
  console.log(`Converged: ${result.converged ? 'yes' : 'no'}`);
  if (result.convergedAtPass) {
    console.log(`Converged at pass: ${result.convergedAtPass}`);
  }
  console.log(`Task loop run markdown: ${result.markdownPath}`);
  console.log(`Task loop run data: ${result.jsonPath}`);
  if (result.currentState) {
    console.log(`Active route: ${result.currentState.activeRoute ?? '(none)'}`);
    console.log(`Latest verified interval: ${result.currentState.latestVerifiedInterval ?? '(none)'}`);
  }
  if (result.highestValueStep) {
    console.log(`Highest-value next step: ${result.highestValueStep.stepId ?? '(none)'}`);
    console.log(`Next task: ${result.highestValueStep.task ?? '(none)'}`);
    if (result.highestValueStep.command) {
      console.log(`Next command: ${result.highestValueStep.command}`);
    }
  }
}

export function runProblemCommand(args) {
  const [subcommand, value, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos problem list [--cluster <name>] [--repo-status <status>] [--harness-depth <depth>] [--site-status <status>]');
    console.log('  erdos problem show <id>');
    console.log('  erdos problem use <id>');
    console.log('  erdos problem current');
    console.log('  erdos problem artifacts [<id>] [--json]');
    console.log('  erdos problem theorem-loop [<id>] [--json]');
    console.log('  erdos problem theorem-loop-refresh [<id>] [--json]');
    console.log('  erdos problem claim-loop [<id>] [--json]');
    console.log('  erdos problem claim-loop-refresh [<id>] [--json]');
    console.log('  erdos problem claim-pass [<id>] [--json]');
    console.log('  erdos problem claim-pass-refresh [<id>] [--json]');
    console.log('  erdos problem formalization [<id>] [--json]');
    console.log('  erdos problem formalization-refresh [<id>] [--json]');
    console.log('  erdos problem formalization-work [<id>] [--json]');
    console.log('  erdos problem formalization-work-refresh [<id>] [--json]');
    console.log('  erdos problem formalization-work-check [<id>] [--json]');
    console.log('  erdos problem task-list [<id>] [--json]');
    console.log('  erdos problem task-list-refresh [<id>] [--json]');
    console.log('  erdos problem task-list-run [<id>] [--passes <n>] [--no-stop-on-convergence] [--json]');
    return 0;
  }

  if (subcommand === 'list') {
    const parsed = parseListFilters([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    printProblemTable(listProblems(parsed.filters), readCurrentProblem());
    return 0;
  }

  if (subcommand === 'show') {
    const problemId = value ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    printProblem(problem);
    return 0;
  }

  if (subcommand === 'use') {
    if (!value) {
      console.error('Missing problem id.');
      return 1;
    }
    const problem = getProblem(value);
    if (!problem) {
      console.error(`Unknown problem: ${value}`);
      return 1;
    }
    setCurrentProblem(problem.problemId);
    syncOrpWorkspaceKit();
    syncState();
    const checkpointResult = syncCheckpoints();
    const state = checkpointResult.state;
    console.log(`Active problem set to ${problem.problemId} (${problem.title})`);
    console.log(`Active route: ${state.activeRoute ?? '(none)'}`);
    console.log(`Next honest move: ${state.nextHonestMove}`);
    console.log(`Checkpoint shelf: ${checkpointResult.indexPath}`);
    return 0;
  }

  if (subcommand === 'current') {
    const problemId = readCurrentProblem();
    if (!problemId) {
      console.log('No active problem selected.');
      return 0;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Active problem ${problemId} is not in the catalog.`);
      return 1;
    }
    printProblem(problem);
    return 0;
  }

  if (subcommand === 'artifacts') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const inventory = getProblemArtifactInventory(problem);
    printArtifactInventory(problem, inventory, parsed.asJson);
    return 0;
  }

  if (subcommand === 'theorem-loop') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const snapshot = getProblemTheoremLoopSnapshot(problem);
    printTheoremLoop(snapshot, parsed.asJson);
    return 0;
  }

  if (subcommand === 'theorem-loop-refresh') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const result = refreshProblemTheoremLoop(problem);
    printTheoremLoopRefresh(result, parsed.asJson);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'claim-loop') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const snapshot = getProblemClaimLoopSnapshot(problem);
    printClaimLoop(snapshot, parsed.asJson);
    return 0;
  }

  if (subcommand === 'claim-loop-refresh') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const result = refreshProblemClaimLoop(problem);
    printClaimLoopRefresh(result, parsed.asJson);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'claim-pass') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const snapshot = getProblemClaimPassSnapshot(problem);
    printClaimPass(snapshot, parsed.asJson);
    return 0;
  }

  if (subcommand === 'claim-pass-refresh') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const result = refreshProblemClaimPass(problem);
    printClaimPassRefresh(result, parsed.asJson);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'formalization') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const snapshot = getProblemFormalizationSnapshot(problem);
    printFormalization(snapshot, parsed.asJson);
    return 0;
  }

  if (subcommand === 'formalization-refresh') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const result = refreshProblemFormalization(problem);
    printFormalizationRefresh(result, parsed.asJson);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'formalization-work') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const snapshot = getProblemFormalizationWorkSnapshot(problem);
    printFormalizationWork(snapshot, parsed.asJson);
    return 0;
  }

  if (subcommand === 'formalization-work-refresh') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const result = refreshProblemFormalizationWork(problem);
    printFormalizationWorkRefresh(result, parsed.asJson);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'formalization-work-check') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const result = checkProblemFormalizationWork(problem);
    printFormalizationWorkCheck(result, parsed.asJson);
    return result.status === 'failed' ? 1 : 0;
  }

  if (subcommand === 'task-list') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const snapshot = getProblemTaskListSnapshot(problem);
    printTaskList(snapshot, parsed.asJson);
    return 0;
  }

  if (subcommand === 'task-list-refresh') {
    const parsed = parseArtifactArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const result = refreshProblemTaskList(problem);
    printTaskListRefresh(result, parsed.asJson);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'task-list-run') {
    const parsed = parseTaskListRunArgs([value, ...rest].filter(Boolean));
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }
    const problem = getProblem(problemId);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    const result = runProblemTaskListLoop(problem, {
      passes: parsed.passes,
      stopOnConvergence: parsed.stopOnConvergence,
    });
    printTaskListRun(result, parsed.asJson);
    return result.ok ? 0 : 1;
  }

  console.error(`Unknown problem subcommand: ${subcommand}`);
  return 1;
}
