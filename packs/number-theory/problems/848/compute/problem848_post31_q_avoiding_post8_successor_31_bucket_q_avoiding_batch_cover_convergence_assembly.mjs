#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_Q_COVER_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.md',
);

const TARGET = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_31_bucket_q_avoiding_batch_cover';
const NEXT_ACTION = 'prove_p848_p4217_q_cover_staircase_breaker_for_q193_q389_successor_surface_or_emit_nonconvergence_blocker';
const NEXT_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_post_post_post_post_post_post_post_post_post_successor_33_bucket_rank_boundary';
const STATUS = 'post31_q_avoiding_post8_successor_31_bucket_q_avoiding_batch_cover_convergence_assembly_selects_33_bucket_post9_successor_rank_compression';
const STAIRCASE_BREAKER_TOKEN = 'p848_p4217_q_cover_staircase_breaker_q193_q389';

function parseArgs(argv) {
  const options = {
    qCoverPacket: DEFAULT_Q_COVER_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--q-cover-packet') {
      options.qCoverPacket = path.resolve(argv[index + 1]);
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
  const qCover = readJson(options.qCoverPacket);
  const summary = qCover.batchCoverSummary ?? {};
  const buckets = qCover.postPostPostPostPostPostPostPostPostSuccessorObstructionPrimeBuckets ?? [];
  const primes = buckets
    .map((bucket) => bucket.postPostPostPostPostPostPostPostPostSuccessorObstructionPrime)
    .filter((prime) => Number.isFinite(prime));
  const consumedToken = qCover.finiteTokenTransition?.consumedFiniteToken ?? null;
  const rootChildToken = qCover.finiteTokenTransition?.producedFiniteTokens?.[0] ?? null;
  const qAvoidingBoundaryToken = qCover.finiteTokenTransition?.producedFiniteTokens?.[1] ?? null;
  const rootChildCount = summary.totalPostPostPostPostPostPostPostPostPostSuccessorRootChildCount;
  const qAvoidingClassCount = summary.totalPostPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount;

  assertCondition(qCover.recommendedNextAction === TARGET, 'q-cover packet does not select this convergence assembly');
  assertCondition(qCover.status === 'all_31_bucket_post_post_post_post_post_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child', 'q-cover status mismatch');
  assertCondition(qCover.claims?.consumes31BucketPost8SuccessorQAvoidingToken === true, 'q-cover consumed token claim missing');
  assertCondition(qCover.claims?.classifiesAll31SourceBucketTokens === true, 'q-cover does not classify all 31 source buckets');
  assertCondition(qCover.claims?.classifiesAllSourceQAvoidingClasses === true, 'q-cover does not classify all source q-avoiding classes');
  assertCondition(qCover.claims?.survivorPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount === '0', 'q-cover has survivors and needs a survivor boundary');
  assertCondition(qCover.claims?.allRowsHaveTwoTargetRoots === true, 'q-cover missing target two-root invariant');
  assertCondition(primes.length === 33, 'expected 33 post9 successor primes');
  assertCondition(summary.minTargetObstructionPrime === 193, 'unexpected first emitted successor prime');
  assertCondition(summary.maxTargetObstructionPrime === 389, 'unexpected last emitted successor prime');

  return {
    schema: 'erdos.number_theory.p848_p4217_post31_q_avoiding_post8_successor_31_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1',
    packetId: 'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'covered_by_this_assembly_packet',
    },
    sourcePackets: [
      path.relative(repoRoot, options.qCoverPacket),
    ],
    sourcePacketDigests: {
      post31QAvoidingPost8Successor31BucketQAvoidingBatchCoverSha256: sha256File(options.qCoverPacket),
    },
    frontierComparison: {
      previousRefreshValueBeforeQ191Q383QAvoidingCover: 77,
      currentRefreshValueAfterQ191Q383QAvoidingCover: 77,
      delta: 0,
      interpretation: 'The q191..q383 q-avoiding cover consumed one finite q-cover token and emitted a 33-bucket q193..q389 successor surface. This is a finite-token handoff, not global convergence; singleton q-child descent and naked next-layer q-cover emission remain blocked until a staircase-breaker theorem, decreasing-rank proof, structural cover/impossibility, or explicit nonconvergence blocker is written.',
    },
    assembledPieces: [
      {
        id: 'q191_q383_q_avoiding_cover_closed',
        claim: `The whole q191..q383 31-bucket q-avoiding cover classified all ${summary.sourcePostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount} source classes with zero survivors.`,
      },
      {
        id: 'q193_q389_successor_surface_emitted',
        claim: `The q-cover emits all 33 post-post-post-post-post-post-post-post-post-successor buckets q in {${primes.join(',')}} with ${rootChildCount} root children and ${qAvoidingClassCount} q-avoiding classes.`,
      },
      {
        id: 'q193_q389_rank_boundary_named',
        claim: `The next finite token is the whole 33-bucket q193..q389 rank/compression boundary ${NEXT_TOKEN}, but it must be consumed by a staircase-breaker result before any next q-cover is launched.`,
      },
      {
        id: 'singleton_descent_blocked',
        claim: 'No q193, q197, or other singleton q-child descent is allowed before the whole 33-bucket rank/compression boundary is consumed or replaced by a structural theorem/impossibility packet.',
      },
      {
        id: 'naked_successor_staircase_blocked',
        claim: 'A deterministic rank-boundary packet is not sufficient if it merely authorizes another larger q-cover; it must prove a decreasing rank, structural closure, bulk cover/impossibility, or record a nonconvergence blocker.',
      },
    ],
    supportedClaim: {
      claim: 'The zero-survivor q191..q383 q-cover is assembled into one whole 33-bucket q193..q389 successor rank/compression obligation.',
      proofBoundary: `This assembly selects the next finite token. It does not close the ${rootChildCount} post-post-post-post-post-post-post-post-post-successor root children, the ${qAvoidingClassCount} successor q-avoiding classes, the p479 branches, q97, p443-unavailable, the p4217 complement, collision-free matching, or Problem 848.`,
    },
    finiteMeasureOrNoMeasureYet: {
      globalFiniteMeasureDecreased: false,
      consumedDecisionToken: {
        tokenId: qAvoidingBoundaryToken?.tokenId ?? null,
        sourceAction: TARGET,
        status: 'consumed_by_convergence_assembly',
      },
      closedSourceToken: {
        ...consumedToken,
        bucketCount: summary.sourcePostPostPostPostPostPostPostPostSuccessorBucketCount,
        sourceRowCount: summary.sourceRowCount,
        sourcePostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.sourcePostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount,
        classifiedSourceQAvoidingClassCount: summary.classifiedSourceQAvoidingClassCount,
        survivorPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.survivorPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount,
        status: 'q191_q383_q_avoiding_cover_consumed_by_post9_33_bucket_convergence_assembly',
      },
      nextFiniteToken: {
        tokenId: NEXT_TOKEN,
        sourceBoundaryTokenId: qAvoidingBoundaryToken?.tokenId ?? null,
        bucketCount: summary.postPostPostPostPostPostPostPostPostSuccessorObstructionPrimeBucketCount,
        sourceRowCount: summary.sourceRowCount,
        sourcePostPostPostPostPostPostPostPostSuccessorBucketCount: summary.sourcePostPostPostPostPostPostPostPostSuccessorBucketCount,
        sourcePostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.sourcePostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount,
        postPostPostPostPostPostPostPostPostSuccessorRootChildCount: rootChildCount,
        postPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount: qAvoidingClassCount,
        status: 'selected_for_whole_boundary_rank_compression',
      },
      staircaseBreakerToken: {
        tokenId: STAIRCASE_BREAKER_TOKEN,
        sourceBoundaryTokenId: qAvoidingBoundaryToken?.tokenId ?? null,
        requiredBeforeNextQCover: true,
        status: 'required_before_any_next_q_cover_or_naked_rank_boundary',
      },
      rootChildToken,
      qAvoidingBoundaryToken,
    },
    postPostPostPostPostPostPostPostPostSuccessorRankBoundarySummary: {
      bucketCount: summary.postPostPostPostPostPostPostPostPostSuccessorObstructionPrimeBucketCount,
      postPostPostPostPostPostPostPostPostSuccessorPrimes: primes,
      sourcePostPostPostPostPostPostPostPostSuccessorBucketCount: summary.sourcePostPostPostPostPostPostPostPostSuccessorBucketCount,
      sourceRowCount: summary.sourceRowCount,
      sourcePostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.sourcePostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount,
      classifiedSourceQAvoidingClassCount: summary.classifiedSourceQAvoidingClassCount,
      survivorPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.survivorPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount,
      rootResidueCountsPerClass: summary.postPostPostPostPostPostPostPostPostSuccessorRootResidueCounts,
      postPostPostPostPostPostPostPostPostSuccessorRootChildCount: rootChildCount,
      postPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount: qAvoidingClassCount,
      minTargetObstructionPrime: summary.minTargetObstructionPrime,
      maxTargetObstructionPrime: summary.maxTargetObstructionPrime,
    },
    compressionCandidate: {
      statement: 'The row-uniform two-root law persists through the q-cover, but the emitted q193..q389 successor buckets must be accounted for as a whole-boundary rank/compression object before any singleton child is opened.',
      missingForUse: 'A single staircase-breaker lemma that proves the repeated q-cover/rank-boundary cycle decreases a genuine measure, closes/structurally decomposes q193..q389, or proves that this lane must stop as a nonconvergent method.',
    },
    staircaseBreakerDirective: {
      status: 'required_now',
      tokenId: STAIRCASE_BREAKER_TOKEN,
      problem: 'The q-cover staircase has closed successive finite layers while repeatedly emitting larger successor boundaries. That is useful local evidence but not a global convergence proof.',
      allowedCompletions: [
        'bulk_selector_cover_or_impossibility_for_the_whole_q193_q389_surface',
        'structural_complement_decomposition_with_each_child_terminal_blocked_or_ranked',
        'ranked_ledger_transition_with_a_proved_decreasing_global_or_well_founded_measure',
        'nonconvergence_blocker_packet_explaining_why_the_q_cover_staircase_must_stop_before_more_compute',
        'budgeted_orp_openai_theorem_wedge_call_if_local_compression_stalls_and_the_daily_budget_guard_allows_it',
      ],
      forbiddenCompletions: [
        'naked_33_bucket_rank_boundary_that_only_selects_another_q_cover',
        'singleton_q193_or_q197_descent',
        'larger_successor_q_cover_without_a_decreasing_measure_or_structural_theorem',
      ],
      minimumWriteback: [
        'Name the exact measure that decreased, or state that no measure decreased.',
        'If no measure decreased, emit a blocker or theorem-wedge packet before launching more q-cover computation.',
        'Refresh TASK_LIST, PROGRESS, FRONTIER_LEDGER, GLOBAL_CONVERGENCE_LIFT, and P4217_COMPLEMENT_STRATEGY_GUARD after the packet.',
      ],
    },
    remainingPuzzleBoundary: {
      openBoundary: `The 33-bucket q193..q389 successor surface of ${rootChildCount} root children and ${qAvoidingClassCount} q-avoiding classes remains outside the proof.`,
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Prove the q-cover staircase breaker over all 33 q193..q389 successor buckets: close/decompose the surface, prove bulk cover/impossibility, prove a well-founded decreasing rank, or emit a nonconvergence blocker before any next q-cover.',
      coveredFamily: `All ${commas(qAvoidingClassCount)} post-post-post-post-post-post-post-post-post-successor q-avoiding classes and ${commas(rootChildCount)} root children across q in {${primes.join(',')}}.`,
      finiteDenominatorOrRankToken: STAIRCASE_BREAKER_TOKEN,
      failureBoundary: 'If no compression/decrease theorem is found locally, emit a nonconvergence/theorem-wedge blocker; do not open q193, q197, another singleton q-child, or a naked next q-cover first.',
      whyCheaperThanSingleSelector: 'The q-cover staircase is now visibly reproducing itself. A breaker theorem is higher value than another finite layer because it can collapse or halt the whole repeated method.',
      completionRule: 'A completion must prove structural closure, bulk impossibility/cover, a decreasing well-founded measure, or a nonconvergence blocker. A deterministic rank boundary alone is disallowed if it merely selects another larger q-cover.',
      command: null,
    },
    oneVerificationCommand: 'node --check packs/number-theory/problems/848/compute/problem848_post31_q_avoiding_post8_successor_31_bucket_q_avoiding_batch_cover_convergence_assembly.mjs && node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js',
    nextTheoremMove: 'Prove a q-cover staircase breaker for all 33 successor buckets q193..q389 before singleton q-child descent or any next q-cover.',
    proofBoundary: `This convergence assembly consumes the zero-survivor q191..q383 q-cover and selects the 33-bucket q193..q389 successor rank/compression token. It does not close the ${rootChildCount} root children, the ${qAvoidingClassCount} q-avoiding classes, the p479 branches, q97, p443-unavailable, the p4217 complement, collision-free matching, or Problem 848.`,
    claims: {
      runsQ191Q383QAvoidingCoverConvergenceAssembly: true,
      consumesQ191Q383QAvoidingCoverDecisionToken: true,
      selects33BucketPostPostPostPostPostPostPostPostPostSuccessorCompressionInsteadOfSingletonDescent: true,
      accountsForAll33PostPostPostPostPostPostPostPostPostSuccessorBuckets: true,
      namesWhole33BucketRankBoundary: true,
      requiresStaircaseBreakerBeforeNextQCover: true,
      allowsNakedNextRankBoundary: false,
      allowsNakedNextQCover: false,
      opensFreshFallbackSelector: false,
      descendsIntoQ193Singleton: false,
      descendsIntoQ197Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostPostPostPostPostPostPostPostPostSuccessorRootChildrenClosed: false,
      provesPostPostPostPostPostPostPostPostPostSuccessorQAvoidingBoundaryClosed: false,
      provesP4217ComplementCoverage: false,
      provesAllN: false,
    },
  };
}

function renderMarkdown(packet) {
  const summary = packet.postPostPostPostPostPostPostPostPostSuccessorRankBoundarySummary;
  const lines = [
    '# P848 P4217 q191..q383 q-cover convergence assembly',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Successor buckets assembled: ${summary.bucketCount}`,
    `- Primes: ${summary.postPostPostPostPostPostPostPostPostSuccessorPrimes.join(', ')}`,
    `- Root children outside closure: ${summary.postPostPostPostPostPostPostPostPostSuccessorRootChildCount}`,
    `- Q-avoiding classes outside closure: ${summary.postPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount}`,
    '',
    '## Assembly',
    '',
    packet.supportedClaim.claim,
    '',
    '## Next Move',
    '',
    packet.oneNextAction.action,
    '',
    `Finite token: \`${packet.oneNextAction.finiteDenominatorOrRankToken}\``,
    '',
    '## Boundary',
    '',
    packet.proofBoundary,
    '',
    '## Verification',
    '',
    `- ${packet.oneVerificationCommand}`,
    '',
  ];
  return `${lines.join('\n')}\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packet = buildPacket(options);
  const jsonText = `${JSON.stringify(packet, null, options.pretty ? 2 : 0)}\n`;
  if (options.jsonOutput) {
    fs.mkdirSync(path.dirname(options.jsonOutput), { recursive: true });
    fs.writeFileSync(options.jsonOutput, jsonText);
  } else {
    process.stdout.write(jsonText);
  }
  if (options.markdownOutput) {
    fs.mkdirSync(path.dirname(options.markdownOutput), { recursive: true });
    fs.writeFileSync(options.markdownOutput, renderMarkdown(packet));
  }
}

main();
