import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { ensureDir, readJson, writeJson, writeText } from './files.js';
import {
  joinRemotePath,
  quotePosixShellArg,
  runRemoteCommandCapture,
  runRemoteCopyFromCapture,
  runRemoteCopyToCapture,
} from './frontier-remote.js';
import { getWorkspaceDir, getWorkspaceRoot, repoRoot } from './paths.js';

function getFrontierSessionsDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'frontier', 'sessions');
}

function getFrontierSessionDir(sessionId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getFrontierSessionsDir(workspaceRoot), String(sessionId));
}

function getFrontierSessionRecordPath(sessionId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getFrontierSessionDir(sessionId, workspaceRoot), 'SESSION.json');
}

function getFrontierSessionStdoutPath(sessionId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getFrontierSessionDir(sessionId, workspaceRoot), 'stdout.log');
}

function getFrontierSessionStderrPath(sessionId, workspaceRoot = getWorkspaceRoot()) {
  return path.join(getFrontierSessionDir(sessionId, workspaceRoot), 'stderr.log');
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

function parseJsonDocument(text) {
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(String(text).trim());
  } catch {
    return null;
  }
}

function stableSortValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => stableSortValue(item));
  }
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort()
      .reduce((accumulator, key) => {
        accumulator[key] = stableSortValue(value[key]);
        return accumulator;
      }, {});
  }
  return value;
}

function buildSessionReuseFingerprint(spec = {}) {
  const backend = spec.backend ?? 'local';
  const base = {
    backend,
    kind: spec.kind ?? 'frontier_dispatch',
    problemId: spec.problemId ?? null,
    actionId: spec.actionId ?? null,
    mode: spec.mode ?? null,
    source: spec.source ?? null,
  };

  if (backend === 'remote_ssh' || backend === 'remote_brev') {
    const remoteProvider = spec.remoteProvider ?? (backend === 'remote_brev' ? 'brev' : 'ssh');
    const remoteInstanceName = spec.remoteInstanceName ?? null;
    const remoteHost = spec.remoteHost ?? (remoteProvider === 'brev' ? remoteInstanceName : null);
    return JSON.stringify(stableSortValue({
      ...base,
      remoteProvider,
      remoteInstanceName,
      remoteHost,
      remoteEngineRoot: spec.remoteEngineRoot ?? null,
      remotePythonCommand: spec.remotePythonCommand ?? null,
      remoteCommandLine: String(spec.remoteCommandLine ?? '').trim(),
    }));
  }

  return JSON.stringify(stableSortValue({
    ...base,
    cwd: spec.cwd ?? null,
    executable: spec.executable ?? 'node',
    args: Array.isArray(spec.args) ? spec.args : [],
  }));
}

function buildRecordReuseFingerprint(record = {}) {
  if (!record) {
    return null;
  }
  return buildSessionReuseFingerprint({
    backend: record.backend ?? 'local',
    kind: record.kind ?? 'frontier_dispatch',
    problemId: record.problemId ?? null,
    actionId: record.actionId ?? null,
    mode: record.mode ?? null,
    source: record.source ?? null,
    cwd: record.cwd ?? null,
    executable: record.executable ?? 'node',
    args: Array.isArray(record.args) ? record.args : [],
    remoteProvider: record.metadata?.remoteProvider ?? (record.backend === 'remote_brev' ? 'brev' : 'ssh'),
    remoteInstanceName: record.metadata?.remoteInstanceName ?? null,
    remoteHost: record.metadata?.remoteHost ?? null,
    remoteEngineRoot: record.metadata?.remoteEngineRoot ?? null,
    remotePythonCommand: record.metadata?.remotePythonCommand ?? null,
    remoteCommandLine: record.metadata?.remoteCommandLine ?? null,
  });
}

function parseP848RemoteBundleDir(text) {
  const match = String(text ?? '').match(/p848_seed_bundle:\s*(.+)$/m);
  return match ? match[1].trim() : null;
}

function normalizeRemoteBundleDir(record, remoteBundleDir) {
  if (!remoteBundleDir) {
    return null;
  }
  const provider = record?.metadata?.remoteProvider ?? (record?.backend === 'remote_brev' ? 'brev' : 'ssh');
  if (provider === 'brev') {
    const normalized = String(remoteBundleDir).replaceAll('\\', '/');
    if (normalized.startsWith('/')) {
      return normalized;
    }
    const engineRoot = String(record?.metadata?.remoteEngineRoot ?? '~/frontier-engine').replaceAll('\\', '/');
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

function getP848LocalBundleDir(remoteBundleDir) {
  if (!remoteBundleDir) {
    return null;
  }
  const bundleName = remoteBundleDir.includes('\\')
    ? path.win32.basename(remoteBundleDir)
    : path.posix.basename(remoteBundleDir);
  return path.join(repoRoot, 'research', 'frontier-engine', 'artifacts', 'p848-anchor-ladder', bundleName);
}

function readP848Manifest(localBundleDir) {
  if (!localBundleDir) {
    return null;
  }
  const manifestPath = path.join(localBundleDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return null;
  }
  try {
    return readJson(manifestPath);
  } catch {
    return null;
  }
}

function maybeHarvestRemoteP848Bundle(record, snapshot, workspaceRoot = getWorkspaceRoot()) {
  const isP848GpuSweep = String(record?.problemId ?? '') === '848'
    && String(record?.actionId ?? '') === 'gpu_profile_sweep'
    && (record?.backend === 'remote_brev' || record?.backend === 'remote_ssh');
  if (!isP848GpuSweep || snapshot?.running || snapshot?.status !== 'completed') {
    return null;
  }

  const existingHarvest = record?.metadata?.harvestedBundle ?? null;
  if (existingHarvest?.ok && existingHarvest?.localBundleDir && fs.existsSync(existingHarvest.localBundleDir)) {
    return existingHarvest;
  }

  const remoteBundleDir = normalizeRemoteBundleDir(
    record,
    parseP848RemoteBundleDir((snapshot?.stdoutTail ?? []).join('\n')),
  );
  if (!remoteBundleDir) {
    return null;
  }

  const localBundleDir = getP848LocalBundleDir(remoteBundleDir);
  ensureDir(path.dirname(localBundleDir));

  const existingManifest = readP848Manifest(localBundleDir);
  if (existingManifest) {
    return {
      ok: true,
      remoteBundleDir,
      localBundleDir,
      manifestPath: path.join(localBundleDir, 'manifest.json'),
      candidateFiles: existingManifest.candidate_files?.map((row) => row?.file).filter(Boolean) ?? [],
      harvestedAt: new Date().toISOString(),
      harvestedBy: 'session_snapshot',
      alreadyPresent: true,
    };
  }

  const remoteTarget = {
    provider: record?.metadata?.remoteProvider ?? (record?.backend === 'remote_brev' ? 'brev' : 'ssh'),
    instanceName: record?.metadata?.remoteInstanceName ?? null,
    sshHost: record?.metadata?.remoteHost ?? null,
  };
  const copyResult = runRemoteCopyFromCapture(remoteTarget, remoteBundleDir, path.dirname(localBundleDir), {
    cwd: workspaceRoot,
    recursive: true,
  });
  if (!copyResult.ok) {
    return {
      ok: false,
      remoteBundleDir,
      localBundleDir,
      error: copyResult.stderr ?? 'failed to harvest remote bundle',
      harvestedAt: new Date().toISOString(),
      harvestedBy: 'session_snapshot',
    };
  }

  const manifest = readP848Manifest(localBundleDir);
  if (!manifest) {
    return {
      ok: false,
      remoteBundleDir,
      localBundleDir,
      error: 'remote bundle copied but manifest.json is missing locally',
      harvestedAt: new Date().toISOString(),
      harvestedBy: 'session_snapshot',
    };
  }

  return {
    ok: true,
    remoteBundleDir,
    localBundleDir,
    manifestPath: path.join(localBundleDir, 'manifest.json'),
    candidateFiles: manifest.candidate_files?.map((row) => row?.file).filter(Boolean) ?? [],
    harvestedAt: new Date().toISOString(),
    harvestedBy: 'session_snapshot',
    alreadyPresent: false,
  };
}

function runCommandCapture(command, options = {}) {
  try {
    const stdout = execFileSync(command.executable, command.args ?? [], {
      cwd: options.cwd ?? repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return {
      ok: true,
      stdout: stdout.trim(),
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

function toPowerShellEncodedCommand(script) {
  return Buffer.from(String(script), 'utf16le').toString('base64');
}

function quotePowerShellString(value) {
  return `'${String(value ?? '').replaceAll("'", "''")}'`;
}

function runRemotePowerShellCapture(sshHost, script, options = {}) {
  if (!sshHost) {
    return {
      ok: false,
      stdout: null,
      stderr: 'remote ssh host missing',
    };
  }
  return runCommandCapture({
    executable: 'ssh',
    args: [
      sshHost,
      'powershell',
      '-NoProfile',
      '-NonInteractive',
      '-EncodedCommand',
      toPowerShellEncodedCommand(script),
    ],
  }, options);
}

function generateSessionId({ problemId = 'unknown', actionId = 'session' } = {}) {
  const timestamp = new Date().toISOString().replaceAll(':', '-');
  return `${timestamp}__frontier__p${problemId}__${actionId}`;
}

function readTail(filePath, maxLines = 12) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const text = fs.readFileSync(filePath, 'utf8').trimEnd();
  if (!text) {
    return [];
  }
  const lines = text.split(/\r?\n/);
  return lines.slice(Math.max(0, lines.length - maxLines));
}

function parseRunDirFromTail(lines) {
  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const match = String(lines[index]).match(/^Run dir:\s*(.+)$/);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

function probeLocalProcess(pid) {
  if (!Number.isInteger(pid) || pid <= 0) {
    return { running: false, error: 'missing pid' };
  }
  try {
    process.kill(pid, 0);
    return { running: true, error: null };
  } catch (error) {
    if (error?.code === 'EPERM') {
      return { running: true, error: null };
    }
    if (error?.code === 'ESRCH') {
      return { running: false, error: null };
    }
    return { running: false, error: error?.message ?? 'process probe failed' };
  }
}

function computeReviewState(record, running) {
  if (!record.reviewAfterHours) {
    return {
      dueAt: null,
      state: 'not_scheduled',
    };
  }
  const launchedAtMs = Date.parse(record.launchedAt);
  if (Number.isNaN(launchedAtMs)) {
    return {
      dueAt: null,
      state: 'not_scheduled',
    };
  }
  const dueAt = new Date(launchedAtMs + (Number(record.reviewAfterHours) * 60 * 60 * 1000)).toISOString();
  const due = Date.now() >= Date.parse(dueAt);
  return {
    dueAt,
    state: running ? (due ? 'due' : 'scheduled') : 'completed',
  };
}

function buildRemoteSessionDir(remoteRoot, sessionId) {
  return `${String(remoteRoot).replace(/[\\\/]+$/, '')}\\sessions\\${sessionId}`;
}

function buildRemoteLinuxSessionDir(remoteRoot, sessionId) {
  return joinRemotePath({ provider: 'brev' }, remoteRoot, 'sessions', sessionId);
}

function toRemoteScpPath(remoteWindowsPath) {
  if (!remoteWindowsPath) {
    return null;
  }
  const normalized = String(remoteWindowsPath).replaceAll('\\', '/');
  if (normalized.startsWith('%USERPROFILE%/')) {
    return normalized.slice('%USERPROFILE%/'.length);
  }
  if (/^[A-Za-z]:\//.test(normalized)) {
    return `/${normalized}`;
  }
  return normalized.replace(/^\.\/+/, '');
}

function buildRemoteLinuxWorkerScript({
  sessionId,
  remoteSessionDir,
  remoteCommandLine,
}) {
  return `#!/usr/bin/env python3
import json
import os
import subprocess
from datetime import datetime, timezone

def now():
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

def write_record(payload):
    with open(record_path, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, indent=2)

session_dir = ${JSON.stringify(String(remoteSessionDir))}
record_path = os.path.join(session_dir, "SESSION.json")
stdout_path = os.path.join(session_dir, "stdout.log")
stderr_path = os.path.join(session_dir, "stderr.log")
command_line = ${JSON.stringify(String(remoteCommandLine))}

os.makedirs(session_dir, exist_ok=True)
record = {
    "schema": "erdos.remote_frontier_session/3",
    "remoteSessionId": ${JSON.stringify(String(sessionId))},
    "launchedAt": now(),
    "status": "running",
    "workerPid": os.getpid(),
    "childPid": None,
    "sessionDir": session_dir,
    "stdoutPath": stdout_path,
    "stderrPath": stderr_path,
    "remoteCommandLine": command_line,
    "exitCode": None,
    "error": None,
}
write_record(record)

try:
    with open(stdout_path, "ab") as stdout_handle, open(stderr_path, "ab") as stderr_handle:
        child = subprocess.Popen(
            command_line,
            shell=True,
            executable="/bin/bash",
            stdout=stdout_handle,
            stderr=stderr_handle,
            start_new_session=True,
        )
        record["childPid"] = child.pid
        record["startedCommandAt"] = now()
        write_record(record)
        exit_code = child.wait()
        record["completedAt"] = now()
        record["exitCode"] = int(exit_code)
        if record.get("status") == "stop_requested":
            record["status"] = "stopped"
        elif exit_code == 0:
            record["status"] = "completed"
        else:
            record["status"] = "failed"
except Exception as exc:
    record["completedAt"] = now()
    if record.get("status") == "stop_requested":
        record["status"] = "stopped"
    else:
        record["status"] = "failed"
    record["error"] = str(exc)
finally:
    record["workerCompletedAt"] = now()
    write_record(record)
`;
}

function buildRemoteWorkerScript({
  sessionId,
  remoteSessionDir,
  remoteCommandLine,
}) {
  return [
    `$ErrorActionPreference = 'Stop'`,
    `$sessionDir = [Environment]::ExpandEnvironmentVariables(${quotePowerShellString(remoteSessionDir)})`,
    `$sessionRecordPath = Join-Path $sessionDir 'SESSION.json'`,
    `$stdoutPath = Join-Path $sessionDir 'stdout.log'`,
    `$stderrPath = Join-Path $sessionDir 'stderr.log'`,
    `$commandLine = ${quotePowerShellString(remoteCommandLine)}`,
    `New-Item -ItemType Directory -Force -Path $sessionDir | Out-Null`,
    `$record = [ordered]@{`,
    `  schema = 'erdos.remote_frontier_session/2'`,
    `  remoteSessionId = ${quotePowerShellString(sessionId)}`,
    `  launchedAt = (Get-Date).ToUniversalTime().ToString('o')`,
    `  status = 'running'`,
    `  workerPid = $PID`,
    `  childPid = $null`,
    `  sessionDir = $sessionDir`,
    `  stdoutPath = $stdoutPath`,
    `  stderrPath = $stderrPath`,
    `  remoteCommandLine = $commandLine`,
    `  exitCode = $null`,
    `  error = $null`,
    `}`,
    `$record | ConvertTo-Json -Depth 10 | Set-Content -Path $sessionRecordPath`,
    `try {`,
    `  $child = Start-Process -FilePath 'cmd.exe' -ArgumentList @('/d','/c',$commandLine) -RedirectStandardOutput $stdoutPath -RedirectStandardError $stderrPath -PassThru -WindowStyle Hidden`,
    `  $record.childPid = $child.Id`,
    `  $record.startedCommandAt = (Get-Date).ToUniversalTime().ToString('o')`,
    `  $record | ConvertTo-Json -Depth 10 | Set-Content -Path $sessionRecordPath`,
    `  $child.WaitForExit()`,
    `  $record.completedAt = (Get-Date).ToUniversalTime().ToString('o')`,
    `  $record.exitCode = $child.ExitCode`,
    `  if ($record.status -eq 'stop_requested') {`,
    `    $record.status = 'stopped'`,
    `  } elseif ($child.ExitCode -eq 0) {`,
    `    $record.status = 'completed'`,
    `  } else {`,
    `    $record.status = 'failed'`,
    `  }`,
    `} catch {`,
    `  $record.completedAt = (Get-Date).ToUniversalTime().ToString('o')`,
    `  if ($record.status -eq 'stop_requested') {`,
    `    $record.status = 'stopped'`,
    `  } else {`,
    `    $record.status = 'failed'`,
    `  }`,
    `  $record.error = $_.Exception.Message`,
    `} finally {`,
    `  $record.workerCompletedAt = (Get-Date).ToUniversalTime().ToString('o')`,
    `  $record | ConvertTo-Json -Depth 10 | Set-Content -Path $sessionRecordPath`,
    `}`,
  ].join('\n');
}

function resolveRemoteSnapshotStatus(record, running, remoteState) {
  if (remoteState?.remoteRecord) {
    const remoteStatus = String(remoteState.remoteRecord.status ?? '').trim().toLowerCase();
    if (running) {
      if (record.stopRequestedAt || remoteStatus === 'stop_requested') {
        return 'stop_requested';
      }
      return remoteStatus || 'running';
    }
    if (record.stopRequestedAt || remoteStatus === 'stop_requested' || remoteStatus === 'stopped') {
      return 'stopped';
    }
    if (remoteStatus === 'failed') {
      return 'failed';
    }
    if (remoteStatus === 'launching') {
      return 'launching';
    }
    if (remoteStatus) {
      return remoteStatus;
    }
  }

  if (running) {
    return record.stopRequestedAt ? 'stop_requested' : 'running';
  }
  return record.stopRequestedAt ? 'stopped' : 'completed';
}

function launchRemoteSshSession(spec, workspaceRoot = getWorkspaceRoot()) {
  const sessionId = spec.sessionId ?? generateSessionId(spec);
  const sessionDir = getFrontierSessionDir(sessionId, workspaceRoot);
  ensureDir(sessionDir);

  const remoteSessionDir = buildRemoteSessionDir(spec.remoteEngineRoot, sessionId);
  const remoteRecordPath = `${remoteSessionDir}\\SESSION.json`;
  const remoteStdoutPath = `${remoteSessionDir}\\stdout.log`;
  const remoteStderrPath = `${remoteSessionDir}\\stderr.log`;
  const remoteWorkerPath = `${remoteSessionDir}\\run-session.ps1`;
  const remoteScpSessionDir = toRemoteScpPath(remoteSessionDir);
  const remoteCommandLine = String(spec.remoteCommandLine ?? '').trim();
  const localWorkerPath = path.join(sessionDir, 'remote-worker.ps1');

  if (!remoteScpSessionDir) {
    return {
      ok: false,
      error: 'Failed to resolve remote SCP session directory.',
      session: null,
    };
  }
  if (!remoteCommandLine) {
    return {
      ok: false,
      error: 'Remote command line is missing.',
      session: null,
    };
  }

  const workerScript = buildRemoteWorkerScript({
    sessionId,
    remoteSessionDir,
    remoteCommandLine,
  });
  writeText(localWorkerPath, workerScript);

  const ensureRemoteSessionDirScript = [
    `$engineRoot = [Environment]::ExpandEnvironmentVariables(${quotePowerShellString(spec.remoteEngineRoot)})`,
    `$sessionsRoot = Join-Path $engineRoot 'sessions'`,
    `$sessionDir = [Environment]::ExpandEnvironmentVariables(${quotePowerShellString(remoteSessionDir)})`,
    `New-Item -ItemType Directory -Force -Path $engineRoot | Out-Null`,
    `New-Item -ItemType Directory -Force -Path $sessionsRoot | Out-Null`,
    `New-Item -ItemType Directory -Force -Path $sessionDir | Out-Null`,
    `[pscustomobject]@{ sessionDir = $sessionDir } | ConvertTo-Json -Compress`,
  ].join('\n');
  const ensureRemoteSessionDirResult = runRemotePowerShellCapture(
    spec.remoteHost,
    ensureRemoteSessionDirScript,
    { cwd: workspaceRoot },
  );
  if (!ensureRemoteSessionDirResult.ok) {
    return {
      ok: false,
      error: ensureRemoteSessionDirResult.stderr ?? 'Failed to prepare the remote frontier session directory.',
      session: null,
    };
  }

  const copyWorkerResult = runCommandCapture({
    executable: 'scp',
    args: [localWorkerPath, `${spec.remoteHost}:${remoteScpSessionDir}/run-session.ps1`],
  }, { cwd: workspaceRoot });
  if (!copyWorkerResult.ok) {
    return {
      ok: false,
      error: copyWorkerResult.stderr ?? 'Failed to copy the remote frontier worker script.',
      session: null,
    };
  }

  const launchScript = [
    `$sessionDir = [Environment]::ExpandEnvironmentVariables(${quotePowerShellString(remoteSessionDir)})`,
    `$workerPath = [Environment]::ExpandEnvironmentVariables(${quotePowerShellString(remoteWorkerPath)})`,
    `$sessionRecordPath = Join-Path $sessionDir 'SESSION.json'`,
    `$stdoutPath = Join-Path $sessionDir 'stdout.log'`,
    `$stderrPath = Join-Path $sessionDir 'stderr.log'`,
    `New-Item -ItemType Directory -Force -Path $sessionDir | Out-Null`,
    `$proc = Start-Process -FilePath 'powershell.exe' -ArgumentList @('-NoProfile','-ExecutionPolicy','Bypass','-File',$workerPath) -PassThru -WindowStyle Hidden`,
    `if (-not (Test-Path $sessionRecordPath)) {`,
    `  [pscustomobject]@{`,
    `    schema = 'erdos.remote_frontier_session/2'`,
    `    remoteSessionId = ${quotePowerShellString(sessionId)}`,
    `    launchedAt = (Get-Date).ToUniversalTime().ToString('o')`,
    `    status = 'launching'`,
    `    workerPid = $proc.Id`,
    `    childPid = $null`,
    `    sessionDir = $sessionDir`,
    `    stdoutPath = $stdoutPath`,
    `    stderrPath = $stderrPath`,
    `    remoteCommandLine = ${quotePowerShellString(remoteCommandLine)}`,
    `    exitCode = $null`,
    `    error = $null`,
    `  } | ConvertTo-Json -Depth 10 | Set-Content -Path $sessionRecordPath`,
    `}`,
    `$deadline = (Get-Date).AddSeconds(2)`,
    `do {`,
    `  Start-Sleep -Milliseconds 100`,
    `  $current = if (Test-Path $sessionRecordPath) { Get-Content -Raw $sessionRecordPath | ConvertFrom-Json } else { $null }`,
    `  $ready = ($null -ne $current) -and (($current.status -ne 'launching') -or ($null -ne $current.childPid) -or (($null -ne $current.workerPid) -and ($current.workerPid -ne $proc.Id)))`,
    `} while ((Get-Date) -lt $deadline -and -not $ready)`,
    `[pscustomobject]@{`,
    `  schema = 'erdos.remote_frontier_session_launch/2'`,
    `  remoteSessionId = ${quotePowerShellString(sessionId)}`,
    `  launchedAt = (Get-Date).ToUniversalTime().ToString('o')`,
    `  pid = $proc.Id`,
    `  workerPath = $workerPath`,
    `  sessionDir = $sessionDir`,
    `  stdoutPath = $stdoutPath`,
    `  stderrPath = $stderrPath`,
    `  remoteCommandLine = ${quotePowerShellString(remoteCommandLine)}`,
    `} | ConvertTo-Json -Depth 10 -Compress`,
  ].join('\n');

  const launchResult = runRemotePowerShellCapture(spec.remoteHost, launchScript, { cwd: workspaceRoot });
  const remoteRecord = parseJsonDocument(launchResult.stdout);
  if (!launchResult.ok || !remoteRecord) {
    return {
      ok: false,
      error: launchResult.stderr ?? 'Failed to launch remote frontier session.',
      session: null,
    };
  }

  const record = {
    schema: 'erdos.frontier_session/1',
    backend: 'remote_ssh',
    sessionId,
    launchedAt: new Date().toISOString(),
    kind: spec.kind ?? 'frontier_dispatch',
    label: spec.label ?? spec.actionId ?? sessionId,
    problemId: spec.problemId ?? null,
    actionId: spec.actionId ?? null,
    mode: spec.mode ?? null,
    source: spec.source ?? null,
    reviewAfterHours: spec.reviewAfterHours ?? null,
    cwd: workspaceRoot,
    pid: null,
    executable: 'ssh',
    args: [spec.remoteHost, remoteCommandLine],
    commandLine: formatCommandLine('ssh', [spec.remoteHost, remoteCommandLine]),
    stdoutPath: getFrontierSessionStdoutPath(sessionId, workspaceRoot),
    stderrPath: getFrontierSessionStderrPath(sessionId, workspaceRoot),
    stopRequestedAt: null,
    detachedBy: spec.detachedBy ?? 'erdos',
    metadata: {
      ...(spec.metadata ?? {}),
      reuseFingerprint: buildSessionReuseFingerprint(spec),
      remoteHost: spec.remoteHost,
      remoteEngineRoot: spec.remoteEngineRoot,
      remoteCommandLine,
      remoteSessionDir,
      remoteRecordPath,
      remoteStdoutPath,
      remoteStderrPath,
      remoteWorkerPath,
      remoteScpSessionDir,
      remotePid: remoteRecord.pid ?? null,
    },
  };

  writeSessionRecord(sessionId, record, workspaceRoot);
  return {
    ok: true,
    session: buildSessionSnapshot(record, workspaceRoot),
  };
}

function launchRemoteBrevSession(spec, workspaceRoot = getWorkspaceRoot()) {
  const sessionId = spec.sessionId ?? generateSessionId(spec);
  const sessionDir = getFrontierSessionDir(sessionId, workspaceRoot);
  ensureDir(sessionDir);

  const remoteSessionDir = buildRemoteLinuxSessionDir(spec.remoteEngineRoot, sessionId);
  const remoteRecordPath = joinRemotePath({ provider: 'brev' }, remoteSessionDir, 'SESSION.json');
  const remoteStdoutPath = joinRemotePath({ provider: 'brev' }, remoteSessionDir, 'stdout.log');
  const remoteStderrPath = joinRemotePath({ provider: 'brev' }, remoteSessionDir, 'stderr.log');
  const remoteWorkerPath = joinRemotePath({ provider: 'brev' }, remoteSessionDir, 'run-session.py');
  const remoteCommandLine = String(spec.remoteCommandLine ?? '').trim();
  const localWorkerPath = path.join(sessionDir, 'remote-worker.py');
  const remoteTarget = {
    provider: 'brev',
    instanceName: spec.remoteInstanceName ?? spec.remoteHost,
    sshHost: spec.remoteHost,
  };

  if (!remoteTarget.instanceName) {
    return {
      ok: false,
      error: 'Remote Brev instance is missing.',
      session: null,
    };
  }
  if (!remoteCommandLine) {
    return {
      ok: false,
      error: 'Remote command line is missing.',
      session: null,
    };
  }

  const workerScript = buildRemoteLinuxWorkerScript({
    sessionId,
    remoteSessionDir,
    remoteCommandLine,
  });
  writeText(localWorkerPath, workerScript);

  const ensureRemoteSessionDirResult = runRemoteCommandCapture(
    remoteTarget,
    `mkdir -p ${quotePosixShellArg(remoteSessionDir)}`,
    { cwd: workspaceRoot },
  );
  if (!ensureRemoteSessionDirResult.ok) {
    return {
      ok: false,
      error: ensureRemoteSessionDirResult.stderr ?? 'Failed to prepare the remote Brev frontier session directory.',
      session: null,
    };
  }

  const copyWorkerResult = runRemoteCopyToCapture(
    remoteTarget,
    localWorkerPath,
    remoteWorkerPath,
    { cwd: workspaceRoot },
  );
  if (!copyWorkerResult.ok) {
    return {
      ok: false,
      error: copyWorkerResult.stderr ?? 'Failed to copy the remote Brev frontier worker script.',
      session: null,
    };
  }

  const launchResult = runRemoteCommandCapture(
    remoteTarget,
    [
      `mkdir -p ${quotePosixShellArg(remoteSessionDir)}`,
      `nohup ${quotePosixShellArg(spec.remotePythonCommand ?? 'python3')} ${quotePosixShellArg(remoteWorkerPath)} >/dev/null 2>&1 &`,
      'worker_pid=$!',
      'for _ in $(seq 1 20); do',
      `  [ -f ${quotePosixShellArg(remoteRecordPath)} ] && break`,
      '  sleep 0.1',
      'done',
      'printf \'{"pid":%s,"remoteSessionId":"%s","sessionDir":"%s","workerPath":"%s","stdoutPath":"%s","stderrPath":"%s"}\\n\' "$worker_pid" '
        + `${quotePosixShellArg(sessionId)} ${quotePosixShellArg(remoteSessionDir)} ${quotePosixShellArg(remoteWorkerPath)} ${quotePosixShellArg(remoteStdoutPath)} ${quotePosixShellArg(remoteStderrPath)}`,
    ].join('\n'),
    { cwd: workspaceRoot },
  );
  const remoteRecord = parseJsonDocument(launchResult.stdout);
  if (!launchResult.ok || !remoteRecord) {
    return {
      ok: false,
      error: launchResult.stderr ?? 'Failed to launch remote Brev frontier session.',
      session: null,
    };
  }

  const record = {
    schema: 'erdos.frontier_session/1',
    backend: 'remote_brev',
    sessionId,
    launchedAt: new Date().toISOString(),
    kind: spec.kind ?? 'frontier_dispatch',
    label: spec.label ?? spec.actionId ?? sessionId,
    problemId: spec.problemId ?? null,
    actionId: spec.actionId ?? null,
    mode: spec.mode ?? null,
    source: spec.source ?? null,
    reviewAfterHours: spec.reviewAfterHours ?? null,
    cwd: workspaceRoot,
    pid: null,
    executable: 'brev',
    args: ['exec', remoteTarget.instanceName, remoteCommandLine],
    commandLine: formatCommandLine('brev', ['exec', remoteTarget.instanceName, remoteCommandLine]),
    stdoutPath: getFrontierSessionStdoutPath(sessionId, workspaceRoot),
    stderrPath: getFrontierSessionStderrPath(sessionId, workspaceRoot),
    stopRequestedAt: null,
    detachedBy: spec.detachedBy ?? 'erdos',
    metadata: {
      ...(spec.metadata ?? {}),
      reuseFingerprint: buildSessionReuseFingerprint(spec),
      remoteProvider: 'brev',
      remoteInstanceName: remoteTarget.instanceName,
      remoteHost: spec.remoteHost ?? remoteTarget.instanceName,
      remoteEngineRoot: spec.remoteEngineRoot,
      remotePythonCommand: spec.remotePythonCommand ?? 'python3',
      remoteCommandLine,
      remoteSessionDir,
      remoteRecordPath,
      remoteStdoutPath,
      remoteStderrPath,
      remoteWorkerPath,
      remotePid: remoteRecord.pid ?? null,
    },
  };

  writeSessionRecord(sessionId, record, workspaceRoot);
  return {
    ok: true,
    session: buildSessionSnapshot(record, workspaceRoot),
  };
}

function getRemoteSessionLiveSnapshot(record, workspaceRoot = getWorkspaceRoot()) {
  const remoteHost = record?.metadata?.remoteHost ?? null;
  const remoteRecordPath = record?.metadata?.remoteRecordPath ?? null;
  if (!remoteHost || !remoteRecordPath) {
    return {
      running: false,
      error: 'remote session metadata missing',
      stdoutTail: [],
      stderrTail: [],
      runDir: null,
      remoteRecord: null,
    };
  }

  const statusScript = [
    `$recordPath = [Environment]::ExpandEnvironmentVariables(${quotePowerShellString(remoteRecordPath)})`,
    `if (-not (Test-Path $recordPath)) { throw 'remote session record missing' }`,
    `$record = Get-Content -Raw $recordPath | ConvertFrom-Json`,
    `$worker = if ($record.workerPid) { Get-Process -Id $record.workerPid -ErrorAction SilentlyContinue } else { $null }`,
    `$child = if ($record.childPid) { Get-Process -Id $record.childPid -ErrorAction SilentlyContinue } else { $null }`,
    `$stdoutTail = if (Test-Path $record.stdoutPath) { @(Get-Content -Tail 12 $record.stdoutPath) } else { @() }`,
    `$stderrTail = if (Test-Path $record.stderrPath) { @(Get-Content -Tail 12 $record.stderrPath) } else { @() }`,
    `[pscustomobject]@{`,
    `  running = (($record.status -eq 'running') -or (($record.status -eq 'launching') -and ($null -ne $worker)) -or (($record.status -eq 'stop_requested') -and (($null -ne $worker) -or ($null -ne $child))) -or ($null -ne $child))`,
    `  remoteRecord = $record`,
    `  stdoutTail = $stdoutTail`,
    `  stderrTail = $stderrTail`,
    `} | ConvertTo-Json -Depth 10 -Compress`,
  ].join('\n');

  const result = runRemotePowerShellCapture(remoteHost, statusScript, { cwd: workspaceRoot });
  const payload = parseJsonDocument(result.stdout);
  if (!result.ok || !payload) {
    return {
      running: false,
      error: result.stderr ?? 'failed to query remote session',
      stdoutTail: [],
      stderrTail: [],
      runDir: null,
      remoteRecord: null,
    };
  }

  const stdoutTail = Array.isArray(payload.stdoutTail) ? payload.stdoutTail.map(String) : [];
  const stderrTail = Array.isArray(payload.stderrTail) ? payload.stderrTail.map(String) : [];
  return {
    running: Boolean(payload.running),
    error: null,
    stdoutTail,
    stderrTail,
    runDir: parseRunDirFromTail(stdoutTail),
    remoteRecord: payload.remoteRecord ?? null,
  };
}

function getRemoteBrevSessionLiveSnapshot(record, workspaceRoot = getWorkspaceRoot()) {
  const remoteInstanceName = record?.metadata?.remoteInstanceName ?? null;
  const remoteRecordPath = record?.metadata?.remoteRecordPath ?? null;
  if (!remoteInstanceName || !remoteRecordPath) {
    return {
      running: false,
      error: 'remote brev session metadata missing',
      stdoutTail: [],
      stderrTail: [],
      runDir: null,
      remoteRecord: null,
    };
  }

  const statusCommand = `${record.metadata?.remotePythonCommand ?? 'python3'} - <<'PY'
import json
import os
import signal

record_path = ${JSON.stringify(String(remoteRecordPath))}
if not os.path.exists(record_path):
    raise SystemExit("remote session record missing")
with open(record_path, "r", encoding="utf-8") as handle:
    record = json.load(handle)

def pid_alive(pid):
    if not pid:
        return False
    try:
        os.kill(int(pid), 0)
        return True
    except OSError:
        return False

def tail_lines(file_path, count=12):
    if not file_path or not os.path.exists(file_path):
        return []
    with open(file_path, "r", encoding="utf-8", errors="replace") as handle:
        return handle.read().splitlines()[-count:]

payload = {
    "running": (
        record.get("status") in {"running", "launching"}
        and (pid_alive(record.get("workerPid")) or pid_alive(record.get("childPid")))
    ) or (
        record.get("status") == "stop_requested"
        and (pid_alive(record.get("workerPid")) or pid_alive(record.get("childPid")))
    ),
    "remoteRecord": record,
    "stdoutTail": tail_lines(record.get("stdoutPath")),
    "stderrTail": tail_lines(record.get("stderrPath")),
}
print(json.dumps(payload))
PY`;

  const result = runRemoteCommandCapture({
    provider: 'brev',
    instanceName: remoteInstanceName,
  }, statusCommand, { cwd: workspaceRoot });
  const payload = parseJsonDocument(result.stdout);
  if (!result.ok || !payload) {
    return {
      running: false,
      error: result.stderr ?? 'failed to query remote brev session',
      stdoutTail: [],
      stderrTail: [],
      runDir: null,
      remoteRecord: null,
    };
  }

  const stdoutTail = Array.isArray(payload.stdoutTail) ? payload.stdoutTail.map(String) : [];
  const stderrTail = Array.isArray(payload.stderrTail) ? payload.stderrTail.map(String) : [];
  return {
    running: Boolean(payload.running),
    error: null,
    stdoutTail,
    stderrTail,
    runDir: parseRunDirFromTail(stdoutTail),
    remoteRecord: payload.remoteRecord ?? null,
  };
}

function loadSessionRecord(sessionId, workspaceRoot = getWorkspaceRoot()) {
  const recordPath = getFrontierSessionRecordPath(sessionId, workspaceRoot);
  if (!fs.existsSync(recordPath)) {
    return null;
  }
  return readJson(recordPath);
}

function writeSessionRecord(sessionId, payload, workspaceRoot = getWorkspaceRoot()) {
  writeJson(getFrontierSessionRecordPath(sessionId, workspaceRoot), payload);
  return payload;
}

function buildSessionSnapshot(record, workspaceRoot = getWorkspaceRoot()) {
  if (!record) {
    return null;
  }

  const remoteState = record.backend === 'remote_ssh'
    ? getRemoteSessionLiveSnapshot(record, workspaceRoot)
    : record.backend === 'remote_brev'
      ? getRemoteBrevSessionLiveSnapshot(record, workspaceRoot)
    : null;
  const stdoutTail = remoteState ? remoteState.stdoutTail : readTail(record.stdoutPath, 12);
  const stderrTail = remoteState ? remoteState.stderrTail : readTail(record.stderrPath, 12);
  const processState = remoteState ?? probeLocalProcess(record.pid);
  const running = processState.running;
  const review = computeReviewState(record, running);
  const runDir = remoteState ? remoteState.runDir : parseRunDirFromTail(stdoutTail);
  const status = resolveRemoteSnapshotStatus(record, running, remoteState);

  return {
    ...record,
    workspaceRoot,
    status,
    running,
    processError: processState.error,
    reviewDueAt: review.dueAt,
    reviewState: review.state,
    runDir,
    stdoutTail,
    stderrTail,
    remotePid: remoteState?.remoteRecord?.pid ?? record.metadata?.remotePid ?? null,
    remoteSessionDir: record.metadata?.remoteSessionDir ?? null,
    remoteExitCode: remoteState?.remoteRecord?.exitCode ?? null,
    remoteStatus: remoteState?.remoteRecord?.status ?? null,
    remoteWorkerPid: remoteState?.remoteRecord?.workerPid ?? null,
    remoteChildPid: remoteState?.remoteRecord?.childPid ?? null,
    remoteError: remoteState?.remoteRecord?.error ?? null,
    harvestedBundle: record?.metadata?.harvestedBundle ?? null,
  };
}

export function launchFrontierDetachedSession(spec, workspaceRoot = getWorkspaceRoot()) {
  if (spec.backend === 'remote_ssh') {
    return launchRemoteSshSession(spec, workspaceRoot);
  }
  if (spec.backend === 'remote_brev') {
    return launchRemoteBrevSession(spec, workspaceRoot);
  }
  const sessionId = spec.sessionId ?? generateSessionId(spec);
  const sessionDir = getFrontierSessionDir(sessionId, workspaceRoot);
  ensureDir(sessionDir);

  const stdoutPath = getFrontierSessionStdoutPath(sessionId, workspaceRoot);
  const stderrPath = getFrontierSessionStderrPath(sessionId, workspaceRoot);
  const stdoutFd = fs.openSync(stdoutPath, 'a');
  const stderrFd = fs.openSync(stderrPath, 'a');
  const executable = spec.executable ?? 'node';
  const args = Array.isArray(spec.args) ? spec.args : [];
  const commandLine = formatCommandLine(executable, args);

  const child = spawn(executable, args, {
    cwd: spec.cwd ?? workspaceRoot,
    detached: true,
    stdio: ['ignore', stdoutFd, stderrFd],
  });
  fs.closeSync(stdoutFd);
  fs.closeSync(stderrFd);
  child.unref();

  const record = {
    schema: 'erdos.frontier_session/1',
    sessionId,
    launchedAt: new Date().toISOString(),
    kind: spec.kind ?? 'frontier_dispatch',
    label: spec.label ?? spec.actionId ?? sessionId,
    problemId: spec.problemId ?? null,
    actionId: spec.actionId ?? null,
    mode: spec.mode ?? null,
    source: spec.source ?? null,
    reviewAfterHours: spec.reviewAfterHours ?? null,
    cwd: spec.cwd ?? workspaceRoot,
    pid: child.pid,
    executable,
    args,
    commandLine,
    stdoutPath,
    stderrPath,
    stopRequestedAt: null,
    detachedBy: spec.detachedBy ?? 'erdos',
    metadata: {
      ...(spec.metadata ?? {}),
      reuseFingerprint: buildSessionReuseFingerprint(spec),
    },
  };

  writeSessionRecord(sessionId, record, workspaceRoot);
  return buildSessionSnapshot(record, workspaceRoot);
}

export function findReusableFrontierDetachedSession(spec, workspaceRoot = getWorkspaceRoot()) {
  const sessionsDir = getFrontierSessionsDir(workspaceRoot);
  ensureDir(sessionsDir);
  const targetFingerprint = buildSessionReuseFingerprint(spec);
  const sessionIds = fs.readdirSync(sessionsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  for (const sessionId of sessionIds) {
    const record = loadSessionRecord(sessionId, workspaceRoot);
    if (!record || record.stopRequestedAt) {
      continue;
    }
    if ((record.problemId ?? null) !== (spec.problemId ?? null) || (record.actionId ?? null) !== (spec.actionId ?? null)) {
      continue;
    }
    const recordFingerprint = record.metadata?.reuseFingerprint ?? buildRecordReuseFingerprint(record);
    if (recordFingerprint !== targetFingerprint) {
      continue;
    }
    const snapshot = getFrontierSessionSnapshot(sessionId, workspaceRoot);
    if (snapshot?.running && snapshot.status !== 'stop_requested') {
      return snapshot;
    }
  }

  return null;
}

export function getFrontierSessionSnapshot(sessionId, workspaceRoot = getWorkspaceRoot()) {
  const record = loadSessionRecord(sessionId, workspaceRoot);
  if (!record) {
    return null;
  }

  let effectiveRecord = record;
  let snapshot = buildSessionSnapshot(record, workspaceRoot);
  const harvestedBundle = maybeHarvestRemoteP848Bundle(record, snapshot, workspaceRoot);
  if (harvestedBundle) {
    effectiveRecord = {
      ...record,
      metadata: {
        ...(record.metadata ?? {}),
        harvestedBundle,
      },
    };
    snapshot = buildSessionSnapshot(effectiveRecord, workspaceRoot);
  }
  const nextRecord = {
    ...effectiveRecord,
    lastObservedAt: new Date().toISOString(),
    lastObservedStatus: snapshot.status,
    lastObservedRunDir: snapshot.runDir ?? null,
  };
  writeSessionRecord(sessionId, nextRecord, workspaceRoot);
  return {
    ...snapshot,
    lastObservedAt: nextRecord.lastObservedAt,
    lastObservedStatus: nextRecord.lastObservedStatus,
  };
}

export function listFrontierSessionSnapshots(workspaceRoot = getWorkspaceRoot()) {
  const sessionsDir = getFrontierSessionsDir(workspaceRoot);
  ensureDir(sessionsDir);
  const sessionIds = fs.readdirSync(sessionsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .reverse();

  const sessions = sessionIds
    .map((sessionId) => getFrontierSessionSnapshot(sessionId, workspaceRoot))
    .filter(Boolean);

  return {
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    sessionsDir,
    sessionCount: sessions.length,
    sessions,
  };
}

export function stopFrontierSession(sessionId, workspaceRoot = getWorkspaceRoot()) {
  const record = loadSessionRecord(sessionId, workspaceRoot);
  if (!record) {
    return {
      ok: false,
      error: `Unknown frontier session: ${sessionId}`,
      session: null,
    };
  }

  const processState = probeLocalProcess(record.pid);
  const stopRequestedAt = new Date().toISOString();
  const nextRecord = {
    ...record,
    stopRequestedAt,
  };
  writeSessionRecord(sessionId, nextRecord, workspaceRoot);

  if (record.backend === 'remote_ssh') {
    const remoteHost = record.metadata?.remoteHost ?? null;
    const remoteRecordPath = record.metadata?.remoteRecordPath ?? null;
    const stopScript = [
      `$recordPath = [Environment]::ExpandEnvironmentVariables(${quotePowerShellString(remoteRecordPath)})`,
      `if (-not (Test-Path $recordPath)) { throw 'remote session record missing' }`,
      `$record = Get-Content -Raw $recordPath | ConvertFrom-Json`,
      `$child = if ($record.childPid) { Get-Process -Id $record.childPid -ErrorAction SilentlyContinue } else { $null }`,
      `$worker = if ($record.workerPid) { Get-Process -Id $record.workerPid -ErrorAction SilentlyContinue } else { $null }`,
      `$requested = $false`,
      `if ($null -ne $child) { Stop-Process -Id $record.childPid -ErrorAction SilentlyContinue; $requested = $true }`,
      `if ($null -ne $worker) { Stop-Process -Id $record.workerPid -ErrorAction SilentlyContinue; $requested = $true }`,
      `$record | Add-Member -NotePropertyName stopRequestedAt -NotePropertyValue (Get-Date).ToUniversalTime().ToString('o') -Force`,
      `$record | Add-Member -NotePropertyName stopCompletedAt -NotePropertyValue (Get-Date).ToUniversalTime().ToString('o') -Force`,
      `$record | Add-Member -NotePropertyName previousChildPid -NotePropertyValue $record.childPid -Force`,
      `$record | Add-Member -NotePropertyName previousWorkerPid -NotePropertyValue $record.workerPid -Force`,
      `$record.childPid = $null`,
      `$record.workerPid = $null`,
      `$record | Add-Member -NotePropertyName status -NotePropertyValue 'stopped' -Force`,
      `$record | ConvertTo-Json -Depth 10 | Set-Content -Path $recordPath`,
      `[pscustomobject]@{ requested = $requested } | ConvertTo-Json -Compress`,
    ].join('\n');
    const stopResult = runRemotePowerShellCapture(remoteHost, stopScript, { cwd: workspaceRoot });
    const payload = parseJsonDocument(stopResult.stdout);
    return {
      ok: stopResult.ok,
      requested: Boolean(payload?.requested),
      alreadyExited: !Boolean(payload?.requested),
      error: stopResult.ok ? null : (stopResult.stderr ?? 'Failed to stop remote frontier session.'),
      session: buildSessionSnapshot(nextRecord, workspaceRoot),
    };
  }

  if (record.backend === 'remote_brev') {
    const remoteInstanceName = record.metadata?.remoteInstanceName ?? null;
    const remoteRecordPath = record.metadata?.remoteRecordPath ?? null;
    const stopCommand = `${record.metadata?.remotePythonCommand ?? 'python3'} - <<'PY'
import json
import os
import signal

record_path = ${JSON.stringify(String(remoteRecordPath ?? ''))}
if not os.path.exists(record_path):
    raise SystemExit("remote session record missing")
with open(record_path, "r", encoding="utf-8") as handle:
    record = json.load(handle)

requested = False
for key in ("childPid", "workerPid"):
    pid = record.get(key)
    if pid:
        try:
            os.kill(int(pid), signal.SIGTERM)
            requested = True
        except OSError:
            pass

record["stopRequestedAt"] = ${JSON.stringify(stopRequestedAt)}
record["stopCompletedAt"] = ${JSON.stringify(stopRequestedAt)}
record["previousChildPid"] = record.get("childPid")
record["previousWorkerPid"] = record.get("workerPid")
record["childPid"] = None
record["workerPid"] = None
record["status"] = "stopped"

with open(record_path, "w", encoding="utf-8") as handle:
    json.dump(record, handle, indent=2)

print(json.dumps({"requested": requested}))
PY`;
    const stopResult = runRemoteCommandCapture({
      provider: 'brev',
      instanceName: remoteInstanceName,
    }, stopCommand, { cwd: workspaceRoot });
    const payload = parseJsonDocument(stopResult.stdout);
    return {
      ok: stopResult.ok,
      requested: Boolean(payload?.requested),
      alreadyExited: !Boolean(payload?.requested),
      error: stopResult.ok ? null : (stopResult.stderr ?? 'Failed to stop remote Brev frontier session.'),
      session: buildSessionSnapshot(nextRecord, workspaceRoot),
    };
  }

  if (!processState.running) {
    return {
      ok: true,
      requested: false,
      alreadyExited: true,
      session: buildSessionSnapshot(nextRecord, workspaceRoot),
    };
  }

  try {
    process.kill(record.pid, 'SIGTERM');
    return {
      ok: true,
      requested: true,
      alreadyExited: false,
      session: buildSessionSnapshot(nextRecord, workspaceRoot),
    };
  } catch (error) {
    return {
      ok: false,
      requested: false,
      alreadyExited: false,
      error: error?.message ?? 'Failed to stop frontier session.',
      session: buildSessionSnapshot(nextRecord, workspaceRoot),
    };
  }
}

export function getFrontierSessionCommandSpec(commandArgs = [], workspaceRoot = getWorkspaceRoot()) {
  return {
    executable: 'node',
    args: [path.join(repoRoot, 'src', 'cli', 'index.js'), ...commandArgs],
    cwd: workspaceRoot,
    commandLine: formatCommandLine('node', [path.join(repoRoot, 'src', 'cli', 'index.js'), ...commandArgs]),
  };
}
