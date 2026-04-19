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
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_RANK_BOUNDARY_PACKET.md',
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

function addPreviousPrimeBucket(summary, key, row) {
  const prime = Number(row[key]);
  const current = summary.get(prime) ?? {
    sourceRowCount: 0,
    sourcePostNextQAvoidingClassCount: 0n,
  };
  current.sourceRowCount += 1;
  current.sourcePostNextQAvoidingClassCount += toBigInt(
    row.sourcePostNextQAvoidingClassCount,
    'sourcePostNextQAvoidingClassCount',
  );
  summary.set(prime, current);
}

function normalizePreviousPrimeBuckets(summary, keyName) {
  return summarizeMap(summary, keyName).map((bucket) => ({
    ...bucket,
    sourcePostNextQAvoidingClassCount: bigintToString(bucket.sourcePostNextQAvoidingClassCount),
  }));
}

function validateRow(row) {
  const postNextPrime = Number(row.postNextObstructionPrime);
  const postNextSquare = postNextPrime * postNextPrime;
  const successorPrime = Number(row.successorObstructionPrime);
  const successorSquare = successorPrime * successorPrime;
  const sourcePostNextQAvoidingClassCount = toBigInt(
    row.sourcePostNextQAvoidingClassCount,
    'sourcePostNextQAvoidingClassCount',
  );
  const rootCount = Number(row.successorRootResidueCount);

  assertCondition(Number.isInteger(postNextPrime), 'missing previous post-next obstruction prime');
  assertCondition(Number(row.postNextObstructionSquare) === postNextSquare, `post-next square mismatch for q${postNextPrime}`);
  assertCondition(Number.isInteger(successorPrime), 'missing successor obstruction prime');
  assertCondition(successorPrime > postNextPrime, `successor prime q${successorPrime} does not advance past post-next q${postNextPrime}`);
  assertCondition(Number(row.successorObstructionSquare) === successorSquare, `successor square mismatch for q${successorPrime}`);
  assertCondition(rootCount === 2, `expected exactly two successor roots for q${successorPrime}`);
  assertCondition(Array.isArray(row.successorRootResidues) && row.successorRootResidues.length === 2, `successor root residue list mismatch for q${successorPrime}`);
  assertCondition(
    toBigInt(row.successorRootChildCount, 'successorRootChildCount') === sourcePostNextQAvoidingClassCount * BigInt(rootCount),
    `successor root-child count mismatch for q${successorPrime}`,
  );
  assertCondition(
    toBigInt(row.successorQAvoidingClassCount, 'successorQAvoidingClassCount') === sourcePostNextQAvoidingClassCount * (BigInt(successorSquare) - BigInt(rootCount)),
    `successor q-avoiding count mismatch for q${successorPrime}`,
  );
}

function compareBigInt(actual, expected, message) {
  assertCondition(toBigInt(actual, message) === toBigInt(expected, message), message);
}

function buildBuckets(rows, coverBuckets) {
  const groups = new Map();
  for (const row of rows) {
    validateRow(row);
    const successorPrime = Number(row.successorObstructionPrime);
    const current = groups.get(successorPrime) ?? {
      sourceRows: [],
      previousPostNextPrimeBuckets: new Map(),
      previousNextPrimeBuckets: new Map(),
      previousLaterPrimeBuckets: new Map(),
    };
    current.sourceRows.push(row);
    addPreviousPrimeBucket(current.previousPostNextPrimeBuckets, 'postNextObstructionPrime', row);
    addPreviousPrimeBucket(current.previousNextPrimeBuckets, 'nextObstructionPrime', row);
    addPreviousPrimeBucket(current.previousLaterPrimeBuckets, 'laterObstructionPrime', row);
    groups.set(successorPrime, current);
  }

  const coverBucketByPrime = new Map(coverBuckets.map((bucket) => [Number(bucket.successorObstructionPrime), bucket]));

  return summarizeMap(groups, 'successorObstructionPrime').map((group) => {
    const successorPrime = group.successorObstructionPrime;
    const rowsInBucket = group.sourceRows;
    const sourceRowCount = rowsInBucket.length;
    const sourcePostNextQAvoidingClassCount = sumBigIntBy(rowsInBucket, 'sourcePostNextQAvoidingClassCount');
    const successorRootChildCount = sumBigIntBy(rowsInBucket, 'successorRootChildCount');
    const successorQAvoidingClassCount = sumBigIntBy(rowsInBucket, 'successorQAvoidingClassCount');
    const coverBucket = coverBucketByPrime.get(successorPrime);

    assertCondition(Boolean(coverBucket), `missing source cover bucket for q${successorPrime}`);
    assertCondition(coverBucket.sourceRowCount === sourceRowCount, `source row count mismatch for q${successorPrime}`);
    compareBigInt(sourcePostNextQAvoidingClassCount, coverBucket.sourcePostNextQAvoidingClassCount, `source post-next q-avoiding count mismatch for q${successorPrime}`);
    compareBigInt(successorRootChildCount, coverBucket.successorRootChildCount, `successor root-child count mismatch for q${successorPrime}`);
    compareBigInt(successorQAvoidingClassCount, coverBucket.successorQAvoidingClassCount, `successor q-avoiding count mismatch for q${successorPrime}`);

    return {
      tokenId: `p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_q${successorPrime}_rank_boundary`,
      successorObstructionPrime: successorPrime,
      successorObstructionSquare: successorPrime * successorPrime,
      sourceRowCount,
      sourcePostNextQAvoidingClassCount: bigintToString(sourcePostNextQAvoidingClassCount),
      rootResidueCountsPerClass: [2],
      successorRootChildCount: bigintToString(successorRootChildCount),
      successorQAvoidingClassCount: bigintToString(successorQAvoidingClassCount),
      previousPostNextPrimeBuckets: normalizePreviousPrimeBuckets(group.previousPostNextPrimeBuckets, 'previousPostNextObstructionPrime'),
      previousNextPrimeBuckets: normalizePreviousPrimeBuckets(group.previousNextPrimeBuckets, 'previousNextObstructionPrime'),
      previousLaterPrimeBuckets: normalizePreviousPrimeBuckets(group.previousLaterPrimeBuckets, 'previousLaterObstructionPrime'),
      status: 'open_exact_two_root_successor_rank_boundary',
      proofObligation: 'Cover this bucket as part of the whole 22-bucket successor q-avoiding batch/rank action, or emit a sharper exact subboundary. This token does not authorize singleton q-child descent by itself.',
    };
  });
}

function buildPacket(options) {
  const cover = readJson(options.coverPacket);
  const assembly = readJson(options.assemblyPacket);
  const rows = cover.rowClassifications ?? [];
  const coverBuckets = cover.successorObstructionPrimeBuckets ?? [];

  assertCondition(cover.status === 'all_20_bucket_post_next_q_avoiding_classes_have_later_square_obstruction_child', 'cover packet status mismatch');
  assertCondition(
    assembly.status === 'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover_convergence_assembly_selects_22_bucket_successor_rank_compression',
    'assembly packet status mismatch',
  );
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 source row classifications');
  assertCondition(Array.isArray(coverBuckets) && coverBuckets.length === 22, 'expected 22 successor cover buckets');

  const buckets = buildBuckets(rows, coverBuckets);
  const sourceRowCount = buckets.reduce((sum, bucket) => sum + bucket.sourceRowCount, 0);
  const sourcePostNextQAvoidingClassCount = sumBigIntBy(buckets, 'sourcePostNextQAvoidingClassCount');
  const successorRootChildCount = sumBigIntBy(buckets, 'successorRootChildCount');
  const successorQAvoidingClassCount = sumBigIntBy(buckets, 'successorQAvoidingClassCount');
  const successorPrimes = buckets.map((bucket) => bucket.successorObstructionPrime);

  assertCondition(sourceRowCount === cover.batchCoverSummary?.sourceRowCount, 'total source row count mismatch');
  compareBigInt(
    sourcePostNextQAvoidingClassCount,
    cover.batchCoverSummary?.sourcePostNextQAvoidingClassCount,
    'total source post-next q-avoiding count mismatch',
  );
  compareBigInt(successorRootChildCount, cover.batchCoverSummary?.totalSuccessorRootChildCount, 'total successor root-child count mismatch');
  compareBigInt(successorQAvoidingClassCount, cover.batchCoverSummary?.totalSuccessorQAvoidingClassCount, 'total successor q-avoiding count mismatch');
  compareBigInt(cover.batchCoverSummary?.survivorPostNextQAvoidingClassCount, 0n, 'source cover has survivors');
  assertCondition(
    successorPrimes.join(',') === '139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,263',
    'unexpected successor prime bucket set',
  );

  const consumedFiniteToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_rank_boundary',
    bucketCount: 22,
    status: 'selected',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_rank_boundary/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_deterministic_rank_boundary_emitted',
    target: 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_buckets_or_emit_rank_boundary',
    sourceAudit: {
      postNext20BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.coverPacket),
        sha256: sha256File(options.coverPacket),
        status: cover.status,
      },
      postNext20BucketQAvoidingBatchCoverAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    boundarySummary: {
      sourcePostNextBucketCount: cover.batchCoverSummary.sourcePostNextBucketCount,
      sourceRowCount,
      sourcePostNextQAvoidingClassCount: bigintToString(sourcePostNextQAvoidingClassCount),
      successorObstructionPrimeBucketCount: buckets.length,
      successorObstructionPrimes: successorPrimes,
      minSuccessorObstructionPrime: successorPrimes[0],
      maxSuccessorObstructionPrime: successorPrimes.at(-1),
      rootResidueCountsPerClass: [2],
      totalSuccessorRootChildCount: bigintToString(successorRootChildCount),
      totalSuccessorQAvoidingClassCount: bigintToString(successorQAvoidingClassCount),
      survivorSourceRowCount: cover.batchCoverSummary.survivorSourceRowCount,
      survivorPostNextQAvoidingClassCount: cover.batchCoverSummary.survivorPostNextQAvoidingClassCount,
    },
    deterministicRankBoundary: {
      consumedFiniteToken: consumedFiniteToken.tokenId,
      producedFiniteTokenCount: buckets.length,
      producedFiniteTokens: buckets,
      measureStatus: 'finite_rank_token_partitioned_not_decreased',
      exactPartition: 'The single 22-bucket successor rank token is partitioned by q in {139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,263}.',
    },
    compressionAudit: {
      verdict: 'exact_boundary_packet_is_the_honest_current_compression',
      sharedInvariant: 'Every stored row in the 22-bucket successor boundary has exactly two roots at its first successor obstruction prime.',
      nonTerminalReason: 'The shared two-root law emits rank children and a still larger q-avoiding boundary; it does not prove terminal closure of those children.',
      noStrongerUniformTheoremThisTurn: 'The buckets mix previous post-next, next-prime, and later-prime supports unevenly, so this packet records the exact finite partition and hands off a whole-boundary q-avoiding batch cover instead of claiming one closed terminal family.',
    },
    finiteTokenTransition: {
      consumedFiniteToken: {
        ...consumedFiniteToken,
        status: 'consumed_by_deterministic_22_bucket_successor_rank_boundary',
      },
      emittedRankBoundaryTokenCount: buckets.length,
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_root_children',
          successorObstructionPrimeBucketCount: buckets.length,
          rootChildCount: bigintToString(successorRootChildCount),
          status: 'root_children_open_not_descended',
        },
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover',
          successorObstructionPrimeBucketCount: buckets.length,
          qAvoidingClassCount: bigintToString(successorQAvoidingClassCount),
          status: 'selected_for_whole_boundary_batch_cover',
        },
      ],
      nextFiniteToken: {
        tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover',
        bucketCount: buckets.length,
        qAvoidingClassCount: bigintToString(successorQAvoidingClassCount),
        status: 'selected',
      },
    },
    successorPrimeBuckets: buckets,
    proofBoundary: 'This packet accounts for every successor bucket emitted by the 20-bucket post-next q-avoiding batch cover and turns the 22-bucket surface into an exact deterministic ranked boundary. It does not close the 5,893,620,911,417,283,150,794,622 successor root children, the 111,172,518,226,866,898,571,161,320,153 successor q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover_or_emit_boundary',
      action: 'Run a whole-boundary q-avoiding batch cover over all 22 successor buckets, or emit an exact survivor/rank boundary if the batch cover does not close.',
      coveredFamily: 'All 111,172,518,226,866,898,571,161,320,153 successor q-avoiding classes across q in {139,149,151,157,163,167,173,179,181,191,193,197,199,211,223,227,229,233,239,241,251,263}.',
      finiteDenominatorOrRankToken: 'Finite token p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover.',
      failureBoundary: 'If no whole-boundary cover exists, write the deterministic survivor boundary grouped by successor prime and previous post-next/next/later-prime support; do not open a singleton q-child first.',
      completionRule: 'Every one of the 22 successor q-avoiding buckets is covered, structurally decomposed, or listed in a deterministic exact survivor boundary before singleton descent.',
    },
    recommendedNextAction: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover_or_emit_boundary',
    nextTheoremMove: 'Use the deterministic 22-bucket successor rank boundary to run one whole-boundary q-avoiding batch cover; singleton q139/q149/etc. descent remains blocked until a later packet consumes a smaller finite token.',
    claims: {
      consumesPost20BucketQAvoiding22BucketSuccessorRankToken: true,
      accountsForAll22SuccessorBuckets: true,
      allRowsHaveTwoSuccessorRoots: true,
      emitsExactDeterministic22BucketRankBoundary: true,
      selectsWholeBoundaryBatchCoverNext: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ139Singleton: false,
      descendsIntoQ149Singleton: false,
      descendsIntoSingletonQChild: false,
      provesSuccessorRootChildrenClosed: false,
      provesSuccessorQAvoidingBoundaryClosed: false,
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
  lines.push('# P848 P4217 later-prime 15-bucket next-prime 17-bucket post-next 20-bucket successor 22-bucket rank boundary');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source post-next buckets: ${packet.boundarySummary.sourcePostNextBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.boundarySummary.sourceRowCount}`);
  lines.push(`- Source post-next q-avoiding classes accounted: ${packet.boundarySummary.sourcePostNextQAvoidingClassCount}`);
  lines.push(`- Successor buckets: ${packet.boundarySummary.successorObstructionPrimeBucketCount}`);
  lines.push(`- Successor primes: ${packet.boundarySummary.successorObstructionPrimes.join(', ')}`);
  lines.push(`- Successor root children emitted: ${packet.boundarySummary.totalSuccessorRootChildCount}`);
  lines.push(`- Successor q-avoiding classes emitted: ${packet.boundarySummary.totalSuccessorQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.boundarySummary.survivorSourceRowCount}`);
  lines.push(`- Survivor post-next q-avoiding classes: ${packet.boundarySummary.survivorPostNextQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Boundary Buckets');
  lines.push('');
  for (const bucket of packet.successorPrimeBuckets) {
    lines.push(`- q${bucket.successorObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourcePostNextQAvoidingClassCount} source post-next q-avoiding classes, ${bucket.successorRootChildCount} successor root children, ${bucket.successorQAvoidingClassCount} successor q-avoiding classes.`);
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
