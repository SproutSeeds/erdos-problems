#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    max: 10000,
    threshold: 1,
    anchors: [7, 32, 57, 82],
    jsonOutput: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--max') {
      args.max = Number(argv[++i]);
    } else if (token === '--threshold') {
      args.threshold = Number(argv[++i]);
    } else if (token === '--anchors') {
      args.anchors = argv[++i].split(',').map((value) => Number(value.trim())).filter(Boolean);
    } else if (token === '--json-output') {
      args.jsonOutput = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }
  if (!Number.isInteger(args.max) || args.max < 1) {
    throw new Error('--max must be a positive integer');
  }
  if (!Number.isInteger(args.threshold) || args.threshold < 1 || args.threshold > args.max) {
    throw new Error('--threshold must be an integer between 1 and --max');
  }
  if (!Array.isArray(args.anchors) || args.anchors.length === 0) {
    throw new Error('--anchors must provide at least one positive integer');
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

function scanAnchors({ anchors, threshold, max }) {
  const failures = [];
  const witnessCounts = new Map();
  const residueStats = new Map();

  for (let residue = 0; residue < 25; residue += 1) {
    if (residue === 7) continue;
    residueStats.set(residue, {
      residue,
      witnessCounts: Object.fromEntries(anchors.map((anchor) => [anchor, 0])),
      firstFailure: null,
      failureCount: 0,
    });
  }

  for (let n = threshold; n <= max; n += 1) {
    if (n % 25 === 7) continue;
    const usableAnchors = anchors.filter((anchor) => anchor <= n);
    const witness = usableAnchors.find((anchor) => isSquarefree(anchor * n + 1)) ?? null;
    if (witness === null) {
      failures.push(n);
      const residueRow = residueStats.get(n % 25);
      residueRow.failureCount += 1;
      if (residueRow.firstFailure === null) residueRow.firstFailure = n;
      continue;
    }
    witnessCounts.set(witness, (witnessCounts.get(witness) ?? 0) + 1);
    residueStats.get(n % 25).witnessCounts[witness] += 1;
  }

  return {
    failures,
    witnessCounts: Object.fromEntries(anchors.map((anchor) => [anchor, witnessCounts.get(anchor) ?? 0])),
    residueStats: [...residueStats.values()],
  };
}

const args = parseArgs(process.argv.slice(2));
const result = scanAnchors(args);
const payload = {
  generatedAt: new Date().toISOString(),
  method: 'anchor_obstruction_scan',
  problemId: '848',
  parameters: {
    anchors: args.anchors,
    threshold: args.threshold,
    max: args.max,
  },
  summary: {
    failureCount: result.failures.length,
    tailStart: result.failures.length ? Math.max(...result.failures) + 1 : args.threshold,
    allCoveredFromThreshold: result.failures.length === 0,
    witnessCounts: result.witnessCounts,
  },
  failures: result.failures,
  residueStats: result.residueStats,
};

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(payload, null, 2)}\n`);
}

console.log(JSON.stringify(payload.summary, null, 2));
