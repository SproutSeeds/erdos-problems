#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_Q_COVER_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.md');

const TARGET = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover';
const NEXT_ACTION = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_buckets_or_emit_rank_boundary';
const CONSUMED_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover';
const NEXT_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary';

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
  const buckets = Array.isArray(qCover.postPostPostPostPostPostPostSuccessorObstructionPrimeBuckets)
    ? qCover.postPostPostPostPostPostPostSuccessorObstructionPrimeBuckets
    : [];
  const primes = buckets
    .map((bucket) => bucket.postPostPostPostPostPostPostSuccessorObstructionPrime)
    .filter((prime) => Number.isFinite(prime));
  const rootChildCount = summary.totalPostPostPostPostPostPostPostSuccessorRootChildCount;
  const qAvoidingClassCount = summary.totalPostPostPostPostPostPostPostSuccessorQAvoidingClassCount;

  assertCondition(qCover.recommendedNextAction === TARGET, 'q-cover packet does not select this convergence assembly');
  assertCondition(qCover.target?.includes('30_bucket_q_avoiding_batch_cover'), 'q-cover target mismatch');
  assertCondition(qCover.claims?.classifiesAll30SourceBucketTokens === true, 'q-cover does not classify all 30 source buckets');
  assertCondition(qCover.claims?.classifiesAllPostPostPostPostPostPostSuccessorQAvoidingClasses === true, 'q-cover does not classify all source q-avoiding classes');
  assertCondition(qCover.claims?.survivorPostPostPostPostPostPostSuccessorQAvoidingClassCount === '0', 'q-cover has survivors and needs a survivor boundary instead');
  assertCondition(qCover.claims?.allRowsHaveTwoPostPostPostPostPostPostPostSuccessorRoots === true, 'q-cover missing two-root invariant');
  assertCondition(primes.length === 31, 'expected 31 post-post-post-post-post-post-post-successor primes');
  assertCondition(summary.minPostPostPostPostPostPostPostSuccessorObstructionPrime === 181, 'unexpected first emitted successor prime');
  assertCondition(summary.maxPostPostPostPostPostPostPostSuccessorObstructionPrime === 379, 'unexpected last emitted successor prime');
  assertCondition(qCover.finiteTokenTransition?.consumedFiniteToken?.tokenId === CONSUMED_TOKEN, 'q-cover consumed token mismatch');

  return {
    schema: 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1',
    packetId: 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: 'post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover_convergence_assembly_selects_31_bucket_post_post_post_post_post_post_post_successor_rank_compression',
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
      postPostPostPostPostPostSuccessor30BucketQAvoidingBatchCoverSha256: sha256File(options.qCoverPacket),
    },
    frontierComparison: {
      previousRefreshValueBeforePostPostPostPostPostPostSuccessorQAvoidingCover: 77,
      currentRefreshValueAfterPostPostPostPostPostPostSuccessorQAvoidingCover: 77,
      delta: 0,
      interpretation: 'The 30-bucket q-avoiding batch cover consumed the q-cover token and emitted a larger 31-bucket successor boundary. This is a finite-token handoff, not global convergence; q181/q193 singleton descent remains blocked.',
    },
    assembledPieces: [
      {
        id: 'post_post_post_post_post_post_successor_30_bucket_q_cover_closed',
        claim: `The whole 30-bucket post-post-post-post-post-post-successor q-avoiding cover classified all ${summary.sourcePostPostPostPostPostPostSuccessorQAvoidingClassCount} source classes with zero survivors.`,
      },
      {
        id: 'post_post_post_post_post_post_post_successor_31_bucket_surface_emitted',
        claim: `The q-cover emits all 31 post-post-post-post-post-post-post-successor buckets q in {${primes.join(',')}} with ${rootChildCount} root children and ${qAvoidingClassCount} q-avoiding classes.`,
      },
      {
        id: 'post_post_post_post_post_post_post_successor_rank_boundary_named',
        claim: `The next finite token is the whole 31-bucket rank/compression boundary ${NEXT_TOKEN}.`,
      },
      {
        id: 'singleton_descent_blocked',
        claim: 'No q181, q193, or other singleton q-child descent is allowed before the whole 31-bucket rank/compression boundary is consumed or replaced by a structural theorem/impossibility packet.',
      },
    ],
    supportedClaim: {
      claim: 'The zero-survivor 30-bucket q-cover is assembled into one whole 31-bucket successor rank/compression obligation over q181..q379.',
      proofBoundary: `This assembly selects the next finite token. It does not close the ${rootChildCount} successor root children, the ${qAvoidingClassCount} successor q-avoiding classes, the p479 branches, q97, p443-unavailable, the p4217 complement, collision-free matching, or Problem 848.`,
    },
    finiteMeasureOrNoMeasureYet: {
      globalFiniteMeasureDecreased: false,
      consumedDecisionToken: {
        tokenId: CONSUMED_TOKEN,
        sourceAction: TARGET,
        status: 'consumed_by_convergence_assembly',
      },
      closedSourceToken: {
        ...qCover.finiteTokenTransition?.consumedFiniteToken,
        tokenId: CONSUMED_TOKEN,
        bucketCount: summary.sourcePostPostPostPostPostPostSuccessorBucketCount,
        sourceRowCount: summary.sourceRowCount,
        sourcePostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.sourcePostPostPostPostPostPostSuccessorQAvoidingClassCount,
        classifiedPostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.classifiedPostPostPostPostPostPostSuccessorQAvoidingClassCount,
        survivorPostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.survivorPostPostPostPostPostPostSuccessorQAvoidingClassCount,
        status: 'q_avoiding_cover_consumed_by_31_bucket_convergence_assembly',
      },
      nextFiniteToken: {
        tokenId: NEXT_TOKEN,
        bucketCount: summary.postPostPostPostPostPostPostSuccessorObstructionPrimeBucketCount,
        sourceRowCount: summary.sourceRowCount,
        sourcePostPostPostPostPostPostSuccessorBucketCount: summary.sourcePostPostPostPostPostPostSuccessorBucketCount,
        sourcePostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.sourcePostPostPostPostPostPostSuccessorQAvoidingClassCount,
        postPostPostPostPostPostPostSuccessorRootChildCount: rootChildCount,
        postPostPostPostPostPostPostSuccessorQAvoidingClassCount: qAvoidingClassCount,
        status: 'selected_for_whole_boundary_rank_compression',
      },
    },
    postPostPostPostPostPostPostSuccessorRankBoundarySummary: {
      bucketCount: summary.postPostPostPostPostPostPostSuccessorObstructionPrimeBucketCount,
      postPostPostPostPostPostPostSuccessorPrimes: primes,
      sourcePostPostPostPostPostPostSuccessorBucketCount: summary.sourcePostPostPostPostPostPostSuccessorBucketCount,
      sourceRowCount: summary.sourceRowCount,
      sourcePostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.sourcePostPostPostPostPostPostSuccessorQAvoidingClassCount,
      classifiedPostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.classifiedPostPostPostPostPostPostSuccessorQAvoidingClassCount,
      survivorPostPostPostPostPostPostSuccessorQAvoidingClassCount: summary.survivorPostPostPostPostPostPostSuccessorQAvoidingClassCount,
      rootResidueCountsPerClass: summary.postPostPostPostPostPostPostSuccessorRootResidueCounts,
      postPostPostPostPostPostPostSuccessorRootChildCount: rootChildCount,
      postPostPostPostPostPostPostSuccessorQAvoidingClassCount: qAvoidingClassCount,
    },
    compressionCandidate: {
      statement: 'The repeated two-root successor law continues to look row-uniform, but the emitted 31 buckets have mixed predecessor support. The honest next theorem object is the whole-boundary rank/compression packet, structural decomposition, or impossibility theorem.',
      missingForUse: 'A single lemma that closes or structurally decomposes every q181..q379 successor bucket without splitting into singleton q children.',
    },
    remainingPuzzleBoundary: {
      openBoundary: `The 31-bucket q181..q379 successor surface of ${rootChildCount} root children and ${qAvoidingClassCount} q-avoiding classes remains outside the proof.`,
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Compress all 31 post-post-post-post-post-post-post-successor buckets, prove a structural decomposition/impossibility theorem, or emit the exact deterministic rank boundary for the whole token.',
      coveredFamily: `All ${commas(qAvoidingClassCount)} post-post-post-post-post-post-post-successor q-avoiding classes and ${commas(rootChildCount)} root children across q in {${primes.join(',')}}.`,
      finiteDenominatorOrRankToken: NEXT_TOKEN,
      failureBoundary: 'If no compression theorem closes the surface, emit a deterministic 31-bucket rank-boundary packet; do not open q181, q193, or any singleton q-child first.',
      whyCheaperThanSingleSelector: 'The q-cover already accounts for every source row and emits the exact 31-bucket successor surface, so a rank/compression packet consumes one finite token while singleton descent would fragment it.',
      completionRule: 'Either the 31-bucket successor surface is structurally compressed/closed, or an exact deterministic rank boundary accounts for every bucket.',
      command: 'node packs/number-theory/problems/848/compute/problem848_post29_q_avoiding_post5_successor_29_bucket_post6_successor_30_bucket_post7_successor_31_bucket_rank_boundary.mjs --write-defaults --pretty',
    },
    oneVerificationCommand: 'node --check packs/number-theory/problems/848/compute/problem848_post29_q_avoiding_post5_successor_29_bucket_post6_successor_30_bucket_q_avoiding_batch_cover_convergence_assembly.mjs && node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js',
    nextTheoremMove: 'Run whole-boundary compression, structural decomposition, impossibility, or deterministic rank-boundary work over all 31 successor buckets q181..q379 before singleton q-child descent.',
    proofBoundary: `This convergence assembly consumes the zero-survivor 30-bucket q-cover and selects the 31-bucket successor rank/compression token. It does not close the ${rootChildCount} root children, the ${qAvoidingClassCount} q-avoiding classes, the p479 branches, q97, p443-unavailable, the p4217 complement, collision-free matching, or Problem 848.`,
    claims: {
      runsPostPostPostPostPostPostSuccessor30BucketQAvoidingCoverConvergenceAssembly: true,
      consumesPostPostPostPostPostPostSuccessor30BucketQAvoidingCoverDecisionToken: true,
      selects31BucketPostPostPostPostPostPostPostSuccessorCompressionInsteadOfSingletonDescent: true,
      accountsForAll31PostPostPostPostPostPostPostSuccessorBuckets: true,
      namesWhole31BucketRankBoundary: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ181Singleton: false,
      descendsIntoQ193Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostPostPostPostPostPostPostSuccessorRootChildrenClosed: false,
      provesPostPostPostPostPostPostPostSuccessorQAvoidingBoundaryClosed: false,
      provesP4217ComplementCoverage: false,
      provesAllN: false,
    },
  };
}

function renderMarkdown(packet) {
  const summary = packet.postPostPostPostPostPostPostSuccessorRankBoundarySummary;
  const lines = [
    '# P848 P4217 post-post-post-post-post-post-successor 30-bucket q-cover convergence assembly',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Successor buckets assembled: ${summary.bucketCount}`,
    `- Primes: ${summary.postPostPostPostPostPostPostSuccessorPrimes.join(', ')}`,
    `- Root children outside closure: ${summary.postPostPostPostPostPostPostSuccessorRootChildCount}`,
    `- Q-avoiding classes outside closure: ${summary.postPostPostPostPostPostPostSuccessorQAvoidingClassCount}`,
    '',
    '## Assembly',
    '',
    packet.supportedClaim.claim,
    '',
    '## Next Move',
    '',
    packet.oneNextAction.action,
    '',
    '## Boundary',
    '',
    packet.proofBoundary,
    '',
  ];
  return `${lines.join('\n')}\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packet = buildPacket(options);
  const rendered = options.pretty ? JSON.stringify(packet, null, 2) : JSON.stringify(packet);

  if (options.jsonOutput) {
    fs.mkdirSync(path.dirname(options.jsonOutput), { recursive: true });
    fs.writeFileSync(options.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
  }
  if (options.markdownOutput) {
    fs.mkdirSync(path.dirname(options.markdownOutput), { recursive: true });
    fs.writeFileSync(options.markdownOutput, renderMarkdown(packet));
  }

  console.log(rendered);
}

main();
