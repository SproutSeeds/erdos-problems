# Erdos Problem #1 Task List

This task list is the canonical research-loop surface for the problem. It gives one reusable execution rule, one templated loop, the current active tasks, and the next steps discovered from the current theorem/search/verifier state.

## Current State

- Task list mode: `baseline`.
- Active route: `distinct_subset_sum_lower_bound`.
- Current claim surface: `route_scaffolding`.
- Route summary: Keep the problem centered on the exponential-growth lower-bound route implied by distinct subset sums.
- Next honest move: Record the first reduction and checkpoint it without overclaiming theorem progress.
- Latest verified interval: `(none)`

## Execution Rule

- Stance: `concrete_execution`
- Summary: Treat the task list as a concrete research loop for problem 1: execute the highest-value task itself, not wrapper prose about the task.
- After each completed step: Cross off the completed task.
- After each completed step: Re-read the theorem loop, claim pass, formalization packet, formalization work packet, and verifier boundary.
- After each completed step: Use ORP granular breakdown when the next step is broad or confusing: orp mode nudge granular-breakdown --json
- After each completed step: Use the smallest relevant ORP mode overlay when it simplifies the work: simplification for bloat, systems for cross-surface consequences, bold generation for new candidates, and sleek-progressive for clearer handoff shape.
- After each completed step: Invent the next highest-value step from the updated evidence rather than following a stale fixed script.
- After each completed step: Append that next step to the task list and refresh the canonical task-list artifacts.
- Repetition protocol: To execute this loop 10 times or 100 times, complete the first ready task, refresh the task list, then use the regenerated ordering for the next pass.
- Long-horizon note: This loop is meant to be safe for long-horizon execution because it re-ranks after every pass instead of committing to a blind fixed plan.

## ORP Granular Breakdown

- Status: `core_loop_enabled`
- Mode id: `granular-breakdown`
- Topic: problem 1 | State Claim Honestly
- Activation phrase: Break it down until it can move.
- Invocation rule: Use the full breakdown before executing a complex theorem/search packet; use the nudge card whenever the agent or user is confused, the target feels too broad, or the next action is not deterministic.
- Full breakdown: `orp mode breakdown granular-breakdown --topic "problem 1 | State Claim Honestly" --json`
- Nudge: `orp mode nudge granular-breakdown --json`
- Loop integration: Run the full breakdown after the theorem/search surfaces are audited and before executing the current work packet.
- Loop integration: Write operationally important decompositions into TASK_LIST, FORMALIZATION_WORK, or a dedicated checklist artifact rather than leaving them in chat.
- Loop integration: Use the nudge card for quick reorientation when a step becomes blurry during implementation.
- Loop integration: Compress the breakdown back into one active target and one verification command before continuing.
- Durable artifact rule: If the breakdown changes what we should do, refresh the canonical task list so the new dependency ladder becomes repo-owned state.

## ORP Mode Overlay Palette

- Status: `core_loop_palette_enabled`
- Source command: `orp mode list --json`
- Default mode id: `granular-breakdown`
- Selection rule: Select the smallest ORP overlay that reduces ambiguity or friction; do not run every mode by default.
- Durable when operational: `yes`
- Overlay `granular-breakdown` (core_decomposition_loop): The work is broad, confusing, theorem-heavy, or needs a durable dependency ladder before execution. | placement: Before execute_current_work_packet and whenever the active target becomes fuzzy. | command: `orp mode breakdown granular-breakdown --topic "problem 1 | State Claim Honestly" --json` | output: Boundary, lanes, subclaims, atomic obligations, dependency ladder, active target, durable checklist, and next verification.
- Overlay `ruthless-simplification` (compression_and_signal_filter): A plan, proof surface, or final response is swollen, repetitive, or hiding the single live decision. | placement: After granular decomposition, before committing a plan to TASK_LIST, and before final summaries. | command: `orp mode nudge ruthless-simplification --json` | output: One core sentence, one surviving move, and a list of noise to delete or defer.
- Overlay `systems-constellation` (dependency_and_downstream_effects): A change touches multiple surfaces such as erdos-problems, ORP, frontier-engine, local/remote compute, task lists, or user workflow. | placement: Before cross-system integration, paid/remote compute decisions, or changes to canonical source/writeback flow. | command: `orp mode nudge systems-constellation --json` | output: Upstreams, downstreams, feedback loops, hidden costs, and the system-level decision.
- Overlay `bold-concept-generation` (candidate_generation_when_stuck): The active theorem/search lane has converged too early, needs new candidate lemmas, or a split atom fails and needs alternative constructions. | placement: After a falsifier, before launching broad compute, or when inventing the next symbolic construction. | command: `orp mode nudge bold-concept-generation --json` | output: Several meaningfully different candidate moves, with the boldest one grounded into a quick experiment.
- Overlay `sleek-minimal-progressive` (fresh_lens_and_low_friction_motion): The work feels flat, overly linear, or technically correct but hard for future collaborators to pick up. | placement: When refining docs, task-list readability, handoff artifacts, UI surfaces, or the shape of the next user-facing explanation. | command: `orp mode nudge sleek-minimal-progressive --json` | output: One subtraction, one tasteful surprise, and one concrete next move that keeps momentum.

## Agent Flow

- Status: `ready`
- Audience: `agent`
- Operating rule: Read this object first; execute the primary next action unless a guardrail blocks it or the task list is stale.
- Primary next action: `gap_1` [next] state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface.
- Primary command: `erdos problem formalization-work-refresh 1`
- Default agent action: `execute_primary_next_action`
- Mode selection: Select the smallest ORP overlay that reduces ambiguity or friction; do not run every mode by default.
- Granular nudge: `orp mode nudge granular-breakdown --json`
- Situational overlay `ruthless-simplification`: A plan, proof surface, or final response is swollen, repetitive, or hiding the single live decision. | command: `orp mode nudge ruthless-simplification --json`
- Situational overlay `systems-constellation`: A change touches multiple surfaces such as erdos-problems, ORP, frontier-engine, local/remote compute, task lists, or user workflow. | command: `orp mode nudge systems-constellation --json`
- Situational overlay `bold-concept-generation`: The active theorem/search lane has converged too early, needs new candidate lemmas, or a split atom fails and needs alternative constructions. | command: `orp mode nudge bold-concept-generation --json`
- Situational overlay `sleek-minimal-progressive`: The work feels flat, overly linear, or technically correct but hard for future collaborators to pick up. | command: `orp mode nudge sleek-minimal-progressive --json`
- Agent guardrail: Do not run paid or remote compute unless the frontier configuration explicitly enables that paid rung.
- Agent guardrail: Prefer local/free compute before opt-in paid compute.
- Agent guardrail: Do not treat bounded search evidence as an all-N proof without a theorem-facing handoff.
- Agent guardrail: Do not run every ORP mode by default.
- Agent guardrail: Persist operationally important changes into canonical artifacts rather than chat-only state.
- Refresh after material progress: `erdos problem task-list-refresh 1`

## Template Loop

- `freeze_current_state`: Freeze the current north star and active theorem packet | Freeze the current route `distinct_subset_sum_lower_bound`, claim surface `route_scaffolding`, and active theorem packet before widening the search. | completion: The theorem loop, claim pass, and formalization packet all agree on the current route, next honest move, and active target. | command: `erdos problem theorem-loop 1`
- `audit_theorem_surfaces`: Audit theorem, claim, and formalization surfaces for consistency | Audit the theorem loop, claim loop, claim pass, formalization packet, and formalization work packet for drift or contradictory wording. | completion: The canonical theorem/search surfaces tell one consistent story about what is supported, what is open, and what the active work unit is. | command: `erdos problem task-list 1`
- `verify_canonical_inputs`: Verify canonical pack inputs against the latest route and verifier artifacts | Verify that the pack-backed theorem surfaces still match the latest route packet, OPS details, and verifier-facing artifacts. | completion: The canonical input packet for this loop remains current and trustworthy. | command: `erdos problem theorem-loop-refresh 1`
- `verify_primary_structural_hook`: Verify the current highest-value structural hook remains canonical | Verify that the strongest supported structural hook still survives across the theorem and claim surfaces. | completion: The primary theorem-facing hook still survives refresh and remains narrow enough to formalize honestly. | command: `erdos problem claim-pass-refresh 1`
- `verify_verifier_boundary`: Verify the current verifier boundary and next target | Verify that the current verifier boundary and next target are stated honestly across the pack surfaces. | completion: The verifier-facing boundary remains explicit even without a dedicated interval queue. | command: `erdos number-theory dispatch 1`
- `apply_granular_breakdown`: Apply ORP granular breakdown before execution | Run ORP granular breakdown on the active topic `problem 1 | State Claim Honestly` and compress it into one active target plus one verification command. | completion: The broad work packet has been decomposed into boundary, lanes, atomic obligations, dependency ladder, active target, durable checklist, and next verification. | command: `orp mode breakdown granular-breakdown --topic "problem 1 | State Claim Honestly" --json`
- `execute_current_work_packet`: State Claim Honestly | State the candidate theorem-facing claim in pack language without overstating current support. | completion: The first remaining gap is either discharged, narrowed, or replaced by a sharper one: state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | command: `erdos problem formalization-work 1`
- `refresh_and_rerank`: Refresh the task list and rerank the next step | Refresh the canonical task list after the completed work so the next iteration is driven by the newest theorem/search/verifier evidence. | completion: The refreshed task list records the next highest-value action instead of relying on a stale fixed script. | command: `erdos problem task-list-refresh 1`

## Current Objective

- Formalization id: `number-theory_1_promote_ready_atom_v1`
- Focus id: `promote_ready_atom`
- Title: Promote Ready Atom
- Active work id: `number-theory_1_state_claim_honestly_v1`
- Active work title: State Claim Honestly
- Active work status: `ready`

## Current Tasks

- `freeze_current_state` [ready] Freeze the current north star and active theorem packet | Freeze the current route `distinct_subset_sum_lower_bound`, claim surface `route_scaffolding`, and active theorem packet before widening the search. | completion: The theorem loop, claim pass, and formalization packet all agree on the current route, next honest move, and active target. | command: `erdos problem theorem-loop 1`
- `audit_theorem_surfaces` [ready] Audit theorem, claim, and formalization surfaces for consistency | Audit the theorem loop, claim loop, claim pass, formalization packet, and formalization work packet for drift or contradictory wording. | completion: The canonical theorem/search surfaces tell one consistent story about what is supported, what is open, and what the active work unit is. | command: `erdos problem task-list 1`
- `verify_canonical_inputs` [ready] Verify canonical pack inputs against the latest route and verifier artifacts | Verify that the pack-backed theorem surfaces still match the latest route packet, OPS details, and verifier-facing artifacts. | completion: The canonical input packet for this loop remains current and trustworthy. | command: `erdos problem theorem-loop-refresh 1`
- `verify_primary_structural_hook` [ready] Verify the current highest-value structural hook remains canonical | Verify that the strongest supported structural hook still survives across the theorem and claim surfaces. | completion: The primary theorem-facing hook still survives refresh and remains narrow enough to formalize honestly. | command: `erdos problem claim-pass-refresh 1`
- `verify_verifier_boundary` [ready] Verify the current verifier boundary and next target | Verify that the current verifier boundary and next target are stated honestly across the pack surfaces. | completion: The verifier-facing boundary remains explicit even without a dedicated interval queue. | command: `erdos number-theory dispatch 1`
- `apply_granular_breakdown` [ready] Apply ORP granular breakdown before execution | Run ORP granular breakdown on the active topic `problem 1 | State Claim Honestly` and compress it into one active target plus one verification command. | completion: The broad work packet has been decomposed into boundary, lanes, atomic obligations, dependency ladder, active target, durable checklist, and next verification. | command: `orp mode breakdown granular-breakdown --topic "problem 1 | State Claim Honestly" --json`
- `execute_current_work_packet` [ready] State Claim Honestly | State the candidate theorem-facing claim in pack language without overstating current support. | Record the first reduction and checkpoint it without overclaiming theorem progress. | completion: The first remaining gap is either discharged, narrowed, or replaced by a sharper one: state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | command: `erdos problem formalization-work 1`
- `discharge_first_remaining_gap` [ready] Discharge the first remaining gap in the active theorem packet | state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | This is the sharpest unresolved statement already named by the active theorem-work packet. | completion: The first remaining gap is either resolved or replaced by a more precise successor gap. | command: `erdos problem formalization-work-refresh 1`
- `refresh_and_rerank` [ready] Refresh the task list and rerank the next step | Refresh the canonical task list after the completed work so the next iteration is driven by the newest theorem/search/verifier evidence. | completion: The refreshed task list records the next highest-value action instead of relying on a stale fixed script. | command: `erdos problem task-list-refresh 1`

## Completed Anchors


## Next Needed Steps

- `gap_1` [next] state_claim_honestly: Write a claim statement that is no stronger than the active claim-pass support surface. | source: formalization_work | command: `erdos problem formalization-work-refresh 1`
- `gap_2` [next] freeze_support_artifacts: Attach theorem-loop, claim-pass, and any bridge-backed packet paths directly to the packet. | source: formalization_work | command: `erdos problem formalization-work-refresh 1`
- `gap_3` [next] define_promotion_boundary: Record explicit promotion criteria tied to current falsifiers. | source: formalization_work | command: `erdos problem formalization-work-refresh 1`
- `promote_ready_atom` [medium] Record the first reduction and checkpoint it without overclaiming theorem progress. | source: theorem_formalization | command: `erdos problem formalization 1`

## Commands

- Problem surface: `erdos problem show 1`
- Problem artifacts: `erdos problem artifacts 1`
- Task list: `erdos problem task-list 1`
- Task list refresh: `erdos problem task-list-refresh 1`
- Task list run: `erdos problem task-list-run 1 --passes 10`
- ORP mode list: `orp mode list --json`
- ORP granular breakdown: `orp mode breakdown granular-breakdown --topic "problem 1 | State Claim Honestly" --json`
- ORP granular nudge: `orp mode nudge granular-breakdown --json`
- Theorem loop: `erdos problem theorem-loop 1`
- Claim pass: `erdos problem claim-pass 1`
- Formalization: `erdos problem formalization 1`
- Formalization work: `erdos problem formalization-work 1`

## Sources

- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1`
- taskListJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/TASK_LIST.json`
- taskListMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/TASK_LIST.md`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/THEOREM_LOOP.json`
- claimPassJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/CLAIM_PASS.json`
- formalizationJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/FORMALIZATION.json`
- formalizationWorkJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/FORMALIZATION_WORK.json`
- intervalQueuePath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/1/INTERVAL_WORK_QUEUE.yaml`
