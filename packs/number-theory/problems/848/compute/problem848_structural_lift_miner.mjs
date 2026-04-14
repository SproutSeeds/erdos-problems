#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const problemDir = path.resolve(scriptDir, '..');

function parseArgs(argv) {
  const args = {
    verifierJson: path.join(problemDir, 'FULL_MIXED_BASE_STRUCTURAL_VERIFIER.json'),
    topRows: 12,
    familyLimit: 20,
    jsonOutput: null,
    markdownOutput: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--verifier-json') {
      args.verifierJson = argv[++index];
    } else if (token === '--top-rows') {
      args.topRows = Number(argv[++index]);
    } else if (token === '--family-limit') {
      args.familyLimit = Number(argv[++index]);
    } else if (token === '--json-output') {
      args.jsonOutput = argv[++index];
    } else if (token === '--markdown-output') {
      args.markdownOutput = argv[++index];
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (!args.verifierJson) {
    throw new Error('--verifier-json is required');
  }
  if (!Number.isInteger(args.topRows) || args.topRows < 1) {
    throw new Error('--top-rows must be a positive integer');
  }
  if (!Number.isInteger(args.familyLimit) || args.familyLimit < 1) {
    throw new Error('--family-limit must be a positive integer');
  }
  return args;
}

function positiveModulo(value, modulus) {
  const residue = Number(value) % modulus;
  return residue < 0 ? residue + modulus : residue;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function average(values) {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function minValue(values) {
  return values.length === 0 ? null : Math.min(...values);
}

function maxValue(values) {
  return values.length === 0 ? null : Math.max(...values);
}

function countBy(values, keyFn) {
  const counts = new Map();
  for (const value of values) {
    const key = keyFn(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((left, right) => right.count - left.count || String(left.key).localeCompare(String(right.key)));
}

function groupBy(values, keyFn) {
  const groups = new Map();
  for (const value of values) {
    const key = keyFn(value);
    const group = groups.get(key) ?? [];
    group.push(value);
    groups.set(key, group);
  }
  return groups;
}

function dominantMixedCliqueSide(row) {
  const side7 = row.mixedCliqueSide7Count ?? row.worstThreat?.mixedCliqueSide7Count ?? 0;
  const side18 = row.mixedCliqueSide18Count ?? row.worstThreat?.mixedCliqueSide18Count ?? 0;
  if (side7 > side18) return 'side7';
  if (side18 > side7) return 'side18';
  if (side7 === 0 && side18 === 0) return 'none';
  return 'tie';
}

function compactFromVerifierRow(row) {
  const worstThreat = row.worstThreat ?? null;
  const sMaxMixedWitness = row.sMaxMixedWitness ?? worstThreat?.outsider ?? null;
  const worstOutsider = worstThreat?.outsider ?? row.worstOutsider ?? null;
  return {
    N: row.N,
    certificateMode: row.certificateMode ?? null,
    nMod25: row.nMod25 ?? positiveModulo(row.N, 25),
    p: row.p,
    p2: row.p2,
    rawPlus: row.rawPlus,
    rawMinus: row.rawMinus,
    vMax: row.vMax,
    activePlus: row.activePlus,
    activeMinus: row.activeMinus,
    activeOutsiderCount: row.activeOutsiderCount,
    dMax: row.dMax,
    dMaxWitnessSide: row.dMaxWitnessSide ?? row.dMaxWitness?.side ?? null,
    dMaxWitnessValue: row.dMaxWitnessValue ?? row.dMaxWitness?.value ?? null,
    rGreater: row.rGreater,
    candidateSize: row.candidateSize,
    strictBaseThreshold: row.strictBaseThreshold,
    side7Margin: row.side7Margin,
    side18Margin: row.side18Margin,
    unionMargin: row.unionMargin,
    mixedMargin: row.mixedMargin,
    sMaxMixed: row.sMaxMixed,
    sMaxMixedWitness,
    sMaxMixedWitnessMod25: row.sMaxMixedWitnessMod25 ?? (sMaxMixedWitness === null ? null : positiveModulo(sMaxMixedWitness, 25)),
    threateningOutsiderCount: row.threateningOutsiderCount,
    maxImprovementOverUnion: row.maxImprovementOverUnion,
    worstOutsider,
    worstOutsiderMod25: row.worstOutsiderMod25 ?? (worstOutsider === null ? null : positiveModulo(worstOutsider, 25)),
    worstUnionCount: row.worstUnionCount ?? worstThreat?.unionCount ?? null,
    worstMixedCliqueSize: row.worstMixedCliqueSize ?? worstThreat?.mixedBaseCliqueSize ?? null,
    matchingSizeInMissingCrossGraph: row.matchingSizeInMissingCrossGraph ?? worstThreat?.matchingSizeInMissingCrossGraph ?? null,
    compatibleSide7Count: row.compatibleSide7Count ?? worstThreat?.compatibleSide7Count ?? null,
    compatibleSide18Count: row.compatibleSide18Count ?? worstThreat?.compatibleSide18Count ?? null,
    mixedCliqueSide7Count: row.mixedCliqueSide7Count ?? worstThreat?.mixedCliqueSide7Count ?? null,
    mixedCliqueSide18Count: row.mixedCliqueSide18Count ?? worstThreat?.mixedCliqueSide18Count ?? null,
    dominantMixedCliqueSide: row.dominantMixedCliqueSide ?? dominantMixedCliqueSide(row),
  };
}

function rowKey(row) {
  return [
    row.p,
    row.N,
    row.worstOutsider ?? row.sMaxMixedWitness ?? 'none',
    row.mixedMargin ?? 'none',
    row.unionMargin ?? 'none',
  ].join(':');
}

function collectLiftRows(verifier) {
  const candidates = [];
  if (Array.isArray(verifier.liftMiningRows)) {
    candidates.push(...verifier.liftMiningRows);
  }
  if (Array.isArray(verifier.exactRowsSample)) {
    candidates.push(...verifier.exactRowsSample);
  }
  for (const row of [
    verifier.worstCertifiedRow,
    verifier.worstExactMixedRow,
    ...(verifier.blockSummaries ?? []).map((block) => block.worstCertifiedRow),
  ]) {
    if (row) candidates.push(row);
  }

  const seen = new Set();
  const rows = [];
  for (const candidate of candidates) {
    const row = compactFromVerifierRow(candidate);
    if (row.N === undefined || row.p === undefined || row.mixedMargin === undefined || row.certificateMode === 'union_bound') {
      continue;
    }
    const key = rowKey(row);
    if (seen.has(key)) continue;
    seen.add(key);
    rows.push(row);
  }
  return rows.sort((left, right) => left.N - right.N || left.p - right.p);
}

function rowFamilyKey(row) {
  return [
    `p=${row.p}`,
    `Nmod25=${row.nMod25}`,
    `d=${row.dMaxWitnessSide ?? 'none'}`,
    `clique=${row.dominantMixedCliqueSide ?? 'none'}`,
    `outMod25=${row.worstOutsiderMod25 ?? row.sMaxMixedWitnessMod25 ?? 'none'}`,
  ].join('|');
}

function summarizeRows(rows) {
  return {
    count: rows.length,
    firstN: minValue(rows.map((row) => row.N)),
    lastN: maxValue(rows.map((row) => row.N)),
    minMixedMargin: minValue(rows.map((row) => row.mixedMargin).filter(Number.isFinite)),
    maxMixedMargin: maxValue(rows.map((row) => row.mixedMargin).filter(Number.isFinite)),
    averageMixedMargin: average(rows.map((row) => row.mixedMargin).filter(Number.isFinite)),
    minUnionMargin: minValue(rows.map((row) => row.unionMargin).filter(Number.isFinite)),
    maxThreateningOutsiders: maxValue(rows.map((row) => row.threateningOutsiderCount).filter(Number.isFinite)),
    maxImprovementOverUnion: maxValue(rows.map((row) => row.maxImprovementOverUnion).filter(Number.isFinite)),
  };
}

function buildPrimeProfiles(rows) {
  return [...groupBy(rows, (row) => row.p).entries()]
    .map(([p, primeRows]) => {
      const sorted = [...primeRows].sort((left, right) => left.N - right.N);
      const first = sorted[0] ?? null;
      const last = sorted[sorted.length - 1] ?? null;
      const marginSlopePerN = first && last && last.N !== first.N
        ? (last.mixedMargin - first.mixedMargin) / (last.N - first.N)
        : null;
      return {
        p: Number(p),
        p2: first?.p2 ?? null,
        ...summarizeRows(sorted),
        marginDeltaAcrossMinedRows: first && last ? last.mixedMargin - first.mixedMargin : null,
        approximateMarginSlopePerN: marginSlopePerN,
        nMod25Distribution: countBy(sorted, (row) => row.nMod25),
        dMaxWitnessSideDistribution: countBy(sorted, (row) => row.dMaxWitnessSide ?? 'none'),
        dominantMixedCliqueSideDistribution: countBy(sorted, (row) => row.dominantMixedCliqueSide ?? 'none'),
        worstOutsiderMod25Distribution: countBy(sorted, (row) => row.worstOutsiderMod25 ?? 'none'),
      };
    })
    .sort((left, right) => right.count - left.count || left.p - right.p);
}

function buildFamilySummaries(rows, familyLimit) {
  return [...groupBy(rows, rowFamilyKey).entries()]
    .map(([familyKey, familyRows]) => {
      const sorted = [...familyRows].sort((left, right) => left.mixedMargin - right.mixedMargin || left.N - right.N);
      return {
        familyKey,
        ...summarizeRows(sorted),
        representativeRows: sorted.slice(0, 3),
      };
    })
    .sort((left, right) => right.count - left.count || left.minMixedMargin - right.minMixedMargin || left.familyKey.localeCompare(right.familyKey))
    .slice(0, familyLimit);
}

function buildThreatMatchingProfiles(threatRows) {
  return [...groupBy(threatRows, (row) => row.p).entries()]
    .map(([p, rows]) => {
      const sorted = [...rows].sort((left, right) => left.matchingSlack - right.matchingSlack || left.N - right.N || left.outsider - right.outsider);
      return {
        p: Number(p),
        threatRowCount: rows.length,
        structuralRowCount: new Set(rows.map((row) => `${row.N}:${row.p}`)).size,
        firstN: minValue(rows.map((row) => row.N)),
        lastN: maxValue(rows.map((row) => row.N)),
        minRequiredMatchingLowerBound: minValue(rows.map((row) => row.requiredMatchingLowerBound).filter(Number.isFinite)),
        maxRequiredMatchingLowerBound: maxValue(rows.map((row) => row.requiredMatchingLowerBound).filter(Number.isFinite)),
        minActualMatching: minValue(rows.map((row) => row.matchingSizeInMissingCrossGraph).filter(Number.isFinite)),
        maxActualMatching: maxValue(rows.map((row) => row.matchingSizeInMissingCrossGraph).filter(Number.isFinite)),
        minMatchingSlack: minValue(rows.map((row) => row.matchingSlack).filter(Number.isFinite)),
        allThreatsMeetRequiredLowerBound: rows.every((row) => Number(row.matchingSlack) >= 0),
        allThreatsSaturateSmallerSide: rows.every((row) => row.saturatesSmallerSide === true),
        outsiderMod25Distribution: countBy(rows, (row) => row.outsiderMod25 ?? 'none'),
        dominantMixedCliqueSideDistribution: countBy(rows, (row) => row.dominantMixedCliqueSide ?? 'none'),
        tightestThreats: sorted.slice(0, 8),
      };
    })
    .sort((left, right) => right.threatRowCount - left.threatRowCount || left.p - right.p);
}

function buildLiftObligations(rows, verifier, primeProfiles, familySummaries, threatMatchingProfiles) {
  const topExactPrimes = primeProfiles.slice(0, 4).map((profile) => profile.p);
  const topFamily = familySummaries[0] ?? null;
  const minMixedMargin = minValue(rows.map((row) => row.mixedMargin).filter(Number.isFinite));
  const minUnionMargin = verifier.summary?.minCertifiedMargin ?? null;
  const minThreatMatchingSlack = minValue(threatMatchingProfiles
    .map((profile) => profile.minMatchingSlack)
    .filter(Number.isFinite));

  return [
    {
      obligationId: 'p848_cross_side_matching_bound',
      priority: 'critical',
      status: 'bounded_evidence_ready',
      statementTemplate: 'For each threatening outsider, the missing cross-edge graph between the 7 mod 25 and 18 mod 25 compatible base sides has a matching large enough to force mixedCliqueSize below the strict base threshold.',
      currentEvidence: {
        assessedRange: verifier.summary?.assessedRange ?? null,
        threateningOutsiderCheckCount: verifier.summary?.threateningOutsiderCheckCount ?? null,
        compactThreatMiningRowCount: verifier.summary?.threatLiftMiningRowCount ?? null,
        maxImprovementOverUnion: verifier.summary?.maxImprovementOverUnion ?? null,
        minMixedMargin,
        minThreatMatchingSlack,
        threatMatchingProfiles: threatMatchingProfiles.slice(0, 4),
      },
      proofUse: 'This is the exact step that turns the computational co-bipartite clique repair into a reusable lemma.',
    },
    {
      obligationId: 'p848_exact_prime_margin_lift',
      priority: 'critical',
      status: topExactPrimes.length > 0 ? 'bounded_evidence_ready' : 'blocked_no_exact_rows',
      statementTemplate: `For the exact-mixed witness-prime families ${topExactPrimes.length > 0 ? topExactPrimes.join(', ') : '(none)'}, prove candidateSize > sMaxMixed + vMax + dMax + rGreater either eventually or by a finite periodic residue split.`,
      currentEvidence: {
        exactPrimeProfiles: primeProfiles.slice(0, 4),
      },
      proofUse: 'This is the likely all-N lift of the hardest bounded structural rows.',
    },
    {
      obligationId: 'p848_union_bound_tail_lift',
      priority: 'high',
      status: 'bounded_evidence_ready',
      statementTemplate: 'Prove that every non-exact witness-prime block is certified by the safe union bound past the base interval, with only finitely many exceptional rows delegated to exact verification.',
      currentEvidence: {
        unionCertifiedRowCount: verifier.summary?.unionCertifiedRowCount ?? null,
        exactMixedRowCount: verifier.summary?.exactMixedRowCount ?? null,
        minCertifiedMargin: minUnionMargin,
      },
      proofUse: 'This separates the easy tail from the p-specific exact mixed-base obligations.',
    },
    {
      obligationId: 'p848_top_repeating_family_lift',
      priority: topFamily ? 'high' : 'medium',
      status: topFamily ? 'bounded_evidence_ready' : 'blocked_no_family',
      statementTemplate: topFamily
        ? `Use family ${topFamily.familyKey} as the first symbolic family to formalize.`
        : 'Pick the first repeated exact mixed-base row family once mined rows exist.',
      currentEvidence: topFamily,
      proofUse: 'A repeated row family is the best handhold for converting the verifier into a theorem packet.',
    },
  ];
}

function buildRecommendedNextSteps(rows, verifier, coverageComplete) {
  const exactMixedRowCount = verifier.summary?.exactMixedRowCount ?? null;
  const minedRowCount = rows.length;
  const assessedRange = verifier.summary?.assessedRange ?? verifier.parameters?.assessedRange ?? null;
  const maxN = verifier.parameters?.maxN ?? null;
  const minStructuralN = verifier.parameters?.minStructuralN ?? null;

  const steps = [
    {
      stepId: 'mine_matching_pattern_witnesses',
      priority: 'critical',
      command: 'erdos number-theory dispatch 848 --apply --action matching_pattern_miner --matching-pattern-prime 13',
      why: 'The active D2 atom needs a symbolic matching construction, and the matching-pattern miner extracts actual tight-row missing-cross pairs without bloating the verifier artifact.',
    },
    {
      stepId: 'formalize_cross_side_matching_bound',
      priority: 'critical',
      command: 'erdos problem formalization-work-refresh 848',
      why: 'The full verifier succeeds exactly because mixed-base cliques are much smaller than the safe union overcount; this is the theorem-shaped repair mechanism.',
    },
    {
      stepId: 'formalize_exact_prime_margin_lift',
      priority: 'critical',
      command: 'erdos problem formalization 848',
      why: 'The mined rows identify which witness-prime blocks still need symbolic margin control after the union-bound rows are separated.',
    },
    {
      stepId: 'extend_structural_range_after_lift_target',
      priority: 'high',
      command: maxN && minStructuralN
        ? `erdos number-theory dispatch 848 --apply --action full_mixed_base_structural_verifier --structural-min ${minStructuralN} --structural-max ${Math.max(maxN + 5000, maxN * 2)}`
        : 'erdos number-theory dispatch 848 --apply --action full_mixed_base_structural_verifier',
      why: `Once the first symbolic family is named, extend the bounded verifier beyond ${assessedRange ?? 'the current range'} to falsify or strengthen the family before claiming a lift.`,
    },
  ];

  if (!coverageComplete) {
    steps.unshift({
      stepId: 'refresh_full_verifier_compact_rows',
      priority: 'critical',
      command: exactMixedRowCount
        ? `erdos number-theory dispatch 848 --apply --action full_mixed_base_structural_verifier --full-mixed-row-sample-limit ${Math.max(exactMixedRowCount, 200)}`
        : 'erdos number-theory dispatch 848 --apply --action full_mixed_base_structural_verifier',
      why: `The miner saw ${minedRowCount} rows but the verifier reports ${exactMixedRowCount ?? '(unknown)'} exact mixed rows; refresh the full verifier so compact lift-mining rows cover the exact row set.`,
    });
  }

  return steps;
}

function mine(args) {
  const verifier = readJson(args.verifierJson);
  const rows = collectLiftRows(verifier);
  const threatRows = Array.isArray(verifier.threatLiftMiningRows) ? verifier.threatLiftMiningRows : [];
  const exactMixedRowCount = verifier.summary?.exactMixedRowCount ?? null;
  const compactRowCount = verifier.summary?.liftMiningRowCount ?? verifier.liftMiningRows?.length ?? null;
  const coverageComplete = exactMixedRowCount !== null && rows.length >= exactMixedRowCount;
  const primeProfiles = buildPrimeProfiles(rows);
  const familySummaries = buildFamilySummaries(rows, args.familyLimit);
  const threatMatchingProfiles = buildThreatMatchingProfiles(threatRows);
  const worstRowsByMargin = [...rows]
    .sort((left, right) => left.mixedMargin - right.mixedMargin || left.N - right.N || left.p - right.p)
    .slice(0, args.topRows);
  const worstRowsByThreatCount = [...rows]
    .sort((left, right) => (right.threateningOutsiderCount ?? 0) - (left.threateningOutsiderCount ?? 0) || left.mixedMargin - right.mixedMargin)
    .slice(0, args.topRows);
  const worstRowsByUnionRepair = [...rows]
    .sort((left, right) => (right.maxImprovementOverUnion ?? 0) - (left.maxImprovementOverUnion ?? 0) || left.mixedMargin - right.mixedMargin)
    .slice(0, args.topRows);

  const status = rows.length === 0
    ? 'structural_lift_miner_no_exact_rows'
    : coverageComplete
      ? 'structural_lift_obligation_packet_ready'
      : 'sampled_structural_lift_obligation_packet_ready';

  return {
    schema: 'erdos.number_theory.p848_structural_lift_miner/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    method: 'mixed_base_structural_lift_pattern_mining',
    status,
    parameters: {
      verifierJsonPath: path.resolve(args.verifierJson),
      topRows: args.topRows,
      familyLimit: args.familyLimit,
    },
    sourceVerifier: {
      status: verifier.status ?? null,
      method: verifier.method ?? null,
      assessedRange: verifier.summary?.assessedRange ?? verifier.parameters?.assessedRange ?? null,
      exactMixedRowCount,
      compactLiftMiningRowCount: compactRowCount,
      compactThreatMiningRowCount: verifier.summary?.threatLiftMiningRowCount ?? threatRows.length,
      minedExactRowCount: rows.length,
      coverageComplete,
    },
    summary: {
      assessedRange: verifier.summary?.assessedRange ?? verifier.parameters?.assessedRange ?? null,
      exactMixedRowCount,
      minedExactRowCount: rows.length,
      threatMiningRowCount: threatRows.length,
      coverageComplete,
      exactPrimeCount: primeProfiles.length,
      primaryExactPrimes: primeProfiles.slice(0, 6).map((profile) => profile.p),
      topFamilyCount: familySummaries.length,
      minMixedMargin: minValue(rows.map((row) => row.mixedMargin).filter(Number.isFinite)),
      minUnionMargin: minValue(rows.map((row) => row.unionMargin).filter(Number.isFinite)),
      minThreatMatchingSlack: minValue(threatMatchingProfiles.map((profile) => profile.minMatchingSlack).filter(Number.isFinite)),
      maxThreateningOutsidersInRow: maxValue(rows.map((row) => row.threateningOutsiderCount).filter(Number.isFinite)),
      maxImprovementOverUnion: maxValue(rows.map((row) => row.maxImprovementOverUnion).filter(Number.isFinite)),
      nextTheoremLane: rows.length > 0
        ? 'formalize_cross_side_matching_bound_then_exact_prime_margin_lift'
        : 'refresh_full_mixed_base_structural_verifier',
    },
    periodicityHints: {
      nMod25Distribution: countBy(rows, (row) => row.nMod25),
      dMaxWitnessSideDistribution: countBy(rows, (row) => row.dMaxWitnessSide ?? 'none'),
      dominantMixedCliqueSideDistribution: countBy(rows, (row) => row.dominantMixedCliqueSide ?? 'none'),
      worstOutsiderMod25Distribution: countBy(rows, (row) => row.worstOutsiderMod25 ?? 'none'),
    },
    primeProfiles,
    threatMatchingProfiles,
    familySummaries,
    worstRows: {
      byMixedMargin: worstRowsByMargin,
      byThreateningOutsiderCount: worstRowsByThreatCount,
      byUnionRepair: worstRowsByUnionRepair,
    },
    liftObligations: buildLiftObligations(rows, verifier, primeProfiles, familySummaries, threatMatchingProfiles),
    recommendedNextSteps: buildRecommendedNextSteps(rows, verifier, coverageComplete),
    boundary: {
      claimLevel: 'theorem_obligation_packet_not_all_N_proof',
      note: 'This miner extracts proof obligations from a bounded structural verifier. It does not certify any N outside the source verifier range.',
      promotionRule: 'Use this packet to choose and formalize symbolic lemmas. Promote all-N closure only after those lemmas are independently proved and linked to the finite exact base.',
    },
  };
}

function renderRow(row) {
  return row ? JSON.stringify(row) : '(none)';
}

function renderMarkdown(packet) {
  const lines = [
    '# Problem 848 Structural Lift Miner',
    '',
    `- Generated: ${packet.generatedAt}`,
    `- Method: \`${packet.method}\``,
    `- Status: \`${packet.status}\``,
    `- Source verifier status: \`${packet.sourceVerifier.status ?? '(unknown)'}\``,
    `- Assessed range: \`${packet.summary.assessedRange ?? '(unknown)'}\``,
    `- Exact mixed rows reported: \`${packet.summary.exactMixedRowCount ?? '(unknown)'}\``,
    `- Exact mixed rows mined: \`${packet.summary.minedExactRowCount}\``,
    `- Threatening-outsider rows mined: \`${packet.summary.threatMiningRowCount ?? '(unknown)'}\``,
    `- Coverage complete: \`${packet.summary.coverageComplete ? 'yes' : 'no'}\``,
    `- Primary exact primes: \`${packet.summary.primaryExactPrimes.join(', ') || '(none)'}\``,
    `- Minimum mixed margin: \`${packet.summary.minMixedMargin ?? '(unknown)'}\``,
    `- Minimum threat matching slack: \`${packet.summary.minThreatMatchingSlack ?? '(unknown)'}\``,
    '',
    '## Prime Profiles',
    '',
  ];

  for (const profile of packet.primeProfiles.slice(0, 8)) {
    lines.push(`- p=${profile.p}: rows ${profile.count}, N ${profile.firstN}..${profile.lastN}, min margin ${profile.minMixedMargin}, margin delta ${profile.marginDeltaAcrossMinedRows}`);
  }

  lines.push('', '## Threat Matching Profiles', '');
  for (const profile of packet.threatMatchingProfiles.slice(0, 8)) {
    lines.push(`- p=${profile.p}: threats ${profile.threatRowCount}, rows ${profile.structuralRowCount}, K ${profile.minRequiredMatchingLowerBound}..${profile.maxRequiredMatchingLowerBound}, matching ${profile.minActualMatching}..${profile.maxActualMatching}, min slack ${profile.minMatchingSlack}, saturates smaller side ${profile.allThreatsSaturateSmallerSide ? 'yes' : 'no'}`);
  }

  lines.push('', '## Top Families', '');
  for (const family of packet.familySummaries.slice(0, 10)) {
    lines.push(`- \`${family.familyKey}\`: rows ${family.count}, N ${family.firstN}..${family.lastN}, min margin ${family.minMixedMargin}, max union repair ${family.maxImprovementOverUnion}`);
  }

  lines.push('', '## Worst Rows', '');
  for (const row of packet.worstRows.byMixedMargin.slice(0, 8)) {
    lines.push(`- ${renderRow(row)}`);
  }

  lines.push('', '## Lift Obligations', '');
  for (const obligation of packet.liftObligations) {
    lines.push(`- \`${obligation.obligationId}\` [${obligation.priority}, ${obligation.status}]: ${obligation.statementTemplate}`);
  }

  lines.push('', '## Recommended Next Steps', '');
  for (const step of packet.recommendedNextSteps) {
    lines.push(`- \`${step.stepId}\` [${step.priority}]: ${step.why} | command: \`${step.command}\``);
  }

  lines.push('', '## Boundary', '');
  lines.push(`- Claim level: \`${packet.boundary.claimLevel}\``);
  lines.push(`- Note: ${packet.boundary.note}`);
  lines.push(`- Promotion rule: ${packet.boundary.promotionRule}`);
  lines.push('');
  return lines.join('\n');
}

const args = parseArgs(process.argv.slice(2));
const packet = mine(args);

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
}

if (args.markdownOutput) {
  fs.mkdirSync(path.dirname(args.markdownOutput), { recursive: true });
  fs.writeFileSync(args.markdownOutput, renderMarkdown(packet));
}

console.log(JSON.stringify(packet.summary, null, 2));
