---
name: qa-edge-cases
description: Step-by-step QA checklist for finding and testing edge cases (omitted arguments, null references, empty inputs, casing, duplicate data, input mutation) in JavaScript functions with Jest.
---

# 🛠️ Skill: QA Edge-Case Checklist

Use this procedure whenever you write or review tests for a function.

## Step 1: Map the inputs
List every parameter, its expected type, and whether it is optional. Note what the spec (ticket) says the default
should be for each optional parameter.

## Step 2: Walk the checklist
For **each** parameter, decide whether the case applies and write the expected result:

| # | Category | Ask yourself | Example for `filterUsers(users, role, active)` |
|---|----------|--------------|------------------------------------------------|
| 1 | **Omitted arguments** | What happens when a trailing argument is not passed at all? | `filterUsers(users, 'QA')`: `active` should default to `true` |
| 2 | **Explicit `undefined`** | Does `fn(a, undefined)` behave like `fn(a)`? | `filterUsers(users, 'QA', undefined)` |
| 3 | **Null references** | `null` instead of a value, `null` items inside a collection, objects missing a property | `filterUsers(null, 'QA')`, `[null, user]`, `{ name: 'X' }` without `role` |
| 4 | **Empty inputs** | `[]`, `''`, `{}` | `filterUsers([], 'QA')`, `filterUsers(users, '')` |
| 5 | **Type mismatches** | A number or object where a string or array is expected | `filterUsers('users', 'QA')`, `filterUsers(users, 42)` |
| 6 | **String normalisation** | Casing and surrounding whitespace | `'developer'` vs `'Developer'` vs `' Developer '` |
| 7 | **Duplicate data** | The same object twice, two items with the same `id`, repeated values | `[marko, marko]`: are both kept, or de-duplicated? |
| 8 | **Boundaries** | One element, all elements match, none match | A single-user list, all inactive users |
| 9 | **Immutability** | Is the input array or object left unchanged? | Snapshot `users` before the call and compare after it |

## Step 3: Resolve the expected behaviour
- If the spec defines it, test it.
- If the spec is silent, **do not invent behaviour**. Record it as an open question in your report, and only test
  that the function does not crash, if that is clearly required.

## Step 4: Write the tests
- One behaviour per `test`, with a name that states the expectation:
  `returns [] when users is null`.
- Compare meaningful values (for example, `names(result)`) instead of only lengths, so failures are self-explanatory.
- Append the tests; never modify or delete existing assertions.

## Step 5: Run and report
Run `npm test`, then report a table: `Edge case | Expected | Result (pass/fail) | Product bug or open question`.
