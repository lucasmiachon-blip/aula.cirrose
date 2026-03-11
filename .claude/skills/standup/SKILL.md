---
name: standup
description: Generate daily standup summary from git history and project state. Quick session start overview.
disable-model-invocation: true
allowed-tools: Bash, Read, Grep, Glob
---

# Standup

Generate a quick standup summary:

## Data sources
1. **Recent work:** !`git log --oneline --since="yesterday" 2>/dev/null || git log --oneline -10`
2. **Current state:** !`git status --short`
3. **Branch:** !`git branch --show-current`

## Process
1. Summarize commits since yesterday (or last 10 if no yesterday commits)
2. Read active HANDOFF.md — extract pending items
3. Check for uncommitted changes that may be in-progress work

## Output

```
## Standup — [date]

### Done (since yesterday)
- [items from git log, grouped by topic]

### In Progress
- [uncommitted changes or partially completed items from HANDOFF]

### Next
- [top 1-3 items from HANDOFF critical path]

### Blockers
- [any items flagged as blocked or pending external input]
```

Keep output under 20 lines. This is a quick overview, not a deep analysis.
Use /plan-session for detailed session planning.
