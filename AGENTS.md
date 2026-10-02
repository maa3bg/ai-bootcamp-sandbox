# 🤖 Global Rules for All Agents in the Project

This file is the global constitution of the repository. Every agent working in this codebase must read it and
strictly follow these rules. Agent-specific files in `.opencode/agents/` add to these rules but never override them.

1. **Language**: Respond exclusively in English, unless the technical task or the code specifically requires
   another language.

2. **Code Quality**:
   - All new or changed code must comply with the project's ESLint rules and match the style of the surrounding
     code (CommonJS modules, naming, quotes, comment density).
   - Avoid hardcoded values. Use configuration variables or environment properties (`process.env`, loaded with
     `dotenv`; document new variables in `.env.example`).

3. **Verification Rule**: Never mark a task as "Done" or "Completed" until you have run the test suite with
   `npm test` and confirmed that all tests pass. If tests fail, report the failing output honestly.
   Never modify, skip or delete existing tests to make them pass.

4. **Security**: Never write, hardcode or commit API keys, tokens or credentials anywhere in the codebase, and never
   commit `.env` files. Only `.env.example`, with placeholder values, is tracked by Git.

5. **Scope and Specs**: Work from the SDD ticket you were given (`tickets/`) and stay within its CONSTRAINTS. If a
   request is vague or missing acceptance criteria, ask clarifying questions instead of guessing.

6. **Permissions**: Respect the permissions in your agent definition. If an action is denied, report it and stop.
   Never try to work around a guardrail.

7. **Training Bugs**: `src/utils/filters.js` contains intentional bugs used in the bootcamp exercises. Fix them only
   when a ticket explicitly asks you to.
