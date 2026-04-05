# Problem 848 Threshold Ledger

This file records the exact shape of the remaining finite-check gap for Problem 848.

It is intentionally conservative:
- do not promote tentative forum bounds to canonical theorem claims
- separate existential threshold statements from explicit ones
- separate sample finite checks from full finite closure

## Current route claim

- Publicly established: there exists an integer `N0` such that the desired extremal statement holds for all `N >= N0`.
- Not yet canonically established here: a complete explicit threshold `N0`, or a finished proof for every `N`.

## Source-backed threshold map

### 1. Proposition 1.1 in Sawhney's note

Source:
- Sawhney, `Problem_848.pdf`, page 1

Public statement:
- There exists an integer `N0` such that for all `N >= N0`, if `A ⊆ [N]` and `ab+1` is never squarefree for all `a,b in A`, then
  `|A| <= |{n in [N] : n ≡ 7 mod 25}|`.
- Equality is achieved by the `7 mod 25` class and possibly the `18 mod 25` class.

Classification:
- `existential`

Why:
- The theorem statement is explicitly existential.
- The note does not state a usable numerical `N0`.

### 2. Lemma 2.1

Source:
- Sawhney, `Problem_848.pdf`, page 1

Public shape:
- The lemma gives an asymptotic count with error `<< N (log N)^(-1/2)`.
- The proof also uses an `N^(o(1))` style term through the product over small primes.

Classification:
- `weakly explicit`

Why:
- The proof architecture is explicit enough in principle to support numerical extraction.
- The constants are not packaged in the note as a direct computational threshold.

### 3. Lemma 2.2

Source:
- Sawhney, `Problem_848.pdf`, pages 1-2

Public shape:
- The lemma gives an asymptotic estimate for squarefree obstructions on arithmetic progressions with error `<< N / sqrt(log N)`.

Classification:
- `weakly explicit`

Why:
- The structure is explicit in principle.
- The forum discussion repeatedly identifies this lemma as the harder place to sharpen if one wants a realistic explicit threshold.

### 4. Final casework numerics in the proof

Source:
- Sawhney, `Problem_848.pdf`, pages 2-4

Public shape:
- The proof records rounded numerical bounds such as `0.0377`, `0.0358`, `0.0336`, and `0.0294`.
- These are used after absorbing `o(1)` errors under the assumption that `N` is sufficiently large.

Classification:
- `explicit case numerics + existential threshold absorption`

Why:
- The local case splits and main-term constants are concrete.
- The point where the error terms become small enough is still not canonically explicit in the note.

## Public threshold-improvement chatter

These are useful research leads, not canonical solved artifacts.

### 5. Forum-level explicit thresholds

Source:
- `erdosproblems.com/forum/thread/848`

Publicly mentioned:
- `exp(1958)` from a GPT-assisted threshold-extraction effort discussed by Terence Tao
- `exp(1420)` as a later plausible improvement discussed on the same thread

Classification:
- `tentative / not canonically frozen here`

Why:
- These values appear in forum discussion, not in the public theorem statement on the main problem page.
- The thread itself treats them as intermediate and in need of verification or better writeup.

## Public finite-verification coverage

### 6. Finite checks discussed publicly

Source:
- `erdosproblems.com/forum/thread/848`

Publicly mentioned:
- straightforward approaches only checked the problem up to a few hundred in one discussion branch
- the public Lean thread claims finite verification for `N = 50` and `N = 100`

Classification:
- `partial finite coverage`

Why:
- This is not a complete all-`N` finite closure.
- It does, however, show that some finite verification machinery already exists in public.

## Immediate implications

- The cleanest honest next step is to turn the existential/weakly-explicit split above into a line-by-line extraction checklist from Sawhney's note.
- The weakest branch is now isolated in `WEAKEST_CASE_BUDGET.md`, including the exact place where the proof spends rounded branch numerics without yet freezing the usable explicit slack.
- The repo now also has a conservative numerical freeze of that weakest branch, suggesting the real main-term branch bound is about `0.0376113` with slack about `0.0023887` before analytic error absorption.
- The second step is to decide whether the best near-term route is:
  - improving Lemma 2.2 and related error terms enough to get a practical explicit `N0`, or
  - treating the current explicit-threshold discussion as support context and investing in bounded finite computation.

## What not to claim yet

- Do not claim a canonical explicit threshold `N0`.
- Do not claim the forum bounds `exp(1958)` or `exp(1420)` are fully verified repo truth.
- Do not claim the public Lean files already close the entire finite remainder.
