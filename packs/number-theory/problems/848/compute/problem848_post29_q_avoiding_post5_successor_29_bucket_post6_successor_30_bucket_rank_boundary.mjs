#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_COVER_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json');
const DEFAULT_ASSEMBLY_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_RANK_BOUNDARY_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_RANK_BOUNDARY_PACKET.md');

const EXPECTED_PRIMES = [
  179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241,
  251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
  331, 337, 349, 353,
];
const TARGET = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_buckets_or_emit_rank_boundary';
const NEXT_ACTION = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary';
const NEXT_Q_COVER_ACTION = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover_or_emit_boundary';
const NEXT_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover';

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
  const priorPrime = Number(row.postPostPostPostPostSuccessorObstructionPrime);
  const prime = Number(row.postPostPostPostPostPostSuccessorObstructionPrime);
  const square = prime * prime;
  const sourceCount = toBigInt(row.sourcePostPostPostPostPostSuccessorQAvoidingClassCount, 'sourcePostPostPostPostPostSuccessorQAvoidingClassCount');
  const rootCount = Number(row.postPostPostPostPostPostSuccessorRootResidueCount);

  assertCondition(Number.isInteger(priorPrime), 'missing post-post-post-post-post-successor obstruction prime');
  assertCondition(Number.isInteger(prime), 'missing post-post-post-post-post-post-successor obstruction prime');
  assertCondition(prime > priorPrime, `q${prime} does not advance past q${priorPrime}`);
  assertCondition(Number(row.postPostPostPostPostPostSuccessorObstructionSquare) === square, `square mismatch for q${prime}`);
  assertCondition(rootCount === 2, `expected exactly two post-post-post-post-post-post-successor roots for q${prime}`);
  assertCondition(Array.isArray(row.postPostPostPostPostPostSuccessorRootResidues) && row.postPostPostPostPostPostSuccessorRootResidues.length === 2, `root list mismatch for q${prime}`);
  assertCondition(
    toBigInt(row.postPostPostPostPostPostSuccessorRootChildCount, 'postPostPostPostPostPostSuccessorRootChildCount') === sourceCount * BigInt(rootCount),
    `root-child count mismatch for q${prime}`,
  );
  assertCondition(
    toBigInt(row.postPostPostPostPostPostSuccessorQAvoidingClassCount, 'postPostPostPostPostPostSuccessorQAvoidingClassCount') === sourceCount * (BigInt(square) - BigInt(rootCount)),
    `q-avoiding count mismatch for q${prime}`,
  );
}

function decorateBucket(bucket) {
  const prime = Number(bucket.postPostPostPostPostPostSuccessorObstructionPrime);
  return {
    tokenId: `p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_q${prime}_rank_boundary`,
    ...bucket,
    status: 'open_exact_two_root_post_post_post_post_post_post_successor_rank_boundary',
    proofObligation: 'Cover this bucket only as part of a whole 30-bucket post-post-post-post-post-post-successor assembly/batch/rank action, or emit a sharper exact subboundary. This token does not authorize singleton q-child descent by itself.',
  };
}

function validateBucketAgainstRows(bucket, rows) {
  const prime = Number(bucket.postPostPostPostPostPostSuccessorObstructionPrime);
  const rowsInBucket = rows.filter((row) => Number(row.postPostPostPostPostPostSuccessorObstructionPrime) === prime);
  assertCondition(rowsInBucket.length === bucket.sourceRowCount, `source row count mismatch for q${prime}`);
  compareBigInt(
    sumBigInt(rowsInBucket, 'sourcePostPostPostPostPostSuccessorQAvoidingClassCount'),
    bucket.sourcePostPostPostPostPostSuccessorQAvoidingClassCount,
    `source q-avoiding count mismatch for q${prime}`,
  );
  compareBigInt(
    sumBigInt(rowsInBucket, 'postPostPostPostPostPostSuccessorRootChildCount'),
    bucket.postPostPostPostPostPostSuccessorRootChildCount,
    `root-child count mismatch for q${prime}`,
  );
  compareBigInt(
    sumBigInt(rowsInBucket, 'postPostPostPostPostPostSuccessorQAvoidingClassCount'),
    bucket.postPostPostPostPostPostSuccessorQAvoidingClassCount,
    `q-avoiding count mismatch for q${prime}`,
  );
}

function buildPacket(options) {
  const cover = readJson(options.coverPacket);
  const assembly = readJson(options.assemblyPacket);
  const rows = cover.rowClassifications ?? [];
  const sourceBuckets = cover.postPostPostPostPostPostSuccessorObstructionPrimeBuckets ?? [];

  assertCondition(cover.status === 'all_29_bucket_post_post_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child', 'cover packet status mismatch');
  assertCondition(assembly.status === 'post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover_convergence_assembly_selects_30_bucket_post_post_post_post_post_post_successor_rank_compression', 'assembly packet status mismatch');
  assertCondition(assembly.recommendedNextAction === TARGET, 'assembly selected action mismatch');
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 source row classifications');
  assertCondition(Array.isArray(sourceBuckets) && sourceBuckets.length === 30, 'expected 30 post-post-post-post-post-post-successor buckets');

  for (const row of rows) {
    validateRow(row);
  }
  const buckets = sourceBuckets.map(decorateBucket);
  for (const bucket of buckets) {
    validateBucketAgainstRows(bucket, rows);
  }
  const primes = buckets.map((bucket) => Number(bucket.postPostPostPostPostPostSuccessorObstructionPrime));
  const sourceRowCount = buckets.reduce((sum, bucket) => sum + bucket.sourceRowCount, 0);
  const sourceCount = sumBigInt(buckets, 'sourcePostPostPostPostPostSuccessorQAvoidingClassCount');
  const rootChildCount = sumBigInt(buckets, 'postPostPostPostPostPostSuccessorRootChildCount');
  const qAvoidingCount = sumBigInt(buckets, 'postPostPostPostPostPostSuccessorQAvoidingClassCount');

  assertCondition(primes.join(',') === EXPECTED_PRIMES.join(','), 'unexpected post-post-post-post-post-post-successor prime bucket set');
  assertCondition(sourceRowCount === cover.batchCoverSummary?.sourceRowCount, 'total source row count mismatch');
  compareBigInt(sourceCount, cover.batchCoverSummary?.sourcePostPostPostPostPostSuccessorQAvoidingClassCount, 'total source q-avoiding count mismatch');
  compareBigInt(rootChildCount, cover.batchCoverSummary?.totalPostPostPostPostPostPostSuccessorRootChildCount, 'total root-child count mismatch');
  compareBigInt(qAvoidingCount, cover.batchCoverSummary?.totalPostPostPostPostPostPostSuccessorQAvoidingClassCount, 'total q-avoiding count mismatch');
  compareBigInt(cover.batchCoverSummary?.survivorPostPostPostPostPostSuccessorQAvoidingClassCount, 0n, 'source cover has survivors');

  const consumedFiniteToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary',
    bucketCount: 30,
    postPostPostPostPostPostSuccessorRootChildCount: asString(rootChildCount),
    postPostPostPostPostPostSuccessorQAvoidingClassCount: asString(qAvoidingCount),
    status: 'selected_for_whole_boundary_rank_compression_or_exact_boundary',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_deterministic_rank_boundary_emitted',
    target: TARGET,
    sourceAudit: {
      post29QAvoidingPostPostPostPostPostSuccessor29BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.coverPacket),
        sha256: sha256File(options.coverPacket),
        status: cover.status,
      },
      post29QAvoidingPostPostPostPostPostSuccessor29BucketQAvoidingBatchCoverConvergenceAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    boundarySummary: {
      sourcePostPostPostPostPostSuccessorBucketCount: cover.batchCoverSummary.sourcePostPostPostPostPostSuccessorBucketCount,
      sourceRowCount,
      sourcePostPostPostPostPostSuccessorQAvoidingClassCount: asString(sourceCount),
      postPostPostPostPostPostSuccessorObstructionPrimeBucketCount: buckets.length,
      postPostPostPostPostPostSuccessorObstructionPrimes: primes,
      minPostPostPostPostPostPostSuccessorObstructionPrime: primes[0],
      maxPostPostPostPostPostPostSuccessorObstructionPrime: primes.at(-1),
      rootResidueCountsPerClass: [2],
      totalPostPostPostPostPostPostSuccessorRootChildCount: asString(rootChildCount),
      totalPostPostPostPostPostPostSuccessorQAvoidingClassCount: asString(qAvoidingCount),
      survivorSourceRowCount: cover.batchCoverSummary.survivorSourceRowCount,
      survivorPostPostPostPostPostSuccessorQAvoidingClassCount: cover.batchCoverSummary.survivorPostPostPostPostPostSuccessorQAvoidingClassCount,
    },
    deterministicRankBoundary: {
      consumedFiniteToken: consumedFiniteToken.tokenId,
      producedFiniteTokenCount: buckets.length,
      producedFiniteTokens: buckets,
      measureStatus: 'finite_rank_token_partitioned_not_decreased',
      exactPartition: `The single 30-bucket post-post-post-post-post-post-successor rank token is partitioned by q in {${primes.join(',')}}.`,
    },
    compressionAudit: {
      verdict: 'exact_boundary_packet_is_the_honest_current_compression',
      sharedInvariant: 'Every stored row in the 30-bucket post-post-post-post-post-post-successor boundary has exactly two roots at its first post-post-post-post-post-post-successor obstruction prime.',
      supportDiversity: {
        sourceRows: {
          min: Math.min(...buckets.map((bucket) => bucket.sourceRowCount)),
          max: Math.max(...buckets.map((bucket) => bucket.sourceRowCount)),
          distinctSizes: [...new Set(buckets.map((bucket) => bucket.sourceRowCount))].sort((left, right) => left - right),
        },
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
      noStrongerUniformTheoremThisTurn: 'The 30 buckets mix source-row counts and previous support profiles unevenly, so this packet records the exact finite partition and hands off convergence assembly instead of claiming one closed terminal family.',
    },
    finiteTokenTransition: {
      consumedFiniteToken: {
        ...consumedFiniteToken,
        status: 'consumed_by_deterministic_30_bucket_post_post_post_post_post_post_successor_rank_boundary',
      },
      emittedRankBoundaryTokenCount: buckets.length,
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_root_children',
          postPostPostPostPostPostSuccessorObstructionPrimeBucketCount: buckets.length,
          rootChildCount: asString(rootChildCount),
          status: 'root_children_open_not_descended',
        },
        {
          tokenId: NEXT_TOKEN,
          postPostPostPostPostPostSuccessorObstructionPrimeBucketCount: buckets.length,
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
    postPostPostPostPostPostSuccessorPrimeBuckets: buckets,
    proofBoundary: 'This packet accounts for every post-post-post-post-post-post-successor bucket emitted by the 29-bucket post-post-post-post-post-successor q-avoiding batch cover and turns the 30-bucket surface into an exact deterministic ranked boundary. It does not close the 209,959,025,371,800,462,398,398,841,431,586,439,796,950,134,059,710,318 post-post-post-post-post-post-successor root children, the 9,963,724,410,351,871,391,088,180,714,463,609,317,652,043,690,749,610,411,985 post-post-post-post-post-post-successor q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Run convergence assembly after the deterministic 30-bucket post-post-post-post-post-post-successor rank boundary, name the whole q-avoiding cover token, and block q179/q181 singleton descent before another repeated q-cover step.',
      coveredFamily: `All ${asString(qAvoidingCount)} post-post-post-post-post-post-successor q-avoiding classes across q in {${primes.join(',')}}.`,
      finiteDenominatorOrRankToken: `Finite token ${NEXT_TOKEN}.`,
      failureBoundary: 'If no whole-boundary cover exists after assembly, write the deterministic survivor boundary grouped by post-post-post-post-post-post-successor prime and previous support; do not open a singleton q-child first.',
      completionRule: 'Assembly consumes the 30-bucket post-post-post-post-post-post-successor rank-boundary token, names the whole q-avoiding cover, and records one non-singleton next action.',
    },
    recommendedNextAction: NEXT_ACTION,
    nextQCoverActionAfterAssembly: NEXT_Q_COVER_ACTION,
    nextTheoremMove: 'Use the deterministic 30-bucket post-post-post-post-post-post-successor rank boundary to run convergence assembly before any whole-boundary q-avoiding batch cover; singleton q179/q181/etc. descent remains blocked until a later packet consumes a smaller finite token.',
    claims: {
      consumesPostPostPostPostPostSuccessorQAvoidingAssemblyRankToken: true,
      accountsForAll30PostPostPostPostPostPostSuccessorBuckets: true,
      allRowsHaveTwoPostPostPostPostPostPostSuccessorRoots: true,
      emitsExactDeterministic30BucketPostPostPostPostPostPostSuccessorRankBoundary: true,
      selectsConvergenceAssemblyBeforeWholeBoundaryBatchCover: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ179Singleton: false,
      descendsIntoQ181Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostPostPostPostPostPostSuccessorRootChildrenClosed: false,
      provesPostPostPostPostPostPostSuccessorQAvoidingBoundaryClosed: false,
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
    '# P848 P4217 post-post-post-post-post-post-successor 30-bucket rank boundary',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Source rows accounted: ${packet.boundarySummary.sourceRowCount}`,
    `- Source post-post-post-post-post-successor q-avoiding classes accounted: ${packet.boundarySummary.sourcePostPostPostPostPostSuccessorQAvoidingClassCount}`,
    `- Post-post-post-post-post-post-successor buckets: ${packet.boundarySummary.postPostPostPostPostPostSuccessorObstructionPrimeBucketCount}`,
    `- Post-post-post-post-post-post-successor primes: ${packet.boundarySummary.postPostPostPostPostPostSuccessorObstructionPrimes.join(', ')}`,
    `- Post-post-post-post-post-post-successor root children emitted: ${packet.boundarySummary.totalPostPostPostPostPostPostSuccessorRootChildCount}`,
    `- Post-post-post-post-post-post-successor q-avoiding classes emitted: ${packet.boundarySummary.totalPostPostPostPostPostPostSuccessorQAvoidingClassCount}`,
    `- Survivor source rows: ${packet.boundarySummary.survivorSourceRowCount}`,
    `- Survivor post-post-post-post-post-successor q-avoiding classes: ${packet.boundarySummary.survivorPostPostPostPostPostSuccessorQAvoidingClassCount}`,
    '',
    '## Boundary Buckets',
    '',
  ];
  for (const bucket of packet.postPostPostPostPostPostSuccessorPrimeBuckets) {
    lines.push(`- q${bucket.postPostPostPostPostPostSuccessorObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourcePostPostPostPostPostSuccessorQAvoidingClassCount} source post-post-post-post-post-successor q-avoiding classes, ${bucket.postPostPostPostPostPostSuccessorRootChildCount} post-post-post-post-post-post-successor root children, ${bucket.postPostPostPostPostPostSuccessorQAvoidingClassCount} post-post-post-post-post-post-successor q-avoiding classes.`);
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
