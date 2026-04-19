import { spawnSync } from 'node:child_process';
import path from 'node:path';

import { ensureDir, fileExists, readJson, writeJson } from './files.js';
import { getWorkspaceOrpDir, getWorkspaceRegistryBucketDir, getWorkspaceRoot } from './paths.js';

const DEFAULT_ORP_BIN = 'orp';
const DEFAULT_OPENAI_SECRET_ALIAS = 'openai-primary';
const DEFAULT_OPENAI_ENV_VAR = 'OPENAI_API_KEY';
const PAID_RESEARCH_ALLOW_ENV = 'ERDOS_ORP_RESEARCH_ALLOW_PAID';
const PAID_RESEARCH_LIMIT_ENV = 'ERDOS_ORP_RESEARCH_DAILY_LIMIT';
const PAID_RESEARCH_BUDGET_ENV = 'ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT';
const PAID_RESEARCH_ESTIMATE_ENV = 'ERDOS_ORP_RESEARCH_ESTIMATED_COST_USD';
const DEFAULT_DAILY_LIVE_RUN_LIMIT = 10;
const DEFAULT_DAILY_SPEND_LIMIT_USD = 5;
const DEFAULT_ESTIMATED_ASK_COST_USD = 1;
const DEFAULT_ESTIMATED_SMOKE_COST_USD = 0.05;

function getOrpBin() {
  return process.env.ERDOS_ORP_BIN || DEFAULT_ORP_BIN;
}

function runOrp(args, options = {}) {
  const result = spawnSync(getOrpBin(), args, {
    cwd: options.cwd ?? getWorkspaceRoot(),
    encoding: 'utf8',
    maxBuffer: options.maxBuffer ?? 20 * 1024 * 1024,
    timeout: options.timeoutMs ?? 120_000,
  });

  return {
    ok: result.status === 0,
    status: result.status,
    signal: result.signal,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
    error: result.error ? String(result.error.message ?? result.error) : null,
    command: [getOrpBin(), ...args].join(' '),
  };
}

function parseJsonMaybe(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function currentUtcDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function parseDailyLimit() {
  const raw = process.env[PAID_RESEARCH_LIMIT_ENV];
  if (raw === undefined || raw === '') {
    return DEFAULT_DAILY_LIVE_RUN_LIMIT;
  }
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_DAILY_LIVE_RUN_LIMIT;
  }
  return parsed;
}

function roundUsd(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return 0;
  }
  return Math.round(numeric * 1_000_000) / 1_000_000;
}

function parseUsdEnv(envName, fallback) {
  const raw = process.env[envName];
  if (raw === undefined || raw === '') {
    return fallback;
  }
  const parsed = Number.parseFloat(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }
  return roundUsd(parsed);
}

function parseDailySpendLimitUsd() {
  return parseUsdEnv(PAID_RESEARCH_BUDGET_ENV, DEFAULT_DAILY_SPEND_LIMIT_USD);
}

function getDefaultEstimatedCostUsd(kind) {
  const fallback = kind === 'openai-check'
    ? DEFAULT_ESTIMATED_SMOKE_COST_USD
    : DEFAULT_ESTIMATED_ASK_COST_USD;
  return parseUsdEnv(PAID_RESEARCH_ESTIMATE_ENV, fallback);
}

function getEntryCostUsd(entry) {
  return roundUsd(entry?.costUsd ?? entry?.estimatedCostUsd ?? 0);
}

function getUsagePath(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceRegistryBucketDir('research', workspaceRoot), 'openai-live-usage.json');
}

function normalizeUsage(raw = {}, workspaceRoot = getWorkspaceRoot()) {
  return {
    schema: 'erdos.orp_research_usage/1',
    workspaceRoot,
    updatedAt: raw.updatedAt ?? null,
    entries: Array.isArray(raw.entries) ? raw.entries : [],
  };
}

export function getOpenAiResearchUsage(workspaceRoot = getWorkspaceRoot()) {
  const usagePath = getUsagePath(workspaceRoot);
  const usage = fileExists(usagePath)
    ? normalizeUsage(readJson(usagePath), workspaceRoot)
    : normalizeUsage({}, workspaceRoot);
  const day = currentUtcDay();
  const dailyLimit = parseDailyLimit();
  const dailySpendLimitUsd = parseDailySpendLimitUsd();
  const todayEntries = usage.entries.filter((entry) => entry.day === day);
  const todaySpendUsd = roundUsd(todayEntries.reduce((sum, entry) => sum + getEntryCostUsd(entry), 0));
  return {
    ...usage,
    usagePath,
    day,
    dailyLiveRunLimit: dailyLimit,
    todayLiveRunCount: todayEntries.length,
    todayRemainingLiveRuns: dailyLimit === 0 ? 0 : Math.max(0, dailyLimit - todayEntries.length),
    dailySpendLimitUsd,
    todaySpendUsd,
    todayRemainingSpendUsd: dailySpendLimitUsd === 0 ? 0 : roundUsd(Math.max(0, dailySpendLimitUsd - todaySpendUsd)),
    defaultEstimatedAskCostUsd: getDefaultEstimatedCostUsd('ask'),
    defaultEstimatedSmokeCostUsd: getDefaultEstimatedCostUsd('openai-check'),
    paidCallEnvVar: PAID_RESEARCH_ALLOW_ENV,
    dailyLimitEnvVar: PAID_RESEARCH_LIMIT_ENV,
    dailySpendLimitEnvVar: PAID_RESEARCH_BUDGET_ENV,
    estimatedCostEnvVar: PAID_RESEARCH_ESTIMATE_ENV,
  };
}

function saveOpenAiResearchUsage(usage, workspaceRoot = getWorkspaceRoot()) {
  const usagePath = getUsagePath(workspaceRoot);
  writeJson(usagePath, {
    schema: 'erdos.orp_research_usage/1',
    workspaceRoot,
    updatedAt: new Date().toISOString(),
    entries: usage.entries,
  });
  return getOpenAiResearchUsage(workspaceRoot);
}

function paidResearchAllowedByEnv() {
  return process.env[PAID_RESEARCH_ALLOW_ENV] === '1';
}

function buildBlockedResult(payload, asJson = false) {
  return {
    ok: false,
    status: 1,
    signal: null,
    stdout: asJson ? `${JSON.stringify(payload, null, 2)}\n` : '',
    stderr: asJson ? '' : `${payload.message}\n`,
    error: payload.message,
    command: payload.command ?? 'erdos orp research',
  };
}

function guardPaidResearchExecution({
  execute,
  allowPaid = false,
  kind = 'ask',
  estimatedCostUsd = null,
  asJson = false,
  workspaceRoot = getWorkspaceRoot(),
  command = 'erdos orp research',
}) {
  const usage = getOpenAiResearchUsage(workspaceRoot);
  const liveRunEstimatedCostUsd = roundUsd(estimatedCostUsd ?? getDefaultEstimatedCostUsd(kind));
  if (!execute) {
    return { ok: true, usage };
  }

  const allowedByEnv = paidResearchAllowedByEnv();
  if (!allowPaid && !allowedByEnv) {
    return {
      ok: false,
      result: buildBlockedResult({
        ok: false,
        status: 'blocked_by_paid_call_guard',
        reason: 'missing_paid_call_opt_in',
        message: `Blocked live ORP/OpenAI call. Add --allow-paid for this one command, or set ${PAID_RESEARCH_ALLOW_ENV}=1 for an intentional paid-call session.`,
        requiredFlags: ['--execute', '--allow-paid'],
        envOptIn: PAID_RESEARCH_ALLOW_ENV,
        usage,
        command,
      }, asJson),
    };
  }

  if (usage.dailySpendLimitUsd <= 0) {
    return {
      ok: false,
      result: buildBlockedResult({
        ok: false,
        status: 'blocked_by_paid_call_guard',
        reason: 'daily_spend_limit_zero',
        message: `Blocked live ORP/OpenAI call. ${PAID_RESEARCH_BUDGET_ENV}=0 disables paid research spend for this workspace/session.`,
        requiredFlags: ['--execute', '--allow-paid'],
        envOptIn: PAID_RESEARCH_ALLOW_ENV,
        estimatedCostUsd: liveRunEstimatedCostUsd,
        usage,
        command,
      }, asJson),
    };
  }

  if (usage.dailyLiveRunLimit <= 0) {
    return {
      ok: false,
      result: buildBlockedResult({
        ok: false,
        status: 'blocked_by_paid_call_guard',
        reason: 'daily_live_run_limit_zero',
        message: `Blocked live ORP/OpenAI call. ${PAID_RESEARCH_LIMIT_ENV}=0 disables paid research calls for this workspace/session.`,
        requiredFlags: ['--execute', '--allow-paid'],
        envOptIn: PAID_RESEARCH_ALLOW_ENV,
        usage,
        command,
      }, asJson),
    };
  }

  if (roundUsd(usage.todaySpendUsd + liveRunEstimatedCostUsd) > usage.dailySpendLimitUsd) {
    return {
      ok: false,
      result: buildBlockedResult({
        ok: false,
        status: 'blocked_by_paid_call_guard',
        reason: 'daily_spend_limit_would_exceed',
        message: `Blocked live ORP/OpenAI call. Estimated cost $${liveRunEstimatedCostUsd} would exceed the daily research API budget ($${usage.todaySpendUsd}/$${usage.dailySpendLimitUsd} already used).`,
        requiredFlags: ['--execute', '--allow-paid'],
        envOptIn: PAID_RESEARCH_ALLOW_ENV,
        estimatedCostUsd: liveRunEstimatedCostUsd,
        usage,
        command,
      }, asJson),
    };
  }

  if (usage.todayLiveRunCount >= usage.dailyLiveRunLimit) {
    return {
      ok: false,
      result: buildBlockedResult({
        ok: false,
        status: 'blocked_by_paid_call_guard',
        reason: 'daily_live_run_limit_reached',
        message: `Blocked live ORP/OpenAI call. Daily live-run cap reached (${usage.todayLiveRunCount}/${usage.dailyLiveRunLimit}).`,
        requiredFlags: ['--execute', '--allow-paid'],
        envOptIn: PAID_RESEARCH_ALLOW_ENV,
        usage,
        command,
      }, asJson),
    };
  }

  return {
    ok: true,
    usage,
    allowedBy: allowPaid ? '--allow-paid' : PAID_RESEARCH_ALLOW_ENV,
    estimatedCostUsd: liveRunEstimatedCostUsd,
  };
}

function numericUsdMaybe(value) {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return roundUsd(value);
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed) && parsed >= 0) {
      return roundUsd(parsed);
    }
  }
  return null;
}

function getPathValue(source, pathParts) {
  let current = source;
  for (const part of pathParts) {
    if (!current || typeof current !== 'object' || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

function extractObjectCostUsd(source) {
  const paths = [
    ['cost_usd'],
    ['total_cost_usd'],
    ['estimated_cost_usd'],
    ['billing_usd'],
    ['usage', 'cost_usd'],
    ['usage', 'total_cost_usd'],
    ['billing', 'cost_usd'],
    ['cost', 'usd'],
    ['api_call', 'cost_usd'],
    ['api_call', 'usage', 'cost_usd'],
    ['apiCall', 'costUsd'],
    ['costUsd'],
  ];
  for (const pathParts of paths) {
    const cost = numericUsdMaybe(getPathValue(source, pathParts));
    if (cost !== null) {
      return cost;
    }
  }
  return null;
}

function extractReportedCostUsd(payload, laneStatuses) {
  const topLevelCost = extractObjectCostUsd(payload);
  if (topLevelCost !== null) {
    return topLevelCost;
  }
  const laneCosts = laneStatuses
    .map((lane) => extractObjectCostUsd(lane))
    .filter((cost) => cost !== null);
  if (laneCosts.length === 0) {
    return null;
  }
  return roundUsd(laneCosts.reduce((sum, cost) => sum + cost, 0));
}

function summarizeLiveRunResult(result, estimatedCostUsd = null) {
  const payload = parseJsonMaybe(result.stdout);
  const laneStatuses = Array.isArray(payload?.lane_statuses)
    ? payload.lane_statuses
    : Array.isArray(payload?.lanes)
      ? payload.lanes
      : [];
  const reportedCostUsd = extractReportedCostUsd(payload, laneStatuses);
  const fallbackEstimatedCostUsd = roundUsd(estimatedCostUsd ?? 0);
  return {
    runId: payload?.run_id ?? payload?.runId ?? null,
    status: payload?.status ?? null,
    ok: Boolean(result.ok),
    apiCalledLaneCount: laneStatuses.filter((lane) => lane.api_called === true || lane.api_call?.called === true).length,
    laneCount: laneStatuses.length,
    models: Array.from(new Set(laneStatuses.map((lane) => lane.model).filter(Boolean))).sort(),
    estimatedCostUsd: fallbackEstimatedCostUsd,
    reportedCostUsd,
    costUsd: reportedCostUsd ?? fallbackEstimatedCostUsd,
    costSource: reportedCostUsd !== null ? 'orp_reported' : 'local_estimate',
  };
}

function recordPaidResearchRun({
  workspaceRoot = getWorkspaceRoot(),
  kind,
  profile,
  runId,
  allowedBy,
  estimatedCostUsd,
  result,
}) {
  const usage = getOpenAiResearchUsage(workspaceRoot);
  const summary = summarizeLiveRunResult(result, estimatedCostUsd);
  usage.entries.push({
    at: new Date().toISOString(),
    day: currentUtcDay(),
    kind,
    profile: profile ?? null,
    runId: summary.runId ?? runId ?? null,
    allowedBy,
    resultStatus: summary.status,
    ok: summary.ok,
    apiCalledLaneCount: summary.apiCalledLaneCount,
    laneCount: summary.laneCount,
    models: summary.models,
    estimatedCostUsd: summary.estimatedCostUsd,
    reportedCostUsd: summary.reportedCostUsd,
    costUsd: summary.costUsd,
    costSource: summary.costSource,
    dailySpendLimitUsdAtRun: usage.dailySpendLimitUsd,
  });
  return saveOpenAiResearchUsage(usage, workspaceRoot);
}

function compactCommandResult(result) {
  return {
    ok: result.ok,
    status: result.status,
    signal: result.signal,
    error: result.error,
    stderr: result.stderr.trim() || null,
  };
}

function createOpenAiSmokeProfile(workspaceRoot = getWorkspaceRoot()) {
  const profilesDir = path.join(getWorkspaceOrpDir(workspaceRoot), 'research-profiles');
  ensureDir(profilesDir);
  const profilePath = path.join(profilesDir, 'openai-smoke.json');
  const profile = {
    schema_version: '1.0.0',
    profile_id: 'openai-smoke',
    label: 'OpenAI smoke test',
    description: 'Single-lane, low-output ORP profile for verifying OpenAI Responses API reachability without running a full research council.',
    execution_policy: {
      live_requires_execute: true,
      process_only: true,
      secrets_not_persisted: true,
      default_timeout_sec: 30,
    },
    call_moments: [
      {
        moment_id: 'plan',
        label: 'Local decomposition plan',
        calls_api: false,
        description: 'Create ORP artifacts without resolving an API key.',
      },
      {
        moment_id: 'openai_smoke',
        label: 'OpenAI API smoke check',
        calls_api: true,
        secret_alias: DEFAULT_OPENAI_SECRET_ALIAS,
        env_var: DEFAULT_OPENAI_ENV_VAR,
        description: 'Call a small GPT-5.4 mini Responses API lane to verify reachability.',
      },
    ],
    lanes: [
      {
        lane_id: 'openai_smoke',
        call_moment: 'openai_smoke',
        label: 'OpenAI smoke lane',
        provider: 'openai',
        model: 'gpt-5.4-mini',
        adapter: 'openai_responses',
        role: 'Return exactly one concise API reachability confirmation. Do not perform web search or long research.',
        env_var: DEFAULT_OPENAI_ENV_VAR,
        secret_alias: DEFAULT_OPENAI_SECRET_ALIAS,
        reasoning_effort: 'low',
        text_verbosity: 'low',
        max_output_tokens: 256,
      },
    ],
    synthesis: {
      style: 'answer_with_lane_evidence',
      require_disagreements: false,
      require_open_questions: false,
    },
  };
  writeJson(profilePath, profile);
  return { profilePath, profile };
}

export function getOrpResearchIntegrationStatus(workspaceRoot = getWorkspaceRoot()) {
  const orpHelp = runOrp(['--help'], { cwd: workspaceRoot, timeoutMs: 15_000, maxBuffer: 2 * 1024 * 1024 });
  const researchHelp = orpHelp.ok
    ? runOrp(['research', '--help'], { cwd: workspaceRoot, timeoutMs: 15_000, maxBuffer: 2 * 1024 * 1024 })
    : null;
  const askHelp = researchHelp?.ok
    ? runOrp(['research', 'ask', '--help'], { cwd: workspaceRoot, timeoutMs: 15_000, maxBuffer: 2 * 1024 * 1024 })
    : null;
  const localSecret = researchHelp?.ok
    ? runOrp(
        ['secrets', 'resolve', DEFAULT_OPENAI_SECRET_ALIAS, '--local-only', '--json'],
        { cwd: workspaceRoot, timeoutMs: 15_000, maxBuffer: 2 * 1024 * 1024 },
      )
    : null;
  const localSecretPayload = parseJsonMaybe(localSecret?.stdout ?? '');
  const usage = getOpenAiResearchUsage(workspaceRoot);

  return {
    schema: 'erdos.orp_research_integration/1',
    workspaceRoot,
    orp: {
      bin: getOrpBin(),
      available: orpHelp.ok,
      help: compactCommandResult(orpHelp),
    },
    researchModule: {
      available: Boolean(researchHelp?.ok && askHelp?.ok),
      help: researchHelp ? compactCommandResult(researchHelp) : null,
      askHelp: askHelp ? compactCommandResult(askHelp) : null,
    },
    openai: {
      envVarName: DEFAULT_OPENAI_ENV_VAR,
      envPresent: Boolean(process.env[DEFAULT_OPENAI_ENV_VAR]),
      secretAlias: DEFAULT_OPENAI_SECRET_ALIAS,
      localKeychainPresent: Boolean(localSecretPayload?.ok && localSecretPayload?.source === 'keychain'),
      localSecretStatus: localSecretPayload?.secret?.status ?? null,
      localSecretSource: localSecretPayload?.source ?? null,
      hostedSecretStoreChecked: false,
      hostedSecretStoreNote: 'Not checked by this command; local Keychain is preferred for agent-safe OpenAI API use.',
      valueRevealed: false,
    },
    liveCalls: {
      defaultMode: 'planning_only',
      requiresExecuteFlag: true,
      requiresAllowPaidFlag: true,
      smokeProfileModel: 'gpt-5.4-mini',
      fullCouncilProfile: 'openai-council',
      paidCallEnvVar: PAID_RESEARCH_ALLOW_ENV,
      dailyLimitEnvVar: PAID_RESEARCH_LIMIT_ENV,
      dailySpendLimitEnvVar: PAID_RESEARCH_BUDGET_ENV,
      estimatedCostEnvVar: PAID_RESEARCH_ESTIMATE_ENV,
      dailyLiveRunLimit: usage.dailyLiveRunLimit,
      todayLiveRunCount: usage.todayLiveRunCount,
      todayRemainingLiveRuns: usage.todayRemainingLiveRuns,
      dailySpendLimitUsd: usage.dailySpendLimitUsd,
      todaySpendUsd: usage.todaySpendUsd,
      todayRemainingSpendUsd: usage.todayRemainingSpendUsd,
      defaultEstimatedAskCostUsd: usage.defaultEstimatedAskCostUsd,
      defaultEstimatedSmokeCostUsd: usage.defaultEstimatedSmokeCostUsd,
      usagePath: usage.usagePath,
      policy: 'The Erdos CLI may create ORP research plans without API spend. Live OpenAI calls require both --execute and --allow-paid, or ERDOS_ORP_RESEARCH_ALLOW_PAID=1, and are capped by the local daily live-run and daily USD spend guards.',
      recommendedUse: 'Use live calls at high-leverage source-audit, theorem-wedge, external-reference, or repeated-local-stall moments; do not use them for routine local tests, deterministic compute, or broad fishing.',
    },
    commands: {
      status: 'erdos orp research status --json',
      plan: 'erdos orp research ask <problem-id> --question "<question>" --json',
      execute: 'erdos orp research ask <problem-id> --question "<question>" --execute --allow-paid --json',
      openaiCheckPlan: 'erdos orp research openai-check --json',
      openaiCheckLive: 'erdos orp research openai-check --execute --allow-paid --json',
      runStatus: 'erdos orp research run-status <run-id> --json',
      show: 'erdos orp research show <run-id> --json',
      usage: 'erdos orp research usage --json',
    },
  };
}

export function buildProblemResearchQuestion(problem, question) {
  return [
    `Erdos Problem #${problem.problemId}: ${problem.title ?? problem.displayName}`,
    '',
    'Research/discovery request:',
    question,
    '',
    'Use this as an ORP process artifact, not as canonical proof by itself.',
    'Return source-backed findings, disagreements, proof boundaries, and the next verification artifact or command.',
    'Do not claim the problem is decided unless the repo has a finite cover, decreasing measure, or completed formal proof object.',
  ].join('\n');
}

export function runOrpResearchAsk({
  problem,
  question,
  runId,
  execute = false,
  allowPaid = false,
  profile = 'openai-council',
  profileFile = null,
  timeoutSec = 120,
  asJson = false,
  workspaceRoot = getWorkspaceRoot(),
}) {
  const args = ['research', 'ask'];
  let paidCallAllowedBy = null;
  let liveRunEstimatedCostUsd = getDefaultEstimatedCostUsd('ask');
  const ledgerProfile = profileFile
    ? `profile-file:${path.relative(workspaceRoot, path.resolve(workspaceRoot, profileFile))}`
    : profile;
  if (profileFile) {
    args.push('--profile-file', profileFile);
  } else if (profile) {
    args.push('--profile', profile);
  }
  if (runId) {
    args.push('--run-id', runId);
  }
  if (execute) {
    const guard = guardPaidResearchExecution({
      execute,
      allowPaid,
      kind: 'ask',
      estimatedCostUsd: liveRunEstimatedCostUsd,
      asJson,
      workspaceRoot,
      command: `erdos orp research ask ${problem.problemId} --execute`,
    });
    if (!guard.ok) {
      return guard.result;
    }
    paidCallAllowedBy = guard.allowedBy;
    liveRunEstimatedCostUsd = guard.estimatedCostUsd;
    args.push('--execute');
  }
  if (timeoutSec) {
    args.push('--timeout-sec', String(timeoutSec));
  }
  if (asJson) {
    args.push('--json');
  }
  args.push(buildProblemResearchQuestion(problem, question));
  const result = runOrp(args, { cwd: workspaceRoot, timeoutMs: Math.max(60_000, Number(timeoutSec) * 1000 + 30_000) });
  if (execute) {
    recordPaidResearchRun({
      workspaceRoot,
      kind: 'ask',
      profile: ledgerProfile,
      runId,
      allowedBy: paidCallAllowedBy,
      estimatedCostUsd: liveRunEstimatedCostUsd,
      result,
    });
  }
  return result;
}

export function runOrpResearchShow(runId = 'latest', asJson = false, workspaceRoot = getWorkspaceRoot()) {
  return runOrp(['research', 'show', runId, ...(asJson ? ['--json'] : [])], { cwd: workspaceRoot });
}

export function runOrpResearchRunStatus(runId = 'latest', asJson = false, workspaceRoot = getWorkspaceRoot()) {
  return runOrp(['research', 'status', runId, ...(asJson ? ['--json'] : [])], { cwd: workspaceRoot });
}

export function runOpenAiSmokeCheck({
  execute = false,
  allowPaid = false,
  runId = null,
  asJson = false,
  timeoutSec = 30,
  workspaceRoot = getWorkspaceRoot(),
}) {
  const { profilePath } = createOpenAiSmokeProfile(workspaceRoot);
  const finalRunId = runId ?? `erdos-openai-smoke-${new Date().toISOString().replace(/[^0-9TZ]/g, '').replace(/Z$/, 'Z')}`;
  let paidCallAllowedBy = null;
  let liveRunEstimatedCostUsd = getDefaultEstimatedCostUsd('openai-check');
  const args = [
    'research',
    'ask',
    '--profile-file',
    profilePath,
    '--run-id',
    finalRunId,
    '--timeout-sec',
    String(timeoutSec),
  ];
  if (execute) {
    const guard = guardPaidResearchExecution({
      execute,
      allowPaid,
      kind: 'openai-check',
      estimatedCostUsd: liveRunEstimatedCostUsd,
      asJson,
      workspaceRoot,
      command: 'erdos orp research openai-check --execute',
    });
    if (!guard.ok) {
      return {
        result: guard.result,
        profilePath,
        runId: finalRunId,
      };
    }
    paidCallAllowedBy = guard.allowedBy;
    liveRunEstimatedCostUsd = guard.estimatedCostUsd;
    args.push('--execute');
  }
  if (asJson) {
    args.push('--json');
  }
  args.push('Verify OpenAI Responses API reachability for erdos-problems. Reply exactly with one short OK sentence and no extra research.');
  const result = runOrp(args, { cwd: workspaceRoot, timeoutMs: Math.max(60_000, Number(timeoutSec) * 1000 + 30_000) });
  if (execute) {
    recordPaidResearchRun({
      workspaceRoot,
      kind: 'openai-check',
      profile: 'openai-smoke',
      runId: finalRunId,
      allowedBy: paidCallAllowedBy,
      estimatedCostUsd: liveRunEstimatedCostUsd,
      result,
    });
  }
  return {
    result,
    profilePath,
    runId: finalRunId,
  };
}
