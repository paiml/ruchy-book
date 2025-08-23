#!/bin/bash
# Quality Gates for TDD-Driven Ruchy Book
# 
# This script enforces MANDATORY quality gates
# NO COMMITS allowed unless ALL gates pass
#
# Toyota Way: Quality built-in, not bolted-on

set -e  # Exit on any failure

echo "🔒 MANDATORY Quality Gates for Ruchy Book"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track gate status
GATES_PASSED=0
GATES_FAILED=0

# Function to check a gate
check_gate() {
    local gate_name="$1"
    local command="$2"
    local required="$3"
    
    echo -n "🔍 Checking $gate_name... "
    
    if eval "$command"; then
        echo -e "${GREEN}✅ PASS${NC} (Required: $required)"
        ((GATES_PASSED++))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC} (Required: $required)"
        ((GATES_FAILED++))
        return 1
    fi
}

# Gate 1: All examples must compile with ruchy test
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "GATE 1: Test Compilation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -d "tests" ]; then
    TOTAL_TESTS=$(find tests -name "*.ruchy" | wc -l)
    PASSING_TESTS=0
    
    for test_file in tests/**/*.ruchy; do
        if [ -f "$test_file" ]; then
            if ruchy test "$test_file" &>/dev/null; then
                ((PASSING_TESTS++))
            fi
        fi
    done
    
    if [ "$TOTAL_TESTS" -eq 0 ]; then
        echo -e "${YELLOW}⚠️  No tests found${NC}"
    elif [ "$PASSING_TESTS" -eq "$TOTAL_TESTS" ]; then
        echo -e "${GREEN}✅ All $TOTAL_TESTS tests pass${NC}"
        ((GATES_PASSED++))
    else
        echo -e "${RED}❌ Only $PASSING_TESTS/$TOTAL_TESTS tests pass${NC}"
        ((GATES_FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  Tests directory not found${NC}"
fi

echo ""

# Gate 2: Lint compliance
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "GATE 2: Lint Compliance"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

LINT_ISSUES=0
for test_file in tests/**/*.ruchy; do
    if [ -f "$test_file" ]; then
        if ! ruchy lint --strict "$test_file" &>/dev/null; then
            ((LINT_ISSUES++))
        fi
    fi
done

if [ "$LINT_ISSUES" -eq 0 ]; then
    echo -e "${GREEN}✅ All files pass strict linting${NC}"
    ((GATES_PASSED++))
else
    echo -e "${RED}❌ $LINT_ISSUES files have lint issues${NC}"
    ((GATES_FAILED++))
fi

echo ""

# Gate 3: No vaporware documentation
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "GATE 3: No Vaporware"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

VAPORWARE_COUNT=$(grep -r "coming soon\|not yet implemented\|TODO\|FIXME" src/ 2>/dev/null | wc -l || echo "0")

if [ "$VAPORWARE_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ No vaporware documentation found${NC}"
    ((GATES_PASSED++))
else
    echo -e "${RED}❌ Found $VAPORWARE_COUNT vaporware references${NC}"
    grep -r "coming soon\|not yet implemented\|TODO\|FIXME" src/ | head -5
    ((GATES_FAILED++))
fi

echo ""

# Gate 4: Coverage threshold
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "GATE 4: Test Coverage"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if ruchy coverage command exists
if command -v ruchy &>/dev/null && ruchy coverage --help &>/dev/null; then
    COVERAGE=$(ruchy coverage tests/ 2>/dev/null | grep -oP '\d+(?=%)' | head -1 || echo "0")
    
    if [ "$COVERAGE" -ge 80 ]; then
        echo -e "${GREEN}✅ Coverage: $COVERAGE% (Required: ≥80%)${NC}"
        ((GATES_PASSED++))
    else
        echo -e "${RED}❌ Coverage: $COVERAGE% (Required: ≥80%)${NC}"
        ((GATES_FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  Coverage testing not available${NC}"
fi

echo ""

# Gate 5: INTEGRATION.md exists and is recent
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "GATE 5: Integration Report"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "INTEGRATION.md" ]; then
    # Check if file was modified in last 24 hours
    if [ "$(find INTEGRATION.md -mtime -1 | wc -l)" -eq 1 ]; then
        echo -e "${GREEN}✅ INTEGRATION.md is up to date${NC}"
        ((GATES_PASSED++))
    else
        echo -e "${YELLOW}⚠️  INTEGRATION.md may be stale (>24 hours old)${NC}"
        echo "   Run: deno run --allow-all scripts/tdd-harness.ts"
        ((GATES_FAILED++))
    fi
else
    echo -e "${RED}❌ INTEGRATION.md not found${NC}"
    echo "   Run: deno run --allow-all scripts/tdd-harness.ts"
    ((GATES_FAILED++))
fi

echo ""

# Gate 6: Book builds without errors
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "GATE 6: Book Build"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v mdbook &>/dev/null; then
    if mdbook build &>/dev/null; then
        echo -e "${GREEN}✅ Book builds successfully${NC}"
        ((GATES_PASSED++))
    else
        echo -e "${RED}❌ Book build failed${NC}"
        ((GATES_FAILED++))
    fi
else
    echo -e "${YELLOW}⚠️  mdbook not installed${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "QUALITY GATE SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL_GATES=$((GATES_PASSED + GATES_FAILED))
PASS_RATE=$((GATES_PASSED * 100 / TOTAL_GATES))

echo "Gates Passed: $GATES_PASSED/$TOTAL_GATES ($PASS_RATE%)"
echo ""

if [ "$GATES_FAILED" -eq 0 ]; then
    echo -e "${GREEN}✅ ALL QUALITY GATES PASSED${NC}"
    echo ""
    echo "Book is ready for release!"
    exit 0
else
    echo -e "${RED}❌ QUALITY GATES FAILED${NC}"
    echo ""
    echo "The following must be fixed before commit:"
    echo "1. Run: deno run --allow-all scripts/tdd-harness.ts"
    echo "2. Fix all failing tests"
    echo "3. Address lint issues"
    echo "4. Remove vaporware documentation"
    echo "5. Increase test coverage"
    echo ""
    echo "Toyota Way: Never allow defects to pass downstream!"
    exit 1
fi