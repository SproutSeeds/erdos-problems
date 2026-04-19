import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../src/cli/index.js', import.meta.url));

function runCli(args, options = {}) {
  return execFileSync('node', [cli, ...args], {
    encoding: 'utf8',
    cwd: options.cwd,
    env: {
      ...process.env,
      ...(options.env ?? {}),
    },
    maxBuffer: options.maxBuffer ?? 20 * 1024 * 1024,
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

test('problem task list exposes convergence assembly for agent loops', () => {
  const output = runCli(['problem', 'task-list', '1', '--json']);
  const payload = JSON.parse(output);

  assert.equal(payload.abstractBeforeExpandGate.status, 'core_loop_enabled');
  assert.equal(payload.abstractBeforeExpandGate.gateId, 'abstract-before-expand');
  assert.match(payload.abstractBeforeExpandGate.commands.fullGate, /abstract before expanding/);
  assert.equal(
    payload.currentTasks.some((task) => task.taskId === 'apply_abstract_before_expand_gate'),
    true,
  );
  assert.equal(payload.agentFlow.modePolicy.abstractBeforeExpand.backingModeId, 'granular-breakdown');
  assert.match(
    payload.agentFlow.executionLoop.join('\n'),
    /abstractBeforeExpand/,
  );

  assert.equal(payload.convergenceAssemblyMode.status, 'core_loop_enabled');
  assert.equal(payload.convergenceAssemblyMode.overlayId, 'convergence-assembly');
  assert.match(payload.convergenceAssemblyMode.commands.fullAssembly, /orp mode breakdown granular-breakdown/);
  assert.equal(
    payload.currentTasks.some((task) => task.taskId === 'assemble_convergence_picture'),
    true,
  );
  assert.equal(payload.agentFlow.modePolicy.convergenceAssembly.backingModeId, 'granular-breakdown');
  assert.match(
    payload.agentFlow.executionLoop.join('\n'),
    /repeats a theorem\/search ladder shape/,
  );
});

test('problem 848 task list exposes the p4217 complement guard for agent loops', () => {
  const output = runCli(['problem', 'task-list', '848', '--json']);
  const payload = JSON.parse(output);
  const guard = payload.agentFlow.modePolicy.p4217ComplementStrategyGuard;

  assert.equal(guard.status, 'active_when_primary_action_enters_p4217_complement_lane');
  assert.match(guard.antiSiblingLadderRule, /one by one/);
  assert.match(
    payload.agentFlow.executionLoop.join('\n'),
    /P4217_COMPLEMENT_STRATEGY_GUARD/,
  );
});

test('problem progress reports measured surfaces without fake global percent', () => {
  const output = runCli(['problem', 'progress', '1', '--json']);
  const payload = JSON.parse(output);

  assert.equal(payload.schema, 'erdos.problem_progress/1');
  assert.equal(payload.problemId, '1');
  assert.equal(payload.globalDecision.percentComplete, null);
  assert.match(payload.globalDecision.honesty, /No honest global percent/);
  assert.equal(Number.isInteger(payload.taskBoardProgress.rollingKnownWork.totalCount), true);
  assert.equal(payload.measurementContract.some((item) => item.includes('Task-board percent measures named work items only')), true);
  assert.match(payload.commands.progress, /erdos problem progress 1/);
});

test('problem 848 progress names the global theorem-lift gap explicitly', () => {
  const output = runCli(['problem', 'progress', '848', '--json']);
  const payload = JSON.parse(output);

  assert.equal(payload.globalDecision.percentComplete, null);
  assert.equal(payload.p848Frontier.globalTheoremLift.status, 'global_theorem_lift_gap_open');
  assert.equal(payload.p848Frontier.globalTheoremLift.proofPercentComplete, null);
  assert.equal(payload.p848Frontier.frontierLedger.status, 'transition_rule_v0_rank_refined');
  assert.equal(
    payload.p848Frontier.frontierLedger.transitionRule.status,
    'transition_rule_v0_rank_refined_current_ledger',
  );
  assert.equal(payload.p848Frontier.frontierLedger.frontierGrowthPressure.status, 'active_branch_expansion_pressure');
  assert.equal(Number.isInteger(payload.p848Frontier.frontierLedger.frontierGrowthPressure.openFrontierObligationCount), true);
  assert.equal(payload.p848Frontier.frontierLedger.frontierGrowthPressure.tripwire.status, 'armed_after_current_leaf');
  assert.match(
    payload.p848Frontier.frontierLedger.frontierGrowthPressure.tripwire.forcedMove,
    /q_cover_staircase_breaker/,
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.some((obligation) => obligation.id === 'endpoint_availability_staircase_theorem'),
    true,
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.some((obligation) => obligation.id === 'q_cover_staircase_breaker'),
    true,
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.some((obligation) => obligation.id === 'live_family_binding_for_282_841'),
    true,
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.find((obligation) => obligation.id === 'live_family_binding_for_282_841')?.status,
    'done',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.find((obligation) => obligation.id === 'first_structural_unavoidability_for_282_841')?.status,
    'done',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.find((obligation) => obligation.id === 'p4217_structural_complement_invariant_blocker')?.status,
    'done',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.find((obligation) => obligation.id === 'unavailable_complement_cover')?.status,
    'blocked',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.find((obligation) => obligation.id === 'mod50_all_future_recurrence_source_theorem_blocker')?.status,
    'done',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.find((obligation) => obligation.id === 'mod50_source_archaeology_theorem_wedge')?.status,
    'done',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.currentOpenLeaf.recommendedNextAction,
    'await_p848_new_local_residual_handoff_theorem_or_explicit_guarded_source_audit_release_after_profile',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.currentOpenLeaf.status,
    'mod50_residual_handoff_label_source_audit_profile_no_spend_blocker_emitted',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.currentOpenLeaf.residualSourceImportQuestion.status,
    'prepared_no_provider_execution_under_no_spend',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.currentOpenLeaf.coversPrimaryNextAction.status,
    'completed_by_residual_handoff_label_source_audit_profile_no_spend_blocker',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.currentOpenLeaf.residualHandoffLabelSourceAuditProfile.profileId,
    'p848-mod50-residual-handoff-label-source-audit-single',
  );
  assert.equal(
    payload.artifactProgress.p848Mod50RelevantPairRowGeneratorRestorationLocalAuditBlockerCount,
    1,
  );
  assert.equal(
    payload.artifactProgress.p848Mod50SameBoundResidualHandoffLabelLocalBlockerCount,
    1,
  );
  assert.equal(
    payload.artifactProgress.p848Mod50ResidualHandoffLabelSourceAuditProfileNoSpendBlockerCount,
    1,
  );
  assert.equal(
    payload.artifactProgress.latestP848Mod50RelevantPairRowGeneratorRestorationLocalAuditBlocker.claims.completesMod50RowGeneratorRestorationLocalAudit,
    true,
  );
  assert.equal(payload.artifactProgress.p848Mod50ElementaryGeneratorRelevantPairSemanticsBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848Mod50ElementaryGeneratorRelevantPairSemanticsBlocker.claims.completesElementaryGeneratorRelevantPairAdmissibilityCheck,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848Mod50ElementaryGeneratorRelevantPairSemanticsBlocker.claims.candidatePromotedToProof,
    false,
  );
  assert.equal(
    payload.artifactProgress.latestP848Mod50ElementaryGeneratorRelevantPairSemanticsBlocker.claims.provesAllN,
    false,
  );
  assert.equal(payload.artifactProgress.p848GuardedMod50SourceAuditResultElementaryGeneratorCandidateCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848GuardedMod50SourceAuditResultElementaryGeneratorCandidate.claims.completesGuardedMod50SourceAuditReleaseOverride,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848GuardedMod50SourceAuditResultElementaryGeneratorCandidate.claims.candidatePromotedToProof,
    false,
  );
  assert.equal(
    payload.artifactProgress.latestP848GuardedMod50SourceAuditResultElementaryGeneratorCandidate.claims.provesAllN,
    false,
  );
  assert.equal(payload.artifactProgress.p848GuardedMod50SourceAuditReleaseNoSpendBlockerAfterHardBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848GuardedMod50SourceAuditReleaseNoSpendBlockerAfterHardBlocker.claims.completesPostHardBlockerGuardedReleaseDecisionUnderNoSpendConflict,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848GuardedMod50SourceAuditReleaseNoSpendBlockerAfterHardBlocker.claims.usageCheckRun,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848GuardedMod50SourceAuditReleaseNoSpendBlockerAfterHardBlocker.claims.providerExecutionReleased,
    false,
  );
  assert.equal(
    payload.artifactProgress.latestP848GuardedMod50SourceAuditReleaseNoSpendBlockerAfterHardBlocker.claims.provesAllN,
    false,
  );
  assert.equal(payload.artifactProgress.p848NoSpendSourceImportHardBlockerAfterMod50LocalStatementGapCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportHardBlockerAfterMod50LocalStatementGap.claims.completesNoSpendSourceImportHardBlockerAfterMod50LocalStatementGap,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportHardBlockerAfterMod50LocalStatementGap.claims.noCurrentNoSpendSourceImportLaneClosesAllN,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportHardBlockerAfterMod50LocalStatementGap.claims.provesAllN,
    false,
  );
  assert.equal(payload.artifactProgress.p848NoSpendSourceImportBoundaryAfterMod50LocalStatementGapCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportBoundaryAfterMod50LocalStatementGap.claims.completesNoSpendSourceImportBoundaryAfterMod50LocalStatementGap,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportBoundaryAfterMod50LocalStatementGap.claims.allThreeSourceImportLanesRemainBlocked,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportBoundaryAfterMod50LocalStatementGap.claims.provesAllN,
    false,
  );
  assert.equal(payload.artifactProgress.p848Mod50GeneratorTheoremStatementLocalProofGapAfterAllNRecombinationBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848Mod50GeneratorTheoremStatementLocalProofGapAfterAllNRecombinationBlocker.claims.emitsMod50GeneratorLocalStatementGap,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848Mod50GeneratorTheoremStatementLocalProofGapAfterAllNRecombinationBlocker.claims.provesMod50AllFutureRecurrence,
    false,
  );
  assert.equal(payload.artifactProgress.p848NoSpendLocalSourceTheoremStatementBacklogAfterAllNRecombinationBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848NoSpendLocalSourceTheoremStatementBacklogAfterAllNRecombinationBlocker.claims.completesNoSpendLocalSourceTheoremStatementBacklog,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendLocalSourceTheoremStatementBacklogAfterAllNRecombinationBlocker.claims.selectsMod50AsCheapestLocalProbe,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendLocalSourceTheoremStatementBacklogAfterAllNRecombinationBlocker.claims.provesAllN,
    false,
  );
  assert.equal(payload.artifactProgress.p848NoSpendAllNRecombinationBlockerAfterThreeProfileDecisionCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848NoSpendAllNRecombinationBlockerAfterThreeProfileDecision.claims.completesNoSpendAllNRecombinationBlocker,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendAllNRecombinationBlockerAfterThreeProfileDecision.claims.madeNewPaidCall,
    false,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendAllNRecombinationBlockerAfterThreeProfileDecision.claims.provesAllN,
    false,
  );
  assert.equal(payload.artifactProgress.p848ThreeProfileSourceImportNoSpendDecisionBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848ThreeProfileSourceImportNoSpendDecisionBlocker.claims.completesThreeProfileSourceImportDecision,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848ThreeProfileSourceImportNoSpendDecisionBlocker.claims.usageCheckRun,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848ThreeProfileSourceImportNoSpendDecisionBlocker.claims.madeNewPaidCall,
    false,
  );
  assert.equal(payload.artifactProgress.p848NoSpendSourceImportBoundaryAfterMod50ProfileBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportBoundaryAfterMod50ProfileBlocker.claims.completesSourceImportBoundaryAfterMod50ProfileBlocker,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportBoundaryAfterMod50ProfileBlocker.claims.allThreeSourceLanesRepresentedByProfileOrHardBlocker,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportBoundaryAfterMod50ProfileBlocker.claims.provesAllN,
    false,
  );
  assert.equal(payload.artifactProgress.p848Mod50GeneratorSourceImportProfileNoSpendBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848Mod50GeneratorSourceImportProfileNoSpendBlocker.claims.completesMod50GeneratorSourceImportProfileBlocker,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848Mod50GeneratorSourceImportProfileNoSpendBlocker.claims.blocksFiniteReplayAsAllFuture,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848Mod50GeneratorSourceImportProfileNoSpendBlocker.claims.provesMod50AllFutureRecurrence,
    false,
  );
  assert.equal(payload.artifactProgress.p848NoSpendSourceImportBoundaryAfterSquareModuliProfileBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportBoundaryAfterSquareModuliProfileBlocker.claims.completesSourceImportBoundaryAfterSquareModuliProfileBlocker,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportBoundaryAfterSquareModuliProfileBlocker.claims.selectsMod50AsNextSourceObject,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportBoundaryAfterSquareModuliProfileBlocker.claims.provesAllN,
    false,
  );
  assert.equal(payload.artifactProgress.p848SquareModuliUnionHittingSourceImportProfileApprovalBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848SquareModuliUnionHittingSourceImportProfileApprovalBlocker.claims.completesSquareModuliUnionHittingProfileApprovalBlocker,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848SquareModuliUnionHittingSourceImportProfileApprovalBlocker.claims.provesSawhneyUnionHittingUpperBound,
    false,
  );
  assert.equal(
    payload.artifactProgress.latestP848SquareModuliUnionHittingSourceImportProfileApprovalBlocker.approvalDecision.profileExecutionBlockedThisTurn,
    true,
  );
  assert.equal(payload.artifactProgress.p848SquareModuliUnionHittingSourceIndexNoSpendAuditCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848SquareModuliUnionHittingSourceIndexNoSpendAudit.claims.completesSquareModuliUnionHittingSourceIndexAudit,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848SquareModuliUnionHittingSourceIndexNoSpendAudit.claims.foundSawhneyCompatibleUnionHittingUpperBoundSource,
    false,
  );
  assert.equal(
    payload.artifactProgress.latestP848SquareModuliUnionHittingSourceIndexNoSpendAudit.sourceImportProfileSeed.stepId,
    'prepare_p848_square_moduli_union_hitting_source_import_profile_or_approval_blocker',
  );
  assert.equal(payload.artifactProgress.p848NoSpendLocalTheoremBacklogAfterSourceImportBoundaryCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848NoSpendLocalTheoremBacklogAfterSourceImportBoundary.claims.completesNoSpendLocalTheoremBacklog,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendLocalTheoremBacklogAfterSourceImportBoundary.claims.selectedBacklogItemIsSquareModuliUnionHitting,
    true,
  );
  assert.equal(payload.artifactProgress.p848NoSpendSourceImportBoundaryAfterLocalP4217HardBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportBoundaryAfterLocalP4217HardBlocker.claims.completesNoSpendSourceImportBoundaryAssembly,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848NoSpendSourceImportBoundaryAfterLocalP4217HardBlocker.claims.selectsNoSpendLocalTheoremBacklog,
    true,
  );
  assert.equal(payload.artifactProgress.p848LocalP4217ResidualSourceTheoremProofAttemptHardBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848LocalP4217ResidualSourceTheoremProofAttemptHardBlocker.claims.emitsHardBlocker,
    true,
  );
  assert.equal(payload.artifactProgress.p848P4217ResidualSourceImportProfileApprovalBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848P4217ResidualSourceImportProfileApprovalBlocker.claims.completesProfileApprovalBlocker,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848P4217ResidualSourceImportProfileApprovalBlocker.claims.blocksLiveSpendThisTurn,
    true,
  );
  assert.equal(payload.artifactProgress.p848RepairedSingleLaneSourceImportProfileAfterNoSpendGapCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848RepairedSingleLaneSourceImportProfileAfterNoSpendGap.claims.completesRepairedSingleLaneProfilePrep,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848RepairedSingleLaneSourceImportProfileAfterNoSpendGap.claims.selectedLaneIsP4217Residual,
    true,
  );
  assert.equal(payload.artifactProgress.p848AllNRecombinationResidualAfterSourceImportSearchGapCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848AllNRecombinationResidualAfterSourceImportSearchGap.claims.completesPostSourceImportSearchGapResidualAssembly,
    true,
  );
  assert.equal(payload.artifactProgress.p848SourceImportRecoveryPlanAfterP4217AndMod50SourceGapsCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848SourceImportRecoveryPlanAfterP4217AndMod50SourceGaps.claims.selectsNoSpendSourceSearch,
    true,
  );
  assert.equal(payload.artifactProgress.p848AllNRecombinationResidualAfterP4217SourceTheoremGapCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848AllNRecombinationResidualAfterP4217SourceTheoremGap.claims.selectedNextActionIsSourceImportRecovery,
    true,
  );
  assert.equal(payload.artifactProgress.p848P4217ResidualSquarefreeRealizationSourceTheoremGapCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848P4217ResidualSquarefreeRealizationSourceTheoremGap.claims.emitsP4217ResidualSourceTheoremGap,
    true,
  );
  assert.equal(payload.artifactProgress.p848P4217ComplementTheoremWedgeDecisionBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848P4217ComplementTheoremWedgeDecisionBlocker.claims.selectsSquarefreeRealizationFork,
    true,
  );
  assert.equal(payload.artifactProgress.p848P4217ComplementTheoremWedgeSourceImportAuditCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848P4217ComplementTheoremWedgeSourceImportAudit.claims.preparesBudgetGuardedWedgeDecision,
    true,
  );
  assert.equal(payload.artifactProgress.p848CorrectedSquareModuliDualSieveOrUnionHittingThresholdCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848CorrectedSquareModuliDualSieveOrUnionHittingThreshold.claims.provesComplementDualityDoesNotRepairDirection,
    true,
  );
  assert.equal(payload.artifactProgress.p848TaoVanDoornThresholdPivotReconciliationCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848TaoVanDoornThresholdPivotReconciliation.claims.blocksDirectThresholdCollapseClaim,
    true,
  );
  assert.equal(payload.artifactProgress.p848P4217ComplementCoverImpossibilityBlockerCount, 1);
  assert.equal(
    payload.artifactProgress.latestP848P4217ComplementCoverImpossibilityBlocker.coversPrimaryNextAction.status,
    'blocked_by_no_repo_owned_p4217_complement_cover_or_impossibility',
  );
  assert.equal(
    payload.artifactProgress.latestP848Mod50TheoremWedgeDecisionBlocker.orpResearchRun.apiCalled,
    true,
  );
  assert.equal(
    payload.artifactProgress.latestP848Mod50TheoremWedgeDecisionBlocker.orpResearchRun.laneStatuses[0].incompleteReason,
    'max_output_tokens',
  );
  assert.deepEqual(
    payload.artifactProgress.latestP848Mod50TheoremWedgeDecisionBlocker.finiteMenuAudit.repairWitnessPrimesOutsideTuplePool,
    [5, 67, 211, 257],
  );
  assert.match(
    payload.p848Frontier.globalTheoremLift.nextBestTheoremMove,
    /residual handoff-label theorem|row-generator\/finite-Q theorem/,
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.find((obligation) => obligation.id === 'final_all_n_recombination')?.status,
    'blocked',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.find((obligation) => obligation.id === 'frontier_ledger_format')?.status,
    'done',
  );
  assert.equal(
    payload.p848Frontier.globalTheoremLift.obligations.find((obligation) => obligation.id === 'measure_decrease_or_terminal_leaf_proof')?.status,
    'done',
  );
  assert.equal(payload.p848Frontier.complementStrategyGuard.status, 'active_bulk_cover_guard_enabled');
  assert.match(
    payload.p848Frontier.complementStrategyGuard.antiSiblingLadderRule.antiPattern,
    /fallback selectors/,
  );
  assert.match(
    payload.p848Frontier.complementStrategyGuard.antiSiblingLadderRule.stopRule,
    /ledger rank/,
  );
  assert.match(
    payload.p848Frontier.complementStrategyGuard.growthPressureRule.rule,
    /availability split can create/,
  );
  assert.match(
    payload.p848Frontier.complementStrategyGuard.growthPressureRule.tripwire.activationCondition,
    /pause selector descent/,
  );
  assert.match(
    payload.p848Frontier.complementStrategyGuard.postCurrentLeafBulkHandoff.status,
    /armed_after|triggered_after|q_avoiding_batch_cover_selected|convergence_assembly_required|q_cover_staircase_breaker_required|q_cover_staircase_nonconvergence_blocker/,
  );
  assert.match(
    payload.p848Frontier.complementStrategyGuard.postCurrentLeafBulkHandoff.forbiddenAfterTrigger,
    /fresh p-next\/q-next sibling ladder/,
  );
  if (payload.p848Frontier.complementStrategyGuard.currentLeafWork.status === 'q97_p151_repair_candidate_exact_certification_allowed') {
    assert.match(
      payload.p848Frontier.complementStrategyGuard.antiSiblingLadderRule.allowedException,
      /p151 exact-certification/,
    );
    assert.equal(
      payload.p848Frontier.complementStrategyGuard.currentLeafWork.firstRepairCandidateEndpointPrime,
      151,
    );
    assert.deepEqual(
      payload.p848Frontier.complementStrategyGuard.currentLeafWork.reserveRepairCandidateEndpointPrimes,
      [479],
    );
  }
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

test('workspace hygiene classifies dirty worktree state for delegation loops', () => {
  const output = runCli(['workspace', 'hygiene', '--json']);
  const payload = JSON.parse(output);

  assert.equal(payload.schema, 'erdos.worktree_hygiene/1');
  assert.equal(Number.isInteger(payload.dirtyCount), true);
  assert.equal(typeof payload.status, 'string');
  assert.equal(Array.isArray(payload.selfHealingPolicy), true);
  assert.match(payload.recommendedNextChecks.join('\n'), /git status --short/);
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
  assert.match(output, /First ready atom: N848\.G1\.A24/);
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
  assert.match(output, /Number-theory active ticket: N1/);
  assert.match(output, /Number-theory ready atoms: 1/);
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
  const protocolPath = path.join(workspace, '.erdos', 'orp', 'PROTOCOL.md');
  const integrationPath = path.join(workspace, '.erdos', 'orp', 'AGENT_INTEGRATION.md');
  assert.equal(fs.existsSync(protocolPath), true);
  assert.equal(fs.existsSync(integrationPath), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'orp', 'templates', 'CLAIM.md')), true);
  assert.match(fs.readFileSync(protocolPath, 'utf8'), /--allow-paid/);
  assert.match(fs.readFileSync(protocolPath, 'utf8'), /ERDOS_ORP_RESEARCH_DAILY_LIMIT/);
  assert.match(fs.readFileSync(protocolPath, 'utf8'), /ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT/);
  assert.match(fs.readFileSync(integrationPath, 'utf8'), /approval packet/);
  assert.match(fs.readFileSync(integrationPath, 'utf8'), /ERDOS_ORP_RESEARCH_ALLOW_PAID/);
  assert.match(fs.readFileSync(integrationPath, 'utf8'), /source audit|source-audit/);

  const showOutput = runCli(['orp', 'show'], { cwd: workspace });
  assert.match(showOutput, /Open Research Protocol/);
  assert.match(showOutput, /Workspace protocol:/);
  assert.match(showOutput, /Workspace templates:/);
});

test('orp research status exposes governed OpenAI research commands', () => {
  const output = runCli(['orp', 'research', 'status', '--json'], {
    env: {
      ERDOS_ORP_RESEARCH_DAILY_LIMIT: '',
      ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT: '',
      ERDOS_ORP_RESEARCH_ESTIMATED_COST_USD: '',
    },
  });
  const payload = JSON.parse(output);

  assert.equal(payload.schema, 'erdos.orp_research_integration/1');
  assert.equal(payload.liveCalls.requiresExecuteFlag, true);
  assert.equal(payload.liveCalls.requiresAllowPaidFlag, true);
  assert.equal(payload.liveCalls.dailyLiveRunLimit, 10);
  assert.equal(payload.liveCalls.dailySpendLimitUsd, 5);
  assert.equal(payload.liveCalls.defaultEstimatedAskCostUsd, 1);
  assert.equal(payload.liveCalls.defaultEstimatedSmokeCostUsd, 0.05);
  assert.equal(payload.openai.secretAlias, 'openai-primary');
  assert.equal(payload.openai.envVarName, 'OPENAI_API_KEY');
  assert.match(payload.commands.plan, /erdos orp research ask/);
  assert.match(payload.commands.openaiCheckLive, /--execute/);
  assert.match(payload.commands.openaiCheckLive, /--allow-paid/);
  assert.match(payload.commands.usage, /erdos orp research usage/);
});

test('orp research execute is blocked without paid-call opt-in', () => {
  assert.throws(
    () => runCli(['orp', 'research', 'openai-check', '--execute', '--json'], {
      env: {
        ERDOS_ORP_RESEARCH_ALLOW_PAID: '',
      },
    }),
    (error) => {
      const payload = JSON.parse(error.stdout);
      assert.equal(payload.status, 'blocked_by_paid_call_guard');
      assert.equal(payload.reason, 'missing_paid_call_opt_in');
      assert.equal(payload.requiredFlags.includes('--allow-paid'), true);
      return true;
    },
  );
});

test('orp research live calls respect the daily limit kill switch', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-research-guard-'));
  assert.throws(
    () => runCli(['orp', 'research', 'openai-check', '--execute', '--allow-paid', '--json'], {
      cwd: workspace,
      env: {
        ERDOS_ORP_RESEARCH_DAILY_LIMIT: '0',
      },
    }),
    (error) => {
      const payload = JSON.parse(error.stdout);
      assert.equal(payload.status, 'blocked_by_paid_call_guard');
      assert.equal(payload.reason, 'daily_live_run_limit_zero');
      assert.equal(payload.usage.dailyLiveRunLimit, 0);
      return true;
    },
  );
});

test('orp research live calls respect the daily spend budget kill switch', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-research-budget-'));
  assert.throws(
    () => runCli(['orp', 'research', 'openai-check', '--execute', '--allow-paid', '--json'], {
      cwd: workspace,
      env: {
        ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT: '0',
      },
    }),
    (error) => {
      const payload = JSON.parse(error.stdout);
      assert.equal(payload.status, 'blocked_by_paid_call_guard');
      assert.equal(payload.reason, 'daily_spend_limit_zero');
      assert.equal(payload.usage.dailySpendLimitUsd, 0);
      return true;
    },
  );
});

test('orp research live calls block before exceeding daily spend budget', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-research-budget-'));
  assert.throws(
    () => runCli(['orp', 'research', 'ask', '848', '--question', 'budget guard test', '--execute', '--allow-paid', '--json'], {
      cwd: workspace,
      env: {
        ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT: '0.50',
      },
    }),
    (error) => {
      const payload = JSON.parse(error.stdout);
      assert.equal(payload.status, 'blocked_by_paid_call_guard');
      assert.equal(payload.reason, 'daily_spend_limit_would_exceed');
      assert.equal(payload.estimatedCostUsd, 1);
      assert.equal(payload.usage.dailySpendLimitUsd, 0.5);
      return true;
    },
  );
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
