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
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_LATER_PRIME_15_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_RANK_BOUNDARY_PACKET.md',
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
  } catch (error) {
    throw new Error(`Invalid BigInt value for ${label}: ${value}`);
  }
}

function bigintToString(value) {
  return value.toString();
}

function addBigIntMap(map, key, amount) {
  map.set(key, (map.get(key) ?? 0n) + amount);
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

function addPreviousLaterPrimeBucket(summary, row) {
  const previousLaterPrime = Number(row.laterObstructionPrime);
  const current = summary.get(previousLaterPrime) ?? {
    sourceRowCount: 0,
    sourceLaterQAvoidingClassCount: 0n,
  };
  current.sourceRowCount += 1;
  current.sourceLaterQAvoidingClassCount += toBigInt(
    row.sourceLaterQAvoidingClassCount,
    'sourceLaterQAvoidingClassCount',
  );
  summary.set(previousLaterPrime, current);
}

function normalizePreviousLaterPrimeBuckets(summary) {
  return summarizeMap(summary, 'previousLaterObstructionPrime').map((bucket) => ({
    ...bucket,
    sourceLaterQAvoidingClassCount: bigintToString(bucket.sourceLaterQAvoidingClassCount),
  }));
}

function validateRow(row) {
  const previousLaterPrime = Number(row.laterObstructionPrime);
  const previousLaterSquare = previousLaterPrime * previousLaterPrime;
  const nextPrime = Number(row.nextObstructionPrime);
  const nextSquare = nextPrime * nextPrime;
  const sourceLaterQAvoidingClassCount = toBigInt(
    row.sourceLaterQAvoidingClassCount,
    'sourceLaterQAvoidingClassCount',
  );
  const rootCount = Number(row.nextRootResidueCount);

  assertCondition(Number.isInteger(previousLaterPrime), 'missing previous later obstruction prime');
  assertCondition(Number(row.laterObstructionSquare) === previousLaterSquare, `previous later square mismatch for q${previousLaterPrime}`);
  assertCondition(Number.isInteger(nextPrime), 'missing next obstruction prime');
  assertCondition(nextPrime > previousLaterPrime, `next prime q${nextPrime} does not advance past previous later q${previousLaterPrime}`);
  assertCondition(Number(row.nextObstructionSquare) === nextSquare, `next square mismatch for q${nextPrime}`);
  assertCondition(rootCount === 2, `expected exactly two next roots for q${nextPrime}`);
  assertCondition(Array.isArray(row.nextRootResidues) && row.nextRootResidues.length === 2, `next root residue list mismatch for q${nextPrime}`);
  assertCondition(
    toBigInt(row.nextRootChildCount, 'nextRootChildCount') === sourceLaterQAvoidingClassCount * BigInt(rootCount),
    `next root-child count mismatch for q${nextPrime}`,
  );
  assertCondition(
    toBigInt(row.nextQAvoidingClassCount, 'nextQAvoidingClassCount') === sourceLaterQAvoidingClassCount * (BigInt(nextSquare) - BigInt(rootCount)),
    `next q-avoiding count mismatch for q${nextPrime}`,
  );
}

function compareBigInt(actual, expected, message) {
  assertCondition(toBigInt(actual, message) === toBigInt(expected, message), message);
}

function buildBuckets(rows, coverBuckets) {
  const groups = new Map();
  for (const row of rows) {
    validateRow(row);
    const nextPrime = Number(row.nextObstructionPrime);
    const current = groups.get(nextPrime) ?? {
      sourceRows: [],
      previousLaterPrimeBuckets: new Map(),
    };
    current.sourceRows.push(row);
    addPreviousLaterPrimeBucket(current.previousLaterPrimeBuckets, row);
    groups.set(nextPrime, current);
  }

  const coverBucketByPrime = new Map(coverBuckets.map((bucket) => [Number(bucket.nextObstructionPrime), bucket]));

  return summarizeMap(groups, 'nextObstructionPrime').map((group) => {
    const nextPrime = group.nextObstructionPrime;
    const rowsInBucket = group.sourceRows;
    const sourceRowCount = rowsInBucket.length;
    const sourceLaterQAvoidingClassCount = sumBigIntBy(rowsInBucket, 'sourceLaterQAvoidingClassCount');
    const nextRootChildCount = sumBigIntBy(rowsInBucket, 'nextRootChildCount');
    const nextQAvoidingClassCount = sumBigIntBy(rowsInBucket, 'nextQAvoidingClassCount');
    const coverBucket = coverBucketByPrime.get(nextPrime);

    assertCondition(Boolean(coverBucket), `missing source cover bucket for q${nextPrime}`);
    assertCondition(coverBucket.sourceRowCount === sourceRowCount, `source row count mismatch for q${nextPrime}`);
    compareBigInt(sourceLaterQAvoidingClassCount, coverBucket.sourceLaterQAvoidingClassCount, `source later q-avoiding count mismatch for q${nextPrime}`);
    compareBigInt(nextRootChildCount, coverBucket.nextRootChildCount, `next root-child count mismatch for q${nextPrime}`);
    compareBigInt(nextQAvoidingClassCount, coverBucket.nextQAvoidingClassCount, `next q-avoiding count mismatch for q${nextPrime}`);

    return {
      tokenId: `p443_q97_p479_later_prime_15_bucket_next_prime_q${nextPrime}_rank_boundary`,
      nextObstructionPrime: nextPrime,
      nextObstructionSquare: nextPrime * nextPrime,
      sourceRowCount,
      sourceLaterQAvoidingClassCount: bigintToString(sourceLaterQAvoidingClassCount),
      rootResidueCountsPerClass: [2],
      nextRootChildCount: bigintToString(nextRootChildCount),
      nextQAvoidingClassCount: bigintToString(nextQAvoidingClassCount),
      previousLaterPrimeBuckets: normalizePreviousLaterPrimeBuckets(group.previousLaterPrimeBuckets),
      status: 'open_exact_two_root_next_prime_rank_boundary',
      proofObligation: 'Cover this bucket as part of the whole 17-bucket q-avoiding batch/rank action, or emit a sharper exact subboundary. This token does not authorize singleton q-child descent by itself.',
    };
  });
}

function buildPacket(options) {
  const cover = readJson(options.coverPacket);
  const assembly = readJson(options.assemblyPacket);
  const rows = cover.rowClassifications ?? [];
  const coverBuckets = cover.nextObstructionPrimeBuckets ?? [];

  assertCondition(cover.status === 'all_15_bucket_later_prime_q_avoiding_classes_have_next_square_obstruction_child', 'cover packet status mismatch');
  assertCondition(assembly.status === 'post_later_prime_15_bucket_q_avoiding_batch_cover_convergence_assembly_selects_17_bucket_rank_compression', 'assembly packet status mismatch');
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 source row classifications');
  assertCondition(Array.isArray(coverBuckets) && coverBuckets.length === 17, 'expected 17 next-prime cover buckets');

  const buckets = buildBuckets(rows, coverBuckets);
  const sourceRowCount = buckets.reduce((sum, bucket) => sum + bucket.sourceRowCount, 0);
  const sourceLaterQAvoidingClassCount = sumBigIntBy(buckets, 'sourceLaterQAvoidingClassCount');
  const nextRootChildCount = sumBigIntBy(buckets, 'nextRootChildCount');
  const nextQAvoidingClassCount = sumBigIntBy(buckets, 'nextQAvoidingClassCount');
  const nextPrimes = buckets.map((bucket) => bucket.nextObstructionPrime);

  assertCondition(sourceRowCount === cover.batchCoverSummary?.sourceRowCount, 'total source row count mismatch');
  compareBigInt(sourceLaterQAvoidingClassCount, cover.batchCoverSummary?.sourceLaterQAvoidingClassCount, 'total source later q-avoiding count mismatch');
  compareBigInt(nextRootChildCount, cover.batchCoverSummary?.totalNextRootChildCount, 'total next root-child count mismatch');
  compareBigInt(nextQAvoidingClassCount, cover.batchCoverSummary?.totalNextQAvoidingClassCount, 'total next q-avoiding count mismatch');
  compareBigInt(cover.batchCoverSummary?.survivorLaterQAvoidingClassCount, 0n, 'source cover has survivors');
  assertCondition(
    nextPrimes.join(',') === '131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223',
    'unexpected next-prime bucket set',
  );

  const consumedFiniteToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_rank_boundary',
    bucketCount: 17,
    status: 'selected',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_rank_boundary/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'p479_later_prime_15_bucket_next_prime_17_bucket_deterministic_rank_boundary_emitted',
    target: 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_buckets_or_emit_rank_boundary',
    sourceAudit: {
      laterPrime15BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.coverPacket),
        sha256: sha256File(options.coverPacket),
        status: cover.status,
      },
      postLaterPrime15BucketQAvoidingBatchCoverAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    boundarySummary: {
      sourceLaterPrimeBucketCount: cover.batchCoverSummary.sourceLaterPrimeBucketCount,
      sourceRowCount,
      sourceLaterQAvoidingClassCount: bigintToString(sourceLaterQAvoidingClassCount),
      nextObstructionPrimeBucketCount: buckets.length,
      nextObstructionPrimes: nextPrimes,
      minNextObstructionPrime: nextPrimes[0],
      maxNextObstructionPrime: nextPrimes.at(-1),
      rootResidueCountsPerClass: [2],
      totalNextRootChildCount: bigintToString(nextRootChildCount),
      totalNextQAvoidingClassCount: bigintToString(nextQAvoidingClassCount),
      survivorSourceRowCount: cover.batchCoverSummary.survivorSourceRowCount,
      survivorLaterQAvoidingClassCount: cover.batchCoverSummary.survivorLaterQAvoidingClassCount,
    },
    deterministicRankBoundary: {
      consumedFiniteToken: consumedFiniteToken.tokenId,
      producedFiniteTokenCount: buckets.length,
      producedFiniteTokens: buckets,
      measureStatus: 'finite_rank_token_partitioned_not_decreased',
      exactPartition: 'The single 17-bucket next-prime rank token is partitioned by q in {131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223}.',
    },
    compressionAudit: {
      verdict: 'exact_boundary_packet_is_the_honest_current_compression',
      sharedInvariant: 'Every stored row in the 17-bucket next-prime boundary has exactly two roots at its first next obstruction prime.',
      nonTerminalReason: 'The shared two-root law emits rank children and a very large q-avoiding boundary; it does not prove terminal closure of those children.',
      noStrongerUniformTheoremThisTurn: 'The buckets mix previous later-prime supports unevenly, so this packet records the exact finite partition and hands off a whole-boundary q-avoiding batch cover instead of claiming one closed terminal family.',
    },
    finiteTokenTransition: {
      consumedFiniteToken: {
        ...consumedFiniteToken,
        status: 'consumed_by_deterministic_17_bucket_rank_boundary',
      },
      emittedRankBoundaryTokenCount: buckets.length,
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_root_children',
          nextObstructionPrimeBucketCount: buckets.length,
          rootChildCount: bigintToString(nextRootChildCount),
          status: 'root_children_open_not_descended',
        },
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover',
          nextObstructionPrimeBucketCount: buckets.length,
          qAvoidingClassCount: bigintToString(nextQAvoidingClassCount),
          status: 'selected_for_whole_boundary_batch_cover',
        },
      ],
      nextFiniteToken: {
        tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover',
        bucketCount: buckets.length,
        qAvoidingClassCount: bigintToString(nextQAvoidingClassCount),
        status: 'selected',
      },
    },
    nextPrimeBuckets: buckets,
    proofBoundary: 'This packet accounts for every next-prime bucket emitted by the later-prime 15-bucket q-avoiding batch cover and turns the 17-bucket surface into an exact deterministic ranked boundary. It does not close the 7,304,500,395,952,302 next root children, the 94,524,741,190,958,970,657 next q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_or_emit_boundary',
      action: 'Run a whole-boundary q-avoiding batch cover over all 17 next-prime buckets, or emit an exact survivor/rank boundary if the batch cover does not close.',
      coveredFamily: 'All 94,524,741,190,958,970,657 next q-avoiding classes across q in {131,137,139,149,151,157,163,167,173,179,181,191,193,197,199,211,223}.',
      finiteDenominatorOrRankToken: 'Finite token p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover.',
      failureBoundary: 'If no whole-boundary cover exists, write the deterministic survivor boundary grouped by next prime and previous later-prime support; do not open a singleton q-child first.',
      completionRule: 'Every one of the 17 next-prime q-avoiding buckets is covered, structurally decomposed, or listed in a deterministic exact survivor boundary before singleton descent.',
    },
    recommendedNextAction: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_or_emit_boundary',
    nextTheoremMove: 'Use the deterministic 17-bucket rank boundary to run one whole-boundary q-avoiding batch cover; singleton q131/q137/etc. descent remains blocked until a later packet consumes a smaller finite token.',
    claims: {
      consumesPostLaterPrime15BucketNextPrime17BucketRankToken: true,
      accountsForAll17NextPrimeBuckets: true,
      allRowsHaveTwoNextRoots: true,
      emitsExactDeterministic17BucketRankBoundary: true,
      selectsWholeBoundaryBatchCoverNext: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ131Singleton: false,
      descendsIntoQ137Singleton: false,
      descendsIntoSingletonQChild: false,
      provesNextRootChildrenClosed: false,
      provesNextQAvoidingBoundaryClosed: false,
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
  lines.push('# P848 P4217 later-prime 15-bucket next-prime 17-bucket rank boundary');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source rows accounted: ${packet.boundarySummary.sourceRowCount}`);
  lines.push(`- Source later q-avoiding classes accounted: ${packet.boundarySummary.sourceLaterQAvoidingClassCount}`);
  lines.push(`- Next-prime buckets: ${packet.boundarySummary.nextObstructionPrimeBucketCount}`);
  lines.push(`- Next primes: ${packet.boundarySummary.nextObstructionPrimes.join(', ')}`);
  lines.push(`- Next root children emitted: ${packet.boundarySummary.totalNextRootChildCount}`);
  lines.push(`- Next q-avoiding classes emitted: ${packet.boundarySummary.totalNextQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.boundarySummary.survivorSourceRowCount}`);
  lines.push(`- Survivor later q-avoiding classes: ${packet.boundarySummary.survivorLaterQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Boundary Buckets');
  lines.push('');
  for (const bucket of packet.nextPrimeBuckets) {
    lines.push(`- q${bucket.nextObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourceLaterQAvoidingClassCount} source later q-avoiding classes, ${bucket.nextRootChildCount} next root children, ${bucket.nextQAvoidingClassCount} next q-avoiding classes.`);
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
