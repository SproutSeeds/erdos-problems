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

test('problem 848 endpoint menu compiler can exactly factor-check the p67 window repair', () => {
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
    '25000,28500',
    '--square-check',
    'factor',
  ]);

  const summary28500 = packet.summaries.find((summary) => summary.window === 28500);
  assert.equal(summary28500.squareCheck.mode, 'factor');
  assert.equal(summary28500.squareCheck.checkedPrimeLimit, null);
  assert.equal(summary28500.claims.provesBoundedAllMenuCoverage, true);
  assert.equal(summary28500.allCoverPrimeCounts[0].key, 67);
  assert.equal(summary28500.allCoverPrimeCounts[0].count, 1);
});

test('problem 848 endpoint menu compiler emits the q17 window-legality decision packet', () => {
  const packet = runCompiler([
    '--legality-audit',
    '--primes',
    '23,31,37,41,61,67',
    '--fallback-primes',
    '71,73,79,83,89,97,101,103,107,109,113',
    '--start',
    '34414907',
    '--end',
    '34414907',
    '--window-grid',
    '25000,28500',
    '--square-check',
    'factor',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_window_legality_audit/2');
  assert.equal(packet.status, 'selector_layer_window_relaxation_supported_matching_handoff_needed');
  assert.equal(packet.windows.inheritedWindow, 25000);
  assert.equal(packet.windows.candidateEndpointWindow, 28500);
  assert.equal(packet.windows.inheritedMaxK, 999);
  assert.equal(packet.windows.candidateMaxK, 1139);

  const repair = packet.observedEndpointRepair;
  assert.equal(repair.left, 34414907);
  assert.equal(repair.prime, 67);
  assert.equal(repair.k, 1139);
  assert.equal(repair.delta, -28489);
  assert.equal(repair.right, 34386418);
  assert.equal(repair.insideInheritedWindow, false);
  assert.equal(repair.insideCandidateWindow, true);
  assert.equal(repair.outsiderCompatibility.compatibilityModPrimeSquare, 0);
  assert.equal(repair.crossProduct.exactSquarefreeCertified, true);

  assert.equal(packet.selectorLayerDecision.legalAtEndpointSelectorLayer, true);
  assert.equal(packet.selectorLayerDecision.provesCollisionFreeMatching, false);
  assert.equal(packet.selectorLayerDecision.promotesAllN, false);
  assert.equal(packet.availabilityStratumSeed.candidateWindow.witnessAvailable, true);
  assert.equal(packet.availabilityStratumSeed.inheritedWindow.witnessAvailable, false);
  assert.equal(packet.theoremFork.find((option) => option.id === 'availability_residue_cover').status, 'next');
  assert.equal(packet.recommendedNextAction, 'promote_availability_residue_cover');
});

test('problem 848 endpoint menu compiler emits the q17 availability residue-cover handoff', () => {
  const packet = runCompiler([
    '--availability-cover',
    '--primes',
    '23,31,37,41,61,67',
    '--fallback-primes',
    '71,73,79,83,89,97,101,103,107,109,113',
    '--start',
    '34414907',
    '--end',
    '34414907',
    '--window',
    '28500',
    '--square-check',
    'factor',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_residue_cover/1');
  assert.equal(packet.status, 'bounded_availability_residue_cover_seeded_symbolic_squarefree_hitting_needed');
  assert.equal(packet.target.window, 28500);
  assert.equal(packet.coverage.assignedRows, 1);
  assert.equal(packet.coverage.unassignedRows, 0);
  assert.equal(packet.coverage.selectedEndpointsExact, true);
  assert.equal(packet.claims.provesBoundedEndpointAssignment, true);
  assert.equal(packet.claims.provesSymbolicSquarefreeHitting, false);
  assert.equal(packet.claims.provesAllN, false);

  const p67 = packet.strata.find((stratum) => stratum.prime === 67);
  assert.equal(p67.rowCount, 1);
  assert.equal(p67.kRange.min, 1139);
  assert.equal(p67.kRange.max, 1139);
  assert.equal(p67.deltaRange.min, -28489);
  assert.equal(p67.availabilityRule.maxK, 1139);
  assert.equal(p67.availabilityRule.availableResidueCount, 1140);
  assert.equal(p67.rowSamples[0].tResidueModuloPrimeSquare, 3121);
  assert.equal(packet.nextTheoremOptions.find((option) => option.id === 'prove_symbolic_squarefree_hitting_residue_cover').status, 'next');
  assert.equal(packet.recommendedNextAction, 'prove_symbolic_squarefree_hitting_residue_cover');
});

test('problem 848 endpoint menu compiler emits the first q17 squarefree-hitting obstruction subclass', () => {
  const packet = runCompiler([
    '--squarefree-hitting-audit',
    '--primes',
    '23,31,37,41,61,67',
    '--fallback-primes',
    '71,73,79,83,89,97,101,103,107,109,113',
    '--start',
    '27932207',
    '--end',
    '27932207',
    '--window',
    '28500',
    '--square-check',
    'factor',
    '--max-square-prime',
    '31',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_squarefree_hitting_audit/1');
  assert.equal(packet.status, 'first_square_obstruction_residue_subclass_emitted');
  assert.equal(packet.target.window, 28500);
  assert.equal(packet.target.visitedRowCount, 1);
  assert.equal(packet.target.auditedFamilyCount, 1);

  const selected = packet.firstObstruction.selectedBoundedRow;
  assert.equal(selected.left, 27932207);
  assert.equal(selected.endpointPrime, 23);
  assert.equal(selected.tResidueModuloPrimeSquare, 417);
  assert.equal(selected.k, 479);
  assert.equal(selected.delta, -11989);
  assert.equal(selected.squarefreeStatus, 'exact_squarefree');

  const obstruction = packet.firstObstruction.obstruction;
  assert.equal(obstruction.obstructionPrime, 29);
  assert.equal(obstruction.obstructionSquare, 841);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [262, 487]);
  assert.equal(obstruction.tCongruence.residue, 139015);
  assert.equal(obstruction.tCongruence.modulus, 444889);
  assert.equal(obstruction.leftCongruence.residue, 1532646257);
  assert.equal(obstruction.leftCongruence.modulus, 4904901225);
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(obstruction.boundedWitnessAvoidsObstruction, true);
  assert.equal(packet.claims.provesSymbolicSquarefreeHitting, false);
  assert.equal(packet.claims.disprovesUniversalSelectedResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_endpoint_menu_squarefree_obstruction_subclass');
});

test('problem 848 endpoint menu compiler repairs the first q17 obstruction representative with p41', () => {
  const packet = runCompiler([
    '--obstruction-subclass-repair',
    '--primes',
    '23,31,37,41,61,67',
    '--fallback-primes',
    '71,73,79,83,89,97,101,103,107,109,113',
    '--window',
    '28500',
    '--square-check',
    'factor',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_subclass_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.target.residualClass.residue, 1532646257);
  assert.equal(packet.target.residualClass.modulus, 4904901225);
  assert.equal(packet.target.blockedEndpointPrime, 23);
  assert.equal(packet.target.blockedSquareDivisor, 841);

  const repair = packet.firstRepair;
  assert.equal(repair.left, 1532646257);
  assert.equal(repair.blockedEndpoint.prime, 23);
  assert.equal(repair.blockedEndpoint.squareDivisor, 841);
  assert.equal(repair.alternateEndpoint.prime, 41);
  assert.equal(repair.alternateEndpoint.k, 1011);
  assert.equal(repair.alternateEndpoint.delta, -25289);
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_41(t) = (1496*t + 1011) mod 1681');
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.universallyWithinWindow, false);
  assert.equal(repair.availabilityRule.firstUnavailableTResidue.tResidue, 6);
  assert.equal(packet.claims.provesRepresentativeRepair, true);
  assert.equal(packet.claims.provesSubclassCoverage, false);
  assert.equal(packet.recommendedNextAction, 'split_q17_obstruction_subclass_by_p41_availability');
});

test('problem 848 endpoint menu compiler splits the p41 availability repair and emits the first p41 square obstruction', () => {
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--max-square-prime',
    '17',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p41_available_square_obstruction_subclass_emitted');
  assert.equal(packet.target.endpointPrime, 41);
  assert.equal(packet.availabilitySplit.availableResidueCount, 1140);
  assert.equal(packet.availabilitySplit.period, 1681);
  assert.equal(packet.availabilitySplit.firstAvailableResidue.tResidue, 0);
  assert.equal(packet.availabilitySplit.firstUnavailableResidue.tResidue, 6);
  assert.equal(packet.representativeAudit.squarefreeStatus, 'exact_squarefree');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 13);
  assert.equal(obstruction.obstructionSquare, 169);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [71, 118]);
  assert.equal(obstruction.tCongruence.residue, 119351);
  assert.equal(obstruction.tCongruence.modulus, 284089);
  assert.equal(obstruction.leftCongruence.residue, 585406398751232);
  assert.equal(obstruction.leftCongruence.modulus, 1393428484109025);
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.provesAvailabilitySplit, true);
  assert.equal(packet.claims.provesAvailableSubfamilySquarefreeHitting, false);
  assert.equal(packet.claims.disprovesUniversalAvailableResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_available_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler repairs the p41/q13 obstruction representative with p103', () => {
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--primes',
    '23,31,37,41,61,67',
    '--fallback-primes',
    '71,73,79,83,89,97,101,103,107,109,113',
    '--window',
    '28500',
    '--square-check',
    'factor',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.target.residualClass.residue, 585406398751232);
  assert.equal(packet.target.residualClass.modulus, 1393428484109025);
  assert.equal(packet.target.blockedEndpointPrime, 41);
  assert.equal(packet.target.blockedSquareDivisor, 169);

  const repair = packet.firstRepair;
  assert.equal(repair.left, 585406398751232);
  assert.equal(repair.blockedEndpoint.prime, 41);
  assert.equal(repair.blockedEndpoint.squareDivisor, 169);
  assert.equal(repair.alternateEndpoint.prime, 103);
  assert.equal(repair.alternateEndpoint.k, 532);
  assert.equal(repair.alternateEndpoint.delta, -13314);
  assert.equal(repair.alternateEndpoint.right, 585406398737918);
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_103(t) = (1766*t + 532) mod 10609');
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.universallyWithinWindow, false);
  assert.equal(repair.availabilityRule.firstUnavailableTResidue.tResidue, 1);
  assert.equal(packet.rowSamples[0].blockedWithinWindowEndpoints.find((endpoint) => endpoint.prime === 23).squareDivisor, 841);
  assert.equal(packet.rowSamples[0].blockedWithinWindowEndpoints.find((endpoint) => endpoint.prime === 31).squareDivisor, 9);
  assert.equal(packet.rowSamples[0].withinWindowUsableEndpoints.find((endpoint) => endpoint.prime === 113).right, 585406398737918);
  assert.equal(packet.claims.provesRepresentativeRepair, true);
  assert.equal(packet.claims.provesSubclassCoverage, false);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_subclass_by_p103_availability');
});

test('problem 848 endpoint menu compiler splits the p103 availability repair and emits the first p103 square obstruction', () => {
  const repairPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_subclass_repair.json',
  );
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--obstruction-repair-packet',
    repairPacket,
    '--max-square-prime',
    '31',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p103_available_square_obstruction_subclass_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_availability_split');
  assert.equal(packet.target.endpointPrime, 103);
  assert.equal(packet.availabilitySplit.availableResidueCount, 1140);
  assert.equal(packet.availabilitySplit.period, 10609);
  assert.equal(packet.availabilitySplit.firstAvailableResidue.tResidue, 0);
  assert.equal(packet.availabilitySplit.firstUnavailableResidue.tResidue, 1);
  assert.equal(packet.representativeAudit.squarefreeStatus, 'exact_squarefree');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 2);
  assert.equal(obstruction.obstructionSquare, 4);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [1, 3]);
  assert.equal(obstruction.tCongruence.residue, 10609);
  assert.equal(obstruction.tCongruence.modulus, 42436);
  assert.equal(obstruction.leftCongruence.residue, '14783468194311397457');
  assert.equal(obstruction.leftCongruence.modulus, '59131531151650584900');
  assert.equal(obstruction.endpoint.rightResidue, '14783468194311384143');
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.provesAvailabilitySplit, true);
  assert.equal(packet.claims.provesAvailableSubfamilySquarefreeHitting, false);
  assert.equal(packet.claims.disprovesUniversalAvailableResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_available_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler repairs the p103 parity obstruction representative with p37', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_availability_split.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '23,31,37,41,61,67',
    '--fallback-primes',
    '71,73,79,83,89,97,101,103,107,109,113',
    '--window',
    '28500',
    '--square-check',
    'factor',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_subclass');
  assert.equal(packet.target.residualClass.residue, '14783468194311397457');
  assert.equal(packet.target.residualClass.modulus, '59131531151650584900');
  assert.equal(packet.target.blockedEndpointPrime, 103);
  assert.equal(packet.target.blockedSquareDivisor, 4);

  const repair = packet.firstRepair;
  assert.equal(repair.left, '14783468194311397457');
  assert.equal(repair.blockedEndpoint.prime, 103);
  assert.equal(repair.blockedEndpoint.squareDivisor, 4);
  assert.equal(repair.alternateEndpoint.prime, 37);
  assert.equal(repair.alternateEndpoint.k, 457);
  assert.equal(repair.alternateEndpoint.delta, -11439);
  assert.equal(repair.alternateEndpoint.right, '14783468194311386018');
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_37(t) = (1359*t + 457) mod 1369');
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.firstUnavailableTResidue.tResidue, 46);
  assert.equal(packet.claims.provesRepresentativeRepair, true);
  assert.equal(packet.claims.provesSubclassCoverage, false);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_subclass_by_p37_availability');
});

test('problem 848 endpoint menu compiler splits the p37 availability repair and emits the first p37 square obstruction', () => {
  const repairPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_subclass_repair.json',
  );
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--obstruction-repair-packet',
    repairPacket,
    '--max-square-prime',
    '31',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p37_available_square_obstruction_subclass_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_availability_split');
  assert.equal(packet.target.endpointPrime, 37);
  assert.equal(packet.availabilitySplit.availableResidueCount, 1140);
  assert.equal(packet.availabilitySplit.period, 1369);
  assert.equal(packet.availabilitySplit.firstAvailableResidue.tResidue, 0);
  assert.equal(packet.availabilitySplit.firstUnavailableResidue.tResidue, 46);
  assert.equal(packet.representativeAudit.squarefreeStatus, 'exact_squarefree');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 19);
  assert.equal(obstruction.obstructionSquare, 361);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [40, 203]);
  assert.equal(obstruction.tCongruence.residue, 54760);
  assert.equal(obstruction.tCongruence.modulus, 494209);
  assert.equal(obstruction.leftCongruence.residue, '3238057429332580340521457');
  assert.equal(obstruction.leftCongruence.modulus, '29223334878926083912844100');
  assert.equal(obstruction.endpoint.rightResidue, '3238057429332580340510018');
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.provesAvailabilitySplit, true);
  assert.equal(packet.claims.provesAvailableSubfamilySquarefreeHitting, false);
  assert.equal(packet.claims.disprovesUniversalAvailableResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_available_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler repairs the p37/q19 obstruction with universal p31 availability', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_availability_split.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '31',
    '--fallback-primes',
    '',
    '--square-check',
    'factor',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_universal_window_squarefree_lift_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 37);
  assert.equal(packet.target.blockedSquareDivisor, 361);

  const repair = packet.firstRepair;
  assert.equal(repair.left, '3238057429332580340521457');
  assert.equal(repair.alternateEndpoint.prime, 31);
  assert.equal(repair.alternateEndpoint.k, 727);
  assert.equal(repair.alternateEndpoint.delta, -18189);
  assert.equal(repair.alternateEndpoint.right, '3238057429332580340503268');
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.availabilityRule.universallyWithinWindow, true);
  assert.equal(repair.availabilityRule.availableResidueCount, 961);
  assert.equal(repair.availabilityRule.unavailableResidueCount, 0);
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_31(t) = (506*t + 727) mod 961');
  assert.equal(packet.claims.provesRepresentativeRepair, true);
  assert.equal(packet.claims.provesSubclassCoverage, false);
  assert.equal(packet.recommendedNextAction, 'prove_q17_p41_q13_p103_q2_p37_q19_p31_symbolic_squarefree_lift');
});

test('problem 848 endpoint menu compiler emits the first p31 symbolic squarefree obstruction', () => {
  const repairPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_subclass_repair.json',
  );
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--obstruction-repair-packet',
    repairPacket,
    '--max-square-prime',
    '257',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p31_symbolic_squarefree_obstruction_subclass_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_symbolic_squarefree_lift');
  assert.equal(packet.target.description, 'q17 p37/q19 obstruction subclass p31 symbolic squarefree lift');
  assert.equal(packet.target.endpointPrime, 31);
  assert.equal(packet.availabilitySplit.universallyWithinWindow, true);
  assert.equal(packet.availabilitySplit.availableResidueCount, 961);
  assert.equal(packet.representativeAudit.squarefreeStatus, 'exact_squarefree');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 53);
  assert.equal(obstruction.obstructionSquare, 2809);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [370, 2785]);
  assert.equal(obstruction.tCongruence.residue, 355570);
  assert.equal(obstruction.tCongruence.modulus, 2699449);
  assert.equal(obstruction.leftCongruence.residue, '10390944420957176989470317158457');
  assert.equal(obstruction.leftCongruence.modulus, '78886902115582138292443092900900');
  assert.equal(obstruction.endpoint.rightResidue, '10390944420957176989470317140268');
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.provesAvailableSubfamilySquarefreeHitting, false);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler repairs the p31/q53 obstruction with p73', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_symbolic_squarefree_lift.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '73',
    '--fallback-primes',
    '',
    '--square-check',
    'factor',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 31);
  assert.equal(packet.target.blockedSquareDivisor, 2809);

  const repair = packet.firstRepair;
  assert.equal(repair.left, '10390944420957176989470317158457');
  assert.equal(repair.alternateEndpoint.prime, 73);
  assert.equal(repair.alternateEndpoint.k, 42);
  assert.equal(repair.alternateEndpoint.delta, -1064);
  assert.equal(repair.alternateEndpoint.right, '10390944420957176989470317157393');
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.availabilityRule.universallyWithinWindow, false);
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.unavailableResidueCount, 4189);
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_73(t) = (5184*t + 42) mod 5329');
  assert.equal(packet.claims.provesRepresentativeRepair, true);
  assert.equal(packet.claims.provesSubclassCoverage, false);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_subclass_by_p73_availability');
});

test('problem 848 endpoint menu compiler splits the p73 repair and emits the first p73 square obstruction', () => {
  const repairPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_subclass_repair.json',
  );
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--obstruction-repair-packet',
    repairPacket,
    '--max-square-prime',
    '257',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p73_available_square_obstruction_subclass_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_availability_split');
  assert.equal(packet.target.description, 'q17 p31/q53 obstruction subclass p73 availability split');
  assert.equal(packet.target.endpointPrime, 73);
  assert.equal(packet.availabilitySplit.universallyWithinWindow, false);
  assert.equal(packet.availabilitySplit.availableResidueCount, 1140);
  assert.equal(packet.availabilitySplit.unavailableResidueCount, 4189);
  assert.equal(packet.representativeAudit.squarefreeStatus, 'exact_squarefree');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 11);
  assert.equal(obstruction.obstructionSquare, 121);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [46, 115]);
  assert.equal(obstruction.tCongruence.residue, 245134);
  assert.equal(obstruction.tCongruence.modulus, 644809);
  assert.equal(obstruction.leftCongruence.residue, '19337872254145532845356734605486379057');
  assert.equal(obstruction.leftCongruence.modulus, '50866984466246403010211938290336428100');
  assert.equal(obstruction.endpoint.rightResidue, '19337872254145532845356734605486377993');
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.disprovesUniversalAvailableResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_available_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler repairs the p73/q11 obstruction with p83', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_availability_split.json',
  );
  const factorCertificate = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_factor_certificate.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '83',
    '--fallback-primes',
    '',
    '--square-check',
    'factor',
    '--factor-certificate',
    factorCertificate,
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 73);
  assert.equal(packet.target.blockedSquareDivisor, 121);
  assert.equal(packet.target.squareCheck.factorCertificate, factorCertificate);

  const repair = packet.firstRepair;
  assert.equal(repair.left, '19337872254145532845356734605486379057');
  assert.equal(repair.alternateEndpoint.prime, 83);
  assert.equal(repair.alternateEndpoint.k, 1053);
  assert.equal(repair.alternateEndpoint.delta, -26339);
  assert.equal(repair.alternateEndpoint.right, '19337872254145532845356734605486352718');
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.alternateEndpoint.factorCertificateId, 'p848_q17_p73_q11_p83_factor_certificate');
  assert.equal(repair.availabilityRule.universallyWithinWindow, false);
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.unavailableResidueCount, 5749);
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_83(t) = (3454*t + 1053) mod 6889');
  assert.equal(packet.claims.provesRepresentativeRepair, true);
  assert.equal(packet.claims.provesSubclassCoverage, false);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_subclass_by_p83_availability');
});

test('problem 848 endpoint menu compiler splits the p83 repair and emits the first p83 square obstruction', () => {
  const repairPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_subclass_repair.json',
  );
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--obstruction-repair-packet',
    repairPacket,
    '--max-square-prime',
    '257',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p83_available_square_obstruction_subclass_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_availability_split');
  assert.equal(packet.target.description, 'q17 p73/q11 obstruction subclass p83 availability split');
  assert.equal(packet.target.endpointPrime, 83);
  assert.equal(packet.availabilitySplit.universallyWithinWindow, false);
  assert.equal(packet.availabilitySplit.availableResidueCount, 1140);
  assert.equal(packet.availabilitySplit.unavailableResidueCount, 5749);
  assert.equal(packet.representativeAudit.squarefreeStatus, 'exact_squarefree');
  assert.equal(packet.representativeAudit.factorCertificateId, 'p848_q17_p73_q11_p83_factor_certificate');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 17);
  assert.equal(obstruction.obstructionSquare, 289);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [201, 275]);
  assert.equal(obstruction.tCongruence.residue, 1384689);
  assert.equal(obstruction.tCongruence.modulus, 1990921);
  assert.equal(obstruction.leftCongruence.residue, '70434973191454519683340203976042263775739957');
  assert.equal(obstruction.leftCongruence.modulus, '101272147580523754927494162392934891769280100');
  assert.equal(obstruction.endpoint.rightResidue, '70434973191454519683340203976042263775713618');
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.disprovesUniversalAvailableResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_available_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler routes the p83/q17 branch when no finite-menu repair is found', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_availability_split.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '23,31,37,41,61,67,73,83',
    '--fallback-primes',
    '89,97,101,103,107,109,113,127,131,137,139,149,151',
    '--window',
    '28500',
    '--square-check',
    'trial',
    '--max-square-prime',
    '257',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'no_representative_repair_found_successor_atom_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 83);
  assert.equal(packet.target.blockedSquareDivisor, 289);
  assert.deepEqual(packet.target.testedEndpointPrimes, [23, 31, 37, 41, 61, 67, 73, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151]);
  assert.equal(packet.firstRepair, null);

  const row = packet.firstUnrepairedRow;
  assert.equal(row.left, '70434973191454519683340203976042263775739957');
  assert.equal(row.withinWindowUsableEndpoints.length, 0);
  assert.equal(row.blockedEndpoint.prime, 83);
  assert.equal(row.blockedEndpoint.squareDivisorPrime, 17);

  const blockedPrimes = new Map(row.blockedWithinWindowEndpoints.map((endpoint) => [endpoint.prime, endpoint.squareDivisor]));
  assert.equal(blockedPrimes.get(23), 841);
  assert.equal(blockedPrimes.get(31), 2809);
  assert.equal(blockedPrimes.get(37), 361);
  assert.equal(blockedPrimes.get(41), 169);
  assert.equal(blockedPrimes.get(61), 9);
  assert.equal(blockedPrimes.get(67), 4);
  assert.equal(blockedPrimes.get(73), 121);
  assert.equal(blockedPrimes.get(83), 289);
  assert.equal(blockedPrimes.get(103), 4);
  assert.equal(packet.claims.provesRepresentativeRepair, false);
  assert.equal(packet.recommendedNextAction, 'emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_square_obstruction_successor');
});

test('problem 848 endpoint menu compiler repairs the p83/q17 obstruction with p509', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_availability_split.json',
  );
  const factorCertificate = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p83_q17_p509_factor_certificate.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '509',
    '--fallback-primes',
    '',
    '--window',
    '28500',
    '--square-check',
    'factor',
    '--factor-certificate',
    factorCertificate,
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 83);
  assert.equal(packet.target.blockedSquareDivisor, 289);
  assert.equal(packet.target.squareCheck.factorCertificate, factorCertificate);

  const repair = packet.firstRepair;
  assert.equal(repair.left, '70434973191454519683340203976042263775739957');
  assert.equal(repair.alternateEndpoint.prime, 509);
  assert.equal(repair.alternateEndpoint.k, 375);
  assert.equal(repair.alternateEndpoint.delta, -9389);
  assert.equal(repair.alternateEndpoint.right, '70434973191454519683340203976042263775730568');
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.alternateEndpoint.factorCertificateId, 'p848_q17_p73_q11_p83_q17_p509_factor_certificate');
  assert.equal(repair.availabilityRule.universallyWithinWindow, false);
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.unavailableResidueCount, 257941);
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_509(t) = (8757*t + 375) mod 259081');
  assert.equal(packet.claims.provesRepresentativeRepair, true);
  assert.equal(packet.claims.provesSubclassCoverage, false);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass_by_p509_availability');
});

test('problem 848 endpoint menu compiler splits the p509 repair and emits the first p509 square obstruction', () => {
  const repairPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass_repair.json',
  );
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--obstruction-repair-packet',
    repairPacket,
    '--max-square-prime',
    '1000',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p509_available_square_obstruction_subclass_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_availability_split');
  assert.equal(packet.target.description, 'q17 p83/q17 obstruction subclass p509 availability split');
  assert.equal(packet.target.endpointPrime, 509);
  assert.equal(packet.availabilitySplit.availableResidueCount, 1140);
  assert.equal(packet.availabilitySplit.unavailableResidueCount, 257941);
  assert.equal(packet.representativeAudit.squarefreeStatus, 'exact_squarefree');
  assert.equal(packet.representativeAudit.factorCertificateId, 'p848_q17_p73_q11_p83_q17_p509_factor_certificate');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 43);
  assert.equal(obstruction.obstructionSquare, 1849);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [268, 1643]);
  assert.equal(obstruction.tCongruence.residue, 69433708);
  assert.equal(obstruction.tCongruence.modulus, 479040769);
  assert.equal(obstruction.leftCongruence.residue, '7031700794073966078153710526635826514162061609350757');
  assert.equal(obstruction.leftCongruence.modulus, '48513487455255588983234342795722410720087709680396900');
  assert.equal(obstruction.endpoint.rightResidue, '7031700794073966078153710526635826514162061609341368');
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.disprovesUniversalAvailableResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_available_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler repairs the p509/q43 obstruction with universal p29 availability', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p83_q17_p509_availability_split.json',
  );
  const factorCertificate = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p509_q43_p29_factor_certificate.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '29',
    '--fallback-primes',
    '',
    '--window',
    '28500',
    '--square-check',
    'factor',
    '--factor-certificate',
    factorCertificate,
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_universal_window_squarefree_lift_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 509);
  assert.equal(packet.target.blockedSquareDivisor, 1849);
  assert.equal(packet.target.squareCheck.factorCertificate, factorCertificate);

  const repair = packet.firstRepair;
  assert.equal(repair.left, '7031700794073966078153710526635826514162061609350757');
  assert.equal(repair.alternateEndpoint.prime, 29);
  assert.equal(repair.alternateEndpoint.k, 330);
  assert.equal(repair.alternateEndpoint.delta, -8264);
  assert.equal(repair.alternateEndpoint.right, '7031700794073966078153710526635826514162061609342493');
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.alternateEndpoint.factorCertificateId, 'p848_q17_p509_q43_p29_factor_certificate');
  assert.equal(repair.availabilityRule.universallyWithinWindow, true);
  assert.equal(repair.availabilityRule.availableResidueCount, 1);
  assert.equal(repair.availabilityRule.unavailableResidueCount, 0);
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_29(t) = (0*t + 330) mod 841');
  assert.equal(packet.recommendedNextAction, 'prove_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_symbolic_squarefree_lift');
});

test('problem 848 endpoint menu compiler emits the first p29 symbolic squarefree obstruction', () => {
  const repairPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p509_q43_p29_subclass_repair.json',
  );
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--obstruction-repair-packet',
    repairPacket,
    '--max-square-prime',
    '1000',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p29_symbolic_squarefree_obstruction_subclass_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_symbolic_squarefree_lift');
  assert.equal(packet.target.description, 'q17 p509/q43 obstruction subclass p29 symbolic squarefree lift');
  assert.equal(packet.target.endpointPrime, 29);
  assert.equal(packet.availabilitySplit.universallyWithinWindow, true);
  assert.equal(packet.representativeAudit.factorCertificateId, 'p848_q17_p509_q43_p29_factor_certificate');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 59);
  assert.equal(obstruction.obstructionSquare, 3481);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [2833, 3360]);
  assert.equal(obstruction.tCongruence.residue, 2382553);
  assert.equal(obstruction.tCongruence.modulus, 2927521);
  assert.equal(obstruction.leftCongruence.residue, '115585962108682363372738011284687343464203647124220284636457');
  assert.equal(obstruction.leftCongruence.modulus, '142024253308497297115787186455676067553681891931265213084900');
  assert.equal(obstruction.endpoint.rightResidue, '115585962108682363372738011284687343464203647124220284628193');
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.disprovesUniversalAvailableResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler repairs the p29/q59 obstruction with p47', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p509_q43_p29_symbolic_squarefree_lift.json',
  );
  const factorCertificate = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p29_q59_p47_factor_certificate.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '47',
    '--fallback-primes',
    '',
    '--window',
    '28500',
    '--square-check',
    'factor',
    '--factor-certificate',
    factorCertificate,
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 29);
  assert.equal(packet.target.blockedSquareDivisor, 3481);
  assert.equal(packet.target.squareCheck.factorCertificate, factorCertificate);

  const repair = packet.firstRepair;
  assert.equal(repair.left, '115585962108682363372738011284687343464203647124220284636457');
  assert.equal(repair.alternateEndpoint.prime, 47);
  assert.equal(repair.alternateEndpoint.k, 682);
  assert.equal(repair.alternateEndpoint.delta, -17064);
  assert.equal(repair.alternateEndpoint.right, '115585962108682363372738011284687343464203647124220284619393');
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.alternateEndpoint.factorCertificateId, 'p848_q17_p29_q59_p47_factor_certificate');
  assert.equal(repair.availabilityRule.universallyWithinWindow, false);
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.unavailableResidueCount, 1069);
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_47(t) = (600*t + 682) mod 2209');
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_subclass_by_p47_availability');
});

test('problem 848 endpoint menu compiler splits the p47 repair and emits the first p47 square obstruction', () => {
  const repairPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p29_q59_p47_subclass_repair.json',
  );
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--obstruction-repair-packet',
    repairPacket,
    '--max-square-prime',
    '1000',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p47_available_square_obstruction_subclass_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_availability_split');
  assert.equal(packet.target.description, 'q17 p29/q59 obstruction subclass p47 availability split');
  assert.equal(packet.target.endpointPrime, 47);
  assert.equal(packet.availabilitySplit.availableResidueCount, 1140);
  assert.equal(packet.availabilitySplit.unavailableResidueCount, 1069);
  assert.equal(packet.availabilitySplit.firstAvailableResidue.tResidue, 0);
  assert.equal(packet.representativeAudit.factorCertificateId, 'p848_q17_p29_q59_p47_factor_certificate');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 67);
  assert.equal(obstruction.obstructionSquare, 4489);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [2484, 3069]);
  assert.equal(obstruction.tCongruence.residue, 5487156);
  assert.equal(obstruction.tCongruence.modulus, 9916201);
  assert.equal(obstruction.leftCongruence.residue, '779309349273202903535037727621392952820934379605640625790372180857');
  assert.equal(obstruction.leftCongruence.modulus, '1408341042681974206156866014118961476751887930450704037257698464900');
  assert.equal(obstruction.endpoint.rightResidue, '779309349273202903535037727621392952820934379605640625790372163793');
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.disprovesUniversalAvailableResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_available_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler repairs the p47/q67 obstruction with p79', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p29_q59_p47_availability_split.json',
  );
  const factorCertificate = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p47_q67_p79_factor_certificate.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '79',
    '--fallback-primes',
    '',
    '--window',
    '28500',
    '--square-check',
    'factor',
    '--factor-certificate',
    factorCertificate,
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 47);
  assert.equal(packet.target.blockedSquareDivisor, 4489);
  assert.equal(packet.target.squareCheck.factorCertificate, factorCertificate);

  const repair = packet.firstRepair;
  assert.equal(repair.left, '779309349273202903535037727621392952820934379605640625790372180857');
  assert.equal(repair.alternateEndpoint.prime, 79);
  assert.equal(repair.alternateEndpoint.k, 635);
  assert.equal(repair.alternateEndpoint.delta, -15889);
  assert.equal(repair.alternateEndpoint.right, '779309349273202903535037727621392952820934379605640625790372164968');
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.alternateEndpoint.factorCertificateId, 'p848_q17_p47_q67_p79_factor_certificate');
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.unavailableResidueCount, 5101);
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_79(t) = (22*t + 635) mod 6241');
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_subclass_by_p79_availability');
});

test('problem 848 endpoint menu compiler splits the p79 repair and emits the first p79 square obstruction', () => {
  const repairPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p47_q67_p79_subclass_repair.json',
  );
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--obstruction-repair-packet',
    repairPacket,
    '--max-square-prime',
    '1000',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p79_available_square_obstruction_subclass_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_availability_split');
  assert.equal(packet.target.description, 'q17 p47/q67 obstruction subclass p79 availability split');
  assert.equal(packet.target.endpointPrime, 79);
  assert.equal(packet.availabilitySplit.availableResidueCount, 1140);
  assert.equal(packet.availabilitySplit.unavailableResidueCount, 5101);
  assert.equal(packet.availabilitySplit.firstAvailableResidue.tResidue, 0);
  assert.equal(packet.representativeAudit.factorCertificateId, 'p848_q17_p47_q67_p79_factor_certificate');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 71);
  assert.equal(obstruction.obstructionSquare, 5041);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [739, 2187]);
  assert.equal(obstruction.tCongruence.residue, 4612099);
  assert.equal(obstruction.tCongruence.modulus, 31460881);
  assert.equal(obstruction.leftCongruence.residue, '6495409093921839827444779121889775729358858393078141245172819622639005957');
  assert.equal(obstruction.leftCongruence.modulus, '44307649951233511344970629003140966863675412705245876082384017738101576900');
  assert.equal(obstruction.endpoint.rightResidue, '6495409093921839827444779121889775729358858393078141245172819622638990068');
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.disprovesUniversalAvailableResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_available_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler repairs the p79/q71 obstruction with p107', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p47_q67_p79_availability_split.json',
  );
  const factorCertificate = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p79_q71_p107_factor_certificate.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '107',
    '--fallback-primes',
    '',
    '--window',
    '28500',
    '--square-check',
    'factor',
    '--factor-certificate',
    factorCertificate,
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 79);
  assert.equal(packet.target.blockedSquareDivisor, 5041);

  const repair = packet.firstRepair;
  assert.equal(repair.left, '6495409093921839827444779121889775729358858393078141245172819622639005957');
  assert.equal(repair.alternateEndpoint.prime, 107);
  assert.equal(repair.alternateEndpoint.k, 913);
  assert.equal(repair.alternateEndpoint.delta, -22839);
  assert.equal(repair.alternateEndpoint.right, '6495409093921839827444779121889775729358858393078141245172819622638983118');
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.alternateEndpoint.factorCertificateId, 'p848_q17_p79_q71_p107_factor_certificate');
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.unavailableResidueCount, 10309);
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_107(t) = (3757*t + 913) mod 11449');
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_subclass_by_p107_availability');
});

test('problem 848 endpoint menu compiler splits the p107 repair and emits the first p107 square obstruction', () => {
  const repairPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p79_q71_p107_subclass_repair.json',
  );
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--obstruction-repair-packet',
    repairPacket,
    '--max-square-prime',
    '1000',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p107_available_square_obstruction_subclass_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_availability_split');
  assert.equal(packet.target.description, 'q17 p79/q71 obstruction subclass p107 availability split');
  assert.equal(packet.target.endpointPrime, 107);
  assert.equal(packet.availabilitySplit.availableResidueCount, 1140);
  assert.equal(packet.availabilitySplit.unavailableResidueCount, 10309);
  assert.equal(packet.availabilitySplit.firstAvailableResidue.tResidue, 0);
  assert.equal(packet.representativeAudit.factorCertificateId, 'p848_q17_p79_q71_p107_factor_certificate');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 89);
  assert.equal(obstruction.obstructionSquare, 7921);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [1499, 3302]);
  assert.equal(obstruction.tCongruence.residue, 17162051);
  assert.equal(obstruction.tCongruence.modulus, 90687529);
  assert.equal(obstruction.leftCongruence.residue, '760410154648626128533304355898763555393483209652336085943695959179023528577227857');
  assert.equal(obstruction.leftCongruence.modulus, '4018151289874337645868852921870587523537603036293953839351606997760601160064480100');
  assert.equal(obstruction.endpoint.rightResidue, '760410154648626128533304355898763555393483209652336085943695959179023528577205018');
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.disprovesUniversalAvailableResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_available_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler preserves p107/q89 lineage during the p197 repair probe', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p79_q71_p107_availability_split.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '197',
    '--fallback-primes',
    '',
    '--window',
    '28500',
    '--square-check',
    'trial',
    '--max-square-prime',
    '1000',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 107);
  assert.equal(packet.target.blockedSquareDivisor, 7921);

  const repair = packet.firstRepair;
  assert.equal(repair.alternateEndpoint.prime, 197);
  assert.equal(repair.alternateEndpoint.k, 1073);
  assert.equal(repair.alternateEndpoint.delta, -26839);
  assert.equal(repair.alternateEndpoint.right, '760410154648626128533304355898763555393483209652336085943695959179023528577201018');
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.unavailableResidueCount, 37669);
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_197(t) = (6223*t + 1073) mod 38809');
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_subclass_by_p197_availability');
});

test('problem 848 endpoint menu compiler repairs the p107/q89 obstruction with exact p4217', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p79_q71_p107_availability_split.json',
  );
  const factorCertificate = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p107_q89_p4217_factor_certificate.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '4217',
    '--fallback-primes',
    '',
    '--window',
    '28500',
    '--square-check',
    'factor',
    '--factor-certificate',
    factorCertificate,
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 107);
  assert.equal(packet.target.blockedSquareDivisor, 7921);

  const repair = packet.firstRepair;
  assert.equal(repair.alternateEndpoint.prime, 4217);
  assert.equal(repair.alternateEndpoint.k, 203);
  assert.equal(repair.alternateEndpoint.delta, -5089);
  assert.equal(repair.alternateEndpoint.right, '760410154648626128533304355898763555393483209652336085943695959179023528577222768');
  assert.equal(repair.alternateEndpoint.squarefreeStatus, 'exact_squarefree');
  assert.equal(repair.alternateEndpoint.factorCertificateId, 'p848_q17_p107_q89_p4217_factor_certificate');
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.unavailableResidueCount, 17781949);
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_4217(t) = (445517*t + 203) mod 17783089');
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_subclass_by_p4217_availability');
});

test('problem 848 endpoint menu compiler splits the p4217 repair and emits the first p4217 square obstruction', () => {
  const repairPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p107_q89_p4217_subclass_repair.json',
  );
  const packet = runCompiler([
    '--obstruction-availability-split',
    '--obstruction-repair-packet',
    repairPacket,
    '--max-square-prime',
    '1000',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1');
  assert.equal(packet.status, 'first_p4217_available_square_obstruction_subclass_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_availability_split');
  assert.equal(packet.target.description, 'q17 p107/q89 obstruction subclass p4217 availability split');
  assert.equal(packet.target.endpointPrime, 4217);
  assert.equal(packet.availabilitySplit.availableResidueCount, 1140);
  assert.equal(packet.availabilitySplit.unavailableResidueCount, 17781949);
  assert.equal(packet.availabilitySplit.firstAvailableResidue.tResidue, 0);
  assert.equal(packet.representativeAudit.factorCertificateId, 'p848_q17_p107_q89_p4217_factor_certificate');

  const obstruction = packet.firstAvailableSquareObstruction;
  assert.equal(obstruction.obstructionPrime, 61);
  assert.equal(obstruction.obstructionSquare, 3721);
  assert.deepEqual(obstruction.rootResiduesModuloObstructionSquare, [2371, 2474]);
  assert.equal(obstruction.tCongruence.residue, 42163704019);
  assert.equal(obstruction.tCongruence.modulus, 66170874169);
  assert.equal(obstruction.leftCongruence.residue, '169420141690585054358732178817328088519972453794407467571322168411530879091645805420092749757');
  assert.equal(obstruction.leftCongruence.modulus, '265884583394279840187007549369466635122108056254479559599229627196756604148422140623504536900');
  assert.equal(obstruction.endpoint.rightResidue, '169420141690585054358732178817328088519972453794407467571322168411530879091645805420092744668');
  assert.equal(obstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);
  assert.equal(packet.claims.disprovesUniversalAvailableResidueFamily, true);
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_available_square_obstruction_subclass');
});

test('problem 848 endpoint menu compiler preserves p4217/q61 lineage for repair probes', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'P848_q17_p107_q89_p4217_availability_split.json',
  );
  const packet = runCompiler([
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '227',
    '--fallback-primes',
    '',
    '--window',
    '28500',
    '--square-check',
    'trial',
    '--max-square-prime',
    '1000',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1');
  assert.equal(packet.status, 'representative_repair_found_availability_split_needed');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_q61_subclass');
  assert.equal(packet.target.blockedEndpointPrime, 4217);
  assert.equal(packet.target.blockedSquareDivisor, 3721);

  const repair = packet.firstRepair;
  assert.equal(repair.alternateEndpoint.prime, 227);
  assert.equal(repair.alternateEndpoint.k, 549);
  assert.equal(repair.alternateEndpoint.delta, -13739);
  assert.equal(repair.alternateEndpoint.right, '169420141690585054358732178817328088519972453794407467571322168411530879091645805420092736018');
  assert.equal(repair.availabilityRule.availableResidueCount, 1140);
  assert.equal(repair.availabilityRule.unavailableResidueCount, 50389);
  assert.equal(repair.availabilityRule.kFormulaInT, 'k_227(t) = (21306*t + 549) mod 51529');
  assert.equal(packet.recommendedNextAction, 'split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_q61_subclass_by_p227_availability');
});

test('problem 848 endpoint menu compiler emits the p83/q17 finite-menu successor atom', () => {
  const splitPacket = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'DYNAMIC_MARGIN_PROOFS',
    'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_availability_split.json',
  );
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-endpoint-menu-no-repair-'));
  const noRepairPacket = path.join(tempDir, 'p83-q17-no-repair.json');
  execFileSync('node', [
    compiler,
    '--availability-obstruction-repair',
    '--availability-split-packet',
    splitPacket,
    '--primes',
    '23,31,37,41,61,67,73,83',
    '--fallback-primes',
    '89,97,101,103,107,109,113,127,131,137,139,149,151',
    '--window',
    '28500',
    '--square-check',
    'trial',
    '--max-square-prime',
    '257',
    '--json-output',
    noRepairPacket,
  ], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  const packet = runCompiler([
    '--availability-obstruction-successor',
    '--obstruction-repair-packet',
    noRepairPacket,
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_endpoint_availability_obstruction_successor/1');
  assert.equal(packet.status, 'successor_atom_emitted');
  assert.equal(packet.activeAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_successor');
  assert.equal(packet.successorAtom.predecessorAtom, 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass');
  assert.equal(packet.successorAtom.blockedEndpointPrime, 83);
  assert.equal(packet.successorAtom.blockedSquareDivisor, 289);
  assert.equal(packet.successorAtom.tCongruence.expression, 't == 1384689 mod 1990921');
  assert.equal(packet.successorAtom.leftCongruence.expression, 'left == 70434973191454519683340203976042263775739957 mod 101272147580523754927494162392934891769280100');
  assert.equal(packet.finiteMenuNoRepairWitness.withinWindowUsableEndpointCount, 0);
  assert.equal(packet.finiteMenuNoRepairWitness.blockedWithinWindowEndpointCount, 9);
  assert.equal(packet.claims.emitsDeterministicSuccessorAtom, true);
  assert.equal(packet.claims.provesNoFiniteMenuRepresentativeRepair, true);
  assert.equal(packet.claims.provesAllPrimeNoRepair, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.recommendedNextAction, 'attack_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_successor_atom');
});
