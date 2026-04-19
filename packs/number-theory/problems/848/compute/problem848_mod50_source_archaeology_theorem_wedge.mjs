#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const FRONTIER_BRIDGE = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_SOURCE_BLOCKER_PACKET = path.join(FRONTIER_BRIDGE, 'P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(FRONTIER_BRIDGE, 'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.md');
const THEOREM_WEDGE_PROFILE_PATH = 'packs/number-theory/problems/848/ORP_RESEARCH_THEOREM_WEDGE_PROFILE.json';

const TARGET = 'prepare_p848_mod50_all_future_recurrence_theorem_wedge_or_restore_source_generator';
const NEXT_ACTION = 'decide_p848_mod50_recurrence_wedge_with_budget_guard_or_local_symbolic_proof';
const DAILY_USD_LIMIT_ENV = 'ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT';
const DAILY_RUN_LIMIT_ENV = 'ERDOS_ORP_RESEARCH_DAILY_LIMIT';
const DEFAULT_DAILY_USD_LIMIT = 5;
const DEFAULT_DAILY_RUN_LIMIT = 10;

const PATHS = {
  anchorSearchCode: path.join(repoRoot, 'research', 'frontier-engine', 'src', 'frontier_engine', 'p848_anchor_search.py'),
  theoremBridgeExporter: path.join(repoRoot, 'research', 'frontier-engine', 'src', 'frontier_engine', 'p848_theorem_bridge.py'),
  laneReadme: path.join(repoRoot, 'research', 'frontier-engine', 'experiments', 'p848-anchor-ladder', 'README.md'),
  frontierState: path.join(repoRoot, 'research', 'frontier-engine', 'experiments', 'p848-anchor-ladder', 'FRONTIER_STATE.json'),
  observedContinuations: path.join(repoRoot, 'research', 'frontier-engine', 'experiments', 'p848-anchor-ladder', 'observed_continuations.json'),
  knownFailurePackets: path.join(repoRoot, 'research', 'frontier-engine', 'experiments', 'p848-anchor-ladder', 'known_failure_packets.json'),
  researchLatestSync: path.join(repoRoot, 'research', 'frontier-engine', 'experiments', 'p848-anchor-ladder', 'live-frontier-sync', 'latest'),
  outputLiveSyncRoot: path.join(repoRoot, 'output', 'frontier-engine-local', 'p848-anchor-ladder', 'live-frontier-sync', '2026-04-05'),
  outputLiveSyncReadme: path.join(repoRoot, 'output', 'frontier-engine-local', 'p848-anchor-ladder', 'live-frontier-sync', '2026-04-05', 'README.md'),
  outputTwentyFourMenu: path.join(repoRoot, 'output', 'frontier-engine-local', 'p848-anchor-ladder', 'live-frontier-sync', '2026-04-05', 'SIX_PREFIX_TWENTY_FOUR_FAMILY_MENU.json'),
  searchTheoremBridgeJson: path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SEARCH_THEOREM_BRIDGE.json'),
  searchTheoremBridgeMarkdown: path.join(repoRoot, 'packs', 'number-theory', 'problems', '848', 'SEARCH_THEOREM_BRIDGE.md'),
  artifactRoot: path.join(repoRoot, 'research', 'frontier-engine', 'artifacts', 'p848-anchor-ladder'),
  theoremWedgeProfile: path.join(repoRoot, THEOREM_WEDGE_PROFILE_PATH),
};

function parseArgs(argv) {
  const options = {
    sourceBlockerPacket: DEFAULT_SOURCE_BLOCKER_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--source-blocker-packet') {
      options.sourceBlockerPacket = path.resolve(argv[index + 1]);
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
  try {
    return path.relative(repoRoot, filePath);
  } catch {
    return filePath;
  }
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function readTextIfPresent(filePath) {
  return exists(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

function readJsonIfPresent(filePath) {
  if (!exists(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function sha256FileIfPresent(filePath) {
  return exists(filePath)
    ? crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex')
    : null;
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function parseNonnegativeNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : fallback;
}

function getDailyUsdLimit() {
  return parseNonnegativeNumber(process.env[DAILY_USD_LIMIT_ENV], DEFAULT_DAILY_USD_LIMIT);
}

function getDailyRunLimit() {
  return Math.floor(parseNonnegativeNumber(process.env[DAILY_RUN_LIMIT_ENV], DEFAULT_DAILY_RUN_LIMIT));
}

function findFiles(root, predicate) {
  if (!exists(root)) {
    return [];
  }
  const found = [];
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.isFile() && predicate(fullPath)) {
        found.push(fullPath);
      }
    }
  }
  return found.sort((left, right) => left.localeCompare(right));
}

function textFlags(filePath, flags) {
  const text = readTextIfPresent(filePath) ?? '';
  return Object.fromEntries(
    Object.entries(flags).map(([key, pattern]) => [key, pattern.test(text)]),
  );
}

function summarizeMenu(filePath) {
  const doc = readJsonIfPresent(filePath);
  if (!doc) {
    return null;
  }
  const families = Array.isArray(doc.families) ? doc.families : [];
  const parameters = doc.parameters ?? {};
  const summary = doc.summary ?? {};
  const knownFailures = Array.isArray(parameters.knownFailures)
    ? parameters.knownFailures.map((value) => Number(value)).filter(Number.isFinite)
    : [];
  const nextUnmatched = families.find((family) => family?.matchesKnownFailure === false)?.representative ?? null;
  return {
    relativePath: rel(filePath),
    familyCount: Number(summary.familyCount ?? families.length),
    knownFailureMatches: Number(summary.knownFailureMatches ?? families.filter((family) => family?.matchesKnownFailure === true).length),
    knownFailureCount: knownFailures.length,
    lastKnownMatched: knownFailures.length > 0 ? knownFailures.at(-1) : null,
    nextUnmatched,
    repairAnchorCount: Array.isArray(parameters.repairAnchors) ? parameters.repairAnchors.length : null,
  };
}

function summarizeManifest(manifestPath) {
  const doc = readJsonIfPresent(manifestPath);
  if (!doc) {
    return null;
  }
  const summary = doc.summary ?? {};
  return {
    relativePath: rel(manifestPath),
    knownFailurePacketCount: Number(summary.known_failure_packet_count ?? 0),
    familyMenuCount: Number(summary.family_menu_count ?? 0),
    bestContinuation: summary.best_continuation ?? null,
    bestRepairedKnownPackets: Number(summary.best_repaired_known_packets ?? 0),
    bestRepairedPredictedFamilies: Number(summary.best_repaired_predicted_families ?? 0),
    bestEffectiveCleanThrough: Number(summary.best_effective_clean_through ?? 0),
    candidatesEvaluated: Number(summary.candidates_evaluated ?? 0),
  };
}

function summarizeManifestSweep(root) {
  const manifests = findFiles(root, (filePath) => path.basename(filePath) === 'manifest.json')
    .map(summarizeManifest)
    .filter(Boolean);
  const score = (manifest) => [
    manifest.knownFailurePacketCount,
    manifest.familyMenuCount,
    manifest.bestRepairedKnownPackets,
    manifest.bestRepairedPredictedFamilies,
    manifest.bestEffectiveCleanThrough,
    manifest.candidatesEvaluated,
    manifest.relativePath,
  ];
  const best = manifests.length > 0
    ? manifests.toSorted((left, right) => {
      const leftScore = score(left);
      const rightScore = score(right);
      for (let index = 0; index < leftScore.length; index += 1) {
        if (leftScore[index] === rightScore[index]) {
          continue;
        }
        return leftScore[index] > rightScore[index] ? -1 : 1;
      }
      return 0;
    })[0]
    : null;

  return {
    artifactRoot: rel(root),
    manifestCount: manifests.length,
    bestManifest: best,
    topManifestSamples: manifests.slice(0, 5),
  };
}

function buildSurface(id, filePath, role, summary, flags = {}) {
  return {
    id,
    relativePath: rel(filePath),
    exists: exists(filePath),
    role,
    summary,
    flags,
    provesOriginalGeneratorRestored: false,
    provesSymbolicRelevantPairRecurrence: false,
    provesFiniteQPartition: false,
    provesAllFutureRecurrence: false,
  };
}

function buildQuestion() {
  return [
    'Problem 848 theorem wedge:',
    'Given the restored finite mod-50 six-prefix family-menu evidence, the exact bounded CRT menu replay theorem, and the frontier-engine anchor-ladder artifacts,',
    'prove or refute a symbolic all-future recurrence or finite-Q partition for the mod-50 square-witness relevant-pair domain.',
    'Specifically characterize whether future family-menu rows can introduce new square witness moduli or lower representatives indefinitely,',
    'and state the minimal theorem needed before any 40501+ rollout or all-N recombination can use this lane.',
  ].join(' ');
}

function quoteForShell(value) {
  return `"${String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"')}"`;
}

function buildPacket(options) {
  const sourceBlocker = readJsonIfPresent(options.sourceBlockerPacket);
  assertCondition(sourceBlocker?.recommendedNextAction === TARGET, 'source blocker does not route to the source archaeology/theorem-wedge target');
  assertCondition(sourceBlocker?.claims?.routesToLocalSourceArchaeologyOrBudgetGuardedWedge === true, 'source blocker does not authorize the local archaeology/wedge route');
  assertCondition(sourceBlocker?.claims?.provesSymbolicRelevantPairRecurrence === false, 'source blocker unexpectedly proves symbolic recurrence');
  assertCondition(sourceBlocker?.claims?.provesFiniteQPartition === false, 'source blocker unexpectedly proves finite Q partition');

  const anchorFlags = textFlags(PATHS.anchorSearchCode, {
    hasFiniteFirstFailureSearch: /def search_first_failure\(/,
    hasCandidatePoolGeneration: /def generate_candidate_pool\(/,
    hasTorchBackend: /evaluate_p848_candidates_torch/,
    hasBestFamilyMenuLoader: /def load_best_family_menu_surface\(/,
    hasExpectedSharedPrefix: /EXPECTED_SHARED_PREFIX/,
  });
  const bridgeFlags = textFlags(PATHS.theoremBridgeExporter, {
    emitsCandidateTheoremHooks: /candidate_theorem_hooks/,
    writesSearchTheoremBridge: /write_p848_theorem_bridge/,
    namesFiniteLeaderboard: /gpu_leaderboard/,
  });
  const readmeFlags = textFlags(PATHS.laneReadme, {
    warnsNotYetTheorem: /not yet a theorem/i,
    saysEngineShouldNotClaimRecurrence: /engine should not claim the recurrence/i,
    namesStableFiniteObstructionQuestion: /stable finite obstruction menu/i,
  });
  const outputReadmeFlags = textFlags(PATHS.outputLiveSyncReadme, {
    namesFrozenPackets: /Frozen packets/,
    namesFamilyClassifier: /Family classifier/,
    namesNextUnmatchedRepresentative: /next unmatched representative/i,
  });

  const frontierState = readJsonIfPresent(PATHS.frontierState);
  const bridge = readJsonIfPresent(PATHS.searchTheoremBridgeJson);
  const menuSummary = summarizeMenu(PATHS.outputTwentyFourMenu);
  const manifestSweep = summarizeManifestSweep(PATHS.artifactRoot);
  const question = buildQuestion();
  const profileArg = `--profile-file ${THEOREM_WEDGE_PROFILE_PATH}`;
  const planCommand = `erdos orp research ask 848 ${profileArg} --question ${quoteForShell(question)} --json`;
  const liveCommand = `erdos orp research ask 848 ${profileArg} --question ${quoteForShell(question)} --execute --allow-paid --json`;

  const auditedSurfaces = [
    buildSurface(
      'pack_source_theorem_blocker',
      options.sourceBlockerPacket,
      'Pack-side proof boundary after the exact bounded CRT menu replay theorem.',
      {
        status: sourceBlocker.status,
        target: sourceBlocker.target,
        auditedSourceCount: sourceBlocker.sourceTheoremAudit?.auditedSourceCount ?? null,
        auditResult: sourceBlocker.sourceTheoremAudit?.result ?? null,
      },
    ),
    buildSurface(
      'frontier_engine_anchor_search_code',
      PATHS.anchorSearchCode,
      'Runnable finite anchor-ladder search/scoring surface.',
      {
        finiteSearchSurface: anchorFlags.hasFiniteFirstFailureSearch && anchorFlags.hasCandidatePoolGeneration,
        hasTorchBatchBackend: anchorFlags.hasTorchBackend,
        expectedSharedPrefixHardcodedForLane: anchorFlags.hasExpectedSharedPrefix,
      },
      anchorFlags,
    ),
    buildSurface(
      'frontier_engine_theorem_bridge_exporter',
      PATHS.theoremBridgeExporter,
      'Search-to-theorem bridge emitter for finite hooks and leaderboards.',
      {
        emitsCandidateHooks: bridgeFlags.emitsCandidateTheoremHooks,
        currentBridgeHookCount: Array.isArray(bridge?.candidate_theorem_hooks) ? bridge.candidate_theorem_hooks.length : null,
      },
      bridgeFlags,
    ),
    buildSurface(
      'frontier_engine_lane_readme',
      PATHS.laneReadme,
      'Human-readable lane contract for the p848 anchor-ladder search rail.',
      {
        engineExplicitlyDisclaimsRecurrenceProof: readmeFlags.warnsNotYetTheorem && readmeFlags.saysEngineShouldNotClaimRecurrence,
      },
      readmeFlags,
    ),
    buildSurface(
      'frontier_state_snapshot',
      PATHS.frontierState,
      'Frozen finite frontier state used by the engine lane.',
      {
        currentBestContinuation: frontierState?.current_best_continuation ?? null,
        currentBestCleanThrough: frontierState?.current_best_clean_through ?? null,
        familyAwareLeader: frontierState?.family_aware_search_leader?.continuation ?? null,
        latestLiveSharedPrefixFailure: frontierState?.latest_live_shared_prefix_failure ?? null,
      },
    ),
    buildSurface(
      'output_live_frontier_sync_readme',
      PATHS.outputLiveSyncReadme,
      'Repo-local copied live frontier sync notes for finite packets and family classifiers.',
      {
        finiteSyncAvailable: exists(PATHS.outputLiveSyncRoot),
      },
      outputReadmeFlags,
    ),
    buildSurface(
      'output_twenty_four_family_menu',
      PATHS.outputTwentyFourMenu,
      'Richest restored finite family-menu JSON currently available locally.',
      menuSummary,
    ),
    buildSurface(
      'research_latest_live_sync_fallback',
      PATHS.researchLatestSync,
      'Preferred repo-owned latest live-frontier-sync fallback named by the search code.',
      {
        available: exists(PATHS.researchLatestSync),
        note: exists(PATHS.researchLatestSync)
          ? 'The preferred research latest sync exists.'
          : 'The search code names this fallback, but the directory is absent in the current checkout.',
      },
    ),
    {
      id: 'frontier_engine_artifact_manifest_sweep',
      relativePath: rel(PATHS.artifactRoot),
      exists: exists(PATHS.artifactRoot),
      role: 'GPU/search bundle manifest sweep for finite family-aware seed evidence.',
      summary: manifestSweep,
      provesOriginalGeneratorRestored: false,
      provesSymbolicRelevantPairRecurrence: false,
      provesFiniteQPartition: false,
      provesAllFutureRecurrence: false,
    },
    buildSurface(
      'orp_theorem_wedge_profile',
      PATHS.theoremWedgeProfile,
      'Bounded single-lane ORP/OpenAI profile used to avoid launching the full council/deep-research lanes by default.',
      {
        profilePath: THEOREM_WEDGE_PROFILE_PATH,
        expectedProfileId: 'p848-mod50-theorem-wedge-single',
        limitsFullCouncilByDefault: true,
      },
      {
        usesProfileFile: true,
        avoidsFullCouncilDefault: true,
        avoidsDeepResearchDefault: true,
      },
    ),
  ];

  return {
    schema: 'erdos.number_theory.p848_mod50_source_archaeology_theorem_wedge_packet/1',
    packetId: 'P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: 'mod50_source_archaeology_completed_theorem_wedge_prepared',
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'completed_by_local_source_archaeology_wedge_packet',
      sourceBlockerPacket: rel(options.sourceBlockerPacket),
      sourceBlockerSha256: sha256FileIfPresent(options.sourceBlockerPacket),
    },
    localSourceArchaeology: {
      result: 'finite_search_surfaces_found_all_future_source_theorem_not_restored',
      auditedSurfaceCount: auditedSurfaces.length,
      auditedSurfaces,
      summary: {
        finiteFrontierEngineSearchCodeAvailable: exists(PATHS.anchorSearchCode),
        finiteOutputFamilyMenuAvailable: exists(PATHS.outputTwentyFourMenu),
        outputFamilyMenu: menuSummary,
        repoOwnedResearchLatestSyncAvailable: exists(PATHS.researchLatestSync),
        artifactManifestCount: manifestSweep.manifestCount,
        bestArtifactManifest: manifestSweep.bestManifest,
        searchTheoremBridgeHookCount: Array.isArray(bridge?.candidate_theorem_hooks) ? bridge.candidate_theorem_hooks.length : null,
        allFutureSourceTheoremRestored: false,
        originalGeneratorRestored: false,
        symbolicRelevantPairRecurrenceProved: false,
        finiteQPartitionProved: false,
      },
      conclusion: 'Local archaeology finds strong finite search, bridge, menu, and manifest surfaces, but no repo-owned all-future recurrence theorem, finite-Q partition, or original family-menu generator source.',
    },
    theoremWedge: {
      status: 'prepared_budget_guarded_no_live_call_made',
      question,
      requiredLocalInputs: [
        rel(options.sourceBlockerPacket),
        rel(PATHS.anchorSearchCode),
        rel(PATHS.laneReadme),
        rel(PATHS.frontierState),
        rel(PATHS.outputLiveSyncReadme),
        rel(PATHS.outputTwentyFourMenu),
        rel(PATHS.searchTheoremBridgeJson),
        rel(PATHS.searchTheoremBridgeMarkdown),
      ],
      requiredAnswerShape: [
        'State whether a symbolic all-future recurrence, finite-Q partition, or impossibility theorem is plausible from these artifacts.',
        'If yes, identify the exact lemma statement and proof atoms needed.',
        'If no, identify the missing source/generator data that would be required before another finite search sweep is justified.',
        'Do not treat finite menus, GPU leaderboards, or finite CRT replay as all-N evidence without an explicit theorem.',
      ],
      budgetGuard: {
        noLiveCallMadeByThisPacket: true,
        profilePath: THEOREM_WEDGE_PROFILE_PATH,
        profilePurpose: 'single_lane_theorem_wedge_no_full_council_or_deep_research_by_default',
        planningCommand: planCommand,
        liveCommandRequiresExplicitOptIn: liveCommand,
        requiredFlagsForPaidCall: ['--execute', '--allow-paid'],
        dailyUsdLimitEnvVar: DAILY_USD_LIMIT_ENV,
        dailyUsdLimit: getDailyUsdLimit(),
        dailyRunLimitEnvVar: DAILY_RUN_LIMIT_ENV,
        dailyRunLimit: getDailyRunLimit(),
        note: 'The planning command is safe and does not spend. The live command is allowed only after the local usage ledger is checked and the paid-call guard permits it.',
      },
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Use the prepared theorem wedge locally first; only execute one ORP/OpenAI live call if the usage ledger and explicit paid guard allow it, otherwise continue by proving the named symbolic recurrence/finite-Q partition from local artifacts.',
      finiteDenominatorOrRankToken: 'p848_mod50_source_archaeology_theorem_wedge_after_all_future_blocker',
      failureBoundary: 'If the wedge is not run or returns no theorem, do not resume q-cover or finite 40501+ rollout; require a new symbolic recurrence, finite-Q partition, restored source generator, or explicit no-source approval packet.',
      command: planCommand,
    },
    forbiddenMovesBeforeWedgeDecision: [
      'make_paid_theorem_wedge_call_without_usage_check_and_explicit_paid_opt_in',
      'treat_frontier_engine_finite_search_code_as_original_generator_theorem',
      'treat_output_family_menu_as_all_future_recurrence',
      'resume_q_cover_or_selector_ladder_without_new_invariant',
      'launch_40501_plus_rollout_from_finite_replay',
    ],
    proofBoundary: 'This packet completes local source archaeology and prepares a budget-guarded theorem wedge. It proves no all-future recurrence, no finite-Q partition, no original generator restoration, and no all-N decision for Problem 848.',
    claims: {
      completesLocalSourceArchaeology: true,
      findsFrontierEngineFiniteSearchSurfaces: true,
      findsOutputFiniteFamilyMenuSurface: exists(PATHS.outputTwentyFourMenu),
      restoresOriginalGenerator: false,
      provesSymbolicRelevantPairRecurrence: false,
      provesFiniteQPartition: false,
      provesUniversalSquareWitnessDomainCover: false,
      preparesBudgetGuardedTheoremWedge: true,
      livePaidCallMade: false,
      respectsNoPaidByDefault: true,
      blocksFiniteReplayAsAllFuture: true,
      provesAllN: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  const archaeology = packet.localSourceArchaeology;
  const wedge = packet.theoremWedge;
  return [
    '# P848 mod-50 source archaeology theorem-wedge packet',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    `- Archaeology result: \`${archaeology.result}\``,
    '',
    '## Conclusion',
    '',
    archaeology.conclusion,
    '',
    '## Audited Surfaces',
    '',
    ...archaeology.auditedSurfaces.map((surface) => `- \`${surface.id}\` (${surface.exists ? 'present' : 'missing'}): ${surface.role}`),
    '',
    '## Wedge',
    '',
    wedge.question,
    '',
    '## Budget Guard',
    '',
    `- Planning command: \`${wedge.budgetGuard.planningCommand}\``,
    `- Live command requires explicit opt-in: \`${wedge.budgetGuard.liveCommandRequiresExplicitOptIn}\``,
    `- Bounded profile: \`${wedge.budgetGuard.profilePath}\` (${wedge.budgetGuard.profilePurpose})`,
    `- Daily USD guard: \`${wedge.budgetGuard.dailyUsdLimitEnvVar}=${wedge.budgetGuard.dailyUsdLimit}\``,
    `- Daily run guard: \`${wedge.budgetGuard.dailyRunLimitEnvVar}=${wedge.budgetGuard.dailyRunLimit}\``,
    '',
    '## Forbidden Before Wedge Decision',
    '',
    ...packet.forbiddenMovesBeforeWedgeDecision.map((move) => `- \`${move}\``),
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
