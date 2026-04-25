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

const DEFAULT_CORRECTED_SIEVE_PACKET = path.join(frontierBridge, 'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json');
const DEFAULT_P4217_BLOCKER = path.join(frontierBridge, 'P848_P4217_COMPLEMENT_COVER_IMPOSSIBILITY_BLOCKER_PACKET.json');
const DEFAULT_ORP_RUN = path.join(repoRoot, 'orp', 'research', 'research-20260418-051714-042723');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_SOURCE_IMPORT_AUDIT_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_SOURCE_IMPORT_AUDIT_PACKET.md');

const TARGET = 'prepare_p848_p4217_complement_theorem_wedge_or_import_source_cover';
const NEXT_ACTION = 'decide_p848_p4217_complement_wedge_with_budget_guard_or_local_symbolic_proof';

const P4217_SOURCE_FILES = [
  'P848_P4217_UNAVAILABLE_COMPLEMENT_REFINEMENT_PACKET.json',
  'P848_P4217_COMPLEMENT_P43_SQUARE_OBSTRUCTION_PACKET.json',
  'P848_P4217_COMPLEMENT_P61_AVAILABILITY_REFINEMENT_PACKET.json',
  'P848_P4217_COMPLEMENT_P61_Q101_SQUARE_OBSTRUCTION_PACKET.json',
  'P848_P4217_COMPLEMENT_P61_Q101_P443_REPAIR_HANDOFF_PACKET.json',
  'P848_P4217_COMPLEMENT_P61_Q101_P443_AVAILABILITY_SPLIT_PACKET.json',
  'P848_P4217_COMPLEMENT_P61_Q101_P443_Q97_P479_AVAILABILITY_SPLIT_PACKET.json',
  'P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET.json',
  'P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET.json',
  'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.json',
  'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_MOD50_WEDGE_BLOCKER_PACKET.json',
];

function parseArgs(argv) {
  const options = {
    correctedSievePacket: DEFAULT_CORRECTED_SIEVE_PACKET,
    p4217Blocker: DEFAULT_P4217_BLOCKER,
    orpRun: DEFAULT_ORP_RUN,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--corrected-sieve-packet') {
      options.correctedSievePacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p4217-blocker') {
      options.p4217Blocker = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--orp-run') {
      options.orpRun = path.resolve(argv[index + 1]);
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

function readJsonIfPresent(filePath) {
  return fs.existsSync(filePath) ? readJson(filePath) : null;
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function summarizeSourcePacket(fileName) {
  const filePath = path.join(frontierBridge, fileName);
  const doc = readJsonIfPresent(filePath);
  return {
    id: fileName.replace(/\.json$/, ''),
    relativePath: rel(filePath),
    exists: Boolean(doc),
    sha256: doc ? sha256File(filePath) : null,
    status: doc?.status ?? null,
    packetId: doc?.packetId ?? null,
    target: doc?.target ?? null,
    recommendedNextAction: doc?.recommendedNextAction ?? null,
    usefulFact: inferUsefulFact(fileName, doc),
    gap: inferGap(fileName, doc),
    provesWholeComplementCover: Boolean(doc?.claims?.provesP4217ComplementCover),
    provesWholeComplementImpossibility: Boolean(doc?.claims?.provesP4217ComplementImpossibility),
    provesDecreasingGlobalInvariant: Boolean(doc?.claims?.provesDecreasingGlobalInvariant),
    provesAllN: Boolean(doc?.claims?.provesAllN),
  };
}

function inferUsefulFact(fileName, doc) {
  if (!doc) {
    return 'Source packet missing.';
  }
  if (fileName.includes('UNAVAILABLE_COMPLEMENT_REFINEMENT')) {
    return 'Exact affine parameterization of the p4217 unavailable complement.';
  }
  if (fileName.includes('P43_SQUARE_OBSTRUCTION')) {
    return 'The p43 fallback selector is globally killed by a uniform 2^2 obstruction.';
  }
  if (fileName.includes('P61_AVAILABILITY_REFINEMENT')) {
    return 'The p4217 complement is split into p61-available and p61-unavailable CRT classes.';
  }
  if (fileName.includes('Q_COVER_STAIRCASE_BREAKER')) {
    return 'The q-cover staircase is explicitly blocked as nonconvergent without a finite measure.';
  }
  if (fileName.includes('PARAMETRIC_TRANSITION_ROUTE')) {
    return 'The q-cover transition is row-uniform but expands rather than decreases the q-avoiding surface.';
  }
  if (fileName.includes('STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER')) {
    return 'The local structural complement audit found no repo-owned decreasing invariant.';
  }
  if (fileName.includes('ALL_N_RECOMBINATION_RESIDUAL')) {
    return 'The all-N residual assembly names the remaining theorem atoms and blocks q-cover/singleton descent.';
  }
  return doc.proofBoundary ?? 'Exact p4217 descendant or audit artifact.';
}

function inferGap(fileName, doc) {
  if (!doc) {
    return 'Cannot use a missing packet as theorem evidence.';
  }
  if (doc.proofBoundary) {
    return doc.proofBoundary;
  }
  return 'Does not prove a whole-complement cover, impossibility theorem, finite partition, or decreasing rank.';
}

function readFallbackOrpPlanningRun() {
  const packet = readJsonIfPresent(DEFAULT_JSON_OUTPUT);
  return packet?.orpPlanningRun ?? null;
}

function summarizeOrpRun(runPath) {
  const runStat = runPath && fs.existsSync(runPath) ? fs.statSync(runPath) : null;
  if (!runStat) {
    const fallback = readFallbackOrpPlanningRun();
    if (fallback) {
      return fallback;
    }
    return {
      answerPath: runPath ? rel(runPath) : null,
      answerSha256: null,
      breakdownPath: null,
      profilePath: null,
      runId: null,
      status: 'absent',
      execute: null,
      generatedAtUtc: null,
      profileId: null,
      apiCalled: false,
      completedLaneCount: 0,
      plannedOrSkippedLaneCount: 0,
      failedLaneCount: 0,
      laneStatuses: [],
      breakdownMode: null,
      answer: null,
    };
  }

  const answerPath = runStat.isDirectory() ? path.join(runPath, 'ANSWER.json') : runPath;
  const breakdownPath = runStat.isDirectory() ? path.join(runPath, 'BREAKDOWN.json') : path.join(path.dirname(runPath), 'BREAKDOWN.json');
  const profilePath = runStat.isDirectory() ? path.join(runPath, 'PROFILE.json') : path.join(path.dirname(runPath), 'PROFILE.json');
  const answer = readJson(answerPath);
  const breakdown = readJsonIfPresent(breakdownPath);
  const profile = readJsonIfPresent(profilePath);
  const lanes = Array.isArray(answer.lanes) ? answer.lanes : [];
  const laneStatuses = lanes.map((lane) => ({
    laneId: lane.lane_id,
    status: lane.status,
    apiCalled: lane.api_call?.called === true,
    providerStatus: lane.provider_status ?? null,
    textLength: String(lane.text ?? '').length,
  }));
  return {
    answerPath: rel(answerPath),
    answerSha256: sha256File(answerPath),
    breakdownPath: fs.existsSync(breakdownPath) ? rel(breakdownPath) : null,
    profilePath: fs.existsSync(profilePath) ? rel(profilePath) : null,
    runId: answer.run_id ?? null,
    status: answer.status ?? null,
    execute: answer.execute ?? null,
    generatedAtUtc: answer.generated_at_utc ?? null,
    profileId: answer.profile?.profile_id ?? profile?.profile_id ?? null,
    apiCalled: laneStatuses.some((lane) => lane.apiCalled),
    completedLaneCount: answer.synthesis?.completed_lane_count ?? 0,
    plannedOrSkippedLaneCount: answer.synthesis?.planned_or_skipped_lane_count ?? 0,
    failedLaneCount: answer.synthesis?.failed_lane_count ?? 0,
    laneStatuses,
    breakdownMode: breakdown?.mode?.id ?? null,
    answer: answer.synthesis?.answer ?? null,
  };
}

function buildPacket(options) {
  const correctedSieve = readJson(options.correctedSievePacket);
  const p4217Blocker = readJson(options.p4217Blocker);
  const orpRun = summarizeOrpRun(options.orpRun);

  assertCondition(
    correctedSieve?.recommendedNextAction === TARGET,
    'corrected square-moduli packet no longer releases the p4217 theorem-wedge/source-import target',
  );
  assertCondition(
    p4217Blocker?.recommendedNextAction === TARGET,
    'p4217 blocker no longer routes to the theorem-wedge/source-import target',
  );
  assertCondition(orpRun.status === 'planned', 'ORP run is expected to be planning-only');
  assertCondition(orpRun.apiCalled === false, 'ORP planning run unexpectedly called an API');

  const auditedSources = P4217_SOURCE_FILES.map(summarizeSourcePacket);
  const sourceTheoremFound = auditedSources.some((source) => (
    source.provesWholeComplementCover
    || source.provesWholeComplementImpossibility
    || source.provesDecreasingGlobalInvariant
    || source.provesAllN
  ));

  return {
    schema: 'erdos.number_theory.p848_p4217_complement_theorem_wedge_source_import_audit_packet/1',
    packetId: 'P848_P4217_COMPLEMENT_THEOREM_WEDGE_SOURCE_IMPORT_AUDIT_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: 'p4217_theorem_wedge_source_import_audit_planning_only_no_source_theorem',
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_planning_only_source_import_audit_no_theorem_found',
      correctedSievePacket: rel(options.correctedSievePacket),
      correctedSieveSha256: sha256File(options.correctedSievePacket),
      p4217BlockerPacket: rel(options.p4217Blocker),
      p4217BlockerSha256: sha256File(options.p4217Blocker),
    },
    orpPlanningRun: orpRun,
    sourceImportAudit: {
      result: sourceTheoremFound
        ? 'unexpected_source_theorem_candidate_found'
        : 'no_repo_owned_p4217_whole_complement_source_theorem_found',
      auditedSourceCount: auditedSources.length,
      auditedSources,
      missingTheoremObjects: [
        'A whole p4217 unavailable-complement cover theorem.',
        'A whole p4217 unavailable-complement impossibility theorem.',
        'A finite partition whose children are all terminal, covered, or strictly lower rank.',
        'A decreasing global invariant compatible with the frontier ledger.',
        'An imported/source theorem that supplies one of the above with auditable hypotheses.',
      ],
    },
    wedgeDecisionBoundary: {
      planningOnly: true,
      apiCalled: false,
      sourceTheoremFound,
      localSymbolicProofFound: false,
      decision: 'planning_only_wedge_recorded_live_or_local_decision_still_open',
      reason: 'The ORP run produced durable no-spend decomposition and lane prompts, but no completed theorem lane. Local audited p4217 sources remain exact refinements/blockers rather than whole-complement closure.',
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Decide the p4217 complement theorem wedge with a budget-guarded live call or a local symbolic proof attempt; if neither yields theorem text, emit a p4217 wedge decision blocker and keep q-cover/singleton descent blocked.',
      finiteDenominatorOrRankToken: 'p848_p4217_theorem_wedge_source_import_audit_planning_only',
      command: 'erdos orp research usage --json',
      followUpCommand: 'erdos orp research ask 848 --profile-file packs/number-theory/problems/848/ORP_RESEARCH_P4217_THEOREM_WEDGE_PROFILE.json --question "Problem 848 p4217 complement theorem wedge: Given the exact p4217 unavailable-complement parameterization, p43 uniform obstruction, p61 CRT refinement, q-cover nonconvergence blocker, and all-N residual packet, prove or refute a whole-complement cover/impossibility theorem or identify the minimal imported/source theorem needed. Do not use finite selector descent as proof unless it comes with a finite partition or decreasing rank." --timeout-sec 180 --execute --allow-paid --json',
    },
    claims: {
      emitsP4217TheoremWedgeSourceImportAudit: true,
      recordsPlanningOnlyOrpRun: true,
      madeNewPaidCall: false,
      respectsNoPaidByDefault: true,
      auditsP4217SourcePackets: true,
      provesNoCurrentRepoOwnedP4217WholeComplementSourceTheorem: !sourceTheoremFound,
      preparesBudgetGuardedWedgeDecision: true,
      provesP4217ComplementCover: false,
      provesP4217ComplementImpossibility: false,
      provesFiniteP4217Partition: false,
      provesDecreasingGlobalInvariant: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    proofBoundary: 'This packet records a no-spend p4217 theorem-wedge/source-import audit. The ORP run is planning-only and did not call a provider. The audited local p4217 packets remain refinements, blockers, or finite descendants; none is a whole-complement cover, impossibility theorem, finite partition, or decreasing invariant. This packet prepares the next budget-guarded wedge decision, but is not proof evidence by itself.',
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 P4217 Complement Theorem-Wedge Source/Import Audit',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    '',
    '## ORP Planning Run',
    '',
    `- Run: \`${packet.orpPlanningRun.runId}\``,
    `- Status: \`${packet.orpPlanningRun.status}\``,
    `- API called: \`${packet.orpPlanningRun.apiCalled}\``,
    `- Answer: ${packet.orpPlanningRun.answer}`,
    '',
    '## Source Audit',
    '',
    `- Result: \`${packet.sourceImportAudit.result}\``,
    `- Audited sources: \`${packet.sourceImportAudit.auditedSourceCount}\``,
    '',
    ...packet.sourceImportAudit.auditedSources.map((source) => (
      `- \`${source.id}\` [${source.status ?? 'missing'}]: ${source.usefulFact}`
    )),
    '',
    '## Missing Theorem Objects',
    '',
    ...packet.sourceImportAudit.missingTheoremObjects.map((item) => `- ${item}`),
    '',
    '## Next Action',
    '',
    packet.oneNextAction.action,
    '',
    '## Boundary',
    '',
    packet.proofBoundary,
    '',
  ].join('\n');
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packet = buildPacket(options);
  const jsonText = JSON.stringify(packet, null, options.pretty ? 2 : 0);

  if (options.jsonOutput) {
    fs.mkdirSync(path.dirname(options.jsonOutput), { recursive: true });
    fs.writeFileSync(options.jsonOutput, `${jsonText}\n`);
  }
  if (options.markdownOutput) {
    fs.mkdirSync(path.dirname(options.markdownOutput), { recursive: true });
    fs.writeFileSync(options.markdownOutput, renderMarkdown(packet));
  }

  process.stdout.write(`${jsonText}\n`);
}

main();
