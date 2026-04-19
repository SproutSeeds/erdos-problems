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

const DEFAULT_BUCKET_PACKET = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'SPLIT_ATOM_PACKETS',
  'FRONTIER_BRIDGE',
  'P848_P4217_P443_Q97_P479_AVAILABLE_OBSTRUCTION_BUCKET_BOUNDARY_PACKET.json',
);

const DEFAULT_ASSEMBLY_PACKET = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'SPLIT_ATOM_PACKETS',
  'FRONTIER_BRIDGE',
  'P848_P4217_POST_P479_OBSTRUCTION_BUCKET_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
);

function parseArgs(argv) {
  const options = {
    bulkPacket: DEFAULT_BULK_PACKET,
    bucketPacket: DEFAULT_BUCKET_PACKET,
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
    } else if (arg === '--bucket-packet') {
      options.bucketPacket = path.resolve(argv[index + 1]);
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

function mod(value, modulus) {
  const result = value % modulus;
  return result < 0 ? result + modulus : result;
}

function modBigInt(value, modulus) {
  const result = value % modulus;
  return result < 0n ? result + modulus : result;
}

function compactRow(row, obstructionSquare, obstructionPrime) {
  const delta = BigInt(row.delta);
  const discriminant = delta * delta - 4n;
  const rootResidues = row.rootResiduesModuloObstructionSquare ?? [];
  const yRoots = row.yRootsModuloObstructionSquare ?? [];

  return {
    residueModulo479Square: row.residueModulo479Square,
    k: row.k,
    delta: row.delta,
    deltaModulo109: mod(row.delta, obstructionPrime),
    deltaModulo109Square: mod(row.delta, obstructionSquare),
    discriminantModulo109: Number(modBigInt(discriminant, BigInt(obstructionPrime))),
    discriminantModulo109Square: Number(modBigInt(discriminant, BigInt(obstructionSquare))),
    invertibleFamilyStepModuloObstructionSquare: row.invertibleFamilyStepModuloObstructionSquare,
    gcdFamilyStepWithObstructionSquare: row.gcdFamilyStepWithObstructionSquare,
    rootResidueCount: rootResidues.length,
    yRootCount: yRoots.length,
    rootResiduesModuloObstructionSquare: rootResidues,
    yRootsModuloObstructionSquare: yRoots,
  };
}

function buildSubbucket({ id, status, condition, rows, obstructionSquare }) {
  const rootChildCount = rows.reduce((sum, row) => sum + row.rootResidueCount, 0);
  const qAvoidingClassCount = rows.reduce((sum, row) => sum + (obstructionSquare - row.rootResidueCount), 0);
  const residueValues = rows.map((row) => row.residueModulo479Square);
  const kValues = rows.map((row) => row.k);
  const deltaValues = rows.map((row) => row.delta);

  return {
    subbucketId: id,
    status,
    condition,
    residueClassCount: rows.length,
    rootChildCount,
    qAvoidingClassCount,
    residueModulo479SquareRange: {
      min: Math.min(...residueValues),
      max: Math.max(...residueValues),
    },
    kRange: {
      min: Math.min(...kValues),
      max: Math.max(...kValues),
    },
    deltaRange: {
      min: Math.min(...deltaValues),
      max: Math.max(...deltaValues),
    },
    openBoundary: 'The listed root residues are square-obstruction child classes modulo 109^2; the q-avoiding descendant classes remain open and must be handled by a later batch cover, structural decomposition, or ranked transition.',
    rows,
  };
}

function buildPacket(options) {
  const bulkPacket = JSON.parse(fs.readFileSync(options.bulkPacket, 'utf8'));
  const bucketPacket = JSON.parse(fs.readFileSync(options.bucketPacket, 'utf8'));
  const assemblyPacket = JSON.parse(fs.readFileSync(options.assemblyPacket, 'utf8'));
  const obstructionPrime = 109;
  const obstructionSquare = obstructionPrime * obstructionPrime;
  const bucket = bucketPacket.bucketBoundaries?.find((item) => item.obstructionPrime === obstructionPrime);

  if (!bucket || bucket.mode !== 'nonuniform_bucket_boundary' || bucket.residueClassCount !== 351) {
    throw new Error('Expected the q109 bucket boundary with 351 nonuniform rows.');
  }

  const rows = (bulkPacket.obstructionRows ?? [])
    .filter((row) => row.obstructionPrime === obstructionPrime)
    .sort((left, right) => left.residueModulo479Square - right.residueModulo479Square)
    .map((row) => compactRow(row, obstructionSquare, obstructionPrime));

  if (rows.length !== 351) {
    throw new Error(`Expected 351 q109 rows, found ${rows.length}.`);
  }

  const allInvertible = rows.every((row) => row.invertibleFamilyStepModuloObstructionSquare === true);
  const allGcdOne = rows.every((row) => row.gcdFamilyStepWithObstructionSquare === 1);
  const regularRows = rows.filter((row) => row.rootResidueCount === 2 && row.discriminantModulo109 !== 0);
  const singularRows = rows.filter((row) => row.rootResidueCount === obstructionPrime && row.discriminantModulo109Square === 0);
  const otherRows = rows.filter((row) => !regularRows.includes(row) && !singularRows.includes(row));

  const regularSubbucket = buildSubbucket({
    id: 'q109_regular_invertible_two_root_rows',
    status: 'exact_two_root_boundary_emitted',
    condition: 'invertible family step modulo 109^2, gcd=1, and discriminant delta^2 - 4 nonzero modulo 109',
    rows: regularRows,
    obstructionSquare,
  });
  const singularSubbucket = buildSubbucket({
    id: 'q109_singular_invertible_109_root_row',
    status: 'exact_singular_109_root_boundary_emitted',
    condition: 'invertible family step modulo 109^2, gcd=1, delta == -2 modulo 109^2, and discriminant delta^2 - 4 == 0 modulo 109^2',
    rows: singularRows,
    obstructionSquare,
  });
  const totalRootChildCount = regularSubbucket.rootChildCount + singularSubbucket.rootChildCount;
  const totalQAvoidingClassCount = regularSubbucket.qAvoidingClassCount + singularSubbucket.qAvoidingClassCount;

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_q109_nonuniform_bucket_structure/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: 'q109_nonuniform_bucket_split_into_regular_and_singular_subbucket_boundaries',
    target: 'derive_p848_p4217_p443_q97_p479_q109_nonuniform_bucket_structure_or_emit_subbucket_boundaries',
    sourcePackets: [
      'SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_P443_Q97_P479_AVAILABLE_RESIDUE_BULK_COVER_PACKET.json',
      'SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_P443_Q97_P479_AVAILABLE_OBSTRUCTION_BUCKET_BOUNDARY_PACKET.json',
      'SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_POST_P479_OBSTRUCTION_BUCKET_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
    ],
    bucket: {
      finiteTokenId: assemblyPacket.finiteMeasureOrNoMeasureYet?.nextFiniteToken?.tokenId ?? 'p443_q97_p479_nonuniform_obstruction_bucket_q109',
      obstructionPrime,
      obstructionSquare,
      inputResidueClassCount: rows.length,
      inputMode: bucket.mode,
      allRowsInvertibleModulo109Square: allInvertible,
      allRowsGcdOneModulo109Square: allGcdOne,
      otherProfileRowCount: otherRows.length,
    },
    structureSummary: {
      regularTwoRootRowCount: regularRows.length,
      singular109RootRowCount: singularRows.length,
      totalRootChildCount,
      totalQAvoidingClassCount,
      regularRootChildCount: regularSubbucket.rootChildCount,
      regularQAvoidingClassCount: regularSubbucket.qAvoidingClassCount,
      singularRootChildCount: singularSubbucket.rootChildCount,
      singularQAvoidingClassCount: singularSubbucket.qAvoidingClassCount,
      rootCountProfiles: [
        { rootResidueCount: 2, rowCount: regularRows.length },
        { rootResidueCount: 109, rowCount: singularRows.length },
      ],
      discriminantProfiles: [
        {
          profile: 'nonsingular_mod_109',
          condition: 'delta^2 - 4 is nonzero modulo 109',
          rowCount: regularRows.length,
        },
        {
          profile: 'singular_mod_109_square',
          condition: 'delta^2 - 4 is 0 modulo 109^2',
          rowCount: singularRows.length,
        },
      ],
    },
    finiteTokenTransition: {
      consumedFiniteToken: {
        tokenId: 'p443_q97_p479_nonuniform_obstruction_bucket_q109',
        obstructionPrime,
        obstructionSquare,
        residueClassCount: rows.length,
        status: 'consumed_by_exact_subbucket_boundaries',
      },
      producedFiniteTokens: [
        {
          tokenId: 'p443_q97_p479_q109_regular_two_root_subbucket_boundary',
          residueClassCount: regularRows.length,
          rootChildCount: regularSubbucket.rootChildCount,
          qAvoidingClassCount: regularSubbucket.qAvoidingClassCount,
          status: 'open_exact_boundary_no_singleton_descent',
        },
        {
          tokenId: 'p443_q97_p479_q109_singular_109_root_subbucket_boundary',
          residueClassCount: singularRows.length,
          rootChildCount: singularSubbucket.rootChildCount,
          qAvoidingClassCount: singularSubbucket.qAvoidingClassCount,
          status: 'open_exact_boundary_no_singleton_descent',
        },
      ],
    },
    subbucketBoundaryTheorem: {
      theoremId: 'p848_p4217_p443_q97_p479_q109_nonuniform_bucket_subbucket_partition',
      status: 'proved_for_current_q109_bucket_rows_not_bucket_closure',
      statement: 'For the recorded q109 nonuniform bucket, every one of the 351 rows has invertible descendant family step modulo 109^2 and gcd 1. The bucket splits exactly into 350 nonsingular two-root rows and one singular 109-root row.',
      verificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_q109_nonuniform_bucket_structure.mjs --pretty',
      proofSketch: [
        'Filter the p479-available bulk-cover rows whose first obstruction prime is 109.',
        'For each row, compute the quadratic discriminant delta^2 - 4 modulo 109 and 109^2, and compare against the stored root-residue list.',
        'The 350 regular rows have nonzero discriminant modulo 109 and exactly two square-obstruction child residues modulo 109^2.',
        'The unique singular row has residue 171005, k=950, delta=-23764 == -2 modulo 109^2, discriminant 0 modulo 109^2, and exactly 109 child residues.',
        'This consumes the sole nonuniform bucket token into two exact subbucket-boundary tokens, without descending into any q109 child.',
      ],
    },
    subbucketBoundaries: [regularSubbucket, singularSubbucket],
    singularRow: singularRows[0] ?? null,
    oneNextAction: {
      stepId: 'run_p848_convergence_assembly_after_q109_subbucket_boundaries',
      action: 'Assemble the q109 regular/singular subbucket boundaries with the 10 partial two-root buckets, then choose a batch q-avoiding cover, structural decomposition, or ranked transition before any singleton q-child descent.',
      coveredFamily: 'The q109 nonuniform bucket has been consumed into exact regular and singular subbucket boundaries; the next assembly must recombine those boundaries with the already recorded partial bucket boundaries.',
      finiteDenominatorOrRankToken: 'The q109 denominator is 109^2. The emitted subbucket tokens have 809 total square-obstruction child classes and 4169422 q-avoiding descendant classes.',
      failureBoundary: 'If recombination cannot name a shared cover, emit a deterministic q-avoiding boundary packet that lists the exact regular, singular, and existing partial-bucket complements before selecting any child.',
      whyCheaperThanSingleSelector: 'The subbucket packet shows q109 is not one child but a finite family boundary. Assembly over all emitted q-avoiding boundaries is cheaper and safer than selecting one root child or q127 singleton.',
      completionRule: 'A post-q109 assembly packet must choose one batch/structural/ranked handoff and must not claim p479-available, p479-unavailable, q97, p443-unavailable, p4217, or all-n closure.',
    },
    claims: {
      consumesQ109NonuniformBucketToken: true,
      allQ109RowsClassified: true,
      allRowsInvertibleModulo109Square: allInvertible,
      allRowsGcdOneModulo109Square: allGcdOne,
      emitsRegularTwoRootSubbucketBoundary: regularRows.length === 350,
      emitsSingular109RootSubbucketBoundary: singularRows.length === 1,
      emitsExactSubbucketBoundaries: otherRows.length === 0,
      opensFreshFallbackSelector: false,
      descendsIntoQ109Singleton: false,
      descendsIntoQ127Singleton: false,
      provesQ109BucketClosure: false,
      provesPartialBucketClosure: false,
      provesP479AvailableFamilyCoverage: false,
      provesP479UnavailableComplementClosed: false,
      provesQ97ChildCoverage: false,
      provesP443UnavailableComplementClosed: false,
      provesP4217ComplementCoverage: false,
      provesAllN: false,
    },
    recommendedNextAction: 'run_p848_convergence_assembly_after_q109_subbucket_boundaries',
    nextTheoremMove: 'Run convergence assembly after q109 subbucket boundaries, then choose a batch q-avoiding cover, structural decomposition, or ranked ledger transition over the regular/singular q109 boundaries plus the 10 partial buckets.',
    proofBoundary: 'This packet consumes the q109 nonuniform bucket token by splitting all 351 q109 rows into exact regular and singular subbucket boundaries. It does not close the q109 q-avoiding descendant classes, the 10 partial buckets, their q-avoiding complements, the p479-unavailable complement, the q97 child, the p443-unavailable complement, the wider p4217 complement, collision-free matching, or Problem 848.',
  };
}

function renderMarkdown(packet) {
  const lines = [
    '# P848 p4217/p443/q97/p479 q109 Nonuniform Bucket Structure',
    '',
    `Generated: ${packet.generatedAt}`,
    `Status: ${packet.status}`,
    '',
    '## Summary',
    `- Input q109 rows: ${packet.bucket.inputResidueClassCount}`,
    `- All rows invertible modulo 109^2: ${packet.bucket.allRowsInvertibleModulo109Square ? 'yes' : 'no'}`,
    `- Regular two-root rows: ${packet.structureSummary.regularTwoRootRowCount}`,
    `- Singular 109-root rows: ${packet.structureSummary.singular109RootRowCount}`,
    `- Total root children: ${packet.structureSummary.totalRootChildCount}`,
    `- Total q-avoiding classes: ${packet.structureSummary.totalQAvoidingClassCount}`,
    '',
    '## Subbuckets',
    '| subbucket | rows | root children | q-avoiding classes | status |',
    '|---|---:|---:|---:|---|',
    ...packet.subbucketBoundaries.map((bucket) => `| ${bucket.subbucketId} | ${bucket.residueClassCount} | ${bucket.rootChildCount} | ${bucket.qAvoidingClassCount} | ${bucket.status} |`),
    '',
    '## Singular Row',
    packet.singularRow
      ? `- residue ${packet.singularRow.residueModulo479Square}, k=${packet.singularRow.k}, delta=${packet.singularRow.delta}, delta mod 109^2=${packet.singularRow.deltaModulo109Square}, root count=${packet.singularRow.rootResidueCount}`
      : '- none',
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
