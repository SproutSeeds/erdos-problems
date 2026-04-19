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

const DEFAULT_MOD50_LOCAL_GAP_PACKET = path.join(frontierBridge, 'P848_MOD50_GENERATOR_THEOREM_STATEMENT_LOCAL_PROOF_GAP_AFTER_ALL_N_RECOMBINATION_BLOCKER_PACKET.json');
const DEFAULT_ALL_N_RECOMBINATION_BLOCKER_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_ALL_N_RECOMBINATION_BLOCKER_AFTER_THREE_PROFILE_DECISION_PACKET.json');
const DEFAULT_THREE_PROFILE_DECISION_BLOCKER_PACKET = path.join(frontierBridge, 'P848_THREE_PROFILE_SOURCE_IMPORT_NO_SPEND_DECISION_BLOCKER_PACKET.json');
const DEFAULT_MOD50_PROFILE_BLOCKER_PACKET = path.join(frontierBridge, 'P848_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE_NO_SPEND_BLOCKER_PACKET.json');
const DEFAULT_SQUARE_PROFILE_BLOCKER_PACKET = path.join(frontierBridge, 'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.json');
const DEFAULT_P4217_APPROVAL_BLOCKER_PACKET = path.join(frontierBridge, 'P848_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.json');
const DEFAULT_P4217_HARD_BLOCKER_PACKET = path.join(frontierBridge, 'P848_LOCAL_P4217_RESIDUAL_SOURCE_THEOREM_PROOF_ATTEMPT_HARD_BLOCKER_PACKET.json');
const DEFAULT_PROGRESS_JSON = path.join(problemDir, 'PROGRESS.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_MOD50_LOCAL_STATEMENT_GAP_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_MOD50_LOCAL_STATEMENT_GAP_PACKET.md');

const TARGET = 'assemble_p848_no_spend_source_import_boundary_after_mod50_local_statement_gap';
const NEXT_ACTION = 'emit_p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap';
const STATUS = 'no_spend_source_import_boundary_assembled_after_mod50_local_statement_gap';

function parseArgs(argv) {
  const options = {
    mod50LocalGapPacket: DEFAULT_MOD50_LOCAL_GAP_PACKET,
    allNRecombinationBlockerPacket: DEFAULT_ALL_N_RECOMBINATION_BLOCKER_PACKET,
    threeProfileDecisionBlockerPacket: DEFAULT_THREE_PROFILE_DECISION_BLOCKER_PACKET,
    mod50ProfileBlockerPacket: DEFAULT_MOD50_PROFILE_BLOCKER_PACKET,
    squareProfileBlockerPacket: DEFAULT_SQUARE_PROFILE_BLOCKER_PACKET,
    p4217ApprovalBlockerPacket: DEFAULT_P4217_APPROVAL_BLOCKER_PACKET,
    p4217HardBlockerPacket: DEFAULT_P4217_HARD_BLOCKER_PACKET,
    progressJson: DEFAULT_PROGRESS_JSON,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--mod50-local-gap-packet') {
      options.mod50LocalGapPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--all-n-recombination-blocker-packet') {
      options.allNRecombinationBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--three-profile-decision-blocker-packet') {
      options.threeProfileDecisionBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--mod50-profile-blocker-packet') {
      options.mod50ProfileBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--square-profile-blocker-packet') {
      options.squareProfileBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p4217-approval-blocker-packet') {
      options.p4217ApprovalBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p4217-hard-blocker-packet') {
      options.p4217HardBlockerPacket = path.resolve(argv[index + 1]);
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

function buildRemainingSourceImportLanes({
  mod50LocalGap,
  mod50ProfileBlocker,
  squareProfileBlocker,
  p4217ApprovalBlocker,
  p4217HardBlocker,
}) {
  return [
    {
      laneId: 'mod50_generator_source_import',
      status: 'profile_preserved_local_statement_gap_emitted',
      priority: 1,
      profileId: mod50ProfileBlocker.repairedSourceImportProfile?.profileId ?? mod50LocalGap.blockerDecision?.selectedFutureSourceAuditCandidate ?? null,
      profilePath: mod50ProfileBlocker.repairedSourceImportProfile?.path ?? null,
      localGapPacketStatus: mod50LocalGap.status,
      remainingSourceTheoremObject: mod50LocalGap.missingTheoremStatement?.exactMissingStatement ?? 'mod-50 all-future relevant-pair recurrence, finite-Q partition, or restored original generator theorem',
      latestLocalVerdict: mod50LocalGap.localProofAttempt?.result ?? null,
      liveReleaseCondition: 'Future budget-guarded source audit may release this exact single-lane profile only after usage-ledger clearance and an instruction that permits spend.',
      proofBoundary: mod50LocalGap.proofBoundary,
    },
    {
      laneId: 'square_moduli_union_hitting_source_import',
      status: 'profile_prepared_approval_blocked',
      priority: 2,
      profileId: squareProfileBlocker.repairedSourceImportProfile?.profileId ?? null,
      profilePath: squareProfileBlocker.repairedSourceImportProfile?.path ?? null,
      remainingSourceTheoremObject: 'Sawhney-compatible square-moduli union/hitting upper-bound source theorem with audited direction, hypotheses, constants, and finite threshold handoff',
      latestLocalVerdict: 'local source-index audit found no promotable union/hitting source theorem; avoiding-side evidence is not enough',
      liveReleaseCondition: 'Future budget-guarded source audit may release this profile if the analytic threshold lane is selected and spending is explicitly allowed.',
      proofBoundary: squareProfileBlocker.proofBoundary,
    },
    {
      laneId: 'p4217_residual_source_import',
      status: 'profile_prepared_approval_blocked_and_local_hard_blocked',
      priority: 3,
      profileId: p4217ApprovalBlocker.preservedProfile?.profileId ?? null,
      profilePath: p4217ApprovalBlocker.preservedProfile?.profileFile ?? null,
      remainingSourceTheoremObject: 'p4217 residual finite CRT partition, decreasing rank, or squarefree-realization source theorem',
      latestLocalVerdict: 'local proof attempt found no finite complete CRT partition, well-founded residual rank, or squarefree-realization source theorem',
      liveReleaseCondition: 'Future budget-guarded source audit may release this profile only if p4217 residuals become the selected source lane again and spending is explicitly allowed.',
      proofBoundary: p4217HardBlocker.proofBoundary,
    },
  ];
}

function buildPacket(options) {
  const mod50LocalGap = readJson(options.mod50LocalGapPacket);
  assertCondition(mod50LocalGap?.status === 'mod50_generator_theorem_statement_local_proof_gap_after_all_n_recombination_blocker_emitted', 'mod-50 local statement gap has unexpected status');
  assertCondition(mod50LocalGap?.target === 'attempt_p848_mod50_generator_theorem_statement_local_proof_or_emit_gap_after_all_n_recombination_blocker', 'mod-50 local statement gap has unexpected target');
  assertCondition(mod50LocalGap?.recommendedNextAction === TARGET, 'mod-50 local statement gap does not route to this boundary');
  assertCondition(mod50LocalGap?.localProofAttempt?.madeNewPaidCall === false, 'mod-50 local statement gap unexpectedly records a paid call');
  assertCondition(mod50LocalGap?.localProofAttempt?.providerExecutionReleased === false, 'mod-50 local statement gap unexpectedly releases provider execution');
  assertCondition(mod50LocalGap?.theoremForkVerdict?.restoredOriginalGeneratorTheorem?.found === false, 'mod-50 local statement gap unexpectedly restores generator');
  assertCondition(mod50LocalGap?.theoremForkVerdict?.symbolicAllFutureRelevantPairRecurrence?.found === false, 'mod-50 local statement gap unexpectedly proves recurrence');
  assertCondition(mod50LocalGap?.theoremForkVerdict?.finiteQPartition?.found === false, 'mod-50 local statement gap unexpectedly proves finite-Q partition');
  assertCondition(mod50LocalGap?.claims?.provesAllN === false, 'mod-50 local statement gap unexpectedly proves all-N');

  const allNRecombinationBlocker = readJson(options.allNRecombinationBlockerPacket);
  assertCondition(allNRecombinationBlocker?.status === 'no_spend_all_n_recombination_blocker_after_three_profile_decision_emitted', 'all-N recombination blocker has unexpected status');
  assertCondition(allNRecombinationBlocker?.claims?.allThreeSourceImportLanesProfileBound === true, 'all-N recombination blocker must preserve all source lanes');
  assertCondition(allNRecombinationBlocker?.claims?.madeNewPaidCall === false, 'all-N recombination blocker unexpectedly records a paid call');
  assertCondition(allNRecombinationBlocker?.claims?.provesAllN === false, 'all-N recombination blocker unexpectedly proves all-N');

  const threeProfileDecisionBlocker = readJson(options.threeProfileDecisionBlockerPacket);
  assertCondition(threeProfileDecisionBlocker?.status === 'three_profile_source_import_no_spend_decision_blocker_emitted', 'three-profile decision blocker has unexpected status');
  assertCondition(threeProfileDecisionBlocker?.decision?.liveExecutionApproved === false, 'three-profile decision unexpectedly approves live execution');
  assertCondition(threeProfileDecisionBlocker?.decision?.madeNewPaidCall === false, 'three-profile decision unexpectedly records a paid call');

  const mod50ProfileBlocker = readJson(options.mod50ProfileBlockerPacket);
  assertCondition(mod50ProfileBlocker?.status === 'mod50_generator_source_import_profile_no_spend_blocker_emitted', 'mod-50 profile blocker has unexpected status');
  assertCondition(mod50ProfileBlocker?.approvalDecision?.profileExecutionApproved === false, 'mod-50 profile blocker unexpectedly approves profile execution');
  assertCondition(mod50ProfileBlocker?.claims?.provesMod50AllFutureRecurrence === false, 'mod-50 profile blocker unexpectedly proves recurrence');
  assertCondition(mod50ProfileBlocker?.claims?.provesFiniteQPartition === false, 'mod-50 profile blocker unexpectedly proves finite-Q partition');

  const squareProfileBlocker = readJson(options.squareProfileBlockerPacket);
  assertCondition(squareProfileBlocker?.status === 'square_moduli_union_hitting_source_import_profile_approval_blocker_emitted_no_live_spend', 'square-moduli profile blocker has unexpected status');
  assertCondition(squareProfileBlocker?.approvalDecision?.profileExecutionApproved === false, 'square-moduli profile blocker unexpectedly approves execution');
  assertCondition(squareProfileBlocker?.claims?.foundSawhneyCompatibleUnionHittingUpperBoundSource === false, 'square-moduli profile blocker unexpectedly finds a union/hitting source');

  const p4217ApprovalBlocker = readJson(options.p4217ApprovalBlockerPacket);
  assertCondition(p4217ApprovalBlocker?.status === 'p4217_residual_source_import_profile_approval_blocker_emitted_no_live_spend', 'p4217 approval blocker has unexpected status');
  assertCondition(p4217ApprovalBlocker?.approvalDecision?.profileExecutionApproved === false, 'p4217 approval blocker unexpectedly approves execution');

  const p4217HardBlocker = readJson(options.p4217HardBlockerPacket);
  assertCondition(p4217HardBlocker?.status === 'local_p4217_residual_source_theorem_proof_attempt_hard_blocker_emitted', 'p4217 hard blocker has unexpected status');
  assertCondition(p4217HardBlocker?.claims?.foundFiniteP4217Partition === false, 'p4217 hard blocker unexpectedly found a finite partition');
  assertCondition(p4217HardBlocker?.claims?.foundP4217ResidualRankDecrease === false, 'p4217 hard blocker unexpectedly found a rank decrease');
  assertCondition(p4217HardBlocker?.claims?.foundSquarefreeRealizationSourceTheorem === false, 'p4217 hard blocker unexpectedly found a source theorem');

  const progress = readJsonIfPresent(options.progressJson);
  const remainingSourceImportLanes = buildRemainingSourceImportLanes({
    mod50LocalGap,
    mod50ProfileBlocker,
    squareProfileBlocker,
    p4217ApprovalBlocker,
    p4217HardBlocker,
  });

  return {
    schema: 'erdos.number_theory.p848_no_spend_source_import_boundary_after_mod50_local_statement_gap_packet/1',
    packetId: 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_MOD50_LOCAL_STATEMENT_GAP_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_source_import_boundary_after_mod50_local_statement_gap',
      mod50LocalGapPacket: rel(options.mod50LocalGapPacket),
      mod50LocalGapSha256: sha256File(options.mod50LocalGapPacket),
      allNRecombinationBlockerPacket: rel(options.allNRecombinationBlockerPacket),
      allNRecombinationBlockerSha256: sha256File(options.allNRecombinationBlockerPacket),
      threeProfileDecisionBlockerPacket: rel(options.threeProfileDecisionBlockerPacket),
      threeProfileDecisionBlockerSha256: sha256File(options.threeProfileDecisionBlockerPacket),
      mod50ProfileBlockerPacket: rel(options.mod50ProfileBlockerPacket),
      mod50ProfileBlockerSha256: sha256File(options.mod50ProfileBlockerPacket),
      squareProfileBlockerPacket: rel(options.squareProfileBlockerPacket),
      squareProfileBlockerSha256: sha256File(options.squareProfileBlockerPacket),
      p4217ApprovalBlockerPacket: rel(options.p4217ApprovalBlockerPacket),
      p4217ApprovalBlockerSha256: sha256File(options.p4217ApprovalBlockerPacket),
      p4217HardBlockerPacket: rel(options.p4217HardBlockerPacket),
      p4217HardBlockerSha256: sha256File(options.p4217HardBlockerPacket),
    },
    boundaryAssembly: {
      status: 'assembled_after_mod50_local_statement_gap',
      mode: 'no_spend_source_import_boundary_after_local_theorem_gap',
      madeNewPaidCall: false,
      usageCheckRun: false,
      currentStepAllowsPaidCall: false,
      providerExecutionReleased: false,
      allNProofAvailable: false,
      finiteMeasureDecreased: false,
      openFrontierObligationCountAtInput: currentFrontierObligationCount(progress),
      sourceImportBoundaryShape: 'three_source_import_lanes_blocked_after_mod50_local_statement_gap',
      missingTheoremObjectCount: 3,
      selectedRoute: 'no_spend_hard_blocker_or_future_guarded_audit_release',
      mod50LaneUpgrade: 'profile_prepared_to_local_statement_gap_emitted',
      assembledFromStatuses: {
        mod50LocalGap: mod50LocalGap.status,
        allNRecombinationBlocker: allNRecombinationBlocker.status,
        threeProfileDecisionBlocker: threeProfileDecisionBlocker.status,
        mod50ProfileBlocker: mod50ProfileBlocker.status,
        squareProfileBlocker: squareProfileBlocker.status,
        p4217ApprovalBlocker: p4217ApprovalBlocker.status,
        p4217HardBlocker: p4217HardBlocker.status,
      },
    },
    remainingSourceImportLanes,
    selectedNextBoundary: {
      stepId: NEXT_ACTION,
      status: 'ready_under_current_no_spend_instruction',
      reason: 'The selected no-spend mod-50 local theorem-statement attempt found no repo-owned all-future recurrence, finite-Q partition, or restored generator theorem. Since p4217 and square-moduli were already profile/hard-blocked and the current instruction still forbids spending, the next durable move is a no-spend source-import hard blocker rather than another local finite frontier expansion or provider call.',
      futureGuardedAuditCandidate: 'p848-mod50-generator-source-import-single',
      noSpendFallback: 'Emit a hard blocker that the all-N recombination surface has no currently available no-spend source/import closure lane.',
    },
    releaseConditions: [
      'A repo-owned theorem is added for the mod-50 all-future recurrence, finite-Q partition, or restored generator source.',
      'A repo-owned theorem is added for the Sawhney-compatible square-moduli union/hitting upper-bound source.',
      'A repo-owned theorem is added for the p4217 residual finite CRT partition, decreasing rank, or squarefree-realization source theorem.',
      'A future instruction explicitly permits a budget-guarded ORP/OpenAI source audit and ./bin/erdos orp research usage --json clears the daily run/USD guard before any provider execution.',
    ],
    forbiddenMovesAfterBoundaryAssembly: [
      'execute_provider_source_import_under_current_no_spend_instruction',
      'run_erdos_orp_research_execute_allow_paid_this_turn',
      'rerun_the_same_broad_mod50_or_p4217_wedge_by_default',
      'treat_finite_mod50_replay_as_all_future_recurrence',
      'launch_40501_plus_rollout_from_finite_replay',
      'promote_tao_van_doorn_avoiding_bound_to_union_hitting_bound',
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'try_fallback_selectors_one_by_one',
      'emit_a_naked_deterministic_rank_boundary',
      'claim_all_n_recombination_from_profile_bound_or_local_gap_lanes',
      'treat_bounded_finite_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Emit a no-spend source/import hard blocker after the mod-50 local statement gap, unless a new local theorem is added before the next refresh.',
      finiteDenominatorOrRankToken: 'p848_no_spend_source_import_boundary_after_mod50_local_statement_gap',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet assembles the no-spend source/import boundary after the mod-50 local theorem-statement gap. It records that the mod-50 lane now has both a preserved source-import profile and a local gap proving no current repo-owned all-future recurrence, finite-Q partition, or restored generator theorem was found; p4217 and square-moduli remain profile/hard-blocked. It does not execute a provider call, prove any source theorem, lower a threshold, recombine all-N, or decide Problem 848.',
    claims: {
      completesNoSpendSourceImportBoundaryAfterMod50LocalStatementGap: true,
      upgradesMod50LaneToLocalStatementGap: true,
      allThreeSourceImportLanesRemainBlocked: true,
      preservesNoSpendProviderGating: true,
      preservesFutureGuardedMod50AuditCandidate: true,
      selectsNoSpendSourceImportHardBlockerNext: true,
      madeNewPaidCall: false,
      usageCheckRun: false,
      currentStepAllowsPaidCall: false,
      providerExecutionReleased: false,
      blocksLiveSpendThisTurn: true,
      requiresFutureUsageCheckBeforeSpend: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      blocksFiniteReplayAsAllFuture: true,
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
    '# P848 no-spend source/import boundary after mod-50 local statement gap',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Missing theorem objects: \`${packet.boundaryAssembly.missingTheoremObjectCount}\``,
    `- Paid/API call made: \`${packet.boundaryAssembly.madeNewPaidCall}\``,
    '',
    '## Boundary Shape',
    '',
    packet.boundaryAssembly.sourceImportBoundaryShape,
    '',
    '## Remaining Source/Import Lanes',
    '',
    ...packet.remainingSourceImportLanes.map((lane) => [
      `- \`${lane.laneId}\` (${lane.status}, priority ${lane.priority})`,
      `  - Profile: \`${lane.profileId ?? '(none)'}\``,
      `  - Missing theorem: ${lane.remainingSourceTheoremObject}`,
      `  - Latest local verdict: ${lane.latestLocalVerdict}`,
    ].join('\n')),
    '',
    '## Selected Next Boundary',
    '',
    packet.selectedNextBoundary.reason,
    '',
    `No-spend fallback: ${packet.selectedNextBoundary.noSpendFallback}`,
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
