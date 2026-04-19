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

const DEFAULT_RESTORATION_BLOCKER = path.join(frontierBridge, 'P848_MOD50_RELEVANT_PAIR_ROW_GENERATOR_RESTORATION_LOCAL_AUDIT_BLOCKER_PACKET.json');
const DEFAULT_BOUNDED_ENUMERATOR_AUDIT = path.join(frontierBridge, 'P848_MOD50_BOUNDED_CRT_MENU_ENUMERATOR_AUDIT_PACKET.json');
const DEFAULT_SEQUENCE_STABILITY_BLOCKER = path.join(frontierBridge, 'P848_MOD50_RESTORED_MENU_SEQUENCE_STABILITY_BLOCKER_PACKET.json');
const DEFAULT_MENU_ROOT = path.join(repoRoot, 'output', 'frontier-engine-local', 'p848-anchor-ladder', 'live-frontier-sync', '2026-04-05');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_MOD50_SAME_BOUND_RESIDUAL_COUNTERFAMILY_BOUNDARY_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_MOD50_SAME_BOUND_RESIDUAL_COUNTERFAMILY_BOUNDARY_PACKET.md');

const TARGET = 'mine_p848_mod50_restored_menu_residual_counterfamily_after_restoration_blocker';
const COVERED_STEP = 'await_p848_new_local_row_generator_theorem_or_explicit_guarded_source_audit_release_after_restoration_blocker';
const NEXT_ACTION = 'prove_or_block_p848_mod50_same_bound_residual_handoff_labels_after_counterfamily_boundary';
const STATUS = 'mod50_same_bound_residual_counterfamily_boundary_emitted';

const ANCHORS = [7, 32, 57, 82, 132, 182];
const MOD50_LANE_ANCHORS = new Set([32, 82, 132, 182]);

function parseArgs(argv) {
  const options = {
    restorationBlocker: DEFAULT_RESTORATION_BLOCKER,
    boundedEnumeratorAudit: DEFAULT_BOUNDED_ENUMERATOR_AUDIT,
    sequenceStabilityBlocker: DEFAULT_SEQUENCE_STABILITY_BLOCKER,
    menuRoot: DEFAULT_MENU_ROOT,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--restoration-blocker') {
      options.restorationBlocker = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--bounded-enumerator-audit') {
      options.boundedEnumeratorAudit = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--sequence-stability-blocker') {
      options.sequenceStabilityBlocker = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--menu-root') {
      options.menuRoot = path.resolve(argv[index + 1]);
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

function gcd(left, right) {
  let a = BigInt(left);
  let b = BigInt(right);
  if (a < 0n) a = -a;
  if (b < 0n) b = -b;
  while (b !== 0n) {
    [a, b] = [b, a % b];
  }
  return a;
}

function squareLabel(squareModulus) {
  if (squareModulus === 4 || squareModulus === 9) {
    return String(squareModulus);
  }
  return `${Math.trunc(Math.sqrt(squareModulus))}^2`;
}

function tupleKey(tuple) {
  return tuple.map(squareLabel).join(', ');
}

function tupleKeyFromFamily(family) {
  return tupleKey((family.tupleRows ?? []).map((row) => Number(row.squareModulus)));
}

function menuLabels(menuRoot) {
  if (!fs.existsSync(menuRoot)) {
    return [];
  }
  return fs.readdirSync(menuRoot)
    .filter((entry) => entry.endsWith('_FAMILY_MENU.json'))
    .map((entry) => entry.replace(/_FAMILY_MENU\.json$/u, ''))
    .sort();
}

function readMenu(menuRoot, label) {
  return readJson(path.join(menuRoot, `${label}_FAMILY_MENU.json`));
}

function findBoundedResidual(boundedEnumeratorAudit) {
  const menus = boundedEnumeratorAudit?.boundedEnumeratorAudit?.menus ?? [];
  const menu = menus.find((entry) => entry.label === 'SIX_PREFIX_TWENTY_FOUR');
  const sample = menu?.sameBoundExtraSample ?? null;
  assertCondition(sample, 'TWENTY_FOUR same-bound extra sample missing from bounded enumerator audit');
  assertCondition(Number(sample.representative) === Number(menu.representativeBound), 'same-bound extra must sit at the TWENTY_FOUR representative bound');
  assertCondition(Array.isArray(sample.tuple) && sample.tuple.length === ANCHORS.length, 'same-bound extra tuple must have six square witnesses');
  assertCondition(menu.sameBoundExtraCount === 1, 'expected exactly one TWENTY_FOUR same-bound extra');
  assertCondition(menu.smallerExtraCount === 0, 'same-bound residual packet requires no smaller extras');
  assertCondition(boundedEnumeratorAudit?.boundedEnumeratorAudit?.allNoSmallerExtras === true, 'bounded enumerator must prove no smaller extras');
  assertCondition(boundedEnumeratorAudit?.boundedEnumeratorAudit?.exactOrderedListReproduction === true, 'bounded enumerator must exactly reproduce finite menu order');
  return {
    sourceLabel: menu.label,
    limit: menu.limit,
    representative: sample.representative,
    representativeBound: menu.representativeBound,
    tuple: sample.tuple,
    tupleKey: sample.tupleKey ?? tupleKey(sample.tuple),
    sameBoundExtraCount: menu.sameBoundExtraCount,
    smallerExtraCount: menu.smallerExtraCount,
    interpretation: 'The bounded CRT enumerator still emits this row at the TWENTY_FOUR representative bound, while the finite TWENTY_FOUR menu excludes it by limit/tie policy. This is a finite residual against shortcutting finite replay into an all-future recurrence.',
  };
}

function deletedFamilyRecord(sequenceStabilityBlocker, residual) {
  const transitions = sequenceStabilityBlocker?.transitionAudit?.transitions ?? [];
  for (const transition of transitions) {
    const deleted = (transition.deletedFamilies ?? []).find((family) => (
      Number(family.representative) === Number(residual.representative)
      && family.tupleKey === residual.tupleKey
    ));
    if (deleted) {
      return {
        transitionId: `${transition.from}_to_${transition.to}`,
        from: transition.from,
        to: transition.to,
        deletedFamily: deleted,
        prefixStable: transition.prefixStable,
        addedLane32WitnessSquares: transition.addedLane32WitnessSquares ?? [],
        addedSquareModuli: transition.addedSquareModuli ?? [],
      };
    }
  }
  return null;
}

function verifyMenuPosition(menuRoot, residual) {
  const twentyThree = readMenu(menuRoot, 'SIX_PREFIX_TWENTY_THREE');
  const twentyFour = readMenu(menuRoot, 'SIX_PREFIX_TWENTY_FOUR');
  const matches = (family) => (
    Number(family.representative) === Number(residual.representative)
    && tupleKeyFromFamily(family) === residual.tupleKey
  );
  return {
    twentyThreeContainsResidual: (twentyThree.families ?? []).some(matches),
    twentyFourContainsResidual: (twentyFour.families ?? []).some(matches),
    twentyThreeLimit: twentyThree.parameters?.limit ?? null,
    twentyFourLimit: twentyFour.parameters?.limit ?? null,
    twentyThreeFamilyCount: (twentyThree.families ?? []).length,
    twentyFourFamilyCount: (twentyFour.families ?? []).length,
  };
}

function buildAnchorRows(residual) {
  const n = BigInt(residual.representative);
  return residual.tuple.map((squareModulus, index) => {
    const anchor = ANCHORS[index];
    const q = BigInt(squareModulus);
    const divisor = gcd(50n * n, q);
    const denominator = q / divisor;
    const anchorValue = BigInt(anchor);
    const witnessCheckRemainder = (anchorValue * n + 1n) % q;
    const m0 = MOD50_LANE_ANCHORS.has(anchor)
      ? Math.trunc((anchor - 32) / 50)
      : null;
    return {
      anchor,
      squareWitnessModulus: squareModulus,
      squareWitnessLabel: squareLabel(squareModulus),
      verifiesAnchorNPlusOneDivisibleByQ: witnessCheckRemainder === 0n,
      denominatorQOverGcd50NQ: Number(denominator),
      mod50Lane: MOD50_LANE_ANCHORS.has(anchor),
      badMClass: m0 === null ? null : {
        expression: `m == ${m0} mod ${denominator.toString()}`,
        residue: m0,
        modulus: Number(denominator),
      },
      handoffLabelStatus: MOD50_LANE_ANCHORS.has(anchor)
        ? 'unproved_for_this_residual_pair'
        : 'support_anchor_not_32_mod_50_lane',
    };
  });
}

function buildPacket(options) {
  const restorationBlocker = readJson(options.restorationBlocker);
  const boundedEnumeratorAudit = readJson(options.boundedEnumeratorAudit);
  const sequenceStabilityBlocker = readJson(options.sequenceStabilityBlocker);

  assertCondition(restorationBlocker?.status === 'mod50_relevant_pair_row_generator_restoration_local_audit_blocker_emitted', 'restoration blocker not ready');
  assertCondition(restorationBlocker?.recommendedNextAction === COVERED_STEP, 'restoration blocker no longer routes to the covered wait step');
  assertCondition(boundedEnumeratorAudit?.claims?.derivesBoundedMenuEnumerator === true, 'bounded CRT audit missing');
  assertCondition(boundedEnumeratorAudit?.claims?.provesSymbolicRelevantPairRecurrence === false, 'bounded CRT audit unexpectedly proves recurrence');
  assertCondition(sequenceStabilityBlocker?.claims?.provesSequenceNotStableRecurrence === true, 'sequence stability blocker must reject recurrence promotion');

  const residual = findBoundedResidual(boundedEnumeratorAudit);
  const deletedRecord = deletedFamilyRecord(sequenceStabilityBlocker, residual);
  assertCondition(deletedRecord, 'same-bound residual must match a deleted family in the sequence stability blocker');
  const menuPosition = verifyMenuPosition(options.menuRoot, residual);
  assertCondition(menuPosition.twentyThreeContainsResidual === true, 'SIX_PREFIX_TWENTY_THREE must contain the residual row');
  assertCondition(menuPosition.twentyFourContainsResidual === false, 'SIX_PREFIX_TWENTY_FOUR must exclude the residual row');

  const labels = menuLabels(options.menuRoot);
  const hiddenSourceAudit = {
    menuRoot: rel(options.menuRoot),
    presentFamilyMenuLabels: labels,
    missingExpectedContinuationLabels: ['SIX_PREFIX_TWENTY_FIVE'].filter((label) => !labels.includes(label)),
    localSequenceJump: {
      fromLimit: menuPosition.twentyThreeLimit,
      toLimit: menuPosition.twentyFourLimit,
      missingIntermediateLimit: 270,
      intermediateMenuPresent: labels.some((label) => /TWENTY_THREE_HALF|TWENTY_THREE_POINT_FIVE|270/u.test(label)),
    },
    conclusion: 'No local SIX_PREFIX_TWENTY_FIVE or 270-row family-menu snapshot is present in the restored menu root.',
  };

  const anchorRows = buildAnchorRows(residual);
  const mod50LaneResidualPairs = anchorRows.filter((row) => row.mod50Lane);

  const proofBoundary = 'This packet is a no-spend residual counterfamily boundary, not a recurrence theorem. It records that the exact bounded CRT enumerator emits a same-bound TWENTY_FOUR residual row that the finite menu excludes, while the restored sequence has late witness/modulus changes and no local TWENTY_FIVE or 270-row source snapshot. The packet supplies explicit mod-50 residual pairs with Q/gcd(50*n,Q) denominators and marks the handoff labels as unproved. It makes no provider call, does not spend, does not reopen q-cover/singleton/fallback/rank-boundary expansion, does not prove a finite-Q partition, does not recombine all-N, and does not decide Problem 848.';

  return {
    schema: 'erdos.number_theory.p848_mod50_same_bound_residual_counterfamily_boundary_packet/1',
    packetId: 'P848_MOD50_SAME_BOUND_RESIDUAL_COUNTERFAMILY_BOUNDARY_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: COVERED_STEP,
      status: 'recovered_by_no_spend_same_bound_residual_counterfamily_boundary',
      restorationBlockerPacket: rel(options.restorationBlocker),
      restorationBlockerSha256: sha256File(options.restorationBlocker),
      boundedEnumeratorAuditPacket: rel(options.boundedEnumeratorAudit),
      boundedEnumeratorAuditSha256: sha256File(options.boundedEnumeratorAudit),
      sequenceStabilityBlockerPacket: rel(options.sequenceStabilityBlocker),
      sequenceStabilityBlockerSha256: sha256File(options.sequenceStabilityBlocker),
    },
    residualCounterfamilyBoundary: {
      boundaryId: 'p848_mod50_same_bound_residual_counterfamily_boundary',
      status: 'finite_residual_handoff_labels_unproved',
      residual,
      menuPosition,
      deletedRecord,
      anchorRows,
      mod50LaneResidualPairs,
      failedHandoff: {
        status: 'no_local_handoff_label_proved_for_residual_pairs',
        requiredLabels: restorationBlocker?.requiredTheoremObject?.normalizedAfterSemanticsBlocker?.handoffLabels ?? [
          'bad-lane avoided',
          'top-tie repaired',
          'contrast-only repaired',
          'terminally blocked',
        ],
        failedReason: 'The local packets prove finite replay and finite deletion/exclusion, but no source theorem explains whether the residual mod-50 bad m-classes are avoided, repaired, contrast-only, or terminal for every future row.',
      },
    },
    hiddenSourceAudit,
    theoremObjectStillMissing: restorationBlocker.requiredTheoremObject ?? null,
    rankedLegalNextOptions: [
      {
        rank: 1,
        actionId: NEXT_ACTION,
        action: 'Attempt a local proof or exact blocker for the handoff labels of the one same-bound residual row only, using the explicit (n,Q,denominator,m-class) data in this packet.',
        expectedInformationGain: 'medium_high',
        cost: 'low_no_spend',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
      {
        rank: 2,
        actionId: 'await_p848_new_local_row_generator_theorem_or_explicit_guarded_source_audit_release_after_residual_boundary',
        action: 'If the residual handoff labels cannot be proved locally, keep finite-frontier expansion paused until a new row-generator/finite-Q theorem or explicit future guarded source-audit release appears.',
        expectedInformationGain: 'high_if_new_source_available',
        cost: 'free_until_future_release',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
      {
        rank: 3,
        actionId: 'prepare_p848_mod50_residual_source_audit_question_for_future_release',
        action: 'Under a future explicit release only, ask for a theorem explaining the same-bound residual deletion/exclusion and every future mod-50 row handoff label.',
        expectedInformationGain: 'medium',
        cost: 'paid_guarded_future_only',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
    ],
    forbiddenMovesAfterResidualBoundary: [
      'execute_provider_call_without_future_explicit_release',
      'promote_same_bound_residual_as_all_future_generator',
      'treat_finite_menu_deletion_as_terminal_without_handoff_label_proof',
      'resume_q_cover_staircase_expansion',
      'resume_q193_q197_singleton_descent',
      'launch_next_prime_fallback_ladder',
      'emit_naked_rank_boundary',
      'claim_all_n_recombination',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Prove or block, locally and only for the recorded same-bound residual, whether each mod-50 bad m-class has a valid handoff label.',
      finiteDenominatorOrRankToken: 'p848_mod50_same_bound_residual_counterfamily_boundary',
      verificationCommand: "jq '{residualCounterfamilyBoundary, hiddenSourceAudit, rankedLegalNextOptions, claims}' packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_MOD50_SAME_BOUND_RESIDUAL_COUNTERFAMILY_BOUNDARY_PACKET.json",
    },
    proofBoundary,
    claims: {
      emitsConcreteResidualCounterfamilyBoundary: true,
      identifiesSameBoundResidualRow: true,
      verifiesResidualDeletedFromTwentyThreeToTwentyFour: true,
      verifiesResidualAbsentFromTwentyFourMenu: true,
      providesMod50ResidualDenominators: true,
      provesResidualHandoffLabels: false,
      provesLocalRowGeneratorAbsent: true,
      confirmsBoundedCrtReplayFiniteOnly: true,
      preservesNoSpendProviderGating: true,
      madeNewPaidCall: false,
      blocksAdditionalProviderCalls: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      provesMod50AllFutureRowGenerator: false,
      provesMod50AllFutureRecurrence: false,
      restoresOriginalGenerator: false,
      provesFiniteQPartition: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function buildMarkdown(packet) {
  const residual = packet.residualCounterfamilyBoundary.residual;
  const lines = [];
  lines.push('# P848 mod-50 same-bound residual counterfamily boundary');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push('');
  lines.push('## Residual');
  lines.push('');
  lines.push(`- Representative: \`${residual.representative}\``);
  lines.push(`- Tuple: \`${residual.tupleKey}\``);
  lines.push(`- Source label: \`${residual.sourceLabel}\``);
  lines.push(`- Same-bound extra count: \`${residual.sameBoundExtraCount}\``);
  lines.push('');
  lines.push('## Mod-50 Pairs');
  lines.push('');
  for (const row of packet.residualCounterfamilyBoundary.mod50LaneResidualPairs) {
    lines.push(`- anchor \`${row.anchor}\`, Q \`${row.squareWitnessLabel}\`, denominator \`${row.denominatorQOverGcd50NQ}\`, bad class \`${row.badMClass.expression}\`, handoff \`${row.handoffLabelStatus}\``);
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
