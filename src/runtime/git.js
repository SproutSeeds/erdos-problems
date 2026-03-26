import { execFileSync } from 'node:child_process';

function runGit(workspaceRoot, args) {
  try {
    return execFileSync('git', ['-C', workspaceRoot, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

export function gitSummary(workspaceRoot) {
  if (!workspaceRoot) {
    return {
      exists: false,
      isGitRepo: false,
      clean: null,
      branch: null,
      detail: 'missing',
    };
  }

  const inside = runGit(workspaceRoot, ['rev-parse', '--is-inside-work-tree']);
  if (inside !== 'true') {
    return {
      exists: true,
      isGitRepo: false,
      clean: null,
      branch: null,
      detail: 'not a git repository',
    };
  }

  const branch = runGit(workspaceRoot, ['rev-parse', '--abbrev-ref', 'HEAD']);
  const porcelain = runGit(workspaceRoot, ['status', '--porcelain']) ?? '';
  const clean = porcelain.trim().length === 0;
  const changedPaths = porcelain
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    exists: true,
    isGitRepo: true,
    clean,
    branch,
    detail: clean ? 'clean' : `${changedPaths.length} changed path(s)`,
    changedPaths,
  };
}
