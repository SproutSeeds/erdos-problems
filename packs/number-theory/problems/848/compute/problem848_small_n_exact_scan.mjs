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

function buildGraph(N) {
  const vertices = [];
  for (let a = 1; a <= N; a += 1) {
    if (!isSquarefree(a * a + 1)) vertices.push(a);
  }
  const adjacency = Array.from({ length: vertices.length }, () => new Set());
  for (let i = 0; i < vertices.length; i += 1) {
    for (let j = i + 1; j < vertices.length; j += 1) {
      const a = vertices[i];
      const b = vertices[j];
      if (!isSquarefree(a * b + 1)) {
        adjacency[i].add(j);
        adjacency[j].add(i);
      }
    }
  }
  return { vertices, adjacency };
}

function maximumClique(vertices, adjacency) {
  let best = [];

  function bronKerbosch(R, P, X) {
    if (P.length === 0 && X.length === 0) {
      if (R.length > best.length) best = [...R];
      return;
    }
    if (R.length + P.length <= best.length) return;

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

  bronKerbosch([], vertices.map((_, index) => index), []);
  return best.map((index) => vertices[index]).sort((a, b) => a - b);
}

function scanInterval(minN, maxN) {
  const rows = [];
  for (let N = minN; N <= maxN; N += 1) {
    const residue7 = residueClass(N, 7);
    const residue18 = residueClass(N, 18);
    const { vertices, adjacency } = buildGraph(N);
    const clique = maximumClique(vertices, adjacency);
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
