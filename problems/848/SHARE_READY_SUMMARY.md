# Problem 848 Share-Ready Summary

Current repo candidate:
- `N >= exp(1420)`
- `T = 250`
- `eta = 10^-4`

Important context:
- this is the repo's current audited candidate package
- it is not the best imported public threshold currently visible on the forum thread
- as of 2026-03-23, the public thread reports `N0 = 2.64 x 10^17` as a stronger external
  threshold claim

Claim-safe conclusion:
- if `A subseteq [N]` and `ab + 1` is never squarefree for all `a, b in A`
- and `|A| >= (1/25 - 10^-4) * N`
- then the current repo candidate forces `A` into either the `7 mod 25` class or the
  `18 mod 25` class

What is ready now:
- a theorem-style proof note in the paper bundle
- a dossier-level explicit-candidate review note
- supporting explicit ledgers for the branch bounds and numerical witness
- a bounded finite-verification lane with regimes, certificate requirements, and external
  audit notes
- an exact verified base interval `1..3000`

What is not being claimed:
- not full all-`N` closure in the repo
- not a publication-ready proof artifact
- not an update from `decidable` to `solved`
- not the current best public `N0`

Best pointers:
- `problems/848/EXPLICIT_CANDIDATE_REVIEW.md`
- `packs/number-theory/problems/848/PROPOSITION_EXPLICIT_CANDIDATE.md`
- `packs/number-theory/problems/848/THEOREM_STYLE_EXPLICIT_NOTE.md`
