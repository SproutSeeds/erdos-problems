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

const DEFAULT_SEMANTICS_BLOCKER = path.join(frontierBridge, 'P848_MOD50_ELEMENTARY_GENERATOR_RELEVANT_PAIR_SEMANTICS_BLOCKER_PACKET.json');
const DEFAULT_RELEVANT_PAIR_BLOCKER = path.join(frontierBridge, 'P848_MOD50_RELEVANT_PAIR_ENUMERATOR_GENERATOR_BLOCKER_PACKET.json');
const DEFAULT_MENU_GENERATOR_AUDIT = path.join(frontierBridge, 'P848_MOD50_MENU_GENERATOR_RESTORATION_AUDIT_PACKET.json');
const DEFAULT_BOUNDED_ENUMERATOR_AUDIT = path.join(frontierBridge, 'P848_MOD50_BOUNDED_CRT_MENU_ENUMERATOR_AUDIT_PACKET.json');
const DEFAULT_EXACT_REPLAY_THEOREM = path.join(frontierBridge, 'P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET.json');
const DEFAULT_SEQUENCE_STABILITY_BLOCKER = path.join(frontierBridge, 'P848_MOD50_RESTORED_MENU_SEQUENCE_STABILITY_BLOCKER_PACKET.json');
const DEFAULT_SOURCE_THEOREM_BLOCKER = path.join(frontierBridge, 'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_MOD50_RELEVANT_PAIR_ROW_GENERATOR_RESTORATION_LOCAL_AUDIT_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_MOD50_RELEVANT_PAIR_ROW_GENERATOR_RESTORATION_LOCAL_AUDIT_BLOCKER_PACKET.md');

const TARGET = 'restore_p848_mod50_relevant_pair_row_generator_or_finite_q_partition_after_elementary_semantics_blocker';
const NEXT_ACTION = 'await_p848_new_local_row_generator_theorem_or_explicit_guarded_source_audit_release_after_restoration_blocker';
const STATUS = 'mod50_relevant_pair_row_generator_restoration_local_audit_blocker_emitted';
const AUDIT_COMMAND = 'rg -n "family_menu|family-menu|knownFailure|known_failure|repairRows|witnessRepair|SIX_PREFIX|continuation|relevant_pair|relevant-pair|finite Q|Q partition|square witness" research/frontier-engine/src/frontier_engine packs/number-theory/problems/848/compute -g "!node_modules"';

function parseArgs(argv) {
  const options = {
    semanticsBlocker: DEFAULT_SEMANTICS_BLOCKER,
    relevantPairBlocker: DEFAULT_RELEVANT_PAIR_BLOCKER,
    menuGeneratorAudit: DEFAULT_MENU_GENERATOR_AUDIT,
    boundedEnumeratorAudit: DEFAULT_BOUNDED_ENUMERATOR_AUDIT,
    exactReplayTheorem: DEFAULT_EXACT_REPLAY_THEOREM,
    sequenceStabilityBlocker: DEFAULT_SEQUENCE_STABILITY_BLOCKER,
    sourceTheoremBlocker: DEFAULT_SOURCE_THEOREM_BLOCKER,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--semantics-blocker') {
      options.semanticsBlocker = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--relevant-pair-blocker') {
      options.relevantPairBlocker = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--menu-generator-audit') {
      options.menuGeneratorAudit = path.resolve(argv[index + 1]);
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
    } else if (arg === '--source-theorem-blocker') {
      options.sourceTheoremBlocker = path.resolve(argv[index + 1]);
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

function sourceRecord(id, filePath, doc, usefulFact, gap) {
  return {
    id,
    relativePath: rel(filePath),
    sha256: sha256File(filePath),
    status: doc?.status ?? null,
    recommendedNextAction: doc?.recommendedNextAction ?? null,
    usefulFact,
    gap,
    provesAllFutureRowGenerator: false,
    provesSymbolicRelevantPairRecurrence: false,
    provesFiniteQPartition: false,
    provesAllN: false,
  };
}

function buildPacket(options) {
  const semanticsBlocker = readJson(options.semanticsBlocker);
  const relevantPairBlocker = readJson(options.relevantPairBlocker);
  const menuGeneratorAudit = readJson(options.menuGeneratorAudit);
  const boundedEnumeratorAudit = readJson(options.boundedEnumeratorAudit);
  const exactReplayTheorem = readJson(options.exactReplayTheorem);
  const sequenceStabilityBlocker = readJson(options.sequenceStabilityBlocker);
  const sourceTheoremBlocker = readJson(options.sourceTheoremBlocker);

  assertCondition(semanticsBlocker?.status === 'mod50_elementary_generator_relevant_pair_semantics_blocker_emitted', 'semantics blocker has unexpected status');
  assertCondition(semanticsBlocker?.recommendedNextAction === TARGET, 'semantics blocker does not route to this restoration audit');
  assertCondition(semanticsBlocker?.claims?.candidateAdmissibleAsUniversalMod50RelevantPairGenerator === false, 'semantics blocker must exclude elementary generator promotion');
  assertCondition(relevantPairBlocker?.claims?.provesParametricEnumeratorAbsentLocally === true, 'relevant-pair blocker must record absent local enumerator');
  assertCondition(menuGeneratorAudit?.claims?.provesFamilyMenuGeneratorAbsentLocally === true, 'menu-generator audit must record absent generator');
  assertCondition(boundedEnumeratorAudit?.claims?.derivesBoundedMenuEnumerator === true, 'bounded enumerator audit missing');
  assertCondition(boundedEnumeratorAudit?.claims?.provesSymbolicRelevantPairRecurrence === false, 'bounded enumerator unexpectedly proves recurrence');
  assertCondition(boundedEnumeratorAudit?.claims?.provesFiniteQPartition === false, 'bounded enumerator unexpectedly proves finite-Q partition');
  assertCondition(exactReplayTheorem?.claims?.promotesFiniteReplayTheorem === true, 'exact replay theorem missing');
  assertCondition(exactReplayTheorem?.claims?.provesOriginalGeneratorRestored === false, 'exact replay unexpectedly restores original generator');
  assertCondition(exactReplayTheorem?.claims?.provesSymbolicRelevantPairRecurrence === false, 'exact replay unexpectedly proves recurrence');
  assertCondition(exactReplayTheorem?.claims?.provesFiniteQPartition === false, 'exact replay unexpectedly proves finite-Q partition');
  assertCondition(sequenceStabilityBlocker?.claims?.provesSequenceNotStableRecurrence === true, 'sequence stability blocker must reject recurrence promotion');
  assertCondition(sourceTheoremBlocker?.claims?.provesRepoOwnedAllFutureRecurrenceAbsent === true, 'source theorem blocker must record absent all-future recurrence');

  const proofBoundary = 'This packet completes the local restoration audit after the elementary generator semantics blocker. It confirms that the repo has finite menu consumers, a bounded CRT finite replay enumerator, and exact finite restored-menu replay, but no repo-owned all-future mod-50 relevant-pair row generator, symbolic recurrence, finite-Q partition, or restored original family-menu generator theorem with denominator and handoff labels. It makes no provider call, does not spend, does not reopen q-cover/singleton/fallback/rank-boundary expansion, does not recombine all-N, and does not decide Problem 848.';

  return {
    schema: 'erdos.number_theory.p848_mod50_relevant_pair_row_generator_restoration_local_audit_blocker_packet/1',
    packetId: 'P848_MOD50_RELEVANT_PAIR_ROW_GENERATOR_RESTORATION_LOCAL_AUDIT_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'blocked_by_no_repo_owned_mod50_row_generator_or_finite_q_partition_after_local_restoration_audit',
      semanticsBlockerPacket: rel(options.semanticsBlocker),
      semanticsBlockerSha256: sha256File(options.semanticsBlocker),
      relevantPairBlockerPacket: rel(options.relevantPairBlocker),
      relevantPairBlockerSha256: sha256File(options.relevantPairBlocker),
    },
    restorationAudit: {
      auditId: 'p848_mod50_relevant_pair_row_generator_restoration_local_audit',
      command: AUDIT_COMMAND,
      commandWasExecutedLocallyByDelegate: true,
      searchedSurfaces: [
        'research/frontier-engine/src/frontier_engine/p848_anchor_search.py',
        'research/frontier-engine/src/frontier_engine/p848_torch_backend.py',
        'research/frontier-engine/src/frontier_engine/p848_theorem_bridge.py',
        'research/frontier-engine/src/frontier_engine/p848_bundle.py',
        'research/frontier-engine/src/frontier_engine/cli.py',
        'packs/number-theory/problems/848/compute/problem848_mod50_bounded_crt_menu_enumerator.mjs',
        'packs/number-theory/problems/848/compute/problem848_mod50_elementary_generator_relevant_pair_semantics_blocker.mjs',
        'packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_MOD50_RELEVANT_PAIR_ENUMERATOR_GENERATOR_BLOCKER_PACKET.json',
        'packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_MOD50_MENU_GENERATOR_RESTORATION_AUDIT_PACKET.json',
        'packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_MOD50_BOUNDED_CRT_MENU_ENUMERATOR_AUDIT_PACKET.json',
        'packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET.json',
      ],
      positiveFiniteEvidence: [
        'p848_anchor_search.py loads the richest restored finite family-menu surface and extracts representative/tuple rows for scoring.',
        'p848_torch_backend.py evaluates finite continuation candidates against known packets and finite family-menu representatives.',
        'problem848_mod50_bounded_crt_menu_enumerator.mjs reconstructs the restored SIX_PREFIX_NINETEEN through TWENTY_FOUR finite menus with exact finite ordering.',
        'P848_MOD50_EXACT_BOUNDED_CRT_MENU_REPLAY_THEOREM_PACKET promotes the bounded CRT enumerator only as a finite restored-menu replay theorem.',
      ],
      negativeFindings: [
        'No inspected CLI or compute source emits all future family representatives n for the mod-50 relevant-pair row surface.',
        'No inspected source emits all future square-witness moduli Q or denominator classes Q/gcd(50*n,Q).',
        'No inspected source proves a finite-Q partition with handoff labels for bad-lane avoidance, top-tie repair, contrast-only repair, or terminal blocking.',
        'The elementary square-producing identity was already excluded as an arbitrary pair family rather than the repo-owned row generator.',
        'The bounded CRT enumerator is exact only because it is bounded by restored finite menu parameters and representative limits.',
      ],
      result: 'no_repo_owned_mod50_relevant_pair_row_generator_symbolic_recurrence_or_finite_q_partition_found',
    },
    requiredTheoremObject: {
      objectId: 'p848_mod50_relevant_pair_row_generator_or_finite_q_partition',
      requiredStatement: relevantPairBlocker.blockedObject?.requiredStatement ?? 'Enumerate all future or theorem-relevant pairs (n,Q) for the 32 mod 50 lane.',
      requiredOutputShape: relevantPairBlocker.blockedObject?.requiredOutputShape ?? [],
      normalizedAfterSemanticsBlocker: {
        rowVariable: 'n: family representative from the repo-owned row/menu surface',
        witnessVariable: 'Q: square witness modulus obstructing c*n+1 for c = 32 + 50*m',
        denominatorObject: 'Q/gcd(50*n,Q)',
        handoffLabels: [
          'bad-lane avoided',
          'top-tie repaired',
          'contrast-only repaired',
          'terminally blocked',
        ],
      },
      unacceptableSubstitutes: [
        'arbitrary square-producing pair families such as b = a*t^2 + 2*t',
        'finite restored-menu replay without an all-future proof',
        'bounded CRT enumeration tied to finite representative limits',
        'runtime/task-list language that names the theorem object but does not prove it',
        'q-cover, singleton descent, fallback selector, or naked rank-boundary evidence from another lane',
      ],
    },
    auditedEvidence: [
      sourceRecord(
        'elementary_generator_relevant_pair_semantics_blocker',
        options.semanticsBlocker,
        semanticsBlocker,
        'The paid audit candidate was locally checked and excluded as a universal row generator.',
        'It leaves the actual row generator or finite-Q partition as the next theorem object.',
      ),
      sourceRecord(
        'relevant_pair_enumerator_generator_blocker',
        options.relevantPairBlocker,
        relevantPairBlocker,
        'The earlier relevant-pair audit found finite row-menu consumers but no parametric enumerator.',
        'It remains a source blocker for the same all-future row surface.',
      ),
      sourceRecord(
        'menu_generator_restoration_audit',
        options.menuGeneratorAudit,
        menuGeneratorAudit,
        'Finite chunk/CRT provenance and singleton CRT packets exist.',
        'No original family-menu generator command or theorem source is restored locally.',
      ),
      sourceRecord(
        'bounded_crt_menu_enumerator_audit',
        options.boundedEnumeratorAudit,
        boundedEnumeratorAudit,
        'A bounded CRT enumerator exactly reproduces the six restored finite menus.',
        'Its representative bounds and menu limits keep it finite; it is not an all-future generator.',
      ),
      sourceRecord(
        'exact_bounded_crt_menu_replay_theorem',
        options.exactReplayTheorem,
        exactReplayTheorem,
        'The repo owns a finite restored-menu replay theorem.',
        'The packet explicitly leaves original generator restoration, symbolic recurrence, and finite-Q partition open.',
      ),
      sourceRecord(
        'restored_menu_sequence_stability_blocker',
        options.sequenceStabilityBlocker,
        sequenceStabilityBlocker,
        'The restored menu sequence is audited for recurrence and late Q behavior.',
        'Late witness squares and missing intermediate menu/source data block recurrence promotion.',
      ),
      sourceRecord(
        'all_future_recurrence_source_theorem_blocker',
        options.sourceTheoremBlocker,
        sourceTheoremBlocker,
        'A prior source-theorem blocker already records the absent all-future recurrence after finite replay.',
        'The current audit sharpens that absence after the elementary candidate was excluded.',
      ),
    ],
    rankedLegalNextOptions: [
      {
        rank: 1,
        actionId: NEXT_ACTION,
        action: 'Wait for a new local row-generator/finite-Q theorem, or for a future explicit guarded source-audit release narrowed to the row-generator semantics.',
        expectedInformationGain: 'high_if_new_source_available',
        cost: 'free_until_future_release',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
      {
        rank: 2,
        actionId: 'prepare_p848_mod50_row_generator_source_audit_question_after_restoration_blocker',
        action: 'Under a future explicit release only, ask for the actual row-menu generator or finite-Q theorem and reject arbitrary square-producing pair families in the prompt.',
        expectedInformationGain: 'medium',
        cost: 'paid_guarded_future_only',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
      {
        rank: 3,
        actionId: 'mine_local_residual_counterfamily_if_new_source_appears',
        action: 'If new local source data appears, test it against explicit (n,Q,denominator,handoff) counterfamilies before promotion.',
        expectedInformationGain: 'medium',
        cost: 'low',
        reversibility: 'high',
        probabilityOfChangingDecision: 'low_without_new_source',
      },
    ],
    futureUnblockConditions: [
      'A local source theorem/generator is added that emits every future mod-50 relevant-pair row and proves its ordering/domain.',
      'A local theorem proves a finite-Q partition with denominator and handoff labels for every future mod-50 square-witness pair.',
      'A future instruction explicitly releases exactly one guarded source audit after usage clearance, narrowed to row-generator/finite-Q semantics.',
    ],
    forbiddenMovesAfterRestorationAudit: [
      'execute_provider_call_under_current_no_spend_instruction',
      'rerun_the_same_broad_mod50_source_audit_without_new_release',
      'promote_arbitrary_square_producing_pairs_as_row_generators',
      'treat_bounded_crt_finite_replay_as_all_future_generator',
      'resume_q_cover_staircase_expansion',
      'resume_q193_q197_singleton_descent',
      'launch_next_prime_fallback_ladder',
      'emit_naked_rank_boundary',
      'claim_all_n_recombination',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Keep finite-frontier expansion paused until a new local row-generator/finite-Q theorem appears or a future explicit guarded source-audit release is provided.',
      finiteDenominatorOrRankToken: 'p848_mod50_row_generator_restoration_local_audit_blocker',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary,
    claims: {
      completesMod50RowGeneratorRestorationLocalAudit: true,
      provesLocalRowGeneratorAbsent: true,
      confirmsBoundedCrtReplayFiniteOnly: true,
      confirmsElementaryGeneratorExcluded: true,
      preservesNoSpendProviderGating: true,
      providerExecutionReleased: false,
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
  const lines = [];
  lines.push('# P848 mod-50 relevant-pair row-generator restoration local audit blocker');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push('');
  lines.push('## Verdict');
  lines.push('');
  lines.push(packet.restorationAudit.result);
  lines.push('');
  lines.push('The local source surface has finite replay machinery, but no all-future row generator, symbolic recurrence, or finite-Q partition with denominator and handoff labels.');
  lines.push('');
  lines.push('## Next');
  lines.push('');
  lines.push(packet.oneNextAction.action);
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
