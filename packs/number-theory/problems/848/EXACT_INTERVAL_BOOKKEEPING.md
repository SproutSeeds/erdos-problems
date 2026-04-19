# Problem 848 Exact Interval Bookkeeping

This note fixes the claim boundary between public repo artifacts, local rollout artifacts, and npm package contents.

## Current distinction

- Public repo raw exact packet: `1..10000`
  - Certificate: `EXACT_SMALL_N_1_10000_CERTIFICATE.md`
  - Raw result packet: `EXACT_SMALL_N_1_10000_RESULTS.json`
  - Result SHA-256: `96748efe7a355621016f4987209e1b634b1d14ac3f79f135dcc3a0a55a3dfcb2`
- Local ignored rollout: `1..40500`
  - Certificate: `output/p848-exact-small-n-rollouts/EXACT_SMALL_N_1_40500_CERTIFICATE.md`
  - Raw result packet: `output/p848-exact-small-n-rollouts/EXACT_SMALL_N_1_40500_RESULTS.json`
  - Result SHA-256: `da3546ab3f30faef879c2d4da680f826711361e2c685de8f384eb116df1f8fbc`
  - Raw result size: about `440 MB`
- Public compact evidence:
  - Interval: `1..40500`
  - Promotion packet: `SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_EXACT_40500_COMPACT_PROMOTION_PACKET.json`
  - Boundary audit packet: `SPLIT_ATOM_PACKETS/FRONTIER_BRIDGE/P848_EXACT_40500_ENDPOINT_BOUNDARY_AUDIT_PACKET.json`
  - Claim level: compact verifier evidence, not a committed public raw packet

## Claim rule

Use `1..10000` when referring to the public repo raw exact packet. Use `1..40500` only when it is explicitly described as public compact evidence via the promotion packet, compact breakpoint/endpoint derivatives, the verified raw-result hash, and the endpoint boundary audit.

Do not say that npm bundles either raw exact interval packet. The npm package intentionally excludes raw exact small-`N` result JSON.

## Boundary audit rule

The endpoint boundary audit found that the top repair-class lane `32 mod 50` is aligned with certified exact breakpoint rows through `40500`, including the top tie and same-lane contrasts. It also found no failed endpoint check, no row failure, and no top-specific coverage boundary.

So `1..40500` may support the mod-50 lane theorem as a finite base, but it does not by itself prove square-witness coverage or justify a blind `40501+` rollout.

## Next research use

Use the promoted and boundary-audited compact 1..40500 evidence as finite-base support for a mod-50 lane breakpoint coverage theorem; if the square-witness hypotheses cannot cover the lane, emit a hypotheses blocker before any 40501+ rollout.
