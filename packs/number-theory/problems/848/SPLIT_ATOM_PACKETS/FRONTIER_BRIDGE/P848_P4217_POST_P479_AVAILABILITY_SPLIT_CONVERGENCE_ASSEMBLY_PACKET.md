# P848 p4217 post-p479 availability split convergence assembly

- Status: post_p479_availability_split_convergence_assembly_selects_available_residue_bulk_cover
- Target: run_p848_convergence_assembly_after_p479_availability_split_and_q127_child_emission
- Recommended next action: bulk_cover_p848_p4217_p443_q97_p479_available_residue_square_obstructions_or_emit_survivor_boundary
- Verification command: `node --check src/runtime/theorem-loop.js && node --check src/runtime/problem-progress.js && node --test test/p848-282-alignment-obstruction-packet.test.js`

## Assembled facts

- The p443 split exposed the selected q97 square-obstruction child plus a remaining p443-unavailable complement.
- The p151 route is ledgered as a local/free exact-certification blocker for this q97 child.
- The p479 reserve is exact-certified as a squarefree representative repair.
- The p479 availability split consumes the finite 479^2 token:
  - `k_479(w) = (131596*w + 250) mod 229441`
  - available residues: 1140
  - unavailable residues: 228301
- The first p479-available residue family `w = 229441*z` has a deterministic `127^2` obstruction with roots `4391` and `15510`.

## Frontier comparison

- Previous open frontier count: 35
- Current open frontier count: 38
- Delta: +3

This growth is expected after the finite split exposed explicit children, but it is not global convergence. The guard therefore forbids q127 repair descent until a bulk, structural, or ranked handoff is recorded.

## Selected handoff

Run a finite bulk square-obstruction screen over all 1140 p479-available residue classes modulo 479^2.

This covers the whole p479-available selector family, not the first q127 child alone. If every available residue is square-obstructed by a recorded q^2 class, emit the cover packet. If not, emit a deterministic survivor-boundary packet naming the uncovered residue list, checked q-prime bound, and next structural denominator.

## Boundary

This packet does not perform the bulk cover, close the q127 child, close q127-avoiding p479-available residues, close the p479-unavailable complement, close the q97 child, close the p443-unavailable complement, close the wider p4217 complement, prove collision-free matching, or decide Problem 848.
