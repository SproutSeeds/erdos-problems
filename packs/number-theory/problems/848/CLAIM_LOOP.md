# Erdos Problem #848 Claim Loop

This claim loop generalizes theorem-search-verification work using the theorem loop plus richer bridge-backed search evidence.

## Current State

- Claim loop mode: `bridge_backed`.
- Current claim surface: `bridge_backed_frontier_support`.
- Active route: `finite_check_gap_closure`.
- Route summary: Convert the sufficiently-large-N theorem into a complete all-N resolution without overstating what is already closed or confusing imported thresholds with repo-owned claims.
- Next honest move: Decide whether to extend exact verified coverage beyond `40500` or switch method class.

## Feature Extractors

- `pack_route_state`: ready | Reads pack route, ticket, and atom state as the baseline theorem-search context.
- `theorem_loop_snapshot`: ready | Uses the canonical theorem-loop as the current claim-surface ledger.
- `search_theorem_bridge_state`: ready | Imports structured bridge state, packet ledgers, and search-side claim hooks.
- `cluster_number_theory_features`: ready | Exposes number-theory specific finite-gap and verifier-facing metadata.

## Claim Generators

- `baseline_route_claims`: ready | Promotes active routes, ready atoms, and next-honest-move records into candidate claims.
- `theorem_agenda_claims`: ready | Turns theorem agenda items into explicit candidate claim tickets.
- `search_bridge_claims`: ready | Projects bridge-backed structural hooks into concrete claim candidates.
- `p848_repair_obstruction_claims`: ready | Builds obstruction-alignment and repair-class candidate claims from the live packet ledger.

## Claim Falsifiers

- `theorem_loop_consistency_check`: ready | Rejects claims that overstate the current theorem-loop claim surface.
- `artifact_boundary_check`: ready | Rejects claims unsupported by canonical artifacts already present in the pack.
- `exact_interval_counterexample_scan`: ready | Uses bounded exact interval checks to kill false local claims quickly.
- `bridge_packet_replay`: ready | Replays current bridge packets and tracked tails against candidate claims.

## Verifier Adapters

- `canonical_artifact_reader`: ready | Reads theorem-loop, route, and pack artifacts as verifier-facing evidence.
- `exact_small_n`: ready | Bounded exact verifier for finite interval certification.
- `search_theorem_bridge`: ready | Supplies live search-side packet and leaderboard evidence to the claim loop.
- `p848_family_repair_surface`: ready | Evaluates candidate claims against tracked-tail repair surfaces and shared-prefix packets.

## Candidate Claims

- `choose_next_finite_gap_move`: ready | Choose the next finite-gap closure move and keep the theorem-facing claim surface honest. | Decide whether to extend exact verified coverage beyond `40500` or switch method class.
- `explain_next_unmatched_alignment`: ready | Explain structurally why shared-prefix representative `137720141` aligns with the first failure of tail `282`. | If that alignment is structural rather than accidental, it turns a search coincidence into a theorem-facing obstruction class.
- `explain_completed_vs_search_leader_split`: ready | Explain why completed structured tail `332` differs from current family-aware leader `432`. | That split tells us whether the live frontier is a finite-window artifact or a genuinely better structural continuation class.
- `model_repair_pool_growth`: ready | Model the repaired square-modulus pool as a growing family rather than treating it as already closed. | Recent packets introduced new square moduli, so the theorem lane should aim for controlled growth, not premature closure.
- `characterize_top_repair_cluster`: ready | Characterize what the top repair cluster `432, 782, 832` shares structurally. | If the tied tails share a common repair mechanism, that mechanism is a strong candidate for the next lemma-level abstraction.
- `p848_next_unmatched_alignment_claim`: ready | Shared-prefix representative 137720141 aligns structurally with the first failure of tail 282. | If this survives falsification, it upgrades a numerical coincidence into an obstruction-class candidate.
- `p848_top_repair_cluster_claim`: ready | Top repair class 432, 782, 832 shares a common repair mechanism. | A shared mechanism would compress the search frontier into a reusable lemma candidate.

## Commands

- Problem surface: `erdos problem show 848`
- Problem artifacts: `erdos problem artifacts 848`
- Theorem loop: `erdos problem theorem-loop 848`
- Theorem refresh: `erdos problem theorem-loop-refresh 848`
- Claim loop: `erdos problem claim-loop 848`
- Claim refresh: `erdos problem claim-loop-refresh 848`
- Source refresh: `erdos number-theory bridge-refresh 848`

## Sources

- claimLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/CLAIM_LOOP.json`
- claimLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/CLAIM_LOOP.md`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/THEOREM_LOOP.json`
- theoremLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/THEOREM_LOOP.md`
- legacyBridgeJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SEARCH_THEOREM_BRIDGE.json`
- legacyBridgeMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SEARCH_THEOREM_BRIDGE.md`
- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848`
