# Problem 848 p4217 Complement p43 Fallback Selector

Generated: 2026-04-17T05:52:27Z

## Claim

The exact p4217 unavailable complement has a universal endpoint selector at p43.

The source class is

`left = 760410154648626128533304355898763555393483209652336085943695959179023528577227857 + 4018151289874337645868852921870587523537603036293953839351606997760601160064480100*t`.

The p4217 complement is

`t(s) = 4749600*(s + 937) mod 17783089`

for

`0 <= s < 17781949`.

For p43, the endpoint selector is

`k_43(left) = (74*left + 1323) mod 1849`.

On the source class,

`left == 1509 mod 1849`

and the source modulus is

`0 mod 1849`.

Therefore

`k_43(t) = 200`

for every source parameter t, including every p4217-complement residue.

The p43 endpoint is

`right_43(left) = left - 5014`.

Since `5014 <= 28500`, it is inside the endpoint window. It also has `right == 18 mod 25` and satisfies the endpoint compatibility congruence

`6323*right + 1 == 0 mod 1849`.

## Ledger Transition

Input:

`p4217_complement_selector_interval_pending`

with `17781949` residues.

Output:

`p4217_complement_p43_squarefree_hitting_pending`

with the same `17781949` residues.

This closes the endpoint-availability selector layer for the p4217 complement. It does not close the squarefree layer.

## Boundary

This packet does not prove that `left*(left - 5014)+1` is squarefree on the complement family, does not prove collision-free matching, does not certify p97 or p227, does not bind the 282/841 row to a live family-menu row, and does not decide Problem 848.

## Next Action

Prove squarefree hitting for the p43 fallback selector over the p4217 complement, or emit the first deterministic square-obstruction subfamily.
