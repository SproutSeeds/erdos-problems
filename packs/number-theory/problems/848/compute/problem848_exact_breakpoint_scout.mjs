#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = { results: null, jsonOutput: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--results') {
      args.results = argv[++i];
    } else if (token === '--json-output') {
      args.jsonOutput = argv[++i];
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }
  if (!args.results) {
    throw new Error('--results is required');
  }
  return args;
}

function exampleClass(row) {
  if (row.exampleMatchesResidue7 && row.exampleMatchesResidue18) return '7_or_18';
  if (row.exampleMatchesResidue7) return '7';
  if (row.exampleMatchesResidue18) return '18';
  return 'other';
}

function rowSignature(row) {
  return [
    row.maxCliqueSize,
    row.residue7Size,
    row.residue18Size,
    exampleClass(row),
  ].join('/');
}

function pushPlateau(plateaus, current) {
  if (!current) return;
  plateaus.push({
    startN: current.startN,
    endN: current.endN,
    length: current.endN - current.startN + 1,
    signature: current.signature,
    maxCliqueSize: current.maxCliqueSize,
    residue7Size: current.residue7Size,
    residue18Size: current.residue18Size,
    exampleClass: current.exampleClass,
  });
}

function buildPlateaus(rows) {
  const plateaus = [];
  let current = null;
  for (const row of rows) {
    const signature = rowSignature(row);
    if (!current || current.signature !== signature || row.N !== current.endN + 1) {
      pushPlateau(plateaus, current);
      current = {
        startN: row.N,
        endN: row.N,
        signature,
        maxCliqueSize: row.maxCliqueSize,
        residue7Size: row.residue7Size,
        residue18Size: row.residue18Size,
        exampleClass: exampleClass(row),
      };
    } else {
      current.endN = row.N;
    }
  }
  pushPlateau(plateaus, current);
  return plateaus;
}

function countBy(values) {
  return Object.fromEntries([...new Set(values)]
    .sort((left, right) => Number(left) - Number(right))
    .map((value) => [String(value), values.filter((candidate) => candidate === value).length]));
}

function analyze(resultsPath) {
  const payload = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  const rows = Array.isArray(payload.results) ? payload.results : [];
  const seen = new Set();
  let duplicateCount = 0;
  let sorted = true;
  let previousN = 0;
  for (const row of rows) {
    if (seen.has(row.N)) duplicateCount += 1;
    seen.add(row.N);
    if (row.N !== previousN + 1) sorted = false;
    previousN = row.N;
  }

  const plateaus = buildPlateaus(rows);
  const breakpointNs = plateaus.slice(1).map((plateau) => plateau.startN);
  const breakpointGaps = breakpointNs.map((value, index) => (
    index === 0 ? value - plateaus[0].startN : value - breakpointNs[index - 1]
  ));

  return {
    generatedAt: new Date().toISOString(),
    method: 'exact_rows_breakpoint_scout',
    problemId: '848',
    sourceResultsPath: path.resolve(resultsPath),
    sourceSummary: payload.summary ?? null,
    summary: {
      interval: payload.summary?.interval ?? (rows.length > 0 ? `${rows[0].N}..${rows.at(-1).N}` : null),
      rowCount: rows.length,
      uniqueNCount: seen.size,
      duplicateCount,
      sortedContiguousFromOne: sorted && rows[0]?.N === 1,
      allCandidateAchievesMaximum: rows.every((row) => row.candidateAchievesMaximum === true),
      allExampleCliquesMatchCandidateClass: rows.every((row) => row.exampleMatchesResidue7 || row.exampleMatchesResidue18),
      plateauCount: plateaus.length,
      breakpointCount: breakpointNs.length,
      breakpointGapFrequency: countBy(breakpointGaps),
    },
    plateaus,
    breakpointNs,
    boundary: {
      claimLevel: 'scout_not_proof',
      note: 'This artifact summarizes already-certified exact rows. It does not prove coverage between unchecked rows or replace a Regime B monotonicity/breakpoint lemma.',
      nextUse: 'Use the plateau and breakpoint pattern to propose a structured-breakpoint certificate with an explicit monotonicity justification.',
    },
  };
}

const args = parseArgs(process.argv.slice(2));
const packet = analyze(args.results);

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
}

console.log(JSON.stringify(packet.summary, null, 2));
