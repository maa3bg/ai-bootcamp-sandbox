# 🎓 AI Bootcamp: Learn to Work with AI Agents

Welcome! This repository is a safe practice project for a hands-on course about **AI agents**: AI assistants that
do not just answer questions, but read files, run checks and make changes, step by step, asking you before they
change anything.

The course is for **developers, QA engineers, data and business analysts, Product Owners, and Agile coaches or
Scrum Masters**. You do not need to write code or know anything about AI. Every step tells you what to type, what
you should see, and how to check your result. It is also the shared foundation teams bring into **Worca**
onboarding.

You can take it **on your own, at your own pace** (this page walks you through it), or **with a trainer** (see
*Trainer-led edition* at the end of this page).

> ⚠️ **Some tests fail on purpose.** The practice project contains two small bugs that the exercises use. Do not fix
> them on the `main` branch; the labs tell you exactly when and where to work on them.

---

## 🧭 What to expect

| | |
| --- | --- |
| **Time** | About 6 hours in total: 4.5 hours of core labs, plus 1–1.5 hours for your role. Setup can take longer the first time |
| **Pace** | Your own. Spread it over 3–4 sittings in 1–2 weeks. Only Lab 5 needs an uninterrupted hour |
| **What you do** | Give an agent a task, watch what it does, approve or reject each change, and check the result |
| **What you need** | A computer where you can install software, model access from your organisation, and curiosity |
| **What you do not need** | Coding skills, AI knowledge, or a GitHub account (that is only for the optional last step of Lab 5) |
| **Safety** | Nothing here touches real code or data. Agents ask before every change, and you can start any lab over |

**Two things that may surprise you:**

- **The agent asks you a lot.** Before every edit or command, it stops and waits for your approval. That is on
  purpose: read what it wants to do, then approve or reject. Rejecting is always allowed.
- **Your agent may do things differently.** AI agents do not take the same path every time, so yours may differ from
  the lab description or from a colleague's. That is normal. What counts is that the self-check passes.

### What you will be able to do at the end

1. **Watch an agent work** and steer it by approving or rejecting each step.
2. **Describe work precisely**, turning a vague request into a clear task (a *spec*) an agent can follow.
3. **Set safe limits** by building your own agent that may read but never change files.
4. **Connect your tools**, letting an agent use a task board while every change waits for your approval.
5. **Run a team of agents** that plan, build, test and review a change, and make the final call yourself.

### Eight words you will meet

| Word | In plain words |
| --- | --- |
| **Agent** | An AI assistant that reads files, runs checks and makes changes, step by step |
| **Loop** | How an agent works: think, act, look at the result, repeat until the job is done |
| **Spec** | A precise task description: the goal, the limits, and how we will know it is done |
| **Guardrail** | A rule the software enforces, for example "may read, never edit" |
| **MCP** | A standard plug that connects agents to other tools, such as a task board, like USB-C for devices |
| **Skill** | An expert's checklist saved as a file, so agents follow it the same way every time |
| **Orchestration** | Several specialised agents passing work along, like a relay team |
| **Human gate** | The point where nothing is published without your explicit yes |

[`self-paced/concepts.md`](self-paced/concepts.md) explains each of these in more depth (about 20 minutes).

---

## 🚀 The self-paced bootcamp, step by step

### Step 1: Install the tools (15 min)

| Tool | Version | How to check it works |
| --- | --- | --- |
| [Node.js](https://nodejs.org) | 20 or newer (LTS) | `node -v` prints `v20` or higher |
| [Git](https://git-scm.com/downloads) | any recent | `git --version` |
| [OpenCode](https://opencode.ai), the agent app | latest | `npm install -g opencode-ai`, then `opencode --version` in a **new** terminal |
| [GitHub CLI](https://cli.github.com) | any recent | `gh --version`. Optional: only needed to publish a change at the end of Lab 5 |

A **terminal** is the window where you type commands. **On Windows, use Git Bash** (installed together with Git)
for every command in this course.

### Step 2: Get the practice project (5 min)

- **Want to publish a real change at the end of Lab 5?** Make your own copy (a *fork*) of this repository on GitHub,
  then:
  ```bash
  git clone https://github.com/<your-user>/ai-bootcamp-sandbox.git
  cd ai-bootcamp-sandbox
  gh auth login
  gh repo set-default <your-user>/ai-bootcamp-sandbox
  ```
- **Otherwise**, simply clone this repository:
  ```bash
  git clone <this repository's link>
  cd ai-bootcamp-sandbox
  ```

Then install the project's dependencies:

```bash
npm ci
```

### Step 3: Check your setup (5 min)

```bash
bash scripts/smoke-test.sh
```

The script checks Node.js, Git, the GitHub CLI, OpenCode and your network connection. **You are ready when the last
lines say `[ALL GREEN]`.** If a line says `[FAIL]`, the line under it tells you how to fix it.

Not planning to publish changes (for example as a Product Owner or Agile coach)? Run this instead, so a missing
GitHub CLI is only a warning:

```bash
SMOKE_SKIP_GH=1 bash scripts/smoke-test.sh
```

### Step 4: Connect OpenCode to a model (5 min)

```bash
opencode auth login
```

Choose the provider your organisation gave you for this course and paste the credentials when asked. They are
stored in OpenCode's own settings, never in this project.
<!-- ORGANIZER: replace this line with your model provider and how learners get credentials. -->

Then take a first look at the practice project:

```bash
npm start   # shows a team list and two searches
npm test    # runs the automatic tests
```

**What you should see:** both searches find too few people (the correct answer is 2: Marko and Ivan), and `npm test`
reports **1 passed, 2 failed**. That is the starting point, not a mistake.

### Step 5: Read the concepts (20 min)

Read [`self-paced/concepts.md`](self-paced/concepts.md). It replaces the lectures of the trainer-led edition. You can
also read it section by section, just before the lab that uses it.

### Step 6: Do the labs, in order (about 4 hours)

Open each lab file and follow it from top to bottom. Each lab builds on the one before.

| Lab | What you do | Time | What to expect | Check |
| --- | --- | --- | --- | --- |
| [0 · Setup](self-paced/lab-0-setup.md) | Finish setup and talk to an agent for the first time | 30 min | The agent reads a few files and summarises the project | `npm run check -- lab0` |
| [1 · The agent loop](self-paced/lab-1-agentic-loop.md) | Ask an agent to fix the failing tests, or to find problems in a data file | 30 min | 4–8 steps, each edit and command waits for your approval; you reject one on purpose | `npm run check -- lab1` |
| [2 · Specs](self-paced/lab-2-spec-driven-development.md) | Rewrite a one-line vague ticket into a precise spec, then let an agent criticise it | 40 min | The agent finds gaps you did not see; you compare with a model answer | `npm run check -- lab2` |
| [3 · Your own agent](self-paced/lab-3-custom-agent.md) | Create an agent that may only read, then try to talk it into changing a file | 40 min | It refuses, or agrees in words but is blocked: the file never changes | `npm run check -- lab3` |
| [4 · Tools and skills](self-paced/lab-4-mcp-and-skills.md) | Let an agent check a task board against reality and correct a wrong card | 45 min | Reading the board runs freely; every change to it waits for your yes | `npm run check -- lab4` |
| [5 · A team of agents](self-paced/lab-5-orchestration.md) | Run four agents (planner, builder, tester, reviewer) on one ticket | 60–75 min | Many approvals; at the end you check the evidence and answer yes or no | `npm run check -- lab5` |

**Every lab has the same six parts:** *You will learn*, *Steps* (exactly what to type), *What you should see*,
*Check yourself* (the command above), *Reflect* (a few questions), and an *Answer key* that stays folded until you
open it.

**The self-check** tells you in plain words what is complete (`[PASS]`) and what is missing (`[FAIL]`, with a hint).
Run `npm run check` on its own to list every check.

### Step 7: Your role track (1–1.5 hours)

After Lab 4 or Lab 5, do the two exercises for your role. Each runs on its own branch:
`git checkout main && git checkout -b <exercise id>` (PO-02 is the exception: it stays on `main`).

| Your role | Lab 5 | Track exercises | What you practise |
| --- | --- | --- | --- |
| Developer | Yes | [DEV-01](tickets/practice/dev-01-spec-then-build.md), [DEV-02](tickets/practice/dev-02-path-scoped-agent.md) | Write a spec and let an agent build it; limit where an agent may write |
| QA engineer | Yes | [QA-01](tickets/practice/qa-01-edge-case-hunt.md), [QA-02](tickets/practice/qa-02-data-profiling.md) | Find edge cases with a checklist skill; profile messy data |
| Data or business analyst | Optional | [QA-02](tickets/practice/qa-02-data-profiling.md), [COACH-01](tickets/practice/coach-01-sprint-health.md) | Read-only agents that report data problems with evidence |
| Product Owner | Recommended | [PO-01](tickets/practice/po-01-request-to-spec.md), [PO-02](tickets/practice/po-02-board-refinement-mcp.md) | Turn a vague stakeholder request into a spec; tidy up a task board |
| Agile coach or Scrum Master | Recommended | [COACH-01](tickets/practice/coach-01-sprint-health.md), [COACH-02](tickets/practice/coach-02-retro-skill.md) | Prepare a retro from sprint data without judging people; save it as a skill |

Most exercises have a self-check (`npm run check -- po-01`); DEV-01 uses the commands in its own *VERIFY WITH*
section. Reference solutions and answer keys are in [`self-paced/solutions/`](self-paced/solutions/). Try first,
then compare.

**Optional final project:** the [capstone](tickets/capstone/ticket-04-team-hours-report.md) takes one requirement
all the way to a merged pull request, tracked on your own Trello board (2–3 hours, needs a GitHub fork).

### Step 8: Finish

You have completed the bootcamp when:

- [ ] `bash scripts/smoke-test.sh` shows `[ALL GREEN]`
- [ ] `npm run check -- lab0` to `npm run check -- lab5` all pass
- [ ] both exercises of your role track pass their check
- [ ] optional: your capstone pull request is merged

Then share your result: <!-- ORGANIZER: say what to send and where, for example a screenshot of the passing checks. -->
ask your organiser what to send and where.

---

## 🗓️ A suggested schedule

| Sitting | Time | What |
| --- | --- | --- |
| 1 | ~1.5 h | Steps 1–5 (setup and concepts), Lab 0, Lab 1 |
| 2 | ~1.5 h | Lab 2 (specs), Lab 3 (your own agent) |
| 3 | ~1.5 h | Lab 4 (tools and skills), first track exercise |
| 4 | ~2 h | Lab 5 (a team of agents) without interruptions, second track exercise |

You can stop after any lab and continue another day. Before you stop, commit your work on the lab's branch
(each lab shows the command).

---

## 🆘 When you get stuck

Go through these in order, and give each about 10 minutes:

1. **The lab's Troubleshooting table.** Every lab ends with the common problems and their fixes.
2. **The lab's Answer key.** It shows what a good result looks like. Opening it is not cheating.
3. **Start the lab again.** `git checkout main`, then create the lab's branch again under a new name. Agents often
   take a better path the second time.
4. **Ask for help** in your organisation's channel for this course, and paste the output of the lab's self-check.
   <!-- ORGANIZER: add the help channel. -->

**Common setup problems**

| Problem | Fix |
| --- | --- |
| `npm ci` fails with `ENOTFOUND` or a timeout | You are probably behind a company proxy. Check `npm config get https-proxy` and ask your IT team for the proxy address |
| `opencode: command not found` | Open a **new** terminal after installing. On Windows, make sure npm's global folder is on your PATH |
| OpenCode asks for a provider or shows an authentication error | Run `opencode auth login` again with the details from your organisation |
| The smoke test fails on the network check | Set `HTTPS_PROXY`, connect to the VPN, or ask your IT team which address to use for `SMOKE_TEST_ENDPOINT` |
| All 3 tests already pass on `main` | The training bugs were fixed by mistake. Run `git checkout origin/main -- src/utils/filters.js` |
| Windows: a `bash` command does not work | Run it in **Git Bash**, or from PowerShell with `& 'C:\Program Files\Git\bin\bash.exe' scripts/smoke-test.sh` |

## 📏 Ground rules

- **Read before you approve.** Every agent action that changes something waits for you.
- **Work on the branch each lab names.** `main` must keep the training bugs, because later labs depend on them.
- **No secrets in files.** Never paste passwords, tokens or API keys into this project; use environment variables.
- All agents follow [`AGENTS.md`](AGENTS.md): English only, no credentials in the repository, no hardcoded
  configuration, code in the existing style, and **nothing is "Done" until `npm test` passes**. Read it once; it is
  short.

---

## 👩‍🏫 Trainer-led edition

The same content also runs as two live sessions with a trainer: short talks, the same hands-on exercises, and group
debriefs. Participants do Steps 1–4 above before the first session (about 30 minutes) and send a screenshot of
`[ALL GREEN]` to the trainer.

| Session | Length | Topics | Self-paced equivalent |
| --- | --- | --- | --- |
| **Module 1:** agentic loops, spec-driven development and custom agents | 2 h 30 min | How agents work (25 min) · Hands-on: watch the loop (30) · Specs, with a group rewrite (40) · Hands-on: an agent with guardrails (40) · Q&A (15) | Labs 1–3 |
| **Module 2:** MCP, skills and multi-agent orchestration | 3 h 15 min + break | MCP and skills (35) · Hands-on: an agent and a task board (45) · Hands-on: the ticket-to-PR team of agents (75) · Mapping to Worca (25) · Q&A and graduation (15) | Labs 4–5 |

Role tracks and the capstone follow as homework. Trainers get a facilitator guide and slides for each module from the
course organiser. Missed part of a session? Catch up with the matching lab in [`self-paced/`](self-paced/README.md).

---

## 🗂️ Repository map

```text
ai-bootcamp-sandbox/
├── README.md                         # This page: start here
├── AGENTS.md                         # Global rules every agent must follow
├── .env.example                      # Documented environment variables (copy to .env; never commit .env)
├── self-paced/                       # The self-paced course: concepts, labs 0-5, reference solutions
├── src/
│   ├── App.js                        # Demo entry point (npm start)
│   └── utils/filters.js              # filterUsers(): contains 2 INTENTIONAL bugs
├── tests/filters.test.js             # Jest tests: 2 fail until the bugs are fixed
├── data/
│   ├── team_metrics.csv              # Messy dataset for data-profiling exercises
│   ├── mock-board.json               # Seed data for the practice task board
│   ├── sprint-history.csv            # Sprint data for the Agile coach track
│   ├── retro-notes.md                # Raw retro notes for the Agile coach track
│   └── stakeholder-requests.md       # Vague requests for the Product Owner track
├── scripts/
│   ├── smoke-test.sh                 # Setup check (Step 3)
│   ├── self-check.js                 # Checks a lab result: npm run check -- <lab>
│   └── mock-board-mcp.js             # The practice task board, as an MCP server
├── tickets/
│   ├── module-1-basic/               # The vague ticket and the same ticket as a proper spec
│   ├── module-2-advanced/            # MCP integration and the ticket-to-PR pipeline
│   ├── practice/                     # Role track exercises: dev-, qa-, po- and coach-
│   └── capstone/                     # Final project with a real Trello board
└── .opencode/
    ├── opencode.json                 # Permissions, the planner agent, MCP servers (mock-board, trello)
    ├── agents/                       # reviewer (read-only), test-author, feature-builder
    ├── commands/ticket-to-pr.md      # The /ticket-to-pr team-of-agents command
    └── skills/qa-edge-cases/SKILL.md # Example skill: a QA checklist
```
