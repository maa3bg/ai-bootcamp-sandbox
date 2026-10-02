const { filterUsers } = require('../src/utils/filters');

const mockUsers = [
  { id: 1, name: 'Andrijana', role: 'Product Owner', active: true },
  { id: 2, name: 'Marko', role: 'Developer', active: true },
  { id: 3, name: 'Jelena', role: 'QA', active: false },
  { id: 4, name: 'Ivan', role: 'developer', active: true },
];

const names = (users) => users.map((user) => user.name);

describe('filterUsers', () => {
  // Test 1 - FAILS on the initial code (Intentional Bug 1: case-sensitive role match).
  test('matches roles case-insensitively ("Developer" and "developer")', () => {
    const results = filterUsers(mockUsers, 'Developer', true);
    expect(names(results)).toEqual(['Marko', 'Ivan']);
  });

  // Test 2 - FAILS on the initial code (Intentional Bug 2: omitted `active` is not defaulted).
  test('defaults to active users when the "active" argument is omitted', () => {
    expect(names(filterUsers(mockUsers, 'Product Owner'))).toEqual(['Andrijana']);
    expect(filterUsers(mockUsers, 'QA')).toEqual([]);
  });

  // Test 3 - PASSES on the initial code (standard exact matching).
  test('matches an exact role and explicit active status', () => {
    expect(names(filterUsers(mockUsers, 'QA', false))).toEqual(['Jelena']);
    expect(filterUsers(mockUsers, 'DevOps', true)).toEqual([]);
  });
});
