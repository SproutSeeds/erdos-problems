#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const problemDir = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848');
const frontierBridge = path.join(problemDir, 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_BOUNDARY_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_MOD50_PROFILE_BLOCKER_PACKET.json');
const DEFAULT_USAGE_LEDGER = path.join(repoRoot, '.erdos', 'registry', 'research', 'openai-live-usage.json');
const DEFAULT_PROGRESS_JSON = path.join(problemDir, 'PROGRESS.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_THREE_PROFILE_SOURCE_IMPORT_NO_SPEND_DECISION_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_THREE_PROFILE_SOURCE_IMPORT_NO_SPEND_DECISION_BLOCKER_PACKET.md');

const TARGET = 'decide_p848_three_profile_source_import_with_budget_guard_or_emit_no_spend_blocker';
const NEXT_ACTION = 'assemble_p848_no_spend_all_n_recombination_blocker_after_three_profile_decision';
const STATUS = 'three_profile_source_import_no_spend_decision_blocker_emitted';

function parseArgs(argv) {
  const options = {
    boundaryPacket: DEFAULT_BOUNDARY_PACKET,
    usageLedger: DEFAULT_USAGE_LEDGER,
    progressJson: DEFAULT_PROGRESS_JSON,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--boundary-packet') {
      options.boundaryPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--usage-ledger') {
      options.usageLedger = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--progress-json') {
      options.progressJson = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--json-output') {
      options.jsonOutput = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--markdown-output') {
      options.markdownOutput = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--write-defaults') {
      options.jsonOutput = DEFAULT_JSON_OUTPUT;
      options.markdownOutput = DEFAULT_MARKDOWN_OUTPUT;
    } else if (arg === '--pretty') {
      options.pretty = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function rel(filePath) {
  return path.relative(repoRoot, filePath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfPresent(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }
  return readJson(filePath);
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function currentFrontierObligationCount(progress) {
  return progress?.p848Frontier?.frontierLedger?.frontierGrowthPressure?.openFrontierObligationCount
    ?? progress?.p848Frontier?.complementStrategyGuard?.activeOpenFront?.frontierGrowthPressure?.openFrontierObligationCount
    ?? null;
}

function buildUsageSnapshot(usageLedger) {
  const day = new Date().toISOString().slice(0, 10);
  const entries = Array.isArray(usageLedger?.entries) ? usageLedger.entries : [];
  const todayEntries = entries.filter((entry) => entry.day === day);
  const dailyLiveRunLimit = Number(process.env.ERDOS_ORP_RESEARCH_DAILY_LIMIT ?? 10);
  const dailySpendLimitUsd = Number(process.env.ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT ?? 5);
  const defaultEstimatedAskCostUsd = Number(process.env.ERDOS_ORP_RESEARCH_ESTIMATED_COST_USD ?? 1);
  const todaySpendUsd = todayEntries.reduce((sum, entry) => sum + Number(entry.costUsd ?? entry.estimatedCostUsd ?? 0), 0);
  const todayLiveRunCount = todayEntries.length;
  const todayRemainingLiveRuns = Math.max(0, dailyLiveRunLimit - todayLiveRunCount);
  const todayRemainingSpendUsd = Math.max(0, dailySpendLimitUsd - todaySpendUsd);

  return {
    status: todayRemainingLiveRuns > 0 && todayRemainingSpendUsd >= defaultEstimatedAskCostUsd
      ? 'usage_guard_has_capacity_but_no_spend_instruction_blocks_execution'
      : 'usage_guard_capacity_absent_or_insufficient',
    commandRun: './bin/erdos orp research usage --json',
    usageCheckRun: true,
    usageLedgerPath: rel(DEFAULT_USAGE_LEDGER),
    ledgerUpdatedAt: usageLedger?.updatedAt ?? null,
    day,
    dailyLiveRunLimit,
    todayLiveRunCount,
    todayRemainingLiveRuns,
    dailySpendLimitUsd,
    todaySpendUsd,
    todayRemainingSpendUsd,
    defaultEstimatedAskCostUsd,
    enoughCapacityForOneEstimatedAsk: todayRemainingLiveRuns > 0 && todayRemainingSpendUsd >= defaultEstimatedAskCostUsd,
  };
}

function buildPacket(options) {
  const boundary = readJson(options.boundaryPacket);
  assertCondition(boundary?.status === 'no_spend_source_import_boundary_assembled_after_mod50_profile_blocker', 'source/import boundary has unexpected status');
  assertCondition(boundary?.target === 'assemble_p848_no_spend_source_import_boundary_after_mod50_profile_blocker', 'source/import boundary has unexpected target');
  assertCondition(boundary?.recommendedNextAction === TARGET, 'source/import boundary does not route to this decision step');
  assertCondition(boundary?.boundaryAssembly?.assembledProfileOrBlockerCount === 3, 'source/import boundary must assemble three lanes');
  assertCondition(boundary?.selectedNextDecision?.selectedLaneId === 'mod50_generator_source_import', 'source/import boundary must select mod-50 first');
  assertCondition(boundary?.claims?.madeNewPaidCall === false, 'source/import boundary unexpectedly records a paid call');
  assertCondition(boundary?.claims?.provesAllN === false, 'source/import boundary unexpectedly proves all-N');

  const usageLedger = readJsonIfPresent(options.usageLedger) ?? { entries: [] };
  const progress = readJsonIfPresent(options.progressJson);
  const usageSnapshot = buildUsageSnapshot(usageLedger);
  const selectedLane = boundary.sourceImportDecisionQueue?.find((lane) => lane.laneId === boundary.selectedNextDecision?.selectedLaneId) ?? null;

  return {
    schema: 'erdos.number_theory.p848_three_profile_source_import_no_spend_decision_blocker_packet/1',
    packetId: 'P848_THREE_PROFILE_SOURCE_IMPORT_NO_SPEND_DECISION_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_decision_blocker_after_usage_check',
      boundaryPacket: rel(options.boundaryPacket),
      boundaryPacketSha256: sha256File(options.boundaryPacket),
      usageLedger: rel(options.usageLedger),
      usageLedgerSha256: fs.existsSync(options.usageLedger) ? sha256File(options.usageLedger) : null,
    },
    decision: {
      status: 'no_spend_blocker_emitted_profile_execution_not_released',
      mode: 'usage_checked_then_no_spend_blocked',
      selectedLaneId: boundary.selectedNextDecision.selectedLaneId,
      selectedProfileId: boundary.selectedNextDecision.selectedProfileId,
      selectedProfilePath: selectedLane?.profilePath ?? null,
      liveExecutionApproved: false,
      profileExecutionReleased: false,
      madeNewPaidCall: false,
      usageCheckRun: true,
      currentStepAllowsPaidCall: false,
      userInstruction: 'Do not spend money.',
      reason: 'The local usage ledger has capacity for one estimated source-audit call, but the current delegate instruction forbids spending. The decision therefore emits a no-spend blocker and keeps all three source/import lanes profile-bound.',
    },
    usageGuardSnapshot: usageSnapshot,
    preservedSourceImportLanes: boundary.sourceImportDecisionQueue ?? [],
    noSpendRecombinationBlocker: {
      status: 'all_source_import_lanes_profile_bound_without_provider_execution',
      openFrontierObligationCountAtDecision: currentFrontierObligationCount(progress),
      remainingTheoremObjects: [
        'mod50 all-future relevant-pair recurrence, finite-Q partition, or restored generator theorem',
        'Sawhney-compatible square-moduli union/hitting upper-bound source theorem',
        'p4217 residual finite CRT partition, decreasing rank, or squarefree-realization source theorem',
      ],
      nextBoundaryAction: NEXT_ACTION,
      failureBoundary: 'No all-N recombination may use these lanes until at least one missing source/import theorem is proved locally, imported under a future budget-guarded release, or replaced by an audited finite partition/decreasing invariant.',
    },
    futureLiveReleaseConditions: [
      'A future instruction allows budget-guarded live source-import execution despite this no-spend blocker.',
      './bin/erdos orp research usage --json is rerun immediately before any --execute --allow-paid call.',
      'The released call uses exactly one prepared profile, currently prioritized as p848-mod50-generator-source-import-single.',
      'The question rejects finite replay, avoiding-set-only large-sieve evidence, and broad theorem-wedge fishing as promotable proof.',
      'Any answer is packetized only as discovery until hypotheses, constants, denominator/partition objects, and proof boundaries are audited.',
    ],
    forbiddenMovesAfterDecision: [
      'execute_provider_source_import_under_current_no_spend_instruction',
      'run_erdos_orp_research_execute_allow_paid_this_turn',
      'rerun_the_same_broad_mod50_or_p4217_wedge_by_default',
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'try_fallback_selectors_one_by_one',
      'emit_a_naked_deterministic_rank_boundary',
      'treat_finite_mod50_replay_as_all_future_recurrence',
      'promote_tao_van_doorn_avoiding_bound_to_union_hitting_bound',
      'claim_N0_around_1e6_or_N0_at_most_40500_without_imported_threshold_source',
      'treat_bounded_finite_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Assemble the all-N recombination blocker after all three source/import lanes are profile-bound and no provider execution was released this turn.',
      finiteDenominatorOrRankToken: 'p848_three_profile_source_import_no_spend_decision_blocker',
      command: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet completes the three-profile source/import decision under the current no-spend instruction. It records that usage was checked and had remaining estimated capacity, but no ORP/OpenAI provider execution was released. The mod-50 source-import profile remains the first future budget-guarded candidate, and p4217 plus square-moduli remain profile/hard-blocked. It does not import a source theorem, prove a finite partition or decreasing rank, lower a threshold, recombine all-N, or decide Problem 848.',
    claims: {
      completesThreeProfileSourceImportDecision: true,
      usageCheckRun: true,
      usageGuardHadCapacityForOneEstimatedAsk: usageSnapshot.enoughCapacityForOneEstimatedAsk,
      emitsNoSpendBlocker: true,
      liveExecutionApproved: false,
      profileExecutionReleased: false,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      selectedLaneIsMod50: boundary.selectedNextDecision.selectedLaneId === 'mod50_generator_source_import',
      keepsAllThreeLanesProfileBound: Array.isArray(boundary.sourceImportDecisionQueue) && boundary.sourceImportDecisionQueue.length === 3,
      requiresFutureUsageCheckBeforeSpend: true,
      preservesBudgetGuardedFutureLane: true,
      respectsNoSpendInstruction: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      provesP4217ResidualSourceTheorem: false,
      provesSquareModuliUnionHittingUpperBound: false,
      provesMod50AllFutureRecurrence: false,
      restoresOriginalGenerator: false,
      provesFiniteQPartition: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 three-profile source/import no-spend decision blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Selected lane: \`${packet.decision.selectedLaneId}\``,
    `- Selected profile: \`${packet.decision.selectedProfileId}\``,
    `- Usage check run: \`${packet.decision.usageCheckRun}\``,
    `- Provider call made: \`${packet.decision.madeNewPaidCall}\``,
    '',
    '## Decision',
    '',
    packet.decision.reason,
    '',
    '## Usage Snapshot',
    '',
    `- Remaining live runs: \`${packet.usageGuardSnapshot.todayRemainingLiveRuns}\``,
    `- Remaining spend USD: \`${packet.usageGuardSnapshot.todayRemainingSpendUsd}\``,
    `- Enough for one estimated ask: \`${packet.usageGuardSnapshot.enoughCapacityForOneEstimatedAsk}\``,
    '',
    '## Remaining Theorem Objects',
    '',
    ...packet.noSpendRecombinationBlocker.remainingTheoremObjects.map((item) => `- ${item}`),
    '',
    '## Future Live Release Conditions',
    '',
    ...packet.futureLiveReleaseConditions.map((item) => `- ${item}`),
    '',
    '## Forbidden Moves',
    '',
    ...packet.forbiddenMovesAfterDecision.map((item) => `- \`${item}\``),
    '',
    '## Boundary',
    '',
    packet.proofBoundary,
    '',
  ].join('\n');
}

function writeOutputs(packet, options) {
  if (options.jsonOutput) {
    fs.mkdirSync(path.dirname(options.jsonOutput), { recursive: true });
    fs.writeFileSync(options.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
  }
  if (options.markdownOutput) {
    fs.mkdirSync(path.dirname(options.markdownOutput), { recursive: true });
    fs.writeFileSync(options.markdownOutput, renderMarkdown(packet));
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packet = buildPacket(options);
  writeOutputs(packet, options);
  if (options.pretty) {
    console.log(JSON.stringify(packet, null, 2));
  } else if (!options.jsonOutput && !options.markdownOutput) {
    console.log(JSON.stringify(packet));
  }
}

main();
