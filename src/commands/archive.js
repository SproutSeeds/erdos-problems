import { getArchiveView, scaffoldArchive } from '../runtime/archive.js';

export function runArchiveCommand(args) {
  const [subcommand, problemId, ...rest] = args;
  const asJson = rest.includes('--json');

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos archive show <id>');
    console.log('  erdos archive scaffold <id>');
    return 0;
  }

  if (!problemId) {
    console.error('Missing problem id.');
    return 1;
  }

  if (subcommand === 'show') {
    const archive = getArchiveView(problemId);
    if (!archive) {
      console.error(`Unknown problem: ${problemId}`);
      return 1;
    }
    if (asJson) {
      console.log(JSON.stringify(archive, null, 2));
      return 0;
    }
    console.log(`${archive.displayName} archive view`);
    console.log(`Title: ${archive.title}`);
    console.log(`Solved: ${archive.solved ? 'yes' : 'no'}`);
    console.log(`Archive mode: ${archive.archiveMode}`);
    console.log(`Next move: ${archive.nextMove}`);
    return 0;
  }

  if (subcommand === 'scaffold') {
    try {
      const result = scaffoldArchive(problemId);
      if (asJson) {
        console.log(JSON.stringify(result, null, 2));
        return 0;
      }
      console.log(`Archive scaffold created: ${result.archiveDir}`);
      console.log(`Archive mode: ${result.payload.archiveMode}`);
      return 0;
    } catch (error) {
      console.error(String(error.message ?? error));
      return 1;
    }
  }

  console.error(`Unknown archive subcommand: ${subcommand}`);
  return 1;
}
