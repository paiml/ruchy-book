#!/usr/bin/env bash
# EXTREME TDD validation for Chapter 21 - ruchy publish examples
# Tests all 5 examples with comprehensive output

set -uo pipefail

echo "======================================"
echo "Chapter 21: ruchy publish - EXTREME TDD"
echo "======================================"
echo ""

PASS=0
FAIL=0

# Test 1: Basic manifest + dry-run
echo "Test 1: Basic manifest with dry-run validation"
echo "--------------------------------------"
cd 01-basic-manifest
if ruchy publish --dry-run 2>&1 | grep -q "Package validation successful"; then
    echo "✅ PASS: Basic manifest validation works"
    ((PASS++))
else
    echo "❌ FAIL: Basic manifest validation failed"
    ((FAIL++))
fi
cd ..
echo ""

# Test 2: Complete manifest with all fields
echo "Test 2: Complete manifest with optional fields"
echo "--------------------------------------"
cd 02-complete-manifest
if ruchy publish --dry-run 2>&1 | grep -q "Package validation successful"; then
    echo "✅ PASS: Complete manifest validation works"
    ((PASS++))
else
    echo "❌ FAIL: Complete manifest validation failed"
    ((FAIL++))
fi
cd ..
echo ""

# Test 3: Missing Ruchy.toml (expect failure)
echo "Test 3: Missing Ruchy.toml error handling"
echo "--------------------------------------"
cd 03-missing-manifest
OUTPUT=$(ruchy publish --dry-run 2>&1 || true)
if echo "$OUTPUT" | grep -q "Ruchy.toml not found"; then
    echo "✅ PASS: Correctly detects missing Ruchy.toml"
    ((PASS++))
else
    echo "❌ FAIL: Did not detect missing Ruchy.toml"
    ((FAIL++))
fi
cd ..
echo ""

# Test 4: Incomplete manifest (expect failure)
echo "Test 4: Incomplete manifest error handling"
echo "--------------------------------------"
cd 04-incomplete-manifest
OUTPUT=$(ruchy publish --dry-run 2>&1 || true)
if echo "$OUTPUT" | grep -q "missing field"; then
    echo "✅ PASS: Correctly detects missing required fields"
    ((PASS++))
else
    echo "❌ FAIL: Did not detect missing required fields"
    ((FAIL++))
fi
cd ..
echo ""

# Test 5: Publishing options
echo "Test 5: Publishing options (--version, --allow-dirty)"
echo "--------------------------------------"
cd 05-publish-options
if ruchy publish --dry-run --version 1.0.1 --allow-dirty 2>&1 | grep -q "Package validation successful"; then
    echo "✅ PASS: Publishing options accepted"
    ((PASS++))
else
    echo "❌ FAIL: Publishing options rejected"
    ((FAIL++))
fi
cd ..
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
