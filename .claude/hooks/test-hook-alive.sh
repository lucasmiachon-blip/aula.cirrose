#!/usr/bin/env bash
echo "HOOK ALIVE $(date)" >> /tmp/hook-test.log
cat > /dev/null
exit 0
