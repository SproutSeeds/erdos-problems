export const catalog = [
  {
    problemId: '18',
    displayName: 'Erdos Problem #18',
    title: 'Practical Numbers Divisor-Sum Efficiency',
    siteStatus: 'open',
    siteBadge: 'OPEN',
    repoStatus: 'cataloged',
    cluster: 'number-theory',
    familyTags: ['number-theory', 'divisors', 'factorials'],
    relatedProblems: [],
    sourceUrl: 'https://www.erdosproblems.com/18',
    shortStatement:
      'Study whether infinitely many practical numbers admit polylogarithmic divisor-sum efficiency, and whether h(n!) is polylogarithmic.',
    harnessDepth: 'dossier',
    formalizationStatus: 'statement-formalized',
  },
  {
    problemId: '20',
    displayName: 'Erdos Problem #20',
    title: 'Strong Sunflower Problem',
    siteStatus: 'open',
    siteBadge: 'OPEN',
    repoStatus: 'active',
    cluster: 'sunflower',
    familyTags: ['sunflower', 'uniform-families'],
    relatedProblems: ['857'],
    sourceUrl: 'https://www.erdosproblems.com/20',
    shortStatement:
      'Determine the strong sunflower threshold for k-uniform set systems, with the k=3 lane as the immediate active frontier.',
    harnessDepth: 'deep',
    formalizationStatus: 'active',
  },
  {
    problemId: '89',
    displayName: 'Erdos Problem #89',
    title: 'Distinct Distances Lower Bound',
    siteStatus: 'open',
    siteBadge: 'OPEN',
    repoStatus: 'cataloged',
    cluster: 'geometry',
    familyTags: ['geometry', 'distances'],
    relatedProblems: [],
    sourceUrl: 'https://www.erdosproblems.com/89',
    shortStatement:
      'Ask whether every n-point set in the plane determines at least a constant multiple of n/sqrt(log n) distinct distances.',
    harnessDepth: 'dossier',
    formalizationStatus: 'statement-formalized',
  },
  {
    problemId: '536',
    displayName: 'Erdos Problem #536',
    title: 'LCM Sunflower Analogue',
    siteStatus: 'open',
    siteBadge: 'OPEN',
    repoStatus: 'cataloged',
    cluster: 'sunflower',
    familyTags: ['sunflower-analogue', 'number-theory'],
    relatedProblems: ['857'],
    sourceUrl: 'https://www.erdosproblems.com/536',
    shortStatement:
      'Number-theoretic analogue of the sunflower problem framed through least common multiples.',
    harnessDepth: 'dossier',
    formalizationStatus: 'planned',
  },
  {
    problemId: '542',
    displayName: 'Erdos Problem #542',
    title: 'LCM-Free Sets Reciprocal Sum Bound',
    siteStatus: 'solved',
    siteBadge: 'SOLVED',
    repoStatus: 'historical',
    cluster: 'number-theory',
    familyTags: ['number-theory', 'least-common-multiple'],
    relatedProblems: ['784'],
    sourceUrl: 'https://www.erdosproblems.com/542',
    shortStatement:
      'Control reciprocal sums of sets with all pairwise least common multiples above n, a problem resolved by Schinzel and Szekeres.',
    harnessDepth: 'dossier',
    formalizationStatus: 'unstarted',
  },
  {
    problemId: '856',
    displayName: 'Erdos Problem #856',
    title: 'Harmonic LCM Sunflower Analogue',
    siteStatus: 'open',
    siteBadge: 'OPEN',
    repoStatus: 'cataloged',
    cluster: 'sunflower',
    familyTags: ['sunflower-analogue', 'number-theory'],
    relatedProblems: ['857'],
    sourceUrl: 'https://www.erdosproblems.com/856',
    shortStatement:
      'A harmonic or density-shaped LCM analogue whose exponents are explicitly linked to progress on the weak sunflower problem.',
    harnessDepth: 'dossier',
    formalizationStatus: 'planned',
  },
  {
    problemId: '857',
    displayName: 'Erdos Problem #857',
    title: 'Sunflower Conjecture',
    siteStatus: 'open',
    siteBadge: 'OPEN',
    repoStatus: 'active',
    cluster: 'sunflower',
    familyTags: ['sunflower', 'extremal-set-theory'],
    relatedProblems: ['20', '536', '856'],
    sourceUrl: 'https://www.erdosproblems.com/857',
    shortStatement:
      'Bound the weak sunflower number m(n,k) by C(k)^n and sharpen the current active route toward asymptotic closure.',
    harnessDepth: 'deep',
    formalizationStatus: 'active',
    researchState: {
      openProblem: true,
      activeRoute: 'anchored_selector_linearization',
      routeBreakthrough: true,
      problemSolved: false,
    },
  },
  {
    problemId: '1008',
    displayName: 'Erdos Problem #1008',
    title: 'C4-Free Subgraph Density Problem',
    siteStatus: 'solved',
    siteBadge: 'PROVED (LEAN)',
    repoStatus: 'historical',
    cluster: 'graph-theory',
    familyTags: ['graph-theory', 'cycles'],
    relatedProblems: [],
    sourceUrl: 'https://www.erdosproblems.com/1008',
    shortStatement:
      'Determine whether every graph with m edges contains a C4-free subgraph with a constant multiple of m^(2/3) edges.',
    harnessDepth: 'dossier',
    formalizationStatus: 'site-proved-lean',
  },
];

export function listProblems(filters = {}) {
  const cluster = filters.cluster ? String(filters.cluster).toLowerCase() : null;
  const repoStatus = filters.repoStatus ? String(filters.repoStatus).toLowerCase() : null;
  const harnessDepth = filters.harnessDepth ? String(filters.harnessDepth).toLowerCase() : null;

  return [...catalog]
    .filter((entry) => (cluster ? entry.cluster === cluster : true))
    .filter((entry) => (repoStatus ? entry.repoStatus === repoStatus : true))
    .filter((entry) => (harnessDepth ? entry.harnessDepth === harnessDepth : true))
    .sort((a, b) => Number(a.problemId) - Number(b.problemId));
}

export function getProblem(problemId) {
  return catalog.find((entry) => entry.problemId === String(problemId));
}

export function getCluster(clusterName) {
  const name = String(clusterName).toLowerCase();
  const problems = listProblems({ cluster: name });
  if (problems.length === 0) {
    return null;
  }
  return {
    name,
    problems,
    deepHarnessProblems: problems.filter((entry) => entry.harnessDepth === 'deep'),
    dossierProblems: problems.filter((entry) => entry.harnessDepth === 'dossier'),
  };
}

export function listClusters() {
  const names = [...new Set(catalog.map((entry) => entry.cluster))].sort();
  return names.map((name) => getCluster(name));
}
