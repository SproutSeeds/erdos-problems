# Related Work

The public problem page already places Problem `848` in a partially developed literature
landscape. As summarized there, earlier density work of van Doorn and Weisenberg shows why
the extremal scale is constrained near `1/25`, even before the modern sufficiently-large
`N` theorem enters. For the purposes of this bundle, those results matter mainly as
structural background: they explain why the residue-class model is not an isolated guess,
but part of a broader density picture attached to the problem.

Sawhney's public note is the decisive modern input. It supplies the sufficiently-large-`N`
theorem and the stability statement that near-extremal admissible sets are forced into the
`7 mod 25` or `18 mod 25` class. The current repo route is best understood as an
explicitization program for that public proof skeleton. It does not introduce a different
asymptotic strategy. Instead, it asks how far the published argument can be pushed toward a
concrete threshold with claim-safe bookkeeping and numerically certified remainder bounds.

There is also a growing public formalization layer around the problem. The imported atlas
marks the statement as formalized, and the public Lean threads linked from the dossier
discuss an asymptotic theorem statement together with small sample finite checks. That work
is valuable support context, but the present paper does not treat it as a substitute for a
full explicit threshold proof or a full finite closure. Here it functions as a neighboring
verification track rather than the main theorem authority.

This paper is complementary to all of the above. It is not a historical survey and not a
claim of final resolution. Its role is to consolidate the public theorem page, the public
note, the forum discussion, and the repo's explicit ledgers into one reviewable record of
the current frontier: what is already controlled, what remains merely candidate-level, and
what the next collaborator should actually inspect.
