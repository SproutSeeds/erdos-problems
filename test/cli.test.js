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
  assert.match(output, /PACK_CONTEXT.md: present/);
  assert.match(output, /Pack problem artifacts:/);
  assert.match(output, /Upstream record available: yes/);
});

test('problem artifacts can emit json for agents with pack context and compute packets', () => {
  const output = runCli(['problem', 'artifacts', '857', '--json']);
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '857');
  assert.equal(payload.upstreamRecordIncluded, true);
  assert.equal(payload.canonicalArtifacts.length >= 5, true);
  assert.equal(payload.packProblemArtifacts.length >= 2, true);
  assert.equal(payload.computePackets.length >= 1, true);
  assert.equal(payload.computePackets[0].label, 'm8_exactness_cube_and_certificate_v0');
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

test('workspace show reports active problem plus artifact and literature dirs', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['workspace', 'show'], { cwd: workspace });
  assert.match(output, /Initialized: yes/);
  assert.match(output, /Active problem: 857/);
  assert.match(output, /Workspace artifact dir:/);
  assert.match(output, /Workspace literature dir:/);
  assert.match(output, /Sunflower family role: weak_sunflower_core/);
  assert.match(output, /Sunflower compute lane: m8_exactness_cube_and_certificate_v0 \[ready_for_local_scout\]/);
});

test('sunflower status shows packaged compute lane and family context for 857', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-'));
  const output = runCli(['sunflower', 'status', '857'], { cwd: workspace });
  assert.match(output, /Erdos Problem #857 sunflower harness/);
  assert.match(output, /Family role: weak_sunflower_core/);
  assert.match(output, /Active route: anchored_selector_linearization/);
  assert.match(output, /Compute lane: m8_exactness_cube_and_certificate_v0 \[ready_for_local_scout\]/);
  assert.match(output, /Registry record:/);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'registry', 'compute', 'latest__p857.json')), true);
});

test('sunflower status can emit json using the active problem', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-json-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['sunflower', 'status', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '857');
  assert.equal(payload.familyRole, 'weak_sunflower_core');
  assert.equal(payload.computeLanePresent, true);
  assert.equal(payload.activePacket.laneId, 'm8_exactness_cube_and_certificate_v0');
});

test('sunflower status records a no-compute dossier bridge cleanly for 536', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-536-'));
  const output = runCli(['sunflower', 'status', '536', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '536');
  assert.equal(payload.familyRole, 'natural_density_lcm_analogue');
  assert.equal(payload.harnessProfile, 'dossier_bridge');
  assert.equal(payload.activeRoute, 'natural_density_lcm_bridge');
  assert.equal(payload.computeLanePresent, false);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'registry', 'compute', 'latest__p536.json')), true);
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

test('scaffold problem copies canonical files, pack context, and upstream record', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-scaffold-'));
  const output = runCli(['scaffold', 'problem', '857'], { cwd: workspace });
  assert.match(output, /Scaffold created:/);
  assert.match(output, /Upstream record included: yes/);
  const scaffoldDir = path.join(workspace, '.erdos', 'scaffolds', '857');
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'STATEMENT.md')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'PACK_CONTEXT.md')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'PACK_PROBLEM', 'CONTEXT.md')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'PACK_PROBLEM', 'context.yaml')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'COMPUTE', 'm8_exactness_cube_and_certificate_v0.yaml')), true);
  assert.equal(fs.existsSync(path.join(scaffoldDir, 'UPSTREAM_RECORD.json')), true);
  const artifactIndex = JSON.parse(fs.readFileSync(path.join(scaffoldDir, 'ARTIFACT_INDEX.json'), 'utf8'));
  assert.equal(artifactIndex.includedUpstreamRecord, true);
  assert.equal(artifactIndex.packProblemArtifacts.length >= 2, true);
  assert.equal(artifactIndex.computeArtifacts.length >= 1, true);
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

test('pull problem creates root bundle with artifact and literature lanes', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-pull-problem-'));
  const output = runCli(['pull', 'problem', '857'], { cwd: workspace });
  assert.match(output, /Pull bundle created:/);
  assert.match(output, /Artifact lane:/);
  assert.match(output, /Literature lane:/);
  const pullDir = path.join(workspace, '.erdos', 'pulls', '857');
  assert.equal(fs.existsSync(path.join(pullDir, 'PULL_STATUS.json')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'artifacts', 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'artifacts', 'PACK_PROBLEM', 'CONTEXT.md')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'literature', 'REFERENCES.md')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'literature', 'STATEMENT.md')), true);
});

test('pull artifacts creates the artifact lane directly', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-pull-artifacts-'));
  const output = runCli(['pull', 'artifacts', '857'], { cwd: workspace });
  assert.match(output, /Artifact bundle created:/);
  const artifactDir = path.join(workspace, '.erdos', 'pulls', '857', 'artifacts');
  assert.equal(fs.existsSync(path.join(artifactDir, 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(artifactDir, 'COMPUTE', 'm8_exactness_cube_and_certificate_v0.yaml')), true);
});

test('pull literature creates the literature lane directly', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-pull-literature-'));
  const output = runCli(['pull', 'literature', '857'], { cwd: workspace });
  assert.match(output, /Literature bundle created:/);
  const literatureDir = path.join(workspace, '.erdos', 'pulls', '857', 'literature');
  assert.equal(fs.existsSync(path.join(literatureDir, 'REFERENCES.md')), true);
  assert.equal(fs.existsSync(path.join(literatureDir, 'PACK_PROBLEM', 'CONTEXT.md')), true);
  assert.equal(fs.existsSync(path.join(literatureDir, 'LITERATURE_INDEX.json')), true);
});

test('pull problem creates upstream-only bundle for unseeded problem', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-pull-unseeded-'));
  const output = runCli(['pull', 'problem', '1'], { cwd: workspace });
  assert.match(output, /Pull bundle created:/);
  assert.match(output, /Local canonical dossier included: no/);
  assert.match(output, /Upstream record included: yes/);
  const pullDir = path.join(workspace, '.erdos', 'pulls', '1');
  assert.equal(fs.existsSync(path.join(pullDir, 'UPSTREAM_RECORD.json')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'artifacts', 'PROBLEM.json')), true);
  assert.equal(fs.existsSync(path.join(pullDir, 'artifacts', 'problem.yaml')), false);
  assert.equal(fs.existsSync(path.join(pullDir, 'literature', 'PROBLEM.json')), true);
});

test('maintainer seed creates a canonical dossier from a pulled bundle', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-seed-workspace-'));
  const pullDir = path.join(workspace, 'pull-bundle');
  const outputPull = runCli(['pull', 'problem', '1', '--dest', pullDir], { cwd: workspace });
  assert.match(outputPull, /Pull bundle created:/);

  const destRoot = path.join(workspace, 'seeded-problems');
  const outputSeed = runCli([
    'maintainer',
    'seed',
    'problem',
    '1',
    '--from-pull',
    pullDir,
    '--dest-root',
    destRoot,
    '--cluster',
    'number-theory',
    '--family-tag',
    'additive-combinatorics',
    '--related',
    '20',
  ], { cwd: workspace });

  assert.match(outputSeed, /Seeded dossier for problem 1/);
  const problemDir = path.join(destRoot, '1');
  assert.equal(fs.existsSync(path.join(problemDir, 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'STATEMENT.md')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'REFERENCES.md')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'EVIDENCE.md')), true);
  assert.equal(fs.existsSync(path.join(problemDir, 'FORMALIZATION.md')), true);

  const yamlText = fs.readFileSync(path.join(problemDir, 'problem.yaml'), 'utf8');
  assert.match(yamlText, /problem_id: "1"/);
  assert.match(yamlText, /cluster: number-theory/);
  assert.match(yamlText, /repo_status: cataloged/);
  assert.match(yamlText, /family_tags:/);
  assert.match(yamlText, /additive-combinatorics/);
  assert.match(yamlText, /related_problems:/);
  assert.match(yamlText, /"20"/);
});

test('state sync after problem use writes state markdown and question ledger', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-state-sync-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['state', 'show'], { cwd: workspace });
  assert.match(output, /Erdos research state/);
  assert.match(output, /Open problem: 857/);
  assert.match(output, /Active route: anchored_selector_linearization/);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'STATE.md')), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'QUESTION-LEDGER.md')), true);
});

test('continuation use milestone persists config and shows resolved mode', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-continuation-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['continuation', 'use', 'milestone'], { cwd: workspace });
  assert.match(output, /Continuation mode set to milestone/);
  const config = JSON.parse(fs.readFileSync(path.join(workspace, '.erdos', 'config.json'), 'utf8'));
  assert.equal(config.continuation, 'milestone');
});

test('checkpoints sync creates checkpoint shelf and route checkpoint', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-checkpoints-'));
  runCli(['problem', 'use', '857'], { cwd: workspace });
  const output = runCli(['checkpoints', 'sync'], { cwd: workspace });
  assert.match(output, /Checkpoint shelf synced/);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'checkpoints', 'CHECKPOINTS.md')), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'checkpoints', 'route-checkpoints', 'problem-857--anchored_selector_linearization.md')), true);
});

test('preflight reports ok after bootstrap and checkpoint sync', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-preflight-'));
  runCli(['bootstrap', 'problem', '857'], { cwd: workspace });
  const output = runCli(['preflight'], { cwd: workspace });
  assert.match(output, /Verdict: ok/);
  assert.match(output, /Continuation policy: route/);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'registry', 'preflight')), true);
});

test('sunflower status for 20 shows the deeper frontier framing and compute lane', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-sunflower-20-'));
  const output = runCli(['sunflower', 'status', '20'], { cwd: workspace });
  assert.match(output, /Frontier label: uniform_k3_frontier/);
  assert.match(output, /Compute lane: u3_uniform_transfer_window_v0 \[ready_for_local_scout\]/);
  assert.match(output, /Next honest move:/);
});

test('workspace show includes research loop paths and continuation mode', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-workspace-loop-'));
  runCli(['bootstrap', 'problem', '857'], { cwd: workspace });
  const output = runCli(['workspace', 'show'], { cwd: workspace });
  assert.match(output, /State markdown:/);
  assert.match(output, /Question ledger:/);
  assert.match(output, /Checkpoint shelf:/);
  assert.match(output, /Workspace seeded-problems dir:/);
  assert.match(output, /Active seeded dossier dir:/);
  assert.match(output, /Continuation mode: route/);
  assert.match(output, /Next honest move:/);
});

test('seed problem creates a workspace-local dossier and activates the research loop in one step', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-seed-one-step-'));
  const output = runCli(['seed', 'problem', '1', '--cluster', 'number-theory'], { cwd: workspace });
  assert.match(output, /Seeded local dossier for problem 1/);
  assert.match(output, /Workspace overlay visible: yes/);
  assert.match(output, /Activated: yes/);
  assert.match(output, /Loop synced: yes/);

  const seededDir = path.join(workspace, '.erdos', 'seeded-problems', '1');
  assert.equal(fs.existsSync(path.join(seededDir, 'problem.yaml')), true);
  assert.equal(fs.existsSync(path.join(seededDir, 'STATEMENT.md')), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'STATE.md')), true);
  assert.equal(fs.existsSync(path.join(workspace, '.erdos', 'checkpoints', 'CHECKPOINTS.md')), true);

  const currentProblem = JSON.parse(fs.readFileSync(path.join(workspace, '.erdos', 'current-problem.json'), 'utf8'));
  assert.equal(currentProblem.problemId, '1');

  const shown = runCli(['problem', 'show', '1'], { cwd: workspace });
  assert.match(shown, /Erdos Problem #1/);
  assert.match(shown, /Repo status: local_seeded/);

  const listed = runCli(['problem', 'list', '--repo-status', 'local_seeded'], { cwd: workspace });
  assert.match(listed, /1/);
});

test('seed problem can emit json for agents', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'erdos-seed-json-'));
  const output = runCli(['seed', 'problem', '1', '--cluster', 'number-theory', '--json'], { cwd: workspace });
  const payload = JSON.parse(output);
  assert.equal(payload.problemId, '1');
  assert.equal(payload.workspaceOverlayVisible, true);
  assert.equal(payload.activated, true);
  assert.equal(payload.loopSynced, true);
  assert.equal(payload.activeProblem, '1');
  assert.equal(typeof payload.nextHonestMove, 'string');
});
