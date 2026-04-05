# Limitations and Open Problems

Problem: Erdos Problem #848 — Squarefree ab+1 Extremal Set Problem
Section role: Leave a clean handoff for the next researcher with honest boundaries and unresolved tasks.

Primary public inputs:
- packs/number-theory/problems/848/FRONTIER_NOTE.md
- problems/848/CHECKPOINT_NOTES.md

Writing guardrails:
- List the current bottlenecks plainly.
- Separate near-term route tasks from broader mathematical open problems.
- Do not hide failure modes or uncertainty.

Draft:
Current limitations:
- the repo does not yet claim full all-`N` closure for Problem 848
- the finite range below `exp(1420)` is not closed here
- the current theorem-style note is not yet a publication-ready proof artifact
- the numerical certification is conservative and repo-local, not a proof-assistant certificate

Near-term route tasks:
- decide whether to surface the current theorem-style candidate in the paper bundle, a public
  review artifact, or both
- convert the routed proof ledger into a smoother paper-grade proof narrative
- decide whether the finite range below the witness threshold should be attacked next

Broader open questions:
- can the explicit threshold be pushed materially below `exp(1420)` with the same skeleton?
- can the witness be formalized at the same explicit level in Lean?
- can the finite range below the candidate threshold be closed cleanly enough to upgrade the
  repo status further?
