require('dotenv').config({ quiet: true });

const { filterUsers } = require('./utils/filters');

// Role to search for; override with SEARCH_ROLE in your local .env file.
const SEARCH_ROLE = process.env.SEARCH_ROLE || 'Developer';

// Mock dataset. Note the inconsistent casing: "Developer" vs "developer".
const users = [
  { id: 1, name: 'Andrijana', role: 'Product Owner', active: true },
  { id: 2, name: 'Marko', role: 'Developer', active: true },
  { id: 3, name: 'Jelena', role: 'QA', active: false },
  { id: 4, name: 'Ivan', role: 'developer', active: true },
  { id: 5, name: 'Nikola', role: 'Developer', active: false },
];

function formatNames(list) {
  return list.length > 0 ? list.map((user) => user.name).join(', ') : '(none)';
}

console.log('=== AI Bootcamp Sandbox App ===');
console.log('\nTeam roster:');
users.forEach((user) => {
  console.log(`  - ${user.name} (${user.role}, ${user.active ? 'active' : 'inactive'})`);
});

const activeMatches = filterUsers(users, SEARCH_ROLE, true);
console.log(`\nSearch 1: active users with role "${SEARCH_ROLE}"`);
console.log(`  filterUsers(users, '${SEARCH_ROLE}', true) -> ${activeMatches.length} result(s): ${formatNames(activeMatches)}`);

const defaultMatches = filterUsers(users, SEARCH_ROLE);
console.log(`\nSearch 2: role "${SEARCH_ROLE}" with "active" omitted (should default to active users)`);
console.log(`  filterUsers(users, '${SEARCH_ROLE}') -> ${defaultMatches.length} result(s): ${formatNames(defaultMatches)}`);

console.log('\nCompare the results with the roster above. Is anyone missing?');
