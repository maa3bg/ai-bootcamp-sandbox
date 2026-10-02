const { filterUsers } = require('../src/utils/filters');

const mockUsers = [
  { id: 1, name: "Andrijana", role: "Product Owner", active: true },
  { id: 2, name: "Marko", role: "Developer", active: true },
  { id: 3, name: "Jelena", role: "QA", active: false },
  { id: 4, name: "Ivan", role: "developer", active: true }
];

describe("Filter Users Tests", () => {
  test("Should successfully filter active developers (Case-Sensitivity Test)", () => {
    const results = filterUsers(mockUsers, "Developer", true);
    // THIS WILL FAIL initially because the filter utility does not recognize "developer" (lowercase 'd') for Ivan
    expect(results.length).toBe(2);
  });

  test("Should return an empty array for a non-existing role", () => {
    const results = filterUsers(mockUsers, "DevOps", true);
    expect(results.length).toBe(0);
  });
});
