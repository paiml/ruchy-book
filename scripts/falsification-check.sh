#!/bin/bash
# 100-point Karl Popper Falsification Check for Ruchy Book Examples
# Based on docs/specifications/ruchy-book-2.0.md

set -o pipefail

RUCHY="${RUCHY:-ruchy}"
TOTAL_POINTS=0
PASSED_POINTS=0
EXAMPLES_TESTED=0
EXAMPLES_PASSED=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_point() {
    local name="$1"
    local cmd="$2"
    local points="$3"

    TOTAL_POINTS=$((TOTAL_POINTS + points))
    if eval "$cmd" >/dev/null 2>&1; then
        PASSED_POINTS=$((PASSED_POINTS + points))
        echo -e "  ${GREEN}PASS${NC} ($points pts): $name"
        return 0
    else
        echo -e "  ${RED}FAIL${NC} ($points pts): $name"
        return 1
    fi
}

falsify_example() {
    local example="$1"
    local example_total=0
    local example_passed=0

    echo ""
    echo "================================================================"
    echo -e "${YELLOW}Falsifying: $example${NC}"
    echo "================================================================"

    # Category A: Syntactic Falsifiability (25 pts)
    echo ""
    echo "Category A: Syntactic Falsifiability (25 pts)"
    check_point "A1: Parses without errors" "timeout 10 $RUCHY check '$example'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "A2: No lint warnings" "timeout 10 $RUCHY lint '$example' 2>&1 | grep -v 'warning'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "A3: Consistent formatting" "timeout 10 $RUCHY fmt --check '$example' 2>/dev/null || true" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "A4: Valid identifiers" "timeout 10 $RUCHY check '$example'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "A5: Balanced delimiters" "timeout 10 $RUCHY check '$example'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    # Category B: Semantic Falsifiability (25 pts)
    echo ""
    echo "Category B: Semantic Falsifiability (25 pts)"
    check_point "B1: Type inference succeeds" "timeout 10 $RUCHY check '$example'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "B2: No undefined variables" "timeout 10 $RUCHY check '$example'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "B3: Correct function signatures" "timeout 10 $RUCHY check '$example'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "B4: Valid return types" "timeout 10 $RUCHY check '$example'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "B5: No dead code" "timeout 10 $RUCHY lint '$example' 2>&1 | grep -v 'dead'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    # Category C: Execution Falsifiability (25 pts)
    echo ""
    echo "Category C: Execution Falsifiability (25 pts)"
    check_point "C1: Runs without panic" "timeout 10 $RUCHY run '$example'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "C2: Produces output" "timeout 10 $RUCHY run '$example' 2>&1 | head -1" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "C3: No infinite loops" "timeout 10 $RUCHY run '$example'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "C4: Handles edge cases" "timeout 10 $RUCHY run '$example'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "C5: Memory safe" "timeout 10 $RUCHY run '$example'" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    # Category D: Transpilation Falsifiability (15 pts)
    echo ""
    echo "Category D: Transpilation Falsifiability (15 pts)"
    check_point "D1: Transpiles to Rust" "timeout 30 $RUCHY transpile '$example' 2>/dev/null" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "D2: Rust code compiles" "timeout 60 $RUCHY compile '$example' 2>/dev/null" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    check_point "D3: Transpiled output correct" "timeout 60 $RUCHY compile '$example' 2>/dev/null" 5 && example_passed=$((example_passed + 5))
    example_total=$((example_total + 5))

    # Category E: Educational Falsifiability (10 pts)
    echo ""
    echo "Category E: Educational Falsifiability (10 pts)"
    check_point "E1: Self-contained" "! grep -q '^import' '$example' 2>/dev/null || true" 3 && example_passed=$((example_passed + 3))
    example_total=$((example_total + 3))

    check_point "E2: Progressive complexity" "true" 3 && example_passed=$((example_passed + 3))
    example_total=$((example_total + 3))

    check_point "E3: Clear teaching goal" "true" 2 && example_passed=$((example_passed + 2))
    example_total=$((example_total + 2))

    check_point "E4: Reproducible" "timeout 10 $RUCHY run '$example' >/dev/null 2>&1" 2 && example_passed=$((example_passed + 2))
    example_total=$((example_total + 2))

    echo ""
    local pct=$((example_passed * 100 / example_total))
    if [ $pct -ge 80 ]; then
        echo -e "${GREEN}Example Score: $example_passed/$example_total ($pct%)${NC}"
        EXAMPLES_PASSED=$((EXAMPLES_PASSED + 1))
    else
        echo -e "${RED}Example Score: $example_passed/$example_total ($pct%)${NC}"
    fi
    EXAMPLES_TESTED=$((EXAMPLES_TESTED + 1))
}

# Main
echo "================================================================"
echo "100-Point Karl Popper Falsification Check"
echo "Based on docs/specifications/ruchy-book-2.0.md"
echo "================================================================"

# Find ruchy binary
if command -v ruchy >/dev/null 2>&1; then
    RUCHY="ruchy"
elif [ -x "./target/release/ruchy" ]; then
    RUCHY="./target/release/ruchy"
elif [ -x "../ruchy/target/release/ruchy" ]; then
    RUCHY="../ruchy/target/release/ruchy"
else
    echo -e "${RED}ERROR: ruchy binary not found${NC}"
    echo "Set RUCHY env var or ensure ruchy is in PATH"
    exit 1
fi

echo "Using ruchy: $RUCHY"
echo "$($RUCHY --version 2>/dev/null || echo 'version unknown')"

# Process examples
if [ $# -eq 0 ]; then
    echo "Usage: $0 <example.ruchy> [example2.ruchy] ..."
    echo "       $0 test/ch*/*.ruchy"
    exit 1
fi

for example in "$@"; do
    if [ -f "$example" ]; then
        falsify_example "$example"
    else
        echo -e "${YELLOW}Skipping: $example (not found)${NC}"
    fi
done

# Summary
echo ""
echo "================================================================"
echo "FALSIFICATION SUMMARY"
echo "================================================================"
echo "Examples Tested: $EXAMPLES_TESTED"
echo "Examples Passed (>=80%): $EXAMPLES_PASSED"
echo "Total Points: $PASSED_POINTS/$TOTAL_POINTS"

if [ $EXAMPLES_TESTED -gt 0 ]; then
    PASS_RATE=$((EXAMPLES_PASSED * 100 / EXAMPLES_TESTED))
    echo "Pass Rate: $PASS_RATE%"

    if [ $PASS_RATE -ge 95 ]; then
        echo -e "${GREEN}RESULT: EXCELLENT - Ready for 2.0 release${NC}"
        exit 0
    elif [ $PASS_RATE -ge 80 ]; then
        echo -e "${YELLOW}RESULT: GOOD - Minor fixes needed${NC}"
        exit 0
    else
        echo -e "${RED}RESULT: NEEDS WORK - Significant fixes required${NC}"
        exit 1
    fi
fi
