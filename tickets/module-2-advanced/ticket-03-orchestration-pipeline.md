# TICKET-03: `/ticket-to-pr` Multi-Agent Orchestration Pipeline (Blueprint)

## GOAL
Turn one SDD ticket into a reviewed, test-backed pull request through a chain of specialised
agents, ending at a mandatory **human approval gate**.

## USAGE
```text
/ticket-to-pr <TICKET-ID>

# example
/ticket-to-pr TICKET-01
```
`<TICKET-ID>` resolves to the matching file under `tickets/` (for example, `TICKET-01` resolves to
`tickets/module-1-basic/ticket-01-sdd.md`). If no file matches, or the file is missing any of
GOAL / CONTEXT / CONSTRAINTS / ACCEPTANCE CRITERIA / VERIFY WITH, the pipeline stops and asks
for a proper spec (TICKET-00 shows why).

## PIPELINE OVERVIEW
```text
  [1] Planner ---plan.md---> [2] Feature Builder ---commits---> [3] Test Author ---test report---> [4] Reviewer ---verdict---> [5] HUMAN GATE
   read-only                    edit + bash                        edit + bash                       read-only                    approve / reject
                                     ^                                                                   |
                                     +------------------ REQUEST CHANGES (max 2 loops) -----------------+
```

| # | Agent             | Defined in                            | Permissions              | Input                         | Output                                   |
|---|-------------------|---------------------------------------|--------------------------|-------------------------------|------------------------------------------|
| 1 | `planner`         | `.opencode/opencode.json` (`agent`)     | edit: deny, bash: deny   | Ticket file, codebase         | `plan.md`: steps, files, risks, AC map   |
| 2 | `feature-builder` | `.opencode/agents/feature-builder.md` | edit: allow, bash: allow | Ticket + `plan.md`            | Code commits on the feature branch       |
| 3 | `test-author`     | `.opencode/agents/test-author.md`     | edit: allow, bash: allow | Ticket + diff                 | New Jest tests + `npm test` report       |
| 4 | `reviewer`        | `.opencode/agents/reviewer.md`        | edit: deny, bash: deny   | Ticket + full diff + test log | Findings, suggested diffs, verdict       |
| 5 | **Human**         | n/a                                   | n/a                      | Everything above              | Approve to open the PR, or reject with a reason |

## ISOLATION: ONE GIT WORKTREE PER RUN
Each run works in its own worktree, so the main checkout and parallel runs are never touched:
```bash
git worktree add .worktrees/<ticket-id> -b feature/<ticket-id>
cd .worktrees/<ticket-id>
npm ci
# ... stages 2 and 3 work and commit here ...
git worktree remove .worktrees/<ticket-id>   # once the PR is merged or rejected
```
- The Planner and Reviewer only read; they cannot write anywhere.
- The Feature Builder and Test Author commit on `feature/<ticket-id>` inside the worktree.
- Nothing is pushed before the human gate.

## HAND-OFF CONTRACT
Each stage hands its result to the next as an explicit Markdown artifact, never as implicit memory:
1. **Planner to Feature Builder:** `plan.md` mapping each acceptance criterion to the file(s) and step(s) that satisfy it.
2. **Feature Builder to Test Author:** commit SHA(s), changed files, and the output of the ticket's `VERIFY WITH` commands.
3. **Test Author to Reviewer:** added tests, edge cases covered (`qa-edge-cases` skill), and the full `npm test` output.
4. **Reviewer to Human:** verdict (`APPROVE` or `REQUEST CHANGES`), findings with `file:line`, and suggested diffs.

## HUMAN-IN-THE-LOOP GATE
The pipeline **always stops here**, even when the Reviewer approves. The human checks:
- [ ] Every acceptance criterion in the ticket is met, with evidence.
- [ ] `npm test` passes in the worktree, and no existing test was modified or deleted.
- [ ] The diff only touches files allowed by the ticket's CONSTRAINTS.
- [ ] No credentials, secrets or hardcoded environment values were introduced (`AGENTS.md`).

On approval:
```bash
git push -u origin feature/<ticket-id>
gh pr create --fill --base main
```
On rejection, the reason is recorded in the run log and the worktree is kept for inspection.

## FAILURE HANDLING
- `REQUEST CHANGES` from the Reviewer sends the findings back to the Feature Builder. After **2**
  loops without approval, the pipeline escalates to the human gate with the findings still open.
- A failing `npm test` after the Test Author stage is **not** fixed by the Test Author. It goes back
  to the Feature Builder, because tests describe the spec.
- An agent that hits a permission denial reports it and stops. It never looks for a workaround.

## ACCEPTANCE CRITERIA (for the exercise)
1. [ ] `/ticket-to-pr TICKET-01` produces a `plan.md`, a feature-branch commit, new tests and a review.
2. [ ] The Reviewer stage made no file writes (compare `git status` before and after it).
3. [ ] The run stopped at the human gate, and no branch was pushed without your approval.
4. [ ] After approval, `npm test` passes on the feature branch.
