# 📚 Concepts: the Theory Behind the Labs

About 20 minutes of reading. Each section ends with the lab where you will see it in action.

---

## 1. From chatbot to agent

A **chatbot** answers once. You paste the code and the error, it suggests a fix, you run it and report back. You are
the loop: you carry information back and forth.

An **agent** closes the loop itself, because it has **tools**: it can read files, search, run commands and edit. It
keeps going until the goal is reached.

## 2. The agentic loop: Thought → Action → Observation

```text
   ┌──────────┐     ┌──────────┐     ┌──────────────┐
   │ Thought  │ ──▶ │  Action  │ ──▶ │ Observation  │
   └──────────┘     └──────────┘     └──────────────┘
        ▲                                    │
        └────────── repeat until done ───────┘
```

- **Thought:** "Two tests fail. I need to see what they expect."
- **Action:** call one tool: read a file, search, run `npm test`, edit a file.
- **Observation:** read the result and feed it into the next thought.

The loop stops when the **goal** is reached or a **stop condition** fires: a denied permission, a question for the
human, or a step limit. Because every observation is new information, an agent can recover from a wrong first guess.

Key point: the model only **chooses** the next tool call. The runtime (here, OpenCode) **executes** it. That gap is
where guardrails live.

▶ Lab 1

## 3. Four parts of every agent

| Part | What it is | In this sandbox |
| --- | --- | --- |
| Model | Reasons and picks the next step | The provider you connect with `opencode auth login` |
| Tools | What it can do | Read, search, edit, bash, web fetch, and MCP servers |
| Context | What it knows | `AGENTS.md`, the agent's own prompt, the ticket, every file it has read |
| Guardrails | What it may do | Permissions per tool: `allow`, `ask` or `deny` |

## 4. Where loops go wrong

| Failure | What you see | What prevents it |
| --- | --- | --- |
| Vague goal | It invents its own idea of "done" | A spec with acceptance criteria |
| No verification | "Fixed!" without running anything | The verification rule in `AGENTS.md` |
| Scope creep | Edits files nobody mentioned | Constraints, and path permissions |
| Going in circles | The same failing fix, again and again | Step limits; a human steps in |
| Cheating | Weakens or deletes the failing test | "Never modify tests", and `edit: deny` |

## 5. Guardrails: allow, ask, deny

```json
"permission": { "edit": "ask", "bash": "ask", "webfetch": "deny" }
```

- **allow:** the tool runs without asking.
- **ask:** the loop pauses until you approve or reject. Read before you approve.
- **deny:** the tool is not available. The agent must report and stop.

A prompt can **ask** an agent to behave. A permission makes misbehaving **impossible**. Use both: rules in prose
for intent, permissions for enforcement.

▶ Labs 1 and 3

## 6. Spec-Driven Development (SDD)

A vague ticket hides decisions. "The search is slow and people are missing, fix the app now" hides at least six:
which search, slow compared to what, who is missing, what is correct, which files may change, and when it is done.
A person would ask. An agent guesses, then works very hard on the guess.

An SDD ticket writes every decision down:

| Section | Contains | Its job in the loop |
| --- | --- | --- |
| GOAL | One or two sentences: the outcome, not the implementation | Sets the direction of every thought |
| CONTEXT | Files, current behaviour, root causes, what was ruled out | Tells the agent what to read first |
| CONSTRAINTS | What may change, what must not, what is out of scope | Limits which actions are allowed |
| ACCEPTANCE CRITERIA | Numbered, testable checks that define done | Judges each observation: done or not yet |
| VERIFY WITH | The exact commands that prove it | The last action before it may stop |

**A testable acceptance criterion** names a concrete input and an observable output. The test: could a stranger, or
a script, say pass or fail without asking you?

| Vague | Testable |
| --- | --- |
| Search works for everyone | `filterUsers(users, 'developer', true)` and `'Developer'` return the same users |
| Defaults are sensible | Omitting `active` behaves exactly like `active = true` |
| It is fixed | `npm test` passes; `npm start` reports 2 active developers |

▶ Lab 2

## 7. Custom agents

An agent is a Markdown file in `.opencode/agents/`. The file name becomes the agent name. The frontmatter sets the
description and permissions; the body is the agent's instructions.

```markdown
---
description: Read-only reviewer. Never edits files.
permission:
  edit: deny
  bash: deny
---
# Your instructions here
```

Switch between primary agents with **Tab**, or call any agent in a message with `@agent-name`.
`opencode agent list` shows every agent OpenCode has loaded.

▶ Lab 3

## 8. MCP: one plug for external tools

Without a standard, every agent needs custom code for every tool: 3 agents and 5 tools means 15 integrations. With
the **Model Context Protocol (MCP)**, each tool ships one MCP server and each agent runtime speaks MCP once: 3 + 5.
It is often called the "USB-C for AI".

An MCP server describes its tools (`tools/list`), and the agent calls them (`tools/call`) just like built-in tools.
In OpenCode, MCP tools are named `<server>_<tool>`, so one permission pattern covers a whole server:

```json
"mock-board_*": "ask",
"mock-board_list_cards": "allow",
"mock-board_get_card": "allow"
```

The last matching rule wins. Start strict, then open up the safe reads by name. A write tool added to the server
later is gated automatically.

▶ Lab 4, PO-02

## 9. Skills: know-how in a folder

A **skill** is a procedure an expert would follow, saved as `.opencode/skills/<name>/SKILL.md`. Agents see only its
name and description until a task fits; then they load the full text with the `skill` tool. Because it is a plain
file in Git, the whole team can review and improve it.

| Building block | Answers the question | Example in this repo |
| --- | --- | --- |
| `AGENTS.md` | Which rules always apply? | English only, no secrets, `npm test` before done |
| Agent | Who does this job, with which powers? | `.opencode/agents/reviewer.md` |
| Skill | How is this task done well? | `.opencode/skills/qa-edge-cases/` |
| MCP server | What can it reach outside the repo? | `mock-board`, `trello` |
| Command | Which workflow runs on one word? | `.opencode/commands/ticket-to-pr.md` |

▶ Lab 4, COACH-02

## 10. Multi-agent orchestration

Why split work across agents? The same reasons we split it across people:

- **Separation of duties:** the agent that wrote the code does not approve it.
- **Least privilege:** each role gets only the permissions its job needs.
- **Focused context:** a short prompt per role beats one giant prompt.

The `/ticket-to-pr` pipeline in this repo:

```text
 Planner ──plan.md──▶ Feature Builder ──commits──▶ Test Author ──report──▶ Reviewer ──verdict──▶ HUMAN GATE
 read-only            edit + bash                  edit + bash             read-only               you decide
                           ▲                                                   │
                           └──────────── REQUEST CHANGES (max 2 loops) ────────┘
```

- Each run works in its own **Git worktree**: a second working copy on its own branch, so your main checkout is
  never touched.
- Each hand-off is an explicit file (`plan.md`, test output, `review.md`), not memory. Every subagent starts fresh
  and knows only what it is handed.
- The pipeline **always** stops at the human gate. The reviewer's APPROVE is advice; your yes is the decision.

▶ Lab 5
