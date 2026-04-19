#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

function layerName(postCount) {
  return `post${'Post'.repeat(postCount - 1)}Successor`;
}

function layerNameCap(postCount) {
  return `${'Post'.repeat(postCount)}Successor`;
}

function layerLabel(postCount) {
  return `${Array(postCount).fill('post').join('-')}-successor`;
}

const SOURCE_POST_COUNT = 8;
const TARGET_POST_COUNT = 9;
const SOURCE_LAYER = layerName(SOURCE_POST_COUNT);
const SOURCE_LAYER_CAP = layerNameCap(SOURCE_POST_COUNT);
const SOURCE_LABEL = layerLabel(SOURCE_POST_COUNT);
const TARGET_LAYER = layerName(TARGET_POST_COUNT);
const TARGET_LAYER_CAP = layerNameCap(TARGET_POST_COUNT);
const TARGET_LABEL = layerLabel(TARGET_POST_COUNT);

const DEFAULT_SOURCE_COVER_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_POST_POST_POST_POST_POST_POST_POST_SUCCESSOR_31_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_RANK_BOUNDARY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.md',
);

const EXPECTED_SOURCE_COVER_STATUS = 'all_31_bucket_post_post_post_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child';
const EXPECTED_RANK_BOUNDARY_STATUS = 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_31_bucket_deterministic_rank_boundary_emitted';
const EXPECTED_ASSEMBLY_STATUS = 'post31_q_avoiding_post8_successor_31_bucket_rank_boundary_convergence_assembly_selects_31_bucket_q_avoiding_cover';
const OUTPUT_STATUS = 'all_31_bucket_post_post_post_post_post_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child';
const TARGET = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_31_bucket_q_avoiding_batch_cover_or_emit_boundary';
const NEXT_ACTION = TARGET
  .replace(/^derive_p848_p4217_p443_q97_p479_/, 'run_p848_convergence_assembly_after_')
  .replace(/_or_emit_boundary$/, '');
const CONSUMED_TOKEN = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_q_avoiding_batch_cover';
const ROOT_CHILD_TOKEN = `${CONSUMED_TOKEN.replace(/_q_avoiding_batch_cover$/, '')}_${TARGET_LABEL.replaceAll('-', '_')}_root_children`;
const Q_AVOIDING_BOUNDARY_TOKEN = `${CONSUMED_TOKEN.replace(/_q_avoiding_batch_cover$/, '')}_${TARGET_LABEL.replaceAll('-', '_')}_q_avoiding_boundary`;

const sourcePrimeKey = `${SOURCE_LAYER}ObstructionPrime`;
const sourceQAvoidingKey = `${SOURCE_LAYER}QAvoidingClassCount`;
const sourceCountKey = `source${SOURCE_LAYER_CAP}QAvoidingClassCount`;
const targetPrimeKey = `${TARGET_LAYER}ObstructionPrime`;
const targetSquareKey = `${TARGET_LAYER}ObstructionSquare`;
const targetRootCountKey = `${TARGET_LAYER}RootResidueCount`;
const targetRootResiduesKey = `${TARGET_LAYER}RootResidues`;
const targetRootChildCountKey = `${TARGET_LAYER}RootChildCount`;
const targetQAvoidingKey = `${TARGET_LAYER}QAvoidingClassCount`;
const targetBucketsKey = `${TARGET_LAYER}ObstructionPrimeBuckets`;
const targetBucketCountKey = `${TARGET_LAYER}ObstructionPrimeBucketCount`;
const targetTotalRootChildCountKey = `total${TARGET_LAYER_CAP}RootChildCount`;
const targetTotalQAvoidingKey = `total${TARGET_LAYER_CAP}QAvoidingClassCount`;
const sourceBucketCountKey = `source${SOURCE_LAYER_CAP}BucketCount`;
const survivorCountKey = `survivor${SOURCE_LAYER_CAP}QAvoidingClassCount`;

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

function toBigInt(value, label) {
  try {
    return BigInt(String(value));
  } catch {
    throw new Error(`Invalid BigInt for ${label}: ${value}`);
  }
}

function addStrings(left, right) {
  return (BigInt(left ?? 0) + BigInt(right ?? 0)).toString();
}

function sumString(rows, key) {
  return rows.reduce((sum, row) => sum + toBigInt(row[key] ?? 0, key), 0n).toString();
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

function classifyRow(row, primes, maxPrime, rootCache) {
  const sourceCount = toBigInt(row[sourceQAvoidingKey], sourceQAvoidingKey);
  const sourcePrime = Number(row[sourcePrimeKey]);
  assertCondition(Number.isInteger(sourcePrime), `missing ${sourcePrimeKey}`);

  for (const prime of primes) {
    if (prime <= sourcePrime) {
      continue;
    }
    if (prime > maxPrime) {
      break;
    }
    const roots = rootsForDelta(row.delta, prime, rootCache);
    if (roots.length === 0) {
      continue;
    }
    const square = prime * prime;
    const rootChildCount = sourceCount * BigInt(roots.length);
    const qAvoidingCount = sourceCount * BigInt(square - roots.length);
    return {
      ...row,
      [sourceCountKey]: sourceCount.toString(),
      [targetPrimeKey]: prime,
      [targetSquareKey]: square,
      [targetRootCountKey]: roots.length,
      [targetRootResiduesKey]: roots,
      [targetRootChildCountKey]: rootChildCount.toString(),
      [targetQAvoidingKey]: qAvoidingCount.toString(),
      inheritedNoSmallerObstruction: true,
      [`previous${SOURCE_LAYER_CAP}PrimeExcludedByQAvoidingBoundary`]: true,
    };
  }

  return {
    ...row,
    [sourceCountKey]: sourceCount.toString(),
    [targetPrimeKey]: null,
    [targetSquareKey]: null,
    [targetRootCountKey]: 0,
    [targetRootResiduesKey]: [],
    [targetRootChildCountKey]: '0',
    [targetQAvoidingKey]: sourceCount.toString(),
    inheritedNoSmallerObstruction: true,
    [`previous${SOURCE_LAYER_CAP}PrimeExcludedByQAvoidingBoundary`]: true,
  };
}

function addNested(map, key, count) {
  const current = map.get(key) ?? { sourceRowCount: 0, [sourceCountKey]: '0' };
  current.sourceRowCount += 1;
  current[sourceCountKey] = addStrings(current[sourceCountKey], count);
  map.set(key, current);
}

function compactNested(map, keyName) {
  return [...map.entries()]
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([key, value]) => ({ [keyName]: Number(key), ...value }));
}

function summarizeBuckets(rows) {
  const map = new Map();
  for (const row of rows) {
    const prime = row[targetPrimeKey];
    if (prime === null) {
      continue;
    }
    const current = map.get(prime) ?? {
      sourceRowCount: 0,
      [sourceCountKey]: '0',
      [targetRootChildCountKey]: '0',
      [targetQAvoidingKey]: '0',
      rootResidueCounts: new Set(),
      previousSourcePrimeBuckets: new Map(),
    };
    current.sourceRowCount += 1;
    current[sourceCountKey] = addStrings(current[sourceCountKey], row[sourceCountKey]);
    current[targetRootChildCountKey] = addStrings(current[targetRootChildCountKey], row[targetRootChildCountKey]);
    current[targetQAvoidingKey] = addStrings(current[targetQAvoidingKey], row[targetQAvoidingKey]);
    current.rootResidueCounts.add(row[targetRootCountKey]);
    addNested(current.previousSourcePrimeBuckets, row[sourcePrimeKey], row[sourceCountKey]);
    map.set(prime, current);
  }

  return [...map.entries()]
    .sort((left, right) => Number(left[0]) - Number(right[0]))
    .map(([prime, bucket]) => ({
      tokenId: `${CONSUMED_TOKEN}_q${prime}_rank_boundary`,
      [targetPrimeKey]: Number(prime),
      [targetSquareKey]: Number(prime) * Number(prime),
      sourceRowCount: bucket.sourceRowCount,
      [sourceCountKey]: bucket[sourceCountKey],
      rootResidueCountsPerClass: [...bucket.rootResidueCounts].sort((left, right) => left - right),
      [targetRootChildCountKey]: bucket[targetRootChildCountKey],
      [targetQAvoidingKey]: bucket[targetQAvoidingKey],
      [`previous${SOURCE_LAYER_CAP}PrimeBuckets`]: compactNested(
        bucket.previousSourcePrimeBuckets,
        `previous${SOURCE_LAYER_CAP}ObstructionPrime`,
      ),
      status: `open_exact_two_root_${TARGET_LABEL.replaceAll('-', '_')}_rank_boundary`,
      proofObligation: `Keep q${prime} inside the whole ${TARGET_LABEL} batch/rank surface; this bucket does not authorize singleton descent.`,
    }));
}

function buildPacket(options) {
  const sourceCover = readJson(options.sourceCoverPacket);
  const rankBoundary = readJson(options.rankBoundaryPacket);
  const assembly = readJson(options.assemblyPacket);
  const rows = sourceCover.rowClassifications ?? [];

  assertCondition(sourceCover.status === EXPECTED_SOURCE_COVER_STATUS, 'source q-cover status mismatch');
  assertCondition(rankBoundary.status === EXPECTED_RANK_BOUNDARY_STATUS, 'rank-boundary status mismatch');
  assertCondition(assembly.status === EXPECTED_ASSEMBLY_STATUS, 'rank-boundary assembly status mismatch');
  assertCondition(rankBoundary.nextQCoverActionAfterAssembly === TARGET || assembly.recommendedNextAction === TARGET, 'post-assembly q-cover action mismatch');
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 source row classifications');

  const sourceTotal = sourceCover.batchCoverSummary?.[targetTotalQAvoidingKey]
    ?? sourceCover.batchCoverSummary?.[`total${SOURCE_LAYER_CAP}QAvoidingClassCount`];
  const rankTotal = rankBoundary.boundarySummary?.[`total${SOURCE_LAYER_CAP}QAvoidingClassCount`];
  const assemblyTotal = assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken?.[sourceQAvoidingKey]
    ?? assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken?.qAvoidingClassCount;
  assertCondition(BigInt(sourceTotal ?? 0) === BigInt(rankTotal ?? 0), 'source/rank q-avoiding total mismatch');
  assertCondition(BigInt(sourceTotal ?? 0) === BigInt(assemblyTotal ?? 0), 'source/assembly q-avoiding total mismatch');

  const primes = primeSieve(options.maxPrime);
  const rootCache = new Map();
  const classifiedRows = rows.map((row) => classifyRow(row, primes, options.maxPrime, rootCache));
  const survivorRows = classifiedRows.filter((row) => row[targetPrimeKey] === null);
  const buckets = summarizeBuckets(classifiedRows);
  const sourceCount = sumString(classifiedRows, sourceCountKey);
  const rootChildCount = sumString(classifiedRows, targetRootChildCountKey);
  const qAvoidingCount = sumString(classifiedRows, targetQAvoidingKey);
  const survivorCount = sumString(survivorRows, sourceCountKey);
  const rootResidueCounts = [...new Set(classifiedRows.map((row) => row[targetRootCountKey]))]
    .sort((left, right) => left - right);
  const obstructionPrimes = buckets.map((bucket) => bucket[targetPrimeKey]);

  assertCondition(sourceCount === BigInt(sourceTotal).toString(), `${SOURCE_LABEL} source q-avoiding total mismatch`);
  assertCondition(survivorRows.length === 0, `expected no survivor rows, found ${survivorRows.length}`);
  assertCondition(survivorCount === '0', `expected no survivor classes, found ${survivorCount}`);
  assertCondition(rootResidueCounts.length === 1 && rootResidueCounts[0] === 2, `expected row-uniform two-root law, got ${JSON.stringify(rootResidueCounts)}`);

  return {
    schema: 'erdos.number_theory.p848_p4217_post31_q_avoiding_post8_successor_31_bucket_q_avoiding_batch_cover/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: OUTPUT_STATUS,
    target: TARGET,
    sourceAudit: {
      sourceCoverPacket: {
        path: path.relative(repoRoot, options.sourceCoverPacket),
        sha256: sha256File(options.sourceCoverPacket),
        status: sourceCover.status,
      },
      rankBoundaryPacket: {
        path: path.relative(repoRoot, options.rankBoundaryPacket),
        sha256: sha256File(options.rankBoundaryPacket),
        status: rankBoundary.status,
      },
      rankBoundaryConvergenceAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    inputRankToken: assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken
      ?? rankBoundary.finiteTokenTransition?.nextFiniteToken
      ?? {
        tokenId: CONSUMED_TOKEN,
        bucketCount: 31,
        qAvoidingClassCount: sourceCount,
        status: 'selected',
      },
    batchCoverSummary: {
      [sourceBucketCountKey]: 31,
      sourceRowCount: classifiedRows.length,
      [sourceCountKey]: sourceCount,
      classifiedSourceRowCount: classifiedRows.length - survivorRows.length,
      classifiedSourceQAvoidingClassCount: addStrings(sourceCount, `-${survivorCount}`),
      survivorSourceRowCount: survivorRows.length,
      [survivorCountKey]: survivorCount,
      [targetBucketCountKey]: buckets.length,
      minTargetObstructionPrime: obstructionPrimes[0] ?? null,
      maxTargetObstructionPrime: obstructionPrimes.at(-1) ?? null,
      [`${TARGET_LAYER}RootResidueCounts`]: rootResidueCounts,
      [targetTotalRootChildCountKey]: rootChildCount,
      [targetTotalQAvoidingKey]: qAvoidingCount,
      maxCheckedPrime: options.maxPrime,
      rootCacheEntryCount: rootCache.size,
    },
    proofMechanism: {
      theoremId: 'p848_p4217_post31_q_avoiding_post8_successor_31_bucket_row_uniform_post9_obstruction',
      status: 'proved_for_recorded_31_bucket_post8_q_avoiding_boundary_not_terminal_closure',
      statement: `For every recorded row in the deterministic q191..q383 ${SOURCE_LABEL} q-avoiding boundary, the current ${SOURCE_LABEL} obstruction prime is excluded by the q-avoiding residue condition; smaller primes are inherited as non-obstructions; the first later prime with roots of y*(y+delta)+1 modulo s^2 gives a row-uniform ${TARGET_LABEL} square-obstruction child for every descendant class of that row.`,
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_post31_q_avoiding_post8_successor_31_bucket_q_avoiding_batch_cover.mjs --pretty',
      proofSketch: [
        'Read the 718 row classifications from the previous q-cover plus the deterministic q191..q383 rank boundary and its assembly.',
        `Use each row ${SOURCE_LABEL} q-avoiding class count as the source class count for this layer.`,
        `Skip primes at or below the current ${SOURCE_LABEL} obstruction prime because the q-avoiding layer excludes that prime and earlier layers already classified smaller primes.`,
        'For later primes s, solve y*(y+delta)+1 == 0 mod s^2. The first s with roots is row-uniform across the inherited descendants.',
        `All 718 source rows have a first later two-root obstruction prime at or below q${obstructionPrimes.at(-1)}, so all source classes are classified with no survivors.`,
      ],
    },
    [targetBucketsKey]: buckets,
    rowClassifications: classifiedRows,
    finiteTokenTransition: {
      consumedFiniteToken: {
        tokenId: CONSUMED_TOKEN,
        [sourceBucketCountKey]: 31,
        sourceRowCount: classifiedRows.length,
        [sourceCountKey]: sourceCount,
        status: 'consumed_by_row_uniform_post9_obstruction_batch_cover',
      },
      producedFiniteTokens: [
        {
          tokenId: ROOT_CHILD_TOKEN,
          [targetBucketCountKey]: buckets.length,
          rootChildCount,
          status: 'square_obstruction_children_emitted_not_descended',
        },
        {
          tokenId: Q_AVOIDING_BOUNDARY_TOKEN,
          [targetBucketCountKey]: buckets.length,
          qAvoidingClassCount: qAvoidingCount,
          status: 'ranked_boundary_open_for_convergence_assembly',
        },
      ],
    },
    proofBoundary: `This packet batch-classifies the q191..q383 ${SOURCE_LABEL} q-avoiding boundary: all ${sourceCount} source classes have a row-uniform later square-obstruction child by prime ${obstructionPrimes.at(-1)}. It does not close the ${rootChildCount} ${TARGET_LABEL} root children, the ${qAvoidingCount} ${TARGET_LABEL} q-avoiding classes, the p479 branches, q97, p443-unavailable, the p4217 complement, collision-free matching, or Problem 848.`,
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: `Run convergence assembly after the whole q191..q383 q-avoiding cover and choose whether to compress the ${buckets.length} ${TARGET_LABEL} buckets, prove a structural rank decrease, or emit a deterministic boundary for the enlarged q-avoiding rank surface.`,
      coveredFamily: `All ${buckets.length} ${TARGET_LABEL} obstruction-prime buckets emitted from ${sourceCount} q191..q383 source classes, with ${rootChildCount} root children and ${qAvoidingCount} q-avoiding classes.`,
      finiteDenominatorOrRankToken: Q_AVOIDING_BOUNDARY_TOKEN,
      failureBoundary: `If no compression theorem exists, emit a deterministic ranked boundary packet over all ${buckets.length} ${TARGET_LABEL} buckets and do not descend into singleton root children.`,
      completionRule: 'Assembly must choose bucket compression, structural decomposition, impossibility, or ranked transition before any singleton q-child descent.',
    },
    recommendedNextAction: NEXT_ACTION,
    nextTheoremMove: `Run convergence assembly over the ${buckets.length} ${TARGET_LABEL} obstruction-prime buckets emitted by the q191..q383 q-avoiding batch cover; singleton q-child descent remains blocked until that assembly selects a finite token.`,
    claims: {
      consumes31BucketPost8SuccessorQAvoidingToken: true,
      classifiesAll31SourceBucketTokens: true,
      classifiesAllSourceRows: classifiedRows.length === 718,
      classifiesAllSourceQAvoidingClasses: sourceCount === BigInt(sourceTotal).toString(),
      survivorSourceRowCount: survivorRows.length,
      [survivorCountKey]: survivorCount,
      allRowsHaveTwoTargetRoots: true,
      emitsTargetPrimeBuckets: buckets.length,
      opensFreshFallbackSelector: false,
      descendsIntoQ191Singleton: false,
      descendsIntoQ193Singleton: false,
      descendsIntoSingletonQChild: false,
      provesTargetRootChildrenClosed: false,
      provesTargetQAvoidingBoundaryClosed: false,
      provesP4217ComplementCoverage: false,
      provesAllN: false,
    },
  };
}

function renderMarkdown(packet) {
  const lines = [];
  lines.push('# P848 P4217 q191..q383 q-avoiding batch cover');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source ${SOURCE_LABEL} buckets: ${packet.batchCoverSummary[sourceBucketCountKey]}`);
  lines.push(`- Source rows accounted: ${packet.batchCoverSummary.sourceRowCount}`);
  lines.push(`- Source classes accounted: ${packet.batchCoverSummary[sourceCountKey]}`);
  lines.push(`- ${TARGET_LABEL} buckets: ${packet.batchCoverSummary[targetBucketCountKey]}`);
  lines.push(`- ${TARGET_LABEL} prime range: ${packet.batchCoverSummary.minTargetObstructionPrime}..${packet.batchCoverSummary.maxTargetObstructionPrime}`);
  lines.push(`- ${TARGET_LABEL} root children emitted: ${packet.batchCoverSummary[targetTotalRootChildCountKey]}`);
  lines.push(`- ${TARGET_LABEL} q-avoiding rank classes: ${packet.batchCoverSummary[targetTotalQAvoidingKey]}`);
  lines.push(`- Survivor source rows: ${packet.batchCoverSummary.survivorSourceRowCount}`);
  lines.push(`- Survivor source classes: ${packet.batchCoverSummary[survivorCountKey]}`);
  lines.push('');
  lines.push(`## ${TARGET_LABEL} Bucket Tokens`);
  lines.push('');
  for (const bucket of packet[targetBucketsKey]) {
    lines.push(`- q${bucket[targetPrimeKey]}: ${bucket.sourceRowCount} source rows, ${bucket[sourceCountKey]} source classes, ${bucket[targetRootChildCountKey]} root children, ${bucket[targetQAvoidingKey]} q-avoiding classes.`);
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
