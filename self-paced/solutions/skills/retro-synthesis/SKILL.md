---
name: retro-synthesis
description: Step-by-step procedure for synthesizing raw retrospective notes into themes, trends across retros, and at most 3 measurable experiments. Use whenever you are asked to summarize, analyse or synthesize retro or sticky notes.
---

<!-- Reference solution for COACH-02. To use it, copy this folder to .opencode/skills/retro-synthesis/ and restart OpenCode. -->

# Skill: Retro Synthesis

## Step 1: Collect
Read every note and keep its retro (date or sprint) and its column (went well, didn't go well, idea).

## Step 2: Group into themes
- Merge notes that say the same thing ("pairing", "pairing!! more of it").
- Name each theme in 2–4 neutral words (for example "Unplanned work", "Review speed", "Board accuracy").
- Count the notes per theme, per retro.

## Step 3: Make it safe
- If a note blames a named person, rewrite it as a process observation ("Merges happen without review") and never
  repeat the name, in any form, anywhere in the output.
- Do not guess who wrote a note.

## Step 4: Compare retros
Mark each theme **improved** (negative notes went down or positive notes appeared), **persisted** (still raised)
or **new** (only in the latest retro). Cite the counts.

## Step 5: Propose experiments
At most 3. For each: the theme it addresses, the change, a signal you can measure (a column in
`data/sprint-history.csv`, or something visible on the board), and the review date (the next retro).

## Output format
1. A table: `Theme | Retro S4 | Retro S6 | Trend`.
2. The experiments as a numbered list.
3. One sentence on what the data cannot tell you.
