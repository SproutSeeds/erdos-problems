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
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_RANK_BOUNDARY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_POST_POST_POST_SUCCESSOR_26_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_POST_POST_POST_SUCCESSOR_26_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_POST_POST_POST_SUCCESSOR_26_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_POST_POST_POST_SUCCESSOR_26_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.md',
);

const TARGET = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover_or_emit_boundary';
const NEXT_ACTION = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover';
const CONSUMED_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover';
const ROOT_CHILD_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_root_children';
const Q_AVOIDING_BOUNDARY_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_q_avoiding_boundary';

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
    sourcePostPostPostSuccessorQAvoidingClassCount: '0',
  };
  current.sourceRowCount += 1;
  current.sourcePostPostPostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.sourcePostPostPostSuccessorQAvoidingClassCount,
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

function addToPostPostPostPostSuccessorBucketSummary(summary, row) {
  const key = row.postPostPostPostSuccessorObstructionPrime;
  const current = summary.get(key) ?? {
    sourceRowCount: 0,
    sourcePostPostPostSuccessorQAvoidingClassCount: '0',
    postPostPostPostSuccessorRootChildCount: '0',
    postPostPostPostSuccessorQAvoidingClassCount: '0',
    previousPostPostPostSuccessorPrimeBuckets: new Map(),
    previousPostPostSuccessorPrimeBuckets: new Map(),
    previousPostSuccessorPrimeBuckets: new Map(),
    previousSuccessorPrimeBuckets: new Map(),
    previousPostNextPrimeBuckets: new Map(),
    previousNextPrimeBuckets: new Map(),
    previousLaterPrimeBuckets: new Map(),
    rootResidueCounts: new Set(),
  };

  current.sourceRowCount += 1;
  current.sourcePostPostPostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.sourcePostPostPostSuccessorQAvoidingClassCount,
    row.sourcePostPostPostSuccessorQAvoidingClassCount,
  );
  current.postPostPostPostSuccessorRootChildCount = addBigIntStrings(
    current.postPostPostPostSuccessorRootChildCount,
    row.postPostPostPostSuccessorRootChildCount,
  );
  current.postPostPostPostSuccessorQAvoidingClassCount = addBigIntStrings(
    current.postPostPostPostSuccessorQAvoidingClassCount,
    row.postPostPostPostSuccessorQAvoidingClassCount,
  );
  current.rootResidueCounts.add(row.postPostPostPostSuccessorRootResidueCount);
  addNestedBucket(current.previousPostPostPostSuccessorPrimeBuckets, row.postPostPostSuccessorObstructionPrime, row.sourcePostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousPostPostSuccessorPrimeBuckets, row.postPostSuccessorObstructionPrime, row.sourcePostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousPostSuccessorPrimeBuckets, row.postSuccessorObstructionPrime, row.sourcePostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousSuccessorPrimeBuckets, row.successorObstructionPrime, row.sourcePostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousPostNextPrimeBuckets, row.postNextObstructionPrime, row.sourcePostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousNextPrimeBuckets, row.nextObstructionPrime, row.sourcePostPostPostSuccessorQAvoidingClassCount);
  addNestedBucket(current.previousLaterPrimeBuckets, row.laterObstructionPrime, row.sourcePostPostPostSuccessorQAvoidingClassCount);
  summary.set(key, current);
}

function compactPostPostPostPostSuccessorBucketSummary(summary) {
  return [...summary.entries()]
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([prime, bucket]) => ({
      postPostPostPostSuccessorObstructionPrime: Number(prime),
      postPostPostPostSuccessorObstructionSquare: Number(prime) * Number(prime),
      sourceRowCount: bucket.sourceRowCount,
      sourcePostPostPostSuccessorQAvoidingClassCount: bucket.sourcePostPostPostSuccessorQAvoidingClassCount,
      rootResidueCountsPerClass: [...bucket.rootResidueCounts].sort((left, right) => left - right),
      postPostPostPostSuccessorRootChildCount: bucket.postPostPostPostSuccessorRootChildCount,
      postPostPostPostSuccessorQAvoidingClassCount: bucket.postPostPostPostSuccessorQAvoidingClassCount,
      previousPostPostPostSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousPostPostPostSuccessorPrimeBuckets, 'previousPostPostPostSuccessorObstructionPrime'),
      previousPostPostSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousPostPostSuccessorPrimeBuckets, 'previousPostPostSuccessorObstructionPrime'),
      previousPostSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousPostSuccessorPrimeBuckets, 'previousPostSuccessorObstructionPrime'),
      previousSuccessorPrimeBuckets: normalizeNestedBuckets(bucket.previousSuccessorPrimeBuckets, 'previousSuccessorObstructionPrime'),
      previousPostNextPrimeBuckets: normalizeNestedBuckets(bucket.previousPostNextPrimeBuckets, 'previousPostNextObstructionPrime'),
      previousNextPrimeBuckets: normalizeNestedBuckets(bucket.previousNextPrimeBuckets, 'previousNextObstructionPrime'),
      previousLaterPrimeBuckets: normalizeNestedBuckets(bucket.previousLaterPrimeBuckets, 'previousLaterObstructionPrime'),
      status: 'open_exact_two_root_post_post_post_post_successor_rank_boundary',
    }));
}

function classifyRow(row, primes, maxPrime, rootCache) {
  const sourcePostPostPostSuccessorQAvoidingClassCount = BigInt(row.postPostPostSuccessorQAvoidingClassCount);

  for (const prime of primes) {
    if (prime <= row.postPostPostSuccessorObstructionPrime) {
      continue;
    }
    if (prime > maxPrime) {
      break;
    }

    const roots = rootsForDelta(row.delta, prime, rootCache);
    if (roots.length === 0) {
      continue;
    }

    const postPostPostPostSuccessorObstructionSquare = prime * prime;
    const rootChildCount = sourcePostPostPostSuccessorQAvoidingClassCount * BigInt(roots.length);
    const qAvoidingClassCount = sourcePostPostPostSuccessorQAvoidingClassCount * BigInt(postPostPostPostSuccessorObstructionSquare - roots.length);
    return {
      ...row,
      sourcePostPostPostSuccessorQAvoidingClassCount: sourcePostPostPostSuccessorQAvoidingClassCount.toString(),
      postPostPostPostSuccessorObstructionPrime: prime,
      postPostPostPostSuccessorObstructionSquare,
      postPostPostPostSuccessorRootResidueCount: roots.length,
      postPostPostPostSuccessorRootResidues: roots,
      postPostPostPostSuccessorRootChildCount: rootChildCount.toString(),
      postPostPostPostSuccessorQAvoidingClassCount: qAvoidingClassCount.toString(),
      inheritedNoSmallerObstruction: true,
      previousPostPostPostSuccessorPrimeExcludedByQAvoidingBoundary: true,
    };
  }

  return {
    ...row,
    sourcePostPostPostSuccessorQAvoidingClassCount: sourcePostPostPostSuccessorQAvoidingClassCount.toString(),
    postPostPostPostSuccessorObstructionPrime: null,
    postPostPostPostSuccessorObstructionSquare: null,
    postPostPostPostSuccessorRootResidueCount: 0,
    postPostPostPostSuccessorRootResidues: [],
    postPostPostPostSuccessorRootChildCount: '0',
    postPostPostPostSuccessorQAvoidingClassCount: sourcePostPostPostSuccessorQAvoidingClassCount.toString(),
    inheritedNoSmallerObstruction: true,
    previousPostPostPostSuccessorPrimeExcludedByQAvoidingBoundary: true,
  };
}

function buildPacket(options) {
  const sourceCover = readJson(options.sourceCoverPacket);
  const rankBoundary = readJson(options.rankBoundaryPacket);
  const assembly = readJson(options.assemblyPacket);

  assertCondition(sourceCover.status === 'all_24_bucket_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child', 'source cover status mismatch');
  assertCondition(rankBoundary.status === 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_deterministic_rank_boundary_emitted', 'rank-boundary status mismatch');
  assertCondition(assembly.status === 'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_rank_boundary_convergence_assembly_selects_26_bucket_q_avoiding_cover', 'rank assembly status mismatch');
  assertCondition(rankBoundary.recommendedNextAction === TARGET, 'rank-boundary next action mismatch');
  assertCondition(assembly.recommendedNextAction === TARGET, 'rank assembly next action mismatch');

  const rows = sourceCover.rowClassifications ?? [];
  assertCondition(rows.length === 718, 'expected 718 source row classifications');
  assertCondition(
    BigInt(rankBoundary.boundarySummary?.totalPostPostPostSuccessorQAvoidingClassCount ?? 0) === BigInt(sourceCover.batchCoverSummary?.totalPostPostPostSuccessorQAvoidingClassCount ?? 0),
    'post-post-post-successor q-avoiding total mismatch between source cover and rank boundary',
  );
  assertCondition(
    BigInt(assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken?.qAvoidingClassCount ?? 0) === BigInt(sourceCover.batchCoverSummary?.totalPostPostPostSuccessorQAvoidingClassCount ?? 0),
    'post-post-post-successor q-avoiding total mismatch between source cover and rank assembly',
  );

  const primes = primeSieve(options.maxPrime);
  const rootCache = new Map();
  const classifiedRows = rows.map((row) => classifyRow(row, primes, options.maxPrime, rootCache));
  const survivorRows = classifiedRows.filter((row) => row.postPostPostPostSuccessorObstructionPrime === null);
  const bucketMap = new Map();

  for (const row of classifiedRows) {
    if (row.postPostPostPostSuccessorObstructionPrime !== null) {
      addToPostPostPostPostSuccessorBucketSummary(bucketMap, row);
    }
  }

  const postPostPostPostSuccessorObstructionPrimeBuckets = compactPostPostPostPostSuccessorBucketSummary(bucketMap);
  const sourcePostPostPostSuccessorQAvoidingClassCount = sumString(classifiedRows, 'sourcePostPostPostSuccessorQAvoidingClassCount');
  const postPostPostPostSuccessorRootChildCount = sumString(classifiedRows, 'postPostPostPostSuccessorRootChildCount');
  const postPostPostPostSuccessorQAvoidingClassCount = sumString(classifiedRows, 'postPostPostPostSuccessorQAvoidingClassCount');
  const survivorPostPostPostSuccessorQAvoidingClassCount = sumString(survivorRows, 'sourcePostPostPostSuccessorQAvoidingClassCount');
  const rootResidueCounts = [...new Set(classifiedRows.map((row) => row.postPostPostPostSuccessorRootResidueCount))]
    .sort((left, right) => left - right);

  assertCondition(sourcePostPostPostSuccessorQAvoidingClassCount === decimal(rankBoundary.boundarySummary.totalPostPostPostSuccessorQAvoidingClassCount), 'source post-post-post-successor q-avoiding total mismatch');
  assertCondition(survivorRows.length === 0, `expected no survivor rows, found ${survivorRows.length}`);
  assertCondition(survivorPostPostPostSuccessorQAvoidingClassCount === '0', `expected no survivor classes, found ${survivorPostPostPostSuccessorQAvoidingClassCount}`);
  assertCondition(rootResidueCounts.length === 1 && rootResidueCounts[0] === 2, 'expected a two-root post-post-post-post-successor obstruction law');
  assertCondition(postPostPostPostSuccessorObstructionPrimeBuckets.length === 29, 'expected 29 post-post-post-post-successor obstruction prime buckets');

  const obstructionPrimes = postPostPostPostSuccessorObstructionPrimeBuckets.map((bucket) => bucket.postPostPostPostSuccessorObstructionPrime);
  const inputRankToken = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken
    ?? rankBoundary.finiteTokenTransition?.nextFiniteToken
    ?? {
      tokenId: CONSUMED_TOKEN,
      bucketCount: 26,
      qAvoidingClassCount: sourcePostPostPostSuccessorQAvoidingClassCount,
      status: 'selected',
    };

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'all_26_bucket_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child',
    target: TARGET,
    sourceAudit: {
      postPostSuccessor24BucketQAvoidingBatchCoverPacket: {
        path: path.relative(repoRoot, options.sourceCoverPacket),
        sha256: sha256File(options.sourceCoverPacket),
        status: sourceCover.status,
      },
      postPostPostSuccessor26BucketRankBoundaryPacket: {
        path: path.relative(repoRoot, options.rankBoundaryPacket),
        sha256: sha256File(options.rankBoundaryPacket),
        status: rankBoundary.status,
      },
      postPostPostSuccessor26BucketRankBoundaryConvergenceAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    inputRankToken,
    batchCoverSummary: {
      sourcePostPostPostSuccessorBucketCount: 26,
      sourceRowCount: classifiedRows.length,
      sourcePostPostPostSuccessorQAvoidingClassCount,
      classifiedPostPostPostSuccessorQAvoidingClassCount: addBigIntStrings(sourcePostPostPostSuccessorQAvoidingClassCount, `-${survivorPostPostPostSuccessorQAvoidingClassCount}`),
      survivorSourceRowCount: survivorRows.length,
      survivorPostPostPostSuccessorQAvoidingClassCount,
      postPostPostPostSuccessorObstructionPrimeBucketCount: postPostPostPostSuccessorObstructionPrimeBuckets.length,
      minPostPostPostPostSuccessorObstructionPrime: obstructionPrimes[0] ?? null,
      maxPostPostPostPostSuccessorObstructionPrime: obstructionPrimes.at(-1) ?? null,
      postPostPostPostSuccessorRootResidueCounts: rootResidueCounts,
      totalPostPostPostPostSuccessorRootChildCount: postPostPostPostSuccessorRootChildCount,
      totalPostPostPostPostSuccessorQAvoidingClassCount: postPostPostPostSuccessorQAvoidingClassCount,
      maxCheckedPrime: options.maxPrime,
      rootCacheEntryCount: rootCache.size,
    },
    proofMechanism: {
      theoremId: 'p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_row_uniform_post_post_post_post_successor_obstruction',
      status: 'proved_for_recorded_26_bucket_post_post_post_successor_q_avoiding_boundary_not_terminal_closure',
      statement: 'For every recorded row in the deterministic 26-bucket post-post-post-successor q-avoiding boundary, the previous post-post-post-successor obstruction prime is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions from the prior first-obstruction classifications; the first later prime with roots of y*(y+delta)+1 modulo s^2 gives a row-uniform square-obstruction child for every descendant class of that row.',
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover.mjs --pretty',
      proofSketch: [
        'Read the 718 row classifications from the 24-bucket post-post-successor q-avoiding batch cover, the deterministic 26-bucket post-post-post-successor rank boundary, and its convergence assembly.',
        'Use each row post-post-post-successor q-avoiding class count as the source class count for this layer.',
        'Skip primes at or below the current post-post-post-successor obstruction prime because the previous layer already made it the first post-post-post-successor obstruction and this q-avoiding layer excludes that prime.',
        'For later primes s, solve y*(y+delta)+1 == 0 mod s^2. The first s with roots is row-uniform across the inherited post-post-post-successor q-avoiding descendant classes.',
        'All 718 source rows have a first later two-root obstruction prime at or below q331, so all post-post-post-successor q-avoiding classes are classified with no survivors.',
      ],
    },
    postPostPostPostSuccessorObstructionPrimeBuckets,
    rowClassifications: classifiedRows,
    finiteTokenTransition: {
      consumedFiniteToken: {
        tokenId: CONSUMED_TOKEN,
        sourcePostPostPostSuccessorBucketCount: 26,
        sourceRowCount: classifiedRows.length,
        sourcePostPostPostSuccessorQAvoidingClassCount,
        status: 'consumed_by_row_uniform_post_post_post_post_successor_obstruction_batch_cover',
      },
      producedFiniteTokens: [
        {
          tokenId: ROOT_CHILD_TOKEN,
          postPostPostPostSuccessorObstructionPrimeBucketCount: postPostPostPostSuccessorObstructionPrimeBuckets.length,
          rootChildCount: postPostPostPostSuccessorRootChildCount,
          status: 'square_obstruction_children_emitted_not_descended',
        },
        {
          tokenId: Q_AVOIDING_BOUNDARY_TOKEN,
          postPostPostPostSuccessorObstructionPrimeBucketCount: postPostPostPostSuccessorObstructionPrimeBuckets.length,
          qAvoidingClassCount: postPostPostPostSuccessorQAvoidingClassCount,
          status: 'ranked_boundary_open_for_convergence_assembly',
        },
      ],
    },
    proofBoundary: `This packet batch-classifies the q-avoiding rank boundary emitted by the deterministic 26 post-post-post-successor buckets: all ${sourcePostPostPostSuccessorQAvoidingClassCount} source post-post-post-successor q-avoiding classes have a row-uniform later square-obstruction child by prime ${obstructionPrimes.at(-1)}. It does not close the ${postPostPostPostSuccessorRootChildCount} post-post-post-post-successor root children, the ${postPostPostPostSuccessorQAvoidingClassCount} post-post-post-post-successor q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.`,
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Run convergence assembly after the 26-bucket post-post-post-successor q-avoiding batch cover and choose whether to compress the 29 post-post-post-post-successor obstruction-prime buckets, prove a structural rank decrease, or emit a deterministic boundary for the enlarged q-avoiding rank surface.',
      coveredFamily: `The 29 post-post-post-post-successor obstruction-prime buckets emitted from ${sourcePostPostPostSuccessorQAvoidingClassCount} post-post-post-successor q-avoiding classes, with ${postPostPostPostSuccessorRootChildCount} post-post-post-post-successor root children and ${postPostPostPostSuccessorQAvoidingClassCount} post-post-post-post-successor q-avoiding classes.`,
      finiteDenominatorOrRankToken: `Finite token ${CONSUMED_TOKEN} grouped by post-post-post-post-successor obstruction primes ${obstructionPrimes[0]} through ${obstructionPrimes.at(-1)}.`,
      failureBoundary: 'If no compression theorem exists, emit a deterministic ranked boundary packet over all 29 post-post-post-post-successor buckets and do not descend into singleton root children.',
      completionRule: 'Assembly must choose bucket compression, structural decomposition, impossibility, or ranked transition before any singleton q-child descent.',
    },
    recommendedNextAction: NEXT_ACTION,
    nextTheoremMove: 'Run convergence assembly over the 29 post-post-post-post-successor obstruction-prime buckets emitted by the 26-bucket post-post-post-successor q-avoiding batch cover; singleton q-child descent remains blocked until that assembly selects a finite token.',
    claims: {
      consumes26BucketPostPostPostSuccessorQAvoidingToken: true,
      classifiesAll26SourceBucketTokens: true,
      classifiesAllSourceRows: classifiedRows.length === 718,
      classifiesAllPostPostPostSuccessorQAvoidingClasses: sourcePostPostPostSuccessorQAvoidingClassCount === '17122811411360928250603246815478193773776015',
      survivorSourceRowCount: survivorRows.length,
      survivorPostPostPostSuccessorQAvoidingClassCount,
      allRowsHaveTwoPostPostPostPostSuccessorRoots: true,
      emitsTwentyNinePostPostPostPostSuccessorPrimeBuckets: postPostPostPostSuccessorObstructionPrimeBuckets.length === 29,
      opensFreshFallbackSelector: false,
      descendsIntoQ163Singleton: false,
      descendsIntoQ167Singleton: false,
      descendsIntoSingletonQChild: false,
      provesPostPostPostPostSuccessorRootChildrenClosed: false,
      provesPostPostPostPostSuccessorQAvoidingBoundaryClosed: false,
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
  lines.push('# P848 P4217 post-post-post-successor 26-bucket q-avoiding batch cover');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source post-post-post-successor buckets: ${packet.batchCoverSummary.sourcePostPostPostSuccessorBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.batchCoverSummary.sourceRowCount}`);
  lines.push(`- Source post-post-post-successor q-avoiding classes accounted: ${packet.batchCoverSummary.sourcePostPostPostSuccessorQAvoidingClassCount}`);
  lines.push(`- Post-post-post-post-successor buckets: ${packet.batchCoverSummary.postPostPostPostSuccessorObstructionPrimeBucketCount}`);
  lines.push(`- Post-post-post-post-successor prime range: ${packet.batchCoverSummary.minPostPostPostPostSuccessorObstructionPrime}..${packet.batchCoverSummary.maxPostPostPostPostSuccessorObstructionPrime}`);
  lines.push(`- Post-post-post-post-successor root children emitted: ${packet.batchCoverSummary.totalPostPostPostPostSuccessorRootChildCount}`);
  lines.push(`- Post-post-post-post-successor q-avoiding rank classes: ${packet.batchCoverSummary.totalPostPostPostPostSuccessorQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.batchCoverSummary.survivorSourceRowCount}`);
  lines.push(`- Survivor post-post-post-successor q-avoiding classes: ${packet.batchCoverSummary.survivorPostPostPostSuccessorQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Post-Post-Post-Post-Successor Bucket Tokens');
  lines.push('');
  for (const bucket of packet.postPostPostPostSuccessorObstructionPrimeBuckets) {
    lines.push(`- q${bucket.postPostPostPostSuccessorObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourcePostPostPostSuccessorQAvoidingClassCount} source post-post-post-successor q-avoiding classes, ${bucket.postPostPostPostSuccessorRootChildCount} post-post-post-post-successor root children, ${bucket.postPostPostPostSuccessorQAvoidingClassCount} post-post-post-post-successor q-avoiding classes.`);
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
