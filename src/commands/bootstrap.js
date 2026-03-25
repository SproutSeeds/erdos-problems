import path from 'node:path';
import { getProblem } from '../atlas/catalog.js';
import { scaffoldProblem } from '../runtime/problem-artifacts.js';
import { getWorkspaceProblemScaffoldDir } from '../runtime/paths.js';
import { setCurrentProblem } from '../runtime/workspace.js';
import { syncUpstream } from '../upstream/sync.js';

function parseBootstrapArgs(args) {
  const [kind, value, ...rest] = args;
  if (kind !== 'problem') {
    return { error: 'Only `erdos bootstrap problem <id>` is supported right now.' };
  }

  let destination = null;
  let syncUpstreamSnapshot = false;

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
    if (token === '--sync-upstream') {
      syncUpstreamSnapshot = true;
      continue;
    }
    return { error: `Unknown bootstrap option: ${token}` };
  }

  return {
    problemId: value,
    destination,
    syncUpstreamSnapshot,
  };
}

export async function runBootstrapCommand(args) {
  if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
    console.log('Usage:');
    console.log('  erdos bootstrap problem <id> [--dest <path>] [--sync-upstream]');
    return 0;
  }

  const parsed = parseBootstrapArgs(args);
  if (parsed.error) {
    console.error(parsed.error);
    return 1;
  }
  if (!parsed.problemId) {
    console.error('Missing problem id.');
    return 1;
  }

  const problem = getProblem(parsed.problemId);
  if (!problem) {
    console.error(`Unknown problem: ${parsed.problemId}`);
    return 1;
  }

  if (parsed.syncUpstreamSnapshot) {
    const syncResult = await syncUpstream();
    console.log(`Workspace upstream snapshot refreshed: ${syncResult.workspacePaths.manifestPath}`);
  }

  setCurrentProblem(problem.problemId);
  const destination = parsed.destination
    ? path.resolve(parsed.destination)
    : getWorkspaceProblemScaffoldDir(problem.problemId);
  const result = scaffoldProblem(problem, destination);

  console.log(`Bootstrapped problem ${problem.problemId} (${problem.title})`);
  console.log(`Active problem: ${problem.problemId}`);
  console.log(`Scaffold dir: ${result.destination}`);
  console.log(`Artifacts copied: ${result.copiedArtifacts.length}`);
  console.log(`Upstream record included: ${result.inventory.upstreamRecordIncluded ? 'yes' : 'no'}`);
  return 0;
}
