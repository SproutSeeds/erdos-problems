#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    max: 10000,
    top: 15,
    candidateCount: 10,
    setSizes: [3, 4],
    jsonOutput: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--max') {
      args.max = Number(argv[++i]);
    } else if (token === '--top') {
      args.top = Number(argv[++i]);
    } else if (token === '--candidate-count') {
      args.candidateCount = Number(argv[++i]);
    } else if (token === '--set-sizes') {
      args.setSizes = argv[++i].split(',').map((value) => Number(value.trim())).filter(Boolean);
    } else if (token === '--json-output') {
      args.jsonOutput = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }
  if (!Number.isInteger(args.max) || args.max < 1) {
    throw new Error('--max must be a positive integer');
  }
  if (!Number.isInteger(args.top) || args.top < 1) {
    throw new Error('--top must be a positive integer');
  }
  if (!Number.isInteger(args.candidateCount) || args.candidateCount < 1) {
    throw new Error('--candidate-count must be a positive integer');
  }
  if (!Array.isArray(args.setSizes) || args.setSizes.length === 0) {
    throw new Error('--set-sizes must provide at least one set size');
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

function choose(list, size, start = 0, prefix = [], out = []) {
  if (prefix.length === size) {
    out.push(prefix);
    return out;
  }
  for (let i = start; i <= list.length - (size - prefix.length); i += 1) {
    choose(list, size, i + 1, [...prefix, list[i]], out);
  }
  return out;
}

function failuresFor(set, max) {
  const bad = [];
  for (let n = 1; n <= max; n += 1) {
    if (n % 25 === 7) continue;
    let ok = false;
    for (const q of set) {
      if (q <= n && isSquarefree(n * q + 1)) {
        ok = true;
        break;
      }
    }
    if (!ok) bad.push(n);
  }
  return bad;
}

const args = parseArgs(process.argv.slice(2));
const candidates = Array.from({ length: args.candidateCount }, (_, index) => 7 + 25 * index);
const bySize = {};

for (const size of args.setSizes) {
  bySize[size] = choose(candidates, size)
    .map((set) => {
      const failures = failuresFor(set, args.max);
      return {
        anchors: set,
        failureCount: failures.length,
        tailStart: failures.length ? Math.max(...failures) + 1 : 1,
        worstFailures: failures.slice(-12),
      };
    })
    .sort((left, right) => left.tailStart - right.tailStart || left.failureCount - right.failureCount)
    .slice(0, args.top);
}

const payload = {
  generatedAt: new Date().toISOString(),
  method: 'anchor_subset_search',
  problemId: '848',
  parameters: {
    max: args.max,
    top: args.top,
    candidateCount: args.candidateCount,
    setSizes: args.setSizes,
    candidates,
  },
  results: bySize,
};

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(payload, null, 2)}\n`);
}

console.log(JSON.stringify(
  Object.fromEntries(
    Object.entries(bySize).map(([size, rows]) => [size, rows[0] ?? null]),
  ),
  null,
  2,
));
