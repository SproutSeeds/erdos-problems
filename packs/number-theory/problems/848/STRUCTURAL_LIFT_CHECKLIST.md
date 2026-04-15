# Problem 848 Structural Lift Checklist

This checklist breaks the structural lift into proof tasks small enough to reference,
prove, falsify, or hand to a theorem-proving lane. It is a task surface, not a proof.

## Current Focus

- Packet: `D_matching_lower_bounds`
- Target step: `D4_matching_bound_implies_sMaxMixed_bound`
- First actionable step: `D2_p13_matching_lower_bound`
- Why: the C graph-reduction packet is theorem-facing through C6, and D1 now extracts
  the bounded matching target from every current exact mixed-base threatening-outsider row. The next
  decisive lift is the symbolic `p=13` matching lower bound, which is the tightest
  current D-lane family.

## Completion Rule

Each step is complete only when it has:

- a precise statement
- explicit hypotheses
- a proof sketch or proof artifact
- a falsifier boundary
- dependencies recorded
- the next downstream step updated

## A. Counting Language

- `A1_residue_count_formula` [todo]: Prove `# {m <= N : m == r mod q} = floor((N - r) / q) + 1` when `N >= r`, else `0`.
- `A2_base_side_count_formula` [todo]: Express `|B7(N)|`, `|B18(N)|`, and `candidateSize(N)` as modulo-25 floor counts.
- `A3_root_progression_count_formula` [todo]: Count the two Hensel-lifted root progressions for `n^2 + 1 == 0 mod p^2`.
- `A4_vmax_formula` [todo]: Define `vMax(N,p) = max(rawPlus(N,p), rawMinus(N,p))`.
- `A5_higher_root_event_count_formula` [todo]: Express `rGreater(N,p)` as the sum of active higher-prime root-event counts.

## B. Compatibility Language

- `B1_square_witness_compatibility` [todo]: Define outsider/base compatibility by square witnesses `q^2 | x*b + 1`.
- `B2_residue_compatibility_condition` [todo]: Prove `q^2 | x*b + 1` iff `b == -x^{-1} mod q^2` when `gcd(x,q)=1`.
- `B3_noncoprime_exception_boundary` [todo]: Isolate noninvertible `gcd(x,q) != 1` cases before inverse formulas are used.
- `B4_compatible_base_union_of_residue_hits` [todo]: Prove compatible base sets are finite unions of residue hits from active square witnesses.

## C. Mixed-Base Graph Reduction

- `C1_same_side_base_clique` [done]: Same-side principal base residues force a `25` divisor of `u*v+1`, so each same-side component is a clique.
- `C2_two_cliques_plus_cross_edges` [done]: Decompose the mixed-base graph into a `B7` clique, a `B18` clique, and cross edges.
- `C3_missing_cross_graph_definition` [done]: Define `H_{x,N}` as the bipartite graph of missing cross edges.
- `C4_clique_to_vertex_cover_duality` [done]: Prove a mixed clique is all compatible vertices minus a vertex cover of `H_{x,N}`.
- `C5_konig_matching_reduction` [done]: Apply Konig's theorem because `H_{x,N}` is bipartite.
- `C6_mixed_clique_matching_formula` [done]: Prove `sMixed(x,N) = |L| + |R| - maxMatching(H_{x,N})`.

## D. Matching Lower Bounds

- `D1_residue_block_matching_injection` [done]: Extract `K(N,x) = |L| + |R| - strictBaseThreshold + 1` and certify that every current exact mixed-base threatening-outsider row meets the target and saturates the smaller compatible side.
- `D2_p13_matching_lower_bound` [next]: Prove the required matching lower bound for `p=13` threatening rows.
- `D3_p17_matching_lower_bound` [ready]: Prove the required matching lower bound for `p=17` threatening rows.
- `D4_matching_bound_implies_sMaxMixed_bound` [blocked_by_D2_D3]: Substitute the matching lower bound into the mixed-clique formula.

## E. Margin Lifts

- `E1_p13_term_bound` [blocked_by_D4]: Bound `sMaxMixed`, `vMax`, `dMax`, and `rGreater` for `p=13` by floor-function expressions.
- `E2_p13_margin_floor_inequality` [blocked_by_E1]: Prove the `p=13` margin is positive for all `N >= T13`.
- `E3_p17_term_bound` [blocked_by_D4]: Bound `sMaxMixed`, `vMax`, `dMax`, and `rGreater` for `p=17` by floor-function expressions.
- `E4_p17_margin_floor_inequality` [blocked_by_E3]: Prove the `p=17` margin is positive for all `N >= T17`.
- `E5_easy_prime_union_tail` [blocked_by_A_counting]: Prove non-`{13,17}` witness-prime blocks are eventually handled by the safe union bound.

## F. Finite Closure

- `F1_exact_base_certificate` [available]: Use the exact verifier certificate for `N <= 40500`.
- `F2_bounded_structural_certificate` [available]: Use the full mixed-base structural verifier for `7307..7600`.
- `F3_threshold_overlap` [blocked_by_E2_E4_E5]: Verify symbolic thresholds overlap the finite exact or structural certificates.
- `F4_all_ranges_cover_positive_integers` [blocked_by_F3]: Combine exact base plus symbolic structural lift into an all-range cover.

## Recommended Next Steps

- `prove_p13_matching_lower_bound` [critical]: Prove the symbolic `p=13` lower bound that explains why `maxMatching(H_{x,N})` always reaches the D1-extracted `K(N,x)` target in the tightest current exact-mixed family. Command: `erdos problem formalization-work-refresh 848`
- `regression_check_C6_against_verifier` [high]: Keep the discharged C6 mixed-clique matching formula regression-checked against representative full-verifier rows. Command: `erdos number-theory dispatch 848 --apply --action structural_lift_miner`
- `extract_p13_residue_matching_pattern` [high]: For the top `p=13` families, extract the residue-block pattern behind the smaller-side-saturating matchings so D2 can become a symbolic construction rather than bounded evidence. Command: `erdos number-theory dispatch 848 --apply --action structural_lift_miner`

## Boundary

- Claim level: `task_checklist_not_proof`
- Note: this checklist records a proof plan and dependencies. It does not certify any new `N`.
- Promotion rule: only mark a step done after the statement, hypotheses, proof/falsifier boundary, and downstream dependency updates are committed.
