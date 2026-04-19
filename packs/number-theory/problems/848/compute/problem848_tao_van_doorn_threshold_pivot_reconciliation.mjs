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

const DEFAULT_TVD_AUDIT = path.join(frontierBridge, 'P848_TAO_VAN_DOORN_LARGE_SIEVE_DIRECTION_AUDIT_PACKET.json');
const DEFAULT_LEMMA21 = path.join(problemDir, 'LEMMA21_EXPLICIT_BOUND.md');
const DEFAULT_PROGRESS = path.join(problemDir, 'PROGRESS.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.md');

const STATUS = 'tvd_threshold_pivot_reconciled_direct_route_blocked_dual_sieve_required';
const TARGET = 'evaluate_p848_tao_van_doorn_threshold_collapse_claim_before_resuming_frontier';
const NEXT_ACTION = 'derive_p848_corrected_square_moduli_dual_sieve_or_union_hitting_threshold_packet';
const QS = [50, 100, 1000, 10000];

function parseArgs(argv) {
  const options = {
    tvdAudit: DEFAULT_TVD_AUDIT,
    lemma21: DEFAULT_LEMMA21,
    progress: DEFAULT_PROGRESS,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--tvd-audit') {
      options.tvdAudit = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--lemma21') {
      options.lemma21 = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--progress') {
      options.progress = path.resolve(argv[index + 1]);
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

function readTextIfPresent(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
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

function primesUpTo(limit) {
  const sieve = new Uint8Array(limit + 1);
  const primes = [];
  for (let value = 2; value <= limit; value += 1) {
    if (sieve[value] !== 0) {
      continue;
    }
    primes.push(value);
    for (let multiple = value * value; multiple <= limit; multiple += value) {
      sieve[multiple] = 1;
    }
  }
  return primes;
}

function hsumForActivePrimes(Q, omegaForPrime) {
  const activeWeights = primesUpTo(Q)
    .map((prime) => {
      const omega = omegaForPrime(prime);
      return omega > 0 && omega < prime * prime
        ? { prime, weight: omega / ((prime * prime) - omega) }
        : null;
    })
    .filter(Boolean);

  let sum = 1;
  function walk(startIndex, product, weightProduct) {
    for (let index = startIndex; index < activeWeights.length; index += 1) {
      const { prime, weight } = activeWeights[index];
      const nextProduct = product * prime;
      if (nextProduct > Q) {
        continue;
      }
      const nextWeightProduct = weightProduct * weight;
      sum += nextWeightProduct;
      walk(index + 1, nextProduct, nextWeightProduct);
    }
  }
  walk(0, 1, 1);
  return sum;
}

function computeHsumTable() {
  return QS.map((Q) => {
    const astarHsum = hsumForActivePrimes(Q, (prime) => (
      prime >= 13 && prime % 4 === 1 ? 2 : 0
    ));
    const lemma22Hsum = hsumForActivePrimes(Q, (prime) => (
      prime !== 2 && prime !== 5 ? 1 : 0
    ));
    return {
      Q,
      astarHsum,
      astarReciprocal: 1 / astarHsum,
      lemma22Hsum,
      lemma22Reciprocal: 1 / lemma22Hsum,
    };
  });
}

function buildPacket(options) {
  const tvdAudit = readJson(options.tvdAudit);
  const lemma21 = readTextIfPresent(options.lemma21);
  const progress = readJsonIfPresent(options.progress);

  assertCondition(
    tvdAudit?.status === 'large_sieve_reference_verified_direction_mismatch_blocks_threshold_collapse_claim',
    'Tao-van Doorn direction audit is missing or no longer blocks the direct threshold-collapse claim',
  );
  assertCondition(tvdAudit?.claims?.verifiesTaoVanDoornPaperExists === true, 'Tao-van Doorn source verification is missing');
  assertCondition(tvdAudit?.claims?.blocksDirectThresholdCollapseClaim === true, 'Tao-van Doorn direct-collapse blocker claim is missing');
  assertCondition(tvdAudit?.claims?.provesExplicitN0 === false, 'Tao-van Doorn audit unexpectedly claims an explicit N0');
  assertCondition(lemma21.includes('large-prime tail'), 'Lemma 2.1 explicit-bound note no longer names the large-prime tail bottleneck');

  const hsumTable = computeHsumTable();
  const maxAstarHsum = Math.max(...hsumTable.map((row) => row.astarHsum));
  const minimumHsumForOneOver25 = 25;

  return {
    schema: 'erdos.number_theory.p848_tao_van_doorn_threshold_pivot_reconciliation_packet/1',
    packetId: 'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    sourceClaimAudited: {
      claim: 'A teammate report suggested pausing q-frontier work and using Tao-van Doorn Appendix A, Theorem 16 to collapse the explicit threshold to around 10^6, after which finite verification might finish 848.',
      repoResponse: 'Pause delegation and reconcile the claim, but do not adopt the threshold-collapse route unless a corrected dual/union-hitting sieve argument is produced.',
    },
    inputs: {
      taoVanDoornDirectionAudit: {
        relativePath: rel(options.tvdAudit),
        sha256: sha256File(options.tvdAudit),
        status: tvdAudit.status,
        versionChecked: tvdAudit.primarySourcesChecked?.[0]?.versionChecked ?? null,
      },
      lemma21ExplicitBound: {
        relativePath: rel(options.lemma21),
        sha256: sha256File(options.lemma21),
        largePrimeTailBottleneckNamed: lemma21.includes('large-prime tail'),
      },
      progressSnapshot: progress
        ? {
            relativePath: rel(options.progress),
            sha256: sha256File(options.progress),
            generatedAt: progress.generatedAt ?? null,
            openFrontierObligationCount: progress.p848Frontier?.frontierLedger?.frontierGrowthPressure?.openFrontierObligationCount ?? null,
            currentOpenLeaf: progress.p848Frontier?.globalTheoremLift?.currentOpenLeaf?.recommendedNextAction ?? null,
            nextBestTheoremMove: progress.p848Frontier?.globalTheoremLift?.nextBestTheoremMove ?? null,
          }
        : null,
    },
    theoremShape: {
      taoVanDoornControls: 'upper_bound_for_sets_avoiding_residue_classes_mod_p_squared',
      sawhneyBottleneckNeeds: 'upper_bound_for_union_or_hitting_sets_in_square_obstruction_classes',
      directMismatch: 'An upper bound on the avoiding complement does not imply the required upper bound on the union/hitting side.',
      correctedRouteNeeded: 'A dual lower bound for the avoiding side, a square-moduli sieve for union/hitting sets, or a different explicit threshold extraction with constants.',
    },
    numericalReconciliation: {
      method: 'Recompute sum_{q<=Q} h(q) over squarefree q using the Tao-van Doorn h(q) weights for the two Problem 848 branch-style residue systems.',
      hsumTable,
      minimumHsumForOneOver25,
      maxAstarHsum,
      directCollapseFeasibility: maxAstarHsum >= minimumHsumForOneOver25
        ? 'not_blocked_by_denominator_size'
        : 'blocked_by_denominator_size',
      interpretation: 'For the A* branch, sum h(q) is near 1.028 even at Q=10000, not near 25. The direct reciprocal bound is near 0.973, not 0.04, before the Q^4/N term.',
    },
    delegationDecision: {
      decision: 'keep_clawdad_paused_before_more_q_frontier_compute',
      reason: 'The q-frontier obligation count is visibly growing, while the proposed analytic shortcut is high-value but not valid in its direct form. The next move should be a corrected analytic packet, not more q-bucket descent and not an all-N claim.',
      blockedUntil: [
        'a corrected square-moduli dual/union-hitting threshold packet is produced',
        'or a no-go blocker proves the analytic shortcut cannot currently replace the p4217 theorem wedge',
      ],
      forbiddenMovesUntilThen: [
        'resume_q_bucket_descent_as_default',
        'claim_N0_around_1e6_from_Tao_van_Doorn_Theorem_16_directly',
        'claim_exact_verifier_plus_Tao_van_Doorn_decides_848',
        'spend_paid_or_live_API_budget_without_the_existing_ORP_guard',
      ],
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Derive a corrected square-moduli dual/union-hitting threshold packet: either prove a valid explicit threshold route with hypotheses/constants, or emit a no-go blocker that returns the loop to the p4217 theorem wedge with the analytic shortcut closed.',
      finiteDenominatorOrRankToken: 'p848_tao_van_doorn_threshold_pivot_reconciliation_dual_sieve_required',
      command: 'node packs/number-theory/problems/848/compute/problem848_tao_van_doorn_threshold_pivot_reconciliation.mjs --write-defaults --pretty',
    },
    claims: {
      reconcilesTeammateTvdPivotClaim: true,
      recomputesTvdHsumSanityCheck: true,
      preservesPrimarySourceDirectionAudit: true,
      blocksDirectThresholdCollapseClaim: true,
      keepsDelegationPausedBeforeMoreQFrontierCompute: true,
      selectsCorrectedDualOrUnionHittingSieveAsNextAction: true,
      madeNewPaidCall: false,
      respectsNoPaidByDefault: true,
      provesCorrectedDualSieve: false,
      provesUnionHittingThresholdBound: false,
      provesExplicitN0: false,
      decidesProblem848: false,
    },
    proofBoundary: 'This packet is a pivot reconciliation, not a proof of Problem 848. It blocks the direct Tao-van-Doorn threshold-collapse claim by direction and denominator checks, keeps Clawdad paused from further q-frontier expansion, and requires a corrected dual/union-hitting sieve packet before resuming either the analytic shortcut or the p4217 frontier lane.',
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 Tao-van Doorn Threshold Pivot Reconciliation',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    '',
    '## Decision',
    '',
    `- Delegation: \`${packet.delegationDecision.decision}\``,
    `- Reason: ${packet.delegationDecision.reason}`,
    '',
    '## Direction Check',
    '',
    `- Tao-van Doorn controls: \`${packet.theoremShape.taoVanDoornControls}\``,
    `- Sawhney bottleneck needs: \`${packet.theoremShape.sawhneyBottleneckNeeds}\``,
    `- Mismatch: ${packet.theoremShape.directMismatch}`,
    '',
    '## Numeric Sanity Check',
    '',
    `- Minimum denominator for a direct \`1/25\`-scale reciprocal bound: \`${packet.numericalReconciliation.minimumHsumForOneOver25}\``,
    `- Max observed A* \`sum h(q)\`: \`${packet.numericalReconciliation.maxAstarHsum}\``,
    `- Feasibility: \`${packet.numericalReconciliation.directCollapseFeasibility}\``,
    '',
    '| Q | A* sum h(q) | A* reciprocal | Lemma 2.2-style sum h(q) | Lemma 2.2-style reciprocal |',
    '| ---: | ---: | ---: | ---: | ---: |',
    ...packet.numericalReconciliation.hsumTable.map((row) => (
      `| ${row.Q} | ${row.astarHsum} | ${row.astarReciprocal} | ${row.lemma22Hsum} | ${row.lemma22Reciprocal} |`
    )),
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
