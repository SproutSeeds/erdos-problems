# Problem 857 Evidence

## Canonical status

- site status: open
- repo status: active
- formalization status: active
- active route: `anchored_selector_linearization`
- route breakthrough: yes
- problem solved: no

## Public route record

The public pack supports an honest progress claim, not a solved-problem claim.
The current frontier note states that the weak-sunflower pack is no longer
bottlenecked on generic counting closure and that the live public seam is the
anchored-selector linearization route.

The atomic board further records that:
- `T10` is the active ticket for problem `857`
- the ticket leaf `anchored_selector_linearization_realized` is still open
- current public progress on `T10` is `2/5` gates and `9/15` atoms
- the first dependency-satisfied ready atom is `T10.G3.A2`

## Closed public support layers

The route history and ops packet identify the following layers as closed public
support beneath the live frontier:
- `global_family_card_export`
- `explicit_remainder_export`
- `explicit_M_remainder_export`
- `o1a_existential_explicit_export`

The strongest closed support layer immediately below the active frontier is
`o1a_existential_explicit_export`, recorded as a strict-closed route in
`packs/sunflower/problems/857/OPS_DETAILS.yaml`.

## Computational artifact

The current public compute packet is:
- `packs/sunflower/compute/857/m8_exactness_cube_and_certificate_v0.yaml`

Its scope is narrow and explicit:
- question: whether `M(8,3) = 45`, equivalently whether the target-46 SAT instance is UNSAT
- claim-level goal: exact
- status: `ready_for_local_scout`
- next honest move: local scout first, before any paid rung

This packet is evidence packaging only. It is not, by itself, a published proof
of any asymptotic statement about `m(n,k)`.

## Honest publication posture

The current public record supports the following manuscript posture:
- present problem `857` as open
- describe the active route as `anchored_selector_linearization`
- describe the strongest finished support layer as `o1a_existential_explicit_export`
- describe the current compute posture as a local-scout-ready exact packet for `M(8,3)`
- keep the open seam visible: promote the helper/theorem stack into `anchored_selector_linearization_realized`
