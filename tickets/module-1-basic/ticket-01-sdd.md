# TICKET-01: Case-Insensitive Role Search and Default Active Status in `filterUsers`

> Spec-Driven Development (SDD) ticket. This is [TICKET-00](./ticket-00-vague.md) rewritten:
> the same business problem, with every decision an agent would otherwise guess written down.

## GOAL
Make `filterUsers` return every matching user regardless of role casing, and treat an
omitted `active` argument as "active users only".

## CONTEXT
- Source file: `src/utils/filters.js` (`filterUsers(users, role, active)`, CommonJS export).
- Test file: `tests/filters.test.js` (Jest). Tests 1 and 2 currently fail; Test 3 passes.
- Demo: `npm start` runs `src/App.js`, which currently finds 1 active developer instead of 2.
- Root causes:
  1. `user.role === role` is case-sensitive, so `"developer"` does not match `"Developer"`.
  2. When `active` is omitted it is `undefined`, and `user.active === undefined` never matches.
- "The search is slow" (TICKET-00) was investigated: the dataset has fewer than 10 records,
  so performance is **out of scope** for this ticket.

## CONSTRAINTS
- Change only `src/utils/filters.js`. You may **add** tests to `tests/filters.test.js`, but you
  must not modify or delete existing assertions.
- Keep the function signature `filterUsers(users, role, active)` and the CommonJS export.
- Do not mutate the input array or the user objects.
- Do not add dependencies to `package.json`.
- Follow all rules in `AGENTS.md`.
- Out of scope: whitespace trimming, partial/fuzzy matching, performance work, changes to `src/App.js`.

## ACCEPTANCE CRITERIA
1. [ ] `filterUsers(users, 'developer', true)` and `filterUsers(users, 'Developer', true)` both return
       the active users whose role is `"Developer"` or `"developer"`, in their original order.
2. [ ] `filterUsers(users, 'Developer')` (no `active` argument) behaves exactly like
       `filterUsers(users, 'Developer', true)`.
3. [ ] An explicit `active = false` still returns only inactive users.
4. [ ] A non-array `users` argument still returns `[]` without throwing.
5. [ ] All tests pass, and `npm start` reports 2 active developers in both searches.

## VERIFY WITH
```bash
npm test
npm start
```
