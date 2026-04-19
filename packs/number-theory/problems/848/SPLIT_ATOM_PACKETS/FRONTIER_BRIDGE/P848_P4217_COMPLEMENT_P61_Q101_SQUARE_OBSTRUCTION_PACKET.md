# P848 p4217 Complement p61/q101 Square Obstruction

Status: `p4217_complement_p61_first_child_q101_square_obstruction_emitted`

The p61 availability-refinement packet records the first p61-available CRT child of the p4217 complement:

`t == 48783616077 mod 66170874169`.

On this child, `k61 = 1014`, so the p61 endpoint is

`right = left - 25364`.

## q101 Roots

Writing

`t = 48783616077 + 66170874169*u`,

direct modular evaluation of `left*(left - 25364)+1` modulo `101^2` gives roots

`u == 1829, 2811 mod 10201`.

Selecting the first root gives the deterministic child

`t == 121075312471178 mod 675009087397969`.

The corresponding left congruence is

`left == 486498922978003120137482190528915923361118218280393901731215929409345512449172580645681381785657 mod 2712288635205048649747664011117929144880624281851945987471741427034114118918054256500369780916900`.

Checks:

- `t mod 4217^2 = 4602950`
- `t mod 61^2 = 6`
- `k4217 = 1140`
- `k61 = 1014`
- `left*(left - 25364)+1 == 0 mod 101^2`

## Boundary

This packet emits the first q101 square-obstruction child inside the first p61-available CRT family. It does not resolve the q101-obstruction child, the q101-avoiding part of that family, the other p61-available CRT families, the p61-unavailable complement, collision-free matching, or Problem 848.

Next action: `resolve_p848_p4217_complement_p61_q101_square_obstruction_child`.
