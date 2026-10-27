# PO-01: From a Stakeholder Request to an Agent-Ready Spec

> Track exercise for Product Owners. You build a read-only `story-refiner` agent, use it to interrogate a vague
> request, and write the final SDD spec yourself. Then the `planner` agent tells you what is still ambiguous.

## GOAL
Turn REQ-1 from `data/stakeholder-requests.md` into an SDD spec that an agent could implement without guessing, and
learn which questions an agent forces you to answer.

## CONTEXT
- The request: REQ-1 "Role coverage" in `data/stakeholder-requests.md`.
- What exists today: `src/App.js` (a team roster of 5 users with `name`, `role`, `active`) and `filterUsers` in
  `src/utils/filters.js`. Read them, or ask your agent to explain them; you do not need to understand the code.
- Reference spec: `tickets/module-1-basic/ticket-01-sdd.md` shows the format and the level of detail.
- Reference for a read-only agent: `.opencode/agents/reviewer.md`.

## CONSTRAINTS
- Work on your own branch: `git checkout main && git checkout -b po-01`.
- Agent file: `.opencode/agents/story-refiner.md` with `permission: edit: deny, bash: deny, webfetch: deny`.
- The agent asks and drafts; it never writes files. **You** save the final spec.
- Save your spec as `tickets/practice/po-01-my-spec.md`, with the five headings GOAL, CONTEXT, CONSTRAINTS,
  ACCEPTANCE CRITERIA and VERIFY WITH, and no `TODO` left. VERIFY WITH must include `npm test`, plus the command
  that shows the new behaviour.
- Do not change any other file.

## ACCEPTANCE CRITERIA
1. [ ] The `story-refiner` agent exists, has a `description`, and appears in `opencode agent list`.
2. [ ] Given REQ-1, the agent first lists at least 5 clarifying questions, each naming the word or phrase in the
       request that is ambiguous (for example "available", "this week", "warn", "easy to use").
3. [ ] Your spec answers every one of those questions, or lists it explicitly as out of scope.
4. [ ] Your spec has at least 5 numbered acceptance criteria, each with a concrete input and an observable output.
5. [ ] You asked the `planner` agent "What is ambiguous or missing in this spec?" and fixed or consciously accepted
       each point it raised (note your decisions at the bottom of the spec under `## DECISIONS`).
6. [ ] `git status` shows only the new agent file and your spec.

## VERIFY WITH
```bash
npm run check -- po-01
git status
```

## DEBRIEF QUESTIONS
- Which question from the agent surprised you most? Would a developer have asked it, or silently guessed?
- Which acceptance criterion was hardest to make testable, and why?

## OPTIONAL: WATCH AGENTS BUILD YOUR SPEC
Give your spec the title `# PO-01-SPEC: <your title>`, then run `/ticket-to-pr PO-01-SPEC` (see Lab 5 in
`self-paced/`). Compare what the agents built with what you meant. Answer `no` at the human gate if you have no fork
to push to; you still see the whole pipeline.
