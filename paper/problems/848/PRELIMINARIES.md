# Preliminaries

Write `[N] := {1, ..., N}`. A set `A subseteq [N]` is called admissible for Problem `848`
when `ab + 1` is never squarefree for every pair `a, b in A`. The public problem asks for
the extremal size and structure of such admissible sets. The residue classes
`7 mod 25` and `18 mod 25` play a distinguished role throughout the public record, so it
is convenient to write

- `R_7(N) := {n in [N] : n equiv 7 mod 25}`
- `R_18(N) := {n in [N] : n equiv 18 mod 25}`

The public theorem shape recorded on the problem page has two layers. First, there is an
extremal statement asserting that sufficiently large admissible sets cannot beat the
obvious `1/25`-density obstruction coming from `R_7(N)`. Second, Sawhney's public note
includes a stability statement: for sufficiently large `N`, every near-extremal admissible
set is contained in either `R_7(N)` or `R_18(N)`. This paper bundle works on that second
layer, because it is the route currently best suited to explicit threshold extraction.

The repo's current witness uses three parameters that should be read as route data, not as
finished theorem constants:

- threshold candidate `N >= exp(1420)`
- truncation parameter `T = 250`
- stability slack `eta = 10^-4`

These values are not introduced as optimal or final. They are the present parameters for
which the explicit ledgers in the repo control every public branch of the proof skeleton
simultaneously. When this paper refers to the "current repo candidate," it means exactly
that explicit witness package and nothing stronger.

Finally, the repo distinguishes three kinds of evidence. Public theorem authority comes
from the problem page and Sawhney's note. Public formalization chatter contributes support
evidence about asymptotic coverage and small sample checks. Repo-native ledgers record the
explicit numerical and bookkeeping work that turns the public asymptotic skeleton into a
reviewable threshold candidate. Keeping those layers separate is part of the mathematics,
not just editorial hygiene.
