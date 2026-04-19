# Problem 848 p4217 Unavailable Complement Refinement

Generated: 2026-04-17T05:42:47Z

## Claim

The p4217 unavailable complement is exactly parameterized.

The selector is

`k_4217(t) = (445517*t + 203) mod 17783089`.

Since

`445517 * 4749600 == 1 mod 17783089`,

the inverse selector is

`t = 4749600*(k - 203) mod 17783089`.

The unavailable complement is the interval

`1140 <= k <= 17783088`.

Writing `k = 1140 + s`, this becomes

`t(s) = 4749600*(s + 937) mod 17783089`

for

`0 <= s < 17781949`.

## Ledger Refinement

The coarse p4217 unavailable-complement leaf is replaced by one deterministic interval obligation:

`p4217_complement_selector_interval_pending`.

This is a refinement, not a cover. The residue count remains `17781949`, and no global closure is claimed.

## Boundary

This packet does not cover the complement, prove it impossible, certify p97 or p227, bind the 282/841 row to a live family-menu row, or decide Problem 848.

## Next Action

Find a fallback selector, finite subcover, impossibility mechanism, or further deterministic refinement for the interval family.
