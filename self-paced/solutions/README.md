# Reference Solutions

Try each exercise yourself first. These files are one good answer, not the only one.

They are stored here, outside `.opencode/`, so OpenCode does **not** load them. To try one, copy it to the folder
named in its first comment and restart OpenCode.

| Exercise | Reference | Copy to |
| --- | --- | --- |
| Lab 3 | [agents/spec-checker.md](agents/spec-checker.md) | `.opencode/agents/spec-checker.md` |
| PO-01 | [agents/story-refiner.md](agents/story-refiner.md) | `.opencode/agents/story-refiner.md` |
| PO-03 | Answer key below | (uses the default build agent) |
| COACH-01 | [agents/sprint-health.md](agents/sprint-health.md) | `.opencode/agents/sprint-health.md` |
| COACH-02 | [skills/retro-synthesis/SKILL.md](skills/retro-synthesis/SKILL.md) | `.opencode/skills/retro-synthesis/SKILL.md` |
| Lab 2 | `tickets/module-1-basic/ticket-01-sdd.md` | (already in the repository) |

## Answer keys for the role tracks

<details>
<summary><b>PO-01</b>: questions REQ-1 should raise</summary>

| Phrase in REQ-1 | Question it hides |
| --- | --- |
| "which roles" | All roles found in the data, or a fixed list? What about casing ("developer" vs "Developer")? |
| "covered" / "available" | Does available mean `active: true`? Is there any other notion of availability in the data? |
| "this week" | The roster in `src/App.js` has no dates or calendar. Is "this week" out of scope? |
| "see" | Where: console output of `npm start`, a new command, a function other code can call? |
| "warn us" | How: a line in the output, a non-zero exit code, a message somewhere? |
| "a role has nobody" | Nobody at all, or nobody active? |
| "easy to use" | One command? Which? |

A good spec for REQ-1 also states what stays unchanged (for example `filterUsers` and the existing tests) and lists
at least one out-of-scope item (dates, calendars, partial availability).
</details>

<details>
<summary><b>PO-02</b>: BOOT-101 vs BOOT-102</summary>

BOOT-101 links to the vague TICKET-00 and BOOT-102 links to TICKET-01, which is TICKET-00 rewritten as a spec. They
describe the same problem. A strong PO decision is to close BOOT-101 as a duplicate of BOOT-102 (or link them), with
a comment saying so. Keeping BOOT-101 is also defensible if you decide performance ("slow") deserves its own
investigation, but then its description should say exactly that.

BOOT-102 is marked Done, but on `main` 2 of 3 tests fail. Its acceptance-criteria comment should be checkable by a
non-developer, for example: "Searching for Developer finds both Marko and Ivan" and "`npm start` reports 2 active
developers in both searches".
</details>

<details>
<summary><b>PO-03</b>: one good breakdown of REQ-4</summary>

There is more than one right answer. This is a breakdown a team could start on; compare the shape, not the wording.

**EPIC: Weekly team hours report.** Team leads and Finance get hours they can trust, from today's file, with one
command.

| Story | User story | Example acceptance criteria | Example sub-tasks |
| --- | --- | --- | --- |
| 1. Read today's file safely | As a team lead, I want the report to run on the current file, so that I always get a result | Running it on `data/team_metrics.csv` finishes without an error; a row without a name is skipped and reported | Handle both date formats; decide how empty hours are treated |
| 2. Hours and people per role | As a team lead, I want hours and headcount per role, so that I see where time goes | `Developer` and `developer` are one role; each role shows total hours and number of people | Normalise role casing; decide how duplicate rows are counted |
| 3. Data problems list | As a team lead, I want every data problem listed, so that I know whether to trust the numbers | Each problem shows its line number and reason; the 4 known problem lines (4, 5, 6, 7) all appear | List the checks to run; word the messages for non-developers |
| 4. Hours per person for Finance | As a Finance analyst, I want hours per person as a CSV file, so that I can invoice | One row per person with name and hours; a duplicate row is not counted twice | Agree the CSV columns with Finance; choose where the file is written |
| 5. One command | As a team lead, I want to run everything with one command, so that I do not need help | One documented command produces both outputs; it works on Windows and macOS | Add the command; document it in the README |

**OUT OF SCOPE:** monthly totals (a separate, later story once weekly works), charts, other data sources.

**OPEN QUESTIONS** worth asking the stakeholder:
- Is the exact duplicate row (lines 3 and 6) counted once or twice?
- Are missing hours zero, or is the row excluded from totals?
- Which week is "weekly": the date in the file, or the calendar week the report runs?
- Do `Pending` rows and inactive people count?
- REQ-2 (Finance) asks for hours per person too: is story 4 the answer to REQ-2, and can they be linked?

**On the board:** 1 Epic, 5 Stories with the Epic as `parent`, and about 10 Sub-tasks, each with its Story as
`parent`. `get_card` on the Epic lists its 5 Stories as `children`.

Common weaknesses: stories split by technical layer ("parse CSV", "write tests") instead of by user value; acceptance
criteria without a concrete input; and monthly totals quietly added to story 2.
</details>

<details>
<summary><b>COACH-01</b>: the numbers</summary>

| Sprint | Committed | Completed | Say/do % | Unplanned % of committed | Blocked days |
| --- | --- | --- | --- | --- | --- |
| S1 | 30 | 27 | 90.0 | 6.7 | 1 |
| S2 | 32 | 24 | 75.0 | 18.8 | 3 |
| S3 | 30 | 30 | 100.0 | 3.3 | 0 |
| S4 | 34 | 22 | 64.7 | 26.5 | 5 |
| S5 | 28 | missing | n/a (22 if derived: 28 − 6 carried over) | 14.3 | 2 |
| S6 | 30 | 26 | 86.7 | 16.7 | 2 |

Data problems: S5 has no `completed_points`; S3's `end_date` is `14/08/2026` while all others use `YYYY-MM-DD`.

Patterns worth naming:
- Unplanned work and blocked days rise and fall together (S3 lowest on both; S4 highest on both).
- The lowest say/do ratio (S4, 64.7%) is the sprint with the production incident.
- S2 committed the most points of the first three sprints (32) while two people were on holiday, and completed
  only 24. S5, with a team of 4, committed the least (28), so there the commitment did adjust to capacity.
- Over the 5 sprints with recorded completion, the team completed 25.8 points on average against 31.2 committed.
  (With S5 derived as 22: 25.2 completed against 30.7 committed over all 6.)

Good retro questions: "What made S3 different?", "How do we decide how much to commit when someone is away?", "What
would help us protect the sprint from unplanned work?"
</details>

<details>
<summary><b>COACH-02</b>: themes in the retro notes</summary>

| Theme | Retro S4 | Retro S6 | Trend |
| --- | --- | --- | --- |
| Unplanned work and incidents | 2 negative, 1 positive, 2 ideas (rota, buffer) | 1 negative, 1 positive ("fewer surprises") | Improved |
| Standup length | 1 negative, 1 idea | 1 positive | Improved |
| Board accuracy | 1 negative | 1 negative, 1 idea | Persisted |
| Code review | 1 negative (names a person), 1 idea | 1 negative, 1 idea | Persisted |
| Pairing | 2 positive (one is a duplicate) | 1 positive | Persisted (positive) |
| Demo and PO feedback | 1 positive | 1 positive | Persisted (positive) |
| Clarity and ownership | 1 negative (hotfix owner) | 1 negative (sprint goal), 1 idea | Persisted |
| QA timing | — | 1 negative (names a person) | New |
| Retro facilitation | — | 1 idea (rotate) | New |

Your grouping may differ; what matters is that the counts follow from the notes and the trends are justified.

The two notes that name a person ("Marko keeps merging without a review", "Jelena is always late with QA") must be
rewritten as process observations, for example "Merges happen without review" and "QA starts late in the sprint",
and the names must not appear in the output.
</details>
