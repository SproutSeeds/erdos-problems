# Problem 848 Bounded Verification Plan

This note chooses the next closure lane for Problem `848`.

Chosen lane:
- bounded finite verification under the best trusted explicit threshold currently available

Reason for this choice:
- `848` is already a decidable-gap problem, not a fresh asymptotic frontier
- the imported public thread currently reaches `N0 = 2.64 x 10^17` on 2026-03-23
- lowering `N0` further is still valuable, but only because it reduces the finite remainder
- a structured verification program is closer to the actual finish line than another isolated
  threshold race

Scope of this lane:
- do not claim full closure yet
- do not silently adopt imported threshold claims as canonical repo truth
- instead, build the machinery that would let the repo:
  - state exactly what range is covered by what method
  - preserve certificates and checkpoints
  - audit imported verification claims before relying on them

Immediate bounded-verification objectives:
1. Freeze the best imported threshold currently trusted enough to size the finite remainder.
2. Split the finite remainder into verification regimes rather than treating it as one giant
   interval.
3. Define what a reproducible verification certificate must contain before the repo counts a
   range as covered.
4. Record prior public verification attempts, especially where external reviewers raised
   correctness concerns.
5. Keep the verification lane modular enough that imported proofs, local proofs, and future
   compute runs can all plug into the same certificate surface.

What success would look like:
- the repo can say exactly which interval is covered
- each covered interval points to a concrete certificate type and reproduction story
- imported public verification work is either accepted with an audit note or left external
- the remaining uncovered range shrinks monotonically

Current progress:
- the repo now has an exact small-`N` certificate for `1..2000`

What this lane is not:
- not brute force to `2.64 x 10^17`
- not an automatic endorsement of every public verification claim
- not a replacement for threshold-lowering work if a cleaner explicit `N0` emerges
