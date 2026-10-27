# Lab 1: Watching the Agentic Loop

**Time:** 30 minutes · **Read first:** [concepts.md](concepts.md) sections 1–5

## You will learn
- To recognise Thought, Action and Observation in a live agent session.
- To steer an agent with approval prompts, including saying no.
- How an agent decides it is done.

You will not write code. Your job is to watch and take notes.

## Steps

1. Create a branch for this lab, so `main` keeps its bugs:
   ```bash
   git checkout main
   git checkout -b lab-1
   ```
2. Start `opencode` in the repository folder. Stay on the default **build** agent.
3. Choose **one** prompt and paste it:
   - **Prompt A (code):** `This is a training exercise on the branch lab-1, so you may fix src/utils/filters.js. Run the tests and make them pass. Do not change the tests.`
   - **Prompt B (data):** `Profile data/team_metrics.csv and list every data-quality problem with its line number (the header is line 1). Do not change the file.`
4. Every edit and every shell command will pause for your approval, because the project sets `edit` and `bash` to
   `ask`. **Read each prompt before you answer.** If any prompts appear, reject at least one on purpose and watch what the agent does next. (With Prompt B there may
   be none, because reading files is allowed without asking.)
5. While it works, fill in this observation sheet in your notes:

   | # | Thought (what it said it would do) | Action (tool + target) | Observation (what came back) | Changed course? |
   | --- | --- | --- | --- | --- |
   | 1 | | | | |
   | 2 | | | | |
   | 3 | | | | |

6. When the agent stops, quit OpenCode and check its work yourself:
   ```bash
   git diff
   npm test
   ```
7. Prompt A only: save your work on the branch.
   ```bash
   git add -A && git commit -m "lab 1"
   ```

## What you should see

**Prompt A:** typically `npm test`, then reading `src/utils/filters.js` and the test file, one edit, and `npm test`
again: 4 to 8 tool calls. Some agents fix one bug, re-run the tests, then fix the second. That is the loop changing
course.

**Prompt B:** the agent reads the CSV (and maybe `src/App.js`) and lists problems with line numbers.

## Check yourself

```bash
npm run check -- lab1
```

For Prompt B, the check only confirms that the data file is unchanged. Compare your list with the answer key.

## Reflect
1. What was the agent's first action? Did it look before it touched anything?
2. Which observation changed its plan?
3. When you rejected an action, what did it do instead?
4. How did it decide it was done? Was that the right stop condition?
5. Optional: run the same prompt again on a fresh branch. Did it take the same path?

<details>
<summary><b>Answer key</b> (open after you finish)</summary>

**Prompt A.** The two bugs are in one line of `filterUsers`: `user.role === role && user.active === active`.
1. The role comparison is case-sensitive, so `developer` never matches `Developer`.
2. When `active` is omitted it is `undefined`, so nothing matches.

A typical fix compares roles case-insensitively (for example with `toLowerCase()`) and treats an omitted `active` as
`true`. After the fix `npm test` shows 3 passed, and `npm start` finds Marko and Ivan in both searches.

If the agent **refused** or asked first, citing `AGENTS.md` rule 7 or the comment in `filters.js`, that is the
context steering the loop. Prompt A already gives permission; if it still hesitates, confirm you are on `lab-1`.

**Prompt B.** Line numbers count the header as line 1.

| Line | Problem |
| --- | --- |
| 4 (Jelena) | `hours_logged` is empty |
| 5 (Ivan) | Role `developer` in lower case; date `28/09/2026` instead of `2026-09-28` |
| 6 (Marko) | Exact duplicate of line 3 |
| 7 | Empty `team_member` and `role`, 0 hours, status `Pending` |
| 4 vs `src/App.js` | Jelena is `Active` in the CSV but inactive in the app; Nikola is missing from the CSV |

If the agent numbered data rows from 1, every line is off by one. That is a lesson in itself: "row number" was
ambiguous until the prompt defined it.

**Reflection 5.** Usually not. Agents are not deterministic, which is why specs and tests define "done", not the
path.
</details>

## Troubleshooting

| Problem | Fix |
| --- | --- |
| The agent edits the tests | Reject the edit and remind it: "Do not change the tests." This is a classic failure mode |
| `git commit` says nothing to commit | You chose Prompt B, or rejected every edit. That is fine |
| The check says you are on `main` | Run `git checkout -b lab-1` and repeat, or `git checkout lab-1` if it exists |

**Next:** [Lab 2](lab-2-spec-driven-development.md). Return to `main` first: `git checkout main`.
