const PRESETS = {
  atom: {
    mode: 'atom',
    reviewCadence: 'tight',
    maxUnattendedMinutes: 25,
    checkpointAfterLoadBearingResult: true,
    stopRule: 'Stop after one load-bearing atomic step or blocker.',
  },
  route: {
    mode: 'route',
    reviewCadence: 'balanced',
    maxUnattendedMinutes: 90,
    checkpointAfterLoadBearingResult: true,
    stopRule: 'Continue until the active route reaches a real boundary or blocker.',
  },
  milestone: {
    mode: 'milestone',
    reviewCadence: 'sparse',
    maxUnattendedMinutes: 180,
    checkpointAfterLoadBearingResult: false,
    stopRule: 'Continue until the problem milestone boundary or blocker.',
  },
};

const ALIASES = {
  phase: 'route',
};

export function continuationModes() {
  return ['atom', 'route', 'phase', 'milestone'];
}

export function normalizeContinuationMode(mode = 'route') {
  const raw = String(mode || 'route');
  if (PRESETS[raw]) {
    return raw;
  }
  if (ALIASES[raw]) {
    return ALIASES[raw];
  }
  return 'route';
}

export function continuationDisplay(continuation = {}) {
  const requested = continuation.requestedMode || continuation.mode || 'route';
  const normalized = normalizeContinuationMode(requested);
  if (requested === 'phase' && normalized === 'route') {
    return 'route (phase-style)';
  }
  return normalized;
}

export function resolveContinuation(raw = {}) {
  const requested = raw.requestedMode || raw.mode || 'route';
  const mode = normalizeContinuationMode(requested);
  const rest = { ...raw };
  delete rest.mode;
  delete rest.requestedMode;
  return {
    ...PRESETS[mode],
    ...rest,
    mode,
    requestedMode: requested,
  };
}
