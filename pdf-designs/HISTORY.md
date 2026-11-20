# PDF designs: history

This folder is the RAM Handover Report PDF design, brought in with its full git history from
`easyvibesuxui-sketch/syn-pdf-and-mail` (branch `claude/ram-handover-templates`), where it was built in the
"PDF designs" session (9–12 November 2026). Run `git log 07aca91^2` to see the original commits; the files
sit under `pdf-designs/` here.

- Template and how to build it: [`pdf/ram-handover/README.md`](pdf/ram-handover/README.md)
- Every variant, in English and German, as HTML, JSON data and printed PDF: `pdf/ram-handover/examples/`
- Review page with comments: https://claude.ai/artifact/2UkZ3Mc3y3zWPTeMs5sWyY (Handover Report Review)
- Build: `npm run handover`, `npm run handover:pdf`, `npm run handover:review` from this folder (needs Playwright)

## Changes, oldest first

| Date | Change |
| --- | --- |
| 2026-11-09 | Start the repository for syniotec PDFs and emails |
| 2026-11-09 | Add the RAM Handover Report as an HTML print template |
| 2026-11-09 | Handover report: template tabs, field types and Last Answer on every field |
| 2026-11-09 | Handover report: self-host the licensed ABC Favorit fonts |
| 2026-11-09 | Handover report: review page for comments, closing page fits |
| 2026-11-09 | Handover report: design review round 1, applied to every field |
| 2026-11-09 | Handover report: ABC Favorit baseline, 4px icon gaps, page number margin |
| 2026-11-09 | Handover report: one Last Answer size set, larger images, caption gap |
| 2026-11-09 | Handover report: no adjacent-sibling selectors, so the review page matches print |
| 2026-11-09 | Handover report: grey one-size icons, shared baselines, 64px images |
| 2026-11-09 | Handover report: icons centred on their text, measured on the print |
| 2026-11-09 | Handover report: field types on the review page, rating comment inline |
| 2026-11-09 | Handover report: no tab title left alone at a page bottom |
| 2026-11-09 | Handover report: Last Answer title back to 6pt |
| 2026-11-09 | Handover report: Last Answer title in the answer's type, grey |
| 2026-11-09 | Handover report: review comments on galleries, rating, Yes/No and groups |
| 2026-11-09 | Handover report: group condition reads Okay / Not okay |
| 2026-11-09 | Handover report: Condition only in groups, Okay in black |
| 2026-11-09 | Handover report: Yes / No has all three answers everywhere |
| 2026-11-09 | Handover report: every report laid out the same way |
| 2026-11-09 | Handover report: Yes / No is one field, a group is Yes / No / Not relevant |
| 2026-11-09 | Handover report: group questions follow the app's questionnaire |
| 2026-11-12 | Handover report: review pass, content of any length stays on the page |
