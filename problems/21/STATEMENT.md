# Problem 21 Statement

Source: <https://www.erdosproblems.com/21>

Normalized focus:
- Let $f(n)$ be minimal such that there is an intersecting family $\mathcal{F}$ of sets of size $n$ (so $A\cap B\neq\emptyset$ for all $A,B\in \mathcal{F}$) with $\lvert \mathcal{F}\rvert=f(n)$ such that any set $S$ with $\lvert S\rvert \leq n-1$ is disjoint from at least one $A\in \mathcal{F}$.
- Seeded with filtered statement candidates from the public site snapshot

Statement candidates:
- Let $f(n)$ be minimal such that there is an intersecting family $\mathcal{F}$ of sets of size $n$ (so $A\cap B\neq\emptyset$ for all $A,B\in \mathcal{F}$) with $\lvert \mathcal{F}\rvert=f(n)$ such that any set $S$ with $\lvert S\rvert \leq n-1$ is disjoint from at least one $A\in \mathcal{F}$.
- Is it true that\[f(n) \ll n?\]
- Conjectured by Erdős and Lovász [ErLo75] , who proved that\[\frac{8}{3}n-3\leq f(n) \ll n^{3/2}\log n\]for all $n$. The upper bound was improved by Kahn [Ka92b] to\[f(n) \ll n\log n.\](The upper bound constructions in both cases are formed by taking a random set of lines from a projective plane of order $n-1$, assuming $n-1$ is a prime power.)
- This problem was solved by Kahn [Ka94] who proved the upper bound $f(n) \ll n$. The Erdős-Lovász lower bound of $\frac{8}{3}n-O(1)$ has not been improved, and it has been speculated (see e.g. [Ka94] ) that the correct answer is $3n+O(1)$.

Public-site preview:
- PROVED
- This has been solved in the affirmative.
- - $500
- Let $f(n)$ be minimal such that there is an intersecting family $\mathcal{F}$ of sets of size $n$ (so $A\cap B\neq\emptyset$ for all $A,B\in \mathcal{F}$) with $\lvert \mathcal{F}\rvert=f(n)$ such that any set $S$ with $\lvert S\rvert \leq n-1$ is disjoint from at least one $A\in \mathcal{F}$.
- Is it true that\[f(n) \ll n?\]
- #21 : [Er81] [Er90] [Er92b] [Er97f]
