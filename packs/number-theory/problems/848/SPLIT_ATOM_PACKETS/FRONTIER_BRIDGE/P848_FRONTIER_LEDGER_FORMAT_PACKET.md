# Problem 848 Frontier Ledger Format Packet

Generated: 2026-04-17T05:23:28Z

## Scope

This packet turns the current p4217/q61 blocker/open leaf into a theorem-facing frontier ledger format. It is a compression object, not another endpoint sibling.

Source open leaf:

`packs/number-theory/problems/848/SPLIT_ATOM_PACKETS/DYNAMIC_MARGIN_PROOFS/P848_q17_p4217_q61_factorization_blocker_open_leaf.json`

## Entry Kinds

- `local_staircase_evidence`: observed repair/split/certificate chain evidence; not global closure.
- `availability_partition`: exact residue partition from an affine endpoint rule `k_p(t) mod p^2` and a fixed window.
- `available_child`: first available residue-family child emitted by a partition.
- `unavailable_complement`: residues outside the current endpoint window that still need cover, impossibility, or open-leaf accounting.
- `factorization_boundary`: repair candidates exist but exact squarefree certification is incomplete.
- `repair_candidate`: a trial-squarefree endpoint that may become a repair only after exact certification.
- `blocker_open_leaf`: a boundary deliberately ledgered as open/blocking rather than overclaimed.
- `repair_handoff`: an exact-squarefree representative repair plus its required availability/lift successor obligation.
- `square_obstruction_child`: a deterministic lifted child where `q^2` divides the relevant endpoint product.

## Proposed Measure

`open_frontier_obligation_count`

Count open complements, available children, exact-factor boundaries, uncertified repair candidates, blocker/open leaves, and blocked leaves. Do not count observed evidence, exact-certified repair handoffs, or deterministic square-obstruction emissions as closure unless their successor obligations are also ledgered.

This measure is defined here but not yet proved decreasing.

## Transition Rule Spec

`p848_frontier_transition_rule_v0`

Each ledger transition must either close an obligation, replace it by a finite set of strictly smaller typed obligations under an explicit rank, or mark it as a blocker/open leaf without claiming all-N closure.

Required cases:

- `availability_partition`: prove available residues plus unavailable complement partition the source class exactly, then account for both children.
- `repair_handoff`: require an exact squarefree factor certificate before any repair handoff creates an availability split or symbolic lift.
- `square_obstruction_child`: record the exact CRT/lifted class and square divisor `q^2`.
- `factorization_boundary_to_blocker`: when exact local certification is infeasible, route the leaf to `blocker_open_leaf` and preserve all failed bounded routes without proving candidate failure.
- `unavailable_complement`: either prove a separate cover/impossibility mechanism or keep the complement as an explicit open ledger leaf.

## Current Instantiation

- Blocker/open leaf: p4217/q61.
- Available partition source: `P848_q17_p107_q89_p4217_availability_split.json`.
- Unavailable complement size: `17781949` residues.
- Available child: `t == 42163704019 mod 66170874169` with `61^2` obstruction.
- Blocker candidates: p97 and p227.

## Boundary

This packet defines the ledger format. It does not prove the transition rule, does not close the unavailable complement, does not prove p97 or p227 fail, and does not decide Problem 848.

## Next Action

Prove `p848_frontier_transition_rule_v0` or refine the rank until every ledger transition is closed, decreasing, or explicitly blocking.
