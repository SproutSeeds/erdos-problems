#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = { min: 1, max: 100, jsonOutput: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--min') {
      args.min = Number(argv[++i]);
    } else if (token === '--max') {
      args.max = Number(argv[++i]);
    } else if (token === '--json-output') {
      args.jsonOutput = argv[++i];
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

const squarefreeCache = new Map();

function isSquarefree(n) {
  if (squarefreeCache.has(n)) return squarefreeCache.get(n);
  let x = n;
  for (let p = 2; p * p <= x; p += 1) {
    if (x % p !== 0) continue;
    x /= p;
    if (x % p === 0) {
      squarefreeCache.set(n, false);
      return false;
    }
    while (x % p === 0) x /= p;
  }
  squarefreeCache.set(n, true);
  return true;
}

function residueClassSize(N, residue) {
  if (N < residue) return 0;
  return Math.floor((N - residue) / 25) + 1;
}

function isPureResidueClass(clique, N, residue) {
  return clique.length === residueClassSize(N, residue) && clique.every((value) => value % 25 === residue);
}

function maximumCliqueIndices(adjacency, candidateIndices, lowerBound = 0) {
  let best = [];

  function bronKerbosch(R, P, X) {
    if (P.length === 0 && X.length === 0) {
      if (R.length > best.length) best = [...R];
      return;
    }
    if (R.length + P.length <= Math.max(best.length, lowerBound)) return;

    let pivot = null;
    let pivotNeighborsInP = -1;
    for (const u of [...P, ...X]) {
      let count = 0;
      for (const v of P) {
        if (adjacency[u].has(v)) count += 1;
      }
      if (count > pivotNeighborsInP) {
        pivotNeighborsInP = count;
        pivot = u;
      }
    }

    const candidates = pivot === null
      ? [...P]
      : P.filter((v) => !adjacency[pivot].has(v));

    for (const v of candidates) {
      bronKerbosch(
        [...R, v],
        P.filter((u) => adjacency[v].has(u)),
        X.filter((u) => adjacency[v].has(u)),
      );
      P = P.filter((u) => u !== v);
      X = [...X, v];
    }
  }

  bronKerbosch([], [...candidateIndices], []);
  return best.sort((a, b) => a - b);
}

function scanInterval(minN, maxN) {
  const rows = [];
  const vertices = [];
  const adjacency = [];
  let bestCliqueIndices = [];

  for (let N = 1; N <= maxN; N += 1) {
    const residue7Size = residueClassSize(N, 7);
    const residue18Size = residueClassSize(N, 18);

    if (!isSquarefree(N * N + 1)) {
      const newIndex = vertices.length;
      const neighbors = [];
      for (let i = 0; i < vertices.length; i += 1) {
        if (!isSquarefree(vertices[i] * N + 1)) {
          adjacency[i].add(newIndex);
          neighbors.push(i);
        }
      }
      adjacency.push(new Set(neighbors));
      vertices.push(N);

      if (neighbors.length + 1 > bestCliqueIndices.length) {
        const neighborClique = maximumCliqueIndices(
          adjacency,
          neighbors,
          Math.max(0, bestCliqueIndices.length - 1),
        );
        if (neighborClique.length + 1 > bestCliqueIndices.length) {
          bestCliqueIndices = [...neighborClique, newIndex].sort((a, b) => a - b);
        }
      }
    }

    const clique = bestCliqueIndices.map((index) => vertices[index]);
    const maxSize = clique.length;
    if (N < minN) continue;
    const exampleResidueClass = isPureResidueClass(clique, N, 7)
      ? 7
      : isPureResidueClass(clique, N, 18)
        ? 18
        : null;

    rows.push({
      N,
      maxCliqueSize: maxSize,
      residue7Size,
      residue18Size,
      candidateAchievesMaximum: residue7Size === maxSize,
      exampleResidueClass,
      exampleMaximumClique: exampleResidueClass === null ? clique : undefined,
      exampleMatchesResidue7: exampleResidueClass === 7,
      exampleMatchesResidue18: exampleResidueClass === 18,
    });
  }
  return rows;
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
const rows = scanInterval(args.min, args.max);
const payload = {
  generatedAt: new Date().toISOString(),
  method: 'exact_maximum_clique_scan',
  resultEncoding: 'residue_class_when_possible',
  problemId: '848',
  parameters: {
    min: args.min,
    max: args.max,
  },
  summary: summarize(rows),
  results: rows,
};

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(payload, null, 2)}\n`);
}

console.log(JSON.stringify(payload.summary, null, 2));
