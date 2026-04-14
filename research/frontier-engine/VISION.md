# Vision

`frontier-engine` is meant to turn high-volume random exploration into a usable
exact-search funnel.

The intended loop is:

1. produce millions of combinations per second
2. classify them into uniqueness ratings
3. inventory the structures with the rarest and strongest signals
4. solve on top of those rather than on the raw stream

That loop captures the spirit behind:

- Motif Classifier
- Pair Surrogate
- Trifield Searcher

## Working thesis

Raw brute force is too wasteful.
Pure surrogate search is too easy to fool.
Pure SAT is too expensive to aim at the whole space.

The right middle layer is:

- massive generation
- rarity and motif compression
- disciplined inventory
- exact verification on the elite set

## Why rarity matters

The engine should care about structures that are not merely high-scoring, but
structurally rare relative to the stream that produced them.

That means the prototype should explicitly track:

- how often a motif signature appears
- how many unusual properties a candidate concentrates
- which combinations show high distinctness instead of only high local score

The inventory should therefore answer:

- what almost never shows up?
- what has the strongest unusual structure?
- what deserves exact solving time?

## Near-SAT posture

The goal is to get finitely as close as a SAT solver would while spending GPU
time to shrink the search space first.

This is not "GPU instead of SAT."
It is "GPU before SAT."

Success means the engine can reduce exact work by improving:

- witness quality
- branch ordering
- cube prioritization
- contradiction likelihood
- finite gap on a benchmark with a known exact target

For the first `M(8,3)` rail, that finite gap should be concrete:

- family size fixed at `46`
- exact target is zero 3-sunflower triples
- prototype closeness metric is therefore the exact count of violating triples

That gives the engine a real target before final SAT handoff:
find rare, high-signal families whose 3-sunflower triple count is unusually low.
