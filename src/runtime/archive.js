import path from 'node:path';
import { getProblem } from '../atlas/catalog.js';
import { ensureDir, writeJson, writeText } from './files.js';
import { getWorkspaceArchiveDir, getWorkspaceRoot } from './paths.js';

function isSolved(problem) {
  return String(problem?.siteStatus ?? '').toLowerCase() === 'solved'
    || Boolean(problem?.researchState?.problem_solved);
}

export function getArchiveView(problemId) {
  const problem = getProblem(problemId);
  if (!problem) {
    return null;
  }

  return {
    problemId: problem.problemId,
    displayName: problem.displayName,
    title: problem.title,
    siteStatus: problem.siteStatus,
    repoStatus: problem.repoStatus,
    solved: isSolved(problem),
    archiveMode: isSolved(problem) ? 'method_exemplar' : 'inactive',
    nextMove: isSolved(problem)
      ? 'Extract reusable methods, references, and formalization hooks without treating this as an open-problem workspace.'
      : 'This problem is not currently in solved archival mode.',
  };
}

export function scaffoldArchive(problemId, workspaceRoot = getWorkspaceRoot()) {
  const problem = getProblem(problemId);
  if (!problem) {
    throw new Error(`Unknown problem: ${problemId}`);
  }
  if (!isSolved(problem)) {
    throw new Error(`Problem ${problemId} is not solved, so archival mode is not active.`);
  }

  const archiveDir = getWorkspaceArchiveDir(problemId, workspaceRoot);
  ensureDir(archiveDir);

  const payload = {
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    displayName: problem.displayName,
    title: problem.title,
    siteStatus: problem.siteStatus,
    repoStatus: problem.repoStatus,
    archiveMode: 'method_exemplar',
  };

  writeJson(path.join(archiveDir, 'ARCHIVE.json'), payload);
  writeText(
    path.join(archiveDir, 'ARCHIVE_SUMMARY.md'),
    [
      `# ${problem.displayName} Archive Summary`,
      '',
      `- Title: ${problem.title}`,
      `- Site status: ${problem.siteStatus}`,
      `- Repo status: ${problem.repoStatus}`,
      '',
      'Archive posture:',
      '- treat this solved problem as a method exemplar',
      '- extract reusable arguments, formalization hooks, and references',
      '- do not run the open-problem frontier loop here',
      '',
    ].join('\n'),
  );
  writeText(
    path.join(archiveDir, 'METHOD_PACKET.md'),
    [
      `# ${problem.displayName} Method Packet`,
      '',
      'Prompts:',
      '- What method or reduction pattern is reusable?',
      '- What verification surface is already clean here?',
      '- What should be ported into open-problem packs as technique, not as status inflation?',
      '',
    ].join('\n'),
  );

  return {
    archiveDir,
    payload,
  };
}
