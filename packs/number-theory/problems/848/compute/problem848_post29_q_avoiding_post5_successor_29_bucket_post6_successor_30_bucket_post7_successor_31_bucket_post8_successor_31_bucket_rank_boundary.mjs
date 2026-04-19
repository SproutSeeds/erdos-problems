#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const SOURCE_LAYER = 'postPostPostPostPostPostPostSuccessor';
const SOURCE_LAYER_CAP = 'PostPostPostPostPostPostPostSuccessor';
const TARGET_LAYER = 'postPostPostPostPostPostPostPostSuccessor';
const TARGET_LAYER_CAP = 'PostPostPostPostPostPostPostPostSuccessor';

const DEFAULT_COVER_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_POST_POST_POST_POST_POST_POST_POST_SUCCESSOR_31_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_POST_POST_POST_POST_POST_POST_POST_SUCCESSOR_31_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_RANK_BOUNDARY_PACKET.md',
);

const EXPECTED_PRIMES = [
  191, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269,
  271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353,
  359, 367, 383,
];
const TARGET = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_31_buckets_or_emit_rank_boundary';
const NEXT_ACTION = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary';
const NEXT_Q_COVER_ACTION = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_31_bucket_q_avoiding_batch_cover_or_emit_boundary';
const NEXT_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_q_avoiding_batch_cover';

const sourceCountKey = `source${SOURCE_LAYER_CAP}QAvoidingClassCount`;
const sourceBucketCountKey = `source${SOURCE_LAYER_CAP}BucketCount`;
const sourcePrimeKey = `${SOURCE_LAYER}ObstructionPrime`;
const targetPrimeKey = `${TARGET_LAYER}ObstructionPrime`;
const targetSquareKey = `${TARGET_LAYER}ObstructionSquare`;
const targetRootCountKey = `${TARGET_LAYER}RootResidueCount`;
const targetRootResiduesKey = `${TARGET_LAYER}RootResidues`;
const targetRootChildCountKey = `${TARGET_LAYER}RootChildCount`;
const targetQAvoidingClassCountKey = `${TARGET_LAYER}QAvoidingClassCount`;
const targetBucketsKey = `${TARGET_LAYER}ObstructionPrimeBuckets`;
const targetBucketCountKey = `${TARGET_LAYER}ObstructionPrimeBucketCount`;
const targetPrimeListKey = `${TARGET_LAYER}ObstructionPrimes`;
const targetMinPrimeKey = `min${TARGET_LAYER_CAP}ObstructionPrime`;
const targetMaxPrimeKey = `max${TARGET_LAYER_CAP}ObstructionPrime`;
const targetTotalRootChildCountKey = `total${TARGET_LAYER_CAP}RootChildCount`;
const targetTotalQAvoidingClassCountKey = `total${TARGET_LAYER_CAP}QAvoidingClassCount`;
const survivorSourceCountKey = `survivor${SOURCE_LAYER_CAP}QAvoidingClassCount`;

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

function supportDiversity(buckets, key) {
  const sizes = buckets.map((bucket) => bucket[key]?.length ?? 0);
  return {
    min: Math.min(...sizes),
    max: Math.max(...sizes),
    distinctSizes: [...new Set(sizes)].sort((left, right) => left - right),
  };
}

function validateRow(row) {
  const priorPrime = Number(row[sourcePrimeKey]);
  const prime = Number(row[targetPrimeKey]);
  const square = prime * prime;
  const sourceCount = toBigInt(row[sourceCountKey], sourceCountKey);
  const rootCount = Number(row[targetRootCountKey]);

  assertCondition(Number.isInteger(priorPrime), `missing ${SOURCE_LAYER} obstruction prime`);
  assertCondition(Number.isInteger(prime), `missing ${TARGET_LAYER} obstruction prime`);
  assertCondition(prime > priorPrime, `q${prime} does not advance past q${priorPrime}`);
  assertCondition(Number(row[targetSquareKey]) === square, `square mismatch for q${prime}`);
  assertCondition(rootCount === 2, `expected exactly two ${TARGET_LAYER} roots for q${prime}`);
  assertCondition(Array.isArray(row[targetRootResiduesKey]) && row[targetRootResiduesKey].length === 2, `root list mismatch for q${prime}`);
  assertCondition(
    toBigInt(row[targetRootChildCountKey], targetRootChildCountKey) === sourceCount * BigInt(rootCount),
    `root-child count mismatch for q${prime}`,
  );
  assertCondition(
    toBigInt(row[targetQAvoidingClassCountKey], targetQAvoidingClassCountKey) === sourceCount * (BigInt(square) - BigInt(rootCount)),
    `q-avoiding count mismatch for q${prime}`,
  );
}

function decorateBucket(bucket) {
  const prime = Number(bucket[targetPrimeKey]);
  return {
    tokenId: `p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_q${prime}_rank_boundary`,
    ...bucket,
    status: 'open_exact_two_root_post_post_post_post_post_post_post_post_successor_rank_boundary',
    proofObligation: 'Cover this bucket only as part of a whole 31-bucket post-post-post-post-post-post-post-post-successor assembly/batch/rank action, or emit a sharper exact subboundary. This token does not authorize singleton q-child descent by itself.',
  };
}

function validateBucketAgainstRows(bucket, rows) {
  const prime = Number(bucket[targetPrimeKey]);
  const rowsInBucket = rows.filter((row) => Number(row[targetPrimeKey]) === prime);
  assertCondition(rowsInBucket.length === bucket.sourceRowCount, `source row count mismatch for q${prime}`);
  compareBigInt(
    sumBigInt(rowsInBucket, sourceCountKey),
    bucket[sourceCountKey],
    `source q-avoiding count mismatch for q${prime}`,
  );
  compareBigInt(
    sumBigInt(rowsInBucket, targetRootChildCountKey),
    bucket[targetRootChildCountKey],
    `root-child count mismatch for q${prime}`,
  );
  compareBigInt(
    sumBigInt(rowsInBucket, targetQAvoidingClassCountKey),
    bucket[targetQAvoidingClassCountKey],
    `q-avoiding count mismatch for q${prime}`,
  );
}

function buildPacket(options) {
  const cover = readJson(options.coverPacket);
  const assembly = readJson(options.assemblyPacket);
  const rows = cover.rowClassifications ?? [];
  const sourceBuckets = cover[targetBucketsKey] ?? [];

  assertCondition(cover.status === 'all_31_bucket_post_post_post_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child', 'cover packet status mismatch');
  assertCondition(assembly.status === 'post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_q_avoiding_batch_cover_convergence_assembly_selects_31_bucket_post_post_post_post_post_post_post_post_successor_rank_compression', 'assembly packet status mismatch');
  assertCondition(assembly.recommendedNextAction === TARGET, 'assembly selected action mismatch');
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 source row classifications');
  assertCondition(Array.isArray(sourceBuckets) && sourceBuckets.length === 31, `expected 31 ${TARGET_LAYER} buckets`);

  for (const row of rows) {
    validateRow(row);
  }
  const buckets = sourceBuckets.map(decorateBucket);
  for (const bucket of buckets) {
    validateBucketAgainstRows(bucket, rows);
  }
  const primes = buckets.map((bucket) => Number(bucket[targetPrimeKey]));
  const sourceRowCount = buckets.reduce((sum, bucket) => sum + bucket.sourceRowCount, 0);
  const sourceCount = sumBigInt(buckets, sourceCountKey);
  const rootChildCount = sumBigInt(buckets, targetRootChildCountKey);
  const qAvoidingCount = sumBigInt(buckets, targetQAvoidingClassCountKey);

  assertCondition(primes.join(',') === EXPECTED_PRIMES.join(','), `unexpected ${TARGET_LAYER} prime bucket set`);
  assertCondition(sourceRowCount === cover.batchCoverSummary?.sourceRowCount, 'total source row count mismatch');
  compareBigInt(sourceCount, cover.batchCoverSummary?.[sourceCountKey], 'total source q-avoiding count mismatch');
  compareBigInt(rootChildCount, cover.batchCoverSummary?.[targetTotalRootChildCountKey], 'total root-child count mismatch');
  compareBigInt(qAvoidingCount, cover.batchCoverSummary?.[targetTotalQAvoidingClassCountKey], 'total q-avoiding count mismatch');
  compareBigInt(cover.batchCoverSummary?.[survivorSourceCountKey], 0n, 'source cover has survivors');

  const consumedFiniteToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_rank_boundary',
    bucketCount: 31,
    sourceRowCount,
    [targetRootChildCountKey]: asString(rootChildCount),
    [targetQAvoidingClassCountKey]: asString(qAvoidingCount),
    status: 'selected_for_whole_boundary_rank_compression',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_31_bucket_deterministic_rank_boundary_emitted',
    target: TARGET,
    sourceAudit: {
      post31BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.coverPacket),
        sha256: sha256File(options.coverPacket),
        status: cover.status,
      },
      post31BucketQAvoidingBatchCoverConvergenceAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    boundarySummary: {
      [sourceBucketCountKey]: cover.batchCoverSummary[sourceBucketCountKey],
      sourceRowCount,
      [sourceCountKey]: asString(sourceCount),
      [targetBucketCountKey]: buckets.length,
      [targetPrimeListKey]: primes,
      [targetMinPrimeKey]: primes[0],
      [targetMaxPrimeKey]: primes.at(-1),
      rootResidueCountsPerClass: [2],
      [targetTotalRootChildCountKey]: asString(rootChildCount),
      [targetTotalQAvoidingClassCountKey]: asString(qAvoidingCount),
      survivorSourceRowCount: cover.batchCoverSummary.survivorSourceRowCount,
      [survivorSourceCountKey]: cover.batchCoverSummary[survivorSourceCountKey],
    },
    deterministicRankBoundary: {
      consumedFiniteToken: consumedFiniteToken.tokenId,
      producedFiniteTokenCount: buckets.length,
      producedFiniteTokens: buckets,
      measureStatus: 'finite_rank_token_partitioned_not_decreased',
      exactPartition: `The single 31-bucket ${TARGET_LAYER} rank token is partitioned by q in {${primes.join(',')}}.`,
    },
    compressionAudit: {
      verdict: 'exact_boundary_packet_is_the_honest_current_compression',
      sharedInvariant: `Every stored row in the 31-bucket ${TARGET_LAYER} boundary has exactly two roots at its first ${TARGET_LAYER} obstruction prime.`,
      supportDiversity: {
        sourceRows: {
          min: Math.min(...buckets.map((bucket) => bucket.sourceRowCount)),
          max: Math.max(...buckets.map((bucket) => bucket.sourceRowCount)),
          distinctSizes: [...new Set(buckets.map((bucket) => bucket.sourceRowCount))].sort((left, right) => left - right),
        },
        previousPostPostPostPostPostPostPostSuccessorPrimeBuckets: supportDiversity(buckets, 'previousPostPostPostPostPostPostPostSuccessorPrimeBuckets'),
        previousPostPostPostPostPostSuccessorPrimeBuckets: supportDiversity(buckets, 'previousPostPostPostPostPostSuccessorPrimeBuckets'),
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
      noStrongerUniformTheoremThisTurn: 'The 31 buckets mix source-row counts and previous support profiles unevenly, so this packet records the exact finite partition and hands off convergence assembly instead of claiming one closed terminal family.',
    },
    finiteTokenTransition: {
      consumedFiniteToken: {
        ...consumedFiniteToken,
        status: 'consumed_by_deterministic_31_bucket_post_post_post_post_post_post_post_post_successor_rank_boundary',
      },
      emittedRankBoundaryTokenCount: buckets.length,
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_root_children',
          [targetBucketCountKey]: buckets.length,
          rootChildCount: asString(rootChildCount),
          status: 'root_children_open_not_descended',
        },
        {
          tokenId: NEXT_TOKEN,
          [targetBucketCountKey]: buckets.length,
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
    [`${TARGET_LAYER}PrimeBuckets`]: buckets,
    proofBoundary: `This packet accounts for every ${TARGET_LAYER} bucket emitted by the 31-bucket ${SOURCE_LAYER} q-avoiding batch cover and turns the 31-bucket q191..q383 surface into an exact deterministic ranked boundary. It does not close the ${asString(rootChildCount)} ${TARGET_LAYER} root children, the ${asString(qAvoidingCount)} ${TARGET_LAYER} q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.`,
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Run convergence assembly after the deterministic 31-bucket q191..q383 rank boundary, name the whole q-avoiding cover token, and block q191/q193 singleton descent before another repeated q-cover step.',
      coveredFamily: `All ${asString(qAvoidingCount)} ${TARGET_LAYER} q-avoiding classes across q in {${primes.join(',')}}.`,
      finiteDenominatorOrRankToken: `Finite token ${NEXT_TOKEN}.`,
      failureBoundary: 'If no whole-boundary cover exists after assembly, write the deterministic survivor boundary grouped by post-post-post-post-post-post-post-post-successor prime and previous support; do not open a singleton q-child first.',
      completionRule: 'Assembly consumes the 31-bucket post-post-post-post-post-post-post-post-successor rank-boundary token, names the whole q-avoiding cover, and records one non-singleton next action.',
    },
    recommendedNextAction: NEXT_ACTION,
    nextQCoverActionAfterAssembly: NEXT_Q_COVER_ACTION,
    nextTheoremMove: 'Use the deterministic 31-bucket q191..q383 rank boundary to run convergence assembly before any whole-boundary q-avoiding batch cover; singleton q191/q193/etc. descent remains blocked until a later packet consumes a smaller finite token.',
    claims: {
      consumesPostPostPostPostPostPostPostPostSuccessorQAvoidingAssemblyRankToken: true,
      accountsForAll31PostPostPostPostPostPostPostPostSuccessorBuckets: true,
      allRowsHaveTwoPostPostPostPostPostPostPostPostSuccessorRoots: true,
      emitsExactDeterministic31BucketPostPostPostPostPostPostPostPostSuccessorRankBoundary: true,
      selectsConvergenceAssemblyBeforeWholeBoundaryBatchCover: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ191Singleton: false,
      descendsIntoQ193Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostPostPostPostPostPostPostPostSuccessorRootChildrenClosed: false,
      provesPostPostPostPostPostPostPostPostSuccessorQAvoidingBoundaryClosed: false,
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
  const summary = packet.boundarySummary;
  const lines = [
    '# P848 P4217 post-post-post-post-post-post-post-post-successor 31-bucket rank boundary',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Source rows accounted: ${summary.sourceRowCount}`,
    `- Source post-post-post-post-post-post-post-successor q-avoiding classes accounted: ${summary[sourceCountKey]}`,
    `- Post-post-post-post-post-post-post-post-successor buckets: ${summary[targetBucketCountKey]}`,
    `- Post-post-post-post-post-post-post-post-successor primes: ${summary[targetPrimeListKey].join(', ')}`,
    `- Post-post-post-post-post-post-post-post-successor root children emitted: ${summary[targetTotalRootChildCountKey]}`,
    `- Post-post-post-post-post-post-post-post-successor q-avoiding classes emitted: ${summary[targetTotalQAvoidingClassCountKey]}`,
    `- Survivor source rows: ${summary.survivorSourceRowCount}`,
    `- Survivor post-post-post-post-post-post-post-successor q-avoiding classes: ${summary[survivorSourceCountKey]}`,
    '',
    '## Boundary Buckets',
    '',
  ];
  for (const bucket of packet[`${TARGET_LAYER}PrimeBuckets`]) {
    lines.push(`- q${bucket[targetPrimeKey]}: ${bucket.sourceRowCount} source rows, ${bucket[sourceCountKey]} source post-post-post-post-post-post-post-successor q-avoiding classes, ${bucket[targetRootChildCountKey]} post-post-post-post-post-post-post-post-successor root children, ${bucket[targetQAvoidingClassCountKey]} post-post-post-post-post-post-post-post-successor q-avoiding classes.`);
  }
  lines.push(
    '',
    '## Compression Audit',
    '',
    packet.compressionAudit.sharedInvariant,
    packet.compressionAudit.nonTerminalReason,
    packet.compressionAudit.noStrongerUniformTheoremThisTurn,
    '',
    '## Boundary',
    '',
    packet.proofBoundary,
    '',
    '## Next Move',
    '',
    packet.oneNextAction.action,
    '',
  );
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
