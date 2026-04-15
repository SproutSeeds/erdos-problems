# Problem 848 External Verification Ledger

This ledger records public verification-style claims that matter to the bounded finite
verification lane.

## Imported public items

### Public thread post on 2026-03-16

Source:
- https://www.erdosproblems.com/forum/thread/848

Claim:
- a public post claimed a complete verification framework with computation through `10^7`
  and an intended handoff to Sawhney above that

Why it matters:
- this is exactly the kind of bounded-verification claim the repo should eventually be able
  to absorb, audit, or reject cleanly

Public follow-up:
- the same thread notes that the asymptotic handoff was overstated because Sawhney's theorem
  does not start at `10^7`
- external review also raised quality and verification concerns, including that the repo was
  difficult to verify and likely incorrect

Repo audit posture:
- do not treat this as a covered interval
- keep it as a cautionary example motivating stricter certificate requirements

Local audit snapshot on 2026-04-11:
- cloned `https://github.com/hjyuh/erdos` at commit
  `78e2092cceef9e85595669417f582253c2dea3ad`
- blocking issue 1: the README and proof still claim the computation through `10^7`
  can hand off to Sawhney above `10^7`, which the forum already corrected as false
- blocking issue 2: the C++ verifier's base-exchange mask is built against the
  `7 mod 25` base progression; the repo does not currently supply the separate proof or
  verification surface needed to justify replacing the possible `18 mod 25` base side by
  that one mask
- audit outcome: blocked; useful as a structured-verifier idea source, not as canonical
  interval coverage
- native audit artifact: `EXTERNAL_STRUCTURAL_VERIFIER_AUDIT.json` / `.md`
  records these blockers in a machine-readable form so the agentic 848 loop can see them
  before any external computation is promoted
- base-side scout artifact: `BASE_SIDE_SCOUT.json` / `.md` finds bounded examples already
  by `N = 143` where the `18 mod 25` side has a larger base-compatibility maximum than
  the `7 mod 25` side, so a repo-owned structural verifier must either check both sides
  or prove a more subtle replacement inequality
- two-sided structural scout artifact: `STRUCTURAL_TWO_SIDE_SCOUT.json` / `.md` ports the
  outsider-clique inequality into a repo-owned bounded lane over `N = 7307..20000` with
  both principal base sides. The side-specific `7 mod 25` and `18 mod 25` inequalities
  both pass on this range, while the deliberately safe union-base overcount fails. This
  identifies the next theorem gap as a mixed-base exclusion lemma rather than another
  one-sided mask audit.
- mixed-base failure scout artifact: `MIXED_BASE_FAILURE_SCOUT.json` / `.md` exactly solves
  the induced mixed-base clique on sampled union-failure rows from the two-sided scout.
  On the current 1000-row sample, every union failure is repaired by the exact mixed-base
  clique bound, with no sampled mixed-base failures. This is evidence for promoting the next
  verifier generation from "safe union overcount" to a full mixed-base clique bound at
  every structural breakpoint.
- full mixed-base structural verifier artifact:
  `FULL_MIXED_BASE_STRUCTURAL_VERIFIER.json` / `.md` promotes that repair into a bounded
  repo-owned verifier over `N = 7307..20000`. It checks every witness-prime block and
  structural breakpoint in the range: 15876 structural rows are certified directly by the
  safe union bound, and the remaining 2646 rows trigger exact mixed-base checks across
  137706 threatening active outsiders. The result has zero mixed-base failures and minimum
  certified margin 11. This is bounded structural coverage, not an all-`N` proof.
- structural lift miner artifact: `STRUCTURAL_LIFT_MINER.json` / `.md` reads the full
  mixed-base verifier and mines all 2646 exact mixed-base rows into theorem-facing lift
  obligations. The exact pressure is concentrated in witness primes `13` and `17`; the
  first required theorem lane is the cross-side matching bound, followed by the exact-prime
  margin lift. This packet is a proof-obligation map, not a proof outside `7307..20000`.

### Imported explicit-threshold timeline

Source:
- https://www.erdosproblems.com/forum/thread/848

Imported values:
- `7 x 10^17` on 2026-03-21
- `3.3 x 10^17` on 2026-03-22
- `2.64 x 10^17` on 2026-03-23

Why it matters:
- these claims change the size of the remaining finite gap
- they do not by themselves verify any bounded interval below the threshold

Repo audit posture:
- operationally relevant
- not yet promoted to repo-owned theorem truth

## Current repo rule

Imported verification work is welcome, but it only counts toward canonical coverage after the
repo can answer:
- what exact interval is covered
- by what method class
- with what reproduction path
- and whether external criticism has been answered
