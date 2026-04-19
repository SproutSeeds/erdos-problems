#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_BLOCKER_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET.json',
);
const DEFAULT_Q_COVER_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_ROW_MENU_REPLAY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_282_841_ROW_MENU_REPLAY_CERTIFICATE_PACKET.json',
);
const DEFAULT_TOP_REPAIR_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_TOP_REPAIR_CLASS_MECHANISM_PACKET.json',
);
const DEFAULT_MOD50_REPLAY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET.md',
);

const TARGET = 'derive_p848_q_cover_parametric_transition_theorem_or_route_to_independent_282_841_binding';
const NEXT_ACTION = 'derive_p848_p4217_structural_complement_decomposition_or_emit_invariant_blocker';

function parseArgs(argv) {
  const options = {
    blockerPacket: DEFAULT_BLOCKER_PACKET,
    qCoverAssemblyPacket: DEFAULT_Q_COVER_ASSEMBLY_PACKET,
    rowMenuReplayPacket: DEFAULT_ROW_MENU_REPLAY_PACKET,
    topRepairPacket: DEFAULT_TOP_REPAIR_PACKET,
    mod50ReplayPacket: DEFAULT_MOD50_REPLAY_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--blocker-packet') {
      options.blockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--q-cover-assembly-packet') {
      options.qCoverAssemblyPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--row-menu-replay-packet') {
      options.rowMenuReplayPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--top-repair-packet') {
      options.topRepairPacket = path.resolve(argv[index + 1]);
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

function toBigInt(value, label) {
  try {
    return BigInt(String(value));
  } catch {
    throw new Error(`Invalid BigInt for ${label}: ${value}`);
  }
}

function ratioLabel(numerator, denominator, precision = 6) {
  const scaled = toBigInt(numerator, 'ratio numerator') * 10n ** BigInt(precision);
  const whole = scaled / toBigInt(denominator, 'ratio denominator');
  const text = whole.toString().padStart(precision + 1, '0');
  return `${text.slice(0, -precision)}.${text.slice(-precision)}`;
}

function commas(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function sourcePaths(options, presentOnly = false) {
  const paths = [
    options.blockerPacket,
    options.qCoverAssemblyPacket,
    options.rowMenuReplayPacket,
    options.topRepairPacket,
    options.mod50ReplayPacket,
  ];
  return paths
    .filter((filePath) => filePath && (!presentOnly || fs.existsSync(filePath)))
    .map((filePath) => path.relative(repoRoot, filePath));
}

function sourceDigests(options) {
  const entries = [
    ['qCoverStaircaseBreakerSha256', options.blockerPacket],
    ['qCoverAssemblySha256', options.qCoverAssemblyPacket],
    ['rowMenuReplaySha256', options.rowMenuReplayPacket],
    ['topRepairClassSha256', options.topRepairPacket],
    ['mod50ReplaySha256', options.mod50ReplayPacket],
  ];
  return Object.fromEntries(
    entries
      .filter(([, filePath]) => filePath && fs.existsSync(filePath))
      .map(([key, filePath]) => [key, sha256File(filePath)]),
  );
}

function buildPacket(options) {
  const blocker = readJson(options.blockerPacket);
  const assembly = readJson(options.qCoverAssemblyPacket);
  const rowMenuReplay = readJsonIfPresent(options.rowMenuReplayPacket);
  const topRepair = readJsonIfPresent(options.topRepairPacket);
  const mod50Replay = readJsonIfPresent(options.mod50ReplayPacket);

  assertCondition(blocker.recommendedNextAction === TARGET, 'blocker does not select the q-cover transition/282 route target');
  assertCondition(blocker.claims?.blocksNextQCoverUntilParametricTheoremExists === true, 'blocker does not block the next q-cover');
  assertCondition(blocker.claims?.launchesAnotherQCover === false, 'blocker unexpectedly launches another q-cover');
  assertCondition(assembly.claims?.requiresStaircaseBreakerBeforeNextQCover === true, 'assembly does not require the q-cover breaker');

  const summary = assembly.postPostPostPostPostPostPostPostPostSuccessorRankBoundarySummary ?? {};
  const sourceClassCount = toBigInt(
    summary.sourcePostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount
      ?? assembly.finiteMeasureOrNoMeasureYet?.closedSourceToken?.classifiedSourceQAvoidingClassCount,
    'source q-avoiding class count',
  );
  const rootChildCount = toBigInt(
    summary.postPostPostPostPostPostPostPostPostSuccessorRootChildCount
      ?? blocker.measuredSurface?.emittedRootChildCount,
    'root child count',
  );
  const qAvoidingClassCount = toBigInt(
    summary.postPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount
      ?? blocker.measuredSurface?.emittedQAvoidingClassCount,
    'q-avoiding class count',
  );
  const primes = summary.postPostPostPostPostPostPostPostPostSuccessorPrimes
    ?? blocker.measuredSurface?.emittedPrimes
    ?? [];
  const rootResidueCounts = summary.rootResidueCountsPerClass ?? [];

  assertCondition(primes.length === 33, 'expected the q193..q389 33-bucket surface');
  assertCondition(rootResidueCounts.length === 1 && rootResidueCounts[0] === 2, 'current q-cover surface is not row-uniform two-root');
  assertCondition(rootChildCount === sourceClassCount * 2n, 'root child count is not exactly two per source class');
  assertCondition(qAvoidingClassCount > sourceClassCount, 'q-avoiding surface did not grow by class count');

  const rowMenuReplayClosed = rowMenuReplay?.claims?.provesTargetIsFirst282FailureInRestoredMenu === true
    && rowMenuReplay?.claims?.provesFirstStructuralUnavoidabilityWithinRestoredMenu === true;
  const topRepairFormalized = topRepair?.claims?.formalizesTopRepairClassMechanism === true;
  const mod50FiniteReplayOnly = mod50Replay?.claims?.provesSymbolicRelevantPairRecurrence === false
    && mod50Replay?.claims?.provesFiniteQPartition === false;

  return {
    schema: 'erdos.number_theory.p848_q_cover_parametric_transition_route_packet/1',
    packetId: 'P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: 'q_cover_parametric_transition_audit_routes_to_structural_complement_decomposition',
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_transition_audit_and_282_841_route_check',
      sourceBlockerPacket: path.relative(repoRoot, options.blockerPacket),
    },
    sourcePackets: sourcePaths(options, true),
    sourcePacketDigests: sourceDigests(options),
    transitionLawAudit: {
      result: 'current_surface_has_row_uniform_two_root_law_but_no_decreasing_measure',
      sourceClassCount: sourceClassCount.toString(),
      rootChildCount: rootChildCount.toString(),
      qAvoidingClassCount: qAvoidingClassCount.toString(),
      rootChildToSourceRatio: ratioLabel(rootChildCount, sourceClassCount),
      qAvoidingToSourceRatio: ratioLabel(qAvoidingClassCount, sourceClassCount),
      rootResidueCountsPerClass: rootResidueCounts,
      emittedBucketCount: primes.length,
      emittedPrimes: primes,
      localTheoremStatement: 'For the current q193..q389 successor surface, every source q-avoiding class has exactly two square-obstruction roots at its selected next q-prime. Thus the root-child surface is exactly 2x the source surface, while the q-avoiding complement multiplies by q^2 - 2 on each bucket row.',
      nonDecreaseReason: 'The class-count measure grows from the source surface to both the root-child surface and especially the q-avoiding complement; the frontier ledger count also stays flat rather than decreasing.',
    },
    parametricTheoremDecision: {
      decision: 'do_not_promote_q_cover_as_global_parametric_closure_from_current_sources',
      reason: 'The row-uniform two-root law explains the repeated local shape, but by itself it creates a larger q-avoiding complement. The current sources do not prove a finite periodic partition, a structural impossibility theorem, or a well-founded rank that decreases across q-cover layers.',
      requiredForReopeningQCover: [
        'A finite partition covering all future q-cover states.',
        'A well-founded rank proved to decrease after every q-cover transition.',
        'A structural complement theorem proving the q-avoiding side is impossible or terminal.',
        'An audited theorem-wedge packet that supplies one of the above.',
      ],
      qCoverLaneStatus: 'blocked_until_stronger_invariant_exists',
    },
    independent282841RouteCheck: {
      status: rowMenuReplayClosed
        ? 'already_satisfied_at_restored_finite_menu_chronology_scope'
        : 'not_satisfied',
      rowMenuReplayPacket: rowMenuReplay ? path.relative(repoRoot, options.rowMenuReplayPacket) : null,
      first282FailureIndex: rowMenuReplay?.chronologyReplay?.first282FailureIndex ?? null,
      first282FailureRepresentative: rowMenuReplay?.chronologyReplay?.first282FailureRepresentative ?? null,
      prior282FailureCount: rowMenuReplay?.chronologyReplay?.prior282FailureCount ?? null,
      proofBoundary: rowMenuReplay?.proofBoundary ?? null,
    },
    downstreamRepairRouteCheck: {
      topRepairClassFormalized: topRepairFormalized,
      topRepairPacket: topRepair ? path.relative(repoRoot, options.topRepairPacket) : null,
      mod50FiniteReplayPromoted: Boolean(mod50Replay),
      mod50ReplayPacket: mod50Replay ? path.relative(repoRoot, options.mod50ReplayPacket) : null,
      mod50StillNeedsSymbolicRecurrenceOrFiniteQPartition: Boolean(mod50Replay && mod50FiniteReplayOnly),
      interpretation: 'The 282/841 lane has already fed the top repair-class and finite mod-50 replay chain. The live blockers are now structural p4217 complement accounting and all-future mod-50 recurrence/finite-Q coverage, not another finite q-cover.',
    },
    nextAllowedMoves: [
      {
        id: 'structural_p4217_complement_decomposition',
        action: 'Decompose the p4217 complement into square-obstruction families or emit an exact invariant blocker.',
        completionRule: 'Every family is terminal, blocked, or assigned a strictly smaller structural rank/invariant; no q-cover successor is launched.',
      },
      {
        id: 'mod50_symbolic_recurrence_or_finite_q_partition',
        action: 'Prove the all-future mod-50 relevant-pair recurrence/finite Q partition, or keep the finite replay theorem as a blocker.',
        completionRule: 'A symbolic recurrence or finite Q partition replaces finite menu replay evidence, or a source-theorem blocker remains canonical.',
      },
      {
        id: 'budgeted_theorem_wedge',
        action: 'If local theorem extraction stalls, use one ORP/OpenAI theorem-wedge call within the local daily budget guard.',
        completionRule: 'The external answer must be converted into an audited local packet before changing proof status.',
      },
    ],
    forbiddenMovesBeforeNewInvariant: [
      'run_q193_singleton_child_descent',
      'run_q197_singleton_child_descent',
      'emit_naked_q193_q389_rank_boundary',
      'launch_q193_q389_or_larger_q_cover',
      'treat_restored_finite_menu_replay_as_all_future_recurrence',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Derive a structural p4217 complement decomposition from square-obstruction/CRT families, or emit an exact invariant blocker that names why the complement cannot currently be compressed.',
      coveredFamily: `The p4217 complement frontier after the q-cover staircase blocker, including the q193..q389 q-avoiding surface of ${commas(qAvoidingClassCount)} classes and ${commas(rootChildCount)} root children.`,
      finiteDenominatorOrRankToken: 'p848_p4217_structural_complement_decomposition_after_q_cover_blocker',
      failureBoundary: 'If no structural decomposition is locally available, keep q-cover expansion blocked and route to the mod-50 symbolic recurrence/finite-Q partition or one budget-guarded theorem-wedge packet.',
      whyCheaperThanAnotherQCover: 'The current transition law proves the next q-cover would expand the q-avoiding class surface rather than decrease a known measure.',
      completionRule: 'No q-cover/rank-boundary finite expansion is allowed until a structural complement theorem, decreasing invariant, finite partition, or audited theorem-wedge packet exists.',
      command: null,
    },
    proofBoundary: 'This packet proves the current q-cover transition is a non-decreasing local shape, not a global closure theorem. It routes through already recorded 282/841 finite-menu chronology evidence and leaves p4217 complement decomposition, mod-50 all-future recurrence/finite-Q coverage, and final all-N recombination open.',
    claims: {
      provesCurrentRowUniformTwoRootTransitionLaw: true,
      provesCurrentQCoverClassCountDoesNotDecrease: true,
      provesParametricQCoverGlobalClosure: false,
      routesAwayFromFiniteQCoverStaircase: true,
      routesThroughIndependent282841Evidence: rowMenuReplayClosed,
      proves282841AllFutureRecurrence: false,
      provesStructuralP4217ComplementDecomposition: false,
      provesMod50AllFutureRecurrence: false,
      launchesAnotherQCover: false,
      provesAllN: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  const audit = packet.transitionLawAudit;
  const route = packet.independent282841RouteCheck;
  return [
    '# P848 q-cover parametric transition route packet',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Source q-avoiding classes: ${audit.sourceClassCount}`,
    `- Root children: ${audit.rootChildCount} (${audit.rootChildToSourceRatio}x)`,
    `- Q-avoiding classes: ${audit.qAvoidingClassCount} (${audit.qAvoidingToSourceRatio}x)`,
    '',
    '## Transition Audit',
    '',
    audit.localTheoremStatement,
    '',
    audit.nonDecreaseReason,
    '',
    '## Decision',
    '',
    packet.parametricTheoremDecision.reason,
    '',
    '## 282/841 Route Check',
    '',
    `- Status: \`${route.status}\``,
    `- First 282 failure index: \`${route.first282FailureIndex ?? '(unknown)'}\``,
    `- First 282 failure representative: \`${route.first282FailureRepresentative ?? '(unknown)'}\``,
    `- Prior 282 failure count: \`${route.prior282FailureCount ?? '(unknown)'}\``,
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
