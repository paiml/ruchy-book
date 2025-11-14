#!/usr/bin/env bash
# Quick validation that all Ruchy benchmarks work with v3.176.0

set -euo pipefail

echo "Validating Ruchy v$(ruchy --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+')"
echo ""

BENCHMARKS=(003 004 005 007 008 011 012)
PASS=0
FAIL=0

for num in "${BENCHMARKS[@]}"; do
    script="bench-${num}-*.ruchy"
    found=$(ls $script 2>/dev/null | head -1)

    if [ -z "$found" ]; then
        echo "❌ BENCH-${num}: Script not found"
        FAIL=$((FAIL + 1))
        continue
    fi

    printf "Testing BENCH-${num}: %-40s ... " "$(basename $found)"

    if timeout 10 ruchy run "$found" >/dev/null 2>&1; then
        echo "✅ PASS"
        PASS=$((PASS + 1))
    else
        echo "❌ FAIL"
        FAIL=$((FAIL + 1))
    fi
done

echo ""
echo "=========================================="
echo "Validation Summary:"
echo "  Passed: $PASS/7"
echo "  Failed: $FAIL/7"
echo "=========================================="

if [ $FAIL -eq 0 ]; then
    echo "✅ All benchmarks validated! Ready to run full suite."
    exit 0
else
    echo "⚠️  Some benchmarks failed. Review before running full suite."
    exit 1
fi
