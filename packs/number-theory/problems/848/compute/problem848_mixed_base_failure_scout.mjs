#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    structuralJson: path.resolve('packs/number-theory/problems/848/STRUCTURAL_TWO_SIDE_SCOUT.json'),
    maxRows: 40,
    jsonOutput: null,
    markdownOutput: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--structural-json') {
      args.structuralJson = path.resolve(argv[++index]);
    } else if (token === '--max-rows') {
      args.maxRows = Number(argv[++index]);
    } else if (token === '--json-output') {
      args.jsonOutput = argv[++index];
    } else if (token === '--markdown-output') {
      args.markdownOutput = argv[++index];
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (!Number.isInteger(args.maxRows) || args.maxRows < 1) {
    throw new Error('--max-rows must be a positive integer');
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
  for (let value = residue; value <= max; value += 25) {
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

function maximumClique(vertices, adjacency, seedCliqueValues = []) {
  const indexByValue = new Map(vertices.map((value, index) => [value, index]));
  const seedClique = seedCliqueValues
    .map((value) => indexByValue.get(value))
    .filter((index) => index !== undefined);
  let best = seedClique;
  const degrees = adjacency.map((bits) => {
    let degree = 0;
    for (let index = 0; index < vertices.length; index += 1) {
      if (hasBit(bits, index)) degree += 1;
    }
    return degree;
  });

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
    for (let index = ordered.length - 1; index >= 0; index -= 1) {
      if (clique.length + colors[index] <= best.length) return;
      const vertex = ordered[index];
      const nextCandidates = [];
      for (let next = 0; next < index; next += 1) {
        const candidate = ordered[next];
        if (adjacent(vertex, candidate)) nextCandidates.push(candidate);
      }
      expand([...clique, vertex], nextCandidates);
    }
  }

  expand([], Array.from({ length: vertices.length }, (_, index) => index));
  return best.map((index) => vertices[index]).sort((left, right) => left - right);
}

function buildMixedBaseGraph(N, outsider, primeSquares) {
  const side7 = residueValues(N, 7).filter((value) => isNonSquarefree(outsider * value + 1, primeSquares));
  const side18 = residueValues(N, 18).filter((value) => isNonSquarefree(outsider * value + 1, primeSquares));
  const vertices = [...side7, ...side18].sort((left, right) => left - right);
  const sideByValue = new Map([
    ...side7.map((value) => [value, 7]),
    ...side18.map((value) => [value, 18]),
  ]);
  const wordCount = Math.ceil(vertices.length / 32);
  const adjacency = Array.from({ length: vertices.length }, () => new Uint32Array(wordCount));

  for (let left = 0; left < vertices.length; left += 1) {
    for (let right = left + 1; right < vertices.length; right += 1) {
      const samePrincipalSide = sideByValue.get(vertices[left]) === sideByValue.get(vertices[right]);
      if (samePrincipalSide || isNonSquarefree(vertices[left] * vertices[right] + 1, primeSquares)) {
        setBit(adjacency[left], right);
        setBit(adjacency[right], left);
      }
    }
  }

  return {
    vertices,
    side7,
    side18,
    adjacency,
  };
}

function collectRows(structuralScout, maxRows) {
  const rows = [];
  const seen = new Set();
  function add(row, source) {
    if (!row?.N || !row?.p || !row?.sMaxUnionWitness) return;
    const key = `${row.N}:${row.p}:${row.sMaxUnionWitness}`;
    if (seen.has(key)) return;
    seen.add(key);
    rows.push({ ...row, source });
  }

  add(structuralScout.firstFailures?.union, 'first_union_failure');
  add(structuralScout.worstRows?.union, 'worst_union_row');
  for (const block of structuralScout.blockSummaries ?? []) {
    add(block.firstUnionFailure, `block_${block.p}_first_union_failure`);
    add(block.worstUnionRow, `block_${block.p}_worst_union_row`);
  }
  for (const row of structuralScout.failureRowsSample ?? []) {
    add(row, 'failure_sample');
    if (rows.length >= maxRows) break;
  }
  return rows.slice(0, maxRows);
}

function analyze(structuralJson, maxRows) {
  const structuralScout = JSON.parse(fs.readFileSync(structuralJson, 'utf8'));
  const maxN = Number(structuralScout.parameters?.maxN ?? 0);
  if (!Number.isInteger(maxN) || maxN < 1) {
    throw new Error('Structural scout is missing parameters.maxN');
  }
  const primeSquares = primeSieve(maxN).map((prime) => prime * prime);
  const rows = collectRows(structuralScout, maxRows);
  const analyses = rows.map((row) => {
    const graph = buildMixedBaseGraph(row.N, row.sMaxUnionWitness, primeSquares);
    const sideSeed = graph.side7.length >= graph.side18.length ? graph.side7 : graph.side18;
    const clique = maximumClique(graph.vertices, graph.adjacency, sideSeed);
    const side7Members = clique.filter((value) => value % 25 === 7);
    const side18Members = clique.filter((value) => value % 25 === 18);
    const mixedBound = clique.length + row.vMax + row.dMax + row.rGreater;
    const mixedMargin = row.candidateSize - mixedBound;
    return {
      source: row.source,
      N: row.N,
      p: row.p,
      outsider: row.sMaxUnionWitness,
      candidateSize: row.candidateSize,
      sMaxSide7: row.sMaxSide7,
      sMaxSide18: row.sMaxSide18,
      sMaxUnion: row.sMaxUnion,
      mixedBaseCliqueSize: clique.length,
      mixedBaseSide7Count: side7Members.length,
      mixedBaseSide18Count: side18Members.length,
      mixedBaseCliqueMatchesSingleSide: sameSortedSet(clique, graph.side7) || sameSortedSet(clique, graph.side18),
      mixedBound,
      mixedMargin,
      mixedPass: mixedBound < row.candidateSize,
      originalUnionMargin: row.unionMargin,
      improvementOverUnion: row.sMaxUnion - clique.length,
      vMax: row.vMax,
      dMax: row.dMax,
      rGreater: row.rGreater,
      exampleMixedBaseClique: clique,
    };
  });

  const failingAnalyses = analyses.filter((row) => !row.mixedPass);
  const status = analyses.length === 0
    ? 'no_union_failures_to_analyze'
    : failingAnalyses.length === 0
      ? 'sampled_union_failures_repaired_by_mixed_base_clique'
      : 'mixed_base_clique_still_fails_sampled_rows';

  return {
    schema: 'erdos.number_theory.p848_mixed_base_failure_scout/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    method: 'exact_mixed_base_clique_on_structural_union_failures',
    status,
    sourceStructuralJson: structuralJson,
    parameters: {
      maxRows,
      structuralAssessedRange: structuralScout.summary?.assessedRange ?? null,
      structuralStatus: structuralScout.status ?? null,
    },
    summary: {
      analyzedRowCount: analyses.length,
      mixedPassCount: analyses.filter((row) => row.mixedPass).length,
      mixedFailureCount: failingAnalyses.length,
      allAnalyzedRowsMixedPass: failingAnalyses.length === 0,
      minMixedMargin: analyses.reduce((minimum, row) => Math.min(minimum, row.mixedMargin), Infinity),
      maxImprovementOverUnion: analyses.reduce((maximum, row) => Math.max(maximum, row.improvementOverUnion), 0),
    },
    firstMixedFailure: failingAnalyses[0] ?? null,
    worstMixedRow: analyses.reduce((worst, row) => {
      if (!worst || row.mixedMargin < worst.mixedMargin) return row;
      return worst;
    }, null),
    analyses,
    boundary: {
      claimLevel: 'sampled_failure_scout_not_full_structural_certificate',
      note: 'This scout exactly solves the mixed-base clique on selected union-failure rows from the two-sided structural scout. It does not yet certify every structural breakpoint.',
      nextUse: failingAnalyses.length === 0
        ? 'Promote this into the full two-sided structural verifier by replacing the union-base overcount with the exact mixed-base clique bound at every breakpoint.'
        : 'Inspect the remaining mixed-base failures before trying to promote a mixed-base lemma.',
    },
  };
}

function renderMarkdown(packet) {
  const lines = [
    '# Problem 848 Mixed-Base Failure Scout',
    '',
    `- Generated: ${packet.generatedAt}`,
    `- Method: \`${packet.method}\``,
    `- Status: \`${packet.status}\``,
    `- Source structural scout: \`${packet.sourceStructuralJson}\``,
    `- Analyzed rows: \`${packet.summary.analyzedRowCount}\``,
    `- Mixed failures: \`${packet.summary.mixedFailureCount}\``,
    `- Minimum mixed margin: \`${Number.isFinite(packet.summary.minMixedMargin) ? packet.summary.minMixedMargin : '(none)'}\``,
    `- Max improvement over union: \`${packet.summary.maxImprovementOverUnion}\``,
    '',
    '## Worst Mixed Row',
    '',
    `- \`${packet.worstMixedRow ? JSON.stringify(packet.worstMixedRow) : '(none)'}\``,
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
const packet = analyze(args.structuralJson, args.maxRows);

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
}

if (args.markdownOutput) {
  fs.mkdirSync(path.dirname(args.markdownOutput), { recursive: true });
  fs.writeFileSync(args.markdownOutput, renderMarkdown(packet));
}

console.log(JSON.stringify(packet.summary, null, 2));
