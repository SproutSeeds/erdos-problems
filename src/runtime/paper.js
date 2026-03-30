import fs from 'node:fs';
import path from 'node:path';
import { getProblem } from '../atlas/catalog.js';
import { fileExists, readJson, writeJson, writeText } from './files.js';
import { getProblemArtifactInventory } from './problem-artifacts.js';
import {
  getRepoAnalysisDir,
  getRepoPaperDir,
  getRepoProblemPaperDir,
  getWorkspaceProblemPaperDir,
  getWorkspaceRoot,
  repoRoot,
} from './paths.js';

const CANONICAL_REPO_URL = 'https://github.com/SproutSeeds/erdos-problems';
const BUNDLE_VERSION = 1;

const SECTION_SPECS = [
  {
    key: 'abstract',
    fileName: 'ABSTRACT.md',
    title: 'Abstract',
    purpose: 'State the exact scope of the paper and separate proved statements from targets or heuristics.',
    inputLabels: ['STATEMENT.md', 'EVIDENCE.md', 'FRONTIER_NOTE.md'],
    guardrails: [
      'Open with the exact problem framing and current status.',
      'Do not imply a full proof unless the public record supports it.',
      'If the route is incomplete, describe this as progress, structure, or a route note.',
    ],
  },
  {
    key: 'introduction',
    fileName: 'INTRODUCTION.md',
    title: 'Introduction',
    purpose: 'Explain why the problem matters, what the current route is, and how the paper is organized.',
    inputLabels: ['STATEMENT.md', 'REFERENCES.md', 'FRONTIER_NOTE.md', 'PACK_CONTEXT.md'],
    guardrails: [
      'Ground motivation in public sources and cited literature.',
      'Explain the active route without overselling its maturity.',
      'State the paper organization at the end of the section.',
    ],
  },
  {
    key: 'preliminaries',
    fileName: 'PRELIMINARIES.md',
    title: 'Preliminaries',
    purpose: 'Define notation, setup, and prior results that the rest of the paper relies on.',
    inputLabels: ['STATEMENT.md', 'REFERENCES.md', 'FORMALIZATION.md'],
    guardrails: [
      'Define every symbol before it is used in a claim.',
      'Cite prior results rather than paraphrasing them from memory.',
      'Keep imported facts distinct from new statements in this repo.',
    ],
  },
  {
    key: 'related_work',
    fileName: 'RELATED_WORK.md',
    title: 'Related Work',
    purpose: 'Place the current route in the context of prior literature and nearby approaches.',
    inputLabels: ['REFERENCES.md', 'EVIDENCE.md', 'FRONTIER_NOTE.md'],
    guardrails: [
      'Each literature claim should have a ledger entry in CITATION_LEDGER.md.',
      'Describe competing or historical approaches fairly and briefly.',
      'Mark unresolved comparisons as open rather than implied.',
    ],
  },
  {
    key: 'main_results',
    fileName: 'MAIN_RESULTS.md',
    title: 'Main Results',
    purpose: 'List the exact theorems, propositions, or route claims supported by the current public record.',
    inputLabels: ['EVIDENCE.md', 'FORMALIZATION.md', 'FRONTIER_NOTE.md'],
    guardrails: [
      'Separate proved results, conditional results, heuristics, and targets.',
      'Use theorem language only for claims backed by the current public record.',
      'When in doubt, downgrade to a route claim or open objective.',
    ],
  },
  {
    key: 'proof_overview',
    fileName: 'PROOF_OVERVIEW.md',
    title: 'Proof Overview',
    purpose: 'Give the roadmap of the argument and the dependency chain between major steps.',
    inputLabels: ['EVIDENCE.md', 'ATOMIC_BOARD.md', 'FRONTIER_NOTE.md'],
    guardrails: [
      'Explain the dependency chain before entering technical details.',
      'Call out any open seam, blocked lemma, or incomplete dependency explicitly.',
      'Keep route state and proved state separate.',
    ],
  },
  {
    key: 'proof_details',
    fileName: 'PROOF_DETAILS.md',
    title: 'Proof Details',
    purpose: 'Write the technical proof content or the best current public decomposition when the proof is incomplete.',
    inputLabels: ['EVIDENCE.md', 'ATOMIC_BOARD.md', 'ROUTE_PACKET.yaml'],
    guardrails: [
      'Do not skip unresolved steps by rhetorical compression.',
      'If a subclaim is computational or formal, point to the exact public evidence packet.',
      'Use local labels for lemmas and keep missing subproofs visible.',
    ],
  },
  {
    key: 'computational_and_formal_evidence',
    fileName: 'COMPUTATIONAL_AND_FORMAL_EVIDENCE.md',
    title: 'Computational and Formal Evidence',
    purpose: 'Summarize computational packets, certificates, and formalization posture without inflating them into stronger claims.',
    inputLabels: ['FORMALIZATION.md'],
    includeAllComputePackets: true,
    guardrails: [
      'State what was checked, what was not checked, and what level of confidence the computation supports.',
      'Keep verification surface, compute surface, and proof surface distinct.',
      'If no formal artifact is public yet, say so directly.',
    ],
  },
  {
    key: 'limitations_and_open_problems',
    fileName: 'LIMITATIONS_AND_OPEN_PROBLEMS.md',
    title: 'Limitations and Open Problems',
    purpose: 'Leave a clean handoff for the next researcher with honest boundaries and unresolved tasks.',
    inputLabels: ['FRONTIER_NOTE.md', 'ATOMIC_BOARD.md', 'CHECKPOINT_NOTES.md'],
    guardrails: [
      'List the current bottlenecks plainly.',
      'Separate near-term route tasks from broader mathematical open problems.',
      'Do not hide failure modes or uncertainty.',
    ],
  },
];

function toPosixPath(value) {
  return String(value).split(path.sep).join('/');
}

function getRepoRelativePath(targetPath) {
  if (!targetPath) {
    return null;
  }
  const relative = path.relative(repoRoot, path.resolve(targetPath));
  if (relative === '') {
    return '.';
  }
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }
  return toPosixPath(relative);
}

function isInsideRepo(targetPath) {
  return Boolean(getRepoRelativePath(targetPath));
}

function isWithinCanonicalRepo(workspaceRoot = getWorkspaceRoot()) {
  return isInsideRepo(workspaceRoot);
}

function serializePublicPath(targetPath) {
  const repoRelativePath = getRepoRelativePath(targetPath);
  if (repoRelativePath) {
    return {
      scope: 'repo',
      path: repoRelativePath,
    };
  }
  return {
    scope: 'local_omitted',
    path: null,
    note: 'Local-only path omitted to keep the paper bundle public-safe.',
  };
}

function serializeArtifactEntry(artifact, kind) {
  const publicPath = serializePublicPath(artifact.path);
  return {
    label: artifact.label,
    kind,
    scope: publicPath.scope,
    path: publicPath.path,
    note: publicPath.note ?? null,
    exists: artifact.exists,
    status: artifact.status ?? null,
    claimLevelGoal: artifact.claimLevelGoal ?? null,
  };
}

function maybeRepoDirectory(label, targetPath, purpose) {
  if (!fs.existsSync(targetPath)) {
    return null;
  }
  const publicPath = serializePublicPath(targetPath);
  return {
    label,
    purpose,
    scope: publicPath.scope,
    path: publicPath.path,
    note: publicPath.note ?? null,
  };
}

function listRepoBundlePointers(problemId) {
  const pointers = [
    maybeRepoDirectory('paper_root', getRepoPaperDir(), 'Repo-only paper workspace root'),
    maybeRepoDirectory('problem_research_bundle', path.join(repoRoot, 'research', 'problems', String(problemId)), 'Deeper public problem research bundle'),
    maybeRepoDirectory('formal_lean_root', path.join(repoRoot, 'formal', 'lean'), 'Repo-local Lean and formalization root'),
    maybeRepoDirectory('analysis_problem_flat', path.join(getRepoAnalysisDir(), `problem${problemId}`), 'Problem-specific analysis bundle'),
    maybeRepoDirectory('analysis_problem_nested', path.join(getRepoAnalysisDir(), 'problems', String(problemId)), 'Nested problem analysis bundle'),
  ];

  return pointers.filter(Boolean);
}

function buildEvidenceLookup(inventory) {
  const entries = [
    ...inventory.canonicalArtifacts,
    ...inventory.starterArtifacts,
    ...inventory.packProblemArtifacts,
    ...inventory.computePackets,
  ];

  if (inventory.packContext) {
    entries.push(inventory.packContext);
  }

  const lookup = new Map();
  for (const entry of entries) {
    const repoRelativePath = getRepoRelativePath(entry.path);
    if (repoRelativePath) {
      lookup.set(entry.label, repoRelativePath);
    }
  }
  return lookup;
}

function getSectionInputs(spec, evidenceLookup, inventory) {
  const inputs = [];

  for (const label of spec.inputLabels ?? []) {
    const repoRelativePath = evidenceLookup.get(label);
    if (repoRelativePath) {
      inputs.push(repoRelativePath);
    }
  }

  if (spec.includeAllComputePackets) {
    for (const packet of inventory.computePackets) {
      const repoRelativePath = evidenceLookup.get(packet.label);
      if (repoRelativePath && !inputs.includes(repoRelativePath)) {
        inputs.push(repoRelativePath);
      }
    }
  }

  return inputs;
}

function buildSuggestedReadingOrder(problem, inventory, evidenceLookup, repoBundlePointers) {
  const entries = [];

  function pushReading(label, why) {
    const repoRelativePath = evidenceLookup.get(label);
    if (!repoRelativePath) {
      return;
    }
    entries.push({
      label,
      path: repoRelativePath,
      why,
    });
  }

  pushReading('problem.yaml', 'Canonical problem record and current public metadata.');
  pushReading('STATEMENT.md', 'Shortest clean statement of the problem.');
  pushReading('REFERENCES.md', 'Reference ledger and public literature trail.');
  pushReading('EVIDENCE.md', 'Current evidence posture and public route notes.');
  pushReading('FORMALIZATION.md', 'Formalization posture and proof assistant boundary.');
  pushReading('PACK_CONTEXT.md', 'Family-level framing when the problem lives in a deeper pack.');
  pushReading('FRONTIER_NOTE.md', 'Current frontier and next honest move.');
  pushReading('ATOMIC_BOARD.md', 'Operational dependency graph for the active route.');
  pushReading('CHECKPOINT_NOTES.md', 'Handoff shelf and recent checkpoint posture.');

  for (const packet of inventory.computePackets) {
    const repoRelativePath = evidenceLookup.get(packet.label);
    if (!repoRelativePath) {
      continue;
    }
    entries.push({
      label: packet.label,
      path: repoRelativePath,
      why: 'Computational or certification packet relevant to proof and verification scope.',
    });
  }

  for (const pointer of repoBundlePointers) {
    if (!pointer.path) {
      continue;
    }
    entries.push({
      label: pointer.label,
      path: pointer.path,
      why: pointer.purpose,
    });
  }

  return entries;
}

function buildSectionIndex(problem, inventory, evidenceLookup) {
  return {
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    sections: SECTION_SPECS.map((spec) => ({
      key: spec.key,
      fileName: spec.fileName,
      title: spec.title,
      purpose: spec.purpose,
      primaryInputs: getSectionInputs(spec, evidenceLookup, inventory),
    })),
  };
}

function buildPublicEvidenceIndex(problem, inventory, evidenceLookup, repoBundlePointers) {
  return {
    generatedAt: new Date().toISOString(),
    problemId: problem.problemId,
    title: problem.title,
    sourceUrl: problem.sourceUrl,
    canonicalRepo: CANONICAL_REPO_URL,
    externalSource: problem.externalSource ?? null,
    researchState: problem.researchState ?? null,
    canonicalArtifacts: inventory.canonicalArtifacts.map((artifact) => serializeArtifactEntry(artifact, 'canonical_dossier')),
    starterArtifacts: inventory.starterArtifacts.map((artifact) => serializeArtifactEntry(artifact, 'starter_loop')),
    packContext: inventory.packContext ? serializeArtifactEntry(inventory.packContext, 'pack_context') : null,
    packProblemArtifacts: inventory.packProblemArtifacts.map((artifact) => serializeArtifactEntry(artifact, 'pack_problem')),
    computePackets: inventory.computePackets.map((packet) => serializeArtifactEntry(packet, 'compute_packet')),
    repoBundlePointers,
    suggestedReadingOrder: buildSuggestedReadingOrder(problem, inventory, evidenceLookup, repoBundlePointers),
  };
}

function buildManifest(problem, inventory, bundleDir, previousManifest) {
  const evidenceLookup = buildEvidenceLookup(inventory);
  const repoBundlePointers = listRepoBundlePointers(problem.problemId);
  const publicEvidenceIndex = buildPublicEvidenceIndex(problem, inventory, evidenceLookup, repoBundlePointers);
  const sectionIndex = buildSectionIndex(problem, inventory, evidenceLookup);
  const bundlePublicPath = serializePublicPath(bundleDir);
  const packProblemDir = problem.cluster ? path.join(repoRoot, 'packs', problem.cluster, 'problems', problem.problemId) : null;

  const manifest = {
    bundleVersion: BUNDLE_VERSION,
    createdAt: previousManifest?.createdAt ?? new Date().toISOString(),
    lastInitializedAt: new Date().toISOString(),
    canonicalRepo: CANONICAL_REPO_URL,
    problem: {
      problemId: problem.problemId,
      displayName: problem.displayName,
      title: problem.title,
      cluster: problem.cluster,
      sourceUrl: problem.sourceUrl,
      siteStatus: problem.siteStatus,
      repoStatus: problem.repoStatus,
      harnessDepth: problem.harnessDepth,
      formalizationStatus: problem.formalizationStatus,
      sourceKind: problem.sourceKind,
      activeRoute: problem.researchState?.active_route ?? null,
      routeBreakthrough: problem.researchState?.route_breakthrough ?? false,
      problemSolved: problem.researchState?.problem_solved ?? false,
      openProblem: problem.researchState?.open_problem ?? null,
    },
    paperMode: problem.researchState?.problem_solved
      ? 'proof_or_archive_paper'
      : 'claim_safe_progress_or_route_paper',
    bundlePath: bundlePublicPath.path,
    bundlePathScope: bundlePublicPath.scope,
    bundlePathNote: bundlePublicPath.note ?? null,
    canonicalPaths: {
      problemDir: serializePublicPath(problem.problemDir),
      packProblemDir: serializePublicPath(packProblemDir),
      paperDir: serializePublicPath(getRepoPaperDir()),
    },
    publicEvidenceSummary: {
      canonicalArtifacts: inventory.canonicalArtifacts.length,
      starterArtifacts: inventory.starterArtifacts.length,
      packProblemArtifacts: inventory.packProblemArtifacts.length,
      computePackets: inventory.computePackets.length,
      importedRecordIncluded: inventory.upstreamRecordIncluded,
    },
    externalProvenance: problem.externalSource ?? null,
    policy: {
      privacy: [
        'Do not include secrets, credentials, tokens, or unpublished private correspondence.',
        'Do not serialize local absolute filesystem paths into committed paper artifacts.',
        'Treat only repo-public material and explicitly cited public sources as publication inputs.',
      ],
      claimSafety: [
        'Use theorem-style language only for claims supported by the current public record.',
        'Mark heuristics, computational evidence, and route targets with their true status.',
        'Leave unresolved seams visible instead of smoothing them over in prose.',
      ],
      citationDiscipline: [
        'Every external mathematical claim should have a row in CITATION_LEDGER.md before it lands in prose.',
        'Imported external atlases are provenance inputs, not canonical authority.',
        'Prefer exact URLs, paper identifiers, theorem labels, and publication metadata when available.',
      ],
    },
    publicEvidenceIndexFile: 'PUBLIC_EVIDENCE_INDEX.json',
    sectionIndexFile: 'SECTION_INDEX.json',
  };

  return {
    manifest,
    publicEvidenceIndex,
    sectionIndex,
  };
}

function renderBundleReadme(problem, manifest) {
  return [
    `# ${problem.displayName} Paper Bundle`,
    '',
    `This bundle is the public-safe paper workspace for **${problem.title}**.`,
    '',
    'Use it to start a new paper from scratch or resume an existing draft without overwriting your section files.',
    '',
    'Start here:',
    '- `WRITER_BRIEF.md` for the agent-safe workflow',
    '- `MANIFEST.json` for machine-readable problem status and public bundle metadata',
    '- `PUBLIC_EVIDENCE_INDEX.json` for the exact public inputs available today',
    '- `SECTION_STATUS.md` for the writing queue and handoff state',
    '- `PRIVACY_REVIEW.md` before anything public is released',
    '',
    'Current posture:',
    `- paper mode: ${manifest.paperMode}`,
    `- active route: ${problem.researchState?.active_route ?? '(none)'}`,
    `- open problem: ${problem.researchState?.open_problem ? 'yes' : 'no'}`,
    `- problem solved: ${problem.researchState?.problem_solved ? 'yes' : 'no'}`,
    '',
  ].join('\n');
}

function renderWriterBrief(problem, sectionIndex, manifest) {
  return [
    `# ${problem.displayName} Writer Brief`,
    '',
    'Mission:',
    `- turn the current public record for **${problem.title}** into a paper draft that is readable, citation-safe, and claim-safe`,
    '- preserve privacy boundaries while making the paper bundle easy for agents and future researchers to extend',
    '',
    'Hard rules:',
    '- do not include secrets, tokens, private messages, unpublished private notes, or local absolute paths',
    '- treat only the canonical repo record and explicitly cited public sources as publication inputs',
    '- cite every nontrivial external claim in `CITATION_LEDGER.md` before relying on it in prose',
    '- distinguish rigorously between theorem/proposition, conjecture, heuristic, and computational evidence',
    '- leave open seams visible and move them into `LIMITATIONS_AND_OPEN_PROBLEMS.md` instead of hiding them',
    '',
    'Recommended loop:',
    '1. Read `MANIFEST.json` and `PUBLIC_EVIDENCE_INDEX.json`.',
    '2. Read the suggested inputs in `SECTION_INDEX.json`.',
    '3. Update `OUTLINE.md` and `SECTION_STATUS.md` before drafting.',
    '4. Add external literature rows to `CITATION_LEDGER.md` as soon as a source enters the draft.',
    '5. Write or refine section files one at a time.',
    '6. Run the checklist in `PRIVACY_REVIEW.md` before public release or PR submission.',
    '',
    'Current public status:',
    `- paper mode: ${manifest.paperMode}`,
    `- site status: ${problem.siteStatus}`,
    `- repo status: ${problem.repoStatus}`,
    `- active route: ${problem.researchState?.active_route ?? '(none)'}`,
    `- imported record included: ${manifest.publicEvidenceSummary.importedRecordIncluded ? 'yes' : 'no'}`,
    '',
    'Section files in this bundle:',
    ...sectionIndex.sections.map((section) => `- ${section.fileName}: ${section.purpose}`),
    '',
  ].join('\n');
}

function renderSectionStatus(sectionIndex) {
  const rows = [
    '# Section Status',
    '',
    '| Section | Status | Primary public inputs | Notes |',
    '| --- | --- | --- | --- |',
  ];

  for (const section of sectionIndex.sections) {
    const inputs = section.primaryInputs.length > 0
      ? section.primaryInputs.join('<br>')
      : '(add public inputs)';
    rows.push(`| ${section.title} | not started | ${inputs} | Keep claims honest and source-backed. |`);
  }

  return rows.join('\n') + '\n';
}

function renderOutline(problem) {
  const paperShape = problem.researchState?.problem_solved
    ? 'proof/archive paper'
    : 'claim-safe progress paper or route paper';

  return [
    '# Outline',
    '',
    `Working paper shape: ${paperShape}`,
    '',
    'Recommended order:',
    '1. Abstract',
    '2. Introduction',
    '3. Preliminaries',
    '4. Related Work',
    '5. Main Results',
    '6. Proof Overview',
    '7. Proof Details',
    '8. Computational and Formal Evidence',
    '9. Limitations and Open Problems',
    '',
    'Angle:',
    `- problem: ${problem.displayName}`,
    `- active route: ${problem.researchState?.active_route ?? '(none)'}`,
    `- open problem: ${problem.researchState?.open_problem ? 'yes' : 'no'}`,
    '- rewrite this outline once the paper scope is fixed',
    '',
  ].join('\n');
}

function renderStyleGuide(problem) {
  return [
    '# Style Guide',
    '',
    'Claim-safe language:',
    '- use "we prove" only when the proof is fully present in the public record',
    '- use "we outline", "we propose", or "we isolate" for route structure that is not yet proved',
    '- use "computational evidence suggests" for search- or certificate-based support',
    '- use "the current public route leaves open" when a dependency chain is incomplete',
    '',
    'Citation discipline:',
    '- every external theorem, definition, or historical claim should be traceable through `CITATION_LEDGER.md`',
    '- prefer exact theorem labels, page references, DOIs, arXiv IDs, or URLs over vague mentions',
    '- imported atlas metadata should be described as provenance, not as final authority',
    '',
    'Public truth posture:',
    `- this bundle is for ${problem.researchState?.problem_solved ? 'proof/archive exposition' : 'progress writing without status inflation'}`,
    '- if the route is incomplete, say exactly which seam remains open',
    '- conclude with a handoff that makes the next research move easy to see',
    '',
  ].join('\n');
}

function renderPrivacyReview(problem) {
  return [
    '# Privacy Review',
    '',
    'Do not publish until each item below has been checked:',
    '',
    '- [ ] No secrets, credentials, tokens, or access links appear anywhere in this bundle.',
    '- [ ] No absolute local filesystem paths appear anywhere in this bundle.',
    '- [ ] No private correspondence, direct messages, or unpublished private notes are quoted or paraphrased.',
    '- [ ] Every external mathematical claim has a matching row in `CITATION_LEDGER.md`.',
    '- [ ] Every statement described as proved is backed by the current public record.',
    '- [ ] Open seams, missing lemmas, and uncertainty are explicitly recorded in `LIMITATIONS_AND_OPEN_PROBLEMS.md`.',
    '- [ ] The final abstract and introduction do not oversell the current status of the problem.',
    '',
    'Review block:',
    `- problem: ${problem.displayName}`,
    '- reviewer: ',
    '- date: ',
    '- release scope: ',
    '',
  ].join('\n');
}

function renderCitationLedger(problem) {
  const rows = [
    '# Citation Ledger',
    '',
    '| Source | Kind | Used For | Status | Notes |',
    '| --- | --- | --- | --- | --- |',
    `| ${problem.sourceUrl} | source page | statement, status, public framing | seeded | Canonical public problem source page. |`,
  ];

  if (problem.externalSource?.repo) {
    rows.push(`| ${problem.externalSource.repo} | external import atlas | imported provenance | seeded | Comparison and provenance only; not canonical authority. |`);
  }

  rows.push('| (add source) | paper / book / note / dataset | theorem, history, comparison, or method | pending | Add exact identifiers before using in prose. |');
  return rows.join('\n') + '\n';
}

function renderSectionFile(problem, section, inputs) {
  return [
    `# ${section.title}`,
    '',
    `Problem: ${problem.displayName} — ${problem.title}`,
    `Section role: ${section.purpose}`,
    '',
    'Primary public inputs:',
    ...(inputs.length > 0
      ? inputs.map((input) => `- ${input}`)
      : ['- (add repo-public inputs here before drafting)']),
    '',
    'Writing guardrails:',
    ...section.guardrails.map((guardrail) => `- ${guardrail}`),
    '',
    'Draft:',
    '',
    '> Start writing here. Keep every claim matched to public evidence or clearly labeled as conjectural, heuristic, or computational.',
    '',
  ].join('\n');
}

function writeIfMissing(targetPath, text, createdFiles, preservedFiles) {
  if (fileExists(targetPath)) {
    preservedFiles.push(path.basename(targetPath));
    return;
  }
  writeText(targetPath, text);
  createdFiles.push(path.basename(targetPath));
}

export function resolvePaperBundleDir(problemId, options = {}) {
  const workspaceRoot = options.workspaceRoot ?? getWorkspaceRoot();
  if (options.destination) {
    return path.resolve(options.destination);
  }
  if (isWithinCanonicalRepo(workspaceRoot) && fs.existsSync(getRepoPaperDir())) {
    return getRepoProblemPaperDir(problemId);
  }
  return getWorkspaceProblemPaperDir(problemId, workspaceRoot);
}

export function initPaperBundle(problemId, options = {}) {
  const workspaceRoot = options.workspaceRoot ?? getWorkspaceRoot();
  const problem = getProblem(problemId, workspaceRoot);
  if (!problem) {
    throw new Error(`Unknown problem: ${problemId}`);
  }

  const bundleDir = resolvePaperBundleDir(problem.problemId, options);
  fs.mkdirSync(bundleDir, { recursive: true });

  const inventory = getProblemArtifactInventory(problem);
  const manifestPath = path.join(bundleDir, 'MANIFEST.json');
  const previousManifest = fileExists(manifestPath) ? readJson(manifestPath) : null;
  const { manifest, publicEvidenceIndex, sectionIndex } = buildManifest(problem, inventory, bundleDir, previousManifest);

  const bundlePreviouslyInitialized = previousManifest !== null || fs.readdirSync(bundleDir).length > 0;
  const createdFiles = [];
  const preservedFiles = [];
  const updatedFiles = [];

  writeJson(manifestPath, manifest);
  updatedFiles.push('MANIFEST.json');

  writeJson(path.join(bundleDir, 'PUBLIC_EVIDENCE_INDEX.json'), publicEvidenceIndex);
  updatedFiles.push('PUBLIC_EVIDENCE_INDEX.json');

  writeJson(path.join(bundleDir, 'SECTION_INDEX.json'), sectionIndex);
  updatedFiles.push('SECTION_INDEX.json');

  writeIfMissing(path.join(bundleDir, 'README.md'), renderBundleReadme(problem, manifest), createdFiles, preservedFiles);
  writeIfMissing(path.join(bundleDir, 'WRITER_BRIEF.md'), renderWriterBrief(problem, sectionIndex, manifest), createdFiles, preservedFiles);
  writeIfMissing(path.join(bundleDir, 'SECTION_STATUS.md'), renderSectionStatus(sectionIndex), createdFiles, preservedFiles);
  writeIfMissing(path.join(bundleDir, 'OUTLINE.md'), renderOutline(problem), createdFiles, preservedFiles);
  writeIfMissing(path.join(bundleDir, 'STYLE_GUIDE.md'), renderStyleGuide(problem), createdFiles, preservedFiles);
  writeIfMissing(path.join(bundleDir, 'PRIVACY_REVIEW.md'), renderPrivacyReview(problem), createdFiles, preservedFiles);
  writeIfMissing(path.join(bundleDir, 'CITATION_LEDGER.md'), renderCitationLedger(problem), createdFiles, preservedFiles);

  for (const section of SECTION_SPECS) {
    const inputs = sectionIndex.sections.find((candidate) => candidate.fileName === section.fileName)?.primaryInputs ?? [];
    writeIfMissing(path.join(bundleDir, section.fileName), renderSectionFile(problem, section, inputs), createdFiles, preservedFiles);
  }

  return {
    problemId: problem.problemId,
    title: problem.title,
    bundleDir,
    bundlePublicPath: manifest.bundlePath,
    mode: bundlePreviouslyInitialized ? 'resumed' : 'initialized',
    createdFiles,
    preservedFiles,
    updatedFiles,
    manifest,
    publicEvidenceIndex,
    sectionIndex,
  };
}

export function getPaperBundleOverview(problemId, options = {}) {
  const workspaceRoot = options.workspaceRoot ?? getWorkspaceRoot();
  const effectiveProblemId = problemId ?? null;
  const bundleDir = resolvePaperBundleDir(effectiveProblemId, options);
  const manifestPath = path.join(bundleDir, 'MANIFEST.json');
  if (!fileExists(manifestPath)) {
    throw new Error(`Paper bundle not initialized: ${bundleDir}`);
  }

  const manifest = readJson(manifestPath);
  const sectionIndexPath = path.join(bundleDir, 'SECTION_INDEX.json');
  const sectionIndex = fileExists(sectionIndexPath) ? readJson(sectionIndexPath) : { sections: [] };

  return {
    problemId: manifest.problem.problemId,
    title: manifest.problem.title,
    bundleDir,
    bundlePublicPath: manifest.bundlePath,
    paperMode: manifest.paperMode,
    createdAt: manifest.createdAt,
    lastInitializedAt: manifest.lastInitializedAt,
    publicEvidenceSummary: manifest.publicEvidenceSummary,
    paths: {
      manifest: 'MANIFEST.json',
      writerBrief: 'WRITER_BRIEF.md',
      sectionStatus: 'SECTION_STATUS.md',
      evidenceIndex: 'PUBLIC_EVIDENCE_INDEX.json',
      privacyReview: 'PRIVACY_REVIEW.md',
      citationLedger: 'CITATION_LEDGER.md',
    },
    sections: sectionIndex.sections.map((section) => ({
      ...section,
      exists: fileExists(path.join(bundleDir, section.fileName)),
    })),
  };
}
