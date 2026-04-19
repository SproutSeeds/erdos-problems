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

const DEFAULT_RECOMBINATION_BLOCKER = path.join(frontierBridge, 'P848_NO_SPEND_ALL_N_RECOMBINATION_BLOCKER_AFTER_THREE_PROFILE_DECISION_PACKET.json');
const DEFAULT_PROGRESS_JSON = path.join(problemDir, 'PROGRESS.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_LOCAL_SOURCE_THEOREM_STATEMENT_BACKLOG_AFTER_ALL_N_RECOMBINATION_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_LOCAL_SOURCE_THEOREM_STATEMENT_BACKLOG_AFTER_ALL_N_RECOMBINATION_BLOCKER_PACKET.md');

const TARGET = 'prepare_p848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker';
const NEXT_ACTION = 'attempt_p848_mod50_generator_theorem_statement_local_proof_or_emit_gap_after_all_n_recombination_blocker';
const STATUS = 'no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker_prepared';

function parseArgs(argv) {
  const options = {
    recombinationBlocker: DEFAULT_RECOMBINATION_BLOCKER,
    progressJson: DEFAULT_PROGRESS_JSON,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--recombination-blocker') {
      options.recombinationBlocker = path.resolve(argv[index + 1]);
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

function laneById(lanes, laneId) {
  return lanes.find((lane) => lane.laneId === laneId) ?? null;
}

function buildTheoremStatements(lanes) {
  const mod50Lane = laneById(lanes, 'mod50_generator_source_import');
  const squareLane = laneById(lanes, 'square_moduli_union_hitting_source_import');
  const p4217Lane = laneById(lanes, 'p4217_residual_source_import');

  return [
    {
      statementId: 'mod50_generator_all_future_recurrence_or_finite_q_partition',
      laneId: 'mod50_generator_source_import',
      rank: 1,
      localProbePriority: 'first',
      sourceLaneStatus: mod50Lane?.status ?? null,
      profileId: mod50Lane?.profileId ?? null,
      profilePath: mod50Lane?.profilePath ?? null,
      targetTheoremStatement: 'Prove that every future row in the mod-50 square-witness relevant-pair domain is governed by a restored generator theorem, a symbolic all-future recurrence, or a finite-Q partition with audited denominator and transition objects.',
      requiredHypotheses: [
        'The statement must cover future rows beyond the restored finite menus and compact 1..40500 evidence.',
        'The statement must identify the relevant-pair denominator, bad-residue lanes, and Q-transition objects it quantifies over.',
        'The statement must explain how finite menu replay is an instance of the theorem rather than the theorem itself.',
      ],
      acceptableClosureArtifacts: [
        'symbolic_relevant_pair_recurrence',
        'finite_Q_partition_with_audited_denominators',
        'restored_original_family_menu_generator_theorem',
        'precise_local_gap_packet_naming_the_missing_generator_source',
      ],
      localProofProbe: {
        probeId: 'mod50_generator_statement_source_denominator_audit',
        mode: 'local_no_spend_source_archaeology_and_statement_proof_attempt',
        command: 'rg -n "mod-50|mod50|finite-Q|finite Q|all-future|relevant-pair|relevant pair|generator|family-menu|family menu" packs/number-theory/problems/848 src test',
        expectedOutput: 'Either a repo-owned generator/recurrence/finite-Q theorem object, or a precise gap naming the missing source theorem and denominator objects.',
      },
      reasonForRank: 'The mod-50 lane has the repaired single-lane source profile, finite-menu replay artifacts, and generator/restoration blockers already localized, so a deterministic local statement audit is cheaper than reopening p4217 residuals or importing an analytic union/hitting theorem.',
    },
    {
      statementId: 'square_moduli_sawhney_compatible_union_hitting_upper_bound',
      laneId: 'square_moduli_union_hitting_source_import',
      rank: 2,
      localProbePriority: 'deferred',
      sourceLaneStatus: squareLane?.status ?? null,
      profileId: squareLane?.profileId ?? null,
      profilePath: squareLane?.profilePath ?? null,
      targetTheoremStatement: 'Import or prove a Sawhney-compatible square-moduli union/hitting upper-bound theorem with the needed direction, hypotheses, constants, threshold, and finite handoff for the all-N recombination surface.',
      requiredHypotheses: [
        'The theorem must be an upper-bound union/hitting input, not only an avoiding-set or large-sieve lower-side statement.',
        'The theorem must state constants and threshold handoff conditions that can be audited against the 848 finite boundary.',
        'The theorem must be compatible with the current Sawhney-style square-moduli use, not a Tao-van-Doorn shortcut with the wrong inequality direction.',
      ],
      acceptableClosureArtifacts: [
        'audited_source_import_packet',
        'local_analytic_proof_packet_with_constants_and_threshold',
        'precise_source_import_blocker_rejecting_avoiding_side_only_evidence',
      ],
      localProofProbe: {
        probeId: 'square_moduli_union_hitting_source_import_audit_deferred',
        mode: 'deferred_source_import_or_budget_guarded_audit',
        command: null,
        expectedOutput: 'A future source import or blocker; the latest local source-index audit found no promotable source theorem.',
      },
      reasonForRank: 'The square-moduli audit already found only blockers, finite scaffolding, and avoiding-side evidence, so a new no-spend local proof attempt is less likely to close than the mod-50 generator statement audit.',
    },
    {
      statementId: 'p4217_residual_squarefree_realization_or_rank_source_theorem',
      laneId: 'p4217_residual_source_import',
      rank: 3,
      localProbePriority: 'deferred',
      sourceLaneStatus: p4217Lane?.status ?? null,
      profileId: p4217Lane?.profileId ?? null,
      profilePath: p4217Lane?.profilePath ?? null,
      targetTheoremStatement: 'Prove a p4217 residual finite CRT partition, well-founded decreasing residual rank, or squarefree-realization source theorem for every locally admissible residual family.',
      requiredHypotheses: [
        'The theorem must cover the whole residual complement profile, not one descendant or q-cover bucket.',
        'A finite CRT partition must be complete, disjoint or audited for overlap, and tied to terminal closure or a smaller theorem object.',
        'A decreasing rank must be well founded and must not reintroduce the same q-cover or fallback-selector shape.',
      ],
      acceptableClosureArtifacts: [
        'finite_CRT_partition_packet',
        'decreasing_residual_rank_packet',
        'squarefree_realization_source_theorem_import',
        'precise_p4217_source_theorem_gap_packet',
      ],
      localProofProbe: {
        probeId: 'p4217_residual_source_theorem_probe_deferred',
        mode: 'deferred_after_local_hard_blocker',
        command: null,
        expectedOutput: 'A future source import or new theorem object; the latest local proof attempt already emitted a hard blocker.',
      },
      reasonForRank: 'The p4217 residual lane was just hard-blocked by a local proof attempt and has no current repo-owned finite partition, decreasing rank, or squarefree-realization source theorem.',
    },
  ];
}

function buildPacket(options) {
  const recombination = readJson(options.recombinationBlocker);
  assertCondition(recombination?.status === 'no_spend_all_n_recombination_blocker_after_three_profile_decision_emitted', 'recombination blocker has unexpected status');
  assertCondition(recombination?.target === 'assemble_p848_no_spend_all_n_recombination_blocker_after_three_profile_decision', 'recombination blocker has unexpected target');
  assertCondition(recombination?.recommendedNextAction === TARGET, 'recombination blocker does not route to this backlog');
  assertCondition(recombination?.coversPrimaryNextAction?.status === 'completed_by_no_spend_all_n_recombination_blocker_after_three_profile_decision', 'recombination blocker did not complete the previous primary action');
  assertCondition(recombination?.recombinationBlocker?.missingTheoremObjectCount === 3, 'recombination blocker must name three missing theorem objects');
  assertCondition(recombination?.recombinationBlocker?.allSourceImportLanesProfileBound === true, 'source/import lanes must be profile-bound');
  assertCondition(recombination?.recombinationBlocker?.providerExecutionReleased === false, 'recombination blocker unexpectedly releases provider execution');
  assertCondition(recombination?.recombinationBlocker?.madeNewPaidCall === false, 'recombination blocker unexpectedly records a paid call');
  assertCondition(Array.isArray(recombination?.sourceImportLanes) && recombination.sourceImportLanes.length === 3, 'recombination blocker must preserve all three source lanes');
  assertCondition(recombination?.claims?.provesP4217ResidualSourceTheorem === false, 'recombination blocker unexpectedly proves p4217 source theorem');
  assertCondition(recombination?.claims?.provesSquareModuliUnionHittingUpperBound === false, 'recombination blocker unexpectedly proves square-moduli source theorem');
  assertCondition(recombination?.claims?.provesMod50AllFutureRecurrence === false, 'recombination blocker unexpectedly proves mod-50 recurrence');
  assertCondition(recombination?.claims?.provesAllN === false, 'recombination blocker unexpectedly proves all-N');
  assertCondition(recombination?.claims?.decidesProblem848 === false, 'recombination blocker unexpectedly decides Problem 848');

  const progress = readJsonIfPresent(options.progressJson);
  const theoremStatements = buildTheoremStatements(recombination.sourceImportLanes);
  const selectedProbe = theoremStatements.find((statement) => statement.rank === 1);

  return {
    schema: 'erdos.number_theory.p848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker_packet/1',
    packetId: 'P848_NO_SPEND_LOCAL_SOURCE_THEOREM_STATEMENT_BACKLOG_AFTER_ALL_N_RECOMBINATION_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker',
      recombinationBlocker: rel(options.recombinationBlocker),
      recombinationBlockerSha256: sha256File(options.recombinationBlocker),
    },
    backlogDecision: {
      status: 'three_source_import_theorem_statements_ranked_one_local_probe_selected',
      mode: 'no_spend_local_statement_backlog_after_all_n_recombination_blocker',
      openFrontierObligationCountAtInput: currentFrontierObligationCount(progress),
      sourceImportLaneCount: recombination.sourceImportLanes.length,
      theoremStatementCount: theoremStatements.length,
      selectedStatementId: selectedProbe.statementId,
      selectedLaneId: selectedProbe.laneId,
      selectedProbeId: selectedProbe.localProofProbe.probeId,
      selectedNextAction: NEXT_ACTION,
      reason: selectedProbe.reasonForRank,
      providerExecutionReleased: false,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
    },
    theoremStatements,
    selectedLocalProbe: selectedProbe.localProofProbe,
    sourceImportProfileStatus: recombination.sourceImportLanes.map((lane) => ({
      laneId: lane.laneId,
      status: lane.status,
      priority: lane.priority,
      profileId: lane.profileId ?? null,
      profilePath: lane.profilePath ?? null,
      liveReleaseCondition: lane.liveReleaseCondition ?? null,
    })),
    abstractionGateRecord: {
      status: 'satisfied_by_backlog_not_expansion',
      largerFamily: 'three source/import theorem-object family blocking all-N recombination',
      collapsingTheoremObject: 'one closed source/import theorem lane: mod-50 all-future generator/recurrence, square-moduli union/hitting source theorem, or p4217 residual partition/rank/source theorem',
      chosenRoute: 'local_proof_probe',
      chosenFamilyMember: selectedProbe.laneId,
      whyNoExpansion: 'This packet selects one theorem statement and one local proof probe instead of opening q-cover, singleton descent, provider execution, or a new finite frontier child.',
      writebackArtifact: rel(DEFAULT_JSON_OUTPUT),
    },
    futureUnblockConditions: [
      'The selected mod-50 local probe proves a symbolic recurrence, finite-Q partition, or restored generator theorem with audited denominator objects.',
      'The selected mod-50 local probe emits a precise statement-level gap, after which a future budget-guarded source audit may be selected if the no-spend instruction changes and usage is checked again.',
      'A later source/import decision closes the square-moduli or p4217 lane with an audited theorem, finite partition, or decreasing invariant.',
    ],
    forbiddenMovesAfterBacklog: [
      'execute_provider_source_import_under_current_no_spend_instruction',
      'run_erdos_orp_research_execute_allow_paid_this_turn',
      'rerun_the_same_broad_mod50_or_p4217_wedge_by_default',
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'try_fallback_selectors_one_by_one',
      'emit_a_naked_deterministic_rank_boundary',
      'treat_finite_mod50_replay_as_all_future_recurrence',
      'promote_tao_van_doorn_avoiding_bound_to_union_hitting_bound',
      'claim_all_n_recombination_from_profile_bound_lanes',
      'treat_bounded_finite_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Attempt the mod-50 generator/source theorem statement locally, or emit the exact gap naming the missing recurrence, finite-Q partition, or generator theorem source.',
      finiteDenominatorOrRankToken: 'p848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker',
      command: selectedProbe.localProofProbe.command,
    },
    proofBoundary: 'This packet completes the no-spend local theorem-statement backlog after the all-N recombination blocker. It states and ranks the three remaining source/import theorem objects, selects the mod-50 generator/source theorem as the cheapest deterministic local proof probe, and preserves provider gating. It does not prove the mod-50 recurrence, restore the generator, prove a finite-Q partition, import the square-moduli union/hitting theorem, prove a p4217 residual theorem, recombine all-N, or decide Problem 848.',
    claims: {
      completesNoSpendLocalSourceTheoremStatementBacklog: true,
      statesThreeSourceImportTheoremObjects: true,
      ranksThreeSourceImportTheoremObjects: true,
      selectsMod50AsCheapestLocalProbe: true,
      selectedProbeIsNoSpendLocal: true,
      preservesNoSpendProviderGating: true,
      liveExecutionApproved: false,
      profileExecutionReleased: false,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
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
    '# P848 no-spend local source theorem-statement backlog after all-N recombination blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Selected lane: \`${packet.backlogDecision.selectedLaneId}\``,
    `- Selected probe: \`${packet.backlogDecision.selectedProbeId}\``,
    `- Provider call made: \`${packet.backlogDecision.madeNewPaidCall}\``,
    '',
    '## Backlog Decision',
    '',
    packet.backlogDecision.reason,
    '',
    '## Theorem Statements',
    '',
    ...packet.theoremStatements.map((statement) => `- \`${statement.statementId}\` (rank ${statement.rank}): ${statement.targetTheoremStatement}`),
    '',
    '## Selected Local Probe',
    '',
    `- Probe: \`${packet.selectedLocalProbe.probeId}\``,
    `- Mode: \`${packet.selectedLocalProbe.mode}\``,
    `- Command: \`${packet.selectedLocalProbe.command}\``,
    `- Expected output: ${packet.selectedLocalProbe.expectedOutput}`,
    '',
    '## Abstraction Gate',
    '',
    `- Larger family: ${packet.abstractionGateRecord.largerFamily}`,
    `- Collapsing theorem object: ${packet.abstractionGateRecord.collapsingTheoremObject}`,
    `- Chosen route: \`${packet.abstractionGateRecord.chosenRoute}\``,
    `- Why no expansion: ${packet.abstractionGateRecord.whyNoExpansion}`,
    '',
    '## Forbidden Moves',
    '',
    ...packet.forbiddenMovesAfterBacklog.map((move) => `- \`${move}\``),
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
