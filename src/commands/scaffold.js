import path from 'node:path';
import { getProblem } from '../atlas/catalog.js';
import { scaffoldProblem } from '../runtime/problem-artifacts.js';
import { getWorkspaceProblemScaffoldDir } from '../runtime/paths.js';
import { readCurrentProblem } from '../runtime/workspace.js';

export function parseScaffoldArgs(args) {
  const [kind, value, ...rest] = args;
  if (kind !== 'problem') {
    return { error: 'Only `erdos scaffold problem <id>` is supported right now.' };
  }
  let destination = null;
  for (let index = 0; index < rest.length; index += 1) {
    const token = rest[index];
    if (token === '--dest') {
      destination = rest[index + 1];
      if (!destination) {
        return { error: 'Missing destination path after --dest.' };
      }
      index += 1;
      continue;
    }
    return { error: `Unknown scaffold option: ${token}` };
  }
  return { problemId: value ?? readCurrentProblem(), destination };
}

export function runScaffoldCommand(args) {
  if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
    console.log('Usage:');
    console.log('  erdos scaffold problem <id> [--dest <path>]');
    return 0;
  }

  const parsed = parseScaffoldArgs(args);
  if (parsed.error) {
    console.error(parsed.error);
    return 1;
  }
  if (!parsed.problemId) {
    console.error('Missing problem id and no active problem is selected.');
    return 1;
  }

  const problem = getProblem(parsed.problemId);
  if (!problem) {
    console.error(`Unknown problem: ${parsed.problemId}`);
    return 1;
  }

  const destination = parsed.destination
    ? path.resolve(parsed.destination)
    : getWorkspaceProblemScaffoldDir(problem.problemId);

  const result = scaffoldProblem(problem, destination);
  console.log(`Scaffold created: ${result.destination}`);
  console.log(`Artifacts copied: ${result.copiedArtifacts.length}`);
  console.log(`Upstream record included: ${result.inventory.upstreamRecordIncluded ? 'yes' : 'no'}`);
  return 0;
}
