import {
  getProblemClaimLoopSnapshot,
  getProblemClaimPassSnapshot,
  getProblemFormalizationSnapshot,
  getProblemFormalizationWorkSnapshot,
  getProblemTaskListSnapshot,
  getProblemTheoremLoopSnapshot,
} from './theorem-loop.js';

function buildComputeSurface(problem, clusterSnapshot) {
  if (problem.cluster === 'number-theory') {
    const frontierLoop = clusterSnapshot?.frontierLoop ?? null;
    return {
      available: Boolean(frontierLoop),
      kind: 'frontier_engine',
      mode: frontierLoop?.mode ?? null,
      summary: frontierLoop?.summary ?? null,
      entryCommand: frontierLoop?.primaryCommand ?? `erdos number-theory dispatch ${problem.problemId}`,
      refreshCommand: frontierLoop?.refreshCommand ?? null,
      setupCommands: [
        frontierLoop?.activationCommand,
        frontierLoop?.upgradeCommand,
      ].filter(Boolean),
      hardwareDoctorCommand: 'erdos frontier doctor',
    };
  }

  if (problem.cluster === 'sunflower' && clusterSnapshot?.computeLanePresent) {
    return {
      available: true,
      kind: 'packaged_compute_lane',
      mode: 'cpu_or_paid_lane',
      summary: clusterSnapshot.computeSummary ?? null,
      entryCommand: `erdos sunflower compute run ${problem.problemId}`,
      refreshCommand: null,
      setupCommands: [],
      hardwareDoctorCommand: null,
    };
  }

  return {
    available: false,
    kind: 'none',
    mode: null,
    summary: null,
    entryCommand: null,
    refreshCommand: null,
    setupCommands: [],
    hardwareDoctorCommand: null,
  };
}

export function buildResearchStackSummary(problem, inventory, orp, clusterSnapshot) {
  const theoremLoop = getProblemTheoremLoopSnapshot(problem);
  const claimLoop = getProblemClaimLoopSnapshot(problem);
  const claimPass = getProblemClaimPassSnapshot(problem);
  const formalization = getProblemFormalizationSnapshot(problem);
  const formalizationWork = getProblemFormalizationWorkSnapshot(problem);
  const taskList = getProblemTaskListSnapshot(problem);
  const compute = buildComputeSurface(problem, clusterSnapshot);

  return {
    problemId: problem.problemId,
    displayName: problem.displayName,
    canonicalSource: {
      repo: 'SproutSeeds/erdos-problems',
      sourceUrl: problem.sourceUrl,
      importSnapshotKind: inventory?.upstreamSnapshot?.kind ?? null,
      importSnapshotCommit: inventory?.upstreamSnapshot?.upstreamCommit ?? null,
      commands: {
        importShow: 'erdos import show',
        importSync: 'erdos import sync',
        importSyncMaintainer: 'erdos import sync --write-package-snapshot',
      },
    },
    localProtocol: {
      orpProtocolPresent: Boolean(orp?.workspace?.protocolPresent),
      orpIntegrationPresent: Boolean(orp?.workspace?.integrationPresent),
      checkpointShelfPresent: Boolean(clusterSnapshot),
      commands: {
        orpSync: 'erdos orp sync',
        checkpointsSync: 'erdos checkpoints sync',
        preflight: 'erdos preflight',
      },
    },
    researchApi: {
      kind: 'orp_openai_research',
      defaultMode: 'planning_only',
      liveCallsRequireExecute: true,
      liveCallsRequireAllowPaid: true,
      dailyLiveRunLimitDefault: 10,
      dailySpendLimitUsdDefault: 5,
      defaultEstimatedAskCostUsd: 1,
      defaultEstimatedSmokeCostUsd: 0.05,
      secretAlias: 'openai-primary',
      envVarName: 'OPENAI_API_KEY',
      paidCallEnvVarName: 'ERDOS_ORP_RESEARCH_ALLOW_PAID',
      dailyLimitEnvVarName: 'ERDOS_ORP_RESEARCH_DAILY_LIMIT',
      dailySpendLimitEnvVarName: 'ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT',
      estimatedCostEnvVarName: 'ERDOS_ORP_RESEARCH_ESTIMATED_COST_USD',
      statusCommand: 'erdos orp research status',
      planCommand: `erdos orp research ask ${problem.problemId} --question "<research question>"`,
      executeCommand: `erdos orp research ask ${problem.problemId} --question "<research question>" --execute --allow-paid`,
      openaiSmokeCommand: 'erdos orp research openai-check',
      liveOpenaiSmokeCommand: 'erdos orp research openai-check --execute --allow-paid',
      runStatusCommand: 'erdos orp research run-status <run-id>',
      showCommand: 'erdos orp research show <run-id>',
      usageCommand: 'erdos orp research usage',
      useWhen: 'Use at high-leverage source-audit, theorem-wedge, external-reference, or repeated-local-stall moments. Do not use for routine local tests, deterministic compute, or broad fishing.',
      governance: 'ORP research runs are process artifacts for discovery and source audit; they do not become canonical proof unless written back as audited packets. Live OpenAI calls require explicit paid-call opt-in and are capped by the local daily live-run and daily USD spend guards.',
    },
    theorem: {
      mode: theoremLoop.theoremLoopMode,
      claimSurface: theoremLoop.currentState?.currentClaimSurface ?? null,
      theoremLoopPath: theoremLoop.theoremLoopMarkdownPath,
      claimLoopMode: claimLoop.claimLoopMode,
      claimLoopPath: claimLoop.claimLoopMarkdownPath,
      claimPassMode: claimPass.claimPassMode,
      claimPassPath: claimPass.claimPassMarkdownPath,
      formalizationMode: formalization.formalizationMode,
      formalizationPath: formalization.formalizationMarkdownPath,
      formalizationWorkMode: formalizationWork.formalizationWorkMode,
      formalizationWorkPath: formalizationWork.formalizationWorkMarkdownPath,
      taskListMode: taskList.taskListMode,
      taskListPath: taskList.taskListMarkdownPath,
      commands: {
        show: theoremLoop.commands?.theoremLoop ?? null,
        refresh: theoremLoop.commands?.theoremLoopRefresh ?? null,
        claimShow: claimLoop.commands?.claimLoop ?? null,
        claimRefresh: claimLoop.commands?.claimLoopRefresh ?? null,
        claimPassShow: claimPass.commands?.claimPass ?? null,
        claimPassRefresh: claimPass.commands?.claimPassRefresh ?? null,
        formalizationShow: formalization.commands?.formalization ?? null,
        formalizationRefresh: formalization.commands?.formalizationRefresh ?? null,
        formalizationWorkShow: formalizationWork.commands?.formalizationWork ?? null,
        formalizationWorkRefresh: formalizationWork.commands?.formalizationWorkRefresh ?? null,
        taskListShow: taskList.commands?.taskList ?? null,
        taskListRefresh: taskList.commands?.taskListRefresh ?? null,
        sourceRefresh: theoremLoop.commands?.sourceRefresh ?? null,
      },
    },
    compute,
    writeback: {
      problemArtifactsCommand: `erdos problem artifacts ${problem.problemId}`,
      packagedRefreshCommand: theoremLoop.commands?.theoremLoopRefresh ?? null,
      claimRefreshCommand: claimLoop.commands?.claimLoopRefresh ?? null,
      claimPassRefreshCommand: claimPass.commands?.claimPassRefresh ?? null,
      formalizationRefreshCommand: formalization.commands?.formalizationRefresh ?? null,
      formalizationWorkRefreshCommand: formalizationWork.commands?.formalizationWorkRefresh ?? null,
      taskListRefreshCommand: taskList.commands?.taskListRefresh ?? null,
      sourceRefreshCommand: theoremLoop.commands?.sourceRefresh ?? null,
      maintainerSeedTemplate: `erdos maintainer seed problem ${problem.problemId} --from-pull .erdos/pulls/${problem.problemId} --cluster ${problem.cluster}`,
    },
  };
}
