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

function candidateSize(row) {
  return Math.max(Number(row.residue7Size), Number(row.residue18Size));
}

function candidateClass(row) {
  if (row.residue7Size > row.residue18Size) return '7_mod_25';
  if (row.residue18Size > row.residue7Size) return '18_mod_25';
  return '7_or_18_mod_25';
}

function buildCandidatePlateaus(rows) {
  const plateaus = [];
  let current = null;
  for (const row of rows) {
    const size = candidateSize(row);
    if (!current || current.candidateSize !== size || row.N !== current.endN + 1) {
      if (current) plateaus.push(current);
      current = {
        startN: row.N,
        endN: row.N,
        candidateSize: size,
        candidateClassAtEnd: candidateClass(row),
      };
    } else {
      current.endN = row.N;
      current.candidateClassAtEnd = candidateClass(row);
    }
  }
  if (current) plateaus.push(current);
  return plateaus;
}

function countBy(values) {
  return Object.fromEntries([...new Set(values)]
    .sort((left, right) => Number(left) - Number(right))
    .map((value) => [String(value), values.filter((candidate) => candidate === value).length]));
}

function validateRows(rows) {
  const failures = [];
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    if (row.N !== index + 1) failures.push({ index, N: row.N, reason: 'not_sorted_contiguous_from_one' });
    if (candidateSize(row) !== Number(row.maxCliqueSize)) failures.push({ index, N: row.N, reason: 'candidate_size_not_maximum' });
    if (row.candidateAchievesMaximum !== true) failures.push({ index, N: row.N, reason: 'candidate_flag_false' });
  }
  return failures;
}

function buildCertificate(resultsPath) {
  const payload = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  const rows = Array.isArray(payload.results) ? payload.results : [];
  const rowFailures = validateRows(rows);
  const rowByN = new Map(rows.map((row) => [row.N, row]));
  const plateaus = buildCandidatePlateaus(rows);
  const endpointChecks = plateaus.map((plateau) => {
    const endpoint = rowByN.get(plateau.endN);
    const endpointCandidateSize = endpoint ? candidateSize(endpoint) : null;
    const endpointExact = endpoint
      && endpoint.candidateAchievesMaximum === true
      && Number(endpoint.maxCliqueSize) === endpointCandidateSize
      && endpointCandidateSize === plateau.candidateSize;
    return {
      startN: plateau.startN,
      endN: plateau.endN,
      length: plateau.endN - plateau.startN + 1,
      candidateSize: plateau.candidateSize,
      endpointN: plateau.endN,
      endpointMaxCliqueSize: endpoint?.maxCliqueSize ?? null,
      endpointCandidateSize,
      endpointCertified: Boolean(endpointExact),
      inferredRows: plateau.endN - plateau.startN + 1,
      candidateClassAtEnd: plateau.candidateClassAtEnd,
    };
  });
  const failedEndpointChecks = endpointChecks.filter((check) => !check.endpointCertified);
  const plateauLengths = endpointChecks.map((check) => check.length);
  const interval = payload.summary?.interval ?? (rows.length > 0 ? `${rows[0].N}..${rows.at(-1).N}` : null);
  const status = rowFailures.length === 0 && failedEndpointChecks.length === 0
    ? 'certified_from_endpoint_monotonicity'
    : 'failed';

  return {
    generatedAt: new Date().toISOString(),
    method: 'candidate_plateau_endpoint_monotonicity',
    problemId: '848',
    sourceResultsPath: path.resolve(resultsPath),
    status,
    summary: {
      interval,
      rowCount: rows.length,
      endpointCheckCount: endpointChecks.length,
      compressionRatio: rows.length > 0 ? rows.length / endpointChecks.length : null,
      allRowsAlreadyExact: rowFailures.length === 0,
      allEndpointChecksCertified: failedEndpointChecks.length === 0,
      plateauLengthFrequency: countBy(plateauLengths),
    },
    lemma: {
      name: 'candidate_size_plateau_endpoint_monotonicity',
      statement: 'For a candidate-size plateau [L,R], if the exact verifier proves omega(G_R) equals the constant candidate size C, then every N in [L,R] has omega(G_N)=C.',
      proofSketch: [
        'The graph G_N is an induced subgraph of G_R for every N <= R, so omega(G_N) <= omega(G_R).',
        'The candidate residue class has constant size C throughout the plateau, so omega(G_N) >= C for every N in [L,R].',
        'The endpoint exact check gives omega(G_R)=C, hence C <= omega(G_N) <= C throughout the plateau.',
      ],
      scopeBoundary: 'This certificate compresses exact checks inside the certified interval. It does not certify any endpoint that has not itself been exactly checked.',
    },
    endpointChecks,
    failedEndpointChecks,
    rowFailures: rowFailures.slice(0, 50),
  };
}

const args = parseArgs(process.argv.slice(2));
const certificate = buildCertificate(args.results);

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(certificate, null, 2)}\n`);
}

console.log(JSON.stringify({
  status: certificate.status,
  ...certificate.summary,
}, null, 2));
