# COACH-02: Package Your Retro Facilitation as a Skill

> Track exercise for Agile Team Coaches and Scrum Masters. You write a reusable **skill**: a step-by-step procedure
> any agent can load on demand. Then you let an agent apply it to real retro notes.

## GOAL
Create a `retro-synthesis` skill that turns raw retro sticky notes into themes, trends and a small set of
experiments, and use it on `data/retro-notes.md`.

## CONTEXT
- Raw notes from two retros (after S4 and after S6): `data/retro-notes.md`. They include duplicates, a name-blaming
  note and items that repeat across both retros.
- Reference skill: `.opencode/skills/qa-edge-cases/SKILL.md`. A skill is a folder with a `SKILL.md` that starts with
  YAML frontmatter: `name` (lowercase, hyphens, same as the folder name) and `description` (when to use it).
- Agents see only the skill's name and description until they decide to load it, so the description must say
  clearly when the skill applies.

## CONSTRAINTS
- Work on your own branch: `git checkout main && git checkout -b coach-02`.
- Skill file: `.opencode/skills/retro-synthesis/SKILL.md`, frontmatter `name: retro-synthesis` and a `description`.
- The procedure must include these steps, in your own words:
  1. Group notes into themes and count them; merge duplicates.
  2. Compare the two retros: which themes improved, persisted or appeared.
  3. Rewrite any note that blames a named person as a neutral process observation, and never repeat the name.
  4. Propose at most 3 experiments, each with a measurable signal and a review date (next retro).
- Do not change `data/retro-notes.md` or any other existing file.

## ACCEPTANCE CRITERIA
1. [ ] The skill file exists with valid frontmatter, and the folder name equals `name`.
2. [ ] Asked "Synthesize the retro notes in data/retro-notes.md", the agent loads `retro-synthesis` by itself (you see
       a `skill` tool call), without you naming the skill.
3. [ ] The output groups the notes into themes with counts, and marks each theme as improved, persisted or new.
4. [ ] The names in the two blaming notes do not appear in the output.
5. [ ] The output proposes at most 3 experiments, each with a signal you could measure in `data/sprint-history.csv`
       or on the board.
6. [ ] `git status` shows only the new skill folder.

## VERIFY WITH
```bash
npm run check -- coach-02
git status
```

## DEBRIEF QUESTIONS
- If the agent did not load the skill on its own, what did you change in the description to make it work?
- What else from your coaching practice would make a good skill (for example, a working-agreement check or a
  sprint-goal review)?
