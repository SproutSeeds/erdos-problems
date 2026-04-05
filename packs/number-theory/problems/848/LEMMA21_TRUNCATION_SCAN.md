# Problem 848 Lemma 2.1 Truncation Scan

This note closes `N848.G1.A5`.

Question:
- after making Lemma 2.1 explicit, should the next move be a sharper prime-tail bound or a
  different truncation parameter `T`?

Answer:
- the next move should first be a different `T`

## Why the old `T = floor(sqrt(log N))` restriction disappears

In Sawhney's note, `T = floor(sqrt(log N))` is used so that
- `prod_{p <= T} p^2 <= N^(o(1))`

and the small-prime inclusion-exclusion remainder can be hidden inside `N^(o(1))`.

But the explicit one-sided bound in `LEMMA21_EXPLICIT_BOUND.md` does **not** use that
compression. It keeps the discrete remainder as

- `3^m - 1`

with `m = |P_<=|`.

So for the one-sided route, there is no longer a structural need to tie `T` to
`sqrt(log N)`. The argument remains valid for any

- `2 <= T <= N^(1/2)`.

The real question becomes:
- how large can `T` be before the discrete term stops being negligible compared with `N`?

## Scan for the weakest `A*` branch

For the `A*` branch:
- `q = 25`
- `P = {p prime : p ≡ 1 mod 4 and p >= 13}`
- tail-density coefficient: `46/25`
- discrete density: `(23/N) * (3^m - 1)`

The table below compares several truncation choices using the same conservative prime-tail
numerics as `LEMMA21_EXPLICIT_BOUND.md`.

### Candidate thresholds from the public discussion

- `N = exp(1420)`
- `N = exp(1958)`

### Truncation scan

| `T` | `m = #{p <= T : p ≡ 1 mod 4, p >= 13}` | `23 * (3^m - 1)` | `A*` tail density |
| --- | ---: | ---: | ---: |
| `44` | `5` | `5566` | `0.00353682` |
| `100` | `10` | `1,358,104` | `0.00161416` |
| `250` | `23` | `2,165,293,112,998` | `0.00056415` |
| `500` | `43` | `7.55e21` | `0.00025269` |
| `1000` | `79` | `1.13e39` | `0.00011781` |

## What the scan means

### 1. The discrete term stays tiny far beyond `sqrt(log N)`

At the candidate threshold `N = exp(1420)`:
- even `T = 1000` gives discrete density below about `exp(-1330)`

At `N = exp(1958)`:
- the same term is even smaller, below about `exp(-1868)`

So the discrete inclusion-exclusion remainder is not what forces `T = floor(sqrt(log N))`.

### 2. Raising `T` immediately improves the actual live bottleneck

The large-prime tail is the live bottleneck from `LEMMA21_EXPLICIT_BOUND.md`.

But once `T` is allowed to move:
- `T = 100` already pushes the `A*` tail below the full weakest-branch slack
  `0.00238869`
- `T = 250` brings the `A*` tail down to about `0.00056415`
- `T = 500` brings it down further to about `0.00025269`

So the route does not first need a deep new prime-tail theorem just to escape the old
`sqrt(log N)` cage. Re-optimizing `T` already changes the picture materially.

### 3. Prime-tail sharpening is still valuable, but it is now a second-order improvement

Sharper prime-tail estimates would still help:
- they reduce the tail further
- they lower any eventual explicit threshold

But the first decisive move is simpler:
- stop fixing `T = floor(sqrt(log N))`
- choose a larger truncation parameter that keeps the discrete term negligible while
  shrinking the tail

## Honest route consequence

This resolves the question behind `N848.G1.A5`.

The next honest move is:
- keep the explicit one-sided Lemma 2.1 framework
- choose a larger `T`
- carry that choice through Lemma 2.2 and the full weakest-branch budget

The live unresolved question is no longer
- “can Lemma 2.1 be made explicit?”
- or
- “is `sqrt(log N)` the only viable truncation?”

It is:
- “how far does the full `0.0377` branch close once both lemmas use a larger `T`?”
