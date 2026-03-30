import { getProblem } from '../atlas/catalog.js';
import { getPaperBundleOverview, initPaperBundle } from '../runtime/paper.js';
import { getWorkspaceRoot } from '../runtime/paths.js';
import { readCurrentProblem } from '../runtime/workspace.js';

function parsePaperArgs(args) {
  const parsed = {
    problemId: null,
    destination: null,
    asJson: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--dest') {
      parsed.destination = args[index + 1];
      if (!parsed.destination) {
        return { error: 'Missing destination path after --dest.' };
      }
      index += 1;
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
    return { error: `Unknown paper option: ${token}` };
  }

  return parsed;
}

function printPaperOverview(overview) {
  console.log(`Paper bundle for Erdos Problem #${overview.problemId}`);
  console.log(`Title: ${overview.title}`);
  console.log(`Paper mode: ${overview.paperMode}`);
  console.log(`Bundle dir: ${overview.bundleDir}`);
  if (overview.bundlePublicPath) {
    console.log(`Repo bundle path: ${overview.bundlePublicPath}`);
  }
  console.log(`Created at: ${overview.createdAt}`);
  console.log(`Last initialized: ${overview.lastInitializedAt}`);
  console.log(`Public evidence: canonical=${overview.publicEvidenceSummary.canonicalArtifacts}, pack=${overview.publicEvidenceSummary.packProblemArtifacts}, compute=${overview.publicEvidenceSummary.computePackets}`);
  console.log('Core files:');
  console.log(`- manifest: ${overview.paths.manifest}`);
  console.log(`- writer brief: ${overview.paths.writerBrief}`);
  console.log(`- evidence index: ${overview.paths.evidenceIndex}`);
  console.log(`- section status: ${overview.paths.sectionStatus}`);
  console.log(`- privacy review: ${overview.paths.privacyReview}`);
  console.log(`- citation ledger: ${overview.paths.citationLedger}`);
  console.log('Sections:');
  for (const section of overview.sections) {
    console.log(`- ${section.fileName}: ${section.exists ? 'present' : 'missing'} (${section.title})`);
  }
}

export function runPaperCommand(args) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos paper init [<id>] [--dest <path>] [--json]');
    console.log('  erdos paper show [<id>] [--dest <path>] [--json]');
    return 0;
  }

  const workspaceRoot = getWorkspaceRoot();

  if (subcommand === 'init') {
    const parsed = parsePaperArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }

    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }

    const problem = getProblem(problemId, workspaceRoot);
    if (!problem) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }

    const result = initPaperBundle(problem.problemId, {
      destination: parsed.destination,
      workspaceRoot,
    });

    if (parsed.asJson) {
      console.log(JSON.stringify(result, null, 2));
      return 0;
    }

    console.log(`Paper bundle ${result.mode}: ${result.bundleDir}`);
    console.log(`Problem: ${problem.displayName} (${problem.title})`);
    console.log(`Paper mode: ${result.manifest.paperMode}`);
    console.log(`Created files: ${result.createdFiles.length}`);
    console.log(`Preserved files: ${result.preservedFiles.length}`);
    console.log(`Updated indexes: ${result.updatedFiles.join(', ')}`);
    console.log('Start here: WRITER_BRIEF.md, PUBLIC_EVIDENCE_INDEX.json, SECTION_STATUS.md');
    return 0;
  }

  if (subcommand === 'show') {
    const parsed = parsePaperArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }

    const problemId = parsed.problemId ?? readCurrentProblem();
    if (!problemId) {
      console.error('Missing problem id and no active problem is selected.');
      return 1;
    }

    let overview;
    try {
      overview = getPaperBundleOverview(problemId, {
        destination: parsed.destination,
        workspaceRoot,
      });
    } catch (error) {
      console.error(error.message);
      return 1;
    }

    if (parsed.asJson) {
      console.log(JSON.stringify(overview, null, 2));
      return 0;
    }

    printPaperOverview(overview);
    return 0;
  }

  console.error(`Unknown paper subcommand: ${subcommand}`);
  return 1;
}
