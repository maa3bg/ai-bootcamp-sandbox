# DEV-01: Write the Spec, Then Let the Agent Build It (`searchUsersByName`)

> Track exercise for software engineers. Agents: `planner` (review your spec), `feature-builder` (implement it).

## THE REQUEST (as it arrived from the product owner)
> "Recruiters want to type part of a name, like 'mar' or 'IVA', and see matching people. Inactive people should be
> hidden unless they ask for them."

## YOUR TASK
1. Rewrite the request below as an SDD spec (GOAL, CONTEXT, CONSTRAINTS, ACCEPTANCE CRITERIA, VERIFY WITH) by
   replacing every `TODO`. Decide and write down: the function name and signature, where it lives, how matching
   works (case, position, whitespace), what happens with empty or invalid input, and the default for inactive users.
2. Ask the `planner` agent to review your spec: "What is ambiguous or missing in this spec?" Fix what it finds.
3. Hand the final spec to the `feature-builder` agent and compare what it built with what you meant.

## GOAL
TODO

## CONTEXT
- Existing helper for reference: `src/utils/filters.js`
- Test file: TODO

## CONSTRAINTS
- TODO (which files may change, dependencies, out of scope)

## ACCEPTANCE CRITERIA
1. [ ] TODO (at least 5 criteria, each one testable)

## VERIFY WITH
```bash
npm test
```

## DEBRIEF QUESTIONS
- Which of your decisions did the agent follow exactly, and where did it fill a gap on its own?
- Which acceptance criterion would you now write differently?
