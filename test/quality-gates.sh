#!/bin/bash
# Quality Gates for Ruchy Book
# Enforces Toyota Way principles: Quality at the source

set -e

echo "🔒 MANDATORY Book Quality Gates..."
echo "=================================="
echo ""

FAILED=0

# Gate 1: No SATD comments
echo -n "Gate 1: Checking for SATD comments (TODO/FIXME/HACK)..."
if grep -r "TODO\|FIXME\|HACK" ../src/ 2>/dev/null | grep -v "Skip:" > /dev/null; then
    echo -e "\n❌ BLOCKED: SATD comments found"
    grep -r "TODO\|FIXME\|HACK" ../src/ | head -5
    FAILED=1
else
    echo " ✅ No SATD comments"
fi

# Gate 2: No vaporware documentation
echo -n "Gate 2: Checking for vaporware documentation..."
if grep -r "coming soon\|will be available\|not yet implemented" ../src/ 2>/dev/null | grep -v "planned but" > /dev/null; then
    echo -e "\n❌ BLOCKED: Vaporware documentation found"
    grep -r "coming soon\|will be available\|not yet implemented" ../src/ | head -5
    echo "Only document features that currently work"
    FAILED=1
else
    echo " ✅ No vaporware documentation"
fi

# Gate 3: No placeholder content
echo -n "Gate 3: Checking for placeholder content..."
if grep -r "TBD\|placeholder\|Lorem ipsum" ../src/ 2>/dev/null > /dev/null; then
    echo -e "\n❌ BLOCKED: Placeholder content found"
    grep -r "TBD\|placeholder\|Lorem ipsum" ../src/ | head -5
    FAILED=1
else
    echo " ✅ No placeholder content"
fi

# Gate 4: Book builds successfully
echo -n "Gate 4: Testing book build..."
if cd .. && mdbook build > /dev/null 2>&1; then
    echo " ✅ Book builds successfully"
else
    echo " ❌ Book build failed"
    FAILED=1
fi

# Gate 5: No broken internal links
echo -n "Gate 5: Checking for broken internal links..."
BROKEN_LINKS=0
for file in ../book/*.html; do
    if [ -f "$file" ]; then
        grep -o 'href="[^"]*"' "$file" 2>/dev/null | grep -v "http" | grep -v "#" | while read -r link; do
            link_file=$(echo $link | sed 's/href="//;s/"//')
            if [[ ! -f "../book/$link_file" && ! -z "$link_file" && "$link_file" != *"favicon"* ]]; then
                BROKEN_LINKS=$((BROKEN_LINKS + 1))
            fi
        done
    fi
done
if [ $BROKEN_LINKS -gt 0 ]; then
    echo " ❌ Found $BROKEN_LINKS broken links"
    FAILED=1
else
    echo " ✅ No broken links"
fi

# Gate 6: Examples directory exists
echo -n "Gate 6: Checking code examples structure..."
if [ -d "examples" ]; then
    echo " ✅ Examples directory exists"
else
    mkdir -p examples
    echo " ⚠️ Created missing examples directory"
fi

# Gate 7: No debug artifacts
echo -n "Gate 7: Checking for debug artifacts..."
# Check for debug prints but exclude examples that are demonstrating debug macros
if grep -r "println!(\"DEBUG\|eprintln!(\"DEBUG" ../src/ 2>/dev/null | grep -v "// Prints:" > /dev/null; then
    echo " ❌ Debug artifacts found"
    grep -r "println!(\"DEBUG\|eprintln!(\"DEBUG" ../src/ | grep -v "// Prints:" | head -3
    FAILED=1
else
    echo " ✅ No debug artifacts"
fi

# Gate 8: Consistent Ruchy syntax
echo -n "Gate 8: Checking Ruchy syntax consistency..."
# Check for mixing 'fn' and 'fun'
FN_COUNT=$(grep -r "^fn " ../src/*.md 2>/dev/null | wc -l || echo 0)
FUN_COUNT=$(grep -r "^fun " ../src/*.md 2>/dev/null | wc -l || echo 0)
if [ $FN_COUNT -gt 0 ] && [ $FUN_COUNT -gt 0 ]; then
    echo " ⚠️ Mixed use of 'fn' and 'fun' keywords"
    echo "   Found $FN_COUNT uses of 'fn' and $FUN_COUNT uses of 'fun'"
    echo "   Consider standardizing on 'fun' for Ruchy"
else
    echo " ✅ Consistent function syntax"
fi

echo ""
echo "=================================="

if [ $FAILED -eq 0 ]; then
    echo "✅ All quality gates passed"
    echo "Ready to proceed!"
    exit 0
else
    echo "❌ QUALITY GATES FAILED"
    echo "Fix the issues above before proceeding"
    echo "This is mandatory per Toyota Way principles"
    exit 1
fi