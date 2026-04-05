# Proof Overview

Problem: Erdos Problem #848 — Squarefree ab+1 Extremal Set Problem
Section role: Give the roadmap of the argument and the dependency chain between major steps.

Primary public inputs:
- problems/848/EVIDENCE.md
- packs/number-theory/problems/848/FRONTIER_NOTE.md

Writing guardrails:
- Explain the dependency chain before entering technical details.
- Call out any open seam, blocked lemma, or incomplete dependency explicitly.
- Keep route state and proved state separate.

Draft:
The proof strategy follows Sawhney's public proof skeleton, but replaces the asymptotic
`o(1)` and `<<` terms with a shared explicit witness.

Dependency chain:
1. Freeze the weakest public branch and its main-term slack.
2. Make Lemma 2.1 one-sided explicit and identify the large-prime tail as the first live
   bottleneck.
3. Show that the one-sided route can raise the truncation parameter to `T = 250` without
   waking the discrete inclusion-exclusion remainder.
4. Make Lemma 2.2 explicit at the same witness scale and bound its prime-count term.
5. Close the weakest branch with a working `eta = 10^-4`.
6. Compare the same witness against the other public branches and verify that they retain
   larger visible reserve.
7. Package the result as a proposition-level repo candidate.

Open seam:
- the bundle is theorem-shaped and numerically hardened, but it is still a repo candidate
  rather than a publication-ready explicit theorem artifact.
