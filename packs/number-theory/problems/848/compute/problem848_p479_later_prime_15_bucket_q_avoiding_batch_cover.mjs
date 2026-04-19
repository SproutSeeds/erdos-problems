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

const DEFAULT_SOURCE_COVER_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_NEXT_RANK_13_BUCKET_BATCH_COVER_PACKET.json',
);
const DEFAULT_RANK_BOUNDARY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_NEXT_RANK_LATER_PRIME_15_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.md',
);

function parseArgs(argv) {
  const options = {
    sourceCoverPacket: DEFAULT_SOURCE_COVER_PACKET,
    rankBoundaryPacket: DEFAULT_RANK_BOUNDARY_PACKET,
    maxPrime: 3000,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--source-cover-packet') {
      options.sourceCoverPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--rank-boundary-packet') {
      options.rankBoundaryPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--max-prime') {
      options.maxPrime = Number(argv[index + 1]);
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

  if (!Number.isInteger(options.maxPrime) || options.maxPrime < 2) {
    throw new Error('--max-prime must be an integer >= 2');
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

function decimal(value) {
  return BigInt(value).toString();
}

function primeSieve(max) {
  const sieve = new Uint8Array(max + 1);
  const primes = [];
  for (let value = 2; value <= max; value += 1) {
    if (sieve[value]) {
      continue;
    }
    primes.push(value);
    for (let multiple = value * value; multiple <= max; multiple += value) {
      sieve[multiple] = 1;
    }
  }
  return primes;
}

function rootsForDelta(delta, prime, cache) {
  const key = `${delta}|${prime}`;
  const cached = cache.get(key);
  if (cached !== undefined) {
    return cached;
  }

  const square = prime * prime;
  const deltaMod = ((delta % square) + square) % square;
  const roots = [];
  for (let y = 0; y < square; y += 1) {
    if ((y * ((y + deltaMod) % square) + 1) % square === 0) {
      roots.push(y);
    }
  }
  cache.set(key, roots);
  return roots;
}

function addBigIntStrings(left, right) {
  return (BigInt(left ?? 0) + BigInt(right ?? 0)).toString();
}

function summarizeMap(map, keyName) {
  return [...map.entries()]
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([key, value]) => ({
      [keyName]: Number(key),
      ...value,
    }));
}

function addNestedBucket(map, key, count) {
  const current = map.get(key) ?? {
    sourceRowCount: 0,
    sourceLaterQAvoidingClassCount: '0',
  };
  current.sourceRowCount += 1;
  current.sourceLaterQAvoidingClassCount = addBigIntStrings(current.sourceLaterQAvoidingClassCount, count);
  map.set(key, current);
}

function addToNextBucketSummary(summary, row) {
  const current = summary.get(row.nextObstructionPrime) ?? {
    sourceRowCount: 0,
    sourceLaterQAvoidingClassCount: '0',
    nextRootChildCount: '0',
    nextQAvoidingClassCount: '0',
    previousLaterPrimeBuckets: new Map(),
    rootResidueCounts: new Set(),
  };
  current.sourceRowCount += 1;
  current.sourceLaterQAvoidingClassCount = addBigIntStrings(
    current.sourceLaterQAvoidingClassCount,
    row.sourceLaterQAvoidingClassCount,
  );
  current.nextRootChildCount = addBigIntStrings(current.nextRootChildCount, row.nextRootChildCount);
  current.nextQAvoidingClassCount = addBigIntStrings(current.nextQAvoidingClassCount, row.nextQAvoidingClassCount);
  current.rootResidueCounts.add(row.nextRootResidueCount);
  addNestedBucket(current.previousLaterPrimeBuckets, row.laterObstructionPrime, row.sourceLaterQAvoidingClassCount);
  summary.set(row.nextObstructionPrime, current);
}

function compactNextBucketSummary(summary) {
  return summarizeMap(summary, 'nextObstructionPrime').map((bucket) => ({
    nextObstructionPrime: bucket.nextObstructionPrime,
    nextObstructionSquare: bucket.nextObstructionPrime * bucket.nextObstructionPrime,
    sourceRowCount: bucket.sourceRowCount,
    sourceLaterQAvoidingClassCount: bucket.sourceLaterQAvoidingClassCount,
    rootResidueCountsPerClass: [...bucket.rootResidueCounts].sort((left, right) => left - right),
    nextRootChildCount: bucket.nextRootChildCount,
    nextQAvoidingClassCount: bucket.nextQAvoidingClassCount,
    previousLaterPrimeBuckets: summarizeMap(bucket.previousLaterPrimeBuckets, 'previousLaterObstructionPrime'),
    status: 'open_exact_two_root_next_rank_boundary',
  }));
}

function addToPreviousLaterBucketSummary(summary, row) {
  const current = summary.get(row.laterObstructionPrime) ?? {
    sourceRowCount: 0,
    sourceLaterQAvoidingClassCount: '0',
    nextRootChildCount: '0',
    nextQAvoidingClassCount: '0',
    nextObstructionPrimeBuckets: new Map(),
  };
  current.sourceRowCount += 1;
  current.sourceLaterQAvoidingClassCount = addBigIntStrings(
    current.sourceLaterQAvoidingClassCount,
    row.sourceLaterQAvoidingClassCount,
  );
  current.nextRootChildCount = addBigIntStrings(current.nextRootChildCount, row.nextRootChildCount);
  current.nextQAvoidingClassCount = addBigIntStrings(current.nextQAvoidingClassCount, row.nextQAvoidingClassCount);
  addNestedBucket(current.nextObstructionPrimeBuckets, row.nextObstructionPrime, row.sourceLaterQAvoidingClassCount);
  summary.set(row.laterObstructionPrime, current);
}

function compactPreviousLaterBucketSummary(summary) {
  return summarizeMap(summary, 'previousLaterObstructionPrime').map((bucket) => ({
    previousLaterObstructionPrime: bucket.previousLaterObstructionPrime,
    previousLaterObstructionSquare: bucket.previousLaterObstructionPrime * bucket.previousLaterObstructionPrime,
    sourceRowCount: bucket.sourceRowCount,
    sourceLaterQAvoidingClassCount: bucket.sourceLaterQAvoidingClassCount,
    nextRootChildCount: bucket.nextRootChildCount,
    nextQAvoidingClassCount: bucket.nextQAvoidingClassCount,
    nextObstructionPrimeBuckets: summarizeMap(bucket.nextObstructionPrimeBuckets, 'nextObstructionPrime'),
  }));
}

function sumString(rows, key) {
  return rows.reduce((sum, row) => sum + BigInt(row[key] ?? 0), 0n).toString();
}

function classifyRow(row, primes, maxPrime, rootCache) {
  const sourceLaterQAvoidingClassCount = BigInt(row.laterQAvoidingClassCount);

  for (const prime of primes) {
    if (prime <= row.laterObstructionPrime) {
      continue;
    }
    if (prime > maxPrime) {
      break;
    }

    const roots = rootsForDelta(row.delta, prime, rootCache);
    if (roots.length === 0) {
      continue;
    }

    const nextObstructionSquare = prime * prime;
    const nextRootChildCount = sourceLaterQAvoidingClassCount * BigInt(roots.length);
    const nextQAvoidingClassCount = sourceLaterQAvoidingClassCount * BigInt(nextObstructionSquare - roots.length);
    return {
      sourceFamilyId: row.sourceFamilyId,
      sourceFamilyKind: row.sourceFamilyKind,
      residueModulo479Square: row.residueModulo479Square,
      k: row.k,
      delta: row.delta,
      parentObstructionPrime: row.parentObstructionPrime,
      sourceNextObstructionPrime: row.sourceNextObstructionPrime,
      sourceNextObstructionSquare: row.sourceNextObstructionSquare,
      sourceNextRootResidueCount: row.sourceNextRootResidueCount,
      sourceNextRootChildCount: row.sourceNextRootChildCount,
      sourceNextQAvoidingClassCount: row.sourceNextQAvoidingClassCount,
      laterObstructionPrime: row.laterObstructionPrime,
      laterObstructionSquare: row.laterObstructionSquare,
      laterRootResidueCount: row.laterRootResidueCount,
      laterRootChildCount: row.laterRootChildCount,
      sourceLaterQAvoidingClassCount: sourceLaterQAvoidingClassCount.toString(),
      nextObstructionPrime: prime,
      nextObstructionSquare,
      nextRootResidueCount: roots.length,
      nextRootResidues: roots,
      nextRootChildCount: nextRootChildCount.toString(),
      nextQAvoidingClassCount: nextQAvoidingClassCount.toString(),
      inheritedNoSmallerObstruction: true,
      previousLaterPrimeExcludedByQAvoidingBoundary: true,
    };
  }

  return {
    sourceFamilyId: row.sourceFamilyId,
    sourceFamilyKind: row.sourceFamilyKind,
    residueModulo479Square: row.residueModulo479Square,
    k: row.k,
    delta: row.delta,
    parentObstructionPrime: row.parentObstructionPrime,
    sourceNextObstructionPrime: row.sourceNextObstructionPrime,
    sourceNextObstructionSquare: row.sourceNextObstructionSquare,
    sourceNextRootResidueCount: row.sourceNextRootResidueCount,
    sourceNextRootChildCount: row.sourceNextRootChildCount,
    sourceNextQAvoidingClassCount: row.sourceNextQAvoidingClassCount,
    laterObstructionPrime: row.laterObstructionPrime,
    laterObstructionSquare: row.laterObstructionSquare,
    laterRootResidueCount: row.laterRootResidueCount,
    laterRootChildCount: row.laterRootChildCount,
    sourceLaterQAvoidingClassCount: sourceLaterQAvoidingClassCount.toString(),
    nextObstructionPrime: null,
    nextObstructionSquare: null,
    nextRootResidueCount: 0,
    nextRootResidues: [],
    nextRootChildCount: '0',
    nextQAvoidingClassCount: sourceLaterQAvoidingClassCount.toString(),
    inheritedNoSmallerObstruction: true,
    previousLaterPrimeExcludedByQAvoidingBoundary: true,
  };
}

function buildPacket(options) {
  const sourceCover = readJson(options.sourceCoverPacket);
  const rankBoundary = readJson(options.rankBoundaryPacket);

  assertCondition(sourceCover.status === 'all_13_bucket_next_rank_q_avoiding_classes_have_later_square_obstruction_child', 'source cover status mismatch');
  assertCondition(rankBoundary.status === 'p479_next_rank_later_prime_15_bucket_deterministic_rank_boundary_emitted', 'rank-boundary status mismatch');
  assertCondition(rankBoundary.recommendedNextAction === 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover_or_emit_boundary', 'rank-boundary next action mismatch');

  const rows = sourceCover.rowClassifications ?? [];
  assertCondition(rows.length === 718, 'expected 718 source row classifications');
  assertCondition(
    BigInt(rankBoundary.boundarySummary?.totalLaterQAvoidingClassCount ?? 0) === BigInt(sourceCover.batchCoverSummary?.totalLaterQAvoidingClassCount ?? 0),
    'later q-avoiding total mismatch between source cover and rank boundary',
  );

  const primes = primeSieve(options.maxPrime);
  const rootCache = new Map();
  const classifiedRows = rows.map((row) => classifyRow(row, primes, options.maxPrime, rootCache));
  const survivorRows = classifiedRows.filter((row) => row.nextObstructionPrime === null);
  const nextBucketMap = new Map();
  const previousLaterBucketMap = new Map();

  for (const row of classifiedRows) {
    if (row.nextObstructionPrime !== null) {
      addToNextBucketSummary(nextBucketMap, row);
    }
    addToPreviousLaterBucketSummary(previousLaterBucketMap, row);
  }

  const nextObstructionPrimeBuckets = compactNextBucketSummary(nextBucketMap);
  const previousLaterPrimeBucketSummaries = compactPreviousLaterBucketSummary(previousLaterBucketMap);
  const sourceLaterQAvoidingClassCount = sumString(classifiedRows, 'sourceLaterQAvoidingClassCount');
  const nextRootChildCount = sumString(classifiedRows, 'nextRootChildCount');
  const nextQAvoidingClassCount = sumString(classifiedRows, 'nextQAvoidingClassCount');
  const survivorLaterQAvoidingClassCount = sumString(survivorRows, 'sourceLaterQAvoidingClassCount');
  const nextRootResidueCounts = [...new Set(classifiedRows.map((row) => row.nextRootResidueCount))]
    .sort((left, right) => left - right);

  assertCondition(sourceLaterQAvoidingClassCount === decimal(rankBoundary.boundarySummary.totalLaterQAvoidingClassCount), 'source later q-avoiding total mismatch');
  assertCondition(survivorRows.length === 0, `expected no survivor rows, found ${survivorRows.length}`);
  assertCondition(survivorLaterQAvoidingClassCount === '0', `expected no survivor classes, found ${survivorLaterQAvoidingClassCount}`);
  assertCondition(nextRootResidueCounts.length === 1 && nextRootResidueCounts[0] === 2, 'expected a two-root next obstruction law');
  assertCondition(nextObstructionPrimeBuckets.length === 17, 'expected 17 next-obstruction prime buckets');

  const nextObstructionPrimes = nextObstructionPrimeBuckets.map((bucket) => bucket.nextObstructionPrime);
  const inputToken = rankBoundary.finiteTokenTransition?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover',
    bucketCount: 15,
    qAvoidingClassCount: sourceLaterQAvoidingClassCount,
    status: 'selected',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'all_15_bucket_later_prime_q_avoiding_classes_have_next_square_obstruction_child',
    target: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover_or_emit_boundary',
    sourceAudit: {
      nextRank13BucketBatchCoverPacket: {
        path: path.relative(repoRoot, options.sourceCoverPacket),
        sha256: sha256File(options.sourceCoverPacket),
        status: sourceCover.status,
      },
      laterPrime15BucketRankBoundaryPacket: {
        path: path.relative(repoRoot, options.rankBoundaryPacket),
        sha256: sha256File(options.rankBoundaryPacket),
        status: rankBoundary.status,
      },
    },
    inputRankToken: inputToken,
    batchCoverSummary: {
      sourceLaterPrimeBucketCount: 15,
      sourceRowCount: classifiedRows.length,
      sourceLaterQAvoidingClassCount,
      classifiedLaterQAvoidingClassCount: addBigIntStrings(sourceLaterQAvoidingClassCount, `-${survivorLaterQAvoidingClassCount}`),
      survivorSourceRowCount: survivorRows.length,
      survivorLaterQAvoidingClassCount,
      nextObstructionPrimeBucketCount: nextObstructionPrimeBuckets.length,
      minNextObstructionPrime: nextObstructionPrimes[0] ?? null,
      maxNextObstructionPrime: nextObstructionPrimes.at(-1) ?? null,
      nextRootResidueCounts,
      totalNextRootChildCount: nextRootChildCount,
      totalNextQAvoidingClassCount: nextQAvoidingClassCount,
      maxCheckedPrime: options.maxPrime,
      rootCacheEntryCount: rootCache.size,
    },
    proofMechanism: {
      theoremId: 'p848_p4217_p443_q97_p479_later_prime_15_bucket_row_uniform_next_obstruction',
      status: 'proved_for_recorded_15_bucket_later_prime_rank_boundary_not_terminal_closure',
      statement: 'For every recorded row in the deterministic 15-bucket later-prime q-avoiding boundary, the previous later obstruction prime is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions from the prior first-obstruction classifications; the first later prime with roots of y*(y+delta)+1 modulo s^2 gives a row-uniform square-obstruction child for every descendant class of that row.',
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_later_prime_15_bucket_q_avoiding_batch_cover.mjs --pretty',
      proofSketch: [
        'Read the 718 row classifications from the next-rank 13-bucket batch cover and the deterministic 15-bucket later-prime rank boundary.',
        'Use the later q-avoiding class count emitted by the rank-boundary packet as the source class count for this layer.',
        'Skip primes at or below the current later obstruction prime because the previous layer already made it the first obstruction and this q-avoiding layer excludes that prime.',
        'For later primes s, solve y*(y+delta)+1 == 0 mod s^2. The first s with roots is row-uniform across the inherited later q-avoiding descendant classes.',
        'All 718 source rows have a first later two-root obstruction prime at or below q223, so all 3,652,250,197,976,151 later q-avoiding classes are classified with no survivors.',
      ],
    },
    nextObstructionPrimeBuckets,
    previousLaterPrimeBucketSummaries,
    rowClassifications: classifiedRows.map((row) => ({
      sourceFamilyId: row.sourceFamilyId,
      sourceFamilyKind: row.sourceFamilyKind,
      residueModulo479Square: row.residueModulo479Square,
      k: row.k,
      delta: row.delta,
      parentObstructionPrime: row.parentObstructionPrime,
      sourceNextObstructionPrime: row.sourceNextObstructionPrime,
      sourceNextObstructionSquare: row.sourceNextObstructionSquare,
      sourceNextRootResidueCount: row.sourceNextRootResidueCount,
      sourceNextRootChildCount: row.sourceNextRootChildCount,
      sourceNextQAvoidingClassCount: row.sourceNextQAvoidingClassCount,
      laterObstructionPrime: row.laterObstructionPrime,
      laterObstructionSquare: row.laterObstructionSquare,
      laterRootResidueCount: row.laterRootResidueCount,
      laterRootChildCount: row.laterRootChildCount,
      sourceLaterQAvoidingClassCount: row.sourceLaterQAvoidingClassCount,
      nextObstructionPrime: row.nextObstructionPrime,
      nextObstructionSquare: row.nextObstructionSquare,
      nextRootResidueCount: row.nextRootResidueCount,
      nextRootResidues: row.nextRootResidues,
      nextRootChildCount: row.nextRootChildCount,
      nextQAvoidingClassCount: row.nextQAvoidingClassCount,
    })),
    finiteTokenTransition: {
      consumedFiniteToken: {
        tokenId: 'p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover',
        sourceLaterPrimeBucketCount: 15,
        sourceRowCount: classifiedRows.length,
        sourceLaterQAvoidingClassCount,
        status: 'consumed_by_row_uniform_next_obstruction_batch_cover',
      },
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_obstruction_root_children',
          nextObstructionPrimeBucketCount: nextObstructionPrimeBuckets.length,
          rootChildCount: nextRootChildCount,
          status: 'square_obstruction_children_emitted_not_descended',
        },
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_q_avoiding_boundary',
          nextObstructionPrimeBucketCount: nextObstructionPrimeBuckets.length,
          qAvoidingClassCount: nextQAvoidingClassCount,
          status: 'ranked_boundary_open_for_convergence_assembly',
        },
      ],
    },
    proofBoundary: 'This packet batch-classifies the q-avoiding rank boundary emitted by the deterministic 15 later-prime buckets: all 3,652,250,197,976,151 source later q-avoiding classes have a row-uniform next square-obstruction child by prime 223. It does not close the 7,304,500,395,952,302 next root children, the 94,524,741,190,958,970,657 next q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'run_p848_convergence_assembly_after_later_prime_15_bucket_q_avoiding_batch_cover',
      action: 'Run convergence assembly after the 15-bucket later-prime q-avoiding batch cover and choose whether to compress the 17 next-obstruction-prime buckets, prove a structural rank decrease, or emit a deterministic boundary for the enlarged next q-avoiding rank surface.',
      coveredFamily: 'The 17 next-obstruction-prime buckets emitted from 3,652,250,197,976,151 later q-avoiding classes, with 7,304,500,395,952,302 next root children and 94,524,741,190,958,970,657 next q-avoiding classes.',
      finiteDenominatorOrRankToken: 'Finite token p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover grouped by next obstruction primes 131 through 223.',
      failureBoundary: 'If no compression theorem exists, emit a deterministic ranked boundary packet over all 17 next-prime buckets and do not descend into singleton root children.',
      completionRule: 'Assembly must choose bucket compression, structural decomposition, impossibility, or ranked transition before any singleton q-child descent.',
    },
    recommendedNextAction: 'run_p848_convergence_assembly_after_later_prime_15_bucket_q_avoiding_batch_cover',
    nextTheoremMove: 'Run convergence assembly over the 17 next-obstruction-prime buckets emitted by the 15-bucket later-prime q-avoiding batch cover; singleton q-child descent remains blocked until that assembly selects a finite token.',
    claims: {
      consumes15BucketLaterPrimeQAvoidingToken: true,
      classifiesAll15SourceBucketTokens: true,
      classifiesAllSourceRows: classifiedRows.length === 718,
      classifiesAllLaterQAvoidingClasses: sourceLaterQAvoidingClassCount === '3652250197976151',
      survivorSourceRowCount: survivorRows.length,
      survivorLaterQAvoidingClassCount,
      allRowsHaveTwoNextRoots: true,
      emitsSeventeenNextPrimeBuckets: nextObstructionPrimeBuckets.length === 17,
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
  lines.push('# P848 P4217 later-prime 15-bucket q-avoiding batch cover');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source later-prime buckets: ${packet.batchCoverSummary.sourceLaterPrimeBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.batchCoverSummary.sourceRowCount}`);
  lines.push(`- Source later q-avoiding classes accounted: ${packet.batchCoverSummary.sourceLaterQAvoidingClassCount}`);
  lines.push(`- Next-prime buckets: ${packet.batchCoverSummary.nextObstructionPrimeBucketCount}`);
  lines.push(`- Next-prime range: ${packet.batchCoverSummary.minNextObstructionPrime}..${packet.batchCoverSummary.maxNextObstructionPrime}`);
  lines.push(`- Next root children emitted: ${packet.batchCoverSummary.totalNextRootChildCount}`);
  lines.push(`- Next q-avoiding rank classes: ${packet.batchCoverSummary.totalNextQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.batchCoverSummary.survivorSourceRowCount}`);
  lines.push(`- Survivor later q-avoiding classes: ${packet.batchCoverSummary.survivorLaterQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Next Bucket Tokens');
  lines.push('');
  for (const bucket of packet.nextObstructionPrimeBuckets) {
    lines.push(`- q${bucket.nextObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourceLaterQAvoidingClassCount} source later q-avoiding classes, ${bucket.nextRootChildCount} next root children, ${bucket.nextQAvoidingClassCount} next q-avoiding classes.`);
  }
  lines.push('');
  lines.push('## Mechanism');
  lines.push('');
  lines.push(packet.proofMechanism.statement);
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
