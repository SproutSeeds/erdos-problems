#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const problemDir = path.resolve(scriptDir, '..');

const DEFAULT_PREDECESSOR_PROOF = path.join(
  problemDir,
  'SPLIT_ATOM_PACKETS',
  'DYNAMIC_MARGIN_PROOFS',
  'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_p13_expanded_fallback_menu_lift.json',
);

function parseArgs(argv) {
  const args = {
    predecessorProof: DEFAULT_PREDECESSOR_PROOF,
    primes: [23, 31],
    fallbackPrimes: [37, 41, 61],
    outsider: 6323,
    residue: null,
    modulus: null,
    start: null,
    end: null,
    window: null,
    windowGrid: null,
    availabilityProfile: false,
    expandedWindow: 10000,
    maxSquarePrime: null,
    jsonOutput: null,
    markdownOutput: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--predecessor-proof') {
      args.predecessorProof = argv[++index];
    } else if (token === '--primes') {
      args.primes = parsePrimeList(argv[++index]);
    } else if (token === '--fallback-primes') {
      args.fallbackPrimes = parsePrimeList(argv[++index]);
    } else if (token === '--outsider') {
      args.outsider = Number(argv[++index]);
    } else if (token === '--residue') {
      args.residue = Number(argv[++index]);
    } else if (token === '--modulus') {
      args.modulus = Number(argv[++index]);
    } else if (token === '--start') {
      args.start = Number(argv[++index]);
    } else if (token === '--end') {
      args.end = Number(argv[++index]);
    } else if (token === '--window') {
      args.window = Number(argv[++index]);
    } else if (token === '--window-grid') {
      args.windowGrid = parseIntegerList(argv[++index]);
    } else if (token === '--availability-profile') {
      args.availabilityProfile = true;
    } else if (token === '--expanded-window') {
      args.expandedWindow = Number(argv[++index]);
    } else if (token === '--max-square-prime') {
      args.maxSquarePrime = Number(argv[++index]);
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

  if (!Number.isInteger(args.outsider) || args.outsider < 1) {
    throw new Error('--outsider must be a positive integer');
  }
  for (const [label, primes] of [['--primes', args.primes], ['--fallback-primes', args.fallbackPrimes]]) {
    if (!Array.isArray(primes) || primes.some((prime) => !Number.isInteger(prime) || prime < 2)) {
      throw new Error(`${label} must be a comma-separated list of primes`);
    }
  }
  if (args.residue !== null && !Number.isInteger(args.residue)) {
    throw new Error('--residue must be an integer');
  }
  if (args.modulus !== null && (!Number.isInteger(args.modulus) || args.modulus < 1)) {
    throw new Error('--modulus must be a positive integer');
  }
  if (args.start !== null && (!Number.isInteger(args.start) || args.start < 1)) {
    throw new Error('--start must be a positive integer');
  }
  if (args.end !== null && (!Number.isInteger(args.end) || args.end < 1)) {
    throw new Error('--end must be a positive integer');
  }
  if (args.start !== null && args.end !== null && args.start > args.end) {
    throw new Error('--start must be <= --end');
  }
  if (args.window !== null && (!Number.isInteger(args.window) || args.window < 1)) {
    throw new Error('--window must be a positive integer');
  }
  if (args.windowGrid !== null && (
    !Array.isArray(args.windowGrid)
      || args.windowGrid.length === 0
      || args.windowGrid.some((value) => !Number.isInteger(value) || value < 1)
  )) {
    throw new Error('--window-grid must be a comma-separated list of positive integers');
  }
  if (!Number.isInteger(args.expandedWindow) || args.expandedWindow < 1) {
    throw new Error('--expanded-window must be a positive integer');
  }
  if (args.maxSquarePrime !== null && (!Number.isInteger(args.maxSquarePrime) || args.maxSquarePrime < 2)) {
    throw new Error('--max-square-prime must be an integer >= 2');
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node problem848_endpoint_menu_compiler.mjs [options]

Compile a deterministic endpoint-menu selector profile for Problem 848.

Options:
  --predecessor-proof <path>  Seed proof JSON to read defaults from
  --primes <list>             Primary menu primes, e.g. 23,31
  --fallback-primes <list>    Backup menu primes, e.g. 37,41,61
  --outsider <n>              Outsider coefficient (default: 6323)
  --residue <n>               Residual left residue; defaults from proof
  --modulus <n>               Residual left modulus; defaults from proof
  --start <n>                 First left value to scan
  --end <n>                   Last left value to scan
  --window <n>                Endpoint window; defaults from next subatom
  --window-grid <list>        Profile several endpoint windows, e.g. 25000,28500,35000
  --availability-profile      Emit modular window-availability rules instead of squarefree coverage
  --expanded-window <n>       Smaller predecessor window (default: 10000)
  --max-square-prime <n>      Square-divisor scan prime limit
  --json-output <path>        Write JSON packet
  --markdown-output <path>    Write Markdown summary
`);
}

function parsePrimeList(value) {
  if (!value) return [];
  return value.split(',').map((part) => Number(part.trim())).filter((part) => Number.isFinite(part));
}

function parseIntegerList(value) {
  if (!value) return [];
  return value.split(',').map((part) => Number(part.trim())).filter((part) => Number.isFinite(part));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
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

function primeSieve(max) {
  const composite = new Uint8Array(max + 1);
  const primes = [];
  for (let value = 2; value <= max; value += 1) {
    if (composite[value]) continue;
    primes.push(value);
    if (value * value > max) continue;
    for (let multiple = value * value; multiple <= max; multiple += value) {
      composite[multiple] = 1;
    }
  }
  return primes;
}

function gcdNumber(a, b) {
  let left = Math.abs(Number(a));
  let right = Math.abs(Number(b));
  while (right !== 0) {
    [left, right] = [right, left % right];
  }
  return left;
}

function firstSquareDivisor(value, primes) {
  const n = BigInt(value);
  for (const prime of primes) {
    const square = BigInt(prime) * BigInt(prime);
    if (square > n) break;
    if (n % square === 0n) {
      return { prime, square: prime * prime };
    }
  }
  return null;
}

function compileEndpointFormula({ prime, outsider }) {
  const primeSquare = prime * prime;
  const modulus = BigInt(primeSquare);
  const denominator = BigInt(25 * outsider);
  const inverse = modularInverse(denominator, modulus);
  const leftCoefficient = positiveModulo(BigInt(outsider) * inverse, modulus);
  const constant = positiveModulo((1n - 14n * BigInt(outsider)) * inverse, modulus);
  const maxDelta = -14;
  const minDelta = -14 - 25 * (primeSquare - 1);

  return {
    prime,
    primeSquare,
    kFormula: {
      leftCoefficient: Number(leftCoefficient),
      constant: Number(constant),
      modulus: primeSquare,
      text: `k_${prime}(left) = (${leftCoefficient}*left + ${constant}) mod ${primeSquare}`,
    },
    deltaRange: {
      min: minDelta,
      max: maxDelta,
    },
    universallyWithinWindows: {
      10000: Math.abs(minDelta) <= 10000,
      25000: Math.abs(minDelta) <= 25000,
    },
  };
}

function endpointForLeft({ left, formula, outsider }) {
  const k = Number(positiveModulo(
    BigInt(formula.kFormula.leftCoefficient) * BigInt(left) + BigInt(formula.kFormula.constant),
    formula.primeSquare,
  ));
  const delta = -14 - 25 * k;
  const right = left + delta;
  const outsiderCompatibilityResidue = Number(positiveModulo(BigInt(outsider) * BigInt(right) + 1n, formula.primeSquare));
  const crossProductPlusOne = BigInt(left) * BigInt(right) + 1n;
  return {
    prime: formula.prime,
    k,
    delta,
    right,
    rightMod25: Number(positiveModulo(right, 25)),
    withinWindow: null,
    compatibilityModPrimeSquare: outsiderCompatibilityResidue,
    crossProductPlusOne: crossProductPlusOne.toString(),
  };
}

function evaluateEndpoint({ left, formula, outsider, window, squarePrimes }) {
  const endpoint = endpointForLeft({ left, formula, outsider });
  const squareWitness = firstSquareDivisor(endpoint.crossProductPlusOne, squarePrimes);
  const checkedSquarePrimeLimit = squarePrimes.at(-1) ?? null;
  const exactSquarefree = checkedSquarePrimeLimit !== null
    && BigInt(checkedSquarePrimeLimit) * BigInt(checkedSquarePrimeLimit) >= BigInt(endpoint.crossProductPlusOne);
  const squarefreeStatus = squareWitness
    ? 'non_squarefree'
    : exactSquarefree
      ? 'exact_squarefree'
      : 'no_checked_square_divisor';
  return {
    ...endpoint,
    withinWindow: endpoint.delta <= -14 && endpoint.delta >= -window,
    checkedSquarePrimeLimit,
    squareDivisorPrime: squareWitness?.prime ?? null,
    squareDivisor: squareWitness?.square ?? null,
    squarefree: exactSquarefree && squareWitness === null,
    squarefreeStatus,
    profileUsable: squareWitness === null,
  };
}

function alignStartToResidue(start, residue, modulus) {
  const offset = Number(positiveModulo(BigInt(residue) - BigInt(start), modulus));
  return start + offset;
}

function makeCountMap(values) {
  const counts = new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((left, right) => right.count - left.count || Number(left.key) - Number(right.key));
}

function maxKForWindow(window) {
  return Math.floor((window - 14) / 25);
}

function windowFromMaxK(maxK) {
  return 14 + 25 * maxK;
}

function resolveProfileDefaults(args) {
  const predecessor = readJson(args.predecessorProof);
  const residualClass = {
    residue: args.residue ?? predecessor.residualClass?.residue,
    modulus: args.modulus ?? predecessor.residualClass?.modulus,
  };
  if (!Number.isInteger(residualClass.residue) || !Number.isInteger(residualClass.modulus)) {
    throw new Error('Residual class is required; pass --residue and --modulus or use a predecessor proof with residualClass');
  }

  const targetWindow = args.window ?? predecessor.nextSubatom?.seedEscapeWindow ?? 25000;
  const firstBlockedLeft = predecessor.firstFullyExpandedMenuBlockedRow?.left ?? null;
  const start = args.start ?? firstBlockedLeft ?? residualClass.residue;
  const end = args.end ?? start;
  return {
    predecessor,
    residualClass,
    targetWindow,
    firstBlockedLeft,
    start,
    end,
  };
}

function compileAvailabilityRule({ formula, residualClass, window }) {
  const primeSquare = formula.primeSquare;
  const maxK = maxKForWindow(window);
  const base = Number(positiveModulo(
    BigInt(formula.kFormula.leftCoefficient) * BigInt(residualClass.residue) + BigInt(formula.kFormula.constant),
    primeSquare,
  ));
  const step = Number(positiveModulo(
    BigInt(formula.kFormula.leftCoefficient) * BigInt(residualClass.modulus),
    primeSquare,
  ));
  const stepGcd = gcdNumber(step, primeSquare);
  const period = primeSquare / stepGcd;
  const availableTResidues = [];
  let availableCount = 0;
  let firstUnavailableTResidue = null;

  for (let tResidue = 0; tResidue < period; tResidue += 1) {
    const k = Number(positiveModulo(BigInt(base) + BigInt(step) * BigInt(tResidue), primeSquare));
    const available = k <= maxK;
    if (available) {
      availableCount += 1;
      if (availableTResidues.length < 16) {
        availableTResidues.push({ tResidue, k });
      }
    } else if (firstUnavailableTResidue === null) {
      firstUnavailableTResidue = { tResidue, k };
    }
  }

  return {
    window,
    maxK,
    minimalWindowForMaxK: maxK < 0 ? null : windowFromMaxK(maxK),
    criterion: `within window ${window} iff k_${formula.prime}(left) <= ${maxK}`,
    leftParameterization: `left = ${residualClass.residue} + ${residualClass.modulus}*t`,
    kFormulaInT: `k_${formula.prime}(t) = (${step}*t + ${base}) mod ${primeSquare}`,
    tPeriod: period,
    stepGcdWithPrimeSquare: stepGcd,
    availableResidueCount: availableCount,
    unavailableResidueCount: period - availableCount,
    density: availableCount / period,
    universallyWithinWindow: availableCount === period,
    firstAvailableTResidues: availableTResidues,
    firstUnavailableTResidue,
  };
}

function compileAvailabilityProfile(args) {
  const defaults = resolveProfileDefaults(args);
  const windows = [...new Set(args.windowGrid ?? [defaults.targetWindow])].sort((left, right) => left - right);
  const primaryFormulas = args.primes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const fallbackFormulas = args.fallbackPrimes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const allFormulas = [...primaryFormulas, ...fallbackFormulas];
  const firstLeft = alignStartToResidue(defaults.start, defaults.residualClass.residue, defaults.residualClass.modulus);
  const witnessRows = [];
  const maxWitnessRows = 25;

  for (
    let left = firstLeft;
    left <= defaults.end && witnessRows.length < maxWitnessRows;
    left += defaults.residualClass.modulus
  ) {
    witnessRows.push({
      left,
      leftModResidualClass: Number(positiveModulo(left, defaults.residualClass.modulus)),
      endpoints: allFormulas.map((formula) => {
        const endpoint = endpointForLeft({ left, formula, outsider: args.outsider });
        return {
          prime: endpoint.prime,
          k: endpoint.k,
          delta: endpoint.delta,
          right: endpoint.right,
          rightMod25: endpoint.rightMod25,
          compatibilityModPrimeSquare: endpoint.compatibilityModPrimeSquare,
          withinWindows: Object.fromEntries(windows.map((window) => [window, endpoint.delta <= -14 && endpoint.delta >= -window])),
        };
      }),
    });
  }

  return {
    schema: 'erdos.number_theory.p848_endpoint_availability_profile/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    target: {
      description: 'q17 residual window-relaxed fallback endpoint-menu availability profile',
      predecessorProof: args.predecessorProof,
      outsider: args.outsider,
      residualClass: defaults.residualClass,
      start: firstLeft,
      end: defaults.end,
      witnessRowCount: witnessRows.length,
      windows,
    },
    interpretation: {
      endpointWindowCriterion: 'Because delta=-14-25*k, an endpoint is inside window W exactly when k <= floor((W-14)/25).',
      provesSquarefreeHitting: false,
      provesCollisionFreeMatching: false,
      warning: 'This profile proves modular endpoint availability only. Squarefree hitting and matching remain separate layers.',
    },
    primaryMenu: {
      primeSet: args.primes,
    },
    fallbackMenu: {
      primeSet: args.fallbackPrimes,
    },
    formulasByPrime: Object.fromEntries(allFormulas.map((formula) => [
      formula.prime,
      {
        ...formula,
        availabilityByWindow: windows.map((window) => compileAvailabilityRule({
          formula,
          residualClass: defaults.residualClass,
          window,
        })),
      },
    ])),
    witnessRows,
    nextTheoremOptions: [
      {
        id: 'availability_residue_cover',
        status: 'ready',
        statement: 'Use the k-threshold rules to split endpoint availability into finite t-residue strata before proving squarefree hitting.',
      },
      {
        id: 'window_legality_threshold',
        status: 'ready',
        statement: `The candidate windows have thresholds ${windows.map((window) => `${window}->k<=${maxKForWindow(window)}`).join(', ')}; prove which threshold is theorem-legal.`,
      },
    ],
  };
}

function compileProfile(args) {
  const {
    residualClass,
    targetWindow,
    firstBlockedLeft,
    start,
    end,
  } = resolveProfileDefaults(args);
  const maxSquarePrime = args.maxSquarePrime ?? Math.ceil(Math.sqrt(Number(BigInt(end) * BigInt(end) + 1n)));
  const squarePrimes = primeSieve(maxSquarePrime);
  const primaryFormulas = args.primes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const fallbackFormulas = args.fallbackPrimes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const allFormulas = [...primaryFormulas, ...fallbackFormulas];
  const firstLeft = alignStartToResidue(start, residualClass.residue, residualClass.modulus);
  const rows = [];
  const primaryCoveredRows = [];
  const allCoveredRows = [];
  const primaryMisses = [];
  const allMisses = [];

  for (let left = firstLeft; left <= end; left += residualClass.modulus) {
    const primaryEndpoints = primaryFormulas.map((formula) => evaluateEndpoint({
      left,
      formula,
      outsider: args.outsider,
      window: targetWindow,
      squarePrimes,
    }));
    const fallbackEndpoints = fallbackFormulas.map((formula) => evaluateEndpoint({
      left,
      formula,
      outsider: args.outsider,
      window: targetWindow,
      squarePrimes,
    }));
    const allEndpoints = [...primaryEndpoints, ...fallbackEndpoints];
    const firstPrimarySquarefree = primaryEndpoints.find((endpoint) => endpoint.withinWindow && endpoint.profileUsable) ?? null;
    const firstAnySquarefree = allEndpoints.find((endpoint) => endpoint.withinWindow && endpoint.profileUsable) ?? null;
    const row = {
      left,
      leftModResidualClass: Number(positiveModulo(left, residualClass.modulus)),
      primaryEndpoints,
      fallbackEndpoints,
      firstPrimarySquarefree,
      firstAnySquarefree,
      primaryCovered: Boolean(firstPrimarySquarefree),
      allCovered: Boolean(firstAnySquarefree),
    };
    rows.push(row);
    if (row.primaryCovered) {
      primaryCoveredRows.push(row);
    } else {
      primaryMisses.push(row);
    }
    if (row.allCovered) {
      allCoveredRows.push(row);
    } else {
      allMisses.push(row);
    }
  }

  const primaryCoverPrimes = primaryCoveredRows.map((row) => row.firstPrimarySquarefree.prime);
  const allCoverPrimes = allCoveredRows.map((row) => row.firstAnySquarefree.prime);
  const exactForPrimaryCoveredEndpoints = primaryCoveredRows.length > 0
    && primaryCoveredRows.every((row) => row.firstPrimarySquarefree?.squarefreeStatus === 'exact_squarefree');
  const exactForAllCoveredEndpoints = allCoveredRows.length > 0
    && allCoveredRows.every((row) => row.firstAnySquarefree?.squarefreeStatus === 'exact_squarefree');
  const checkedPrimeLimit = squarePrimes.at(-1) ?? null;
  const primaryFormulasByPrime = Object.fromEntries(primaryFormulas.map((formula) => [formula.prime, formula]));
  const fallbackFormulasByPrime = Object.fromEntries(fallbackFormulas.map((formula) => [formula.prime, formula]));
  const squareCheckInterpretation = allCoveredRows.length === 0
    ? 'No full-menu covered endpoint was selected in this profile; inspect candidate square-divisor statuses and window availability.'
    : exactForAllCoveredEndpoints
      ? 'Every covered endpoint selected by the full menu is exactly squarefree-certified.'
      : 'Fast obstruction screening is present; no checked square divisor is not always an all-prime squarefree proof.';

  return {
    schema: 'erdos.number_theory.p848_endpoint_menu_compiler/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    target: {
      description: 'q17 residual window-relaxed fallback endpoint-menu selector',
      predecessorProof: args.predecessorProof,
      outsider: args.outsider,
      residualClass,
      start: firstLeft,
      end,
      rowCount: rows.length,
      targetWindow,
      predecessorWindow: args.expandedWindow,
      squareCheck: {
        checkedPrimeLimit,
        exactForPrimaryCoveredEndpoints,
        exactForAllCoveredEndpoints,
        interpretation: squareCheckInterpretation,
      },
    },
    endpointRule: {
      statement: 'For each menu prime p, choose k_p(left) modulo p^2 so p^2 divides outsider*(left - 14 - 25*k_p(left)) + 1, then set right_p(left)=left-14-25*k_p(left).',
      invariant: 'Every compiled endpoint has right congruent to 18 mod 25 and is outsider-compatible by construction.',
    },
    primaryMenu: {
      primeSet: args.primes,
      formulasByPrime: primaryFormulasByPrime,
      universalWindowAvailability: primaryFormulas.every((formula) => Math.abs(formula.deltaRange.min) <= targetWindow),
    },
    fallbackMenu: {
      primeSet: args.fallbackPrimes,
      formulasByPrime: fallbackFormulasByPrime,
      universalWindowAvailability: fallbackFormulas.every((formula) => Math.abs(formula.deltaRange.min) <= targetWindow),
    },
    allMenu: {
      primeSet: allFormulas.map((formula) => formula.prime),
      formulasByPrime: Object.fromEntries(allFormulas.map((formula) => [formula.prime, formula])),
    },
    coverage: {
      primaryCovered: primaryCoveredRows.length,
      primaryMisses: primaryMisses.length,
      allCovered: allCoveredRows.length,
      allMisses: allMisses.length,
      firstPrimaryMiss: primaryMisses[0] ?? null,
      firstAllMiss: allMisses[0] ?? null,
      primaryCoverPrimeCounts: makeCountMap(primaryCoverPrimes),
      allCoverPrimeCounts: makeCountMap(allCoverPrimes),
    },
    seedCheck: firstBlockedLeft === null
      ? null
      : rows.find((row) => row.left === firstBlockedLeft) ?? null,
    rowSamples: {
      firstRows: rows.slice(0, 5),
      primaryMisses: primaryMisses.slice(0, 5),
      allMisses: allMisses.slice(0, 5),
    },
    claims: {
      provesAllN: false,
      provesCollisionFreeMatching: false,
      provesEndpointFormulas: true,
      provesUniversalWindowAvailabilityForPrimaryMenu: primaryFormulas.every((formula) => Math.abs(formula.deltaRange.min) <= targetWindow),
      provesBoundedPrimaryMenuCoverage: primaryMisses.length === 0 && exactForPrimaryCoveredEndpoints,
      provesBoundedAllMenuCoverage: allMisses.length === 0 && exactForAllCoveredEndpoints,
      screensBoundedPrimaryMenuCoverage: primaryMisses.length === 0,
      screensBoundedAllMenuCoverage: allMisses.length === 0,
    },
    nextTheoremOptions: buildNextTheoremOptions({
      targetWindow,
      primaryMisses,
      allMisses,
      primaryFormulas,
      fallbackFormulas,
    }),
  };
}

function summarizeEndpoint(endpoint) {
  if (!endpoint) return null;
  return {
    prime: endpoint.prime,
    k: endpoint.k,
    delta: endpoint.delta,
    right: endpoint.right,
    withinWindow: endpoint.withinWindow,
    squarefreeStatus: endpoint.squarefreeStatus,
    squareDivisorPrime: endpoint.squareDivisorPrime,
    squareDivisor: endpoint.squareDivisor,
    checkedSquarePrimeLimit: endpoint.checkedSquarePrimeLimit,
  };
}

function summarizeMissRow(row) {
  if (!row) return null;
  const endpoints = [...(row.primaryEndpoints ?? []), ...(row.fallbackEndpoints ?? [])];
  const usableWithinWindow = endpoints
    .filter((endpoint) => endpoint.withinWindow && endpoint.profileUsable)
    .sort((left, right) => Math.abs(left.delta) - Math.abs(right.delta));
  const usableOutsideWindow = endpoints
    .filter((endpoint) => !endpoint.withinWindow && endpoint.profileUsable)
    .sort((left, right) => Math.abs(left.delta) - Math.abs(right.delta));
  const blockedWithinWindow = endpoints
    .filter((endpoint) => endpoint.withinWindow && !endpoint.profileUsable)
    .sort((left, right) => Math.abs(left.delta) - Math.abs(right.delta));

  return {
    left: row.left,
    leftModResidualClass: row.leftModResidualClass,
    usableWithinWindow: usableWithinWindow.slice(0, 5).map(summarizeEndpoint),
    nearestUsableOutsideWindow: usableOutsideWindow.slice(0, 5).map(summarizeEndpoint),
    blockedWithinWindow: blockedWithinWindow.slice(0, 5).map(summarizeEndpoint),
  };
}

function summarizeProfileForWindow(packet) {
  return {
    window: packet.target.targetWindow,
    rowCount: packet.target.rowCount,
    squareCheck: packet.target.squareCheck,
    primaryCovered: packet.coverage.primaryCovered,
    primaryMisses: packet.coverage.primaryMisses,
    allCovered: packet.coverage.allCovered,
    allMisses: packet.coverage.allMisses,
    firstPrimaryMiss: summarizeMissRow(packet.coverage.firstPrimaryMiss),
    firstAllMiss: summarizeMissRow(packet.coverage.firstAllMiss),
    primaryCoverPrimeCounts: packet.coverage.primaryCoverPrimeCounts,
    allCoverPrimeCounts: packet.coverage.allCoverPrimeCounts,
    claims: {
      provesBoundedPrimaryMenuCoverage: packet.claims.provesBoundedPrimaryMenuCoverage,
      provesBoundedAllMenuCoverage: packet.claims.provesBoundedAllMenuCoverage,
      screensBoundedPrimaryMenuCoverage: packet.claims.screensBoundedPrimaryMenuCoverage,
      screensBoundedAllMenuCoverage: packet.claims.screensBoundedAllMenuCoverage,
    },
  };
}

function compileWindowGrid(args) {
  const windows = [...new Set(args.windowGrid)].sort((left, right) => left - right);
  const profiles = windows.map((window) => compileProfile({
    ...args,
    window,
    windowGrid: null,
    jsonOutput: null,
    markdownOutput: null,
  }));
  const summaries = profiles.map(summarizeProfileForWindow);
  const firstScreenPrimaryCovered = summaries.find((summary) => summary.primaryMisses === 0) ?? null;
  const firstScreenAllCovered = summaries.find((summary) => summary.allMisses === 0) ?? null;
  const firstProvedPrimaryCovered = summaries.find((summary) => summary.claims.provesBoundedPrimaryMenuCoverage) ?? null;
  const firstProvedAllCovered = summaries.find((summary) => summary.claims.provesBoundedAllMenuCoverage) ?? null;
  const baseline = profiles[0];
  const gridHasCoveredEndpoints = profiles.some((profile) => profile.coverage.allCovered > 0);
  const gridCoveredEndpointsExact = gridHasCoveredEndpoints
    && profiles.every((profile) => profile.coverage.allCovered === 0 || profile.target.squareCheck.exactForAllCoveredEndpoints);
  const gridSquareCheckInterpretation = !gridHasCoveredEndpoints
    ? 'No full-menu covered endpoint was selected in any profiled window; inspect candidate square-divisor statuses and window availability.'
    : gridCoveredEndpointsExact
      ? 'Every covered endpoint selected by each profiled full menu is exactly squarefree-certified.'
      : 'Fast obstruction screening is present; no checked square divisor is not always an all-prime squarefree proof.';

  return {
    schema: 'erdos.number_theory.p848_endpoint_window_grid/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    target: {
      description: `${baseline.target.description} window grid`,
      predecessorProof: args.predecessorProof,
      outsider: args.outsider,
      residualClass: baseline.target.residualClass,
      start: baseline.target.start,
      end: baseline.target.end,
      rowCount: baseline.target.rowCount,
      windows,
      squareCheck: gridSquareCheckInterpretation,
    },
    primaryMenu: baseline.primaryMenu.primeSet,
    fallbackMenu: baseline.fallbackMenu.primeSet,
    firstScreenPrimaryCoveredWindow: firstScreenPrimaryCovered?.window ?? null,
    firstScreenAllCoveredWindow: firstScreenAllCovered?.window ?? null,
    firstProvedPrimaryCoveredWindow: firstProvedPrimaryCovered?.window ?? null,
    firstProvedAllCoveredWindow: firstProvedAllCovered?.window ?? null,
    summaries,
    interpretation: {
      windowGridProvesAllN: false,
      warning: 'A window grid is a bounded selector profile. It can identify the next theorem boundary but does not prove all-N coverage or matching by itself.',
    },
    nextTheoremOptions: buildWindowGridNextTheoremOptions({ summaries }),
  };
}

function buildWindowGridNextTheoremOptions({ summaries }) {
  const options = [];
  const firstAllCovered = summaries.find((summary) => summary.allMisses === 0) ?? null;
  const finalSummary = summaries.at(-1) ?? null;
  if (firstAllCovered) {
    options.push({
      id: 'window_relaxation_candidate',
      status: 'candidate',
      statement: `The full menu first covers the bounded scan at window=${firstAllCovered.window}; decide whether that relaxation is theorem-legal or requires a replacement-path handoff.`,
    });
  }
  if (finalSummary?.allMisses > 0) {
    options.push({
      id: 'window_grid_first_remaining_miss',
      status: 'needed',
      statement: `Even the largest profiled window=${finalSummary.window} has first full-menu miss left=${finalSummary.firstAllMiss?.left}; inspect that row before adding more primes or windows.`,
    });
  }
  options.push({
    id: 'availability_strata_lift',
    status: 'needed',
    statement: 'Convert the observed window thresholds into residue-class availability strata rather than continuing a row-by-row staircase.',
  });
  return options;
}

function buildNextTheoremOptions({ targetWindow, primaryMisses, allMisses, primaryFormulas, fallbackFormulas }) {
  const options = [];
  if (primaryFormulas.every((formula) => Math.abs(formula.deltaRange.min) <= targetWindow)) {
    options.push({
      id: 'primary_menu_universal_window_lemma',
      status: 'ready',
      statement: `Every primary endpoint prime stays inside the ${targetWindow}-window by its delta range.`,
    });
  }
  if (primaryMisses.length === 0) {
    options.push({
      id: 'primary_menu_squarefree_hitting_lemma',
      status: 'candidate',
      statement: 'The primary menu alone covers the bounded scan; attempt a symbolic squarefree-hitting lemma for the primary menu.',
    });
  } else {
    options.push({
      id: 'primary_menu_first_miss',
      status: 'needed',
      statement: `The primary menu misses at left=${primaryMisses[0].left}; inspect this miss before adding more abstraction.`,
    });
  }
  if (allMisses.length === 0) {
    options.push({
      id: 'full_menu_squarefree_hitting_lemma',
      status: 'candidate',
      statement: 'The full menu covers the bounded scan; try to prove a symbolic finite-menu squarefree-hitting lemma.',
    });
  } else {
    options.push({
      id: 'full_menu_first_miss',
      status: 'needed',
      statement: `The full menu misses at left=${allMisses[0].left}; emit this row as the next deterministic obstruction.`,
    });
  }
  if (fallbackFormulas.some((formula) => Math.abs(formula.deltaRange.min) > targetWindow)) {
    options.push({
      id: 'fallback_window_availability_split',
      status: 'optional',
      statement: 'Some fallback primes are not universally inside the window; split fallback usage into availability residues before relying on them symbolically.',
    });
  }
  return options;
}

function renderMarkdown(packet) {
  const lines = [];
  lines.push(`# Problem 848 Endpoint Menu Compiler`);
  lines.push('');
  lines.push(`- Target: \`${packet.target.description}\``);
  lines.push(`- Residual class: \`left ≡ ${packet.target.residualClass.residue} mod ${packet.target.residualClass.modulus}\``);
  lines.push(`- Scan: \`${packet.target.start}..${packet.target.end}\` over \`${packet.target.rowCount}\` residual rows`);
  lines.push(`- Window: \`${packet.target.targetWindow}\``);
  lines.push(`- Square check: \`${packet.target.squareCheck.interpretation}\``);
  lines.push(`- Primary menu: \`${packet.primaryMenu.primeSet.join(',')}\``);
  lines.push(`- Fallback menu: \`${packet.fallbackMenu.primeSet.join(',') || '(none)'}\``);
  lines.push('');
  lines.push(`## Endpoint Formulas`);
  lines.push('');
  for (const formula of Object.values(packet.allMenu.formulasByPrime)) {
    lines.push(`- p=${formula.prime}: \`${formula.kFormula.text}\`; delta range \`${formula.deltaRange.min}..${formula.deltaRange.max}\`; within ${packet.target.targetWindow}: \`${Math.abs(formula.deltaRange.min) <= packet.target.targetWindow}\``);
  }
  lines.push('');
  lines.push(`## Coverage`);
  lines.push('');
  lines.push(`- Primary covered: \`${packet.coverage.primaryCovered}/${packet.target.rowCount}\``);
  lines.push(`- Full menu covered: \`${packet.coverage.allCovered}/${packet.target.rowCount}\``);
  lines.push(`- First primary miss: \`${packet.coverage.firstPrimaryMiss?.left ?? '(none)'}\``);
  lines.push(`- First full-menu miss: \`${packet.coverage.firstAllMiss?.left ?? '(none)'}\``);
  lines.push(`- Primary cover prime counts: \`${JSON.stringify(packet.coverage.primaryCoverPrimeCounts)}\``);
  lines.push(`- Full cover prime counts: \`${JSON.stringify(packet.coverage.allCoverPrimeCounts)}\``);
  lines.push('');
  const firstAllMissSummary = summarizeMissRow(packet.coverage.firstAllMiss);
  if (firstAllMissSummary) {
    lines.push(`## First Full-Menu Miss Detail`);
    lines.push('');
    lines.push(`- Left: \`${firstAllMissSummary.left}\``);
    lines.push(`- Left residual: \`${firstAllMissSummary.leftModResidualClass}\``);
    if (firstAllMissSummary.blockedWithinWindow.length > 0) {
      lines.push(`- Blocked within-window endpoints: \`${JSON.stringify(firstAllMissSummary.blockedWithinWindow)}\``);
    }
    if (firstAllMissSummary.nearestUsableOutsideWindow.length > 0) {
      lines.push(`- Nearest unblocked outside-window endpoints: \`${JSON.stringify(firstAllMissSummary.nearestUsableOutsideWindow)}\``);
    }
    lines.push('');
  }
  lines.push(`## Next Theorem Options`);
  lines.push('');
  for (const option of packet.nextTheoremOptions) {
    lines.push(`- \`${option.id}\` [${option.status}]: ${option.statement}`);
  }
  lines.push('');
  lines.push(`## Boundary`);
  lines.push('');
  lines.push('- This compiler proves endpoint formulas and bounded coverage profiles only.');
  lines.push('- It does not prove all-N squarefree hitting or collision-free matching by itself.');
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function renderWindowGridMarkdown(packet) {
  const lines = [];
  lines.push(`# Problem 848 Endpoint Window Grid`);
  lines.push('');
  lines.push(`- Target: \`${packet.target.description}\``);
  lines.push(`- Residual class: \`left ≡ ${packet.target.residualClass.residue} mod ${packet.target.residualClass.modulus}\``);
  lines.push(`- Scan: \`${packet.target.start}..${packet.target.end}\` over \`${packet.target.rowCount}\` residual rows`);
  lines.push(`- Windows: \`${packet.target.windows.join(',')}\``);
  lines.push(`- Square check: \`${packet.target.squareCheck}\``);
  lines.push(`- Primary menu: \`${packet.primaryMenu.join(',')}\``);
  lines.push(`- Fallback menu: \`${packet.fallbackMenu.join(',') || '(none)'}\``);
  lines.push(`- First screen primary-covered window: \`${packet.firstScreenPrimaryCoveredWindow ?? '(none)'}\``);
  lines.push(`- First screen full-menu-covered window: \`${packet.firstScreenAllCoveredWindow ?? '(none)'}\``);
  lines.push('');
  lines.push(`## Coverage By Window`);
  lines.push('');
  for (const summary of packet.summaries) {
    lines.push(`- window=${summary.window}: primary \`${summary.primaryCovered}/${summary.rowCount}\`, full \`${summary.allCovered}/${summary.rowCount}\`, first primary miss \`${summary.firstPrimaryMiss?.left ?? '(none)'}\`, first full miss \`${summary.firstAllMiss?.left ?? '(none)'}\``);
    const nearest = summary.firstAllMiss?.nearestUsableOutsideWindow?.[0] ?? null;
    if (nearest) {
      lines.push(`- window=${summary.window} nearest unblocked outside-window endpoint for first full miss: p=${nearest.prime}, delta=${nearest.delta}, right=${nearest.right}, status=${nearest.squarefreeStatus}`);
    }
  }
  lines.push('');
  lines.push(`## Next Theorem Options`);
  lines.push('');
  for (const option of packet.nextTheoremOptions) {
    lines.push(`- \`${option.id}\` [${option.status}]: ${option.statement}`);
  }
  lines.push('');
  lines.push(`## Boundary`);
  lines.push('');
  lines.push(`- ${packet.interpretation.warning}`);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function renderAvailabilityMarkdown(packet) {
  const lines = [];
  lines.push(`# Problem 848 Endpoint Availability Profile`);
  lines.push('');
  lines.push(`- Target: \`${packet.target.description}\``);
  lines.push(`- Residual class: \`left ≡ ${packet.target.residualClass.residue} mod ${packet.target.residualClass.modulus}\``);
  lines.push(`- Windows: \`${packet.target.windows.join(',')}\``);
  lines.push(`- Primary menu: \`${packet.primaryMenu.primeSet.join(',')}\``);
  lines.push(`- Fallback menu: \`${packet.fallbackMenu.primeSet.join(',') || '(none)'}\``);
  lines.push('');
  lines.push(`## Window Thresholds`);
  lines.push('');
  for (const window of packet.target.windows) {
    lines.push(`- window=${window}: endpoint is available iff \`k <= ${maxKForWindow(window)}\`; minimal exact threshold window is \`${windowFromMaxK(maxKForWindow(window))}\``);
  }
  lines.push('');
  lines.push(`## Availability By Prime`);
  lines.push('');
  for (const formula of Object.values(packet.formulasByPrime)) {
    lines.push(`- p=${formula.prime}: \`${formula.kFormula.text}\``);
    for (const rule of formula.availabilityByWindow) {
      lines.push(`- p=${formula.prime}, window=${rule.window}: \`${rule.kFormulaInT}\`, t-period \`${rule.tPeriod}\`, available \`${rule.availableResidueCount}/${rule.tPeriod}\`, universal \`${rule.universallyWithinWindow}\``);
    }
  }
  if (packet.witnessRows.length > 0) {
    lines.push('');
    lines.push(`## Witness Rows`);
    lines.push('');
    for (const row of packet.witnessRows.slice(0, 5)) {
      const endpoints = row.endpoints
        .map((endpoint) => `p=${endpoint.prime}: k=${endpoint.k}, delta=${endpoint.delta}, windows=${JSON.stringify(endpoint.withinWindows)}`)
        .join('; ');
      lines.push(`- left=${row.left}: ${endpoints}`);
    }
  }
  lines.push('');
  lines.push(`## Next Theorem Options`);
  lines.push('');
  for (const option of packet.nextTheoremOptions) {
    lines.push(`- \`${option.id}\` [${option.status}]: ${option.statement}`);
  }
  lines.push('');
  lines.push(`## Boundary`);
  lines.push('');
  lines.push(`- ${packet.interpretation.warning}`);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function writeOutput(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const packet = args.availabilityProfile
    ? compileAvailabilityProfile(args)
    : args.windowGrid
      ? compileWindowGrid(args)
      : compileProfile(args);
  const json = JSON.stringify(packet, null, 2);
  if (args.jsonOutput) {
    writeOutput(args.jsonOutput, `${json}\n`);
  }
  if (args.markdownOutput) {
    writeOutput(
      args.markdownOutput,
      args.availabilityProfile
        ? renderAvailabilityMarkdown(packet)
        : args.windowGrid
          ? renderWindowGridMarkdown(packet)
          : renderMarkdown(packet),
    );
  }
  if (!args.jsonOutput && !args.markdownOutput) {
    console.log(json);
  } else {
    const isAvailabilityProfile = packet.schema === 'erdos.number_theory.p848_endpoint_availability_profile/1';
    const isWindowGrid = packet.schema === 'erdos.number_theory.p848_endpoint_window_grid/1';
    console.log(JSON.stringify(isAvailabilityProfile
      ? {
        ok: true,
        jsonOutput: args.jsonOutput,
        markdownOutput: args.markdownOutput,
        windows: packet.target.windows,
        witnessRowCount: packet.target.witnessRowCount,
      }
      : isWindowGrid
      ? {
        ok: true,
        jsonOutput: args.jsonOutput,
        markdownOutput: args.markdownOutput,
        firstScreenPrimaryCoveredWindow: packet.firstScreenPrimaryCoveredWindow,
        firstScreenAllCoveredWindow: packet.firstScreenAllCoveredWindow,
        firstProvedPrimaryCoveredWindow: packet.firstProvedPrimaryCoveredWindow,
        firstProvedAllCoveredWindow: packet.firstProvedAllCoveredWindow,
        largestWindow: packet.target.windows.at(-1),
        largestWindowAllMisses: packet.summaries.at(-1)?.allMisses ?? null,
      }
      : {
        ok: true,
        jsonOutput: args.jsonOutput,
        markdownOutput: args.markdownOutput,
        primaryCovered: packet.coverage.primaryCovered,
        primaryMisses: packet.coverage.primaryMisses,
        allCovered: packet.coverage.allCovered,
        allMisses: packet.coverage.allMisses,
        firstPrimaryMiss: packet.coverage.firstPrimaryMiss?.left ?? null,
        firstAllMiss: packet.coverage.firstAllMiss?.left ?? null,
      }, null, 2));
  }
}

main();
