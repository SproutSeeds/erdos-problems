import {
  buildOrpComputeGateResult,
  buildOrpComputePacket,
  defineComputePacket,
  defineDecision,
  definePolicy,
  defineRung,
  evaluateDispatch,
} from 'breakthroughs';

function normalizeRungId(value, fallback) {
  const text = String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return text || fallback;
}

function parseSpendClass(rawRung) {
  const raw = String(rawRung?.role ?? rawRung?.mode ?? '').trim().toLowerCase();
  if (raw === 'local_unmetered' || raw === 'local') {
    return 'local_unmetered';
  }
  return 'paid_metered';
}

function buildRungs(packet) {
  const rawRungs = Array.isArray(packet?.rungs) ? packet.rungs : [];
  const rungs = rawRungs.map((rawRung, index) => {
    const label = String(rawRung?.name ?? rawRung?.label ?? `rung_${index + 1}`).trim();
    return defineRung({
      id: normalizeRungId(label, `rung-${index + 1}`),
      label,
      spendClass: parseSpendClass(rawRung),
      admitted: true,
      metadata: {
        note: String(rawRung?.note ?? rawRung?.goal ?? '').trim(),
      },
    });
  });

  if (rungs.length > 0) {
    return rungs;
  }

  return [
    defineRung({
      id: 'local-scout',
      label: 'local_scout',
      spendClass: 'local_unmetered',
      admitted: true,
    }),
  ];
}

function selectRung(packet, rungs) {
  const localRung = rungs.find((rung) => rung.spendClass === 'local_unmetered') ?? rungs[0];
  const paidRung = rungs.find((rung) => rung.spendClass === 'paid_metered') ?? rungs[0];
  const status = String(packet?.status ?? '').trim().toLowerCase();

  if (status === 'ready_for_paid_transfer' || status === 'paid_active') {
    return paidRung;
  }
  return localRung;
}

function buildPolicy(packet, selectedRung) {
  const approvedRungs = [];
  const status = String(packet?.status ?? '').trim().toLowerCase();
  if (
    selectedRung.spendClass === 'paid_metered'
    && (status === 'paid_active' || packet?.approvalRequired === false)
  ) {
    approvedRungs.push(selectedRung.id);
  }

  return definePolicy({
    local: {
      defaultAction: 'allow',
    },
    paid: {
      defaultAction: 'require_explicit_approval',
      approvedRungs,
    },
  });
}

function buildRequiredOutputs(packet) {
  const base = [
    'run_manifest.json',
    'impact_note.md',
    'traceability_record.json',
  ];
  const canonicalPacket = packet?.sourceRepo?.canonical_packet_path;
  if (canonicalPacket) {
    base.push(canonicalPacket);
  }
  return [...new Set(base)];
}

function describeWhen(dispatchAction, selectedRung) {
  if (!dispatchAction || !selectedRung) {
    return 'No admitted compute rung is currently selected.';
  }
  if (dispatchAction === 'run_local') {
    return `Run now on the local ${selectedRung.label} rung if the packet is still bounded and the local scout artifacts can be captured cleanly.`;
  }
  if (dispatchAction === 'request_paid_approval') {
    return `Do not launch yet; request explicit approval before using the ${selectedRung.label} paid rung.`;
  }
  if (dispatchAction === 'run_paid') {
    return `A paid rung is already admitted for this packet; run only with traceable artifact capture on ${selectedRung.label}.`;
  }
  return 'Hold the packet until the compute policy mismatch is resolved.';
}

export function buildBreakthroughsComputeView(problem, packet) {
  if (!packet) {
    return null;
  }

  const requiredOutputs = buildRequiredOutputs(packet);
  const decision = defineDecision({
    id: `erdos-${problem.problemId}-${packet.laneId}`,
    question: packet.question,
    requiredOutputs,
    metadata: {
      problemId: problem.problemId,
      cluster: problem.cluster,
      claimLevelGoal: packet.claimLevelGoal,
    },
  });

  const rungs = buildRungs(packet);
  const selectedRung = selectRung(packet, rungs);
  const policy = buildPolicy(packet, selectedRung);
  const computePacket = defineComputePacket({
    id: packet.laneId,
    decisionId: decision.id,
    rungId: selectedRung.id,
    question: packet.question,
    successBar: {
      claimLevelGoal: packet.claimLevelGoal,
      statusTarget: packet.status,
    },
    stopCondition: 'Hold if the packet stops reducing uncertainty honestly or the required artifact bundle cannot be returned cleanly.',
    requiredOutputs,
    metadata: {
      problemId: problem.problemId,
      sourceRepo: packet.sourceRepo,
      recommendation: packet.recommendation,
    },
  });
  const dispatchResult = evaluateDispatch({
    decision,
    rung: selectedRung,
    policy,
    packet: computePacket,
  });

  const gate = buildOrpComputeGateResult({
    gateId: `breakthroughs_${packet.laneId}`,
    command: `erdos sunflower status ${problem.problemId}`,
    status: dispatchResult.action === 'hold_packet' ? 'fail' : 'pass',
    exitCode: dispatchResult.action === 'hold_packet' ? 1 : 0,
    durationMs: 0,
    evidencePaths: requiredOutputs,
    evidenceStatus: 'process_only',
    evidenceNote: 'This is a compute-admission record only. Evidence remains in canonical artifact paths.',
  });

  const orpPacket = buildOrpComputePacket({
    repoRoot: packet.sourceRepo?.canonical_packet_path ?? '',
    decision,
    packet: computePacket,
    dispatchResult: {
      ...dispatchResult,
      runId: `${packet.laneId}-${problem.problemId}`,
    },
    gateResults: [gate],
    boardId: `${problem.cluster}_compute`,
    problemId: problem.problemId,
    stateNote: `Compute policy evaluated for ${packet.laneId} with action ${dispatchResult.action}.`,
  });

  return {
    engine: 'breakthroughs',
    decisionId: decision.id,
    question: decision.question,
    selectedRung: {
      id: selectedRung.id,
      label: selectedRung.label,
      spendClass: selectedRung.spendClass,
    },
    dispatchResult,
    when: describeWhen(dispatchResult.action, selectedRung),
    requiredOutputs,
    orpPacket,
  };
}
