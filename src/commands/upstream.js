import { getProblem } from '../atlas/catalog.js';
import { getBundledUpstreamDir, getWorkspaceUpstreamDir } from '../runtime/paths.js';
import { fetchProblemSiteSnapshot } from '../upstream/site.js';
import { buildUpstreamDiff, loadActiveUpstreamSnapshot, syncUpstream, writeDiffArtifacts } from '../upstream/sync.js';

function parseDriftArgs(args) {
  const parsed = {
    problemId: null,
    includeSite: false,
    asJson: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--include-site') {
      parsed.includeSite = true;
      continue;
    }
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (!parsed.problemId) {
      parsed.problemId = token;
      continue;
    }
    return { error: `Unknown import drift option: ${token}` };
  }

  return parsed;
}

export async function runUpstreamCommand(args) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos import show');
    console.log('  erdos import sync [--write-package-snapshot]');
    console.log('  erdos import diff [--write-package-report]');
    console.log('  erdos import drift [<id>] [--include-site] [--json]');
    return 0;
  }

  if (subcommand === 'show') {
    const snapshot = loadActiveUpstreamSnapshot();
    if (!snapshot) {
      console.log('No import snapshot available yet. Run `erdos import sync`.');
      return 0;
    }
    const manifest = snapshot.manifest;
    const externalRepo = manifest.external_repo ?? manifest.upstream_repo;
    const importedCommit = manifest.imported_commit ?? manifest.upstream_commit;
    console.log(`Snapshot kind: ${snapshot.kind}`);
    console.log(`Active source: ${snapshot.kind === 'workspace' ? 'workspace import override' : 'bundled import snapshot'}`);
    console.log(`External import repo: ${externalRepo}`);
    console.log(`Imported commit: ${importedCommit ?? '(unknown)'}`);
    console.log(`Fetched at: ${manifest.fetched_at}`);
    console.log(`Entries: ${manifest.entry_count}`);
    console.log(`Active manifest: ${snapshot.manifestPath}`);
    console.log(`Active index: ${snapshot.indexPath}`);
    console.log(`Active yaml: ${snapshot.yamlPath}`);
    console.log(`Bundled snapshot dir: ${getBundledUpstreamDir()}`);
    console.log(`Workspace snapshot dir: ${getWorkspaceUpstreamDir()}`);
    console.log('Refresh workspace import snapshot: erdos import sync');
    console.log('Refresh bundled import snapshot (maintainers): erdos import sync --write-package-snapshot');
    return 0;
  }

  if (subcommand === 'sync') {
    const writePackageSnapshot = rest.includes('--write-package-snapshot');
    const result = await syncUpstream({ writePackageSnapshot });
    console.log(`Fetched import commit: ${result.snapshot.manifest.imported_commit ?? '(unknown)'}`);
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
    console.log(`External atlas total problems: ${diff.upstreamProblemCount}`);
    console.log(`External-only count: ${diff.upstreamOnlyCount}`);
    console.log(`Workspace diff report: ${diffArtifacts.workspaceDiffPath}`);
    if (diffArtifacts.repoDiffPath) {
      console.log(`Repo diff report: ${diffArtifacts.repoDiffPath}`);
    }
    return 0;
  }

  if (subcommand === 'drift') {
    const parsed = parseDriftArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }

    const diff = buildUpstreamDiff();
    if (!parsed.problemId) {
      const statusDrifts = diff.overlaps.filter((row) => !row.statusMatches);
      const formalizationDrifts = diff.overlaps.filter((row) => !row.formalizedMatches);
      const tagDrifts = diff.overlaps.filter((row) => row.localOnlyTags.length > 0 || row.upstreamOnlyTags.length > 0);
      const payload = {
        localProblemCount: diff.localProblemCount,
        upstreamProblemCount: diff.upstreamProblemCount,
        statusDriftCount: statusDrifts.length,
        formalizationDriftCount: formalizationDrifts.length,
        tagDriftCount: tagDrifts.length,
        statusDrifts: statusDrifts.slice(0, 10),
        formalizationDrifts: formalizationDrifts.slice(0, 10),
        tagDrifts: tagDrifts.slice(0, 10),
      };

      if (parsed.asJson) {
        console.log(JSON.stringify(payload, null, 2));
        return 0;
      }

      console.log('External atlas drift dashboard');
      console.log(`Local seeded problems: ${payload.localProblemCount}`);
      console.log(`External atlas total problems: ${payload.upstreamProblemCount}`);
      console.log(`Site-status drifts: ${payload.statusDriftCount}`);
      console.log(`Formalization drifts: ${payload.formalizationDriftCount}`);
      console.log(`Tag drifts: ${payload.tagDriftCount}`);
      return 0;
    }

    const problem = getProblem(parsed.problemId);
    const snapshot = loadActiveUpstreamSnapshot();
    const upstreamRecord = snapshot?.index?.by_number?.[String(parsed.problemId)] ?? null;
    if (!problem && !upstreamRecord) {
      console.error(`Unknown problem: ${parsed.problemId}`);
      return 1;
    }

    let siteSnapshot = null;
    let siteError = null;
    if (parsed.includeSite) {
      try {
        siteSnapshot = await fetchProblemSiteSnapshot(parsed.problemId);
      } catch (error) {
        siteError = String(error.message ?? error);
      }
    }

    const payload = {
      problemId: String(parsed.problemId),
      local: problem
        ? {
            siteStatus: problem.siteStatus,
            repoStatus: problem.repoStatus,
            title: problem.title,
          }
        : null,
      external: upstreamRecord
        ? {
            siteStatus: upstreamRecord.status?.state ?? null,
            formalizedState: upstreamRecord.formalized?.state ?? null,
            tags: upstreamRecord.tags ?? [],
          }
        : null,
      site: siteSnapshot
        ? {
            siteStatus: siteSnapshot.siteStatus,
            statusLine: siteSnapshot.siteStatusRaw,
            title: siteSnapshot.title,
          }
        : null,
      siteError,
    };

    if (parsed.asJson) {
      console.log(JSON.stringify(payload, null, 2));
      return 0;
    }

    console.log(`External atlas drift for problem ${parsed.problemId}`);
    console.log(`Local site status: ${payload.local?.siteStatus ?? '(none)'}`);
    console.log(`External atlas site status: ${payload.external?.siteStatus ?? '(none)'}`);
    console.log(`Site snapshot status: ${payload.site?.siteStatus ?? '(not fetched)'}`);
    console.log(`Local repo status: ${payload.local?.repoStatus ?? '(none)'}`);
    console.log(`Imported formalized state: ${payload.external?.formalizedState ?? '(none)'}`);
    console.log(`External tags: ${payload.external?.tags?.join(', ') || '(none)'}`);
    if (siteError) {
      console.log(`Site fetch note: ${siteError}`);
    }
    return 0;
  }

  console.error(`Unknown import subcommand: ${subcommand}`);
  return 1;
}
