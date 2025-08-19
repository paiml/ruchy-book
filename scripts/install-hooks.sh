#!/bin/bash
# Install pre-commit hooks for Ruchy Book project
# This ensures all contributors use the same quality gates

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📚 Installing Ruchy Book pre-commit hooks..."

# Create hooks directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/.git/hooks"

# Create the pre-commit hook
cat > "$PROJECT_ROOT/.git/hooks/pre-commit" << 'EOF'
#!/bin/bash
# Ruchy Book Pre-commit Hook - MANDATORY Quality Gates
# Following Toyota Way: Quality at the source (Jidoka)

set -e

echo "🔒 MANDATORY Book Quality Gates..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any gate fails
FAILED=0

# GATE 1: Check for SATD comments
echo ""
echo "Gate 1: Checking for SATD comments (TODO/FIXME/HACK)..."
if grep -r "TODO\|FIXME\|HACK" src/ 2>/dev/null; then
    echo -e "${RED}❌ BLOCKED: SATD comments found${NC}"
    echo "Fix these issues or file GitHub issues instead"
    FAILED=1
else
    echo -e "${GREEN}✅ No SATD comments${NC}"
fi

# GATE 2: Check for vaporware documentation
echo ""
echo "Gate 2: Checking for vaporware documentation..."
if grep -r "coming soon\|not yet implemented\|will be\|future release" src/ 2>/dev/null; then
    echo -e "${RED}❌ BLOCKED: Vaporware documentation found${NC}"
    echo "Only document features that currently work"
    FAILED=1
else
    echo -e "${GREEN}✅ No vaporware documentation${NC}"
fi

# GATE 3: Check for placeholder content
echo ""
echo "Gate 3: Checking for placeholder content..."
if grep -r "\[placeholder\]\|\[TODO\]\|XXX\|TBD" src/ 2>/dev/null; then
    echo -e "${RED}❌ BLOCKED: Placeholder content found${NC}"
    echo "Complete all content before committing"
    FAILED=1
else
    echo -e "${GREEN}✅ No placeholder content${NC}"
fi

# GATE 4: Test all listings compile (if test framework exists)
echo ""
echo "Gate 4: Testing code listings..."
if [ -f book/Cargo.toml ]; then
    if cargo test --manifest-path book/Cargo.toml 2>/dev/null; then
        echo -e "${GREEN}✅ All listings compile${NC}"
    else
        echo -e "${RED}❌ BLOCKED: Code examples don't compile${NC}"
        FAILED=1
    fi
else
    echo -e "${YELLOW}⚠️  Listing tests skipped (framework not ready)${NC}"
fi

# GATE 5: Strict mode validation (if preprocessor configured)
echo ""
echo "Gate 5: Strict mode validation..."
if [ -f tools/ruchy-preprocessor ] && [ -d src ]; then
    if MDBOOK_PREPROCESSOR__RUCHY__STRICT=true mdbook build >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Examples pass strict validation${NC}"
    else
        echo -e "${RED}❌ BLOCKED: Examples fail strict validation${NC}"
        FAILED=1
    fi
else
    echo -e "${YELLOW}⚠️  Strict validation skipped (preprocessor not ready)${NC}"
fi

# GATE 6: Check for broken links (if linkcheck installed)
echo ""
echo "Gate 6: Checking for broken links..."
if command -v mdbook-linkcheck >/dev/null 2>&1; then
    if mdbook-linkcheck >/dev/null 2>&1; then
        echo -e "${GREEN}✅ No broken links${NC}"
    else
        echo -e "${RED}❌ BLOCKED: Broken links found${NC}"
        FAILED=1
    fi
else
    echo -e "${YELLOW}⚠️  Link checking skipped (mdbook-linkcheck not installed)${NC}"
fi

# GATE 7: Check for debug artifacts
echo ""
echo "Gate 7: Checking for debug artifacts..."
if ls test_* debug_* *.tmp *.bak 2>/dev/null | grep -q .; then
    echo -e "${RED}❌ BLOCKED: Debug artifacts found${NC}"
    echo "Run 'make clean' to remove temporary files"
    FAILED=1
else
    echo -e "${GREEN}✅ No debug artifacts${NC}"
fi

# GATE 8: Verify clean working directory
echo ""
echo "Gate 8: Checking for untracked large files..."
LARGE_FILES=$(find . -type f -size +1M -not -path "./.git/*" -not -path "./target/*" -not -path "./book/*" 2>/dev/null)
if [ -n "$LARGE_FILES" ]; then
    echo -e "${YELLOW}⚠️  Warning: Large files detected:${NC}"
    echo "$LARGE_FILES"
    echo "Consider if these should be committed"
fi

# Final verdict
echo ""
echo "=================================="
if [ $FAILED -eq 1 ]; then
    echo -e "${RED}❌ QUALITY GATES FAILED${NC}"
    echo "Fix the issues above before committing"
    echo "This is mandatory per Toyota Way principles"
    exit 1
else
    echo -e "${GREEN}✅ All quality gates passed${NC}"
    echo "Ready to commit!"
fi
EOF

# Make the hook executable
chmod +x "$PROJECT_ROOT/.git/hooks/pre-commit"

echo "✅ Pre-commit hook installed successfully!"
echo ""
echo "The hook will run automatically before each commit to ensure:"
echo "  • No SATD comments (TODO/FIXME/HACK)"
echo "  • No vaporware documentation"
echo "  • No placeholder content"
echo "  • All code examples compile (when framework ready)"
echo "  • Strict validation passes (when preprocessor ready)"
echo "  • No broken links"
echo "  • No debug artifacts"
echo ""
echo "To bypass the hook in emergency (NOT recommended):"
echo "  git commit --no-verify"
echo ""
echo "To test the hook manually:"
echo "  .git/hooks/pre-commit"