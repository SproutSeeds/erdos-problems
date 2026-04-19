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
  'P848_P4217_P443_Q97_P479_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_RANK_BOUNDARY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_Q_AVOIDING_NEXT_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_13_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_NEXT_RANK_13_BUCKET_BATCH_COVER_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_NEXT_RANK_13_BUCKET_BATCH_COVER_PACKET.md',
);

function parseArgs(argv) {
  const options = {
    sourceCoverPacket: DEFAULT_SOURCE_COVER_PACKET,
    rankBoundaryPacket: DEFAULT_RANK_BOUNDARY_PACKET,
    assemblyPacket: DEFAULT_ASSEMBLY_PACKET,
    maxPrime: 2000,
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

function addToBucketSummary(summary, nextPrime, row) {
  const current = summary.get(nextPrime) ?? {
    sourceRowCount: 0,
    sourceNextQAvoidingClassCount: 0,
    laterRootChildCount: 0,
    laterQAvoidingClassCount: 0,
    sourceNextPrimeBuckets: new Map(),
    rootResidueCounts: new Set(),
  };
  current.sourceRowCount += 1;
  current.sourceNextQAvoidingClassCount += row.sourceNextQAvoidingClassCount;
  current.laterRootChildCount += row.laterRootChildCount;
  current.laterQAvoidingClassCount += row.laterQAvoidingClassCount;
  current.rootResidueCounts.add(row.laterRootResidueCount);
  const sourceBucket = current.sourceNextPrimeBuckets.get(row.sourceNextObstructionPrime) ?? {
    sourceRowCount: 0,
    sourceNextQAvoidingClassCount: 0,
  };
  sourceBucket.sourceRowCount += 1;
  sourceBucket.sourceNextQAvoidingClassCount += row.sourceNextQAvoidingClassCount;
  current.sourceNextPrimeBuckets.set(row.sourceNextObstructionPrime, sourceBucket);
  summary.set(nextPrime, current);
}

function compactBucketSummary(summary) {
  return summarizeMap(summary, 'laterObstructionPrime').map((bucket) => ({
    laterObstructionPrime: bucket.laterObstructionPrime,
    laterObstructionSquare: bucket.laterObstructionPrime * bucket.laterObstructionPrime,
    sourceRowCount: bucket.sourceRowCount,
    sourceNextQAvoidingClassCount: bucket.sourceNextQAvoidingClassCount,
    rootResidueCountsPerClass: [...bucket.rootResidueCounts].sort((left, right) => left - right),
    laterRootChildCount: bucket.laterRootChildCount,
    laterQAvoidingClassCount: bucket.laterQAvoidingClassCount,
    sourceNextPrimeBuckets: summarizeMap(bucket.sourceNextPrimeBuckets, 'sourceNextObstructionPrime'),
    status: 'open_exact_two_root_later_rank_boundary',
  }));
}

function addToSourceBucketSummary(summary, row) {
  const current = summary.get(row.sourceNextObstructionPrime) ?? {
    sourceNextObstructionPrime: row.sourceNextObstructionPrime,
    sourceRowCount: 0,
    sourceNextQAvoidingClassCount: 0,
    laterRootChildCount: 0,
    laterQAvoidingClassCount: 0,
    laterPrimeBuckets: new Map(),
  };
  current.sourceRowCount += 1;
  current.sourceNextQAvoidingClassCount += row.sourceNextQAvoidingClassCount;
  current.laterRootChildCount += row.laterRootChildCount;
  current.laterQAvoidingClassCount += row.laterQAvoidingClassCount;
  const bucket = current.laterPrimeBuckets.get(row.laterObstructionPrime) ?? {
    sourceRowCount: 0,
    sourceNextQAvoidingClassCount: 0,
  };
  bucket.sourceRowCount += 1;
  bucket.sourceNextQAvoidingClassCount += row.sourceNextQAvoidingClassCount;
  current.laterPrimeBuckets.set(row.laterObstructionPrime, bucket);
  summary.set(row.sourceNextObstructionPrime, current);
}

function compactSourceBucketSummary(summary) {
  return summarizeMap(summary, 'sourceNextObstructionPrime').map((sourceBucket) => ({
    ...sourceBucket,
    laterPrimeBuckets: summarizeMap(sourceBucket.laterPrimeBuckets, 'laterObstructionPrime'),
  }));
}

function classifyRow(row, primes, maxPrime, rootCache) {
  const sourceNextObstructionPrime = Number(row.nextObstructionPrime);
  const sourceNextQAvoidingClassCount = Number(row.nextQAvoidingClassCount);

  for (const prime of primes) {
    if (prime <= sourceNextObstructionPrime) {
      continue;
    }
    if (prime > maxPrime) {
      break;
    }

    const roots = rootsForDelta(row.delta, prime, rootCache);
    if (roots.length === 0) {
      continue;
    }

    const laterObstructionSquare = prime * prime;
    return {
      sourceFamilyId: row.sourceFamilyId,
      sourceFamilyKind: row.sourceFamilyKind,
      residueModulo479Square: row.residueModulo479Square,
      k: row.k,
      delta: row.delta,
      parentObstructionPrime: row.parentObstructionPrime,
      sourceNextObstructionPrime,
      sourceNextObstructionSquare: row.nextObstructionSquare,
      sourceNextRootResidueCount: row.nextRootResidueCount,
      sourceNextRootChildCount: row.nextRootChildCount,
      sourceNextQAvoidingClassCount,
      laterObstructionPrime: prime,
      laterObstructionSquare,
      laterRootResidueCount: roots.length,
      laterRootResidues: roots,
      laterRootChildCount: sourceNextQAvoidingClassCount * roots.length,
      laterQAvoidingClassCount: sourceNextQAvoidingClassCount * (laterObstructionSquare - roots.length),
      inheritedNoSmallerObstruction: true,
      sourceNextPrimeExcludedByQAvoidingBoundary: true,
    };
  }

  return {
    sourceFamilyId: row.sourceFamilyId,
    sourceFamilyKind: row.sourceFamilyKind,
    residueModulo479Square: row.residueModulo479Square,
    k: row.k,
    delta: row.delta,
    parentObstructionPrime: row.parentObstructionPrime,
    sourceNextObstructionPrime,
    sourceNextObstructionSquare: row.nextObstructionSquare,
    sourceNextRootResidueCount: row.nextRootResidueCount,
    sourceNextRootChildCount: row.nextRootChildCount,
    sourceNextQAvoidingClassCount,
    laterObstructionPrime: null,
    laterObstructionSquare: null,
    laterRootResidueCount: 0,
    laterRootResidues: [],
    laterRootChildCount: 0,
    laterQAvoidingClassCount: sourceNextQAvoidingClassCount,
    inheritedNoSmallerObstruction: true,
    sourceNextPrimeExcludedByQAvoidingBoundary: true,
  };
}

function buildPacket(options) {
  const sourceCover = readJson(options.sourceCoverPacket);
  const rankBoundary = readJson(options.rankBoundaryPacket);
  const assembly = readJson(options.assemblyPacket);

  assertCondition(sourceCover.status === 'all_post_q109_q_avoiding_boundary_classes_have_next_square_obstruction_child', 'source cover status mismatch');
  assertCondition(rankBoundary.status === 'p479_q_avoiding_next_prime_buckets_deterministic_rank_boundary_emitted', 'rank-boundary status mismatch');
  assertCondition(assembly.status === 'post_13_bucket_rank_boundary_convergence_assembly_selects_next_rank_batch_cover', 'post-13-bucket assembly status mismatch');

  const rows = sourceCover.rowClassifications ?? [];
  assertCondition(rows.length === 718, 'expected 718 row classifications');
  assertCondition(rankBoundary.boundarySummary?.totalNextQAvoidingClassCount === 170308883793, 'rank boundary next q-avoiding count mismatch');

  const primes = primeSieve(options.maxPrime);
  const rootCache = new Map();
  const classifiedRows = rows.map((row) => classifyRow(row, primes, options.maxPrime, rootCache));
  const survivorRows = classifiedRows.filter((row) => row.laterObstructionPrime === null);
  const byLaterPrime = new Map();
  const bySourceBucket = new Map();

  for (const row of classifiedRows) {
    if (row.laterObstructionPrime !== null) {
      addToBucketSummary(byLaterPrime, row.laterObstructionPrime, row);
    }
    addToSourceBucketSummary(bySourceBucket, row);
  }

  const laterObstructionPrimeBuckets = compactBucketSummary(byLaterPrime);
  const sourceBucketSummaries = compactSourceBucketSummary(bySourceBucket);
  const sourceNextQAvoidingClassCount = sumBy(classifiedRows, 'sourceNextQAvoidingClassCount');
  const laterRootChildCount = sumBy(classifiedRows, 'laterRootChildCount');
  const laterQAvoidingClassCount = sumBy(classifiedRows, 'laterQAvoidingClassCount');
  const survivorQAvoidingClassCount = sumBy(survivorRows, 'sourceNextQAvoidingClassCount');
  const laterRootResidueCounts = [...new Set(classifiedRows.map((row) => row.laterRootResidueCount))]
    .sort((left, right) => left - right);

  assertCondition(sourceNextQAvoidingClassCount === rankBoundary.boundarySummary.totalNextQAvoidingClassCount, 'source next q-avoiding total mismatch');
  assertCondition(survivorRows.length === 0, `expected no survivor rows, found ${survivorRows.length}`);
  assertCondition(survivorQAvoidingClassCount === 0, `expected no survivor classes, found ${survivorQAvoidingClassCount}`);
  assertCondition(laterRootResidueCounts.length === 1 && laterRootResidueCounts[0] === 2, 'expected a two-root later obstruction law');

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_next_rank_13_bucket_batch_cover/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'all_13_bucket_next_rank_q_avoiding_classes_have_later_square_obstruction_child',
    target: 'derive_p848_p4217_p443_q97_p479_next_rank_13_bucket_batch_cover_or_emit_boundary',
    sourceAudit: {
      qAvoidingSourceCoverPacket: {
        path: path.relative(repoRoot, options.sourceCoverPacket),
        sha256: sha256File(options.sourceCoverPacket),
        status: sourceCover.status,
      },
      nextBucketRankBoundaryPacket: {
        path: path.relative(repoRoot, options.rankBoundaryPacket),
        sha256: sha256File(options.rankBoundaryPacket),
        status: rankBoundary.status,
      },
      post13BucketAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    inputRankToken: assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
      tokenId: 'p443_q97_p479_q_avoiding_13_bucket_next_rank_batch_cover',
      coveredBucketCount: 13,
      status: 'selected',
    },
    batchCoverSummary: {
      sourceBucketCount: rankBoundary.boundarySummary.nextObstructionPrimeBucketCount,
      sourceRowCount: classifiedRows.length,
      sourceNextQAvoidingClassCount,
      classifiedNextQAvoidingClassCount: sourceNextQAvoidingClassCount - survivorQAvoidingClassCount,
      survivorSourceRowCount: survivorRows.length,
      survivorNextQAvoidingClassCount: survivorQAvoidingClassCount,
      laterObstructionPrimeBucketCount: laterObstructionPrimeBuckets.length,
      minLaterObstructionPrime: laterObstructionPrimeBuckets[0]?.laterObstructionPrime ?? null,
      maxLaterObstructionPrime: laterObstructionPrimeBuckets.at(-1)?.laterObstructionPrime ?? null,
      laterRootResidueCounts,
      totalLaterRootChildCount: laterRootChildCount,
      totalLaterQAvoidingClassCount: laterQAvoidingClassCount,
      maxCheckedPrime: options.maxPrime,
      rootCacheEntryCount: rootCache.size,
    },
    proofMechanism: {
      theoremId: 'p848_p4217_p443_q97_p479_next_rank_13_bucket_row_uniform_later_obstruction',
      status: 'proved_for_recorded_13_bucket_rank_boundary_not_terminal_closure',
      statement: 'For every recorded row in the deterministic 13-bucket rank boundary, the current next-obstruction prime is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions from the previous first-obstruction classification; the first later prime with roots of y*(y+delta)+1 modulo s^2 gives a row-uniform square-obstruction child for every next q-avoiding descendant class of that row.',
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_next_rank_13_bucket_batch_cover.mjs --pretty',
      proofSketch: [
        'Read the 718 row classifications from the q-avoiding batch-cover packet and the deterministic 13-bucket rank boundary.',
        'For each row, use the next q-avoiding class count emitted by the rank-boundary packet as the source class count for this layer.',
        'Skip primes at or below the current next-obstruction prime because the previous rank boundary already made it the first obstruction and the current q-avoiding layer excludes that prime.',
        'For later primes s, solve y*(y+delta)+1 == 0 mod s^2. The first s with roots is row-uniform across the source next q-avoiding classes because the inherited row step is invertible modulo s^2 at the recorded first hit.',
        'All 718 rows have a first later two-root obstruction prime at or below 199, so all 170,308,883,793 next q-avoiding classes are classified with no survivors.',
      ],
    },
    laterObstructionPrimeBuckets,
    sourceBucketSummaries,
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
      laterRootResidues: row.laterRootResidues,
      laterRootChildCount: row.laterRootChildCount,
      laterQAvoidingClassCount: row.laterQAvoidingClassCount,
    })),
    finiteTokenTransition: {
      consumedFiniteToken: {
        tokenId: 'p443_q97_p479_q_avoiding_13_bucket_next_rank_batch_cover',
        sourceBucketCount: rankBoundary.boundarySummary.nextObstructionPrimeBucketCount,
        sourceRowCount: classifiedRows.length,
        sourceNextQAvoidingClassCount,
        status: 'consumed_by_row_uniform_later_obstruction_batch_cover',
      },
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_next_rank_later_obstruction_root_children',
          laterObstructionPrimeBucketCount: laterObstructionPrimeBuckets.length,
          rootChildCount: laterRootChildCount,
          status: 'square_obstruction_children_emitted_not_descended',
        },
        {
          tokenId: 'p443_q97_p479_next_rank_later_q_avoiding_boundary',
          laterObstructionPrimeBucketCount: laterObstructionPrimeBuckets.length,
          qAvoidingClassCount: laterQAvoidingClassCount,
          status: 'ranked_boundary_open_for_convergence_assembly',
        },
      ],
    },
    proofBoundary: 'This packet batch-classifies the next q-avoiding rank boundary emitted by the deterministic 13-bucket packet: all 170,308,883,793 source next q-avoiding classes have a row-uniform later square-obstruction child by prime 199. It does not close the 340,617,767,586 later root children, the 3,652,250,197,976,151 later q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'run_p848_convergence_assembly_after_next_rank_13_bucket_batch_cover',
      action: 'Run convergence assembly after the next-rank 13-bucket batch cover and choose whether to compress the 15 later-obstruction-prime buckets, prove a structural rank decrease, or emit a deterministic boundary for the enlarged later q-avoiding rank surface.',
      coveredFamily: 'The 15 later-obstruction-prime buckets emitted from 170,308,883,793 next q-avoiding classes, with 340,617,767,586 later root children and 3,652,250,197,976,151 later q-avoiding classes.',
      finiteDenominatorOrRankToken: 'Finite token p443_q97_p479_next_rank_later_q_avoiding_boundary grouped by later obstruction primes 127 through 199.',
      failureBoundary: 'If no compression theorem exists, emit a deterministic ranked boundary packet over all 15 later-prime buckets and do not descend into singleton root children.',
      completionRule: 'Assembly must choose bucket compression, structural decomposition, impossibility, or ranked transition before any singleton q-child descent.',
    },
    recommendedNextAction: 'run_p848_convergence_assembly_after_next_rank_13_bucket_batch_cover',
    nextTheoremMove: 'Run convergence assembly over the 15 later-prime buckets emitted by the next-rank batch cover; singleton q-child descent remains blocked until that assembly selects a finite token.',
    claims: {
      consumes13BucketNextRankBatchToken: true,
      classifiesAll13SourceBucketTokens: true,
      classifiesAllSourceRows: classifiedRows.length === 718,
      classifiesAllNextQAvoidingClasses: sourceNextQAvoidingClassCount === 170308883793,
      survivorSourceRowCount: survivorRows.length,
      survivorNextQAvoidingClassCount: survivorQAvoidingClassCount,
      allRowsHaveTwoLaterRoots: true,
      emitsFifteenLaterPrimeBuckets: laterObstructionPrimeBuckets.length === 15,
      opensFreshFallbackSelector: false,
      descendsIntoQ113Singleton: false,
      descendsIntoQ127Singleton: false,
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
  lines.push('# P848 P4217 next-rank 13-bucket batch cover');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source q-bucket tokens: ${packet.batchCoverSummary.sourceBucketCount}`);
  lines.push(`- Source rows accounted: ${packet.batchCoverSummary.sourceRowCount}`);
  lines.push(`- Source next q-avoiding classes accounted: ${packet.batchCoverSummary.sourceNextQAvoidingClassCount}`);
  lines.push(`- Later-prime buckets: ${packet.batchCoverSummary.laterObstructionPrimeBucketCount}`);
  lines.push(`- Later-prime range: ${packet.batchCoverSummary.minLaterObstructionPrime}..${packet.batchCoverSummary.maxLaterObstructionPrime}`);
  lines.push(`- Later root children emitted: ${packet.batchCoverSummary.totalLaterRootChildCount}`);
  lines.push(`- Later q-avoiding rank classes: ${packet.batchCoverSummary.totalLaterQAvoidingClassCount}`);
  lines.push(`- Survivor source rows: ${packet.batchCoverSummary.survivorSourceRowCount}`);
  lines.push(`- Survivor next q-avoiding classes: ${packet.batchCoverSummary.survivorNextQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Later Bucket Tokens');
  lines.push('');
  for (const bucket of packet.laterObstructionPrimeBuckets) {
    lines.push(`- q${bucket.laterObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourceNextQAvoidingClassCount} source next q-avoiding classes, ${bucket.laterRootChildCount} later root children, ${bucket.laterQAvoidingClassCount} later q-avoiding classes.`);
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
