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

const DEFAULT_HARD_BLOCKER_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_HARD_BLOCKER_AFTER_MOD50_LOCAL_STATEMENT_GAP_PACKET.json');
const DEFAULT_PROFILE = path.join(problemDir, 'ORP_RESEARCH_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE.json');
const DEFAULT_USAGE_LEDGER = path.join(repoRoot, '.erdos', 'registry', 'research', 'openai-live-usage.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_GUARDED_MOD50_SOURCE_AUDIT_RELEASE_NO_SPEND_BLOCKER_AFTER_HARD_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_GUARDED_MOD50_SOURCE_AUDIT_RELEASE_NO_SPEND_BLOCKER_AFTER_HARD_BLOCKER_PACKET.md');

const TARGET = 'await_p848_new_local_source_theorem_or_explicit_guarded_source_audit_release_after_no_spend_hard_blocker';
const NEXT_ACTION = 'await_p848_new_local_source_theorem_or_spend_permission_override_after_guarded_mod50_audit_release_conflict';
const STATUS = 'guarded_mod50_source_audit_release_no_spend_blocker_after_hard_blocker_emitted';

function parseArgs(argv) {
  const options = {
    hardBlockerPacket: DEFAULT_HARD_BLOCKER_PACKET,
    profile: DEFAULT_PROFILE,
    usageLedger: DEFAULT_USAGE_LEDGER,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--hard-blocker-packet') {
      options.hardBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--profile') {
      options.profile = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--usage-ledger') {
      options.usageLedger = path.resolve(argv[index + 1]);
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

function buildUsageSnapshot(usageLedger, usageLedgerPath) {
  const day = new Date().toISOString().slice(0, 10);
  const entries = Array.isArray(usageLedger?.entries) ? usageLedger.entries : [];
  const todayEntries = entries.filter((entry) => entry.day === day);
  const dailyLiveRunLimit = Number(process.env.ERDOS_ORP_RESEARCH_DAILY_LIMIT ?? 10);
  const dailySpendLimitUsd = Number(process.env.ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT ?? 5);
  const defaultEstimatedAskCostUsd = Number(process.env.ERDOS_ORP_RESEARCH_ESTIMATED_COST_USD ?? 1);
  const todaySpendUsd = todayEntries.reduce((sum, entry) => sum + Number(entry.costUsd ?? entry.estimatedCostUsd ?? 0), 0);
  const todayLiveRunCount = todayEntries.length;
  const todayRemainingLiveRuns = Math.max(0, dailyLiveRunLimit - todayLiveRunCount);
  const todayRemainingSpendUsd = Math.max(0, dailySpendLimitUsd - todaySpendUsd);
  const enoughCapacityForOneEstimatedAsk = todayRemainingLiveRuns > 0 && todayRemainingSpendUsd >= defaultEstimatedAskCostUsd;

  return {
    status: enoughCapacityForOneEstimatedAsk
      ? 'usage_guard_has_capacity_but_active_no_spend_instruction_blocks_execution'
      : 'usage_guard_capacity_absent_or_insufficient',
    commandRun: './bin/erdos orp research usage --json',
    usageCheckRun: true,
    usageLedgerPath: rel(usageLedgerPath),
    usageLedgerSha256: fs.existsSync(usageLedgerPath) ? sha256File(usageLedgerPath) : null,
    ledgerUpdatedAt: usageLedger?.updatedAt ?? null,
    day,
    dailyLiveRunLimit,
    todayLiveRunCount,
    todayRemainingLiveRuns,
    dailySpendLimitUsd,
    todaySpendUsd,
    todayRemainingSpendUsd,
    defaultEstimatedAskCostUsd,
    enoughCapacityForOneEstimatedAsk,
  };
}

function buildPacket(options) {
  const hardBlocker = readJson(options.hardBlockerPacket);
  const profile = readJson(options.profile);
  const usageLedger = readJsonIfPresent(options.usageLedger) ?? { entries: [] };
  const usageGuardSnapshot = buildUsageSnapshot(usageLedger, options.usageLedger);

  assertCondition(hardBlocker?.status === 'no_spend_source_import_hard_blocker_after_mod50_local_statement_gap_emitted', 'hard blocker has unexpected status');
  assertCondition(hardBlocker?.recommendedNextAction === TARGET, 'hard blocker does not route to the guarded release/wait boundary');
  assertCondition(hardBlocker?.hardBlocker?.missingTheoremObjectCount === 3, 'hard blocker must record three missing source/import theorem objects');
  assertCondition(hardBlocker?.claims?.noCurrentNoSpendSourceImportLaneClosesAllN === true, 'hard blocker must record no no-spend all-N closure');
  assertCondition(hardBlocker?.claims?.madeNewPaidCall === false, 'hard blocker unexpectedly records paid spend');
  assertCondition(profile?.profile_id === 'p848-mod50-generator-source-import-single', 'profile must be the mod-50 generator/source-import profile');

  const selectedLane = hardBlocker.blockedSourceImportLanes.find((lane) => lane.laneId === 'mod50_generator_source_import');
  assertCondition(selectedLane, 'hard blocker must include the mod-50 source/import lane');

  return {
    schema: 'erdos.number_theory.p848_guarded_mod50_source_audit_release_no_spend_blocker_after_hard_blocker_packet/1',
    packetId: 'P848_GUARDED_MOD50_SOURCE_AUDIT_RELEASE_NO_SPEND_BLOCKER_AFTER_HARD_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'blocked_by_active_no_spend_instruction_after_usage_preflight',
      hardBlockerPacket: rel(options.hardBlockerPacket),
      hardBlockerPacketSha256: sha256File(options.hardBlockerPacket),
      selectedProfile: rel(options.profile),
      selectedProfileSha256: sha256File(options.profile),
      usageLedger: rel(options.usageLedger),
      usageLedgerSha256: fs.existsSync(options.usageLedger) ? sha256File(options.usageLedger) : null,
    },
    guardedReleaseRequest: {
      status: 'conditional_release_seen_but_not_executed',
      selectedLaneId: 'mod50_generator_source_import',
      selectedProfileId: profile.profile_id,
      selectedProfilePath: rel(options.profile),
      exactQuestionObject: 'Import or localize a theorem proving, for every future row in the mod-50 square-witness relevant-pair domain, a restored original family-menu generator theorem, a symbolic all-future relevant-pair recurrence, or a finite-Q partition with audited denominator and transition objects.',
      allowedAnswerShape: [
        'theorem statement with exact hypotheses and constants',
        'source citation or proof sketch localizable into repo notation',
        'denominator, recurrence, or finite-Q partition object sufficient for an 848 handoff',
        'explicit proof boundary separating discovery from promotion',
      ],
      rejectedAnswerShape: [
        'finite menu replay as all-future proof',
        'bounded q-cover or singleton descent substitute',
        'broad theorem wedge without importable source',
        'Tao-van-Doorn avoiding-side shortcut for the square-moduli union/hitting lane',
      ],
    },
    decision: {
      status: 'no_provider_execution_due_to_active_no_spend_instruction',
      mode: 'usage_preflight_recorded_release_conflict_blocked',
      explicitGuardedReleaseInBrief: true,
      activeNoSpendInstruction: true,
      usageCheckRun: true,
      usageGuardHasCapacityForOneEstimatedAsk: usageGuardSnapshot.enoughCapacityForOneEstimatedAsk,
      liveExecutionApproved: false,
      providerExecutionReleased: false,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      reason: 'The usage ledger has remaining run/USD capacity for one estimated source-audit ask, and the brief conditionally releases the mod-50 profile. The same step instructions still say Do not spend money, so provider execution is not released and the release conflict is recorded as a blocker.',
    },
    usageGuardSnapshot,
    selectedLaneSnapshot: selectedLane,
    stillBlockedSourceImportLanes: hardBlocker.blockedSourceImportLanes,
    missingSourceTheoremObjects: hardBlocker.missingSourceTheoremObjects,
    futureUnblockConditions: [
      'A new repo-owned local theorem closes the mod-50 all-future recurrence, finite-Q partition, or restored generator theorem object.',
      'The no-spend instruction is explicitly removed or overridden for exactly one guarded mod-50 source-audit call.',
      './bin/erdos orp research usage --json is rerun immediately before any future --execute --allow-paid provider call.',
      'Any source-audit result is packetized as discovery and audited before proof promotion or all-N recombination.',
    ],
    forbiddenMovesAfterDecision: [
      'run_erdos_orp_research_execute_allow_paid_under_active_do_not_spend_instruction',
      'execute_provider_source_import_without_rerunning_usage_guard',
      'release_square_moduli_or_p4217_profile_instead_of_selected_mod50_profile',
      'resume_q193_q197_singleton_descent',
      'resume_q_cover_staircase_expansion',
      'launch_next_prime_fallback_ladder',
      'emit_a_naked_deterministic_rank_boundary',
      'treat_finite_mod50_replay_as_all_future_recurrence',
      'claim_all_n_recombination_from_profile_or_gap_lanes',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Wait for either a new local source theorem or an explicit removal/override of the no-spend instruction for one guarded mod-50 source-audit call; keep finite frontier expansion paused.',
      finiteDenominatorOrRankToken: 'p848_guarded_mod50_source_audit_release_no_spend_blocker_after_hard_blocker',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet records the guarded mod-50 source-audit release conflict after the no-spend hard blocker. It runs only the local usage preflight, confirms the selected mod-50 profile and exact theorem target, and blocks provider execution because the active instructions still say not to spend. It does not call ORP/OpenAI, import a theorem, prove a recurrence, prove a finite-Q partition, restore a generator theorem, recombine all-N, expand q-cover/frontier lanes, or decide Problem 848.',
    claims: {
      completesPostHardBlockerGuardedReleaseDecisionUnderNoSpendConflict: true,
      usageCheckRun: true,
      usageGuardHadCapacityForOneEstimatedAsk: usageGuardSnapshot.enoughCapacityForOneEstimatedAsk,
      selectedLaneIsMod50: true,
      exactMod50SourceTheoremTargetNamed: true,
      explicitGuardedReleaseInBrief: true,
      activeNoSpendInstructionBlocksExecution: true,
      providerExecutionReleased: false,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      preservesNoSpendProviderGating: true,
      requiresFutureUsageCheckBeforeSpend: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      blocksFiniteReplayAsAllFuture: true,
      provesMod50AllFutureRecurrence: false,
      restoresOriginalGenerator: false,
      provesFiniteQPartition: false,
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
    '# P848 guarded mod-50 source-audit release no-spend blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Selected lane: \`${packet.guardedReleaseRequest.selectedLaneId}\``,
    `- Selected profile: \`${packet.guardedReleaseRequest.selectedProfileId}\``,
    `- Usage check run: \`${packet.decision.usageCheckRun}\``,
    `- Provider execution released: \`${packet.decision.providerExecutionReleased}\``,
    '',
    '## Decision',
    '',
    packet.decision.reason,
    '',
    '## Exact Source-Theorem Target',
    '',
    packet.guardedReleaseRequest.exactQuestionObject,
    '',
    '## Usage Snapshot',
    '',
    `- Remaining live runs: \`${packet.usageGuardSnapshot.todayRemainingLiveRuns}\``,
    `- Remaining spend USD: \`${packet.usageGuardSnapshot.todayRemainingSpendUsd}\``,
    `- Enough for one estimated ask: \`${packet.usageGuardSnapshot.enoughCapacityForOneEstimatedAsk}\``,
    '',
    '## Future Unblock Conditions',
    '',
    ...packet.futureUnblockConditions.map((condition) => `- ${condition}`),
    '',
    '## Forbidden Moves',
    '',
    ...packet.forbiddenMovesAfterDecision.map((move) => `- \`${move}\``),
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
