# TICKET-04: Team Hours Report (Capstone)

> The final exercise. You take one requirement from a business request all the way to a pull request:
> **requirement → SDD spec → Trello card → `/ticket-to-pr TICKET-04` → human gate → PR → card in Done.**

## PART A: THE BUSINESS REQUIREMENT
> "Team leads want a weekly hours report built from `data/team_metrics.csv`. It should show the total hours and
> the number of people per role, and list every data problem it found, so they know whether to trust the
> numbers. It has to run with one command and must not crash on the messy file we have today."
> (Requested by: Team Lead. Priority: High.)

## PART B: SETUP (once per participant)
1. **Trello account and board**
   - Sign up at [trello.com](https://trello.com) (a free Atlassian account is enough).
   - Create a board named `AI Bootcamp - <your name>` with four lists: `To Do`, `In Progress`, `In Review`, `Done`.
2. **API key and token**
   - Open the [Trello Power-Up admin portal](https://trello.com/power-ups/admin) (`trello.com/app-key` redirects
     there), create a new integration in your workspace, and generate an **API key**.
   - On the same page, follow the **Token** link, allow access, and copy the **token**.
   - Open your board, add `.json` to the end of its URL, and copy the top-level `"id"`: that is the **board ID**.
3. **Expose them as environment variables** (never in a tracked file; never commit them):
   ```powershell
   # Windows PowerShell (current session)
   $env:TRELLO_API_KEY  = "<api key>"
   $env:TRELLO_TOKEN    = "<token>"
   $env:TRELLO_BOARD_ID = "<board id>"
   ```
   ```bash
   # macOS / Linux / Git Bash
   export TRELLO_API_KEY="<api key>" TRELLO_TOKEN="<token>" TRELLO_BOARD_ID="<board id>"
   ```
4. **Enable the Trello MCP server:** in `.opencode/opencode.json`, set `"enabled": true` for `mcp.trello`, then
   restart OpenCode from the same terminal. `opencode mcp list` must show `trello connected`.
5. **GitHub:** fork this repository, make your fork the `origin` remote, and run `gh auth login`.

## PART C: YOUR SDD SPEC (replace every TODO as a team, before running the pipeline)
The pipeline refuses to start while any `TODO` remains.

## GOAL
TODO

## CONTEXT
- Input data: `data/team_metrics.csv`
- TODO (new files, entry point, test file)

## CONSTRAINTS
- No new dependencies (parse the CSV with Node.js built-ins).
- TODO

## ACCEPTANCE CRITERIA
1. [ ] TODO (cover: totals per role, people per role, every data problem in today's file, the one command,
       no crash on bad rows)

## VERIFY WITH
```bash
npm test
TODO (the one command)
```

## TRELLO CARD
- Board: TODO (your board name)
- Card: TODO (card title or URL; create it in `To Do` with the business requirement as its description)

## PART D: RUN IT
1. Ask the agent to create the Trello card from Part A (a write action, so approve it), or create it by hand.
2. Run `/ticket-to-pr TICKET-04` and watch the card move to `In Progress`, then `In Review`.
3. At the human gate, check the evidence. Approve only if every acceptance criterion is met.
4. Merge the PR on GitHub yourself, then move the card to `Done` and add the PR link as a comment.

## DONE WHEN
- [ ] The PR is merged and `npm test` passes on `main`.
- [ ] The Trello card is in `Done`, and its comments show every stage plus the PR link.
- [ ] No credentials appear in the repository or the PR: searching the history for the first 8 characters of
      your token (`git log -p --all | grep <first-8-chars>`) finds nothing.
