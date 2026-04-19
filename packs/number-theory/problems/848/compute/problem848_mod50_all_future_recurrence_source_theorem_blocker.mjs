#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_STRUCTURAL_BLOCKER_PACKET = path.join(FRONTIER_BRIDGE, 'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.json');
const DEFAULT_RELEVANT_PAIR_BLOCKER_PACKET = path.join(FRONTIER_BRIDGE, 'P848_MOD50_RELEVANT_PAIR_ENUMERATOR_GENERATOR_BLOCKER_PACKET.json');
const DEFAULT_SEQUENCE_STABILITY_BLOCKER_PACKET = path.join(FRONTIER_BRIDGE, 'P848_MOD50_RESTORED_MENU_SEQUENCE_STABILITY_BLOCKER_PACKET.json');
const DEFAULT_MENU_GENERATOR_AUDIT_PACKET = path.join(FRONTIER_BRIDGE, 'P848_MOD50_MENU_GENERATOR_RESTORATION_AUDIT_PACKET.json');
const DEFAULT_BOUNDED_ENUMERATOR_PACKET = path.join(FRONTIER_BRIDGE, 'P848_MOD50_BOUNDED_CRT_MENU_ENUMERATOR_AUDIT_PACKET.json');
const DEFAULT_EXACT_REPLAY_PACKET = path.join(FRONTIER_BRIDGE, 'P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.md');

const TARGET = 'derive_p848_mod50_all_future_recurrence_or_emit_source_theorem_blocker';
const NEXT_ACTION = 'prepare_p848_mod50_all_future_recurrence_theorem_wedge_or_restore_source_generator';

function parseArgs(argv) {
  const options = {
    structuralBlockerPacket: DEFAULT_STRUCTURAL_BLOCKER_PACKET,
    relevantPairBlockerPacket: DEFAULT_RELEVANT_PAIR_BLOCKER_PACKET,
    sequenceStabilityBlockerPacket: DEFAULT_SEQUENCE_STABILITY_BLOCKER_PACKET,
    menuGeneratorAuditPacket: DEFAULT_MENU_GENERATOR_AUDIT_PACKET,
    boundedEnumeratorPacket: DEFAULT_BOUNDED_ENUMERATOR_PACKET,
    exactReplayPacket: DEFAULT_EXACT_REPLAY_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--structural-blocker-packet') {
      options.structuralBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--relevant-pair-blocker-packet') {
      options.relevantPairBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--sequence-stability-blocker-packet') {
      options.sequenceStabilityBlockerPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--menu-generator-audit-packet') {
      options.menuGeneratorAuditPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--bounded-enumerator-packet') {
      options.boundedEnumeratorPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--exact-replay-packet') {
      options.exactReplayPacket = path.resolve(argv[index + 1]);
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

function sourceEntries(options) {
  return [
    ['structuralBlocker', options.structuralBlockerPacket],
    ['relevantPairBlocker', options.relevantPairBlockerPacket],
    ['sequenceStabilityBlocker', options.sequenceStabilityBlockerPacket],
    ['menuGeneratorAudit', options.menuGeneratorAuditPacket],
    ['boundedEnumerator', options.boundedEnumeratorPacket],
    ['exactReplay', options.exactReplayPacket],
  ];
}

function sourcePaths(options) {
  return sourceEntries(options).map(([, filePath]) => path.relative(repoRoot, filePath));
}

function sourceDigests(options) {
  return Object.fromEntries(
    sourceEntries(options).map(([key, filePath]) => [`${key}Sha256`, sha256File(filePath)]),
  );
}

function sourceStatus(packet) {
  return packet?.status ?? 'missing';
}

function buildPacket(options) {
  const structuralBlocker = readJson(options.structuralBlockerPacket);
  const relevantPairBlocker = readJson(options.relevantPairBlockerPacket);
  const sequenceStabilityBlocker = readJson(options.sequenceStabilityBlockerPacket);
  const menuGeneratorAudit = readJson(options.menuGeneratorAuditPacket);
  const boundedEnumerator = readJson(options.boundedEnumeratorPacket);
  const exactReplay = readJson(options.exactReplayPacket);

  assertCondition(structuralBlocker.recommendedNextAction === TARGET, 'structural blocker does not route to the mod-50 boundary');
  assertCondition(structuralBlocker.claims?.blocksQCoverExpansion === true, 'structural blocker does not keep q-cover expansion blocked');
  assertCondition(relevantPairBlocker.claims?.provesParametricEnumeratorAbsentLocally === true, 'relevant-pair source blocker is missing or does not prove local absence');
  assertCondition(sequenceStabilityBlocker.claims?.provesSequenceNotStableRecurrence === true, 'sequence stability blocker is missing or does not block recurrence promotion');
  assertCondition(menuGeneratorAudit.claims?.provesFamilyMenuGeneratorAbsentLocally === true, 'menu-generator audit does not prove local generator absence');
  assertCondition(boundedEnumerator.claims?.provesExactMenuListReproduction === true, 'bounded enumerator does not prove finite replay reproduction');
  assertCondition(exactReplay.recommendedNextAction === TARGET, 'exact replay theorem does not target this boundary');
  assertCondition(exactReplay.claims?.provesOriginalGeneratorRestored === false, 'exact replay unexpectedly restores original generator');
  assertCondition(exactReplay.claims?.provesSymbolicRelevantPairRecurrence === false, 'exact replay unexpectedly proves symbolic recurrence');
  assertCondition(exactReplay.claims?.provesFiniteQPartition === false, 'exact replay unexpectedly proves finite Q partition');

  const sourceTheoremAudit = {
    result: 'no_repo_owned_all_future_recurrence_or_finite_q_partition_available',
    auditedSourceCount: 6,
    auditedSources: [
      {
        id: 'p4217_structural_blocker_route',
        relativePath: path.relative(repoRoot, options.structuralBlockerPacket),
        status: sourceStatus(structuralBlocker),
        usefulFact: 'The p4217 q-cover and single-selector lanes are blocked unless a structural invariant appears.',
        closureGap: structuralBlocker.proofBoundary,
        provesAllFutureRecurrence: false,
        provesFiniteQPartition: false,
      },
      {
        id: 'relevant_pair_enumerator_source_blocker',
        relativePath: path.relative(repoRoot, options.relevantPairBlockerPacket),
        status: sourceStatus(relevantPairBlocker),
        usefulFact: 'The local code surface has finite menu consumers but no parametric relevant-pair generator.',
        closureGap: relevantPairBlocker.proofBoundary,
        provesAllFutureRecurrence: false,
        provesFiniteQPartition: false,
      },
      {
        id: 'restored_menu_sequence_stability_blocker',
        relativePath: path.relative(repoRoot, options.sequenceStabilityBlockerPacket),
        status: sourceStatus(sequenceStabilityBlocker),
        usefulFact: 'The six restored finite menus are not a stable recurrence; late square moduli and known failures insert lower representatives.',
        closureGap: sequenceStabilityBlocker.proofBoundary,
        provesAllFutureRecurrence: false,
        provesFiniteQPartition: false,
      },
      {
        id: 'menu_generator_restoration_audit',
        relativePath: path.relative(repoRoot, options.menuGeneratorAuditPacket),
        status: sourceStatus(menuGeneratorAudit),
        usefulFact: 'Finite chunk/CRT provenance exists, but the original mod-50 family-menu generator is absent locally.',
        closureGap: menuGeneratorAudit.proofBoundary,
        provesAllFutureRecurrence: false,
        provesFiniteQPartition: false,
      },
      {
        id: 'bounded_crt_menu_enumerator_audit',
        relativePath: path.relative(repoRoot, options.boundedEnumeratorPacket),
        status: sourceStatus(boundedEnumerator),
        usefulFact: 'The bounded CRT enumerator exactly reproduces the restored finite menus and proves no smaller restored-menu omissions.',
        closureGap: boundedEnumerator.proofBoundary,
        provesAllFutureRecurrence: false,
        provesFiniteQPartition: false,
      },
      {
        id: 'exact_bounded_crt_menu_replay_theorem',
        relativePath: path.relative(repoRoot, options.exactReplayPacket),
        status: sourceStatus(exactReplay),
        usefulFact: 'The exact replay theorem promotes finite restored-menu reproduction while explicitly leaving all-future recurrence open.',
        closureGap: exactReplay.proofBoundary,
        provesAllFutureRecurrence: false,
        provesFiniteQPartition: false,
      },
    ],
    failedPromotions: [
      {
        promotion: 'finite restored-menu replay to all-future recurrence',
        failure: 'The replay theorem is scoped to SIX_PREFIX_NINETEEN through SIX_PREFIX_TWENTY_FOUR and does not restore the original generator.',
      },
      {
        promotion: 'six finite snapshots to stable recurrence',
        failure: 'Prefix stability fails once new known failures and square moduli enter the finite menu sequence.',
      },
      {
        promotion: 'finite Q surface to finite-Q partition',
        failure: 'No source theorem proves that future rows introduce no new square witness moduli or bad-lane denominator classes.',
      },
    ],
  };

  return {
    schema: 'erdos.number_theory.p848_mod50_all_future_recurrence_source_theorem_blocker_packet/1',
    packetId: 'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: 'mod50_all_future_recurrence_source_theorem_blocker_emitted_local_source_absent',
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_exact_source_theorem_blocker',
      sourceReplayPacket: path.relative(repoRoot, options.exactReplayPacket),
      sourceStructuralBlockerPacket: path.relative(repoRoot, options.structuralBlockerPacket),
    },
    sourcePackets: sourcePaths(options),
    sourcePacketDigests: sourceDigests(options),
    deterministicBoundary: {
      boundaryId: exactReplay.deterministicBoundary?.boundaryId ?? 'p848_mod50_all_future_recurrence_source_boundary_after_bounded_replay_theorem',
      status: 'blocked_by_absent_repo_owned_source_theorem',
      blockedInput: exactReplay.deterministicBoundary?.blockedInput ?? null,
      acceptedSuccessors: [
        'Restore the original family-menu generator or a replayable all-future source theorem.',
        'Prove a symbolic all-future relevant-pair recurrence independent of finite restored snapshots.',
        'Prove a finite Q partition for every future mod-50 square-witness pair.',
        'Use one budget-guarded theorem-wedge call only if local source archaeology remains stalled and the user budget permits it.',
      ],
      forbiddenShortcut: 'Do not treat finite restored-menu replay, finite Q samples, q-cover nonconvergence, or p4217 structural blocking as an all-future mod-50 recurrence, finite-Q partition, p4217 complement cover, or all-N proof.',
    },
    sourceTheoremAudit,
    blockerDecision: {
      decision: 'emit_source_theorem_blocker_instead_of_promoting_finite_replay',
      reason: 'All audited local artifacts are finite replay evidence, finite-source absence evidence, or blockers; none supplies the all-future recurrence, finite Q partition, or original generator theorem required at this universal boundary.',
      qCoverLaneStatus: 'blocked_until_structural_or_mod50_invariant_exists',
      finiteReplayStatus: 'finite_theorem_only_not_all_future',
      sourceTheoremStatus: 'absent_from_repo_owned_sources',
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Run local source archaeology for the original mod-50 family-menu generator and prepare a budget-guarded theorem-wedge question if no free source is recoverable.',
      coveredFamily: 'The universal mod-50 square-witness relevant-pair domain after finite restored-menu replay.',
      finiteDenominatorOrRankToken: 'p848_mod50_all_future_recurrence_source_theorem_blocker_after_bounded_replay',
      failureBoundary: 'If no local generator/source theorem is recoverable and paid execution is not allowed, keep this exact blocker canonical and require human approval before any paid theorem-wedge call.',
      whyCheaperThanAnotherSelector: 'The q-cover and p4217 selector lanes are blocked, while the missing theorem is now narrowed to a concrete mod-50 source/recurrence object.',
      command: 'rg -n "SIX_PREFIX|family_menu|knownFailure|known failure|mod50|relevant pair|tupleKey" research packs src output | head -n 200',
    },
    forbiddenMovesBeforeSourceTheorem: [
      'treat_finite_mod50_replay_as_all_future_recurrence',
      'launch_40501_plus_rollout_from_finite_replay',
      'resume_q193_q389_or_larger_q_cover_without_new_invariant',
      'run_q193_or_q197_singleton_descent',
      'try_fallback_selectors_one_by_one_without_batch_or_rank_decrease',
      'make_paid_theorem_wedge_call_without_budget_guard_and_high_leverage_purpose',
    ],
    proofBoundary: 'This packet is a source-theorem blocker. It proves only that the current repo-owned mod-50 artifacts do not contain an all-future relevant-pair recurrence, finite Q partition, or original family-menu generator theorem after the finite bounded CRT replay theorem. It does not decide Problem 848.',
    claims: {
      emitsExactSourceTheoremBlocker: true,
      auditsMod50AllFutureBoundary: true,
      provesFiniteReplayTheoremAlreadyRecorded: true,
      provesRepoOwnedAllFutureRecurrenceAbsent: true,
      provesOriginalGeneratorRestored: false,
      provesSymbolicRelevantPairRecurrence: false,
      provesFiniteQPartition: false,
      provesUniversalSquareWitnessDomainCover: false,
      blocksFiniteReplayAsAllFuture: true,
      blocks40501PlusRollout: true,
      blocksQCoverExpansion: true,
      routesToLocalSourceArchaeologyOrBudgetGuardedWedge: true,
      provesP4217ComplementCoverage: false,
      provesAllN: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 mod-50 all-future recurrence source-theorem blocker packet',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Boundary: \`${packet.deterministicBoundary.boundaryId}\``,
    '',
    '## Decision',
    '',
    packet.blockerDecision.reason,
    '',
    '## Audited Sources',
    '',
    ...packet.sourceTheoremAudit.auditedSources.map((source) => `- \`${source.id}\` (${source.status}): ${source.usefulFact} Gap: ${source.closureGap}`),
    '',
    '## Failed Promotions',
    '',
    ...packet.sourceTheoremAudit.failedPromotions.map((item) => `- \`${item.promotion}\`: ${item.failure}`),
    '',
    '## Next Move',
    '',
    packet.oneNextAction.action,
    '',
    '## Forbidden Before Source Theorem',
    '',
    ...packet.forbiddenMovesBeforeSourceTheorem.map((move) => `- \`${move}\``),
    '',
    '## Boundary',
    '',
    packet.proofBoundary,
    '',
  ].join('\n');
}

function writeOutputs(packet, options) {
  const json = JSON.stringify(packet, null, options.pretty ? 2 : 0);
  if (options.jsonOutput) {
    fs.mkdirSync(path.dirname(options.jsonOutput), { recursive: true });
    fs.writeFileSync(options.jsonOutput, `${json}\n`);
  } else {
    process.stdout.write(`${json}\n`);
  }
  if (options.markdownOutput) {
    fs.mkdirSync(path.dirname(options.markdownOutput), { recursive: true });
    fs.writeFileSync(options.markdownOutput, `${renderMarkdown(packet)}\n`);
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packet = buildPacket(options);
  writeOutputs(packet, options);
}

main();
