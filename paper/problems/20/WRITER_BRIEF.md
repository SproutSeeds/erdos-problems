# Erdos Problem #20 Writer Brief

Mission:
- turn the current public record for **Strong Sunflower Problem** into a paper draft that is readable, citation-safe, and claim-safe
- preserve privacy boundaries while making the paper bundle easy for agents and future researchers to extend

Hard rules:
- do not include secrets, tokens, private messages, unpublished private notes, or local absolute paths
- treat only the canonical repo record and explicitly cited public sources as publication inputs
- cite every nontrivial external claim in `CITATION_LEDGER.md` before relying on it in prose
- distinguish rigorously between theorem/proposition, conjecture, heuristic, and computational evidence
- leave open seams visible and move them into `LIMITATIONS_AND_OPEN_PROBLEMS.md` instead of hiding them

Recommended loop:
1. Read `MANIFEST.json` and `PUBLIC_EVIDENCE_INDEX.json`.
2. Read the suggested inputs in `SECTION_INDEX.json`.
3. Update `OUTLINE.md` and `SECTION_STATUS.md` before drafting.
4. Add external literature rows to `CITATION_LEDGER.md` as soon as a source enters the draft.
5. Write or refine section files one at a time.
6. Run the checklist in `PRIVACY_REVIEW.md` before public release or PR submission.

Current public status:
- paper mode: claim_safe_progress_or_route_paper
- site status: open
- repo status: active
- active route: uniform_k3_frontier
- imported record included: yes

Section files in this bundle:
- ABSTRACT.md: State the exact scope of the paper and separate proved statements from targets or heuristics.
- INTRODUCTION.md: Explain why the problem matters, what the current route is, and how the paper is organized.
- PRELIMINARIES.md: Define notation, setup, and prior results that the rest of the paper relies on.
- RELATED_WORK.md: Place the current route in the context of prior literature and nearby approaches.
- MAIN_RESULTS.md: List the exact theorems, propositions, or route claims supported by the current public record.
- PROOF_OVERVIEW.md: Give the roadmap of the argument and the dependency chain between major steps.
- PROOF_DETAILS.md: Write the technical proof content or the best current public decomposition when the proof is incomplete.
- COMPUTATIONAL_AND_FORMAL_EVIDENCE.md: Summarize computational packets, certificates, and formalization posture without inflating them into stronger claims.
- LIMITATIONS_AND_OPEN_PROBLEMS.md: Leave a clean handoff for the next researcher with honest boundaries and unresolved tasks.
