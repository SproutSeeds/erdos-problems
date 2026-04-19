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

const DEFAULT_SOURCE_GAP_PACKET = path.join(frontierBridge, 'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_P4217_SOURCE_THEOREM_GAP_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_P4217_SOURCE_THEOREM_GAP_PACKET.md');

const TARGET = 'assemble_p848_all_n_residual_after_p4217_source_theorem_gap_or_import_source';
const NEXT_ACTION = 'prepare_p848_source_import_recovery_plan_after_p4217_and_mod50_source_gaps';
const STATUS = 'all_n_recombination_residual_assembled_after_p4217_source_theorem_gap';

const ASSEMBLED_PACKET_SOURCES = [
  {
    id: 'p4217_residual_squarefree_realization_source_theorem_gap',
    path: 'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET.json',
    role: 'Closes the p4217 residual fork reduction as a current source-theorem gap.',
    boundary: 'No finite CRT partition, decreasing rank, or squarefree-realization source theorem is present in the audited local packets.',
  },
  {
    id: 'p4217_theorem_wedge_decision_blocker',
    path: 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
    role: 'Records the single budget-guarded live p4217 wedge and its no-promotable-theorem verdict.',
    boundary: 'The live lane is process evidence only and does not prove a whole-complement theorem.',
  },
  {
    id: 'p4217_theorem_wedge_source_import_audit',
    path: 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_SOURCE_IMPORT_AUDIT_PACKET.json',
    role: 'Records the no-spend p4217 source/import audit before the live wedge.',
    boundary: 'No repo-owned p4217 whole-complement source theorem was found.',
  },
  {
    id: 'p4217_complement_cover_impossibility_blocker',
    path: 'P848_P4217_COMPLEMENT_COVER_IMPOSSIBILITY_BLOCKER_PACKET.json',
    role: 'Names the p4217 cover/impossibility theorem object as absent under local sources.',
    boundary: 'Does not close the unavailable complement or supply a decreasing invariant.',
  },
  {
    id: 'corrected_square_moduli_dual_sieve_or_union_hitting_threshold',
    path: 'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json',
    role: 'Closes the current repo-owned Tao-van-Doorn shortcut as a direction mismatch.',
    boundary: 'Avoiding-set upper bounds plus complement duality do not supply the required union/hitting upper bound.',
  },
  {
    id: 'tao_van_doorn_threshold_pivot_reconciliation',
    path: 'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json',
    role: 'Reconciles the attempted analytic threshold pivot with local denominator sanity checks.',
    boundary: 'The local A* denominator sanity check is near 1.028, not the scale needed for a direct 1/25 collapse.',
  },
  {
    id: 'all_n_recombination_residual_after_mod50_wedge_blocker',
    path: 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_MOD50_WEDGE_BLOCKER_PACKET.json',
    role: 'Assembles the earlier all-N residual after the mod-50 theorem wedge blocker.',
    boundary: 'Selects p4217 complement theorem work but does not itself decide all-N.',
  },
  {
    id: 'mod50_theorem_wedge_decision_blocker',
    path: 'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
    role: 'Records the mod-50 theorem-wedge blocker and preserves finite replay as bounded evidence only.',
    boundary: 'No all-future recurrence, finite-Q partition, or restored generator theorem was obtained.',
  },
  {
    id: 'mod50_source_archaeology_theorem_wedge',
    path: 'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json',
    role: 'Audits local mod-50 source surfaces and prepares the theorem wedge.',
    boundary: 'Finds strong finite search/menu evidence but no all-future source theorem.',
  },
  {
    id: 'mod50_all_future_recurrence_source_theorem_blocker',
    path: 'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json',
    role: 'Blocks promotion of bounded CRT replay to a universal mod-50 recurrence.',
    boundary: 'No finite-Q partition or original family-menu generator theorem is restored.',
  },
  {
    id: 'p4217_structural_complement_invariant_blocker',
    path: 'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.json',
    role: 'Audits structural p4217 complement surfaces.',
    boundary: 'No repo-owned structural decomposition or decreasing invariant is available.',
  },
  {
    id: 'q_cover_parametric_transition_route',
    path: 'P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET.json',
    role: 'Audits the row-uniform two-root q-cover transition.',
    boundary: 'The q-avoiding surface grows, so the transition is not a decreasing measure.',
  },
  {
    id: 'q_cover_staircase_breaker_nonconvergence',
    path: 'P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET.json',
    role: 'Blocks deeper q-cover staircase expansion without a new theorem object.',
    boundary: 'No singleton q-child or larger q-cover is justified by this packet.',
  },
  {
    id: 'p848_282_alignment_obstruction',
    path: 'P848_282_ALIGNMENT_OBSTRUCTION_PACKET.json',
    role: 'Reconstructs the observed 282/841 representative mechanism.',
    boundary: 'Does not prove first structural unavoidability for all future rows.',
  },
  {
    id: 'p848_282_841_live_family_binding',
    path: 'P848_282_841_LIVE_FAMILY_BINDING_PACKET.json',
    role: 'Binds the synthetic 282/841 row to a recovered live family-menu row.',
    boundary: 'Useful recombination evidence, not a standalone all-N theorem.',
  },
  {
    id: 'p848_282_841_row_menu_replay_certificate',
    path: 'P848_282_841_ROW_MENU_REPLAY_CERTIFICATE_PACKET.json',
    role: 'Certifies finite row-menu replay around the 282/841 mechanism.',
    boundary: 'Finite replay remains bounded unless joined to a universal source theorem.',
  },
  {
    id: 'p848_exact_40500_compact_promotion',
    path: 'P848_EXACT_40500_COMPACT_PROMOTION_PACKET.json',
    role: 'Promotes compact finite endpoint evidence under its audited scope.',
    boundary: 'Does not license 40501+ rollout without a post-threshold theorem.',
  },
  {
    id: 'p848_exact_40500_endpoint_boundary_audit',
    path: 'P848_EXACT_40500_ENDPOINT_BOUNDARY_AUDIT_PACKET.json',
    role: 'Audits compact endpoint evidence at the 40500 boundary.',
    boundary: 'Bounded endpoint evidence is not a raw all-N proof.',
  },
];

function parseArgs(argv) {
  const options = {
    sourceGapPacket: DEFAULT_SOURCE_GAP_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--source-gap-packet') {
      options.sourceGapPacket = path.resolve(argv[index + 1]);
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

function sourceSummary(source) {
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
    boundary: source.boundary,
  };
}

function buildPacket(options) {
  const sourceGap = readJson(options.sourceGapPacket);
  assertCondition(sourceGap?.recommendedNextAction === TARGET, 'source gap does not route to the post-gap all-N residual assembly target');
  assertCondition(sourceGap?.claims?.emitsP4217ResidualSourceTheoremGap === true, 'source gap packet does not emit the expected p4217 residual source-theorem gap');
  assertCondition(sourceGap?.claims?.madeNewPaidCall === false, 'source gap packet unexpectedly records a new paid call');
  assertCondition(sourceGap?.claims?.blocksQCoverExpansion === true, 'source gap packet must keep q-cover expansion blocked');
  assertCondition(sourceGap?.claims?.blocksSingletonQDescent === true, 'source gap packet must keep singleton q descent blocked');
  assertCondition(sourceGap?.claims?.provesAllN === false, 'source gap packet unexpectedly proves all-N');
  assertCondition(sourceGap?.theoremForkReduction?.result === 'no_current_fork_closes', 'source gap packet does not record the expected unresolved fork reduction');

  const assembledPieces = ASSEMBLED_PACKET_SOURCES.map(sourceSummary);
  const missingSources = assembledPieces.filter((piece) => !piece.exists);
  assertCondition(missingSources.length === 0, `missing residual assembly source packet(s): ${missingSources.map((piece) => piece.relativePath).join(', ')}`);

  return {
    schema: 'erdos.number_theory.p848_all_n_recombination_residual_after_p4217_source_theorem_gap_packet/1',
    packetId: 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_P4217_SOURCE_THEOREM_GAP_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_post_p4217_gap_all_n_residual_assembly',
      sourceGapPacket: rel(options.sourceGapPacket),
      sourceGapSha256: sha256File(options.sourceGapPacket),
    },
    assembledPieces,
    residualVerdict: {
      status: 'all_n_residual_still_open_after_p4217_source_gap',
      allNProofAvailable: false,
      finiteMeasureDecreased: false,
      openFrontierObligationCountAtInput: 85,
      whyNotGlobalConvergence: [
        'The p4217 residual fork reduction found no current finite CRT partition, decreasing rank, or squarefree-realization source theorem.',
        'The mod-50 lane still lacks an all-future relevant-pair recurrence, finite-Q partition, or original family-menu generator theorem.',
        'The corrected square-moduli audit blocks the current Tao-van-Doorn shortcut: the needed union/hitting upper bound is not supplied by the avoiding-set theorem.',
        'The compact 1..40500 endpoint evidence and 282/841 replay are bounded/recombination evidence, not a post-threshold all-N theorem.',
        'The finite q-cover staircase remains blocked because the audited row-uniform transition expands the q-avoiding surface.',
      ],
    },
    remainingTheoremAtoms: [
      {
        atomId: 'p848_p4217_residual_squarefree_realization_or_finite_partition',
        status: 'open_source_theorem_gap',
        neededTheorem: sourceGap.minimalMissingTheorem?.preferredSourceShape
          ?? 'squarefree_values_in_every_locally_admissible_residual_arithmetic_progression_or_linear_family',
        alternatives: sourceGap.minimalMissingTheorem?.alternatives ?? [],
        currentBoundary: 'The p4217 residual fork reduction found no finite complete CRT partition, no decreasing rank, and no squarefree-realization source theorem.',
        blockingSources: [
          'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET.json',
          'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
          'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.json',
        ],
      },
      {
        atomId: 'p848_mod50_all_future_relevant_pair_recurrence_or_finite_q_partition',
        status: 'open_source_theorem_gap',
        neededTheorem: 'A source theorem/generator proving the bounded mod-50 CRT replay is universal, or a finite Q partition replacing that bounded replay.',
        alternatives: [
          'restore_original_family_menu_generator_theorem',
          'prove_mod50_all_future_relevant_pair_recurrence',
          'prove_finite_Q_partition_for_all_future_mod50_witnesses',
        ],
        currentBoundary: 'The mod-50 source blocker, source archaeology handoff, and theorem-wedge decision blocker all fail to restore a universal theorem.',
        blockingSources: [
          'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json',
          'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json',
          'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
        ],
      },
      {
        atomId: 'p848_square_moduli_union_hitting_or_threshold_source',
        status: 'open_import_source_gap',
        neededTheorem: 'An imported or repo-owned square-moduli union/hitting theorem with audited hypotheses, constants, and threshold direction.',
        alternatives: [
          'prove_union_hitting_upper_bound_for_Sawhney_lemma_inputs',
          'import_external_threshold_theorem_with_constants_verified',
          'derive_correct_dual_sieve_packet_that_supplies_the_missing_direction',
        ],
        currentBoundary: 'The current Tao-van-Doorn route supplies an avoiding-set upper bound and only a hitting lower bound under complement duality.',
        blockingSources: [
          'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json',
          'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json',
        ],
      },
      {
        atomId: 'p848_post_40500_sufficiency_or_exact_threshold_extension',
        status: 'open_required_for_all_n',
        neededTheorem: 'A post-40500 sufficiency theorem or exact threshold extension that does not rely on bounded-only replay.',
        alternatives: [
          'prove compact boundary suffices for every later row',
          'import verified threshold theorem below the checked bound',
          'recover source generator that turns finite replay into all-future replay',
        ],
        currentBoundary: 'Exact 1..40500 evidence remains bounded unless paired with a valid threshold or generator theorem.',
        blockingSources: [
          'P848_EXACT_40500_COMPACT_PROMOTION_PACKET.json',
          'P848_EXACT_40500_ENDPOINT_BOUNDARY_AUDIT_PACKET.json',
        ],
      },
      {
        atomId: 'p848_final_all_n_recombination_without_bounded_only_overclaim',
        status: 'blocked_by_prior_residual_atoms',
        neededTheorem: 'A final recombination theorem joining the endpoint, p4217, mod-50, analytic/threshold, and 282/841 chronology lanes after their source gaps close.',
        alternatives: [
          'close p4217 source theorem and mod50 source theorem first',
          'then assemble final all-N recombination packet',
        ],
        currentBoundary: 'This packet assembles the boundary after the p4217 source-theorem gap; it does not discharge the residual atoms.',
        blockingSources: [
          'this_packet',
        ],
      },
    ],
    sourceImportRecoveryPlanNeed: {
      status: 'needed_no_spend_next',
      reason: 'The remaining all-N atoms are source-theorem gaps rather than missing finite q-cover layers.',
      candidateSourceObjects: [
        {
          id: 'p4217_residual_squarefree_realization_source',
          preferredShape: 'squarefree values in every locally admissible residual CRT/arithmetic-progression/linear-family instance',
          verificationCommand: 'rg -n "squarefree.*arithmetic progression|locally admissible|finite CRT partition|decreasing rank|p4217" packs src test',
        },
        {
          id: 'mod50_all_future_recurrence_or_generator',
          preferredShape: 'original family-menu generator theorem or finite-Q partition for all future mod-50 relevant-pair rows',
          verificationCommand: 'rg -n "mod-?50|relevant pair|family-menu|finite Q|all-future recurrence|generator theorem" packs src test',
        },
        {
          id: 'square_moduli_union_hitting_threshold',
          preferredShape: 'union/hitting upper bound for square moduli with constants compatible with Sawhney Lemma 2.1 and Lemma 2.2',
          verificationCommand: 'rg -n "union.*hitting|hitting.*union|square moduli|Tao|van Doorn|Sawhney|Lemma 2\\.1|Lemma 2\\.2" packs src test',
        },
      ],
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Prepare a no-spend source/import recovery plan for the p4217 squarefree-realization/finite-partition/rank gap and the mod-50 all-future recurrence/finite-Q gap before any future live call.',
      finiteDenominatorOrRankToken: 'p848_all_n_residual_after_p4217_source_theorem_gap',
      failureBoundary: 'If no candidate source theorem is recovered locally, emit a formal residual-source import gap packet that names the exact external theorem shapes still needed.',
      command: './bin/erdos problem progress 848 --json',
    },
    forbiddenMovesAfterResidualAssembly: [
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'rerun_the_same_paid_p4217_wedge_by_default',
      'claim_tao_van_doorn_plus_exact_verifier_decides_848_without_union_hitting_source',
      'claim_N0_around_1e6_or_N0_at_most_40500_without_imported_threshold_source',
      'treat_bounded_40500_or_280_row_menu_evidence_as_all_N_proof',
    ],
    proofBoundary: 'This packet closes the post-p4217-gap residual assembly. It names the remaining all-N source-theorem atoms after the p4217 residual source gap and preserves the q-cover, singleton selector, mod-50, and analytic-threshold blocks. It does not prove a finite p4217 partition, a decreasing rank, a squarefree-realization source theorem, a mod-50 all-future recurrence, a post-40500 threshold, all-N recombination, or Problem 848.',
    claims: {
      completesPostP4217GapResidualAssembly: true,
      assemblesAllNResidualAfterP4217Gap: true,
      recordsP4217ResidualSourceTheoremGap: true,
      madeNewPaidCall: false,
      respectsNoPaidByDefault: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      selectedNextActionIsSourceImportRecovery: true,
      selectedNextActionIsSingletonSelector: false,
      selectedNextActionIsQCover: false,
      provesFiniteP4217Partition: false,
      provesP4217ResidualRankDecrease: false,
      provesSquarefreeRealizationSourceTheorem: false,
      provesP4217ComplementCover: false,
      provesP4217ComplementImpossibility: false,
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
    '# P848 all-N recombination residual after p4217 source-theorem gap',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Input open-frontier obligation count: ${packet.residualVerdict.openFrontierObligationCountAtInput}`,
    '',
    '## Residual Verdict',
    '',
    packet.residualVerdict.whyNotGlobalConvergence.map((reason) => `- ${reason}`).join('\n'),
    '',
    '## Assembled Pieces',
    '',
    packet.assembledPieces.map((piece) => `- \`${piece.id}\`: ${piece.role} Boundary: ${piece.boundary}`).join('\n'),
    '',
    '## Remaining Theorem Atoms',
    '',
    packet.remainingTheoremAtoms.map((atom) => [
      `### ${atom.atomId}`,
      '',
      `- Status: \`${atom.status}\``,
      `- Needed theorem: ${atom.neededTheorem}`,
      `- Current boundary: ${atom.currentBoundary}`,
    ].join('\n')).join('\n\n'),
    '',
    '## Source Recovery Need',
    '',
    packet.sourceImportRecoveryPlanNeed.candidateSourceObjects
      .map((sourceObject) => `- \`${sourceObject.id}\`: ${sourceObject.preferredShape}`)
      .join('\n'),
    '',
    '## Next Action',
    '',
    `\`${packet.oneNextAction.stepId}\`: ${packet.oneNextAction.action}`,
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesAfterResidualAssembly.map((move) => `- \`${move}\``).join('\n'),
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
