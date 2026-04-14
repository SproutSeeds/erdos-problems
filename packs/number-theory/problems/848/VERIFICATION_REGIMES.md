# Problem 848 Verification Regimes

This file partitions the finite remainder into regimes so the repo can track progress
without pretending that one method fits the whole gap.

## Trusted public asymptotic handoff

- public theorem: Sawhney proves the statement for all sufficiently large `N`
- imported explicit threshold timeline:
  - `7 x 10^17` on 2026-03-21
  - `3.3 x 10^17` on 2026-03-22
  - `2.64 x 10^17` on 2026-03-23
- current repo posture:
  - these thresholds are imported public claims
  - they size the finite remainder operationally
  - they are not yet promoted to canonical repo-owned theorem statements

## Verification regime split

### Regime A: exact small-`N` coverage

Goal:
- cover a small base interval by exact methods that can be rerun and independently checked

Candidate methods:
- direct search
- pair-exchange lemmas
- exact residue-structure enumeration
- very small witness-prime case splits

Desired certificate:
- exact witness/counterexample status for each `N`
- reproducible script or proof note

### Regime B: structured breakpoint verification

Goal:
- cover a medium interval by checking a monotone or breakpoint-sufficient inequality rather
  than every raw instance independently

Candidate methods:
- structural breakpoint tables
- clique/exchange inequalities
- monotonicity-ledger arguments

Desired certificate:
- exact breakpoint set definition
- proof that breakpoint coverage implies interval coverage
- machine-readable result table

### Regime C: audited imported computation

Goal:
- record public computational claims without treating them as canonical until the repo has an
  audit story

Candidate inputs:
- public repos
- public verification notes
- independently rerun scripts

Desired certificate:
- imported source URL
- exact claimed interval
- audit outcome: accepted, external-only, or blocked

### Regime D: asymptotic handoff

Goal:
- state the point above which the public theorem takes over

Desired certificate:
- cited theorem source
- exact threshold assumption being used operationally
- note whether the threshold is imported-only or repo-audited

## Current honest posture

- Regime A: exact interval `1..40500` is now frozen in the repo with a reproducible
  maximum-clique certificate
- Regime B: endpoint-monotonicity breakpoint certificate and endpoint exact verifier are
  active over the current exact base; additionally, the full mixed-base structural verifier
  now gives bounded structural coverage for `7307..20000` by repairing all safe-union
  failures with exact mixed-base clique checks. The structural lift miner now converts all
  2646 exact mixed-base rows into a theorem-obligation packet: prove the cross-side matching
  bound, then lift the `p = 13` and `p = 17` exact-prime margin families.
- Regime C: public attempts exist, but some were explicitly criticized on the forum as
  difficult to verify or likely incorrect
- Regime D: public asymptotic theorem exists; imported explicit thresholds are tracked but not
  yet repo-audited

So the next honest move is to decide whether exact-small-`N` coverage should be extended
directly beyond `40500`, or whether the next gain comes from auditing imported computation or
switching method class.
