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

const DEFAULT_HARD_BLOCKER_PACKET = path.join(frontierBridge, 'P848_LOCAL_P4217_RESIDUAL_SOURCE_THEOREM_PROOF_ATTEMPT_HARD_BLOCKER_PACKET.json');
const DEFAULT_ALL_N_SOURCE_GAP_PACKET = path.join(frontierBridge, 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_SOURCE_IMPORT_SEARCH_GAP_PACKET.json');
const DEFAULT_REPAIRED_PROFILE_PACKET = path.join(frontierBridge, 'P848_REPAIRED_SINGLE_LANE_SOURCE_IMPORT_PROFILE_AFTER_NO_SPEND_GAP_PACKET.json');
const DEFAULT_APPROVAL_BLOCKER_PACKET = path.join(frontierBridge, 'P848_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_LOCAL_P4217_HARD_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_LOCAL_P4217_HARD_BLOCKER_PACKET.md');
const DEFAULT_PROGRESS_JSON = path.join(problemDir, 'PROGRESS.json');

const TARGET = 'assemble_p848_no_spend_source_import_boundary_after_local_p4217_hard_blocker';
const NEXT_ACTION = 'prepare_p848_no_spend_local_theorem_backlog_after_source_import_boundary';
const STATUS = 'no_spend_source_import_boundary_assembled_after_local_p4217_hard_blocker';

function parseArgs(argv) {
  const options = {
    hardBlockerPacket: DEFAULT_HARD_BLOCKER_PACKET,
    allNSourceGapPacket: DEFAULT_ALL_N_SOURCE_GAP_PACKET,
    repairedProfilePacket: DEFAULT_REPAIRED_PROFILE_PACKET,
    approvalBlockerPacket: DEFAULT_APPROVAL_BLOCKER_PACKET,
    progressJson: DEFAULT_PROGRESS_JSON,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--hard-blocker-packet') {
      options.hardBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--all-n-source-gap-packet') {
      options.allNSourceGapPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--repaired-profile-packet') {
      options.repairedProfilePacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--approval-blocker-packet') {
      options.approvalBlockerPacket = path.resolve(argv[index + 1]);
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

function buildRemainingTheoremObjects(allNSourceGap) {
  const atoms = Array.isArray(allNSourceGap?.remainingTheoremAtoms)
    ? allNSourceGap.remainingTheoremAtoms
    : [];
  const byLane = new Map(atoms.map((atom) => [atom.laneId, atom]));

  return [
    {
      objectId: 'p4217_residual_squarefree_realization_source',
      status: 'locally_hard_blocked_pending_repo_theorem_or_future_guarded_source_import',
      neededTheorem: byLane.get('p4217_residual_squarefree_realization_source')?.neededTheorem
        ?? 'A p4217 residual finite complete CRT partition, well-founded decreasing rank/invariant, or squarefree-realization theorem for every locally admissible residual CRT/arithmetic-progression/linear-family instance.',
      currentBoundary: 'The p4217 residual fork reduction, repaired profile, approval blocker, and local proof attempt found no finite CRT partition, decreasing rank, or squarefree-realization theorem in current repo sources.',
      releaseConditions: [
        'A repo-owned finite complete CRT partition closes every p4217 residual cell.',
        'A repo-owned well-founded residual rank strictly decreases on every residual transition.',
        'A local or imported squarefree-realization theorem supplies audited hypotheses and constants for every locally admissible p4217 residual family.',
        'A future explicit instruction releases the prepared p4217 single-lane source-import profile under the local usage/budget guard, followed by an audited source packet.',
      ],
      blockingPackets: [
        'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET.json',
        'P848_REPAIRED_SINGLE_LANE_SOURCE_IMPORT_PROFILE_AFTER_NO_SPEND_GAP_PACKET.json',
        'P848_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.json',
        'P848_LOCAL_P4217_RESIDUAL_SOURCE_THEOREM_PROOF_ATTEMPT_HARD_BLOCKER_PACKET.json',
      ],
    },
    {
      objectId: 'mod50_all_future_recurrence_or_generator',
      status: 'source_theorem_gap_open_after_no_spend_search',
      neededTheorem: byLane.get('mod50_all_future_recurrence_or_generator')?.neededTheorem
        ?? 'A mod-50 all-future relevant-pair recurrence, finite-Q partition, or restored original family-menu generator theorem covering every future relevant-pair row.',
      currentBoundary: 'The mod-50 source blocker, archaeology packet, theorem-wedge blocker, and no-spend source search found finite replay evidence but no all-future recurrence/generator theorem.',
      releaseConditions: [
        'Recover the original generator/source theorem and replay its hypotheses against current artifacts.',
        'Prove a finite-Q partition or recurrence for all future mod-50 relevant-pair rows.',
        'Use a future guarded source-import profile only if it names a concrete generator/source target sharper than the failed broad wedge.',
      ],
      blockingPackets: [
        'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json',
        'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
        'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET.json',
      ],
    },
    {
      objectId: 'square_moduli_union_hitting_threshold_source',
      status: 'import_source_gap_open_after_direction_audit',
      neededTheorem: byLane.get('square_moduli_union_hitting_threshold')?.neededTheorem
        ?? 'A square-moduli union/hitting upper-bound theorem with Sawhney-compatible hypotheses, inequality direction, constants, and threshold.',
      currentBoundary: 'The Tao-van-Doorn shortcut remains directionally insufficient under current repo sources: it upper-bounds avoiding sets, while Sawhney Lemma 2.1 and Lemma 2.2 need union/hitting upper bounds.',
      releaseConditions: [
        'Import or prove a square-moduli union/hitting upper-bound theorem with the correct inequality direction.',
        'Audit constants and hypotheses against the Sawhney exact-verifier usage before naming any N0.',
        'Do not reuse Tao-van-Doorn avoiding-side bounds as a union/hitting upper bound without a new theorem.',
      ],
      blockingPackets: [
        'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json',
        'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json',
        'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET.json',
      ],
    },
  ];
}

function buildPacket(options) {
  const hardBlocker = readJson(options.hardBlockerPacket);
  assertCondition(hardBlocker?.status === 'local_p4217_residual_source_theorem_proof_attempt_hard_blocker_emitted', 'hard blocker packet has unexpected status');
  assertCondition(hardBlocker?.target === 'prepare_p848_local_p4217_residual_source_theorem_proof_attempt_or_emit_hard_blocker', 'hard blocker packet has unexpected target');
  assertCondition(hardBlocker?.recommendedNextAction === TARGET, 'hard blocker does not route to this boundary assembly');
  assertCondition(hardBlocker?.claims?.madeNewPaidCall === false, 'hard blocker unexpectedly records a paid call');
  assertCondition(hardBlocker?.claims?.foundFiniteP4217Partition === false, 'hard blocker unexpectedly found a finite p4217 partition');
  assertCondition(hardBlocker?.claims?.foundP4217ResidualRankDecrease === false, 'hard blocker unexpectedly found a p4217 rank decrease');
  assertCondition(hardBlocker?.claims?.foundSquarefreeRealizationSourceTheorem === false, 'hard blocker unexpectedly found a squarefree-realization theorem');
  assertCondition(hardBlocker?.claims?.provesAllN === false, 'hard blocker unexpectedly proves all-N');

  const allNSourceGap = readJson(options.allNSourceGapPacket);
  assertCondition(allNSourceGap?.status === 'all_n_recombination_residual_assembled_after_source_import_search_gap', 'post-source-search all-N packet has unexpected status');
  assertCondition(Array.isArray(allNSourceGap?.remainingTheoremAtoms) && allNSourceGap.remainingTheoremAtoms.length === 3, 'post-source-search all-N packet must name exactly three theorem atoms');
  assertCondition(allNSourceGap?.claims?.madeNewPaidCall === false, 'post-source-search all-N packet unexpectedly records a paid call');
  assertCondition(allNSourceGap?.claims?.provesAllN === false, 'post-source-search all-N packet unexpectedly proves all-N');

  const repairedProfile = readJson(options.repairedProfilePacket);
  assertCondition(repairedProfile?.status === 'repaired_single_lane_source_import_profile_prepared_after_no_spend_gap', 'repaired profile packet has unexpected status');
  assertCondition(repairedProfile?.selectedLane?.laneId === 'p4217_residual_squarefree_realization_source', 'repaired profile must preserve the p4217 residual lane');
  assertCondition(repairedProfile?.claims?.madeNewPaidCall === false, 'repaired profile unexpectedly records a paid call');

  const approvalBlocker = readJson(options.approvalBlockerPacket);
  assertCondition(approvalBlocker?.status === 'p4217_residual_source_import_profile_approval_blocker_emitted_no_live_spend', 'approval blocker packet has unexpected status');
  assertCondition(approvalBlocker?.approvalDecision?.profileExecutionApproved === false, 'approval blocker unexpectedly approves profile execution');
  assertCondition(approvalBlocker?.claims?.madeNewPaidCall === false, 'approval blocker unexpectedly records a paid call');

  const progress = readJsonIfPresent(options.progressJson);
  const remainingTheoremObjects = buildRemainingTheoremObjects(allNSourceGap);

  return {
    schema: 'erdos.number_theory.p848_no_spend_source_import_boundary_after_local_p4217_hard_blocker_packet/1',
    packetId: 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_LOCAL_P4217_HARD_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_source_import_boundary_after_local_p4217_hard_blocker',
      hardBlockerPacket: rel(options.hardBlockerPacket),
      hardBlockerSha256: sha256File(options.hardBlockerPacket),
      allNSourceGapPacket: rel(options.allNSourceGapPacket),
      allNSourceGapSha256: sha256File(options.allNSourceGapPacket),
      repairedProfilePacket: rel(options.repairedProfilePacket),
      repairedProfileSha256: sha256File(options.repairedProfilePacket),
      approvalBlockerPacket: rel(options.approvalBlockerPacket),
      approvalBlockerSha256: sha256File(options.approvalBlockerPacket),
    },
    boundaryAssembly: {
      status: 'assembled_no_spend_source_import_boundary',
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      allNProofAvailable: false,
      finiteMeasureDecreased: false,
      openFrontierObligationCountAtInput: currentFrontierObligationCount(progress),
      sourceImportBoundaryShape: 'three_remaining_theorem_objects_plus_guarded_release_conditions',
      assembledFromStatuses: {
        p4217LocalHardBlocker: hardBlocker.status,
        postSourceSearchAllNResidual: allNSourceGap.status,
        repairedSingleLaneProfile: repairedProfile.status,
        profileApprovalBlocker: approvalBlocker.status,
      },
    },
    remainingTheoremObjects,
    releaseConditionSummary: {
      localRelease: [
        'Prove the p4217 residual finite CRT partition, residual rank decrease, or squarefree-realization theorem locally.',
        'Recover/prove the mod-50 all-future recurrence, finite-Q partition, or original generator theorem locally.',
        'Prove or import, with audited hypotheses and constants, the square-moduli union/hitting upper-bound theorem.',
      ],
      futureGuardedSourceImportRelease: [
        'A future explicit instruction permits a live source/import execution.',
        'The local ORP/OpenAI usage ledger has remaining run count and USD budget.',
        'The live question names exactly one theorem object or source target and is sharper than the failed broad wedges.',
        'Any source/import answer is packetized with proof boundaries before promotion.',
      ],
      stillForbiddenThisTurn: [
        'provider_execution',
        'q_cover_expansion',
        'q193_or_q197_singleton_descent',
        'single_fallback_selector_ladder',
        'naked_rank_boundary_without_new_measure',
        'bounded_evidence_promoted_to_all_N',
      ],
    },
    localTheoremBacklogSeed: {
      nextStepId: NEXT_ACTION,
      status: 'ready_for_no_spend_local_backlog_preparation',
      backlogPurpose: 'Select the next theorem object that can be attacked without provider execution, while preserving that the prepared p4217 profile remains approval-blocked.',
      candidateBacklogItems: [
        {
          itemId: 'p4217_residual_partition_rank_or_squarefree_source_local_backlog',
          allowedWork: 'definitions, finite CRT shape audit, rank-candidate falsification, or exact local theorem statement only',
          forbiddenWork: 'fallback selector ladder or q-cover expansion',
        },
        {
          itemId: 'mod50_generator_or_recurrence_local_backlog',
          allowedWork: 'local generator/source archaeology, finite-Q denominator audit, or recurrence theorem statement',
          forbiddenWork: 'finite replay overclaim',
        },
        {
          itemId: 'square_moduli_union_hitting_local_backlog',
          allowedWork: 'source-index audit or theorem statement for the missing union/hitting direction and constants',
          forbiddenWork: 'threshold claim before a valid theorem source',
        },
      ],
    },
    forbiddenMovesAfterBoundaryAssembly: [
      'execute_the_repaired_p4217_profile_without_future_guarded_approval',
      'run_erdos_orp_research_execute_allow_paid_this_turn',
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'emit_a_naked_deterministic_rank_boundary',
      'try_fallback_selectors_one_by_one',
      'rerun_the_same_p4217_paid_wedge_by_default',
      'rerun_the_same_mod50_paid_wedge_by_default',
      'claim_tao_van_doorn_plus_exact_verifier_decides_848_without_union_hitting_source',
      'claim_N0_around_1e6_or_N0_at_most_40500_without_imported_threshold_source',
      'treat_bounded_finite_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Prepare a no-spend local theorem backlog after the source/import boundary, selecting only proof/search work that can run without provider execution and without q-cover or singleton descent.',
      finiteDenominatorOrRankToken: 'p848_no_spend_source_import_boundary_after_local_p4217_hard_blocker',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet closes the no-spend source/import boundary assembly after the local p4217 hard blocker. It preserves the three theorem objects still outside the all-N proof and the precise future release conditions. It does not execute a provider call, prove a p4217 finite partition or residual rank, prove a squarefree-realization theorem, restore the mod-50 generator theorem, import a square-moduli union/hitting theorem, lower any threshold, prove all-N recombination, or decide Problem 848.',
    claims: {
      completesNoSpendSourceImportBoundaryAssembly: true,
      preservesP4217HardBlocker: true,
      preservesPreparedProfile: true,
      namesRemainingSourceImportTheoremObjects: true,
      namesFutureReleaseConditions: true,
      selectsNoSpendLocalTheoremBacklog: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      blocksLiveSpendThisTurn: true,
      requiresFutureApprovalBeforeSpend: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      provesFiniteP4217Partition: false,
      provesP4217ResidualRankDecrease: false,
      provesSquarefreeRealizationSourceTheorem: false,
      provesMod50AllFutureRecurrence: false,
      importsSquareModuliUnionHittingThreshold: false,
      lowersAnalyticThreshold: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 no-spend source/import boundary after local p4217 hard blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Paid/API call made: \`${packet.boundaryAssembly.madeNewPaidCall}\``,
    '',
    '## Boundary Assembly',
    '',
    `- Shape: \`${packet.boundaryAssembly.sourceImportBoundaryShape}\``,
    `- Open frontier obligations at input: \`${packet.boundaryAssembly.openFrontierObligationCountAtInput}\``,
    `- All-N proof available: \`${packet.boundaryAssembly.allNProofAvailable}\``,
    '',
    '## Remaining Theorem Objects',
    '',
    packet.remainingTheoremObjects.map((item) => [
      `### ${item.objectId}`,
      '',
      `- Status: \`${item.status}\``,
      `- Needed theorem: ${item.neededTheorem}`,
      `- Boundary: ${item.currentBoundary}`,
      '',
      'Release conditions:',
      item.releaseConditions.map((condition) => `- ${condition}`).join('\n'),
      '',
    ].join('\n')).join('\n'),
    '## Next Local Step',
    '',
    packet.oneNextAction.action,
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesAfterBoundaryAssembly.map((item) => `- ${item}`).join('\n'),
    '',
    '## Boundary',
    '',
    packet.proofBoundary,
    '',
  ].join('\n');
}

function writeOutputs(packet, options) {
  const json = JSON.stringify(packet, null, options.pretty ? 2 : 0);
  if (options.jsonOutput) {
    fs.mkdirSync(path.dirname(options.jsonOutput), { recursive: true });
    fs.writeFileSync(options.jsonOutput, `${json}\n`);
  } else {
    process.stdout.write(`${json}\n`);
  }
  if (options.markdownOutput) {
    fs.mkdirSync(path.dirname(options.markdownOutput), { recursive: true });
    fs.writeFileSync(options.markdownOutput, `${renderMarkdown(packet)}\n`);
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packet = buildPacket(options);
  writeOutputs(packet, options);
}

main();
