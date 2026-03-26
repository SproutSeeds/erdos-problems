import fs from 'node:fs';
import path from 'node:path';
import { copyFileIfPresent, ensureDir } from './files.js';
import {
  getBundledOrpIntegrationPath,
  getBundledOrpProtocolPath,
  getBundledOrpTemplatesDir,
  getWorkspaceOrpDir,
  getWorkspaceOrpIntegrationPath,
  getWorkspaceOrpProtocolPath,
  getWorkspaceOrpTemplatesDir,
  getWorkspaceRoot,
} from './paths.js';

function listTemplateNames(rootDir) {
  if (!fs.existsSync(rootDir)) {
    return [];
  }
  return fs
    .readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort();
}

export function getOrpStatus(workspaceRoot = getWorkspaceRoot()) {
  const bundledTemplatesDir = getBundledOrpTemplatesDir();
  const workspaceTemplatesDir = getWorkspaceOrpTemplatesDir(workspaceRoot);
  const bundledTemplateNames = listTemplateNames(bundledTemplatesDir);
  const workspaceTemplateNames = listTemplateNames(workspaceTemplatesDir);

  return {
    workspaceRoot,
    bundled: {
      protocolPath: getBundledOrpProtocolPath(),
      integrationPath: getBundledOrpIntegrationPath(),
      templatesDir: bundledTemplatesDir,
      protocolPresent: fs.existsSync(getBundledOrpProtocolPath()),
      integrationPresent: fs.existsSync(getBundledOrpIntegrationPath()),
      templateNames: bundledTemplateNames,
    },
    workspace: {
      orpDir: getWorkspaceOrpDir(workspaceRoot),
      protocolPath: getWorkspaceOrpProtocolPath(workspaceRoot),
      integrationPath: getWorkspaceOrpIntegrationPath(workspaceRoot),
      templatesDir: workspaceTemplatesDir,
      protocolPresent: fs.existsSync(getWorkspaceOrpProtocolPath(workspaceRoot)),
      integrationPresent: fs.existsSync(getWorkspaceOrpIntegrationPath(workspaceRoot)),
      templateNames: workspaceTemplateNames,
    },
  };
}

export function syncOrpWorkspaceKit(workspaceRoot = getWorkspaceRoot()) {
  const workspaceOrpDir = getWorkspaceOrpDir(workspaceRoot);
  const workspaceTemplatesDir = getWorkspaceOrpTemplatesDir(workspaceRoot);
  ensureDir(workspaceOrpDir);
  ensureDir(workspaceTemplatesDir);

  copyFileIfPresent(getBundledOrpProtocolPath(), getWorkspaceOrpProtocolPath(workspaceRoot));
  copyFileIfPresent(getBundledOrpIntegrationPath(), getWorkspaceOrpIntegrationPath(workspaceRoot));

  const bundledTemplatesDir = getBundledOrpTemplatesDir();
  const copiedTemplates = [];
  for (const templateName of listTemplateNames(bundledTemplatesDir)) {
    const sourcePath = path.join(bundledTemplatesDir, templateName);
    const destinationPath = path.join(workspaceTemplatesDir, templateName);
    if (copyFileIfPresent(sourcePath, destinationPath)) {
      copiedTemplates.push(templateName);
    }
  }

  const status = getOrpStatus(workspaceRoot);
  return {
    workspaceRoot,
    orpDir: workspaceOrpDir,
    protocolPath: status.workspace.protocolPath,
    integrationPath: status.workspace.integrationPath,
    templatesDir: status.workspace.templatesDir,
    templateNames: status.workspace.templateNames,
    copiedTemplates,
  };
}
