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

const DEFAULT_CANDIDATE_PACKET = path.join(frontierBridge, 'P848_GUARDED_MOD50_SOURCE_AUDIT_RESULT_ELEMENTARY_GENERATOR_CANDIDATE_PACKET.json');
const DEFAULT_RELEVANT_PAIR_BLOCKER = path.join(frontierBridge, 'P848_MOD50_RELEVANT_PAIR_ENUMERATOR_GENERATOR_BLOCKER_PACKET.json');
const DEFAULT_COVERAGE_BLOCKER = path.join(frontierBridge, 'P848_MOD50_LANE_COVERAGE_HYPOTHESES_BLOCKER_PACKET.json');
const DEFAULT_TOP_REPAIR_PACKET = path.join(frontierBridge, 'P848_TOP_REPAIR_CLASS_MECHANISM_PACKET.json');
const DEFAULT_FORMALIZATION_WORK = path.join(problemDir, 'FORMALIZATION_WORK.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_MOD50_ELEMENTARY_GENERATOR_RELEVANT_PAIR_SEMANTICS_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_MOD50_ELEMENTARY_GENERATOR_RELEVANT_PAIR_SEMANTICS_BLOCKER_PACKET.md');

const TARGET = 'verify_p848_mod50_elementary_generator_relevant_pair_admissibility_or_emit_semantics_blocker';
const NEXT_ACTION = 'restore_p848_mod50_relevant_pair_row_generator_or_finite_q_partition_after_elementary_semantics_blocker';
const STATUS = 'mod50_elementary_generator_relevant_pair_semantics_blocker_emitted';

function parseArgs(argv) {
  const options = {
    candidatePacket: DEFAULT_CANDIDATE_PACKET,
    relevantPairBlocker: DEFAULT_RELEVANT_PAIR_BLOCKER,
    coverageBlocker: DEFAULT_COVERAGE_BLOCKER,
    topRepairPacket: DEFAULT_TOP_REPAIR_PACKET,
    formalizationWork: DEFAULT_FORMALIZATION_WORK,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--candidate-packet') {
      options.candidatePacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--relevant-pair-blocker') {
      options.relevantPairBlocker = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--coverage-blocker') {
      options.coverageBlocker = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--top-repair-packet') {
      options.topRepairPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--formalization-work') {
      options.formalizationWork = path.resolve(argv[index + 1]);
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

function integerSquareRoot(value) {
  if (value < 0n) {
    throw new Error('cannot take square root of a negative integer');
  }
  if (value < 2n) {
    return value;
  }
  let x0 = 1n << BigInt(Math.ceil(value.toString(2).length / 2));
  let x1 = (x0 + value / x0) >> 1n;
  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + value / x0) >> 1n;
  }
  while ((x0 + 1n) * (x0 + 1n) <= value) {
    x0 += 1n;
  }
  while (x0 * x0 > value) {
    x0 -= 1n;
  }
  return x0;
}

function candidateTForContinuationRepresentative(continuation, representative) {
  const c = BigInt(continuation);
  const n = BigInt(representative);
  const discriminant = 4n + 4n * c * n;
  const root = integerSquareRoot(discriminant);
  if (root * root !== discriminant) {
    return null;
  }
  const numerator = -2n + root;
  const denominator = 2n * c;
  if (numerator <= 0n || numerator % denominator !== 0n) {
    return null;
  }
  return (numerator / denominator).toString();
}

function extractInstanceChecks(formalizationWork) {
  const checks = formalizationWork?.currentWork?.packetData?.mod50LaneSymbolicSchema?.instanceChecks;
  return Array.isArray(checks) ? checks : [];
}

function buildObservedCandidateAudit(instanceChecks) {
  const hits = [];
  for (const row of instanceChecks) {
    const continuation = row.continuation;
    const representative = row.representative;
    if (!Number.isInteger(continuation) || !Number.isInteger(representative)) {
      continue;
    }
    const t = candidateTForContinuationRepresentative(continuation, representative);
    if (t) {
      hits.push({
        familyIndex: row.familyIndex ?? null,
        representative,
        continuation,
        witnessSquareModulus: row.witnessSquareModulus ?? null,
        t,
      });
    }
  }

  return {
    checkedObservedRowCount: instanceChecks.length,
    observedContinuationSet: [...new Set(instanceChecks.map((row) => row.continuation).filter(Number.isInteger))].sort((a, b) => a - b),
    observedWitnessSquareModulusSet: [...new Set(instanceChecks.map((row) => row.witnessSquareModulus).filter(Number.isInteger))].sort((a, b) => a - b),
    candidateRelationTested: 'representative = continuation*t^2 + 2*t with t >= 1',
    candidateRelationHitCount: hits.length,
    candidateRelationHits: hits,
    interpretation: hits.length === 0
      ? 'The elementary generator does not match any checked finite mod-50 witness row under the direct continuation-as-a, representative-as-b row interpretation.'
      : 'The elementary generator matches some checked rows under the direct row interpretation, but still needs all-future row-generator and handoff semantics before promotion.',
  };
}

function buildPacket(options) {
  const candidate = readJson(options.candidatePacket);
  const relevantPairBlocker = readJson(options.relevantPairBlocker);
  const coverageBlocker = readJson(options.coverageBlocker);
  const topRepair = readJson(options.topRepairPacket);
  const formalizationWork = readJson(options.formalizationWork);
  const mod50Schema = formalizationWork?.currentWork?.packetData?.mod50LaneSymbolicSchema ?? {};
  const instanceChecks = extractInstanceChecks(formalizationWork);
  const observedAudit = buildObservedCandidateAudit(instanceChecks);

  assertCondition(candidate?.status === 'guarded_mod50_source_audit_result_elementary_generator_candidate_packetized', 'candidate packet has unexpected status');
  assertCondition(candidate?.recommendedNextAction === TARGET, 'candidate packet does not route to the semantics check');
  assertCondition(candidate?.candidateTheorem?.theoremId === 'p848_mod50_elementary_square_generator_family', 'candidate theorem mismatch');
  assertCondition(relevantPairBlocker?.blockedObject?.objectId === 'p848_mod50_parametric_relevant_pair_enumerator', 'relevant-pair blocker mismatch');
  assertCondition(coverageBlocker?.attemptedTheorem?.theoremId === 'p848_mod50_lane_breakpoint_coverage_theorem_candidate_v1', 'coverage blocker mismatch');
  assertCondition(mod50Schema?.schemaId === 'p848_mod50_bad_lane_symbolic_schema_v1', 'mod-50 symbolic schema mismatch');

  const proofBoundary = 'This packet resolves the elementary generator candidate as a semantics blocker. The identity a*(a*t^2 + 2*t) + 1 = (a*t + 1)^2 is valid, but it is an arbitrary square-producing pair family, not the repo-owned mod-50 relevant-pair row generator. The active mod-50 object requires an all-future enumerator or finite-Q partition for pairs (n,Q), where n is a family representative and Q is a square witness modulus obstructing c*n+1 for c = 32 + 50*m, plus bad-lane denominator and handoff labels. The candidate does not enumerate all future representatives, does not enumerate all future Q, does not provide handoff labels, has zero direct hits among the 74 checked finite mod-50 witness rows, and is not promoted to proof. No provider call, q-cover expansion, singleton descent, fallback ladder, naked rank-boundary expansion, all-N recombination, or Problem 848 decision is made.';

  return {
    schema: 'erdos.number_theory.p848_mod50_elementary_generator_relevant_pair_semantics_blocker_packet/1',
    packetId: 'P848_MOD50_ELEMENTARY_GENERATOR_RELEVANT_PAIR_SEMANTICS_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_mod50_elementary_generator_relevant_pair_semantics_blocker',
      candidatePacket: rel(options.candidatePacket),
      candidatePacketSha256: sha256File(options.candidatePacket),
      relevantPairBlockerPacket: rel(options.relevantPairBlocker),
      relevantPairBlockerSha256: sha256File(options.relevantPairBlocker),
      coverageBlockerPacket: rel(options.coverageBlocker),
      coverageBlockerSha256: sha256File(options.coverageBlocker),
      topRepairPacket: rel(options.topRepairPacket),
      topRepairPacketSha256: sha256File(options.topRepairPacket),
      formalizationWork: rel(options.formalizationWork),
      formalizationWorkSha256: sha256File(options.formalizationWork),
    },
    candidateIdentityAudit: {
      theoremId: candidate.candidateTheorem.theoremId,
      identityValidAsArithmetic: true,
      identityStatement: candidate.candidateTheorem.statement,
      specialCase: candidate.candidateTheorem.specialCase,
      rowInterpretationNeededForMod50Lane: 'For continuation c and representative n, the candidate would only supply a square witness when n = c*t^2 + 2*t, with Q = (c*t + 1)^2.',
      promotionVerdict: 'not_admissible_as_mod50_all_future_relevant_pair_generator',
    },
    normalizedRepoRelevantPairSemantics: {
      objectId: relevantPairBlocker.blockedObject.objectId,
      requiredStatement: relevantPairBlocker.blockedObject.requiredStatement,
      requiredOutputShape: relevantPairBlocker.blockedObject.requiredOutputShape,
      laneFormula: mod50Schema.laneFormula,
      symbolicStatement: mod50Schema.symbolicStatement,
      symbolicVariables: mod50Schema.scope?.symbolicVariables ?? [
        'n: family representative',
        'Q: square witness modulus',
        'm: lane index in c = 32 + 50*m',
        'c: continuation being tested',
      ],
      missingDomainHypothesis: coverageBlocker.missingHypotheses?.find((hypothesis) => hypothesis.hypothesisId === 'square_witness_domain_cover') ?? null,
      topRepairScope: topRepair.theoremObject?.scope ?? null,
    },
    observedFiniteRowAudit: observedAudit,
    semanticMismatch: {
      status: 'candidate_excluded_from_universal_promotion_by_row_semantics',
      exactConstraint: 'The mod-50 source theorem must quantify over all future row-menu representatives n and all relevant square witness moduli Q for c = 32 + 50*m. The elementary candidate quantifies over arbitrary factor pairs (a,b) satisfying b = a*t^2 + 2*t; it only maps into the row surface after adding the extra equation n = c*t^2 + 2*t.',
      missingForPromotion: [
        'a generator or recurrence for every future family representative n',
        'a finite or recursively generated set of every future square witness modulus Q',
        'the denominator Q/gcd(50*n,Q) for every generated relevant pair',
        'a handoff label proving bad-lane avoidance, top-tie repair, contrast-only repair, or terminal blocking',
        'a proof that every future relevant (n,Q) row satisfies the candidate relation, or a finite partition replacing that relation',
      ],
      whySpecialCaseDoesNotCloseMod50: 'The t=1 family only gives square pairs (a,a+2). In the active row semantics this would require representative n = c + 2 for the continuation c, while observed and future family-menu representatives are independent row objects.',
      finiteEvidence: 'Zero of the 74 checked finite mod-50 witness rows satisfy representative = continuation*t^2 + 2*t.',
    },
    rankedLegalNextOptions: [
      {
        rank: 1,
        actionId: NEXT_ACTION,
        action: 'Restore or define the actual mod-50 relevant-pair row generator, or prove a finite-Q partition for the row domain after excluding the elementary arbitrary-pair candidate.',
        expectedInformationGain: 'high',
        cost: 'medium',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
      {
        rank: 2,
        actionId: 'localize_p848_elementary_generator_as_negative_subprogression_lemma_if_useful',
        action: 'If the relation n = c*t^2 + 2*t appears in future row data, package the identity only as a negative subprogression obstruction lemma, not as a universal row enumerator.',
        expectedInformationGain: 'medium',
        cost: 'low',
        reversibility: 'high',
        probabilityOfChangingDecision: 'low',
      },
      {
        rank: 3,
        actionId: 'prepare_future_p848_mod50_source_audit_narrowed_to_row_generator_semantics',
        action: 'Only under a future explicit release and usage clearance, ask for a source theorem that emits the row-menu (n,Q) domain and handoff labels; do not ask again for arbitrary square-producing pairs.',
        expectedInformationGain: 'medium',
        cost: 'paid_guarded',
        reversibility: 'high',
        probabilityOfChangingDecision: 'medium',
      },
    ],
    futureUnblockConditions: [
      'Recover a repo-owned mod-50 family-menu row generator or symbolic recurrence for every future representative n.',
      'Prove a finite-Q partition for every future mod-50 square-witness row with audited denominators and handoff labels.',
      'Prove that the elementary relation n = c*t^2 + 2*t covers the full future row domain, which current finite evidence does not support.',
      'Under a future explicit release, run at most one usage-cleared source audit narrowed to the row-generator/finite-Q semantics, not arbitrary square-producing factor pairs.',
    ],
    forbiddenMovesAfterSemanticsBlocker: [
      'run_another_provider_call_without_a_fresh_explicit_release',
      'treat_the_paid_audit_answer_as_canonical_proof',
      'promote_the_elementary_identity_to_mod50_all_future_recurrence',
      'treat_zero_hit_finite_sanity_check_as_all_future_disproof',
      'resume_q193_q197_singleton_descent',
      'resume_q_cover_staircase_expansion',
      'launch_next_prime_fallback_ladder',
      'emit_a_naked_deterministic_rank_boundary',
      'claim_all_n_recombination_from_the_candidate_or_blocker',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Restore or prove the actual mod-50 relevant-pair row generator/finite-Q partition after excluding the elementary arbitrary-pair generator as a universal candidate.',
      finiteDenominatorOrRankToken: 'p848_mod50_elementary_generator_relevant_pair_semantics_blocker',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary,
    claims: {
      completesElementaryGeneratorRelevantPairAdmissibilityCheck: true,
      arithmeticIdentityValid: true,
      candidateAdmissibleAsUniversalMod50RelevantPairGenerator: false,
      candidatePromotedToProof: false,
      finiteObservedRowAuditRun: true,
      finiteObservedRowAuditHitCount: observedAudit.candidateRelationHitCount,
      checkedObservedRowCount: observedAudit.checkedObservedRowCount,
      preservesNoSpendDefault: true,
      madeNewPaidCall: false,
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

function buildMarkdown(packet) {
  const lines = [];
  lines.push('# P848 mod-50 elementary generator relevant-pair semantics blocker');
  lines.push('');
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Target: \`${packet.target}\``);
  lines.push(`- Recommended next action: \`${packet.recommendedNextAction}\``);
  lines.push('');
  lines.push('## Verdict');
  lines.push('');
  lines.push(packet.semanticMismatch.exactConstraint);
  lines.push('');
  lines.push(`The arithmetic identity is valid, but the candidate is **not** promoted: ${packet.semanticMismatch.finiteEvidence}`);
  lines.push('');
  lines.push('## Repo Semantics');
  lines.push('');
  lines.push(`- Relevant-pair object: \`${packet.normalizedRepoRelevantPairSemantics.objectId}\``);
  lines.push(`- Lane formula: \`${packet.normalizedRepoRelevantPairSemantics.laneFormula}\``);
  lines.push(`- Symbolic statement: ${packet.normalizedRepoRelevantPairSemantics.symbolicStatement}`);
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
