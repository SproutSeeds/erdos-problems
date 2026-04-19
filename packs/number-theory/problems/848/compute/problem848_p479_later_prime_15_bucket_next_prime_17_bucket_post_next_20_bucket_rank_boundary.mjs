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
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_RANK_BOUNDARY_PACKET.md',
);

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

function bigintToString(value) {
  return value.toString();
}

function sumBigIntBy(rows, key) {
  return rows.reduce((sum, row) => sum + toBigInt(row[key] ?? 0, key), 0n);
}

function summarizeMap(map, keyName) {
  return [...map.entries()]
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([key, value]) => ({
      [keyName]: Number(key),
      ...value,
    }));
}

function addPreviousNextPrimeBucket(summary, row) {
  const previousNextPrime = Number(row.nextObstructionPrime);
  const current = summary.get(previousNextPrime) ?? {
    sourceRowCount: 0,
    sourceNextQAvoidingClassCount: 0n,
  };
  current.sourceRowCount += 1;
  current.sourceNextQAvoidingClassCount += toBigInt(
    row.sourceNextQAvoidingClassCount,
    'sourceNextQAvoidingClassCount',
  );
  summary.set(previousNextPrime, current);
}

function addPreviousLaterPrimeBucket(summary, row) {
  const previousLaterPrime = Number(row.laterObstructionPrime);
  const current = summary.get(previousLaterPrime) ?? {
    sourceRowCount: 0,
    sourceNextQAvoidingClassCount: 0n,
  };
  current.sourceRowCount += 1;
  current.sourceNextQAvoidingClassCount += toBigInt(
    row.sourceNextQAvoidingClassCount,
    'sourceNextQAvoidingClassCount',
  );
  summary.set(previousLaterPrime, current);
}

function normalizePreviousNextPrimeBuckets(summary) {
  return summarizeMap(summary, 'previousNextObstructionPrime').map((bucket) => ({
    ...bucket,
    sourceNextQAvoidingClassCount: bigintToString(bucket.sourceNextQAvoidingClassCount),
  }));
}

function normalizePreviousLaterPrimeBuckets(summary) {
  return summarizeMap(summary, 'previousLaterObstructionPrime').map((bucket) => ({
    ...bucket,
    sourceNextQAvoidingClassCount: bigintToString(bucket.sourceNextQAvoidingClassCount),
  }));
}

function validateRow(row) {
  const previousNextPrime = Number(row.nextObstructionPrime);
  const previousNextSquare = previousNextPrime * previousNextPrime;
  const postNextPrime = Number(row.postNextObstructionPrime);
  const postNextSquare = postNextPrime * postNextPrime;
  const sourceNextQAvoidingClassCount = toBigInt(
    row.sourceNextQAvoidingClassCount,
    'sourceNextQAvoidingClassCount',
  );
  const rootCount = Number(row.postNextRootResidueCount);

  assertCondition(Number.isInteger(previousNextPrime), 'missing previous next obstruction prime');
  assertCondition(Number(row.nextObstructionSquare) === previousNextSquare, `previous next square mismatch for q${previousNextPrime}`);
  assertCondition(Number.isInteger(postNextPrime), 'missing post-next obstruction prime');
  assertCondition(postNextPrime > previousNextPrime, `post-next prime q${postNextPrime} does not advance past previous next q${previousNextPrime}`);
  assertCondition(Number(row.postNextObstructionSquare) === postNextSquare, `post-next square mismatch for q${postNextPrime}`);
  assertCondition(rootCount === 2, `expected exactly two post-next roots for q${postNextPrime}`);
  assertCondition(Array.isArray(row.postNextRootResidues) && row.postNextRootResidues.length === 2, `post-next root residue list mismatch for q${postNextPrime}`);
  assertCondition(
    toBigInt(row.postNextRootChildCount, 'postNextRootChildCount') === sourceNextQAvoidingClassCount * BigInt(rootCount),
    `post-next root-child count mismatch for q${postNextPrime}`,
  );
  assertCondition(
    toBigInt(row.postNextQAvoidingClassCount, 'postNextQAvoidingClassCount') === sourceNextQAvoidingClassCount * (BigInt(postNextSquare) - BigInt(rootCount)),
    `post-next q-avoiding count mismatch for q${postNextPrime}`,
  );
}

function compareBigInt(actual, expected, message) {
  assertCondition(toBigInt(actual, message) === toBigInt(expected, message), message);
}

function buildBuckets(rows, coverBuckets) {
  const groups = new Map();
  for (const row of rows) {
    validateRow(row);
    const postNextPrime = Number(row.postNextObstructionPrime);
    const current = groups.get(postNextPrime) ?? {
      sourceRows: [],
      previousNextPrimeBuckets: new Map(),
      previousLaterPrimeBuckets: new Map(),
    };
    current.sourceRows.push(row);
    addPreviousNextPrimeBucket(current.previousNextPrimeBuckets, row);
    addPreviousLaterPrimeBucket(current.previousLaterPrimeBuckets, row);
    groups.set(postNextPrime, current);
  }

  const coverBucketByPrime = new Map(coverBuckets.map((bucket) => [Number(bucket.postNextObstructionPrime), bucket]));

  return summarizeMap(groups, 'postNextObstructionPrime').map((group) => {
    const postNextPrime = group.postNextObstructionPrime;
    const rowsInBucket = group.sourceRows;
    const sourceRowCount = rowsInBucket.length;
    const sourceNextQAvoidingClassCount = sumBigIntBy(rowsInBucket, 'sourceNextQAvoidingClassCount');
    const postNextRootChildCount = sumBigIntBy(rowsInBucket, 'postNextRootChildCount');
    const postNextQAvoidingClassCount = sumBigIntBy(rowsInBucket, 'postNextQAvoidingClassCount');
    const coverBucket = coverBucketByPrime.get(postNextPrime);

    assertCondition(Boolean(coverBucket), `missing source cover bucket for q${postNextPrime}`);
    assertCondition(coverBucket.sourceRowCount === sourceRowCount, `source row count mismatch for q${postNextPrime}`);
    compareBigInt(sourceNextQAvoidingClassCount, coverBucket.sourceNextQAvoidingClassCount, `source next q-avoiding count mismatch for q${postNextPrime}`);
    compareBigInt(postNextRootChildCount, coverBucket.postNextRootChildCount, `post-next root-child count mismatch for q${postNextPrime}`);
    compareBigInt(postNextQAvoidingClassCount, coverBucket.postNextQAvoidingClassCount, `post-next q-avoiding count mismatch for q${postNextPrime}`);

    return {
      tokenId: `p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_q${postNextPrime}_rank_boundary`,
      postNextObstructionPrime: postNextPrime,
      postNextObstructionSquare: postNextPrime * postNextPrime,
      sourceRowCount,
      sourceNextQAvoidingClassCount: bigintToString(sourceNextQAvoidingClassCount),
      rootResidueCountsPerClass: [2],
      postNextRootChildCount: bigintToString(postNextRootChildCount),
      postNextQAvoidingClassCount: bigintToString(postNextQAvoidingClassCount),
      previousNextPrimeBuckets: normalizePreviousNextPrimeBuckets(group.previousNextPrimeBuckets),
      previousLaterPrimeBuckets: normalizePreviousLaterPrimeBuckets(group.previousLaterPrimeBuckets),
      status: 'open_exact_two_root_post_next_rank_boundary',
      proofObligation: 'Cover this bucket as part of the whole 20-bucket post-next q-avoiding batch/rank action, or emit a sharper exact subboundary. This token does not authorize singleton q-child descent by itself.',
    };
  });
}

function buildPacket(options) {
  const cover = readJson(options.coverPacket);
  const assembly = readJson(options.assemblyPacket);
  const rows = cover.rowClassifications ?? [];
  const coverBuckets = cover.postNextObstructionPrimeBuckets ?? [];

  assertCondition(cover.status === 'all_17_bucket_next_prime_q_avoiding_classes_have_later_square_obstruction_child', 'cover packet status mismatch');
  assertCondition(assembly.status === 'post_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_convergence_assembly_selects_20_bucket_rank_compression', 'assembly packet status mismatch');
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 source row classifications');
  assertCondition(Array.isArray(coverBuckets) && coverBuckets.length === 20, 'expected 20 post-next cover buckets');

  const buckets = buildBuckets(rows, coverBuckets);
  const sourceRowCount = buckets.reduce((sum, bucket) => sum + bucket.sourceRowCount, 0);
  const sourceNextQAvoidingClassCount = sumBigIntBy(buckets, 'sourceNextQAvoidingClassCount');
  const postNextRootChildCount = sumBigIntBy(buckets, 'postNextRootChildCount');
  const postNextQAvoidingClassCount = sumBigIntBy(buckets, 'postNextQAvoidingClassCount');
  const postNextPrimes = buckets.map((bucket) => bucket.postNextObstructionPrime);

  assertCondition(sourceRowCount === cover.batchCoverSummary?.sourceRowCount, 'total source row count mismatch');
  compareBigInt(sourceNextQAvoidingClassCount, cover.batchCoverSummary?.sourceNextQAvoidingClassCount, 'total source next q-avoiding count mismatch');
  compareBigInt(postNextRootChildCount, cover.batchCoverSummary?.totalPostNextRootChildCount, 'total post-next root-child count mismatch');
  compareBigInt(postNextQAvoidingClassCount, cover.batchCoverSummary?.totalPostNextQAvoidingClassCount, 'total post-next q-avoiding count mismatch');
  compareBigInt(cover.batchCoverSummary?.survivorNextQAvoidingClassCount, 0n, 'source cover has survivors');
  assertCondition(
    postNextPrimes.join(',') === '137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239',
    'unexpected post-next prime bucket set',
  );

  const consumedFiniteToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_rank_boundary',
    bucketCount: 20,
    status: 'selected',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_rank_boundary/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_deterministic_rank_boundary_emitted',
    target: 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_buckets_or_emit_rank_boundary',
    sourceAudit: {
      laterPrime15BucketNextPrime17BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.coverPacket),
        sha256: sha256File(options.coverPacket),
        status: cover.status,
      },
      postLaterPrime15BucketNextPrime17BucketQAvoidingBatchCoverAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    boundarySummary: {
      sourceNextPrimeBucketCount: cover.batchCoverSummary.sourceNextPrimeBucketCount,
      sourceRowCount,
      sourceNextQAvoidingClassCount: bigintToString(sourceNextQAvoidingClassCount),
      postNextObstructionPrimeBucketCount: buckets.length,
      postNextObstructionPrimes: postNextPrimes,
      minPostNextObstructionPrime: postNextPrimes[0],
      maxPostNextObstructionPrime: postNextPrimes.at(-1),
      rootResidueCountsPerClass: [2],
      totalPostNextRootChildCount: bigintToString(postNextRootChildCount),
      totalPostNextQAvoidingClassCount: bigintToString(postNextQAvoidingClassCount),
      survivorSourceRowCount: cover.batchCoverSummary.survivorSourceRowCount,
      survivorNextQAvoidingClassCount: cover.batchCoverSummary.survivorNextQAvoidingClassCount,
    },
    deterministicRankBoundary: {
      consumedFiniteToken: consumedFiniteToken.tokenId,
      producedFiniteTokenCount: buckets.length,
      producedFiniteTokens: buckets,
      measureStatus: 'finite_rank_token_partitioned_not_decreased',
      exactPartition: 'The single 20-bucket post-next rank token is partitioned by q in {137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239}.',
    },
    compressionAudit: {
      verdict: 'exact_boundary_packet_is_the_honest_current_compression',
      sharedInvariant: 'Every stored row in the 20-bucket post-next boundary has exactly two roots at its first post-next obstruction prime.',
      nonTerminalReason: 'The shared two-root law emits rank children and a still larger q-avoiding boundary; it does not prove terminal closure of those children.',
      noStrongerUniformTheoremThisTurn: 'The buckets mix previous next-prime and previous later-prime supports unevenly, so this packet records the exact finite partition and hands off a whole-boundary q-avoiding batch cover instead of claiming one closed terminal family.',
    },
    finiteTokenTransition: {
      consumedFiniteToken: {
        ...consumedFiniteToken,
        status: 'consumed_by_deterministic_20_bucket_rank_boundary',
      },
      emittedRankBoundaryTokenCount: buckets.length,
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_root_children',
          postNextObstructionPrimeBucketCount: buckets.length,
          rootChildCount: bigintToString(postNextRootChildCount),
          status: 'root_children_open_not_descended',
        },
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover',
          postNextObstructionPrimeBucketCount: buckets.length,
          qAvoidingClassCount: bigintToString(postNextQAvoidingClassCount),
          status: 'selected_for_whole_boundary_batch_cover',
        },
      ],
      nextFiniteToken: {
        tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover',
        bucketCount: buckets.length,
        qAvoidingClassCount: bigintToString(postNextQAvoidingClassCount),
        status: 'selected',
      },
    },
    postNextPrimeBuckets: buckets,
    proofBoundary: 'This packet accounts for every post-next bucket emitted by the 17-bucket next-prime q-avoiding batch cover and turns the 20-bucket surface into an exact deterministic ranked boundary. It does not close the 189,049,482,381,917,941,314 post-next root children, the 2,946,810,455,708,641,575,397,311 post-next q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover_or_emit_boundary',
      action: 'Run a whole-boundary q-avoiding batch cover over all 20 post-next buckets, or emit an exact survivor/rank boundary if the batch cover does not close.',
      coveredFamily: 'All 2,946,810,455,708,641,575,397,311 post-next q-avoiding classes across q in {137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239}.',
      finiteDenominatorOrRankToken: 'Finite token p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover.',
      failureBoundary: 'If no whole-boundary cover exists, write the deterministic survivor boundary grouped by post-next prime and previous next/later-prime support; do not open a singleton q-child first.',
      completionRule: 'Every one of the 20 post-next q-avoiding buckets is covered, structurally decomposed, or listed in a deterministic exact survivor boundary before singleton descent.',
    },
    recommendedNextAction: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover_or_emit_boundary',
    nextTheoremMove: 'Use the deterministic 20-bucket post-next rank boundary to run one whole-boundary q-avoiding batch cover; singleton q137/q139/etc. descent remains blocked until a later packet consumes a smaller finite token.',
    claims: {
      consumesPost17BucketQAvoiding20BucketRankToken: true,
      accountsForAll20PostNextBuckets: true,
      allRowsHaveTwoPostNextRoots: true,
      emitsExactDeterministic20BucketRankBoundary: true,
      selectsWholeBoundaryBatchCoverNext: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ137Singleton: false,
      descendsIntoQ139Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostNextRootChildrenClosed: false,
      provesPostNextQAvoidingBoundaryClosed: false,
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
  lines.push('# P848 P4217 later-prime 15-bucket next-prime 17-bucket post-next 20-bucket rank boundary');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source next-prime buckets: ${packet.boundarySummary.sourceNextPrimeBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.boundarySummary.sourceRowCount}`);
  lines.push(`- Source next q-avoiding classes accounted: ${packet.boundarySummary.sourceNextQAvoidingClassCount}`);
  lines.push(`- Post-next buckets: ${packet.boundarySummary.postNextObstructionPrimeBucketCount}`);
  lines.push(`- Post-next primes: ${packet.boundarySummary.postNextObstructionPrimes.join(', ')}`);
  lines.push(`- Post-next root children emitted: ${packet.boundarySummary.totalPostNextRootChildCount}`);
  lines.push(`- Post-next q-avoiding classes emitted: ${packet.boundarySummary.totalPostNextQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.boundarySummary.survivorSourceRowCount}`);
  lines.push(`- Survivor next q-avoiding classes: ${packet.boundarySummary.survivorNextQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Boundary Buckets');
  lines.push('');
  for (const bucket of packet.postNextPrimeBuckets) {
    lines.push(`- q${bucket.postNextObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourceNextQAvoidingClassCount} source next q-avoiding classes, ${bucket.postNextRootChildCount} post-next root children, ${bucket.postNextQAvoidingClassCount} post-next q-avoiding classes.`);
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
