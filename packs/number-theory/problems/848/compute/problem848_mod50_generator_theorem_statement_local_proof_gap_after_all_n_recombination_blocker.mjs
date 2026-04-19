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

const DEFAULT_BACKLOG_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_LOCAL_SOURCE_THEOREM_STATEMENT_BACKLOG_AFTER_ALL_N_RECOMBINATION_BLOCKER_PACKET.json');
const DEFAULT_RELEVANT_PAIR_BLOCKER_PACKET = path.join(frontierBridge, 'P848_MOD50_RELEVANT_PAIR_ENUMERATOR_GENERATOR_BLOCKER_PACKET.json');
const DEFAULT_SEQUENCE_STABILITY_BLOCKER_PACKET = path.join(frontierBridge, 'P848_MOD50_RESTORED_MENU_SEQUENCE_STABILITY_BLOCKER_PACKET.json');
const DEFAULT_MENU_GENERATOR_AUDIT_PACKET = path.join(frontierBridge, 'P848_MOD50_MENU_GENERATOR_RESTORATION_AUDIT_PACKET.json');
const DEFAULT_EXACT_REPLAY_PACKET = path.join(frontierBridge, 'P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET.json');
const DEFAULT_SOURCE_THEOREM_BLOCKER_PACKET = path.join(frontierBridge, 'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json');
const DEFAULT_SOURCE_ARCHAEOLOGY_WEDGE_PACKET = path.join(frontierBridge, 'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json');
const DEFAULT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET = path.join(frontierBridge, 'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json');
const DEFAULT_PROFILE_BLOCKER_PACKET = path.join(frontierBridge, 'P848_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE_NO_SPEND_BLOCKER_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_MOD50_GENERATOR_THEOREM_STATEMENT_LOCAL_PROOF_GAP_AFTER_ALL_N_RECOMBINATION_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_MOD50_GENERATOR_THEOREM_STATEMENT_LOCAL_PROOF_GAP_AFTER_ALL_N_RECOMBINATION_BLOCKER_PACKET.md');

const TARGET = 'attempt_p848_mod50_generator_theorem_statement_local_proof_or_emit_gap_after_all_n_recombination_blocker';
const NEXT_ACTION = 'assemble_p848_no_spend_source_import_boundary_after_mod50_local_statement_gap';
const STATUS = 'mod50_generator_theorem_statement_local_proof_gap_after_all_n_recombination_blocker_emitted';
const AUDIT_COMMAND = 'rg -n "mod-50|mod50|finite-Q|finite Q|all-future|relevant-pair|relevant pair|generator|family-menu|family menu" packs/number-theory/problems/848 src test';

function parseArgs(argv) {
  const options = {
    backlogPacket: DEFAULT_BACKLOG_PACKET,
    relevantPairBlockerPacket: DEFAULT_RELEVANT_PAIR_BLOCKER_PACKET,
    sequenceStabilityBlockerPacket: DEFAULT_SEQUENCE_STABILITY_BLOCKER_PACKET,
    menuGeneratorAuditPacket: DEFAULT_MENU_GENERATOR_AUDIT_PACKET,
    exactReplayPacket: DEFAULT_EXACT_REPLAY_PACKET,
    sourceTheoremBlockerPacket: DEFAULT_SOURCE_THEOREM_BLOCKER_PACKET,
    sourceArchaeologyWedgePacket: DEFAULT_SOURCE_ARCHAEOLOGY_WEDGE_PACKET,
    theoremWedgeDecisionBlockerPacket: DEFAULT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET,
    profileBlockerPacket: DEFAULT_PROFILE_BLOCKER_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--backlog-packet') {
      options.backlogPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--relevant-pair-blocker-packet') {
      options.relevantPairBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--sequence-stability-blocker-packet') {
      options.sequenceStabilityBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--menu-generator-audit-packet') {
      options.menuGeneratorAuditPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--exact-replay-packet') {
      options.exactReplayPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--source-theorem-blocker-packet') {
      options.sourceTheoremBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--source-archaeology-wedge-packet') {
      options.sourceArchaeologyWedgePacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--theorem-wedge-decision-blocker-packet') {
      options.theoremWedgeDecisionBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--profile-blocker-packet') {
      options.profileBlockerPacket = path.resolve(argv[index + 1]);
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

function sourceRecord(id, filePath, doc, usefulFact, gapInterpretation) {
  return {
    id,
    relativePath: rel(filePath),
    sha256: sha256File(filePath),
    status: doc?.status ?? null,
    recommendedNextAction: doc?.recommendedNextAction ?? null,
    usefulFact,
    gapInterpretation,
    provesAllFutureRecurrence: false,
    provesFiniteQPartition: false,
    restoresOriginalGenerator: false,
    provesAllN: false,
  };
}

function buildPacket(options) {
  const backlog = readJson(options.backlogPacket);
  assertCondition(backlog?.status === 'no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker_prepared', 'backlog packet has unexpected status');
  assertCondition(backlog?.target === 'prepare_p848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker', 'backlog packet has unexpected target');
  assertCondition(backlog?.recommendedNextAction === TARGET, 'backlog packet does not route to this local proof attempt');
  assertCondition(backlog?.backlogDecision?.selectedLaneId === 'mod50_generator_source_import', 'backlog does not select the mod-50 source lane');
  assertCondition(backlog?.backlogDecision?.selectedProbeId === 'mod50_generator_statement_source_denominator_audit', 'backlog does not select the mod-50 denominator audit');
  assertCondition(backlog?.backlogDecision?.madeNewPaidCall === false, 'backlog unexpectedly records a paid call');
  assertCondition(backlog?.backlogDecision?.providerExecutionReleased === false, 'backlog unexpectedly releases provider execution');
  assertCondition(backlog?.claims?.blocksFiniteReplayAsAllFuture === true, 'backlog must block finite replay overclaim');
  assertCondition(backlog?.claims?.provesMod50AllFutureRecurrence === false, 'backlog unexpectedly proves mod-50 recurrence');
  assertCondition(backlog?.claims?.restoresOriginalGenerator === false, 'backlog unexpectedly restores generator');
  assertCondition(backlog?.claims?.provesFiniteQPartition === false, 'backlog unexpectedly proves finite-Q partition');

  const relevantPairBlocker = readJson(options.relevantPairBlockerPacket);
  const sequenceStabilityBlocker = readJson(options.sequenceStabilityBlockerPacket);
  const menuGeneratorAudit = readJson(options.menuGeneratorAuditPacket);
  const exactReplay = readJson(options.exactReplayPacket);
  const sourceTheoremBlocker = readJson(options.sourceTheoremBlockerPacket);
  const sourceArchaeologyWedge = readJson(options.sourceArchaeologyWedgePacket);
  const theoremWedgeDecisionBlocker = readJson(options.theoremWedgeDecisionBlockerPacket);
  const profileBlocker = readJson(options.profileBlockerPacket);

  assertCondition(relevantPairBlocker?.claims?.provesParametricEnumeratorAbsentLocally === true, 'relevant-pair blocker must record absent local enumerator');
  assertCondition(sequenceStabilityBlocker?.claims?.provesSequenceNotStableRecurrence === true, 'sequence stability blocker must reject recurrence promotion');
  assertCondition(menuGeneratorAudit?.claims?.provesFamilyMenuGeneratorAbsentLocally === true, 'menu-generator audit must record absent local generator');
  assertCondition(exactReplay?.claims?.provesOriginalGeneratorRestored === false, 'exact replay unexpectedly restores original generator');
  assertCondition(exactReplay?.claims?.provesSymbolicRelevantPairRecurrence === false, 'exact replay unexpectedly proves recurrence');
  assertCondition(exactReplay?.claims?.provesFiniteQPartition === false, 'exact replay unexpectedly proves finite-Q partition');
  assertCondition(sourceTheoremBlocker?.claims?.provesRepoOwnedAllFutureRecurrenceAbsent === true, 'source theorem blocker must record absent all-future recurrence');
  assertCondition(sourceArchaeologyWedge?.claims?.livePaidCallMade === false, 'source archaeology wedge unexpectedly made a paid call');
  assertCondition(theoremWedgeDecisionBlocker?.claims?.provesSymbolicRelevantPairRecurrence === false, 'theorem wedge decision unexpectedly proves recurrence');
  assertCondition(profileBlocker?.claims?.madeNewPaidCall === false, 'profile blocker unexpectedly records a paid call');
  assertCondition(profileBlocker?.claims?.provesMod50AllFutureRecurrence === false, 'profile blocker unexpectedly proves recurrence');

  const auditedEvidence = [
    sourceRecord(
      'selected_backlog_statement',
      options.backlogPacket,
      backlog,
      'The backlog selected the mod-50 generator/source-import theorem statement as the cheapest deterministic no-spend local probe.',
      'Selection is not proof; it preserves provider gating and routes to this local audit.',
    ),
    sourceRecord(
      'relevant_pair_enumerator_generator_blocker',
      options.relevantPairBlockerPacket,
      relevantPairBlocker,
      'The parametric relevant-pair enumerator remains blocked by absent generator/source objects.',
      'Without this enumerator, the universal square-witness domain cannot be promoted from finite snapshots.',
    ),
    sourceRecord(
      'restored_menu_sequence_stability_blocker',
      options.sequenceStabilityBlockerPacket,
      sequenceStabilityBlocker,
      'The restored SIX_PREFIX menu sequence is finite and unstable at late transitions.',
      'The finite snapshots do not define a stable recurrence or finite-Q partition for future rows.',
    ),
    sourceRecord(
      'menu_generator_restoration_audit',
      options.menuGeneratorAuditPacket,
      menuGeneratorAudit,
      'Finite chunk/CRT provenance exists, but no local source command emits the family menus or proves their ordering.',
      'The original generator theorem is not restored locally.',
    ),
    sourceRecord(
      'exact_bounded_crt_menu_replay_theorem',
      options.exactReplayPacket,
      exactReplay,
      'The bounded CRT replay theorem exactly reproduces restored finite menus.',
      'Its scope is finite restored-menu replay, not an all-future recurrence, generator theorem, or finite-Q partition.',
    ),
    sourceRecord(
      'all_future_recurrence_source_theorem_blocker',
      options.sourceTheoremBlockerPacket,
      sourceTheoremBlocker,
      'The earlier source-theorem blocker already audited the same universal recurrence boundary.',
      'It recorded that the repo lacks the needed source theorem after bounded finite replay.',
    ),
    sourceRecord(
      'source_archaeology_theorem_wedge',
      options.sourceArchaeologyWedgePacket,
      sourceArchaeologyWedge,
      'Local archaeology prepared a theorem-wedge question and made no live provider call.',
      'The wedge is discovery scaffolding, not a repo-owned theorem object.',
    ),
    sourceRecord(
      'theorem_wedge_decision_blocker',
      options.theoremWedgeDecisionBlockerPacket,
      theoremWedgeDecisionBlocker,
      'The prior mod-50 theorem-wedge decision remained a blocker rather than a recurrence proof.',
      'It did not produce a promotable all-future recurrence or finite-Q partition for this local step.',
    ),
    sourceRecord(
      'mod50_generator_source_import_profile_blocker',
      options.profileBlockerPacket,
      profileBlocker,
      'The repaired profile names the missing theorem and blocks live execution under no-spend instructions.',
      'A future source import profile is not proof until executed under a guard and audited into a theorem packet.',
    ),
  ];

  return {
    schema: 'erdos.number_theory.p848_mod50_generator_theorem_statement_local_proof_gap_after_all_n_recombination_blocker_packet/1',
    packetId: 'P848_MOD50_GENERATOR_THEOREM_STATEMENT_LOCAL_PROOF_GAP_AFTER_ALL_N_RECOMBINATION_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_mod50_generator_theorem_statement_local_gap_after_denominator_audit',
      backlogPacket: rel(options.backlogPacket),
      backlogPacketSha256: sha256File(options.backlogPacket),
      selectedProbeId: backlog.backlogDecision.selectedProbeId,
      selectedLaneId: backlog.backlogDecision.selectedLaneId,
    },
    localProofAttempt: {
      status: 'attempted_no_promotable_local_theorem_found',
      selectedProbeId: 'mod50_generator_statement_source_denominator_audit',
      mode: 'local_no_spend_source_archaeology_and_statement_proof_attempt',
      command: AUDIT_COMMAND,
      commandWasExecutedLocallyByDelegate: true,
      madeNewPaidCall: false,
      usageCheckRun: false,
      currentStepAllowsPaidCall: false,
      providerExecutionReleased: false,
      result: 'gap_emitted_no_repo_owned_all_future_recurrence_finite_q_partition_or_original_generator_theorem',
      interpretation: 'The audit surface contains finite menu replay, source/profile scaffolding, prior local blockers, runtime/test control-plane language, and bounded CRT enumerators. It does not contain a repo-owned theorem proving the all-future mod-50 relevant-pair recurrence, a finite-Q partition, or a restored original family-menu generator with audited denominator and transition objects.',
    },
    missingTheoremStatement: {
      statementId: 'mod50_generator_all_future_recurrence_or_finite_q_partition',
      laneId: 'mod50_generator_source_import',
      exactMissingStatement: 'For every future row in the mod-50 square-witness relevant-pair domain, prove a restored original family-menu generator theorem, a symbolic all-future relevant-pair recurrence, or a finite-Q partition with audited denominator and transition objects.',
      mustCover: [
        'future rows beyond SIX_PREFIX_NINETEEN through SIX_PREFIX_TWENTY_FOUR',
        'future rows beyond compact 1..40500 finite evidence',
        'the relevant-pair denominator and bad-residue lane objects',
        'future square-witness moduli and known-failure insertions',
        'the transition rule that turns finite menu replay into instances of a theorem',
      ],
      unacceptableSubstitutes: [
        'finite restored-menu replay',
        'the 280-row TWENTY_FOUR finite menu',
        'bounded CRT enumerator reproduction without an all-future proof',
        'a future-use ORP/OpenAI source-import profile that has not been executed and audited',
        'q-cover or singleton selector evidence from the p4217 complement lane',
      ],
    },
    theoremForkVerdict: {
      restoredOriginalGeneratorTheorem: {
        found: false,
        reason: 'The local menu-generator audit records finite chunk/CRT provenance but no source command or proof object that emits and orders all future family-menu rows.',
      },
      symbolicAllFutureRelevantPairRecurrence: {
        found: false,
        reason: 'The restored finite menu sequence is explicitly unstable at late transitions and no symbolic recurrence replacing it was found.',
      },
      finiteQPartition: {
        found: false,
        reason: 'No audited theorem proves a complete finite partition of all future Q/denominator transition classes for the mod-50 square-witness relevant-pair domain.',
      },
    },
    auditedEvidence,
    auditClassification: [
      {
        bucketId: 'finite_replay_and_bounded_enumerators',
        verdict: 'useful_finite_evidence_not_all_future_theorem',
        examples: [
          'P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET',
          'P848_MOD50_BOUNDED_CRT_MENU_ENUMERATOR_AUDIT_PACKET',
          'P848_EXACT_40500_COMPACT_PROMOTION_PACKET',
        ],
      },
      {
        bucketId: 'generator_and_recurrence_absence_blockers',
        verdict: 'negative_local_source_evidence',
        examples: [
          'P848_MOD50_RELEVANT_PAIR_ENUMERATOR_GENERATOR_BLOCKER_PACKET',
          'P848_MOD50_RESTORED_MENU_SEQUENCE_STABILITY_BLOCKER_PACKET',
          'P848_MOD50_MENU_GENERATOR_RESTORATION_AUDIT_PACKET',
          'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET',
        ],
      },
      {
        bucketId: 'profile_and_theorem_wedge_scaffolding',
        verdict: 'future_discovery_profile_not_proof',
        examples: [
          'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET',
          'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET',
          'P848_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE_NO_SPEND_BLOCKER_PACKET',
          'ORP_RESEARCH_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE.json',
        ],
      },
      {
        bucketId: 'runtime_task_and_test_surfaces',
        verdict: 'control_plane_language_not_mathematical_theorem',
        examples: [
          'src/runtime/theorem-loop.js',
          'src/runtime/problem-progress.js',
          'test/p848-282-alignment-obstruction-packet.test.js',
          'TASK_LIST.json',
        ],
      },
    ],
    blockerDecision: {
      status: 'local_statement_gap_emitted_no_spend',
      reason: 'The selected local proof probe did not produce any of the three acceptable theorem forms, and the user instruction forbids spending this turn.',
      sourceImportProfilePreserved: true,
      selectedFutureSourceAuditCandidate: 'p848-mod50-generator-source-import-single',
      futureReleaseCondition: 'Only a future instruction that permits paid ORP/OpenAI source audit inside the usage guard, or a newly found local theorem/generator source, may reopen this lane.',
    },
    futureUnblockConditions: [
      'Add or recover a repo-owned proof of the all-future mod-50 relevant-pair recurrence.',
      'Add or recover a finite-Q partition theorem with audited denominator and transition objects.',
      'Restore the original family-menu generator theorem/source and verify it subsumes the finite replay artifacts.',
      'Under a future no-spend change, run the preserved mod-50 source-import profile only after usage is checked and then audit the result into a theorem packet.',
    ],
    forbiddenMovesAfterGap: [
      'execute_provider_source_import_under_current_no_spend_instruction',
      'run_erdos_orp_research_execute_allow_paid_this_turn',
      'rerun_the_same_broad_mod50_wedge_by_default',
      'treat_finite_mod50_replay_as_all_future_recurrence',
      'launch_40501_plus_rollout_from_finite_replay',
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'try_fallback_selectors_one_by_one',
      'emit_a_naked_deterministic_rank_boundary',
      'claim_all_n_recombination_from_profile_bound_lanes',
      'treat_bounded_finite_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Assemble the no-spend source/import boundary after the mod-50 local statement gap, preserving that all three source/import theorem lanes remain blocked until a theorem is added or a future budget-guarded audit is explicitly released.',
      finiteDenominatorOrRankToken: 'p848_mod50_generator_theorem_statement_local_gap_after_all_n_recombination_blocker',
      command: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet completes the selected no-spend local mod-50 generator/source theorem-statement proof attempt as a precise gap. It records that the local audit found no repo-owned all-future relevant-pair recurrence, finite-Q partition, or restored original family-menu generator theorem with audited denominator objects. It does not execute a provider call, prove the mod-50 recurrence, restore the generator, prove a finite-Q partition, close p4217 residuals, import a square-moduli union/hitting theorem, recombine all-N, or decide Problem 848.',
    claims: {
      completesMod50GeneratorTheoremStatementLocalProofAttempt: true,
      emitsMod50GeneratorLocalStatementGap: true,
      auditsSelectedMod50Statement: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      usageCheckRequiredThisTurn: false,
      providerExecutionReleased: false,
      preservesNoSpendProviderGating: true,
      preservesFutureSourceImportProfile: true,
      foundLocalAllFutureRecurrence: false,
      foundFiniteQPartition: false,
      foundRestoredOriginalGeneratorTheorem: false,
      provesMod50AllFutureRecurrence: false,
      restoresOriginalGenerator: false,
      provesFiniteQPartition: false,
      blocksFiniteReplayAsAllFuture: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      provesP4217ResidualSourceTheorem: false,
      provesSquareModuliUnionHittingUpperBound: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 mod-50 generator theorem-statement local proof gap',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Selected probe: \`${packet.localProofAttempt.selectedProbeId}\``,
    `- Provider call made: \`${packet.localProofAttempt.madeNewPaidCall}\``,
    '',
    '## Missing Theorem',
    '',
    packet.missingTheoremStatement.exactMissingStatement,
    '',
    '## Local Verdict',
    '',
    packet.localProofAttempt.interpretation,
    '',
    '## Theorem Forks',
    '',
    ...Object.entries(packet.theoremForkVerdict).map(([fork, verdict]) => `- \`${fork}\`: found = \`${verdict.found}\`; ${verdict.reason}`),
    '',
    '## Evidence Classification',
    '',
    ...packet.auditClassification.map((bucket) => `- \`${bucket.bucketId}\`: \`${bucket.verdict}\``),
    '',
    '## Forbidden Moves',
    '',
    ...packet.forbiddenMovesAfterGap.map((move) => `- \`${move}\``),
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
