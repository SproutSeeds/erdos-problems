# Erdos Problem #857 Formalization

This formalization packet promotes the current claim-pass recommendation into a concrete theorem-facing proof obligation anchored in canonical pack evidence.

## Current State

- Formalization mode: `baseline`.
- Current claim surface: `frontier_supported_route`.
- Active route: `anchored_selector_linearization`.
- Route summary: Export the live anchored-selector helper stack into a route-facing leaf that remains honest about the open-problem boundary.
- Next honest move: Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.
- Latest verified interval: `(none)`

## Current Target

- Formalization id: `sunflower_857_promote_ready_atom_v1`.
- Focus id: `promote_ready_atom`.
- Title: Promote Ready Atom
- Status: `ready`.
- Lane: `theorem_formalization`.
- Summary: Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.
- Candidate statement: Candidate formalization target: Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.
- Proof obligations: ready `3` / total `3`.
- Falsifier checks: ready `2` / total `2`.
- Promotion criteria: ready `3` / total `3`.

## Why This Exists

This packet exists to turn a claim-pass recommendation into a concrete theorem-facing proof obligation with explicit falsifiers and promotion criteria.

## Why Now

Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.

## Evidence Basis

- Current claim surface: frontier_supported_route.
- Active route: anchored_selector_linearization.
- No canonical verified interval is currently frozen.

## Proof Obligations

- `state_claim_honestly`: ready | State the candidate theorem-facing claim in pack language without overstating current support. | This keeps the formalization target narrower than the current evidence boundary. | discharge: Write a claim statement that is no stronger than the active claim-pass support surface.
- `freeze_support_artifacts`: ready | List the exact canonical artifacts that support the claim and the artifacts that could still falsify it. | The theorem lane should point at stable evidence, not drifting interpretation. | discharge: Attach theorem-loop, claim-pass, and any bridge-backed packet paths directly to the packet.
- `define_promotion_boundary`: ready | Promote the target only when its support survives the current claim-pass falsifiers. | This prevents formalization packets from silently outrunning the rest of the loop. | discharge: Record explicit promotion criteria tied to current falsifiers.

## Falsifier Checks

- `claim_pass_survival`: ready | A refreshed claim pass drops the target recommendation or marks the underlying claim unsupported. | If the recommendation itself no longer survives refresh, the formalization target is stale. | command: erdos problem claim-pass-refresh 857
- `artifact_boundary_check`: ready | A canonical artifact boundary check shows the statement is stronger than the current pack evidence. | The packet should fail early if it is stronger than what the pack actually certifies. | command: erdos problem theorem-loop 857

## Promotion Criteria

- `top_recommendation_survives`: ready | The current target remains the top theorem-formalization recommendation after refresh.
- `statement_stays_narrow`: ready | The candidate statement is narrower than or equal to the current claim-pass support surface.
- `obligations_are_actionable`: ready | The remaining proof obligations are explicit enough to guide search or exact follow-up.

## Supporting Commands

- `erdos problem theorem-loop 857`
- `erdos problem claim-pass 857`
- `erdos problem claim-pass-refresh 857`

## Commands

- Problem surface: `erdos problem show 857`
- Problem artifacts: `erdos problem artifacts 857`
- Theorem loop: `erdos problem theorem-loop 857`
- Claim loop: `erdos problem claim-loop 857`
- Claim pass: `erdos problem claim-pass 857`
- Formalization: `erdos problem formalization 857`
- Formalization refresh: `erdos problem formalization-refresh 857`
- Formalization work: `erdos problem formalization-work 857`
- Formalization work refresh: `erdos problem formalization-work-refresh 857`

## Sources

- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857`
- formalizationJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/FORMALIZATION.json`
- formalizationMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/FORMALIZATION.md`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/THEOREM_LOOP.json`
- theoremLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/THEOREM_LOOP.md`
- claimLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/CLAIM_LOOP.json`
- claimLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/CLAIM_LOOP.md`
- claimPassJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/CLAIM_PASS.json`
- claimPassMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/CLAIM_PASS.md`
