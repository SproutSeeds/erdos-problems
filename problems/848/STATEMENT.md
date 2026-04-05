# Problem 848 Statement

Source: <https://www.erdosproblems.com/848>

Normalized focus:
- Let `A ⊆ {1, ..., N}` be such that `ab+1` is never squarefree for all `a, b in A`.
- Ask whether the largest such sets are given by the residue class `n ≡ 7 (mod 25)`.
- The public page records a stronger asymptotic statement: for sufficiently large `N`,
  any near-extremal set is contained in either `{n ≡ 7 (mod 25)}` or `{n ≡ 18 (mod 25)}`.

Current public posture:
- Site status: `DECIDABLE`
- Publicly reported route breakthrough: Sawhney proved the problem for all sufficiently
  large `N`.
- Remaining gap: close the finite-check range between the asymptotic theorem and a full
  all-`N` resolution.
- Public explicit-threshold discussion on the forum currently records a descending external
  timeline:
  - `N0 = 7 x 10^17` on 2026-03-21
  - `N0 = 3.3 x 10^17` on 2026-03-22
  - `N0 = 2.64 x 10^17` on 2026-03-23
  These are useful imported progress markers, but they are not yet the repo's own audited
  candidate statement.
- Public theorem shape:
  - there exists an integer `N0` such that for all `N >= N0`, every admissible set has size
    at most `|{n in [N] : n ≡ 7 (mod 25)}|`
  - equality is achieved by the `7 mod 25` class and possibly also by the `18 mod 25`
    class
  - Sawhney's note also proves a stability statement for near-extremal sets

Working interpretation for this repo:
- Treat `848` as a finite-check completion problem, not as a fully open asymptotic frontier.
- Keep the asymptotic theorem, the stability statement, and the unresolved finite remainder
  separated in every claim.
- Treat threshold-lowering as a tool for shrinking the remaining finite range, not as the
  final objective by itself.
- Use related problem `844` only as support context unless a direct reduction is written down.
