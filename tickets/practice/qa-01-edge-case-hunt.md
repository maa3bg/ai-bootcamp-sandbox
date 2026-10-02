# QA-01: Edge-Case Hunt on `filterUsers`

> Track exercise for QA engineers. Agent: `test-author` + the `qa-edge-cases` skill.

## GOAL
Grow the test suite for `filterUsers` with edge-case tests whose expected behaviour is defined below, and report
which of them expose product bugs.

## CONTEXT
- Source: `src/utils/filters.js`. Tests: `tests/filters.test.js`.
- Skill: `.opencode/skills/qa-edge-cases/SKILL.md`.
- Expected behaviour for the edge cases (this is the spec; do not invent other behaviour):

  | # | Input | Expected result |
  |---|-------|-----------------|
  | 1 | `users` is `null`, `undefined` or not an array | `[]`, no exception |
  | 2 | `users` is `[]` | `[]` |
  | 3 | `users` contains `null` or a non-object item | that item is skipped, no exception |
  | 4 | A user object has no `role` property | that user is skipped, no exception |
  | 5 | `active` is passed explicitly as `undefined` | same result as omitting it (active users) |
  | 6 | The same user object appears twice in `users` | both occurrences are returned (no de-duplication) |
  | 7 | Any call | the input array and its objects are not modified |

## CONSTRAINTS
- Only append tests to `tests/filters.test.js`. Do not modify `src/` and do not change existing assertions.
- One behaviour per `test`, named after the expectation (for example, `skips null items without throwing`).
- No new dependencies.

## ACCEPTANCE CRITERIA
1. [ ] Every row of the table above is covered by at least one test.
2. [ ] `npm test` was run, and its output is included in the report.
3. [ ] The report classifies each failing test as a **product bug** (the spec is not met), not a test problem.
4. [ ] No file outside `tests/` was changed (`git status`).

## VERIFY WITH
```bash
npm test
git status
```
