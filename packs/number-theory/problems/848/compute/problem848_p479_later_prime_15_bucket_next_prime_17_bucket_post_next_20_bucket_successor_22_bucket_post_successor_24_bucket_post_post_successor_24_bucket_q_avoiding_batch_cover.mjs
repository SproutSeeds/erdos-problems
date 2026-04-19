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
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_RANK_BOUNDARY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.md',
);

function parseArgs(argv) {
  const options = {
    sourceCoverPacket: DEFAULT_SOURCE_COVER_PACKET,
    rankBoundaryPacket: DEFAULT_RANK_BOUNDARY_PACKET,
    maxPrime: 5000,
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
    sourcePostPostSuccessorQAvoidingClassCount: '0',
  };
  current.sourceRowCount += 1;
  current.sourcePostPostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.sourcePostPostSuccessorQAvoidingClassCount,
    count,
  );
  map.set(key, current);
}

function addToPostPostPostSuccessorBucketSummary(summary, row) {
  const current = summary.get(row.postPostPostSuccessorObstructionPrime) ?? {
    sourceRowCount: 0,
    sourcePostPostSuccessorQAvoidingClassCount: '0',
    postPostPostSuccessorRootChildCount: '0',
    postPostPostSuccessorQAvoidingClassCount: '0',
    previousPostPostSuccessorPrimeBuckets: new Map(),
    previousPostSuccessorPrimeBuckets: new Map(),
    previousSuccessorPrimeBuckets: new Map(),
    previousPostNextPrimeBuckets: new Map(),
    previousNextPrimeBuckets: new Map(),
    previousLaterPrimeBuckets: new Map(),
    rootResidueCounts: new Set(),
  };
  current.sourceRowCount += 1;
  current.sourcePostPostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.sourcePostPostSuccessorQAvoidingClassCount,
    row.sourcePostPostSuccessorQAvoidingClassCount,
  );
  current.postPostPostSuccessorRootChildCount = addBigIntStrings(
    current.postPostPostSuccessorRootChildCount,
    row.postPostPostSuccessorRootChildCount,
  );
  current.postPostPostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.postPostPostSuccessorQAvoidingClassCount,
    row.postPostPostSuccessorQAvoidingClassCount,
  );
  current.rootResidueCounts.add(row.postPostPostSuccessorRootResidueCount);
  addNestedBucket(current.previousPostPostSuccessorPrimeBuckets, row.postPostSuccessorObstructionPrime, row.sourcePostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousPostSuccessorPrimeBuckets, row.postSuccessorObstructionPrime, row.sourcePostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousSuccessorPrimeBuckets, row.successorObstructionPrime, row.sourcePostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousPostNextPrimeBuckets, row.postNextObstructionPrime, row.sourcePostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousNextPrimeBuckets, row.nextObstructionPrime, row.sourcePostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousLaterPrimeBuckets, row.laterObstructionPrime, row.sourcePostPostSuccessorQAvoidingClassCount);
  summary.set(row.postPostPostSuccessorObstructionPrime, current);
}

function normalizeNestedBuckets(map, keyName) {
  return summarizeMap(map, keyName);
}

function compactPostPostPostSuccessorBucketSummary(summary) {
  return summarizeMap(summary, 'postPostPostSuccessorObstructionPrime').map((bucket) => ({
    postPostPostSuccessorObstructionPrime: bucket.postPostPostSuccessorObstructionPrime,
    postPostPostSuccessorObstructionSquare: bucket.postPostPostSuccessorObstructionPrime * bucket.postPostPostSuccessorObstructionPrime,
    sourceRowCount: bucket.sourceRowCount,
    sourcePostPostSuccessorQAvoidingClassCount: bucket.sourcePostPostSuccessorQAvoidingClassCount,
    rootResidueCountsPerClass: [...bucket.rootResidueCounts].sort((left, right) => left - right),
    postPostPostSuccessorRootChildCount: bucket.postPostPostSuccessorRootChildCount,
    postPostPostSuccessorQAvoidingClassCount: bucket.postPostPostSuccessorQAvoidingClassCount,
    previousPostPostSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousPostPostSuccessorPrimeBuckets, 'previousPostPostSuccessorObstructionPrime'),
    previousPostSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousPostSuccessorPrimeBuckets, 'previousPostSuccessorObstructionPrime'),
    previousSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousSuccessorPrimeBuckets, 'previousSuccessorObstructionPrime'),
    previousPostNextPrimeBuckets: normalizeNestedBuckets(bucket.previousPostNextPrimeBuckets, 'previousPostNextObstructionPrime'),
    previousNextPrimeBuckets: normalizeNestedBuckets(bucket.previousNextPrimeBuckets, 'previousNextObstructionPrime'),
    previousLaterPrimeBuckets: normalizeNestedBuckets(bucket.previousLaterPrimeBuckets, 'previousLaterObstructionPrime'),
    status: 'open_exact_two_root_post_post_post_successor_rank_boundary',
  }));
}

function sumString(rows, key) {
  return rows.reduce((sum, row) => sum + BigInt(row[key] ?? 0), 0n).toString();
}

function baseRowFields(row) {
  return {
    sourceFamilyId: row.sourceFamilyId,
    sourceFamilyKind: row.sourceFamilyKind,
    residueModulo479Square: row.residueModulo479Square,
    k: row.k,
    delta: row.delta,
    parentObstructionPrime: row.parentObstructionPrime,
    sourceNextObstructionPrime: row.sourceNextObstructionPrime,
    laterObstructionPrime: row.laterObstructionPrime,
    nextObstructionPrime: row.nextObstructionPrime,
    postNextObstructionPrime: row.postNextObstructionPrime,
    postNextObstructionSquare: row.postNextObstructionSquare,
    postNextRootResidueCount: row.postNextRootResidueCount,
    postNextRootResidues: row.postNextRootResidues,
    postNextRootChildCount: row.postNextRootChildCount,
    sourcePostNextQAvoidingClassCount: row.sourcePostNextQAvoidingClassCount,
    successorObstructionPrime: row.successorObstructionPrime,
    successorObstructionSquare: row.successorObstructionSquare,
    successorRootResidueCount: row.successorRootResidueCount,
    successorRootResidues: row.successorRootResidues,
    successorRootChildCount: row.successorRootChildCount,
    sourceSuccessorQAvoidingClassCount: row.sourceSuccessorQAvoidingClassCount,
    postSuccessorObstructionPrime: row.postSuccessorObstructionPrime,
    postSuccessorObstructionSquare: row.postSuccessorObstructionSquare,
    postSuccessorRootResidueCount: row.postSuccessorRootResidueCount,
    postSuccessorRootResidues: row.postSuccessorRootResidues,
    postSuccessorRootChildCount: row.postSuccessorRootChildCount,
    sourcePostSuccessorQAvoidingClassCount: row.sourcePostSuccessorQAvoidingClassCount,
    postPostSuccessorObstructionPrime: row.postPostSuccessorObstructionPrime,
    postPostSuccessorObstructionSquare: row.postPostSuccessorObstructionSquare,
    postPostSuccessorRootResidueCount: row.postPostSuccessorRootResidueCount,
    postPostSuccessorRootResidues: row.postPostSuccessorRootResidues,
    postPostSuccessorRootChildCount: row.postPostSuccessorRootChildCount,
    postPostSuccessorQAvoidingClassCount: row.postPostSuccessorQAvoidingClassCount,
  };
}

function classifyRow(row, primes, maxPrime, rootCache) {
  const sourcePostPostSuccessorQAvoidingClassCount = BigInt(row.postPostSuccessorQAvoidingClassCount);

  for (const prime of primes) {
    if (prime <= row.postPostSuccessorObstructionPrime) {
      continue;
    }
    if (prime > maxPrime) {
      break;
    }

    const roots = rootsForDelta(row.delta, prime, rootCache);
    if (roots.length === 0) {
      continue;
    }

    const postPostPostSuccessorObstructionSquare = prime * prime;
    const postPostPostSuccessorRootChildCount = sourcePostPostSuccessorQAvoidingClassCount * BigInt(roots.length);
    const postPostPostSuccessorQAvoidingClassCount = sourcePostPostSuccessorQAvoidingClassCount * BigInt(postPostPostSuccessorObstructionSquare - roots.length);
    return {
      ...baseRowFields(row),
      sourcePostPostSuccessorQAvoidingClassCount: sourcePostPostSuccessorQAvoidingClassCount.toString(),
      postPostPostSuccessorObstructionPrime: prime,
      postPostPostSuccessorObstructionSquare,
      postPostPostSuccessorRootResidueCount: roots.length,
      postPostPostSuccessorRootResidues: roots,
      postPostPostSuccessorRootChildCount: postPostPostSuccessorRootChildCount.toString(),
      postPostPostSuccessorQAvoidingClassCount: postPostPostSuccessorQAvoidingClassCount.toString(),
      inheritedNoSmallerObstruction: true,
      previousPostPostSuccessorPrimeExcludedByQAvoidingBoundary: true,
    };
  }

  return {
    ...baseRowFields(row),
    sourcePostPostSuccessorQAvoidingClassCount: sourcePostPostSuccessorQAvoidingClassCount.toString(),
    postPostPostSuccessorObstructionPrime: null,
    postPostPostSuccessorObstructionSquare: null,
    postPostPostSuccessorRootResidueCount: 0,
    postPostPostSuccessorRootResidues: [],
    postPostPostSuccessorRootChildCount: '0',
    postPostPostSuccessorQAvoidingClassCount: sourcePostPostSuccessorQAvoidingClassCount.toString(),
    inheritedNoSmallerObstruction: true,
    previousPostPostSuccessorPrimeExcludedByQAvoidingBoundary: true,
  };
}

function buildPacket(options) {
  const sourceCover = readJson(options.sourceCoverPacket);
  const rankBoundary = readJson(options.rankBoundaryPacket);

  assertCondition(sourceCover.status === 'all_24_bucket_post_successor_q_avoiding_classes_have_later_square_obstruction_child', 'source cover status mismatch');
  assertCondition(rankBoundary.status === 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_deterministic_rank_boundary_emitted', 'rank-boundary status mismatch');
  assertCondition(rankBoundary.recommendedNextAction === 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary', 'rank-boundary next action mismatch');

  const rows = sourceCover.rowClassifications ?? [];
  assertCondition(rows.length === 718, 'expected 718 source row classifications');
  assertCondition(
    BigInt(rankBoundary.boundarySummary?.totalPostPostSuccessorQAvoidingClassCount ?? 0) === BigInt(sourceCover.batchCoverSummary?.totalPostPostSuccessorQAvoidingClassCount ?? 0),
    'post-post-successor q-avoiding total mismatch between source cover and rank boundary',
  );

  const primes = primeSieve(options.maxPrime);
  const rootCache = new Map();
  const classifiedRows = rows.map((row) => classifyRow(row, primes, options.maxPrime, rootCache));
  const survivorRows = classifiedRows.filter((row) => row.postPostPostSuccessorObstructionPrime === null);
  const postPostPostSuccessorBucketMap = new Map();

  for (const row of classifiedRows) {
    if (row.postPostPostSuccessorObstructionPrime !== null) {
      addToPostPostPostSuccessorBucketSummary(postPostPostSuccessorBucketMap, row);
    }
  }

  const postPostPostSuccessorObstructionPrimeBuckets = compactPostPostPostSuccessorBucketSummary(postPostPostSuccessorBucketMap);
  const sourcePostPostSuccessorQAvoidingClassCount = sumString(classifiedRows, 'sourcePostPostSuccessorQAvoidingClassCount');
  const postPostPostSuccessorRootChildCount = sumString(classifiedRows, 'postPostPostSuccessorRootChildCount');
  const postPostPostSuccessorQAvoidingClassCount = sumString(classifiedRows, 'postPostPostSuccessorQAvoidingClassCount');
  const survivorPostPostSuccessorQAvoidingClassCount = sumString(survivorRows, 'sourcePostPostSuccessorQAvoidingClassCount');
  const postPostPostSuccessorRootResidueCounts = [...new Set(classifiedRows.map((row) => row.postPostPostSuccessorRootResidueCount))]
    .sort((left, right) => left - right);

  assertCondition(sourcePostPostSuccessorQAvoidingClassCount === decimal(rankBoundary.boundarySummary.totalPostPostSuccessorQAvoidingClassCount), 'source post-post-successor q-avoiding total mismatch');
  assertCondition(survivorRows.length === 0, `expected no survivor rows, found ${survivorRows.length}`);
  assertCondition(survivorPostPostSuccessorQAvoidingClassCount === '0', `expected no survivor classes, found ${survivorPostPostSuccessorQAvoidingClassCount}`);
  assertCondition(postPostPostSuccessorRootResidueCounts.length === 1 && postPostPostSuccessorRootResidueCounts[0] === 2, 'expected a two-root post-post-post-successor obstruction law');
  assertCondition(postPostPostSuccessorObstructionPrimeBuckets.length === 26, 'expected 26 post-post-post-successor obstruction prime buckets');

  const postPostPostSuccessorObstructionPrimes = postPostPostSuccessorObstructionPrimeBuckets.map((bucket) => bucket.postPostPostSuccessorObstructionPrime);
  const inputToken = rankBoundary.finiteTokenTransition?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover',
    bucketCount: 24,
    qAvoidingClassCount: sourcePostPostSuccessorQAvoidingClassCount,
    status: 'selected',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'all_24_bucket_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child',
    target: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary',
    sourceAudit: {
      postSuccessor24BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.sourceCoverPacket),
        sha256: sha256File(options.sourceCoverPacket),
        status: sourceCover.status,
      },
      postPostSuccessor24BucketRankBoundaryPacket: {
        path: path.relative(repoRoot, options.rankBoundaryPacket),
        sha256: sha256File(options.rankBoundaryPacket),
        status: rankBoundary.status,
      },
    },
    inputRankToken: inputToken,
    batchCoverSummary: {
      sourcePostPostSuccessorBucketCount: 24,
      sourceRowCount: classifiedRows.length,
      sourcePostPostSuccessorQAvoidingClassCount,
      classifiedPostPostSuccessorQAvoidingClassCount: addBigIntStrings(sourcePostPostSuccessorQAvoidingClassCount, `-${survivorPostPostSuccessorQAvoidingClassCount}`),
      survivorSourceRowCount: survivorRows.length,
      survivorPostPostSuccessorQAvoidingClassCount,
      postPostPostSuccessorObstructionPrimeBucketCount: postPostPostSuccessorObstructionPrimeBuckets.length,
      minPostPostPostSuccessorObstructionPrime: postPostPostSuccessorObstructionPrimes[0] ?? null,
      maxPostPostPostSuccessorObstructionPrime: postPostPostSuccessorObstructionPrimes.at(-1) ?? null,
      postPostPostSuccessorRootResidueCounts,
      totalPostPostPostSuccessorRootChildCount: postPostPostSuccessorRootChildCount,
      totalPostPostPostSuccessorQAvoidingClassCount: postPostPostSuccessorQAvoidingClassCount,
      maxCheckedPrime: options.maxPrime,
      rootCacheEntryCount: rootCache.size,
    },
    proofMechanism: {
      theoremId: 'p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_row_uniform_post_post_post_successor_obstruction',
      status: 'proved_for_recorded_24_bucket_post_post_successor_q_avoiding_boundary_not_terminal_closure',
      statement: 'For every recorded row in the deterministic 24-bucket post-post-successor q-avoiding boundary, the previous post-post-successor obstruction prime is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions from the prior first-obstruction classifications; the first later prime with roots of y*(y+delta)+1 modulo s^2 gives a row-uniform square-obstruction child for every descendant class of that row.',
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover.mjs --pretty',
      proofSketch: [
        'Read the 718 row classifications from the 24-bucket post-successor q-avoiding batch cover and the deterministic 24-bucket post-post-successor rank boundary.',
        'Use each row post-post-successor q-avoiding class count emitted by the 24-bucket rank boundary as the source class count for this layer.',
        'Skip primes at or below the current post-post-successor obstruction prime because the previous layer already made it the first post-post-successor obstruction and this q-avoiding layer excludes that prime.',
        'For later primes s, solve y*(y+delta)+1 == 0 mod s^2. The first s with roots is row-uniform across the inherited post-post-successor q-avoiding descendant classes.',
        'All 718 source rows have a first later two-root obstruction prime at or below q307, so all 272,895,494,027,351,286,884,102,031,165,661,158,393 post-post-successor q-avoiding classes are classified with no survivors.',
      ],
    },
    postPostPostSuccessorObstructionPrimeBuckets,
    rowClassifications: classifiedRows.map((row) => ({
      sourceFamilyId: row.sourceFamilyId,
      sourceFamilyKind: row.sourceFamilyKind,
      residueModulo479Square: row.residueModulo479Square,
      k: row.k,
      delta: row.delta,
      parentObstructionPrime: row.parentObstructionPrime,
      sourceNextObstructionPrime: row.sourceNextObstructionPrime,
      laterObstructionPrime: row.laterObstructionPrime,
      nextObstructionPrime: row.nextObstructionPrime,
      postNextObstructionPrime: row.postNextObstructionPrime,
      postNextObstructionSquare: row.postNextObstructionSquare,
      postNextRootResidueCount: row.postNextRootResidueCount,
      postNextRootResidues: row.postNextRootResidues,
      postNextRootChildCount: row.postNextRootChildCount,
      sourcePostNextQAvoidingClassCount: row.sourcePostNextQAvoidingClassCount,
      successorObstructionPrime: row.successorObstructionPrime,
      successorObstructionSquare: row.successorObstructionSquare,
      successorRootResidueCount: row.successorRootResidueCount,
      successorRootResidues: row.successorRootResidues,
      successorRootChildCount: row.successorRootChildCount,
      sourceSuccessorQAvoidingClassCount: row.sourceSuccessorQAvoidingClassCount,
      postSuccessorObstructionPrime: row.postSuccessorObstructionPrime,
      postSuccessorObstructionSquare: row.postSuccessorObstructionSquare,
      postSuccessorRootResidueCount: row.postSuccessorRootResidueCount,
      postSuccessorRootResidues: row.postSuccessorRootResidues,
      postSuccessorRootChildCount: row.postSuccessorRootChildCount,
      sourcePostSuccessorQAvoidingClassCount: row.sourcePostSuccessorQAvoidingClassCount,
      postPostSuccessorObstructionPrime: row.postPostSuccessorObstructionPrime,
      postPostSuccessorObstructionSquare: row.postPostSuccessorObstructionSquare,
      postPostSuccessorRootResidueCount: row.postPostSuccessorRootResidueCount,
      postPostSuccessorRootResidues: row.postPostSuccessorRootResidues,
      postPostSuccessorRootChildCount: row.postPostSuccessorRootChildCount,
      postPostSuccessorQAvoidingClassCount: row.postPostSuccessorQAvoidingClassCount,
      sourcePostPostSuccessorQAvoidingClassCount: row.sourcePostPostSuccessorQAvoidingClassCount,
      postPostPostSuccessorObstructionPrime: row.postPostPostSuccessorObstructionPrime,
      postPostPostSuccessorObstructionSquare: row.postPostPostSuccessorObstructionSquare,
      postPostPostSuccessorRootResidueCount: row.postPostPostSuccessorRootResidueCount,
      postPostPostSuccessorRootResidues: row.postPostPostSuccessorRootResidues,
      postPostPostSuccessorRootChildCount: row.postPostPostSuccessorRootChildCount,
      postPostPostSuccessorQAvoidingClassCount: row.postPostPostSuccessorQAvoidingClassCount,
    })),
    finiteTokenTransition: {
      consumedFiniteToken: {
        tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover',
        sourcePostPostSuccessorBucketCount: 24,
        sourceRowCount: classifiedRows.length,
        sourcePostPostSuccessorQAvoidingClassCount,
        status: 'consumed_by_row_uniform_post_post_post_successor_obstruction_batch_cover',
      },
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_root_children',
          postPostPostSuccessorObstructionPrimeBucketCount: postPostPostSuccessorObstructionPrimeBuckets.length,
          rootChildCount: postPostPostSuccessorRootChildCount,
          status: 'square_obstruction_children_emitted_not_descended',
        },
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_q_avoiding_boundary',
          postPostPostSuccessorObstructionPrimeBucketCount: postPostPostSuccessorObstructionPrimeBuckets.length,
          qAvoidingClassCount: postPostPostSuccessorQAvoidingClassCount,
          status: 'ranked_boundary_open_for_convergence_assembly',
        },
      ],
    },
    proofBoundary: 'This packet batch-classifies the q-avoiding rank boundary emitted by the deterministic 24 post-post-successor buckets: all 272,895,494,027,351,286,884,102,031,165,661,158,393 source post-post-successor q-avoiding classes have a row-uniform later square-obstruction child by prime 307. It does not close the 545,790,988,054,702,573,768,204,062,331,322,316,786 post-post-post-successor root children, the 17,122,811,411,360,928,250,603,246,815,478,193,773,776,015 post-post-post-successor q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover',
      action: 'Run convergence assembly after the 24-bucket post-post-successor q-avoiding batch cover and choose whether to compress the 26 post-post-post-successor obstruction-prime buckets, prove a structural rank decrease, or emit a deterministic boundary for the enlarged q-avoiding rank surface.',
      coveredFamily: 'The 26 post-post-post-successor obstruction-prime buckets emitted from 272,895,494,027,351,286,884,102,031,165,661,158,393 post-post-successor q-avoiding classes, with 545,790,988,054,702,573,768,204,062,331,322,316,786 post-post-post-successor root children and 17,122,811,411,360,928,250,603,246,815,478,193,773,776,015 post-post-post-successor q-avoiding classes.',
      finiteDenominatorOrRankToken: 'Finite token p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover grouped by post-post-post-successor obstruction primes 157 through 307.',
      failureBoundary: 'If no compression theorem exists, emit a deterministic ranked boundary packet over all 26 post-post-post-successor buckets and do not descend into singleton root children.',
      completionRule: 'Assembly must choose bucket compression, structural decomposition, impossibility, or ranked transition before any singleton q-child descent.',
    },
    recommendedNextAction: 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover',
    nextTheoremMove: 'Run convergence assembly over the 26 post-post-post-successor obstruction-prime buckets emitted by the 24-bucket post-post-successor q-avoiding batch cover; singleton q-child descent remains blocked until that assembly selects a finite token.',
    claims: {
      consumes24BucketPostPostSuccessorQAvoidingToken: true,
      classifiesAll24SourceBucketTokens: true,
      classifiesAllSourceRows: classifiedRows.length === 718,
      classifiesAllPostPostSuccessorQAvoidingClasses: sourcePostPostSuccessorQAvoidingClassCount === '272895494027351286884102031165661158393',
      survivorSourceRowCount: survivorRows.length,
      survivorPostPostSuccessorQAvoidingClassCount,
      allRowsHaveTwoPostPostPostSuccessorRoots: true,
      emitsTwentySixPostPostPostSuccessorPrimeBuckets: postPostPostSuccessorObstructionPrimeBuckets.length === 26,
      opensFreshFallbackSelector: false,
      descendsIntoQ151Singleton: false,
      descendsIntoQ157Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostPostPostSuccessorRootChildrenClosed: false,
      provesPostPostPostSuccessorQAvoidingBoundaryClosed: false,
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
  lines.push('# P848 P4217 later-prime 15-bucket next-prime 17-bucket post-next 20-bucket successor 22-bucket post-successor 24-bucket post-post-successor 24-bucket q-avoiding batch cover');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source post-post-successor buckets: ${packet.batchCoverSummary.sourcePostPostSuccessorBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.batchCoverSummary.sourceRowCount}`);
  lines.push(`- Source post-post-successor q-avoiding classes accounted: ${packet.batchCoverSummary.sourcePostPostSuccessorQAvoidingClassCount}`);
  lines.push(`- Post-post-post-successor buckets: ${packet.batchCoverSummary.postPostPostSuccessorObstructionPrimeBucketCount}`);
  lines.push(`- Post-post-post-successor prime range: ${packet.batchCoverSummary.minPostPostPostSuccessorObstructionPrime}..${packet.batchCoverSummary.maxPostPostPostSuccessorObstructionPrime}`);
  lines.push(`- Post-post-post-successor root children emitted: ${packet.batchCoverSummary.totalPostPostPostSuccessorRootChildCount}`);
  lines.push(`- Post-post-post-successor q-avoiding rank classes: ${packet.batchCoverSummary.totalPostPostPostSuccessorQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.batchCoverSummary.survivorSourceRowCount}`);
  lines.push(`- Survivor post-post-successor q-avoiding classes: ${packet.batchCoverSummary.survivorPostPostSuccessorQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Post-Post-Post-Successor Bucket Tokens');
  lines.push('');
  for (const bucket of packet.postPostPostSuccessorObstructionPrimeBuckets) {
    lines.push(`- q${bucket.postPostPostSuccessorObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourcePostPostSuccessorQAvoidingClassCount} source post-post-successor q-avoiding classes, ${bucket.postPostPostSuccessorRootChildCount} post-post-post-successor root children, ${bucket.postPostPostSuccessorQAvoidingClassCount} post-post-post-successor q-avoiding classes.`);
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
