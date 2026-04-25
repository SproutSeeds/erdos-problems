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
  'problem848_282_alignment_obstruction_packet.mjs',
);
const tvdReconciliationCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_tao_van_doorn_threshold_pivot_reconciliation.mjs',
);
const correctedSquareModuliCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_corrected_square_moduli_dual_sieve_or_union_hitting_threshold_packet.mjs',
);
const p4217TheoremWedgeSourceImportAuditCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_p4217_complement_theorem_wedge_source_import_audit.mjs',
);
const p4217TheoremWedgeDecisionBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_p4217_complement_theorem_wedge_decision_blocker.mjs',
);
const p4217ResidualSourceTheoremGapCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_p4217_residual_squarefree_realization_source_theorem_gap.mjs',
);
const allNResidualAfterP4217SourceGapCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_all_n_recombination_residual_after_p4217_source_theorem_gap.mjs',
);
const sourceImportRecoveryPlanAfterP4217AndMod50SourceGapsCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_source_import_recovery_plan_after_p4217_and_mod50_source_gaps.mjs',
);
const noSpendSourceRecoverySearchForP4217Mod50UnionHittingCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting.mjs',
);
const allNResidualAfterSourceImportSearchGapCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_all_n_recombination_residual_after_source_import_search_gap.mjs',
);
const repairedSingleLaneSourceImportProfileAfterNoSpendGapCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_repaired_single_lane_source_import_profile_after_no_spend_gap.mjs',
);
const p4217ResidualSourceImportProfileApprovalBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_p4217_residual_source_import_profile_approval_blocker.mjs',
);
const localP4217ResidualSourceTheoremProofAttemptHardBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_local_p4217_residual_source_theorem_proof_attempt_hard_blocker.mjs',
);
const noSpendSourceImportBoundaryAfterLocalP4217HardBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_no_spend_source_import_boundary_after_local_p4217_hard_blocker.mjs',
);
const noSpendLocalTheoremBacklogAfterSourceImportBoundaryCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_no_spend_local_theorem_backlog_after_source_import_boundary.mjs',
);
const squareModuliUnionHittingSourceIndexNoSpendAuditCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_square_moduli_union_hitting_source_index_no_spend_audit.mjs',
);
const squareModuliUnionHittingSourceImportProfileApprovalBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_square_moduli_union_hitting_source_import_profile_or_approval_blocker.mjs',
);
const noSpendSourceImportBoundaryAfterSquareModuliProfileBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_no_spend_source_import_boundary_after_square_moduli_profile_blocker.mjs',
);
const mod50GeneratorSourceImportProfileNoSpendBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_mod50_generator_source_import_profile_no_spend_blocker.mjs',
);
const noSpendSourceImportBoundaryAfterMod50ProfileBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_no_spend_source_import_boundary_after_mod50_profile_blocker.mjs',
);
const threeProfileSourceImportNoSpendDecisionBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_three_profile_source_import_no_spend_decision_blocker.mjs',
);
const noSpendAllNRecombinationBlockerAfterThreeProfileDecisionCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_no_spend_all_n_recombination_blocker_after_three_profile_decision.mjs',
);
const noSpendLocalSourceTheoremStatementBacklogAfterAllNRecombinationBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker.mjs',
);
const mod50GeneratorTheoremStatementLocalProofGapAfterAllNRecombinationBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_mod50_generator_theorem_statement_local_proof_gap_after_all_n_recombination_blocker.mjs',
);
const noSpendSourceImportBoundaryAfterMod50LocalStatementGapCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_no_spend_source_import_boundary_after_mod50_local_statement_gap.mjs',
);
const noSpendSourceImportHardBlockerAfterMod50LocalStatementGapCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap.mjs',
);
const guardedMod50SourceAuditReleaseNoSpendBlockerAfterHardBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_guarded_mod50_source_audit_release_no_spend_blocker_after_hard_blocker.mjs',
);
const mod50ElementaryGeneratorRelevantPairSemanticsBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_mod50_elementary_generator_relevant_pair_semantics_blocker.mjs',
);
const mod50RelevantPairRowGeneratorRestorationLocalAuditBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_mod50_relevant_pair_row_generator_restoration_local_audit_blocker.mjs',
);
const mod50SameBoundResidualHandoffLabelLocalBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_mod50_same_bound_residual_handoff_label_local_blocker.mjs',
);
const mod50ResidualHandoffLabelSourceAuditProfileNoSpendBlockerCompiler = path.join(
  repoRoot,
  'packs',
  'number-theory',
  'problems',
  '848',
  'compute',
  'problem848_mod50_residual_handoff_label_source_audit_profile_no_spend_blocker.mjs',
);

function runCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-282-alignment-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [compiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runTvdReconciliationCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-tvd-reconciliation-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [tvdReconciliationCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runCorrectedSquareModuliCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-corrected-square-moduli-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [correctedSquareModuliCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runP4217TheoremWedgeSourceImportAuditCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-p4217-theorem-wedge-audit-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [p4217TheoremWedgeSourceImportAuditCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runP4217TheoremWedgeDecisionBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-p4217-theorem-wedge-decision-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [p4217TheoremWedgeDecisionBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runP4217ResidualSourceTheoremGapCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-p4217-residual-source-gap-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [p4217ResidualSourceTheoremGapCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runAllNResidualAfterP4217SourceGapCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-all-n-after-p4217-source-gap-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [allNResidualAfterP4217SourceGapCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runSourceImportRecoveryPlanAfterP4217AndMod50SourceGapsCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-source-import-recovery-plan-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [sourceImportRecoveryPlanAfterP4217AndMod50SourceGapsCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runNoSpendSourceRecoverySearchForP4217Mod50UnionHittingCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-no-spend-source-recovery-search-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [noSpendSourceRecoverySearchForP4217Mod50UnionHittingCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runRepairedSingleLaneSourceImportProfileAfterNoSpendGapCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-repaired-single-lane-profile-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  const profileOutput = path.join(tempDir, 'profile.json');
  execFileSync('node', [repairedSingleLaneSourceImportProfileAfterNoSpendGapCompiler, ...args, '--json-output', jsonOutput, '--profile-output', profileOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  const packet = JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
  packet.__testProfile = JSON.parse(fs.readFileSync(profileOutput, 'utf8'));
  return packet;
}

function runP4217ResidualSourceImportProfileApprovalBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-p4217-source-profile-approval-blocker-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [p4217ResidualSourceImportProfileApprovalBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runLocalP4217ResidualSourceTheoremProofAttemptHardBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-local-p4217-source-hard-blocker-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [localP4217ResidualSourceTheoremProofAttemptHardBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runNoSpendSourceImportBoundaryAfterLocalP4217HardBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-no-spend-source-import-boundary-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [noSpendSourceImportBoundaryAfterLocalP4217HardBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runNoSpendLocalTheoremBacklogAfterSourceImportBoundaryCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-no-spend-local-theorem-backlog-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [noSpendLocalTheoremBacklogAfterSourceImportBoundaryCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runSquareModuliUnionHittingSourceIndexNoSpendAuditCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-square-moduli-source-index-audit-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [squareModuliUnionHittingSourceIndexNoSpendAuditCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runSquareModuliUnionHittingSourceImportProfileApprovalBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-square-moduli-profile-blocker-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  const profileOutput = path.join(tempDir, 'profile.json');
  execFileSync('node', [squareModuliUnionHittingSourceImportProfileApprovalBlockerCompiler, ...args, '--json-output', jsonOutput, '--profile-output', profileOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  const packet = JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
  packet.__testProfile = JSON.parse(fs.readFileSync(profileOutput, 'utf8'));
  return packet;
}

function runNoSpendSourceImportBoundaryAfterSquareModuliProfileBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-source-boundary-after-square-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [noSpendSourceImportBoundaryAfterSquareModuliProfileBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runMod50GeneratorSourceImportProfileNoSpendBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-mod50-generator-source-import-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  const profileOutput = path.join(tempDir, 'profile.json');
  execFileSync('node', [mod50GeneratorSourceImportProfileNoSpendBlockerCompiler, ...args, '--json-output', jsonOutput, '--profile-output', profileOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  const packet = JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
  packet.__testProfile = JSON.parse(fs.readFileSync(profileOutput, 'utf8'));
  return packet;
}

function runNoSpendSourceImportBoundaryAfterMod50ProfileBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-source-boundary-after-mod50-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [noSpendSourceImportBoundaryAfterMod50ProfileBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runThreeProfileSourceImportNoSpendDecisionBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-three-profile-no-spend-decision-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [threeProfileSourceImportNoSpendDecisionBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runNoSpendAllNRecombinationBlockerAfterThreeProfileDecisionCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-no-spend-all-n-recombination-blocker-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [noSpendAllNRecombinationBlockerAfterThreeProfileDecisionCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runNoSpendLocalSourceTheoremStatementBacklogAfterAllNRecombinationBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-local-source-theorem-backlog-after-all-n-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [noSpendLocalSourceTheoremStatementBacklogAfterAllNRecombinationBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runMod50GeneratorTheoremStatementLocalProofGapAfterAllNRecombinationBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-mod50-local-statement-gap-after-all-n-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [mod50GeneratorTheoremStatementLocalProofGapAfterAllNRecombinationBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runNoSpendSourceImportBoundaryAfterMod50LocalStatementGapCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-source-import-boundary-after-mod50-gap-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [noSpendSourceImportBoundaryAfterMod50LocalStatementGapCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runNoSpendSourceImportHardBlockerAfterMod50LocalStatementGapCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-source-import-hard-blocker-after-mod50-gap-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [noSpendSourceImportHardBlockerAfterMod50LocalStatementGapCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runGuardedMod50SourceAuditReleaseNoSpendBlockerAfterHardBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-guarded-mod50-release-conflict-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [guardedMod50SourceAuditReleaseNoSpendBlockerAfterHardBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runMod50ElementaryGeneratorRelevantPairSemanticsBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-mod50-elementary-semantics-blocker-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [mod50ElementaryGeneratorRelevantPairSemanticsBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runMod50RelevantPairRowGeneratorRestorationLocalAuditBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-mod50-row-generator-restoration-audit-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [mod50RelevantPairRowGeneratorRestorationLocalAuditBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runMod50SameBoundResidualHandoffLabelLocalBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-mod50-same-bound-residual-handoff-blocker-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [mod50SameBoundResidualHandoffLabelLocalBlockerCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

function runMod50ResidualHandoffLabelSourceAuditProfileNoSpendBlockerCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-mod50-residual-handoff-profile-blocker-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  const profileOutput = path.join(tempDir, 'profile.json');
  execFileSync('node', [mod50ResidualHandoffLabelSourceAuditProfileNoSpendBlockerCompiler, ...args, '--json-output', jsonOutput, '--profile-output', profileOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  const packet = JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
  packet.__profileOutput = JSON.parse(fs.readFileSync(profileOutput, 'utf8'));
  return packet;
}

function runAllNResidualAfterSourceImportSearchGapCompiler(args = []) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'p848-all-n-after-source-search-gap-'));
  const jsonOutput = path.join(tempDir, 'packet.json');
  execFileSync('node', [allNResidualAfterSourceImportSearchGapCompiler, ...args, '--json-output', jsonOutput], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  return JSON.parse(fs.readFileSync(jsonOutput, 'utf8'));
}

test('problem 848 tail-282 alignment packet isolates the 841 obstruction at 137720141', () => {
  const packet = runCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_282_alignment_obstruction_packet/1');
  assert.equal(packet.status, 'mechanism_candidate_family_row_reconstructed');
  assert.equal(packet.representative, 137720141);
  assert.deepEqual(packet.sharedPrefix, [7, 32, 57, 82, 132, 182]);

  const target = packet.obstructionWitnesses.targetContinuation;
  assert.equal(target.value, 282);
  assert.equal(target.squareDivisorPrime, 29);
  assert.equal(target.squareDivisor, 841);
  assert.equal(target.squarefree, false);

  for (const witness of packet.obstructionWitnesses.comparisons) {
    assert.equal(witness.squarefree, true);
  }

  assert.equal(packet.mechanismReadout.comparisonsStaySquarefree, true);
  assert.equal(packet.mechanismReadout.familyRowRecovered, true);
  assert.equal(packet.mechanismReadout.targetWitnessLiftedToSubprogression, true);
  assert.equal(packet.proofBoundary.provesObservedRepresentativeMechanism, true);
  assert.equal(packet.proofBoundary.regeneratesFamilyRow, true);
  assert.equal(packet.proofBoundary.liftsTargetWitnessToRecoveredSubprogression, true);
  assert.equal(packet.proofBoundary.provesFirstStructuralUnavoidability, false);
  assert.match(packet.sourceAudit.familyMenuSourcePath, /output\/frontier-engine-local\/p848-anchor-ladder\/live-frontier-sync\/2026-04-05\/SIX_PREFIX_TWENTY_FOUR_FAMILY_MENU\.json$/);
  assert.equal(
    packet.sourceAudit.familyMenuSourceExists,
    fs.existsSync(path.join(repoRoot, packet.sourceAudit.familyMenuSourcePath)),
  );

  const anchorClass = packet.reconstructedCrt.anchorClass;
  assert.equal(anchorClass.representativeMatches, true);
  assert.equal(anchorClass.congruences.length, 6);

  const targetClass = packet.reconstructedCrt.targetContinuationClass;
  assert.equal(targetClass.representativeMatches, true);
  assert.equal(targetClass.congruences.length, 7);
  assert.equal(targetClass.congruences.at(-1).value, 282);
  assert.equal(targetClass.congruences.at(-1).modulus, 841);

  assert.equal(packet.syntheticFamilyRows.anchorOnly.tupleKey, '4, 23^2, 7^2, 9, 17^2, 11^2');
  assert.equal(packet.syntheticFamilyRows.withTargetContinuation.tupleKey, '4, 23^2, 7^2, 9, 17^2, 11^2, 29^2');

  const recoveredRow = packet.recoveredFamilyRow;
  assert.equal(recoveredRow.recoveryStatus, 'regenerated_tuple_rows_and_crt');
  assert.equal(recoveredRow.representative, 137720141);
  assert.equal(recoveredRow.tupleKey, '4, 23^2, 7^2, 9, 17^2, 11^2');
  assert.equal(recoveredRow.modulus, anchorClass.modulus);
  assert.equal(recoveredRow.residue, anchorClass.residue);
  assert.deepEqual(recoveredRow.tupleRows.map((row) => row.squareModulus), [4, 529, 49, 9, 289, 121]);
  assert.deepEqual(recoveredRow.tupleRows.map((row) => row.residue), [1, 281, 6, 8, 81, 119]);

  const repairRowsByAnchor = new Map(recoveredRow.repairRows.map((row) => [row.anchor, row]));
  assert.equal(repairRowsByAnchor.get(282).squarefree, false);
  assert.deepEqual(repairRowsByAnchor.get(282).squareWitnesses.map((row) => row.squareModulus), [841]);
  for (const anchor of [332, 432, 782, 832]) {
    assert.equal(repairRowsByAnchor.get(anchor).squarefree, true);
    assert.deepEqual(repairRowsByAnchor.get(anchor).squareWitnesses, []);
  }

  assert.equal(packet.targetWitnessLift.status, 'target_witness_subprogression_starts_at_representative');
  assert.equal(packet.targetWitnessLift.rowIndexCongruence.expression, 't == 0 mod 841');
  assert.equal(packet.targetWitnessLift.targetContinuationClass.modulus, targetClass.modulus);
  assert.equal(packet.targetWitnessLift.targetContinuationClass.residue, targetClass.residue);
});

test('problem 848 Tao-van Doorn threshold pivot reconciliation blocks the direct shortcut', () => {
  const packet = runTvdReconciliationCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_tao_van_doorn_threshold_pivot_reconciliation_packet/1');
  assert.equal(packet.status, 'tvd_threshold_pivot_reconciled_direct_route_blocked_dual_sieve_required');
  assert.equal(packet.target, 'evaluate_p848_tao_van_doorn_threshold_collapse_claim_before_resuming_frontier');
  assert.equal(packet.recommendedNextAction, 'derive_p848_corrected_square_moduli_dual_sieve_or_union_hitting_threshold_packet');

  assert.equal(packet.theoremShape.taoVanDoornControls, 'upper_bound_for_sets_avoiding_residue_classes_mod_p_squared');
  assert.equal(packet.theoremShape.sawhneyBottleneckNeeds, 'upper_bound_for_union_or_hitting_sets_in_square_obstruction_classes');
  assert.match(packet.theoremShape.directMismatch, /does not imply/);

  assert.equal(packet.numericalReconciliation.minimumHsumForOneOver25, 25);
  assert.equal(packet.numericalReconciliation.directCollapseFeasibility, 'blocked_by_denominator_size');
  assert.equal(packet.numericalReconciliation.hsumTable.length, 4);
  assert.equal(packet.numericalReconciliation.maxAstarHsum < 2, true);

  assert.equal(packet.delegationDecision.decision, 'keep_clawdad_paused_before_more_q_frontier_compute');
  assert.equal(
    packet.delegationDecision.forbiddenMovesUntilThen.includes('claim_N0_around_1e6_from_Tao_van_Doorn_Theorem_16_directly'),
    true,
  );

  assert.equal(packet.claims.reconcilesTeammateTvdPivotClaim, true);
  assert.equal(packet.claims.recomputesTvdHsumSanityCheck, true);
  assert.equal(packet.claims.blocksDirectThresholdCollapseClaim, true);
  assert.equal(packet.claims.keepsDelegationPausedBeforeMoreQFrontierCompute, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.provesCorrectedDualSieve, false);
  assert.equal(packet.claims.provesUnionHittingThresholdBound, false);
  assert.equal(packet.claims.provesExplicitN0, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 corrected square-moduli packet closes the current analytic shortcut honestly', () => {
  const packet = runCorrectedSquareModuliCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_corrected_square_moduli_dual_sieve_or_union_hitting_threshold_packet/1');
  assert.equal(packet.status, 'corrected_square_moduli_sieve_no_go_current_sources_handoff_to_p4217');
  assert.equal(packet.target, 'derive_p848_corrected_square_moduli_dual_sieve_or_union_hitting_threshold_packet');
  assert.equal(packet.recommendedNextAction, 'prepare_p848_p4217_complement_theorem_wedge_or_import_source_cover');
  assert.equal(packet.coversPrimaryNextAction.status, 'blocked_by_current_source_no_go_handoff_to_p4217_theorem_wedge');

  assert.match(packet.correctedRouteAudit.dualityFailure, /lower bound on the hitting side/);
  assert.equal(
    packet.candidateRouteDecisions.find((route) => route.routeId === 'complement_duality_from_avoiding_upper_bound')?.status,
    'blocked',
  );
  assert.equal(
    packet.candidateRouteDecisions.find((route) => route.routeId === 'external_or_imported_union_hitting_square_moduli_sieve')?.status,
    'not_present_in_current_repo_sources',
  );
  assert.equal(packet.handoffDecision.decision, 'close_current_tvd_shortcut_and_release_p4217_theorem_wedge');
  assert.equal(packet.handoffDecision.releasedAction, 'prepare_p848_p4217_complement_theorem_wedge_or_import_source_cover');

  assert.equal(packet.claims.emitsCorrectedSquareModuliNoGoPacket, true);
  assert.equal(packet.claims.provesTvdDirectRouteWrongDirectionForSawhneyUnionBound, true);
  assert.equal(packet.claims.provesComplementDualityDoesNotRepairDirection, true);
  assert.equal(packet.claims.preservesPossibilityOfFutureExternalUnionHittingTheorem, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.provesNoSquareModuliSieveExistsGlobally, false);
  assert.equal(packet.claims.provesUnionHittingThresholdBound, false);
  assert.equal(packet.claims.provesExplicitN0, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 p4217 theorem-wedge source-import audit records the no-spend decision gate', () => {
  const packet = runP4217TheoremWedgeSourceImportAuditCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_complement_theorem_wedge_source_import_audit_packet/1');
  assert.equal(packet.status, 'p4217_theorem_wedge_source_import_audit_planning_only_no_source_theorem');
  assert.equal(packet.target, 'prepare_p848_p4217_complement_theorem_wedge_or_import_source_cover');
  assert.equal(packet.recommendedNextAction, 'decide_p848_p4217_complement_wedge_with_budget_guard_or_local_symbolic_proof');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_planning_only_source_import_audit_no_theorem_found');

  assert.equal(packet.orpPlanningRun.status, 'planned');
  assert.equal(packet.orpPlanningRun.execute, false);
  assert.equal(packet.orpPlanningRun.apiCalled, false);
  assert.equal(packet.orpPlanningRun.breakdownMode, 'granular-breakdown');
  assert.equal(packet.sourceImportAudit.result, 'no_repo_owned_p4217_whole_complement_source_theorem_found');
  assert.equal(packet.sourceImportAudit.auditedSourceCount, 11);
  assert.match(packet.sourceImportAudit.missingTheoremObjects.join('\n'), /whole p4217 unavailable-complement cover theorem/);

  assert.equal(packet.wedgeDecisionBoundary.planningOnly, true);
  assert.equal(packet.wedgeDecisionBoundary.apiCalled, false);
  assert.equal(packet.wedgeDecisionBoundary.sourceTheoremFound, false);
  assert.equal(packet.wedgeDecisionBoundary.decision, 'planning_only_wedge_recorded_live_or_local_decision_still_open');
  assert.equal(packet.oneNextAction.stepId, 'decide_p848_p4217_complement_wedge_with_budget_guard_or_local_symbolic_proof');
  assert.equal(packet.oneNextAction.command, 'erdos orp research usage --json');
  assert.match(packet.oneNextAction.followUpCommand, /ORP_RESEARCH_P4217_THEOREM_WEDGE_PROFILE\.json/);
  assert.match(packet.oneNextAction.followUpCommand, /--execute --allow-paid --json/);

  assert.equal(packet.claims.emitsP4217TheoremWedgeSourceImportAudit, true);
  assert.equal(packet.claims.recordsPlanningOnlyOrpRun, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.respectsNoPaidByDefault, true);
  assert.equal(packet.claims.provesNoCurrentRepoOwnedP4217WholeComplementSourceTheorem, true);
  assert.equal(packet.claims.preparesBudgetGuardedWedgeDecision, true);
  assert.equal(packet.claims.provesP4217ComplementCover, false);
  assert.equal(packet.claims.provesP4217ComplementImpossibility, false);
  assert.equal(packet.claims.provesFiniteP4217Partition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 p4217 residual source-import profile approval blocker preserves no-spend boundary', () => {
  const packet = runP4217ResidualSourceImportProfileApprovalBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_residual_source_import_profile_approval_blocker_packet/1');
  assert.equal(packet.status, 'p4217_residual_source_import_profile_approval_blocker_emitted_no_live_spend');
  assert.equal(packet.target, 'emit_p848_p4217_residual_source_import_profile_approval_blocker_before_any_live_spend');
  assert.equal(packet.recommendedNextAction, 'prepare_p848_local_p4217_residual_source_theorem_proof_attempt_or_emit_hard_blocker');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_approval_blocker_profile_execution_not_released');

  assert.equal(packet.approvalDecision.profilePrepared, true);
  assert.equal(packet.approvalDecision.profileExecutionApproved, false);
  assert.equal(packet.approvalDecision.profileExecutionBlockedThisTurn, true);
  assert.equal(packet.approvalDecision.madeNewPaidCall, false);
  assert.equal(packet.approvalDecision.currentStepAllowsPaidCall, false);
  assert.equal(packet.approvalDecision.usageCheckRun, false);
  assert.equal(packet.approvalDecision.futureLivePreconditions.length, 4);

  assert.equal(packet.preservedProfile.profileId, 'p848-p4217-residual-source-import-single');
  assert.equal(packet.preservedProfile.selectedLaneId, 'p848_p4217_residual_source_import');
  assert.match(packet.preservedProfile.profileFile, /ORP_RESEARCH_P4217_RESIDUAL_SOURCE_IMPORT_PROFILE\.json/);
  assert.equal(packet.selectedLane.laneId, 'p4217_residual_squarefree_realization_source');

  assert.equal(packet.localFallback.selectedNextAction, 'prepare_p848_local_p4217_residual_source_theorem_proof_attempt_or_emit_hard_blocker');
  assert.match(packet.localFallback.firstLocalProbeCommand, /squarefree/);
  assert.equal(packet.forbiddenMovesAfterApprovalBlocker.includes('execute_the_repaired_profile_without_future_guarded_approval'), true);
  assert.equal(packet.forbiddenMovesAfterApprovalBlocker.includes('resume_q193_q197_singleton_descent'), true);

  assert.equal(packet.claims.completesProfileApprovalBlocker, true);
  assert.equal(packet.claims.blocksLiveSpendThisTurn, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.requiresFutureApprovalBeforeSpend, true);
  assert.equal(packet.claims.preservesPreparedProfile, true);
  assert.equal(packet.claims.keepsProfileSingleLane, true);
  assert.equal(packet.claims.selectedLaneIsP4217Residual, true);
  assert.equal(packet.claims.selectsLocalProofAttemptBeforeAnyLiveExecution, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksRepeatPaidWedgeByDefault, true);
  assert.equal(packet.claims.provesFiniteP4217Partition, false);
  assert.equal(packet.claims.provesP4217ResidualRankDecrease, false);
  assert.equal(packet.claims.provesSquarefreeRealizationSourceTheorem, false);
  assert.equal(packet.claims.importsSquareModuliUnionHittingThreshold, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 local p4217 residual source theorem proof attempt emits hard blocker', () => {
  const packet = runLocalP4217ResidualSourceTheoremProofAttemptHardBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_local_p4217_residual_source_theorem_proof_attempt_hard_blocker_packet/1');
  assert.equal(packet.status, 'local_p4217_residual_source_theorem_proof_attempt_hard_blocker_emitted');
  assert.equal(packet.target, 'prepare_p848_local_p4217_residual_source_theorem_proof_attempt_or_emit_hard_blocker');
  assert.equal(packet.recommendedNextAction, 'assemble_p848_no_spend_source_import_boundary_after_local_p4217_hard_blocker');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_local_probe_hard_blocker_no_partition_rank_or_source_theorem');

  assert.equal(packet.localProofAttempt.madeNewPaidCall, false);
  assert.equal(packet.localProofAttempt.usedPreparedProfileInputs, true);
  assert.match(packet.localProofAttempt.probeCommand, /finite CRT partition/);
  assert.equal(
    packet.localProofAttempt.probeResult,
    'no_promotable_repo_owned_finite_crt_partition_rank_or_squarefree_realization_source_theorem_found',
  );
  assert.equal(packet.localProofAttempt.auditedMatchBuckets.length, 4);

  assert.equal(packet.theoremForkVerdict.finiteCompleteCrtPartition.found, false);
  assert.equal(packet.theoremForkVerdict.wellFoundedResidualRank.found, false);
  assert.equal(packet.theoremForkVerdict.squarefreeRealizationSourceTheorem.found, false);
  assert.equal(packet.hardBlockerDecision.status, 'hard_blocker_until_local_theorem_or_future_guarded_source_import');
  assert.equal(packet.hardBlockerDecision.futureReleaseOptions.length, 4);
  assert.equal(packet.sourceProfilePreserved.profileId, 'p848-p4217-residual-source-import-single');
  assert.equal(packet.forbiddenMovesAfterHardBlocker.includes('resume_q193_q197_singleton_descent'), true);

  assert.equal(packet.claims.completesLocalP4217ResidualSourceTheoremProofAttempt, true);
  assert.equal(packet.claims.emitsHardBlocker, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.requiresFutureApprovalBeforeSpend, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.foundFiniteP4217Partition, false);
  assert.equal(packet.claims.foundP4217ResidualRankDecrease, false);
  assert.equal(packet.claims.foundSquarefreeRealizationSourceTheorem, false);
  assert.equal(packet.claims.provesFiniteP4217Partition, false);
  assert.equal(packet.claims.provesP4217ResidualRankDecrease, false);
  assert.equal(packet.claims.provesSquarefreeRealizationSourceTheorem, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 no-spend source import boundary after local p4217 hard blocker is assembled', () => {
  const packet = runNoSpendSourceImportBoundaryAfterLocalP4217HardBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_no_spend_source_import_boundary_after_local_p4217_hard_blocker_packet/1');
  assert.equal(packet.status, 'no_spend_source_import_boundary_assembled_after_local_p4217_hard_blocker');
  assert.equal(packet.target, 'assemble_p848_no_spend_source_import_boundary_after_local_p4217_hard_blocker');
  assert.equal(packet.recommendedNextAction, 'prepare_p848_no_spend_local_theorem_backlog_after_source_import_boundary');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_source_import_boundary_after_local_p4217_hard_blocker');

  assert.equal(packet.boundaryAssembly.madeNewPaidCall, false);
  assert.equal(packet.boundaryAssembly.currentStepAllowsPaidCall, false);
  assert.equal(packet.boundaryAssembly.allNProofAvailable, false);
  assert.equal(packet.boundaryAssembly.sourceImportBoundaryShape, 'three_remaining_theorem_objects_plus_guarded_release_conditions');
  assert.equal(packet.remainingTheoremObjects.length, 3);
  assert.equal(packet.remainingTheoremObjects.some((object) => object.objectId === 'p4217_residual_squarefree_realization_source'), true);
  assert.equal(packet.remainingTheoremObjects.some((object) => object.objectId === 'mod50_all_future_recurrence_or_generator'), true);
  assert.equal(packet.remainingTheoremObjects.some((object) => object.objectId === 'square_moduli_union_hitting_threshold_source'), true);
  assert.equal(packet.releaseConditionSummary.stillForbiddenThisTurn.includes('provider_execution'), true);
  assert.equal(packet.localTheoremBacklogSeed.nextStepId, 'prepare_p848_no_spend_local_theorem_backlog_after_source_import_boundary');
  assert.equal(packet.localTheoremBacklogSeed.candidateBacklogItems.length, 3);
  assert.equal(packet.forbiddenMovesAfterBoundaryAssembly.includes('resume_q193_q197_singleton_descent'), true);

  assert.equal(packet.claims.completesNoSpendSourceImportBoundaryAssembly, true);
  assert.equal(packet.claims.preservesP4217HardBlocker, true);
  assert.equal(packet.claims.preservesPreparedProfile, true);
  assert.equal(packet.claims.namesRemainingSourceImportTheoremObjects, true);
  assert.equal(packet.claims.namesFutureReleaseConditions, true);
  assert.equal(packet.claims.selectsNoSpendLocalTheoremBacklog, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.requiresFutureApprovalBeforeSpend, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.provesFiniteP4217Partition, false);
  assert.equal(packet.claims.provesP4217ResidualRankDecrease, false);
  assert.equal(packet.claims.provesSquarefreeRealizationSourceTheorem, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 no-spend local theorem backlog selects square-moduli source-index audit', () => {
  const packet = runNoSpendLocalTheoremBacklogAfterSourceImportBoundaryCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_no_spend_local_theorem_backlog_after_source_import_boundary_packet/1');
  assert.equal(packet.status, 'no_spend_local_theorem_backlog_prepared_after_source_import_boundary');
  assert.equal(packet.target, 'prepare_p848_no_spend_local_theorem_backlog_after_source_import_boundary');
  assert.equal(packet.recommendedNextAction, 'execute_p848_square_moduli_union_hitting_source_index_no_spend_audit');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_local_theorem_backlog_selection');

  assert.equal(packet.backlogDecision.madeNewPaidCall, false);
  assert.equal(packet.backlogDecision.currentStepAllowsPaidCall, false);
  assert.equal(packet.backlogDecision.selectedBacklogItemId, 'square_moduli_union_hitting_local_backlog');
  assert.equal(packet.backlogDecision.selectedNextAction, 'execute_p848_square_moduli_union_hitting_source_index_no_spend_audit');
  assert.equal(packet.backlogItems.length, 3);
  assert.equal(packet.backlogItems.find((item) => item.itemId === 'square_moduli_union_hitting_local_backlog')?.disposition, 'selected_for_no_spend_source_index_audit');
  assert.equal(packet.nextProbe.stepId, 'execute_p848_square_moduli_union_hitting_source_index_no_spend_audit');
  assert.match(packet.nextProbe.sourceIndexAuditCommand, /union\|hitting|union/);
  assert.equal(packet.noSpendPolicy.madeNewPaidCall, false);
  assert.equal(packet.noSpendPolicy.providerExecutionThisTurn, 'blocked');
  assert.equal(packet.forbiddenMovesAfterBacklog.includes('execute_provider_source_import_without_future_guarded_approval'), true);

  assert.equal(packet.claims.completesNoSpendLocalTheoremBacklog, true);
  assert.equal(packet.claims.selectsExactlyOneBacklogItem, true);
  assert.equal(packet.claims.selectedBacklogItemIsSquareModuliUnionHitting, true);
  assert.equal(packet.claims.selectedNextActionIsSourceIndexAudit, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.providerExecutionBlockedThisTurn, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesFiniteP4217Partition, false);
  assert.equal(packet.claims.provesP4217ResidualRankDecrease, false);
  assert.equal(packet.claims.provesSquarefreeRealizationSourceTheorem, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.provesSawhneyUnionHittingUpperBound, false);
  assert.equal(packet.claims.lowersAnalyticThreshold, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 square-moduli union/hitting source-index audit emits no-source blocker', () => {
  const packet = runSquareModuliUnionHittingSourceIndexNoSpendAuditCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_square_moduli_union_hitting_source_index_no_spend_audit_packet/1');
  assert.equal(packet.status, 'square_moduli_union_hitting_source_index_no_spend_audit_emitted_no_promotable_source_found');
  assert.equal(packet.target, 'execute_p848_square_moduli_union_hitting_source_index_no_spend_audit');
  assert.equal(packet.recommendedNextAction, 'prepare_p848_square_moduli_union_hitting_source_import_profile_or_approval_blocker');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_source_index_audit_no_promotable_source_found');

  assert.equal(packet.auditExecution.mode, 'no_spend_local_source_index_audit');
  assert.equal(packet.auditExecution.commandWasExecutedLocally, true);
  assert.equal(packet.auditExecution.madeNewPaidCall, false);
  assert.equal(packet.auditExecution.currentStepAllowsPaidCall, false);
  assert.equal(packet.auditExecution.verdict, 'no_promotable_square_moduli_union_hitting_source_theorem_found_current_repo');
  assert.ok(packet.auditExecution.sourceIndexAudit.matchedFileCount > 0);
  assert.ok(packet.auditExecution.sourceCategoryResults.length >= 4);
  assert.equal(
    packet.auditExecution.sourceCategoryResults.find((category) => category.categoryId === 'sawhney_explicitization_candidate_surfaces')?.promotableSourceFound,
    false,
  );

  assert.equal(packet.sourceTheoremVerdict.foundSawhneyCompatibleUnionHittingUpperBoundSource, false);
  assert.equal(packet.sourceTheoremVerdict.foundOnlyAvoidingSideSquareModuliLargeSieve, true);
  assert.equal(packet.sourceTheoremVerdict.localSawhneyExplicitizationNotesPresent, true);
  assert.match(packet.sourceTheoremVerdict.missingTheoremStatement, /union\/hitting/);
  assert.equal(packet.sourceImportProfileSeed.stepId, 'prepare_p848_square_moduli_union_hitting_source_import_profile_or_approval_blocker');
  assert.equal(packet.sourceImportProfileSeed.profileId, 'p848-square-moduli-union-hitting-source-import-single');
  assert.equal(packet.forbiddenMovesAfterAudit.includes('execute_provider_source_import_under_current_no_spend_instruction'), true);

  assert.equal(packet.claims.completesSquareModuliUnionHittingSourceIndexAudit, true);
  assert.equal(packet.claims.emitsNoPromotableSourceBlocker, true);
  assert.equal(packet.claims.commandWasExecutedLocally, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.foundSawhneyCompatibleUnionHittingUpperBoundSource, false);
  assert.equal(packet.claims.foundOnlyAvoidingSideSquareModuliLargeSieve, true);
  assert.equal(packet.claims.preservesTvdAvoidingDirectionBlocker, true);
  assert.equal(packet.claims.preservesComplementDualityLowerBoundBlocker, true);
  assert.equal(packet.claims.preparesSingleLaneSourceImportProfileSeed, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesSawhneyUnionHittingUpperBound, false);
  assert.equal(packet.claims.importsSquareModuliUnionHittingThreshold, false);
  assert.equal(packet.claims.lowersAnalyticThreshold, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 square-moduli union/hitting source-import profile approval blocker is no-spend', () => {
  const packet = runSquareModuliUnionHittingSourceImportProfileApprovalBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_square_moduli_union_hitting_source_import_profile_approval_blocker_packet/1');
  assert.equal(packet.status, 'square_moduli_union_hitting_source_import_profile_approval_blocker_emitted_no_live_spend');
  assert.equal(packet.target, 'prepare_p848_square_moduli_union_hitting_source_import_profile_or_approval_blocker');
  assert.equal(packet.recommendedNextAction, 'assemble_p848_no_spend_source_import_boundary_after_square_moduli_profile_blocker');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_square_moduli_union_hitting_profile_approval_blocker_no_live_spend');

  assert.equal(packet.selectedLane.laneId, 'square_moduli_union_hitting_threshold_source');
  assert.equal(packet.selectedLane.selectionStatus, 'selected_as_single_square_moduli_source_import_profile_lane');
  assert.match(packet.selectedLane.currentBoundary, /union\/hitting/);
  assert.equal(packet.repairedSourceImportProfile.profileId, 'p848-square-moduli-union-hitting-source-import-single');
  assert.equal(packet.repairedSourceImportProfile.laneCount, 1);
  assert.equal(packet.repairedSourceImportProfile.selectedLaneId, 'p848_square_moduli_union_hitting_source_import');
  assert.equal(packet.__testProfile.profile_id, 'p848-square-moduli-union-hitting-source-import-single');
  assert.equal(packet.__testProfile.lanes.length, 1);
  assert.match(packet.__testProfile.lanes[0].role, /avoiding-set upper bounds/);

  assert.equal(packet.approvalDecision.profileExecutionApproved, false);
  assert.equal(packet.approvalDecision.profileExecutionBlockedThisTurn, true);
  assert.equal(packet.approvalDecision.madeNewPaidCall, false);
  assert.equal(packet.approvalDecision.currentStepAllowsPaidCall, false);
  assert.equal(packet.approvalDecision.usageCheckRun, false);
  assert.equal(packet.paidCallPolicy.currentStepMadePaidCall, false);
  assert.equal(packet.paidCallPolicy.currentStepAllowsPaidCall, false);
  assert.equal(packet.paidCallPolicy.futureLiveCallStatus, 'requires_future_budget_guard_and_profile_approval');
  assert.equal(packet.unacceptableOutputs.includes('Tao-van-Doorn avoiding-set upper bound promoted as a union/hitting upper bound.'), true);
  assert.equal(packet.forbiddenMovesAfterProfileBlocker.includes('execute_provider_source_import_under_current_no_spend_instruction'), true);
  assert.equal(packet.oneNextAction.stepId, 'assemble_p848_no_spend_source_import_boundary_after_square_moduli_profile_blocker');

  assert.equal(packet.claims.completesSquareModuliUnionHittingProfileApprovalBlocker, true);
  assert.equal(packet.claims.writesFutureUseProfile, true);
  assert.equal(packet.claims.preservesSourceIndexAudit, true);
  assert.equal(packet.claims.preservesTvdAvoidingDirectionBlocker, true);
  assert.equal(packet.claims.preservesComplementDualityLowerBoundBlocker, true);
  assert.equal(packet.claims.selectedLaneIsSquareModuliUnionHitting, true);
  assert.equal(packet.claims.keepsProfileSingleLane, true);
  assert.equal(packet.claims.blocksLiveSpendThisTurn, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.requiresFutureApprovalBeforeSpend, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.foundSawhneyCompatibleUnionHittingUpperBoundSource, false);
  assert.equal(packet.claims.provesSawhneyUnionHittingUpperBound, false);
  assert.equal(packet.claims.importsSquareModuliUnionHittingThreshold, false);
  assert.equal(packet.claims.lowersAnalyticThreshold, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 no-spend source-import boundary after square-moduli profile blocker selects mod-50', () => {
  const packet = runNoSpendSourceImportBoundaryAfterSquareModuliProfileBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_no_spend_source_import_boundary_after_square_moduli_profile_blocker_packet/1');
  assert.equal(packet.status, 'no_spend_source_import_boundary_assembled_after_square_moduli_profile_blocker');
  assert.equal(packet.target, 'assemble_p848_no_spend_source_import_boundary_after_square_moduli_profile_blocker');
  assert.equal(packet.recommendedNextAction, 'prepare_p848_mod50_generator_source_import_profile_or_no_spend_blocker_after_source_boundary');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_source_import_boundary_after_square_moduli_profile_blocker');

  assert.equal(packet.boundaryAssembly.mode, 'no_spend_source_import_recombination');
  assert.equal(packet.boundaryAssembly.madeNewPaidCall, false);
  assert.equal(packet.boundaryAssembly.currentStepAllowsPaidCall, false);
  assert.equal(packet.boundaryAssembly.allNProofAvailable, false);
  assert.equal(packet.boundaryAssembly.sourceImportBoundaryShape, 'p4217_and_square_profile_blocked_mod50_selected_next');
  assert.equal(packet.boundaryAssembly.convergenceAssemblyNudgeUsed, true);
  assert.equal(packet.remainingTheoremObjects.length, 3);
  assert.equal(
    packet.remainingTheoremObjects.find((object) => object.objectId === 'mod50_all_future_recurrence_or_generator')?.status,
    'selected_next_for_repaired_source_import_profile_or_no_spend_blocker',
  );
  assert.equal(
    packet.remainingTheoremObjects.find((object) => object.objectId === 'square_moduli_union_hitting_threshold_source')?.status,
    'source_index_audited_and_profile_approval_blocked',
  );
  assert.equal(packet.lanePriorityDecision.selectedLaneId, 'mod50_all_future_recurrence_or_generator');
  assert.equal(packet.lanePriorityDecision.selectedStepId, 'prepare_p848_mod50_generator_source_import_profile_or_no_spend_blocker_after_source_boundary');
  assert.equal(packet.selectedNextTheoremObject.objectId, 'mod50_all_future_recurrence_or_generator');
  assert.equal(packet.oneNextAction.stepId, 'prepare_p848_mod50_generator_source_import_profile_or_no_spend_blocker_after_source_boundary');
  assert.equal(packet.forbiddenMovesAfterBoundaryAssembly.includes('rerun_the_same_mod50_paid_wedge_by_default'), true);

  assert.equal(packet.claims.completesSourceImportBoundaryAfterSquareModuliProfileBlocker, true);
  assert.equal(packet.claims.preservesPreviousSourceImportBoundary, true);
  assert.equal(packet.claims.preservesP4217ProfileAndHardBlocker, true);
  assert.equal(packet.claims.preservesSquareModuliProfileApprovalBlocker, true);
  assert.equal(packet.claims.selectsMod50AsNextSourceObject, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.blocksLiveSpendThisTurn, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.importsSquareModuliUnionHittingThreshold, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 mod-50 generator source-import profile blocker preserves the no-spend theorem target', () => {
  const packet = runMod50GeneratorSourceImportProfileNoSpendBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_generator_source_import_profile_no_spend_blocker_packet/1');
  assert.equal(packet.status, 'mod50_generator_source_import_profile_no_spend_blocker_emitted');
  assert.equal(packet.target, 'prepare_p848_mod50_generator_source_import_profile_or_no_spend_blocker_after_source_boundary');
  assert.equal(packet.recommendedNextAction, 'assemble_p848_no_spend_source_import_boundary_after_mod50_profile_blocker');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_mod50_generator_source_import_profile_no_spend_blocker');

  assert.equal(packet.abstractBeforeExpandGate.selectedRoute, 'emit_no_spend_profile_blocker');
  assert.match(packet.abstractBeforeExpandGate.largerFamily, /universal mod-50/);
  assert.equal(packet.selectedLane.laneId, 'mod50_all_future_recurrence_or_generator_source');
  assert.equal(packet.selectedLane.selectionStatus, 'selected_as_single_mod50_generator_source_import_profile_lane');
  assert.match(packet.selectedLane.currentBoundary, /Finite restored-menu replay/);

  assert.equal(packet.repairedSourceImportProfile.profileId, 'p848-mod50-generator-source-import-single');
  assert.equal(packet.repairedSourceImportProfile.laneCount, 1);
  assert.equal(packet.repairedSourceImportProfile.selectedLaneId, 'p848_mod50_generator_source_import');
  assert.equal(packet.__testProfile.profile_id, 'p848-mod50-generator-source-import-single');
  assert.equal(packet.__testProfile.lanes.length, 1);
  assert.match(packet.__testProfile.lanes[0].role, /all-future relevant-pair recurrence/);

  assert.equal(packet.approvalDecision.profileExecutionApproved, false);
  assert.equal(packet.approvalDecision.profileExecutionBlockedThisTurn, true);
  assert.equal(packet.approvalDecision.madeNewPaidCall, false);
  assert.equal(packet.approvalDecision.currentStepAllowsPaidCall, false);
  assert.equal(packet.approvalDecision.usageCheckRun, false);
  assert.equal(packet.paidCallPolicy.currentStepMadePaidCall, false);
  assert.equal(packet.paidCallPolicy.currentStepAllowsPaidCall, false);
  assert.equal(packet.paidCallPolicy.futureLiveCallStatus, 'requires_future_budget_guard_and_profile_approval');
  assert.equal(packet.unacceptableOutputs.includes('Finite restored-menu replay or the 280-row finite menu promoted to all-future recurrence.'), true);
  assert.equal(packet.forbiddenMovesAfterProfileBlocker.includes('treat_finite_mod50_replay_as_all_future_recurrence'), true);
  assert.equal(packet.oneNextAction.stepId, 'assemble_p848_no_spend_source_import_boundary_after_mod50_profile_blocker');

  assert.equal(packet.claims.completesMod50GeneratorSourceImportProfileBlocker, true);
  assert.equal(packet.claims.writesFutureUseProfile, true);
  assert.equal(packet.claims.keepsProfileSingleLane, true);
  assert.equal(packet.claims.selectedLaneIsMod50, true);
  assert.equal(packet.claims.sharperThanPriorBroadMod50Wedge, true);
  assert.equal(packet.claims.blocksFiniteReplayAsAllFuture, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.blocksLiveSpendThisTurn, true);
  assert.equal(packet.claims.requiresFutureApprovalBeforeSpend, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 no-spend source-import boundary after mod-50 profile blocker assembles all source lanes', () => {
  const packet = runNoSpendSourceImportBoundaryAfterMod50ProfileBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_no_spend_source_import_boundary_after_mod50_profile_blocker_packet/1');
  assert.equal(packet.status, 'no_spend_source_import_boundary_assembled_after_mod50_profile_blocker');
  assert.equal(packet.target, 'assemble_p848_no_spend_source_import_boundary_after_mod50_profile_blocker');
  assert.equal(packet.recommendedNextAction, 'decide_p848_three_profile_source_import_with_budget_guard_or_emit_no_spend_blocker');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_source_import_boundary_after_mod50_profile_blocker');

  assert.equal(packet.boundaryAssembly.sourceImportBoundaryShape, 'p4217_square_moduli_mod50_all_profile_or_hard_blocker_represented');
  assert.equal(packet.boundaryAssembly.assembledProfileOrBlockerCount, 3);
  assert.equal(packet.boundaryAssembly.madeNewPaidCall, false);
  assert.equal(packet.boundaryAssembly.currentStepAllowsPaidCall, false);
  assert.equal(packet.boundaryAssembly.usageCheckRun, false);
  assert.equal(packet.boundaryAssembly.allNProofAvailable, false);
  assert.equal(packet.sourceImportDecisionQueue.length, 3);
  assert.deepEqual(
    packet.sourceImportDecisionQueue.map((lane) => lane.laneId),
    ['mod50_generator_source_import', 'square_moduli_union_hitting_source_import', 'p4217_residual_source_import'],
  );
  assert.equal(packet.selectedNextDecision.stepId, 'decide_p848_three_profile_source_import_with_budget_guard_or_emit_no_spend_blocker');
  assert.equal(packet.selectedNextDecision.selectedLaneId, 'mod50_generator_source_import');
  assert.equal(packet.selectedNextDecision.selectedProfileId, 'p848-mod50-generator-source-import-single');
  assert.match(packet.selectedNextDecision.noSpendFallback, /no-spend/);
  assert.equal(packet.forbiddenMovesAfterBoundaryAssembly.includes('execute_provider_source_import_under_current_no_spend_instruction'), true);
  assert.equal(packet.forbiddenMovesAfterBoundaryAssembly.includes('treat_finite_mod50_replay_as_all_future_recurrence'), true);

  assert.equal(packet.claims.completesSourceImportBoundaryAfterMod50ProfileBlocker, true);
  assert.equal(packet.claims.allThreeSourceLanesRepresentedByProfileOrHardBlocker, true);
  assert.equal(packet.claims.selectsMod50AsFirstFutureBudgetGuardedCandidate, true);
  assert.equal(packet.claims.preservesNoSpendFallback, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.usageCheckRun, false);
  assert.equal(packet.claims.blocksLiveSpendThisTurn, true);
  assert.equal(packet.claims.requiresFutureUsageCheckBeforeSpend, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesP4217ResidualSourceTheorem, false);
  assert.equal(packet.claims.provesSquareModuliUnionHittingUpperBound, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 three-profile source-import decision emits no-spend blocker after usage check', () => {
  const packet = runThreeProfileSourceImportNoSpendDecisionBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_three_profile_source_import_no_spend_decision_blocker_packet/1');
  assert.equal(packet.status, 'three_profile_source_import_no_spend_decision_blocker_emitted');
  assert.equal(packet.target, 'decide_p848_three_profile_source_import_with_budget_guard_or_emit_no_spend_blocker');
  assert.equal(packet.recommendedNextAction, 'assemble_p848_no_spend_all_n_recombination_blocker_after_three_profile_decision');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_decision_blocker_after_usage_check');

  assert.equal(packet.decision.selectedLaneId, 'mod50_generator_source_import');
  assert.equal(packet.decision.selectedProfileId, 'p848-mod50-generator-source-import-single');
  assert.equal(packet.decision.liveExecutionApproved, false);
  assert.equal(packet.decision.profileExecutionReleased, false);
  assert.equal(packet.decision.madeNewPaidCall, false);
  assert.equal(packet.decision.usageCheckRun, true);
  assert.equal(packet.decision.currentStepAllowsPaidCall, false);
  assert.match(packet.decision.reason, /forbids spending/);
  assert.equal(packet.usageGuardSnapshot.usageCheckRun, true);
  assert.equal(packet.usageGuardSnapshot.enoughCapacityForOneEstimatedAsk, true);
  assert.equal(packet.preservedSourceImportLanes.length, 3);
  assert.equal(packet.noSpendRecombinationBlocker.remainingTheoremObjects.length, 3);
  assert.equal(packet.forbiddenMovesAfterDecision.includes('run_erdos_orp_research_execute_allow_paid_this_turn'), true);

  assert.equal(packet.claims.completesThreeProfileSourceImportDecision, true);
  assert.equal(packet.claims.usageCheckRun, true);
  assert.equal(packet.claims.emitsNoSpendBlocker, true);
  assert.equal(packet.claims.liveExecutionApproved, false);
  assert.equal(packet.claims.profileExecutionReleased, false);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.selectedLaneIsMod50, true);
  assert.equal(packet.claims.keepsAllThreeLanesProfileBound, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesP4217ResidualSourceTheorem, false);
  assert.equal(packet.claims.provesSquareModuliUnionHittingUpperBound, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 no-spend all-N recombination blocker preserves three source theorem gaps', () => {
  const packet = runNoSpendAllNRecombinationBlockerAfterThreeProfileDecisionCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_no_spend_all_n_recombination_blocker_after_three_profile_decision_packet/1');
  assert.equal(packet.status, 'no_spend_all_n_recombination_blocker_after_three_profile_decision_emitted');
  assert.equal(packet.target, 'assemble_p848_no_spend_all_n_recombination_blocker_after_three_profile_decision');
  assert.equal(packet.recommendedNextAction, 'prepare_p848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_all_n_recombination_blocker_after_three_profile_decision');

  assert.equal(packet.recombinationBlocker.status, 'all_n_recombination_blocked_by_three_profile_bound_source_import_theorem_gaps');
  assert.equal(packet.recombinationBlocker.allSourceImportLanesProfileBound, true);
  assert.equal(packet.recombinationBlocker.providerExecutionReleased, false);
  assert.equal(packet.recombinationBlocker.madeNewPaidCall, false);
  assert.equal(packet.recombinationBlocker.usageCheckAlreadyRunInDecisionStep, true);
  assert.equal(packet.recombinationBlocker.missingTheoremObjectCount, 3);
  assert.equal(packet.sourceImportLanes.length, 3);
  assert.deepEqual(
    packet.sourceImportLanes.map((lane) => lane.laneId),
    ['mod50_generator_source_import', 'square_moduli_union_hitting_source_import', 'p4217_residual_source_import'],
  );
  assert.equal(
    packet.localTheoremStatementBacklogSeed.stepId,
    'prepare_p848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker',
  );
  assert.equal(packet.forbiddenMovesAfterRecombinationBlocker.includes('claim_all_n_recombination_from_profile_bound_lanes'), true);
  assert.equal(packet.forbiddenMovesAfterRecombinationBlocker.includes('run_erdos_orp_research_execute_allow_paid_this_turn'), true);

  assert.equal(packet.claims.completesNoSpendAllNRecombinationBlocker, true);
  assert.equal(packet.claims.allThreeSourceImportLanesProfileBound, true);
  assert.equal(packet.claims.emitsAllNRecombinationBlocker, true);
  assert.equal(packet.claims.preservesNoSpendProviderGating, true);
  assert.equal(packet.claims.liveExecutionApproved, false);
  assert.equal(packet.claims.profileExecutionReleased, false);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.selectsLocalTheoremStatementBacklog, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesP4217ResidualSourceTheorem, false);
  assert.equal(packet.claims.provesSquareModuliUnionHittingUpperBound, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 no-spend local theorem-statement backlog selects mod-50 local proof probe', () => {
  const packet = runNoSpendLocalSourceTheoremStatementBacklogAfterAllNRecombinationBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker_packet/1');
  assert.equal(packet.status, 'no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker_prepared');
  assert.equal(packet.target, 'prepare_p848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker');
  assert.equal(packet.recommendedNextAction, 'attempt_p848_mod50_generator_theorem_statement_local_proof_or_emit_gap_after_all_n_recombination_blocker');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker');

  assert.equal(packet.backlogDecision.status, 'three_source_import_theorem_statements_ranked_one_local_probe_selected');
  assert.equal(packet.backlogDecision.selectedLaneId, 'mod50_generator_source_import');
  assert.equal(packet.backlogDecision.selectedProbeId, 'mod50_generator_statement_source_denominator_audit');
  assert.equal(packet.backlogDecision.providerExecutionReleased, false);
  assert.equal(packet.backlogDecision.madeNewPaidCall, false);
  assert.equal(packet.theoremStatements.length, 3);
  assert.deepEqual(
    packet.theoremStatements.map((statement) => statement.laneId),
    ['mod50_generator_source_import', 'square_moduli_union_hitting_source_import', 'p4217_residual_source_import'],
  );
  assert.equal(packet.theoremStatements[0].rank, 1);
  assert.equal(packet.selectedLocalProbe.probeId, 'mod50_generator_statement_source_denominator_audit');
  assert.match(packet.selectedLocalProbe.command, /mod50/);
  assert.equal(packet.abstractionGateRecord.status, 'satisfied_by_backlog_not_expansion');
  assert.equal(packet.abstractionGateRecord.chosenRoute, 'local_proof_probe');
  assert.equal(packet.forbiddenMovesAfterBacklog.includes('run_erdos_orp_research_execute_allow_paid_this_turn'), true);
  assert.equal(packet.forbiddenMovesAfterBacklog.includes('treat_finite_mod50_replay_as_all_future_recurrence'), true);

  assert.equal(packet.claims.completesNoSpendLocalSourceTheoremStatementBacklog, true);
  assert.equal(packet.claims.statesThreeSourceImportTheoremObjects, true);
  assert.equal(packet.claims.ranksThreeSourceImportTheoremObjects, true);
  assert.equal(packet.claims.selectsMod50AsCheapestLocalProbe, true);
  assert.equal(packet.claims.selectedProbeIsNoSpendLocal, true);
  assert.equal(packet.claims.preservesNoSpendProviderGating, true);
  assert.equal(packet.claims.liveExecutionApproved, false);
  assert.equal(packet.claims.profileExecutionReleased, false);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.blocksFiniteReplayAsAllFuture, true);
  assert.equal(packet.claims.provesP4217ResidualSourceTheorem, false);
  assert.equal(packet.claims.provesSquareModuliUnionHittingUpperBound, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 mod-50 generator theorem-statement local proof gap blocks finite replay promotion', () => {
  const packet = runMod50GeneratorTheoremStatementLocalProofGapAfterAllNRecombinationBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_generator_theorem_statement_local_proof_gap_after_all_n_recombination_blocker_packet/1');
  assert.equal(packet.status, 'mod50_generator_theorem_statement_local_proof_gap_after_all_n_recombination_blocker_emitted');
  assert.equal(packet.target, 'attempt_p848_mod50_generator_theorem_statement_local_proof_or_emit_gap_after_all_n_recombination_blocker');
  assert.equal(packet.recommendedNextAction, 'assemble_p848_no_spend_source_import_boundary_after_mod50_local_statement_gap');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_mod50_generator_theorem_statement_local_gap_after_denominator_audit');
  assert.equal(packet.coversPrimaryNextAction.selectedLaneId, 'mod50_generator_source_import');

  assert.equal(packet.localProofAttempt.status, 'attempted_no_promotable_local_theorem_found');
  assert.equal(packet.localProofAttempt.selectedProbeId, 'mod50_generator_statement_source_denominator_audit');
  assert.equal(packet.localProofAttempt.madeNewPaidCall, false);
  assert.equal(packet.localProofAttempt.providerExecutionReleased, false);
  assert.equal(packet.localProofAttempt.result, 'gap_emitted_no_repo_owned_all_future_recurrence_finite_q_partition_or_original_generator_theorem');
  assert.equal(packet.missingTheoremStatement.statementId, 'mod50_generator_all_future_recurrence_or_finite_q_partition');
  assert.match(packet.missingTheoremStatement.exactMissingStatement, /For every future row/);
  assert.equal(packet.missingTheoremStatement.unacceptableSubstitutes.includes('finite restored-menu replay'), true);

  assert.equal(packet.theoremForkVerdict.restoredOriginalGeneratorTheorem.found, false);
  assert.equal(packet.theoremForkVerdict.symbolicAllFutureRelevantPairRecurrence.found, false);
  assert.equal(packet.theoremForkVerdict.finiteQPartition.found, false);
  assert.equal(packet.auditClassification.some((bucket) => bucket.bucketId === 'finite_replay_and_bounded_enumerators'), true);
  assert.equal(packet.auditClassification.some((bucket) => bucket.bucketId === 'generator_and_recurrence_absence_blockers'), true);
  assert.equal(packet.blockerDecision.status, 'local_statement_gap_emitted_no_spend');
  assert.equal(packet.forbiddenMovesAfterGap.includes('run_erdos_orp_research_execute_allow_paid_this_turn'), true);
  assert.equal(packet.forbiddenMovesAfterGap.includes('treat_finite_mod50_replay_as_all_future_recurrence'), true);
  assert.equal(packet.oneNextAction.stepId, 'assemble_p848_no_spend_source_import_boundary_after_mod50_local_statement_gap');

  assert.equal(packet.claims.completesMod50GeneratorTheoremStatementLocalProofAttempt, true);
  assert.equal(packet.claims.emitsMod50GeneratorLocalStatementGap, true);
  assert.equal(packet.claims.auditsSelectedMod50Statement, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.providerExecutionReleased, false);
  assert.equal(packet.claims.foundLocalAllFutureRecurrence, false);
  assert.equal(packet.claims.foundFiniteQPartition, false);
  assert.equal(packet.claims.foundRestoredOriginalGeneratorTheorem, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.blocksFiniteReplayAsAllFuture, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 source/import boundary after mod-50 local statement gap preserves no-spend lanes', () => {
  const packet = runNoSpendSourceImportBoundaryAfterMod50LocalStatementGapCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_no_spend_source_import_boundary_after_mod50_local_statement_gap_packet/1');
  assert.equal(packet.status, 'no_spend_source_import_boundary_assembled_after_mod50_local_statement_gap');
  assert.equal(packet.target, 'assemble_p848_no_spend_source_import_boundary_after_mod50_local_statement_gap');
  assert.equal(packet.recommendedNextAction, 'emit_p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_source_import_boundary_after_mod50_local_statement_gap');

  assert.equal(packet.boundaryAssembly.status, 'assembled_after_mod50_local_statement_gap');
  assert.equal(packet.boundaryAssembly.madeNewPaidCall, false);
  assert.equal(packet.boundaryAssembly.providerExecutionReleased, false);
  assert.equal(packet.boundaryAssembly.missingTheoremObjectCount, 3);
  assert.equal(packet.boundaryAssembly.mod50LaneUpgrade, 'profile_prepared_to_local_statement_gap_emitted');
  assert.equal(packet.remainingSourceImportLanes.length, 3);
  assert.equal(packet.remainingSourceImportLanes[0].laneId, 'mod50_generator_source_import');
  assert.equal(packet.remainingSourceImportLanes[0].status, 'profile_preserved_local_statement_gap_emitted');
  assert.match(packet.remainingSourceImportLanes[0].remainingSourceTheoremObject, /For every future row/);
  assert.equal(packet.remainingSourceImportLanes.some((lane) => lane.laneId === 'square_moduli_union_hitting_source_import'), true);
  assert.equal(packet.remainingSourceImportLanes.some((lane) => lane.laneId === 'p4217_residual_source_import'), true);
  assert.equal(packet.selectedNextBoundary.stepId, 'emit_p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap');
  assert.equal(packet.selectedNextBoundary.status, 'ready_under_current_no_spend_instruction');
  assert.equal(packet.forbiddenMovesAfterBoundaryAssembly.includes('execute_provider_source_import_under_current_no_spend_instruction'), true);
  assert.equal(packet.forbiddenMovesAfterBoundaryAssembly.includes('treat_finite_mod50_replay_as_all_future_recurrence'), true);
  assert.equal(packet.oneNextAction.stepId, 'emit_p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap');

  assert.equal(packet.claims.completesNoSpendSourceImportBoundaryAfterMod50LocalStatementGap, true);
  assert.equal(packet.claims.upgradesMod50LaneToLocalStatementGap, true);
  assert.equal(packet.claims.allThreeSourceImportLanesRemainBlocked, true);
  assert.equal(packet.claims.preservesNoSpendProviderGating, true);
  assert.equal(packet.claims.selectsNoSpendSourceImportHardBlockerNext, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.usageCheckRun, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.providerExecutionReleased, false);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.blocksFiniteReplayAsAllFuture, true);
  assert.equal(packet.claims.provesP4217ResidualSourceTheorem, false);
  assert.equal(packet.claims.provesSquareModuliUnionHittingUpperBound, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 no-spend source/import hard blocker after mod-50 local statement gap preserves the release boundary', () => {
  const packet = runNoSpendSourceImportHardBlockerAfterMod50LocalStatementGapCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap_packet/1');
  assert.equal(packet.status, 'no_spend_source_import_hard_blocker_after_mod50_local_statement_gap_emitted');
  assert.equal(packet.target, 'emit_p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap');
  assert.equal(packet.recommendedNextAction, 'await_p848_new_local_source_theorem_or_explicit_guarded_source_audit_release_after_no_spend_hard_blocker');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap');

  assert.equal(packet.hardBlocker.status, 'no_current_no_spend_source_import_lane_closes_all_n');
  assert.equal(packet.hardBlocker.noSpendClosureAvailable, false);
  assert.equal(packet.hardBlocker.allNProofAvailable, false);
  assert.equal(packet.hardBlocker.providerExecutionReleased, false);
  assert.equal(packet.hardBlocker.madeNewPaidCall, false);
  assert.equal(packet.hardBlocker.missingTheoremObjectCount, 3);
  assert.equal(packet.blockedSourceImportLanes.length, 3);
  assert.equal(packet.blockedSourceImportLanes.every((lane) => lane.closureStatus === 'blocked_under_current_no_spend_instruction'), true);
  assert.equal(packet.missingSourceTheoremObjects.some((object) => object.laneId === 'mod50_generator_source_import'), true);
  assert.equal(packet.futureGuardedAuditReleaseConditions.length >= 4, true);
  assert.equal(packet.forbiddenMovesAfterHardBlocker.includes('execute_provider_source_import_under_current_no_spend_instruction'), true);
  assert.equal(packet.forbiddenMovesAfterHardBlocker.includes('resume_q_cover_staircase_expansion'), true);
  assert.equal(packet.oneNextAction.stepId, 'await_p848_new_local_source_theorem_or_explicit_guarded_source_audit_release_after_no_spend_hard_blocker');

  assert.equal(packet.claims.completesNoSpendSourceImportHardBlockerAfterMod50LocalStatementGap, true);
  assert.equal(packet.claims.noCurrentNoSpendSourceImportLaneClosesAllN, true);
  assert.equal(packet.claims.allThreeSourceImportLanesRemainBlocked, true);
  assert.equal(packet.claims.preservesNoSpendProviderGating, true);
  assert.equal(packet.claims.preservesFutureGuardedAuditReleaseConditions, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.usageCheckRun, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.providerExecutionReleased, false);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.blocksFiniteReplayAsAllFuture, true);
  assert.equal(packet.claims.provesP4217ResidualSourceTheorem, false);
  assert.equal(packet.claims.provesSquareModuliUnionHittingUpperBound, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 guarded mod-50 source-audit release conflict records usage without spending', () => {
  const packet = runGuardedMod50SourceAuditReleaseNoSpendBlockerAfterHardBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_guarded_mod50_source_audit_release_no_spend_blocker_after_hard_blocker_packet/1');
  assert.equal(packet.status, 'guarded_mod50_source_audit_release_no_spend_blocker_after_hard_blocker_emitted');
  assert.equal(packet.target, 'await_p848_new_local_source_theorem_or_explicit_guarded_source_audit_release_after_no_spend_hard_blocker');
  assert.equal(packet.recommendedNextAction, 'await_p848_new_local_source_theorem_or_spend_permission_override_after_guarded_mod50_audit_release_conflict');
  assert.equal(packet.coversPrimaryNextAction.status, 'blocked_by_active_no_spend_instruction_after_usage_preflight');

  assert.equal(packet.guardedReleaseRequest.selectedLaneId, 'mod50_generator_source_import');
  assert.equal(packet.guardedReleaseRequest.selectedProfileId, 'p848-mod50-generator-source-import-single');
  assert.match(packet.guardedReleaseRequest.exactQuestionObject, /for every future row/);
  assert.equal(packet.decision.status, 'no_provider_execution_due_to_active_no_spend_instruction');
  assert.equal(packet.decision.explicitGuardedReleaseInBrief, true);
  assert.equal(packet.decision.activeNoSpendInstruction, true);
  assert.equal(packet.decision.usageCheckRun, true);
  assert.equal(packet.decision.liveExecutionApproved, false);
  assert.equal(packet.decision.providerExecutionReleased, false);
  assert.equal(packet.decision.madeNewPaidCall, false);
  assert.equal(packet.usageGuardSnapshot.usageCheckRun, true);
  assert.equal(Number.isFinite(packet.usageGuardSnapshot.todayRemainingLiveRuns), true);
  assert.equal(Number.isFinite(packet.usageGuardSnapshot.todayRemainingSpendUsd), true);
  assert.equal(packet.stillBlockedSourceImportLanes.length, 3);
  assert.equal(packet.missingSourceTheoremObjects.some((object) => object.laneId === 'mod50_generator_source_import'), true);
  assert.equal(packet.forbiddenMovesAfterDecision.includes('run_erdos_orp_research_execute_allow_paid_under_active_do_not_spend_instruction'), true);
  assert.equal(packet.oneNextAction.stepId, 'await_p848_new_local_source_theorem_or_spend_permission_override_after_guarded_mod50_audit_release_conflict');

  assert.equal(packet.claims.completesPostHardBlockerGuardedReleaseDecisionUnderNoSpendConflict, true);
  assert.equal(packet.claims.usageCheckRun, true);
  assert.equal(packet.claims.selectedLaneIsMod50, true);
  assert.equal(packet.claims.exactMod50SourceTheoremTargetNamed, true);
  assert.equal(packet.claims.explicitGuardedReleaseInBrief, true);
  assert.equal(packet.claims.activeNoSpendInstructionBlocksExecution, true);
  assert.equal(packet.claims.providerExecutionReleased, false);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.preservesNoSpendProviderGating, true);
  assert.equal(packet.claims.requiresFutureUsageCheckBeforeSpend, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.blocksFiniteReplayAsAllFuture, true);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 mod-50 elementary generator semantics blocker excludes universal row promotion', () => {
  const packet = runMod50ElementaryGeneratorRelevantPairSemanticsBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_elementary_generator_relevant_pair_semantics_blocker_packet/1');
  assert.equal(packet.status, 'mod50_elementary_generator_relevant_pair_semantics_blocker_emitted');
  assert.equal(packet.target, 'verify_p848_mod50_elementary_generator_relevant_pair_admissibility_or_emit_semantics_blocker');
  assert.equal(packet.recommendedNextAction, 'restore_p848_mod50_relevant_pair_row_generator_or_finite_q_partition_after_elementary_semantics_blocker');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_mod50_elementary_generator_relevant_pair_semantics_blocker');

  assert.equal(packet.candidateIdentityAudit.theoremId, 'p848_mod50_elementary_square_generator_family');
  assert.equal(packet.candidateIdentityAudit.identityValidAsArithmetic, true);
  assert.equal(packet.candidateIdentityAudit.promotionVerdict, 'not_admissible_as_mod50_all_future_relevant_pair_generator');
  assert.match(packet.normalizedRepoRelevantPairSemantics.requiredStatement, /pairs \(n,Q\)/);
  assert.equal(packet.normalizedRepoRelevantPairSemantics.missingDomainHypothesis.status, 'missing');
  assert.equal(packet.observedFiniteRowAudit.checkedObservedRowCount, 74);
  assert.equal(packet.observedFiniteRowAudit.candidateRelationHitCount, 0);
  assert.deepEqual(packet.observedFiniteRowAudit.candidateRelationHits, []);
  assert.equal(packet.semanticMismatch.status, 'candidate_excluded_from_universal_promotion_by_row_semantics');
  assert.equal(packet.rankedLegalNextOptions[0].actionId, 'restore_p848_mod50_relevant_pair_row_generator_or_finite_q_partition_after_elementary_semantics_blocker');
  assert.equal(packet.oneNextAction.stepId, 'restore_p848_mod50_relevant_pair_row_generator_or_finite_q_partition_after_elementary_semantics_blocker');

  assert.equal(packet.claims.completesElementaryGeneratorRelevantPairAdmissibilityCheck, true);
  assert.equal(packet.claims.arithmeticIdentityValid, true);
  assert.equal(packet.claims.candidateAdmissibleAsUniversalMod50RelevantPairGenerator, false);
  assert.equal(packet.claims.candidatePromotedToProof, false);
  assert.equal(packet.claims.finiteObservedRowAuditRun, true);
  assert.equal(packet.claims.finiteObservedRowAuditHitCount, 0);
  assert.equal(packet.claims.checkedObservedRowCount, 74);
  assert.equal(packet.claims.preservesNoSpendDefault, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.blocksAdditionalProviderCalls, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 mod-50 row-generator restoration audit blocks absent local theorem', () => {
  const packet = runMod50RelevantPairRowGeneratorRestorationLocalAuditBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_relevant_pair_row_generator_restoration_local_audit_blocker_packet/1');
  assert.equal(packet.status, 'mod50_relevant_pair_row_generator_restoration_local_audit_blocker_emitted');
  assert.equal(packet.target, 'restore_p848_mod50_relevant_pair_row_generator_or_finite_q_partition_after_elementary_semantics_blocker');
  assert.equal(packet.recommendedNextAction, 'await_p848_new_local_row_generator_theorem_or_explicit_guarded_source_audit_release_after_restoration_blocker');
  assert.equal(
    packet.coversPrimaryNextAction.status,
    'blocked_by_no_repo_owned_mod50_row_generator_or_finite_q_partition_after_local_restoration_audit',
  );

  assert.equal(
    packet.restorationAudit.result,
    'no_repo_owned_mod50_relevant_pair_row_generator_symbolic_recurrence_or_finite_q_partition_found',
  );
  assert.equal(packet.requiredTheoremObject.objectId, 'p848_mod50_relevant_pair_row_generator_or_finite_q_partition');
  assert.match(packet.requiredTheoremObject.requiredStatement, /pairs \(n,Q\)/);
  assert.equal(packet.requiredTheoremObject.normalizedAfterSemanticsBlocker.denominatorObject, 'Q/gcd(50*n,Q)');
  assert.equal(packet.auditedEvidence.length, 7);
  assert.equal(packet.auditedEvidence.every((source) => source.provesAllFutureRowGenerator === false), true);
  assert.equal(packet.rankedLegalNextOptions[0].actionId, 'await_p848_new_local_row_generator_theorem_or_explicit_guarded_source_audit_release_after_restoration_blocker');
  assert.equal(packet.forbiddenMovesAfterRestorationAudit.includes('execute_provider_call_under_current_no_spend_instruction'), true);
  assert.equal(packet.oneNextAction.stepId, 'await_p848_new_local_row_generator_theorem_or_explicit_guarded_source_audit_release_after_restoration_blocker');

  assert.equal(packet.claims.completesMod50RowGeneratorRestorationLocalAudit, true);
  assert.equal(packet.claims.provesLocalRowGeneratorAbsent, true);
  assert.equal(packet.claims.confirmsBoundedCrtReplayFiniteOnly, true);
  assert.equal(packet.claims.confirmsElementaryGeneratorExcluded, true);
  assert.equal(packet.claims.preservesNoSpendProviderGating, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.blocksAdditionalProviderCalls, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesMod50AllFutureRowGenerator, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 mod-50 same-bound residual handoff-label local blocker separates finite tie evidence', () => {
  const packet = runMod50SameBoundResidualHandoffLabelLocalBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_same_bound_residual_handoff_label_local_blocker_packet/1');
  assert.equal(packet.status, 'mod50_same_bound_residual_handoff_label_local_blocker_emitted');
  assert.equal(packet.target, 'prove_or_block_p848_mod50_same_bound_residual_handoff_labels_after_counterfamily_boundary');
  assert.equal(packet.recommendedNextAction, 'await_p848_new_local_row_generator_or_residual_handoff_theorem_or_explicit_guarded_source_audit_release');
  assert.equal(packet.coversPrimaryNextAction.status, 'blocked_by_no_local_residual_handoff_label_theorem');

  assert.equal(packet.handoffLabelLocalAudit.status, 'local_attempt_complete_no_per_pair_handoff_label_theorem');
  assert.equal(packet.handoffLabelLocalAudit.residual.representative, 1837022639);
  assert.equal(packet.handoffLabelLocalAudit.residual.tupleKey, '9, 11^2, 4, 7^2, 41^2, 23^2');
  assert.equal(packet.handoffLabelLocalAudit.pairCount, 4);
  assert.deepEqual(
    packet.handoffLabelLocalAudit.pairLabelAudit.map((pair) => pair.badMClass.expression),
    ['m == 0 mod 121', 'm == 1 mod 49', 'm == 2 mod 1681', 'm == 3 mod 529'],
  );
  assert.equal(
    packet.handoffLabelLocalAudit.pairLabelAudit.every((pair) => pair.localLabelResult === 'blocked_no_per_pair_handoff_theorem'),
    true,
  );
  assert.equal(packet.handoffLabelLocalAudit.finiteTieEvidenceStatus, 'proved_for_this_restored_finite_menu_boundary');
  assert.equal(packet.theoremObjectStillMissing.objectId, 'p848_mod50_relevant_pair_row_generator_or_residual_handoff_finite_q_partition');
  assert.equal(packet.localSourcesChecked.length, 5);
  assert.equal(packet.rankedLegalNextOptions[0].actionId, 'await_p848_new_local_row_generator_or_residual_handoff_theorem_or_explicit_guarded_source_audit_release');
  assert.equal(packet.forbiddenMovesAfterHandoffLabelBlocker.includes('treat_finite_tie_policy_exclusion_as_per_pair_handoff_label_proof'), true);
  assert.equal(packet.oneNextAction.stepId, 'await_p848_new_local_row_generator_or_residual_handoff_theorem_or_explicit_guarded_source_audit_release');

  assert.equal(packet.claims.completesResidualHandoffLabelLocalAttempt, true);
  assert.equal(packet.claims.provesFiniteTieExclusionForResidualRow, true);
  assert.equal(packet.claims.provesResidualHandoffLabels, false);
  assert.equal(packet.claims.provesBadLaneAvoidance, false);
  assert.equal(packet.claims.provesTopTieRepair, false);
  assert.equal(packet.claims.provesContrastOnlyRepair, false);
  assert.equal(packet.claims.provesTerminalBlocking, false);
  assert.equal(packet.claims.confirmsBoundedCrtReplayFiniteOnly, true);
  assert.equal(packet.claims.preservesNoSpendProviderGating, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.blocksAdditionalProviderCalls, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesMod50AllFutureRowGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 mod-50 residual handoff-label source-audit profile is prepared without spend', () => {
  const packet = runMod50ResidualHandoffLabelSourceAuditProfileNoSpendBlockerCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_residual_handoff_label_source_audit_profile_no_spend_blocker_packet/1');
  assert.equal(packet.status, 'mod50_residual_handoff_label_source_audit_profile_no_spend_blocker_emitted');
  assert.equal(packet.target, 'await_p848_new_local_row_generator_or_residual_handoff_theorem_or_explicit_guarded_source_audit_release');
  assert.equal(packet.recommendedNextAction, 'await_p848_new_local_residual_handoff_theorem_or_explicit_guarded_source_audit_release_after_profile');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_residual_handoff_label_source_audit_profile_no_spend_blocker');

  assert.equal(packet.residualHandoffLabelSourceAuditProfile.profileId, 'p848-mod50-residual-handoff-label-source-audit-single');
  assert.equal(packet.residualHandoffLabelSourceAuditProfile.selectedLaneId, 'p848_mod50_residual_handoff_label_source_import');
  assert.equal(packet.__profileOutput.profile_id, 'p848-mod50-residual-handoff-label-source-audit-single');
  assert.equal(packet.__profileOutput.lanes[0].lane_id, 'p848_mod50_residual_handoff_label_source_import');
  assert.equal(packet.residualSourceImportQuestion.status, 'prepared_no_provider_execution_under_no_spend');
  assert.equal(packet.residualSourceImportQuestion.badClassCount, 4);
  assert.deepEqual(
    packet.residualSourceImportQuestion.badClasses.map((badClass) => badClass.badMClass.expression),
    ['m == 0 mod 121', 'm == 1 mod 49', 'm == 2 mod 1681', 'm == 3 mod 529'],
  );
  assert.equal(packet.residualSourceImportQuestion.acceptableSuccessCriteria.length, 4);
  assert.equal(packet.approvalDecision.profilePrepared, true);
  assert.equal(packet.approvalDecision.profileExecutionApproved, false);
  assert.equal(packet.approvalDecision.madeNewPaidCall, false);
  assert.equal(packet.approvalDecision.usageCheckRun, false);
  assert.equal(packet.rankedLegalNextOptions[0].actionId, 'await_p848_new_local_residual_handoff_theorem_or_explicit_guarded_source_audit_release_after_profile');
  assert.equal(packet.forbiddenMovesAfterProfileBlocker.includes('execute_provider_source_audit_under_current_no_spend_instruction'), true);
  assert.equal(packet.oneNextAction.stepId, 'await_p848_new_local_residual_handoff_theorem_or_explicit_guarded_source_audit_release_after_profile');

  assert.equal(packet.claims.preparesFutureResidualHandoffLabelSourceAuditProfile, true);
  assert.equal(packet.claims.writesFutureUseProfile, true);
  assert.equal(packet.claims.exactFourResidualBadClassesNamed, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.usageCheckRun, false);
  assert.equal(packet.claims.providerExecutionReleased, false);
  assert.equal(packet.claims.preservesNoSpendProviderGating, true);
  assert.equal(packet.claims.blocksAdditionalProviderCalls, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.blocksNakedRankBoundary, true);
  assert.equal(packet.claims.provesResidualHandoffLabels, false);
  assert.equal(packet.claims.provesMod50AllFutureRowGenerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 p4217 theorem-wedge decision blocker records the guarded live no-theorem result', () => {
  const packet = runP4217TheoremWedgeDecisionBlockerCompiler([
    '--research-run',
    'orp/research/research-20260418-090709-931835',
  ]);

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_complement_theorem_wedge_decision_blocker_packet/1');
  assert.equal(packet.status, 'p4217_theorem_wedge_decision_blocker_emitted_budget_guarded_live_no_whole_complement_theorem');
  assert.equal(packet.target, 'decide_p848_p4217_complement_wedge_with_budget_guard_or_local_symbolic_proof');
  assert.equal(packet.recommendedNextAction, 'reduce_p848_p4217_residual_to_squarefree_realization_source_theorem_or_emit_gap');
  assert.equal(packet.coversPrimaryNextAction.status, 'blocked_by_budget_guarded_live_wedge_no_p4217_whole_complement_theorem');

  assert.equal(packet.liveWedgeRun.runId, 'research-20260418-090709-931835');
  assert.equal(packet.liveWedgeRun.profileId, 'p848-p4217-theorem-wedge-single');
  assert.equal(packet.liveWedgeRun.status, 'complete');
  assert.equal(packet.liveWedgeRun.apiCalled, true);
  assert.equal(packet.liveWedgeRun.completedTextLaneCount, 1);
  assert.equal(packet.liveWedgeRun.verdict, 'no_whole_complement_cover_or_impossibility_theorem_supported');

  assert.equal(packet.decisionVerdict.result, 'no_promotable_p4217_whole_complement_theorem_found');
  assert.equal(packet.decisionVerdict.wholeComplementCoverTheoremFound, false);
  assert.equal(packet.decisionVerdict.wholeComplementImpossibilityTheoremFound, false);
  assert.equal(packet.decisionVerdict.finitePartitionFound, false);
  assert.equal(packet.decisionVerdict.decreasingInvariantFound, false);
  assert.equal(packet.minimalMissingTheorem.preferredSourceShape, 'squarefree_values_in_every_locally_admissible_residual_arithmetic_progression_or_linear_family');
  assert.deepEqual(
    packet.nextVerificationFork.map((fork) => fork.forkId),
    ['finite_crt_partition', 'decreasing_rank', 'squarefree_realization_source'],
  );

  assert.equal(packet.claims.recordsBudgetGuardedLiveWedgeResult, true);
  assert.equal(packet.claims.livePaidCallMade, true);
  assert.equal(packet.claims.livePaidCallBudgetGuarded, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.selectsSquarefreeRealizationFork, true);
  assert.equal(packet.claims.provesP4217ComplementCover, false);
  assert.equal(packet.claims.provesP4217ComplementImpossibility, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 p4217 residual fork reduction emits the squarefree-realization source-theorem gap', () => {
  const packet = runP4217ResidualSourceTheoremGapCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_residual_squarefree_realization_source_theorem_gap_packet/1');
  assert.equal(packet.status, 'p4217_residual_source_theorem_gap_emitted_no_finite_partition_rank_or_squarefree_source');
  assert.equal(packet.target, 'reduce_p848_p4217_residual_to_squarefree_realization_source_theorem_or_emit_gap');
  assert.equal(packet.recommendedNextAction, 'assemble_p848_all_n_residual_after_p4217_source_theorem_gap_or_import_source');
  assert.equal(packet.coversPrimaryNextAction.status, 'blocked_by_no_finite_crt_partition_decreasing_rank_or_squarefree_realization_source');

  assert.equal(packet.sourceGapDecision.decision, 'emit_p4217_residual_squarefree_realization_source_theorem_gap');
  assert.equal(packet.sourceGapDecision.madeNewPaidCall, false);
  assert.equal(packet.auditedSourceCount, 10);
  assert.equal(packet.theoremForkReduction.result, 'no_current_fork_closes');
  assert.deepEqual(
    packet.theoremForkReduction.forks.map((fork) => [fork.forkId, fork.closes, fork.sourceFound]),
    [
      ['finite_crt_partition', false, false],
      ['decreasing_rank', false, false],
      ['squarefree_realization_source', false, false],
    ],
  );
  assert.equal(packet.minimalMissingTheorem.preferredSourceShape, 'squarefree_values_in_every_locally_admissible_residual_arithmetic_progression_or_linear_family');
  assert.equal(packet.oneNextAction.stepId, 'assemble_p848_all_n_residual_after_p4217_source_theorem_gap_or_import_source');
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken, 'p848_p4217_residual_squarefree_realization_source_theorem_gap');

  assert.equal(packet.claims.emitsP4217ResidualSourceTheoremGap, true);
  assert.equal(packet.claims.auditsFiniteCrtPartitionFork, true);
  assert.equal(packet.claims.auditsDecreasingRankFork, true);
  assert.equal(packet.claims.auditsSquarefreeRealizationSourceFork, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.provesFiniteP4217Partition, false);
  assert.equal(packet.claims.provesP4217ResidualRankDecrease, false);
  assert.equal(packet.claims.provesSquarefreeRealizationSourceTheorem, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 all-N residual assembly after p4217 source-theorem gap keeps source recovery as next action', () => {
  const packet = runAllNResidualAfterP4217SourceGapCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_all_n_recombination_residual_after_p4217_source_theorem_gap_packet/1');
  assert.equal(packet.status, 'all_n_recombination_residual_assembled_after_p4217_source_theorem_gap');
  assert.equal(packet.target, 'assemble_p848_all_n_residual_after_p4217_source_theorem_gap_or_import_source');
  assert.equal(packet.recommendedNextAction, 'prepare_p848_source_import_recovery_plan_after_p4217_and_mod50_source_gaps');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_post_p4217_gap_all_n_residual_assembly');

  assert.equal(packet.residualVerdict.allNProofAvailable, false);
  assert.equal(packet.residualVerdict.finiteMeasureDecreased, false);
  assert.equal(packet.remainingTheoremAtoms.length, 5);
  assert.deepEqual(
    packet.remainingTheoremAtoms.map((atom) => atom.atomId),
    [
      'p848_p4217_residual_squarefree_realization_or_finite_partition',
      'p848_mod50_all_future_relevant_pair_recurrence_or_finite_q_partition',
      'p848_square_moduli_union_hitting_or_threshold_source',
      'p848_post_40500_sufficiency_or_exact_threshold_extension',
      'p848_final_all_n_recombination_without_bounded_only_overclaim',
    ],
  );
  assert.equal(packet.sourceImportRecoveryPlanNeed.status, 'needed_no_spend_next');
  assert.equal(packet.oneNextAction.stepId, 'prepare_p848_source_import_recovery_plan_after_p4217_and_mod50_source_gaps');
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken, 'p848_all_n_residual_after_p4217_source_theorem_gap');

  assert.equal(packet.claims.completesPostP4217GapResidualAssembly, true);
  assert.equal(packet.claims.assemblesAllNResidualAfterP4217Gap, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.selectedNextActionIsSourceImportRecovery, true);
  assert.equal(packet.claims.selectedNextActionIsQCover, false);
  assert.equal(packet.claims.provesFiniteP4217Partition, false);
  assert.equal(packet.claims.provesSquarefreeRealizationSourceTheorem, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});

test('problem 848 source/import recovery plan names the no-spend theorem source lanes', () => {
  const packet = runSourceImportRecoveryPlanAfterP4217AndMod50SourceGapsCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_source_import_recovery_plan_after_p4217_and_mod50_source_gaps_packet/1');
  assert.equal(packet.status, 'source_import_recovery_plan_prepared_after_p4217_and_mod50_source_gaps');
  assert.equal(packet.target, 'prepare_p848_source_import_recovery_plan_after_p4217_and_mod50_source_gaps');
  assert.equal(packet.recommendedNextAction, 'execute_p848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_source_import_recovery_plan');

  assert.equal(packet.recoveryPlanVerdict.madeNewPaidCall, false);
  assert.equal(packet.recoveryPlanVerdict.allNProofAvailable, false);
  assert.deepEqual(
    packet.recoveryLanes.map((lane) => lane.laneId),
    [
      'p4217_residual_squarefree_realization_source',
      'mod50_all_future_recurrence_or_generator',
      'square_moduli_union_hitting_threshold',
    ],
  );
  assert.equal(packet.localProbePlan.executionMode, 'no_spend_local_repository_search_first');
  assert.equal(packet.localProbePlan.commands.length, 3);
  assert.equal(packet.paidCallPolicy.default, 'do_not_call_provider');
  assert.equal(packet.oneNextAction.stepId, 'execute_p848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting');
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken, 'p848_source_import_recovery_plan_after_p4217_and_mod50_source_gaps');

  assert.equal(packet.claims.completesSourceImportRecoveryPlan, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.preparesP4217SourceRecovery, true);
  assert.equal(packet.claims.preparesMod50SourceRecovery, true);
  assert.equal(packet.claims.preparesUnionHittingSourceRecovery, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.selectsNoSpendSourceSearch, true);
  assert.equal(packet.claims.provesFiniteP4217Partition, false);
  assert.equal(packet.claims.provesSquarefreeRealizationSourceTheorem, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.importsSquareModuliUnionHittingThreshold, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 no-spend source recovery search emits the exact source-import gap', () => {
  const packet = runNoSpendSourceRecoverySearchForP4217Mod50UnionHittingCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting_packet/1');
  assert.equal(packet.status, 'no_spend_source_recovery_search_completed_no_promotable_source_found');
  assert.equal(packet.target, 'execute_p848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting');
  assert.equal(packet.recommendedNextAction, 'assemble_p848_all_n_residual_after_source_import_search_gap');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_no_spend_source_search_no_promotable_source_found');

  assert.equal(packet.probeExecution.mode, 'no_spend_local_rg_source_recovery_search');
  assert.equal(packet.probeExecution.madeNewPaidCall, false);
  assert.equal(packet.recoveryLaneResults.length, 3);
  assert.deepEqual(
    packet.recoveryLaneResults.map((lane) => lane.laneId),
    [
      'p4217_residual_squarefree_realization_source',
      'mod50_all_future_recurrence_or_generator',
      'square_moduli_union_hitting_threshold',
    ],
  );
  assert.equal(packet.recoveryLaneResults.every((lane) => lane.status === 'no_promotable_source_found_current_repo'), true);
  assert.equal(packet.missingTheoremObjects.length, 3);
  assert.match(packet.sourceImportGap.exactBoundary, /p4217 residual partition/);
  assert.equal(packet.paidCallPolicy.default, 'do_not_call_provider');
  assert.equal(packet.oneNextAction.stepId, 'assemble_p848_all_n_residual_after_source_import_search_gap');
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken, 'p848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting');

  assert.equal(packet.claims.completesNoSpendSourceRecoverySearch, true);
  assert.equal(packet.claims.emitsFormalSourceImportGap, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.searchedP4217SourceRecovery, true);
  assert.equal(packet.claims.searchedMod50SourceRecovery, true);
  assert.equal(packet.claims.searchedUnionHittingSourceRecovery, true);
  assert.equal(packet.claims.foundPromotableP4217Source, false);
  assert.equal(packet.claims.foundPromotableMod50Source, false);
  assert.equal(packet.claims.foundPromotableUnionHittingSource, false);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksRepeatPaidWedgeByDefault, true);
  assert.equal(packet.claims.provesFiniteP4217Partition, false);
  assert.equal(packet.claims.provesSquarefreeRealizationSourceTheorem, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.importsSquareModuliUnionHittingThreshold, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-source-search all-N residual assembles the three exact source gaps', () => {
  const packet = runAllNResidualAfterSourceImportSearchGapCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_all_n_recombination_residual_after_source_import_search_gap_packet/1');
  assert.equal(packet.status, 'all_n_recombination_residual_assembled_after_source_import_search_gap');
  assert.equal(packet.target, 'assemble_p848_all_n_residual_after_source_import_search_gap');
  assert.equal(packet.recommendedNextAction, 'prepare_p848_repaired_single_lane_source_import_profile_after_no_spend_gap');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_post_source_import_search_gap_all_n_residual_assembly');

  assert.equal(packet.sourceSearchGapSummary.paidCallMade, false);
  assert.equal(packet.sourceSearchGapSummary.recoveryLaneResults.length, 3);
  assert.equal(packet.residualVerdict.status, 'all_n_recombination_still_blocked_by_three_source_import_gaps');
  assert.equal(packet.residualVerdict.allNProofAvailable, false);
  assert.equal(packet.remainingTheoremAtoms.length, 3);
  assert.deepEqual(
    packet.remainingTheoremAtoms.map((atom) => atom.laneId),
    [
      'p4217_residual_squarefree_realization_source',
      'mod50_all_future_recurrence_or_generator',
      'square_moduli_union_hitting_threshold',
    ],
  );
  assert.equal(packet.lanePriorityDecision.selectedMode, 'single_repaired_source_import_profile_preparation');
  assert.equal(packet.paidCallPolicy.default, 'do_not_call_provider');
  assert.equal(packet.paidCallPolicy.madeNewPaidCall, false);
  assert.equal(packet.oneNextAction.stepId, 'prepare_p848_repaired_single_lane_source_import_profile_after_no_spend_gap');
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken, 'p848_all_n_residual_after_source_import_search_gap');

  assert.equal(packet.claims.completesPostSourceImportSearchGapResidualAssembly, true);
  assert.equal(packet.claims.assemblesAllNResidualAfterSourceImportSearchGap, true);
  assert.equal(packet.claims.recordsSourceImportSearchGap, true);
  assert.equal(packet.claims.selectedNextActionIsSingleLaneProfilePrep, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksRepeatPaidWedgeByDefault, true);
  assert.equal(packet.claims.provesFiniteP4217Partition, false);
  assert.equal(packet.claims.provesSquarefreeRealizationSourceTheorem, false);
  assert.equal(packet.claims.provesMod50AllFutureRecurrence, false);
  assert.equal(packet.claims.importsSquareModuliUnionHittingThreshold, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 282/841 live-family binding packet keeps first-unavoidability open', () => {
  const bindingPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_282_841_LIVE_FAMILY_BINDING_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(bindingPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_282_841_live_family_binding_packet/1');
  assert.equal(packet.status, 'live_family_binding_recorded_first_unavoidability_open');
  assert.equal(packet.representative, 137720141);
  assert.equal(packet.targetContinuation, 282);
  assert.equal(packet.bindingMode, 'regenerated_family_row_binding');
  assert.equal(packet.sourceAudit.historicalFamilyMenuSourceExists, false);

  assert.equal(packet.recoveredAnchorRow.crt.modulus, '32631532164');
  assert.equal(packet.recoveredAnchorRow.crt.residue, '137720141');
  assert.equal(packet.recoveredAnchorRow.recoveryStatus, 'regenerated_tuple_rows_and_crt');
  assert.deepEqual(packet.recoveredAnchorRow.tupleRows.map((row) => row.squareModulus), [4, 529, 49, 9, 289, 121]);

  assert.equal(packet.targetWitnessLift.witnessSquare, 841);
  assert.equal(packet.targetWitnessLift.rowIndexCongruence.expression, 't == 0 mod 841');
  assert.equal(packet.targetWitnessLift.targetContinuationClass.modulus, '27443118549924');
  assert.equal(packet.targetWitnessLift.targetContinuationClass.residue, '137720141');

  assert.equal(packet.claims.bindsRecoveredFamilyRow, true);
  assert.equal(packet.claims.liftsTargetWitnessToClass, true);
  assert.equal(packet.claims.provesFirstStructuralUnavoidability, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.remainingBoundary.id, 'p848_282_841_first_structural_unavoidability');
  assert.equal(packet.recommendedNextAction, 'prove_p848_282_841_first_structural_unavoidability_or_emit_boundary');
});

test('problem 848 282/841 chronology blocker names missing row-level source', () => {
  const blockerPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_282_841_FIRST_UNAVOIDABILITY_CHRONOLOGY_BLOCKER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(blockerPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_282_841_first_unavoidability_chronology_blocker_packet/1');
  assert.equal(packet.status, 'first_structural_unavoidability_chronology_blocked_missing_live_family_rows');
  assert.equal(packet.representative, 137720141);
  assert.equal(packet.targetContinuation, 282);
  assert.equal(packet.witnessSquare, 841);

  assert.equal(packet.recoveredAnchorRow.modulus, '32631532164');
  assert.equal(packet.targetWitnessClass.modulus, '27443118549924');
  assert.equal(packet.targetWitnessClass.rowIndexCongruence, 't == 0 mod 841');

  assert.equal(packet.localChronologyAudit.requiredLiveFamilySources.every((source) => source.exists === false), true);
  assert.equal(packet.localChronologyAudit.seedSnapshotSurface.nextUnmatched, 137720141);
  assert.equal(packet.localChronologyAudit.seedSnapshotSurface.knownFailureMatches, 25);
  assert.equal(packet.localChronologyAudit.activationLemmaCheck.status, 'failed');
  assert.equal(packet.localChronologyAudit.activationLemmaCheck.checkedRowCount, 0);

  assert.equal(packet.controlledCongruenceEvidence.tupleRowActivationBoundary.activationAnchor, 132);
  assert.deepEqual(packet.controlledCongruenceEvidence.tupleRowActivationBoundary.activationTrackedAnchors, [282]);
  assert.equal(packet.controlledCongruenceEvidence.rowProgressionModuloWitness.traversesAllWitnessResidues, true);

  assert.equal(packet.claims.provesRecoveredRowBinding, true);
  assert.equal(packet.claims.provesTargetWitnessLift, true);
  assert.equal(packet.claims.provesControlledCongruenceCandidate, true);
  assert.equal(packet.claims.provesLocalChronologySourceMissing, true);
  assert.equal(packet.claims.provesFirstStructuralUnavoidability, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.recommendedNextAction, 'recover_or_regenerate_p848_282_841_family_chronology_source_or_prove_recurrence');
});

test('problem 848 282/841 seed chronology recovery narrows the missing input', () => {
  const recoveryPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_282_841_SEED_CHRONOLOGY_RECOVERY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(recoveryPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_282_841_seed_chronology_recovery_packet/1');
  assert.equal(packet.status, 'seed_chronology_summary_recovered_row_level_menu_still_missing');
  assert.equal(packet.representative, 137720141);
  assert.equal(packet.targetContinuation, 282);
  assert.equal(packet.witnessSquare, 841);

  assert.equal(packet.manifestAudit.scannedManifestCount, 19);
  assert.equal(packet.manifestAudit.usableFamilyMenuSummaryCount, 14);
  assert.equal(packet.manifestAudit.stableTwentyFourFamilySummaryCount, 9);
  assert.equal(packet.manifestAudit.stableSurface.familyCount, 280);
  assert.equal(packet.manifestAudit.stableSurface.knownFailureMatches, 25);
  assert.equal(packet.manifestAudit.stableSurface.latestDirectFailure, 136702637);
  assert.equal(packet.manifestAudit.stableSurface.nextUnmatched, 137720141);

  assert.equal(packet.recoveredKnownFailureSequence.count, 24);
  assert.equal(packet.recoveredKnownFailureSequence.values.at(-1), 136702637);
  assert.equal(packet.recoveredKnownFailureSequence.targetTailFailurePacket.n, 137720141);
  assert.equal(packet.recoveredKnownFailureSequence.targetTailFailurePacket.tail, 282);

  assert.equal(packet.claims.recoversSeedSummaryChronology, true);
  assert.equal(packet.claims.provesStableNextUnmatchedAcrossLocalSeedSnapshots, true);
  assert.equal(packet.claims.narrowsMissingInputToRawFamilyRowsOrGenerator, true);
  assert.equal(packet.claims.recoversRawFamilyMenuRows, false);
  assert.equal(packet.claims.provesChronologyRecurrence, false);
  assert.equal(packet.claims.provesFirstStructuralUnavoidability, false);
  assert.equal(packet.recommendedNextAction, 'regenerate_p848_282_841_row_level_family_menu_from_seed_generator_or_prove_ordering_recurrence');
});

test('problem 848 282/841 generator-source blocker narrows the next theorem move', () => {
  const blockerPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_282_841_GENERATOR_SOURCE_BLOCKER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(blockerPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_282_841_generator_source_blocker_packet/1');
  assert.equal(packet.status, 'row_level_family_menu_generator_blocked_not_in_local_repo');
  assert.equal(packet.representative, 137720141);
  assert.equal(packet.targetContinuation, 282);
  assert.equal(packet.witnessSquare, 841);

  assert.equal(packet.targetRow.stableSeedSurface.familyCount, 280);
  assert.equal(packet.targetRow.stableSeedSurface.knownFailureMatches, 25);
  assert.equal(packet.targetRow.stableSeedSurface.latestDirectFailure, 136702637);
  assert.equal(packet.targetRow.stableSeedSurface.nextUnmatched, 137720141);
  assert.equal(packet.targetRow.targetTailFailurePacket.packetId, 'tail_282_137720141');

  assert.equal(packet.localGeneratorAudit.liveFrontierRoots.every((source) => source.exists === false), true);
  assert.equal(packet.localGeneratorAudit.candidateRawMenuPaths.every((source) => source.exists === false), true);
  assert.equal(
    packet.localGeneratorAudit.cliCommandsAudited.every((command) => command.generatesRawFamilyMenu === false),
    true,
  );
  assert.equal(packet.localGeneratorAudit.seedBundleLimitation.manifestContainsFamilyMenuSurface, true);
  assert.equal(packet.localGeneratorAudit.seedBundleLimitation.manifestContainsRawFamiliesArray, false);
  assert.equal(packet.localGeneratorAudit.seedBundleLimitation.candidateFilesContainFullFamilyRows, false);
  assert.match(packet.localGeneratorAudit.verdict, /no local source tree or CLI command here regenerates the 280 row-level menu/);

  assert.equal(packet.claims.auditsLocalGeneratorSurface, true);
  assert.equal(packet.claims.provesLocalRawMenuSourceAbsent, true);
  assert.equal(packet.claims.provesLocalGeneratorCommandAbsent, true);
  assert.equal(packet.claims.recoversRawFamilyMenuRows, false);
  assert.equal(packet.claims.provesChronologyRecurrence, false);
  assert.equal(packet.claims.provesFirstStructuralUnavoidability, false);
  assert.equal(packet.recommendedNextAction, 'prove_p848_282_841_ordering_recurrence_from_seed_summary_or_restore_row_menu_source');
});

test('problem 848 282/841 row-menu replay certificate closes the restored finite-menu chronology boundary', () => {
  const certificatePath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_282_841_ROW_MENU_REPLAY_CERTIFICATE_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(certificatePath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_282_841_row_menu_replay_certificate_packet/1');
  assert.equal(packet.status, 'row_level_family_menu_source_restored_and_replayed');
  assert.equal(packet.representative, 137720141);
  assert.equal(packet.targetContinuation, 282);
  assert.equal(packet.witnessSquare, 841);

  assert.equal(packet.restoredSource.familyMenuExists, true);
  assert.match(packet.restoredSource.familyMenuPath, /output\/frontier-engine-local\/p848-anchor-ladder\/live-frontier-sync\/2026-04-05\/SIX_PREFIX_TWENTY_FOUR_FAMILY_MENU\.json$/);
  assert.equal(packet.restoredSource.familyCount, 280);
  assert.equal(packet.restoredSource.knownFailureMatches, 25);
  assert.equal(packet.restoredSource.knownFailureCount, 24);
  assert.equal(packet.restoredSource.representativesSorted, true);

  assert.equal(packet.chronologyReplay.firstUnmatchedFamilyIndex, 25);
  assert.equal(packet.chronologyReplay.firstUnmatchedRepresentative, 137720141);
  assert.equal(packet.chronologyReplay.first282FailureIndex, 25);
  assert.equal(packet.chronologyReplay.first282FailureRepresentative, 137720141);
  assert.equal(packet.chronologyReplay.prior282FailureCount, 0);

  assert.equal(packet.targetRow.tupleKey, '4, 23^2, 7^2, 9, 17^2, 11^2');
  assert.equal(packet.targetRow.targetRepair.anchor, 282);
  assert.equal(packet.targetRow.targetRepair.squarefree, false);
  assert.deepEqual(packet.targetRow.targetRepair.squareWitnesses.map((row) => row.squareModulus), [841]);

  assert.equal(packet.alignmentReplay.familyMenuSourceExists, true);
  assert.equal(packet.alignmentReplay.familyRowRecovered, true);
  assert.equal(packet.alignmentReplay.targetWitnessLiftedToSubprogression, true);
  assert.equal(packet.activationReplay.status, 'passed');
  assert.equal(packet.activationReplay.checkedRowCount, 17);
  assert.equal(packet.activationReplay.targetRowCheck.status, 'passed');
  assert.equal(packet.activationReplay.familyMenuResidueBoundary.sameAsFirstFailingRepresentative, true);

  assert.equal(packet.claims.restoresRawFamilyMenuSource, true);
  assert.equal(packet.claims.provesRowLevelMenuChronologyForRestoredMenu, true);
  assert.equal(packet.claims.provesTargetIsFirst282FailureInRestoredMenu, true);
  assert.equal(packet.claims.provesActivationReplayFiniteMenu, true);
  assert.equal(packet.claims.provesFirstStructuralUnavoidabilityWithinRestoredMenu, true);
  assert.equal(packet.claims.provesUniversalRecurrence, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.recommendedNextAction, 'formalize_top_repair_class_mechanism');
});

test('problem 848 top repair-class mechanism packet formalizes finite-menu handoff without all-N overclaim', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_TOP_REPAIR_CLASS_MECHANISM_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_top_repair_class_mechanism_packet/1');
  assert.equal(packet.status, 'top_repair_class_mechanism_formalized_finite_menu_handoff');
  assert.deepEqual(packet.topRepairClass.tieClass, [432, 782, 832]);
  assert.deepEqual(packet.topRepairClass.primaryContrasts, [332, 382, 1232]);

  assert.equal(packet.sourceFamilyMenu.familyCount, 280);
  assert.equal(packet.sourceFamilyMenu.predictedFamilyCount, 255);
  assert.equal(packet.sourceFamilyMenu.rowMenuReplayProvesFirst282FailureWithinRestoredMenu, true);

  assert.equal(packet.topRepairClass.sharedMetrics.repairedKnownPackets, 26);
  assert.equal(packet.topRepairClass.sharedMetrics.repairedPredictedFamilies, 242);
  assert.equal(packet.topRepairClass.sharedMetrics.effectiveCleanThrough, 250075000);

  assert.equal(packet.finiteMenuSeparation.status, 'finite_menu_plus2_replay_certified');
  assert.equal(packet.finiteMenuSeparation.failCount, 0);
  assert.equal(packet.finiteMenuSeparation.topTieCounts.every((row) => row.repairedPredictedFamilyCount === 242), true);
  assert.equal(
    packet.finiteMenuSeparation.primaryContrastCounts.every((row) => row.repairedPredictedFamilyCount === 240),
    true,
  );

  assert.equal(packet.symbolicBadLaneSchema.status, 'symbolic_bad_lane_schema_ready');
  assert.equal(packet.symbolicBadLaneSchema.checkedRowCount, 74);
  assert.equal(packet.symbolicBadLaneSchema.failCount, 0);
  assert.equal(packet.symbolicBadLaneSchema.scope.universalDivisibilityClaim, true);
  assert.equal(packet.symbolicBadLaneSchema.scope.universalSquarefreeRepairClaim, false);

  assert.equal(packet.strictHandoff782Vs1232.status, 'finite_strict_handoff_certified_not_gap_closure');
  assert.equal(packet.strictHandoff782Vs1232.topContinuation, 782);
  assert.equal(packet.strictHandoff782Vs1232.contrastContinuation, 1232);
  assert.equal(packet.strictHandoff782Vs1232.netExtraRepairsForTop, 2);
  assert.equal(packet.strictHandoff782Vs1232.topOnlyMissCount, 0);
  assert.equal(packet.strictHandoff782Vs1232.contrastOnlyMissCount, 2);
  assert.equal(packet.strictHandoff782Vs1232.theoremBoundary.allNFiniteGapClosureClaim, false);

  assert.equal(packet.anchor832Witness529Domain.status, 'finite_group_closure_certified_symbolic_domain_split');
  assert.equal(
    packet.anchor832Witness529Domain.symbolicDomainDecision.verdict,
    'single_profile_symbolic_domain_falsified_by_profile_split',
  );
  assert.equal(packet.anchor832Witness529ProfileSublane.status, 'finite_profile_sublane_resolved_as_zero_lift_duplicate');
  assert.equal(
    packet.anchor832Witness529ProfileSublane.symbolicDomainDecision.verdict,
    'profile_sublane_not_a_new_symbolic_family',
  );

  assert.equal(packet.claims.formalizesTopRepairClassMechanism, true);
  assert.equal(packet.claims.provesFiniteMenuPlus2Separation, true);
  assert.equal(packet.claims.provesMod50BadLaneDivisibilitySchema, true);
  assert.equal(packet.claims.provesUniversalSquarefreeRepairTheorem, false);
  assert.equal(packet.claims.provesAllRelevantSquareWitnessCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.recommendedNextAction, 'choose_next_exact_verifier_rollout_after_top_repair_class_handoff');
});

test('problem 848 top repair-class exact verifier decision chooses compact 40500 promotion before new rollout', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_TOP_REPAIR_CLASS_EXACT_VERIFIER_ROLLOUT_DECISION_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_top_repair_class_exact_verifier_rollout_decision_packet/1');
  assert.equal(packet.status, 'exact_verifier_rollout_decision_recorded_compact_40500_promotion_first');
  assert.equal(packet.sourcePrimaryAction, 'choose_next_exact_verifier_rollout_after_top_repair_class_handoff');

  assert.equal(packet.exactLaneAudit.publicRawExactInterval, '1..10000');
  assert.equal(packet.exactLaneAudit.localCompactRolloutInterval, '1..40500');
  assert.equal(packet.exactLaneAudit.localCompactCommittedAsRawClaim, false);
  assert.equal(packet.exactLaneAudit.breakpointCertificateSummary.interval, '1..40500');
  assert.equal(packet.exactLaneAudit.breakpointCertificateSummary.endpointCheckCount, 1621);
  assert.equal(packet.exactLaneAudit.queueState.localUnpromotedInterval, '10001..40500');
  assert.equal(packet.exactLaneAudit.queueState.nextDeferredInterval, '40501..?');
  assert.equal(packet.exactLaneAudit.dispatchAudit.exactFollowupRollout.available, false);

  assert.equal(packet.decision.chosenRoute, 'promote_existing_compact_1_40500_exact_rollout_before_new_compute');
  assert.equal(packet.decision.chosenNextAction, 'promote_p848_exact_40500_compact_rollout_certificate_after_top_repair_handoff');
  assert.equal(packet.decision.boundedWorkEnvelope.noNewExactScanStarted, true);
  assert.equal(packet.decision.boundedWorkEnvelope.noRemoteOrPaidCompute, true);
  assert.equal(packet.claims.choosesNextExactVerifierRoute, true);
  assert.equal(packet.claims.promotesCompact40500Interval, false);
  assert.equal(packet.claims.provesCoverageTheorem, false);
  assert.equal(packet.claims.startsNewExactCompute, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 compact 40500 promotion preserves raw exact boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_EXACT_40500_COMPACT_PROMOTION_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_exact_40500_compact_promotion_packet/1');
  assert.equal(packet.status, 'compact_exact_40500_promoted_public_compact_evidence');
  assert.equal(packet.promotionObject.interval, '1..40500');
  assert.equal(packet.promotionObject.claimLevel, 'public_compact_evidence_not_public_raw_packet');
  assert.equal(packet.promotionObject.publicRawExactIntervalRemains, '1..10000');
  assert.equal(packet.promotionObject.publicCompactExactIntervalNowAvailable, '1..40500');
  assert.equal(packet.promotionObject.rawPacketCommittedOrBundled, false);

  assert.equal(packet.inputsAudited.localRollout.rawHashMatchesBookkeeping, true);
  assert.equal(
    packet.inputsAudited.localRollout.rawResultSha256VerifiedThisStep,
    'da3546ab3f30faef879c2d4da680f826711361e2c685de8f384eb116df1f8fbc',
  );
  assert.equal(packet.compactCertificateReview.interval, '1..40500');
  assert.equal(packet.compactCertificateReview.allEndpointChecksCertified, true);
  assert.equal(packet.compactCertificateReview.scoutSortedContiguousFromOne, true);
  assert.equal(packet.compactCertificateReview.failedEndpointChecks, 0);
  assert.equal(packet.claims.promotesCompact40500Interval, true);
  assert.equal(packet.claims.promotesRaw40500Packet, false);
  assert.equal(packet.claims.preservePublicRawExact10000Boundary ?? packet.claims.preservesPublicRawExact10000Boundary, true);
  assert.equal(packet.claims.startsNewExactCompute, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 compact 40500 endpoint audit finds lane-aligned breakpoints but no new boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_EXACT_40500_ENDPOINT_BOUNDARY_AUDIT_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_exact_40500_endpoint_boundary_audit_packet/1');
  assert.equal(packet.status, 'compact_40500_endpoint_boundary_audit_lane_aligned_no_new_failure_boundary');
  assert.equal(packet.auditTarget.promotedCompactInterval, '1..40500');
  assert.equal(packet.auditTarget.publicRawExactIntervalRemains, '1..10000');

  assert.deepEqual(packet.mod50LaneAudit.topRepairTieClass, [432, 782, 832]);
  assert.deepEqual(packet.mod50LaneAudit.primaryContrasts, [332, 382, 1232]);
  assert.equal(packet.mod50LaneAudit.allRelevantContinuationsInLane32Mod50, true);
  assert.equal(packet.mod50LaneAudit.allRelevantContinuationsAreExactBreakpoints, true);
  assert.equal(packet.mod50LaneAudit.allRelevantContinuationsEndpointCertified, true);
  assert.equal(packet.mod50LaneAudit.lane32BreakpointRowsInCompactInterval.count, 810);

  assert.equal(packet.boundaryFinding.noNewFailureBoundaryFound, true);
  assert.equal(packet.boundaryFinding.noTopSpecificCoverageBoundaryFound, true);
  assert.equal(packet.boundaryFinding.no40501PlusRolloutJustifiedByThisAudit, true);
  assert.equal(packet.claims.identifiesRelevantTopRepairBreakpointRows, true);
  assert.equal(packet.claims.provesMod50BadLaneCoverageTheorem, false);
  assert.equal(packet.claims.justifies40501PlusRollout, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 lane coverage blocker names missing square-witness hypotheses', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_LANE_COVERAGE_HYPOTHESES_BLOCKER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_lane_coverage_hypotheses_blocker_packet/1');
  assert.equal(packet.status, 'mod50_lane_coverage_hypotheses_blocked_universal_square_witness_cover_missing');
  assert.equal(packet.attemptedTheorem.theoremId, 'p848_mod50_lane_breakpoint_coverage_theorem_candidate_v1');
  assert.equal(packet.attemptedTheorem.result, 'blocked_not_proved');

  assert.deepEqual(
    packet.missingHypotheses.map((hypothesis) => hypothesis.hypothesisId),
    [
      'square_witness_domain_cover',
      'top_lane_bad_class_avoidance_or_handoff_cover',
      'finite_menu_to_breakpoint_bridge',
      'post_40500_breakpoint_sufficiency',
    ],
  );

  assert.equal(packet.exactUncoveredWitnessLaneFamily.familyId, 'p848_mod50_lane_uncovered_square_witness_family');
  assert.equal(packet.exactUncoveredWitnessLaneFamily.continuationFormula, 'c = 32 + 50*m');
  assert.equal(packet.exactUncoveredWitnessLaneFamily.badLaneCongruence, '(50*n)*m ≡ -(32*n + 1) (mod Q)');
  assert.equal(packet.exactUncoveredWitnessLaneFamily.currentFiniteWitnessInstanceCount, 74);
  assert.equal(packet.recommendedNextAction, 'derive_p848_mod50_lane_square_witness_domain_cover_or_emit_counterfamily');

  assert.equal(packet.claims.blocksMod50CoverageTheorem, true);
  assert.equal(packet.claims.namesExactUncoveredWitnessLaneFamily, true);
  assert.equal(packet.claims.provesUniversalSquarefreeRepairTheorem, false);
  assert.equal(packet.claims.justifies40501PlusRollout, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 square-witness domain census selects anchor 432 witness 4489', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_LANE_SQUARE_WITNESS_DOMAIN_CENSUS_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_lane_square_witness_domain_census_packet/1');
  assert.equal(packet.status, 'observed_square_witness_domain_decomposed_next_top_risk_group_selected');
  assert.equal(packet.parentBlocker.blockedTheoremId, 'p848_mod50_lane_breakpoint_coverage_theorem_candidate_v1');

  assert.equal(packet.observedDomainCensus.instanceCount, 74);
  assert.equal(packet.observedDomainCensus.witnessPeriodCount, 10);
  assert.equal(packet.observedDomainCensus.qBadResidueGroupCount, 15);
  assert.equal(packet.observedDomainCensus.topOnly.instanceCount, 28);
  assert.equal(packet.observedDomainCensus.topOnly.groupCount, 7);
  assert.equal(packet.observedDomainCensus.contrastOnly.instanceCount, 46);
  assert.equal(packet.observedDomainCensus.contrastOnly.groupCount, 11);

  assert.equal(packet.alreadyClosedObservedSubdomains[0].groupId, 'anchor_832_witness_529');
  assert.equal(packet.alreadyClosedObservedSubdomains[0].profileSublaneStatus, 'finite_profile_sublane_resolved_as_zero_lift_duplicate');

  assert.equal(packet.selectedNextSubprobe.stepId, 'prove_p848_mod50_anchor432_witness4489_domain_or_emit_profile_split');
  assert.equal(packet.selectedNextSubprobe.groupId, 'anchor_432_witness_4489');
  assert.equal(packet.selectedNextSubprobe.failingAnchor, 432);
  assert.equal(packet.selectedNextSubprobe.witnessSquareModulus, 4489);
  assert.deepEqual(packet.selectedNextSubprobe.familyIndices, [236, 237]);
  assert.deepEqual(packet.selectedNextSubprobe.representatives, [1585191353]);
  assert.equal(packet.selectedNextSubprobe.observedTopOnlyGroup.instanceCount, 6);
  assert.deepEqual(packet.selectedNextSubprobe.observedTopOnlyGroup.repairedLaneIndices, [6, 7, 24]);

  assert.equal(packet.recommendedNextAction, 'prove_p848_mod50_anchor432_witness4489_domain_or_emit_profile_split');
  assert.equal(packet.claims.decomposesObservedSquareWitnessDomain, true);
  assert.equal(packet.claims.selectsFiniteNextDomainSubprobe, true);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.justifies40501PlusRollout, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 anchor 432 witness 4489 packet closes finite profile split', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_ANCHOR432_WITNESS4489_PROFILE_SPLIT_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_anchor432_witness4489_profile_split_packet/1');
  assert.equal(packet.status, 'finite_group_replay_certified_initial_anchor_profile_split');
  assert.equal(packet.targetGroup.groupId, 'anchor_432_witness_4489');
  assert.equal(packet.targetGroup.failingAnchor, 432);
  assert.equal(packet.targetGroup.witnessSquareModulus, 4489);
  assert.equal(packet.targetGroup.targetFailureResidue, 4250);

  assert.equal(packet.domainReplay.status, 'passed');
  assert.equal(packet.domainReplay.checkedRowCount, 2);
  assert.equal(packet.domainReplay.passCount, 2);
  assert.equal(packet.domainReplay.failCount, 0);
  assert.equal(packet.domainReplay.closureChecks.rowCountMatchesCensus, true);
  assert.equal(packet.domainReplay.closureChecks.allRowsPassReplay, true);
  assert.equal(packet.domainReplay.closureChecks.sameRepresentative, true);
  assert.equal(packet.domainReplay.closureChecks.sameRepairValue, true);
  assert.equal(packet.domainReplay.closureChecks.profileSplitPresent, true);
  assert.equal(packet.domainReplay.closureChecks.noRepeatedProfileRemains, true);
  assert.equal(packet.domainReplay.closureChecks.sameSuffixFromAnchor32Through182, true);
  assert.equal(packet.domainReplay.closureChecks.samePrefixThrough132, false);
  assert.equal(packet.domainReplay.closureChecks.anchor132ConvergesToTargetResidue, true);
  assert.equal(packet.domainReplay.closureChecks.anchor182ZeroLiftForEveryRow, true);

  assert.equal(packet.profileSplitDecision.profileGroupCount, 2);
  assert.equal(packet.profileSplitDecision.repeatedProfileId, null);
  assert.equal(packet.profileSplitDecision.verdict, 'two_pre132_profiles_converge_at_anchor132_not_a_single_duplicate_profile');
  assert.deepEqual(packet.rowProofs.map((row) => row.familyIndex), [236, 237]);
  assert.deepEqual(packet.rowProofs.map((row) => row.representative), [1585191353, 1585191353]);
  assert.deepEqual(packet.rowProofs.map((row) => row.repairValue), [684802664497, 684802664497]);
  assert.deepEqual(packet.rowProofs.map((row) => row.anchor182LiftParameter), [0, 0]);
  assert.equal(packet.nextDomainCoverMove.remainingTopOnlyGroupCount, 5);

  assert.equal(packet.recommendedNextAction, 'batch_classify_p848_mod50_remaining_top_only_witness_groups_or_emit_next_profile_split');
  assert.equal(packet.claims.closesSelectedAnchor432Witness4489Subprobe, true);
  assert.equal(packet.claims.emitsProfileSplitBoundary, true);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.justifies40501PlusRollout, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 remaining top-only packet batch-classifies finite groups', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_REMAINING_TOP_ONLY_GROUPS_BATCH_CLASSIFICATION_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_remaining_top_only_groups_batch_classification_packet/1');
  assert.equal(packet.status, 'remaining_top_only_groups_batch_classified_with_non_first_target_boundaries');
  assert.equal(packet.batchReplay.status, 'passed_with_profile_boundaries');
  assert.equal(packet.batchReplay.checkedGroupCount, 5);
  assert.equal(packet.batchReplay.checkedRowCount, 7);
  assert.equal(packet.batchReplay.checkedObservedInstanceCount, 13);
  assert.equal(packet.batchReplay.strictTargetFirstGroupCount, 2);
  assert.equal(packet.batchReplay.nonFirstTargetBoundaryGroupCount, 3);
  assert.equal(packet.batchReplay.arithmeticBlockerGroupCount, 0);
  assert.deepEqual(packet.batchReplay.strictTargetFirstGroupIds, [
    'top_432_Q1681_bad8',
    'top_782_Q169_bad15',
  ]);
  assert.deepEqual(packet.batchReplay.nonFirstTargetBoundaryGroupIds, [
    'top_432_Q49_bad8',
    'top_782_Q9_bad6',
    'top_832_Q9_bad7',
  ]);
  assert.equal(packet.batchReplay.allRowsHaveWitnessAndCrtReplay, true);
  assert.equal(packet.batchReplay.allFailuresAreOnlyFirstTrackedMatchIsTarget, true);
  assert.equal(packet.batchReplay.no40501PlusRolloutUsed, true);

  const classifications = new Map(packet.groupClassifications.map((group) => [group.groupId, group]));
  assert.equal(classifications.get('top_432_Q1681_bad8').strictTargetFirstReplayCertified, true);
  assert.equal(classifications.get('top_782_Q169_bad15').strictTargetFirstReplayCertified, true);
  assert.equal(classifications.get('top_432_Q49_bad8').nonFirstTargetBoundary, true);
  assert.equal(classifications.get('top_782_Q9_bad6').classification, 'non_first_target_multirow_profile_boundary');
  assert.equal(classifications.get('top_832_Q9_bad7').failedStrictChecks[0], 'firstTrackedMatchIsTarget');

  assert.equal(packet.nonFirstTargetSuccessorBoundary.stepId, 'resolve_p848_mod50_non_first_target_top_only_boundaries_or_emit_handoff_theorem');
  assert.deepEqual(packet.nonFirstTargetSuccessorBoundary.groupIds, [
    'top_432_Q49_bad8',
    'top_782_Q9_bad6',
    'top_832_Q9_bad7',
  ]);
  assert.equal(packet.recommendedNextAction, 'resolve_p848_mod50_non_first_target_top_only_boundaries_or_emit_handoff_theorem');

  assert.equal(packet.claims.batchClassifiesRemainingObservedTopOnlyGroups, true);
  assert.equal(packet.claims.certifiesFiniteRawTupleReplayForAllRemainingRows, true);
  assert.equal(packet.claims.closesAllRemainingTopOnlyGroupsAsUniversalCoverage, false);
  assert.equal(packet.claims.emitsNonFirstTargetProfileBoundaries, true);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.justifies40501PlusRollout, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 non-first-target audit names activation-cover gap', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_NON_FIRST_TARGET_PROFILE_BOUNDARY_AUDIT_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_non_first_target_profile_boundary_audit_packet/1');
  assert.equal(packet.status, 'non_first_target_boundaries_blocked_by_activation_cover_gap');
  assert.equal(packet.parentBoundary.stepId, 'resolve_p848_mod50_non_first_target_top_only_boundaries_or_emit_handoff_theorem');
  assert.deepEqual(packet.parentBoundary.groupIds, [
    'top_432_Q49_bad8',
    'top_782_Q9_bad6',
    'top_832_Q9_bad7',
  ]);

  assert.equal(packet.auditSummary.checkedBoundaryGroupCount, 3);
  assert.equal(packet.auditSummary.checkedBoundaryRowCount, 5);
  assert.equal(packet.auditSummary.firstActivationEventCount, 10);
  assert.equal(packet.auditSummary.sameFamilyObservedCompanionEventCount, 4);
  assert.equal(packet.auditSummary.unresolvedActivationEventCount, 6);
  assert.equal(packet.auditSummary.outsideSurfaceEventCount, 3);
  assert.deepEqual(packet.auditSummary.outsideSurfaceContinuations, [157, 232]);
  assert.equal(packet.auditSummary.no40501PlusRolloutUsed, true);

  const groups = new Map(packet.auditedGroups.map((group) => [group.groupId, group]));
  assert.equal(groups.get('top_432_Q49_bad8').status, 'primary_contrast_same_family_companion_missing');
  assert.equal(groups.get('top_782_Q9_bad6').status, 'mixed_companion_and_external_activation_boundary');
  assert.equal(groups.get('top_832_Q9_bad7').status, 'mixed_companion_and_external_activation_boundary');

  assert.deepEqual(
    packet.blocker.missingHypotheses.map((hypothesis) => hypothesis.hypothesisId),
    [
      'tracked_activation_cover',
      'external_activation_handoff',
      'same_family_primary_contrast_companion',
    ],
  );
  assert.equal(packet.recommendedNextAction, 'prove_p848_mod50_tracked_activation_cover_or_emit_external_anchor_counterfamily');

  assert.equal(packet.claims.auditsAllNonFirstTargetTopOnlyBoundaries, true);
  assert.equal(packet.claims.resolvesAllNonFirstTargetBoundariesByCurrentHandoff, false);
  assert.equal(packet.claims.identifiesActivationCoverGap, true);
  assert.equal(packet.claims.provesTrackedActivationCover, false);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.justifies40501PlusRollout, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 external-anchor counterfamily blocks current activation cover', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_EXTERNAL_ANCHOR_ACTIVATION_COUNTERFAMILY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_external_anchor_activation_counterfamily_packet/1');
  assert.equal(packet.status, 'tracked_activation_cover_blocked_by_external_anchor_counterfamily');
  assert.equal(packet.parentAudit.stepId, 'prove_p848_mod50_tracked_activation_cover_or_emit_external_anchor_counterfamily');

  assert.deepEqual(packet.counterfamilySummary.externalContinuations, [157, 232]);
  assert.equal(packet.counterfamilySummary.checkedExternalActivationEventCount, 3);
  assert.equal(packet.counterfamilySummary.checkedExternalFamilyRows, 3);
  assert.equal(packet.counterfamilySummary.companionGapEventCount, 3);
  assert.deepEqual(packet.counterfamilySummary.companionGapContinuations, [382, 832]);
  assert.equal(packet.counterfamilySummary.allExternalContinuationsInRestoredRepairAnchors, true);
  assert.equal(packet.counterfamilySummary.allExternalContinuationsOutsideCurrentHandoffSurface, true);
  assert.equal(packet.counterfamilySummary.anyExternalContinuationInCurrentGpuLeaderboardTopSix, false);
  assert.equal(packet.counterfamilySummary.no40501PlusRolloutUsed, true);

  const profiles = new Map(packet.externalContinuationProfiles.map((profile) => [profile.continuation, profile]));
  assert.equal(profiles.get(157).plus50Alignment, false);
  assert.equal(profiles.get(157).laneIndexIn32Mod50Lane, null);
  assert.equal(profiles.get(157).restoredMenuScore.repairedPredictedFamilyCount, 110);
  assert.equal(profiles.get(157).observedFirstActivationEvents.length, 2);

  assert.equal(profiles.get(232).plus50Alignment, true);
  assert.equal(profiles.get(232).laneIndexIn32Mod50Lane, 4);
  assert.equal(profiles.get(232).restoredMenuScore.repairedPredictedFamilyCount, 201);
  assert.equal(profiles.get(232).observedFirstActivationEvents.length, 1);

  assert.deepEqual(
    packet.blocker.missingHypotheses.map((hypothesis) => hypothesis.hypothesisId),
    [
      'external_anchor_irrelevance_or_expanded_handoff',
      'same_family_companion_cover_for_382_832',
    ],
  );
  assert.equal(packet.recommendedNextAction, 'prove_p848_mod50_external_anchor_irrelevance_or_expand_handoff_surface');

  assert.equal(packet.claims.refutesCurrentTrackedActivationCoverScope, true);
  assert.equal(packet.claims.identifiesExternalAnchorCounterfamily, true);
  assert.equal(packet.claims.provesExternalAnchorIrrelevance, false);
  assert.equal(packet.claims.justifies40501PlusRollout, false);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 external-anchor irrelevance split isolates 232 blocker', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_EXTERNAL_ANCHOR_IRRELEVANCE_SPLIT_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_external_anchor_irrelevance_split_packet/1');
  assert.equal(packet.status, 'external_anchor_counterfamily_split_into_terminal_profiles');
  assert.deepEqual(packet.splitSummary.terminallySplitContinuations, [157]);
  assert.deepEqual(packet.splitSummary.remainingExternalContinuations, [232]);
  assert.deepEqual(packet.splitSummary.remainingCompanionContinuations, [382, 832]);
  assert.equal(packet.splitSummary.observedExternalEventsTerminallySplitCount, 2);
  assert.equal(packet.splitSummary.remainingSameLaneExternalEventCount, 1);
  assert.equal(packet.splitSummary.remainingCompanionGapEventCount, 3);
  assert.equal(packet.splitSummary.nextBottleneckContinuation, 232);

  const profiles = new Map(packet.terminalProfiles.map((profile) => [profile.continuation, profile]));
  assert.equal(profiles.get(157).status, 'finite_observed_events_terminally_split_not_universal_irrelevance');
  assert.equal(profiles.get(157).plus50Alignment, false);
  assert.equal(profiles.get(157).laneMod50, 7);
  assert.equal(profiles.get(157).observedEvents.length, 2);
  assert.equal(profiles.get(157).observedEvents.every((event) => event.repairRow.squarefree === false), true);

  assert.equal(profiles.get(232).status, 'open_same_lane_external_anchor_handoff_gap');
  assert.equal(profiles.get(232).plus50Alignment, true);
  assert.equal(profiles.get(232).laneMod50, 32);
  assert.equal(profiles.get(232).laneIndexIn32Mod50Lane, 4);
  assert.equal(profiles.get(232).observedEvents.length, 1);
  assert.equal(profiles.get(232).observedEvents[0].repairRow.squarefree, true);

  assert.deepEqual(
    packet.blocker.missingHypotheses.map((hypothesis) => hypothesis.hypothesisId),
    [
      'same_lane_external_anchor_232_irrelevance_or_expanded_handoff',
      'same_family_companion_cover_for_382_832',
    ],
  );
  assert.equal(packet.recommendedNextAction, 'prove_p848_mod50_232_same_lane_external_anchor_handoff_or_emit_profile_split');
  assert.equal(packet.claims.terminallySplitsObserved157Events, true);
  assert.equal(packet.claims.provesUniversal157Irrelevance, false);
  assert.equal(packet.claims.proves232Irrelevance, false);
  assert.equal(packet.claims.justifies40501PlusRollout, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 232 same-lane profile split emits finite terminal row', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_232_SAME_LANE_EXTERNAL_ANCHOR_PROFILE_SPLIT_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_232_same_lane_external_anchor_profile_split_packet/1');
  assert.equal(packet.status, 'same_lane_external_anchor_232_terminal_profile_split_emitted');
  assert.equal(packet.profileSummary.continuation, 232);
  assert.equal(packet.profileSummary.familyIndex, 275);
  assert.equal(packet.profileSummary.targetContinuation, 782);
  assert.equal(packet.profileSummary.activationAnchor, 32);
  assert.equal(packet.profileSummary.plus50Alignment, true);
  assert.equal(packet.profileSummary.inCurrentHandoffSurface, false);
  assert.equal(packet.profileSummary.repairedPredictedFamilyCount, 201);
  assert.equal(packet.profileSummary.finiteSupportDeficitToTopTie, 41);

  assert.equal(packet.family275Certificate.sameLaneExternalRepairRow.anchor, 232);
  assert.equal(packet.family275Certificate.sameLaneExternalRepairRow.squarefree, true);
  assert.equal(packet.family275Certificate.targetRepairRow.anchor, 782);
  assert.equal(packet.family275Certificate.targetRepairRow.squarefree, false);
  assert.equal(packet.family275Certificate.targetRepairRow.squareWitnesses[0].squareModulus, 9);

  assert.equal(packet.routeDecision.sameLaneIrrelevanceTheorem, 'not_proved');
  assert.equal(packet.routeDecision.expandedHandoffSurface, 'not_taken');
  assert.equal(packet.routeDecision.terminalProfileSplit, 'emitted_for_family_275');
  assert.deepEqual(packet.remainingObligations.map((obligation) => obligation.obligationId), [
    'same_family_companion_cover_for_382_832',
    'universal_mod50_square_witness_domain_cover',
  ]);
  assert.equal(packet.recommendedNextAction, 'cover_p848_mod50_382_832_same_family_companion_gaps_or_emit_terminal_profiles');
  assert.equal(packet.claims.emitsDedicated232TerminalProfileSplit, true);
  assert.equal(packet.claims.proves232Irrelevance, false);
  assert.equal(packet.claims.expandsHandoffSurface, false);
  assert.equal(packet.claims.justifies40501PlusRollout, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 382/832 companion gaps emit terminal profiles', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_382_832_COMPANION_GAP_PROFILE_SPLIT_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_382_832_companion_gap_profile_split_packet/1');
  assert.equal(packet.status, 'same_family_companion_gaps_terminal_profile_split_emitted');
  assert.equal(packet.companionGapSummary.checkedGapCount, 3);
  assert.equal(packet.companionGapSummary.checkedFamilyCount, 2);
  assert.deepEqual(packet.companionGapSummary.familyIndices, [75, 161]);
  assert.deepEqual(packet.companionGapSummary.continuations, [382, 832]);
  assert.equal(packet.companionGapSummary.primaryContrastGapCount, 2);
  assert.equal(packet.companionGapSummary.topTieNonTargetGapCount, 1);
  assert.equal(packet.companionGapSummary.allRepairRowsSquarefree, true);
  assert.equal(packet.companionGapSummary.allTargetRowsSquareBlocked, true);
  assert.equal(packet.companionGapSummary.sameFamilyObservedCompanionCountTotal, 0);

  assert.equal(packet.terminalProfiles.length, 3);
  assert.deepEqual(packet.terminalProfiles.map((profile) => profile.profileId), [
    'same_family_companion_382_family_75',
    'same_family_companion_382_family_161',
    'same_family_companion_832_family_161',
  ]);
  for (const profile of packet.terminalProfiles) {
    assert.equal(profile.repairRow.squarefree, true);
    assert.equal(profile.targetRepairRow.squarefree, false);
  }

  assert.equal(packet.routeDecision.sameFamilyCompanionTheorem, 'not_proved');
  assert.equal(packet.routeDecision.terminalProfileSplit, 'emitted_for_all_observed_382_832_companion_gaps');
  assert.deepEqual(packet.remainingObligations.map((obligation) => obligation.obligationId), [
    'universal_mod50_square_witness_domain_cover',
    'contrast_only_and_global_recombination',
  ]);
  assert.equal(packet.recommendedNextAction, 'assemble_p848_mod50_observed_profile_closure_or_prove_universal_domain_cover');
  assert.equal(packet.claims.closesObservedTopOnlyNonFirstTargetProfileGaps, true);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.justifies40501PlusRollout, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 observed profile closure leaves universal cover open', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_OBSERVED_PROFILE_CLOSURE_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_observed_profile_closure_packet/1');
  assert.equal(packet.status, 'observed_mod50_profile_closure_assembled_universal_cover_open');
  assert.equal(packet.observedWitnessDomain.finiteWitnessInstanceCount, 74);
  assert.equal(packet.observedWitnessDomain.qBadResidueGroupCount, 15);
  assert.equal(packet.observedWitnessDomain.topOnly.groupCount, 7);
  assert.equal(packet.observedWitnessDomain.topOnly.instanceCount, 28);
  assert.equal(packet.observedWitnessDomain.topOnly.closedGroupCount, 7);
  assert.equal(packet.observedWitnessDomain.contrastOnly.groupCount, 11);
  assert.equal(packet.observedWitnessDomain.contrastOnly.instanceCount, 46);

  assert.equal(packet.assembledClosure.observedTopOnlyProfileClosure, 'assembled');
  assert.equal(packet.assembledClosure.allObservedTopOnlyGroupsAccounted, true);
  assert.equal(packet.assembledClosure.allObservedNonFirstTargetActivationGapsAccounted, true);
  assert.equal(packet.assembledClosure.uses40501PlusRollout, false);
  assert.equal(packet.routeDecision.universalSquareWitnessDomainCoverTheorem, 'not_proved');
  assert.equal(packet.routeDecision.residualCounterfamilyBoundary, 'emitted');
  assert.equal(packet.residualBoundary.boundaryId, 'p848_mod50_universal_square_witness_domain_cover_residual');
  assert.deepEqual(packet.remainingObligations.map((obligation) => obligation.obligationId), [
    'universal_mod50_square_witness_domain_cover',
    'contrast_only_recombination_surface',
    'post_40500_sufficiency_or_regression_interval',
  ]);

  assert.equal(packet.recommendedNextAction, 'derive_p848_mod50_universal_square_witness_domain_cover_or_emit_residual_counterfamily');
  assert.equal(packet.claims.assemblesObservedMod50ProfileClosure, true);
  assert.equal(packet.claims.allObservedTopOnlyGroupsAccounted, true);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.closesContrastOnlyRecombination, false);
  assert.equal(packet.claims.justifies40501PlusRollout, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 universal domain cover residual names missing enumerator', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_UNIVERSAL_DOMAIN_COVER_RESIDUAL_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_universal_domain_cover_residual_packet/1');
  assert.equal(packet.status, 'universal_mod50_square_witness_domain_cover_blocked_by_missing_parametric_enumerator');
  assert.equal(packet.theoremAttempt.theoremId, 'p848_mod50_universal_square_witness_domain_cover_v1');
  assert.equal(packet.theoremAttempt.result, 'blocked_not_proved');
  assert.equal(packet.localAudit.restoredFamilyMenu.familyCount, 280);
  assert.equal(packet.localAudit.restoredFamilyMenu.knownFailureMatches, 25);
  assert.equal(packet.localAudit.observedWitnessDomain.finiteWitnessInstanceCount, 74);
  assert.equal(packet.localAudit.observedWitnessDomain.closedTopOnlyGroupCount, 7);
  assert.equal(packet.localAudit.observedWitnessDomain.contrastOnlyGroupCount, 11);

  assert.equal(packet.residualFamily.continuationFormula, 'c = 32 + 50*m');
  assert.equal(packet.residualFamily.badLaneDenominator, 'Q / gcd(50*n, Q)');
  assert.deepEqual(packet.missingHypotheses.map((hypothesis) => hypothesis.hypothesisId), [
    'parametric_relevant_pair_enumerator',
    'square_witness_modulus_bound_or_finite_partition',
    'bad_lane_class_handoff_map',
    'contrast_only_recombination_theorem',
    'post_40500_sufficiency_or_regression_interval',
  ]);

  assert.equal(packet.deterministicBoundary.boundaryId, 'p848_mod50_universal_domain_cover_parametric_enumerator_boundary');
  assert.equal(packet.recommendedNextAction, 'derive_p848_mod50_relevant_pair_enumerator_or_emit_generator_blocker');
  assert.equal(packet.claims.blocksUniversalDomainCover, true);
  assert.equal(packet.claims.namesBadLaneDenominator, true);
  assert.equal(packet.claims.uses40501PlusRollout, false);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.closesContrastOnlyRecombination, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 relevant-pair enumerator blocker names finite source boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_RELEVANT_PAIR_ENUMERATOR_GENERATOR_BLOCKER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_relevant_pair_enumerator_generator_blocker_packet/1');
  assert.equal(packet.status, 'parametric_mod50_relevant_pair_enumerator_blocked_generator_absent');
  assert.equal(packet.blockedObject.objectId, 'p848_mod50_parametric_relevant_pair_enumerator');
  assert.deepEqual(packet.blockedObject.requiredOutputShape, [
    'A parametric formula or recurrence for representatives n.',
    'A finite or recursively generated set of possible square witness moduli Q.',
    'For each pair (n,Q), the bad-lane denominator Q/gcd(50*n,Q).',
    'A handoff label proving how the bad lane is avoided, top-tie repaired, contrast-only repaired, or terminally blocked.',
  ]);

  assert.equal(packet.localAudit.finiteRestoredMenus.length, 6);
  assert.deepEqual(packet.localAudit.finiteRestoredMenus.map((menu) => menu.familyCount), [220, 230, 240, 250, 260, 280]);
  assert.equal(packet.localAudit.richestFiniteMenuPairSurface.familyCount, 280);
  assert.equal(packet.localAudit.richestFiniteMenuPairSurface.repairRowCount, 2240);
  assert.equal(packet.localAudit.richestFiniteMenuPairSurface.witnessRepairRowCount, 295);
  assert.equal(packet.localAudit.richestFiniteMenuPairSurface.lane32WitnessRepairRowCount, 139);
  assert.deepEqual(packet.localAudit.richestFiniteMenuPairSurface.lane32Continuations, [232, 282, 332, 382, 432, 782, 832]);
  assert.deepEqual(packet.localAudit.richestFiniteMenuPairSurface.lane32DistinctWitnessSquares, [
    9,
    25,
    49,
    121,
    169,
    289,
    361,
    529,
    841,
    1681,
    4489,
    44521,
    66049,
  ]);

  assert.equal(packet.finiteEvidenceUsableNext.status, 'usable_for_sequence_recurrence_audit_not_universal_cover');
  assert.match(packet.finiteEvidenceUsableNext.sequenceGap, /jumps from 260 to 280 rows/);
  assert.equal(packet.deterministicBoundary.boundaryId, 'p848_mod50_relevant_pair_enumerator_source_boundary');
  assert.equal(
    packet.recommendedNextAction,
    'audit_p848_mod50_restored_menu_sequence_for_relevant_pair_recurrence_or_emit_stability_blocker',
  );
  assert.equal(packet.claims.auditsLocalEnumeratorSource, true);
  assert.equal(packet.claims.provesFiniteMenuConsumerExists, true);
  assert.equal(packet.claims.provesParametricEnumeratorAbsentLocally, true);
  assert.equal(packet.claims.namesFinitePairSurfaceForNextAudit, true);
  assert.equal(packet.claims.uses40501PlusRollout, false);
  assert.equal(packet.claims.provesRelevantPairEnumerator, false);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.closesContrastOnlyRecombination, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-successor 26-bucket q-avoiding batch cover closes without survivors', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_POST_POST_POST_SUCCESSOR_26_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedPrimes = [
    163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
    233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307,
    311, 313, 331,
  ];
  const expectedNextAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover';

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover/1');
  assert.equal(packet.status, 'all_26_bucket_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child');
  assert.equal(packet.target, 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover_or_emit_boundary');
  assert.equal(packet.recommendedNextAction, expectedNextAction);

  assert.equal(packet.batchCoverSummary.sourcePostPostPostSuccessorBucketCount, 26);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.sourcePostPostPostSuccessorQAvoidingClassCount, '17122811411360928250603246815478193773776015');
  assert.equal(packet.batchCoverSummary.classifiedPostPostPostSuccessorQAvoidingClassCount, '17122811411360928250603246815478193773776015');
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.batchCoverSummary.postPostPostPostSuccessorObstructionPrimeBucketCount, 29);
  assert.equal(packet.batchCoverSummary.minPostPostPostPostSuccessorObstructionPrime, 163);
  assert.equal(packet.batchCoverSummary.maxPostPostPostPostSuccessorObstructionPrime, 331);
  assert.deepEqual(packet.batchCoverSummary.postPostPostPostSuccessorRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalPostPostPostPostSuccessorRootChildCount, '34245622822721856501206493630956387547552030');
  assert.equal(packet.batchCoverSummary.totalPostPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');

  assert.deepEqual(
    packet.postPostPostPostSuccessorObstructionPrimeBuckets.map((bucket) => bucket.postPostPostPostSuccessorObstructionPrime),
    expectedPrimes,
  );
  assert.equal(packet.postPostPostPostSuccessorObstructionPrimeBuckets.length, 29);
  assert.ok(packet.postPostPostPostSuccessorObstructionPrimeBuckets.every((bucket) => bucket.status === 'open_exact_two_root_post_post_post_post_successor_rank_boundary'));
  assert.ok(packet.postPostPostPostSuccessorObstructionPrimeBuckets.every((bucket) => bucket.rootResidueCountsPerClass.length === 1 && bucket.rootResidueCountsPerClass[0] === 2));
  assert.equal(packet.rowClassifications.length, 718);
  assert.ok(packet.rowClassifications.every((row) => row.postPostPostPostSuccessorRootResidueCount === 2));
  assert.ok(packet.rowClassifications.every((row) => row.postPostPostPostSuccessorObstructionPrime > row.postPostPostSuccessorObstructionPrime));

  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.tokenId, 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover');
  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.status, 'consumed_by_row_uniform_post_post_post_post_successor_obstruction_batch_cover');
  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_root_children').rootChildCount,
    '34245622822721856501206493630956387547552030',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_q_avoiding_boundary').qAvoidingClassCount,
    '1256125158212428260162381710030390124682911240345',
  );

  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.match(packet.oneNextAction.coveredFamily, /29 post-post-post-post-successor/);
  assert.match(packet.oneNextAction.coveredFamily, /125612515821242826016238171/);

  assert.equal(packet.claims.consumes26BucketPostPostPostSuccessorQAvoidingToken, true);
  assert.equal(packet.claims.classifiesAll26SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllPostPostPostSuccessorQAvoidingClasses, true);
  assert.equal(packet.claims.survivorPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.claims.allRowsHaveTwoPostPostPostPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsTwentyNinePostPostPostPostSuccessorPrimeBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ163Singleton, false);
  assert.equal(packet.claims.descendsIntoQ167Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-next 20-bucket successor 22-bucket q-avoiding batch cover is exact and nonterminal', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover/1',
  );
  assert.equal(packet.status, 'all_22_bucket_successor_q_avoiding_classes_have_later_square_obstruction_child');
  assert.equal(
    packet.target,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );
  assert.equal(packet.batchCoverSummary.sourceSuccessorBucketCount, 22);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.sourceSuccessorQAvoidingClassCount, '111172518226866898571161320153');
  assert.equal(packet.batchCoverSummary.classifiedSuccessorQAvoidingClassCount, '111172518226866898571161320153');
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.batchCoverSummary.postSuccessorObstructionPrimeBucketCount, 24);
  assert.equal(packet.batchCoverSummary.minPostSuccessorObstructionPrime, 149);
  assert.equal(packet.batchCoverSummary.maxPostSuccessorObstructionPrime, 277);
  assert.deepEqual(packet.batchCoverSummary.postSuccessorRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalPostSuccessorRootChildCount, '222345036453733797142322640306');
  assert.equal(packet.batchCoverSummary.totalPostSuccessorQAvoidingClassCount, '5058399114142580922880572195875967');

  assert.equal(packet.postSuccessorObstructionPrimeBuckets.length, 24);
  assert.deepEqual(
    packet.postSuccessorObstructionPrimeBuckets.map((bucket) => bucket.postSuccessorObstructionPrime),
    [149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 277],
  );
  assert.ok(packet.postSuccessorObstructionPrimeBuckets.every((bucket) => bucket.rootResidueCountsPerClass.length === 1 && bucket.rootResidueCountsPerClass[0] === 2));
  assert.equal(packet.rowClassifications.length, 718);
  assert.ok(packet.rowClassifications.every((row) => row.postSuccessorRootResidueCount === 2));
  assert.ok(packet.rowClassifications.every((row) => row.postSuccessorObstructionPrime > row.successorObstructionPrime));

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    packet.finiteTokenTransition.consumedFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_root_children').rootChildCount,
    '222345036453733797142322640306',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_q_avoiding_boundary').qAvoidingClassCount,
    '5058399114142580922880572195875967',
  );

  assert.equal(
    packet.oneNextAction.stepId,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover',
  );
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover',
  );
  assert.match(packet.oneNextAction.coveredFamily, /24 post-successor/);

  assert.equal(packet.claims.consumes22BucketSuccessorQAvoidingToken, true);
  assert.equal(packet.claims.classifiesAll22SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllSuccessorQAvoidingClasses, true);
  assert.equal(packet.claims.survivorSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.claims.allRowsHaveTwoPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsTwentyFourPostSuccessorPrimeBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ139Singleton, false);
  assert.equal(packet.claims.descendsIntoQ149Singleton, false);
  assert.equal(packet.claims.descendsIntoQ151Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-22-bucket successor q-avoiding convergence assembly selects the 24-bucket post-successor rank token', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover_convergence_assembly_selects_24_bucket_post_successor_rank_compression',
  );
  assert.equal(
    packet.target,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.coversPrimaryNextAction.status, 'covered_by_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover_convergence_assembly');
  assert.equal(packet.sourcePackets.length, 3);
  assert.equal(packet.frontierComparison.previousRefreshValueBefore22BucketSuccessorQAvoidingCover, 60);
  assert.equal(packet.frontierComparison.currentRefreshValueAfter22BucketSuccessorQAvoidingCover, 61);
  assert.equal(packet.frontierComparison.delta, 1);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceSuccessorBucketCount, 22);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceSuccessorQAvoidingClassCount, '111172518226866898571161320153');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorSuccessorQAvoidingClassCount, '0');
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_rank_boundary',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 24);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postSuccessorRootChildCount, '222345036453733797142322640306');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postSuccessorQAvoidingClassCount, '5058399114142580922880572195875967');

  assert.equal(packet.postSuccessorBucketSummary.bucketCount, 24);
  assert.deepEqual(
    packet.postSuccessorBucketSummary.postSuccessorPrimes,
    [149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 277],
  );
  assert.equal(packet.postSuccessorBucketSummary.sourceSuccessorBucketCount, 22);
  assert.equal(packet.postSuccessorBucketSummary.sourceRowCount, 718);
  assert.equal(packet.postSuccessorBucketSummary.sourceSuccessorQAvoidingClassCount, '111172518226866898571161320153');
  assert.equal(packet.postSuccessorBucketSummary.survivorSuccessorQAvoidingClassCount, '0');
  assert.deepEqual(packet.postSuccessorBucketSummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.postSuccessorBucketSummary.postSuccessorRootChildCount, '222345036453733797142322640306');
  assert.equal(packet.postSuccessorBucketSummary.postSuccessorQAvoidingClassCount, '5058399114142580922880572195875967');

  assert.equal(
    packet.oneNextAction.stepId,
    'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_buckets_or_emit_rank_boundary',
  );
  assert.equal(
    packet.recommendedNextAction,
    'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_buckets_or_emit_rank_boundary',
  );
  assert.match(packet.oneNextAction.coveredFamily, /All 24 post-successor buckets/);
  assert.equal(packet.oneVerificationCommand, 'node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js');

  assert.equal(packet.claims.runsPost22BucketSuccessorQAvoidingBatchCoverConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPost22BucketSuccessorQAvoidingCoverAssemblyDecisionToken, true);
  assert.equal(packet.claims.selects24BucketCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll24PostSuccessorBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ149Singleton, false);
  assert.equal(packet.claims.descendsIntoQ151Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-successor 24-bucket rank boundary is exact and nonterminal', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedPrimes = [149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 277];

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_rank_boundary/1',
  );
  assert.equal(
    packet.status,
    'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_deterministic_rank_boundary_emitted',
  );
  assert.equal(
    packet.target,
    'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_buckets_or_emit_rank_boundary',
  );

  assert.equal(packet.boundarySummary.sourceSuccessorBucketCount, 22);
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourceSuccessorQAvoidingClassCount, '111172518226866898571161320153');
  assert.equal(packet.boundarySummary.postSuccessorObstructionPrimeBucketCount, 24);
  assert.deepEqual(packet.boundarySummary.postSuccessorObstructionPrimes, expectedPrimes);
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalPostSuccessorRootChildCount, '222345036453733797142322640306');
  assert.equal(packet.boundarySummary.totalPostSuccessorQAvoidingClassCount, '5058399114142580922880572195875967');
  assert.equal(packet.boundarySummary.survivorSourceRowCount, 0);
  assert.equal(packet.boundarySummary.survivorSuccessorQAvoidingClassCount, '0');

  assert.equal(
    packet.deterministicRankBoundary.consumedFiniteToken,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_rank_boundary',
  );
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokenCount, 24);
  assert.equal(packet.postSuccessorPrimeBuckets.length, 24);
  assert.deepEqual(
    packet.postSuccessorPrimeBuckets.map((bucket) => bucket.postSuccessorObstructionPrime),
    expectedPrimes,
  );
  assert.ok(packet.postSuccessorPrimeBuckets.every((bucket) => bucket.status === 'open_exact_two_root_post_successor_rank_boundary'));
  assert.ok(packet.postSuccessorPrimeBuckets.every((bucket) => bucket.rootResidueCountsPerClass.length === 1 && bucket.rootResidueCountsPerClass[0] === 2));

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_root_children')?.rootChildCount,
    '222345036453733797142322640306',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover')?.qAvoidingClassCount,
    '5058399114142580922880572195875967',
  );
  assert.equal(
    packet.finiteTokenTransition.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.bucketCount, 24);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.qAvoidingClassCount, '5058399114142580922880572195875967');

  assert.equal(
    packet.oneNextAction.stepId,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );
  assert.equal(packet.recommendedNextAction, packet.oneNextAction.stepId);
  assert.match(packet.oneNextAction.coveredFamily, /5,058,399,114,142,580,922,880,572,195,875,967/);
  assert.match(packet.oneNextAction.completionRule, /Every one of the 24 post-successor q-avoiding buckets/);

  assert.equal(packet.claims.consumesPost22BucketSuccessorQAvoiding24BucketPostSuccessorRankToken, true);
  assert.equal(packet.claims.accountsForAll24PostSuccessorBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsExactDeterministic24BucketPostSuccessorRankBoundary, true);
  assert.equal(packet.claims.selectsWholeBoundaryBatchCoverNext, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ149Singleton, false);
  assert.equal(packet.claims.descendsIntoQ151Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-successor 24-bucket rank-boundary convergence assembly selects the whole q-avoiding cover', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_rank_boundary_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_rank_boundary_convergence_assembly_selects_24_bucket_q_avoiding_cover',
  );
  assert.equal(
    packet.coversPrimaryNextAction.stepId,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );
  assert.equal(packet.sourcePackets.length, 2);
  assert.equal(packet.frontierComparison.previousRefreshValueBefore24BucketRankBoundary, 62);
  assert.equal(packet.frontierComparison.currentRefreshValueAfter24BucketRankBoundary, 63);
  assert.equal(packet.frontierComparison.delta, 1);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_rank_boundary',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postSuccessorObstructionPrimeBucketCount, 24);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postSuccessorRootChildCount, '222345036453733797142322640306');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postSuccessorQAvoidingClassCount, '5058399114142580922880572195875967');
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 24);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.qAvoidingClassCount, '5058399114142580922880572195875967');

  assert.equal(packet.assembledPieces.length, 4);
  assert.match(packet.supportedClaim, /whole-boundary q-avoiding batch cover/);
  assert.match(packet.compressionCandidate.statement, /row-uniform CRT\/root-count machinery/);
  assert.match(packet.remainingPuzzleBoundary.openBoundary, /5,058,399,114,142,580,922,880,572,195,875,967/);

  assert.equal(packet.oneNextAction.stepId, packet.coversPrimaryNextAction.stepId);
  assert.equal(packet.recommendedNextAction, packet.coversPrimaryNextAction.stepId);
  assert.match(packet.oneNextAction.coveredFamily, /q in \{149,151,157/);
  assert.match(packet.oneNextAction.whyCheaperThanSingleSelector, /whole-boundary batch attempt/);
  assert.equal(packet.oneVerificationCommand, 'node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js');

  assert.equal(packet.claims.runsPostSuccessor24BucketRankBoundaryConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostSuccessor24BucketRankBoundaryAssemblyDecisionToken, true);
  assert.equal(packet.claims.selects24BucketQAvoidingBatchCoverInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll24PostSuccessorBuckets, true);
  assert.equal(packet.claims.namesWholeCoveredFamily, true);
  assert.equal(packet.claims.namesFiniteRankToken, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ149Singleton, false);
  assert.equal(packet.claims.descendsIntoQ151Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-successor 24-bucket q-avoiding batch cover closes with zero survivors', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedPrimes = [151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 283];

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover/1',
  );
  assert.equal(
    packet.status,
    'all_24_bucket_post_successor_q_avoiding_classes_have_later_square_obstruction_child',
  );
  assert.equal(
    packet.target,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover',
  );

  assert.equal(packet.inputRankToken.tokenId, 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover');
  assert.equal(packet.inputRankToken.bucketCount, 24);
  assert.equal(packet.inputRankToken.qAvoidingClassCount, '5058399114142580922880572195875967');
  assert.equal(packet.batchCoverSummary.sourcePostSuccessorBucketCount, 24);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.sourcePostSuccessorQAvoidingClassCount, '5058399114142580922880572195875967');
  assert.equal(packet.batchCoverSummary.classifiedPostSuccessorQAvoidingClassCount, '5058399114142580922880572195875967');
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.batchCoverSummary.postPostSuccessorObstructionPrimeBucketCount, 24);
  assert.equal(packet.batchCoverSummary.minPostPostSuccessorObstructionPrime, 151);
  assert.equal(packet.batchCoverSummary.maxPostPostSuccessorObstructionPrime, 283);
  assert.deepEqual(packet.batchCoverSummary.postPostSuccessorRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalPostPostSuccessorRootChildCount, '10116798228285161845761144391751934');
  assert.equal(packet.batchCoverSummary.totalPostPostSuccessorQAvoidingClassCount, '272895494027351286884102031165661158393');

  assert.equal(packet.postPostSuccessorObstructionPrimeBuckets.length, 24);
  assert.deepEqual(
    packet.postPostSuccessorObstructionPrimeBuckets.map((bucket) => bucket.postPostSuccessorObstructionPrime),
    expectedPrimes,
  );
  assert.ok(packet.postPostSuccessorObstructionPrimeBuckets.every((bucket) => bucket.status === 'open_exact_two_root_post_post_successor_rank_boundary'));
  assert.ok(packet.postPostSuccessorObstructionPrimeBuckets.every((bucket) => bucket.rootResidueCountsPerClass.length === 1 && bucket.rootResidueCountsPerClass[0] === 2));
  assert.equal(packet.rowClassifications.length, 718);
  assert.ok(packet.rowClassifications.every((row) => row.postPostSuccessorRootResidueCount === 2));

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_root_children')?.rootChildCount,
    '10116798228285161845761144391751934',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_q_avoiding_boundary')?.qAvoidingClassCount,
    '272895494027351286884102031165661158393',
  );

  assert.equal(packet.oneNextAction.stepId, packet.recommendedNextAction);
  assert.match(packet.oneNextAction.coveredFamily, /24 post-post-successor obstruction-prime buckets/);
  assert.match(packet.oneNextAction.failureBoundary, /emit a deterministic ranked boundary packet over all 24 post-post-successor buckets/);
  assert.match(packet.proofMechanism.statement, /y\*\(y\+delta\)\+1 modulo s\^2/);
  assert.match(packet.proofBoundary, /does not close the 10,116,798,228,285,161,845,761,144,391,751,934 post-post-successor root children/);

  assert.equal(packet.claims.consumes24BucketPostSuccessorQAvoidingToken, true);
  assert.equal(packet.claims.classifiesAll24SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllSourceRows, true);
  assert.equal(packet.claims.classifiesAllPostSuccessorQAvoidingClasses, true);
  assert.equal(packet.claims.survivorSourceRowCount, 0);
  assert.equal(packet.claims.survivorPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.claims.allRowsHaveTwoPostPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsTwentyFourPostPostSuccessorPrimeBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ149Singleton, false);
  assert.equal(packet.claims.descendsIntoQ151Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-successor 24-bucket q-avoiding cover convergence assembly selects post-post rank compression', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedPrimes = [151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 283];
  const expectedNextAction = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_buckets_or_emit_rank_boundary';

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover_convergence_assembly_selects_24_bucket_post_post_successor_rank_compression',
  );
  assert.equal(
    packet.target,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.coversPrimaryNextAction.stepId, packet.target);
  assert.equal(packet.sourcePackets.length, 3);
  assert.equal(packet.frontierComparison.previousRefreshValueBefore24BucketPostSuccessorQAvoidingCover, 63);
  assert.equal(packet.frontierComparison.currentRefreshValueAfter24BucketPostSuccessorQAvoidingCover, 64);
  assert.equal(packet.frontierComparison.delta, 1);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostSuccessorBucketCount, 24);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostSuccessorQAvoidingClassCount, '5058399114142580922880572195875967');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorPostSuccessorQAvoidingClassCount, '0');
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_rank_boundary',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 24);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostSuccessorRootChildCount, '10116798228285161845761144391751934');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostSuccessorQAvoidingClassCount, '272895494027351286884102031165661158393');

  assert.equal(packet.postPostSuccessorBucketSummary.bucketCount, 24);
  assert.deepEqual(packet.postPostSuccessorBucketSummary.postPostSuccessorPrimes, expectedPrimes);
  assert.equal(packet.postPostSuccessorBucketSummary.sourcePostSuccessorBucketCount, 24);
  assert.equal(packet.postPostSuccessorBucketSummary.sourceRowCount, 718);
  assert.equal(packet.postPostSuccessorBucketSummary.sourcePostSuccessorQAvoidingClassCount, '5058399114142580922880572195875967');
  assert.deepEqual(packet.postPostSuccessorBucketSummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.postPostSuccessorBucketSummary.postPostSuccessorRootChildCount, '10116798228285161845761144391751934');
  assert.equal(packet.postPostSuccessorBucketSummary.postPostSuccessorQAvoidingClassCount, '272895494027351286884102031165661158393');

  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.match(packet.oneNextAction.coveredFamily, /All 24 post-post-successor buckets/);
  assert.match(packet.oneNextAction.failureBoundary, /deterministic ranked boundary packet over all 24 post-post-successor buckets/);
  assert.equal(packet.oneVerificationCommand, 'node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js');

  assert.equal(packet.claims.runsPostSuccessor24BucketQAvoidingBatchCoverConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostSuccessor24BucketQAvoidingCoverAssemblyDecisionToken, true);
  assert.equal(packet.claims.selects24BucketPostPostSuccessorCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll24PostPostSuccessorBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ151Singleton, false);
  assert.equal(packet.claims.descendsIntoQ157Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-successor 24-bucket deterministic rank boundary is emitted', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedPrimes = [151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 283];
  const expectedNextAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary';

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_rank_boundary/1',
  );
  assert.equal(
    packet.status,
    'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_deterministic_rank_boundary_emitted',
  );
  assert.equal(
    packet.target,
    'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_buckets_or_emit_rank_boundary',
  );
  assert.equal(packet.recommendedNextAction, expectedNextAction);

  assert.equal(packet.boundarySummary.sourcePostSuccessorBucketCount, 24);
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourcePostSuccessorQAvoidingClassCount, '5058399114142580922880572195875967');
  assert.equal(packet.boundarySummary.postPostSuccessorObstructionPrimeBucketCount, 24);
  assert.deepEqual(packet.boundarySummary.postPostSuccessorObstructionPrimes, expectedPrimes);
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalPostPostSuccessorRootChildCount, '10116798228285161845761144391751934');
  assert.equal(packet.boundarySummary.totalPostPostSuccessorQAvoidingClassCount, '272895494027351286884102031165661158393');
  assert.equal(packet.boundarySummary.survivorSourceRowCount, 0);
  assert.equal(packet.boundarySummary.survivorPostSuccessorQAvoidingClassCount, '0');

  assert.equal(packet.deterministicRankBoundary.producedFiniteTokenCount, 24);
  assert.equal(packet.postPostSuccessorPrimeBuckets.length, 24);
  assert.deepEqual(
    packet.postPostSuccessorPrimeBuckets.map((bucket) => bucket.postPostSuccessorObstructionPrime),
    expectedPrimes,
  );
  assert.ok(packet.postPostSuccessorPrimeBuckets.every((bucket) => bucket.status === 'open_exact_two_root_post_post_successor_rank_boundary'));
  assert.ok(packet.postPostSuccessorPrimeBuckets.every((bucket) => bucket.rootResidueCountsPerClass.length === 1 && bucket.rootResidueCountsPerClass[0] === 2));
  assert.equal(packet.postPostSuccessorPrimeBuckets[0].sourceRowCount, 3);
  assert.deepEqual(packet.postPostSuccessorPrimeBuckets[0].previousPostSuccessorPrimeBuckets.map((bucket) => bucket.previousPostSuccessorObstructionPrime), [149]);
  assert.equal(packet.postPostSuccessorPrimeBuckets.at(-1).postPostSuccessorObstructionPrime, 283);
  assert.deepEqual(packet.postPostSuccessorPrimeBuckets.at(-1).previousPostSuccessorPrimeBuckets.map((bucket) => bucket.previousPostSuccessorObstructionPrime), [241, 277]);

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_root_children')?.rootChildCount,
    '10116798228285161845761144391751934',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover')?.qAvoidingClassCount,
    '272895494027351286884102031165661158393',
  );
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.tokenId, 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover');
  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.match(packet.oneNextAction.failureBoundary, /do not open a singleton q-child first/);
  assert.match(packet.proofBoundary, /does not close the 10,116,798,228,285,161,845,761,144,391,751,934 post-post-successor root children/);

  assert.equal(packet.claims.consumesPostSuccessor24BucketQAvoidingCoverAssemblyRankToken, true);
  assert.equal(packet.claims.accountsForAll24PostPostSuccessorBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoPostPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsExactDeterministic24BucketPostPostSuccessorRankBoundary, true);
  assert.equal(packet.claims.selectsWholeBoundaryBatchCoverNext, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ151Singleton, false);
  assert.equal(packet.claims.descendsIntoQ157Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-successor 24-bucket rank boundary convergence assembly selects q-avoiding cover', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedPrimes = [151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 283];
  const expectedNextAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary';

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_rank_boundary_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_rank_boundary_convergence_assembly_selects_24_bucket_q_avoiding_cover',
  );
  assert.equal(
    packet.target,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_rank_boundary',
  );
  assert.equal(packet.coversPrimaryNextAction.stepId, expectedNextAction);
  assert.equal(packet.sourcePackets.length, 2);
  assert.equal(packet.frontierComparison.previousRefreshValueBefore24BucketPostPostSuccessorRankBoundary, 64);
  assert.equal(packet.frontierComparison.currentRefreshValueAfter24BucketPostPostSuccessorRankBoundary, 66);
  assert.equal(packet.frontierComparison.delta, 2);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_rank_boundary',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostSuccessorObstructionPrimeBucketCount, 24);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostSuccessorRootChildCount, '10116798228285161845761144391751934');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostSuccessorQAvoidingClassCount, '272895494027351286884102031165661158393');
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 24);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.qAvoidingClassCount, '272895494027351286884102031165661158393');

  assert.equal(packet.assembledPieces.length, 4);
  assert.match(packet.assembledPieces[1].claim, /151,157,163/);
  assert.match(packet.assembledPieces[1].claim, /271,283/);
  assert.deepEqual(
    packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostSuccessorObstructionPrimeBucketCount === expectedPrimes.length
      ? expectedPrimes
      : [],
    expectedPrimes,
  );
  assert.match(packet.supportedClaim, /whole-boundary q-avoiding batch cover/);
  assert.match(packet.compressionCandidate.statement, /row-uniform CRT\/root-count machinery/);
  assert.match(packet.remainingPuzzleBoundary.openBoundary, /272,895,494,027,351/);

  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.match(packet.oneNextAction.coveredFamily, /All 272,895,494,027,351/);
  assert.match(packet.oneNextAction.failureBoundary, /do not open q151\/q157 singleton descent first/);
  assert.equal(packet.oneVerificationCommand, 'node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js');

  assert.equal(packet.claims.runsPostPostSuccessor24BucketRankBoundaryConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostPostSuccessor24BucketRankBoundaryAssemblyDecisionToken, true);
  assert.equal(packet.claims.selects24BucketPostPostSuccessorQAvoidingCoverInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll24PostPostSuccessorBuckets, true);
  assert.equal(packet.claims.namesWholeCoveredFamily, true);
  assert.equal(packet.claims.namesFiniteRankToken, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ151Singleton, false);
  assert.equal(packet.claims.descendsIntoQ157Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-successor 24-bucket q-avoiding cover emits post-post-post boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedPrimes = [157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 293, 307];
  const expectedNextAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover';

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover/1',
  );
  assert.equal(
    packet.status,
    'all_24_bucket_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child',
  );
  assert.equal(
    packet.target,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );
  assert.equal(packet.recommendedNextAction, expectedNextAction);

  assert.equal(packet.inputRankToken.tokenId, 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover');
  assert.equal(packet.inputRankToken.bucketCount, 24);
  assert.equal(packet.inputRankToken.qAvoidingClassCount, '272895494027351286884102031165661158393');
  assert.equal(packet.batchCoverSummary.sourcePostPostSuccessorBucketCount, 24);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.sourcePostPostSuccessorQAvoidingClassCount, '272895494027351286884102031165661158393');
  assert.equal(packet.batchCoverSummary.classifiedPostPostSuccessorQAvoidingClassCount, '272895494027351286884102031165661158393');
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.batchCoverSummary.postPostPostSuccessorObstructionPrimeBucketCount, 26);
  assert.equal(packet.batchCoverSummary.minPostPostPostSuccessorObstructionPrime, 157);
  assert.equal(packet.batchCoverSummary.maxPostPostPostSuccessorObstructionPrime, 307);
  assert.deepEqual(packet.batchCoverSummary.postPostPostSuccessorRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalPostPostPostSuccessorRootChildCount, '545790988054702573768204062331322316786');
  assert.equal(packet.batchCoverSummary.totalPostPostPostSuccessorQAvoidingClassCount, '17122811411360928250603246815478193773776015');

  assert.equal(packet.postPostPostSuccessorObstructionPrimeBuckets.length, 26);
  assert.deepEqual(
    packet.postPostPostSuccessorObstructionPrimeBuckets.map((bucket) => bucket.postPostPostSuccessorObstructionPrime),
    expectedPrimes,
  );
  assert.ok(packet.postPostPostSuccessorObstructionPrimeBuckets.every((bucket) => bucket.status === 'open_exact_two_root_post_post_post_successor_rank_boundary'));
  assert.ok(packet.postPostPostSuccessorObstructionPrimeBuckets.every((bucket) => bucket.rootResidueCountsPerClass.length === 1 && bucket.rootResidueCountsPerClass[0] === 2));
  assert.equal(packet.rowClassifications.length, 718);
  assert.ok(packet.rowClassifications.every((row) => row.postPostPostSuccessorRootResidueCount === 2));

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_root_children')?.rootChildCount,
    '545790988054702573768204062331322316786',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_q_avoiding_boundary')?.qAvoidingClassCount,
    '17122811411360928250603246815478193773776015',
  );

  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.match(packet.oneNextAction.coveredFamily, /26 post-post-post-successor obstruction-prime buckets/);
  assert.match(packet.oneNextAction.failureBoundary, /deterministic ranked boundary packet over all 26 post-post-post-successor buckets/);
  assert.match(packet.proofMechanism.statement, /y\*\(y\+delta\)\+1 modulo s\^2/);
  assert.match(packet.proofBoundary, /does not close the 545,790,988,054,702,573,768,204,062,331,322,316,786 post-post-post-successor root children/);

  assert.equal(packet.claims.consumes24BucketPostPostSuccessorQAvoidingToken, true);
  assert.equal(packet.claims.classifiesAll24SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllSourceRows, true);
  assert.equal(packet.claims.classifiesAllPostPostSuccessorQAvoidingClasses, true);
  assert.equal(packet.claims.survivorSourceRowCount, 0);
  assert.equal(packet.claims.survivorPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.claims.allRowsHaveTwoPostPostPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsTwentySixPostPostPostSuccessorPrimeBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ151Singleton, false);
  assert.equal(packet.claims.descendsIntoQ157Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-successor 24-bucket q-avoiding cover convergence assembly selects 26-bucket rank compression', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedPrimes = [157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 293, 307];
  const expectedTarget = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover';
  const expectedNextAction = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_buckets_or_emit_rank_boundary';
  const expectedClosedToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover';
  const expectedNextToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_rank_boundary';

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_q_avoiding_batch_cover_convergence_assembly_selects_26_bucket_post_post_post_successor_rank_compression',
  );
  assert.equal(packet.target, expectedTarget);
  assert.equal(packet.coversPrimaryNextAction.stepId, expectedTarget);
  assert.equal(packet.coversPrimaryNextAction.status, 'covered_by_post_post_successor_24_bucket_q_avoiding_batch_cover_convergence_assembly');
  assert.equal(packet.sourcePackets.length, 3);

  assert.equal(packet.frontierComparison.previousRefreshValueBefore24BucketPostPostSuccessorQAvoidingCover, 66);
  assert.equal(packet.frontierComparison.currentRefreshValueAfter24BucketPostPostSuccessorQAvoidingCover, 68);
  assert.equal(packet.frontierComparison.delta, 2);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.tokenId, 'post_post_successor_24_bucket_q_avoiding_batch_cover_convergence_assembly');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId, expectedClosedToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostPostSuccessorBucketCount, 24);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostPostSuccessorQAvoidingClassCount, '272895494027351286884102031165661158393');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostSuccessorObstructionPrimeBucketCount, 26);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostSuccessorRootChildCount, '545790988054702573768204062331322316786');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostSuccessorQAvoidingClassCount, '17122811411360928250603246815478193773776015');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, expectedNextToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 26);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostSuccessorRootChildCount, '545790988054702573768204062331322316786');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostSuccessorQAvoidingClassCount, '17122811411360928250603246815478193773776015');

  assert.equal(packet.postPostPostSuccessorBucketSummary.bucketCount, 26);
  assert.deepEqual(packet.postPostPostSuccessorBucketSummary.postPostPostSuccessorPrimes, expectedPrimes);
  assert.equal(packet.postPostPostSuccessorBucketSummary.sourcePostPostSuccessorBucketCount, 24);
  assert.equal(packet.postPostPostSuccessorBucketSummary.sourceRowCount, 718);
  assert.equal(packet.postPostPostSuccessorBucketSummary.sourcePostPostSuccessorQAvoidingClassCount, '272895494027351286884102031165661158393');
  assert.equal(packet.postPostPostSuccessorBucketSummary.survivorPostPostSuccessorQAvoidingClassCount, '0');
  assert.deepEqual(packet.postPostPostSuccessorBucketSummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.postPostPostSuccessorBucketSummary.postPostPostSuccessorRootChildCount, '545790988054702573768204062331322316786');
  assert.equal(packet.postPostPostSuccessorBucketSummary.postPostPostSuccessorQAvoidingClassCount, '17122811411360928250603246815478193773776015');

  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.match(packet.oneNextAction.coveredFamily, /All 26 post-post-post-successor buckets/);
  assert.match(packet.oneNextAction.failureBoundary, /deterministic ranked boundary packet over all 26/);
  assert.equal(packet.oneVerificationCommand, 'node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js');

  assert.equal(packet.claims.runsPostPostSuccessor24BucketQAvoidingBatchCoverConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostPostSuccessor24BucketQAvoidingCoverAssemblyDecisionToken, true);
  assert.equal(packet.claims.selects26BucketPostPostPostSuccessorCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll26PostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.namesWholeCoveredFamily, true);
  assert.equal(packet.claims.namesFiniteRankToken, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ157Singleton, false);
  assert.equal(packet.claims.descendsIntoQ163Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-successor 26-bucket deterministic rank boundary is emitted', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_POST_POST_POST_SUCCESSOR_26_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedPrimes = [157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 293, 307];
  const expectedNextAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedRankToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_rank_boundary';
  const expectedCoverToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover';

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_rank_boundary/1',
  );
  assert.equal(
    packet.status,
    'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_deterministic_rank_boundary_emitted',
  );
  assert.equal(packet.target, 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_buckets_or_emit_rank_boundary');
  assert.equal(packet.recommendedNextAction, expectedNextAction);

  assert.equal(packet.boundarySummary.sourcePostPostSuccessorBucketCount, 24);
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourcePostPostSuccessorQAvoidingClassCount, '272895494027351286884102031165661158393');
  assert.equal(packet.boundarySummary.postPostPostSuccessorObstructionPrimeBucketCount, 26);
  assert.deepEqual(packet.boundarySummary.postPostPostSuccessorObstructionPrimes, expectedPrimes);
  assert.equal(packet.boundarySummary.minPostPostPostSuccessorObstructionPrime, 157);
  assert.equal(packet.boundarySummary.maxPostPostPostSuccessorObstructionPrime, 307);
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalPostPostPostSuccessorRootChildCount, '545790988054702573768204062331322316786');
  assert.equal(packet.boundarySummary.totalPostPostPostSuccessorQAvoidingClassCount, '17122811411360928250603246815478193773776015');
  assert.equal(packet.boundarySummary.survivorSourceRowCount, 0);
  assert.equal(packet.boundarySummary.survivorPostPostSuccessorQAvoidingClassCount, '0');

  assert.equal(packet.deterministicRankBoundary.consumedFiniteToken, expectedRankToken);
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokenCount, 26);
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokens.length, 26);
  assert.deepEqual(
    packet.deterministicRankBoundary.producedFiniteTokens.map((token) => token.postPostPostSuccessorObstructionPrime),
    expectedPrimes,
  );
  assert.ok(packet.deterministicRankBoundary.producedFiniteTokens.every((token) => token.status === 'open_exact_two_root_post_post_post_successor_rank_boundary'));
  assert.ok(packet.deterministicRankBoundary.producedFiniteTokens.every((token) => token.rootResidueCountsPerClass.length === 1 && token.rootResidueCountsPerClass[0] === 2));

  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.tokenId, expectedRankToken);
  assert.equal(packet.finiteTokenTransition.emittedRankBoundaryTokenCount, 26);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.tokenId, expectedCoverToken);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.bucketCount, 26);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.qAvoidingClassCount, '17122811411360928250603246815478193773776015');
  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_root_children')?.rootChildCount,
    '545790988054702573768204062331322316786',
  );
  assert.equal(
    producedById.get(expectedCoverToken)?.qAvoidingClassCount,
    '17122811411360928250603246815478193773776015',
  );

  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.match(packet.oneNextAction.coveredFamily, /All 17122811411360928250603246815478193773776015 post-post-post-successor q-avoiding classes/);
  assert.match(packet.oneNextAction.failureBoundary, /do not open a singleton q-child first/);
  assert.equal(packet.compressionAudit.verdict, 'exact_boundary_packet_is_the_honest_current_compression');
  assert.deepEqual(packet.compressionAudit.supportDiversity.previousPostPostSuccessorPrimeBuckets.distinctSizes, [1, 2, 3, 4, 5, 6, 7]);
  assert.match(packet.proofBoundary, /does not close the 545,790,988,054,702,573,768,204,062,331,322,316,786 post-post-post-successor root children/);

  assert.equal(packet.claims.consumesPostPostSuccessor24BucketQAvoidingCoverAssemblyRankToken, true);
  assert.equal(packet.claims.accountsForAll26PostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoPostPostPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsExactDeterministic26BucketPostPostPostSuccessorRankBoundary, true);
  assert.equal(packet.claims.selectsWholeBoundaryBatchCoverNext, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ157Singleton, false);
  assert.equal(packet.claims.descendsIntoQ163Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-successor 26-bucket rank-boundary convergence assembly selects q-cover', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_POST_POST_POST_SUCCESSOR_26_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedNextAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedRankToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_rank_boundary';
  const expectedCoverToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover';

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_rank_boundary_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_rank_boundary_convergence_assembly_selects_26_bucket_q_avoiding_cover',
  );
  assert.equal(packet.target, 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_rank_boundary');
  assert.equal(packet.coversPrimaryNextAction.stepId, expectedNextAction);
  assert.equal(packet.coversPrimaryNextAction.status, 'covered_by_post_post_post_successor_26_bucket_rank_boundary_convergence_assembly');
  assert.equal(packet.sourcePackets.length, 2);

  assert.equal(packet.frontierComparison.previousRefreshValueBefore26BucketPostPostPostSuccessorRankBoundary, 68);
  assert.equal(packet.frontierComparison.currentRefreshValueAfter26BucketPostPostPostSuccessorRankBoundary, 70);
  assert.equal(packet.frontierComparison.delta, 2);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.tokenId, 'post_post_post_successor_26_bucket_rank_boundary_convergence_assembly');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId, expectedRankToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostSuccessorObstructionPrimeBucketCount, 26);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostSuccessorRootChildCount, '545790988054702573768204062331322316786');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostSuccessorQAvoidingClassCount, '17122811411360928250603246815478193773776015');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, expectedCoverToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 26);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.qAvoidingClassCount, '17122811411360928250603246815478193773776015');

  assert.equal(packet.assembledPieces.length, 4);
  assert.match(packet.assembledPieces[1].claim, /157,163,167/);
  assert.match(packet.assembledPieces[1].claim, /293,307/);
  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.match(packet.oneNextAction.coveredFamily, /across q in \{157,163/);
  assert.match(packet.oneNextAction.coveredFamily, /17,122,811,411,360/);
  assert.match(packet.oneNextAction.failureBoundary, /q157\/q163/);
  assert.equal(packet.oneVerificationCommand, 'node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js');

  assert.equal(packet.claims.runsPostPostPostSuccessor26BucketRankBoundaryConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostPostPostSuccessor26BucketRankBoundaryAssemblyDecisionToken, true);
  assert.equal(packet.claims.selects26BucketPostPostPostSuccessorQAvoidingCoverInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll26PostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ157Singleton, false);
  assert.equal(packet.claims.descendsIntoQ163Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-successor 26-bucket q-cover convergence assembly selects 29-bucket rank boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_POST_SUCCESSOR_24_BUCKET_POST_POST_SUCCESSOR_24_BUCKET_POST_POST_POST_SUCCESSOR_26_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedAssemblyAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover';
  const expectedNextAction = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_buckets_or_emit_rank_boundary';
  const expectedCoverToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover';
  const expectedRankToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_rank_boundary';

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_q_avoiding_batch_cover_convergence_assembly_selects_29_bucket_post_post_post_post_successor_rank_compression',
  );
  assert.equal(packet.target, expectedAssemblyAction);
  assert.equal(packet.coversPrimaryNextAction.stepId, expectedAssemblyAction);
  assert.equal(packet.coversPrimaryNextAction.status, 'covered_by_post_post_post_successor_26_bucket_q_avoiding_batch_cover_convergence_assembly');
  assert.equal(packet.sourcePackets.length, 2);

  assert.equal(packet.frontierComparison.previousRefreshValueBefore26BucketPostPostPostSuccessorQAvoidingCover, 70);
  assert.equal(packet.frontierComparison.currentRefreshValueAfter26BucketPostPostPostSuccessorQAvoidingCover, 72);
  assert.equal(packet.frontierComparison.delta, 2);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.tokenId, 'post_post_post_successor_26_bucket_q_avoiding_batch_cover_convergence_assembly');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId, expectedCoverToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostPostPostSuccessorBucketCount, 26);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostPostPostSuccessorQAvoidingClassCount, '17122811411360928250603246815478193773776015');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostSuccessorObstructionPrimeBucketCount, 29);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostSuccessorRootChildCount, '34245622822721856501206493630956387547552030');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, expectedRankToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 29);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostSuccessorRootChildCount, '34245622822721856501206493630956387547552030');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');

  assert.equal(packet.postPostPostPostSuccessorBucketSummary.bucketCount, 29);
  assert.deepEqual(packet.postPostPostPostSuccessorBucketSummary.rootResidueCountsPerClass, [2]);
  assert.deepEqual(
    packet.postPostPostPostSuccessorBucketSummary.postPostPostPostSuccessorPrimes,
    [
      163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
      233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307,
      311, 313, 331,
    ],
  );
  assert.equal(packet.assembledPieces.length, 4);
  assert.match(packet.assembledPieces[2].claim, /163,167,173/);
  assert.match(packet.assembledPieces[2].claim, /311,313,331/);
  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.match(packet.oneNextAction.coveredFamily, /All 29 post-post-post-post-successor buckets/);
  assert.match(packet.oneNextAction.failureBoundary, /q163\/q167/);
  assert.equal(packet.oneVerificationCommand, 'node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js');

  assert.equal(packet.claims.runsPostPostPostSuccessor26BucketQAvoidingCoverConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostPostPostSuccessor26BucketQAvoidingCoverAssemblyDecisionToken, true);
  assert.equal(packet.claims.selects29BucketPostPostPostPostSuccessorCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll29PostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ163Singleton, false);
  assert.equal(packet.claims.descendsIntoQ167Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-26 q-avoiding 29-bucket rank boundary records exact deterministic successor surface', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_26_Q_AVOIDING_29_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedTarget = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_buckets_or_emit_rank_boundary';
  const expectedAssemblyAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_rank_boundary';
  const expectedQCoverAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedRankToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_rank_boundary';
  const expectedQCoverToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';
  const expectedPrimes = [
    163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
    233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307,
    311, 313, 331,
  ];

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_rank_boundary/1',
  );
  assert.equal(
    packet.status,
    'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_deterministic_rank_boundary_emitted',
  );
  assert.equal(packet.target, expectedTarget);
  assert.equal(packet.recommendedNextAction, expectedAssemblyAction);
  assert.equal(packet.oneNextAction.stepId, expectedAssemblyAction);
  assert.equal(packet.nextQCoverActionAfterAssembly, expectedQCoverAction);

  assert.equal(packet.boundarySummary.sourcePostPostPostSuccessorBucketCount, 26);
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourcePostPostPostSuccessorQAvoidingClassCount, '17122811411360928250603246815478193773776015');
  assert.equal(packet.boundarySummary.postPostPostPostSuccessorObstructionPrimeBucketCount, 29);
  assert.deepEqual(packet.boundarySummary.postPostPostPostSuccessorObstructionPrimes, expectedPrimes);
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalPostPostPostPostSuccessorRootChildCount, '34245622822721856501206493630956387547552030');
  assert.equal(packet.boundarySummary.totalPostPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');
  assert.equal(packet.boundarySummary.survivorSourceRowCount, 0);
  assert.equal(packet.boundarySummary.survivorPostPostPostSuccessorQAvoidingClassCount, '0');

  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.tokenId, expectedRankToken);
  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.bucketCount, 29);
  assert.equal(packet.finiteTokenTransition.emittedRankBoundaryTokenCount, 29);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.tokenId, expectedQCoverToken);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.bucketCount, 29);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.qAvoidingClassCount, '1256125158212428260162381710030390124682911240345');
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens.length, 2);
  assert.match(packet.finiteTokenTransition.producedFiniteTokens[0].tokenId, /29_bucket_root_children$/);
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[0].rootChildCount, '34245622822721856501206493630956387547552030');
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[1].tokenId, expectedQCoverToken);
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[1].qAvoidingClassCount, '1256125158212428260162381710030390124682911240345');

  assert.equal(packet.postPostPostPostSuccessorPrimeBuckets.length, 29);
  assert.deepEqual(
    packet.postPostPostPostSuccessorPrimeBuckets.map((bucket) => bucket.postPostPostPostSuccessorObstructionPrime),
    expectedPrimes,
  );
  assert.equal(packet.deterministicRankBoundary.consumedFiniteToken, expectedRankToken);
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokenCount, 29);
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokens.length, 29);
  assert.ok(packet.deterministicRankBoundary.producedFiniteTokens.every((bucket) => bucket.rootResidueCountsPerClass.length === 1 && bucket.rootResidueCountsPerClass[0] === 2));
  assert.equal(packet.deterministicRankBoundary.measureStatus, 'finite_rank_token_partitioned_not_decreased');

  assert.equal(packet.claims.consumesPostPostPostSuccessor26BucketQAvoidingCoverAssemblyRankToken, true);
  assert.equal(packet.claims.accountsForAll29PostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoPostPostPostPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsExactDeterministic29BucketPostPostPostPostSuccessorRankBoundary, true);
  assert.equal(packet.claims.selectsConvergenceAssemblyBeforeWholeBoundaryBatchCover, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ163Singleton, false);
  assert.equal(packet.claims.descendsIntoQ167Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-29-bucket rank-boundary convergence assembly selects whole q-cover token', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedAssemblyAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_rank_boundary';
  const expectedQCoverAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedRankToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_rank_boundary';
  const expectedQCoverToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';
  const expectedPrimes = [
    163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
    233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307,
    311, 313, 331,
  ];

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_bucket_rank_boundary_convergence_assembly_packet/1');
  assert.equal(packet.status, 'post_29_bucket_rank_boundary_convergence_assembly_selects_29_bucket_q_avoiding_cover');
  assert.equal(packet.target, expectedAssemblyAction);
  assert.equal(packet.coversPrimaryNextAction.stepId, expectedAssemblyAction);
  assert.equal(packet.coversPrimaryNextAction.status, 'covered_by_post_post_post_post_successor_29_bucket_rank_boundary_convergence_assembly');
  assert.equal(packet.recommendedNextAction, expectedQCoverAction);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.tokenId, 'post_post_post_post_successor_29_bucket_rank_boundary_convergence_assembly');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId, expectedRankToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostPostPostSuccessorBucketCount, 26);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostPostPostSuccessorQAvoidingClassCount, '17122811411360928250603246815478193773776015');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostSuccessorObstructionPrimeBucketCount, 29);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostSuccessorRootChildCount, '34245622822721856501206493630956387547552030');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, expectedQCoverToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 29);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');

  assert.equal(packet.postPostPostPostSuccessorQCoverSummary.bucketCount, 29);
  assert.deepEqual(packet.postPostPostPostSuccessorQCoverSummary.postPostPostPostSuccessorPrimes, expectedPrimes);
  assert.deepEqual(packet.postPostPostPostSuccessorQCoverSummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.postPostPostPostSuccessorQCoverSummary.postPostPostPostSuccessorRootChildCount, '34245622822721856501206493630956387547552030');
  assert.equal(packet.postPostPostPostSuccessorQCoverSummary.postPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');

  assert.equal(packet.assembledPieces.length, 4);
  assert.match(packet.assembledPieces[1].claim, /163,167,173/);
  assert.match(packet.assembledPieces[1].claim, /311,313,331/);
  assert.equal(packet.oneNextAction.stepId, expectedQCoverAction);
  assert.match(packet.oneNextAction.coveredFamily, /1,256,125,158,212/);
  assert.match(packet.oneNextAction.failureBoundary, /q163/);
  assert.equal(packet.oneVerificationCommand, 'node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js');

  assert.equal(packet.claims.runsPostPostPostPostSuccessor29BucketRankBoundaryConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostPostPostPostSuccessor29BucketRankBoundaryDecisionToken, true);
  assert.equal(packet.claims.selects29BucketPostPostPostPostSuccessorQAvoidingCoverInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll29PostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.namesWholeCoveredFamily, true);
  assert.equal(packet.claims.namesFiniteQCoverToken, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ163Singleton, false);
  assert.equal(packet.claims.descendsIntoQ167Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-29 q-avoiding batch cover records exact no-survivor next boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_29_BUCKET_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedNextAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';
  const expectedSourceToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';
  const expectedPrimes = [
    167, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239,
    241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313,
    317, 337, 347,
  ];

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover/1');
  assert.equal(packet.status, 'all_29_bucket_post_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child');
  assert.equal(packet.target, expectedAction);
  assert.equal(packet.recommendedNextAction, expectedNextAction);

  assert.equal(packet.inputRankToken.tokenId, expectedSourceToken);
  assert.equal(packet.batchCoverSummary.sourcePostPostPostPostSuccessorBucketCount, 29);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.sourcePostPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');
  assert.equal(packet.batchCoverSummary.classifiedPostPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorPostPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.batchCoverSummary.postPostPostPostPostSuccessorObstructionPrimeBucketCount, 29);
  assert.equal(packet.batchCoverSummary.minPostPostPostPostPostSuccessorObstructionPrime, 167);
  assert.equal(packet.batchCoverSummary.maxPostPostPostPostPostSuccessorObstructionPrime, 347);
  assert.deepEqual(packet.batchCoverSummary.postPostPostPostPostSuccessorRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalPostPostPostPostPostSuccessorRootChildCount, '2512250316424856520324763420060780249365822480690');
  assert.equal(packet.batchCoverSummary.totalPostPostPostPostPostSuccessorQAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');

  assert.deepEqual(
    packet.postPostPostPostPostSuccessorObstructionPrimeBuckets.map((bucket) => bucket.postPostPostPostPostSuccessorObstructionPrime),
    expectedPrimes,
  );
  assert.equal(packet.postPostPostPostPostSuccessorObstructionPrimeBuckets.length, 29);
  assert.ok(packet.postPostPostPostPostSuccessorObstructionPrimeBuckets.every((bucket) => bucket.status === 'open_exact_two_root_post_post_post_post_post_successor_rank_boundary'));
  assert.ok(packet.rowClassifications.every((row) => row.postPostPostPostPostSuccessorRootResidueCount === 2));
  assert.ok(packet.rowClassifications.every((row) => row.postPostPostPostPostSuccessorObstructionPrime > row.postPostPostPostSuccessorObstructionPrime));

  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.tokenId, expectedSourceToken);
  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.sourcePostPostPostPostSuccessorBucketCount, 29);
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens.length, 2);
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[0].postPostPostPostPostSuccessorObstructionPrimeBucketCount, 29);
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[0].rootChildCount, '2512250316424856520324763420060780249365822480690');
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[1].postPostPostPostPostSuccessorObstructionPrimeBucketCount, 29);
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[1].qAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');

  assert.equal(packet.claims.consumes29BucketPostPostPostPostSuccessorQAvoidingToken, true);
  assert.equal(packet.claims.classifiesAll29SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllSourceRows, true);
  assert.equal(packet.claims.classifiesAllPostPostPostPostSuccessorQAvoidingClasses, true);
  assert.equal(packet.claims.survivorPostPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.claims.allRowsHaveTwoPostPostPostPostPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsTwentyNinePostPostPostPostPostSuccessorPrimeBuckets, true);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-29 q-avoiding convergence assembly selects whole post-post-post-post-post-successor rank boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_29_BUCKET_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedAssemblyAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';
  const expectedNextAction = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_buckets_or_emit_rank_boundary';
  const expectedClosedToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';
  const expectedRankToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_rank_boundary';
  const expectedPrimes = [
    167, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239,
    241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313,
    317, 337, 347,
  ];

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_q_avoiding_29_bucket_convergence_assembly_packet/1');
  assert.equal(packet.status, 'post_29_q_avoiding_29_bucket_convergence_assembly_selects_29_bucket_post_post_post_post_post_successor_rank_compression');
  assert.equal(packet.target, expectedAssemblyAction);
  assert.equal(packet.coversPrimaryNextAction.stepId, expectedAssemblyAction);
  assert.equal(packet.coversPrimaryNextAction.status, 'covered_by_post_post_post_post_successor_29_bucket_q_avoiding_convergence_assembly');
  assert.equal(packet.recommendedNextAction, expectedNextAction);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.tokenId, 'post_post_post_post_successor_29_bucket_q_avoiding_convergence_assembly');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId, expectedClosedToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostPostPostPostSuccessorBucketCount, 29);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.classifiedPostPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorPostPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostPostSuccessorObstructionPrimeBucketCount, 29);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostPostSuccessorRootChildCount, '2512250316424856520324763420060780249365822480690');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostPostSuccessorQAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, expectedRankToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 29);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostPostSuccessorRootChildCount, '2512250316424856520324763420060780249365822480690');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostPostSuccessorQAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');

  assert.equal(packet.postPostPostPostPostSuccessorRankBoundarySummary.bucketCount, 29);
  assert.deepEqual(packet.postPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostSuccessorPrimes, expectedPrimes);
  assert.deepEqual(packet.postPostPostPostPostSuccessorRankBoundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.postPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostSuccessorRootChildCount, '2512250316424856520324763420060780249365822480690');
  assert.equal(packet.postPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostSuccessorQAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');

  assert.equal(packet.assembledPieces.length, 4);
  assert.match(packet.assembledPieces[2].claim, /167,179,181/);
  assert.match(packet.assembledPieces[2].claim, /317,337,347/);
  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.match(packet.oneNextAction.coveredFamily, /104,979,512,685/);
  assert.match(packet.oneNextAction.failureBoundary, /q167/);
  assert.equal(packet.oneVerificationCommand, 'node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js');

  assert.equal(packet.claims.runsPostPostPostPostSuccessor29BucketQAvoidingConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostPostPostPostSuccessor29BucketQAvoidingDecisionToken, true);
  assert.equal(packet.claims.selects29BucketPostPostPostPostPostSuccessorCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll29PostPostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.namesWholeCoveredFamily, true);
  assert.equal(packet.claims.namesFiniteRankBoundaryToken, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ167Singleton, false);
  assert.equal(packet.claims.descendsIntoQ179Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-29 q-avoiding post-post-post-post-post-successor rank boundary emits exact 29-bucket handoff', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedNextAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_rank_boundary';
  const expectedQCoverAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedPrimes = [
    167, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239,
    241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313,
    317, 337, 347,
  ];

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_rank_boundary/1');
  assert.equal(packet.status, 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_deterministic_rank_boundary_emitted');
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.equal(packet.nextQCoverActionAfterAssembly, expectedQCoverAction);

  assert.equal(packet.boundarySummary.sourcePostPostPostPostSuccessorBucketCount, 29);
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourcePostPostPostPostSuccessorQAvoidingClassCount, '1256125158212428260162381710030390124682911240345');
  assert.equal(packet.boundarySummary.postPostPostPostPostSuccessorObstructionPrimeBucketCount, 29);
  assert.deepEqual(packet.boundarySummary.postPostPostPostPostSuccessorObstructionPrimes, expectedPrimes);
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalPostPostPostPostPostSuccessorRootChildCount, '2512250316424856520324763420060780249365822480690');
  assert.equal(packet.boundarySummary.totalPostPostPostPostPostSuccessorQAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');
  assert.equal(packet.boundarySummary.survivorPostPostPostPostSuccessorQAvoidingClassCount, '0');

  assert.equal(packet.deterministicRankBoundary.producedFiniteTokenCount, 29);
  assert.equal(packet.postPostPostPostPostSuccessorPrimeBuckets.length, 29);
  assert.equal(packet.postPostPostPostPostSuccessorPrimeBuckets[0].postPostPostPostPostSuccessorObstructionPrime, 167);
  assert.equal(packet.postPostPostPostPostSuccessorPrimeBuckets.at(-1).postPostPostPostPostSuccessorObstructionPrime, 347);
  assert.ok(packet.postPostPostPostPostSuccessorPrimeBuckets.every((bucket) => bucket.status === 'open_exact_two_root_post_post_post_post_post_successor_rank_boundary'));

  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.bucketCount, 29);
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[1].qAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.bucketCount, 29);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.status, 'selected_after_rank_boundary_convergence_assembly');

  assert.equal(packet.claims.accountsForAll29PostPostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoPostPostPostPostPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsExactDeterministic29BucketPostPostPostPostPostSuccessorRankBoundary, true);
  assert.equal(packet.claims.selectsConvergenceAssemblyBeforeWholeBoundaryBatchCover, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ167Singleton, false);
  assert.equal(packet.claims.descendsIntoQ179Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-29 q-avoiding post-post-post-post-post-successor rank boundary assembly selects whole q-cover', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedTarget = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_rank_boundary';
  const expectedQCoverAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedQCoverToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_rank_boundary_convergence_assembly_packet/1');
  assert.equal(packet.status, 'post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_rank_boundary_convergence_assembly_selects_29_bucket_q_avoiding_cover');
  assert.equal(packet.target, expectedTarget);
  assert.equal(packet.recommendedNextAction, expectedQCoverAction);
  assert.equal(packet.oneNextAction.stepId, expectedQCoverAction);
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken, expectedQCoverToken);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.sourceAction, expectedTarget);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostPostSuccessorObstructionPrimeBucketCount, 29);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostPostSuccessorRootChildCount, '2512250316424856520324763420060780249365822480690');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostPostSuccessorQAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, expectedQCoverToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 29);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.status, 'selected_for_whole_boundary_q_avoiding_batch_cover');

  assert.equal(packet.postPostPostPostPostSuccessorQAvoidingCoverSummary.bucketCount, 29);
  assert.deepEqual(packet.postPostPostPostPostSuccessorQAvoidingCoverSummary.rootResidueCountsPerClass, [2]);
  assert.deepEqual(packet.postPostPostPostPostSuccessorQAvoidingCoverSummary.postPostPostPostPostSuccessorPrimes.slice(0, 2), [167, 179]);
  assert.deepEqual(packet.postPostPostPostPostSuccessorQAvoidingCoverSummary.postPostPostPostPostSuccessorPrimes.slice(-2), [337, 347]);

  assert.equal(packet.claims.runsPostPostPostPostPostSuccessor29BucketRankBoundaryConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostPostPostPostPostSuccessor29BucketRankBoundaryDecisionToken, true);
  assert.equal(packet.claims.selects29BucketPostPostPostPostPostSuccessorQAvoidingCoverInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll29PostPostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.namesFiniteQCoverToken, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ167Singleton, false);
  assert.equal(packet.claims.descendsIntoQ179Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-post-post-successor 29-bucket q-cover emits 30-bucket boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedNextAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';
  const expectedPrimes = [
    179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241,
    251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
    331, 337, 349, 353,
  ];

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover/1');
  assert.equal(packet.status, 'all_29_bucket_post_post_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child');
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.equal(packet.oneNextAction.stepId, expectedNextAction);

  assert.equal(packet.batchCoverSummary.sourcePostPostPostPostPostSuccessorBucketCount, 29);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.sourcePostPostPostPostPostSuccessorQAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');
  assert.equal(packet.batchCoverSummary.classifiedPostPostPostPostPostSuccessorQAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorPostPostPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.batchCoverSummary.postPostPostPostPostPostSuccessorObstructionPrimeBucketCount, 30);
  assert.deepEqual(packet.batchCoverSummary.postPostPostPostPostPostSuccessorRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalPostPostPostPostPostPostSuccessorRootChildCount, '209959025371800462398398841431586439796950134059710318');
  assert.equal(packet.batchCoverSummary.totalPostPostPostPostPostPostSuccessorQAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');

  assert.deepEqual(
    packet.postPostPostPostPostPostSuccessorObstructionPrimeBuckets.map((bucket) => bucket.postPostPostPostPostPostSuccessorObstructionPrime),
    expectedPrimes,
  );
  assert.equal(packet.postPostPostPostPostPostSuccessorObstructionPrimeBuckets.length, 30);
  assert.ok(packet.postPostPostPostPostPostSuccessorObstructionPrimeBuckets.every((bucket) => bucket.status === 'open_exact_two_root_post_post_post_post_post_post_successor_rank_boundary'));
  assert.ok(packet.rowClassifications.every((row) => row.postPostPostPostPostPostSuccessorRootResidueCount === 2));
  assert.ok(packet.rowClassifications.every((row) => row.postPostPostPostPostPostSuccessorObstructionPrime > row.postPostPostPostPostSuccessorObstructionPrime));

  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[0].postPostPostPostPostPostSuccessorObstructionPrimeBucketCount, 30);
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[1].qAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');

  assert.equal(packet.claims.classifiesAll29SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllPostPostPostPostPostSuccessorQAvoidingClasses, true);
  assert.equal(packet.claims.survivorPostPostPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.claims.emitsPostPostPostPostPostPostSuccessorPrimeBuckets, 30);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ167Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-post-post-successor q-cover convergence assembly selects 30-bucket boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedTarget = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover';
  const expectedNextAction = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_buckets_or_emit_rank_boundary';
  const expectedNextToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary';
  const expectedPrimes = [
    179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241,
    251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
    331, 337, 349, 353,
  ];

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1');
  assert.equal(packet.status, 'post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_q_avoiding_batch_cover_convergence_assembly_selects_30_bucket_post_post_post_post_post_post_successor_rank_compression');
  assert.equal(packet.target, expectedTarget);
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.equal(packet.coversPrimaryNextAction.stepId, expectedTarget);
  assert.equal(packet.coversPrimaryNextAction.status, 'covered_by_this_assembly_packet');
  assert.equal(packet.oneNextAction.stepId, expectedNextAction);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.tokenId, 'post_post_post_post_post_successor_29_bucket_q_avoiding_convergence_assembly');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorPostPostPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostPostPostPostPostSuccessorBucketCount, 29);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostPostPostPostPostSuccessorQAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostPostPostSuccessorObstructionPrimeBucketCount, 30);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, expectedNextToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 30);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostPostPostSuccessorRootChildCount, '209959025371800462398398841431586439796950134059710318');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostPostPostSuccessorQAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');

  assert.equal(packet.postPostPostPostPostPostSuccessorRankBoundarySummary.bucketCount, 30);
  assert.deepEqual(packet.postPostPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostPostSuccessorPrimes, expectedPrimes);
  assert.deepEqual(packet.postPostPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostPostSuccessorPrimes.slice(0, 2), [179, 181]);
  assert.deepEqual(packet.postPostPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostPostSuccessorPrimes.slice(-2), [349, 353]);
  assert.equal(packet.postPostPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostPostSuccessorRootChildCount, '209959025371800462398398841431586439796950134059710318');
  assert.equal(packet.postPostPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostPostSuccessorQAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');

  assert.equal(packet.claims.runsPostPostPostPostPostSuccessor29BucketQAvoidingConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostPostPostPostPostSuccessor29BucketQAvoidingDecisionToken, true);
  assert.equal(packet.claims.selects30BucketPostPostPostPostPostPostSuccessorCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll30PostPostPostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ179Singleton, false);
  assert.equal(packet.claims.descendsIntoQ181Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-post-post-post-successor 30-bucket rank boundary emits exact handoff', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedTarget = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_buckets_or_emit_rank_boundary';
  const expectedNextAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary';
  const expectedQCoverAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedNextToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover';
  const expectedPrimes = [
    179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241,
    251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
    331, 337, 349, 353,
  ];

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary/1');
  assert.equal(packet.status, 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_deterministic_rank_boundary_emitted');
  assert.equal(packet.target, expectedTarget);
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.equal(packet.nextQCoverActionAfterAssembly, expectedQCoverAction);
  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken, `Finite token ${expectedNextToken}.`);

  assert.equal(packet.boundarySummary.sourcePostPostPostPostPostSuccessorBucketCount, 29);
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourcePostPostPostPostPostSuccessorQAvoidingClassCount, '104979512685900231199199420715793219898475067029855159');
  assert.equal(packet.boundarySummary.postPostPostPostPostPostSuccessorObstructionPrimeBucketCount, 30);
  assert.deepEqual(packet.boundarySummary.postPostPostPostPostPostSuccessorObstructionPrimes, expectedPrimes);
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalPostPostPostPostPostPostSuccessorRootChildCount, '209959025371800462398398841431586439796950134059710318');
  assert.equal(packet.boundarySummary.totalPostPostPostPostPostPostSuccessorQAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');
  assert.equal(packet.boundarySummary.survivorPostPostPostPostPostSuccessorQAvoidingClassCount, '0');

  assert.equal(packet.deterministicRankBoundary.producedFiniteTokenCount, 30);
  assert.equal(packet.postPostPostPostPostPostSuccessorPrimeBuckets.length, 30);
  assert.equal(packet.postPostPostPostPostPostSuccessorPrimeBuckets[0].postPostPostPostPostPostSuccessorObstructionPrime, 179);
  assert.equal(packet.postPostPostPostPostPostSuccessorPrimeBuckets.at(-1).postPostPostPostPostPostSuccessorObstructionPrime, 353);
  assert.ok(packet.postPostPostPostPostPostSuccessorPrimeBuckets.every((bucket) => bucket.status === 'open_exact_two_root_post_post_post_post_post_post_successor_rank_boundary'));
  assert.ok(packet.postPostPostPostPostPostSuccessorPrimeBuckets.every((bucket) => bucket.rootResidueCountsPerClass.length === 1 && bucket.rootResidueCountsPerClass[0] === 2));

  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.status, 'consumed_by_deterministic_30_bucket_post_post_post_post_post_post_successor_rank_boundary');
  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.bucketCount, 30);
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[1].tokenId, expectedNextToken);
  assert.equal(packet.finiteTokenTransition.producedFiniteTokens[1].qAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.tokenId, expectedNextToken);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.status, 'selected_after_rank_boundary_convergence_assembly');

  assert.equal(packet.claims.consumesPostPostPostPostPostSuccessorQAvoidingAssemblyRankToken, true);
  assert.equal(packet.claims.accountsForAll30PostPostPostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoPostPostPostPostPostPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsExactDeterministic30BucketPostPostPostPostPostPostSuccessorRankBoundary, true);
  assert.equal(packet.claims.selectsConvergenceAssemblyBeforeWholeBoundaryBatchCover, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ179Singleton, false);
  assert.equal(packet.claims.descendsIntoQ181Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-post-post-post-successor 30-bucket rank-boundary assembly selects q-cover', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedTarget = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary';
  const expectedNextAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedNextToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover';
  const expectedPrimes = [
    179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241,
    251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
    331, 337, 349, 353,
  ];

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary_convergence_assembly_packet/1');
  assert.equal(packet.status, 'post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_rank_boundary_convergence_assembly_selects_30_bucket_q_avoiding_cover');
  assert.equal(packet.target, expectedTarget);
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.equal(packet.coversPrimaryNextAction.stepId, expectedTarget);
  assert.equal(packet.coversPrimaryNextAction.status, 'covered_by_this_assembly_packet');
  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken, expectedNextToken);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.tokenId, expectedNextToken.replace(/_q_avoiding_batch_cover$/, '_rank_boundary'));
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.status, 'consumed_by_convergence_assembly');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.bucketCount, 30);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostPostPostSuccessorRootChildCount, '209959025371800462398398841431586439796950134059710318');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.postPostPostPostPostPostSuccessorQAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, expectedNextToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 30);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostPostPostSuccessorRootChildCount, '209959025371800462398398841431586439796950134059710318');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostPostPostSuccessorQAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');

  assert.equal(packet.postPostPostPostPostPostSuccessorQAvoidingCoverSummary.bucketCount, 30);
  assert.deepEqual(packet.postPostPostPostPostPostSuccessorQAvoidingCoverSummary.postPostPostPostPostPostSuccessorPrimes, expectedPrimes);
  assert.deepEqual(packet.postPostPostPostPostPostSuccessorQAvoidingCoverSummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.postPostPostPostPostPostSuccessorQAvoidingCoverSummary.sourceRowCount, 718);

  assert.equal(packet.claims.runsPostPostPostPostPostPostSuccessor30BucketRankBoundaryConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostPostPostPostPostPostSuccessor30BucketRankBoundaryDecisionToken, true);
  assert.equal(packet.claims.selects30BucketPostPostPostPostPostPostSuccessorQAvoidingCoverInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll30PostPostPostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ179Singleton, false);
  assert.equal(packet.claims.descendsIntoQ181Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-post-post-post-successor 30-bucket q-cover closes with zero survivors', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedTarget = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedNextAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover';

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover/1');
  assert.equal(packet.status, 'all_30_bucket_post_post_post_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child');
  assert.equal(packet.target, expectedTarget);
  assert.equal(packet.recommendedNextAction, expectedNextAction);

  assert.equal(packet.batchCoverSummary.sourcePostPostPostPostPostPostSuccessorBucketCount, 30);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.sourcePostPostPostPostPostPostSuccessorQAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');
  assert.equal(packet.batchCoverSummary.classifiedPostPostPostPostPostPostSuccessorQAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorPostPostPostPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.batchCoverSummary.postPostPostPostPostPostPostSuccessorObstructionPrimeBucketCount, 31);
  assert.equal(packet.batchCoverSummary.minPostPostPostPostPostPostPostSuccessorObstructionPrime, 181);
  assert.equal(packet.batchCoverSummary.maxPostPostPostPostPostPostPostSuccessorObstructionPrime, 379);
  assert.deepEqual(packet.batchCoverSummary.postPostPostPostPostPostPostSuccessorRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalPostPostPostPostPostPostPostSuccessorRootChildCount, '19927448820703742782176361428927218635304087381499220823970');
  assert.equal(packet.batchCoverSummary.totalPostPostPostPostPostPostPostSuccessorQAvoidingClassCount, '1076809507521202773529514663320305794244106017506794395900320871');

  assert.equal(packet.postPostPostPostPostPostPostSuccessorObstructionPrimeBuckets[0].postPostPostPostPostPostPostSuccessorObstructionPrime, 181);
  assert.equal(packet.postPostPostPostPostPostPostSuccessorObstructionPrimeBuckets.at(-1).postPostPostPostPostPostPostSuccessorObstructionPrime, 379);

  assert.equal(packet.claims.consumes30BucketPostPostPostPostPostPostSuccessorQAvoidingToken, true);
  assert.equal(packet.claims.classifiesAll30SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllSourceRows, true);
  assert.equal(packet.claims.classifiesAllPostPostPostPostPostPostSuccessorQAvoidingClasses, true);
  assert.equal(packet.claims.survivorSourceRowCount, 0);
  assert.equal(packet.claims.survivorPostPostPostPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.claims.allRowsHaveTwoPostPostPostPostPostPostPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsPostPostPostPostPostPostPostSuccessorPrimeBuckets, 31);
  assert.equal(packet.claims.descendsIntoQ179Singleton, false);
  assert.equal(packet.claims.descendsIntoQ181Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-post-post-post-successor 30-bucket q-cover assembly selects 31-bucket rank work', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedTarget = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover';
  const expectedNextAction = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_buckets_or_emit_rank_boundary';
  const expectedNextToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary';
  const expectedPrimes = [
    181, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257,
    263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337,
    347, 349, 353, 359, 379,
  ];

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1');
  assert.equal(packet.status, 'post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_q_avoiding_batch_cover_convergence_assembly_selects_31_bucket_post_post_post_post_post_post_post_successor_rank_compression');
  assert.equal(packet.target, expectedTarget);
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.equal(packet.coversPrimaryNextAction.stepId, expectedTarget);
  assert.equal(packet.coversPrimaryNextAction.status, 'covered_by_this_assembly_packet');
  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken, expectedNextToken);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.tokenId, expectedNextToken.replace(/_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary$/, '_q_avoiding_batch_cover'));
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.status, 'consumed_by_convergence_assembly');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.bucketCount, 30);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorPostPostPostPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, expectedNextToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 31);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostPostPostPostSuccessorRootChildCount, '19927448820703742782176361428927218635304087381499220823970');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostPostPostPostSuccessorQAvoidingClassCount, '1076809507521202773529514663320305794244106017506794395900320871');

  assert.equal(packet.postPostPostPostPostPostPostSuccessorRankBoundarySummary.bucketCount, 31);
  assert.deepEqual(packet.postPostPostPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostPostPostSuccessorPrimes, expectedPrimes);
  assert.deepEqual(packet.postPostPostPostPostPostPostSuccessorRankBoundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.postPostPostPostPostPostPostSuccessorRankBoundarySummary.sourceRowCount, 718);
  assert.equal(packet.postPostPostPostPostPostPostSuccessorRankBoundarySummary.sourcePostPostPostPostPostPostSuccessorBucketCount, 30);
  assert.equal(packet.postPostPostPostPostPostPostSuccessorRankBoundarySummary.sourcePostPostPostPostPostPostSuccessorQAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');
  assert.equal(packet.postPostPostPostPostPostPostSuccessorRankBoundarySummary.survivorPostPostPostPostPostPostSuccessorQAvoidingClassCount, '0');

  assert.equal(packet.claims.runsPostPostPostPostPostPostSuccessor30BucketQAvoidingCoverConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostPostPostPostPostPostSuccessor30BucketQAvoidingCoverDecisionToken, true);
  assert.equal(packet.claims.selects31BucketPostPostPostPostPostPostPostSuccessorCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll31PostPostPostPostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.namesWhole31BucketRankBoundary, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ181Singleton, false);
  assert.equal(packet.claims.descendsIntoQ193Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-post-post-post-post-successor 31-bucket rank boundary selects assembly', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_POST_POST_POST_POST_POST_POST_POST_SUCCESSOR_31_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedTarget = 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_buckets_or_emit_rank_boundary';
  const expectedNextAction = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary';
  const expectedQCoverAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedRankToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary';
  const expectedQCoverToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_q_avoiding_batch_cover';
  const expectedPrimes = [
    181, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257,
    263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337,
    347, 349, 353, 359, 379,
  ];

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary/1');
  assert.equal(packet.status, 'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_deterministic_rank_boundary_emitted');
  assert.equal(packet.target, expectedTarget);
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.equal(packet.nextQCoverActionAfterAssembly, expectedQCoverAction);
  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.match(packet.oneNextAction.coveredFamily, /q in \{181,193,197/);

  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.tokenId, expectedRankToken);
  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.status, 'consumed_by_deterministic_31_bucket_post_post_post_post_post_post_post_successor_rank_boundary');
  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.bucketCount, 31);
  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.sourceRowCount, 718);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.tokenId, expectedQCoverToken);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.status, 'selected_after_rank_boundary_convergence_assembly');
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.qAvoidingClassCount, '1076809507521202773529514663320305794244106017506794395900320871');

  assert.equal(packet.boundarySummary.sourcePostPostPostPostPostPostSuccessorBucketCount, 30);
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourcePostPostPostPostPostPostSuccessorQAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');
  assert.equal(packet.boundarySummary.postPostPostPostPostPostPostSuccessorObstructionPrimeBucketCount, 31);
  assert.deepEqual(packet.boundarySummary.postPostPostPostPostPostPostSuccessorObstructionPrimes, expectedPrimes);
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalPostPostPostPostPostPostPostSuccessorRootChildCount, '19927448820703742782176361428927218635304087381499220823970');
  assert.equal(packet.boundarySummary.totalPostPostPostPostPostPostPostSuccessorQAvoidingClassCount, '1076809507521202773529514663320305794244106017506794395900320871');
  assert.equal(packet.boundarySummary.survivorPostPostPostPostPostPostSuccessorQAvoidingClassCount, '0');

  assert.equal(packet.claims.consumesPostPostPostPostPostPostSuccessorQAvoidingAssemblyRankToken, true);
  assert.equal(packet.claims.accountsForAll31PostPostPostPostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoPostPostPostPostPostPostPostSuccessorRoots, true);
  assert.equal(packet.claims.emitsExactDeterministic31BucketPostPostPostPostPostPostPostSuccessorRankBoundary, true);
  assert.equal(packet.claims.selectsConvergenceAssemblyBeforeWholeBoundaryBatchCover, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ181Singleton, false);
  assert.equal(packet.claims.descendsIntoQ193Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-post-post-post-post-post-post-successor 31-bucket rank-boundary assembly selects whole q-cover', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_29_Q_AVOIDING_POST_POST_POST_POST_POST_SUCCESSOR_29_BUCKET_POST_POST_POST_POST_POST_POST_SUCCESSOR_30_BUCKET_POST_POST_POST_POST_POST_POST_POST_SUCCESSOR_31_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));
  const expectedTarget = 'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary';
  const expectedNextAction = 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_q_avoiding_batch_cover_or_emit_boundary';
  const expectedRankToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary';
  const expectedQCoverToken = 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_q_avoiding_batch_cover';
  const expectedPrimes = [
    181, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257,
    263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337,
    347, 349, 353, 359, 379,
  ];

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary_convergence_assembly_packet/1');
  assert.equal(packet.status, 'post_29_q_avoiding_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_rank_boundary_convergence_assembly_selects_31_bucket_q_avoiding_cover');
  assert.equal(packet.target, expectedTarget);
  assert.equal(packet.recommendedNextAction, expectedNextAction);
  assert.equal(packet.coversPrimaryNextAction.stepId, expectedTarget);
  assert.equal(packet.oneNextAction.stepId, expectedNextAction);
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken, expectedQCoverToken);
  assert.match(packet.oneNextAction.coveredFamily, /q in \{181,193,197/);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.tokenId, expectedRankToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedDecisionToken.status, 'consumed_by_convergence_assembly');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId, expectedRankToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.bucketCount, 31);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, expectedQCoverToken);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.status, 'selected_for_whole_boundary_q_avoiding_batch_cover');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 31);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.postPostPostPostPostPostPostSuccessorQAvoidingClassCount, '1076809507521202773529514663320305794244106017506794395900320871');

  const summary = packet.postPostPostPostPostPostPostSuccessorQAvoidingCoverSummary;
  assert.equal(summary.bucketCount, 31);
  assert.equal(summary.sourcePostPostPostPostPostPostSuccessorBucketCount, 30);
  assert.equal(summary.sourceRowCount, 718);
  assert.equal(summary.sourcePostPostPostPostPostPostSuccessorQAvoidingClassCount, '9963724410351871391088180714463609317652043690749610411985');
  assert.deepEqual(summary.postPostPostPostPostPostPostSuccessorPrimes, expectedPrimes);
  assert.deepEqual(summary.rootResidueCountsPerClass, [2]);
  assert.equal(summary.postPostPostPostPostPostPostSuccessorRootChildCount, '19927448820703742782176361428927218635304087381499220823970');
  assert.equal(summary.postPostPostPostPostPostPostSuccessorQAvoidingClassCount, '1076809507521202773529514663320305794244106017506794395900320871');

  assert.equal(packet.claims.runsPostPostPostPostPostPostPostSuccessor31BucketRankBoundaryConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostPostPostPostPostPostPostSuccessor31BucketRankBoundaryDecisionToken, true);
  assert.equal(packet.claims.selects31BucketPostPostPostPostPostPostPostSuccessorQAvoidingCoverInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll31PostPostPostPostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.namesFiniteQCoverToken, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ181Singleton, false);
  assert.equal(packet.claims.descendsIntoQ193Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostPostPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 restored-menu sequence stability blocker records unstable transitions', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_RESTORED_MENU_SEQUENCE_STABILITY_BLOCKER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_restored_menu_sequence_stability_blocker_packet/1');
  assert.equal(packet.status, 'restored_menu_sequence_stability_blocked_not_a_recurrence');
  assert.equal(packet.blockedObject.objectId, 'p848_mod50_restored_menu_sequence_recurrence_or_q_partition');
  assert.deepEqual(packet.auditedMenuSequence.menus.map((menu) => menu.familyCount), [220, 230, 240, 250, 260, 280]);
  assert.deepEqual(packet.auditedMenuSequence.menus.map((menu) => menu.knownFailureMatches), [20, 21, 22, 23, 24, 25]);

  assert.equal(packet.transitionAudit.prefixStableTransitionCount, 3);
  assert.deepEqual(packet.transitionAudit.unstableTransitionIds, [
    'SIX_PREFIX_TWENTY_TWO_to_SIX_PREFIX_TWENTY_THREE',
    'SIX_PREFIX_TWENTY_THREE_to_SIX_PREFIX_TWENTY_FOUR',
  ]);
  assert.equal(packet.transitionAudit.deletedFamilyCount, 4);
  assert.deepEqual(packet.transitionAudit.lateLane32WitnessSquares, [121, 361]);
  assert.deepEqual(packet.transitionAudit.lateAddedSquareModuli, [17161, 1849]);
  assert.match(packet.negativeFindings.join(' '), /260 -> 280 jump has no 270-row menu/);

  assert.equal(packet.deterministicBoundary.boundaryId, 'p848_mod50_restored_menu_sequence_stability_boundary');
  assert.equal(
    packet.recommendedNextAction,
    'restore_p848_mod50_menu_generator_or_prove_symbolic_relevant_pair_recurrence',
  );
  assert.equal(packet.claims.auditsRestoredMenuSequence, true);
  assert.equal(packet.claims.provesEarlyPrefixStabilityOnly, true);
  assert.equal(packet.claims.provesSequenceNotStableRecurrence, true);
  assert.equal(packet.claims.namesMissingGeneratorOrIntermediateSource, true);
  assert.equal(packet.claims.uses40501PlusRollout, false);
  assert.equal(packet.claims.provesRelevantPairEnumerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.closesContrastOnlyRecombination, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 menu-generator restoration audit separates chunk provenance from generator source', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_MENU_GENERATOR_RESTORATION_AUDIT_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_menu_generator_restoration_audit_packet/1');
  assert.equal(packet.status, 'mod50_menu_generator_restoration_blocked_chunk_source_only');
  assert.equal(packet.blockedObject.objectId, 'p848_mod50_family_menu_generator_or_symbolic_recurrence');

  assert.equal(packet.restoredFiniteSources.familyMenus.menuCount, 6);
  assert.deepEqual(packet.restoredFiniteSources.familyMenus.familyCounts, [220, 230, 240, 250, 260, 280]);
  assert.equal(packet.restoredFiniteSources.familyMenus.richestMenuFamilyCount, 280);
  assert.equal(packet.restoredFiniteSources.familyMenus.richestMenuKnownFailureMatches, 25);
  assert.equal(packet.restoredFiniteSources.familyMenus.richestMenuNextUnmatched, 137720141);
  assert.equal(packet.restoredFiniteSources.chunkedDirectFailureProvenance.summaryCount, 6);
  assert.equal(packet.restoredFiniteSources.chunkedDirectFailureProvenance.chunkPacketCount, 50);
  assert.equal(packet.restoredFiniteSources.singletonCrtProvenance.packetCount, 6);
  assert.deepEqual(packet.restoredFiniteSources.chunkedDirectFailureProvenance.directFailures, [
    90512581,
    102428617,
    106393589,
    127484267,
    127682743,
    136702637,
  ]);

  assert(packet.localSourceAudit.missingSourceIds.includes('family_menu_generator_command'));
  assert(packet.localSourceAudit.missingSourceIds.includes('anchor_chunked_frontier_source_implementation'));
  assert(packet.localSourceAudit.missingSourceIds.includes('anchor_singleton_crt_source_implementation'));
  assert.equal(packet.reconstructionAttempt.status, 'blocked_as_unbounded_naive_cartesian_probe');
  assert.equal(packet.deterministicBoundary.boundaryId, 'p848_mod50_menu_generator_restoration_boundary');
  assert.equal(
    packet.recommendedNextAction,
    'derive_p848_mod50_bounded_crt_menu_enumerator_or_restore_original_generator',
  );

  assert.equal(packet.claims.auditsGeneratorRestorationSource, true);
  assert.equal(packet.claims.provesChunkedDirectFailureSourceExists, true);
  assert.equal(packet.claims.provesSingletonCrtPacketsExist, true);
  assert.equal(packet.claims.provesFamilyMenuGeneratorAbsentLocally, true);
  assert.equal(packet.claims.namesBoundedCrtEnumeratorSuccessor, true);
  assert.equal(packet.claims.uses40501PlusRollout, false);
  assert.equal(packet.claims.provesBoundedMenuEnumerator, false);
  assert.equal(packet.claims.provesSymbolicRelevantPairRecurrence, false);
  assert.equal(packet.claims.provesRelevantPairEnumerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.closesContrastOnlyRecombination, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 bounded CRT enumerator audit proves no smaller restored-menu omissions', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_BOUNDED_CRT_MENU_ENUMERATOR_AUDIT_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_bounded_crt_menu_enumerator_audit_packet/1');
  assert.equal(packet.status, 'mod50_bounded_crt_menu_enumerator_exact_restored_menu_reproduction_verified');
  assert.equal(packet.boundedEnumerator.objectId, 'p848_mod50_bounded_crt_representative_enumerator');
  assert.equal(packet.boundedEnumeratorAudit.menuCount, 6);
  assert.equal(packet.boundedEnumeratorAudit.allMenuRowsContained, true);
  assert.equal(packet.boundedEnumeratorAudit.allNoSmallerExtras, true);
  assert.equal(packet.boundedEnumeratorAudit.exactOrderedListReproduction, true);
  assert.equal(packet.boundedEnumeratorAudit.totalMissing, 0);
  assert.equal(packet.boundedEnumeratorAudit.totalSmallerExtra, 0);
  assert.equal(packet.boundedEnumeratorAudit.totalSameBoundExtra, 1);
  assert.equal(packet.boundedEnumeratorAudit.duplicateTiePolicyOpen, false);

  const twentyFour = packet.boundedEnumeratorAudit.menus.find((menu) => menu.label === 'SIX_PREFIX_TWENTY_FOUR');
  assert.equal(twentyFour.enumeratedSolutionCount, 281);
  assert.equal(twentyFour.menuRowCount, 280);
  assert.equal(twentyFour.sameBoundExtraCount, 1);
  assert.deepEqual(twentyFour.sameBoundExtraSample.tuple, [9, 121, 4, 49, 1681, 529]);
  assert.equal(twentyFour.sameBoundExtraSample.tupleKey, '9, 11^2, 4, 7^2, 41^2, 23^2');

  const scriptPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'compute',
    'problem848_mod50_bounded_crt_menu_enumerator.mjs',
  );
  const computed = JSON.parse(execFileSync('node', [scriptPath], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  }));
  assert.equal(computed.summary.allMenuRowsContained, true);
  assert.equal(computed.summary.allNoSmallerExtras, true);
  assert.equal(computed.summary.exactOrderedListReproduction, true);
  assert.equal(computed.summary.totalMissing, packet.boundedEnumeratorAudit.totalMissing);
  assert.equal(computed.summary.totalSmallerExtra, packet.boundedEnumeratorAudit.totalSmallerExtra);
  assert.equal(computed.summary.totalSameBoundExtra, packet.boundedEnumeratorAudit.totalSameBoundExtra);

  assert.equal(packet.claims.derivesBoundedMenuEnumerator, true);
  assert.equal(packet.claims.verifiesRestoredMenuRowsContained, true);
  assert.equal(packet.claims.provesNoSmallerRepresentativesOmitted, true);
  assert.equal(packet.claims.provesExactMenuListReproduction, true);
  assert.equal(packet.claims.provesDuplicateTiePolicy, true);
  assert.equal(packet.claims.provesOriginalGeneratorRestored, false);
  assert.equal(packet.claims.uses40501PlusRollout, false);
  assert.equal(packet.claims.provesRelevantPairEnumerator, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 exact bounded CRT menu replay theorem stays finite-scope', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_exact_bounded_crt_menu_replay_theorem_packet/1');
  assert.equal(packet.status, 'mod50_exact_bounded_crt_menu_replay_theorem_promoted_recurrence_boundary_open');
  assert.equal(packet.theoremObject.theoremId, 'p848_mod50_exact_bounded_crt_menu_replay_v1');
  assert.equal(packet.finiteReplayTheorem.menuCount, 6);
  assert.equal(packet.finiteReplayTheorem.allMenuRowsContained, true);
  assert.equal(packet.finiteReplayTheorem.allNoSmallerExtras, true);
  assert.equal(packet.finiteReplayTheorem.exactOrderedListReproduction, true);
  assert.equal(packet.finiteReplayTheorem.totalMissing, 0);
  assert.equal(packet.finiteReplayTheorem.totalSmallerExtra, 0);
  assert.equal(packet.finiteReplayTheorem.totalSameBoundExtra, 1);
  assert.equal(packet.finiteReplayTheorem.duplicateTiePolicy.duplicateTiePolicyOpen, false);
  assert.equal(
    packet.deterministicBoundary.boundaryId,
    'p848_mod50_all_future_recurrence_source_boundary_after_bounded_replay_theorem',
  );
  assert.equal(packet.recommendedNextAction, 'derive_p848_mod50_all_future_recurrence_or_emit_source_theorem_blocker');

  assert.equal(packet.claims.promotesFiniteReplayTheorem, true);
  assert.equal(packet.claims.provesBoundedMenuEnumerator, true);
  assert.equal(packet.claims.provesExactMenuListReproduction, true);
  assert.equal(packet.claims.provesOriginalGeneratorRestored, false);
  assert.equal(packet.claims.uses40501PlusRollout, false);
  assert.equal(packet.claims.provesSymbolicRelevantPairRecurrence, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 p4217 post-p479 convergence assembly chooses a ledgered split, not a selector ladder', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_P479_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_post_p479_convergence_assembly_packet/1');
  assert.equal(packet.status, 'post_p479_convergence_assembly_selects_explicit_p479_availability_split');
  assert.equal(packet.parentAction.stepId, 'run_p848_convergence_assembly_after_q97_p151_p479_leaf_resolution');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.openFrontierObligationCountBeforeCurrentLeaf, 21);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.openFrontierObligationCountAfterRefresh, 34);

  const token = packet.finiteMeasureOrNoMeasureYet.selectedFiniteToken;
  assert.equal(token.tokenId, 'p443_q97_p479_availability_residue_partition');
  assert.equal(token.endpointPrime, 479);
  assert.equal(token.endpointPrimeSquare, 229441);

  assert.equal(packet.selectedHandoff.type, 'explicitly_ledgered_p479_availability_split');
  assert.equal(
    packet.selectedHandoff.recommendedNextAction,
    'split_p848_p4217_complement_p61_q101_p443_q97_child_by_p479_availability_with_ledger_token',
  );
  assert.match(packet.selectedHandoff.wholeFamilyCovered, /p443\/q97 square-obstruction child/);
  assert.match(packet.selectedHandoff.ifStepFailsBoundary, /do not introduce a new selector/);
  assert.equal(
    packet.oneNextAction.stepId,
    'split_p848_p4217_complement_p61_q101_p443_q97_child_by_p479_availability_with_ledger_token',
  );
  assert.equal(packet.claims.runsPostP479ConvergenceAssembly, true);
  assert.equal(packet.claims.selectsExplicitP479AvailabilitySplit, true);
  assert.equal(packet.claims.recordsFiniteLedgerToken, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.provesP479Availability, false);
  assert.equal(packet.claims.provesQ97ChildCoverage, false);
  assert.equal(packet.claims.provesP443UnavailableComplementClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 p4217 p479 availability split consumes the finite token and leaves q127 open', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_COMPLEMENT_P61_Q101_P443_Q97_P479_AVAILABILITY_SPLIT_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_complement_p61_q101_p443_q97_p479_availability_split/1');
  assert.equal(packet.status, 'first_p479_available_q127_square_obstruction_subclass_emitted');
  assert.equal(packet.target, 'split_p848_p4217_complement_p61_q101_p443_q97_child_by_p479_availability_with_ledger_token');

  assert.equal(packet.availabilitySplit.endpointPrime, 479);
  assert.equal(packet.availabilitySplit.endpointPrimeSquare, 229441);
  assert.equal(packet.availabilitySplit.maxK, 1139);
  assert.equal(packet.availabilitySplit.kFormulaInSourceParameter, 'k_479(w) = (131596*w + 250) mod 229441');
  assert.equal(packet.availabilitySplit.coefficientGcdWithPrimeSquare, 1);
  assert.equal(packet.availabilitySplit.availableResidueCount, 1140);
  assert.equal(packet.availabilitySplit.unavailableResidueCount, 228301);
  assert.deepEqual(packet.availabilitySplit.firstAvailableResidue, {
    wResidueModuloEndpointPrimeSquare: 0,
    k: 250,
  });
  assert.deepEqual(packet.availabilitySplit.firstUnavailableResidue, {
    wResidueModuloEndpointPrimeSquare: 1,
    k: 131846,
  });

  assert.equal(packet.firstAvailableFamily.parameterization, 'w = 229441*z');
  assert.equal(packet.firstAvailableFamily.endpoint.prime, 479);
  assert.equal(packet.firstAvailableFamily.endpoint.k, 250);
  assert.equal(packet.firstAvailableFamily.endpoint.delta, -6264);
  assert.equal(packet.representativeAudit.squarefreeStatus, 'exact_squarefree');
  assert.equal(packet.representativeAudit.representativeAvoidsFirstObstructionModulo127Square, true);

  assert.equal(packet.firstAvailableSquareObstruction.obstructionPrime, 127);
  assert.equal(packet.firstAvailableSquareObstruction.obstructionSquare, 16129);
  assert.deepEqual(packet.firstAvailableSquareObstruction.rootResiduesModuloObstructionSquare, [4391, 15510]);
  assert.equal(packet.firstAvailableSquareObstruction.selectedRootResidueModuloObstructionSquare, 4391);
  assert.equal(packet.firstAvailableSquareObstruction.squareDivisibilityWitness.residueModuloObstructionSquare, 0);

  assert.deepEqual(
    packet.ledgerChildren.map((child) => child.childId),
    [
      'p479_available_residue_partition',
      'p479_unavailable_complement',
      'p479_available_q127_square_obstruction_child',
    ],
  );
  assert.equal(packet.claims.provesEndpointFormula, true);
  assert.equal(packet.claims.provesAvailabilitySplit, true);
  assert.equal(packet.claims.consumesFiniteP479AvailabilityToken, true);
  assert.equal(packet.claims.provesFirstAvailableSquareObstructionChild, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.provesP479AvailableFamilySquarefreeHitting, false);
  assert.equal(packet.claims.provesP479UnavailableComplementClosed, false);
  assert.equal(packet.claims.provesQ127ChildCoverage, false);
  assert.equal(packet.claims.provesQ97ChildCoverage, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_p479_availability_split_and_q127_child_emission',
  );
});

test('problem 848 post-p479 availability split assembly selects a bulk cover, not q127 descent', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_P479_AVAILABILITY_SPLIT_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_p479_availability_split_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_p479_availability_split_convergence_assembly_selects_available_residue_bulk_cover',
  );
  assert.equal(
    packet.target,
    'run_p848_convergence_assembly_after_p479_availability_split_and_q127_child_emission',
  );
  assert.equal(packet.frontierComparison.previousRefreshValue, 35);
  assert.equal(packet.frontierComparison.currentRefreshValue, 38);
  assert.equal(packet.frontierComparison.delta, 3);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.selectedFiniteTokenConsumed.endpointPrime, 479);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.selectedFiniteTokenConsumed.endpointPrimeSquare, 229441);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.selectedFiniteTokenConsumed.availableResidueCount, 1140);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.selectedFiniteTokenConsumed.unavailableResidueCount, 228301);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, 'p443_q97_p479_available_residue_set');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.residueCount, 1140);
  assert.equal(packet.compressionCandidate.kind, 'bulk_square_obstruction_cover');
  assert.equal(packet.compressionCandidate.coveredFamily.includes('1140 p479-available'), true);
  assert.equal(
    packet.oneNextAction.stepId,
    'bulk_cover_p848_p4217_p443_q97_p479_available_residue_square_obstructions_or_emit_survivor_boundary',
  );
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken.includes('1140 available residues'), true);
  assert.equal(packet.claims.runsPostP479AvailabilitySplitConvergenceAssembly, true);
  assert.equal(packet.claims.selectsBulkCoverInsteadOfQ127Descent, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.provesBulkCover, false);
  assert.equal(packet.claims.provesQ127ChildCoverage, false);
  assert.equal(packet.claims.provesP479AvailableCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'bulk_cover_p848_p4217_p443_q97_p479_available_residue_square_obstructions_or_emit_survivor_boundary',
  );
});

test('problem 848 p479-available residue bulk cover classifies all residues without q-child descent', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_AVAILABLE_RESIDUE_BULK_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_available_residue_bulk_square_obstruction_cover/1',
  );
  assert.equal(packet.status, 'all_p479_available_residue_classes_have_square_obstruction_child');
  assert.equal(
    packet.target,
    'bulk_cover_p848_p4217_p443_q97_p479_available_residue_square_obstructions_or_emit_survivor_boundary',
  );
  assert.equal(packet.screen.endpointPrime, 479);
  assert.equal(packet.screen.endpointPrimeSquare, 229441);
  assert.equal(packet.screen.availableResidueCount, 1140);
  assert.equal(packet.screen.checkedResidueCount, 1140);
  assert.equal(packet.screen.coveredResidueCount, 1140);
  assert.equal(packet.screen.survivorResidueCount, 0);
  assert.equal(packet.screen.maxCheckedPrime, 2000);
  assert.equal(packet.screen.maxObstructionPrime, 173);
  assert.equal(packet.screen.maxObstructionSquare, 29929);
  assert.equal(packet.screen.obstructionPrimeCount, 30);
  assert.equal(packet.obstructionRows.length, 1140);
  assert.deepEqual(packet.survivorRows, []);

  assert.equal(packet.representativeConsistency.firstResidueMatchesP479Split, true);
  assert.equal(packet.representativeConsistency.firstObstructionPrimeMatchesP479Split, true);
  assert.equal(packet.representativeConsistency.firstRootResiduesMatchP479Split, true);

  const firstRow = packet.obstructionRows[0];
  assert.equal(firstRow.residueModulo479Square, 0);
  assert.equal(firstRow.k, 250);
  assert.equal(firstRow.delta, -6264);
  assert.equal(firstRow.obstructionPrime, 127);
  assert.equal(firstRow.obstructionSquare, 16129);
  assert.deepEqual(firstRow.rootResiduesModuloObstructionSquare, [4391, 15510]);

  const histogram = new Map(packet.obstructionHistogram.map((row) => [row.obstructionPrime, row]));
  assert.equal(histogram.get(2).residueClassCount, 285);
  assert.equal(histogram.get(109).residueClassCount, 351);
  assert.equal(histogram.get(113).residueClassCount, 178);
  assert.equal(histogram.get(127).residueClassCount, 97);
  assert.equal(histogram.get(173).residueClassCount, 1);

  assert.equal(packet.claims.classifiesAllP479AvailableResidueClasses, true);
  assert.equal(packet.claims.provesSquareObstructionChildForEachCoveredResidueClass, true);
  assert.equal(packet.claims.consumesP479AvailableResidueSetToken, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.emitsExactSurvivorBoundary, false);
  assert.equal(packet.claims.provesP479AvailableFamilyCoverage, false);
  assert.equal(packet.claims.provesQ127ChildCoverage, false);
  assert.equal(packet.claims.provesP479UnavailableComplementClosed, false);
  assert.equal(packet.claims.provesQ97ChildCoverage, false);
  assert.equal(packet.claims.provesP443UnavailableComplementClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'compress_p848_p4217_p443_q97_p479_available_obstruction_buckets_or_emit_bucket_boundaries',
  );
});

test('problem 848 post-p479 available bulk-cover assembly selects bucket compression', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_P479_AVAILABLE_BULK_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_p479_available_bulk_cover_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_p479_available_bulk_cover_convergence_assembly_selects_bucket_compression',
  );
  assert.equal(
    packet.target,
    'compress_p848_p4217_p443_q97_p479_available_obstruction_buckets_or_emit_bucket_boundaries',
  );
  assert.equal(packet.frontierComparison.previousRefreshValueBeforeBulkCover, 39);
  assert.equal(packet.frontierComparison.currentRefreshValueAfterBulkCover, 40);
  assert.equal(packet.frontierComparison.delta, 1);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedFiniteToken.tokenId, 'p443_q97_p479_available_residue_set');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedFiniteToken.residueCount, 1140);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedFiniteToken.survivorResidueCount, 0);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, 'p443_q97_p479_available_obstruction_prime_buckets');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 30);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.totalResidueClasses, 1140);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.maxObstructionPrime, 173);
  assert.deepEqual(
    packet.bucketCompressionCandidate.largestBuckets.slice(0, 5),
    [
      { obstructionPrime: 109, residueClassCount: 351 },
      { obstructionPrime: 2, residueClassCount: 285 },
      { obstructionPrime: 113, residueClassCount: 178 },
      { obstructionPrime: 127, residueClassCount: 97 },
      { obstructionPrime: 131, residueClassCount: 48 },
    ],
  );
  assert.equal(
    packet.oneNextAction.stepId,
    'compress_p848_p4217_p443_q97_p479_available_obstruction_buckets_or_emit_bucket_boundaries',
  );
  assert.equal(packet.oneNextAction.coveredFamily.includes('complete 30-bucket'), true);
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken.includes('30 buckets'), true);
  assert.equal(packet.claims.runsPostP479AvailableBulkCoverConvergenceAssembly, true);
  assert.equal(packet.claims.selectsBucketCompressionInsteadOfQChildDescent, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.provesBucketCompression, false);
  assert.equal(packet.claims.provesQ127ChildCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'compress_p848_p4217_p443_q97_p479_available_obstruction_buckets_or_emit_bucket_boundaries',
  );
});

test('problem 848 p479 obstruction buckets compress to terminal, partial, and q109 boundaries', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_AVAILABLE_OBSTRUCTION_BUCKET_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_available_obstruction_bucket_boundary/1',
  );
  assert.equal(
    packet.status,
    'p479_available_obstruction_buckets_compressed_to_terminal_and_partial_boundaries',
  );
  assert.equal(
    packet.target,
    'compress_p848_p4217_p443_q97_p479_available_obstruction_buckets_or_emit_bucket_boundaries',
  );
  assert.equal(packet.compressionSummary.inputBucketCount, 30);
  assert.equal(packet.compressionSummary.totalResidueClasses, 1140);
  assert.equal(packet.compressionSummary.terminalFullFamilyBucketCount, 19);
  assert.equal(packet.compressionSummary.terminalFullFamilyResidueClassCount, 422);
  assert.equal(packet.compressionSummary.partialTwoRootBucketCount, 10);
  assert.equal(packet.compressionSummary.partialTwoRootResidueClassCount, 367);
  assert.equal(packet.compressionSummary.partialRootChildCount, 734);
  assert.equal(packet.compressionSummary.partialQAvoidingClassCount, 5564177);
  assert.equal(packet.compressionSummary.nonuniformBucketCount, 1);
  assert.equal(packet.compressionSummary.maxTerminalObstructionPrime, 101);
  assert.equal(packet.compressionSummary.maxPartialObstructionPrime, 173);

  const tokenIds = packet.finiteTokenTransition.producedFiniteTokens.map((token) => token.tokenId);
  assert.deepEqual(tokenIds, [
    'p443_q97_p479_terminal_full_family_square_obstruction_buckets',
    'p443_q97_p479_partial_two_root_obstruction_bucket_boundaries',
    'p443_q97_p479_nonuniform_obstruction_bucket_boundaries',
  ]);
  assert.deepEqual(packet.finiteTokenTransition.producedFiniteTokens[2].obstructionPrimes, [109]);

  const bucketByPrime = new Map(packet.bucketBoundaries.map((bucket) => [bucket.obstructionPrime, bucket]));
  assert.equal(bucketByPrime.get(2).mode, 'terminal_full_family_square_obstruction');
  assert.equal(bucketByPrime.get(2).residueClassCount, 285);
  assert.equal(
    bucketByPrime.get(2).familyStepModuloObstructionSquare.rootCoverage,
    'all descendant parameter residues modulo q^2 are square-obstructed',
  );
  assert.equal(bucketByPrime.get(2).rows[0].rootResidueCount, 4);

  assert.equal(bucketByPrime.get(109).mode, 'nonuniform_bucket_boundary');
  assert.equal(bucketByPrime.get(109).residueClassCount, 351);
  assert.equal(bucketByPrime.get(109).status, 'nonuniform_boundary_requires_manual_successor');

  assert.equal(bucketByPrime.get(113).mode, 'partial_two_root_square_obstruction_children');
  assert.equal(bucketByPrime.get(113).residueClassCount, 178);
  assert.equal(bucketByPrime.get(113).rootChildCount, 356);
  assert.equal(bucketByPrime.get(113).qAvoidingClassCount, 2272526);
  assert.equal(bucketByPrime.get(127).mode, 'partial_two_root_square_obstruction_children');
  assert.equal(bucketByPrime.get(127).residueClassCount, 97);
  assert.equal(bucketByPrime.get(127).rootChildCount, 194);
  assert.equal(bucketByPrime.get(127).qAvoidingClassCount, 1564319);

  assert.equal(packet.claims.consumesP479AvailableObstructionBucketToken, true);
  assert.equal(packet.claims.provesTerminalFullFamilyClosureForTerminalBuckets, true);
  assert.equal(packet.claims.emitsExactPartialBucketBoundaries, true);
  assert.equal(packet.claims.emitsExactNonuniformBucketBoundary, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ127Singleton, false);
  assert.equal(packet.claims.provesPartialBucketClosure, false);
  assert.equal(packet.claims.provesNonuniformBucketClosure, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_p479_obstruction_bucket_boundaries',
  );
});

test('problem 848 post-p479 bucket-boundary assembly selects q109 whole-bucket structure', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_P479_OBSTRUCTION_BUCKET_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_p479_obstruction_bucket_boundary_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_p479_obstruction_bucket_boundary_convergence_assembly_selects_q109_nonuniform_bucket_structure',
  );
  assert.equal(
    packet.target,
    'run_p848_convergence_assembly_after_p479_obstruction_bucket_boundaries',
  );
  assert.equal(packet.frontierComparison.previousRefreshValueBeforeBucketBoundary, 40);
  assert.equal(packet.frontierComparison.currentRefreshValueAfterBucketBoundary, 41);
  assert.equal(packet.frontierComparison.delta, 1);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedFiniteToken.tokenId, 'p443_q97_p479_available_obstruction_prime_buckets');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedFiniteToken.bucketCount, 30);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.terminalTokenClosed.bucketCount, 19);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.terminalTokenClosed.residueClassCount, 422);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, 'p443_q97_p479_nonuniform_obstruction_bucket_q109');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.obstructionPrime, 109);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.residueClassCount, 351);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.parallelOpenFiniteToken.bucketCount, 10);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.parallelOpenFiniteToken.residueClassCount, 367);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.parallelOpenFiniteToken.rootChildCount, 734);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.parallelOpenFiniteToken.qAvoidingClassCount, 5564177);
  assert.equal(
    packet.oneNextAction.stepId,
    'derive_p848_p4217_p443_q97_p479_q109_nonuniform_bucket_structure_or_emit_subbucket_boundaries',
  );
  assert.equal(packet.oneNextAction.coveredFamily.includes('351 p479-available residue rows'), true);
  assert.equal(packet.claims.runsPostP479ObstructionBucketBoundaryConvergenceAssembly, true);
  assert.equal(packet.claims.selectsQ109BucketStructureInsteadOfQChildDescent, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ109Singleton, false);
  assert.equal(packet.claims.descendsIntoQ127Singleton, false);
  assert.equal(packet.claims.provesTerminalBucketClosures, true);
  assert.equal(packet.claims.provesQ109BucketClosure, false);
  assert.equal(packet.claims.provesPartialBucketClosure, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'derive_p848_p4217_p443_q97_p479_q109_nonuniform_bucket_structure_or_emit_subbucket_boundaries',
  );
});

test('problem 848 q109 nonuniform bucket splits into regular and singular subbucket boundaries', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_Q109_NONUNIFORM_BUCKET_STRUCTURE_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_q109_nonuniform_bucket_structure/1',
  );
  assert.equal(
    packet.status,
    'q109_nonuniform_bucket_split_into_regular_and_singular_subbucket_boundaries',
  );
  assert.equal(
    packet.target,
    'derive_p848_p4217_p443_q97_p479_q109_nonuniform_bucket_structure_or_emit_subbucket_boundaries',
  );
  assert.equal(packet.bucket.finiteTokenId, 'p443_q97_p479_nonuniform_obstruction_bucket_q109');
  assert.equal(packet.bucket.obstructionPrime, 109);
  assert.equal(packet.bucket.obstructionSquare, 11881);
  assert.equal(packet.bucket.inputResidueClassCount, 351);
  assert.equal(packet.bucket.allRowsInvertibleModulo109Square, true);
  assert.equal(packet.bucket.allRowsGcdOneModulo109Square, true);
  assert.equal(packet.bucket.otherProfileRowCount, 0);
  assert.equal(packet.structureSummary.regularTwoRootRowCount, 350);
  assert.equal(packet.structureSummary.singular109RootRowCount, 1);
  assert.equal(packet.structureSummary.totalRootChildCount, 809);
  assert.equal(packet.structureSummary.totalQAvoidingClassCount, 4169422);
  assert.equal(packet.structureSummary.regularRootChildCount, 700);
  assert.equal(packet.structureSummary.regularQAvoidingClassCount, 4157650);
  assert.equal(packet.structureSummary.singularRootChildCount, 109);
  assert.equal(packet.structureSummary.singularQAvoidingClassCount, 11772);

  const tokenIds = packet.finiteTokenTransition.producedFiniteTokens.map((token) => token.tokenId);
  assert.deepEqual(tokenIds, [
    'p443_q97_p479_q109_regular_two_root_subbucket_boundary',
    'p443_q97_p479_q109_singular_109_root_subbucket_boundary',
  ]);

  const subbucketById = new Map(packet.subbucketBoundaries.map((subbucket) => [subbucket.subbucketId, subbucket]));
  assert.equal(subbucketById.get('q109_regular_invertible_two_root_rows').residueClassCount, 350);
  assert.equal(subbucketById.get('q109_regular_invertible_two_root_rows').rootChildCount, 700);
  assert.equal(subbucketById.get('q109_singular_invertible_109_root_row').residueClassCount, 1);
  assert.equal(subbucketById.get('q109_singular_invertible_109_root_row').rootChildCount, 109);
  assert.equal(packet.singularRow.residueModulo479Square, 171005);
  assert.equal(packet.singularRow.k, 950);
  assert.equal(packet.singularRow.delta, -23764);
  assert.equal(packet.singularRow.deltaModulo109Square, 11879);
  assert.equal(packet.singularRow.discriminantModulo109Square, 0);
  assert.equal(packet.singularRow.rootResidueCount, 109);

  assert.equal(packet.claims.consumesQ109NonuniformBucketToken, true);
  assert.equal(packet.claims.allQ109RowsClassified, true);
  assert.equal(packet.claims.emitsRegularTwoRootSubbucketBoundary, true);
  assert.equal(packet.claims.emitsSingular109RootSubbucketBoundary, true);
  assert.equal(packet.claims.emitsExactSubbucketBoundaries, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ109Singleton, false);
  assert.equal(packet.claims.descendsIntoQ127Singleton, false);
  assert.equal(packet.claims.provesQ109BucketClosure, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_q109_subbucket_boundaries',
  );
});

test('problem 848 post-q109 assembly selects the combined q-avoiding batch cover', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_Q109_SUBBUCKET_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_q109_subbucket_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_q109_subbucket_convergence_assembly_selects_q_avoiding_batch_cover',
  );
  assert.equal(packet.target, 'run_p848_convergence_assembly_after_q109_subbucket_boundaries');
  assert.equal(packet.frontierComparison.previousRefreshValueBeforeQ109Structure, 42);
  assert.equal(packet.frontierComparison.currentRefreshValueAfterQ109Structure, 43);
  assert.equal(packet.frontierComparison.delta, 1);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedFiniteToken.tokenId, 'p443_q97_p479_nonuniform_obstruction_bucket_q109');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedFiniteToken.residueClassCount, 351);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedTerminalToken.bucketCount, 19);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedTerminalToken.residueClassCount, 422);
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId,
    'p443_q97_p479_partial_and_q109_q_avoiding_boundary_families',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.boundaryFamilyCount, 12);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.sourcePartialBucketCount, 10);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.q109SubbucketCount, 2);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.residueClassCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.rootChildCount, 1543);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.qAvoidingClassCount, 9733599);
  assert.equal(
    packet.oneNextAction.stepId,
    'derive_p848_p4217_p443_q97_p479_partial_and_q109_q_avoiding_batch_cover_or_emit_ranked_boundary',
  );
  assert.equal(packet.oneNextAction.coveredFamily.includes('9733599 q-avoiding descendant classes'), true);
  assert.equal(packet.claims.runsPostQ109SubbucketConvergenceAssembly, true);
  assert.equal(packet.claims.selectsQAvoidingBatchCoverInsteadOfQChildDescent, true);
  assert.equal(packet.claims.consumesQ109StructureIntoAssembly, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ109Singleton, false);
  assert.equal(packet.claims.descendsIntoQ127Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesQ109BucketClosure, false);
  assert.equal(packet.claims.provesPartialBucketClosure, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'derive_p848_p4217_p443_q97_p479_partial_and_q109_q_avoiding_batch_cover_or_emit_ranked_boundary',
  );
});

test('problem 848 q-avoiding batch cover classifies all post-q109 boundary families', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_Q_AVOIDING_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_q_avoiding_batch_cover/1',
  );
  assert.equal(
    packet.status,
    'all_post_q109_q_avoiding_boundary_classes_have_next_square_obstruction_child',
  );
  assert.equal(
    packet.target,
    'derive_p848_p4217_p443_q97_p479_partial_and_q109_q_avoiding_batch_cover_or_emit_ranked_boundary',
  );
  assert.equal(packet.batchCoverSummary.sourceBoundaryFamilyCount, 12);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.qAvoidingClassCount, 9733599);
  assert.equal(packet.batchCoverSummary.classifiedQAvoidingClassCount, 9733599);
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorQAvoidingClassCount, 0);
  assert.equal(packet.batchCoverSummary.nextObstructionPrimeBucketCount, 13);
  assert.equal(packet.batchCoverSummary.minNextObstructionPrime, 113);
  assert.equal(packet.batchCoverSummary.maxNextObstructionPrime, 191);
  assert.deepEqual(packet.batchCoverSummary.nextRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalNextRootChildCount, 19467198);
  assert.equal(packet.batchCoverSummary.totalNextQAvoidingClassCount, 170308883793);
  assert.equal(packet.batchCoverSummary.maxCheckedPrime, 2000);

  assert.equal(
    packet.finiteTokenTransition.consumedFiniteToken.tokenId,
    'p443_q97_p479_partial_and_q109_q_avoiding_boundary_families',
  );
  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.boundaryFamilyCount, 12);
  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.sourceRowCount, 718);
  assert.equal(packet.finiteTokenTransition.consumedFiniteToken.qAvoidingClassCount, 9733599);

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_q_avoiding_next_obstruction_root_children').rootChildCount,
    19467198,
  );
  assert.equal(
    producedById.get('p443_q97_p479_q_avoiding_next_rank_boundary').qAvoidingClassCount,
    170308883793,
  );
  assert.equal(packet.oneNextAction.stepId, 'run_p848_convergence_assembly_after_partial_and_q109_q_avoiding_batch_cover');
  assert.match(packet.oneNextAction.coveredFamily, /13 next-obstruction-prime buckets/);
  assert.equal(packet.claims.consumesPartialAndQ109QAvoidingBoundaryToken, true);
  assert.equal(packet.claims.classifiesAllTwelveBoundaryFamilies, true);
  assert.equal(packet.claims.classifiesAllQAvoidingClasses, true);
  assert.equal(packet.claims.survivorSourceRowCount, 0);
  assert.equal(packet.claims.survivorQAvoidingClassCount, 0);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesNextRootChildrenClosed, false);
  assert.equal(packet.claims.provesNextQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_partial_and_q109_q_avoiding_batch_cover',
  );
});

test('problem 848 post-q-avoiding batch-cover assembly selects 13-bucket rank compression', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_q_avoiding_batch_cover_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_q_avoiding_batch_cover_convergence_assembly_selects_13_bucket_rank_compression',
  );
  assert.equal(
    packet.target,
    'run_p848_convergence_assembly_after_partial_and_q109_q_avoiding_batch_cover',
  );
  assert.equal(packet.frontierComparison.previousRefreshValueBeforeQAvoidingBatchCover, 44);
  assert.equal(packet.frontierComparison.currentRefreshValueAfterQAvoidingBatchCover, 45);
  assert.equal(packet.frontierComparison.delta, 1);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.consumedFiniteToken.tokenId,
    'p443_q97_p479_partial_and_q109_q_avoiding_boundary_families',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedFiniteToken.boundaryFamilyCount, 12);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedFiniteToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.consumedFiniteToken.qAvoidingClassCount, 9733599);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorSourceRowCount, 0);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorQAvoidingClassCount, 0);
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId,
    'p443_q97_p479_q_avoiding_next_prime_bucket_rank_boundary',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 13);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.minNextObstructionPrime, 113);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.maxNextObstructionPrime, 191);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.rootChildCount, 19467198);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.qAvoidingClassCount, 170308883793);
  assert.equal(packet.nextPrimeBucketSummary.bucketCount, 13);
  assert.equal(packet.nextPrimeBucketSummary.totalSourceRowCount, 718);
  assert.equal(packet.nextPrimeBucketSummary.totalQAvoidingClassCount, 9733599);
  assert.equal(packet.nextPrimeBucketSummary.totalNextRootChildCount, 19467198);
  assert.equal(packet.nextPrimeBucketSummary.totalNextQAvoidingClassCount, 170308883793);
  assert.deepEqual(
    packet.nextPrimeBucketSummary.buckets.map((bucket) => bucket.nextObstructionPrime),
    [113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 181, 191],
  );
  assert.equal(
    packet.oneNextAction.stepId,
    'compress_p848_p4217_p443_q97_p479_q_avoiding_next_prime_buckets_or_emit_rank_boundary',
  );
  assert.match(packet.oneNextAction.coveredFamily, /170,308,883,793 next q-avoiding rank classes/);
  assert.equal(packet.claims.runsPostQAvoidingBatchCoverConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPartialAndQ109QAvoidingBoundaryToken, true);
  assert.equal(packet.claims.selects13BucketCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.namesWholeCoveredFamily, true);
  assert.equal(packet.claims.namesFiniteRankToken, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesSourceBoundaryHasNoSurvivors, true);
  assert.equal(packet.claims.provesNextRootChildrenClosed, false);
  assert.equal(packet.claims.provesNextQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'compress_p848_p4217_p443_q97_p479_q_avoiding_next_prime_buckets_or_emit_rank_boundary',
  );
});

test('problem 848 q-avoiding next-prime buckets emit a deterministic rank boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_Q_AVOIDING_NEXT_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_q_avoiding_next_bucket_rank_boundary/1',
  );
  assert.equal(
    packet.status,
    'p479_q_avoiding_next_prime_buckets_deterministic_rank_boundary_emitted',
  );
  assert.equal(
    packet.target,
    'compress_p848_p4217_p443_q97_p479_q_avoiding_next_prime_buckets_or_emit_rank_boundary',
  );
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourceQAvoidingClassCount, 9733599);
  assert.equal(packet.boundarySummary.nextObstructionPrimeBucketCount, 13);
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalNextRootChildCount, 19467198);
  assert.equal(packet.boundarySummary.totalNextQAvoidingClassCount, 170308883793);
  assert.equal(packet.deterministicRankBoundary.consumedFiniteToken, 'p443_q97_p479_q_avoiding_next_prime_bucket_rank_boundary');
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokenCount, 13);
  assert.equal(packet.deterministicRankBoundary.measureStatus, 'finite_rank_token_partitioned_not_decreased');

  const tokens = packet.deterministicRankBoundary.producedFiniteTokens;
  assert.deepEqual(
    tokens.map((token) => token.nextObstructionPrime),
    [113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 181, 191],
  );
  assert.equal(tokens.every((token) => token.rootResidueCountPerClass === 2), true);
  assert.equal(tokens.reduce((sum, token) => sum + token.sourceRowCount, 0), 718);
  assert.equal(tokens.reduce((sum, token) => sum + token.sourceQAvoidingClassCount, 0), 9733599);
  assert.equal(tokens.reduce((sum, token) => sum + token.nextRootChildCount, 0), 19467198);
  assert.equal(tokens.reduce((sum, token) => sum + token.nextQAvoidingClassCount, 0), 170308883793);

  assert.equal(packet.twoRootLaw.status, 'finite_replay_verified');
  assert.equal(packet.twoRootLaw.verifiedRowCount, 718);
  assert.equal(packet.claims.consumesNextPrimeBucketRankToken, true);
  assert.equal(packet.claims.accountsForAllNextPrimeBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoNextRoots, true);
  assert.equal(packet.claims.emitsDeterministic13BucketRankBoundary, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesNextRootChildrenClosed, false);
  assert.equal(packet.claims.provesNextQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_13_bucket_rank_boundary',
  );
});

test('problem 848 post-13-bucket assembly selects a next-rank batch cover', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_13_BUCKET_RANK_BOUNDARY_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_13_bucket_rank_boundary_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_13_bucket_rank_boundary_convergence_assembly_selects_next_rank_batch_cover',
  );
  assert.equal(packet.target, 'run_p848_convergence_assembly_after_13_bucket_rank_boundary');
  assert.equal(packet.frontierComparison.previousRefreshValueAtRankBoundary, 47);
  assert.equal(packet.frontierComparison.currentRefreshValueAfterAssembly, 47);
  assert.equal(packet.frontierComparison.delta, 0);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.assembledRankToken.tokenId,
    'p443_q97_p479_q_avoiding_13_bucket_next_rank_family',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.assembledRankToken.bucketCount, 13);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.assembledRankToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.assembledRankToken.sourceQAvoidingClassCount, 9733599);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.assembledRankToken.rootChildCount, 19467198);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.assembledRankToken.nextQAvoidingClassCount, 170308883793);
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId,
    'p443_q97_p479_q_avoiding_13_bucket_next_rank_batch_cover',
  );
  assert.deepEqual(
    packet.nextPrimeBucketSummary.buckets.map((bucket) => bucket.nextObstructionPrime),
    [113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 181, 191],
  );
  assert.equal(
    packet.oneNextAction.stepId,
    'derive_p848_p4217_p443_q97_p479_next_rank_13_bucket_batch_cover_or_emit_boundary',
  );
  assert.match(packet.oneNextAction.coveredFamily, /170,308,883,793 next q-avoiding classes/);
  assert.equal(packet.claims.runsPost13BucketRankBoundaryConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPost13BucketAssemblyDecisionToken, true);
  assert.equal(packet.claims.selectsNextRankBatchCoverInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll13BucketTokens, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ113Singleton, false);
  assert.equal(packet.claims.descendsIntoQ127Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesNextRootChildrenClosed, false);
  assert.equal(packet.claims.provesNextQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'derive_p848_p4217_p443_q97_p479_next_rank_13_bucket_batch_cover_or_emit_boundary',
  );
});

test('problem 848 next-rank 13-bucket batch cover emits a 15-bucket later boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_NEXT_RANK_13_BUCKET_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_next_rank_13_bucket_batch_cover/1',
  );
  assert.equal(
    packet.status,
    'all_13_bucket_next_rank_q_avoiding_classes_have_later_square_obstruction_child',
  );
  assert.equal(
    packet.target,
    'derive_p848_p4217_p443_q97_p479_next_rank_13_bucket_batch_cover_or_emit_boundary',
  );

  assert.equal(packet.batchCoverSummary.sourceBucketCount, 13);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.sourceNextQAvoidingClassCount, 170308883793);
  assert.equal(packet.batchCoverSummary.classifiedNextQAvoidingClassCount, 170308883793);
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorNextQAvoidingClassCount, 0);
  assert.equal(packet.batchCoverSummary.laterObstructionPrimeBucketCount, 15);
  assert.equal(packet.batchCoverSummary.minLaterObstructionPrime, 127);
  assert.equal(packet.batchCoverSummary.maxLaterObstructionPrime, 199);
  assert.deepEqual(packet.batchCoverSummary.laterRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalLaterRootChildCount, 340617767586);
  assert.equal(packet.batchCoverSummary.totalLaterQAvoidingClassCount, 3652250197976151);

  assert.deepEqual(
    packet.laterObstructionPrimeBuckets.map((bucket) => bucket.laterObstructionPrime),
    [127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 191, 193, 197, 199],
  );
  assert.equal(
    packet.laterObstructionPrimeBuckets.reduce((sum, bucket) => sum + bucket.sourceRowCount, 0),
    718,
  );
  assert.equal(
    packet.laterObstructionPrimeBuckets.reduce((sum, bucket) => sum + bucket.sourceNextQAvoidingClassCount, 0),
    170308883793,
  );
  assert.equal(
    packet.laterObstructionPrimeBuckets.reduce((sum, bucket) => sum + bucket.laterRootChildCount, 0),
    340617767586,
  );
  assert.equal(
    packet.laterObstructionPrimeBuckets.reduce((sum, bucket) => sum + bucket.laterQAvoidingClassCount, 0),
    3652250197976151,
  );

  assert.equal(
    packet.finiteTokenTransition.consumedFiniteToken.tokenId,
    'p443_q97_p479_q_avoiding_13_bucket_next_rank_batch_cover',
  );
  assert.deepEqual(
    packet.finiteTokenTransition.producedFiniteTokens.map((token) => token.tokenId),
    [
      'p443_q97_p479_next_rank_later_obstruction_root_children',
      'p443_q97_p479_next_rank_later_q_avoiding_boundary',
    ],
  );
  assert.equal(packet.oneNextAction.stepId, 'run_p848_convergence_assembly_after_next_rank_13_bucket_batch_cover');
  assert.match(packet.oneNextAction.coveredFamily, /15 later-obstruction-prime buckets/);
  assert.equal(packet.claims.consumes13BucketNextRankBatchToken, true);
  assert.equal(packet.claims.classifiesAll13SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllNextQAvoidingClasses, true);
  assert.equal(packet.claims.survivorNextQAvoidingClassCount, 0);
  assert.equal(packet.claims.allRowsHaveTwoLaterRoots, true);
  assert.equal(packet.claims.emitsFifteenLaterPrimeBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesLaterRootChildrenClosed, false);
  assert.equal(packet.claims.provesLaterQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_next_rank_13_bucket_batch_cover',
  );
});

test('problem 848 post-next-rank batch-cover convergence assembly selects 15-bucket compression', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_NEXT_RANK_13_BUCKET_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_next_rank_13_bucket_batch_cover_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_next_rank_13_bucket_batch_cover_convergence_assembly_selects_15_bucket_rank_compression',
  );
  assert.equal(packet.target, 'run_p848_convergence_assembly_after_next_rank_13_bucket_batch_cover');
  assert.equal(
    packet.coversPrimaryNextAction.stepId,
    'run_p848_convergence_assembly_after_next_rank_13_bucket_batch_cover',
  );

  assert.equal(packet.frontierComparison.previousRefreshValueBeforeNextRankBatchCover, 48);
  assert.equal(packet.frontierComparison.currentRefreshValueAfterNextRankBatchCover, 49);
  assert.equal(packet.frontierComparison.delta, 1);

  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId,
    'p443_q97_p479_q_avoiding_13_bucket_next_rank_batch_cover',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceBucketCount, 13);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceNextQAvoidingClassCount, 170308883793);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorNextQAvoidingClassCount, 0);

  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId,
    'p443_q97_p479_next_rank_later_prime_15_bucket_rank_boundary',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 15);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.laterRootChildCount, 340617767586);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.laterQAvoidingClassCount, 3652250197976151);

  assert.equal(packet.laterPrimeBucketSummary.bucketCount, 15);
  assert.deepEqual(
    packet.laterPrimeBucketSummary.laterPrimes,
    [127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 191, 193, 197, 199],
  );
  assert.equal(packet.laterPrimeBucketSummary.sourceRowCount, 718);
  assert.equal(packet.laterPrimeBucketSummary.sourceNextQAvoidingClassCount, 170308883793);
  assert.equal(packet.laterPrimeBucketSummary.classifiedNextQAvoidingClassCount, 170308883793);
  assert.equal(packet.laterPrimeBucketSummary.survivorNextQAvoidingClassCount, 0);
  assert.deepEqual(packet.laterPrimeBucketSummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.laterPrimeBucketSummary.laterRootChildCount, 340617767586);
  assert.equal(packet.laterPrimeBucketSummary.laterQAvoidingClassCount, 3652250197976151);

  assert.equal(
    packet.oneNextAction.stepId,
    'compress_p848_p4217_p443_q97_p479_next_rank_later_prime_buckets_or_emit_rank_boundary',
  );
  assert.match(packet.oneNextAction.coveredFamily, /All 15 later-prime buckets/);
  assert.equal(
    packet.oneNextAction.finiteDenominatorOrRankToken,
    'p443_q97_p479_next_rank_later_prime_15_bucket_rank_boundary',
  );
  assert.equal(
    packet.recommendedNextAction,
    'compress_p848_p4217_p443_q97_p479_next_rank_later_prime_buckets_or_emit_rank_boundary',
  );

  assert.equal(packet.claims.runsPostNextRank13BucketBatchCoverConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPostNextRankBatchCoverAssemblyDecisionToken, true);
  assert.equal(packet.claims.selects15BucketCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll15LaterPrimeBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ127Singleton, false);
  assert.equal(packet.claims.descendsIntoQ131Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesLaterRootChildrenClosed, false);
  assert.equal(packet.claims.provesLaterQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 next-rank later-prime 15-bucket rank boundary is exact and nonterminal', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_NEXT_RANK_LATER_PRIME_15_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_next_rank_later_prime_15_bucket_rank_boundary/1',
  );
  assert.equal(packet.status, 'p479_next_rank_later_prime_15_bucket_deterministic_rank_boundary_emitted');
  assert.equal(packet.target, 'compress_p848_p4217_p443_q97_p479_next_rank_later_prime_buckets_or_emit_rank_boundary');

  assert.equal(packet.boundarySummary.sourceBucketCount, 13);
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourceNextQAvoidingClassCount, 170308883793);
  assert.equal(packet.boundarySummary.laterObstructionPrimeBucketCount, 15);
  assert.deepEqual(
    packet.boundarySummary.laterObstructionPrimes,
    [127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 191, 193, 197, 199],
  );
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalLaterRootChildCount, 340617767586);
  assert.equal(packet.boundarySummary.totalLaterQAvoidingClassCount, 3652250197976151);
  assert.equal(packet.boundarySummary.survivorSourceRowCount, 0);
  assert.equal(packet.boundarySummary.survivorNextQAvoidingClassCount, 0);

  assert.equal(
    packet.deterministicRankBoundary.consumedFiniteToken,
    'p443_q97_p479_next_rank_later_prime_15_bucket_rank_boundary',
  );
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokenCount, 15);
  assert.equal(packet.deterministicRankBoundary.measureStatus, 'finite_rank_token_partitioned_not_decreased');
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokens.length, 15);
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokens[0].laterObstructionPrime, 127);
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokens.at(-1).laterObstructionPrime, 199);

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_next_rank_later_prime_root_children').rootChildCount,
    340617767586,
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover').qAvoidingClassCount,
    3652250197976151,
  );
  assert.equal(
    packet.finiteTokenTransition.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover',
  );

  assert.equal(
    packet.oneNextAction.stepId,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );
  assert.match(packet.oneNextAction.coveredFamily, /All 3,652,250,197,976,151 later q-avoiding classes/);
  assert.equal(
    packet.recommendedNextAction,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );

  assert.equal(packet.claims.consumesPostNextRank15BucketRankToken, true);
  assert.equal(packet.claims.accountsForAll15LaterPrimeBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoLaterRoots, true);
  assert.equal(packet.claims.emitsExactDeterministic15BucketRankBoundary, true);
  assert.equal(packet.claims.selectsWholeBoundaryBatchCoverNext, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ127Singleton, false);
  assert.equal(packet.claims.descendsIntoQ131Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesLaterRootChildrenClosed, false);
  assert.equal(packet.claims.provesLaterQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 later-prime 15-bucket q-avoiding batch cover is exact and nonterminal', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover/1',
  );
  assert.equal(packet.status, 'all_15_bucket_later_prime_q_avoiding_classes_have_next_square_obstruction_child');
  assert.equal(packet.target, 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover_or_emit_boundary');

  assert.equal(packet.batchCoverSummary.sourceLaterPrimeBucketCount, 15);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.sourceLaterQAvoidingClassCount, '3652250197976151');
  assert.equal(packet.batchCoverSummary.classifiedLaterQAvoidingClassCount, '3652250197976151');
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorLaterQAvoidingClassCount, '0');
  assert.equal(packet.batchCoverSummary.nextObstructionPrimeBucketCount, 17);
  assert.equal(packet.batchCoverSummary.minNextObstructionPrime, 131);
  assert.equal(packet.batchCoverSummary.maxNextObstructionPrime, 223);
  assert.deepEqual(packet.batchCoverSummary.nextRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalNextRootChildCount, '7304500395952302');
  assert.equal(packet.batchCoverSummary.totalNextQAvoidingClassCount, '94524741190958970657');

  assert.equal(packet.nextObstructionPrimeBuckets.length, 17);
  assert.equal(packet.nextObstructionPrimeBuckets[0].nextObstructionPrime, 131);
  assert.equal(packet.nextObstructionPrimeBuckets.at(-1).nextObstructionPrime, 223);
  assert.equal(packet.previousLaterPrimeBucketSummaries.length, 15);
  assert.equal(packet.rowClassifications.length, 718);
  assert.equal(
    packet.rowClassifications.every((row) => row.nextRootResidueCount === 2),
    true,
  );

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    packet.finiteTokenTransition.consumedFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_obstruction_root_children').rootChildCount,
    '7304500395952302',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_q_avoiding_boundary').qAvoidingClassCount,
    '94524741190958970657',
  );

  assert.equal(
    packet.oneNextAction.stepId,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_q_avoiding_batch_cover',
  );
  assert.match(packet.oneNextAction.coveredFamily, /17 next-obstruction-prime buckets/);
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_q_avoiding_batch_cover',
  );

  assert.equal(packet.claims.consumes15BucketLaterPrimeQAvoidingToken, true);
  assert.equal(packet.claims.classifiesAll15SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllSourceRows, true);
  assert.equal(packet.claims.classifiesAllLaterQAvoidingClasses, true);
  assert.equal(packet.claims.survivorLaterQAvoidingClassCount, '0');
  assert.equal(packet.claims.allRowsHaveTwoNextRoots, true);
  assert.equal(packet.claims.emitsSeventeenNextPrimeBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ131Singleton, false);
  assert.equal(packet.claims.descendsIntoQ137Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesNextRootChildrenClosed, false);
  assert.equal(packet.claims.provesNextQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-later-prime 15-bucket q-avoiding convergence assembly selects the 17-bucket rank token', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_LATER_PRIME_15_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_later_prime_15_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_later_prime_15_bucket_q_avoiding_batch_cover_convergence_assembly_selects_17_bucket_rank_compression',
  );
  assert.equal(
    packet.target,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_q_avoiding_batch_cover',
  );
  assert.equal(
    packet.recommendedNextAction,
    'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_buckets_or_emit_rank_boundary',
  );

  assert.equal(packet.frontierComparison.previousRefreshValueBeforeLaterPrime15BucketQAvoidingCover, 51);
  assert.equal(packet.frontierComparison.currentRefreshValueAfterLaterPrime15BucketQAvoidingCover, 52);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceLaterQAvoidingClassCount, '3652250197976151');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorLaterQAvoidingClassCount, '0');
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_rank_boundary',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 17);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.nextRootChildCount, '7304500395952302');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.nextQAvoidingClassCount, '94524741190958970657');
  assert.deepEqual(packet.nextPrimeBucketSummary.nextPrimes, [
    131,
    137,
    139,
    149,
    151,
    157,
    163,
    167,
    173,
    179,
    181,
    191,
    193,
    197,
    199,
    211,
    223,
  ]);
  assert.deepEqual(packet.nextPrimeBucketSummary.rootResidueCountsPerClass, [2]);
  assert.match(packet.oneNextAction.coveredFamily, /All 17 next-prime buckets/);
  assert.equal(packet.claims.runsPostLaterPrime15BucketQAvoidingBatchCoverConvergenceAssembly, true);
  assert.equal(packet.claims.selects17BucketCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll17NextPrimeBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ131Singleton, false);
  assert.equal(packet.claims.descendsIntoQ137Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesNextRootChildrenClosed, false);
  assert.equal(packet.claims.provesNextQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 later-prime 15-bucket next-prime 17-bucket rank boundary is exact and nonterminal', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_rank_boundary/1',
  );
  assert.equal(packet.status, 'p479_later_prime_15_bucket_next_prime_17_bucket_deterministic_rank_boundary_emitted');
  assert.equal(packet.target, 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_buckets_or_emit_rank_boundary');

  assert.equal(packet.boundarySummary.sourceLaterPrimeBucketCount, 15);
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourceLaterQAvoidingClassCount, '3652250197976151');
  assert.equal(packet.boundarySummary.nextObstructionPrimeBucketCount, 17);
  assert.deepEqual(packet.boundarySummary.nextObstructionPrimes, [
    131,
    137,
    139,
    149,
    151,
    157,
    163,
    167,
    173,
    179,
    181,
    191,
    193,
    197,
    199,
    211,
    223,
  ]);
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalNextRootChildCount, '7304500395952302');
  assert.equal(packet.boundarySummary.totalNextQAvoidingClassCount, '94524741190958970657');
  assert.equal(packet.boundarySummary.survivorSourceRowCount, 0);
  assert.equal(packet.boundarySummary.survivorLaterQAvoidingClassCount, '0');

  assert.equal(
    packet.deterministicRankBoundary.consumedFiniteToken,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_rank_boundary',
  );
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokenCount, 17);
  assert.equal(packet.deterministicRankBoundary.measureStatus, 'finite_rank_token_partitioned_not_decreased');
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokens.length, 17);
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokens[0].nextObstructionPrime, 131);
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokens.at(-1).nextObstructionPrime, 223);

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_root_children').rootChildCount,
    '7304500395952302',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover').qAvoidingClassCount,
    '94524741190958970657',
  );
  assert.equal(
    packet.finiteTokenTransition.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover',
  );

  assert.equal(
    packet.oneNextAction.stepId,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );
  assert.match(packet.oneNextAction.coveredFamily, /All 94,524,741,190,958,970,657 next q-avoiding classes/);
  assert.equal(
    packet.recommendedNextAction,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );

  assert.equal(packet.claims.consumesPostLaterPrime15BucketNextPrime17BucketRankToken, true);
  assert.equal(packet.claims.accountsForAll17NextPrimeBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoNextRoots, true);
  assert.equal(packet.claims.emitsExactDeterministic17BucketRankBoundary, true);
  assert.equal(packet.claims.selectsWholeBoundaryBatchCoverNext, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ131Singleton, false);
  assert.equal(packet.claims.descendsIntoQ137Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesNextRootChildrenClosed, false);
  assert.equal(packet.claims.provesNextQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 later-prime 15-bucket next-prime 17-bucket q-avoiding batch cover is exact and nonterminal', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover/1',
  );
  assert.equal(packet.status, 'all_17_bucket_next_prime_q_avoiding_classes_have_later_square_obstruction_child');
  assert.equal(packet.target, 'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_or_emit_boundary');

  assert.equal(packet.batchCoverSummary.sourceNextPrimeBucketCount, 17);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.sourceNextQAvoidingClassCount, '94524741190958970657');
  assert.equal(packet.batchCoverSummary.classifiedNextQAvoidingClassCount, '94524741190958970657');
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorNextQAvoidingClassCount, '0');
  assert.equal(packet.batchCoverSummary.postNextObstructionPrimeBucketCount, 20);
  assert.equal(packet.batchCoverSummary.minPostNextObstructionPrime, 137);
  assert.equal(packet.batchCoverSummary.maxPostNextObstructionPrime, 239);
  assert.deepEqual(packet.batchCoverSummary.postNextRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalPostNextRootChildCount, '189049482381917941314');
  assert.equal(packet.batchCoverSummary.totalPostNextQAvoidingClassCount, '2946810455708641575397311');

  assert.equal(packet.postNextObstructionPrimeBuckets.length, 20);
  assert.equal(packet.postNextObstructionPrimeBuckets[0].postNextObstructionPrime, 137);
  assert.equal(packet.postNextObstructionPrimeBuckets.at(-1).postNextObstructionPrime, 239);
  assert.equal(packet.previousNextPrimeBucketSummaries.length, 17);
  assert.equal(packet.rowClassifications.length, 718);
  assert.equal(
    packet.rowClassifications.every((row) => row.postNextRootResidueCount === 2),
    true,
  );

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    packet.finiteTokenTransition.consumedFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_obstruction_root_children').rootChildCount,
    '189049482381917941314',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_q_avoiding_boundary').qAvoidingClassCount,
    '2946810455708641575397311',
  );

  assert.equal(
    packet.oneNextAction.stepId,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover',
  );
  assert.match(packet.oneNextAction.coveredFamily, /20 post-next obstruction-prime buckets/);
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover',
  );

  assert.equal(packet.claims.consumes17BucketNextPrimeQAvoidingToken, true);
  assert.equal(packet.claims.classifiesAll17SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllSourceRows, true);
  assert.equal(packet.claims.classifiesAllNextQAvoidingClasses, true);
  assert.equal(packet.claims.survivorNextQAvoidingClassCount, '0');
  assert.equal(packet.claims.allRowsHaveTwoPostNextRoots, true);
  assert.equal(packet.claims.emitsTwentyPostNextPrimeBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ137Singleton, false);
  assert.equal(packet.claims.descendsIntoQ139Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostNextRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostNextQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-17-bucket q-avoiding convergence assembly selects the 20-bucket rank token', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover_convergence_assembly_selects_20_bucket_rank_compression',
  );
  assert.equal(
    packet.target,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_q_avoiding_batch_cover',
  );

  assert.equal(packet.frontierComparison.measureName, 'open_frontier_obligation_count');
  assert.equal(packet.frontierComparison.globalFiniteMeasureDecreased, undefined);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceNextPrimeBucketCount, 17);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceNextQAvoidingClassCount, '94524741190958970657');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorNextQAvoidingClassCount, '0');

  assert.equal(packet.postNextBucketSummary.bucketCount, 20);
  assert.deepEqual(packet.postNextBucketSummary.postNextPrimes, [
    137,
    139,
    149,
    151,
    157,
    163,
    167,
    173,
    179,
    181,
    191,
    193,
    197,
    199,
    211,
    223,
    227,
    229,
    233,
    239,
  ]);
  assert.deepEqual(packet.postNextBucketSummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.postNextBucketSummary.postNextRootChildCount, '189049482381917941314');
  assert.equal(packet.postNextBucketSummary.postNextQAvoidingClassCount, '2946810455708641575397311');

  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_rank_boundary',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 20);
  assert.equal(packet.oneNextAction.stepId, 'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_buckets_or_emit_rank_boundary');
  assert.match(packet.oneNextAction.coveredFamily, /All 20 post-next buckets/);
  assert.equal(
    packet.recommendedNextAction,
    'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_buckets_or_emit_rank_boundary',
  );

  assert.equal(packet.claims.runsPost17BucketQAvoidingBatchCoverConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPost17BucketQAvoidingCoverAssemblyDecisionToken, true);
  assert.equal(packet.claims.selects20BucketCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll20PostNextBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ137Singleton, false);
  assert.equal(packet.claims.descendsIntoQ139Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostNextRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostNextQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 later-prime 15-bucket next-prime 17-bucket post-next 20-bucket rank boundary is exact and nonterminal', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_rank_boundary/1',
  );
  assert.equal(
    packet.status,
    'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_deterministic_rank_boundary_emitted',
  );
  assert.equal(
    packet.target,
    'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_buckets_or_emit_rank_boundary',
  );

  assert.equal(packet.boundarySummary.sourceNextPrimeBucketCount, 17);
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourceNextQAvoidingClassCount, '94524741190958970657');
  assert.equal(packet.boundarySummary.postNextObstructionPrimeBucketCount, 20);
  assert.deepEqual(packet.boundarySummary.postNextObstructionPrimes, [
    137,
    139,
    149,
    151,
    157,
    163,
    167,
    173,
    179,
    181,
    191,
    193,
    197,
    199,
    211,
    223,
    227,
    229,
    233,
    239,
  ]);
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalPostNextRootChildCount, '189049482381917941314');
  assert.equal(packet.boundarySummary.totalPostNextQAvoidingClassCount, '2946810455708641575397311');
  assert.equal(packet.boundarySummary.survivorSourceRowCount, 0);
  assert.equal(packet.boundarySummary.survivorNextQAvoidingClassCount, '0');

  assert.equal(
    packet.deterministicRankBoundary.consumedFiniteToken,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_rank_boundary',
  );
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokenCount, 20);
  assert.equal(packet.deterministicRankBoundary.measureStatus, 'finite_rank_token_partitioned_not_decreased');
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokens[0].postNextObstructionPrime, 137);
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokens.at(-1).postNextObstructionPrime, 239);

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_root_children').rootChildCount,
    '189049482381917941314',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover').qAvoidingClassCount,
    '2946810455708641575397311',
  );
  assert.equal(
    packet.finiteTokenTransition.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.bucketCount, 20);

  assert.equal(
    packet.oneNextAction.stepId,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );
  assert.equal(
    packet.recommendedNextAction,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );
  assert.match(packet.oneNextAction.coveredFamily, /All 2,946,810,455,708,641,575,397,311 post-next q-avoiding classes/);

  assert.equal(packet.claims.consumesPost17BucketQAvoiding20BucketRankToken, true);
  assert.equal(packet.claims.accountsForAll20PostNextBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoPostNextRoots, true);
  assert.equal(packet.claims.emitsExactDeterministic20BucketRankBoundary, true);
  assert.equal(packet.claims.selectsWholeBoundaryBatchCoverNext, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ137Singleton, false);
  assert.equal(packet.claims.descendsIntoQ139Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostNextRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostNextQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 later-prime 15-bucket next-prime 17-bucket post-next 20-bucket q-avoiding batch cover is exact and nonterminal', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover/1',
  );
  assert.equal(packet.status, 'all_20_bucket_post_next_q_avoiding_classes_have_later_square_obstruction_child');
  assert.equal(
    packet.target,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );

  assert.equal(packet.batchCoverSummary.sourcePostNextBucketCount, 20);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(packet.batchCoverSummary.sourcePostNextQAvoidingClassCount, '2946810455708641575397311');
  assert.equal(packet.batchCoverSummary.classifiedPostNextQAvoidingClassCount, '2946810455708641575397311');
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorPostNextQAvoidingClassCount, '0');
  assert.equal(packet.batchCoverSummary.successorObstructionPrimeBucketCount, 22);
  assert.deepEqual(
    packet.successorObstructionPrimeBuckets.map((bucket) => bucket.successorObstructionPrime),
    [139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 263],
  );
  assert.deepEqual(packet.batchCoverSummary.successorRootResidueCounts, [2]);
  assert.equal(packet.batchCoverSummary.totalSuccessorRootChildCount, '5893620911417283150794622');
  assert.equal(packet.batchCoverSummary.totalSuccessorQAvoidingClassCount, '111172518226866898571161320153');

  assert.equal(
    packet.finiteTokenTransition.consumedFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover',
  );
  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_root_children').rootChildCount,
    '5893620911417283150794622',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_q_avoiding_boundary').qAvoidingClassCount,
    '111172518226866898571161320153',
  );

  assert.equal(
    packet.oneNextAction.stepId,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover',
  );
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover',
  );
  assert.match(packet.oneNextAction.coveredFamily, /22 successor obstruction-prime buckets/);

  assert.equal(packet.claims.consumes20BucketPostNextQAvoidingToken, true);
  assert.equal(packet.claims.classifiesAll20SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllSourceRows, true);
  assert.equal(packet.claims.classifiesAllPostNextQAvoidingClasses, true);
  assert.equal(packet.claims.survivorSourceRowCount, 0);
  assert.equal(packet.claims.survivorPostNextQAvoidingClassCount, '0');
  assert.equal(packet.claims.allRowsHaveTwoSuccessorRoots, true);
  assert.equal(packet.claims.emitsTwentyTwoSuccessorPrimeBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ139Singleton, false);
  assert.equal(packet.claims.descendsIntoQ149Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP479AvailableFamilyCoverage, false);
  assert.equal(packet.claims.provesP479UnavailableComplementClosed, false);
  assert.equal(packet.claims.provesQ97ChildCoverage, false);
  assert.equal(packet.claims.provesP443UnavailableComplementClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-20-bucket q-avoiding convergence assembly selects the 22-bucket successor rank token', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover_convergence_assembly_selects_22_bucket_successor_rank_compression',
  );
  assert.equal(
    packet.target,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.coversPrimaryNextAction.status, 'covered_by_post_next_20_bucket_q_avoiding_batch_cover_convergence_assembly');
  assert.equal(packet.sourcePackets.length, 3);
  assert.equal(packet.frontierComparison.previousRefreshValueBefore20BucketQAvoidingCover, 57);
  assert.equal(packet.frontierComparison.currentRefreshValueAfter20BucketQAvoidingCover, 58);
  assert.equal(packet.frontierComparison.delta, 1);

  assert.equal(packet.finiteMeasureOrNoMeasureYet.globalFiniteMeasureDecreased, false);
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.closedSourceToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostNextBucketCount, 20);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourceRowCount, 718);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.sourcePostNextQAvoidingClassCount, '2946810455708641575397311');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.closedSourceToken.survivorPostNextQAvoidingClassCount, '0');
  assert.equal(
    packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_rank_boundary',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 22);
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.successorRootChildCount, '5893620911417283150794622');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.successorQAvoidingClassCount, '111172518226866898571161320153');

  assert.equal(packet.successorBucketSummary.bucketCount, 22);
  assert.deepEqual(
    packet.successorBucketSummary.successorPrimes,
    [139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 263],
  );
  assert.equal(packet.successorBucketSummary.sourcePostNextBucketCount, 20);
  assert.equal(packet.successorBucketSummary.sourceRowCount, 718);
  assert.equal(packet.successorBucketSummary.sourcePostNextQAvoidingClassCount, '2946810455708641575397311');
  assert.equal(packet.successorBucketSummary.survivorPostNextQAvoidingClassCount, '0');
  assert.deepEqual(packet.successorBucketSummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.successorBucketSummary.successorRootChildCount, '5893620911417283150794622');
  assert.equal(packet.successorBucketSummary.successorQAvoidingClassCount, '111172518226866898571161320153');

  assert.equal(
    packet.oneNextAction.stepId,
    'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_buckets_or_emit_rank_boundary',
  );
  assert.equal(
    packet.recommendedNextAction,
    'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_buckets_or_emit_rank_boundary',
  );
  assert.match(packet.oneNextAction.coveredFamily, /All 22 successor buckets/);
  assert.equal(packet.oneVerificationCommand, 'node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js');

  assert.equal(packet.claims.runsPost20BucketQAvoidingBatchCoverConvergenceAssembly, true);
  assert.equal(packet.claims.consumesPost20BucketQAvoidingCoverAssemblyDecisionToken, true);
  assert.equal(packet.claims.selects22BucketCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll22SuccessorBuckets, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ139Singleton, false);
  assert.equal(packet.claims.descendsIntoQ149Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 post-next 20-bucket successor 22-bucket rank boundary is exact and nonterminal', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_P443_Q97_P479_LATER_PRIME_15_BUCKET_NEXT_PRIME_17_BUCKET_POST_NEXT_20_BUCKET_SUCCESSOR_22_BUCKET_RANK_BOUNDARY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_rank_boundary/1',
  );
  assert.equal(
    packet.status,
    'p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_deterministic_rank_boundary_emitted',
  );
  assert.equal(
    packet.target,
    'compress_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_buckets_or_emit_rank_boundary',
  );
  assert.equal(packet.boundarySummary.sourcePostNextBucketCount, 20);
  assert.equal(packet.boundarySummary.sourceRowCount, 718);
  assert.equal(packet.boundarySummary.sourcePostNextQAvoidingClassCount, '2946810455708641575397311');
  assert.equal(packet.boundarySummary.successorObstructionPrimeBucketCount, 22);
  assert.deepEqual(
    packet.boundarySummary.successorObstructionPrimes,
    [139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 263],
  );
  assert.deepEqual(packet.boundarySummary.rootResidueCountsPerClass, [2]);
  assert.equal(packet.boundarySummary.totalSuccessorRootChildCount, '5893620911417283150794622');
  assert.equal(packet.boundarySummary.totalSuccessorQAvoidingClassCount, '111172518226866898571161320153');
  assert.equal(packet.boundarySummary.survivorSourceRowCount, 0);
  assert.equal(packet.boundarySummary.survivorPostNextQAvoidingClassCount, '0');

  assert.equal(packet.deterministicRankBoundary.consumedFiniteToken, 'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_rank_boundary');
  assert.equal(packet.deterministicRankBoundary.producedFiniteTokenCount, 22);
  assert.equal(packet.successorPrimeBuckets.length, 22);
  assert.equal(packet.successorPrimeBuckets[0].successorObstructionPrime, 139);
  assert.equal(packet.successorPrimeBuckets.at(-1).successorObstructionPrime, 263);
  assert.ok(packet.successorPrimeBuckets.every((bucket) => bucket.rootResidueCountsPerClass.length === 1 && bucket.rootResidueCountsPerClass[0] === 2));

  const producedById = new Map(packet.finiteTokenTransition.producedFiniteTokens.map((token) => [token.tokenId, token]));
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_root_children').rootChildCount,
    '5893620911417283150794622',
  );
  assert.equal(
    producedById.get('p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover').qAvoidingClassCount,
    '111172518226866898571161320153',
  );
  assert.equal(
    packet.finiteTokenTransition.nextFiniteToken.tokenId,
    'p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover',
  );
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.bucketCount, 22);
  assert.equal(packet.finiteTokenTransition.nextFiniteToken.qAvoidingClassCount, '111172518226866898571161320153');

  assert.equal(
    packet.oneNextAction.stepId,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );
  assert.equal(
    packet.recommendedNextAction,
    'derive_p848_p4217_p443_q97_p479_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_q_avoiding_batch_cover_or_emit_boundary',
  );
  assert.match(packet.oneNextAction.coveredFamily, /111,172,518,226,866,898,571,161,320,153/);

  assert.equal(packet.claims.consumesPost20BucketQAvoiding22BucketSuccessorRankToken, true);
  assert.equal(packet.claims.accountsForAll22SuccessorBuckets, true);
  assert.equal(packet.claims.allRowsHaveTwoSuccessorRoots, true);
  assert.equal(packet.claims.emitsExactDeterministic22BucketRankBoundary, true);
  assert.equal(packet.claims.selectsWholeBoundaryBatchCoverNext, true);
  assert.equal(packet.claims.opensFreshFallbackSelector, false);
  assert.equal(packet.claims.descendsIntoQ139Singleton, false);
  assert.equal(packet.claims.descendsIntoQ149Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesP4217ComplementCoverage, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 q191..q383 q-avoiding cover closes and emits q193..q389 boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_Q_AVOIDING_BATCH_COVER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post31_q_avoiding_post8_successor_31_bucket_q_avoiding_batch_cover/1',
  );
  assert.equal(
    packet.status,
    'all_31_bucket_post_post_post_post_post_post_post_post_successor_q_avoiding_classes_have_later_square_obstruction_child',
  );
  assert.equal(packet.batchCoverSummary.sourcePostPostPostPostPostPostPostPostSuccessorBucketCount, 31);
  assert.equal(packet.batchCoverSummary.sourceRowCount, 718);
  assert.equal(
    packet.batchCoverSummary.sourcePostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount,
    '124948172109189798223447033533750138554613507343879586729927215881345',
  );
  assert.equal(packet.batchCoverSummary.survivorSourceRowCount, 0);
  assert.equal(packet.batchCoverSummary.survivorPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.batchCoverSummary.postPostPostPostPostPostPostPostPostSuccessorObstructionPrimeBucketCount, 33);
  assert.equal(packet.batchCoverSummary.minTargetObstructionPrime, 193);
  assert.equal(packet.batchCoverSummary.maxTargetObstructionPrime, 389);
  assert.deepEqual(packet.batchCoverSummary.postPostPostPostPostPostPostPostPostSuccessorRootResidueCounts, [2]);
  assert.equal(
    packet.batchCoverSummary.totalPostPostPostPostPostPostPostPostPostSuccessorRootChildCount,
    '249896344218379596446894067067500277109227014687759173459854431762690',
  );
  assert.equal(
    packet.batchCoverSummary.totalPostPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount,
    '15536502041475313965667995966751777712392869680929624929606057703977518271',
  );

  assert.equal(packet.postPostPostPostPostPostPostPostPostSuccessorObstructionPrimeBuckets.length, 33);
  assert.equal(packet.postPostPostPostPostPostPostPostPostSuccessorObstructionPrimeBuckets[0].postPostPostPostPostPostPostPostPostSuccessorObstructionPrime, 193);
  assert.equal(packet.postPostPostPostPostPostPostPostPostSuccessorObstructionPrimeBuckets.at(-1).postPostPostPostPostPostPostPostPostSuccessorObstructionPrime, 389);
  assert.equal(
    packet.recommendedNextAction,
    'run_p848_convergence_assembly_after_later_prime_15_bucket_next_prime_17_bucket_post_next_20_bucket_successor_22_bucket_post_successor_24_bucket_post_post_successor_24_bucket_post_post_post_successor_26_bucket_post_post_post_post_successor_29_bucket_post_post_post_post_post_successor_29_bucket_post_post_post_post_post_post_successor_30_bucket_post_post_post_post_post_post_post_successor_31_bucket_post_post_post_post_post_post_post_post_successor_31_bucket_q_avoiding_batch_cover',
  );

  assert.equal(packet.claims.consumes31BucketPost8SuccessorQAvoidingToken, true);
  assert.equal(packet.claims.classifiesAll31SourceBucketTokens, true);
  assert.equal(packet.claims.classifiesAllSourceQAvoidingClasses, true);
  assert.equal(packet.claims.survivorSourceRowCount, 0);
  assert.equal(packet.claims.survivorPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount, '0');
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesTargetRootChildrenClosed, false);
  assert.equal(packet.claims.provesTargetQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 q191..q383 q-cover assembly routes the q193..q389 boundary as one token', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_post31_q_avoiding_post8_successor_31_bucket_q_avoiding_batch_cover_convergence_assembly_packet/1',
  );
  assert.equal(
    packet.status,
    'post31_q_avoiding_post8_successor_31_bucket_q_avoiding_batch_cover_convergence_assembly_selects_33_bucket_post9_successor_rank_compression',
  );
  assert.equal(packet.postPostPostPostPostPostPostPostPostSuccessorRankBoundarySummary.bucketCount, 33);
  assert.equal(packet.postPostPostPostPostPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostPostPostPostPostSuccessorPrimes[0], 193);
  assert.equal(packet.postPostPostPostPostPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostPostPostPostPostSuccessorPrimes.at(-1), 389);
  assert.equal(
    packet.postPostPostPostPostPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostPostPostPostPostSuccessorRootChildCount,
    '249896344218379596446894067067500277109227014687759173459854431762690',
  );
  assert.equal(
    packet.postPostPostPostPostPostPostPostPostSuccessorRankBoundarySummary.postPostPostPostPostPostPostPostPostSuccessorQAvoidingClassCount,
    '15536502041475313965667995966751777712392869680929624929606057703977518271',
  );
  assert.equal(
    packet.recommendedNextAction,
    'prove_p848_p4217_q_cover_staircase_breaker_for_q193_q389_successor_surface_or_emit_nonconvergence_blocker',
  );
  assert.equal(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.bucketCount, 33);
  assert.match(packet.finiteMeasureOrNoMeasureYet.nextFiniteToken.tokenId, /33_bucket_rank_boundary$/);

  assert.equal(packet.claims.consumesQ191Q383QAvoidingCoverDecisionToken, true);
  assert.equal(packet.claims.selects33BucketPostPostPostPostPostPostPostPostPostSuccessorCompressionInsteadOfSingletonDescent, true);
  assert.equal(packet.claims.accountsForAll33PostPostPostPostPostPostPostPostPostSuccessorBuckets, true);
  assert.equal(packet.claims.requiresStaircaseBreakerBeforeNextQCover, true);
  assert.equal(packet.claims.allowsNakedNextRankBoundary, false);
  assert.equal(packet.claims.allowsNakedNextQCover, false);
  assert.equal(packet.claims.descendsIntoQ193Singleton, false);
  assert.equal(packet.claims.descendsIntoQ197Singleton, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesPostPostPostPostPostPostPostPostPostSuccessorRootChildrenClosed, false);
  assert.equal(packet.claims.provesPostPostPostPostPostPostPostPostPostSuccessorQAvoidingBoundaryClosed, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 q191..q383 q-cover assembly requires a staircase breaker before another q-cover', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_POST31_Q_AVOIDING_POST8_31_BUCKET_Q_AVOIDING_BATCH_COVER_CONVERGENCE_ASSEMBLY_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.recommendedNextAction,
    'prove_p848_p4217_q_cover_staircase_breaker_for_q193_q389_successor_surface_or_emit_nonconvergence_blocker',
  );
  assert.equal(packet.staircaseBreakerDirective.status, 'required_now');
  assert.equal(packet.staircaseBreakerDirective.tokenId, 'p848_p4217_q_cover_staircase_breaker_q193_q389');
  assert.equal(packet.finiteMeasureOrNoMeasureYet.staircaseBreakerToken.requiredBeforeNextQCover, true);
  assert.match(packet.oneNextAction.action, /Prove the q-cover staircase breaker/);
  assert.match(packet.oneNextAction.completionRule, /naked rank boundary alone is disallowed|deterministic rank boundary alone is disallowed/i);
  assert.equal(packet.claims.requiresStaircaseBreakerBeforeNextQCover, true);
  assert.equal(packet.claims.allowsNakedNextRankBoundary, false);
  assert.equal(packet.claims.allowsNakedNextQCover, false);
  assert.equal(packet.claims.descendsIntoSingletonQChild, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 q-cover staircase breaker blocks finite q-cover expansion', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(
    packet.schema,
    'erdos.number_theory.p848_p4217_q_cover_staircase_breaker_nonconvergence_packet/1',
  );
  assert.equal(packet.status, 'q_cover_staircase_nonconvergence_blocker_emitted_theorem_wedge_required');
  assert.equal(
    packet.target,
    'prove_p848_p4217_q_cover_staircase_breaker_for_q193_q389_successor_surface_or_emit_nonconvergence_blocker',
  );
  assert.equal(
    packet.recommendedNextAction,
    'derive_p848_q_cover_parametric_transition_theorem_or_route_to_independent_282_841_binding',
  );
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_nonconvergence_blocker');
  assert.equal(packet.coversPrimaryNextAction.tokenId, 'p848_p4217_q_cover_staircase_breaker_q193_q389');
  assert.equal(packet.breakerResult.kind, 'nonconvergence_blocker');
  assert.equal(packet.measuredSurface.frontierDelta, 0);
  assert.equal(packet.measuredSurface.emittedBucketCount, 33);
  assert.equal(packet.measuredSurface.emittedPrimes[0], 193);
  assert.equal(packet.measuredSurface.emittedPrimes.at(-1), 389);
  assert.match(packet.oneNextAction.completionRule, /No more q-cover\/rank-boundary finite expansion/);
  assert.equal(packet.forbiddenMovesBeforeNewTheorem.includes('launch_q193_q389_successor_q_cover'), true);
  assert.equal(packet.claims.completesStaircaseBreakerByNonconvergenceBlocker, true);
  assert.equal(packet.claims.blocksNextQCoverUntilParametricTheoremExists, true);
  assert.equal(packet.claims.launchesAnotherQCover, false);
  assert.equal(packet.claims.provesParametricTransitionTheorem, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 q-cover parametric transition route blocks nondecreasing staircase reuse', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_q_cover_parametric_transition_route_packet/1');
  assert.equal(packet.status, 'q_cover_parametric_transition_audit_routes_to_structural_complement_decomposition');
  assert.equal(
    packet.target,
    'derive_p848_q_cover_parametric_transition_theorem_or_route_to_independent_282_841_binding',
  );
  assert.equal(
    packet.recommendedNextAction,
    'derive_p848_p4217_structural_complement_decomposition_or_emit_invariant_blocker',
  );
  assert.equal(packet.transitionLawAudit.rootChildToSourceRatio, '2.000000');
  assert.equal(packet.transitionLawAudit.rootResidueCountsPerClass.length, 1);
  assert.equal(packet.transitionLawAudit.rootResidueCountsPerClass[0], 2);
  assert.equal(packet.transitionLawAudit.emittedBucketCount, 33);
  assert.equal(packet.transitionLawAudit.emittedPrimes[0], 193);
  assert.equal(packet.transitionLawAudit.emittedPrimes.at(-1), 389);
  assert.equal(packet.parametricTheoremDecision.decision, 'do_not_promote_q_cover_as_global_parametric_closure_from_current_sources');
  assert.equal(packet.independent282841RouteCheck.status, 'already_satisfied_at_restored_finite_menu_chronology_scope');
  assert.equal(packet.oneNextAction.stepId, 'derive_p848_p4217_structural_complement_decomposition_or_emit_invariant_blocker');
  assert.equal(packet.claims.provesCurrentRowUniformTwoRootTransitionLaw, true);
  assert.equal(packet.claims.provesCurrentQCoverClassCountDoesNotDecrease, true);
  assert.equal(packet.claims.provesParametricQCoverGlobalClosure, false);
  assert.equal(packet.claims.routesAwayFromFiniteQCoverStaircase, true);
  assert.equal(packet.claims.launchesAnotherQCover, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 p4217 structural complement invariant blocker routes to mod-50 recurrence boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_structural_complement_invariant_blocker_packet/1');
  assert.equal(packet.status, 'p4217_structural_complement_invariant_blocker_emitted_mod50_recurrence_boundary_selected');
  assert.equal(packet.target, 'derive_p848_p4217_structural_complement_decomposition_or_emit_invariant_blocker');
  assert.equal(packet.recommendedNextAction, 'derive_p848_mod50_all_future_recurrence_or_emit_source_theorem_blocker');
  assert.equal(
    packet.coversPrimaryNextAction.stepId,
    'derive_p848_p4217_structural_complement_decomposition_or_emit_invariant_blocker',
  );
  assert.equal(
    packet.structuralComplementAudit.result,
    'no_repo_owned_structural_complement_decomposition_or_decreasing_invariant_available',
  );
  assert.equal(packet.structuralComplementAudit.auditedCandidateCount, 6);
  assert.deepEqual(
    packet.structuralComplementAudit.auditedCandidates.map((candidate) => candidate.id),
    [
      'p4217_unavailable_complement_refinement',
      'p43_fallback_selector_and_uniform_square_block',
      'p61_availability_partition',
      'p479_available_bulk_square_obstruction_cover',
      'q109_regular_singular_boundary',
      'q_cover_parametric_transition_route',
    ],
  );
  assert.equal(
    packet.invariantBlockerDecision.decision,
    'do_not_promote_structural_p4217_complement_decomposition_from_current_sources',
  );
  assert.equal(packet.oneNextAction.stepId, 'derive_p848_mod50_all_future_recurrence_or_emit_source_theorem_blocker');
  assert.equal(
    packet.oneNextAction.finiteDenominatorOrRankToken,
    'p848_mod50_all_future_recurrence_source_boundary_after_bounded_replay_theorem',
  );
  assert.equal(packet.forbiddenMovesBeforeNewInvariant.includes('launch_q193_q389_or_larger_q_cover'), true);
  assert.equal(
    packet.forbiddenMovesBeforeNewInvariant.includes('try_fallback_selectors_one_by_one_without_batch_or_rank_decrease'),
    true,
  );
  assert.equal(packet.claims.emitsExactInvariantBlocker, true);
  assert.equal(packet.claims.auditsCurrentP4217StructuralCandidates, true);
  assert.equal(packet.claims.provesNoCurrentCandidateClaimsP4217ComplementCoverage, true);
  assert.equal(packet.claims.provesStructuralP4217ComplementDecomposition, false);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQChildDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.routesToMod50AllFutureRecurrenceBoundary, true);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 all-future recurrence source-theorem blocker closes finite replay overclaim', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_all_future_recurrence_source_theorem_blocker_packet/1');
  assert.equal(packet.status, 'mod50_all_future_recurrence_source_theorem_blocker_emitted_local_source_absent');
  assert.equal(packet.target, 'derive_p848_mod50_all_future_recurrence_or_emit_source_theorem_blocker');
  assert.equal(packet.recommendedNextAction, 'prepare_p848_mod50_all_future_recurrence_theorem_wedge_or_restore_source_generator');
  assert.equal(
    packet.coversPrimaryNextAction.stepId,
    'derive_p848_mod50_all_future_recurrence_or_emit_source_theorem_blocker',
  );
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_exact_source_theorem_blocker');
  assert.equal(
    packet.deterministicBoundary.boundaryId,
    'p848_mod50_all_future_recurrence_source_boundary_after_bounded_replay_theorem',
  );
  assert.equal(packet.sourceTheoremAudit.result, 'no_repo_owned_all_future_recurrence_or_finite_q_partition_available');
  assert.equal(packet.sourceTheoremAudit.auditedSourceCount, 6);
  assert.equal(packet.sourceTheoremAudit.auditedSources.every((source) => source.provesAllFutureRecurrence === false), true);
  assert.equal(packet.sourceTheoremAudit.auditedSources.every((source) => source.provesFiniteQPartition === false), true);
  assert.equal(packet.blockerDecision.decision, 'emit_source_theorem_blocker_instead_of_promoting_finite_replay');
  assert.equal(packet.oneNextAction.stepId, 'prepare_p848_mod50_all_future_recurrence_theorem_wedge_or_restore_source_generator');
  assert.equal(
    packet.oneNextAction.finiteDenominatorOrRankToken,
    'p848_mod50_all_future_recurrence_source_theorem_blocker_after_bounded_replay',
  );
  assert.equal(packet.forbiddenMovesBeforeSourceTheorem.includes('treat_finite_mod50_replay_as_all_future_recurrence'), true);
  assert.equal(packet.forbiddenMovesBeforeSourceTheorem.includes('launch_40501_plus_rollout_from_finite_replay'), true);
  assert.equal(packet.claims.emitsExactSourceTheoremBlocker, true);
  assert.equal(packet.claims.auditsMod50AllFutureBoundary, true);
  assert.equal(packet.claims.provesFiniteReplayTheoremAlreadyRecorded, true);
  assert.equal(packet.claims.provesRepoOwnedAllFutureRecurrenceAbsent, true);
  assert.equal(packet.claims.blocksFiniteReplayAsAllFuture, true);
  assert.equal(packet.claims.blocks40501PlusRollout, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.routesToLocalSourceArchaeologyOrBudgetGuardedWedge, true);
  assert.equal(packet.claims.provesSymbolicRelevantPairRecurrence, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesUniversalSquareWitnessDomainCover, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 source archaeology theorem wedge keeps paid research opt-in', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_source_archaeology_theorem_wedge_packet/1');
  assert.equal(packet.status, 'mod50_source_archaeology_completed_theorem_wedge_prepared');
  assert.equal(packet.target, 'prepare_p848_mod50_all_future_recurrence_theorem_wedge_or_restore_source_generator');
  assert.equal(packet.recommendedNextAction, 'decide_p848_mod50_recurrence_wedge_with_budget_guard_or_local_symbolic_proof');
  assert.equal(
    packet.coversPrimaryNextAction.stepId,
    'prepare_p848_mod50_all_future_recurrence_theorem_wedge_or_restore_source_generator',
  );
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_local_source_archaeology_wedge_packet');

  assert.equal(packet.localSourceArchaeology.result, 'finite_search_surfaces_found_all_future_source_theorem_not_restored');
  assert.equal(packet.localSourceArchaeology.auditedSurfaceCount, 10);
  assert.equal(packet.localSourceArchaeology.summary.finiteFrontierEngineSearchCodeAvailable, true);
  assert.equal(packet.localSourceArchaeology.summary.finiteOutputFamilyMenuAvailable, true);
  assert.equal(packet.localSourceArchaeology.summary.repoOwnedResearchLatestSyncAvailable, false);
  assert.equal(packet.localSourceArchaeology.summary.outputFamilyMenu.familyCount, 280);
  assert.equal(packet.localSourceArchaeology.summary.outputFamilyMenu.nextUnmatched, 137720141);
  assert.equal(packet.localSourceArchaeology.summary.artifactManifestCount, 19);
  assert.equal(
    packet.localSourceArchaeology.auditedSurfaces.every((surface) => surface.provesAllFutureRecurrence === false),
    true,
  );

  assert.equal(packet.theoremWedge.status, 'prepared_budget_guarded_no_live_call_made');
  assert.match(packet.theoremWedge.question, /Problem 848 theorem wedge/);
  assert.equal(packet.theoremWedge.budgetGuard.noLiveCallMadeByThisPacket, true);
  assert.equal(packet.theoremWedge.budgetGuard.profilePath, 'packs/number-theory/problems/848/ORP_RESEARCH_THEOREM_WEDGE_PROFILE.json');
  assert.match(packet.theoremWedge.budgetGuard.profilePurpose, /single_lane_theorem_wedge/);
  assert.match(packet.theoremWedge.budgetGuard.planningCommand, /erdos orp research ask 848/);
  assert.match(packet.theoremWedge.budgetGuard.planningCommand, /--profile-file packs\/number-theory\/problems\/848\/ORP_RESEARCH_THEOREM_WEDGE_PROFILE\.json/);
  assert.doesNotMatch(packet.theoremWedge.budgetGuard.planningCommand, /--execute/);
  assert.match(packet.theoremWedge.budgetGuard.liveCommandRequiresExplicitOptIn, /--execute --allow-paid/);
  assert.equal(packet.theoremWedge.budgetGuard.dailyUsdLimit, 5);

  assert.equal(packet.oneNextAction.stepId, 'decide_p848_mod50_recurrence_wedge_with_budget_guard_or_local_symbolic_proof');
  assert.equal(packet.forbiddenMovesBeforeWedgeDecision.includes('make_paid_theorem_wedge_call_without_usage_check_and_explicit_paid_opt_in'), true);
  assert.equal(packet.forbiddenMovesBeforeWedgeDecision.includes('treat_output_family_menu_as_all_future_recurrence'), true);
  assert.equal(packet.claims.completesLocalSourceArchaeology, true);
  assert.equal(packet.claims.preparesBudgetGuardedTheoremWedge, true);
  assert.equal(packet.claims.livePaidCallMade, false);
  assert.equal(packet.claims.respectsNoPaidByDefault, true);
  assert.equal(packet.claims.provesSymbolicRelevantPairRecurrence, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 source archaeology packet prepares theorem wedge without paid execution', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_source_archaeology_theorem_wedge_packet/1');
  assert.equal(packet.status, 'mod50_source_archaeology_completed_theorem_wedge_prepared');
  assert.equal(packet.target, 'prepare_p848_mod50_all_future_recurrence_theorem_wedge_or_restore_source_generator');
  assert.equal(packet.recommendedNextAction, 'decide_p848_mod50_recurrence_wedge_with_budget_guard_or_local_symbolic_proof');
  assert.equal(
    packet.coversPrimaryNextAction.stepId,
    'prepare_p848_mod50_all_future_recurrence_theorem_wedge_or_restore_source_generator',
  );
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_local_source_archaeology_wedge_packet');
  assert.equal(
    packet.localSourceArchaeology.result,
    'finite_search_surfaces_found_all_future_source_theorem_not_restored',
  );
  assert.equal(packet.localSourceArchaeology.summary.allFutureSourceTheoremRestored, false);
  assert.equal(packet.localSourceArchaeology.summary.originalGeneratorRestored, false);
  assert.equal(packet.localSourceArchaeology.summary.symbolicRelevantPairRecurrenceProved, false);
  assert.equal(packet.localSourceArchaeology.summary.finiteQPartitionProved, false);
  assert.equal(packet.theoremWedge.status, 'prepared_budget_guarded_no_live_call_made');
  assert.equal(packet.theoremWedge.budgetGuard.noLiveCallMadeByThisPacket, true);
  assert.equal(packet.oneNextAction.stepId, 'decide_p848_mod50_recurrence_wedge_with_budget_guard_or_local_symbolic_proof');
  assert.equal(
    packet.oneNextAction.finiteDenominatorOrRankToken,
    'p848_mod50_source_archaeology_theorem_wedge_after_all_future_blocker',
  );
  assert.equal(packet.forbiddenMovesBeforeWedgeDecision.includes('resume_q_cover_or_selector_ladder_without_new_invariant'), true);
  assert.equal(packet.forbiddenMovesBeforeWedgeDecision.includes('launch_40501_plus_rollout_from_finite_replay'), true);
  assert.equal(packet.claims.completesLocalSourceArchaeology, true);
  assert.equal(packet.claims.preparesBudgetGuardedTheoremWedge, true);
  assert.equal(packet.claims.livePaidCallMade, false);
  assert.equal(packet.claims.respectsNoPaidByDefault, true);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.provesSymbolicRelevantPairRecurrence, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 mod-50 theorem wedge decision blocker records local finite-menu boundary', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_mod50_theorem_wedge_decision_blocker_packet/1');
  assert.equal(
    packet.status,
    'mod50_theorem_wedge_decision_blocker_emitted_budget_guarded_live_incomplete_no_universal_theorem',
  );
  assert.equal(packet.target, 'decide_p848_mod50_recurrence_wedge_with_budget_guard_or_local_symbolic_proof');
  assert.equal(packet.recommendedNextAction, 'assemble_p848_all_n_recombination_residual_after_mod50_wedge_blocker');
  assert.equal(
    packet.coversPrimaryNextAction.status,
    'blocked_by_budget_guarded_live_wedge_incomplete_no_universal_theorem',
  );
  assert.equal(packet.localProofVerdict.symbolicRelevantPairRecurrenceProved, false);
  assert.equal(packet.localProofVerdict.finiteQPartitionProved, false);
  assert.equal(packet.localProofVerdict.originalSourceGeneratorRestored, false);
  assert.equal(packet.orpResearchRun.status, 'partial');
  assert.equal(packet.orpResearchRun.execute, true);
  assert.equal(packet.orpResearchRun.apiCalled, true);
  assert.equal(packet.orpResearchRun.completedTextLaneCount, 0);
  assert.equal(packet.orpResearchRun.laneStatuses[0].incompleteReason, 'max_output_tokens');
  assert.equal(packet.finiteMenuAudit.familyCount, 280);
  assert.equal(packet.finiteMenuAudit.knownFailureMatches, 25);
  assert.equal(packet.finiteMenuAudit.knownFailureCount, 24);
  assert.equal(packet.finiteMenuAudit.tupleSquarePrimeCount, 23);
  assert.deepEqual(packet.finiteMenuAudit.repairWitnessPrimesOutsideTuplePool, [5, 67, 211, 257]);
  assert.equal(packet.forbiddenMovesAfterDecisionBlocker.includes('resume_q193_q197_singleton_descent'), true);
  assert.equal(packet.forbiddenMovesAfterDecisionBlocker.includes('treat_planning_only_orp_run_as_theorem_result'), true);
  assert.equal(packet.claims.recordsBudgetGuardedWedgeResultBlocker, true);
  assert.equal(packet.claims.livePaidCallMade, true);
  assert.equal(packet.claims.livePaidCallBudgetGuarded, true);
  assert.equal(packet.claims.liveRunIncompleteWithoutTheoremText, true);
  assert.equal(packet.claims.respectsNoPaidByDefault, true);
  assert.equal(packet.claims.provesSymbolicRelevantPairRecurrence, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.restoresOriginalGenerator, false);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 all-N recombination residual packet selects p4217 bulk complement theorem', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_MOD50_WEDGE_BLOCKER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_all_n_recombination_residual_after_mod50_wedge_blocker_packet/1');
  assert.equal(packet.status, 'all_n_recombination_residual_assembled_mod50_wedge_blocked');
  assert.equal(packet.target, 'assemble_p848_all_n_recombination_residual_after_mod50_wedge_blocker');
  assert.equal(packet.recommendedNextAction, 'derive_p848_p4217_complement_cover_or_impossibility_from_all_n_residual');
  assert.equal(
    packet.coversPrimaryNextAction.status,
    'completed_by_all_n_residual_assembly_packet',
  );
  assert.equal(packet.assembledPieces.length, 11);
  assert.equal(packet.assembledPieces.every((piece) => piece.exists === true), true);
  assert.equal(packet.residualVerdict.status, 'all_n_recombination_blocked_by_named_residual_atoms');
  assert.equal(packet.residualVerdict.allNProofAvailable, false);
  assert.equal(packet.residualVerdict.openFrontierObligationCountAtInput, 80);
  assert.equal(packet.residualTheoremAtoms.length, 5);
  assert.equal(
    packet.residualTheoremAtoms.some((atom) => atom.atomId === 'p848_p4217_unavailable_complement_cover_or_impossibility'),
    true,
  );
  assert.equal(
    packet.residualTheoremAtoms.some((atom) => atom.atomId === 'p848_mod50_symbolic_relevant_pair_recurrence_or_finite_q_partition'),
    true,
  );
  assert.equal(
    packet.residualTheoremAtoms.some((atom) => atom.atomId === 'p848_square_witness_pool_closure_for_future_rows'),
    true,
  );
  assert.equal(packet.dependencyDag.selectedNextNode, 'p4217_complement_cover_or_impossibility');
  assert.equal(packet.oneNextAction.stepId, 'derive_p848_p4217_complement_cover_or_impossibility_from_all_n_residual');
  assert.equal(packet.forbiddenMovesAfterResidualAssembly.includes('try_single_fallback_selectors_without_bulk_cover_impossibility_or_rank_decrease'), true);
  assert.equal(packet.claims.completesAllNResidualAssembly, true);
  assert.equal(packet.claims.assemblesAllNResidual, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.selectedNextActionIsTheoremFacing, true);
  assert.equal(packet.claims.selectedNextActionIsSingletonSelector, false);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.referencesBudgetGuardedIncompleteLiveRun, true);
  assert.equal(packet.claims.provesP4217ComplementCover, false);
  assert.equal(packet.claims.provesMod50Recurrence, false);
  assert.equal(packet.claims.provesFiniteQPartition, false);
  assert.equal(packet.claims.provesPost40500Sufficiency, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 p4217 cover/impossibility blocker closes the post-residual theorem attempt', () => {
  const packetPath = path.join(
    repoRoot,
    'packs',
    'number-theory',
    'problems',
    '848',
    'SPLIT_ATOM_PACKETS',
    'FRONTIER_BRIDGE',
    'P848_P4217_COMPLEMENT_COVER_IMPOSSIBILITY_BLOCKER_PACKET.json',
  );
  const packet = JSON.parse(fs.readFileSync(packetPath, 'utf8'));

  assert.equal(packet.schema, 'erdos.number_theory.p848_p4217_complement_cover_impossibility_blocker_packet/1');
  assert.equal(packet.status, 'p4217_complement_cover_impossibility_blocker_emitted_no_local_cover_theorem');
  assert.equal(packet.target, 'derive_p848_p4217_complement_cover_or_impossibility_from_all_n_residual');
  assert.equal(packet.recommendedNextAction, 'prepare_p848_p4217_complement_theorem_wedge_or_import_source_cover');
  assert.equal(
    packet.coversPrimaryNextAction.status,
    'blocked_by_no_repo_owned_p4217_complement_cover_or_impossibility',
  );
  assert.equal(
    packet.localCoverAudit.result,
    'no_repo_owned_p4217_cover_or_impossibility_theorem_available_after_residual_assembly',
  );
  assert.equal(packet.localCoverAudit.auditedSourceCount, 8);
  assert.equal(
    packet.localCoverAudit.auditedSources.every((source) => (
      source.exists === true
      && source.provesP4217ComplementCoverage === false
      && source.provesP4217ComplementImpossibility === false
    )),
    true,
  );
  assert.equal(
    packet.localCoverAudit.missingTheoremObjects.some((object) => /deterministic partition of the p4217 unavailable complement/.test(object)),
    true,
  );
  assert.equal(packet.blockerDecision.forbiddenUntilNewTheoremObject.includes('try_fallback_selectors_one_by_one'), true);
  assert.equal(packet.claims.emitsExactP4217CoverImpossibilityBlocker, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQChildDescent, true);
  assert.equal(packet.claims.blocksSingleFallbackSelectorLadder, true);
  assert.equal(packet.claims.selectsSourceOrTheoremWedgeInsteadOfFiniteDescent, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.provesP4217ComplementCover, false);
  assert.equal(packet.claims.provesP4217ComplementImpossibility, false);
  assert.equal(packet.claims.provesAllN, false);
});

test('problem 848 repaired single-lane source-import profile selects p4217 residual lane without spend', () => {
  const packet = runRepairedSingleLaneSourceImportProfileAfterNoSpendGapCompiler();

  assert.equal(packet.schema, 'erdos.number_theory.p848_repaired_single_lane_source_import_profile_after_no_spend_gap_packet/1');
  assert.equal(packet.status, 'repaired_single_lane_source_import_profile_prepared_after_no_spend_gap');
  assert.equal(packet.target, 'prepare_p848_repaired_single_lane_source_import_profile_after_no_spend_gap');
  assert.equal(packet.recommendedNextAction, 'emit_p848_p4217_residual_source_import_profile_approval_blocker_before_any_live_spend');
  assert.equal(packet.coversPrimaryNextAction.status, 'completed_by_repaired_p4217_residual_single_lane_profile');

  assert.equal(packet.selectedLane.laneId, 'p4217_residual_squarefree_realization_source');
  assert.equal(packet.selectedLane.selectionStatus, 'selected_as_single_repaired_source_import_profile_lane');
  assert.match(packet.selectedLane.theoremObject, /p4217 residual squarefree-realization source theorem/);
  assert.equal(packet.selectedLane.whySelected.length, 3);
  assert.equal(packet.selectedLane.whySharperThanPreviousAttempts.some((reason) => /previous p4217 live wedge/.test(reason)), true);

  assert.equal(packet.repairedSourceImportProfile.profileId, 'p848-p4217-residual-source-import-single');
  assert.equal(packet.repairedSourceImportProfile.laneCount, 1);
  assert.equal(packet.repairedSourceImportProfile.selectedLaneId, 'p848_p4217_residual_source_import');
  assert.equal(packet.__testProfile.profile_id, 'p848-p4217-residual-source-import-single');
  assert.equal(packet.__testProfile.lanes.length, 1);
  assert.equal(packet.__testProfile.lanes[0].lane_id, 'p848_p4217_residual_source_import');
  assert.equal(packet.__testProfile.execution_policy.live_requires_execute, true);

  assert.equal(packet.acceptableSuccessCriteria.length, 4);
  assert.equal(packet.nonAcceptableOutputs.some((output) => /q193\/q197 singleton descent/.test(output)), true);
  assert.equal(packet.paidCallPolicy.currentStepMadePaidCall, false);
  assert.equal(packet.paidCallPolicy.currentStepAllowsPaidCall, false);
  assert.equal(packet.paidCallPolicy.futureLiveCallStatus, 'requires_explicit_budget_guard_and_profile_approval');
  assert.equal(packet.oneNextAction.stepId, 'emit_p848_p4217_residual_source_import_profile_approval_blocker_before_any_live_spend');
  assert.equal(packet.oneNextAction.finiteDenominatorOrRankToken, 'p848_repaired_p4217_residual_source_import_profile_after_no_spend_gap');

  assert.equal(packet.claims.completesRepairedSingleLaneProfilePrep, true);
  assert.equal(packet.claims.selectsExactlyOneLane, true);
  assert.equal(packet.claims.selectedLaneIsP4217Residual, true);
  assert.equal(packet.claims.sharperThanPriorBroadP4217Wedge, true);
  assert.equal(packet.claims.writesFutureUseProfile, true);
  assert.equal(packet.claims.madeNewPaidCall, false);
  assert.equal(packet.claims.currentStepAllowsPaidCall, false);
  assert.equal(packet.claims.requiresApprovalBeforeFutureSpend, true);
  assert.equal(packet.claims.blocksQCoverExpansion, true);
  assert.equal(packet.claims.blocksSingletonQDescent, true);
  assert.equal(packet.claims.blocksRepeatPaidWedgeByDefault, true);
  assert.equal(packet.claims.provesFiniteP4217Partition, false);
  assert.equal(packet.claims.provesSquarefreeRealizationSourceTheorem, false);
  assert.equal(packet.claims.importsSquareModuliUnionHittingThreshold, false);
  assert.equal(packet.claims.provesAllN, false);
  assert.equal(packet.claims.decidesProblem848, false);
});
