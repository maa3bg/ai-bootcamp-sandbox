# 🧭 AI Bootcamp, Self-Paced Edition: Start Here

This folder turns the AI Bootcamp into a course you can complete on your own, at your own pace, without a trainer.
You will build and use local AI agents, write specs they can follow, fence them in with guardrails, connect them to
an external tool through MCP, and finally run a team of four agents that turns a ticket into a pull request while
you make the final call.

You do not need to be a developer. Every lab tells you exactly what to type, what you should see, and how to check
your result. Product Owners, Agile coaches, QA engineers, analysts and developers all follow the same core labs,
then pick the track for their role.

> **Model access.** Nothing to set up: OpenCode includes several free models. Start `opencode` and type `/models`
> to see them and pick one. No account or API key is needed.

---

## How it works

1. Do the labs in order. Each lab builds on the one before. Everything lives on the `main` branch of the
   repository; the labs create their own branches from it.
2. Each lab has the same parts: **You will learn**, **Steps**, **What you should see**, **Check yourself**,
   **Reflect**, and an **Answer key** that stays folded until you open it.
3. After each lab, run its self-check. It tells you in plain words whether your result is complete:
   ```bash
   npm run check -- lab1
   ```
   Run `npm run check` with no lab name to see every available check.
4. Stuck for more than 10 minutes? Open the **Troubleshooting** section of the lab, then the Answer key.
5. Agents are not deterministic. Your agent may take a different path than the one described. That is expected;
   what matters is the outcome you check.

## The labs

| Lab | Topic | Time | You will be able to |
| --- | --- | --- | --- |
| [0](lab-0-setup.md) | Setup | 30 min | Run the sandbox and talk to an agent |
| [1](lab-1-agentic-loop.md) | The agentic loop | 30 min | See how an agent thinks, acts and observes, and steer it with approvals |
| [2](lab-2-spec-driven-development.md) | Spec-driven development | 40 min | Turn a vague request into a spec an agent can follow |
| [3](lab-3-custom-agent.md) | Custom agents and guardrails | 40 min | Build an agent whose limits hold even when someone pushes |
| [4](lab-4-mcp-and-skills.md) | MCP and skills | 45 min | Connect an agent to a task board and gate every write |
| [5](lab-5-orchestration.md) | Multi-agent orchestration | 60–75 min | Run four agents from ticket to pull request and decide at the gate |
| Track | Your role | 60–90 min | Apply everything to your own kind of work (below) |

Read [concepts.md](concepts.md) before Lab 1, or alongside it. It replaces the lectures: about 20 minutes of
reading.

## Pick your track (after Lab 4 or Lab 5)

| Role | Core labs | Track exercises |
| --- | --- | --- |
| Developer | 0–5 | [DEV-01](../tickets/practice/dev-01-spec-then-build.md), [DEV-02](../tickets/practice/dev-02-path-scoped-agent.md) |
| QA engineer | 0–5 | [QA-01](../tickets/practice/qa-01-edge-case-hunt.md), [QA-02](../tickets/practice/qa-02-data-profiling.md) |
| Data / business analyst | 0–4, 5 optional | [QA-02](../tickets/practice/qa-02-data-profiling.md), [COACH-01](../tickets/practice/coach-01-sprint-health.md) |
| Product Owner | 0–4, 5 recommended | [PO-01](../tickets/practice/po-01-request-to-spec.md), [PO-02](../tickets/practice/po-02-board-refinement-mcp.md), [PO-03](../tickets/practice/po-03-requirement-to-tickets.md) |
| Agile Team Coach / Scrum Master | 0–4, 5 recommended | [COACH-01](../tickets/practice/coach-01-sprint-health.md), [COACH-02](../tickets/practice/coach-02-retro-skill.md) |
| Everyone, to finish | all | [Capstone: TICKET-04](../tickets/capstone/ticket-04-team-hours-report.md) |

**Branches for track exercises:** do each one on its own branch, so `main` keeps the training bugs:
`git checkout main && git checkout -b <exercise id>` (for example `po-01`). The exception is PO-02, which runs on
`main` because it changes nothing in the repository.

**Self-checks for tracks:** `qa-01`, `qa-02`, `dev-02`, `po-01`, `po-02`, `po-03`, `coach-01` and `coach-02` have one
(`npm run check -- po-01`). DEV-01 and the capstone are checked with the commands in their own VERIFY WITH section.

Reference solutions for the agents and skills you build are in [solutions/](solutions/). Try first, then compare.

## Your progress

Copy this list into your notes and tick it off.

- [ ] Lab 0: `bash scripts/smoke-test.sh` shows `[ALL GREEN]`, and `npm run check -- lab0` passes
- [ ] Lab 1: `npm run check -- lab1`
- [ ] Lab 2: `npm run check -- lab2`
- [ ] Lab 3: `npm run check -- lab3`
- [ ] Lab 4: `npm run check -- lab4`
- [ ] Lab 5: `npm run check -- lab5`
- [ ] Track exercise 1: `npm run check -- <exercise id>`, for example `po-01` (or its VERIFY WITH commands)
- [ ] Track exercise 2
- [ ] Track exercise 3 (Product Owners: PO-03)
- [ ] Capstone (optional)

## Ground rules for this course

- Work on the branch each lab names. `main` must keep the training bugs, because later labs depend on them.
- Read every approval prompt before you answer it. Rejecting is always allowed, and often instructive.
- Never paste tokens, passwords or API keys into a file in this repository. Use environment variables only.
- All agents follow [AGENTS.md](../AGENTS.md). Read it once before Lab 1; it is short.
