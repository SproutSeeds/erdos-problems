# Problem 848 Operational Threshold Posture

This note fixes how the bounded-verification lane uses explicit thresholds.

## Repo-owned audited threshold

- current repo-owned audited candidate:
  - `N >= exp(1420)`
  - status: repo-audited explicit candidate
  - use: internal proof packaging and audit surface

## Imported operational threshold

- current imported public threshold:
  - `N0 = 2.64 x 10^17`
  - source date: 2026-03-23
  - source: Problem 848 forum thread
  - trust status: external public claim, not yet repo-audited line by line

## How the verification lane uses this

- The bounded-verification lane may use `2.64 x 10^17` to size the remaining finite gap.
- It may not present that value as canonical repo theorem truth.
- Any interval-coverage claim that relies on this handoff must explicitly say:
  - the threshold value being used
  - that it is an imported public claim unless and until the repo audits it
  - what part of the interval claim is computational and what part is asymptotic handoff

## Practical policy

- For planning: use the imported `2.64 x 10^17` value.
- For canonical theorem language: keep the stronger distinction
  - imported threshold
  - repo-audited threshold candidate
  - fully closed all-`N` theorem

This keeps the finite-verification program operationally useful without overstating what the
repo has personally audited.
