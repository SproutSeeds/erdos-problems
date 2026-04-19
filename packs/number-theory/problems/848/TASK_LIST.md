# Erdos Problem #848 Task List

This task list is the canonical research-loop surface for the problem. It gives one reusable execution rule, one templated loop, the current active tasks, and the next steps discovered from the current theorem/search/verifier state.

## Current State

- Task list mode: `bridge_backed`.
- Active route: `finite_check_gap_closure`.
- Current claim surface: `bridge_backed_frontier_support`.
- Route summary: Convert the sufficiently-large-N theorem into a complete all-N resolution without overstating what is already closed or confusing imported thresholds with repo-owned claims.
- Next honest move: Write the theorem candidate and proof-obligation surface for the four-anchor obstruction.
- Latest verified interval: `1..10000`
- Public raw exact packet interval: `1..10000`.
- Local compact rollout evidence interval: `1..40500`.

## Execution Rule

- Stance: `concrete_execution`
- Summary: Treat the task list as a concrete research loop for problem 848: execute the highest-value task itself, not wrapper prose about the task.
- After each completed step: Cross off the completed task.
- After each completed step: Re-read the theorem loop, claim pass, formalization packet, formalization work packet, and verifier boundary.
- After each completed step: Use ORP granular breakdown when the next step is broad or confusing: orp mode nudge granular-breakdown --json
- After each completed step: Run convergence assembly before extending a repeated theorem/search ladder: orp mode breakdown granular-breakdown --topic "problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism" --json
- After each completed step: Apply Abstract Before Expanding before branch/search/compute/API/paid expansion: orp mode breakdown granular-breakdown --topic "problem 848 | abstract before expanding | Explain the 282 First-Failure Mechanism" --json
- After each completed step: Use the smallest relevant ORP mode overlay when it simplifies the work: simplification for bloat, systems for cross-surface consequences, bold generation for new candidates, and sleek-progressive for clearer handoff shape.
- After each completed step: Invent the next highest-value step from the updated evidence rather than following a stale fixed script.
- After each completed step: Append that next step to the task list and refresh the canonical task-list artifacts.
- Repetition protocol: To execute this loop 10 times or 100 times, complete the first ready task, refresh the task list, then use the regenerated ordering for the next pass.
- Long-horizon note: This loop is meant to be safe for long-horizon execution because it re-ranks after every pass instead of committing to a blind fixed plan.

## ORP Granular Breakdown

- Status: `core_loop_enabled`
- Mode id: `granular-breakdown`
- Topic: problem 848 | Explain the 282 First-Failure Mechanism | active atom D2_p13_matching_lower_bound | target D4_matching_bound_implies_sMaxMixed_bound
- Activation phrase: Break it down until it can move.
- Invocation rule: Use the full breakdown before executing a complex theorem/search packet; use the nudge card whenever the agent or user is confused, the target feels too broad, or the next action is not deterministic.
- Full breakdown: `orp mode breakdown granular-breakdown --topic "problem 848 | Explain the 282 First-Failure Mechanism | active atom D2_p13_matching_lower_bound | target D4_matching_bound_implies_sMaxMixed_bound" --json`
- Nudge: `orp mode nudge granular-breakdown --json`
- Loop integration: Run the full breakdown after the theorem/search surfaces are audited and before executing the current work packet.
- Loop integration: Write operationally important decompositions into TASK_LIST, FORMALIZATION_WORK, or a dedicated checklist artifact rather than leaving them in chat.
- Loop integration: Use the nudge card for quick reorientation when a step becomes blurry during implementation.
- Loop integration: Compress the breakdown back into one active target and one verification command before continuing.
- Durable artifact rule: If the breakdown changes what we should do, refresh the canonical task list so the new dependency ladder becomes repo-owned state.

## Abstract Before Expanding

- Status: `core_loop_enabled`
- Gate id: `abstract-before-expand`
- Backing ORP mode id: `granular-breakdown`
- Topic: problem 848 | abstract before expanding | Explain the 282 First-Failure Mechanism
- Activation phrase: Collapse the family before opening another child.
- Invocation rule: Run this before any branch/search/compute/API/paid step that expands the surface; skip only when the primary action already names a theorem object, recombination, finite partition, decreasing measure, source audit, or blocker.
- Full gate: `orp mode breakdown granular-breakdown --topic "problem 848 | abstract before expanding | Explain the 282 First-Failure Mechanism" --json`
- Nudge: `orp mode nudge granular-breakdown --json`
- Trigger heuristic: The next action would open a sibling case, selector, q/p child, search lane, compute sweep, API call, or paid/remote rung.
- Trigger heuristic: The frontier, task, or artifact count is growing faster than terminal closures or theorem objects.
- Trigger heuristic: The proposed step repeats the shape of recent work without naming the family it represents.
- Trigger heuristic: A local proof attempt hit a blocker and the next move is to try another concrete instance.
- Trigger heuristic: A compute or research call is being considered before the agent can name the collapse theorem it is meant to unlock.
- Required question: What larger family does this concrete case represent?
- Required question: What theorem object would collapse that family?
- Required question: Is there a finite partition, decreasing rank, bulk cover, impossibility theorem, source theorem, or recombination path available?
- Required question: Should the next move be local proof, local compute, budget-guarded API/source audit, paid compute approval, or a blocker packet?
- Required question: What exact artifact or task-list writeback will preserve this abstraction for the next agent?
- Allowed outcome: `collapse_to_theorem_object`
- Allowed outcome: `route_to_local_proof_or_formalization`
- Allowed outcome: `route_to_budget_guarded_api_source_audit`
- Allowed outcome: `route_to_compute_with_named_unlock`
- Allowed outcome: `emit_blocker_or_approval_packet`
- Allowed outcome: `allow_expansion_because_it_is_finite_and_cheapest`
- Loop integration: Apply the gate before expanding a branch/search/compute/API surface.
- Loop integration: If the gate finds a collapsing theorem object, prefer that object over more sibling work.
- Loop integration: If expansion remains cheapest, record why it is finite, what token decreases, and what blocker will be written if it fails.
- Loop integration: Refresh TASK_LIST and PROGRESS after writeback so Clawdad and future agents inherit the abstraction.
- Durable artifact rule: The gate only counts when its family, theorem object, route decision, and writeback target are recorded in canonical artifacts.

## Convergence Assembly

- Status: `core_loop_enabled`
- Overlay id: `convergence-assembly`
- Backing ORP mode id: `granular-breakdown`
- Topic: problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism
- Activation phrase: Assemble the puzzle before making another piece.
- Invocation rule: Run this whenever the next action repeats a repair/split/search shape, before broad compute, and after material progress that creates new artifacts but not a clearer endgame.
- Full assembly: `orp mode breakdown granular-breakdown --topic "problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism" --json`
- Quick nudge: `orp mode nudge granular-breakdown --json`
- Simplification nudge: `orp mode nudge ruthless-simplification --json`
- Trigger heuristic: The next action is another same-shaped endpoint, q-prime, split, availability, repair, successor, or certificate step.
- Trigger heuristic: Three or more recent artifacts look like sibling puzzle pieces rather than a collapsed lemma.
- Trigger heuristic: A local compute lane is producing evidence faster than the theorem surface is absorbing it.
- Trigger heuristic: The agent can name progress but cannot name a finite decreasing measure or terminal cover.
- Trigger heuristic: The next move would launch broader compute without first asking what the current artifacts already imply together.
- Required question: What exact puzzle pieces are now assembled, and what claim do they jointly support?
- Required question: What finite measure, cover, rank, residue class count, or dependency count decreased?
- Required question: If no measure decreased, what abstraction would compress the repeated work into one lemma?
- Required question: What remains outside the assembled picture, stated as the smallest falsifiable boundary?
- Required question: What is the highest-value next action: finish a finite endpoint, recombine, generalize, formalize, or compute?
- Loop integration: Use the existing ORP granular-breakdown mode with this convergence topic; do not require a new ORP mode to exist.
- Loop integration: Write any discovered invariant, finite measure, recombination handoff, or compression lemma into TASK_LIST, FORMALIZATION_WORK, THEOREM_LOOP, or a dedicated packet.
- Loop integration: If the audit finds only more sibling work, explicitly record why that sibling is finite and cheaper than a general lemma this turn.
- Loop integration: After writeback, refresh the canonical task list so Clawdad and other agents inherit the updated assembly state.
- Durable artifact rule: Operational assembly insights must become repo-owned state; chat-only convergence claims do not count.

## ORP Mode Overlay Palette

- Status: `core_loop_palette_enabled`
- Source command: `orp mode list --json`
- Default mode id: `granular-breakdown`
- Selection rule: Select the smallest ORP overlay that reduces ambiguity or friction; do not run every mode by default.
- Durable when operational: `yes`
- Overlay `granular-breakdown` (core_decomposition_loop): The work is broad, confusing, theorem-heavy, or needs a durable dependency ladder before execution. | placement: Before execute_current_work_packet and whenever the active target becomes fuzzy. | command: `orp mode breakdown granular-breakdown --topic "problem 848 | Explain the 282 First-Failure Mechanism | active atom D2_p13_matching_lower_bound | target D4_matching_bound_implies_sMaxMixed_bound" --json` | output: Boundary, lanes, subclaims, atomic obligations, dependency ladder, active target, durable checklist, and next verification.
- Overlay `abstract-before-expand` (collapse_family_before_branching): Run this before any branch/search/compute/API/paid step that expands the surface; skip only when the primary action already names a theorem object, recombination, finite partition, decreasing measure, source audit, or blocker. | placement: Before branch, search, compute, API, paid, or sibling expansion. | command: `orp mode breakdown granular-breakdown --topic "problem 848 | abstract before expanding | Explain the 282 First-Failure Mechanism" --json` | output: Represented family, collapse theorem object, finite measure or gap, tool route, one next action, and writeback target.
- Overlay `convergence-assembly` (puzzle_assembly_and_measure_drop): Run this whenever the next action repeats a repair/split/search shape, before broad compute, and after material progress that creates new artifacts but not a clearer endgame. | placement: After material progress, before extending a repeated search/theorem ladder, and before broad compute. | command: `orp mode breakdown granular-breakdown --topic "problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism" --json` | output: Assembled pieces, supported claim, finite measure or gap, compression lemma candidate, remaining boundary, one next action, and one verification command.
- Overlay `ruthless-simplification` (compression_and_signal_filter): A plan, proof surface, or final response is swollen, repetitive, or hiding the single live decision. | placement: After granular decomposition, before committing a plan to TASK_LIST, and before final summaries. | command: `orp mode nudge ruthless-simplification --json` | output: One core sentence, one surviving move, and a list of noise to delete or defer.
- Overlay `systems-constellation` (dependency_and_downstream_effects): A change touches multiple surfaces such as erdos-problems, ORP, frontier-engine, local/remote compute, task lists, or user workflow. | placement: Before cross-system integration, paid/remote compute decisions, or changes to canonical source/writeback flow. | command: `orp mode nudge systems-constellation --json` | output: Upstreams, downstreams, feedback loops, hidden costs, and the system-level decision.
- Overlay `bold-concept-generation` (candidate_generation_when_stuck): The active theorem/search lane has converged too early, needs new candidate lemmas, or a split atom fails and needs alternative constructions. | placement: After a falsifier, before launching broad compute, or when inventing the next symbolic construction. | command: `orp mode nudge bold-concept-generation --json` | output: Several meaningfully different candidate moves, with the boldest one grounded into a quick experiment.
- Overlay `sleek-minimal-progressive` (fresh_lens_and_low_friction_motion): The work feels flat, overly linear, or technically correct but hard for future collaborators to pick up. | placement: When refining docs, task-list readability, handoff artifacts, UI surfaces, or the shape of the next user-facing explanation. | command: `orp mode nudge sleek-minimal-progressive --json` | output: One subtraction, one tasteful surprise, and one concrete next move that keeps momentum.

## Agent Flow

- Status: `ready`
- Audience: `agent`
- Operating rule: Read this object first; execute the primary next action unless a guardrail blocks it or the task list is stale.
- Primary next action: `await_p848_new_local_residual_handoff_theorem_or_explicit_guarded_source_audit_release_after_profile` [highest] Wait for a new local residual handoff-label theorem, row-generator/finite-Q theorem, or future explicit guarded source-audit release for the prepared profile; finite-frontier expansion remains paused.
- Default agent action: `execute_primary_next_action`
- Mode selection: Select the smallest ORP overlay that reduces ambiguity or friction; do not run every mode by default.
- Worktree hygiene: `erdos workspace hygiene --json`
- Worktree hygiene rule: Classify every dirty path, refresh canonical generated surfaces, convert useful scratch into canonical artifacts, and never destructively clean without approval.
- Worktree hygiene stop condition: If dirty paths are unclassified, unexpectedly large, or unrelated to the active step, pause expansion and write a hygiene/blocker note instead of continuing blindly.
- Granular nudge: `orp mode nudge granular-breakdown --json`
- Abstract-before-expand trigger-now: `no`
- Abstract-before-expand satisfied-by-primary: `yes`
- Abstract-before-expand gate: `orp mode breakdown granular-breakdown --topic "problem 848 | abstract before expanding | Explain the 282 First-Failure Mechanism" --json`
- Convergence assembly trigger-now: `yes`
- Convergence assembly: `orp mode breakdown granular-breakdown --topic "problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism" --json`
- p4217 complement guard trigger-now: `no`
- p4217 complement guard artifact: `packs/number-theory/problems/848/P4217_COMPLEMENT_STRATEGY_GUARD.md`
- p4217 complement guard rule: Do not try fallback selectors one by one unless the step is part of a batch cover/impossibility theorem, structural split, or explicit frontier-ledger rank decrease.
- p4217 complement post-leaf handoff: After the current finite leaf is exact-certified, blocked, or split into explicit open leaves, run convergence assembly and prefer bulk cover, impossibility theorem, structural decomposition, or ranked ledger transition before opening another deeper selector child.
- Situational overlay `ruthless-simplification`: A plan, proof surface, or final response is swollen, repetitive, or hiding the single live decision. | command: `orp mode nudge ruthless-simplification --json`
- Situational overlay `systems-constellation`: A change touches multiple surfaces such as erdos-problems, ORP, frontier-engine, local/remote compute, task lists, or user workflow. | command: `orp mode nudge systems-constellation --json`
- Situational overlay `bold-concept-generation`: The active theorem/search lane has converged too early, needs new candidate lemmas, or a split atom fails and needs alternative constructions. | command: `orp mode nudge bold-concept-generation --json`
- Situational overlay `sleek-minimal-progressive`: The work feels flat, overly linear, or technically correct but hard for future collaborators to pick up. | command: `orp mode nudge sleek-minimal-progressive --json`
- Agent guardrail: Do not run paid or remote compute unless the frontier configuration explicitly enables that paid rung.
- Agent guardrail: Prefer local/free compute before opt-in paid compute.
- Agent guardrail: Do not leave a large or unclassified dirty worktree behind an autonomous step; classify, write back, or block non-destructively.
- Agent guardrail: Do not expand branch/search/compute/API work until Abstract Before Expanding has either collapsed the family, routed a named unlock, or recorded why finite expansion is cheapest.
- Agent guardrail: Do not treat bounded search evidence as an all-N proof without a theorem-facing handoff.
- Agent guardrail: Do not keep making sibling puzzle pieces without regularly assembling the puzzle and recording what remains.
- Agent guardrail: Do not extend the p4217 complement by one fallback selector at a time unless a batch theorem or ledger-rank decrease is written back.
- Agent guardrail: Do not run every ORP mode by default.
- Agent guardrail: Persist operationally important changes into canonical artifacts rather than chat-only state.
- Refresh after material progress: `erdos problem task-list-refresh 848`

## Finite-Gap Strategy

- Verdict: `exact_endpoint_rollout_is_not_a_sole_all_N_closure_strategy`
- Operational threshold: `2.64 x 10^17` (external_public_claim)
- Remaining rows to operational threshold: `263,999,999,999,990,000`
- Projected endpoint checks to operational threshold: `10,566,518,518,518,119`
- Recommended mode: `hybrid_threshold_audit_plus_structural_verifier`
- Public raw exact packet interval: `1..10000`
- Local compact rollout evidence interval: `1..40500`
- Raw 40500 packet committed: `no`
- Guidance: Continue endpoint rollouts only as bounded base expansion and regression evidence.
- Guidance: Do not wait for direct endpoint checks to close the imported finite gap.
- Guidance: Prioritize auditing the imported threshold handoff or proving a stronger structural verifier lane.
- Guidance: Use GPU/frontier sweeps to generate structural candidates and counterexamples, not as a substitute for the all-N handoff proof.

## Split-Core Atomization Plan

- Plan id: `p848_split_core_atomization_master_plan_v1`
- Status: `active`
- North star: Make the D2/D3 matching lower-bound proof deterministic by turning every split-core persistence claim into replayable vertex, edge, congruence, matching, and K-envelope atoms.
- Deterministic rule: No split may be promoted from bounded witness support to theorem support until every layer below has a pass/fail checker and every failure emits a smaller successor atom.
- Active parent obligation: `D2_p13_matching_lower_bound`
- Target obligation: `D4_matching_bound_implies_sMaxMixed_bound`
- Split atoms: `5`
- D2 split count: `3`
- D3 split count: `2`
- Packet directory: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS`
- Packet manifest JSON: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/MANIFEST.json`
- Packet manifest markdown: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/MANIFEST.md`
- Packet files present: `yes`
- Successor packet count: `29`
- First packet refinement conditions: `10`
- Verified successor families: `29`
- Successor packet files present: `yes`
- All materialized successor families verified: `yes`
- First packet edge certificate: `literal_edge_obstruction_certificate_verified`
- First packet edge persistence: `literal_constant_edge_persistence_verified`
- Edge-persistent packet count: `5`
- First packet matching/K certificate: `literal_matching_sampled_k_envelope_verified`
- Matching/K packet count: `5`
- First packet split-discharge readiness: `split_discharge_readiness_candidate`
- Split-discharge ready packet count: `3`
- P13 row-universe coverage: `bounded_row_universe_stratified_tight_splits_plus_slack_dominated_remainder`
- P13 row-universe first missing atom: `D2_p13_slack_dominance_symbolic_lift`
- P13 slack-dominance lift: `bounded_slack_formula_replay_verified_symbolic_side_count_lift_needed`
- P13 slack-dominance first lemma: `D2_p13_non_tight_side_count_slack_floor_lift`
- Side-count floor packet count: `2`
- First side-count floor packet: `D2_p13_side_count_floor_outP2_70_out25_23_smaller_side7`
- First side-count structural margin lemma: `D2_p13_structural_margin_outP2_70_out25_23_smaller_side7_side18`
- First side-count moving-term subatom: `D2_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_q17_residual_window_relaxed_fallback_menu_lift_outP2_70_out25_23_smaller_side7_outsider_6323`
- Next undischarged p13 packet: `(none)`
- First packet to attack: `D2.3_persist_outP2=99_out25=14_smaller=side7`
- First successor packet to attack: `D2.1_persist_outP2=70_out25=9_smaller=side7.square_4_out_1`
- First unverified successor packet to attack: `(none)`
- Row-universe coverage candidate: `D2_p13_row_universe_split_coverage` [bounded_row_universe_stratified_tight_splits_plus_slack_dominated_remainder]
- Row-universe coverage scope: `bounded_p13_threat_rows_tight_splits_plus_slack_dominated_remainder`, tight witnesses `12` / bounded p13 threats `1285`
- Bounded p13 row strata: `52` total, `96` rows in emitted tight strata, `1189` / `1189` outside rows slack-dominated
- Bounded p13 slack floor: tight min `19`, outside min `21`, additional split rows `0`
- Row-universe emitted missing atom: `D2_p13_slack_dominance_symbolic_lift`
- Slack-dominance symbolic lift candidate: `D2_p13_slack_dominance_symbolic_lift` [bounded_slack_formula_replay_verified_symbolic_side_count_lift_needed]
- Slack-dominance formula replay: `1189` rows across `49` strata, target floor `20`, observed min `21`
- Slack-dominance first open lemma: `D2_p13_non_tight_side_count_slack_floor_lift`
- Most confusing question: Are the common matching pairs literal fixed vertices, or formulaic residue-family vertices that move with N?
- Why it matters: This determines whether the proof obligation is fixed vertex presence across a split, or extraction of a parameterized vertex formula before edge persistence can be proved.
- First place to attack: `D2.3_persist_outP2=99_out25=14_smaller=side7`
- Layer `A0_input_universe_freeze` [done_bounded]: Freeze the exact threatening-outsider row universe, prime lanes, and K(N,x) formula used by D1. | output: A row-universe manifest keyed by prime, N, outsider, side counts, K(N,x), actual matching, and smaller-side size.
- Layer `A1_split_profile_inventory` [done_bounded]: Freeze the p13 and p17 split keys and attach each bounded split-core witness packet to a parent D-lane obligation. | output: One split atom per residue/smaller-side profile.
- Layer `A2_full_common_core_pair_export` [done]: Export the full common matching core for each split, not only a pair sample. | output: For every split atom, a complete ordered list of common matching pairs with left/right values and residues modulo 25, p, and p^2.
- Layer `A3_vertex_presence_atoms` [next]: Prove every left/right vertex used by the split core is present on the correct compatible side for every row in the split. | output: One pass/fail vertex-presence certificate per split-core vertex family.
- Layer `A4_edge_obstruction_atoms` [next]: For every selected pair, identify the exact reason the cross edge is missing. | output: One obstruction certificate per pair, preferably a square-divisor witness or explicit modular contradiction.
- Layer `A5_congruence_persistence_atoms` [done_literal]: Prove each edge obstruction is implied by the split congruence assumptions, not by accidental sampled N values. | output: A symbolic congruence proof per obstruction family.
- Layer `A6_matching_disjointness_atoms` [done_literal]: Prove the exported pairs form a matching by checking left and right uniqueness. | output: A deterministic disjointness certificate per split core.
- Layer `A7_K_envelope_atoms` [done_sampled_envelope]: Prove the symbolic core size is always at least the required K(N,x) throughout the split. | output: One K-envelope inequality certificate per split.
- Layer `A8_split_discharge_atoms` [p13_readiness_complete_p17_pending]: Promote each split from bounded support to a symbolic split lemma only after all lower atoms pass. | output: One theorem-facing split lemma per split key.
- Layer `A9_prime_lane_promotion` [p13_ready_for_D2_promotion]: Promote D2 once all p13 split lemmas pass, and promote D3 once all p17 split lemmas pass. | output: D2_p13_matching_lower_bound and D3_p17_matching_lower_bound can feed D4 without bounded-only caveats.
- Split atom `D2.1_persist_outP2=70_out25=9_smaller=side7` [high_p13_active_lane, needs_symbolic_persistence_proof]: p=13, split=outP2=70|out25=9|smaller=side7, witnesses=6, core=108, K=[88,89]
- Split atom packet `p848_split_atom_packet_D2_1_persist_outP2_70_out25_9_smaller_side7`: JSON `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/D2_1_persist_outP2_70_out25_9_smaller_side7.json`, markdown `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/D2_1_persist_outP2_70_out25_9_smaller_side7.md`
- Split atom `D2.2_persist_outP2=99_out25=6_smaller=side18` [high_p13_active_lane, needs_symbolic_persistence_proof]: p=13, split=outP2=99|out25=6|smaller=side18, witnesses=5, core=105, K=[85,85]
- Split atom packet `p848_split_atom_packet_D2_2_persist_outP2_99_out25_6_smaller_side18`: JSON `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/D2_2_persist_outP2_99_out25_6_smaller_side18.json`, markdown `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/D2_2_persist_outP2_99_out25_6_smaller_side18.md`
- Split atom `D2.3_persist_outP2=99_out25=14_smaller=side7` [highest_singleton_profile, needs_symbolic_persistence_proof]: p=13, split=outP2=99|out25=14|smaller=side7, witnesses=1, core=108, K=[88,88]
- Split atom packet `p848_split_atom_packet_D2_3_persist_outP2_99_out25_14_smaller_side7`: JSON `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/D2_3_persist_outP2_99_out25_14_smaller_side7.json`, markdown `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/D2_3_persist_outP2_99_out25_14_smaller_side7.md`
- Split atom `D3.1_persist_outP2=38_out25=23_smaller=side7` [supporting_p17_companion_lane, needs_symbolic_persistence_proof]: p=17, split=outP2=38|out25=23|smaller=side7, witnesses=10, core=109, K=[12,14]
- Split atom packet `p848_split_atom_packet_D3_1_persist_outP2_38_out25_23_smaller_side7`: JSON `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/D3_1_persist_outP2_38_out25_23_smaller_side7.json`, markdown `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/D3_1_persist_outP2_38_out25_23_smaller_side7.md`
- Split atom `D3.2_persist_outP2=251_out25=1_smaller=side18` [supporting_p17_companion_lane, needs_symbolic_persistence_proof]: p=17, split=outP2=251|out25=1|smaller=side18, witnesses=2, core=106, K=[10,11]
- Split atom packet `p848_split_atom_packet_D3_2_persist_outP2_251_out25_1_smaller_side18`: JSON `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/D3_2_persist_outP2_251_out25_1_smaller_side18.json`, markdown `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/D3_2_persist_outP2_251_out25_1_smaller_side18.md`
- Adjacent layer `B1_split_coverage_universe` [needed]: The split-core proof should not silently assume every future threatening row belongs to the current split keys. | focus: Create a checker that partitions every bounded threatening row by the split key and emits new split obligations whenever a refreshed verifier discovers a new key.
- Adjacent layer `B2_vertex_formula_extraction` [needed_if_vertices_move]: If core vertices are not literal constants across N, we need formulas for the moving vertex families before edge persistence is meaningful. | focus: Mine affine/residue formulas for common-core left/right vertices and verify them against every sampled witness row.
- Adjacent layer `B3_obstruction_witness_normal_form` [needed]: Edge persistence becomes deterministic only when every missing edge has a normalized obstruction witness. | focus: Normalize each missing edge into product-plus-one divisibility, square-witness, or explicit incompatibility schema.
- Adjacent layer `B4_all_N_handoff_guard` [needed_later]: Even after split cores are symbolic, the final 848 decision still needs a clean handoff from D2/D3/D4 into the all-N threshold route. | focus: Keep this separate from split-core work; do not let final threshold or endpoint-regime logic pollute the matching-core proof.
- Atomization task `materialize_remaining_square_residue_successor_packets` [blocked_by_successor_family_proofs]: Materialize the remaining square-residue successor packets; 29 of 10 refinement conditions currently have packet files. | completion: Every refinement condition from the singleton p13 packet has a successor packet file and symbolic family check.
- Atomization task `prove_weakest_p13_dmax_q2_progression_atom` [blocked_by_dmax_growth_profile]: Wait for the dMax growth profile to emit its first square-divisor progression atom. | completion: The q=2 progression contribution is bounded by a floor-function with exclusions, or the first unresolved exclusion class becomes the next atom.
- Atomization task `prove_weakest_p13_dmax_q3_progression_atom` [blocked_by_q2_progression_certificate]: Wait for the q=2 progression proof to emit the q=3 square-divisor progression atom. | completion: The q=3 progression contribution is bounded by CRT floor-functions, or the first unresolved q=3 exclusion/overlap class becomes the next atom.
- Atomization task `prove_weakest_p13_dmax_q5_progression_atom` [blocked_by_q3_progression_certificate]: Wait for the q=3 progression proof to emit the q=5 square-divisor progression atom. | completion: The q=5 progression contribution is bounded by CRT floor-functions, or the first unresolved q=5 exclusion/overlap class becomes the next atom.
- Atomization task `prove_weakest_p13_dmax_q7_progression_atom` [blocked_by_q5_progression_certificate]: Wait for the q=5 progression proof to emit the q=7 square-divisor progression atom. | completion: The q=7 progression contribution is bounded by CRT floor-functions, or the first unresolved q=7 exclusion/overlap class becomes the next atom.
- Atomization task `prove_weakest_p13_dmax_q11_progression_atom` [blocked_by_q7_progression_certificate]: Wait for the q=7 progression proof to emit the q=11 square-divisor progression atom. | completion: The q=11 progression contribution is bounded by CRT floor-functions, or the first unresolved q=11 exclusion/overlap class becomes the next atom.
- Atomization task `prove_weakest_p13_dmax_q19_progression_atom` [blocked_by_q11_progression_certificate]: Wait for the q=11 progression proof to emit the q=19 square-divisor progression atom. | completion: The q=19 progression contribution is bounded by CRT floor-functions, or the first unresolved q=19 exclusion/overlap class becomes the next atom.
- Atomization task `prove_weakest_p13_dmax_q23_progression_atom` [blocked_by_q19_progression_certificate]: Wait for the q=19 progression proof to emit the q=23 square-divisor progression atom. | completion: The q=23 progression contribution is bounded by CRT floor-functions, or the first unresolved q=23 exclusion/overlap class becomes the next atom.
- Atomization task `prove_weakest_p13_dmax_q31_progression_atom` [blocked_by_q23_progression_certificate]: Wait for the q=23 progression proof to emit the q=31 square-divisor progression atom. | completion: The q=31 progression contribution is bounded by CRT floor-functions, or the first unresolved q=31 exclusion/overlap class becomes the next atom.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_parametric_lift` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: A parametric insertion/replacement rule saturates side7 for every future row in this split family, or the first unmatched residue/root-universe obstruction becomes the next deterministic atom.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_finite_augmenting_menu` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: A finite direct/replacement augmenting-path menu saturates side7 for every future event row, or the first event outside the menu becomes the next deterministic atom.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus1089_successor` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: The delta -1089 branch is proved and merged into the menu, or the first future row requiring another direct delta or longer augmenting path becomes the next deterministic atom.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus39_successor` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: The delta -39 branch is proved and merged into the menu, or the first future row requiring another direct delta or longer augmenting path becomes the next deterministic atom.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_residue_parametric_delta_selection_lift` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: A residue/block delta-selection theorem saturates side7 without adding singleton delta siblings, or the first uncovered event row becomes the next obstruction packet.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_residue_direct_selector_lift` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: A residue/mod-square selector produces a side18-compatible direct endpoint for every future side7 event row, or the first uncovered event row becomes the next obstruction packet.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_lift` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: The selected four-slot endpoint is a squarefree missing-cross edge for every future side7 row, or the first square-divisor exception becomes a bounded replacement-path packet.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_menu` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: A symbolic replacement menu handles the selected endpoint square-divisor exceptions without adding singleton deltas, or the first uncovered replacement row becomes the next deterministic packet.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_window_lift` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: A symbolic finite-window lift covers all selected-cross exceptions without singleton delta siblings, or the first row outside the menu becomes the next deterministic packet.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_right_compatibility_escape_lift` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: A symbolic right-compatibility escape selector replaces the finite-window miss family without adding singleton delta siblings, or the first row with no bounded side18 squarefree repair becomes the next deterministic packet.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_small_prime_crt_escape_selector_lift` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: A symbolic small-prime CRT selector handles the right-compatibility escape rows, or the first finite-window miss outside that selector becomes the next deterministic packet.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_p7_endpoint_cross_squarefree_fallback_lift` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: A symbolic cross-squarefree fallback selector handles the p=7 endpoint cross-bad rows, or the first finite-window miss outside that fallback rule becomes the next deterministic packet.
- Atomization task `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_lift` [blocked_by_bounded_matching_profile]: Wait for the bounded matching-injection profile to identify the parametric insertion target. | completion: A symbolic finite endpoint-menu lift covers all p=7 endpoint cross-bad rows without singleton delta siblings, or the first row outside the menu becomes the next deterministic packet.
- Atomization task `restore_p848_mod50_relevant_pair_row_generator_or_finite_q_partition_after_elementary_semantics_blocker` [blocked_by_no_repo_owned_mod50_row_generator_or_finite_q_partition_after_local_restoration_audit]: The local restoration audit found no repo-owned mod-50 relevant-pair row generator, symbolic recurrence, or finite-Q partition after the elementary generator semantics blocker. | completion: A repo-owned row-menu representative generator, symbolic recurrence, or finite-Q partition with denominator and handoff labels must be added before the mod-50 lane can feed all-N recombination; no additional provider call, q-cover expansion, singleton descent, fallback ladder, or naked rank-boundary work is allowed.
- Atomization task `await_p848_new_local_residual_handoff_theorem_or_explicit_guarded_source_audit_release_after_profile` [highest]: Wait for a new local residual handoff-label theorem, row-generator/finite-Q theorem, or future explicit guarded source-audit release for the prepared profile; finite-frontier expansion remains paused. | completion: No provider execution, q-cover expansion, singleton descent, fallback ladder, or naked rank-boundary expansion is allowed until a local residual handoff-label theorem, row-generator/finite-Q theorem, or future explicit guarded source-audit release closes the prepared profile.
- Atomization task `compacted_split_core_history` [compacted_history]: 255 completed or superseded split-core tasks omitted from generated task-list JSON; source packets remain under packs/number-theory/problems/848. | completion: undefined
- Atomization task `assemble_p848_no_spend_source_import_boundary_after_mod50_profile_blocker` [done_no_spend_source_import_boundary_after_mod50_profile_blocker]: The post-mod-50 source/import boundary is assembled; all three source lanes are profile or hard-blocked. | completion: The post-mod-50 source/import boundary either routes to a legal budget-guarded source-audit decision or emits the exact no-spend blocker/recombination boundary without provider execution.
- Atomization task `decide_p848_three_profile_source_import_with_budget_guard_or_emit_no_spend_blocker` [done_three_profile_source_import_no_spend_decision_blocker_emitted]: The three-profile source/import decision is blocked under the current no-spend instruction after usage was checked. | completion: The decision step must either run usage and release one high-leverage profile under the approved local budget guard, or emit a no-spend blocker that keeps all source/import lanes profile-bound without provider execution.
- Atomization task `assemble_p848_no_spend_all_n_recombination_blocker_after_three_profile_decision` [done_no_spend_all_n_recombination_blocker_after_three_profile_decision]: The no-spend all-N recombination blocker is emitted after the three-profile source/import decision. | completion: The recombination blocker must state that all-N remains blocked by the three missing source/import theorem objects unless a future budget-guarded source audit or local theorem closes at least one lane.
- Atomization task `prepare_p848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker` [done_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker]: The no-spend local theorem-statement backlog is prepared and selects the mod-50 generator/source theorem as the next local probe. | completion: The backlog must state the three remaining source/import theorem statements, rank them by cheapest local proof/source archaeology, and select one no-spend proof probe or precise blocker.
- Atomization task `attempt_p848_mod50_generator_theorem_statement_local_proof_or_emit_gap_after_all_n_recombination_blocker` [done_mod50_generator_theorem_statement_local_gap_after_denominator_audit]: The selected mod-50 generator/source theorem statement local probe emitted the exact recurrence/finite-Q/generator-source gap. | completion: The local probe must either prove a mod-50 all-future recurrence, finite-Q partition, or restored generator theorem with audited denominator objects, or emit a precise no-spend gap packet; it must not spend, reopen q-cover expansion, or promote finite replay to all-future coverage.
- Atomization task `assemble_p848_no_spend_source_import_boundary_after_mod50_local_statement_gap` [done_no_spend_source_import_boundary_after_mod50_local_statement_gap]: The no-spend source/import boundary after the mod-50 local statement gap is assembled and routes to a no-spend hard blocker. | completion: The boundary must record that the mod-50 local proof probe found no recurrence, finite-Q partition, or restored generator theorem, and must route only to a no-spend source/import decision or future guarded audit.
- Atomization task `emit_p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap` [done_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap]: The no-spend source/import hard blocker after the mod-50 local statement gap is emitted. | completion: The blocker must say no current no-spend source/import lane closes all-N, preserve the future guarded audit release conditions, and keep q-cover/singleton/rank-boundary expansion paused.
- Atomization task `await_p848_new_local_source_theorem_or_explicit_guarded_source_audit_release_after_no_spend_hard_blocker` [done_guarded_mod50_source_audit_release_conflict_blocked]: The guarded mod-50 source-audit release was preflighted, but active no-spend instructions blocked provider execution. | completion: No provider execution, q-cover expansion, singleton descent, fallback ladder, or naked rank-boundary expansion is allowed until a new local theorem is added or a future instruction explicitly releases one guarded source audit after usage clearance.
- Atomization task `await_p848_new_local_source_theorem_or_spend_permission_override_after_guarded_mod50_audit_release_conflict` [done_guarded_mod50_source_audit_result_packetized]: The one guarded mod-50 source audit result is packetized; no-spend defaults resumed. | completion: The next move must add a repo-owned local source theorem or remove/override no-spend for exactly one mod-50 source audit after a fresh usage check; no provider execution, q-cover expansion, singleton descent, fallback ladder, or naked rank-boundary work is allowed meanwhile.
- Atomization task `verify_p848_mod50_elementary_generator_relevant_pair_admissibility_or_emit_semantics_blocker` [done_mod50_elementary_generator_semantics_blocker_emitted]: The elementary square-generator candidate was checked against repo row/relevant-pair semantics and blocked from universal promotion. | completion: The local check must either promote the elementary generator only after row/relevant-pair admissibility is proved, or name the exact semantic constraint excluding it; no additional provider call, q-cover expansion, singleton descent, fallback ladder, or naked rank-boundary work is allowed.
- Atomization task `await_p848_new_local_row_generator_theorem_or_explicit_guarded_source_audit_release_after_restoration_blocker` [done_recovered_by_no_spend_same_bound_residual_counterfamily_boundary]: The no-spend block was challenged with a local same-bound residual counterfamily boundary; finite-frontier expansion remains paused. | completion: No provider execution, q-cover expansion, singleton descent, fallback ladder, or naked rank-boundary expansion is allowed until a local row-generator/finite-Q theorem is added or a future instruction explicitly releases exactly one guarded source audit after usage clearance.
- Atomization task `prove_or_block_p848_mod50_same_bound_residual_handoff_labels_after_counterfamily_boundary` [done_blocked_by_no_local_residual_handoff_label_theorem]: The local residual handoff-label attempt is complete: finite tie exclusion is proved for the row, but no per-bad-class handoff theorem is present. | completion: The local proof must either label each recorded residual mod-50 bad m-class as avoided, top-tie repaired, contrast-only repaired, or terminally blocked, or emit the exact handoff-label blocker; do not execute a provider call, q-cover expansion, singleton descent, fallback ladder, or naked rank-boundary work.
- Atomization task `await_p848_new_local_row_generator_or_residual_handoff_theorem_or_explicit_guarded_source_audit_release` [done_profile_prepared_no_provider_execution_under_no_spend]: The residual handoff-label source-audit profile is prepared locally; no provider was executed and finite-frontier expansion remains paused. | completion: No provider execution, q-cover expansion, singleton descent, fallback ladder, or naked rank-boundary expansion is allowed until a local residual handoff-label theorem, row-generator/finite-Q theorem, or future explicit guarded source-audit release is present.
- Atomization task `emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_square_obstruction_successor` [superseded_by_p509_repair]: Wait for the p83/q17 repair probe packet. | completion: The exact p83/q17 successor atom is emitted, or a sharper deterministic obstruction packet replaces it.
- Atomization task `attack_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_successor_atom` [superseded_by_p509_repair]: Wait for the p83/q17 successor atom packet. | completion: The emitted p83/q17 successor is proved, repaired by a sharper symbolic selector, or split into a smaller deterministic atom.
- Atomization task `start_singleton_p13_profile` [done_successor_packets_emitted]: Attack the singleton p13 split outP2=99|out25=14|smaller=side7 first to determine whether it is a real symbolic class or an under-split boundary artifact. | completion: The singleton split either gets a persistence atom or emits a sharper split key.

## Structural Verifier Audit

- Status: `blocked`
- Conclusion: The external verifier is useful as an idea source, but it is blocked from canonical promotion.
- Blockers: `sawhney_handoff_not_claimed_at_1e7, base_exchange_mask_covers_both_principal_sides`
- Next action: Keep the external computation in EXTERNAL_VERIFICATION_LEDGER as blocked, not promoted.
- Next action: Patch or independently reimplement the structural verifier with both base sides covered.
- Next action: Replace the false 10^7 Sawhney handoff with a repo-audited explicit threshold before any all-N claim.
- Next action: Port only the outsider-clique inequality shape into a repo-owned structural verifier lane.

## Base-Side Scout

- Status: `counterexample_to_global_7_side_domination_found`
- Interval: `1..200`
- Max side18-minus-side7: `1`
- Side18 global exceedance found: `yes`
- First side18 exceedance: `{"N":143,"maxSide7":2,"maxSide18":3,"maxSide7Outsider":41,"maxSide18Outsider":117,"maxSide18Minus7":1,"maxPerOutsider18Minus7":1,"maxPerOutsider7Minus18":1,"perOutsider18Winner":{"outsider":117,"side7":2,"side18":3,"delta18Minus7":1},"perOutsider7Winner":{"outsider":38,"side7":1,"side18":0,"delta7Minus18":1}}`
- Boundary: This scout compares principal-base compatibility counts on a finite interval only. It does not prove all-N base-side domination.

## Two-Sided Structural Scout

- Status: `side_specific_bounds_pass_but_union_bound_fails`
- Assessed range: `7307..7600`
- Union checks pass: `no`
- Union failures: `64`
- First union failure: `{"N":7307,"p":13,"p2":169,"rawPlus":43,"rawMinus":43,"vMax":43,"activePlus":40,"activeMinus":39,"sMaxSide7":111,"sMaxSide7Witness":4831,"sMaxSide18":110,"sMaxSide18Witness":1789,"sMaxUnion":218,"sMaxUnionWitness":1789,"dMax":18,"dMaxWitness":{"side":"plus","value":1591},"rGreater":100,"candidateSize":293,"side7CandidateSize":293,"side18CandidateSize":292,"side7Bound":272,"side18Bound":271,"unionBound":379,"side7Margin":21,"side18Margin":22,"unionMargin":-86,"side7Pass":true,"side18Pass":true,"unionPass":false}`
- Worst union row: `{"N":7552,"p":13,"p2":169,"rawPlus":45,"rawMinus":45,"vMax":45,"activePlus":42,"activeMinus":41,"sMaxSide7":113,"sMaxSide7Witness":4831,"sMaxSide18":114,"sMaxSide18Witness":1789,"sMaxUnion":225,"sMaxUnionWitness":1789,"dMax":18,"dMaxWitness":{"side":"plus","value":1591},"rGreater":103,"candidateSize":302,"side7CandidateSize":302,"side18CandidateSize":302,"side7Bound":279,"side18Bound":280,"unionBound":391,"side7Margin":23,"side18Margin":22,"unionMargin":-89,"side7Pass":true,"side18Pass":true,"unionPass":false}`
- Boundary: The union-base bound is safe but intentionally loose: it allows every compatible element from both principal sides even though a real clique may not be able to mix them.

## Mixed-Base Failure Scout

- Status: `sampled_union_failures_repaired_by_mixed_base_clique`
- Analyzed rows: `8`
- Mixed failures: `0`
- All analyzed rows pass mixed bound: `yes`
- Minimum mixed margin: `22`
- Worst mixed row: `{"source":"first_union_failure","N":7307,"p":13,"outsider":1789,"candidateSize":293,"sMaxSide7":111,"sMaxSide18":110,"sMaxUnion":218,"mixedBaseCliqueSize":110,"mixedBaseSide7Count":0,"mixedBaseSide18Count":110,"mixedBaseCliqueMatchesSingleSide":true,"mixedBound":271,"mixedMargin":22,"mixedPass":true,"originalUnionMargin":-86,"improvementOverUnion":108,"vMax":43,"dMax":18,"rGreater":100,"exampleMixedBaseClique":[43,68,143,243,268,293,343,443,518,543,643,743,843,943,968,1043,1143,1193,1243,1343,1418,1443,1468,1543,1643,1743,1843,1868,1943,2043,2093,2143,2243,2318,2343,2443,2543,2643,2693,2743,2768,2843,2918,2943,2993,3043,3143,3218,3243,3343,3443,3543,3643,3668,3743,3768,3843,3893,3918,3943,4043,4068,4118,4143,4243,4343,4443,4493,4543,4568,4618,4643,4743,4793,4843,4943,5018,5043,5143,5243,5343,5443,5468,5543,5643,5693,5743,5843,5918,5943,6043,6143,6243,6293,6343,6368,6418,6443,6543,6593,6643,6668,6743,6818,6843,6943,7043,7143,7243,7268]}`
- Boundary: This scout exactly solves the mixed-base clique on selected union-failure rows from the two-sided structural scout. It does not yet certify every structural breakpoint.

## Full Mixed-Base Structural Verifier

- Status: `bounded_full_mixed_base_structural_verifier_certified`
- Assessed range: `7307..7600`
- All mixed checks pass: `yes`
- Mixed failures: `0`
- Threatening outsider checks: `1733`
- Minimum certified margin: `20`
- Worst exact mixed row: `{"N":7343,"p":13,"p2":169,"rawPlus":44,"rawMinus":43,"vMax":44,"activePlus":41,"activeMinus":39,"activeOutsiderCount":80,"sMaxSide7":111,"sMaxSide7Witness":4831,"sMaxSide18":112,"sMaxSide18Witness":5309,"sMaxUnion":220,"sMaxUnionWitness":5309,"dMax":18,"dMaxWitness":{"side":"plus","value":1591},"rGreater":100,"candidateSize":294,"side7CandidateSize":294,"side18CandidateSize":294,"side7Bound":273,"side18Bound":274,"unionBound":382,"strictBaseThreshold":132,"side7Margin":21,"side18Margin":20,"unionMargin":-88,"side7Pass":true,"side18Pass":true,"unionPass":false,"certificateMode":"exact_mixed_base","threateningOutsiderCount":40,"exactMixedCheckCount":40,"sMaxMixed":112,"sMaxMixedWitness":5309,"mixedBound":274,"mixedMargin":20,"mixedPass":true,"maxImprovementOverUnion":109,"worstThreat":{"outsider":5309,"unionCount":220,"mixedBaseCliqueSize":112,"matchingSizeInMissingCrossGraph":108,"compatibleSide7Count":108,"compatibleSide18Count":112,"mixedCliqueSide7Count":0,"mixedCliqueSide18Count":112,"exampleMixedBaseClique":[43,118,143,243,268,343,368,443,543,568,643,718,743,793,843,943,1018,1043,1068,1143,1243,1318,1343,1443,1468,1493,1543,1618,1643,1693,1743,1843,1918,1943,2043,2143,2243,2343,2368,2443,2543,2593,2643,2718,2743,2818,2843,2943,3043,3143,3243,3268,3343,3443,3493,3543,3643,3718,3743,3843,3943,4043,4143,4168,4243,4343,4393,4443,4543,4618,4643,4743,4843,4943,5043,5068,5143,5168,5243,5293,5343,5443,5518,5543,5643,5718,5743,5843,5943,5968,6043,6143,6193,6243,6343,6393,6418,6443,6543,6643,6743,6768,6843,6868,6943,7043,7093,7143,7168,7243,7318,7343]},"threatMatchingSummary":{"threatCount":40,"minRequiredMatchingLowerBound":29,"maxRequiredMatchingLowerBound":89,"minActualMatching":79,"maxActualMatching":109,"minMatchingSlack":19,"allThreatsMeetRequiredLowerBound":true,"allThreatsSaturateSmallerSide":true,"tightestThreats":[{"outsider":5309,"outsiderMod25":9,"compatibleSide7Count":108,"compatibleSide18Count":112,"requiredMatchingLowerBound":89,"matchingSizeInMissingCrossGraph":108,"matchingSlack":19,"saturatesSmallerSide":true,"dominantMixedCliqueSide":"side18"},{"outsider":1789,"outsiderMod25":14,"compatibleSide7Count":108,"compatibleSide18Count":111,"requiredMatchingLowerBound":88,"matchingSizeInMissingCrossGraph":108,"matchingSlack":20,"saturatesSmallerSide":true,"dominantMixedCliqueSide":"side18"},{"outsider":4831,"outsiderMod25":6,"compatibleSide7Count":111,"compatibleSide18Count":105,"requiredMatchingLowerBound":85,"matchingSizeInMissingCrossGraph":105,"matchingSlack":20,"saturatesSmallerSide":true,"dominantMixedCliqueSide":"side7"},{"outsider":3281,"outsiderMod25":6,"compatibleSide7Count":108,"compatibleSide18Count":110,"requiredMatchingLowerBound":87,"matchingSizeInMissingCrossGraph":108,"matchingSlack":21,"saturatesSmallerSide":true,"dominantMixedCliqueSide":"side18"},{"outsider":6323,"outsiderMod25":23,"compatibleSide7Count":105,"compatibleSide18Count":110,"requiredMatchingLowerBound":84,"matchingSizeInMissingCrossGraph":105,"matchingSlack":21,"saturatesSmallerSide":true,"dominantMixedCliqueSide":"side18"}]}}`
- Boundary: Every witness-prime block and structural breakpoint in the assessed range is certified either by the safe union bound or by exact mixed-base clique checks for every threatening active outsider.

## Structural Lift Miner

- Status: `structural_lift_obligation_packet_ready`
- Mined exact rows: `64`
- Coverage complete: `yes`
- Primary exact primes: `13, 17`
- Next theorem lane: `formalize_cross_side_matching_bound_then_exact_prime_margin_lift`
- Obligation `p848_cross_side_matching_bound` [critical, bounded_evidence_ready]: For each threatening outsider, the missing cross-edge graph between the 7 mod 25 and 18 mod 25 compatible base sides has a matching large enough to force mixedCliqueSize below the strict base threshold.
- Obligation `p848_exact_prime_margin_lift` [critical, bounded_evidence_ready]: For the exact-mixed witness-prime families 13, 17, prove candidateSize > sMaxMixed + vMax + dMax + rGreater either eventually or by a finite periodic residue split.
- Obligation `p848_union_bound_tail_lift` [high, bounded_evidence_ready]: Prove that every non-exact witness-prime block is certified by the safe union bound past the base interval, with only finitely many exceptional rows delegated to exact verification.
- Obligation `p848_top_repeating_family_lift` [high, bounded_evidence_ready]: Use family p=17|Nmod25=7|d=minus|clique=side7|outMod25=1 as the first symbolic family to formalize.
- Recommended next: `mine_matching_pattern_witnesses` [critical] The active D2 atom needs a symbolic matching construction, and the matching-pattern miner extracts actual tight-row missing-cross pairs without bloating the verifier artifact. | command: `erdos number-theory dispatch 848 --apply --action matching_pattern_miner --matching-pattern-prime 13`
- Recommended next: `formalize_cross_side_matching_bound` [critical] The full verifier succeeds exactly because mixed-base cliques are much smaller than the safe union overcount; this is the theorem-shaped repair mechanism. | command: `erdos problem formalization-work-refresh 848`
- Recommended next: `formalize_exact_prime_margin_lift` [critical] The mined rows identify which witness-prime blocks still need symbolic margin control after the union-bound rows are separated. | command: `erdos problem formalization 848`
- Recommended next: `extend_structural_range_after_lift_target` [high] Once the first symbolic family is named, extend the bounded verifier beyond 7307..7600 to falsify or strengthen the family before claiming a lift. | command: `erdos number-theory dispatch 848 --apply --action full_mixed_base_structural_verifier --structural-min 7307 --structural-max 15200`
- Boundary: This miner extracts proof obligations from a bounded structural verifier. It does not certify any N outside the source verifier range.

## Structural Lift Reference Backlog

- Status: `active`
- North star: Turn the bounded mixed-base structural verifier into an all-N proof lane by proving the cross-side matching reduction, then the p=13 and p=17 margin lifts, while keeping exact finite coverage separate.
- Current packet: `D_matching_lower_bounds`
- First actionable step: `D2_p13_matching_lower_bound`
- Target step: `D4_matching_bound_implies_sMaxMixed_bound`
- Completion rule: Each step is complete only when it has a statement, hypotheses, proof sketch or proof artifact, falsifier boundary, dependencies, and the next downstream step updated.
- Reference next: `prove_p13_matching_lower_bound` [critical] Prove the symbolic p=13 lower bound that explains why maxMatching(H_{x,N}) always reaches the D1-extracted K(N,x) target in the tightest current exact-mixed family. | command: `erdos problem formalization-work-refresh 848`
- Reference next: `regression_check_C6_against_verifier` [high] Keep the discharged C6 mixed-clique matching formula regression-checked against representative full-verifier rows. | command: `erdos number-theory dispatch 848 --apply --action structural_lift_miner`
- Reference next: `extract_p13_residue_matching_pattern` [high] For the top p=13 families, extract the residue-block pattern behind the smaller-side-saturating matchings so D2 can become a symbolic construction rather than bounded evidence. | command: `erdos number-theory dispatch 848 --apply --action structural_lift_miner`
- Boundary: This checklist records a proof plan and dependencies. It does not certify any new N by itself.

## Template Loop

- `freeze_current_state`: Freeze the current north star and active theorem packet | Freeze the current route `finite_check_gap_closure`, claim surface `bridge_backed_frontier_support`, and active theorem packet before widening the search. | completion: The theorem loop, claim pass, and formalization packet all agree on the current route, next honest move, and active target. | command: `erdos problem theorem-loop 848`
- `audit_theorem_surfaces`: Audit theorem, claim, and formalization surfaces for consistency | Audit the theorem loop, claim loop, claim pass, formalization packet, and formalization work packet for drift or contradictory wording. | completion: The canonical theorem/search surfaces tell one consistent story about what is supported, what is open, and what the active work unit is. | command: `erdos problem task-list 848`
- `verify_canonical_inputs`: Verify canonical bridge inputs against the latest harvested compute artifacts | Verify that the bridge-backed theorem surfaces still match the latest harvested compute and frontier evidence. | completion: The canonical input packet for this loop remains current and trustworthy. | command: `erdos number-theory bridge-refresh 848`
- `verify_primary_structural_hook`: Verify the primary structural hook remains canonical | Verify that the `282 <-> 137720141` alignment remains canonical across theorem, claim, and bridge surfaces. | completion: The primary theorem-facing hook still survives refresh and remains narrow enough to formalize honestly. | command: `erdos problem claim-pass-refresh 848`
- `verify_verifier_boundary`: Verify the current exact/verifier boundary and next target | Verify that the certified interval 1..10000 and the next verifier target remain current across the pack surfaces. | completion: The interval work queue or verifier boundary packet still matches the theorem-facing status. | command: `erdos number-theory dispatch 848`
- `apply_granular_breakdown`: Apply ORP granular breakdown before execution | Run ORP granular breakdown on the active topic `problem 848 | Explain the 282 First-Failure Mechanism | active atom D2_p13_matching_lower_bound | target D4_matching_bound_implies_sMaxMixed_bound` and compress it into one active target plus one verification command. | completion: The broad work packet has been decomposed into boundary, lanes, atomic obligations, dependency ladder, active target, durable checklist, and next verification. | command: `orp mode breakdown granular-breakdown --topic "problem 848 | Explain the 282 First-Failure Mechanism | active atom D2_p13_matching_lower_bound | target D4_matching_bound_implies_sMaxMixed_bound" --json`
- `assemble_convergence_picture`: Assemble proof picture and convergence measure | Run convergence assembly on `problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism`: list the pieces already proved, the joint claim they support, the finite measure or missing measure, and the compression lemma or terminal boundary before making another sibling piece. | completion: The next action is justified as a finite endpoint, recombination/general lemma, formalization target, or explicitly bounded compute probe. | command: `orp mode breakdown granular-breakdown --topic "problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism" --json`
- `apply_abstract_before_expand_gate`: Apply Abstract Before Expanding gate | Before opening new branches, search lanes, compute sweeps, API calls, or paid rungs, run `problem 848 | abstract before expanding | Explain the 282 First-Failure Mechanism` and name the larger family, collapse theorem object, route decision, and writeback target. | completion: The next move is either collapsed to a theorem object/recombination path, routed to a named local/API/compute unlock, or allowed as finite expansion with an explicit decreasing token and blocker boundary. | command: `orp mode breakdown granular-breakdown --topic "problem 848 | abstract before expanding | Explain the 282 First-Failure Mechanism" --json`
- `execute_current_work_packet`: Explain the 282 First-Failure Mechanism | Isolate the extra square witness that makes continuation 282 fail first on the shared-prefix boundary class. | completion: The first remaining gap is either discharged, narrowed, or replaced by a sharper one: Prove structural-lift atom D2_p13_matching_lower_bound: For p=13 threatening rows, maxMatching(H_{x,N}) is at least the required matching bound extracted from the margin inequality. | command: `erdos problem formalization-work 848`
- `refresh_and_rerank`: Refresh the task list and rerank the next step | Refresh the canonical task list after the completed work so the next iteration is driven by the newest theorem/search/verifier evidence. | completion: The refreshed task list records the next highest-value action instead of relying on a stale fixed script. | command: `erdos problem task-list-refresh 848`

## Current Objective

- Formalization id: `p848_282_alignment_formalization_v1`
- Focus id: `formalize_282_alignment`
- Title: Formalize the 282 Obstruction Alignment
- Active work id: `p848_282_first_failure_mechanism_packet_v1`
- Active work title: Explain the 282 First-Failure Mechanism
- Active work status: `in_progress`

## Current Tasks

- `freeze_current_state` [ready] Freeze the current north star and active theorem packet | Freeze the current route `finite_check_gap_closure`, claim surface `bridge_backed_frontier_support`, and active theorem packet before widening the search. | completion: The theorem loop, claim pass, and formalization packet all agree on the current route, next honest move, and active target. | command: `erdos problem theorem-loop 848`
- `audit_theorem_surfaces` [ready] Audit theorem, claim, and formalization surfaces for consistency | Audit the theorem loop, claim loop, claim pass, formalization packet, and formalization work packet for drift or contradictory wording. | completion: The canonical theorem/search surfaces tell one consistent story about what is supported, what is open, and what the active work unit is. | command: `erdos problem task-list 848`
- `verify_canonical_inputs` [ready] Verify canonical bridge inputs against the latest harvested compute artifacts | Verify that the bridge-backed theorem surfaces still match the latest harvested compute and frontier evidence. | completion: The canonical input packet for this loop remains current and trustworthy. | command: `erdos number-theory bridge-refresh 848`
- `verify_primary_structural_hook` [ready] Verify the primary structural hook remains canonical | Verify that the `282 <-> 137720141` alignment remains canonical across theorem, claim, and bridge surfaces. | completion: The primary theorem-facing hook still survives refresh and remains narrow enough to formalize honestly. | command: `erdos problem claim-pass-refresh 848`
- `verify_verifier_boundary` [ready] Verify the current exact/verifier boundary and next target | Verify that the certified interval 1..10000 and the next verifier target remain current across the pack surfaces. | completion: The interval work queue or verifier boundary packet still matches the theorem-facing status. | command: `erdos number-theory dispatch 848`
- `apply_granular_breakdown` [ready] Apply ORP granular breakdown before execution | Run ORP granular breakdown on the active topic `problem 848 | Explain the 282 First-Failure Mechanism | active atom D2_p13_matching_lower_bound | target D4_matching_bound_implies_sMaxMixed_bound` and compress it into one active target plus one verification command. | completion: The broad work packet has been decomposed into boundary, lanes, atomic obligations, dependency ladder, active target, durable checklist, and next verification. | command: `orp mode breakdown granular-breakdown --topic "problem 848 | Explain the 282 First-Failure Mechanism | active atom D2_p13_matching_lower_bound | target D4_matching_bound_implies_sMaxMixed_bound" --json`
- `assemble_convergence_picture` [ready] Assemble proof picture and convergence measure | Run convergence assembly on `problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism`: list the pieces already proved, the joint claim they support, the finite measure or missing measure, and the compression lemma or terminal boundary before making another sibling piece. | completion: The next action is justified as a finite endpoint, recombination/general lemma, formalization target, or explicitly bounded compute probe. | command: `orp mode breakdown granular-breakdown --topic "problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism" --json`
- `apply_abstract_before_expand_gate` [ready] Apply Abstract Before Expanding gate | Before opening new branches, search lanes, compute sweeps, API calls, or paid rungs, run `problem 848 | abstract before expanding | Explain the 282 First-Failure Mechanism` and name the larger family, collapse theorem object, route decision, and writeback target. | completion: The next move is either collapsed to a theorem object/recombination path, routed to a named local/API/compute unlock, or allowed as finite expansion with an explicit decreasing token and blocker boundary. | command: `orp mode breakdown granular-breakdown --topic "problem 848 | abstract before expanding | Explain the 282 First-Failure Mechanism" --json`
- `execute_current_work_packet` [in_progress] Explain the 282 First-Failure Mechanism | Isolate the extra square witness that makes continuation 282 fail first on the shared-prefix boundary class. | The live 137720141 / 282 obstruction packet is checked at finite-menu scope; the remaining theorem work is the narrower symbolic-lift boundary. | completion: The first remaining gap is either discharged, narrowed, or replaced by a sharper one: Prove structural-lift atom D2_p13_matching_lower_bound: For p=13 threatening rows, maxMatching(H_{x,N}) is at least the required matching bound extracted from the margin inequality. | command: `erdos problem formalization-work 848`
- `discharge_first_remaining_gap` [ready] Discharge the first remaining gap in the active theorem packet | Prove structural-lift atom D2_p13_matching_lower_bound: For p=13 threatening rows, maxMatching(H_{x,N}) is at least the required matching bound extracted from the margin inequality. | This is the sharpest unresolved statement already named by the active theorem-work packet. | completion: The first remaining gap is either resolved or replaced by a more precise successor gap. | command: `erdos problem formalization-work-refresh 848`
- `refresh_and_rerank` [ready] Refresh the task list and rerank the next step | Refresh the canonical task list after the completed work so the next iteration is driven by the newest theorem/search/verifier evidence. | completion: The refreshed task list records the next highest-value action instead of relying on a stale fixed script. | command: `erdos problem task-list-refresh 848`

## Completed Anchors

- `completed_anchor_1` [done] The family-menu boundary agrees with the tracked-tail boundary: the earliest 282-failing family row is also representative 137720141.
- `completed_anchor_2` [done] The extra witness has been isolated: 841 belongs to the 282 repair row, not to the six defining tuple moduli of the shared-prefix class.
- `completed_anchor_3` [done] The witness boundary is locally frozen: no earlier family-menu row gives tail 282 residue 0 modulo 841.
- `completed_anchor_4` [done] The representative residue is structurally derived: the tuple-row CRT projects the shared-prefix obstruction class to 504 mod 841.
- `completed_anchor_5` [done] The congruence boundary is isolated: residue class 504 mod 841 is the failure class for tracked tail 282 and no other tracked coprime tail.
- `completed_anchor_6` [done] The row-index boundary is isolated: within the shared-prefix row progression, tracked anchor 282 is the only tracked anchor whose 841 witness class starts at row index 0.
- `completed_anchor_7` [done] The row-start derivation is explicit: the boundary representative already lies on the 282 witness class modulo 841, so the row equation reduces to t ≡ 0 (mod 841).
- `completed_anchor_8` [done] The menu-level first-occurrence boundary is isolated: 137720141 is the first family-menu representative in the 282 witness class 504 mod 841, so no earlier menu row can fail via witness 841 on that same congruence class.
- `completed_anchor_9` [done] The mechanism falsifier boundary is explicit: a lower representative in residue class 504 mod 841, a different first 282 witness, or bridge loss of the 137720141 <-> 282 alignment would all break this packet.
- `completed_anchor_10` [done] The 132-row lift is explicit: adding the 132 row forces the tuple-row CRT class from residue 400 mod 841 to the boundary residue 504 mod 841 via k ≡ 147 (mod 289).
- `completed_anchor_11` [done] The activation boundary is explicit: before anchor 132 no tuple-row CRT step lands on any tracked failure residue mod 841, anchor 132 creates the unique tracked 282 match at residue 504, and anchor 182 preserves that same unique match.
- `completed_anchor_12` [done] The 132-activation pattern is reusable on the current finite menu: 17 failing witness rows first activate their own failing tracked tail at anchor 132.
- `completed_anchor_13` [done] The finite-menu 132-activation pattern has been promoted into lemma schema p848_finite_menu_132_target_activation_schema_v1 with hypotheses, conclusion, falsifier boundary, and 17 row certificates.
- `completed_anchor_14` [done] The 17 finite-menu 132-activation row certificates replay successfully in checker p848_132_activation_row_certificate_checker_v1.
- `completed_anchor_15` [done] The 132-row lift to residue 504 mod 841 is proved from tuple-row CRT equations by checker p848_132_lift_crt_checker_v1.
- `completed_anchor_16` [done] The activation schema lift decision is explicit: finite_menu_certificate_not_universal_yet; next theorem pass is formalize_top_repair_class_mechanism.
- `completed_anchor_17` [done] The checked 132 activation schema has been lifted into symbolic CRT hypothesis packet p848_132_activation_symbolic_lift_candidate_v1; the next obligation is domain closure, not merely packet construction.
- `completed_anchor_18` [done] The broad domain-closure overclaim is ruled out at the current evidence boundary: The finite symbolic-lift survey splits across 8 failing anchors and 12 witness moduli, so the current evidence supports parameterized hypotheses but not one broad domain theorem.
- `completed_anchor_19` [done] The recommended anchor_832_witness_529 closure lane has been executed at finite repeated-group scope: 3 raw rows pass checker p848_832_529_anchor_witness_domain_closure_checker_v1.
- `completed_anchor_20` [done] The single-profile symbolic closure over anchor_832_witness_529 is falsified by the finite evidence split into 2 pre-132 residue profiles.
- `completed_anchor_21` [done] The anchor_832_witness_529 anchor-182 preservation step is explained: every checked row has lift parameter 0 at anchor 182.
- `completed_anchor_22` [done] The repeated pre132_7_1_32_224_57_229_82_412 sublane is closed as a finite duplicate final-anchor variant, not a new symbolic family.
- `completed_anchor_23` [done] Structural atom C1_same_side_base_clique is discharged: same-side principal base residues force a 25 divisor of u*v+1, so each same-side component is a clique.
- `completed_anchor_24` [done] Structural atom C2_two_cliques_plus_cross_edges is discharged by checker p848_C2_two_cliques_plus_cross_edges_checker_v1: the mixed-base graph is two cliques plus arbitrary cross edges.
- `completed_anchor_25` [done] Structural atom C3_missing_cross_graph_definition is discharged by checker p848_C3_missing_cross_graph_definition_checker_v1: H_{x,N} records exactly the missing cross edges between the two clique sides.
- `completed_anchor_26` [done] Structural atom C4_clique_to_vertex_cover_duality is discharged by checker p848_C4_clique_to_vertex_cover_duality_checker_v1: clique complements are exactly vertex covers of H_{x,N}.
- `completed_anchor_27` [done] Structural atom C5_konig_matching_reduction is discharged by checker p848_C5_konig_matching_reduction_checker_v1: Konig's theorem applies because H_{x,N} is finite bipartite.
- `completed_anchor_28` [done] Structural atom C6_mixed_clique_matching_formula is discharged by checker p848_C6_mixed_clique_matching_formula_checker_v1: sMixed(x,N) = |L| + |R| - maxMatching(H_{x,N}).
- `completed_anchor_29` [done] Structural atom D1_residue_block_matching_injection is discharged at bounded extraction scope by checker p848_D1_matching_saturation_bound_checker_v1: every current exact mixed-base threatening outsider meets K(N,x) and saturates the smaller compatible side.
- `completed_anchor_30` [done] D2 split-core witness extraction is discharged at bounded pattern scope by checker p848_D2_p13_split_core_witness_checker_v1: each p=13 split common core reaches the sampled K(N,x) target.
- `completed_anchor_31` [done] D3 split-core witness extraction is discharged at bounded pattern scope by checker p848_D3_p17_split_core_witness_checker_v1: each p=17 split common core reaches the sampled K(N,x) target.
- `completed_anchor_32` [done] The top repair-class mechanism packet p848_top_repair_class_mechanism_packet_v1 is seeded with shared metrics, nearest contrasts, common missed-family boundary, and falsifier conditions.
- `completed_anchor_33` [done] The finite-menu +2 repaired-predicted-family separation is discharged: 432->242, 782->242, 832->242 versus 332->240, 382->240, 1232->240.
- `completed_anchor_34` [done] The common missed-family replay is explicit: 9 top-tie shared missed predicted family rows were replayed directly from the family menu.
- `completed_anchor_35` [done] The finite-menu +2 separation has been lifted into mod-50 lane-index congruences: 74 exchange rows all pass the bad-m-class certificate.
- `completed_anchor_36` [done] The mod-50 bad-lane congruence has been generalized into symbolic schema p848_mod50_bad_lane_symbolic_schema_v1; 74 finite witness instances replay with 0 failures.
- `completed_anchor_37` [done] The strict 782 > 1232 handoff is connected to the symbolic mod-50 schema by checker p848_782_1232_strict_handoff_checker_v1; it is certified as finite-menu guidance, not all-N closure.
- `completed_anchor_38` [done] The 182 row preserves the boundary residue: the 132-lifted class already satisfies 137720141 ≡ 119 (mod 121), so the final anchor adds no further correction modulo 841.

## Next Needed Steps

- `gap_1` [next] Prove structural-lift atom D2_p13_matching_lower_bound: For p=13 threatening rows, maxMatching(H_{x,N}) is at least the required matching bound extracted from the margin inequality. | source: formalization_work | command: `erdos problem formalization-work-refresh 848`
- `gap_2` [next] Advance the same atomic packet toward target D4_matching_bound_implies_sMaxMixed_bound: If maxMatching(H_{x,N}) >= K(N), then sMixed(x,N) <= |L| + |R| - K(N). | source: formalization_work | command: `erdos problem formalization-work-refresh 848`
- `gap_3` [next] Decide and run the next post-10000 verification lane using local CPU and opt-in local 4090 compute only. | source: formalization_work | command: `erdos problem formalization-work-refresh 848`
- `formalize_282_alignment` [high] The bridge matches shared-prefix representative 137720141 with tracked tail 282 first failure 137720141. | source: theorem_formalization | command: `erdos problem formalization 848`
- `formalize_top_repair_cluster` [high] Top cluster 432, 782, 832 shares repaired-known=26, repaired-predicted=242, clean-through=250075000. | source: theorem_formalization | command: `erdos problem formalization 848`
- `decide_post_10000_verification_lane` [high] The canonical exact base currently ends at 1..10000. The next verification move is still open. | source: exact_verifier | command: `erdos number-theory dispatch 848`
- `model_repair_pool_growth` [medium] Recent bridge packets introduced new square moduli: 1369, 841, 17161, 1849. | source: theorem_formalization | command: `erdos problem formalization 848`
- `finite_gap_strategy_handoff` [high] Use the finite-gap strategy readout: endpoint rollout is useful, but exact-only closure would still require about 10,566,518,518,518,119 endpoint checks to reach the imported 2.64 x 10^17 handoff. | source: finite_gap_strategy | command: `erdos problem task-list-refresh 848`
- `materialize_remaining_square_residue_successor_packets` [blocked_by_successor_family_proofs] Materialize the remaining square-residue successor packets; 29 of 10 refinement conditions currently have packet files. | source: split_core_atomization_plan
- `prove_weakest_p13_dmax_q2_progression_atom` [blocked_by_dmax_growth_profile] Wait for the dMax growth profile to emit its first square-divisor progression atom. | source: split_core_atomization_plan
- `prove_weakest_p13_dmax_q3_progression_atom` [blocked_by_q2_progression_certificate] Wait for the q=2 progression proof to emit the q=3 square-divisor progression atom. | source: split_core_atomization_plan
- `prove_weakest_p13_dmax_q5_progression_atom` [blocked_by_q3_progression_certificate] Wait for the q=3 progression proof to emit the q=5 square-divisor progression atom. | source: split_core_atomization_plan
- `prove_weakest_p13_dmax_q7_progression_atom` [blocked_by_q5_progression_certificate] Wait for the q=5 progression proof to emit the q=7 square-divisor progression atom. | source: split_core_atomization_plan
- `prove_weakest_p13_dmax_q11_progression_atom` [blocked_by_q7_progression_certificate] Wait for the q=7 progression proof to emit the q=11 square-divisor progression atom. | source: split_core_atomization_plan
- `prove_weakest_p13_dmax_q19_progression_atom` [blocked_by_q11_progression_certificate] Wait for the q=11 progression proof to emit the q=19 square-divisor progression atom. | source: split_core_atomization_plan
- `prove_weakest_p13_dmax_q23_progression_atom` [blocked_by_q19_progression_certificate] Wait for the q=19 progression proof to emit the q=23 square-divisor progression atom. | source: split_core_atomization_plan
- `prove_weakest_p13_dmax_q31_progression_atom` [blocked_by_q23_progression_certificate] Wait for the q=23 progression proof to emit the q=31 square-divisor progression atom. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_parametric_lift` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_finite_augmenting_menu` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus1089_successor` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_direct_delta_minus39_successor` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_residue_parametric_delta_selection_lift` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_residue_direct_selector_lift` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_lift` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_menu` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_window_lift` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_right_compatibility_escape_lift` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_small_prime_crt_escape_selector_lift` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_p7_endpoint_cross_squarefree_fallback_lift` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `prove_p13_dynamic_margin_exact_mixed_matching_injection_selected_cross_squarefree_exception_period_shifted_endpoint_menu_lift` [blocked_by_bounded_matching_profile] Wait for the bounded matching-injection profile to identify the parametric insertion target. | source: split_core_atomization_plan
- `restore_p848_mod50_relevant_pair_row_generator_or_finite_q_partition_after_elementary_semantics_blocker` [blocked_by_no_repo_owned_mod50_row_generator_or_finite_q_partition_after_local_restoration_audit] The local restoration audit found no repo-owned mod-50 relevant-pair row generator, symbolic recurrence, or finite-Q partition after the elementary generator semantics blocker. | source: split_core_atomization_plan
- `await_p848_new_local_residual_handoff_theorem_or_explicit_guarded_source_audit_release_after_profile` [highest] Wait for a new local residual handoff-label theorem, row-generator/finite-Q theorem, or future explicit guarded source-audit release for the prepared profile; finite-frontier expansion remains paused. | source: split_core_atomization_plan
- `structural_verifier_import_audit` [high] Use the structural-verifier import audit: status blocked, blockers sawhney_handoff_not_claimed_at_1e7, base_exchange_mask_covers_both_principal_sides. | source: external_structural_verifier_audit | command: `erdos number-theory dispatch 848 --apply --action structural_verifier_audit`
- `base_side_scout` [high] Use the base-side scout: status counterexample_to_global_7_side_domination_found over 1..200; max side18-minus-side7 is 1. | source: structural_base_side_scout | command: `erdos number-theory dispatch 848 --apply --action base_side_scout --base-side-max 2000`
- `structural_two_side_scout` [ready] Use the two-sided structural scout: status side_specific_bounds_pass_but_union_bound_fails over 7307..7600; union failures 64 repaired by the full mixed-base verifier. | source: structural_two_side_scout | command: `erdos number-theory dispatch 848 --apply --action structural_two_side_scout --structural-min 7307 --structural-max 7600`
- `mixed_base_failure_scout` [ready] Use the mixed-base failure scout: status sampled_union_failures_repaired_by_mixed_base_clique; analyzed 8 union-failure rows with 0 mixed-base failures. | source: mixed_base_failure_scout | command: `erdos number-theory dispatch 848 --apply --action mixed_base_failure_scout --mixed-base-max-rows 40`
- `full_mixed_base_structural_verifier` [ready] Use the full mixed-base structural verifier: status bounded_full_mixed_base_structural_verifier_certified over 7307..7600; exact threatening-outsider checks 1733, mixed failures 0. | source: full_mixed_base_structural_verifier | command: `erdos number-theory dispatch 848 --apply --action full_mixed_base_structural_verifier --structural-min 7307 --structural-max 7600`
- `structural_lift_miner` [ready] Use the structural lift miner: status structural_lift_obligation_packet_ready; mined 64 exact mixed rows; next theorem lane formalize_cross_side_matching_bound_then_exact_prime_margin_lift. | source: structural_lift_miner | command: `erdos number-theory dispatch 848 --apply --action structural_lift_miner`
- `regime_b_endpoint_verifier_backend` [high] Continue the active endpoint-monotonicity exact verifier beyond 1..40500 (1621 endpoint checks cover 40500 rows; compression 24.98x). | source: exact_breakpoint_certificate | command: `erdos number-theory dispatch 848 --apply --action exact_followup_rollout --exact-chunks 5 --exact-chunk-size 1000 --endpoint-monotonicity`
- `compacted_next_needed_history` [compacted_history] 247 completed or superseded next-needed steps omitted from generated task-list JSON; source packets remain under packs/number-theory/problems/848.
- `emit_p848_p4217_residual_source_import_profile_approval_blocker_before_any_live_spend` [done_no_spend_approval_blocker_emitted] The approval/budget blocker is emitted; the repaired p4217 residual profile is preserved but not approved for live execution under the no-spend instruction. | source: split_core_atomization_plan
- `prepare_p848_local_p4217_residual_source_theorem_proof_attempt_or_emit_hard_blocker` [done_local_p4217_residual_source_theorem_hard_blocker_emitted] The local p4217 residual source-theorem proof attempt is hard-blocked: no finite CRT partition, decreasing rank, or squarefree-realization theorem is currently derivable without a future guarded source import. | source: split_core_atomization_plan
- `assemble_p848_no_spend_source_import_boundary_after_local_p4217_hard_blocker` [done_no_spend_source_import_boundary_assembled] The no-spend source/import boundary is assembled after the local p4217 hard blocker; the three remaining theorem objects and release conditions are explicit. | source: split_core_atomization_plan
- `prepare_p848_no_spend_local_theorem_backlog_after_source_import_boundary` [done_no_spend_local_theorem_backlog_prepared] The no-spend local theorem backlog is prepared and selects the square-moduli union/hitting source-index audit as the next local-only theorem probe. | source: split_core_atomization_plan
- `execute_p848_square_moduli_union_hitting_source_index_no_spend_audit` [done_square_moduli_union_hitting_source_index_audit_no_source] The no-spend square-moduli union/hitting source-index audit is packetized; no promotable Sawhney-compatible union/hitting upper-bound source was found locally. | source: split_core_atomization_plan
- `prepare_p848_square_moduli_union_hitting_source_import_profile_or_approval_blocker` [done_square_moduli_union_hitting_profile_approval_blocker_no_spend] The square-moduli union/hitting source-import profile/approval blocker is packetized; no live provider execution was released under the no-spend instruction. | source: split_core_atomization_plan
- `assemble_p848_no_spend_source_import_boundary_after_square_moduli_profile_blocker` [done_no_spend_source_import_boundary_after_square_profile_blocker] The no-spend source/import boundary after the square-moduli profile blocker is assembled and selects the mod-50 recurrence/generator lane next. | source: split_core_atomization_plan
- `prepare_p848_mod50_generator_source_import_profile_or_no_spend_blocker_after_source_boundary` [done_mod50_generator_source_import_profile_no_spend_blocker_emitted] The mod-50 generator/source-import profile no-spend blocker is emitted and preserves provider gating. | source: split_core_atomization_plan
- `assemble_p848_no_spend_source_import_boundary_after_mod50_profile_blocker` [done_no_spend_source_import_boundary_after_mod50_profile_blocker] The post-mod-50 source/import boundary is assembled; all three source lanes are profile or hard-blocked. | source: split_core_atomization_plan
- `decide_p848_three_profile_source_import_with_budget_guard_or_emit_no_spend_blocker` [done_three_profile_source_import_no_spend_decision_blocker_emitted] The three-profile source/import decision is blocked under the current no-spend instruction after usage was checked. | source: split_core_atomization_plan
- `assemble_p848_no_spend_all_n_recombination_blocker_after_three_profile_decision` [done_no_spend_all_n_recombination_blocker_after_three_profile_decision] The no-spend all-N recombination blocker is emitted after the three-profile source/import decision. | source: split_core_atomization_plan
- `prepare_p848_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker` [done_no_spend_local_source_theorem_statement_backlog_after_all_n_recombination_blocker] The no-spend local theorem-statement backlog is prepared and selects the mod-50 generator/source theorem as the next local probe. | source: split_core_atomization_plan
- `attempt_p848_mod50_generator_theorem_statement_local_proof_or_emit_gap_after_all_n_recombination_blocker` [done_mod50_generator_theorem_statement_local_gap_after_denominator_audit] The selected mod-50 generator/source theorem statement local probe emitted the exact recurrence/finite-Q/generator-source gap. | source: split_core_atomization_plan
- `assemble_p848_no_spend_source_import_boundary_after_mod50_local_statement_gap` [done_no_spend_source_import_boundary_after_mod50_local_statement_gap] The no-spend source/import boundary after the mod-50 local statement gap is assembled and routes to a no-spend hard blocker. | source: split_core_atomization_plan
- `emit_p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap` [done_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap] The no-spend source/import hard blocker after the mod-50 local statement gap is emitted. | source: split_core_atomization_plan
- `await_p848_new_local_source_theorem_or_explicit_guarded_source_audit_release_after_no_spend_hard_blocker` [done_guarded_mod50_source_audit_release_conflict_blocked] The guarded mod-50 source-audit release was preflighted, but active no-spend instructions blocked provider execution. | source: split_core_atomization_plan
- `await_p848_new_local_source_theorem_or_spend_permission_override_after_guarded_mod50_audit_release_conflict` [done_guarded_mod50_source_audit_result_packetized] The one guarded mod-50 source audit result is packetized; no-spend defaults resumed. | source: split_core_atomization_plan
- `verify_p848_mod50_elementary_generator_relevant_pair_admissibility_or_emit_semantics_blocker` [done_mod50_elementary_generator_semantics_blocker_emitted] The elementary square-generator candidate was checked against repo row/relevant-pair semantics and blocked from universal promotion. | source: split_core_atomization_plan
- `await_p848_new_local_row_generator_theorem_or_explicit_guarded_source_audit_release_after_restoration_blocker` [done_recovered_by_no_spend_same_bound_residual_counterfamily_boundary] The no-spend block was challenged with a local same-bound residual counterfamily boundary; finite-frontier expansion remains paused. | source: split_core_atomization_plan
- `prove_or_block_p848_mod50_same_bound_residual_handoff_labels_after_counterfamily_boundary` [done_blocked_by_no_local_residual_handoff_label_theorem] The local residual handoff-label attempt is complete: finite tie exclusion is proved for the row, but no per-bad-class handoff theorem is present. | source: split_core_atomization_plan
- `await_p848_new_local_row_generator_or_residual_handoff_theorem_or_explicit_guarded_source_audit_release` [done_profile_prepared_no_provider_execution_under_no_spend] The residual handoff-label source-audit profile is prepared locally; no provider was executed and finite-frontier expansion remains paused. | source: split_core_atomization_plan
- `emit_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_square_obstruction_successor` [superseded_by_p509_repair] Wait for the p83/q17 repair probe packet. | source: split_core_atomization_plan
- `attack_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_successor_atom` [superseded_by_p509_repair] Wait for the p83/q17 successor atom packet. | source: split_core_atomization_plan
- `start_singleton_p13_profile` [done_successor_packets_emitted] Attack the singleton p13 split outP2=99|out25=14|smaller=side7 first to determine whether it is a real symbolic class or an under-split boundary artifact. | source: split_core_atomization_plan

## Commands

- Problem surface: `erdos problem show 848`
- Problem artifacts: `erdos problem artifacts 848`
- Task list: `erdos problem task-list 848`
- Task list refresh: `erdos problem task-list-refresh 848`
- Task list run: `erdos problem task-list-run 848 --passes 10`
- ORP mode list: `orp mode list --json`
- ORP granular breakdown: `orp mode breakdown granular-breakdown --topic "problem 848 | Explain the 282 First-Failure Mechanism | active atom D2_p13_matching_lower_bound | target D4_matching_bound_implies_sMaxMixed_bound" --json`
- ORP granular nudge: `orp mode nudge granular-breakdown --json`
- Abstract before expanding: `orp mode breakdown granular-breakdown --topic "problem 848 | abstract before expanding | Explain the 282 First-Failure Mechanism" --json`
- Abstract-before-expand nudge: `orp mode nudge granular-breakdown --json`
- Convergence assembly: `orp mode breakdown granular-breakdown --topic "problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism" --json`
- Convergence nudge: `orp mode nudge granular-breakdown --json`
- Theorem loop: `erdos problem theorem-loop 848`
- Claim pass: `erdos problem claim-pass 848`
- Formalization: `erdos problem formalization 848`
- Formalization work: `erdos problem formalization-work 848`
- Source refresh: `erdos number-theory bridge-refresh 848`

## Sources

- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848`
- taskListJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/TASK_LIST.json`
- taskListMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/TASK_LIST.md`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/THEOREM_LOOP.json`
- claimPassJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/CLAIM_PASS.json`
- formalizationJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/FORMALIZATION.json`
- formalizationWorkJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/FORMALIZATION_WORK.json`
- intervalQueuePath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/INTERVAL_WORK_QUEUE.yaml`
- exactBreakpointScoutJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/EXACT_BREAKPOINT_SCOUT.json`
- exactBreakpointCertificateJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/EXACT_BREAKPOINT_CERTIFICATE.json`
- externalStructuralVerifierAuditJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/EXTERNAL_STRUCTURAL_VERIFIER_AUDIT.json`
- externalStructuralVerifierAuditMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/EXTERNAL_STRUCTURAL_VERIFIER_AUDIT.md`
- baseSideScoutJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/BASE_SIDE_SCOUT.json`
- baseSideScoutMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/BASE_SIDE_SCOUT.md`
- structuralTwoSideScoutJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/STRUCTURAL_TWO_SIDE_SCOUT.json`
- structuralTwoSideScoutMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/STRUCTURAL_TWO_SIDE_SCOUT.md`
- mixedBaseFailureScoutJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/MIXED_BASE_FAILURE_SCOUT.json`
- mixedBaseFailureScoutMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/MIXED_BASE_FAILURE_SCOUT.md`
- fullMixedBaseStructuralVerifierJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/FULL_MIXED_BASE_STRUCTURAL_VERIFIER.json`
- fullMixedBaseStructuralVerifierMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/FULL_MIXED_BASE_STRUCTURAL_VERIFIER.md`
- structuralLiftMinerJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/STRUCTURAL_LIFT_MINER.json`
- structuralLiftMinerMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/STRUCTURAL_LIFT_MINER.md`
- structuralLiftChecklistJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/STRUCTURAL_LIFT_CHECKLIST.json`
- structuralLiftChecklistMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/STRUCTURAL_LIFT_CHECKLIST.md`
- legacyBridgeJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SEARCH_THEOREM_BRIDGE.json`
