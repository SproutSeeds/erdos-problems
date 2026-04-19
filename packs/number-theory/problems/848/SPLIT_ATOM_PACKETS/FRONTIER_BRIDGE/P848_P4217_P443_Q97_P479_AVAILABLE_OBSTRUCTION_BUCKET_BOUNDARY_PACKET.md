# P848 p4217/p443/q97/p479 Obstruction Bucket Boundary

Generated: 2026-04-17T13:36:44.553Z
Status: p479_available_obstruction_buckets_compressed_to_terminal_and_partial_boundaries

## Summary
- Input buckets: 30
- Total p479-available residue rows: 1140
- Terminal full-family buckets: 19 (422 rows)
- Partial two-root buckets: 10 (367 rows)
- Partial root children: 734
- Partial q-avoiding classes: 5564177
- Nonuniform buckets: 1

## Token Transition
- Consumed: p443_q97_p479_available_obstruction_prime_buckets
- Produced: p443_q97_p479_terminal_full_family_square_obstruction_buckets (terminally_closed_at_bucket_boundary); p443_q97_p479_partial_two_root_obstruction_bucket_boundaries (partial_boundaries_open_no_singleton_descent_selected); p443_q97_p479_nonuniform_obstruction_bucket_boundaries (deterministic_successor_boundary_needed)

## Bucket Table
| q | rows | mode | root children | q-avoiding classes | status |
|---:|---:|---|---:|---:|---|
| 2 | 285 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 3 | 94 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 7 | 15 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 11 | 7 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 13 | 5 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 17 | 3 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 19 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 23 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 29 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 31 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 37 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 43 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 53 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 59 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 67 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 71 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 89 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 97 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 101 | 1 | terminal_full_family_square_obstruction | 0 | 0 | terminally_closed_by_full_family_square_obstruction |
| 109 | 351 | nonuniform_bucket_boundary | 0 | 0 | nonuniform_boundary_requires_manual_successor |
| 113 | 178 | partial_two_root_square_obstruction_children | 356 | 2272526 | partial_boundary_emitted_root_children_and_q_avoiding_complement_open |
| 127 | 97 | partial_two_root_square_obstruction_children | 194 | 1564319 | partial_boundary_emitted_root_children_and_q_avoiding_complement_open |
| 131 | 48 | partial_two_root_square_obstruction_children | 96 | 823632 | partial_boundary_emitted_root_children_and_q_avoiding_complement_open |
| 137 | 14 | partial_two_root_square_obstruction_children | 28 | 262738 | partial_boundary_emitted_root_children_and_q_avoiding_complement_open |
| 139 | 15 | partial_two_root_square_obstruction_children | 30 | 289785 | partial_boundary_emitted_root_children_and_q_avoiding_complement_open |
| 149 | 9 | partial_two_root_square_obstruction_children | 18 | 199791 | partial_boundary_emitted_root_children_and_q_avoiding_complement_open |
| 151 | 2 | partial_two_root_square_obstruction_children | 4 | 45598 | partial_boundary_emitted_root_children_and_q_avoiding_complement_open |
| 157 | 2 | partial_two_root_square_obstruction_children | 4 | 49294 | partial_boundary_emitted_root_children_and_q_avoiding_complement_open |
| 163 | 1 | partial_two_root_square_obstruction_children | 2 | 26567 | partial_boundary_emitted_root_children_and_q_avoiding_complement_open |
| 173 | 1 | partial_two_root_square_obstruction_children | 2 | 29927 | partial_boundary_emitted_root_children_and_q_avoiding_complement_open |

## Boundary
This packet compresses the p479-available obstruction-prime buckets into terminal full-family closures, exact partial bucket boundaries, and one exact q109 nonuniform bucket boundary. It does not close the q109 nonuniform bucket, the 10 partial buckets, their q-avoiding complements, the p479-unavailable complement, the q97 child, the p443-unavailable complement, the wider p4217 complement, or Problem 848.

## Next Action
- run_p848_convergence_assembly_after_p479_obstruction_bucket_boundaries: Assemble the post-bucket-boundary frontier and choose the next bulk, structural, or ranked handoff before any q-child singleton descent.
