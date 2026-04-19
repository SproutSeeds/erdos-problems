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

const DEFAULT_BOUNDARY_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_MOD50_LOCAL_STATEMENT_GAP_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_HARD_BLOCKER_AFTER_MOD50_LOCAL_STATEMENT_GAP_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_HARD_BLOCKER_AFTER_MOD50_LOCAL_STATEMENT_GAP_PACKET.md');

const TARGET = 'emit_p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap';
const NEXT_ACTION = 'await_p848_new_local_source_theorem_or_explicit_guarded_source_audit_release_after_no_spend_hard_blocker';
const STATUS = 'no_spend_source_import_hard_blocker_after_mod50_local_statement_gap_emitted';

function parseArgs(argv) {
  const options = {
    boundaryPacket: DEFAULT_BOUNDARY_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--boundary-packet') {
      options.boundaryPacket = path.resolve(argv[index + 1]);
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

function hardBlockedLanes(boundary) {
  return boundary.remainingSourceImportLanes.map((lane) => ({
    ...lane,
    closureStatus: 'blocked_under_current_no_spend_instruction',
    proofUseStatus: 'not_promotable_to_all_n_without_new_local_theorem_or_future_guarded_source_audit',
  }));
}

function buildPacket(options) {
  const boundary = readJson(options.boundaryPacket);

  assertCondition(boundary?.status === 'no_spend_source_import_boundary_assembled_after_mod50_local_statement_gap', 'source/import boundary has unexpected status');
  assertCondition(boundary?.target === 'assemble_p848_no_spend_source_import_boundary_after_mod50_local_statement_gap', 'source/import boundary has unexpected target');
  assertCondition(boundary?.recommendedNextAction === TARGET, 'source/import boundary does not route to this hard blocker');
  assertCondition(boundary?.coversPrimaryNextAction?.status === 'completed_by_no_spend_source_import_boundary_after_mod50_local_statement_gap', 'source/import boundary did not complete the expected primary action');
  assertCondition(boundary?.boundaryAssembly?.status === 'assembled_after_mod50_local_statement_gap', 'source/import boundary assembly has unexpected status');
  assertCondition(boundary?.boundaryAssembly?.missingTheoremObjectCount === 3, 'source/import boundary must record three missing theorem objects');
  assertCondition(boundary?.boundaryAssembly?.madeNewPaidCall === false, 'source/import boundary unexpectedly records a paid call');
  assertCondition(boundary?.boundaryAssembly?.providerExecutionReleased === false, 'source/import boundary unexpectedly releases provider execution');
  assertCondition(Array.isArray(boundary?.remainingSourceImportLanes) && boundary.remainingSourceImportLanes.length === 3, 'source/import boundary must preserve three lanes');
  assertCondition(boundary?.claims?.allThreeSourceImportLanesRemainBlocked === true, 'source/import boundary must mark all lanes blocked');
  assertCondition(boundary?.claims?.preservesNoSpendProviderGating === true, 'source/import boundary must preserve no-spend provider gating');
  assertCondition(boundary?.claims?.provesAllN === false, 'source/import boundary unexpectedly proves all-N');

  const blockedLanes = hardBlockedLanes(boundary);
  const theoremObjects = blockedLanes.map((lane) => ({
    laneId: lane.laneId,
    theoremObject: lane.remainingSourceTheoremObject,
    latestLocalVerdict: lane.latestLocalVerdict ?? null,
    liveReleaseCondition: lane.liveReleaseCondition ?? null,
  }));

  return {
    schema: 'erdos.number_theory.p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap_packet/1',
    packetId: 'P848_NO_SPEND_SOURCE_IMPORT_HARD_BLOCKER_AFTER_MOD50_LOCAL_STATEMENT_GAP_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap',
      boundaryPacket: rel(options.boundaryPacket),
      boundaryPacketSha256: sha256File(options.boundaryPacket),
    },
    hardBlocker: {
      status: 'no_current_no_spend_source_import_lane_closes_all_n',
      mode: 'post_mod50_local_statement_gap_no_spend_hard_blocker',
      sourceImportLaneCount: blockedLanes.length,
      missingTheoremObjectCount: blockedLanes.length,
      noSpendClosureAvailable: false,
      allNProofAvailable: false,
      providerExecutionReleased: false,
      madeNewPaidCall: false,
      usageCheckRun: false,
      currentStepAllowsPaidCall: false,
      blockerReason: 'The mod-50 lane has a preserved profile plus a local statement gap, while square-moduli union/hitting and p4217 residual lanes remain profile/hard-blocked. Under the current no-spend instruction, no source/import lane may be executed and no repo-owned theorem currently closes all-N.',
    },
    blockedSourceImportLanes: blockedLanes,
    missingSourceTheoremObjects: theoremObjects,
    futureGuardedAuditReleaseConditions: boundary.releaseConditions ?? [],
    noSpendUnblockConditions: [
      'A new repo-owned local theorem closes at least one of the three source/import theorem objects.',
      'A future instruction explicitly permits a budget-guarded ORP/OpenAI source audit, and ./bin/erdos orp research usage --json clears the daily run/USD guard before provider execution.',
      'Any future source-audit answer is promoted only after an audited repo packet records hypotheses, constants, proof boundaries, threshold handoff, and verification.',
    ],
    forbiddenMovesAfterHardBlocker: [
      'execute_provider_source_import_under_current_no_spend_instruction',
      'run_erdos_orp_research_execute_allow_paid_this_turn',
      'claim_all_n_recombination_from_profile_or_gap_lanes',
      'rerun_the_same_broad_mod50_or_p4217_wedge_by_default',
      'resume_q193_q197_singleton_descent',
      'resume_q_cover_staircase_expansion',
      'launch_next_prime_fallback_ladder',
      'emit_a_naked_deterministic_rank_boundary',
      'treat_finite_mod50_replay_as_all_future_recurrence',
      'promote_tao_van_doorn_avoiding_bound_to_square_moduli_union_hitting_bound',
      'treat_bounded_finite_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Wait for a new local source theorem or an explicit future budget-guarded source-audit release instruction; until then keep the all-N recombination surface hard-blocked and do not expand finite q-cover/singleton/rank-boundary lanes.',
      finiteDenominatorOrRankToken: 'p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet emits the no-spend source/import hard blocker after the mod-50 local statement gap. It states that no current no-spend source/import lane closes all-N, preserves the future guarded audit release conditions, and keeps q-cover, singleton, fallback-selector, and naked rank-boundary expansion paused. It does not execute a provider call, import a source theorem, prove a recurrence, prove a finite-Q partition, prove a square-moduli union/hitting upper bound, prove a p4217 residual theorem, recombine all-N, or decide Problem 848.',
    claims: {
      completesNoSpendSourceImportHardBlockerAfterMod50LocalStatementGap: true,
      noCurrentNoSpendSourceImportLaneClosesAllN: true,
      allThreeSourceImportLanesRemainBlocked: true,
      preservesNoSpendProviderGating: true,
      preservesFutureGuardedAuditReleaseConditions: true,
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
    '# P848 no-spend source/import hard blocker after mod-50 local statement gap',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Source/import lanes blocked: \`${packet.hardBlocker.sourceImportLaneCount}\``,
    `- Provider execution released: \`${packet.hardBlocker.providerExecutionReleased}\``,
    '',
    '## Hard Blocker',
    '',
    packet.hardBlocker.blockerReason,
    '',
    '## Missing Source Theorem Objects',
    '',
    ...packet.missingSourceTheoremObjects.map((entry) => `- \`${entry.laneId}\`: ${entry.theoremObject}`),
    '',
    '## Future Release Conditions',
    '',
    ...packet.futureGuardedAuditReleaseConditions.map((condition) => `- ${condition}`),
    '',
    '## No-Spend Unblock Conditions',
    '',
    ...packet.noSpendUnblockConditions.map((condition) => `- ${condition}`),
    '',
    '## Forbidden Moves',
    '',
    ...packet.forbiddenMovesAfterHardBlocker.map((move) => `- \`${move}\``),
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
    fs.writeFileSync(options.jsonOutput, JSON.stringify(packet, null, options.pretty ? 2 : 0));
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
  process.stdout.write(`${JSON.stringify(packet, null, options.pretty ? 2 : 0)}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
