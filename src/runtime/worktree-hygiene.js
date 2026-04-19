import { execFileSync } from 'node:child_process';
import path from 'node:path';

function runGitStatus(workspaceRoot) {
  try {
    return execFileSync('git', ['status', '--porcelain=v1'], {
      cwd: workspaceRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    return null;
  }
}

function parseStatusLine(line) {
  const status = line.slice(0, 2);
  const rawPath = line.slice(3).trim();
  const renameParts = rawPath.split(' -> ');
  const filePath = renameParts[renameParts.length - 1] ?? rawPath;
  return {
    status,
    path: filePath,
    topLevel: filePath.split('/')[0] ?? filePath,
  };
}

function classifyPath(filePath) {
  if (filePath.startsWith('packs/')) {
    if (filePath.includes('/SPLIT_ATOM_PACKETS/')
      || /\/(TASK_LIST|PROGRESS|THEOREM_LOOP|CLAIM_LOOP|CLAIM_PASS|FORMALIZATION|FORMALIZATION_WORK|FRONTIER_LEDGER|GLOBAL_CONVERGENCE_LIFT|P4217_COMPLEMENT_STRATEGY_GUARD)\.(json|md|svg)$/u.test(filePath)
      || /\/ORP_RESEARCH_.*\.json$/u.test(filePath)
      || filePath.includes('/compute/')) {
      return 'canonical_problem_artifact';
    }
    return 'pack_artifact';
  }
  if (filePath.startsWith('src/') || filePath.startsWith('test/')) {
    return 'source_or_test_change';
  }
  if (filePath.startsWith('docs/') || [
    'README.md',
    'PROTOCOL.md',
    'AGENT_INTEGRATION.md',
    '.gitignore',
    'package.json',
    'package-lock.json',
  ].includes(filePath)) {
    return 'docs_or_project_metadata';
  }
  if (filePath.startsWith('orp/') || filePath.startsWith('.erdos/')) {
    return 'runtime_research_artifact';
  }
  if (filePath.startsWith('output/') || filePath.startsWith('tmp/') || filePath.startsWith('scratch/')) {
    return 'scratch_or_output_artifact';
  }
  return 'unclassified';
}

function summarize(entries) {
  const byStatus = {};
  const byCategory = {};
  const byTopLevel = {};
  const samplesByCategory = {};

  for (const entry of entries) {
    byStatus[entry.status] = (byStatus[entry.status] ?? 0) + 1;
    byCategory[entry.category] = (byCategory[entry.category] ?? 0) + 1;
    byTopLevel[entry.topLevel] = (byTopLevel[entry.topLevel] ?? 0) + 1;
    samplesByCategory[entry.category] ??= [];
    if (samplesByCategory[entry.category].length < 12) {
      samplesByCategory[entry.category].push(entry.path);
    }
  }

  return { byStatus, byCategory, byTopLevel, samplesByCategory };
}

export function buildWorktreeHygieneReport(workspaceRoot = process.cwd()) {
  const statusText = runGitStatus(workspaceRoot);
  if (statusText === null) {
    return {
      schema: 'erdos.worktree_hygiene/1',
      generatedAt: new Date().toISOString(),
      workspaceRoot,
      status: 'not_git_workspace',
      clean: null,
      dirtyCount: null,
      entries: [],
      summary: null,
      requiredAction: 'Run from a git workspace before delegation hygiene can be measured.',
    };
  }

  const entries = statusText
    .split(/\r?\n/u)
    .filter(Boolean)
    .map(parseStatusLine)
    .map((entry) => ({
      ...entry,
      category: classifyPath(entry.path),
    }));
  const summary = summarize(entries);
  const unclassifiedCount = summary.byCategory.unclassified ?? 0;
  const scratchCount = summary.byCategory.scratch_or_output_artifact ?? 0;
  const dirtyCount = entries.length;

  const status = dirtyCount === 0
    ? 'clean'
    : unclassifiedCount > 0
    ? 'dirty_unclassified'
    : scratchCount > 0
    ? 'dirty_with_scratch'
    : 'dirty_classified';

  return {
    schema: 'erdos.worktree_hygiene/1',
    generatedAt: new Date().toISOString(),
    workspaceRoot: path.resolve(workspaceRoot),
    status,
    clean: dirtyCount === 0,
    dirtyCount,
    unclassifiedCount,
    scratchCount,
    entries,
    summary,
    requiredAction: dirtyCount === 0
      ? 'No worktree hygiene action required.'
      : 'Classify every dirty path as canonical artifact, source/test/docs change, runtime research artifact, scratch/output artifact, or unclassified before continuing long delegation.',
    selfHealingPolicy: [
      'Never use destructive cleanup such as reset, checkout, or rm unless explicitly approved.',
      'After material work, refresh canonical generated surfaces instead of leaving stale partial artifacts.',
      'Convert useful scratch findings into canonical packets, task-list entries, progress surfaces, or docs.',
      'Move future temporary experiments to ignored workspace/runtime locations rather than repo-tracked source paths.',
      'If any path remains unclassified, pause expansion and write a hygiene/blocker note before continuing.',
    ],
    recommendedNextChecks: [
      'git status --short',
      'git diff --stat',
      'erdos workspace hygiene --json',
    ],
  };
}
