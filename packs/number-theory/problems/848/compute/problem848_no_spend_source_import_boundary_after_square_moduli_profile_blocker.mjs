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

const DEFAULT_PREVIOUS_BOUNDARY_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_LOCAL_P4217_HARD_BLOCKER_PACKET.json');
const DEFAULT_SQUARE_PROFILE_BLOCKER_PACKET = path.join(frontierBridge, 'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.json');
const DEFAULT_MOD50_SOURCE_BLOCKER_PACKET = path.join(frontierBridge, 'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json');
const DEFAULT_MOD50_WEDGE_DECISION_PACKET = path.join(frontierBridge, 'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json');
const DEFAULT_SOURCE_SEARCH_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_SQUARE_MODULI_PROFILE_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_SQUARE_MODULI_PROFILE_BLOCKER_PACKET.md');
const DEFAULT_PROGRESS_JSON = path.join(problemDir, 'PROGRESS.json');

const TARGET = 'assemble_p848_no_spend_source_import_boundary_after_square_moduli_profile_blocker';
const NEXT_ACTION = 'prepare_p848_mod50_generator_source_import_profile_or_no_spend_blocker_after_source_boundary';
const STATUS = 'no_spend_source_import_boundary_assembled_after_square_moduli_profile_blocker';

function parseArgs(argv) {
  const options = {
    previousBoundaryPacket: DEFAULT_PREVIOUS_BOUNDARY_PACKET,
    squareProfileBlockerPacket: DEFAULT_SQUARE_PROFILE_BLOCKER_PACKET,
    mod50SourceBlockerPacket: DEFAULT_MOD50_SOURCE_BLOCKER_PACKET,
    mod50WedgeDecisionPacket: DEFAULT_MOD50_WEDGE_DECISION_PACKET,
    sourceSearchPacket: DEFAULT_SOURCE_SEARCH_PACKET,
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
    } else if (arg === '--square-profile-blocker-packet') {
      options.squareProfileBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--mod50-source-blocker-packet') {
      options.mod50SourceBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--mod50-wedge-decision-packet') {
      options.mod50WedgeDecisionPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--source-search-packet') {
      options.sourceSearchPacket = path.resolve(argv[index + 1]);
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

function buildRemainingTheoremObjects(previousBoundary, squareProfileBlocker) {
  const previousObjects = Array.isArray(previousBoundary?.remainingTheoremObjects)
    ? previousBoundary.remainingTheoremObjects
    : [];
  const byObject = new Map(previousObjects.map((object) => [object.objectId, object]));

  return [
    {
      objectId: 'p4217_residual_squarefree_realization_source',
      status: 'local_hard_blocker_and_profile_approval_blocker_preserved',
      neededTheorem: byObject.get('p4217_residual_squarefree_realization_source')?.neededTheorem
        ?? 'A p4217 residual finite complete CRT partition, well-founded decreasing rank/invariant, or squarefree-realization theorem for every locally admissible residual CRT/arithmetic-progression/linear-family instance.',
      currentBoundary: 'The p4217 residual source theorem lane has both a repaired future-use profile and a local hard blocker; under the current no-spend instruction it is not the cheapest next local probe.',
      releaseConditions: byObject.get('p4217_residual_squarefree_realization_source')?.releaseConditions ?? [],
      blockingPackets: byObject.get('p4217_residual_squarefree_realization_source')?.blockingPackets ?? [],
    },
    {
      objectId: 'mod50_all_future_recurrence_or_generator',
      status: 'selected_next_for_repaired_source_import_profile_or_no_spend_blocker',
      neededTheorem: byObject.get('mod50_all_future_recurrence_or_generator')?.neededTheorem
        ?? 'A mod-50 all-future relevant-pair recurrence, finite-Q partition, or restored original family-menu generator theorem covering every future relevant-pair row.',
      currentBoundary: 'The mod-50 lane has finite replay evidence plus a failed broad wedge, but it still lacks a narrow post-boundary source/import profile or no-spend blocker naming the exact generator/recurrence target.',
      releaseConditions: [
        'Recover/prove the mod-50 all-future relevant-pair recurrence, finite-Q partition, or original family-menu generator theorem locally.',
        'Prepare a single-lane future source-import profile only if it names a concrete generator/source theorem sharper than the broad failed wedge.',
        'Keep provider execution blocked under no-spend instructions until a future budget-guarded release is explicit.',
      ],
      blockingPackets: byObject.get('mod50_all_future_recurrence_or_generator')?.blockingPackets ?? [],
    },
    {
      objectId: 'square_moduli_union_hitting_threshold_source',
      status: 'source_index_audited_and_profile_approval_blocked',
      neededTheorem: byObject.get('square_moduli_union_hitting_threshold_source')?.neededTheorem
        ?? squareProfileBlocker?.selectedLane?.currentBoundary
        ?? 'A square-moduli union/hitting upper-bound theorem with Sawhney-compatible hypotheses, inequality direction, constants, and threshold.',
      currentBoundary: 'The square-moduli union/hitting lane has a no-spend source-index audit and a future-use profile/approval blocker. No union/hitting upper-bound theorem is promoted from current repo sources.',
      releaseConditions: squareProfileBlocker?.approvalDecision?.futureLivePreconditions ?? [],
      blockingPackets: [
        'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json',
        'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json',
        'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_INDEX_NO_SPEND_AUDIT_PACKET.json',
        'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.json',
      ],
    },
  ];
}

function buildPacket(options) {
  const previousBoundary = readJson(options.previousBoundaryPacket);
  assertCondition(previousBoundary?.status === 'no_spend_source_import_boundary_assembled_after_local_p4217_hard_blocker', 'previous source/import boundary has unexpected status');
  assertCondition(previousBoundary?.target === 'assemble_p848_no_spend_source_import_boundary_after_local_p4217_hard_blocker', 'previous source/import boundary has unexpected target');
  assertCondition(previousBoundary?.recommendedNextAction === 'prepare_p848_no_spend_local_theorem_backlog_after_source_import_boundary', 'previous boundary does not route to local theorem backlog');
  assertCondition(previousBoundary?.claims?.madeNewPaidCall === false, 'previous boundary unexpectedly records a paid call');
  assertCondition(previousBoundary?.claims?.provesAllN === false, 'previous boundary unexpectedly proves all-N');
  assertCondition(Array.isArray(previousBoundary?.remainingTheoremObjects) && previousBoundary.remainingTheoremObjects.length === 3, 'previous boundary must name exactly three theorem objects');

  const squareProfileBlocker = readJson(options.squareProfileBlockerPacket);
  assertCondition(squareProfileBlocker?.status === 'square_moduli_union_hitting_source_import_profile_approval_blocker_emitted_no_live_spend', 'square-moduli profile blocker has unexpected status');
  assertCondition(squareProfileBlocker?.target === 'prepare_p848_square_moduli_union_hitting_source_import_profile_or_approval_blocker', 'square-moduli profile blocker has unexpected target');
  assertCondition(squareProfileBlocker?.recommendedNextAction === TARGET, 'square-moduli profile blocker does not route to this boundary assembly');
  assertCondition(squareProfileBlocker?.selectedLane?.laneId === 'square_moduli_union_hitting_threshold_source', 'square profile blocker did not select the square-moduli union/hitting lane');
  assertCondition(squareProfileBlocker?.approvalDecision?.profileExecutionApproved === false, 'square profile blocker unexpectedly approves live execution');
  assertCondition(squareProfileBlocker?.claims?.madeNewPaidCall === false, 'square profile blocker unexpectedly records a paid call');
  assertCondition(squareProfileBlocker?.claims?.provesSawhneyUnionHittingUpperBound === false, 'square profile blocker unexpectedly proves the union/hitting theorem');
  assertCondition(squareProfileBlocker?.claims?.decidesProblem848 === false, 'square profile blocker unexpectedly decides Problem 848');

  const mod50SourceBlocker = readJson(options.mod50SourceBlockerPacket);
  assertCondition(mod50SourceBlocker?.status === 'mod50_all_future_recurrence_source_theorem_blocker_emitted_local_source_absent', 'mod-50 source blocker has unexpected status');
  assertCondition(mod50SourceBlocker?.claims?.provesRepoOwnedAllFutureRecurrenceAbsent === true, 'mod-50 source blocker must record absent repo-owned recurrence');
  assertCondition(mod50SourceBlocker?.claims?.provesSymbolicRelevantPairRecurrence === false, 'mod-50 source blocker unexpectedly proves symbolic recurrence');
  assertCondition(mod50SourceBlocker?.claims?.provesFiniteQPartition === false, 'mod-50 source blocker unexpectedly proves finite-Q partition');
  assertCondition(mod50SourceBlocker?.claims?.provesAllN === false, 'mod-50 source blocker unexpectedly proves all-N');

  const mod50WedgeDecision = readJson(options.mod50WedgeDecisionPacket);
  assertCondition(mod50WedgeDecision?.status === 'mod50_theorem_wedge_decision_blocker_emitted_budget_guarded_live_incomplete_no_universal_theorem', 'mod-50 wedge decision has unexpected status');
  assertCondition(mod50WedgeDecision?.claims?.livePaidCallMade === true, 'mod-50 wedge decision should preserve the prior budget-guarded live result');
  assertCondition(mod50WedgeDecision?.claims?.provesSymbolicRelevantPairRecurrence === false, 'mod-50 wedge decision unexpectedly proves symbolic recurrence');
  assertCondition(mod50WedgeDecision?.claims?.provesFiniteQPartition === false, 'mod-50 wedge decision unexpectedly proves finite-Q partition');
  assertCondition(mod50WedgeDecision?.claims?.provesAllN === false, 'mod-50 wedge decision unexpectedly proves all-N');

  const sourceSearch = readJson(options.sourceSearchPacket);
  assertCondition(sourceSearch?.status === 'no_spend_source_recovery_search_completed_no_promotable_source_found', 'source-search packet has unexpected status');
  assertCondition(sourceSearch?.claims?.foundPromotableMod50Source === false, 'source-search packet unexpectedly found a promotable mod-50 source');
  assertCondition(sourceSearch?.claims?.madeNewPaidCall === false, 'source-search packet unexpectedly records a paid call');

  const progress = readJsonIfPresent(options.progressJson);
  const remainingTheoremObjects = buildRemainingTheoremObjects(previousBoundary, squareProfileBlocker);

  return {
    schema: 'erdos.number_theory.p848_no_spend_source_import_boundary_after_square_moduli_profile_blocker_packet/1',
    packetId: 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_SQUARE_MODULI_PROFILE_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_source_import_boundary_after_square_moduli_profile_blocker',
      previousBoundaryPacket: rel(options.previousBoundaryPacket),
      previousBoundarySha256: sha256File(options.previousBoundaryPacket),
      squareProfileBlockerPacket: rel(options.squareProfileBlockerPacket),
      squareProfileBlockerSha256: sha256File(options.squareProfileBlockerPacket),
      mod50SourceBlockerPacket: rel(options.mod50SourceBlockerPacket),
      mod50SourceBlockerSha256: sha256File(options.mod50SourceBlockerPacket),
      mod50WedgeDecisionPacket: rel(options.mod50WedgeDecisionPacket),
      mod50WedgeDecisionSha256: sha256File(options.mod50WedgeDecisionPacket),
      sourceSearchPacket: rel(options.sourceSearchPacket),
      sourceSearchSha256: sha256File(options.sourceSearchPacket),
    },
    boundaryAssembly: {
      status: 'assembled_after_square_moduli_profile_blocker',
      mode: 'no_spend_source_import_recombination',
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      allNProofAvailable: false,
      finiteMeasureDecreased: false,
      openFrontierObligationCountAtInput: currentFrontierObligationCount(progress),
      sourceImportBoundaryShape: 'p4217_and_square_profile_blocked_mod50_selected_next',
      convergenceAssemblyNudgeUsed: true,
      assembledFromStatuses: {
        previousBoundary: previousBoundary.status,
        squareProfileBlocker: squareProfileBlocker.status,
        mod50SourceBlocker: mod50SourceBlocker.status,
        mod50WedgeDecision: mod50WedgeDecision.status,
        sourceSearch: sourceSearch.status,
      },
    },
    remainingTheoremObjects,
    lanePriorityDecision: {
      selectedLaneId: 'mod50_all_future_recurrence_or_generator',
      selectedStepId: NEXT_ACTION,
      selectedMode: 'single_mod50_source_import_profile_or_no_spend_blocker',
      reason: [
        'The p4217 residual lane already has a repaired future-use profile, a no-spend approval blocker, and a local hard blocker.',
        'The square-moduli union/hitting lane already has a no-spend source-index audit, a future-use profile, and an approval blocker.',
        'The mod-50 lane still has no post-boundary repaired profile/blocker that names only the all-future recurrence, finite-Q partition, or generator theorem target.',
      ],
      whyNotSpendNow: [
        'Current instructions explicitly say do not spend.',
        'The next durable local step is profile/blocker preparation, not provider execution.',
        'Any future live source-import call still requires usage ledger clearance and a sharper single-lane question.',
      ],
    },
    selectedNextTheoremObject: {
      objectId: 'mod50_all_future_recurrence_or_generator',
      statement: 'Find or prove a mod-50 all-future relevant-pair recurrence, finite-Q partition, or restored original family-menu generator theorem covering every future relevant-pair row.',
      nextLocalGoal: 'Prepare the repaired mod-50 source/import profile or no-spend blocker, explicitly excluding broad reruns of the failed mod-50 theorem wedge and finite replay overclaims.',
      firstVerificationCommand: './bin/erdos problem progress 848 --json',
    },
    forbiddenMovesAfterBoundaryAssembly: [
      'execute_provider_source_import_under_current_no_spend_instruction',
      'rerun_the_same_mod50_paid_wedge_by_default',
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'try_fallback_selectors_one_by_one',
      'emit_a_naked_deterministic_rank_boundary',
      'claim_mod50_finite_replay_as_all_future_recurrence',
      'claim_tao_van_doorn_plus_exact_verifier_decides_848_without_union_hitting_source',
      'treat_bounded_finite_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Prepare a no-spend repaired source/import profile or blocker for the mod-50 all-future recurrence/generator theorem, using the existing mod-50 source blocker, theorem-wedge decision blocker, and source-search gap as inputs.',
      finiteDenominatorOrRankToken: 'p848_no_spend_source_import_boundary_after_square_moduli_profile_blocker',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet assembles the no-spend source/import boundary after the square-moduli profile blocker. It records that p4217 and square-moduli are already profile/approval-blocked under current no-spend rules, selects the remaining mod-50 all-future recurrence/generator theorem as the next no-spend profile/blocker target, and forbids q-cover, singleton descent, provider execution, threshold overclaims, and bounded-evidence all-N promotion. It does not prove the mod-50 recurrence, p4217 residual source theorem, square-moduli union/hitting theorem, all-N recombination, or Problem 848.',
    claims: {
      completesSourceImportBoundaryAfterSquareModuliProfileBlocker: true,
      preservesPreviousSourceImportBoundary: true,
      preservesP4217ProfileAndHardBlocker: true,
      preservesSquareModuliProfileApprovalBlocker: true,
      selectsMod50AsNextSourceObject: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      blocksLiveSpendThisTurn: true,
      requiresFutureApprovalBeforeSpend: true,
      respectsNoPaidByDefault: true,
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
    '# P848 no-spend source/import boundary after square-moduli profile blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Selected next theorem object: \`${packet.selectedNextTheoremObject.objectId}\``,
    `- Paid/API call made: \`${packet.boundaryAssembly.madeNewPaidCall}\``,
    '',
    '## Boundary Shape',
    '',
    packet.boundaryAssembly.sourceImportBoundaryShape,
    '',
    '## Remaining Theorem Objects',
    '',
    packet.remainingTheoremObjects.map((object) => `- \`${object.objectId}\` [${object.status}]: ${object.neededTheorem}`).join('\n'),
    '',
    '## Lane Priority Decision',
    '',
    packet.lanePriorityDecision.reason.map((item) => `- ${item}`).join('\n'),
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesAfterBoundaryAssembly.map((item) => `- ${item}`).join('\n'),
    '',
    '## Next Action',
    '',
    `\`${packet.oneNextAction.stepId}\`: ${packet.oneNextAction.action}`,
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
