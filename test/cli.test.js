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

test('problem list filters by site status', () => {
  const output = runCli(['problem', 'list', '--site-status', 'solved']);
  assert.match(output, /542/);
  assert.match(output, /1008/);
  assert.doesNotMatch(output, /857/);
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

test('problem artifacts shows canonical file inventory', () => {
  const output = runCli(['problem', 'artifacts', '857']);
  assert.match(output, /canonical artifacts/);
  assert.match(output, /problem.yaml: present/);
  assert.match(output, /STATEMENT.md: present/);
  assert.match(output, /Upstream record available: yes/);
});

test('problem artifacts can emit json for agents', () => {
  const output = runCli(['problem', 'artifacts', '857', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '857');
  assert.equal(payload.upstreamRecordIncluded, true);
  assert.equal(payload.canonicalArtifacts.length >= 5, true);
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

test('workspace show reports active problem and pull dir', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['workspace', 'show'], { cwd: workspace });
  assert.match(output, /Initialized: yes/);
  assert.match(output, /Active problem: 857/);
  assert.match(output, /Workspace pull dir:/);
});

test('dossier show uses active problem when omitted', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['dossier', 'show'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 dossier/);
  assert.match(output, /STATEMENT.md: present/);
});

test('upstream show reports bundled snapshot', () => {
  const output = runCli(['upstream', 'show']);
  assert.match(output, /Snapshot kind: bundled/);
  assert.match(output, /Upstream repo: https:\/\/github.com\/teorth\/erdosproblems/);
  assert.match(output, /Entries: 1183/);
});

test('upstream diff writes workspace report from bundled snapshot', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-upstream-'));
  const output = runCli(['upstream', 'diff'], { cwd: workspace });
  assert.match(output, /Local seeded problems: 8/);
  assert.match(output, /Upstream total problems: 1183/);
  const diffPath = path.join(workspace, '.erdos', 'reports', 'UPSTREAM_DIFF.md');
  assert.equal(fs.existsSync(diffPath), true);
  assert.match(fs.readFileSync(diffPath, 'utf8'), /# Upstream Diff/);
});

test('scaffold problem copies canonical files and upstream record', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-scaffold-'));
  const output = runCli(['scaffold', 'problem', '857'], { cwd: workspace });
  assert.match(output, /Scaffold created:/);
  assert.match(output, /Upstream record included: yes/);
  const scaffoldDir = path.join(workspace, '.erdos', 'scaffolds', '857');
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'STATEMENT.md')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'PACK_CONTEXT.md')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'UPSTREAM_RECORD.json')), true);
  const artifactIndex = JSON.parse(fs.readFileSync(path.join(scaffoldDir, 'ARTIFACT_INDEX.json'), 'utf8'));
  assert.equal(artifactIndex.includedUpstreamRecord, true);
});

test('bootstrap problem selects active problem and creates scaffold in one step', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-bootstrap-'));
  const output = runCli(['bootstrap', 'problem', '857'], { cwd: workspace });
  assert.match(output, /Bootstrapped problem 857/);
  assert.match(output, /Active problem: 857/);
  const statePath = path.join(workspace, '.erdos', 'state.json');
  const currentProblemPath = path.join(workspace, '.erdos', 'current-problem.json');
  const scaffoldDir = path.join(workspace, '.erdos', 'scaffolds', '857');
  assert.equal(JSON.parse(fs.readFileSync(statePath, 'utf8')).activeProblem, '857');
  assert.equal(JSON.parse(fs.readFileSync(currentProblemPath, 'utf8')).problemId, '857');
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'PROBLEM.json')), true);
});

test('pull problem copies seeded dossier into pull bundle', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-pull-seeded-'));
  const output = runCli(['pull', 'problem', '857'], { cwd: workspace });
  assert.match(output, /Pull bundle created:/);
  assert.match(output, /Local canonical dossier included: yes/);
  assert.match(output, /Upstream record included: yes/);
  const pullDir = path.join(workspace, '.erdos', 'pulls', '857');
  assert.equal(fs.existsSync(path.join(pullDir, 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'UPSTREAM_RECORD.json')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'PULL_STATUS.json')), true);
});

test('pull problem creates upstream-only bundle for unseeded problem', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-pull-unseeded-'));
  const output = runCli(['pull', 'problem', '1'], { cwd: workspace });
  assert.match(output, /Pull bundle created:/);
  assert.match(output, /Local canonical dossier included: no/);
  assert.match(output, /Upstream record included: yes/);
  const pullDir = path.join(workspace, '.erdos', 'pulls', '1');
  assert.equal(fs.existsSync(path.join(pullDir, 'UPSTREAM_RECORD.json')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'PROBLEM.json')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'problem.yaml')), false);
});
