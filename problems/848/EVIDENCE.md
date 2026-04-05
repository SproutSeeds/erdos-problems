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
- The public forum discussion says that straightforward threshold extraction is currently
  huge, with one GPT-assisted route reaching `exp(1958)` and later discussion treating
  `exp(1420)` as a plausible intermediate bound rather than a final clean resolution.
- The same thread suggests the real technical bottleneck is improving the error terms in
  Lemma 2.1 and especially Lemma 2.2 enough to make the explicit threshold and the finite
  range practically closable.
- The public Lean thread claims a formalization of the sufficiently-large-`N` theorem and
  mentions finite verification for `N = 50` and `N = 100`, but not a full finite closure.

Claim-safe local posture:
- Exact: the public status is `decidable`, not `open` and not fully `solved`.
- Exact: a formalized statement is publicly claimed by the imported atlas.
- Exact: the remaining public gap is not a new asymptotic theorem, but the bridge from
  existential `N0` to an explicit or fully checked all-`N` statement.
- Heuristic: the lowest-friction route from here is to work both sides of the bridge:
  sharpen the explicit threshold while separately understanding how far direct finite
  verification can reasonably go.

Next maintainer step:
- keep the dossier centered on the finite-check gap rather than re-opening the asymptotic
  theorem lane.
