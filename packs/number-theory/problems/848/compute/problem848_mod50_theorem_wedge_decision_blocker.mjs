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

const DEFAULT_SOURCE_WEDGE_PACKET = path.join(frontierBridge, 'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.md');
const MENU_PATH = path.join(
  repoRoot,
  'output',
  'frontier-engine-local',
  'p848-anchor-ladder',
  'live-frontier-sync',
  '2026-04-05',
  'SIX_PREFIX_TWENTY_FOUR_FAMILY_MENU.json',
);

const TARGET = 'decide_p848_mod50_recurrence_wedge_with_budget_guard_or_local_symbolic_proof';
const NEXT_ACTION = 'assemble_p848_all_n_recombination_residual_after_mod50_wedge_blocker';
const PLANNING_ONLY_STATUS = 'mod50_theorem_wedge_decision_blocker_emitted_local_and_planning_only_no_universal_theorem';
const LIVE_INCOMPLETE_STATUS = 'mod50_theorem_wedge_decision_blocker_emitted_budget_guarded_live_incomplete_no_universal_theorem';
const PLANNING_ONLY_COVER_STATUS = 'blocked_by_local_and_planning_only_wedge_no_universal_theorem';
const LIVE_INCOMPLETE_COVER_STATUS = 'blocked_by_budget_guarded_live_wedge_incomplete_no_universal_theorem';

function parseArgs(argv) {
  const options = {
    sourceWedgePacket: DEFAULT_SOURCE_WEDGE_PACKET,
    researchRun: null,
    menuPath: MENU_PATH,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--source-wedge-packet') {
      options.sourceWedgePacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--research-run') {
      options.researchRun = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--menu-path') {
      options.menuPath = path.resolve(argv[index + 1]);
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

function squareRoot(value) {
  const root = Math.sqrt(Number(value));
  return Number.isInteger(root) ? root : null;
}

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => value !== null && value !== undefined))]
    .map(Number)
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
}

function countBy(values) {
  return Object.fromEntries(
    [...values.reduce((map, value) => map.set(String(value), (map.get(String(value)) ?? 0) + 1), new Map()).entries()]
      .sort(([left], [right]) => Number(left) - Number(right)),
  );
}

function summarizeFiniteMenu(menuPath) {
  const doc = readJson(menuPath);
  const families = Array.isArray(doc.families) ? doc.families : [];
  const tupleSquareModuli = uniqueSorted(
    families.flatMap((family) => (family.tupleRows ?? []).map((row) => row.squareModulus)),
  );
  const tupleSquarePrimes = uniqueSorted(tupleSquareModuli.map(squareRoot));
  const repairWitnessPrimes = uniqueSorted(
    families.flatMap((family) => (family.repairRows ?? [])
      .flatMap((row) => (row.squareWitnesses ?? []).map((witness) => witness.prime))),
  );
  const repairWitnessPrimesOutsideTuplePool = repairWitnessPrimes.filter((prime) => !tupleSquarePrimes.includes(prime));
  const failedRepairRows = families.flatMap((family) => (family.repairRows ?? [])
    .filter((row) => row.squarefree === false)
    .map((row) => ({
      representative: Number(family.representative),
      tupleKey: family.tupleKey,
      repairAnchor: Number(row.anchor),
      squareWitnesses: row.squareWitnesses ?? [],
    })));
  const firstUnmatched = families.find((family) => family.matchesKnownFailure === false) ?? null;
  const parameters = doc.parameters ?? {};
  const knownFailures = Array.isArray(parameters.knownFailures)
    ? parameters.knownFailures.map(Number).filter(Number.isFinite)
    : [];

  return {
    relativePath: rel(menuPath),
    generatedAt: doc.generatedAt ?? null,
    method: doc.method ?? null,
    parameters: {
      anchors: parameters.anchors ?? [],
      repairAnchors: parameters.repairAnchors ?? [],
      threshold: parameters.threshold ?? null,
      limit: parameters.limit ?? null,
      distinct: parameters.distinct ?? null,
      squareModuli: parameters.squareModuli ?? [],
    },
    familyCount: Number(doc.summary?.familyCount ?? families.length),
    knownFailureMatches: Number(doc.summary?.knownFailureMatches ?? families.filter((family) => family.matchesKnownFailure === true).length),
    knownFailureCount: knownFailures.length,
    lastKnownFailure: knownFailures.length > 0 ? knownFailures.at(-1) : null,
    firstUnmatchedRepresentative: firstUnmatched?.representative ?? null,
    firstUnmatchedTupleKey: firstUnmatched?.tupleKey ?? null,
    tupleSquarePrimeCount: tupleSquarePrimes.length,
    tupleSquarePrimes,
    maxTupleSquarePrime: tupleSquarePrimes.at(-1) ?? null,
    repairWitnessPrimeCount: repairWitnessPrimes.length,
    repairWitnessPrimes,
    repairWitnessPrimesOutsideTuplePool,
    failedRepairRowCount: failedRepairRows.length,
    failedRepairRowsByAnchor: countBy(failedRepairRows.map((row) => row.repairAnchor)),
    firstFailedRepairRows: failedRepairRows.slice(0, 24),
    finiteOnlyBoundary: [
      'The menu is explicitly generated with a finite family limit and threshold.',
      'The family rows are observed/restored finite representatives, not a symbolic recurrence over all future rows.',
      'Repair witness primes outside the tuple square-prime pool show the current finite Q pool is not closed by the restored tuple menu alone.',
    ],
  };
}

function findLatestPlanningRun() {
  if (!exists(researchRoot)) {
    return null;
  }
  const answerPaths = fs.readdirSync(researchRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(researchRoot, entry.name, 'ANSWER.json'))
    .filter(exists);
  const matching = answerPaths
    .map((answerPath) => ({ answerPath, doc: readJsonIfPresent(answerPath) }))
    .filter(({ doc }) => String(doc?.question ?? '').includes('Problem 848 theorem wedge'))
    .sort((left, right) => String(right.doc?.generated_at_utc ?? '').localeCompare(String(left.doc?.generated_at_utc ?? '')));
  return matching[0]?.answerPath ?? null;
}

function summarizeResearchRun(runPath) {
  const answerPath = runPath
    ? (fs.statSync(runPath).isDirectory() ? path.join(runPath, 'ANSWER.json') : runPath)
    : findLatestPlanningRun();
  const doc = answerPath && exists(answerPath) ? readJson(answerPath) : null;
  const lanes = Array.isArray(doc?.lanes) ? doc.lanes : [];
  return {
    answerPath: answerPath ? rel(answerPath) : null,
    runId: doc?.run_id ?? null,
    profileId: doc?.profile?.profile_id ?? null,
    status: doc?.status ?? 'absent',
    execute: doc?.execute ?? null,
    generatedAtUtc: doc?.generated_at_utc ?? null,
    completedLaneCount: doc?.synthesis?.completed_lane_count ?? null,
    plannedOrSkippedLaneCount: doc?.synthesis?.planned_or_skipped_lane_count ?? null,
    failedLaneCount: doc?.synthesis?.failed_lane_count ?? null,
    apiCalled: lanes.some((lane) => lane?.api_call?.called === true),
    completedTextLaneCount: lanes.filter((lane) => lane.status === 'completed' && String(lane.text ?? '').trim().length > 0).length,
    laneStatuses: lanes.map((lane) => ({
      laneId: lane.lane_id,
      status: lane.status,
      called: lane.api_call?.called ?? false,
      providerStatus: lane.provider_status ?? null,
      incompleteReason: lane.incomplete_details?.reason ?? null,
      textLength: String(lane.text ?? '').length,
      outputTypes: lane.output_types ?? [],
      usage: lane.usage ?? null,
      reason: lane.api_call?.reason ?? null,
    })),
    synthesis: doc?.synthesis?.answer ?? null,
  };
}

function buildPacket(options) {
  const sourceWedge = readJson(options.sourceWedgePacket);
  assertCondition(sourceWedge?.recommendedNextAction === TARGET, 'source wedge does not route to the theorem-wedge decision target');
  assertCondition(sourceWedge?.claims?.preparesBudgetGuardedTheoremWedge === true, 'source wedge does not prepare the budget-guarded theorem wedge');
  assertCondition(sourceWedge?.claims?.livePaidCallMade === false, 'source wedge unexpectedly made a live paid call');

  const finiteMenuAudit = summarizeFiniteMenu(options.menuPath);
  const researchRun = summarizeResearchRun(options.researchRun);
  const liveRunMade = researchRun.execute === true || researchRun.apiCalled === true;
  const liveRunIncompleteWithoutTheoremText = liveRunMade && researchRun.completedTextLaneCount === 0;
  const packetStatus = liveRunMade ? LIVE_INCOMPLETE_STATUS : PLANNING_ONLY_STATUS;
  const coverStatus = liveRunMade ? LIVE_INCOMPLETE_COVER_STATUS : PLANNING_ONLY_COVER_STATUS;
  const localProofVerdict = {
    status: liveRunMade
      ? 'blocked_budget_guarded_live_incomplete_no_universal_theorem'
      : 'blocked_local_and_planning_only_no_universal_theorem',
    symbolicRelevantPairRecurrenceProved: false,
    finiteQPartitionProved: false,
    originalSourceGeneratorRestored: false,
    reason: [
      liveRunMade
        ? 'The budget-guarded live ORP/OpenAI run made one API call but returned no theorem text; its lane is incomplete, so it cannot be promoted to proof evidence.'
        : 'The no-spend ORP run is planning-only and contains no completed theorem lane.',
      'The richest restored menu is finite: it has 280 family rows with an explicit finite limit and only 25 known-failure matches.',
      'The current repair witness set is not closed by the tuple square-prime pool, so the finite Q pool cannot be promoted to an all-future partition from this data alone.',
      'No local artifact supplies an induction/order theorem showing that future rows cannot introduce new square witnesses or lower representatives indefinitely.',
    ],
  };

  return {
    schema: 'erdos.number_theory.p848_mod50_theorem_wedge_decision_blocker_packet/1',
    packetId: 'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: packetStatus,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: coverStatus,
      sourceWedgePacket: rel(options.sourceWedgePacket),
      sourceWedgeSha256: sha256File(options.sourceWedgePacket),
    },
    localProofVerdict,
    orpResearchRun: researchRun,
    orpPlanningRun: researchRun,
    liveWedgeRun: liveRunMade ? researchRun : null,
    finiteMenuAudit,
    missingTheorem: {
      id: 'p848_mod50_all_future_relevant_pair_recurrence_or_finite_q_partition',
      statementNeeded: 'A symbolic theorem proving that every future mod-50 relevant-pair row is generated by a finite recurrence/partition whose square-witness Q set is closed, or an equivalent source-generator theorem that makes the bounded CRT replay universal.',
      missingAtoms: [
        'A generator for all future relevant-pair/family-menu rows, not only restored rows below a finite menu limit.',
        'A proof that the square-witness prime/modulus pool is closed under future rows, or an explicit finite Q partition with no outside witnesses.',
        'A monotone/order theorem preventing later rows from introducing lower representatives or new first-failure classes.',
        'A recombination rule showing how the mod-50 theorem interacts with the p4217 complement ledger and q-cover staircase blocker.',
      ],
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Assemble the all-N residual after the mod-50 theorem wedge blocker: list the exact remaining theorem atoms and keep q-cover/singleton descent blocked until a symbolic recurrence, finite-Q partition, restored source generator, or approved live theorem-wedge result exists.',
      finiteDenominatorOrRankToken: 'p848_mod50_theorem_wedge_decision_blocker_after_planning_only_run',
      failureBoundary: 'If recombination still cannot close, record the exact residual theorem atoms instead of launching q-cover/rank-boundary expansion.',
      command: './bin/erdos problem progress 848 --json',
    },
    forbiddenMovesAfterDecisionBlocker: [
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'treat_planning_only_orp_run_as_theorem_result',
      'treat_280_row_finite_menu_as_all_future_recurrence',
      'treat_current_square_witness_pool_as_finite_q_partition_without_closure_proof',
      'run_live_orp_openai_without_usage_guard_and_explicit_paid_opt_in',
    ],
    proofBoundary: liveRunMade
      ? 'This packet decides the prepared wedge only as a budget-guarded incomplete-result blocker: one live theorem-wedge call was made, but it returned no theorem text and cannot be promoted to proof evidence. It does not decide Problem 848.'
      : 'This packet decides the prepared wedge only in the local/planning-only sense: it records that no symbolic recurrence, finite-Q partition, or restored source generator is available from the audited local data or the no-spend planning run. It does not decide Problem 848.',
    claims: {
      recordsBudgetGuardedWedgeResultBlocker: true,
      usedPlanningOnlyResearchArtifact: !liveRunMade && researchRun.status !== 'absent',
      livePaidCallMade: liveRunMade,
      livePaidCallBudgetGuarded: liveRunMade,
      liveRunIncompleteWithoutTheoremText,
      respectsNoPaidByDefault: true,
      provesSymbolicRelevantPairRecurrence: false,
      provesFiniteQPartition: false,
      restoresOriginalGenerator: false,
      provesUniversalSquareWitnessDomainCover: false,
      provesAllN: false,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      selectsAllNResidualAssembly: true,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 mod-50 theorem-wedge decision blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- ORP research run: \`${packet.orpResearchRun.runId ?? 'none'}\` (${packet.orpResearchRun.status}; api called: ${packet.orpResearchRun.apiCalled ? 'yes' : 'no'})`,
    '',
    '## Verdict',
    '',
    packet.localProofVerdict.reason.map((reason) => `- ${reason}`).join('\n'),
    '',
    '## Finite Menu Audit',
    '',
    `- Menu: \`${packet.finiteMenuAudit.relativePath}\``,
    `- Families: ${packet.finiteMenuAudit.familyCount}; known-failure matches: ${packet.finiteMenuAudit.knownFailureMatches}; known failures: ${packet.finiteMenuAudit.knownFailureCount}`,
    `- Tuple square-prime pool (${packet.finiteMenuAudit.tupleSquarePrimeCount}): ${packet.finiteMenuAudit.tupleSquarePrimes.join(', ')}`,
    `- Repair witness primes outside tuple pool: ${packet.finiteMenuAudit.repairWitnessPrimesOutsideTuplePool.join(', ') || 'none'}`,
    `- Failed repair rows: ${packet.finiteMenuAudit.failedRepairRowCount}`,
    '',
    '## Missing Theorem',
    '',
    packet.missingTheorem.statementNeeded,
    '',
    'Missing atoms:',
    '',
    packet.missingTheorem.missingAtoms.map((atom) => `- ${atom}`).join('\n'),
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
