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

const DEFAULT_BOUNDARY_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_SQUARE_MODULI_PROFILE_BLOCKER_PACKET.json');
const DEFAULT_MOD50_SOURCE_BLOCKER_PACKET = path.join(frontierBridge, 'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json');
const DEFAULT_MOD50_SOURCE_ARCHAEOLOGY_PACKET = path.join(frontierBridge, 'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json');
const DEFAULT_MOD50_WEDGE_DECISION_PACKET = path.join(frontierBridge, 'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json');
const DEFAULT_SOURCE_SEARCH_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE_NO_SPEND_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE_NO_SPEND_BLOCKER_PACKET.md');
const DEFAULT_PROFILE_OUTPUT = path.join(problemDir, 'ORP_RESEARCH_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE.json');

const TARGET = 'prepare_p848_mod50_generator_source_import_profile_or_no_spend_blocker_after_source_boundary';
const NEXT_ACTION = 'assemble_p848_no_spend_source_import_boundary_after_mod50_profile_blocker';
const STATUS = 'mod50_generator_source_import_profile_no_spend_blocker_emitted';

function parseArgs(argv) {
  const options = {
    boundaryPacket: DEFAULT_BOUNDARY_PACKET,
    mod50SourceBlockerPacket: DEFAULT_MOD50_SOURCE_BLOCKER_PACKET,
    mod50SourceArchaeologyPacket: DEFAULT_MOD50_SOURCE_ARCHAEOLOGY_PACKET,
    mod50WedgeDecisionPacket: DEFAULT_MOD50_WEDGE_DECISION_PACKET,
    sourceSearchPacket: DEFAULT_SOURCE_SEARCH_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    profileOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--boundary-packet') {
      options.boundaryPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--mod50-source-blocker-packet') {
      options.mod50SourceBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--mod50-source-archaeology-packet') {
      options.mod50SourceArchaeologyPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--mod50-wedge-decision-packet') {
      options.mod50WedgeDecisionPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--source-search-packet') {
      options.sourceSearchPacket = path.resolve(argv[index + 1]);
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
    profile_id: 'p848-mod50-generator-source-import-single',
    label: 'Problem 848 mod-50 generator/source-import theorem audit',
    description: 'Single-lane bounded ORP/OpenAI profile for a future source-audit pass on the missing mod-50 all-future recurrence, finite-Q partition, or original family-menu generator theorem. This profile is prepared locally and must not execute without the local usage/budget guard.',
    execution_policy: {
      live_requires_execute: true,
      process_only: true,
      secrets_not_persisted: true,
      default_timeout_sec: 180,
      estimated_cost_usd: 1,
      budget_note: 'Use only after ./bin/erdos orp research usage --json confirms remaining local daily run count and USD guard, and only if a future approval packet releases this exact single-lane mod-50 profile.',
    },
    call_moments: [
      {
        moment_id: 'plan',
        label: 'Local profile preparation',
        calls_api: false,
        description: 'Create the exact source/import prompt without resolving credentials or making a live call.',
      },
      {
        moment_id: 'p848_mod50_generator_source_import',
        label: 'P848 mod-50 all-future recurrence/generator theorem',
        calls_api: true,
        secret_alias: 'openai-primary',
        env_var: 'OPENAI_API_KEY',
        description: 'Run one bounded source-audit pass asking only for the mod-50 all-future recurrence, finite-Q partition, or original family-menu generator theorem.',
      },
    ],
    lanes: [
      {
        lane_id: 'p848_mod50_generator_source_import',
        call_moment: 'p848_mod50_generator_source_import',
        label: 'P848 mod-50 generator/source-import theorem',
        provider: 'openai',
        model: 'gpt-5.4',
        adapter: 'openai_responses',
        role: 'Analyze only the supplied Problem 848 mod-50 finite replay, source-theorem blocker, source-archaeology wedge, and live-wedge decision blocker artifacts as a source-import theorem audit. Return a concise verdict first. Decide whether an importable or repo-recoverable theorem proves an all-future relevant-pair recurrence, finite-Q partition, or original family-menu generator theorem covering every future mod-50 square-witness row. Name exact hypotheses, constants, denominator/partition objects, generator source, and proof boundary. Explicitly reject finite restored-menu replay, the 280-row finite menu, the current square-witness pool, the incomplete max-output-token wedge, q-cover expansion, singleton descent, fallback selector ladders, and bounded evidence as all-N proof.',
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
      require_generator_or_partition_statement: true,
      require_exact_hypotheses_constants_and_denominators: true,
    },
  };
}

function buildPacket(options) {
  const boundary = readJson(options.boundaryPacket);
  assertCondition(boundary?.status === 'no_spend_source_import_boundary_assembled_after_square_moduli_profile_blocker', 'source/import boundary has unexpected status');
  assertCondition(boundary?.target === 'assemble_p848_no_spend_source_import_boundary_after_square_moduli_profile_blocker', 'source/import boundary has unexpected target');
  assertCondition(boundary?.recommendedNextAction === TARGET, 'source/import boundary does not route to this target');
  assertCondition(boundary?.selectedNextTheoremObject?.objectId === 'mod50_all_future_recurrence_or_generator', 'source/import boundary does not select the mod-50 theorem object');
  assertCondition(boundary?.claims?.selectsMod50AsNextSourceObject === true, 'source/import boundary must select mod-50 as next source object');
  assertCondition(boundary?.claims?.madeNewPaidCall === false, 'source/import boundary unexpectedly records a paid call');
  assertCondition(boundary?.claims?.provesMod50AllFutureRecurrence === false, 'source/import boundary unexpectedly proves the mod-50 recurrence');
  assertCondition(boundary?.claims?.decidesProblem848 === false, 'source/import boundary unexpectedly decides Problem 848');

  const mod50SourceBlocker = readJson(options.mod50SourceBlockerPacket);
  assertCondition(mod50SourceBlocker?.status === 'mod50_all_future_recurrence_source_theorem_blocker_emitted_local_source_absent', 'mod-50 source blocker has unexpected status');
  assertCondition(mod50SourceBlocker?.claims?.provesRepoOwnedAllFutureRecurrenceAbsent === true, 'mod-50 source blocker must record absent repo-owned recurrence');
  assertCondition(mod50SourceBlocker?.claims?.provesSymbolicRelevantPairRecurrence === false, 'mod-50 source blocker unexpectedly proves symbolic recurrence');
  assertCondition(mod50SourceBlocker?.claims?.provesFiniteQPartition === false, 'mod-50 source blocker unexpectedly proves finite-Q partition');
  assertCondition(mod50SourceBlocker?.claims?.provesAllN === false, 'mod-50 source blocker unexpectedly proves all-N');

  const mod50SourceArchaeology = readJson(options.mod50SourceArchaeologyPacket);
  assertCondition(mod50SourceArchaeology?.status === 'mod50_source_archaeology_completed_theorem_wedge_prepared', 'mod-50 source archaeology packet has unexpected status');
  assertCondition(mod50SourceArchaeology?.claims?.livePaidCallMade === false, 'mod-50 source archaeology unexpectedly records a paid call');
  assertCondition(mod50SourceArchaeology?.claims?.restoresOriginalGenerator === false, 'mod-50 source archaeology unexpectedly restores the original generator');
  assertCondition(mod50SourceArchaeology?.claims?.provesSymbolicRelevantPairRecurrence === false, 'mod-50 source archaeology unexpectedly proves all-future recurrence');
  assertCondition(mod50SourceArchaeology?.claims?.provesAllN === false, 'mod-50 source archaeology unexpectedly proves all-N');

  const mod50WedgeDecision = readJson(options.mod50WedgeDecisionPacket);
  assertCondition(mod50WedgeDecision?.status === 'mod50_theorem_wedge_decision_blocker_emitted_budget_guarded_live_incomplete_no_universal_theorem', 'mod-50 wedge decision has unexpected status');
  assertCondition(mod50WedgeDecision?.claims?.livePaidCallMade === true, 'mod-50 wedge decision must preserve the prior guarded live call');
  assertCondition(mod50WedgeDecision?.claims?.liveRunIncompleteWithoutTheoremText === true, 'mod-50 wedge decision must record incomplete/no theorem text');
  assertCondition(mod50WedgeDecision?.claims?.provesSymbolicRelevantPairRecurrence === false, 'mod-50 wedge decision unexpectedly proves symbolic recurrence');
  assertCondition(mod50WedgeDecision?.claims?.provesFiniteQPartition === false, 'mod-50 wedge decision unexpectedly proves finite-Q partition');
  assertCondition(mod50WedgeDecision?.claims?.restoresOriginalGenerator === false, 'mod-50 wedge decision unexpectedly restores original generator');
  assertCondition(mod50WedgeDecision?.claims?.provesAllN === false, 'mod-50 wedge decision unexpectedly proves all-N');

  const sourceSearch = readJson(options.sourceSearchPacket);
  assertCondition(sourceSearch?.status === 'no_spend_source_recovery_search_completed_no_promotable_source_found', 'source-search packet has unexpected status');
  assertCondition(sourceSearch?.claims?.searchedMod50SourceRecovery === true, 'source-search packet must include the mod-50 lane');
  assertCondition(sourceSearch?.claims?.foundPromotableMod50Source === false, 'source-search packet unexpectedly found a promotable mod-50 source');
  assertCondition(sourceSearch?.claims?.madeNewPaidCall === false, 'source-search packet unexpectedly records a paid call');

  const profile = buildProfile();
  const profileOutput = options.profileOutput ?? DEFAULT_PROFILE_OUTPUT;
  const missingTheorem = mod50WedgeDecision.missingTheorem?.statementNeeded
    ?? boundary.selectedNextTheoremObject?.statement
    ?? 'A symbolic theorem proving that every future mod-50 relevant-pair row is generated by a finite recurrence/partition whose square-witness Q set is closed, or an equivalent source-generator theorem that makes the bounded CRT replay universal.';

  return {
    schema: 'erdos.number_theory.p848_mod50_generator_source_import_profile_no_spend_blocker_packet/1',
    packetId: 'P848_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE_NO_SPEND_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_mod50_generator_source_import_profile_no_spend_blocker',
      boundaryPacket: rel(options.boundaryPacket),
      boundarySha256: sha256File(options.boundaryPacket),
      mod50SourceBlockerPacket: rel(options.mod50SourceBlockerPacket),
      mod50SourceBlockerSha256: sha256File(options.mod50SourceBlockerPacket),
      mod50SourceArchaeologyPacket: rel(options.mod50SourceArchaeologyPacket),
      mod50SourceArchaeologySha256: sha256File(options.mod50SourceArchaeologyPacket),
      mod50WedgeDecisionPacket: rel(options.mod50WedgeDecisionPacket),
      mod50WedgeDecisionSha256: sha256File(options.mod50WedgeDecisionPacket),
      sourceSearchPacket: rel(options.sourceSearchPacket),
      sourceSearchSha256: sha256File(options.sourceSearchPacket),
    },
    abstractBeforeExpandGate: {
      status: 'satisfied_by_source_profile_blocker_not_expansion',
      largerFamily: 'The universal mod-50 square-witness relevant-pair/family-menu rows after finite restored-menu replay.',
      collapseTheoremObject: 'A mod-50 all-future relevant-pair recurrence, finite-Q partition, or restored original family-menu generator theorem.',
      availableCompression: 'No local finite partition, decreasing rank, bulk cover, impossibility theorem, source theorem, or recombination path closes this family under current repo sources.',
      selectedRoute: 'emit_no_spend_profile_blocker',
      writebackArtifact: rel(DEFAULT_JSON_OUTPUT),
    },
    selectedLane: {
      laneId: 'mod50_all_future_recurrence_or_generator_source',
      atomId: 'p848_mod50_all_future_recurrence_finite_q_or_generator_source',
      theoremObject: 'mod-50 all-future relevant-pair recurrence, finite-Q partition, or original family-menu generator theorem',
      neededTheorem: missingTheorem,
      exactTargets: [
        'Recover/prove the original mod-50 family-menu generator for every future relevant-pair row.',
        'Prove a symbolic recurrence/order theorem that prevents future rows from introducing lower representatives or new first-failure classes.',
        'Prove a finite-Q partition or closed square-witness modulus pool with denominator objects sufficient for every future mod-50 row.',
      ],
      currentBoundary: 'Finite restored-menu replay, finite chunk/CRT provenance, and the prior broad theorem wedge do not supply an all-future recurrence, finite-Q partition, or generator theorem.',
      selectionStatus: 'selected_as_single_mod50_generator_source_import_profile_lane',
      whySelected: [
        'The p4217 residual and square-moduli source lanes already have no-spend profile/approval blockers.',
        'The no-spend source/import boundary selected mod-50 as the remaining source object.',
        'The current mod-50 evidence is finite replay plus blockers; a narrow generator/source profile is sharper than rerunning the broad max-output-token wedge.',
      ],
      whySharperThanPreviousAttempts: [
        'The failed mod-50 live wedge asked broadly about recurrence and finite partition and returned no theorem text after max output tokens.',
        'This profile asks only for a source/import generator, all-future recurrence, or finite-Q partition theorem with exact denominator/partition objects.',
        'The profile rejects finite 280-row restored-menu replay, current square-witness pools, and 40501+ rollout as proof substitutes.',
      ],
    },
    repairedSourceImportProfile: {
      path: rel(profileOutput),
      profileId: profile.profile_id,
      laneCount: profile.lanes.length,
      selectedLaneId: profile.lanes[0].lane_id,
      profile,
      sourceAuditQuestion: 'Problem 848 mod-50 generator/source theorem: given the finite bounded CRT replay theorem, mod-50 source-theorem blocker, source archaeology wedge, source-search gap, and incomplete broad live wedge blocker, identify whether a source/import theorem proves an all-future relevant-pair recurrence, finite-Q partition, or original family-menu generator theorem covering every future mod-50 square-witness row. Return exact hypotheses, constants, denominator/partition objects, and proof boundary; reject finite restored-menu replay, broad wedge reruns, q-cover/singleton descent, threshold shortcuts, and bounded evidence as all-N proof.',
    },
    approvalDecision: {
      status: 'live_execution_blocked_this_turn',
      profilePrepared: true,
      profileExecutionApproved: false,
      profileExecutionBlockedThisTurn: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      usageCheckRun: false,
      usageCheckReason: 'No usage check was needed because current delegate instructions say do not spend and this packet only preserves a future-use profile.',
      reason: 'The current no-spend move is to sharpen the mod-50 theorem target and preserve a single-lane future source/import profile. Provider execution remains blocked until a future budget-guarded release.',
      futureLivePreconditions: [
        'A future instruction permits budget-guarded provider execution for this exact mod-50 generator/source profile.',
        './bin/erdos orp research usage --json confirms remaining local daily run count and USD budget.',
        'The call remains a single high-leverage source-audit question about all-future recurrence, finite-Q partition, or original generator recovery.',
        'Any ORP/OpenAI answer is packetized before promotion to proof, preserving hypotheses, constants, denominator/partition objects, source provenance, and proof boundaries.',
      ],
    },
    unacceptableOutputs: [
      'Finite restored-menu replay or the 280-row finite menu promoted to all-future recurrence.',
      'The current square-witness pool promoted to a finite-Q partition without a closure theorem.',
      'Rerun of the same broad mod-50 paid wedge without a sharper source/import target.',
      '40501+ rollout, q-cover expansion, singleton q descent, fallback-selector ladder, or bounded evidence as all-N proof.',
      'Any claim that Problem 848 is decided without p4217 residual, square-moduli union/hitting, mod-50 generator, and recombination closures.',
    ],
    acceptableSuccessCriteria: [
      'A repo-owned or importable theorem/source proving the mod-50 all-future relevant-pair recurrence with audited hypotheses and constants.',
      'A finite-Q partition theorem or closed square-witness modulus pool with exact denominator/partition objects for every future mod-50 row.',
      'A restored original family-menu generator theorem that makes the finite bounded CRT replay universal.',
      'A precise source gap that names which generator/recurrence/partition hypothesis is still missing and blocks all-N recombination.',
    ],
    paidCallPolicy: {
      currentStepMadePaidCall: false,
      currentStepAllowsPaidCall: false,
      default: 'do_not_call_provider_this_turn',
      futureLiveCallStatus: 'requires_future_budget_guard_and_profile_approval',
      usageCommandBeforeAnyFutureLiveCall: './bin/erdos orp research usage --json',
      futureLiveCommandTemplate: 'erdos orp research ask 848 --profile-file packs/number-theory/problems/848/ORP_RESEARCH_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE.json --question "<mod-50 generator/source theorem question>" --execute --allow-paid --json',
      approvalBoundary: 'This packet prepares and blocks the profile only. It does not run usage, resolve credentials, or call a provider under the current no-spend instruction.',
    },
    forbiddenMovesAfterProfileBlocker: [
      'execute_provider_source_import_under_current_no_spend_instruction',
      'rerun_the_same_mod50_paid_wedge_by_default',
      'treat_finite_mod50_replay_as_all_future_recurrence',
      'treat_current_square_witness_pool_as_finite_q_partition_without_closure_proof',
      'launch_40501_plus_rollout_from_finite_replay',
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'try_fallback_selectors_one_by_one',
      'emit_a_naked_deterministic_rank_boundary',
      'treat_bounded_finite_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Assemble the no-spend source/import boundary after the mod-50 profile blocker, with p4217, square-moduli, and mod-50 source objects now all represented by explicit blockers/profiles.',
      finiteDenominatorOrRankToken: 'p848_mod50_generator_source_import_profile_no_spend_blocker',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet prepares the no-spend mod-50 generator/source-import profile and blocker after the source/import boundary selected mod-50. It names the exact missing theorem object: an all-future mod-50 relevant-pair recurrence, finite-Q partition, or restored original family-menu generator theorem with audited denominator/partition objects. It preserves a future-use single-lane profile and blocks live provider execution under the current no-spend instruction. It does not prove the mod-50 recurrence, restore the generator, prove a finite-Q partition, close p4217 residuals, import a square-moduli union/hitting theorem, recombine all-N, or decide Problem 848.',
    claims: {
      completesMod50GeneratorSourceImportProfileBlocker: true,
      writesFutureUseProfile: true,
      keepsProfileSingleLane: true,
      selectedLaneIsMod50: true,
      sharperThanPriorBroadMod50Wedge: true,
      preservesFiniteReplayBoundary: true,
      preservesMod50SourceBlocker: true,
      preservesMod50SourceSearchGap: true,
      preservesIncompleteLiveWedgeBlocker: true,
      blocksFiniteReplayAsAllFuture: true,
      blocks40501PlusRollout: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      usageCheckRequiredThisTurn: false,
      blocksLiveSpendThisTurn: true,
      requiresFutureApprovalBeforeSpend: true,
      respectsNoPaidByDefault: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      provesMod50AllFutureRecurrence: false,
      restoresOriginalGenerator: false,
      provesFiniteQPartition: false,
      provesUniversalSquareWitnessDomainCover: false,
      provesP4217ResidualSourceTheorem: false,
      importsSquareModuliUnionHittingThreshold: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 mod-50 generator source-import profile no-spend blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Profile ID: \`${packet.repairedSourceImportProfile.profileId}\``,
    `- Profile execution approved: \`${packet.approvalDecision.profileExecutionApproved}\``,
    `- Paid/API call made: \`${packet.approvalDecision.madeNewPaidCall}\``,
    '',
    '## Abstract Before Expanding',
    '',
    `- Larger family: ${packet.abstractBeforeExpandGate.largerFamily}`,
    `- Collapse theorem object: ${packet.abstractBeforeExpandGate.collapseTheoremObject}`,
    `- Selected route: \`${packet.abstractBeforeExpandGate.selectedRoute}\``,
    '',
    '## Selected Lane',
    '',
    `\`${packet.selectedLane.laneId}\`: ${packet.selectedLane.theoremObject}`,
    '',
    '## Exact Targets',
    '',
    packet.selectedLane.exactTargets.map((item) => `- ${item}`).join('\n'),
    '',
    '## Approval Decision',
    '',
    packet.approvalDecision.reason,
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
