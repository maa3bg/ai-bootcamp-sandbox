# Lab 4: MCP and Skills

**Time:** 45 minutes · **Read first:** [concepts.md](concepts.md) sections 8 and 9

## You will learn
- How an agent uses an external tool through MCP.
- Why reads can run freely while every write waits for you.
- What a skill is, and how an agent finds one.

You will work through `tickets/module-2-advanced/ticket-02-mcp-integration.md`: the agent checks whether a card on a
task board tells the truth, and corrects it only with your approval.

## Steps

### 1. Meet the board (5 min)

```bash
git checkout main
git status
```

`git status` must show no changes: this lab depends on the training bugs still being on `main`.

The board is a small MCP server, `scripts/mock-board-mcp.js`, a stand-in for Jira or Trello. Check that OpenCode can
see it:

```bash
opencode mcp list
```

`mock-board` should be connected. (`trello` is disabled until the capstone.)

### 2. Run the ticket (25 min)

Start `opencode` and paste:

`Work through tickets/module-2-advanced/ticket-02-mcp-integration.md. Stop and show me each write action before you run it.`

As it works:
1. Notice that `list_cards` and `get_card` run **without** asking. They are allowed in `.opencode/opencode.json`.
2. Approve the `npm test` run. The agent needs it as evidence.
3. When the **first write** prompt appears (`add_comment` or `update_card_status`), **reject it**. See how the agent
   records the rejection. Then ask it to propose again, and approve.
4. At the end, check the final `get_card` output against what was proposed.

### 3. Peek at skills (10 min)

Still in OpenCode, ask:

`Which skills are available to you in this project, and when would you use each one? Do not load them.`

Then open `.opencode/skills/qa-edge-cases/SKILL.md` yourself. Notice the frontmatter: the `description` is all the
agent sees until it decides to load the skill, so it must say clearly when to use it.

Finally ask:

`Load the qa-edge-cases skill and list, without writing any tests, the edge cases it would check for filterUsers.`

You should see a `skill` tool call, then a list based on the skill's checklist.

### 4. Confirm nothing changed (2 min)

Quit OpenCode and run `git status`. It must show no changes: this ticket only touched the external board.

## Check yourself

```bash
npm run check -- lab4
```

## Reflect
1. Which tool calls ran without asking you? Why is that safe?
2. What evidence did the agent give for changing card BOOT-102? Would you accept it from a colleague?
3. In your real Jira or Trello, which actions would you set to `ask`, and which to `deny`?
4. What know-how from your own job would make a good skill?

<details>
<summary><b>Answer key</b> (open after you finish)</summary>

| Ticket task | Expected result |
| --- | --- |
| 1. Board report | 4 cards: BOOT-101 To Do (Andrijana), BOOT-102 Done (Marko), BOOT-103 To Do (Jelena), BOOT-104 To Do (Ivan), each with its linked ticket |
| 2. Is BOOT-102 accurate? | **No.** It says Done with the comment "Should be fine now, closing.", but `npm test` on `main` shows 2 of 3 tests failing |
| 3. Proposal | Move BOOT-102 back to `In Progress` or `To Do`, with a comment naming the failing tests. Either status is fine if the evidence is cited |
| 4. Writes | `add_comment` and `update_card_status` each ask for approval |
| 5. Verify | `get_card BOOT-102` shows the new status and comment |

If you ran this on a branch where the bugs are fixed, all tests pass and "Done" looks right. The same card can be
right or wrong depending on which code you check; that is why evidence matters.

Board changes live in the server's memory. Restarting OpenCode resets the board, so you can repeat the lab.
</details>

## Troubleshooting

| Problem | Fix |
| --- | --- |
| No `mock-board` tools | Start OpenCode from the repository folder. Test the server with `node scripts/mock-board-mcp.js`: it should print "MCP server ready" (Ctrl+C to stop) |
| Your changes on the board disappeared | OpenCode was restarted, so the board reset. Expected |
| The agent writes before showing the report | Reject it and point to the CONSTRAINTS section of the ticket |

**Next:** [Lab 5](lab-5-orchestration.md).
