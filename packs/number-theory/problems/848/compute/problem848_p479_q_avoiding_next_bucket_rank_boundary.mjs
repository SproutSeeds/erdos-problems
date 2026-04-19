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
  'P848_P4217_P443_Q97_P479_Q_AVOIDING_BATCH_COVER_PACKET.json',
);
const DEFAULT_ASSEMBLY_PACKET = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_POST_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);
const DEFAULT_JSON_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_Q_AVOIDING_NEXT_BUCKET_RANK_BOUNDARY_PACKET.json',
);
const DEFAULT_MARKDOWN_OUTPUT = path.join(
  FRONTIER_BRIDGE,
  'P848_P4217_P443_Q97_P479_Q_AVOIDING_NEXT_BUCKET_RANK_BOUNDARY_PACKET.md',
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

function groupRowsByNextPrime(rows) {
  const groups = new Map();
  for (const row of rows) {
    const q = Number(row.nextObstructionPrime);
    if (!groups.has(q)) {
      groups.set(q, []);
    }
    groups.get(q).push(row);
  }
  return [...groups.entries()].sort(([left], [right]) => left - right);
}

function buildSourceFamilyProfile(rows) {
  const byFamily = new Map();
  for (const row of rows) {
    const id = row.sourceFamilyId;
    const current = byFamily.get(id) ?? {
      sourceFamilyId: id,
      sourceFamilyKind: row.sourceFamilyKind,
      sourceRowCount: 0,
      qAvoidingClassCount: 0,
      nextRootChildCount: 0,
      nextQAvoidingClassCount: 0,
    };
    current.sourceRowCount += 1;
    current.qAvoidingClassCount += row.qAvoidingClassCount;
    current.nextRootChildCount += row.nextRootChildCount;
    current.nextQAvoidingClassCount += row.nextQAvoidingClassCount;
    byFamily.set(id, current);
  }
  return [...byFamily.values()].sort((left, right) => left.sourceFamilyId.localeCompare(right.sourceFamilyId));
}

function validateRows(rows) {
  const failures = [];
  for (const row of rows) {
    const q = Number(row.nextObstructionPrime);
    const square = q * q;
    const rootCount = Number(row.nextRootResidueCount);
    const qAvoiding = Number(row.qAvoidingClassCount);
    const expectedRootChildren = qAvoiding * rootCount;
    const expectedNextQAvoiding = qAvoiding * (square - rootCount);

    if (Number(row.nextObstructionSquare) !== square) {
      failures.push({ row, reason: 'nextObstructionSquare_mismatch', expected: square });
    }
    if (rootCount !== 2) {
      failures.push({ row, reason: 'unexpected_next_root_residue_count', expected: 2 });
    }
    if (Number(row.nextRootChildCount) !== expectedRootChildren) {
      failures.push({ row, reason: 'nextRootChildCount_mismatch', expected: expectedRootChildren });
    }
    if (Number(row.nextQAvoidingClassCount) !== expectedNextQAvoiding) {
      failures.push({ row, reason: 'nextQAvoidingClassCount_mismatch', expected: expectedNextQAvoiding });
    }
  }
  return failures;
}

function buildPacket(options) {
  const cover = readJson(options.coverPacket);
  const assembly = readJson(options.assemblyPacket);
  const rows = cover.rowClassifications ?? [];
  const coverBuckets = cover.nextObstructionPrimeBuckets ?? [];

  assertCondition(cover.status === 'all_post_q109_q_avoiding_boundary_classes_have_next_square_obstruction_child', 'cover packet status is not the expected no-survivor q-avoiding cover status');
  assertCondition(assembly.status === 'post_q_avoiding_batch_cover_convergence_assembly_selects_13_bucket_rank_compression', 'assembly packet status is not the expected post-cover assembly status');
  assertCondition(Array.isArray(rows) && rows.length === 718, 'expected 718 row classifications');
  assertCondition(Array.isArray(coverBuckets) && coverBuckets.length === 13, 'expected 13 next obstruction prime buckets');

  const rowFailures = validateRows(rows);
  assertCondition(rowFailures.length === 0, `row validation failed for ${rowFailures.length} rows`);

  const bucketByPrime = new Map(coverBuckets.map((bucket) => [Number(bucket.nextObstructionPrime), bucket]));
  const groupedRows = groupRowsByNextPrime(rows);
  assertCondition(groupedRows.length === coverBuckets.length, 'row groups do not match cover bucket count');

  const buckets = groupedRows.map(([nextObstructionPrime, bucketRows]) => {
    const sourceRowCount = bucketRows.length;
    const qAvoidingClassCount = sumBy(bucketRows, 'qAvoidingClassCount');
    const nextRootChildCount = sumBy(bucketRows, 'nextRootChildCount');
    const nextQAvoidingClassCount = sumBy(bucketRows, 'nextQAvoidingClassCount');
    const square = nextObstructionPrime * nextObstructionPrime;
    const expectedNextRootChildCount = qAvoidingClassCount * 2;
    const expectedNextQAvoidingClassCount = qAvoidingClassCount * (square - 2);
    const coverBucket = bucketByPrime.get(nextObstructionPrime);

    assertCondition(Boolean(coverBucket), `missing cover bucket for q${nextObstructionPrime}`);
    assertCondition(coverBucket.sourceRowCount === sourceRowCount, `source row count mismatch for q${nextObstructionPrime}`);
    assertCondition(coverBucket.qAvoidingClassCount === qAvoidingClassCount, `q-avoiding class count mismatch for q${nextObstructionPrime}`);
    assertCondition(coverBucket.nextRootChildCount === nextRootChildCount, `root child count mismatch for q${nextObstructionPrime}`);
    assertCondition(coverBucket.nextQAvoidingClassCount === nextQAvoidingClassCount, `next q-avoiding count mismatch for q${nextObstructionPrime}`);
    assertCondition(nextRootChildCount === expectedNextRootChildCount, `two-root law mismatch for q${nextObstructionPrime}`);
    assertCondition(nextQAvoidingClassCount === expectedNextQAvoidingClassCount, `next-rank law mismatch for q${nextObstructionPrime}`);

    return {
      tokenId: `p443_q97_p479_q_avoiding_next_prime_q${nextObstructionPrime}_rank_boundary`,
      nextObstructionPrime,
      nextObstructionSquare: square,
      sourceRowCount,
      sourceQAvoidingClassCount: qAvoidingClassCount,
      rootResidueCountPerClass: 2,
      nextRootChildCount,
      nextQAvoidingClassCount,
      sourceFamilyProfile: buildSourceFamilyProfile(bucketRows),
      status: 'open_exact_two_root_rank_boundary',
      proofObligation: 'Either cover this q-bucket as part of a next-rank batch/structural theorem, or emit a sharper exact subboundary. Do not descend into a singleton q-child from this packet.',
    };
  });

  const totalSourceRows = sumBy(buckets, 'sourceRowCount');
  const totalSourceQAvoidingClassCount = sumBy(buckets, 'sourceQAvoidingClassCount');
  const totalNextRootChildCount = sumBy(buckets, 'nextRootChildCount');
  const totalNextQAvoidingClassCount = sumBy(buckets, 'nextQAvoidingClassCount');

  assertCondition(totalSourceRows === cover.batchCoverSummary.sourceRowCount, 'total source row count mismatch');
  assertCondition(totalSourceQAvoidingClassCount === cover.batchCoverSummary.classifiedQAvoidingClassCount, 'total q-avoiding class count mismatch');
  assertCondition(totalNextRootChildCount === cover.batchCoverSummary.totalNextRootChildCount, 'total next root child count mismatch');
  assertCondition(totalNextQAvoidingClassCount === cover.batchCoverSummary.totalNextQAvoidingClassCount, 'total next q-avoiding count mismatch');

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_q_avoiding_next_bucket_rank_boundary/1',
    generatedAt: new Date().toISOString(),
    status: 'p479_q_avoiding_next_prime_buckets_deterministic_rank_boundary_emitted',
    target: 'compress_p848_p4217_p443_q97_p479_q_avoiding_next_prime_buckets_or_emit_rank_boundary',
    sourceAudit: {
      qAvoidingCoverPacket: {
        path: path.relative(repoRoot, options.coverPacket),
        sha256: sha256File(options.coverPacket),
        status: cover.status,
      },
      postCoverAssemblyPacket: {
        path: path.relative(repoRoot, options.assemblyPacket),
        sha256: sha256File(options.assemblyPacket),
        status: assembly.status,
      },
    },
    boundarySummary: {
      sourceBoundaryFamilyCount: cover.batchCoverSummary.sourceBoundaryFamilyCount,
      sourceRowCount: totalSourceRows,
      sourceQAvoidingClassCount: totalSourceQAvoidingClassCount,
      nextObstructionPrimeBucketCount: buckets.length,
      minNextObstructionPrime: buckets[0].nextObstructionPrime,
      maxNextObstructionPrime: buckets.at(-1).nextObstructionPrime,
      rootResidueCountsPerClass: [2],
      totalNextRootChildCount,
      totalNextQAvoidingClassCount,
      survivorSourceRowCount: cover.batchCoverSummary.survivorSourceRowCount,
      survivorQAvoidingClassCount: cover.batchCoverSummary.survivorQAvoidingClassCount,
    },
    deterministicRankBoundary: {
      consumedFiniteToken: assembly.finiteMeasureOrNoMeasureYet?.nextFiniteToken?.tokenId ?? 'p443_q97_p479_q_avoiding_next_prime_bucket_rank_boundary',
      producedFiniteTokenCount: buckets.length,
      producedFiniteTokens: buckets,
      measureStatus: 'finite_rank_token_partitioned_not_decreased',
      exactPartition: 'The single 13-bucket rank token is partitioned by next obstruction prime q in {113,127,131,137,139,149,151,157,163,167,173,181,191}.',
    },
    twoRootLaw: {
      theoremId: 'p848_p4217_p443_q97_p479_post_q_avoiding_next_bucket_two_root_law',
      status: 'finite_replay_verified',
      statement: 'For every stored post-q109 q-avoiding source row, the first next square-obstruction prime has exactly two roots modulo q^2; therefore each source q-avoiding class emits two root children and q^2 - 2 next q-avoiding classes at that rank.',
      verifiedRowCount: rows.length,
      bucketCount: buckets.length,
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_q_avoiding_next_bucket_rank_boundary.mjs --pretty',
    },
    proofBoundary: 'This packet accounts for all 13 next-prime buckets emitted by the post-q109 q-avoiding batch cover and records the exact two-root rank boundary. It does not close the 19467198 next root children, the 170308883793 next q-avoiding classes, the p479-available branch, the p479-unavailable complement, q97, p443-unavailable, the wider p4217 complement, collision-free matching, or Problem 848.',
    oneNextAction: {
      stepId: 'run_p848_convergence_assembly_after_13_bucket_rank_boundary',
      action: 'Run convergence assembly after the deterministic 13-bucket rank boundary and choose a multi-bucket next-rank batch cover, structural rank theorem, impossibility theorem, or sharper deterministic boundary before any singleton q-child descent.',
      coveredFamily: 'All 13 next-prime rank buckets over 718 source rows, 9733599 q-avoiding source classes, 19467198 root children, and 170308883793 next q-avoiding classes.',
      finiteDenominatorOrRankToken: 'Thirteen exact q-bucket rank tokens, each with denominator q^2 and two root residues per inherited q-avoiding class.',
      failureBoundary: 'If no shared next-rank theorem is available, write a deterministic per-bucket structural boundary packet; do not open q113/q127/etc. singleton repair descent.',
      completionRule: 'Assembly must name a batch, structural, impossibility, or ranked transition over the 13 tokens before any singleton q-child descent.',
    },
    recommendedNextAction: 'run_p848_convergence_assembly_after_13_bucket_rank_boundary',
    nextTheoremMove: 'Assemble the deterministic 13-bucket rank boundary and choose a next-rank batch/structural theorem over the bucket family; singleton q-child descent remains blocked.',
    claims: {
      consumesNextPrimeBucketRankToken: true,
      accountsForAllNextPrimeBuckets: true,
      accountsForAllSourceRows: totalSourceRows === 718,
      accountsForAllQAvoidingSourceClasses: totalSourceQAvoidingClassCount === 9733599,
      allRowsHaveTwoNextRoots: true,
      emitsDeterministic13BucketRankBoundary: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ113Singleton: false,
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
  lines.push('# P848 P4217 p479 q-avoiding next-bucket rank boundary');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push(`- Source rows accounted: ${packet.boundarySummary.sourceRowCount}`);
  lines.push(`- Source q-avoiding classes accounted: ${packet.boundarySummary.sourceQAvoidingClassCount}`);
  lines.push(`- Next-prime buckets: ${packet.boundarySummary.nextObstructionPrimeBucketCount}`);
  lines.push(`- Next-prime range: ${packet.boundarySummary.minNextObstructionPrime}..${packet.boundarySummary.maxNextObstructionPrime}`);
  lines.push(`- Root children emitted: ${packet.boundarySummary.totalNextRootChildCount}`);
  lines.push(`- Next q-avoiding rank classes: ${packet.boundarySummary.totalNextQAvoidingClassCount}`);
  lines.push('');
  lines.push('## Bucket Tokens');
  lines.push('');
  for (const bucket of packet.deterministicRankBoundary.producedFiniteTokens) {
    lines.push(`- q${bucket.nextObstructionPrime}: ${bucket.sourceRowCount} source rows, ${bucket.sourceQAvoidingClassCount} source q-avoiding classes, ${bucket.nextRootChildCount} root children, ${bucket.nextQAvoidingClassCount} next q-avoiding classes.`);
  }
  lines.push('');
  lines.push('## Two-Root Law');
  lines.push('');
  lines.push(packet.twoRootLaw.statement);
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
