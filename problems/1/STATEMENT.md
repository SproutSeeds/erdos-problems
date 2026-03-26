# Problem 1 Statement

Source: <https://www.erdosproblems.com/1>

Normalized focus:
- If $A\subseteq \{1,\ldots,N\}$ with $\lvert A\rvert=n$ is such that the subset sums $\sum_{a\in S}a$ are distinct for all $S\subseteq A$ then\[N \gg 2^{n}.\]
- Seeded with filtered statement candidates from the public site snapshot

Statement candidates:
- If $A\subseteq \{1,\ldots,N\}$ with $\lvert A\rvert=n$ is such that the subset sums $\sum_{a\in S}a$ are distinct for all $S\subseteq A$ then\[N \gg 2^{n}.\]
- Erdős called this 'perhaps my first serious problem' (in [Er98] he dates it to 1931). The powers of $2$ show that $2^n$ would be best possible here. The trivial lower bound is $N \gg 2^{n}/n$, since all $2^n$ distinct subset sums must lie in $[0,Nn)$. Erdős and Moser [Er56] proved\[ N\geq (\tfrac{1}{4}-o(1))\frac{2^n}{\sqrt{n}}.\](In [Er85c] Erdős offered \$100 for any improvement of the constant $1/4$ here.)
- A number of improvements of the constant have been given (see [St23] for a history), with the current record $\sqrt{2/\pi}$ first proved in unpublished work of Elkies and Gleason. Two proofs achieving this constant are provided by Dubroff, Fox, and Xu [DFX21] , who in fact prove the exact bound $N\geq \binom{n}{\lfloor n/2\rfloor}$.
- In [Er73] and [ErGr80] the generalisation where $A\subseteq (0,N]$ is a set of real numbers such that the subset sums all differ by at least $1$ is proposed, with the same conjectured bound. (The second proof of [DFX21] applies also to this generalisation.) This generalisation seems to have first appeared in [Gr71] .

Public-site preview:
- OPEN
- This is open, and cannot be resolved with a finite computation.
- - $500
- If $A\subseteq \{1,\ldots,N\}$ with $\lvert A\rvert=n$ is such that the subset sums $\sum_{a\in S}a$ are distinct for all $S\subseteq A$ then\[N \gg 2^{n}.\]
- #1 : [Er56] [Er57] [Er59] [Er61] [Er65b] [Er69] [Er70b] [Er70c] [Er73] [BeEr74,p.619] [ErSp74] [Er75b] [Er77c] [ErGr80,p.59] [Er81] [Er82e] [Er85c] [Er90] [Er91] [Er92b] [Er95,p.165] [Er97c] [Er98] [Va99,1.20]
- number theory |
