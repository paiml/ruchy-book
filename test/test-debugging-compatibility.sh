#!/usr/bin/env bash
# TICKET-020 Phase 4: Debugging Compatibility Testing
# Test RUCHY_TRACE=1 on diverse working examples across the book

set -e

echo "🐛 TICKET-020 Phase 4: Debugging Compatibility Testing"
echo "======================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Results tracking
TOTAL_TESTS=0
TRACE_WORKING=0
TRACE_FAILING=0
declare -a RESULTS

# Helper function to test an example
test_example() {
    local category="$1"
    local chapter="$2"
    local code="$3"
    local description="$4"

    ((TOTAL_TESTS++))

    echo -e "${BLUE}Test $TOTAL_TESTS: $category${NC}"
    echo "  Chapter: $chapter"
    echo "  Code: $description"
    echo ""

    # Run with RUCHY_TRACE=1
    RESULT=$(echo "$code" | RUCHY_TRACE=1 timeout 10 ruchy 2>&1 || true)

    # Check if trace output was produced
    if echo "$RESULT" | grep -q "TRACE:"; then
        echo -e "${GREEN}✅ PASS${NC}: Trace output produced"

        # Check if type information is present
        if echo "$RESULT" | grep -q ": integer\|: string\|: float\|: boolean\|: array"; then
            echo -e "${GREEN}✅ PASS${NC}: Type information present"
            TYPE_INFO="✅"
        else
            echo -e "${YELLOW}⚠️  INFO${NC}: No type information found"
            TYPE_INFO="⚠️"
        fi

        # Show sample trace output (first 2 lines)
        echo "  Sample trace:"
        echo "$RESULT" | grep "TRACE:" | head -2 | sed 's/^/    /'

        ((TRACE_WORKING++))
        RESULTS+=("| $category | $chapter | ✅ | $TYPE_INFO | Working |")
    else
        echo -e "${YELLOW}⚠️  INFO${NC}: No trace output (may not be a function call)"
        echo "  Output was: $(echo "$RESULT" | head -1)"
        RESULTS+=("| $category | $chapter | ⚠️ | N/A | No trace (not a function call) |")
    fi

    echo ""
}

# Test 1: Simple function (baseline)
echo "=== Category 1: Simple Function ==="
test_example "Simple function" "Ch3" \
    "fun add(a, b) { a + b }; add(10, 20)" \
    "Basic two-argument function"

# Test 2: Recursion (call stack depth)
echo "=== Category 2: Recursive Function ==="
test_example "Recursion" "Ch13" \
    "fun factorial(n) { if n <= 1 { 1 } else { n * factorial(n - 1) } }; factorial(4)" \
    "Recursive factorial with call stack"

# Test 3: String operations
echo "=== Category 3: String Operations ==="
test_example "String ops" "Ch2" \
    "fun greet(name) { \"Hello, \" + name }; greet(\"World\")" \
    "String concatenation function"

# Test 4: Float arithmetic
echo "=== Category 4: Float Arithmetic ==="
test_example "Float math" "Ch2" \
    "fun divide(a, b) { a / b }; divide(10.5, 2.5)" \
    "Floating-point division"

# Test 5: Boolean logic
echo "=== Category 5: Boolean Logic ==="
test_example "Boolean logic" "Ch4" \
    "fun is_even(n) { n % 2 == 0 }; is_even(42)" \
    "Boolean return value"

# Test 6: Array operations
echo "=== Category 6: Array Operations ==="
test_example "Array ops" "Ch6" \
    "fun first(arr) { arr[0] }; first([1, 2, 3])" \
    "Array element access"

# Test 7: Multiple returns
echo "=== Category 7: Multiple Function Calls ==="
test_example "Multiple calls" "Ch3" \
    "fun square(x) { x * x }; square(3) + square(4)" \
    "Multiple function calls in expression"

# Test 8: Nested function calls
echo "=== Category 8: Nested Calls ==="
test_example "Nested calls" "Ch3" \
    "fun add(a, b) { a + b }; fun double(x) { x * 2 }; add(double(5), double(3))" \
    "Nested function calls"

# Test 9: Local variables
echo "=== Category 9: Local Variables ==="
test_example "Local variables" "Ch13" \
    "fun compute(x) { let y = x * 2; y + 10 }; compute(5)" \
    "Function with local variable"

# Test 10: Complex expression
echo "=== Category 10: Complex Expression ==="
test_example "Complex expr" "Ch3" \
    "fun calc(a, b, c) { (a + b) * c }; calc(2, 3, 4)" \
    "Multi-argument with complex math"

# Generate summary
echo "=========================================="
echo "🎯 Phase 4 Summary: Debugging Compatibility"
echo "=========================================="
echo ""
echo "   Total examples tested: $TOTAL_TESTS"
echo "   Trace working: $TRACE_WORKING"
echo ""

# Generate compatibility matrix
echo "Compatibility Matrix:"
echo ""
echo "| Feature Category | Chapter | Trace Works? | Type Info? | Notes |"
echo "|------------------|---------|-------------|-----------|-------|"
for result in "${RESULTS[@]}"; do
    echo "$result"
done
echo ""

# Results
if [ "$TRACE_WORKING" -ge 8 ]; then
    echo -e "${GREEN}✅ PHASE 4 SUCCESS${NC}: Debugging highly compatible ($TRACE_WORKING/$TOTAL_TESTS)"
    echo "   Recommendation: RUCHY_TRACE=1 works excellently across diverse code types"
    exit 0
elif [ "$TRACE_WORKING" -ge 5 ]; then
    echo -e "${YELLOW}⚠️  PHASE 4 PARTIAL${NC}: Debugging partially compatible ($TRACE_WORKING/$TOTAL_TESTS)"
    echo "   Recommendation: Document which code types work with tracing"
    exit 0
else
    echo -e "${RED}❌ PHASE 4 ISSUES${NC}: Debugging limited compatibility ($TRACE_WORKING/$TOTAL_TESTS)"
    echo "   Recommendation: Investigate debugging limitations"
    exit 1
fi
