# Erdos Problem #857 Claim Loop

This claim loop generalizes theorem-search-verification work directly from the canonical theorem loop, even when no richer bridge is present yet.

## Current State

- Claim loop mode: `baseline`.
- Current claim surface: `frontier_supported_route`.
- Active route: `anchored_selector_linearization`.
- Route summary: Export the live anchored-selector helper stack into a route-facing leaf that remains honest about the open-problem boundary.
- Next honest move: Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.

## Feature Extractors

- `pack_route_state`: ready | Reads pack route, ticket, and atom state as the baseline theorem-search context.
- `theorem_loop_snapshot`: ready | Uses the canonical theorem-loop as the current claim-surface ledger.
- `cluster_sunflower_features`: ready | Exposes sunflower-family route state, witness status, and compute packet context.

## Claim Generators

- `baseline_route_claims`: ready | Promotes active routes, ready atoms, and next-honest-move records into candidate claims.
- `theorem_agenda_claims`: ready | Turns theorem agenda items into explicit candidate claim tickets.

## Claim Falsifiers

- `theorem_loop_consistency_check`: ready | Rejects claims that overstate the current theorem-loop claim surface.
- `artifact_boundary_check`: ready | Rejects claims unsupported by canonical artifacts already present in the pack.

## Verifier Adapters

- `canonical_artifact_reader`: ready | Reads theorem-loop, route, and pack artifacts as verifier-facing evidence.

## Candidate Claims

- `promote_ready_atom`: ready | Turn ready atom `T10.G3.A2` into the next theorem-facing checkpoint. | Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.
- `stabilize_theorem_module_boundary`: ready | Align the active route with theorem module `sunflower-coda/repo/sunflower_lean/SunflowerLean/ObstructionExport.lean` and freeze its public claim boundary. | The current claim surface is `frontier_supported_route`, so the next theorem move should sharpen what that module actually certifies.
- `tighten_active_route_claim`: ready | Compress the active route `anchored_selector_linearization` into the next honest theorem-facing claim unit. | Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.

## Commands

- Problem surface: `erdos problem show 857`
- Problem artifacts: `erdos problem artifacts 857`
- Theorem loop: `erdos problem theorem-loop 857`
- Theorem refresh: `erdos problem theorem-loop-refresh 857`
- Claim loop: `erdos problem claim-loop 857`
- Claim refresh: `erdos problem claim-loop-refresh 857`

## Sources

- claimLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/CLAIM_LOOP.json`
- claimLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/CLAIM_LOOP.md`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/THEOREM_LOOP.json`
- theoremLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/THEOREM_LOOP.md`
- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857`
