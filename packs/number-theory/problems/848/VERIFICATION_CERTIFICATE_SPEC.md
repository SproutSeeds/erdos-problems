# Problem 848 Verification Certificate Spec

Any bounded-verification claim for Problem `848` should attach a certificate with these fields.

## Required fields

- `interval`
  - exact range covered, for example `N = 1..7306`
- `method_class`
  - one of:
    - `exact_small_n`
    - `structured_breakpoints`
    - `imported_external_computation`
    - `hybrid`
- `claim_level`
  - one of:
    - `exact`
    - `verified`
    - `external_only`
- `artifacts`
  - concrete files, repos, scripts, or notes used for the claim
- `reproduction`
  - how a maintainer can rerun or recheck the claim
- `failure_mode`
  - what would invalidate the interval claim
- `audit_status`
  - one of:
    - `repo_audited`
    - `partially_audited`
    - `external_unreviewed`
    - `blocked`

## Strongly preferred fields

- `breakpoint_definition`
  - if the method uses breakpoint sufficiency, define exactly what the breakpoints are
- `monotonicity_justification`
  - if interval coverage is inferred between checkpoints, explain why
- `independent_check`
  - a second script, proof note, or reviewer confirmation
- `cost_profile`
  - rough runtime or proof complexity
- `witness_encoding`
  - if the certificate omits raw witness lists because they are derivable, state that
    encoding explicitly, for example "pure residue class mod 25 when possible"

## Rejection triggers

Do not count a range as canonically covered if any of the following is true:

- the claim silently uses the wrong asymptotic handoff threshold
- the method covers only sample points but is presented as interval coverage
- a breakpoint argument is used without a monotonicity justification
- the computation is public but explicitly criticized as unverified or likely incorrect and no
  repo audit has answered that criticism
- the result cannot be rerun or inspected by a future maintainer

## Why this matters here

The public thread already contains one verification attempt that was later corrected and
criticized as difficult to verify. That does not make bounded verification hopeless. It does
mean this repo should demand interval certificates rather than encouraging "I think this
covers everything up to X" style claims.
