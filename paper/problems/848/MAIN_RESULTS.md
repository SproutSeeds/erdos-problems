# Main Results

Problem: Erdos Problem #848 — Squarefree ab+1 Extremal Set Problem
Section role: List the exact theorems, propositions, or route claims supported by the current public record.

Primary public inputs:
- problems/848/EVIDENCE.md
- problems/848/FORMALIZATION.md
- packs/number-theory/problems/848/FRONTIER_NOTE.md

Writing guardrails:
- Separate proved results, conditional results, heuristics, and targets.
- Use theorem language only for claims backed by the current public record.
- When in doubt, downgrade to a route claim or open objective.

Draft:
The current repo record supports the following claim-safe proposition-level candidate.

Proposition-level repo candidate:
- For `N >= exp(1420)`, if `A subseteq [N]` satisfies that `ab + 1` is never squarefree for
  all `a, b in A` and `|A| >= (1/25 - 10^-4) * N`, then `A` is contained in either the
  `7 mod 25` class or the `18 mod 25` class.

Status of this statement:
- repo candidate: supported by the current explicit ledgers
- public theorem-page update: not yet justified
- full all-`N` closure in this repo: not yet justified

Supporting ingredients:
- explicit Lemma 2.1 ledger
- explicit Lemma 2.2 ledger
- explicit prime-count bound
- weakest-branch assembly
- branch comparison ledger
- certified numerical ledger
