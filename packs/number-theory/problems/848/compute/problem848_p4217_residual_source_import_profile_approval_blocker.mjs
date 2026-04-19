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

const DEFAULT_PROFILE_PACKET = path.join(frontierBridge, 'P848_REPAIRED_SINGLE_LANE_SOURCE_IMPORT_PROFILE_AFTER_NO_SPEND_GAP_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.md');

const TARGET = 'emit_p848_p4217_residual_source_import_profile_approval_blocker_before_any_live_spend';
const NEXT_ACTION = 'prepare_p848_local_p4217_residual_source_theorem_proof_attempt_or_emit_hard_blocker';
const STATUS = 'p4217_residual_source_import_profile_approval_blocker_emitted_no_live_spend';

function parseArgs(argv) {
  const options = {
    profilePacket: DEFAULT_PROFILE_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--profile-packet') {
      options.profilePacket = path.resolve(argv[index + 1]);
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
  const profilePacket = readJson(options.profilePacket);
  assertCondition(profilePacket?.status === 'repaired_single_lane_source_import_profile_prepared_after_no_spend_gap', 'profile packet has unexpected status');
  assertCondition(profilePacket?.target === 'prepare_p848_repaired_single_lane_source_import_profile_after_no_spend_gap', 'profile packet has unexpected target');
  assertCondition(profilePacket?.recommendedNextAction === TARGET, 'profile packet does not route to the approval blocker target');
  assertCondition(profilePacket?.selectedLane?.laneId === 'p4217_residual_squarefree_realization_source', 'profile packet does not select the p4217 residual lane');
  assertCondition(profilePacket?.repairedSourceImportProfile?.profileId === 'p848-p4217-residual-source-import-single', 'profile packet does not name the repaired p4217 profile');
  assertCondition(profilePacket?.repairedSourceImportProfile?.laneCount === 1, 'profile packet must contain exactly one lane');
  assertCondition(profilePacket?.paidCallPolicy?.currentStepMadePaidCall === false, 'profile packet unexpectedly made a paid call');
  assertCondition(profilePacket?.paidCallPolicy?.currentStepAllowsPaidCall === false, 'profile packet unexpectedly allows paid execution');
  assertCondition(profilePacket?.claims?.requiresApprovalBeforeFutureSpend === true, 'profile packet must require approval before future spend');
  assertCondition(profilePacket?.claims?.blocksQCoverExpansion === true, 'profile packet must block q-cover expansion');
  assertCondition(profilePacket?.claims?.blocksSingletonQDescent === true, 'profile packet must block singleton q descent');
  assertCondition(profilePacket?.claims?.provesSquarefreeRealizationSourceTheorem === false, 'profile packet must not prove the source theorem');
  assertCondition(profilePacket?.claims?.decidesProblem848 === false, 'profile packet must not decide Problem 848');

  return {
    schema: 'erdos.number_theory.p848_p4217_residual_source_import_profile_approval_blocker_packet/1',
    packetId: 'P848_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_approval_blocker_profile_execution_not_released',
      profilePacket: rel(options.profilePacket),
      profilePacketSha256: sha256File(options.profilePacket),
    },
    approvalDecision: {
      status: 'live_execution_blocked_this_turn',
      profilePrepared: true,
      profileExecutionApproved: false,
      profileExecutionBlockedThisTurn: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      usageCheckRun: false,
      usageCheckReason: 'No usage check was needed because current delegate instructions forbid spend and this packet does not contemplate a live call.',
      reason: 'The repaired source-import profile is a future-use live provider profile. Current instructions say do not spend, so the only valid local action is to emit this approval/budget blocker before any execution.',
      futureLivePreconditions: [
        'A future instruction explicitly authorizes guarded live execution of this single p4217 residual profile.',
        'erdos orp research usage --json confirms remaining local daily run count and USD budget.',
        'The call purpose remains the p4217 residual source-import theorem audit, not broad fishing or routine verification.',
        'Any ORP/OpenAI answer is treated as process evidence until an audited repo-owned packet preserves hypotheses, constants, and proof boundaries.',
      ],
    },
    preservedProfile: {
      sourceProfilePacket: rel(options.profilePacket),
      profileFile: profilePacket.repairedSourceImportProfile.path,
      profileId: profilePacket.repairedSourceImportProfile.profileId,
      selectedLaneId: profilePacket.repairedSourceImportProfile.selectedLaneId,
      futureLiveCommandTemplate: profilePacket.paidCallPolicy.futureLiveCommandTemplate,
      sourceAuditQuestion: profilePacket.repairedSourceImportProfile.sourceAuditQuestion,
    },
    selectedLane: profilePacket.selectedLane,
    localFallback: {
      selectedNextAction: NEXT_ACTION,
      whyLocalNext: 'With live execution blocked and the profile preserved, the only no-spend progress path is a local p4217 residual source-theorem proof attempt from existing packet/profile inputs, followed by a hard blocker if no local theorem can be derived.',
      firstLocalProbeCommand: 'rg -n "squarefree.*(arithmetic progression|linear family|locally admissible)|locally admissible.*squarefree|finite CRT partition|well-founded.*rank|decreasing invariant" packs/number-theory/problems/848 src test',
      failureBoundary: 'If the local proof attempt finds no repo-owned theorem, emit a hard blocker stating that profile execution needs future guarded approval and no all-N proof can use this lane yet.',
    },
    forbiddenMovesAfterApprovalBlocker: [
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
      action: 'Attempt a local p4217 residual source theorem proof from the prepared profile inputs and packetized gaps; if no finite CRT partition, decreasing rank, or squarefree-realization theorem is locally derivable, emit the hard no-spend blocker.',
      finiteDenominatorOrRankToken: 'p848_p4217_residual_source_import_profile_approval_blocked_no_spend',
      command: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet completes the approval/budget blocker before any live provider call. It preserves the repaired single-lane p4217 residual source-import profile, records that no live execution is approved or attempted under the no-spend instruction, and routes to a local proof attempt or hard blocker. It does not prove a p4217 finite partition, p4217 decreasing rank, p4217 squarefree-realization source theorem, mod-50 all-future recurrence, square-moduli union/hitting threshold, all-N recombination, or Problem 848.',
    claims: {
      completesProfileApprovalBlocker: true,
      blocksLiveSpendThisTurn: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      usageCheckRequiredThisTurn: false,
      requiresFutureApprovalBeforeSpend: true,
      preservesPreparedProfile: true,
      keepsProfileSingleLane: true,
      selectedLaneIsP4217Residual: true,
      selectsLocalProofAttemptBeforeAnyLiveExecution: true,
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
    '# P848 p4217 residual source-import profile approval blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Profile execution approved: \`${packet.approvalDecision.profileExecutionApproved}\``,
    `- Paid/API call made: \`${packet.approvalDecision.madeNewPaidCall}\``,
    '',
    '## Approval Decision',
    '',
    packet.approvalDecision.reason,
    '',
    '## Preserved Profile',
    '',
    `- Profile packet: \`${packet.preservedProfile.sourceProfilePacket}\``,
    `- Profile file: \`${packet.preservedProfile.profileFile}\``,
    `- Profile ID: \`${packet.preservedProfile.profileId}\``,
    `- Selected lane: \`${packet.selectedLane.laneId}\``,
    '',
    '## Future Live Preconditions',
    '',
    packet.approvalDecision.futureLivePreconditions.map((item) => `- ${item}`).join('\n'),
    '',
    '## Local Fallback',
    '',
    `\`${packet.localFallback.selectedNextAction}\`: ${packet.localFallback.whyLocalNext}`,
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesAfterApprovalBlocker.map((item) => `- ${item}`).join('\n'),
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
