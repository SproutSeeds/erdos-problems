import { fileExists, readJson, writeJson } from './files.js';
import { getWorkspaceConfigPath, getWorkspaceRoot } from './paths.js';

const DEFAULT_CONFIG = {
  preferredAgent: 'erdos',
  continuation: 'route',
};

export function defaultConfig() {
  return { ...DEFAULT_CONFIG };
}

export function loadConfig(workspaceRoot = getWorkspaceRoot()) {
  const configPath = getWorkspaceConfigPath(workspaceRoot);
  if (!fileExists(configPath)) {
    return defaultConfig();
  }
  return {
    ...DEFAULT_CONFIG,
    ...readJson(configPath),
  };
}

export function saveConfig(config, workspaceRoot = getWorkspaceRoot()) {
  const payload = {
    ...DEFAULT_CONFIG,
    ...config,
  };
  writeJson(getWorkspaceConfigPath(workspaceRoot), payload);
  return payload;
}

export function ensureConfig(workspaceRoot = getWorkspaceRoot()) {
  const payload = loadConfig(workspaceRoot);
  saveConfig(payload, workspaceRoot);
  return payload;
}
