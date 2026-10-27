# 🎓 ai-bootcamp-sandbox: From Chatbot to Agent Orchestration

Welcome to the AI Bootcamp! This repository is your personal sandbox for a hands-on, two-module online course for
**developers, QA engineers, data analysts, Product Owners and Agile coaches**. You will learn how AI agents reason in loops, how precise
specifications steer them, how guardrails keep them safe, and how several agents cooperate, all before you
onboard onto **Worca**.

Everything here is deliberately small: a tiny user filter with **intentional bugs**, a messy CSV, a mock task board
and a set of agent definitions. The focus is on *how agents work*, not on the code itself.

> ⚠️ **The test suite fails on purpose.** `npm test` reports 2 failing tests until you fix the bugs during
> Module 1. Do not fix them before the session!

> 🧭 **Learning on your own, without a trainer?** Start with [`self-paced/README.md`](self-paced/README.md). It turns
> both modules into six step-by-step labs with answer keys and a self-check command (`npm run check -- lab1`).

---

## 🛠️ Pre-Work (complete before the first live session)

### 1. Install the prerequisites
| Tool | Version | Why |
|------|---------|-----|
| [Node.js](https://nodejs.org) | **v20 or newer** (LTS recommended) | Runs the sandbox app, tests and the mock MCP server |
| [Git](https://git-scm.com/downloads) | any recent version | Version control, worktrees in Module 2 |
| [GitHub CLI (`gh`)](https://cli.github.com) | any recent version | Opening pull requests in the Module 2 pipeline |
| [OpenCode](https://opencode.ai) | latest | The agent runtime used in the exercises (`npm install -g opencode-ai`) |
| [Trello](https://trello.com) account | free plan | Tracking the capstone ticket (needed for the last exercise only) |

You also need an LLM provider configured in OpenCode (`opencode auth login`). Use the provider and credentials your
organisation gives you for this course (see [`self-paced/README.md`](self-paced/README.md)).
After installing the GitHub CLI, open a new terminal and run `gh auth login`.

### 2. Clone and install
```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ai-bootcamp-sandbox
npm ci
```

### 3. Run the smoke test
macOS / Linux / Git Bash:
```bash
bash scripts/smoke-test.sh
```
Windows PowerShell:
```powershell
& 'C:\Program Files\Git\bin\bash.exe' scripts/smoke-test.sh
```
The script checks Node.js (v20+), Git, the GitHub CLI, OpenCode and network/proxy connectivity.
If you see **`[ALL GREEN]`**, you are ready for the bootcamp! 🎉

Not going to open pull requests (for example Product Owners or Agile coaches)? Run
`SMOKE_SKIP_GH=1 bash scripts/smoke-test.sh` to treat a missing GitHub CLI as a warning.

Behind a corporate proxy? Set `HTTPS_PROXY` / `HTTP_PROXY` before running the script. You can point the network
check at another URL with `SMOKE_TEST_ENDPOINT=<url>`.

### 4. Take a first look
```bash
npm start   # runs src/App.js. How many active developers does it find?
npm test    # 1 passing, 2 failing: this is expected
```

---

## 📅 Syllabus

### MODULE 1: Agentic Loops, Spec-Driven Development (SDD) & Custom Agents (2.5 h)

| # | Session | Duration | Sandbox material |
|---|---------|----------|------------------|
| 1.1 | **Introduction to Agentic Loops** | 25 min | n/a |
| 1.2 | **Hands-on Exercise 1A: Watching the Loop** | 30 min | `src/`, `tests/`, `data/team_metrics.csv` |
| 1.3 | **Spec-Driven Development** | 40 min | `tickets/module-1-basic/` |
| 1.4 | **Hands-on Exercise 1B: Designing a Custom Agent & Guardrails** | 40 min | `.opencode/agents/`, `AGENTS.md` |
| 1.5 | **Q&A & Wrap-up** | 15 min | n/a |

- **1.1 Introduction to Agentic Loops:** the move from chatbot conversations to autonomous thinking loops:
  **Thought → Action → Observation**, repeated until the goal is reached.
- **1.2 Exercise 1A: Watching the Loop.** Without writing any code yourself, ask an agent to fix the failing tests
  or to profile `data/team_metrics.csv`. Watch which tools it calls (read, search, run), what it observes, and how
  it changes course.
- **1.3 Spec-Driven Development:** turning loose user stories into exact Markdown specs with
  **Goal, Context, Constraints and Acceptance Criteria**. In breakout rooms you rewrite
  [`ticket-00-vague.md`](tickets/module-1-basic/ticket-00-vague.md) into a proper spec, then compare your version
  with [`ticket-01-sdd.md`](tickets/module-1-basic/ticket-01-sdd.md).
  *Discuss: what would an agent do with "the search is slow"? Which assumptions did it have to make?*
- **1.4 Exercise 1B: Designing a Custom Agent & Guardrails.** Write your own agent config with write-locks
  (`edit: deny`, `bash: deny`), using [`reviewer.md`](.opencode/agents/reviewer.md) as a reference. Then ask it to
  "just fix the bug" and watch the safety boundary hold.
- **1.5 Q&A & Wrap-up.**

### MODULE 2: MCP Protocol, Packaged Skills & Multi-Agent Orchestration (3.25 h)

| # | Session | Duration | Sandbox material |
|---|---------|----------|------------------|
| 2.1 | **MCP Standards & Reusable Skills** | 35 min | `.opencode/skills/qa-edge-cases/` |
| 2.2 | **Hands-on Exercise 2A: External Integrations & Permission Gating** | 45 min | `tickets/module-2-advanced/ticket-02-mcp-integration.md` |
| 2.3 | **Hands-on Exercise 2B: The Grand Finale, Ticket-to-PR Chain** | 75 min | `tickets/module-2-advanced/ticket-03-orchestration-pipeline.md` |
| 2.4 | **Mapping to the Worca Platform** | 25 min | n/a |
| 2.5 | **Q&A & Graduation** | 15 min | n/a |

- **2.1 MCP Standards & Reusable Skills:** the Model Context Protocol (MCP) as the "USB-C for AI" (one standard
  plug between agents and external tools), and packaging procedural knowledge into Git-tracked **Skills** such as
  the [`qa-edge-cases`](.opencode/skills/qa-edge-cases/SKILL.md) checklist.
- **2.2 Exercise 2A: External Integrations & Permission Gating.** Connect the mock Jira/Trello MCP server
  (`mock-board`, configured in [`.opencode/opencode.json`](.opencode/opencode.json)), query the board, and approve or
  reject each write action as the agent requests it.
- **2.3 Exercise 2B: The Grand Finale, Ticket-to-PR Chain.** Run the multi-agent pipeline `/ticket-to-pr`. Watch the
  **Planner, Feature Builder, Test Author and Reviewer** hand off work in isolated Git worktrees, then make the call
  yourself at the **human-in-the-loop validation gate**.
- **2.4 Mapping to the Worca Platform:** how these manual exercises map to Worca Composer, Team Policies and
  Workspace tools.
- **2.5 Q&A & Graduation.** 🎓

### Track exercises and capstone
| Exercise | For | What you practise |
|----------|-----|-------------------|
| [`qa-01-edge-case-hunt.md`](tickets/practice/qa-01-edge-case-hunt.md) | QA | Spec-driven edge-case tests with the `test-author` agent and the `qa-edge-cases` skill |
| [`qa-02-data-profiling.md`](tickets/practice/qa-02-data-profiling.md) | QA, data analysts | Build a read-only `data-profiler` agent and profile a messy CSV |
| [`dev-01-spec-then-build.md`](tickets/practice/dev-01-spec-then-build.md) | Developers | Write the SDD spec yourself, have it reviewed, then let an agent build it |
| [`dev-02-path-scoped-agent.md`](tickets/practice/dev-02-path-scoped-agent.md) | Developers | Path-scoped permissions and your own slash command |
| [`po-01-request-to-spec.md`](tickets/practice/po-01-request-to-spec.md) | Product Owners | Interrogate a vague stakeholder request with a read-only agent, then write the spec |
| [`po-02-board-refinement-mcp.md`](tickets/practice/po-02-board-refinement-mcp.md) | Product Owners | Refine and de-duplicate board cards through MCP, approving every write |
| [`coach-01-sprint-health.md`](tickets/practice/coach-01-sprint-health.md) | Agile coaches, Scrum Masters | A read-only agent that prepares a retro from sprint data, without judging people |
| [`coach-02-retro-skill.md`](tickets/practice/coach-02-retro-skill.md) | Agile coaches, Scrum Masters | Package retro synthesis as a reusable skill |
| [`ticket-04-team-hours-report.md`](tickets/capstone/ticket-04-team-hours-report.md) | Everyone | **Capstone:** requirement → spec → Trello card → `/ticket-to-pr` → human gate → PR |

The capstone uses a real Trello board through the Trello MCP server. Setup steps (account, API key, token, board ID)
are in the capstone ticket. Credentials go in environment variables only, never in a file in this repository.

---

## 🗂️ Repository Map

```text
ai-bootcamp-sandbox/
├── AGENTS.md                         # Global rules every agent must follow
├── .env.example                      # Documented environment variables (copy to .env; never commit .env)
├── src/
│   ├── App.js                        # Demo entry point (npm start)
│   └── utils/filters.js              # filterUsers(): contains 2 INTENTIONAL bugs
├── tests/filters.test.js             # Jest tests: 2 fail until the bugs are fixed
├── data/
│   ├── team_metrics.csv              # Messy dataset for data-profiling exercises
│   ├── mock-board.json               # Seed data for the mock Jira/Trello board
│   ├── sprint-history.csv            # Sprint data for the Agile coach track
│   ├── retro-notes.md                # Raw retro notes for the Agile coach track
│   └── stakeholder-requests.md       # Vague requests for the Product Owner track
├── scripts/
│   ├── smoke-test.sh                 # Pre-work environment check
│   ├── self-check.js                 # Checks a lab result: npm run check -- <lab>
│   └── mock-board-mcp.js             # Dependency-free mock MCP server (stdio)
├── self-paced/                       # Trainer-free edition: labs 0-5, concepts, reference solutions
├── tickets/
│   ├── module-1-basic/
│   │   ├── ticket-00-vague.md        # The "bad" ticket
│   │   └── ticket-01-sdd.md          # The same ticket as a proper SDD spec
│   ├── module-2-advanced/
│   │   ├── ticket-02-mcp-integration.md
│   │   └── ticket-03-orchestration-pipeline.md
│   ├── practice/                     # Track exercises: qa-, dev-, po- and coach-
│   └── capstone/ticket-04-team-hours-report.md
└── .opencode/
    ├── opencode.json                 # Global permissions, planner agent, MCP servers (mock-board, trello)
    ├── agents/                       # reviewer (read-only), test-author, feature-builder
    ├── commands/ticket-to-pr.md      # The /ticket-to-pr orchestration command
    └── skills/qa-edge-cases/SKILL.md # Reusable QA checklist skill
```

## 📏 Ground Rules
All agents, and all participants, follow [`AGENTS.md`](AGENTS.md): English only, no credentials in the repo,
no hardcoded configuration, code that matches the existing style, and **nothing is "Done" until `npm test` passes**.

## 🆘 Troubleshooting
- **`npm ci` / `npm install` fails with `ENOTFOUND` or a timeout:** check your proxy settings
  (`npm config get proxy`, `npm config get https-proxy`) and your registry (`npm config get registry`).
- **The smoke test fails on the network check:** set `HTTPS_PROXY`, connect to the VPN, or ask your IT team which
  endpoint to use for `SMOKE_TEST_ENDPOINT`.
- **Windows:** run the bash scripts from Git Bash or through the `bash.exe` command shown above.
