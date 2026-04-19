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

const DEFAULT_RESIDUAL_PACKET = path.join(frontierBridge, 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_SOURCE_IMPORT_SEARCH_GAP_PACKET.json');
const DEFAULT_P4217_SOURCE_GAP_PACKET = path.join(frontierBridge, 'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET.json');
const DEFAULT_P4217_WEDGE_DECISION_PACKET = path.join(frontierBridge, 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_REPAIRED_SINGLE_LANE_SOURCE_IMPORT_PROFILE_AFTER_NO_SPEND_GAP_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_REPAIRED_SINGLE_LANE_SOURCE_IMPORT_PROFILE_AFTER_NO_SPEND_GAP_PACKET.md');
const DEFAULT_PROFILE_OUTPUT = path.join(problemDir, 'ORP_RESEARCH_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE.json');

const TARGET = 'prepare_p848_repaired_single_lane_source_import_profile_after_no_spend_gap';
const NEXT_ACTION = 'emit_p848_p4217_residual_source_import_profile_approval_blocker_before_any_live_spend';
const STATUS = 'repaired_single_lane_source_import_profile_prepared_after_no_spend_gap';

const SELECTED_LANE_ID = 'p4217_residual_squarefree_realization_source';
const SELECTED_THEOREM_OBJECT = 'p4217 residual squarefree-realization source theorem for every locally admissible residual CRT/arithmetic-progression/linear-family instance';

function parseArgs(argv) {
  const options = {
    residualPacket: DEFAULT_RESIDUAL_PACKET,
    p4217SourceGapPacket: DEFAULT_P4217_SOURCE_GAP_PACKET,
    p4217WedgeDecisionPacket: DEFAULT_P4217_WEDGE_DECISION_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    profileOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--residual-packet') {
      options.residualPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p4217-source-gap-packet') {
      options.p4217SourceGapPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p4217-wedge-decision-packet') {
      options.p4217WedgeDecisionPacket = path.resolve(argv[index + 1]);
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
    profile_id: 'p848-p4217-residual-source-import-single',
    label: 'Problem 848 p4217 residual source-import theorem wedge',
    description: 'Single-lane bounded ORP/OpenAI profile for a future source-audit pass on the p4217 residual squarefree-realization theorem object. This profile is prepared locally and must not execute without an explicit usage/budget guard.',
    execution_policy: {
      live_requires_execute: true,
      process_only: true,
      secrets_not_persisted: true,
      default_timeout_sec: 180,
      estimated_cost_usd: 1,
      budget_note: 'Use only after erdos orp research usage --json confirms remaining local daily run count and USD guard, and only if a future approval packet releases this single-lane profile.',
    },
    call_moments: [
      {
        moment_id: 'plan',
        label: 'Local profile preparation',
        calls_api: false,
        description: 'Create the exact single-lane source/import prompt without resolving any API key.',
      },
      {
        moment_id: 'p848_p4217_residual_source_import',
        label: 'P848 p4217 residual source-import theorem',
        calls_api: true,
        secret_alias: 'openai-primary',
        env_var: 'OPENAI_API_KEY',
        description: 'Run one bounded source-audit pass on the p4217 residual squarefree-realization or finite-partition theorem boundary.',
      },
    ],
    lanes: [
      {
        lane_id: 'p848_p4217_residual_source_import',
        call_moment: 'p848_p4217_residual_source_import',
        label: 'P848 p4217 residual source-import theorem',
        provider: 'openai',
        model: 'gpt-5.4',
        adapter: 'openai_responses',
        role: 'Analyze only the supplied Problem 848 p4217 residual artifacts as a source-import theorem wedge. Return a concise verdict first. Decide whether a cited/importable theorem, finite complete CRT partition, well-founded residual rank, or squarefree-realization theorem supports every locally admissible p4217 residual CRT/arithmetic-progression/linear-family instance. Name exact hypotheses, constants, and failure boundaries. Do not rerun the broad whole-complement wedge, do not use singleton q descent, and do not treat finite evidence as all-N proof.',
        env_var: 'OPENAI_API_KEY',
        secret_alias: 'openai-primary',
        reasoning_effort: 'medium',
        text_verbosity: 'medium',
        max_output_tokens: 8192,
      },
    ],
    synthesis: {
      style: 'answer_with_lane_evidence',
      require_disagreements: true,
      require_open_questions: true,
      require_source_or_gap_first: true,
    },
  };
}

function buildPacket(options) {
  const residual = readJson(options.residualPacket);
  assertCondition(residual?.status === 'all_n_recombination_residual_assembled_after_source_import_search_gap', 'residual packet has unexpected status');
  assertCondition(residual?.target === 'assemble_p848_all_n_residual_after_source_import_search_gap', 'residual packet has unexpected target');
  assertCondition(residual?.recommendedNextAction === TARGET, 'residual packet does not route to repaired profile prep');
  assertCondition(residual?.claims?.selectedNextActionIsSingleLaneProfilePrep === true, 'residual packet does not select single-lane profile prep');
  assertCondition(residual?.claims?.madeNewPaidCall === false, 'residual packet unexpectedly records a paid call');
  assertCondition(residual?.claims?.blocksQCoverExpansion === true, 'residual packet must keep q-cover expansion blocked');
  assertCondition(residual?.claims?.blocksSingletonQDescent === true, 'residual packet must keep singleton descent blocked');
  assertCondition(Array.isArray(residual?.remainingTheoremAtoms) && residual.remainingTheoremAtoms.length === 3, 'residual packet must name exactly three theorem atoms');

  const p4217Atom = residual.remainingTheoremAtoms.find((atom) => atom?.laneId === SELECTED_LANE_ID);
  assertCondition(Boolean(p4217Atom), 'residual packet is missing the p4217 residual theorem atom');

  const p4217SourceGap = readJson(options.p4217SourceGapPacket);
  assertCondition(p4217SourceGap?.status === 'p4217_residual_source_theorem_gap_emitted_no_finite_partition_rank_or_squarefree_source', 'p4217 source gap packet has unexpected status');
  assertCondition(p4217SourceGap?.claims?.madeNewPaidCall === false, 'p4217 source gap packet unexpectedly records a paid call');
  assertCondition(p4217SourceGap?.claims?.provesSquarefreeRealizationSourceTheorem === false, 'p4217 source gap packet unexpectedly proves the source theorem');

  const p4217WedgeDecision = readJson(options.p4217WedgeDecisionPacket);
  assertCondition(p4217WedgeDecision?.status === 'p4217_theorem_wedge_decision_blocker_emitted_budget_guarded_live_no_whole_complement_theorem', 'p4217 wedge decision packet has unexpected status');
  assertCondition(p4217WedgeDecision?.claims?.selectsSquarefreeRealizationFork === true, 'p4217 wedge decision did not select the squarefree-realization fork');
  assertCondition(p4217WedgeDecision?.claims?.blocksQCoverExpansion === true, 'p4217 wedge decision must block q-cover expansion');

  const profile = buildProfile();

  return {
    schema: 'erdos.number_theory.p848_repaired_single_lane_source_import_profile_after_no_spend_gap_packet/1',
    packetId: 'P848_REPAIRED_SINGLE_LANE_SOURCE_IMPORT_PROFILE_AFTER_NO_SPEND_GAP_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_repaired_p4217_residual_single_lane_profile',
      residualPacket: rel(options.residualPacket),
      residualSha256: sha256File(options.residualPacket),
      p4217SourceGapPacket: rel(options.p4217SourceGapPacket),
      p4217SourceGapSha256: sha256File(options.p4217SourceGapPacket),
      p4217WedgeDecisionPacket: rel(options.p4217WedgeDecisionPacket),
      p4217WedgeDecisionSha256: sha256File(options.p4217WedgeDecisionPacket),
    },
    selectedLane: {
      laneId: SELECTED_LANE_ID,
      atomId: p4217Atom.atomId,
      theoremObject: SELECTED_THEOREM_OBJECT,
      neededTheorem: p4217Atom.neededTheorem,
      currentBoundary: p4217Atom.currentBoundary,
      selectionStatus: 'selected_as_single_repaired_source_import_profile_lane',
      whySelected: [
        'The p4217 live wedge selected the squarefree-realization residual fork after failing to find a whole-complement theorem.',
        'The post-source-search all-N residual assembly says to prefer p4217 when the profile can be narrowed to the residual squarefree-realization theorem.',
        'The current repo has already searched all three source/import lanes locally and found no promotable theorem source, so the next profile must be a source/import audit rather than another finite q-cover or broad wedge.',
      ],
      whySharperThanPreviousAttempts: [
        'The previous p4217 live wedge asked for a whole-complement cover theorem, complement impossibility theorem, finite partition, decreasing invariant, or imported/source theorem; this profile asks only for the residual p4217 squarefree-realization source theorem and its exact finite-partition/rank alternatives.',
        'The mod-50 lane remains broader because no concrete generator filename, finite-Q denominator, or original family-menu recurrence source has been restored.',
        'The square-moduli lane remains direction-sensitive because current Tao-van-Doorn sources bound avoiding sets, while the missing object is a Sawhney-compatible union/hitting upper bound.',
        'The repaired profile states non-acceptable outputs up front: no singleton q descent, no q193..q389 cover, no bounded evidence as all-N proof, and no threshold claim without a verified union/hitting source.',
      ],
    },
    repairedSourceImportProfile: {
      path: rel(options.profileOutput ?? DEFAULT_PROFILE_OUTPUT),
      profileId: profile.profile_id,
      laneCount: profile.lanes.length,
      selectedLaneId: profile.lanes[0].lane_id,
      profile,
      sourceAuditQuestion: 'Problem 848 p4217 residual source-import theorem: given the packetized p4217 residual source-theorem gap, the p4217 theorem-wedge decision blocker, and the post-source-search all-N residual assembly, identify whether a source/import theorem proves squarefree values in every locally admissible p4217 residual CRT/arithmetic-progression/linear-family instance, or proves a finite complete CRT partition or well-founded residual rank. Return exact hypotheses/constants and a proof boundary; do not rerun broad whole-complement wedge logic or finite q-cover descent.',
    },
    acceptableSuccessCriteria: [
      'An imported/source theorem with audited hypotheses and constants proving squarefree values in every locally admissible p4217 residual CRT/arithmetic-progression/linear-family instance.',
      'A finite complete CRT partition of the p4217 residual unavailable complement, with every cell closed or reduced to a verified squarefree-realization theorem.',
      'A well-founded decreasing rank/invariant that applies to every residual transition and closes the p4217 residual without singleton fallback descent.',
      'A precise no-source/gap verdict naming the missing hypothesis that prevents promotion of the p4217 residual source-import lane.',
    ],
    nonAcceptableOutputs: [
      'another q-cover over q193..q389 or a larger successor surface',
      'q193/q197 singleton descent or fallback selectors p47, p53, p59 one by one',
      'the same broad p4217 whole-complement wedge without residual specialization',
      'bounded finite evidence promoted as an all-N proof',
      'Tao-van-Doorn threshold collapse, N0 around 1e6, or N0 <= 40500 without an audited union/hitting upper-bound source',
      'an ORP answer promoted to proof without a follow-up audited packet',
    ],
    paidCallPolicy: {
      currentStepMadePaidCall: false,
      currentStepAllowsPaidCall: false,
      default: 'do_not_call_provider',
      futureLiveCallStatus: 'requires_explicit_budget_guard_and_profile_approval',
      usageCommandBeforeAnyFutureLiveCall: 'erdos orp research usage --json',
      futureLiveCommandTemplate: 'erdos orp research ask 848 --profile-file packs/number-theory/problems/848/ORP_RESEARCH_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE.json --question "<p4217 residual source-import theorem question>" --execute --allow-paid --json',
      approvalBoundary: 'This packet prepares the profile only. The next local step should emit an approval/budget blocker before any future live spend unless a later instruction explicitly authorizes guarded execution.',
    },
    forbiddenMovesAfterProfilePrep: [
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'emit_a_naked_deterministic_rank_boundary',
      'try_fallback_selectors_one_by_one',
      'rerun_the_same_p4217_paid_wedge_by_default',
      'rerun_the_same_mod50_paid_wedge_by_default',
      'claim_tao_van_doorn_plus_exact_verifier_decides_848_without_union_hitting_source',
      'claim_N0_around_1e6_or_N0_at_most_40500_without_imported_threshold_source',
      'treat_bounded_40500_or_280_row_menu_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Emit the approval/budget blocker for the repaired p4217 residual source-import profile before any live provider call; only a future explicit guarded release may execute the prepared profile.',
      finiteDenominatorOrRankToken: 'p848_repaired_p4217_residual_source_import_profile_after_no_spend_gap',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet completes repaired single-lane profile preparation by selecting the p4217 residual squarefree-realization source-import lane and writing a future-use ORP profile. It does not call a provider and does not prove a p4217 finite partition, p4217 decreasing rank, p4217 squarefree-realization source theorem, mod-50 all-future recurrence, square-moduli union/hitting threshold, all-N recombination, or Problem 848.',
    claims: {
      completesRepairedSingleLaneProfilePrep: true,
      selectsExactlyOneLane: true,
      selectedLaneIsP4217Residual: true,
      selectedLaneIsMod50: false,
      selectedLaneIsSquareModuliUnionHitting: false,
      sharperThanPriorBroadP4217Wedge: true,
      writesFutureUseProfile: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      requiresApprovalBeforeFutureSpend: true,
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
    '# P848 repaired single-lane source-import profile after no-spend gap',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Selected lane: \`${packet.selectedLane.laneId}\``,
    `- Profile path: \`${packet.repairedSourceImportProfile.path}\``,
    `- Paid/API call made: \`${packet.paidCallPolicy.currentStepMadePaidCall}\``,
    '',
    '## Selected Lane',
    '',
    `- Theorem object: ${packet.selectedLane.theoremObject}`,
    `- Needed theorem: ${packet.selectedLane.neededTheorem}`,
    `- Current boundary: ${packet.selectedLane.currentBoundary}`,
    '',
    '## Why This Lane',
    '',
    packet.selectedLane.whySelected.map((reason) => `- ${reason}`).join('\n'),
    '',
    '## Why Sharper',
    '',
    packet.selectedLane.whySharperThanPreviousAttempts.map((reason) => `- ${reason}`).join('\n'),
    '',
    '## Acceptable Success Criteria',
    '',
    packet.acceptableSuccessCriteria.map((criterion) => `- ${criterion}`).join('\n'),
    '',
    '## Non-Acceptable Outputs',
    '',
    packet.nonAcceptableOutputs.map((output) => `- ${output}`).join('\n'),
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
  if (options.profileOutput) {
    fs.mkdirSync(path.dirname(options.profileOutput), { recursive: true });
    fs.writeFileSync(options.profileOutput, `${JSON.stringify(packet.repairedSourceImportProfile.profile, null, options.pretty ? 2 : 0)}\n`);
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packet = buildPacket(options);
  writeOutputs(packet, options);
}

main();
