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
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_RANK_BOUNDARY_PACKET.md',
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

function compareBigInt(actual, expected, message) {
  assertCondition(toBigInt(actual, message) === toBigInt(expected, message), message);
}

function summarizeMap(map, keyName) {
  return [...map.entries()]
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([key, value]) => ({
      [keyName]: Number(key),
      ...value,
    }));
}

function addPreviousPrimeBucket(summary, key, row) {
  const prime = Number(row[key]);
  const current = summary.get(prime) ?? {
    sourceRowCount: 0,
    sourceSuccessorQAvoidingClassCount: 0n,
  };
  current.sourceRowCount += 1;
  current.sourceSuccessorQAvoidingClassCount += toBigInt(
    row.sourceSuccessorQAvoidingClassCount,
    'sourceSuccessorQAvoidingClassCount',
  );
  summary.set(prime, current);
}

function normalizePreviousPrimeBuckets(summary, keyName) {
  return summarizeMap(summary, keyName).map((bucket) => ({
    ...bucket,
    sourceSuccessorQAvoidingClassCount: bigintToString(bucket.sourceSuccessorQAvoidingClassCount),
  }));
}

function validateRow(row) {
  const successorPrime = Number(row.successorObstructionPrime);
  const successorSquare = successorPrime * successorPrime;
  const postSuccessorPrime = Number(row.postSuccessorObstructionPrime);
  const postSuccessorSquare = postSuccessorPrime * postSuccessorPrime;
  const sourceSuccessorQAvoidingClassCount = toBigInt(
    row.sourceSuccessorQAvoidingClassCount,
    'sourceSuccessorQAvoidingClassCount',
  );
  const rootCount = Number(row.postSuccessorRootResidueCount);

  assertCondition(Number.isInteger(successorPrime), 'missing previous successor obstruction prime');
  assertCondition(Number(row.successorObstructionSquare) === successorSquare, `successor square mismatch for q${successorPrime}`);
  assertCondition(Number.isInteger(postSuccessorPrime), 'missing post-successor obstruction prime');
  assertCondition(postSuccessorPrime > successorPrime, `post-successor prime q${postSuccessorPrime} does not advance past successor q${successorPrime}`);
  assertCondition(Number(row.postSuccessorObstructionSquare) === postSuccessorSquare, `post-successor square mismatch for q${postSuccessorPrime}`);
  assertCondition(rootCount === 2, `expected exactly two post-successor roots for q${postSuccessorPrime}`);
  assertCondition(Array.isArray(row.postSuccessorRootResidues) && row.postSuccessorRootResidues.length === 2, `post-successor root residue list mismatch for q${postSuccessorPrime}`);
  assertCondition(
    toBigInt(row.postSuccessorRootChildCount, 'postSuccessorRootChildCount') === sourceSuccessorQAvoidingClassCount * BigInt(rootCount),
    `post-successor root-child count mismatch for q${postSuccessorPrime}`,
  );
  assertCondition(
    toBigInt(row.postSuccessorQAvoidingClassCount, 'postSuccessorQAvoidingClassCount') === sourceSuccessorQAvoidingClassCount * (BigInt(postSuccessorSquare) - BigInt(rootCount)),
    `post-successor q-avoiding count mismatch for q${postSuccessorPrime}`,
  );
}

function buildBuckets(rows, coverBuckets) {
  const groups = new Map();
  for (const row of rows) {
    validateRow(row);
    const postSuccessorPrime = Number(row.postSuccessorObstructionPrime);
    const current = groups.get(postSuccessorPrime) ?? {
      sourceRows: [],
      previousSuccessorPrimeBuckets: new Map(),
      previousPostNextPrimeBuckets: new Map(),
      previousNextPrimeBuckets: new Map(),
      previousLaterPrimeBuckets: new Map(),
    };
    current.sourceRows.push(row);
    addPreviousPrimeBucket(current.previousSuccessorPrimeBuckets, 'successorObstructionPrime', row);
    addPreviousPrimeBucket(current.previousPostNextPrimeBuckets, 'postNextObstructionPrime', row);
    addPreviousPrimeBucket(current.previousNextPrimeBuckets, 'nextObstructionPrime', row);
    addPreviousPrimeBucket(current.previousLaterPrimeBuckets, 'laterObstructionPrime', row);
    groups.set(postSuccessorPrime, current);
  }

  const coverBucketByPrime = new Map(coverBuckets.map((bucket) => [Number(bucket.postSuccessorObstructionPrime), bucket]));

  return summarizeMap(groups, 'postSuccessorObstructionPrime').map((group) => {
    const postSuccessorPrime = group.postSuccessorObstructionPrime;
    const rowsInBucket = group.sourceRows;
    const sourceRowCount = rowsInBucket.length;
    const sourceSuccessorQAvoidingClassCount = sumBigIntBy(rowsInBucket, 'sourceSuccessorQAvoidingClassCount');
    const postSuccessorRootChildCount = sumBigIntBy(rowsInBucket, 'postSuccessorRootChildCount');
    const postSuccessorQAvoidingClassCount = sumBigIntBy(rowsInBucket, 'postSuccessorQAvoidingClassCount');
    const coverBucket = coverBucketByPrime.get(postSuccessorPrime);

    assertCondition(Boolean(coverBucket), `missing source cover bucket for q${postSuccessorPrime}`);
    assertCondition(coverBucket.sourceRowCount === sourceRowCount, `source row count mismatch for q${postSuccessorPrime}`);
    compareBigInt(sourceSuccessorQAvoidingClassCount, coverBucket.sourceSuccessorQAvoidingClassCount, `source successor q-avoiding count mismatch for q${postSuccessorPrime}`);
    compareBigInt(postSuccessorRootChildCount, coverBucket.postSuccessorRootChildCount, `post-successor root-child count mismatch for q${postSuccessorPrime}`);
    compareBigInt(postSuccessorQAvoidingClassCount, coverBucket.postSuccessorQAvoidingClassCount, `post-successor q-avoiding count mismatch for q${postSuccessorPrime}`);

    return {
      tokenId: `p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_q${postSuccessorPrime}_rank_boundary`,
      postSuccessorObstructionPrime: postSuccessorPrime,
      postSuccessorObstructionSquare: postSuccessorPrime * postSuccessorPrime,
      sourceRowCount,
      sourceSuccessorQAvoidingClassCount: bigintToString(sourceSuccessorQAvoidingClassCount),
      rootResidueCountsPerClass: [2],
      postSuccessorRootChildCount: bigintToString(postSuccessorRootChildCount),
      postSuccessorQAvoidingClassCount: bigintToString(postSuccessorQAvoidingClassCount),
      previousSuccessorPrimeBuckets: normalizePreviousPrimeBuckets(group.previousSuccessorPrimeBuckets, 'previousSuccessorObstructionPrime'),
      previousPostNextPrimeBuckets: normalizePreviousPrimeBuckets(group.previousPostNextPrimeBuckets, 'previousPostNextObstructionPrime'),
      previousNextPrimeBuckets: normalizePreviousPrimeBuckets(group.previousNextPrimeBuckets, 'previousNextObstructionPrime'),
      previousLaterPrimeBuckets: normalizePreviousPrimeBuckets(group.previousLaterPrimeBuckets, 'previousLaterObstructionPrime'),
      status: 'open_exact_two_root_post_successor_rank_boundary',
      proofObligation: 'Cover this bucket as part of the whole 24-bucket post-successor q-avoiding batch/rank action, or emit a sharper exact subboundary. This token does not authorize singleton q-child descent by itself.',
    };
  });
}

function buildPacket(options) {
  const cover = readJson(options.coverPacket);
  const assembly = readJson(options.assemblyPacket);
  const rows = cover.rowClassifications ?? [];
  const coverBuckets = cover.postSuccessorObstructionPrimeBuckets ?? [];

  assertCondition(cover.status === 'all_22_bucket_successor_q_avoiding_classes_have_later_square_obstruction_child', 'cover packet status mismatch');
  assertCondition(
    assembly.status === 'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover_convergence_assembly_selects_24_bucket_post_successor_rank_compression',
    'assembly packet status mismatch',
  );
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 source row classifications');
  assertCondition(Array.isArray(coverBuckets) && coverBuckets.length === 24, 'expected 24 post-successor cover buckets');

  const buckets = buildBuckets(rows, coverBuckets);
  const sourceRowCount = buckets.reduce((sum, bucket) => sum + bucket.sourceRowCount, 0);
  const sourceSuccessorQAvoidingClassCount = sumBigIntBy(buckets, 'sourceSuccessorQAvoidingClassCount');
  const postSuccessorRootChildCount = sumBigIntBy(buckets, 'postSuccessorRootChildCount');
  const postSuccessorQAvoidingClassCount = sumBigIntBy(buckets, 'postSuccessorQAvoidingClassCount');
  const postSuccessorPrimes = buckets.map((bucket) => bucket.postSuccessorObstructionPrime);

  assertCondition(sourceRowCount === cover.batchCoverSummary?.sourceRowCount, 'total source row count mismatch');
  compareBigInt(
    sourceSuccessorQAvoidingClassCount,
    cover.batchCoverSummary?.sourceSuccessorQAvoidingClassCount,
    'total source successor q-avoiding count mismatch',
  );
  compareBigInt(postSuccessorRootChildCount, cover.batchCoverSummary?.totalPostSuccessorRootChildCount, 'total post-successor root-child count mismatch');
  compareBigInt(postSuccessorQAvoidingClassCount, cover.batchCoverSummary?.totalPostSuccessorQAvoidingClassCount, 'total post-successor q-avoiding count mismatch');
  compareBigInt(cover.batchCoverSummary?.survivorSuccessorQAvoidingClassCount, 0n, 'source cover has survivors');
  assertCondition(
    postSuccessorPrimes.join(',') === '149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,277',
    'unexpected post-successor prime bucket set',
  );

  const consumedFiniteToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_rank_boundary',
    bucketCount: 24,
    postSuccessorRootChildCount: bigintToString(postSuccessorRootChildCount),
    postSuccessorQAvoidingClassCount: bigintToString(postSuccessorQAvoidingClassCount),
    status: 'selected_for_compression_structural_decomposition_impossibility_or_exact_rank_boundary',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_rank_boundary/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_deterministic_rank_boundary_emitted',
    target: 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_buckets_or_emit_rank_boundary',
    sourceAudit: {
      successor22BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.coverPacket),
        sha256: sha256File(options.coverPacket),
        status: cover.status,
      },
      post22BucketSuccessorQAvoidingBatchCoverAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    boundarySummary: {
      sourceSuccessorBucketCount: cover.batchCoverSummary.sourceSuccessorBucketCount,
      sourceRowCount,
      sourceSuccessorQAvoidingClassCount: bigintToString(sourceSuccessorQAvoidingClassCount),
      postSuccessorObstructionPrimeBucketCount: buckets.length,
      postSuccessorObstructionPrimes: postSuccessorPrimes,
      minPostSuccessorObstructionPrime: postSuccessorPrimes[0],
      maxPostSuccessorObstructionPrime: postSuccessorPrimes.at(-1),
      rootResidueCountsPerClass: [2],
      totalPostSuccessorRootChildCount: bigintToString(postSuccessorRootChildCount),
      totalPostSuccessorQAvoidingClassCount: bigintToString(postSuccessorQAvoidingClassCount),
      survivorSourceRowCount: cover.batchCoverSummary.survivorSourceRowCount,
      survivorSuccessorQAvoidingClassCount: cover.batchCoverSummary.survivorSuccessorQAvoidingClassCount,
    },
    deterministicRankBoundary: {
      consumedFiniteToken: consumedFiniteToken.tokenId,
      producedFiniteTokenCount: buckets.length,
      producedFiniteTokens: buckets,
      measureStatus: 'finite_rank_token_partitioned_not_decreased',
      exactPartition: 'The single 24-bucket post-successor rank token is partitioned by q in {149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,277}.',
    },
    compressionAudit: {
      verdict: 'exact_boundary_packet_is_the_honest_current_compression',
      sharedInvariant: 'Every stored row in the 24-bucket post-successor boundary has exactly two roots at its first post-successor obstruction prime.',
      nonTerminalReason: 'The shared two-root law emits rank children and a still larger q-avoiding boundary; it does not prove terminal closure of those children.',
      noStrongerUniformTheoremThisTurn: 'The buckets mix previous successor, post-next, next-prime, and later-prime supports unevenly, so this packet records the exact finite partition and hands off a whole-boundary q-avoiding batch cover instead of claiming one closed terminal family.',
    },
    finiteTokenTransition: {
      consumedFiniteToken: {
        ...consumedFiniteToken,
        status: 'consumed_by_deterministic_24_bucket_post_successor_rank_boundary',
      },
      emittedRankBoundaryTokenCount: buckets.length,
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_root_children',
          postSuccessorObstructionPrimeBucketCount: buckets.length,
          rootChildCount: bigintToString(postSuccessorRootChildCount),
          status: 'root_children_open_not_descended',
        },
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover',
          postSuccessorObstructionPrimeBucketCount: buckets.length,
          qAvoidingClassCount: bigintToString(postSuccessorQAvoidingClassCount),
          status: 'selected_for_whole_boundary_batch_cover',
        },
      ],
      nextFiniteToken: {
        tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover',
        bucketCount: buckets.length,
        qAvoidingClassCount: bigintToString(postSuccessorQAvoidingClassCount),
        status: 'selected',
      },
    },
    postSuccessorPrimeBuckets: buckets,
    proofBoundary: 'This packet accounts for every post-successor bucket emitted by the 22-bucket successor q-avoiding batch cover and turns the 24-bucket surface into an exact deterministic ranked boundary. It does not close the 222,345,036,453,733,797,142,322,640,306 post-successor root children, the 5,058,399,114,142,580,922,880,572,195,875,967 post-successor q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary',
      action: 'Run a whole-boundary q-avoiding batch cover over all 24 post-successor buckets, or emit an exact survivor/rank boundary if the batch cover does not close.',
      coveredFamily: 'All 5,058,399,114,142,580,922,880,572,195,875,967 post-successor q-avoiding classes across q in {149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,257,263,269,277}.',
      finiteDenominatorOrRankToken: 'Finite token p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover.',
      failureBoundary: 'If no whole-boundary cover exists, write the deterministic survivor boundary grouped by post-successor prime and previous successor/post-next/next/later-prime support; do not open a singleton q-child first.',
      completionRule: 'Every one of the 24 post-successor q-avoiding buckets is covered, structurally decomposed, or listed in a deterministic exact survivor boundary before singleton descent.',
    },
    recommendedNextAction: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary',
    nextTheoremMove: 'Use the deterministic 24-bucket post-successor rank boundary to run one whole-boundary q-avoiding batch cover; singleton q149/q151/etc. descent remains blocked until a later packet consumes a smaller finite token.',
    claims: {
      consumesPost22BucketSuccessorQAvoiding24BucketPostSuccessorRankToken: true,
      accountsForAll24PostSuccessorBuckets: true,
      allRowsHaveTwoPostSuccessorRoots: true,
      emitsExactDeterministic24BucketPostSuccessorRankBoundary: true,
      selectsWholeBoundaryBatchCoverNext: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ149Singleton: false,
      descendsIntoQ151Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostSuccessorRootChildrenClosed: false,
      provesPostSuccessorQAvoidingBoundaryClosed: false,
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
  lines.push('# P848 P4217 post-successor 24-bucket rank boundary');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source successor buckets: ${packet.boundarySummary.sourceSuccessorBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.boundarySummary.sourceRowCount}`);
  lines.push(`- Source successor q-avoiding classes accounted: ${packet.boundarySummary.sourceSuccessorQAvoidingClassCount}`);
  lines.push(`- Post-successor buckets: ${packet.boundarySummary.postSuccessorObstructionPrimeBucketCount}`);
  lines.push(`- Post-successor primes: ${packet.boundarySummary.postSuccessorObstructionPrimes.join(', ')}`);
  lines.push(`- Post-successor root children emitted: ${packet.boundarySummary.totalPostSuccessorRootChildCount}`);
  lines.push(`- Post-successor q-avoiding classes emitted: ${packet.boundarySummary.totalPostSuccessorQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.boundarySummary.survivorSourceRowCount}`);
  lines.push(`- Survivor successor q-avoiding classes: ${packet.boundarySummary.survivorSuccessorQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Boundary Buckets');
  lines.push('');
  for (const bucket of packet.postSuccessorPrimeBuckets) {
    lines.push(`- q${bucket.postSuccessorObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourceSuccessorQAvoidingClassCount} source successor q-avoiding classes, ${bucket.postSuccessorRootChildCount} post-successor root children, ${bucket.postSuccessorQAvoidingClassCount} post-successor q-avoiding classes.`);
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
