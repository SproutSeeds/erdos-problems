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

const DEFAULT_SOURCE_INDEX_AUDIT_PACKET = path.join(frontierBridge, 'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_INDEX_NO_SPEND_AUDIT_PACKET.json');
const DEFAULT_CORRECTED_SQUARE_MODULI_NO_GO_PACKET = path.join(frontierBridge, 'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json');
const DEFAULT_TVD_DIRECTION_PACKET = path.join(frontierBridge, 'P848_TAO_VAN_DOORN_LARGE_SIEVE_DIRECTION_AUDIT_PACKET.json');
const DEFAULT_TVD_PIVOT_PACKET = path.join(frontierBridge, 'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET.md');
const DEFAULT_PROFILE_OUTPUT = path.join(problemDir, 'ORP_RESEARCH_SQUARE_MODULI_UNION_HITTING_SOURCE_IMPORT_PROFILE.json');

const TARGET = 'prepare_p848_square_moduli_union_hitting_source_import_profile_or_approval_blocker';
const NEXT_ACTION = 'assemble_p848_no_spend_source_import_boundary_after_square_moduli_profile_blocker';
const STATUS = 'square_moduli_union_hitting_source_import_profile_approval_blocker_emitted_no_live_spend';

function parseArgs(argv) {
  const options = {
    sourceIndexAuditPacket: DEFAULT_SOURCE_INDEX_AUDIT_PACKET,
    correctedSquareModuliNoGoPacket: DEFAULT_CORRECTED_SQUARE_MODULI_NO_GO_PACKET,
    tvdDirectionPacket: DEFAULT_TVD_DIRECTION_PACKET,
    tvdPivotPacket: DEFAULT_TVD_PIVOT_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    profileOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--source-index-audit-packet') {
      options.sourceIndexAuditPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--corrected-square-moduli-no-go-packet') {
      options.correctedSquareModuliNoGoPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--tvd-direction-packet') {
      options.tvdDirectionPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--tvd-pivot-packet') {
      options.tvdPivotPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--json-output') {
      options.jsonOutput = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--markdown-output') {
      options.markdownOutput = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--profile-output') {
      options.profileOutput = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--write-defaults') {
      options.jsonOutput = DEFAULT_JSON_OUTPUT;
      options.markdownOutput = DEFAULT_MARKDOWN_OUTPUT;
      options.profileOutput = DEFAULT_PROFILE_OUTPUT;
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

function buildProfile() {
  return {
    schema_version: '1.0.0',
    profile_id: 'p848-square-moduli-union-hitting-source-import-single',
    label: 'Problem 848 square-moduli union/hitting source-import audit',
    description: 'Single-lane bounded ORP/OpenAI profile for a future source-audit pass on the missing Sawhney-compatible square-moduli union/hitting upper-bound theorem. This profile is prepared locally and must not execute without an explicit usage/budget guard.',
    execution_policy: {
      live_requires_execute: true,
      process_only: true,
      secrets_not_persisted: true,
      default_timeout_sec: 180,
      estimated_cost_usd: 1,
      budget_note: 'Use only after ./bin/erdos orp research usage --json confirms remaining local daily run count and USD guard, and only if a future approval packet releases this exact single-lane profile.',
    },
    call_moments: [
      {
        moment_id: 'plan',
        label: 'Local profile preparation',
        calls_api: false,
        description: 'Create the exact source/import prompt without resolving credentials or making a live call.',
      },
      {
        moment_id: 'p848_square_moduli_union_hitting_source_import',
        label: 'Square-moduli union/hitting source-import theorem audit',
        calls_api: true,
        secret_alias: 'openai-primary',
        env_var: 'OPENAI_API_KEY',
        description: 'Run one bounded source-audit pass asking only for a Sawhney-compatible union/hitting upper-bound theorem, not avoiding-side evidence.',
      },
    ],
    lanes: [
      {
        lane_id: 'p848_square_moduli_union_hitting_source_import',
        call_moment: 'p848_square_moduli_union_hitting_source_import',
        label: 'P848 square-moduli union/hitting source-import theorem',
        provider: 'openai',
        model: 'gpt-5.4',
        adapter: 'openai_responses',
        role: 'Analyze only the supplied Problem 848 square-moduli artifacts as a source-import theorem wedge. Return a concise verdict first. Decide whether an importable source theorem gives Sawhney-compatible upper bounds for union/hitting sets of square obstruction classes modulo p^2, with exact inequality direction, hypotheses, constants, and threshold handoff. Explicitly reject Tao-van-Doorn avoiding-set upper bounds used as union/hitting upper bounds, complement-duality lower-bound inversions, threshold claims without constants, q-cover expansion, singleton descent, and bounded finite evidence as all-N proof.',
        env_var: 'OPENAI_API_KEY',
        secret_alias: 'openai-primary',
        reasoning_effort: 'medium',
        text_verbosity: 'medium',
        max_output_tokens: 8192,
      },
    ],
    synthesis: {
      style: 'source_or_gap_first',
      require_disagreements: true,
      require_open_questions: true,
      require_exact_hypotheses_constants_and_direction: true,
    },
  };
}

function buildPacket(options) {
  const audit = readJson(options.sourceIndexAuditPacket);
  assertCondition(audit?.status === 'square_moduli_union_hitting_source_index_no_spend_audit_emitted_no_promotable_source_found', 'source-index audit packet has unexpected status');
  assertCondition(audit?.target === 'execute_p848_square_moduli_union_hitting_source_index_no_spend_audit', 'source-index audit packet has unexpected target');
  assertCondition(audit?.recommendedNextAction === TARGET, 'source-index audit packet does not route to this target');
  assertCondition(audit?.coversPrimaryNextAction?.status === 'completed_by_no_spend_source_index_audit_no_promotable_source_found', 'source-index audit packet has unexpected coverage status');
  assertCondition(audit?.auditExecution?.madeNewPaidCall === false, 'source-index audit unexpectedly records a paid call');
  assertCondition(audit?.auditExecution?.commandWasExecutedLocally === true, 'source-index audit must record a local command');
  assertCondition(audit?.sourceTheoremVerdict?.foundSawhneyCompatibleUnionHittingUpperBoundSource === false, 'source-index audit unexpectedly found a Sawhney-compatible source theorem');
  assertCondition(audit?.sourceTheoremVerdict?.foundOnlyAvoidingSideSquareModuliLargeSieve === true, 'source-index audit must preserve the avoiding-side direction finding');
  assertCondition(audit?.sourceImportProfileSeed?.profileId === 'p848-square-moduli-union-hitting-source-import-single', 'source-index audit must seed the square-moduli source-import profile');
  assertCondition(audit?.claims?.preparesSingleLaneSourceImportProfileSeed === true, 'source-index audit did not prepare the profile seed');
  assertCondition(audit?.claims?.provesSawhneyUnionHittingUpperBound === false, 'source-index audit must not prove the union/hitting theorem');
  assertCondition(audit?.claims?.decidesProblem848 === false, 'source-index audit must not decide Problem 848');

  const correctedNoGo = readJson(options.correctedSquareModuliNoGoPacket);
  assertCondition(correctedNoGo?.status === 'corrected_square_moduli_sieve_no_go_current_sources_handoff_to_p4217', 'corrected square-moduli no-go packet has unexpected status');
  assertCondition(correctedNoGo?.claims?.provesTvdDirectRouteWrongDirectionForSawhneyUnionBound === true, 'corrected no-go packet must prove wrong direction for Sawhney union bound');
  assertCondition(correctedNoGo?.claims?.provesComplementDualityDoesNotRepairDirection === true, 'corrected no-go packet must preserve the complement-duality blocker');
  assertCondition(correctedNoGo?.claims?.provesUnionHittingThresholdBound === false, 'corrected no-go packet must not prove a union/hitting threshold');

  const tvdDirection = readJson(options.tvdDirectionPacket);
  assertCondition(tvdDirection?.status === 'large_sieve_reference_verified_direction_mismatch_blocks_threshold_collapse_claim', 'Tao-van-Doorn direction audit has unexpected status');
  assertCondition(tvdDirection?.claims?.blocksDirectThresholdCollapseClaim === true, 'Tao-van-Doorn direction audit must block direct threshold collapse');
  assertCondition(tvdDirection?.claims?.decidesProblem848 === false, 'Tao-van-Doorn direction audit must not decide Problem 848');

  const tvdPivot = readJson(options.tvdPivotPacket);
  assertCondition(tvdPivot?.status === 'tvd_threshold_pivot_reconciled_direct_route_blocked_dual_sieve_required', 'Tao-van-Doorn pivot packet has unexpected status');
  assertCondition(tvdPivot?.claims?.blocksDirectThresholdCollapseClaim === true, 'Tao-van-Doorn pivot packet must block the direct threshold route');
  assertCondition(tvdPivot?.claims?.provesUnionHittingThresholdBound === false, 'Tao-van-Doorn pivot packet must not prove the union/hitting threshold');

  const profile = buildProfile();
  const profileOutput = options.profileOutput ?? DEFAULT_PROFILE_OUTPUT;

  return {
    schema: 'erdos.number_theory.p848_square_moduli_union_hitting_source_import_profile_approval_blocker_packet/1',
    packetId: 'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_IMPORT_PROFILE_APPROVAL_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_square_moduli_union_hitting_profile_approval_blocker_no_live_spend',
      sourceIndexAuditPacket: rel(options.sourceIndexAuditPacket),
      sourceIndexAuditSha256: sha256File(options.sourceIndexAuditPacket),
      correctedSquareModuliNoGoPacket: rel(options.correctedSquareModuliNoGoPacket),
      correctedSquareModuliNoGoSha256: sha256File(options.correctedSquareModuliNoGoPacket),
      tvdDirectionPacket: rel(options.tvdDirectionPacket),
      tvdDirectionSha256: sha256File(options.tvdDirectionPacket),
      tvdPivotPacket: rel(options.tvdPivotPacket),
      tvdPivotSha256: sha256File(options.tvdPivotPacket),
    },
    selectedLane: {
      laneId: 'square_moduli_union_hitting_threshold_source',
      theoremObject: 'Sawhney-compatible square-moduli union/hitting upper-bound source theorem',
      currentBoundary: audit.sourceTheoremVerdict?.missingTheoremStatement ?? null,
      selectionStatus: 'selected_as_single_square_moduli_source_import_profile_lane',
      whySelected: [
        'The local source-index audit found no promotable source theorem in the repo.',
        'The current square-moduli failure is orthogonal to the p4217 residual source theorem and mod-50 recurrence lanes.',
        'A single source/import answer could clarify whether the missing object is an importable union/hitting theorem or a true source gap.',
      ],
      whySharperThanPreviousAttempts: [
        'The profile asks only for the union/hitting upper-bound direction and audited constants; it does not ask for a broad p4217 complement proof.',
        'The profile explicitly rejects Tao-van-Doorn avoiding-set upper bounds unless a valid source supplies the missing union/hitting conversion.',
        'The profile requires a finite threshold handoff before any all-N recombination claim.',
      ],
    },
    repairedSourceImportProfile: {
      path: rel(profileOutput),
      profileId: profile.profile_id,
      laneCount: profile.lanes.length,
      selectedLaneId: profile.lanes[0].lane_id,
      profile,
      sourceAuditQuestion: audit.sourceImportProfileSeed?.sourceAuditQuestion ?? 'Problem 848 square-moduli union/hitting source-import theorem: identify a Sawhney-compatible source theorem with upper-bound direction, hypotheses, constants, and threshold relevance; reject avoiding-side-only readings and bounded evidence as all-N proof.',
    },
    approvalDecision: {
      status: 'live_execution_blocked_this_turn',
      profilePrepared: true,
      profileExecutionApproved: false,
      profileExecutionBlockedThisTurn: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      usageCheckRun: false,
      usageCheckReason: 'No usage check was needed because current delegate instructions forbid spend and this packet only preserves a future-use profile.',
      reason: 'The no-spend source-index audit found no local theorem, but the current run still forbids spending. The valid durable step is to preserve the exact future source-import profile and record release conditions.',
      futureLivePreconditions: [
        'A future instruction permits budget-guarded provider execution for this exact square-moduli union/hitting profile.',
        './bin/erdos orp research usage --json confirms remaining local daily run count and USD budget.',
        'The call remains a single high-leverage source-audit question about Sawhney-compatible union/hitting upper bounds, not broad fishing.',
        'Any ORP/OpenAI answer is packetized before promotion to proof, preserving hypotheses, constants, inequality direction, and finite handoff.',
      ],
    },
    unacceptableOutputs: audit.sourceImportProfileSeed?.unacceptableOutputs ?? [
      'Tao-van-Doorn avoiding-set upper bound promoted as a union/hitting upper bound.',
      'Complement duality used to turn an avoiding upper bound into a hitting upper bound.',
      'N0 around 1e6, N0 <= 40500, or all-N decision claim without union/hitting theorem and finite handoff.',
      'q-cover expansion, singleton q descent, fallback-selector ladder, or bounded evidence as proof.',
    ],
    acceptableSuccessCriteria: audit.sourceImportProfileSeed?.acceptableOutputs ?? [
      'An importable theorem/reference with audited union/hitting upper-bound direction, hypotheses, constants, and threshold relevance.',
      'A proof that no such source in the supplied corpus closes the current 848 gap, naming the exact missing hypothesis/constants.',
    ],
    paidCallPolicy: {
      currentStepMadePaidCall: false,
      currentStepAllowsPaidCall: false,
      default: 'do_not_call_provider_this_turn',
      futureLiveCallStatus: 'requires_future_budget_guard_and_profile_approval',
      usageCommandBeforeAnyFutureLiveCall: './bin/erdos orp research usage --json',
      futureLiveCommandTemplate: 'erdos orp research ask 848 --profile-file packs/number-theory/problems/848/ORP_RESEARCH_SQUARE_MODULI_UNION_HITTING_SOURCE_IMPORT_PROFILE.json --question "<square-moduli union/hitting source-import theorem question>" --execute --allow-paid --json',
      approvalBoundary: 'This packet prepares and blocks the profile only. It does not run usage, resolve credentials, or call a provider under the current no-spend instruction.',
    },
    forbiddenMovesAfterProfileBlocker: [
      'execute_provider_source_import_under_current_no_spend_instruction',
      'use_tao_van_doorn_avoiding_upper_bound_as_union_hitting_upper_bound',
      'use_complement_duality_to_invert_lower_bound_into_upper_bound',
      'claim_n0_around_1e6_or_n0_le_40500_without_audited_union_hitting_source',
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'try_fallback_selectors_one_by_one',
      'emit_a_naked_deterministic_rank_boundary',
      'treat_bounded_finite_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Assemble the no-spend source/import boundary after the square-moduli profile blocker, combining the p4217 residual hard blocker, mod-50 source theorem gap, and square-moduli union/hitting source-import blocker into one next theorem/source decision surface.',
      finiteDenominatorOrRankToken: 'p848_square_moduli_union_hitting_source_import_profile_approval_blocker',
      command: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet completes the square-moduli union/hitting source-import profile/approval boundary. It preserves a future-use single-lane profile, blocks live provider execution under the no-spend instruction, and records the exact missing theorem: a Sawhney-compatible square-moduli union/hitting upper-bound source with audited direction, hypotheses, constants, and finite threshold handoff. It does not prove the union/hitting theorem, lower an analytic threshold, close all-N recombination, or decide Problem 848.',
    claims: {
      completesSquareModuliUnionHittingProfileApprovalBlocker: true,
      writesFutureUseProfile: true,
      preservesSourceIndexAudit: true,
      preservesTvdAvoidingDirectionBlocker: true,
      preservesComplementDualityLowerBoundBlocker: true,
      selectedLaneIsSquareModuliUnionHitting: true,
      keepsProfileSingleLane: true,
      blocksLiveSpendThisTurn: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      usageCheckRequiredThisTurn: false,
      requiresFutureApprovalBeforeSpend: true,
      respectsNoPaidByDefault: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      foundSawhneyCompatibleUnionHittingUpperBoundSource: false,
      provesSawhneyUnionHittingUpperBound: false,
      importsSquareModuliUnionHittingThreshold: false,
      lowersAnalyticThreshold: false,
      provesExplicitN0: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 square-moduli union/hitting source-import profile approval blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Profile ID: \`${packet.repairedSourceImportProfile.profileId}\``,
    `- Profile execution approved: \`${packet.approvalDecision.profileExecutionApproved}\``,
    `- Paid/API call made: \`${packet.approvalDecision.madeNewPaidCall}\``,
    '',
    '## Selected Lane',
    '',
    `\`${packet.selectedLane.laneId}\`: ${packet.selectedLane.theoremObject}`,
    '',
    '## Approval Decision',
    '',
    packet.approvalDecision.reason,
    '',
    '## Missing Theorem',
    '',
    packet.selectedLane.currentBoundary,
    '',
    '## Future Live Preconditions',
    '',
    packet.approvalDecision.futureLivePreconditions.map((item) => `- ${item}`).join('\n'),
    '',
    '## Unacceptable Outputs',
    '',
    packet.unacceptableOutputs.map((item) => `- ${item}`).join('\n'),
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
  if (options.profileOutput) {
    fs.mkdirSync(path.dirname(options.profileOutput), { recursive: true });
    fs.writeFileSync(options.profileOutput, `${JSON.stringify(packet.repairedSourceImportProfile.profile, null, options.pretty ? 2 : 0)}\n`);
  }
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
