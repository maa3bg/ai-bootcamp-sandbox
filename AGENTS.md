
---

### 📄 `AGENTS.md`
This file serves as the global constitution. Any agent executing in this codebase is instructed to read and strictly adhere to these guidelines.

```markdown
# 🤖 Global Rules for All Agents in the Project

All agents operating within this repository must strictly follow these rules:

1. **Language**: Respond exclusively in English unless the technical task or code specifically dictates otherwise.
2. **Code Quality**: 
   - All newly generated code must comply with ESLint rules defined in the project.
   - Avoid hardcoded values; always utilize configuration variables or environment properties.
3. **Verification Rule**: Never mark a task as "Done" or "Completed" until you have successfully run the test suite via `npm test` and verified that all tests are passing.
4. **Security**: Never write, hardcode, or commit API keys, tokens, or credentials into the codebase or `.env` files tracked by Git.
