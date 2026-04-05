# Proof Details

Problem: Erdos Problem #848 — Squarefree ab+1 Extremal Set Problem
Section role: Write the technical proof content or the best current public decomposition when the proof is incomplete.

Primary public inputs:
- problems/848/EVIDENCE.md
- packs/number-theory/problems/848/ROUTE_PACKET.yaml

Writing guardrails:
- Do not skip unresolved steps by rhetorical compression.
- If a subclaim is computational or formal, point to the exact public evidence packet.
- Use local labels for lemmas and keep missing subproofs visible.

Draft:
Witness parameters:
- `N >= exp(1420)`
- `T = 250`
- `eta = 10^-4`

Key proof packets:
- `packs/number-theory/problems/848/LEMMA21_EXPLICIT_BOUND.md`
- `packs/number-theory/problems/848/LEMMA21_TRUNCATION_SCAN.md`
- `packs/number-theory/problems/848/LEMMA22_EXPLICIT_BOUND.md`
- `packs/number-theory/problems/848/LEMMA22_PRIME_COUNT_BOUND.md`
- `packs/number-theory/problems/848/WEAKEST_BRANCH_T250_ASSEMBLY.md`
- `packs/number-theory/problems/848/BRANCH_COMPARISON_LEDGER.md`
- `packs/number-theory/problems/848/CERTIFIED_NUMERICAL_LEDGER.md`

Current technical posture:
- the weakest branch is closed by the shared witness with certified visible reserve
- the branches rounded publicly as `0.0358`, `0.0336`, and `0.0294` are also controlled by
  the same witness
- the remaining gap is not another hidden branch estimate, but writeup-grade assembly and
  downstream review/paper surfacing

This section should eventually be upgraded into a single continuous proof narrative. Right
now it is best read as a routed proof ledger with explicit dependency files.
