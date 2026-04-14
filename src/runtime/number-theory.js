import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { parse, stringify } from 'yaml';
import { loadConfig } from './config.js';
import { ensureDir, writeJson, writeText } from './files.js';
import {
  getFrontierFleetSnapshot,
  applyFrontierRemoteSync,
  getFrontierDoctorSnapshot,
  getFrontierDoctorSnapshotForRemote,
  resolveFrontierExecutionPlan,
} from './frontier.js';
import {
  isBrevRemote,
  joinRemotePath,
  quotePosixShellArg,
  quoteRemoteWindowsPath,
  runRemoteCommandCapture,
  runRemoteCopyFromCapture,
  runRemoteCopyToCapture,
} from './frontier-remote.js';
import {
  findReusableFrontierDetachedSession,
  getFrontierSessionCommandSpec,
  getFrontierSessionSnapshot,
  launchFrontierDetachedSession,
} from './frontier-sessions.js';
import { getPackProblemDir, getWorkspaceRunDir, getWorkspaceRoot, repoRoot } from './paths.js';
import {
  getProblemClaimLoopSnapshot,
  getProblemClaimPassSnapshot,
  getProblemFormalizationSnapshot,
  getProblemFormalizationWorkSnapshot,
  getProblemTaskListSnapshot,
  getProblemTheoremLoopSnapshot,
  refreshProblemFormalization,
  refreshProblemFormalizationWork,
  refreshProblemClaimPass,
} from './theorem-loop.js';

function readYamlIfPresent(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return parse(fs.readFileSync(filePath, 'utf8'));
}

function readJsonIfPresent(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function formatShellArg(value) {
  if (value === null || value === undefined) {
    return '';
  }
  const text = String(value);
  if (/^[A-Za-z0-9_./:=+-]+$/.test(text)) {
    return text;
  }
  return JSON.stringify(text);
}

function formatCommandLine(executable, args = []) {
  return [executable, ...args].map(formatShellArg).join(' ');
}

function getPackFile(problemId, fileName) {
  return path.join(getPackProblemDir('number-theory', problemId), fileName);
}

function parseClosedIntegerRange(rangeText) {
  const match = String(rangeText ?? '').trim().match(/^(\d+)\.\.(\d+)$/);
  if (!match) {
    return null;
  }
  return {
    min: Number(match[1]),
    max: Number(match[2]),
  };
}

function parsePositiveInteger(value) {
  if (value === null || value === undefined) {
    return null;
  }
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function normalizeQuestionLedger(rawLedger) {
  return {
    openQuestions: rawLedger?.open_questions ?? [],
    activeRouteNotes: rawLedger?.active_route_notes ?? [],
    routeBreakthroughs: rawLedger?.route_breakthroughs ?? [],
    problemSolved: rawLedger?.problem_solved ?? [],
  };
}

function parseOpsDetails(problemId) {
  const opsDetailsPath = getPackFile(problemId, 'OPS_DETAILS.yaml');
  const payload = readYamlIfPresent(opsDetailsPath);
  if (!payload) {
    return null;
  }
  return {
    packetId: payload.packet_id ?? null,
    summary: payload.summary ?? null,
    path: opsDetailsPath,
    routes: payload.routes ?? [],
    tickets: payload.tickets ?? [],
    atoms: payload.atoms ?? [],
  };
}

function findRouteDetail(opsDetails, routeId) {
  if (!opsDetails || !Array.isArray(opsDetails.routes)) {
    return null;
  }
  return opsDetails.routes.find((route) => route.route_id === routeId) ?? null;
}

function findTicketDetail(opsDetails, ticketId) {
  if (!opsDetails || !Array.isArray(opsDetails.tickets)) {
    return null;
  }
  return opsDetails.tickets.find((ticket) => ticket.ticket_id === ticketId) ?? null;
}

function findAtomDetail(opsDetails, atomId) {
  if (!opsDetails || !Array.isArray(opsDetails.atoms)) {
    return null;
  }
  return opsDetails.atoms.find((atom) => atom.atom_id === atomId) ?? null;
}

function findActiveRouteDetail(opsDetails, activeRoute) {
  if (!opsDetails || !Array.isArray(opsDetails.routes)) {
    return null;
  }
  return opsDetails.routes.find((route) => route.route_id === activeRoute) ?? opsDetails.routes[0] ?? null;
}

function findActiveTicketDetail(opsDetails, activeRoute) {
  if (!opsDetails || !Array.isArray(opsDetails.tickets)) {
    return null;
  }
  return (
    opsDetails.tickets.find((ticket) => ticket.status === 'active' && (!activeRoute || ticket.route_id === activeRoute))
    ?? opsDetails.tickets.find((ticket) => !activeRoute || ticket.route_id === activeRoute)
    ?? opsDetails.tickets[0]
    ?? null
  );
}

function findFirstReadyAtom(opsDetails, activeRoute) {
  if (!opsDetails || !Array.isArray(opsDetails.atoms)) {
    return null;
  }
  return (
    opsDetails.atoms.find((atom) => atom.status === 'ready' && (!activeRoute || atom.route_id === activeRoute))
    ?? opsDetails.atoms.find((atom) => atom.status === 'ready')
    ?? null
  );
}

function resolveArchiveMode(problem) {
  const siteStatus = String(problem.siteStatus ?? '').toLowerCase();
  if (siteStatus === 'solved') {
    return 'method_exemplar';
  }
  if (siteStatus === 'disproved') {
    return 'counterexample_archive';
  }
  return null;
}

function getFrontierEngineRootPath() {
  return path.join(repoRoot, 'research', 'frontier-engine');
}

function getSearchTheoremBridgeEngineCommand(problemId) {
  if (String(problemId) === '848') {
    return 'python3 research/frontier-engine/src/frontier_engine/cli.py export-p848-theorem-bridge';
  }
  return null;
}

function getSearchTheoremBridgeRefreshCommand(problemId) {
  return getSearchTheoremBridgeEngineCommand(problemId)
    ? `erdos number-theory bridge-refresh ${problemId}`
    : null;
}

function getSearchTheoremBridgeRefreshSpec(problemId) {
  if (String(problemId) === '848') {
    const engineCommand = getSearchTheoremBridgeEngineCommand(problemId);
    const executionPlan = resolveFrontierExecutionPlan('bridgeRefresh848');
    if (!engineCommand || !executionPlan.available) {
      return null;
    }
    return {
      executable: executionPlan.executable,
      args: executionPlan.args,
      engineCommand,
      executionMode: executionPlan.mode,
      executionSource: executionPlan.source,
      executionReason: executionPlan.reason,
      resolvedCommand: executionPlan.commandLine,
    };
  }

  return null;
}

function getIntervalWorkQueue(problemId) {
  return readYamlIfPresent(getPackFile(problemId, 'INTERVAL_WORK_QUEUE.yaml'));
}

function getP848ExactCertificatePaths(max) {
  return {
    certificatePath: getPackFile('848', `EXACT_SMALL_N_1_${max}_CERTIFICATE.md`),
    resultsPath: getPackFile('848', `EXACT_SMALL_N_1_${max}_RESULTS.json`),
    certificateFile: `EXACT_SMALL_N_1_${max}_CERTIFICATE.md`,
    resultsFile: `EXACT_SMALL_N_1_${max}_RESULTS.json`,
  };
}

function getWorkspaceRunsDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(workspaceRoot, '.erdos', 'runs');
}

function listP848ExactFollowupRuns(workspaceRoot = getWorkspaceRoot()) {
  const runsDir = getWorkspaceRunsDir(workspaceRoot);
  if (!fs.existsSync(runsDir)) {
    return [];
  }

  return fs.readdirSync(runsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.includes('__number_theory_p848__exact_followup_launch'))
    .map((entry) => entry.name)
    .sort()
    .map((entryName) => {
      const exactFollowupPath = path.join(runsDir, entryName, 'exact-followup', 'EXACT_FOLLOWUP.json');
      const exactResultsPath = path.join(runsDir, entryName, 'exact-followup', 'EXACT_SMALL_N_RESULTS.json');
      const followup = readJsonIfPresent(exactFollowupPath);
      const results = readJsonIfPresent(exactResultsPath);
      const min = parsePositiveInteger(followup?.backend?.min ?? results?.parameters?.min);
      const max = parsePositiveInteger(followup?.backend?.max ?? results?.parameters?.max);
      return {
        runId: entryName,
        exactFollowupPath,
        exactResultsPath,
        followup,
        results,
        min,
        max,
      };
    })
    .filter((entry) => entry.followup && entry.results && entry.min !== null && entry.max !== null)
    .filter((entry) => entry.results?.summary?.allCandidateAchievesMaximum === true)
    .filter((entry) => entry.results?.summary?.allExampleCliquesMatchCandidateClass === true)
    .sort((left, right) => {
      if (left.min !== right.min) {
        return left.min - right.min;
      }
      return left.max - right.max;
    });
}

function p848ExactRowsEquivalent(left, right) {
  return Number(left?.N) === Number(right?.N)
    && Number(left?.maxCliqueSize) === Number(right?.maxCliqueSize)
    && Number(left?.residue7Size) === Number(right?.residue7Size)
    && Number(left?.residue18Size) === Number(right?.residue18Size)
    && Boolean(left?.candidateAchievesMaximum) === Boolean(right?.candidateAchievesMaximum)
    && Boolean(left?.exampleMatchesResidue7) === Boolean(right?.exampleMatchesResidue7)
    && Boolean(left?.exampleMatchesResidue18) === Boolean(right?.exampleMatchesResidue18)
    && JSON.stringify(left?.exampleMaximumClique ?? []) === JSON.stringify(right?.exampleMaximumClique ?? []);
}

function normalizeP848ExactResultRows(rows, promotedMax) {
  const rowByN = new Map();
  const duplicateNs = [];
  const conflictingDuplicateNs = [];
  for (const row of Array.isArray(rows) ? rows : []) {
    const n = Number(row?.N);
    if (!Number.isInteger(n) || n < 1 || n > promotedMax) {
      continue;
    }
    const previous = rowByN.get(n);
    if (previous) {
      duplicateNs.push(n);
      if (!p848ExactRowsEquivalent(previous, row)) {
        conflictingDuplicateNs.push(n);
      }
      continue;
    }
    rowByN.set(n, row);
  }

  const missingNs = [];
  const normalizedRows = [];
  for (let n = 1; n <= promotedMax; n += 1) {
    const row = rowByN.get(n);
    if (!row) {
      missingNs.push(n);
      continue;
    }
    normalizedRows.push(row);
  }

  return {
    ok: missingNs.length === 0 && conflictingDuplicateNs.length === 0,
    rows: normalizedRows,
    audit: {
      inputRowCount: Array.isArray(rows) ? rows.length : 0,
      outputRowCount: normalizedRows.length,
      duplicateCount: duplicateNs.length,
      duplicateNs: duplicateNs.slice(0, 50),
      conflictingDuplicateCount: conflictingDuplicateNs.length,
      conflictingDuplicateNs: conflictingDuplicateNs.slice(0, 50),
      missingCount: missingNs.length,
      missingNs: missingNs.slice(0, 50),
    },
  };
}

function buildP848ExactCoveragePromotion(workspaceRoot = getWorkspaceRoot()) {
  if (path.resolve(workspaceRoot) !== repoRoot) {
    return {
      ok: true,
      promoted: false,
      reason: 'Canonical exact promotion only runs from the repository workspace root.',
    };
  }

  const queue = getIntervalWorkQueue('848');
  const latestDoneInterval = [...(queue?.intervals ?? [])]
    .reverse()
    .find((interval) => interval.status === 'done' && interval.method_class === 'exact_small_n') ?? null;
  const latestDoneRange = parseClosedIntegerRange(latestDoneInterval?.range);
  const baseResultsPath = latestDoneInterval?.data_packet
    ? getPackFile('848', latestDoneInterval.data_packet)
    : null;
  const baseResults = baseResultsPath ? readJsonIfPresent(baseResultsPath) : null;

  if (!latestDoneRange || !baseResults?.results) {
    return {
      ok: false,
      promoted: false,
      error: 'The canonical exact-small-N base interval is missing or unreadable.',
    };
  }

  const exactRuns = listP848ExactFollowupRuns(workspaceRoot);
  let cursor = latestDoneRange.max + 1;
  const contiguousRuns = [];
  const usedRunIds = new Set();
  while (true) {
    const candidate = exactRuns
      .filter((run) => !usedRunIds.has(run.runId))
      .filter((run) => run.min <= cursor && run.max >= cursor)
      .sort((left, right) => {
        if (left.max !== right.max) {
          return right.max - left.max;
        }
        return left.min - right.min;
      })[0];
    if (!candidate) {
      break;
    }
    contiguousRuns.push(candidate);
    usedRunIds.add(candidate.runId);
    cursor = candidate.max + 1;
  }

  const promotedMax = cursor - 1;
  if (promotedMax <= latestDoneRange.max) {
    return {
      ok: true,
      promoted: false,
      latestCanonicalMax: latestDoneRange.max,
      reason: 'No new contiguous exact-small-N coverage is ready for canonical promotion.',
    };
  }

  const mergedResults = [
    ...(Array.isArray(baseResults.results) ? baseResults.results : []),
    ...contiguousRuns.flatMap((run) => Array.isArray(run.results?.results) ? run.results.results : []),
  ];
  const normalizedMerge = normalizeP848ExactResultRows(mergedResults, promotedMax);
  if (!normalizedMerge.ok) {
    return {
      ok: false,
      promoted: false,
      error: 'Exact-small-N promotion merge did not produce one non-conflicting row for every N in the promoted interval.',
      latestCanonicalMax: latestDoneRange.max,
      promotedMax,
      mergeAudit: normalizedMerge.audit,
    };
  }
  const paths = getP848ExactCertificatePaths(promotedMax);

  return {
    ok: true,
    promoted: true,
    latestCanonicalMax: latestDoneRange.max,
    promotedMax,
    queue,
    latestDoneInterval,
    baseResults,
    contiguousRuns,
    mergedResults: normalizedMerge.rows,
    mergeAudit: normalizedMerge.audit,
    ...paths,
  };
}

function renderP848ExactCertificate(max, resultsFile) {
  return [
    `# Problem 848 Exact Small-\`N\` Certificate: \`1..${max}\``,
    '',
    'This is the current exact bounded-verification base certificate frozen in the repo for',
    'Problem `848`.',
    '',
    '## Claim',
    '',
    `For every \`N\` with \`1 <= N <= ${max}\`, the maximum size of a set \`A subseteq [N]\` such that`,
    '\`ab + 1\` is never squarefree for all \`a, b in A\` is equal to the size of the \`7 mod 25\`',
    'or \`18 mod 25\` residue class in \`[N]\`.',
    '',
    `This certificate only covers the interval \`1..${max}\`.`,
    '',
    '## Method class',
    '',
    '- `exact_small_n`',
    '',
    '## Reproduction',
    '',
    'Command family used:',
    '',
    '```bash',
    'node packs/number-theory/problems/848/compute/problem848_small_n_exact_scan.mjs \\',
    '  --min <interval-min> \\',
    '  --max <interval-max> \\',
    '  --json-output <workspace-run-dir>/EXACT_SMALL_N_RESULTS.json',
    '```',
    '',
    'The canonical results file below is the contiguous merge of the certified base interval and',
    'the later successful exact follow-up runs that extend it without a gap.',
    '',
    '## Outcome',
    '',
    `- interval: \`1..${max}\``,
    '- result: verified',
    '- every scanned `N` satisfied:',
    '  - `max_clique_size = max(|{n in [N] : n equiv 7 mod 25}|, |{n in [N] : n equiv 18 mod 25}|)`',
    '',
    'The machine-readable result packet is:',
    `- \`${resultsFile}\``,
    '',
    '## Scope warning',
    '',
    `This does **not** certify anything above \`${max}\`.`,
    'It is a current exact interval certificate only.',
    '',
    '## Why this interval matters',
    '',
    '- it extends the repo-owned exact small-`N` coverage monotonically',
    '- it preserves a reproducible certificate surface for the bounded-verification lane',
    '- it keeps imported public computation separate from repo-audited exact coverage',
    '',
  ].join('\n');
}

function updateP848IntervalQueueForPromotion(promotedMax) {
  const queuePath = getPackFile('848', 'INTERVAL_WORK_QUEUE.yaml');
  const queue = getIntervalWorkQueue('848') ?? {};
  const nextMin = promotedMax + 1;
  const paths = getP848ExactCertificatePaths(promotedMax);
  const intervals = Array.isArray(queue.intervals) ? queue.intervals.map((interval) => ({ ...interval })) : [];

  for (const interval of intervals) {
    if (interval.interval_id === 'N848.V1') {
      interval.range = `1..${promotedMax}`;
      interval.status = 'done';
      interval.method_class = 'exact_small_n';
      interval.claim_level = 'verified';
      interval.certificate = paths.certificateFile;
      interval.data_packet = paths.resultsFile;
      interval.next_move = `Use this as the current trusted exact base interval and decide whether the next extension after ${promotedMax} should stay exact or switch method class.`;
    }
    if (interval.interval_id === 'N848.V2') {
      interval.range = `${nextMin}..?`;
      interval.status = 'ready';
      interval.method_class = 'exact_small_n';
      interval.claim_level = 'target';
      interval.certificate = '';
      interval.data_packet = '';
      interval.next_move = `Decide how far the exact clique scan can be pushed beyond ${promotedMax} before a different method class is needed.`;
    }
  }

  writeText(queuePath, stringify({
    ...queue,
    intervals,
  }));
}

function updateP848ContextForPromotion(promotedMax) {
  const contextPath = getPackFile('848', 'context.yaml');
  const context = readYamlIfPresent(contextPath) ?? {};
  const exactCertificate = `EXACT_SMALL_N_1_${promotedMax}_CERTIFICATE.md`;
  const artifactFocus = Array.isArray(context.artifact_focus) ? [...context.artifact_focus] : [];
  const nextArtifactFocus = artifactFocus.filter((entry) => !/^EXACT_SMALL_N_1_\d+_CERTIFICATE\.md$/.test(String(entry)));
  nextArtifactFocus.push(exactCertificate);

  const routeBreakthroughs = Array.isArray(context.question_ledger?.route_breakthroughs)
    ? context.question_ledger.route_breakthroughs.map((entry) => String(entry).includes('exact verified base interval')
      ? `The repo now has an exact verified base interval \`1..${promotedMax}\`.`
      : entry)
    : [];

  const nextContext = {
    ...context,
    route_story: `Problem 848 is already asymptotically resolved in public, but not yet closed here for all N. The honest job is to shrink the finite remainder with audited threshold tracking and reproducible bounded verification, beginning from the verified base interval \`1..${promotedMax}\`.`,
    frontier_detail: `The repo now has a verified exact interval \`1..${promotedMax}\`; the next question is whether to extend that exact scan further or change method class.`,
    next_honest_move: `Decide whether to extend the exact clique scan beyond \`${promotedMax}\` or pivot to a different bounded-verification method.`,
    artifact_focus: nextArtifactFocus,
    question_ledger: {
      ...(context.question_ledger ?? {}),
      route_breakthroughs: routeBreakthroughs,
    },
  };

  writeText(contextPath, stringify(nextContext));
}

function updateP848FrontierNoteForPromotion(promotedMax) {
  const notePath = getPackFile('848', 'FRONTIER_NOTE.md');
  if (!fs.existsSync(notePath)) {
    return;
  }
  let text = fs.readFileSync(notePath, 'utf8');
  text = text.replace(/EXACT_SMALL_N_1_\d+_CERTIFICATE\.md/g, `EXACT_SMALL_N_1_${promotedMax}_CERTIFICATE.md`);
  writeText(notePath, text);
}

function updateP848BoundedVerificationPlanForPromotion(promotedMax) {
  const planPath = getPackFile('848', 'BOUNDED_VERIFICATION_PLAN.md');
  if (!fs.existsSync(planPath)) {
    return;
  }
  let text = fs.readFileSync(planPath, 'utf8');
  text = text.replace(
    /Current progress:\n- the repo now has an exact small-`N` certificate for `1\.\.\d+`/m,
    `Current progress:\n- the repo now has an exact small-\`N\` certificate for \`1..${promotedMax}\``,
  );
  writeText(planPath, text);
}

function updateP848VerificationRegimesForPromotion(promotedMax) {
  const regimesPath = getPackFile('848', 'VERIFICATION_REGIMES.md');
  if (!fs.existsSync(regimesPath)) {
    return;
  }
  let text = fs.readFileSync(regimesPath, 'utf8');
  text = text.replace(
    /- Regime A: (?:first )?exact interval `1\.\.\d+` is now frozen in the repo with a reproducible\n  maximum-clique certificate/m,
    `- Regime A: exact interval \`1..${promotedMax}\` is now frozen in the repo with a reproducible\n  maximum-clique certificate`,
  );
  text = text.replace(
    /- Regime B: endpoint-monotonicity breakpoint certificate exists over the current exact base,\n  but the endpoint-only verifier for extending beyond that base is not frozen yet/m,
    `- Regime B: endpoint-monotonicity breakpoint certificate and endpoint exact verifier are\n  active over the current exact base; the next use is larger certified rollouts beyond\n  \`${promotedMax}\``,
  );
  text = text.replace(
    /So the next honest move is to decide whether exact-small-`N` coverage should be extended\ndirectly beyond `\d+`, or whether the next gain comes from auditing imported computation or\nswitching method class\./m,
    `So the next honest move is to decide whether exact-small-\`N\` coverage should be extended\ndirectly beyond \`${promotedMax}\`, or whether the next gain comes from auditing imported computation or\nswitching method class.`,
  );
  writeText(regimesPath, text);
}

function updateP848ExactBreakpointScoutForPromotion(promotedMax) {
  const scriptPath = getPackFile('848', path.join('compute', 'problem848_exact_breakpoint_scout.mjs'));
  const resultsPath = getP848ExactCertificatePaths(promotedMax).resultsPath;
  const outputPath = getPackFile('848', 'EXACT_BREAKPOINT_SCOUT.json');
  if (!fs.existsSync(scriptPath) || !fs.existsSync(resultsPath)) {
    return {
      ok: false,
      error: 'Exact breakpoint scout script or promoted results file is missing.',
      scriptPath,
      resultsPath,
      outputPath,
    };
  }
  try {
    const stdout = execFileSync('node', [
      scriptPath,
      '--results',
      resultsPath,
      '--json-output',
      outputPath,
    ], {
      encoding: 'utf8',
      cwd: repoRoot,
    });
    return {
      ok: true,
      scriptPath,
      resultsPath,
      outputPath,
      stdout,
    };
  } catch (error) {
    return {
      ok: false,
      error: error?.stderr?.toString?.() || error?.message || 'Exact breakpoint scout failed.',
      scriptPath,
      resultsPath,
      outputPath,
    };
  }
}

function updateP848BreakpointCertificateForPromotion(promotedMax) {
  const scriptPath = getPackFile('848', path.join('compute', 'problem848_breakpoint_certificate.mjs'));
  const resultsPath = getP848ExactCertificatePaths(promotedMax).resultsPath;
  const outputPath = getPackFile('848', 'EXACT_BREAKPOINT_CERTIFICATE.json');
  if (!fs.existsSync(scriptPath) || !fs.existsSync(resultsPath)) {
    return {
      ok: false,
      error: 'Breakpoint certificate script or promoted results file is missing.',
      scriptPath,
      resultsPath,
      outputPath,
    };
  }
  try {
    const stdout = execFileSync('node', [
      scriptPath,
      '--results',
      resultsPath,
      '--json-output',
      outputPath,
    ], {
      encoding: 'utf8',
      cwd: repoRoot,
    });
    return {
      ok: true,
      scriptPath,
      resultsPath,
      outputPath,
      stdout,
    };
  } catch (error) {
    return {
      ok: false,
      error: error?.stderr?.toString?.() || error?.message || 'Breakpoint certificate generation failed.',
      scriptPath,
      resultsPath,
      outputPath,
    };
  }
}

function updateP848OpsDetailsForPromotion(promotedMax) {
  const opsPath = getPackFile('848', 'OPS_DETAILS.yaml');
  const ops = readYamlIfPresent(opsPath);
  if (!ops) {
    return;
  }

  for (const route of Array.isArray(ops.routes) ? ops.routes : []) {
    if (route.route_id === 'finite_check_gap_closure') {
      route.next_move = `Decide whether to extend exact verified coverage beyond \`${promotedMax}\` or switch method class.`;
    }
    if (route.route_id === 'bounded_finite_verification') {
      route.next_move = `Build on the exact \`1..${promotedMax}\` base interval and decide the next extension rule.`;
    }
  }

  for (const ticket of Array.isArray(ops.tickets) ? ops.tickets : []) {
    if (ticket.ticket_id === 'N848') {
      ticket.summary = `The repo now has a committed review package for its audited \`exp(1420)\` candidate, a chosen bounded-verification lane, and an exact verified base interval \`1..${promotedMax}\`. The live question is how to extend coverage from that foothold.`;
    }
  }

  for (const atom of Array.isArray(ops.atoms) ? ops.atoms : []) {
    if (atom.atom_id === 'N848.G1.A20') {
      atom.summary = `The repo now has a reproducible exact certificate showing that the conjectured extremal size is correct for every \`N\` in \`1..${promotedMax}\`.`;
      atom.next_move = `Decide whether to extend the exact clique scan beyond \`${promotedMax}\` or change method class.`;
    }
    if (atom.atom_id === 'N848.G1.A21') {
      atom.title = `Choose the next verified interval extension beyond \`${promotedMax}\``;
      atom.summary = `The bounded-verification lane now starts from a real certified base interval \`1..${promotedMax}\`. The next choice is whether the exact clique scan still has enough headroom to extend that base efficiently, or whether the next gain should come from breakpoint or audit methods.`;
      atom.next_move = `Decide whether to extend exact verified coverage beyond \`${promotedMax}\` or switch method class.`;
    }
  }

  writeText(opsPath, stringify(ops));
}

function promoteP848ExactCoverage(workspaceRoot = getWorkspaceRoot()) {
  const promotion = buildP848ExactCoveragePromotion(workspaceRoot);
  if (!promotion.ok || !promotion.promoted) {
    return promotion;
  }

  const aggregatedResults = {
    generatedAt: new Date().toISOString(),
    method: 'exact_maximum_clique_scan',
    problemId: '848',
    parameters: {
      min: 1,
      max: promotion.promotedMax,
    },
    summary: {
      interval: `1..${promotion.promotedMax}`,
      rows: promotion.promotedMax,
      allCandidateAchievesMaximum: true,
      allExampleCliquesMatchCandidateClass: true,
    },
    promotedFrom: [
      {
        source: 'canonical_pack',
        interval: promotion.latestDoneInterval?.range ?? null,
        dataPacket: promotion.latestDoneInterval?.data_packet ?? null,
      },
      ...promotion.contiguousRuns.map((run) => ({
        source: 'workspace_exact_followup',
        runId: run.runId,
        interval: `${run.min}..${run.max}`,
        exactFollowupPath: run.exactFollowupPath,
        exactResultsPath: run.exactResultsPath,
      })),
    ],
    mergeAudit: promotion.mergeAudit ?? null,
    results: promotion.mergedResults,
  };

  writeJson(promotion.resultsPath, aggregatedResults);
  writeText(
    promotion.certificatePath,
    renderP848ExactCertificate(promotion.promotedMax, promotion.resultsFile),
  );
  updateP848IntervalQueueForPromotion(promotion.promotedMax);
  updateP848ContextForPromotion(promotion.promotedMax);
  updateP848FrontierNoteForPromotion(promotion.promotedMax);
  updateP848BoundedVerificationPlanForPromotion(promotion.promotedMax);
  updateP848VerificationRegimesForPromotion(promotion.promotedMax);
  const breakpointScout = updateP848ExactBreakpointScoutForPromotion(promotion.promotedMax);
  const breakpointCertificate = updateP848BreakpointCertificateForPromotion(promotion.promotedMax);
  updateP848OpsDetailsForPromotion(promotion.promotedMax);

  return {
    ok: true,
    promoted: true,
    promotedMax: promotion.promotedMax,
    certificatePath: promotion.certificatePath,
    resultsPath: promotion.resultsPath,
    breakpointScout,
    breakpointCertificate,
    contiguousRunCount: promotion.contiguousRuns.length,
  };
}

function getP848ExactScoutPlan(problemId, options = {}) {
  if (String(problemId) !== '848') {
    return {
      available: false,
      actionId: 'exact_interval_scout',
      reason: `No exact interval scout is registered for problem ${problemId}.`,
    };
  }

  const queue = getIntervalWorkQueue(problemId);
  const readyInterval = queue?.intervals?.find((interval) => interval.status === 'ready' && interval.method_class === 'exact_small_n') ?? null;
  const latestDoneInterval = [...(queue?.intervals ?? [])]
    .reverse()
    .find((interval) => interval.status === 'done' && interval.method_class === 'exact_small_n') ?? null;
  const latestDoneRange = parseClosedIntegerRange(latestDoneInterval?.range);
  const defaultMin = latestDoneRange ? latestDoneRange.max + 1 : null;
  const requestedMin = parsePositiveInteger(options.exactMin);
  const requestedMax = parsePositiveInteger(options.exactMax);
  const min = requestedMin ?? defaultMin;
  const max = requestedMax ?? (min !== null ? min + 99 : null);
  const endpointMonotonicity = Boolean(options.endpointMonotonicity);

  if (!readyInterval || min === null || max === null || max < min) {
    return {
      available: false,
      actionId: 'exact_interval_scout',
      reason: 'The exact interval scout does not have a valid ready range yet.',
      readyInterval,
      latestDoneInterval,
    };
  }

  const scriptPath = getPackFile(problemId, 'compute/problem848_small_n_exact_scan.mjs');
  return {
    available: true,
    actionId: 'exact_interval_scout',
    mode: 'cpu',
    source: 'exact_verification_lane',
    reason: `The bounded-verification queue has a ready exact-small-N extension after ${latestDoneInterval?.range ?? '(unknown range)'}.`,
    readyInterval,
    latestDoneInterval,
    min,
    max,
    scriptPath,
    commandLine: formatCommandLine('node', [
      scriptPath,
      '--min',
      String(min),
      '--max',
      String(max),
      ...(endpointMonotonicity ? ['--endpoint-monotonicity'] : []),
      '--json-output',
      '<workspace-run-dir>/EXACT_SMALL_N_RESULTS.json',
    ]),
    endpointMonotonicity,
    backendKind: endpointMonotonicity ? 'endpoint_monotonicity_small_n' : 'exact_small_n',
  };
}

function normalizeFrontierLoop(rawLoop, problemId) {
  if (!rawLoop || rawLoop.enabled === false) {
    return null;
  }

  const commands = Array.isArray(rawLoop.commands)
    ? rawLoop.commands.map((command) => String(command)).filter(Boolean)
    : [];
  const useWhen = Array.isArray(rawLoop.use_when)
    ? rawLoop.use_when.map((item) => String(item)).filter(Boolean)
    : [];
  const artifacts = Array.isArray(rawLoop.artifacts)
    ? rawLoop.artifacts.map((item) => String(item)).filter(Boolean)
    : [];

  return {
    enabled: true,
    title: rawLoop.title ?? 'frontier_engine_support_lane',
    summary: rawLoop.summary ?? null,
    useWhen,
    commands,
    artifacts,
    primaryCommand: commands[0] ?? null,
    refreshCommand: getSearchTheoremBridgeRefreshCommand(problemId),
    engineCommand: getSearchTheoremBridgeEngineCommand(problemId),
    suggested: true,
  };
}

function resolveFrontierLoopState(frontierLoop, problemId) {
  if (!frontierLoop) {
    return null;
  }

  const config = loadConfig();
  const frontierConfig = config.frontier ?? {};
  const activeRemoteId = String(
    frontierConfig.activeRemoteId
    ?? frontierConfig.remote?.remoteId
    ?? frontierConfig.remote?.instanceName
    ?? frontierConfig.remote?.sshHost
    ?? '',
  ).trim() || null;
  const enabledPaidRemoteIds = Array.isArray(frontierConfig.paidRungs?.enabledRemoteIds)
    ? frontierConfig.paidRungs.enabledRemoteIds.map((item) => String(item)).filter(Boolean)
    : [];
  const remotePaidRung = frontierConfig.remote?.provider === 'brev';
  const remotePaidEnabled = !remotePaidRung
    || Boolean(frontierConfig.remote?.paidEnabled)
    || (activeRemoteId ? enabledPaidRemoteIds.includes(activeRemoteId) : false);
  const remoteGpuReady = Boolean(
    frontierConfig.remote?.attached
    && frontierConfig.remote?.gpuSearchReady
    && remotePaidEnabled,
  );
  const activationCommand = 'erdos frontier setup --base --apply';
  const upgradeCommand = 'erdos frontier setup --cuda --torch-index-url <url> --apply';
  const loopMode = remoteGpuReady
    ? 'gpu'
    : !frontierConfig.loopOptIn
    ? null
    : frontierConfig.gpuSearchReady
      ? 'gpu'
      : frontierConfig.managedFrontierReady
        ? 'cpu'
        : null;
  const loopActive = loopMode !== null;

  let stateReason = 'inactive';
  if (loopMode === 'gpu') {
    stateReason = remoteGpuReady ? 'gpu_ready_remote' : 'gpu_ready';
  } else if (loopMode === 'cpu') {
    stateReason = 'cpu_ready';
  } else if (remotePaidRung && frontierConfig.remote?.attached && frontierConfig.remote?.gpuSearchReady && !remotePaidEnabled) {
    stateReason = 'paid_rung_not_enabled';
  } else if (!frontierConfig.loopOptIn && !remoteGpuReady) {
    stateReason = 'not_opted_in';
  } else {
    stateReason = 'runtime_not_ready';
  }

  return {
    ...frontierLoop,
    problemId,
    suggested: loopActive,
    active: loopActive,
    mode: loopMode,
    available: true,
    activationCommand,
    upgradeCommand,
    runtimeMode: frontierConfig.runtimeMode ?? null,
    activeMode: frontierConfig.activeMode ?? loopMode,
    loopOptIn: Boolean(frontierConfig.loopOptIn),
    managedFrontierReady: Boolean(frontierConfig.managedFrontierReady),
    gpuSearchReady: Boolean(frontierConfig.gpuSearchReady),
    remoteSshHost: frontierConfig.remote?.sshHost ?? null,
    remotePaidRung,
    remotePaidEnabled,
    remoteGpuSearchReady: remoteGpuReady,
    lastSetupAt: frontierConfig.lastSetupAt ?? null,
    lastDoctorAt: frontierConfig.lastDoctorAt ?? null,
    stateReason,
  };
}

export function buildNumberTheoryStatusSnapshot(problem) {
  const contextPath = getPackFile(problem.problemId, 'context.yaml');
  const contextMarkdownPath = getPackFile(problem.problemId, 'CONTEXT.md');
  const routePacketPath = getPackFile(problem.problemId, 'ROUTE_PACKET.yaml');
  const frontierNotePath = getPackFile(problem.problemId, 'FRONTIER_NOTE.md');
  const routeHistoryPath = getPackFile(problem.problemId, 'ROUTE_HISTORY.md');
  const checkpointTemplatePath = getPackFile(problem.problemId, 'CHECKPOINT_TEMPLATE.md');
  const reportTemplatePath = getPackFile(problem.problemId, 'REPORT_TEMPLATE.md');
  const searchTheoremBridgePath = getPackFile(problem.problemId, 'SEARCH_THEOREM_BRIDGE.md');
  const searchTheoremBridgeJsonPath = getPackFile(problem.problemId, 'SEARCH_THEOREM_BRIDGE.json');
  const searchTheoremBridge = readJsonIfPresent(searchTheoremBridgeJsonPath);
  const frontierEngineRootPath = getFrontierEngineRootPath();
  const theoremLoop = getProblemTheoremLoopSnapshot(problem);
  const claimLoop = getProblemClaimLoopSnapshot(problem);
  const claimPass = getProblemClaimPassSnapshot(problem);
  const formalization = getProblemFormalizationSnapshot(problem);
  const formalizationWork = getProblemFormalizationWorkSnapshot(problem);
  const taskList = getProblemTaskListSnapshot(problem);

  const context = readYamlIfPresent(contextPath) ?? {};
  const routePacket = readYamlIfPresent(routePacketPath);
  const opsDetails = parseOpsDetails(problem.problemId);
  const frontierLoop = resolveFrontierLoopState(
    normalizeFrontierLoop(context.frontier_loop, problem.problemId),
    problem.problemId,
  );

  const activeRoute =
    problem.researchState?.active_route
    ?? context.default_active_route
    ?? routePacket?.route_id
    ?? null;
  const routeBreakthrough = typeof problem.researchState?.route_breakthrough === 'boolean'
    ? problem.researchState.route_breakthrough
    : false;
  const archiveMode = resolveArchiveMode(problem);
  const problemSolved = typeof problem.researchState?.problem_solved === 'boolean'
    ? problem.researchState.problem_solved
    : String(problem.siteStatus ?? '').toLowerCase() === 'solved';
  const openProblem = typeof problem.researchState?.open_problem === 'boolean'
    ? problem.researchState.open_problem
    : String(problem.siteStatus ?? '').toLowerCase() === 'open';

  const activeRouteDetail = findActiveRouteDetail(opsDetails, activeRoute);
  const activeTicketDetail = findActiveTicketDetail(opsDetails, activeRoute);
  const firstReadyAtom = findFirstReadyAtom(opsDetails, activeRoute);
  const readyAtoms = Array.isArray(opsDetails?.atoms)
    ? opsDetails.atoms.filter((atom) => atom.status === 'ready')
    : [];

  return {
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    displayName: problem.displayName,
    title: problem.title,
    cluster: problem.cluster,
    familyRole: context.family_role ?? 'number_theory_pack',
    harnessProfile: context.harness_profile ?? 'starter_workspace',
    activeRoute,
    routeBreakthrough,
    problemSolved,
    openProblem,
    siteStatus: problem.siteStatus,
    archiveMode,
    bootstrapFocus: context.bootstrap_focus ?? null,
    routeStory: context.route_story ?? routePacket?.frontier_claim ?? problem.shortStatement,
    frontierLabel: context.frontier_label ?? activeRoute ?? 'number_theory_frontier',
    frontierDetail: firstReadyAtom?.summary ?? context.frontier_detail ?? activeRouteDetail?.summary ?? problem.shortStatement,
    checkpointFocus: context.checkpoint_focus ?? activeRouteDetail?.why_now ?? null,
    nextHonestMove:
      firstReadyAtom?.next_move
      ?? activeTicketDetail?.next_move
      ?? context.next_honest_move
      ?? 'Pull the dossier, freeze the route note, and preserve public-status honesty.',
    relatedCoreProblems: context.related_core_problems ?? [],
    literatureFocus: context.literature_focus ?? [],
    artifactFocus: context.artifact_focus ?? [],
    questionLedger: normalizeQuestionLedger(context.question_ledger),
    contextPresent: fs.existsSync(contextPath),
    contextPath,
    contextMarkdownPath,
    routePacketPresent: Boolean(routePacket),
    routePacket,
    routePacketPath,
    frontierNotePresent: fs.existsSync(frontierNotePath),
    frontierNotePath,
    routeHistoryPresent: fs.existsSync(routeHistoryPath),
    routeHistoryPath,
    searchTheoremBridgePresent: fs.existsSync(searchTheoremBridgePath),
    searchTheoremBridgePath,
    searchTheoremBridgeJsonPresent: fs.existsSync(searchTheoremBridgeJsonPath),
    searchTheoremBridgeJsonPath,
    searchTheoremBridgeCurrentState: searchTheoremBridge?.current_bridge_state ?? null,
    searchTheoremBridgeSources: searchTheoremBridge?.sources ?? null,
    searchTheoremBridgeRefreshCommand: getSearchTheoremBridgeRefreshCommand(problem.problemId),
    searchTheoremBridgeEngineCommand: getSearchTheoremBridgeEngineCommand(problem.problemId),
    theoremLoop,
    claimLoop,
    claimPass,
    formalization,
    formalizationWork,
    taskList,
    frontierLoop,
    frontierLoopSuggested: Boolean(frontierLoop?.active),
    frontierEnginePresent: fs.existsSync(frontierEngineRootPath),
    frontierEngineRootPath,
    checkpointTemplatePresent: fs.existsSync(checkpointTemplatePath),
    checkpointTemplatePath,
    reportTemplatePresent: fs.existsSync(reportTemplatePath),
    reportTemplatePath,
    opsDetailsPresent: Boolean(opsDetails),
    opsDetailsPath: opsDetails?.path ?? getPackFile(problem.problemId, 'OPS_DETAILS.yaml'),
    opsDetails,
    activeRouteDetail,
    activeTicketDetail,
    firstReadyAtom,
    readyAtomCount: readyAtoms.length,
  };
}

export function getNumberTheoryBridgeSnapshot(problem) {
  const snapshot = buildNumberTheoryStatusSnapshot(problem);
  const bridge = readJsonIfPresent(snapshot.searchTheoremBridgeJsonPath);
  const refreshSpec = getSearchTheoremBridgeRefreshSpec(problem.problemId);

  return {
    ...snapshot,
    bridgePresent: Boolean(bridge),
    bridgeSchema: bridge?.schema ?? null,
    bridgeMarkdownPath: snapshot.searchTheoremBridgePath,
    bridgeMarkdownPresent: snapshot.searchTheoremBridgePresent,
    bridgeJsonPath: snapshot.searchTheoremBridgeJsonPath,
    bridgeJsonPresent: snapshot.searchTheoremBridgeJsonPresent,
    bridgeRefreshCommand: snapshot.searchTheoremBridgeRefreshCommand,
    bridgeEngineCommand: snapshot.searchTheoremBridgeEngineCommand,
    bridgeRefreshMode: refreshSpec?.executionMode ?? null,
    bridgeRefreshSource: refreshSpec?.executionSource ?? null,
    bridgeRefreshReason: refreshSpec?.executionReason ?? null,
    bridgeRefreshResolvedCommand: refreshSpec?.resolvedCommand ?? null,
    bridgeSources: bridge?.sources ?? null,
    bridgeCurrentState: bridge?.current_bridge_state ?? null,
    bridgePacketLedger: bridge?.shared_prefix_packet_ledger ?? [],
    bridgeTrackedTailMatrix: bridge?.tracked_tail_matrix ?? [],
    bridgeGpuLeaderboard: bridge?.gpu_leaderboard ?? [],
    bridgeTheoremHooks: bridge?.candidate_theorem_hooks ?? [],
  };
}

function buildDispatchApplyCommand(problemId, actionId, options = {}) {
  const command = [
    'erdos',
    'number-theory',
    'dispatch',
    String(problemId),
    '--apply',
    '--action',
    String(actionId),
  ];
  if (options.remoteId) {
    command.push('--remote-id', String(options.remoteId));
  }
  if (options.externalSourceDir) {
    command.push('--external-source-dir', String(options.externalSourceDir));
  }
  if (options.exactMin !== null && options.exactMin !== undefined) {
    command.push('--exact-min', String(options.exactMin));
  }
  if (options.exactMax !== null && options.exactMax !== undefined) {
    command.push('--exact-max', String(options.exactMax));
  }
  if (options.exactChunks !== null && options.exactChunks !== undefined) {
    command.push('--exact-chunks', String(options.exactChunks));
  }
  if (options.exactChunkSize !== null && options.exactChunkSize !== undefined) {
    command.push('--exact-chunk-size', String(options.exactChunkSize));
  }
  if (options.baseSideMax !== null && options.baseSideMax !== undefined) {
    command.push('--base-side-max', String(options.baseSideMax));
  }
  if (options.structuralMax !== null && options.structuralMax !== undefined) {
    command.push('--structural-max', String(options.structuralMax));
  }
  if (options.structuralMin !== null && options.structuralMin !== undefined) {
    command.push('--structural-min', String(options.structuralMin));
  }
  if (options.mixedBaseMaxRows !== null && options.mixedBaseMaxRows !== undefined) {
    command.push('--mixed-base-max-rows', String(options.mixedBaseMaxRows));
  }
  if (options.fullMixedRowSampleLimit !== null && options.fullMixedRowSampleLimit !== undefined) {
    command.push('--full-mixed-row-sample-limit', String(options.fullMixedRowSampleLimit));
  }
  if (options.structuralLiftTopRows !== null && options.structuralLiftTopRows !== undefined) {
    command.push('--structural-lift-top-rows', String(options.structuralLiftTopRows));
  }
  if (options.structuralLiftFamilyLimit !== null && options.structuralLiftFamilyLimit !== undefined) {
    command.push('--structural-lift-family-limit', String(options.structuralLiftFamilyLimit));
  }
  if (options.matchingPatternPrime !== null && options.matchingPatternPrime !== undefined) {
    command.push('--matching-pattern-prime', String(options.matchingPatternPrime));
  }
  if (options.matchingPatternTopRows !== null && options.matchingPatternTopRows !== undefined) {
    command.push('--matching-pattern-top-rows', String(options.matchingPatternTopRows));
  }
  if (options.matchingPatternPairSampleLimit !== null && options.matchingPatternPairSampleLimit !== undefined) {
    command.push('--matching-pattern-pair-sample-limit', String(options.matchingPatternPairSampleLimit));
  }
  if (options.endpointMonotonicity) {
    command.push('--endpoint-monotonicity');
  }
  return command.join(' ');
}

function buildFleetDispatchApplyCommand(problemId, fleetId, actionId, options = {}) {
  const command = [
    'erdos',
    'number-theory',
    'dispatch-fleet',
    String(problemId),
    '--fleet',
    String(fleetId),
    '--apply',
    '--action',
    String(actionId),
  ];
  if (options.reviewAfterHours !== null && options.reviewAfterHours !== undefined) {
    command.push('--review-after-hours', String(options.reviewAfterHours));
  }
  if (options.strategyId) {
    command.push('--strategy', String(options.strategyId));
  }
  return command.join(' ');
}

function getP848RemoteBaseProfilePath(provider = 'ssh') {
  const filename = provider === 'brev'
    ? 'brev_h100_search_profile.json'
    : 'windows_rtx4090_search_profile.json';
  return path.join(repoRoot, 'research', 'frontier-engine', 'experiments', 'p848-anchor-ladder', filename);
}

function uniquePositiveIntegers(values = []) {
  return Array.from(new Set(
    (Array.isArray(values) ? values : [])
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value > 0),
  ));
}

function buildP848FleetAssignments(problem, fleet, bridgeSnapshot, options = {}) {
  const strategyId = String(options.strategyId ?? 'ladder_cover_v1').trim() || 'ladder_cover_v1';
  const remoteIds = Array.isArray(fleet?.remoteIds) ? fleet.remoteIds : [];
  const bridgeState = bridgeSnapshot?.bridgeCurrentState ?? {};
  const defaultProvider = fleet?.provider === 'brev' ? 'brev' : 'ssh';
  const baseProfile = readJsonIfPresent(getP848RemoteBaseProfilePath(defaultProvider)) ?? {};
  const centers = uniquePositiveIntegers([
    bridgeState.current_family_aware_leader?.continuation,
    ...(Array.isArray(bridgeState.top_gpu_tie_class) ? bridgeState.top_gpu_tie_class : []),
    bridgeState.strongest_completed_structured_tail?.continuation,
    baseProfile.base_tail ?? 332,
  ]);
  const selectedCenters = centers.length > 0 ? centers : [332];
  const baseThreshold = Number(baseProfile.direct_threshold ?? 250000001);
  const baseMax = Number(baseProfile.direct_max ?? 250075000);
  const windowSpan = Math.max(1, baseMax - baseThreshold + 1);
  const offsetPatterns = [
    [0, -10, -5, 5, 10],
    [0, -15, -5, 5, 15],
    [0, -20, -10, 10, 20],
    [0, -25, -10, 10, 25],
  ];
  const roundDeltas = [0, 4, 8];
  const topKSteps = [0, 4, 8];

  return remoteIds.map((remoteId, index) => {
    const centerIndex = index % selectedCenters.length;
    const windowIndex = Math.floor(index / selectedCenters.length);
    const center = selectedCenters[centerIndex];
    const offsets = offsetPatterns[index % offsetPatterns.length];
    const ladderRounds = Number(baseProfile.ladder_rounds ?? 18) + roundDeltas[windowIndex % roundDeltas.length];
    const threshold = baseThreshold + (windowIndex * windowSpan);
    const directMax = threshold + windowSpan - 1;
    const topK = Number(baseProfile.top_k ?? 16) + topKSteps[windowIndex % topKSteps.length];
    const profile = {
      ...baseProfile,
      profile_id: `${baseProfile.profile_id ?? 'p848_anchor_ladder_fleet'}__${strategyId}__${fleet.fleetId}__${remoteId}`,
      base_tail: center,
      perturb_offsets: offsets,
      ladder_rounds: ladderRounds,
      direct_threshold: threshold,
      direct_max: directMax,
      top_k: topK,
      notes: [
        ...((Array.isArray(baseProfile.notes) ? baseProfile.notes : [])),
        `Fleet schedule ${strategyId} assigned to ${remoteId}.`,
        `Center tail ${center}; window ${threshold}..${directMax}; perturb offsets ${offsets.join(', ')}.`,
      ],
    };
    return {
      remoteId,
      strategyId,
      assignmentIndex: index,
      center,
      centerIndex,
      windowIndex,
      directThreshold: threshold,
      directMax,
      ladderRounds,
      perturbOffsets: offsets,
      topK,
      profile,
    };
  });
}

function ensureRemoteDirectory(remoteSpec, remoteDir, workspaceRoot = getWorkspaceRoot()) {
  const command = isBrevRemote(remoteSpec)
    ? `mkdir -p ${quotePosixShellArg(remoteDir)}`
    : `cmd /c if not exist ${quoteRemoteWindowsPath(remoteDir)} mkdir ${quoteRemoteWindowsPath(remoteDir)}`;
  return runRemoteCommandCapture(remoteSpec, command, { cwd: workspaceRoot });
}

function prepareP848RemoteProfileOverride(action, assignment, workspaceRoot = getWorkspaceRoot(), options = {}) {
  const remoteSpec = {
    provider: action.remoteProvider ?? 'ssh',
    instanceName: action.remoteInstanceName ?? null,
    sshHost: action.remoteHost,
    engineRoot: action.remoteEngineRoot,
    pythonCommand: action.remotePythonCommand,
  };
  const launchId = String(options.launchId ?? Date.now());
  const localDir = path.join(
    workspaceRoot,
    '.erdos',
    'frontier',
    'fleet-profiles',
    String(options.fleetId ?? 'fleet'),
    launchId,
  );
  ensureDir(localDir);
  const filename = `${assignment.remoteId}.json`;
  const localProfilePath = path.join(localDir, filename);
  writeJson(localProfilePath, assignment.profile);

  const remoteProfileDir = joinRemotePath(
    remoteSpec,
    action.remoteEngineRoot,
    'experiments',
    'p848-anchor-ladder',
    'fleet-profiles',
    String(options.fleetId ?? 'fleet'),
    launchId,
  );
  const ensureRemoteDir = ensureRemoteDirectory(remoteSpec, remoteProfileDir, workspaceRoot);
  if (!ensureRemoteDir.ok) {
    return {
      ok: false,
      error: ensureRemoteDir.stderr ?? 'Failed to prepare remote profile directory.',
      localProfilePath,
      remoteProfileDir,
    };
  }

  const remoteProfilePath = joinRemotePath(remoteSpec, remoteProfileDir, filename);
  const copyResult = runRemoteCopyToCapture(remoteSpec, localProfilePath, remoteProfilePath, {
    cwd: workspaceRoot,
  });
  if (!copyResult.ok) {
    return {
      ok: false,
      error: copyResult.stderr ?? 'Failed to copy remote fleet profile.',
      localProfilePath,
      remoteProfilePath,
    };
  }

  const remoteCliPath = joinRemotePath(remoteSpec, action.remoteEngineRoot, 'src', 'frontier_engine', 'cli.py');
  const remoteCommand = isBrevRemote(remoteSpec)
    ? `${action.remotePythonCommand} ${quotePosixShellArg(remoteCliPath)} export-p848-profile-bundle ${quotePosixShellArg(remoteProfilePath)}`
    : `${action.remotePythonCommand} ${quoteRemoteWindowsPath(remoteCliPath)} export-p848-profile-bundle ${quoteRemoteWindowsPath(remoteProfilePath)}`;

  return {
    ok: true,
    localProfilePath,
    remoteProfilePath,
    remoteCommand,
    assignment,
  };
}

function buildRemoteGpuExecutionSpec(remoteSpec, remoteCommand) {
  if (isBrevRemote(remoteSpec)) {
    return {
      executable: 'brev',
      args: ['exec', remoteSpec.instanceName ?? remoteSpec.sshHost, `bash -lc ${quotePosixShellArg(remoteCommand)}`],
      commandLine: formatCommandLine('brev', ['exec', remoteSpec.instanceName ?? remoteSpec.sshHost, `bash -lc ${quotePosixShellArg(remoteCommand)}`]),
    };
  }
  return {
    executable: 'ssh',
    args: [remoteSpec.sshHost, remoteCommand],
    commandLine: formatCommandLine('ssh', [remoteSpec.sshHost, remoteCommand]),
  };
}

function getP848ClaimPassPlan(problem) {
  if (String(problem?.problemId ?? '') !== '848') {
    return {
      available: false,
      actionId: 'claim_pass_refresh',
      reason: `No claim-pass dispatch lane is registered for problem ${problem?.problemId ?? '(unknown)'}.`,
    };
  }

  const claimPass = getProblemClaimPassSnapshot(problem);
  const recommendations = Array.isArray(claimPass.recommendations) ? claimPass.recommendations : [];
  const topRecommendation = recommendations[0] ?? null;
  const supportedClaims = claimPass.summary?.claims?.supported ?? 0;
  const actionableClaims = claimPass.summary?.claims?.actionable ?? 0;

  return {
    available: (claimPass.claimAssessments?.length ?? 0) > 0,
    actionId: 'claim_pass_refresh',
    mode: 'theorem',
    source: 'claim_pass',
    reason: topRecommendation
      ? `${topRecommendation.recommendation_id}: ${topRecommendation.reason}`
      : `Claim pass currently tracks ${supportedClaims} supported and ${actionableClaims} actionable claim objects.`,
    commandLine: `erdos problem claim-pass-refresh ${problem.problemId}`,
    claimPass,
    recommendations,
  };
}

function getP848FormalizationPlan(problem) {
  if (String(problem?.problemId ?? '') !== '848') {
    return {
      available: false,
      actionId: 'formalization_refresh',
      reason: `No formalization dispatch lane is registered for problem ${problem?.problemId ?? '(unknown)'}.`,
    };
  }

  const formalization = getProblemFormalizationSnapshot(problem);
  const target = formalization.currentTarget ?? null;

  return {
    available: Boolean(target?.focusId),
    actionId: 'formalization_refresh',
    mode: 'theorem',
    source: 'formalization',
    reason: target?.whyNow
      ?? target?.summary
      ?? `Formalization currently targets ${target?.title ?? 'the top theorem-facing packet'}.`,
    commandLine: `erdos problem formalization-refresh ${problem.problemId}`,
    formalization,
  };
}

function getP848FormalizationWorkPlan(problem) {
  if (String(problem?.problemId ?? '') !== '848') {
    return {
      available: false,
      actionId: 'formalization_work_refresh',
      reason: `No formalization-work dispatch lane is registered for problem ${problem?.problemId ?? '(unknown)'}.`,
    };
  }

  const formalizationWork = getProblemFormalizationWorkSnapshot(problem);
  const target = formalizationWork.currentWork ?? null;

  return {
    available: Boolean(target?.focusId),
    actionId: 'formalization_work_refresh',
    mode: 'theorem',
    source: 'formalization_work',
    reason: target?.summary
      ?? target?.why
      ?? `Formalization work currently targets ${target?.title ?? 'the top theorem work packet'}.`,
    commandLine: `erdos problem formalization-work-refresh ${problem.problemId}`,
    formalizationWork,
  };
}

function getP848StructuralVerifierAuditPlan(problemId, options = {}) {
  if (String(problemId) !== '848') {
    return {
      available: false,
      actionId: 'structural_verifier_audit',
      reason: `No structural verifier audit lane is registered for problem ${problemId}.`,
    };
  }

  const scriptPath = getPackFile(problemId, 'compute/problem848_external_structural_audit.mjs');
  const jsonPath = getPackFile(problemId, 'EXTERNAL_STRUCTURAL_VERIFIER_AUDIT.json');
  const markdownPath = getPackFile(problemId, 'EXTERNAL_STRUCTURAL_VERIFIER_AUDIT.md');
  const sourceDir = path.resolve(options.externalSourceDir ?? process.env.P848_EXTERNAL_SOURCE_DIR ?? '/tmp/hjyuh-erdos-848');
  const sourceAvailable = fs.existsSync(sourceDir) && fs.statSync(sourceDir).isDirectory();
  const latestAudit = readJsonIfPresent(jsonPath);

  return {
    available: fs.existsSync(scriptPath),
    actionId: 'structural_verifier_audit',
    mode: 'cpu',
    source: 'external_structural_verifier_audit',
    reason: sourceAvailable
      ? 'Audit the external outsider-clique verifier for promotion blockers before importing any finite-coverage claim.'
      : `External source tree is not present at ${sourceDir}; the audit lane will record the missing-source blocker.`,
    scriptPath,
    sourceDir,
    sourceAvailable,
    jsonPath,
    markdownPath,
    latestAuditStatus: latestAudit?.status ?? null,
    latestAuditSummary: latestAudit?.summary ?? null,
    commandLine: formatCommandLine('node', [
      scriptPath,
      '--source-dir',
      sourceDir,
      '--json-output',
      jsonPath,
      '--markdown-output',
      markdownPath,
    ]),
    applyCommand: buildDispatchApplyCommand(problemId, 'structural_verifier_audit', {
      ...options,
      externalSourceDir: sourceDir,
    }),
  };
}

function getP848BaseSideScoutPlan(problemId, options = {}) {
  if (String(problemId) !== '848') {
    return {
      available: false,
      actionId: 'base_side_scout',
      reason: `No base-side scout lane is registered for problem ${problemId}.`,
    };
  }

  const scriptPath = getPackFile(problemId, 'compute/problem848_base_side_scout.mjs');
  const jsonPath = getPackFile(problemId, 'BASE_SIDE_SCOUT.json');
  const markdownPath = getPackFile(problemId, 'BASE_SIDE_SCOUT.md');
  const latestScout = readJsonIfPresent(jsonPath);
  const max = parsePositiveInteger(options.baseSideMax) ?? latestScout?.parameters?.maxN ?? 2000;

  return {
    available: fs.existsSync(scriptPath),
    actionId: 'base_side_scout',
    mode: 'cpu',
    source: 'structural_base_side_scout',
    reason: 'Compare 7 mod 25 and 18 mod 25 base compatibility on a bounded interval before trusting one-sided structural masks.',
    scriptPath,
    max,
    jsonPath,
    markdownPath,
    latestScoutStatus: latestScout?.status ?? null,
    latestScoutSummary: latestScout?.summary ?? null,
    commandLine: formatCommandLine('node', [
      scriptPath,
      '--max',
      String(max),
      '--json-output',
      jsonPath,
      '--markdown-output',
      markdownPath,
    ]),
    applyCommand: buildDispatchApplyCommand(problemId, 'base_side_scout', {
      ...options,
      baseSideMax: max,
    }),
  };
}

function getP848StructuralTwoSideScoutPlan(problemId, options = {}) {
  if (String(problemId) !== '848') {
    return {
      available: false,
      actionId: 'structural_two_side_scout',
      reason: `No two-sided structural scout lane is registered for problem ${problemId}.`,
    };
  }

  const scriptPath = getPackFile(problemId, 'compute/problem848_structural_two_side_scout.mjs');
  const jsonPath = getPackFile(problemId, 'STRUCTURAL_TWO_SIDE_SCOUT.json');
  const markdownPath = getPackFile(problemId, 'STRUCTURAL_TWO_SIDE_SCOUT.md');
  const latestScout = readJsonIfPresent(jsonPath);
  const max = parsePositiveInteger(options.structuralMax) ?? latestScout?.parameters?.maxN ?? 10000;
  const minStructuralN = parsePositiveInteger(options.structuralMin) ?? latestScout?.parameters?.minStructuralN ?? 7307;

  return {
    available: fs.existsSync(scriptPath) && minStructuralN <= max,
    actionId: 'structural_two_side_scout',
    mode: 'cpu',
    source: 'structural_two_side_scout',
    reason: 'Run the repo-owned outsider-clique structural inequality with both 7 mod 25 and 18 mod 25 base sides before promoting any external verifier idea.',
    scriptPath,
    max,
    minStructuralN,
    jsonPath,
    markdownPath,
    latestStructuralStatus: latestScout?.status ?? null,
    latestStructuralSummary: latestScout?.summary ?? null,
    commandLine: formatCommandLine('node', [
      scriptPath,
      '--max',
      String(max),
      '--min-structural-n',
      String(minStructuralN),
      '--json-output',
      jsonPath,
      '--markdown-output',
      markdownPath,
    ]),
    applyCommand: buildDispatchApplyCommand(problemId, 'structural_two_side_scout', {
      ...options,
      structuralMax: max,
      structuralMin: minStructuralN,
    }),
  };
}

function getP848MixedBaseFailureScoutPlan(problemId, options = {}) {
  if (String(problemId) !== '848') {
    return {
      available: false,
      actionId: 'mixed_base_failure_scout',
      reason: `No mixed-base failure scout lane is registered for problem ${problemId}.`,
    };
  }

  const scriptPath = getPackFile(problemId, 'compute/problem848_mixed_base_failure_scout.mjs');
  const structuralJsonPath = getPackFile(problemId, 'STRUCTURAL_TWO_SIDE_SCOUT.json');
  const jsonPath = getPackFile(problemId, 'MIXED_BASE_FAILURE_SCOUT.json');
  const markdownPath = getPackFile(problemId, 'MIXED_BASE_FAILURE_SCOUT.md');
  const structuralScout = readJsonIfPresent(structuralJsonPath);
  const latestScout = readJsonIfPresent(jsonPath);
  const maxRows = parsePositiveInteger(options.mixedBaseMaxRows) ?? latestScout?.parameters?.maxRows ?? 40;

  return {
    available: fs.existsSync(scriptPath) && Boolean(structuralScout),
    actionId: 'mixed_base_failure_scout',
    mode: 'cpu',
    source: 'mixed_base_failure_scout',
    reason: structuralScout
      ? 'Sharpen the failed union-base structural rows by solving the exact mixed-base clique induced by both principal sides.'
      : 'Run the two-sided structural scout first; mixed-base failure scouting needs STRUCTURAL_TWO_SIDE_SCOUT.json.',
    scriptPath,
    structuralJsonPath,
    maxRows,
    jsonPath,
    markdownPath,
    latestMixedBaseStatus: latestScout?.status ?? null,
    latestMixedBaseSummary: latestScout?.summary ?? null,
    commandLine: formatCommandLine('node', [
      scriptPath,
      '--structural-json',
      structuralJsonPath,
      '--max-rows',
      String(maxRows),
      '--json-output',
      jsonPath,
      '--markdown-output',
      markdownPath,
    ]),
    applyCommand: buildDispatchApplyCommand(problemId, 'mixed_base_failure_scout', {
      ...options,
      mixedBaseMaxRows: maxRows,
    }),
  };
}

function getP848FullMixedBaseStructuralVerifierPlan(problemId, options = {}) {
  if (String(problemId) !== '848') {
    return {
      available: false,
      actionId: 'full_mixed_base_structural_verifier',
      reason: `No full mixed-base structural verifier lane is registered for problem ${problemId}.`,
    };
  }

  const scriptPath = getPackFile(problemId, 'compute/problem848_full_mixed_base_structural_verifier.mjs');
  const jsonPath = getPackFile(problemId, 'FULL_MIXED_BASE_STRUCTURAL_VERIFIER.json');
  const markdownPath = getPackFile(problemId, 'FULL_MIXED_BASE_STRUCTURAL_VERIFIER.md');
  const latestVerifier = readJsonIfPresent(jsonPath);
  const max = parsePositiveInteger(options.structuralMax) ?? latestVerifier?.parameters?.maxN ?? 10000;
  const minStructuralN = parsePositiveInteger(options.structuralMin) ?? latestVerifier?.parameters?.minStructuralN ?? 7307;
  const rowSampleLimit = parsePositiveInteger(options.fullMixedRowSampleLimit)
    ?? latestVerifier?.parameters?.rowSampleLimit
    ?? 200;

  return {
    available: fs.existsSync(scriptPath) && minStructuralN <= max,
    actionId: 'full_mixed_base_structural_verifier',
    mode: 'cpu',
    source: 'full_mixed_base_structural_verifier',
    reason: 'Certify the bounded two-sided structural verifier by using the safe union bound where it already passes and exact mixed-base clique checks for every threatening active outsider where it does not.',
    scriptPath,
    max,
    minStructuralN,
    rowSampleLimit,
    jsonPath,
    markdownPath,
    latestFullMixedStructuralStatus: latestVerifier?.status ?? null,
    latestFullMixedStructuralSummary: latestVerifier?.summary ?? null,
    commandLine: formatCommandLine('node', [
      scriptPath,
      '--max',
      String(max),
      '--min-structural-n',
      String(minStructuralN),
      '--row-sample-limit',
      String(rowSampleLimit),
      '--json-output',
      jsonPath,
      '--markdown-output',
      markdownPath,
    ]),
    applyCommand: buildDispatchApplyCommand(problemId, 'full_mixed_base_structural_verifier', {
      ...options,
      structuralMax: max,
      structuralMin: minStructuralN,
      fullMixedRowSampleLimit: rowSampleLimit,
    }),
  };
}

function getP848StructuralLiftMinerPlan(problemId, options = {}) {
  if (String(problemId) !== '848') {
    return {
      available: false,
      actionId: 'structural_lift_miner',
      reason: `No structural lift miner lane is registered for problem ${problemId}.`,
    };
  }

  const scriptPath = getPackFile(problemId, 'compute/problem848_structural_lift_miner.mjs');
  const verifierJsonPath = getPackFile(problemId, 'FULL_MIXED_BASE_STRUCTURAL_VERIFIER.json');
  const jsonPath = getPackFile(problemId, 'STRUCTURAL_LIFT_MINER.json');
  const markdownPath = getPackFile(problemId, 'STRUCTURAL_LIFT_MINER.md');
  const latestMiner = readJsonIfPresent(jsonPath);
  const topRows = parsePositiveInteger(options.structuralLiftTopRows)
    ?? latestMiner?.parameters?.topRows
    ?? 12;
  const familyLimit = parsePositiveInteger(options.structuralLiftFamilyLimit)
    ?? latestMiner?.parameters?.familyLimit
    ?? 20;

  return {
    available: fs.existsSync(scriptPath) && fs.existsSync(verifierJsonPath),
    actionId: 'structural_lift_miner',
    mode: 'cpu',
    source: 'structural_lift_miner',
    reason: fs.existsSync(verifierJsonPath)
      ? 'Mine the full mixed-base structural verifier into theorem-facing lift families, margin profiles, and proof obligations.'
      : 'Run the full mixed-base structural verifier first; structural lift mining needs FULL_MIXED_BASE_STRUCTURAL_VERIFIER.json.',
    scriptPath,
    verifierJsonPath,
    topRows,
    familyLimit,
    jsonPath,
    markdownPath,
    latestStructuralLiftStatus: latestMiner?.status ?? null,
    latestStructuralLiftSummary: latestMiner?.summary ?? null,
    commandLine: formatCommandLine('node', [
      scriptPath,
      '--verifier-json',
      verifierJsonPath,
      '--top-rows',
      String(topRows),
      '--family-limit',
      String(familyLimit),
      '--json-output',
      jsonPath,
      '--markdown-output',
      markdownPath,
    ]),
    applyCommand: buildDispatchApplyCommand(problemId, 'structural_lift_miner', {
      ...options,
      structuralLiftTopRows: topRows,
      structuralLiftFamilyLimit: familyLimit,
    }),
  };
}

function getP848MatchingPatternMinerPlan(problemId, options = {}) {
  if (String(problemId) !== '848') {
    return {
      available: false,
      actionId: 'matching_pattern_miner',
      reason: `No matching-pattern miner lane is registered for problem ${problemId}.`,
    };
  }

  const scriptPath = getPackFile(problemId, 'compute/problem848_matching_pattern_miner.mjs');
  const verifierJsonPath = getPackFile(problemId, 'FULL_MIXED_BASE_STRUCTURAL_VERIFIER.json');
  const defaultJsonPath = getPackFile(problemId, 'MATCHING_PATTERN_MINER.json');
  const defaultMiner = readJsonIfPresent(defaultJsonPath);
  const prime = parsePositiveInteger(options.matchingPatternPrime)
    ?? defaultMiner?.parameters?.targetPrime
    ?? 13;
  const artifactSuffix = prime === 13 ? '' : `_P${prime}`;
  const jsonPath = getPackFile(problemId, `MATCHING_PATTERN_MINER${artifactSuffix}.json`);
  const markdownPath = getPackFile(problemId, `MATCHING_PATTERN_MINER${artifactSuffix}.md`);
  const latestMiner = readJsonIfPresent(jsonPath);
  const topRows = parsePositiveInteger(options.matchingPatternTopRows)
    ?? latestMiner?.parameters?.topRows
    ?? 12;
  const pairSampleLimit = parsePositiveInteger(options.matchingPatternPairSampleLimit)
    ?? latestMiner?.parameters?.pairSampleLimit
    ?? 24;

  return {
    available: fs.existsSync(scriptPath) && fs.existsSync(verifierJsonPath),
    actionId: 'matching_pattern_miner',
    mode: 'cpu',
    source: 'matching_pattern_miner',
    reason: fs.existsSync(verifierJsonPath)
      ? 'Mine actual missing-cross matching witnesses for the active D-lane prime so the theorem loop can replace Hopcroft-Karp replay with a symbolic residue/block injection.'
      : 'Run the full mixed-base structural verifier first; matching-pattern mining needs FULL_MIXED_BASE_STRUCTURAL_VERIFIER.json.',
    scriptPath,
    verifierJsonPath,
    prime,
    topRows,
    pairSampleLimit,
    jsonPath,
    markdownPath,
    latestMatchingPatternStatus: latestMiner?.status ?? null,
    latestMatchingPatternSummary: latestMiner?.summary ?? null,
    commandLine: formatCommandLine('node', [
      scriptPath,
      '--verifier-json',
      verifierJsonPath,
      '--prime',
      String(prime),
      '--top-rows',
      String(topRows),
      '--pair-sample-limit',
      String(pairSampleLimit),
      '--json-output',
      jsonPath,
      '--markdown-output',
      markdownPath,
    ]),
    applyCommand: buildDispatchApplyCommand(problemId, 'matching_pattern_miner', {
      ...options,
      matchingPatternPrime: prime,
      matchingPatternTopRows: topRows,
      matchingPatternPairSampleLimit: pairSampleLimit,
    }),
  };
}

function buildP848DispatchActions(problem, options = {}, workspaceRoot = getWorkspaceRoot()) {
  const problemId = String(problem.problemId);
  const frontierSnapshot = options.remoteId
    ? getFrontierDoctorSnapshotForRemote(options.remoteId, workspaceRoot)
    : getFrontierDoctorSnapshot(workspaceRoot);
  const bridgePlan = resolveFrontierExecutionPlan('bridgeRefresh848', workspaceRoot, frontierSnapshot);
  const cpuPlan = resolveFrontierExecutionPlan('p848FamilySearchProfile', workspaceRoot, frontierSnapshot);
  const gpuPlan = resolveFrontierExecutionPlan('p848HeavySearchProfile', workspaceRoot, frontierSnapshot);
  const claimPassPlan = getP848ClaimPassPlan(problem);
  const formalizationPlan = getP848FormalizationPlan(problem);
  const formalizationWorkPlan = getP848FormalizationWorkPlan(problem);
  const exactPlan = getP848ExactScoutPlan(problemId, options);
  const exactHandoffPlan = getP848ExactHandoffPlan(problemId);
  const exactFollowupPlan = getP848ExactFollowupLaunchPlan(problemId, options);
  const exactRolloutPlan = getP848ExactFollowupRolloutPlan(problemId, options);
  const structuralVerifierAuditPlan = getP848StructuralVerifierAuditPlan(problemId, options);
  const baseSideScoutPlan = getP848BaseSideScoutPlan(problemId, options);
  const structuralTwoSideScoutPlan = getP848StructuralTwoSideScoutPlan(problemId, options);
  const mixedBaseFailureScoutPlan = getP848MixedBaseFailureScoutPlan(problemId, options);
  const fullMixedBaseStructuralVerifierPlan = getP848FullMixedBaseStructuralVerifierPlan(problemId, options);
  const structuralLiftMinerPlan = getP848StructuralLiftMinerPlan(problemId, options);
  const matchingPatternMinerPlan = getP848MatchingPatternMinerPlan(problemId, options);

  return [
    {
      actionId: 'bridge_refresh',
      title: 'Refresh canonical search/theorem bridge',
      kind: 'frontier_bridge',
      available: bridgePlan.available,
      mode: bridgePlan.mode,
      source: bridgePlan.source,
      reason: bridgePlan.reason,
      commandLine: bridgePlan.commandLine ?? 'erdos number-theory bridge-refresh 848',
      executable: bridgePlan.executable ?? null,
      args: bridgePlan.args ?? [],
      applyCommand: buildDispatchApplyCommand(problemId, 'bridge_refresh', options),
    },
    {
      actionId: 'cpu_family_search',
      title: 'Run managed CPU family-search pass',
      kind: 'frontier_search',
      available: cpuPlan.available,
      mode: cpuPlan.mode,
      source: cpuPlan.source,
      reason: cpuPlan.reason,
      profilePath: cpuPlan.profilePath ?? null,
      commandLine: cpuPlan.commandLine ?? null,
      executable: cpuPlan.executable ?? null,
      args: cpuPlan.args ?? [],
      applyCommand: buildDispatchApplyCommand(problemId, 'cpu_family_search', options),
    },
    {
      actionId: 'gpu_profile_sweep',
      title: 'Run managed GPU ladder sweep',
      kind: 'frontier_search',
      available: gpuPlan.available,
      mode: gpuPlan.mode,
      source: gpuPlan.source,
      reason: gpuPlan.reason,
      profilePath: gpuPlan.profilePath ?? null,
      commandLine: gpuPlan.commandLine ?? null,
      executable: gpuPlan.executable ?? null,
      args: gpuPlan.args ?? [],
      laneId: gpuPlan.laneId ?? null,
      remoteProvider: gpuPlan.remoteProvider ?? null,
      remoteInstanceName: gpuPlan.remoteInstanceName ?? null,
      remoteHost: gpuPlan.remoteHost ?? null,
      remoteCommand: gpuPlan.remoteCommand ?? null,
      remoteEngineRoot: gpuPlan.remoteEngineRoot ?? null,
      remotePythonCommand: gpuPlan.remotePythonCommand ?? null,
      applyCommand: buildDispatchApplyCommand(problemId, 'gpu_profile_sweep', options),
    },
    {
      actionId: 'formalization_work_refresh',
      title: 'Refresh theorem formalization work packet',
      kind: 'theorem_formalization_work',
      available: formalizationWorkPlan.available,
      mode: formalizationWorkPlan.mode ?? 'theorem',
      source: formalizationWorkPlan.source ?? 'formalization_work',
      reason: formalizationWorkPlan.reason,
      formalizationWork: formalizationWorkPlan.formalizationWork ?? null,
      commandLine: formalizationWorkPlan.commandLine ?? null,
      applyCommand: buildDispatchApplyCommand(problemId, 'formalization_work_refresh', options),
    },
    {
      actionId: 'formalization_refresh',
      title: 'Refresh theorem formalization packet',
      kind: 'theorem_formalization',
      available: formalizationPlan.available,
      mode: formalizationPlan.mode ?? 'theorem',
      source: formalizationPlan.source ?? 'formalization',
      reason: formalizationPlan.reason,
      formalization: formalizationPlan.formalization ?? null,
      commandLine: formalizationPlan.commandLine ?? null,
      applyCommand: buildDispatchApplyCommand(problemId, 'formalization_refresh', options),
    },
    {
      actionId: 'claim_pass_refresh',
      title: 'Refresh claim-pass verdicts and theorem recommendations',
      kind: 'theorem_claims',
      available: claimPassPlan.available,
      mode: claimPassPlan.mode ?? 'theorem',
      source: claimPassPlan.source ?? 'claim_pass',
      reason: claimPassPlan.reason,
      claimPass: claimPassPlan.claimPass ?? null,
      recommendations: claimPassPlan.recommendations ?? [],
      commandLine: claimPassPlan.commandLine ?? null,
      applyCommand: buildDispatchApplyCommand(problemId, 'claim_pass_refresh', options),
    },
    {
      actionId: 'structural_verifier_audit',
      title: 'Audit external structural verifier import',
      kind: 'structural_verifier_audit',
      available: structuralVerifierAuditPlan.available,
      mode: structuralVerifierAuditPlan.mode ?? 'cpu',
      source: structuralVerifierAuditPlan.source ?? 'external_structural_verifier_audit',
      reason: structuralVerifierAuditPlan.reason,
      scriptPath: structuralVerifierAuditPlan.scriptPath ?? null,
      sourceDir: structuralVerifierAuditPlan.sourceDir ?? null,
      sourceAvailable: Boolean(structuralVerifierAuditPlan.sourceAvailable),
      jsonPath: structuralVerifierAuditPlan.jsonPath ?? null,
      markdownPath: structuralVerifierAuditPlan.markdownPath ?? null,
      latestAuditStatus: structuralVerifierAuditPlan.latestAuditStatus ?? null,
      latestAuditSummary: structuralVerifierAuditPlan.latestAuditSummary ?? null,
      commandLine: structuralVerifierAuditPlan.commandLine ?? null,
      applyCommand: structuralVerifierAuditPlan.applyCommand ?? buildDispatchApplyCommand(problemId, 'structural_verifier_audit', options),
    },
    {
      actionId: 'base_side_scout',
      title: 'Run bounded base-side compatibility scout',
      kind: 'structural_base_side_scout',
      available: baseSideScoutPlan.available,
      mode: baseSideScoutPlan.mode ?? 'cpu',
      source: baseSideScoutPlan.source ?? 'structural_base_side_scout',
      reason: baseSideScoutPlan.reason,
      scriptPath: baseSideScoutPlan.scriptPath ?? null,
      max: baseSideScoutPlan.max ?? null,
      jsonPath: baseSideScoutPlan.jsonPath ?? null,
      markdownPath: baseSideScoutPlan.markdownPath ?? null,
      latestScoutStatus: baseSideScoutPlan.latestScoutStatus ?? null,
      latestScoutSummary: baseSideScoutPlan.latestScoutSummary ?? null,
      commandLine: baseSideScoutPlan.commandLine ?? null,
      applyCommand: baseSideScoutPlan.applyCommand ?? buildDispatchApplyCommand(problemId, 'base_side_scout', options),
    },
    {
      actionId: 'structural_two_side_scout',
      title: 'Run two-sided structural verifier scout',
      kind: 'structural_two_side_scout',
      available: structuralTwoSideScoutPlan.available,
      mode: structuralTwoSideScoutPlan.mode ?? 'cpu',
      source: structuralTwoSideScoutPlan.source ?? 'structural_two_side_scout',
      reason: structuralTwoSideScoutPlan.reason,
      scriptPath: structuralTwoSideScoutPlan.scriptPath ?? null,
      max: structuralTwoSideScoutPlan.max ?? null,
      minStructuralN: structuralTwoSideScoutPlan.minStructuralN ?? null,
      jsonPath: structuralTwoSideScoutPlan.jsonPath ?? null,
      markdownPath: structuralTwoSideScoutPlan.markdownPath ?? null,
      latestStructuralStatus: structuralTwoSideScoutPlan.latestStructuralStatus ?? null,
      latestStructuralSummary: structuralTwoSideScoutPlan.latestStructuralSummary ?? null,
      commandLine: structuralTwoSideScoutPlan.commandLine ?? null,
      applyCommand: structuralTwoSideScoutPlan.applyCommand ?? buildDispatchApplyCommand(problemId, 'structural_two_side_scout', options),
    },
    {
      actionId: 'mixed_base_failure_scout',
      title: 'Run mixed-base failure scout',
      kind: 'mixed_base_failure_scout',
      available: mixedBaseFailureScoutPlan.available,
      mode: mixedBaseFailureScoutPlan.mode ?? 'cpu',
      source: mixedBaseFailureScoutPlan.source ?? 'mixed_base_failure_scout',
      reason: mixedBaseFailureScoutPlan.reason,
      scriptPath: mixedBaseFailureScoutPlan.scriptPath ?? null,
      structuralJsonPath: mixedBaseFailureScoutPlan.structuralJsonPath ?? null,
      maxRows: mixedBaseFailureScoutPlan.maxRows ?? null,
      jsonPath: mixedBaseFailureScoutPlan.jsonPath ?? null,
      markdownPath: mixedBaseFailureScoutPlan.markdownPath ?? null,
      latestMixedBaseStatus: mixedBaseFailureScoutPlan.latestMixedBaseStatus ?? null,
      latestMixedBaseSummary: mixedBaseFailureScoutPlan.latestMixedBaseSummary ?? null,
      commandLine: mixedBaseFailureScoutPlan.commandLine ?? null,
      applyCommand: mixedBaseFailureScoutPlan.applyCommand ?? buildDispatchApplyCommand(problemId, 'mixed_base_failure_scout', options),
    },
    {
      actionId: 'full_mixed_base_structural_verifier',
      title: 'Run full mixed-base structural verifier',
      kind: 'full_mixed_base_structural_verifier',
      available: fullMixedBaseStructuralVerifierPlan.available,
      mode: fullMixedBaseStructuralVerifierPlan.mode ?? 'cpu',
      source: fullMixedBaseStructuralVerifierPlan.source ?? 'full_mixed_base_structural_verifier',
      reason: fullMixedBaseStructuralVerifierPlan.reason,
      scriptPath: fullMixedBaseStructuralVerifierPlan.scriptPath ?? null,
      max: fullMixedBaseStructuralVerifierPlan.max ?? null,
      minStructuralN: fullMixedBaseStructuralVerifierPlan.minStructuralN ?? null,
      rowSampleLimit: fullMixedBaseStructuralVerifierPlan.rowSampleLimit ?? null,
      jsonPath: fullMixedBaseStructuralVerifierPlan.jsonPath ?? null,
      markdownPath: fullMixedBaseStructuralVerifierPlan.markdownPath ?? null,
      latestFullMixedStructuralStatus: fullMixedBaseStructuralVerifierPlan.latestFullMixedStructuralStatus ?? null,
      latestFullMixedStructuralSummary: fullMixedBaseStructuralVerifierPlan.latestFullMixedStructuralSummary ?? null,
      commandLine: fullMixedBaseStructuralVerifierPlan.commandLine ?? null,
      applyCommand: fullMixedBaseStructuralVerifierPlan.applyCommand ?? buildDispatchApplyCommand(problemId, 'full_mixed_base_structural_verifier', options),
    },
    {
      actionId: 'structural_lift_miner',
      title: 'Run structural lift miner',
      kind: 'structural_lift_miner',
      available: structuralLiftMinerPlan.available,
      mode: structuralLiftMinerPlan.mode ?? 'cpu',
      source: structuralLiftMinerPlan.source ?? 'structural_lift_miner',
      reason: structuralLiftMinerPlan.reason,
      scriptPath: structuralLiftMinerPlan.scriptPath ?? null,
      verifierJsonPath: structuralLiftMinerPlan.verifierJsonPath ?? null,
      topRows: structuralLiftMinerPlan.topRows ?? null,
      familyLimit: structuralLiftMinerPlan.familyLimit ?? null,
      jsonPath: structuralLiftMinerPlan.jsonPath ?? null,
      markdownPath: structuralLiftMinerPlan.markdownPath ?? null,
      latestStructuralLiftStatus: structuralLiftMinerPlan.latestStructuralLiftStatus ?? null,
      latestStructuralLiftSummary: structuralLiftMinerPlan.latestStructuralLiftSummary ?? null,
      commandLine: structuralLiftMinerPlan.commandLine ?? null,
      applyCommand: structuralLiftMinerPlan.applyCommand ?? buildDispatchApplyCommand(problemId, 'structural_lift_miner', options),
    },
    {
      actionId: 'matching_pattern_miner',
      title: 'Run matching pattern miner',
      kind: 'matching_pattern_miner',
      available: matchingPatternMinerPlan.available,
      mode: matchingPatternMinerPlan.mode ?? 'cpu',
      source: matchingPatternMinerPlan.source ?? 'matching_pattern_miner',
      reason: matchingPatternMinerPlan.reason,
      scriptPath: matchingPatternMinerPlan.scriptPath ?? null,
      verifierJsonPath: matchingPatternMinerPlan.verifierJsonPath ?? null,
      prime: matchingPatternMinerPlan.prime ?? null,
      topRows: matchingPatternMinerPlan.topRows ?? null,
      pairSampleLimit: matchingPatternMinerPlan.pairSampleLimit ?? null,
      jsonPath: matchingPatternMinerPlan.jsonPath ?? null,
      markdownPath: matchingPatternMinerPlan.markdownPath ?? null,
      latestMatchingPatternStatus: matchingPatternMinerPlan.latestMatchingPatternStatus ?? null,
      latestMatchingPatternSummary: matchingPatternMinerPlan.latestMatchingPatternSummary ?? null,
      commandLine: matchingPatternMinerPlan.commandLine ?? null,
      applyCommand: matchingPatternMinerPlan.applyCommand ?? buildDispatchApplyCommand(problemId, 'matching_pattern_miner', options),
    },
    {
      actionId: 'exact_interval_scout',
      title: 'Run exact small-N interval scout',
      kind: 'exact_verification',
      available: exactPlan.available,
      mode: exactPlan.mode ?? 'cpu',
      source: exactPlan.source ?? 'exact_verification_lane',
      reason: exactPlan.reason,
      readyInterval: exactPlan.readyInterval ?? null,
      latestDoneInterval: exactPlan.latestDoneInterval ?? null,
      min: exactPlan.min ?? null,
      max: exactPlan.max ?? null,
      scriptPath: exactPlan.scriptPath ?? null,
      endpointMonotonicity: Boolean(exactPlan.endpointMonotonicity),
      backendKind: exactPlan.backendKind ?? 'exact_small_n',
      commandLine: exactPlan.commandLine ?? null,
      applyCommand: buildDispatchApplyCommand(problemId, 'exact_interval_scout', options),
    },
    {
      actionId: 'exact_handoff_bundle',
      title: 'Prepare exact handoff bundle',
      kind: 'exact_handoff',
      available: exactHandoffPlan.available,
      mode: exactHandoffPlan.mode ?? 'cpu',
      source: exactHandoffPlan.source ?? 'search_theorem_bridge',
      reason: exactHandoffPlan.reason,
      bridgePath: exactHandoffPlan.bridgePath ?? null,
      bridgeMarkdownPath: exactHandoffPlan.bridgeMarkdownPath ?? null,
      gpuManifestPath: exactHandoffPlan.gpuManifestPath ?? null,
      commandLine: exactHandoffPlan.commandLine ?? null,
      applyCommand: buildDispatchApplyCommand(problemId, 'exact_handoff_bundle', options),
    },
    {
      actionId: 'exact_followup_launch',
      title: 'Launch exact follow-up from handoff bundle',
      kind: 'exact_followup',
      available: exactFollowupPlan.available,
      mode: exactFollowupPlan.mode ?? 'cpu',
      source: exactFollowupPlan.source ?? 'exact_orchestrator',
      reason: exactFollowupPlan.reason,
      bridgePath: exactFollowupPlan.bridgePath ?? null,
      bridgeMarkdownPath: exactFollowupPlan.bridgeMarkdownPath ?? null,
      gpuManifestPath: exactFollowupPlan.gpuManifestPath ?? null,
      readyInterval: exactFollowupPlan.readyInterval ?? null,
      latestDoneInterval: exactFollowupPlan.latestDoneInterval ?? null,
      min: exactFollowupPlan.min ?? null,
      max: exactFollowupPlan.max ?? null,
      scriptPath: exactFollowupPlan.scriptPath ?? null,
      backendKind: exactFollowupPlan.backendKind ?? 'exact_small_n',
      endpointMonotonicity: Boolean(exactFollowupPlan.endpointMonotonicity),
      commandLine: exactFollowupPlan.commandLine ?? null,
      applyCommand: buildDispatchApplyCommand(problemId, 'exact_followup_launch', options),
    },
    {
      actionId: 'exact_followup_rollout',
      title: 'Advance multiple exact follow-up chunks',
      kind: 'exact_followup',
      available: exactRolloutPlan.available,
      mode: exactRolloutPlan.mode ?? 'cpu',
      source: exactRolloutPlan.source ?? 'exact_orchestrator',
      reason: exactRolloutPlan.reason,
      bridgePath: exactRolloutPlan.bridgePath ?? null,
      bridgeMarkdownPath: exactRolloutPlan.bridgeMarkdownPath ?? null,
      gpuManifestPath: exactRolloutPlan.gpuManifestPath ?? null,
      readyInterval: exactRolloutPlan.readyInterval ?? null,
      latestDoneInterval: exactRolloutPlan.latestDoneInterval ?? null,
      min: exactRolloutPlan.min ?? null,
      max: exactRolloutPlan.max ?? null,
      scriptPath: exactRolloutPlan.scriptPath ?? null,
      backendKind: exactRolloutPlan.backendKind ?? 'exact_small_n_rollout',
      chunkCount: exactRolloutPlan.chunkCount ?? null,
      chunkSize: exactRolloutPlan.chunkSize ?? null,
      rolloutIntervals: exactRolloutPlan.rolloutIntervals ?? [],
      endpointMonotonicity: Boolean(exactRolloutPlan.endpointMonotonicity),
      commandLine: exactRolloutPlan.commandLine ?? null,
      applyCommand: buildDispatchApplyCommand(problemId, 'exact_followup_rollout', options),
    },
  ];
}

function rankP848DispatchActions(actions) {
  const byId = Object.fromEntries(actions.map((action) => [action.actionId, action]));
  const orderedIds = [];

  if (byId.gpu_profile_sweep?.available) {
    orderedIds.push('gpu_profile_sweep');
    if (byId.formalization_work_refresh?.available) {
      orderedIds.push('formalization_work_refresh');
    }
    if (byId.formalization_refresh?.available) {
      orderedIds.push('formalization_refresh');
    }
    if (byId.exact_followup_rollout?.available) {
      orderedIds.push('exact_followup_rollout');
    }
    if (byId.claim_pass_refresh?.available) {
      orderedIds.push('claim_pass_refresh');
    }
    if (byId.exact_followup_launch?.available) {
      orderedIds.push('exact_followup_launch');
    }
    if (byId.exact_handoff_bundle?.available) {
      orderedIds.push('exact_handoff_bundle');
    }
    if (byId.exact_interval_scout?.available) {
      orderedIds.push('exact_interval_scout');
    }
    if (byId.bridge_refresh?.available) {
      orderedIds.push('bridge_refresh');
    }
  } else if (byId.cpu_family_search?.available) {
    orderedIds.push('cpu_family_search');
    if (byId.formalization_work_refresh?.available) {
      orderedIds.push('formalization_work_refresh');
    }
    if (byId.formalization_refresh?.available) {
      orderedIds.push('formalization_refresh');
    }
    if (byId.exact_followup_rollout?.available) {
      orderedIds.push('exact_followup_rollout');
    }
    if (byId.claim_pass_refresh?.available) {
      orderedIds.push('claim_pass_refresh');
    }
    if (byId.exact_followup_launch?.available) {
      orderedIds.push('exact_followup_launch');
    }
    if (byId.exact_handoff_bundle?.available) {
      orderedIds.push('exact_handoff_bundle');
    }
    if (byId.exact_interval_scout?.available) {
      orderedIds.push('exact_interval_scout');
    }
    if (byId.bridge_refresh?.available) {
      orderedIds.push('bridge_refresh');
    }
  } else if (byId.bridge_refresh?.available) {
    orderedIds.push('bridge_refresh');
    if (byId.formalization_work_refresh?.available) {
      orderedIds.push('formalization_work_refresh');
    }
    if (byId.formalization_refresh?.available) {
      orderedIds.push('formalization_refresh');
    }
    if (byId.claim_pass_refresh?.available) {
      orderedIds.push('claim_pass_refresh');
    }
    if (byId.exact_followup_rollout?.available) {
      orderedIds.push('exact_followup_rollout');
    }
    if (byId.exact_followup_launch?.available) {
      orderedIds.push('exact_followup_launch');
    }
    if (byId.exact_handoff_bundle?.available) {
      orderedIds.push('exact_handoff_bundle');
    }
    if (byId.exact_interval_scout?.available) {
      orderedIds.push('exact_interval_scout');
    }
  } else if (byId.exact_interval_scout?.available) {
    if (byId.formalization_work_refresh?.available) {
      orderedIds.push('formalization_work_refresh');
    }
    if (byId.formalization_refresh?.available) {
      orderedIds.push('formalization_refresh');
    }
    orderedIds.push('exact_interval_scout');
    if (byId.claim_pass_refresh?.available) {
      orderedIds.push('claim_pass_refresh');
    }
    if (byId.exact_followup_rollout?.available) {
      orderedIds.push('exact_followup_rollout');
    }
    if (byId.exact_followup_launch?.available) {
      orderedIds.push('exact_followup_launch');
    }
    if (byId.exact_handoff_bundle?.available) {
      orderedIds.push('exact_handoff_bundle');
    }
  } else if (byId.exact_followup_rollout?.available) {
    if (byId.formalization_work_refresh?.available) {
      orderedIds.push('formalization_work_refresh');
    }
    if (byId.formalization_refresh?.available) {
      orderedIds.push('formalization_refresh');
    }
    orderedIds.push('exact_followup_rollout');
    if (byId.claim_pass_refresh?.available) {
      orderedIds.push('claim_pass_refresh');
    }
  } else if (byId.exact_followup_launch?.available) {
    if (byId.formalization_work_refresh?.available) {
      orderedIds.push('formalization_work_refresh');
    }
    if (byId.formalization_refresh?.available) {
      orderedIds.push('formalization_refresh');
    }
    orderedIds.push('exact_followup_launch');
    if (byId.claim_pass_refresh?.available) {
      orderedIds.push('claim_pass_refresh');
    }
  } else if (byId.exact_handoff_bundle?.available) {
    if (byId.formalization_work_refresh?.available) {
      orderedIds.push('formalization_work_refresh');
    }
    if (byId.formalization_refresh?.available) {
      orderedIds.push('formalization_refresh');
    }
    orderedIds.push('exact_handoff_bundle');
    if (byId.claim_pass_refresh?.available) {
      orderedIds.push('claim_pass_refresh');
    }
  } else if (byId.formalization_work_refresh?.available) {
    orderedIds.push('formalization_work_refresh');
    if (byId.formalization_refresh?.available) {
      orderedIds.push('formalization_refresh');
    }
    if (byId.claim_pass_refresh?.available) {
      orderedIds.push('claim_pass_refresh');
    }
  } else if (byId.formalization_refresh?.available) {
    orderedIds.push('formalization_refresh');
    if (byId.claim_pass_refresh?.available) {
      orderedIds.push('claim_pass_refresh');
    }
  } else if (byId.claim_pass_refresh?.available) {
    orderedIds.push('claim_pass_refresh');
  }

  for (const structuralId of [
    'structural_verifier_audit',
    'base_side_scout',
    'structural_two_side_scout',
    'mixed_base_failure_scout',
    'full_mixed_base_structural_verifier',
    'structural_lift_miner',
    'matching_pattern_miner',
  ]) {
    if (!byId[structuralId]?.available || orderedIds.includes(structuralId)) {
      continue;
    }
    const firstExactIndex = orderedIds
      .map((id, index) => ({ id, index }))
      .filter(({ id }) => [
        'exact_followup_rollout',
        'exact_followup_launch',
        'exact_handoff_bundle',
        'exact_interval_scout',
      ].includes(id))
      .map(({ index }) => index)[0] ?? -1;
    if (firstExactIndex >= 0) {
      orderedIds.splice(firstExactIndex, 0, structuralId);
    } else {
      const anchorIndex = Math.max(
        orderedIds.lastIndexOf('base_side_scout'),
        orderedIds.lastIndexOf('structural_two_side_scout'),
        orderedIds.lastIndexOf('mixed_base_failure_scout'),
        orderedIds.lastIndexOf('full_mixed_base_structural_verifier'),
        orderedIds.lastIndexOf('structural_lift_miner'),
        orderedIds.lastIndexOf('matching_pattern_miner'),
        orderedIds.lastIndexOf('structural_verifier_audit'),
        orderedIds.lastIndexOf('claim_pass_refresh'),
        orderedIds.lastIndexOf('formalization_refresh'),
        orderedIds.lastIndexOf('formalization_work_refresh'),
      );
      if (anchorIndex >= 0) {
        orderedIds.splice(anchorIndex + 1, 0, structuralId);
      } else {
        orderedIds.push(structuralId);
      }
    }
  }

  return actions
    .map((action) => ({
      ...action,
      priority: orderedIds.indexOf(action.actionId) >= 0 ? orderedIds.indexOf(action.actionId) + 1 : null,
      primary: orderedIds[0] === action.actionId,
    }))
    .sort((left, right) => {
      const leftPriority = left.priority ?? Number.MAX_SAFE_INTEGER;
      const rightPriority = right.priority ?? Number.MAX_SAFE_INTEGER;
      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }
      return left.actionId.localeCompare(right.actionId);
    });
}

function summarizeP848Dispatch(primaryAction) {
  if (!primaryAction) {
    return 'No orchestrated frontier action is currently available.';
  }
  if (primaryAction.actionId === 'gpu_profile_sweep') {
    return 'GPU ladder sweep is the highest-value live move, with exact interval scouting still available as the bounded-verification follow-up.';
  }
  if (primaryAction.actionId === 'cpu_family_search') {
    return 'Managed CPU family search is the best live move, with exact interval scouting still available on the verification side.';
  }
  if (primaryAction.actionId === 'bridge_refresh') {
    return 'Bridge refresh is the lightest frontier action available right now, while the exact interval scout remains available as a secondary lane.';
  }
  if (primaryAction.actionId === 'claim_pass_refresh') {
    return 'Claim-pass refresh is the live theorem-search move right now, turning the current bridge and exact base into explicit claim verdicts and recommendations.';
  }
  if (primaryAction.actionId === 'structural_verifier_audit') {
    return 'Structural verifier audit is the live finite-gap move, checking whether external outsider-clique computation is safe to import or must stay blocked.';
  }
  if (primaryAction.actionId === 'base_side_scout') {
    return 'Base-side scout is the live structural move, checking whether one-sided 7 mod 25 base masks survive comparison with the 18 mod 25 side.';
  }
  if (primaryAction.actionId === 'formalization_work_refresh') {
    return 'Formalization-work refresh is the live theorem move right now, turning the top formalization target into one concrete packet with current evidence, discharged work, and remaining gaps.';
  }
  if (primaryAction.actionId === 'formalization_refresh') {
    return 'Formalization refresh is the live theorem move right now, turning the strongest supported claim-pass recommendation into a concrete proof-obligation packet.';
  }
  if (primaryAction.actionId === 'exact_interval_scout') {
    return 'The exact interval scout is the live next move because no frontier-search runtime is currently ready.';
  }
  if (primaryAction.actionId === 'exact_followup_launch') {
    return 'The exact follow-up launcher can now package the live bridge context and run the ready bounded exact backend in one step.';
  }
  if (primaryAction.actionId === 'exact_followup_rollout') {
    return 'The exact rollout can advance several contiguous bounded exact chunks in one supervised move while preserving canonical promotion after each chunk.';
  }
  if (primaryAction.actionId === 'exact_handoff_bundle') {
    return 'The canonical bridge is already strong enough to package an exact-follow-up bundle without rerunning search first.';
  }
  if (primaryAction.actionId === 'matching_pattern_miner') {
    return 'Matching-pattern mining is the live theorem-lane move, extracting actual missing-cross matching witnesses for the active D-lane prime.';
  }
  return primaryAction.reason ?? 'Dispatch summary unavailable.';
}

export function getNumberTheoryDispatchSnapshot(problem, options = {}, workspaceRoot = getWorkspaceRoot()) {
  if (String(problem.problemId) !== '848') {
    return {
      available: false,
      problemId: problem.problemId,
      error: `No orchestrated frontier dispatch is registered for problem ${problem.problemId}.`,
    };
  }

  if (options.remoteId) {
    const remoteSnapshot = getFrontierDoctorSnapshotForRemote(options.remoteId, workspaceRoot);
    if (!remoteSnapshot.selectedRemoteFound) {
      return {
        available: false,
        problemId: problem.problemId,
        error: `Unknown frontier remote: ${options.remoteId}`,
      };
    }
  }

  const bridge = getNumberTheoryBridgeSnapshot(problem);
  const actions = rankP848DispatchActions(buildP848DispatchActions(problem, options, workspaceRoot));
  const primaryAction = actions.find((action) => action.primary) ?? null;
  const claimPassAction = actions.find((action) => action.actionId === 'claim_pass_refresh') ?? null;
  const formalizationWorkAction = actions.find((action) => action.actionId === 'formalization_work_refresh') ?? null;
  const formalizationAction = actions.find((action) => action.actionId === 'formalization_refresh') ?? null;

  return {
    available: true,
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    problemId: problem.problemId,
    displayName: problem.displayName,
    remoteId: options.remoteId ?? null,
    activeRoute: bridge.activeRoute,
    currentBridgeState: bridge.bridgeCurrentState,
    bridgeRefreshCommand: bridge.bridgeRefreshCommand,
    claimPass: claimPassAction?.claimPass ?? getProblemClaimPassSnapshot(problem),
    formalizationWork: formalizationWorkAction?.formalizationWork ?? getProblemFormalizationWorkSnapshot(problem),
    formalization: formalizationAction?.formalization ?? getProblemFormalizationSnapshot(problem),
    actions,
    primaryAction,
    summary: summarizeP848Dispatch(primaryAction),
  };
}

function summarizeP848FleetDispatch(snapshot) {
  if (!snapshot.available) {
    return snapshot.error ?? 'Fleet dispatch is not available.';
  }
  const availableCount = snapshot.members.filter((member) => member.available).length;
  const totalCount = snapshot.members.length;
  if (availableCount === totalCount) {
    return `Fleet ${snapshot.fleetId} is ready to fan out ${snapshot.actionId} across ${totalCount} remote worker${totalCount === 1 ? '' : 's'}.`;
  }
  return `Fleet ${snapshot.fleetId} can launch ${snapshot.actionId} on ${availableCount}/${totalCount} remote worker${totalCount === 1 ? '' : 's'} right now.`;
}

export function getNumberTheoryFleetDispatchSnapshot(problem, options = {}, workspaceRoot = getWorkspaceRoot()) {
  const problemId = String(problem.problemId);
  if (problemId !== '848') {
    return {
      available: false,
      problemId,
      error: `No fleet dispatch is registered for problem ${problemId}.`,
    };
  }

  const fleetId = String(options.fleetId ?? '').trim() || null;
  if (!fleetId) {
    return {
      available: false,
      problemId,
      error: 'Fleet dispatch requires --fleet <fleet-id>.',
    };
  }

  const fleet = getFrontierFleetSnapshot(fleetId, workspaceRoot);
  if (!fleet) {
    return {
      available: false,
      problemId,
      error: `Unknown frontier fleet: ${fleetId}`,
    };
  }

  const actionId = options.actionId ?? 'gpu_profile_sweep';
  const strategyId = String(options.strategyId ?? 'ladder_cover_v1').trim() || 'ladder_cover_v1';
  const bridge = getNumberTheoryBridgeSnapshot(problem);
  const assignments = actionId === 'gpu_profile_sweep'
    ? buildP848FleetAssignments(problem, fleet, bridge, { strategyId })
    : [];
  const memberPlans = (fleet.remoteIds ?? []).map((remoteId) => {
    const dispatch = getNumberTheoryDispatchSnapshot(problem, {
      ...options,
      actionId,
      remoteId,
    }, workspaceRoot);
    const action = dispatch.available
      ? (dispatch.actions.find((candidate) => candidate.actionId === actionId) ?? null)
      : null;
    return {
      remoteId,
      assignment: assignments.find((assignment) => assignment.remoteId === remoteId) ?? null,
      available: Boolean(action?.available),
      dispatchAvailable: dispatch.available,
      dispatchError: dispatch.error ?? null,
      action,
      remoteSummary: dispatch.summary ?? null,
      actionReason: action?.reason ?? dispatch.error ?? null,
      applyCommand: action?.applyCommand ?? buildDispatchApplyCommand(problemId, actionId, { remoteId }),
    };
  });

  const availableMembers = memberPlans.filter((member) => member.available);
  const unavailableMembers = memberPlans.filter((member) => !member.available);

  const snapshot = {
    available: availableMembers.length > 0,
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    problemId,
    displayName: problem.displayName,
    fleetId,
    fleet,
    actionId,
    strategyId,
    detach: true,
    reviewAfterHours: options.reviewAfterHours ?? null,
    members: memberPlans,
    availableMemberCount: availableMembers.length,
    unavailableMemberCount: unavailableMembers.length,
    commandLine: buildFleetDispatchApplyCommand(problemId, fleetId, actionId, {
      reviewAfterHours: options.reviewAfterHours ?? null,
      strategyId,
    }),
  };

  return {
    ...snapshot,
    summary: summarizeP848FleetDispatch(snapshot),
    error: snapshot.available ? null : 'No fleet members are currently ready for the requested action.',
  };
}

function writeFleetDispatchBundle(problem, snapshot, memberResults, workspaceRoot = getWorkspaceRoot(), options = {}) {
  const runId = options.runId ?? `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__fleet_${snapshot.actionId}`;
  const runDir = options.runDir ?? getWorkspaceRunDir(runId, workspaceRoot);
  ensureDir(runDir);

  const payload = {
    schema: 'erdos.number_theory.fleet_dispatch/1',
    generatedAt: new Date().toISOString(),
    runId,
    problemId: problem.problemId,
    displayName: problem.displayName,
    fleetId: snapshot.fleetId,
    actionId: snapshot.actionId,
    strategyId: snapshot.strategyId ?? null,
    summary: snapshot.summary,
    reviewAfterHours: snapshot.reviewAfterHours ?? null,
    members: memberResults,
    boundary: 'This fleet dispatch records orchestrated worker launches. Mathematical claims come only from harvested artifacts and canonical writeback.',
  };

  writeJson(path.join(runDir, 'FLEET_DISPATCH.json'), payload);
  writeText(
    path.join(runDir, 'RUN_SUMMARY.md'),
    [
      '# Number-Theory Fleet Dispatch',
      '',
      `- Problem: ${problem.displayName}`,
      `- Fleet: ${snapshot.fleetId}`,
      `- Action: ${snapshot.actionId}`,
      `- Review-after-hours: ${snapshot.reviewAfterHours ?? '(none)'}`,
      `- Ready members: ${snapshot.availableMemberCount}/${snapshot.members.length}`,
      '',
      'Members:',
      ...memberResults.map((member) => `- ${member.remoteId}: ${member.status}`),
      '',
      'Boundary:',
      '- This fleet dispatch records orchestrated worker launches. Mathematical claims come only from harvested artifacts and canonical writeback.',
      '',
    ].join('\n'),
  );

  return {
    runId,
    runDir,
    payload,
  };
}

export function getNumberTheoryFleetRunSnapshot(runId, workspaceRoot = getWorkspaceRoot()) {
  const runDir = getWorkspaceRunDir(runId, workspaceRoot);
  const payload = readJsonIfPresent(path.join(runDir, 'FLEET_DISPATCH.json'));
  if (!payload) {
    return null;
  }

  const sessions = (payload.members ?? []).map((member) => {
    const session = member.sessionId
      ? getFrontierSessionSnapshot(member.sessionId, workspaceRoot)
      : null;
    const harvestedBundle = session?.harvestedBundle ?? null;
    const manifest = harvestedBundle?.manifestPath
      ? readJsonIfPresent(harvestedBundle.manifestPath)
      : null;
    return {
      ...member,
      session,
      harvestedBundle,
      harvestedManifestSummary: manifest?.summary ?? null,
    };
  });

  const statusCounts = sessions.reduce((accumulator, member) => {
    const key = member.session?.status ?? member.status ?? 'unknown';
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
  const harvestedBundles = sessions.filter((member) => member.harvestedBundle?.ok);

  return {
    ...payload,
    runDir,
    members: sessions,
    statusCounts,
    harvestedBundleCount: harvestedBundles.length,
    harvestedBundles,
  };
}

function buildDetachedDispatchCliArgs(problemId, actionId, options = {}) {
  const args = [
    'number-theory',
    'dispatch',
    String(problemId),
    '--apply',
    '--action',
    String(actionId),
  ];

  if (options.remoteId) {
    args.push('--remote-id', String(options.remoteId));
  }

  if (options.exactMin !== null && options.exactMin !== undefined) {
    args.push('--exact-min', String(options.exactMin));
  }
  if (options.exactMax !== null && options.exactMax !== undefined) {
    args.push('--exact-max', String(options.exactMax));
  }
  if (options.exactChunks !== null && options.exactChunks !== undefined) {
    args.push('--exact-chunks', String(options.exactChunks));
  }
  if (options.exactChunkSize !== null && options.exactChunkSize !== undefined) {
    args.push('--exact-chunk-size', String(options.exactChunkSize));
  }
  if (options.baseSideMax !== null && options.baseSideMax !== undefined) {
    args.push('--base-side-max', String(options.baseSideMax));
  }
  if (options.structuralMax !== null && options.structuralMax !== undefined) {
    args.push('--structural-max', String(options.structuralMax));
  }
  if (options.structuralMin !== null && options.structuralMin !== undefined) {
    args.push('--structural-min', String(options.structuralMin));
  }
  if (options.mixedBaseMaxRows !== null && options.mixedBaseMaxRows !== undefined) {
    args.push('--mixed-base-max-rows', String(options.mixedBaseMaxRows));
  }
  if (options.fullMixedRowSampleLimit !== null && options.fullMixedRowSampleLimit !== undefined) {
    args.push('--full-mixed-row-sample-limit', String(options.fullMixedRowSampleLimit));
  }
  if (options.structuralLiftTopRows !== null && options.structuralLiftTopRows !== undefined) {
    args.push('--structural-lift-top-rows', String(options.structuralLiftTopRows));
  }
  if (options.structuralLiftFamilyLimit !== null && options.structuralLiftFamilyLimit !== undefined) {
    args.push('--structural-lift-family-limit', String(options.structuralLiftFamilyLimit));
  }
  if (options.endpointMonotonicity) {
    args.push('--endpoint-monotonicity');
  }

  return args;
}

function executeExternalCommand(executable, args, cwd = repoRoot) {
  try {
    const stdout = execFileSync(executable, args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
    return {
      ok: true,
      stdout,
      stderr: null,
    };
  } catch (error) {
    return {
      ok: false,
      stdout: error?.stdout?.toString().trim() || null,
      stderr: error?.stderr?.toString().trim() || error?.message || null,
    };
  }
}

function parseP848RemoteBundleDir(stdout) {
  const match = String(stdout ?? '').match(/p848_seed_bundle:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

function normalizeRemoteBundleDir(remote, remoteBundleDir) {
  if (!remoteBundleDir) {
    return null;
  }
  if (isBrevRemote(remote)) {
    const normalized = String(remoteBundleDir).replaceAll('\\', '/');
    if (normalized.startsWith('/')) {
      return normalized;
    }
    const engineRoot = String(remote?.engineRoot ?? '').replaceAll('\\', '/');
    const homeDir = engineRoot.includes('/')
      ? engineRoot.replace(/\/frontier-engine$/, '').replace(/\/+$/, '')
      : '$HOME';
    return `${homeDir}/${normalized.replace(/^\.\/+/, '')}`;
  }
  const normalized = String(remoteBundleDir).replaceAll('/', '\\');
  if (/^[A-Za-z]:\\/.test(normalized) || normalized.startsWith('%USERPROFILE%\\')) {
    return normalized;
  }
  return `%USERPROFILE%\\${normalized}`;
}

function readRemoteText(remote, remotePath) {
  if (isBrevRemote(remote)) {
    return runRemoteCommandCapture(remote, `cat ${JSON.stringify(String(remotePath))}`, { cwd: repoRoot });
  }
  return executeExternalCommand('ssh', [remote.sshHost, `cmd /c type "${remotePath}"`], repoRoot);
}

function mirrorRemoteP848Bundle(remote, remoteBundleDir) {
  if (!remote || !remoteBundleDir) {
    return null;
  }

  const normalizedRemoteBundleDir = normalizeRemoteBundleDir(remote, remoteBundleDir);
  const bundleName = isBrevRemote(remote)
    ? path.posix.basename(normalizedRemoteBundleDir)
    : path.win32.basename(normalizedRemoteBundleDir);
  const localBundleDir = path.join(repoRoot, 'research', 'frontier-engine', 'artifacts', 'p848-anchor-ladder', bundleName);
  ensureDir(localBundleDir);

  if (isBrevRemote(remote)) {
    const copyResult = runRemoteCopyFromCapture(remote, normalizedRemoteBundleDir, path.dirname(localBundleDir), {
      cwd: repoRoot,
      recursive: true,
    });
    if (!copyResult.ok) {
      return {
        ok: false,
        localBundleDir,
        remoteBundleDir: normalizedRemoteBundleDir,
        error: copyResult.stderr ?? 'failed to copy remote bundle',
      };
    }
    const manifestPayload = readJsonIfPresent(path.join(localBundleDir, 'manifest.json'));
    return {
      ok: Boolean(manifestPayload),
      localBundleDir,
      remoteBundleDir: normalizedRemoteBundleDir,
      manifest: manifestPayload,
      copiedCandidateFiles: manifestPayload?.candidate_files?.map((row) => row?.file).filter(Boolean) ?? [],
      missingCandidateFiles: manifestPayload ? [] : [{ file: 'manifest.json', error: 'failed to read copied manifest' }],
      copyResult,
    };
  }

  const manifestRemotePath = `${normalizedRemoteBundleDir}\\manifest.json`;
  const manifestResult = readRemoteText(remote, manifestRemotePath);
  if (!manifestResult.ok || !manifestResult.stdout) {
    return {
      ok: false,
      localBundleDir,
      remoteBundleDir: normalizedRemoteBundleDir,
      error: manifestResult.stderr ?? 'failed to read remote manifest',
    };
  }

  const manifestPayload = JSON.parse(manifestResult.stdout);
  writeJson(path.join(localBundleDir, 'manifest.json'), manifestPayload);

  const copiedCandidateFiles = [];
  const missingCandidateFiles = [];
  for (const row of manifestPayload.candidate_files ?? []) {
    const filename = row?.file ? String(row.file) : null;
    if (!filename) {
      continue;
    }
    const candidateRemotePath = `${normalizedRemoteBundleDir}\\${filename}`;
    const candidateResult = readRemoteText(remote, candidateRemotePath);
    if (!candidateResult.ok || candidateResult.stdout === null) {
      missingCandidateFiles.push({
        file: filename,
        error: candidateResult.stderr ?? 'failed to read remote candidate file',
      });
      continue;
    }
    writeText(path.join(localBundleDir, filename), `${candidateResult.stdout}\n`);
    copiedCandidateFiles.push(filename);
  }

  return {
    ok: true,
    localBundleDir,
    remoteBundleDir: normalizedRemoteBundleDir,
    manifest: manifestPayload,
    copiedCandidateFiles,
    missingCandidateFiles,
  };
}

function getP848ExactHandoffPlan(problemId) {
  if (String(problemId) !== '848') {
    return {
      available: false,
      actionId: 'exact_handoff_bundle',
      reason: `No exact handoff bundle is registered for problem ${problemId}.`,
    };
  }

  const bridgePath = getPackFile(problemId, 'SEARCH_THEOREM_BRIDGE.json');
  const bridge = readJsonIfPresent(bridgePath);
  if (!bridge?.current_bridge_state) {
    return {
      available: false,
      actionId: 'exact_handoff_bundle',
      reason: 'The canonical search/theorem bridge is not present yet, so no exact handoff bundle can be assembled.',
      bridgePath,
    };
  }

  return {
    available: true,
    actionId: 'exact_handoff_bundle',
    mode: 'cpu',
    source: 'search_theorem_bridge',
    reason: 'The canonical bridge already narrows the live frontier into a stable exact-follow-up packet.',
    bridgePath,
    bridgeMarkdownPath: getPackFile(problemId, 'SEARCH_THEOREM_BRIDGE.md'),
    gpuManifestPath: bridge?.sources?.gpu_manifest_path ?? null,
    nextUnmatchedRepresentative: bridge.current_bridge_state.next_unmatched_representative ?? null,
    topGpuTieClass: bridge.current_bridge_state.top_gpu_tie_class ?? [],
    strongestCompletedStructuredTail: bridge.current_bridge_state.strongest_completed_structured_tail ?? null,
    currentFamilyAwareLeader: bridge.current_bridge_state.current_family_aware_leader ?? null,
    commandLine: `erdos number-theory dispatch ${problemId} --apply --action exact_handoff_bundle`,
  };
}

function getP848ExactFollowupLaunchPlan(problemId, options = {}) {
  if (String(problemId) !== '848') {
    return {
      available: false,
      actionId: 'exact_followup_launch',
      reason: `No exact follow-up launcher is registered for problem ${problemId}.`,
    };
  }

  const handoffPlan = getP848ExactHandoffPlan(problemId);
  const exactPlan = getP848ExactScoutPlan(problemId, options);

  if (!handoffPlan.available) {
    return {
      available: false,
      actionId: 'exact_followup_launch',
      reason: handoffPlan.reason,
      handoffPlan,
      exactPlan,
    };
  }

  if (!exactPlan.available) {
    return {
      available: false,
      actionId: 'exact_followup_launch',
      reason: exactPlan.reason,
      handoffPlan,
      exactPlan,
    };
  }

  return {
    available: true,
    actionId: 'exact_followup_launch',
    mode: exactPlan.mode ?? 'cpu',
    source: 'exact_orchestrator',
    reason: 'Package the canonical bridge context and immediately run the ready exact-small-N backend.',
    bridgePath: handoffPlan.bridgePath,
    bridgeMarkdownPath: handoffPlan.bridgeMarkdownPath,
    gpuManifestPath: handoffPlan.gpuManifestPath ?? null,
    readyInterval: exactPlan.readyInterval ?? null,
    latestDoneInterval: exactPlan.latestDoneInterval ?? null,
    min: exactPlan.min ?? null,
    max: exactPlan.max ?? null,
    scriptPath: exactPlan.scriptPath ?? null,
    endpointMonotonicity: Boolean(exactPlan.endpointMonotonicity),
    backendKind: exactPlan.backendKind ?? 'exact_small_n',
    commandLine: `erdos number-theory dispatch ${problemId} --apply --action exact_followup_launch`,
  };
}

function getP848ExactFollowupRolloutPlan(problemId, options = {}) {
  if (String(problemId) !== '848') {
    return {
      available: false,
      actionId: 'exact_followup_rollout',
      reason: `No exact follow-up rollout is registered for problem ${problemId}.`,
    };
  }

  const launchPlan = getP848ExactFollowupLaunchPlan(problemId, options);
  if (!launchPlan.available) {
    return {
      available: false,
      actionId: 'exact_followup_rollout',
      reason: launchPlan.reason,
      launchPlan,
    };
  }

  const chunkCount = parsePositiveInteger(options.exactChunks) ?? 3;
  const derivedChunkSize = launchPlan.min !== null && launchPlan.max !== null
    ? Math.max(1, launchPlan.max - launchPlan.min + 1)
    : 100;
  const chunkSize = parsePositiveInteger(options.exactChunkSize) ?? derivedChunkSize;
  const rolloutIntervals = Array.from({ length: chunkCount }, (_, index) => {
    const min = launchPlan.min + (index * chunkSize);
    const max = min + chunkSize - 1;
    return {
      index: index + 1,
      min,
      max,
      interval: `${min}..${max}`,
    };
  });
  const totalMax = rolloutIntervals.length > 0 ? rolloutIntervals[rolloutIntervals.length - 1].max : launchPlan.max;

  return {
    available: true,
    actionId: 'exact_followup_rollout',
    mode: launchPlan.mode ?? 'cpu',
    source: 'exact_orchestrator',
    reason: `The exact lane is ready for a ${chunkCount}-chunk rollout from ${rolloutIntervals[0]?.interval ?? '(unknown)'} through ${rolloutIntervals[rolloutIntervals.length - 1]?.interval ?? '(unknown)'}.`,
    bridgePath: launchPlan.bridgePath,
    bridgeMarkdownPath: launchPlan.bridgeMarkdownPath,
    gpuManifestPath: launchPlan.gpuManifestPath ?? null,
    readyInterval: launchPlan.readyInterval ?? null,
    latestDoneInterval: launchPlan.latestDoneInterval ?? null,
    min: launchPlan.min ?? null,
    max: totalMax ?? null,
    scriptPath: launchPlan.scriptPath ?? null,
    endpointMonotonicity: Boolean(launchPlan.endpointMonotonicity),
    backendKind: launchPlan.endpointMonotonicity ? 'endpoint_monotonicity_small_n_rollout' : 'exact_small_n_rollout',
    chunkCount,
    chunkSize,
    rolloutIntervals,
    commandLine: buildDispatchApplyCommand(problemId, 'exact_followup_rollout', {
      exactMin: launchPlan.min,
      exactChunks: chunkCount,
      exactChunkSize: chunkSize,
      endpointMonotonicity: launchPlan.endpointMonotonicity,
    }),
  };
}

function buildP848ExactHandoffBundle(problem, action, dispatchSnapshot, runDir) {
  const bridgeJsonPath = getPackFile(problem.problemId, 'SEARCH_THEOREM_BRIDGE.json');
  const bridgeMarkdownPath = getPackFile(problem.problemId, 'SEARCH_THEOREM_BRIDGE.md');
  const bridge = readJsonIfPresent(bridgeJsonPath);
  const bridgeMarkdown = fs.existsSync(bridgeMarkdownPath)
    ? fs.readFileSync(bridgeMarkdownPath, 'utf8')
    : null;

  if (!bridge?.current_bridge_state) {
    return {
      ok: false,
      error: 'The canonical search/theorem bridge is not available.',
    };
  }

  const handoffDir = path.join(runDir, 'exact-handoff');
  const candidatesDir = path.join(handoffDir, 'candidates');
  ensureDir(handoffDir);
  ensureDir(candidatesDir);

  const gpuManifestPath = bridge?.sources?.gpu_manifest_path ?? null;
  const gpuManifest = gpuManifestPath ? readJsonIfPresent(gpuManifestPath) : null;
  const copiedCandidateFiles = [];
  const missingCandidateFiles = [];

  for (const row of gpuManifest?.candidate_files ?? []) {
    const filename = row?.file ? String(row.file) : null;
    if (!filename) {
      continue;
    }
    const sourcePath = path.join(path.dirname(gpuManifestPath), filename);
    const destPath = path.join(candidatesDir, filename);
    if (!fs.existsSync(sourcePath)) {
      missingCandidateFiles.push(filename);
      continue;
    }
    fs.copyFileSync(sourcePath, destPath);
    copiedCandidateFiles.push(filename);
  }

  const recommendedContinuations = [];
  const seenContinuations = new Set();
  const leader = bridge.current_bridge_state.current_family_aware_leader;
  if (leader?.continuation !== undefined && leader?.continuation !== null) {
    recommendedContinuations.push({
      role: 'current_family_aware_leader',
      continuation: leader.continuation,
      repairedKnownPackets: leader.repaired_known_packets,
      repairedPredictedFamilies: leader.repaired_predicted_families,
      effectiveCleanThrough: leader.effective_clean_through,
    });
    seenContinuations.add(Number(leader.continuation));
  }
  for (const row of bridge.gpu_leaderboard ?? []) {
    const continuation = Number(row.continuation);
    if (seenContinuations.has(continuation)) {
      continue;
    }
    recommendedContinuations.push({
      role: 'gpu_leaderboard',
      continuation,
      repairedKnownPackets: row.repaired_known_packets,
      repairedPredictedFamilies: row.repaired_predicted_families,
      effectiveCleanThrough: row.effective_clean_through,
    });
    seenContinuations.add(continuation);
    if (recommendedContinuations.length >= 5) {
      break;
    }
  }
  const strongestCompleted = bridge.current_bridge_state.strongest_completed_structured_tail;
  if (strongestCompleted?.continuation !== undefined && strongestCompleted?.continuation !== null) {
    const continuation = Number(strongestCompleted.continuation);
    if (!seenContinuations.has(continuation)) {
      recommendedContinuations.push({
        role: 'strongest_completed_structured_tail',
        continuation,
        repairedKnownPackets: null,
        repairedPredictedFamilies: null,
        effectiveCleanThrough: strongestCompleted.clean_through ?? null,
      });
    }
  }

  const handoff = {
    schema: 'erdos.number_theory.p848_exact_handoff/1',
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    displayName: problem.displayName,
    activeRoute: dispatchSnapshot.activeRoute ?? null,
    source: 'canonical_search_theorem_bridge',
    bridgeState: bridge.current_bridge_state,
    theoremHooks: bridge.candidate_theorem_hooks ?? [],
    sources: bridge.sources ?? {},
    recommendedContinuations,
    exactFocus: {
      nextUnmatchedRepresentative: bridge.current_bridge_state.next_unmatched_representative ?? null,
      nextUnmatchedMatches282Failure: Boolean(bridge.current_bridge_state.next_unmatched_matches_282_failure),
      topGpuTieClass: bridge.current_bridge_state.top_gpu_tie_class ?? [],
      strongestCompletedStructuredTail: strongestCompleted ?? null,
      currentFamilyAwareLeader: leader ?? null,
    },
    copiedCandidateFiles,
    missingCandidateFiles,
    honestyBoundary: 'This bundle is a workspace handoff for exact follow-up. It does not certify the problem or promote a theorem claim by itself.',
  };

  const handoffJsonPath = path.join(handoffDir, 'EXACT_HANDOFF.json');
  const handoffMarkdownPath = path.join(handoffDir, 'EXACT_HANDOFF.md');
  writeJson(handoffJsonPath, handoff);
  writeText(
    handoffMarkdownPath,
    [
      '# Problem 848 Exact Handoff',
      '',
      `- Problem: ${problem.displayName}`,
      `- Active route: ${dispatchSnapshot.activeRoute ?? '(none)'}`,
      `- Next unmatched representative: ${bridge.current_bridge_state.next_unmatched_representative ?? '(unknown)'}`,
      `- Matches 282 tail failure: ${bridge.current_bridge_state.next_unmatched_matches_282_failure ? 'yes' : 'no'}`,
      `- Current family-aware leader: ${leader?.continuation ?? '(unknown)'}`,
      `- Strongest completed structured tail: ${strongestCompleted?.continuation ?? '(unknown)'}`,
      `- GPU tie class: ${(bridge.current_bridge_state.top_gpu_tie_class ?? []).join(', ') || '(none)'}`,
      '',
      'Recommended exact follow-up:',
      `- pressure-test ${bridge.current_bridge_state.next_unmatched_representative ?? '(unknown)'} against the current packet/menu surface`,
      `- compare the tied frontier tails ${(bridge.current_bridge_state.top_gpu_tie_class ?? []).join(', ') || '(none)'} on the next finite window`,
      `- retain ${strongestCompleted?.continuation ?? '(unknown)'} as the strongest completed structured tail baseline`,
      '',
      'Artifacts:',
      `- Bridge JSON: ${bridgeJsonPath}`,
      `- Bridge note: ${bridgeMarkdownPath}`,
      `- GPU manifest: ${gpuManifestPath ?? '(missing)'}`,
      `- Candidate files copied: ${copiedCandidateFiles.length}`,
      '',
      'Boundary:',
      '- This bundle is a workspace handoff for exact follow-up. It does not certify the problem or upgrade canonical theorem claims by itself.',
      '',
    ].join('\n'),
  );

  if (bridgeMarkdown) {
    writeText(path.join(handoffDir, 'SEARCH_THEOREM_BRIDGE.md'), bridgeMarkdown);
  }
  writeJson(path.join(handoffDir, 'SEARCH_THEOREM_BRIDGE.json'), bridge);
  if (gpuManifest) {
    writeJson(path.join(handoffDir, 'GPU_MANIFEST.json'), gpuManifest);
  }

  return {
    ok: true,
    handoff,
    handoffDir,
    handoffJsonPath,
    handoffMarkdownPath,
  };
}

function buildP848ExactFollowupPacket(problem, action, dispatchSnapshot, handoffResult, results, execution, runDir, resultsPath) {
  const followupDir = path.join(runDir, 'exact-followup');
  ensureDir(followupDir);

  const summary = results?.summary ?? null;
  const recommendedNextMoves = [];
  if (summary?.allCandidateAchievesMaximum === true && summary?.allExampleCliquesMatchCandidateClass === true) {
    recommendedNextMoves.push('Extend the exact small-N interval farther while the residue-class candidate continues to match the exact maximum.');
  } else {
    recommendedNextMoves.push('Inspect the first row where the candidate fails to achieve the exact maximum or the example clique leaves the tracked residue classes.');
  }
  recommendedNextMoves.push(
    `Keep ${handoffResult.handoff?.exactFocus?.nextUnmatchedRepresentative ?? '(unknown)'} as the next shared-prefix pressure point for theorem/search coordination.`,
  );

  const packet = {
    schema: 'erdos.number_theory.p848_exact_followup/1',
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    displayName: problem.displayName,
    activeRoute: dispatchSnapshot.activeRoute ?? null,
    source: 'exact_followup_launch',
    backend: {
      kind: action.backendKind ?? 'exact_small_n',
      readyInterval: action.readyInterval ?? null,
      latestDoneInterval: action.latestDoneInterval ?? null,
      min: action.min ?? null,
      max: action.max ?? null,
      scriptPath: action.scriptPath ?? null,
      endpointMonotonicity: Boolean(action.endpointMonotonicity),
      commandLine: formatCommandLine('node', [
        action.scriptPath,
        '--min',
        String(action.min),
        '--max',
        String(action.max),
        ...(action.endpointMonotonicity ? ['--endpoint-monotonicity'] : []),
        '--json-output',
        resultsPath,
      ]),
    },
    handoff: {
      dir: handoffResult.handoffDir ?? null,
      jsonPath: handoffResult.handoffJsonPath ?? null,
      markdownPath: handoffResult.handoffMarkdownPath ?? null,
      exactFocus: handoffResult.handoff?.exactFocus ?? null,
      recommendedContinuations: handoffResult.handoff?.recommendedContinuations ?? [],
    },
    execution: {
      ok: Boolean(execution?.ok),
      stdout: execution?.stdout ?? null,
      stderr: execution?.stderr ?? null,
    },
    resultsPath,
    resultsSummary: summary,
    recommendedNextMoves,
    honestyBoundary: 'This packet records one exact follow-up run plus its handoff context. It does not certify the full problem or promote theorem claims beyond the covered interval.',
  };

  const followupJsonPath = path.join(followupDir, 'EXACT_FOLLOWUP.json');
  const followupMarkdownPath = path.join(followupDir, 'EXACT_FOLLOWUP.md');
  writeJson(followupJsonPath, packet);
  writeText(
    followupMarkdownPath,
    [
      '# Problem 848 Exact Follow-Up',
      '',
      `- Problem: ${problem.displayName}`,
      `- Active route: ${dispatchSnapshot.activeRoute ?? '(none)'}`,
      `- Backend: ${packet.backend.kind}`,
      `- Interval: ${action.min}..${action.max}`,
      `- Ready interval: ${action.readyInterval?.range ?? '(unknown)'}`,
      `- Latest done interval: ${action.latestDoneInterval?.range ?? '(unknown)'}`,
      `- Handoff bundle: ${handoffResult.handoffDir ?? '(missing)'}`,
      `- Results JSON: ${resultsPath}`,
      '',
      'Results summary:',
      `- Candidate achieves maximum throughout interval: ${summary?.allCandidateAchievesMaximum ? 'yes' : 'no'}`,
      `- Example cliques stay in tracked residue classes: ${summary?.allExampleCliquesMatchCandidateClass ? 'yes' : 'no'}`,
      `- Rows scanned: ${summary?.rows ?? '(unknown)'}`,
      '',
      'Next moves:',
      ...recommendedNextMoves.map((move) => `- ${move}`),
      '',
      'Boundary:',
      '- This packet records one exact follow-up run plus its handoff context. It does not certify the full problem or upgrade canonical theorem claims beyond the covered interval.',
      '',
    ].join('\n'),
  );

  return {
    ok: true,
    packet,
    followupDir,
    followupJsonPath,
    followupMarkdownPath,
  };
}

function buildP848ExactRolloutPacket(problem, action, dispatchSnapshot, childRuns, bridgeRefresh, runDir) {
  const rolloutDir = path.join(runDir, 'exact-rollout');
  ensureDir(rolloutDir);

  const completedRuns = childRuns.filter((childRun) => childRun.ok);
  const failedRun = childRuns.find((childRun) => !childRun.ok) ?? null;
  const completedInterval = completedRuns.length > 0
    ? `${completedRuns[0].min}..${completedRuns[completedRuns.length - 1].max}`
    : null;
  const recommendedNextMoves = [];
  if (failedRun) {
    recommendedNextMoves.push(`Inspect the failed chunk ${failedRun.interval} before widening the exact rollout further.`);
  } else {
    recommendedNextMoves.push('Advance the next contiguous exact rollout block while the exact-small-N backend remains stable.');
  }
  recommendedNextMoves.push(
    `Refresh the theorem/search bridge after exact promotion so the canonical 848 north-star stays aligned with the latest verified interval.`,
  );

  const packet = {
    schema: 'erdos.number_theory.p848_exact_followup_rollout/1',
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    displayName: problem.displayName,
    activeRoute: dispatchSnapshot.activeRoute ?? null,
    source: 'exact_followup_rollout',
    requestedChunkCount: action.chunkCount ?? 0,
    completedChunkCount: completedRuns.length,
    chunkSize: action.chunkSize ?? null,
    requestedInterval: action.min !== null && action.max !== null ? `${action.min}..${action.max}` : null,
    completedInterval,
    rolloutIntervals: (action.rolloutIntervals ?? []).map((interval) => ({
      index: interval.index,
      min: interval.min,
      max: interval.max,
      interval: interval.interval,
    })),
    childRuns: childRuns.map((childRun) => ({
      index: childRun.index,
      interval: childRun.interval,
      min: childRun.min,
      max: childRun.max,
      ok: childRun.ok,
      runId: childRun.runId ?? null,
      runDir: childRun.runDir ?? null,
      resultsSummary: childRun.resultsSummary ?? null,
      error: childRun.error ?? null,
      exactPromotion: childRun.exactPromotion ?? null,
    })),
    failedChunk: failedRun
      ? {
          index: failedRun.index,
          interval: failedRun.interval,
          error: failedRun.error ?? null,
        }
      : null,
    bridgeRefresh: bridgeRefresh
      ? {
          ok: Boolean(bridgeRefresh.ok),
          executionMode: bridgeRefresh.executionMode ?? null,
          executionSource: bridgeRefresh.executionSource ?? null,
          refreshCommand: bridgeRefresh.refreshCommand ?? null,
        }
      : null,
    recommendedNextMoves,
    honestyBoundary: 'This packet records a bounded exact rollout over contiguous intervals. It does not certify the full problem or upgrade theorem claims beyond the promoted exact base.',
  };

  const rolloutJsonPath = path.join(rolloutDir, 'EXACT_ROLLOUT.json');
  const rolloutMarkdownPath = path.join(rolloutDir, 'EXACT_ROLLOUT.md');
  writeJson(rolloutJsonPath, packet);
  writeText(
    rolloutMarkdownPath,
    [
      '# Problem 848 Exact Rollout',
      '',
      `- Problem: ${problem.displayName}`,
      `- Active route: ${dispatchSnapshot.activeRoute ?? '(none)'}`,
      `- Requested chunks: ${action.chunkCount ?? 0}`,
      `- Completed chunks: ${completedRuns.length}`,
      `- Chunk size: ${action.chunkSize ?? '(unknown)'}`,
      `- Requested interval: ${packet.requestedInterval ?? '(unknown)'}`,
      `- Completed interval: ${completedInterval ?? '(none)'}`,
      '',
      'Child runs:',
      ...childRuns.map((childRun) => `- chunk ${childRun.index}: ${childRun.interval} [${childRun.ok ? 'ok' : 'failed'}]${childRun.runId ? ` (${childRun.runId})` : ''}`),
      '',
      'Next moves:',
      ...recommendedNextMoves.map((move) => `- ${move}`),
      '',
      'Boundary:',
      '- This packet records a bounded exact rollout over contiguous intervals. It does not certify the full problem or upgrade theorem claims beyond the promoted exact base.',
      '',
    ].join('\n'),
  );

  return {
    ok: !failedRun,
    packet,
    rolloutDir,
    rolloutJsonPath,
    rolloutMarkdownPath,
  };
}

function writeDispatchRunBundle(problem, dispatchSnapshot, action, payload, workspaceRoot = getWorkspaceRoot(), options = {}) {
  const runId = options.runId ?? `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
  const runDir = options.runDir ?? getWorkspaceRunDir(runId, workspaceRoot);
  ensureDir(runDir);

  const runRecord = {
    runId,
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    displayName: problem.displayName,
    cluster: problem.cluster,
    actionId: action.actionId,
    actionTitle: action.title,
    actionKind: action.kind,
    actionMode: action.mode ?? null,
    actionSource: action.source ?? null,
    actionReason: action.reason ?? null,
    commandLine: payload.commandLine ?? action.commandLine ?? null,
    currentRoute: dispatchSnapshot.activeRoute ?? null,
    summary: dispatchSnapshot.summary,
    artifacts: {
      runPath: path.join(runDir, 'RUN.json'),
      dispatchPath: path.join(runDir, 'DISPATCH.json'),
      resultPath: path.join(runDir, 'RESULT.json'),
      runSummaryPath: path.join(runDir, 'RUN_SUMMARY.md'),
      logPath: path.join(runDir, 'RUN_LOG.txt'),
    },
  };

  writeJson(path.join(runDir, 'RUN.json'), runRecord);
  writeJson(path.join(runDir, 'DISPATCH.json'), dispatchSnapshot);
  writeJson(path.join(runDir, 'RESULT.json'), payload);
  writeText(path.join(runDir, 'RUN_LOG.txt'), `${payload.stdout ?? payload.stderr ?? ''}\n`);
  writeText(
    path.join(runDir, 'RUN_SUMMARY.md'),
    [
      '# Number-Theory Frontier Dispatch Run',
      '',
      `- Problem: ${problem.displayName}`,
      `- Action: ${action.actionId}`,
      `- Title: ${action.title}`,
      `- Kind: ${action.kind}`,
      `- Mode: ${action.mode ?? '(none)'}`,
      `- Source: ${action.source ?? '(none)'}`,
      `- Command: ${payload.commandLine ?? action.commandLine ?? '(none)'}`,
      `- OK: ${payload.ok ? 'yes' : 'no'}`,
      `- Route: ${dispatchSnapshot.activeRoute ?? '(none)'}`,
      '',
      'Dispatch summary:',
      `- ${dispatchSnapshot.summary}`,
      '',
      'Outputs:',
      '- RUN.json',
      '- DISPATCH.json',
      '- RESULT.json',
      '- RUN_LOG.txt',
      '',
      'Boundary:',
      '- This is a workspace run artifact. It does not upgrade canonical theorem claims by itself.',
      '',
    ].join('\n'),
  );

  return { runId, runDir, runRecord };
}

export function runNumberTheoryFleetDispatch(problem, options = {}, workspaceRoot = getWorkspaceRoot()) {
  const snapshot = getNumberTheoryFleetDispatchSnapshot(problem, options, workspaceRoot);
  if (!snapshot.available) {
    return {
      ok: false,
      error: snapshot.error ?? 'Fleet dispatch is unavailable.',
      snapshot,
      fleetRun: null,
    };
  }

  const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__fleet_${snapshot.actionId}`;
  const runDir = getWorkspaceRunDir(runId, workspaceRoot);
  ensureDir(runDir);
  const memberResults = snapshot.members.map((member) => {
    if (!member.available) {
      return {
        remoteId: member.remoteId,
        status: 'skipped',
        ok: false,
        error: member.actionReason ?? member.dispatchError ?? 'member unavailable',
        sessionId: null,
        assignment: member.assignment ?? null,
      };
    }

    let profileOverride = null;
    if (snapshot.actionId === 'gpu_profile_sweep' && member.assignment) {
      const preparedProfile = prepareP848RemoteProfileOverride(member.action, member.assignment, workspaceRoot, {
        fleetId: snapshot.fleetId,
        launchId: runId,
      });
      if (!preparedProfile.ok) {
        return {
          remoteId: member.remoteId,
          status: 'failed',
          ok: false,
          error: preparedProfile.error ?? 'failed to prepare remote profile override',
          sessionId: null,
          assignment: member.assignment ?? null,
          profileOverride: preparedProfile,
        };
      }
      profileOverride = preparedProfile;
    }

    const result = runNumberTheoryDispatch(problem, {
      actionId: snapshot.actionId,
      detach: true,
      reviewAfterHours: snapshot.reviewAfterHours ?? null,
      remoteId: member.remoteId,
      profileOverride,
    }, workspaceRoot);

    return {
      remoteId: member.remoteId,
      status: result.ok ? 'launched' : 'failed',
      ok: Boolean(result.ok),
      error: result.error ?? null,
      sessionId: result.session?.sessionId ?? null,
      sessionStatus: result.session?.status ?? null,
      reviewDueAt: result.session?.reviewDueAt ?? null,
      assignment: member.assignment ?? null,
      profileOverride,
    };
  });

  const runBundle = writeFleetDispatchBundle(problem, snapshot, memberResults, workspaceRoot, {
    runId,
    runDir,
  });
  const fleetRun = getNumberTheoryFleetRunSnapshot(runBundle.runId, workspaceRoot);
  const launchedCount = memberResults.filter((member) => member.ok && member.sessionId).length;
  const failedCount = memberResults.filter((member) => member.status === 'failed').length;
  const skippedCount = memberResults.filter((member) => member.status === 'skipped').length;

  return {
    ok: launchedCount > 0 && failedCount === 0,
    partial: launchedCount > 0 && (failedCount > 0 || skippedCount > 0),
    problemId: problem.problemId,
    fleetId: snapshot.fleetId,
    actionId: snapshot.actionId,
    snapshot,
    fleetRun,
    launchedCount,
    failedCount,
    skippedCount,
    error: launchedCount > 0 ? null : 'No fleet members launched successfully.',
  };
}

export function runNumberTheoryDispatch(problem, options = {}, workspaceRoot = getWorkspaceRoot()) {
  const dispatch = getNumberTheoryDispatchSnapshot(problem, options, workspaceRoot);
  if (!dispatch.available) {
    return {
      ok: false,
      error: dispatch.error ?? 'Dispatch is unavailable.',
      dispatch,
    };
  }

  const action = options.actionId
    ? dispatch.actions.find((candidate) => candidate.actionId === options.actionId) ?? null
    : dispatch.primaryAction;

  if (!action) {
    return {
      ok: false,
      error: options.actionId
        ? `Unknown dispatch action: ${options.actionId}`
        : 'No primary dispatch action is currently available.',
      dispatch,
    };
  }

  if (!action.available) {
    return {
      ok: false,
      error: `Dispatch action ${action.actionId} is not available right now.`,
      dispatch,
      action,
    };
  }

  if (options.detach) {
    if (action.actionId === 'gpu_profile_sweep' && action.source === 'ssh_remote') {
      const remoteSpec = {
        provider: action.remoteProvider ?? 'ssh',
        instanceName: action.remoteInstanceName ?? null,
        sshHost: action.remoteHost,
        engineRoot: action.remoteEngineRoot,
        pythonCommand: action.remotePythonCommand,
      };
      const effectiveRemoteCommand = options.profileOverride?.remoteCommand ?? action.remoteCommand;
      const remoteDetachSpec = {
        backend: remoteSpec.provider === 'brev' ? 'remote_brev' : 'remote_ssh',
        kind: 'number_theory_dispatch',
        label: `${problem.displayName} ${action.actionId}`,
        problemId: problem.problemId,
        actionId: action.actionId,
        mode: action.mode ?? null,
        source: action.source ?? null,
        reviewAfterHours: options.reviewAfterHours ?? null,
        remoteProvider: remoteSpec.provider,
        remoteInstanceName: remoteSpec.instanceName,
        remoteHost: action.remoteHost,
        remoteEngineRoot: action.remoteEngineRoot,
        remotePythonCommand: action.remotePythonCommand,
        remoteCommandLine: effectiveRemoteCommand,
        detachedBy: 'number_theory_dispatch',
        metadata: {
          laneId: action.laneId ?? null,
          profileOverride: options.profileOverride ?? null,
        },
      };
      const reusableRemoteSession = findReusableFrontierDetachedSession(remoteDetachSpec, workspaceRoot);
      if (reusableRemoteSession) {
        return {
          ok: true,
          detached: true,
          reusedExisting: true,
          dispatch,
          action,
          session: reusableRemoteSession,
        };
      }
      const remoteSync = applyFrontierRemoteSync(workspaceRoot, {
        remoteId: action.remoteInstanceName ?? action.remoteHost,
        provider: remoteSpec.provider,
        instanceName: remoteSpec.instanceName,
        sshHost: action.remoteHost,
        engineRoot: action.remoteEngineRoot,
        pythonCommand: action.remotePythonCommand,
        laneId: action.laneId ?? null,
      });
      const localSharedPrefixCount = dispatch.currentBridgeState?.shared_prefix_failure_count ?? null;
      const remoteSharedPrefixCount = remoteSync?.remoteLiveFrontier?.shared_prefix_failure_count ?? null;
      const syncGap = !remoteSync.ok
        ? (remoteSync.error ?? 'Remote frontier sync failed.')
        : remoteSharedPrefixCount !== null && localSharedPrefixCount !== null && remoteSharedPrefixCount < localSharedPrefixCount
          ? `Remote frontier sync is stale for canonical promotion (${remoteSharedPrefixCount} shared-prefix failures vs local ${localSharedPrefixCount}).`
          : null;

      if (syncGap) {
        return {
          ok: false,
          error: syncGap,
          dispatch,
          action,
          remoteSync,
        };
      }

      const remoteSession = launchFrontierDetachedSession({
        ...remoteDetachSpec,
        metadata: {
          ...(remoteDetachSpec.metadata ?? {}),
          remoteSyncAt: remoteSync.appliedAt ?? null,
          remoteSharedPrefixFailureCount: remoteSharedPrefixCount,
        },
      }, workspaceRoot);

      if (!remoteSession.ok) {
        return {
          ok: false,
          error: remoteSession.error ?? 'Failed to launch remote frontier session.',
          dispatch,
          action,
          remoteSync,
        };
      }

      return {
        ok: true,
        detached: true,
        dispatch,
        action,
        remoteSync,
        session: remoteSession.session,
      };
    }

    const sessionCommand = getFrontierSessionCommandSpec(
      buildDetachedDispatchCliArgs(problem.problemId, action.actionId, options),
      workspaceRoot,
    );
    const localDetachSpec = {
      kind: 'number_theory_dispatch',
      label: `${problem.displayName} ${action.actionId}`,
      problemId: problem.problemId,
      actionId: action.actionId,
      mode: action.mode ?? null,
      source: action.source ?? null,
      reviewAfterHours: options.reviewAfterHours ?? null,
      executable: sessionCommand.executable,
      args: sessionCommand.args,
      cwd: sessionCommand.cwd,
      detachedBy: 'number_theory_dispatch',
      metadata: {
        exactMin: options.exactMin ?? null,
        exactMax: options.exactMax ?? null,
        exactChunks: options.exactChunks ?? null,
        exactChunkSize: options.exactChunkSize ?? null,
        baseSideMax: options.baseSideMax ?? null,
        structuralMax: options.structuralMax ?? null,
        structuralMin: options.structuralMin ?? null,
        mixedBaseMaxRows: options.mixedBaseMaxRows ?? null,
        fullMixedRowSampleLimit: options.fullMixedRowSampleLimit ?? null,
        structuralLiftTopRows: options.structuralLiftTopRows ?? null,
        structuralLiftFamilyLimit: options.structuralLiftFamilyLimit ?? null,
        externalSourceDir: options.externalSourceDir ?? null,
        commandLine: sessionCommand.commandLine,
      },
    };
    const reusableLocalSession = findReusableFrontierDetachedSession(localDetachSpec, workspaceRoot);
    if (reusableLocalSession) {
      return {
        ok: true,
        detached: true,
        reusedExisting: true,
        dispatch,
        action,
        session: reusableLocalSession,
      };
    }
    const session = launchFrontierDetachedSession(localDetachSpec, workspaceRoot);

    return {
      ok: true,
      detached: true,
      reusedExisting: false,
      dispatch,
      action,
      session,
    };
  }

  if (action.actionId === 'bridge_refresh') {
    const refresh = refreshNumberTheoryBridge(problem);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: refresh.ok,
      commandLine: refresh.resolvedCommand ?? action.commandLine,
      stdout: refresh.commandOutput,
      stderr: refresh.error ?? null,
      bridge: refresh.bridge,
      executionMode: refresh.executionMode ?? action.mode,
    }, workspaceRoot);
    return {
      ok: refresh.ok,
      dispatch,
      action,
      refresh,
      runBundle,
    };
  }

  if (action.actionId === 'claim_pass_refresh') {
    const claimPassRefresh = refreshProblemClaimPass(problem);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: claimPassRefresh.ok,
      commandLine: action.commandLine,
      stdout: claimPassRefresh.ok ? `claim_pass_json: ${claimPassRefresh.jsonPath}` : null,
      stderr: claimPassRefresh.error ?? null,
      claimPass: claimPassRefresh.claimPass ?? null,
      claimPassJsonPath: claimPassRefresh.jsonPath ?? null,
      claimPassMarkdownPath: claimPassRefresh.markdownPath ?? null,
      claimRefresh: claimPassRefresh.claimRefresh ?? null,
    }, workspaceRoot);
    return {
      ok: claimPassRefresh.ok,
      dispatch,
      action,
      claimPassRefresh,
      runBundle,
      error: claimPassRefresh.error ?? null,
    };
  }

  if (action.actionId === 'formalization_work_refresh') {
    const formalizationWorkRefresh = refreshProblemFormalizationWork(problem);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: formalizationWorkRefresh.ok,
      commandLine: action.commandLine,
      stdout: formalizationWorkRefresh.ok ? `formalization_work_json: ${formalizationWorkRefresh.jsonPath}` : null,
      stderr: formalizationWorkRefresh.error ?? null,
      formalizationWork: formalizationWorkRefresh.formalizationWork ?? null,
      formalizationWorkJsonPath: formalizationWorkRefresh.jsonPath ?? null,
      formalizationWorkMarkdownPath: formalizationWorkRefresh.markdownPath ?? null,
      formalizationRefresh: formalizationWorkRefresh.formalizationRefresh ?? null,
    }, workspaceRoot);
    return {
      ok: formalizationWorkRefresh.ok,
      dispatch,
      action,
      formalizationWorkRefresh,
      runBundle,
      error: formalizationWorkRefresh.error ?? null,
    };
  }

  if (action.actionId === 'formalization_refresh') {
    const formalizationRefresh = refreshProblemFormalization(problem);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: formalizationRefresh.ok,
      commandLine: action.commandLine,
      stdout: formalizationRefresh.ok ? `formalization_json: ${formalizationRefresh.jsonPath}` : null,
      stderr: formalizationRefresh.error ?? null,
      formalization: formalizationRefresh.formalization ?? null,
      formalizationJsonPath: formalizationRefresh.jsonPath ?? null,
      formalizationMarkdownPath: formalizationRefresh.markdownPath ?? null,
      claimPassRefresh: formalizationRefresh.claimPassRefresh ?? null,
    }, workspaceRoot);
    return {
      ok: formalizationRefresh.ok,
      dispatch,
      action,
      formalizationRefresh,
      runBundle,
      error: formalizationRefresh.error ?? null,
    };
  }

  if (action.actionId === 'structural_verifier_audit') {
    const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
    const runDir = getWorkspaceRunDir(runId, workspaceRoot);
    ensureDir(runDir);
    const args = [
      action.scriptPath,
      '--source-dir',
      action.sourceDir,
      '--json-output',
      action.jsonPath,
      '--markdown-output',
      action.markdownPath,
    ];
    const execution = executeExternalCommand('node', args, repoRoot);
    const audit = readJsonIfPresent(action.jsonPath);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: execution.ok,
      commandLine: formatCommandLine('node', args),
      stdout: execution.stdout,
      stderr: execution.stderr,
      audit,
      auditJsonPath: action.jsonPath,
      auditMarkdownPath: action.markdownPath,
      sourceDir: action.sourceDir,
      auditStatus: audit?.status ?? null,
      blockerCount: audit?.summary?.blockerCount ?? null,
      warningCount: audit?.summary?.warningCount ?? null,
    }, workspaceRoot, { runId, runDir });
    return {
      ok: execution.ok,
      dispatch,
      action,
      execution,
      audit,
      auditJsonPath: action.jsonPath,
      auditMarkdownPath: action.markdownPath,
      runBundle,
      error: execution.ok ? null : execution.stderr,
    };
  }

  if (action.actionId === 'base_side_scout') {
    const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
    const runDir = getWorkspaceRunDir(runId, workspaceRoot);
    ensureDir(runDir);
    const args = [
      action.scriptPath,
      '--max',
      String(action.max),
      '--json-output',
      action.jsonPath,
      '--markdown-output',
      action.markdownPath,
    ];
    const execution = executeExternalCommand('node', args, repoRoot);
    const scout = readJsonIfPresent(action.jsonPath);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: execution.ok,
      commandLine: formatCommandLine('node', args),
      stdout: execution.stdout,
      stderr: execution.stderr,
      scout,
      scoutJsonPath: action.jsonPath,
      scoutMarkdownPath: action.markdownPath,
      max: action.max,
      scoutStatus: scout?.status ?? null,
      maxSide18ExceedsSide7: scout?.summary?.maxSide18ExceedsSide7 ?? null,
      globalMaxSide18Minus7: scout?.summary?.globalMaxSide18Minus7 ?? null,
    }, workspaceRoot, { runId, runDir });
    return {
      ok: execution.ok,
      dispatch,
      action,
      execution,
      scout,
      scoutJsonPath: action.jsonPath,
      scoutMarkdownPath: action.markdownPath,
      runBundle,
      error: execution.ok ? null : execution.stderr,
    };
  }

  if (action.actionId === 'structural_two_side_scout') {
    const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
    const runDir = getWorkspaceRunDir(runId, workspaceRoot);
    ensureDir(runDir);
    const args = [
      action.scriptPath,
      '--max',
      String(action.max),
      '--min-structural-n',
      String(action.minStructuralN),
      '--json-output',
      action.jsonPath,
      '--markdown-output',
      action.markdownPath,
    ];
    const execution = executeExternalCommand('node', args, repoRoot);
    const structuralScout = readJsonIfPresent(action.jsonPath);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: execution.ok,
      commandLine: formatCommandLine('node', args),
      stdout: execution.stdout,
      stderr: execution.stderr,
      structuralScout,
      structuralScoutJsonPath: action.jsonPath,
      structuralScoutMarkdownPath: action.markdownPath,
      max: action.max,
      minStructuralN: action.minStructuralN,
      structuralStatus: structuralScout?.status ?? null,
      unionFailureCount: structuralScout?.summary?.unionFailureCount ?? null,
      allUnionChecksPass: structuralScout?.summary?.allUnionChecksPass ?? null,
    }, workspaceRoot, { runId, runDir });
    return {
      ok: execution.ok,
      dispatch,
      action,
      execution,
      structuralScout,
      structuralScoutJsonPath: action.jsonPath,
      structuralScoutMarkdownPath: action.markdownPath,
      runBundle,
      error: execution.ok ? null : execution.stderr,
    };
  }

  if (action.actionId === 'mixed_base_failure_scout') {
    const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
    const runDir = getWorkspaceRunDir(runId, workspaceRoot);
    ensureDir(runDir);
    const args = [
      action.scriptPath,
      '--structural-json',
      action.structuralJsonPath,
      '--max-rows',
      String(action.maxRows),
      '--json-output',
      action.jsonPath,
      '--markdown-output',
      action.markdownPath,
    ];
    const execution = executeExternalCommand('node', args, repoRoot);
    const mixedBaseScout = readJsonIfPresent(action.jsonPath);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: execution.ok,
      commandLine: formatCommandLine('node', args),
      stdout: execution.stdout,
      stderr: execution.stderr,
      mixedBaseScout,
      mixedBaseScoutJsonPath: action.jsonPath,
      mixedBaseScoutMarkdownPath: action.markdownPath,
      structuralJsonPath: action.structuralJsonPath,
      maxRows: action.maxRows,
      mixedBaseStatus: mixedBaseScout?.status ?? null,
      mixedFailureCount: mixedBaseScout?.summary?.mixedFailureCount ?? null,
      allAnalyzedRowsMixedPass: mixedBaseScout?.summary?.allAnalyzedRowsMixedPass ?? null,
    }, workspaceRoot, { runId, runDir });
    return {
      ok: execution.ok,
      dispatch,
      action,
      execution,
      mixedBaseScout,
      mixedBaseScoutJsonPath: action.jsonPath,
      mixedBaseScoutMarkdownPath: action.markdownPath,
      runBundle,
      error: execution.ok ? null : execution.stderr,
    };
  }

  if (action.actionId === 'full_mixed_base_structural_verifier') {
    const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
    const runDir = getWorkspaceRunDir(runId, workspaceRoot);
    ensureDir(runDir);
    const args = [
      action.scriptPath,
      '--max',
      String(action.max),
      '--min-structural-n',
      String(action.minStructuralN),
      '--row-sample-limit',
      String(action.rowSampleLimit),
      '--json-output',
      action.jsonPath,
      '--markdown-output',
      action.markdownPath,
    ];
    const execution = executeExternalCommand('node', args, repoRoot);
    const fullMixedStructuralVerifier = readJsonIfPresent(action.jsonPath);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: execution.ok,
      commandLine: formatCommandLine('node', args),
      stdout: execution.stdout,
      stderr: execution.stderr,
      fullMixedStructuralVerifier,
      fullMixedStructuralJsonPath: action.jsonPath,
      fullMixedStructuralMarkdownPath: action.markdownPath,
      max: action.max,
      minStructuralN: action.minStructuralN,
      rowSampleLimit: action.rowSampleLimit,
      fullMixedStructuralStatus: fullMixedStructuralVerifier?.status ?? null,
      mixedFailureCount: fullMixedStructuralVerifier?.summary?.mixedFailureCount ?? null,
      allMixedChecksPass: fullMixedStructuralVerifier?.summary?.allMixedChecksPass ?? null,
      threateningOutsiderCheckCount: fullMixedStructuralVerifier?.summary?.threateningOutsiderCheckCount ?? null,
    }, workspaceRoot, { runId, runDir });
    return {
      ok: execution.ok,
      dispatch,
      action,
      execution,
      fullMixedStructuralVerifier,
      fullMixedStructuralJsonPath: action.jsonPath,
      fullMixedStructuralMarkdownPath: action.markdownPath,
      runBundle,
      error: execution.ok ? null : execution.stderr,
    };
  }

  if (action.actionId === 'structural_lift_miner') {
    const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
    const runDir = getWorkspaceRunDir(runId, workspaceRoot);
    ensureDir(runDir);
    const args = [
      action.scriptPath,
      '--verifier-json',
      action.verifierJsonPath,
      '--top-rows',
      String(action.topRows),
      '--family-limit',
      String(action.familyLimit),
      '--json-output',
      action.jsonPath,
      '--markdown-output',
      action.markdownPath,
    ];
    const execution = executeExternalCommand('node', args, repoRoot);
    const structuralLiftMiner = readJsonIfPresent(action.jsonPath);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: execution.ok,
      commandLine: formatCommandLine('node', args),
      stdout: execution.stdout,
      stderr: execution.stderr,
      structuralLiftMiner,
      structuralLiftMinerJsonPath: action.jsonPath,
      structuralLiftMinerMarkdownPath: action.markdownPath,
      verifierJsonPath: action.verifierJsonPath,
      topRows: action.topRows,
      familyLimit: action.familyLimit,
      structuralLiftStatus: structuralLiftMiner?.status ?? null,
      minedExactRowCount: structuralLiftMiner?.summary?.minedExactRowCount ?? null,
      primaryExactPrimes: structuralLiftMiner?.summary?.primaryExactPrimes ?? null,
      nextTheoremLane: structuralLiftMiner?.summary?.nextTheoremLane ?? null,
    }, workspaceRoot, { runId, runDir });
    return {
      ok: execution.ok,
      dispatch,
      action,
      execution,
      structuralLiftMiner,
      structuralLiftMinerJsonPath: action.jsonPath,
      structuralLiftMinerMarkdownPath: action.markdownPath,
      runBundle,
      error: execution.ok ? null : execution.stderr,
    };
  }

  if (action.actionId === 'matching_pattern_miner') {
    const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
    const runDir = getWorkspaceRunDir(runId, workspaceRoot);
    ensureDir(runDir);
    const args = [
      action.scriptPath,
      '--verifier-json',
      action.verifierJsonPath,
      '--prime',
      String(action.prime),
      '--top-rows',
      String(action.topRows),
      '--pair-sample-limit',
      String(action.pairSampleLimit),
      '--json-output',
      action.jsonPath,
      '--markdown-output',
      action.markdownPath,
    ];
    const execution = executeExternalCommand('node', args, repoRoot);
    const matchingPatternMiner = readJsonIfPresent(action.jsonPath);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: execution.ok,
      commandLine: formatCommandLine('node', args),
      stdout: execution.stdout,
      stderr: execution.stderr,
      matchingPatternMiner,
      matchingPatternMinerJsonPath: action.jsonPath,
      matchingPatternMinerMarkdownPath: action.markdownPath,
      verifierJsonPath: action.verifierJsonPath,
      prime: action.prime,
      topRows: action.topRows,
      pairSampleLimit: action.pairSampleLimit,
      matchingPatternStatus: matchingPatternMiner?.status ?? null,
      witnessRowCount: matchingPatternMiner?.summary?.witnessRowCount ?? null,
      minMatchingSlack: matchingPatternMiner?.summary?.minMatchingSlack ?? null,
    }, workspaceRoot, { runId, runDir });
    return {
      ok: execution.ok,
      dispatch,
      action,
      execution,
      matchingPatternMiner,
      matchingPatternMinerJsonPath: action.jsonPath,
      matchingPatternMinerMarkdownPath: action.markdownPath,
      runBundle,
      error: execution.ok ? null : execution.stderr,
    };
  }

  if (action.actionId === 'cpu_family_search' || action.actionId === 'gpu_profile_sweep') {
    const remoteSpec = {
      provider: action.remoteProvider ?? 'ssh',
      instanceName: action.remoteInstanceName ?? null,
      sshHost: action.remoteHost,
      engineRoot: action.remoteEngineRoot,
      pythonCommand: action.remotePythonCommand,
    };
    const remoteSync = action.actionId === 'gpu_profile_sweep' && action.source === 'ssh_remote'
      ? applyFrontierRemoteSync(workspaceRoot, {
          remoteId: action.remoteInstanceName ?? action.remoteHost,
          provider: remoteSpec.provider,
          instanceName: remoteSpec.instanceName,
          sshHost: action.remoteHost,
          engineRoot: action.remoteEngineRoot,
          pythonCommand: action.remotePythonCommand,
          laneId: action.laneId ?? null,
        })
      : null;
    const localSharedPrefixCount = dispatch.currentBridgeState?.shared_prefix_failure_count ?? null;
    const remoteSharedPrefixCount = remoteSync?.remoteLiveFrontier?.shared_prefix_failure_count ?? null;
    const syncGap = remoteSync && !remoteSync.ok
      ? (remoteSync.error ?? 'Remote frontier sync failed.')
      : remoteSync && remoteSharedPrefixCount !== null && localSharedPrefixCount !== null && remoteSharedPrefixCount < localSharedPrefixCount
        ? `Remote frontier sync is stale for canonical promotion (${remoteSharedPrefixCount} shared-prefix failures vs local ${localSharedPrefixCount}).`
        : null;

    if (syncGap) {
      const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
        ok: false,
        commandLine: action.commandLine,
        stdout: null,
        stderr: syncGap,
        remoteSync,
        integrationGap: syncGap,
      }, workspaceRoot);
      return {
        ok: false,
        dispatch,
        action,
        remoteSync,
        integrationGap: syncGap,
        runBundle,
      };
    }

    const executionSpec = action.actionId === 'gpu_profile_sweep' && action.source === 'ssh_remote' && options.profileOverride?.remoteCommand
      ? buildRemoteGpuExecutionSpec(remoteSpec, options.profileOverride.remoteCommand)
      : {
          executable: action.executable,
          args: action.args,
          commandLine: action.commandLine,
        };
    const execution = executeExternalCommand(executionSpec.executable, executionSpec.args, repoRoot);
    const remoteBundleDir = action.actionId === 'gpu_profile_sweep' && action.source === 'ssh_remote'
      ? parseP848RemoteBundleDir(execution.stdout)
      : null;
    const mirroredBundle = remoteBundleDir
      ? mirrorRemoteP848Bundle(remoteSpec, remoteBundleDir)
      : null;
    const remoteKnownFailurePacketCount = mirroredBundle?.manifest?.summary?.known_failure_packet_count ?? null;
    const remoteBestEffectiveCleanThrough = mirroredBundle?.manifest?.summary?.best_effective_clean_through ?? null;
    const localBestEffectiveCleanThrough = dispatch.currentBridgeState?.current_family_aware_leader?.effective_clean_through ?? null;
    const remoteBundleFreshEnough = remoteKnownFailurePacketCount === null
      || localSharedPrefixCount === null
      || remoteKnownFailurePacketCount >= localSharedPrefixCount;
    const remoteBundleDeepEnough = remoteBestEffectiveCleanThrough === null
      || localBestEffectiveCleanThrough === null
      || remoteBestEffectiveCleanThrough >= localBestEffectiveCleanThrough;
    let integrationGap = null;
    if (mirroredBundle && !remoteBundleFreshEnough) {
      integrationGap = `Remote GPU bundle is stale for canonical promotion (${remoteKnownFailurePacketCount} known packets vs local ${localSharedPrefixCount}).`;
    } else if (mirroredBundle && !remoteBundleDeepEnough) {
      integrationGap = `Remote GPU bundle is shallower than the canonical bridge (${remoteBestEffectiveCleanThrough} clean-through vs local ${localBestEffectiveCleanThrough}).`;
    }
    const searchCompleted = execution.ok && (mirroredBundle?.ok ?? true);
    const partial = searchCompleted && Boolean(integrationGap);
    const bridgeRefresh = execution.ok && !integrationGap ? refreshNumberTheoryBridge(problem) : null;
    const ok = searchCompleted && !integrationGap && (bridgeRefresh?.ok ?? true);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok,
      partial,
      commandLine: executionSpec.commandLine ?? action.commandLine,
      stdout: [execution.stdout, bridgeRefresh?.commandOutput].filter(Boolean).join('\n'),
      stderr: execution.stderr ?? mirroredBundle?.error ?? integrationGap ?? bridgeRefresh?.error ?? null,
      executionMode: action.mode,
      remoteSync,
      remoteBundleDir,
      mirroredBundle,
      integrationGap,
      bridgeRefresh,
      profileOverride: options.profileOverride ?? null,
    }, workspaceRoot);
    return {
      ok,
      partial,
      dispatch,
      action,
      remoteSync,
      execution,
      mirroredBundle,
      integrationGap,
      bridgeRefresh,
      runBundle,
    };
  }

  if (action.actionId === 'exact_interval_scout') {
    const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
    const runDir = getWorkspaceRunDir(runId, workspaceRoot);
    ensureDir(runDir);
    const resultsPath = path.join(runDir, 'EXACT_SMALL_N_RESULTS.json');
    const args = [
      action.scriptPath,
      '--min',
      String(action.min),
      '--max',
      String(action.max),
      ...(action.endpointMonotonicity ? ['--endpoint-monotonicity'] : []),
      '--json-output',
      resultsPath,
    ];
    const execution = executeExternalCommand('node', args, repoRoot);
    const results = readJsonIfPresent(resultsPath);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: execution.ok,
      commandLine: formatCommandLine('node', args),
      stdout: execution.stdout,
      stderr: execution.stderr,
      resultsPath,
      resultsSummary: results?.summary ?? null,
    }, workspaceRoot, { runId, runDir });
    return {
      ok: execution.ok,
      dispatch,
      action,
      execution,
      results,
      runBundle,
    };
  }

  if (action.actionId === 'exact_handoff_bundle') {
    const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
    const runDir = getWorkspaceRunDir(runId, workspaceRoot);
    ensureDir(runDir);
    const handoffResult = buildP848ExactHandoffBundle(problem, action, dispatch, runDir);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: handoffResult.ok,
      commandLine: action.commandLine,
      stdout: handoffResult.ok ? `exact_handoff_dir: ${handoffResult.handoffDir}` : null,
      stderr: handoffResult.ok ? null : handoffResult.error,
      handoff: handoffResult.handoff ?? null,
      handoffDir: handoffResult.handoffDir ?? null,
      handoffJsonPath: handoffResult.handoffJsonPath ?? null,
      handoffMarkdownPath: handoffResult.handoffMarkdownPath ?? null,
    }, workspaceRoot, { runId, runDir });
    return {
      ok: handoffResult.ok,
      dispatch,
      action,
      handoff: handoffResult,
      runBundle,
    };
  }

  if (action.actionId === 'exact_followup_launch') {
    const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
    const runDir = getWorkspaceRunDir(runId, workspaceRoot);
    ensureDir(runDir);

    const handoffResult = buildP848ExactHandoffBundle(problem, action, dispatch, runDir);
    if (!handoffResult.ok) {
      const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
        ok: false,
        commandLine: action.commandLine,
        stdout: null,
        stderr: handoffResult.error,
        handoff: null,
      }, workspaceRoot, { runId, runDir });
      return {
        ok: false,
        dispatch,
        action,
        handoff: handoffResult,
        runBundle,
      };
    }

    const followupDir = path.join(runDir, 'exact-followup');
    ensureDir(followupDir);
    const resultsPath = path.join(followupDir, 'EXACT_SMALL_N_RESULTS.json');
    const args = [
      action.scriptPath,
      '--min',
      String(action.min),
      '--max',
      String(action.max),
      ...(action.endpointMonotonicity ? ['--endpoint-monotonicity'] : []),
      '--json-output',
      resultsPath,
    ];
    const execution = executeExternalCommand('node', args, repoRoot);
    const results = readJsonIfPresent(resultsPath);
    const followupPacket = buildP848ExactFollowupPacket(
      problem,
      action,
      dispatch,
      handoffResult,
      results,
      execution,
      runDir,
      resultsPath,
    );
    const exactPromotion = handoffResult.ok && execution.ok && followupPacket.ok
      ? promoteP848ExactCoverage(workspaceRoot)
      : null;
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: handoffResult.ok && execution.ok && followupPacket.ok && (exactPromotion?.ok ?? true),
      commandLine: action.commandLine,
      stdout: [execution.stdout, `exact_handoff_dir: ${handoffResult.handoffDir}`].filter(Boolean).join('\n'),
      stderr: execution.stderr ?? exactPromotion?.error ?? null,
      handoffDir: handoffResult.handoffDir ?? null,
      handoffJsonPath: handoffResult.handoffJsonPath ?? null,
      handoffMarkdownPath: handoffResult.handoffMarkdownPath ?? null,
      exactFollowupDir: followupPacket.followupDir ?? null,
      exactFollowupJsonPath: followupPacket.followupJsonPath ?? null,
      exactFollowupMarkdownPath: followupPacket.followupMarkdownPath ?? null,
      resultsPath,
      resultsSummary: results?.summary ?? null,
      exactPromotion,
    }, workspaceRoot, { runId, runDir });
    return {
      ok: handoffResult.ok && execution.ok && followupPacket.ok && (exactPromotion?.ok ?? true),
      dispatch,
      action,
      handoff: handoffResult,
      execution,
      results,
      exactFollowup: followupPacket,
      exactPromotion,
      runBundle,
    };
  }

  if (action.actionId === 'exact_followup_rollout') {
    const runId = `${new Date().toISOString().replaceAll(':', '-')}__number_theory_p${problem.problemId}__${action.actionId}`;
    const runDir = getWorkspaceRunDir(runId, workspaceRoot);
    ensureDir(runDir);

    const childRuns = [];
    let encounteredError = null;
    for (const interval of action.rolloutIntervals ?? []) {
      const childResult = runNumberTheoryDispatch(problem, {
        actionId: 'exact_followup_launch',
        exactMin: interval.min,
        exactMax: interval.max,
        endpointMonotonicity: action.endpointMonotonicity,
      }, workspaceRoot);
      childRuns.push({
        index: interval.index,
        interval: interval.interval,
        min: interval.min,
        max: interval.max,
        ok: Boolean(childResult.ok),
        runId: childResult.runBundle?.runId ?? null,
        runDir: childResult.runBundle?.runDir ?? null,
        resultsSummary: childResult.results?.summary ?? null,
        exactPromotion: childResult.exactPromotion ?? null,
        error: childResult.error ?? childResult.execution?.stderr ?? null,
      });
      if (!childResult.ok) {
        encounteredError = childResult.error ?? `Exact rollout failed on chunk ${interval.interval}.`;
        break;
      }
    }

    const completedChunkCount = childRuns.filter((childRun) => childRun.ok).length;
    const bridgeRefresh = completedChunkCount > 0
      ? refreshNumberTheoryBridge(problem, workspaceRoot)
      : null;
    const rollout = buildP848ExactRolloutPacket(problem, action, dispatch, childRuns, bridgeRefresh, runDir);
    const runBundle = writeDispatchRunBundle(problem, dispatch, action, {
      ok: !encounteredError && (bridgeRefresh?.ok ?? true),
      commandLine: action.commandLine,
      stdout: [
        ...childRuns
          .filter((childRun) => childRun.ok)
          .map((childRun) => `chunk ${childRun.index}: ${childRun.interval} (${childRun.runId ?? 'no-run-id'})`),
        bridgeRefresh?.commandOutput,
      ].filter(Boolean).join('\n'),
      stderr: encounteredError ?? bridgeRefresh?.error ?? null,
      rolloutDir: rollout.rolloutDir ?? null,
      rolloutJsonPath: rollout.rolloutJsonPath ?? null,
      rolloutMarkdownPath: rollout.rolloutMarkdownPath ?? null,
      completedChunkCount,
      requestedChunkCount: action.chunkCount ?? null,
      childRuns,
      bridgeRefresh,
      rollout: rollout.packet ?? null,
    }, workspaceRoot, { runId, runDir });
    return {
      ok: !encounteredError && (bridgeRefresh?.ok ?? true),
      partial: Boolean(encounteredError && completedChunkCount > 0),
      dispatch,
      action,
      rollout,
      childRuns,
      completedChunkCount,
      requestedChunkCount: action.chunkCount ?? null,
      bridgeRefresh,
      runBundle,
      error: encounteredError ?? bridgeRefresh?.error ?? null,
    };
  }

  return {
    ok: false,
    dispatch,
    action,
    error: `Unhandled dispatch action: ${action.actionId}`,
  };
}

export function refreshNumberTheoryBridge(problem, workspaceRoot = getWorkspaceRoot()) {
  const exactPromotion = String(problem?.problemId ?? '') === '848'
    ? promoteP848ExactCoverage(workspaceRoot)
    : null;
  const refreshSpec = getSearchTheoremBridgeRefreshSpec(problem.problemId);
  if (!refreshSpec) {
    return {
      ok: false,
      problemId: problem.problemId,
      error: `No bridge refresh command is registered for problem ${problem.problemId}.`,
    };
  }

  try {
    const stdout = execFileSync(refreshSpec.executable, refreshSpec.args, {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();

    return {
      ok: true,
      refreshedAt: new Date().toISOString(),
      refreshCommand: getSearchTheoremBridgeRefreshCommand(problem.problemId),
      engineCommand: refreshSpec.engineCommand,
      executionMode: refreshSpec.executionMode,
      executionSource: refreshSpec.executionSource,
      executionReason: refreshSpec.executionReason,
      resolvedCommand: refreshSpec.resolvedCommand,
      commandOutput: stdout || null,
      exactPromotion,
      bridge: getNumberTheoryBridgeSnapshot(problem),
    };
  } catch (error) {
    return {
      ok: false,
      refreshedAt: new Date().toISOString(),
      refreshCommand: getSearchTheoremBridgeRefreshCommand(problem.problemId),
      engineCommand: refreshSpec.engineCommand,
      executionMode: refreshSpec.executionMode,
      executionSource: refreshSpec.executionSource,
      executionReason: refreshSpec.executionReason,
      resolvedCommand: refreshSpec.resolvedCommand,
      error: error?.stderr?.toString().trim() || error?.stdout?.toString().trim() || error?.message || 'Bridge refresh failed.',
      exactPromotion,
      bridge: getNumberTheoryBridgeSnapshot(problem),
    };
  }
}

export function getNumberTheoryRouteSnapshot(problem, routeId) {
  const snapshot = buildNumberTheoryStatusSnapshot(problem);
  const routeDetail = findRouteDetail(snapshot.opsDetails, routeId);
  if (!routeDetail) {
    return null;
  }
  return {
    ...snapshot,
    routeId,
    routeDetail,
  };
}

export function getNumberTheoryTicketSnapshot(problem, ticketId) {
  const snapshot = buildNumberTheoryStatusSnapshot(problem);
  const ticketDetail = findTicketDetail(snapshot.opsDetails, ticketId);
  if (!ticketDetail) {
    return null;
  }
  return {
    ...snapshot,
    ticketId,
    ticketDetail,
  };
}

export function getNumberTheoryAtomSnapshot(problem, atomId) {
  const snapshot = buildNumberTheoryStatusSnapshot(problem);
  const atomDetail = findAtomDetail(snapshot.opsDetails, atomId);
  if (!atomDetail) {
    return null;
  }
  return {
    ...snapshot,
    atomId,
    atomDetail,
  };
}
