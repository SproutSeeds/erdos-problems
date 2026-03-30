## Before marking ready for review

- [ ] I opened this PR from a branch, not from direct edits to `main`
- [ ] I am using draft PR status until the submission is actually ready for review
- [ ] I filled out the sections below completely
- [ ] I ran the relevant commands locally
- [ ] CI is green or I have explained what is still failing
- [ ] I removed secrets, local paths, and private correspondence

## Linked issue

Link the issue this PR closes or continues. If there is no issue, say why.

## Summary

Describe the change in a few lines.

## Truth layer touched

- imported snapshot / drift tooling
- canonical dossier data
- pack-specific harness data
- paper or formal public artifacts
- CLI/runtime behavior
- docs / collaboration structure

## Evidence and claim posture

- Smallest honest claim this PR makes:
- Claim level if relevant: `Exact | Verified | Heuristic | Conjecture | n/a`
- What evidence, packets, or references support it:
- What remains open:

## Commands run

List the commands or tests you ran.

## Ready-for-review checklist

- [ ] the summary matches the actual diff
- [ ] the truth layer touched is named correctly
- [ ] status, formalization, or route changes are called out explicitly
- [ ] any new evidence is presented in a reviewable way
- [ ] this PR is still a draft if the work is exploratory or incomplete

## Notes

- call out any status or formalization changes explicitly
- call out any pack or atomic-board changes explicitly
- note whether the change should ship in npm or remain repo-only
- note whether maintainers should expect follow-up issues or PRs
