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

const DEFAULT_RESIDUAL_PACKET = path.join(frontierBridge, 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_P4217_SOURCE_THEOREM_GAP_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_SOURCE_IMPORT_RECOVERY_PLAN_AFTER_P4217_AND_MOD50_SOURCE_GAPS_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_SOURCE_IMPORT_RECOVERY_PLAN_AFTER_P4217_AND_MOD50_SOURCE_GAPS_PACKET.md');

const TARGET = 'prepare_p848_source_import_recovery_plan_after_p4217_and_mod50_source_gaps';
const NEXT_ACTION = 'execute_p848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting';
const STATUS = 'source_import_recovery_plan_prepared_after_p4217_and_mod50_source_gaps';

const REQUIRED_SOURCE_PACKETS = [
  {
    id: 'post_p4217_gap_all_n_residual_assembly',
    path: 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_P4217_SOURCE_THEOREM_GAP_PACKET.json',
    role: 'Assembles the all-N residual after the p4217 source-theorem gap and selects source/import recovery.',
  },
  {
    id: 'p4217_residual_squarefree_realization_source_theorem_gap',
    path: 'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET.json',
    role: 'Names the p4217 residual finite-partition/rank/squarefree-realization source theorem gap.',
  },
  {
    id: 'p4217_theorem_wedge_decision_blocker',
    path: 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
    role: 'Records the single budget-guarded p4217 live wedge and its no-promotable-theorem result.',
  },
  {
    id: 'p4217_theorem_wedge_source_import_audit',
    path: 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_SOURCE_IMPORT_AUDIT_PACKET.json',
    role: 'Records the no-spend p4217 source/import audit before the live wedge.',
  },
  {
    id: 'mod50_all_future_recurrence_source_theorem_blocker',
    path: 'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json',
    role: 'Blocks promotion of bounded mod-50 CRT replay to an all-future recurrence without a source theorem.',
  },
  {
    id: 'mod50_source_archaeology_theorem_wedge',
    path: 'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json',
    role: 'Audits local mod-50 source surfaces and prepares the theorem wedge.',
  },
  {
    id: 'mod50_theorem_wedge_decision_blocker',
    path: 'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
    role: 'Records the mod-50 theorem-wedge decision blocker and preserves finite replay as bounded evidence.',
  },
  {
    id: 'corrected_square_moduli_dual_sieve_or_union_hitting_threshold',
    path: 'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json',
    role: 'Blocks the current Tao-van-Doorn shortcut for the required union/hitting upper-bound direction.',
  },
  {
    id: 'tao_van_doorn_threshold_pivot_reconciliation',
    path: 'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json',
    role: 'Records the direction and denominator reconciliation for the analytic threshold pivot.',
  },
];

const RECOVERY_LANES = [
  {
    laneId: 'p4217_residual_squarefree_realization_source',
    sourceObject: 'p848_p4217_residual_squarefree_realization_or_finite_partition',
    preferredSourceShape: 'squarefree values in every locally admissible residual CRT/arithmetic-progression/linear-family instance',
    acceptableClosures: [
      'finite complete CRT partition of the p4217 unavailable complement whose leaves are terminal, covered, or already discharged',
      'well-founded rank/invariant that strictly decreases on every unresolved p4217 residual transition',
      'source theorem guaranteeing squarefree values in every locally admissible residual CRT/arithmetic-progression/linear-family instance',
    ],
    localProbeCommand: 'rg -n "squarefree.*arithmetic progression|locally admissible|finite CRT partition|decreasing rank|p4217" packs src test',
    successArtifacts: [
      'p848_p4217_residual_squarefree_realization_source_theorem_packet',
      'p848_p4217_residual_finite_crt_partition_packet',
      'p848_p4217_residual_rank_decrease_packet',
    ],
    currentBoundary: 'The p4217 residual source-theorem gap packet proves no current finite partition, decreasing rank, or squarefree-realization source theorem is available among audited local packets.',
  },
  {
    laneId: 'mod50_all_future_recurrence_or_generator',
    sourceObject: 'p848_mod50_all_future_relevant_pair_recurrence_or_finite_q_partition',
    preferredSourceShape: 'original family-menu generator theorem or finite-Q partition for all future mod-50 relevant-pair rows',
    acceptableClosures: [
      'restored original family-menu generator theorem with hypotheses binding all future relevant-pair rows',
      'symbolic all-future mod-50 relevant-pair recurrence',
      'finite Q partition covering every future mod-50 square-witness domain',
    ],
    localProbeCommand: 'rg -n "mod-?50|relevant pair|family-menu|finite Q|all-future recurrence|generator theorem" packs src test',
    successArtifacts: [
      'p848_mod50_all_future_recurrence_source_theorem_packet',
      'p848_mod50_finite_q_partition_packet',
      'p848_restored_family_menu_generator_packet',
    ],
    currentBoundary: 'The mod-50 source blocker, archaeology handoff, and theorem-wedge decision blocker do not restore an all-future recurrence, finite-Q partition, or generator theorem.',
  },
  {
    laneId: 'square_moduli_union_hitting_threshold',
    sourceObject: 'p848_square_moduli_union_hitting_or_threshold_source',
    preferredSourceShape: 'union/hitting upper bound for square moduli with constants compatible with Sawhney Lemma 2.1 and Lemma 2.2',
    acceptableClosures: [
      'direct upper-bound theorem for the relevant square-moduli union/hitting sets',
      'corrected dual-sieve theorem that supplies the missing inequality direction with constants',
      'imported explicit-threshold theorem whose hypotheses and constants are audited against the Problem 848 domains',
    ],
    localProbeCommand: 'rg -n "union.*hitting|hitting.*union|square moduli|Tao|van Doorn|Sawhney|Lemma 2\\\\.1|Lemma 2\\\\.2" packs src test',
    successArtifacts: [
      'p848_square_moduli_union_hitting_threshold_source_packet',
      'p848_corrected_dual_sieve_threshold_packet',
      'p848_verified_exact_threshold_extension_packet',
    ],
    currentBoundary: 'The corrected square-moduli no-go packet shows Tao-van-Doorn plus complement duality does not supply the required union/hitting upper bound under current repo sources.',
  },
];

function parseArgs(argv) {
  const options = {
    residualPacket: DEFAULT_RESIDUAL_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--residual-packet') {
      options.residualPacket = path.resolve(argv[index + 1]);
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

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sourcePacketSummary(source) {
  const absolutePath = path.join(frontierBridge, source.path);
  const exists = fs.existsSync(absolutePath);
  const doc = exists ? readJson(absolutePath) : null;
  return {
    id: source.id,
    relativePath: rel(absolutePath),
    exists,
    sha256: exists ? sha256File(absolutePath) : null,
    status: doc?.status ?? null,
    packetId: doc?.packetId ?? null,
    target: doc?.target ?? null,
    recommendedNextAction: doc?.recommendedNextAction ?? null,
    role: source.role,
  };
}

function buildPacket(options) {
  const residual = readJson(options.residualPacket);
  assertCondition(residual?.recommendedNextAction === TARGET, 'residual assembly does not route to the source/import recovery plan target');
  assertCondition(residual?.claims?.completesPostP4217GapResidualAssembly === true, 'residual assembly does not close the post-p4217-gap assembly step');
  assertCondition(residual?.claims?.selectedNextActionIsSourceImportRecovery === true, 'residual assembly did not select source/import recovery');
  assertCondition(residual?.claims?.madeNewPaidCall === false, 'residual assembly unexpectedly records a new paid call');
  assertCondition(residual?.claims?.provesAllN === false, 'residual assembly unexpectedly proves all-N');

  const sourcePackets = REQUIRED_SOURCE_PACKETS.map(sourcePacketSummary);
  const missingSources = sourcePackets.filter((source) => !source.exists);
  assertCondition(missingSources.length === 0, `missing source/import recovery input packet(s): ${missingSources.map((source) => source.relativePath).join(', ')}`);

  return {
    schema: 'erdos.number_theory.p848_source_import_recovery_plan_after_p4217_and_mod50_source_gaps_packet/1',
    packetId: 'P848_SOURCE_IMPORT_RECOVERY_PLAN_AFTER_P4217_AND_MOD50_SOURCE_GAPS_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_source_import_recovery_plan',
      residualPacket: rel(options.residualPacket),
      residualSha256: sha256File(options.residualPacket),
    },
    sourcePackets,
    recoveryPlanVerdict: {
      status: 'prepared_no_spend_recovery_plan_for_source_theorem_gaps',
      madeNewPaidCall: false,
      localExecutionRequired: true,
      allNProofAvailable: false,
      finiteMeasureDecreased: false,
      summary: 'The remaining all-N blockers are source-theorem/import gaps, so the next move is a bounded local source recovery search across p4217, mod-50, and square-moduli union/hitting lanes.',
    },
    recoveryLanes: RECOVERY_LANES,
    localProbePlan: {
      executionMode: 'no_spend_local_repository_search_first',
      commands: RECOVERY_LANES.map((lane) => ({
        laneId: lane.laneId,
        command: lane.localProbeCommand,
        successArtifacts: lane.successArtifacts,
      })),
      failureBoundary: 'If these probes do not recover a promotable theorem/source/generator, emit a formal source-import gap/approval packet naming the exact external inputs still needed before any future live lane.',
    },
    paidCallPolicy: {
      default: 'do_not_call_provider',
      preconditionsBeforeAnyFutureLiveCall: [
        'Local probes have been executed and summarized in a packet.',
        'A repaired single-lane profile names the exact source theorem or import target.',
        'erdos orp research usage --json confirms remaining run count and local USD budget.',
        'The live purpose is source-audit/theorem-import recovery, not routine verification or broad fishing.',
      ],
      forbiddenThisStep: [
        'rerun_the_same_p4217_paid_wedge',
        'rerun_the_same_mod50_paid_wedge',
        'make_any_live_orp_openai_call',
      ],
    },
    forbiddenMovesUntilSourceRecoveryChangesBoundary: [
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'emit_a_naked_deterministic_rank_boundary',
      'try_fallback_selectors_one_by_one',
      'claim_tao_van_doorn_plus_exact_verifier_decides_848_without_union_hitting_source',
      'claim_N0_around_1e6_or_N0_at_most_40500_without_imported_threshold_source',
      'treat_bounded_40500_or_280_row_menu_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Execute the no-spend local source recovery search across the p4217 residual, mod-50 all-future recurrence/generator, and square-moduli union/hitting lanes; packetize any recovered theorem source or emit the exact residual-source import gap.',
      finiteDenominatorOrRankToken: 'p848_source_import_recovery_plan_after_p4217_and_mod50_source_gaps',
      command: './bin/erdos problem progress 848 --json',
      verificationCommand: RECOVERY_LANES[0].localProbeCommand,
    },
    proofBoundary: 'This packet prepares the no-spend source/import recovery plan after the p4217 and mod-50 source gaps. It does not recover a p4217 squarefree-realization theorem, finite partition, decreasing rank, mod-50 all-future recurrence, finite-Q partition, square-moduli union/hitting threshold, post-40500 sufficiency theorem, all-N recombination theorem, or Problem 848.',
    claims: {
      completesSourceImportRecoveryPlan: true,
      madeNewPaidCall: false,
      respectsNoPaidByDefault: true,
      preparesP4217SourceRecovery: true,
      preparesMod50SourceRecovery: true,
      preparesUnionHittingSourceRecovery: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      selectsNoSpendSourceSearch: true,
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
    '# P848 source/import recovery plan after p4217 and mod-50 source gaps',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    '',
    '## Verdict',
    '',
    packet.recoveryPlanVerdict.summary,
    '',
    '## Recovery Lanes',
    '',
    packet.recoveryLanes.map((lane) => [
      `### ${lane.laneId}`,
      '',
      `- Source object: \`${lane.sourceObject}\``,
      `- Preferred shape: ${lane.preferredSourceShape}`,
      `- Local probe: \`${lane.localProbeCommand}\``,
      `- Boundary: ${lane.currentBoundary}`,
    ].join('\n')).join('\n\n'),
    '',
    '## Source Packets',
    '',
    packet.sourcePackets.map((source) => `- \`${source.id}\`: ${source.role}`).join('\n'),
    '',
    '## Paid Call Policy',
    '',
    `Default: \`${packet.paidCallPolicy.default}\``,
    '',
    '## Next Action',
    '',
    `\`${packet.oneNextAction.stepId}\`: ${packet.oneNextAction.action}`,
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesUntilSourceRecoveryChangesBoundary.map((move) => `- \`${move}\``).join('\n'),
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
