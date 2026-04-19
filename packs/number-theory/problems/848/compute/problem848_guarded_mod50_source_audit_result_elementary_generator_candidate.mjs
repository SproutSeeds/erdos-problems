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

const DEFAULT_RELEASE_CONFLICT_PACKET = path.join(frontierBridge, 'P848_GUARDED_MOD50_SOURCE_AUDIT_RELEASE_NO_SPEND_BLOCKER_AFTER_HARD_BLOCKER_PACKET.json');
const DEFAULT_RESEARCH_RUN = path.join(repoRoot, 'orp', 'research', 'research-20260418-144342-080413');
const DEFAULT_PROFILE = path.join(problemDir, 'ORP_RESEARCH_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE.json');
const DEFAULT_USAGE_LEDGER = path.join(repoRoot, '.erdos', 'registry', 'research', 'openai-live-usage.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_GUARDED_MOD50_SOURCE_AUDIT_RESULT_ELEMENTARY_GENERATOR_CANDIDATE_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_GUARDED_MOD50_SOURCE_AUDIT_RESULT_ELEMENTARY_GENERATOR_CANDIDATE_PACKET.md');

const TARGET = 'await_p848_new_local_source_theorem_or_spend_permission_override_after_guarded_mod50_audit_release_conflict';
const NEXT_ACTION = 'verify_p848_mod50_elementary_generator_relevant_pair_admissibility_or_emit_semantics_blocker';
const STATUS = 'guarded_mod50_source_audit_result_elementary_generator_candidate_packetized';

function parseArgs(argv) {
  const options = {
    releaseConflictPacket: DEFAULT_RELEASE_CONFLICT_PACKET,
    researchRun: DEFAULT_RESEARCH_RUN,
    profile: DEFAULT_PROFILE,
    usageLedger: DEFAULT_USAGE_LEDGER,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--release-conflict-packet') {
      options.releaseConflictPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--research-run') {
      options.researchRun = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--profile') {
      options.profile = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--usage-ledger') {
      options.usageLedger = path.resolve(argv[index + 1]);
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

function findUsageEntry(usageLedger, runId) {
  const entries = Array.isArray(usageLedger?.entries) ? usageLedger.entries : [];
  return entries.find((entry) => entry.runId === runId) ?? null;
}

function buildPacket(options) {
  const releaseConflict = readJson(options.releaseConflictPacket);
  const profile = readJson(options.profile);
  const usageLedger = readJson(options.usageLedger);
  const answerPath = path.join(options.researchRun, 'ANSWER.json');
  const summaryPath = path.join(options.researchRun, 'RUN_SUMMARY.md');
  const requestPath = path.join(options.researchRun, 'REQUEST.json');
  const lanePath = path.join(options.researchRun, 'lanes', 'p848_mod50_generator_source_import.json');
  const answer = readJson(answerPath);
  const request = readJson(requestPath);
  const lane = readJson(lanePath);
  const runId = answer.run_id;
  const usageEntry = findUsageEntry(usageLedger, runId);

  assertCondition(releaseConflict?.status === 'guarded_mod50_source_audit_release_no_spend_blocker_after_hard_blocker_emitted', 'release-conflict packet has unexpected status');
  assertCondition(releaseConflict?.recommendedNextAction === TARGET, 'release-conflict packet does not route to the released-audit boundary');
  assertCondition(profile?.profile_id === 'p848-mod50-generator-source-import-single', 'profile must be the mod-50 generator/source-import profile');
  assertCondition(answer?.status === 'complete', 'research answer must be complete');
  assertCondition(answer?.profile?.profile_id === profile.profile_id, 'research answer profile mismatch');
  assertCondition(answer?.profile?.lane_count === 1, 'research answer must be single lane');
  assertCondition(Array.isArray(answer?.lanes) && answer.lanes.length === 1, 'research answer must record one lane');
  assertCondition(answer.lanes[0]?.api_call?.called === true, 'research lane must record one API call');
  assertCondition(usageEntry?.runId === runId, 'usage ledger must record the live run');
  assertCondition(usageEntry?.profile === 'profile-file:packs/number-theory/problems/848/ORP_RESEARCH_MOD50_GENERATOR_SOURCE_IMPORT_PROFILE.json', 'usage ledger profile mismatch');

  return {
    schema: 'erdos.number_theory.p848_guarded_mod50_source_audit_result_elementary_generator_candidate_packet/1',
    packetId: 'P848_GUARDED_MOD50_SOURCE_AUDIT_RESULT_ELEMENTARY_GENERATOR_CANDIDATE_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_one_guarded_paid_mod50_source_audit_result_packet',
      releaseConflictPacket: rel(options.releaseConflictPacket),
      releaseConflictPacketSha256: sha256File(options.releaseConflictPacket),
      researchRun: rel(options.researchRun),
      answerJson: rel(answerPath),
      answerJsonSha256: sha256File(answerPath),
      runSummaryMarkdown: rel(summaryPath),
      runSummaryMarkdownSha256: sha256File(summaryPath),
      requestJson: rel(requestPath),
      requestJsonSha256: sha256File(requestPath),
      laneJson: rel(lanePath),
      laneJsonSha256: sha256File(lanePath),
      profile: rel(options.profile),
      profileSha256: sha256File(options.profile),
      usageLedger: rel(options.usageLedger),
      usageLedgerSha256: sha256File(options.usageLedger),
    },
    guardedAuditResult: {
      runId,
      status: answer.status,
      profileId: answer.profile.profile_id,
      execute: answer.execute === true,
      apiCalledLaneCount: answer.lanes.filter((laneStatus) => laneStatus.api_call?.called === true).length,
      laneStatuses: answer.lanes.map((laneStatus) => ({
        laneId: laneStatus.lane_id,
        status: laneStatus.status,
        adapter: laneStatus.adapter,
        model: laneStatus.model,
        apiCalled: laneStatus.api_call?.called === true,
        providerStatus: laneStatus.provider_status ?? null,
      })),
      usageEntry,
      requestQuestion: request.question ?? answer.question ?? null,
      synthesisConfidence: answer.synthesis?.confidence ?? null,
      answerArtifact: rel(answerPath),
      summaryArtifact: rel(summaryPath),
      laneArtifact: rel(lanePath),
      model: lane.model ?? answer.lanes?.[0]?.model ?? null,
    },
    verdict: {
      status: 'no_external_source_theorem_recovered_elementary_generator_candidate_found',
      concise: 'The guarded audit did not recover a source-backed all-future mod-50 theorem. It identified an elementary repo-recoverable generator candidate b = a*t^2 + 2*t with ab + 1 = (a*t + 1)^2, but promotion depends on relevant-pair and row semantics.',
      externalSourceTheoremRecovered: false,
      repoRecoverableCandidateFound: true,
      candidatePromotedToProof: false,
      noSpendDefaultResumedAfterThisOneCall: true,
    },
    candidateTheorem: {
      theoremId: 'p848_mod50_elementary_square_generator_family',
      statement: 'For integers a >= 1 and t >= 1, set b = a*t^2 + 2*t. Then a*b + 1 = (a*t + 1)^2.',
      specialCase: 'For every n >= 3, (n - 2)*n + 1 = (n - 1)^2, corresponding to t = 1, a = n - 2, b = n.',
      hypotheses: [
        'a and t are positive integers',
        'the Problem 848 row/relevant-pair semantics admit the generated pair (a, a*t^2 + 2*t)',
        'the row map being covered is compatible with b, max(a,b), or the endpoint n in the t = 1 family',
      ],
      constants: [],
      denominatorOrPartitionObjects: [
        'mod-50 residue relation b == a*t^2 + 2*t (mod 50)',
        'for t = 1, b == a + 2 (mod 50), so each b residue is reached by a == b - 2 (mod 50)',
      ],
      proofSketch: 'Expand a*(a*t^2 + 2*t) + 1 = a^2*t^2 + 2*a*t + 1 = (a*t + 1)^2.',
      sourceKind: 'elementary_internal_generator_candidate',
      sourceCitationRequired: false,
    },
    promotionBoundary: {
      status: 'candidate_not_promoted_until_semantics_check',
      mustVerifyBeforePromotion: [
        'Define the exact mod-50 square-witness row map used by the current blocker.',
        'Define the exact relevant-pair admissibility predicate used by the current blocker.',
        'Test whether the t = 1 family (n - 2, n) is admitted for every future row.',
        'If admitted, formalize the generator theorem before all-N recombination.',
        'If excluded, emit the exact semantic/admissibility constraint and keep the source theorem blocker live.',
      ],
      rejectedAsProof: [
        'the paid audit answer by itself',
        'finite restored-menu replay',
        'the 280-row finite menu',
        'current square-witness pool evidence',
        'q-cover expansion',
        'singleton descent',
        'fallback selector ladders',
        'bounded evidence as all-N proof',
      ],
    },
    rankedNextLocalOptions: [
      {
        rank: 1,
        actionId: NEXT_ACTION,
        action: 'Normalize the current row and relevant-pair definitions, then test the t = 1 family (n - 2, n) for admissibility.',
        expectedInformationGain: 'high',
        cost: 'low',
        reversibility: 'high',
        probabilityOfChangingDecision: 'high',
      },
      {
        rank: 2,
        actionId: 'formalize_p848_mod50_elementary_square_generator_if_admissible',
        action: 'If the t = 1 family is admitted, write a formal generator theorem packet with the identity and mod-50 residue coverage.',
        expectedInformationGain: 'high',
        cost: 'medium',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
      {
        rank: 3,
        actionId: 'emit_p848_mod50_generator_semantics_exclusion_blocker',
        action: 'If the family is excluded, emit the exact semantic constraint and restore the mod-50 source-import blocker with the narrowed target.',
        expectedInformationGain: 'medium',
        cost: 'low',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
    ],
    forbiddenMovesAfterAudit: [
      'run_another_provider_call_without_a_fresh_explicit_release',
      'treat_the_paid_audit_answer_as_canonical_proof',
      'promote_the_generator_without_relevant_pair_admissibility',
      'resume_q193_q197_singleton_descent',
      'resume_q_cover_staircase_expansion',
      'launch_next_prime_fallback_ladder',
      'emit_a_naked_deterministic_rank_boundary',
      'claim_all_n_recombination_from_the_candidate_alone',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Locally verify whether the elementary generator family is admissible under the repo row/relevant-pair semantics, or emit the exact semantics blocker.',
      finiteDenominatorOrRankToken: 'p848_guarded_mod50_source_audit_result_elementary_generator_candidate',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet records the one explicitly released guarded mod-50 source-audit result as discovery only. It does not promote the audit answer to proof. It preserves the elementary generator candidate b = a*t^2 + 2*t and the special case (n - 2, n), but leaves promotion blocked until the repo verifies row-map and relevant-pair admissibility. It makes no additional provider call, does not prove the mod-50 all-future recurrence, does not prove a finite-Q partition, does not restore the original generator theorem, does not recombine all-N, does not expand q-cover/frontier lanes, and does not decide Problem 848.',
    claims: {
      completesGuardedMod50SourceAuditReleaseOverride: true,
      madeExactlyOnePaidCallThisStep: true,
      profileWasSingleLaneMod50: true,
      noSpendDefaultResumedAfterCall: true,
      externalSourceTheoremRecovered: false,
      elementaryGeneratorCandidateFound: true,
      candidateHasExactHypothesesAndIdentity: true,
      candidateRequiresRelevantPairAdmissibilityCheck: true,
      candidatePromotedToProof: false,
      blocksAdditionalProviderCalls: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      provesMod50AllFutureRecurrence: false,
      restoresOriginalGenerator: false,
      provesFiniteQPartition: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 guarded mod-50 source-audit result elementary generator candidate',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Research run: \`${packet.guardedAuditResult.runId}\``,
    `- Profile: \`${packet.guardedAuditResult.profileId}\``,
    `- API-called lanes: \`${packet.guardedAuditResult.apiCalledLaneCount}\``,
    '',
    '## Verdict',
    '',
    packet.verdict.concise,
    '',
    '## Candidate Theorem',
    '',
    packet.candidateTheorem.statement,
    '',
    packet.candidateTheorem.specialCase,
    '',
    '## Promotion Boundary',
    '',
    ...packet.promotionBoundary.mustVerifyBeforePromotion.map((item) => `- ${item}`),
    '',
    '## Ranked Next Local Options',
    '',
    ...packet.rankedNextLocalOptions.map((item) => `- ${item.rank}. ${item.actionId}: ${item.action}`),
    '',
    '## Forbidden Moves',
    '',
    ...packet.forbiddenMovesAfterAudit.map((move) => `- \`${move}\``),
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

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packet = buildPacket(options);
  writeOutputs(packet, options);
  if (options.pretty) {
    console.log(JSON.stringify(packet, null, 2));
  } else if (!options.jsonOutput && !options.markdownOutput) {
    console.log(JSON.stringify(packet));
  }
}

main();
