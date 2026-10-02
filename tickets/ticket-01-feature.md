# TICKET-01: Implement Case-Insensitive Search and Default Active Status in User Filter

## GOAL
Enhance the `filterUsers` function so that role searching is case-insensitive and handles missing/omitted `active` parameters gracefully.

## CONTEXT
- Source file: `src/utils/filters.js`
- Test file: `tests/filters.test.js`

## CONSTRAINTS
- Do not modify the structure of the objects in the `mockUsers` dataset.
- Do not introduce external dependencies beyond what is already listed in `package.json`.

## ACCEPTANCE CRITERIA
1. [ ] Calling `filterUsers(users, "developer", true)` must return users with roles "Developer" and "developer".
2. [ ] If the `active` parameter is omitted (e.g., `filterUsers(users, "Developer")`), the function should default to filtering only **active** users (`active: true`).
3. [ ] All test cases in `tests/filters.test.js` must pass successfully.

## VERIFY WITH
```bash
npm test
