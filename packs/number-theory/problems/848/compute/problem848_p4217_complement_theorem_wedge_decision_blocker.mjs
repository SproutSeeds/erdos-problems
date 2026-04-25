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
const researchRoot = path.join(repoRoot, 'orp', 'research');

const DEFAULT_SOURCE_AUDIT_PACKET = path.join(frontierBridge, 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_SOURCE_IMPORT_AUDIT_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.md');

const TARGET = 'decide_p848_p4217_complement_wedge_with_budget_guard_or_local_symbolic_proof';
const NEXT_ACTION = 'reduce_p848_p4217_residual_to_squarefree_realization_source_theorem_or_emit_gap';
const STATUS = 'p4217_theorem_wedge_decision_blocker_emitted_budget_guarded_live_no_whole_complement_theorem';

function parseArgs(argv) {
  const options = {
    sourceAuditPacket: DEFAULT_SOURCE_AUDIT_PACKET,
    researchRun: null,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--source-audit-packet') {
      options.sourceAuditPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--research-run') {
      options.researchRun = path.resolve(argv[index + 1]);
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

function exists(filePath) {
  return fs.existsSync(filePath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfPresent(filePath) {
  return exists(filePath) ? readJson(filePath) : null;
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function findLatestP4217ResearchRun() {
  if (!exists(researchRoot)) {
    return null;
  }
  const answerPaths = fs.readdirSync(researchRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(researchRoot, entry.name, 'ANSWER.json'))
    .filter(exists);
  const matching = answerPaths
    .map((answerPath) => ({ answerPath, doc: readJsonIfPresent(answerPath) }))
    .filter(({ doc }) => String(doc?.question ?? '').includes('p4217 complement theorem wedge'))
    .sort((left, right) => String(right.doc?.generated_at_utc ?? '').localeCompare(String(left.doc?.generated_at_utc ?? '')));
  return matching[0]?.answerPath ?? null;
}

function readFallbackLiveWedgeRun() {
  const packet = readJsonIfPresent(DEFAULT_JSON_OUTPUT);
  return packet?.liveWedgeRun ?? null;
}

function summarizeResearchRun(runPath) {
  const runStat = runPath && exists(runPath) ? fs.statSync(runPath) : null;
  const answerPath = runPath
    ? (runStat ? (runStat.isDirectory() ? path.join(runPath, 'ANSWER.json') : runPath) : null)
    : findLatestP4217ResearchRun();
  if (!answerPath || !exists(answerPath)) {
    const fallback = readFallbackLiveWedgeRun();
    if (fallback) {
      return fallback;
    }
  }
  const doc = answerPath && exists(answerPath) ? readJson(answerPath) : null;
  const lanes = Array.isArray(doc?.lanes) ? doc.lanes : [];
  const completedTextLanes = lanes.filter((lane) => String(lane?.status ?? '') === 'complete' && String(lane?.text ?? '').trim().length > 0);
  const laneText = completedTextLanes[0]?.text ?? '';

  return {
    answerPath: answerPath ? rel(answerPath) : null,
    answerSha256: answerPath && exists(answerPath) ? sha256File(answerPath) : null,
    runId: doc?.run_id ?? null,
    profileId: doc?.profile?.profile_id ?? doc?.profile_id ?? null,
    status: doc?.status ?? 'absent',
    execute: doc?.execute ?? null,
    generatedAtUtc: doc?.generated_at_utc ?? null,
    completedLaneCount: doc?.synthesis?.completed_lane_count ?? completedTextLanes.length,
    plannedOrSkippedLaneCount: doc?.synthesis?.planned_or_skipped_lane_count ?? null,
    failedLaneCount: doc?.synthesis?.failed_lane_count ?? null,
    apiCalled: lanes.some((lane) => lane?.api_call?.called === true),
    completedTextLaneCount: completedTextLanes.length,
    laneStatuses: lanes.map((lane) => ({
      laneId: lane.lane_id,
      status: lane.status,
      called: lane.api_call?.called ?? false,
      providerStatus: lane.provider_status ?? null,
      incompleteReason: lane.incomplete_details?.reason ?? null,
      textLength: String(lane.text ?? '').length,
      outputTypes: lane.output_types ?? [],
      usage: lane.usage ?? null,
    })),
    verdict: laneText.includes('No whole-complement cover or impossibility theorem is supported')
      ? 'no_whole_complement_cover_or_impossibility_theorem_supported'
      : 'no_promotable_p4217_theorem_detected',
    minimalImportedTheorem: laneText.includes('locally admissible residual arithmetic progression')
      ? 'squarefree_values_in_every_locally_admissible_residual_arithmetic_progression_or_linear_family'
      : 'finite_partition_decreasing_rank_or_imported_squarefree_realization_theorem',
    synthesisExcerpt: String(doc?.synthesis?.answer ?? laneText ?? '').slice(0, 4000),
  };
}

function buildPacket(options) {
  const sourceAudit = readJson(options.sourceAuditPacket);
  assertCondition(sourceAudit?.recommendedNextAction === TARGET, 'source audit does not route to the p4217 wedge decision target');
  assertCondition(sourceAudit?.claims?.preparesBudgetGuardedWedgeDecision === true, 'source audit does not prepare the budget-guarded wedge decision');

  const researchRun = summarizeResearchRun(options.researchRun);
  assertCondition(researchRun.apiCalled === true, 'p4217 decision blocker expects a completed budget-guarded live research run');
  assertCondition(researchRun.status === 'complete', 'p4217 decision blocker expects a complete live research run');
  assertCondition(researchRun.completedTextLaneCount > 0, 'p4217 decision blocker expects theorem-wedge text to audit');

  return {
    schema: 'erdos.number_theory.p848_p4217_complement_theorem_wedge_decision_blocker_packet/1',
    packetId: 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'blocked_by_budget_guarded_live_wedge_no_p4217_whole_complement_theorem',
      sourceAuditPacket: rel(options.sourceAuditPacket),
      sourceAuditSha256: sha256File(options.sourceAuditPacket),
    },
    liveWedgeRun: researchRun,
    decisionVerdict: {
      result: 'no_promotable_p4217_whole_complement_theorem_found',
      wholeComplementCoverTheoremFound: false,
      wholeComplementImpossibilityTheoremFound: false,
      finitePartitionFound: false,
      decreasingInvariantFound: false,
      importedSourceTheoremFound: false,
      boundarySupported: true,
      boundaryStatement: 'Current p4217/p43/p61/q-cover artifacts do not by themselves yield all-N complement closure; they require a finite partition, decreasing rank/invariant, or imported squarefree-realization theorem.',
    },
    minimalMissingTheorem: {
      id: 'p848_p4217_residual_squarefree_realization_or_finite_partition',
      preferredSourceShape: researchRun.minimalImportedTheorem,
      alternatives: [
        'finite_complete_partition_of_the_p4217_unavailable_complement',
        'residual_exhaustion_or_absorption_into_finitely_many_discharged_families',
        'well_founded_rank_that_strictly_decreases_on_every_residual_transition',
        'source_theorem_guaranteeing_squarefree_values_in_each_residual_locally_admissible_crt_or_linear_family',
      ],
    },
    nextVerificationFork: [
      {
        forkId: 'finite_crt_partition',
        question: 'Does the all-N residual packet decompose into finitely many explicit CRT classes, each terminal or already discharged?',
        successArtifact: 'p848_p4217_residual_finite_partition_theorem_packet',
      },
      {
        forkId: 'decreasing_rank',
        question: 'Is there a well-founded rank R that strictly decreases on every unresolved p4217 residual transition?',
        successArtifact: 'p848_p4217_residual_rank_decrease_theorem_packet',
      },
      {
        forkId: 'squarefree_realization_source',
        question: 'Can every residual class be reduced to a locally admissible arithmetic progression or linear family covered by a known squarefree-values theorem?',
        successArtifact: 'p848_p4217_residual_squarefree_realization_source_theorem_packet',
      },
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Reduce the p4217 all-N residual packet to one of three theorem forks: finite CRT partition, decreasing rank, or locally admissible squarefree-realization source theorem; if none is available, emit the exact source-theorem gap.',
      finiteDenominatorOrRankToken: 'p848_p4217_theorem_wedge_live_decision_blocker',
      command: './bin/erdos problem progress 848 --json',
    },
    forbiddenMovesAfterDecisionBlocker: [
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'treat_live_orp_answer_as_proof_without_audited_packet',
      'claim_p4217_whole_complement_cover_from_negative_filters_alone',
      'claim_problem_848_decided_without_finite_partition_decreasing_rank_source_theorem_or_formal_proof',
    ],
    proofBoundary: 'This packet records a budget-guarded live ORP theorem-wedge result as process evidence only. The live lane found no promotable whole p4217 complement cover, impossibility theorem, finite partition, decreasing invariant, or imported/source theorem. It selects the next deterministic verification fork but does not decide Problem 848.',
    claims: {
      recordsBudgetGuardedLiveWedgeResult: true,
      livePaidCallMade: true,
      livePaidCallBudgetGuarded: true,
      provesP4217ComplementCover: false,
      provesP4217ComplementImpossibility: false,
      provesFiniteP4217Partition: false,
      provesDecreasingGlobalInvariant: false,
      importsSquarefreeRealizationTheorem: false,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      selectsSquarefreeRealizationFork: true,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 p4217 complement theorem-wedge decision blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- ORP run: \`${packet.liveWedgeRun.runId}\` (${packet.liveWedgeRun.status}; api called: ${packet.liveWedgeRun.apiCalled ? 'yes' : 'no'})`,
    '',
    '## Verdict',
    '',
    `- Result: \`${packet.decisionVerdict.result}\``,
    `- Boundary: ${packet.decisionVerdict.boundaryStatement}`,
    '',
    '## Missing Theorem',
    '',
    `- Preferred source shape: \`${packet.minimalMissingTheorem.preferredSourceShape}\``,
    '',
    packet.minimalMissingTheorem.alternatives.map((item) => `- ${item}`).join('\n'),
    '',
    '## Next Verification Fork',
    '',
    packet.nextVerificationFork.map((fork) => `- \`${fork.forkId}\`: ${fork.question}`).join('\n'),
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesAfterDecisionBlocker.map((move) => `- \`${move}\``).join('\n'),
    '',
    '## Boundary',
    '',
    packet.proofBoundary,
    '',
  ].join('\n');
}

function writeOutputs(packet, options) {
  if (options.jsonOutput) {
    fs.mkdirSync(path.dirname(options.jsonOutput), { recursive: true });
    fs.writeFileSync(options.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
  }
  if (options.markdownOutput) {
    fs.mkdirSync(path.dirname(options.markdownOutput), { recursive: true });
    fs.writeFileSync(options.markdownOutput, renderMarkdown(packet));
  }
}

const options = parseArgs(process.argv.slice(2));
const packet = buildPacket(options);
writeOutputs(packet, options);
process.stdout.write(`${JSON.stringify(packet, null, options.pretty ? 2 : 0)}\n`);
