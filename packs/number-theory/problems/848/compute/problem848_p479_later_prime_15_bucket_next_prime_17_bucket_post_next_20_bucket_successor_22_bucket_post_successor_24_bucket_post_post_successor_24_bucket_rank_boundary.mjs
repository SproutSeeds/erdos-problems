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
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_RANK_BOUNDARY_PACKET.md',
);

const EXPECTED_PRIMES = [
  151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211,
  223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 283,
];
const TARGET =
  'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_buckets_or_emit_rank_boundary';
const NEXT_ACTION =
  'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary';
const NEXT_TOKEN =
  'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover';

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
    sourcePostSuccessorQAvoidingClassCount: 0n,
  };
  current.sourceRowCount += 1;
  current.sourcePostSuccessorQAvoidingClassCount += toBigInt(
    row.sourcePostSuccessorQAvoidingClassCount,
    'sourcePostSuccessorQAvoidingClassCount',
  );
  map.set(prime, current);
}

function normalizePreviousBuckets(map) {
  return [...map.values()]
    .sort((left, right) => Object.values(left)[0] - Object.values(right)[0])
    .map((bucket) => ({
      ...bucket,
      sourcePostSuccessorQAvoidingClassCount: asString(bucket.sourcePostSuccessorQAvoidingClassCount),
    }));
}

function validateRow(row) {
  const postSuccessorPrime = Number(row.postSuccessorObstructionPrime);
  const postPostPrime = Number(row.postPostSuccessorObstructionPrime);
  const postPostSquare = postPostPrime * postPostPrime;
  const sourceCount = toBigInt(
    row.sourcePostSuccessorQAvoidingClassCount,
    'sourcePostSuccessorQAvoidingClassCount',
  );
  const rootCount = Number(row.postPostSuccessorRootResidueCount);

  assertCondition(Number.isInteger(postSuccessorPrime), 'missing post-successor obstruction prime');
  assertCondition(Number.isInteger(postPostPrime), 'missing post-post-successor obstruction prime');
  assertCondition(postPostPrime > postSuccessorPrime, `post-post-successor q${postPostPrime} does not advance past q${postSuccessorPrime}`);
  assertCondition(Number(row.postPostSuccessorObstructionSquare) === postPostSquare, `post-post-successor square mismatch for q${postPostPrime}`);
  assertCondition(rootCount === 2, `expected exactly two post-post-successor roots for q${postPostPrime}`);
  assertCondition(Array.isArray(row.postPostSuccessorRootResidues) && row.postPostSuccessorRootResidues.length === 2, `post-post-successor root list mismatch for q${postPostPrime}`);
  assertCondition(
    toBigInt(row.postPostSuccessorRootChildCount, 'postPostSuccessorRootChildCount') === sourceCount * BigInt(rootCount),
    `post-post-successor root-child count mismatch for q${postPostPrime}`,
  );
  assertCondition(
    toBigInt(row.postPostSuccessorQAvoidingClassCount, 'postPostSuccessorQAvoidingClassCount') === sourceCount * (BigInt(postPostSquare) - BigInt(rootCount)),
    `post-post-successor q-avoiding count mismatch for q${postPostPrime}`,
  );
}

function buildBuckets(rows, coverBuckets) {
  const coverBucketByPrime = new Map(
    coverBuckets.map((bucket) => [Number(bucket.postPostSuccessorObstructionPrime), bucket]),
  );
  const groups = new Map();

  for (const row of rows) {
    validateRow(row);
    const prime = Number(row.postPostSuccessorObstructionPrime);
    const current = groups.get(prime) ?? {
      sourceRows: [],
      previousPostSuccessorPrimeBuckets: new Map(),
      previousSuccessorPrimeBuckets: new Map(),
      previousPostNextPrimeBuckets: new Map(),
      previousNextPrimeBuckets: new Map(),
      previousLaterPrimeBuckets: new Map(),
    };
    current.sourceRows.push(row);
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
      const sourceCount = sumBigInt(rowsInBucket, 'sourcePostSuccessorQAvoidingClassCount');
      const rootChildCount = sumBigInt(rowsInBucket, 'postPostSuccessorRootChildCount');
      const qAvoidingCount = sumBigInt(rowsInBucket, 'postPostSuccessorQAvoidingClassCount');
      const coverBucket = coverBucketByPrime.get(prime);

      assertCondition(Boolean(coverBucket), `missing post-post-successor cover bucket q${prime}`);
      assertCondition(coverBucket.sourceRowCount === sourceRowCount, `source row count mismatch for q${prime}`);
      compareBigInt(sourceCount, coverBucket.sourcePostSuccessorQAvoidingClassCount, `source count mismatch for q${prime}`);
      compareBigInt(rootChildCount, coverBucket.postPostSuccessorRootChildCount, `root-child count mismatch for q${prime}`);
      compareBigInt(qAvoidingCount, coverBucket.postPostSuccessorQAvoidingClassCount, `q-avoiding count mismatch for q${prime}`);

      return {
        tokenId: `p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_q${prime}_rank_boundary`,
        postPostSuccessorObstructionPrime: prime,
        postPostSuccessorObstructionSquare: prime * prime,
        sourceRowCount,
        sourcePostSuccessorQAvoidingClassCount: asString(sourceCount),
        rootResidueCountsPerClass: [2],
        postPostSuccessorRootChildCount: asString(rootChildCount),
        postPostSuccessorQAvoidingClassCount: asString(qAvoidingCount),
        previousPostSuccessorPrimeBuckets: normalizePreviousBuckets(group.previousPostSuccessorPrimeBuckets),
        previousSuccessorPrimeBuckets: normalizePreviousBuckets(group.previousSuccessorPrimeBuckets),
        previousPostNextPrimeBuckets: normalizePreviousBuckets(group.previousPostNextPrimeBuckets),
        previousNextPrimeBuckets: normalizePreviousBuckets(group.previousNextPrimeBuckets),
        previousLaterPrimeBuckets: normalizePreviousBuckets(group.previousLaterPrimeBuckets),
        status: 'open_exact_two_root_post_post_successor_rank_boundary',
        proofObligation: 'Cover this bucket only as part of the whole 24-bucket post-post-successor q-avoiding batch/rank action, or emit a sharper exact subboundary. This token does not authorize singleton q-child descent by itself.',
      };
    });
}

function buildPacket(options) {
  const cover = readJson(options.coverPacket);
  const assembly = readJson(options.assemblyPacket);
  const rows = cover.rowClassifications ?? [];
  const coverBuckets = cover.postPostSuccessorObstructionPrimeBuckets ?? [];

  assertCondition(cover.status === 'all_24_bucket_post_successor_q_avoiding_classes_have_later_square_obstruction_child', 'cover packet status mismatch');
  assertCondition(
    assembly.status === 'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover_convergence_assembly_selects_24_bucket_post_post_successor_rank_compression',
    'assembly packet status mismatch',
  );
  assertCondition(assembly.recommendedNextAction === TARGET, 'assembly selected action mismatch');
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 source row classifications');
  assertCondition(Array.isArray(coverBuckets) && coverBuckets.length === 24, 'expected 24 post-post-successor cover buckets');

  const buckets = buildBuckets(rows, coverBuckets);
  const primes = buckets.map((bucket) => bucket.postPostSuccessorObstructionPrime);
  const sourceRowCount = buckets.reduce((sum, bucket) => sum + bucket.sourceRowCount, 0);
  const sourceCount = sumBigInt(buckets, 'sourcePostSuccessorQAvoidingClassCount');
  const rootChildCount = sumBigInt(buckets, 'postPostSuccessorRootChildCount');
  const qAvoidingCount = sumBigInt(buckets, 'postPostSuccessorQAvoidingClassCount');

  assertCondition(primes.join(',') === EXPECTED_PRIMES.join(','), 'unexpected post-post-successor prime bucket set');
  assertCondition(sourceRowCount === cover.batchCoverSummary?.sourceRowCount, 'total source row count mismatch');
  compareBigInt(sourceCount, cover.batchCoverSummary?.sourcePostSuccessorQAvoidingClassCount, 'total source post-successor q-avoiding count mismatch');
  compareBigInt(rootChildCount, cover.batchCoverSummary?.totalPostPostSuccessorRootChildCount, 'total post-post-successor root-child count mismatch');
  compareBigInt(qAvoidingCount, cover.batchCoverSummary?.totalPostPostSuccessorQAvoidingClassCount, 'total post-post-successor q-avoiding count mismatch');
  compareBigInt(cover.batchCoverSummary?.survivorPostSuccessorQAvoidingClassCount, 0n, 'source cover has survivors');

  const consumedFiniteToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_rank_boundary',
    bucketCount: 24,
    postPostSuccessorRootChildCount: asString(rootChildCount),
    postPostSuccessorQAvoidingClassCount: asString(qAvoidingCount),
    status: 'selected_for_compression_structural_decomposition_impossibility_or_exact_rank_boundary',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_rank_boundary/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_deterministic_rank_boundary_emitted',
    target: TARGET,
    sourceAudit: {
      postSuccessor24BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.coverPacket),
        sha256: sha256File(options.coverPacket),
        status: cover.status,
      },
      postSuccessor24BucketQAvoidingBatchCoverConvergenceAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    boundarySummary: {
      sourcePostSuccessorBucketCount: cover.batchCoverSummary.sourcePostSuccessorBucketCount,
      sourceRowCount,
      sourcePostSuccessorQAvoidingClassCount: asString(sourceCount),
      postPostSuccessorObstructionPrimeBucketCount: buckets.length,
      postPostSuccessorObstructionPrimes: primes,
      minPostPostSuccessorObstructionPrime: primes[0],
      maxPostPostSuccessorObstructionPrime: primes.at(-1),
      rootResidueCountsPerClass: [2],
      totalPostPostSuccessorRootChildCount: asString(rootChildCount),
      totalPostPostSuccessorQAvoidingClassCount: asString(qAvoidingCount),
      survivorSourceRowCount: cover.batchCoverSummary.survivorSourceRowCount,
      survivorPostSuccessorQAvoidingClassCount: cover.batchCoverSummary.survivorPostSuccessorQAvoidingClassCount,
    },
    deterministicRankBoundary: {
      consumedFiniteToken: consumedFiniteToken.tokenId,
      producedFiniteTokenCount: buckets.length,
      producedFiniteTokens: buckets,
      measureStatus: 'finite_rank_token_partitioned_not_decreased',
      exactPartition: `The single 24-bucket post-post-successor rank token is partitioned by q in {${primes.join(',')}}.`,
    },
    compressionAudit: {
      verdict: 'exact_boundary_packet_is_the_honest_current_compression',
      sharedInvariant: 'Every stored row in the 24-bucket post-post-successor boundary has exactly two roots at its first post-post-successor obstruction prime.',
      nonTerminalReason: 'The shared two-root law emits rank children and a still larger q-avoiding boundary; it does not prove terminal closure of those children.',
      noStrongerUniformTheoremThisTurn: 'The buckets mix previous post-successor, successor, post-next, next-prime, and later-prime supports unevenly, so this packet records the exact finite partition and hands off a whole-boundary q-avoiding batch cover instead of claiming one closed terminal family.',
    },
    finiteTokenTransition: {
      consumedFiniteToken: {
        ...consumedFiniteToken,
        status: 'consumed_by_deterministic_24_bucket_post_post_successor_rank_boundary',
      },
      emittedRankBoundaryTokenCount: buckets.length,
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_root_children',
          postPostSuccessorObstructionPrimeBucketCount: buckets.length,
          rootChildCount: asString(rootChildCount),
          status: 'root_children_open_not_descended',
        },
        {
          tokenId: NEXT_TOKEN,
          postPostSuccessorObstructionPrimeBucketCount: buckets.length,
          qAvoidingClassCount: asString(qAvoidingCount),
          status: 'selected_for_whole_boundary_batch_cover',
        },
      ],
      nextFiniteToken: {
        tokenId: NEXT_TOKEN,
        bucketCount: buckets.length,
        qAvoidingClassCount: asString(qAvoidingCount),
        status: 'selected',
      },
    },
    postPostSuccessorPrimeBuckets: buckets,
    proofBoundary: 'This packet accounts for every post-post-successor bucket emitted by the 24-bucket post-successor q-avoiding batch cover and turns the 24-bucket surface into an exact deterministic ranked boundary. It does not close the 10,116,798,228,285,161,845,761,144,391,751,934 post-post-successor root children, the 272,895,494,027,351,286,884,102,031,165,661,158,393 post-post-successor q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Run a whole-boundary q-avoiding batch cover over all 24 post-post-successor buckets, or emit an exact survivor/rank boundary if the batch cover does not close.',
      coveredFamily: `All ${asString(qAvoidingCount)} post-post-successor q-avoiding classes across q in {${primes.join(',')}}.`,
      finiteDenominatorOrRankToken: `Finite token ${NEXT_TOKEN}.`,
      failureBoundary: 'If no whole-boundary cover exists, write the deterministic survivor boundary grouped by post-post-successor prime and previous post-successor/successor/post-next/next/later-prime support; do not open a singleton q-child first.',
      completionRule: 'Every one of the 24 post-post-successor q-avoiding buckets is covered, structurally decomposed, or listed in a deterministic exact survivor boundary before singleton descent.',
    },
    recommendedNextAction: NEXT_ACTION,
    nextTheoremMove: 'Use the deterministic 24-bucket post-post-successor rank boundary to run one whole-boundary q-avoiding batch cover; singleton q151/q157/etc. descent remains blocked until a later packet consumes a smaller finite token.',
    claims: {
      consumesPostSuccessor24BucketQAvoidingCoverAssemblyRankToken: true,
      accountsForAll24PostPostSuccessorBuckets: true,
      allRowsHaveTwoPostPostSuccessorRoots: true,
      emitsExactDeterministic24BucketPostPostSuccessorRankBoundary: true,
      selectsWholeBoundaryBatchCoverNext: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ151Singleton: false,
      descendsIntoQ157Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostPostSuccessorRootChildrenClosed: false,
      provesPostPostSuccessorQAvoidingBoundaryClosed: false,
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
  lines.push('# P848 P4217 post-post-successor 24-bucket rank boundary');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source post-successor buckets: ${packet.boundarySummary.sourcePostSuccessorBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.boundarySummary.sourceRowCount}`);
  lines.push(`- Source post-successor q-avoiding classes accounted: ${packet.boundarySummary.sourcePostSuccessorQAvoidingClassCount}`);
  lines.push(`- Post-post-successor buckets: ${packet.boundarySummary.postPostSuccessorObstructionPrimeBucketCount}`);
  lines.push(`- Post-post-successor primes: ${packet.boundarySummary.postPostSuccessorObstructionPrimes.join(', ')}`);
  lines.push(`- Post-post-successor root children emitted: ${packet.boundarySummary.totalPostPostSuccessorRootChildCount}`);
  lines.push(`- Post-post-successor q-avoiding classes emitted: ${packet.boundarySummary.totalPostPostSuccessorQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.boundarySummary.survivorSourceRowCount}`);
  lines.push(`- Survivor post-successor q-avoiding classes: ${packet.boundarySummary.survivorPostSuccessorQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Boundary Buckets');
  lines.push('');
  for (const bucket of packet.postPostSuccessorPrimeBuckets) {
    lines.push(`- q${bucket.postPostSuccessorObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourcePostSuccessorQAvoidingClassCount} source post-successor q-avoiding classes, ${bucket.postPostSuccessorRootChildCount} post-post-successor root children, ${bucket.postPostSuccessorQAvoidingClassCount} post-post-successor q-avoiding classes.`);
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
