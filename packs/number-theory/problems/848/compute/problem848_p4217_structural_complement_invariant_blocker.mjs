#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_ROUTE_PACKET = path.join(FRONTIER_BRIDGE, 'P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET.json');
const DEFAULT_COMPLEMENT_REFINEMENT_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_UNAVAILABLE_COMPLEMENT_REFINEMENT_PACKET.json');
const DEFAULT_P43_SELECTOR_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_COMPLEMENT_P43_FALLBACK_SELECTOR_PACKET.json');
const DEFAULT_P43_OBSTRUCTION_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_COMPLEMENT_P43_SQUARE_OBSTRUCTION_PACKET.json');
const DEFAULT_P61_REFINEMENT_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_COMPLEMENT_P61_AVAILABILITY_REFINEMENT_PACKET.json');
const DEFAULT_P479_BULK_COVER_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_P443_Q97_P479_AVAILABLE_RESIDUE_BULK_COVER_PACKET.json');
const DEFAULT_Q109_STRUCTURE_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_P443_Q97_P479_Q109_NONUNIFORM_BUCKET_STRUCTURE_PACKET.json');
const DEFAULT_MOD50_REPLAY_PACKET = path.join(FRONTIER_BRIDGE, 'P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.md');

const TARGET = 'derive_p848_p4217_structural_complement_decomposition_or_emit_invariant_blocker';
const NEXT_ACTION = 'derive_p848_mod50_all_future_recurrence_or_emit_source_theorem_blocker';

function parseArgs(argv) {
  const options = {
    routePacket: DEFAULT_ROUTE_PACKET,
    complementRefinementPacket: DEFAULT_COMPLEMENT_REFINEMENT_PACKET,
    p43SelectorPacket: DEFAULT_P43_SELECTOR_PACKET,
    p43ObstructionPacket: DEFAULT_P43_OBSTRUCTION_PACKET,
    p61RefinementPacket: DEFAULT_P61_REFINEMENT_PACKET,
    p479BulkCoverPacket: DEFAULT_P479_BULK_COVER_PACKET,
    q109StructurePacket: DEFAULT_Q109_STRUCTURE_PACKET,
    mod50ReplayPacket: DEFAULT_MOD50_REPLAY_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--route-packet') {
      options.routePacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--complement-refinement-packet') {
      options.complementRefinementPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p43-selector-packet') {
      options.p43SelectorPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p43-obstruction-packet') {
      options.p43ObstructionPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p61-refinement-packet') {
      options.p61RefinementPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p479-bulk-cover-packet') {
      options.p479BulkCoverPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--q109-structure-packet') {
      options.q109StructurePacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--mod50-replay-packet') {
      options.mod50ReplayPacket = path.resolve(argv[index + 1]);
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

function sourceEntries(options) {
  return [
    ['route', options.routePacket],
    ['complementRefinement', options.complementRefinementPacket],
    ['p43Selector', options.p43SelectorPacket],
    ['p43Obstruction', options.p43ObstructionPacket],
    ['p61Refinement', options.p61RefinementPacket],
    ['p479BulkCover', options.p479BulkCoverPacket],
    ['q109Structure', options.q109StructurePacket],
    ['mod50Replay', options.mod50ReplayPacket],
  ].filter(([, filePath]) => filePath && fs.existsSync(filePath));
}

function sourcePaths(options) {
  return sourceEntries(options).map(([, filePath]) => path.relative(repoRoot, filePath));
}

function sourceDigests(options) {
  return Object.fromEntries(
    sourceEntries(options).map(([key, filePath]) => [`${key}Sha256`, sha256File(filePath)]),
  );
}

function statusOf(packet) {
  return packet?.status ?? 'missing';
}

function claim(packet, key) {
  return packet?.claims?.[key] === true;
}

function buildPacket(options) {
  const route = readJson(options.routePacket);
  const complementRefinement = readJsonIfPresent(options.complementRefinementPacket);
  const p43Selector = readJsonIfPresent(options.p43SelectorPacket);
  const p43Obstruction = readJsonIfPresent(options.p43ObstructionPacket);
  const p61Refinement = readJsonIfPresent(options.p61RefinementPacket);
  const p479BulkCover = readJsonIfPresent(options.p479BulkCoverPacket);
  const q109Structure = readJsonIfPresent(options.q109StructurePacket);
  const mod50Replay = readJsonIfPresent(options.mod50ReplayPacket);

  assertCondition(route.recommendedNextAction === TARGET, 'route packet does not select the structural complement target');
  assertCondition(route.claims?.routesAwayFromFiniteQCoverStaircase === true, 'route packet does not block finite q-cover reuse');
  assertCondition(route.claims?.launchesAnotherQCover === false, 'route packet unexpectedly launches another q-cover');
  assertCondition(route.claims?.provesStructuralP4217ComplementDecomposition === false, 'route packet already claims structural complement closure');
  assertCondition(p43Selector?.claims?.provesFallbackSelectorForP4217Complement === true, 'p43 selector packet is missing');
  assertCondition(p43Obstruction?.claims?.provesP43SquareObstructionOnComplement === true, 'p43 obstruction packet is missing');
  assertCondition(p61Refinement?.claims?.provesP61AvailabilityPartitionOnComplement === true, 'p61 refinement packet is missing');
  assertCondition(mod50Replay?.claims?.provesSymbolicRelevantPairRecurrence === false, 'mod50 replay unexpectedly proves symbolic recurrence');
  assertCondition(mod50Replay?.claims?.provesFiniteQPartition === false, 'mod50 replay unexpectedly proves a finite Q partition');

  const candidates = [
    {
      id: 'p4217_unavailable_complement_refinement',
      relativePath: path.relative(repoRoot, options.complementRefinementPacket),
      status: statusOf(complementRefinement),
      usefulFact: 'The p4217 complement is parameterized exactly.',
      closureGap: complementRefinement?.proofBoundary ?? 'No complement refinement packet was available.',
      provesP4217ComplementCoverage: false,
    },
    {
      id: 'p43_fallback_selector_and_uniform_square_block',
      relativePath: path.relative(repoRoot, options.p43ObstructionPacket),
      status: statusOf(p43Obstruction),
      usefulFact: 'The first fallback endpoint selector p43 is globally square-blocked by 2^2 on the complement.',
      closureGap: p43Obstruction?.proofBoundary ?? 'No p43 obstruction packet was available.',
      provesP4217ComplementCoverage: claim(p43Obstruction, 'provesComplementCoveredByAnotherEndpoint'),
    },
    {
      id: 'p61_availability_partition',
      relativePath: path.relative(repoRoot, options.p61RefinementPacket),
      status: statusOf(p61Refinement),
      usefulFact: 'The p61 selector gives an exact availability partition after p43 is excluded.',
      closureGap: p61Refinement?.proofBoundary ?? 'No p61 refinement packet was available.',
      provesP4217ComplementCoverage: claim(p61Refinement, 'provesP61UnavailableComplementCovered'),
    },
    {
      id: 'p479_available_bulk_square_obstruction_cover',
      relativePath: path.relative(repoRoot, options.p479BulkCoverPacket),
      status: statusOf(p479BulkCover),
      usefulFact: 'The p479-available finite residue set is batch-classified by first square-obstruction children.',
      closureGap: p479BulkCover?.proofBoundary ?? 'No p479 bulk cover packet was available.',
      provesP4217ComplementCoverage: claim(p479BulkCover, 'provesP4217ComplementCoverage'),
    },
    {
      id: 'q109_regular_singular_boundary',
      relativePath: path.relative(repoRoot, options.q109StructurePacket),
      status: statusOf(q109Structure),
      usefulFact: 'The q109 nonuniform bucket is split into exact regular and singular subbucket boundaries.',
      closureGap: q109Structure?.proofBoundary ?? 'No q109 structure packet was available.',
      provesP4217ComplementCoverage: claim(q109Structure, 'provesP4217ComplementCoverage'),
    },
    {
      id: 'q_cover_parametric_transition_route',
      relativePath: path.relative(repoRoot, options.routePacket),
      status: statusOf(route),
      usefulFact: 'The q-cover row law is exactly two-root on the current q193..q389 surface.',
      closureGap: route.proofBoundary,
      provesP4217ComplementCoverage: false,
    },
  ];

  const candidateCoverageClaims = candidates.filter((candidate) => candidate.provesP4217ComplementCoverage);
  assertCondition(candidateCoverageClaims.length === 0, 'a source candidate unexpectedly claims p4217 complement coverage');

  return {
    schema: 'erdos.number_theory.p848_p4217_structural_complement_invariant_blocker_packet/1',
    packetId: 'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: 'p4217_structural_complement_invariant_blocker_emitted_mod50_recurrence_boundary_selected',
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_exact_invariant_blocker',
      sourceRoutePacket: path.relative(repoRoot, options.routePacket),
    },
    sourcePackets: sourcePaths(options),
    sourcePacketDigests: sourceDigests(options),
    structuralComplementAudit: {
      result: 'no_repo_owned_structural_complement_decomposition_or_decreasing_invariant_available',
      auditedCandidateCount: candidates.length,
      auditedCandidates: candidates,
      nonDecreasingQCoverSurface: {
        routePacket: path.relative(repoRoot, options.routePacket),
        qAvoidingToSourceRatio: route.transitionLawAudit?.qAvoidingToSourceRatio ?? null,
        emittedBucketCount: route.transitionLawAudit?.emittedBucketCount ?? null,
        reason: route.transitionLawAudit?.nonDecreaseReason ?? null,
      },
      failedInvariantClasses: [
        {
          invariant: 'finite q-cover class count',
          failure: 'The q-avoiding surface grows on the current q193..q389 row-uniform two-root transition.',
        },
        {
          invariant: 'single fallback selector ladder',
          failure: 'The p43 selector is uniformly square-blocked, and later selector/refinement packets leave unavailable or q-avoiding complements open.',
        },
        {
          invariant: 'restored finite mod-50 menu replay',
          failure: 'The bounded CRT replay theorem is exact only on restored finite menus and explicitly does not prove symbolic recurrence or finite Q partition.',
        },
      ],
    },
    invariantBlockerDecision: {
      decision: 'do_not_promote_structural_p4217_complement_decomposition_from_current_sources',
      reason: 'The audited local packets give exact refinements, selector obstructions, and finite batch classifications, but none supplies a partition whose children are all terminal/covered or a well-founded invariant that decreases across the whole p4217 complement.',
      requiredToClear: [
        'A deterministic p4217 complement partition with every child terminal, covered, or assigned a strictly smaller structural rank.',
        'A proof that the p479-unavailable, q97, p443-unavailable, and q-avoiding descendant complements are covered by a common square-obstruction mechanism.',
        'A mod-50 symbolic all-future recurrence or finite Q partition that can be recombined with the complement accounting.',
        'An audited theorem-wedge result that supplies one of these missing invariants.',
      ],
      qCoverLaneStatus: 'blocked_until_structural_or_mod50_invariant_exists',
      fallbackSelectorLaneStatus: 'blocked_against_single_selector_ladder',
    },
    nextAllowedMoves: [
      {
        id: 'mod50_all_future_recurrence_or_source_blocker',
        action: 'Prove the all-future mod-50 relevant-pair recurrence or finite Q partition, or emit the exact source-theorem blocker named by the bounded CRT replay theorem.',
        completionRule: 'A symbolic recurrence/finite Q partition replaces finite replay evidence, or the source-theorem blocker becomes canonical before any final recombination claim.',
      },
      {
        id: 'new_structural_complement_theorem',
        action: 'Return to p4217 only with a new deterministic partition, square-obstruction family theorem, or decreasing rank invariant.',
        completionRule: 'The new packet must name the finite denominator/partition/rank and prove why every child is terminal, covered, or smaller.',
      },
      {
        id: 'budgeted_theorem_wedge',
        action: 'If both local routes stall, use one ORP/OpenAI theorem-wedge call only after the local budget guard confirms remaining USD and run count.',
        completionRule: 'Any external answer remains discovery evidence until converted into an audited local packet.',
      },
    ],
    forbiddenMovesBeforeNewInvariant: [
      'run_q193_singleton_child_descent',
      'run_q197_singleton_child_descent',
      'launch_q193_q389_or_larger_q_cover',
      'emit_naked_q193_q389_rank_boundary',
      'try_fallback_selectors_one_by_one_without_batch_or_rank_decrease',
      'treat_finite_mod50_replay_as_all_future_recurrence',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Prove the mod-50 all-future relevant-pair recurrence or finite Q partition, or emit the exact source-theorem blocker at that universal boundary.',
      coveredFamily: 'The mod-50 square-witness domain after the exact bounded CRT menu replay theorem, while the p4217 q-cover and single-selector complement lanes remain blocked.',
      finiteDenominatorOrRankToken: mod50Replay?.deterministicBoundary?.boundaryId ?? 'p848_mod50_all_future_recurrence_source_boundary_after_bounded_replay_theorem',
      failureBoundary: mod50Replay?.deterministicBoundary?.blockedInput ?? 'A symbolic all-future recurrence, finite Q partition, original generator source theorem, or source blocker is required.',
      whyCheaperThanAnotherSelector: 'The p4217 local artifacts currently lack a decreasing structural invariant, while the mod-50 replay theorem already names the next universal source boundary.',
      completionRule: 'No all-N or p4217-complement closure claim is allowed until the mod-50 recurrence/finite-Q boundary is theorem-facing.',
      command: null,
    },
    proofBoundary: 'This packet is an invariant blocker, not a structural complement theorem. It proves only that the currently audited local p4217 artifacts do not contain a repo-owned structural complement decomposition, finite partition, or decreasing invariant. It keeps q-cover expansion and singleton selector descent blocked and routes the next theorem-facing move to the mod-50 all-future recurrence/source boundary.',
    claims: {
      emitsExactInvariantBlocker: true,
      auditsCurrentP4217StructuralCandidates: true,
      provesNoCurrentCandidateClaimsP4217ComplementCoverage: true,
      provesStructuralP4217ComplementDecomposition: false,
      provesP4217ComplementCoverage: false,
      provesDecreasingGlobalInvariant: false,
      blocksQCoverExpansion: true,
      blocksSingletonQChildDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      routesToMod50AllFutureRecurrenceBoundary: true,
      provesMod50AllFutureRecurrence: false,
      provesFiniteQPartition: false,
      provesAllN: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 p4217 structural complement invariant blocker packet',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Audited candidate count: ${packet.structuralComplementAudit.auditedCandidateCount}`,
    '',
    '## Decision',
    '',
    packet.invariantBlockerDecision.reason,
    '',
    '## Audited Candidates',
    '',
    ...packet.structuralComplementAudit.auditedCandidates.map((candidate) => `- \`${candidate.id}\` (${candidate.status}): ${candidate.usefulFact} Gap: ${candidate.closureGap}`),
    '',
    '## Failed Invariants',
    '',
    ...packet.structuralComplementAudit.failedInvariantClasses.map((item) => `- \`${item.invariant}\`: ${item.failure}`),
    '',
    '## Next Move',
    '',
    packet.oneNextAction.action,
    '',
    '## Forbidden Before New Invariant',
    '',
    ...packet.forbiddenMovesBeforeNewInvariant.map((move) => `- \`${move}\``),
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
