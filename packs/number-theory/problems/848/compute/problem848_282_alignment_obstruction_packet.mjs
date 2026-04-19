#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const problemDir = path.resolve(scriptDir, '..');
const DEFAULT_BRIDGE = path.join(problemDir, 'SEARCH_THEOREM_BRIDGE.json');

function parseArgs(argv) {
  const args = {
    bridge: DEFAULT_BRIDGE,
    representative: null,
    targetContinuation: 282,
    comparisonContinuations: [332, 432, 782, 832],
    jsonOutput: null,
    markdownOutput: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--bridge') {
      args.bridge = argv[++index];
    } else if (token === '--representative') {
      args.representative = Number(argv[++index]);
    } else if (token === '--target-continuation') {
      args.targetContinuation = Number(argv[++index]);
    } else if (token === '--comparison-continuations') {
      args.comparisonContinuations = parseIntegerList(argv[++index]);
    } else if (token === '--json-output') {
      args.jsonOutput = argv[++index];
    } else if (token === '--markdown-output') {
      args.markdownOutput = argv[++index];
    } else if (token === '--help' || token === '-h') {
      printHelp();
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${token}`);
    }
  }

  if (args.representative !== null && (!Number.isInteger(args.representative) || args.representative < 1)) {
    throw new Error('--representative must be a positive integer');
  }
  if (!Number.isInteger(args.targetContinuation) || args.targetContinuation < 1) {
    throw new Error('--target-continuation must be a positive integer');
  }
  if (
    !Array.isArray(args.comparisonContinuations)
      || args.comparisonContinuations.length === 0
      || args.comparisonContinuations.some((value) => !Number.isInteger(value) || value < 1)
  ) {
    throw new Error('--comparison-continuations must be a comma-separated list of positive integers');
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node problem848_282_alignment_obstruction_packet.mjs [options]

Build a proof-facing obstruction packet for the Problem 848 representative that aligns with tail 282.

Options:
  --bridge <path>                    Bridge JSON path
  --representative <n>               Representative to inspect; defaults from bridge next unmatched representative
  --target-continuation <n>          Target continuation (default: 282)
  --comparison-continuations <list>  Comparison continuations (default: 332,432,782,832)
  --json-output <path>               Write JSON packet
  --markdown-output <path>           Write Markdown summary
`);
}

function parseIntegerList(value) {
  if (!value) return [];
  return value.split(',').map((part) => Number(part.trim())).filter((part) => Number.isFinite(part));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function firstSquareDivisorExact(value) {
  const n = BigInt(value);
  for (let prime = 2n; prime * prime <= n; prime += prime === 2n ? 1n : 2n) {
    const square = prime * prime;
    if (n % square === 0n) {
      return {
        prime: Number(prime),
        square: Number(square),
      };
    }
  }
  return null;
}

function positiveModulo(value, modulus) {
  const bigModulus = BigInt(modulus);
  const residue = BigInt(value) % bigModulus;
  return residue < 0n ? residue + bigModulus : residue;
}

function gcdExtended(a, b) {
  let oldR = BigInt(a);
  let r = BigInt(b);
  let oldS = 1n;
  let s = 0n;

  while (r !== 0n) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }

  return { gcd: oldR < 0n ? -oldR : oldR, coefficient: oldS };
}

function modularInverse(value, modulus) {
  const normalized = positiveModulo(value, modulus);
  const { gcd, coefficient } = gcdExtended(normalized, BigInt(modulus));
  if (gcd !== 1n) {
    throw new Error(`${value} has no inverse modulo ${modulus}`);
  }
  return positiveModulo(coefficient, modulus);
}

function gcdBigInt(a, b) {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) {
    [left, right] = [right, left % right];
  }
  return left;
}

function solveLinearCongruence(a, b, modulus) {
  const left = BigInt(a);
  const right = BigInt(b);
  const mod = BigInt(modulus);
  const divisor = gcdBigInt(left, mod);
  if (right % divisor !== 0n) {
    return {
      solvable: false,
      gcdCoeffModulus: Number(divisor),
      solution: null,
      period: null,
    };
  }
  const reducedLeft = left / divisor;
  const reducedRight = right / divisor;
  const reducedMod = mod / divisor;
  const solution = positiveModulo(reducedRight * modularInverse(reducedLeft, reducedMod), reducedMod);
  return {
    solvable: true,
    gcdCoeffModulus: Number(divisor),
    solution: Number(solution),
    period: Number(reducedMod),
  };
}

function crtPair(left, right) {
  const leftModulus = BigInt(left.modulus);
  const rightModulus = BigInt(right.modulus);
  const inverse = modularInverse(leftModulus, rightModulus);
  const t = positiveModulo((BigInt(right.residue) - BigInt(left.residue)) * inverse, rightModulus);
  const modulus = leftModulus * rightModulus;
  const residue = positiveModulo(BigInt(left.residue) + leftModulus * t, modulus);
  return { modulus, residue };
}

function combineCongruences(congruences) {
  if (congruences.length === 0) return null;
  let combined = {
    modulus: BigInt(congruences[0].modulus),
    residue: BigInt(congruences[0].residue),
  };
  for (const congruence of congruences.slice(1)) {
    combined = crtPair(combined, congruence);
  }
  return {
    modulus: combined.modulus.toString(),
    residue: combined.residue.toString(),
  };
}

function congruenceFromWitness(witness) {
  if (witness.squareDivisor === null) return null;
  const modulus = witness.squareDivisor;
  const residue = positiveModulo(-modularInverse(witness.value, modulus), modulus);
  return {
    value: witness.value,
    modulus,
    residue: Number(residue),
    expression: `n*${witness.value}+1 == 0 mod ${modulus}`,
  };
}

function formatSquare(square) {
  if (square === null) return '(none)';
  if (square === 4) return '4';
  if (square === 9) return '9';
  const prime = Math.trunc(Math.sqrt(square));
  return prime * prime === square ? `${prime}^2` : `${square}`;
}

function makeSyntheticFamilyRow({ representative, witnesses, crt }) {
  const tupleRows = witnesses.map((witness) => {
    const congruence = congruenceFromWitness(witness);
    return {
      anchor: witness.value,
      productPlusOne: witness.productPlusOne,
      squarePrime: witness.squareDivisorPrime,
      squareModulus: witness.squareDivisor,
      residue: congruence?.residue ?? null,
      expression: congruence?.expression ?? null,
    };
  });
  return {
    source: 'regenerated_from_representative_square_witnesses',
    representative,
    tupleKey: witnesses.map((witness) => formatSquare(witness.squareDivisor)).join(', '),
    squareModuli: witnesses.map((witness) => witness.squareDivisor),
    values: witnesses.map((witness) => witness.value),
    modulus: crt?.modulus ?? null,
    residue: crt?.residue ?? null,
    tupleRows,
    crt,
  };
}

function repairRowFromWitness(witness) {
  const productPlusOneNumber = Number(witness.productPlusOne);
  return {
    anchor: witness.value,
    value: Number.isSafeInteger(productPlusOneNumber) ? productPlusOneNumber : witness.productPlusOne,
    productPlusOne: witness.productPlusOne,
    squarefree: witness.squarefree,
    squareWitnesses: witness.squareDivisor === null
      ? []
      : [
        {
          squarePrime: witness.squareDivisorPrime,
          squareModulus: witness.squareDivisor,
          quotient: (BigInt(witness.productPlusOne) / BigInt(witness.squareDivisor)).toString(),
        },
      ],
  };
}

function buildRecoveredFamilyRow({ representative, anchorWitnesses, targetContinuationWitness, comparisonWitnesses, anchorClass }) {
  if (!anchorClass) return null;
  const row = makeSyntheticFamilyRow({
    representative,
    witnesses: anchorWitnesses,
    crt: {
      modulus: anchorClass.modulus,
      residue: anchorClass.residue,
    },
  });
  return {
    ...row,
    repairRows: [targetContinuationWitness, ...comparisonWitnesses].map(repairRowFromWitness),
    recoveryStatus: row.tupleRows.every((tupleRow) => tupleRow.residue !== null)
      ? 'regenerated_tuple_rows_and_crt'
      : 'incomplete_tuple_recovery',
  };
}

function buildTargetWitnessLift({ anchorClass, targetContinuationClass, targetContinuationWitness, targetContinuation }) {
  if (!anchorClass || !targetContinuationClass || targetContinuationWitness.squareDivisor === null) return null;
  const witnessSquare = BigInt(targetContinuationWitness.squareDivisor);
  const anchorResidue = BigInt(anchorClass.residue);
  const anchorModulus = BigInt(anchorClass.modulus);
  const coefficient = positiveModulo(BigInt(targetContinuation) * anchorModulus, witnessSquare);
  const rhs = positiveModulo(-(BigInt(targetContinuation) * anchorResidue + 1n), witnessSquare);
  const rowIndexCongruence = solveLinearCongruence(coefficient, rhs, witnessSquare);

  return {
    status: rowIndexCongruence.solvable && rowIndexCongruence.solution === 0
      ? 'target_witness_subprogression_starts_at_representative'
      : 'target_witness_subprogression_needs_review',
    witnessSquare: Number(witnessSquare),
    targetContinuation,
    anchorRowFormula: `n = ${anchorClass.residue} + ${anchorClass.modulus}*t`,
    targetWitnessCondition: `${targetContinuation}*n + 1 == 0 mod ${targetContinuationWitness.squareDivisor}`,
    rowIndexCongruence: {
      coefficientModuloWitness: Number(coefficient),
      rhsModuloWitness: Number(rhs),
      gcdCoeffWitness: rowIndexCongruence.gcdCoeffModulus,
      solution: rowIndexCongruence.solution,
      period: rowIndexCongruence.period,
      expression: rowIndexCongruence.solvable
        ? `t == ${rowIndexCongruence.solution} mod ${rowIndexCongruence.period}`
        : 'no row-index solution',
    },
    targetContinuationClass: {
      modulus: targetContinuationClass.modulus,
      residue: targetContinuationClass.residue,
    },
    interpretation: rowIndexCongruence.solvable && rowIndexCongruence.solution === 0
      ? `Inside the recovered anchor row, the ${targetContinuationWitness.squareDivisor} witness for continuation ${targetContinuation} recurs exactly on t == 0 mod ${rowIndexCongruence.period}; the representative is the first element of that subprogression.`
      : 'The recovered anchor row does not yet give a clean target-witness subprogression.',
    warning: 'This lifts the witness to a named subprogression of the recovered class. It does not prove first structural unavoidability.',
  };
}

function evaluateProduct({ representative, value }) {
  const productPlusOne = BigInt(representative) * BigInt(value) + 1n;
  const squareDivisor = firstSquareDivisorExact(productPlusOne);
  return {
    value,
    productPlusOne: productPlusOne.toString(),
    squareDivisorPrime: squareDivisor?.prime ?? null,
    squareDivisor: squareDivisor?.square ?? null,
    squarefree: squareDivisor === null,
    status: squareDivisor === null ? 'squarefree' : 'non_squarefree',
  };
}

function compilePacket(args) {
  const bridge = readJson(args.bridge);
  const representative = args.representative ?? bridge.current_bridge_state?.next_unmatched_representative;
  if (!Number.isInteger(representative) || representative < 1) {
    throw new Error('Representative is required; pass --representative or use a bridge with current_bridge_state.next_unmatched_representative');
  }

  const sharedPrefix = bridge.shared_prefix ?? [];
  const trackedTail = (bridge.tracked_tail_matrix ?? []).find((row) => row.continuation === args.targetContinuation) ?? null;
  const comparisonTailRows = args.comparisonContinuations.map((continuation) => (
    (bridge.tracked_tail_matrix ?? []).find((row) => row.continuation === continuation) ?? { continuation }
  ));
  const familyMenuSourcePath = bridge.sources?.family_menu_source_path ?? null;
  const packetLedger = bridge.shared_prefix_packet_ledger ?? [];
  const precedingLedgerPacket = packetLedger
    .filter((packet) => Number.isInteger(packet.n) && packet.n < representative)
    .sort((left, right) => right.n - left.n)[0] ?? null;
  const targetLedgerPacket = packetLedger.find((packet) => packet.n === representative) ?? null;
  const anchorWitnesses = sharedPrefix.map((value) => evaluateProduct({ representative, value }));
  const targetContinuationWitness = evaluateProduct({
    representative,
    value: args.targetContinuation,
  });
  const comparisonWitnesses = args.comparisonContinuations.map((value) => evaluateProduct({
    representative,
    value,
  }));
  const targetFailsAtRepresentative = targetContinuationWitness.squarefree === false;
  const comparisonsStaySquarefree = comparisonWitnesses.every((witness) => witness.squarefree);
  const anchorCongruences = anchorWitnesses.map(congruenceFromWitness).filter(Boolean);
  const targetCongruence = congruenceFromWitness(targetContinuationWitness);
  const anchorCrt = combineCongruences(anchorCongruences);
  const targetCrt = targetCongruence === null
    ? null
    : combineCongruences([...anchorCongruences, targetCongruence]);
  const anchorClass = anchorCrt === null ? null : {
    congruences: anchorCongruences,
    modulus: anchorCrt.modulus,
    residue: anchorCrt.residue,
    representativeMatches: positiveModulo(representative, BigInt(anchorCrt.modulus)).toString() === anchorCrt.residue,
  };
  const targetContinuationClass = targetCrt === null ? null : {
    congruences: [...anchorCongruences, targetCongruence],
    modulus: targetCrt.modulus,
    residue: targetCrt.residue,
    representativeMatches: positiveModulo(representative, BigInt(targetCrt.modulus)).toString() === targetCrt.residue,
  };
  const recoveredFamilyRow = buildRecoveredFamilyRow({
    representative,
    anchorWitnesses,
    targetContinuationWitness,
    comparisonWitnesses,
    anchorClass,
  });
  const targetWitnessLift = buildTargetWitnessLift({
    anchorClass,
    targetContinuationClass,
    targetContinuationWitness,
    targetContinuation: args.targetContinuation,
  });
  const familyRowRecovered = recoveredFamilyRow?.recoveryStatus === 'regenerated_tuple_rows_and_crt';
  const targetWitnessLifted = targetWitnessLift?.status === 'target_witness_subprogression_starts_at_representative';

  return {
    schema: 'erdos.number_theory.p848_282_alignment_obstruction_packet/1',
    generatedAt: new Date().toISOString(),
    problemId: 848,
    status: familyRowRecovered ? 'mechanism_candidate_family_row_reconstructed' : 'mechanism_candidate_data_gap',
    representative,
    sharedPrefix,
    targetContinuation: args.targetContinuation,
    comparisonContinuations: args.comparisonContinuations,
    sourceBridge: args.bridge,
    sourceAudit: {
      familyMenuSourcePath,
      familyMenuSourceExists: familyMenuSourcePath === null ? false : fs.existsSync(familyMenuSourcePath),
      targetRepresentativeInSharedPrefixLedger: Boolean(targetLedgerPacket),
      precedingLedgerPacket,
      targetLedgerPacket,
    },
    trackedTail,
    comparisonTailRows,
    obstructionWitnesses: {
      anchors: anchorWitnesses,
      targetContinuation: targetContinuationWitness,
      comparisons: comparisonWitnesses,
    },
    reconstructedCrt: {
      anchorClass,
      targetContinuationClass,
    },
    syntheticFamilyRows: {
      anchorOnly: anchorClass === null ? null : makeSyntheticFamilyRow({
        representative,
        witnesses: anchorWitnesses,
        crt: {
          modulus: anchorClass.modulus,
          residue: anchorClass.residue,
        },
      }),
      withTargetContinuation: targetContinuationClass === null ? null : makeSyntheticFamilyRow({
        representative,
        witnesses: [...anchorWitnesses, targetContinuationWitness],
        crt: {
          modulus: targetContinuationClass.modulus,
          residue: targetContinuationClass.residue,
        },
      }),
    },
    recoveredFamilyRow,
    targetWitnessLift,
    mechanismReadout: {
      targetFailsAtRepresentative,
      targetSquareDivisor: targetContinuationWitness.squareDivisor,
      comparisonsStaySquarefree,
      familyRowRecovered,
      targetWitnessLiftedToSubprogression: targetWitnessLifted,
      statement: targetFailsAtRepresentative && comparisonsStaySquarefree
        ? `At representative ${representative}, continuation ${args.targetContinuation} is blocked by ${targetContinuationWitness.squareDivisor}, while comparison continuations ${args.comparisonContinuations.join(',')} are squarefree.`
        : 'The requested representative does not currently isolate the target continuation against all comparison continuations.',
    },
    proofBoundary: {
      provesObservedRepresentativeMechanism: targetFailsAtRepresentative && comparisonsStaySquarefree,
      regeneratesFamilyRow: familyRowRecovered,
      liftsTargetWitnessToRecoveredSubprogression: targetWitnessLifted,
      provesFirstStructuralUnavoidability: false,
      provesAllN: false,
      missingForPromotion: [
        familyRowRecovered ? null : 'Bind the synthetic family row to a recovered or regenerated live family-menu row for representative 137720141.',
        familyRowRecovered ? null : 'Recover tuple rows for the family-menu source representation.',
        targetWitnessLifted ? null : 'Lift the 29^2 target obstruction from the representative to a recovered row subprogression.',
        'Show that the 29^2 target obstruction is structurally first in the family-menu chronology, not only lifted to the recovered subprogression.',
        'Bind the class to bridge falsifiers so future frontier refreshes can promote or break the packet cleanly.',
      ].filter(Boolean),
    },
    nextTheoremOptions: [
      {
        id: 'recover_representative_family_row',
        status: familyRowRecovered ? 'done_regenerated' : 'needed',
        statement: 'Recover the missing family-menu row and singleton CRT packet for representative 137720141, or regenerate them locally from available frontier data.',
      },
      {
        id: 'lift_841_witness_to_class',
        status: targetWitnessLifted ? 'done_subprogression_lift' : 'candidate_after_row_recovery',
        statement: 'Prove that the 29^2 witness for continuation 282 is forced across the recovered obstruction class.',
      },
      {
        id: 'prove_first_structural_unavoidability',
        status: 'next',
        statement: 'Use family-menu chronology or a theorem-facing recurrence argument to show no earlier recovered class can occupy the 282/841 witness subprogression.',
      },
      {
        id: 'separate_282_from_leader_tails',
        status: 'ready_bounded_mechanism',
        statement: 'Use the exact representative checks to keep the 282 obstruction claim narrow and separate from 332/432/782/832 leaderboard behavior.',
      },
    ],
  };
}

function renderMarkdown(packet) {
  const lines = [];
  lines.push('# Problem 848 Tail-282 Alignment Obstruction Packet');
  lines.push('');
  lines.push(`- Representative: \`${packet.representative}\``);
  lines.push(`- Shared prefix: \`${packet.sharedPrefix.join(',')}\``);
  lines.push(`- Target continuation: \`${packet.targetContinuation}\``);
  lines.push(`- Comparison continuations: \`${packet.comparisonContinuations.join(',')}\``);
  lines.push(`- Status: \`${packet.status}\``);
  lines.push('');
  lines.push('## Mechanism Readout');
  lines.push('');
  lines.push(`- ${packet.mechanismReadout.statement}`);
  lines.push(`- Target square divisor: \`${packet.mechanismReadout.targetSquareDivisor ?? '(none)'}\``);
  lines.push(`- Comparisons stay squarefree: \`${packet.mechanismReadout.comparisonsStaySquarefree}\``);
  lines.push('');
  lines.push('## Anchor Witnesses');
  lines.push('');
  for (const witness of packet.obstructionWitnesses.anchors) {
    lines.push(`- a=${witness.value}: product+1=\`${witness.productPlusOne}\`, status=\`${witness.status}\`, square=\`${witness.squareDivisor ?? '(none)'}\``);
  }
  lines.push('');
  lines.push('## Continuation Witnesses');
  lines.push('');
  const target = packet.obstructionWitnesses.targetContinuation;
  lines.push(`- target ${target.value}: product+1=\`${target.productPlusOne}\`, status=\`${target.status}\`, square=\`${target.squareDivisor ?? '(none)'}\``);
  for (const witness of packet.obstructionWitnesses.comparisons) {
    lines.push(`- comparison ${witness.value}: product+1=\`${witness.productPlusOne}\`, status=\`${witness.status}\`, square=\`${witness.squareDivisor ?? '(none)'}\``);
  }
  lines.push('');
  lines.push('## Source Audit');
  lines.push('');
  lines.push(`- Family menu path exists: \`${packet.sourceAudit.familyMenuSourceExists}\``);
  lines.push(`- Target representative in shared-prefix ledger: \`${packet.sourceAudit.targetRepresentativeInSharedPrefixLedger}\``);
  lines.push(`- Preceding ledger packet: \`${packet.sourceAudit.precedingLedgerPacket?.n ?? '(none)'}\``);
  lines.push('');
  lines.push('## Reconstructed CRT');
  lines.push('');
  if (packet.reconstructedCrt.anchorClass) {
    lines.push(`- Anchor class: \`n == ${packet.reconstructedCrt.anchorClass.residue} mod ${packet.reconstructedCrt.anchorClass.modulus}\`; representative matches: \`${packet.reconstructedCrt.anchorClass.representativeMatches}\``);
  }
  if (packet.reconstructedCrt.targetContinuationClass) {
    lines.push(`- Target continuation class: \`n == ${packet.reconstructedCrt.targetContinuationClass.residue} mod ${packet.reconstructedCrt.targetContinuationClass.modulus}\`; representative matches: \`${packet.reconstructedCrt.targetContinuationClass.representativeMatches}\``);
  }
  lines.push('');
  lines.push('## Synthetic Family Rows');
  lines.push('');
  if (packet.syntheticFamilyRows.anchorOnly) {
    lines.push(`- Anchor-only tuple: \`${packet.syntheticFamilyRows.anchorOnly.tupleKey}\``);
  }
  if (packet.syntheticFamilyRows.withTargetContinuation) {
    lines.push(`- With target continuation tuple: \`${packet.syntheticFamilyRows.withTargetContinuation.tupleKey}\``);
  }
  lines.push('');
  lines.push('## Recovered Family Row');
  lines.push('');
  if (packet.recoveredFamilyRow) {
    lines.push(`- Recovery status: \`${packet.recoveredFamilyRow.recoveryStatus}\``);
    lines.push(`- Tuple key: \`${packet.recoveredFamilyRow.tupleKey}\``);
    lines.push(`- Row formula: \`n == ${packet.recoveredFamilyRow.residue} mod ${packet.recoveredFamilyRow.modulus}\``);
    for (const row of packet.recoveredFamilyRow.tupleRows ?? []) {
      lines.push(`- tuple ${row.anchor}: square=\`${row.squareModulus}\`, residue=\`${row.residue}\`, expression=\`${row.expression}\``);
    }
    for (const row of packet.recoveredFamilyRow.repairRows ?? []) {
      const witnessList = (row.squareWitnesses ?? []).map((witness) => witness.squareModulus).join(', ') || '(none)';
      lines.push(`- repair ${row.anchor}: squarefree=\`${row.squarefree}\`, witnesses=\`${witnessList}\``);
    }
  } else {
    lines.push('- No recovered family row was emitted.');
  }
  lines.push('');
  lines.push('## Target Witness Lift');
  lines.push('');
  if (packet.targetWitnessLift) {
    lines.push(`- Status: \`${packet.targetWitnessLift.status}\``);
    lines.push(`- Anchor row formula: \`${packet.targetWitnessLift.anchorRowFormula}\``);
    lines.push(`- Witness condition: \`${packet.targetWitnessLift.targetWitnessCondition}\``);
    lines.push(`- Row-index congruence: \`${packet.targetWitnessLift.rowIndexCongruence.expression}\``);
    lines.push(`- ${packet.targetWitnessLift.interpretation}`);
    lines.push(`- Boundary: ${packet.targetWitnessLift.warning}`);
  } else {
    lines.push('- No target witness lift was emitted.');
  }
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push(`- Proves observed representative mechanism: \`${packet.proofBoundary.provesObservedRepresentativeMechanism}\``);
  lines.push(`- Regenerates family row: \`${packet.proofBoundary.regeneratesFamilyRow}\``);
  lines.push(`- Lifts target witness to recovered subprogression: \`${packet.proofBoundary.liftsTargetWitnessToRecoveredSubprogression}\``);
  lines.push(`- Proves first structural unavoidability: \`${packet.proofBoundary.provesFirstStructuralUnavoidability}\``);
  lines.push(`- Proves all-N: \`${packet.proofBoundary.provesAllN}\``);
  for (const missing of packet.proofBoundary.missingForPromotion) {
    lines.push(`- Missing for promotion: ${missing}`);
  }
  lines.push('');
  lines.push('## Next Theorem Options');
  lines.push('');
  for (const option of packet.nextTheoremOptions) {
    lines.push(`- \`${option.id}\` [${option.status}]: ${option.statement}`);
  }
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function writeOutput(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const packet = compilePacket(args);
  if (args.jsonOutput) {
    writeOutput(args.jsonOutput, `${JSON.stringify(packet, null, 2)}\n`);
  }
  if (args.markdownOutput) {
    writeOutput(args.markdownOutput, renderMarkdown(packet));
  }
  if (!args.jsonOutput && !args.markdownOutput) {
    console.log(JSON.stringify(packet, null, 2));
  } else {
    console.log(JSON.stringify({
      ok: true,
      jsonOutput: args.jsonOutput,
      markdownOutput: args.markdownOutput,
      representative: packet.representative,
      targetContinuation: packet.targetContinuation,
      targetSquareDivisor: packet.mechanismReadout.targetSquareDivisor,
      comparisonsStaySquarefree: packet.mechanismReadout.comparisonsStaySquarefree,
      familyMenuSourceExists: packet.sourceAudit.familyMenuSourceExists,
      familyRowRecovered: packet.mechanismReadout.familyRowRecovered,
      targetWitnessLiftedToSubprogression: packet.mechanismReadout.targetWitnessLiftedToSubprogression,
    }, null, 2));
  }
}

main();
