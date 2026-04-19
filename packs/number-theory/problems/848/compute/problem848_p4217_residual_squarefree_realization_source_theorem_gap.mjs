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

const DEFAULT_DECISION_BLOCKER_PACKET = path.join(frontierBridge, 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET.md');

const TARGET = 'reduce_p848_p4217_residual_to_squarefree_realization_source_theorem_or_emit_gap';
const NEXT_ACTION = 'assemble_p848_all_n_residual_after_p4217_source_theorem_gap_or_import_source';
const STATUS = 'p4217_residual_source_theorem_gap_emitted_no_finite_partition_rank_or_squarefree_source';

const AUDITED_SOURCE_PACKETS = [
  {
    id: 'p4217_theorem_wedge_decision_blocker',
    path: 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
    usefulFact: 'The single budget-guarded live p4217 wedge completed and found no promotable whole-complement theorem.',
    gap: 'It selects three residual forks but proves none of them.',
  },
  {
    id: 'p4217_theorem_wedge_source_import_audit',
    path: 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_SOURCE_IMPORT_AUDIT_PACKET.json',
    usefulFact: 'The no-spend source/import audit found no repo-owned p4217 whole-complement source theorem.',
    gap: 'It does not import a squarefree-realization source theorem.',
  },
  {
    id: 'p4217_cover_impossibility_blocker',
    path: 'P848_P4217_COMPLEMENT_COVER_IMPOSSIBILITY_BLOCKER_PACKET.json',
    usefulFact: 'The post-residual p4217 cover/impossibility audit found exact local refinements and blockers.',
    gap: 'It found no whole-complement cover, impossibility theorem, or decreasing invariant.',
  },
  {
    id: 'all_n_residual_after_mod50_wedge',
    path: 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_MOD50_WEDGE_BLOCKER_PACKET.json',
    usefulFact: 'The all-N residual assembly names the p4217 complement atom as a remaining theorem obligation.',
    gap: 'It is not an all-N proof and does not close the p4217 residual.',
  },
  {
    id: 'p4217_unavailable_complement_refinement',
    path: 'P848_P4217_UNAVAILABLE_COMPLEMENT_REFINEMENT_PACKET.json',
    usefulFact: 'Exact affine parameterization of the p4217-unavailable complement is present.',
    gap: 'The parameterization is not a finite terminal partition or squarefree realization theorem.',
  },
  {
    id: 'p4217_p61_availability_refinement',
    path: 'P848_P4217_COMPLEMENT_P61_AVAILABILITY_REFINEMENT_PACKET.json',
    usefulFact: 'The p4217 complement has an exact p61 availability split.',
    gap: 'The split opens available and unavailable obligations; it is not a decreasing all-residual rank.',
  },
  {
    id: 'structural_complement_invariant_blocker',
    path: 'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.json',
    usefulFact: 'The structural audit tested candidate complement surfaces.',
    gap: 'It records no structural p4217 complement decomposition or decreasing invariant.',
  },
  {
    id: 'q_cover_staircase_nonconvergence',
    path: 'P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET.json',
    usefulFact: 'The q-cover staircase is blocked as nonconvergent without a new theorem object.',
    gap: 'It does not prove a finite CRT partition or residual squarefree-realization theorem.',
  },
  {
    id: 'q_cover_parametric_transition_route',
    path: 'P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET.json',
    usefulFact: 'The q-cover transition has row-uniform two-root structure.',
    gap: 'The q-avoiding side grows, so this is not a decreasing residual rank.',
  },
  {
    id: 'corrected_square_moduli_no_go',
    path: 'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json',
    usefulFact: 'The corrected analytic audit blocks the current Tao-van Doorn shortcut for the needed union/hitting direction.',
    gap: 'It preserves a possible future imported theorem but supplies no current squarefree-realization source.',
  },
];

function parseArgs(argv) {
  const options = {
    decisionBlockerPacket: DEFAULT_DECISION_BLOCKER_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--decision-blocker-packet') {
      options.decisionBlockerPacket = path.resolve(argv[index + 1]);
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

function summarizeSource(source) {
  const absolutePath = path.join(frontierBridge, source.path);
  const exists = fs.existsSync(absolutePath);
  const doc = exists ? readJson(absolutePath) : null;
  const claims = doc?.claims ?? {};
  return {
    id: source.id,
    relativePath: rel(absolutePath),
    exists,
    sha256: exists ? sha256File(absolutePath) : null,
    status: doc?.status ?? null,
    packetId: doc?.packetId ?? null,
    recommendedNextAction: doc?.recommendedNextAction ?? null,
    usefulFact: source.usefulFact,
    gap: source.gap,
    provesFiniteCrtPartition: claims.provesFiniteP4217Partition === true
      || claims.provesFiniteCompleteCrtPartition === true,
    provesDecreasingRank: claims.provesDecreasingGlobalInvariant === true
      || claims.provesP4217ResidualRankDecrease === true,
    provesSquarefreeRealizationSource: claims.importsSquarefreeRealizationTheorem === true
      || claims.provesSquarefreeRealizationSourceTheorem === true,
    provesAllN: claims.provesAllN === true || claims.decidesProblem848 === true,
  };
}

function buildForkAudit(auditedSources) {
  const finitePartitionSources = auditedSources.filter((source) => source.provesFiniteCrtPartition);
  const decreasingRankSources = auditedSources.filter((source) => source.provesDecreasingRank);
  const squarefreeRealizationSources = auditedSources.filter((source) => source.provesSquarefreeRealizationSource);
  const allNProofSources = auditedSources.filter((source) => source.provesAllN);

  assertCondition(finitePartitionSources.length === 0, `unexpected finite CRT partition source(s): ${finitePartitionSources.map((source) => source.id).join(', ')}`);
  assertCondition(decreasingRankSources.length === 0, `unexpected decreasing-rank source(s): ${decreasingRankSources.map((source) => source.id).join(', ')}`);
  assertCondition(squarefreeRealizationSources.length === 0, `unexpected squarefree-realization source(s): ${squarefreeRealizationSources.map((source) => source.id).join(', ')}`);
  assertCondition(allNProofSources.length === 0, `unexpected all-N proof source(s): ${allNProofSources.map((source) => source.id).join(', ')}`);

  return {
    result: 'no_current_fork_closes',
    forkCount: 3,
    forks: [
      {
        forkId: 'finite_crt_partition',
        closes: false,
        sourceFound: false,
        requiredObject: 'A finite, complete CRT partition of the p4217 unavailable complement whose leaves are terminal, covered, or already discharged.',
        gap: 'Current local packets give exact parameterizations/refinements and finite descendants, but no complete terminal partition of the all-N residual complement.',
      },
      {
        forkId: 'decreasing_rank',
        closes: false,
        sourceFound: false,
        requiredObject: 'A well-founded rank/invariant that strictly decreases on every unresolved p4217 residual transition.',
        gap: 'The row-uniform q-cover transition expands the q-avoiding surface, and the structural invariant audit found no decreasing complement invariant.',
      },
      {
        forkId: 'squarefree_realization_source',
        closes: false,
        sourceFound: false,
        requiredObject: 'A source theorem guaranteeing squarefree values in every locally admissible residual CRT/arithmetic-progression/linear-family instance.',
        gap: 'Neither the local p4217 source audit nor the corrected analytic audit imports or proves this squarefree-realization theorem.',
      },
    ],
  };
}

function buildPacket(options) {
  const decisionBlocker = readJson(options.decisionBlockerPacket);
  assertCondition(decisionBlocker?.recommendedNextAction === TARGET, 'decision blocker does not select the residual fork target');
  assertCondition(decisionBlocker?.claims?.selectsSquarefreeRealizationFork === true, 'decision blocker does not select the residual squarefree-realization fork');
  assertCondition(decisionBlocker?.claims?.provesFiniteP4217Partition === false, 'decision blocker unexpectedly proves a finite p4217 partition');
  assertCondition(decisionBlocker?.claims?.provesDecreasingGlobalInvariant === false, 'decision blocker unexpectedly proves a decreasing invariant');
  assertCondition(decisionBlocker?.claims?.importsSquarefreeRealizationTheorem === false, 'decision blocker unexpectedly imports a squarefree-realization theorem');
  assertCondition(decisionBlocker?.claims?.provesAllN === false, 'decision blocker unexpectedly claims all-N');

  const auditedSources = AUDITED_SOURCE_PACKETS.map(summarizeSource);
  const missingSources = auditedSources.filter((source) => !source.exists);
  assertCondition(missingSources.length === 0, `missing audited packet(s): ${missingSources.map((source) => source.relativePath).join(', ')}`);
  const theoremForkReduction = buildForkAudit(auditedSources);

  return {
    schema: 'erdos.number_theory.p848_p4217_residual_squarefree_realization_source_theorem_gap_packet/1',
    packetId: 'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'blocked_by_no_finite_crt_partition_decreasing_rank_or_squarefree_realization_source',
      decisionBlockerPacket: rel(options.decisionBlockerPacket),
      decisionBlockerSha256: sha256File(options.decisionBlockerPacket),
    },
    sourceGapDecision: {
      decision: 'emit_p4217_residual_squarefree_realization_source_theorem_gap',
      reason: 'The selected residual forks are the right theorem objects, but the current repo-owned sources close none of them.',
      madeNewPaidCall: false,
      paidWedgeReusedAsEvidenceOnly: true,
    },
    auditedSourceCount: auditedSources.length,
    auditedSources,
    theoremForkReduction,
    minimalMissingTheorem: {
      id: 'p848_p4217_residual_squarefree_realization_or_finite_partition',
      preferredSourceShape: decisionBlocker.minimalMissingTheorem?.preferredSourceShape
        ?? 'squarefree_values_in_every_locally_admissible_residual_arithmetic_progression_or_linear_family',
      alternatives: decisionBlocker.minimalMissingTheorem?.alternatives ?? [
        'finite_complete_partition_of_the_p4217_unavailable_complement',
        'well_founded_rank_that_strictly_decreases_on_every_residual_transition',
        'source_theorem_guaranteeing_squarefree_values_in_each_residual_locally_admissible_crt_or_linear_family',
      ],
    },
    forbiddenMovesAfterGap: [
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'rerun_the_same_paid_p4217_wedge_by_default',
      'claim_tao_van_doorn_plus_exact_verifier_decides_848_without_union_hitting_source',
      'treat_affine_parameterization_or_finite_descendant_packets_as_all_N_partition',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Assemble the exact all-N residual boundary after this p4217 source-theorem gap, or import/recover a source theorem that closes finite CRT partition, decreasing rank, or squarefree realization.',
      finiteDenominatorOrRankToken: 'p848_p4217_residual_squarefree_realization_source_theorem_gap',
      command: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet closes the current p4217 residual fork reduction as a source-theorem gap. It proves only absence of a current repo-owned finite CRT partition, decreasing residual rank, or squarefree-realization source theorem among the audited local packets. It does not prove the p4217 complement, all-N recombination, an analytic threshold, or Problem 848.',
    claims: {
      emitsP4217ResidualSourceTheoremGap: true,
      auditsFiniteCrtPartitionFork: true,
      auditsDecreasingRankFork: true,
      auditsSquarefreeRealizationSourceFork: true,
      provesNoCurrentFiniteCrtPartitionSource: true,
      provesNoCurrentDecreasingRankSource: true,
      provesNoCurrentSquarefreeRealizationSource: true,
      madeNewPaidCall: false,
      respectsNoPaidByDefault: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      provesFiniteP4217Partition: false,
      provesP4217ResidualRankDecrease: false,
      provesSquarefreeRealizationSourceTheorem: false,
      importsSquarefreeRealizationTheorem: false,
      provesP4217ComplementCover: false,
      provesP4217ComplementImpossibility: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 p4217 residual squarefree-realization source theorem gap',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Audited sources: ${packet.auditedSourceCount}`,
    '',
    '## Fork Reduction',
    '',
    `- Result: \`${packet.theoremForkReduction.result}\``,
    '',
    packet.theoremForkReduction.forks.map((fork) => [
      `- \`${fork.forkId}\`: closes=${fork.closes ? 'yes' : 'no'}`,
      `  - Required object: ${fork.requiredObject}`,
      `  - Gap: ${fork.gap}`,
    ].join('\n')).join('\n'),
    '',
    '## Minimal Missing Theorem',
    '',
    `- Preferred source shape: \`${packet.minimalMissingTheorem.preferredSourceShape}\``,
    '',
    packet.minimalMissingTheorem.alternatives.map((item) => `- ${item}`).join('\n'),
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesAfterGap.map((move) => `- \`${move}\``).join('\n'),
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

const options = parseArgs(process.argv.slice(2));
const packet = buildPacket(options);
writeOutputs(packet, options);
process.stdout.write(`${JSON.stringify(packet, null, options.pretty ? 2 : 0)}\n`);
