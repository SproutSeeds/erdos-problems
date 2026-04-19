#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET.md',
);

const TARGET = 'prove_p848_p4217_q_cover_staircase_breaker_for_q193_q389_successor_surface_or_emit_nonconvergence_blocker';
const NEXT_ACTION = 'derive_p848_q_cover_parametric_transition_theorem_or_route_to_independent_282_841_binding';
const STAIRCASE_BREAKER_TOKEN = 'p848_p4217_q_cover_staircase_breaker_q193_q389';

function parseArgs(argv) {
  const options = {
    assemblyPacket: DEFAULT_ASSEMBLY_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--assembly-packet') {
      options.assemblyPacket = path.resolve(argv[index + 1]);
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

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function commas(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function buildPacket(options) {
  const assembly = readJson(options.assemblyPacket);
  const summary = assembly.postPostPostPostPostPostPostPostPostSuccessorRankBoundarySummary ?? {};
  const primes = summary.postPostPostPostPostPostPostPostPostSuccessorPrimes ?? [];
  const nextFiniteToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? null;
  const rootChildCount = summary.postPostPostPostPostPostPostPostPostSuccessorRootChildCount
    ?? nextFiniteToken?.postPostPostPostPostPostPostPostPostSuccessorRootChildCount
    ?? null;
  const qAvoidingClassCount = summary.postPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount
    ?? nextFiniteToken?.postPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount
    ?? null;

  assertCondition(assembly.recommendedNextAction === TARGET, 'assembly packet does not select the q-cover staircase breaker');
  assertCondition(assembly.staircaseBreakerDirective?.status === 'required_now', 'assembly packet does not require the breaker now');
  assertCondition(assembly.staircaseBreakerDirective?.tokenId === STAIRCASE_BREAKER_TOKEN, 'staircase breaker token mismatch');
  assertCondition(assembly.claims?.requiresStaircaseBreakerBeforeNextQCover === true, 'breaker-before-next-q-cover claim missing');
  assertCondition(assembly.claims?.allowsNakedNextRankBoundary === false, 'assembly still allows a naked rank boundary');
  assertCondition(assembly.claims?.allowsNakedNextQCover === false, 'assembly still allows a naked next q-cover');
  assertCondition(primes.length === 33, 'expected the q193..q389 33-bucket surface');
  assertCondition(primes[0] === 193 && primes.at(-1) === 389, 'unexpected q-cover successor prime range');

  return {
    schema: 'erdos.number_theory.p848_p4217_q_cover_staircase_breaker_nonconvergence_packet/1',
    packetId: 'P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: 'q_cover_staircase_nonconvergence_blocker_emitted_theorem_wedge_required',
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_nonconvergence_blocker',
      tokenId: STAIRCASE_BREAKER_TOKEN,
    },
    sourcePackets: [
      path.relative(repoRoot, options.assemblyPacket),
    ],
    sourcePacketDigests: {
      qCoverConvergenceAssemblySha256: sha256File(options.assemblyPacket),
    },
    breakerResult: {
      kind: 'nonconvergence_blocker',
      result: 'stop_finite_q_cover_staircase_before_any_next_cover',
      reason: 'The q-cover/rank-boundary loop has repeatedly consumed a finite token and emitted a larger successor surface without proving a global well-founded decreasing measure.',
      completedAllowedDirective: 'nonconvergence_blocker_packet_explaining_why_the_q_cover_staircase_must_stop_before_more_compute',
    },
    measuredSurface: {
      sourceAssemblyStatus: assembly.status,
      frontierOpenObligationCountBefore: assembly.frontierComparison?.previousRefreshValueBeforeQ191Q383QAvoidingCover ?? null,
      frontierOpenObligationCountAfter: assembly.frontierComparison?.currentRefreshValueAfterQ191Q383QAvoidingCover ?? null,
      frontierDelta: assembly.frontierComparison?.delta ?? null,
      emittedBucketCount: summary.bucketCount,
      emittedPrimes: primes,
      emittedRootChildCount: rootChildCount,
      emittedQAvoidingClassCount: qAvoidingClassCount,
      interpretation: 'Local finite covers are closing, but the measured theorem frontier is not decreasing. The method is producing a larger next surface rather than a proof-facing terminal state.',
    },
    observedStaircasePattern: {
      status: 'reproducing_without_a_proved_decreasing_measure',
      observedArtifacts: [
        'p479 q-avoiding batch cover',
        '13-bucket rank boundary',
        '15-bucket q-cover/rank handoff',
        '17-bucket q-cover/rank handoff',
        '20-bucket q-cover/rank handoff',
        '22-bucket q-cover/rank handoff',
        '24-bucket q-cover/rank handoff',
        '26-bucket q-cover/rank handoff',
        '29-bucket q-cover/rank handoff',
        '30-bucket q-cover/rank handoff',
        '31-bucket q-cover/rank handoff',
        'q193..q389 33-bucket successor surface',
      ],
      caution: 'This list is local artifact evidence, not a theorem that the process is infinite.',
    },
    nextAllowedMoves: [
      {
        id: 'parametric_transition_theorem',
        action: 'Prove a theorem that the row-uniform two-root q-cover transition is governed by a finite or well-founded parametric mechanism.',
        completionRule: 'Name the well-founded measure and prove it decreases, or prove a finite periodic/denominator partition covering all future q-cover surfaces.',
      },
      {
        id: 'structural_complement_decomposition',
        action: 'Decompose the p4217 complement into structural square-obstruction families instead of following the next q-prime surface.',
        completionRule: 'Every child is terminal, blocked, or assigned a strictly smaller named rank token.',
      },
      {
        id: 'independent_282_841_binding',
        action: 'Use the independent 282/841 live-family binding lane while the q-cover lane is blocked from further finite expansion.',
        completionRule: 'Bind the synthetic 282/841 row to a live family-menu row or emit the exact chronology/source blocker.',
      },
      {
        id: 'budgeted_theorem_wedge',
        action: 'If local theorem extraction stalls, use one ORP/OpenAI theorem-wedge call only inside the local daily budget guard.',
        completionRule: 'The API answer must become an audited local packet before it can change canonical proof status.',
      },
    ],
    forbiddenMovesBeforeNewTheorem: [
      'run_q193_singleton_child_descent',
      'run_q197_singleton_child_descent',
      'emit_naked_33_bucket_rank_boundary',
      'launch_q193_q389_successor_q_cover',
      'extend_to_a_larger_q_cover_without_a_decreasing_measure',
    ],
    theoremWedgeQuestion: [
      'Given the Problem 848 p4217 complement artifacts, can the repeated q-cover transition be expressed as a finite/parametric theorem?',
      'If yes, name the exact state variables and well-founded measure or finite partition.',
      'If no, identify the structural obstruction that proves this q-cover lane cannot be used as the all-N closure route.',
    ].join(' '),
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Derive a parametric q-cover transition theorem from the row-uniform two-root law, or route work to the independent 282/841 live-family binding lane while this finite q-cover staircase remains blocked.',
      coveredFamily: `All ${commas(qAvoidingClassCount)} q-avoiding classes and ${commas(rootChildCount)} root children across q in {${primes.join(',')}}.`,
      finiteDenominatorOrRankToken: STAIRCASE_BREAKER_TOKEN,
      failureBoundary: 'If no parametric transition theorem is found locally, keep the finite q-cover lane blocked and use either structural complement decomposition, the independent 282/841 binding lane, or one budget-guarded theorem-wedge call.',
      whyCheaperThanAnotherQCover: 'Another q-cover would reproduce the same larger-boundary pattern. A theorem wedge is the first move that can collapse the method or honestly retire it.',
      completionRule: 'No more q-cover/rank-boundary finite expansion until a decreasing measure, finite partition, structural cover, or audited theorem-wedge packet exists.',
      command: 'node packs/number-theory/problems/848/compute/problem848_q_cover_staircase_breaker_nonconvergence.mjs --write-defaults --pretty',
    },
    proofBoundary: `This packet blocks the repeated finite q-cover method after the q193..q389 successor surface. It does not close the ${rootChildCount} root children, the ${qAvoidingClassCount} q-avoiding classes, the p4217 complement, the 282/841 live-family binding, or Problem 848.`,
    claims: {
      completesStaircaseBreakerByNonconvergenceBlocker: true,
      blocksNextQCoverUntilParametricTheoremExists: true,
      blocksNakedRankBoundaryUntilDecreasingMeasureExists: true,
      descendsIntoQ193Singleton: false,
      descendsIntoQ197Singleton: false,
      launchesAnotherQCover: false,
      provesParametricTransitionTheorem: false,
      provesStructuralComplementDecomposition: false,
      provesP4217ComplementCoverage: false,
      proves282841LiveFamilyBinding: false,
      provesAllN: false,
    },
  };
}

function renderMarkdown(packet) {
  const surface = packet.measuredSurface;
  return [
    '# P848 q-cover staircase breaker nonconvergence packet',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Breaker token: \`${packet.coversPrimaryNextAction.tokenId}\``,
    `- Emitted buckets blocked from further finite expansion: ${surface.emittedBucketCount}`,
    `- Prime range: ${surface.emittedPrimes[0]}..${surface.emittedPrimes.at(-1)}`,
    `- Root children still outside closure: ${surface.emittedRootChildCount}`,
    `- Q-avoiding classes still outside closure: ${surface.emittedQAvoidingClassCount}`,
    '',
    '## Result',
    '',
    packet.breakerResult.reason,
    '',
    'This is a nonconvergence blocker for the finite q-cover method, not a proof that the mathematical process is infinite.',
    '',
    '## Next Allowed Moves',
    '',
    ...packet.nextAllowedMoves.map((move) => `- \`${move.id}\`: ${move.action}`),
    '',
    '## Forbidden Before New Theorem',
    '',
    ...packet.forbiddenMovesBeforeNewTheorem.map((move) => `- \`${move}\``),
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
    fs.writeFileSync(options.markdownOutput, renderMarkdown(packet));
  }
}

const options = parseArgs(process.argv.slice(2));
const packet = buildPacket(options);
writeOutputs(packet, options);
