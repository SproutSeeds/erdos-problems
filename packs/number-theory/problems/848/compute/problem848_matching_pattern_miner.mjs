#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const problemDir = path.resolve(scriptDir, '..');

function parseArgs(argv) {
  const args = {
    verifierJson: path.join(problemDir, 'FULL_MIXED_BASE_STRUCTURAL_VERIFIER.json'),
    prime: 13,
    topRows: 12,
    pairSampleLimit: 24,
    jsonOutput: null,
    markdownOutput: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--verifier-json') {
      args.verifierJson = argv[++index];
    } else if (token === '--prime') {
      args.prime = Number(argv[++index]);
    } else if (token === '--top-rows') {
      args.topRows = Number(argv[++index]);
    } else if (token === '--pair-sample-limit') {
      args.pairSampleLimit = Number(argv[++index]);
    } else if (token === '--json-output') {
      args.jsonOutput = argv[++index];
    } else if (token === '--markdown-output') {
      args.markdownOutput = argv[++index];
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (!args.verifierJson) {
    throw new Error('--verifier-json is required');
  }
  if (!Number.isInteger(args.prime) || args.prime < 2) {
    throw new Error('--prime must be a prime integer');
  }
  if (!Number.isInteger(args.topRows) || args.topRows < 1) {
    throw new Error('--top-rows must be a positive integer');
  }
  if (!Number.isInteger(args.pairSampleLimit) || args.pairSampleLimit < 1) {
    throw new Error('--pair-sample-limit must be a positive integer');
  }
  return args;
}

function positiveModulo(value, modulus) {
  const residue = Number(value) % modulus;
  return residue < 0 ? residue + modulus : residue;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

function residueValues(max, residue, modulus = 25) {
  const values = [];
  for (let value = residue; value <= max; value += modulus) {
    if (value >= 1) values.push(value);
  }
  return values;
}

function isNonSquarefree(value, primeSquares) {
  for (const square of primeSquares) {
    if (square > value) break;
    if (value % square === 0) return true;
  }
  return false;
}

function compatibleValues(outsider, candidates, activeN, primeSquares) {
  const values = [];
  for (const candidate of candidates) {
    if (candidate > activeN) break;
    if (isNonSquarefree(outsider * candidate + 1, primeSquares)) {
      values.push(candidate);
    }
  }
  return values;
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

function countBy(values, keyFn) {
  const counts = new Map();
  for (const value of values) {
    const key = keyFn(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((left, right) => right.count - left.count || String(left.key).localeCompare(String(right.key)));
}

function minValue(values) {
  return values.length === 0 ? null : Math.min(...values);
}

function maxValue(values) {
  return values.length === 0 ? null : Math.max(...values);
}

function buildMissingCrossGraph(side7, side18, primeSquares) {
  const adjacency = side7.map(() => []);
  let missingCrossEdgeCount = 0;
  let compatibleCrossEdgeCount = 0;

  for (let left = 0; left < side7.length; left += 1) {
    for (let right = 0; right < side18.length; right += 1) {
      if (isNonSquarefree(side7[left] * side18[right] + 1, primeSquares)) {
        compatibleCrossEdgeCount += 1;
      } else {
        adjacency[left].push(right);
        missingCrossEdgeCount += 1;
      }
    }
  }

  return {
    adjacency,
    missingCrossEdgeCount,
    compatibleCrossEdgeCount,
  };
}

function compactPair(leftValue, rightValue, p, p2) {
  return {
    leftValue,
    rightValue,
    leftMod25: positiveModulo(leftValue, 25),
    rightMod25: positiveModulo(rightValue, 25),
    leftModP2: positiveModulo(leftValue, p2),
    rightModP2: positiveModulo(rightValue, p2),
    leftModP: positiveModulo(leftValue, p),
    rightModP: positiveModulo(rightValue, p),
    productPlusOneModP2: positiveModulo(leftValue * rightValue + 1, p2),
  };
}

function buildMatchingWitness(row, baseSides, primeSquares, pairSampleLimit) {
  const p = Number(row.p);
  const p2 = p * p;
  const side7 = compatibleValues(Number(row.outsider), baseSides.side7Values, Number(row.N), primeSquares);
  const side18 = compatibleValues(Number(row.outsider), baseSides.side18Values, Number(row.N), primeSquares);
  const graph = buildMissingCrossGraph(side7, side18, primeSquares);
  const matching = hopcroftKarp(side7.length, side18.length, graph.adjacency);
  const pairs = [];
  for (let left = 0; left < matching.pairLeft.length; left += 1) {
    const right = matching.pairLeft[left];
    if (right !== -1) {
      pairs.push(compactPair(side7[left], side18[right], p, p2));
    }
  }
  pairs.sort((left, right) => left.leftValue - right.leftValue || left.rightValue - right.rightValue);

  const smallerSide = side7.length <= side18.length ? 'side7' : 'side18';
  const largerSide = smallerSide === 'side7' ? 'side18' : 'side7';
  const smallerSideSize = Math.min(side7.length, side18.length);
  const largerSideSize = Math.max(side7.length, side18.length);
  const requiredMatchingLowerBound = Number(row.requiredMatchingLowerBound);
  const matchingSlack = matching.matching - requiredMatchingLowerBound;
  const matchedLeftValues = new Set(pairs.map((pair) => pair.leftValue));
  const matchedRightValues = new Set(pairs.map((pair) => pair.rightValue));
  const matchedSmallerSideValues = smallerSide === 'side7'
    ? side7.filter((value) => matchedLeftValues.has(value))
    : side18.filter((value) => matchedRightValues.has(value));
  const unmatchedLargerSideValues = largerSide === 'side7'
    ? side7.filter((value) => !matchedLeftValues.has(value))
    : side18.filter((value) => !matchedRightValues.has(value));

  return {
    N: Number(row.N),
    p,
    p2,
    outsider: Number(row.outsider),
    outsiderMod25: positiveModulo(row.outsider, 25),
    outsiderModP2: positiveModulo(row.outsider, p2),
    strictBaseThreshold: Number(row.strictBaseThreshold),
    requiredMatchingLowerBound,
    verifierMatchingSize: Number(row.matchingSizeInMissingCrossGraph),
    reconstructedMatchingSize: matching.matching,
    verifierAndReconstructionAgree: matching.matching === Number(row.matchingSizeInMissingCrossGraph),
    matchingSlack,
    side7Count: side7.length,
    side18Count: side18.length,
    smallerSide,
    largerSide,
    smallerSideSize,
    largerSideSize,
    saturatesSmallerSide: matching.matching === smallerSideSize,
    matchedSmallerSideCount: matchedSmallerSideValues.length,
    unmatchedSmallerSideCount: smallerSideSize - matchedSmallerSideValues.length,
    unmatchedLargerSideCount: largerSideSize - matching.matching,
    missingCrossEdgeCount: graph.missingCrossEdgeCount,
    compatibleCrossEdgeCount: graph.compatibleCrossEdgeCount,
    matchingPairResidueProfiles: {
      modulo25: countBy(pairs, (pair) => `${pair.leftMod25}:${pair.rightMod25}`),
      moduloP: countBy(pairs, (pair) => `${pair.leftModP}:${pair.rightModP}`),
      moduloP2: countBy(pairs, (pair) => `${pair.leftModP2}:${pair.rightModP2}`).slice(0, 24),
      productPlusOneModuloP2: countBy(pairs, (pair) => pair.productPlusOneModP2).slice(0, 24),
    },
    matchedSmallerSideResidues: {
      modulo25: countBy(matchedSmallerSideValues, (value) => positiveModulo(value, 25)),
      moduloP: countBy(matchedSmallerSideValues, (value) => positiveModulo(value, p)),
      moduloP2: countBy(matchedSmallerSideValues, (value) => positiveModulo(value, p2)).slice(0, 24),
    },
    unmatchedLargerSideResidues: {
      modulo25: countBy(unmatchedLargerSideValues, (value) => positiveModulo(value, 25)),
      moduloP: countBy(unmatchedLargerSideValues, (value) => positiveModulo(value, p)),
      moduloP2: countBy(unmatchedLargerSideValues, (value) => positiveModulo(value, p2)).slice(0, 24),
    },
    matchingPairsForMining: pairs,
    matchingPairSample: pairs.slice(0, pairSampleLimit),
  };
}

function chooseTargetRows(verifier, prime, topRows) {
  return (verifier.threatLiftMiningRows ?? [])
    .filter((row) => row?.certificateMode === 'exact_mixed_base')
    .filter((row) => Number(row.p) === prime)
    .sort((left, right) => (
      Number(left.matchingSlack) - Number(right.matchingSlack)
      || Number(right.requiredMatchingLowerBound) - Number(left.requiredMatchingLowerBound)
      || Number(left.N) - Number(right.N)
      || Number(left.outsider) - Number(right.outsider)
    ))
    .slice(0, topRows);
}

function summarizeWitnesses(witnesses) {
  return {
    witnessRowCount: witnesses.length,
    allReconstructedMatchesAgree: witnesses.every((witness) => witness.verifierAndReconstructionAgree),
    allWitnessesMeetRequiredMatchingLowerBound: witnesses.every((witness) => witness.reconstructedMatchingSize >= witness.requiredMatchingLowerBound),
    allWitnessesSaturateSmallerSide: witnesses.every((witness) => witness.saturatesSmallerSide),
    minRequiredMatchingLowerBound: minValue(witnesses.map((witness) => witness.requiredMatchingLowerBound).filter(Number.isFinite)),
    maxRequiredMatchingLowerBound: maxValue(witnesses.map((witness) => witness.requiredMatchingLowerBound).filter(Number.isFinite)),
    minReconstructedMatchingSize: minValue(witnesses.map((witness) => witness.reconstructedMatchingSize).filter(Number.isFinite)),
    maxReconstructedMatchingSize: maxValue(witnesses.map((witness) => witness.reconstructedMatchingSize).filter(Number.isFinite)),
    minMatchingSlack: minValue(witnesses.map((witness) => witness.matchingSlack).filter(Number.isFinite)),
    saturatedSideDistribution: countBy(witnesses, (witness) => witness.smallerSide),
    outsiderMod25Distribution: countBy(witnesses, (witness) => witness.outsiderMod25),
    outsiderModP2Distribution: countBy(witnesses, (witness) => witness.outsiderModP2),
  };
}

function pairKey(pair) {
  return `${pair.leftValue}:${pair.rightValue}`;
}

function commonPairsForWitnesses(witnesses) {
  if (witnesses.length === 0) {
    return [];
  }
  const commonPairKeys = witnesses.slice(1).reduce((commonKeys, witness) => {
    const rowKeys = new Set((witness.matchingPairsForMining ?? []).map(pairKey));
    return new Set([...commonKeys].filter((key) => rowKeys.has(key)));
  }, new Set((witnesses[0]?.matchingPairsForMining ?? []).map(pairKey)));
  const pairByKey = new Map();
  for (const pair of witnesses.flatMap((witness) => witness.matchingPairsForMining ?? [])) {
    pairByKey.set(pairKey(pair), pair);
  }
  return [...commonPairKeys]
    .map((key) => pairByKey.get(key))
    .filter(Boolean)
    .sort((left, right) => left.leftValue - right.leftValue || left.rightValue - right.rightValue);
}

function groupBy(values, keyFn) {
  const groups = new Map();
  for (const value of values) {
    const key = keyFn(value);
    const group = groups.get(key) ?? [];
    group.push(value);
    groups.set(key, group);
  }
  return groups;
}

function buildPatternSummary(witnesses, pairSampleLimit) {
  const allPairs = witnesses.flatMap((witness) => witness.matchingPairsForMining ?? []);
  const p2 = witnesses[0]?.p2 ?? 1;
  const commonPairs = commonPairsForWitnesses(witnesses);
  const groupedByOutsider = countBy(witnesses, (witness) => `${witness.outsiderModP2}:${witness.outsiderMod25}`);
  const splitProfiles = [...groupBy(
    witnesses,
    (witness) => `outP2=${witness.outsiderModP2}|out25=${witness.outsiderMod25}|smaller=${witness.smallerSide}`,
  ).entries()].map(([groupKey, groupWitnesses]) => {
    const groupPairs = groupWitnesses.flatMap((witness) => witness.matchingPairsForMining ?? []);
    const groupCommonPairs = commonPairsForWitnesses(groupWitnesses);
    const minRequiredMatchingLowerBound = minValue(groupWitnesses
      .map((witness) => witness.requiredMatchingLowerBound)
      .filter(Number.isFinite));
    const maxRequiredMatchingLowerBound = maxValue(groupWitnesses
      .map((witness) => witness.requiredMatchingLowerBound)
      .filter(Number.isFinite));
    const minReconstructedMatchingSize = minValue(groupWitnesses
      .map((witness) => witness.reconstructedMatchingSize)
      .filter(Number.isFinite));
    const maxReconstructedMatchingSize = maxValue(groupWitnesses
      .map((witness) => witness.reconstructedMatchingSize)
      .filter(Number.isFinite));
    const minSmallerSideSize = minValue(groupWitnesses
      .map((witness) => witness.smallerSideSize)
      .filter(Number.isFinite));
    const maxSmallerSideSize = maxValue(groupWitnesses
      .map((witness) => witness.smallerSideSize)
      .filter(Number.isFinite));
    return {
      groupKey,
      witnessCount: groupWitnesses.length,
      minN: minValue(groupWitnesses.map((witness) => witness.N)),
      maxN: maxValue(groupWitnesses.map((witness) => witness.N)),
      minRequiredMatchingLowerBound,
      maxRequiredMatchingLowerBound,
      minReconstructedMatchingSize,
      maxReconstructedMatchingSize,
      minSmallerSideSize,
      maxSmallerSideSize,
      minMatchingSlack: minValue(groupWitnesses.map((witness) => witness.matchingSlack).filter(Number.isFinite)),
      commonMatchingPairCount: groupCommonPairs.length,
      commonCoreMeetsMaxRequiredBound: Number.isFinite(maxRequiredMatchingLowerBound)
        && groupCommonPairs.length >= maxRequiredMatchingLowerBound,
      commonCoreSaturatesMinSmallerSide: Number.isFinite(minSmallerSideSize)
        && groupCommonPairs.length >= minSmallerSideSize,
      commonMatchingPairs: groupCommonPairs,
      commonMatchingPairExportComplete: true,
      commonMatchingPairSample: groupCommonPairs.slice(0, pairSampleLimit),
      rightMinusLeftModuloP2Distribution: countBy(groupPairs, (pair) => positiveModulo(pair.rightValue - pair.leftValue, p2)).slice(0, 12),
    };
  }).sort((left, right) => (
    right.witnessCount - left.witnessCount
    || left.minMatchingSlack - right.minMatchingSlack
    || left.groupKey.localeCompare(right.groupKey)
  ));

  return {
    totalWitnessMatchingPairs: allPairs.length,
    commonMatchingPairCountAcrossWitnesses: commonPairs.length,
    commonMatchingPairsAcrossWitnesses: commonPairs,
    commonMatchingPairExportCompleteAcrossWitnesses: true,
    commonMatchingPairSample: commonPairs.slice(0, pairSampleLimit),
    outsiderResidueGroups: groupedByOutsider,
    splitProfiles,
    allSplitCommonCoresMeetMaxRequiredBound: splitProfiles.every((profile) => profile.commonCoreMeetsMaxRequiredBound),
    allSplitCommonCoresSaturateMinSmallerSide: splitProfiles.every((profile) => profile.commonCoreSaturatesMinSmallerSide),
    rightMinusLeftDistribution: countBy(allPairs, (pair) => pair.rightValue - pair.leftValue).slice(0, 24),
    rightMinusLeftModuloP2Distribution: countBy(allPairs, (pair) => positiveModulo(pair.rightValue - pair.leftValue, p2)).slice(0, 24),
    productPlusOneModuloP2Distribution: countBy(allPairs, (pair) => pair.productPlusOneModP2).slice(0, 24),
    proofHeuristic: commonPairs.length > 0
      ? 'The tight-row witnesses share a nonempty stable matching core. Try proving saturation by extending this stable core across residue blocks, then handle boundary insertions separately.'
      : 'The tight-row witnesses do not share one common matching core; split the symbolic construction by outsider residue and saturated side.',
  };
}

function mine(args) {
  const verifier = readJson(args.verifierJson);
  const maxN = Number(verifier.parameters?.maxN ?? verifier.summary?.assessedRange?.split('..')?.[1] ?? 0);
  if (!Number.isInteger(maxN) || maxN < 1) {
    throw new Error('Could not infer maxN from verifier artifact');
  }
  const primes = primeSieve(maxN);
  const primeSquares = primes.map((prime) => prime * prime);
  const baseSides = {
    side7Values: residueValues(maxN, 7),
    side18Values: residueValues(maxN, 18),
  };
  const targetRows = chooseTargetRows(verifier, args.prime, args.topRows);
  const rawWitnesses = targetRows.map((row) => buildMatchingWitness(
    row,
    baseSides,
    primeSquares,
    args.pairSampleLimit,
  ));
  const patternSummary = buildPatternSummary(rawWitnesses, args.pairSampleLimit);
  const witnesses = rawWitnesses.map(({ matchingPairsForMining, ...witness }) => witness);
  const summary = summarizeWitnesses(witnesses);
  const status = witnesses.length === 0
    ? 'matching_pattern_miner_no_target_rows'
    : summary.allReconstructedMatchesAgree
      && summary.allWitnessesMeetRequiredMatchingLowerBound
      && summary.allWitnessesSaturateSmallerSide
      ? 'matching_pattern_witness_packet_ready'
      : 'matching_pattern_witness_packet_has_failures';

  return {
    schema: 'erdos.number_theory.p848_matching_pattern_miner/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    method: 'bounded_missing_cross_matching_pattern_mining',
    status,
    parameters: {
      verifierJsonPath: path.resolve(args.verifierJson),
      targetPrime: args.prime,
      topRows: args.topRows,
      pairSampleLimit: args.pairSampleLimit,
      sourceAssessedRange: verifier.summary?.assessedRange ?? verifier.parameters?.assessedRange ?? null,
    },
    sourceVerifier: {
      status: verifier.status ?? null,
      assessedRange: verifier.summary?.assessedRange ?? verifier.parameters?.assessedRange ?? null,
      threatLiftMiningRowCount: verifier.summary?.threatLiftMiningRowCount ?? verifier.threatLiftMiningRows?.length ?? null,
    },
    summary,
    patternSummary,
    witnesses,
    symbolicUse: {
      activeAtom: args.prime === 13 ? 'D2_p13_matching_lower_bound' : args.prime === 17 ? 'D3_p17_matching_lower_bound' : null,
      constructionTarget: 'Replace Hopcroft-Karp replay with a residue/block injection that saturates the smaller compatible side of H_{x,N}.',
      proofHint: 'Each witness records actual missing-cross matching pairs. A human/prover lane should look for a residue-parametric injection from the smaller compatible side into squarefree cross pairs.',
      nextExtractor: 'Generalize from these tight-row pair residues into a symbolic side-saturation lemma, then rerun this miner for any newly tight prime family.',
    },
    boundary: {
      claimLevel: 'bounded_pattern_witness_not_symbolic_proof',
      note: 'This artifact reconstructs matching witnesses for selected bounded threat rows. It does not certify rows outside the source verifier range and does not prove the all-N matching lemma.',
      promotionRule: 'Promote D2/D3 only after the observed matching pattern is replaced by a symbolic construction and checked against the structural-lift atom.',
    },
  };
}

function renderMarkdown(packet) {
  const lines = [
    '# Problem 848 Matching Pattern Miner',
    '',
    `- Generated: ${packet.generatedAt}`,
    `- Method: \`${packet.method}\``,
    `- Status: \`${packet.status}\``,
    `- Target prime: \`${packet.parameters.targetPrime}\``,
    `- Source range: \`${packet.parameters.sourceAssessedRange ?? '(unknown)'}\``,
    `- Witness rows: \`${packet.summary.witnessRowCount}\``,
    `- Reconstructed matches agree: \`${packet.summary.allReconstructedMatchesAgree ? 'yes' : 'no'}\``,
    `- Saturates smaller side: \`${packet.summary.allWitnessesSaturateSmallerSide ? 'yes' : 'no'}\``,
    `- K range: \`${packet.summary.minRequiredMatchingLowerBound ?? '(unknown)'}..${packet.summary.maxRequiredMatchingLowerBound ?? '(unknown)'}\``,
    `- Matching range: \`${packet.summary.minReconstructedMatchingSize ?? '(unknown)'}..${packet.summary.maxReconstructedMatchingSize ?? '(unknown)'}\``,
    `- Minimum slack: \`${packet.summary.minMatchingSlack ?? '(unknown)'}\``,
    `- Common matching core across witnesses: \`${packet.patternSummary.commonMatchingPairCountAcrossWitnesses}\``,
    '',
    '## Pattern Summary',
    '',
    `- Total witness matching pairs: \`${packet.patternSummary.totalWitnessMatchingPairs}\``,
    `- Outsider residue groups: \`${JSON.stringify(packet.patternSummary.outsiderResidueGroups)}\``,
    `- Top right-left deltas: \`${JSON.stringify(packet.patternSummary.rightMinusLeftDistribution.slice(0, 8))}\``,
    `- Top product+1 residues mod p^2: \`${JSON.stringify(packet.patternSummary.productPlusOneModuloP2Distribution.slice(0, 8))}\``,
    `- Proof heuristic: ${packet.patternSummary.proofHeuristic}`,
    '',
    '## Split Profiles',
    '',
  ];

  for (const profile of packet.patternSummary.splitProfiles.slice(0, 8)) {
    lines.push(`- \`${profile.groupKey}\`: witnesses ${profile.witnessCount}, N ${profile.minN}..${profile.maxN}, K ${profile.minRequiredMatchingLowerBound}..${profile.maxRequiredMatchingLowerBound}, min slack ${profile.minMatchingSlack}, common pairs ${profile.commonMatchingPairCount}, full core exported ${profile.commonMatchingPairExportComplete ? 'yes' : 'no'}, core >= max K ${profile.commonCoreMeetsMaxRequiredBound ? 'yes' : 'no'}`);
  }

  lines.push(
    '',
    '## Witness Rows',
    '',
  );

  for (const witness of packet.witnesses) {
    lines.push(`- N=${witness.N}, outsider=${witness.outsider}, K=${witness.requiredMatchingLowerBound}, matching=${witness.reconstructedMatchingSize}, slack=${witness.matchingSlack}, smaller=${witness.smallerSide}, unmatched larger=${witness.unmatchedLargerSideCount}`);
  }

  lines.push('', '## Tightest Pair Samples', '');
  for (const witness of packet.witnesses.slice(0, 3)) {
    lines.push(`- N=${witness.N}, outsider=${witness.outsider}: ${JSON.stringify(witness.matchingPairSample.slice(0, 8))}`);
  }

  lines.push('', '## Symbolic Use', '');
  lines.push(`- Active atom: \`${packet.symbolicUse.activeAtom ?? '(generic)'}\``);
  lines.push(`- Construction target: ${packet.symbolicUse.constructionTarget}`);
  lines.push(`- Proof hint: ${packet.symbolicUse.proofHint}`);
  lines.push('', '## Boundary', '');
  lines.push(`- Claim level: \`${packet.boundary.claimLevel}\``);
  lines.push(`- Note: ${packet.boundary.note}`);
  lines.push(`- Promotion rule: ${packet.boundary.promotionRule}`);
  lines.push('');
  return lines.join('\n');
}

const args = parseArgs(process.argv.slice(2));
const packet = mine(args);

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
}

if (args.markdownOutput) {
  fs.mkdirSync(path.dirname(args.markdownOutput), { recursive: true });
  fs.writeFileSync(args.markdownOutput, renderMarkdown(packet));
}

console.log(JSON.stringify(packet.summary, null, 2));
