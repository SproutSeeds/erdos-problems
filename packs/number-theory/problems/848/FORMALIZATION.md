# Erdos Problem #848 Formalization

This formalization packet promotes the current claim-pass recommendation into a concrete theorem-facing proof obligation anchored in canonical bridge evidence.

## Current State

- Formalization mode: `bridge_backed`.
- Current claim surface: `bridge_backed_frontier_support`.
- Active route: `finite_check_gap_closure`.
- Route summary: Convert the sufficiently-large-N theorem into a complete all-N resolution without overstating what is already closed or confusing imported thresholds with repo-owned claims.
- Next honest move: Write the theorem candidate and proof-obligation surface for the four-anchor obstruction.
- Latest verified interval: `1..10000`

## Current Target

- Formalization id: `p848_282_alignment_formalization_v1`.
- Focus id: `formalize_282_alignment`.
- Title: Formalize the 282 Obstruction Alignment
- Status: `in_progress`.
- Lane: `theorem_formalization`.
- Summary: The live 137720141 / 282 obstruction packet is checked at finite-menu scope; the remaining theorem work is the narrower symbolic-lift boundary.
- Candidate statement: Checked finite-menu statement: the shared-prefix obstruction represented at n=137720141 aligns with continuation tail 282 through the 841 witness class, with the 132-row lift and activation certificates replayed; a universal symbolic lift remains separate.
- Proof obligations: ready `1` / total `5`.
- Falsifier checks: ready `3` / total `3`.
- Promotion criteria: ready `0` / total `4`.

## Why This Exists

This packet exists to bridge the gap between search evidence and proof. Without it, the loop only says the alignment is suggestive; with it, the theorem lane gets an explicit object to prove, falsify, or narrow.

## Why Now

The canonical bridge freezes next unmatched representative 137720141, and the claim pass already marks its equality with the first failure of tail 282 as supported.

## Evidence Basis

- The canonical bridge records next unmatched representative 137720141.
- The tracked-tail matrix records continuation 282 failing first at 137720141.
- The live family menu supplies representative 137720141 with tuple key 4, 23^2, 7^2, 9, 17^2, 11^2 and tuple rows 7->4/1, 32->529/281, 57->49/6, 82->9/8, 132->289/81, 182->121/119.
- On that family-menu row, only continuation 282 fails among the tracked tails, and it does so via witness modulus 841.
- The strongest completed structured tail remains 332, so this packet isolates the 282 obstruction mechanism rather than conflating it with the current family-aware leader 432.
- The finite exact base is already certified through 1..10000, so the open work is structural rather than basic interval bookkeeping.
- Formalization-work checker p848_132_activation_row_certificate_checker_v1 replayed 17 activation rows with 0 failures.
- Formalization-work checker p848_132_lift_crt_checker_v1 proved the 132-row lift with k=147 and residue 504 mod 841.
- The top repair-class side packet is also checked: +2 finite-menu replay plus 74 mod-50 lane exchange rows pass.

## Proof Obligations

- `define_shared_prefix_obstruction_class`: done | Define the shared-prefix obstruction class precisely enough that the representative n=137720141 and the 282 continuation can be discussed in the same language. | Without a shared obstruction language, the current equality is still only a numerical coincidence. | discharge: Use the family-menu row language: shared-prefix tuple rows plus representative/modulus/residue plus tracked-tail repair rows.
- `explain_282_first_failure_mechanism`: done | Explain why the 282 continuation first fails on that obstruction class rather than merely sharing the same first failing n by accident. | This is the core mechanism claim that would upgrade the bridge fact into a theorem-facing lemma candidate. | discharge: Use the checked packet: p848_132_activation_row_certificate_checker_v1 plus p848_132_lift_crt_checker_v1 certify the finite-menu mechanism, while keeping the universal lift out of scope.
- `separate_alignment_from_leaderboard_artifacts`: done | Separate this obstruction-alignment claim from unrelated leaderboard behavior of 432, 782, and 832 so the statement stays narrow and honest. | The 282 packet should not inherit unsupported claims from the current repair-class leaderboard. | discharge: Freeze the local repair boundary: 282 fails on this class while 157, 232, 332, 382, 432, 782, 832 remain squarefree.
- `freeze_alignment_falsifier_boundary`: done | Record what extra bridge or exact evidence would count as a genuine falsifier of the alignment mechanism. | A theorem packet is more trustworthy when it names its own failure modes. | discharge: Bind the packet to the explicit falsifier boundary: a lower representative in the 841 witness class, a different first 282 witness, or bridge loss of the 137720141 <-> 282 alignment.
- `lift_132_activation_schema_beyond_finite_menu`: ready | Decide whether the checked finite-menu 132 activation schema can be lifted into a symbolic CRT lemma beyond the current family menu. | This is now the honest successor to the discharged 282 mechanism packet: the mechanism is checked finitely, but the universal theorem should not inherit it without a symbolic lift. | discharge: Prove parameterized tuple-row CRT hypotheses that force pre-132 misses, unique 132 target activation, and 182 preservation beyond the current finite menu.

## Falsifier Checks

- `bridge_next_unmatched_stability`: ready | A refreshed bridge no longer lists 137720141 as the next unmatched representative. | If the bridge frontier moves, the current packet may no longer be pointing at the right obstruction. | command: erdos number-theory bridge-refresh 848
- `tracked_tail_282_stability`: ready | A refreshed tracked-tail matrix no longer gives continuation 282 first failure 137720141. | The packet is only interesting if the 282-tail boundary stays synchronized with the shared-prefix representative. | command: erdos problem claim-pass-refresh 848
- `obstruction_class_mismatch`: ready | Packet replay or family-menu analysis shows that the shared-prefix representative and the 282 failure belong to different obstruction classes. | This would directly break the mechanism-level interpretation of the alignment. | command: erdos number-theory dispatch 848 --apply --action cpu_family_search

## Promotion Criteria

- `alignment_hook_survives`: done | The next_unmatched_equals_282_failure hook stays supported after refresh.
- `statement_is_mechanism_level`: done | The candidate statement is expressed as an obstruction-class alignment, not as a full theorem of closure.
- `mechanism_is_testable`: done | The packet identifies at least one mechanism-level explanation to test, not just a repeated equality of two numbers.
- `finite_menu_mechanism_checked`: done | The finite-menu 282 mechanism is checked by activation-row and CRT-lift replay certificates.

## Supporting Commands

- `erdos number-theory bridge-refresh 848`
- `erdos problem claim-pass-refresh 848`
- `erdos problem formalization-work 848`
- `erdos number-theory dispatch 848 --apply --action cpu_family_search`
- `erdos number-theory dispatch 848 --apply --action exact_followup_rollout`

## Commands

- Problem surface: `erdos problem show 848`
- Problem artifacts: `erdos problem artifacts 848`
- Theorem loop: `erdos problem theorem-loop 848`
- Claim loop: `erdos problem claim-loop 848`
- Claim pass: `erdos problem claim-pass 848`
- Formalization: `erdos problem formalization 848`
- Formalization refresh: `erdos problem formalization-refresh 848`
- Formalization work: `erdos problem formalization-work 848`
- Formalization work refresh: `erdos problem formalization-work-refresh 848`
- Source refresh: `erdos number-theory bridge-refresh 848`

## Sources

- packProblemDir: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848`
- formalizationJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/FORMALIZATION.json`
- formalizationMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/FORMALIZATION.md`
- theoremLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/THEOREM_LOOP.json`
- theoremLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/THEOREM_LOOP.md`
- claimLoopJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/CLAIM_LOOP.json`
- claimLoopMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/CLAIM_LOOP.md`
- claimPassJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/CLAIM_PASS.json`
- claimPassMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/CLAIM_PASS.md`
- legacyBridgeJsonPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SEARCH_THEOREM_BRIDGE.json`
- legacyBridgeMarkdownPath: `/Volumes/Code_2TB/code/erdos-problems/packs/number-theory/problems/848/SEARCH_THEOREM_BRIDGE.md`
