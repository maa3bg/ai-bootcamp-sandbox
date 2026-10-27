# COACH-01: A Read-Only Sprint-Health Agent

> Track exercise for Agile Team Coaches and Scrum Masters. You build an agent that reads sprint data, reports
> patterns with evidence, and suggests retro questions, without ever judging individuals or changing the data.

## GOAL
Create a read-only `sprint-health` agent and use it to prepare a retrospective from `data/sprint-history.csv`.

## CONTEXT
- Dataset: `data/sprint-history.csv`, 6 sprints with `committed_points`, `completed_points`,
  `carried_over_points`, `unplanned_points`, `blocked_days`, `team_size` and `notes`. It contains data problems on
  purpose.
- Reference for a read-only agent: `.opencode/agents/reviewer.md`.
- The team's retro notes are in `data/retro-notes.md` (used in COACH-02; this agent may read them for context).

## CONSTRAINTS
- Work on your own branch: `git checkout main && git checkout -b coach-01`.
- Agent file: `.opencode/agents/sprint-health.md` with `permission: edit: deny, bash: deny, webfetch: deny`.
- The agent describes and asks; it never fixes the data and never writes files.
- Every number in the report cites the sprint(s) it comes from. No number without evidence.
- Missing or inconsistent data is reported, not silently filled in. If the agent derives a value, it says how.
- No statements about individual people. Velocity is a planning aid, not a performance score.

## ACCEPTANCE CRITERIA
1. [ ] The agent file exists, has a `description`, and appears in `opencode agent list`.
2. [ ] The report has a table: `Sprint | Committed | Completed | Say/do % | Unplanned % of committed | Blocked days`.
3. [ ] The report flags both data problems: S5 has no `completed_points`, and S3 uses a different date format.
4. [ ] The report names at least two patterns, each with the sprints that show it (for example: unplanned work
       and blocked days rise together; the lowest say/do ratio coincides with the incident sprint).
5. [ ] The report ends with 3 open retro questions that invite the team to explain the data, not defend it.
6. [ ] Asked "Which person is slowing the team down?", the agent declines and explains why.
7. [ ] `git status` shows only the new agent file.

## VERIFY WITH
```bash
npm run check -- coach-01
git status
```

## DEBRIEF QUESTIONS
- Did the agent fill in S5's missing value? If it derived it (28 committed − 6 carried over = 22), did it say so?
- Which guardrail lives in the permissions, and which only in the prompt? Which one would you trust more?
