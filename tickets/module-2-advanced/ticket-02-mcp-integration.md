# TICKET-02: Synchronise the Mock Task Board with the Repository via MCP

## GOAL
Use the `mock-board` MCP server (a stand-in for Jira/Trello) to produce an accurate status
report of the bootcamp board, then update **one** card, with every write approved by a human.

## CONTEXT
- MCP server: `mock-board`, configured in `.opencode/opencode.json`, implemented in
  `scripts/mock-board-mcp.js`, seed data in `data/mock-board.json`.
- Tools exposed by the server:

  | Tool                 | Type  | Purpose                                     |
  |----------------------|-------|---------------------------------------------|
  | `list_cards`         | read  | List cards, optionally filtered by `status` |
  | `get_card`           | read  | Full details and comments of one card       |
  | `update_card_status` | write | Move a card to another column               |
  | `add_comment`        | write | Append a comment to a card                  |

- Valid statuses: `To Do`, `In Progress`, `In Review`, `Done`.
- Board changes are held in memory and reset when the MCP server restarts. The seed file on disk
  is never modified, so you can repeat the exercise.
- Repository sources of truth: `tickets/`, `tests/filters.test.js`, `data/team_metrics.csv`.

## CONSTRAINTS
- Start with read-only tools. Do not call a write tool until the report (task 1) has been shown.
- Do not edit any file in the repository. This ticket only touches the external board.
- Before any write action, show the human the exact tool name and arguments, then wait for approval.
  If the human rejects it, record the rejection in the report and continue.
- Do not invent card IDs, statuses or assignees. Use only what the tools return.

## TASKS
1. List all cards and produce a Markdown table: `ID | Title | Status | Assignee | Linked ticket`.
2. For card `BOOT-102`, compare the card with `tickets/module-1-basic/ticket-01-sdd.md` and the
   current result of `npm test`. Is the card's status accurate?
3. Propose (do not yet execute) a status change and a comment for `BOOT-102` that reflect reality.
4. After human approval, execute the proposed `add_comment` and `update_card_status` calls.
5. Call `get_card` for `BOOT-102` again and show that the board now matches your proposal.

## ACCEPTANCE CRITERIA
1. [ ] The board report lists every card returned by `list_cards`, with no invented data.
2. [ ] The proposal cites evidence (test output or file contents) for the new status.
3. [ ] Each write action triggered an approval prompt before it ran.
4. [ ] The final `get_card` output matches the approved proposal.
5. [ ] `git status` shows no changes to tracked files caused by this ticket.

## VERIFY WITH
```bash
git status
```
