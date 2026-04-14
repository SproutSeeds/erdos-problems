import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getFrontierResearchModesForSnapshot } from '../src/runtime/frontier.js';

const cli = '/Volumes/Code_2TB/code/erdos-problems/src/cli/index.js';
const repoRoot = path.dirname(path.dirname(path.dirname(cli)));

function runCli(args, options = {}) {
  return execFileSync('node', [cli, ...args], {
    encoding: 'utf8',
    cwd: options.cwd,
    maxBuffer: options.maxBuffer ?? 128 * 1024 * 1024,
  });
}

test('problem list shows seeded atlas including non-sunflower problems', () => {
  const output = runCli(['problem', 'list']);
  assert.match(output, /857/);
  assert.match(output, /20/);
  assert.match(output, /1/);
  assert.match(output, /18/);
  assert.match(output, /21/);
  assert.match(output, /1008/);
});

test('problem list filters by cluster', () => {
  const output = runCli(['problem', 'list', '--cluster', 'sunflower']);
  assert.match(output, /857/);
  assert.match(output, /536/);
  assert.doesNotMatch(output, /1008/);
});

test('problem list filters by repo status', () => {
  const output = runCli(['problem', 'list', '--repo-status', 'historical']);
  assert.match(output, /542/);
  assert.match(output, /1008/);
  assert.doesNotMatch(output, /857/);
});

test('problem list filters by harness depth', () => {
  const output = runCli(['problem', 'list', '--harness-depth', 'deep']);
  assert.match(output, /20/);
  assert.match(output, /857/);
  assert.doesNotMatch(output, /89/);
});

test('problem list filters by site status', () => {
  const output = runCli(['problem', 'list', '--site-status', 'solved']);
  assert.match(output, /542/);
  assert.match(output, /1008/);
  assert.doesNotMatch(output, /857/);
});

test('problem show 857 includes research state', () => {
  const output = runCli(['problem', 'show', '857']);
  assert.match(output, /Sunflower Conjecture/);
  assert.match(output, /active route: anchored_selector_linearization/);
});

test('problem show 1008 includes exact site badge', () => {
  const output = runCli(['problem', 'show', '1008']);
  assert.match(output, /Site badge: PROVED \(LEAN\)/);
});

test('problem artifacts shows canonical file inventory', () => {
  const output = runCli(['problem', 'artifacts', '857']);
  assert.match(output, /canonical artifacts/);
  assert.match(output, /problem.yaml: present/);
  assert.match(output, /PACK_CONTEXT.md: present/);
  assert.match(output, /Pack problem artifacts:/);
  assert.match(output, /Imported record available: yes/);
});

test('problem artifacts show starter loop artifacts for newly packaged dossiers', () => {
  const output = runCli(['problem', 'artifacts', '1']);
  assert.match(output, /Starter loop artifacts:/);
  assert.match(output, /AGENT_START.md: present/);
  assert.match(output, /ROUTES.md: present/);
  assert.match(output, /CHECKPOINT_NOTES.md: present/);
  assert.match(output, /Pack problem artifacts:/);
  assert.match(output, /CONTEXT.md: present/);
});

test('problem artifacts can emit json for agents with pack context and compute packets', () => {
  const output = runCli(['problem', 'artifacts', '857', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '857');
  assert.equal(payload.upstreamRecordIncluded, true);
  assert.equal(payload.canonicalArtifacts.length >= 5, true);
  assert.equal(payload.packProblemArtifacts.length >= 2, true);
  assert.equal(payload.computePackets.length >= 1, true);
  assert.equal(payload.computePackets[0].label, 'm8_exactness_cube_and_certificate_v0');
});

test('problem artifacts include the search/theorem bridge for 848', () => {
  const output = runCli(['problem', 'artifacts', '848', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '848');
  assert.equal(
    payload.packProblemArtifacts.some((artifact) => artifact.relativePath === 'SEARCH_THEOREM_BRIDGE.md'),
    true,
  );
  assert.equal(
    payload.packProblemArtifacts.some((artifact) => artifact.relativePath === 'SEARCH_THEOREM_BRIDGE.json'),
    true,
  );
});

test('problem theorem-loop exposes the bridge-backed theorem surface for 848', () => {
  const output = runCli(['problem', 'theorem-loop', '848', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '848');
  assert.equal(payload.theoremLoopMode, 'bridge_backed');
  assert.equal(payload.sourceKind, 'search_theorem_bridge');
  assert.equal(Array.isArray(payload.theoremHooks), true);
  assert.equal(payload.theoremHooks.length > 0, true);
  assert.equal(Array.isArray(payload.theoremAgenda), true);
  assert.equal(payload.theoremAgenda.length > 0, true);
  assert.equal(payload.theoremAgenda.some((item) => item.item_id === 'explain_next_unmatched_alignment'), true);
  assert.equal(payload.commands.sourceRefresh, 'erdos number-theory bridge-refresh 848');
});

test('problem claim-loop exposes the generalized bridge-backed claim surface for 848', () => {
  const output = runCli(['problem', 'claim-loop', '848', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '848');
  assert.equal(payload.claimLoopMode, 'bridge_backed');
  assert.equal(payload.sourceKind, 'theorem_loop_plus_bridge');
  assert.equal(Array.isArray(payload.featureExtractors), true);
  assert.equal(payload.featureExtractors.some((item) => item.extractor_id === 'search_theorem_bridge_state'), true);
  assert.equal(Array.isArray(payload.claimGenerators), true);
  assert.equal(payload.claimGenerators.some((item) => item.generator_id === 'p848_repair_obstruction_claims'), true);
  assert.equal(Array.isArray(payload.claimFalsifiers), true);
  assert.equal(payload.claimFalsifiers.some((item) => item.falsifier_id === 'exact_interval_counterexample_scan'), true);
  assert.equal(Array.isArray(payload.verifierAdapters), true);
  assert.equal(payload.verifierAdapters.some((item) => item.adapter_id === 'p848_family_repair_surface'), true);
  assert.equal(Array.isArray(payload.candidateClaims), true);
  assert.equal(payload.candidateClaims.some((item) => item.claim_id === 'p848_next_unmatched_alignment_claim'), true);
});

test('problem theorem-loop exposes a baseline theorem surface for number-theory starter problem 1', () => {
  const output = runCli(['problem', 'theorem-loop', '1', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '1');
  assert.equal(payload.theoremLoopMode, 'baseline');
  assert.equal(payload.sourceKind, 'pack_route_state');
  assert.equal(payload.currentState.currentClaimSurface, 'route_scaffolding');
  assert.equal(Array.isArray(payload.theoremHooks), true);
  assert.equal(payload.theoremHooks.length > 0, true);
  assert.equal(Array.isArray(payload.theoremAgenda), true);
  assert.equal(payload.theoremAgenda.length > 0, true);
  assert.equal(payload.theoremAgenda.some((item) => item.item_id === 'promote_ready_atom'), true);
});

test('problem claim-loop exposes a generalized baseline claim surface for number-theory starter problem 1', () => {
  const output = runCli(['problem', 'claim-loop', '1', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '1');
  assert.equal(payload.claimLoopMode, 'baseline');
  assert.equal(payload.sourceKind, 'theorem_loop_only');
  assert.equal(Array.isArray(payload.featureExtractors), true);
  assert.equal(payload.featureExtractors.some((item) => item.extractor_id === 'pack_route_state'), true);
  assert.equal(Array.isArray(payload.claimGenerators), true);
  assert.equal(payload.claimGenerators.some((item) => item.generator_id === 'baseline_route_claims'), true);
  assert.equal(Array.isArray(payload.claimFalsifiers), true);
  assert.equal(payload.claimFalsifiers.some((item) => item.falsifier_id === 'artifact_boundary_check'), true);
  assert.equal(Array.isArray(payload.verifierAdapters), true);
  assert.equal(payload.verifierAdapters.some((item) => item.adapter_id === 'canonical_artifact_reader'), true);
});

test('problem claim-loop-refresh writes canonical claim-loop artifacts', () => {
  const output = runCli(['problem', 'claim-loop-refresh', '1', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.problemId, '1');
  assert.match(payload.jsonPath, /packs\/number-theory\/problems\/1\/CLAIM_LOOP\.json$/);
  assert.match(payload.markdownPath, /packs\/number-theory\/problems\/1\/CLAIM_LOOP\.md$/);
  assert.equal(fs.existsSync(payload.jsonPath), true);
  assert.equal(fs.existsSync(payload.markdownPath), true);
});

test('problem claim-pass exposes the bridge-backed verdict surface for 848', () => {
  const output = runCli(['problem', 'claim-pass', '848', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '848');
  assert.equal(payload.claimPassMode, 'bridge_backed');
  assert.equal(payload.sourceKind, 'claim_loop_plus_bridge');
  assert.equal(Array.isArray(payload.hookAssessments), true);
  assert.equal(payload.hookAssessments.some((item) => item.hook_id === 'next_unmatched_equals_282_failure' && item.verdict === 'supported'), true);
  assert.equal(Array.isArray(payload.claimAssessments), true);
  assert.equal(payload.claimAssessments.some((item) => item.claim_id === 'p848_next_unmatched_alignment_claim' && item.verdict === 'supported'), true);
  assert.equal(payload.claimAssessments.some((item) => item.claim_id === 'choose_next_finite_gap_move' && item.verdict === 'actionable'), true);
  assert.equal(Array.isArray(payload.recommendations), true);
  assert.equal(payload.recommendations.some((item) => item.recommendation_id === 'formalize_282_alignment'), true);
});

test('problem claim-pass exposes a generalized baseline verdict surface for number-theory starter problem 1', () => {
  const output = runCli(['problem', 'claim-pass', '1', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '1');
  assert.equal(payload.claimPassMode, 'baseline');
  assert.equal(payload.sourceKind, 'claim_loop_only');
  assert.equal(Array.isArray(payload.hookAssessments), true);
  assert.equal(payload.hookAssessments.some((item) => item.hook_id === 'active_route_recorded' && item.verdict === 'supported'), true);
  assert.equal(Array.isArray(payload.claimAssessments), true);
  assert.equal(payload.claimAssessments.some((item) => item.claim_id === 'promote_ready_atom' && item.verdict === 'actionable'), true);
});

test('problem claim-pass-refresh writes canonical claim-pass artifacts', () => {
  const output = runCli(['problem', 'claim-pass-refresh', '1', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.problemId, '1');
  assert.match(payload.jsonPath, /packs\/number-theory\/problems\/1\/CLAIM_PASS\.json$/);
  assert.match(payload.markdownPath, /packs\/number-theory\/problems\/1\/CLAIM_PASS\.md$/);
  assert.equal(fs.existsSync(payload.jsonPath), true);
  assert.equal(fs.existsSync(payload.markdownPath), true);
});

test('problem formalization exposes the bridge-backed theorem packet for 848', () => {
  const output = runCli(['problem', 'formalization', '848', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '848');
  assert.equal(payload.formalizationMode, 'bridge_backed');
  assert.equal(payload.sourceKind, 'claim_pass_plus_bridge');
  assert.equal(payload.currentTarget.focusId, 'formalize_282_alignment');
  assert.match(payload.currentTarget.statement, /137720141/);
  assert.match(payload.currentTarget.statement, /282/);
  assert.match(payload.currentTarget.statement, /Checked finite-menu statement/);
  assert.equal(Array.isArray(payload.currentTarget.proofObligations), true);
  assert.equal(payload.currentTarget.proofObligations.some((item) => item.obligationId === 'define_shared_prefix_obstruction_class'), true);
  assert.equal(payload.currentTarget.proofObligations.some((item) => item.obligationId === 'explain_282_first_failure_mechanism' && item.status === 'done'), true);
  assert.equal(payload.currentTarget.proofObligations.some((item) => item.obligationId === 'lift_132_activation_schema_beyond_finite_menu' && item.status === 'ready'), true);
  assert.equal(payload.currentTarget.promotionCriteria.some((item) => item.criterionId === 'finite_menu_mechanism_checked' && item.status === 'done'), true);
  assert.equal(payload.currentTarget.evidenceBasis.some((item) => item.includes('p848_132_activation_row_certificate_checker_v1')), true);
  assert.equal(Array.isArray(payload.currentTarget.falsifierChecks), true);
  assert.equal(payload.currentTarget.falsifierChecks.some((item) => item.checkId === 'bridge_next_unmatched_stability'), true);
});

test('problem formalization-refresh writes canonical formalization artifacts', () => {
  const output = runCli(['problem', 'formalization-refresh', '1', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.problemId, '1');
  assert.match(payload.jsonPath, /packs\/number-theory\/problems\/1\/FORMALIZATION\.json$/);
  assert.match(payload.markdownPath, /packs\/number-theory\/problems\/1\/FORMALIZATION\.md$/);
  assert.equal(fs.existsSync(payload.jsonPath), true);
  assert.equal(fs.existsSync(payload.markdownPath), true);
});

test('problem formalization-work exposes the bridge-backed theorem work packet for 848', () => {
  const output = runCli(['problem', 'formalization-work', '848', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '848');
  assert.equal(payload.formalizationWorkMode, 'bridge_backed');
  assert.match(payload.formalizationWorkSvgPath, /packs\/number-theory\/problems\/848\/FORMALIZATION_WORK\.svg$/);
  assert.equal(payload.formalizationWorkSvgPresent, true);
  assert.equal(payload.currentWork.focusId, 'lift_132_activation_schema_beyond_finite_menu');
  assert.equal(payload.currentWork.packetData.representative, 137720141);
  assert.equal(payload.currentWork.packetData.tupleKey, '4, 23^2, 7^2, 9, 17^2, 11^2');
  assert.equal(payload.currentWork.packetData.tupleRowCrtDerivation.combinedResidue, 137720141);
  assert.equal(payload.currentWork.packetData.tupleRowCrtDerivation.combinedModulus, 32631532164);
  assert.equal(payload.currentWork.packetData.tupleRowCrtDerivation.projectedResidueModuloWitness, 504);
  assert.equal(payload.currentWork.packetData.tupleRowCrtDerivation.firstStableProjectionAnchor, 132);
  assert.equal(payload.currentWork.packetData.tupleRowCrtDerivation.steps.some((step) => step.anchor === 132 && step.residueModWitness === 504), true);
  assert.equal(Array.isArray(payload.currentWork.packetData.tupleRowActivationSequence), true);
  assert.equal(payload.currentWork.packetData.tupleRowActivationSequence.some((step) => step.anchor === 82 && step.matchingTrackedAnchors.length === 0), true);
  assert.equal(payload.currentWork.packetData.tupleRowActivationSequence.some((step) => step.anchor === 132 && step.uniqueTrackedMatch === 282), true);
  assert.equal(payload.currentWork.packetData.tupleRowActivationBoundary.pre132HasNoTrackedMatch, true);
  assert.equal(payload.currentWork.packetData.tupleRowActivationBoundary.activationIsUnique282, true);
  assert.equal(payload.currentWork.packetData.tupleRowActivationBoundary.preservationKeepsUnique282, true);
  assert.equal(payload.currentWork.packetData.menuActivationSurvey.rowsWith132TargetActivationCount, 17);
  assert.equal(payload.currentWork.packetData.menuActivationSurvey.targetActivationRows.length, 17);
  assert.equal(payload.currentWork.packetData.menuActivationSurvey.rowsWith132TargetActivationByFailingAnchor['282'], 1);
  assert.equal(payload.currentWork.packetData.menuActivationSurvey.rowsWith132TargetActivationByWitness['841'], 1);
  assert.equal(payload.currentWork.packetData.activationLemmaSchema.schemaId, 'p848_finite_menu_132_target_activation_schema_v1');
  assert.equal(payload.currentWork.packetData.activationLemmaSchema.scope.certifiedRowCount, 17);
  assert.equal(payload.currentWork.packetData.activationLemmaSchema.scope.universalClaim, false);
  assert.equal(payload.currentWork.packetData.activationLemmaSchema.hypotheses.length, 6);
  assert.equal(payload.currentWork.packetData.activationLemmaSchema.falsifierBoundary.length, 5);
  assert.equal(payload.currentWork.packetData.activationLemmaSchema.rowCertificates.length, 17);
  assert.equal(payload.currentWork.packetData.activationLemmaSchema.currentBoundaryInstance.activationBoundary.activationIsUnique282, true);
  assert.equal(payload.currentWork.packetData.activationLemmaCheck.status, 'passed');
  assert.equal(payload.currentWork.packetData.activationLemmaCheck.checkedRowCount, 17);
  assert.equal(payload.currentWork.packetData.activationLemmaCheck.failCount, 0);
  assert.equal(payload.currentWork.packetData.tupleRowLift132Proof.status, 'proved_from_tuple_row_crt');
  assert.equal(payload.currentWork.packetData.tupleRowLift132Proof.liftParameter, 147);
  assert.equal(payload.currentWork.packetData.tupleRowLift132Proof.liftedResidueModuloWitness, 504);
  assert.equal(payload.currentWork.packetData.tupleRowLift132Proof.failCount, 0);
  assert.equal(payload.currentWork.packetData.activationSchemaLiftDecision.verdict, 'finite_menu_certificate_not_universal_yet');
  assert.equal(payload.currentWork.packetData.activationSchemaLiftDecision.nextTheoremPass, 'formalize_top_repair_class_mechanism');
  assert.equal(payload.currentWork.packetData.activationSymbolicLiftCandidate.status, 'symbolic_crt_hypothesis_packet_ready');
  assert.equal(payload.currentWork.packetData.activationSymbolicLiftCandidate.checkedRowCount, 17);
  assert.equal(payload.currentWork.packetData.activationSymbolicLiftCandidate.failCount, 0);
  assert.equal(payload.currentWork.packetData.activationSymbolicLiftCandidate.scope.universalClaim, false);
  assert.equal(payload.currentWork.packetData.activationSymbolicLiftCandidate.symbolicHypotheses.length, 6);
  assert.equal(payload.currentWork.packetData.activationSymbolicLiftCandidate.symbolicHypotheses.some((row) => row.hypothesisId === 'S4_anchor_132_unique_target'), true);
  assert.equal(payload.currentWork.packetData.activationSymbolicLiftCandidate.finiteEvidence.rowSummaries.some((row) => row.failingAnchor === 282 && row.residueAt132 === 504), true);
  assert.equal(payload.currentWork.packetData.activationDomainClosureAssessment.status, 'broad_domain_closure_not_supported_yet');
  assert.equal(payload.currentWork.packetData.activationDomainClosureAssessment.broadClosureVerdict.failingAnchorCounts['832'], 3);
  assert.equal(payload.currentWork.packetData.activationDomainClosureAssessment.broadClosureVerdict.witnessCounts['529'], 4);
  assert.equal(payload.currentWork.packetData.activationDomainClosureAssessment.recommendedClosureLane.targetGroupId, 'anchor_832_witness_529');
  assert.equal(payload.currentWork.packetData.activationDomainClosureAssessment.narrowedClosureCandidates.some((row) => row.candidateId === 'p848_782_1232_strict_exchange_closure'), true);
  assert.equal(payload.currentWork.packetData.anchorWitnessDomainClosurePacket.status, 'finite_group_closure_certified_symbolic_domain_split');
  assert.equal(payload.currentWork.packetData.anchorWitnessDomainClosurePacket.checkedRowCount, 3);
  assert.equal(payload.currentWork.packetData.anchorWitnessDomainClosurePacket.failCount, 0);
  assert.equal(payload.currentWork.packetData.anchorWitnessDomainClosurePacket.targetFailureResidue, 316);
  assert.equal(payload.currentWork.packetData.anchorWitnessDomainClosurePacket.symbolicDomainDecision.verdict, 'single_profile_symbolic_domain_falsified_by_profile_split');
  assert.equal(payload.currentWork.packetData.anchorWitnessDomainClosurePacket.profileGroups.length, 2);
  assert.equal(payload.currentWork.packetData.anchorWitnessDomainClosurePacket.recommendedSuccessor.targetProfileId, 'pre132_7_1_32_224_57_229_82_412');
  assert.equal(payload.currentWork.packetData.anchorWitnessDomainClosurePacket.zeroLiftPreservation.allRowsAnchor182ZeroLift, true);
  assert.equal(payload.currentWork.packetData.anchorWitnessDomainClosurePacket.rowProofs.every((row) => row.status === 'passed' && row.anchor182LiftParameter === 0), true);
  assert.equal(payload.currentWork.packetData.anchorWitnessProfileSublanePacket.status, 'finite_profile_sublane_resolved_as_zero_lift_duplicate');
  assert.equal(payload.currentWork.packetData.anchorWitnessProfileSublanePacket.checkedRowCount, 2);
  assert.equal(payload.currentWork.packetData.anchorWitnessProfileSublanePacket.failCount, 0);
  assert.equal(payload.currentWork.packetData.anchorWitnessProfileSublanePacket.symbolicDomainDecision.verdict, 'profile_sublane_not_a_new_symbolic_family');
  assert.deepEqual(payload.currentWork.packetData.anchorWitnessProfileSublanePacket.familyIndices, [270, 271]);
  assert.equal(payload.currentWork.packetData.anchorWitnessProfileSublanePacket.checks.sameTuplePrefixThrough132, true);
  assert.equal(payload.currentWork.packetData.anchorWitnessProfileSublanePacket.checks.anchor182ZeroLiftForEveryRow, true);
  assert.deepEqual(payload.currentWork.packetData.topRepairClassMechanism.tieClass, [432, 782, 832]);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.sharedMetrics.repairedKnownPackets, 26);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.sharedMetrics.repairedPredictedFamilies, 242);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.sharedMetrics.sameRepairedPredictedFamilies, true);
  assert.deepEqual(payload.currentWork.packetData.topRepairClassMechanism.nearestContrasts.map((row) => row.continuation).slice(0, 3), [332, 382, 1232]);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.commonMissedPredictedRepresentatives.includes(210290957), true);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.commonMissedPredictedRepresentatives.includes(1229502607), true);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.status, 'finite_menu_plus2_replay_certified');
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.predictedFamilyCount, 255);
  assert.deepEqual(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.topTieCounts.map((row) => row.repairedPredictedFamilyCount), [242, 242, 242]);
  assert.deepEqual(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.primaryContrastCounts.map((row) => row.repairedPredictedFamilyCount), [240, 240, 240]);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.topTieSharedMissedPredictedRows.length, 9);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.pairwiseDeltas.length, 9);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.pairwiseDeltas.every((row) => row.netExtraRepairsForTop === 2), true);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.verifiedAgainstBridge.allPairwiseNetPlus2, true);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.strictDominancePairs.some((row) => row.topContinuation === 782 && row.contrastContinuation === 1232 && row.repairedByTopMissedByContrast.length === 2), true);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.mod50LaneSignature.status, 'finite_menu_mod50_lane_signature_certified');
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.mod50LaneSignature.checkedRowCount, 74);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.mod50LaneSignature.failCount, 0);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.mod50LaneSignature.continuationLaneIndices['782'], 15);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.mod50LaneSignature.continuationLaneIndices['1232'], 24);
  assert.equal(payload.currentWork.packetData.topRepairClassMechanism.separationAnalysis.mod50LaneSignature.strictDominanceRows.length, 2);
  assert.equal(payload.currentWork.packetData.mod50LaneSymbolicSchema.status, 'symbolic_bad_lane_schema_ready');
  assert.equal(payload.currentWork.packetData.mod50LaneSymbolicSchema.checkedRowCount, 74);
  assert.equal(payload.currentWork.packetData.mod50LaneSymbolicSchema.failCount, 0);
  assert.equal(payload.currentWork.packetData.mod50LaneSymbolicSchema.scope.universalDivisibilityClaim, true);
  assert.equal(payload.currentWork.packetData.mod50LaneSymbolicSchema.scope.universalSquarefreeRepairClaim, false);
  assert.equal(payload.currentWork.packetData.mod50LaneSymbolicSchema.strict782Vs1232Instances.length, 2);
  assert.equal(payload.currentWork.packetData.strict7821232HandoffPacket.status, 'finite_strict_handoff_certified_not_gap_closure');
  assert.equal(payload.currentWork.packetData.strict7821232HandoffPacket.checkedRowCount, 2);
  assert.equal(payload.currentWork.packetData.strict7821232HandoffPacket.failCount, 0);
  assert.equal(payload.currentWork.packetData.strict7821232HandoffPacket.netExtraRepairsForTop, 2);
  assert.equal(payload.currentWork.packetData.strict7821232HandoffPacket.topLaneIndex, 15);
  assert.equal(payload.currentWork.packetData.strict7821232HandoffPacket.contrastLaneIndex, 24);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('promoted into lemma schema')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('row certificates replay successfully')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('proved from tuple-row CRT equations')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('activation schema lift decision is explicit')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('symbolic CRT hypothesis packet')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('broad domain-closure overclaim is ruled out')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('anchor_832_witness_529 closure lane has been executed')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('single-profile symbolic closure over anchor_832_witness_529 is falsified')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('lift parameter 0 at anchor 182')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('pre132_7_1_32_224_57_229_82_412 sublane is closed')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('top repair-class mechanism packet')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('finite-menu +2 repaired-predicted-family separation is discharged')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('common missed-family replay is explicit')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('mod-50 lane-index congruences')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('mod-50 bad-lane congruence has been generalized')), true);
  assert.equal(payload.currentWork.dischargedWork.some((item) => item.includes('strict 782 > 1232 handoff is connected')), true);
  const latestVerifiedMax = Number(payload.currentState.latestVerifiedInterval.split('..')[1]);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.status, 'active');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.canonicalSurface, 'FORMALIZATION_WORK.currentWork');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.requestedActiveAtom.obligationId, 'D2_p13_matching_lower_bound');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C1_same_side_base_clique.status, 'proved_by_mod25_identity');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C1_same_side_base_clique.failCount, 0);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C2_two_cliques_plus_cross_edges.status, 'proved_by_c1_partition_decomposition');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C2_two_cliques_plus_cross_edges.failCount, 0);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C3_missing_cross_graph_definition.status, 'proved_by_definition');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C3_missing_cross_graph_definition.failCount, 0);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C4_clique_to_vertex_cover_duality.status, 'proved_by_clique_vertex_cover_complement');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C4_clique_to_vertex_cover_duality.failCount, 0);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C5_konig_matching_reduction.status, 'proved_by_konig_theorem');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C5_konig_matching_reduction.failCount, 0);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C6_mixed_clique_matching_formula.status, 'proved_by_vertex_cover_konig_composition');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.C6_mixed_clique_matching_formula.failCount, 0);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D1_residue_block_matching_injection.status, 'bounded_matching_saturation_extraction_certified');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D1_residue_block_matching_injection.failCount, 0);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D1_residue_block_matching_injection.scope.boundedRowCount, 1733);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D1_residue_block_matching_injection.primeSummaries.some((item) => item.p === 13 && item.minMatchingSlack === 19), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D1_residue_block_matching_injection.primeSummaries.some((item) => item.p === 17 && item.minMatchingSlack === 95), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D2_p13_split_core_witness_extraction.status, 'bounded_split_core_witness_certified');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D2_p13_split_core_witness_extraction.failCount, 0);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D2_p13_split_core_witness_extraction.scope.splitProfileCount, 3);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D2_p13_split_core_witness_extraction.profileSummary.every((item) => item.commonCoreMeetsMaxRequiredBound), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D2_p13_split_core_witness_extraction.profileSummary.every((item) => item.commonMatchingPairExportComplete), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D2_p13_split_core_witness_extraction.profileSummary.every((item) => item.commonMatchingPairs.length === item.commonMatchingPairCount), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D2_p13_split_core_witness_extraction.proofChecks.some((item) => item.checkId === 'split_common_core_pairs_exported' && item.passed), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D3_p17_split_core_witness_extraction.status, 'bounded_split_core_witness_certified');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D3_p17_split_core_witness_extraction.failCount, 0);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D3_p17_split_core_witness_extraction.scope.splitProfileCount, 2);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D3_p17_split_core_witness_extraction.profileSummary.every((item) => item.commonCoreMeetsMaxRequiredBound), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D3_p17_split_core_witness_extraction.profileSummary.every((item) => item.commonMatchingPairExportComplete), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D3_p17_split_core_witness_extraction.profileSummary.every((item) => item.commonMatchingPairs.length === item.commonMatchingPairCount), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.proofPackets.D3_p17_split_core_witness_extraction.proofChecks.some((item) => item.checkId === 'split_common_core_pairs_exported' && item.passed), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.activeAtomEvidence.candidateId, 'p848_D2_p13_matching_lower_bound_candidate_v1');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.activeAtomEvidence.scope.threatRowCount, 1285);
  assert.deepEqual(payload.currentWork.packetData.structuralLiftAtomicSurface.activeAtomEvidence.extractedTarget.requiredMatchingLowerBoundRange, [26, 90]);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.activeAtomEvidence.extractedTarget.minMatchingSlack, 19);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.matchingPatternArtifact.status, 'matching_pattern_witness_packet_ready');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.matchingPatternArtifact.targetPrime, 13);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.matchingPatternArtifacts.some((item) => item.targetPrime === 17 && item.witnessRowCount === 12), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.activeAtomEvidence.matchingPatternEvidence.witnessRowCount > 0, true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.activeAtomEvidence.matchingPatternEvidence.allReconstructedMatchesAgree, true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.activeAtomEvidence.matchingPatternEvidence.allWitnessesSaturateSmallerSide, true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.activeAtomEvidence.matchingPatternEvidence.patternSummary.splitProfiles.length > 0, true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.activeAtomEvidence.splitCoreWitnessPacket.status, 'bounded_split_core_witness_certified');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.activeAtomEvidence.splitCoreWitnessPacket.symbolicSubgoals.length, 3);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.dischargedAtoms.some((item) => item.obligationId === 'C1_same_side_base_clique'), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.dischargedAtoms.some((item) => item.obligationId === 'C2_two_cliques_plus_cross_edges'), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.dischargedAtoms.some((item) => item.obligationId === 'C3_missing_cross_graph_definition'), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.dischargedAtoms.some((item) => item.obligationId === 'C4_clique_to_vertex_cover_duality'), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.dischargedAtoms.some((item) => item.obligationId === 'C5_konig_matching_reduction'), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.dischargedAtoms.some((item) => item.obligationId === 'C6_mixed_clique_matching_formula'), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.dischargedAtoms.some((item) => item.obligationId === 'D1_residue_block_matching_injection'), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.dischargedAtoms.some((item) => item.obligationId === 'D2_p13_split_core_witness_extraction'), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.dischargedAtoms.some((item) => item.obligationId === 'D3_p17_split_core_witness_extraction'), true);
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.activeAtom.obligationId, 'D2_p13_matching_lower_bound');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.targetAtom.obligationId, 'D4_matching_bound_implies_sMaxMixed_bound');
  assert.equal(payload.currentWork.packetData.structuralLiftAtomicSurface.referenceBacklog.role, 'non_canonical_reference_backlog');
  assert.equal(payload.currentWork.proofObligations.some((item) => item.obligationId === 'D1_residue_block_matching_injection' && item.status === 'done'), true);
  assert.equal(payload.currentWork.proofObligations.some((item) => item.obligationId === 'D2_p13_matching_lower_bound' && item.status === 'in_progress'), true);
  assert.equal(payload.currentWork.proofObligations.some((item) => item.obligationId === 'D3_p17_matching_lower_bound' && item.status === 'ready'), true);
  assert.equal(payload.currentWork.proofObligations.some((item) => item.obligationId === 'D4_matching_bound_implies_sMaxMixed_bound' && item.status === 'blocked_by_D2_D3'), true);
  assert.equal(payload.currentWork.remainingGaps[0].includes('D2_p13_matching_lower_bound'), true);
  assert.equal(payload.currentWork.remainingGaps.some((gap) => gap.includes(`post-${latestVerifiedMax} verification lane`)), true);
  assert.equal(payload.currentWork.mechanismAssessment.competingHypotheses.some((row) => row.hypothesisId === 'one_off_modular_coincidence' && row.status === 'disfavored_by_menu_survey'), true);
  assert.equal(payload.currentWork.packetData.witnessSquareModulus, 841);
  assert.equal(payload.currentWork.packetData.representativeResidueModuloWitness, 504);
  assert.equal(payload.currentWork.packetData.firstFailingRepresentative, 137720141);
  assert.equal(payload.currentWork.packetData.witnessFirstOccurrence.firstRepresentative, 137720141);
  assert.equal(payload.currentWork.packetData.witnessFirstOccurrence.earlierZeroResidueCount, 0);
  assert.equal(payload.currentWork.mechanismAssessment.verdict, 'controlled_congruence_candidate');
  assert.equal(payload.currentWork.mechanismAssessment.caveats.some((item) => item.includes('row itself traverses all residue classes modulo 841')), true);
  assert.equal(payload.currentWork.mechanismAssessment.competingHypotheses.some((row) => row.hypothesisId === 'controlled_congruence_interaction' && row.status === 'favored'), true);
  assert.equal(payload.currentWork.mechanismAssessment.competingHypotheses.some((row) => row.hypothesisId === 'shared_prefix_row_alone_forces_841' && row.status === 'not_supported'), true);
  assert.equal(Array.isArray(payload.currentWork.packetData.priorRowsModuloWitness), true);
  assert.equal(payload.currentWork.packetData.sameTupleCount, 1);
  assert.equal(payload.currentWork.packetData.rowProgressionModuloWitness.gcdModulusWitness, 1);
  assert.equal(payload.currentWork.packetData.rowProgressionModuloWitness.traversesAllWitnessResidues, true);
  assert.equal(payload.currentWork.packetData.anchorCongruenceTable.some((row) => row.anchor === 282 && row.matchesRepresentativeResidue === true && row.requiredNResidueForFailure === 504), true);
  assert.equal(payload.currentWork.packetData.rowProgressionAnchorTable.some((row) => row.anchor === 282 && row.rowIndexForWitness === 0 && row.witnessOccursAtCurrentRepresentative === true), true);
  assert.equal(payload.currentWork.packetData.rowProgressionAnchorTable.some((row) => row.anchor === 232 && row.rowIndexForWitness === null && row.solvableAlongRowProgression === false), true);
  assert.equal(payload.currentWork.packetData.rowProgressionAnchorTable.some((row) => row.anchor === 332 && row.rowIndexForWitness === 67), true);
  assert.equal(payload.currentWork.packetData.rowStartDerivation282.normalizedEquation, 't ≡ 0 (mod 841)');
  assert.equal(payload.currentWork.packetData.rowStartDerivation282.representativeAlreadyOnWitnessClass, true);
  assert.equal(payload.currentWork.packetData.unsolvableContrast232.solvable, false);
  assert.match(payload.currentWork.packetData.unsolvableContrast232.divisibilityFailure, /29 does not divide 811/);
  assert.equal(payload.currentWork.packetData.nextSameRowWitnessFor282, 27443256270065);
  assert.equal(payload.currentWork.packetData.repairResidues.some((row) => row.anchor === 282 && row.residueModuloWitness === 0 && row.squarefree === false), true);
});

test('problem formalization-work-check certifies the 848 activation lemma rows', () => {
  const output = runCli(['problem', 'formalization-work-check', '848', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '848');
  assert.equal(payload.status, 'passed');
  assert.equal(payload.summary.checkCount, 18);
  assert.equal(payload.summary.checkedRowCount, 1984);
  assert.equal(payload.summary.failCount, 0);
  assert.equal(payload.checks[0].checkerId, 'p848_132_activation_row_certificate_checker_v1');
  assert.equal(payload.checks[0].rowChecks.every((row) => row.status === 'passed'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_132_lift_crt_checker_v1' && check.status === 'proved_from_tuple_row_crt'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_132_activation_symbolic_lift_candidate_checker_v1' && check.status === 'symbolic_crt_hypothesis_packet_ready'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_832_529_anchor_witness_domain_closure_checker_v1' && check.status === 'finite_group_closure_certified_symbolic_domain_split'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_832_529_pre132_profile_sublane_checker_v1' && check.status === 'finite_profile_sublane_resolved_as_zero_lift_duplicate'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_top_repair_plus2_family_menu_replay_checker_v1' && check.status === 'finite_menu_plus2_replay_certified'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_mod50_lane_bad_family_signature_checker_v1' && check.status === 'finite_menu_mod50_lane_signature_certified'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_mod50_bad_lane_symbolic_schema_checker_v1' && check.status === 'symbolic_bad_lane_schema_ready'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_782_1232_strict_handoff_checker_v1' && check.status === 'finite_strict_handoff_certified_not_gap_closure'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_C1_same_side_base_clique_checker_v1' && check.status === 'proved_by_mod25_identity'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_C2_two_cliques_plus_cross_edges_checker_v1' && check.status === 'proved_by_c1_partition_decomposition'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_C3_missing_cross_graph_definition_checker_v1' && check.status === 'proved_by_definition'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_C4_clique_to_vertex_cover_duality_checker_v1' && check.status === 'proved_by_clique_vertex_cover_complement'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_C5_konig_matching_reduction_checker_v1' && check.status === 'proved_by_konig_theorem'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_C6_mixed_clique_matching_formula_checker_v1' && check.status === 'proved_by_vertex_cover_konig_composition'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_D1_matching_saturation_bound_checker_v1' && check.status === 'bounded_matching_saturation_extraction_certified'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_D2_p13_split_core_witness_checker_v1' && check.status === 'bounded_split_core_witness_certified'), true);
  assert.equal(payload.checks.some((check) => check.checkerId === 'p848_D3_p17_split_core_witness_checker_v1' && check.status === 'bounded_split_core_witness_certified'), true);
});

test('problem formalization-work-refresh writes canonical formalization-work artifacts', () => {
  const output = runCli(['problem', 'formalization-work-refresh', '1', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.problemId, '1');
  assert.match(payload.jsonPath, /packs\/number-theory\/problems\/1\/FORMALIZATION_WORK\.json$/);
  assert.match(payload.markdownPath, /packs\/number-theory\/problems\/1\/FORMALIZATION_WORK\.md$/);
  assert.match(payload.svgPath, /packs\/number-theory\/problems\/1\/FORMALIZATION_WORK\.svg$/);
  assert.equal(fs.existsSync(payload.jsonPath), true);
  assert.equal(fs.existsSync(payload.markdownPath), true);
  assert.equal(fs.existsSync(payload.svgPath), true);
});

test('problem task-list exposes the canonical research loop for 848', () => {
  const output = runCli(['problem', 'task-list', '848', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '848');
  assert.equal(payload.taskListMode, 'bridge_backed');
  assert.equal(payload.executionRule.stance, 'concrete_execution');
  assert.equal(payload.executionRule.granularBreakdownMode.modeId, 'granular-breakdown');
  assert.match(payload.executionRule.granularBreakdownMode.fullBreakdownCommand, /orp mode breakdown granular-breakdown/);
  assert.match(payload.executionRule.granularBreakdownMode.nudgeCommand, /orp mode nudge granular-breakdown/);
  assert.equal(payload.granularBreakdownMode.status, 'core_loop_enabled');
  assert.equal(payload.granularBreakdownMode.modeId, 'granular-breakdown');
  assert.match(payload.granularBreakdownMode.commands.fullBreakdown, /--topic/);
  assert.match(payload.granularBreakdownMode.commands.fullBreakdown, /D2_p13_matching_lower_bound/);
  assert.match(payload.granularBreakdownMode.commands.nudge, /orp mode nudge granular-breakdown --json/);
  assert.equal(payload.granularBreakdownMode.outputContract.includes('Atomic Obligations'), true);
  assert.equal(payload.orpModeOverlays.status, 'core_loop_palette_enabled');
  assert.equal(payload.orpModeOverlays.defaultModeId, 'granular-breakdown');
  assert.match(payload.orpModeOverlays.selectionRule, /do not run every mode by default/);
  assert.equal(payload.orpModeOverlays.sourceCommand, 'orp mode list --json');
  assert.equal(payload.orpModeOverlays.overlays.length, 5);
  const overlayModeIds = payload.orpModeOverlays.overlays.map((item) => item.modeId);
  assert.equal(overlayModeIds.includes('granular-breakdown'), true);
  assert.equal(overlayModeIds.includes('ruthless-simplification'), true);
  assert.equal(overlayModeIds.includes('systems-constellation'), true);
  assert.equal(overlayModeIds.includes('bold-concept-generation'), true);
  assert.equal(overlayModeIds.includes('sleek-minimal-progressive'), true);
  assert.equal(
    payload.orpModeOverlays.overlays.some((item) => item.modeId === 'systems-constellation' && item.useWhen.includes('frontier-engine')),
    true,
  );
  assert.equal(
    payload.orpModeOverlays.overlays.some((item) => item.modeId === 'bold-concept-generation' && item.loopPlacement.includes('falsifier')),
    true,
  );
  assert.equal(payload.agentFlow.schema, 'erdos.problem_agent_flow/1');
  assert.equal(payload.agentFlow.status, 'ready');
  assert.equal(payload.agentFlow.audience, 'agent');
  assert.equal(payload.agentFlow.problemId, '848');
  assert.equal(
    [
      'start_singleton_p13_profile',
      'promote_d2_p13_all_n_handoff',
      'attack_d2_p13_row_universe_stratification_lift',
      'prove_d2_p13_slack_dominance_symbolic_lift',
      'prove_d2_p13_non_tight_side_count_slack_floor_lift',
      'attack_weakest_p13_side_count_floor_atom',
      'prove_weakest_p13_structural_margin_atom',
      'prove_weakest_p13_dmax_bound_atom',
      'attack_weakest_p13_dmax_growth_atom',
      'prove_weakest_p13_dmax_q2_progression_atom',
      'prove_weakest_p13_dmax_q3_progression_atom',
      'prove_weakest_p13_dmax_q5_progression_atom',
      'prove_weakest_p13_dmax_q7_progression_atom',
      'prove_weakest_p13_dmax_q11_progression_atom',
      'prove_weakest_p13_dmax_q19_progression_atom',
      'prove_weakest_p13_dmax_q23_progression_atom',
      'prove_weakest_p13_dmax_q31_progression_atom',
      'prove_weakest_p13_dmax_q251_progression_atom',
      'prove_weakest_p13_dmax_tail_recombination_atom',
      'prove_weakest_p13_dmax_tail_q17_progression_atom',
      'prove_weakest_p13_dmax_tail_q19_plus_progression_atom',
      'prove_weakest_p13_dmax_tail_q11_minus_progression_atom',
      'prove_weakest_p13_dmax_tail_q23_plus_progression_atom',
      'prove_weakest_p13_dmax_tail_q31_minus_progression_atom',
      'prove_weakest_p13_dmax_tail_q251_minus_progression_atom',
      'prove_weakest_p13_dmax_tail_q29_progression_atom',
      'prove_weakest_p13_dmax_tail_q37_progression_atom',
      'prove_weakest_p13_dmax_tail_q41_progression_atom',
      'prove_weakest_p13_dmax_tail_q43_progression_atom',
      'prove_weakest_p13_dmax_tail_q47_progression_atom',
      'prove_weakest_p13_dmax_tail_q53_progression_atom',
      'prove_weakest_p13_dmax_tail_q59_progression_atom',
      'prove_weakest_p13_dmax_tail_q61_progression_atom',
      'prove_weakest_p13_dmax_tail_q67_progression_atom',
      'prove_weakest_p13_dmax_tail_q71_progression_atom',
      'prove_weakest_p13_dmax_tail_q73_progression_atom',
      'prove_weakest_p13_dmax_tail_q79_progression_atom',
      'prove_weakest_p13_dmax_tail_q83_progression_atom',
      'prove_weakest_p13_dmax_tail_q89_progression_atom',
      'prove_weakest_p13_dmax_tail_q97_progression_atom',
      'prove_weakest_p13_dmax_tail_q101_progression_atom',
      'prove_weakest_p13_dmax_tail_q103_progression_atom',
      'prove_weakest_p13_dmax_tail_q107_progression_atom',
      'prove_weakest_p13_dmax_tail_q109_progression_atom',
      'prove_weakest_p13_dmax_tail_q113_progression_atom',
      'prove_weakest_p13_dmax_tail_q127_progression_atom',
      'prove_weakest_p13_dmax_tail_q131_progression_atom',
      'prove_weakest_p13_dmax_tail_q137_progression_atom',
      'prove_weakest_p13_dmax_tail_q139_progression_atom',
      'prove_weakest_p13_dmax_tail_q149_progression_atom',
      'prove_weakest_p13_dmax_tail_q151_progression_atom',
      'prove_weakest_p13_dmax_tail_q157_progression_atom',
      'prove_weakest_p13_dmax_tail_q163_progression_atom',
      'prove_weakest_p13_dmax_tail_q167_progression_atom',
      'prove_weakest_p13_dmax_tail_q173_progression_atom',
      'prove_weakest_p13_dmax_tail_q179_progression_atom',
      'prove_weakest_p13_dmax_tail_q181_progression_atom',
      'prove_weakest_p13_dmax_tail_q191_progression_atom',
      'prove_weakest_p13_dmax_tail_q193_progression_atom',
      'prove_weakest_p13_dmax_tail_q197_progression_atom',
      'prove_weakest_p13_dmax_tail_q199_progression_atom',
      'prove_weakest_p13_dmax_tail_q211_progression_atom',
      'prove_weakest_p13_dmax_tail_q223_progression_atom',
      'prove_weakest_p13_dmax_tail_q227_progression_atom',
      'prove_weakest_p13_dmax_tail_q229_progression_atom',
      'prove_weakest_p13_dmax_tail_q233_progression_atom',
      'prove_weakest_p13_dmax_tail_q239_progression_atom',
      'prove_weakest_p13_dmax_tail_q241_progression_atom',
      'prove_weakest_p13_dmax_tail_q257_progression_atom',
      'prove_weakest_p13_dmax_tail_q263_progression_atom',
      'prove_weakest_p13_dmax_tail_q269_progression_atom',
      'prove_weakest_p13_dmax_tail_q271_progression_atom',
      'prove_weakest_p13_dmax_tail_q277_progression_atom',
      'prove_weakest_p13_dmax_tail_q281_progression_atom',
      'prove_weakest_p13_dmax_tail_q283_progression_atom',
      'prove_weakest_p13_dmax_tail_q293_progression_atom',
      'prove_weakest_p13_dmax_tail_q307_progression_atom',
      'prove_weakest_p13_dmax_tail_q311_progression_atom',
      'prove_weakest_p13_dmax_tail_q313_progression_atom',
      'prove_weakest_p13_dmax_tail_q317_progression_atom',
      'prove_weakest_p13_dmax_tail_q331_progression_atom',
      'prove_weakest_p13_dmax_tail_q337_progression_atom',
      'prove_weakest_p13_dmax_tail_q347_progression_atom',
      'prove_weakest_p13_dmax_tail_q349_progression_atom',
      'prove_weakest_p13_dmax_tail_q353_progression_atom',
      'prove_weakest_p13_dmax_tail_q359_progression_atom',
      'prove_weakest_p13_dmax_tail_q367_progression_atom',
      'prove_weakest_p13_dmax_tail_q373_progression_atom',
      'prove_weakest_p13_dmax_tail_q379_progression_atom',
      'prove_weakest_p13_dmax_tail_q383_progression_atom',
      'prove_weakest_p13_dmax_tail_q389_progression_atom',
      'prove_weakest_p13_dmax_tail_q397_progression_atom',
      'prove_weakest_p13_dmax_tail_q401_progression_atom',
      'prove_weakest_p13_dmax_tail_q409_progression_atom',
      'prove_weakest_p13_dmax_tail_q419_progression_atom',
      'prove_weakest_p13_dmax_tail_q421_progression_atom',
      'prove_weakest_p13_dmax_tail_q431_progression_atom',
      'prove_weakest_p13_dmax_tail_q433_progression_atom',
      'prove_weakest_p13_dmax_tail_q439_progression_atom',
      'prove_weakest_p13_dmax_tail_q443_progression_atom',
      'prove_weakest_p13_dmax_tail_q449_progression_atom',
      'prove_weakest_p13_dmax_tail_q457_progression_atom',
      'prove_weakest_p13_dmax_tail_q461_progression_atom',
      'prove_weakest_p13_dmax_tail_q463_progression_atom',
      'prove_weakest_p13_dmax_tail_q467_progression_atom',
      'prove_weakest_p13_dmax_tail_q479_progression_atom',
      'prove_weakest_p13_dmax_tail_q487_progression_atom',
      'prove_weakest_p13_dmax_tail_q491_progression_atom',
      'prove_weakest_p13_dmax_tail_q499_progression_atom',
      'prove_weakest_p13_dmax_tail_q503_progression_atom',
      'prove_weakest_p13_dmax_tail_q509_progression_atom',
      'prove_weakest_p13_dmax_tail_q521_progression_atom',
      'prove_weakest_p13_dmax_tail_q523_progression_atom',
      'prove_weakest_p13_dmax_tail_q541_progression_atom',
      'prove_weakest_p13_dmax_tail_q547_progression_atom',
      'prove_weakest_p13_dmax_tail_q557_progression_atom',
      'prove_weakest_p13_dmax_tail_q563_progression_atom',
      'prove_weakest_p13_dmax_tail_q569_progression_atom',
      'prove_weakest_p13_dmax_tail_q571_progression_atom',
      'prove_weakest_p13_dmax_tail_q577_progression_atom',
      'prove_weakest_p13_dmax_tail_q587_progression_atom',
      'prove_p13_dmax_tail_q_ge_587_parametric_zero_floor_lift',
      'prove_p13_side18_residual_dynamic_margin_atom',
      'prove_p13_side18_residual_dynamic_margin_symbolic_lift',
      'prove_p13_dynamic_margin_exact_mixed_symbolic_lift',
      'prove_p13_dynamic_margin_exact_mixed_matching_injection',
	      'prove_p13_dynamic_margin_exact_mixed_matching_injection_parametric_lift',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_finite_augmenting_menu',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus1089_successor',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus39_successor',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_residue_parametric_delta_selection_lift',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_residue_direct_selector_lift',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_lift',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_menu',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_window_lift',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_right_compatibility_escape_lift',
			      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_small_prime_crt_escape_selector_lift',
				      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_p7_endpoint_cross_squarefree_fallback_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_squarefree_sieve_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_p7_shift_q17_residual_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_cross_bad_fallback_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_p13_expanded_fallback_menu_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_lift',
					    ].includes(payload.agentFlow.primaryNextAction.stepId),
    true,
  );
  assert.equal(payload.agentFlow.primaryNextAction.source, 'split_core_atomization_plan');
				  assert.match(payload.agentFlow.primaryNextAction.task, /singleton p13 split|D2 p13 lane|Stratify the p=13|slack-dominated|strictBaseThreshold|side-count floor atom|structural margin lemma|moving-term atom|dMax growth atom|q=2 dMax progression|q=3 dMax progression|q=5 dMax progression|q=7 dMax progression|q=11 dMax progression|q=19 dMax progression|q=23 dMax progression|q=31 dMax progression|q=251 dMax progression|dMax tail\/recombination atom|dMax tail q=17 progression atom|dMax tail plus-side q=19 progression atom|dMax tail minus-side q=11 progression atom|dMax tail plus-side q=23 progression atom|dMax tail minus-side q=31 progression atom|dMax tail minus-side q=251 progression atom|dMax tail q=29 progression atom|dMax tail q=37 progression atom|dMax tail q=41 progression atom|dMax tail q=43 progression atom|dMax tail q=47 progression atom|dMax tail q=53 progression atom|dMax tail q=59 progression atom|dMax tail q=61 progression atom|dMax tail q=67 progression atom|dMax tail q=71 progression atom|dMax tail q=73 progression atom|dMax tail q=79 progression atom|dMax tail q=83 progression atom|dMax tail q=89 progression atom|dMax tail q=97 progression atom|dMax tail q=101 progression atom|dMax tail q=103 progression atom|dMax tail q=107 progression atom|dMax tail q=109 progression atom|dMax tail q=113 progression atom|dMax tail q=127 progression atom|dMax tail q=131 progression atom|dMax tail q=137 progression atom|dMax tail q=139 progression atom|dMax tail q=149 progression atom|dMax tail q=151 progression atom|dMax tail q=157 progression atom|dMax tail q=163 progression atom|dMax tail q=167 progression atom|dMax tail q=173 progression atom|dMax tail q=179 progression atom|dMax tail q=181 progression atom|dMax tail q=191 progression atom|dMax tail q=193 progression atom|dMax tail q=197 progression atom|dMax tail q=199 progression atom|dMax tail q=211 progression atom|dMax tail q=223 progression atom|dMax tail q=227 progression atom|dMax tail q=229 progression atom|dMax tail q=233 progression atom|dMax tail q=239 progression atom|dMax tail q=241 progression atom|dMax tail q=257 progression atom|dMax tail q=263 progression atom|dMax tail q=269 progression atom|dMax tail q=271 progression atom|dMax tail q=277 progression atom|dMax tail q=281 progression atom|dMax tail q=283 progression atom|dMax tail q=293 progression atom|dMax tail q=307 progression atom|dMax tail q=311 progression atom|dMax tail q=313 progression atom|dMax tail q=317 progression atom|dMax tail q=331 progression atom|dMax tail q=337 progression atom|dMax tail q=347 progression atom|dMax tail q=349 progression atom|dMax tail q=353 progression atom|dMax tail q=359 progression atom|dMax tail q=367 progression atom|dMax tail q=373 progression atom|dMax tail q=379 progression atom|dMax tail q=383 progression atom|dMax tail q=389 progression atom|dMax tail q=397 progression atom|dMax tail q=401 progression atom|dMax tail q=409 progression atom|dMax tail q=419 progression atom|dMax tail q=421 progression atom|dMax tail q=431 progression atom|dMax tail q=433 progression atom|dMax tail q=439 progression atom|dMax tail q=443 progression atom|dMax tail q=449 progression atom|dMax tail q=457 progression atom|dMax tail q=461 progression atom|dMax tail q=463 progression atom|dMax tail q=467 progression atom|dMax tail q=479 progression atom|dMax tail q=487 progression atom|dMax tail q=491 progression atom|dMax tail q=499 progression atom|dMax tail q=503 progression atom|dMax tail q=509 progression atom|dMax tail q=521 progression atom|dMax tail q=523 progression atom|dMax tail q=541 progression atom|dMax tail q=547 progression atom|dMax tail q=557 progression atom|dMax tail q=563 progression atom|dMax tail q=569 progression atom|dMax tail q=571 progression atom|dMax tail q=577 progression atom|dMax tail q=587 progression atom|q>=587 tail atom|residual dynamic margin atom|exact mixed-margin successor atom|exact mixed-margin symbolic atom|matching-injection atom|parametric exact mixed matching-injection lift|finite augmenting-path menu|direct delta -1089 successor|direct delta -39 successor|residue-parametric delta-selection lift|residue direct-selector lift|selected cross-squarefree lift|selected cross-squarefree exception menu|selected cross-squarefree exception finite-window lift|right-compatibility escape lift|small-prime CRT escape selector|p=7 endpoint cross-squarefree fallback|period-shifted endpoint-menu|squarefree sieve|p7-shift q17 residual|q17 residual cross-bad fallback|q17 residual p13-expanded fallback|q17 residual window-relaxed fallback/);
  if (payload.agentFlow.primaryNextAction.stepId === 'start_singleton_p13_profile') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2.3_persist_outP2=99_out25=14_smaller=side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/D2_3_persist_outP2_99_out25_14_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'promote_d2_p13_all_n_handoff') {
    assert.equal(payload.agentFlow.primaryNextAction.packetId, 'D2_p13_matching_lower_bound');
    assert.match(payload.agentFlow.primaryNextAction.manifestJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/MANIFEST\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'attack_d2_p13_row_universe_stratification_lift') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_row_universe_stratification_lift');
    assert.equal(payload.agentFlow.primaryNextAction.packetId, 'D2_p13_row_universe_split_coverage');
    assert.match(payload.agentFlow.primaryNextAction.manifestJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/MANIFEST\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_d2_p13_slack_dominance_symbolic_lift') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_slack_dominance_symbolic_lift');
    assert.equal(payload.agentFlow.primaryNextAction.packetId, 'D2_p13_row_universe_split_coverage');
    assert.match(payload.agentFlow.primaryNextAction.manifestJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/MANIFEST\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_d2_p13_non_tight_side_count_slack_floor_lift') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_non_tight_side_count_slack_floor_lift');
    assert.equal(payload.agentFlow.primaryNextAction.packetId, 'D2_p13_row_universe_split_coverage');
    assert.match(payload.agentFlow.primaryNextAction.manifestJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/MANIFEST\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'attack_weakest_p13_side_count_floor_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_structural_margin_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_structural_margin_outP2_70_out25_23_smaller_side7_side18');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'attack_weakest_p13_dmax_growth_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_growth_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_q2_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_q2_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_q3_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_q3_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_q5_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_q5_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_q7_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_q7_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_q11_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_q11_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_q19_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_q19_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_q23_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_q23_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_q31_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_q31_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_q251_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_q251_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_recombination_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_recombination_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q17_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q17_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q19_plus_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q19_plus_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q11_minus_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q11_minus_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q23_plus_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q23_plus_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q31_minus_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q31_minus_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q251_minus_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q251_minus_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q29_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q29_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q37_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q37_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q41_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q41_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q43_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q43_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q47_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q47_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q53_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q53_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q59_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q59_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q61_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q61_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q67_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q67_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q71_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q71_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q73_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q73_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q79_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q79_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q83_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q83_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q89_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q89_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q97_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q97_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q101_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q101_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q103_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q103_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q107_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q107_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q109_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q109_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q113_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q113_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q127_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q127_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q131_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q131_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q137_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q137_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q139_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q139_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q149_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q149_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q151_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q151_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q157_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q157_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q163_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q163_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q167_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q167_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q173_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q173_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q179_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q179_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q181_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q181_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q191_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q191_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q193_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q193_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q197_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q197_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q199_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q199_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q211_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q211_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q223_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q223_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q227_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q227_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q229_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q229_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q233_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q233_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q239_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q239_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q241_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q241_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q257_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q257_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q263_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q263_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q269_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q269_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q271_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q271_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q277_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q277_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q281_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q281_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q283_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q283_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q293_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q293_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q307_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q307_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q311_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q311_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q313_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q313_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q317_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q317_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q331_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q331_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q337_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q337_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q347_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q347_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q349_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q349_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q353_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q353_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q359_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q359_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q367_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q367_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q373_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q373_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q379_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q379_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q383_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q383_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q389_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q389_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q397_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q397_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q401_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q401_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q409_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q409_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q419_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q419_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q421_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q421_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q431_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q431_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q433_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q433_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q439_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q439_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q443_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q443_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q449_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q449_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q457_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q457_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q461_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q461_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q463_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q463_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q467_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q467_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q479_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q479_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q487_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q487_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q491_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q491_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q499_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q499_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q503_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q503_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q509_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q509_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q521_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q521_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q523_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q523_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q541_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q541_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q547_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q547_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q557_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q557_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q563_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q563_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q569_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q569_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q571_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q571_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q577_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q577_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_weakest_p13_dmax_tail_q587_progression_atom') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q587_progression_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_side18_residual_dynamic_margin_atom') {
    assert.equal(
      [
        'D2_p13_dynamic_margin_outP2_70_out25_23_smaller_side7_side18',
        'D2_p13_dynamic_margin_exact_mixed_successor_outP2_70_out25_23_smaller_side7_outsider_6323',
      ].includes(payload.agentFlow.primaryNextAction.packetAtomId),
      true,
    );
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_side18_residual_dynamic_margin_symbolic_lift') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_residual_dynamic_margin_symbolic_lift_outP2_70_out25_23_smaller_side7_side18');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_symbolic_lift') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_symbolic_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_parametric_lift') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_parametric_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_finite_augmenting_menu') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_finite_augmenting_menu_outP2_70_out25_23_smaller_side7_outsider_6323');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
	  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus1089_successor') {
	    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus1089_successor_outP2_70_out25_23_smaller_side7_outsider_6323');
	    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
	  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus39_successor') {
	    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus39_successor_outP2_70_out25_23_smaller_side7_outsider_6323');
	    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
	  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_residue_parametric_delta_selection_lift') {
	    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_residue_parametric_delta_selection_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
	    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
	  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_residue_direct_selector_lift') {
	    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_residue_direct_selector_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
	    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
	  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_lift') {
	    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
	    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
	  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_menu') {
	    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_menu_outP2_70_out25_23_smaller_side7_outsider_6323_left_8107');
	    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
	  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_window_lift') {
	    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_window_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
	    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
	  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_right_compatibility_escape_lift') {
	    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_right_compatibility_escape_lift_outP2_70_out25_23_smaller_side7_outsider_6323_left_1138307');
	    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
	  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_small_prime_crt_escape_selector_lift') {
	    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_small_prime_crt_escape_selector_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
	    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
	  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_p7_endpoint_cross_squarefree_fallback_lift') {
	    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_p7_endpoint_cross_squarefree_fallback_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
	    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
		  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_lift') {
		    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
		    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
			  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_squarefree_sieve_lift') {
			    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_squarefree_sieve_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
			    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
				  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_p7_shift_q17_residual_lift') {
				    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_p7_shift_q17_residual_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
				    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
				  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_cross_bad_fallback_lift') {
				    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_cross_bad_fallback_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
				    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
				  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_p13_expanded_fallback_menu_lift') {
				    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_p13_expanded_fallback_menu_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
				    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
				  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_lift') {
				    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
				    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
			  } else if (payload.agentFlow.primaryNextAction.stepId === 'prove_p13_dynamic_margin_exact_mixed_matching_injection') {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_outP2_70_out25_23_smaller_side7_outsider_6323');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  } else {
    assert.equal(payload.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dmax_tail_q_ge_587_parametric_zero_floor_outP2_70_out25_23_smaller_side7');
    assert.match(payload.agentFlow.primaryNextAction.packetJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  }
  assert.equal(payload.agentFlow.primaryNextAction.command, null);
  assert.equal(payload.agentFlow.modePolicy.defaultAction, 'execute_primary_next_action');
  assert.equal(payload.agentFlow.modePolicy.doNotRunEveryMode, true);
  assert.match(payload.agentFlow.modePolicy.granularBreakdown.fullBreakdownCommand, /D2_p13_matching_lower_bound/);
  assert.match(payload.agentFlow.modePolicy.granularBreakdown.nudgeCommand, /orp mode nudge granular-breakdown --json/);
  assert.equal(payload.agentFlow.modePolicy.situationalOverlays.length, 4);
  assert.equal(payload.agentFlow.modePolicy.situationalOverlays.some((item) => item.modeId === 'systems-constellation'), true);
  assert.equal(payload.agentFlow.executionLoop.some((item) => item.includes('primaryNextAction')), true);
  assert.equal(payload.agentFlow.guardrails.some((item) => item.includes('paid or remote compute')), true);
  assert.equal(payload.agentFlow.writeback.refreshCommand, 'erdos problem task-list-refresh 848');
  assert.match(payload.executionRule.repetitionProtocol, /10 times or 100 times/);
  assert.equal(Array.isArray(payload.loopTemplate), true);
  assert.equal(payload.loopTemplate.some((item) => item.stepId === 'freeze_current_state'), true);
  assert.equal(payload.loopTemplate.some((item) => item.stepId === 'apply_granular_breakdown'), true);
  assert.equal(payload.loopTemplate.some((item) => item.stepId === 'refresh_and_rerank'), true);
  assert.equal(Array.isArray(payload.currentTasks), true);
  assert.equal(payload.currentTasks.some((item) => item.taskId === 'apply_granular_breakdown'), true);
  assert.equal(payload.currentTasks.some((item) => item.taskId === 'execute_current_work_packet'), true);
  assert.equal(Array.isArray(payload.completedAnchors), true);
  assert.equal(payload.completedAnchors.length > 0, true);
  assert.equal(Array.isArray(payload.nextNeededSteps), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'formalization_work'), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'exact_breakpoint_certificate'), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'finite_gap_strategy'), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'external_structural_verifier_audit'), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'structural_base_side_scout'), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'structural_two_side_scout'), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'mixed_base_failure_scout'), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'full_mixed_base_structural_verifier'), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'structural_lift_miner'), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'split_core_atomization_plan'), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'structural_lift_checklist'), false);
  const latestVerifiedMax = Number(payload.currentState.latestVerifiedInterval.split('..')[1]);
  assert.equal(payload.finiteGapStrategy.status, 'ready');
  assert.equal(payload.finiteGapStrategy.verdict, 'exact_endpoint_rollout_is_not_a_sole_all_N_closure_strategy');
  assert.equal(payload.finiteGapStrategy.operationalThreshold.raw, '2.64 x 10^17');
  assert.equal(payload.finiteGapStrategy.endpointCertificate.interval, `1..${latestVerifiedMax}`);
  assert.match(payload.finiteGapStrategy.projectedEndpointChecksToOperationalThresholdLabel, /,/);
  assert.equal(payload.splitCoreAtomizationPlan.status, 'active');
  assert.equal(payload.splitCoreAtomizationPlan.scope.splitAtomCount, 5);
  assert.equal(payload.splitCoreAtomizationPlan.scope.d2SplitCount, 3);
  assert.equal(payload.splitCoreAtomizationPlan.scope.d3SplitCount, 2);
  assert.equal(payload.splitCoreAtomizationPlan.packetManifest.packetCount, 5);
  assert.match(payload.splitCoreAtomizationPlan.packetManifest.directoryPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS$/);
  assert.equal(payload.splitCoreAtomizationPlan.packetManifest.firstPacketToAttack, 'D2.3_persist_outP2=99_out25=14_smaller=side7');
  assert.equal(payload.splitCoreAtomizationPlan.mostConfusingPart.firstPlaceToAttack, 'D2.3_persist_outP2=99_out25=14_smaller=side7');
  assert.equal(payload.splitCoreAtomizationPlan.splitAtoms.every((atom) => atom.commonMatchingPairExportComplete), true);
  assert.equal(payload.splitCoreAtomizationPlan.splitAtoms.every((atom) => atom.commonMatchingPairs.length === atom.commonMatchingPairCount), true);
  assert.equal(payload.splitCoreAtomizationPlan.splitAtoms.every((atom) => Boolean(atom.packetArtifact?.jsonPath)), true);
  assert.equal(payload.splitCoreAtomizationPlan.splitAtoms.every((atom) => Boolean(atom.packetArtifact?.markdownPath)), true);
  assert.equal(payload.splitCoreAtomizationPlan.masterLayers.some((layer) => layer.layerId === 'A2_full_common_core_pair_export' && layer.status === 'done'), true);
  assert.equal(payload.splitCoreAtomizationPlan.masterLayers.some((layer) => layer.layerId === 'A3_vertex_presence_atoms' && layer.status === 'next'), true);
  assert.equal(payload.splitCoreAtomizationPlan.masterLayers.some((layer) => layer.layerId === 'A5_congruence_persistence_atoms'), true);
  assert.equal(payload.splitCoreAtomizationPlan.adjacentAtomizedLayers.some((layer) => layer.layerId === 'B2_vertex_formula_extraction'), true);
  assert.equal(payload.splitCoreAtomizationPlan.recommendedImmediateTasks[0].taskId, 'implement_full_common_core_pair_export');
  assert.equal(payload.splitCoreAtomizationPlan.recommendedImmediateTasks[0].status, 'done');
  assert.equal(payload.splitCoreAtomizationPlan.recommendedImmediateTasks.some((task) => task.taskId === 'emit_split_atom_packets' && task.status === 'done'), true);
  assert.equal(payload.structuralVerifierAudit.status, 'blocked');
  assert.equal(payload.structuralVerifierAudit.blockerIds.includes('sawhney_handoff_not_claimed_at_1e7'), true);
  assert.equal(payload.structuralVerifierAudit.blockerIds.includes('base_exchange_mask_covers_both_principal_sides'), true);
  assert.equal(payload.baseSideScout.status, 'counterexample_to_global_7_side_domination_found');
  assert.equal(payload.baseSideScout.summary.maxSide18ExceedsSide7, true);
  assert.equal(payload.baseSideScout.firstNWithSide18MaxExceedingSide7.N, 143);
  assert.equal(payload.structuralTwoSideScout.status, 'side_specific_bounds_pass_but_union_bound_fails');
  assert.equal(payload.structuralTwoSideScout.summary.allSide7ChecksPass, true);
  assert.equal(payload.structuralTwoSideScout.summary.allSide18ChecksPass, true);
  assert.equal(payload.structuralTwoSideScout.summary.allUnionChecksPass, false);
  assert.equal(payload.mixedBaseFailureScout.status, 'sampled_union_failures_repaired_by_mixed_base_clique');
  assert.equal(payload.mixedBaseFailureScout.summary.allAnalyzedRowsMixedPass, true);
  assert.equal(payload.mixedBaseFailureScout.summary.mixedFailureCount, 0);
  assert.equal(payload.fullMixedBaseStructuralVerifier.status, 'bounded_full_mixed_base_structural_verifier_certified');
  assert.equal(payload.fullMixedBaseStructuralVerifier.summary.allMixedChecksPass, true);
  assert.equal(payload.fullMixedBaseStructuralVerifier.summary.mixedFailureCount, 0);
  assert.equal(payload.fullMixedBaseStructuralVerifier.summary.threatLiftMiningRowCount, 1733);
  assert.equal(payload.structuralLiftMiner.status, 'structural_lift_obligation_packet_ready');
  assert.equal(payload.structuralLiftMiner.summary.coverageComplete, true);
  assert.equal(payload.structuralLiftMiner.summary.threatMiningRowCount, 1733);
  assert.equal(payload.structuralLiftMiner.summary.minThreatMatchingSlack, 19);
  assert.equal(payload.structuralLiftMiner.summary.primaryExactPrimes.includes(13), true);
  assert.equal(payload.structuralLiftChecklist.status, 'active');
  assert.equal(payload.structuralLiftChecklist.currentFocus.targetStepId, 'D4_matching_bound_implies_sMaxMixed_bound');
  assert.equal(payload.structuralLiftChecklist.currentFocus.firstActionableStepId, 'D2_p13_matching_lower_bound');
  assert.equal(payload.currentTasks.some((item) => item.taskId === 'discharge_first_remaining_gap' && item.task.includes('D2_p13_matching_lower_bound')), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'formalization_work' && item.task.includes('D2_p13_matching_lower_bound')), true);
  assert.equal(payload.nextNeededSteps.some((item) => item.source === 'formalization_work' && item.task.includes(`post-${latestVerifiedMax} verification lane`)), true);
  const regimesText = fs.readFileSync(path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'VERIFICATION_REGIMES.md'), 'utf8');
  assert.match(regimesText, new RegExp(`Regime A: exact interval \`1\\.\\.${latestVerifiedMax}\``));
  assert.match(regimesText, new RegExp(`directly beyond \`${latestVerifiedMax}\``));
  const exactResults = JSON.parse(fs.readFileSync(path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', `EXACT_SMALL_N_1_${latestVerifiedMax}_RESULTS.json`), 'utf8'));
  assert.equal(exactResults.results.length, latestVerifiedMax);
  assert.equal(exactResults.results[0].N, 1);
  assert.equal(exactResults.results.at(-1).N, latestVerifiedMax);
  assert.equal(exactResults.results.every((row, index) => row.N === index + 1), true);
  assert.equal(exactResults.mergeAudit?.outputRowCount, latestVerifiedMax);
  assert.equal(exactResults.mergeAudit?.conflictingDuplicateCount, 0);
  const breakpointScout = JSON.parse(fs.readFileSync(path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'EXACT_BREAKPOINT_SCOUT.json'), 'utf8'));
  assert.equal(breakpointScout.summary.interval, `1..${latestVerifiedMax}`);
  assert.equal(breakpointScout.summary.rowCount, latestVerifiedMax);
  assert.equal(breakpointScout.summary.duplicateCount, 0);
  assert.equal(breakpointScout.boundary.claimLevel, 'scout_not_proof');
  const breakpointCertificate = JSON.parse(fs.readFileSync(path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'EXACT_BREAKPOINT_CERTIFICATE.json'), 'utf8'));
  assert.equal(breakpointCertificate.summary.interval, `1..${latestVerifiedMax}`);
  assert.equal(breakpointCertificate.status, 'certified_from_endpoint_monotonicity');
  assert.equal(breakpointCertificate.summary.allEndpointChecksCertified, true);
  assert.equal(breakpointCertificate.lemma.name, 'candidate_size_plateau_endpoint_monotonicity');
  assert.match(payload.sources.exactBreakpointScoutJsonPath, /packs\/number-theory\/problems\/848\/EXACT_BREAKPOINT_SCOUT\.json$/);
  assert.match(payload.sources.exactBreakpointCertificateJsonPath, /packs\/number-theory\/problems\/848\/EXACT_BREAKPOINT_CERTIFICATE\.json$/);
  assert.match(payload.sources.externalStructuralVerifierAuditJsonPath, /packs\/number-theory\/problems\/848\/EXTERNAL_STRUCTURAL_VERIFIER_AUDIT\.json$/);
  assert.match(payload.sources.baseSideScoutJsonPath, /packs\/number-theory\/problems\/848\/BASE_SIDE_SCOUT\.json$/);
  assert.match(payload.sources.structuralTwoSideScoutJsonPath, /packs\/number-theory\/problems\/848\/STRUCTURAL_TWO_SIDE_SCOUT\.json$/);
  assert.match(payload.sources.mixedBaseFailureScoutJsonPath, /packs\/number-theory\/problems\/848\/MIXED_BASE_FAILURE_SCOUT\.json$/);
  assert.match(payload.sources.fullMixedBaseStructuralVerifierJsonPath, /packs\/number-theory\/problems\/848\/FULL_MIXED_BASE_STRUCTURAL_VERIFIER\.json$/);
  assert.match(payload.commands.taskList, /erdos problem task-list 848/);
  assert.match(payload.commands.taskListRefresh, /erdos problem task-list-refresh 848/);
  assert.match(payload.commands.orpModeList, /orp mode list --json/);
  assert.match(payload.commands.granularBreakdown, /orp mode breakdown granular-breakdown/);
  assert.match(payload.commands.granularNudge, /orp mode nudge granular-breakdown/);
});

test('problem task-list-refresh emits 848 split atom packet files', () => {
  const output = runCli(['problem', 'task-list-refresh', '848', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.problemId, '848');
  assert.equal(payload.splitAtomPacketWrite.ok, true);
  assert.equal(payload.splitAtomPacketWrite.packetCount, 5);
  assert.equal(payload.splitAtomPacketWrite.successorPacketCount, 29);
  assert.match(payload.splitAtomPacketWrite.manifestJsonPath, /packs\/number-theory\/problems\/848\/SPLIT_ATOM_PACKETS\/MANIFEST\.json$/);
  assert.equal(fs.existsSync(payload.splitAtomPacketWrite.manifestJsonPath), true);
  const manifest = JSON.parse(fs.readFileSync(payload.splitAtomPacketWrite.manifestJsonPath, 'utf8'));
  assert.equal(manifest.schema, 'erdos.p848_split_atom_packet_manifest/1');
  assert.equal(manifest.packetCount, 5);
  assert.equal(manifest.successorPacketCount, 29);
  assert.equal(manifest.firstPrimeLaneHandoffCandidate.laneId, 'D2_p13_matching_lower_bound');
  assert.equal(manifest.firstPrimeLaneHandoffCandidate.status, 'prime_lane_handoff_candidate_with_open_all_n_gaps');
  assert.equal(manifest.firstPrimeLaneHandoffCandidate.readySplitPacketCount, 3);
  assert.equal(manifest.firstPrimeLaneHandoffCandidate.splitPacketCount, 3);
  assert.equal(manifest.firstPrimeLaneHandoffCandidate.verifiedSuccessorFamilyCount, 29);
  assert.equal(manifest.firstPrimeLaneHandoffCandidate.totalRefinementConditionCount, 29);
  assert.equal(manifest.firstPrimeLaneHandoffCandidate.promotesAllNClaim, false);
  assert.equal(manifest.firstPrimeLaneHandoffCandidate.theoremCandidate.openAllNHandoffGaps[0].gapId, 'row_universe_split_coverage');
  assert.equal(manifest.firstPacketToAttack.vertexPresenceRefinementConditionCount, 10);
  assert.equal(manifest.firstPacketToAttack.edgeObstructionCertificateStatus, 'literal_edge_obstruction_certificate_verified');
  assert.equal(manifest.firstPacketToAttack.edgeObstructionResidueSummary.mod25ClassCount, 1);
  assert.equal(manifest.firstPacketToAttack.edgeCongruencePersistenceStatus, 'literal_constant_edge_persistence_verified');
  assert.equal(manifest.firstPacketToAttack.matchingKEnvelopeCertificateStatus, 'literal_matching_sampled_k_envelope_verified');
  assert.equal(manifest.firstPacketToAttack.splitDischargeReadinessStatus, 'split_discharge_readiness_candidate');
  assert.equal(manifest.successorPackets.every((packet) => packet.symbolicVertexFamilyLemmaStatus === 'symbolic_vertex_family_lemma_verified'), true);
  assert.equal(manifest.firstPacketToAttack.atomId, 'D2.3_persist_outP2=99_out25=14_smaller=side7');
  assert.equal(manifest.firstSuccessorPacketToAttack.successorAtomId, 'D2.1_persist_outP2=70_out25=9_smaller=side7.square_4_out_1');
  assert.equal(manifest.packets.every((packet) => fs.existsSync(packet.jsonPath)), true);
  assert.equal(manifest.packets.every((packet) => fs.existsSync(packet.markdownPath)), true);
  assert.equal(manifest.successorPackets.every((packet) => fs.existsSync(packet.jsonPath)), true);
  assert.equal(manifest.successorPackets.every((packet) => fs.existsSync(packet.markdownPath)), true);
  const firstPacket = JSON.parse(fs.readFileSync(manifest.firstPacketToAttack.jsonPath, 'utf8'));
  assert.equal(firstPacket.schema, 'erdos.p848_split_atom_packet/1');
  assert.equal(firstPacket.atomId, 'D2.3_persist_outP2=99_out25=14_smaller=side7');
  assert.equal(firstPacket.matchingCore.commonMatchingPairs.length, firstPacket.matchingCore.commonMatchingPairCount);
  assert.equal(firstPacket.edgeObstructionAtoms.length, firstPacket.matchingCore.commonMatchingPairCount);
  assert.equal(firstPacket.edgeObstructionCertificate.status, 'literal_edge_obstruction_certificate_verified');
  assert.equal(firstPacket.edgeObstructionCertificate.edgeAtomCount, 108);
  assert.equal(firstPacket.edgeObstructionCertificate.squarefreeEdgeAtomCount, 108);
  assert.equal(firstPacket.edgeObstructionCertificate.nonSquarefreeEdgeAtomCount, 0);
  assert.equal(firstPacket.edgeObstructionCertificate.residueSummary.mod25ClassCount, 1);
  assert.equal(firstPacket.edgeObstructionCertificate.residueSummary.primeResidueClassCount > 0, true);
  assert.equal(firstPacket.edgeObstructionCertificate.firstEdgeCertificates.length > 0, true);
  assert.equal(firstPacket.edgeCongruencePersistence.status, 'literal_constant_edge_persistence_verified');
  assert.equal(firstPacket.edgeCongruencePersistence.proofKind, 'constant_pair_squarefree_invariant');
  assert.equal(firstPacket.edgeCongruencePersistence.edgeAtomCount, 108);
  assert.equal(firstPacket.edgeCongruencePersistence.verifiedEdgeAtomCount, 108);
  assert.equal(firstPacket.edgeCongruencePersistence.failedEdgeAtomCount, 0);
  assert.equal(firstPacket.edgeCongruencePersistence.dependsOnSampledN, false);
  assert.equal(firstPacket.edgeCongruencePersistence.proofFamilies[0].status, 'congruence_persistence_family_verified');
  assert.equal(firstPacket.matchingDisjointness.status, 'bounded_disjointness_certified');
  assert.equal(firstPacket.kEnvelope.status, 'bounded_core_meets_sampled_K_envelope');
  assert.equal(firstPacket.matchingKEnvelopeCertificate.status, 'literal_matching_sampled_k_envelope_verified');
  assert.equal(firstPacket.matchingKEnvelopeCertificate.matchingProof.status, 'literal_matching_disjointness_verified');
  assert.equal(firstPacket.matchingKEnvelopeCertificate.kEnvelopeProof.status, 'sampled_k_envelope_dominated_by_literal_core');
  assert.equal(firstPacket.matchingKEnvelopeCertificate.kEnvelopeProof.inequality, '108 >= 88');
  assert.equal(firstPacket.matchingKEnvelopeCertificate.kEnvelopeProof.boundedSlackAgainstMaxK, 20);
  assert.equal(firstPacket.splitDischargeReadiness.status, 'split_discharge_readiness_candidate');
  assert.equal(firstPacket.splitDischargeReadiness.theoremCandidate.status, 'candidate_with_open_all_n_handoff_gaps');
  assert.equal(firstPacket.splitDischargeReadiness.blockingChecks.length, 0);
  assert.equal(firstPacket.splitDischargeReadiness.openAllNHandoffGaps.length, 3);
  assert.equal(firstPacket.splitDischargeReadiness.lowerLayerChecks.every((check) => !check.status.includes('blocked')), true);
  assert.equal(firstPacket.vertexPresenceSummary.witnessRowCount, 1);
  assert.equal(firstPacket.vertexPresenceSummary.needsSharperSplitOrParametricWitnessCount > 0, true);
  assert.equal(firstPacket.vertexPresenceAtoms.some((atom) => atom.status === 'needs_sharper_split_or_parametric_presence_witness'), true);
  assert.equal(firstPacket.vertexPresenceRefinement.status, 'literal_core_requires_sharper_square_witness_split');
  assert.equal(firstPacket.vertexPresenceRefinement.deterministicMove, 'emit_successor_atoms_by_square_witness_residue');
  assert.equal(firstPacket.vertexPresenceRefinement.unstableAtomCount, 212);
  assert.equal(firstPacket.vertexPresenceRefinement.coveredUnstableAtomCount, 212);
  assert.equal(firstPacket.vertexPresenceRefinement.uncoveredUnstableAtomCount, 0);
  const outMod4Condition = firstPacket.vertexPresenceRefinement.conditions.find((condition) => (
    condition.square === 4 && condition.requiredOutsiderResidueModSquare === 1
  ));
  assert.equal(outMod4Condition.atomCount, 145);
  assert.equal(outMod4Condition.currentSplitCompatibility.compatibleWithCurrentSplit, true);
  assert.equal(outMod4Condition.successorSplitKey, 'outP2=99|out25=14|smaller=side7|out4=1');
  const outMod9Condition = firstPacket.vertexPresenceRefinement.conditions.find((condition) => (
    condition.square === 9 && condition.requiredOutsiderResidueModSquare === 7
  ));
  assert.equal(outMod9Condition.atomCount, 49);
  assert.equal(outMod9Condition.currentSplitCompatibility.compatibleWithCurrentSplit, true);
  assert.equal(outMod9Condition.successorSplitKey, 'outP2=99|out25=14|smaller=side7|out9=7');
  const firstSuccessor = JSON.parse(fs.readFileSync(manifest.firstSuccessorPacketToAttack.jsonPath, 'utf8'));
  assert.equal(firstSuccessor.schema, 'erdos.p848_split_atom_successor_packet/1');
  assert.equal(firstSuccessor.conditionId, 'square_4_outsider_1');
  assert.equal(firstSuccessor.status, 'candidate_successor_obligation_verified');
  assert.equal(firstSuccessor.parentAtomId, 'D2.1_persist_outP2=70_out25=9_smaller=side7');
  assert.equal(firstSuccessor.splitRefinement.successorSplitKey, 'outP2=70|out25=9|smaller=side7|out4=1');
  assert.equal(firstSuccessor.checks.affectedAtomCount, 145);
  assert.equal(firstSuccessor.checks.stabilizedAtomCount, 145);
  assert.equal(firstSuccessor.checks.failedAtomCount, 0);
  assert.equal(firstSuccessor.symbolicVertexFamilyLemma.status, 'symbolic_vertex_family_lemma_verified');
  assert.equal(firstSuccessor.symbolicVertexFamilyLemma.vertexResidueModSquare, 3);
  assert.equal(firstSuccessor.symbolicVertexFamilyLemma.verifiedAtomCount, 145);
  assert.equal(firstSuccessor.symbolicVertexFamilyLemma.failedAtomCount, 0);
  const secondSuccessor = JSON.parse(fs.readFileSync(manifest.successorPackets[1].jsonPath, 'utf8'));
  assert.equal(secondSuccessor.conditionId, 'square_9_outsider_8');
  assert.equal(secondSuccessor.status, 'candidate_successor_obligation_verified');
  assert.equal(secondSuccessor.parentAtomId, 'D2.1_persist_outP2=70_out25=9_smaller=side7');
  assert.equal(secondSuccessor.checks.affectedAtomCount, 48);
  assert.equal(secondSuccessor.checks.stabilizedAtomCount, 48);
  assert.equal(secondSuccessor.symbolicVertexFamilyLemma.status, 'symbolic_vertex_family_lemma_verified');
  assert.equal(secondSuccessor.symbolicVertexFamilyLemma.vertexResidueModSquare, 1);
  assert.equal(secondSuccessor.symbolicVertexFamilyLemma.verifiedAtomCount, 48);
  assert.equal(secondSuccessor.symbolicVertexFamilyLemma.failedAtomCount, 0);
  const lastSuccessor = JSON.parse(fs.readFileSync(manifest.successorPackets.at(-1).jsonPath, 'utf8'));
  assert.equal(lastSuccessor.conditionId, 'square_7921_outsider_1789');
  assert.equal(lastSuccessor.status, 'candidate_successor_obligation_verified');
  assert.equal(lastSuccessor.checks.affectedAtomCount, 1);
  assert.equal(lastSuccessor.symbolicVertexFamilyLemma.status, 'symbolic_vertex_family_lemma_verified');
  assert.equal(lastSuccessor.symbolicVertexFamilyLemma.verifiedAtomCount, 1);
  assert.equal(
    [
      'gap_1',
      'emit_singleton_edge_obstruction_certificate',
      'promote_singleton_edge_congruence_persistence',
      'promote_singleton_matching_disjointness_and_k_envelope',
      'assemble_singleton_split_discharge_readiness',
      'attack_next_p13_split_profile',
      'promote_d2_p13_all_n_handoff',
      'attack_d2_p13_row_universe_stratification_lift',
      'prove_d2_p13_slack_dominance_symbolic_lift',
      'prove_d2_p13_non_tight_side_count_slack_floor_lift',
      'attack_weakest_p13_side_count_floor_atom',
      'prove_weakest_p13_structural_margin_atom',
      'prove_weakest_p13_dmax_bound_atom',
      'attack_weakest_p13_dmax_growth_atom',
      'prove_weakest_p13_dmax_q2_progression_atom',
      'prove_weakest_p13_dmax_q3_progression_atom',
      'prove_weakest_p13_dmax_q5_progression_atom',
      'prove_weakest_p13_dmax_q7_progression_atom',
      'prove_weakest_p13_dmax_q11_progression_atom',
      'prove_weakest_p13_dmax_q19_progression_atom',
      'prove_weakest_p13_dmax_q23_progression_atom',
      'prove_weakest_p13_dmax_q31_progression_atom',
      'prove_weakest_p13_dmax_q251_progression_atom',
      'prove_weakest_p13_dmax_tail_recombination_atom',
      'prove_weakest_p13_dmax_tail_q17_progression_atom',
      'prove_weakest_p13_dmax_tail_q19_plus_progression_atom',
      'prove_weakest_p13_dmax_tail_q11_minus_progression_atom',
      'prove_weakest_p13_dmax_tail_q23_plus_progression_atom',
      'prove_weakest_p13_dmax_tail_q31_minus_progression_atom',
      'prove_weakest_p13_dmax_tail_q251_minus_progression_atom',
      'prove_weakest_p13_dmax_tail_q29_progression_atom',
      'prove_weakest_p13_dmax_tail_q37_progression_atom',
      'prove_weakest_p13_dmax_tail_q41_progression_atom',
      'prove_weakest_p13_dmax_tail_q43_progression_atom',
      'prove_weakest_p13_dmax_tail_q47_progression_atom',
      'prove_weakest_p13_dmax_tail_q53_progression_atom',
      'prove_weakest_p13_dmax_tail_q59_progression_atom',
      'prove_weakest_p13_dmax_tail_q61_progression_atom',
      'prove_weakest_p13_dmax_tail_q67_progression_atom',
      'prove_weakest_p13_dmax_tail_q71_progression_atom',
      'prove_weakest_p13_dmax_tail_q73_progression_atom',
      'prove_weakest_p13_dmax_tail_q79_progression_atom',
      'prove_weakest_p13_dmax_tail_q83_progression_atom',
      'prove_weakest_p13_dmax_tail_q89_progression_atom',
      'prove_weakest_p13_dmax_tail_q97_progression_atom',
      'prove_weakest_p13_dmax_tail_q101_progression_atom',
      'prove_weakest_p13_dmax_tail_q103_progression_atom',
      'prove_weakest_p13_dmax_tail_q107_progression_atom',
      'prove_weakest_p13_dmax_tail_q109_progression_atom',
      'prove_weakest_p13_dmax_tail_q113_progression_atom',
      'prove_weakest_p13_dmax_tail_q127_progression_atom',
      'prove_weakest_p13_dmax_tail_q131_progression_atom',
      'prove_weakest_p13_dmax_tail_q137_progression_atom',
      'prove_weakest_p13_dmax_tail_q139_progression_atom',
      'prove_weakest_p13_dmax_tail_q149_progression_atom',
      'prove_weakest_p13_dmax_tail_q151_progression_atom',
      'prove_weakest_p13_dmax_tail_q157_progression_atom',
      'prove_weakest_p13_dmax_tail_q163_progression_atom',
      'prove_weakest_p13_dmax_tail_q167_progression_atom',
      'prove_weakest_p13_dmax_tail_q173_progression_atom',
      'prove_weakest_p13_dmax_tail_q179_progression_atom',
      'prove_weakest_p13_dmax_tail_q181_progression_atom',
      'prove_weakest_p13_dmax_tail_q191_progression_atom',
      'prove_weakest_p13_dmax_tail_q193_progression_atom',
      'prove_weakest_p13_dmax_tail_q197_progression_atom',
      'prove_weakest_p13_dmax_tail_q199_progression_atom',
      'prove_weakest_p13_dmax_tail_q211_progression_atom',
      'prove_weakest_p13_dmax_tail_q223_progression_atom',
      'prove_weakest_p13_dmax_tail_q227_progression_atom',
      'prove_weakest_p13_dmax_tail_q229_progression_atom',
      'prove_weakest_p13_dmax_tail_q233_progression_atom',
      'prove_weakest_p13_dmax_tail_q239_progression_atom',
      'prove_weakest_p13_dmax_tail_q241_progression_atom',
      'prove_weakest_p13_dmax_tail_q257_progression_atom',
      'prove_weakest_p13_dmax_tail_q263_progression_atom',
      'prove_weakest_p13_dmax_tail_q269_progression_atom',
      'prove_weakest_p13_dmax_tail_q271_progression_atom',
      'prove_weakest_p13_dmax_tail_q277_progression_atom',
      'prove_weakest_p13_dmax_tail_q281_progression_atom',
      'prove_weakest_p13_dmax_tail_q283_progression_atom',
      'prove_weakest_p13_dmax_tail_q293_progression_atom',
      'prove_weakest_p13_dmax_tail_q307_progression_atom',
      'prove_weakest_p13_dmax_tail_q311_progression_atom',
      'prove_weakest_p13_dmax_tail_q313_progression_atom',
      'prove_weakest_p13_dmax_tail_q317_progression_atom',
      'prove_weakest_p13_dmax_tail_q331_progression_atom',
      'prove_weakest_p13_dmax_tail_q337_progression_atom',
      'prove_weakest_p13_dmax_tail_q347_progression_atom',
      'prove_weakest_p13_dmax_tail_q349_progression_atom',
      'prove_weakest_p13_dmax_tail_q353_progression_atom',
      'prove_weakest_p13_dmax_tail_q359_progression_atom',
      'prove_weakest_p13_dmax_tail_q367_progression_atom',
      'prove_weakest_p13_dmax_tail_q373_progression_atom',
      'prove_weakest_p13_dmax_tail_q379_progression_atom',
      'prove_weakest_p13_dmax_tail_q383_progression_atom',
      'prove_weakest_p13_dmax_tail_q389_progression_atom',
      'prove_weakest_p13_dmax_tail_q397_progression_atom',
      'prove_weakest_p13_dmax_tail_q401_progression_atom',
      'prove_weakest_p13_dmax_tail_q409_progression_atom',
      'prove_weakest_p13_dmax_tail_q419_progression_atom',
      'prove_weakest_p13_dmax_tail_q421_progression_atom',
      'prove_weakest_p13_dmax_tail_q431_progression_atom',
      'prove_weakest_p13_dmax_tail_q433_progression_atom',
      'prove_weakest_p13_dmax_tail_q439_progression_atom',
      'prove_weakest_p13_dmax_tail_q443_progression_atom',
      'prove_weakest_p13_dmax_tail_q449_progression_atom',
      'prove_weakest_p13_dmax_tail_q457_progression_atom',
      'prove_weakest_p13_dmax_tail_q461_progression_atom',
      'prove_weakest_p13_dmax_tail_q463_progression_atom',
      'prove_weakest_p13_dmax_tail_q467_progression_atom',
      'prove_weakest_p13_dmax_tail_q479_progression_atom',
      'prove_weakest_p13_dmax_tail_q487_progression_atom',
      'prove_weakest_p13_dmax_tail_q491_progression_atom',
      'prove_weakest_p13_dmax_tail_q499_progression_atom',
      'prove_weakest_p13_dmax_tail_q503_progression_atom',
      'prove_weakest_p13_dmax_tail_q509_progression_atom',
      'prove_weakest_p13_dmax_tail_q521_progression_atom',
      'prove_weakest_p13_dmax_tail_q523_progression_atom',
      'prove_weakest_p13_dmax_tail_q541_progression_atom',
      'prove_weakest_p13_dmax_tail_q547_progression_atom',
      'prove_weakest_p13_dmax_tail_q557_progression_atom',
      'prove_weakest_p13_dmax_tail_q563_progression_atom',
      'prove_weakest_p13_dmax_tail_q569_progression_atom',
      'prove_weakest_p13_dmax_tail_q571_progression_atom',
      'prove_weakest_p13_dmax_tail_q577_progression_atom',
      'prove_weakest_p13_dmax_tail_q587_progression_atom',
      'prove_p13_dmax_tail_q_ge_587_parametric_zero_floor_lift',
      'prove_p13_side18_residual_dynamic_margin_atom',
      'prove_p13_side18_residual_dynamic_margin_symbolic_lift',
      'prove_p13_dynamic_margin_exact_mixed_symbolic_lift',
      'prove_p13_dynamic_margin_exact_mixed_matching_injection',
	      'prove_p13_dynamic_margin_exact_mixed_matching_injection_parametric_lift',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_finite_augmenting_menu',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus1089_successor',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus39_successor',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_residue_parametric_delta_selection_lift',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_residue_direct_selector_lift',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_lift',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_menu',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_window_lift',
		      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_right_compatibility_escape_lift',
			      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_small_prime_crt_escape_selector_lift',
				      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_p7_endpoint_cross_squarefree_fallback_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_squarefree_sieve_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_p7_shift_q17_residual_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_cross_bad_fallback_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_p13_expanded_fallback_menu_lift',
					      'prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_lift',
					    ].includes(payload.taskList.agentFlow.primaryNextAction.stepId),
    true,
  );
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.allPacketFilesPresent, true);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.allSuccessorPacketFilesPresent, true);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.verifiedSuccessorFamilyCount, 29);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.allMaterializedSuccessorFamiliesVerified, true);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.p13SplitDischargeReadyPacketCount, 3);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.allP13SplitDischargeReady, true);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.p13PrimeLaneHandoffStatus, 'prime_lane_handoff_candidate_with_open_all_n_gaps');
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.p13PrimeLaneHandoffFirstOpenGap, 'row_universe_split_coverage');
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.p13RowUniverseCoverageStatus, 'bounded_row_universe_stratified_tight_splits_plus_slack_dominated_remainder');
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.p13RowUniverseCoverageScope, 'bounded_p13_threat_rows_tight_splits_plus_slack_dominated_remainder');
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.p13RowUniverseFirstMissingAtom, 'D2_p13_slack_dominance_symbolic_lift');
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.p13SlackDominanceLiftStatus, 'bounded_slack_formula_replay_verified_symbolic_side_count_lift_needed');
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.p13SlackDominanceFirstOpenLemma, 'D2_p13_non_tight_side_count_slack_floor_lift');
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.sideCountFloorPacketCount, 2);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.firstSideCountFloorPacketToAttack, 'D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7');
  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.firstSideCountFloorStructuralMarginLemma, 'D2_p13_structural_margin_outP2_70_out25_23_smaller_side7_side18');
				  assert.equal(payload.taskList.splitCoreAtomizationPlan.packetManifest.firstSideCountFloorMovingTermSubatom, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.currentCoverage.threatRowCount, 1285);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.currentCoverage.tightWitnessRowCount, 12);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.currentCoverage.boundedThreatRowsOutsideTightWitnessPacket, 1273);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.currentCoverage.boundedThreatRowsCoveredByEmittedTightSplitStrata, 96);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.currentCoverage.boundedThreatRowsOutsideEmittedTightSplitStrata, 1189);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.currentCoverage.boundedThreatRowsSlackDominatedOutsideTightSplitStrata, 1189);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.currentCoverage.boundedThreatRowsNeedingAdditionalSplitPacket, 0);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.boundedStratificationAudit.splitStratumCount, 52);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.boundedStratificationAudit.emittedTightSplitCoveredRowCount, 96);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.boundedStratificationAudit.outsideTightSplitRowCount, 1189);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.boundedStratificationAudit.minEmittedTightSplitSlack, 19);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.boundedStratificationAudit.minOutsideSlack, 21);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.boundedStratificationAudit.outsideRowsNeedingAdditionalSplitPacket, 0);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.rowUniverseCoverage.emittedMissingAtom.atomId, 'D2_p13_slack_dominance_symbolic_lift');
  assert.equal(payload.taskList.splitCoreAtomizationPlan.slackDominanceSymbolicLift.status, 'bounded_slack_formula_replay_verified_symbolic_side_count_lift_needed');
  assert.equal(payload.taskList.splitCoreAtomizationPlan.slackDominanceSymbolicLift.boundedRowCount, 1189);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.slackDominanceSymbolicLift.boundedStratumCount, 49);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.slackDominanceSymbolicLift.targetNonTightSlackLowerBound, 20);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.slackDominanceSymbolicLift.observedMinNonTightSlack, 21);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.slackDominanceSymbolicLift.failedFormulaReplayRowCount, 0);
  assert.equal(payload.taskList.splitCoreAtomizationPlan.slackDominanceSymbolicLift.firstOpenSymbolicLemma.lemmaId, 'D2_p13_non_tight_side_count_slack_floor_lift');
				  assert.equal(payload.taskList.agentFlow.primaryNextAction.packetAtomId, 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_lift_outP2_70_out25_23_smaller_side7_outsider_6323');
  assert.match(payload.taskList.agentFlow.primaryNextAction.packetJsonPath, /SIDE_COUNT_FLOOR\/D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7\.json$/);
  assert.equal(
    [
      null,
      'literal_constant_edge_persistence_verified',
    ].includes(payload.taskList.splitCoreAtomizationPlan.packetManifest.firstPacketEdgeCongruencePersistenceStatus),
    true,
  );
  assert.equal(
    [
      null,
      'literal_matching_sampled_k_envelope_verified',
    ].includes(payload.taskList.splitCoreAtomizationPlan.packetManifest.firstPacketMatchingKEnvelopeCertificateStatus),
    true,
  );
  assert.equal(
    [
      null,
      'split_discharge_readiness_candidate',
    ].includes(payload.taskList.splitCoreAtomizationPlan.packetManifest.firstPacketSplitDischargeReadinessStatus),
    true,
  );
});

test('problem task-list-refresh writes canonical task-list artifacts', () => {
  const output = runCli(['problem', 'task-list-refresh', '1', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.problemId, '1');
  assert.match(payload.jsonPath, /packs\/number-theory\/problems\/1\/TASK_LIST\.json$/);
  assert.match(payload.markdownPath, /packs\/number-theory\/problems\/1\/TASK_LIST\.md$/);
  assert.equal(fs.existsSync(payload.jsonPath), true);
  assert.equal(fs.existsSync(payload.markdownPath), true);
});

test('problem task-list default output gives a frictionless next-step readout', () => {
  const output = runCli(['problem', 'task-list', '1']);
  assert.match(output, /Highest-value next step: gap_1 \[next\]/);
  assert.match(output, /Next command: erdos problem formalization-work-refresh 1/);
  assert.match(output, /Mode assist: Execute the next command first; if the target feels fuzzy, run orp mode nudge granular-breakdown --json\./);
  assert.match(output, /Optional overlays when useful: ruthless-simplification, systems-constellation, bold-concept-generation, sleek-minimal-progressive/);
});

test('problem task-list-refresh default output keeps the next action visible', () => {
  const output = runCli(['problem', 'task-list-refresh', '1']);
  assert.match(output, /Problem task-list refresh: complete/);
  assert.match(output, /Highest-value next step: gap_1 \[next\]/);
  assert.match(output, /Next command: erdos problem formalization-work-refresh 1/);
  assert.match(output, /Mode assist: Execute the next command first/);
});

test('problem task-list-run executes repeated passes and writes loop-run artifacts', () => {
  const output = runCli(['problem', 'task-list-run', '1', '--passes', '3', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.problemId, '1');
  assert.equal(payload.requestedPasses, 3);
  assert.equal(payload.executedPasses >= 1, true);
  assert.equal(Array.isArray(payload.passes), true);
  assert.equal(payload.passes.length >= 1, true);
  assert.match(payload.jsonPath, /packs\/number-theory\/problems\/1\/TASK_LOOP_RUN\.json$/);
  assert.match(payload.markdownPath, /packs\/number-theory\/problems\/1\/TASK_LOOP_RUN\.md$/);
  assert.equal(fs.existsSync(payload.jsonPath), true);
  assert.equal(fs.existsSync(payload.markdownPath), true);
  assert.equal(typeof payload.stopReason, 'string');
});

test('problem task-list-run can continue after convergence while preserving the first convergence pass', () => {
  const output = runCli(['problem', 'task-list-run', '1', '--passes', '4', '--no-stop-on-convergence', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.requestedPasses, 4);
  assert.equal(payload.executedPasses, 4);
  assert.equal(payload.converged, true);
  assert.equal(payload.convergedAtPass, 2);
  assert.equal(payload.stopReason, 'requested_pass_limit_reached');
});

test('frontier doctor exposes the bundled optional runtime', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-frontier-doctor-'));
  const output = runCli(['frontier', 'doctor', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.bundledEnginePresent, true);
  assert.equal(payload.bundledEnginePyprojectPresent, true);
  assert.equal(payload.bundledEngineCliPresent, true);
  assert.match(payload.bundledEngineRoot, /research\/frontier-engine$/);
  assert.equal(payload.commands.setupBase, 'erdos frontier setup --base');
  assert.equal(payload.commands.setupCpu, 'erdos frontier setup --cpu');
  assert.equal(payload.commands.createBrev, 'erdos frontier create-brev <name> --gpu-name H100 --dry-run');
  assert.equal(payload.commands.createBrevFleet, 'erdos frontier create-brev-fleet <fleet-id> --type hyperstack_H100 --count 2 --dry-run');
  assert.equal(payload.commands.attachBrev, 'erdos frontier attach-brev --instance <name> --apply');
  assert.equal(payload.commands.enablePaidRemote, 'erdos frontier enable-paid-remote <remote-id>');
  assert.equal(payload.commands.enablePaidFleet, 'erdos frontier enable-paid-fleet <fleet-id>');
  assert.equal(payload.commands.syncSsh, 'erdos frontier sync-ssh --apply');
  assert.equal(payload.commands.syncFleet, 'erdos frontier sync-fleet <fleet-id> --lane p848_anchor_ladder --apply');
  assert.equal(payload.managedFrontierReady, false);
  assert.equal(payload.frontierLoopMode, null);
  assert.equal(payload.researchModes.bridgeRefresh.available, true);
  assert.equal(payload.researchModes.bridgeRefresh.mode, 'system');
  assert.equal(payload.researchModes.familySearch.available, false);
  assert.equal(payload.researchModes.heavySearch.available, false);
});

test('frontier research modes prefer a local managed GPU before an attached paid remote by default', () => {
  const modes = getFrontierResearchModesForSnapshot({
    frontierLoopOptIn: true,
    managedFrontierReady: true,
    gpuSearchReady: true,
    selectedRemoteId: null,
    remote: {
      attached: true,
      provider: 'brev',
      instanceName: 'erdos-p848-h100',
      paidRung: true,
      paidEnabled: true,
      gpuSearchReady: true,
    },
  });

  assert.equal(modes.heavySearch.available, true);
  assert.equal(modes.heavySearch.source, 'managed_runtime');
  assert.equal(modes.heavySearch.mode, 'gpu');
});

test('frontier research modes honor an explicit remote selection for a paid rung when enabled', () => {
  const modes = getFrontierResearchModesForSnapshot({
    frontierLoopOptIn: true,
    managedFrontierReady: true,
    gpuSearchReady: true,
    selectedRemoteId: 'erdos-p848-h100',
    remote: {
      attached: true,
      provider: 'brev',
      instanceName: 'erdos-p848-h100',
      paidRung: true,
      paidEnabled: true,
      gpuSearchReady: true,
    },
  });

  assert.equal(modes.heavySearch.available, true);
  assert.equal(modes.heavySearch.source, 'ssh_remote');
  assert.equal(modes.heavySearch.mode, 'gpu');
});

test('cli help lists the SSH sync command for frontier-engine', () => {
  const output = runCli(['help']);
  assert.match(output, /erdos problem theorem-loop \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem theorem-loop-refresh \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem claim-loop \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem claim-loop-refresh \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem claim-pass \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem claim-pass-refresh \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem formalization \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem formalization-refresh \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem formalization-work \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem formalization-work-refresh \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem task-list \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem task-list-refresh \[<id>\] \[--json\]/);
  assert.match(output, /erdos problem task-list-run \[<id>\] \[--passes <n>\] \[--no-stop-on-convergence\] \[--json\]/);
  assert.match(output, /erdos frontier create-brev <name> \[--gpu-name <name>\] \[--type <type>\] \[--provider <provider>\] \[--count <n>\] \[--attach\] \[--enable-paid-rung\] \[--sync-lane <lane-id>\] \[--dry-run\] \[--apply\] \[--json\]/);
  assert.match(output, /erdos frontier create-brev-fleet <fleet-id> \[--gpu-name <name>\] \[--type <type>\] \[--provider <provider>\] \[--count <n>\] \[--attach\] \[--enable-paid-rung\] \[--sync-lane <lane-id>\] \[--dry-run\] \[--apply\] \[--json\]/);
  assert.match(output, /erdos frontier attach-brev --instance <name> \[--remote-id <id>\] \[--ssh-host <host>\] \[--engine-root <path>\] \[--python-command <cmd>\] \[--enable-paid-rung\] \[--apply\] \[--json\]/);
  assert.match(output, /erdos frontier enable-paid-remote <remote-id> \[--json\]/);
  assert.match(output, /erdos frontier enable-paid-fleet <fleet-id> \[--json\]/);
  assert.match(output, /erdos frontier sync-ssh \[--remote-id <id>\] \[--ssh-host <host>\] \[--engine-root <path>\] \[--python-command <cmd>\] \[--lane <lane-id>\] \[--apply\] \[--json\]/);
  assert.match(output, /erdos frontier sync-fleet <fleet-id> \[--lane <lane-id>\] \[--apply\] \[--json\]/);
  assert.match(output, /erdos frontier sessions \[--json\]/);
  assert.match(output, /erdos frontier session <session-id> \[--json\]/);
  assert.match(output, /erdos frontier stop-session <session-id> \[--json\]/);
  assert.match(output, /erdos number-theory dispatch \[<id>\] \[--apply\] \[--detach\] \[--review-after-hours <n>\] \[--remote-id <id>\] \[--external-source-dir <path>\]/);
  assert.match(output, /erdos number-theory dispatch-fleet \[<id>\] --fleet <fleet-id> \[--apply\] \[--review-after-hours <n>\] \[--strategy <id>\] \[--action <id>\] \[--json\]/);
  assert.match(output, /erdos number-theory fleet-run <run-id> \[--json\]/);
});

test('frontier attach-brev derives an SSH host from the instance name in dry-run mode', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-frontier-attach-brev-'));
  const output = runCli(['frontier', 'attach-brev', '--instance', 'h100-lab', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.remote.provider, 'brev');
  assert.equal(payload.remote.instanceName, 'h100-lab');
  assert.equal(payload.remote.sshHost, 'h100-lab');
  assert.equal(
    ['/home/shadeform/frontier-engine', '~/frontier-engine'].includes(payload.remote.engineRoot),
    true,
  );
  assert.equal(payload.remote.pythonCommand, 'python3');
  assert.equal(payload.enablePaidRung, false);
  assert.equal(payload.paidEnabled, false);
});

test('frontier create-brev builds a native Brev provisioning plan with attach and sync follow-up', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-frontier-create-brev-'));
  const output = runCli([
    'frontier',
    'create-brev',
    'erdos-h100',
    '--gpu-name',
    'H100',
    '--provider',
    'hyperstack',
    '--attach',
    '--sync-lane',
    'p848_anchor_ladder',
    '--json',
  ], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.instanceName, 'erdos-h100');
  assert.equal(payload.provider, 'brev');
  assert.equal(payload.attach, true);
  assert.equal(payload.syncLane, 'p848_anchor_ladder');
  assert.equal(payload.enablePaidRung, false);
  assert.equal(payload.paidEnabled, false);
  assert.match(payload.plan.createCommandLine, /^brev create erdos-h100 --gpu-name H100 --provider hyperstack/);
  assert.equal(payload.plan.attachCommand, 'erdos frontier attach-brev --instance erdos-h100 --apply');
  assert.equal(payload.plan.syncCommand, 'erdos frontier sync-ssh --lane p848_anchor_ladder --apply');
  assert.equal(payload.warnings.some((warning) => /H100-class hardware/.test(warning)), true);
});

test('frontier create-brev-fleet builds a native H100 fleet plan for parallel sweeps', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-frontier-create-brev-fleet-'));
  const output = runCli([
    'frontier',
    'create-brev-fleet',
    'erdos-h100x2',
    '--type',
    'hyperstack_H100',
    '--count',
    '2',
    '--attach',
    '--sync-lane',
    'p848_anchor_ladder',
    '--json',
  ], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.fleetId, 'erdos-h100x2');
  assert.equal(payload.count, 2);
  assert.equal(payload.provider, 'brev');
  assert.equal(payload.intendedTopology, 'parallel_independent_sweeps');
  assert.equal(payload.enablePaidRung, false);
  assert.equal(payload.paidEnabled, false);
  assert.equal(payload.members.length, 2);
  assert.equal(payload.members[0].instanceName, 'erdos-h100x2-01');
  assert.equal(payload.members[1].instanceName, 'erdos-h100x2-02');
  assert.match(payload.members[0].createCommandLine, /^brev create erdos-h100x2-01 --type hyperstack_H100/);
  assert.equal(payload.members[0].syncCommand, 'erdos frontier sync-ssh --lane p848_anchor_ladder --apply');
});

test('frontier can explicitly enable paid remotes and fleets before they join the active loop', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-frontier-paid-rungs-'));
  runCli(['problem', 'use', '848'], { cwd: workspace });
  const configPath = path.join(workspace, '.erdos', 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.frontier = {
    ...(config.frontier ?? {}),
    remotes: {
      h100_box: {
        remoteId: 'h100_box',
        provider: 'brev',
        instanceName: 'h100_box',
        sshHost: 'h100_box',
        attached: true,
        gpuSearchReady: true,
      },
      h100x8_01: {
        remoteId: 'h100x8_01',
        provider: 'brev',
        instanceName: 'h100x8_01',
        sshHost: 'h100x8_01',
      },
      h100x8_02: {
        remoteId: 'h100x8_02',
        provider: 'brev',
        instanceName: 'h100x8_02',
        sshHost: 'h100x8_02',
      },
    },
    fleets: {
      h100x8: {
        fleetId: 'h100x8',
        provider: 'brev',
        count: 2,
        laneId: 'p848_anchor_ladder',
        intendedTopology: 'parallel_independent_sweeps',
        remoteIds: ['h100x8_01', 'h100x8_02'],
      },
    },
    paidRungs: {
      enabledRemoteIds: [],
      enabledFleetIds: [],
      lastUpdatedAt: null,
    },
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

  const enableRemote = JSON.parse(runCli(['frontier', 'enable-paid-remote', 'h100_box', '--json'], { cwd: workspace }));
  assert.equal(enableRemote.ok, true);
  assert.equal(enableRemote.enabled, true);
  assert.equal(enableRemote.snapshot.remotes.find((remote) => remote.remoteId === 'h100_box')?.paidEnabled, true);

  const enableFleet = JSON.parse(runCli(['frontier', 'enable-paid-fleet', 'h100x8', '--json'], { cwd: workspace }));
  assert.equal(enableFleet.ok, true);
  const fleetSnapshot = enableFleet.snapshot.fleets.find((fleet) => fleet.fleetId === 'h100x8');
  assert.equal(fleetSnapshot?.paidEnabled, true);
  assert.equal(fleetSnapshot?.members.every((member) => member.paidEnabled), true);
});

test('frontier fleets and sync-fleet expose configured fleet members', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-frontier-fleet-registry-'));
  runCli(['problem', 'use', '848'], { cwd: workspace });
  const configPath = path.join(workspace, '.erdos', 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.frontier = {
    ...(config.frontier ?? {}),
    remotes: {
      h100x2_01: {
        remoteId: 'h100x2_01',
        provider: 'brev',
        instanceName: 'h100x2_01',
        sshHost: 'h100x2_01',
        attached: true,
        gpuSearchReady: true,
      },
      h100x2_02: {
        remoteId: 'h100x2_02',
        provider: 'brev',
        instanceName: 'h100x2_02',
        sshHost: 'h100x2_02',
        attached: true,
        gpuSearchReady: false,
      },
    },
    fleets: {
      h100x2: {
        fleetId: 'h100x2',
        provider: 'brev',
        count: 2,
        laneId: 'p848_anchor_ladder',
        intendedTopology: 'parallel_independent_sweeps',
        remoteIds: ['h100x2_01', 'h100x2_02'],
      },
    },
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

  const fleets = JSON.parse(runCli(['frontier', 'fleets', '--json'], { cwd: workspace }));
  assert.equal(fleets.fleetCount, 1);
  assert.equal(fleets.fleets[0].fleetId, 'h100x2');
  assert.equal(fleets.fleets[0].attachedCount, 2);
  assert.equal(fleets.fleets[0].readyGpuCount, 1);

  const fleet = JSON.parse(runCli(['frontier', 'fleet', 'h100x2', '--json'], { cwd: workspace }));
  assert.equal(fleet.fleetId, 'h100x2');
  assert.equal(fleet.members.length, 2);

  const syncPlan = JSON.parse(runCli(['frontier', 'sync-fleet', 'h100x2', '--json'], { cwd: workspace }));
  assert.equal(syncPlan.available, true);
  assert.equal(syncPlan.members.length, 2);
  assert.equal(syncPlan.members[0].syncCommand, 'erdos frontier sync-ssh --remote-id h100x2_01 --lane p848_anchor_ladder --apply');
});

test('frontier sync-ssh can target one bundled lane in dry-run mode', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-frontier-sync-'));
  const output = runCli(['frontier', 'sync-ssh', '--lane', 'm8_sat_rail', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.scope.mode, 'lane');
  assert.equal(payload.scope.laneId, 'm8_sat_rail');
  assert.equal(payload.scope.error, null);
  assert.equal(payload.local.experimentDirs.length, 1);
  assert.match(payload.local.experimentDirs[0], /m8-sat-rail$/);
});

test('frontier sync-ssh narrows p848 lane sync to live latest frontier data', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-frontier-sync-p848-'));
  const output = runCli(['frontier', 'sync-ssh', '--lane', 'p848_anchor_ladder', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.scope.mode, 'lane');
  assert.equal(payload.scope.laneId, 'p848_anchor_ladder');
  assert.equal(Array.isArray(payload.scope.syncEntries), true);
  assert.equal(
    payload.scope.syncEntries.some((entry) => /live-frontier-sync\/2026-04-05/.test(entry.localPath)),
    false,
  );
  const chunksEntry = payload.scope.syncEntries.find((entry) => /live_latest_chunks$/.test(entry.label));
  assert.ok(chunksEntry);
  assert.equal(chunksEntry.recursive, true);
  assert.match(chunksEntry.localPath, /live-frontier-sync\/latest\/chunks$/);
  assert.match(chunksEntry.remoteRelativePath, /experiments\/p848-anchor-ladder\/live-frontier-sync\/latest$/);
});

test('frontier sync-ssh defaults to all bundled lanes in dry-run mode', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-frontier-sync-all-'));
  const output = runCli(['frontier', 'sync-ssh', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.scope.mode, 'all');
  assert.equal(Array.isArray(payload.local.experimentDirs), true);
  assert.equal(payload.local.experimentDirs.some((entry) => /m8-sat-rail$/.test(entry)), true);
  assert.equal(payload.local.experimentDirs.some((entry) => /p848-anchor-ladder$/.test(entry)), true);
});

test('frontier lanes exposes bundled frontier-engine lane metadata', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-frontier-lanes-'));
  const output = runCli(['frontier', 'lanes', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.available, true);
  assert.equal(Array.isArray(payload.lanes), true);
  assert.equal(payload.lanes.some((lane) => lane.lane_id === 'm8_sat_rail'), true);
  assert.equal(payload.lanes.some((lane) => lane.lane_id === 'p848_anchor_ladder'), true);
});

test('frontier setup emits an explicit opt-in plan for the managed runtime', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-frontier-setup-'));
  const resolvedWorkspace = fs.realpathSync(workspace);
  const output = runCli(['frontier', 'setup', '--cpu', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.apply, false);
  assert.equal(payload.plan.mode, 'cpu');
  assert.equal(payload.plan.frontierWorkspaceDir, path.join(resolvedWorkspace, '.erdos', 'frontier'));
  assert.equal(payload.plan.managedVenvDir, path.join(resolvedWorkspace, '.erdos', 'frontier', 'venv'));
  assert.equal(
    payload.plan.steps.some((step) => step.label === 'install_bundled_frontier_engine'),
    true,
  );
  assert.equal(
    payload.plan.steps.some((step) => step.label === 'install_torch_cpu'),
    true,
  );
  assert.equal(payload.doctor.bundledEnginePresent, true);
});

test('cluster list shows multiple seeded clusters', () => {
  const output = runCli(['cluster', 'list']);
  assert.match(output, /sunflower: 4 problems, 2 deep-harness/);
  assert.match(output, /number-theory: 10 problems, 0 deep-harness/);
  assert.match(output, /combinatorics: 1 problems, 0 deep-harness/);
  assert.match(output, /graph-theory: 3 problems, 0 deep-harness/);
  assert.match(output, /geometry: 1 problems, 0 deep-harness/);
});

test('cluster show sunflower lists the seed cluster', () => {
  const output = runCli(['cluster', 'show', 'sunflower']);
  assert.match(output, /Problems: 20, 536, 856, 857/);
  assert.match(output, /Deep harness: 20, 857/);
});

test('cluster show number-theory summarizes the starter workspace slice', () => {
  const output = runCli(['cluster', 'show', 'number-theory']);
  assert.match(output, /Problems: 1, 2, 3, 4, 5, 6, 7, 18, 542, 848/);
  assert.match(output, /Open starter workspace: 1/);
  assert.match(output, /Counterexample\/archive workspace: 2/);
});

test('problem use writes workspace state and current problem', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-'));
  const output = runCli(['problem', 'use', '857'], { cwd: workspace });
  assert.match(output, /Active problem set to 857/);
  assert.match(output, /Checkpoint shelf:/);
  const currentProblemPath = path.join(workspace, '.erdos', 'current-problem.json');
  const statePath = path.join(workspace, '.erdos', 'state.json');
  const orpProtocolPath = path.join(workspace, '.erdos', 'orp', 'PROTOCOL.md');
  const checkpointIndexPath = path.join(workspace, '.erdos', 'checkpoints', 'CHECKPOINTS.md');
  assert.equal(JSON.parse(fs.readFileSync(currentProblemPath, 'utf8')).problemId, '857');
  assert.equal(JSON.parse(fs.readFileSync(statePath, 'utf8')).activeProblem, '857');
  assert.equal(fs.existsSync(orpProtocolPath), true);
  assert.equal(fs.existsSync(checkpointIndexPath), true);
});

test('problem show without id uses active workspace problem', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-'));
  runCli(['problem', 'use', '20'], { cwd: workspace });
  const output = runCli(['problem', 'show'], { cwd: workspace });
  assert.match(output, /Erdos Problem #20/);
});

test('workspace show reports active problem plus artifact and literature dirs', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['workspace', 'show'], { cwd: workspace });
  assert.match(output, /Initialized: yes/);
  assert.match(output, /Active problem: 857/);
  assert.match(output, /Workspace ORP dir:/);
  assert.match(output, /Workspace ORP protocol:/);
  assert.match(output, /Workspace ORP integration:/);
  assert.match(output, /Workspace artifact dir:/);
  assert.match(output, /Workspace literature dir:/);
  assert.match(output, /Workspace runs dir:/);
  assert.match(output, /Workspace archives dir:/);
  assert.match(output, /Sunflower family role: weak_sunflower_core/);
  assert.match(output, /Sunflower frontier note:/);
  assert.match(output, /Sunflower board: yes/);
  assert.match(output, /Sunflower board ready atoms: 1/);
  assert.match(output, /Sunflower first ready atom: T10.G3.A2/);
  assert.match(output, /Sunflower compute lane: m8_exactness_cube_and_certificate_v0 \[ready_for_local_scout\]/);
});

test('paper init scaffolds a public-safe bundle in workspace mode outside the repo', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-paper-'));
  const output = runCli(['paper', 'init', '857'], { cwd: workspace });
  assert.match(output, /Paper bundle initialized:/);

  const bundleDir = path.join(workspace, '.erdos', 'papers', '857');
  const manifestPath = path.join(bundleDir, 'MANIFEST.json');
  const evidenceIndexPath = path.join(bundleDir, 'PUBLIC_EVIDENCE_INDEX.json');

  assert.equal(fs.existsSync(manifestPath), true);
  assert.equal(fs.existsSync(path.join(bundleDir, 'WRITER_BRIEF.md')), true);
  assert.equal(fs.existsSync(path.join(bundleDir, 'SECTION_STATUS.md')), true);

  const manifestText = fs.readFileSync(manifestPath, 'utf8');
  const manifest = JSON.parse(manifestText);
  const evidenceIndex = JSON.parse(fs.readFileSync(evidenceIndexPath, 'utf8'));

  assert.equal(manifest.problem.problemId, '857');
  assert.equal(manifest.bundlePath, null);
  assert.equal(manifest.bundlePathScope, 'local_omitted');
  assert.equal(manifest.canonicalPaths.problemDir.path, 'problems/857');
  assert.equal(manifestText.includes('/Volumes/Code_2TB'), false);
  assert.equal(evidenceIndex.canonicalArtifacts[0].path, 'problems/857/problem.yaml');
});

test('paper init resumes without overwriting edited sections and paper show reports the bundle', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-paper-resume-'));
  runCli(['paper', 'init', '857'], { cwd: workspace });

  const bundleDir = path.join(workspace, '.erdos', 'papers', '857');
  const abstractPath = path.join(bundleDir, 'ABSTRACT.md');
  const styleGuidePath = path.join(bundleDir, 'STYLE_GUIDE.md');

  fs.writeFileSync(abstractPath, '# Custom Abstract\n\nKeep this.\n');
  fs.unlinkSync(styleGuidePath);

  const output = runCli(['paper', 'init', '857'], { cwd: workspace });
  assert.match(output, /Paper bundle resumed:/);
  assert.equal(fs.readFileSync(abstractPath, 'utf8'), '# Custom Abstract\n\nKeep this.\n');
  assert.equal(fs.existsSync(styleGuidePath), true);

  const overview = JSON.parse(runCli(['paper', 'show', '857', '--json'], { cwd: workspace }));
  assert.equal(overview.problemId, '857');
  assert.equal(overview.paperMode, 'claim_safe_progress_or_route_paper');
  assert.equal(overview.sections.some((section) => section.fileName === 'ABSTRACT.md' && section.exists), true);
});

test('sunflower status shows packaged compute lane and family context for 857', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-'));
  const output = runCli(['sunflower', 'status', '857'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 sunflower harness/);
  assert.match(output, /Family role: weak_sunflower_core/);
  assert.match(output, /Active route: anchored_selector_linearization/);
  assert.match(output, /Route packet present: yes/);
  assert.match(output, /Route packet id: weak857_export_compression_v1/);
  assert.match(output, /Atomic board present: yes/);
  assert.match(output, /Atomic board: Problem 857 Post-Counting Redesign \+ Anchored-Selector Linearization Ops Board/);
  assert.match(output, /Atomic board first ready atom: T10.G3.A2/);
  assert.match(output, /Checkpoint packet:/);
  assert.match(output, /Report packet:/);
  assert.match(output, /Theorem loop: baseline/);
  assert.match(output, /Theorem claim surface: frontier_supported_route/);
  assert.match(output, /Theorem command: erdos problem theorem-loop 857/);
  assert.match(output, /Claim loop: baseline/);
  assert.match(output, /Claim command: erdos problem claim-loop 857/);
  assert.match(output, /Claim pass: baseline/);
  assert.match(output, /Claim pass command: erdos problem claim-pass 857/);
  assert.match(output, /Task list: baseline/);
  assert.match(output, /Task list command: erdos problem task-list 857/);
  assert.match(output, /Compute lane: m8_exactness_cube_and_certificate_v0 \[ready_for_local_scout\]/);
  assert.match(output, /Breakthroughs engine: breakthroughs/);
  assert.match(output, /Dispatch action: run_local/);
  assert.match(output, /Registry record:/);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'registry', 'compute', 'latest__p857.json')), true);
});

test('sunflower status can emit json using the active problem', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-json-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['sunflower', 'status', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '857');
  assert.equal(payload.familyRole, 'weak_sunflower_core');
  assert.equal(payload.computeLanePresent, true);
  assert.equal(payload.activePacket.laneId, 'm8_exactness_cube_and_certificate_v0');
  assert.equal(payload.atomicBoardPresent, true);
  assert.equal(payload.firstReadyAtom.atomId, 'T10.G3.A2');
  assert.equal(payload.theoremLoop.theoremLoopMode, 'baseline');
});

test('sunflower status records a no-compute dossier bridge cleanly for 536', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-536-'));
  const output = runCli(['sunflower', 'status', '536', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '536');
  assert.equal(payload.familyRole, 'natural_density_lcm_analogue');
  assert.equal(payload.harnessProfile, 'dossier_bridge');
  assert.equal(payload.activeRoute, 'natural_density_lcm_bridge');
  assert.equal(payload.routePacketPresent, true);
  assert.equal(payload.atomicBoardPresent, true);
  assert.equal(payload.firstReadyAtom.atomId, 'T1.G1.A3');
  assert.equal(payload.frontierNotePresent, true);
  assert.equal(payload.routeHistoryPresent, true);
  assert.equal(payload.computeLanePresent, false);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'registry', 'compute', 'latest__p536.json')), true);
});

test('number-theory status shows the starter workspace for 1', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-1-'));
  const output = runCli(['number-theory', 'status', '1'], { cwd: workspace });
  assert.match(output, /Erdos Problem #1 number-theory harness/);
  assert.match(output, /Harness profile: starter_workspace/);
  assert.match(output, /Active route: distinct_subset_sum_lower_bound/);
  assert.match(output, /Route packet present: yes/);
  assert.match(output, /Frontier note:/);
  assert.match(output, /Theorem loop: baseline/);
  assert.match(output, /Theorem claim surface: route_scaffolding/);
  assert.match(output, /Theorem command: erdos problem theorem-loop 1/);
  assert.match(output, /Claim pass: baseline/);
  assert.match(output, /Claim pass command: erdos problem claim-pass 1/);
  assert.match(output, /Task list: baseline/);
  assert.match(output, /Task list command: erdos problem task-list 1/);
  assert.match(output, /Active ticket: N1/);
  assert.match(output, /Ready atoms: 1/);
});

test('number-theory frontier and routes expose the open workspace for 1', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-frontier-1-'));
  const frontier = runCli(['number-theory', 'frontier', '1'], { cwd: workspace });
  assert.match(frontier, /Erdos Problem #1 number-theory frontier/);
  assert.match(frontier, /Frontier label: distinct_subset_sum_lower_bound/);
  assert.match(frontier, /Open problem: yes/);

  const routes = runCli(['number-theory', 'routes', '1'], { cwd: workspace });
  assert.match(routes, /Erdos Problem #1 number-theory routes/);
  assert.match(routes, /distinct_subset_sum_lower_bound \[active, active\]/);
  assert.match(routes, /why now:/);
});

test('number-theory status records archive posture for disproved problem 2', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-2-'));
  const output = runCli(['number-theory', 'status', '2', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '2');
  assert.equal(payload.archiveMode, 'counterexample_archive');
  assert.equal(payload.openProblem, false);
  assert.equal(payload.activeRoute, 'counterexample_archive');
  assert.equal(payload.readyAtomCount, 1);
});

test('number-theory status exposes the finite-check workspace for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-848-'));
  const output = runCli(['number-theory', 'status', '848'], { cwd: workspace });
  assert.match(output, /Erdos Problem #848 number-theory harness/);
  assert.match(output, /Harness profile: decidable_gap_workspace/);
  assert.match(output, /Active route: finite_check_gap_closure/);
  assert.match(output, /Open problem: no/);
  assert.match(output, /Route packet present: yes/);
  assert.match(output, /Active ticket: N848/);
  assert.match(output, /First ready atom: N848\.G1\.A21/);
  assert.match(output, /Theorem loop: bridge_backed/);
  assert.match(output, /Theorem claim surface: bridge_backed_frontier_support/);
  assert.match(output, /Theorem command: erdos problem theorem-loop 848/);
  assert.match(output, /Theorem refresh: erdos problem theorem-loop-refresh 848/);
  assert.match(output, /Claim loop: bridge_backed/);
  assert.match(output, /Claim command: erdos problem claim-loop 848/);
  assert.match(output, /Claim refresh: erdos problem claim-loop-refresh 848/);
  assert.match(output, /Claim pass: bridge_backed/);
  assert.match(output, /Claim pass command: erdos problem claim-pass 848/);
  assert.match(output, /Claim pass refresh: erdos problem claim-pass-refresh 848/);
  assert.match(output, /Formalization: bridge_backed/);
  assert.match(output, /Formalization command: erdos problem formalization 848/);
  assert.match(output, /Formalization refresh: erdos problem formalization-refresh 848/);
  assert.match(output, /Formalization work: bridge_backed/);
  assert.match(output, /Formalization work command: erdos problem formalization-work 848/);
  assert.match(output, /Formalization work refresh: erdos problem formalization-work-refresh 848/);
  assert.match(output, /Task list: bridge_backed/);
  assert.match(output, /Task list command: erdos problem task-list 848/);
  assert.match(output, /Task list refresh: erdos problem task-list-refresh 848/);
  assert.match(output, /Search\/theorem bridge:/);
  assert.match(output, /SEARCH_THEOREM_BRIDGE\.md/);
  assert.match(output, /Bridge data:/);
  assert.match(output, /Bridge refresh: erdos number-theory bridge-refresh 848/);
  assert.match(output, /Frontier loop: inactive/);
  assert.match(output, /Frontier loop activation: erdos frontier setup --base --apply/);
  assert.match(output, /Frontier loop GPU path: erdos frontier setup --cuda --torch-index-url <url> --apply/);
});

test('number-theory bridge exposes the frontier-engine theorem bridge for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-bridge-848-'));
  const output = runCli(['number-theory', 'bridge', '848'], { cwd: workspace });
  assert.match(output, /Erdos Problem #848 number-theory bridge/);
  assert.match(output, /Bridge note: .*SEARCH_THEOREM_BRIDGE\.md/);
  assert.match(output, /Bridge data: .*SEARCH_THEOREM_BRIDGE\.json/);
  assert.match(output, /Frontier-engine: .*research\/frontier-engine/);
  assert.match(output, /Refresh command: erdos number-theory bridge-refresh 848/);
  assert.match(output, /Engine command: python3 research\/frontier-engine\/src\/frontier_engine\/cli\.py export-p848-theorem-bridge/);
  assert.match(output, /Refresh mode: system/);
  assert.match(output, /Resolved engine command: .*frontier_engine\/cli\.py export-p848-theorem-bridge/);
  assert.match(output, /Shared-prefix failures frozen: 24/);
  assert.match(output, /Next unmatched representative: 137720141/);
  assert.match(output, /Current family-aware leader: 432/);
  assert.match(output, /Top GPU tie class: 432, 782, 832/);
});

test('number-theory bridge keeps the strongest theorem-relevant GPU manifest for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-bridge-strongest-848-'));
  const payload = JSON.parse(runCli(['number-theory', 'bridge', '848', '--json'], { cwd: workspace }));
  const state = payload.bridgeCurrentState;

  assert.equal(state.current_family_aware_leader.continuation, 432);
  assert.equal(state.current_family_aware_leader.repaired_known_packets, 26);
  assert.equal(state.current_family_aware_leader.repaired_predicted_families, 242);
  assert.equal(state.current_family_aware_leader.effective_clean_through >= 250075000, true);
  assert.deepEqual(state.top_gpu_tie_class, [432, 782, 832]);
  assert.equal(payload.bridgeGpuLeaderboard.length >= 16, true);
});

test('number-theory bridge-refresh runs the frontier-engine exporter for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-bridge-refresh-848-'));
  const output = runCli(['number-theory', 'bridge-refresh', '848'], { cwd: workspace });
  assert.match(output, /Bridge refresh: complete/);
  assert.match(output, /Refresh command: erdos number-theory bridge-refresh 848/);
  assert.match(output, /Engine command: python3 research\/frontier-engine\/src\/frontier_engine\/cli\.py export-p848-theorem-bridge/);
  assert.match(output, /Execution mode: system/);
  assert.match(output, /Resolved engine command: .*frontier_engine\/cli\.py export-p848-theorem-bridge/);
  assert.match(output, /Erdos Problem #848 number-theory bridge/);
  assert.match(output, /Shared-prefix failures frozen: 24/);
});

test('sunflower board prints the mirrored atomic frontier for 857', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-board-857-'));
  const output = runCli(['sunflower', 'board', '857'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 sunflower board/);
  assert.match(output, /Profile: deep_atomic_ops/);
  assert.match(output, /Active ticket: T10 Route Redesign T10: Anchored-Selector Linearization/);
  assert.match(output, /Ready atoms: 1/);
  assert.match(output, /T10.G3.A2/);
  assert.match(output, /anchored_selector_linearization: loose 0\/1, strict 0\/1/);
});

test('sunflower board prints the mirrored closure board for 20', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-board-20-'));
  const output = runCli(['sunflower', 'board', '20'], { cwd: workspace });
  assert.match(output, /Erdos Problem #20 sunflower board/);
  assert.match(output, /Profile: deep_atomic_ops/);
  assert.match(output, /Active ticket: T6 Support Lane T6: UniformK3From7 Base\/Step Witness Construction/);
  assert.match(output, /Ready atoms: 0/);
  assert.match(output, /uniform_prize_final_k3: loose 5\/5, strict 5\/5/);
});

test('sunflower ready prints the current ready queue for 857', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-ready-857-'));
  const output = runCli(['sunflower', 'ready', '857'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 sunflower ready queue/);
  assert.match(output, /Ready atoms: 1/);
  assert.match(output, /T10.G3.A2/);
  assert.match(output, /Promote the helper\/theorem stack into anchored_selector_linearization_realized/);
});

test('sunflower ladder prints the current ladder for 20', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-ladder-20-'));
  const output = runCli(['sunflower', 'ladder', '20'], { cwd: workspace });
  assert.match(output, /Erdos Problem #20 sunflower ladder/);
  assert.match(output, /P0-SpecLock: 18\/18/);
  assert.match(output, /P4-Verification: 86\/86/);
});

test('sunflower routes prints the strategic route table for 857', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-routes-857-'));
  const output = runCli(['sunflower', 'routes', '857'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 sunflower routes/);
  assert.match(output, /Active route: anchored_selector_linearization/);
  assert.match(output, /Route breakthrough: yes/);
  assert.match(output, /o1a_existential_explicit_export \[strict-closed\]: loose 1\/1, strict 1\/1/);
  assert.match(output, /anchored_selector_linearization \[active\]: loose 0\/1, strict 0\/1/);
  assert.match(output, /First ready atom: T10\.G3\.A2/);
});

test('sunflower tickets prints the operational ticket table for 857', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-tickets-857-'));
  const output = runCli(['sunflower', 'tickets', '857'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 sunflower tickets/);
  assert.match(output, /Active ticket: T10/);
  assert.match(output, /Closed tickets: 5\/10/);
  assert.match(output, /T10 Route Redesign T10: Anchored-Selector Linearization \[active\]/);
  assert.match(output, /T7 Route Redesign T7: Global Family-Card Export \[closed\]/);
  assert.match(output, /First ready atom: T10\.G3\.A2/);
});

test('sunflower routes prints the public bridge route table for 536', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-routes-536-'));
  const output = runCli(['sunflower', 'routes', '536'], { cwd: workspace });
  assert.match(output, /Erdos Problem #536 sunflower routes/);
  assert.match(output, /Profile: dossier_bridge/);
  assert.match(output, /natural_density_lcm_bridge \[active\]: loose 0\/3, strict 0\/3/);
});

test('sunflower frontier prints the compressed frontier view for 857', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-frontier-857-'));
  const output = runCli(['sunflower', 'frontier', '857'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 sunflower frontier/);
  assert.match(output, /Active route: anchored_selector_linearization/);
  assert.match(output, /Active ticket: T10/);
  assert.match(output, /First ready atom: T10\.G3\.A2/);
  assert.match(output, /Frontier note:/);
});

test('sunflower route prints the deeper route packet for 857', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-route-857-'));
  const output = runCli(['sunflower', 'route', '857', 'anchored_selector_linearization'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 sunflower route anchored_selector_linearization/);
  assert.match(output, /Title: Anchored-Selector Linearization/);
  assert.match(output, /Strict progress: 0\/1/);
});

test('sunflower ticket prints the deeper ticket packet for 20', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-ticket-20-'));
  const output = runCli(['sunflower', 'ticket', '20', 'T6'], { cwd: workspace });
  assert.match(output, /Erdos Problem #20 sunflower ticket T6/);
  assert.match(output, /Title: Support Lane T6: UniformK3From7 Base\/Step Witness Construction/);
  assert.match(output, /Current blocker:/);
  assert.match(output, /Gate progress: 5\/5/);
});

test('sunflower atom prints the deeper atom packet for 857', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-atom-857-'));
  const output = runCli(['sunflower', 'atom', '857', 'T10.G3.A2'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 sunflower atom T10.G3.A2/);
  assert.match(output, /Status: ready/);
  assert.match(output, /Current frontier atom: yes/);
  assert.match(output, /Verification hook:/);
});

test('sunflower compute run creates a governed local scout bundle for 857', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-compute-run-'));
  const output = runCli(['sunflower', 'compute', 'run', '857'], { cwd: workspace });
  assert.match(output, /Sunflower local scout run created for problem 857/);
  assert.match(output, /Lane: m8_exactness_cube_and_certificate_v0/);
  const runsDir = path.join(workspace, '.erdos', 'runs');
  const runEntries = fs.readdirSync(runsDir);
  assert.equal(runEntries.length, 1);
  const runDir = path.join(runsDir, runEntries[0]);
  assert.equal(fs.existsSync(path.join(runDir, 'RUN.json')), true);
  assert.equal(fs.existsSync(path.join(runDir, 'RUN_SUMMARY.md')), true);
  assert.equal(fs.existsSync(path.join(runDir, 'ORP_COMPUTE_PACKET.json')), true);
});

test('dossier show uses active problem when omitted', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['dossier', 'show'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 dossier/);
  assert.match(output, /STATEMENT.md: present/);
});

test('import show reports bundled snapshot', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-import-show-'));
  const output = runCli(['import', 'show'], { cwd: workspace });
  assert.match(output, /Snapshot kind: bundled/);
  assert.match(output, /Active source: bundled import snapshot/);
  assert.match(output, /External import repo: https:\/\/github.com\/teorth\/erdosproblems/);
  assert.match(output, /Entries: 1183/);
  assert.match(output, /Workspace snapshot dir:/);
  assert.match(output, /Refresh workspace import snapshot: erdos import sync/);
});

test('import diff writes workspace report from bundled snapshot', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-upstream-'));
  const output = runCli(['import', 'diff'], { cwd: workspace });
  assert.match(output, /Local seeded problems: 19/);
  assert.match(output, /External atlas total problems: 1183/);
  const diffPath = path.join(workspace, '.erdos', 'reports', 'UPSTREAM_DIFF.md');
  assert.equal(fs.existsSync(diffPath), true);
  assert.match(fs.readFileSync(diffPath, 'utf8'), /# External Atlas Diff/);
});

test('import drift shows the packaged dashboard', () => {
  const output = runCli(['import', 'drift']);
  assert.match(output, /External atlas drift dashboard/);
  assert.match(output, /Local seeded problems:/);
  assert.match(output, /Site-status drifts:/);
});

test('import drift for 857 can emit json without a live site fetch', () => {
  const output = runCli(['import', 'drift', '857', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '857');
  assert.equal(payload.local.siteStatus, 'open');
  assert.equal(payload.external.siteStatus, 'open');
});

test('legacy upstream alias still works', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-upstream-show-'));
  const output = runCli(['upstream', 'show'], { cwd: workspace });
  assert.match(output, /Snapshot kind: bundled/);
  assert.match(output, /External import repo:/);
});

test('scaffold problem copies canonical files, pack context, and imported record', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-scaffold-'));
  const output = runCli(['scaffold', 'problem', '857'], { cwd: workspace });
  assert.match(output, /Scaffold created:/);
  assert.match(output, /Imported record included: yes/);
  const scaffoldDir = path.join(workspace, '.erdos', 'scaffolds', '857');
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'STATEMENT.md')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'PACK_CONTEXT.md')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'PACK_PROBLEM', 'CONTEXT.md')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'PACK_PROBLEM', 'context.yaml')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'COMPUTE', 'm8_exactness_cube_and_certificate_v0.yaml')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'UPSTREAM_RECORD.json')), true);
  const artifactIndex = JSON.parse(fs.readFileSync(path.join(scaffoldDir, 'ARTIFACT_INDEX.json'), 'utf8'));
  assert.equal(artifactIndex.includedUpstreamRecord, true);
  assert.equal(artifactIndex.packProblemArtifacts.length >= 2, true);
  assert.equal(artifactIndex.computeArtifacts.length >= 1, true);
});

test('bootstrap problem selects active problem and creates scaffold in one step', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-bootstrap-'));
  const output = runCli(['bootstrap', 'problem', '857'], { cwd: workspace });
  assert.match(output, /Bootstrapped problem 857/);
  assert.match(output, /Active problem: 857/);
  const statePath = path.join(workspace, '.erdos', 'state.json');
  const currentProblemPath = path.join(workspace, '.erdos', 'current-problem.json');
  const scaffoldDir = path.join(workspace, '.erdos', 'scaffolds', '857');
  const orpProtocolPath = path.join(workspace, '.erdos', 'orp', 'PROTOCOL.md');
  assert.equal(JSON.parse(fs.readFileSync(statePath, 'utf8')).activeProblem, '857');
  assert.equal(JSON.parse(fs.readFileSync(currentProblemPath, 'utf8')).problemId, '857');
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'PROBLEM.json')), true);
  assert.equal(fs.existsSync(orpProtocolPath), true);
});

test('pull problem creates root bundle with artifact and literature lanes', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-pull-problem-'));
  const output = runCli(['pull', 'problem', '857'], { cwd: workspace });
  assert.match(output, /Pull bundle created:/);
  assert.match(output, /Artifact lane:/);
  assert.match(output, /Literature lane:/);
  const pullDir = path.join(workspace, '.erdos', 'pulls', '857');
  assert.equal(fs.existsSync(path.join(pullDir, 'PULL_STATUS.json')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'artifacts', 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'artifacts', 'PACK_PROBLEM', 'CONTEXT.md')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'literature', 'REFERENCES.md')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'literature', 'STATEMENT.md')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'literature', 'PUBLIC_STATUS_REVIEW.md')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'literature', 'AGENT_WEBSEARCH_BRIEF.md')), true);
});

test('pull artifacts creates the artifact lane directly', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-pull-artifacts-'));
  const output = runCli(['pull', 'artifacts', '857'], { cwd: workspace });
  assert.match(output, /Artifact bundle created:/);
  const artifactDir = path.join(workspace, '.erdos', 'pulls', '857', 'artifacts');
  assert.equal(fs.existsSync(path.join(artifactDir, 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(artifactDir, 'COMPUTE', 'm8_exactness_cube_and_certificate_v0.yaml')), true);
});

test('pull literature creates the literature lane directly', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-pull-literature-'));
  const output = runCli(['pull', 'literature', '857'], { cwd: workspace });
  assert.match(output, /Literature bundle created:/);
  const literatureDir = path.join(workspace, '.erdos', 'pulls', '857', 'literature');
  assert.equal(fs.existsSync(path.join(literatureDir, 'REFERENCES.md')), true);
  assert.equal(fs.existsSync(path.join(literatureDir, 'PACK_PROBLEM', 'CONTEXT.md')), true);
  assert.equal(fs.existsSync(path.join(literatureDir, 'LITERATURE_INDEX.json')), true);
});

test('pull literature can emit json for richer adapters', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-pull-literature-json-'));
  const output = runCli(['pull', 'literature', '857', '--include-crossref', '--include-openalex', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.kind, 'literature');
  assert.equal(payload.problemId, '857');
  assert.equal(payload.localProblemIncluded, true);
  assert.equal(payload.upstreamRecordIncluded, true);
  assert.equal(payload.includedCrossref, true);
  assert.equal(payload.includedOpenAlex, true);
});

test('pull problem creates upstream-only bundle for unseeded problem', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-pull-unseeded-'));
  const output = runCli(['pull', 'problem', '25'], { cwd: workspace });
  assert.match(output, /Pull bundle created:/);
  assert.match(output, /Local canonical dossier included: no/);
  assert.match(output, /Imported record included: yes/);
  const pullDir = path.join(workspace, '.erdos', 'pulls', '25');
  assert.equal(fs.existsSync(path.join(pullDir, 'UPSTREAM_RECORD.json')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'artifacts', 'PROBLEM.json')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'artifacts', 'problem.yaml')), false);
  assert.equal(fs.existsSync(path.join(pullDir, 'literature', 'PROBLEM.json')), true);
});

test('maintainer seed creates a canonical dossier from a pulled bundle', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-seed-workspace-'));
  const pullDir = path.join(workspace, 'pull-bundle');
  const outputPull = runCli(['pull', 'problem', '25', '--dest', pullDir, '--include-site', '--include-public-search'], { cwd: workspace });
  assert.match(outputPull, /Pull bundle created:/);

  const destRoot = path.join(workspace, 'seeded-problems');
  const outputSeed = runCli([
    'maintainer',
    'seed',
    'problem',
    '25',
    '--from-pull',
    pullDir,
    '--dest-root',
    destRoot,
    '--cluster',
    'number-theory',
    '--family-tag',
    'additive-combinatorics',
    '--related',
    '20',
  ], { cwd: workspace });

  assert.match(outputSeed, /Seeded dossier for problem 25/);
  const problemDir = path.join(destRoot, '25');
  assert.equal(fs.existsSync(path.join(problemDir, 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'STATEMENT.md')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'REFERENCES.md')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'EVIDENCE.md')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'FORMALIZATION.md')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'AGENT_START.md')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'ROUTES.md')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'CHECKPOINT_NOTES.md')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'PUBLIC_STATUS_REVIEW.md')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'AGENT_WEBSEARCH_BRIEF.md')), true);

  const yamlText = fs.readFileSync(path.join(problemDir, 'problem.yaml'), 'utf8');
  assert.match(yamlText, /problem_id: "25"/);
  assert.match(yamlText, /cluster: number-theory/);
  assert.match(yamlText, /repo_status: cataloged/);
  assert.match(yamlText, /family_tags:/);
  assert.match(yamlText, /additive-combinatorics/);
  assert.match(yamlText, /related_problems:/);
  assert.match(yamlText, /"20"/);
});

test('maintainer review creates a checklist from a pulled bundle', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-review-workspace-'));
  const pullDir = path.join(workspace, 'pull-bundle');
  runCli(['pull', 'problem', '25', '--dest', pullDir], { cwd: workspace });
  const output = runCli([
    'maintainer',
    'review',
    'problem',
    '25',
    '--from-pull',
    pullDir,
  ], { cwd: workspace });
  assert.match(output, /Prepared maintainer review for problem 25/);
  assert.equal(fs.existsSync(path.join(pullDir, 'REVIEW_CHECKLIST.md')), true);
});

test('state sync after problem use writes state markdown and question ledger', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-state-sync-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['state', 'show'], { cwd: workspace });
  assert.match(output, /Erdos research state/);
  assert.match(output, /Open problem: 857/);
  assert.match(output, /Active route: anchored_selector_linearization/);
  assert.match(output, /Current frontier: ready_atom \/ T10.G3.A2/);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'STATE.md')), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'QUESTION-LEDGER.md')), true);
  assert.match(fs.readFileSync(path.join(workspace, '.erdos', 'STATE.md'), 'utf8'), /Frontier Note:/);
});

test('continuation use milestone persists config and shows resolved mode', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-continuation-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['continuation', 'use', 'milestone'], { cwd: workspace });
  assert.match(output, /Continuation mode set to milestone/);
  const config = JSON.parse(fs.readFileSync(path.join(workspace, '.erdos', 'config.json'), 'utf8'));
  assert.equal(config.continuation, 'milestone');
});

test('checkpoints sync creates checkpoint shelf and route checkpoint', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-checkpoints-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['checkpoints', 'sync'], { cwd: workspace });
  assert.match(output, /Checkpoint shelf synced/);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'checkpoints', 'CHECKPOINTS.md')), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'orp', 'AGENT_INTEGRATION.md')), true);
  const routePath = path.join(workspace, '.erdos', 'checkpoints', 'route-checkpoints', 'problem-857--anchored_selector_linearization.md');
  assert.equal(fs.existsSync(routePath), true);
  assert.match(fs.readFileSync(routePath, 'utf8'), /First Ready Atom: T10\.G3\.A2/);
  assert.match(fs.readFileSync(routePath, 'utf8'), /Frontier Note:/);
});

test('preflight reports ok after bootstrap and checkpoint sync', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-preflight-'));
  runCli(['bootstrap', 'problem', '857'], { cwd: workspace });
  const output = runCli(['preflight'], { cwd: workspace });
  assert.match(output, /Verdict: ok/);
  assert.match(output, /Continuation policy: route/);
  assert.match(output, /Research stack:/);
  assert.match(output, /Canonical source: https:\/\/www\.erdosproblems\.com\/857/);
  assert.match(output, /Theorem loop: erdos problem theorem-loop 857/);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'registry', 'preflight')), true);
});

test('sunflower status for 20 shows the deeper frontier framing and compute lane', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-20-'));
  const output = runCli(['sunflower', 'status', '20'], { cwd: workspace });
  assert.match(output, /Frontier label: uniform_k3_frontier/);
  assert.match(output, /Route packet present: yes/);
  assert.match(output, /Route packet id: strong20_uniform_k3_frontier_v1/);
  assert.match(output, /Atomic board present: yes/);
  assert.match(output, /Atomic board ready atoms: 0/);
  assert.match(output, /Compute lane: u3_uniform_transfer_window_v0 \[ready_for_local_scout\]/);
  assert.match(output, /Next honest move:/);
});

test('workspace show includes research loop paths and continuation mode', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-loop-'));
  runCli(['bootstrap', 'problem', '857'], { cwd: workspace });
  const output = runCli(['workspace', 'show'], { cwd: workspace });
  assert.match(output, /State markdown:/);
  assert.match(output, /Question ledger:/);
  assert.match(output, /Checkpoint shelf:/);
  assert.match(output, /Workspace ORP dir:/);
  assert.match(output, /Workspace seeded-problems dir:/);
  assert.match(output, /Active seeded dossier dir:/);
  assert.match(output, /Continuation mode: route/);
  assert.match(output, /Next honest move:/);
  assert.match(output, /Sunflower theorem loop: baseline/);
  assert.match(output, /Sunflower theorem command: erdos problem theorem-loop 857/);
  assert.match(output, /Sunflower task list: baseline/);
  assert.match(output, /Sunflower task list command: erdos problem task-list 857/);
  assert.match(output, /Research canonical source: https:\/\/www\.erdosproblems\.com\/857/);
  assert.match(output, /Research ORP sync: erdos orp sync/);
  assert.match(output, /Research writeback: erdos problem theorem-loop-refresh 857/);
  assert.match(output, /Research task list refresh: erdos problem task-list-refresh 857/);
  assert.match(output, /Sunflower board: yes/);
  assert.match(output, /Sunflower board ready atoms: 1/);
  assert.match(output, /Sunflower first ready atom: T10.G3.A2/);
});

test('workspace show includes number-theory workspace context for problem 1', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-number-theory-'));
  runCli(['problem', 'use', '1'], { cwd: workspace });
  const output = runCli(['workspace', 'show'], { cwd: workspace });
  assert.match(output, /Active route: distinct_subset_sum_lower_bound/);
  assert.match(output, /Number-theory family role: additive_number_theory_seed/);
  assert.match(output, /Number-theory frontier note:/);
  assert.match(output, /Number-theory theorem loop: baseline/);
  assert.match(output, /Number-theory theorem command: erdos problem theorem-loop 1/);
  assert.match(output, /Number-theory task list: baseline/);
  assert.match(output, /Number-theory task list command: erdos problem task-list 1/);
  assert.match(output, /Number-theory active ticket: N1/);
  assert.match(output, /Number-theory ready atoms: 1/);
});

test('workspace show includes inactive frontier loop guidance for problem 848 by default', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-number-theory-848-'));
  runCli(['problem', 'use', '848'], { cwd: workspace });
  const output = runCli(['workspace', 'show'], { cwd: workspace });
  assert.match(output, /Number-theory theorem loop: bridge_backed/);
  assert.match(output, /Number-theory theorem command: erdos problem theorem-loop 848/);
  assert.match(output, /Number-theory claim loop: bridge_backed/);
  assert.match(output, /Number-theory claim command: erdos problem claim-loop 848/);
  assert.match(output, /Number-theory claim pass: bridge_backed/);
  assert.match(output, /Number-theory claim pass command: erdos problem claim-pass 848/);
  assert.match(output, /Number-theory formalization: bridge_backed/);
  assert.match(output, /Number-theory formalization command: erdos problem formalization 848/);
  assert.match(output, /Number-theory formalization work: bridge_backed/);
  assert.match(output, /Number-theory formalization work command: erdos problem formalization-work 848/);
  assert.match(output, /Number-theory task list: bridge_backed/);
  assert.match(output, /Number-theory task list command: erdos problem task-list 848/);
  assert.match(output, /Research canonical source: https:\/\/www\.erdosproblems\.com\/848/);
  assert.match(output, /Research compute entry: erdos number-theory dispatch 848/);
  assert.match(output, /Research hardware doctor: erdos frontier doctor/);
  assert.match(output, /Research source refresh: erdos number-theory bridge-refresh 848/);
  assert.match(output, /Research claim refresh: erdos problem claim-loop-refresh 848/);
  assert.match(output, /Research claim pass refresh: erdos problem claim-pass-refresh 848/);
  assert.match(output, /Research formalization refresh: erdos problem formalization-refresh 848/);
  assert.match(output, /Research formalization work refresh: erdos problem formalization-work-refresh 848/);
  assert.match(output, /Research task list refresh: erdos problem task-list-refresh 848/);
  assert.match(output, /Number-theory frontier loop: inactive/);
  assert.match(output, /Number-theory frontier loop activation: erdos frontier setup --base --apply/);
  assert.match(output, /Number-theory frontier loop GPU path: erdos frontier setup --cuda --torch-index-url <url> --apply/);
});

test('state show includes inactive frontier loop guidance for problem 848 by default', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-state-frontier-848-'));
  runCli(['problem', 'use', '848'], { cwd: workspace });
  const output = runCli(['state', 'show'], { cwd: workspace });
  assert.match(output, /Frontier loop: inactive/);
  assert.match(output, /Frontier loop activation: erdos frontier setup --base --apply/);
  assert.match(output, /Frontier loop GPU path: erdos frontier setup --cuda --torch-index-url <url> --apply/);
  assert.match(fs.readFileSync(path.join(workspace, '.erdos', 'STATE.md'), 'utf8'), /## Frontier Loop/);
  assert.match(fs.readFileSync(path.join(workspace, '.erdos', 'STATE.md'), 'utf8'), /GPU Upgrade Command:/);
});

test('number-theory status activates the frontier loop in cpu mode when the workspace is opted in and managed-ready', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-848-frontier-cpu-'));
  runCli(['problem', 'use', '848'], { cwd: workspace });
  const configPath = path.join(workspace, '.erdos', 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.frontier = {
    ...(config.frontier ?? {}),
    loopOptIn: true,
    runtimeMode: 'base',
    activeMode: 'cpu',
    managedFrontierReady: true,
    gpuSearchReady: false,
    lastSetupAt: '2026-04-06T00:00:00.000Z',
    lastDoctorAt: '2026-04-06T00:00:00.000Z',
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

  const output = runCli(['number-theory', 'status', '848'], { cwd: workspace });
  assert.match(output, /Frontier loop: active \(cpu\)/);
  assert.match(output, /Frontier loop summary:/);
  assert.match(output, /Frontier loop entry: erdos number-theory dispatch 848/);
  assert.match(output, /Frontier loop commands:/);
  assert.match(output, /Frontier loop upgrade: erdos frontier setup --cuda --torch-index-url <url> --apply/);
});

test('number-theory status activates the frontier loop when the workspace is opted in and GPU-ready', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-848-frontier-active-'));
  runCli(['problem', 'use', '848'], { cwd: workspace });
  const configPath = path.join(workspace, '.erdos', 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.frontier = {
    ...(config.frontier ?? {}),
    loopOptIn: true,
    runtimeMode: 'cuda',
    activeMode: 'gpu',
    managedFrontierReady: true,
    gpuSearchReady: true,
    lastSetupAt: '2026-04-06T00:00:00.000Z',
    lastDoctorAt: '2026-04-06T00:00:00.000Z',
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

  const output = runCli(['number-theory', 'status', '848'], { cwd: workspace });
  assert.match(output, /Frontier loop: active \(gpu\)/);
  assert.match(output, /Frontier loop summary:/);
  assert.match(output, /Frontier loop entry: erdos number-theory dispatch 848/);
  assert.match(output, /Frontier loop commands:/);
});

test('number-theory status keeps a paid Brev GPU rung out of the active loop until explicitly enabled', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-848-paid-rung-'));
  runCli(['problem', 'use', '848'], { cwd: workspace });
  const configPath = path.join(workspace, '.erdos', 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.frontier = {
    ...(config.frontier ?? {}),
    loopOptIn: true,
    runtimeMode: null,
    activeMode: null,
    activeRemoteId: 'erdos-p848-h100',
    remotes: {
      'erdos-p848-h100': {
        remoteId: 'erdos-p848-h100',
        provider: 'brev',
        instanceName: 'erdos-p848-h100',
        sshHost: 'erdos-p848-h100',
        attached: true,
        frontierEngineReady: true,
        gpuSearchReady: true,
      },
    },
    paidRungs: {
      enabledRemoteIds: [],
      enabledFleetIds: [],
      lastUpdatedAt: null,
    },
    remote: {
      remoteId: 'erdos-p848-h100',
      provider: 'brev',
      instanceName: 'erdos-p848-h100',
      sshHost: 'erdos-p848-h100',
      attached: true,
      frontierEngineReady: true,
      gpuSearchReady: true,
      paidEnabled: false,
    },
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

  const output = runCli(['number-theory', 'status', '848'], { cwd: workspace });
  assert.match(output, /Frontier loop: inactive/);
  assert.match(output, /Frontier loop reason: paid_rung_not_enabled/);
  assert.match(output, /Frontier loop activation: erdos frontier setup --base --apply/);
});

test('number-theory dispatch defaults to bridge refresh and surfaces the exact scout lane on an inactive workspace', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-dispatch-848-'));
  const output = runCli(['number-theory', 'dispatch', '848'], { cwd: workspace });
  assert.match(output, /Erdos Problem #848 number-theory dispatch/);
  assert.match(output, /Primary action: bridge_refresh/);
  assert.match(output, /Claim-pass recommendations:/);
  assert.match(output, /formalize_282_alignment \[high\] theorem_formalization/);
  assert.match(output, /- bridge_refresh \[primary, available, system\]/);
  assert.match(output, /- formalization_work_refresh \[available, theorem\]/);
  assert.match(output, /- formalization_refresh \[available, theorem\]/);
  assert.match(output, /- claim_pass_refresh \[available, theorem\]/);
  assert.match(output, /- exact_followup_rollout \[available, cpu\]/);
  assert.match(output, /- exact_followup_launch \[available, cpu\]/);
  assert.match(output, /- exact_interval_scout \[available, cpu\]/);
  assert.match(output, /- structural_two_side_scout \[available, cpu\]/);
  assert.match(output, /- mixed_base_failure_scout \[available, cpu\]/);
  assert.match(output, /- full_mixed_base_structural_verifier \[available, cpu\]/);
  assert.match(output, /- structural_lift_miner \[available, cpu\]/);
  assert.match(output, /apply: erdos number-theory dispatch 848 --apply --action exact_interval_scout/);
});

test('number-theory dispatch apply runs the current primary action on an inactive workspace', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-dispatch-apply-848-'));
  const output = runCli(['number-theory', 'dispatch', '848', '--apply'], { cwd: workspace });
  assert.match(output, /Number-theory dispatch: complete/);
  assert.match(output, /Action: bridge_refresh/);
  assert.match(output, /Bridge refresh: complete/);
});

test('number-theory dispatch can refresh claim-pass recommendations for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-claim-pass-848-'));
  const output = runCli(['number-theory', 'dispatch', '848', '--apply', '--action', 'claim_pass_refresh', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.action.actionId, 'claim_pass_refresh');
  assert.match(payload.claimPassRefresh.jsonPath, /packs\/number-theory\/problems\/848\/CLAIM_PASS\.json$/);
  assert.equal(fs.existsSync(payload.claimPassRefresh.jsonPath), true);
  const claimPass = JSON.parse(fs.readFileSync(payload.claimPassRefresh.jsonPath, 'utf8'));
  assert.equal(claimPass.problemId, '848');
  assert.equal(claimPass.summary.claims.supported >= 2, true);
  assert.equal(claimPass.recommendations.some((item) => item.recommendation_id === 'formalize_282_alignment'), true);
  assert.equal(claimPass.recommendations.some((item) => item.recommendation_id === 'formalize_top_repair_cluster'), true);
});

test('number-theory dispatch can refresh the formalization packet for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-formalization-848-'));
  const output = runCli(['number-theory', 'dispatch', '848', '--apply', '--action', 'formalization_refresh', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.action.actionId, 'formalization_refresh');
  assert.match(payload.formalizationRefresh.jsonPath, /packs\/number-theory\/problems\/848\/FORMALIZATION\.json$/);
  assert.equal(fs.existsSync(payload.formalizationRefresh.jsonPath), true);
  const formalization = JSON.parse(fs.readFileSync(payload.formalizationRefresh.jsonPath, 'utf8'));
  assert.equal(formalization.problemId, '848');
  assert.equal(formalization.currentTarget.focusId, 'formalize_282_alignment');
});

test('number-theory dispatch can refresh the formalization work packet for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-formalization-work-848-'));
  const output = runCli(['number-theory', 'dispatch', '848', '--apply', '--action', 'formalization_work_refresh', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.action.actionId, 'formalization_work_refresh');
  assert.match(payload.formalizationWorkRefresh.jsonPath, /packs\/number-theory\/problems\/848\/FORMALIZATION_WORK\.json$/);
  assert.equal(fs.existsSync(payload.formalizationWorkRefresh.jsonPath), true);
  const formalizationWork = JSON.parse(fs.readFileSync(payload.formalizationWorkRefresh.jsonPath, 'utf8'));
  assert.equal(formalizationWork.problemId, '848');
  assert.equal(formalizationWork.currentWork.focusId, 'lift_132_activation_schema_beyond_finite_menu');
  assert.equal(formalizationWork.currentWork.packetData.tupleRowCrtDerivation.projectedResidueModuloWitness, 504);
  assert.equal(formalizationWork.currentWork.packetData.witnessSquareModulus, 841);
  assert.equal(formalizationWork.currentWork.packetData.witnessFirstOccurrence.firstRepresentative, 137720141);
  assert.equal(formalizationWork.currentWork.packetData.representativeResidueModuloWitness, 504);
  assert.equal(formalizationWork.currentWork.mechanismAssessment.verdict, 'controlled_congruence_candidate');
  assert.equal(formalizationWork.currentWork.packetData.rowProgressionModuloWitness.traversesAllWitnessResidues, true);
  assert.equal(formalizationWork.currentWork.packetData.rowProgressionAnchorTable.some((row) => row.anchor === 282 && row.rowIndexForWitness === 0), true);
  assert.equal(formalizationWork.currentWork.packetData.rowStartDerivation282.normalizedEquation, 't ≡ 0 (mod 841)');
  assert.equal(formalizationWork.currentWork.packetData.unsolvableContrast232.solvable, false);
  assert.equal(formalizationWork.currentWork.packetData.nextSameRowWitnessFor282, 27443256270065);
  assert.equal(fs.existsSync(payload.formalizationWorkRefresh.svgPath), true);
});

test('number-theory dispatch audits external structural verifier blockers for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-structural-audit-848-'));
  const sourceDir = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-848-external-source-'));
  const problemDir = path.join(sourceDir, '848');
  fs.mkdirSync(problemDir, { recursive: true });
  fs.writeFileSync(path.join(sourceDir, 'README.md'), [
    '# External 848 verifier',
    '',
    'Problem 848 solved for all N by checking N <= 10^7 and using Sawhney for N > 10^7.',
    '',
  ].join('\n'));
  fs.writeFileSync(path.join(problemDir, 'proof.md'), [
    '# Proof',
    '',
    'Sawhney handles N > 10^7 after the finite verifier.',
    '',
    's_max^(p)(N) + max(V_p, V_p) + d_max^(p)(N) + R_{>p}(N) < M(N)',
    '',
  ].join('\n'));
  fs.writeFileSync(path.join(problemDir, 'erdos848_verifier_v5.cpp'), [
    'bool is_base_residue(int x) { const int r = x % 25; return r == 7 || r == 18; }',
    'void build_base_masks(long long x, long long m_max) {',
    '  const long long b = 7LL * x + 1;',
    '  const long long max_val = x * (7LL + 25LL * (m_max - 1)) + 1;',
    '}',
    '',
  ].join('\n'));

  const output = runCli([
    'number-theory',
    'dispatch',
    '848',
    '--apply',
    '--action',
    'structural_verifier_audit',
    '--external-source-dir',
    sourceDir,
    '--json',
  ], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.action.actionId, 'structural_verifier_audit');
  assert.equal(payload.structuralVerifierAudit.status, 'blocked');
  assert.equal(payload.structuralVerifierAudit.summary.blockerCount, 2);
  assert.equal(payload.structuralVerifierAudit.summary.baseSevenMaskPresent, true);
  assert.equal(payload.structuralVerifierAudit.summary.baseEighteenMaskPresent, false);
  assert.equal(fs.existsSync(payload.structuralVerifierAudit.jsonPath), true);
  assert.equal(fs.existsSync(payload.structuralVerifierAudit.markdownPath), true);
  const audit = JSON.parse(fs.readFileSync(payload.structuralVerifierAudit.jsonPath, 'utf8'));
  assert.equal(audit.checks.some((check) => check.checkId === 'sawhney_handoff_not_claimed_at_1e7' && check.status === 'failed'), true);
  assert.equal(audit.checks.some((check) => check.checkId === 'base_exchange_mask_covers_both_principal_sides' && check.status === 'failed'), true);
});

test('number-theory dispatch runs the base-side scout for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-base-side-scout-848-'));
  const output = runCli([
    'number-theory',
    'dispatch',
    '848',
    '--apply',
    '--action',
    'base_side_scout',
    '--base-side-max',
    '200',
    '--json',
  ], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.action.actionId, 'base_side_scout');
  assert.equal(payload.baseSideScout.status, 'counterexample_to_global_7_side_domination_found');
  assert.equal(payload.baseSideScout.summary.interval, '1..200');
  assert.equal(payload.baseSideScout.summary.maxSide18ExceedsSide7, true);
  assert.equal(payload.baseSideScout.firstNWithSide18MaxExceedingSide7.N, 143);
  assert.equal(fs.existsSync(payload.baseSideScout.jsonPath), true);
  assert.equal(fs.existsSync(payload.baseSideScout.markdownPath), true);
});

test('number-theory dispatch runs the two-sided structural scout for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-two-side-structural-848-'));
  const output = runCli([
    'number-theory',
    'dispatch',
    '848',
    '--apply',
    '--action',
    'structural_two_side_scout',
    '--structural-min',
    '1',
    '--structural-max',
    '1000',
    '--json',
  ], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.action.actionId, 'structural_two_side_scout');
  assert.equal(payload.structuralTwoSideScout.summary.assessedRange, '1..1000');
  assert.equal(payload.structuralTwoSideScout.summary.allUnionChecksPass, false);
  assert.equal(payload.structuralTwoSideScout.summary.unionFailureCount > 0, true);
  assert.equal(fs.existsSync(payload.structuralTwoSideScout.jsonPath), true);
  assert.equal(fs.existsSync(payload.structuralTwoSideScout.markdownPath), true);
});

test('number-theory dispatch runs the mixed-base failure scout for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-mixed-base-scout-848-'));
  runCli([
    'number-theory',
    'dispatch',
    '848',
    '--apply',
    '--action',
    'structural_two_side_scout',
    '--structural-min',
    '7307',
    '--structural-max',
    '7600',
    '--json',
  ], { cwd: workspace });
  const output = runCli([
    'number-theory',
    'dispatch',
    '848',
    '--apply',
    '--action',
    'mixed_base_failure_scout',
    '--mixed-base-max-rows',
    '8',
    '--json',
  ], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.action.actionId, 'mixed_base_failure_scout');
  assert.equal(payload.mixedBaseFailureScout.summary.analyzedRowCount > 0, true);
  assert.equal(payload.mixedBaseFailureScout.summary.allAnalyzedRowsMixedPass, true);
  assert.equal(payload.mixedBaseFailureScout.summary.mixedFailureCount, 0);
  assert.equal(fs.existsSync(payload.mixedBaseFailureScout.jsonPath), true);
  assert.equal(fs.existsSync(payload.mixedBaseFailureScout.markdownPath), true);
});

test('number-theory dispatch runs the full mixed-base structural verifier for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-full-mixed-structural-848-'));
  const output = runCli([
    'number-theory',
    'dispatch',
    '848',
    '--apply',
    '--action',
    'full_mixed_base_structural_verifier',
    '--structural-min',
    '7307',
    '--structural-max',
    '7600',
    '--json',
  ], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.ok, true);
  assert.equal(payload.action.actionId, 'full_mixed_base_structural_verifier');
  assert.equal(payload.fullMixedBaseStructuralVerifier.summary.assessedRange, '7307..7600');
  assert.equal(payload.fullMixedBaseStructuralVerifier.summary.allMixedChecksPass, true);
  assert.equal(payload.fullMixedBaseStructuralVerifier.summary.mixedFailureCount, 0);
  assert.equal(payload.fullMixedBaseStructuralVerifier.summary.threateningOutsiderCheckCount > 0, true);
  assert.equal(fs.existsSync(payload.fullMixedBaseStructuralVerifier.jsonPath), true);
  assert.equal(fs.existsSync(payload.fullMixedBaseStructuralVerifier.markdownPath), true);
});

test('number-theory dispatch runs the structural lift miner for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-structural-lift-miner-848-'));
  const artifactJsonPath = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'STRUCTURAL_LIFT_MINER.json');
  const artifactMarkdownPath = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'STRUCTURAL_LIFT_MINER.md');
  const previousJson = fs.existsSync(artifactJsonPath) ? fs.readFileSync(artifactJsonPath, 'utf8') : null;
  const previousMarkdown = fs.existsSync(artifactMarkdownPath) ? fs.readFileSync(artifactMarkdownPath, 'utf8') : null;
  try {
    runCli([
      'number-theory',
      'dispatch',
      '848',
      '--apply',
      '--action',
      'full_mixed_base_structural_verifier',
      '--structural-min',
      '7307',
      '--structural-max',
      '7600',
      '--json',
    ], { cwd: workspace });
    const output = runCli([
      'number-theory',
      'dispatch',
      '848',
      '--apply',
      '--action',
      'structural_lift_miner',
      '--structural-lift-top-rows',
      '8',
      '--structural-lift-family-limit',
      '8',
      '--json',
    ], { cwd: workspace });
    const payload = JSON.parse(output);
    assert.equal(payload.ok, true);
    assert.equal(payload.action.actionId, 'structural_lift_miner');
    assert.equal(payload.structuralLiftMiner.status, 'structural_lift_obligation_packet_ready');
    assert.equal(payload.structuralLiftMiner.summary.coverageComplete, true);
    assert.deepEqual(payload.structuralLiftMiner.summary.primaryExactPrimes, [13, 17]);
    assert.equal(payload.structuralLiftMiner.summary.nextTheoremLane, 'formalize_cross_side_matching_bound_then_exact_prime_margin_lift');
    assert.equal(fs.existsSync(payload.structuralLiftMiner.jsonPath), true);
    assert.equal(fs.existsSync(payload.structuralLiftMiner.markdownPath), true);
  } finally {
    if (previousJson === null) {
      fs.rmSync(artifactJsonPath, { force: true });
    } else {
      fs.writeFileSync(artifactJsonPath, previousJson);
    }
    if (previousMarkdown === null) {
      fs.rmSync(artifactMarkdownPath, { force: true });
    } else {
      fs.writeFileSync(artifactMarkdownPath, previousMarkdown);
    }
  }
});

test('number-theory dispatch runs the matching pattern miner for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-matching-pattern-miner-848-'));
  const artifactJsonPath = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'MATCHING_PATTERN_MINER.json');
  const artifactMarkdownPath = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'MATCHING_PATTERN_MINER.md');
  const previousJson = fs.existsSync(artifactJsonPath) ? fs.readFileSync(artifactJsonPath, 'utf8') : null;
  const previousMarkdown = fs.existsSync(artifactMarkdownPath) ? fs.readFileSync(artifactMarkdownPath, 'utf8') : null;
  try {
    runCli([
      'number-theory',
      'dispatch',
      '848',
      '--apply',
      '--action',
      'full_mixed_base_structural_verifier',
      '--structural-min',
      '7307',
      '--structural-max',
      '7600',
      '--json',
    ], { cwd: workspace });
    const output = runCli([
      'number-theory',
      'dispatch',
      '848',
      '--apply',
      '--action',
      'matching_pattern_miner',
      '--matching-pattern-prime',
      '13',
      '--matching-pattern-top-rows',
      '6',
      '--matching-pattern-pair-sample-limit',
      '8',
      '--json',
    ], { cwd: workspace });
    const payload = JSON.parse(output);
    assert.equal(payload.ok, true);
    assert.equal(payload.action.actionId, 'matching_pattern_miner');
    assert.equal(payload.matchingPatternMiner.status, 'matching_pattern_witness_packet_ready');
    assert.equal(payload.matchingPatternMiner.parameters.targetPrime, 13);
    assert.equal(payload.matchingPatternMiner.summary.witnessRowCount, 6);
    assert.equal(payload.matchingPatternMiner.summary.allReconstructedMatchesAgree, true);
    assert.equal(payload.matchingPatternMiner.summary.allWitnessesMeetRequiredMatchingLowerBound, true);
    assert.equal(payload.matchingPatternMiner.summary.allWitnessesSaturateSmallerSide, true);
    assert.equal(payload.matchingPatternMiner.summary.minMatchingSlack, 19);
    assert.equal(payload.matchingPatternMiner.patternSummary.totalWitnessMatchingPairs > 0, true);
    assert.equal(payload.matchingPatternMiner.patternSummary.splitProfiles.length > 0, true);
    assert.equal(payload.matchingPatternMiner.patternSummary.allSplitCommonCoresMeetMaxRequiredBound, true);
    assert.equal(payload.matchingPatternMiner.patternSummary.allSplitCommonCoresSaturateMinSmallerSide, true);
    assert.equal(payload.matchingPatternMiner.patternSummary.splitProfiles.every((profile) => profile.commonMatchingPairExportComplete), true);
    assert.equal(payload.matchingPatternMiner.patternSummary.splitProfiles.every((profile) => profile.commonMatchingPairExportedCount === profile.commonMatchingPairCount), true);
    assert.equal(payload.matchingPatternMiner.symbolicUse.activeAtom, 'D2_p13_matching_lower_bound');
    assert.equal(payload.matchingPatternMiner.witnessSample[0].matchingPairSample.length > 0, true);
    assert.equal(fs.existsSync(payload.matchingPatternMiner.jsonPath), true);
    const artifact = JSON.parse(fs.readFileSync(payload.matchingPatternMiner.jsonPath, 'utf8'));
    assert.equal(artifact.patternSummary.splitProfiles.every((profile) => profile.commonMatchingPairExportComplete), true);
    assert.equal(artifact.patternSummary.splitProfiles.every((profile) => profile.commonMatchingPairs.length === profile.commonMatchingPairCount), true);
    assert.equal(fs.existsSync(payload.matchingPatternMiner.markdownPath), true);
  } finally {
    if (previousJson === null) {
      fs.rmSync(artifactJsonPath, { force: true });
    } else {
      fs.writeFileSync(artifactJsonPath, previousJson);
    }
    if (previousMarkdown === null) {
      fs.rmSync(artifactMarkdownPath, { force: true });
    } else {
      fs.writeFileSync(artifactMarkdownPath, previousMarkdown);
    }
  }
});

test('number-theory dispatch can assemble an exact handoff bundle for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-exact-handoff-848-'));
  const output = runCli(['number-theory', 'dispatch', '848', '--apply', '--action', 'exact_handoff_bundle'], { cwd: workspace });
  assert.match(output, /Number-theory dispatch: complete/);
  assert.match(output, /Action: exact_handoff_bundle/);
  assert.match(output, /Exact handoff JSON:/);

  const runsDir = path.join(workspace, '.erdos', 'runs');
  const runEntries = fs.readdirSync(runsDir);
  assert.equal(runEntries.length, 1);
  const runDir = path.join(runsDir, runEntries[0], 'exact-handoff');
  assert.equal(fs.existsSync(path.join(runDir, 'EXACT_HANDOFF.json')), true);
  assert.equal(fs.existsSync(path.join(runDir, 'EXACT_HANDOFF.md')), true);

  const handoff = JSON.parse(fs.readFileSync(path.join(runDir, 'EXACT_HANDOFF.json'), 'utf8'));
  assert.equal(handoff.problemId, '848');
  assert.equal(handoff.exactFocus.nextUnmatchedRepresentative, 137720141);
});

test('number-theory dispatch can launch exact follow-up from the handoff bundle for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-exact-followup-848-'));
  const output = runCli([
    'number-theory',
    'dispatch',
    '848',
    '--apply',
    '--action',
    'exact_followup_launch',
    '--exact-min',
    '10001',
    '--exact-max',
    '10002',
  ], { cwd: workspace });

  assert.match(output, /Number-theory dispatch: complete/);
  assert.match(output, /Action: exact_followup_launch/);
  assert.match(output, /Exact handoff dir:/);
  assert.match(output, /Exact follow-up JSON:/);
  assert.match(output, /Exact follow-up interval: 10001\.\.10002/);

  const runsDir = path.join(workspace, '.erdos', 'runs');
  const runEntries = fs.readdirSync(runsDir);
  assert.equal(runEntries.length, 1);
  const runRoot = path.join(runsDir, runEntries[0]);
  const handoffPath = path.join(runRoot, 'exact-handoff', 'EXACT_HANDOFF.json');
  const followupPath = path.join(runRoot, 'exact-followup', 'EXACT_FOLLOWUP.json');
  const resultsPath = path.join(runRoot, 'exact-followup', 'EXACT_SMALL_N_RESULTS.json');

  assert.equal(fs.existsSync(handoffPath), true);
  assert.equal(fs.existsSync(followupPath), true);
  assert.equal(fs.existsSync(resultsPath), true);

  const followup = JSON.parse(fs.readFileSync(followupPath, 'utf8'));
  assert.equal(followup.problemId, '848');
  assert.equal(followup.backend.kind, 'exact_small_n');
  assert.equal(followup.backend.min, 10001);
  assert.equal(followup.backend.max, 10002);
  assert.equal(followup.resultsSummary.interval, '10001..10002');
});

test('problem 848 exact scanner supports endpoint-monotonicity mode', () => {
  const outputPath = path.join(os.tmpdir(), `p848-endpoint-scan-${Date.now()}.json`);
  const scriptPath = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'compute', 'problem848_small_n_exact_scan.mjs');
  const output = execFileSync('node', [
    scriptPath,
    '--min',
    '17301',
    '--max',
    '17400',
    '--endpoint-monotonicity',
    '--json-output',
    outputPath,
  ], { encoding: 'utf8' });
  const summary = JSON.parse(output);
  const payload = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  assert.equal(summary.interval, '17301..17400');
  assert.equal(payload.method, 'endpoint_monotonicity_maximum_clique_scan');
  assert.equal(payload.summary.rows, 100);
  assert.equal(payload.endpointMonotonicity.allEndpointChecksCertified, true);
  assert.equal(payload.endpointMonotonicity.endpointCheckCount < payload.summary.rows, true);
  assert.equal(payload.results.every((row) => row.inferredByEndpointMonotonicity === true), true);
});

test('number-theory dispatch can roll out multiple exact follow-up chunks for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-exact-rollout-848-'));
  const output = runCli([
    'number-theory',
    'dispatch',
    '848',
    '--apply',
    '--action',
    'exact_followup_rollout',
    '--exact-min',
    '10001',
    '--exact-chunks',
    '2',
    '--exact-chunk-size',
    '1',
  ], { cwd: workspace });

  assert.match(output, /Number-theory dispatch: complete/);
  assert.match(output, /Action: exact_followup_rollout/);
  assert.match(output, /Exact rollout JSON:/);
  assert.match(output, /Exact rollout completed chunks: 2\/2/);
  assert.match(output, /Exact rollout covered interval: 10001\.\.10002/);
  assert.match(output, /- chunk 1: 10001\.\.10001 \[ok\]/);
  assert.match(output, /- chunk 2: 10002\.\.10002 \[ok\]/);

  const runsDir = path.join(workspace, '.erdos', 'runs');
  const runEntries = fs.readdirSync(runsDir);
  assert.equal(runEntries.length, 3);

  const rolloutRunDir = runEntries
    .map((entry) => path.join(runsDir, entry))
    .find((entry) => fs.existsSync(path.join(entry, 'exact-rollout', 'EXACT_ROLLOUT.json')));
  assert.ok(rolloutRunDir);

  const rolloutPath = path.join(rolloutRunDir, 'exact-rollout', 'EXACT_ROLLOUT.json');
  const rollout = JSON.parse(fs.readFileSync(rolloutPath, 'utf8'));
  assert.equal(rollout.problemId, '848');
  assert.equal(rollout.requestedChunkCount, 2);
  assert.equal(rollout.completedChunkCount, 2);
  assert.equal(rollout.completedInterval, '10001..10002');
  assert.equal(rollout.childRuns.length, 2);
  assert.equal(rollout.childRuns[0].interval, '10001..10001');
  assert.equal(rollout.childRuns[1].interval, '10002..10002');
});

test('number-theory dispatch can detach into a supervised frontier session for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-detach-848-'));
  const output = runCli([
    'number-theory',
    'dispatch',
    '848',
    '--apply',
    '--detach',
    '--action',
    'bridge_refresh',
    '--review-after-hours',
    '0.001',
  ], { cwd: workspace });

  assert.match(output, /Number-theory dispatch: detached/);
  assert.match(output, /Action: bridge_refresh/);
  const sessionId = output.match(/Frontier session id: (.+)$/m)?.[1]?.trim();
  assert.ok(sessionId);

  const session = JSON.parse(runCli(['frontier', 'session', sessionId, '--json'], { cwd: workspace }));
  assert.equal(session.problemId, '848');
  assert.equal(session.actionId, 'bridge_refresh');
  assert.equal(session.kind, 'number_theory_dispatch');
  assert.equal(Number(session.reviewAfterHours), 0.001);

  const sessions = JSON.parse(runCli(['frontier', 'sessions', '--json'], { cwd: workspace }));
  assert.equal(sessions.sessions.some((entry) => entry.sessionId === sessionId), true);

  const stopResult = JSON.parse(runCli(['frontier', 'stop-session', sessionId, '--json'], { cwd: workspace }));
  assert.equal(stopResult.ok, true);
});

test('number-theory detach reuses an equivalent running exact rollout session instead of launching a duplicate', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-detach-reuse-848-'));
  const firstOutput = runCli([
    'number-theory',
    'dispatch',
    '848',
    '--apply',
    '--detach',
    '--action',
    'exact_followup_rollout',
    '--exact-min',
    '12001',
    '--exact-chunks',
    '2',
    '--exact-chunk-size',
    '10',
    '--review-after-hours',
    '1',
  ], { cwd: workspace });
  const firstSessionId = firstOutput.match(/Frontier session id: (.+)$/m)?.[1]?.trim();
  assert.ok(firstSessionId);

  const secondOutput = runCli([
    'number-theory',
    'dispatch',
    '848',
    '--apply',
    '--detach',
    '--action',
    'exact_followup_rollout',
    '--exact-min',
    '12001',
    '--exact-chunks',
    '2',
    '--exact-chunk-size',
    '10',
    '--review-after-hours',
    '1',
  ], { cwd: workspace });
  const secondSessionId = secondOutput.match(/Frontier session id: (.+)$/m)?.[1]?.trim();
  assert.equal(secondSessionId, firstSessionId);
  assert.match(secondOutput, /Reused existing session: yes/);
});

test('number-theory dispatch-fleet previews and launches an aggregated fleet run for 848', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-dispatch-fleet-848-'));
  runCli(['problem', 'use', '848'], { cwd: workspace });
  const configPath = path.join(workspace, '.erdos', 'config.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.frontier = {
    ...(config.frontier ?? {}),
    loopOptIn: true,
    runtimeMode: 'cuda',
    activeMode: 'gpu',
    managedFrontierReady: true,
    gpuSearchReady: true,
    remotes: {
      h100x2_01: {
        remoteId: 'h100x2_01',
        provider: 'ssh',
        attached: false,
      },
      h100x2_02: {
        remoteId: 'h100x2_02',
        provider: 'ssh',
        attached: false,
      },
    },
    fleets: {
      h100x2: {
        fleetId: 'h100x2',
        provider: 'brev',
        count: 2,
        laneId: 'p848_anchor_ladder',
        intendedTopology: 'parallel_independent_sweeps',
        remoteIds: ['h100x2_01', 'h100x2_02'],
      },
    },
  };
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');

  const preview = JSON.parse(runCli([
    'number-theory',
    'dispatch-fleet',
    '848',
    '--fleet',
    'h100x2',
    '--action',
    'bridge_refresh',
    '--json',
  ], { cwd: workspace }));
  assert.equal(preview.available, true);
  assert.equal(preview.fleetId, 'h100x2');
  assert.equal(preview.members.length, 2);
  assert.equal(preview.availableMemberCount, 2);

  const gpuPreview = JSON.parse(runCli([
    'number-theory',
    'dispatch-fleet',
    '848',
    '--fleet',
    'h100x2',
    '--action',
    'gpu_profile_sweep',
    '--strategy',
    'ladder_cover_v1',
    '--json',
  ], { cwd: workspace }));
  assert.equal(gpuPreview.strategyId, 'ladder_cover_v1');
  assert.equal(gpuPreview.members.every((member) => Boolean(member.assignment)), true);
  assert.equal(gpuPreview.members[0].assignment.center > 0, true);

  const launched = JSON.parse(runCli([
    'number-theory',
    'dispatch-fleet',
    '848',
    '--fleet',
    'h100x2',
    '--apply',
    '--action',
    'bridge_refresh',
    '--json',
  ], { cwd: workspace }));
  assert.equal(launched.launchedCount, 2);
  assert.equal(Boolean(launched.fleetRun?.runId), true);

  const fleetRun = JSON.parse(runCli([
    'number-theory',
    'fleet-run',
    launched.fleetRun.runId,
    '--json',
  ], { cwd: workspace }));
  assert.equal(fleetRun.fleetId, 'h100x2');
  assert.equal(fleetRun.members.length, 2);
});

test('problem show surfaces solved archival mode for 1008', () => {
  const output = runCli(['problem', 'show', '1008']);
  assert.match(output, /Archive mode: method_exemplar/);
});

test('archive scaffold creates a solved-problem archive bundle', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-archive-'));
  const output = runCli(['archive', 'scaffold', '1008'], { cwd: workspace });
  assert.match(output, /Archive scaffold created:/);
  const archiveDir = path.join(workspace, '.erdos', 'archives', '1008');
  assert.equal(fs.existsSync(path.join(archiveDir, 'ARCHIVE.json')), true);
  assert.equal(fs.existsSync(path.join(archiveDir, 'METHOD_PACKET.md')), true);
});

test('seed problem creates a workspace-local dossier and activates the research loop in one step', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-seed-one-step-'));
  const output = runCli(['seed', 'problem', '25', '--cluster', 'number-theory'], { cwd: workspace });
  assert.match(output, /Seeded local dossier for problem 25/);
  assert.match(output, /ORP protocol:/);
  assert.match(output, /Workspace overlay visible: yes/);
  assert.match(output, /Activated: yes/);
  assert.match(output, /Loop synced: yes/);

  const seededDir = path.join(workspace, '.erdos', 'seeded-problems', '25');
  assert.equal(fs.existsSync(path.join(seededDir, 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(seededDir, 'STATEMENT.md')), true);
  assert.equal(fs.existsSync(path.join(seededDir, 'AGENT_START.md')), true);
  assert.equal(fs.existsSync(path.join(seededDir, 'ROUTES.md')), true);
  assert.equal(fs.existsSync(path.join(seededDir, 'CHECKPOINT_NOTES.md')), true);
  assert.equal(fs.existsSync(path.join(seededDir, 'PUBLIC_STATUS_REVIEW.md')), true);
  assert.equal(fs.existsSync(path.join(seededDir, 'AGENT_WEBSEARCH_BRIEF.md')), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'orp', 'PROTOCOL.md')), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'STATE.md')), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'checkpoints', 'CHECKPOINTS.md')), true);

  const currentProblem = JSON.parse(fs.readFileSync(path.join(workspace, '.erdos', 'current-problem.json'), 'utf8'));
  assert.equal(currentProblem.problemId, '25');

  const shown = runCli(['problem', 'show', '25'], { cwd: workspace });
  assert.match(shown, /Erdos Problem #25/);
  assert.match(shown, /Repo status: local_seeded/);

  const listed = runCli(['problem', 'list', '--repo-status', 'local_seeded'], { cwd: workspace });
  assert.match(listed, /25/);
});

test('seed problem can emit json for agents', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-seed-json-'));
  const output = runCli(['seed', 'problem', '25', '--cluster', 'number-theory', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '25');
  assert.equal(payload.workspaceOverlayVisible, true);
  assert.equal(payload.activated, true);
  assert.equal(payload.loopSynced, true);
  assert.equal(payload.activeProblem, '25');
  assert.equal(payload.usedPublicStatusReview, true);
  assert.match(payload.orpProtocol, /\.erdos\/orp\/PROTOCOL\.md$/);
  assert.equal(typeof payload.nextHonestMove, 'string');
});

test('orp sync and show expose the bundled protocol kit', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-orp-'));
  const syncOutput = runCli(['orp', 'sync'], { cwd: workspace });
  assert.match(syncOutput, /ORP workspace kit synced/);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'orp', 'PROTOCOL.md')), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'orp', 'AGENT_INTEGRATION.md')), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'orp', 'templates', 'CLAIM.md')), true);

  const showOutput = runCli(['orp', 'show'], { cwd: workspace });
  assert.match(showOutput, /Open Research Protocol/);
  assert.match(showOutput, /Workspace protocol:/);
  assert.match(showOutput, /Workspace templates:/);
});


test('cluster list can emit json', () => {
  const output = runCli(['cluster', 'list', '--json']);
  const payload = JSON.parse(output);
  const graphTheory = payload.find((cluster) => cluster.name === 'graph-theory');
  assert.equal(Array.isArray(payload), true);
  assert.equal(graphTheory.problems.length, 3);
});

test('cluster show graph-theory summarizes the archive workspace slice', () => {
  const output = runCli(['cluster', 'show', 'graph-theory']);
  assert.match(output, /Problems: 19, 22, 1008/);
  assert.match(output, /Decision archive workspace: 19/);
  assert.match(output, /Proof archive workspace: 22/);
  assert.match(output, /Lean proof archive workspace: 1008/);
});

test('number-theory route ticket and atom drill-down are available for 1', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-number-theory-detail-1-'));
  const route = runCli(['number-theory', 'route', '1', 'distinct_subset_sum_lower_bound'], { cwd: workspace });
  assert.match(route, /Erdos Problem #1 number-theory route distinct_subset_sum_lower_bound/);
  assert.match(route, /Title: Distinct Subset-Sum Lower Bound/);

  const ticket = runCli(['number-theory', 'ticket', '1', 'N1'], { cwd: workspace });
  assert.match(ticket, /Erdos Problem #1 number-theory ticket N1/);
  assert.match(ticket, /Current blocker:/);

  const atom = runCli(['number-theory', 'atom', '1', 'N1.G1.A1'], { cwd: workspace });
  assert.match(atom, /Erdos Problem #1 number-theory atom N1.G1.A1/);
  assert.match(atom, /Current frontier atom: yes/);
});

test('workspace show can emit json with graph-theory pack state', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-graph-json-'));
  runCli(['problem', 'use', '1008'], { cwd: workspace });
  const output = runCli(['workspace', 'show', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.activeProblem, '1008');
  assert.equal(payload.graphTheory.problemId, '1008');
  assert.equal(payload.graphTheory.archiveMode, 'method_exemplar');
  assert.equal(payload.graphTheory.firstReadyAtom.atom_id, 'G1008.G1.A1');
});

test('archive show and scaffold can emit json', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-archive-json-'));
  const showPayload = JSON.parse(runCli(['archive', 'show', '1008', '--json'], { cwd: workspace }));
  assert.equal(showPayload.problemId, '1008');
  assert.equal(showPayload.solved, true);

  const scaffoldPayload = JSON.parse(runCli(['archive', 'scaffold', '1008', '--json'], { cwd: workspace }));
  assert.equal(scaffoldPayload.payload.problemId, '1008');
  assert.equal(fs.existsSync(path.join(scaffoldPayload.archiveDir, 'ARCHIVE.json')), true);
});

test('graph-theory status shows the lean archive workspace for 1008', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-graph-theory-1008-'));
  const output = runCli(['graph-theory', 'status', '1008'], { cwd: workspace });
  assert.match(output, /Erdos Problem #1008 graph-theory harness/);
  assert.match(output, /Harness profile: lean_archive_workspace/);
  assert.match(output, /Archive mode: method_exemplar/);
  assert.match(output, /Problem solved: yes/);
  assert.match(output, /Theorem loop: baseline/);
  assert.match(output, /Theorem command: erdos problem theorem-loop 1008/);
  assert.match(output, /Claim loop: baseline/);
  assert.match(output, /Claim command: erdos problem claim-loop 1008/);
  assert.match(output, /Claim pass: baseline/);
  assert.match(output, /Claim pass command: erdos problem claim-pass 1008/);
  assert.match(output, /Task list: baseline/);
  assert.match(output, /Task list command: erdos problem task-list 1008/);
  assert.match(output, /First ready atom: G1008.G1.A1/);
});

test('graph-theory frontier routes and tickets expose the archive workspace surfaces', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-graph-theory-archive-'));
  const frontier = runCli(['graph-theory', 'frontier', '22'], { cwd: workspace });
  assert.match(frontier, /Erdos Problem #22 graph-theory frontier/);
  assert.match(frontier, /Archive mode: proof_archive/);

  const routes = runCli(['graph-theory', 'routes', '1008'], { cwd: workspace });
  assert.match(routes, /Erdos Problem #1008 graph-theory routes/);
  assert.match(routes, /c4_free_lean_archive \[active, closed\]/);

  const tickets = runCli(['graph-theory', 'tickets', '19'], { cwd: workspace });
  assert.match(tickets, /Erdos Problem #19 graph-theory tickets/);
  assert.match(tickets, /G19 \[active\]/);
});
