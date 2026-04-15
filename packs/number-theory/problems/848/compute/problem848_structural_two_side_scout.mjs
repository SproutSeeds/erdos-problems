#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    max: 10000,
    minStructuralN: 7307,
    jsonOutput: null,
    markdownOutput: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--max') {
      args.max = Number(argv[++index]);
    } else if (token === '--min-structural-n') {
      args.minStructuralN = Number(argv[++index]);
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
  if (!Number.isInteger(args.minStructuralN) || args.minStructuralN < 1) {
    throw new Error('--min-structural-n must be a positive integer');
  }
  if (args.minStructuralN > args.max) {
    throw new Error('--min-structural-n must be <= --max');
  }
  return args;
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

function isBaseResidue(value) {
  const residue = positiveModulo(value, 25);
  return residue === 7 || residue === 18;
}

function isNonSquarefree(value, primeSquares) {
  for (const square of primeSquares) {
    if (square > value) break;
    if (value % square === 0) return true;
  }
  return false;
}

function residueValues(max, residue, modulus = 25) {
  const values = [];
  for (let value = residue; value <= max; value += modulus) {
    if (value >= 1) values.push(value);
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

function henselRootPrimeSquare(p) {
  let rootModP = null;
  for (let residue = 1; residue < p; residue += 1) {
    if ((residue * residue + 1) % p === 0) {
      rootModP = residue;
      break;
    }
  }
  if (rootModP === null) {
    throw new Error(`No root for p=${p}`);
  }
  const p2 = p * p;
  const t = Math.floor((rootModP * rootModP + 1) / p) % p;
  const inverse = modInverse((2 * rootModP) % p, p);
  if (inverse === null) {
    throw new Error(`Hensel inverse failed for p=${p}`);
  }
  let k = (-t * inverse) % p;
  if (k < 0) k += p;
  let root = (rootModP + k * p) % p2;
  if (root <= 0) root += p2;
  if ((root * root + 1) % p2 !== 0) {
    throw new Error(`Hensel root verification failed for p=${p}`);
  }
  return {
    p,
    p2,
    rPlus: root,
    rMinus: p2 - root,
  };
}

function buildRootInfos(maxN) {
  return primeSieve(Math.floor(Math.sqrt(maxN)) + 5)
    .filter((prime) => prime >= 13 && prime % 4 === 1 && prime * prime <= maxN)
    .map(henselRootPrimeSquare);
}

function rootProgression(residue, modulus, maxN) {
  const values = [];
  for (let value = residue; value <= maxN; value += modulus) {
    if (value >= 1) values.push(value);
  }
  return values;
}

function classifyLeastWitness(value, roots) {
  for (let index = 0; index < roots.length; index += 1) {
    const root = roots[index];
    const residue = positiveModulo(value, root.p2);
    if (residue === root.rPlus) {
      return { index, sign: 'plus', p: root.p };
    }
    if (residue === root.rMinus) {
      return { index, sign: 'minus', p: root.p };
    }
  }
  return null;
}

function compatibleValues(value, candidates, primeSquares) {
  return candidates.filter((candidate) => isNonSquarefree(value * candidate + 1, primeSquares));
}

function maxPrefixCompatibility(values, compatibleByValue, activeN) {
  let max = 0;
  let witness = null;
  for (const value of values) {
    if (value > activeN) break;
    const count = upperBound(compatibleByValue.get(value) ?? [], activeN);
    if (count > max) {
      max = count;
      witness = value;
    }
  }
  return { max, witness };
}

function buildBlock(root, rootIndex, roots, maxN, baseSides, primeSquares) {
  const rawPlusValues = rootProgression(root.rPlus, root.p2, maxN);
  const rawMinusValues = rootProgression(root.rMinus, root.p2, maxN);
  const plusValues = rawPlusValues.filter((value) => {
    if (isBaseResidue(value)) return false;
    const witness = classifyLeastWitness(value, roots);
    return witness?.index === rootIndex && witness.sign === 'plus';
  });
  const minusValues = rawMinusValues.filter((value) => {
    if (isBaseResidue(value)) return false;
    const witness = classifyLeastWitness(value, roots);
    return witness?.index === rootIndex && witness.sign === 'minus';
  });
  const outsiderValues = [...plusValues, ...minusValues].sort((left, right) => left - right);
  const side7CompatibleByValue = new Map();
  const side18CompatibleByValue = new Map();
  const unionCompatibleByValue = new Map();

  for (const value of outsiderValues) {
    const side7 = compatibleValues(value, baseSides.side7Values, primeSquares);
    const side18 = compatibleValues(value, baseSides.side18Values, primeSquares);
    side7CompatibleByValue.set(value, side7);
    side18CompatibleByValue.set(value, side18);
    unionCompatibleByValue.set(value, [...side7, ...side18].sort((left, right) => left - right));
  }

  const plusToMinus = new Map(plusValues.map((value) => [value, []]));
  const minusToPlus = new Map(minusValues.map((value) => [value, []]));
  for (const plus of plusValues) {
    for (const minus of minusValues) {
      if (!isNonSquarefree(plus * minus + 1, primeSquares)) continue;
      plusToMinus.get(plus).push(minus);
      minusToPlus.get(minus).push(plus);
    }
  }

  return {
    root,
    rootIndex,
    rawPlusValues,
    rawMinusValues,
    plusValues,
    minusValues,
    outsiderValues,
    side7CompatibleByValue,
    side18CompatibleByValue,
    unionCompatibleByValue,
    plusToMinus,
    minusToPlus,
  };
}

function evaluateBlockAtN(block, higherRootEventValues, baseSides, activeN) {
  const rawPlus = upperBound(block.rawPlusValues, activeN);
  const rawMinus = upperBound(block.rawMinusValues, activeN);
  const vMax = Math.max(rawPlus, rawMinus);
  const s7 = maxPrefixCompatibility(block.outsiderValues, block.side7CompatibleByValue, activeN);
  const s18 = maxPrefixCompatibility(block.outsiderValues, block.side18CompatibleByValue, activeN);
  const sUnion = maxPrefixCompatibility(block.outsiderValues, block.unionCompatibleByValue, activeN);
  const activePlus = upperBound(block.plusValues, activeN);
  const activeMinus = upperBound(block.minusValues, activeN);
  let dMax = 0;
  let dWitness = null;

  for (const plus of block.plusValues.slice(0, activePlus)) {
    const degree = upperBound(block.plusToMinus.get(plus) ?? [], activeN);
    if (degree > dMax) {
      dMax = degree;
      dWitness = { side: 'plus', value: plus };
    }
  }
  for (const minus of block.minusValues.slice(0, activeMinus)) {
    const degree = upperBound(block.minusToPlus.get(minus) ?? [], activeN);
    if (degree > dMax) {
      dMax = degree;
      dWitness = { side: 'minus', value: minus };
    }
  }

  const rGreater = upperBound(higherRootEventValues, activeN);
  const side7CandidateSize = upperBound(baseSides.side7Values, activeN);
  const side18CandidateSize = upperBound(baseSides.side18Values, activeN);
  const candidateSize = Math.max(side7CandidateSize, side18CandidateSize);
  const side7Bound = s7.max + vMax + dMax + rGreater;
  const side18Bound = s18.max + vMax + dMax + rGreater;
  const unionBound = sUnion.max + vMax + dMax + rGreater;

  return {
    N: activeN,
    p: block.root.p,
    p2: block.root.p2,
    rawPlus,
    rawMinus,
    vMax,
    activePlus,
    activeMinus,
    sMaxSide7: s7.max,
    sMaxSide7Witness: s7.witness,
    sMaxSide18: s18.max,
    sMaxSide18Witness: s18.witness,
    sMaxUnion: sUnion.max,
    sMaxUnionWitness: sUnion.witness,
    dMax,
    dMaxWitness: dWitness,
    rGreater,
    candidateSize,
    side7CandidateSize,
    side18CandidateSize,
    side7Bound,
    side18Bound,
    unionBound,
    side7Margin: candidateSize - side7Bound,
    side18Margin: candidateSize - side18Bound,
    unionMargin: candidateSize - unionBound,
    side7Pass: side7Bound < candidateSize,
    side18Pass: side18Bound < candidateSize,
    unionPass: unionBound < candidateSize,
  };
}

function betterWorst(left, right, key) {
  if (!left) return right;
  if (!right) return left;
  if (right[key] < left[key]) return right;
  if (right[key] === left[key] && right.N < left.N) return right;
  return left;
}

function analyze(maxN, minStructuralN) {
  const roots = buildRootInfos(maxN);
  const primes = primeSieve(maxN);
  const primeSquares = primes.map((prime) => prime * prime);
  const side7Values = residueValues(maxN, 7);
  const side18Values = residueValues(maxN, 18);
  const baseSides = { side7Values, side18Values };
  const globalRootEvents = [];
  for (let rootIndex = 0; rootIndex < roots.length; rootIndex += 1) {
    const root = roots[rootIndex];
    for (const value of rootProgression(root.rPlus, root.p2, maxN)) {
      globalRootEvents.push({ n: value, rootIndex, p: root.p, sign: 'plus' });
    }
    for (const value of rootProgression(root.rMinus, root.p2, maxN)) {
      globalRootEvents.push({ n: value, rootIndex, p: root.p, sign: 'minus' });
    }
  }
  globalRootEvents.sort((left, right) => left.n - right.n || left.rootIndex - right.rootIndex);

  const breakpoints = [
    minStructuralN,
    maxN,
    ...side7Values,
    ...side18Values,
    ...globalRootEvents.map((event) => event.n),
  ]
    .filter((value) => value >= minStructuralN && value <= maxN)
    .sort((left, right) => left - right)
    .filter((value, index, values) => index === 0 || value !== values[index - 1]);

  const higherRootEventsByIndex = roots.map((_, rootIndex) => globalRootEvents
    .filter((event) => event.rootIndex > rootIndex)
    .map((event) => event.n)
    .sort((left, right) => left - right));

  const blockSummaries = [];
  const failureRows = [];
  let checkCount = 0;
  let side7FailureCount = 0;
  let side18FailureCount = 0;
  let unionFailureCount = 0;
  let firstSide7Failure = null;
  let firstSide18Failure = null;
  let firstUnionFailure = null;
  let worstSide7Row = null;
  let worstSide18Row = null;
  let worstUnionRow = null;

  for (let rootIndex = 0; rootIndex < roots.length; rootIndex += 1) {
    const block = buildBlock(roots[rootIndex], rootIndex, roots, maxN, baseSides, primeSquares);
    let blockWorstUnionRow = null;
    let blockUnionFailureCount = 0;
    let blockFirstUnionFailure = null;

    for (const activeN of breakpoints) {
      const row = evaluateBlockAtN(block, higherRootEventsByIndex[rootIndex], baseSides, activeN);
      checkCount += 1;
      worstSide7Row = betterWorst(worstSide7Row, row, 'side7Margin');
      worstSide18Row = betterWorst(worstSide18Row, row, 'side18Margin');
      worstUnionRow = betterWorst(worstUnionRow, row, 'unionMargin');
      blockWorstUnionRow = betterWorst(blockWorstUnionRow, row, 'unionMargin');

      if (!row.side7Pass) {
        side7FailureCount += 1;
        firstSide7Failure ??= row;
      }
      if (!row.side18Pass) {
        side18FailureCount += 1;
        firstSide18Failure ??= row;
      }
      if (!row.unionPass) {
        unionFailureCount += 1;
        blockUnionFailureCount += 1;
        firstUnionFailure ??= row;
        blockFirstUnionFailure ??= row;
        if (failureRows.length < 1000) {
          failureRows.push(row);
        }
      }
    }

    blockSummaries.push({
      p: block.root.p,
      p2: block.root.p2,
      rPlus: block.root.rPlus,
      rMinus: block.root.rMinus,
      rawPlusCountAtMax: block.rawPlusValues.length,
      rawMinusCountAtMax: block.rawMinusValues.length,
      leastWitnessPlusCountAtMax: block.plusValues.length,
      leastWitnessMinusCountAtMax: block.minusValues.length,
      unionFailureCount: blockUnionFailureCount,
      firstUnionFailure: blockFirstUnionFailure,
      worstUnionRow: blockWorstUnionRow,
    });
  }

  const allUnionChecksPass = unionFailureCount === 0;
  const allSide7ChecksPass = side7FailureCount === 0;
  const allSide18ChecksPass = side18FailureCount === 0;
  const status = allUnionChecksPass
    ? 'bounded_two_side_union_structural_bound_certified'
    : allSide7ChecksPass && allSide18ChecksPass
      ? 'side_specific_bounds_pass_but_union_bound_fails'
      : 'bounded_two_side_structural_bound_has_failures';

  return {
    schema: 'erdos.number_theory.p848_structural_two_side_scout/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    method: 'bounded_outsider_clique_two_side_structural_scout',
    status,
    parameters: {
      maxN,
      minStructuralN,
      assessedRange: `${minStructuralN}..${maxN}`,
    },
    summary: {
      assessedRange: `${minStructuralN}..${maxN}`,
      witnessBlockCount: roots.length,
      breakpointCount: breakpoints.length,
      checkCount,
      globalRootEventCount: globalRootEvents.length,
      side7BaseCountAtMax: side7Values.length,
      side18BaseCountAtMax: side18Values.length,
      allSide7ChecksPass,
      allSide18ChecksPass,
      allUnionChecksPass,
      side7FailureCount,
      side18FailureCount,
      unionFailureCount,
    },
    firstFailures: {
      side7: firstSide7Failure,
      side18: firstSide18Failure,
      union: firstUnionFailure,
    },
    worstRows: {
      side7: worstSide7Row,
      side18: worstSide18Row,
      union: worstUnionRow,
    },
    blockSummaries,
    failureRowsSample: failureRows,
    boundary: {
      claimLevel: 'bounded_scout_not_all_n_proof',
      safety: 'The union-base bound is safe but intentionally loose: it allows every compatible element from both principal sides even though a real clique may not be able to mix them.',
      promotionRule: 'Promote only bounded structural coverage when unionPass is true for every checked witness-prime block and structural breakpoint in the assessed range.',
      nextUse: allUnionChecksPass
        ? 'Use this bounded pass as the repo-owned replacement direction for the external one-sided mask.'
        : 'Use the first/worst union failures to decide whether we need a sharper mixed-base lemma rather than a raw union overcount.',
    },
  };
}

function renderRow(row) {
  return row ? JSON.stringify(row) : '(none)';
}

function renderMarkdown(packet) {
  const lines = [
    '# Problem 848 Two-Sided Structural Scout',
    '',
    `- Generated: ${packet.generatedAt}`,
    `- Method: \`${packet.method}\``,
    `- Status: \`${packet.status}\``,
    `- Assessed range: \`${packet.summary.assessedRange}\``,
    `- Witness blocks: \`${packet.summary.witnessBlockCount}\``,
    `- Breakpoints: \`${packet.summary.breakpointCount}\``,
    `- Checks: \`${packet.summary.checkCount}\``,
    '',
    '## Pass/Fail Summary',
    '',
    `- Side 7 checks pass: \`${packet.summary.allSide7ChecksPass ? 'yes' : 'no'}\` (${packet.summary.side7FailureCount} failures)`,
    `- Side 18 checks pass: \`${packet.summary.allSide18ChecksPass ? 'yes' : 'no'}\` (${packet.summary.side18FailureCount} failures)`,
    `- Union-base checks pass: \`${packet.summary.allUnionChecksPass ? 'yes' : 'no'}\` (${packet.summary.unionFailureCount} failures)`,
    '',
    '## First Failures',
    '',
    `- Side 7: \`${renderRow(packet.firstFailures.side7)}\``,
    `- Side 18: \`${renderRow(packet.firstFailures.side18)}\``,
    `- Union: \`${renderRow(packet.firstFailures.union)}\``,
    '',
    '## Worst Rows',
    '',
    `- Side 7: \`${renderRow(packet.worstRows.side7)}\``,
    `- Side 18: \`${renderRow(packet.worstRows.side18)}\``,
    `- Union: \`${renderRow(packet.worstRows.union)}\``,
    '',
    '## Boundary',
    '',
    `- Claim level: \`${packet.boundary.claimLevel}\``,
    `- Safety: ${packet.boundary.safety}`,
    `- Promotion rule: ${packet.boundary.promotionRule}`,
    `- Next use: ${packet.boundary.nextUse}`,
    '',
  ];

  return lines.join('\n');
}

const args = parseArgs(process.argv.slice(2));
const packet = analyze(args.max, args.minStructuralN);

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
}

if (args.markdownOutput) {
  fs.mkdirSync(path.dirname(args.markdownOutput), { recursive: true });
  fs.writeFileSync(args.markdownOutput, renderMarkdown(packet));
}

console.log(JSON.stringify(packet.summary, null, 2));
