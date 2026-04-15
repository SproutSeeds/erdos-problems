import { execFileSync } from 'node:child_process';

import { repoRoot } from './paths.js';

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

export function isBrevRemote(remote = {}) {
  return String(remote?.provider ?? '').trim().toLowerCase() === 'brev';
}

export function getDefaultRemotePythonCommand(provider = 'ssh') {
  return provider === 'brev' ? 'python3' : 'py -3';
}

export function getDefaultRemoteEngineRoot(provider = 'ssh', homeDir = null) {
  if (provider === 'brev') {
    const normalizedHomeDir = String(homeDir ?? '').trim();
    return normalizedHomeDir
      ? `${normalizedHomeDir.replace(/[\\/]+$/, '')}/frontier-engine`
      : '~/frontier-engine';
  }
  return '%USERPROFILE%\\frontier-engine';
}

export function quoteRemoteWindowsPath(value) {
  return `"${String(value).replace(/"/g, '\\"')}"`;
}

export function quotePosixShellArg(value) {
  return `'${String(value ?? '').replaceAll("'", "'\\''")}'`;
}

function normalizeRemoteExecutionTarget(target) {
  if (typeof target === 'string') {
    return {
      provider: 'ssh',
      sshHost: target,
    };
  }
  if (!target || typeof target !== 'object') {
    return {
      provider: 'ssh',
      sshHost: null,
      instanceName: null,
    };
  }
  return {
    provider: target.provider ?? 'ssh',
    sshHost: target.sshHost ?? null,
    instanceName: target.instanceName ?? null,
    engineRoot: target.engineRoot ?? null,
    pythonCommand: target.pythonCommand ?? null,
    remoteId: target.remoteId ?? null,
  };
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildBrevWrappedShellCommand(remoteCommand) {
  const markerId = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const startMarker = `__ERDOS_REMOTE_START_${markerId}__`;
  const endMarker = `__ERDOS_REMOTE_END_${markerId}__`;
  const wrappedScript = [
    'set +e',
    `printf '%s\\n' ${quotePosixShellArg(startMarker)}`,
    String(remoteCommand ?? ''),
    'status=$?',
    `printf '\\n%s:%s\\n' ${quotePosixShellArg(endMarker)} "$status"`,
    'exit "$status"',
  ].join('\n');
  return {
    startMarker,
    endMarker,
    command: `bash -lc ${quotePosixShellArg(wrappedScript)}`,
  };
}

function parseBrevWrappedOutput(text, startMarker, endMarker) {
  const pattern = new RegExp(
    `${escapeRegex(startMarker)}\\r?\\n?([\\s\\S]*?)\\r?\\n${escapeRegex(endMarker)}:(\\d+)`,
  );
  const match = String(text ?? '').match(pattern);
  if (!match) {
    return {
      stdout: String(text ?? '').trim(),
      remoteExitCode: null,
    };
  }
  return {
    stdout: String(match[1] ?? '').trim(),
    remoteExitCode: Number(match[2] ?? 0),
  };
}

export function toRemoteCopyPath(remote, remotePath) {
  if (!remotePath) {
    return null;
  }
  const target = normalizeRemoteExecutionTarget(remote);
  if (isBrevRemote(target)) {
    return String(remotePath).replaceAll('\\', '/');
  }
  const normalized = String(remotePath).replaceAll('\\', '/');
  if (normalized.startsWith('%USERPROFILE%/')) {
    return normalized.slice('%USERPROFILE%/'.length);
  }
  if (/^[A-Za-z]:\//.test(normalized)) {
    return `/${normalized}`;
  }
  return normalized.replace(/^\.\/+/, '');
}

export function joinRemotePath(remote, ...parts) {
  const target = normalizeRemoteExecutionTarget(remote);
  const separator = isBrevRemote(target) ? '/' : '\\';
  return parts
    .filter((part) => part !== null && part !== undefined && String(part) !== '')
    .map((part, index) => {
      const text = String(part);
      if (index === 0) {
        return text.replace(new RegExp(`${separator === '\\' ? '\\\\' : '/'}+$`), '');
      }
      return text.replace(/^[\\/]+|[\\/]+$/g, '');
    })
    .join(separator);
}

export function runRemoteCommandCapture(target, remoteCommand, options = {}) {
  const remote = normalizeRemoteExecutionTarget(target);
  if (!remoteCommand) {
    return {
      ok: false,
      stdout: null,
      stderr: 'remote command missing',
    };
  }

  if (isBrevRemote(remote)) {
    const instanceName = remote.instanceName ?? remote.sshHost ?? null;
    if (!instanceName) {
      return {
        ok: false,
        stdout: null,
        stderr: 'brev instance missing',
      };
    }
    const wrapped = buildBrevWrappedShellCommand(remoteCommand);
    const result = runCommandCapture({
      executable: 'brev',
      args: ['exec', instanceName, wrapped.command],
    }, options);
    const parsed = parseBrevWrappedOutput(result.stdout, wrapped.startMarker, wrapped.endMarker);
    return {
      ok: result.ok,
      stdout: parsed.stdout,
      stderr: result.stderr,
      remoteExitCode: parsed.remoteExitCode,
    };
  }

  const sshHost = remote.sshHost ?? null;
  if (!sshHost) {
    return {
      ok: false,
      stdout: null,
      stderr: 'remote ssh host missing',
    };
  }
  return runCommandCapture({
    executable: 'ssh',
    args: [sshHost, remoteCommand],
  }, options);
}

export function runRemoteCopyToCapture(target, localPath, remotePath, options = {}) {
  const remote = normalizeRemoteExecutionTarget(target);
  if (!localPath || !remotePath) {
    return {
      ok: false,
      stdout: null,
      stderr: 'local path or remote path missing',
    };
  }

  if (isBrevRemote(remote)) {
    const instanceName = remote.instanceName ?? remote.sshHost ?? null;
    return runCommandCapture({
      executable: 'brev',
      args: ['copy', localPath, `${instanceName}:${toRemoteCopyPath(remote, remotePath)}`],
    }, options);
  }

  const args = [];
  if (options.recursive) {
    args.push('-r');
  }
  args.push(localPath, `${remote.sshHost}:${toRemoteCopyPath(remote, remotePath)}`);
  return runCommandCapture({
    executable: 'scp',
    args,
  }, options);
}

export function runRemoteCopyFromCapture(target, remotePath, localPath, options = {}) {
  const remote = normalizeRemoteExecutionTarget(target);
  if (!localPath || !remotePath) {
    return {
      ok: false,
      stdout: null,
      stderr: 'remote path or local path missing',
    };
  }

  if (isBrevRemote(remote)) {
    const instanceName = remote.instanceName ?? remote.sshHost ?? null;
    return runCommandCapture({
      executable: 'brev',
      args: ['copy', `${instanceName}:${toRemoteCopyPath(remote, remotePath)}`, localPath],
    }, options);
  }

  const args = [];
  if (options.recursive) {
    args.push('-r');
  }
  args.push(`${remote.sshHost}:${toRemoteCopyPath(remote, remotePath)}`, localPath);
  return runCommandCapture({
    executable: 'scp',
    args,
  }, options);
}

export function probeBrevRemoteHome(instanceName, options = {}) {
  if (!instanceName) {
    return null;
  }
  const result = runRemoteCommandCapture({
    provider: 'brev',
    instanceName,
  }, 'printf \'%s\\n\' "$HOME"', options);
  if (!result.ok || !result.stdout) {
    return null;
  }
  const homeDir = String(result.stdout).split(/\r?\n/).map((line) => line.trim()).find(Boolean) ?? null;
  return homeDir || null;
}
