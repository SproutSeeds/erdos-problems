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

const DEFAULT_SQUAREFREE_OBSTRUCTION_PACKET = path.join(
  problemDir,
  'SPLIT_ATOM_PACKETS',
  'DYNAMIC_MARGIN_PROOFS',
  'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_hitting_obstruction.json',
);

const DEFAULT_OBSTRUCTION_SUBCLASS_REPAIR_PACKET = path.join(
  problemDir,
  'SPLIT_ATOM_PACKETS',
  'DYNAMIC_MARGIN_PROOFS',
  'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_subclass_repair.json',
);

const DEFAULT_P41_AVAILABILITY_SPLIT_PACKET = path.join(
  problemDir,
  'SPLIT_ATOM_PACKETS',
  'DYNAMIC_MARGIN_PROOFS',
  'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_squarefree_obstruction_p41_availability_split.json',
);

function parseArgs(argv) {
  const args = {
    predecessorProof: DEFAULT_PREDECESSOR_PROOF,
    obstructionPacket: DEFAULT_SQUAREFREE_OBSTRUCTION_PACKET,
    obstructionRepairPacket: DEFAULT_OBSTRUCTION_SUBCLASS_REPAIR_PACKET,
    availabilitySplitPacket: DEFAULT_P41_AVAILABILITY_SPLIT_PACKET,
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
    legalityAudit: false,
    availabilityCover: false,
    squarefreeHittingAudit: false,
	    obstructionSubclassRepair: false,
	    obstructionAvailabilitySplit: false,
	    availabilityObstructionRepair: false,
	    availabilityObstructionSuccessor: false,
    expandedWindow: 10000,
    maxSquarePrime: null,
    squareCheck: 'trial',
    factorTimeoutMs: 120000,
    factorCertificate: null,
    jsonOutput: null,
    markdownOutput: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--predecessor-proof') {
      args.predecessorProof = argv[++index];
    } else if (token === '--obstruction-packet') {
      args.obstructionPacket = argv[++index];
    } else if (token === '--obstruction-repair-packet') {
      args.obstructionRepairPacket = argv[++index];
    } else if (token === '--availability-split-packet') {
      args.availabilitySplitPacket = argv[++index];
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
    } else if (token === '--legality-audit') {
      args.legalityAudit = true;
    } else if (token === '--availability-cover') {
      args.availabilityCover = true;
    } else if (token === '--squarefree-hitting-audit') {
      args.squarefreeHittingAudit = true;
    } else if (token === '--obstruction-subclass-repair') {
      args.obstructionSubclassRepair = true;
    } else if (token === '--obstruction-availability-split') {
      args.obstructionAvailabilitySplit = true;
	    } else if (token === '--availability-obstruction-repair') {
	      args.availabilityObstructionRepair = true;
	    } else if (token === '--availability-obstruction-successor') {
	      args.availabilityObstructionSuccessor = true;
    } else if (token === '--expanded-window') {
      args.expandedWindow = Number(argv[++index]);
    } else if (token === '--max-square-prime') {
      args.maxSquarePrime = Number(argv[++index]);
    } else if (token === '--square-check') {
      args.squareCheck = argv[++index];
    } else if (token === '--factor-timeout-ms') {
      args.factorTimeoutMs = Number(argv[++index]);
    } else if (token === '--factor-certificate') {
      args.factorCertificate = argv[++index];
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
  if (!['trial', 'factor'].includes(args.squareCheck)) {
    throw new Error('--square-check must be one of: trial, factor');
  }
  if (!Number.isInteger(args.factorTimeoutMs) || args.factorTimeoutMs < 0) {
    throw new Error('--factor-timeout-ms must be a non-negative integer; use 0 to disable');
  }
  const specialModeCount = [
    args.availabilityProfile,
    args.legalityAudit,
    args.availabilityCover,
    args.squarefreeHittingAudit,
	    args.obstructionSubclassRepair,
	    args.obstructionAvailabilitySplit,
	    args.availabilityObstructionRepair,
	    args.availabilityObstructionSuccessor,
	  ]
	    .filter(Boolean).length;
	  if (specialModeCount > 1) {
	    throw new Error('--availability-profile, --legality-audit, --availability-cover, --squarefree-hitting-audit, --obstruction-subclass-repair, --obstruction-availability-split, --availability-obstruction-repair, and --availability-obstruction-successor are mutually exclusive');
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node problem848_endpoint_menu_compiler.mjs [options]

Compile a deterministic endpoint-menu selector profile for Problem 848.

Options:
  --predecessor-proof <path>  Seed proof JSON to read defaults from
  --obstruction-packet <path> Squarefree obstruction packet for subclass repair
  --obstruction-repair-packet <path>
                              Obstruction-subclass repair packet for availability split
  --availability-split-packet <path>
                              Availability-split packet for the next square-obstruction repair
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
  --legality-audit            Emit the endpoint-window legality decision packet
  --availability-cover        Emit the endpoint availability/squarefree-hitting handoff packet
  --squarefree-hitting-audit  Emit the first square-obstruction subclass for the residue-cover handoff
  --obstruction-subclass-repair
                              Emit the representative repair packet for the square-obstruction subclass
  --obstruction-availability-split
                              Emit the availability/squarefree audit for the repaired obstruction subclass
	  --availability-obstruction-repair
	                              Emit the representative repair packet for the availability square-obstruction subclass
	  --availability-obstruction-successor
	                              Emit a successor packet from a no-repair availability-obstruction probe
  --expanded-window <n>       Smaller predecessor window (default: 10000)
  --max-square-prime <n>      Square-divisor scan prime limit
  --square-check <mode>       trial or factor (default: trial)
  --factor-timeout-ms <n>     Max wall-clock ms for factor mode per packet (default: 120000; 0 disables)
  --factor-certificate <path> Exact factor certificate JSON for a hard endpoint
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

function safeJsonInteger(value) {
  const bigValue = BigInt(value);
  if (bigValue >= BigInt(Number.MIN_SAFE_INTEGER) && bigValue <= BigInt(Number.MAX_SAFE_INTEGER)) {
    return Number(bigValue);
  }
  return bigValue.toString();
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

function gcdBigInt(a, b) {
  let left = a < 0n ? -a : a;
  let right = b < 0n ? -b : b;
  while (right !== 0n) {
    [left, right] = [right, left % right];
  }
  return left;
}

function modularPower(base, exponent, modulus) {
  let result = 1n;
  let value = positiveModulo(base, modulus);
  let remaining = BigInt(exponent);
  while (remaining > 0n) {
    if (remaining & 1n) {
      result = (result * value) % BigInt(modulus);
    }
    value = (value * value) % BigInt(modulus);
    remaining >>= 1n;
  }
  return result;
}

function isPrimeBigInt(value) {
  const n = BigInt(value);
  if (n < 2n) return false;
  const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  for (const prime of smallPrimes) {
    if (n === prime) return true;
    if (n % prime === 0n) return false;
  }

  let d = n - 1n;
  let s = 0n;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s += 1n;
  }

  const bases = [2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n];
  for (const base of bases) {
    if (base % n === 0n) continue;
    let x = modularPower(base, d, n);
    if (x === 1n || x === n - 1n) continue;
    let witnessedComposite = true;
    for (let round = 1n; round < s; round += 1n) {
      x = (x * x) % n;
      if (x === n - 1n) {
        witnessedComposite = false;
        break;
      }
    }
    if (witnessedComposite) return false;
  }
  return true;
}

function factorTimeoutError(options) {
  return new Error(`factorization exceeded --factor-timeout-ms=${options.timeoutMs}`);
}

function checkFactorDeadline(options = {}) {
  if (options.deadlineMs && Date.now() >= options.deadlineMs) {
    throw factorTimeoutError(options);
  }
}

function createFactorOptions(args) {
  if (args.squareCheck !== 'factor' || args.factorTimeoutMs === 0) {
    return {};
  }
  return {
    timeoutMs: args.factorTimeoutMs,
    deadlineMs: Date.now() + args.factorTimeoutMs,
  };
}

function pollardRho(value, options = {}) {
  checkFactorDeadline(options);
  const n = BigInt(value);
  if (n % 2n === 0n) return 2n;
  if (n % 3n === 0n) return 3n;
  if (n % 5n === 0n) return 5n;

  for (let c = 1n; c < 128n; c += 1n) {
    checkFactorDeadline(options);
    for (let seed = 2n; seed < 16n; seed += 1n) {
      checkFactorDeadline(options);
      let y = seed;
      let r = 1n;
      const m = 128n;
      let g = 1n;
      let q = 1n;
      let x = 0n;
      let ys = 0n;
      const f = (input) => (input * input + c) % n;

      for (let round = 0; round < 64 && g === 1n; round += 1) {
        checkFactorDeadline(options);
        x = y;
        for (let index = 0n; index < r; index += 1n) {
          y = f(y);
        }

        let k = 0n;
        while (k < r && g === 1n) {
          checkFactorDeadline(options);
          ys = y;
          const upper = m < r - k ? m : r - k;
          for (let index = 0n; index < upper; index += 1n) {
            y = f(y);
            const difference = x > y ? x - y : y - x;
            q = (q * difference) % n;
          }
          g = gcdBigInt(q, n);
          k += m;
        }
        r *= 2n;
      }

      if (g === n) {
        g = 1n;
        for (let iteration = 0; iteration < 100000 && g === 1n; iteration += 1) {
          if (iteration % 1024 === 0) checkFactorDeadline(options);
          ys = f(ys);
          const difference = x > ys ? x - ys : ys - x;
          g = gcdBigInt(difference, n);
        }
      }

      if (g > 1n && g < n) {
        return g;
      }
    }
  }

  throw new Error(`Pollard Rho failed to split ${n}`);
}

function factorBigInt(value, factors = [], options = {}) {
  checkFactorDeadline(options);
  const n = BigInt(value);
  if (n === 1n) return factors;
  if (isPrimeBigInt(n)) {
    factors.push(n);
    return factors;
  }
  const divisor = pollardRho(n, options);
  factorBigInt(divisor, factors, options);
  factorBigInt(n / divisor, factors, options);
  return factors;
}

function repeatedPrimeFactor(value, options = {}) {
  const factors = factorBigInt(BigInt(value), [], options).sort((left, right) => left < right ? -1 : left > right ? 1 : 0);
  for (let index = 1; index < factors.length; index += 1) {
    if (factors[index] === factors[index - 1]) {
      const prime = factors[index];
      return {
        prime: Number(prime),
        square: Number(prime * prime),
      };
    }
  }
  return null;
}

function factorCertificateEntries(certificate) {
  if (Array.isArray(certificate?.factors)) {
    return certificate.factors.map((entry) => ({
      factor: BigInt(entry.factor),
      exponent: Number(entry.exponent ?? 1),
    }));
  }
  return Object.entries(certificate?.factors ?? {}).map(([factor, exponent]) => ({
    factor: BigInt(factor),
    exponent: Number(exponent),
  }));
}

function validateFactorCertificate(certificate, endpoint) {
  if (!certificate) return null;
  if (Number(certificate.endpointPrime) !== endpoint.prime) return null;
  if (String(certificate.left) !== String(endpoint.left ?? '')) return null;
  if (String(certificate.right) !== String(endpoint.right)) return null;
  if (String(certificate.crossProductPlusOne) !== String(endpoint.crossProductPlusOne)) return null;

  const entries = factorCertificateEntries(certificate);
  let product = 1n;
  for (const entry of entries) {
    if (!Number.isInteger(entry.exponent) || entry.exponent < 1) {
      throw new Error(`Invalid factor-certificate exponent for factor ${entry.factor}`);
    }
    product *= entry.factor ** BigInt(entry.exponent);
  }
  if (product !== BigInt(endpoint.crossProductPlusOne)) {
    throw new Error(`Factor certificate ${certificate.certificateId ?? '(unnamed)'} does not multiply to endpoint cross product`);
  }

  const repeated = entries.find((entry) => entry.exponent > 1) ?? null;
  return {
    certificateId: certificate.certificateId ?? null,
    repeated: repeated
      ? {
        prime: Number(repeated.factor),
        square: Number(repeated.factor * repeated.factor),
      }
      : null,
  };
}

function findFactorCertificate(certificatePacket, endpoint) {
  if (!certificatePacket) return null;
  const certificates = Array.isArray(certificatePacket.certificates)
    ? certificatePacket.certificates
    : [certificatePacket];
  for (const certificate of certificates) {
    const validated = validateFactorCertificate(certificate, endpoint);
    if (validated) return validated;
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
  const leftBig = BigInt(left);
  const k = Number(positiveModulo(
    BigInt(formula.kFormula.leftCoefficient) * leftBig + BigInt(formula.kFormula.constant),
    formula.primeSquare,
  ));
  const delta = -14 - 25 * k;
  const right = leftBig + BigInt(delta);
  const outsiderCompatibilityResidue = Number(positiveModulo(BigInt(outsider) * right + 1n, formula.primeSquare));
  const crossProductPlusOne = leftBig * right + 1n;
  return {
    prime: formula.prime,
    k,
    delta,
    right: safeJsonInteger(right),
    rightMod25: Number(positiveModulo(right, 25)),
    withinWindow: null,
    compatibilityModPrimeSquare: outsiderCompatibilityResidue,
    crossProductPlusOne: crossProductPlusOne.toString(),
  };
}

function evaluateEndpoint({ left, formula, outsider, window, squarePrimes, squareCheck, factorOptions = {}, factorCertificates = null }) {
  const endpoint = endpointForLeft({ left, formula, outsider });
  const factorMode = squareCheck === 'factor';
  const factorCertificate = factorMode ? findFactorCertificate(factorCertificates, { ...endpoint, left: safeJsonInteger(BigInt(left)) }) : null;
  const squareWitness = factorMode
    ? factorCertificate
      ? factorCertificate.repeated
      : repeatedPrimeFactor(endpoint.crossProductPlusOne, factorOptions)
    : firstSquareDivisor(endpoint.crossProductPlusOne, squarePrimes);
  const checkedSquarePrimeLimit = factorMode ? null : squarePrimes.at(-1) ?? null;
  const exactSquarefree = factorMode || (
    checkedSquarePrimeLimit !== null
      && BigInt(checkedSquarePrimeLimit) * BigInt(checkedSquarePrimeLimit) >= BigInt(endpoint.crossProductPlusOne)
  );
  const squarefreeStatus = squareWitness
    ? 'non_squarefree'
    : exactSquarefree
      ? 'exact_squarefree'
      : 'no_checked_square_divisor';
  return {
    ...endpoint,
    withinWindow: endpoint.delta <= -14 && endpoint.delta >= -window,
    checkedSquarePrimeLimit,
    squareCheckMode: squareCheck,
    squareDivisorPrime: squareWitness?.prime ?? null,
    squareDivisor: squareWitness?.square ?? null,
    factorCertificateId: factorCertificate?.certificateId ?? null,
    squarefree: exactSquarefree && squareWitness === null,
    squarefreeStatus,
    profileUsable: squareWitness === null,
  };
}

function alignStartToResidue(start, residue, modulus) {
  const offset = Number(positiveModulo(BigInt(residue) - BigInt(start), modulus));
  return start + offset;
}

function alignStartToResidueBigInt(start, residue, modulus) {
  const startBig = BigInt(start);
  const offset = positiveModulo(BigInt(residue) - startBig, modulus);
  return startBig + offset;
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
  const factorMode = args.squareCheck === 'factor';
  const maxSquarePrime = factorMode ? null : args.maxSquarePrime ?? Math.ceil(Math.sqrt(Number(BigInt(end) * BigInt(end) + 1n)));
  const squarePrimes = factorMode ? [] : primeSieve(maxSquarePrime);
  const factorOptions = createFactorOptions(args);
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
      squareCheck: args.squareCheck,
      factorOptions,
    }));
    const fallbackEndpoints = fallbackFormulas.map((formula) => evaluateEndpoint({
      left,
      formula,
      outsider: args.outsider,
      window: targetWindow,
      squarePrimes,
      squareCheck: args.squareCheck,
      factorOptions,
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
  const checkedPrimeLimit = factorMode ? null : squarePrimes.at(-1) ?? null;
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
        mode: args.squareCheck,
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
    factorCertificateId: endpoint.factorCertificateId,
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

function compileLegalityAudit(args) {
  const defaults = resolveProfileDefaults(args);
  const windows = [...new Set(args.windowGrid ?? [defaults.targetWindow, 28500])].sort((left, right) => left - right);
  const inheritedWindow = defaults.targetWindow;
  const windowGrid = compileWindowGrid({
    ...args,
    windowGrid: windows,
    availabilityProfile: false,
    legalityAudit: false,
    jsonOutput: null,
    markdownOutput: null,
  });
  const availabilityProfile = compileAvailabilityProfile({
    ...args,
    windowGrid: windows,
    availabilityProfile: true,
    legalityAudit: false,
    jsonOutput: null,
    markdownOutput: null,
  });
  const inheritedSummary = windowGrid.summaries.find((summary) => summary.window === inheritedWindow)
    ?? windowGrid.summaries[0]
    ?? null;
  const firstCoveredSummary = windowGrid.summaries.find((summary) => summary.claims.provesBoundedAllMenuCoverage) ?? null;
  const candidateWindow = firstCoveredSummary?.window ?? windows.at(-1);
  const candidateSummary = windowGrid.summaries.find((summary) => summary.window === candidateWindow) ?? null;
  const inheritedFirstMiss = inheritedSummary?.firstAllMiss ?? null;
  const candidateRepairProfile = inheritedFirstMiss
    ? compileProfile({
      ...args,
      start: inheritedFirstMiss.left,
      end: inheritedFirstMiss.left,
      window: candidateWindow,
      windowGrid: null,
      availabilityProfile: false,
      legalityAudit: false,
      jsonOutput: null,
      markdownOutput: null,
    })
    : null;
  const candidateRepairRow = candidateRepairProfile?.coverage?.allCovered === 1
    ? candidateRepairProfile.coverage.firstPrimaryMiss ?? candidateRepairProfile.seedCheck ?? candidateRepairProfile.rowSamples.firstRows[0] ?? null
    : null;
  const candidateRepair = candidateRepairRow?.firstAnySquarefree ?? null;
  const candidatePrimeRule = candidateRepair
    ? availabilityProfile.formulasByPrime[String(candidateRepair.prime)]?.availabilityByWindow
      ?.find((rule) => rule.window === candidateWindow) ?? null
    : null;
  const inheritedPrimeRule = candidateRepair
    ? availabilityProfile.formulasByPrime[String(candidateRepair.prime)]?.availabilityByWindow
      ?.find((rule) => rule.window === inheritedWindow) ?? null
    : null;
  const inheritedWindowFalsified = Boolean(inheritedSummary && inheritedSummary.allMisses > 0);
  const candidateWindowExactCoverage = Boolean(candidateSummary?.claims.provesBoundedAllMenuCoverage);
  const endpointRepairCertified = Boolean(
    candidateRepair
      && candidateRepair.withinWindow
      && candidateRepair.rightMod25 === 18
      && candidateRepair.compatibilityModPrimeSquare === 0
      && candidateRepair.squarefreeStatus === 'exact_squarefree'
  );
  const selectorLayerLegal = inheritedWindowFalsified && candidateWindowExactCoverage && endpointRepairCertified;
  const status = selectorLayerLegal
    ? 'selector_layer_window_relaxation_supported_matching_handoff_needed'
    : candidateWindowExactCoverage
      ? 'candidate_window_covers_scan_but_first_miss_repair_needs_review'
      : 'candidate_window_still_has_blocked_rows';

  return {
    schema: 'erdos.number_theory.p848_endpoint_window_legality_audit/2',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    status,
    activeAtom: 'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_lift_outP2_70_out25_23_smaller_side7_outsider_6323',
    scope: {
      split: 'D2_p13',
      outsider: args.outsider,
      residualClass: {
        leftModulus: defaults.residualClass.modulus,
        leftResidue: defaults.residualClass.residue,
      },
      selectorLayerOnly: true,
      matchingLayerSeparate: true,
    },
    windows: {
      inheritedWindow,
      candidateEndpointWindow: candidateWindow,
      deltaBeyondInheritedWindow: candidateRepair ? Math.abs(candidateRepair.delta) - inheritedWindow : null,
      inheritedMaxK: maxKForWindow(inheritedWindow),
      candidateMaxK: maxKForWindow(candidateWindow),
    },
    sourceProfiles: {
      predecessorProof: args.predecessorProof,
      scanStart: windowGrid.target.start,
      scanEnd: windowGrid.target.end,
      rowCount: windowGrid.target.rowCount,
      squareCheck: windowGrid.target.squareCheck,
    },
    observedEndpointRepair: candidateRepair
      ? {
        left: inheritedFirstMiss?.left ?? candidateRepairRow?.left ?? null,
        prime: candidateRepair.prime,
        k: candidateRepair.k,
        delta: candidateRepair.delta,
        right: candidateRepair.right,
        rightMod25: candidateRepair.rightMod25,
        insideInheritedWindow: candidateRepair.delta >= -inheritedWindow,
        insideCandidateWindow: candidateRepair.withinWindow,
        outsiderCompatibility: {
          expression: `${args.outsider} * right + 1`,
          compatibilityModPrimeSquare: candidateRepair.compatibilityModPrimeSquare,
          divisibleByPrimeSquare: candidateRepair.prime * candidateRepair.prime,
          primeSquare: `${candidateRepair.prime}^2`,
        },
        crossProduct: {
          expression: 'left * right + 1',
          value: candidateRepair.crossProductPlusOne,
          squarefreeStatus: candidateRepair.squarefreeStatus,
          exactSquarefreeCertified: candidateRepair.squarefreeStatus === 'exact_squarefree',
        },
      }
      : null,
    boundedEvidence: {
      windowGrid: windowGrid.summaries.map((summary) => ({
        window: summary.window,
        rows: summary.rowCount,
        fullCovered: summary.allCovered,
        fullMisses: summary.allMisses,
        firstFullMiss: summary.firstAllMiss?.left ?? null,
        exactFactorCoverage: summary.claims.provesBoundedAllMenuCoverage,
      })),
      inheritedWindowFalsified,
      candidateWindowExactCoverage,
      endpointRepairCertified,
    },
    availabilityStratumSeed: candidateRepair
      ? {
        prime: candidateRepair.prime,
        inheritedWindow: inheritedPrimeRule
          ? {
            maxK: inheritedPrimeRule.maxK,
            availableResidueCount: inheritedPrimeRule.availableResidueCount,
            period: inheritedPrimeRule.tPeriod,
            witnessAvailable: candidateRepair.k <= inheritedPrimeRule.maxK,
          }
          : null,
        candidateWindow: candidatePrimeRule
          ? {
            maxK: candidatePrimeRule.maxK,
            availableResidueCount: candidatePrimeRule.availableResidueCount,
            period: candidatePrimeRule.tPeriod,
            witnessAvailable: candidateRepair.k <= candidatePrimeRule.maxK,
            kFormulaInT: candidatePrimeRule.kFormulaInT,
          }
          : null,
      }
      : null,
    inheritedBoundaryAudit: {
      predecessorSeedEscapeWindow: defaults.predecessor.nextSubatom?.seedEscapeWindow ?? null,
      inheritedWindowMatchesPredecessorSeed: defaults.predecessor.nextSubatom?.seedEscapeWindow === inheritedWindow,
      observedReasonForInheritedWindow: 'The inherited cap is the predecessor nextSubatom.seedEscapeWindow carried into the selector lane.',
      notFoundInThisAudit: [
        `A theorem packet proving that ${inheritedWindow} is a collision-free matching invariant.`,
        `A theorem packet proving that endpoints with ${inheritedWindow} < |delta| <= ${candidateWindow} are illegal.`,
        `A theorem packet showing that the p${candidateRepair?.prime ?? '(unknown)'} endpoint at left=${inheritedFirstMiss?.left ?? '(unknown)'} breaks right-compatibility or squarefreeness.`,
      ],
    },
    selectorLayerDecision: {
      legalAtEndpointSelectorLayer: selectorLayerLegal,
      promotesAllN: false,
      provesCollisionFreeMatching: false,
      statement: selectorLayerLegal
        ? `At endpoint-selector scope, window ${candidateWindow} is the first profiled exact-factor window that repairs the inherited ${inheritedWindow}-window miss without violating side, outsider-compatibility, or cross-squarefree checks.`
        : `Window ${candidateWindow} is not yet certified enough to replace the inherited ${inheritedWindow} endpoint selector.`,
      boundary: 'This decision is endpoint-selector legality only. Collision-free matching and all-N squarefree hitting remain downstream theorem obligations.',
    },
    alreadySatisfiedAtEndpointLayer: [
      candidateRepair ? `The p${candidateRepair.prime} endpoint is inside the candidate ${candidateWindow} window.` : null,
      candidateRepair ? `The p${candidateRepair.prime} endpoint has right == 18 mod 25.` : null,
      candidateRepair ? `The p${candidateRepair.prime} endpoint satisfies outsider compatibility by construction.` : null,
      candidateRepair ? `The p${candidateRepair.prime} endpoint has exact squarefree cross product status ${candidateRepair.squarefreeStatus}.` : null,
      candidateSummary ? `The broad exact-factor grid covers ${candidateSummary.allCovered}/${candidateSummary.rowCount} rows at window ${candidateWindow}.` : null,
    ].filter(Boolean),
    notProvedHere: [
      'All-N coverage for every q17 residual row.',
      'Collision-free online matching.',
      'The D2/D3 dynamic-margin promotion.',
      'A symbolic residue-class squarefree-hitting lemma for the full endpoint menu.',
    ],
    theoremFork: [
      {
        id: 'prove_28500_endpoint_window_legality',
        status: selectorLayerLegal ? 'done_at_endpoint_selector_layer' : 'needs_review',
        statement: `Decide whether the q17 residual selector may use the candidate ${candidateWindow} endpoint window.`,
        completionRule: selectorLayerLegal
          ? 'Endpoint-selector legality is supported; route the remaining work to availability strata and matching handoff.'
          : `Either emit a symbolic legality lemma for window ${candidateWindow} or identify the exact invariant that forbids relaxing the old ${inheritedWindow} cap.`,
      },
      {
        id: 'preserve_25000_and_augment',
        status: selectorLayerLegal ? 'not_selected_unless_matching_invariant_found' : 'alternate_if_25000_is_structural',
        statement: `If ${inheritedWindow} is a real matching invariant, keep the cap and route left=${inheritedFirstMiss?.left ?? '(unknown)'} into a replacement/augmenting-path handoff instead of direct selector relaxation.`,
        completionRule: 'A bounded replacement path becomes a symbolic augmentation lemma, or emits the next deterministic obstruction.',
      },
      {
        id: 'availability_residue_cover',
        status: selectorLayerLegal ? 'next' : 'needed_after_fork',
        statement: 'Convert the p67 and fallback endpoint availability thresholds into residue-class strata so the loop stops extending by one row at a time.',
        completionRule: 'Every residual class is assigned to an endpoint prime/window stratum or the first unassigned residue class is emitted.',
      },
    ],
    recommendedNextAction: selectorLayerLegal
      ? 'promote_availability_residue_cover'
      : 'identify_window_relaxation_blocker_or_first_blocked_row',
  };
}

function compileAvailabilityCover(args) {
  const defaults = resolveProfileDefaults(args);
  const coverWindow = args.window ?? args.windowGrid?.at(-1) ?? 28500;
  const factorMode = args.squareCheck === 'factor';
  const maxSquarePrime = factorMode ? null : args.maxSquarePrime ?? Math.ceil(Math.sqrt(Number(BigInt(defaults.end) * BigInt(defaults.end) + 1n)));
  const squarePrimes = factorMode ? [] : primeSieve(maxSquarePrime);
  const factorOptions = createFactorOptions(args);
  const primaryFormulas = args.primes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const fallbackFormulas = args.fallbackPrimes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const allFormulas = [...primaryFormulas, ...fallbackFormulas];
  const firstLeft = alignStartToResidue(defaults.start, defaults.residualClass.residue, defaults.residualClass.modulus);
  const strataByPrime = new Map();
  const unassignedRows = [];
  let rowCount = 0;
  let exactSelectedEndpointCount = 0;

  for (let left = firstLeft; left <= defaults.end; left += defaults.residualClass.modulus) {
    rowCount += 1;
    const endpoints = allFormulas.map((formula) => evaluateEndpoint({
      left,
      formula,
      outsider: args.outsider,
      window: coverWindow,
      squarePrimes,
      squareCheck: args.squareCheck,
      factorOptions,
    }));
    const selected = endpoints.find((endpoint) => endpoint.withinWindow && endpoint.profileUsable) ?? null;
    const t = Math.trunc((left - defaults.residualClass.residue) / defaults.residualClass.modulus);

    if (!selected) {
      unassignedRows.push(summarizeMissRow({
        left,
        leftModResidualClass: Number(positiveModulo(left, defaults.residualClass.modulus)),
        primaryEndpoints: endpoints.filter((endpoint) => args.primes.includes(endpoint.prime)),
        fallbackEndpoints: endpoints.filter((endpoint) => args.fallbackPrimes.includes(endpoint.prime)),
      }));
      continue;
    }

    if (selected.squarefreeStatus === 'exact_squarefree') {
      exactSelectedEndpointCount += 1;
    }

    const formula = allFormulas.find((item) => item.prime === selected.prime);
    const primeSquare = selected.prime * selected.prime;
    if (!strataByPrime.has(selected.prime)) {
      const availabilityRule = formula
        ? compileAvailabilityRule({ formula, residualClass: defaults.residualClass, window: coverWindow })
        : null;
      strataByPrime.set(selected.prime, {
        prime: selected.prime,
        primeSquare,
        menuRole: args.primes.includes(selected.prime) ? 'primary' : 'fallback',
        rowCount: 0,
        firstLeft: left,
        lastLeft: left,
        minK: selected.k,
        maxK: selected.k,
        minDelta: selected.delta,
        maxDelta: selected.delta,
        selectedTResiduesModuloPrimeSquare: new Set(),
        rowSamples: [],
        availabilityRule,
      });
    }
    const stratum = strataByPrime.get(selected.prime);
    stratum.rowCount += 1;
    stratum.lastLeft = left;
    stratum.minK = Math.min(stratum.minK, selected.k);
    stratum.maxK = Math.max(stratum.maxK, selected.k);
    stratum.minDelta = Math.min(stratum.minDelta, selected.delta);
    stratum.maxDelta = Math.max(stratum.maxDelta, selected.delta);
    stratum.selectedTResiduesModuloPrimeSquare.add(Number(positiveModulo(t, primeSquare)));
    if (stratum.rowSamples.length < 8) {
      stratum.rowSamples.push({
        left,
        t,
        tResidueModuloPrimeSquare: Number(positiveModulo(t, primeSquare)),
        k: selected.k,
        delta: selected.delta,
        right: selected.right,
        squarefreeStatus: selected.squarefreeStatus,
      });
    }
  }

  const strata = [...strataByPrime.values()]
    .map((stratum) => {
      const selectedResidues = [...stratum.selectedTResiduesModuloPrimeSquare].sort((left, right) => left - right);
      return {
        prime: stratum.prime,
        primeSquare: stratum.primeSquare,
        menuRole: stratum.menuRole,
        rowCount: stratum.rowCount,
        firstLeft: stratum.firstLeft,
        lastLeft: stratum.lastLeft,
        kRange: {
          min: stratum.minK,
          max: stratum.maxK,
        },
        deltaRange: {
          min: stratum.minDelta,
          max: stratum.maxDelta,
        },
        selectedTResidueCountModuloPrimeSquare: selectedResidues.length,
        selectedTResiduesModuloPrimeSquareSample: selectedResidues.slice(0, 24),
        availabilityRule: stratum.availabilityRule
          ? {
            kFormulaInT: stratum.availabilityRule.kFormulaInT,
            maxK: stratum.availabilityRule.maxK,
            availableResidueCount: stratum.availabilityRule.availableResidueCount,
            period: stratum.availabilityRule.tPeriod,
            universallyWithinWindow: stratum.availabilityRule.universallyWithinWindow,
          }
          : null,
        rowSamples: stratum.rowSamples,
      };
    })
    .sort((left, right) => right.rowCount - left.rowCount || left.prime - right.prime);

  const assignedRows = strata.reduce((sum, stratum) => sum + stratum.rowCount, 0);
  const allAssigned = unassignedRows.length === 0;
  const selectedEndpointsExact = assignedRows > 0 && exactSelectedEndpointCount === assignedRows;
  const status = allAssigned && selectedEndpointsExact
    ? 'bounded_availability_residue_cover_seeded_symbolic_squarefree_hitting_needed'
    : 'first_unassigned_residue_class_emitted';

  return {
    schema: 'erdos.number_theory.p848_endpoint_availability_residue_cover/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    status,
    activeAtom: 'D2_p13_q17_window_relaxed_fallback_menu_availability_residue_cover',
    sourceLegalityAudit: path.join(
      problemDir,
      'SPLIT_ATOM_PACKETS',
      'DYNAMIC_MARGIN_PROOFS',
      'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_window_legality_audit.json',
    ),
    target: {
      description: 'q17 residual window-relaxed fallback endpoint-menu availability residue-cover handoff',
      predecessorProof: args.predecessorProof,
      outsider: args.outsider,
      residualClass: defaults.residualClass,
      start: firstLeft,
      end: defaults.end,
      rowCount,
      window: coverWindow,
      squareCheck: {
        mode: args.squareCheck,
        checkedPrimeLimit: factorMode ? null : squarePrimes.at(-1) ?? null,
        exactSelectedEndpointCount,
      },
    },
    menus: {
      primaryPrimes: args.primes,
      fallbackPrimes: args.fallbackPrimes,
    },
    coverage: {
      assignedRows,
      unassignedRows: unassignedRows.length,
      assignedRowFraction: rowCount === 0 ? null : assignedRows / rowCount,
      selectedEndpointsExact,
      firstUnassignedRow: unassignedRows[0] ?? null,
      selectedPrimeCounts: strata.map((stratum) => ({
        prime: stratum.prime,
        rowCount: stratum.rowCount,
      })),
    },
    strata,
    claims: {
      provesEndpointFormulas: true,
      provesBoundedEndpointAssignment: allAssigned && selectedEndpointsExact,
      provesAllN: false,
      provesCollisionFreeMatching: false,
      provesSymbolicSquarefreeHitting: false,
    },
    proofBoundary: 'This packet assigns bounded q17 residual rows to endpoint prime/window strata using exact selected endpoints. It is a theorem-facing handoff, not an all-N squarefree-hitting proof or a collision-free matching proof.',
    nextTheoremOptions: allAssigned
      ? [
        {
          id: 'prove_symbolic_squarefree_hitting_residue_cover',
          status: 'next',
          statement: 'For each selected endpoint stratum, prove the cross product left*right_p(left)+1 is squarefree on the assigned residue family, or emit the first square-obstruction residue subclass.',
        },
        {
          id: 'collision_free_matching_handoff',
          status: 'later',
          statement: 'After squarefree hitting is symbolic, prove that the endpoint choices can be composed into the matching injection without collisions.',
        },
      ]
      : [
        {
          id: 'emit_first_unassigned_residue_class',
          status: 'next',
          statement: 'The cover has an unassigned row/residue; emit it as the next deterministic endpoint-menu obstruction packet.',
        },
      ],
    recommendedNextAction: allAssigned
      ? 'prove_symbolic_squarefree_hitting_residue_cover'
      : 'emit_first_unassigned_residue_class',
  };
}

function crossProductForEndpointResidueFamily({ residualClass, endpointPrime, tResidueModuloPrimeSquare, sResidue, outsider }) {
  const formula = compileEndpointFormula({ prime: endpointPrime, outsider });
  const primeSquare = BigInt(formula.primeSquare);
  const t = BigInt(tResidueModuloPrimeSquare) + primeSquare * BigInt(sResidue);
  const left = BigInt(residualClass.residue) + BigInt(residualClass.modulus) * t;
  const k = Number(positiveModulo(
    BigInt(formula.kFormula.leftCoefficient) * left + BigInt(formula.kFormula.constant),
    formula.primeSquare,
  ));
  const right = left - 14n - 25n * BigInt(k);
  return {
    t,
    k,
    delta: -14 - 25 * k,
    left,
    right,
    crossProductPlusOne: left * right + 1n,
  };
}

function findSquareObstructionResidueSubclass({
  residualClass,
  endpointPrime,
  tResidueModuloPrimeSquare,
  boundedFamilyParameter,
  outsider,
  obstructionPrimes,
}) {
  const primeSquare = endpointPrime * endpointPrime;
  const checkedPrimeSummaries = [];

  for (const obstructionPrime of obstructionPrimes) {
    const obstructionSquare = obstructionPrime * obstructionPrime;
    const roots = [];
    for (let sResidue = 0; sResidue < obstructionSquare; sResidue += 1) {
      const value = crossProductForEndpointResidueFamily({
        residualClass,
        endpointPrime,
        tResidueModuloPrimeSquare,
        sResidue,
        outsider,
      }).crossProductPlusOne;
      if (value % BigInt(obstructionSquare) === 0n) {
        roots.push(sResidue);
      }
    }

    if (roots.length === 0) {
      checkedPrimeSummaries.push({
        prime: obstructionPrime,
        square: obstructionSquare,
        rootCount: 0,
      });
      continue;
    }

    const selectedSResidue = roots[0];
    const witness = crossProductForEndpointResidueFamily({
      residualClass,
      endpointPrime,
      tResidueModuloPrimeSquare,
      sResidue: selectedSResidue,
      outsider,
    });
    const tModulus = BigInt(primeSquare) * BigInt(obstructionSquare);
    const tResidue = BigInt(tResidueModuloPrimeSquare) + BigInt(primeSquare) * BigInt(selectedSResidue);
    const leftModulus = BigInt(residualClass.modulus) * tModulus;
    const boundedFamilyParameterResidue = Number(positiveModulo(boundedFamilyParameter, obstructionSquare));

    return {
      endpointPrime,
      endpointPrimeSquare: primeSquare,
      tResidueModuloEndpointPrimeSquare: tResidueModuloPrimeSquare,
      boundedFamilyParameter,
      obstructionPrime,
      obstructionSquare,
      rootResiduesModuloObstructionSquare: roots,
      selectedRootResidueModuloObstructionSquare: selectedSResidue,
      boundedFamilyParameterModuloObstructionSquare: boundedFamilyParameterResidue,
      boundedWitnessAvoidsObstruction: boundedFamilyParameterResidue !== selectedSResidue,
      tCongruence: {
        residue: safeJsonInteger(tResidue),
        modulus: safeJsonInteger(tModulus),
        expression: `t == ${tResidue} mod ${tModulus}`,
      },
      leftCongruence: {
        residue: safeJsonInteger(witness.left),
        modulus: safeJsonInteger(leftModulus),
        expression: `left == ${witness.left} mod ${leftModulus}`,
      },
      endpoint: {
        k: witness.k,
        delta: witness.delta,
        rightResidue: safeJsonInteger(witness.right),
        rightExpression: `right == left ${witness.delta}`,
      },
      squareDivisibilityWitness: {
        expression: `${obstructionPrime}^2 | left*right+1`,
        crossProductPlusOneAtResidue: witness.crossProductPlusOne.toString(),
        residueModuloObstructionSquare: Number(witness.crossProductPlusOne % BigInt(obstructionSquare)),
      },
      checkedPrimeSummaries: [
        ...checkedPrimeSummaries,
        {
          prime: obstructionPrime,
          square: obstructionSquare,
          rootCount: roots.length,
        },
      ],
    };
  }

  return null;
}

function compileSquarefreeHittingAudit(args) {
  const defaults = resolveProfileDefaults(args);
  const coverWindow = args.window ?? args.windowGrid?.at(-1) ?? 28500;
  const obstructionPrimeLimit = args.maxSquarePrime ?? 257;
  const obstructionPrimes = primeSieve(obstructionPrimeLimit);
  const factorMode = args.squareCheck === 'factor';
  const selectedEndpointSquarePrimes = factorMode ? [] : primeSieve(obstructionPrimeLimit);
  const factorOptions = createFactorOptions(args);
  const primaryFormulas = args.primes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const fallbackFormulas = args.fallbackPrimes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const allFormulas = [...primaryFormulas, ...fallbackFormulas];
  const firstLeft = alignStartToResidue(defaults.start, defaults.residualClass.residue, defaults.residualClass.modulus);
  const totalScanRowCount = firstLeft > defaults.end
    ? 0
    : Math.floor((defaults.end - firstLeft) / defaults.residualClass.modulus) + 1;
  const auditedFamilies = new Set();
  let rowCount = 0;
  let auditedFamilyCount = 0;
  let firstUnassignedRow = null;
  let firstObstruction = null;

  for (let left = firstLeft; left <= defaults.end; left += defaults.residualClass.modulus) {
    rowCount += 1;
    const endpoints = allFormulas.map((formula) => evaluateEndpoint({
      left,
      formula,
      outsider: args.outsider,
      window: coverWindow,
      squarePrimes: selectedEndpointSquarePrimes,
      squareCheck: args.squareCheck,
      factorOptions,
    }));
    const selected = endpoints.find((endpoint) => endpoint.withinWindow && endpoint.profileUsable) ?? null;
    if (!selected) {
      firstUnassignedRow = summarizeMissRow({
        left,
        leftModResidualClass: Number(positiveModulo(left, defaults.residualClass.modulus)),
        primaryEndpoints: endpoints.filter((endpoint) => args.primes.includes(endpoint.prime)),
        fallbackEndpoints: endpoints.filter((endpoint) => args.fallbackPrimes.includes(endpoint.prime)),
      });
      break;
    }

    const t = Math.trunc((left - defaults.residualClass.residue) / defaults.residualClass.modulus);
    const endpointPrimeSquare = selected.prime * selected.prime;
    const tResidueModuloPrimeSquare = Number(positiveModulo(t, endpointPrimeSquare));
    const boundedFamilyParameter = Math.trunc((t - tResidueModuloPrimeSquare) / endpointPrimeSquare);
    const familyKey = `${selected.prime}:${tResidueModuloPrimeSquare}`;
    if (auditedFamilies.has(familyKey)) {
      continue;
    }
    auditedFamilies.add(familyKey);
    auditedFamilyCount += 1;

    const obstruction = findSquareObstructionResidueSubclass({
      residualClass: defaults.residualClass,
      endpointPrime: selected.prime,
      tResidueModuloPrimeSquare,
      boundedFamilyParameter,
      outsider: args.outsider,
      obstructionPrimes,
    });

    if (obstruction) {
      firstObstruction = {
        selectedBoundedRow: {
          left,
          t,
          endpointPrime: selected.prime,
          endpointPrimeSquare,
          tResidueModuloPrimeSquare,
          boundedFamilyParameter,
          k: selected.k,
          delta: selected.delta,
          right: selected.right,
          rightMod25: selected.rightMod25,
          outsiderCompatibilityModPrimeSquare: selected.compatibilityModPrimeSquare,
          squarefreeStatus: selected.squarefreeStatus,
        },
        obstruction,
      };
      break;
    }
  }

  const status = firstObstruction
    ? 'first_square_obstruction_residue_subclass_emitted'
    : firstUnassignedRow
      ? 'availability_cover_unassigned_row_before_squarefree_audit'
      : 'no_square_obstruction_found_within_prime_bound';

  return {
    schema: 'erdos.number_theory.p848_endpoint_squarefree_hitting_audit/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    status,
    activeAtom: 'D2_p13_q17_endpoint_menu_squarefree_hitting_residue_cover',
    sourceAvailabilityResidueCover: path.join(
      problemDir,
      'SPLIT_ATOM_PACKETS',
      'DYNAMIC_MARGIN_PROOFS',
      'D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_availability_residue_cover.json',
    ),
    target: {
      description: 'q17 residual endpoint-menu squarefree-hitting audit',
      predecessorProof: args.predecessorProof,
      outsider: args.outsider,
      residualClass: defaults.residualClass,
      start: firstLeft,
      end: defaults.end,
      totalScanRowCount,
      visitedRowCount: rowCount,
      auditedFamilyCount,
      window: coverWindow,
      selectedEndpointSquareCheck: {
        mode: args.squareCheck,
        checkedPrimeLimit: factorMode ? null : selectedEndpointSquarePrimes.at(-1) ?? null,
      },
      obstructionPrimeLimit,
    },
    firstUnassignedRow,
    firstObstruction,
    claims: {
      provesEndpointFormulas: true,
      provesBoundedEndpointAssignment: firstUnassignedRow === null,
      provesSymbolicSquarefreeHitting: false,
      disprovesUniversalSelectedResidueFamily: firstObstruction !== null,
      provesAllN: false,
      provesCollisionFreeMatching: false,
    },
    proofBoundary: firstObstruction
      ? 'This packet proves that the selected endpoint residue family is not globally squarefree: a square-divisor subprogression exists. It does not invalidate the exact bounded row witness.'
      : `This packet did not find a square obstruction through prime ${obstructionPrimeLimit}; it is not an all-prime squarefree proof.`,
    nextTheoremOptions: firstObstruction
      ? [
        {
          id: 'split_q17_endpoint_menu_squarefree_obstruction_subclass',
          status: 'next',
          statement: 'Split the emitted square-obstruction subclass and either choose an alternate endpoint menu on that subclass or emit it as the next deterministic successor atom.',
        },
        {
          id: 'bounded_interval_squarefree_certificate',
          status: 'later',
          statement: 'Keep the bounded exact-factor certificate as bounded evidence only; it cannot stand in for the false universal residue-family lemma.',
        },
      ]
      : [
        {
          id: 'extend_square_obstruction_prime_bound_or_prove_by_discriminant',
          status: 'next',
          statement: 'Raise the obstruction-prime bound or replace the audit with a discriminant/local-solvability proof.',
        },
      ],
    recommendedNextAction: firstObstruction
      ? 'split_q17_endpoint_menu_squarefree_obstruction_subclass'
      : 'extend_square_obstruction_prime_bound_or_prove_by_discriminant',
  };
}

function compileObstructionSubclassRepair(args) {
  const obstructionPacket = readJson(args.obstructionPacket);
  const obstruction = obstructionPacket?.firstObstruction?.obstruction ?? null;
  if (!obstruction?.leftCongruence) {
    throw new Error('The obstruction packet does not contain a left congruence to repair');
  }

  const residualClass = {
    residue: args.residue ?? Number(obstruction.leftCongruence.residue),
    modulus: args.modulus ?? Number(obstruction.leftCongruence.modulus),
  };
  const targetWindow = args.window ?? obstructionPacket?.target?.window ?? 28500;
  const firstLeft = alignStartToResidue(args.start ?? residualClass.residue, residualClass.residue, residualClass.modulus);
  const end = args.end ?? firstLeft;
  const factorMode = args.squareCheck === 'factor';
  const maxSquarePrime = factorMode ? null : args.maxSquarePrime ?? Math.ceil(Math.sqrt(Number(BigInt(end) * BigInt(end) + 1n)));
  const squarePrimes = factorMode ? [] : primeSieve(maxSquarePrime);
  const factorOptions = createFactorOptions(args);
  const primaryFormulas = args.primes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const fallbackFormulas = args.fallbackPrimes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const allFormulas = [...primaryFormulas, ...fallbackFormulas];
  const blockedPrime = obstruction.endpointPrime;
  const visitedRows = [];
  let firstRepair = null;
  let firstUnrepairedRow = null;

  for (let left = firstLeft; left <= end && visitedRows.length < 8; left += residualClass.modulus) {
    const endpoints = allFormulas.map((formula) => evaluateEndpoint({
      left,
      formula,
      outsider: args.outsider,
      window: targetWindow,
      squarePrimes,
      squareCheck: args.squareCheck,
      factorOptions,
    }));
    const blockedEndpoint = endpoints.find((endpoint) => endpoint.prime === blockedPrime) ?? null;
    const alternateEndpoint = endpoints.find((endpoint) => (
      endpoint.prime !== blockedPrime
      && endpoint.withinWindow
      && endpoint.profileUsable
    )) ?? null;
    const row = {
      left,
      leftModResidualClass: Number(positiveModulo(left, residualClass.modulus)),
      blockedEndpoint: summarizeEndpoint(blockedEndpoint),
      alternateEndpoint: summarizeEndpoint(alternateEndpoint),
      withinWindowUsableEndpoints: endpoints
        .filter((endpoint) => endpoint.withinWindow && endpoint.profileUsable)
        .map(summarizeEndpoint),
      blockedWithinWindowEndpoints: endpoints
        .filter((endpoint) => endpoint.withinWindow && !endpoint.profileUsable)
        .map(summarizeEndpoint),
      nearestUsableOutsideWindow: endpoints
        .filter((endpoint) => !endpoint.withinWindow && endpoint.profileUsable)
        .sort((leftEndpoint, rightEndpoint) => Math.abs(leftEndpoint.delta) - Math.abs(rightEndpoint.delta))
        .slice(0, 6)
        .map(summarizeEndpoint),
    };
    visitedRows.push(row);

    if (alternateEndpoint && firstRepair === null) {
      const formula = allFormulas.find((item) => item.prime === alternateEndpoint.prime);
      firstRepair = {
        left,
        alternateEndpoint: summarizeEndpoint(alternateEndpoint),
        blockedEndpoint: summarizeEndpoint(blockedEndpoint),
        availabilityRule: formula
          ? compileAvailabilityRule({ formula, residualClass, window: targetWindow })
          : null,
      };
      break;
    }
    if (!alternateEndpoint && firstUnrepairedRow === null) {
      firstUnrepairedRow = row;
      break;
    }
  }

  const status = firstRepair
    ? firstRepair.availabilityRule?.universallyWithinWindow
      ? 'representative_repair_found_universal_window_squarefree_lift_needed'
      : 'representative_repair_found_availability_split_needed'
    : 'no_representative_repair_found_successor_atom_needed';

  return {
    schema: 'erdos.number_theory.p848_endpoint_obstruction_subclass_repair/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    status,
    activeAtom: 'D2_p13_q17_endpoint_menu_squarefree_obstruction_subclass',
    sourceSquarefreeObstruction: args.obstructionPacket,
    target: {
      description: 'q17 p23/q29 square-obstruction subclass alternate-endpoint repair probe',
      outsider: args.outsider,
      residualClass,
      start: firstLeft,
      end,
      visitedRowCount: visitedRows.length,
      window: targetWindow,
      blockedEndpointPrime: blockedPrime,
      blockedSquareDivisor: obstruction.obstructionSquare,
      squareCheck: {
        mode: args.squareCheck,
        checkedPrimeLimit: factorMode ? null : squarePrimes.at(-1) ?? null,
      },
    },
    obstructionSummary: {
      tCongruence: obstruction.tCongruence,
      leftCongruence: obstruction.leftCongruence,
      squareDivisibilityWitness: obstruction.squareDivisibilityWitness,
    },
    firstRepair,
    firstUnrepairedRow,
    rowSamples: visitedRows,
    claims: {
      provesEndpointFormulas: true,
      provesRepresentativeRepair: firstRepair !== null,
      provesSubclassCoverage: false,
      provesSymbolicSquarefreeHitting: false,
      provesAllN: false,
      provesCollisionFreeMatching: false,
    },
    proofBoundary: firstRepair
      ? 'This packet repairs the emitted square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.'
      : 'This packet found no alternate endpoint repair at the emitted square-obstruction representative; route the exact subclass as a successor atom.',
    nextTheoremOptions: firstRepair
      ? [
        {
          id: `split_q17_obstruction_subclass_by_p${firstRepair.alternateEndpoint.prime}_availability`,
          status: 'next',
          statement: `Split the obstruction subclass by the p${firstRepair.alternateEndpoint.prime} availability rule and then audit squarefree hitting on the available subfamilies.`,
        },
        {
          id: 'emit_unrepaired_square_obstruction_successor',
          status: 'fallback',
          statement: 'If the alternate endpoint cannot be lifted, emit the p23/q29 obstruction subclass as the next deterministic successor atom.',
        },
      ]
      : [
        {
          id: 'emit_unrepaired_square_obstruction_successor',
          status: 'next',
          statement: 'No representative repair was found; emit the p23/q29 obstruction subclass as the next deterministic successor atom.',
        },
      ],
    recommendedNextAction: firstRepair
      ? `split_q17_obstruction_subclass_by_p${firstRepair.alternateEndpoint.prime}_availability`
      : 'emit_unrepaired_square_obstruction_successor',
  };
}

function compileObstructionAvailabilitySplit(args) {
  const repairPacket = readJson(args.obstructionRepairPacket);
  const repair = repairPacket?.firstRepair ?? null;
  if (!repair?.alternateEndpoint || !repair?.availabilityRule) {
    throw new Error('The obstruction repair packet does not contain an alternate endpoint availability rule');
  }

  const residualClass = {
    residue: args.residue ?? repairPacket.target.residualClass.residue,
    modulus: args.modulus ?? repairPacket.target.residualClass.modulus,
  };
  const endpointPrime = repair.alternateEndpoint.prime;
  const endpointPrimeSquare = endpointPrime * endpointPrime;
  const availabilityRule = repair.availabilityRule;
  const firstAvailable = availabilityRule.firstAvailableTResidues?.[0] ?? null;
  const firstUnavailable = availabilityRule.firstUnavailableTResidue ?? null;
  if (!firstAvailable) {
    throw new Error('The obstruction repair packet has no available residue to audit');
  }

  const obstructionPrimeLimit = args.maxSquarePrime ?? 257;
  const obstructionPrimes = primeSieve(obstructionPrimeLimit);
  const boundedFamilyParameter = 0;
  const obstruction = findSquareObstructionResidueSubclass({
    residualClass,
    endpointPrime,
    tResidueModuloPrimeSquare: firstAvailable.tResidue,
    boundedFamilyParameter,
    outsider: args.outsider,
    obstructionPrimes,
  });
	  const representative = crossProductForEndpointResidueFamily({
	    residualClass,
	    endpointPrime,
	    tResidueModuloPrimeSquare: firstAvailable.tResidue,
	    sResidue: boundedFamilyParameter,
	    outsider: args.outsider,
	  });
	  const factorCertificatePath = args.factorCertificate ?? repairPacket?.target?.squareCheck?.factorCertificate ?? null;
	  const factorCertificates = factorCertificatePath ? readJson(factorCertificatePath) : null;
	  const representativeCertificate = findFactorCertificate(factorCertificates, {
	    prime: endpointPrime,
	    left: safeJsonInteger(representative.left),
	    right: safeJsonInteger(representative.right),
	    crossProductPlusOne: representative.crossProductPlusOne.toString(),
	  });
	  const repeatedFactor = representativeCertificate
	    ? representativeCertificate.repeated
	    : repeatedPrimeFactor(representative.crossProductPlusOne);
	  const sourceActiveAtom = String(repairPacket.activeAtom ?? '');
	  const sourceIsP107Q89P4217Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_subclass');
	  const sourceIsP79Q71Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_subclass');
	  const sourceIsP47Q67Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_subclass');
	  const sourceIsP29Q59Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_subclass');
	  const sourceIsP509Q43Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_subclass');
	  const sourceIsP83Q17Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass');
	  const sourceIsP73Q11Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_subclass');
	  const sourceIsP31Q53Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_subclass');
	  const sourceIsP37Q19Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_subclass');
	  const sourceIsP103ParitySubclass = sourceActiveAtom.includes('p41_q13_p103_q2');
	  const sourceIsP41Q13Subclass = sourceActiveAtom.includes('p41_q13');
	  const universalWindowSquarefreeLift = Boolean((sourceIsP509Q43Subclass || sourceIsP37Q19Subclass) && availabilityRule.universallyWithinWindow);
	  const activeAtom = sourceIsP107Q89P4217Subclass
	    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p${endpointPrime}_availability_split`
	    : sourceIsP79Q71Subclass
	    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p${endpointPrime}_availability_split`
	    : sourceIsP47Q67Subclass
	    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p${endpointPrime}_availability_split`
	    : sourceIsP29Q59Subclass
	    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p${endpointPrime}_availability_split`
	    : sourceIsP509Q43Subclass
	    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p${endpointPrime}_symbolic_squarefree_lift`
	    : sourceIsP83Q17Subclass
	    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p${endpointPrime}_availability_split`
	    : sourceIsP73Q11Subclass
	    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p${endpointPrime}_availability_split`
	    : sourceIsP31Q53Subclass
	    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p${endpointPrime}_availability_split`
	    : universalWindowSquarefreeLift
	    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p${endpointPrime}_symbolic_squarefree_lift`
    : sourceIsP37Q19Subclass
    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p${endpointPrime}_availability_split`
    : sourceIsP103ParitySubclass
    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p${endpointPrime}_availability_split`
    : sourceIsP41Q13Subclass
	    ? `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p${endpointPrime}_availability_split`
	    : `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p${endpointPrime}_availability_split`;
	  const nextSquareObstructionAction = sourceIsP107Q89P4217Subclass
	    ? `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p${endpointPrime}_available_square_obstruction_subclass`
	    : sourceIsP79Q71Subclass
	    ? `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p${endpointPrime}_available_square_obstruction_subclass`
	    : sourceIsP47Q67Subclass
	    ? `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p${endpointPrime}_available_square_obstruction_subclass`
	    : sourceIsP29Q59Subclass
	    ? `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p${endpointPrime}_available_square_obstruction_subclass`
	    : sourceIsP509Q43Subclass
	    ? `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p${endpointPrime}_square_obstruction_subclass`
	    : sourceIsP83Q17Subclass
	    ? `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p${endpointPrime}_available_square_obstruction_subclass`
	    : sourceIsP73Q11Subclass
	    ? `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p${endpointPrime}_available_square_obstruction_subclass`
	    : sourceIsP31Q53Subclass
	    ? `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p${endpointPrime}_available_square_obstruction_subclass`
	    : sourceIsP37Q19Subclass
	    ? `split_q17_p41_q13_p103_q2_p37_q19_p${endpointPrime}_square_obstruction_subclass`
    : sourceIsP103ParitySubclass
    ? `split_q17_p41_q13_p103_q2_p${endpointPrime}_available_square_obstruction_subclass`
    : sourceIsP41Q13Subclass
    ? `split_q17_p41_q13_p${endpointPrime}_available_square_obstruction_subclass`
    : `split_q17_p${endpointPrime}_available_square_obstruction_subclass`;
  const status = obstruction
    ? universalWindowSquarefreeLift
      ? `first_p${endpointPrime}_symbolic_squarefree_obstruction_subclass_emitted`
      : `first_p${endpointPrime}_available_square_obstruction_subclass_emitted`
    : 'no_available_square_obstruction_found_within_prime_bound';

  return {
    schema: 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    status,
    activeAtom,
	    sourceObstructionSubclassRepair: args.obstructionRepairPacket,
	    target: {
	      description: sourceIsP41Q13Subclass
	        ? sourceIsP107Q89P4217Subclass
	          ? `q17 p107/q89 obstruction subclass p${endpointPrime} availability split`
	        : sourceIsP79Q71Subclass
	          ? `q17 p79/q71 obstruction subclass p${endpointPrime} availability split`
	        : sourceIsP47Q67Subclass
	          ? `q17 p47/q67 obstruction subclass p${endpointPrime} availability split`
	          : sourceIsP29Q59Subclass
	          ? `q17 p29/q59 obstruction subclass p${endpointPrime} availability split`
	          : sourceIsP509Q43Subclass
	          ? `q17 p509/q43 obstruction subclass p${endpointPrime} symbolic squarefree lift`
	          : sourceIsP83Q17Subclass
	          ? `q17 p83/q17 obstruction subclass p${endpointPrime} availability split`
	          : sourceIsP73Q11Subclass
	          ? `q17 p73/q11 obstruction subclass p${endpointPrime} availability split`
	          : sourceIsP31Q53Subclass
	          ? `q17 p31/q53 obstruction subclass p${endpointPrime} availability split`
	          : sourceIsP37Q19Subclass
	          ? universalWindowSquarefreeLift
            ? `q17 p37/q19 obstruction subclass p${endpointPrime} symbolic squarefree lift`
            : `q17 p37/q19 obstruction subclass p${endpointPrime} availability split`
          : sourceIsP103ParitySubclass
          ? `q17 p103/parity obstruction subclass p${endpointPrime} availability split`
          : `q17 p41/q13 obstruction subclass p${endpointPrime} availability split`
        : `q17 p23/q29 obstruction subclass p${endpointPrime} availability split`,
      outsider: args.outsider,
      residualClass,
      endpointPrime,
      endpointPrimeSquare,
      window: args.window ?? repairPacket.target.window ?? 28500,
      obstructionPrimeLimit,
    },
    availabilitySplit: {
      kFormulaInParameter: availabilityRule.kFormulaInT,
      maxK: availabilityRule.maxK,
      period: availabilityRule.tPeriod,
      availableResidueCount: availabilityRule.availableResidueCount,
      unavailableResidueCount: availabilityRule.unavailableResidueCount,
      universallyWithinWindow: availabilityRule.universallyWithinWindow,
      firstAvailableResidue: firstAvailable,
      firstUnavailableResidue: firstUnavailable,
    },
    representativeAudit: {
      parameterResidue: firstAvailable.tResidue,
      boundedFamilyParameter,
      left: safeJsonInteger(representative.left),
      k: representative.k,
      delta: representative.delta,
      right: safeJsonInteger(representative.right),
	      squarefreeStatus: repeatedFactor ? 'non_squarefree' : 'exact_squarefree',
	      squareDivisorPrime: repeatedFactor?.prime ?? null,
	      squareDivisor: repeatedFactor?.square ?? null,
	      factorCertificateId: representativeCertificate?.certificateId ?? null,
	    },
    firstAvailableSquareObstruction: obstruction,
    claims: {
      provesEndpointFormulas: true,
      provesRepresentativeRepair: true,
      provesAvailabilitySplit: true,
      provesAvailableSubfamilySquarefreeHitting: false,
      disprovesUniversalAvailableResidueFamily: obstruction !== null,
      provesAllN: false,
      provesCollisionFreeMatching: false,
    },
    proofBoundary: obstruction
      ? universalWindowSquarefreeLift
        ? `This packet disproves the naive p${endpointPrime} symbolic squarefree lift by emitting the first square-divisor subprogression inside the universally window-available subclass. It does not invalidate the representative repair.`
        : `This packet splits p${endpointPrime} availability and proves the first available residue family is itself not globally squarefree. It does not invalidate the representative repair.`
      : universalWindowSquarefreeLift
      ? `This packet found no p${endpointPrime} square obstruction through prime ${obstructionPrimeLimit}; it is not an all-prime squarefree proof.`
      : `This packet splits p${endpointPrime} availability but found no square obstruction through prime ${obstructionPrimeLimit}; it is not an all-prime squarefree proof.`,
    nextTheoremOptions: obstruction
      ? [
        {
          id: nextSquareObstructionAction,
          status: 'next',
          statement: universalWindowSquarefreeLift
            ? `Split the p${endpointPrime} square-obstruction subclass by the emitted square divisor and test alternate endpoints on that subclass.`
            : `Split the p${endpointPrime}-available residue family by the emitted square obstruction and test alternate endpoints on that subclass.`,
        },
        ...(universalWindowSquarefreeLift ? [] : [
          {
            id: `route_p${endpointPrime}_unavailable_residues`,
            status: 'later',
            statement: `Route the first p${endpointPrime}-unavailable residue family to alternate endpoints or a successor atom.`,
          },
        ]),
      ]
      : [
        {
          id: `audit_remaining_p${endpointPrime}_available_residues`,
          status: 'next',
          statement: `No obstruction was found in the first p${endpointPrime}-available residue family through the configured bound; audit remaining available residues or replace with a discriminant proof.`,
        },
      ],
    recommendedNextAction: obstruction
      ? nextSquareObstructionAction
      : `audit_remaining_p${endpointPrime}_available_residues`,
  };
}

function compileAvailabilityObstructionRepair(args) {
  const splitPacket = readJson(args.availabilitySplitPacket);
  const obstruction = splitPacket?.firstAvailableSquareObstruction ?? null;
  if (!obstruction?.leftCongruence) {
    throw new Error('The availability split packet does not contain a square-obstruction left congruence to repair');
  }

  const residualClass = {
    residue: args.residue ?? obstruction.leftCongruence.residue,
    modulus: args.modulus ?? obstruction.leftCongruence.modulus,
  };
  const targetWindow = args.window ?? splitPacket?.target?.window ?? 28500;
  const firstLeft = alignStartToResidueBigInt(
    args.start ?? residualClass.residue,
    residualClass.residue,
    residualClass.modulus,
  );
  const end = args.end === null ? firstLeft : BigInt(args.end);
  const factorMode = args.squareCheck === 'factor';
  if (!factorMode && args.maxSquarePrime === null && end > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error('--max-square-prime is required for trial mode on unsafe-size representatives');
  }
  const maxSquarePrime = factorMode
    ? null
    : args.maxSquarePrime ?? Math.ceil(Math.sqrt(Number(end * end + 1n)));
  const squarePrimes = factorMode ? [] : primeSieve(maxSquarePrime);
  const factorOptions = createFactorOptions(args);
  const factorCertificates = args.factorCertificate ? readJson(args.factorCertificate) : null;
  const primaryFormulas = args.primes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const fallbackFormulas = args.fallbackPrimes.map((prime) => compileEndpointFormula({ prime, outsider: args.outsider }));
  const allFormulas = [...primaryFormulas, ...fallbackFormulas];
  const blockedPrime = obstruction.endpointPrime;
  const visitedRows = [];
  let firstRepair = null;
  let firstUnrepairedRow = null;

  for (let left = firstLeft; left <= end && visitedRows.length < 8; left += BigInt(residualClass.modulus)) {
    const endpoints = allFormulas.map((formula) => evaluateEndpoint({
      left,
      formula,
      outsider: args.outsider,
      window: targetWindow,
      squarePrimes,
      squareCheck: args.squareCheck,
      factorOptions,
      factorCertificates,
    }));
    const blockedEndpoint = endpoints.find((endpoint) => endpoint.prime === blockedPrime) ?? null;
    const alternateEndpoint = endpoints.find((endpoint) => (
      endpoint.prime !== blockedPrime
      && endpoint.withinWindow
      && endpoint.profileUsable
    )) ?? null;
    const row = {
      left: safeJsonInteger(left),
      leftModResidualClass: safeJsonInteger(positiveModulo(left, residualClass.modulus)),
      blockedEndpoint: summarizeEndpoint(blockedEndpoint),
      alternateEndpoint: summarizeEndpoint(alternateEndpoint),
      withinWindowUsableEndpoints: endpoints
        .filter((endpoint) => endpoint.withinWindow && endpoint.profileUsable)
        .map(summarizeEndpoint),
      blockedWithinWindowEndpoints: endpoints
        .filter((endpoint) => endpoint.withinWindow && !endpoint.profileUsable)
        .map(summarizeEndpoint),
      nearestUsableOutsideWindow: endpoints
        .filter((endpoint) => !endpoint.withinWindow && endpoint.profileUsable)
        .sort((leftEndpoint, rightEndpoint) => Math.abs(leftEndpoint.delta) - Math.abs(rightEndpoint.delta))
        .slice(0, 6)
        .map(summarizeEndpoint),
    };
    visitedRows.push(row);

    if (alternateEndpoint && firstRepair === null) {
      const formula = allFormulas.find((item) => item.prime === alternateEndpoint.prime);
      firstRepair = {
        left: safeJsonInteger(left),
        alternateEndpoint: summarizeEndpoint(alternateEndpoint),
        blockedEndpoint: summarizeEndpoint(blockedEndpoint),
        availabilityRule: formula
          ? compileAvailabilityRule({ formula, residualClass, window: targetWindow })
          : null,
      };
      break;
    }
    if (!alternateEndpoint && firstUnrepairedRow === null) {
      firstUnrepairedRow = row;
      break;
    }
  }

	  const status = firstRepair
	    ? firstRepair.availabilityRule?.universallyWithinWindow
	      ? 'representative_repair_found_universal_window_squarefree_lift_needed'
	      : 'representative_repair_found_availability_split_needed'
	    : 'no_representative_repair_found_successor_atom_needed';
	  const nextPrime = firstRepair?.alternateEndpoint?.prime ?? null;
	  const sourceActiveAtom = String(splitPacket.activeAtom ?? '');
	  const sourceIsP4217Q61Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_availability_split');
	  const sourceIsP107Q89Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_availability_split');
	  const sourceIsP79Q71Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_availability_split');
	  const sourceIsP47Q67Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_availability_split');
	  const sourceIsP29Q59Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_symbolic_squarefree_lift');
	  const sourceIsP509Q43Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_availability_split');
	  const sourceIsP83Q17Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_availability_split');
	  const sourceIsP73Q11Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_q53_p73_availability_split');
	  const sourceIsP31Q53Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_q19_p31_symbolic_squarefree_lift');
	  const sourceIsP37Q19Subclass = sourceActiveAtom.includes('p41_q13_p103_q2_p37_availability_split');
	  const sourceIsP103ParitySubclass = sourceActiveAtom.includes('p41_q13_p103_availability_split');
	  const repairHasUniversalWindow = Boolean(firstRepair?.availabilityRule?.universallyWithinWindow);
	  const activeAtom = sourceIsP4217Q61Subclass
	    ? 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_q61_subclass'
	    : sourceIsP107Q89Subclass
	    ? 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_subclass'
	    : sourceIsP79Q71Subclass
	    ? 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_subclass'
	    : sourceIsP47Q67Subclass
	    ? 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_subclass'
	    : sourceIsP29Q59Subclass
	    ? 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_subclass'
	    : sourceIsP509Q43Subclass
	    ? 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_subclass'
	    : sourceIsP83Q17Subclass
	    ? 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass'
	    : sourceIsP73Q11Subclass
	    ? 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_subclass'
	    : sourceIsP31Q53Subclass
	    ? 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_subclass'
    : sourceIsP37Q19Subclass
    ? 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_subclass'
	    : sourceIsP103ParitySubclass
	    ? 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_subclass'
	    : 'D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_subclass';
	  const repairNextAction = sourceIsP4217Q61Subclass
	    ? repairHasUniversalWindow
	      ? `prove_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_q61_p${nextPrime}_symbolic_squarefree_lift`
	      : `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_q61_subclass_by_p${nextPrime}_availability`
	    : sourceIsP107Q89Subclass
	    ? repairHasUniversalWindow
	      ? `prove_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p${nextPrime}_symbolic_squarefree_lift`
	      : `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_subclass_by_p${nextPrime}_availability`
	    : sourceIsP79Q71Subclass
	    ? repairHasUniversalWindow
	      ? `prove_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p${nextPrime}_symbolic_squarefree_lift`
	      : `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_subclass_by_p${nextPrime}_availability`
	    : sourceIsP47Q67Subclass
	    ? repairHasUniversalWindow
	      ? `prove_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p${nextPrime}_symbolic_squarefree_lift`
	      : `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_subclass_by_p${nextPrime}_availability`
	    : sourceIsP29Q59Subclass
	    ? repairHasUniversalWindow
	      ? `prove_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p${nextPrime}_symbolic_squarefree_lift`
	      : `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_subclass_by_p${nextPrime}_availability`
	    : sourceIsP509Q43Subclass
	    ? repairHasUniversalWindow
	      ? `prove_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p${nextPrime}_symbolic_squarefree_lift`
	      : `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_subclass_by_p${nextPrime}_availability`
	    : sourceIsP83Q17Subclass
	    ? repairHasUniversalWindow
	      ? `prove_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p${nextPrime}_symbolic_squarefree_lift`
	      : `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_subclass_by_p${nextPrime}_availability`
	    : sourceIsP73Q11Subclass
	    ? repairHasUniversalWindow
	      ? `prove_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p${nextPrime}_symbolic_squarefree_lift`
	      : `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_subclass_by_p${nextPrime}_availability`
    : sourceIsP31Q53Subclass
    ? repairHasUniversalWindow
      ? `prove_q17_p41_q13_p103_q2_p37_q19_p31_q53_p${nextPrime}_symbolic_squarefree_lift`
      : `split_q17_p41_q13_p103_q2_p37_q19_p31_q53_subclass_by_p${nextPrime}_availability`
    : sourceIsP37Q19Subclass
    ? repairHasUniversalWindow
      ? `prove_q17_p41_q13_p103_q2_p37_q19_p${nextPrime}_symbolic_squarefree_lift`
      : `split_q17_p41_q13_p103_q2_p37_q19_subclass_by_p${nextPrime}_availability`
    : sourceIsP103ParitySubclass
    ? repairHasUniversalWindow
      ? `prove_q17_p41_q13_p103_q2_p${nextPrime}_symbolic_squarefree_lift`
      : `split_q17_p41_q13_p103_q2_subclass_by_p${nextPrime}_availability`
    : repairHasUniversalWindow
    ? `prove_q17_p41_q13_p${nextPrime}_symbolic_squarefree_lift`
    : `split_q17_p41_q13_subclass_by_p${nextPrime}_availability`;
	  const successorAction = sourceIsP4217Q61Subclass
	    ? 'emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_q61_square_obstruction_successor'
	    : sourceIsP107Q89Subclass
	    ? 'emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_square_obstruction_successor'
	    : sourceIsP79Q71Subclass
	    ? 'emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_square_obstruction_successor'
	    : sourceIsP47Q67Subclass
	    ? 'emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_square_obstruction_successor'
	    : sourceIsP29Q59Subclass
	    ? 'emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_square_obstruction_successor'
	    : sourceIsP509Q43Subclass
	    ? 'emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_square_obstruction_successor'
	    : sourceIsP83Q17Subclass
	    ? 'emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_square_obstruction_successor'
	    : sourceIsP73Q11Subclass
	    ? 'emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_square_obstruction_successor'
	    : sourceIsP31Q53Subclass
	    ? 'emit_p41_q13_p103_q2_p37_q19_p31_q53_square_obstruction_successor'
	    : sourceIsP37Q19Subclass
    ? 'emit_p41_q13_p103_q2_p37_q19_square_obstruction_successor'
    : sourceIsP103ParitySubclass
    ? 'emit_p41_q13_p103_q2_square_obstruction_successor'
    : 'emit_p41_q13_square_obstruction_successor';
	  const sourceLabel = sourceIsP4217Q61Subclass
	    ? 'p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71/p107/q89/p4217/q61'
	    : sourceIsP107Q89Subclass
	    ? 'p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71/p107/q89'
	    : sourceIsP79Q71Subclass
	    ? 'p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67/p79/q71'
	    : sourceIsP47Q67Subclass
	    ? 'p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59/p47/q67'
	    : sourceIsP29Q59Subclass
	    ? 'p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43/p29/q59'
	    : sourceIsP509Q43Subclass
	    ? 'p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17/p509/q43'
	    : sourceIsP83Q17Subclass
	    ? 'p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17'
	    : sourceIsP73Q11Subclass
	    ? 'p41/q13/p103 parity/p37/q19/p31/q53/p73/q11'
	    : sourceIsP31Q53Subclass
    ? 'p41/q13/p103 parity/p37/q19/p31/q53'
    : sourceIsP37Q19Subclass
    ? 'p41/q13/p103 parity/p37/q19'
    : sourceIsP103ParitySubclass
    ? 'p41/q13/p103 parity'
    : 'p41/q13';

  return {
    schema: 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    status,
    activeAtom,
    sourceAvailabilitySplit: args.availabilitySplitPacket,
    target: {
      description: `q17 ${sourceLabel} square-obstruction subclass alternate-endpoint repair probe`,
      outsider: args.outsider,
      residualClass,
	      start: safeJsonInteger(firstLeft),
	      end: safeJsonInteger(end),
	      visitedRowCount: visitedRows.length,
	      window: targetWindow,
	      testedEndpointPrimes: allFormulas.map((formula) => formula.prime),
	      blockedEndpointPrime: blockedPrime,
	      blockedSquareDivisor: obstruction.obstructionSquare,
      squareCheck: {
        mode: args.squareCheck,
        checkedPrimeLimit: factorMode ? null : squarePrimes.at(-1) ?? null,
        factorCertificate: args.factorCertificate,
      },
    },
    obstructionSummary: {
      tCongruence: obstruction.tCongruence,
      leftCongruence: obstruction.leftCongruence,
      squareDivisibilityWitness: obstruction.squareDivisibilityWitness,
    },
    firstRepair,
    firstUnrepairedRow,
    rowSamples: visitedRows,
    claims: {
      provesEndpointFormulas: true,
      provesRepresentativeRepair: firstRepair !== null,
      provesSubclassCoverage: false,
      provesSymbolicSquarefreeHitting: false,
      provesAllN: false,
      provesCollisionFreeMatching: false,
    },
    proofBoundary: firstRepair
      ? `This packet repairs the emitted ${sourceLabel} square-obstruction representative with an alternate endpoint. Because the alternate endpoint is not yet proved across the full subclass, this is a split/availability handoff rather than a subclass proof.`
      : `This packet found no alternate endpoint repair at the emitted ${sourceLabel} square-obstruction representative; route the exact subclass as a successor atom.`,
    nextTheoremOptions: firstRepair
      ? [
        {
          id: repairNextAction,
          status: 'next',
          statement: repairHasUniversalWindow
            ? `The p${nextPrime} endpoint is universally inside the window on the ${sourceLabel} subclass; prove the symbolic squarefree lift for that endpoint or emit its first square-divisor subprogression.`
            : `Split the ${sourceLabel} obstruction subclass by the p${nextPrime} availability rule and then audit squarefree hitting on the available subfamilies.`,
        },
        {
          id: successorAction,
          status: 'fallback',
          statement: `If the alternate endpoint cannot be lifted, emit the ${sourceLabel} obstruction subclass as the next deterministic successor atom.`,
        },
      ]
      : [
        {
          id: successorAction,
          status: 'next',
          statement: `No representative repair was found; emit the ${sourceLabel} obstruction subclass as the next deterministic successor atom.`,
        },
      ],
    recommendedNextAction: firstRepair
      ? repairNextAction
      : successorAction,
	  };
	}

function compileAvailabilityObstructionSuccessor(args) {
  const noRepairPacket = readJson(args.obstructionRepairPacket);
  if (noRepairPacket?.status !== 'no_representative_repair_found_successor_atom_needed') {
    throw new Error('The obstruction repair packet is not a no-repair successor handoff');
  }
  const unrepairedRow = noRepairPacket.firstUnrepairedRow ?? null;
  if (!unrepairedRow) {
    throw new Error('The no-repair packet does not contain a first unrepaired row');
  }

  const predecessorAtom = String(noRepairPacket.activeAtom ?? '');
  const activeAtom = predecessorAtom.endsWith('_subclass')
    ? predecessorAtom.replace(/_subclass$/, '_successor')
    : `${predecessorAtom}_successor`;
  const branchLabel = activeAtom.includes('p83_q17')
    ? 'p41/q13/p103 parity/p37/q19/p31/q53/p73/q11/p83/q17'
    : 'endpoint-menu square-obstruction';
  const recommendedNextAction = activeAtom.includes('p83_q17')
    ? 'attack_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_successor_atom'
    : 'attack_emitted_endpoint_successor_atom';
  const blockedWithinWindowEndpoints = unrepairedRow.blockedWithinWindowEndpoints ?? [];
  const withinWindowUsableEndpoints = unrepairedRow.withinWindowUsableEndpoints ?? [];

  return {
    schema: 'erdos.number_theory.p848_endpoint_availability_obstruction_successor/1',
    generatedAt: new Date().toISOString(),
    problemId: '848',
    status: 'successor_atom_emitted',
    activeAtom,
    sourceNoRepairPacket: args.obstructionRepairPacket,
    target: {
      description: `q17 ${branchLabel} deterministic successor atom`,
      outsider: noRepairPacket.target?.outsider ?? args.outsider,
      residualClass: noRepairPacket.target?.residualClass ?? null,
      representativeLeft: unrepairedRow.left,
      window: noRepairPacket.target?.window ?? args.window ?? 28500,
      testedEndpointPrimes: noRepairPacket.target?.testedEndpointPrimes ?? [],
      squareCheck: noRepairPacket.target?.squareCheck ?? null,
    },
    obstructionSummary: noRepairPacket.obstructionSummary,
    finiteMenuNoRepairWitness: {
      withinWindowUsableEndpointCount: withinWindowUsableEndpoints.length,
      blockedWithinWindowEndpointCount: blockedWithinWindowEndpoints.length,
      blockedEndpoint: unrepairedRow.blockedEndpoint,
      blockedWithinWindowEndpoints,
      nearestUsableOutsideWindow: unrepairedRow.nearestUsableOutsideWindow ?? [],
    },
    successorAtom: {
      atomId: activeAtom,
      predecessorAtom,
      branchLabel,
      residualClass: noRepairPacket.target?.residualClass ?? null,
      representativeLeft: unrepairedRow.left,
      blockedEndpointPrime: noRepairPacket.target?.blockedEndpointPrime ?? unrepairedRow.blockedEndpoint?.prime ?? null,
      blockedSquareDivisor: noRepairPacket.target?.blockedSquareDivisor ?? unrepairedRow.blockedEndpoint?.squareDivisor ?? null,
      squareDivisibilityWitness: noRepairPacket.obstructionSummary?.squareDivisibilityWitness ?? null,
      tCongruence: noRepairPacket.obstructionSummary?.tCongruence ?? null,
      leftCongruence: noRepairPacket.obstructionSummary?.leftCongruence ?? null,
    },
    claims: {
      emitsDeterministicSuccessorAtom: true,
      provesNoFiniteMenuRepresentativeRepair: withinWindowUsableEndpoints.length === 0,
      provesEndpointFormulasForTestedMenu: true,
      provesAllN: false,
      provesAllPrimeNoRepair: false,
      provesCollisionFreeMatching: false,
    },
    proofBoundary: 'This packet emits an exact endpoint-menu successor atom from a finite tested-menu no-repair witness. It does not prove no repair exists outside the tested finite endpoint menu and does not prove any all-N claim.',
    nextTheoremOptions: [
      {
        id: recommendedNextAction,
        status: 'next',
        statement: 'Attack the emitted successor atom with a symbolic obstruction proof, a sharper endpoint menu, or a smaller deterministic refinement.',
      },
      {
        id: 'route_sibling_unavailable_endpoint_residues',
        status: 'later',
        statement: 'After this successor branch is routed, return to sibling unavailable endpoint residues from earlier availability splits.',
      },
    ],
    recommendedNextAction,
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
  lines.push(`- First proved primary-covered window: \`${packet.firstProvedPrimaryCoveredWindow ?? '(none)'}\``);
  lines.push(`- First proved full-menu-covered window: \`${packet.firstProvedAllCoveredWindow ?? '(none)'}\``);
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

function renderLegalityAuditMarkdown(packet) {
  const lines = [];
  lines.push('# Problem 848 Endpoint Window Legality Audit');
  lines.push('');
  lines.push(`- Active atom: \`${packet.activeAtom}\``);
  lines.push(`- Scope: q17 residual endpoint selection for \`left == ${packet.scope.residualClass.leftResidue} mod ${packet.scope.residualClass.leftModulus}\` and outsider \`${packet.scope.outsider}\`.`);
  lines.push(`- Inherited window: \`${packet.windows.inheritedWindow}\` with \`k <= ${packet.windows.inheritedMaxK}\`.`);
  lines.push(`- Candidate endpoint window: \`${packet.windows.candidateEndpointWindow}\` with \`k <= ${packet.windows.candidateMaxK}\`.`);
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Selector-layer decision: \`${packet.selectorLayerDecision.legalAtEndpointSelectorLayer}\``);
  lines.push('');
  lines.push('## Decision');
  lines.push('');
  lines.push(`- ${packet.selectorLayerDecision.statement}`);
  lines.push(`- Boundary: ${packet.selectorLayerDecision.boundary}`);
  lines.push('');
  lines.push('## Key Repair Row');
  lines.push('');
  const repair = packet.observedEndpointRepair;
  if (repair) {
    lines.push(`- First inherited-window miss: \`left=${repair.left}\``);
    lines.push(`- Repair endpoint: \`p=${repair.prime}\`, \`k=${repair.k}\`, \`delta=${repair.delta}\`, \`right=${repair.right}\`.`);
    lines.push(`- Inside inherited window: \`${repair.insideInheritedWindow}\`; inside candidate window: \`${repair.insideCandidateWindow}\`.`);
    lines.push(`- Right side: \`right == ${repair.rightMod25} mod 25\`.`);
    lines.push(`- Outsider compatibility: \`${repair.outsiderCompatibility.primeSquare} | ${repair.outsiderCompatibility.expression}\`.`);
    lines.push(`- Cross product: \`${repair.crossProduct.value}\`, status \`${repair.crossProduct.squarefreeStatus}\`.`);
  } else {
    lines.push('- No candidate repair row was selected.');
  }
  lines.push('');
  lines.push('## Bounded Evidence');
  lines.push('');
  for (const summary of packet.boundedEvidence.windowGrid) {
    lines.push(`- window=${summary.window}: full-menu \`${summary.fullCovered}/${summary.rows}\`, first full miss \`${summary.firstFullMiss ?? '(none)'}\`, exact-factor coverage \`${summary.exactFactorCoverage}\`.`);
  }
  lines.push('');
  lines.push('## Availability Stratum Seed');
  lines.push('');
  if (packet.availabilityStratumSeed) {
    const seed = packet.availabilityStratumSeed;
    lines.push(`- Prime: \`${seed.prime}\``);
    if (seed.inheritedWindow) {
      lines.push(`- inherited window: available residues \`${seed.inheritedWindow.availableResidueCount}/${seed.inheritedWindow.period}\`, witness available \`${seed.inheritedWindow.witnessAvailable}\`.`);
    }
    if (seed.candidateWindow) {
      lines.push(`- candidate window: available residues \`${seed.candidateWindow.availableResidueCount}/${seed.candidateWindow.period}\`, witness available \`${seed.candidateWindow.witnessAvailable}\`.`);
      lines.push(`- candidate formula: \`${seed.candidateWindow.kFormulaInT}\`.`);
    }
  } else {
    lines.push('- No availability stratum seed was emitted.');
  }
  lines.push('');
  lines.push('## Inherited Boundary Audit');
  lines.push('');
  lines.push(`- Predecessor seed window: \`${packet.inheritedBoundaryAudit.predecessorSeedEscapeWindow ?? '(none)'}\`.`);
  lines.push(`- ${packet.inheritedBoundaryAudit.observedReasonForInheritedWindow}`);
  for (const missing of packet.inheritedBoundaryAudit.notFoundInThisAudit) {
    lines.push(`- Not found: ${missing}`);
  }
  lines.push('');
  lines.push('## Theorem Fork');
  lines.push('');
  for (const option of packet.theoremFork) {
    lines.push(`- \`${option.id}\` [${option.status}]: ${option.statement}`);
  }
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  for (const item of packet.notProvedHere) {
    lines.push(`- Not proved here: ${item}`);
  }
  lines.push('');
  lines.push(`## Recommended Next Action`);
  lines.push('');
  lines.push(`- \`${packet.recommendedNextAction}\``);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function renderAvailabilityCoverMarkdown(packet) {
  const lines = [];
  lines.push('# Problem 848 Endpoint Availability Residue Cover');
  lines.push('');
  lines.push(`- Active atom: \`${packet.activeAtom}\``);
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Residual class: \`left ≡ ${packet.target.residualClass.residue} mod ${packet.target.residualClass.modulus}\``);
  lines.push(`- Window: \`${packet.target.window}\``);
  lines.push(`- Scan: \`${packet.target.start}..${packet.target.end}\` over \`${packet.target.rowCount}\` residual rows`);
  lines.push(`- Square check: \`${packet.target.squareCheck.mode}\``);
  lines.push('');
  lines.push('## Coverage');
  lines.push('');
  lines.push(`- Assigned rows: \`${packet.coverage.assignedRows}/${packet.target.rowCount}\``);
  lines.push(`- Unassigned rows: \`${packet.coverage.unassignedRows}\``);
  lines.push(`- Selected endpoints exact: \`${packet.coverage.selectedEndpointsExact}\``);
  lines.push(`- First unassigned row: \`${packet.coverage.firstUnassignedRow?.left ?? '(none)'}\``);
  lines.push('');
  lines.push('## Selected Prime Strata');
  lines.push('');
  for (const stratum of packet.strata) {
    lines.push(`- p=${stratum.prime} (${stratum.menuRole}): rows \`${stratum.rowCount}\`, k \`${stratum.kRange.min}..${stratum.kRange.max}\`, delta \`${stratum.deltaRange.min}..${stratum.deltaRange.max}\`, selected t-residues \`${stratum.selectedTResidueCountModuloPrimeSquare}/${stratum.primeSquare}\``);
    if (stratum.availabilityRule) {
      lines.push(`- p=${stratum.prime} availability: \`${stratum.availabilityRule.kFormulaInT}\`, available \`${stratum.availabilityRule.availableResidueCount}/${stratum.availabilityRule.period}\`, universal \`${stratum.availabilityRule.universallyWithinWindow}\``);
    }
    const sample = stratum.rowSamples
      .map((row) => `left=${row.left},t=${row.t},k=${row.k},delta=${row.delta}`)
      .join('; ');
    if (sample) {
      lines.push(`- p=${stratum.prime} samples: ${sample}`);
    }
  }
  lines.push('');
  lines.push('## Claims');
  lines.push('');
  lines.push(`- Bounded endpoint assignment: \`${packet.claims.provesBoundedEndpointAssignment}\``);
  lines.push(`- Symbolic squarefree hitting: \`${packet.claims.provesSymbolicSquarefreeHitting}\``);
  lines.push(`- Collision-free matching: \`${packet.claims.provesCollisionFreeMatching}\``);
  lines.push(`- All-N: \`${packet.claims.provesAllN}\``);
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push(`- ${packet.proofBoundary}`);
  lines.push('');
  lines.push('## Next Theorem Options');
  lines.push('');
  for (const option of packet.nextTheoremOptions) {
    lines.push(`- \`${option.id}\` [${option.status}]: ${option.statement}`);
  }
  lines.push('');
  lines.push('## Recommended Next Action');
  lines.push('');
  lines.push(`- \`${packet.recommendedNextAction}\``);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function renderSquarefreeHittingAuditMarkdown(packet) {
  const lines = [];
  lines.push('# Problem 848 Endpoint Squarefree-Hitting Audit');
  lines.push('');
  lines.push(`- Active atom: \`${packet.activeAtom}\``);
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Residual class: \`left ≡ ${packet.target.residualClass.residue} mod ${packet.target.residualClass.modulus}\``);
  lines.push(`- Window: \`${packet.target.window}\``);
  lines.push(`- Scan start: \`${packet.target.start}\`; scan end: \`${packet.target.end}\``);
  lines.push(`- Audited selected families before stop: \`${packet.target.auditedFamilyCount}\``);
  lines.push(`- Obstruction-prime limit: \`${packet.target.obstructionPrimeLimit}\``);
  lines.push('');
  lines.push('## First Obstruction');
  lines.push('');
  if (packet.firstObstruction) {
    const selected = packet.firstObstruction.selectedBoundedRow;
    const obstruction = packet.firstObstruction.obstruction;
    lines.push(`- Selected bounded row: \`left=${selected.left}\`, \`t=${selected.t}\`, endpoint \`p=${selected.endpointPrime}\`, \`k=${selected.k}\`, \`delta=${selected.delta}\`, status \`${selected.squarefreeStatus}\`.`);
    lines.push(`- Endpoint residue family: \`t ≡ ${selected.tResidueModuloPrimeSquare} mod ${selected.endpointPrimeSquare}\`; bounded-family parameter \`${selected.boundedFamilyParameter}\`.`);
    lines.push(`- Square obstruction: \`${obstruction.obstructionPrime}^2 = ${obstruction.obstructionSquare}\`.`);
    lines.push(`- Obstruction root residues: \`${obstruction.rootResiduesModuloObstructionSquare.join(',')}\` modulo \`${obstruction.obstructionSquare}\`; selected root \`${obstruction.selectedRootResidueModuloObstructionSquare}\`.`);
    lines.push(`- Lifted t subclass: \`${obstruction.tCongruence.expression}\`.`);
    lines.push(`- Lifted left subclass: \`${obstruction.leftCongruence.expression}\`.`);
    lines.push(`- Endpoint on subclass: \`k=${obstruction.endpoint.k}\`, \`delta=${obstruction.endpoint.delta}\`, \`right=${obstruction.endpoint.rightResidue}\`.`);
    lines.push(`- Divisibility: \`${obstruction.squareDivisibilityWitness.expression}\`; cross-product residue \`${obstruction.squareDivisibilityWitness.residueModuloObstructionSquare}\`.`);
    lines.push(`- Bounded row avoids emitted obstruction root: \`${obstruction.boundedWitnessAvoidsObstruction}\`.`);
  } else if (packet.firstUnassignedRow) {
    lines.push(`- No square obstruction was audited because the endpoint cover first became unassigned at \`left=${packet.firstUnassignedRow.left}\`.`);
  } else {
    lines.push('- No square obstruction was found within the configured prime bound.');
  }
  lines.push('');
  lines.push('## Claims');
  lines.push('');
  lines.push(`- Endpoint formulas: \`${packet.claims.provesEndpointFormulas}\``);
  lines.push(`- Bounded endpoint assignment: \`${packet.claims.provesBoundedEndpointAssignment}\``);
  lines.push(`- Symbolic squarefree hitting: \`${packet.claims.provesSymbolicSquarefreeHitting}\``);
  lines.push(`- Disproves universal selected residue family: \`${packet.claims.disprovesUniversalSelectedResidueFamily}\``);
  lines.push(`- All-N: \`${packet.claims.provesAllN}\``);
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push(`- ${packet.proofBoundary}`);
  lines.push('');
  lines.push('## Next Theorem Options');
  lines.push('');
  for (const option of packet.nextTheoremOptions) {
    lines.push(`- \`${option.id}\` [${option.status}]: ${option.statement}`);
  }
  lines.push('');
  lines.push('## Recommended Next Action');
  lines.push('');
  lines.push(`- \`${packet.recommendedNextAction}\``);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function renderObstructionSubclassRepairMarkdown(packet) {
  const lines = [];
  lines.push('# Problem 848 Endpoint Obstruction Subclass Repair');
  lines.push('');
  lines.push(`- Active atom: \`${packet.activeAtom}\``);
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Residual subclass: \`left ≡ ${packet.target.residualClass.residue} mod ${packet.target.residualClass.modulus}\``);
  lines.push(`- Window: \`${packet.target.window}\``);
  lines.push(`- Blocked endpoint prime: \`${packet.target.blockedEndpointPrime}\``);
  lines.push(`- Blocked square divisor: \`${packet.target.blockedSquareDivisor}\``);
  lines.push('');
  lines.push('## Source Obstruction');
  lines.push('');
  lines.push(`- t subclass: \`${packet.obstructionSummary.tCongruence?.expression ?? '(unknown)'}\``);
  lines.push(`- left subclass: \`${packet.obstructionSummary.leftCongruence?.expression ?? '(unknown)'}\``);
  lines.push(`- witness: \`${packet.obstructionSummary.squareDivisibilityWitness?.expression ?? '(unknown)'}\``);
  lines.push('');
  lines.push('## Representative Repair');
  lines.push('');
  if (packet.firstRepair) {
    const repair = packet.firstRepair;
    const blockedEndpointPrime = repair.blockedEndpoint?.prime ?? packet.target.blockedEndpointPrime;
    const blockedEndpointStatus = repair.blockedEndpoint?.squarefreeStatus ?? 'known_non_squarefree_from_source_obstruction';
    const blockedEndpointSquareDivisor = repair.blockedEndpoint?.squareDivisor ?? packet.target.blockedSquareDivisor ?? '(none)';
    lines.push(`- Representative left: \`${repair.left}\``);
    lines.push(`- Blocked endpoint: p=\`${blockedEndpointPrime}\`, status \`${blockedEndpointStatus}\`, square divisor \`${blockedEndpointSquareDivisor}\`.`);
    lines.push(`- Alternate endpoint: p=\`${repair.alternateEndpoint.prime}\`, k=\`${repair.alternateEndpoint.k}\`, delta=\`${repair.alternateEndpoint.delta}\`, right=\`${repair.alternateEndpoint.right}\`, status \`${repair.alternateEndpoint.squarefreeStatus}\`.`);
    if (repair.availabilityRule) {
      lines.push(`- Alternate availability: \`${repair.availabilityRule.kFormulaInT}\`, available \`${repair.availabilityRule.availableResidueCount}/${repair.availabilityRule.tPeriod}\`, universal \`${repair.availabilityRule.universallyWithinWindow}\`.`);
      lines.push(`- First unavailable residue: \`${repair.availabilityRule.firstUnavailableTResidue ? JSON.stringify(repair.availabilityRule.firstUnavailableTResidue) : '(none)'}\``);
    }
  } else if (packet.firstUnrepairedRow) {
    lines.push(`- No alternate endpoint repaired representative left \`${packet.firstUnrepairedRow.left}\`.`);
  } else {
    lines.push('- No representative row was audited.');
  }
  lines.push('');
  lines.push('## Claims');
  lines.push('');
  lines.push(`- Representative repair: \`${packet.claims.provesRepresentativeRepair}\``);
  lines.push(`- Subclass coverage: \`${packet.claims.provesSubclassCoverage}\``);
  lines.push(`- Symbolic squarefree hitting: \`${packet.claims.provesSymbolicSquarefreeHitting}\``);
  lines.push(`- All-N: \`${packet.claims.provesAllN}\``);
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push(`- ${packet.proofBoundary}`);
  lines.push('');
  lines.push('## Next Theorem Options');
  lines.push('');
  for (const option of packet.nextTheoremOptions) {
    lines.push(`- \`${option.id}\` [${option.status}]: ${option.statement}`);
  }
  lines.push('');
  lines.push('## Recommended Next Action');
  lines.push('');
  lines.push(`- \`${packet.recommendedNextAction}\``);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function renderAvailabilityObstructionSuccessorMarkdown(packet) {
  const lines = [];
  lines.push('# Problem 848 Endpoint Obstruction Successor');
  lines.push('');
  lines.push(`- Active atom: \`${packet.activeAtom}\``);
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Residual subclass: \`left ≡ ${packet.target.residualClass?.residue ?? '(unknown)'} mod ${packet.target.residualClass?.modulus ?? '(unknown)'}\``);
  lines.push(`- Representative left: \`${packet.target.representativeLeft}\``);
  lines.push(`- Window: \`${packet.target.window}\``);
  lines.push(`- Tested finite menu: \`${(packet.target.testedEndpointPrimes ?? []).join(',')}\``);
  lines.push('');
  lines.push('## Source Obstruction');
  lines.push('');
  lines.push(`- t subclass: \`${packet.obstructionSummary?.tCongruence?.expression ?? '(unknown)'}\``);
  lines.push(`- left subclass: \`${packet.obstructionSummary?.leftCongruence?.expression ?? '(unknown)'}\``);
  lines.push(`- witness: \`${packet.obstructionSummary?.squareDivisibilityWitness?.expression ?? '(unknown)'}\``);
  lines.push('');
  lines.push('## Finite-Menu No-Repair Witness');
  lines.push('');
  lines.push(`- Within-window usable endpoints: \`${packet.finiteMenuNoRepairWitness.withinWindowUsableEndpointCount}\``);
  lines.push(`- Blocked within-window endpoints: \`${packet.finiteMenuNoRepairWitness.blockedWithinWindowEndpointCount}\``);
  for (const endpoint of packet.finiteMenuNoRepairWitness.blockedWithinWindowEndpoints ?? []) {
    lines.push(`- p=\`${endpoint.prime}\`, k=\`${endpoint.k}\`, delta=\`${endpoint.delta}\`, square divisor \`${endpoint.squareDivisor ?? '(none)'}\`, status \`${endpoint.squarefreeStatus}\`.`);
  }
  lines.push('');
  lines.push('## Claims');
  lines.push('');
  lines.push(`- Emits deterministic successor atom: \`${packet.claims.emitsDeterministicSuccessorAtom}\``);
  lines.push(`- No finite-menu representative repair: \`${packet.claims.provesNoFiniteMenuRepresentativeRepair}\``);
  lines.push(`- All-prime no-repair: \`${packet.claims.provesAllPrimeNoRepair}\``);
  lines.push(`- All-N: \`${packet.claims.provesAllN}\``);
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push(`- ${packet.proofBoundary}`);
  lines.push('');
  lines.push('## Next Theorem Options');
  lines.push('');
  for (const option of packet.nextTheoremOptions) {
    lines.push(`- \`${option.id}\` [${option.status}]: ${option.statement}`);
  }
  lines.push('');
  lines.push('## Recommended Next Action');
  lines.push('');
  lines.push(`- \`${packet.recommendedNextAction}\``);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function renderObstructionAvailabilitySplitMarkdown(packet) {
  const lines = [];
  lines.push('# Problem 848 Endpoint Obstruction Availability Split');
  lines.push('');
  lines.push(`- Active atom: \`${packet.activeAtom}\``);
  lines.push(`- Status: \`${packet.status}\``);
  lines.push(`- Residual subclass: \`left ≡ ${packet.target.residualClass.residue} mod ${packet.target.residualClass.modulus}\``);
  lines.push(`- Endpoint prime: \`${packet.target.endpointPrime}\``);
  lines.push(`- Window: \`${packet.target.window}\``);
  lines.push('');
  lines.push('## Availability Split');
  lines.push('');
  lines.push(`- Formula: \`${packet.availabilitySplit.kFormulaInParameter}\``);
  lines.push(`- Available residues: \`${packet.availabilitySplit.availableResidueCount}/${packet.availabilitySplit.period}\``);
  lines.push(`- Unavailable residues: \`${packet.availabilitySplit.unavailableResidueCount}/${packet.availabilitySplit.period}\``);
  lines.push(`- Universal inside window: \`${packet.availabilitySplit.universallyWithinWindow}\``);
  lines.push(`- First available residue: \`${JSON.stringify(packet.availabilitySplit.firstAvailableResidue)}\``);
  lines.push(`- First unavailable residue: \`${JSON.stringify(packet.availabilitySplit.firstUnavailableResidue)}\``);
  lines.push('');
  lines.push('## First Available Family Audit');
  lines.push('');
  lines.push(`- Representative left: \`${packet.representativeAudit.left}\``);
  lines.push(`- k/delta/right: \`${packet.representativeAudit.k}\`, \`${packet.representativeAudit.delta}\`, \`${packet.representativeAudit.right}\``);
  lines.push(`- Representative status: \`${packet.representativeAudit.squarefreeStatus}\``);
  if (packet.firstAvailableSquareObstruction) {
    const obstruction = packet.firstAvailableSquareObstruction;
    lines.push(`- Square obstruction: \`${obstruction.obstructionPrime}^2 = ${obstruction.obstructionSquare}\``);
    lines.push(`- Root residues: \`${obstruction.rootResiduesModuloObstructionSquare.join(',')}\` modulo \`${obstruction.obstructionSquare}\`; selected root \`${obstruction.selectedRootResidueModuloObstructionSquare}\`.`);
    lines.push(`- Lifted parameter subclass: \`${obstruction.tCongruence.expression}\`.`);
    lines.push(`- Lifted left subclass: \`${obstruction.leftCongruence.expression}\`.`);
    lines.push(`- Divisibility: \`${obstruction.squareDivisibilityWitness.expression}\`; cross-product residue \`${obstruction.squareDivisibilityWitness.residueModuloObstructionSquare}\`.`);
    lines.push(`- Representative avoids emitted obstruction root: \`${obstruction.boundedWitnessAvoidsObstruction}\`.`);
  } else {
    lines.push(`- No square obstruction found through prime \`${packet.target.obstructionPrimeLimit}\`.`);
  }
  lines.push('');
  lines.push('## Claims');
  lines.push('');
  lines.push(`- Availability split: \`${packet.claims.provesAvailabilitySplit}\``);
  lines.push(`- Available subfamily squarefree hitting: \`${packet.claims.provesAvailableSubfamilySquarefreeHitting}\``);
  lines.push(`- Disproves universal available residue family: \`${packet.claims.disprovesUniversalAvailableResidueFamily}\``);
  lines.push(`- All-N: \`${packet.claims.provesAllN}\``);
  lines.push('');
  lines.push('## Boundary');
  lines.push('');
  lines.push(`- ${packet.proofBoundary}`);
  lines.push('');
  lines.push('## Next Theorem Options');
  lines.push('');
  for (const option of packet.nextTheoremOptions) {
    lines.push(`- \`${option.id}\` [${option.status}]: ${option.statement}`);
  }
  lines.push('');
  lines.push('## Recommended Next Action');
  lines.push('');
  lines.push(`- \`${packet.recommendedNextAction}\``);
  lines.push('');
  return `${lines.join('\n')}\n`;
}

function writeOutput(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
	  const packet = args.availabilityCover
	    ? compileAvailabilityCover(args)
	    : args.availabilityObstructionSuccessor
	    ? compileAvailabilityObstructionSuccessor(args)
	    : args.availabilityObstructionRepair
	    ? compileAvailabilityObstructionRepair(args)
    : args.obstructionAvailabilitySplit
    ? compileObstructionAvailabilitySplit(args)
    : args.obstructionSubclassRepair
    ? compileObstructionSubclassRepair(args)
    : args.squarefreeHittingAudit
    ? compileSquarefreeHittingAudit(args)
    : args.legalityAudit
    ? compileLegalityAudit(args)
    : args.availabilityProfile
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
	      args.availabilityCover
	        ? renderAvailabilityCoverMarkdown(packet)
	        : args.availabilityObstructionSuccessor
	        ? renderAvailabilityObstructionSuccessorMarkdown(packet)
	        : args.availabilityObstructionRepair
	        ? renderObstructionSubclassRepairMarkdown(packet)
        : args.obstructionAvailabilitySplit
        ? renderObstructionAvailabilitySplitMarkdown(packet)
        : args.obstructionSubclassRepair
        ? renderObstructionSubclassRepairMarkdown(packet)
        : args.squarefreeHittingAudit
        ? renderSquarefreeHittingAuditMarkdown(packet)
        : args.legalityAudit
        ? renderLegalityAuditMarkdown(packet)
        : args.availabilityProfile
        ? renderAvailabilityMarkdown(packet)
        : args.windowGrid
          ? renderWindowGridMarkdown(packet)
          : renderMarkdown(packet),
    );
  }
  if (!args.jsonOutput && !args.markdownOutput) {
    console.log(json);
  } else {
	    const isAvailabilityCover = packet.schema === 'erdos.number_theory.p848_endpoint_availability_residue_cover/1';
	    const isAvailabilityObstructionSuccessor = packet.schema === 'erdos.number_theory.p848_endpoint_availability_obstruction_successor/1';
	    const isAvailabilityObstructionRepair = packet.schema === 'erdos.number_theory.p848_endpoint_availability_obstruction_repair/1';
    const isObstructionAvailabilitySplit = packet.schema === 'erdos.number_theory.p848_endpoint_obstruction_availability_split/1';
    const isObstructionSubclassRepair = packet.schema === 'erdos.number_theory.p848_endpoint_obstruction_subclass_repair/1';
    const isSquarefreeHittingAudit = packet.schema === 'erdos.number_theory.p848_endpoint_squarefree_hitting_audit/1';
    const isLegalityAudit = packet.schema === 'erdos.number_theory.p848_endpoint_window_legality_audit/2';
    const isAvailabilityProfile = packet.schema === 'erdos.number_theory.p848_endpoint_availability_profile/1';
    const isWindowGrid = packet.schema === 'erdos.number_theory.p848_endpoint_window_grid/1';
    console.log(JSON.stringify(isAvailabilityCover
	      ? {
	        ok: true,
	        jsonOutput: args.jsonOutput,
	        markdownOutput: args.markdownOutput,
	        status: packet.status,
	        window: packet.target.window,
	        assignedRows: packet.coverage.assignedRows,
	        unassignedRows: packet.coverage.unassignedRows,
	        recommendedNextAction: packet.recommendedNextAction,
	      }
	      : isAvailabilityObstructionSuccessor
	      ? {
	        ok: true,
	        jsonOutput: args.jsonOutput,
	        markdownOutput: args.markdownOutput,
	        status: packet.status,
	        activeAtom: packet.activeAtom,
	        blockedEndpointPrime: packet.successorAtom.blockedEndpointPrime,
	        blockedSquareDivisor: packet.successorAtom.blockedSquareDivisor,
	        recommendedNextAction: packet.recommendedNextAction,
	      }
	      : isAvailabilityObstructionRepair
      ? {
        ok: true,
        jsonOutput: args.jsonOutput,
        markdownOutput: args.markdownOutput,
        status: packet.status,
        representativeRepairPrime: packet.firstRepair?.alternateEndpoint?.prime ?? null,
        representativeRepairDelta: packet.firstRepair?.alternateEndpoint?.delta ?? null,
        recommendedNextAction: packet.recommendedNextAction,
      }
      : isObstructionAvailabilitySplit
      ? {
        ok: true,
        jsonOutput: args.jsonOutput,
        markdownOutput: args.markdownOutput,
        status: packet.status,
        endpointPrime: packet.target.endpointPrime,
        availableResidues: packet.availabilitySplit.availableResidueCount,
        period: packet.availabilitySplit.period,
        obstructionPrime: packet.firstAvailableSquareObstruction?.obstructionPrime ?? null,
        recommendedNextAction: packet.recommendedNextAction,
      }
      : isObstructionSubclassRepair
      ? {
        ok: true,
        jsonOutput: args.jsonOutput,
        markdownOutput: args.markdownOutput,
        status: packet.status,
        representativeRepairPrime: packet.firstRepair?.alternateEndpoint?.prime ?? null,
        representativeRepairDelta: packet.firstRepair?.alternateEndpoint?.delta ?? null,
        recommendedNextAction: packet.recommendedNextAction,
      }
      : isSquarefreeHittingAudit
      ? {
        ok: true,
        jsonOutput: args.jsonOutput,
        markdownOutput: args.markdownOutput,
        status: packet.status,
        auditedFamilyCount: packet.target.auditedFamilyCount,
        obstructionPrime: packet.firstObstruction?.obstruction?.obstructionPrime ?? null,
        obstructionSquare: packet.firstObstruction?.obstruction?.obstructionSquare ?? null,
        recommendedNextAction: packet.recommendedNextAction,
      }
      : isLegalityAudit
      ? {
        ok: true,
        jsonOutput: args.jsonOutput,
        markdownOutput: args.markdownOutput,
        status: packet.status,
        inheritedWindow: packet.windows.inheritedWindow,
        candidateEndpointWindow: packet.windows.candidateEndpointWindow,
        selectorLayerLegal: packet.selectorLayerDecision.legalAtEndpointSelectorLayer,
        recommendedNextAction: packet.recommendedNextAction,
      }
      : isAvailabilityProfile
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
