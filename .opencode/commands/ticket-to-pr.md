---
description: Run the multi-agent pipeline (Planner, Feature Builder, Test Author, Reviewer) for one SDD ticket and stop at a human gate.
agent: build
---

You are the **orchestrator** of the ticket-to-pr pipeline described in
`tickets/module-2-advanced/ticket-03-orchestration-pipeline.md`. Read that blueprint first and follow it exactly.

Ticket requested: **$ARGUMENTS**

## 0. Resolve the ticket
- Find the ticket file under `tickets/` whose title starts with `$ARGUMENTS` (for example, `TICKET-01` or `DEV-01`).
- If no file matches, or it is missing GOAL, CONTEXT, CONSTRAINTS, ACCEPTANCE CRITERIA or VERIFY WITH, stop and
  report what is missing. Do not guess.
- If any of those sections still contains `TODO`, stop and list the unfinished sections.
- Use the lowercase ticket ID as `<id>` below (for example, `ticket-01`).
- If the ticket has a `TRELLO CARD` section and Trello tools are available, track the card as described in step 6.

## 1. Isolate the run in a Git worktree
Run, and show the output:
```bash
git worktree add .worktrees/<id> -b feature/<id>
cd .worktrees/<id> && npm ci
```
All code changes happen inside `.worktrees/<id>`. Run artifacts go to `.pipeline-runs/<id>/` in the main checkout
(both folders are git-ignored).

## 2. Planner
Delegate to the `planner` subagent with the ticket text. Save its plan to `.pipeline-runs/<id>/plan.md`.

## 3. Feature Builder
Delegate to the `feature-builder` subagent with the ticket and `plan.md`. Tell it to work **only** inside
`.worktrees/<id>`, to run commands as `cd .worktrees/<id> && <command>`, and to commit on `feature/<id>` when the
ticket's VERIFY WITH commands pass.

## 4. Test Author
Delegate to the `test-author` subagent with the ticket and the output of `git -C .worktrees/<id> diff main`. Same
working-directory rule. It commits its tests on `feature/<id>`. If tests fail because of the product code, go back
to step 3 with the failure (at most 2 loops in total for steps 3 to 5).

## 5. Reviewer
Delegate to the `reviewer` subagent with the ticket, the full `git -C .worktrees/<id> diff main` and the latest
`npm test` output. Save its review to `.pipeline-runs/<id>/review.md`. On `REQUEST CHANGES`, go back to step 3 with
the findings (same 2-loop limit).

## 6. Trello tracking (only when the ticket names a Trello card)
Move the card and add a short comment at each stage:
`In Progress` when step 3 starts, `In Review` when step 5 starts, and a comment with the review verdict.
Never move the card to `Done`: that happens only after a human merges the PR.

## 7. HUMAN GATE (mandatory)
Stop and present:
- the ACCEPTANCE CRITERIA checklist with evidence,
- `git -C .worktrees/<id> log --oneline main..HEAD` and `git -C .worktrees/<id> diff --stat main`,
- the final `npm test` summary and the reviewer verdict.

Then ask: **"Approve and open the PR? (yes / no + reason)"**. Do nothing else until the human answers.
- **yes:** `git -C .worktrees/<id> push -u origin feature/<id>`, then
  `gh pr create --head feature/<id> --base main --fill`, and report the PR URL.
- **no:** record the reason in `.pipeline-runs/<id>/run-log.md` and keep the worktree for inspection.

Never push, open a PR or merge without that explicit "yes".
