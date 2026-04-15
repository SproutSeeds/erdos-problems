import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const compiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_endpoint_menu_compiler.mjs',
);

function runCompiler(args) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-endpoint-menu-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [compiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

test('problem 848 endpoint menu compiler covers the known q17 seed with the primary menu', () => {
  const packet = runCompiler([
    '--primes',
    '23,31',
    '--fallback-primes',
    '37,41,61',
    '--start',
    '27932207',
    '--end',
    '27932207',
    '--max-square-prime',
    '10000',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_menu_compiler/1');
  assert.equal(packet.target.residualClass.residue, 5882);
  assert.equal(packet.target.residualClass.modulus, 11025);
  assert.equal(packet.coverage.primaryCovered, 1);
  assert.equal(packet.coverage.primaryMisses, 0);
  assert.equal(packet.coverage.allMisses, 0);
  assert.equal(packet.claims.provesEndpointFormulas, true);
  assert.equal(packet.claims.screensBoundedPrimaryMenuCoverage, true);
  assert.equal(packet.claims.provesBoundedPrimaryMenuCoverage, false);

  const selected = packet.seedCheck.firstPrimarySquarefree;
  assert.equal(selected.prime, 23);
  assert.equal(selected.rightMod25, 18);
  assert.equal(selected.compatibilityModPrimeSquare, 0);
  assert.equal(selected.withinWindow, true);
});

test('problem 848 endpoint menu compiler exposes the p67 repair for the first full-menu parity miss', () => {
  const packet = runCompiler([
    '--primes',
    '23,31,37,41,61',
    '--fallback-primes',
    '43,47,53,59,67,71,73,79',
    '--start',
    '28792157',
    '--end',
    '28792157',
    '--max-square-prime',
    '10000',
  ]);

  assert.equal(packet.coverage.primaryCovered, 0);
  assert.equal(packet.coverage.primaryMisses, 1);
  assert.equal(packet.coverage.allCovered, 1);
  assert.equal(packet.coverage.allMisses, 0);

  const miss = packet.coverage.firstPrimaryMiss;
  assert.equal(miss.left, 28792157);
  assert.equal(miss.primaryEndpoints.find((endpoint) => endpoint.prime === 23).squareDivisor, 4);
  assert.equal(miss.primaryEndpoints.find((endpoint) => endpoint.prime === 31).squareDivisor, 4);
  assert.equal(miss.primaryEndpoints.find((endpoint) => endpoint.prime === 37).squareDivisor, 4);

  const selected = miss.firstAnySquarefree;
  assert.equal(selected.prime, 67);
  assert.equal(selected.k, 679);
  assert.equal(selected.delta, -16989);
  assert.equal(selected.right, 28775168);
  assert.equal(selected.withinWindow, true);
  assert.equal(selected.rightMod25, 18);
  assert.equal(selected.compatibilityModPrimeSquare, 0);
});

test('problem 848 endpoint menu compiler profiles the p67 window threshold', () => {
  const packet = runCompiler([
    '--primes',
    '23,31,37,41,61,67',
    '--fallback-primes',
    '71,73,79,83,89,97,101,103,107,109,113',
    '--start',
    '34414907',
    '--end',
    '34414907',
    '--window-grid',
    '25000,28500,30000',
    '--max-square-prime',
    '10000',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_window_grid/1');
  assert.equal(packet.firstScreenAllCoveredWindow, 28500);

  const summary25000 = packet.summaries.find((summary) => summary.window === 25000);
  assert.equal(summary25000.allMisses, 1);
  assert.equal(summary25000.firstAllMiss.left, 34414907);
  assert.equal(summary25000.firstAllMiss.nearestUsableOutsideWindow[0].prime, 67);
  assert.equal(summary25000.firstAllMiss.nearestUsableOutsideWindow[0].delta, -28489);

  const summary28500 = packet.summaries.find((summary) => summary.window === 28500);
  assert.equal(summary28500.allMisses, 0);
  assert.equal(summary28500.allCovered, 1);
});

test('problem 848 endpoint menu compiler emits modular availability thresholds', () => {
  const packet = runCompiler([
    '--availability-profile',
    '--primes',
    '23,31,37,41,61,67',
    '--fallback-primes',
    '71,73',
    '--start',
    '34414907',
    '--end',
    '34414907',
    '--window-grid',
    '25000,28500',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_profile/1');

  const p23Window25000 = packet.formulasByPrime['23'].availabilityByWindow.find((rule) => rule.window === 25000);
  assert.equal(p23Window25000.maxK, 999);
  assert.equal(p23Window25000.universallyWithinWindow, true);

  const p37Window25000 = packet.formulasByPrime['37'].availabilityByWindow.find((rule) => rule.window === 25000);
  assert.equal(p37Window25000.availableResidueCount, 1000);
  assert.equal(p37Window25000.tPeriod, 1369);
  assert.equal(p37Window25000.universallyWithinWindow, false);

  const p67Window28500 = packet.formulasByPrime['67'].availabilityByWindow.find((rule) => rule.window === 28500);
  assert.equal(p67Window28500.maxK, 1139);
  assert.equal(p67Window28500.availableResidueCount, 1140);
  assert.equal(p67Window28500.tPeriod, 4489);

  const p67Witness = packet.witnessRows[0].endpoints.find((endpoint) => endpoint.prime === 67);
  assert.equal(p67Witness.k, 1139);
  assert.equal(p67Witness.delta, -28489);
  assert.equal(p67Witness.withinWindows['25000'], false);
  assert.equal(p67Witness.withinWindows['28500'], true);
});
