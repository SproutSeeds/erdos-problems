import fs from 'node:fs';
import { getProblem } from '../atlas/catalog.js';
import { readCurrentProblem } from '../runtime/workspace.js';

const sections = [
  ['problem.yaml', 'problemYamlPath'],
  ['STATEMENT.md', 'statementPath'],
  ['REFERENCES.md', 'referencesPath'],
  ['EVIDENCE.md', 'evidencePath'],
  ['FORMALIZATION.md', 'formalizationPath'],
];

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

  console.log(`${problem.displayName} dossier`);
  console.log(`Directory: ${problem.problemDir}`);
  console.log('Sections:');
  for (const [label, key] of sections) {
    const filePath = problem[key];
    const exists = fs.existsSync(filePath);
    console.log(`- ${label}: ${exists ? 'present' : 'missing'}`);
  }
  console.log('');
  console.log('Canonical metadata:');
  console.log(`- cluster: ${problem.cluster}`);
  console.log(`- repo status: ${problem.repoStatus}`);
  console.log(`- harness depth: ${problem.harnessDepth}`);
  console.log(`- external source number: ${problem.externalSource?.number ?? problem.upstream?.number ?? '(unset)'}`);
  if (fs.existsSync(problem.statementPath)) {
    console.log('');
    console.log('Statement preview:');
    console.log(fs.readFileSync(problem.statementPath, 'utf8').trim());
  }
  return 0;
}
