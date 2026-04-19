# Problem 848 Endpoint Availability Staircase Theorem v0

Generated: 2026-04-17T05:36:21Z

## Claim

`p848_endpoint_availability_staircase_theorem_v0` proves the endpoint availability split and handoff discipline used by the current q17 staircase.

For an exact endpoint repair handoff with affine selector

`k_p(t) = a*t + b mod p^2`

and fixed window `W`, define

`A = {t : k_p(t) <= floor((W - 14) / 25)}`

and

`U = {t : k_p(t) > floor((W - 14) / 25)}`.

Then `A` and `U` are disjoint and cover the finite source class modulo `p^2`. If `gcd(a, p^2) = 1`, the selector is a permutation, so `|A| = floor((W - 14) / 25) + 1` and `|U| = p^2 - |A|`.

## Handoff Discipline

- An available residue family is not a closure by itself.
- A square-obstruction child needs an exact CRT/lifted class and a recorded `q^2` divisibility witness.
- A repair handoff needs an exact squarefree factor certificate.
- A bounded trial survivor remains a repair candidate or blocker/open leaf.
- An unavailable complement remains an explicit open obligation until a separate cover or impossibility theorem handles it.

## p4217 Instantiation

The current p4217 availability split has

`k_4217(t) = (445517*t + 203) mod 17783089`.

Here `gcd(445517, 17783089) = 1`, `W = 28500`, and `floor((W - 14) / 25) = 1139`. Therefore the split has exactly:

- available residues: `1140`
- unavailable residues: `17781949`
- partition check: `1140 + 17781949 = 17783089`

The first available child is the p4217/q61 branch:

`t == 42163704019 mod 66170874169`

with `61^2 | left*right+1`.

The unavailable complement remains open.

## Boundary

This theorem does not decide Problem 848. It does not cover the p4217 unavailable complement, prove global endpoint-tree termination, certify p97 or p227, or bind the synthetic 282/841 row to a live family-menu row.

## Next Action

Prove the p4217 unavailable-complement cover, or refine the frontier ledger so that complement becomes a smaller deterministic theorem obligation.
