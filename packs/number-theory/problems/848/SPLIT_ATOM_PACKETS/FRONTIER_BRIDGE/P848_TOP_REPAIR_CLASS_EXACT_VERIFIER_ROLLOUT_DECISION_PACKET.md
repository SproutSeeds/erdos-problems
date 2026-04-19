# P848 Top Repair-Class Exact Verifier Rollout Decision

Generated: `2026-04-17T09:31:52Z`

## Decision

Choose `promote_p848_exact_40500_compact_rollout_certificate_after_top_repair_handoff`.

The top repair-class packet has done its finite-menu job, but it leaves a verifier/coverage boundary. The canonical exact rollout action is not ready: `exact_followup_rollout` reports no valid ready range. The interval queue instead says:

- public raw exact packet: `1..10000`
- local unpromoted exact rollout: `10001..40500`
- next deferred exact interval: `40501..?`

So the next verifier move is not a fresh rollout. It is to promote or block the existing compact `1..40500` certificate surface.

## Evidence

- Top repair source: `SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_TOP_REPAIR_CLASS_MECHANISM_PACKET.json`
- Local compact certificate: `output/p848-exact-small-n-rollouts/EXACT_SMALL_N_1_40500_CERTIFICATE.md`
- Local raw result hash: `da3546ab3f30faef879c2d4da680f826711361e2c685de8f384eb116df1f8fbc`
- Local raw result size: `about 440 MB`
- Breakpoint summary interval: `1..40500`
- Endpoint checks in compact certificate: `1621`
- Projected endpoint checks to imported threshold: `10,566,518,518,518,119`

## Rejected Immediate Routes

1. Coverage theorem now: the mod-50/strict handoff is still finite-menu guidance, not all relevant square-witness coverage.
2. New exact rollout now: the dispatch surface reports no ready exact-small-N range.
3. Exact-only threshold closure: the projected endpoint-check count is too large to be a theorem plan.
4. GPU/frontier sweep here: this step is a verifier/coverage decision, and no paid or remote compute is needed.

## Boundary

This decision packet only chooses and bounds the next verifier-side move after the top repair-class handoff. It does not promote the 1..40500 interval by itself, does not prove the mod-50/strict-handoff coverage theorem, does not start new exact compute, does not close p4217/q97/p479 complements, and does not decide Problem 848.

## Next Action

Promote or block the existing compact 1..40500 exact-rollout certificate as public compact verifier evidence, explicitly preserving public raw coverage at 1..10000 and replaying any resulting boundary against the top repair-class schema before any 40501+ rollout.

Verification command:

`node --test test/p848-282-alignment-obstruction-packet.test.js`
