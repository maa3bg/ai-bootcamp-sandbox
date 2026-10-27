# PO-02: Backlog Refinement on the Board with MCP

> Track exercise for Product Owners. You use the `mock-board` MCP server (a stand-in for Jira or Trello) to refine
> a vague card, and you approve every change before it reaches the board.

## GOAL
Make the board honest and ready for development: decide what to do with the vague card `BOOT-101`, and write
refined acceptance criteria onto the board, with every write approved by you.

## CONTEXT
- MCP server `mock-board`: read tools `list_cards`, `get_card`; write tools `add_comment`, `update_card_status`.
  Reads run without asking; writes always ask (see `.opencode/opencode.json`).
- `BOOT-101` "Search is slow and people are missing" links to the vague `tickets/module-1-basic/ticket-00-vague.md`.
- `BOOT-102` links to `tickets/module-1-basic/ticket-01-sdd.md`, the refined version of the same problem.
- Board changes live in memory only. Restart OpenCode to reset the board and try again.

## CONSTRAINTS
- Use the default build agent, on the `main` branch (`git checkout main`). Do not edit any file in the repository.
- Before any write, the agent must show you the exact tool and arguments. Reject at least one write on purpose.
- Do not invent card IDs, people or statuses. Use only what the tools return.

## TASKS
1. Ask the agent for a table of all cards: `ID | Title | Status | Assignee | Linked ticket`.
2. Ask it to compare `BOOT-101` with `BOOT-102` and their linked tickets. Are they the same problem?
3. Decide as the PO: keep `BOOT-101` as its own item, or close it as a duplicate of `BOOT-102`. Ask the agent to
   draft a comment for `BOOT-101` that records your decision and its reason.
4. Ask the agent to draft 3–5 acceptance criteria for `BOOT-102` in plain language a stakeholder understands, and
   to add them as a comment.
5. Approve or reject each write. Then ask for `get_card` on both cards and check the result.

## ACCEPTANCE CRITERIA
1. [ ] The card table matches `list_cards` exactly (4 cards, no invented data).
2. [ ] Your decision on `BOOT-101` is recorded as a comment, with a reason that cites the linked tickets.
3. [ ] `BOOT-102` has a comment with 3–5 acceptance criteria that a non-developer can check.
4. [ ] Every write triggered an approval prompt, and at least one was rejected.
5. [ ] `git status` shows no changes to tracked files.

## VERIFY WITH
```bash
npm run check -- po-02
```

## DEBRIEF QUESTIONS
- Which actions on your real board would you allow an agent to do without asking? Which never?
- How did the agent's draft acceptance criteria differ from the ones in `ticket-01-sdd.md`?
