# Limitations and Open Problems

The most important limitation is straightforward: problem `857` is still open.
This paper records route structure and evidence boundaries, not a completed
solution.

## Near-term route limitations

- The active leaf `anchored_selector_linearization_realized` is not yet publicly closed.
- Ticket `T10` is still open, with the public board placing the live pressure in
  gate `G3`.
- The next named move, `T10.G3.A2`, has been localized but not yet discharged in
  the public pack.
- The route packet still describes the frontier as recurrence-facing rather than
  recurrence-complete.

## Evidence limitations

- The closed support layer beneath the frontier is organizationally strong, but
  the public bundle does not yet expose the full theorem text needed to promote
  the active leaf.
- The current formalization posture is active without being a public end-to-end
  formal proof.
- The `M(8,3)` compute packet is valuable but narrow; it does not settle the
  asymptotic weak sunflower problem.

## Broader mathematical open problems

- Determine the correct asymptotic growth of `m(n,k)` for fixed `k`.
- Understand whether the strongest current `k = 3` methods can be extended in a
  way that meaningfully informs larger `k`.
- Clarify how far uniform-sunflower spread and coding methods can be transferred
  into genuinely non-uniform weak-sunflower settings.
- Relate the weak sunflower route more tightly to adjacent three-way difference
  problems without losing the problem-specific structure of `857`.

## Concrete next handoff

If one stays faithful to the current public record, the next move is not vague:
promote the helper/theorem stack into
`anchored_selector_linearization_realized`, checkpoint that leaf honestly, and
only then revisit whether the route can be upgraded from frontier progress to a
stronger public claim.
