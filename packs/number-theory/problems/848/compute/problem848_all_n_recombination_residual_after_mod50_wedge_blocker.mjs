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

const DEFAULT_WEDGE_BLOCKER_PACKET = path.join(frontierBridge, 'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_MOD50_WEDGE_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_MOD50_WEDGE_BLOCKER_PACKET.md');

const TARGET = 'assemble_p848_all_n_recombination_residual_after_mod50_wedge_blocker';
const NEXT_ACTION = 'derive_p848_p4217_complement_cover_or_impossibility_from_all_n_residual';
const STATUS = 'all_n_recombination_residual_assembled_mod50_wedge_blocked';

const ASSEMBLED_PACKET_SOURCES = [
  {
    id: 'endpoint_availability_staircase_theorem_v0',
    path: 'P848_ENDPOINT_AVAILABILITY_STAIRCASE_THEOREM_V0_PACKET.json',
    role: 'Compresses the repeated endpoint availability split/handoff pattern into the current finite split discipline.',
    boundary: 'Leaves the p4217 unavailable complement open and does not prove global termination.',
  },
  {
    id: 'frontier_transition_rule_v0',
    path: 'P848_FRONTIER_TRANSITION_RULE_V0_PACKET.json',
    role: 'Records the typed frontier-ledger transition/rank discipline for the current ledger cases.',
    boundary: 'Rank is refined for current transitions, not a global all-N decreasing measure.',
  },
  {
    id: 'q_cover_staircase_breaker',
    path: 'P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET.json',
    role: 'Stops the q193..q389 finite q-cover staircase from expanding without a real theorem object.',
    boundary: 'A naked larger q-cover or singleton q-child descent is forbidden.',
  },
  {
    id: 'q_cover_parametric_transition_route',
    path: 'P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET.json',
    role: 'Audits the row-uniform two-root q-cover transition and records that the surface grows rather than decreases.',
    boundary: 'The two-root law is not by itself a well-founded measure or finite cover.',
  },
  {
    id: 'p4217_structural_complement_invariant_blocker',
    path: 'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.json',
    role: 'Audits candidate p4217 complement structural surfaces and blocks selector-ladder/q-cover reuse.',
    boundary: 'No repo-owned p4217 complement cover, impossibility theorem, or decreasing invariant is currently available.',
  },
  {
    id: 'mod50_all_future_recurrence_source_theorem_blocker',
    path: 'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json',
    role: 'Blocks promotion of bounded CRT replay to all-future recurrence without a source theorem/generator.',
    boundary: 'No local all-future recurrence, finite-Q partition, or restored generator is present.',
  },
  {
    id: 'mod50_source_archaeology_theorem_wedge',
    path: 'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json',
    role: 'Audits local frontier-engine/code/output source surfaces and prepares the exact theorem wedge.',
    boundary: 'Finds finite search/menu evidence but no local universal theorem.',
  },
  {
    id: 'mod50_theorem_wedge_decision_blocker',
    path: 'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
    role: 'Decides the prepared wedge as a blocker: the guarded live/planning result supplies no theorem evidence.',
    boundary: 'The finite 280-row menu and incomplete ORP lane cannot be promoted to an all-N proof.',
  },
  {
    id: '282_841_live_family_binding',
    path: 'P848_282_841_LIVE_FAMILY_BINDING_PACKET.json',
    role: 'Binds the synthetic 282/841 representative to a live family-menu row and witness square.',
    boundary: 'Useful for recombination, but not a standalone all-N proof.',
  },
  {
    id: '282_841_row_menu_replay_certificate',
    path: 'P848_282_841_ROW_MENU_REPLAY_CERTIFICATE_PACKET.json',
    role: 'Restores finite row-menu chronology for the observed first 282 failure.',
    boundary: 'Replay is finite unless joined to an all-future recurrence/source theorem.',
  },
  {
    id: 'exact_40500_endpoint_boundary_audit',
    path: 'P848_EXACT_40500_ENDPOINT_BOUNDARY_AUDIT_PACKET.json',
    role: 'Audits compact endpoint evidence against the top repair-class/mod-50 boundary.',
    boundary: 'Compact 1..40500 evidence is not a public raw all-N proof and cannot justify 40501+ rollout by itself.',
  },
];

function parseArgs(argv) {
  const options = {
    wedgeBlockerPacket: DEFAULT_WEDGE_BLOCKER_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--wedge-blocker-packet') {
      options.wedgeBlockerPacket = path.resolve(argv[index + 1]);
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

function exists(filePath) {
  return fs.existsSync(filePath);
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
  const doc = exists(absolutePath) ? readJson(absolutePath) : null;
  return {
    id: source.id,
    relativePath: rel(absolutePath),
    exists: Boolean(doc),
    sha256: doc ? sha256File(absolutePath) : null,
    status: doc?.status ?? null,
    packetId: doc?.packetId ?? null,
    target: doc?.target ?? null,
    recommendedNextAction: doc?.recommendedNextAction ?? null,
    role: source.role,
    boundary: source.boundary,
  };
}

function buildPacket(options) {
  const wedgeBlocker = readJson(options.wedgeBlockerPacket);
  assertCondition(wedgeBlocker?.recommendedNextAction === TARGET, 'wedge blocker does not route to the all-N residual assembly target');
  assertCondition(wedgeBlocker?.claims?.recordsBudgetGuardedWedgeResultBlocker === true, 'wedge blocker does not record a guarded wedge-result blocker');
  assertCondition(wedgeBlocker?.claims?.provesAllN === false, 'wedge blocker unexpectedly claims all-N proof');
  assertCondition(wedgeBlocker?.claims?.blocksQCoverExpansion === true, 'wedge blocker must keep q-cover expansion blocked');
  assertCondition(wedgeBlocker?.claims?.blocksSingletonQDescent === true, 'wedge blocker must keep singleton q descent blocked');

  const assembledPieces = ASSEMBLED_PACKET_SOURCES.map(sourceSummary);
  const missingSources = assembledPieces.filter((piece) => !piece.exists);
  assertCondition(missingSources.length === 0, `missing residual assembly source packet(s): ${missingSources.map((piece) => piece.relativePath).join(', ')}`);

  const finiteMenuAudit = wedgeBlocker.finiteMenuAudit ?? {};
  const outsideTuplePool = finiteMenuAudit.repairWitnessPrimesOutsideTuplePool ?? [];
  const orpResearchRun = wedgeBlocker.orpResearchRun ?? wedgeBlocker.orpPlanningRun ?? {};

  return {
    schema: 'erdos.number_theory.p848_all_n_recombination_residual_after_mod50_wedge_blocker_packet/1',
    packetId: 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_MOD50_WEDGE_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_all_n_residual_assembly_packet',
      wedgeDecisionBlockerPacket: rel(options.wedgeBlockerPacket),
      wedgeDecisionBlockerSha256: sha256File(options.wedgeBlockerPacket),
    },
    assembledPieces,
    residualVerdict: {
      status: 'all_n_recombination_blocked_by_named_residual_atoms',
      allNProofAvailable: false,
      finiteMeasureDecreased: false,
      openFrontierObligationCountAtInput: 80,
      whyNotGlobalConvergence: [
        'The q-cover lane has a nonconvergence blocker and the row-uniform two-root transition grows the q-avoiding class surface.',
        'The p4217 complement has exact local parameterizations and blockers but no cover, impossibility theorem, or global decreasing invariant.',
        'The mod-50 bounded replay lane has finite evidence only: the richest menu has 280 rows and no restored all-future source theorem.',
        `The finite repair witness set is not closed by the tuple square-prime pool; outside tuple-pool primes are ${outsideTuplePool.join(', ') || 'none'}.`,
        'The guarded ORP theorem-wedge result produced no theorem text and cannot be promoted to proof evidence.',
      ],
    },
    residualTheoremAtoms: [
      {
        atomId: 'p848_p4217_unavailable_complement_cover_or_impossibility',
        status: 'open_required_for_all_n',
        neededTheorem: 'Every residue in the p4217 unavailable complement is impossible, covered by a finite selector family, or covered by a structural square-obstruction decomposition with a well-founded rank.',
        currentBoundary: 'The structural complement invariant blocker found no repo-owned invariant, and q-cover/singleton selector ladders are paused.',
        blockingSources: [
          'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.json',
          'P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET.json',
        ],
      },
      {
        atomId: 'p848_mod50_symbolic_relevant_pair_recurrence_or_finite_q_partition',
        status: 'open_required_for_all_n',
        neededTheorem: 'A symbolic recurrence/source generator for every future mod-50 relevant-pair row, or a finite Q partition that covers all future square witnesses.',
        currentBoundary: 'The source-theorem blocker, source archaeology wedge, and theorem-wedge decision blocker all fail to restore this object.',
        blockingSources: [
          'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json',
          'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json',
          'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
        ],
      },
      {
        atomId: 'p848_square_witness_pool_closure_for_future_rows',
        status: 'open_required_for_all_n',
        neededTheorem: 'Future repair rows cannot introduce square-witness primes outside a finite audited pool, or the pool must be enlarged by a proved finite partition.',
        currentBoundary: `The current finite menu already has outside tuple-pool repair witness primes ${outsideTuplePool.join(', ') || 'none'}, so tuple rows alone do not close Q.`,
        blockingSources: [
          'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
        ],
      },
      {
        atomId: 'p848_post_40500_sufficiency_or_threshold_bridge',
        status: 'open_required_for_all_n',
        neededTheorem: 'A theorem proving the compact 1..40500 endpoint boundary suffices for every later row, or an audited external threshold bridge accepted into repo-owned proof scope.',
        currentBoundary: 'The compact endpoint packet is evidence, not a raw all-N scan or a 40501+ rollout license.',
        blockingSources: [
          'P848_EXACT_40500_COMPACT_PROMOTION_PACKET.json',
          'P848_EXACT_40500_ENDPOINT_BOUNDARY_AUDIT_PACKET.json',
        ],
      },
      {
        atomId: 'p848_final_all_n_recombination_theorem',
        status: 'blocked_by_prior_residual_atoms',
        neededTheorem: 'A final recombination theorem joining endpoint staircase, frontier ledger, complement cover, 282/841 chronology, mod-50 recurrence/finite-Q closure, and endpoint sufficiency.',
        currentBoundary: 'The current packet only assembles the residual; it does not discharge the residual atoms.',
        blockingSources: [
          'this_packet',
        ],
      },
    ],
    dependencyDag: {
      nodes: [
        'endpoint_staircase_theorem_v0',
        'frontier_transition_rule_v0',
        'q_cover_staircase_blocked',
        'p4217_complement_cover_or_impossibility',
        '282_841_live_family_and_row_replay',
        'mod50_symbolic_recurrence_or_finite_q_partition',
        'post_40500_sufficiency_or_threshold_bridge',
        'final_all_n_recombination',
      ],
      edges: [
        ['endpoint_staircase_theorem_v0', 'final_all_n_recombination'],
        ['frontier_transition_rule_v0', 'final_all_n_recombination'],
        ['q_cover_staircase_blocked', 'p4217_complement_cover_or_impossibility'],
        ['p4217_complement_cover_or_impossibility', 'final_all_n_recombination'],
        ['282_841_live_family_and_row_replay', 'final_all_n_recombination'],
        ['mod50_symbolic_recurrence_or_finite_q_partition', 'post_40500_sufficiency_or_threshold_bridge'],
        ['post_40500_sufficiency_or_threshold_bridge', 'final_all_n_recombination'],
      ],
      selectedNextNode: 'p4217_complement_cover_or_impossibility',
      selectionReason: [
        'The mod-50 source/theorem wedge has just been exhausted locally and by one guarded incomplete live run.',
        'The finite q-cover lane is blocked as nondecreasing.',
        'The p4217 unavailable complement remains the largest exact residual with an existing parameterized surface and an allowed bulk-cover/impossibility route.',
      ],
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Attempt a theorem-facing p4217 unavailable-complement cover or impossibility theorem from the assembled residual, using a bulk/structural/ranked argument rather than singleton fallback selectors.',
      finiteDenominatorOrRankToken: 'p848_all_n_recombination_residual_after_mod50_wedge_blocker',
      failureBoundary: 'If no complement cover/impossibility can be proved locally, emit a sharper formal recombination blocker naming the missing p4217 theorem object and preserving the q-cover/mod-50 blocks.',
      command: './bin/erdos problem progress 848 --json',
    },
    forbiddenMovesAfterResidualAssembly: [
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'emit_naked_deterministic_rank_boundary',
      'treat_280_row_finite_menu_as_all_future_recurrence',
      'treat_incomplete_live_orp_lane_as_theorem_evidence',
      'try_single_fallback_selectors_without_bulk_cover_impossibility_or_rank_decrease',
    ],
    proofBoundary: 'This packet is a recombination residual assembly, not an all-N proof. It names the theorem atoms still outside the proof after the mod-50 theorem-wedge blocker and keeps finite q-cover/selector expansion blocked until a new theorem object is produced.',
    claims: {
      completesAllNResidualAssembly: true,
      assemblesAllNResidual: true,
      provesAllN: false,
      provesP4217ComplementCover: false,
      provesQCoverDecreasingMeasure: false,
      provesMod50Recurrence: false,
      provesFiniteQPartition: false,
      restoresOriginalGenerator: false,
      provesPost40500Sufficiency: false,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksNakedRankBoundary: true,
      selectedNextActionIsTheoremFacing: true,
      selectedNextActionIsSingletonSelector: false,
      madeNewPaidCall: false,
      referencesBudgetGuardedIncompleteLiveRun: orpResearchRun.apiCalled === true && orpResearchRun.completedTextLaneCount === 0,
      usesBoundedEvidenceOnlyAsBoundary: true,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 all-N recombination residual after mod-50 wedge blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Input open-frontier obligation count: ${packet.residualVerdict.openFrontierObligationCountAtInput}`,
    '',
    '## Assembled Pieces',
    '',
    packet.assembledPieces.map((piece) => `- \`${piece.id}\`: ${piece.role} Boundary: ${piece.boundary}`).join('\n'),
    '',
    '## Residual Verdict',
    '',
    packet.residualVerdict.whyNotGlobalConvergence.map((reason) => `- ${reason}`).join('\n'),
    '',
    '## Remaining Theorem Atoms',
    '',
    packet.residualTheoremAtoms.map((atom) => [
      `### ${atom.atomId}`,
      '',
      `- Status: \`${atom.status}\``,
      `- Needed theorem: ${atom.neededTheorem}`,
      `- Current boundary: ${atom.currentBoundary}`,
    ].join('\n')).join('\n\n'),
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
