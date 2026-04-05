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
