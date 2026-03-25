#!/usr/bin/env bash
INPUT=$(cat 2>/dev/null || echo 'EMPTY')
echo "=== $(date) ===" >> /tmp/hook-debug.log
echo "INPUT_LENGTH: ${#INPUT}" >> /tmp/hook-debug.log
echo "INPUT_FIRST_200: ${INPUT:0:200}" >> /tmp/hook-debug.log
echo "NODE_EXISTS: $(which node 2>/dev/null || echo 'NOT FOUND')" >> /tmp/hook-debug.log
echo "NODE_PARSE: $(echo "$INPUT" | node -e "const d=JSON.parse(require('fs').readFileSync(0,'utf8')||'{}'); console.log((d.tool_input||{}).file_path||'NOPATH');" 2>&1)" >> /tmp/hook-debug.log
echo "---" >> /tmp/hook-debug.log
exit 0
