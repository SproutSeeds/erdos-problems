# Introduction

Problem `848` asks for the extremal structure of sets `A subseteq [N]` for which
`ab + 1` is never squarefree for any `a, b in A`. The public problem page frames the
question around the residue class `7 mod 25`, and also records the stronger asymptotic
stability picture that near-extremal sets should ultimately be forced into either the
`7 mod 25` or the `18 mod 25` class. This makes the problem unusually concrete: the
candidate extremizers are explicit, the ambient density scale is visible, and the
remaining ambiguity is structural rather than merely existential.

The present public status is not that the problem is fully open and not that it is fully
closed. The problem page marks `848` as `DECIDABLE`, and Sawhney's public note proves the
relevant statement for all sufficiently large `N`. What remains, at least from the public
record captured in this repo, is the bridge from an existential sufficiently-large
threshold to an explicit threshold and eventually to a full all-`N` closure. That is the
distinction this paper bundle protects throughout: the asymptotic theorem is public, the
finite remainder is not yet closed here, and any stronger claim must be earned explicitly.

The purpose of this paper is therefore narrower than a final theorem paper. It packages
the repo's current explicit-candidate route for the sufficiently-large-`N` statement in a
form that is readable, reviewable, and reusable by future collaborators. The main value
added is organizational and technical rather than declarative: the bundle freezes the
current witness parameters, records which public branches have been made explicit, and
separates numerically hardened progress from publication-grade closure. In particular, the
bundle now centers on a shared repo candidate with `N >= exp(1420)`, `T = 250`, and
`eta = 10^-4`, while continuing to mark that candidate as review-ready progress rather
than solved public truth.

The paper is organized as follows. Section 2 fixes notation and the exact public theorem
shape that the repo is trying to explicitize. Section 3 places the current route beside
the public problem page, Sawhney's note, and the emerging formalization chatter. Sections
4 through 6 record the current candidate statement, the proof skeleton behind it, and the
line-by-line ledgers that presently support it. Section 7 distinguishes computational and
formal evidence from theorem-level closure. Section 8 leaves a clean handoff by listing
the remaining limits and the next honest research moves.
