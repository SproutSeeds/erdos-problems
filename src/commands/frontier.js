import {
  applyFrontierBrevProvision,
  applyFrontierBrevFleetProvision,
  applyFrontierFleetSync,
  setFrontierPaidFleetAccess,
  setFrontierPaidRemoteAccess,
  applyFrontierRemoteAttach,
  applyFrontierRemoteSetup,
  applyFrontierRemoteSync,
  applyFrontierSetup,
  applyFrontierUseRemote,
  getFrontierBrevProvisionSnapshot,
  getFrontierBrevFleetProvisionSnapshot,
  getFrontierFleetSnapshot,
  getFrontierFleetsSnapshot,
  getFrontierFleetSyncSnapshot,
  getFrontierLanesSnapshot,
  getFrontierRemoteAttachSnapshot,
  getFrontierRemoteSetupSnapshot,
  getFrontierRemotesSnapshot,
  getFrontierRemoteSyncSnapshot,
  getFrontierDoctorSnapshot,
  getFrontierSetupSnapshot,
  syncFrontierDoctorSnapshot,
} from '../runtime/frontier.js';
import {
  getFrontierSessionSnapshot,
  listFrontierSessionSnapshots,
  stopFrontierSession,
} from '../runtime/frontier-sessions.js';
import { getWorkspaceRoot } from '../runtime/paths.js';

function parseDoctorArgs(args) {
  const parsed = { asJson: false };
  for (const token of args) {
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    return { error: `Unknown frontier doctor option: ${token}` };
  }
  return parsed;
}

function parseLanesArgs(args) {
  const parsed = { asJson: false };
  for (const token of args) {
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    return { error: `Unknown frontier lanes option: ${token}` };
  }
  return parsed;
}

function parseRemotesArgs(args) {
  const parsed = { asJson: false };
  for (const token of args) {
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    return { error: `Unknown frontier remotes option: ${token}` };
  }
  return parsed;
}

function parseFleetsArgs(args) {
  const parsed = { asJson: false, fleetId: null };
  for (const token of args) {
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (!parsed.fleetId) {
      parsed.fleetId = token;
      continue;
    }
    return { error: `Unknown frontier fleet option: ${token}` };
  }
  return parsed;
}

function parseSessionsArgs(args) {
  const parsed = { asJson: false };
  for (const token of args) {
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    return { error: `Unknown frontier sessions option: ${token}` };
  }
  return parsed;
}

function parseSessionArgs(args) {
  const parsed = {
    asJson: false,
    sessionId: null,
  };
  for (const token of args) {
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (!parsed.sessionId) {
      parsed.sessionId = token;
      continue;
    }
    return { error: `Unknown frontier session option: ${token}` };
  }
  if (!parsed.sessionId) {
    return { error: 'Missing frontier session id.' };
  }
  return parsed;
}

function parseUseRemoteArgs(args) {
  const parsed = {
    asJson: false,
    remoteId: null,
  };
  for (const token of args) {
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (!parsed.remoteId) {
      parsed.remoteId = token;
      continue;
    }
    return { error: `Unknown frontier use-remote option: ${token}` };
  }
  if (!parsed.remoteId) {
    return { error: 'Missing frontier remote id.' };
  }
  return parsed;
}

function parseAttachArgs(args) {
  const parsed = {
    asJson: false,
    apply: false,
    provider: 'ssh',
    remoteId: null,
    instanceName: null,
    sshHost: null,
    engineRoot: null,
    pythonCommand: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (token === '--apply') {
      parsed.apply = true;
      continue;
    }
    if (token === '--ssh-host') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing host after --ssh-host.' };
      }
      parsed.sshHost = nextValue;
      index += 1;
      continue;
    }
    if (token === '--remote-id') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing remote id after --remote-id.' };
      }
      parsed.remoteId = nextValue;
      index += 1;
      continue;
    }
    if (token === '--engine-root') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing path after --engine-root.' };
      }
      parsed.engineRoot = nextValue;
      index += 1;
      continue;
    }
    if (token === '--python-command') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing command after --python-command.' };
      }
      parsed.pythonCommand = nextValue;
      index += 1;
      continue;
    }
    return { error: `Unknown frontier attach-ssh option: ${token}` };
  }

  return parsed;
}

function parseAttachBrevArgs(args) {
  const parsed = {
    asJson: false,
    apply: false,
    provider: 'brev',
    remoteId: null,
    instanceName: null,
    sshHost: null,
    engineRoot: null,
    pythonCommand: null,
    enablePaidRung: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (token === '--apply') {
      parsed.apply = true;
      continue;
    }
    if (token === '--enable-paid-rung') {
      parsed.enablePaidRung = true;
      continue;
    }
    if (token === '--instance') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing instance name after --instance.' };
      }
      parsed.instanceName = nextValue;
      index += 1;
      continue;
    }
    if (token === '--remote-id') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing remote id after --remote-id.' };
      }
      parsed.remoteId = nextValue;
      index += 1;
      continue;
    }
    if (token === '--ssh-host') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing SSH host after --ssh-host.' };
      }
      parsed.sshHost = nextValue;
      index += 1;
      continue;
    }
    if (token === '--engine-root') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing path after --engine-root.' };
      }
      parsed.engineRoot = nextValue;
      index += 1;
      continue;
    }
    if (token === '--python-command') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing command after --python-command.' };
      }
      parsed.pythonCommand = nextValue;
      index += 1;
      continue;
    }
    return { error: `Unknown frontier attach-brev option: ${token}` };
  }

  if (!parsed.instanceName && !parsed.sshHost) {
    return { error: 'Brev attach requires --instance or --ssh-host.' };
  }

  return parsed;
}

function parseSyncArgs(args) {
  const parsed = {
    asJson: false,
    apply: false,
    remoteId: null,
    sshHost: null,
    engineRoot: null,
    pythonCommand: null,
    laneId: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (token === '--apply') {
      parsed.apply = true;
      continue;
    }
    if (token === '--ssh-host') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing host after --ssh-host.' };
      }
      parsed.sshHost = nextValue;
      index += 1;
      continue;
    }
    if (token === '--remote-id') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing remote id after --remote-id.' };
      }
      parsed.remoteId = nextValue;
      index += 1;
      continue;
    }
    if (token === '--engine-root') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing path after --engine-root.' };
      }
      parsed.engineRoot = nextValue;
      index += 1;
      continue;
    }
    if (token === '--python-command') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing command after --python-command.' };
      }
      parsed.pythonCommand = nextValue;
      index += 1;
      continue;
    }
    if (token === '--lane') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing lane id after --lane.' };
      }
      parsed.laneId = nextValue;
      index += 1;
      continue;
    }
    return { error: `Unknown frontier sync-ssh option: ${token}` };
  }

  return parsed;
}

function parseFleetSyncArgs(args) {
  const parsed = {
    asJson: false,
    apply: false,
    fleetId: null,
    laneId: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (token === '--apply') {
      parsed.apply = true;
      continue;
    }
    if (token === '--lane') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing lane id after --lane.' };
      }
      parsed.laneId = nextValue;
      index += 1;
      continue;
    }
    if (!parsed.fleetId) {
      parsed.fleetId = token;
      continue;
    }
    return { error: `Unknown frontier sync-fleet option: ${token}` };
  }

  if (!parsed.fleetId) {
    return { error: 'Missing frontier fleet id.' };
  }

  return parsed;
}

function parseCreateBrevArgs(args) {
  const parsed = {
    asJson: false,
    apply: false,
    dryRun: false,
    attach: false,
    instanceName: null,
    type: null,
    gpuName: null,
    provider: null,
    count: null,
    parallel: null,
    minVram: null,
    minTotalVram: null,
    maxBootTime: null,
    minDisk: null,
    minCapability: null,
    sort: null,
    startupScript: null,
    detached: false,
    syncLane: null,
    sshHost: null,
    engineRoot: null,
    pythonCommand: null,
    enablePaidRung: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (token === '--apply') {
      parsed.apply = true;
      continue;
    }
    if (token === '--dry-run') {
      parsed.dryRun = true;
      continue;
    }
    if (token === '--attach') {
      parsed.attach = true;
      continue;
    }
    if (token === '--enable-paid-rung') {
      parsed.enablePaidRung = true;
      continue;
    }
    if (token === '--detached') {
      parsed.detached = true;
      continue;
    }
    if (!token.startsWith('--') && !parsed.instanceName) {
      parsed.instanceName = token;
      continue;
    }
    const nextValue = args[index + 1];
    if (token === '--name') {
      if (!nextValue) {
        return { error: 'Missing instance name after --name.' };
      }
      parsed.instanceName = nextValue;
      index += 1;
      continue;
    }
    if (token === '--type') {
      if (!nextValue) {
        return { error: 'Missing type after --type.' };
      }
      parsed.type = nextValue;
      index += 1;
      continue;
    }
    if (token === '--gpu-name') {
      if (!nextValue) {
        return { error: 'Missing gpu name after --gpu-name.' };
      }
      parsed.gpuName = nextValue;
      index += 1;
      continue;
    }
    if (token === '--provider') {
      if (!nextValue) {
        return { error: 'Missing provider after --provider.' };
      }
      parsed.provider = nextValue;
      index += 1;
      continue;
    }
    if (token === '--count') {
      if (!nextValue) {
        return { error: 'Missing count after --count.' };
      }
      parsed.count = nextValue;
      index += 1;
      continue;
    }
    if (token === '--parallel') {
      if (!nextValue) {
        return { error: 'Missing parallel value after --parallel.' };
      }
      parsed.parallel = nextValue;
      index += 1;
      continue;
    }
    if (token === '--min-vram') {
      if (!nextValue) {
        return { error: 'Missing value after --min-vram.' };
      }
      parsed.minVram = nextValue;
      index += 1;
      continue;
    }
    if (token === '--min-total-vram') {
      if (!nextValue) {
        return { error: 'Missing value after --min-total-vram.' };
      }
      parsed.minTotalVram = nextValue;
      index += 1;
      continue;
    }
    if (token === '--max-boot-time') {
      if (!nextValue) {
        return { error: 'Missing value after --max-boot-time.' };
      }
      parsed.maxBootTime = nextValue;
      index += 1;
      continue;
    }
    if (token === '--min-disk') {
      if (!nextValue) {
        return { error: 'Missing value after --min-disk.' };
      }
      parsed.minDisk = nextValue;
      index += 1;
      continue;
    }
    if (token === '--min-capability') {
      if (!nextValue) {
        return { error: 'Missing value after --min-capability.' };
      }
      parsed.minCapability = nextValue;
      index += 1;
      continue;
    }
    if (token === '--sort') {
      if (!nextValue) {
        return { error: 'Missing value after --sort.' };
      }
      parsed.sort = nextValue;
      index += 1;
      continue;
    }
    if (token === '--startup-script') {
      if (!nextValue) {
        return { error: 'Missing value after --startup-script.' };
      }
      parsed.startupScript = nextValue;
      index += 1;
      continue;
    }
    if (token === '--sync-lane') {
      if (!nextValue) {
        return { error: 'Missing lane id after --sync-lane.' };
      }
      parsed.syncLane = nextValue;
      index += 1;
      continue;
    }
    if (token === '--ssh-host') {
      if (!nextValue) {
        return { error: 'Missing SSH host after --ssh-host.' };
      }
      parsed.sshHost = nextValue;
      index += 1;
      continue;
    }
    if (token === '--engine-root') {
      if (!nextValue) {
        return { error: 'Missing path after --engine-root.' };
      }
      parsed.engineRoot = nextValue;
      index += 1;
      continue;
    }
    if (token === '--python-command') {
      if (!nextValue) {
        return { error: 'Missing command after --python-command.' };
      }
      parsed.pythonCommand = nextValue;
      index += 1;
      continue;
    }
    return { error: `Unknown frontier create-brev option: ${token}` };
  }

  if (!parsed.instanceName) {
    return { error: 'Missing Brev instance name.' };
  }

  return parsed;
}

function parseCreateBrevFleetArgs(args) {
  const parsed = parseCreateBrevArgs(args);
  if (parsed.error) {
    return parsed;
  }
  if (parsed.count === null) {
    parsed.count = '2';
  }
  return parsed;
}

function parseSetupArgs(args) {
  const parsed = {
    asJson: false,
    apply: false,
    mode: 'base',
    torchIndexUrl: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (token === '--apply') {
      parsed.apply = true;
      continue;
    }
    if (token === '--base') {
      parsed.mode = 'base';
      continue;
    }
    if (token === '--cpu') {
      parsed.mode = 'cpu';
      continue;
    }
    if (token === '--cuda') {
      parsed.mode = 'cuda';
      continue;
    }
    if (token === '--torch-index-url') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing URL after --torch-index-url.' };
      }
      parsed.torchIndexUrl = nextValue;
      index += 1;
      continue;
    }
    return { error: `Unknown frontier setup option: ${token}` };
  }

  return parsed;
}

function parseRemoteSetupArgs(args) {
  const parsed = {
    asJson: false,
    apply: false,
    mode: 'base',
    remoteId: null,
    torchIndexUrl: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (token === '--apply') {
      parsed.apply = true;
      continue;
    }
    if (token === '--base') {
      parsed.mode = 'base';
      continue;
    }
    if (token === '--cpu') {
      parsed.mode = 'cpu';
      continue;
    }
    if (token === '--cuda') {
      parsed.mode = 'cuda';
      continue;
    }
    if (token === '--remote-id') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing remote id after --remote-id.' };
      }
      parsed.remoteId = nextValue;
      index += 1;
      continue;
    }
    if (token === '--torch-index-url') {
      const nextValue = args[index + 1];
      if (!nextValue) {
        return { error: 'Missing URL after --torch-index-url.' };
      }
      parsed.torchIndexUrl = nextValue;
      index += 1;
      continue;
    }
    return { error: `Unknown frontier setup-remote option: ${token}` };
  }

  return parsed;
}

function formatRuntime(runtime, label) {
  if (!runtime.available) {
    return `${label}: unavailable${runtime.error ? ` (${runtime.error})` : ''}`;
  }
  const torch = runtime.torchInstalled
    ? `torch ${runtime.torchVersion ?? '(unknown version)'}`
    : 'torch missing';
  const cuda = runtime.cudaAvailable
    ? `cuda yes (${runtime.cudaDeviceCount} device${runtime.cudaDeviceCount === 1 ? '' : 's'}${runtime.cudaDeviceNames.length > 0 ? `: ${runtime.cudaDeviceNames.join(', ')}` : ''})`
    : 'cuda no';
  return `${label}: ${runtime.pythonVersion} at ${runtime.pythonExecutable} | ${torch} | ${cuda}`;
}

function printDoctor(snapshot) {
  console.log('Frontier runtime doctor');
  console.log(`Workspace root: ${snapshot.workspaceRoot}`);
  console.log(`Frontier workspace dir: ${snapshot.frontierWorkspaceDir}`);
  console.log(`Managed venv dir: ${snapshot.managedVenvDir}`);
  console.log(`Bundled engine: ${snapshot.bundledEnginePresent ? 'yes' : 'no'}`);
  console.log(`Bundled engine root: ${snapshot.bundledEngineRoot}`);
  console.log(`Bundled pyproject: ${snapshot.bundledEnginePyprojectPresent ? snapshot.bundledEnginePyprojectPath : '(missing)'}`);
  console.log(`Bundled engine CLI: ${snapshot.bundledEngineCliPresent ? snapshot.bundledEngineCliPath : '(missing)'}`);
  console.log(formatRuntime(snapshot.systemPython, 'System python'));
  console.log(formatRuntime(snapshot.managedPython, 'Managed python'));
  console.log(`Frontier loop opt-in: ${snapshot.frontierLoopOptIn ? 'yes' : 'no'}`);
  console.log(`Frontier loop mode: ${snapshot.frontierLoopMode ?? 'inactive'}`);
  console.log(`Bridge refresh ready: ${snapshot.bridgeRefreshReady ? 'yes' : 'no'}`);
  console.log(`Managed frontier ready: ${snapshot.managedFrontierReady ? 'yes' : 'no'}`);
  console.log(`GPU search ready: ${snapshot.gpuSearchReady ? 'yes' : 'no'}`);
  if (snapshot.registeredRemotes?.length) {
  console.log(`Registered remotes: ${snapshot.registeredRemotes.length}`);
    console.log(`Active remote id: ${snapshot.activeRemoteId ?? '(none)'}`);
  }
  if (snapshot.registeredFleets?.length) {
    console.log(`Registered fleets: ${snapshot.registeredFleets.length}`);
  }
  if (snapshot.remote?.sshHost) {
    console.log(`Remote provider: ${snapshot.remote.provider ?? 'ssh'}`);
    if (snapshot.remote.instanceName) {
      console.log(`Remote instance: ${snapshot.remote.instanceName}`);
    }
    console.log(`Remote paid rung: ${snapshot.remote.paidRung ? 'yes' : 'no'}`);
    if (snapshot.remote.paidRung) {
      console.log(`Remote paid enabled: ${snapshot.remote.paidEnabled ? 'yes' : 'no'}`);
    }
    console.log(`Remote SSH host: ${snapshot.remote.sshHost}`);
    console.log(`Remote engine root: ${snapshot.remote.engineRoot}`);
    console.log(`Remote last sync: ${snapshot.remote.lastSyncAt ?? '(never)'}`);
    console.log(`Remote sync scope: ${snapshot.remote.lastSyncScope ?? '(none)'}`);
    console.log(formatRuntime(snapshot.remote, 'Remote runtime'));
  }
  if (snapshot.researchModes) {
    console.log(`Bridge refresh mode: ${snapshot.researchModes.bridgeRefresh?.mode ?? 'unavailable'}`);
    console.log(`Family search mode: ${snapshot.researchModes.familySearch?.mode ?? 'unavailable'}`);
    console.log(`Heavy search mode: ${snapshot.researchModes.heavySearch?.mode ?? 'unavailable'}`);
  }
  console.log('Suggested commands:');
  console.log(`- ${snapshot.commands.lanes}`);
  console.log(`- ${snapshot.commands.remotes}`);
  console.log(`- ${snapshot.commands.fleets}`);
  console.log(`- ${snapshot.commands.useRemote}`);
  console.log(`- ${snapshot.commands.setupBase}`);
  console.log(`- ${snapshot.commands.setupCpu}`);
  console.log(`- ${snapshot.commands.setupCuda}`);
  console.log(`- ${snapshot.commands.createBrev}`);
  console.log(`- ${snapshot.commands.createBrevFleet}`);
  console.log(`- ${snapshot.commands.attachSsh}`);
  console.log(`- ${snapshot.commands.attachBrev}`);
  console.log(`- ${snapshot.commands.enablePaidRemote}`);
  console.log(`- ${snapshot.commands.enablePaidFleet}`);
  console.log(`- ${snapshot.commands.syncSsh}`);
  console.log(`- ${snapshot.commands.syncFleet}`);
  console.log(`- ${snapshot.commands.bridgeRefresh848}`);
}

function printLanes(snapshot) {
  if (!snapshot.available) {
    console.log('Frontier lanes: unavailable');
    console.log(`Error: ${snapshot.error ?? '(unknown)'}`);
    return;
  }
  console.log('Frontier lanes');
  console.log(`Runner mode: ${snapshot.runnerMode ?? '(unknown)'}`);
  for (const lane of snapshot.lanes) {
    console.log(`- ${lane.lane_id} [problem ${lane.problem_id}]`);
    console.log(`  status: ${lane.status}`);
    console.log(`  family: ${lane.family}`);
    console.log(`  route posture: ${lane.route_posture}`);
    console.log(`  objective: ${lane.search_objective}`);
    console.log(`  experiment dir: ${lane.experiment_dir}`);
  }
  if (snapshot.errors?.length) {
    console.log('Lane load errors:');
    for (const error of snapshot.errors) {
      console.log(`- ${error.laneId}: ${error.error}`);
    }
  }
}

function printRemotes(snapshot) {
  console.log('Frontier remotes');
  console.log(`Workspace root: ${snapshot.workspaceRoot}`);
  console.log(`Remote count: ${snapshot.remoteCount}`);
  console.log(`Active remote id: ${snapshot.activeRemoteId ?? '(none)'}`);
  for (const remote of snapshot.remotes) {
    console.log(`- ${remote.remoteId}${remote.active ? ' [active]' : ''}`);
    console.log(`  provider: ${remote.provider ?? 'ssh'}`);
    console.log(`  paid rung: ${remote.paidRung ? 'yes' : 'no'}`);
    if (remote.paidRung) {
      console.log(`  paid enabled: ${remote.paidEnabled ? 'yes' : 'no'}`);
    }
    console.log(`  instance: ${remote.instanceName ?? '(none)'}`);
    console.log(`  ssh host: ${remote.sshHost ?? '(none)'}`);
    console.log(`  engine root: ${remote.engineRoot ?? '(none)'}`);
    console.log(`  python command: ${remote.pythonCommand ?? '(none)'}`);
  }
}

function printFleets(snapshot) {
  console.log('Frontier fleets');
  console.log(`Workspace root: ${snapshot.workspaceRoot}`);
  console.log(`Fleet count: ${snapshot.fleetCount}`);
  for (const fleet of snapshot.fleets) {
    console.log(`- ${fleet.fleetId}`);
    console.log(`  provider: ${fleet.provider ?? 'brev'}`);
    console.log(`  paid rung: ${fleet.paidRung ? 'yes' : 'no'}`);
    if (fleet.paidRung) {
      console.log(`  paid enabled: ${fleet.paidEnabled ? 'yes' : 'no'}`);
    }
    console.log(`  count: ${fleet.count}`);
    console.log(`  lane: ${fleet.laneId ?? '(none)'}`);
    console.log(`  topology: ${fleet.intendedTopology ?? '(none)'}`);
    console.log(`  attached/ready: ${fleet.attachedCount}/${fleet.readyGpuCount}`);
    console.log(`  remotes: ${fleet.remoteIds.join(', ') || '(none)'}`);
  }
}

function printFleet(snapshot) {
  if (!snapshot) {
    console.log('Frontier fleet: unavailable');
    return;
  }
  console.log('Frontier fleet');
  console.log(`Fleet id: ${snapshot.fleetId}`);
  console.log(`Provider: ${snapshot.provider ?? 'brev'}`);
  console.log(`Paid rung: ${snapshot.paidRung ? 'yes' : 'no'}`);
  if (snapshot.paidRung) {
    console.log(`Paid enabled: ${snapshot.paidEnabled ? 'yes' : 'no'}`);
  }
  console.log(`Count: ${snapshot.count}`);
  console.log(`Lane: ${snapshot.laneId ?? '(none)'}`);
  console.log(`Topology: ${snapshot.intendedTopology ?? '(none)'}`);
  console.log(`Created at: ${snapshot.createdAt ?? '(unknown)'}`);
  console.log(`Last provisioned at: ${snapshot.lastProvisionedAt ?? '(unknown)'}`);
  console.log(`Attached members: ${snapshot.attachedCount}`);
  console.log(`GPU-ready members: ${snapshot.readyGpuCount}`);
  console.log('Members:');
  for (const member of snapshot.members ?? []) {
    console.log(`- ${member.remoteId}${member.active ? ' [active]' : ''}`);
    console.log(`  provider: ${member.provider ?? '(unknown)'}`);
    console.log(`  instance: ${member.instanceName ?? '(none)'}`);
    console.log(`  ssh host: ${member.sshHost ?? '(none)'}`);
    console.log(`  attached: ${member.attached ? 'yes' : 'no'}`);
    console.log(`  gpu ready: ${member.gpuSearchReady ? 'yes' : 'no'}`);
    console.log(`  last sync: ${member.lastSyncAt ?? '(never)'}`);
  }
}

function printUseRemoteResult(result) {
  if (!result.ok) {
    console.log('Frontier use-remote: failed');
    console.log(`Error: ${result.error ?? '(unknown)'}`);
    return;
  }
  console.log('Frontier use-remote: complete');
  console.log(`Applied at: ${result.appliedAt}`);
  console.log(`Active remote id: ${result.snapshot.activeRemoteId ?? '(none)'}`);
}

function printPaidRungResult(result, targetLabel) {
  if (!result.ok) {
    console.log(`Frontier ${targetLabel}: failed`);
    console.log(`Error: ${result.error ?? '(unknown)'}`);
    return;
  }
  console.log(`Frontier ${targetLabel}: complete`);
  console.log(`Applied at: ${result.appliedAt}`);
  console.log(`Enabled: ${result.enabled ? 'yes' : 'no'}`);
  if (result.remoteId) {
    console.log(`Remote id: ${result.remoteId}`);
  }
  if (result.fleetId) {
    console.log(`Fleet id: ${result.fleetId}`);
  }
}

function printSessions(snapshot) {
  console.log('Frontier sessions');
  console.log(`Workspace root: ${snapshot.workspaceRoot}`);
  console.log(`Sessions dir: ${snapshot.sessionsDir}`);
  console.log(`Session count: ${snapshot.sessionCount}`);
  for (const session of snapshot.sessions) {
    console.log(`- ${session.sessionId} [${session.status}]`);
    console.log(`  label: ${session.label}`);
    console.log(`  problem/action: ${session.problemId ?? '(none)'} / ${session.actionId ?? '(none)'}`);
    console.log(`  mode/source: ${session.mode ?? '(none)'} / ${session.source ?? '(none)'}`);
    console.log(`  launched: ${session.launchedAt}`);
    if (session.reviewDueAt) {
      console.log(`  review due: ${session.reviewDueAt} [${session.reviewState}]`);
    }
    if (session.runDir) {
      console.log(`  run dir: ${session.runDir}`);
    }
  }
}

function printSession(snapshot) {
  if (!snapshot) {
    console.log('Frontier session: unavailable');
    return;
  }
  console.log('Frontier session');
  console.log(`Session id: ${snapshot.sessionId}`);
  console.log(`Status: ${snapshot.status}`);
  console.log(`Label: ${snapshot.label}`);
  console.log(`Problem id: ${snapshot.problemId ?? '(none)'}`);
  console.log(`Action id: ${snapshot.actionId ?? '(none)'}`);
  console.log(`Mode: ${snapshot.mode ?? '(none)'}`);
  console.log(`Source: ${snapshot.source ?? '(none)'}`);
  console.log(`Launched at: ${snapshot.launchedAt}`);
  console.log(`PID: ${snapshot.pid ?? '(none)'}`);
  console.log(`Running: ${snapshot.running ? 'yes' : 'no'}`);
  console.log(`Command: ${snapshot.commandLine}`);
  console.log(`Stdout log: ${snapshot.stdoutPath}`);
  console.log(`Stderr log: ${snapshot.stderrPath}`);
  if (snapshot.reviewDueAt) {
    console.log(`Review due: ${snapshot.reviewDueAt}`);
    console.log(`Review state: ${snapshot.reviewState}`);
  }
  if (snapshot.runDir) {
    console.log(`Run dir: ${snapshot.runDir}`);
  }
  if (snapshot.stdoutTail?.length) {
    console.log('Stdout tail:');
    for (const line of snapshot.stdoutTail) {
      console.log(`- ${line}`);
    }
  }
  if (snapshot.stderrTail?.length) {
    console.log('Stderr tail:');
    for (const line of snapshot.stderrTail) {
      console.log(`- ${line}`);
    }
  }
}

function printStopSessionResult(result) {
  if (!result.ok) {
    console.log('Frontier stop-session: failed');
    console.log(`Error: ${result.error ?? '(unknown)'}`);
    return;
  }
  console.log('Frontier stop-session: complete');
  console.log(`Requested stop: ${result.requested ? 'yes' : 'no'}`);
  console.log(`Already exited: ${result.alreadyExited ? 'yes' : 'no'}`);
  if (result.session) {
    console.log(`Session id: ${result.session.sessionId}`);
    console.log(`Status: ${result.session.status}`);
  }
}

function printSetup(snapshot) {
  console.log('Frontier setup plan');
  console.log(`Workspace root: ${snapshot.plan.workspaceRoot}`);
  console.log(`Mode: ${snapshot.plan.mode}`);
  console.log(`Frontier workspace dir: ${snapshot.plan.frontierWorkspaceDir}`);
  console.log(`Managed venv dir: ${snapshot.plan.managedVenvDir}`);
  console.log(`Bundled engine root: ${snapshot.plan.bundledEngineRoot}`);
  console.log(`Apply now: ${snapshot.apply ? 'yes' : 'no'}`);
  console.log('Planned commands:');
  for (const [index, step] of snapshot.plan.steps.entries()) {
    console.log(`${index + 1}. ${step.commandLine}${step.optional ? ' [optional]' : ''}`);
    if (step.note) {
      console.log(`   note: ${step.note}`);
    }
  }
  console.log('Notes:');
  for (const note of snapshot.plan.notes) {
    console.log(`- ${note}`);
  }
  console.log('Current readiness:');
  console.log(`- bridge refresh ready: ${snapshot.doctor.bridgeRefreshReady ? 'yes' : 'no'}`);
  console.log(`- managed frontier ready: ${snapshot.doctor.managedFrontierReady ? 'yes' : 'no'}`);
  console.log(`- GPU search ready: ${snapshot.doctor.gpuSearchReady ? 'yes' : 'no'}`);
}

function printSetupResult(result) {
  if (!result.ok) {
    console.log('Frontier setup: failed');
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
    printSetup({
      apply: true,
      plan: result.plan,
      doctor: result.doctor,
    });
    return;
  }

  console.log('Frontier setup: complete');
  console.log(`Applied at: ${result.appliedAt}`);
  console.log('Executed steps:');
  for (const step of result.stepResults) {
    console.log(`- ${step.label}: ${step.ok ? 'ok' : 'failed'} (${step.commandLine})`);
  }
  printDoctor(result.doctor);
}

function printRemoteSetup(snapshot) {
  console.log('Frontier remote setup plan');
  console.log(`Apply now: ${snapshot.apply ? 'yes' : 'no'}`);
  console.log(`Mode: ${snapshot.plan.mode}`);
  console.log(`Remote id: ${snapshot.plan.remoteId ?? '(none)'}`);
  console.log(`Remote provider: ${snapshot.plan.remote?.provider ?? 'ssh'}`);
  if (snapshot.plan.remote?.instanceName) {
    console.log(`Remote instance: ${snapshot.plan.remote.instanceName}`);
  }
  console.log(`Remote host: ${snapshot.plan.remote?.sshHost ?? '(none)'}`);
  console.log(`Remote python command: ${snapshot.plan.remote?.pythonCommand ?? '(none)'}`);
  console.log('Planned commands:');
  for (const [index, step] of snapshot.plan.steps.entries()) {
    console.log(`${index + 1}. ${step.remoteCommand}`);
    if (step.note) {
      console.log(`   note: ${step.note}`);
    }
  }
  console.log('Notes:');
  for (const note of snapshot.plan.notes ?? []) {
    console.log(`- ${note}`);
  }
}

function printRemoteSetupResult(result) {
  if (!result.ok) {
    console.log('Frontier remote setup: failed');
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
    if (result.snapshot) {
      printRemoteSetup(result.snapshot);
    }
    return;
  }

  console.log('Frontier remote setup: complete');
  console.log(`Applied at: ${result.appliedAt}`);
  for (const step of result.stepResults) {
    console.log(`- ${step.label}: ${step.ok ? 'ok' : 'failed'} (${step.commandLine})`);
  }
  printDoctor(result.doctor);
}

function printAttachSnapshot(snapshot) {
  console.log(`Frontier ${snapshot.remote.provider === 'brev' ? 'Brev' : 'SSH'} attach plan`);
  console.log(`Apply now: ${snapshot.apply ? 'yes' : 'no'}`);
  console.log(`Remote id: ${snapshot.remote.remoteId ?? '(none)'}`);
  if (snapshot.remote.instanceName) {
    console.log(`Instance: ${snapshot.remote.instanceName}`);
  }
  console.log(`SSH host: ${snapshot.remote.sshHost ?? '(missing)'}`);
  console.log(`Remote engine root: ${snapshot.remote.engineRoot}`);
  console.log(`Remote python command: ${snapshot.remote.pythonCommand}`);
  console.log(`Paid rung: ${snapshot.paidRung ? 'yes' : 'no'}`);
  if (snapshot.paidRung) {
    console.log(`Paid enabled: ${snapshot.paidEnabled ? 'yes' : 'no'}`);
  }
  if (snapshot.doctor) {
    console.log(formatRuntime(snapshot.doctor, 'Remote runtime'));
    console.log(`Remote frontier ready: ${snapshot.doctor.frontierEngineReady ? 'yes' : 'no'}`);
    console.log(`Remote GPU ready: ${snapshot.doctor.frontierEngineReady && snapshot.doctor.cudaAvailable ? 'yes' : 'no'}`);
  }
}

function printAttachResult(result) {
  if (!result.ok) {
    console.log(`Frontier ${result.snapshot?.remote?.provider === 'brev' ? 'Brev' : 'SSH'} attach: failed`);
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
    if (result.snapshot) {
      printAttachSnapshot(result.snapshot);
    }
    return;
  }

  console.log(`Frontier ${result.snapshot.remote.provider === 'brev' ? 'Brev' : 'SSH'} attach: complete`);
  console.log(`Applied at: ${result.appliedAt}`);
  printAttachSnapshot(result.snapshot);
}

function printSyncSnapshot(snapshot) {
  console.log('Frontier SSH sync plan');
  console.log(`Apply now: ${snapshot.apply ? 'yes' : 'no'}`);
  console.log(`Remote id: ${snapshot.remote.remoteId ?? '(none)'}`);
  console.log(`Provider: ${snapshot.remote.provider ?? 'ssh'}`);
  console.log(`SSH host: ${snapshot.remote.sshHost ?? '(missing)'}`);
  console.log(`Remote engine root: ${snapshot.remote.engineRoot}`);
  console.log(`Remote python command: ${snapshot.remote.pythonCommand}`);
  console.log(`Sync scope: ${snapshot.scope?.mode === 'lane' ? snapshot.scope.laneId : 'all lanes'}`);
  console.log(`Local engine root: ${snapshot.local.engineRoot}`);
  console.log(`Local experiments root: ${snapshot.local.experimentsRoot}`);
  if (snapshot.doctor) {
    console.log(formatRuntime(snapshot.doctor, 'Remote runtime'));
  }
}

function printSyncResult(result) {
  if (!result.ok) {
    console.log('Frontier SSH sync: failed');
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
    if (result.snapshot) {
      printSyncSnapshot(result.snapshot);
    }
    return;
  }

  console.log('Frontier SSH sync: complete');
  console.log(`Applied at: ${result.appliedAt}`);
  console.log(`Synced scope: ${result.snapshot.scope?.mode === 'lane' ? result.snapshot.scope.laneId : 'all lanes'}`);
  for (const step of result.stepResults) {
    console.log(`- ${step.label}: ${step.ok ? 'ok' : 'failed'} (${step.commandLine})`);
  }
  if (result.remoteVerification && result.snapshot.scope?.mode === 'lane' && result.snapshot.scope?.laneId) {
    console.log(`Remote lane verified: ${result.snapshot.scope.laneId}`);
  }
  if (result.remoteLiveFrontier?.shared_prefix_failure_count !== undefined) {
    console.log(
      `Remote shared-prefix failures: ${result.remoteLiveFrontier.shared_prefix_failure_count} through ${result.remoteLiveFrontier.latest_direct_failure}`,
    );
  }
}

function printCreateBrevSnapshot(snapshot) {
  console.log('Frontier Brev provision plan');
  console.log(`Apply now: ${snapshot.apply ? 'yes' : 'no'}`);
  console.log(`Instance: ${snapshot.instanceName}`);
  console.log(`Count: ${snapshot.count}`);
  console.log(`Enable paid rung: ${snapshot.enablePaidRung ? 'yes' : 'no'}`);
  console.log(`Attach after create: ${snapshot.attach ? 'yes' : 'no'}`);
  if (snapshot.syncLane) {
    console.log(`Sync lane after attach: ${snapshot.syncLane}`);
  }
  console.log(`Create command: ${snapshot.plan.createCommandLine}`);
  if (snapshot.plan.attachCommand) {
    console.log(`Attach command: ${snapshot.plan.attachCommand}`);
  }
  if (snapshot.plan.syncCommand) {
    console.log(`Sync command: ${snapshot.plan.syncCommand}`);
  }
  console.log('Notes:');
  for (const note of snapshot.notes ?? []) {
    console.log(`- ${note}`);
  }
  if (snapshot.warnings?.length) {
    console.log('Warnings:');
    for (const warning of snapshot.warnings) {
      console.log(`- ${warning}`);
    }
  }
}

function printCreateBrevResult(result) {
  if (!result.ok) {
    console.log('Frontier Brev provision: failed');
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
    if (result.snapshot) {
      printCreateBrevSnapshot(result.snapshot);
    }
    return;
  }
  console.log('Frontier Brev provision: complete');
  console.log(`Applied at: ${result.appliedAt}`);
  console.log(`Instance: ${result.snapshot.instanceName}`);
  console.log(`Create command: ${result.snapshot.plan.createCommandLine}`);
  if (result.snapshot.dryRun) {
    console.log('Dry run output:');
  } else {
    console.log('Create output:');
  }
  for (const line of String(result.createResult?.stdout ?? '').split(/\r?\n/).filter(Boolean)) {
    console.log(`- ${line}`);
  }
  if (result.attachResult) {
    console.log(`Attach result: ${result.attachResult.ok ? 'ok' : 'failed'}`);
  }
  if (result.syncResult) {
    console.log(`Sync result: ${result.syncResult.ok ? 'ok' : 'failed'}`);
  }
}

function printCreateBrevFleetSnapshot(snapshot) {
  console.log('Frontier Brev fleet provision plan');
  console.log(`Apply now: ${snapshot.apply ? 'yes' : 'no'}`);
  console.log(`Fleet: ${snapshot.fleetId}`);
  console.log(`Count: ${snapshot.count}`);
  console.log(`Enable paid rung: ${snapshot.enablePaidRung ? 'yes' : 'no'}`);
  console.log(`Topology: ${snapshot.intendedTopology}`);
  console.log(`Attach after create: ${snapshot.attach ? 'yes' : 'no'}`);
  if (snapshot.syncLane) {
    console.log(`Sync lane after attach: ${snapshot.syncLane}`);
  }
  console.log('Members:');
  for (const member of snapshot.members) {
    console.log(`- ${member.instanceName}`);
    console.log(`  create: ${member.createCommandLine}`);
    if (member.attachCommand) {
      console.log(`  attach: ${member.attachCommand}`);
    }
    if (member.syncCommand) {
      console.log(`  sync: ${member.syncCommand}`);
    }
  }
  console.log('Notes:');
  for (const note of snapshot.notes ?? []) {
    console.log(`- ${note}`);
  }
  if (snapshot.warnings?.length) {
    console.log('Warnings:');
    for (const warning of snapshot.warnings) {
      console.log(`- ${warning}`);
    }
  }
}

function printCreateBrevFleetResult(result) {
  if (!result.ok) {
    console.log('Frontier Brev fleet provision: failed');
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
    if (result.snapshot) {
      printCreateBrevFleetSnapshot(result.snapshot);
    }
    return;
  }
  console.log('Frontier Brev fleet provision: complete');
  console.log(`Applied at: ${result.appliedAt}`);
  console.log(`Fleet: ${result.snapshot.fleetId}`);
  console.log(`Members provisioned: ${result.memberResults.length}`);
  for (const member of result.memberResults) {
    console.log(`- ${member.instanceName}: ${member.ok ? 'ok' : 'failed'}`);
  }
}

function printFleetSyncSnapshot(snapshot) {
  console.log('Frontier fleet sync plan');
  console.log(`Apply now: ${snapshot.apply ? 'yes' : 'no'}`);
  console.log(`Fleet: ${snapshot.fleetId ?? '(none)'}`);
  console.log(`Lane: ${snapshot.laneId ?? 'all lanes'}`);
  console.log(`Topology: ${snapshot.intendedTopology ?? '(none)'}`);
  console.log('Members:');
  for (const member of snapshot.members ?? []) {
    console.log(`- ${member.remoteId}`);
    console.log(`  sync: ${member.syncCommand}`);
  }
}

function printFleetSyncResult(result) {
  if (!result.ok) {
    console.log('Frontier fleet sync: failed');
    if (result.error) {
      console.log(`Error: ${result.error}`);
    }
    if (result.snapshot) {
      printFleetSyncSnapshot(result.snapshot);
    }
    return;
  }
  console.log('Frontier fleet sync: complete');
  console.log(`Applied at: ${result.appliedAt}`);
  console.log(`Fleet: ${result.snapshot.fleetId}`);
  for (const member of result.memberResults) {
    console.log(`- ${member.remoteId}: ${member.ok ? 'ok' : 'failed'}`);
  }
}

export function runFrontierCommand(args) {
  const [subcommand, ...rest] = args;
  const workspaceRoot = getWorkspaceRoot();

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos frontier doctor [--json]');
    console.log('  erdos frontier lanes [--json]');
    console.log('  erdos frontier remotes [--json]');
    console.log('  erdos frontier fleets [--json]');
    console.log('  erdos frontier fleet <fleet-id> [--json]');
    console.log('  erdos frontier use-remote <remote-id> [--json]');
    console.log('  erdos frontier sessions [--json]');
    console.log('  erdos frontier session <session-id> [--json]');
    console.log('  erdos frontier stop-session <session-id> [--json]');
    console.log('  erdos frontier setup [--base|--cpu|--cuda] [--torch-index-url <url>] [--apply] [--json]');
    console.log('  erdos frontier setup-remote [--remote-id <id>] [--base|--cpu|--cuda] [--torch-index-url <url>] [--apply] [--json]');
    console.log('  erdos frontier create-brev <name> [--gpu-name <name>] [--type <type>] [--provider <provider>] [--count <n>] [--attach] [--enable-paid-rung] [--sync-lane <lane-id>] [--dry-run] [--apply] [--json]');
    console.log('  erdos frontier create-brev-fleet <fleet-id> [--gpu-name <name>] [--type <type>] [--provider <provider>] [--count <n>] [--attach] [--enable-paid-rung] [--sync-lane <lane-id>] [--dry-run] [--apply] [--json]');
    console.log('  erdos frontier attach-ssh --ssh-host <host> [--remote-id <id>] [--engine-root <path>] [--python-command <cmd>] [--apply] [--json]');
    console.log('  erdos frontier attach-brev --instance <name> [--remote-id <id>] [--ssh-host <host>] [--engine-root <path>] [--python-command <cmd>] [--enable-paid-rung] [--apply] [--json]');
    console.log('  erdos frontier enable-paid-remote <remote-id> [--json]');
    console.log('  erdos frontier disable-paid-remote <remote-id> [--json]');
    console.log('  erdos frontier enable-paid-fleet <fleet-id> [--json]');
    console.log('  erdos frontier disable-paid-fleet <fleet-id> [--json]');
    console.log('  erdos frontier sync-ssh [--remote-id <id>] [--ssh-host <host>] [--engine-root <path>] [--python-command <cmd>] [--lane <lane-id>] [--apply] [--json]');
    console.log('  erdos frontier sync-fleet <fleet-id> [--lane <lane-id>] [--apply] [--json]');
    return 0;
  }

  if (subcommand === 'doctor') {
    const parsed = parseDoctorArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const snapshot = syncFrontierDoctorSnapshot(workspaceRoot);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printDoctor(snapshot);
    return 0;
  }

  if (subcommand === 'lanes') {
    const parsed = parseLanesArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const snapshot = getFrontierLanesSnapshot(workspaceRoot);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return snapshot.available ? 0 : 1;
    }
    printLanes(snapshot);
    return snapshot.available ? 0 : 1;
  }

  if (subcommand === 'remotes') {
    const parsed = parseRemotesArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const snapshot = getFrontierRemotesSnapshot(workspaceRoot);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printRemotes(snapshot);
    return 0;
  }

  if (subcommand === 'fleets') {
    const parsed = parseFleetsArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const snapshot = getFrontierFleetsSnapshot(workspaceRoot);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printFleets(snapshot);
    return 0;
  }

  if (subcommand === 'fleet') {
    const parsed = parseFleetsArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    if (!parsed.fleetId) {
      console.error('Missing frontier fleet id.');
      return 1;
    }
    const snapshot = getFrontierFleetSnapshot(parsed.fleetId, workspaceRoot);
    if (!snapshot) {
      console.error(`Unknown frontier fleet: ${parsed.fleetId}`);
      return 1;
    }
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printFleet(snapshot);
    return 0;
  }

  if (subcommand === 'use-remote') {
    const parsed = parseUseRemoteArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const result = applyFrontierUseRemote(parsed.remoteId, workspaceRoot);
    if (parsed.asJson) {
      console.log(JSON.stringify(result, null, 2));
      return result.ok ? 0 : 1;
    }
    printUseRemoteResult(result);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'enable-paid-remote' || subcommand === 'disable-paid-remote') {
    const parsed = parseUseRemoteArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const result = setFrontierPaidRemoteAccess(parsed.remoteId, subcommand === 'enable-paid-remote', workspaceRoot);
    if (parsed.asJson) {
      console.log(JSON.stringify(result, null, 2));
      return result.ok ? 0 : 1;
    }
    printPaidRungResult(result, subcommand);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'enable-paid-fleet' || subcommand === 'disable-paid-fleet') {
    const parsed = parseFleetsArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    if (!parsed.fleetId) {
      console.error('Missing frontier fleet id.');
      return 1;
    }
    const result = setFrontierPaidFleetAccess(parsed.fleetId, subcommand === 'enable-paid-fleet', workspaceRoot);
    if (parsed.asJson) {
      console.log(JSON.stringify(result, null, 2));
      return result.ok ? 0 : 1;
    }
    printPaidRungResult(result, subcommand);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'sessions') {
    const parsed = parseSessionsArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const snapshot = listFrontierSessionSnapshots(workspaceRoot);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printSessions(snapshot);
    return 0;
  }

  if (subcommand === 'session') {
    const parsed = parseSessionArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const snapshot = getFrontierSessionSnapshot(parsed.sessionId, workspaceRoot);
    if (!snapshot) {
      console.error(`Unknown frontier session: ${parsed.sessionId}`);
      return 1;
    }
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printSession(snapshot);
    return 0;
  }

  if (subcommand === 'stop-session') {
    const parsed = parseSessionArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const result = stopFrontierSession(parsed.sessionId, workspaceRoot);
    if (parsed.asJson) {
      console.log(JSON.stringify(result, null, 2));
      return result.ok ? 0 : 1;
    }
    printStopSessionResult(result);
    return result.ok ? 0 : 1;
  }

  if (subcommand === 'setup') {
    const parsed = parseSetupArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    if (parsed.apply) {
      const result = applyFrontierSetup(parsed.mode, workspaceRoot, {
        torchIndexUrl: parsed.torchIndexUrl,
      });
      if (parsed.asJson) {
        console.log(JSON.stringify(result, null, 2));
        return result.ok ? 0 : 1;
      }
      printSetupResult(result);
      return result.ok ? 0 : 1;
    }

    const snapshot = getFrontierSetupSnapshot(parsed.mode, workspaceRoot, {
      apply: false,
      torchIndexUrl: parsed.torchIndexUrl,
    });
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printSetup(snapshot);
    return 0;
  }

  if (subcommand === 'setup-remote') {
    const parsed = parseRemoteSetupArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    if (parsed.apply) {
      const result = applyFrontierRemoteSetup(parsed.mode, workspaceRoot, parsed);
      if (parsed.asJson) {
        console.log(JSON.stringify(result, null, 2));
        return result.ok ? 0 : 1;
      }
      printRemoteSetupResult(result);
      return result.ok ? 0 : 1;
    }
    const snapshot = getFrontierRemoteSetupSnapshot(parsed.mode, workspaceRoot, parsed);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printRemoteSetup(snapshot);
    return 0;
  }

  if (subcommand === 'create-brev') {
    const parsed = parseCreateBrevArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    if (parsed.apply) {
      const result = applyFrontierBrevProvision(workspaceRoot, parsed);
      if (parsed.asJson) {
        console.log(JSON.stringify(result, null, 2));
        return result.ok ? 0 : 1;
      }
      printCreateBrevResult(result);
      return result.ok ? 0 : 1;
    }
    const snapshot = getFrontierBrevProvisionSnapshot(workspaceRoot, parsed);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printCreateBrevSnapshot(snapshot);
    return 0;
  }

  if (subcommand === 'create-brev-fleet') {
    const parsed = parseCreateBrevFleetArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    if (parsed.apply) {
      const result = applyFrontierBrevFleetProvision(workspaceRoot, parsed);
      if (parsed.asJson) {
        console.log(JSON.stringify(result, null, 2));
        return result.ok ? 0 : 1;
      }
      printCreateBrevFleetResult(result);
      return result.ok ? 0 : 1;
    }
    const snapshot = getFrontierBrevFleetProvisionSnapshot(workspaceRoot, parsed);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printCreateBrevFleetSnapshot(snapshot);
    return 0;
  }

  if (subcommand === 'attach-ssh') {
    const parsed = parseAttachArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    if (parsed.apply) {
      const result = applyFrontierRemoteAttach(workspaceRoot, parsed);
      if (parsed.asJson) {
        console.log(JSON.stringify(result, null, 2));
        return result.ok ? 0 : 1;
      }
      printAttachResult(result);
      return result.ok ? 0 : 1;
    }
    const snapshot = getFrontierRemoteAttachSnapshot(workspaceRoot, parsed);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printAttachSnapshot(snapshot);
    return 0;
  }

  if (subcommand === 'attach-brev') {
    const parsed = parseAttachBrevArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    if (parsed.apply) {
      const result = applyFrontierRemoteAttach(workspaceRoot, parsed);
      if (parsed.asJson) {
        console.log(JSON.stringify(result, null, 2));
        return result.ok ? 0 : 1;
      }
      printAttachResult(result);
      return result.ok ? 0 : 1;
    }
    const snapshot = getFrontierRemoteAttachSnapshot(workspaceRoot, parsed);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printAttachSnapshot(snapshot);
    return 0;
  }

  if (subcommand === 'sync-ssh') {
    const parsed = parseSyncArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    if (parsed.apply) {
      const result = applyFrontierRemoteSync(workspaceRoot, parsed);
      if (parsed.asJson) {
        console.log(JSON.stringify(result, null, 2));
        return result.ok ? 0 : 1;
      }
      printSyncResult(result);
      return result.ok ? 0 : 1;
    }
    const snapshot = getFrontierRemoteSyncSnapshot(workspaceRoot, parsed);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return 0;
    }
    printSyncSnapshot(snapshot);
    return 0;
  }

  if (subcommand === 'sync-fleet') {
    const parsed = parseFleetSyncArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    if (parsed.apply) {
      const result = applyFrontierFleetSync(workspaceRoot, parsed);
      if (parsed.asJson) {
        console.log(JSON.stringify(result, null, 2));
        return result.ok ? 0 : 1;
      }
      printFleetSyncResult(result);
      return result.ok ? 0 : 1;
    }
    const snapshot = getFrontierFleetSyncSnapshot(workspaceRoot, parsed);
    if (parsed.asJson) {
      console.log(JSON.stringify(snapshot, null, 2));
      return snapshot.available ? 0 : 1;
    }
    printFleetSyncSnapshot(snapshot);
    return snapshot.available ? 0 : 1;
  }

  console.error(`Unknown frontier subcommand: ${subcommand}`);
  return 1;
}
