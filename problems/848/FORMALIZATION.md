# Formalization

- Local status: statement-formalized
- Imported formalized state: yes
- Imported formalized last update: 2026-02-01
- Public formalization chatter now includes a Lean development for the sufficiently-large-`N`
  theorem discussed on the public problem thread.
- Public forum claims indicate that the Lean work covers `∃ N0, ∀ N ≥ N0, Problem848Statement N`
  and includes some sample finite checks (`N = 50`, `N = 100`), but not yet a publicly
  stated full finite closure.

Local formalization target:
- keep the statement and the finite-check remainder cleanly separated
- identify exactly which part of Sawhney's result is already formalized
- decide whether this repo should mirror a public formal artifact, link it, or rebuild a
  cleaner local version around the finite completion lane
