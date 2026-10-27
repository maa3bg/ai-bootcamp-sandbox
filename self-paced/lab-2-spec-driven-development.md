# Lab 2: Spec-Driven Development

**Time:** 40 minutes · **Read first:** [concepts.md](concepts.md) section 6

## You will learn
- To spot the decisions hidden in a vague ticket.
- To write a spec with GOAL, CONTEXT, CONSTRAINTS, ACCEPTANCE CRITERIA and VERIFY WITH.
- To use an agent as a critic of your spec before any code is written.

## Steps

### 1. Read the vague ticket (2 min)

```bash
git checkout main
git checkout -b lab-2
```

Open `tickets/module-1-basic/ticket-00-vague.md`:

> "The search is slow and people are missing, fix the app now."

Before going on, write down in your notes what an agent might do with this. List every word that hides a decision.

### 2. Investigate (8 min)

Run `npm start` and `npm test` yourself. Then start `opencode` and ask:

`Without changing anything: which users does npm start miss, and which line in src/utils/filters.js causes it? Is there any evidence that the search is slow?`

You now know the facts. The agent did the digging; you make the decisions.

### 3. Write the spec (15 min)

Create `tickets/practice/my-ticket-00-spec.md` and fill in this template. Delete every `TODO`.

```markdown
# MY-TICKET-00: TODO title

## GOAL
TODO: one or two sentences, the outcome, not the implementation.

## CONTEXT
- TODO: which files, what happens today, the root causes, what you investigated and ruled out.

## CONSTRAINTS
- TODO: which files may change; what must not change (tests? the function signature?); dependencies.
- Out of scope: TODO

## ACCEPTANCE CRITERIA
1. [ ] TODO: a concrete input and an observable output.
2. [ ] TODO
3. [ ] TODO
4. [ ] TODO

## VERIFY WITH
    npm test
    TODO
```

### 4. Stress-test it with the planner agent (10 min)

In OpenCode, type:

`@planner What is ambiguous or missing in tickets/practice/my-ticket-00-spec.md? Do not edit anything.`

The `planner` is read-only, so it can only comment. Fix what it finds, or decide consciously to leave it. Ask once
more if you made big changes.

### 5. Compare with the reference (5 min)

Only now open `tickets/module-1-basic/ticket-01-sdd.md`. Go through the self-review checklist below.

## Self-review checklist

- [ ] My spec names the function and the file, not "the search" or "the app".
- [ ] It names both root causes: case-sensitive role matching, and `active` not defaulting to `true`.
- [ ] It decides what "slow" means (for example: investigated, under 10 records, out of scope).
- [ ] It limits which files may change, and says existing tests must not be edited.
- [ ] Every acceptance criterion has a concrete input and output, such as "`filterUsers(users, 'Developer')`
      behaves like `filterUsers(users, 'Developer', true)`".
- [ ] It covers the "don't break it" case: an explicit `active = false` still returns inactive users.
- [ ] VERIFY WITH lists real commands: `npm test` and `npm start`.

## Check yourself

```bash
npm run check -- lab2
git add -A && git commit -m "lab 2"
```

## Reflect
1. Which decision did the planner make you face that you had not thought of?
2. Which of the guesses you listed in step 1 does your spec now prevent?
3. Where would your spec and TICKET-01 lead an agent to write different code?

<details>
<summary><b>Answer key</b> (open after you finish)</summary>

The reference answer is `tickets/module-1-basic/ticket-01-sdd.md`. It is not the only right answer: a spec that
makes different but **explicit** decisions is a good result.

Decisions TICKET-01 makes that people often miss:
- Performance was investigated and is **out of scope** (fewer than 10 records), so the agent will not chase it.
- The input array and user objects must not be mutated.
- No new dependencies.
- Whitespace trimming and fuzzy matching are explicitly out of scope.
- A non-array `users` argument still returns `[]` without throwing.

If your spec has an acceptance criterion with an adjective ("works correctly", "fast", "robust"), rewrite it with an
input and an output.
</details>

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `@planner` is not suggested when you type `@` | Make sure you started OpenCode inside the repository folder; the planner is defined in `.opencode/opencode.json` |
| The check says sections are missing | Headings must be exactly `## GOAL`, `## CONTEXT`, `## CONSTRAINTS`, `## ACCEPTANCE CRITERIA`, `## VERIFY WITH` |

**Next:** [Lab 3](lab-3-custom-agent.md). Return to `main` first: `git checkout main`.
