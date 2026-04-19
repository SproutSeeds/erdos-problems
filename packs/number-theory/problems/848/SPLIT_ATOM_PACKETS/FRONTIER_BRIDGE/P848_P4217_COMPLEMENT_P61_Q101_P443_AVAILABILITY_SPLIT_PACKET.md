# Problem 848 p4217 Complement p61/q101 p443 Availability Split

This packet splits the exact-certified p443 representative repair over the selected p61/q101 child. It does not treat the representative as subclass coverage.

## Source

- Source child: `t == 121075312471178 mod 675009087397969`
- Source parameter: `v`
- Source left class: `left == 486498922978003120137482190528915923361118218280393901731215929409345512449172580645681381785657 mod 2712288635205048649747664011117929144880624281851945987471741427034114118918054256500369780916900`
- Repair handoff: `P848_P4217_COMPLEMENT_P61_Q101_P443_REPAIR_HANDOFF_PACKET.json`
- p443 representative status: `exact_squarefree`

## Availability Split

- Endpoint: `p=443`
- Period: `443^2 = 196249`
- Window: `28500`
- `maxK = floor((28500 - 14) / 25) = 1139`
- Endpoint formula: `k_443(left) = (7850*left + 100286) mod 196249`
- Source formula: `k_443(v) = (159890*v + 1029) mod 196249`
- `gcd(159890, 196249) = 1`, so this is an exact residue permutation.
- Available residues per source row: `1140`
- Unavailable residues per source row: `195109`
- First available residue: `v=0`, `k=1029`
- First unavailable residue: `v=1`, `k=160919`

## First Available Family

The first p443-available family is:

- `v = 196249*u`
- `t == 121075312471178 mod 132469858392764018281`
- `left == 486498922978003120137482190528915923361118218280393901731215929409345512449172580645681381785657 mod 532283932370355592464329314517882476753677634689162548095341783314017861723549229783941069135160708100`
- p443 endpoint: `k=1029`, `delta=-25739`, so `right = left - 25739`

## First Square Obstruction

Auditing square divisors over the first available family finds no root for prime squares through `89^2`. The first obstruction appears at `97^2 = 9409`:

- Roots modulo `9409`: `6480`, `9170`
- Selected root: `u == 6480 mod 9409`
- Lifted class: `t == 858404682506186150932058 mod 1246408897617516648005929`
- Lifted left class: `left == 3449199882246403162146857078213360639892746996146891529938208657606051673377944521449110708641522770273657 mod 5008259519672675769496874520298756223775352864790330415029070839201594060956874703037101519492727102512900`
- Witness: `97^2 | left*(left - 25739)+1`

The exact-certified representative is not invalidated: at `u=0`, the p443 cross product is `4681 mod 9409`.

## Boundary

This packet proves the p443 availability split and emits the first q97 square-obstruction child. It does not close the q97 child, the q97-avoiding part of the first p443-available family, the p443-unavailable residues, the q101-avoiding part of the p61 branch, other p61-available CRT families, the p61-unavailable complement, collision-free matching, or Problem 848.

## Next Action

`resolve_p848_p4217_complement_p61_q101_p443_q97_square_obstruction_child`
