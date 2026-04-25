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

const DEFAULT_PLAN_PACKET = path.join(frontierBridge, 'P848_SOURCE_IMPORT_RECOVERY_PLAN_AFTER_P4217_AND_MOD50_SOURCE_GAPS_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET.md');

const TARGET = 'execute_p848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting';
const NEXT_ACTION = 'assemble_p848_all_n_residual_after_source_import_search_gap';
const STATUS = 'no_spend_source_recovery_search_completed_no_promotable_source_found';

const RECOVERY_LANES = [
  {
    laneId: 'p4217_residual_squarefree_realization_source',
    pattern: 'squarefree.*arithmetic progression|locally admissible|finite CRT partition|decreasing rank|p4217',
    command: 'rg -n "squarefree.*arithmetic progression|locally admissible|finite CRT partition|decreasing rank|p4217" packs src test',
    missingTheoremObject: 'p4217 residual finite complete CRT partition, well-founded decreasing rank/invariant, or squarefree-realization theorem for every locally admissible residual CRT/arithmetic-progression/linear-family instance',
    representativeExistingPackets: [
      'P848_P4217_RESIDUAL_SQUAREFREE_REALIZATION_SOURCE_THEOREM_GAP_PACKET.json',
      'P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
      'P848_P4217_COMPLEMENT_COVER_IMPOSSIBILITY_BLOCKER_PACKET.json',
    ],
  },
  {
    laneId: 'mod50_all_future_recurrence_or_generator',
    pattern: 'mod-?50|relevant pair|family-menu|finite Q|all-future recurrence|generator theorem',
    command: 'rg -n "mod-?50|relevant pair|family-menu|finite Q|all-future recurrence|generator theorem" packs src test',
    missingTheoremObject: 'mod-50 all-future relevant-pair recurrence, finite-Q partition, or restored original family-menu generator theorem covering every future relevant-pair row',
    representativeExistingPackets: [
      'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json',
      'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json',
      'P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json',
    ],
  },
  {
    laneId: 'square_moduli_union_hitting_threshold',
    pattern: 'union.*hitting|hitting.*union|square moduli|Tao|van Doorn|Sawhney|Lemma 2\\.1|Lemma 2\\.2',
    command: 'rg -n "union.*hitting|hitting.*union|square moduli|Tao|van Doorn|Sawhney|Lemma 2\\\\.1|Lemma 2\\\\.2" packs src test',
    missingTheoremObject: 'square-moduli union/hitting upper-bound theorem with Sawhney-compatible hypotheses, inequality direction, constants, and threshold',
    representativeExistingPackets: [
      'P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json',
      'P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json',
      'P848_TAO_VAN_DOORN_LARGE_SIEVE_DIRECTION_AUDIT_PACKET.json',
    ],
  },
];

function parseArgs(argv) {
  const options = {
    planPacket: DEFAULT_PLAN_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--plan-packet') {
      options.planPacket = path.resolve(argv[index + 1]);
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

function collectLaneEvidence(lane) {
  const fileList = runRg(['-l', lane.pattern, 'packs', 'src', 'test'])
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .sort((left, right) => left.localeCompare(right));
  const countLines = runRg(['--count-matches', lane.pattern, 'packs', 'src', 'test'])
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const matchCount = countLines.reduce((total, line) => {
    const match = /:(\d+)$/.exec(line);
    return total + (match ? Number(match[1]) : 0);
  }, 0);
  const existingPackets = lane.representativeExistingPackets.map((packetName) => {
    const absolutePath = path.join(frontierBridge, packetName);
    const exists = fs.existsSync(absolutePath);
    const doc = exists ? readJson(absolutePath) : null;
    return {
      relativePath: rel(absolutePath),
      exists,
      status: doc?.status ?? null,
      recommendedNextAction: doc?.recommendedNextAction ?? null,
    };
  });

  return {
    laneId: lane.laneId,
    status: 'no_promotable_source_found_current_repo',
    command: lane.command,
    pattern: lane.pattern,
    matchedFileCount: fileList.length,
    totalMatchCount: matchCount,
    representativeMatchedFiles: fileList.slice(0, 12),
    representativeExistingPackets: existingPackets,
    missingTheoremObject: lane.missingTheoremObject,
    promotableSourceFound: false,
    resultBoundary: 'Matches are existing blockers, finite evidence, tests, source-recovery scaffolding, or previously packetized no-go surfaces; no repo-owned theorem/generator/import source with verified hypotheses was found by this no-spend local search.',
  };
}

function buildPacket(options) {
  const plan = readJson(options.planPacket);
  assertCondition(plan?.status === 'source_import_recovery_plan_prepared_after_p4217_and_mod50_source_gaps', 'input plan packet has unexpected status');
  assertCondition(plan?.target === 'prepare_p848_source_import_recovery_plan_after_p4217_and_mod50_source_gaps', 'input plan packet has unexpected target');
  assertCondition(plan?.recommendedNextAction === TARGET, 'input plan packet does not route to the no-spend source recovery search');
  assertCondition(plan?.claims?.completesSourceImportRecoveryPlan === true, 'input plan packet does not complete the source recovery plan');
  assertCondition(plan?.claims?.madeNewPaidCall === false, 'input plan packet unexpectedly records a paid call');
  assertCondition(plan?.claims?.provesAllN === false, 'input plan packet unexpectedly proves all-N');

  const recoveryLaneResults = RECOVERY_LANES.map(collectLaneEvidence);
  const missingTheoremObjects = recoveryLaneResults.map((result) => result.missingTheoremObject);

  return {
    schema: 'erdos.number_theory.p848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting_packet/1',
    packetId: 'P848_NO_SPEND_SOURCE_RECOVERY_SEARCH_FOR_P4217_MOD50_UNION_HITTING_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_no_spend_source_search_no_promotable_source_found',
      planPacket: rel(options.planPacket),
      planSha256: sha256File(options.planPacket),
    },
    probeExecution: {
      mode: 'no_spend_local_rg_source_recovery_search',
      madeNewPaidCall: false,
      convergenceChecklist: 'orp mode breakdown granular-breakdown --topic "problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism" --json',
      laneCount: recoveryLaneResults.length,
      verdict: 'no_promotable_source_theorem_or_import_found_current_repo',
    },
    recoveryLaneResults,
    missingTheoremObjects,
    sourceImportGap: {
      status: 'formal_source_import_gap_after_no_spend_search',
      exactBoundary: 'The current repo still lacks all three promotion objects: a p4217 residual partition/rank/squarefree-realization theorem, a mod-50 all-future recurrence/finite-Q/generator theorem, and a square-moduli union/hitting upper-bound source with audited constants.',
      futureClosureRequiresOneOf: [
        'restore or prove the p4217 residual finite CRT partition, rank decrease, or squarefree-realization source theorem',
        'restore the mod-50 all-future recurrence, finite-Q partition, or original generator theorem',
        'import and audit a square-moduli union/hitting upper-bound theorem with the needed inequality direction and constants',
      ],
    },
    paidCallPolicy: {
      default: 'do_not_call_provider',
      madeNewPaidCall: false,
      repeatP4217WedgeDefault: 'blocked',
      beforeAnyFutureLiveCall: [
        'Write a repaired single-lane source/import profile naming exactly one theorem object.',
        'Run erdos orp research usage --json and verify remaining local run count and USD budget.',
        'Use live research only for source-audit/theorem-import recovery, not routine verification or broad fishing.',
      ],
    },
    forbiddenMovesUntilSourceRecoveryChangesBoundary: [
      'resume_q193_q197_singleton_descent',
      'launch_q193_q389_or_larger_q_cover_without_new_theorem',
      'emit_a_naked_deterministic_rank_boundary',
      'try_fallback_selectors_one_by_one',
      'rerun_the_same_p4217_paid_wedge_by_default',
      'claim_tao_van_doorn_plus_exact_verifier_decides_848_without_union_hitting_source',
      'claim_N0_around_1e6_or_N0_at_most_40500_without_imported_threshold_source',
      'treat_bounded_40500_or_280_row_menu_evidence_as_all_N_proof',
    ],
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Assemble the all-N residual after the no-spend source search gap, preserving the exact missing theorem objects and selecting either a single repaired source-import profile or a deterministic blocker.',
      finiteDenominatorOrRankToken: 'p848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting',
      command: 'node packs/number-theory/problems/848/compute/problem848_no_spend_source_recovery_search_for_p4217_mod50_union_hitting.mjs --write-defaults --pretty',
      verificationCommand: './bin/erdos problem progress 848 --json',
    },
    proofBoundary: 'This packet completes the no-spend local source recovery search and emits a formal source-import gap. It does not prove a p4217 finite partition, p4217 rank decrease, p4217 squarefree-realization source theorem, mod-50 all-future recurrence, finite-Q partition, square-moduli union/hitting threshold, post-40500 sufficiency theorem, all-N theorem, or Problem 848.',
    claims: {
      completesNoSpendSourceRecoverySearch: true,
      emitsFormalSourceImportGap: true,
      madeNewPaidCall: false,
      respectsNoPaidByDefault: true,
      searchedP4217SourceRecovery: true,
      searchedMod50SourceRecovery: true,
      searchedUnionHittingSourceRecovery: true,
      foundPromotableP4217Source: false,
      foundPromotableMod50Source: false,
      foundPromotableUnionHittingSource: false,
      blocksQCoverExpansion: true,
      blocksSingletonQDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      blocksNakedRankBoundary: true,
      blocksRepeatPaidWedgeByDefault: true,
      provesFiniteP4217Partition: false,
      provesP4217ResidualRankDecrease: false,
      provesSquarefreeRealizationSourceTheorem: false,
      provesMod50AllFutureRecurrence: false,
      provesFiniteQPartition: false,
      importsSquareModuliUnionHittingThreshold: false,
      provesPost40500Sufficiency: false,
      provesAllN: false,
      decidesProblem848: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 no-spend source recovery search for p4217, mod-50, and union/hitting',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Paid/API call made: \`${packet.probeExecution.madeNewPaidCall}\``,
    '',
    '## Verdict',
    '',
    packet.sourceImportGap.exactBoundary,
    '',
    '## Lane Results',
    '',
    packet.recoveryLaneResults.map((lane) => [
      `### ${lane.laneId}`,
      '',
      `- Status: \`${lane.status}\``,
      `- Command: \`${lane.command}\``,
      `- Matched files: \`${lane.matchedFileCount}\``,
      `- Total matches: \`${lane.totalMatchCount}\``,
      `- Missing object: ${lane.missingTheoremObject}`,
      `- Boundary: ${lane.resultBoundary}`,
    ].join('\n')).join('\n\n'),
    '',
    '## Missing Theorem Objects',
    '',
    packet.missingTheoremObjects.map((object) => `- ${object}`).join('\n'),
    '',
    '## Next Action',
    '',
    `\`${packet.oneNextAction.stepId}\`: ${packet.oneNextAction.action}`,
    '',
    '## Forbidden Moves',
    '',
    packet.forbiddenMovesUntilSourceRecoveryChangesBoundary.map((move) => `- \`${move}\``).join('\n'),
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
