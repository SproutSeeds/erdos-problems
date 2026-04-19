# Problem 848 p4217 Complement p43 Square Obstruction

Generated: 2026-04-17T05:59:22Z

## Claim

The p43 fallback selector is uniformly square-blocked on the p4217 complement.

The source class is

`left = 760410154648626128533304355898763555393483209652336085943695959179023528577227857 + 4018151289874337645868852921870587523537603036293953839351606997760601160064480100*t`.

Modulo `4`, this source class has

`left == 1 mod 4`.

The p43 fallback endpoint has

`right = left - 5014`.

Since `5014 == 2 mod 4`,

`right == 3 mod 4`.

Therefore

`left*right + 1 == 1*3 + 1 == 0 mod 4`.

So `2^2` divides the p43 endpoint cross product for every source parameter `t`, including every one of the `17781949` p4217-unavailable complement residues.

## Consequence

The p43 fallback selector closes negatively. It is a valid endpoint-availability selector, but it cannot provide squarefree hitting on the p4217 complement.

## Boundary

This packet does not cover the p4217 complement by another endpoint, prove collision-free matching, bind the 282/841 row to a live family-menu row, or decide Problem 848.

## Next Action

Find a different fallback selector, finite cover, impossibility theorem, or deterministic refinement for the p4217 complement, with p43 excluded.
