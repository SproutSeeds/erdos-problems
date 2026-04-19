#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');

const DEFAULT_BULK_PACKET = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'SPLIT_ATOM_PACKETS',
  'FRONTIER_BRIDGE',
  'P848_P4217_P443_Q97_P479_AVAILABLE_RESIDUE_BULK_COVER_PACKET.json',
);

const DEFAULT_ASSEMBLY_PACKET = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'SPLIT_ATOM_PACKETS',
  'FRONTIER_BRIDGE',
  'P848_P4217_POST_P479_AVAILABLE_BULK_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
);

function parseArgs(argv) {
  const options = {
    bulkPacket: DEFAULT_BULK_PACKET,
    assemblyPacket: DEFAULT_ASSEMBLY_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--bulk-packet') {
      options.bulkPacket = path.resolve(argv[index + 1]);
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

function compactRow(row, mode) {
  const compact = {
    residueModulo479Square: row.residueModulo479Square,
    k: row.k,
    delta: row.delta,
  };

  if (mode === 'terminal_full_family_square_obstruction') {
    return {
      ...compact,
      rootResiduesModuloObstructionSquare: 'all_residues_mod_obstruction_square',
      rootResidueCount: row.obstructionSquare,
      yRootsModuloObstructionSquare: null,
    };
  }

  return {
    ...compact,
    rootResiduesModuloObstructionSquare: row.rootResiduesModuloObstructionSquare,
    yRootsModuloObstructionSquare: row.yRootsModuloObstructionSquare,
  };
}

function bucketMode(rows, obstructionSquare) {
  const allTerminal = rows.every((row) => (
    row.invertibleFamilyStepModuloObstructionSquare === false
    && row.gcdFamilyStepWithObstructionSquare === obstructionSquare
    && row.yRootsModuloObstructionSquare === null
    && Array.isArray(row.rootResiduesModuloObstructionSquare)
    && row.rootResiduesModuloObstructionSquare.length === obstructionSquare
  ));
  if (allTerminal) {
    return 'terminal_full_family_square_obstruction';
  }

  const allPartialTwoRoot = rows.every((row) => (
    row.invertibleFamilyStepModuloObstructionSquare === true
    && row.gcdFamilyStepWithObstructionSquare === 1
    && Array.isArray(row.rootResiduesModuloObstructionSquare)
    && row.rootResiduesModuloObstructionSquare.length === 2
    && Array.isArray(row.yRootsModuloObstructionSquare)
    && row.yRootsModuloObstructionSquare.length === 2
  ));
  if (allPartialTwoRoot) {
    return 'partial_two_root_square_obstruction_children';
  }

  return 'nonuniform_bucket_boundary';
}

function summarizeBucket(prime, rows) {
  const obstructionSquare = prime * prime;
  const sortedRows = [...rows].sort((left, right) => left.residueModulo479Square - right.residueModulo479Square);
  const mode = bucketMode(sortedRows, obstructionSquare);
  const residueValues = sortedRows.map((row) => row.residueModulo479Square);
  const kValues = sortedRows.map((row) => row.k);
  const partial = mode === 'partial_two_root_square_obstruction_children';
  const terminal = mode === 'terminal_full_family_square_obstruction';
  const rootChildCount = partial ? sortedRows.length * 2 : 0;
  const qAvoidingClassCount = partial ? sortedRows.length * (obstructionSquare - 2) : 0;

  return {
    bucketId: `q${prime}`,
    obstructionPrime: prime,
    obstructionSquare,
    mode,
    status: terminal
      ? 'terminally_closed_by_full_family_square_obstruction'
      : partial
      ? 'partial_boundary_emitted_root_children_and_q_avoiding_complement_open'
      : 'nonuniform_boundary_requires_manual_successor',
    residueClassCount: sortedRows.length,
    residueModulo479SquareRange: {
      min: Math.min(...residueValues),
      max: Math.max(...residueValues),
    },
    kRange: {
      min: Math.min(...kValues),
      max: Math.max(...kValues),
    },
    familyStepModuloObstructionSquare: {
      invertible: partial,
      gcd: terminal ? obstructionSquare : partial ? 1 : null,
      rootCoverage: terminal
        ? 'all descendant parameter residues modulo q^2 are square-obstructed'
        : partial
        ? 'two descendant parameter residues modulo q^2 are square-obstructed per p479-available residue row'
        : 'nonuniform',
    },
    rootChildCount,
    qAvoidingClassCount,
    openBoundary: terminal
      ? 'No q-avoiding descendant remains inside this p479-available residue row family; every descendant parameter is square-blocked by the bucket prime square.'
      : partial
      ? 'Each row emits two square-obstruction child classes and leaves the q-avoiding descendant classes open. This packet records the exact boundary but does not descend into any singleton q child.'
      : 'The row shapes are nonuniform and require a deterministic successor packet before any descent.',
    rows: sortedRows.map((row) => compactRow(row, mode)),
  };
}

function buildPacket(options) {
  const bulkPacket = JSON.parse(fs.readFileSync(options.bulkPacket, 'utf8'));
  const assemblyPacket = JSON.parse(fs.readFileSync(options.assemblyPacket, 'utf8'));
  const buckets = new Map();

  for (const row of bulkPacket.obstructionRows ?? []) {
    if (row.obstructionPrime === null || row.obstructionPrime === undefined) {
      continue;
    }
    if (!buckets.has(row.obstructionPrime)) {
      buckets.set(row.obstructionPrime, []);
    }
    buckets.get(row.obstructionPrime).push(row);
  }

  const bucketBoundaries = [...buckets.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([prime, rows]) => summarizeBucket(prime, rows));
  const terminalBuckets = bucketBoundaries.filter((bucket) => bucket.mode === 'terminal_full_family_square_obstruction');
  const partialBuckets = bucketBoundaries.filter((bucket) => bucket.mode === 'partial_two_root_square_obstruction_children');
  const nonuniformBuckets = bucketBoundaries.filter((bucket) => bucket.mode === 'nonuniform_bucket_boundary');
  const terminalResidueClassCount = terminalBuckets.reduce((sum, bucket) => sum + bucket.residueClassCount, 0);
  const partialResidueClassCount = partialBuckets.reduce((sum, bucket) => sum + bucket.residueClassCount, 0);
  const partialRootChildCount = partialBuckets.reduce((sum, bucket) => sum + bucket.rootChildCount, 0);
  const qAvoidingClassCount = partialBuckets.reduce((sum, bucket) => sum + bucket.qAvoidingClassCount, 0);

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_available_obstruction_bucket_boundary/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'p479_available_obstruction_buckets_compressed_to_terminal_and_partial_boundaries',
    target: 'compress_p848_p4217_p443_q97_p479_available_obstruction_buckets_or_emit_bucket_boundaries',
    sourcePackets: [
      path.relative(path.dirname(options.bulkPacket), options.bulkPacket) === ''
        ? options.bulkPacket
        : 'SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_P443_Q97_P479_AVAILABLE_RESIDUE_BULK_COVER_PACKET.json',
      'SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_POST_P479_AVAILABLE_BULK_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
    ],
    compressionSummary: {
      inputBucketCount: bucketBoundaries.length,
      totalResidueClasses: bulkPacket.screen?.coveredResidueCount ?? null,
      terminalFullFamilyBucketCount: terminalBuckets.length,
      terminalFullFamilyResidueClassCount: terminalResidueClassCount,
      partialTwoRootBucketCount: partialBuckets.length,
      partialTwoRootResidueClassCount: partialResidueClassCount,
      partialRootChildCount,
      partialQAvoidingClassCount: qAvoidingClassCount,
      nonuniformBucketCount: nonuniformBuckets.length,
      maxTerminalObstructionPrime: terminalBuckets.at(-1)?.obstructionPrime ?? null,
      maxPartialObstructionPrime: partialBuckets.at(-1)?.obstructionPrime ?? null,
      largestPartialBuckets: partialBuckets
        .slice()
        .sort((left, right) => right.residueClassCount - left.residueClassCount)
        .slice(0, 5)
        .map((bucket) => ({
          obstructionPrime: bucket.obstructionPrime,
          residueClassCount: bucket.residueClassCount,
          rootChildCount: bucket.rootChildCount,
          qAvoidingClassCount: bucket.qAvoidingClassCount,
        })),
    },
    finiteTokenTransition: {
      consumedFiniteToken: assemblyPacket.finiteMeasureOrNoMeasureYet?.nextFiniteToken ?? {
        tokenId: 'p443_q97_p479_available_obstruction_prime_buckets',
        bucketCount: bucketBoundaries.length,
        totalResidueClasses: bulkPacket.screen?.coveredResidueCount ?? null,
      },
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_terminal_full_family_square_obstruction_buckets',
          bucketCount: terminalBuckets.length,
          residueClassCount: terminalResidueClassCount,
          status: 'terminally_closed_at_bucket_boundary',
        },
        {
          tokenId: 'p443_q97_p479_partial_two_root_obstruction_bucket_boundaries',
          bucketCount: partialBuckets.length,
          residueClassCount: partialResidueClassCount,
          rootChildCount: partialRootChildCount,
          qAvoidingClassCount,
          status: 'partial_boundaries_open_no_singleton_descent_selected',
        },
        {
          tokenId: 'p443_q97_p479_nonuniform_obstruction_bucket_boundaries',
          bucketCount: nonuniformBuckets.length,
          residueClassCount: nonuniformBuckets.reduce((sum, bucket) => sum + bucket.residueClassCount, 0),
          obstructionPrimes: nonuniformBuckets.map((bucket) => bucket.obstructionPrime),
          status: 'deterministic_successor_boundary_needed',
        },
      ],
    },
    bucketBoundaryTheorem: {
      theoremId: 'p848_p4217_p443_q97_p479_available_bucket_boundary_compression',
      status: 'proved_for_current_bulk_cover_rows_not_global_closure',
      statement: 'For the recorded p479-available bulk cover, the 30 obstruction-prime buckets split exactly into 19 full-family square-obstruction buckets, 10 invertible two-root partial-boundary buckets, and 1 nonuniform q109 bucket boundary.',
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_obstruction_bucket_boundary.mjs --pretty',
      proofSketch: [
        'Group the 1140 p479-available rows by their first obstruction prime q from the bulk-cover packet.',
        'For q <= 101 buckets in this packet, the descendant family step is 0 modulo q^2 and every z residue modulo q^2 is a root; those rows are terminal full-family square obstructions.',
        'For q >= 113 buckets in this packet, the descendant family step is invertible modulo q^2 and each row has exactly two root residues; those rows emit exact square-obstruction child classes plus q-avoiding complements.',
        'The q109 bucket is the sole nonuniform bucket under this dichotomy, so the 30-bucket token is replaced by terminal closures, 10 partial bucket-boundary families, and one named q109 deterministic successor boundary.',
      ],
    },
    bucketBoundaries,
    oneNextAction: {
      stepId: 'run_p848_convergence_assembly_after_p479_obstruction_bucket_boundaries',
      action: 'Assemble the post-bucket-boundary frontier and choose the next bulk, structural, or ranked handoff before any q-child singleton descent.',
      coveredFamily: 'The 19 terminal full-family square-obstruction buckets, 10 partial two-root bucket boundaries, and 1 nonuniform q109 boundary emitted from the p479-available bulk cover.',
      finiteDenominatorOrRankToken: 'The p443_q97_p479_available_obstruction_prime_buckets token is consumed into terminal bucket closures plus the finite p443_q97_p479_partial_two_root_obstruction_bucket_boundaries and p443_q97_p479_nonuniform_obstruction_bucket_boundaries tokens.',
      failureBoundary: 'If no global handoff is available, write a deterministic structural packet over the q109 nonuniform bucket and the 10 partial buckets instead of selecting q127 or another singleton child.',
      completionRule: 'The next assembly must name whether the q109 nonuniform bucket and 10 partial buckets are attacked by a shared structural theorem, a batch q-avoiding cover, a ranked transition, or exact blockers.',
    },
    claims: {
      consumesP479AvailableObstructionBucketToken: true,
      provesTerminalFullFamilyClosureForTerminalBuckets: true,
      emitsExactPartialBucketBoundaries: true,
      emitsExactNonuniformBucketBoundary: true,
      namesPartialBucketRankToken: true,
      opensFreshFallbackSelector: false,
      descendsIntoQ127Singleton: false,
      provesPartialBucketClosure: false,
      provesNonuniformBucketClosure: false,
      provesP479AvailableFamilyCoverage: false,
      provesP479UnavailableComplementClosed: false,
      provesQ97ChildCoverage: false,
      provesP443UnavailableComplementClosed: false,
      provesP4217ComplementCoverage: false,
      provesAllN: false,
    },
    recommendedNextAction: 'run_p848_convergence_assembly_after_p479_obstruction_bucket_boundaries',
    nextTheoremMove: 'Run convergence assembly after the bucket-boundary compression, then choose a bulk structural handoff over the q109 nonuniform bucket and 10 partial two-root buckets; do not descend into q127 as a singleton.',
    proofBoundary: 'This packet compresses the p479-available obstruction-prime buckets into terminal full-family closures, exact partial bucket boundaries, and one exact q109 nonuniform bucket boundary. It does not close the q109 nonuniform bucket, the 10 partial buckets, their q-avoiding complements, the p479-unavailable complement, the q97 child, the p443-unavailable complement, the wider p4217 complement, or Problem 848.',
  };
}

function renderMarkdown(packet) {
  const lines = [
    '# P848 p4217/p443/q97/p479 Obstruction Bucket Boundary',
    '',
    `Generated: ${packet.generatedAt}`,
    `Status: ${packet.status}`,
    '',
    '## Summary',
    `- Input buckets: ${packet.compressionSummary.inputBucketCount}`,
    `- Total p479-available residue rows: ${packet.compressionSummary.totalResidueClasses}`,
    `- Terminal full-family buckets: ${packet.compressionSummary.terminalFullFamilyBucketCount} (${packet.compressionSummary.terminalFullFamilyResidueClassCount} rows)`,
    `- Partial two-root buckets: ${packet.compressionSummary.partialTwoRootBucketCount} (${packet.compressionSummary.partialTwoRootResidueClassCount} rows)`,
    `- Partial root children: ${packet.compressionSummary.partialRootChildCount}`,
    `- Partial q-avoiding classes: ${packet.compressionSummary.partialQAvoidingClassCount}`,
    `- Nonuniform buckets: ${packet.compressionSummary.nonuniformBucketCount}`,
    '',
    '## Token Transition',
    `- Consumed: ${packet.finiteTokenTransition.consumedFiniteToken.tokenId}`,
    `- Produced: ${packet.finiteTokenTransition.producedFiniteTokens.map((token) => `${token.tokenId} (${token.status})`).join('; ')}`,
    '',
    '## Bucket Table',
    '| q | rows | mode | root children | q-avoiding classes | status |',
    '|---:|---:|---|---:|---:|---|',
    ...packet.bucketBoundaries.map((bucket) => `| ${bucket.obstructionPrime} | ${bucket.residueClassCount} | ${bucket.mode} | ${bucket.rootChildCount} | ${bucket.qAvoidingClassCount} | ${bucket.status} |`),
    '',
    '## Boundary',
    packet.proofBoundary,
    '',
    '## Next Action',
    `- ${packet.oneNextAction.stepId}: ${packet.oneNextAction.action}`,
  ];
  return `${lines.join('\n')}\n`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packet = buildPacket(options);
  const json = JSON.stringify(packet, null, options.pretty ? 2 : 0);

  if (options.jsonOutput) {
    ensureDir(options.jsonOutput);
    fs.writeFileSync(options.jsonOutput, `${json}\n`);
  } else {
    console.log(json);
  }

  if (options.markdownOutput) {
    ensureDir(options.markdownOutput);
    fs.writeFileSync(options.markdownOutput, renderMarkdown(packet));
  }
}

main();
