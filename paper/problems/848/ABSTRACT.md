# Abstract

Problem: Erdos Problem #848 — Squarefree ab+1 Extremal Set Problem
Section role: State the exact scope of the paper and separate proved statements from targets or heuristics.

Primary public inputs:
- problems/848/STATEMENT.md
- problems/848/EVIDENCE.md
- packs/number-theory/problems/848/FRONTIER_NOTE.md

Writing guardrails:
- Open with the exact problem framing and current status.
- Do not imply a full proof unless the public record supports it.
- If the route is incomplete, describe this as progress, structure, or a route note.

Draft:
This paper bundle records a claim-safe explicit candidate for Erdős Problem 848, the
squarefree `ab+1` extremal set problem. The current repo evidence supports a shared witness
with `N >= exp(1420)`, truncation value `T = 250`, and working stability parameter
`eta = 10^-4`, under which every public branch in Sawhney's proof skeleton is controlled by
the same explicit ledger. The bundle does not claim a publication-ready proof or full all-`N`
closure; rather, it packages the present explicit candidate, its numerical hardening, and the
remaining obligations for future review.
