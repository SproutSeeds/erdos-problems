# Erdos Problem #857 Task List

This task list is the canonical research-loop surface for the problem. It gives one reusable execution rule, one templated loop, the current active tasks, and the next steps discovered from the current theorem/search/verifier state.

## Current State

- Task list mode: `baseline`.
- Active route: `anchored_selector_linearization`.
- Current claim surface: `frontier_supported_route`.
- Route summary: Export the live anchored-selector helper stack into a route-facing leaf that remains honest about the open-problem boundary.
- Next honest move: Prove or package the helper stack cleanly and checkpoint the route if the leaf closes.
- Latest verified interval: `(none)`

## Execution Rule

- Stance: `concrete_execution`
- Summary: Treat the task list as a concrete research loop for problem 857: execute the highest-value task itself, not wrapper prose about the task.
- After each completed step: Cross off the completed task.
- After each completed step: Re-read the theorem loop, claim pass, formalization packet, formalization work packet, and verifier boundary.
- After each completed step: Invent the next highest-value step from the updated evidence rather than following a stale fixed script.
- After each completed step: Append that next step to the task list and refresh the canonical task-list artifacts.
- Repetition protocol: To execute this loop 10 times or 100 times, complete the first ready task, refresh the task list, then use the regenerated ordering for the next pass.
- Long-horizon note: This loop is meant to be safe for long-horizon execution because it re-ranks after every pass instead of committing to a blind fixed plan.

## Template Loop

- `freeze_current_state`: Freeze the current north star and active theorem packet | Freeze the current route `anchored_selector_linearization`, claim surface `frontier_supported_route`, and active theorem packet before widening the search. | completion: The theorem loop, claim pass, and formalization packet all agree on the current route, next honest move, and active target. | command: `erdos problem theorem-loop 857`
- `audit_theorem_surfaces`: Audit theorem, claim, and formalization surfaces for consistency | Audit the theorem loop, claim loop, claim pass, formalization packet, and formalization work packet for drift or contradictory wording. | completion: The canonical theorem/search surfaces tell one consistent story about what is supported, what is open, and what the active work unit is. | command: `erdos problem task-list 857`
- `verify_canonical_inputs`: Verify canonical pack inputs against the latest route and verifier artifacts | Verify that the pack-backed theorem surfaces still match the latest route packet, OPS details, and verifier-facing artifacts. | completion: The canonical input packet for this loop remains current and trustworthy. | command: `erdos problem theorem-loop-refresh 857`
- `verify_primary_structural_hook`: Verify the current highest-value structural hook remains canonical | Verify that the strongest supported structural hook still survives across the theorem and claim surfaces. | completion: The primary theorem-facing hook still survives refresh and remains narrow enough to formalize honestly. | command: `erdos problem claim-pass-refresh 857`
- `verify_verifier_boundary`: Verify the current verifier boundary and next target | Verify that the current verifier boundary and next target are stated honestly across the pack surfaces. | completion: The verifier-facing boundary remains explicit even without a dedicated interval queue. | command: `erdos problem formalization 857`
- `execute_current_work_packet`: State Claim Honestly | State the candidate theorem-facing claim in pack language without overstating current support. | completion: The first remaining gap is either discharged, narrowed, or replaced by a sharper one: state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | command: `erdos problem formalization-work 857`
- `refresh_and_rerank`: Refresh the task list and rerank the next step | Refresh the canonical task list after the completed work so the next iteration is driven by the newest theorem/search/verifier evidence. | completion: The refreshed task list records the next highest-value action instead of relying on a stale fixed script. | command: `erdos problem task-list-refresh 857`

## Current Objective

- Formalization id: `sunflower_857_promote_ready_atom_v1`
- Focus id: `promote_ready_atom`
- Title: Promote Ready Atom
- Active work id: `sunflower_857_state_claim_honestly_v1`
- Active work title: State Claim Honestly
- Active work status: `ready`

## Current Tasks

- `freeze_current_state` [ready] Freeze the current north star and active theorem packet | Freeze the current route `anchored_selector_linearization`, claim surface `frontier_supported_route`, and active theorem packet before widening the search. | completion: The theorem loop, claim pass, and formalization packet all agree on the current route, next honest move, and active target. | command: `erdos problem theorem-loop 857`
- `audit_theorem_surfaces` [ready] Audit theorem, claim, and formalization surfaces for consistency | Audit the theorem loop, claim loop, claim pass, formalization packet, and formalization work packet for drift or contradictory wording. | completion: The canonical theorem/search surfaces tell one consistent story about what is supported, what is open, and what the active work unit is. | command: `erdos problem task-list 857`
- `verify_canonical_inputs` [ready] Verify canonical pack inputs against the latest route and verifier artifacts | Verify that the pack-backed theorem surfaces still match the latest route packet, OPS details, and verifier-facing artifacts. | completion: The canonical input packet for this loop remains current and trustworthy. | command: `erdos problem theorem-loop-refresh 857`
- `verify_primary_structural_hook` [ready] Verify the current highest-value structural hook remains canonical | Verify that the strongest supported structural hook still survives across the theorem and claim surfaces. | completion: The primary theorem-facing hook still survives refresh and remains narrow enough to formalize honestly. | command: `erdos problem claim-pass-refresh 857`
- `verify_verifier_boundary` [ready] Verify the current verifier boundary and next target | Verify that the current verifier boundary and next target are stated honestly across the pack surfaces. | completion: The verifier-facing boundary remains explicit even without a dedicated interval queue. | command: `erdos problem formalization 857`
- `execute_current_work_packet` [ready] State Claim Honestly | State the candidate theorem-facing claim in pack language without overstating current support. | Prove or package the helper stack cleanly and checkpoint the route if the leaf closes. | completion: The first remaining gap is either discharged, narrowed, or replaced by a sharper one: state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | command: `erdos problem formalization-work 857`
- `discharge_first_remaining_gap` [ready] Discharge the first remaining gap in the active theorem packet | state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | This is the sharpest unresolved statement already named by the active theorem-work packet. | completion: The first remaining gap is either resolved or replaced by a more precise successor gap. | command: `erdos problem formalization-work-refresh 857`
- `refresh_and_rerank` [ready] Refresh the task list and rerank the next step | Refresh the canonical task list after the completed work so the next iteration is driven by the newest theorem/search/verifier evidence. | completion: The refreshed task list records the next highest-value action instead of relying on a stale fixed script. | command: `erdos problem task-list-refresh 857`

## Completed Anchors


## Next Needed Steps

- `gap_1` [next] state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | source: formalization_work | command: `erdos problem formalization-work-refresh 857`
- `gap_2` [next] freeze_support_artifacts: Attach theorem-loop, claim-pass, and any bridge-backed packet paths directly to the packet. | source: formalization_work | command: `erdos problem formalization-work-refresh 857`
- `gap_3` [next] define_promotion_boundary: Record explicit promotion criteria tied to current falsifiers. | source: formalization_work | command: `erdos problem formalization-work-refresh 857`
- `promote_ready_atom` [medium] Prove or package the helper stack cleanly and checkpoint the route if the leaf closes. | source: theorem_formalization | command: `erdos problem formalization 857`

## Commands

- Problem surface: `erdos problem show 857`
- Problem artifacts: `erdos problem artifacts 857`
- Task list: `erdos problem task-list 857`
- Task list refresh: `erdos problem task-list-refresh 857`
- Theorem loop: `erdos problem theorem-loop 857`
- Claim pass: `erdos problem claim-pass 857`
- Formalization: `erdos problem formalization 857`
- Formalization work: `erdos problem formalization-work 857`

## Sources

- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857`
- taskListJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/TASK_LIST.json`
- taskListMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/TASK_LIST.md`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/THEOREM_LOOP.json`
- claimPassJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/CLAIM_PASS.json`
- formalizationJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/FORMALIZATION.json`
- formalizationWorkJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/FORMALIZATION_WORK.json`
- intervalQueuePath: `/Volumes/Code_2TB/code/erdos-problems/packs/sunflower/problems/857/INTERVAL_WORK_QUEUE.yaml`
