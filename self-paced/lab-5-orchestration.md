# Lab 5: Multi-Agent Orchestration, Ticket to Pull Request

**Time:** 60–75 minutes · **Read first:** [concepts.md](concepts.md) section 10

## You will learn
- How four specialised agents hand work to each other.
- Why each one has different permissions.
- How to make an evidence-based decision at the human gate.

## Before you start

- Read `tickets/module-2-advanced/ticket-03-orchestration-pipeline.md` (the blueprint) and skim
  `.opencode/commands/ticket-to-pr.md` (the instructions the orchestrator follows).
- To open a real pull request at the end you need a **fork you own** as `origin`, and `gh auth login`
  (see Lab 0). Without one, you will answer "no" at the gate. You still see the whole pipeline.
- A full run can take a while and asks for many approvals. Plan an uninterrupted hour.

## Steps

### 1. Start clean (2 min)

```bash
git checkout main
git status
```

The working tree must be clean.

### 2. Run the pipeline (40–60 min)

Start `opencode` and type:

```text
/ticket-to-pr TICKET-01
```

What happens, in order:

| Stage | Agent | Permissions | What to watch |
| --- | --- | --- | --- |
| 0–1 | Orchestrator (build) | asks for every command | Creates `.worktrees/ticket-01` on branch `feature/ticket-01` and runs `npm ci`. Approve these |
| 2 | `planner` | read-only | Produces the plan; the orchestrator saves it to `.pipeline-runs/ticket-01/plan.md`. Open it: does every acceptance criterion have a step? |
| 3 | `feature-builder` | edit + bash | Changes `src/utils/filters.js` in the worktree and commits |
| 4 | `test-author` | edit + bash | Appends tests, runs `npm test`. Where the spec is silent, it should list an open question |
| 5 | `reviewer` | read-only | Produces a verdict; the orchestrator saves it to `.pipeline-runs/ticket-01/review.md` |
| 7 | **You** | — | The human gate |

Just before and just after the reviewer stage, run this in a second terminal:

```bash
git -C .worktrees/ticket-01 status
```

Nothing should change during the review: the reviewer cannot write.

### 3. Decide at the gate (10 min)

The orchestrator shows the acceptance-criteria checklist, the commit log, the diff summary, the test results and the
reviewer's verdict, then asks: **"Approve and open the PR? (yes / no + reason)"**.

Do not just trust the verdict. Check the four boxes yourself, in your second terminal:

```bash
cd .worktrees/ticket-01
npm test                 # all tests pass?
git diff --stat main     # only the files the ticket allows?
git diff main            # no secrets, no hardcoded config, no edited old tests?
cd ../..
```

- [ ] Every acceptance criterion in TICKET-01 is met, with evidence.
- [ ] `npm test` passes; no existing test was changed or deleted.
- [ ] The diff touches only `src/utils/filters.js` and `tests/filters.test.js`.
- [ ] No credentials or hardcoded values were added.

Then answer:
- **yes** (you have a fork): the pipeline pushes `feature/ticket-01` and opens a PR. Open the link it prints.
- **no + reason** (or no fork): the reason goes to `.pipeline-runs/ticket-01/run-log.md`, and the worktree stays for
  you to inspect.

### 4. Bonus: watch it refuse a vague ticket (2 min)

```text
/ticket-to-pr TICKET-00
```

It stops at once: TICKET-00 has none of the five spec sections. Lab 2 in one line.

## Check yourself

```bash
npm run check -- lab5
```

## Reflect
1. What evidence decided your yes or no?
2. Did the reviewer find anything the builder missed? Did any work loop back?
3. Where did the test author have to stop because the spec was silent?
4. What would you need to trust a pipeline like this on your own team's work?

<details>
<summary><b>Answer key</b> (open after you finish)</summary>

- **Planner:** a table mapping the 5 acceptance criteria of TICKET-01 to `src/utils/filters.js`.
- **Feature builder:** case-insensitive role matching and `active` defaulting to `true`, one commit on
  `feature/ticket-01`.
- **Test author:** extra tests, for example explicit `undefined` for `active`, empty lists, and no mutation of the
  input. Behaviour TICKET-01 does not define (such as `null` items in the list) should be listed as an open question,
  not invented. A test that fails on undefined behaviour is a good discussion point: the spec was silent.
- **Reviewer:** a findings table and APPROVE or REQUEST CHANGES. After two REQUEST CHANGES loops the pipeline
  escalates to you with the findings open.
- **Gate:** both yes and no are valid. A "no" with a clear reason is a good outcome.

**Clean up** when you are done (unless you want to keep the run):

```bash
git worktree remove .worktrees/ticket-01   # add --force if it reports uncommitted changes
git branch -D feature/ticket-01
```
</details>

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `git worktree add` fails: branch already exists | An earlier run left it. Run the two clean-up commands above, then start again |
| `npm ci` fails inside the worktree | Same proxy fix as Lab 0 |
| Push or `gh pr create` fails | No fork, `origin` is not yours, or `gh` is not logged in. Answer "no" and continue |
| The orchestrator says the main checkout was changed | A subagent wrote outside the worktree. Stop, inspect `git status`, and restore with `git checkout -- .` |
| The run is taking very long | It is normal for the first run. Keep approving; or stop, clean up, and retry later |

**Next:** your role track in the [README](README.md#pick-your-track-after-lab-4-or-lab-5), then the capstone.
