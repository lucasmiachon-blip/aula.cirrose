---
name: review-session
description: End-of-session review — update HANDOFF, count artifacts, extract lessons. Use at session end.
disable-model-invocation: true
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

# Review Session

End-of-session review and state update:

1. **What changed:** !`git diff --stat HEAD~5 2>/dev/null || echo "fewer than 5 commits"`
2. **Recent commits:** !`git log --oneline -5`
3. **Uncommitted work:** !`git status --short`
4. Read current HANDOFF.md for the active project

## Actions

### A. Count Artifacts
- Files in `aulas/*/slides/` changed → count as slide artifacts
- CSS files changed → count as design artifacts
- Docs/rules changed → count as support artifacts
- If 0 slide artifacts → flag as support-only session

### B. Update HANDOFF.md
Edit the active HANDOFF.md with:
- What was completed this session
- What is still pending (with priority)
- What the NEXT session should start with
- Any blockers or decisions needed from user

### C. Extract Lessons (if any)
If mistakes were made or corrections applied during session:
- Append to `tasks/lessons.md` with format:
```
## Session [date] — [topic]
### [lesson title]
- Context: what happened
- Fix: what was done
- Rule: generalized principle (link to .claude/rules/ if applicable)
```

### D. Summary
```
## Session Summary — [date]
- Commits: [count]
- Slide artifacts: [count]
- Support artifacts: [count]
- Status: [on track / behind / blocked / drift]
- Next session starts with: [specific task]
```
