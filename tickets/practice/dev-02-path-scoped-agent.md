# DEV-02: Path-Scoped Guardrails and Your Own Slash Command

> Track exercise for software engineers. You extend the agent setup itself.

## GOAL
Create a `docs-writer` agent that may edit files only under `docs/`, plus a `/explain-file` command, and prove both
guardrails and the command work.

## CONTEXT
- Agents: `.opencode/agents/*.md`. Commands: `.opencode/commands/<name>.md` (`$ARGUMENTS` is replaced with what
  the user types after the command). Example command: `.opencode/commands/ticket-to-pr.md`.
- OpenCode permissions can be patterns, where the **last matching rule wins**:
  ```yaml
  permission:
    edit:
      "*": deny
      "docs/**": allow
    bash: deny
  ```

## CONSTRAINTS
- `docs-writer` may only create or edit files under `docs/`. Bash and web fetch are denied.
- `/explain-file <path>` must run with the read-only `reviewer` agent (`agent: reviewer` in its frontmatter) and
  return a plain-English explanation of the file for a new team member.
- Do not change any existing agent, command or source file.

## ACCEPTANCE CRITERIA
1. [ ] `docs-writer` creates `docs/filters.md`, documenting `filterUsers` (parameters, return value, known bugs).
2. [ ] Asked to "also fix the bug in src/utils/filters.js", `docs-writer` is blocked by the permission system, and
       you can show the denial.
3. [ ] `/explain-file src/utils/filters.js` produces an explanation and makes no file changes.
4. [ ] `git status` shows only the new agent file, the new command file and `docs/filters.md`.

## VERIFY WITH
```bash
opencode agent list
git status
```
