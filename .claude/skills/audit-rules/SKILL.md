---
name: audit-rules
description: Audit .claude/rules/ for staleness, contradictions, gaps, and bloat. Use periodically or when suspecting rule rot.
disable-model-invocation: true
context: fork
agent: Explore
allowed-tools: Read, Grep, Glob
---

# Audit Rules

Analyze all files in `.claude/rules/` for health:

## Checks

### 1. Contradictions
- Find rules that conflict with each other across files
- Check if CLAUDE.md root contradicts any rule file
- Check if `.cursor/rules/` contradicts `.claude/rules/`

### 2. Staleness
- Find rules referencing files, paths, or patterns that no longer exist
- Check file paths mentioned in rules: `grep -r 'aulas/' .claude/rules/` → verify each path exists
- Rules referencing deprecated features or removed slides

### 3. Gaps
- Read `tasks/lessons.md` — find lessons with status `apply` that are NOT yet rules
- Read ERROR-LOG files in `aulas/*/` — recurring errors that should be rules but aren't
- Cross-reference XREF.md — is it up to date?

### 4. Bloat
- Rules that Claude already follows by default (no added value)
- Rules that duplicate other rules
- Rules that are too verbose (could be shortened without losing meaning)

### 5. Coverage
- Does every rule file appear in XREF.md?
- Does every rule have a clear "canonic for" declaration?
- Are there orphan rule files not referenced by anything?

## Output

```
## Rules Audit — [date]

### Contradictions Found
- [rule A] vs [rule B]: [description]

### Stale References
- [file:line]: references [path] which no longer exists

### Gaps (lessons → rules)
- [lesson from lessons.md] should become rule in [suggested file]

### Bloat Candidates
- [rule]: could be removed because [reason]

### XREF Status
- [up to date / N missing entries]

### Recommendations (prioritized)
1. [most impactful fix]
2. [second]
3. [third]
```

## Gate
- This skill is READ-ONLY. It reports findings but NEVER modifies files.
- Changes require user approval and a separate session to implement.
