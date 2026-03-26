import { getProblem } from '../atlas/catalog.js';
import { buildSunflowerStatusSnapshot } from '../runtime/sunflower.js';
import { getWorkspaceSummary } from '../runtime/workspace.js';

export function runWorkspaceCommand(args) {
  const [subcommand] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos workspace show');
    return 0;
  }

  if (subcommand !== 'show') {
    console.error(`Unknown workspace subcommand: ${subcommand}`);
    return 1;
  }

  const summary = getWorkspaceSummary();
  console.log(`Workspace root: ${summary.workspaceRoot}`);
  console.log(`State dir: ${summary.stateDir}`);
  console.log(`Initialized: ${summary.hasState ? 'yes' : 'no'}`);
  console.log(`Active problem: ${summary.activeProblem ?? '(none)'}`);
  console.log(`Workspace upstream dir: ${summary.upstreamDir}`);
  console.log(`Workspace scaffold dir: ${summary.scaffoldDir}`);
  console.log(`Workspace pull dir: ${summary.pullDir}`);
  console.log(`Workspace artifact dir: ${summary.artifactDir}`);
  console.log(`Workspace literature dir: ${summary.literatureDir}`);
  console.log(`Updated at: ${summary.updatedAt ?? '(none)'}`);
  if (summary.activeProblem) {
    const problem = getProblem(summary.activeProblem);
    if (problem?.cluster === 'sunflower') {
      const sunflower = buildSunflowerStatusSnapshot(problem);
      console.log(`Sunflower family role: ${sunflower.familyRole ?? '(none)'}`);
      console.log(`Sunflower harness profile: ${sunflower.harnessProfile ?? '(none)'}`);
      console.log(`Sunflower route: ${sunflower.activeRoute ?? '(none)'}`);
      console.log(`Sunflower compute: ${sunflower.computeLanePresent ? 'yes' : 'no'}`);
      if (sunflower.activePacket) {
        console.log(`Sunflower compute lane: ${sunflower.activePacket.laneId} [${sunflower.activePacket.status}]`);
      }
      console.log(`Sunflower compute next: ${sunflower.computeNextAction}`);
    }
  }
  return 0;
}
