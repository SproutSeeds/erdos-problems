# Agent Start

Fast start:
- `erdos problem show 848`
- `erdos workspace show`
- `erdos number-theory dispatch 848`
- `erdos number-theory bridge 848`
- `erdos frontier doctor`
- `erdos preflight`
- `erdos continuation use route`
- `erdos checkpoints sync`

Working assumptions:
- Open problem: no
- Active route: finite_check_gap_closure
- Repo status: active
- Harness depth: dossier
- Site status: decidable
- Route breakthrough: yes
- Problem solved: no

Read in this order:
- `STATEMENT.md`
- `REFERENCES.md`
- `EVIDENCE.md`
- `FORMALIZATION.md`
- `PUBLIC_STATUS_REVIEW.md`
- `AGENT_WEBSEARCH_BRIEF.md`
- `packs/number-theory/problems/848/SEARCH_THEOREM_BRIDGE.md`

Frontier-engine hook:
- only activate this loop when the workspace is explicitly opted in
- if `erdos number-theory status 848` or `erdos workspace show` reports
  `Frontier loop: active (cpu)` or `Frontier loop: active (gpu)`, treat `frontier-engine`
  as part of the normal route loop rather than a side tool
- if the loop is inactive, keep it out of the active route plan and use:
  - `erdos frontier doctor`
  - `erdos frontier setup --base --apply`
  - `erdos frontier setup --cuda --torch-index-url <url> --apply`
  to intentionally opt in at the appropriate mode
- once active, start with `erdos number-theory dispatch 848`
- the dispatch command now ranks the live next move across:
  - canonical bridge refresh
  - managed CPU family search
  - managed GPU ladder sweep
  - exact small-`N` interval scouting
- use `erdos number-theory dispatch 848 --apply` to run the current primary move, or
  `--action <id>` to force a specific lane
- `bridge-refresh` now auto-resolves the execution path it needs:
  - `system` when only the bundled bridge exporter is needed
  - `cpu` when the managed frontier runtime is opted in
  - `gpu` when the managed CUDA runtime is opted in and available

First honest move:
- isolate the exact finite remainder left after Sawhney's sufficiently-large-`N` theorem
- determine whether the missing closure is an explicit threshold extraction problem, a pure
  finite computation problem, or a mixed lane
- if the mixed lane wins, route through the frontier-engine bridge instead of treating GPU search
  as out-of-band work
- keep every note honest about the gap between `decidable` and fully `solved`
- read the Sawhney note before touching the forum heuristics, then use the forum only to
  map candidate threshold-improvement strategies and public finite-check coverage
