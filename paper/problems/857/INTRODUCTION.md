# Introduction

The sunflower problem sits near the center of modern extremal set theory. In its
classical form, initiated by Erdos and Rado, one asks how large a family of sets
of bounded size can be before a sunflower must appear. Problem `857` records the
non-uniform or weak version: for fixed `k`, determine the least `m(n,k)` such
that every family of `m(n,k)` subsets of `[n]` contains a `k`-sunflower. The
public Erdos Problems page keeps this problem open and emphasizes the goal of
bounding `m(n,k)` by `C(k)^n`.

This weak formulation is broader than the uniform sunflower lemma and interacts
with several major themes in recent combinatorics. For `k = 3`, the problem is
closely tied to cap-set-type phenomena, as highlighted by Alon, Shpilka, and
Umans, and the best quoted asymptotic upper bound on the problem page comes from
Naslund and Sawin. At the same time, progress on the uniform sunflower lemma by
Alweiss, Lovett, Wu, and Zhang, followed by Rao and by Bell, Chueluecha, and
Warnke, has reshaped the methodological landscape and clarified which kinds of
spread, entropy, and coding ideas are now available.

The purpose of this paper is narrower than a complete solution. We convert the
current public record for problem `857` into a mathematically legible progress
paper. The main value added here is organizational and expository: we identify
the active route, separate closed support layers from live frontier work, and
state exactly what the present public compute and formalization packets do and do
not show. This is important because the repo now contains genuine route
structure, but not yet a public theorem text closing the asymptotic weak
sunflower problem.

Our central public claim is therefore modest and precise. The current weak
sunflower pack is no longer bottlenecked on generic counting closure. Its live
public frontier is the route `anchored_selector_linearization`, and the smallest
honest next move is the ready atom `T10.G3.A2`, which promotes the current
helper/theorem stack into the named leaf
`anchored_selector_linearization_realized`. Everything in this paper is written
to preserve that distinction between route progress and problem closure.

The paper is organized as follows. Section 2 fixes notation and recalls the weak
sunflower problem and the most relevant background. Section 3 places the present
route in the wider literature. Sections 4 through 6 record the exact public
results, their dependency chain, and the remaining proof obligations. Section 7
separates formalization posture from the narrow exact-computation packet around
`M(8,3)`. Section 8 lists the limitations of the present route and the clearest
open next steps.
