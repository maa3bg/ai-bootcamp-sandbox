# PO-03: From a Requirement to Tickets and Sub-tickets

> Track exercise for Product Owners. An agent helps you split a business requirement into an epic, stories and
> sub-tasks with acceptance criteria. You challenge and approve the breakdown, then the agent creates the tickets on
> the task board, and every ticket waits for your approval.

## GOAL
Turn REQ-4 into a backlog a team could start on tomorrow: one epic, 3–6 stories that each deliver something a user
can see, and sub-tasks for each story, recorded in a file and created on the mock task board.

## CONTEXT
- The requirement: REQ-4 "Team hours report" in `data/stakeholder-requests.md`.
- The data the report would use: `data/team_metrics.csv`. It has known data problems (see Lab 1, Prompt B).
- The task board is the `mock-board` MCP server, a stand-in for Jira or Trello:
  - Read tools, which run without asking: `list_cards`, `get_card` (it also lists a card's children).
  - Write tools, which always ask you first: `create_card` (type `Epic`, `Story`, `Task` or `Sub-task`, with an
    optional `parent`), `add_comment`, `update_card_status`.
- Board changes live in memory. Restarting OpenCode resets the board, so your breakdown file is the permanent record.
- Good stories are **vertical slices**: each one delivers a visible result on its own, instead of a technical layer
  ("backend", "database"). The INVEST check helps: Independent, Negotiable, Valuable, Estimable, Small, Testable.

## CONSTRAINTS
- Work on your own branch: `git checkout main && git checkout -b po-03`.
- Use the default build agent. No card is created before you have approved the breakdown file.
- Save the breakdown as `tickets/practice/po-03-my-backlog.md`, in this format:
  ```markdown
  # PO-03 backlog: <title>

  ## EPIC: <title>
  <One short paragraph: the goal of the epic.>

  ### STORY: <title>
  As a <role>, I want <capability>, so that <benefit>.

  Acceptance criteria:
  1. <a concrete input and an observable result>
  2. ...

  Sub-tasks:
  - [ ] SUBTASK: <title>

  (one STORY block per story)

  ## OUT OF SCOPE
  - ...

  ## OPEN QUESTIONS
  - ...
  ```
- Every story has the user-story sentence, at least 2 testable acceptance criteria and at least 1 sub-task.
- Do not invent business rules. Anything REQ-4 leaves open goes under `## OPEN QUESTIONS`.
- Do not change any other file.

## TASKS
1. Ask the agent: `Read REQ-4 in data/stakeholder-requests.md and data/team_metrics.csv. Before splitting anything, list the questions you would ask the stakeholder. Do not write any files yet.`
2. Answer the questions you can as the PO. Move the rest to OPEN QUESTIONS.
3. Ask the agent to propose the breakdown in the format above. Challenge it: is every story a vertical slice? Can a
   story be split further? Is "monthly totals" part of this epic?
4. Let the agent write `tickets/practice/po-03-my-backlog.md` (you approve the edit), or save it yourself.
5. Ask the agent to create the tickets on the board: first the epic, then each story with the epic as `parent`, then
   each sub-task with its story as `parent`. Read every `create_card` prompt. **Reject one on purpose** and see how
   the agent reacts.
6. Ask for `list_cards`, then `get_card` on the epic. Check that the hierarchy on the board matches your file.

## ACCEPTANCE CRITERIA
1. [ ] The file has one EPIC, 3–6 STORY blocks, an OUT OF SCOPE section and an OPEN QUESTIONS section with at least
       2 items.
2. [ ] Every story has a user-story sentence, at least 2 numbered acceptance criteria and at least 1 sub-task.
3. [ ] "Monthly totals" is handled on purpose: out of scope, or a separate later story. It is not silently mixed in.
4. [ ] On the board: one Epic, every Story has the Epic as parent, every Sub-task has a Story as parent, and every
       card was created only after your approval.
5. [ ] `git status` shows only the new backlog file.

## VERIFY WITH
```bash
npm run check -- po-03
git status
```

## DEBRIEF QUESTIONS
- Which story did you split or merge after challenging the agent? Why?
- Which of the agent's sub-tasks were really technical decisions for the developers? Should a PO write those?
- REQ-2 asks for something similar. Did you spot the overlap, and what would you do with it?
- How many approvals did it take to fill the board? Which board actions would you let an agent do without asking?
