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
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_RANK_BOUNDARY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.md',
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
    sourcePostSuccessorQAvoidingClassCount: '0',
  };
  current.sourceRowCount += 1;
  current.sourcePostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.sourcePostSuccessorQAvoidingClassCount,
    count,
  );
  map.set(key, current);
}

function addToPostPostSuccessorBucketSummary(summary, row) {
  const current = summary.get(row.postPostSuccessorObstructionPrime) ?? {
    sourceRowCount: 0,
    sourcePostSuccessorQAvoidingClassCount: '0',
    postPostSuccessorRootChildCount: '0',
    postPostSuccessorQAvoidingClassCount: '0',
    previousPostSuccessorPrimeBuckets: new Map(),
    previousSuccessorPrimeBuckets: new Map(),
    previousPostNextPrimeBuckets: new Map(),
    previousNextPrimeBuckets: new Map(),
    previousLaterPrimeBuckets: new Map(),
    rootResidueCounts: new Set(),
  };
  current.sourceRowCount += 1;
  current.sourcePostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.sourcePostSuccessorQAvoidingClassCount,
    row.sourcePostSuccessorQAvoidingClassCount,
  );
  current.postPostSuccessorRootChildCount = addBigIntStrings(
    current.postPostSuccessorRootChildCount,
    row.postPostSuccessorRootChildCount,
  );
  current.postPostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.postPostSuccessorQAvoidingClassCount,
    row.postPostSuccessorQAvoidingClassCount,
  );
  current.rootResidueCounts.add(row.postPostSuccessorRootResidueCount);
  addNestedBucket(current.previousPostSuccessorPrimeBuckets, row.postSuccessorObstructionPrime, row.sourcePostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousSuccessorPrimeBuckets, row.successorObstructionPrime, row.sourcePostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousPostNextPrimeBuckets, row.postNextObstructionPrime, row.sourcePostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousNextPrimeBuckets, row.nextObstructionPrime, row.sourcePostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousLaterPrimeBuckets, row.laterObstructionPrime, row.sourcePostSuccessorQAvoidingClassCount);
  summary.set(row.postPostSuccessorObstructionPrime, current);
}

function normalizeNestedBuckets(map, keyName) {
  return summarizeMap(map, keyName);
}

function compactPostPostSuccessorBucketSummary(summary) {
  return summarizeMap(summary, 'postPostSuccessorObstructionPrime').map((bucket) => ({
    postPostSuccessorObstructionPrime: bucket.postPostSuccessorObstructionPrime,
    postPostSuccessorObstructionSquare: bucket.postPostSuccessorObstructionPrime * bucket.postPostSuccessorObstructionPrime,
    sourceRowCount: bucket.sourceRowCount,
    sourcePostSuccessorQAvoidingClassCount: bucket.sourcePostSuccessorQAvoidingClassCount,
    rootResidueCountsPerClass: [...bucket.rootResidueCounts].sort((left, right) => left - right),
    postPostSuccessorRootChildCount: bucket.postPostSuccessorRootChildCount,
    postPostSuccessorQAvoidingClassCount: bucket.postPostSuccessorQAvoidingClassCount,
    previousPostSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousPostSuccessorPrimeBuckets, 'previousPostSuccessorObstructionPrime'),
    previousSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousSuccessorPrimeBuckets, 'previousSuccessorObstructionPrime'),
    previousPostNextPrimeBuckets: normalizeNestedBuckets(bucket.previousPostNextPrimeBuckets, 'previousPostNextObstructionPrime'),
    previousNextPrimeBuckets: normalizeNestedBuckets(bucket.previousNextPrimeBuckets, 'previousNextObstructionPrime'),
    previousLaterPrimeBuckets: normalizeNestedBuckets(bucket.previousLaterPrimeBuckets, 'previousLaterObstructionPrime'),
    status: 'open_exact_two_root_post_post_successor_rank_boundary',
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
  };
}

function classifyRow(row, primes, maxPrime, rootCache) {
  const sourcePostSuccessorQAvoidingClassCount = BigInt(row.postSuccessorQAvoidingClassCount);

  for (const prime of primes) {
    if (prime <= row.postSuccessorObstructionPrime) {
      continue;
    }
    if (prime > maxPrime) {
      break;
    }

    const roots = rootsForDelta(row.delta, prime, rootCache);
    if (roots.length === 0) {
      continue;
    }

    const postPostSuccessorObstructionSquare = prime * prime;
    const postPostSuccessorRootChildCount = sourcePostSuccessorQAvoidingClassCount * BigInt(roots.length);
    const postPostSuccessorQAvoidingClassCount = sourcePostSuccessorQAvoidingClassCount * BigInt(postPostSuccessorObstructionSquare - roots.length);
    return {
      ...baseRowFields(row),
      sourcePostSuccessorQAvoidingClassCount: sourcePostSuccessorQAvoidingClassCount.toString(),
      postPostSuccessorObstructionPrime: prime,
      postPostSuccessorObstructionSquare,
      postPostSuccessorRootResidueCount: roots.length,
      postPostSuccessorRootResidues: roots,
      postPostSuccessorRootChildCount: postPostSuccessorRootChildCount.toString(),
      postPostSuccessorQAvoidingClassCount: postPostSuccessorQAvoidingClassCount.toString(),
      inheritedNoSmallerObstruction: true,
      previousPostSuccessorPrimeExcludedByQAvoidingBoundary: true,
    };
  }

  return {
    ...baseRowFields(row),
    sourcePostSuccessorQAvoidingClassCount: sourcePostSuccessorQAvoidingClassCount.toString(),
    postPostSuccessorObstructionPrime: null,
    postPostSuccessorObstructionSquare: null,
    postPostSuccessorRootResidueCount: 0,
    postPostSuccessorRootResidues: [],
    postPostSuccessorRootChildCount: '0',
    postPostSuccessorQAvoidingClassCount: sourcePostSuccessorQAvoidingClassCount.toString(),
    inheritedNoSmallerObstruction: true,
    previousPostSuccessorPrimeExcludedByQAvoidingBoundary: true,
  };
}

function buildPacket(options) {
  const sourceCover = readJson(options.sourceCoverPacket);
  const rankBoundary = readJson(options.rankBoundaryPacket);

  assertCondition(sourceCover.status === 'all_22_bucket_successor_q_avoiding_classes_have_later_square_obstruction_child', 'source cover status mismatch');
  assertCondition(rankBoundary.status === 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_deterministic_rank_boundary_emitted', 'rank-boundary status mismatch');
  assertCondition(rankBoundary.recommendedNextAction === 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary', 'rank-boundary next action mismatch');

  const rows = sourceCover.rowClassifications ?? [];
  assertCondition(rows.length === 718, 'expected 718 source row classifications');
  assertCondition(
    BigInt(rankBoundary.boundarySummary?.totalPostSuccessorQAvoidingClassCount ?? 0) === BigInt(sourceCover.batchCoverSummary?.totalPostSuccessorQAvoidingClassCount ?? 0),
    'post-successor q-avoiding total mismatch between source cover and rank boundary',
  );

  const primes = primeSieve(options.maxPrime);
  const rootCache = new Map();
  const classifiedRows = rows.map((row) => classifyRow(row, primes, options.maxPrime, rootCache));
  const survivorRows = classifiedRows.filter((row) => row.postPostSuccessorObstructionPrime === null);
  const postPostSuccessorBucketMap = new Map();

  for (const row of classifiedRows) {
    if (row.postPostSuccessorObstructionPrime !== null) {
      addToPostPostSuccessorBucketSummary(postPostSuccessorBucketMap, row);
    }
  }

  const postPostSuccessorObstructionPrimeBuckets = compactPostPostSuccessorBucketSummary(postPostSuccessorBucketMap);
  const sourcePostSuccessorQAvoidingClassCount = sumString(classifiedRows, 'sourcePostSuccessorQAvoidingClassCount');
  const postPostSuccessorRootChildCount = sumString(classifiedRows, 'postPostSuccessorRootChildCount');
  const postPostSuccessorQAvoidingClassCount = sumString(classifiedRows, 'postPostSuccessorQAvoidingClassCount');
  const survivorPostSuccessorQAvoidingClassCount = sumString(survivorRows, 'sourcePostSuccessorQAvoidingClassCount');
  const postPostSuccessorRootResidueCounts = [...new Set(classifiedRows.map((row) => row.postPostSuccessorRootResidueCount))]
    .sort((left, right) => left - right);

  assertCondition(sourcePostSuccessorQAvoidingClassCount === decimal(rankBoundary.boundarySummary.totalPostSuccessorQAvoidingClassCount), 'source post-successor q-avoiding total mismatch');
  assertCondition(survivorRows.length === 0, `expected no survivor rows, found ${survivorRows.length}`);
  assertCondition(survivorPostSuccessorQAvoidingClassCount === '0', `expected no survivor classes, found ${survivorPostSuccessorQAvoidingClassCount}`);
  assertCondition(postPostSuccessorRootResidueCounts.length === 1 && postPostSuccessorRootResidueCounts[0] === 2, 'expected a two-root post-post-successor obstruction law');
  assertCondition(postPostSuccessorObstructionPrimeBuckets.length === 24, 'expected 24 post-post-successor obstruction prime buckets');

  const postPostSuccessorObstructionPrimes = postPostSuccessorObstructionPrimeBuckets.map((bucket) => bucket.postPostSuccessorObstructionPrime);
  const inputToken = rankBoundary.finiteTokenTransition?.nextFiniteToken ?? {
    tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover',
    bucketCount: 24,
    qAvoidingClassCount: sourcePostSuccessorQAvoidingClassCount,
    status: 'selected',
  };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'all_24_bucket_post_successor_q_avoiding_classes_have_later_square_obstruction_child',
    target: 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary',
    sourceAudit: {
      successor22BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.sourceCoverPacket),
        sha256: sha256File(options.sourceCoverPacket),
        status: sourceCover.status,
      },
      postSuccessor24BucketRankBoundaryPacket: {
        path: path.relative(repoRoot, options.rankBoundaryPacket),
        sha256: sha256File(options.rankBoundaryPacket),
        status: rankBoundary.status,
      },
    },
    inputRankToken: inputToken,
    batchCoverSummary: {
      sourcePostSuccessorBucketCount: 24,
      sourceRowCount: classifiedRows.length,
      sourcePostSuccessorQAvoidingClassCount,
      classifiedPostSuccessorQAvoidingClassCount: addBigIntStrings(sourcePostSuccessorQAvoidingClassCount, `-${survivorPostSuccessorQAvoidingClassCount}`),
      survivorSourceRowCount: survivorRows.length,
      survivorPostSuccessorQAvoidingClassCount,
      postPostSuccessorObstructionPrimeBucketCount: postPostSuccessorObstructionPrimeBuckets.length,
      minPostPostSuccessorObstructionPrime: postPostSuccessorObstructionPrimes[0] ?? null,
      maxPostPostSuccessorObstructionPrime: postPostSuccessorObstructionPrimes.at(-1) ?? null,
      postPostSuccessorRootResidueCounts,
      totalPostPostSuccessorRootChildCount: postPostSuccessorRootChildCount,
      totalPostPostSuccessorQAvoidingClassCount: postPostSuccessorQAvoidingClassCount,
      maxCheckedPrime: options.maxPrime,
      rootCacheEntryCount: rootCache.size,
    },
    proofMechanism: {
      theoremId: 'p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_row_uniform_post_post_successor_obstruction',
      status: 'proved_for_recorded_24_bucket_post_successor_q_avoiding_boundary_not_terminal_closure',
      statement: 'For every recorded row in the deterministic 24-bucket post-successor q-avoiding boundary, the previous post-successor obstruction prime is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions from the prior first-obstruction classifications; the first later prime with roots of y*(y+delta)+1 modulo s^2 gives a row-uniform square-obstruction child for every descendant class of that row.',
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover.mjs --pretty',
      proofSketch: [
        'Read the 718 row classifications from the 22-bucket successor q-avoiding batch cover and the deterministic 24-bucket post-successor rank boundary.',
        'Use each row post-successor q-avoiding class count emitted by the 24-bucket rank boundary as the source class count for this layer.',
        'Skip primes at or below the current post-successor obstruction prime because the previous layer already made it the first post-successor obstruction and this q-avoiding layer excludes that prime.',
        'For later primes s, solve y*(y+delta)+1 == 0 mod s^2. The first s with roots is row-uniform across the inherited post-successor q-avoiding descendant classes.',
        'All 718 source rows have a first later two-root obstruction prime at or below q283, so all 5,058,399,114,142,580,922,880,572,195,875,967 post-successor q-avoiding classes are classified with no survivors.',
      ],
    },
    postPostSuccessorObstructionPrimeBuckets,
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
    })),
    finiteTokenTransition: {
      consumedFiniteToken: {
        tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover',
        sourcePostSuccessorBucketCount: 24,
        sourceRowCount: classifiedRows.length,
        sourcePostSuccessorQAvoidingClassCount,
        status: 'consumed_by_row_uniform_post_post_successor_obstruction_batch_cover',
      },
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_root_children',
          postPostSuccessorObstructionPrimeBucketCount: postPostSuccessorObstructionPrimeBuckets.length,
          rootChildCount: postPostSuccessorRootChildCount,
          status: 'square_obstruction_children_emitted_not_descended',
        },
        {
          tokenId: 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_q_avoiding_boundary',
          postPostSuccessorObstructionPrimeBucketCount: postPostSuccessorObstructionPrimeBuckets.length,
          qAvoidingClassCount: postPostSuccessorQAvoidingClassCount,
          status: 'ranked_boundary_open_for_convergence_assembly',
        },
      ],
    },
    proofBoundary: 'This packet batch-classifies the q-avoiding rank boundary emitted by the deterministic 24 post-successor buckets: all 5,058,399,114,142,580,922,880,572,195,875,967 source post-successor q-avoiding classes have a row-uniform later square-obstruction child by prime 283. It does not close the 10,116,798,228,285,161,845,761,144,391,751,934 post-post-successor root children, the 272,895,494,027,351,286,884,102,031,165,661,158,393 post-post-successor q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover',
      action: 'Run convergence assembly after the 24-bucket post-successor q-avoiding batch cover and choose whether to compress the 24 post-post-successor obstruction-prime buckets, prove a structural rank decrease, or emit a deterministic boundary for the enlarged q-avoiding rank surface.',
      coveredFamily: 'The 24 post-post-successor obstruction-prime buckets emitted from 5,058,399,114,142,580,922,880,572,195,875,967 post-successor q-avoiding classes, with 10,116,798,228,285,161,845,761,144,391,751,934 post-post-successor root children and 272,895,494,027,351,286,884,102,031,165,661,158,393 post-post-successor q-avoiding classes.',
      finiteDenominatorOrRankToken: 'Finite token p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover grouped by post-post-successor obstruction primes 151 through 283.',
      failureBoundary: 'If no compression theorem exists, emit a deterministic ranked boundary packet over all 24 post-post-successor buckets and do not descend into singleton root children.',
      completionRule: 'Assembly must choose bucket compression, structural decomposition, impossibility, or ranked transition before any singleton q-child descent.',
    },
    recommendedNextAction: 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover',
    nextTheoremMove: 'Run convergence assembly over the 24 post-post-successor obstruction-prime buckets emitted by the 24-bucket post-successor q-avoiding batch cover; singleton q-child descent remains blocked until that assembly selects a finite token.',
    claims: {
      consumes24BucketPostSuccessorQAvoidingToken: true,
      classifiesAll24SourceBucketTokens: true,
      classifiesAllSourceRows: classifiedRows.length === 718,
      classifiesAllPostSuccessorQAvoidingClasses: sourcePostSuccessorQAvoidingClassCount === '5058399114142580922880572195875967',
      survivorSourceRowCount: survivorRows.length,
      survivorPostSuccessorQAvoidingClassCount,
      allRowsHaveTwoPostPostSuccessorRoots: true,
      emitsTwentyFourPostPostSuccessorPrimeBuckets: postPostSuccessorObstructionPrimeBuckets.length === 24,
      opensFreshFallbackSelector: false,
      descendsIntoQ149Singleton: false,
      descendsIntoQ151Singleton: false,
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
  lines.push('# P848 P4217 later-prime 15-bucket next-prime 17-bucket post-next 20-bucket successor 22-bucket post-successor 24-bucket q-avoiding batch cover');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source post-successor buckets: ${packet.batchCoverSummary.sourcePostSuccessorBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.batchCoverSummary.sourceRowCount}`);
  lines.push(`- Source post-successor q-avoiding classes accounted: ${packet.batchCoverSummary.sourcePostSuccessorQAvoidingClassCount}`);
  lines.push(`- Post-post-successor buckets: ${packet.batchCoverSummary.postPostSuccessorObstructionPrimeBucketCount}`);
  lines.push(`- Post-post-successor prime range: ${packet.batchCoverSummary.minPostPostSuccessorObstructionPrime}..${packet.batchCoverSummary.maxPostPostSuccessorObstructionPrime}`);
  lines.push(`- Post-post-successor root children emitted: ${packet.batchCoverSummary.totalPostPostSuccessorRootChildCount}`);
  lines.push(`- Post-post-successor q-avoiding rank classes: ${packet.batchCoverSummary.totalPostPostSuccessorQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.batchCoverSummary.survivorSourceRowCount}`);
  lines.push(`- Survivor post-successor q-avoiding classes: ${packet.batchCoverSummary.survivorPostSuccessorQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Post-Post-Successor Bucket Tokens');
  lines.push('');
  for (const bucket of packet.postPostSuccessorObstructionPrimeBuckets) {
    lines.push(`- q${bucket.postPostSuccessorObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourcePostSuccessorQAvoidingClassCount} source post-successor q-avoiding classes, ${bucket.postPostSuccessorRootChildCount} post-post-successor root children, ${bucket.postPostSuccessorQAvoidingClassCount} post-post-successor q-avoiding classes.`);
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
