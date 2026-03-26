import fs from 'node:fs';
import path from 'node:path';
import { stringify } from 'yaml';
import { ensureDir, fileExists, readJson, readText, writeText } from './files.js';
import { getProblemDir, getWorkspaceProblemPullDir, repoRoot } from './paths.js';

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

function deriveShortStatement(problemId, bundle, title) {
  const preview = Array.isArray(bundle.siteExtract?.previewLines)
    ? bundle.siteExtract.previewLines.find((line) => String(line ?? '').trim())
    : null;
  if (preview) {
    return String(preview).replace(/\s+/g, ' ').trim();
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
  const siteStatus = String(upstreamRecord.status?.state ?? bundle.problemRecord?.siteStatus ?? 'unknown').trim();
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
    upstream: {
      repo: 'https://github.com/teorth/erdosproblems',
      data_file: 'data/problems.yaml',
      number: String(problemId),
    },
    provenance: {
      seeded_at: new Date().toISOString(),
      seeded_from: {
        kind: 'pull_bundle',
        upstream_record_included: Boolean(bundle.upstreamRecord),
        site_snapshot_included: Boolean(bundle.siteExtract || bundle.siteSummary),
      },
    },
    status: {
      site_status: siteStatus,
      site_badge: uppercaseBadge(siteStatus),
      repo_status: options.repoStatus,
      upstream_status: upstreamRecord.status?.state ?? null,
      upstream_last_update: upstreamRecord.status?.last_update ?? null,
    },
    cluster: options.cluster,
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
      upstream_state: upstreamRecord.formalized?.state ?? 'unknown',
      upstream_last_update: upstreamRecord.formalized?.last_update ?? null,
    },
  };

  if (researchState) {
    record.research_state = researchState;
  }

  return record;
}

function renderStatementMarkdown(problemId, record, bundle) {
  const previewLines = Array.isArray(bundle.siteExtract?.previewLines)
    ? bundle.siteExtract.previewLines.filter((line) => String(line ?? '').trim())
    : [];

  return [
    `# Problem ${problemId} Statement`,
    '',
    `Source: <${record.source.url}>`,
    '',
    'Normalized focus:',
    `- ${record.statement.short}`,
    previewLines.length > 0 ? '- Seeded with preview lines from the public site snapshot' : '- Seeded from upstream public metadata',
    '',
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
    '- Upstream structured data:',
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
    `- Upstream record included: ${bundle.upstreamRecord ? 'yes' : 'no'}`,
    `- Site snapshot included: ${bundle.siteExtract || bundle.siteSummary ? 'yes' : 'no'}`,
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
    `- Upstream formalized state: ${record.formalization.upstream_state}`,
    `- Upstream formalized last update: ${record.formalization.upstream_last_update ?? '(unknown)'}`,
    '',
    'Seed note:',
    '- this file was created automatically from a pull bundle and should be upgraded as local formal work begins.',
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
    cluster: options.cluster ?? 'uncategorized',
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

  writeText(path.join(destinationDir, 'problem.yaml'), stringify(record));
  writeText(path.join(destinationDir, 'STATEMENT.md'), renderStatementMarkdown(problemId, record, bundle));
  writeText(path.join(destinationDir, 'REFERENCES.md'), renderReferencesMarkdown(record, bundle));
  writeText(path.join(destinationDir, 'EVIDENCE.md'), renderEvidenceMarkdown(problemId, record, bundle));
  writeText(path.join(destinationDir, 'FORMALIZATION.md'), renderFormalizationMarkdown(record));

  return {
    destinationDir,
    record,
    usedSiteSnapshot: Boolean(bundle.siteExtract || bundle.siteSummary),
    usedUpstreamRecord: Boolean(bundle.upstreamRecord),
  };
}
