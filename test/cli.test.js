import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cli = '/Volumes/Code_2TB/code/erdos-problems/src/cli/index.js';

function runCli(args, options = {}) {
  return execFileSync('node', [cli, ...args], {
    encoding: 'utf8',
    cwd: options.cwd,
  });
}

test('problem list shows seeded atlas including non-sunflower problems', () => {
  const output = runCli(['problem', 'list']);
  assert.match(output, /857/);
  assert.match(output, /20/);
  assert.match(output, /18/);
  assert.match(output, /1008/);
});

test('problem list filters by cluster', () => {
  const output = runCli(['problem', 'list', '--cluster', 'sunflower']);
  assert.match(output, /857/);
  assert.match(output, /536/);
  assert.doesNotMatch(output, /1008/);
});

test('problem list filters by repo status', () => {
  const output = runCli(['problem', 'list', '--repo-status', 'historical']);
  assert.match(output, /542/);
  assert.match(output, /1008/);
  assert.doesNotMatch(output, /857/);
});

test('problem list filters by harness depth', () => {
  const output = runCli(['problem', 'list', '--harness-depth', 'deep']);
  assert.match(output, /20/);
  assert.match(output, /857/);
  assert.doesNotMatch(output, /89/);
});

test('problem show 857 includes research state', () => {
  const output = runCli(['problem', 'show', '857']);
  assert.match(output, /Sunflower Conjecture/);
  assert.match(output, /active route: anchored_selector_linearization/);
});

test('problem show 1008 includes exact site badge', () => {
  const output = runCli(['problem', 'show', '1008']);
  assert.match(output, /Site badge: PROVED \(LEAN\)/);
});

test('cluster list shows multiple seeded clusters', () => {
  const output = runCli(['cluster', 'list']);
  assert.match(output, /sunflower: 4 problems, 2 deep-harness/);
  assert.match(output, /number-theory: 2 problems, 0 deep-harness/);
  assert.match(output, /geometry: 1 problems, 0 deep-harness/);
  assert.match(output, /graph-theory: 1 problems, 0 deep-harness/);
});

test('cluster show sunflower lists the seed cluster', () => {
  const output = runCli(['cluster', 'show', 'sunflower']);
  assert.match(output, /Problems: 20, 536, 856, 857/);
  assert.match(output, /Deep harness: 20, 857/);
});

test('problem use writes workspace state and current problem', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-'));
  const output = runCli(['problem', 'use', '857'], { cwd: workspace });
  assert.match(output, /Active problem set to 857/);
  const currentProblemPath = path.join(workspace, '.erdos', 'current-problem.json');
  const statePath = path.join(workspace, '.erdos', 'state.json');
  assert.equal(JSON.parse(fs.readFileSync(currentProblemPath, 'utf8')).problemId, '857');
  assert.equal(JSON.parse(fs.readFileSync(statePath, 'utf8')).activeProblem, '857');
});

test('problem show without id uses active workspace problem', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-'));
  runCli(['problem', 'use', '20'], { cwd: workspace });
  const output = runCli(['problem', 'show'], { cwd: workspace });
  assert.match(output, /Erdos Problem #20/);
});

test('workspace show reports active problem', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['workspace', 'show'], { cwd: workspace });
  assert.match(output, /Initialized: yes/);
  assert.match(output, /Active problem: 857/);
});

test('dossier show uses active problem when omitted', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['dossier', 'show'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 dossier/);
  assert.match(output, /STATEMENT.md: present/);
});
