# Problem 848 Exact Interval Bookkeeping

This note fixes the claim boundary between public repo artifacts, local rollout
artifacts, and npm package contents.

## Current distinction

- Public repo raw exact packet: `1..10000`
  - Certificate: `EXACT_SMALL_N_1_10000_CERTIFICATE.md`
  - Raw result packet: `EXACT_SMALL_N_1_10000_RESULTS.json`
  - Result SHA-256:
    `96748efe7a355621016f4987209e1b634b1d14ac3f79f135dcc3a0a55a3dfcb2`
- Local ignored rollout: `1..40500`
  - Certificate: `output/p848-exact-small-n-rollouts/EXACT_SMALL_N_1_40500_CERTIFICATE.md`
  - Raw result packet: `output/p848-exact-small-n-rollouts/EXACT_SMALL_N_1_40500_RESULTS.json`
  - Result SHA-256:
    `da3546ab3f30faef879c2d4da680f826711361e2c685de8f384eb116df1f8fbc`
  - Raw result size: about `440 MB`
- Committed compact derivatives from the local rollout:
  - `EXACT_BREAKPOINT_SCOUT.json`
  - `EXACT_BREAKPOINT_CERTIFICATE.json`

## Claim rule

Use `1..10000` when referring to the public repo's committed raw exact packet.
Use `1..40500` only when it is explicitly described as a local ignored rollout
or as compact breakpoint/endpoint evidence derived from that local rollout.

Do not say that npm bundles either raw exact interval packet. The npm package
intentionally excludes raw exact small-`N` result JSON.

## Promotion rule

To promote `1..40500` from local rollout evidence into a public compact interval
claim, commit a compact certificate surface that includes:

- the interval and method class
- the raw local result hash
- the reproduction command family
- the compact endpoint certificate used for review
- an explicit note that the 440 MB raw packet is not committed or bundled

Until that promotion is complete, user-facing status should say:

`public raw exact packet: 1..10000; local compact rollout evidence: 1..40500`.

## Next research use

The `1..40500` rollout is useful as regression and structure-mining evidence.
It should not distract from the current theorem lane: prove the four-anchor
obstruction or the split-core symbolic matching lift that can replace raw
interval extension.
