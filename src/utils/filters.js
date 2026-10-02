/**
 * Filters an array of users based on their role and active status.
 * @param {Array} users - Array of user objects
 * @param {string} role - User role to filter by (e.g., 'Developer', 'QA')
 * @param {boolean} active - Activity status
 */
function filterUsers(users, role, active) {
  if (!users || !Array.isArray(users)) {
    return [];
  }

  return users.filter(user => {
    // INTENTIONAL BUGS FOR THE HANDS-ON EXERCISE:
    // 1. The check for 'active' fails to handle scenarios where the active argument is omitted (undefined).
    // 2. Case-sensitivity issues with the role comparison (e.g., "Developer" vs "developer").
    return user.role === role && user.active === active;
  });
}

module.exports = { filterUsers };
