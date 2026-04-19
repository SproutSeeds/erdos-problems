#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../../../../..');

const DEFAULT_MENU_ROOT = path.join(
  repoRoot,
  'output',
  'frontier-engine-local',
  'p848-anchor-ladder',
  'live-frontier-sync',
  '2026-04-05',
);

const DEFAULT_LABELS = [
  'SIX_PREFIX_NINETEEN',
  'SIX_PREFIX_TWENTY',
  'SIX_PREFIX_TWENTY_ONE',
  'SIX_PREFIX_TWENTY_TWO',
  'SIX_PREFIX_TWENTY_THREE',
  'SIX_PREFIX_TWENTY_FOUR',
];

function parseArgs(argv) {
  const options = {
    menuRoot: DEFAULT_MENU_ROOT,
    labels: DEFAULT_LABELS,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--menu-root') {
      options.menuRoot = path.resolve(argv[index + 1]);
      index += 1;
    } else if (arg === '--labels') {
      options.labels = argv[index + 1].split(',').map((label) => label.trim()).filter(Boolean);
      index += 1;
    } else if (arg === '--pretty') {
      options.pretty = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x;
}

function mod(value, modulus) {
  const result = value % modulus;
  return result < 0 ? result + modulus : result;
}

function modInverse(value, modulus) {
  let oldR = mod(value, modulus);
  let r = modulus;
  let oldS = 1;
  let s = 0;

  while (r !== 0) {
    const quotient = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }

  if (oldR !== 1) {
    return null;
  }
  return mod(oldS, modulus);
}

function anchorResidue(anchor, squareModulus) {
  const inverse = modInverse(anchor, squareModulus);
  if (inverse === null) {
    return null;
  }
  return mod(-inverse, squareModulus);
}

function crtPair(left, right) {
  const divisor = gcd(left.modulus, right.modulus);
  if (mod(right.residue - left.residue, divisor) !== 0) {
    return null;
  }

  const leftReduced = left.modulus / divisor;
  const rightReduced = right.modulus / divisor;
  const inverse = modInverse(leftReduced, rightReduced);
  if (inverse === null) {
    return null;
  }

  const step = mod(((right.residue - left.residue) / divisor) * inverse, rightReduced);
  const modulus = left.modulus * rightReduced;
  const residue = mod(left.residue + left.modulus * step, modulus);
  return { residue, modulus };
}

function tupleKey(representative, tuple) {
  return `${representative}|${tuple.join(',')}`;
}

function formatSquareModulus(squareModulus) {
  if (squareModulus === 4 || squareModulus === 9) {
    return String(squareModulus);
  }
  return `${Math.trunc(Math.sqrt(squareModulus))}^2`;
}

function tupleDisplayKey(tuple) {
  return tuple.map(formatSquareModulus).join(', ');
}

function menuTuple(family) {
  return family.tupleRows.map((row) => row.squareModulus);
}

function enumerateRightProgressions(rightAnchors, squareModuli) {
  let progressions = [{ residue: 0, modulus: 1, tuple: [], used: new Set() }];

  for (const anchor of rightAnchors) {
    const nextProgressions = [];
    for (const progression of progressions) {
      for (const squareModulus of squareModuli) {
        if (progression.used.has(squareModulus)) {
          continue;
        }
        const residue = anchorResidue(anchor, squareModulus);
        if (residue === null) {
          continue;
        }
        const combined = crtPair(progression, { residue, modulus: squareModulus });
        if (combined === null) {
          continue;
        }
        nextProgressions.push({
          residue: combined.residue,
          modulus: combined.modulus,
          tuple: [...progression.tuple, squareModulus],
          used: new Set([...progression.used, squareModulus]),
        });
      }
    }
    progressions = nextProgressions;
  }

  return progressions;
}

function leftWitnessChoices(n, anchor, squareModuli, usedRight) {
  const value = anchor * n + 1;
  return squareModuli.filter((squareModulus) => {
    return !usedRight.has(squareModulus) && value % squareModulus === 0;
  });
}

function enumerateBoundedMenuCandidates(menu) {
  const anchors = menu.parameters.anchors;
  const squareModuli = menu.parameters.squareModuli;
  const leftAnchors = anchors.slice(0, 3);
  const rightAnchors = anchors.slice(3);
  const representativeBound = Math.max(...menu.families.map((family) => family.representative));
  const rightProgressions = enumerateRightProgressions(rightAnchors, squareModuli);
  const solutions = [];
  const seen = new Set();
  let candidateNCount = 0;

  for (const progression of rightProgressions) {
    const start = progression.residue === 0 ? progression.modulus : progression.residue;
    const usedRight = progression.used;
    for (let n = start; n <= representativeBound; n += progression.modulus) {
      candidateNCount += 1;
      const firstChoices = leftWitnessChoices(n, leftAnchors[0], squareModuli, usedRight);
      if (firstChoices.length === 0) {
        continue;
      }
      const secondChoices = leftWitnessChoices(n, leftAnchors[1], squareModuli, usedRight);
      if (secondChoices.length === 0) {
        continue;
      }
      const thirdChoices = leftWitnessChoices(n, leftAnchors[2], squareModuli, usedRight);
      if (thirdChoices.length === 0) {
        continue;
      }

      for (const first of firstChoices) {
        for (const second of secondChoices) {
          if (second === first) {
            continue;
          }
          for (const third of thirdChoices) {
            if (third === first || third === second) {
              continue;
            }
            const tuple = [first, second, third, ...progression.tuple];
            const key = tupleKey(n, tuple);
            if (!seen.has(key)) {
              seen.add(key);
            solutions.push({ representative: n, tuple, tupleKey: tupleDisplayKey(tuple) });
            }
          }
        }
      }
    }
  }

  solutions.sort((left, right) => {
    if (left.representative !== right.representative) {
      return left.representative - right.representative;
    }
    if (left.tupleKey < right.tupleKey) {
      return -1;
    }
    if (left.tupleKey > right.tupleKey) {
      return 1;
    }
    return 0;
  });

  return { solutions, rightProgressionCount: rightProgressions.length, candidateNCount };
}

function duplicateRepresentativeCount(families) {
  const counts = new Map();
  for (const family of families) {
    counts.set(family.representative, (counts.get(family.representative) ?? 0) + 1);
  }
  return [...counts.values()].filter((count) => count > 1).length;
}

function auditMenu(menuRoot, label) {
  const menuPath = path.join(menuRoot, `${label}_FAMILY_MENU.json`);
  const menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
  const { solutions, rightProgressionCount, candidateNCount } = enumerateBoundedMenuCandidates(menu);
  const menuKeys = menu.families.map((family) => tupleKey(family.representative, menuTuple(family)));
  const menuKeySet = new Set(menuKeys);
  const solutionKeys = solutions.map((solution) => tupleKey(solution.representative, solution.tuple));
  const solutionKeySet = new Set(solutionKeys);
  const missing = menuKeys.filter((key) => !solutionKeySet.has(key));
  const extra = solutions.filter((solution) => !menuKeySet.has(tupleKey(solution.representative, solution.tuple)));
  const representativeBound = Math.max(...menu.families.map((family) => family.representative));
  const smallerExtra = extra.filter((solution) => solution.representative < representativeBound);
  const sameBoundExtra = extra.filter((solution) => solution.representative === representativeBound);
  const orderedPrefix = solutionKeys.slice(0, menuKeys.length);
  const exactPrefixReproduction = orderedPrefix.length === menuKeys.length
    && orderedPrefix.every((key, index) => key === menuKeys[index]);
  const firstMismatchIndex = orderedPrefix.findIndex((key, index) => key !== menuKeys[index]);

  return {
    label,
    path: path.relative(repoRoot, menuPath),
    limit: menu.parameters.limit,
    familyCount: menu.families.length,
    knownFailureParameterCount: menu.parameters.knownFailures.length,
    squareModuliCount: menu.parameters.squareModuli.length,
    representativeBound,
    rightProgressionCount,
    candidateNCount,
    enumeratedSolutionCount: solutions.length,
    menuRowCount: menuKeys.length,
    missingMenuRowCount: missing.length,
    extraSolutionCount: extra.length,
    smallerExtraCount: smallerExtra.length,
    sameBoundExtraCount: sameBoundExtra.length,
    duplicateRepresentativeCount: duplicateRepresentativeCount(menu.families),
    exactOrderedListReproduction: exactPrefixReproduction,
    firstMismatchIndex: firstMismatchIndex < 0 ? null : firstMismatchIndex,
    missingSamples: missing.slice(0, 3),
    extraSamples: extra.slice(0, 3).map((solution) => ({
      representative: solution.representative,
      tuple: solution.tuple,
      tupleKey: solution.tupleKey,
    })),
    sameBoundExtraSamples: sameBoundExtra.slice(0, 3).map((solution) => ({
      representative: solution.representative,
      tuple: solution.tuple,
      tupleKey: solution.tupleKey,
    })),
  };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const audits = options.labels.map((label) => auditMenu(options.menuRoot, label));
  const totalMissing = audits.reduce((sum, audit) => sum + audit.missingMenuRowCount, 0);
  const totalSmallerExtra = audits.reduce((sum, audit) => sum + audit.smallerExtraCount, 0);
  const totalSameBoundExtra = audits.reduce((sum, audit) => sum + audit.sameBoundExtraCount, 0);
  const exactListReproduction = audits.every((audit) => audit.exactOrderedListReproduction);
  const result = {
    schema: 'erdos.number_theory.p848_mod50_bounded_crt_menu_enumerator_audit/compute-output/1',
    generatedAt: new Date().toISOString(),
    menuRoot: path.relative(repoRoot, options.menuRoot),
    algorithm: {
      anchors: {
        left: [7, 32, 57],
        right: [82, 132, 182],
      },
      tieBreakPolicy: 'representative ascending, then tupleKey string ascending, then take the first menu limit rows',
      description: 'Enumerate distinct right-half CRT progressions, enumerate n <= the restored menu representative bound for each progression, then directly test left-half square witnesses.',
      avoidsNaiveCartesianProbe: true,
    },
    summary: {
      menuCount: audits.length,
      allMenuRowsContained: audits.every((audit) => audit.missingMenuRowCount === 0),
      allNoSmallerExtras: audits.every((audit) => audit.smallerExtraCount === 0),
      exactOrderedListReproduction: exactListReproduction,
      totalMissing,
      totalSmallerExtra,
      totalSameBoundExtra,
    },
    audits,
  };

  console.log(JSON.stringify(result, null, options.pretty ? 2 : 0));
}

main();
