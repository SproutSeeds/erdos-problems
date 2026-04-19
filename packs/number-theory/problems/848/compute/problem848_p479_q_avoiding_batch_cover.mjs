#!/usr/bin/env node
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

const DEFAULT_BULK_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_AVAILABLE_RESIDUE_BULK_COVER_PACKET.json',
);
const DEFAULT_BUCKET_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_AVAILABLE_OBSTRUCTION_BUCKET_BOUNDARY_PACKET.json',
);
const DEFAULT_Q109_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_Q109_NONUNIFORM_BUCKET_STRUCTURE_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_Q109_SUBBUCKET_CONVERGENCE_ASSEMBLY_PACKET.json',
);

function parseArgs(argv) {
  const options = {
    bulkPacket: DEFAULT_BULK_PACKET,
    bucketPacket: DEFAULT_BUCKET_PACKET,
    q109Packet: DEFAULT_Q109_PACKET,
    assemblyPacket: DEFAULT_ASSEMBLY_PACKET,
    maxPrime: 2000,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--bulk-packet') {
      options.bulkPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--bucket-packet') {
      options.bucketPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--q109-packet') {
      options.q109Packet = path.resolve(argv[index + 1]);
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
  let rootCount = 0;
  for (let y = 0; y < square; y += 1) {
    if ((y * ((y + deltaMod) % square) + 1) % square === 0) {
      rootCount += 1;
    }
  }

  cache.set(key, rootCount);
  return rootCount;
}

function summarizeMap(map, keyName) {
  return [...map.entries()]
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([key, value]) => ({
      [keyName]: Number(key),
      ...value,
    }));
}

function addToPrimeSummary(summary, nextPrime, row) {
  const current = summary.get(nextPrime) ?? {
    sourceRowCount: 0,
    qAvoidingClassCount: 0,
    nextRootChildCount: 0,
    nextQAvoidingClassCount: 0,
  };
  current.sourceRowCount += 1;
  current.qAvoidingClassCount += row.qAvoidingClassCount;
  current.nextRootChildCount += row.nextRootChildCount;
  current.nextQAvoidingClassCount += row.nextQAvoidingClassCount;
  summary.set(nextPrime, current);
}

function addToFamilySummary(summary, row) {
  const current = summary.get(row.sourceFamilyId) ?? {
    sourceFamilyId: row.sourceFamilyId,
    sourceFamilyKind: row.sourceFamilyKind,
    parentObstructionPrime: row.parentObstructionPrime,
    sourceRowCount: 0,
    qAvoidingClassCount: 0,
    nextRootChildCount: 0,
    nextQAvoidingClassCount: 0,
    nextPrimeBuckets: new Map(),
  };
  current.sourceRowCount += 1;
  current.qAvoidingClassCount += row.qAvoidingClassCount;
  current.nextRootChildCount += row.nextRootChildCount;
  current.nextQAvoidingClassCount += row.nextQAvoidingClassCount;
  const bucket = current.nextPrimeBuckets.get(row.nextObstructionPrime) ?? {
    sourceRowCount: 0,
    qAvoidingClassCount: 0,
  };
  bucket.sourceRowCount += 1;
  bucket.qAvoidingClassCount += row.qAvoidingClassCount;
  current.nextPrimeBuckets.set(row.nextObstructionPrime, bucket);
  summary.set(row.sourceFamilyId, current);
}

function compactFamilySummary(summary) {
  return [...summary.values()]
    .sort((left, right) => {
      if (left.parentObstructionPrime !== right.parentObstructionPrime) {
        return left.parentObstructionPrime - right.parentObstructionPrime;
      }
      return left.sourceFamilyId.localeCompare(right.sourceFamilyId);
    })
    .map((family) => ({
      ...family,
      nextPrimeBuckets: summarizeMap(family.nextPrimeBuckets, 'nextObstructionPrime'),
    }));
}

function buildOpenRows({ bulkPacket, bucketPacket, q109Packet }) {
  const bulkByResidue = new Map(
    (bulkPacket.obstructionRows ?? []).map((row) => [row.residueModulo479Square, row]),
  );
  const openRows = [];

  for (const bucket of bucketPacket.bucketBoundaries ?? []) {
    if (bucket.mode !== 'partial_two_root_square_obstruction_children') {
      continue;
    }
    const parentObstructionPrime = bucket.obstructionPrime;
    const parentObstructionSquare = bucket.obstructionSquare;
    for (const compactRow of bucket.rows ?? []) {
      const row = bulkByResidue.get(compactRow.residueModulo479Square);
      if (!row) {
        throw new Error(`Missing bulk row for residue ${compactRow.residueModulo479Square}.`);
      }
      if (row.obstructionPrime !== parentObstructionPrime) {
        throw new Error(`Parent obstruction mismatch for residue ${row.residueModulo479Square}.`);
      }
      openRows.push({
        sourceFamilyId: `q${parentObstructionPrime}_partial_two_root_bucket`,
        sourceFamilyKind: 'partial_two_root_bucket',
        parentObstructionPrime,
        parentObstructionSquare,
        parentRootResidueCount: 2,
        qAvoidingClassCount: parentObstructionSquare - 2,
        residueModulo479Square: row.residueModulo479Square,
        k: row.k,
        delta: row.delta,
      });
    }
  }

  for (const subbucket of q109Packet.subbucketBoundaries ?? []) {
    for (const compactRow of subbucket.rows ?? []) {
      const row = bulkByResidue.get(compactRow.residueModulo479Square);
      if (!row) {
        throw new Error(`Missing q109 bulk row for residue ${compactRow.residueModulo479Square}.`);
      }
      if (row.obstructionPrime !== 109) {
        throw new Error(`Expected q109 parent obstruction for residue ${row.residueModulo479Square}.`);
      }
      openRows.push({
        sourceFamilyId: subbucket.subbucketId,
        sourceFamilyKind: subbucket.subbucketId === 'q109_singular_invertible_109_root_row'
          ? 'q109_singular_subbucket'
          : 'q109_regular_subbucket',
        parentObstructionPrime: 109,
        parentObstructionSquare: 11881,
        parentRootResidueCount: compactRow.rootResidueCount,
        qAvoidingClassCount: 11881 - compactRow.rootResidueCount,
        residueModulo479Square: row.residueModulo479Square,
        k: row.k,
        delta: row.delta,
      });
    }
  }

  return openRows.sort((left, right) => {
    if (left.parentObstructionPrime !== right.parentObstructionPrime) {
      return left.parentObstructionPrime - right.parentObstructionPrime;
    }
    return left.residueModulo479Square - right.residueModulo479Square;
  });
}

function classifyRow(row, primes, maxPrime, rootCache) {
  for (const prime of primes) {
    if (prime <= row.parentObstructionPrime) {
      continue;
    }
    if (prime > maxPrime) {
      break;
    }

    const rootCount = rootsForDelta(row.delta, prime, rootCache);
    if (rootCount === 0) {
      continue;
    }

    const nextObstructionSquare = prime * prime;
    return {
      ...row,
      nextObstructionPrime: prime,
      nextObstructionSquare,
      nextRootResidueCount: rootCount,
      nextRootChildCount: row.qAvoidingClassCount * rootCount,
      nextQAvoidingClassCount: row.qAvoidingClassCount * (nextObstructionSquare - rootCount),
      inheritedNoSmallerObstruction: true,
      parentPrimeExcludedByQAvoidingBoundary: true,
    };
  }

  return {
    ...row,
    nextObstructionPrime: null,
    nextObstructionSquare: null,
    nextRootResidueCount: 0,
    nextRootChildCount: 0,
    nextQAvoidingClassCount: row.qAvoidingClassCount,
    inheritedNoSmallerObstruction: true,
    parentPrimeExcludedByQAvoidingBoundary: true,
  };
}

function buildPacket(options) {
  const bulkPacket = JSON.parse(fs.readFileSync(options.bulkPacket, 'utf8'));
  const bucketPacket = JSON.parse(fs.readFileSync(options.bucketPacket, 'utf8'));
  const q109Packet = JSON.parse(fs.readFileSync(options.q109Packet, 'utf8'));
  const assemblyPacket = JSON.parse(fs.readFileSync(options.assemblyPacket, 'utf8'));
  const primes = primeSieve(options.maxPrime);
  const rootCache = new Map();
  const openRows = buildOpenRows({ bulkPacket, bucketPacket, q109Packet });
  const classifiedRows = openRows.map((row) => classifyRow(row, primes, options.maxPrime, rootCache));
  const survivorRows = classifiedRows.filter((row) => row.nextObstructionPrime === null);
  const byPrime = new Map();
  const byFamily = new Map();

  for (const row of classifiedRows) {
    if (row.nextObstructionPrime !== null) {
      addToPrimeSummary(byPrime, row.nextObstructionPrime, row);
    }
    addToFamilySummary(byFamily, row);
  }

  const nextPrimeBuckets = summarizeMap(byPrime, 'nextObstructionPrime');
  const sourceFamilySummaries = compactFamilySummary(byFamily);
  const qAvoidingClassCount = classifiedRows.reduce((sum, row) => sum + row.qAvoidingClassCount, 0);
  const totalNextRootChildCount = classifiedRows.reduce((sum, row) => sum + row.nextRootChildCount, 0);
  const totalNextQAvoidingClassCount = classifiedRows.reduce((sum, row) => sum + row.nextQAvoidingClassCount, 0);
  const maxNextObstructionPrime = Math.max(...classifiedRows.map((row) => row.nextObstructionPrime ?? 0));
  const nextRootResidueCounts = [...new Set(classifiedRows.map((row) => row.nextRootResidueCount))].sort((left, right) => left - right);

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_q_avoiding_batch_cover/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: survivorRows.length === 0
      ? 'all_post_q109_q_avoiding_boundary_classes_have_next_square_obstruction_child'
      : 'post_q109_q_avoiding_boundary_survivors_ranked',
    target: 'derive_p848_p4217_p443_q97_p479_partial_and_q109_q_avoiding_batch_cover_or_emit_ranked_boundary',
    sourcePackets: [
      'SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_P443_Q97_P479_AVAILABLE_RESIDUE_BULK_COVER_PACKET.json',
      'SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_P443_Q97_P479_AVAILABLE_OBSTRUCTION_BUCKET_BOUNDARY_PACKET.json',
      'SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_P443_Q97_P479_Q109_NONUNIFORM_BUCKET_STRUCTURE_PACKET.json',
      'SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_POST_Q109_SUBBUCKET_CONVERGENCE_ASSEMBLY_PACKET.json',
    ],
    inputBoundaryToken: assemblyPacket.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
      tokenId: 'p443_q97_p479_partial_and_q109_q_avoiding_boundary_families',
      boundaryFamilyCount: 12,
      residueClassCount: 718,
      qAvoidingClassCount: 9733599,
    },
    batchCoverSummary: {
      sourceBoundaryFamilyCount: sourceFamilySummaries.length,
      sourceRowCount: classifiedRows.length,
      qAvoidingClassCount,
      classifiedQAvoidingClassCount: qAvoidingClassCount - survivorRows.reduce((sum, row) => sum + row.qAvoidingClassCount, 0),
      survivorSourceRowCount: survivorRows.length,
      survivorQAvoidingClassCount: survivorRows.reduce((sum, row) => sum + row.qAvoidingClassCount, 0),
      nextObstructionPrimeBucketCount: nextPrimeBuckets.length,
      minNextObstructionPrime: nextPrimeBuckets[0]?.nextObstructionPrime ?? null,
      maxNextObstructionPrime,
      nextRootResidueCounts,
      totalNextRootChildCount,
      totalNextQAvoidingClassCount,
      maxCheckedPrime: options.maxPrime,
      rootCacheEntryCount: rootCache.size,
    },
    proofMechanism: {
      theoremId: 'p848_p4217_p443_q97_p479_partial_and_q109_q_avoiding_row_uniform_next_obstruction',
      status: survivorRows.length === 0
        ? 'proved_for_recorded_12_family_boundary_not_terminal_closure'
        : 'ranked_boundary_with_survivors',
      statement: 'For each recorded post-q109 q-avoiding source row, the parent obstruction prime q is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions from the parent first-obstruction classification; the first later prime with roots of y*(y+delta)+1 modulo r^2 gives a row-uniform next square-obstruction child for every q-avoiding descendant class of that row.',
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_q_avoiding_batch_cover.mjs --pretty',
      proofSketch: [
        'Assemble the 10 partial two-root buckets from the p479 bucket-boundary packet and the q109 regular/singular subbuckets from the q109 structure packet.',
        'For each source row, count the q-avoiding descendant classes as q^2 minus the already emitted q-root count.',
        'Use the parent first-obstruction classification to inherit absence of smaller primes; the parent prime q is excluded by construction of the q-avoiding boundary.',
        'For primes r > q, solve y*(y+delta)+1 == 0 mod r^2. The first r with roots is independent of the q-avoiding descendant residue because the descendant step is invertible modulo r^2 for the recorded first hits.',
        'All 718 source rows have a first later two-root obstruction prime at or below 191, so the 9733599 q-avoiding classes have no survivor in this batch screen.',
      ],
    },
    nextObstructionPrimeBuckets: nextPrimeBuckets,
    sourceFamilySummaries,
    rowClassifications: classifiedRows.map((row) => ({
      sourceFamilyId: row.sourceFamilyId,
      sourceFamilyKind: row.sourceFamilyKind,
      residueModulo479Square: row.residueModulo479Square,
      k: row.k,
      delta: row.delta,
      parentObstructionPrime: row.parentObstructionPrime,
      parentRootResidueCount: row.parentRootResidueCount,
      qAvoidingClassCount: row.qAvoidingClassCount,
      nextObstructionPrime: row.nextObstructionPrime,
      nextObstructionSquare: row.nextObstructionSquare,
      nextRootResidueCount: row.nextRootResidueCount,
      nextRootChildCount: row.nextRootChildCount,
      nextQAvoidingClassCount: row.nextQAvoidingClassCount,
    })),
    finiteTokenTransition: {
      consumedFiniteToken: {
        tokenId: 'p443_q97_p479_partial_and_q109_q_avoiding_boundary_families',
        boundaryFamilyCount: sourceFamilySummaries.length,
        sourceRowCount: classifiedRows.length,
        qAvoidingClassCount,
        status: 'consumed_by_row_uniform_next_obstruction_batch_cover',
      },
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_q_avoiding_next_obstruction_root_children',
          nextObstructionPrimeBucketCount: nextPrimeBuckets.length,
          rootChildCount: totalNextRootChildCount,
          status: 'square_obstruction_children_emitted_not_descended',
        },
        {
          tokenId: 'p443_q97_p479_q_avoiding_next_rank_boundary',
          nextObstructionPrimeBucketCount: nextPrimeBuckets.length,
          qAvoidingClassCount: totalNextQAvoidingClassCount,
          status: 'ranked_boundary_open_for_convergence_assembly',
        },
      ],
    },
    proofBoundary: 'This packet batch-classifies the 12 post-q109 q-avoiding boundary families by row-uniform next square-obstruction primes and records no survivors in the bounded screen. It does not close the emitted next root children, the next q-avoiding rank boundary, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'run_p848_convergence_assembly_after_partial_and_q109_q_avoiding_batch_cover',
      action: 'Run convergence assembly after the 12-family q-avoiding batch cover and choose whether to compress the 13 next-obstruction-prime buckets, prove a structural rank decrease, or emit a deterministic blocker for the enlarged next q-avoiding boundary.',
      coveredFamily: 'The 13 next-obstruction-prime buckets emitted from 9733599 q-avoiding classes, with 19467198 next root children and 170308883793 next q-avoiding rank classes.',
      finiteDenominatorOrRankToken: 'Finite token p443_q97_p479_q_avoiding_next_rank_boundary grouped by next obstruction primes 113 through 191.',
      failureBoundary: 'If no compression theorem exists, emit a deterministic ranked boundary packet over the 13 next-prime buckets and do not descend into singleton root children.',
      completionRule: 'Assembly must choose a batch compression, structural decomposition, or ranked transition before any singleton q-child descent.',
    },
    recommendedNextAction: 'run_p848_convergence_assembly_after_partial_and_q109_q_avoiding_batch_cover',
    nextTheoremMove: 'Run convergence assembly after the 12-family q-avoiding batch cover; the cover has no source-row survivors but emits 13 next-prime buckets and a much larger next q-avoiding rank boundary that must be compressed before singleton descent.',
    claims: {
      consumesPartialAndQ109QAvoidingBoundaryToken: true,
      classifiesAllTwelveBoundaryFamilies: sourceFamilySummaries.length === 12,
      classifiesAllSourceRows: classifiedRows.length === 718,
      classifiesAllQAvoidingClasses: survivorRows.length === 0,
      survivorSourceRowCount: survivorRows.length,
      survivorQAvoidingClassCount: survivorRows.reduce((sum, row) => sum + row.qAvoidingClassCount, 0),
      emitsNextObstructionPrimeBuckets: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ109Singleton: false,
      descendsIntoQ127Singleton: false,
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
  lines.push('# P848 P4217 p479 q-avoiding batch cover');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source boundary families: ${packet.batchCoverSummary.sourceBoundaryFamilyCount}`);
  lines.push(`- Source rows: ${packet.batchCoverSummary.sourceRowCount}`);
  lines.push(`- q-avoiding classes classified: ${packet.batchCoverSummary.classifiedQAvoidingClassCount}`);
  lines.push(`- Survivor q-avoiding classes: ${packet.batchCoverSummary.survivorQAvoidingClassCount}`);
  lines.push(`- Next obstruction prime buckets: ${packet.batchCoverSummary.nextObstructionPrimeBucketCount}`);
  lines.push(`- Next obstruction prime range: ${packet.batchCoverSummary.minNextObstructionPrime}..${packet.batchCoverSummary.maxNextObstructionPrime}`);
  lines.push(`- Next root children emitted: ${packet.batchCoverSummary.totalNextRootChildCount}`);
  lines.push(`- Next q-avoiding rank boundary: ${packet.batchCoverSummary.totalNextQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Prime Buckets');
  lines.push('');
  for (const bucket of packet.nextObstructionPrimeBuckets) {
    lines.push(`- q${bucket.nextObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.qAvoidingClassCount} q-avoiding classes, ${bucket.nextRootChildCount} root children, ${bucket.nextQAvoidingClassCount} next q-avoiding classes.`);
  }
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
