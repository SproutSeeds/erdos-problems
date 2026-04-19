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

const DEFAULT_DECISION_PACKET = path.join(frontierBridge, 'P848_THREE_PROFILE_SOURCE_IMPORT_NO_SPEND_DECISION_BLOCKER_PACKET.json');
const DEFAULT_PROGRESS_JSON = path.join(problemDir, 'PROGRESS.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_ALL_N_RECOMBINATION_BLOCKER_AFTER_THREE_PROFILE_DECISION_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_ALL_N_RECOMBINATION_BLOCKER_AFTER_THREE_PROFILE_DECISION_PACKET.md');

const TARGET = 'assemble_p848_no_spend_all_n_recombination_blocker_after_three_profile_decision';
const NEXT_ACTION = 'prepare_p848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker';
const STATUS = 'no_spend_all_n_recombination_blocker_after_three_profile_decision_emitted';

function parseArgs(argv) {
  const options = {
    decisionPacket: DEFAULT_DECISION_PACKET,
    progressJson: DEFAULT_PROGRESS_JSON,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--decision-packet') {
      options.decisionPacket = path.resolve(argv[index + 1]);
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

function compactLanes(lanes) {
  return lanes.map((lane) => ({
    laneId: lane.laneId,
    status: lane.status,
    priority: lane.priority,
    profileId: lane.profileId ?? null,
    profilePath: lane.profilePath ?? null,
    remainingSourceTheoremObject: {
      mod50_generator_source_import: 'mod-50 all-future relevant-pair recurrence, finite-Q partition, or restored original generator theorem',
      square_moduli_union_hitting_source_import: 'Sawhney-compatible square-moduli union/hitting upper-bound theorem with audited direction, constants, threshold, and finite handoff',
      p4217_residual_source_import: 'p4217 residual finite CRT partition, decreasing rank, or squarefree-realization source theorem',
    }[lane.laneId] ?? lane.reason ?? null,
    liveReleaseCondition: lane.liveReleaseCondition ?? null,
    proofBoundary: lane.proofBoundary ?? null,
  }));
}

function buildPacket(options) {
  const decision = readJson(options.decisionPacket);
  assertCondition(decision?.status === 'three_profile_source_import_no_spend_decision_blocker_emitted', 'three-profile decision packet has unexpected status');
  assertCondition(decision?.target === 'decide_p848_three_profile_source_import_with_budget_guard_or_emit_no_spend_blocker', 'three-profile decision packet has unexpected target');
  assertCondition(decision?.recommendedNextAction === TARGET, 'three-profile decision packet does not route to this recombination blocker');
  assertCondition(decision?.coversPrimaryNextAction?.status === 'completed_by_no_spend_decision_blocker_after_usage_check', 'three-profile decision did not complete by no-spend decision blocker');
  assertCondition(decision?.decision?.liveExecutionApproved === false, 'three-profile decision unexpectedly approves live execution');
  assertCondition(decision?.decision?.profileExecutionReleased === false, 'three-profile decision unexpectedly releases profile execution');
  assertCondition(decision?.decision?.madeNewPaidCall === false, 'three-profile decision unexpectedly records a paid call');
  assertCondition(decision?.decision?.usageCheckRun === true, 'three-profile decision must record the usage check');
  assertCondition(Array.isArray(decision?.preservedSourceImportLanes) && decision.preservedSourceImportLanes.length === 3, 'three-profile decision must preserve all three source/import lanes');
  assertCondition(decision?.claims?.provesP4217ResidualSourceTheorem === false, 'three-profile decision unexpectedly proves p4217 source theorem');
  assertCondition(decision?.claims?.provesSquareModuliUnionHittingUpperBound === false, 'three-profile decision unexpectedly proves square-moduli source theorem');
  assertCondition(decision?.claims?.provesMod50AllFutureRecurrence === false, 'three-profile decision unexpectedly proves mod-50 recurrence');
  assertCondition(decision?.claims?.provesAllN === false, 'three-profile decision unexpectedly proves all-N');
  assertCondition(decision?.claims?.decidesProblem848 === false, 'three-profile decision unexpectedly decides Problem 848');

  const progress = readJsonIfPresent(options.progressJson);
  const lanes = compactLanes(decision.preservedSourceImportLanes);
  const openCount = currentFrontierObligationCount(progress);

  return {
    schema: 'erdos.number_theory.p848_no_spend_all_n_recombination_blocker_after_three_profile_decision_packet/1',
    packetId: 'P848_NO_SPEND_ALL_N_RECOMBINATION_BLOCKER_AFTER_THREE_PROFILE_DECISION_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_all_n_recombination_blocker_after_three_profile_decision',
      decisionPacket: rel(options.decisionPacket),
      decisionPacketSha256: sha256File(options.decisionPacket),
    },
    recombinationBlocker: {
      status: 'all_n_recombination_blocked_by_three_profile_bound_source_import_theorem_gaps',
      mode: 'no_spend_recombination_boundary_after_source_import_decision',
      allSourceImportLanesProfileBound: true,
      providerExecutionReleased: false,
      madeNewPaidCall: false,
      usageCheckAlreadyRunInDecisionStep: decision.decision.usageCheckRun,
      openFrontierObligationCountAtInput: openCount,
      missingTheoremObjectCount: lanes.length,
      remainingTheoremObjects: lanes.map((lane) => lane.remainingSourceTheoremObject),
      recombinationFailureBoundary: 'All-N recombination remains unavailable until at least one source/import theorem lane is closed by local proof, future budget-guarded source audit with audited hypotheses/constants, finite partition, or decreasing invariant.',
      noSpendInstructionEffect: 'The prior decision recorded usage capacity but no provider execution was released because the current delegate instruction forbids spending.',
    },
    sourceImportLanes: lanes,
    localTheoremStatementBacklogSeed: {
      stepId: NEXT_ACTION,
      selectionRule: 'Do not open q-cover or fallback-selector expansion. State the three missing source theorem objects as local theorem statements, rank them by cheapest deterministic proof/source archaeology, and select one local proof probe.',
      initialPriorityOrder: [
        'mod50_generator_source_import',
        'square_moduli_union_hitting_source_import',
        'p4217_residual_source_import',
      ],
      expectedWriteback: 'Emit a local theorem-statement backlog packet, or a precise blocker if no local statement can be sharpened without a future budget-guarded source audit.',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    futureUnblockConditions: [
      'A local proof supplies the mod-50 all-future recurrence, finite-Q partition, or restored generator theorem.',
      'A local proof or future budget-guarded source audit supplies a Sawhney-compatible square-moduli union/hitting upper-bound theorem with audited direction, constants, threshold, and finite handoff.',
      'A local proof or future budget-guarded source audit supplies a p4217 residual finite CRT partition, decreasing rank, or squarefree-realization source theorem.',
      'A future instruction allows one prepared source/import profile to be released under the usage ledger, followed by an audited discovery packet before any proof promotion.',
    ],
    forbiddenMovesAfterRecombinationBlocker: [
      'claim_all_n_recombination_from_profile_bound_lanes',
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
      action: 'Prepare a no-spend local theorem-statement backlog that sharpens the three missing source/import theorem objects into one cheapest deterministic local proof probe.',
      finiteDenominatorOrRankToken: 'p848_no_spend_all_n_recombination_blocker_after_three_profile_decision',
      command: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet assembles the all-N recombination blocker after the three-profile source/import decision. It records that p4217 residual, square-moduli union/hitting, and mod-50 generator lanes remain open source/import theorem objects, all profile-bound or hard-blocked without provider execution. It does not import a source theorem, prove a finite partition or decreasing rank, lower a threshold, close all-N recombination, or decide Problem 848.',
    claims: {
      completesNoSpendAllNRecombinationBlocker: true,
      allThreeSourceImportLanesProfileBound: true,
      emitsAllNRecombinationBlocker: true,
      preservesNoSpendProviderGating: true,
      usageCheckAlreadyRunInDecisionStep: decision.decision.usageCheckRun,
      liveExecutionApproved: false,
      profileExecutionReleased: false,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      selectsLocalTheoremStatementBacklog: true,
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
    '# P848 no-spend all-N recombination blocker after three-profile decision',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Provider call made: \`${packet.recombinationBlocker.madeNewPaidCall}\``,
    `- Missing theorem objects: \`${packet.recombinationBlocker.missingTheoremObjectCount}\``,
    '',
    '## Recombination Blocker',
    '',
    packet.recombinationBlocker.recombinationFailureBoundary,
    '',
    packet.recombinationBlocker.noSpendInstructionEffect,
    '',
    '## Remaining Theorem Objects',
    '',
    ...packet.sourceImportLanes.map((lane) => `- \`${lane.laneId}\`: ${lane.remainingSourceTheoremObject}`),
    '',
    '## Local Backlog Seed',
    '',
    `- Step: \`${packet.localTheoremStatementBacklogSeed.stepId}\``,
    `- Selection rule: ${packet.localTheoremStatementBacklogSeed.selectionRule}`,
    `- Writeback: ${packet.localTheoremStatementBacklogSeed.expectedWriteback}`,
    '',
    '## Future Unblock Conditions',
    '',
    ...packet.futureUnblockConditions.map((condition) => `- ${condition}`),
    '',
    '## Forbidden Moves',
    '',
    ...packet.forbiddenMovesAfterRecombinationBlocker.map((move) => `- \`${move}\``),
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
