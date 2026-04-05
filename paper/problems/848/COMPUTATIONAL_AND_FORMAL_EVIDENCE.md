# Computational and Formal Evidence

Problem: Erdos Problem #848 — Squarefree ab+1 Extremal Set Problem
Section role: Summarize computational packets, certificates, and formalization posture without inflating them into stronger claims.

Primary public inputs:
- problems/848/FORMALIZATION.md

Writing guardrails:
- State what was checked, what was not checked, and what level of confidence the computation supports.
- Keep verification surface, compute surface, and proof surface distinct.
- If no formal artifact is public yet, say so directly.

Draft:
Formalization posture:
- the imported public record reports statement-formalized status
- public chatter indicates Lean coverage for the sufficiently-large-`N` theorem and some small
  finite checks, but the current repo does not treat that as a full explicit-threshold proof

Computational posture:
- there is no dedicated compute packet for Problem 848 in this repo yet
- the current explicit witness relies on conservative numerical ledgers over Euler products and
  prime-square tails, not on a large dedicated search computation

Claim-safe reading:
- formalization evidence supports confidence in the asymptotic side of the story
- the current explicit candidate is still packaged through the repo’s proof ledgers, not
  through a formal end-to-end certificate
