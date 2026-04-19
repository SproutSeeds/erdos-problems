import { getOrpStatus, syncOrpWorkspaceKit } from '../runtime/orp.js';
import { getProblem } from '../atlas/catalog.js';
import {
  getOrpResearchIntegrationStatus,
  getOpenAiResearchUsage,
  runOpenAiSmokeCheck,
  runOrpResearchAsk,
  runOrpResearchRunStatus,
  runOrpResearchShow,
} from '../runtime/orp-research.js';

function printOrpStatus(status) {
  console.log('Open Research Protocol');
  console.log(`Workspace root: ${status.workspaceRoot}`);
  console.log(`Bundled protocol: ${status.bundled.protocolPresent ? status.bundled.protocolPath : '(missing)'}`);
  console.log(`Bundled integration: ${status.bundled.integrationPresent ? status.bundled.integrationPath : '(missing)'}`);
  console.log(`Bundled templates: ${status.bundled.templateNames.join(', ') || '(none)'}`);
  console.log(`Workspace ORP dir: ${status.workspace.orpDir}`);
  console.log(`Workspace protocol: ${status.workspace.protocolPresent ? status.workspace.protocolPath : '(missing)'}`);
  console.log(`Workspace integration: ${status.workspace.integrationPresent ? status.workspace.integrationPath : '(missing)'}`);
  console.log(`Workspace templates: ${status.workspace.templateNames.join(', ') || '(none)'}`);
}

export function runOrpCommand(args) {
  const [subcommand, ...rest] = args;

  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos orp show [--json]');
    console.log('  erdos orp sync [--json]');
    console.log('  erdos orp research status [--json]');
    console.log('  erdos orp research ask <problem-id> --question <text> [--run-id <id>] [--profile <id>] [--profile-file <path>] [--timeout-sec <n>] [--execute] [--allow-paid] [--json]');
    console.log('  erdos orp research openai-check [--run-id <id>] [--timeout-sec <n>] [--execute] [--allow-paid] [--json]');
    console.log('  erdos orp research run-status [run-id] [--json]');
    console.log('  erdos orp research show [run-id] [--json]');
    console.log('  erdos orp research usage [--json]');
    return 0;
  }

  if (subcommand === 'research') {
    return runOrpResearchCommand(rest);
  }

  const asJson = rest.includes('--json');
  const unknown = rest.filter((arg) => arg !== '--json');

  if (unknown.length > 0) {
    console.error(`Unknown orp option: ${unknown[0]}`);
    return 1;
  }

  if (subcommand === 'show') {
    const status = getOrpStatus();
    if (asJson) {
      console.log(JSON.stringify(status, null, 2));
      return 0;
    }
    printOrpStatus(status);
    return 0;
  }

  if (subcommand === 'sync') {
    const result = syncOrpWorkspaceKit();
    if (asJson) {
      console.log(JSON.stringify(result, null, 2));
      return 0;
    }
    console.log('ORP workspace kit synced');
    console.log(`Workspace ORP dir: ${result.orpDir}`);
    console.log(`Protocol: ${result.protocolPath}`);
    console.log(`Agent integration: ${result.integrationPath}`);
    console.log(`Templates: ${result.templateNames.join(', ') || '(none)'}`);
    return 0;
  }

  console.error(`Unknown orp subcommand: ${subcommand}`);
  return 1;
}

function parseResearchAskArgs(args) {
  const parsed = {
    problemId: null,
    question: null,
    runId: null,
    execute: false,
    allowPaid: false,
    profile: 'openai-council',
    profileFile: null,
    timeoutSec: 120,
    asJson: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (token === '--execute') {
      parsed.execute = true;
      continue;
    }
    if (token === '--allow-paid') {
      parsed.allowPaid = true;
      continue;
    }
    if (token === '--question') {
      const value = args[index + 1];
      if (!value) {
        return { error: 'Missing question after --question.' };
      }
      parsed.question = value;
      index += 1;
      continue;
    }
    if (token === '--run-id') {
      const value = args[index + 1];
      if (!value) {
        return { error: 'Missing run id after --run-id.' };
      }
      parsed.runId = value;
      index += 1;
      continue;
    }
    if (token === '--profile') {
      const value = args[index + 1];
      if (!value) {
        return { error: 'Missing profile after --profile.' };
      }
      parsed.profile = value;
      index += 1;
      continue;
    }
    if (token === '--profile-file') {
      const value = args[index + 1];
      if (!value) {
        return { error: 'Missing profile file after --profile-file.' };
      }
      parsed.profileFile = value;
      index += 1;
      continue;
    }
    if (token === '--timeout-sec') {
      const value = args[index + 1];
      const timeoutSec = Number.parseInt(value, 10);
      if (!Number.isFinite(timeoutSec) || timeoutSec <= 0) {
        return { error: `Invalid timeout seconds: ${value}` };
      }
      parsed.timeoutSec = timeoutSec;
      index += 1;
      continue;
    }
    if (!parsed.problemId) {
      parsed.problemId = token;
      continue;
    }
    return { error: `Unknown research ask option: ${token}` };
  }

  if (!parsed.problemId) {
    return { error: 'Missing problem id.' };
  }
  if (!parsed.question) {
    return { error: 'Missing --question <text>.' };
  }
  return parsed;
}

function parseOpenAiCheckArgs(args) {
  const parsed = {
    runId: null,
    execute: false,
    allowPaid: false,
    timeoutSec: 30,
    asJson: false,
  };

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      parsed.asJson = true;
      continue;
    }
    if (token === '--execute') {
      parsed.execute = true;
      continue;
    }
    if (token === '--allow-paid') {
      parsed.allowPaid = true;
      continue;
    }
    if (token === '--run-id') {
      const value = args[index + 1];
      if (!value) {
        return { error: 'Missing run id after --run-id.' };
      }
      parsed.runId = value;
      index += 1;
      continue;
    }
    if (token === '--timeout-sec') {
      const value = args[index + 1];
      const timeoutSec = Number.parseInt(value, 10);
      if (!Number.isFinite(timeoutSec) || timeoutSec <= 0) {
        return { error: `Invalid timeout seconds: ${value}` };
      }
      parsed.timeoutSec = timeoutSec;
      index += 1;
      continue;
    }
    return { error: `Unknown openai-check option: ${token}` };
  }

  return parsed;
}

function printResearchStatus(status) {
  console.log('ORP research API integration');
  console.log(`Global ORP binary: ${status.orp.available ? status.orp.bin : '(not available)'}`);
  console.log(`Research module: ${status.researchModule.available ? 'available' : 'unavailable'}`);
  console.log(`OpenAI env: ${status.openai.envPresent ? `${status.openai.envVarName}=set` : `${status.openai.envVarName}=unset`}`);
  console.log(`OpenAI local Keychain secret: ${status.openai.localKeychainPresent ? status.openai.secretAlias : '(missing)'}`);
  console.log(`Live calls: ${status.liveCalls.requiresExecuteFlag ? 'opt-in with --execute and --allow-paid' : 'not gated'}`);
  console.log(`Live runs today: ${status.liveCalls.todayLiveRunCount}/${status.liveCalls.dailyLiveRunLimit}`);
  console.log(`API budget today: $${status.liveCalls.todaySpendUsd}/$${status.liveCalls.dailySpendLimitUsd}`);
  console.log(`Plan command: ${status.commands.plan}`);
  console.log(`Smoke check: ${status.commands.openaiCheckPlan}`);
}

function forwardOrpResult(result, asJson) {
  if (result.stdout) {
    process.stdout.write(result.stdout);
  }
  if (!result.ok && result.stderr) {
    process.stderr.write(result.stderr);
  }
  if (!result.ok && !result.stderr && !result.stdout) {
    console.error(result.error ?? `ORP command failed: ${result.command}`);
  }
  if (!asJson && !result.stdout && result.ok) {
    console.log('ORP command completed.');
  }
  return result.ok ? 0 : 1;
}

function runOrpResearchCommand(args) {
  const [subcommand, ...rest] = args;
  if (!subcommand || subcommand === 'help' || subcommand === '--help') {
    console.log('Usage:');
    console.log('  erdos orp research status [--json]');
    console.log('  erdos orp research ask <problem-id> --question <text> [--run-id <id>] [--profile <id>] [--profile-file <path>] [--timeout-sec <n>] [--execute] [--allow-paid] [--json]');
    console.log('  erdos orp research openai-check [--run-id <id>] [--timeout-sec <n>] [--execute] [--allow-paid] [--json]');
    console.log('  erdos orp research run-status [run-id] [--json]');
    console.log('  erdos orp research show [run-id] [--json]');
    console.log('  erdos orp research usage [--json]');
    return 0;
  }

  if (subcommand === 'status') {
    const asJson = rest.includes('--json');
    const unknown = rest.filter((arg) => arg !== '--json');
    if (unknown.length > 0) {
      console.error(`Unknown research status option: ${unknown[0]}`);
      return 1;
    }
    const status = getOrpResearchIntegrationStatus();
    if (asJson) {
      console.log(JSON.stringify(status, null, 2));
      return 0;
    }
    printResearchStatus(status);
    return 0;
  }

  if (subcommand === 'ask') {
    const parsed = parseResearchAskArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const problem = getProblem(parsed.problemId);
    if (!problem) {
      console.error(`Unknown problem id: ${parsed.problemId}`);
      return 1;
    }
    const result = runOrpResearchAsk({
      problem,
      question: parsed.question,
      runId: parsed.runId,
      execute: parsed.execute,
      allowPaid: parsed.allowPaid,
      profile: parsed.profile,
      profileFile: parsed.profileFile,
      timeoutSec: parsed.timeoutSec,
      asJson: parsed.asJson,
    });
    return forwardOrpResult(result, parsed.asJson);
  }

  if (subcommand === 'openai-check') {
    const parsed = parseOpenAiCheckArgs(rest);
    if (parsed.error) {
      console.error(parsed.error);
      return 1;
    }
    const check = runOpenAiSmokeCheck({
      execute: parsed.execute,
      allowPaid: parsed.allowPaid,
      runId: parsed.runId,
      timeoutSec: parsed.timeoutSec,
      asJson: parsed.asJson,
    });
    return forwardOrpResult(check.result, parsed.asJson);
  }

  if (subcommand === 'usage') {
    const asJson = rest.includes('--json');
    const unknown = rest.filter((arg) => arg !== '--json');
    if (unknown.length > 0) {
      console.error(`Unknown research usage option: ${unknown[0]}`);
      return 1;
    }
    const usage = getOpenAiResearchUsage();
    if (asJson) {
      console.log(JSON.stringify(usage, null, 2));
      return 0;
    }
    console.log('ORP/OpenAI research usage');
    console.log(`Today: ${usage.day}`);
    console.log(`Live runs today: ${usage.todayLiveRunCount}/${usage.dailyLiveRunLimit}`);
    console.log(`Remaining today: ${usage.todayRemainingLiveRuns}`);
    console.log(`API spend today: $${usage.todaySpendUsd}/$${usage.dailySpendLimitUsd}`);
    console.log(`Remaining API budget today: $${usage.todayRemainingSpendUsd}`);
    console.log(`Default ask estimate: $${usage.defaultEstimatedAskCostUsd}`);
    console.log(`Default smoke estimate: $${usage.defaultEstimatedSmokeCostUsd}`);
    console.log(`Usage ledger: ${usage.usagePath}`);
    return 0;
  }

  if (subcommand === 'run-status') {
    const asJson = rest.includes('--json');
    const ids = rest.filter((arg) => arg !== '--json');
    if (ids.length > 1) {
      console.error(`Unknown research run-status option: ${ids[1]}`);
      return 1;
    }
    return forwardOrpResult(runOrpResearchRunStatus(ids[0] ?? 'latest', asJson), asJson);
  }

  if (subcommand === 'show') {
    const asJson = rest.includes('--json');
    const ids = rest.filter((arg) => arg !== '--json');
    if (ids.length > 1) {
      console.error(`Unknown research show option: ${ids[1]}`);
      return 1;
    }
    return forwardOrpResult(runOrpResearchShow(ids[0] ?? 'latest', asJson), asJson);
  }

  console.error(`Unknown orp research subcommand: ${subcommand}`);
  return 1;
}
