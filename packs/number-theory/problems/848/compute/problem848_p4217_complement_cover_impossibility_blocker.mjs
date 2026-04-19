#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');
const problemDir = path.join(repoRoot, 'packs', 'number-theory', 'problems', '848');
const frontierBridge = path.join(problemDir, 'SPLIT_ATOM_PACKETS', 'FRONTIER_BRIDGE');

const DEFAULT_RESIDUAL_PACKET = path.join(frontierBridge, 'P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_MOD50_WEDGE_BLOCKER_PACKET.json');
const DEFAULT_JSON_OUTPUT = path.join(frontierBridge, 'P848_P4217_COMPLEMENT_COVER_IMPOSSIBILITY_BLOCKER_PACKET.json');
const DEFAULT_MARKDOWN_OUTPUT = path.join(frontierBridge, 'P848_P4217_COMPLEMENT_COVER_IMPOSSIBILITY_BLOCKER_PACKET.md');

const TARGET = 'derive_p848_p4217_complement_cover_or_impossibility_from_all_n_residual';
const NEXT_ACTION = 'prepare_p848_p4217_complement_theorem_wedge_or_import_source_cover';
const STATUS = 'p4217_complement_cover_impossibility_blocker_emitted_no_local_cover_theorem';

const AUDITED_SOURCE_PACKETS = [
  {
    id: 'p4217_unavailable_complement_refinement',
    path: 'P848_P4217_UNAVAILABLE_COMPLEMENT_REFINEMENT_PACKET.json',
    usefulFact: 'Exact affine parameterization of all 17,781,949 p4217-unavailable residues.',
    gap: 'Parameterization is not a cover, impossibility proof, or decreasing rank.',
  },
  {
    id: 'p43_uniform_square_obstruction',
    path: 'P848_P4217_COMPLEMENT_P43_SQUARE_OBSTRUCTION_PACKET.json',
    usefulFact: 'The p43 fallback selector is globally killed by a uniform 2^2 obstruction.',
    gap: 'This eliminates one selector but leaves the whole complement open.',
  },
  {
    id: 'p61_availability_refinement',
    path: 'P848_P4217_COMPLEMENT_P61_AVAILABILITY_REFINEMENT_PACKET.json',
    usefulFact: 'The complement splits exactly into p61-available and p61-unavailable CRT classes.',
    gap: 'Both sides remain open: available classes need squarefree hitting/obstruction closure; unavailable classes need another selector or theorem.',
  },
  {
    id: 'p61_q101_first_child_obstruction',
    path: 'P848_P4217_COMPLEMENT_P61_Q101_SQUARE_OBSTRUCTION_PACKET.json',
    usefulFact: 'The first p61-available child has an exact q101 square-obstruction subfamily.',
    gap: 'A first child obstruction is not a cover of all p61-available classes or the p61-unavailable complement.',
  },
  {
    id: 'p479_available_residue_bulk_cover',
    path: 'P848_P4217_P443_Q97_P479_AVAILABLE_RESIDUE_BULK_COVER_PACKET.json',
    usefulFact: 'A finite p479-available residue set is batch-classified by first square-obstruction children.',
    gap: 'It does not close the obstruction children, q-avoiding descendants, p479-unavailable complement, q97 child, p443-unavailable complement, or wider p4217 complement.',
  },
  {
    id: 'q_cover_staircase_nonconvergence_blocker',
    path: 'P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET.json',
    usefulFact: 'The q-cover staircase is blocked because it expands successor surfaces without a decreasing measure.',
    gap: 'This blocks a method; it does not cover the complement.',
  },
  {
    id: 'q_cover_parametric_transition_route',
    path: 'P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET.json',
    usefulFact: 'The current q-cover transition is row-uniform with two roots per source class.',
    gap: 'The q-avoiding side grows by 124343.572052x and no global closure follows.',
  },
  {
    id: 'structural_complement_invariant_blocker',
    path: 'P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.json',
    usefulFact: 'The earlier audit found no repo-owned structural complement decomposition or decreasing invariant.',
    gap: 'This is the strongest local blocker before the all-N residual; it remains a blocker after residual assembly.',
  },
];

function parseArgs(argv) {
  const options = {
    residualPacket: DEFAULT_RESIDUAL_PACKET,
    jsonOutput: null,
    markdownOutput: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--residual-packet') {
      options.residualPacket = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--json-output') {
      options.jsonOutput = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--markdown-output') {
      options.markdownOutput = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--write-defaults') {
      options.jsonOutput = DEFAULT_JSON_OUTPUT;
      options.markdownOutput = DEFAULT_MARKDOWN_OUTPUT;
    } else if (arg === '--pretty') {
      options.pretty = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function rel(filePath) {
  return path.relative(repoRoot, filePath);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function assertCondition(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function summarizeSource(source) {
  const absolutePath = path.join(frontierBridge, source.path);
  const exists = fs.existsSync(absolutePath);
  const doc = exists ? readJson(absolutePath) : null;
  return {
    id: source.id,
    relativePath: rel(absolutePath),
    exists,
    sha256: exists ? sha256File(absolutePath) : null,
    status: doc?.status ?? null,
    packetId: doc?.packetId ?? null,
    recommendedNextAction: doc?.recommendedNextAction ?? null,
    usefulFact: source.usefulFact,
    gap: source.gap,
    provesP4217ComplementCoverage: doc?.claims?.provesP4217ComplementCoverage === true
      || doc?.claims?.provesStructuralP4217ComplementDecomposition === true,
    provesP4217ComplementImpossibility: doc?.claims?.provesP4217ComplementImpossibility === true,
  };
}

function buildPacket(options) {
  const residual = readJson(options.residualPacket);
  assertCondition(residual?.recommendedNextAction === TARGET, 'residual packet does not select the p4217 complement target');
  assertCondition(residual?.claims?.assemblesAllNResidual === true, 'residual packet does not assemble the all-N residual');
  assertCondition(residual?.claims?.provesAllN === false, 'residual packet unexpectedly claims all-N');
  assertCondition(residual?.claims?.blocksQCoverExpansion === true, 'residual packet must keep q-cover expansion blocked');

  const auditedSources = AUDITED_SOURCE_PACKETS.map(summarizeSource);
  const missingSources = auditedSources.filter((source) => !source.exists);
  assertCondition(missingSources.length === 0, `missing p4217 source packet(s): ${missingSources.map((source) => source.relativePath).join(', ')}`);

  const positiveCoverageSources = auditedSources.filter((source) => (
    source.provesP4217ComplementCoverage || source.provesP4217ComplementImpossibility
  ));
  assertCondition(positiveCoverageSources.length === 0, `unexpected local p4217 coverage/impossibility source(s): ${positiveCoverageSources.map((source) => source.id).join(', ')}`);

  return {
    schema: 'erdos.number_theory.p848_p4217_complement_cover_impossibility_blocker_packet/1',
    packetId: 'P848_P4217_COMPLEMENT_COVER_IMPOSSIBILITY_BLOCKER_PACKET',
    problemId: 848,
    generatedAt: new Date().toISOString(),
    status: STATUS,
    target: TARGET,
    recommendedNextAction: NEXT_ACTION,
    coversPrimaryNextAction: {
      stepId: TARGET,
      status: 'blocked_by_no_repo_owned_p4217_complement_cover_or_impossibility',
      residualPacket: rel(options.residualPacket),
      residualSha256: sha256File(options.residualPacket),
    },
    localCoverAudit: {
      result: 'no_repo_owned_p4217_cover_or_impossibility_theorem_available_after_residual_assembly',
      auditedSourceCount: auditedSources.length,
      auditedSources,
      strongestUsefulFacts: [
        'The complement is exactly parameterized as one affine selector interval with 17,781,949 residues.',
        'The first fallback selector p43 is uniformly impossible because 2^2 divides every p43 cross-product.',
        'The p61 selector creates an exact CRT refinement, but it increases the ledger surface into available and unavailable obligations.',
        'The q-cover route is now explicitly nonconvergent without a decreasing measure or finite partition.',
      ],
      missingTheoremObjects: [
        'A deterministic partition of the p4217 unavailable complement whose children are all terminal, covered, or strictly lower rank.',
        'A uniform square-obstruction/impossibility theorem covering the whole p4217 unavailable complement.',
        'A finite selector-family cover with squarefree hitting and collision-free matching proof for every complement residue.',
        'A source/imported theorem that supplies the above in a repo-owned, auditable form.',
      ],
    },
    blockerDecision: {
      decision: 'emit_p4217_cover_impossibility_blocker_instead_of_reopening_q_cover_or_selector_ladder',
      reason: 'All local p4217 packets are exact refinements, negative selector facts, or finite descendant covers; none proves a whole-complement cover, impossibility theorem, or decreasing invariant.',
      forbiddenUntilNewTheoremObject: [
        'resume_q193_q197_singleton_descent',
        'launch_q193_q389_or_larger_q_cover_without_new_theorem',
        'try_fallback_selectors_one_by_one',
        'treat_p61_availability_refinement_as_complement_cover',
        'treat_p479_available_bulk_cover_as_wider_p4217_cover',
      ],
    },
    oneNextAction: {
      stepId: NEXT_ACTION,
      action: 'Prepare a p4217-specific theorem wedge or import/source-cover audit for the missing complement cover/impossibility theorem, without live paid execution by default.',
      finiteDenominatorOrRankToken: 'p848_p4217_complement_cover_impossibility_blocker_after_all_n_residual',
      failureBoundary: 'If no source theorem or free/local symbolic proof is found, keep the p4217 atom blocked and route final recombination to a proof-boundary packet rather than more finite q-cover compute.',
      command: 'erdos orp research ask 848 --question "Problem 848 p4217 complement theorem wedge: Given the exact p4217 unavailable-complement parameterization, p43 uniform obstruction, p61 CRT refinement, q-cover nonconvergence blocker, and all-N residual packet, prove or refute a whole-complement cover/impossibility theorem or identify the minimal imported/source theorem needed. Do not use finite selector descent as proof unless it comes with a finite partition or decreasing rank." --json',
    },
    proofBoundary: 'This packet is a post-residual p4217 blocker. It does not prove p4217 complement coverage, complement impossibility, a decreasing global invariant, mod-50 recurrence, post-40500 sufficiency, or all-N closure. It prevents the loop from disguising missing p4217 theorem content as more finite q-cover/selector work.',
    claims: {
      emitsExactP4217CoverImpossibilityBlocker: true,
      auditsP4217SourcesAfterAllNResidual: true,
      provesNoCurrentLocalP4217CoverSource: true,
      blocksQCoverExpansion: true,
      blocksSingletonQChildDescent: true,
      blocksSingleFallbackSelectorLadder: true,
      selectsSourceOrTheoremWedgeInsteadOfFiniteDescent: true,
      madeNewPaidCall: false,
      respectsNoPaidByDefault: true,
      provesP4217ComplementCover: false,
      provesP4217ComplementImpossibility: false,
      provesStructuralP4217ComplementDecomposition: false,
      provesDecreasingGlobalInvariant: false,
      provesAllN: false,
    },
    packetPath: DEFAULT_JSON_OUTPUT,
  };
}

function renderMarkdown(packet) {
  return [
    '# P848 p4217 complement cover/impossibility blocker',
    '',
    `- Status: \`${packet.status}\``,
    `- Target: \`${packet.target}\``,
    `- Recommended next action: \`${packet.recommendedNextAction}\``,
    '',
    '## Audit Result',
    '',
    `- Result: \`${packet.localCoverAudit.result}\``,
    `- Audited sources: ${packet.localCoverAudit.auditedSourceCount}`,
    '',
    '## Audited Sources',
    '',
    packet.localCoverAudit.auditedSources.map((source) => `- \`${source.id}\` (${source.status}): ${source.usefulFact} Gap: ${source.gap}`).join('\n'),
    '',
    '## Missing Theorem Objects',
    '',
    packet.localCoverAudit.missingTheoremObjects.map((item) => `- ${item}`).join('\n'),
    '',
    '## Next Action',
    '',
    `\`${packet.oneNextAction.stepId}\`: ${packet.oneNextAction.action}`,
    '',
    '## Forbidden Until New Theorem Object',
    '',
    packet.blockerDecision.forbiddenUntilNewTheoremObject.map((item) => `- \`${item}\``).join('\n'),
    '',
    '## Boundary',
    '',
    packet.proofBoundary,
    '',
  ].join('\n');
}

function writeOutputs(packet, options) {
  const json = JSON.stringify(packet, null, options.pretty ? 2 : 0);
  if (options.jsonOutput) {
    fs.mkdirSync(path.dirname(options.jsonOutput), { recursive: true });
    fs.writeFileSync(options.jsonOutput, `${json}\n`);
  } else {
    process.stdout.write(`${json}\n`);
  }
  if (options.markdownOutput) {
    fs.mkdirSync(path.dirname(options.markdownOutput), { recursive: true });
    fs.writeFileSync(options.markdownOutput, `${renderMarkdown(packet)}\n`);
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const packet = buildPacket(options);
  writeOutputs(packet, options);
}

main();
