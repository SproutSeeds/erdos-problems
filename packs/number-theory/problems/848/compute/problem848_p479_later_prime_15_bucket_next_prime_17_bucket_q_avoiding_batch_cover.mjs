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
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_RANK_BOUNDARY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.md',
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

function addBigIntStrings(left, right) {
  return (BigInt(left ?? 0) + BigInt(right ?? 0)).toString();
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
    sourceNextQAvoidingClassCount: '0',
  };
  current.sourceRowCount += 1;
  current.sourceNextQAvoidingClassCount = addBigIntStrings(current.sourceNextQAvoidingClassCount, count);
  map.set(key, current);
}

function addToPostNextBucketSummary(summary, row) {
  const current = summary.get(row.postNextObstructionPrime) ?? {
    sourceRowCount: 0,
    sourceNextQAvoidingClassCount: '0',
    postNextRootChildCount: '0',
    postNextQAvoidingClassCount: '0',
    previousNextPrimeBuckets: new Map(),
    previousLaterPrimeBuckets: new Map(),
    rootResidueCounts: new Set(),
  };
  current.sourceRowCount += 1;
  current.sourceNextQAvoidingClassCount = addBigIntStrings(
    current.sourceNextQAvoidingClassCount,
    row.sourceNextQAvoidingClassCount,
  );
  current.postNextRootChildCount = addBigIntStrings(current.postNextRootChildCount, row.postNextRootChildCount);
  current.postNextQAvoidingClassCount = addBigIntStrings(
    current.postNextQAvoidingClassCount,
    row.postNextQAvoidingClassCount,
  );
  current.rootResidueCounts.add(row.postNextRootResidueCount);
  addNestedBucket(current.previousNextPrimeBuckets, row.nextObstructionPrime, row.sourceNextQAvoidingClassCount);
  addNestedBucket(current.previousLaterPrimeBuckets, row.laterObstructionPrime, row.sourceNextQAvoidingClassCount);
  summary.set(row.postNextObstructionPrime, current);
}

function compactPostNextBucketSummary(summary) {
  return summarizeMap(summary, 'postNextObstructionPrime').map((bucket) => ({
    postNextObstructionPrime: bucket.postNextObstructionPrime,
    postNextObstructionSquare: bucket.postNextObstructionPrime * bucket.postNextObstructionPrime,
    sourceRowCount: bucket.sourceRowCount,
    sourceNextQAvoidingClassCount: bucket.sourceNextQAvoidingClassCount,
    rootResidueCountsPerClass: [...bucket.rootResidueCounts].sort((left, right) => left - right),
    postNextRootChildCount: bucket.postNextRootChildCount,
    postNextQAvoidingClassCount: bucket.postNextQAvoidingClassCount,
    previousNextPrimeBuckets: summarizeMap(bucket.previousNextPrimeBuckets, 'previousNextObstructionPrime'),
    previousLaterPrimeBuckets: summarizeMap(bucket.previousLaterPrimeBuckets, 'previousLaterObstructionPrime'),
    status: 'open_exact_two_root_post_next_rank_boundary',
  }));
}

function addToPreviousNextBucketSummary(summary, row) {
  const current = summary.get(row.nextObstructionPrime) ?? {
    sourceRowCount: 0,
    sourceNextQAvoidingClassCount: '0',
    postNextRootChildCount: '0',
    postNextQAvoidingClassCount: '0',
    postNextObstructionPrimeBuckets: new Map(),
  };
  current.sourceRowCount += 1;
  current.sourceNextQAvoidingClassCount = addBigIntStrings(
    current.sourceNextQAvoidingClassCount,
    row.sourceNextQAvoidingClassCount,
  );
  current.postNextRootChildCount = addBigIntStrings(current.postNextRootChildCount, row.postNextRootChildCount);
  current.postNextQAvoidingClassCount = addBigIntStrings(
    current.postNextQAvoidingClassCount,
    row.postNextQAvoidingClassCount,
  );
  addNestedBucket(
    current.postNextObstructionPrimeBuckets,
    row.postNextObstructionPrime,
    row.sourceNextQAvoidingClassCount,
  );
  summary.set(row.nextObstructionPrime, current);
}

function compactPreviousNextBucketSummary(summary) {
  return summarizeMap(summary, 'previousNextObstructionPrime').map((bucket) => ({
    previousNextObstructionPrime: bucket.previousNextObstructionPrime,
    previousNextObstructionSquare: bucket.previousNextObstructionPrime * bucket.previousNextObstructionPrime,
    sourceRowCount: bucket.sourceRowCount,
    sourceNextQAvoidingClassCount: bucket.sourceNextQAvoidingClassCount,
    postNextRootChildCount: bucket.postNextRootChildCount,
    postNextQAvoidingClassCount: bucket.postNextQAvoidingClassCount,
    postNextObstructionPrimeBuckets: summarizeMap(
      bucket.postNextObstructionPrimeBuckets,
      'postNextObstructionPrime',
    ),
  }));
}

function sumString(rows, key) {
  return rows.reduce((sum, row) => sum + BigInt(row[key] ?? 0), 0n).toString();
}

function classifyRow(row, primes, maxPrime, rootCache) {
  const sourceNextQAvoidingClassCount = BigInt(row.nextQAvoidingClassCount);

  for (const prime of primes) {
    if (prime <= row.nextObstructionPrime) {
      continue;
    }
    if (prime > maxPrime) {
      break;
    }

    const roots = rootsForDelta(row.delta, prime, rootCache);
    if (roots.length === 0) {
      continue;
    }

    const postNextObstructionSquare = prime * prime;
    const postNextRootChildCount = sourceNextQAvoidingClassCount * BigInt(roots.length);
    const postNextQAvoidingClassCount = sourceNextQAvoidingClassCount * BigInt(postNextObstructionSquare - roots.length);
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
      sourceNextQAvoidingClassCountOriginal: row.sourceNextQAvoidingClassCount,
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
      sourceNextQAvoidingClassCount: sourceNextQAvoidingClassCount.toString(),
      postNextObstructionPrime: prime,
      postNextObstructionSquare,
      postNextRootResidueCount: roots.length,
      postNextRootResidues: roots,
      postNextRootChildCount: postNextRootChildCount.toString(),
      postNextQAvoidingClassCount: postNextQAvoidingClassCount.toString(),
      inheritedNoSmallerObstruction: true,
      previousNextPrimeExcludedByQAvoidingBoundary: true,
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
    sourceNextQAvoidingClassCountOriginal: row.sourceNextQAvoidingClassCount,
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
    sourceNextQAvoidingClassCount: sourceNextQAvoidingClassCount.toString(),
    postNextObstructionPrime: null,
    postNextObstructionSquare: null,
    postNextRootResidueCount: 0,
    postNextRootResidues: [],
    postNextRootChildCount: '0',
    postNextQAvoidingClassCount: sourceNextQAvoidingClassCount.toString(),
    inheritedNoSmallerObstruction: true,
    previousNextPrimeExcludedByQAvoidingBoundary: true,
  };
}

function buildPacket(options) {
  const sourceCover = readJson(options.sourceCoverPacket);
  const rankBoundary = readJson(options.rankBoundaryPacket);

  assertCondition(sourceCover.status === 'all_15_bucket_later_prime_q_avoiding_classes_have_next_square_obstruction_child', 'source cover status mismatch');
  assertCondition(rankBoundary.status === 'p479_later_prime_15_bucket_next_prime_17_bucket_deterministic_rank_boundary_emitted', 'rank-boundary status mismatch');
  assertCondition(rankBoundary.recommendedNextAction === 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_or_emit_boundary', 'rank-boundary next action mismatch');

  const rows = sourceCover.rowClassifications ?? [];
  assertCondition(rows.length === 718, 'expected 718 source row classifications');
  assertCondition(
    BigInt(rankBoundary.boundarySummary?.totalNextQAvoidingClassCount ?? 0) === BigInt(sourceCover.batchCoverSummary?.totalNextQAvoidingClassCount ?? 0),
    'next q-avoiding total mismatch between source cover and rank boundary',
  );

  const primes = primeSieve(options.maxPrime);
  const rootCache = new Map();
  const classifiedRows = rows.map((row) => classifyRow(row, primes, options.maxPrime, rootCache));
  const survivorRows = classifiedRows.filter((row) => row.postNextObstructionPrime === null);
  const postNextBucketMap = new Map();
  const previousNextBucketMap = new Map();

  for (const row of classifiedRows) {
    if (row.postNextObstructionPrime !== null) {
      addToPostNextBucketSummary(postNextBucketMap, row);
    }
    addToPreviousNextBucketSummary(previousNextBucketMap, row);
  }

  const postNextObstructionPrimeBuckets = compactPostNextBucketSummary(postNextBucketMap);
  const previousNextPrimeBucketSummaries = compactPreviousNextBucketSummary(previousNextBucketMap);
  const sourceNextQAvoidingClassCount = sumString(classifiedRows, 'sourceNextQAvoidingClassCount');
  const postNextRootChildCount = sumString(classifiedRows, 'postNextRootChildCount');
  const postNextQAvoidingClassCount = sumString(classifiedRows, 'postNextQAvoidingClassCount');
  const survivorNextQAvoidingClassCount = sumString(survivorRows, 'sourceNextQAvoidingClassCount');
  const postNextRootResidueCounts = [...new Set(classifiedRows.map((row) => row.postNextRootResidueCount))]
    .sort((left, right) => left - right);

  assertCondition(sourceNextQAvoidingClassCount === decimal(rankBoundary.boundarySummary.totalNextQAvoidingClassCount), 'source next q-avoiding total mismatch');
  assertCondition(survivorRows.length === 0, `expected no survivor rows, found ${survivorRows.length}`);
  assertCondition(survivorNextQAvoidingClassCount === '0', `expected no survivor classes, found ${survivorNextQAvoidingClassCount}`);
  assertCondition(postNextRootResidueCounts.length === 1 && postNextRootResidueCounts[0] === 2, 'expected a two-root post-next obstruction law');
  assertCondition(postNextObstructionPrimeBuckets.length === 20, 'expected 20 post-next obstruction prime buckets');

  const postNextObstructionPrimes = postNextObstructionPrimeBuckets.map((bucket) => bucket.postNextObstructionPrime);
  const inputToken = rankBoundary.finiteTokenTransition?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover',
    bucketCount: 17,
    qAvoidingClassCount: sourceNextQAvoidingClassCount,
    status: 'selected',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'all_17_bucket_next_prime_q_avoiding_classes_have_later_square_obstruction_child',
    target: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_or_emit_boundary',
    sourceAudit: {
      laterPrime15BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.sourceCoverPacket),
        sha256: sha256File(options.sourceCoverPacket),
        status: sourceCover.status,
      },
      laterPrime15BucketNextPrime17BucketRankBoundaryPacket: {
        path: path.relative(repoRoot, options.rankBoundaryPacket),
        sha256: sha256File(options.rankBoundaryPacket),
        status: rankBoundary.status,
      },
    },
    inputRankToken: inputToken,
    batchCoverSummary: {
      sourceNextPrimeBucketCount: 17,
      sourceRowCount: classifiedRows.length,
      sourceNextQAvoidingClassCount,
      classifiedNextQAvoidingClassCount: addBigIntStrings(sourceNextQAvoidingClassCount, `-${survivorNextQAvoidingClassCount}`),
      survivorSourceRowCount: survivorRows.length,
      survivorNextQAvoidingClassCount,
      postNextObstructionPrimeBucketCount: postNextObstructionPrimeBuckets.length,
      minPostNextObstructionPrime: postNextObstructionPrimes[0] ?? null,
      maxPostNextObstructionPrime: postNextObstructionPrimes.at(-1) ?? null,
      postNextRootResidueCounts,
      totalPostNextRootChildCount: postNextRootChildCount,
      totalPostNextQAvoidingClassCount: postNextQAvoidingClassCount,
      maxCheckedPrime: options.maxPrime,
      rootCacheEntryCount: rootCache.size,
    },
    proofMechanism: {
      theoremId: 'p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_row_uniform_later_obstruction',
      status: 'proved_for_recorded_17_bucket_next_prime_q_avoiding_boundary_not_terminal_closure',
      statement: 'For every recorded row in the deterministic 17-bucket next-prime q-avoiding boundary, the previous next obstruction prime is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions from the prior first-obstruction classifications; the first later prime with roots of y*(y+delta)+1 modulo s^2 gives a row-uniform square-obstruction child for every descendant class of that row.',
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover.mjs --pretty',
      proofSketch: [
        'Read the 718 row classifications from the 15-bucket later-prime q-avoiding batch cover and the deterministic 17-bucket next-prime rank boundary.',
        'Use each row next q-avoiding class count emitted by the 17-bucket rank boundary as the source class count for this layer.',
        'Skip primes at or below the current next obstruction prime because the previous layer already made it the first next obstruction and this q-avoiding layer excludes that prime.',
        'For later primes s, solve y*(y+delta)+1 == 0 mod s^2. The first s with roots is row-uniform across the inherited next q-avoiding descendant classes.',
        'All 718 source rows have a first later two-root obstruction prime at or below q239, so all 94,524,741,190,958,970,657 next q-avoiding classes are classified with no survivors.',
      ],
    },
    postNextObstructionPrimeBuckets,
    previousNextPrimeBucketSummaries,
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
      sourceNextQAvoidingClassCountOriginal: row.sourceNextQAvoidingClassCountOriginal,
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
      sourceNextQAvoidingClassCount: row.sourceNextQAvoidingClassCount,
      postNextObstructionPrime: row.postNextObstructionPrime,
      postNextObstructionSquare: row.postNextObstructionSquare,
      postNextRootResidueCount: row.postNextRootResidueCount,
      postNextRootResidues: row.postNextRootResidues,
      postNextRootChildCount: row.postNextRootChildCount,
      postNextQAvoidingClassCount: row.postNextQAvoidingClassCount,
    })),
    finiteTokenTransition: {
      consumedFiniteToken: {
        tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover',
        sourceNextPrimeBucketCount: 17,
        sourceRowCount: classifiedRows.length,
        sourceNextQAvoidingClassCount,
        status: 'consumed_by_row_uniform_later_obstruction_batch_cover',
      },
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_obstruction_root_children',
          postNextObstructionPrimeBucketCount: postNextObstructionPrimeBuckets.length,
          rootChildCount: postNextRootChildCount,
          status: 'square_obstruction_children_emitted_not_descended',
        },
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_q_avoiding_boundary',
          postNextObstructionPrimeBucketCount: postNextObstructionPrimeBuckets.length,
          qAvoidingClassCount: postNextQAvoidingClassCount,
          status: 'ranked_boundary_open_for_convergence_assembly',
        },
      ],
    },
    proofBoundary: 'This packet batch-classifies the q-avoiding rank boundary emitted by the deterministic 17 next-prime buckets: all 94,524,741,190,958,970,657 source next q-avoiding classes have a row-uniform later square-obstruction child by prime 239. It does not close the 189,049,482,381,917,941,314 later root children, the 2,946,810,455,708,641,575,397,311 later q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover',
      action: 'Run convergence assembly after the 17-bucket next-prime q-avoiding batch cover and choose whether to compress the 20 post-next obstruction-prime buckets, prove a structural rank decrease, or emit a deterministic boundary for the enlarged q-avoiding rank surface.',
      coveredFamily: 'The 20 post-next obstruction-prime buckets emitted from 94,524,741,190,958,970,657 next q-avoiding classes, with 189,049,482,381,917,941,314 later root children and 2,946,810,455,708,641,575,397,311 later q-avoiding classes.',
      finiteDenominatorOrRankToken: 'Finite token p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover grouped by post-next obstruction primes 137 through 239.',
      failureBoundary: 'If no compression theorem exists, emit a deterministic ranked boundary packet over all 20 post-next buckets and do not descend into singleton root children.',
      completionRule: 'Assembly must choose bucket compression, structural decomposition, impossibility, or ranked transition before any singleton q-child descent.',
    },
    recommendedNextAction: 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover',
    nextTheoremMove: 'Run convergence assembly over the 20 post-next obstruction-prime buckets emitted by the 17-bucket next-prime q-avoiding batch cover; singleton q-child descent remains blocked until that assembly selects a finite token.',
    claims: {
      consumes17BucketNextPrimeQAvoidingToken: true,
      classifiesAll17SourceBucketTokens: true,
      classifiesAllSourceRows: classifiedRows.length === 718,
      classifiesAllNextQAvoidingClasses: sourceNextQAvoidingClassCount === '94524741190958970657',
      survivorSourceRowCount: survivorRows.length,
      survivorNextQAvoidingClassCount,
      allRowsHaveTwoPostNextRoots: true,
      emitsTwentyPostNextPrimeBuckets: postNextObstructionPrimeBuckets.length === 20,
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
  lines.push('# P848 P4217 later-prime 15-bucket next-prime 17-bucket q-avoiding batch cover');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source next-prime buckets: ${packet.batchCoverSummary.sourceNextPrimeBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.batchCoverSummary.sourceRowCount}`);
  lines.push(`- Source next q-avoiding classes accounted: ${packet.batchCoverSummary.sourceNextQAvoidingClassCount}`);
  lines.push(`- Post-next buckets: ${packet.batchCoverSummary.postNextObstructionPrimeBucketCount}`);
  lines.push(`- Post-next prime range: ${packet.batchCoverSummary.minPostNextObstructionPrime}..${packet.batchCoverSummary.maxPostNextObstructionPrime}`);
  lines.push(`- Later root children emitted: ${packet.batchCoverSummary.totalPostNextRootChildCount}`);
  lines.push(`- Later q-avoiding rank classes: ${packet.batchCoverSummary.totalPostNextQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.batchCoverSummary.survivorSourceRowCount}`);
  lines.push(`- Survivor next q-avoiding classes: ${packet.batchCoverSummary.survivorNextQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Post-Next Bucket Tokens');
  lines.push('');
  for (const bucket of packet.postNextObstructionPrimeBuckets) {
    lines.push(`- q${bucket.postNextObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourceNextQAvoidingClassCount} source next q-avoiding classes, ${bucket.postNextRootChildCount} later root children, ${bucket.postNextQAvoidingClassCount} later q-avoiding classes.`);
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
