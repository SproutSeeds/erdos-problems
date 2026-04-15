# Naming

Recommended exact name: `frontier-engine`

Python package name: `frontier_engine`

## Why this name

`frontier-engine` is the best current fit because it is:

- broad enough to cover motif generation, surrogate scoring, and verifier-guided
  search
- not tied to a single problem family such as sunflower or SAT
- not too narrow around one module such as Motif Classifier
- aligned with the repo's existing language around frontiers, routes, and
  honest next moves

## Names considered

Rejected for now:

- `motif-classifier`
  - too narrow; that is a major subsystem, not the whole engine
- `pair-surrogate`
  - too narrow and too model-specific
- `trifield-searcher`
  - too narrow and too experimental
- `near-sat-engine`
  - too tied to one exact backend
- `constraint-frontier`
  - strong candidate, but slightly colder and less adaptable than
    `frontier-engine`
- `frontier-search`
  - viable, but `frontier-engine` better captures the full stack rather than
    only the search loop

## Integration naming

If later connected into `erdos-problems`, the adapter surface can use names like:

- `erdos frontier status <id>`
- `erdos frontier run <id>`
- `erdos frontier ingest <id>`

Those should not exist until the engine earns them.
