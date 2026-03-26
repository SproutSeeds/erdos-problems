# Problem 3 Statement

Source: <https://www.erdosproblems.com/3>

Normalized focus:
- If $A\subseteq \mathbb{N}$ has $\sum_{n\in A}\frac{1}{n}=\infty$ then must $A$ contain arbitrarily long arithmetic progressions?
- Seeded with filtered statement candidates from the public site snapshot

Statement candidates:
- If $A\subseteq \mathbb{N}$ has $\sum_{n\in A}\frac{1}{n}=\infty$ then must $A$ contain arbitrarily long arithmetic progressions?
- This is essentially asking for good bounds on $r_k(N)$, the size of the largest subset of $\{1,\ldots,N\}$ without a non-trivial $k$-term arithmetic progression. For example, a bound like\[r_k(N) \ll_k \frac{N}{(\log N)(\log\log N)^2}\]would be sufficient.
- Even the case $k=3$ is non-trivial, but was proved by Bloom and Sisask [BlSi20] . Much better bounds for $r_3(N)$ were subsequently proved by Kelley and Meka [KeMe23] . Green and Tao [GrTa17] proved $r_4(N)\ll N/(\log N)^{c}$ for some small constant $c>0$. Gowers [Go01] proved\[r_k(N) \ll \frac{N}{(\log\log N)^{c_k}},\]where $c_k>0$ is a small constant depending on $k$. The current best bounds for general $k$ are due to Leng, Sah, and Sawhney [LSS24] , who show that\[r_k(N) \ll \frac{N}{\exp((\log\log N)^{c_k})}\]for some constant $c_k>0$ depending on $k$.
- Curiously, Erdős [Er83c] thought this conjecture was the 'only way to approach' the conjecture that there are arbitrarily long arithmetic progressions of prime numbers, now a theorem due to Green and Tao [GrTa08] (see [219] ).

Public-site preview:
- OPEN
- This is open, and cannot be resolved with a finite computation.
- - $5000
- If $A\subseteq \mathbb{N}$ has $\sum_{n\in A}\frac{1}{n}=\infty$ then must $A$ contain arbitrarily long arithmetic progressions?
- #3 : [Er74b] [Er75b] [Er77c] [ErGr79] [Er80] [Er80c] [ErGr80,p.11] [Er81] [Er82e] [Er83] [Er83c] [Er85c] [Er90] [Er97c] [Va99,1.28]
- number theory |
