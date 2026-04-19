#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const problemDir = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848');
const frontierBridge = path.join(problemDir, 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_RESIDUAL_BOUNDARY = path.join(frontierBridge, 'P848_MOD50_SAME_BOUND_RESIDUAL_COUNTERFAMILY_BOUNDARY_PACKET.json');
const DEFAULT_RESTORATION_BLOCKER = path.join(frontierBridge, 'P848_MOD50_RELEVANT_PAIR_ROW_GENERATOR_RESTORATION_LOCAL_AUDIT_BLOCKER_PACKET.json');
const DEFAULT_BOUNDED_ENUMERATOR_AUDIT = path.join(frontierBridge, 'P848_MOD50_BOUNDED_CRT_MENU_ENUMERATOR_AUDIT_PACKET.json');
const DEFAULT_EXACT_REPLAY_THEOREM = path.join(frontierBridge, 'P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET.json');
const DEFAULT_SEQUENCE_STABILITY_BLOCKER = path.join(frontierBridge, 'P848_MOD50_RESTORED_MENU_SEQUENCE_STABILITY_BLOCKER_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_MOD50_SAME_BOUND_RESIDUAL_HANDOFF_LABEL_LOCAL_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_MOD50_SAME_BOUND_RESIDUAL_HANDOFF_LABEL_LOCAL_BLOCKER_PACKET.md');

const TARGET = 'prove_or_block_p848_mod50_same_bound_residual_handoff_labels_after_counterfamily_boundary';
const NEXT_ACTION = 'await_p848_new_local_row_generator_or_residual_handoff_theorem_or_explicit_guarded_source_audit_release';
const STATUS = 'mod50_same_bound_residual_handoff_label_local_blocker_emitted';
const REQUIRED_LABELS = [
  'bad-lane avoided',
  'top-tie repaired',
  'contrast-only repaired',
  'terminally blocked',
];

function parseArgs(argv) {
  const options = {
    residualBoundary: DEFAULT_RESIDUAL_BOUNDARY,
    restorationBlocker: DEFAULT_RESTORATION_BLOCKER,
    boundedEnumeratorAudit: DEFAULT_BOUNDED_ENUMERATOR_AUDIT,
    exactReplayTheorem: DEFAULT_EXACT_REPLAY_THEOREM,
    sequenceStabilityBlocker: DEFAULT_SEQUENCE_STABILITY_BLOCKER,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--residual-boundary') {
      options.residualBoundary = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--restoration-blocker') {
      options.restorationBlocker = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--bounded-enumerator-audit') {
      options.boundedEnumeratorAudit = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--exact-replay-theorem') {
      options.exactReplayTheorem = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--sequence-stability-blocker') {
      options.sequenceStabilityBlocker = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--json-output') {
      options.jsonOutput = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--markdown-output') {
      options.markdownOutput = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--write-defaults') {
      options.jsonOutput = DEFAULT_JSON_OUTPUT;
      options.markdownOutput = DEFAULT_MARKDOWN_OUTPUT;
    } else if (arg === '--pretty') {
      options.pretty = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function rel(filePath) {
  return path.relative(repoRoot, filePath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function buildPairAuditPairs(residualBoundary, exactReplayTheorem) {
  const residual = residualBoundary.residualCounterfamilyBoundary?.residual ?? {};
  const boundaryExtra = exactReplayTheorem.finiteReplayTheorem?.boundaryExtra ?? {};
  assertCondition(Number(residual.representative) === 1837022639, 'unexpected same-bound residual representative');
  assertCondition(boundaryExtra.status === 'same_representative_extra_excluded_by_recovered_tie_policy_and_limit', 'finite tie evidence missing');
  assertCondition(Number(boundaryExtra.representative) === Number(residual.representative), 'finite tie evidence representative mismatch');
  assertCondition(boundaryExtra.tupleKey === residual.tupleKey, 'finite tie evidence tuple mismatch');

  const residualPairs = residualBoundary.residualCounterfamilyBoundary?.mod50LaneResidualPairs ?? [];
  assertCondition(residualPairs.length === 4, 'expected exactly four mod-50 residual pairs');
  assertCondition(residualPairs.every((pair) => pair.verifiesAnchorNPlusOneDivisibleByQ === true), 'all residual pairs must verify anchor*n+1 divisibility');

  return residualPairs.map((pair) => ({
    anchor: pair.anchor,
    squareWitnessModulus: pair.squareWitnessModulus,
    squareWitnessLabel: pair.squareWitnessLabel,
    denominatorQOverGcd50NQ: pair.denominatorQOverGcd50NQ,
    badMClass: pair.badMClass,
    finiteTieEvidence: {
      status: 'row_excluded_by_restored_finite_twenty_four_limit_tie_policy',
      source: 'P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET',
      boundaryExtraStatus: boundaryExtra.status,
    },
    attemptedHandoffLabels: REQUIRED_LABELS.map((label) => ({
      label,
      result: 'not_proved_locally',
    })),
    localLabelResult: 'blocked_no_per_pair_handoff_theorem',
    blockerReason: 'Finite same-bound row exclusion does not classify this individual bad m-class as avoided, top-tie repaired, contrast-only repaired, or terminally blocked for the all-future mod-50 row surface.',
  }));
}

function sourceRecord(id, filePath, doc, usefulFact, gap) {
  return {
    id,
    relativePath: rel(filePath),
    sha256: sha256File(filePath),
    status: doc?.status ?? null,
    recommendedNextAction: doc?.recommendedNextAction ?? null,
    usefulFact,
    gap,
    provesResidualHandoffLabels: false,
    provesAllFutureRowGenerator: false,
    provesFiniteQPartition: false,
    provesAllN: false,
  };
}

function buildPacket(options) {
  const residualBoundary = readJson(options.residualBoundary);
  const restorationBlocker = readJson(options.restorationBlocker);
  const boundedEnumeratorAudit = readJson(options.boundedEnumeratorAudit);
  const exactReplayTheorem = readJson(options.exactReplayTheorem);
  const sequenceStabilityBlocker = readJson(options.sequenceStabilityBlocker);

  assertCondition(residualBoundary?.status === 'mod50_same_bound_residual_counterfamily_boundary_emitted', 'residual boundary not ready');
  assertCondition(residualBoundary?.recommendedNextAction === TARGET, 'residual boundary no longer routes to this target');
  assertCondition(residualBoundary?.claims?.provesResidualHandoffLabels === false, 'residual boundary unexpectedly proves labels');
  assertCondition(restorationBlocker?.claims?.provesMod50AllFutureRowGenerator === false, 'restoration blocker unexpectedly proves row generator');
  assertCondition(restorationBlocker?.claims?.provesFiniteQPartition === false, 'restoration blocker unexpectedly proves finite-Q partition');
  assertCondition(boundedEnumeratorAudit?.claims?.derivesBoundedMenuEnumerator === true, 'bounded enumerator audit missing');
  assertCondition(boundedEnumeratorAudit?.boundedEnumeratorAudit?.totalSameBoundExtra === 1, 'bounded enumerator must expose exactly one same-bound extra');
  assertCondition(exactReplayTheorem?.claims?.promotesFiniteReplayTheorem === true, 'exact replay theorem missing');
  assertCondition(exactReplayTheorem?.claims?.provesSymbolicRelevantPairRecurrence === false, 'exact replay unexpectedly proves recurrence');
  assertCondition(exactReplayTheorem?.claims?.provesFiniteQPartition === false, 'exact replay unexpectedly proves finite-Q partition');
  assertCondition(sequenceStabilityBlocker?.claims?.provesSequenceNotStableRecurrence === true, 'sequence stability blocker must reject recurrence promotion');

  const residual = residualBoundary.residualCounterfamilyBoundary.residual;
  const pairLabelAudit = buildPairAuditPairs(residualBoundary, exactReplayTheorem);

  const proofBoundary = 'This packet completes the local same-bound residual handoff-label attempt by separating finite tie-policy evidence from all-future handoff labels. The repo proves that the residual row is a finite same-bound extra excluded from SIX_PREFIX_TWENTY_FOUR by the restored finite limit/tie policy, but no local packet or source theorem classifies each residual bad m-class as bad-lane avoided, top-tie repaired, contrast-only repaired, or terminally blocked on the all-future mod-50 row surface. It emits an exact no-spend blocker, makes no provider call, does not reopen q-cover/singleton/fallback/rank-boundary expansion, does not prove a row generator or finite-Q partition, does not recombine all-N, and does not decide Problem 848.';

  return {
    schema: 'erdos.number_theory.p848_mod50_same_bound_residual_handoff_label_local_blocker_packet/1',
    packetId: 'P848_MOD50_SAME_BOUND_RESIDUAL_HANDOFF_LABEL_LOCAL_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'blocked_by_no_local_residual_handoff_label_theorem',
      residualBoundaryPacket: rel(options.residualBoundary),
      residualBoundarySha256: sha256File(options.residualBoundary),
      exactReplayTheoremPacket: rel(options.exactReplayTheorem),
      exactReplayTheoremSha256: sha256File(options.exactReplayTheorem),
    },
    handoffLabelLocalAudit: {
      auditId: 'p848_mod50_same_bound_residual_handoff_label_local_audit',
      status: 'local_attempt_complete_no_per_pair_handoff_label_theorem',
      residual: {
        representative: residual.representative,
        tuple: residual.tuple,
        tupleKey: residual.tupleKey,
        sourceLabel: residual.sourceLabel,
      },
      requiredLabels: REQUIRED_LABELS,
      pairCount: pairLabelAudit.length,
      pairLabelAudit,
      finiteTieEvidenceStatus: 'proved_for_this_restored_finite_menu_boundary',
      finiteTieEvidenceNotEnoughBecause: [
        'It excludes one finite same-bound row from the TWENTY_FOUR menu by sort/limit policy.',
        'It does not identify an all-future row generator for representatives n.',
        'It does not partition all future square witness moduli Q by Q/gcd(50*n,Q).',
        'It does not attach admissible handoff labels to the four residual bad m-classes.',
      ],
      conclusion: 'residual_handoff_labels_blocked_locally',
    },
    localSourcesChecked: [
      sourceRecord(
        'same_bound_residual_counterfamily_boundary',
        options.residualBoundary,
        residualBoundary,
        'Provides the concrete residual row and four denominator/m-class pairs.',
        'Marks every residual handoff label unproved.',
      ),
      sourceRecord(
        'exact_bounded_crt_menu_replay_theorem',
        options.exactReplayTheorem,
        exactReplayTheorem,
        'Proves the restored finite menu replay and finite same-bound tie exclusion.',
        'Explicitly does not prove symbolic recurrence, row generator, or finite-Q partition.',
      ),
      sourceRecord(
        'bounded_crt_menu_enumerator_audit',
        options.boundedEnumeratorAudit,
        boundedEnumeratorAudit,
        'Derives the bounded finite enumerator and confirms exactly one same-bound extra.',
        'The enumerator is bounded by restored finite menu parameters, not all-future rows.',
      ),
      sourceRecord(
        'row_generator_restoration_local_audit_blocker',
        options.restorationBlocker,
        restorationBlocker,
        'Confirms no repo-owned mod-50 row generator or finite-Q partition was found locally.',
        'Leaves the same theorem object as the required all-N unlock.',
      ),
      sourceRecord(
        'restored_menu_sequence_stability_blocker',
        options.sequenceStabilityBlocker,
        sequenceStabilityBlocker,
        'Rejects promotion of the restored finite sequence to a stable recurrence.',
        'No intermediate source snapshot or recurrence theorem supplies residual handoff labels.',
      ),
    ],
    theoremObjectStillMissing: {
      objectId: 'p848_mod50_relevant_pair_row_generator_or_residual_handoff_finite_q_partition',
      parentObjectId: restorationBlocker.requiredTheoremObject?.objectId ?? 'p848_mod50_relevant_pair_row_generator_or_finite_q_partition',
      exactMissingStatement: 'For the recorded same-bound residual and any all-future continuation it represents, prove for each bad m-class whether it is bad-lane avoided, top-tie repaired, contrast-only repaired, or terminally blocked, or supply the broader row-generator/finite-Q partition theorem with Q/gcd(50*n,Q) handoff labels.',
      requiredInputs: [
        'repo-owned future row representatives n or a theorem reducing them to finitely many classes',
        'square witness moduli Q for the mod-50 relevant-pair surface',
        'denominators Q/gcd(50*n,Q)',
        'handoff labels for each residual bad m-class',
      ],
      unacceptableSubstitutes: [
        'finite tie-policy exclusion for the one restored TWENTY_FOUR menu boundary',
        'bounded CRT replay without all-future hypotheses',
        'the excluded elementary arbitrary square-producing pair family',
        'q-cover expansion, singleton descent, fallback ladder, or naked rank-boundary evidence',
      ],
    },
    rankedLegalNextOptions: [
      {
        rank: 1,
        actionId: NEXT_ACTION,
        action: 'Wait for a new local residual handoff-label theorem, local row-generator/finite-Q theorem, or future explicit guarded source-audit release; keep no-spend finite-frontier expansion paused.',
        expectedInformationGain: 'high_if_new_theorem_or_release_exists',
        cost: 'free_until_future_release',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
      {
        rank: 2,
        actionId: 'prepare_future_p848_residual_handoff_label_source_audit_profile_without_execution',
        action: 'If a future instruction asks for source-audit prep but not execution, packetize a narrow residual handoff-label question using the four explicit bad m-classes.',
        expectedInformationGain: 'medium',
        cost: 'low_no_spend',
        reversibility: 'high',
        probabilityOfChangingDecision: 'low_until_release',
      },
      {
        rank: 3,
        actionId: 'future_guarded_source_audit_for_residual_handoff_labels_only',
        action: 'Under a future explicit release and fresh usage clearance only, ask for an importable theorem for residual handoff labels or the broader row-generator/finite-Q partition.',
        expectedInformationGain: 'medium_high',
        cost: 'paid_future_only',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
    ],
    forbiddenMovesAfterHandoffLabelBlocker: [
      'execute_provider_call_without_future_explicit_release',
      'treat_finite_tie_policy_exclusion_as_per_pair_handoff_label_proof',
      'promote_same_bound_residual_as_all_future_generator',
      'resume_q_cover_staircase_expansion',
      'resume_q193_q197_singleton_descent',
      'launch_next_prime_fallback_ladder',
      'emit_naked_rank_boundary',
      'claim_all_n_recombination',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Await a new local residual handoff-label theorem, row-generator/finite-Q theorem, or future explicit guarded source-audit release; finite-frontier expansion remains paused.',
      finiteDenominatorOrRankToken: 'p848_mod50_same_bound_residual_handoff_label_local_blocker',
      verificationCommand: "jq '{handoffLabelLocalAudit, theoremObjectStillMissing, claims}' packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_MOD50_SAME_BOUND_RESIDUAL_HANDOFF_LABEL_LOCAL_BLOCKER_PACKET.json",
    },
    proofBoundary,
    claims: {
      completesResidualHandoffLabelLocalAttempt: true,
      provesFiniteTieExclusionForResidualRow: true,
      provesResidualHandoffLabels: false,
      provesBadLaneAvoidance: false,
      provesTopTieRepair: false,
      provesContrastOnlyRepair: false,
      provesTerminalBlocking: false,
      provesMod50AllFutureRowGenerator: false,
      provesMod50AllFutureRecurrence: false,
      restoresOriginalGenerator: false,
      provesFiniteQPartition: false,
      confirmsBoundedCrtReplayFiniteOnly: true,
      preservesNoSpendProviderGating: true,
      madeNewPaidCall: false,
      usageCheckRun: false,
      currentStepAllowsPaidCall: false,
      providerExecutionReleased: false,
      blocksAdditionalProviderCalls: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function buildMarkdown(packet) {
  const lines = [];
  lines.push('# P848 mod-50 same-bound residual handoff-label local blocker');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push('');
  lines.push('## Residual');
  lines.push('');
  lines.push(`- Representative: \`${packet.handoffLabelLocalAudit.residual.representative}\``);
  lines.push(`- Tuple: \`${packet.handoffLabelLocalAudit.residual.tupleKey}\``);
  lines.push(`- Local audit result: \`${packet.handoffLabelLocalAudit.status}\``);
  lines.push('');
  lines.push('## Pair Label Audit');
  lines.push('');
  for (const pair of packet.handoffLabelLocalAudit.pairLabelAudit) {
    lines.push(`- anchor \`${pair.anchor}\`, Q \`${pair.squareWitnessLabel}\`, denominator \`${pair.denominatorQOverGcd50NQ}\`, bad class \`${pair.badMClass.expression}\`: \`${pair.localLabelResult}\``);
  }
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push(packet.proofBoundary);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function writeIfRequested(packet, options) {
  const json = JSON.stringify(packet, null, options.pretty ? 2 : 0);
  if (options.jsonOutput) {
    fs.mkdirSync(path.dirname(options.jsonOutput), { recursive: true });
    fs.writeFileSync(options.jsonOutput, options.pretty ? `${json}\n` : json);
  }
  if (options.markdownOutput) {
    fs.mkdirSync(path.dirname(options.markdownOutput), { recursive: true });
    fs.writeFileSync(options.markdownOutput, buildMarkdown(packet));
  }
}

const options = parseArgs(process.argv.slice(2));
const packet = buildPacket(options);
writeIfRequested(packet, options);
process.stdout.write(`${JSON.stringify(packet, null, options.pretty ? 2 : 0)}\n`);
