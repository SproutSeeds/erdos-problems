# Problem 848 Anchor Minimality Ledger

This note summarizes the current search evidence for small anchor sets drawn from
the first ten `7 mod 25` elements

`7, 32, 57, 82, 107, 132, 157, 182, 207, 232`.

Machine-readable packet:
- `ANCHOR_SUBSET_SEARCH_PREFIX10_K3_K4.json`

Reproduction:

```bash
node packs/number-theory/problems/848/compute/problem848_anchor_subset_search.mjs \
  --max 10000 \
  --candidate-count 10 \
  --set-sizes 3,4 \
  --top 15 \
  --json-output packs/number-theory/problems/848/ANCHOR_SUBSET_SEARCH_PREFIX10_K3_K4.json
```

## Best three-anchor set found

- anchors: `{32, 82, 132}`
- failure count in `1..10000`: `41`
- first fully covered tail found by this set: `n >= 3751`

So a three-anchor statement may still exist asymptotically, but among the first
ten natural candidates it does **not** produce the small startup threshold that
the four-anchor set does.

## Best four-anchor set found

- anchors: `{7, 32, 57, 82}`
- failure count in `1..10000`: `15`
- exact covered tail: `n >= 30`

Startup failures are exactly:

`1, 2, 3, 4, 5, 6, 9, 13, 14, 17, 21, 23, 24, 25, 29`.

Among the searched four-anchor subsets, this is the best tail start by a large
margin. The next-best four-anchor sets only start covering everything from
`n >= 70`.

## Current read

- The set `{7, 32, 57, 82}` is not just one working example.
- In the current search window it appears genuinely special.
- That makes it a serious theorem candidate rather than an arbitrary empirical
  artifact.

This is still search evidence, not a proof of minimality in the full infinite
problem. But it is strong enough to justify prioritizing the four-anchor lemma
over blind interval extension.
