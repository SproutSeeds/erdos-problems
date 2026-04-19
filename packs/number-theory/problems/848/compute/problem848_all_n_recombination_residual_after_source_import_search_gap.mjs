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

const DEFAULT_SOURCE_SEARCH_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_SOURCE_IMPORT_SEARCH_GAP_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_SOURCE_IMPORT_SEARCH_GAP_PACKET.md');
const DEFAULT_PROGRESS_JSON = path.join(problemDir, 'PROGRESS.json');

const TARGET = 'assemble_p848_all_n_residual_after_source_import_search_gap';
const NEXT_ACTION = 'prepare_p848_repaired_single_lane_source_import_profile_after_no_spend_gap';
const STATUS = 'all_n_recombination_residual_assembled_after_source_import_search_gap';

const REQUIRED_LANE_IDS = [
  'p4217_residual_squarefree_realization_source',
  'mod50_all_future_recurrence_or_generator',
  'square_moduli_union_hitting_threshold',
];

const REMAINING_THEOREM_ATOMS = [
  {
    atomId: 'p848_p4217_residual_finite_partition_rank_or_squarefree_realization_source',
    laneId: 'p4217_residual_squarefree_realization_source',
    status: 'open_source_theorem_gap_after_no_spend_search',
    neededTheorem: 'A p4217 residual finite complete CRT partition, well-founded decreasing rank/invariant, or squarefree-realization theorem for every locally admissible residual CRT/arithmetic-progression/linear-family instance.',
    currentBoundary: 'The p4217 live wedge, residual fork reduction, and no-spend source search found no promotable whole-complement theorem, finite partition, decreasing invariant, or squarefree-realization source theorem.',
    blockingPackets: [
      'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
      'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET.json',
      'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET.json',
    ],
    repairedProfileQuestion: 'Can a single source/import profile be sharpened to target only the residual squarefree-realization or finite-partition theorem, without rerunning the broad p4217 paid wedge?',
  },
  {
    atomId: 'p848_mod50_all_future_recurrence_finite_q_or_generator_source',
    laneId: 'mod50_all_future_recurrence_or_generator',
    status: 'open_source_theorem_gap_after_no_spend_search',
    neededTheorem: 'A mod-50 all-future relevant-pair recurrence, finite-Q partition, or restored original family-menu generator theorem covering every future relevant-pair row.',
    currentBoundary: 'The mod-50 source blocker, archaeology packet, theorem-wedge blocker, and no-spend source search found finite replay evidence but no all-future recurrence/generator theorem.',
    blockingPackets: [
      'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json',
      'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
      'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET.json',
    ],
    repairedProfileQuestion: 'Can a repaired source/import profile target the original family-menu generator or a finite-Q partition sharply enough to justify any future source-audit spend?',
  },
  {
    atomId: 'p848_square_moduli_union_hitting_threshold_source',
    laneId: 'square_moduli_union_hitting_threshold',
    status: 'open_import_source_gap_after_no_spend_search',
    neededTheorem: 'A square-moduli union/hitting upper-bound theorem with Sawhney-compatible hypotheses, inequality direction, constants, and threshold.',
    currentBoundary: 'The Tao-van-Doorn shortcut remains directionally insufficient under current repo sources: it upper-bounds avoiding sets, while Sawhney Lemma 2.1 and Lemma 2.2 need union/hitting upper bounds.',
    blockingPackets: [
      'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json',
      'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json',
      'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET.json',
    ],
    repairedProfileQuestion: 'Can a repaired source/import profile target only the missing union/hitting upper-bound direction and constants, without claiming an N0 threshold first?',
  },
];

function parseArgs(argv) {
  const options = {
    sourceSearchPacket: DEFAULT_SOURCE_SEARCH_PACKET,
    progressJson: DEFAULT_PROGRESS_JSON,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--source-search-packet') {
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

function summarizeLaneResult(lane) {
  return {
    laneId: lane.laneId,
    status: lane.status,
    matchedFileCount: lane.matchedFileCount ?? null,
    totalMatchCount: lane.totalMatchCount ?? null,
    missingTheoremObject: lane.missingTheoremObject ?? null,
    representativeExistingPackets: lane.representativeExistingPackets ?? [],
    resultBoundary: lane.resultBoundary ?? null,
  };
}

function buildPacket(options) {
  const sourceSearch = readJson(options.sourceSearchPacket);
  assertCondition(sourceSearch?.status === 'no_spend_source_recovery_search_completed_no_promotable_source_found', 'source search packet has unexpected status');
  assertCondition(sourceSearch?.target === 'execute_p848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting', 'source search packet has unexpected target');
  assertCondition(sourceSearch?.recommendedNextAction === TARGET, 'source search packet does not route to the post-search all-N residual assembly target');
  assertCondition(sourceSearch?.coversPrimaryNextAction?.status === 'completed_by_no_spend_source_search_no_promotable_source_found', 'source search packet does not close the no-spend source-search step');
  assertCondition(sourceSearch?.probeExecution?.madeNewPaidCall === false, 'source search packet unexpectedly records a paid call');
  assertCondition(Array.isArray(sourceSearch?.recoveryLaneResults), 'source search packet is missing recovery lane results');
  assertCondition(sourceSearch.recoveryLaneResults.length === 3, 'source search packet must report exactly three recovery lanes');
  assertCondition(
    REQUIRED_LANE_IDS.every((laneId) => sourceSearch.recoveryLaneResults.some((lane) => lane?.laneId === laneId && lane?.status === 'no_promotable_source_found_current_repo')),
    'source search packet is missing one of the required no-promotable-source lane results',
  );
  assertCondition(Array.isArray(sourceSearch?.missingTheoremObjects) && sourceSearch.missingTheoremObjects.length === 3, 'source search packet must name exactly three missing theorem objects');
  assertCondition(sourceSearch?.claims?.completesNoSpendSourceRecoverySearch === true, 'source search packet does not complete no-spend source recovery');
  assertCondition(sourceSearch?.claims?.emitsFormalSourceImportGap === true, 'source search packet does not emit a formal source/import gap');
  assertCondition(sourceSearch?.claims?.madeNewPaidCall === false, 'source search packet claims a paid call');
  assertCondition(sourceSearch?.claims?.blocksQCoverExpansion === true, 'source search packet must keep q-cover expansion blocked');
  assertCondition(sourceSearch?.claims?.blocksSingletonQDescent === true, 'source search packet must keep singleton q descent blocked');
  assertCondition(sourceSearch?.claims?.provesAllN === false, 'source search packet unexpectedly proves all-N');

  const progress = readJsonIfPresent(options.progressJson);
  const laneSummaries = sourceSearch.recoveryLaneResults.map(summarizeLaneResult);

  return {
    schema: 'erdos.number_theory.p848_all_n_recombination_residual_after_source_import_search_gap_packet/1',
    packetId: 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_SOURCE_IMPORT_SEARCH_GAP_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_post_source_import_search_gap_all_n_residual_assembly',
      sourceSearchPacket: rel(options.sourceSearchPacket),
      sourceSearchSha256: sha256File(options.sourceSearchPacket),
    },
    sourceSearchGapSummary: {
      packetId: sourceSearch.packetId,
      status: sourceSearch.status,
      target: sourceSearch.target,
      sourceImportGap: sourceSearch.sourceImportGap ?? null,
      missingTheoremObjects: sourceSearch.missingTheoremObjects,
      recoveryLaneResults: laneSummaries,
      paidCallMade: sourceSearch.probeExecution?.madeNewPaidCall ?? null,
    },
    residualVerdict: {
      status: 'all_n_recombination_still_blocked_by_three_source_import_gaps',
      allNProofAvailable: false,
      finiteMeasureDecreased: false,
      openFrontierObligationCountAtInput: currentFrontierObligationCount(progress),
      whyNotGlobalConvergence: [
        'The no-spend source search found no promotable p4217 residual partition, rank, or squarefree-realization theorem.',
        'The no-spend source search found no promotable mod-50 all-future recurrence, finite-Q partition, or restored family-menu generator theorem.',
        'The no-spend source search found no square-moduli union/hitting upper-bound source with Sawhney-compatible direction, constants, and threshold.',
        'The earlier finite q-cover staircase and bounded endpoint evidence remain routing evidence only; they do not supply the missing source/import theorem objects.',
      ],
      nextActionSelected: 'single_repaired_source_import_profile_preparation',
    },
    remainingTheoremAtoms: REMAINING_THEOREM_ATOMS,
    lanePriorityDecision: {
      selectedMode: 'single_repaired_source_import_profile_preparation',
      selectedStepId: NEXT_ACTION,
      selectedLane: 'single_lane_to_be_chosen_by_profile_prep',
      reason: 'All three residual blockers are source/import theorem gaps. The next useful local step is not another finite frontier expansion; it is a repaired profile that chooses exactly one theorem object, names why that profile is sharper than the previous broad wedges, and emits an approval blocker if no lane is sharp enough for future live spend.',
      laneTieBreakersForNextProfile: [
        'Prefer p4217 if the profile can be narrowed to the residual squarefree-realization theorem selected by the live wedge.',
        'Prefer mod-50 if a concrete generator filename, finite-Q denominator, or original family-menu recurrence source can be named.',
        'Prefer square-moduli union/hitting only if the profile targets the missing upper-bound direction and constants, not a threshold claim.',
      ],
    },
    paidCallPolicy: {
      default: 'do_not_call_provider',
      madeNewPaidCall: false,
      repeatP4217WedgeDefault: 'blocked',
      futureLivePreconditions: [
        'A repaired single-lane profile names exactly one theorem object or import source target.',
        'The profile explains why it is sharper than the previous broad p4217/mod-50 wedge attempts and the current no-spend search.',
        'erdos orp research usage --json confirms remaining local run count and USD budget.',
        'The call purpose is source-audit/theorem-import recovery, not routine verification or broad fishing.',
      ],
    },
    forbiddenMovesAfterResidualAssembly: [
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'emit_a_naked_deterministic_rank_boundary',
      'try_fallback_selectors_one_by_one',
      'rerun_the_same_p4217_paid_wedge_by_default',
      'rerun_the_same_mod50_paid_wedge_by_default',
      'claim_tao_van_doorn_plus_exact_verifier_decides_848_without_union_hitting_source',
      'claim_N0_around_1e6_or_N0_at_most_40500_without_imported_threshold_source',
      'treat_bounded_40500_or_280_row_menu_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Prepare one repaired no-spend source/import profile that selects exactly one residual theorem object, explains why that lane is sharper than the failed broad wedges and no-spend search, and emits an approval blocker if no lane is sharp enough.',
      finiteDenominatorOrRankToken: 'p848_all_n_residual_after_source_import_search_gap',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet closes the post-source-search all-N residual assembly. It records that the current all-N proof remains blocked by exactly three source/import theorem objects and routes to repaired single-lane profile preparation. It does not prove a p4217 finite partition, p4217 decreasing rank, p4217 squarefree-realization source theorem, mod-50 all-future recurrence, finite-Q partition, square-moduli union/hitting threshold, post-40500 sufficiency theorem, all-N recombination, or Problem 848.',
    claims: {
      completesPostSourceImportSearchGapResidualAssembly: true,
      assemblesAllNResidualAfterSourceImportSearchGap: true,
      recordsSourceImportSearchGap: true,
      selectedNextActionIsSingleLaneProfilePrep: true,
      selectedNextActionIsQCover: false,
      selectedNextActionIsSingletonSelector: false,
      madeNewPaidCall: false,
      respectsNoPaidByDefault: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      blocksRepeatPaidWedgeByDefault: true,
      provesFiniteP4217Partition: false,
      provesP4217ResidualRankDecrease: false,
      provesSquarefreeRealizationSourceTheorem: false,
      provesMod50AllFutureRecurrence: false,
      provesFiniteQPartition: false,
      importsSquareModuliUnionHittingThreshold: false,
      provesPost40500Sufficiency: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 all-N recombination residual after source-import search gap',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Open frontier obligation count at input: \`${packet.residualVerdict.openFrontierObligationCountAtInput ?? 'unknown'}\``,
    `- Paid/API call made: \`${packet.paidCallPolicy.madeNewPaidCall}\``,
    '',
    '## Verdict',
    '',
    packet.residualVerdict.whyNotGlobalConvergence.map((reason) => `- ${reason}`).join('\n'),
    '',
    '## Remaining Theorem Atoms',
    '',
    packet.remainingTheoremAtoms.map((atom) => [
      `### ${atom.atomId}`,
      '',
      `- Status: \`${atom.status}\``,
      `- Needed theorem: ${atom.neededTheorem}`,
      `- Current boundary: ${atom.currentBoundary}`,
      `- Profile question: ${atom.repairedProfileQuestion}`,
    ].join('\n')).join('\n\n'),
    '',
    '## Lane Decision',
    '',
    `${packet.lanePriorityDecision.reason}`,
    '',
    packet.lanePriorityDecision.laneTieBreakersForNextProfile.map((rule) => `- ${rule}`).join('\n'),
    '',
    '## Next Action',
    '',
    `\`${packet.oneNextAction.stepId}\`: ${packet.oneNextAction.action}`,
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesAfterResidualAssembly.map((move) => `- \`${move}\``).join('\n'),
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
