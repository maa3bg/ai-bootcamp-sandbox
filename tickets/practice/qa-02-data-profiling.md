# QA-02: Data-Quality Profiling of `team_metrics.csv` with a Read-Only Agent

> Track exercise for QA engineers and data analysts. You build the agent yourself.

## GOAL
Create a read-only `data-profiler` agent and use it to produce a data-quality report for `data/team_metrics.csv`
that a developer could turn into validation rules.

## CONTEXT
- Dataset: `data/team_metrics.csv` (columns: `team_member, role, hours_logged, date, status`).
- Reference for agent files: `.opencode/agents/reviewer.md` (read-only guardrails).
- The report is returned in the chat. The agent must not be able to write it to disk.

## CONSTRAINTS
- The agent file is `.opencode/agents/data-profiler.md` with `permission: edit: deny, bash: deny, webfetch: deny`.
- The agent must not "fix" the data. It only describes it.
- Every finding must cite the row number(s) it is based on. No finding without evidence.

## ACCEPTANCE CRITERIA
1. [ ] The agent file exists, has a `description`, and loads in OpenCode (it appears in the agent list).
2. [ ] The report has a table: `Check | Rows affected | Example value | Severity | Suggested validation rule`.
3. [ ] The report covers at least: missing values, inconsistent date formats, inconsistent role casing,
       duplicate rows, rows without an identity (empty `team_member`), and values that contradict other sources
       (compare `status` with the users in `src/App.js`).
4. [ ] When you ask the agent to "clean the file", it refuses and explains its read-only role.

## VERIFY WITH
```bash
opencode agent list
git status   # the CSV must be unchanged
```
