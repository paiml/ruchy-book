#!/usr/bin/env bash
# TICKET-020 Phase 4: Simplified Debugging Compatibility Testing

set -e

echo "🐛 TICKET-020 Phase 4: Debugging Compatibility Testing"
echo "======================================================"
echo ""

# Track results
TOTAL=0
WORKING=0

# Helper to test one example
test_code() {
    local name="$1"
    local chapter="$2"
    shift 2
    local code="$*"

    ((TOTAL++))
    echo "Test $TOTAL: $name ($chapter)"

    # Write code to temp file
    TMPFILE=$(mktemp)
    echo "$code" > "$TMPFILE"

    # Run with trace
    if cat "$TMPFILE" | RUCHY_TRACE=1 ruchy 2>&1 | grep -q "TRACE:"; then
        echo "  ✅ Trace working"
        ((WORKING++))
    else
        echo "  ⚠️  No trace output"
    fi

    rm -f "$TMPFILE"
    echo ""
}

# Run tests
test_code "Simple function" "Ch3" "fun add(a, b) { a + b }; add(10, 20)"
test_code "Recursion" "Ch13" "fun factorial(n) { if n <= 1 { 1 } else { n * factorial(n - 1) } }; factorial(4)"
test_code "String ops" "Ch2" "fun greet(name) { \"Hello, \" + name }; greet(\"World\")"
test_code "Float math" "Ch2" "fun divide(a, b) { a / b }; divide(10.5, 2.5)"
test_code "Boolean" "Ch4" "fun is_even(n) { n % 2 == 0 }; is_even(42)"
test_code "Array ops" "Ch6" "fun first(arr) { arr[0] }; first([1, 2, 3])"
test_code "Multiple calls" "Ch3" "fun square(x) { x * x }; square(3) + square(4)"
test_code "Nested calls" "Ch3" "fun add(a, b) { a + b }; fun double(x) { x * 2 }; add(double(5), double(3))"
test_code "Local vars" "Ch13" "fun compute(x) { let y = x * 2; y + 10 }; compute(5)"
test_code "Complex expr" "Ch3" "fun calc(a, b, c) { (a + b) * c }; calc(2, 3, 4)"

# Summary
echo "=========================================="
echo "Summary: $WORKING/$TOTAL examples traced successfully"
echo "=========================================="

if [ "$WORKING" -ge 8 ]; then
    echo "✅ Phase 4 SUCCESS: Excellent compatibility"
    exit 0
else
    echo "⚠️  Phase 4 PARTIAL: Limited compatibility"
    exit 1
fi
