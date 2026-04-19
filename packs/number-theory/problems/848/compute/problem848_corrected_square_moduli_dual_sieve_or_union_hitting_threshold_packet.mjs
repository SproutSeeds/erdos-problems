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

const DEFAULT_RECONCILIATION = path.join(frontierBridge, 'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json');
const DEFAULT_DIRECTION_AUDIT = path.join(frontierBridge, 'P848_TAO_VAN_DOORN_LARGE_SIEVE_DIRECTION_AUDIT_PACKET.json');
const DEFAULT_P4217_BLOCKER = path.join(frontierBridge, 'P848_P4217_COMPLEMENT_COVER_IMPOSSIBILITY_BLOCKER_PACKET.json');
const DEFAULT_LEMMA21 = path.join(problemDir, 'LEMMA21_EXPLICIT_BOUND.md');
const DEFAULT_LEMMA22 = path.join(problemDir, 'LEMMA22_EXPLICIT_BOUND.md');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.md');

const STATUS = 'corrected_square_moduli_sieve_no_go_current_sources_handoff_to_p4217';
const TARGET = 'derive_p848_corrected_square_moduli_dual_sieve_or_union_hitting_threshold_packet';
const NEXT_ACTION = 'prepare_p848_p4217_complement_theorem_wedge_or_import_source_cover';

function parseArgs(argv) {
  const options = {
    reconciliation: DEFAULT_RECONCILIATION,
    directionAudit: DEFAULT_DIRECTION_AUDIT,
    p4217Blocker: DEFAULT_P4217_BLOCKER,
    lemma21: DEFAULT_LEMMA21,
    lemma22: DEFAULT_LEMMA22,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--reconciliation') {
      options.reconciliation = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--direction-audit') {
      options.directionAudit = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--p4217-blocker') {
      options.p4217Blocker = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--lemma21') {
      options.lemma21 = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--lemma22') {
      options.lemma22 = path.resolve(argv[index + 1]);
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

function readText(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function buildPacket(options) {
  const reconciliation = readJson(options.reconciliation);
  const directionAudit = readJson(options.directionAudit);
  const p4217Blocker = readJson(options.p4217Blocker);
  const lemma21 = readText(options.lemma21);
  const lemma22 = readText(options.lemma22);

  assertCondition(
    reconciliation?.status === 'tvd_threshold_pivot_reconciled_direct_route_blocked_dual_sieve_required',
    'Tao-van Doorn pivot reconciliation is missing or no longer routes to the corrected analytic gate',
  );
  assertCondition(
    reconciliation?.recommendedNextAction === TARGET,
    'Tao-van Doorn pivot reconciliation no longer selects the corrected square-moduli gate',
  );
  assertCondition(
    directionAudit?.status === 'large_sieve_reference_verified_direction_mismatch_blocks_threshold_collapse_claim',
    'Tao-van Doorn direction audit is missing or no longer blocks the direct threshold-collapse claim',
  );
  assertCondition(
    p4217Blocker?.recommendedNextAction === NEXT_ACTION,
    'p4217 blocker no longer provides the expected fallback theorem-wedge/source-import handoff',
  );
  assertCondition(lemma21.includes('large-prime tail'), 'Lemma 2.1 note no longer names the large-prime tail bottleneck');
  assertCondition(lemma22.includes('Lemma 2.2'), 'Lemma 2.2 note is missing or not the expected local surface');

  const hsumRows = reconciliation?.numericalReconciliation?.hsumTable ?? [];
  const maxAstarHsum = reconciliation?.numericalReconciliation?.maxAstarHsum ?? null;
  const maxLemma22Hsum = Math.max(...hsumRows.map((row) => Number(row.lemma22Hsum ?? 0)));

  return {
    schema: 'erdos.number_theory.p848_corrected_square_moduli_dual_sieve_or_union_hitting_threshold_packet/1',
    packetId: 'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'blocked_by_current_source_no_go_handoff_to_p4217_theorem_wedge',
      reconciliationPacket: rel(options.reconciliation),
      reconciliationSha256: sha256File(options.reconciliation),
    },
    inputs: {
      reconciliation: {
        relativePath: rel(options.reconciliation),
        sha256: sha256File(options.reconciliation),
        status: reconciliation.status,
        recommendedNextAction: reconciliation.recommendedNextAction,
      },
      directionAudit: {
        relativePath: rel(options.directionAudit),
        sha256: sha256File(options.directionAudit),
        status: directionAudit.status,
        claimStatus: directionAudit.directionAudit?.claimStatus ?? null,
      },
      p4217FallbackBlocker: {
        relativePath: rel(options.p4217Blocker),
        sha256: sha256File(options.p4217Blocker),
        status: p4217Blocker.status,
        recommendedNextAction: p4217Blocker.recommendedNextAction,
      },
      lemma21ExplicitBound: {
        relativePath: rel(options.lemma21),
        sha256: sha256File(options.lemma21),
        largePrimeTailBottleneckNamed: lemma21.includes('large-prime tail'),
      },
      lemma22ExplicitBound: {
        relativePath: rel(options.lemma22),
        sha256: sha256File(options.lemma22),
        available: lemma22.length > 0,
      },
    },
    correctedRouteAudit: {
      verdict: 'no_current_source_valid_threshold_route',
      universeIdentity: 'For a fixed progression/domain U and obstruction union H, the avoiding set is A = U \\ H, so |H| = |U| - |A|.',
      tvdDirection: 'Tao-van Doorn Theorem 16 gives an upper bound for |A| when A avoids residue classes modulo p^2.',
      requiredDirection: 'Sawhney Lemma 2.1 and Lemma 2.2 need an upper bound for |H|, the union/hitting side.',
      dualityFailure: 'Combining |A| <= B with |H| = |U| - |A| gives |H| >= |U| - B, a lower bound on the hitting side. It does not give the required upper bound.',
      missingCorrectiveObject: 'A lower bound for the avoiding set, a direct upper-bound sieve for the union/hitting side, or a different explicit threshold theorem with constants strong enough for the Sawhney weakest branch.',
    },
    candidateRouteDecisions: [
      {
        routeId: 'direct_tao_van_doorn_avoiding_bound',
        status: 'blocked',
        reason: 'Wrong inequality direction for Sawhney Lemma 2.1/Lemma 2.2 union upper bounds.',
      },
      {
        routeId: 'complement_duality_from_avoiding_upper_bound',
        status: 'blocked',
        reason: 'The complement identity turns the available avoiding upper bound into a hitting lower bound, not a hitting upper bound.',
      },
      {
        routeId: 'denominator_threshold_shortcut',
        status: 'blocked',
        reason: `The largest recomputed A* sum h(q) is ${maxAstarHsum}, and the largest Lemma 2.2-style sum h(q) in the checked table is ${maxLemma22Hsum}; neither is near the direct 25-scale denominator needed for a naive 1/25 bound.`,
      },
      {
        routeId: 'existing_lemma21_union_bound_repair',
        status: 'blocked_by_existing_bottleneck',
        reason: 'The local Lemma 2.1 explicit-bound surface already identifies the large-prime tail as the bottleneck for the union-bound/inclusion-exclusion route.',
      },
      {
        routeId: 'external_or_imported_union_hitting_square_moduli_sieve',
        status: 'not_present_in_current_repo_sources',
        reason: 'This packet does not rule such a theorem out globally, but no repo-owned source has supplied it with verified hypotheses/constants.',
      },
    ],
    handoffDecision: {
      decision: 'close_current_tvd_shortcut_and_release_p4217_theorem_wedge',
      reason: 'The analytic shortcut is now atomized enough to know what is missing; spending more q-frontier compute under a false threshold-collapse premise would be worse than returning to the already named p4217 theorem-source gap.',
      fallbackPacket: rel(options.p4217Blocker),
      releasedAction: NEXT_ACTION,
      forbiddenUntilNewAnalyticSource: [
        'claim_tao_van_doorn_directly_lowers_N0',
        'claim_exact_verification_plus_tvd_decides_848',
        'resume_q_frontier_work_because_of_tvd_without_a_new_union_hitting_theorem',
        'make_live_paid_orp_openai_call_without_usage_guard_and_high_leverage_question',
      ],
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Prepare a p4217-specific theorem wedge or import/source-cover audit for the missing complement cover/impossibility theorem, without live paid execution by default.',
      finiteDenominatorOrRankToken: 'p848_corrected_square_moduli_sieve_no_go_handoff_to_p4217_theorem_wedge',
      command: p4217Blocker.oneNextAction?.command ?? 'erdos orp research ask 848 --question "Problem 848 p4217 complement theorem wedge: identify the minimal source theorem or local symbolic proof needed for the p4217 complement cover/impossibility gap." --json',
    },
    claims: {
      emitsCorrectedSquareModuliNoGoPacket: true,
      closesCurrentAnalyticShortcutFromRepoSources: true,
      provesTvdDirectRouteWrongDirectionForSawhneyUnionBound: true,
      provesComplementDualityDoesNotRepairDirection: true,
      preservesPossibilityOfFutureExternalUnionHittingTheorem: true,
      releasesP4217TheoremWedgeFallback: true,
      madeNewPaidCall: false,
      respectsNoPaidByDefault: true,
      provesNoSquareModuliSieveExistsGlobally: false,
      provesUnionHittingThresholdBound: false,
      provesExplicitN0: false,
      extendsExactVerifier: false,
      decidesProblem848: false,
    },
    proofBoundary: 'This packet closes only the current Tao-van-Doorn threshold shortcut from repo-owned sources. It proves that the available avoiding-set upper bound and complement identity do not supply the needed union/hitting upper bound, and it records that no corrected threshold theorem is currently present locally. It does not rule out a future imported square-moduli union/hitting theorem, does not compute a valid N0, and does not decide Problem 848.',
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 Corrected Square-Moduli Dual/Union-Hitting Threshold Packet',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    '',
    '## Verdict',
    '',
    `- Current corrected route: \`${packet.correctedRouteAudit.verdict}\``,
    `- Duality failure: ${packet.correctedRouteAudit.dualityFailure}`,
    `- Missing object: ${packet.correctedRouteAudit.missingCorrectiveObject}`,
    '',
    '## Candidate Routes',
    '',
    ...packet.candidateRouteDecisions.map((route) => (
      `- \`${route.routeId}\` [${route.status}]: ${route.reason}`
    )),
    '',
    '## Handoff',
    '',
    `- Decision: \`${packet.handoffDecision.decision}\``,
    `- Released action: \`${packet.handoffDecision.releasedAction}\``,
    `- Reason: ${packet.handoffDecision.reason}`,
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
