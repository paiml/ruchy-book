# 🚀 Ruchy Book Development Workflow

**Professional development process using Ruchy v0.10.0 tooling and GitHub automation**

## Quick Start

```bash
# Clone and setup
git clone https://github.com/paiml/ruchy-book.git
cd ruchy-book

# Install dependencies
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh  # Rust
curl -fsSL https://deno.land/install.sh | sh                     # Deno

# Install Ruchy
git clone https://github.com/paiml/ruchy.git /tmp/ruchy
cd /tmp/ruchy
cargo install --path . --force
cd ../ruchy-book

# Test installation
ruchy --version        # Should show v0.10.0
deno --version         # Should show v1.x
```

## Daily Development Workflow

### 1. Content Development

```bash
# Start development session
git checkout -b feature/improve-chapter-5

# Edit content (example: improving ch05-00-data-processing.md)
# ... make your changes ...

# Quick validation
ruchy check test/extracted-examples/ch05*.ruchy
ruchy fmt test/extracted-examples/ch05*.ruchy
```

### 2. Testing Changes

```bash
# Test specific chapter examples
deno run --allow-read --allow-write --allow-run scripts/extract-examples.ts

# Test one-liners (critical - must not break)
deno task test-oneliners

# Generate updated reports
deno task generate-report

# Check overall status
cat reports/status-report.md
```

### 3. Quality Assurance

```bash
# Lint all extracted examples
find test/extracted-examples -name "*.ruchy" | head -20 | while read file; do
    echo "Checking $file..."
    ruchy lint --format json "$file" || echo "Issues found in $file"
done

# Format check
ruchy fmt --check test/extracted-examples/

# Validate documentation links
deno task lint-markdown
```

### 4. Commit and Push

```bash
# Add changes
git add src/ reports/ test/extracted-examples/

# Commit with descriptive message
git commit -m "improve: ch05 data processing examples - fix 3 broken examples

- Update array syntax in examples 1, 4, 6
- Add proper error handling patterns  
- Test all examples with ruchy v0.10.0
- Success rate: 30% -> 60% (3/10 -> 6/10)"

# Push and create PR
git push origin feature/improve-chapter-5
gh pr create --title "Improve Chapter 5: Data Processing" --body "Fixes broken examples and improves success rate"
```

## GitHub Workflows Integration

### Automated Quality Checks

Every PR triggers:

1. **Code Quality** (`.github/workflows/ruchy-quality.yml`)
   - Format checking with `ruchy fmt --check`
   - Linting with `ruchy lint --format json`
   - Syntax validation with `ruchy check`

2. **Example Testing** (`.github/workflows/test-book-examples.yml`)
   - One-liner compatibility tests (must be 100%)
   - Full book example testing (274 examples)
   - Regression detection (fails if success rate drops >5%)

3. **Report Generation** (`.github/workflows/deploy-reports.yml`)
   - Updates live dashboard at GitHub Pages
   - Creates API endpoints for external access
   - Generates milestone releases for major improvements

### Workflow Outputs

Each workflow provides:
- **Artifacts**: Download test results, lint reports, coverage data
- **PR Comments**: Automated status updates with metrics
- **Badge Updates**: Real-time compatibility status
- **Pages Deployment**: Live dashboard at `https://paiml.github.io/ruchy-book/`

## Project Structure

```
ruchy-book/
├── .github/workflows/           # CI/CD automation
│   ├── ruchy-quality.yml       # Code quality checks
│   ├── test-book-examples.yml  # Example testing
│   └── deploy-reports.yml      # Report deployment
├── src/                        # Book content (markdown)
│   ├── SUMMARY.md              # Book structure
│   ├── ch01-01-installation.md # Fixed installation guide
│   ├── ch20-00-tooling.md      # NEW: Developer tooling
│   └── ...
├── scripts/                    # Deno TypeScript automation
│   ├── extract-examples.ts     # Extract and test examples
│   ├── test-oneliners.ts       # One-liner testing
│   ├── generate-status-report.ts # Report generation
│   └── lint-markdown.ts        # Markdown validation
├── test/extracted-examples/     # Auto-generated test results
│   ├── oneliners.json          # One-liner test results
│   ├── summary.json            # Overall compatibility
│   ├── passing.log             # Working examples
│   └── failing.log             # Broken examples
├── reports/                    # Generated status reports
│   ├── status-report.md        # Human-readable status
│   ├── status-report.json      # Machine-readable data
│   └── status-dashboard.html   # Interactive dashboard
└── docs/                       # Development documentation
    ├── REFACTORING_ROADMAP.md  # Chapter-by-chapter plan
    └── DEVELOPMENT_WORKFLOW.md # This file
```

## Available Commands

### Deno Tasks (from deno.json)

```bash
deno task extract-examples      # Test all 274 book examples
deno task test-oneliners       # Test 20 critical one-liners  
deno task generate-report      # Create status reports/dashboard
deno task update-status        # Update compatibility tracking
deno task lint-markdown        # Validate markdown quality
```

### Ruchy Tools

```bash
ruchy check <file>             # Fast syntax validation
ruchy lint <file>              # Code quality analysis
ruchy fmt <file>               # Auto-format code
ruchy test <file>              # Run tests with coverage
ruchy run <file>               # Execute program
ruchy repl                     # Interactive development
ruchy doc <file>               # Generate documentation
ruchy bench <file>             # Performance benchmarking
```

## Development Standards

### Code Quality Gates

All changes must pass:
- ✅ **Formatting**: `ruchy fmt --check` passes
- ✅ **Linting**: No errors from `ruchy lint --deny-warnings`  
- ✅ **Syntax**: All examples compile with `ruchy check`
- ✅ **One-liners**: 100% success rate maintained (20/20)
- ✅ **Regression**: Overall success rate doesn't drop >5%

### Content Standards

- **Every example MUST compile** on first attempt with Ruchy v0.10.0
- Include expected output for interactive examples
- Add tool usage examples where relevant (lint, fmt, test)
- Reference common error patterns and solutions
- Link to live GitHub Actions workflows

### Documentation Standards  

- Use professional, concise language
- Include practical examples over theory
- Show real-world development workflows
- Reference current v0.10.0 features only
- No "coming soon" or placeholder content

## Chapter Review Process

### For High-Priority Chapters (>80% compatibility)

1. **Quick Review**: Check examples still work
2. **Tool Integration**: Add ruchy lint/fmt/test examples  
3. **Polish**: Improve explanations, add troubleshooting
4. **Verify**: Run full test suite

### For Medium-Priority Chapters (30-80% compatibility)

1. **Deep Review**: Fix broken examples one-by-one
2. **Update Syntax**: Ensure v0.10.0 compatibility
3. **Tool Integration**: Extensive tooling examples
4. **Test**: Verify all examples work
5. **Document**: Add error patterns and solutions

### For Low-Priority Chapters (0-30% compatibility)

1. **Complete Rewrite**: Start fresh with v0.10.0
2. **Focus on Core**: Essential features only
3. **Test Everything**: Every example must work
4. **Professional**: Use modern development practices
5. **Tooling**: Extensive use of ruchy lint/fmt/test

## Troubleshooting

### Common Issues

**"ruchy: command not found"**
```bash
# Ensure cargo bin in PATH
export PATH="$HOME/.cargo/bin:$PATH"
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
```

**Examples failing unexpectedly**
```bash
# Check Ruchy version
ruchy --version  # Should be v0.10.0

# Test basic functionality
echo '2 + 2' | ruchy repl  # Should output 4
ruchy -e '3 * 14'          # Should output 42
```

**CI/CD failures**
```bash
# Run locally what CI runs
deno task test-oneliners                    # Must pass
deno run --allow-read --allow-write --allow-run scripts/extract-examples.ts
ruchy fmt --check test/extracted-examples/
ruchy lint test/extracted-examples/
```

### Performance Optimization

**Speed up example testing**
```bash
# Test specific chapters only
find test/extracted-examples -name "ch05*.ruchy" | head -10 | while read file; do
    ruchy check "$file"
done

# Parallel linting
find test/extracted-examples -name "*.ruchy" | xargs -P4 -I{} ruchy lint --format json {} > /dev/null
```

## Monitoring & Metrics

### Live Dashboard
- **URL**: https://paiml.github.io/ruchy-book/
- **Updates**: Every push to main + daily at 8 AM UTC
- **APIs**: 
  - `/api/status.json` - Overall compatibility
  - `/api/oneliners.json` - One-liner results

### Key Metrics to Track
- **Overall Success Rate**: Currently 41% (target: 80%)
- **One-liner Success**: Currently 100% (maintain 100%)
- **Chapter Progress**: Track improvements per chapter
- **Tool Coverage**: Examples using new v0.10.0 tools

### Success Milestones
- 🎯 **50% Compatibility**: Good progress, most basics work
- 🏆 **75% Compatibility**: Excellent, professional quality
- 🚀 **90% Compatibility**: World-class documentation

---

**Ready to contribute?** Follow this workflow and you'll be making professional-quality improvements to the Ruchy book with full automation support!