import { fileExists, readJson, writeJson } from './files.js';
import { getWorkspaceConfigPath, getWorkspaceRoot } from './paths.js';

const DEFAULT_CONFIG = {
  preferredAgent: 'erdos',
  continuation: 'route',
  frontier: {
    loopOptIn: false,
    runtimeMode: null,
    activeMode: null,
    activeRemoteId: null,
    remotes: {},
    fleets: {},
    paidRungs: {
      enabledRemoteIds: [],
      enabledFleetIds: [],
      lastUpdatedAt: null,
    },
    managedFrontierReady: false,
    gpuSearchReady: false,
    lastSetupAt: null,
    lastDoctorAt: null,
    remote: {
      attached: false,
      provider: null,
      instanceName: null,
      sshHost: null,
      engineRoot: null,
      pythonCommand: null,
      frontierEngineReady: false,
      gpuSearchReady: false,
      lastSyncAt: null,
      lastSyncScope: null,
      lastDoctorAt: null,
    },
  },
};

function normalizeStringList(values = []) {
  return Array.from(new Set(
    (Array.isArray(values) ? values : [])
      .map((value) => String(value ?? '').trim())
      .filter(Boolean),
  )).sort();
}

function deriveLegacyPaidRungs(rawFrontier = {}) {
  const remotes = rawFrontier?.remotes && typeof rawFrontier.remotes === 'object'
    ? rawFrontier.remotes
    : {};
  const fleets = rawFrontier?.fleets && typeof rawFrontier.fleets === 'object'
    ? rawFrontier.fleets
    : {};
  return {
    enabledRemoteIds: normalizeStringList(
      Object.entries(remotes)
        .filter(([, remote]) => remote?.provider === 'brev' && (remote?.attached || remote?.frontierEngineReady || remote?.gpuSearchReady))
        .map(([remoteId]) => remoteId),
    ),
    enabledFleetIds: normalizeStringList(
      Object.entries(fleets)
        .filter(([, fleet]) => fleet?.provider === 'brev')
        .map(([fleetId]) => fleetId),
    ),
    lastUpdatedAt: null,
  };
}

function normalizeConfig(raw = {}) {
  const normalizedPaidRungs = raw.frontier?.paidRungs
    ? {
        enabledRemoteIds: normalizeStringList(raw.frontier?.paidRungs?.enabledRemoteIds),
        enabledFleetIds: normalizeStringList(raw.frontier?.paidRungs?.enabledFleetIds),
        lastUpdatedAt: raw.frontier?.paidRungs?.lastUpdatedAt ?? null,
      }
    : deriveLegacyPaidRungs(raw.frontier ?? {});
  return {
    ...DEFAULT_CONFIG,
    ...raw,
    frontier: {
      ...DEFAULT_CONFIG.frontier,
      ...(raw.frontier ?? {}),
      remotes: {
        ...(DEFAULT_CONFIG.frontier.remotes ?? {}),
        ...(raw.frontier?.remotes ?? {}),
      },
      fleets: {
        ...(DEFAULT_CONFIG.frontier.fleets ?? {}),
        ...(raw.frontier?.fleets ?? {}),
      },
      paidRungs: {
        ...(DEFAULT_CONFIG.frontier.paidRungs ?? {}),
        ...normalizedPaidRungs,
      },
      remote: {
        ...DEFAULT_CONFIG.frontier.remote,
        ...(raw.frontier?.remote ?? {}),
      },
    },
  };
}

export function defaultConfig() {
  return normalizeConfig();
}

export function loadConfig(workspaceRoot = getWorkspaceRoot()) {
  const configPath = getWorkspaceConfigPath(workspaceRoot);
  if (!fileExists(configPath)) {
    return defaultConfig();
  }
  return normalizeConfig(readJson(configPath));
}

export function saveConfig(config, workspaceRoot = getWorkspaceRoot()) {
  const payload = normalizeConfig(config);
  writeJson(getWorkspaceConfigPath(workspaceRoot), payload);
  return payload;
}

export function ensureConfig(workspaceRoot = getWorkspaceRoot()) {
  const payload = loadConfig(workspaceRoot);
  saveConfig(payload, workspaceRoot);
  return payload;
}
