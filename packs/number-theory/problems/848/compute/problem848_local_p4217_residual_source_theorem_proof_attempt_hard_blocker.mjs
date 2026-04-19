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

const DEFAULT_APPROVAL_BLOCKER_PACKET = path.join(frontierBridge, 'P848_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.json');
const DEFAULT_P4217_SOURCE_GAP_PACKET = path.join(frontierBridge, 'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET.json');
const DEFAULT_REPAIRED_PROFILE_PACKET = path.join(frontierBridge, 'P848_REPAIRED_SINGLE_LANE_SOURCE_IMPORT_PROFILE_AFTER_NO_SPEND_GAP_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_LOCAL_P4217_RESIDUAL_SOURCE_THEOREM_PROOF_ATTEMPT_HARD_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_LOCAL_P4217_RESIDUAL_SOURCE_THEOREM_PROOF_ATTEMPT_HARD_BLOCKER_PACKET.md');

const TARGET = 'prepare_p848_local_p4217_residual_source_theorem_proof_attempt_or_emit_hard_blocker';
const NEXT_ACTION = 'assemble_p848_no_spend_source_import_boundary_after_local_p4217_hard_blocker';
const STATUS = 'local_p4217_residual_source_theorem_proof_attempt_hard_blocker_emitted';

const PROBE_COMMAND = 'rg -n "squarefree.*(arithmetic progression|linear family|locally admissible)|locally admissible.*squarefree|finite CRT partition|well-founded.*rank|decreasing invariant" packs/number-theory/problems/848 src test';

function parseArgs(argv) {
  const options = {
    approvalBlockerPacket: DEFAULT_APPROVAL_BLOCKER_PACKET,
    p4217SourceGapPacket: DEFAULT_P4217_SOURCE_GAP_PACKET,
    repairedProfilePacket: DEFAULT_REPAIRED_PROFILE_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--approval-blocker-packet') {
      options.approvalBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p4217-source-gap-packet') {
      options.p4217SourceGapPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--repaired-profile-packet') {
      options.repairedProfilePacket = path.resolve(argv[index + 1]);
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

function buildPacket(options) {
  const approvalBlocker = readJson(options.approvalBlockerPacket);
  assertCondition(approvalBlocker?.status === 'p4217_residual_source_import_profile_approval_blocker_emitted_no_live_spend', 'approval blocker packet has unexpected status');
  assertCondition(approvalBlocker?.target === 'emit_p848_p4217_residual_source_import_profile_approval_blocker_before_any_live_spend', 'approval blocker packet has unexpected target');
  assertCondition(approvalBlocker?.recommendedNextAction === TARGET, 'approval blocker does not route to local proof attempt');
  assertCondition(approvalBlocker?.approvalDecision?.profileExecutionApproved === false, 'approval blocker unexpectedly approves profile execution');
  assertCondition(approvalBlocker?.approvalDecision?.madeNewPaidCall === false, 'approval blocker unexpectedly records a paid call');
  assertCondition(approvalBlocker?.selectedLane?.laneId === 'p4217_residual_squarefree_realization_source', 'approval blocker does not preserve the p4217 residual lane');
  assertCondition(approvalBlocker?.claims?.requiresFutureApprovalBeforeSpend === true, 'approval blocker must require future approval before spend');
  assertCondition(approvalBlocker?.claims?.provesSquarefreeRealizationSourceTheorem === false, 'approval blocker must not prove the source theorem');

  const sourceGap = readJson(options.p4217SourceGapPacket);
  assertCondition(sourceGap?.status === 'p4217_residual_source_theorem_gap_emitted_no_finite_partition_rank_or_squarefree_source', 'p4217 source gap packet has unexpected status');
  assertCondition(sourceGap?.claims?.madeNewPaidCall === false, 'p4217 source gap unexpectedly records a paid call');
  assertCondition(sourceGap?.claims?.provesFiniteP4217Partition === false, 'p4217 source gap must not prove a finite partition');
  assertCondition(sourceGap?.claims?.provesP4217ResidualRankDecrease === false, 'p4217 source gap must not prove a residual rank decrease');
  assertCondition(sourceGap?.claims?.provesSquarefreeRealizationSourceTheorem === false, 'p4217 source gap must not prove the squarefree realization theorem');

  const repairedProfile = readJson(options.repairedProfilePacket);
  assertCondition(repairedProfile?.status === 'repaired_single_lane_source_import_profile_prepared_after_no_spend_gap', 'repaired profile packet has unexpected status');
  assertCondition(repairedProfile?.selectedLane?.laneId === 'p4217_residual_squarefree_realization_source', 'repaired profile packet does not select the p4217 residual lane');
  assertCondition(repairedProfile?.paidCallPolicy?.currentStepMadePaidCall === false, 'repaired profile packet unexpectedly records a paid call');

  return {
    schema: 'erdos.number_theory.p848_local_p4217_residual_source_theorem_proof_attempt_hard_blocker_packet/1',
    packetId: 'P848_LOCAL_P4217_RESIDUAL_SOURCE_THEOREM_PROOF_ATTEMPT_HARD_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_local_probe_hard_blocker_no_partition_rank_or_source_theorem',
      approvalBlockerPacket: rel(options.approvalBlockerPacket),
      approvalBlockerSha256: sha256File(options.approvalBlockerPacket),
      p4217SourceGapPacket: rel(options.p4217SourceGapPacket),
      p4217SourceGapSha256: sha256File(options.p4217SourceGapPacket),
      repairedProfilePacket: rel(options.repairedProfilePacket),
      repairedProfileSha256: sha256File(options.repairedProfilePacket),
    },
    localProofAttempt: {
      status: 'attempted_no_promotable_local_theorem_found',
      madeNewPaidCall: false,
      usageCheckRun: false,
      usedPreparedProfileInputs: true,
      probeCommand: PROBE_COMMAND,
      probeResult: 'no_promotable_repo_owned_finite_crt_partition_rank_or_squarefree_realization_source_theorem_found',
      probeInterpretation: 'The exact local probe returned references to existing blockers, residual packets, profile prompts, task/progress surfaces, runtime/test assertions, and the general Sawhney arithmetic-progression background. It did not return a source file that proves the p4217 residual finite CRT partition, a well-founded residual rank, or squarefree values for every locally admissible residual CRT/arithmetic-progression/linear-family instance.',
      auditedMatchBuckets: [
        {
          bucketId: 'existing_p4217_gap_and_blocker_packets',
          result: 'matched_existing_negative_evidence_not_a_new_theorem',
          examples: [
            'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET',
            'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET',
            'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_SOURCE_IMPORT_SEARCH_GAP_PACKET',
          ],
        },
        {
          bucketId: 'profile_and_approval_scaffolding',
          result: 'matched_future_source_import_prompts_not_proof',
          examples: [
            'P848_REPAIRED_SINGLE_LANE_SOURCE_IMPORT_PROFILE_AFTER_NO_SPEND_GAP_PACKET',
            'P848_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET',
            'ORP_RESEARCH_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE.json',
          ],
        },
        {
          bucketId: 'runtime_task_and_progress_surfaces',
          result: 'matched_control_plane_language_not_a_mathematical_source',
          examples: [
            'src/runtime/theorem-loop.js',
            'src/runtime/problem-progress.js',
            'TASK_LIST.json',
            'GLOBAL_CONVERGENCE_LIFT.json',
          ],
        },
        {
          bucketId: 'general_squarefree_arithmetic_progression_background',
          result: 'not_specialized_to_p4217_residual_hypotheses_or_constants',
          examples: [
            'THRESHOLD_LEDGER.md',
          ],
        },
      ],
    },
    theoremForkVerdict: {
      finiteCompleteCrtPartition: {
        found: false,
        reason: 'No local packet or source supplies a complete partition of the p4217 residual unavailable complement with every cell closed.',
      },
      wellFoundedResidualRank: {
        found: false,
        reason: 'The existing q-cover/rank language is a blocked nonconvergent finite frontier mechanism; no rank is proved to decrease on every p4217 residual transition.',
      },
      squarefreeRealizationSourceTheorem: {
        found: false,
        reason: 'No local source theorem verifies the hypotheses/constants needed to guarantee squarefree values for every locally admissible p4217 residual CRT/arithmetic-progression/linear-family instance.',
      },
    },
    hardBlockerDecision: {
      status: 'hard_blocker_until_local_theorem_or_future_guarded_source_import',
      reason: 'The no-spend local proof attempt did not derive any of the three residual theorem forks, and current instructions block live source-import execution.',
      futureReleaseOptions: [
        'A local repo-owned proof derives a finite complete CRT partition of the p4217 residual.',
        'A local repo-owned proof derives a well-founded residual rank that strictly decreases on every transition.',
        'A local or imported source theorem supplies audited hypotheses and constants for squarefree realization in every locally admissible p4217 residual family.',
        'A future explicit instruction releases the prepared single-lane profile under the local ORP/OpenAI usage and budget guard, followed by an audited proof-boundary packet.',
      ],
      blockedUntil: [
        'do_not_execute_the_prepared_profile_without_future_guarded_approval',
        'do_not_resume_q193_q197_singleton_descent',
        'do_not_launch_q193_q389_or_larger_q_cover',
        'do_not_try_fallback_selectors_one_by_one',
        'do_not_claim_all_N_recombination_or_threshold_collapse',
      ],
    },
    sourceProfilePreserved: {
      profilePacket: rel(options.repairedProfilePacket),
      profileFile: repairedProfile.repairedSourceImportProfile?.path ?? approvalBlocker.preservedProfile?.profileFile ?? null,
      profileId: repairedProfile.repairedSourceImportProfile?.profileId ?? approvalBlocker.preservedProfile?.profileId ?? null,
      selectedLaneId: repairedProfile.repairedSourceImportProfile?.selectedLaneId ?? approvalBlocker.preservedProfile?.selectedLaneId ?? null,
      futureLiveCommandTemplate: approvalBlocker.preservedProfile?.futureLiveCommandTemplate ?? repairedProfile.paidCallPolicy?.futureLiveCommandTemplate ?? null,
      sourceAuditQuestion: approvalBlocker.preservedProfile?.sourceAuditQuestion ?? repairedProfile.repairedSourceImportProfile?.sourceAuditQuestion ?? null,
    },
    forbiddenMovesAfterHardBlocker: [
      'execute_the_repaired_profile_without_future_guarded_approval',
      'run_erdos_orp_research_execute_allow_paid_this_turn',
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'emit_a_naked_deterministic_rank_boundary',
      'try_fallback_selectors_one_by_one',
      'rerun_the_same_p4217_paid_wedge_by_default',
      'claim_tao_van_doorn_plus_exact_verifier_decides_848_without_union_hitting_source',
      'treat_bounded_finite_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Assemble the no-spend source/import boundary after the local p4217 proof-attempt hard blocker, preserving exactly which theorem objects remain outside the proof and which future release condition could unblock them.',
      finiteDenominatorOrRankToken: 'p848_local_p4217_residual_source_theorem_hard_blocker_no_spend',
      command: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet completes the no-spend local p4217 residual source-theorem proof attempt as a hard blocker. It records that the local probe found no repo-owned finite complete CRT partition, well-founded residual rank, or squarefree-realization source theorem for every locally admissible p4217 residual family. It does not prove the p4217 complement, all-N recombination, an analytic threshold, or Problem 848, and it does not authorize any live provider call.',
    claims: {
      completesLocalP4217ResidualSourceTheoremProofAttempt: true,
      emitsHardBlocker: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      usageCheckRequiredThisTurn: false,
      usedPreparedProfileInputs: true,
      preservesPreparedProfile: true,
      blocksLiveSpendThisTurn: true,
      requiresFutureApprovalBeforeSpend: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      blocksRepeatPaidWedgeByDefault: true,
      foundFiniteP4217Partition: false,
      foundP4217ResidualRankDecrease: false,
      foundSquarefreeRealizationSourceTheorem: false,
      provesFiniteP4217Partition: false,
      provesP4217ResidualRankDecrease: false,
      provesSquarefreeRealizationSourceTheorem: false,
      provesMod50AllFutureRecurrence: false,
      importsSquareModuliUnionHittingThreshold: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 local p4217 residual source-theorem proof-attempt hard blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Paid/API call made: \`${packet.localProofAttempt.madeNewPaidCall}\``,
    '',
    '## Local Probe',
    '',
    `\`${packet.localProofAttempt.probeCommand}\``,
    '',
    packet.localProofAttempt.probeInterpretation,
    '',
    '## Theorem Fork Verdict',
    '',
    `- Finite CRT partition found: \`${packet.theoremForkVerdict.finiteCompleteCrtPartition.found}\``,
    `- Well-founded residual rank found: \`${packet.theoremForkVerdict.wellFoundedResidualRank.found}\``,
    `- Squarefree-realization source theorem found: \`${packet.theoremForkVerdict.squarefreeRealizationSourceTheorem.found}\``,
    '',
    '## Hard Blocker',
    '',
    packet.hardBlockerDecision.reason,
    '',
    '## Future Release Options',
    '',
    packet.hardBlockerDecision.futureReleaseOptions.map((item) => `- ${item}`).join('\n'),
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesAfterHardBlocker.map((item) => `- ${item}`).join('\n'),
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
