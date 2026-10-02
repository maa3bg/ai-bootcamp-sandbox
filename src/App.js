const { filterUsers } = require('./utils/filters');

const dummyUsers = [
  { id: 1, name: "Andrijana", role: "Product Owner", active: true },
  { id: 2, name: "Marko", role: "Developer", active: true },
  { id: 3, name: "Jelena", role: "QA", active: false },
  { id: 4, name: "Ivan", role: "developer", active: true } // "developer" starts with a lowercase letter
];

console.log("=== AI Bootcamp Sandbox App ===");
const activeDevs = filterUsers(dummyUsers, "Developer", true);
console.log(`Active developers found: ${activeDevs.length}`);

