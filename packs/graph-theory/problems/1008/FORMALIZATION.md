# Erdos Problem #1008 Formalization

This formalization packet promotes the current claim-pass recommendation into a concrete theorem-facing proof obligation anchored in canonical pack evidence.

## Current State

- Formalization mode: `baseline`.
- Current claim surface: `route_scaffolding`.
- Active route: `c4_free_lean_archive`.
- Route summary: Keep the solved `C_4`-free density record explicit and preserve the Lean-facing archive posture.
- Next honest move: Record the best public/formalization hook and checkpoint the archive packet.
- Latest verified interval: `(none)`

## Current Target

- Formalization id: `graph-theory_1008_promote_ready_atom_v1`.
- Focus id: `promote_ready_atom`.
- Title: Promote Ready Atom
- Status: `ready`.
- Lane: `theorem_formalization`.
- Summary: Record the best public/formalization hook and checkpoint the archive packet.
- Candidate statement: Candidate formalization target: Record the best public/formalization hook and checkpoint the archive packet.
- Proof obligations: ready `3` / total `3`.
- Falsifier checks: ready `2` / total `2`.
- Promotion criteria: ready `3` / total `3`.

## Why This Exists

This packet exists to turn a claim-pass recommendation into a concrete theorem-facing proof obligation with explicit falsifiers and promotion criteria.

## Why Now

Record the best public/formalization hook and checkpoint the archive packet.

## Evidence Basis

- Current claim surface: route_scaffolding.
- Active route: c4_free_lean_archive.
- No canonical verified interval is currently frozen.

## Proof Obligations

- `state_claim_honestly`: ready | State the candidate theorem-facing claim in pack language without overstating current support. | This keeps the formalization target narrower than the current evidence boundary. | discharge: Write a claim statement that is no stronger than the active claim-pass support surface.
- `freeze_support_artifacts`: ready | List the exact canonical artifacts that support the claim and the artifacts that could still falsify it. | The theorem lane should point at stable evidence, not drifting interpretation. | discharge: Attach theorem-loop, claim-pass, and any bridge-backed packet paths directly to the packet.
- `define_promotion_boundary`: ready | Promote the target only when its support survives the current claim-pass falsifiers. | This prevents formalization packets from silently outrunning the rest of the loop. | discharge: Record explicit promotion criteria tied to current falsifiers.

## Falsifier Checks

- `claim_pass_survival`: ready | A refreshed claim pass drops the target recommendation or marks the underlying claim unsupported. | If the recommendation itself no longer survives refresh, the formalization target is stale. | command: erdos problem claim-pass-refresh 1008
- `artifact_boundary_check`: ready | A canonical artifact boundary check shows the statement is stronger than the current pack evidence. | The packet should fail early if it is stronger than what the pack actually certifies. | command: erdos problem theorem-loop 1008

## Promotion Criteria

- `top_recommendation_survives`: ready | The current target remains the top theorem-formalization recommendation after refresh.
- `statement_stays_narrow`: ready | The candidate statement is narrower than or equal to the current claim-pass support surface.
- `obligations_are_actionable`: ready | The remaining proof obligations are explicit enough to guide search or exact follow-up.

## Supporting Commands

- `erdos problem theorem-loop 1008`
- `erdos problem claim-pass 1008`
- `erdos problem claim-pass-refresh 1008`

## Commands

- Problem surface: `erdos problem show 1008`
- Problem artifacts: `erdos problem artifacts 1008`
- Theorem loop: `erdos problem theorem-loop 1008`
- Claim loop: `erdos problem claim-loop 1008`
- Claim pass: `erdos problem claim-pass 1008`
- Formalization: `erdos problem formalization 1008`
- Formalization refresh: `erdos problem formalization-refresh 1008`
- Formalization work: `erdos problem formalization-work 1008`
- Formalization work refresh: `erdos problem formalization-work-refresh 1008`

## Sources

- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008`
- formalizationJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/FORMALIZATION.json`
- formalizationMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/FORMALIZATION.md`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/THEOREM_LOOP.json`
- theoremLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/THEOREM_LOOP.md`
- claimLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/CLAIM_LOOP.json`
- claimLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/CLAIM_LOOP.md`
- claimPassJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/CLAIM_PASS.json`
- claimPassMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/CLAIM_PASS.md`
