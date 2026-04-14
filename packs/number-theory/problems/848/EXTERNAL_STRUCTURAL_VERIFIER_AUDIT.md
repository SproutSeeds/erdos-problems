# Problem 848 External Structural Verifier Audit

- Generated: 2026-04-11T20:36:37.541Z
- Source dir: `/var/folders/n8/r4w8t2xx4_nfhwggsk2n0hlh0000gn/T/erdos-848-external-source-zKb0jJ`
- Status: `blocked`
- Conclusion: The external verifier is useful as an idea source, but it is blocked from canonical promotion.

## Summary

- sourceFileCount: `3`
- markdownFileCount: `2`
- cppFileCount: `1`
- certificateLikeFileCount: `0`
- blockerCount: `2`
- warningCount: `1`
- supportCount: `3`
- baseSevenMaskPresent: `true`
- baseEighteenMaskPresent: `false`
- baseResidueBothPresent: `true`
- claimsTenMillionSawhneyHandoff: `true`

## Checks

- `external_source_tree_available` [passed/support] Audited 3 files under /var/folders/n8/r4w8t2xx4_nfhwggsk2n0hlh0000gn/T/erdos-848-external-source-zKb0jJ.
- Recommendation: Keep this source tree pinned by URL and commit before any promotion.
- Evidence: `.` /var/folders/n8/r4w8t2xx4_nfhwggsk2n0hlh0000gn/T/erdos-848-external-source-zKb0jJ
- `sawhney_handoff_not_claimed_at_1e7` [failed/blocker] The external writeup appears to claim that Sawhney handles N > 10^7.
- Recommendation: Replace the 10^7 handoff with a repo-audited explicit threshold or mark the claim external-only.
- Evidence: `848/proof.md:3` Sawhney handles N > 10^7 after the finite verifier.
- Evidence: `README.md:3` Problem 848 solved for all N by checking N <= 10^7 and using Sawhney for N > 10^7.
- `base_exchange_mask_covers_both_principal_sides` [failed/blocker] The verifier appears to build base-exchange masks for the 7 mod 25 side without a parallel 18 mod 25 mask.
- Recommendation: Either add a separate 18 mod 25 mask audit, or supply a proof that the 7-side mask dominates the 18-side case for every outsider and N.
- Evidence: `848/erdos848_verifier_v5.cpp:1` bool is_base_residue(int x) { const int r = x % 25; return r == 7 || r == 18; }
- Evidence: `848/erdos848_verifier_v5.cpp:3` const long long b = 7LL * x + 1;
- Evidence: `848/erdos848_verifier_v5.cpp:4` const long long max_val = x * (7LL + 25LL * (m_max - 1)) + 1;
- `both_base_residues_are_excluded_from_outsider_pool` [passed/support] The verifier source explicitly recognizes both 7 and 18 mod 25 as principal base residues.
- Recommendation: Keep outsider-pool exclusion separate from base-exchange mask coverage; both are required for promotion.
- Evidence: `848/erdos848_verifier_v5.cpp:1` bool is_base_residue(int x) { const int r = x % 25; return r == 7 || r == 18; }
- `outsider_clique_inequality_is_documented` [passed/support] The external writeup documents an outsider-clique style inequality.
- Recommendation: Treat this as a structural idea source until the inequality is ported into repo-owned definitions and tests.
- Evidence: `848/proof.md:5` s_max^(p)(N) + max(V_p, V_p) + d_max^(p)(N) + R_{>p}(N) < M(N)
- `finite_certificate_surface_present` [warning/warning] The scan did not find a complete verifier/certificate/writeup surface.
- Recommendation: Require a repo-owned certificate schema before importing any interval coverage.
- Evidence: `848/erdos848_verifier_v5.cpp` verifier source

## Next Actions

- Keep the external computation in EXTERNAL_VERIFICATION_LEDGER as blocked, not promoted.
- Patch or independently reimplement the structural verifier with both base sides covered.
- Replace the false 10^7 Sawhney handoff with a repo-audited explicit threshold before any all-N claim.
- Port only the outsider-clique inequality shape into a repo-owned structural verifier lane.

## Boundary

- This audit only evaluates structural import readiness. It does not certify the external computation or solve Problem 848.
