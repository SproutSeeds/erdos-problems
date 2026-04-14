import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ensureDir } from './files.js';
import { loadConfig, saveConfig } from './config.js';
import {
  getDefaultRemoteEngineRoot,
  getDefaultRemotePythonCommand,
  isBrevRemote,
  joinRemotePath,
  probeBrevRemoteHome,
  quotePosixShellArg,
  quoteRemoteWindowsPath,
  runRemoteCommandCapture,
  runRemoteCopyToCapture,
  toRemoteCopyPath,
} from './frontier-remote.js';
import { getWorkspaceDir, getWorkspaceRoot, repoRoot } from './paths.js';

const PYTHON_PROBE_SCRIPT = [
  'import importlib.util, json, platform, sys',
  'payload = {',
  '  "python_executable": sys.executable,',
  '  "python_version": platform.python_version(),',
  '  "frontier_engine_installed": False,',
  '  "torch_installed": False,',
  '  "torch_version": None,',
  '  "cuda_available": False,',
  '  "cuda_device_count": 0,',
  '  "cuda_device_names": [],',
  '  "cuda_error": None,',
  '}',
  'payload["frontier_engine_installed"] = importlib.util.find_spec("frontier_engine") is not None',
  'torch_spec = importlib.util.find_spec("torch")',
  'payload["torch_installed"] = torch_spec is not None',
  'if torch_spec is not None:',
  '  import torch',
  '  payload["torch_version"] = getattr(torch, "__version__", None)',
  '  try:',
  '    payload["cuda_available"] = bool(torch.cuda.is_available())',
  '    if payload["cuda_available"]:',
  '      payload["cuda_device_count"] = int(torch.cuda.device_count())',
  '      payload["cuda_device_names"] = [torch.cuda.get_device_name(index) for index in range(torch.cuda.device_count())]',
  '  except Exception as exc:',
  '    payload["cuda_error"] = str(exc)',
  'print(json.dumps(payload))',
].join('\n');

const PYTHON_EXECUTABLE_PROBE_SCRIPT = [
  'import platform, sys',
  'print(sys.executable)',
  'print(platform.python_version())',
].join('\n');

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

function formatCommand(command) {
  return [command.executable, ...(command.args ?? [])].map(formatShellArg).join(' ');
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

function runBrevRefreshCapture(workspaceRoot = getWorkspaceRoot()) {
  return runCommandCapture({
    executable: 'brev',
    args: ['refresh'],
  }, { cwd: workspaceRoot });
}

function getRemoteProviderLabel(remote = {}) {
  if (remote.provider === 'brev') {
    return remote.instanceName
      ? `Brev instance ${remote.instanceName}`
      : 'Brev remote';
  }
  return remote.sshHost
    ? `SSH host ${remote.sshHost}`
    : 'remote SSH host';
}

function formatBrevNumeric(value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildBrevCreateArgs(options = {}) {
  const args = ['create'];
  const name = options.instanceName ?? options.name ?? null;
  if (name) {
    args.push(name);
  }
  if (options.type) {
    args.push('--type', String(options.type));
  }
  if (options.gpuName) {
    args.push('--gpu-name', String(options.gpuName));
  }
  if (options.provider) {
    args.push('--provider', String(options.provider));
  }
  if (formatBrevNumeric(options.count) !== null) {
    args.push('--count', String(formatBrevNumeric(options.count)));
  }
  if (formatBrevNumeric(options.parallel) !== null) {
    args.push('--parallel', String(formatBrevNumeric(options.parallel)));
  }
  if (formatBrevNumeric(options.minVram) !== null) {
    args.push('--min-vram', String(formatBrevNumeric(options.minVram)));
  }
  if (formatBrevNumeric(options.minTotalVram) !== null) {
    args.push('--min-total-vram', String(formatBrevNumeric(options.minTotalVram)));
  }
  if (formatBrevNumeric(options.maxBootTime) !== null) {
    args.push('--max-boot-time', String(formatBrevNumeric(options.maxBootTime)));
  }
  if (formatBrevNumeric(options.minDisk) !== null) {
    args.push('--min-disk', String(formatBrevNumeric(options.minDisk)));
  }
  if (formatBrevNumeric(options.minCapability) !== null) {
    args.push('--min-capability', String(formatBrevNumeric(options.minCapability)));
  }
  if (options.sort) {
    args.push('--sort', String(options.sort));
  }
  if (options.startupScript) {
    args.push('--startup-script', String(options.startupScript));
  }
  if (options.detached) {
    args.push('--detached');
  }
  if (options.dryRun) {
    args.push('--dry-run');
  }
  return args;
}

function classifyBrevProvision(options = {}) {
  const count = formatBrevNumeric(options.count) ?? 1;
  const gpuName = String(options.gpuName ?? options.type ?? '').toUpperCase();
  const warnings = [];
  if (gpuName.includes('H100')) {
    warnings.push('H100-class hardware can be expensive; review provider, hourly price, and expected sweep value before applying.');
  }
  if (count > 1) {
    warnings.push('Multi-instance provisioning is intended for parallel independent sweeps and should be launched intentionally.');
  }
  if (options.attach && count !== 1) {
    warnings.push('Auto-attach is only meaningful for a single Brev instance; clusters should be attached or orchestrated explicitly.');
  }
  return warnings;
}

function normalizeRemoteId(remote = {}, preferredId = null) {
  const normalizedRemote = remote && typeof remote === 'object' ? remote : {};
  return String(
    preferredId
      ?? normalizedRemote.remoteId
      ?? normalizedRemote.instanceName
      ?? normalizedRemote.sshHost
      ?? '',
  ).trim() || null;
}

function getFrontierRemoteRegistry(config = {}) {
  const remotes = {
    ...((config.frontier?.remotes && typeof config.frontier.remotes === 'object')
      ? config.frontier.remotes
      : {}),
  };
  const legacyRemote = config.frontier?.remote ?? null;
  const legacyRemoteId = normalizeRemoteId(legacyRemote, config.frontier?.activeRemoteId ?? null);
  if (legacyRemote && legacyRemoteId && !remotes[legacyRemoteId]) {
    remotes[legacyRemoteId] = {
      ...legacyRemote,
      remoteId: legacyRemoteId,
    };
  }
  const activeRemoteId = normalizeRemoteId(
    remotes[config.frontier?.activeRemoteId ?? ''] ?? null,
    config.frontier?.activeRemoteId ?? legacyRemoteId,
  );
  const activeRemote = activeRemoteId ? (remotes[activeRemoteId] ?? null) : null;
  return {
    remotes,
    activeRemoteId,
    activeRemote,
  };
}

function normalizeStringIdList(values = []) {
  return Array.from(new Set(
    (Array.isArray(values) ? values : [])
      .map((value) => String(value ?? '').trim())
      .filter(Boolean),
  )).sort();
}

function getFrontierPaidRungs(config = {}) {
  return {
    enabledRemoteIds: normalizeStringIdList(config.frontier?.paidRungs?.enabledRemoteIds),
    enabledFleetIds: normalizeStringIdList(config.frontier?.paidRungs?.enabledFleetIds),
    lastUpdatedAt: config.frontier?.paidRungs?.lastUpdatedAt ?? null,
  };
}

function isPaidRemote(remote = {}) {
  return remote?.provider === 'brev';
}

function isPaidFleet(fleet = {}) {
  return fleet?.provider === 'brev';
}

function isRemotePaidEnabled(config = {}, remote = {}, remoteId = null) {
  if (!isPaidRemote(remote)) {
    return true;
  }
  const normalizedRemoteId = normalizeRemoteId(remote, remoteId ?? null);
  if (!normalizedRemoteId) {
    return false;
  }
  return getFrontierPaidRungs(config).enabledRemoteIds.includes(normalizedRemoteId);
}

function isFleetPaidEnabled(config = {}, fleet = {}, fleetId = null) {
  if (!isPaidFleet(fleet)) {
    return true;
  }
  const normalizedFleetId = normalizeFleetId(fleet, fleetId ?? null);
  if (!normalizedFleetId) {
    return false;
  }
  return getFrontierPaidRungs(config).enabledFleetIds.includes(normalizedFleetId);
}

function setFrontierPaidRemoteEnabled(config, remoteId, enabled) {
  const paidRungs = getFrontierPaidRungs(config);
  const nextRemoteIds = enabled
    ? normalizeStringIdList([...paidRungs.enabledRemoteIds, remoteId])
    : paidRungs.enabledRemoteIds.filter((candidate) => candidate !== remoteId);
  return {
    ...config,
    frontier: {
      ...config.frontier,
      paidRungs: {
        ...paidRungs,
        enabledRemoteIds: nextRemoteIds,
        lastUpdatedAt: new Date().toISOString(),
      },
    },
  };
}

function setFrontierPaidFleetEnabled(config, fleetId, remoteIds = [], enabled) {
  const paidRungs = getFrontierPaidRungs(config);
  const nextFleetIds = enabled
    ? normalizeStringIdList([...paidRungs.enabledFleetIds, fleetId])
    : paidRungs.enabledFleetIds.filter((candidate) => candidate !== fleetId);
  const nextRemoteIds = enabled
    ? normalizeStringIdList([...paidRungs.enabledRemoteIds, ...remoteIds])
    : paidRungs.enabledRemoteIds.filter((candidate) => !remoteIds.includes(candidate));
  return {
    ...config,
    frontier: {
      ...config.frontier,
      paidRungs: {
        ...paidRungs,
        enabledRemoteIds: nextRemoteIds,
        enabledFleetIds: nextFleetIds,
        lastUpdatedAt: new Date().toISOString(),
      },
    },
  };
}

function buildRegisteredRemotesSummary(config = {}) {
  const registry = getFrontierRemoteRegistry(config);
  return Object.entries(registry.remotes).map(([remoteId, remote]) => {
    const resolvedRemote = resolveRemoteConfigDefaults(remote);
    return {
      remoteId,
      provider: resolvedRemote.provider ?? 'ssh',
      instanceName: resolvedRemote.instanceName ?? null,
      sshHost: resolvedRemote.sshHost ?? null,
      engineRoot: resolvedRemote.engineRoot ?? null,
      pythonCommand: resolvedRemote.pythonCommand ?? null,
      paidRung: isPaidRemote(resolvedRemote),
      paidEnabled: isRemotePaidEnabled(config, resolvedRemote, remoteId),
      active: remoteId === registry.activeRemoteId,
    };
  });
}

function normalizeFleetId(fleet = {}, preferredId = null) {
  const normalizedFleet = fleet && typeof fleet === 'object' ? fleet : {};
  return String(
    preferredId
      ?? normalizedFleet.fleetId
      ?? normalizedFleet.instanceName
      ?? '',
  ).trim() || null;
}

function normalizeRemoteIdList(remoteIds = []) {
  return Array.from(new Set(
    (Array.isArray(remoteIds) ? remoteIds : [])
      .map((remoteId) => String(remoteId ?? '').trim())
      .filter(Boolean),
  )).sort();
}

function getFrontierFleetRegistry(config = {}) {
  return {
    fleets: {
      ...((config.frontier?.fleets && typeof config.frontier.fleets === 'object')
        ? config.frontier.fleets
        : {}),
    },
  };
}

function buildFrontierFleetMemberIds(fleetId, count) {
  const normalizedCount = Number(count);
  if (!Number.isInteger(normalizedCount) || normalizedCount <= 0) {
    return [];
  }
  const width = Math.max(2, String(normalizedCount).length);
  return Array.from({ length: normalizedCount }, (_, index) => (
    `${fleetId}-${String(index + 1).padStart(width, '0')}`
  ));
}

function persistFrontierFleet(config, fleetConfig, options = {}) {
  const registry = getFrontierFleetRegistry(config);
  const fleetId = normalizeFleetId(fleetConfig, options.fleetId ?? null);
  if (!fleetId) {
    return {
      frontier: { ...(config.frontier ?? {}) },
      fleetId: null,
      fleet: null,
    };
  }

  const fleets = {
    ...registry.fleets,
    [fleetId]: {
      ...(registry.fleets[fleetId] ?? {}),
      ...(fleetConfig ?? {}),
      fleetId,
      remoteIds: normalizeRemoteIdList(fleetConfig?.remoteIds ?? []),
    },
  };

  return {
    frontier: {
      ...(config.frontier ?? {}),
      fleets,
    },
    fleetId,
    fleet: fleets[fleetId],
  };
}

function persistFrontierRemote(config, remoteConfig, options = {}) {
  const registry = getFrontierRemoteRegistry(config);
  const remoteId = normalizeRemoteId(remoteConfig, options.remoteId ?? null);
  if (!remoteId) {
    return {
      frontier: {
        ...config.frontier,
      },
      remoteId: null,
    };
  }
  const remotes = {
    ...registry.remotes,
    [remoteId]: {
      ...(registry.remotes[remoteId] ?? {}),
      ...remoteConfig,
      remoteId,
    },
  };
  const activeRemoteId = options.setActive === false
    ? (registry.activeRemoteId ?? remoteId)
    : remoteId;
  const nextConfig = {
    ...config,
    frontier: {
      ...config.frontier,
      activeRemoteId,
      remotes,
    },
  };
  const activeRemote = remotes[activeRemoteId] ?? remotes[remoteId] ?? null;
  return {
    frontier: {
      ...nextConfig.frontier,
      remote: activeRemote
        ? {
            ...activeRemote,
            paidEnabled: isRemotePaidEnabled(nextConfig, activeRemote, activeRemoteId),
          }
        : null,
    },
    remoteId,
  };
}

function resolveRemoteConfigDefaults(remoteConfig = {}, workspaceRoot = getWorkspaceRoot()) {
  const provider = remoteConfig.provider === 'brev' ? 'brev' : 'ssh';
  const instanceName = remoteConfig.instanceName ?? null;
  const sshHost = remoteConfig.sshHost ?? (provider === 'brev' ? instanceName : null);
  const legacyBrevEngineRoot = provider === 'brev'
    && String(remoteConfig.engineRoot ?? '').includes('%USERPROFILE%');
  const legacyBrevPythonCommand = provider === 'brev'
    && String(remoteConfig.pythonCommand ?? '').trim().startsWith('py ');
  const brevHomeDir = provider === 'brev' && (!remoteConfig.engineRoot || legacyBrevEngineRoot)
    ? probeBrevRemoteHome(instanceName ?? sshHost ?? null, { cwd: workspaceRoot })
    : null;
  const engineRoot = remoteConfig.engineRoot && !legacyBrevEngineRoot
    ? remoteConfig.engineRoot
    : getDefaultRemoteEngineRoot(provider, brevHomeDir);
  const pythonCommand = remoteConfig.pythonCommand && !legacyBrevPythonCommand
    ? remoteConfig.pythonCommand
    : getDefaultRemotePythonCommand(provider);
  return {
    ...remoteConfig,
    provider,
    instanceName,
    sshHost,
    engineRoot,
    pythonCommand,
  };
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

function probePythonCommand(spec, workspaceRoot = getWorkspaceRoot()) {
  if (!spec) {
    return {
      available: false,
      pythonExecutable: null,
      pythonVersion: null,
      error: 'python unavailable',
    };
  }

  const result = runCommandCapture({
    executable: spec.executable,
    args: [...(spec.argsPrefix ?? []), '-c', PYTHON_EXECUTABLE_PROBE_SCRIPT],
  }, { cwd: workspaceRoot });

  if (!result.ok || !result.stdout) {
    return {
      available: false,
      pythonExecutable: spec.executable,
      pythonVersion: null,
      error: result.stderr ?? 'python executable probe failed',
    };
  }

  const lines = String(result.stdout)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    available: true,
    pythonExecutable: lines[0] ?? spec.executable,
    pythonVersion: lines[1] ?? null,
    error: null,
  };
}

function resolveBundledFrontierCliRunner(workspaceRoot = getWorkspaceRoot()) {
  const bundledEngineCliPath = getBundledFrontierEngineSourcePath();
  if (!fs.existsSync(bundledEngineCliPath)) {
    return {
      runner: null,
      error: 'No runnable bundled frontier-engine CLI is currently available.',
    };
  }

  const managedProbe = probePythonCommand(getManagedPythonSpec(workspaceRoot), workspaceRoot);
  if (managedProbe.available) {
    return {
      runner: {
        mode: 'managed',
        executable: managedProbe.pythonExecutable,
        argsPrefix: [bundledEngineCliPath],
        pythonVersion: managedProbe.pythonVersion,
      },
      error: null,
    };
  }

  const systemProbe = probePythonCommand(detectSystemPythonSpec(), workspaceRoot);
  if (systemProbe.available) {
    return {
      runner: {
        mode: 'system',
        executable: systemProbe.pythonExecutable,
        argsPrefix: [bundledEngineCliPath],
        pythonVersion: systemProbe.pythonVersion,
      },
      error: null,
    };
  }

  return {
    runner: null,
    error: managedProbe.error ?? systemProbe.error ?? 'No runnable bundled frontier-engine CLI is currently available.',
  };
}

function runBundledFrontierCli(commandArgs = [], workspaceRoot = getWorkspaceRoot(), runnerOverride = null) {
  const resolvedRunner = runnerOverride
    ? { runner: runnerOverride, error: null }
    : resolveBundledFrontierCliRunner(workspaceRoot);

  if (resolvedRunner.runner) {
    return {
      runner: resolvedRunner.runner,
      result: runCommandCapture({
        executable: resolvedRunner.runner.executable,
        args: [...(resolvedRunner.runner.argsPrefix ?? []), ...commandArgs],
      }, { cwd: workspaceRoot }),
    };
  }

  return {
    runner: null,
    result: {
      ok: false,
      stdout: null,
      stderr: resolvedRunner.error ?? 'No runnable bundled frontier-engine CLI is currently available.',
    },
  };
}

function probeRemoteFrontierRuntime(remoteConfig = {}, workspaceRoot = getWorkspaceRoot()) {
  const provider = remoteConfig.provider ?? 'ssh';
  const sshHost = remoteConfig.sshHost ?? null;
  const instanceName = remoteConfig.instanceName ?? null;
  const remoteTarget = {
    ...remoteConfig,
    provider,
    sshHost,
    instanceName,
  };
  const remoteIdentity = isBrevRemote(remoteTarget)
    ? (instanceName ?? sshHost)
    : sshHost;
  if (!remoteIdentity) {
    return null;
  }

  const pythonCommand = remoteConfig.pythonCommand ?? getDefaultRemotePythonCommand(provider);
  const engineRoot = remoteConfig.engineRoot ?? getDefaultRemoteEngineRoot(provider);
  const cliPath = joinRemotePath(remoteTarget, engineRoot, 'src', 'frontier_engine', 'cli.py');
  const pyprojectPath = joinRemotePath(remoteTarget, engineRoot, 'pyproject.toml');
  const pythonProbeCommand = isBrevRemote(remoteTarget)
    ? `${pythonCommand} - <<'PY'
import importlib.util, platform, sys
print(platform.python_version())
print(sys.executable)
print(importlib.util.find_spec("torch") is not None)
PY`
    : `${pythonCommand} -c "import platform, sys; import importlib.util; print(platform.python_version()); print(sys.executable); print(importlib.util.find_spec('torch') is not None)"`;
  const torchProbeCommand = isBrevRemote(remoteTarget)
    ? `${pythonCommand} - <<'PY'
import torch
print(torch.__version__)
print(torch.cuda.is_available())
print(torch.cuda.device_count())
print(torch.cuda.get_device_name(0) if torch.cuda.is_available() and torch.cuda.device_count() else "")
PY`
    : `${pythonCommand} -c "import torch; print(torch.__version__); print(torch.cuda.is_available()); print(torch.cuda.device_count()); print(torch.cuda.get_device_name(0) if torch.cuda.is_available() and torch.cuda.device_count() else '')"`;
  const engineProbeCommand = isBrevRemote(remoteTarget)
    ? `test -f ${quotePosixShellArg(cliPath)} && printf 'true\\n' || printf 'false\\n'`
    : `cmd /c if exist ${quoteRemoteWindowsPath(cliPath)} (echo true) else (echo false)`;
  const pyprojectProbeCommand = isBrevRemote(remoteTarget)
    ? `test -f ${quotePosixShellArg(pyprojectPath)} && printf 'true\\n' || printf 'false\\n'`
    : `cmd /c if exist ${quoteRemoteWindowsPath(pyprojectPath)} (echo true) else (echo false)`;

  const pythonProbe = runRemoteCommandCapture(remoteTarget, pythonProbeCommand, { cwd: workspaceRoot });
  const torchProbe = runRemoteCommandCapture(remoteTarget, torchProbeCommand, { cwd: workspaceRoot });
  const engineProbe = runRemoteCommandCapture(remoteTarget, engineProbeCommand, { cwd: workspaceRoot });
  const pyprojectProbe = runRemoteCommandCapture(remoteTarget, pyprojectProbeCommand, { cwd: workspaceRoot });

  const pythonLines = (pythonProbe.stdout ?? '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const torchLines = (torchProbe.stdout ?? '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  return {
    attached: Boolean(remoteConfig.attached),
    provider,
    instanceName,
    sshHost,
    pythonCommand,
    engineRoot,
    available: pythonProbe.ok,
    pythonVersion: pythonLines[0] ?? null,
    pythonExecutable: pythonLines[1] ?? null,
    torchInstalled: pythonLines[2] === 'True',
    torchVersion: torchProbe.ok ? (torchLines[0] ?? null) : null,
    cudaAvailable: torchProbe.ok ? torchLines[1] === 'True' : false,
    cudaDeviceCount: torchProbe.ok ? Number(torchLines[2] ?? 0) : 0,
    cudaDeviceNames: torchProbe.ok && torchLines[3] ? [torchLines[3]] : [],
    frontierEngineReady: engineProbe.ok && engineProbe.stdout === 'true',
    engineCliPresent: engineProbe.ok && engineProbe.stdout === 'true',
    enginePyprojectPresent: pyprojectProbe.ok && pyprojectProbe.stdout === 'true',
    error: pythonProbe.ok
      ? (torchProbe.ok ? null : (torchProbe.stderr ?? null))
      : (pythonProbe.stderr ?? null),
  };
}

function getBundledFrontierEngineRoot() {
  return path.join(repoRoot, 'research', 'frontier-engine');
}

function getBundledFrontierEnginePyprojectPath() {
  return path.join(getBundledFrontierEngineRoot(), 'pyproject.toml');
}

function getBundledFrontierEngineSourcePath() {
  return path.join(getBundledFrontierEngineRoot(), 'src', 'frontier_engine', 'cli.py');
}

function getBundledFrontierExperimentPath(...parts) {
  return path.join(getBundledFrontierEngineRoot(), 'experiments', ...parts);
}

function getBundledFrontierExperimentsRoot() {
  return getBundledFrontierExperimentPath();
}

function getBundledFrontierSourcePackagePath() {
  return path.join(getBundledFrontierEngineRoot(), 'src', 'frontier_engine');
}

function getFrontierLaneExperimentDirName(laneId) {
  return String(laneId ?? '').trim().replaceAll('_', '-');
}

function sanitizeSyncLabelSegment(value) {
  return String(value ?? '')
    .trim()
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    || 'entry';
}

function buildLaneSyncEntries(laneId, experimentDir, experimentsReadmePath) {
  const experimentDirName = path.basename(experimentDir);
  const entries = [];

  if (experimentsReadmePath && fs.existsSync(experimentsReadmePath)) {
    entries.push({
      label: 'sync_frontier_experiments_readme',
      localPath: experimentsReadmePath,
      remoteRelativePath: path.join('experiments', 'README.md'),
      recursive: false,
    });
  }

  if (laneId === 'p848_anchor_ladder') {
    const topLevelEntries = fs.readdirSync(experimentDir, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of topLevelEntries) {
      entries.push({
        label: `sync_frontier_lane_${laneId}_${sanitizeSyncLabelSegment(entry.name)}`,
        localPath: path.join(experimentDir, entry.name),
        remoteRelativePath: path.join('experiments', experimentDirName, entry.name),
        recursive: false,
      });
    }

    const latestRoot = path.join(experimentDir, 'live-frontier-sync', 'latest');
    if (fs.existsSync(latestRoot)) {
      const latestChildren = fs.readdirSync(latestRoot, { withFileTypes: true })
        .sort((left, right) => left.name.localeCompare(right.name));
      for (const entry of latestChildren) {
        entries.push({
          label: `sync_frontier_lane_${laneId}_live_latest_${sanitizeSyncLabelSegment(entry.name)}`,
          localPath: path.join(latestRoot, entry.name),
          remoteRelativePath: entry.isDirectory()
            ? path.join('experiments', experimentDirName, 'live-frontier-sync', 'latest')
            : path.join('experiments', experimentDirName, 'live-frontier-sync', 'latest', entry.name),
          recursive: entry.isDirectory(),
        });
      }
    }

    return entries;
  }

  entries.push({
    label: `sync_frontier_lane_${laneId}`,
    localPath: experimentDir,
    remoteRelativePath: path.join('experiments'),
    recursive: true,
  });
  return entries;
}

function resolveFrontierSyncScope(laneId = null) {
  const experimentsRoot = getBundledFrontierExperimentsRoot();
  const experimentsReadmePath = path.join(experimentsRoot, 'README.md');
  const normalizedLaneId = laneId ? String(laneId).trim() : null;

  if (!normalizedLaneId || normalizedLaneId === 'all') {
    const experimentDirs = fs.existsSync(experimentsRoot)
      ? fs.readdirSync(experimentsRoot, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => path.join(experimentsRoot, entry.name))
        .sort()
      : [];
    return {
      mode: 'all',
      laneId: null,
      label: 'all frontier-engine lanes',
      experimentsRoot,
      experimentsReadmePath,
      experimentDirs,
      syncPaths: [experimentsRoot],
      error: null,
    };
  }

  const experimentDirName = getFrontierLaneExperimentDirName(normalizedLaneId);
  const experimentDir = path.join(experimentsRoot, experimentDirName);
  if (!fs.existsSync(experimentDir)) {
    return {
      mode: 'lane',
      laneId: normalizedLaneId,
      label: normalizedLaneId,
      experimentsRoot,
      experimentsReadmePath,
      experimentDirName,
      experimentDir,
      syncPaths: [],
      error: `No bundled frontier-engine experiment directory was found for lane ${normalizedLaneId}.`,
    };
  }

  const syncEntries = buildLaneSyncEntries(normalizedLaneId, experimentDir, experimentsReadmePath);

  return {
    mode: 'lane',
    laneId: normalizedLaneId,
    label: normalizedLaneId,
    experimentsRoot,
    experimentsReadmePath,
    experimentDirName,
    experimentDir,
    syncEntries,
    syncPaths: syncEntries.map((entry) => entry.localPath),
    error: null,
  };
}

function detectSystemPythonSpec() {
  const candidates = process.platform === 'win32'
    ? [
        { executable: 'py', argsPrefix: ['-3'] },
        { executable: 'python', argsPrefix: [] },
        { executable: 'python3', argsPrefix: [] },
      ]
    : [
        { executable: 'python3.13', argsPrefix: [] },
        { executable: 'python3.12', argsPrefix: [] },
        { executable: 'python3.11', argsPrefix: [] },
        { executable: 'python3.10', argsPrefix: [] },
        { executable: 'python3', argsPrefix: [] },
        { executable: 'python', argsPrefix: [] },
      ];

  for (const candidate of candidates) {
    const probe = runCommandCapture({
      executable: candidate.executable,
      args: [...candidate.argsPrefix, '-c', 'import sys; print(sys.executable)'],
    });
    if (probe.ok) {
      return candidate;
    }
  }

  return null;
}

function getWorkspaceFrontierDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceDir(workspaceRoot), 'frontier');
}

function getWorkspaceFrontierVenvDir(workspaceRoot = getWorkspaceRoot()) {
  return path.join(getWorkspaceFrontierDir(workspaceRoot), 'venv');
}

function getVenvPythonExecutable(venvDir) {
  const candidates = process.platform === 'win32'
    ? [path.join(venvDir, 'Scripts', 'python.exe')]
    : [path.join(venvDir, 'bin', 'python3'), path.join(venvDir, 'bin', 'python')];
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? candidates[0];
}

function probePythonRuntime(spec, workspaceRoot = getWorkspaceRoot()) {
  if (!spec) {
    return {
      available: false,
      pythonExecutable: null,
      pythonVersion: null,
      frontierEngineInstalled: false,
      torchInstalled: false,
      torchVersion: null,
      cudaAvailable: false,
      cudaDeviceCount: 0,
      cudaDeviceNames: [],
      error: 'python unavailable',
    };
  }

  const result = runCommandCapture({
    executable: spec.executable,
    args: [...(spec.argsPrefix ?? []), '-c', PYTHON_PROBE_SCRIPT],
  }, { cwd: workspaceRoot });

  if (!result.ok || !result.stdout) {
    return {
      available: false,
      pythonExecutable: spec.executable,
      pythonVersion: null,
      frontierEngineInstalled: false,
      torchInstalled: false,
      torchVersion: null,
      cudaAvailable: false,
      cudaDeviceCount: 0,
      cudaDeviceNames: [],
      error: result.stderr ?? 'python probe failed',
    };
  }

  try {
    const payload = JSON.parse(result.stdout);
    return {
      available: true,
      pythonExecutable: payload.python_executable ?? spec.executable,
      pythonVersion: payload.python_version ?? null,
      frontierEngineInstalled: Boolean(payload.frontier_engine_installed),
      torchInstalled: Boolean(payload.torch_installed),
      torchVersion: payload.torch_version ?? null,
      cudaAvailable: Boolean(payload.cuda_available),
      cudaDeviceCount: Number(payload.cuda_device_count ?? 0),
      cudaDeviceNames: Array.isArray(payload.cuda_device_names) ? payload.cuda_device_names : [],
      error: payload.cuda_error ?? null,
    };
  } catch (error) {
    return {
      available: false,
      pythonExecutable: spec.executable,
      pythonVersion: null,
      frontierEngineInstalled: false,
      torchInstalled: false,
      torchVersion: null,
      cudaAvailable: false,
      cudaDeviceCount: 0,
      cudaDeviceNames: [],
      error: error.message,
    };
  }
}

function parsePythonVersionTuple(version) {
  const match = String(version ?? '').match(/^(\d+)\.(\d+)(?:\.(\d+))?/);
  if (!match) {
    return null;
  }
  return [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)];
}

function isPythonVersionAtLeast(version, minimumMajor, minimumMinor) {
  const parsed = parsePythonVersionTuple(version);
  if (!parsed) {
    return false;
  }
  const [major, minor] = parsed;
  if (major !== minimumMajor) {
    return major > minimumMajor;
  }
  return minor >= minimumMinor;
}

function getManagedPythonSpec(workspaceRoot = getWorkspaceRoot()) {
  const executable = getVenvPythonExecutable(getWorkspaceFrontierVenvDir(workspaceRoot));
  if (!fs.existsSync(executable)) {
    return null;
  }
  return { executable, argsPrefix: [] };
}

function getFrontierSetupCommand(mode = 'base') {
  return `erdos frontier setup --${mode}`;
}

function resolveFrontierActiveMode(frontierConfig) {
  const activeRemoteId = normalizeRemoteId(frontierConfig?.remote ?? {}, frontierConfig?.activeRemoteId ?? null);
  const remotePaidEnabled = frontierConfig?.remote?.provider !== 'brev'
    || getFrontierPaidRungs({ frontier: frontierConfig }).enabledRemoteIds.includes(activeRemoteId ?? '');
  const remoteGpuReady = Boolean(frontierConfig?.remote?.attached && frontierConfig?.remote?.gpuSearchReady && remotePaidEnabled);
  if (!frontierConfig?.loopOptIn && !remoteGpuReady) {
    return null;
  }
  if (remoteGpuReady) {
    return 'gpu';
  }
  if (frontierConfig.gpuSearchReady) {
    return 'gpu';
  }
  if (frontierConfig.managedFrontierReady) {
    return 'cpu';
  }
  return null;
}

function buildFrontierResearchModes(snapshot) {
  const remotePaidBlocked = Boolean(snapshot.remote?.attached && snapshot.remote?.paidRung && !snapshot.remote?.paidEnabled);
  const remoteGpuMode = snapshot.remote?.attached && snapshot.remote?.gpuSearchReady && !remotePaidBlocked
    ? {
        available: true,
        mode: 'gpu',
        source: 'ssh_remote',
        reason: `${getRemoteProviderLabel(snapshot.remote)} is attached and ready for heavy search`,
      }
    : null;
  const explicitRemoteSelection = Boolean(snapshot.selectedRemoteId);
  const managedMode = snapshot.frontierLoopOptIn
    ? (snapshot.gpuSearchReady ? 'gpu' : (snapshot.managedFrontierReady ? 'cpu' : null))
    : null;
  const managedHeavySearch = snapshot.frontierLoopOptIn && snapshot.gpuSearchReady
    ? {
        available: true,
        mode: 'gpu',
        source: 'managed_runtime',
        reason: 'heavy search space clearing is GPU-eligible on the managed CUDA runtime',
      }
    : null;

  const bridgeRefresh = managedMode
    ? {
        available: true,
        mode: managedMode,
        source: 'managed_runtime',
        reason: `managed frontier runtime is opted in and ready in ${managedMode} mode`,
      }
    : snapshot.bridgeRefreshReady
      ? {
          available: true,
          mode: 'system',
          source: 'system_python',
          reason: snapshot.frontierLoopOptIn
            ? 'managed frontier runtime is not ready yet, so bridge refresh falls back to the bundled CLI via system python'
            : 'frontier loop is not opted in, so bridge refresh uses the bundled CLI via system python',
        }
      : {
          available: false,
          mode: null,
          source: 'unavailable',
          reason: 'no runnable python path is currently available for bridge refresh',
        };

  const familySearch = managedMode
    ? {
        available: true,
        mode: managedMode,
        source: 'managed_runtime',
        reason: `family-aware frontier search can run on the opted-in managed ${managedMode} runtime`,
      }
    : {
        available: false,
        mode: null,
        source: 'unavailable',
        reason: snapshot.frontierLoopOptIn
          ? 'managed frontier runtime is not ready yet for family-aware search'
          : 'frontier loop is not opted in, so family-aware search stays out of the active loop',
      };

  let heavySearch = null;
  if (explicitRemoteSelection) {
    heavySearch = remoteGpuMode
      ?? (remotePaidBlocked
        ? {
            available: false,
            mode: null,
            source: 'unavailable',
            reason: `${getRemoteProviderLabel(snapshot.remote)} is attached and GPU-ready, but this paid rung is not enabled for the workspace`,
          }
        : {
            available: false,
            mode: null,
            source: 'unavailable',
            reason: snapshot.remote?.attached
              ? `${getRemoteProviderLabel(snapshot.remote)} is selected, but its heavy-search runtime is not ready`
              : 'the selected remote is not attached, so heavy GPU search is not available there yet',
          });
  } else {
    heavySearch = managedHeavySearch
      ?? remoteGpuMode
      ?? (remotePaidBlocked
        ? {
            available: false,
            mode: null,
            source: 'unavailable',
            reason: `${getRemoteProviderLabel(snapshot.remote)} is attached and GPU-ready, but this paid rung is not enabled for the workspace`,
          }
        : {
            available: false,
            mode: null,
            source: 'unavailable',
            reason: snapshot.frontierLoopOptIn
              ? 'CUDA is not ready yet, so heavy search stays unavailable'
              : 'frontier loop is not opted in, so heavy GPU search stays out of the active loop',
          });
  }

  return {
    bridgeRefresh,
    familySearch,
    heavySearch,
  };
}

export function getFrontierResearchModesForSnapshot(snapshot) {
  return buildFrontierResearchModes(snapshot);
}

function getFrontierSetupPlan(mode = 'base', workspaceRoot = getWorkspaceRoot(), options = {}) {
  const normalizedMode = mode ?? 'base';
  const systemPython = detectSystemPythonSpec();
  const frontierDir = getWorkspaceFrontierDir(workspaceRoot);
  const venvDir = getWorkspaceFrontierVenvDir(workspaceRoot);
  const bundledRoot = getBundledFrontierEngineRoot();
  const pythonCommand = systemPython
    ? { executable: systemPython.executable, args: [...systemPython.argsPrefix, '-m', 'venv', venvDir] }
    : null;
  const venvPython = getVenvPythonExecutable(venvDir);
  const steps = [];

  if (pythonCommand) {
    steps.push({
      label: 'create_managed_venv',
      command: pythonCommand,
    });
    steps.push({
      label: 'upgrade_pip',
      command: {
        executable: venvPython,
        args: ['-m', 'pip', 'install', '--upgrade', 'pip'],
      },
    });
    steps.push({
      label: 'install_bundled_frontier_engine',
      command: {
        executable: venvPython,
        args: ['-m', 'pip', 'install', bundledRoot],
      },
    });
  }

  if (normalizedMode === 'cpu') {
    steps.push({
      label: 'install_torch_cpu',
      command: {
        executable: venvPython,
        args: ['-m', 'pip', 'install', 'torch'],
      },
      optional: false,
    });
  }

  if (normalizedMode === 'cuda') {
    if (options.torchIndexUrl) {
      steps.push({
        label: 'install_torch_cuda',
        command: {
          executable: venvPython,
          args: ['-m', 'pip', 'install', 'torch', '--index-url', options.torchIndexUrl],
        },
        optional: false,
      });
    } else {
      steps.push({
        label: 'install_torch_cuda',
        command: {
          executable: venvPython,
          args: ['-m', 'pip', 'install', 'torch', '--index-url', '<pytorch-cuda-wheel-url>'],
        },
        optional: true,
        note: 'Supply --torch-index-url to make the CUDA torch install concrete.',
      });
    }
  }

  return {
    mode: normalizedMode,
    workspaceRoot,
    frontierWorkspaceDir: frontierDir,
    managedVenvDir: venvDir,
    bundledEngineRoot: bundledRoot,
    bundledEnginePyprojectPath: getBundledFrontierEnginePyprojectPath(),
    systemPythonCommand: systemPython
      ? formatCommand({
          executable: systemPython.executable,
          args: [...systemPython.argsPrefix, '-m', 'venv', venvDir],
        })
      : null,
    steps: steps.map((step) => ({
      ...step,
      commandLine: formatCommand(step.command),
    })),
    notes: [
      'npm install stays lightweight because frontier runtime setup only happens when you run this command.',
      normalizedMode === 'cuda'
        ? 'CUDA torch installation is intentionally explicit so users can choose the wheel/index URL that matches their GPU driver stack.'
        : 'The bundled frontier-engine source is installed into a managed Python virtualenv under .erdos/frontier.',
      'Run `erdos frontier doctor` after setup to verify the runtime.',
    ],
  };
}

function executePlanStep(step, workspaceRoot = getWorkspaceRoot()) {
  const result = runCommandCapture(step.command, { cwd: workspaceRoot });
  return {
    label: step.label,
    commandLine: formatCommand(step.command),
    ok: result.ok,
    stdout: result.stdout,
    stderr: result.stderr,
  };
}

function buildFrontierDoctorSnapshot(workspaceRoot = getWorkspaceRoot(), options = {}) {
  const bundledRoot = getBundledFrontierEngineRoot();
  const bundledPyproject = getBundledFrontierEnginePyprojectPath();
  const bundledCli = getBundledFrontierEngineSourcePath();
  const systemPythonSpec = detectSystemPythonSpec();
  const managedPythonSpec = getManagedPythonSpec(workspaceRoot);
  const systemRuntime = probePythonRuntime(systemPythonSpec, workspaceRoot);
  const managedRuntime = probePythonRuntime(managedPythonSpec, workspaceRoot);
  const config = loadConfig(workspaceRoot);
  const remoteRegistry = getFrontierRemoteRegistry(config);
  const selectedRemoteConfig = options.remoteId
    ? (remoteRegistry.remotes[options.remoteId] ?? null)
    : null;
  const selectedRemoteId = options.remoteId
    ? (selectedRemoteConfig ? normalizeRemoteId(selectedRemoteConfig, options.remoteId) : null)
    : remoteRegistry.activeRemoteId;
  const activeRemoteConfig = resolveRemoteConfigDefaults(
    selectedRemoteConfig ?? remoteRegistry.activeRemote ?? (config.frontier?.remote ?? {}),
    workspaceRoot,
  );
  const remoteRuntime = probeRemoteFrontierRuntime(activeRemoteConfig, workspaceRoot);
  const resolvedRemote = remoteRuntime
    ? {
        ...activeRemoteConfig,
        ...remoteRuntime,
        paidRung: isPaidRemote(activeRemoteConfig),
        paidEnabled: isRemotePaidEnabled(config, activeRemoteConfig, selectedRemoteId ?? remoteRegistry.activeRemoteId),
        gpuSearchReady: Boolean(remoteRuntime.frontierEngineReady && remoteRuntime.cudaAvailable),
      }
    : null;
  const derivedFrontier = {
    ...config.frontier,
    managedFrontierReady: managedRuntime.available && managedRuntime.frontierEngineInstalled,
    gpuSearchReady: managedRuntime.available && managedRuntime.frontierEngineInstalled && managedRuntime.torchInstalled && managedRuntime.cudaAvailable,
    remote: {
      ...(config.frontier?.remote ?? {}),
      frontierEngineReady: Boolean(resolvedRemote?.frontierEngineReady),
      gpuSearchReady: Boolean(resolvedRemote?.gpuSearchReady),
      paidRung: Boolean(resolvedRemote?.paidRung),
      paidEnabled: Boolean(resolvedRemote?.paidEnabled),
    },
  };
  const frontierLoopMode = resolveFrontierActiveMode(derivedFrontier);

  const snapshot = {
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    frontierWorkspaceDir: getWorkspaceFrontierDir(workspaceRoot),
    managedVenvDir: getWorkspaceFrontierVenvDir(workspaceRoot),
    bundledEnginePresent: fs.existsSync(bundledRoot),
    bundledEngineRoot: bundledRoot,
    bundledEnginePyprojectPresent: fs.existsSync(bundledPyproject),
    bundledEnginePyprojectPath: bundledPyproject,
    bundledEngineCliPresent: fs.existsSync(bundledCli),
    bundledEngineCliPath: bundledCli,
    systemPython: systemRuntime,
    managedPython: managedRuntime,
    remote: resolvedRemote,
    bridgeRefreshReady: systemRuntime.available && fs.existsSync(bundledCli),
    managedFrontierReady: derivedFrontier.managedFrontierReady,
    gpuSearchReady: derivedFrontier.gpuSearchReady,
    frontierLoopOptIn: Boolean(config.frontier?.loopOptIn),
    frontierLoopMode,
    activeRemoteId: selectedRemoteId ?? remoteRegistry.activeRemoteId,
    selectedRemoteId: options.remoteId ? selectedRemoteId : null,
    selectedRemoteFound: options.remoteId ? Boolean(selectedRemoteConfig) : true,
    registeredRemotes: buildRegisteredRemotesSummary(config),
    registeredFleets: getFrontierFleetsSnapshot(workspaceRoot).fleets,
    paidRungs: getFrontierPaidRungs(config),
    commands: {
      doctor: 'erdos frontier doctor',
      lanes: 'erdos frontier lanes',
      remotes: 'erdos frontier remotes',
      fleets: 'erdos frontier fleets',
      useRemote: 'erdos frontier use-remote <remote-id>',
      setupBase: getFrontierSetupCommand('base'),
      setupCpu: getFrontierSetupCommand('cpu'),
      setupCuda: `${getFrontierSetupCommand('cuda')} --torch-index-url <url>`,
      setupRemote: 'erdos frontier setup-remote --remote-id <id> --cuda --torch-index-url <url>',
      createBrev: 'erdos frontier create-brev <name> --gpu-name H100 --dry-run',
      createBrevFleet: 'erdos frontier create-brev-fleet <fleet-id> --type hyperstack_H100 --count 2 --dry-run',
      attachBrev: 'erdos frontier attach-brev --instance <name> --apply',
      enablePaidRemote: 'erdos frontier enable-paid-remote <remote-id>',
      enablePaidFleet: 'erdos frontier enable-paid-fleet <fleet-id>',
      attachSsh: 'erdos frontier attach-ssh --ssh-host <host> --apply',
      syncSsh: 'erdos frontier sync-ssh --apply',
      syncFleet: 'erdos frontier sync-fleet <fleet-id> --lane p848_anchor_ladder --apply',
      bridgeRefresh848: 'erdos number-theory bridge-refresh 848',
    },
  };
  snapshot.researchModes = buildFrontierResearchModes(snapshot);
  return snapshot;
}

export function getFrontierDoctorSnapshot(workspaceRoot = getWorkspaceRoot()) {
  return buildFrontierDoctorSnapshot(workspaceRoot);
}

export function getFrontierDoctorSnapshotForRemote(remoteId, workspaceRoot = getWorkspaceRoot()) {
  return buildFrontierDoctorSnapshot(workspaceRoot, { remoteId });
}

export function syncFrontierDoctorSnapshot(workspaceRoot = getWorkspaceRoot()) {
  const snapshot = getFrontierDoctorSnapshot(workspaceRoot);
  const config = loadConfig(workspaceRoot);
  const persistedRemote = snapshot.remote
    ? persistFrontierRemote(config, {
        ...(config.frontier?.remote ?? {}),
        ...(snapshot.remote ?? {}),
      }, {
        remoteId: snapshot.activeRemoteId ?? normalizeRemoteId(snapshot.remote),
        setActive: true,
      })
    : { frontier: { ...config.frontier }, remoteId: snapshot.activeRemoteId ?? null };
  saveConfig({
    ...config,
    frontier: {
      ...persistedRemote.frontier,
      managedFrontierReady: snapshot.managedFrontierReady,
      gpuSearchReady: snapshot.gpuSearchReady,
      activeMode: snapshot.frontierLoopMode,
      lastDoctorAt: snapshot.generatedAt,
      activeRemoteId: snapshot.activeRemoteId ?? persistedRemote.remoteId ?? config.frontier?.activeRemoteId ?? null,
    },
  }, workspaceRoot);
  return snapshot;
}

export function applyFrontierSetup(mode = 'base', workspaceRoot = getWorkspaceRoot(), options = {}) {
  const plan = getFrontierSetupPlan(mode, workspaceRoot, options);
  if (!plan.systemPythonCommand) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: 'python is not available on PATH. Install Python 3.10+ and rerun setup.',
      plan,
      stepResults: [],
      doctor: getFrontierDoctorSnapshot(workspaceRoot),
    };
  }

  if (mode === 'cuda' && !options.torchIndexUrl) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: 'CUDA setup requires --torch-index-url so the PyTorch wheel source stays explicit.',
      plan,
      stepResults: [],
      doctor: getFrontierDoctorSnapshot(workspaceRoot),
    };
  }

  const currentManagedRuntime = probePythonRuntime(getManagedPythonSpec(workspaceRoot), workspaceRoot);
  const currentSystemRuntime = probePythonRuntime(detectSystemPythonSpec(), workspaceRoot);
  ensureDir(plan.frontierWorkspaceDir);
  const stepResults = [];

  const shouldResetManagedVenv = fs.existsSync(plan.managedVenvDir) && (
    !currentManagedRuntime.available
    || !isPythonVersionAtLeast(currentManagedRuntime.pythonVersion, 3, 10)
    || (
      currentManagedRuntime.pythonExecutable
      && currentSystemRuntime.pythonExecutable
      && currentManagedRuntime.pythonExecutable !== currentSystemRuntime.pythonExecutable
    )
  );

  if (shouldResetManagedVenv) {
    fs.rmSync(plan.managedVenvDir, { recursive: true, force: true });
    stepResults.push({
      label: 'reset_managed_venv',
      commandLine: `remove ${plan.managedVenvDir}`,
      ok: true,
      stdout: 'Removed stale managed frontier virtualenv before recreation.',
      stderr: null,
    });
  }

  for (const step of plan.steps) {
    if (step.optional) {
      continue;
    }
    const result = executePlanStep(step, workspaceRoot);
    stepResults.push(result);
    if (!result.ok) {
      return {
        ok: false,
        appliedAt: new Date().toISOString(),
        error: `Setup failed on step ${step.label}.`,
        plan,
        stepResults,
        doctor: getFrontierDoctorSnapshot(workspaceRoot),
      };
    }
  }

  const doctor = getFrontierDoctorSnapshot(workspaceRoot);
  const config = loadConfig(workspaceRoot);
  const frontierConfig = {
    ...config.frontier,
    loopOptIn: doctor.managedFrontierReady,
    runtimeMode: mode,
    activeMode: resolveFrontierActiveMode({
      ...config.frontier,
      loopOptIn: doctor.managedFrontierReady,
      managedFrontierReady: doctor.managedFrontierReady,
      gpuSearchReady: doctor.gpuSearchReady,
    }),
    managedFrontierReady: doctor.managedFrontierReady,
    gpuSearchReady: doctor.gpuSearchReady,
    lastSetupAt: new Date().toISOString(),
    lastDoctorAt: doctor.generatedAt,
  };
  saveConfig({
    ...config,
    frontier: frontierConfig,
  }, workspaceRoot);

  return {
    ok: true,
    appliedAt: new Date().toISOString(),
    plan,
    stepResults,
    doctor,
  };
}

export function getFrontierSetupSnapshot(mode = 'base', workspaceRoot = getWorkspaceRoot(), options = {}) {
  return {
    generatedAt: new Date().toISOString(),
    apply: Boolean(options.apply),
    plan: getFrontierSetupPlan(mode, workspaceRoot, options),
    doctor: getFrontierDoctorSnapshot(workspaceRoot),
  };
}

function getFrontierRemoteSetupPlan(mode = 'base', workspaceRoot = getWorkspaceRoot(), options = {}) {
  const config = loadConfig(workspaceRoot);
  const registry = getFrontierRemoteRegistry(config);
  const remoteConfig = resolveRemoteConfigDefaults(
    options.remoteId
      ? (registry.remotes[options.remoteId] ?? {})
      : (registry.activeRemote ?? config.frontier?.remote ?? {}),
    workspaceRoot,
  );
  const remoteId = normalizeRemoteId(remoteConfig, options.remoteId ?? registry.activeRemoteId ?? null);
  const remoteTarget = {
    provider: remoteConfig.provider,
    instanceName: remoteConfig.instanceName,
    sshHost: remoteConfig.sshHost,
  };
  const pythonCommand = remoteConfig.pythonCommand ?? getDefaultRemotePythonCommand(remoteConfig.provider);
  const steps = [
    {
      label: 'upgrade_remote_pip',
      remoteCommand: `${pythonCommand} -m pip install --user --upgrade pip`,
    },
  ];

  if (mode === 'cpu') {
    steps.push({
      label: 'install_remote_torch_cpu',
      remoteCommand: `${pythonCommand} -m pip install --user torch`,
    });
  }

  if (mode === 'cuda') {
    steps.push({
      label: 'install_remote_torch_cuda',
      remoteCommand: options.torchIndexUrl
        ? `${pythonCommand} -m pip install --user --upgrade --force-reinstall torch --index-url ${options.torchIndexUrl}`
        : `${pythonCommand} -m pip install --user --upgrade torch`,
      note: options.torchIndexUrl
        ? 'CUDA wheel selection is pinned to the supplied torch index URL and forced to reinstall so the remote matches the chosen driver lane.'
        : 'No explicit torch index URL was supplied, so the remote setup will use the default torch package source.',
    });
  }

  return {
    mode,
    remoteId,
    remote: remoteConfig,
    remoteTarget,
    steps,
    notes: [
      'Remote setup installs runtime dependencies on the active frontier remote; the engine source itself is synced separately via `erdos frontier sync-ssh`.',
      'Use CUDA mode on GPU remotes like Umbra or a Brev H100 when you want heavy search eligibility.',
    ],
  };
}

export function getFrontierRemoteSetupSnapshot(mode = 'base', workspaceRoot = getWorkspaceRoot(), options = {}) {
  return {
    generatedAt: new Date().toISOString(),
    apply: Boolean(options.apply),
    plan: getFrontierRemoteSetupPlan(mode, workspaceRoot, options),
    doctor: getFrontierDoctorSnapshot(workspaceRoot),
  };
}

export function applyFrontierRemoteSetup(mode = 'base', workspaceRoot = getWorkspaceRoot(), options = {}) {
  const snapshot = getFrontierRemoteSetupSnapshot(mode, workspaceRoot, {
    ...options,
    apply: true,
  });

  if (!snapshot.plan.remote?.sshHost && !snapshot.plan.remote?.instanceName) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: 'Remote frontier setup requires an attached remote.',
      snapshot,
      stepResults: [],
      doctor: getFrontierDoctorSnapshot(workspaceRoot),
    };
  }

  const stepResults = [];
  for (const step of snapshot.plan.steps) {
    const result = runRemoteCommandCapture(snapshot.plan.remoteTarget, step.remoteCommand, { cwd: workspaceRoot });
    const stepResult = {
      label: step.label,
      commandLine: step.remoteCommand,
      ok: result.ok,
      stdout: result.stdout,
      stderr: result.stderr,
    };
    stepResults.push(stepResult);
    if (!result.ok) {
      return {
        ok: false,
        appliedAt: new Date().toISOString(),
        error: `Remote frontier setup failed on step ${step.label}.`,
        snapshot,
        stepResults,
        doctor: getFrontierDoctorSnapshot(workspaceRoot),
      };
    }
  }

  const doctor = syncFrontierDoctorSnapshot(workspaceRoot);
  return {
    ok: true,
    appliedAt: new Date().toISOString(),
    snapshot,
    stepResults,
    doctor,
  };
}

export function getFrontierRemoteAttachSnapshot(workspaceRoot = getWorkspaceRoot(), options = {}) {
  const config = loadConfig(workspaceRoot);
  const provider = options.provider === 'brev' ? 'brev' : 'ssh';
  const instanceName = options.instanceName ?? null;
  const brevHomeDir = provider === 'brev' && instanceName && !options.engineRoot
    ? probeBrevRemoteHome(instanceName, { cwd: workspaceRoot })
    : null;
  const remoteId = normalizeRemoteId({
    instanceName,
    sshHost: options.sshHost ?? (provider === 'brev' ? instanceName : null),
  }, options.remoteId ?? null);
  const remote = resolveRemoteConfigDefaults({
    attached: Boolean(options.apply),
    remoteId,
    provider,
    instanceName,
    engineRoot: options.engineRoot ?? getDefaultRemoteEngineRoot(provider, brevHomeDir),
    pythonCommand: options.pythonCommand ?? getDefaultRemotePythonCommand(provider),
    sshHost: options.sshHost ?? (provider === 'brev' ? instanceName : null),
  }, workspaceRoot);
  return {
    generatedAt: new Date().toISOString(),
    apply: Boolean(options.apply),
    remote,
    enablePaidRung: Boolean(options.enablePaidRung),
    paidRung: isPaidRemote(remote),
    paidEnabled: Boolean(options.enablePaidRung) || isRemotePaidEnabled(config, remote, remoteId),
    doctor: remote.sshHost ? probeRemoteFrontierRuntime(remote, workspaceRoot) : null,
  };
}

export function applyFrontierRemoteAttach(workspaceRoot = getWorkspaceRoot(), options = {}) {
  const provider = options.provider === 'brev' ? 'brev' : 'ssh';
  const instanceName = options.instanceName ?? null;
  const sshHost = options.sshHost ?? (provider === 'brev' ? instanceName : null);
  if (!sshHost) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: provider === 'brev'
        ? 'Brev attach requires --instance or --ssh-host.'
        : 'Remote SSH attach requires --ssh-host.',
      snapshot: getFrontierRemoteAttachSnapshot(workspaceRoot, options),
    };
  }

  const brevRefresh = provider === 'brev'
    ? runBrevRefreshCapture(workspaceRoot)
    : null;
  if (provider === 'brev' && !brevRefresh?.ok) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: brevRefresh.stderr ?? 'Failed to refresh Brev SSH configuration.',
      brevRefresh,
      snapshot: getFrontierRemoteAttachSnapshot(workspaceRoot, {
        ...options,
        sshHost,
      }),
    };
  }

  const snapshot = getFrontierRemoteAttachSnapshot(workspaceRoot, {
    ...options,
    provider,
    instanceName,
    sshHost,
    apply: true,
  });
  const config = loadConfig(workspaceRoot);
  const persistedRemote = persistFrontierRemote(config, {
    ...(config.frontier?.remote ?? {}),
    ...snapshot.remote,
    frontierEngineReady: Boolean(snapshot.doctor?.frontierEngineReady),
    gpuSearchReady: Boolean(snapshot.doctor?.frontierEngineReady && snapshot.doctor?.cudaAvailable),
    lastSyncAt: config.frontier?.remote?.lastSyncAt ?? null,
    lastSyncScope: config.frontier?.remote?.lastSyncScope ?? null,
    lastDoctorAt: snapshot.generatedAt,
  }, {
    remoteId: snapshot.remote.remoteId ?? options.remoteId ?? null,
    setActive: true,
  });
  let nextConfig = {
    ...config,
    frontier: {
      ...persistedRemote.frontier,
      activeMode: snapshot.doctor?.frontierEngineReady && snapshot.doctor?.cudaAvailable
        ? 'gpu'
        : config.frontier?.activeMode ?? null,
      lastDoctorAt: snapshot.generatedAt,
    },
  };
  if (snapshot.remote.provider === 'brev') {
    nextConfig = setFrontierPaidRemoteEnabled(nextConfig, snapshot.remote.remoteId, Boolean(options.enablePaidRung));
    nextConfig = {
      ...nextConfig,
      frontier: {
        ...nextConfig.frontier,
        remote: {
          ...nextConfig.frontier.remote,
          paidEnabled: isRemotePaidEnabled(nextConfig, snapshot.remote, snapshot.remote.remoteId),
        },
      },
    };
  }
  saveConfig(nextConfig, workspaceRoot);

  return {
    ok: true,
    appliedAt: new Date().toISOString(),
    brevRefresh,
    snapshot,
  };
}

export function getFrontierBrevProvisionSnapshot(workspaceRoot = getWorkspaceRoot(), options = {}) {
  const config = loadConfig(workspaceRoot);
  const instanceName = options.instanceName ?? options.name ?? null;
  const count = formatBrevNumeric(options.count) ?? 1;
  const attach = Boolean(options.attach);
  const syncLane = options.syncLane ?? null;
  const brevHomeDir = instanceName && count === 1 && !options.engineRoot
    ? probeBrevRemoteHome(instanceName, { cwd: workspaceRoot })
    : null;
  const createArgs = buildBrevCreateArgs({
    ...options,
    instanceName,
    count,
  });
  const createCommand = {
    executable: 'brev',
    args: createArgs,
  };
  const attachCommand = attach && count === 1
    ? `erdos frontier attach-brev --instance ${instanceName ?? '<instance>'} --apply`
    : null;
  const syncCommand = syncLane && attach && count === 1
    ? `erdos frontier sync-ssh --lane ${syncLane} --apply`
    : null;

  return {
    generatedAt: new Date().toISOString(),
    apply: Boolean(options.apply),
    dryRun: Boolean(options.dryRun),
    instanceName,
    count,
    attach,
    syncLane,
    provider: 'brev',
    enablePaidRung: Boolean(options.enablePaidRung),
    paidEnabled: Boolean(options.enablePaidRung) || isRemotePaidEnabled(config, { provider: 'brev', instanceName }, instanceName),
    plan: {
      createCommandLine: formatCommand(createCommand),
      attachCommand,
      syncCommand,
      engineRoot: options.engineRoot ?? getDefaultRemoteEngineRoot('brev', brevHomeDir),
      pythonCommand: options.pythonCommand ?? getDefaultRemotePythonCommand('brev'),
      sshHost: options.sshHost ?? instanceName ?? null,
    },
    filters: {
      type: options.type ?? null,
      gpuName: options.gpuName ?? null,
      provider: options.provider ?? null,
      minVram: formatBrevNumeric(options.minVram),
      minTotalVram: formatBrevNumeric(options.minTotalVram),
      maxBootTime: formatBrevNumeric(options.maxBootTime),
      minDisk: formatBrevNumeric(options.minDisk),
      minCapability: formatBrevNumeric(options.minCapability),
      sort: options.sort ?? null,
      parallel: formatBrevNumeric(options.parallel),
      startupScript: options.startupScript ?? null,
      detached: Boolean(options.detached),
    },
    warnings: classifyBrevProvision({
      ...options,
      instanceName,
      count,
      attach,
    }),
    notes: [
      'Use --dry-run to let Brev preview matching hardware types without creating anything.',
      'Single-instance H100 is the best near-term upgrade tier for p848; multi-instance runs are best used for parallel independent sweeps.',
      'Auto-attach reuses the existing frontier SSH sync/session stack after the instance is ready.',
      'Paid Brev/H100 rungs stay out of the active loop until the workspace explicitly enables them.',
    ],
  };
}

export function applyFrontierBrevProvision(workspaceRoot = getWorkspaceRoot(), options = {}) {
  const snapshot = getFrontierBrevProvisionSnapshot(workspaceRoot, {
    ...options,
    apply: true,
  });

  if (!snapshot.instanceName) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: 'Brev provisioning requires an instance name.',
      snapshot,
      createResult: null,
      attachResult: null,
      syncResult: null,
    };
  }

  if (snapshot.attach && snapshot.count !== 1) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: 'Auto-attach currently supports only a single Brev instance. Provision clusters without --attach and orchestrate them explicitly.',
      snapshot,
      createResult: null,
      attachResult: null,
      syncResult: null,
    };
  }

  const createResult = runCommandCapture({
    executable: 'brev',
    args: buildBrevCreateArgs({
      ...options,
      instanceName: snapshot.instanceName,
      count: snapshot.count,
    }),
  }, { cwd: workspaceRoot });

  if (!createResult.ok) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: createResult.stderr ?? 'Brev provisioning failed.',
      snapshot,
      createResult,
      attachResult: null,
      syncResult: null,
    };
  }

  if (snapshot.dryRun) {
    return {
      ok: true,
      appliedAt: new Date().toISOString(),
      snapshot,
      createResult,
      attachResult: null,
      syncResult: null,
    };
  }

  let attachResult = null;
  if (snapshot.attach) {
    attachResult = applyFrontierRemoteAttach(workspaceRoot, {
      provider: 'brev',
      instanceName: snapshot.instanceName,
      sshHost: snapshot.plan.sshHost,
      engineRoot: snapshot.plan.engineRoot,
      pythonCommand: snapshot.plan.pythonCommand,
      enablePaidRung: Boolean(options.enablePaidRung),
      apply: true,
    });
    if (!attachResult.ok) {
      return {
        ok: false,
        appliedAt: new Date().toISOString(),
        error: attachResult.error ?? 'Brev instance was created, but frontier attach failed.',
        snapshot,
        createResult,
        attachResult,
        syncResult: null,
      };
    }
  }

  let syncResult = null;
  if (snapshot.syncLane && snapshot.attach) {
    syncResult = applyFrontierRemoteSync(workspaceRoot, {
      remoteId: snapshot.instanceName,
      provider: 'brev',
      instanceName: snapshot.instanceName,
      sshHost: snapshot.plan.sshHost,
      engineRoot: snapshot.plan.engineRoot,
      pythonCommand: snapshot.plan.pythonCommand,
      laneId: snapshot.syncLane,
      apply: true,
    });
    if (!syncResult.ok) {
      return {
        ok: false,
        appliedAt: new Date().toISOString(),
        error: syncResult.error ?? 'Brev instance was created and attached, but frontier sync failed.',
        snapshot,
        createResult,
        attachResult,
        syncResult,
      };
    }
  }

  return {
    ok: true,
    appliedAt: new Date().toISOString(),
    snapshot,
    createResult,
    attachResult,
    syncResult,
  };
}

export function getFrontierFleetsSnapshot(workspaceRoot = getWorkspaceRoot()) {
  const config = loadConfig(workspaceRoot);
  const registry = getFrontierFleetRegistry(config);
  const remoteRegistry = getFrontierRemoteRegistry(config);
  return {
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    fleetCount: Object.keys(registry.fleets).length,
    fleets: Object.entries(registry.fleets).map(([fleetId, fleet]) => {
      const remoteIds = normalizeRemoteIdList(fleet.remoteIds ?? []);
      const memberRemotes = remoteIds.map((remoteId) => {
        const remote = remoteRegistry.remotes[remoteId] ?? null;
        return {
          remoteId,
          attached: Boolean(remote?.attached),
          provider: remote?.provider ?? null,
          instanceName: remote?.instanceName ?? null,
          sshHost: remote?.sshHost ?? null,
          gpuSearchReady: Boolean(remote?.gpuSearchReady),
          frontierEngineReady: Boolean(remote?.frontierEngineReady),
          paidRung: isPaidRemote(remote ?? {}),
          paidEnabled: isRemotePaidEnabled(config, remote ?? {}, remoteId),
          lastSyncAt: remote?.lastSyncAt ?? null,
          active: remoteId === remoteRegistry.activeRemoteId,
        };
      });
      return {
        fleetId,
        provider: fleet.provider ?? 'brev',
        paidRung: isPaidFleet(fleet),
        paidEnabled: isFleetPaidEnabled(config, fleet, fleetId),
        laneId: fleet.laneId ?? null,
        count: Number(fleet.count ?? remoteIds.length ?? 0),
        remoteIds,
        intendedTopology: fleet.intendedTopology ?? 'parallel_independent_sweeps',
        createdAt: fleet.createdAt ?? null,
        lastProvisionedAt: fleet.lastProvisionedAt ?? null,
        attachedCount: memberRemotes.filter((member) => member.attached).length,
        readyGpuCount: memberRemotes.filter((member) => member.gpuSearchReady).length,
        activeRemoteIds: memberRemotes.filter((member) => member.active).map((member) => member.remoteId),
        members: memberRemotes,
      };
    }).sort((left, right) => left.fleetId.localeCompare(right.fleetId)),
  };
}

export function getFrontierFleetSnapshot(fleetId, workspaceRoot = getWorkspaceRoot()) {
  const snapshot = getFrontierFleetsSnapshot(workspaceRoot);
  return snapshot.fleets.find((fleet) => fleet.fleetId === fleetId) ?? null;
}

export function getFrontierBrevFleetProvisionSnapshot(workspaceRoot = getWorkspaceRoot(), options = {}) {
  const config = loadConfig(workspaceRoot);
  const fleetId = normalizeFleetId({ fleetId: options.fleetId ?? options.instanceName ?? options.name ?? null });
  const count = formatBrevNumeric(options.count) ?? 0;
  const memberIds = fleetId ? buildFrontierFleetMemberIds(fleetId, count) : [];
  const attach = Boolean(options.attach);
  const syncLane = options.syncLane ?? null;

  return {
    generatedAt: new Date().toISOString(),
    apply: Boolean(options.apply),
    dryRun: Boolean(options.dryRun),
    fleetId,
    count,
    attach,
    syncLane,
    provider: 'brev',
    enablePaidRung: Boolean(options.enablePaidRung),
    paidEnabled: Boolean(options.enablePaidRung) || isFleetPaidEnabled(config, { provider: 'brev', fleetId }, fleetId),
    intendedTopology: 'parallel_independent_sweeps',
    notes: [
      'This provisions separate Brev instances so the current p848 lane can run many independent sweeps in parallel.',
      'Use 2x or 8x H100 fleets to widen the sweep frontier before investing in true shared-lane distributed batching.',
      'Shared-lane multi-GPU execution is still a future engine phase; fleet members currently run separate single-GPU jobs.',
    ],
    warnings: [
      ...classifyBrevProvision({
        ...options,
        instanceName: fleetId,
        count,
        attach: false,
      }),
      ...(attach
        ? ['Fleet auto-attach will attach and optionally sync each member one by one.']
        : []),
    ],
    members: memberIds.map((memberId) => {
      const memberSnapshot = getFrontierBrevProvisionSnapshot(workspaceRoot, {
        ...options,
        instanceName: memberId,
        count: 1,
        attach,
        syncLane,
      });
      return {
        remoteId: memberId,
        instanceName: memberId,
        paidEnabled: memberSnapshot.paidEnabled,
        createCommandLine: memberSnapshot.plan.createCommandLine,
        attachCommand: memberSnapshot.plan.attachCommand,
        syncCommand: memberSnapshot.plan.syncCommand,
        engineRoot: memberSnapshot.plan.engineRoot,
        pythonCommand: memberSnapshot.plan.pythonCommand,
      };
    }),
  };
}

export function applyFrontierBrevFleetProvision(workspaceRoot = getWorkspaceRoot(), options = {}) {
  const snapshot = getFrontierBrevFleetProvisionSnapshot(workspaceRoot, {
    ...options,
    apply: true,
  });

  if (!snapshot.fleetId) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: 'Brev fleet provisioning requires a fleet id.',
      snapshot,
      memberResults: [],
    };
  }

  if (!Number.isInteger(snapshot.count) || snapshot.count < 2) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: 'Brev fleet provisioning requires --count >= 2. Use `erdos frontier create-brev` for a single instance.',
      snapshot,
      memberResults: [],
    };
  }

  const memberResults = [];
  for (const member of snapshot.members) {
    const memberResult = applyFrontierBrevProvision(workspaceRoot, {
      ...options,
      instanceName: member.instanceName,
      count: 1,
      attach: snapshot.attach,
      syncLane: snapshot.syncLane,
      apply: true,
      dryRun: snapshot.dryRun,
    });
    memberResults.push({
      remoteId: member.remoteId,
      instanceName: member.instanceName,
      ...memberResult,
    });
    if (!memberResult.ok) {
      return {
        ok: false,
        appliedAt: new Date().toISOString(),
        error: `Fleet member ${member.instanceName} failed to provision.`,
        snapshot,
        memberResults,
      };
    }
  }

  if (!snapshot.dryRun) {
    const config = loadConfig(workspaceRoot);
    const persistedFleet = persistFrontierFleet(config, {
      fleetId: snapshot.fleetId,
      provider: snapshot.provider,
      count: snapshot.count,
      laneId: snapshot.syncLane ?? null,
      intendedTopology: snapshot.intendedTopology,
      remoteIds: snapshot.members.map((member) => member.remoteId),
      createdAt: config.frontier?.fleets?.[snapshot.fleetId]?.createdAt ?? new Date().toISOString(),
      lastProvisionedAt: new Date().toISOString(),
    }, {
      fleetId: snapshot.fleetId,
    });
    let nextConfig = {
      ...config,
      frontier: persistedFleet.frontier,
    };
    if (snapshot.provider === 'brev') {
      nextConfig = setFrontierPaidFleetEnabled(
        nextConfig,
        snapshot.fleetId,
        snapshot.members.map((member) => member.remoteId),
        Boolean(options.enablePaidRung),
      );
    }
    saveConfig(nextConfig, workspaceRoot);
  }

  return {
    ok: true,
    appliedAt: new Date().toISOString(),
    snapshot,
    memberResults,
  };
}

export function getFrontierFleetSyncSnapshot(workspaceRoot = getWorkspaceRoot(), options = {}) {
  const fleet = getFrontierFleetSnapshot(options.fleetId ?? null, workspaceRoot);
  const laneId = options.laneId ?? fleet?.laneId ?? null;
  const config = loadConfig(workspaceRoot);
  const remoteRegistry = getFrontierRemoteRegistry(config);
  return {
    generatedAt: new Date().toISOString(),
    apply: Boolean(options.apply),
    fleetId: fleet?.fleetId ?? options.fleetId ?? null,
    available: Boolean(fleet),
    laneId,
    intendedTopology: fleet?.intendedTopology ?? null,
    members: (fleet?.remoteIds ?? []).map((remoteId) => ({
      remoteId,
      provider: remoteRegistry.remotes[remoteId]?.provider ?? null,
      instanceName: remoteRegistry.remotes[remoteId]?.instanceName ?? null,
      sshHost: remoteRegistry.remotes[remoteId]?.sshHost ?? null,
      syncCommand: laneId
        ? `erdos frontier sync-ssh --remote-id ${remoteId} --lane ${laneId} --apply`
        : `erdos frontier sync-ssh --remote-id ${remoteId} --apply`,
    })),
  };
}

export function applyFrontierFleetSync(workspaceRoot = getWorkspaceRoot(), options = {}) {
  const snapshot = getFrontierFleetSyncSnapshot(workspaceRoot, {
    ...options,
    apply: true,
  });

  if (!snapshot.available) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: `Unknown frontier fleet: ${options.fleetId}`,
      snapshot,
      memberResults: [],
    };
  }

  const memberResults = [];
  for (const member of snapshot.members) {
    const result = applyFrontierRemoteSync(workspaceRoot, {
      remoteId: member.remoteId,
      laneId: snapshot.laneId,
      apply: true,
    });
    memberResults.push({
      remoteId: member.remoteId,
      ...result,
    });
    if (!result.ok) {
      return {
        ok: false,
        appliedAt: new Date().toISOString(),
        error: `Fleet sync failed on member ${member.remoteId}.`,
        snapshot,
        memberResults,
      };
    }
  }

  return {
    ok: true,
    appliedAt: new Date().toISOString(),
    snapshot,
    memberResults,
  };
}

export function getFrontierRemoteSyncSnapshot(workspaceRoot = getWorkspaceRoot(), options = {}) {
  const config = loadConfig(workspaceRoot);
  const remoteRegistry = getFrontierRemoteRegistry(config);
  const remoteConfig = resolveRemoteConfigDefaults(options.remoteId
    ? (remoteRegistry.remotes[options.remoteId] ?? {})
    : (remoteRegistry.activeRemote ?? config.frontier?.remote ?? {}), workspaceRoot);
  const provider = remoteConfig.provider ?? (options.provider === 'brev' ? 'brev' : 'ssh');
  const instanceName = remoteConfig.instanceName ?? options.instanceName ?? null;
  const sshHost = options.sshHost ?? remoteConfig.sshHost ?? null;
  const engineRoot = options.engineRoot ?? remoteConfig.engineRoot ?? getDefaultRemoteEngineRoot(provider);
  const pythonCommand = options.pythonCommand ?? remoteConfig.pythonCommand ?? getDefaultRemotePythonCommand(provider);
  const remoteCopyRoot = toRemoteCopyPath({ provider, instanceName, sshHost }, engineRoot);
  const scope = resolveFrontierSyncScope(options.laneId ?? null);
  const localEngineRoot = getBundledFrontierEngineRoot();

  return {
    generatedAt: new Date().toISOString(),
    apply: Boolean(options.apply),
    scope,
    remote: {
      attached: Boolean(remoteConfig.attached),
      remoteId: normalizeRemoteId(remoteConfig, options.remoteId ?? remoteRegistry.activeRemoteId ?? null),
      provider,
      instanceName,
      sshHost,
      engineRoot,
      pythonCommand,
      copyRoot: remoteCopyRoot,
    },
    local: {
      engineRoot: localEngineRoot,
      pyprojectPath: getBundledFrontierEnginePyprojectPath(),
      sourcePackagePath: getBundledFrontierSourcePackagePath(),
      experimentsRoot: getBundledFrontierExperimentsRoot(),
      experimentDirs: scope.mode === 'all'
        ? scope.experimentDirs
        : (scope.experimentDir ? [scope.experimentDir] : []),
      experimentReadmePath: scope.experimentsReadmePath ?? null,
    },
    doctor: sshHost
      ? probeRemoteFrontierRuntime({
          attached: Boolean(remoteConfig.attached),
          provider,
          instanceName,
          sshHost,
          engineRoot,
          pythonCommand,
        }, workspaceRoot)
      : null,
  };
}

export function applyFrontierRemoteSync(workspaceRoot = getWorkspaceRoot(), options = {}) {
  const snapshot = getFrontierRemoteSyncSnapshot(workspaceRoot, {
    ...options,
    apply: true,
  });

  if (!snapshot.remote.sshHost) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: 'Remote frontier sync requires an attached SSH host or --ssh-host.',
      snapshot,
      stepResults: [],
      remoteLiveFrontier: null,
    };
  }

  if (!snapshot.remote.copyRoot) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: 'Remote frontier sync could not resolve a remote copy target path for the remote engine root.',
      snapshot,
      stepResults: [],
      remoteLiveFrontier: null,
    };
  }

  if (snapshot.scope?.error) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: snapshot.scope.error,
      snapshot,
      stepResults: [],
      remoteVerification: null,
      remoteLiveFrontier: null,
    };
  }

  const remoteEngineRoot = snapshot.remote.engineRoot;
  const remoteTarget = {
    provider: snapshot.remote.provider,
    instanceName: snapshot.remote.instanceName,
    sshHost: snapshot.remote.sshHost,
  };
  const remoteHost = snapshot.remote.sshHost;
  const remoteCliPath = joinRemotePath(snapshot.remote, remoteEngineRoot, 'src', 'frontier_engine', 'cli.py');
  const remoteDirSet = new Set([
    remoteEngineRoot,
    joinRemotePath(snapshot.remote, remoteEngineRoot, 'src'),
    joinRemotePath(snapshot.remote, remoteEngineRoot, 'experiments'),
  ]);
  if (snapshot.scope.mode === 'lane' && snapshot.scope.experimentDirName) {
    remoteDirSet.add(joinRemotePath(snapshot.remote, remoteEngineRoot, 'experiments', snapshot.scope.experimentDirName));
  }
  for (const entry of snapshot.scope.syncEntries ?? []) {
    const remoteRelativePath = String(entry.remoteRelativePath ?? '').trim();
    if (!remoteRelativePath) {
      continue;
    }
    const destination = joinRemotePath(snapshot.remote, snapshot.remote.copyRoot, remoteRelativePath);
    const ensureDirPath = entry.recursive
      ? destination
      : (
        isBrevRemote(snapshot.remote)
          ? path.posix.dirname(destination)
          : path.win32.dirname(destination)
      );
    if (ensureDirPath) {
      remoteDirSet.add(ensureDirPath);
    }
  }
  const ensureRemoteDirsCommand = isBrevRemote(snapshot.remote)
    ? `mkdir -p ${Array.from(remoteDirSet).sort().map((value) => quotePosixShellArg(value)).join(' ')}`
    : [
        'cmd /c',
        Array.from(remoteDirSet).sort().map((dir) =>
          `if not exist ${quoteRemoteWindowsPath(dir)} mkdir ${quoteRemoteWindowsPath(dir)}`
        ).join(' & '),
      ].join(' ');
  const stepResults = [];

  const steps = [
    {
      label: 'ensure_remote_frontier_dirs',
      run: () => runRemoteCommandCapture(remoteTarget, ensureRemoteDirsCommand, { cwd: workspaceRoot }),
      commandLine: isBrevRemote(snapshot.remote)
        ? formatCommand({
            executable: 'brev',
            args: ['exec', snapshot.remote.instanceName ?? remoteHost, `bash -lc ${quotePosixShellArg(ensureRemoteDirsCommand)}`],
          })
        : formatCommand({
            executable: 'ssh',
            args: [remoteHost, ensureRemoteDirsCommand],
          }),
    },
    {
      label: 'sync_frontier_pyproject',
      run: () => runRemoteCopyToCapture(
        remoteTarget,
        snapshot.local.pyprojectPath,
        joinRemotePath(snapshot.remote, snapshot.remote.copyRoot, 'pyproject.toml'),
        { cwd: workspaceRoot },
      ),
      commandLine: isBrevRemote(snapshot.remote)
        ? formatCommand({
            executable: 'brev',
            args: ['copy', snapshot.local.pyprojectPath, `${snapshot.remote.instanceName}:${joinRemotePath(snapshot.remote, snapshot.remote.copyRoot, 'pyproject.toml')}`],
          })
        : formatCommand({
            executable: 'scp',
            args: [snapshot.local.pyprojectPath, `${remoteHost}:${joinRemotePath(snapshot.remote, snapshot.remote.copyRoot, 'pyproject.toml')}`],
          }),
    },
    {
      label: 'sync_frontier_source_package',
      run: () => runRemoteCopyToCapture(
        remoteTarget,
        snapshot.local.sourcePackagePath,
        joinRemotePath(snapshot.remote, snapshot.remote.copyRoot, 'src'),
        { cwd: workspaceRoot, recursive: true },
      ),
      commandLine: isBrevRemote(snapshot.remote)
        ? formatCommand({
            executable: 'brev',
            args: ['copy', snapshot.local.sourcePackagePath, `${snapshot.remote.instanceName}:${joinRemotePath(snapshot.remote, snapshot.remote.copyRoot, 'src')}`],
          })
        : formatCommand({
            executable: 'scp',
            args: ['-r', snapshot.local.sourcePackagePath, `${remoteHost}:${joinRemotePath(snapshot.remote, snapshot.remote.copyRoot, 'src')}`],
          }),
    },
  ];

  if (snapshot.scope.mode === 'all') {
    steps.push({
      label: 'sync_frontier_experiments_root',
      run: () => runRemoteCopyToCapture(
        remoteTarget,
        snapshot.local.experimentsRoot,
        snapshot.remote.copyRoot,
        { cwd: workspaceRoot, recursive: true },
      ),
      commandLine: isBrevRemote(snapshot.remote)
        ? formatCommand({
            executable: 'brev',
            args: ['copy', snapshot.local.experimentsRoot, `${snapshot.remote.instanceName}:${snapshot.remote.copyRoot}`],
          })
        : formatCommand({
            executable: 'scp',
            args: ['-r', snapshot.local.experimentsRoot, `${remoteHost}:${snapshot.remote.copyRoot}`],
          }),
    });
  } else {
    if (Array.isArray(snapshot.scope.syncEntries) && snapshot.scope.syncEntries.length > 0) {
      for (const entry of snapshot.scope.syncEntries) {
        const remotePath = joinRemotePath(snapshot.remote, snapshot.remote.copyRoot, entry.remoteRelativePath);
        steps.push({
          label: entry.label,
          run: () => runRemoteCopyToCapture(
            remoteTarget,
            entry.localPath,
            remotePath,
            { cwd: workspaceRoot, recursive: Boolean(entry.recursive) },
          ),
          commandLine: isBrevRemote(snapshot.remote)
            ? formatCommand({
                executable: 'brev',
                args: ['copy', entry.localPath, `${snapshot.remote.instanceName}:${remotePath}`],
              })
            : formatCommand({
                executable: 'scp',
                args: [
                  ...(entry.recursive ? ['-r'] : []),
                  entry.localPath,
                  `${remoteHost}:${remotePath}`,
                ],
              }),
        });
      }
    } else if (snapshot.scope.experimentDir) {
      steps.push({
        label: `sync_frontier_lane_${snapshot.scope.laneId}`,
        run: () => runRemoteCopyToCapture(
          remoteTarget,
          snapshot.scope.experimentDir,
          joinRemotePath(snapshot.remote, snapshot.remote.copyRoot, 'experiments'),
          { cwd: workspaceRoot, recursive: true },
        ),
        commandLine: isBrevRemote(snapshot.remote)
          ? formatCommand({
              executable: 'brev',
              args: ['copy', snapshot.scope.experimentDir, `${snapshot.remote.instanceName}:${joinRemotePath(snapshot.remote, snapshot.remote.copyRoot, 'experiments')}`],
            })
          : formatCommand({
              executable: 'scp',
              args: ['-r', snapshot.scope.experimentDir, `${remoteHost}:${joinRemotePath(snapshot.remote, snapshot.remote.copyRoot, 'experiments')}`],
            }),
      });
    }
  }

  for (const step of steps) {
    const result = step.run();
    const stepResult = {
      label: step.label,
      commandLine: step.commandLine,
      ok: result.ok,
      stdout: result.stdout,
      stderr: result.stderr,
    };
    stepResults.push(stepResult);
    if (!result.ok) {
      return {
        ok: false,
        appliedAt: new Date().toISOString(),
        error: `Remote frontier sync failed on step ${step.label}.`,
        snapshot,
        stepResults,
        remoteLiveFrontier: null,
      };
    }
  }

  const verificationCommand = snapshot.scope.mode === 'lane' && snapshot.scope.laneId
    ? isBrevRemote(snapshot.remote)
      ? `${snapshot.remote.pythonCommand} ${quotePosixShellArg(remoteCliPath)} show-lane ${snapshot.scope.laneId} --json`
      : `${snapshot.remote.pythonCommand} ${quoteRemoteWindowsPath(remoteCliPath)} show-lane ${snapshot.scope.laneId} --json`
    : isBrevRemote(snapshot.remote)
      ? `${snapshot.remote.pythonCommand} ${quotePosixShellArg(remoteCliPath)} list-lanes`
      : `${snapshot.remote.pythonCommand} ${quoteRemoteWindowsPath(remoteCliPath)} list-lanes`;
  const verificationLabel = snapshot.scope.mode === 'lane' && snapshot.scope.laneId
    ? 'verify_remote_lane'
    : 'verify_remote_lanes';
  const verificationResult = runRemoteCommandCapture(remoteTarget, verificationCommand, { cwd: workspaceRoot });
  const remoteVerification = snapshot.scope.mode === 'lane' && snapshot.scope.laneId
    ? parseJsonDocument(verificationResult.stdout)
    : verificationResult.stdout;

  const liveFrontierCommand = snapshot.scope.laneId === 'p848_anchor_ladder'
    ? isBrevRemote(snapshot.remote)
      ? `${snapshot.remote.pythonCommand} ${quotePosixShellArg(remoteCliPath)} p848-live-frontier`
      : `${snapshot.remote.pythonCommand} ${quoteRemoteWindowsPath(remoteCliPath)} p848-live-frontier`
    : null;
  const liveFrontierResult = liveFrontierCommand
    ? runRemoteCommandCapture(remoteTarget, liveFrontierCommand, { cwd: workspaceRoot })
    : null;
  const remoteLiveFrontier = liveFrontierResult?.ok ? parseJsonDocument(liveFrontierResult.stdout) : null;

  if (!verificationResult.ok || (snapshot.scope.mode === 'lane' && snapshot.scope.laneId && !remoteVerification)) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: verificationResult.stderr ?? 'Remote frontier sync completed, but the remote verification probe did not return the expected result.',
      snapshot,
      stepResults: [
        ...stepResults,
        {
          label: verificationLabel,
          commandLine: isBrevRemote(snapshot.remote)
            ? formatCommand({ executable: 'brev', args: ['exec', snapshot.remote.instanceName ?? remoteHost, `bash -lc ${quotePosixShellArg(verificationCommand)}`] })
            : formatCommand({ executable: 'ssh', args: [remoteHost, verificationCommand] }),
          ok: verificationResult.ok,
          stdout: verificationResult.stdout,
          stderr: verificationResult.stderr,
        },
      ],
      remoteVerification,
      remoteLiveFrontier,
    };
  }

  if (liveFrontierCommand && (!liveFrontierResult?.ok || !remoteLiveFrontier)) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: liveFrontierResult?.stderr ?? 'Remote frontier sync completed, but the p848 live-frontier probe did not return JSON.',
      snapshot,
      stepResults: [
        ...stepResults,
        {
          label: verificationLabel,
          commandLine: isBrevRemote(snapshot.remote)
            ? formatCommand({ executable: 'brev', args: ['exec', snapshot.remote.instanceName ?? remoteHost, `bash -lc ${quotePosixShellArg(verificationCommand)}`] })
            : formatCommand({ executable: 'ssh', args: [remoteHost, verificationCommand] }),
          ok: verificationResult.ok,
          stdout: verificationResult.stdout,
          stderr: verificationResult.stderr,
        },
        {
          label: 'verify_remote_live_frontier',
          commandLine: isBrevRemote(snapshot.remote)
            ? formatCommand({ executable: 'brev', args: ['exec', snapshot.remote.instanceName ?? remoteHost, `bash -lc ${quotePosixShellArg(liveFrontierCommand)}`] })
            : formatCommand({ executable: 'ssh', args: [remoteHost, liveFrontierCommand] }),
          ok: Boolean(liveFrontierResult?.ok),
          stdout: liveFrontierResult?.stdout ?? null,
          stderr: liveFrontierResult?.stderr ?? null,
        },
      ],
      remoteVerification,
      remoteLiveFrontier,
    };
  }

  const appliedAt = new Date().toISOString();
  const config = loadConfig(workspaceRoot);
  const postSyncDoctor = probeRemoteFrontierRuntime({
    attached: true,
    provider: snapshot.remote.provider,
    instanceName: snapshot.remote.instanceName,
    sshHost: snapshot.remote.sshHost,
    engineRoot: snapshot.remote.engineRoot,
    pythonCommand: snapshot.remote.pythonCommand,
  }, workspaceRoot);
  const persistedRemote = persistFrontierRemote(config, {
    ...(snapshot.remote ?? {}),
    attached: true,
    frontierEngineReady: Boolean(postSyncDoctor?.frontierEngineReady),
    gpuSearchReady: Boolean(postSyncDoctor?.frontierEngineReady && postSyncDoctor?.cudaAvailable),
    lastSyncAt: appliedAt,
    lastSyncScope: snapshot.scope.mode === 'lane' ? snapshot.scope.laneId : 'all',
    lastDoctorAt: snapshot.generatedAt,
  }, {
    remoteId: snapshot.remote.remoteId ?? null,
    setActive: true,
  });
  saveConfig({
    ...config,
    frontier: {
      ...persistedRemote.frontier,
      activeMode: config.frontier?.activeMode ?? resolveFrontierActiveMode({
        ...(config.frontier ?? {}),
        remote: {
          ...(persistedRemote.frontier.remote ?? {}),
          attached: true,
          gpuSearchReady: Boolean(postSyncDoctor?.frontierEngineReady && postSyncDoctor?.cudaAvailable),
        },
      }),
      lastDoctorAt: snapshot.generatedAt,
    },
  }, workspaceRoot);

  return {
    ok: true,
    appliedAt,
    snapshot,
    stepResults: [
      ...stepResults,
      {
        label: verificationLabel,
        commandLine: isBrevRemote(snapshot.remote)
          ? formatCommand({ executable: 'brev', args: ['exec', snapshot.remote.instanceName ?? remoteHost, `bash -lc ${quotePosixShellArg(verificationCommand)}`] })
          : formatCommand({ executable: 'ssh', args: [remoteHost, verificationCommand] }),
        ok: true,
        stdout: verificationResult.stdout,
        stderr: verificationResult.stderr,
      },
      ...(liveFrontierCommand
        ? [{
            label: 'verify_remote_live_frontier',
            commandLine: isBrevRemote(snapshot.remote)
              ? formatCommand({ executable: 'brev', args: ['exec', snapshot.remote.instanceName ?? remoteHost, `bash -lc ${quotePosixShellArg(liveFrontierCommand)}`] })
              : formatCommand({ executable: 'ssh', args: [remoteHost, liveFrontierCommand] }),
            ok: true,
            stdout: liveFrontierResult.stdout,
            stderr: liveFrontierResult.stderr,
          }]
        : []),
    ],
    remoteVerification,
    remoteLiveFrontier,
    postSyncDoctor,
  };
}

export function getFrontierLanesSnapshot(workspaceRoot = getWorkspaceRoot()) {
  const resolvedRunner = resolveBundledFrontierCliRunner(workspaceRoot);
  if (!resolvedRunner.runner) {
    return {
      available: false,
      generatedAt: new Date().toISOString(),
      workspaceRoot,
      error: resolvedRunner.error ?? 'Unable to run bundled frontier-engine lane discovery.',
      lanes: [],
      runnerMode: null,
    };
  }

  const cliList = runBundledFrontierCli(['list-lanes', '--json'], workspaceRoot, resolvedRunner.runner);
  if (!cliList.result.ok) {
    return {
      available: false,
      generatedAt: new Date().toISOString(),
      workspaceRoot,
      error: cliList.result.stderr ?? 'Unable to run bundled frontier-engine lane discovery.',
      lanes: [],
      runnerMode: cliList.runner?.mode ?? null,
    };
  }

  const payload = parseJsonDocument(cliList.result.stdout);
  if (Array.isArray(payload)) {
    return {
      available: true,
      generatedAt: new Date().toISOString(),
      workspaceRoot,
      runnerMode: cliList.runner?.mode ?? null,
      lanes: payload,
      errors: [],
    };
  }

  return {
    available: false,
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    runnerMode: cliList.runner?.mode ?? null,
    lanes: [],
    errors: [{
      error: 'failed to parse bundled frontier-engine lane list json',
    }],
    error: 'Unable to parse bundled frontier-engine lane metadata.',
  };
}

export function getFrontierRemotesSnapshot(workspaceRoot = getWorkspaceRoot()) {
  const config = loadConfig(workspaceRoot);
  const registry = getFrontierRemoteRegistry(config);
  return {
    generatedAt: new Date().toISOString(),
    workspaceRoot,
    activeRemoteId: registry.activeRemoteId,
    remoteCount: Object.keys(registry.remotes).length,
    remotes: buildRegisteredRemotesSummary(config),
  };
}

export function setFrontierPaidRemoteAccess(remoteId, enabled, workspaceRoot = getWorkspaceRoot()) {
  const config = loadConfig(workspaceRoot);
  const registry = getFrontierRemoteRegistry(config);
  const selected = registry.remotes[remoteId] ?? null;
  if (!selected) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: `Unknown frontier remote: ${remoteId}`,
      snapshot: getFrontierRemotesSnapshot(workspaceRoot),
    };
  }
  if (!isPaidRemote(selected)) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: `Remote ${remoteId} is not a paid rung.`,
      snapshot: getFrontierRemotesSnapshot(workspaceRoot),
    };
  }
  let nextConfig = setFrontierPaidRemoteEnabled(config, remoteId, enabled);
  if (normalizeRemoteId(nextConfig.frontier?.remote ?? {}, nextConfig.frontier?.activeRemoteId ?? null) === remoteId) {
    nextConfig = {
      ...nextConfig,
      frontier: {
        ...nextConfig.frontier,
        remote: {
          ...nextConfig.frontier.remote,
          paidEnabled: isRemotePaidEnabled(nextConfig, selected, remoteId),
        },
      },
    };
  }
  saveConfig(nextConfig, workspaceRoot);
  return {
    ok: true,
    appliedAt: new Date().toISOString(),
    enabled,
    remoteId,
    snapshot: getFrontierRemotesSnapshot(workspaceRoot),
  };
}

export function setFrontierPaidFleetAccess(fleetId, enabled, workspaceRoot = getWorkspaceRoot()) {
  const config = loadConfig(workspaceRoot);
  const fleet = getFrontierFleetSnapshot(fleetId, workspaceRoot);
  if (!fleet) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: `Unknown frontier fleet: ${fleetId}`,
      snapshot: getFrontierFleetsSnapshot(workspaceRoot),
    };
  }
  if (!isPaidFleet(fleet)) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: `Fleet ${fleetId} is not a paid rung.`,
      snapshot: getFrontierFleetsSnapshot(workspaceRoot),
    };
  }
  const nextConfig = setFrontierPaidFleetEnabled(config, fleetId, fleet.remoteIds ?? [], enabled);
  saveConfig(nextConfig, workspaceRoot);
  return {
    ok: true,
    appliedAt: new Date().toISOString(),
    enabled,
    fleetId,
    snapshot: getFrontierFleetsSnapshot(workspaceRoot),
  };
}

export function applyFrontierUseRemote(remoteId, workspaceRoot = getWorkspaceRoot()) {
  const config = loadConfig(workspaceRoot);
  const registry = getFrontierRemoteRegistry(config);
  const selected = registry.remotes[remoteId] ?? null;
  if (!selected) {
    return {
      ok: false,
      appliedAt: new Date().toISOString(),
      error: `Unknown frontier remote: ${remoteId}`,
      snapshot: getFrontierRemotesSnapshot(workspaceRoot),
    };
  }
  saveConfig({
    ...config,
    frontier: {
      ...config.frontier,
      activeRemoteId: remoteId,
      remote: {
        ...selected,
        remoteId,
        paidEnabled: isRemotePaidEnabled(config, selected, remoteId),
      },
    },
  }, workspaceRoot);
  return {
    ok: true,
    appliedAt: new Date().toISOString(),
    snapshot: getFrontierRemotesSnapshot(workspaceRoot),
  };
}

export function resolveFrontierExecutionPlan(intent, workspaceRoot = getWorkspaceRoot(), snapshotOverride = null) {
  const snapshot = snapshotOverride ?? getFrontierDoctorSnapshot(workspaceRoot);

  if (intent === 'bridgeRefresh848') {
    const researchMode = snapshot.researchModes?.bridgeRefresh;
    if (!researchMode?.available) {
      return {
        available: false,
        intent,
        mode: null,
        source: 'unavailable',
        reason: researchMode?.reason ?? 'bridge refresh is not currently runnable',
        snapshot,
      };
    }

    if (researchMode.source === 'managed_runtime') {
      const command = {
        executable: snapshot.managedPython.pythonExecutable,
        args: [snapshot.bundledEngineCliPath, 'export-p848-theorem-bridge'],
      };
      return {
        available: true,
        intent,
        mode: researchMode.mode,
        source: researchMode.source,
        reason: researchMode.reason,
        executable: command.executable,
        args: command.args,
        commandLine: formatCommand(command),
        snapshot,
      };
    }

    const command = {
      executable: snapshot.systemPython.pythonExecutable || 'python3',
      args: [snapshot.bundledEngineCliPath, 'export-p848-theorem-bridge'],
    };
    return {
      available: true,
      intent,
      mode: researchMode.mode,
      source: researchMode.source,
      reason: researchMode.reason,
      executable: command.executable,
      args: command.args,
      commandLine: formatCommand(command),
      snapshot,
    };
  }

  if (intent === 'p848FamilySearchProfile') {
    const researchMode = snapshot.researchModes?.familySearch;
    if (!researchMode?.available) {
      return {
        available: false,
        intent,
        mode: null,
        source: 'unavailable',
        reason: researchMode?.reason ?? 'family-aware search is not currently runnable',
        snapshot,
      };
    }

    const profilePath = getBundledFrontierExperimentPath('p848-anchor-ladder', 'batched_smoke_profile.json');
    const command = {
      executable: snapshot.managedPython.pythonExecutable,
      args: [snapshot.bundledEngineCliPath, 'p848-run-profile', profilePath],
    };
    return {
      available: true,
      intent,
      mode: researchMode.mode,
      source: researchMode.source,
      reason: researchMode.reason,
      profilePath,
      executable: command.executable,
      args: command.args,
      commandLine: formatCommand(command),
      snapshot,
    };
  }

  if (intent === 'p848HeavySearchProfile') {
    const researchMode = snapshot.researchModes?.heavySearch;
    if (!researchMode?.available) {
      return {
        available: false,
        intent,
        mode: null,
        source: 'unavailable',
        reason: researchMode?.reason ?? 'heavy GPU search is not currently runnable',
        snapshot,
      };
    }

    if (researchMode.source === 'ssh_remote') {
      const remoteProvider = snapshot.remote?.provider ?? 'ssh';
      const remoteHost = snapshot.remote?.sshHost;
      const remoteInstanceName = snapshot.remote?.instanceName ?? null;
      const remoteEngineRoot = snapshot.remote?.engineRoot ?? getDefaultRemoteEngineRoot(remoteProvider);
      const remotePythonCommand = snapshot.remote?.pythonCommand ?? getDefaultRemotePythonCommand(remoteProvider);
      const profileFilename = remoteProvider === 'brev'
        ? 'brev_h100_search_profile.json'
        : 'windows_rtx4090_search_profile.json';
      const remoteProfilePath = joinRemotePath(snapshot.remote, remoteEngineRoot, 'experiments', 'p848-anchor-ladder', profileFilename);
      const remoteCliPath = joinRemotePath(snapshot.remote, remoteEngineRoot, 'src', 'frontier_engine', 'cli.py');
      const remoteCommand = isBrevRemote(snapshot.remote)
        ? `${remotePythonCommand} ${quotePosixShellArg(remoteCliPath)} export-p848-profile-bundle ${quotePosixShellArg(remoteProfilePath)}`
        : `${remotePythonCommand} ${quoteRemoteWindowsPath(remoteCliPath)} export-p848-profile-bundle ${quoteRemoteWindowsPath(remoteProfilePath)}`;
      return {
        available: true,
        intent,
        mode: researchMode.mode,
        source: researchMode.source,
        reason: researchMode.reason,
        profilePath: remoteProfilePath,
        laneId: 'p848_anchor_ladder',
        executable: isBrevRemote(snapshot.remote) ? 'brev' : 'ssh',
        args: isBrevRemote(snapshot.remote)
          ? ['exec', remoteInstanceName ?? remoteHost, `bash -lc ${quotePosixShellArg(remoteCommand)}`]
          : [remoteHost, remoteCommand],
        commandLine: formatCommand(
          isBrevRemote(snapshot.remote)
            ? {
                executable: 'brev',
                args: ['exec', remoteInstanceName ?? remoteHost, `bash -lc ${quotePosixShellArg(remoteCommand)}`],
              }
            : {
                executable: 'ssh',
                args: [remoteHost, remoteCommand],
              },
        ),
        remoteHost,
        remoteProvider,
        remoteInstanceName,
        remoteCommand,
        remoteEngineRoot,
        remotePythonCommand,
        snapshot,
      };
    }

    const profilePath = getBundledFrontierExperimentPath('p848-anchor-ladder', 'windows_rtx4090_search_profile.json');
    const command = {
      executable: snapshot.managedPython.pythonExecutable,
      args: [snapshot.bundledEngineCliPath, 'export-p848-profile-bundle', profilePath],
    };
    return {
      available: true,
      intent,
      mode: researchMode.mode,
      source: researchMode.source,
      reason: researchMode.reason,
      profilePath,
      laneId: 'p848_anchor_ladder',
      executable: command.executable,
      args: command.args,
      commandLine: formatCommand(command),
      snapshot,
    };
  }

  return {
    available: false,
    intent,
    mode: null,
    source: 'unavailable',
    reason: `Unknown frontier execution intent: ${intent}`,
    snapshot,
  };
}
