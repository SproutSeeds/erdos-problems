# M8 SAT Rail

This experiment is the first concrete proving ground for `frontier-engine`.

Target:

- weak-sunflower exactness lane around `M(8,3)`
- exact question: whether the target-46 instance is unsatisfiable

Why this benchmark:

- the target is finite and exact
- the verifier backend is natural
- progress can be measured as a reduced exact frontier rather than vague search
  motion
- it connects cleanly back to the problem `857` compute lane

## Engine role

`frontier-engine` should not try to replace the exact backend here.

Instead, it should:

- generate large volumes of candidate structures on GPU
- classify them by uniqueness and rarity
- inventory the rare, high-signal motifs
- promote only the elite subset into exact verification work

## Current rail shape

The first runnable rail now uses:

- random seed families
- warm-start augmentation from the known size-45 lower-bound family
- mutation around the current elite families
- exact counting of `sunflower_triple_count`
- rarity and structural signal scoring
- export of elite verifier-facing bundles as JSON
- runtime selection across baseline Python and Torch-backed device execution

This is still a scaffold, but it is now shaped like a real benchmark rail rather
than a generic placeholder.

## Candidate shape

The first candidate shape should be a proposed family of `46` subset bitmasks on
`[8]`.

That means the prototype can already measure a useful exact-style gap:

- `sunflower_triple_count`

For this benchmark:

- `sunflower_triple_count = 0` means the candidate family is already feasible
- lower counts mean the candidate is a better near-SAT prospect
- rarity and uniqueness should be used to decide which low-violation structures
  deserve exact follow-up first

## Desired benchmark metrics

- candidates generated per second
- unique motif signatures discovered per batch
- elite inventory size after rarity filtering
- best `sunflower_triple_count` in batch
- verifier promotion rate
- fraction of promoted candidates that produce useful exact work
- reduction in unresolved exact frontier relative to a naive baseline

## Primary hardware target

- Windows RTX 4090

Profile:

- [windows_rtx4090_search_profile.json](/Volumes/Code_2TB/code/erdos-problems/research/frontier-engine/experiments/m8-sat-rail/windows_rtx4090_search_profile.json)

## Exact handoff

The rail now exports SAT-seed bundles for elite candidates.

These are intentionally seed bundles, not witness certificates:

- they preserve candidate families in SAT-friendly JSON
- they record observed `sunflower_triple_count`
- they are meant for exact follow-up, not for claiming success by themselves

## Reference seed

The current warm-start reference family is stored locally in:

- [reference_m8_lower_bound_45.json](/Volumes/Code_2TB/code/erdos-problems/research/frontier-engine/experiments/m8-sat-rail/reference_m8_lower_bound_45.json)

The current default rail expands that known size-45 family into ranked size-46
augmentations and uses the best augmentations as initial frontier seeds.

## Later ingest path

Once this rail earns trust, its promoted artifacts can be summarized back into:

- sunflower compute lane notes
- problem `857` evidence
- governed `erdos-problems` ingest packets
