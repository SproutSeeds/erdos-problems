# P848 Exact 1..40500 Compact Promotion

Generated: `2026-04-17T09:38:52Z`

## Promotion

The existing exact small-`N` rollout is promoted as public compact verifier evidence for `1..40500`.

This does not promote the 440 MB raw result packet as a committed public raw packet. The public raw exact interval remains `1..10000`.

## Audited Inputs

- Raw local result: `output/p848-exact-small-n-rollouts/EXACT_SMALL_N_1_40500_RESULTS.json`
- Raw result size: `440 MB`
- Verified SHA-256: `da3546ab3f30faef879c2d4da680f826711361e2c685de8f384eb116df1f8fbc`
- Compact certificate: `output/p848-exact-small-n-rollouts/EXACT_SMALL_N_1_40500_CERTIFICATE.md`
- Breakpoint scout: `packs/number-theory/problems/848/EXACT_BREAKPOINT_SCOUT.json`
- Breakpoint certificate: `packs/number-theory/problems/848/EXACT_BREAKPOINT_CERTIFICATE.json`

## Compact Certificate Review

- Interval: `1..40500`
- Rows: `40500`
- Endpoint checks: `1621`
- Failed endpoint checks: `0`
- Compression ratio: `24.98457742134485`
- Contiguous from one: `true`

## Claim Rule

Use `1..10000` for committed public raw exact-result coverage.

Use `1..40500` only when citing this compact promotion packet, the compact breakpoint certificate, and the verified raw-result hash.

## Boundary

This packet promotes the existing 1..40500 exact small-N rollout only as public compact verifier evidence. It does not commit or bundle the 440 MB raw result, does not make 1..40500 a public raw packet, does not start a 40501+ rollout, does not prove the top repair-class coverage theorem, and does not decide Problem 848.

## Next Action

Audit the promoted 1..40500 compact endpoint certificate for theorem-facing boundary information that can feed the top repair-class/mod-50 coverage theorem; if it yields no relevant boundary, emit a no-boundary packet before considering any 40501+ rollout.

Verification command:

`node --test test/p848-282-alignment-obstruction-packet.test.js`
