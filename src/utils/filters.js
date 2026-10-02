/**
 * Filters an array of users by role and active status.
 *
 * TRAINER NOTE: this function intentionally contains two bugs that power the
 * Module 1 hands-on exercises (see tickets/module-1-basic/ticket-01-sdd.md).
 * Do not fix them on the main branch.
 *
 * @param {Array<{ name: string, role: string, active: boolean }>} users - Users to filter
 * @param {string} role - Role to match (e.g. 'Developer', 'QA')
 * @param {boolean} [active] - Activity status to match; intended to default to `true`
 * @returns {Array} Users matching both criteria
 */
function filterUsers(users, role, active) {
  if (!Array.isArray(users)) {
    return [];
  }

  return users.filter((user) => {
    // INTENTIONAL BUG 1: strict, case-sensitive comparison, so 'developer' never matches 'Developer'.
    // INTENTIONAL BUG 2: an omitted `active` argument is `undefined`, so nothing matches and the
    // result is empty instead of defaulting to active users.
    return user.role === role && user.active === active;
  });
}

module.exports = { filterUsers };
