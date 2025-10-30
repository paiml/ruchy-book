#!/usr/bin/env -S ../bashrs/target/release/bashrs
# TDD RED: Test One-Liner Infrastructure
# This test SHOULD FAIL initially, proving ruchy -e is broken

set -e

echo "🔴 TDD RED: Testing One-Liner Infrastructure"
echo "=============================================="
echo ""

# Test 1: ruchy -e flag (EXPECTED TO FAIL)
echo "Test 1: ruchy -e \"2 + 2\" (using -e flag)"
RESULT=$(ruchy -e "2 + 2" 2>&1 || true)
if [ "$RESULT" = "4" ]; then
    echo "✅ PASS: -e flag works"
else
    echo "❌ FAIL: -e flag produces: '$RESULT' (expected: '4')"
    echo "   This proves -e is broken in v3.149.0"
fi
echo ""

# Test 2: stdin piping (EXPECTED TO PASS)
echo "Test 2: echo \"2 + 2\" | ruchy (using stdin)"
RESULT=$(echo "2 + 2" | ruchy 2>&1 | grep -v "Welcome\|Type\|Ruchy REPL\|Goodbye\|functions\|Quality" | grep -E "^[0-9]+$" || true)
if [ "$RESULT" = "4" ]; then
    echo "✅ PASS: stdin piping works"
else
    echo "❌ FAIL: stdin produces: '$RESULT' (expected: '4')"
fi
echo ""

echo "=============================================="
echo "🎯 Conclusion: Switch from -e flag to stdin piping"
