# Evidence

- This dossier was seeded for Erdos Problem #848 from a pull bundle.
- Imported record included: yes
- Site snapshot included: yes
- Public status review included: yes
- Repo status at seed time: active
- Harness depth at seed time: dossier
- Imported status: `decidable`
- Imported formalization state: `yes`

Current public evidence captured locally:
- The live site snapshot from 2026-04-05 states that the problem is resolved up to a finite
  check.
- The site records van Doorn's density upper bound and Weisenberg's slight refinement as
  context for why the extremal density is constrained near `1/25`.
- The site reports that Sawhney solved the problem for all sufficiently large `N`, with a
  stability statement forcing near-extremal sets into the `7 mod 25` or `18 mod 25`
  classes.
- The public search review surfaced a current Lean formalization thread and a suggested
  arXiv reference for the sufficiently-large-`N` result.
- Sawhney's public four-page note proves the existence of an `N0`, but does not give an
  explicit threshold in the statement of Proposition 1.1.
- The public forum discussion records an explicit-threshold timeline:
  - `N0 = 7 x 10^17` on 2026-03-21
  - `N0 = 3.3 x 10^17` on 2026-03-22
  - `N0 = 2.64 x 10^17` on 2026-03-23
- The same thread also records earlier larger threshold exploration, including
  `exp(1958)`-scale discussion and `exp(1420)` as a plausible intermediate explicit route
  rather than a final clean resolution.
- The same thread suggests the real technical bottleneck is improving the error terms in
  Lemma 2.1 and especially Lemma 2.2 enough to make the explicit threshold and the finite
  range practically closable.
- The public Lean thread claims a formalization of the sufficiently-large-`N` theorem and
  mentions finite verification for `N = 50` and `N = 100`, but not a full finite closure.
- The local number-theory pack now has a one-sided explicit Lemma 2.1 remainder ledger.
  It shows that, at the public threshold candidates `exp(1420)` and `exp(1958)`, the
  small-prime inclusion-exclusion remainder is negligible while the large-prime tail still
  exceeds the frozen weakest-branch slack.
- The local truncation scan also shows that the one-sided explicit route no longer needs
  `T = floor(sqrt(log N))`; larger choices of `T` leave the discrete term negligible while
  materially shrinking the live `A*` tail.
- The local weakest-branch witness budget at `T = 250` now shows that, after the explicit
  Lemma 2.1 and Lemma 2.2 tail terms are paid, the branch still appears to retain about
  `0.001775` slack before the Lemma 2.2 prime-count term is inserted, and about `0.000366`
  witness margin after that term is bounded with a Dusart-style explicit prime-count estimate.
- The local weakest-branch assembly note now fixes a working witness
  `T = 250`, `N >= exp(1420)`, `eta = 10^-4`, with about `0.000266` visible reserve left in
  that branch after all currently frozen lemma-level costs.
- The local branch-comparison ledger now indicates that the same witness also closes the
  public branches with rounded bounds `0.0358`, `0.0336`, and `0.0294` at the repo's current
  explicit level.
- The local proposition-level candidate note now packages that shared witness as the current
  repo candidate for an explicit stability statement, while still refusing to mark the problem
  fully solved.
- The local proof-obligation ledger now identifies the next real blocker as numerical
  certification of the displayed decimal inputs, not another branch estimate.
- The local certified numerical ledger now replaces the main displayed decimal inputs with
  conservative machine-interval bounds, leaving a certified visible reserve of about
  `0.000266` after the working `eta = 10^-4`.
- The local theorem-style note now assembles the current explicit candidate into a single
  proof-shaped artifact suitable for paper-writer mode and future public review.
- The current candidate is now surfaced in both the paper bundle and a dossier-level public
  review note, with a short share-ready summary.
- The local paper bundle now has drafted introduction, preliminaries, and related-work
  sections, and the bundle has been refreshed so that no placeholder paper text remains.
- The current repo candidate is weaker than the best imported threshold value currently
  visible on the public thread, so its main value is auditability and handoff structure,
  not "best known `N0`" status.
- The repo has now chosen bounded finite verification as the next closure lane and frozen
  first-pass notes for verification regimes, certificate requirements, and imported
  verification audit.
- The repo now has an operational threshold posture note that allows imported `N0`
  values to size the finite remainder without being silently promoted to canonical theorem
  truth.
- A reproducible exact maximum-clique scan now verifies the expected extremal size for every
  `N` in `1..10000`, giving the bounded-verification lane a much larger trusted covered interval.
- The exact verifier has been rebuilt incrementally, so the old post-`3000` cost wall is now
  understood to have been mostly a tooling artifact rather than a serious mathematical barrier.

Claim-safe local posture:
- Exact: the public status is `decidable`, not `open` and not fully `solved`.
- Exact: a formalized statement is publicly claimed by the imported atlas.
- Exact: the remaining public gap is not a new asymptotic theorem, but the bridge from
  existential `N0` to an explicit or fully checked all-`N` statement.
- Exact: as of 2026-03-23, the best imported public-thread threshold visible in the dossier
  is `N0 = 2.64 x 10^17`.
- Exact: the repo's own audited candidate is currently weaker than that imported threshold,
  so it should not be described as the best-known public bound.
- Exact: the current repo explicitization of Lemma 2.1 isolates the large-prime tail as the
  live analytic blocker in the weakest branch.
- Exact: within the one-sided explicit route, enlarging `T` is now justified and appears to
  be the right next analytic move.
- Exact: a concrete witness value `T = 250` now survives the live tail bookkeeping in the
  weakest branch at an explicit witness-budget level.
- Exact: the weakest branch now has a concrete working `eta` witness, not just a floating
  slack budget.
- Exact: no other public branch currently appears to outrun that witness in the repo ledger.
- Exact: the repo now has a proposition-level explicit candidate, but not yet a publication-
  ready explicit theorem artifact.
- Exact: the next real mathematical hardening step is numerical certification of the displayed
  decimal inputs.
- Exact: the current repo candidate is now numerically hardened at the ledger level.
- Exact: the repo now also has a theorem-style proof artifact for the current candidate.
- Exact: the current candidate package is now surfaced for both paper-writing and public
  review workflows.
- Exact: the paper bundle for the current candidate is now fully drafted at the section-shell
  level and no longer depends on placeholder text in its public-facing sections.
- Heuristic: the lowest-friction route from here is to work both sides of the bridge:
  sharpen the explicit threshold while separately understanding how far direct finite
  verification can reasonably go.

Next maintainer step:
- keep the dossier centered on the finite-check gap rather than re-opening the asymptotic
  theorem lane
- preserve the current claim-safe package as a clean review unit
- treat imported threshold improvements as external progress markers unless they are
  re-audited inside the repo
- decide whether exact verified coverage should be extended beyond `10000` or whether the
  next gain now needs a different method class
