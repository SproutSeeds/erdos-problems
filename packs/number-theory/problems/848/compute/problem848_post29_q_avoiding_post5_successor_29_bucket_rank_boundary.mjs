#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_COVER_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_29_BUCKET_BATCH_COVER_PACKET.json');
const DEFAULT_ASSEMBLY_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_29_BUCKET_CONVERGENCE_ASSEMBLY_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_RANK_BOUNDARY_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_RANK_BOUNDARY_PACKET.md');

const EXPECTED_PRIMES = [
  167, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241,
  251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 337,
  347,
];
const TARGET =
  'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_buckets_or_emit_rank_boundary';
const NEXT_ACTION =
  'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_rank_boundary';
const NEXT_COVER_ACTION =
  'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover_or_emit_boundary';
const NEXT_TOKEN =
  'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';

function parseArgs(argv) {
  const options = { coverPacket: DEFAULT_COVER_PACKET, assemblyPacket: DEFAULT_ASSEMBLY_PACKET, jsonOutput: null, markdownOutput: null, pretty: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--cover-packet') {
      options.coverPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--assembly-packet') {
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

function toBigInt(value, label) {
  try {
    return BigInt(String(value));
  } catch {
    throw new Error(`Invalid BigInt value for ${label}: ${value}`);
  }
}

function asString(value) {
  return value.toString();
}

function sumBigInt(rows, key) {
  return rows.reduce((sum, row) => sum + toBigInt(row[key] ?? 0, key), 0n);
}

function compareBigInt(actual, expected, message) {
  assertCondition(toBigInt(actual, message) === toBigInt(expected, message), message);
}

function addPreviousBucket(map, row, sourceKey, outputKey) {
  const prime = Number(row[sourceKey]);
  const current = map.get(prime) ?? {
    prime,
    outputKey,
    sourceRowCount: 0,
    sourcePostPostPostPostSuccessorQAvoidingClassCount: 0n,
  };
  current.sourceRowCount += 1;
  current.sourcePostPostPostPostSuccessorQAvoidingClassCount += toBigInt(
    row.sourcePostPostPostPostSuccessorQAvoidingClassCount,
    'sourcePostPostPostPostSuccessorQAvoidingClassCount',
  );
  map.set(prime, current);
}

function normalizePreviousBuckets(map) {
  return [...map.values()]
    .sort((left, right) => left.prime - right.prime)
    .map((bucket) => ({
      [bucket.outputKey]: bucket.prime,
      sourceRowCount: bucket.sourceRowCount,
      sourcePostPostPostPostSuccessorQAvoidingClassCount: asString(bucket.sourcePostPostPostPostSuccessorQAvoidingClassCount),
    }));
}

function validateRow(row) {
  const priorPrime = Number(row.postPostPostPostSuccessorObstructionPrime);
  const prime = Number(row.postPostPostPostPostSuccessorObstructionPrime);
  const square = prime * prime;
  const sourceCount = toBigInt(row.sourcePostPostPostPostSuccessorQAvoidingClassCount, 'sourcePostPostPostPostSuccessorQAvoidingClassCount');
  const rootCount = Number(row.postPostPostPostPostSuccessorRootResidueCount);

  assertCondition(Number.isInteger(priorPrime), 'missing post-post-post-post-successor obstruction prime');
  assertCondition(Number.isInteger(prime), 'missing post-post-post-post-post-successor obstruction prime');
  assertCondition(prime > priorPrime, `q${prime} does not advance past q${priorPrime}`);
  assertCondition(Number(row.postPostPostPostPostSuccessorObstructionSquare) === square, `square mismatch for q${prime}`);
  assertCondition(rootCount === 2, `expected exactly two post-post-post-post-post-successor roots for q${prime}`);
  assertCondition(Array.isArray(row.postPostPostPostPostSuccessorRootResidues) && row.postPostPostPostPostSuccessorRootResidues.length === 2, `root list mismatch for q${prime}`);
  assertCondition(
    toBigInt(row.postPostPostPostPostSuccessorRootChildCount, 'postPostPostPostPostSuccessorRootChildCount') === sourceCount * BigInt(rootCount),
    `root-child count mismatch for q${prime}`,
  );
  assertCondition(
    toBigInt(row.postPostPostPostPostSuccessorQAvoidingClassCount, 'postPostPostPostPostSuccessorQAvoidingClassCount') === sourceCount * (BigInt(square) - BigInt(rootCount)),
    `q-avoiding count mismatch for q${prime}`,
  );
}

function buildBuckets(rows, coverBuckets) {
  const coverBucketByPrime = new Map(coverBuckets.map((bucket) => [Number(bucket.postPostPostPostPostSuccessorObstructionPrime), bucket]));
  const groups = new Map();

  for (const row of rows) {
    validateRow(row);
    const prime = Number(row.postPostPostPostPostSuccessorObstructionPrime);
    const current = groups.get(prime) ?? {
      sourceRows: [],
      previousPostPostPostPostSuccessorPrimeBuckets: new Map(),
      previousPostPostPostSuccessorPrimeBuckets: new Map(),
      previousPostPostSuccessorPrimeBuckets: new Map(),
      previousPostSuccessorPrimeBuckets: new Map(),
      previousSuccessorPrimeBuckets: new Map(),
      previousPostNextPrimeBuckets: new Map(),
      previousNextPrimeBuckets: new Map(),
      previousLaterPrimeBuckets: new Map(),
    };
    current.sourceRows.push(row);
    addPreviousBucket(current.previousPostPostPostPostSuccessorPrimeBuckets, row, 'postPostPostPostSuccessorObstructionPrime', 'previousPostPostPostPostSuccessorObstructionPrime');
    addPreviousBucket(current.previousPostPostPostSuccessorPrimeBuckets, row, 'postPostPostSuccessorObstructionPrime', 'previousPostPostPostSuccessorObstructionPrime');
    addPreviousBucket(current.previousPostPostSuccessorPrimeBuckets, row, 'postPostSuccessorObstructionPrime', 'previousPostPostSuccessorObstructionPrime');
    addPreviousBucket(current.previousPostSuccessorPrimeBuckets, row, 'postSuccessorObstructionPrime', 'previousPostSuccessorObstructionPrime');
    addPreviousBucket(current.previousSuccessorPrimeBuckets, row, 'successorObstructionPrime', 'previousSuccessorObstructionPrime');
    addPreviousBucket(current.previousPostNextPrimeBuckets, row, 'postNextObstructionPrime', 'previousPostNextObstructionPrime');
    addPreviousBucket(current.previousNextPrimeBuckets, row, 'nextObstructionPrime', 'previousNextObstructionPrime');
    addPreviousBucket(current.previousLaterPrimeBuckets, row, 'laterObstructionPrime', 'previousLaterObstructionPrime');
    groups.set(prime, current);
  }

  return [...groups.entries()].sort((left, right) => left[0] - right[0]).map(([prime, group]) => {
    const rowsInBucket = group.sourceRows;
    const sourceRowCount = rowsInBucket.length;
    const sourceCount = sumBigInt(rowsInBucket, 'sourcePostPostPostPostSuccessorQAvoidingClassCount');
    const rootChildCount = sumBigInt(rowsInBucket, 'postPostPostPostPostSuccessorRootChildCount');
    const qAvoidingCount = sumBigInt(rowsInBucket, 'postPostPostPostPostSuccessorQAvoidingClassCount');
    const coverBucket = coverBucketByPrime.get(prime);

    assertCondition(Boolean(coverBucket), `missing post-post-post-post-post-successor cover bucket q${prime}`);
    assertCondition(coverBucket.sourceRowCount === sourceRowCount, `source row count mismatch for q${prime}`);
    compareBigInt(sourceCount, coverBucket.sourcePostPostPostPostSuccessorQAvoidingClassCount, `source count mismatch for q${prime}`);
    compareBigInt(rootChildCount, coverBucket.postPostPostPostPostSuccessorRootChildCount, `root-child count mismatch for q${prime}`);
    compareBigInt(qAvoidingCount, coverBucket.postPostPostPostPostSuccessorQAvoidingClassCount, `q-avoiding count mismatch for q${prime}`);

    return {
      tokenId: `p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_q${prime}_rank_boundary`,
      postPostPostPostPostSuccessorObstructionPrime: prime,
      postPostPostPostPostSuccessorObstructionSquare: prime * prime,
      sourceRowCount,
      sourcePostPostPostPostSuccessorQAvoidingClassCount: asString(sourceCount),
      rootResidueCountsPerClass: [2],
      postPostPostPostPostSuccessorRootChildCount: asString(rootChildCount),
      postPostPostPostPostSuccessorQAvoidingClassCount: asString(qAvoidingCount),
      previousPostPostPostPostSuccessorPrimeBuckets: normalizePreviousBuckets(group.previousPostPostPostPostSuccessorPrimeBuckets),
      previousPostPostPostSuccessorPrimeBuckets: normalizePreviousBuckets(group.previousPostPostPostSuccessorPrimeBuckets),
      previousPostPostSuccessorPrimeBuckets: normalizePreviousBuckets(group.previousPostPostSuccessorPrimeBuckets),
      previousPostSuccessorPrimeBuckets: normalizePreviousBuckets(group.previousPostSuccessorPrimeBuckets),
      previousSuccessorPrimeBuckets: normalizePreviousBuckets(group.previousSuccessorPrimeBuckets),
      previousPostNextPrimeBuckets: normalizePreviousBuckets(group.previousPostNextPrimeBuckets),
      previousNextPrimeBuckets: normalizePreviousBuckets(group.previousNextPrimeBuckets),
      previousLaterPrimeBuckets: normalizePreviousBuckets(group.previousLaterPrimeBuckets),
      status: 'open_exact_two_root_post_post_post_post_post_successor_rank_boundary',
      proofObligation: 'Cover this bucket only as part of a whole 29-bucket post-post-post-post-post-successor assembly/batch/rank action, or emit a sharper exact subboundary. This token does not authorize singleton q-child descent by itself.',
    };
  });
}

function supportDiversity(buckets, key) {
  const sizes = buckets.map((bucket) => bucket[key]?.length ?? 0);
  return {
    min: Math.min(...sizes),
    max: Math.max(...sizes),
    distinctSizes: [...new Set(sizes)].sort((left, right) => left - right),
  };
}

function buildPacket(options) {
  const cover = readJson(options.coverPacket);
  const assembly = readJson(options.assemblyPacket);
  const rows = cover.rowClassifications ?? [];
  const coverBuckets = cover.postPostPostPostPostSuccessorObstructionPrimeBuckets ?? [];

  assertCondition(cover.status === 'all_29_bucket_post_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child', 'cover packet status mismatch');
  assertCondition(assembly.status === 'post_29_q_avoiding_29_bucket_convergence_assembly_selects_29_bucket_post_post_post_post_post_successor_rank_compression', 'assembly packet status mismatch');
  assertCondition(assembly.recommendedNextAction === TARGET, 'assembly selected action mismatch');
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 source row classifications');
  assertCondition(Array.isArray(coverBuckets) && coverBuckets.length === 29, 'expected 29 post-post-post-post-post-successor cover buckets');

  const buckets = buildBuckets(rows, coverBuckets);
  const primes = buckets.map((bucket) => bucket.postPostPostPostPostSuccessorObstructionPrime);
  const sourceRowCount = buckets.reduce((sum, bucket) => sum + bucket.sourceRowCount, 0);
  const sourceCount = sumBigInt(buckets, 'sourcePostPostPostPostSuccessorQAvoidingClassCount');
  const rootChildCount = sumBigInt(buckets, 'postPostPostPostPostSuccessorRootChildCount');
  const qAvoidingCount = sumBigInt(buckets, 'postPostPostPostPostSuccessorQAvoidingClassCount');

  assertCondition(primes.join(',') === EXPECTED_PRIMES.join(','), 'unexpected post-post-post-post-post-successor prime bucket set');
  assertCondition(sourceRowCount === cover.batchCoverSummary?.sourceRowCount, 'total source row count mismatch');
  compareBigInt(sourceCount, cover.batchCoverSummary?.sourcePostPostPostPostSuccessorQAvoidingClassCount, 'total source q-avoiding count mismatch');
  compareBigInt(rootChildCount, cover.batchCoverSummary?.totalPostPostPostPostPostSuccessorRootChildCount, 'total root-child count mismatch');
  compareBigInt(qAvoidingCount, cover.batchCoverSummary?.totalPostPostPostPostPostSuccessorQAvoidingClassCount, 'total q-avoiding count mismatch');
  compareBigInt(cover.batchCoverSummary?.survivorPostPostPostPostSuccessorQAvoidingClassCount, 0n, 'source cover has survivors');

  const consumedFiniteToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_rank_boundary',
    bucketCount: 29,
    postPostPostPostPostSuccessorRootChildCount: asString(rootChildCount),
    postPostPostPostPostSuccessorQAvoidingClassCount: asString(qAvoidingCount),
    status: 'selected_for_compression_structural_decomposition_impossibility_or_exact_rank_boundary',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_rank_boundary/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_deterministic_rank_boundary_emitted',
    target: TARGET,
    sourceAudit: {
      post29QAvoiding29BucketBatchCoverPacket: {
        path: path.relative(repoRoot, options.coverPacket),
        sha256: sha256File(options.coverPacket),
        status: cover.status,
      },
      post29QAvoiding29BucketConvergenceAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    boundarySummary: {
      sourcePostPostPostPostSuccessorBucketCount: cover.batchCoverSummary.sourcePostPostPostPostSuccessorBucketCount,
      sourceRowCount,
      sourcePostPostPostPostSuccessorQAvoidingClassCount: asString(sourceCount),
      postPostPostPostPostSuccessorObstructionPrimeBucketCount: buckets.length,
      postPostPostPostPostSuccessorObstructionPrimes: primes,
      minPostPostPostPostPostSuccessorObstructionPrime: primes[0],
      maxPostPostPostPostPostSuccessorObstructionPrime: primes.at(-1),
      rootResidueCountsPerClass: [2],
      totalPostPostPostPostPostSuccessorRootChildCount: asString(rootChildCount),
      totalPostPostPostPostPostSuccessorQAvoidingClassCount: asString(qAvoidingCount),
      survivorSourceRowCount: cover.batchCoverSummary.survivorSourceRowCount,
      survivorPostPostPostPostSuccessorQAvoidingClassCount: cover.batchCoverSummary.survivorPostPostPostPostSuccessorQAvoidingClassCount,
    },
    deterministicRankBoundary: {
      consumedFiniteToken: consumedFiniteToken.tokenId,
      producedFiniteTokenCount: buckets.length,
      producedFiniteTokens: buckets,
      measureStatus: 'finite_rank_token_partitioned_not_decreased',
      exactPartition: `The single 29-bucket post-post-post-post-post-successor rank token is partitioned by q in {${primes.join(',')}}.`,
    },
    compressionAudit: {
      verdict: 'exact_boundary_packet_is_the_honest_current_compression',
      sharedInvariant: 'Every stored row in the 29-bucket post-post-post-post-post-successor boundary has exactly two roots at its first post-post-post-post-post-successor obstruction prime.',
      supportDiversity: {
        previousPostPostPostPostSuccessorPrimeBuckets: supportDiversity(buckets, 'previousPostPostPostPostSuccessorPrimeBuckets'),
        previousPostPostPostSuccessorPrimeBuckets: supportDiversity(buckets, 'previousPostPostPostSuccessorPrimeBuckets'),
        previousPostPostSuccessorPrimeBuckets: supportDiversity(buckets, 'previousPostPostSuccessorPrimeBuckets'),
        previousPostSuccessorPrimeBuckets: supportDiversity(buckets, 'previousPostSuccessorPrimeBuckets'),
        previousSuccessorPrimeBuckets: supportDiversity(buckets, 'previousSuccessorPrimeBuckets'),
        previousPostNextPrimeBuckets: supportDiversity(buckets, 'previousPostNextPrimeBuckets'),
        previousNextPrimeBuckets: supportDiversity(buckets, 'previousNextPrimeBuckets'),
        previousLaterPrimeBuckets: supportDiversity(buckets, 'previousLaterPrimeBuckets'),
      },
      nonTerminalReason: 'The shared two-root law emits rank children and a still larger q-avoiding boundary; it does not prove terminal closure of those children.',
      noStrongerUniformTheoremThisTurn: 'The buckets mix previous post-post-post-post, post-post-post, post-post, post, successor, post-next, next-prime, and later-prime supports unevenly, so this packet records the exact finite partition and hands off convergence assembly instead of claiming one closed terminal family.',
    },
    finiteTokenTransition: {
      consumedFiniteToken: {
        ...consumedFiniteToken,
        status: 'consumed_by_deterministic_29_bucket_post_post_post_post_post_successor_rank_boundary',
      },
      emittedRankBoundaryTokenCount: buckets.length,
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_root_children',
          postPostPostPostPostSuccessorObstructionPrimeBucketCount: buckets.length,
          rootChildCount: asString(rootChildCount),
          status: 'root_children_open_not_descended',
        },
        {
          tokenId: NEXT_TOKEN,
          postPostPostPostPostSuccessorObstructionPrimeBucketCount: buckets.length,
          qAvoidingClassCount: asString(qAvoidingCount),
          status: 'selected_for_whole_boundary_convergence_assembly_then_batch_cover',
        },
      ],
      nextFiniteToken: {
        tokenId: NEXT_TOKEN,
        bucketCount: buckets.length,
        qAvoidingClassCount: asString(qAvoidingCount),
        status: 'selected_after_rank_boundary_convergence_assembly',
      },
    },
    postPostPostPostPostSuccessorPrimeBuckets: buckets,
    proofBoundary: 'This packet accounts for every post-post-post-post-post-successor bucket emitted by the 29-bucket post-post-post-post-successor q-avoiding batch cover and turns the 29-bucket surface into an exact deterministic ranked boundary. It does not close the 2,512,250,316,424,856,520,324,763,420,060,780,249,365,822,480,690 post-post-post-post-post-successor root children, the 104,979,512,685,900,231,199,199,420,715,793,219,898,475,067,029,855,159 post-post-post-post-post-successor q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Run convergence assembly after the deterministic 29-bucket post-post-post-post-post-successor rank boundary, name the whole q-avoiding cover token, and block q167/q179 singleton descent before another repeated q-cover step.',
      coveredFamily: `All ${asString(qAvoidingCount)} post-post-post-post-post-successor q-avoiding classes across q in {${primes.join(',')}}.`,
      finiteDenominatorOrRankToken: `Finite token ${NEXT_TOKEN}.`,
      failureBoundary: 'If no whole-boundary cover exists after assembly, write the deterministic survivor boundary grouped by post-post-post-post-post-successor prime and previous support; do not open a singleton q-child first.',
      completionRule: 'Assembly consumes the 29-bucket post-post-post-post-post-successor rank-boundary token, names the whole q-avoiding cover, and records one non-singleton next action.',
    },
    recommendedNextAction: NEXT_ACTION,
    nextQCoverActionAfterAssembly: NEXT_COVER_ACTION,
    nextTheoremMove: 'Use the deterministic 29-bucket post-post-post-post-post-successor rank boundary to run convergence assembly before any whole-boundary q-avoiding batch cover; singleton q167/q179/etc. descent remains blocked until a later packet consumes a smaller finite token.',
    claims: {
      consumesPost29QAvoidingConvergenceAssemblyRankToken: true,
      accountsForAll29PostPostPostPostPostSuccessorBuckets: true,
      allRowsHaveTwoPostPostPostPostPostSuccessorRoots: true,
      emitsExactDeterministic29BucketPostPostPostPostPostSuccessorRankBoundary: true,
      selectsConvergenceAssemblyBeforeWholeBoundaryBatchCover: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ167Singleton: false,
      descendsIntoQ179Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostPostPostPostPostSuccessorRootChildrenClosed: false,
      provesPostPostPostPostPostSuccessorQAvoidingBoundaryClosed: false,
      provesP479AvailableFamilyCoverage: false,
      provesP479UnavailableComplementClosed: false,
      provesQ97ChildCoverage: false,
      provesP443UnavailableComplementClosed: false,
      provesP4217ComplementCoverage: false,
      provesAllN: false,
    },
  };
}

function renderMarkdown(packet) {
  const lines = [
    '# P848 P4217 post-post-post-post-post-successor 29-bucket rank boundary',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Source post-post-post-post-successor buckets: ${packet.boundarySummary.sourcePostPostPostPostSuccessorBucketCount}`,
    `- Source rows accounted: ${packet.boundarySummary.sourceRowCount}`,
    `- Source post-post-post-post-successor q-avoiding classes accounted: ${packet.boundarySummary.sourcePostPostPostPostSuccessorQAvoidingClassCount}`,
    `- Post-post-post-post-post-successor buckets: ${packet.boundarySummary.postPostPostPostPostSuccessorObstructionPrimeBucketCount}`,
    `- Post-post-post-post-post-successor primes: ${packet.boundarySummary.postPostPostPostPostSuccessorObstructionPrimes.join(', ')}`,
    `- Post-post-post-post-post-successor root children emitted: ${packet.boundarySummary.totalPostPostPostPostPostSuccessorRootChildCount}`,
    `- Post-post-post-post-post-successor q-avoiding classes emitted: ${packet.boundarySummary.totalPostPostPostPostPostSuccessorQAvoidingClassCount}`,
    `- Survivor source rows: ${packet.boundarySummary.survivorSourceRowCount}`,
    `- Survivor post-post-post-post-successor q-avoiding classes: ${packet.boundarySummary.survivorPostPostPostPostSuccessorQAvoidingClassCount}`,
    '',
    '## Boundary Buckets',
    '',
  ];
  for (const bucket of packet.postPostPostPostPostSuccessorPrimeBuckets) {
    lines.push(`- q${bucket.postPostPostPostPostSuccessorObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourcePostPostPostPostSuccessorQAvoidingClassCount} source post-post-post-post-successor q-avoiding classes, ${bucket.postPostPostPostPostSuccessorRootChildCount} post-post-post-post-post-successor root children, ${bucket.postPostPostPostPostSuccessorQAvoidingClassCount} post-post-post-post-post-successor q-avoiding classes.`);
  }
  lines.push('', '## Compression Audit', '', packet.compressionAudit.sharedInvariant, packet.compressionAudit.nonTerminalReason, packet.compressionAudit.noStrongerUniformTheoremThisTurn, '', '## Boundary', '', packet.proofBoundary, '', '## Next Move', '', packet.oneNextAction.action, '');
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
