# P848 p4217 Complement p61 Availability Refinement

Status: `p4217_complement_p61_availability_refined_squarefree_open`

The p43 fallback selector is no longer a candidate for the p4217-unavailable complement: the p43 square-obstruction packet proves a uniform `2^2` divisor in `left*(left - 5014)+1`. This packet replaces that dead fallback with an exact p61 CRT refinement.

## Source Family

The source class is

`left = 760410154648626128533304355898763555393483209652336085943695959179023528577227857 + 4018151289874337645868852921870587523537603036293953839351606997760601160064480100*t`.

The p4217 complement is

`t4217(s) = 4749600*(s + 937) mod 17783089`, for `0 <= s < 17781949`.

## p61 Selector

For outsider `6323`, the endpoint formula is

`k_61(left) = (2828*left + 2221) mod 3721`.

On the current source class this becomes

`k_61(t) = (3330*t + 3360) mod 3721`.

Since `gcd(3330, 3721) = 1`, this selector permutes the `61^2` residue classes. The `28500` window is equivalent to `k <= 1139`, so each p4217-complement row has exactly:

- `1140` p61-available residues modulo `61^2`
- `2581` p61-unavailable residues modulo `61^2`

The available residues are parameterized by

`r_61(k) = 3150*(k - 3360) mod 3721`, for `0 <= k <= 1139`.

Because `gcd(17783089, 3721) = 1`, the combined CRT modulus is `66170874169`, and the available classes are

`t(s,k) = t4217(s) + 17783089*(((r_61(k) - t4217(s))*2847) mod 3721) mod 66170874169`.

## First Child

The first p4217-complement row `s=0` has `t == 4602950 mod 17783089`. The first p61-available residue by residue order is `t == 6 mod 3721`, where `k_61=1014` and `delta=-25364`.

The CRT child is

`t == 48783616077 mod 66170874169`.

A bounded square probe of this first child found `101^2` obstruction roots at `u == 1829, 2811 mod 10201`. This is not a p61 cover or global obstruction; it is the next deterministic squarefree-audit boundary.

## Boundary

This packet proves the exact p61 availability partition of the p4217 complement. It does not prove p61 squarefree hitting, cover the p61-unavailable classes, prove collision-free matching, or decide Problem 848.

Next action: `prove_p848_p4217_complement_p61_available_squarefree_or_obstruction`.
