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
  'P848_P4217_P443_Q97_P479_NEXT_RANK_13_BUCKET_BATCH_COVER_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_NEXT_RANK_13_BUCKET_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_NEXT_RANK_LATER_PRIME_15_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_NEXT_RANK_LATER_PRIME_15_BUCKET_RANK_BOUNDARY_PACKET.md',
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

function sumBy(rows, key) {
  return rows.reduce((sum, row) => sum + Number(row[key] ?? 0), 0);
}

function summarizeMap(map, keyName) {
  return [...map.entries()]
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([key, value]) => ({
      [keyName]: Number(key),
      ...value,
    }));
}

function addSourcePrimeBucket(summary, row) {
  const sourcePrime = Number(row.sourceNextObstructionPrime);
  const current = summary.get(sourcePrime) ?? {
    sourceRowCount: 0,
    sourceNextQAvoidingClassCount: 0,
  };
  current.sourceRowCount += 1;
  current.sourceNextQAvoidingClassCount += Number(row.sourceNextQAvoidingClassCount);
  summary.set(sourcePrime, current);
}

function validateRow(row) {
  const laterPrime = Number(row.laterObstructionPrime);
  const laterSquare = laterPrime * laterPrime;
  const sourcePrime = Number(row.sourceNextObstructionPrime);
  const sourceNextQAvoidingClassCount = Number(row.sourceNextQAvoidingClassCount);
  const rootCount = Number(row.laterRootResidueCount);

  assertCondition(Number.isInteger(laterPrime), 'missing later obstruction prime');
  assertCondition(laterPrime > sourcePrime, `later prime q${laterPrime} does not advance past source q${sourcePrime}`);
  assertCondition(Number(row.laterObstructionSquare) === laterSquare, `later square mismatch for q${laterPrime}`);
  assertCondition(rootCount === 2, `expected exactly two later roots for q${laterPrime}`);
  assertCondition(Array.isArray(row.laterRootResidues) && row.laterRootResidues.length === 2, `later root residue list mismatch for q${laterPrime}`);
  assertCondition(Number(row.laterRootChildCount) === sourceNextQAvoidingClassCount * rootCount, `later root-child count mismatch for q${laterPrime}`);
  assertCondition(Number(row.laterQAvoidingClassCount) === sourceNextQAvoidingClassCount * (laterSquare - rootCount), `later q-avoiding count mismatch for q${laterPrime}`);
}

function buildBuckets(rows, coverBuckets) {
  const groups = new Map();
  for (const row of rows) {
    validateRow(row);
    const laterPrime = Number(row.laterObstructionPrime);
    const current = groups.get(laterPrime) ?? {
      sourceRows: [],
      sourceNextPrimeBuckets: new Map(),
    };
    current.sourceRows.push(row);
    addSourcePrimeBucket(current.sourceNextPrimeBuckets, row);
    groups.set(laterPrime, current);
  }

  const coverBucketByPrime = new Map(coverBuckets.map((bucket) => [Number(bucket.laterObstructionPrime), bucket]));

  return summarizeMap(groups, 'laterObstructionPrime').map((group) => {
    const laterPrime = group.laterObstructionPrime;
    const rowsInBucket = group.sourceRows;
    const sourceRowCount = rowsInBucket.length;
    const sourceNextQAvoidingClassCount = sumBy(rowsInBucket, 'sourceNextQAvoidingClassCount');
    const laterRootChildCount = sumBy(rowsInBucket, 'laterRootChildCount');
    const laterQAvoidingClassCount = sumBy(rowsInBucket, 'laterQAvoidingClassCount');
    const coverBucket = coverBucketByPrime.get(laterPrime);

    assertCondition(Boolean(coverBucket), `missing source cover bucket for q${laterPrime}`);
    assertCondition(coverBucket.sourceRowCount === sourceRowCount, `source row count mismatch for q${laterPrime}`);
    assertCondition(coverBucket.sourceNextQAvoidingClassCount === sourceNextQAvoidingClassCount, `source q-avoiding count mismatch for q${laterPrime}`);
    assertCondition(coverBucket.laterRootChildCount === laterRootChildCount, `later root-child count mismatch for q${laterPrime}`);
    assertCondition(coverBucket.laterQAvoidingClassCount === laterQAvoidingClassCount, `later q-avoiding count mismatch for q${laterPrime}`);

    return {
      tokenId: `p443_q97_p479_next_rank_later_prime_q${laterPrime}_rank_boundary`,
      laterObstructionPrime: laterPrime,
      laterObstructionSquare: laterPrime * laterPrime,
      sourceRowCount,
      sourceNextQAvoidingClassCount,
      rootResidueCountsPerClass: [2],
      laterRootChildCount,
      laterQAvoidingClassCount,
      sourceNextPrimeBuckets: summarizeMap(group.sourceNextPrimeBuckets, 'sourceNextObstructionPrime'),
      status: 'open_exact_two_root_later_rank_boundary',
      proofObligation: 'Cover this bucket as part of the whole 15-bucket q-avoiding batch/rank action, or emit a sharper exact subboundary. This token does not authorize singleton q-child descent by itself.',
    };
  });
}

function buildPacket(options) {
  const cover = readJson(options.coverPacket);
  const assembly = readJson(options.assemblyPacket);
  const rows = cover.rowClassifications ?? [];
  const coverBuckets = cover.laterObstructionPrimeBuckets ?? [];

  assertCondition(cover.status === 'all_13_bucket_next_rank_q_avoiding_classes_have_later_square_obstruction_child', 'cover packet status mismatch');
  assertCondition(assembly.status === 'post_next_rank_13_bucket_batch_cover_convergence_assembly_selects_15_bucket_rank_compression', 'assembly packet status mismatch');
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 source row classifications');
  assertCondition(Array.isArray(coverBuckets) && coverBuckets.length === 15, 'expected 15 later-prime cover buckets');

  const buckets = buildBuckets(rows, coverBuckets);
  const sourceRowCount = sumBy(buckets, 'sourceRowCount');
  const sourceNextQAvoidingClassCount = sumBy(buckets, 'sourceNextQAvoidingClassCount');
  const laterRootChildCount = sumBy(buckets, 'laterRootChildCount');
  const laterQAvoidingClassCount = sumBy(buckets, 'laterQAvoidingClassCount');
  const laterPrimes = buckets.map((bucket) => bucket.laterObstructionPrime);

  assertCondition(sourceRowCount === cover.batchCoverSummary?.sourceRowCount, 'total source row count mismatch');
  assertCondition(sourceNextQAvoidingClassCount === cover.batchCoverSummary?.sourceNextQAvoidingClassCount, 'total source next q-avoiding count mismatch');
  assertCondition(laterRootChildCount === cover.batchCoverSummary?.totalLaterRootChildCount, 'total later root-child count mismatch');
  assertCondition(laterQAvoidingClassCount === cover.batchCoverSummary?.totalLaterQAvoidingClassCount, 'total later q-avoiding count mismatch');
  assertCondition(cover.batchCoverSummary?.survivorNextQAvoidingClassCount === 0, 'source cover has survivors');
  assertCondition(laterPrimes.join(',') === '127,131,137,139,149,151,157,163,167,173,179,191,193,197,199', 'unexpected later-prime bucket set');

  const consumedFiniteToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_next_rank_later_prime_15_bucket_rank_boundary',
    bucketCount: 15,
    status: 'selected',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_next_rank_later_prime_15_bucket_rank_boundary/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'p479_next_rank_later_prime_15_bucket_deterministic_rank_boundary_emitted',
    target: 'compress_p848_p4217_p443_q97_p479_next_rank_later_prime_buckets_or_emit_rank_boundary',
    sourceAudit: {
      nextRank13BucketBatchCoverPacket: {
        path: path.relative(repoRoot, options.coverPacket),
        sha256: sha256File(options.coverPacket),
        status: cover.status,
      },
      postNextRankAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    boundarySummary: {
      sourceBucketCount: cover.batchCoverSummary.sourceBucketCount,
      sourceRowCount,
      sourceNextQAvoidingClassCount,
      laterObstructionPrimeBucketCount: buckets.length,
      laterObstructionPrimes: laterPrimes,
      minLaterObstructionPrime: laterPrimes[0],
      maxLaterObstructionPrime: laterPrimes.at(-1),
      rootResidueCountsPerClass: [2],
      totalLaterRootChildCount: laterRootChildCount,
      totalLaterQAvoidingClassCount: laterQAvoidingClassCount,
      survivorSourceRowCount: cover.batchCoverSummary.survivorSourceRowCount,
      survivorNextQAvoidingClassCount: cover.batchCoverSummary.survivorNextQAvoidingClassCount,
    },
    deterministicRankBoundary: {
      consumedFiniteToken: consumedFiniteToken.tokenId,
      producedFiniteTokenCount: buckets.length,
      producedFiniteTokens: buckets,
      measureStatus: 'finite_rank_token_partitioned_not_decreased',
      exactPartition: 'The single later-prime rank token is partitioned by q in {127,131,137,139,149,151,157,163,167,173,179,191,193,197,199}.',
    },
    compressionAudit: {
      verdict: 'exact_boundary_packet_is_the_honest_current_compression',
      sharedInvariant: 'Every stored row in the 15-bucket later-prime boundary has exactly two roots at its first later obstruction prime.',
      nonTerminalReason: 'The shared two-root law emits rank children and a large q-avoiding boundary; it does not prove terminal closure of those children.',
      noStrongerUniformTheoremThisTurn: 'The buckets mix source next-prime supports unevenly, so this packet records the exact finite partition and hands off a whole-boundary q-avoiding batch cover instead of claiming one closed terminal family.',
    },
    finiteTokenTransition: {
      consumedFiniteToken: {
        ...consumedFiniteToken,
        status: 'consumed_by_deterministic_15_bucket_rank_boundary',
      },
      emittedRankBoundaryTokenCount: buckets.length,
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_next_rank_later_prime_root_children',
          laterObstructionPrimeBucketCount: buckets.length,
          rootChildCount: laterRootChildCount,
          status: 'root_children_open_not_descended',
        },
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover',
          laterObstructionPrimeBucketCount: buckets.length,
          qAvoidingClassCount: laterQAvoidingClassCount,
          status: 'selected_for_whole_boundary_batch_cover',
        },
      ],
      nextFiniteToken: {
        tokenId: 'p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover',
        bucketCount: buckets.length,
        qAvoidingClassCount: laterQAvoidingClassCount,
        status: 'selected',
      },
    },
    laterPrimeBuckets: buckets,
    proofBoundary: 'This packet accounts for every later-prime bucket emitted by the next-rank 13-bucket batch cover and turns the 15-bucket surface into an exact deterministic ranked boundary. It does not close the 340,617,767,586 later root children, the 3,652,250,197,976,151 later q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover_or_emit_boundary',
      action: 'Run a whole-boundary q-avoiding batch cover over all 15 later-prime buckets, or emit an exact survivor/rank boundary if the batch cover does not close.',
      coveredFamily: 'All 3,652,250,197,976,151 later q-avoiding classes across q in {127,131,137,139,149,151,157,163,167,173,179,191,193,197,199}.',
      finiteDenominatorOrRankToken: 'Finite token p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover.',
      failureBoundary: 'If no whole-boundary cover exists, write the deterministic survivor boundary grouped by later prime and source next-prime support; do not open a singleton q-child first.',
      completionRule: 'Every one of the 15 later-prime q-avoiding buckets is covered, structurally decomposed, or listed in a deterministic exact survivor boundary before singleton descent.',
    },
    recommendedNextAction: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover_or_emit_boundary',
    nextTheoremMove: 'Use the deterministic 15-bucket rank boundary to run one whole-boundary q-avoiding batch cover; singleton q127/q131/etc. descent remains blocked until a later packet consumes a smaller finite token.',
    claims: {
      consumesPostNextRank15BucketRankToken: true,
      accountsForAll15LaterPrimeBuckets: true,
      allRowsHaveTwoLaterRoots: true,
      emitsExactDeterministic15BucketRankBoundary: true,
      selectsWholeBoundaryBatchCoverNext: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ127Singleton: false,
      descendsIntoQ131Singleton: false,
      descendsIntoSingletonQChild: false,
      provesLaterRootChildrenClosed: false,
      provesLaterQAvoidingBoundaryClosed: false,
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
  lines.push('# P848 P4217 next-rank later-prime 15-bucket rank boundary');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source rows accounted: ${packet.boundarySummary.sourceRowCount}`);
  lines.push(`- Source next q-avoiding classes accounted: ${packet.boundarySummary.sourceNextQAvoidingClassCount}`);
  lines.push(`- Later-prime buckets: ${packet.boundarySummary.laterObstructionPrimeBucketCount}`);
  lines.push(`- Later primes: ${packet.boundarySummary.laterObstructionPrimes.join(', ')}`);
  lines.push(`- Later root children emitted: ${packet.boundarySummary.totalLaterRootChildCount}`);
  lines.push(`- Later q-avoiding classes emitted: ${packet.boundarySummary.totalLaterQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.boundarySummary.survivorSourceRowCount}`);
  lines.push(`- Survivor next q-avoiding classes: ${packet.boundarySummary.survivorNextQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Boundary Buckets');
  lines.push('');
  for (const bucket of packet.laterPrimeBuckets) {
    lines.push(`- q${bucket.laterObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourceNextQAvoidingClassCount} source next q-avoiding classes, ${bucket.laterRootChildCount} later root children, ${bucket.laterQAvoidingClassCount} later q-avoiding classes.`);
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
