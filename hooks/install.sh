#!/bin/bash
# Install Ruchy Book Pre-Commit Hooks
# Run this script to set up quality gates

set -e

echo "🔧 Installing Ruchy Book Pre-Commit Hooks"
echo "=========================================="
echo ""

# Check if in git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not in a git repository"
    echo "   Run this script from the ruchy-book root directory"
    exit 1
fi

# Make hook executable
chmod +x hooks/pre-commit

# Install hook
cp hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

echo "✅ Pre-commit hook installed successfully!"
echo ""
echo "📋 Quality Gates Enforced:"
echo "   1. Verify 18-tool testing infrastructure"
echo "   2. Verify ruchy installation"
echo "   3. Extract and test all book examples"
echo "   4. Verify minimum 90% pass rate"
echo "   5. Check for vaporware documentation"
echo "   6. Verify function keyword usage (fun vs fn)"
echo "   7. TICKET-018 18-tool testing (info only, not blocking yet)"
echo ""
echo "🎯 Next Steps:"
echo "   - Make changes to book examples"
echo "   - git add your changes"
echo "   - git commit (hooks will run automatically)"
echo ""
echo "💡 Tip: To bypass hooks (emergency only):"
echo "   git commit --no-verify"
echo ""
echo "✅ Installation complete!"
