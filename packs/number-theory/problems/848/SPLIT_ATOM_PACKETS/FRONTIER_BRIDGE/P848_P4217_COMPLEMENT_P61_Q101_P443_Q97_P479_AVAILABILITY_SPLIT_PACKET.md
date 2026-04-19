# P848 p4217 p61/q101 p443/q97 p479 Availability Split

Generated: 2026-04-17T13:03:00Z

## Status

- Status: `first_p479_available_q127_square_obstruction_subclass_emitted`
- Active atom: `D2_p13_q17_endpoint_menu_squarefree_obstruction_p23_q29_p41_q13_p103_q2_p37_q19_p31_q53_p73_q11_p83_q17_p509_q43_p29_q59_p47_q67_p79_q71_p107_q89_p4217_complement_p43_q2_p61_q101_p443_q97_p479_availability_split_q127_child`
- Target: `split_p848_p4217_complement_p61_q101_p443_q97_child_by_p479_availability_with_ledger_token`

## Availability Split

- Source child: first q97 square-obstruction child inside the first p443-available family.
- Endpoint: `p479`, with `479^2 = 229441`.
- Formula on the q97 child: `k_479(w) = (131596*w + 250) mod 229441`.
- Window: `28500`, so the endpoint is available exactly when `k <= 1139`.
- Available residues: `1140/229441`.
- Unavailable residues: `228301/229441`.
- First available residue: `w == 0 mod 229441`, with `k = 250`.
- First unavailable residue: `w == 1 mod 229441`, with `k = 131846`.

## First Available Family

- Parameterization: `w = 229441*z`.
- t-class: `t == 858404682506186150932058 mod 285977303878260637235128355689`.
- left-class: `left == 3449199882246403162146857078213360639892746996146891529938208657606051673377944521449110708641522770273657 mod 1149100072453218401229132386811866926739240736650358200754685042417252942940006288739535609733930799127662288900`.
- Endpoint: `right == left - 6264`.
- Representative repair: exact squarefree by `p848_p4217_complement_p61_q101_p443_q97_p479_factor_certificate`.

## First Square Obstruction

- The first p479-available family has a deterministic `127^2` obstruction.
- Roots modulo `127^2 = 16129`: `4391`, `15510`.
- Selected child: `z == 4391 mod 16129`.
- Child t-class: `t == 1255726342187847140605634760762457 mod 4612527934252465817965385248907881`.
- Child left-class: `left == 5045698421591281882043523472637764753525366714524469855660713551192366330055619287233245383790800847611087880833557 mod 18533835068597959593424676266888601661377213841433627419972315049147872716679361431079969849398569859130065057668100`.

## Ledger Children

- `p479_available_residue_partition`: partitioned, but squarefree hitting over all available residues is not proved.
- `p479_unavailable_complement`: open complement with `228301` residues modulo `229441`.
- `p479_available_q127_square_obstruction_child`: open square-obstruction child.

## Boundary

This packet consumes the explicitly ledgered p479 availability token for the selected p443/q97 child. It does not close the q127 child, the q127-avoiding p479-available families, the p479-unavailable complement, the q97 child, the p443-unavailable complement, the wider p4217 complement, collision-free matching, or Problem 848.

## Next Action

Run convergence assembly after the p479 availability split because the finite token has been consumed and the split introduced a q127 child plus a p479-unavailable complement. Choose a bulk/structural/ranked handoff before any q127 repair descent.
