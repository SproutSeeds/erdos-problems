# Erdos Problem #1008 Task List

This task list is the canonical research-loop surface for the problem. It gives one reusable execution rule, one templated loop, the current active tasks, and the next steps discovered from the current theorem/search/verifier state.

## Current State

- Task list mode: `baseline`.
- Active route: `c4_free_lean_archive`.
- Current claim surface: `route_scaffolding`.
- Route summary: Keep the solved `C_4`-free density record explicit and preserve the Lean-facing archive posture.
- Next honest move: Record the best public/formalization hook and checkpoint the archive packet.
- Latest verified interval: `(none)`

## Execution Rule

- Stance: `concrete_execution`
- Summary: Treat the task list as a concrete research loop for problem 1008: execute the highest-value task itself, not wrapper prose about the task.
- After each completed step: Cross off the completed task.
- After each completed step: Re-read the theorem loop, claim pass, formalization packet, formalization work packet, and verifier boundary.
- After each completed step: Invent the next highest-value step from the updated evidence rather than following a stale fixed script.
- After each completed step: Append that next step to the task list and refresh the canonical task-list artifacts.
- Repetition protocol: To execute this loop 10 times or 100 times, complete the first ready task, refresh the task list, then use the regenerated ordering for the next pass.
- Long-horizon note: This loop is meant to be safe for long-horizon execution because it re-ranks after every pass instead of committing to a blind fixed plan.

## Template Loop

- `freeze_current_state`: Freeze the current north star and active theorem packet | Freeze the current route `c4_free_lean_archive`, claim surface `route_scaffolding`, and active theorem packet before widening the search. | completion: The theorem loop, claim pass, and formalization packet all agree on the current route, next honest move, and active target. | command: `erdos problem theorem-loop 1008`
- `audit_theorem_surfaces`: Audit theorem, claim, and formalization surfaces for consistency | Audit the theorem loop, claim loop, claim pass, formalization packet, and formalization work packet for drift or contradictory wording. | completion: The canonical theorem/search surfaces tell one consistent story about what is supported, what is open, and what the active work unit is. | command: `erdos problem task-list 1008`
- `verify_canonical_inputs`: Verify canonical pack inputs against the latest route and verifier artifacts | Verify that the pack-backed theorem surfaces still match the latest route packet, OPS details, and verifier-facing artifacts. | completion: The canonical input packet for this loop remains current and trustworthy. | command: `erdos problem theorem-loop-refresh 1008`
- `verify_primary_structural_hook`: Verify the current highest-value structural hook remains canonical | Verify that the strongest supported structural hook still survives across the theorem and claim surfaces. | completion: The primary theorem-facing hook still survives refresh and remains narrow enough to formalize honestly. | command: `erdos problem claim-pass-refresh 1008`
- `verify_verifier_boundary`: Verify the current verifier boundary and next target | Verify that the current verifier boundary and next target are stated honestly across the pack surfaces. | completion: The verifier-facing boundary remains explicit even without a dedicated interval queue. | command: `erdos problem formalization 1008`
- `execute_current_work_packet`: State Claim Honestly | State the candidate theorem-facing claim in pack language without overstating current support. | completion: The first remaining gap is either discharged, narrowed, or replaced by a sharper one: state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | command: `erdos problem formalization-work 1008`
- `refresh_and_rerank`: Refresh the task list and rerank the next step | Refresh the canonical task list after the completed work so the next iteration is driven by the newest theorem/search/verifier evidence. | completion: The refreshed task list records the next highest-value action instead of relying on a stale fixed script. | command: `erdos problem task-list-refresh 1008`

## Current Objective

- Formalization id: `graph-theory_1008_promote_ready_atom_v1`
- Focus id: `promote_ready_atom`
- Title: Promote Ready Atom
- Active work id: `graph-theory_1008_state_claim_honestly_v1`
- Active work title: State Claim Honestly
- Active work status: `ready`

## Current Tasks

- `freeze_current_state` [ready] Freeze the current north star and active theorem packet | Freeze the current route `c4_free_lean_archive`, claim surface `route_scaffolding`, and active theorem packet before widening the search. | completion: The theorem loop, claim pass, and formalization packet all agree on the current route, next honest move, and active target. | command: `erdos problem theorem-loop 1008`
- `audit_theorem_surfaces` [ready] Audit theorem, claim, and formalization surfaces for consistency | Audit the theorem loop, claim loop, claim pass, formalization packet, and formalization work packet for drift or contradictory wording. | completion: The canonical theorem/search surfaces tell one consistent story about what is supported, what is open, and what the active work unit is. | command: `erdos problem task-list 1008`
- `verify_canonical_inputs` [ready] Verify canonical pack inputs against the latest route and verifier artifacts | Verify that the pack-backed theorem surfaces still match the latest route packet, OPS details, and verifier-facing artifacts. | completion: The canonical input packet for this loop remains current and trustworthy. | command: `erdos problem theorem-loop-refresh 1008`
- `verify_primary_structural_hook` [ready] Verify the current highest-value structural hook remains canonical | Verify that the strongest supported structural hook still survives across the theorem and claim surfaces. | completion: The primary theorem-facing hook still survives refresh and remains narrow enough to formalize honestly. | command: `erdos problem claim-pass-refresh 1008`
- `verify_verifier_boundary` [ready] Verify the current verifier boundary and next target | Verify that the current verifier boundary and next target are stated honestly across the pack surfaces. | completion: The verifier-facing boundary remains explicit even without a dedicated interval queue. | command: `erdos problem formalization 1008`
- `execute_current_work_packet` [ready] State Claim Honestly | State the candidate theorem-facing claim in pack language without overstating current support. | Record the best public/formalization hook and checkpoint the archive packet. | completion: The first remaining gap is either discharged, narrowed, or replaced by a sharper one: state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | command: `erdos problem formalization-work 1008`
- `discharge_first_remaining_gap` [ready] Discharge the first remaining gap in the active theorem packet | state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | This is the sharpest unresolved statement already named by the active theorem-work packet. | completion: The first remaining gap is either resolved or replaced by a more precise successor gap. | command: `erdos problem formalization-work-refresh 1008`
- `refresh_and_rerank` [ready] Refresh the task list and rerank the next step | Refresh the canonical task list after the completed work so the next iteration is driven by the newest theorem/search/verifier evidence. | completion: The refreshed task list records the next highest-value action instead of relying on a stale fixed script. | command: `erdos problem task-list-refresh 1008`

## Completed Anchors


## Next Needed Steps

- `gap_1` [next] state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | source: formalization_work | command: `erdos problem formalization-work-refresh 1008`
- `gap_2` [next] freeze_support_artifacts: Attach theorem-loop, claim-pass, and any bridge-backed packet paths directly to the packet. | source: formalization_work | command: `erdos problem formalization-work-refresh 1008`
- `gap_3` [next] define_promotion_boundary: Record explicit promotion criteria tied to current falsifiers. | source: formalization_work | command: `erdos problem formalization-work-refresh 1008`
- `promote_ready_atom` [medium] Record the best public/formalization hook and checkpoint the archive packet. | source: theorem_formalization | command: `erdos problem formalization 1008`

## Commands

- Problem surface: `erdos problem show 1008`
- Problem artifacts: `erdos problem artifacts 1008`
- Task list: `erdos problem task-list 1008`
- Task list refresh: `erdos problem task-list-refresh 1008`
- Theorem loop: `erdos problem theorem-loop 1008`
- Claim pass: `erdos problem claim-pass 1008`
- Formalization: `erdos problem formalization 1008`
- Formalization work: `erdos problem formalization-work 1008`

## Sources

- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008`
- taskListJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/TASK_LIST.json`
- taskListMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/TASK_LIST.md`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/THEOREM_LOOP.json`
- claimPassJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/CLAIM_PASS.json`
- formalizationJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/FORMALIZATION.json`
- formalizationWorkJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/FORMALIZATION_WORK.json`
- intervalQueuePath: `/Volumes/Code_2TB/code/erdos-problems/packs/graph-theory/problems/1008/INTERVAL_WORK_QUEUE.yaml`
