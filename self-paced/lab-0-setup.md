# Lab 0: Setup

**Time:** 30 minutes · **You need:** a computer where you can install software, and model access from your
organisation.

## You will learn
- How to get the sandbox running.
- How to start OpenCode and talk to an agent for the first time.

## Steps

### 1. Install the tools

| Tool | Version | How to check |
| --- | --- | --- |
| [Node.js](https://nodejs.org) | 20 or newer (LTS) | `node -v` |
| [Git](https://git-scm.com/downloads) | any recent | `git --version` |
| [OpenCode](https://opencode.ai) | latest | `npm install -g opencode-ai`, then `opencode --version` in a **new** terminal |
| [GitHub CLI](https://cli.github.com) | any recent | `gh --version`. Needed only to open a pull request in Lab 5 |

On Windows, use **Git Bash** (installed with Git) for every command in this course.

### 2. Get the repository

- **If you want to open a pull request in Lab 5:** fork the repository on GitHub, then clone your fork:
  `git clone https://github.com/<your-user>/ai-bootcamp-sandbox.git`, run `gh auth login`, and then, inside the
  folder, `gh repo set-default <your-user>/ai-bootcamp-sandbox` so pull requests go to your fork.
- **Otherwise:** clone the repository you were given. You can still do every lab; at the end of Lab 5 you will
  answer "no" at the gate instead of opening a pull request.

Then:

```bash
cd ai-bootcamp-sandbox
npm ci
```

### 3. Run the smoke test

```bash
bash scripts/smoke-test.sh
```

Not planning to open pull requests (for example as a Product Owner or Agile coach)? Run
`SMOKE_SKIP_GH=1 bash scripts/smoke-test.sh` instead (in Git Bash; in PowerShell first run
`$env:SMOKE_SKIP_GH=1`).

### 4. Connect a model

```bash
opencode auth login
```

Choose the provider your organisation gave you and paste the credentials when asked. Credentials stay in OpenCode's
own settings, never in this repository.

### 5. Say hello to an agent

Start OpenCode **inside the repository folder**:

```bash
opencode
```

Type: `What is this repository for? Answer in 3 bullet points, and do not change anything.`

Then quit OpenCode (type `/exit`, or press Ctrl+C), and run:

```bash
npm start
npm test
```

## What you should see

- The smoke test ends with `[ALL GREEN]`.
- The agent answers with a short summary. It probably read `README.md` or `AGENTS.md` first. That was its first
  loop.
- `npm start` prints the team roster and two searches: **Search 1 finds 1 result (Marko)** and **Search 2 finds 0
  results**. The correct answer would be 2 (Marko and Ivan).
- `npm test` reports **1 passed, 2 failed**. This is on purpose: the bugs are the material for Lab 1.

## Check yourself

```bash
npm run check -- lab0
```

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `npm ci` fails with `ENOTFOUND` or a timeout | You are probably behind a proxy: check `npm config get https-proxy` and ask your IT team for the proxy address |
| `opencode: command not found` | Open a new terminal after installing. On Windows, check that npm's global folder is on your PATH |
| OpenCode asks for a provider or shows an auth error | Run `opencode auth login` again with the details from your organisation |
| All 3 tests pass already | Someone fixed the training bugs on `main`. Run `git checkout origin/main -- src/utils/filters.js` |

**Next:** read [concepts.md](concepts.md) sections 1–5, then [Lab 1](lab-1-agentic-loop.md).
