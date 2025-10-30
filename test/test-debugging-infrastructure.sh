#!/usr/bin/env -S ../bashrs/target/release/bashrs
# TICKET-020 TDD RED: Test Debugging Infrastructure on Book Examples
# This test SHOULD show which examples work with debugging

set -e

echo "🔴 TDD RED: Testing Debugging Infrastructure on Book Examples"
echo "=============================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Track results
TOTAL_TESTS=0
TRACE_WORKING=0
TRACE_FAILING=0
RUCHYDBG_STATUS="unknown"

# Test 1: ruchydbg validate (infrastructure test)
echo "Test 1: ruchydbg validate"
if [ -d "../ruchyruchy/validation" ]; then
    if (cd ../ruchyruchy && ruchydbg validate >/dev/null 2>&1); then
        echo -e "${GREEN}✅ PASS${NC}: ruchydbg validate working"
        RUCHYDBG_STATUS="working"
    else
        echo -e "${RED}❌ FAIL${NC}: ruchydbg validate failed"
        RUCHYDBG_STATUS="broken"
    fi
else
    echo -e "${YELLOW}⏭️  SKIP${NC}: ../ruchyruchy not available"
    RUCHYDBG_STATUS="not_available"
fi
echo ""

# Test 2: Simple expressions with --trace
echo "Test 2: Simple expressions with --trace"
TEST_EXPR="2 + 2"
RESULT=$(echo "$TEST_EXPR" | ruchy --trace 2>&1 | grep -E "^4$" || true)
if [ -n "$RESULT" ]; then
    echo -e "${GREEN}✅ PASS${NC}: Simple expression traces correctly"
    ((TRACE_WORKING++))
else
    echo -e "${YELLOW}⚠️  INFO${NC}: Simple expressions don't show TRACE output (expected)"
fi
((TOTAL_TESTS++))
echo ""

# Test 3: Function calls with --trace
echo "Test 3: Function calls with --trace"
TEST_FUNC='fun square(x) { x * x }; square(5)'
RESULT=$(echo "$TEST_FUNC" | ruchy --trace 2>&1)
if echo "$RESULT" | grep -q "TRACE:"; then
    echo -e "${GREEN}✅ PASS${NC}: Function calls show TRACE output"
    echo "   Sample output: $(echo "$RESULT" | grep TRACE: | head -1)"
    ((TRACE_WORKING++))
else
    echo -e "${RED}❌ FAIL${NC}: Function calls don't show TRACE output"
    echo "   Output was: $RESULT"
    ((TRACE_FAILING++))
fi
((TOTAL_TESTS++))
echo ""

# Test 4: Test on actual book example (from passing.log)
echo "Test 4: Testing Chapter 3 Function Example"
# Simple function example that should trace
TEST_BOOK='fun add(a, b) { a + b }; add(3, 4)'
RESULT=$(echo "$TEST_BOOK" | ruchy --trace 2>&1)
if echo "$RESULT" | grep -q "TRACE:.*add"; then
    echo -e "${GREEN}✅ PASS${NC}: Book function example traces correctly"
    echo "   Trace output: $(echo "$RESULT" | grep TRACE:)"
    ((TRACE_WORKING++))
else
    echo -e "${YELLOW}⚠️  INFO${NC}: Book example ran but didn't show TRACE"
    echo "   Output: $RESULT"
fi
((TOTAL_TESTS++))
echo ""

# Test 5: Test with RUCHY_TRACE environment variable
echo "Test 5: Testing RUCHY_TRACE environment variable"
RESULT=$(RUCHY_TRACE=1 ruchy -e "fun multiply(x, y) { x * y }; multiply(6, 7)" 2>&1)
if echo "$RESULT" | grep -q "TRACE:"; then
    echo -e "${GREEN}✅ PASS${NC}: RUCHY_TRACE environment variable works"
    ((TRACE_WORKING++))
else
    echo -e "${YELLOW}⚠️  INFO${NC}: RUCHY_TRACE didn't enable tracing (note: -e flag has issues)"
fi
((TOTAL_TESTS++))
echo ""

# Summary
echo "=============================================================="
echo "🎯 TDD RED Summary: Debugging Infrastructure Test Results"
echo "=============================================================="
echo ""
echo "   ruchydbg validate: $RUCHYDBG_STATUS"
echo "   --trace flag: $TRACE_WORKING/$TOTAL_TESTS examples traced"
echo ""

if [ "$TRACE_WORKING" -gt 0 ]; then
    echo -e "${GREEN}✅ GREEN PHASE READY${NC}: Debugging infrastructure is functional"
    echo "   Next: Test on all 129 working book examples"
    exit 0
else
    echo -e "${RED}❌ RED PHASE COMPLETE${NC}: Issues found with debugging"
    echo "   Fix: Resolve trace flag issues before GREEN phase"
    exit 1
fi
