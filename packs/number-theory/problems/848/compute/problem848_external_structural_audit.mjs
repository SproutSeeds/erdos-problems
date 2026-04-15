#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

function parseArgs(argv) {
  const args = {
    sourceDir: process.env.P848_EXTERNAL_SOURCE_DIR ?? '/tmp/hjyuh-erdos-848',
    jsonOutput: null,
    markdownOutput: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--source-dir') {
      args.sourceDir = argv[++index];
    } else if (token === '--json-output') {
      args.jsonOutput = argv[++index];
    } else if (token === '--markdown-output') {
      args.markdownOutput = argv[++index];
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  return args;
}

function walkFiles(rootDir) {
  const files = [];
  const stack = [rootDir];
  while (stack.length > 0) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === '.git' || entry.name === 'node_modules') {
        continue;
      }
      const entryPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(entryPath);
      } else if (entry.isFile()) {
        files.push(entryPath);
      }
    }
  }
  return files.sort();
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function relativePath(rootDir, filePath) {
  return path.relative(rootDir, filePath).replaceAll(path.sep, '/');
}

function findLineHits(rootDir, filePath, patterns) {
  const lines = readText(filePath).split(/\r?\n/);
  const hits = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (patterns.some((pattern) => pattern.test(line))) {
      hits.push({
        file: relativePath(rootDir, filePath),
        line: index + 1,
        text: line.trim().slice(0, 240),
      });
    }
  }
  return hits;
}

function hasAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function buildCheck({ checkId, status, severity, summary, evidence = [], recommendation }) {
  return {
    checkId,
    status,
    severity,
    summary,
    evidence,
    recommendation,
  };
}

function analyzeSource(sourceDir) {
  const sourceRoot = path.resolve(sourceDir);
  const sourceExists = fs.existsSync(sourceRoot) && fs.statSync(sourceRoot).isDirectory();
  if (!sourceExists) {
    return {
      schema: 'erdos.number_theory.p848_external_structural_verifier_audit/1',
      generatedAt: new Date().toISOString(),
      problemId: '848',
      sourceDir: sourceRoot,
      sourceAvailable: false,
      status: 'source_unavailable',
      conclusion: 'No external verifier source tree was available to audit.',
      summary: {
        sourceFileCount: 0,
        markdownFileCount: 0,
        cppFileCount: 0,
        blockerCount: 1,
        warningCount: 0,
        supportCount: 0,
      },
      checks: [
        buildCheck({
          checkId: 'external_source_tree_available',
          status: 'failed',
          severity: 'blocker',
          summary: `Expected an external verifier source tree at ${sourceRoot}.`,
          recommendation: 'Clone or copy the external verifier source before trying to absorb its structural ideas.',
        }),
      ],
      nextActions: [
        'Provide an external verifier source tree, then rerun this audit.',
        'Do not promote external finite coverage unless the verifier source and certificate are both present.',
      ],
      honestyBoundary: 'This audit only evaluates structural import readiness. It does not certify the external computation or solve Problem 848.',
    };
  }

  const files = walkFiles(sourceRoot);
  const markdownFiles = files.filter((file) => /\.md$/i.test(file));
  const cppFiles = files.filter((file) => /\.(cc|cpp|cxx|hpp|h)$/i.test(file));
  const certificateFiles = files.filter((file) => /certificate.*\.(tsv|csv|json)$/i.test(file));
  const allMarkdownText = markdownFiles.map(readText).join('\n');
  const allCppText = cppFiles.map(readText).join('\n');

  const sawHandoffHits = markdownFiles.flatMap((file) => findLineHits(sourceRoot, file, [
    /Sawhney/i,
    /10\^7|10000000/i,
    /N\s*>\s*10/i,
  ])).filter((hit) => /Sawhney|10\^7|10000000|N\s*>\s*10/i.test(hit.text));
  const claimsTenMillionSawhneyHandoff = /Sawhney/i.test(allMarkdownText)
    && /(10\^7|10\^⁷|10000000|N\s*[>≥]\s*10)/i.test(allMarkdownText)
    && /(all positive integers|for all N|N\s*>\s*10\^?7|N\s*>\s*10000000)/i.test(allMarkdownText);

  const baseResidueBothPresent = hasAny(allCppText, [
    /r\s*==\s*7\s*\|\|\s*r\s*==\s*18/,
    /r\s*==\s*18\s*\|\|\s*r\s*==\s*7/,
  ]);
  const baseSevenMaskPresent = hasAny(allCppText, [
    /7LL\s*\*\s*x\s*\+\s*1/,
    /7\s*\+\s*25\s*\*\s*m/,
    /7LL\s*\+\s*25LL\s*\*/,
    /for\s*\([^)]*m[^)]*\)\s*[^;{]*7\s*\+\s*25/,
  ]);
  const baseEighteenMaskPresent = hasAny(allCppText, [
    /18LL\s*\*\s*x\s*\+\s*1/,
    /18\s*\+\s*25\s*\*\s*m/,
    /18LL\s*\+\s*25LL\s*\*/,
    /for\s*\([^)]*m[^)]*\)\s*[^;{]*18\s*\+\s*25/,
  ]);
  const baseMaskHits = cppFiles.flatMap((file) => findLineHits(sourceRoot, file, [
    /7LL\s*\*\s*x\s*\+\s*1/,
    /18LL\s*\*\s*x\s*\+\s*1/,
    /7LL\s*\+\s*25LL\s*\*/,
    /18LL\s*\+\s*25LL\s*\*/,
    /r\s*==\s*7\s*\|\|\s*r\s*==\s*18/,
  ]));

  const inequalityPresent = hasAny(allMarkdownText, [
    /s_max/i,
    /R_\{>p\}/,
    /outsider-clique/i,
    /Verification Inequality/i,
  ]);
  const breakpointClaimPresent = hasAny(allMarkdownText, [
    /breakpoints/i,
    /zero failures/i,
    /margin/i,
  ]);
  const cppVerifierPresent = cppFiles.some((file) => /848.*verifier|verifier.*848/i.test(relativePath(sourceRoot, file)));

  const checks = [
    buildCheck({
      checkId: 'external_source_tree_available',
      status: 'passed',
      severity: 'support',
      summary: `Audited ${files.length} files under ${sourceRoot}.`,
      evidence: [{ file: '.', line: null, text: sourceRoot }],
      recommendation: 'Keep this source tree pinned by URL and commit before any promotion.',
    }),
    buildCheck({
      checkId: 'sawhney_handoff_not_claimed_at_1e7',
      status: claimsTenMillionSawhneyHandoff ? 'failed' : 'passed',
      severity: claimsTenMillionSawhneyHandoff ? 'blocker' : 'support',
      summary: claimsTenMillionSawhneyHandoff
        ? 'The external writeup appears to claim that Sawhney handles N > 10^7.'
        : 'No direct Sawhney handoff at 10^7 was detected in the scanned markdown.',
      evidence: sawHandoffHits.slice(0, 12),
      recommendation: claimsTenMillionSawhneyHandoff
        ? 'Replace the 10^7 handoff with a repo-audited explicit threshold or mark the claim external-only.'
        : 'Keep scanning for threshold language whenever the external source changes.',
    }),
    buildCheck({
      checkId: 'base_exchange_mask_covers_both_principal_sides',
      status: baseSevenMaskPresent && !baseEighteenMaskPresent ? 'failed' : 'passed',
      severity: baseSevenMaskPresent && !baseEighteenMaskPresent ? 'blocker' : 'support',
      summary: baseSevenMaskPresent && !baseEighteenMaskPresent
        ? 'The verifier appears to build base-exchange masks for the 7 mod 25 side without a parallel 18 mod 25 mask.'
        : 'The scanned verifier did not expose a one-sided 7 mod 25 base-mask pattern.',
      evidence: baseMaskHits.slice(0, 12),
      recommendation: baseSevenMaskPresent && !baseEighteenMaskPresent
        ? 'Either add a separate 18 mod 25 mask audit, or supply a proof that the 7-side mask dominates the 18-side case for every outsider and N.'
        : 'If relying on symmetry rather than explicit masks, record the symmetry lemma next to the verifier certificate.',
    }),
    buildCheck({
      checkId: 'both_base_residues_are_excluded_from_outsider_pool',
      status: baseResidueBothPresent ? 'passed' : 'warning',
      severity: baseResidueBothPresent ? 'support' : 'warning',
      summary: baseResidueBothPresent
        ? 'The verifier source explicitly recognizes both 7 and 18 mod 25 as principal base residues.'
        : 'The scan did not find an explicit 7-or-18 base residue predicate.',
      evidence: baseMaskHits.filter((hit) => /r\s*==\s*7|r\s*==\s*18/.test(hit.text)).slice(0, 6),
      recommendation: 'Keep outsider-pool exclusion separate from base-exchange mask coverage; both are required for promotion.',
    }),
    buildCheck({
      checkId: 'outsider_clique_inequality_is_documented',
      status: inequalityPresent ? 'passed' : 'warning',
      severity: inequalityPresent ? 'support' : 'warning',
      summary: inequalityPresent
        ? 'The external writeup documents an outsider-clique style inequality.'
        : 'The scan did not find the outsider-clique inequality in markdown.',
      evidence: markdownFiles.flatMap((file) => findLineHits(sourceRoot, file, [/s_max/i, /R_\{>p\}/, /outsider-clique/i])).slice(0, 8),
      recommendation: 'Treat this as a structural idea source until the inequality is ported into repo-owned definitions and tests.',
    }),
    buildCheck({
      checkId: 'finite_certificate_surface_present',
      status: certificateFiles.length > 0 && breakpointClaimPresent && cppVerifierPresent ? 'passed' : 'warning',
      severity: certificateFiles.length > 0 && breakpointClaimPresent && cppVerifierPresent ? 'support' : 'warning',
      summary: certificateFiles.length > 0 && breakpointClaimPresent && cppVerifierPresent
        ? 'The source includes verifier code, certificate-like output, and breakpoint/margin claims.'
        : 'The scan did not find a complete verifier/certificate/writeup surface.',
      evidence: [
        ...certificateFiles.slice(0, 5).map((file) => ({ file: relativePath(sourceRoot, file), line: null, text: 'certificate-like artifact' })),
        ...cppFiles.filter((file) => /848.*verifier|verifier.*848/i.test(relativePath(sourceRoot, file))).slice(0, 5)
          .map((file) => ({ file: relativePath(sourceRoot, file), line: null, text: 'verifier source' })),
      ],
      recommendation: 'Require a repo-owned certificate schema before importing any interval coverage.',
    }),
  ];

  const blockerCount = checks.filter((check) => check.severity === 'blocker' && check.status === 'failed').length;
  const warningCount = checks.filter((check) => check.severity === 'warning').length;
  const supportCount = checks.filter((check) => check.severity === 'support' && check.status === 'passed').length;
  const status = blockerCount > 0 ? 'blocked' : warningCount > 0 ? 'needs_review' : 'passed_for_structural_reuse';

  return {
    schema: 'erdos.number_theory.p848_external_structural_verifier_audit/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    sourceDir: sourceRoot,
    sourceAvailable: true,
    status,
    conclusion: blockerCount > 0
      ? 'The external verifier is useful as an idea source, but it is blocked from canonical promotion.'
      : 'No blocker was detected by the structural import audit; this still does not certify the computation.',
    summary: {
      sourceFileCount: files.length,
      markdownFileCount: markdownFiles.length,
      cppFileCount: cppFiles.length,
      certificateLikeFileCount: certificateFiles.length,
      blockerCount,
      warningCount,
      supportCount,
      baseSevenMaskPresent,
      baseEighteenMaskPresent,
      baseResidueBothPresent,
      claimsTenMillionSawhneyHandoff,
    },
    checks,
    nextActions: blockerCount > 0
      ? [
        'Keep the external computation in EXTERNAL_VERIFICATION_LEDGER as blocked, not promoted.',
        'Patch or independently reimplement the structural verifier with both base sides covered.',
        'Replace the false 10^7 Sawhney handoff with a repo-audited explicit threshold before any all-N claim.',
        'Port only the outsider-clique inequality shape into a repo-owned structural verifier lane.',
      ]
      : [
        'Port the structural verifier into the repo-owned certificate spec.',
        'Run the verifier under reproducible CI or supervised local compute before promoting coverage.',
        'Keep the asymptotic threshold handoff separate from bounded finite certificates.',
      ],
    honestyBoundary: 'This audit only evaluates structural import readiness. It does not certify the external computation or solve Problem 848.',
  };
}

function renderMarkdown(packet) {
  const lines = [
    '# Problem 848 External Structural Verifier Audit',
    '',
    `- Generated: ${packet.generatedAt}`,
    `- Source dir: \`${packet.sourceDir}\``,
    `- Status: \`${packet.status}\``,
    `- Conclusion: ${packet.conclusion}`,
    '',
    '## Summary',
    '',
  ];

  for (const [key, value] of Object.entries(packet.summary ?? {})) {
    lines.push(`- ${key}: \`${value}\``);
  }

  lines.push('', '## Checks', '');
  for (const check of packet.checks ?? []) {
    lines.push(`- \`${check.checkId}\` [${check.status}/${check.severity}] ${check.summary}`);
    if (check.recommendation) {
      lines.push(`- Recommendation: ${check.recommendation}`);
    }
    for (const hit of check.evidence ?? []) {
      const lineLabel = hit.line ? `:${hit.line}` : '';
      lines.push(`- Evidence: \`${hit.file}${lineLabel}\` ${hit.text ?? ''}`);
    }
  }

  lines.push('', '## Next Actions', '');
  for (const action of packet.nextActions ?? []) {
    lines.push(`- ${action}`);
  }

  lines.push('', '## Boundary', '');
  lines.push(`- ${packet.honestyBoundary}`);
  lines.push('');
  return lines.join('\n');
}

const args = parseArgs(process.argv.slice(2));
const packet = analyzeSource(args.sourceDir);

if (args.jsonOutput) {
  fs.mkdirSync(path.dirname(args.jsonOutput), { recursive: true });
  fs.writeFileSync(args.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
}
if (args.markdownOutput) {
  fs.mkdirSync(path.dirname(args.markdownOutput), { recursive: true });
  fs.writeFileSync(args.markdownOutput, renderMarkdown(packet));
}

console.log(JSON.stringify({
  status: packet.status,
  blockerCount: packet.summary?.blockerCount ?? 0,
  warningCount: packet.summary?.warningCount ?? 0,
  sourceAvailable: packet.sourceAvailable,
}, null, 2));
