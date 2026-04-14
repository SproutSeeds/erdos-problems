# Computational and Formal Evidence

The public bundle for problem `857` is formalization-aware, but it is not yet a
public formal proof archive for the full weak sunflower problem. The formalization
record is currently:
- status: active
- active route: `anchored_selector_linearization`
- upstream theorem-module references:
  `SunflowerLean/ObstructionGlobalBridge.lean` and
  `SunflowerLean/ObstructionExport.lean`

This means that the public pack knows where theorem and verification work is
supposed to interface with the route, but it does not yet expose a complete
repo-local theorem chain proving the asymptotic target.

The current compute surface is even narrower. The only packaged compute lane is
`m8_exactness_cube_and_certificate_v0.yaml`, which asks whether `M(8,3) = 45`,
equivalently whether a target-46 SAT instance is UNSAT. Its metadata is precise:
- claim-level goal: exact
- status: `ready_for_local_scout`
- recommendation: `cpu_first`
- approval required: yes
- next honest move: local scout before any paid rung

Two boundaries are important.

First, the compute lane concerns a finite exact question. Even if fully certified,
it would not by itself imply an asymptotic formula for `m(n,k)`.

Second, the route packets and formalization references help organize and check the
current frontier, but they do not yet authorize a claim that problem `857` is
formally solved. The correct reading is that proof surface, formalization surface,
and compute surface are all active, but they remain distinct.
