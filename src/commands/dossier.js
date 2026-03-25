import fs from 'node:fs';
import path from 'node:path';
import { getProblem } from '../atlas/catalog.js';
import { getProblemDir } from '../runtime/paths.js';
import { readCurrentProblem } from '../runtime/workspace.js';

const sections = ['STATEMENT.md', 'REFERENCES.md', 'EVIDENCE.md', 'FORMALIZATION.md'];

export function runDossierCommand(args) {
  const [subcommand, value] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos dossier show <id>');
    return 0;
  }

  if (subcommand !== 'show') {
    console.error(`Unknown dossier subcommand: ${subcommand}`);
    return 1;
  }

  const problemId = value ?? readCurrentProblem();
  if (!problemId) {
    console.error('Missing problem id and no active problem is selected.');
    return 1;
  }

  const problem = getProblem(problemId);
  if (!problem) {
    console.error(`Unknown problem: ${problemId}`);
    return 1;
  }

  const problemDir = getProblemDir(problem.problemId);
  console.log(`${problem.displayName} dossier`);
  console.log(`Directory: ${problemDir}`);
  console.log('Sections:');
  for (const section of sections) {
    const filePath = path.join(problemDir, section);
    const exists = fs.existsSync(filePath);
    console.log(`- ${section}: ${exists ? 'present' : 'missing'}`);
  }
  const statementPath = path.join(problemDir, 'STATEMENT.md');
  if (fs.existsSync(statementPath)) {
    console.log('');
    console.log('Statement preview:');
    console.log(fs.readFileSync(statementPath, 'utf8').trim());
  }
  return 0;
}
