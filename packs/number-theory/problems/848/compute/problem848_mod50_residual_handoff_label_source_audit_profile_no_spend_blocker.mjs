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

const DEFAULT_HANDOFF_BLOCKER = path.join(frontierBridge, 'P848_MOD50_SAME_BOUND_RESIDUAL_HANDOFF_LABEL_LOCAL_BLOCKER_PACKET.json');
const DEFAULT_RESIDUAL_BOUNDARY = path.join(frontierBridge, 'P848_MOD50_SAME_BOUND_RESIDUAL_COUNTERFAMILY_BOUNDARY_PACKET.json');
const DEFAULT_EXACT_REPLAY_THEOREM = path.join(frontierBridge, 'P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET.json');
const DEFAULT_RESTORATION_BLOCKER = path.join(frontierBridge, 'P848_MOD50_RELEVANT_PAIR_ROW_GENERATOR_RESTORATION_LOCAL_AUDIT_BLOCKER_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_MOD50_RESIDUAL_HANDOFF_LABEL_SOURCE_AUDIT_PROFILE_NO_SPEND_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_MOD50_RESIDUAL_HANDOFF_LABEL_SOURCE_AUDIT_PROFILE_NO_SPEND_BLOCKER_PACKET.md');
const DEFAULT_PROFILE_OUTPUT = path.join(problemDir, 'ORP_RESEARCH_MOD50_RESIDUAL_HANDOFF_LABEL_SOURCE_IMPORT_PROFILE.json');

const TARGET = 'await_p848_new_local_row_generator_or_residual_handoff_theorem_or_explicit_guarded_source_audit_release';
const NEXT_ACTION = 'await_p848_new_local_residual_handoff_theorem_or_explicit_guarded_source_audit_release_after_profile';
const STATUS = 'mod50_residual_handoff_label_source_audit_profile_no_spend_blocker_emitted';
const PROFILE_ID = 'p848-mod50-residual-handoff-label-source-audit-single';
const LANE_ID = 'p848_mod50_residual_handoff_label_source_import';

function parseArgs(argv) {
  const options = {
    handoffBlocker: DEFAULT_HANDOFF_BLOCKER,
    residualBoundary: DEFAULT_RESIDUAL_BOUNDARY,
    exactReplayTheorem: DEFAULT_EXACT_REPLAY_THEOREM,
    restorationBlocker: DEFAULT_RESTORATION_BLOCKER,
    jsonOutput: null,
    markdownOutput: null,
    profileOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--handoff-blocker') {
      options.handoffBlocker = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--residual-boundary') {
      options.residualBoundary = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--exact-replay-theorem') {
      options.exactReplayTheorem = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--restoration-blocker') {
      options.restorationBlocker = path.resolve(argv[index + 1]);
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

function buildProfile({ handoffBlocker }) {
  const residual = handoffBlocker.handoffLabelLocalAudit.residual;
  const badClasses = handoffBlocker.handoffLabelLocalAudit.pairLabelAudit.map((pair) => ({
    anchor: pair.anchor,
    squareWitnessModulus: pair.squareWitnessModulus,
    squareWitnessLabel: pair.squareWitnessLabel,
    denominatorQOverGcd50NQ: pair.denominatorQOverGcd50NQ,
    badMClass: pair.badMClass,
    requiredLabels: handoffBlocker.handoffLabelLocalAudit.requiredLabels,
  }));

  return {
    schema_version: '1.0.0',
    profile_id: PROFILE_ID,
    label: 'Problem 848 mod-50 residual handoff-label source audit',
    description: 'Single-lane future source-audit profile for the four explicit mod-50 same-bound residual bad m-classes. This profile is prepared locally only and must not execute without a future explicit guarded release and the local usage/budget guard.',
    execution_policy: {
      live_requires_execute: true,
      process_only: true,
      secrets_not_persisted: true,
      default_timeout_sec: 180,
      estimated_cost_usd: 1,
      budget_note: 'Use only after ./bin/erdos orp research usage --json confirms remaining local daily run count and USD guard, and only if a future instruction releases this exact residual handoff-label profile.',
    },
    call_moments: [
      {
        moment_id: 'plan',
        label: 'Local profile preparation',
        calls_api: false,
        description: 'Create the exact residual handoff-label source/import prompt without resolving credentials or making a live call.',
      },
      {
        moment_id: LANE_ID,
        label: 'P848 mod-50 residual handoff labels',
        calls_api: true,
        secret_alias: 'openai-primary',
        env_var: 'OPENAI_API_KEY',
        description: 'Run one bounded source-audit pass asking only for an importable residual handoff-label theorem or the broader row-generator/finite-Q theorem that supplies those labels.',
      },
    ],
    lanes: [
      {
        lane_id: LANE_ID,
        call_moment: LANE_ID,
        label: 'P848 mod-50 residual handoff-label theorem',
        provider: 'openai',
        model: 'gpt-5.4',
        adapter: 'openai_responses',
        role: `Analyze only the supplied Problem 848 mod-50 same-bound residual blocker, residual counterfamily boundary, exact bounded CRT replay theorem, and row-generator restoration blocker as a source/import theorem audit. Return a concise verdict first. The residual representative is n=${residual.representative} with tuple ${residual.tupleKey}. Decide whether an importable or repo-localizable theorem classifies each of the four explicit bad m-classes as bad-lane avoided, top-tie repaired, contrast-only repaired, or terminally blocked, or proves the broader mod-50 relevant-pair row generator / finite-Q partition with denominators Q/gcd(50*n,Q) and handoff labels. Name exact hypotheses, constants, denominator objects, proof boundary, and the 848 all-N handoff. Explicitly reject finite tie-policy exclusion alone, arbitrary square-producing elementary generators, bounded CRT replay, q-cover expansion, singleton descent, fallback selector ladders, and naked rank-boundary evidence as proof.`,
        env_var: 'OPENAI_API_KEY',
        secret_alias: 'openai-primary',
        reasoning_effort: 'medium',
        text_verbosity: 'medium',
        max_output_tokens: 8192,
      },
    ],
    residual_context: {
      representative: residual.representative,
      tuple: residual.tuple,
      tupleKey: residual.tupleKey,
      sourceLabel: residual.sourceLabel,
      badClasses,
    },
    synthesis: {
      style: 'source_or_gap_first',
      require_disagreements: true,
      require_open_questions: true,
      require_exact_handoff_labels: true,
      require_generator_or_finite_q_statement_if_labels_are_indirect: true,
      require_exact_hypotheses_constants_denominators_and_848_handoff: true,
    },
  };
}

function buildPacket(options) {
  const handoffBlocker = readJson(options.handoffBlocker);
  const residualBoundary = readJson(options.residualBoundary);
  const exactReplayTheorem = readJson(options.exactReplayTheorem);
  const restorationBlocker = readJson(options.restorationBlocker);

  assertCondition(handoffBlocker?.status === 'mod50_same_bound_residual_handoff_label_local_blocker_emitted', 'residual handoff-label local blocker not ready');
  assertCondition(handoffBlocker?.target === 'prove_or_block_p848_mod50_same_bound_residual_handoff_labels_after_counterfamily_boundary', 'unexpected residual handoff target');
  assertCondition(handoffBlocker?.recommendedNextAction === TARGET, 'residual handoff blocker does not route to this profile target');
  assertCondition(handoffBlocker?.claims?.provesFiniteTieExclusionForResidualRow === true, 'finite tie exclusion evidence missing');
  assertCondition(handoffBlocker?.claims?.provesResidualHandoffLabels === false, 'residual labels unexpectedly proved locally');
  assertCondition(handoffBlocker?.claims?.provesMod50AllFutureRowGenerator === false, 'row generator unexpectedly proved locally');
  assertCondition(handoffBlocker?.claims?.provesFiniteQPartition === false, 'finite-Q partition unexpectedly proved locally');
  assertCondition(handoffBlocker?.claims?.madeNewPaidCall === false, 'handoff blocker unexpectedly records a paid call');
  assertCondition(Number(handoffBlocker?.handoffLabelLocalAudit?.residual?.representative) === 1837022639, 'unexpected residual representative');
  assertCondition(handoffBlocker?.handoffLabelLocalAudit?.pairCount === 4, 'expected exactly four residual bad m-classes');
  assertCondition(residualBoundary?.status === 'mod50_same_bound_residual_counterfamily_boundary_emitted', 'residual boundary not ready');
  assertCondition(exactReplayTheorem?.claims?.promotesFiniteReplayTheorem === true, 'exact replay theorem missing');
  assertCondition(exactReplayTheorem?.claims?.provesFiniteQPartition === false, 'exact replay unexpectedly proves finite-Q partition');
  assertCondition(restorationBlocker?.claims?.provesMod50AllFutureRowGenerator === false, 'restoration blocker unexpectedly proves row generator');
  assertCondition(restorationBlocker?.claims?.provesFiniteQPartition === false, 'restoration blocker unexpectedly proves finite-Q partition');

  const profile = buildProfile({ handoffBlocker });
  const profileOutput = options.profileOutput ?? DEFAULT_PROFILE_OUTPUT;
  const residual = handoffBlocker.handoffLabelLocalAudit.residual;
  const badClasses = handoffBlocker.handoffLabelLocalAudit.pairLabelAudit.map((pair) => ({
    anchor: pair.anchor,
    squareWitnessModulus: pair.squareWitnessModulus,
    squareWitnessLabel: pair.squareWitnessLabel,
    denominatorQOverGcd50NQ: pair.denominatorQOverGcd50NQ,
    badMClass: pair.badMClass,
    finiteTieEvidenceStatus: pair.finiteTieEvidence?.status ?? null,
    localLabelResult: pair.localLabelResult,
  }));

  const proofBoundary = 'This packet prepares a no-spend future source-audit profile for the mod-50 same-bound residual handoff-label gap. It sharpens the question to the four explicit bad m-classes, their Q/gcd(50*n,Q) denominators, and the admissible labels bad-lane avoided, top-tie repaired, contrast-only repaired, or terminally blocked. It does not run a usage check, resolve credentials, call a provider, prove the residual labels, prove a row generator, prove a finite-Q partition, recombine all-N, expand q-cover/singleton/fallback/rank-boundary lanes, or decide Problem 848.';

  return {
    schema: 'erdos.number_theory.p848_mod50_residual_handoff_label_source_audit_profile_no_spend_blocker_packet/1',
    packetId: 'P848_MOD50_RESIDUAL_HANDOFF_LABEL_SOURCE_AUDIT_PROFILE_NO_SPEND_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_residual_handoff_label_source_audit_profile_no_spend_blocker',
      handoffLabelLocalBlockerPacket: rel(options.handoffBlocker),
      handoffLabelLocalBlockerSha256: sha256File(options.handoffBlocker),
      residualBoundaryPacket: rel(options.residualBoundary),
      residualBoundarySha256: sha256File(options.residualBoundary),
      exactReplayTheoremPacket: rel(options.exactReplayTheorem),
      exactReplayTheoremSha256: sha256File(options.exactReplayTheorem),
      restorationBlockerPacket: rel(options.restorationBlocker),
      restorationBlockerSha256: sha256File(options.restorationBlocker),
    },
    abstractBeforeExpandGate: {
      status: 'satisfied_by_residual_source_profile_blocker_not_expansion',
      largerFamily: 'The same-bound mod-50 residual represents the all-future relevant-pair row surface where finite tie exclusion is weaker than handoff-label classification.',
      collapseTheoremObject: 'A residual handoff-label theorem for the four bad m-classes, or the broader mod-50 relevant-pair row-generator / finite-Q partition theorem with Q/gcd(50*n,Q) labels.',
      availableCompression: 'The repo has finite same-bound tie exclusion and exact bounded replay, but no local residual label theorem, all-future row generator, finite partition, bulk cover, impossibility theorem, or recombination path.',
      selectedRoute: 'emit_no_spend_residual_source_audit_profile_blocker',
      writebackArtifact: rel(DEFAULT_JSON_OUTPUT),
    },
    residualHandoffLabelSourceAuditProfile: {
      path: rel(profileOutput),
      profileId: profile.profile_id,
      selectedLaneId: LANE_ID,
      laneCount: profile.lanes.length,
      profile,
      sourceAuditQuestion: 'Problem 848 residual handoff-label source theorem: given residual n=1837022639 with tuple 9, 11^2, 4, 7^2, 41^2, 23^2, and bad classes m == 0 mod 121, m == 1 mod 49, m == 2 mod 1681, and m == 3 mod 529, identify an importable/localizable theorem that classifies every class as bad-lane avoided, top-tie repaired, contrast-only repaired, or terminally blocked, or supplies the broader mod-50 row-generator/finite-Q partition with Q/gcd(50*n,Q) handoff labels. Return exact hypotheses, constants, source/proof boundary, and 848 all-N handoff; reject finite tie exclusion alone, arbitrary elementary square generators, bounded replay, q-cover/singleton/fallback/rank-boundary evidence, and informal answers.',
    },
    residualSourceImportQuestion: {
      status: 'prepared_no_provider_execution_under_no_spend',
      residual,
      badClassCount: badClasses.length,
      badClasses,
      requiredLabels: handoffBlocker.handoffLabelLocalAudit.requiredLabels,
      exactMissingStatement: handoffBlocker.theoremObjectStillMissing.exactMissingStatement,
      acceptableSuccessCriteria: [
        'A named importable theorem/source with hypotheses, constants, and proof boundary that assigns all four residual bad m-classes admissible handoff labels.',
        'A broader mod-50 relevant-pair row-generator theorem with Q/gcd(50*n,Q) denominators and handoff labels that implies the four residual classifications.',
        'A finite-Q partition theorem with exact denominator objects and a proof that the residual classes fall into terminal or repaired cells.',
        'A precise source gap identifying the missing theorem while preserving all no-spend and no-expansion guardrails.',
      ],
      unacceptableOutputs: [
        'Finite same-bound tie-policy exclusion for this row without per-class handoff labels.',
        'The excluded elementary arbitrary square-producing generator.',
        'Bounded CRT replay, current square-witness pool, or finite restored-menu evidence promoted to all-future proof.',
        'q-cover expansion, singleton descent, fallback selector ladders, naked rank-boundary work, or 40501+ rollout as substitutes.',
        'An informal theorem-shaped answer without hypotheses, constants, denominator objects, source provenance, and proof boundary.',
      ],
    },
    approvalDecision: {
      status: 'live_execution_blocked_this_turn',
      profilePrepared: true,
      profileExecutionApproved: false,
      profileExecutionBlockedThisTurn: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      usageCheckRun: false,
      usageCheckReason: 'No usage check was needed because current delegate instructions say do not spend and this packet only preserves a future-use residual handoff-label profile.',
      futureLivePreconditions: [
        'A future instruction explicitly permits budget-guarded provider execution for this exact residual handoff-label profile.',
        './bin/erdos orp research usage --json confirms remaining local daily run count and USD budget.',
        'The call remains a single high-leverage source-audit question about residual handoff labels or the broader row-generator/finite-Q theorem.',
        'Any answer is packetized as discovery before promotion to proof, preserving hypotheses, constants, denominator objects, source provenance, and proof boundaries.',
      ],
    },
    rankedLegalNextOptions: [
      {
        rank: 1,
        actionId: NEXT_ACTION,
        action: 'Wait for a new local residual handoff-label theorem, row-generator/finite-Q theorem, or future explicit guarded source-audit release for this prepared profile.',
        expectedInformationGain: 'high_if_new_theorem_or_release_exists',
        cost: 'free_until_future_release',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
      {
        rank: 2,
        actionId: 'future_guarded_source_audit_for_prepared_residual_handoff_profile_only',
        action: 'Under a future explicit release and fresh usage clearance only, execute the prepared single-lane residual handoff-label source audit.',
        expectedInformationGain: 'medium_high',
        cost: 'paid_future_only',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
      {
        rank: 3,
        actionId: 'local_theorem_insertion_if_new_source_appears',
        action: 'If a new local theorem/source appears, audit it against the four residual classes and denominator objects before any promotion.',
        expectedInformationGain: 'high_if_source_exists',
        cost: 'low',
        reversibility: 'high',
        probabilityOfChangingDecision: 'low_without_new_source',
      },
    ],
    forbiddenMovesAfterProfileBlocker: [
      'execute_provider_source_audit_under_current_no_spend_instruction',
      'run_usage_check_as_if_execution_were_released',
      'treat_finite_tie_policy_exclusion_as_per_pair_handoff_label_proof',
      'promote_same_bound_residual_as_all_future_generator',
      'promote_bounded_crt_replay_as_finite_q_partition',
      'resume_q_cover_staircase_expansion',
      'resume_q193_q197_singleton_descent',
      'launch_next_prime_fallback_ladder',
      'emit_naked_rank_boundary',
      'claim_all_n_recombination',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Await a new local residual handoff-label theorem, row-generator/finite-Q theorem, or future explicit guarded source-audit release for the prepared residual profile; finite-frontier expansion remains paused.',
      finiteDenominatorOrRankToken: 'p848_mod50_residual_handoff_label_source_audit_profile_no_spend_blocker',
      verificationCommand: "jq '{residualSourceImportQuestion, approvalDecision, claims}' packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_MOD50_RESIDUAL_HANDOFF_LABEL_SOURCE_AUDIT_PROFILE_NO_SPEND_BLOCKER_PACKET.json",
    },
    proofBoundary,
    claims: {
      preparesFutureResidualHandoffLabelSourceAuditProfile: true,
      writesFutureUseProfile: true,
      keepsProfileSingleLane: true,
      selectedLaneIsResidualHandoffLabelSourceImport: true,
      exactFourResidualBadClassesNamed: true,
      preservesFiniteTieExclusionBoundary: true,
      madeNewPaidCall: false,
      usageCheckRun: false,
      currentStepAllowsPaidCall: false,
      providerExecutionReleased: false,
      preservesNoSpendProviderGating: true,
      blocksAdditionalProviderCalls: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      provesFiniteTieExclusionForResidualRow: false,
      provesResidualHandoffLabels: false,
      provesBadLaneAvoidance: false,
      provesTopTieRepair: false,
      provesContrastOnlyRepair: false,
      provesTerminalBlocking: false,
      provesMod50AllFutureRowGenerator: false,
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
  const lines = [];
  lines.push('# P848 mod-50 residual handoff-label source-audit profile no-spend blocker');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Profile ID: \`${packet.residualHandoffLabelSourceAuditProfile.profileId}\``);
  lines.push('');
  lines.push('## Residual Classes');
  lines.push('');
  for (const badClass of packet.residualSourceImportQuestion.badClasses) {
    lines.push(`- anchor \`${badClass.anchor}\`, Q \`${badClass.squareWitnessLabel}\`, denominator \`${badClass.denominatorQOverGcd50NQ}\`, bad class \`${badClass.badMClass.expression}\``);
  }
  lines.push('');
  lines.push('## No-Spend Decision');
  lines.push('');
  lines.push(`- Profile prepared: \`${packet.approvalDecision.profilePrepared}\``);
  lines.push(`- Provider execution approved: \`${packet.approvalDecision.profileExecutionApproved}\``);
  lines.push(`- Usage check run: \`${packet.approvalDecision.usageCheckRun}\``);
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push(packet.proofBoundary);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function writeIfRequested(packet, profile, options) {
  const json = JSON.stringify(packet, null, options.pretty ? 2 : 0);
  if (options.jsonOutput) {
    fs.mkdirSync(path.dirname(options.jsonOutput), { recursive: true });
    fs.writeFileSync(options.jsonOutput, options.pretty ? `${json}\n` : json);
  }
  if (options.markdownOutput) {
    fs.mkdirSync(path.dirname(options.markdownOutput), { recursive: true });
    fs.writeFileSync(options.markdownOutput, renderMarkdown(packet));
  }
  if (options.profileOutput) {
    fs.mkdirSync(path.dirname(options.profileOutput), { recursive: true });
    fs.writeFileSync(options.profileOutput, `${JSON.stringify(profile, null, options.pretty ? 2 : 0)}\n`);
  }
}

const options = parseArgs(process.argv.slice(2));
const packet = buildPacket(options);
const profile = packet.residualHandoffLabelSourceAuditProfile.profile;
writeIfRequested(packet, profile, options);
process.stdout.write(`${JSON.stringify(packet, null, options.pretty ? 2 : 0)}\n`);
