#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = { min: 1, max: 100, jsonOutput: null, endpointMonotonicity: false };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--min') {
      args.min = Number(argv[++i]);
    } else if (token === '--max') {
      args.max = Number(argv[++i]);
    } else if (token === '--json-output') {
      args.jsonOutput = argv[++i];
    } else if (token === '--endpoint-monotonicity') {
      args.endpointMonotonicity = true;
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }
  if (!Number.isInteger(args.min) || args.min < 1) {
    throw new Error('--min must be a positive integer');
  }
  if (!Number.isInteger(args.max) || args.max < args.min) {
    throw new Error('--max must be an integer >= --min');
  }
  return args;
}

function isSquarefree(n) {
  let x = n;
  for (let p = 2; p * p <= x; p += 1) {
    if (x % p !== 0) continue;
    x /= p;
    if (x % p === 0) return false;
    while (x % p === 0) x /= p;
  }
  return true;
}

function positiveModulo(value, modulus) {
  const residue = value % modulus;
  return residue < 0 ? residue + modulus : residue;
}

function modInverse(value, modulus) {
  let oldR = positiveModulo(value, modulus);
  let r = modulus;
  let oldS = 1;
  let s = 0;
  while (r !== 0) {
    const quotient = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }
  if (oldR !== 1) return null;
  return positiveModulo(oldS, modulus);
}

function primeSieve(max) {
  const isComposite = new Uint8Array(max + 1);
  const primes = [];
  for (let n = 2; n <= max; n += 1) {
    if (isComposite[n]) continue;
    primes.push(n);
    if (n * n > max) continue;
    for (let multiple = n * n; multiple <= max; multiple += n) {
      isComposite[multiple] = 1;
    }
  }
  return primes;
}

function residueClass(N, residue) {
  const result = [];
  for (let n = 1; n <= N; n += 1) {
    if (n % 25 === residue) result.push(n);
  }
  return result;
}

function sameSortedSet(left, right) {
  if (left.length !== right.length) return false;
  const a = [...left].sort((x, y) => x - y);
  const b = [...right].sort((x, y) => x - y);
  return a.every((value, index) => value === b[index]);
}

function setBit(bits, index) {
  bits[index >>> 5] |= 1 << (index & 31);
}

function hasBit(bits, index) {
  return (bits[index >>> 5] & (1 << (index & 31))) !== 0;
}

function upperBound(values, maxValue) {
  let lo = 0;
  let hi = values.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (values[mid] <= maxValue) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  return lo;
}

function buildExactEnvironment(maxN) {
  const vertices = [];
  for (let a = 1; a <= maxN; a += 1) {
    if (!isSquarefree(a * a + 1)) vertices.push(a);
  }
  const indexByValue = new Map(vertices.map((value, index) => [value, index]));
  const wordCount = Math.ceil(vertices.length / 32);
  const adjacency = Array.from({ length: vertices.length }, () => new Uint32Array(wordCount));
  const primes = primeSieve(maxN);

  for (let i = 0; i < vertices.length; i += 1) {
    const a = vertices[i];
    for (const p of primes) {
      if (a % p === 0) continue;
      const squareModulus = p * p;
      const inverse = modInverse(a % squareModulus, squareModulus);
      if (inverse === null) continue;
      const residue = positiveModulo(-inverse, squareModulus);
      for (
        let b = residue === 0 ? squareModulus : residue;
        b <= maxN;
        b += squareModulus
      ) {
        const j = indexByValue.get(b);
        if (j === undefined || j === i) continue;
        setBit(adjacency[i], j);
        setBit(adjacency[j], i);
      }
    }
  }

  const degrees = adjacency.map((bits) => {
    let degree = 0;
    for (let i = 0; i < vertices.length; i += 1) {
      if (hasBit(bits, i)) degree += 1;
    }
    return degree;
  });

  return { vertices, indexByValue, adjacency, degrees };
}

function maximumClique(environment, activeCount, seedCliqueValues) {
  const { vertices, indexByValue, adjacency, degrees } = environment;
  const seedClique = seedCliqueValues
    .map((value) => indexByValue.get(value))
    .filter((index) => index !== undefined && index < activeCount);
  let best = seedClique;

  function adjacent(left, right) {
    return hasBit(adjacency[left], right);
  }

  function colorSort(candidates) {
    let uncolored = [...candidates].sort((left, right) => degrees[right] - degrees[left]);
    const ordered = [];
    const colors = [];
    let color = 0;

    while (uncolored.length > 0) {
      color += 1;
      let colorable = [...uncolored];
      while (colorable.length > 0) {
        const vertex = colorable[0];
        ordered.push(vertex);
        colors.push(color);
        uncolored = uncolored.filter((candidate) => candidate !== vertex);
        colorable = colorable.filter(
          (candidate) => candidate !== vertex && !adjacent(vertex, candidate),
        );
      }
    }

    return { ordered, colors };
  }

  function expand(clique, candidates) {
    if (candidates.length === 0) {
      if (clique.length > best.length) best = clique;
      return;
    }

    const { ordered, colors } = colorSort(candidates);
    for (let i = ordered.length - 1; i >= 0; i -= 1) {
      if (clique.length + colors[i] <= best.length) return;
      const vertex = ordered[i];
      const nextCandidates = [];
      for (let j = 0; j < i; j += 1) {
        const candidate = ordered[j];
        if (adjacent(vertex, candidate)) nextCandidates.push(candidate);
      }
      expand([...clique, vertex], nextCandidates);
    }
  }

  expand([], Array.from({ length: activeCount }, (_, index) => index));
  return best.map((index) => vertices[index]).sort((a, b) => a - b);
}

function scanInterval(minN, maxN) {
  const rows = [];
  const environment = buildExactEnvironment(maxN);
  for (let N = minN; N <= maxN; N += 1) {
    const residue7 = residueClass(N, 7);
    const residue18 = residueClass(N, 18);
    const activeCount = upperBound(environment.vertices, N);
    const clique = maximumClique(environment, activeCount, residue7);
    const maxSize = clique.length;
    const residue7Size = residue7.length;
    const residue18Size = residue18.length;
    rows.push({
      N,
      maxCliqueSize: maxSize,
      residue7Size,
      residue18Size,
      candidateAchievesMaximum: residue7Size === maxSize,
      exampleMaximumClique: clique,
      exampleMatchesResidue7: sameSortedSet(clique, residue7),
      exampleMatchesResidue18: sameSortedSet(clique, residue18),
    });
  }
  return rows;
}

function candidateSizeForN(N) {
  return Math.max(residueClass(N, 7).length, residueClass(N, 18).length);
}

function candidatePlateauIntervals(minN, maxN) {
  const intervals = [];
  let start = minN;
  let currentSize = candidateSizeForN(minN);
  for (let N = minN + 1; N <= maxN; N += 1) {
    const size = candidateSizeForN(N);
    if (size !== currentSize) {
      intervals.push({ min: start, max: N - 1, candidateSize: currentSize });
      start = N;
      currentSize = size;
    }
  }
  intervals.push({ min: start, max: maxN, candidateSize: currentSize });
  return intervals;
}

function scanEndpointMonotonicityInterval(minN, maxN) {
  const rows = [];
  const endpointChecks = [];
  const environment = buildExactEnvironment(maxN);
  for (const interval of candidatePlateauIntervals(minN, maxN)) {
    const residue7AtEndpoint = residueClass(interval.max, 7);
    const residue18AtEndpoint = residueClass(interval.max, 18);
    const activeCount = upperBound(environment.vertices, interval.max);
    const seedClique = residue7AtEndpoint.length >= residue18AtEndpoint.length
      ? residue7AtEndpoint
      : residue18AtEndpoint;
    const endpointClique = maximumClique(environment, activeCount, seedClique);
    const endpointMaxSize = endpointClique.length;
    const endpointCertified = endpointMaxSize === interval.candidateSize;
    endpointChecks.push({
      interval: `${interval.min}..${interval.max}`,
      min: interval.min,
      max: interval.max,
      candidateSize: interval.candidateSize,
      endpointMaxCliqueSize: endpointMaxSize,
      endpointCertified,
      inferredRowCount: interval.max - interval.min + 1,
    });
    for (let N = interval.min; N <= interval.max; N += 1) {
      const residue7 = residueClass(N, 7);
      const residue18 = residueClass(N, 18);
      const exampleClique = residue7.length >= residue18.length ? residue7 : residue18;
      rows.push({
        N,
        maxCliqueSize: interval.candidateSize,
        residue7Size: residue7.length,
        residue18Size: residue18.length,
        candidateAchievesMaximum: endpointCertified,
        exampleMaximumClique: exampleClique,
        exampleMatchesResidue7: sameSortedSet(exampleClique, residue7),
        exampleMatchesResidue18: sameSortedSet(exampleClique, residue18),
        inferredByEndpointMonotonicity: true,
        endpointCheckN: interval.max,
      });
    }
  }
  return { rows, endpointChecks };
}

function summarize(rows) {
  return {
    interval: `${rows[0].N}..${rows[rows.length - 1].N}`,
    rows: rows.length,
    allCandidateAchievesMaximum: rows.every((row) => row.candidateAchievesMaximum),
    allExampleCliquesMatchCandidateClass: rows.every(
      (row) => row.exampleMatchesResidue7 || row.exampleMatchesResidue18,
    ),
  };
}

const args = parseArgs(process.argv.slice(2));
const scan = args.endpointMonotonicity
  ? scanEndpointMonotonicityInterval(args.min, args.max)
  : { rows: scanInterval(args.min, args.max), endpointChecks: null };
const rows = scan.rows;
const payload = {
  generatedAt: new Date().toISOString(),
  method: args.endpointMonotonicity
    ? 'endpoint_monotonicity_maximum_clique_scan'
    : 'exact_maximum_clique_scan',
  problemId: '848',
  parameters: {
    min: args.min,
    max: args.max,
    endpointMonotonicity: args.endpointMonotonicity,
  },
  summary: summarize(rows),
  endpointMonotonicity: args.endpointMonotonicity
    ? {
      endpointCheckCount: scan.endpointChecks.length,
      endpointChecks: scan.endpointChecks,
      allEndpointChecksCertified: scan.endpointChecks.every((check) => check.endpointCertified),
      lemma: 'If the candidate size is constant on [L,R] and the exact endpoint check proves omega(G_R)=C, monotonicity of induced subgraphs gives omega(G_N)=C for every N in [L,R].',
    }
    : null,
  results: rows,
};

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(payload, null, 2)}\n`);
}

console.log(JSON.stringify(payload.summary, null, 2));
