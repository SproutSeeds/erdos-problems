import fs from 'node:fs';
import path from 'node:path';
import { stringify } from 'yaml';
import { ensureDir, fileExists, readJson, readText, writeText } from './files.js';
import { getProblemDir, getWorkspaceProblemPullDir, repoRoot } from './paths.js';

const STATEMENT_SKIP_PATTERNS = [
  /^open$/i,
  /^proved(?:\s*\(.*\))?$/i,
  /^disproved(?:\s*\(.*\))?$/i,
  /^decidable$/i,
  /^verifiable$/i,
  /^erd[őo]s problem #\d+/i,
  /^this has been solved/i,
  /^-\s*\$\d+/i,
  /^-$/i,
  /^#\d+\s*:/i,
  /^forum$/i,
  /^inbox$/i,
  /^favourites$/i,
  /^tags$/i,
  /^more$/i,
  /^faq$/i,
  /^prizes$/i,
  /^view the latex source$/i,
  /^view history$/i,
  /^external data from the database/i,
  /^formalised statement\?$/i,
  /\bdisclaimer\b/i,
  /^this is (open|proved|disproved|verifiable|decidable)\b/i,
  /^\s*[a-z][a-z ]+\|\s*$/i,
];

const STARTER_LOOP_ARTIFACTS = [
  'AGENT_START.md',
  'ROUTES.md',
  'CHECKPOINT_NOTES.md',
  'PUBLIC_STATUS_REVIEW.md',
  'AGENT_WEBSEARCH_BRIEF.md',
];

function normalizeTitle(rawTitle, problemId) {
  const fallback = `Erdos Problem #${problemId}`;
  if (!rawTitle) {
    return fallback;
  }

  const cleaned = String(rawTitle)
    .replace(/\s*[|:-]\s*erdosproblems\.com.*$/i, '')
    .replace(/^erd[őo]s problem #?\d+\s*[:\-]?\s*/i, '')
    .trim();
  return cleaned || fallback;
}

function normalizeFamilyTag(tag) {
  return String(tag ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uppercaseBadge(status) {
  return String(status ?? 'unknown').trim().toUpperCase() || 'UNKNOWN';
}

function normalizeClusterLabel(rawTag) {
  return String(rawTag ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function inferClusterFromTags(tags) {
  const normalized = Array.isArray(tags) ? tags.map(normalizeClusterLabel).filter(Boolean) : [];
  if (normalized.includes('number-theory')) {
    return 'number-theory';
  }
  if (normalized.includes('graph-theory') || normalized.includes('chromatic-number')) {
    return 'graph-theory';
  }
  if (normalized.includes('geometry')) {
    return 'geometry';
  }
  if (normalized.includes('analysis')) {
    return 'analysis';
  }
  if (normalized.includes('combinatorics') || normalized.includes('intersecting-family')) {
    return 'combinatorics';
  }
  return 'uncategorized';
}

function getDefaultPullDir(problemId) {
  return getWorkspaceProblemPullDir(problemId);
}

function readOptionalJson(filePath) {
  return fileExists(filePath) ? readJson(filePath) : null;
}

function readOptionalText(filePath) {
  return fileExists(filePath) ? readText(filePath) : null;
}

function loadPullBundle(problemId, fromPullDir) {
  const pullDir = path.resolve(fromPullDir ?? getDefaultPullDir(problemId));
  if (!fs.existsSync(pullDir)) {
    throw new Error(`Pull bundle not found: ${pullDir}`);
  }

  const rootProblem = readOptionalJson(path.join(pullDir, 'PROBLEM.json'));
  const rootUpstreamRecord = readOptionalJson(path.join(pullDir, 'UPSTREAM_RECORD.json'));
  const rootPullStatus = readOptionalJson(path.join(pullDir, 'PULL_STATUS.json'));
  const artifactsProblem = readOptionalJson(path.join(pullDir, 'artifacts', 'PROBLEM.json'));
  const artifactsUpstreamRecord = readOptionalJson(path.join(pullDir, 'artifacts', 'UPSTREAM_RECORD.json'));
  const literatureSiteExtract = readOptionalJson(path.join(pullDir, 'literature', 'SITE_EXTRACT.json'));
  const literatureSiteSummary = readOptionalText(path.join(pullDir, 'literature', 'SITE_SUMMARY.md'));
  const literatureSiteExtractText = readOptionalText(path.join(pullDir, 'literature', 'SITE_EXTRACT.txt'));
  const literatureReferences = readOptionalText(path.join(pullDir, 'literature', 'REFERENCES.md'));
  const literatureStatement = readOptionalText(path.join(pullDir, 'literature', 'STATEMENT.md'));
  const publicStatusReview = readOptionalJson(path.join(pullDir, 'literature', 'PUBLIC_STATUS_REVIEW.json'));
  const publicStatusReviewMarkdown = readOptionalText(path.join(pullDir, 'literature', 'PUBLIC_STATUS_REVIEW.md'));
  const agentWebsearchBrief = readOptionalText(path.join(pullDir, 'literature', 'AGENT_WEBSEARCH_BRIEF.md'));

  return {
    pullDir,
    problemRecord: artifactsProblem ?? rootProblem,
    upstreamRecord: artifactsUpstreamRecord ?? rootUpstreamRecord,
    pullStatus: rootPullStatus,
    siteExtract: literatureSiteExtract,
    siteSummary: literatureSiteSummary,
    siteExtractText: literatureSiteExtractText,
    references: literatureReferences,
    statement: literatureStatement,
    publicStatusReview,
    publicStatusReviewMarkdown,
    agentWebsearchBrief,
  };
}

function deriveTitle(problemId, bundle, titleOverride) {
  if (titleOverride) {
    return String(titleOverride).trim();
  }
  if (bundle.siteExtract?.title) {
    return normalizeTitle(bundle.siteExtract.title, problemId);
  }
  if (bundle.problemRecord?.title && !/^Erdos Problem #\d+$/i.test(bundle.problemRecord.title)) {
    return String(bundle.problemRecord.title).trim();
  }
  return `Erdos Problem #${problemId}`;
}

function extractStatementCandidates(bundle) {
  const previewLines = Array.isArray(bundle.siteExtract?.previewLines)
    ? bundle.siteExtract.previewLines
    : [];

  return previewLines
    .map((line) => String(line ?? '').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((line) => !STATEMENT_SKIP_PATTERNS.some((pattern) => pattern.test(line)))
    .filter((line) => !/^\w[\w -]+$/.test(line) || line.length > 40);
}

function deriveShortStatement(problemId, bundle, title) {
  const statementCandidate = extractStatementCandidates(bundle)[0];
  if (statementCandidate) {
    return statementCandidate;
  }
  if (bundle.problemRecord?.title && bundle.problemRecord.title !== title) {
    return String(bundle.problemRecord.title).trim();
  }
  return `Curated dossier seeded from upstream public metadata for Erdos Problem #${problemId}.`;
}

function buildResearchState(options, siteStatus) {
  if (!options.activeRoute && !options.routeBreakthrough && !options.problemSolved) {
    return null;
  }

  const solved = Boolean(options.problemSolved);
  const openProblem = solved ? false : String(siteStatus).toLowerCase() !== 'solved';
  return {
    open_problem: openProblem,
    active_route: options.activeRoute ?? 'seed_route_pending',
    route_breakthrough: Boolean(options.routeBreakthrough),
    problem_solved: solved,
  };
}

function buildProblemRecord(problemId, bundle, options) {
  const upstreamRecord = bundle.upstreamRecord ?? {};
  const siteStatus = String(
    bundle.siteExtract?.siteStatus
      ?? upstreamRecord.status?.state
      ?? bundle.problemRecord?.siteStatus
      ?? 'unknown',
  ).trim();
  const title = deriveTitle(problemId, bundle, options.title);
  const shortStatement = deriveShortStatement(problemId, bundle, title);
  const familyTags = [
    ...new Set(
      [
        ...(Array.isArray(options.familyTags) ? options.familyTags : []),
        ...((upstreamRecord.tags ?? []).map(normalizeFamilyTag)),
      ].filter(Boolean),
    ),
  ];
  const relatedProblems = [...new Set((options.relatedProblems ?? []).map((value) => String(value).trim()).filter(Boolean))];
  const researchState = buildResearchState(options, siteStatus);

  const record = {
    problem_id: String(problemId),
    display_name: `Erdos Problem #${problemId}`,
    title,
    source: {
      site: 'erdosproblems.com',
      url: `https://www.erdosproblems.com/${problemId}`,
      external_id: String(problemId),
    },
    external_source: {
      repo: 'https://github.com/teorth/erdosproblems',
      data_file: 'data/problems.yaml',
      number: String(problemId),
    },
    provenance: {
      seeded_at: new Date().toISOString(),
      seeded_from: {
        kind: 'pull_bundle',
        imported_record_included: Boolean(bundle.upstreamRecord),
        site_snapshot_included: Boolean(bundle.siteExtract || bundle.siteSummary),
        public_search_review_included: Boolean(bundle.publicStatusReview || bundle.publicStatusReviewMarkdown),
      },
    },
    status: {
      site_status: siteStatus,
      site_badge: uppercaseBadge(siteStatus),
      repo_status: options.repoStatus,
      imported_status: upstreamRecord.status?.state ?? null,
      imported_last_update: upstreamRecord.status?.last_update ?? null,
    },
    cluster: options.cluster ?? inferClusterFromTags(upstreamRecord.tags),
    prize: {
      display: upstreamRecord.prize ?? 'unknown',
    },
    related_problems: relatedProblems,
    family_tags: familyTags,
    harness: {
      depth: options.harnessDepth,
    },
    statement: {
      short: shortStatement,
      normalized_md_path: 'STATEMENT.md',
    },
    references_path: 'REFERENCES.md',
    evidence_path: 'EVIDENCE.md',
    formalization_path: 'FORMALIZATION.md',
    formalization: {
      status: options.formalizationStatus,
      imported_state: upstreamRecord.formalized?.state ?? 'unknown',
      imported_last_update: upstreamRecord.formalized?.last_update ?? null,
    },
  };

  if (researchState) {
    record.research_state = researchState;
  }

  return record;
}

function assertSeedAdmission(record, bundle, options) {
  if (options.allowNonOpen) {
    return;
  }

  const siteStatus = String(bundle.siteExtract?.siteStatus ?? '').trim().toLowerCase();
  const upstreamStatus = String(bundle.upstreamRecord?.status?.state ?? '').trim().toLowerCase();
  if (!siteStatus) {
    if (upstreamStatus === 'open') {
      return;
    }
    throw new Error(
      `Seed admission failed for problem ${record.problem_id}: live erdosproblems.com status was not captured in the pull bundle and upstream status is not clearly open. Re-run with a live site snapshot or pass --allow-non-open to bypass this gate.`,
    );
  }

  if (siteStatus !== 'open') {
    throw new Error(
      `Seed admission failed for problem ${record.problem_id}: erdosproblems.com currently reports site status "${siteStatus}", not "open". Pass --allow-non-open to bypass this gate intentionally.`,
    );
  }
}

function renderStatementMarkdown(problemId, record, bundle) {
  const previewLines = Array.isArray(bundle.siteExtract?.previewLines)
    ? bundle.siteExtract.previewLines.filter((line) => String(line ?? '').trim())
    : [];
  const statementCandidates = extractStatementCandidates(bundle);

  return [
    `# Problem ${problemId} Statement`,
    '',
    `Source: <${record.source.url}>`,
    '',
    'Normalized focus:',
    `- ${record.statement.short}`,
    statementCandidates.length > 0
      ? '- Seeded with filtered statement candidates from the public site snapshot'
      : previewLines.length > 0
        ? '- Seeded with preview lines from the public site snapshot'
        : '- Seeded from upstream public metadata',
    '',
    ...(statementCandidates.length > 0
      ? [
          'Statement candidates:',
          ...statementCandidates.slice(0, 4).map((line) => `- ${line}`),
          '',
        ]
      : []),
    ...(previewLines.length > 0
      ? [
          'Public-site preview:',
          ...previewLines.slice(0, 6).map((line) => `- ${String(line).replace(/\s+/g, ' ').trim()}`),
          '',
        ]
      : []),
  ].join('\n');
}

function renderReferencesMarkdown(record, bundle) {
  return [
    '# References',
    '',
    '- Public problem page:',
    `  - <${record.source.url}>`,
    '- External imported atlas data:',
    '  - <https://github.com/teorth/erdosproblems>',
    '  - `data/problems.yaml`',
    bundle.siteSummary ? '- Site summary snapshot was present in the pull bundle at seed time.' : '- No site summary snapshot was bundled at seed time.',
    bundle.references ? '- A literature lane bundle was available during seeding.' : '- No local literature bundle was available during seeding.',
    '',
  ].join('\n');
}

function renderEvidenceMarkdown(problemId, record, bundle) {
  return [
    '# Evidence',
    '',
    `- This dossier was seeded for Erdos Problem #${problemId} from a pull bundle.`,
    `- Imported record included: ${bundle.upstreamRecord ? 'yes' : 'no'}`,
    `- Site snapshot included: ${bundle.siteExtract || bundle.siteSummary ? 'yes' : 'no'}`,
    `- Public status review included: ${bundle.publicStatusReview || bundle.publicStatusReviewMarkdown ? 'yes' : 'no'}`,
    `- Repo status at seed time: ${record.status.repo_status}`,
    `- Harness depth at seed time: ${record.harness.depth}`,
    '',
    'Next maintainer step:',
    '- replace the seed placeholders with a curated statement, references, evidence notes, and formalization plan.',
    '',
  ].join('\n');
}

function renderFormalizationMarkdown(record) {
  return [
    '# Formalization',
    '',
    `- Local status: ${record.formalization.status}`,
    `- Imported formalized state: ${record.formalization.imported_state}`,
    `- Imported formalized last update: ${record.formalization.imported_last_update ?? '(unknown)'}`,
    '',
    'Seed note:',
    '- this file was created automatically from a pull bundle and should be upgraded as local formal work begins.',
    '',
  ].join('\n');
}

function renderAgentStartMarkdown(problemId, record) {
  const activeRoute = record.research_state?.active_route ?? 'seed_route_pending';
  const routeMode = activeRoute ? 'route' : 'milestone';
  return [
    '# Agent Start',
    '',
    'Fast start:',
    `- \`erdos problem show ${problemId}\``,
    '- `erdos workspace show`',
    '- `erdos preflight`',
    `- \`erdos continuation use ${routeMode}\``,
    '- `erdos checkpoints sync`',
    '',
    'Working assumptions:',
    `- Open problem: ${record.research_state?.open_problem === false ? 'no' : 'yes'}`,
    `- Active route: ${activeRoute}`,
    `- Repo status: ${record.status.repo_status}`,
    `- Harness depth: ${record.harness.depth}`,
    `- Site status: ${record.status.site_status}`,
    '',
    'Read in this order:',
    '- `STATEMENT.md`',
    '- `REFERENCES.md`',
    '- `EVIDENCE.md`',
    '- `FORMALIZATION.md`',
    '- `PUBLIC_STATUS_REVIEW.md`',
    '- `AGENT_WEBSEARCH_BRIEF.md`',
    '',
    'First honest move:',
    `- tighten the local dossier for problem ${problemId} against its pull bundle, references, and import provenance before widening claims.`,
    '- read `PUBLIC_STATUS_REVIEW.md` and run the suggested queries in `AGENT_WEBSEARCH_BRIEF.md` before trusting a single public status surface.',
    '- write down the smallest route hypothesis that would make the next session cleaner, even if it remains provisional.',
    '',
  ].join('\n');
}

function renderRoutesMarkdown(problemId, record) {
  const activeRoute = record.research_state?.active_route ?? 'seed_route_pending';
  return [
    '# Routes',
    '',
    '## Status Ladder',
    '',
    `- Open problem: ${record.research_state?.open_problem === false ? 'no' : 'yes'}`,
    `- Active route: ${activeRoute}`,
    `- Route breakthrough: ${record.research_state?.route_breakthrough ? 'yes' : 'no'}`,
    `- Problem solved: ${record.research_state?.problem_solved ? 'yes' : 'no'}`,
    '',
    '## Starter route notes',
    '',
    `- Current seeded route placeholder for problem ${problemId}: \`${activeRoute}\``,
    '- Treat this as a workspace-level route marker until a curated route tree is written.',
    '- Keep route progress separate from global problem status.',
    '- Suggested route-writing prompts:',
    '  - What is the smallest honest route name?',
    '  - What theorem, evidence bundle, or survey note does it point at?',
    '  - What would count as a route breakthrough versus only route clarification?',
    '',
  ].join('\n');
}

function renderCheckpointNotesMarkdown(problemId, record) {
  return [
    '# Checkpoint Notes',
    '',
    `- Problem: ${problemId}`,
    `- Repo status: ${record.status.repo_status}`,
    `- Harness depth: ${record.harness.depth}`,
    '',
    'Checkpoint prompts:',
    '- What changed in the active route since the last honest checkpoint?',
    '- Which claim level is justified right now: Exact, Verified, Heuristic, or Conjecture?',
    '- Which upstream/public truth changed, if any?',
    '- What did the public-status review and agent websearch brief surface beyond erdosproblems.com?',
    '- Which artifact or literature bundle should the next agent read first?',
    '- What route, evidence, and formalization notes should be promoted out of scratch space into canonical dossier files?',
    '',
  ].join('\n');
}

export function seedProblemFromPullBundle(problemId, options = {}) {
  const bundle = loadPullBundle(problemId, options.fromPullDir);
  const destinationRoot = path.resolve(options.destRoot ?? path.join(repoRoot, 'problems'));
  const destinationDir = path.join(destinationRoot, String(problemId));

  if (fs.existsSync(destinationDir) && !options.force) {
    throw new Error(`Destination already exists: ${destinationDir} (use --force to overwrite)`);
  }

  ensureDir(destinationDir);
  const record = buildProblemRecord(problemId, bundle, {
    cluster: options.cluster ?? null,
    repoStatus: options.repoStatus ?? 'cataloged',
    harnessDepth: options.harnessDepth ?? 'dossier',
    title: options.title ?? null,
    familyTags: options.familyTags ?? [],
    relatedProblems: options.relatedProblems ?? [],
    formalizationStatus: options.formalizationStatus ?? 'planned',
    activeRoute: options.activeRoute ?? null,
    routeBreakthrough: options.routeBreakthrough ?? false,
    problemSolved: options.problemSolved ?? false,
  });
  assertSeedAdmission(record, bundle, options);

  writeText(path.join(destinationDir, 'problem.yaml'), stringify(record));
  writeText(path.join(destinationDir, 'STATEMENT.md'), renderStatementMarkdown(problemId, record, bundle));
  writeText(path.join(destinationDir, 'REFERENCES.md'), renderReferencesMarkdown(record, bundle));
  writeText(path.join(destinationDir, 'EVIDENCE.md'), renderEvidenceMarkdown(problemId, record, bundle));
  writeText(path.join(destinationDir, 'FORMALIZATION.md'), renderFormalizationMarkdown(record));
  writeText(path.join(destinationDir, 'AGENT_START.md'), renderAgentStartMarkdown(problemId, record));
  writeText(path.join(destinationDir, 'ROUTES.md'), renderRoutesMarkdown(problemId, record));
  writeText(path.join(destinationDir, 'CHECKPOINT_NOTES.md'), renderCheckpointNotesMarkdown(problemId, record));
  writeText(
    path.join(destinationDir, 'PUBLIC_STATUS_REVIEW.md'),
    bundle.publicStatusReviewMarkdown
      ?? [
          '# Public Status Review',
          '',
          '- No live public search review markdown was present in the pull bundle.',
          '- Re-run the pull with a public search lane before widening any public-status claim.',
          '',
        ].join('\n'),
  );
  writeText(
    path.join(destinationDir, 'AGENT_WEBSEARCH_BRIEF.md'),
    bundle.agentWebsearchBrief
      ?? [
          '# Agent Websearch Brief',
          '',
          `- Problem: ${problemId}`,
          `- Site status at seed time: ${record.status.site_status}`,
          '- Run a fresh web search before treating the public status surface as settled.',
          '',
        ].join('\n'),
  );

  return {
    destinationDir,
    record,
    usedSiteSnapshot: Boolean(bundle.siteExtract || bundle.siteSummary),
    usedUpstreamRecord: Boolean(bundle.upstreamRecord),
    usedPublicStatusReview: Boolean(bundle.publicStatusReview || bundle.publicStatusReviewMarkdown),
    starterLoopArtifacts: STARTER_LOOP_ARTIFACTS,
  };
}

function renderReviewChecklist(problemId, bundle, destinationDir) {
  return [
    `# Problem ${problemId} Maintainer Review Checklist`,
    '',
    `- Pull bundle: ${bundle.pullDir}`,
    `- Proposed destination: ${destinationDir}`,
    '',
    '## Provenance',
    '',
    `- Imported record included: ${bundle.upstreamRecord ? 'yes' : 'no'}`,
    `- Site snapshot included: ${bundle.siteExtract || bundle.siteSummary ? 'yes' : 'no'}`,
    `- Public search review included: ${bundle.publicStatusReview || bundle.publicStatusReviewMarkdown ? 'yes' : 'no'}`,
    '',
    '## Review questions',
    '',
    '- Is the public site status clearly open right now?',
    '- Does the seeded short statement capture the actual mathematical focus cleanly?',
    '- Are the cluster and family tags honest?',
    '- Does the dossier need a deeper route starter before publication?',
    '- Should this problem remain dossier-depth or enter a family pack later?',
    '',
    '## Ready-to-promote checks',
    '',
    '- Statement reviewed',
    '- References reviewed',
    '- Evidence starter reviewed',
    '- Formalization starter reviewed',
    '- Public-status review read',
    '- Agent websearch brief read',
    '',
  ].join('\n');
}

export function reviewPullBundleForSeeding(problemId, options = {}) {
  const bundle = loadPullBundle(problemId, options.fromPullDir);
  const destinationRoot = path.resolve(options.destRoot ?? path.join(repoRoot, 'problems'));
  const destinationDir = path.join(destinationRoot, String(problemId));
  const reviewPath = path.resolve(options.dest ?? path.join(bundle.pullDir, 'REVIEW_CHECKLIST.md'));
  const title = deriveTitle(problemId, bundle, options.title);
  const shortStatement = deriveShortStatement(problemId, bundle, title);

  writeText(reviewPath, renderReviewChecklist(problemId, bundle, destinationDir));

  return {
    problemId: String(problemId),
    reviewPath,
    pullDir: bundle.pullDir,
    destinationDir,
    usedUpstreamRecord: Boolean(bundle.upstreamRecord),
    usedSiteSnapshot: Boolean(bundle.siteExtract || bundle.siteSummary),
    usedPublicStatusReview: Boolean(bundle.publicStatusReview || bundle.publicStatusReviewMarkdown),
    title,
    shortStatement,
  };
}
