# Problem 848 p4217 Complement p61/q101 p443/q97 Repair-Candidate Boundary

Generated: 2026-04-17T07:53:30Z

## Claim

On the selected p443/q97 obstruction child, the established p>=23 endpoint-menu screen through p<=50000 has exactly two trial-squarefree within-window repair candidates after trial square checks through prime 199999: p151 and p479. The first is p151; bounded local factor routes have split its residual to a 167-digit composite but have not exact-certified it.

## Target Child

- t == 858404682506186150932058 mod 1246408897617516648005929
- left == 3449199882246403162146857078213360639892746996146891529938208657606051673377944521449110708641522770273657 mod 5008259519672675769496874520298756223775352864790330415029070839201594060956874703037101519492727102512900
- Inherited obstruction: 97^2 at endpoint p443

## Bounded Repair Screen

- Scope: established endpoint-menu primes with 23 <= p <= 50000, excluding primes not invertible for the 25*6323 selector denominator
- Window: 28500
- Within-window endpoints: 17
- Trial-square blocked endpoints: 15
- Trial-squarefree candidates: 151, 479
- Trial square prime limit: 199999

## Candidate Boundary

- p151: k=929, delta=-23239, status=not_certified, cofactorDigits=167, knownFactors=3*7*547*14713*281112363028343503*6530015338384483333, boundedAttempts=sympy.factorint:timeout; sympy.pollard_pm1_ladder:timeout_during_B5000000; sympy._ecm_one_factor:factor_found_on_203_digit_residual; recursive_pm1_ecm_ladder:timeout_on_186_digit_residual; sympy._ecm_one_factor:factor_found_on_186_digit_residual; sympy.pm1_plus_ecm_ladder:timeout_on_167_digit_residual_after_pm1_B1000000
- p479: k=250, delta=-6264, status=not_certified, cofactorDigits=209, boundedAttempts=none

## Guard Answers

- wholeFamilyCovered: This screen covers only the already-ledgered q97 square-obstruction child emitted by the first p443-available family; it does not cover p443-unavailable, q97-avoiding, q101-avoiding, or p61-unavailable siblings.
- finiteDenominatorOrRankToken: The finite denominator is the established endpoint-menu screen 23 <= p <= 50000 on this single q97 CRT child. The ledger token decreases from open_square_obstruction_child to repair_candidate_boundary_open, pending exact certification or blocker.
- failureBoundary: If p151 and p479 cannot be exactly certified by local/free factor routes, emit a deterministic blocker/open-leaf packet or successor boundary for the q97 child.
- whySingleSelectorCheaper: p151 is not a new fallback-selector ladder; it is the first survivor of a completed finite repair screen inside the already-emitted q97 child. Exact-certifying or blocking it is cheaper than reopening bulk complement cover before the current finite child is ledgered.

## Proof Boundary

This packet records a bounded repair-candidate boundary for the selected p443/q97 child. It proves the p>=23, p<=50000 endpoint screen outcome and trial-square checks through prime 199999. For p151, bounded local factor routes now split the 203-digit residual by the primes 281112363028343503 and 6530015338384483333, leaving a 167-digit composite residual; a 240-second p-1/ECM ladder on that residual found no further factor before timeout. p151 is still not exact-certified and the q97 child is not closed.

## Next Action

exact_certify_p848_p4217_complement_p61_q101_p443_q97_p151_repair_candidate

## Verification

`node --test test/p848-endpoint-menu-compiler.test.js test/p848-282-alignment-obstruction-packet.test.js`
