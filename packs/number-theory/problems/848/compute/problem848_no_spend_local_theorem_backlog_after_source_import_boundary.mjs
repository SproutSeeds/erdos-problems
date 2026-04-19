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

const DEFAULT_BOUNDARY_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_LOCAL_P4217_HARD_BLOCKER_PACKET.json');
const DEFAULT_P4217_HARD_BLOCKER_PACKET = path.join(frontierBridge, 'P848_LOCAL_P4217_RESIDUAL_SOURCE_THEOREM_PROOF_ATTEMPT_HARD_BLOCKER_PACKET.json');
const DEFAULT_MOD50_WEDGE_BLOCKER_PACKET = path.join(frontierBridge, 'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json');
const DEFAULT_SQUARE_MODULI_NO_GO_PACKET = path.join(frontierBridge, 'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_LOCAL_THEOREM_BACKLOG_AFTER_SOURCE_IMPORT_BOUNDARY_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_LOCAL_THEOREM_BACKLOG_AFTER_SOURCE_IMPORT_BOUNDARY_PACKET.md');
const DEFAULT_PROGRESS_JSON = path.join(problemDir, 'PROGRESS.json');

const TARGET = 'prepare_p848_no_spend_local_theorem_backlog_after_source_import_boundary';
const NEXT_ACTION = 'execute_p848_square_moduli_union_hitting_source_index_no_spend_audit';
const STATUS = 'no_spend_local_theorem_backlog_prepared_after_source_import_boundary';

const SOURCE_INDEX_AUDIT_COMMAND = 'rg -n "(union|hitting|large sieve|square moduli|Tao|van Doorn|Sawhney|Appendix A|Theorem 16|avoiding)" packs/number-theory/problems/848 docs src test';

function parseArgs(argv) {
  const options = {
    boundaryPacket: DEFAULT_BOUNDARY_PACKET,
    p4217HardBlockerPacket: DEFAULT_P4217_HARD_BLOCKER_PACKET,
    mod50WedgeBlockerPacket: DEFAULT_MOD50_WEDGE_BLOCKER_PACKET,
    squareModuliNoGoPacket: DEFAULT_SQUARE_MODULI_NO_GO_PACKET,
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
    } else if (arg === '--p4217-hard-blocker-packet') {
      options.p4217HardBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--mod50-wedge-blocker-packet') {
      options.mod50WedgeBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--square-moduli-no-go-packet') {
      options.squareModuliNoGoPacket = path.resolve(argv[index + 1]);
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

function buildPacket(options) {
  const boundary = readJson(options.boundaryPacket);
  assertCondition(boundary?.status === 'no_spend_source_import_boundary_assembled_after_local_p4217_hard_blocker', 'source/import boundary packet has unexpected status');
  assertCondition(boundary?.target === 'assemble_p848_no_spend_source_import_boundary_after_local_p4217_hard_blocker', 'source/import boundary packet has unexpected target');
  assertCondition(boundary?.recommendedNextAction === TARGET, 'source/import boundary does not route to this backlog step');
  assertCondition(Array.isArray(boundary?.remainingTheoremObjects) && boundary.remainingTheoremObjects.length === 3, 'source/import boundary must name exactly three theorem objects');
  assertCondition(boundary?.claims?.madeNewPaidCall === false, 'source/import boundary unexpectedly records a paid call');
  assertCondition(boundary?.claims?.blocksQCoverExpansion === true, 'source/import boundary must keep q-cover expansion blocked');
  assertCondition(boundary?.claims?.blocksSingletonQDescent === true, 'source/import boundary must keep singleton descent blocked');
  assertCondition(boundary?.claims?.provesAllN === false, 'source/import boundary unexpectedly proves all-N');

  const p4217HardBlocker = readJson(options.p4217HardBlockerPacket);
  assertCondition(p4217HardBlocker?.status === 'local_p4217_residual_source_theorem_proof_attempt_hard_blocker_emitted', 'p4217 hard blocker packet has unexpected status');
  assertCondition(p4217HardBlocker?.claims?.foundFiniteP4217Partition === false, 'p4217 hard blocker unexpectedly found a finite partition');
  assertCondition(p4217HardBlocker?.claims?.foundP4217ResidualRankDecrease === false, 'p4217 hard blocker unexpectedly found a residual rank');
  assertCondition(p4217HardBlocker?.claims?.foundSquarefreeRealizationSourceTheorem === false, 'p4217 hard blocker unexpectedly found a source theorem');

  const mod50WedgeBlocker = readJson(options.mod50WedgeBlockerPacket);
  assertCondition(
    [
      'mod50_theorem_wedge_decision_blocker_emitted_no_all_future_recurrence_theorem',
      'mod50_theorem_wedge_decision_blocker_emitted_budget_guarded_live_incomplete_no_universal_theorem',
    ].includes(mod50WedgeBlocker?.status),
    'mod-50 wedge blocker packet has unexpected status',
  );
  assertCondition(
    mod50WedgeBlocker?.claims?.provesAllFutureMod50Recurrence === false
      || mod50WedgeBlocker?.claims?.provesSymbolicRelevantPairRecurrence === false,
    'mod-50 wedge blocker unexpectedly proves recurrence',
  );

  const squareModuliNoGo = readJson(options.squareModuliNoGoPacket);
  assertCondition(
    [
      'corrected_square_moduli_dual_sieve_or_union_hitting_threshold_no_go_emitted',
      'corrected_square_moduli_sieve_no_go_current_sources_handoff_to_p4217',
    ].includes(squareModuliNoGo?.status),
    'square-moduli no-go packet has unexpected status',
  );
  assertCondition(squareModuliNoGo?.claims?.provesComplementDualityDoesNotRepairDirection === true, 'square-moduli no-go packet must preserve the direction blocker');
  assertCondition(
    squareModuliNoGo?.claims?.provesSawhneyUnionHittingUpperBound === false
      || squareModuliNoGo?.claims?.provesUnionHittingThresholdBound === false,
    'square-moduli no-go packet unexpectedly proves union/hitting upper bound',
  );

  const progress = readJsonIfPresent(options.progressJson);

  return {
    schema: 'erdos.number_theory.p848_no_spend_local_theorem_backlog_after_source_import_boundary_packet/1',
    packetId: 'P848_NO_SPEND_LOCAL_THEOREM_BACKLOG_AFTER_SOURCE_IMPORT_BOUNDARY_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_local_theorem_backlog_selection',
      boundaryPacket: rel(options.boundaryPacket),
      boundarySha256: sha256File(options.boundaryPacket),
      p4217HardBlockerPacket: rel(options.p4217HardBlockerPacket),
      p4217HardBlockerSha256: sha256File(options.p4217HardBlockerPacket),
      mod50WedgeBlockerPacket: rel(options.mod50WedgeBlockerPacket),
      mod50WedgeBlockerSha256: sha256File(options.mod50WedgeBlockerPacket),
      squareModuliNoGoPacket: rel(options.squareModuliNoGoPacket),
      squareModuliNoGoSha256: sha256File(options.squareModuliNoGoPacket),
    },
    backlogDecision: {
      status: 'prepared_local_only_backlog',
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      openFrontierObligationCountAtInput: currentFrontierObligationCount(progress),
      selectionRule: 'Prefer the theorem object that is orthogonal to the freshly hard-blocked p4217 local proof and the already failed/bounded mod-50 wedge, while remaining executable with local/free source-index work and no finite frontier expansion.',
      selectedBacklogItemId: 'square_moduli_union_hitting_local_backlog',
      selectedNextAction: NEXT_ACTION,
      selectedReason: 'The p4217 residual lane has just been locally hard-blocked, and the mod-50 recurrence/generator lane already has a source blocker, archaeology packet, and wedge decision blocker. The square-moduli lane is a distinct source/import theorem gap: the current repo only has avoiding-side Tao-van-Doorn evidence and a direction blocker, so a no-spend source-index audit for the missing union/hitting upper-bound direction and constants is the cleanest next local probe.',
    },
    backlogItems: [
      {
        itemId: 'p4217_residual_partition_rank_or_squarefree_source_local_backlog',
        priority: 2,
        disposition: 'defer_after_fresh_local_hard_blocker',
        currentEvidence: 'The local p4217 residual proof attempt found no finite CRT partition, residual rank, or squarefree-realization source theorem.',
        allowedFutureWork: 'Only a new theorem statement, finite partition candidate, rank proof, or future guarded source import should reopen this lane.',
        forbiddenWork: 'Do not resume fallback-selector or q-cover descent from this backlog.',
      },
      {
        itemId: 'mod50_generator_or_recurrence_local_backlog',
        priority: 3,
        disposition: 'defer_until_concrete_generator_or_denominator_clue',
        currentEvidence: 'The mod-50 source blocker, archaeology packet, and theorem-wedge decision blocker found finite replay evidence but no all-future recurrence/generator theorem.',
        allowedFutureWork: 'Reopen when a concrete generator filename, finite-Q denominator, or recurrence source target appears.',
        forbiddenWork: 'Do not promote finite replay or 280-row menu evidence as all-future coverage.',
      },
      {
        itemId: 'square_moduli_union_hitting_local_backlog',
        priority: 1,
        disposition: 'selected_for_no_spend_source_index_audit',
        currentEvidence: 'The corrected square-moduli packet proves the current Tao-van-Doorn avoiding-side theorem and complement duality do not supply the Sawhney union/hitting upper-bound direction.',
        allowedFutureWork: 'Run a local/free source-index audit for union/hitting square-moduli theorems with audited inequality direction, hypotheses, constants, and threshold relevance.',
        forbiddenWork: 'Do not claim an analytic N0 or threshold before a valid union/hitting theorem source is packetized.',
      },
    ],
    nextProbe: {
      stepId: NEXT_ACTION,
      mode: 'no_spend_source_index_audit',
      sourceIndexAuditCommand: SOURCE_INDEX_AUDIT_COMMAND,
      auditQuestion: 'Is there a local/free source theorem, distinct from the current Tao-van-Doorn avoiding-side bound, that gives Sawhney-compatible union/hitting upper bounds for square moduli with usable hypotheses/constants?',
      successCriteria: [
        'A source theorem with the union/hitting upper-bound direction is found and its hypotheses/constants are auditable against the 848/Sawhney setup.',
        'Or the audit emits a sharper no-source blocker explaining exactly which theorem direction and constants remain absent.',
      ],
      failureBoundary: 'If the source-index audit finds only avoiding-set upper bounds, lower bounds, threshold heuristics, or existing no-go packets, it must emit a no-spend source-index blocker and must not lower N0 or decide 848.',
    },
    noSpendPolicy: {
      madeNewPaidCall: false,
      futurePaidExecutionAllowedByThisPacket: false,
      providerExecutionThisTurn: 'blocked',
      usageCheckRequiredThisTurn: false,
      futureReleaseRequires: [
        'explicit future approval',
        'local usage and USD guard check',
        'single theorem/source target',
        'audited proof-boundary packet before promotion',
      ],
    },
    forbiddenMovesAfterBacklog: [
      'execute_provider_source_import_without_future_guarded_approval',
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'emit_a_naked_deterministic_rank_boundary',
      'try_fallback_selectors_one_by_one',
      'rerun_the_same_p4217_paid_wedge_by_default',
      'claim_tao_van_doorn_plus_exact_verifier_decides_848_without_union_hitting_source',
      'claim_N0_around_1e6_or_N0_at_most_40500_without_imported_threshold_source',
      'treat_bounded_finite_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Execute a no-spend source-index audit for the square-moduli union/hitting upper-bound theorem direction and constants, using local/free sources only and emitting a source theorem packet or sharper no-source blocker.',
      finiteDenominatorOrRankToken: 'p848_square_moduli_union_hitting_source_index_no_spend_audit',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet completes the no-spend local theorem backlog after the source/import boundary. It selects the square-moduli union/hitting source-index audit as the next local-only theorem probe because p4217 has just been hard-blocked locally and mod-50 already has source/wedge blockers. It does not execute any provider call, prove a p4217 complement theorem, prove a mod-50 recurrence/generator theorem, prove a Sawhney-compatible union/hitting theorem, lower any threshold, prove all-N recombination, or decide Problem 848.',
    claims: {
      completesNoSpendLocalTheoremBacklog: true,
      selectsExactlyOneBacklogItem: true,
      selectedBacklogItemIsSquareModuliUnionHitting: true,
      selectedNextActionIsSourceIndexAudit: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      providerExecutionBlockedThisTurn: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      provesFiniteP4217Partition: false,
      provesP4217ResidualRankDecrease: false,
      provesSquarefreeRealizationSourceTheorem: false,
      provesMod50AllFutureRecurrence: false,
      provesSawhneyUnionHittingUpperBound: false,
      lowersAnalyticThreshold: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 no-spend local theorem backlog after source/import boundary',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Paid/API call made: \`${packet.backlogDecision.madeNewPaidCall}\``,
    '',
    '## Selected Backlog Item',
    '',
    `- Item: \`${packet.backlogDecision.selectedBacklogItemId}\``,
    `- Reason: ${packet.backlogDecision.selectedReason}`,
    '',
    '## Backlog',
    '',
    packet.backlogItems.map((item) => [
      `### ${item.itemId}`,
      '',
      `- Priority: \`${item.priority}\``,
      `- Disposition: \`${item.disposition}\``,
      `- Current evidence: ${item.currentEvidence}`,
      `- Allowed future work: ${item.allowedFutureWork}`,
      `- Forbidden work: ${item.forbiddenWork}`,
      '',
    ].join('\n')).join('\n'),
    '## Next Probe',
    '',
    `- Step: \`${packet.nextProbe.stepId}\``,
    `- Command: \`${packet.nextProbe.sourceIndexAuditCommand}\``,
    `- Question: ${packet.nextProbe.auditQuestion}`,
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesAfterBacklog.map((item) => `- ${item}`).join('\n'),
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
