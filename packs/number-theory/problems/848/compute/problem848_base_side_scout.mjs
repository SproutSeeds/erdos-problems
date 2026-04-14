#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    max: 2000,
    jsonOutput: null,
    markdownOutput: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--max') {
      args.max = Number(argv[++index]);
    } else if (token === '--json-output') {
      args.jsonOutput = argv[++index];
    } else if (token === '--markdown-output') {
      args.markdownOutput = argv[++index];
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (!Number.isInteger(args.max) || args.max < 1) {
    throw new Error('--max must be a positive integer');
  }
  return args;
}

function primeSieve(max) {
  const composite = new Uint8Array(max + 1);
  const primes = [];
  for (let n = 2; n <= max; n += 1) {
    if (composite[n]) continue;
    primes.push(n);
    if (n * n > max) continue;
    for (let multiple = n * n; multiple <= max; multiple += n) {
      composite[multiple] = 1;
    }
  }
  return primes;
}

function isNonSquarefree(value, primeSquares) {
  for (const square of primeSquares) {
    if (square > value) break;
    if (value % square === 0) return true;
  }
  return false;
}

function residueValues(max, residue) {
  const values = [];
  for (let n = residue; n <= max; n += 25) {
    if (n >= 1) values.push(n);
  }
  return values;
}

function upperBound(values, maxValue) {
  let low = 0;
  let high = values.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (values[mid] <= maxValue) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

function buildCompatibilityLists(outsiders, baseValues, primeSquares) {
  const byOutsider = new Map();
  for (const outsider of outsiders) {
    const compatible = [];
    for (const base of baseValues) {
      if (isNonSquarefree(outsider * base + 1, primeSquares)) {
        compatible.push(base);
      }
    }
    byOutsider.set(outsider, compatible);
  }
  return byOutsider;
}

function summarizeSideAtN(N, outsiders, side7ByOutsider, side18ByOutsider) {
  let maxSide7 = 0;
  let maxSide18 = 0;
  let maxSide7Outsider = null;
  let maxSide18Outsider = null;
  let maxPerOutsider18Minus7 = -Infinity;
  let maxPerOutsider7Minus18 = -Infinity;
  let perOutsider18Winner = null;
  let perOutsider7Winner = null;

  for (const outsider of outsiders) {
    if (outsider > N) break;
    const side7 = upperBound(side7ByOutsider.get(outsider) ?? [], N);
    const side18 = upperBound(side18ByOutsider.get(outsider) ?? [], N);
    if (side7 > maxSide7) {
      maxSide7 = side7;
      maxSide7Outsider = outsider;
    }
    if (side18 > maxSide18) {
      maxSide18 = side18;
      maxSide18Outsider = outsider;
    }
    const delta18 = side18 - side7;
    const delta7 = side7 - side18;
    if (delta18 > maxPerOutsider18Minus7) {
      maxPerOutsider18Minus7 = delta18;
      perOutsider18Winner = { outsider, side7, side18, delta18Minus7: delta18 };
    }
    if (delta7 > maxPerOutsider7Minus18) {
      maxPerOutsider7Minus18 = delta7;
      perOutsider7Winner = { outsider, side7, side18, delta7Minus18: delta7 };
    }
  }

  return {
    N,
    maxSide7,
    maxSide18,
    maxSide7Outsider,
    maxSide18Outsider,
    maxSide18Minus7: maxSide18 - maxSide7,
    maxPerOutsider18Minus7,
    maxPerOutsider7Minus18,
    perOutsider18Winner,
    perOutsider7Winner,
  };
}

function analyze(maxN) {
  const primeSquares = primeSieve(Math.ceil(Math.sqrt(maxN * maxN + 1)))
    .map((prime) => prime * prime);
  const side7Values = residueValues(maxN, 7);
  const side18Values = residueValues(maxN, 18);
  const outsiders = [];
  for (let n = 1; n <= maxN; n += 1) {
    const residue = n % 25;
    if (residue === 7 || residue === 18) continue;
    if (isNonSquarefree(n * n + 1, primeSquares)) outsiders.push(n);
  }

  const side7ByOutsider = buildCompatibilityLists(outsiders, side7Values, primeSquares);
  const side18ByOutsider = buildCompatibilityLists(outsiders, side18Values, primeSquares);
  const rows = [];
  let globalMaxSide18Minus7 = -Infinity;
  let globalMaxPerOutsider18Minus7 = -Infinity;
  let firstNWithSide18MaxExceedingSide7 = null;
  let firstNWithPerOutsider18ExceedingSide7 = null;
  let strongestSide18MaxRow = null;
  let strongestPerOutsider18Row = null;

  for (let N = 1; N <= maxN; N += 1) {
    const row = summarizeSideAtN(N, outsiders, side7ByOutsider, side18ByOutsider);
    rows.push(row);
    if (row.maxSide18Minus7 > globalMaxSide18Minus7) {
      globalMaxSide18Minus7 = row.maxSide18Minus7;
      strongestSide18MaxRow = row;
    }
    if (row.maxPerOutsider18Minus7 > globalMaxPerOutsider18Minus7) {
      globalMaxPerOutsider18Minus7 = row.maxPerOutsider18Minus7;
      strongestPerOutsider18Row = row;
    }
    if (firstNWithSide18MaxExceedingSide7 === null && row.maxSide18 > row.maxSide7) {
      firstNWithSide18MaxExceedingSide7 = row;
    }
    if (
      firstNWithPerOutsider18ExceedingSide7 === null
      && row.maxPerOutsider18Minus7 > 0
    ) {
      firstNWithPerOutsider18ExceedingSide7 = row;
    }
  }

  const maxSide18ExceedsSide7 = firstNWithSide18MaxExceedingSide7 !== null;
  const perOutsiderSide18ExceedsSide7 = firstNWithPerOutsider18ExceedingSide7 !== null;
  return {
    schema: 'erdos.number_theory.p848_base_side_scout/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    method: 'bounded_base_side_compatibility_scout',
    parameters: {
      maxN,
    },
    status: maxSide18ExceedsSide7
      ? 'counterexample_to_global_7_side_domination_found'
      : perOutsiderSide18ExceedsSide7
        ? 'per_outsider_18_side_can_exceed_7_side_but_global_smax_ok'
        : 'bounded_7_side_dominates_18_side',
    summary: {
      interval: `1..${maxN}`,
      outsiderCount: outsiders.length,
      side7CountAtMax: side7Values.length,
      side18CountAtMax: side18Values.length,
      globalMaxSide18Minus7,
      globalMaxPerOutsider18Minus7,
      maxSide18ExceedsSide7,
      perOutsiderSide18ExceedsSide7,
    },
    strongestSide18MaxRow,
    strongestPerOutsider18Row,
    firstNWithSide18MaxExceedingSide7,
    firstNWithPerOutsider18ExceedingSide7,
    rows,
    boundary: {
      claimLevel: 'bounded_scout_not_proof',
      note: 'This scout compares principal-base compatibility counts on a finite interval only. It does not prove all-N base-side domination.',
      nextUse: maxSide18ExceedsSide7
        ? 'A one-sided 7 mod 25 base mask is not safe on this bounded scout; a two-sided structural verifier is needed.'
        : 'Use this as evidence while seeking either a two-sided verifier or a theorem proving 7-side domination.',
    },
  };
}

function renderMarkdown(packet) {
  const lines = [
    '# Problem 848 Base-Side Scout',
    '',
    `- Generated: ${packet.generatedAt}`,
    `- Method: \`${packet.method}\``,
    `- Status: \`${packet.status}\``,
    `- Interval: \`${packet.summary.interval}\``,
    `- Outsiders checked: \`${packet.summary.outsiderCount}\``,
    `- Global max side18-minus-side7: \`${packet.summary.globalMaxSide18Minus7}\``,
    `- Max per-outsider side18-minus-side7: \`${packet.summary.globalMaxPerOutsider18Minus7}\``,
    '',
    '## Strongest Rows',
    '',
    `- Strongest global side-18 row: \`${JSON.stringify(packet.strongestSide18MaxRow)}\``,
    `- Strongest per-outsider side-18 row: \`${JSON.stringify(packet.strongestPerOutsider18Row)}\``,
    `- First global side-18 exceedance: \`${JSON.stringify(packet.firstNWithSide18MaxExceedingSide7)}\``,
    `- First per-outsider side-18 exceedance: \`${JSON.stringify(packet.firstNWithPerOutsider18ExceedingSide7)}\``,
    '',
    '## Boundary',
    '',
    `- Claim level: \`${packet.boundary.claimLevel}\``,
    `- ${packet.boundary.note}`,
    `- Next use: ${packet.boundary.nextUse}`,
    '',
  ];
  return lines.join('\n');
}

const args = parseArgs(process.argv.slice(2));
const packet = analyze(args.max);

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
}

if (args.markdownOutput) {
  fs.mkdirSync(path.dirname(args.markdownOutput), { recursive: true });
  fs.writeFileSync(args.markdownOutput, renderMarkdown(packet));
}

console.log(JSON.stringify({
  status: packet.status,
  interval: packet.summary.interval,
  outsiderCount: packet.summary.outsiderCount,
  globalMaxSide18Minus7: packet.summary.globalMaxSide18Minus7,
  maxSide18ExceedsSide7: packet.summary.maxSide18ExceedsSide7,
}, null, 2));
