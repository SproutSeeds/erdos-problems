# Erdos Problem #1008 Claim Loop

This claim loop generalizes theorem-search-verification work directly from the canonical theorem loop, even when no richer bridge is present yet.

## Current State

- Claim loop mode: `baseline`.
- Current claim surface: `route_scaffolding`.
- Active route: `c4_free_lean_archive`.
- Route summary: Keep the solved `C_4`-free density record explicit and preserve the Lean-facing archive posture.
- Next honest move: Record the best public/formalization hook and checkpoint the archive packet.

## Feature Extractors

- `pack_route_state`: ready | Reads pack route, ticket, and atom state as the baseline theorem-search context.
- `theorem_loop_snapshot`: ready | Uses the canonical theorem-loop as the current claim-surface ledger.
- `cluster_graph_theory_features`: ready | Exposes graph-theory archive or theorem-state context to the claim loop.

## Claim Generators

- `baseline_route_claims`: ready | Promotes active routes, ready atoms, and next-honest-move records into candidate claims.
- `theorem_agenda_claims`: ready | Turns theorem agenda items into explicit candidate claim tickets.

## Claim Falsifiers

- `theorem_loop_consistency_check`: ready | Rejects claims that overstate the current theorem-loop claim surface.
- `artifact_boundary_check`: ready | Rejects claims unsupported by canonical artifacts already present in the pack.

## Verifier Adapters

- `canonical_artifact_reader`: ready | Reads theorem-loop, route, and pack artifacts as verifier-facing evidence.

## Candidate Claims

- `promote_ready_atom`: ready | Turn ready atom `G1008.G1.A1` into the next theorem-facing checkpoint. | Record the best public/formalization hook and checkpoint the archive packet.
- `tighten_active_route_claim`: ready | Compress the active route `c4_free_lean_archive` into the next honest theorem-facing claim unit. | Record the best public/formalization hook and checkpoint the archive packet.

## Commands

- Problem surface: `erdos problem show 1008`
- Problem artifacts: `erdos problem artifacts 1008`
- Theorem loop: `erdos problem theorem-loop 1008`
- Theorem refresh: `erdos problem theorem-loop-refresh 1008`
- Claim loop: `erdos problem claim-loop 1008`
- Claim refresh: `erdos problem claim-loop-refresh 1008`

## Sources

- claimLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/CLAIM_LOOP.json`
- claimLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/CLAIM_LOOP.md`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/THEOREM_LOOP.json`
- theoremLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/THEOREM_LOOP.md`
- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008`
