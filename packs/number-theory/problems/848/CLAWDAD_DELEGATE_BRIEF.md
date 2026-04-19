# Erdos Problem 848 Clawdad Delegate Brief

## North Star

Make Erdos Problem 848 decided in the `erdos-problems` repo by continuously advancing the theorem/search/verification loop from the canonical task list, formalization-work surface, generated 848 artifacts, and measured progress surfaces. Keep pushing the highest-value local/free 848 work until 848 is mathematically decided, paused, blocked by a hard stop, or Codex compute is depleted.

## Current Objective

Follow the refreshed `packs/number-theory/problems/848/TASK_LIST.json` `agentFlow` as the source of truth.

Current runtime addendum:

- The hardcoded `agentFlow.modePolicy.abstractBeforeExpand` gate is now mandatory before branch/search/compute/API/paid expansion.
- Run `orp mode breakdown granular-breakdown --topic "problem 848 | abstract before expanding | Explain the 282 First-Failure Mechanism" --json` when expansion is being considered.
- The gate must name the represented family, collapse theorem object, route decision, and writeback target before another concrete child is opened.
- Budget-guarded ORP/OpenAI research is part of the loop when it is the named theorem/source unlock and `./bin/erdos orp research usage --json` reports remaining `$5/day` budget.
- Remote paid compute such as Brev/H100 remains a separate approval lane.
- Worktree hygiene is part of the loop: run `./bin/erdos workspace hygiene --json` before long delegation, after material writeback, before API/remote/paid compute, and whenever the dirty set grows unexpectedly.
- A large dirty worktree is acceptable only when every path is classified; any `unclassifiedCount > 0` is a stop-and-self-heal condition, not a reason to continue expanding.
- Self-cleaning is non-destructive: classify, refresh generated surfaces, canonicalize useful scratch into packets/task/progress docs, or write an exact blocker. Never reset/checkout/rm to hide state.
- The current primary action should be re-read from `TASK_LIST.json`; as of the latest refresh it is `await_p848_new_local_source_theorem_or_explicit_guarded_source_audit_release_after_no_spend_hard_blocker`.

Before starting a step, read:

- `packs/number-theory/problems/848/TASK_LIST.json`
- `packs/number-theory/problems/848/PROGRESS.json`
- `packs/number-theory/problems/848/GLOBAL_CONVERGENCE_LIFT.md`
- `packs/number-theory/problems/848/FRONTIER_LEDGER.md`
- `packs/number-theory/problems/848/P4217_COMPLEMENT_STRATEGY_GUARD.md`
- `./bin/erdos workspace hygiene --json` when the step will write, spend, compute remotely, or expand the proof/search surface

The current primary action is:

`await_p848_new_local_source_theorem_or_explicit_guarded_source_audit_release_after_no_spend_hard_blocker`

The q/frontier lane made real mechanical progress, but the measured frontier kept expanding. The latest p4217/mod-50/residual/source-boundary packets remain valid background and should be cited, not reopened:

- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET.json`
- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET.json`
- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET.json`
- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET.json`
- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET.json`
- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json`
- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_MOD50_WEDGE_BLOCKER_PACKET.json`
- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_NO_SPEND_SOURCE_IMPORT_BOUNDARY_AFTER_SQUARE_MODULI_PROFILE_BLOCKER_PACKET.json`

The no-spend source/import boundary after the square-moduli profile blocker is assembled. The mod-50 generator/source-import profile no-spend blocker and the local-statement hard blocker have also been emitted. Do not redo those completed boundaries unless a refreshed task list changes the primary action.

The active pivot reconciliation packet is:

`packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json`

This packet verifies that the direct shortcut claim is not yet justified: Tao-van Doorn Appendix A, Theorem 16 upper-bounds avoiding sets, while Sawhney Lemma 2.1 and Lemma 2.2 need union/hitting upper bounds. It also recomputes the local A* denominator sanity check, where `sum h(q)` is near `1.028`, not near the `25` scale needed for a direct `1/25` collapse.

The corrected square-moduli no-go packet is now emitted:

`packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json`

This packet proves the current repo-owned Tao-van-Doorn shortcut does not supply the required Sawhney union/hitting upper bound: the available theorem bounds the avoiding side, and complement duality only turns that into a hitting lower bound. It preserves the possibility of a future imported union/hitting square-moduli theorem, but no such theorem is currently present with verified hypotheses/constants.

The p4217 theorem-wedge/source-import audit packet is now emitted:

`packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_THEOREM_WEDGE_SOURCE_IMPORT_AUDIT_PACKET.json`

This packet records a no-spend ORP planning run and audits the current local p4217 sources. It found no repo-owned whole-complement cover theorem, impossibility theorem, finite partition, decreasing invariant, or imported/source theorem with verified hypotheses. It did not call a provider.

The p4217 theorem-wedge decision blocker packet is now emitted:

`packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json`

This packet records the budget-guarded single-lane p4217 live wedge run `research-20260418-090709-931835`. The live lane completed and found no promotable whole-complement cover theorem, impossibility theorem, finite partition, decreasing invariant, or imported/source theorem. It selected a deterministic residual fork instead of more q-cover/singleton descent.

The immediate job is now to honor the hard blocker: wait for a new local source theorem, or use the explicit guarded source-audit release if the usage ledger permits it. The audit must target exactly one of three theorem forks:

- a mod-50 all-future relevant-pair recurrence,
- a finite-Q partition that covers every future relevant-pair row,
- a restored original family-menu generator theorem with audited source/import boundary.

If none of those forks closes locally or through the one guarded audit, emit the exact source/import blocker and keep finite q-cover/singleton/rank-boundary expansion paused. Do not rerun the broad mod-50 paid wedge by default; the result is already packetized.

Do not run q193/q197 singleton descent. Do not emit a naked deterministic rank boundary. Do not launch another q-cover over q193..q389 or any larger successor surface. Do not claim `N0 ~ 10^6`, `N0 <= 40500`, or "Tao-van Doorn plus exact verifier decides 848" unless a future imported/source theorem actually proves the union/hitting direction, constants, and threshold.

The current finite token is `p848_no_spend_source_import_hard_blocker_after_mod50_local_statement_gap`. The micro-goal is a narrow guarded source audit or new local source theorem, not more finite q/frontier layers and not re-emitting p4217/mod-50/residual/Tao-van-Doorn packets.

Current explicit guarded-audit release:

- Run `./bin/erdos orp research usage --json` first.
- If remaining daily USD budget and live-run count are available, one narrow ORP/OpenAI source-audit call is released for the mod-50 all-future recurrence, finite-Q partition, or original family-menu generator theorem.
- This is an explicit no-spend override for exactly one guarded mod-50 source-audit call. After that call completes, fails, or blocks, no-spend defaults resume unless a future instruction releases another guarded call.
- If usage is exhausted, credentials are missing, or the question cannot be kept narrow, emit a blocker/approval packet instead of spending.
- Any answer is discovery only until packetized with exact hypotheses, constants, proof boundary, and 848 handoff.

## Complement Guard

The p4217 complement lane is high-risk for a sibling-ladder anti-pattern. The guard is active:

`packs/number-theory/problems/848/P4217_COMPLEMENT_STRATEGY_GUARD.md`

Do not try fallback selectors `p47, p53, p59, ...` one by one unless the step is part of a batch cover, impossibility theorem, structural split, or explicit frontier-ledger rank decrease.

Allowed current finite-token work:

- Treat the q-cover staircase breaker as already emitted by `P848_P4217_Q_COVER_STAIRCASE_BREAKER_NONCONVERGENCE_PACKET`.
- Treat the q-cover parametric transition route as already emitted by `P848_Q_COVER_PARAMETRIC_TRANSITION_ROUTE_PACKET`.
- Treat the structural p4217 complement invariant blocker as already emitted by `P848_P4217_STRUCTURAL_COMPLEMENT_INVARIANT_BLOCKER_PACKET`.
- Treat the mod-50 all-future recurrence source-theorem blocker as already emitted by `P848_MOD50_ALL_FUTURE_RECURRENCE_SOURCE_THEOREM_BLOCKER_PACKET`.
- Treat the mod-50 source-archaeology theorem-wedge packet as already emitted by `P848_MOD50_SOURCE_ARCHAEOLOGY_THEOREM_WEDGE_PACKET`.
- Treat the mod-50 theorem-wedge decision blocker as already emitted by `P848_MOD50_THEOREM_WEDGE_DECISION_BLOCKER_PACKET`.
- Treat the all-N residual assembly as already emitted by `P848_ALL_N_RECOMBINATION_RESIDUAL_AFTER_MOD50_WEDGE_BLOCKER_PACKET`.
- Treat the Tao-van Doorn threshold pivot reconciliation as already emitted by `P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET`.
- Treat the corrected square-moduli no-go handoff as already emitted by `P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET`.
- Treat the p4217 theorem-wedge/source-import audit as already emitted by `P848_P4217_COMPLEMENT_THEOREM_WEDGE_SOURCE_IMPORT_AUDIT_PACKET`.
- Treat the p4217 theorem-wedge decision blocker as already emitted by `P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET`.
- Work on the residual theorem fork selected by the decision blocker.
- Do not descend into q193, q197, or any singleton q-child.
- Do not run another q-cover or rank-boundary step unless a new theorem packet first proves the measure or finite partition that decreases/closes.

After the current p4217 residual fork closes or blocks, prefer one of:

- Final all-N recombination only if the residual atoms are closed.
- A verified exact-threshold extension only if a future corrected analytic source supplies a valid `N0`.
- A restored generator/source theorem packet if source recovery becomes available.
- A repaired theorem-wedge profile/prompt packet, but only before any future live spend and only if it is clearly sharper than the failed `max_output_tokens` attempt.
- A sharper p4217 complement blocker packet that states exactly what remains outside the proof.

## Frontier Growth Pressure

The current measured frontier is expanding while it descends:

- `open_frontier_obligation_count = 84`
- The latest complement/source state is `p4217_theorem_wedge_decision_blocker_emitted_budget_guarded_live_no_whole_complement_theorem`.
- The current action is the p4217 residual theorem-fork reduction selected by the decision blocker, not another q-cover and not singleton q-prime descent.

This is not automatically bad: a structured descent can expose children before closing them. But do not report this as global convergence unless the next steps also record terminal leaves, bulk cover, impossibility, structural decomposition, or an explicit frontier-ledger rank decrease.

After each split or repair handoff:

- Refresh `TASK_LIST`, `PROGRESS`, `GLOBAL_CONVERGENCE_LIFT`, `FRONTIER_LEDGER`, and `P4217_COMPLEMENT_STRATEGY_GUARD`.
- Compare the new `open_frontier_obligation_count` against the prior refresh.
- If the count keeps rising without terminal closures, prefer bulk cover/impossibility/structural decomposition over another deeper selector step.
- Growth tripwire: after the current finite leaf is certified, blocked, or ledgered, if `open_frontier_obligation_count` has not decreased through terminal leaves, exact repairs, blockers, bulk cover, impossibility theorem, structural decomposition, or ranked transition, pause selector descent and run convergence assembly before opening any fresh selector child.

Post-current-leaf stop rule:

- The q-cover nonconvergence blocker and transition-route packet exist.
- The structural p4217 complement invariant blocker exists.
- The mod-50 all-future recurrence source-theorem blocker exists.
- The mod-50 source-archaeology theorem-wedge packet exists.
- The mod-50 theorem-wedge decision blocker exists.
- The all-N residual assembly packet exists.
- The Tao-van Doorn threshold pivot reconciliation packet exists.
- The corrected square-moduli no-go handoff packet exists.
- The p4217 theorem-wedge/source-import audit packet exists.
- The p4217 theorem-wedge decision blocker packet exists.
- Do not open another deeper selector child or larger q-cover until a new theorem-facing packet proves a decreasing measure, finite partition, structural cover/decomposition, or audited theorem-wedge result.
- Prefer the p4217 residual theorem fork, or a sharper p4217 source-theorem gap packet, over more finite q-cover compute.

Before any additional fallback selector, explicitly answer:

- What whole complement family or selector family is being covered?
- What finite denominator, partition, or ledger-rank token decreases?
- If the step fails, what deterministic blocker or successor boundary will be written?
- Why is this single selector cheaper than a bulk cover, impossibility theorem, or structural decomposition this turn?

## Convergence Assembly

The task list contains `convergenceAssemblyMode` and `agentFlow.modePolicy.convergenceAssembly`; use those before extending repeated endpoint, split, repair, q-prime, certificate, successor, or fallback-selector ladders.

When `agentFlow.modePolicy.convergenceAssembly.triggerNow` is true, when `agentFlow.modePolicy.p4217ComplementStrategyGuard.triggerNow` is true, or when the next action has the same shape as recent actions, first run/write back convergence assembly:

`orp mode breakdown granular-breakdown --topic "problem 848 | convergence assembly | Explain the 282 First-Failure Mechanism" --json`

The assembly must answer:

- What pieces have already been proved or certified?
- What joint theorem claim do those pieces support?
- What finite measure decreased, or is there no finite measure yet?
- What compression/general lemma, recombination packet, or theorem object would collapse the repeated work?
- What exact boundary remains outside the assembled proof?
- What is the single next action and single verification command?

Do not keep making sibling puzzle pieces without regularly assembling the puzzle and recording what remains. If no finite measure can be named, prefer a compression lemma, recombination packet, formal theorem object, deterministic boundary packet, or complement strategy packet over another sibling endpoint step.

## Current 848 Context

Account for the endpoint-selector artifacts before repeating stale endpoint work:

- `packs/number-theory/problems/848/ENDPOINT_MENU_ABSTRACTION.md`
- `packs/number-theory/problems/848/compute/problem848_endpoint_menu_compiler.mjs`
- generated endpoint-menu dynamic-margin packets in `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/`

Account for the 282-alignment artifact:

- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_282_ALIGNMENT_OBSTRUCTION_PACKET.json`

This packet proves the observed representative mechanism at `n=137720141`: shared-prefix anchors are square-blocked, continuation `282` is blocked by `29^2 = 841`, and comparison continuations `332,432,782,832` are squarefree at the same representative. It reconstructs the synthetic CRT rows:

- anchor-only class `n == 137720141 mod 32631532164`
- anchor+282 class `n == 137720141 mod 27443118549924`

It does not prove first structural unavoidability. Its next theorem move is to bind the synthetic family row to a recovered/regenerated live family-menu row, recover tuple rows, and then lift the `841` witness from the representative to the recovered class.

Account for the Tao-van Doorn large-sieve audit before redirecting the run toward a threshold-collapse route:

- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_TAO_VAN_DOORN_LARGE_SIEVE_DIRECTION_AUDIT_PACKET.json`

This audit verifies that arXiv:2512.01087 Appendix A, Theorem 16 exists and is relevant background, but blocks the direct claim that it lowers the 848 threshold to around `10^6` or below `40500`. The theorem upper-bounds sets avoiding residue classes modulo `p^2`; Sawhney Lemma 2.1 and Lemma 2.2 need upper bounds on union/hitting sets. The local denominator sanity check has `sum h(q)` near `1.028` for the A* branch, not near `25`, so the direct `1/25` threshold-collapse reading appears inverted.

The pivot reconciliation packet closed the first analytic gate:

- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_TAO_VAN_DOORN_THRESHOLD_PIVOT_RECONCILIATION_PACKET.json`

The corrected square-moduli no-go packet then closed the current repo-owned analytic shortcut:

- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_CORRECTED_SQUARE_MODULI_DUAL_SIEVE_OR_UNION_HITTING_THRESHOLD_PACKET.json`

This packet records that Tao-van-Doorn plus complement duality does not produce the required union/hitting upper bound and releases `prepare_p848_p4217_complement_theorem_wedge_or_import_source_cover` as the next highest-value action. Do not resume q-bucket descent, do not claim `N0 ~ 10^6`, and do not claim exact-verifier plus Tao-van Doorn decides 848 unless a future source/imported theorem supplies the missing union/hitting direction with audited constants.

The p4217 theorem-wedge/source-import audit packet closed that preparation step:

- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_THEOREM_WEDGE_SOURCE_IMPORT_AUDIT_PACKET.json`

It records `apiCalled=false`, `sourceImportAudit.result=no_repo_owned_p4217_whole_complement_source_theorem_found`, and releases `decide_p848_p4217_complement_wedge_with_budget_guard_or_local_symbolic_proof`. The first command is `erdos orp research usage --json`; do not run a paid/live lane unless the usage guard allows it and the call purpose remains a high-leverage p4217 theorem-wedge/source-import decision.

The p4217 theorem-wedge decision blocker closed that decision step:

- `packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_P4217_COMPLEMENT_THEOREM_WEDGE_DECISION_BLOCKER_PACKET.json`

It records the single budget-guarded live ORP run, `apiCalled=true`, and `decisionVerdict.result=no_promotable_p4217_whole_complement_theorem_found`. It releases `reduce_p848_p4217_residual_to_squarefree_realization_source_theorem_or_emit_gap`. Do not rerun the same paid wedge by default; reduce the residual to finite CRT partition, decreasing rank, or squarefree-realization source theorem, and packetize the exact gap if none closes.

ORP research API support is available for source-audit and discovery questions:

- Planning/status: `erdos orp research status --json`
- Planning-only research run: `erdos orp research ask 848 --question "<source-audit or discovery question>" --json`
- Bounded 848 theorem-wedge profile: `packs/number-theory/problems/848/ORP_RESEARCH_THEOREM_WEDGE_PROFILE.json`
- Bounded p4217 theorem-wedge profile: `packs/number-theory/problems/848/ORP_RESEARCH_P4217_THEOREM_WEDGE_PROFILE.json`
- Planning-only 848 theorem-wedge run: use the command in `TASK_LIST.json`; it must include `--profile-file packs/number-theory/problems/848/ORP_RESEARCH_THEOREM_WEDGE_PROFILE.json`.
- Usage ledger: `erdos orp research usage --json`
- Live OpenAI run, allowed only inside the current approved local API budget guard: `erdos orp research ask 848 --question "<source-audit or discovery question>" --execute --allow-paid --json`
- Live p4217 theorem-wedge run, allowed only inside the same budget guard: use the `followUpCommand` in `P848_P4217_COMPLEMENT_THEOREM_WEDGE_SOURCE_IMPORT_AUDIT_PACKET.json`; it already includes `--profile-file packs/number-theory/problems/848/ORP_RESEARCH_P4217_THEOREM_WEDGE_PROFILE.json`.
- Smoke check: `erdos orp research openai-check --json`
- Live smoke check, allowed only inside the current approved local API budget guard: `erdos orp research openai-check --execute --allow-paid --json`

Current approved default budget: `$5/day` across ORP/OpenAI research API calls, governed locally by `ERDOS_ORP_RESEARCH_DAILY_USD_LIMIT` and the `.erdos/registry/research/openai-live-usage.json` ledger. The call-count guard defaults to `10/day`. This is a local agent/workspace budget guard, not an upstream provider billing hard cap. Before any live call, run `erdos orp research usage --json` and confirm there is remaining run count and remaining USD budget. Use live research only when it can unlock a source audit, theorem wedge, external reference check, or repeated local-stall diagnosis; do not use it for routine tests, deterministic compute, or broad fishing.

Treat ORP research answers as process artifacts for discovery. Do not promote them to canonical proof without writing an audited packet, refreshing the theorem/progress surfaces, and preserving proof boundaries. If the budget guard blocks, the daily cap is reached, the call purpose is not high-leverage, or the command would exceed the approved local budget, emit an exact blocker/approval packet instead of running the live call.

## Definition Of Done

- Ultimate done: Problem 848 is decided with repo-owned proof/search/formalization artifacts and no bounded-only overclaim.
- Current micro-done: the refreshed primary action is completed with proof-facing artifacts, replaced by a sharper deterministic successor atom, or recombined into a convergence/generalization theorem packet.
- The task list, formalization-work artifacts, theorem-loop surfaces, progress surfaces, frontier ledger, complement strategy guard, and split atom packets remain current and point at the next highest-value action.
- Worktree hygiene has been run after material writeback; dirty paths are classified, no unclassified artifacts remain, and stale generated surfaces are refreshed or blocker-documented.
- Focused local checks pass for changed behavior.
- Any blocker emits an exact approval/blocker packet instead of silently stopping.

## Allowed Without Asking

- Local edits in this repo.
- Running local tests, build steps, focused CLI checks, ORP mode nudges/breakdowns, and free tooling already available.
- Reading local files and generated 848 artifacts.
- Running local CPU computations that are bounded/reasonable for the active packet.
- Using already-configured local/free compute only when the task list or frontier config indicates it is appropriate.
- Running `./bin/erdos workspace hygiene --json` and non-destructively refreshing/canonicalizing generated surfaces.
- Running ORP/OpenAI live research calls only inside the approved local `$5/day` API budget guard and only for source-audit, theorem-wedge, external-reference, or repeated-local-stall moments.
- Updating canonical 848 artifacts, task lists, theorem-loop surfaces, progress surfaces, and notes when progress changes the next action.

## Hard Stops

- Anything paid or likely to create spend outside the approved local ORP/OpenAI research API budget, including Brev/H100/remote paid GPU rungs unless explicitly approved later.
- Live OpenAI/ORP research execution when `erdos orp research usage --json` shows no remaining run count or USD budget, when the guard blocks, or when the purpose is not a high-leverage source-audit/theorem-wedge/external-reference/repeated-stall question.
- Anything that needs another human.
- Anything that needs credentials, billing, MFA, account, or auth decisions.
- Destructive actions or irreversible cleanup.
- Continuing long-running expansion while worktree hygiene reports unclassified dirty paths.
- Treating bounded search evidence as an all-N proof without a theorem-facing handoff.

## Loop

This delegate is for 848, not for the Clawdad codebase. Keep the loop frictionless: inspect `TASK_LIST.json`, follow `agentFlow`, inspect `P4217_COMPLEMENT_STRATEGY_GUARD.md` for complement work, run convergence assembly when sibling-ladder behavior appears, implement the smallest durable theorem/search/check step, verify locally, refresh with `./bin/erdos problem task-list-refresh 848` and `./bin/erdos problem progress-refresh 848`, and continue.

Prefer deterministic atomization, recombination, and theorem-facing compression over broad brute force. Do not use paid remote compute by default.
