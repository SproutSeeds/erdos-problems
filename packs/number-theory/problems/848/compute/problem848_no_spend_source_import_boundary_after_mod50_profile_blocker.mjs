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

const DEFAULT_PREVIOUS_BOUNDARY_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_SQUARE_MODULI_PROFILE_BLOCKER_PACKET.json');
const DEFAULT_P4217_APPROVAL_BLOCKER_PACKET = path.join(frontierBridge, 'P848_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.json');
const DEFAULT_P4217_HARD_BLOCKER_PACKET = path.join(frontierBridge, 'P848_LOCAL_P4217_RESIDUAL_SOURCE_THEOREM_PROOF_ATTEMPT_HARD_BLOCKER_PACKET.json');
const DEFAULT_SQUARE_PROFILE_BLOCKER_PACKET = path.join(frontierBridge, 'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.json');
const DEFAULT_MOD50_PROFILE_BLOCKER_PACKET = path.join(frontierBridge, 'P848_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE_NO_SPEND_BLOCKER_PACKET.json');
const DEFAULT_PROGRESS_JSON = path.join(problemDir, 'PROGRESS.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_MOD50_PROFILE_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_MOD50_PROFILE_BLOCKER_PACKET.md');

const TARGET = 'assemble_p848_no_spend_source_import_boundary_after_mod50_profile_blocker';
const NEXT_ACTION = 'decide_p848_three_profile_source_import_with_budget_guard_or_emit_no_spend_blocker';
const STATUS = 'no_spend_source_import_boundary_assembled_after_mod50_profile_blocker';

function parseArgs(argv) {
  const options = {
    previousBoundaryPacket: DEFAULT_PREVIOUS_BOUNDARY_PACKET,
    p4217ApprovalBlockerPacket: DEFAULT_P4217_APPROVAL_BLOCKER_PACKET,
    p4217HardBlockerPacket: DEFAULT_P4217_HARD_BLOCKER_PACKET,
    squareProfileBlockerPacket: DEFAULT_SQUARE_PROFILE_BLOCKER_PACKET,
    mod50ProfileBlockerPacket: DEFAULT_MOD50_PROFILE_BLOCKER_PACKET,
    progressJson: DEFAULT_PROGRESS_JSON,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--previous-boundary-packet') {
      options.previousBoundaryPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p4217-approval-blocker-packet') {
      options.p4217ApprovalBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p4217-hard-blocker-packet') {
      options.p4217HardBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--square-profile-blocker-packet') {
      options.squareProfileBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--mod50-profile-blocker-packet') {
      options.mod50ProfileBlockerPacket = path.resolve(argv[index + 1]);
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

function buildDecisionQueue({ p4217ApprovalBlocker, p4217HardBlocker, squareProfileBlocker, mod50ProfileBlocker }) {
  return [
    {
      laneId: 'mod50_generator_source_import',
      status: 'profile_prepared_no_spend_blocked',
      priority: 1,
      profilePath: mod50ProfileBlocker.repairedSourceImportProfile?.path ?? null,
      profileId: mod50ProfileBlocker.repairedSourceImportProfile?.profileId ?? null,
      reason: 'Freshly repaired single-lane profile targets the mod-50 all-future recurrence, finite-Q partition, or original generator theorem and rejects finite replay overclaim.',
      liveReleaseCondition: 'Future budget-guarded source-audit decision may release this exact single-lane profile after usage ledger clearance.',
      proofBoundary: mod50ProfileBlocker.proofBoundary,
    },
    {
      laneId: 'square_moduli_union_hitting_source_import',
      status: 'profile_prepared_approval_blocked',
      priority: 2,
      profilePath: squareProfileBlocker.repairedSourceImportProfile?.path ?? null,
      profileId: squareProfileBlocker.repairedSourceImportProfile?.profileId ?? null,
      reason: 'Prepared profile targets the missing Sawhney-compatible union/hitting upper-bound theorem and rejects avoiding-side-only answers.',
      liveReleaseCondition: 'Future budget-guarded source-audit decision may release this profile if the analytic threshold route is selected.',
      proofBoundary: squareProfileBlocker.proofBoundary,
    },
    {
      laneId: 'p4217_residual_source_import',
      status: 'profile_prepared_approval_blocked_and_local_hard_blocked',
      priority: 3,
      profilePath: p4217ApprovalBlocker.preservedProfile?.profileFile ?? null,
      profileId: p4217ApprovalBlocker.preservedProfile?.profileId ?? null,
      reason: 'Prepared p4217 residual profile exists, but the immediate local proof attempt already hard-blocked finite CRT partition, decreasing rank, and squarefree-realization source theorem recovery.',
      liveReleaseCondition: 'Future budget-guarded source-audit decision may release this profile only if p4217 residuals become the selected source lane again.',
      proofBoundary: p4217HardBlocker.proofBoundary,
    },
  ];
}

function buildPacket(options) {
  const previousBoundary = readJson(options.previousBoundaryPacket);
  assertCondition(previousBoundary?.status === 'no_spend_source_import_boundary_assembled_after_square_moduli_profile_blocker', 'previous post-square boundary has unexpected status');
  assertCondition(previousBoundary?.target === 'assemble_p848_no_spend_source_import_boundary_after_square_moduli_profile_blocker', 'previous post-square boundary has unexpected target');
  assertCondition(previousBoundary?.recommendedNextAction === 'prepare_p848_mod50_generator_source_import_profile_or_no_spend_blocker_after_source_boundary', 'previous boundary does not route to the mod-50 profile step');
  assertCondition(previousBoundary?.claims?.selectsMod50AsNextSourceObject === true, 'previous boundary must select mod-50');
  assertCondition(previousBoundary?.claims?.madeNewPaidCall === false, 'previous boundary unexpectedly records a paid call');
  assertCondition(previousBoundary?.claims?.provesAllN === false, 'previous boundary unexpectedly proves all-N');

  const p4217ApprovalBlocker = readJson(options.p4217ApprovalBlockerPacket);
  assertCondition(p4217ApprovalBlocker?.status === 'p4217_residual_source_import_profile_approval_blocker_emitted_no_live_spend', 'p4217 approval blocker has unexpected status');
  assertCondition(p4217ApprovalBlocker?.approvalDecision?.profileExecutionApproved === false, 'p4217 approval blocker unexpectedly approves profile execution');
  assertCondition(p4217ApprovalBlocker?.claims?.madeNewPaidCall === false, 'p4217 approval blocker unexpectedly records a paid call');
  assertCondition(p4217ApprovalBlocker?.claims?.provesAllN === false, 'p4217 approval blocker unexpectedly proves all-N');

  const p4217HardBlocker = readJson(options.p4217HardBlockerPacket);
  assertCondition(p4217HardBlocker?.status === 'local_p4217_residual_source_theorem_proof_attempt_hard_blocker_emitted', 'p4217 hard blocker has unexpected status');
  assertCondition(p4217HardBlocker?.claims?.foundFiniteP4217Partition === false, 'p4217 hard blocker unexpectedly found a finite partition');
  assertCondition(p4217HardBlocker?.claims?.foundP4217ResidualRankDecrease === false, 'p4217 hard blocker unexpectedly found a rank decrease');
  assertCondition(p4217HardBlocker?.claims?.foundSquarefreeRealizationSourceTheorem === false, 'p4217 hard blocker unexpectedly found a source theorem');
  assertCondition(p4217HardBlocker?.claims?.provesAllN === false, 'p4217 hard blocker unexpectedly proves all-N');

  const squareProfileBlocker = readJson(options.squareProfileBlockerPacket);
  assertCondition(squareProfileBlocker?.status === 'square_moduli_union_hitting_source_import_profile_approval_blocker_emitted_no_live_spend', 'square-moduli profile blocker has unexpected status');
  assertCondition(squareProfileBlocker?.approvalDecision?.profileExecutionApproved === false, 'square-moduli profile blocker unexpectedly approves profile execution');
  assertCondition(squareProfileBlocker?.claims?.foundSawhneyCompatibleUnionHittingUpperBoundSource === false, 'square-moduli profile blocker unexpectedly finds a union/hitting source');
  assertCondition(squareProfileBlocker?.claims?.madeNewPaidCall === false, 'square-moduli profile blocker unexpectedly records a paid call');
  assertCondition(squareProfileBlocker?.claims?.provesAllN === false, 'square-moduli profile blocker unexpectedly proves all-N');

  const mod50ProfileBlocker = readJson(options.mod50ProfileBlockerPacket);
  assertCondition(mod50ProfileBlocker?.status === 'mod50_generator_source_import_profile_no_spend_blocker_emitted', 'mod-50 profile blocker has unexpected status');
  assertCondition(mod50ProfileBlocker?.target === 'prepare_p848_mod50_generator_source_import_profile_or_no_spend_blocker_after_source_boundary', 'mod-50 profile blocker has unexpected target');
  assertCondition(mod50ProfileBlocker?.recommendedNextAction === TARGET, 'mod-50 profile blocker does not route to this boundary');
  assertCondition(mod50ProfileBlocker?.approvalDecision?.profileExecutionApproved === false, 'mod-50 profile blocker unexpectedly approves profile execution');
  assertCondition(mod50ProfileBlocker?.claims?.madeNewPaidCall === false, 'mod-50 profile blocker unexpectedly records a paid call');
  assertCondition(mod50ProfileBlocker?.claims?.provesMod50AllFutureRecurrence === false, 'mod-50 profile blocker unexpectedly proves recurrence');
  assertCondition(mod50ProfileBlocker?.claims?.restoresOriginalGenerator === false, 'mod-50 profile blocker unexpectedly restores generator');
  assertCondition(mod50ProfileBlocker?.claims?.provesFiniteQPartition === false, 'mod-50 profile blocker unexpectedly proves finite-Q partition');
  assertCondition(mod50ProfileBlocker?.claims?.provesAllN === false, 'mod-50 profile blocker unexpectedly proves all-N');

  const progress = readJsonIfPresent(options.progressJson);
  const decisionQueue = buildDecisionQueue({
    p4217ApprovalBlocker,
    p4217HardBlocker,
    squareProfileBlocker,
    mod50ProfileBlocker,
  });

  return {
    schema: 'erdos.number_theory.p848_no_spend_source_import_boundary_after_mod50_profile_blocker_packet/1',
    packetId: 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_MOD50_PROFILE_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_source_import_boundary_after_mod50_profile_blocker',
      previousBoundaryPacket: rel(options.previousBoundaryPacket),
      previousBoundarySha256: sha256File(options.previousBoundaryPacket),
      p4217ApprovalBlockerPacket: rel(options.p4217ApprovalBlockerPacket),
      p4217ApprovalBlockerSha256: sha256File(options.p4217ApprovalBlockerPacket),
      p4217HardBlockerPacket: rel(options.p4217HardBlockerPacket),
      p4217HardBlockerSha256: sha256File(options.p4217HardBlockerPacket),
      squareProfileBlockerPacket: rel(options.squareProfileBlockerPacket),
      squareProfileBlockerSha256: sha256File(options.squareProfileBlockerPacket),
      mod50ProfileBlockerPacket: rel(options.mod50ProfileBlockerPacket),
      mod50ProfileBlockerSha256: sha256File(options.mod50ProfileBlockerPacket),
    },
    boundaryAssembly: {
      status: 'assembled_after_mod50_profile_blocker',
      mode: 'no_spend_source_import_recombination',
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      usageCheckRun: false,
      allNProofAvailable: false,
      finiteMeasureDecreased: false,
      openFrontierObligationCountAtInput: currentFrontierObligationCount(progress),
      sourceImportBoundaryShape: 'p4217_square_moduli_mod50_all_profile_or_hard_blocker_represented',
      assembledProfileOrBlockerCount: 3,
      selectedRoute: 'future_budget_guarded_decision_or_no_spend_blocker',
      assembledFromStatuses: {
        previousBoundary: previousBoundary.status,
        p4217ApprovalBlocker: p4217ApprovalBlocker.status,
        p4217HardBlocker: p4217HardBlocker.status,
        squareProfileBlocker: squareProfileBlocker.status,
        mod50ProfileBlocker: mod50ProfileBlocker.status,
      },
    },
    sourceImportDecisionQueue: decisionQueue,
    selectedNextDecision: {
      stepId: NEXT_ACTION,
      status: 'ready_without_live_execution',
      selectedLaneId: decisionQueue[0].laneId,
      selectedProfileId: decisionQueue[0].profileId,
      reason: 'All three source/import lanes now have profile or hard-blocker artifacts. The mod-50 profile is freshest and narrower than the failed broad mod-50 wedge, so it is the first candidate for any future budget-guarded source-audit decision; under current no-spend instructions this packet only records the decision boundary.',
      noSpendFallback: 'If a future step still forbids live/API spend, emit a no-spend all-source-import recombination blocker instead of executing a provider call.',
      firstCommandIfFutureLiveAllowed: './bin/erdos orp research usage --json',
      liveCommandTemplate: 'erdos orp research ask 848 --profile-file packs/number-theory/problems/848/ORP_RESEARCH_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE.json --question "<mod-50 generator/source theorem question>" --execute --allow-paid --json',
    },
    releaseConditions: [
      'A future instruction allows budget-guarded live source-import execution or explicitly asks for the no-spend blocker path.',
      './bin/erdos orp research usage --json reports remaining daily live-run count and USD budget before any provider execution.',
      'The selected live question names exactly one source theorem object and rejects bounded evidence as proof.',
      'Any answer is packetized as discovery only until hypotheses, constants, denominator/partition objects, and proof boundaries are audited.',
    ],
    forbiddenMovesAfterBoundaryAssembly: [
      'execute_provider_source_import_under_current_no_spend_instruction',
      'run_erdos_orp_research_execute_allow_paid_before_usage_check',
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
      action: 'Decide whether to release exactly one prepared source/import profile under the local budget guard, or emit a no-spend recombination blocker if live execution remains disallowed.',
      finiteDenominatorOrRankToken: 'p848_no_spend_source_import_boundary_after_mod50_profile_blocker',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet assembles the no-spend source/import boundary after the mod-50 profile blocker. It records that p4217, square-moduli, and mod-50 source lanes are now all represented by explicit profile or hard-blocker artifacts, selects the mod-50 profile as the first future budget-guarded source-audit candidate, and preserves a no-spend blocker fallback. It does not run usage, call a provider, prove any source theorem, lower any threshold, recombine all-N, or decide Problem 848.',
    claims: {
      completesSourceImportBoundaryAfterMod50ProfileBlocker: true,
      allThreeSourceLanesRepresentedByProfileOrHardBlocker: true,
      selectsMod50AsFirstFutureBudgetGuardedCandidate: true,
      preservesNoSpendFallback: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      usageCheckRun: false,
      blocksLiveSpendThisTurn: true,
      requiresFutureUsageCheckBeforeSpend: true,
      respectsNoPaidByDefault: true,
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
    '# P848 no-spend source/import boundary after mod-50 profile blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Selected future candidate: \`${packet.selectedNextDecision.selectedLaneId}\``,
    `- Paid/API call made: \`${packet.boundaryAssembly.madeNewPaidCall}\``,
    `- Usage check run: \`${packet.boundaryAssembly.usageCheckRun}\``,
    '',
    '## Boundary Shape',
    '',
    packet.boundaryAssembly.sourceImportBoundaryShape,
    '',
    '## Source/Import Decision Queue',
    '',
    ...packet.sourceImportDecisionQueue.map((lane) => [
      `- \`${lane.laneId}\` (${lane.status}, priority ${lane.priority})`,
      `  - Profile: \`${lane.profileId ?? '(none)'}\``,
      `  - Reason: ${lane.reason}`,
    ].join('\n')),
    '',
    '## Selected Next Decision',
    '',
    `${packet.selectedNextDecision.reason}`,
    '',
    `No-spend fallback: ${packet.selectedNextDecision.noSpendFallback}`,
    '',
    '## Release Conditions',
    '',
    ...packet.releaseConditions.map((condition) => `- ${condition}`),
    '',
    '## Forbidden Moves',
    '',
    ...packet.forbiddenMovesAfterBoundaryAssembly.map((move) => `- \`${move}\``),
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
