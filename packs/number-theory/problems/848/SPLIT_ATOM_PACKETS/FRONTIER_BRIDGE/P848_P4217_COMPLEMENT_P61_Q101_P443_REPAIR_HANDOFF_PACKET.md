# P848 p4217 Complement p61/q101 p443 Repair Handoff

Status: `representative_p443_repair_found_availability_split_needed`

Generated: 2026-04-17T06:35:59Z

## Source Child

- `t == 121075312471178 mod 675009087397969`
- `left == 486498922978003120137482190528915923361118218280393901731215929409345512449172580645681381785657 mod 2712288635205048649747664011117929144880624281851945987471741427034114118918054256500369780916900`

## Exact p443 Repair

The selected p61/q101 representative is repaired by p443:

- endpoint p443
- `k=1029`
- `delta=-25739`
- `right == 486498922978003120137482190528915923361118218280393901731215929409345512449172580645681381759918`
- `right == 18 mod 25`

The factor certificate proves

`left*right+1 = 809 * 341321 * 1408574789 * 608516451863859881854682780387361090418542865904642619902852366647063847133067629242628904323681308963523905097941593667349866460600578701037569830109549835977166633958193187`

with every exponent equal to 1 and every factor prime by local SymPy `isprime`.

## Availability Split Plan

On the p61/q101 source parameter `v`,

`k_443(v) = (159890*v + 1029) mod 196249`.

The coefficient is coprime to `443^2`, so the p443 selector permutes residues modulo `443^2`. With window `28500`, `maxK=1139`, giving:

- p443-available residues per source row: `1140`
- p443-unavailable residues per source row: `195109`
- representative residue: `v=0`, `k=1029`, available
- first unavailable residue: `v=1`, `k=160919`

## Boundary

This is an exact representative repair, not a subclass proof. The next theorem move is to split the p61/q101 child by p443 availability before claiming coverage.

Next action: `split_p848_p4217_complement_p61_q101_child_by_p443_availability`.
