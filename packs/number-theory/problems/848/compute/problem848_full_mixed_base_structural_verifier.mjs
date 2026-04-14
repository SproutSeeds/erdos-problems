#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    max: 10000,
    minStructuralN: 7307,
    rowSampleLimit: 200,
    jsonOutput: null,
    markdownOutput: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--max') {
      args.max = Number(argv[++index]);
    } else if (token === '--min-structural-n') {
      args.minStructuralN = Number(argv[++index]);
    } else if (token === '--row-sample-limit') {
      args.rowSampleLimit = Number(argv[++index]);
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
  if (!Number.isInteger(args.rowSampleLimit) || args.rowSampleLimit < 1) {
    throw new Error('--row-sample-limit must be a positive integer');
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

function hopcroftKarp(leftCount, rightCount, adjacency) {
  const pairLeft = new Int32Array(leftCount).fill(-1);
  const pairRight = new Int32Array(rightCount).fill(-1);
  const distance = new Int32Array(leftCount);
  let matching = 0;

  function bfs() {
    const queue = [];
    let foundFreeRight = false;
    for (let left = 0; left < leftCount; left += 1) {
      if (pairLeft[left] === -1) {
        distance[left] = 0;
        queue.push(left);
      } else {
        distance[left] = -1;
      }
    }
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const left = queue[cursor];
      for (const right of adjacency[left]) {
        const nextLeft = pairRight[right];
        if (nextLeft === -1) {
          foundFreeRight = true;
        } else if (distance[nextLeft] === -1) {
          distance[nextLeft] = distance[left] + 1;
          queue.push(nextLeft);
        }
      }
    }
    return foundFreeRight;
  }

  function dfs(left) {
    for (const right of adjacency[left]) {
      const nextLeft = pairRight[right];
      if (nextLeft === -1 || (distance[nextLeft] === distance[left] + 1 && dfs(nextLeft))) {
        pairLeft[left] = right;
        pairRight[right] = left;
        return true;
      }
    }
    distance[left] = -1;
    return false;
  }

  while (bfs()) {
    for (let left = 0; left < leftCount; left += 1) {
      if (pairLeft[left] === -1 && dfs(left)) {
        matching += 1;
      }
    }
  }

  return { matching, pairLeft, pairRight };
}

function buildBaseCrossCompatibility(side7Values, side18Values, primeSquares) {
  const side7IndexByValue = new Map(side7Values.map((value, index) => [value, index]));
  const side18IndexByValue = new Map(side18Values.map((value, index) => [value, index]));
  const side18Count = side18Values.length;
  const compatible = new Uint8Array(side7Values.length * side18Count);
  for (let left = 0; left < side7Values.length; left += 1) {
    for (let right = 0; right < side18Values.length; right += 1) {
      if (isNonSquarefree(side7Values[left] * side18Values[right] + 1, primeSquares)) {
        compatible[left * side18Count + right] = 1;
      }
    }
  }
  return {
    side7IndexByValue,
    side18IndexByValue,
    side18Count,
    compatible,
  };
}

function maximumCoBipartiteClique(side7, side18, crossCompatibility) {
  const missingCrossEdges = side7.map(() => []);
  const side7GlobalIndices = side7.map((value) => crossCompatibility.side7IndexByValue.get(value));
  const side18GlobalIndices = side18.map((value) => crossCompatibility.side18IndexByValue.get(value));
  for (let left = 0; left < side7.length; left += 1) {
    for (let right = 0; right < side18.length; right += 1) {
      const compatibleIndex = side7GlobalIndices[left] * crossCompatibility.side18Count + side18GlobalIndices[right];
      if (!crossCompatibility.compatible[compatibleIndex]) {
        missingCrossEdges[left].push(right);
      }
    }
  }

  const { matching, pairLeft, pairRight } = hopcroftKarp(side7.length, side18.length, missingCrossEdges);
  const visitedLeft = new Uint8Array(side7.length);
  const visitedRight = new Uint8Array(side18.length);
  const queue = [];
  for (let left = 0; left < side7.length; left += 1) {
    if (pairLeft[left] === -1) {
      visitedLeft[left] = 1;
      queue.push({ side: 'left', index: left });
    }
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const entry = queue[cursor];
    if (entry.side === 'left') {
      for (const right of missingCrossEdges[entry.index]) {
        if (pairLeft[entry.index] === right || visitedRight[right]) continue;
        visitedRight[right] = 1;
        queue.push({ side: 'right', index: right });
      }
    } else {
      const left = pairRight[entry.index];
      if (left !== -1 && !visitedLeft[left]) {
        visitedLeft[left] = 1;
        queue.push({ side: 'left', index: left });
      }
    }
  }

  const cliqueSide7 = [];
  const cliqueSide18 = [];
  for (let left = 0; left < side7.length; left += 1) {
    if (visitedLeft[left]) cliqueSide7.push(side7[left]);
  }
  for (let right = 0; right < side18.length; right += 1) {
    if (!visitedRight[right]) cliqueSide18.push(side18[right]);
  }

  return {
    cliqueSize: side7.length + side18.length - matching,
    matchingSize: matching,
    side7Count: side7.length,
    side18Count: side18.length,
    cliqueSide7Count: cliqueSide7.length,
    cliqueSide18Count: cliqueSide18.length,
    exampleClique: [...cliqueSide7, ...cliqueSide18].sort((left, right) => left - right),
  };
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

function evaluateStructuralRow(block, higherRootEventValues, baseSides, activeN) {
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
  const strictBaseThreshold = candidateSize - vMax - dMax - rGreater;

  return {
    N: activeN,
    p: block.root.p,
    p2: block.root.p2,
    rawPlus,
    rawMinus,
    vMax,
    activePlus,
    activeMinus,
    activeOutsiderCount: activePlus + activeMinus,
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
    strictBaseThreshold,
    side7Margin: candidateSize - side7Bound,
    side18Margin: candidateSize - side18Bound,
    unionMargin: candidateSize - unionBound,
    side7Pass: side7Bound < candidateSize,
    side18Pass: side18Bound < candidateSize,
    unionPass: unionBound < candidateSize,
  };
}

function exactMixedForOutsider(block, activeN, outsider, crossCompatibility) {
  const side7Compatible = block.side7CompatibleByValue.get(outsider) ?? [];
  const side18Compatible = block.side18CompatibleByValue.get(outsider) ?? [];
  const side7 = side7Compatible.slice(0, upperBound(side7Compatible, activeN));
  const side18 = side18Compatible.slice(0, upperBound(side18Compatible, activeN));
  return maximumCoBipartiteClique(side7, side18, crossCompatibility);
}

function evaluateMixedRow(block, row, crossCompatibility) {
  if (row.unionPass) {
    return {
      ...row,
      certificateMode: 'union_bound',
      threateningOutsiderCount: 0,
      exactMixedCheckCount: 0,
      sMaxMixed: null,
      sMaxMixedWitness: null,
      mixedBound: row.unionBound,
      mixedMargin: row.unionMargin,
      mixedPass: true,
      maxImprovementOverUnion: 0,
      threatSummaries: [],
    };
  }

  const threatening = [];
  for (const outsider of block.outsiderValues) {
    if (outsider > row.N) break;
    const unionCount = upperBound(block.unionCompatibleByValue.get(outsider) ?? [], row.N);
    if (unionCount >= row.strictBaseThreshold) {
      threatening.push({ outsider, unionCount });
    }
  }

  let sMaxMixed = 0;
  let sMaxMixedWitness = null;
  let worstThreat = null;
  let maxImprovementOverUnion = 0;
  const threatSummaries = [];
  for (const threat of threatening) {
    const mixed = exactMixedForOutsider(block, row.N, threat.outsider, crossCompatibility);
    const improvement = threat.unionCount - mixed.cliqueSize;
    const requiredMatchingLowerBound = mixed.side7Count + mixed.side18Count - row.strictBaseThreshold + 1;
    const smallerSideSize = Math.min(mixed.side7Count, mixed.side18Count);
    threatSummaries.push({
      outsider: threat.outsider,
      outsiderMod25: positiveModulo(threat.outsider, 25),
      unionCount: threat.unionCount,
      mixedBaseCliqueSize: mixed.cliqueSize,
      matchingSizeInMissingCrossGraph: mixed.matchingSize,
      compatibleSide7Count: mixed.side7Count,
      compatibleSide18Count: mixed.side18Count,
      requiredMatchingLowerBound,
      matchingSlack: mixed.matchingSize - requiredMatchingLowerBound,
      smallerSideSize,
      saturatesSmallerSide: mixed.matchingSize === smallerSideSize,
      mixedCliqueSide7Count: mixed.cliqueSide7Count,
      mixedCliqueSide18Count: mixed.cliqueSide18Count,
      dominantMixedCliqueSide: mixed.cliqueSide7Count > mixed.cliqueSide18Count
        ? 'side7'
        : mixed.cliqueSide18Count > mixed.cliqueSide7Count
          ? 'side18'
          : 'tie',
    });
    if (mixed.cliqueSize > sMaxMixed) {
      sMaxMixed = mixed.cliqueSize;
      sMaxMixedWitness = threat.outsider;
      worstThreat = {
        outsider: threat.outsider,
        unionCount: threat.unionCount,
        mixedBaseCliqueSize: mixed.cliqueSize,
        matchingSizeInMissingCrossGraph: mixed.matchingSize,
        compatibleSide7Count: mixed.side7Count,
        compatibleSide18Count: mixed.side18Count,
        mixedCliqueSide7Count: mixed.cliqueSide7Count,
        mixedCliqueSide18Count: mixed.cliqueSide18Count,
        exampleMixedBaseClique: mixed.exampleClique,
      };
    }
    if (improvement > maxImprovementOverUnion) {
      maxImprovementOverUnion = improvement;
    }
  }

  const mixedBound = sMaxMixed + row.vMax + row.dMax + row.rGreater;
  const mixedMargin = row.candidateSize - mixedBound;
  return {
    ...row,
    certificateMode: 'exact_mixed_base',
    threateningOutsiderCount: threatening.length,
    exactMixedCheckCount: threatening.length,
    sMaxMixed,
    sMaxMixedWitness,
    mixedBound,
    mixedMargin,
    mixedPass: mixedBound < row.candidateSize,
    maxImprovementOverUnion,
    threatSummaries,
    worstThreat,
  };
}

function dominantMixedCliqueSide(row) {
  const side7 = row.worstThreat?.mixedCliqueSide7Count ?? 0;
  const side18 = row.worstThreat?.mixedCliqueSide18Count ?? 0;
  if (side7 > side18) return 'side7';
  if (side18 > side7) return 'side18';
  if (side7 === 0 && side18 === 0) return 'none';
  return 'tie';
}

function compactLiftMiningRow(row) {
  const worstThreat = row.worstThreat ?? null;
  return {
    N: row.N,
    certificateMode: row.certificateMode,
    nMod25: positiveModulo(row.N, 25),
    p: row.p,
    p2: row.p2,
    rawPlus: row.rawPlus,
    rawMinus: row.rawMinus,
    vMax: row.vMax,
    activePlus: row.activePlus,
    activeMinus: row.activeMinus,
    activeOutsiderCount: row.activeOutsiderCount,
    dMax: row.dMax,
    dMaxWitnessSide: row.dMaxWitness?.side ?? null,
    dMaxWitnessValue: row.dMaxWitness?.value ?? null,
    rGreater: row.rGreater,
    candidateSize: row.candidateSize,
    strictBaseThreshold: row.strictBaseThreshold,
    side7Margin: row.side7Margin,
    side18Margin: row.side18Margin,
    unionMargin: row.unionMargin,
    mixedMargin: row.mixedMargin,
    sMaxMixed: row.sMaxMixed,
    sMaxMixedWitness: row.sMaxMixedWitness,
    sMaxMixedWitnessMod25: row.sMaxMixedWitness === null || row.sMaxMixedWitness === undefined
      ? null
      : positiveModulo(row.sMaxMixedWitness, 25),
    threateningOutsiderCount: row.threateningOutsiderCount,
    maxImprovementOverUnion: row.maxImprovementOverUnion,
    worstOutsider: worstThreat?.outsider ?? null,
    worstOutsiderMod25: worstThreat?.outsider === null || worstThreat?.outsider === undefined
      ? null
      : positiveModulo(worstThreat.outsider, 25),
    worstUnionCount: worstThreat?.unionCount ?? null,
    worstMixedCliqueSize: worstThreat?.mixedBaseCliqueSize ?? null,
    matchingSizeInMissingCrossGraph: worstThreat?.matchingSizeInMissingCrossGraph ?? null,
    compatibleSide7Count: worstThreat?.compatibleSide7Count ?? null,
    compatibleSide18Count: worstThreat?.compatibleSide18Count ?? null,
    mixedCliqueSide7Count: worstThreat?.mixedCliqueSide7Count ?? null,
    mixedCliqueSide18Count: worstThreat?.mixedCliqueSide18Count ?? null,
    threatMatchingSummary: summarizeThreatMatching(row),
    dominantMixedCliqueSide: dominantMixedCliqueSide(row),
  };
}

function summarizeThreatMatching(row) {
  const threats = row.threatSummaries ?? [];
  if (threats.length === 0) {
    return null;
  }
  const minRequiredMatchingLowerBound = Math.min(...threats.map((threat) => threat.requiredMatchingLowerBound));
  const maxRequiredMatchingLowerBound = Math.max(...threats.map((threat) => threat.requiredMatchingLowerBound));
  const minActualMatching = Math.min(...threats.map((threat) => threat.matchingSizeInMissingCrossGraph));
  const maxActualMatching = Math.max(...threats.map((threat) => threat.matchingSizeInMissingCrossGraph));
  const minMatchingSlack = Math.min(...threats.map((threat) => threat.matchingSlack));
  const tightestThreats = [...threats]
    .sort((left, right) => left.matchingSlack - right.matchingSlack || left.outsider - right.outsider)
    .slice(0, 5)
    .map((threat) => ({
      outsider: threat.outsider,
      outsiderMod25: threat.outsiderMod25,
      compatibleSide7Count: threat.compatibleSide7Count,
      compatibleSide18Count: threat.compatibleSide18Count,
      requiredMatchingLowerBound: threat.requiredMatchingLowerBound,
      matchingSizeInMissingCrossGraph: threat.matchingSizeInMissingCrossGraph,
      matchingSlack: threat.matchingSlack,
      saturatesSmallerSide: threat.saturatesSmallerSide,
      dominantMixedCliqueSide: threat.dominantMixedCliqueSide,
    }));

  return {
    threatCount: threats.length,
    minRequiredMatchingLowerBound,
    maxRequiredMatchingLowerBound,
    minActualMatching,
    maxActualMatching,
    minMatchingSlack,
    allThreatsMeetRequiredLowerBound: threats.every((threat) => threat.matchingSlack >= 0),
    allThreatsSaturateSmallerSide: threats.every((threat) => threat.saturatesSmallerSide),
    tightestThreats,
  };
}

function compactThreatMiningRows(row) {
  return (row.threatSummaries ?? []).map((threat) => ({
    N: row.N,
    certificateMode: row.certificateMode,
    nMod25: positiveModulo(row.N, 25),
    p: row.p,
    p2: row.p2,
    outsider: threat.outsider,
    outsiderMod25: threat.outsiderMod25,
    activePlus: row.activePlus,
    activeMinus: row.activeMinus,
    activeOutsiderCount: row.activeOutsiderCount,
    dMax: row.dMax,
    dMaxWitnessSide: row.dMaxWitness?.side ?? null,
    dMaxWitnessValue: row.dMaxWitness?.value ?? null,
    rGreater: row.rGreater,
    candidateSize: row.candidateSize,
    strictBaseThreshold: row.strictBaseThreshold,
    unionCount: threat.unionCount,
    mixedBaseCliqueSize: threat.mixedBaseCliqueSize,
    matchingSizeInMissingCrossGraph: threat.matchingSizeInMissingCrossGraph,
    compatibleSide7Count: threat.compatibleSide7Count,
    compatibleSide18Count: threat.compatibleSide18Count,
    requiredMatchingLowerBound: threat.requiredMatchingLowerBound,
    matchingSlack: threat.matchingSlack,
    smallerSideSize: threat.smallerSideSize,
    saturatesSmallerSide: threat.saturatesSmallerSide,
    mixedCliqueSide7Count: threat.mixedCliqueSide7Count,
    mixedCliqueSide18Count: threat.mixedCliqueSide18Count,
    dominantMixedCliqueSide: threat.dominantMixedCliqueSide,
  }));
}

function stripThreatSummaries(row) {
  if (!row) {
    return row;
  }
  const { threatSummaries, ...compactRow } = row;
  if (threatSummaries?.length > 0) {
    compactRow.threatMatchingSummary = summarizeThreatMatching(row);
  }
  return compactRow;
}

function betterWorst(left, right, key) {
  if (!left) return right;
  if (!right) return left;
  if (right[key] < left[key]) return right;
  if (right[key] === left[key] && right.N < left.N) return right;
  return left;
}

function analyze(maxN, minStructuralN, rowSampleLimit) {
  const roots = buildRootInfos(maxN);
  const primes = primeSieve(maxN);
  const primeSquares = primes.map((prime) => prime * prime);
  const side7Values = residueValues(maxN, 7);
  const side18Values = residueValues(maxN, 18);
  const baseSides = { side7Values, side18Values };
  const crossCompatibility = buildBaseCrossCompatibility(side7Values, side18Values, primeSquares);
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
  const exactRowsSample = [];
  const failureRowsSample = [];
  const liftMiningRows = [];
  const threatLiftMiningRows = [];
  let checkCount = 0;
  let unionCertifiedRowCount = 0;
  let exactMixedRowCount = 0;
  let threateningOutsiderCheckCount = 0;
  let mixedFailureCount = 0;
  let firstMixedFailure = null;
  let worstCertifiedRow = null;
  let worstExactMixedRow = null;
  let maxThreateningOutsidersInRow = 0;
  let maxImprovementOverUnion = 0;

  for (let rootIndex = 0; rootIndex < roots.length; rootIndex += 1) {
    const block = buildBlock(roots[rootIndex], rootIndex, roots, maxN, baseSides, primeSquares);
    let blockUnionCertifiedRowCount = 0;
    let blockExactMixedRowCount = 0;
    let blockThreateningOutsiderCheckCount = 0;
    let blockMixedFailureCount = 0;
    let blockWorstCertifiedRow = null;

    for (const activeN of breakpoints) {
      const structuralRow = evaluateStructuralRow(block, higherRootEventsByIndex[rootIndex], baseSides, activeN);
      const mixedRow = evaluateMixedRow(block, structuralRow, crossCompatibility);
      checkCount += 1;
      if (mixedRow.certificateMode === 'union_bound') {
        unionCertifiedRowCount += 1;
        blockUnionCertifiedRowCount += 1;
      } else {
        exactMixedRowCount += 1;
        blockExactMixedRowCount += 1;
        threateningOutsiderCheckCount += mixedRow.exactMixedCheckCount;
        blockThreateningOutsiderCheckCount += mixedRow.exactMixedCheckCount;
        maxThreateningOutsidersInRow = Math.max(maxThreateningOutsidersInRow, mixedRow.threateningOutsiderCount);
        maxImprovementOverUnion = Math.max(maxImprovementOverUnion, mixedRow.maxImprovementOverUnion);
        worstExactMixedRow = betterWorst(worstExactMixedRow, mixedRow, 'mixedMargin');
        liftMiningRows.push(compactLiftMiningRow(mixedRow));
        threatLiftMiningRows.push(...compactThreatMiningRows(mixedRow));
        if (exactRowsSample.length < rowSampleLimit) {
          exactRowsSample.push(mixedRow);
        }
      }
      worstCertifiedRow = betterWorst(worstCertifiedRow, mixedRow, 'mixedMargin');
      blockWorstCertifiedRow = betterWorst(blockWorstCertifiedRow, mixedRow, 'mixedMargin');
      if (!mixedRow.mixedPass) {
        mixedFailureCount += 1;
        blockMixedFailureCount += 1;
        firstMixedFailure ??= mixedRow;
        if (failureRowsSample.length < rowSampleLimit) {
          failureRowsSample.push(mixedRow);
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
      unionCertifiedRowCount: blockUnionCertifiedRowCount,
      exactMixedRowCount: blockExactMixedRowCount,
      threateningOutsiderCheckCount: blockThreateningOutsiderCheckCount,
      mixedFailureCount: blockMixedFailureCount,
      worstCertifiedRow: blockWorstCertifiedRow,
    });
  }

  const allMixedChecksPass = mixedFailureCount === 0;
  const status = allMixedChecksPass
    ? 'bounded_full_mixed_base_structural_verifier_certified'
    : 'bounded_full_mixed_base_structural_verifier_has_failures';

  return {
    schema: 'erdos.number_theory.p848_full_mixed_base_structural_verifier/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    method: 'bounded_outsider_clique_full_mixed_base_structural_verifier',
    status,
    parameters: {
      maxN,
      minStructuralN,
      rowSampleLimit,
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
      unionCertifiedRowCount,
      exactMixedRowCount,
      threateningOutsiderCheckCount,
      mixedFailureCount,
      allMixedChecksPass,
      minCertifiedMargin: worstCertifiedRow?.mixedMargin ?? null,
      minExactMixedMargin: worstExactMixedRow?.mixedMargin ?? null,
      maxThreateningOutsidersInRow,
      maxImprovementOverUnion,
      liftMiningRowCount: liftMiningRows.length,
      threatLiftMiningRowCount: threatLiftMiningRows.length,
    },
    firstMixedFailure: stripThreatSummaries(firstMixedFailure),
    worstCertifiedRow: stripThreatSummaries(worstCertifiedRow),
    worstExactMixedRow: stripThreatSummaries(worstExactMixedRow),
    blockSummaries: blockSummaries.map((block) => ({
      ...block,
      worstCertifiedRow: stripThreatSummaries(block.worstCertifiedRow),
    })),
    exactRowsSample: exactRowsSample.map(stripThreatSummaries),
    liftMiningRows,
    threatLiftMiningRows,
    failureRowsSample: failureRowsSample.map(stripThreatSummaries),
    boundary: {
      claimLevel: 'bounded_structural_certificate_not_all_N_proof',
      proofObligation: 'Every witness-prime block and structural breakpoint in the assessed range is certified either by the safe union bound or by exact mixed-base clique checks for every threatening active outsider.',
      cliqueReduction: 'For a fixed outsider, the compatible base graph is two cliques, one on 7 mod 25 and one on 18 mod 25. Its maximum clique equals total compatible base vertices minus a maximum matching in the bipartite graph of missing cross-edges.',
      promotionRule: 'Promote bounded structural coverage only when allMixedChecksPass is true for the full assessed range and all artifact parameters match the intended handoff range.',
      nextUse: allMixedChecksPass
        ? 'Use this as the repo-owned bounded structural certificate and extend the assessed range or lift the finite-block argument.'
        : 'Inspect the first mixed failure before extending or lifting the structural verifier.',
    },
  };
}

function renderRow(row) {
  return row ? JSON.stringify(row) : '(none)';
}

function renderMarkdown(packet) {
  const lines = [
    '# Problem 848 Full Mixed-Base Structural Verifier',
    '',
    `- Generated: ${packet.generatedAt}`,
    `- Method: \`${packet.method}\``,
    `- Status: \`${packet.status}\``,
    `- Assessed range: \`${packet.summary.assessedRange}\``,
    `- Witness blocks: \`${packet.summary.witnessBlockCount}\``,
    `- Breakpoints: \`${packet.summary.breakpointCount}\``,
    `- Structural rows checked: \`${packet.summary.checkCount}\``,
    `- Rows certified by union bound: \`${packet.summary.unionCertifiedRowCount}\``,
    `- Rows requiring exact mixed-base checks: \`${packet.summary.exactMixedRowCount}\``,
    `- Compact lift-mining rows: \`${packet.summary.liftMiningRowCount ?? '(unknown)'}\``,
    `- Compact threatening-outsider rows: \`${packet.summary.threatLiftMiningRowCount ?? '(unknown)'}\``,
    `- Threatening outsider checks: \`${packet.summary.threateningOutsiderCheckCount}\``,
    '',
    '## Pass/Fail Summary',
    '',
    `- All mixed checks pass: \`${packet.summary.allMixedChecksPass ? 'yes' : 'no'}\``,
    `- Mixed failures: \`${packet.summary.mixedFailureCount}\``,
    `- Minimum certified margin: \`${packet.summary.minCertifiedMargin ?? '(none)'}\``,
    `- Minimum exact mixed margin: \`${packet.summary.minExactMixedMargin ?? '(none)'}\``,
    `- Max threatening outsiders in one row: \`${packet.summary.maxThreateningOutsidersInRow}\``,
    `- Max improvement over union: \`${packet.summary.maxImprovementOverUnion}\``,
    '',
    '## Key Rows',
    '',
    `- First mixed failure: \`${renderRow(packet.firstMixedFailure)}\``,
    `- Worst certified row: \`${renderRow(packet.worstCertifiedRow)}\``,
    `- Worst exact mixed row: \`${renderRow(packet.worstExactMixedRow)}\``,
    '',
    '## Boundary',
    '',
    `- Claim level: \`${packet.boundary.claimLevel}\``,
    `- Proof obligation: ${packet.boundary.proofObligation}`,
    `- Clique reduction: ${packet.boundary.cliqueReduction}`,
    `- Promotion rule: ${packet.boundary.promotionRule}`,
    `- Next use: ${packet.boundary.nextUse}`,
    '',
  ];

  return lines.join('\n');
}

const args = parseArgs(process.argv.slice(2));
const packet = analyze(args.max, args.minStructuralN, args.rowSampleLimit);

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
}

if (args.markdownOutput) {
  fs.mkdirSync(path.dirname(args.markdownOutput), { recursive: true });
  fs.writeFileSync(args.markdownOutput, renderMarkdown(packet));
}

console.log(JSON.stringify(packet.summary, null, 2));
