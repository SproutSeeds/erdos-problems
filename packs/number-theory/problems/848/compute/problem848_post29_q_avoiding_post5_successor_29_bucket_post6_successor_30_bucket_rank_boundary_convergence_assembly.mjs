#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_RANK_BOUNDARY_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_RANK_BOUNDARY_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.md');

const TARGET = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary';
const NEXT_ACTION = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover_or_emit_boundary';
const RANK_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary';
const NEXT_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover';

function parseArgs(argv) {
  const options = {
    rankBoundaryPacket: DEFAULT_RANK_BOUNDARY_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--rank-boundary-packet') {
      options.rankBoundaryPacket = path.resolve(argv[index + 1]);
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
  const rankBoundary = readJson(options.rankBoundaryPacket);
  const summary = rankBoundary.boundarySummary ?? {};
  const primes = summary.postPostPostPostPostPostSuccessorObstructionPrimes ?? [];
  const qAvoidingClassCount = summary.totalPostPostPostPostPostPostSuccessorQAvoidingClassCount;
  const rootChildCount = summary.totalPostPostPostPostPostPostSuccessorRootChildCount;

  assertCondition(rankBoundary.recommendedNextAction === TARGET, 'rank boundary does not select this convergence assembly');
  assertCondition(rankBoundary.nextQCoverActionAfterAssembly === NEXT_ACTION, 'rank boundary q-cover successor mismatch');
  assertCondition(rankBoundary.claims?.accountsForAll30PostPostPostPostPostPostSuccessorBuckets === true, 'rank boundary does not account for all 30 buckets');
  assertCondition(rankBoundary.claims?.allRowsHaveTwoPostPostPostPostPostPostSuccessorRoots === true, 'rank boundary missing two-root invariant');
  assertCondition(primes.length === 30, 'expected 30 post-post-post-post-post-post-successor primes');
  assertCondition(rankBoundary.finiteTokenTransition?.nextFiniteToken?.tokenId === NEXT_TOKEN, 'rank boundary next finite token mismatch');

  return {
    schema: 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary_convergence_assembly_packet/1',
    packetId: 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: 'post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary_convergence_assembly_selects_30_bucket_q_avoiding_cover',
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'covered_by_this_assembly_packet',
    },
    sourcePackets: [
      path.relative(repoRoot, options.rankBoundaryPacket),
    ],
    sourcePacketDigests: {
      postPostPostPostPostPostSuccessor30BucketRankBoundarySha256: sha256File(options.rankBoundaryPacket),
    },
    frontierComparison: {
      previousRefreshValueBeforePostPostPostPostPostPostSuccessorRankBoundary: 77,
      currentRefreshValueAfterPostPostPostPostPostPostSuccessorRankBoundary: 77,
      delta: 0,
      interpretation: 'The deterministic 30-bucket rank boundary consumed the rank/compression token and selected the whole 30-bucket q-avoiding cover. This is a handoff, not global convergence; q179/q181 singleton descent remains blocked.',
    },
    assembledPieces: [
      {
        id: 'post_post_post_post_post_successor_29_bucket_q_cover_closed',
        claim: 'The previous whole 29-bucket post-post-post-post-post-successor q-avoiding cover had zero survivors and emitted the q179..q353 surface.',
      },
      {
        id: 'post_post_post_post_post_post_successor_30_bucket_rank_boundary_emitted',
        claim: `The deterministic rank boundary accounts for all 30 post-post-post-post-post-post-successor buckets q in {${primes.join(',')}} and ${rootChildCount} root children.`,
      },
      {
        id: 'post_post_post_post_post_post_successor_q_avoiding_cover_named',
        claim: `The next finite token is the whole ${qAvoidingClassCount}-class q-avoiding cover over q179..q353.`,
      },
      {
        id: 'singleton_descent_blocked',
        claim: 'No q179, q181, or other singleton q-child descent is allowed before the whole 30-bucket q-avoiding cover, structural theorem, impossibility theorem, or exact survivor boundary is attempted.',
      },
    ],
    supportedClaim: {
      claim: 'The exact 30-bucket post-post-post-post-post-post-successor rank boundary is assembled into one whole q-avoiding batch-cover obligation over q179..q353.',
      proofBoundary: `This assembly selects the next finite token. It does not close the ${rootChildCount} root children, the ${qAvoidingClassCount} q-avoiding classes, the p479 branches, q97, p443-unavailable, the p4217 complement, collision-free matching, or Problem 848.`,
    },
    finiteMeasureOrNoMeasureYet: {
      globalFiniteMeasureDecreased: false,
      consumedDecisionToken: {
        tokenId: RANK_TOKEN,
        sourceAction: TARGET,
        status: 'consumed_by_convergence_assembly',
      },
      closedSourceToken: {
        ...rankBoundary.finiteTokenTransition?.consumedFiniteToken,
        tokenId: RANK_TOKEN,
        bucketCount: summary.postPostPostPostPostPostSuccessorObstructionPrimeBucketCount,
        postPostPostPostPostPostSuccessorRootChildCount: rootChildCount,
        postPostPostPostPostPostSuccessorQAvoidingClassCount: qAvoidingClassCount,
        status: 'rank_boundary_consumed_by_30_bucket_q_avoiding_convergence_assembly',
      },
      nextFiniteToken: {
        tokenId: NEXT_TOKEN,
        bucketCount: summary.postPostPostPostPostPostSuccessorObstructionPrimeBucketCount,
        sourceRowCount: summary.sourceRowCount,
        sourcePostPostPostPostPostSuccessorQAvoidingClassCount: summary.sourcePostPostPostPostPostSuccessorQAvoidingClassCount,
        postPostPostPostPostPostSuccessorRootChildCount: rootChildCount,
        postPostPostPostPostPostSuccessorQAvoidingClassCount: qAvoidingClassCount,
        status: 'selected_for_whole_boundary_q_avoiding_batch_cover',
      },
    },
    postPostPostPostPostPostSuccessorQAvoidingCoverSummary: {
      bucketCount: summary.postPostPostPostPostPostSuccessorObstructionPrimeBucketCount,
      postPostPostPostPostPostSuccessorPrimes: primes,
      sourcePostPostPostPostPostSuccessorBucketCount: summary.sourcePostPostPostPostPostSuccessorBucketCount,
      sourceRowCount: summary.sourceRowCount,
      sourcePostPostPostPostPostSuccessorQAvoidingClassCount: summary.sourcePostPostPostPostPostSuccessorQAvoidingClassCount,
      rootResidueCountsPerClass: summary.rootResidueCountsPerClass,
      postPostPostPostPostPostSuccessorRootChildCount: rootChildCount,
      postPostPostPostPostPostSuccessorQAvoidingClassCount: qAvoidingClassCount,
    },
    compressionCandidate: {
      statement: 'The row-uniform two-root law remains a candidate for a successor-layer theorem, but the immediate durable move is the whole 30-bucket q-avoiding cover selected by the rank boundary.',
      missingForUse: 'A theorem that closes or structurally decomposes every q-avoiding class across q179..q353, or an exact survivor boundary if the batch cover does not close.',
    },
    remainingPuzzleBoundary: {
      openBoundary: `The whole q179..q353 q-avoiding surface of ${qAvoidingClassCount} classes remains outside the proof, along with the root children, p479 branches, q97, p443-unavailable, p4217 complement, collision-free matching, and Problem 848.`,
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Run the whole 30-bucket post-post-post-post-post-post-successor q-avoiding batch cover over q179..q353, or emit a structural decomposition, impossibility theorem, or exact survivor/rank boundary for the entire token.',
      coveredFamily: `All ${commas(qAvoidingClassCount)} post-post-post-post-post-post-successor q-avoiding classes across q in {${primes.join(',')}}.`,
      finiteDenominatorOrRankToken: NEXT_TOKEN,
      failureBoundary: 'If the batch cover does not close, emit a deterministic whole-boundary survivor/rank packet; do not open q179, q181, or any singleton q-child first.',
      whyCheaperThanSingleSelector: 'The rank packet already accounts for every q179..q353 bucket and names the exact q-avoiding denominator, so a batch cover consumes one finite token while singleton descent would fragment it.',
      completionRule: 'Either all 30-bucket q-avoiding classes are covered, or a structural/impossibility/survivor boundary accounts for the whole token.',
      command: null,
    },
    oneVerificationCommand: 'node --check packs/number-theory/problems/848/compute/problem848_post29_q_avoiding_post5_successor_29_bucket_post6_successor_30_bucket_rank_boundary_convergence_assembly.mjs && node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js',
    nextTheoremMove: 'Run the whole 30-bucket q-avoiding cover over q179..q353 before any q179/q181 singleton descent.',
    proofBoundary: `This convergence assembly consumes the deterministic 30-bucket rank boundary and selects the whole q-avoiding batch cover. It does not close the ${rootChildCount} root children, the ${qAvoidingClassCount} q-avoiding classes, the p479 branches, q97, p443-unavailable, the p4217 complement, collision-free matching, or Problem 848.`,
    claims: {
      runsPostPostPostPostPostPostSuccessor30BucketRankBoundaryConvergenceAssembly: true,
      consumesPostPostPostPostPostPostSuccessor30BucketRankBoundaryDecisionToken: true,
      selects30BucketPostPostPostPostPostPostSuccessorQAvoidingCoverInsteadOfSingletonDescent: true,
      accountsForAll30PostPostPostPostPostPostSuccessorBuckets: true,
      namesWholeCoveredFamily: true,
      namesFiniteQCoverToken: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ179Singleton: false,
      descendsIntoQ181Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostPostPostPostPostPostSuccessorQAvoidingBoundaryClosed: false,
      provesP4217ComplementCoverage: false,
      provesAllN: false,
    },
  };
}

function renderMarkdown(packet) {
  const lines = [
    '# P848 P4217 post-post-post-post-post-post-successor 30-bucket rank-boundary convergence assembly',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Buckets assembled: ${packet.postPostPostPostPostPostSuccessorQAvoidingCoverSummary.bucketCount}`,
    `- Primes: ${packet.postPostPostPostPostPostSuccessorQAvoidingCoverSummary.postPostPostPostPostPostSuccessorPrimes.join(', ')}`,
    `- Root children outside closure: ${packet.postPostPostPostPostPostSuccessorQAvoidingCoverSummary.postPostPostPostPostPostSuccessorRootChildCount}`,
    `- Q-avoiding classes selected for cover: ${packet.postPostPostPostPostPostSuccessorQAvoidingCoverSummary.postPostPostPostPostPostSuccessorQAvoidingClassCount}`,
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
