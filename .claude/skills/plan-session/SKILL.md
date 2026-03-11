---
name: plan-session
description: Plan current session by reading HANDOFF and proposing max 3 tasks. Use at session start.
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
context: fork
agent: Explore
---

# Plan Session

Plan this work session by analyzing project state:

1. **Git state:** !`git log --oneline -5 && echo "---" && git status --short`
2. **Branch:** !`git branch --show-current`
3. Read the active HANDOFF.md (check `aulas/cirrose/HANDOFF.md` first, then others)
4. Read `tasks/lessons.md` if it exists — identify recent patterns
5. Read root `CLAUDE.md` for workflow instructions and hard constraints
6. Identify the **critical path** (what blocks slides from passing QA)

## Output format

```
## Session Plan — [date]

### Branch: [current branch]

### Critical Path
- [most important blocked items from HANDOFF]

### Proposed Tasks (max 3)
1. [task] — why now, estimated scope
2. [task] — why now, estimated scope
3. [task] — why now, estimated scope

### Explicitly Deferred
- [items NOT doing this session and why]

### Anti-drift Check
- Last session produced: [N slides / support only]
- This session target: [concrete deliverable]
```

## Rules
- Max 3 tasks per session (CLAUDE.md rule)
- If 0 slides in last 2 sessions → flag as drift risk
- Always propose at least 1 Produto task (slide-touching)
- Contraponto obrigatorio for non-obvious decisions
