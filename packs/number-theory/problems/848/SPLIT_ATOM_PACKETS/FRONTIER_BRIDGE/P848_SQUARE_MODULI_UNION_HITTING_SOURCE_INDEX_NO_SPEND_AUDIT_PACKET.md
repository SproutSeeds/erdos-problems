# P848 square-moduli union/hitting source-index no-spend audit

- Status: `square_moduli_union_hitting_source_index_no_spend_audit_emitted_no_promotable_source_found`
- Target: `execute_p848_square_moduli_union_hitting_source_index_no_spend_audit`
- Recommended next action: `prepare_p848_square_moduli_union_hitting_source_import_profile_or_approval_blocker`
- Paid/API call made: `false`

## Verdict

- Source theorem found: `false`
- Missing theorem: A source theorem, importable reference, or repo-owned proof giving an upper bound for square-moduli union/hitting sets with Sawhney-compatible hypotheses, inequality direction, constants, and a threshold handoff that can be audited before any all-N recombination.
- Candidate-note boundary: The local Sawhney explicitization notes support a candidate large-N stability package, but they do not import a new square-moduli union/hitting theorem that closes the finite gap below the threshold or repairs the Tao-van-Doorn avoiding-side shortcut.

## Audit Command

`rg -n "(union|hitting|large sieve|square moduli|Tao|van Doorn|Sawhney|Appendix A|Theorem 16|avoiding)" packs/number-theory/problems/848 docs src test`

## Source Categories

### tvd_avoiding_side_and_direction_blockers

- Matched files: `215`
- Matches: `4894`
- Promotable source found: `false`
- Interpretation: These hits preserve the already-audited avoiding-set direction: Tao-van-Doorn bounds avoiding sets, and complement duality only gives a hitting lower bound.

### sawhney_explicitization_candidate_surfaces

- Matched files: `7`
- Matches: `66`
- Promotable source found: `false`
- Interpretation: These are local Sawhney explicitization/candidate notes. They do not import a new square-moduli union/hitting theorem strong enough to close the current all-N gap, and they explicitly avoid claiming a solved threshold handoff.

### prior_source_gap_and_no_go_packets

- Matched files: `45`
- Matches: `419`
- Promotable source found: `false`
- Interpretation: These hits are prior no-go, residual, backlog, and source-recovery surfaces. They certify boundaries rather than supplying the missing theorem.

### finite_or_test_scaffolding

- Matched files: `141`
- Matches: `1225`
- Promotable source found: `false`
- Interpretation: These hits are finite endpoint artifacts, generated task/progress wiring, or tests. They are not a source theorem with audited hypotheses/constants.

## Next Profile Seed

- Profile ID: `p848-square-moduli-union-hitting-source-import-single`
- Step: `prepare_p848_square_moduli_union_hitting_source_import_profile_or_approval_blocker`
- Question: Problem 848 square-moduli union/hitting source-import theorem: identify a source theorem or proof giving Sawhney-compatible upper bounds for the union/hitting side of square obstruction classes modulo p^2, with explicit direction, hypotheses, constants, and threshold relevance. Reject avoiding-set-only Tao-van-Doorn readings, threshold claims without constants, and bounded finite evidence as all-N proof.

## Forbidden Moves

- execute_provider_source_import_under_current_no_spend_instruction
- claim_a_tao_van_doorn_threshold_collapse_from_avoiding_side_evidence
- claim_N0_around_1e6_or_N0_at_most_40500
- claim_problem_848_decided
- resume_q193_q197_singleton_descent
- launch_q193_q389_or_larger_q_cover_without_new_theorem
- emit_a_naked_deterministic_rank_boundary
- try_fallback_selectors_one_by_one
- treat_repo_explicit_candidate_notes_as_finite_all_N_closure

## Boundary

This packet completes the no-spend square-moduli union/hitting source-index audit. The local index contains Tao-van-Doorn avoiding-side evidence, Sawhney explicitization candidate notes, finite/test scaffolding, and prior no-go/source-gap packets, but no promotable source theorem giving the required union/hitting upper-bound direction with audited hypotheses/constants and finite handoff. It does not execute a provider call, lower an analytic threshold, prove all-N recombination, or decide Problem 848.
