# P848 p4217 p443/q97 p479 available residue bulk cover

- Status: all_p479_available_residue_classes_have_square_obstruction_child
- Target: bulk_cover_p848_p4217_p443_q97_p479_available_residue_square_obstructions_or_emit_survivor_boundary
- Source split: `P848_P4217_COMPLEMENT_P61_Q101_P443_Q97_P479_AVAILABILITY_SPLIT_PACKET.json`
- Verification command: `node packs/number-theory/problems/848/compute/problem848_p479_available_residue_bulk_cover.mjs --pretty`

## Result

The finite p479-available residue set has been fully classified at the parent-residue level:

- Endpoint: `p = 479`
- Period: `479^2 = 229441`
- Available residues checked: `1140`
- Covered residues: `1140`
- Survivor residues: `0`
- Max checked prime: `2000`
- Max obstruction prime needed: `173`
- Obstruction-prime buckets: `30`

The first row matches the previously emitted p479 split:

- Residue: `0`
- k: `250`
- delta: `-6264`
- obstruction: `127^2 = 16129`
- roots modulo `127^2`: `4391, 15510`

## Histogram

| q | q^2 | residue classes |
| --- | ---: | ---: |
| 2 | 4 | 285 |
| 3 | 9 | 94 |
| 7 | 49 | 15 |
| 11 | 121 | 7 |
| 13 | 169 | 5 |
| 17 | 289 | 3 |
| 19 | 361 | 1 |
| 23 | 529 | 1 |
| 29 | 841 | 1 |
| 31 | 961 | 1 |
| 37 | 1369 | 1 |
| 43 | 1849 | 1 |
| 53 | 2809 | 1 |
| 59 | 3481 | 1 |
| 67 | 4489 | 1 |
| 71 | 5041 | 1 |
| 89 | 7921 | 1 |
| 97 | 9409 | 1 |
| 101 | 10201 | 1 |
| 109 | 11881 | 351 |
| 113 | 12769 | 178 |
| 127 | 16129 | 97 |
| 131 | 17161 | 48 |
| 137 | 18769 | 14 |
| 139 | 19321 | 15 |
| 149 | 22201 | 9 |
| 151 | 22801 | 2 |
| 157 | 24649 | 2 |
| 163 | 26569 | 1 |
| 173 | 29929 | 1 |

## Boundary

This packet classifies every p479-available residue class by a first square-obstruction child. It does not close those square-obstruction children, does not close q127-avoiding subfamilies inside a residue class, does not close the p479-unavailable complement, does not close the q97 child, does not close the p443-unavailable complement, does not close the wider p4217 complement, and does not decide Problem 848.

## Next move

Compress the 30 obstruction-prime buckets into theorem-facing families, or emit exact bucket-boundary packets. Do not descend into one q127 child as a singleton.
