import { buildUpstreamDiff, loadActiveUpstreamSnapshot, syncUpstream, writeDiffArtifacts } from '../upstream/sync.js';

export async function runUpstreamCommand(args) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos upstream show');
    console.log('  erdos upstream sync [--write-package-snapshot]');
    console.log('  erdos upstream diff [--write-package-report]');
    return 0;
  }

  if (subcommand === 'show') {
    const snapshot = loadActiveUpstreamSnapshot();
    if (!snapshot) {
      console.log('No upstream snapshot available yet. Run `erdos upstream sync`.');
      return 0;
    }
    console.log(`Snapshot kind: ${snapshot.kind}`);
    console.log(`Upstream repo: ${snapshot.manifest.upstream_repo}`);
    console.log(`Upstream commit: ${snapshot.manifest.upstream_commit ?? '(unknown)'}`);
    console.log(`Fetched at: ${snapshot.manifest.fetched_at}`);
    console.log(`Entries: ${snapshot.manifest.entry_count}`);
    return 0;
  }

  if (subcommand === 'sync') {
    const writePackageSnapshot = rest.includes('--write-package-snapshot');
    const result = await syncUpstream({ writePackageSnapshot });
    console.log(`Fetched upstream commit: ${result.snapshot.manifest.upstream_commit ?? '(unknown)'}`);
    console.log(`Workspace snapshot: ${result.workspacePaths.manifestPath}`);
    if (result.bundledPaths) {
      console.log(`Bundled snapshot: ${result.bundledPaths.manifestPath}`);
    }
    const diffArtifacts = writeDiffArtifacts({ writePackageReport: writePackageSnapshot });
    console.log(`Workspace diff report: ${diffArtifacts.workspaceDiffPath}`);
    if (diffArtifacts.repoDiffPath) {
      console.log(`Repo diff report: ${diffArtifacts.repoDiffPath}`);
    }
    return 0;
  }

  if (subcommand === 'diff') {
    const writePackageReport = rest.includes('--write-package-report');
    const diffArtifacts = writeDiffArtifacts({ writePackageReport });
    const diff = buildUpstreamDiff();
    console.log(`Local seeded problems: ${diff.localProblemCount}`);
    console.log(`Upstream total problems: ${diff.upstreamProblemCount}`);
    console.log(`Upstream-only count: ${diff.upstreamOnlyCount}`);
    console.log(`Workspace diff report: ${diffArtifacts.workspaceDiffPath}`);
    if (diffArtifacts.repoDiffPath) {
      console.log(`Repo diff report: ${diffArtifacts.repoDiffPath}`);
    }
    return 0;
  }

  console.error(`Unknown upstream subcommand: ${subcommand}`);
  return 1;
}
