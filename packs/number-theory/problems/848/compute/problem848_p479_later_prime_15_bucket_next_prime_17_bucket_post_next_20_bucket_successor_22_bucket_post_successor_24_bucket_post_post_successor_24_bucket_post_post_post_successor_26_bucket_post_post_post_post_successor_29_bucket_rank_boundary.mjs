#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');

const FRONTIER_BRIDGE = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'SPLIT_ATOM_PACKETS',
  'FRONTIER_BRIDGE',
);

const DEFAULT_COVER_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_POST_POST_POST_SUCCESSOR_26_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_POST_POST_POST_SUCCESSOR_26_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_26_Q_AVOIDING_29_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_26_Q_AVOIDING_29_BUCKET_RANK_BOUNDARY_PACKET.md',
);

const EXPECTED_PRIMES = [
  163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
  239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313,
  331,
];
const TARGET =
  'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_buckets_or_emit_rank_boundary';
const NEXT_ACTION =
  'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_rank_boundary';
const NEXT_COVER_ACTION =
  'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover_or_emit_boundary';
const NEXT_TOKEN =
  'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';

function parseArgs(argv) {
  const options = {
    coverPacket: DEFAULT_COVER_PACKET,
    assemblyPacket: DEFAULT_ASSEMBLY_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

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

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
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
    [outputKey]: prime,
    sourceRowCount: 0,
    sourcePostPostPostSuccessorQAvoidingClassCount: 0n,
  };
  current.sourceRowCount += 1;
  current.sourcePostPostPostSuccessorQAvoidingClassCount += toBigInt(
    row.sourcePostPostPostSuccessorQAvoidingClassCount,
    'sourcePostPostPostSuccessorQAvoidingClassCount',
  );
  map.set(prime, current);
}

function normalizePreviousBuckets(map) {
  return [...map.values()]
    .sort((left, right) => Object.values(left)[0] - Object.values(right)[0])
    .map((bucket) => ({
      ...bucket,
      sourcePostPostPostSuccessorQAvoidingClassCount: asString(
        bucket.sourcePostPostPostSuccessorQAvoidingClassCount,
      ),
    }));
}

function validateRow(row) {
  const priorPrime = Number(row.postPostPostSuccessorObstructionPrime);
  const prime = Number(row.postPostPostPostSuccessorObstructionPrime);
  const square = prime * prime;
  const sourceCount = toBigInt(
    row.sourcePostPostPostSuccessorQAvoidingClassCount,
    'sourcePostPostPostSuccessorQAvoidingClassCount',
  );
  const rootCount = Number(row.postPostPostPostSuccessorRootResidueCount);

  assertCondition(Number.isInteger(priorPrime), 'missing post-post-post-successor obstruction prime');
  assertCondition(Number.isInteger(prime), 'missing post-post-post-post-successor obstruction prime');
  assertCondition(prime > priorPrime, `q${prime} does not advance past q${priorPrime}`);
  assertCondition(Number(row.postPostPostPostSuccessorObstructionSquare) === square, `square mismatch for q${prime}`);
  assertCondition(rootCount === 2, `expected exactly two post-post-post-post-successor roots for q${prime}`);
  assertCondition(
    Array.isArray(row.postPostPostPostSuccessorRootResidues)
      && row.postPostPostPostSuccessorRootResidues.length === 2,
    `root list mismatch for q${prime}`,
  );
  assertCondition(
    toBigInt(row.postPostPostPostSuccessorRootChildCount, 'postPostPostPostSuccessorRootChildCount')
      === sourceCount * BigInt(rootCount),
    `root-child count mismatch for q${prime}`,
  );
  assertCondition(
    toBigInt(row.postPostPostPostSuccessorQAvoidingClassCount, 'postPostPostPostSuccessorQAvoidingClassCount')
      === sourceCount * (BigInt(square) - BigInt(rootCount)),
    `q-avoiding count mismatch for q${prime}`,
  );
}

function buildBuckets(rows, coverBuckets) {
  const coverBucketByPrime = new Map(
    coverBuckets.map((bucket) => [Number(bucket.postPostPostPostSuccessorObstructionPrime), bucket]),
  );
  const groups = new Map();

  for (const row of rows) {
    validateRow(row);
    const prime = Number(row.postPostPostPostSuccessorObstructionPrime);
    const current = groups.get(prime) ?? {
      sourceRows: [],
      previousPostPostPostSuccessorPrimeBuckets: new Map(),
      previousPostPostSuccessorPrimeBuckets: new Map(),
      previousPostSuccessorPrimeBuckets: new Map(),
      previousSuccessorPrimeBuckets: new Map(),
      previousPostNextPrimeBuckets: new Map(),
      previousNextPrimeBuckets: new Map(),
      previousLaterPrimeBuckets: new Map(),
    };
    current.sourceRows.push(row);
    addPreviousBucket(current.previousPostPostPostSuccessorPrimeBuckets, row, 'postPostPostSuccessorObstructionPrime', 'previousPostPostPostSuccessorObstructionPrime');
    addPreviousBucket(current.previousPostPostSuccessorPrimeBuckets, row, 'postPostSuccessorObstructionPrime', 'previousPostPostSuccessorObstructionPrime');
    addPreviousBucket(current.previousPostSuccessorPrimeBuckets, row, 'postSuccessorObstructionPrime', 'previousPostSuccessorObstructionPrime');
    addPreviousBucket(current.previousSuccessorPrimeBuckets, row, 'successorObstructionPrime', 'previousSuccessorObstructionPrime');
    addPreviousBucket(current.previousPostNextPrimeBuckets, row, 'postNextObstructionPrime', 'previousPostNextObstructionPrime');
    addPreviousBucket(current.previousNextPrimeBuckets, row, 'nextObstructionPrime', 'previousNextObstructionPrime');
    addPreviousBucket(current.previousLaterPrimeBuckets, row, 'laterObstructionPrime', 'previousLaterObstructionPrime');
    groups.set(prime, current);
  }

  return [...groups.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([prime, group]) => {
      const rowsInBucket = group.sourceRows;
      const sourceRowCount = rowsInBucket.length;
      const sourceCount = sumBigInt(rowsInBucket, 'sourcePostPostPostSuccessorQAvoidingClassCount');
      const rootChildCount = sumBigInt(rowsInBucket, 'postPostPostPostSuccessorRootChildCount');
      const qAvoidingCount = sumBigInt(rowsInBucket, 'postPostPostPostSuccessorQAvoidingClassCount');
      const coverBucket = coverBucketByPrime.get(prime);

      assertCondition(Boolean(coverBucket), `missing post-post-post-post-successor cover bucket q${prime}`);
      assertCondition(coverBucket.sourceRowCount === sourceRowCount, `source row count mismatch for q${prime}`);
      compareBigInt(sourceCount, coverBucket.sourcePostPostPostSuccessorQAvoidingClassCount, `source count mismatch for q${prime}`);
      compareBigInt(rootChildCount, coverBucket.postPostPostPostSuccessorRootChildCount, `root-child count mismatch for q${prime}`);
      compareBigInt(qAvoidingCount, coverBucket.postPostPostPostSuccessorQAvoidingClassCount, `q-avoiding count mismatch for q${prime}`);

      return {
        tokenId: `p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_q${prime}_rank_boundary`,
        postPostPostPostSuccessorObstructionPrime: prime,
        postPostPostPostSuccessorObstructionSquare: prime * prime,
        sourceRowCount,
        sourcePostPostPostSuccessorQAvoidingClassCount: asString(sourceCount),
        rootResidueCountsPerClass: [2],
        postPostPostPostSuccessorRootChildCount: asString(rootChildCount),
        postPostPostPostSuccessorQAvoidingClassCount: asString(qAvoidingCount),
        previousPostPostPostSuccessorPrimeBuckets: normalizePreviousBuckets(group.previousPostPostPostSuccessorPrimeBuckets),
        previousPostPostSuccessorPrimeBuckets: normalizePreviousBuckets(group.previousPostPostSuccessorPrimeBuckets),
        previousPostSuccessorPrimeBuckets: normalizePreviousBuckets(group.previousPostSuccessorPrimeBuckets),
        previousSuccessorPrimeBuckets: normalizePreviousBuckets(group.previousSuccessorPrimeBuckets),
        previousPostNextPrimeBuckets: normalizePreviousBuckets(group.previousPostNextPrimeBuckets),
        previousNextPrimeBuckets: normalizePreviousBuckets(group.previousNextPrimeBuckets),
        previousLaterPrimeBuckets: normalizePreviousBuckets(group.previousLaterPrimeBuckets),
        status: 'open_exact_two_root_post_post_post_post_successor_rank_boundary',
        proofObligation: 'Cover this bucket only as part of a whole 29-bucket post-post-post-post-successor assembly/batch/rank action, or emit a sharper exact subboundary. This token does not authorize singleton q-child descent by itself.',
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
  const coverBuckets = cover.postPostPostPostSuccessorObstructionPrimeBuckets ?? [];

  assertCondition(cover.status === 'all_26_bucket_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child', 'cover packet status mismatch');
  assertCondition(
    assembly.status === 'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover_convergence_assembly_selects_29_bucket_post_post_post_post_successor_rank_compression',
    'assembly packet status mismatch',
  );
  assertCondition(assembly.recommendedNextAction === TARGET, 'assembly selected action mismatch');
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 source row classifications');
  assertCondition(Array.isArray(coverBuckets) && coverBuckets.length === 29, 'expected 29 post-post-post-post-successor cover buckets');

  const buckets = buildBuckets(rows, coverBuckets);
  const primes = buckets.map((bucket) => bucket.postPostPostPostSuccessorObstructionPrime);
  const sourceRowCount = buckets.reduce((sum, bucket) => sum + bucket.sourceRowCount, 0);
  const sourceCount = sumBigInt(buckets, 'sourcePostPostPostSuccessorQAvoidingClassCount');
  const rootChildCount = sumBigInt(buckets, 'postPostPostPostSuccessorRootChildCount');
  const qAvoidingCount = sumBigInt(buckets, 'postPostPostPostSuccessorQAvoidingClassCount');

  assertCondition(primes.join(',') === EXPECTED_PRIMES.join(','), 'unexpected post-post-post-post-successor prime bucket set');
  assertCondition(sourceRowCount === cover.batchCoverSummary?.sourceRowCount, 'total source row count mismatch');
  compareBigInt(sourceCount, cover.batchCoverSummary?.sourcePostPostPostSuccessorQAvoidingClassCount, 'total source q-avoiding count mismatch');
  compareBigInt(rootChildCount, cover.batchCoverSummary?.totalPostPostPostPostSuccessorRootChildCount, 'total root-child count mismatch');
  compareBigInt(qAvoidingCount, cover.batchCoverSummary?.totalPostPostPostPostSuccessorQAvoidingClassCount, 'total q-avoiding count mismatch');
  compareBigInt(cover.batchCoverSummary?.survivorPostPostPostSuccessorQAvoidingClassCount, 0n, 'source cover has survivors');

  const consumedFiniteToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_rank_boundary',
    bucketCount: 29,
    postPostPostPostSuccessorRootChildCount: asString(rootChildCount),
    postPostPostPostSuccessorQAvoidingClassCount: asString(qAvoidingCount),
    status: 'selected_for_compression_structural_decomposition_impossibility_or_exact_rank_boundary',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_rank_boundary/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_deterministic_rank_boundary_emitted',
    target: TARGET,
    sourceAudit: {
      postPostPostSuccessor26BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.coverPacket),
        sha256: sha256File(options.coverPacket),
        status: cover.status,
      },
      postPostPostSuccessor26BucketQAvoidingBatchCoverConvergenceAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    boundarySummary: {
      sourcePostPostPostSuccessorBucketCount: cover.batchCoverSummary.sourcePostPostPostSuccessorBucketCount,
      sourceRowCount,
      sourcePostPostPostSuccessorQAvoidingClassCount: asString(sourceCount),
      postPostPostPostSuccessorObstructionPrimeBucketCount: buckets.length,
      postPostPostPostSuccessorObstructionPrimes: primes,
      minPostPostPostPostSuccessorObstructionPrime: primes[0],
      maxPostPostPostPostSuccessorObstructionPrime: primes.at(-1),
      rootResidueCountsPerClass: [2],
      totalPostPostPostPostSuccessorRootChildCount: asString(rootChildCount),
      totalPostPostPostPostSuccessorQAvoidingClassCount: asString(qAvoidingCount),
      survivorSourceRowCount: cover.batchCoverSummary.survivorSourceRowCount,
      survivorPostPostPostSuccessorQAvoidingClassCount: cover.batchCoverSummary.survivorPostPostPostSuccessorQAvoidingClassCount,
    },
    deterministicRankBoundary: {
      consumedFiniteToken: consumedFiniteToken.tokenId,
      producedFiniteTokenCount: buckets.length,
      producedFiniteTokens: buckets,
      measureStatus: 'finite_rank_token_partitioned_not_decreased',
      exactPartition: `The single 29-bucket post-post-post-post-successor rank token is partitioned by q in {${primes.join(',')}}.`,
    },
    compressionAudit: {
      verdict: 'exact_boundary_packet_is_the_honest_current_compression',
      sharedInvariant: 'Every stored row in the 29-bucket post-post-post-post-successor boundary has exactly two roots at its first post-post-post-post-successor obstruction prime.',
      supportDiversity: {
        previousPostPostPostSuccessorPrimeBuckets: supportDiversity(buckets, 'previousPostPostPostSuccessorPrimeBuckets'),
        previousPostPostSuccessorPrimeBuckets: supportDiversity(buckets, 'previousPostPostSuccessorPrimeBuckets'),
        previousPostSuccessorPrimeBuckets: supportDiversity(buckets, 'previousPostSuccessorPrimeBuckets'),
        previousSuccessorPrimeBuckets: supportDiversity(buckets, 'previousSuccessorPrimeBuckets'),
        previousPostNextPrimeBuckets: supportDiversity(buckets, 'previousPostNextPrimeBuckets'),
        previousNextPrimeBuckets: supportDiversity(buckets, 'previousNextPrimeBuckets'),
        previousLaterPrimeBuckets: supportDiversity(buckets, 'previousLaterPrimeBuckets'),
      },
      nonTerminalReason: 'The shared two-root law emits rank children and a still larger q-avoiding boundary; it does not prove terminal closure of those children.',
      noStrongerUniformTheoremThisTurn: 'The buckets mix previous post-post-post, post-post, post, successor, post-next, next-prime, and later-prime supports unevenly, so this packet records the exact finite partition and hands off convergence assembly instead of claiming one closed terminal family.',
    },
    finiteTokenTransition: {
      consumedFiniteToken: {
        ...consumedFiniteToken,
        status: 'consumed_by_deterministic_29_bucket_post_post_post_post_successor_rank_boundary',
      },
      emittedRankBoundaryTokenCount: buckets.length,
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_root_children',
          postPostPostPostSuccessorObstructionPrimeBucketCount: buckets.length,
          rootChildCount: asString(rootChildCount),
          status: 'root_children_open_not_descended',
        },
        {
          tokenId: NEXT_TOKEN,
          postPostPostPostSuccessorObstructionPrimeBucketCount: buckets.length,
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
    postPostPostPostSuccessorPrimeBuckets: buckets,
    proofBoundary: 'This packet accounts for every post-post-post-post-successor bucket emitted by the 26-bucket post-post-post-successor q-avoiding batch cover and turns the 29-bucket surface into an exact deterministic ranked boundary. It does not close the 34,245,622,822,721,856,501,206,493,630,956,387,547,552,030 post-post-post-post-successor root children, the 1,256,125,158,212,428,260,162,381,710,030,390,124,682,911,240,345 post-post-post-post-successor q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Run convergence assembly after the deterministic 29-bucket post-post-post-post-successor rank boundary, name the whole q-avoiding cover token, and block q163/q167 singleton descent before another repeated q-cover step.',
      coveredFamily: `All ${asString(qAvoidingCount)} post-post-post-post-successor q-avoiding classes across q in {${primes.join(',')}}.`,
      finiteDenominatorOrRankToken: `Finite token ${NEXT_TOKEN}.`,
      failureBoundary: 'If no whole-boundary cover exists after assembly, write the deterministic survivor boundary grouped by post-post-post-post-successor prime and previous support; do not open a singleton q-child first.',
      completionRule: 'Assembly consumes the 29-bucket rank-boundary token, names the whole post-post-post-post-successor q-avoiding cover, and records one non-singleton next action.',
    },
    recommendedNextAction: NEXT_ACTION,
    nextQCoverActionAfterAssembly: NEXT_COVER_ACTION,
    nextTheoremMove: 'Use the deterministic 29-bucket post-post-post-post-successor rank boundary to run convergence assembly before any whole-boundary q-avoiding batch cover; singleton q163/q167/etc. descent remains blocked until a later packet consumes a smaller finite token.',
    claims: {
      consumesPostPostPostSuccessor26BucketQAvoidingCoverAssemblyRankToken: true,
      accountsForAll29PostPostPostPostSuccessorBuckets: true,
      allRowsHaveTwoPostPostPostPostSuccessorRoots: true,
      emitsExactDeterministic29BucketPostPostPostPostSuccessorRankBoundary: true,
      selectsConvergenceAssemblyBeforeWholeBoundaryBatchCover: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ163Singleton: false,
      descendsIntoQ167Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostPostPostPostSuccessorRootChildrenClosed: false,
      provesPostPostPostPostSuccessorQAvoidingBoundaryClosed: false,
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
  const lines = [];
  lines.push('# P848 P4217 post-post-post-post-successor 29-bucket rank boundary');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source post-post-post-successor buckets: ${packet.boundarySummary.sourcePostPostPostSuccessorBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.boundarySummary.sourceRowCount}`);
  lines.push(`- Source post-post-post-successor q-avoiding classes accounted: ${packet.boundarySummary.sourcePostPostPostSuccessorQAvoidingClassCount}`);
  lines.push(`- Post-post-post-post-successor buckets: ${packet.boundarySummary.postPostPostPostSuccessorObstructionPrimeBucketCount}`);
  lines.push(`- Post-post-post-post-successor primes: ${packet.boundarySummary.postPostPostPostSuccessorObstructionPrimes.join(', ')}`);
  lines.push(`- Post-post-post-post-successor root children emitted: ${packet.boundarySummary.totalPostPostPostPostSuccessorRootChildCount}`);
  lines.push(`- Post-post-post-post-successor q-avoiding classes emitted: ${packet.boundarySummary.totalPostPostPostPostSuccessorQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.boundarySummary.survivorSourceRowCount}`);
  lines.push(`- Survivor post-post-post-successor q-avoiding classes: ${packet.boundarySummary.survivorPostPostPostSuccessorQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Boundary Buckets');
  lines.push('');
  for (const bucket of packet.postPostPostPostSuccessorPrimeBuckets) {
    lines.push(`- q${bucket.postPostPostPostSuccessorObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourcePostPostPostSuccessorQAvoidingClassCount} source post-post-post-successor q-avoiding classes, ${bucket.postPostPostPostSuccessorRootChildCount} post-post-post-post-successor root children, ${bucket.postPostPostPostSuccessorQAvoidingClassCount} post-post-post-post-successor q-avoiding classes.`);
  }
  lines.push('');
  lines.push('## Compression Audit');
  lines.push('');
  lines.push(packet.compressionAudit.sharedInvariant);
  lines.push(packet.compressionAudit.nonTerminalReason);
  lines.push(packet.compressionAudit.noStrongerUniformTheoremThisTurn);
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push(packet.proofBoundary);
  lines.push('');
  lines.push('## Next Move');
  lines.push('');
  lines.push(packet.oneNextAction.action);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packet = buildPacket(options);
  const rendered = options.pretty ? JSON.stringify(packet, null, 2) : JSON.stringify(packet);

  if (options.jsonOutput) {
    ensureDir(options.jsonOutput);
    fs.writeFileSync(options.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
  }
  if (options.markdownOutput) {
    ensureDir(options.markdownOutput);
    fs.writeFileSync(options.markdownOutput, renderMarkdown(packet));
  }

  console.log(rendered);
}

main();
