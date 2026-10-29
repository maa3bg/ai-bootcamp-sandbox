# Lab 0: Setup

**Time:** 30 minutes · **You need:** a computer where you can install software. No AI account is needed: OpenCode
includes free models.

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

macOS, Linux, or Git Bash on Windows:

```bash
bash scripts/smoke-test.sh
```

Windows PowerShell:

```powershell
& 'C:\Program Files\Git\bin\bash.exe' scripts/smoke-test.sh
```

Not planning to open pull requests (for example as a Product Owner or Agile coach)? Skip the GitHub CLI check:

```bash
SMOKE_SKIP_GH=1 bash scripts/smoke-test.sh                        # macOS, Linux, Git Bash
```

```powershell
$env:SMOKE_SKIP_GH = "1"                                          # Windows PowerShell
& 'C:\Program Files\Git\bin\bash.exe' scripts/smoke-test.sh
```

#### Windows only: set up the company proxy

The last check of the smoke test is the network connection. On a company network, Windows computers usually go
through a proxy that command-line tools do not find by themselves. If that check fails, or `npm ci` failed with
`ENOTFOUND` or a timeout, ask your IT team for the proxy address and run this in PowerShell, with your address
instead of `<proxy-host>:<port>`:

```powershell
# For the current terminal window
$env:HTTPS_PROXY = "http://<proxy-host>:<port>"
$env:HTTP_PROXY  = "http://<proxy-host>:<port>"

# Permanently, for every new terminal window
setx HTTPS_PROXY "http://<proxy-host>:<port>"
setx HTTP_PROXY  "http://<proxy-host>:<port>"

# For npm and Git
npm config set proxy "http://<proxy-host>:<port>"
npm config set https-proxy "http://<proxy-host>:<port>"
git config --global http.proxy "http://<proxy-host>:<port>"
```

Open a new terminal, run `npm ci` again if it failed, then run the smoke test again. When the proxy is picked up, the
network check prints `Using proxy from HTTPS_PROXY`. (In Git Bash, use `export HTTPS_PROXY="http://<proxy-host>:<port>"`
instead of `$env:`.) On macOS this is normally not needed.

### 4. Start OpenCode and pick a model

No account, API key or sign-up is needed: OpenCode comes with several **free models** built in. Start it inside the
repository folder:

```bash
opencode
```

Then type `/models`, look at the list (the free models are marked), and pick one. The exact list changes over time.
If your organisation later gives you its own model provider, `opencode auth login` connects it, but you do not need
that for this course.

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
| `npm ci` fails with `ENOTFOUND` or a timeout | You are probably behind a company proxy. On Windows, follow *Windows only: set up the company proxy* above |
| Windows: `bash` is not recognised in PowerShell | Use the full path: `& 'C:\Program Files\Git\bin\bash.exe' scripts/smoke-test.sh`, or open Git Bash |
| `opencode: command not found` | Open a new terminal after installing. On Windows, check that npm's global folder is on your PATH |
| OpenCode shows no models or cannot reach one | Type `/models` inside OpenCode and pick a free model; on a company network, set up the proxy first (step 3) |
| All 3 tests pass already | Someone fixed the training bugs on `main`. Run `git checkout origin/main -- src/utils/filters.js` |

**Next:** read [concepts.md](concepts.md) sections 1–5, then [Lab 1](lab-1-agentic-loop.md).
