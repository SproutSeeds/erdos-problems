#let ink = rgb("#16324f")
#let accent = rgb("#0f766e")
#let soft = rgb("#eef6f5")
#let soft2 = rgb("#f8fbfb")

#set page(
  paper: "us-letter",
  margin: (top: 0.95in, bottom: 0.95in, left: 1.0in, right: 1.0in),
  footer: context {
    set text(size: 9pt, fill: luma(45%))
    align(center)[#counter(page).display("1")]
  },
)

#set text(
  font: "Libertinus Serif",
  size: 11pt,
  fill: luma(15%),
  lang: "en",
)

#set par(
  justify: true,
  leading: 0.68em,
)

#set heading(numbering: "1.")
#show heading.where(level: 1): set text(size: 14pt, weight: "semibold", fill: ink)
#show heading.where(level: 2): set text(size: 11.6pt, weight: "semibold", fill: ink)

#let small-note(body) = text(size: 9pt, fill: luma(42%))[#body]

#let ref-entry(body) = block(
  inset: (left: 1.35em),
)[
  #set par(hanging-indent: 1.35em, leading: 0.58em)
  #body
]

#align(center)[
  #text(size: 20pt, weight: "bold", fill: ink)[
    A Progress Note on the Weak Sunflower Problem
  ]
  #v(0.35em)
  #text(size: 11.5pt, fill: accent)[
    Erdos Problem #857
  ]
  #v(0.7em)
  #text(size: 11pt)[Cody Mitchell]
]

#v(0.45em)

#align(center)[
  #block(
    width: 96%,
    inset: (x: 15pt, y: 11pt),
    fill: soft2,
    stroke: (paint: rgb("#d6e8e5"), thickness: 0.5pt),
    radius: 5pt,
  )[
    #text(size: 9.4pt, weight: "semibold", fill: ink)[Repository and CLI]
    #v(0.35em)
    #block(width: 100%)[
      #set par(justify: false, leading: 0.5em)
      #text(size: 9pt, fill: luma(30%))[
        #text(weight: "semibold", fill: accent)[Repository URL:] https://github.com/SproutSeeds/erdos-problems
      ]
      #linebreak()
      #text(size: 9pt, fill: luma(30%))[
        #text(weight: "semibold", fill: accent)[NPM package URL:] https://www.npmjs.com/package/erdos-problems
      ]
      #linebreak()
      #text(size: 9pt, fill: luma(30%))[
        #text(weight: "semibold", fill: accent)[Global install:] #text(font: "Menlo", size: 8.8pt, fill: luma(26%))[npm install -g erdos-problems]
      ]
      #linebreak()
      #text(size: 9pt, fill: luma(30%))[
        #text(weight: "semibold", fill: accent)[Local repo wiring:] #text(font: "Menlo", size: 8.8pt, fill: luma(26%))[npm link]
      ]
      #linebreak()
      #text(size: 9pt, fill: luma(30%))[
        #text(weight: "semibold", fill: accent)[Date:] April 5, 2026.
      ]
    ]
  ]
]

#v(1.1em)

#block(
  inset: 13pt,
  fill: soft2,
  stroke: (paint: rgb("#d6e8e5"), thickness: 0.6pt),
  radius: 6pt,
)[
  #text(size: 10pt, weight: "semibold", fill: ink)[Abstract.]
  We study the weak sunflower problem recorded as Erdos problem $857$: determine
  the growth of the minimum $m(n, k)$ such that every family of $m(n, k)$ subsets
  of $[n]$ contains a $k$-sunflower. The problem remains open, and this paper does
  not claim its resolution. Instead, we assemble a claim-safe progress paper
  around the current public frontier represented in this repository. We isolate
  the active anchored-selector linearization route, identify the strongest
  closed public support layer immediately beneath it, and record the exact open
  seam exposed by the current board packet. We also separate asymptotic proof
  posture from finite computation: the current compute surface contains a narrow
  exact packet for the question whether $M(8, 3) = 45$, marked ready for a local
  scout, but this does not upgrade the status of the asymptotic problem. The
  resulting document is therefore a professional progress note rather than a
  solved-claim paper.
]

#v(0.9em)

#table(
  columns: (1.2fr, 2.6fr),
  inset: 7pt,
  align: (left, left),
  stroke: (x: none, y: (paint: rgb("#d8e4e3"), thickness: 0.5pt)),
  fill: (x, y) => if y == 0 { soft } else if calc.odd(y) { white } else { soft2 },
  table.header(
    text(weight: "semibold", fill: ink)[Item],
    text(weight: "semibold", fill: ink)[Current public status],
  ),
  [Problem status], [Open. No full proof claim is made in this paper.],
  [Active route], [Anchored-selector linearization],
  [Strongest closed support layer], [O1a existential explicit export],
  [Live ticket], [T10, with 2/5 gates and 9/15 atoms complete],
  [First ready atom], [T10.G3.A2],
  [Compute packet], [M(8,3) exactness lane, ready for local scout],
)

= Introduction

The sunflower problem sits near the center of modern extremal set theory. In its
classical form, initiated by Erdos and Rado, one asks how large a family of sets
must be before a sunflower is forced to appear. Problem $857$ records the
non-uniform or weak version: for fixed $k$, determine the least $m(n, k)$ such
that every family of $m(n, k)$ subsets of $[n]$ contains a $k$-sunflower. The
public Erdos Problems page keeps this problem open and emphasizes the target
upper bound $m(n, k) <= C(k)^n$.

This weak formulation is broader than the classical uniform sunflower lemma and
interacts with several major themes in modern combinatorics. For $k = 3$, the
problem is closely tied to cap-set-type phenomena, as emphasized by Alon,
Shpilka, and Umans, and the best asymptotic bound quoted on the public problem
page comes from Naslund and Sawin. At the same time, recent breakthroughs on the
uniform sunflower lemma by Alweiss, Lovett, Wu, and Zhang, followed by Rao and by
Bell, Chueluecha, and Warnke, have transformed the methodological background
against which any serious weak-sunflower route must be evaluated.

The purpose of this paper is narrower than a complete solution. It converts the
current public record for problem $857$ into a mathematically legible progress
paper. The main value added here is organizational and expository: we identify
the active route, separate closed support layers from live frontier work, and
state exactly what the present public compute and formalization packets do and do
not show. This distinction matters because the repository now contains genuine
route structure, but not yet a public theorem text closing the asymptotic weak
sunflower problem.

= Problem Statement and Scope

We write $[n] = {1, ..., n}$. A family $F$ of subsets of $[n]$ contains a
$k$-sunflower if there exist distinct sets $A_1, ..., A_k$ in $F$ such that all
pairwise intersections are equal. Equivalently, if $K$ denotes that common
intersection, then the petals $A_1 - K, ..., A_k - K$ are pairwise disjoint.

Problem $857$ asks for the least integer $m(n, k)$ such that every family of
$m(n, k)$ subsets of $[n]$ contains a $k$-sunflower. The working normalization in
this repository is the target asymptotic shape
$m(n, k) <= C(k)^n$.

This note is intentionally claim-safe. It makes three decisions explicit.

- It treats the asymptotic weak sunflower problem as open.
- It treats route architecture as a mathematical object worth recording in its own
  right.
- It keeps proof posture, formalization posture, and finite computation posture
  separate throughout.

That final separation is crucial. A formally organized route is not the same as a
finished proof, and a finite exact computation is not the same as asymptotic
closure.

= Literature Context

The first layer of background is classical. Erdos and Rado introduced the
sunflower lemma and the broader fixed-petal conjectural picture. Erdos later
revisited the surrounding extremal set-theoretic landscape with Kleitman, and
the paper of Erdos and Szemeredi remains a central source for the non-uniform
weak-sunflower formulation most relevant to problem $857$.

The second layer is the modern structural breakthrough on the uniform problem.
Alweiss, Lovett, Wu, and Zhang proved the first dramatically subfactorial general
upper bound using the spread-method viewpoint. Rao reformulated the argument via
coding ideas, and Bell, Chueluecha, and Warnke sharpened the general bound
further to the now-standard $O(p log k)$ scale in the $p$-petal, $k$-uniform
setting. Rao's later survey gives a concise entry point into how these ideas sit
within the broader sunflower story.

The third layer is the weak-sunflower and cap-set interface. The public Erdos
Problems page for $857$ points directly to the connection observed by Alon,
Shpilka, and Umans when $k = 3$, and it quotes the Naslund-Sawin upper bound
$m(n, 3) <= (3 / 2^(2/3))^((1 + o(1)) n)$.
This remains the main asymptotic benchmark explicitly attached to the current
public statement of the problem.

= Current Public Route Architecture

The present repository does not expose a complete theorem text for the active
leaf. Accordingly, the right mathematical object to summarize is the dependency
structure of the route itself.

== Closed support layers

The public route history identifies the following layers as closed public support
beneath the live frontier:

- global family-card export
- explicit remainder export
- explicit M-remainder export
- O1a existential explicit export

Among these, the strongest finished layer immediately below the frontier is the
O1a existential explicit export layer, which the ops packet records as
strict-closed.
This means that the current public route already has an explicit anchored
remainder package below the frontier; future work should treat that package as
input rather than re-derive it rhetorically from scratch.

== The active frontier

The live route is the anchored-selector linearization route. The route packet
describes its purpose as preserving the active export/compression frontier while
pushing the explicit O1a remainder package toward a genuine recurrence-facing
step. The atomic board localizes the remaining pressure inside ticket T10, which
is still open and whose gate story says that the early gates are satisfied while
the live pressure is concentrated in the G3 seam.

The smallest honest next move has already been isolated by the public board:
T10.G3.A2, whose title says that the helper/theorem stack should be promoted into
the realized anchored-selector leaf. This is important. The current frontier is
not a vague research aspiration but a named route with a named ready atom.

== What this route claim means

The claim supported by the current public record is therefore modest but real. It
is not that the weak sunflower problem has been solved. It is that the weak
sunflower pack has moved past generic counting closure and now concentrates its
live pressure on a single route-facing leaf promotion. In a progress paper, that
kind of localization is mathematically meaningful because it replaces diffuse
ambition with a precise open obligation.

= Computational and Formal Evidence

The public bundle for problem $857$ is formalization-aware, but it is not yet a
public formal proof archive for the full weak sunflower problem. The route
packets point to upstream theorem modules named ObstructionGlobalBridge.lean and
ObstructionExport.lean, which shows where formal structure is expected to
interface with the route, but the present public bundle does not expose an
end-to-end theorem chain proving the asymptotic target.

The current compute surface is narrower still. The only packaged compute lane is
the exactness packet for the question whether $M(8, 3) = 45$, equivalently
whether a target-46 SAT instance is unsatisfiable. Its public metadata is precise:
the claim-level goal is exact, the status is "ready for local scout," the
recommendation is "cpu first," and the next honest move is to run a local scout
before any paid rung.

Two boundaries should be kept explicit. First, even a successful exact
certification of $M(8, 3)$ would remain a finite result; it would not by itself
yield the asymptotic estimate $m(n, k) <= C(k)^n$. Second, route packets and
formalization references help organize and verify the frontier, but they do not
authorize a claim that problem $857$ is formally solved.

= Limitations and Next Steps

The main limitation is straightforward: problem $857$ remains open. This paper
records route structure and evidence boundaries, not a completed solution.

Near-term work is concentrated in one clearly named place. The active
anchored-selector leaf is not yet publicly closed, ticket T10 remains open, and
the board identifies T10.G3.A2 as the current dependency-satisfied atom. If one
stays faithful to the present public record, the next move is not vague:
promote the helper/theorem stack into that named leaf, checkpoint it honestly,
and only then ask whether the route merits a stronger public claim.

Broader mathematical questions remain in view as well. One wants the correct
asymptotic growth of $m(n, k)$ for fixed $k$, a clearer understanding of how far
the strongest known $k = 3$ methods can extend, and a better account of how
uniform-sunflower spread and coding methods transfer into genuinely non-uniform
weak-sunflower settings. Those questions remain open, but the current repository
now isolates one precise frontier where further progress can be measured.

= References

#ref-entry[
[1] P. Erdos and R. Rado, *Intersection theorems for systems of sets*,
Journal of the London Mathematical Society 35 (1960), 85-90.
DOI: 10.1112/jlms/s1-35.1.85.
]

#ref-entry[
[2] P. Erdos and D. J. Kleitman, *Extremal problems among subsets of a set*,
Discrete Mathematics 8 (1974), 281-294.
DOI: 10.1016/0012-365X(74)90140-X.
]

#ref-entry[
[3] P. Erdos and E. Szemeredi, *Combinatorial properties of systems of sets*,
Journal of Combinatorial Theory, Series A 24 (1978), 308-313.
DOI: 10.1016/0097-3165(78)90060-2.
]

#ref-entry[
[4] N. Alon, A. Shpilka, and C. Umans, *On sunflowers and matrix multiplication*,
Computational Complexity 22 (2013), 219-243.
DOI: 10.1007/s00037-013-0060-1.
]

#ref-entry[
[5] E. Naslund and W. Sawin, *Upper bounds for sunflower-free sets*,
Forum of Mathematics, Sigma 5 (2017), e15.
DOI: 10.1017/fms.2017.12.
]

#ref-entry[
[6] R. Alweiss, S. Lovett, K. Wu, and J. Zhang, *Improved bounds for the sunflower
lemma*, Annals of Mathematics 194 (2021), 795-815.
DOI: 10.4007/annals.2021.194.3.5.
]

#ref-entry[
[7] A. Rao, *Coding for Sunflowers*, Discrete Analysis 2020:2.
DOI: 10.19086/da.11887.
]

#ref-entry[
[8] T. Bell, S. Chueluecha, and L. Warnke, *Note on sunflowers*,
Discrete Mathematics 344 (2021), 112367.
DOI: 10.1016/j.disc.2021.112367.
]

#ref-entry[
[9] A. Rao, *Sunflowers: from soil to oil*,
Bulletin of the American Mathematical Society 60 (2023), 29-38.
DOI: 10.1090/bull/1777.
]

#ref-entry[
[10] T. F. Bloom, *Erdos Problem #857*, https://www.erdosproblems.com/857,
accessed April 5, 2026.
]
