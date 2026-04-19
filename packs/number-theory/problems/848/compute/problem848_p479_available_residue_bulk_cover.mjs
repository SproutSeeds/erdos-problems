#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');

const DEFAULT_SPLIT_PACKET = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'SPLIT_ATOM_PACKETS',
  'FRONTIER_BRIDGE',
  'P848_P4217_COMPLEMENT_P61_Q101_P443_Q97_P479_AVAILABILITY_SPLIT_PACKET.json',
);

function parseArgs(argv) {
  const options = {
    splitPacket: DEFAULT_SPLIT_PACKET,
    maxPrime: 2000,
    pretty: false,
    jsonOutput: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--split-packet') {
      options.splitPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--max-prime') {
      options.maxPrime = Number(argv[index + 1]);
      index += 1;
    } else if (arg === '--json-output') {
      options.jsonOutput = path.resolve(argv[index + 1]);
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

function mod(value, modulus) {
  const result = value % modulus;
  return result < 0n ? result + modulus : result;
}

function gcd(a, b) {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) {
    const next = left % right;
    left = right;
    right = next;
  }
  return left;
}

function modInverse(value, modulus) {
  let oldR = mod(value, modulus);
  let r = modulus;
  let oldS = 1n;
  let s = 0n;

  while (r !== 0n) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }

  if (oldR !== 1n) {
    return null;
  }
  return mod(oldS, modulus);
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

function rootsForDelta(delta, prime) {
  const square = prime * prime;
  const deltaMod = ((delta % square) + square) % square;
  const roots = [];
  for (let y = 0; y < square; y += 1) {
    if ((y * ((y + deltaMod) % square) + 1) % square === 0) {
      roots.push(y);
    }
  }
  return roots;
}

function bruteZRoots({ leftBase, leftStep, delta, square }) {
  const roots = [];
  for (let z = 0n; z < square; z += 1n) {
    const left = mod(leftBase + leftStep * z, square);
    if (mod(left * (left + delta) + 1n, square) === 0n) {
      roots.push(Number(z));
    }
  }
  return roots;
}

function availableResidues({ period, maxK, kStep, kBase }) {
  const rows = [];
  for (let residue = 0n; residue < period; residue += 1n) {
    const k = mod(kStep * residue + kBase, period);
    if (k <= maxK) {
      rows.push({ residue, k });
    }
  }
  return rows;
}

function classifyResidue({ row, leftResidue, leftModulus, period, primes, maxPrime, rootCache }) {
  const delta = -14n - 25n * row.k;
  const leftBase = leftResidue + leftModulus * row.residue;
  const leftStep = leftModulus * period;

  for (const prime of primes) {
    if (prime > maxPrime) {
      break;
    }

    const square = BigInt(prime * prime);
    const stepModuloSquare = mod(leftStep, square);
    const inverse = modInverse(stepModuloSquare, square);

    if (inverse === null) {
      const rootsZ = bruteZRoots({
        leftBase,
        leftStep,
        delta,
        square,
      });
      if (rootsZ.length > 0) {
        return {
          residueModulo479Square: Number(row.residue),
          k: Number(row.k),
          delta: Number(delta),
          obstructionPrime: prime,
          obstructionSquare: prime * prime,
          invertibleFamilyStepModuloObstructionSquare: false,
          gcdFamilyStepWithObstructionSquare: Number(gcd(stepModuloSquare, square)),
          rootResiduesModuloObstructionSquare: rootsZ,
          yRootsModuloObstructionSquare: null,
        };
      }
      continue;
    }

    const key = `${delta.toString()}|${prime}`;
    let yRoots = rootCache.get(key);
    if (!yRoots) {
      yRoots = rootsForDelta(Number(delta), prime);
      rootCache.set(key, yRoots);
    }
    if (yRoots.length === 0) {
      continue;
    }

    const baseModuloSquare = mod(leftBase, square);
    const rootsZ = yRoots
      .map((root) => Number(mod((BigInt(root) - baseModuloSquare) * inverse, square)))
      .sort((left, right) => left - right);

    return {
      residueModulo479Square: Number(row.residue),
      k: Number(row.k),
      delta: Number(delta),
      obstructionPrime: prime,
      obstructionSquare: prime * prime,
      invertibleFamilyStepModuloObstructionSquare: true,
      gcdFamilyStepWithObstructionSquare: 1,
      rootResiduesModuloObstructionSquare: rootsZ,
      yRootsModuloObstructionSquare: yRoots,
    };
  }

  return {
    residueModulo479Square: Number(row.residue),
    k: Number(row.k),
    delta: Number(delta),
    obstructionPrime: null,
    obstructionSquare: null,
    invertibleFamilyStepModuloObstructionSquare: null,
    gcdFamilyStepWithObstructionSquare: null,
    rootResiduesModuloObstructionSquare: [],
    yRootsModuloObstructionSquare: null,
  };
}

function summarizeHistogram(rows) {
  const counts = new Map();
  for (const row of rows) {
    if (row.obstructionPrime === null) {
      continue;
    }
    counts.set(row.obstructionPrime, (counts.get(row.obstructionPrime) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([prime, count]) => ({
      obstructionPrime: prime,
      obstructionSquare: prime * prime,
      residueClassCount: count,
    }));
}

function buildPacket(options) {
  const splitPacket = JSON.parse(fs.readFileSync(options.splitPacket, 'utf8'));
  const period = BigInt(splitPacket.availabilitySplit.endpointPrimeSquare);
  const maxK = BigInt(splitPacket.availabilitySplit.maxK);
  const leftResidue = BigInt(splitPacket.sourceChild.leftCongruence.residue);
  const leftModulus = BigInt(splitPacket.sourceChild.leftCongruence.modulus);
  const kStep = 131596n;
  const kBase = 250n;
  const primes = primeSieve(options.maxPrime);
  const rootCache = new Map();
  const residues = availableResidues({
    period,
    maxK,
    kStep,
    kBase,
  });

  const obstructionRows = residues.map((row) => classifyResidue({
    row,
    leftResidue,
    leftModulus,
    period,
    primes,
    maxPrime: options.maxPrime,
    rootCache,
  }));
  const survivorRows = obstructionRows.filter((row) => row.obstructionPrime === null);
  const histogram = summarizeHistogram(obstructionRows);
  const maxObstructionPrime = Math.max(...obstructionRows.map((row) => row.obstructionPrime ?? 0));
  const maxObstructionSquare = maxObstructionPrime * maxObstructionPrime;

  return {
    schema: 'erdos.number_theory.p848_p4217_p443_q97_p479_available_residue_bulk_square_obstruction_cover/1',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: survivorRows.length === 0
      ? 'all_p479_available_residue_classes_have_square_obstruction_child'
      : 'p479_available_residue_survivor_boundary_emitted',
    target: 'bulk_cover_p848_p4217_p443_q97_p479_available_residue_square_obstructions_or_emit_survivor_boundary',
    sourcePackets: {
      p479AvailabilitySplit: path.relative(path.join(repoRoot, 'packs', 'number-theory', 'problems', '848'), options.splitPacket),
      postSplitConvergenceAssembly: 'SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_POST_P479_AVAILABILITY_SPLIT_CONVERGENCE_ASSEMBLY_PACKET.json',
    },
    screen: {
      coveredFamily: 'all p479-available residue classes modulo 479^2 inside the selected p443/q97 child',
      endpointPrime: splitPacket.availabilitySplit.endpointPrime,
      endpointPrimeSquare: splitPacket.availabilitySplit.endpointPrimeSquare,
      maxK: splitPacket.availabilitySplit.maxK,
      kFormulaInSourceParameter: splitPacket.availabilitySplit.kFormulaInSourceParameter,
      availableResidueCount: residues.length,
      checkedResidueCount: obstructionRows.length,
      coveredResidueCount: obstructionRows.length - survivorRows.length,
      survivorResidueCount: survivorRows.length,
      maxCheckedPrime: options.maxPrime,
      maxObstructionPrime,
      maxObstructionSquare,
      obstructionPrimeCount: histogram.length,
      rootCacheEntryCount: rootCache.size,
    },
    obstructionHistogram: histogram,
    obstructionRows,
    survivorRows,
    samples: {
      firstRows: obstructionRows.slice(0, 12),
      highestPrimeRows: obstructionRows
        .filter((row) => row.obstructionPrime === maxObstructionPrime)
        .slice(0, 12),
      survivorRows: survivorRows.slice(0, 12),
    },
    representativeConsistency: {
      firstResidueMatchesP479Split: obstructionRows[0]?.residueModulo479Square === splitPacket.firstAvailableSquareObstruction.availableResidueModuloEndpointPrimeSquare,
      firstObstructionPrimeMatchesP479Split: obstructionRows[0]?.obstructionPrime === splitPacket.firstAvailableSquareObstruction.obstructionPrime,
      firstRootResiduesMatchP479Split: JSON.stringify(obstructionRows[0]?.rootResiduesModuloObstructionSquare)
        === JSON.stringify(splitPacket.firstAvailableSquareObstruction.rootResiduesModuloObstructionSquare),
    },
    nextTheoremMove: survivorRows.length === 0
      ? 'Compress the 30 obstruction-prime buckets into theorem-facing families, or emit exact bucket-boundary packets; do not descend into one q127 child.'
      : 'Emit a deterministic survivor-boundary packet for the uncovered p479-available residues before any singleton repair descent.',
    recommendedNextAction: survivorRows.length === 0
      ? 'compress_p848_p4217_p443_q97_p479_available_obstruction_buckets_or_emit_bucket_boundaries'
      : 'emit_p848_p4217_p443_q97_p479_available_survivor_boundary',
    suggestedVerificationCommand: 'node packs/number-theory/problems/848/compute/problem848_p479_available_residue_bulk_cover.mjs --pretty',
    proofBoundary: 'This packet classifies every p479-available residue class by a first square-obstruction child. It does not close those square-obstruction children, does not close q127-avoiding subfamilies inside a residue class, does not close the p479-unavailable complement, does not close the q97 child, does not close the p443-unavailable complement, does not close the wider p4217 complement, and does not decide Problem 848.',
    claims: {
      classifiesAllP479AvailableResidueClasses: survivorRows.length === 0,
      emitsExactSurvivorBoundary: survivorRows.length > 0,
      provesSquareObstructionChildForEachCoveredResidueClass: true,
      consumesP479AvailableResidueSetToken: survivorRows.length === 0,
      opensFreshFallbackSelector: false,
      provesP479AvailableFamilyCoverage: false,
      provesQ127ChildCoverage: false,
      provesP479UnavailableComplementClosed: false,
      provesQ97ChildCoverage: false,
      provesP443UnavailableComplementClosed: false,
      provesP4217ComplementCoverage: false,
      provesAllN: false
    }
  };
}

const options = parseArgs(process.argv.slice(2));
const packet = buildPacket(options);
const json = JSON.stringify(packet, null, options.pretty ? 2 : 0);

if (options.jsonOutput) {
  fs.mkdirSync(path.dirname(options.jsonOutput), { recursive: true });
  fs.writeFileSync(options.jsonOutput, `${json}\n`);
} else {
  console.log(json);
}
