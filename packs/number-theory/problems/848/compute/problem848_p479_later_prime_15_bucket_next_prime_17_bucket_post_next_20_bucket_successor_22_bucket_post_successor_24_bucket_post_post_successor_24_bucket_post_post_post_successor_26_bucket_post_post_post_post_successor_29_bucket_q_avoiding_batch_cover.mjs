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
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_POST_POST_POST_SUCCESSOR_26_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_RANK_BOUNDARY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_26_Q_AVOIDING_29_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_29_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_29_Q_AVOIDING_29_BUCKET_BATCH_COVER_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_29_Q_AVOIDING_29_BUCKET_BATCH_COVER_PACKET.md',
);

const TARGET = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover_or_emit_boundary';
const NEXT_ACTION = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';
const CONSUMED_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';
const ROOT_CHILD_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_root_children';
const Q_AVOIDING_BOUNDARY_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_q_avoiding_boundary';

function parseArgs(argv) {
  const options = {
    sourceCoverPacket: DEFAULT_SOURCE_COVER_PACKET,
    rankBoundaryPacket: DEFAULT_RANK_BOUNDARY_PACKET,
    assemblyPacket: DEFAULT_ASSEMBLY_PACKET,
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
    } else if (arg === '--assembly-packet') {
      options.assemblyPacket = path.resolve(argv[index + 1]);
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

function sumString(rows, key) {
  return rows.reduce((sum, row) => sum + BigInt(row[key] ?? 0), 0n).toString();
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

function addNestedBucket(map, key, count) {
  const current = map.get(key) ?? {
    sourceRowCount: 0,
    sourcePostPostPostPostSuccessorQAvoidingClassCount: '0',
  };
  current.sourceRowCount += 1;
  current.sourcePostPostPostPostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.sourcePostPostPostPostSuccessorQAvoidingClassCount,
    count,
  );
  map.set(key, current);
}

function normalizeNestedBuckets(map, keyName) {
  return [...map.entries()]
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([key, value]) => ({
      [keyName]: Number(key),
      ...value,
    }));
}

function addToPostPostPostPostPostSuccessorBucketSummary(summary, row) {
  const key = row.postPostPostPostPostSuccessorObstructionPrime;
  const current = summary.get(key) ?? {
    sourceRowCount: 0,
    sourcePostPostPostPostSuccessorQAvoidingClassCount: '0',
    postPostPostPostPostSuccessorRootChildCount: '0',
    postPostPostPostPostSuccessorQAvoidingClassCount: '0',
    previousPostPostPostPostSuccessorPrimeBuckets: new Map(),
    previousPostPostSuccessorPrimeBuckets: new Map(),
    previousPostSuccessorPrimeBuckets: new Map(),
    previousSuccessorPrimeBuckets: new Map(),
    previousPostNextPrimeBuckets: new Map(),
    previousNextPrimeBuckets: new Map(),
    previousLaterPrimeBuckets: new Map(),
    rootResidueCounts: new Set(),
  };

  current.sourceRowCount += 1;
  current.sourcePostPostPostPostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.sourcePostPostPostPostSuccessorQAvoidingClassCount,
    row.sourcePostPostPostPostSuccessorQAvoidingClassCount,
  );
  current.postPostPostPostPostSuccessorRootChildCount = addBigIntStrings(
    current.postPostPostPostPostSuccessorRootChildCount,
    row.postPostPostPostPostSuccessorRootChildCount,
  );
  current.postPostPostPostPostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.postPostPostPostPostSuccessorQAvoidingClassCount,
    row.postPostPostPostPostSuccessorQAvoidingClassCount,
  );
  current.rootResidueCounts.add(row.postPostPostPostPostSuccessorRootResidueCount);
  addNestedBucket(current.previousPostPostPostPostSuccessorPrimeBuckets, row.postPostPostPostSuccessorObstructionPrime, row.sourcePostPostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousPostPostSuccessorPrimeBuckets, row.postPostSuccessorObstructionPrime, row.sourcePostPostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousPostSuccessorPrimeBuckets, row.postSuccessorObstructionPrime, row.sourcePostPostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousSuccessorPrimeBuckets, row.successorObstructionPrime, row.sourcePostPostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousPostNextPrimeBuckets, row.postNextObstructionPrime, row.sourcePostPostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousNextPrimeBuckets, row.nextObstructionPrime, row.sourcePostPostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousLaterPrimeBuckets, row.laterObstructionPrime, row.sourcePostPostPostPostSuccessorQAvoidingClassCount);
  summary.set(key, current);
}

function compactPostPostPostPostPostSuccessorBucketSummary(summary) {
  return [...summary.entries()]
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([prime, bucket]) => ({
      postPostPostPostPostSuccessorObstructionPrime: Number(prime),
      postPostPostPostPostSuccessorObstructionSquare: Number(prime) * Number(prime),
      sourceRowCount: bucket.sourceRowCount,
      sourcePostPostPostPostSuccessorQAvoidingClassCount: bucket.sourcePostPostPostPostSuccessorQAvoidingClassCount,
      rootResidueCountsPerClass: [...bucket.rootResidueCounts].sort((left, right) => left - right),
      postPostPostPostPostSuccessorRootChildCount: bucket.postPostPostPostPostSuccessorRootChildCount,
      postPostPostPostPostSuccessorQAvoidingClassCount: bucket.postPostPostPostPostSuccessorQAvoidingClassCount,
      previousPostPostPostPostSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousPostPostPostPostSuccessorPrimeBuckets, 'previousPostPostPostPostSuccessorObstructionPrime'),
      previousPostPostSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousPostPostSuccessorPrimeBuckets, 'previousPostPostSuccessorObstructionPrime'),
      previousPostSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousPostSuccessorPrimeBuckets, 'previousPostSuccessorObstructionPrime'),
      previousSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousSuccessorPrimeBuckets, 'previousSuccessorObstructionPrime'),
      previousPostNextPrimeBuckets: normalizeNestedBuckets(bucket.previousPostNextPrimeBuckets, 'previousPostNextObstructionPrime'),
      previousNextPrimeBuckets: normalizeNestedBuckets(bucket.previousNextPrimeBuckets, 'previousNextObstructionPrime'),
      previousLaterPrimeBuckets: normalizeNestedBuckets(bucket.previousLaterPrimeBuckets, 'previousLaterObstructionPrime'),
      status: 'open_exact_two_root_post_post_post_post_post_successor_rank_boundary',
    }));
}

function classifyRow(row, primes, maxPrime, rootCache) {
  const sourcePostPostPostPostSuccessorQAvoidingClassCount = BigInt(row.postPostPostPostSuccessorQAvoidingClassCount);

  for (const prime of primes) {
    if (prime <= row.postPostPostPostSuccessorObstructionPrime) {
      continue;
    }
    if (prime > maxPrime) {
      break;
    }

    const roots = rootsForDelta(row.delta, prime, rootCache);
    if (roots.length === 0) {
      continue;
    }

    const postPostPostPostPostSuccessorObstructionSquare = prime * prime;
    const rootChildCount = sourcePostPostPostPostSuccessorQAvoidingClassCount * BigInt(roots.length);
    const qAvoidingClassCount = sourcePostPostPostPostSuccessorQAvoidingClassCount * BigInt(postPostPostPostPostSuccessorObstructionSquare - roots.length);
    return {
      ...row,
      sourcePostPostPostPostSuccessorQAvoidingClassCount: sourcePostPostPostPostSuccessorQAvoidingClassCount.toString(),
      postPostPostPostPostSuccessorObstructionPrime: prime,
      postPostPostPostPostSuccessorObstructionSquare,
      postPostPostPostPostSuccessorRootResidueCount: roots.length,
      postPostPostPostPostSuccessorRootResidues: roots,
      postPostPostPostPostSuccessorRootChildCount: rootChildCount.toString(),
      postPostPostPostPostSuccessorQAvoidingClassCount: qAvoidingClassCount.toString(),
      inheritedNoSmallerObstruction: true,
      previousPostPostPostPostSuccessorPrimeExcludedByQAvoidingBoundary: true,
    };
  }

  return {
    ...row,
    sourcePostPostPostPostSuccessorQAvoidingClassCount: sourcePostPostPostPostSuccessorQAvoidingClassCount.toString(),
    postPostPostPostPostSuccessorObstructionPrime: null,
    postPostPostPostPostSuccessorObstructionSquare: null,
    postPostPostPostPostSuccessorRootResidueCount: 0,
    postPostPostPostPostSuccessorRootResidues: [],
    postPostPostPostPostSuccessorRootChildCount: '0',
    postPostPostPostPostSuccessorQAvoidingClassCount: sourcePostPostPostPostSuccessorQAvoidingClassCount.toString(),
    inheritedNoSmallerObstruction: true,
    previousPostPostPostPostSuccessorPrimeExcludedByQAvoidingBoundary: true,
  };
}

function buildPacket(options) {
  const sourceCover = readJson(options.sourceCoverPacket);
  const rankBoundary = readJson(options.rankBoundaryPacket);
  const assembly = readJson(options.assemblyPacket);

  assertCondition(sourceCover.status === 'all_26_bucket_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child', 'source 26-bucket q-cover status mismatch');
  assertCondition(rankBoundary.status === 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_deterministic_rank_boundary_emitted', 'rank-boundary status mismatch');
  assertCondition(assembly.status === 'post_29_bucket_rank_boundary_convergence_assembly_selects_29_bucket_q_avoiding_cover', 'rank assembly status mismatch');
  assertCondition(rankBoundary.nextQCoverActionAfterAssembly === TARGET, 'rank-boundary post-assembly q-cover action mismatch');
  assertCondition(assembly.recommendedNextAction === TARGET, 'rank assembly next action mismatch');

  const rows = sourceCover.rowClassifications ?? [];
  assertCondition(rows.length === 718, 'expected 718 source row classifications');
  assertCondition(
    BigInt(rankBoundary.boundarySummary?.totalPostPostPostPostSuccessorQAvoidingClassCount ?? 0) === BigInt(sourceCover.batchCoverSummary?.totalPostPostPostPostSuccessorQAvoidingClassCount ?? 0),
    'post-post-post-post-successor q-avoiding total mismatch between source cover and rank boundary',
  );
  assertCondition(
    BigInt(assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken?.postPostPostPostSuccessorQAvoidingClassCount ?? assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken?.qAvoidingClassCount ?? 0) === BigInt(sourceCover.batchCoverSummary?.totalPostPostPostPostSuccessorQAvoidingClassCount ?? 0),
    'post-post-post-post-successor q-avoiding total mismatch between source cover and rank assembly',
  );

  const primes = primeSieve(options.maxPrime);
  const rootCache = new Map();
  const classifiedRows = rows.map((row) => classifyRow(row, primes, options.maxPrime, rootCache));
  const survivorRows = classifiedRows.filter((row) => row.postPostPostPostPostSuccessorObstructionPrime === null);
  const bucketMap = new Map();

  for (const row of classifiedRows) {
    if (row.postPostPostPostPostSuccessorObstructionPrime !== null) {
      addToPostPostPostPostPostSuccessorBucketSummary(bucketMap, row);
    }
  }

  const postPostPostPostPostSuccessorObstructionPrimeBuckets = compactPostPostPostPostPostSuccessorBucketSummary(bucketMap);
  const sourcePostPostPostPostSuccessorQAvoidingClassCount = sumString(classifiedRows, 'sourcePostPostPostPostSuccessorQAvoidingClassCount');
  const postPostPostPostPostSuccessorRootChildCount = sumString(classifiedRows, 'postPostPostPostPostSuccessorRootChildCount');
  const postPostPostPostPostSuccessorQAvoidingClassCount = sumString(classifiedRows, 'postPostPostPostPostSuccessorQAvoidingClassCount');
  const survivorPostPostPostPostSuccessorQAvoidingClassCount = sumString(survivorRows, 'sourcePostPostPostPostSuccessorQAvoidingClassCount');
  const rootResidueCounts = [...new Set(classifiedRows.map((row) => row.postPostPostPostPostSuccessorRootResidueCount))]
    .sort((left, right) => left - right);

  assertCondition(sourcePostPostPostPostSuccessorQAvoidingClassCount === decimal(rankBoundary.boundarySummary.totalPostPostPostPostSuccessorQAvoidingClassCount), 'source post-post-post-post-successor q-avoiding total mismatch');
  assertCondition(survivorRows.length === 0, `expected no survivor rows, found ${survivorRows.length}`);
  assertCondition(survivorPostPostPostPostSuccessorQAvoidingClassCount === '0', `expected no survivor classes, found ${survivorPostPostPostPostSuccessorQAvoidingClassCount}`);
  assertCondition(rootResidueCounts.length === 1 && rootResidueCounts[0] === 2, 'expected a two-root post-post-post-post-post-successor obstruction law');
  assertCondition(postPostPostPostPostSuccessorObstructionPrimeBuckets.length === 29, 'expected 29 post-post-post-post-post-successor obstruction prime buckets');

  const obstructionPrimes = postPostPostPostPostSuccessorObstructionPrimeBuckets.map((bucket) => bucket.postPostPostPostPostSuccessorObstructionPrime);
  const inputRankToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken
    ?? rankBoundary.finiteTokenTransition?.nextFiniteToken
    ?? {
      tokenId: CONSUMED_TOKEN,
      bucketCount: 29,
      qAvoidingClassCount: sourcePostPostPostPostSuccessorQAvoidingClassCount,
      status: 'selected',
    };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'all_29_bucket_post_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child',
    target: TARGET,
    sourceAudit: {
      postPostPostSuccessor26BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.sourceCoverPacket),
        sha256: sha256File(options.sourceCoverPacket),
        status: sourceCover.status,
      },
      postPostPostPostSuccessor29BucketRankBoundaryPacket: {
        path: path.relative(repoRoot, options.rankBoundaryPacket),
        sha256: sha256File(options.rankBoundaryPacket),
        status: rankBoundary.status,
      },
      postPostPostPostSuccessor29BucketRankBoundaryConvergenceAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    inputRankToken,
    batchCoverSummary: {
      sourcePostPostPostPostSuccessorBucketCount: 29,
      sourceRowCount: classifiedRows.length,
      sourcePostPostPostPostSuccessorQAvoidingClassCount,
      classifiedPostPostPostPostSuccessorQAvoidingClassCount: addBigIntStrings(sourcePostPostPostPostSuccessorQAvoidingClassCount, `-${survivorPostPostPostPostSuccessorQAvoidingClassCount}`),
      survivorSourceRowCount: survivorRows.length,
      survivorPostPostPostPostSuccessorQAvoidingClassCount,
      postPostPostPostPostSuccessorObstructionPrimeBucketCount: postPostPostPostPostSuccessorObstructionPrimeBuckets.length,
      minPostPostPostPostPostSuccessorObstructionPrime: obstructionPrimes[0] ?? null,
      maxPostPostPostPostPostSuccessorObstructionPrime: obstructionPrimes.at(-1) ?? null,
      postPostPostPostPostSuccessorRootResidueCounts: rootResidueCounts,
      totalPostPostPostPostPostSuccessorRootChildCount: postPostPostPostPostSuccessorRootChildCount,
      totalPostPostPostPostPostSuccessorQAvoidingClassCount: postPostPostPostPostSuccessorQAvoidingClassCount,
      maxCheckedPrime: options.maxPrime,
      rootCacheEntryCount: rootCache.size,
    },
    proofMechanism: {
      theoremId: 'p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_row_uniform_post_post_post_post_post_successor_obstruction',
      status: 'proved_for_recorded_29_bucket_post_post_post_post_successor_q_avoiding_boundary_not_terminal_closure',
      statement: 'For every recorded row in the deterministic 29-bucket post-post-post-post-successor q-avoiding boundary, the previous post-post-post-post-successor obstruction prime is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions from the prior first-obstruction classifications; the first later prime with roots of y*(y+delta)+1 modulo s^2 gives a row-uniform square-obstruction child for every descendant class of that row.',
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover.mjs --pretty',
      proofSketch: [
        'Read the 718 row classifications from the 26-bucket post-post-post-successor q-avoiding batch cover, the deterministic 29-bucket post-post-post-post-successor rank boundary, and its convergence assembly.',
        'Use each row post-post-post-post-successor q-avoiding class count as the source class count for this layer.',
        'Skip primes at or below the current post-post-post-post-successor obstruction prime because the previous layer already made it the first post-post-post-post-successor obstruction and this q-avoiding layer excludes that prime.',
        'For later primes s, solve y*(y+delta)+1 == 0 mod s^2. The first s with roots is row-uniform across the inherited post-post-post-post-successor q-avoiding descendant classes.',
        'All 718 source rows have a first later two-root obstruction prime at or below q347, so all post-post-post-post-successor q-avoiding classes are classified with no survivors.',
      ],
    },
    postPostPostPostPostSuccessorObstructionPrimeBuckets,
    rowClassifications: classifiedRows,
    finiteTokenTransition: {
      consumedFiniteToken: {
        tokenId: CONSUMED_TOKEN,
        sourcePostPostPostPostSuccessorBucketCount: 29,
        sourceRowCount: classifiedRows.length,
        sourcePostPostPostPostSuccessorQAvoidingClassCount,
        status: 'consumed_by_row_uniform_post_post_post_post_post_successor_obstruction_batch_cover',
      },
      producedFiniteTokens: [
        {
          tokenId: ROOT_CHILD_TOKEN,
          postPostPostPostPostSuccessorObstructionPrimeBucketCount: postPostPostPostPostSuccessorObstructionPrimeBuckets.length,
          rootChildCount: postPostPostPostPostSuccessorRootChildCount,
          status: 'square_obstruction_children_emitted_not_descended',
        },
        {
          tokenId: Q_AVOIDING_BOUNDARY_TOKEN,
          postPostPostPostPostSuccessorObstructionPrimeBucketCount: postPostPostPostPostSuccessorObstructionPrimeBuckets.length,
          qAvoidingClassCount: postPostPostPostPostSuccessorQAvoidingClassCount,
          status: 'ranked_boundary_open_for_convergence_assembly',
        },
      ],
    },
    proofBoundary: `This packet batch-classifies the q-avoiding rank boundary emitted by the deterministic 29 post-post-post-post-successor buckets: all ${sourcePostPostPostPostSuccessorQAvoidingClassCount} source post-post-post-post-successor q-avoiding classes have a row-uniform later square-obstruction child by prime ${obstructionPrimes.at(-1)}. It does not close the ${postPostPostPostPostSuccessorRootChildCount} post-post-post-post-post-successor root children, the ${postPostPostPostPostSuccessorQAvoidingClassCount} post-post-post-post-post-successor q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.`,
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Run convergence assembly after the 29-bucket post-post-post-post-successor q-avoiding batch cover and choose whether to compress the 29 post-post-post-post-post-successor obstruction-prime buckets, prove a structural rank decrease, or emit a deterministic boundary for the enlarged q-avoiding rank surface.',
      coveredFamily: `The 29 post-post-post-post-post-successor obstruction-prime buckets emitted from ${sourcePostPostPostPostSuccessorQAvoidingClassCount} post-post-post-post-successor q-avoiding classes, with ${postPostPostPostPostSuccessorRootChildCount} post-post-post-post-post-successor root children and ${postPostPostPostPostSuccessorQAvoidingClassCount} post-post-post-post-post-successor q-avoiding classes.`,
      finiteDenominatorOrRankToken: `Finite token ${CONSUMED_TOKEN} grouped by post-post-post-post-post-successor obstruction primes ${obstructionPrimes[0]} through ${obstructionPrimes.at(-1)}.`,
      failureBoundary: 'If no compression theorem exists, emit a deterministic ranked boundary packet over all 29 post-post-post-post-post-successor buckets and do not descend into singleton root children.',
      completionRule: 'Assembly must choose bucket compression, structural decomposition, impossibility, or ranked transition before any singleton q-child descent.',
    },
    recommendedNextAction: NEXT_ACTION,
    nextTheoremMove: 'Run convergence assembly over the 29 post-post-post-post-post-successor obstruction-prime buckets emitted by the 29-bucket post-post-post-post-successor q-avoiding batch cover; singleton q-child descent remains blocked until that assembly selects a finite token.',
    claims: {
      consumes29BucketPostPostPostPostSuccessorQAvoidingToken: true,
      classifiesAll29SourceBucketTokens: true,
      classifiesAllSourceRows: classifiedRows.length === 718,
      classifiesAllPostPostPostPostSuccessorQAvoidingClasses: sourcePostPostPostPostSuccessorQAvoidingClassCount === '1256125158212428260162381710030390124682911240345',
      survivorSourceRowCount: survivorRows.length,
      survivorPostPostPostPostSuccessorQAvoidingClassCount,
      allRowsHaveTwoPostPostPostPostPostSuccessorRoots: true,
      emitsTwentyNinePostPostPostPostPostSuccessorPrimeBuckets: postPostPostPostPostSuccessorObstructionPrimeBuckets.length === 29,
      opensFreshFallbackSelector: false,
      descendsIntoQ167Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostPostPostPostPostSuccessorRootChildrenClosed: false,
      provesPostPostPostPostPostSuccessorQAvoidingBoundaryClosed: false,
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
  lines.push('# P848 P4217 post-post-post-post-successor 29-bucket q-avoiding batch cover');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source post-post-post-post-successor buckets: ${packet.batchCoverSummary.sourcePostPostPostPostSuccessorBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.batchCoverSummary.sourceRowCount}`);
  lines.push(`- Source post-post-post-post-successor q-avoiding classes accounted: ${packet.batchCoverSummary.sourcePostPostPostPostSuccessorQAvoidingClassCount}`);
  lines.push(`- Post-post-post-post-post-successor buckets: ${packet.batchCoverSummary.postPostPostPostPostSuccessorObstructionPrimeBucketCount}`);
  lines.push(`- Post-post-post-post-post-successor prime range: ${packet.batchCoverSummary.minPostPostPostPostPostSuccessorObstructionPrime}..${packet.batchCoverSummary.maxPostPostPostPostPostSuccessorObstructionPrime}`);
  lines.push(`- Post-post-post-post-post-successor root children emitted: ${packet.batchCoverSummary.totalPostPostPostPostPostSuccessorRootChildCount}`);
  lines.push(`- Post-post-post-post-post-successor q-avoiding rank classes: ${packet.batchCoverSummary.totalPostPostPostPostPostSuccessorQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.batchCoverSummary.survivorSourceRowCount}`);
  lines.push(`- Survivor post-post-post-post-successor q-avoiding classes: ${packet.batchCoverSummary.survivorPostPostPostPostSuccessorQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Post-Post-Post-Post-Post-Successor Bucket Tokens');
  lines.push('');
  for (const bucket of packet.postPostPostPostPostSuccessorObstructionPrimeBuckets) {
    lines.push(`- q${bucket.postPostPostPostPostSuccessorObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourcePostPostPostPostSuccessorQAvoidingClassCount} source post-post-post-post-successor q-avoiding classes, ${bucket.postPostPostPostPostSuccessorRootChildCount} post-post-post-post-post-successor root children, ${bucket.postPostPostPostPostSuccessorQAvoidingClassCount} post-post-post-post-post-successor q-avoiding classes.`);
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
