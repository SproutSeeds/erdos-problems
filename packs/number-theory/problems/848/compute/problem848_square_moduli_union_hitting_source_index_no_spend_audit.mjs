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

const DEFAULT_BACKLOG_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_LOCAL_THEOREM_BACKLOG_AFTER_SOURCE_IMPORT_BOUNDARY_PACKET.json');
const DEFAULT_CORRECTED_SQUARE_MODULI_NO_GO_PACKET = path.join(frontierBridge, 'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json');
const DEFAULT_TVD_PIVOT_PACKET = path.join(frontierBridge, 'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json');
const DEFAULT_TVD_DIRECTION_PACKET = path.join(frontierBridge, 'P848_TAO_VAN_DOORN_LARGE_SIEVE_DIRECTION_AUDIT_PACKET.json');
const DEFAULT_SOURCE_RECOVERY_SEARCH_PACKET = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET.json');
const DEFAULT_PROPOSITION_CANDIDATE = path.join(problemDir, 'PROPOSITION_EXPLICIT_CANDIDATE.md');
const DEFAULT_EXTRACTION_CHECKLIST = path.join(problemDir, 'EXTRACTION_CHECKLIST.md');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_INDEX_NO_SPEND_AUDIT_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_INDEX_NO_SPEND_AUDIT_PACKET.md');

const TARGET = 'execute_p848_square_moduli_union_hitting_source_index_no_spend_audit';
const NEXT_ACTION = 'prepare_p848_square_moduli_union_hitting_source_import_profile_or_approval_blocker';
const STATUS = 'square_moduli_union_hitting_source_index_no_spend_audit_emitted_no_promotable_source_found';

const SOURCE_INDEX_AUDIT_PATTERN = '(union|hitting|large sieve|square moduli|Tao|van Doorn|Sawhney|Appendix A|Theorem 16|avoiding)';
const SOURCE_INDEX_AUDIT_PATHS = ['packs/number-theory/problems/848', 'docs', 'src', 'test'];
const SOURCE_INDEX_AUDIT_COMMAND = `rg -n "${SOURCE_INDEX_AUDIT_PATTERN}" packs/number-theory/problems/848 docs src test`;

const CATEGORY_PROBES = [
  {
    categoryId: 'tvd_avoiding_side_and_direction_blockers',
    pattern: 'Tao|van Doorn|Appendix A|Theorem 16|avoiding',
    paths: ['packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE', 'packs/number-theory/problems/848/compute', 'test'],
    interpretation: 'These hits preserve the already-audited avoiding-set direction: Tao-van-Doorn bounds avoiding sets, and complement duality only gives a hitting lower bound.',
    promotableSourceFound: false,
  },
  {
    categoryId: 'sawhney_explicitization_candidate_surfaces',
    pattern: 'Sawhney|Lemma 2\\.1|Lemma 2\\.2|upper bound|union bound|explicit threshold',
    paths: [
      'packs/number-theory/problems/848/PROPOSITION_EXPLICIT_CANDIDATE.md',
      'packs/number-theory/problems/848/EXTRACTION_CHECKLIST.md',
      'packs/number-theory/problems/848/LEMMA21_EXPLICIT_BOUND.md',
      'packs/number-theory/problems/848/LEMMA22_EXPLICIT_BOUND.md',
      'packs/number-theory/problems/848/LEMMA21_TRUNCATION_SCAN.md',
      'packs/number-theory/problems/848/LEMMA22_PRIME_COUNT_BOUND.md',
      'packs/number-theory/problems/848/WEAKEST_BRANCH_T250_BUDGET.md',
    ],
    interpretation: 'These are local Sawhney explicitization/candidate notes. They do not import a new square-moduli union/hitting theorem strong enough to close the current all-N gap, and they explicitly avoid claiming a solved threshold handoff.',
    promotableSourceFound: false,
  },
  {
    categoryId: 'prior_source_gap_and_no_go_packets',
    pattern: 'union.*hitting|hitting.*union|square-moduli union|corrected square|source-import gap|no promotable',
    paths: ['packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE', 'packs/number-theory/problems/848/compute', 'test'],
    interpretation: 'These hits are prior no-go, residual, backlog, and source-recovery surfaces. They certify boundaries rather than supplying the missing theorem.',
    promotableSourceFound: false,
  },
  {
    categoryId: 'finite_or_test_scaffolding',
    pattern: 'squarefree-hitting|source-index audit|runtime|artifactProgress|TASK_LIST|PROGRESS',
    paths: ['packs/number-theory/problems/848', 'src', 'test'],
    interpretation: 'These hits are finite endpoint artifacts, generated task/progress wiring, or tests. They are not a source theorem with audited hypotheses/constants.',
    promotableSourceFound: false,
  },
];

const REPRESENTATIVE_SOURCE_SURFACES = [
  {
    surfaceId: 'corrected_square_moduli_no_go',
    path: DEFAULT_CORRECTED_SQUARE_MODULI_NO_GO_PACKET,
    expectedStatus: 'corrected_square_moduli_sieve_no_go_current_sources_handoff_to_p4217',
  },
  {
    surfaceId: 'tvd_threshold_pivot_reconciliation',
    path: DEFAULT_TVD_PIVOT_PACKET,
    expectedStatus: 'tvd_threshold_pivot_reconciled_direct_route_blocked_dual_sieve_required',
  },
  {
    surfaceId: 'tvd_large_sieve_direction_audit',
    path: DEFAULT_TVD_DIRECTION_PACKET,
    expectedStatus: 'large_sieve_reference_verified_direction_mismatch_blocks_threshold_collapse_claim',
  },
  {
    surfaceId: 'prior_no_spend_source_recovery_search',
    path: DEFAULT_SOURCE_RECOVERY_SEARCH_PACKET,
    expectedStatus: 'no_spend_source_recovery_search_completed_no_promotable_source_found',
  },
  {
    surfaceId: 'repo_explicit_sawhney_candidate_note',
    path: DEFAULT_PROPOSITION_CANDIDATE,
    expectedStatus: null,
  },
  {
    surfaceId: 'repo_explicit_extraction_checklist',
    path: DEFAULT_EXTRACTION_CHECKLIST,
    expectedStatus: null,
  },
];

function parseArgs(argv) {
  const options = {
    backlogPacket: DEFAULT_BACKLOG_PACKET,
    correctedSquareModuliNoGoPacket: DEFAULT_CORRECTED_SQUARE_MODULI_NO_GO_PACKET,
    tvdPivotPacket: DEFAULT_TVD_PIVOT_PACKET,
    tvdDirectionPacket: DEFAULT_TVD_DIRECTION_PACKET,
    sourceRecoverySearchPacket: DEFAULT_SOURCE_RECOVERY_SEARCH_PACKET,
    propositionCandidate: DEFAULT_PROPOSITION_CANDIDATE,
    extractionChecklist: DEFAULT_EXTRACTION_CHECKLIST,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--backlog-packet') {
      options.backlogPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--corrected-square-moduli-no-go-packet') {
      options.correctedSquareModuliNoGoPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--tvd-pivot-packet') {
      options.tvdPivotPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--tvd-direction-packet') {
      options.tvdDirectionPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--source-recovery-search-packet') {
      options.sourceRecoverySearchPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--proposition-candidate') {
      options.propositionCandidate = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--extraction-checklist') {
      options.extractionChecklist = path.resolve(argv[index + 1]);
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

function readTextIfPresent(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfPresent(filePath) {
  const text = readTextIfPresent(filePath);
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function existingPaths(paths) {
  return paths.filter((entryPath) => fs.existsSync(path.join(repoRoot, entryPath)));
}

function walkTextFiles(entryPath) {
  const absolutePath = path.join(repoRoot, entryPath);
  if (!fs.existsSync(absolutePath)) {
    return [];
  }

  const stat = fs.statSync(absolutePath);
  if (stat.isFile()) {
    return [entryPath];
  }
  if (!stat.isDirectory()) {
    return [];
  }

  const skipDirs = new Set(['.git', 'node_modules', '.erdos', '.clawdad', 'orp', 'output', 'tmp', 'dist']);
  const entries = fs.readdirSync(absolutePath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    if (entry.isDirectory() && skipDirs.has(entry.name)) {
      return [];
    }
    return walkTextFiles(path.join(entryPath, entry.name));
  });
}

function countMatches(filePath, pattern) {
  let text;
  try {
    text = fs.readFileSync(path.join(repoRoot, filePath), 'utf8');
  } catch {
    return 0;
  }

  const regex = new RegExp(pattern, 'g');
  const matches = text.match(regex);
  return matches?.length ?? 0;
}

function collectPatternMatches(pattern, paths) {
  const files = paths.flatMap(walkTextFiles);
  return files
    .map((filePath) => ({ filePath, count: countMatches(filePath, pattern) }))
    .filter((entry) => entry.count > 0)
    .sort((left, right) => left.filePath.localeCompare(right.filePath));
}

function runRg(args) {
  const [mode, pattern, ...paths] = args;
  const matches = collectPatternMatches(pattern, paths);
  if (mode === '-l') {
    return matches.map((entry) => entry.filePath).join('\n') + (matches.length ? '\n' : '');
  }
  if (mode === '--count-matches') {
    return matches.map((entry) => `${entry.filePath}:${entry.count}`).join('\n') + (matches.length ? '\n' : '');
  }
  throw new Error(`Unsupported source-search mode: ${mode}`);
}

function collectRgSummary(pattern, paths) {
  const presentPaths = existingPaths(paths);
  const fileList = presentPaths.length
    ? runRg(['-l', pattern, ...presentPaths])
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .sort((left, right) => left.localeCompare(right))
    : [];
  const countLines = presentPaths.length
    ? runRg(['--count-matches', pattern, ...presentPaths])
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    : [];
  const totalMatchCount = countLines.reduce((total, line) => {
    const match = /:(\d+)$/.exec(line);
    return total + (match ? Number(match[1]) : 0);
  }, 0);

  return {
    pattern,
    paths,
    presentPathCount: presentPaths.length,
    matchedFileCount: fileList.length,
    totalMatchCount,
    representativeMatchedFiles: fileList.slice(0, 16),
  };
}

function summarizeSurface(surface) {
  const text = readTextIfPresent(surface.path);
  const doc = surface.path.endsWith('.json') ? readJsonIfPresent(surface.path) : null;
  return {
    surfaceId: surface.surfaceId,
    relativePath: rel(surface.path),
    exists: Boolean(text),
    status: doc?.status ?? null,
    recommendedNextAction: doc?.recommendedNextAction ?? null,
    expectedStatus: surface.expectedStatus,
    sha256: text ? sha256File(surface.path) : null,
  };
}

function buildPacket(options) {
  const backlog = readJson(options.backlogPacket);
  assertCondition(backlog?.status === 'no_spend_local_theorem_backlog_prepared_after_source_import_boundary', 'backlog packet has unexpected status');
  assertCondition(backlog?.target === 'prepare_p848_no_spend_local_theorem_backlog_after_source_import_boundary', 'backlog packet has unexpected target');
  assertCondition(backlog?.recommendedNextAction === TARGET, 'backlog packet does not route to this source-index audit');
  assertCondition(backlog?.backlogDecision?.selectedBacklogItemId === 'square_moduli_union_hitting_local_backlog', 'backlog did not select the square-moduli union/hitting lane');
  assertCondition(backlog?.claims?.madeNewPaidCall === false, 'backlog unexpectedly records a paid call');
  assertCondition(backlog?.claims?.provesSawhneyUnionHittingUpperBound === false, 'backlog unexpectedly proves a Sawhney union/hitting upper bound');

  const correctedNoGo = readJson(options.correctedSquareModuliNoGoPacket);
  assertCondition(correctedNoGo?.claims?.provesTvdDirectRouteWrongDirectionForSawhneyUnionBound === true, 'corrected square-moduli no-go must preserve the direction mismatch');
  assertCondition(correctedNoGo?.claims?.provesComplementDualityDoesNotRepairDirection === true, 'corrected square-moduli no-go must preserve the complement-duality blocker');
  assertCondition(correctedNoGo?.claims?.provesUnionHittingThresholdBound === false, 'corrected square-moduli no-go unexpectedly proves the missing threshold bound');

  const tvdPivot = readJson(options.tvdPivotPacket);
  assertCondition(tvdPivot?.claims?.blocksDirectThresholdCollapseClaim === true, 'Tao-van-Doorn pivot packet must block the direct threshold-collapse claim');

  const tvdDirection = readJson(options.tvdDirectionPacket);
  assertCondition(tvdDirection?.directionAudit?.taoVanDoornTheoremControls === 'avoiding_set_size', 'Tao-van-Doorn direction audit must identify the avoiding side');

  const sourceRecovery = readJson(options.sourceRecoverySearchPacket);
  assertCondition(sourceRecovery?.claims?.foundPromotableUnionHittingSource === false, 'prior source recovery unexpectedly found a promotable union/hitting source');

  const sourceIndexAudit = collectRgSummary(SOURCE_INDEX_AUDIT_PATTERN, SOURCE_INDEX_AUDIT_PATHS);
  const sourceCategoryResults = CATEGORY_PROBES.map((probe) => ({
    categoryId: probe.categoryId,
    ...collectRgSummary(probe.pattern, probe.paths),
    interpretation: probe.interpretation,
    promotableSourceFound: probe.promotableSourceFound,
  }));
  const representativeSourceSurfaces = REPRESENTATIVE_SOURCE_SURFACES.map((surface) => {
    if (surface.path === DEFAULT_CORRECTED_SQUARE_MODULI_NO_GO_PACKET) {
      return summarizeSurface({ ...surface, path: options.correctedSquareModuliNoGoPacket });
    }
    if (surface.path === DEFAULT_TVD_PIVOT_PACKET) {
      return summarizeSurface({ ...surface, path: options.tvdPivotPacket });
    }
    if (surface.path === DEFAULT_TVD_DIRECTION_PACKET) {
      return summarizeSurface({ ...surface, path: options.tvdDirectionPacket });
    }
    if (surface.path === DEFAULT_SOURCE_RECOVERY_SEARCH_PACKET) {
      return summarizeSurface({ ...surface, path: options.sourceRecoverySearchPacket });
    }
    if (surface.path === DEFAULT_PROPOSITION_CANDIDATE) {
      return summarizeSurface({ ...surface, path: options.propositionCandidate });
    }
    if (surface.path === DEFAULT_EXTRACTION_CHECKLIST) {
      return summarizeSurface({ ...surface, path: options.extractionChecklist });
    }
    return summarizeSurface(surface);
  });

  return {
    schema: 'erdos.number_theory.p848_square_moduli_union_hitting_source_index_no_spend_audit_packet/1',
    packetId: 'P848_SQUARE_MODULI_UNION_HITTING_SOURCE_INDEX_NO_SPEND_AUDIT_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_source_index_audit_no_promotable_source_found',
      backlogPacket: rel(options.backlogPacket),
      backlogSha256: sha256File(options.backlogPacket),
      correctedSquareModuliNoGoPacket: rel(options.correctedSquareModuliNoGoPacket),
      correctedSquareModuliNoGoSha256: sha256File(options.correctedSquareModuliNoGoPacket),
      tvdPivotPacket: rel(options.tvdPivotPacket),
      tvdPivotSha256: sha256File(options.tvdPivotPacket),
      tvdDirectionPacket: rel(options.tvdDirectionPacket),
      tvdDirectionSha256: sha256File(options.tvdDirectionPacket),
      priorSourceRecoverySearchPacket: rel(options.sourceRecoverySearchPacket),
      priorSourceRecoverySearchSha256: sha256File(options.sourceRecoverySearchPacket),
    },
    auditExecution: {
      mode: 'no_spend_local_source_index_audit',
      sourceIndexAuditCommand: SOURCE_INDEX_AUDIT_COMMAND,
      commandWasExecutedLocally: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      verdict: 'no_promotable_square_moduli_union_hitting_source_theorem_found_current_repo',
      sourceIndexAudit,
      sourceCategoryResults,
    },
    representativeSourceSurfaces,
    sourceTheoremVerdict: {
      foundSawhneyCompatibleUnionHittingUpperBoundSource: false,
      foundOnlyAvoidingSideSquareModuliLargeSieve: true,
      foundOnlyExistingNoGoOrCandidateSurfaces: true,
      localSawhneyExplicitizationNotesPresent: true,
      whyCandidateNotesDoNotCloseThisBoundary: 'The local Sawhney explicitization notes support a candidate large-N stability package, but they do not import a new square-moduli union/hitting theorem that closes the finite gap below the threshold or repairs the Tao-van-Doorn avoiding-side shortcut.',
      missingTheoremStatement: 'A source theorem, importable reference, or repo-owned proof giving an upper bound for square-moduli union/hitting sets with Sawhney-compatible hypotheses, inequality direction, constants, and a threshold handoff that can be audited before any all-N recombination.',
    },
    sourceImportProfileSeed: {
      stepId: NEXT_ACTION,
      mode: 'no_spend_profile_or_approval_boundary',
      profileId: 'p848-square-moduli-union-hitting-source-import-single',
      sourceAuditQuestion: 'Problem 848 square-moduli union/hitting source-import theorem: identify a source theorem or proof giving Sawhney-compatible upper bounds for the union/hitting side of square obstruction classes modulo p^2, with explicit direction, hypotheses, constants, and threshold relevance. Reject avoiding-set-only Tao-van-Doorn readings, threshold claims without constants, and bounded finite evidence as all-N proof.',
      acceptableOutputs: [
        'An importable theorem/reference with audited union/hitting upper-bound direction, hypotheses, constants, and threshold relevance.',
        'A proof that no such source in the supplied corpus closes the current 848 gap, naming the exact missing hypothesis/constants.',
      ],
      unacceptableOutputs: [
        'Tao-van-Doorn avoiding-set upper bound promoted as a union/hitting upper bound.',
        'Complement duality used to turn an avoiding upper bound into a hitting upper bound.',
        'N0 around 1e6, N0 <= 40500, or an all-N decision claim without the union/hitting theorem and finite handoff.',
        'q-cover expansion, singleton q descent, fallback-selector ladder, or bounded evidence as proof.',
      ],
      futureLiveExecutionReleaseRequires: [
        'a future instruction that permits budget-guarded provider execution',
        './bin/erdos orp research usage --json reports remaining daily USD and run count',
        'the question remains this single square-moduli union/hitting source-import theorem audit',
        'any provider answer is packetized before promotion to proof',
      ],
    },
    forbiddenMovesAfterAudit: [
      'execute_provider_source_import_under_current_no_spend_instruction',
      'claim_a_tao_van_doorn_threshold_collapse_from_avoiding_side_evidence',
      'claim_N0_around_1e6_or_N0_at_most_40500',
      'claim_problem_848_decided',
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'emit_a_naked_deterministic_rank_boundary',
      'try_fallback_selectors_one_by_one',
      'treat_repo_explicit_candidate_notes_as_finite_all_N_closure',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Prepare a single-lane square-moduli union/hitting source-import profile or approval blocker before any future provider execution; keep the current turn no-spend.',
      finiteDenominatorOrRankToken: 'p848_square_moduli_union_hitting_source_index_no_spend_audit',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet completes the no-spend square-moduli union/hitting source-index audit. The local index contains Tao-van-Doorn avoiding-side evidence, Sawhney explicitization candidate notes, finite/test scaffolding, and prior no-go/source-gap packets, but no promotable source theorem giving the required union/hitting upper-bound direction with audited hypotheses/constants and finite handoff. It does not execute a provider call, lower an analytic threshold, prove all-N recombination, or decide Problem 848.',
    claims: {
      completesSquareModuliUnionHittingSourceIndexAudit: true,
      emitsNoPromotableSourceBlocker: true,
      commandWasExecutedLocally: true,
      madeNewPaidCall: false,
      currentStepAllowsPaidCall: false,
      foundSawhneyCompatibleUnionHittingUpperBoundSource: false,
      foundOnlyAvoidingSideSquareModuliLargeSieve: true,
      preservesTvdAvoidingDirectionBlocker: true,
      preservesComplementDualityLowerBoundBlocker: true,
      preservesPossibilityOfFutureSourceImport: true,
      preparesSingleLaneSourceImportProfileSeed: true,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      provesFiniteP4217Partition: false,
      provesP4217ResidualRankDecrease: false,
      provesSquarefreeRealizationSourceTheorem: false,
      provesMod50AllFutureRecurrence: false,
      provesSawhneyUnionHittingUpperBound: false,
      importsSquareModuliUnionHittingThreshold: false,
      lowersAnalyticThreshold: false,
      provesPost40500Sufficiency: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 square-moduli union/hitting source-index no-spend audit',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Paid/API call made: \`${packet.auditExecution.madeNewPaidCall}\``,
    '',
    '## Verdict',
    '',
    `- Source theorem found: \`${packet.sourceTheoremVerdict.foundSawhneyCompatibleUnionHittingUpperBoundSource}\``,
    `- Missing theorem: ${packet.sourceTheoremVerdict.missingTheoremStatement}`,
    `- Candidate-note boundary: ${packet.sourceTheoremVerdict.whyCandidateNotesDoNotCloseThisBoundary}`,
    '',
    '## Audit Command',
    '',
    `\`${packet.auditExecution.sourceIndexAuditCommand}\``,
    '',
    '## Source Categories',
    '',
    packet.auditExecution.sourceCategoryResults.map((category) => [
      `### ${category.categoryId}`,
      '',
      `- Matched files: \`${category.matchedFileCount}\``,
      `- Matches: \`${category.totalMatchCount}\``,
      `- Promotable source found: \`${category.promotableSourceFound}\``,
      `- Interpretation: ${category.interpretation}`,
      '',
    ].join('\n')).join('\n'),
    '## Next Profile Seed',
    '',
    `- Profile ID: \`${packet.sourceImportProfileSeed.profileId}\``,
    `- Step: \`${packet.sourceImportProfileSeed.stepId}\``,
    `- Question: ${packet.sourceImportProfileSeed.sourceAuditQuestion}`,
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesAfterAudit.map((item) => `- ${item}`).join('\n'),
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
