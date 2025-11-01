#!/usr/bin/env bash
# EXTREME TDD validation for Chapter 21 - ruchy optimize examples
# Tests all 4 optimization examples with comprehensive output

set -uo pipefail

echo "======================================"
echo "Chapter 21: ruchy optimize - EXTREME TDD"
echo "======================================"
echo ""

PASS=0
FAIL=0

# Test 1: Quick optimization analysis
echo "Test 1: Quick optimization analysis"
echo "--------------------------------------"
if ruchy optimize factorial.ruchy --depth quick 2>&1 | grep -q "Optimization Analysis"; then
    echo "✅ PASS: Quick analysis works"
    ((PASS++))
else
    echo "❌ FAIL: Quick analysis failed"
    ((FAIL++))
fi
echo ""

# Test 2: Deep analysis with all flags
echo "Test 2: Deep optimization analysis with all flags"
echo "--------------------------------------"
OUTPUT=$(ruchy optimize factorial.ruchy --depth deep --cache --branches --vectorization --abstractions 2>&1)
if echo "$OUTPUT" | grep -q "Cache Behavior" && \
   echo "$OUTPUT" | grep -q "Branch Prediction" && \
   echo "$OUTPUT" | grep -q "Vectorization" && \
   echo "$OUTPUT" | grep -q "Abstraction Costs"; then
    echo "✅ PASS: Deep analysis with all flags works"
    ((PASS++))
else
    echo "❌ FAIL: Deep analysis missing expected sections"
    ((FAIL++))
fi
echo ""

# Test 3: Hardware benchmarking
echo "Test 3: Hardware benchmarking"
echo "--------------------------------------"
if ruchy optimize --benchmark factorial.ruchy 2>&1 | grep -q "Hardware Benchmark"; then
    echo "✅ PASS: Hardware benchmarking works"
    ((PASS++))
else
    echo "❌ FAIL: Hardware benchmarking failed"
    ((FAIL++))
fi
echo ""

# Test 4: Report generation (JSON, HTML, text)
echo "Test 4: Report generation in multiple formats"
echo "--------------------------------------"
rm -f test-*.json test-*.html test-*.txt

# JSON
if ruchy optimize factorial.ruchy --format json --output test-report.json 2>&1 | grep -q "saved" && \
   [ -f test-report.json ]; then
    echo "  ✅ JSON report generation works"
    ((PASS++))
else
    echo "  ❌ JSON report generation failed"
    ((FAIL++))
fi

# HTML
if ruchy optimize factorial.ruchy --format html --output test-report.html 2>&1 | grep -q "saved" && \
   [ -f test-report.html ]; then
    echo "  ✅ HTML report generation works"
    ((PASS++))
else
    echo "  ❌ HTML report generation failed"
    ((FAIL++))
fi

# Text
if ruchy optimize factorial.ruchy --format text --output test-report.txt 2>&1 | grep -q "saved" && \
   [ -f test-report.txt ]; then
    echo "  ✅ Text report generation works"
    ((PASS++))
else
    echo "  ❌ Text report generation failed"
    ((FAIL++))
fi

# Cleanup
rm -f test-report.json test-report.html test-report.txt
echo ""

# Summary
echo "======================================"
echo "SUMMARY"
echo "======================================"
echo "Total tests: $((PASS + FAIL))"
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "🎉 All tests passed! EXTREME TDD validation complete."
    exit 0
else
    echo "❌ Some tests failed. Review output above."
    exit 1
fi
