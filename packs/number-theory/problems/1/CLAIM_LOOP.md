# Erdos Problem #1 Claim Loop

This claim loop generalizes theorem-search-verification work directly from the canonical theorem loop, even when no richer bridge is present yet.

## Current State

- Claim loop mode: `baseline`.
- Current claim surface: `route_scaffolding`.
- Active route: `distinct_subset_sum_lower_bound`.
- Route summary: Keep the problem centered on the exponential-growth lower-bound route implied by distinct subset sums.
- Next honest move: Record the first reduction and checkpoint it without overclaiming theorem progress.

## Feature Extractors

- `pack_route_state`: ready | Reads pack route, ticket, and atom state as the baseline theorem-search context.
- `theorem_loop_snapshot`: ready | Uses the canonical theorem-loop as the current claim-surface ledger.
- `cluster_number_theory_features`: ready | Exposes number-theory specific finite-gap and verifier-facing metadata.

## Claim Generators

- `baseline_route_claims`: ready | Promotes active routes, ready atoms, and next-honest-move records into candidate claims.
- `theorem_agenda_claims`: ready | Turns theorem agenda items into explicit candidate claim tickets.

## Claim Falsifiers

- `theorem_loop_consistency_check`: ready | Rejects claims that overstate the current theorem-loop claim surface.
- `artifact_boundary_check`: ready | Rejects claims unsupported by canonical artifacts already present in the pack.
- `exact_interval_counterexample_scan`: ready | Uses bounded exact interval checks to kill false local claims quickly.

## Verifier Adapters

- `canonical_artifact_reader`: ready | Reads theorem-loop, route, and pack artifacts as verifier-facing evidence.
- `exact_small_n`: ready | Bounded exact verifier for finite interval certification.

## Candidate Claims

- `promote_ready_atom`: ready | Turn ready atom `N1.G1.A1` into the next theorem-facing checkpoint. | Record the first reduction and checkpoint it without overclaiming theorem progress.
- `tighten_active_route_claim`: ready | Compress the active route `distinct_subset_sum_lower_bound` into the next honest theorem-facing claim unit. | Record the first reduction and checkpoint it without overclaiming theorem progress.

## Commands

- Problem surface: `erdos problem show 1`
- Problem artifacts: `erdos problem artifacts 1`
- Theorem loop: `erdos problem theorem-loop 1`
- Theorem refresh: `erdos problem theorem-loop-refresh 1`
- Claim loop: `erdos problem claim-loop 1`
- Claim refresh: `erdos problem claim-loop-refresh 1`

## Sources

- claimLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/CLAIM_LOOP.json`
- claimLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/CLAIM_LOOP.md`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/THEOREM_LOOP.json`
- theoremLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/THEOREM_LOOP.md`
- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1`
