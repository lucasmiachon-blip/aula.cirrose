#!/usr/bin/env bash
# Hook 1 — PreToolUse: Block Write to slides/*.html if evidence-db.md not read this session
# Exit 2 = block. Exit 0 = allow.

INPUT=$(cat)

# Extract file_path from tool_input
FILE_PATH=$(echo "$INPUT" | python -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('tool_input', {}).get('file_path', ''))
except:
    print('')
" 2>/dev/null)

# Only apply to aulas/cirrose/slides/*.html
if [[ "$FILE_PATH" != *"aulas/cirrose/slides/"* ]] || [[ "$FILE_PATH" != *.html ]]; then
    exit 0
fi

# Get transcript path
TRANSCRIPT=$(echo "$INPUT" | python -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(d.get('transcript_path', ''))
except:
    print('')
" 2>/dev/null)

# If no transcript available, allow (can't verify)
if [ -z "$TRANSCRIPT" ] || [ ! -f "$TRANSCRIPT" ]; then
    exit 0
fi

# Search transcript for a Read tool call on evidence-db.md
FOUND=$(python -c "
import json, sys

found = False
try:
    with open(sys.argv[1], encoding='utf-8', errors='replace') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
                # Handle both direct message and wrapped { message: ... } formats
                msg = entry.get('message', entry)
                content = msg.get('content', [])
                if not isinstance(content, list):
                    continue
                for item in content:
                    if not isinstance(item, dict):
                        continue
                    if item.get('type') == 'tool_use' and item.get('name') == 'Read':
                        fp = item.get('input', {}).get('file_path', '')
                        if 'evidence-db.md' in fp:
                            found = True
                            break
                if found:
                    break
            except Exception:
                continue
except Exception:
    pass

print('1' if found else '0')
" "$TRANSCRIPT" 2>/dev/null)

if [ "$FOUND" = "1" ]; then
    exit 0
fi

# Block
echo "Ler evidence-db.md antes de editar slides. Caminho: aulas/cirrose/references/evidence-db.md" >&2
exit 2
