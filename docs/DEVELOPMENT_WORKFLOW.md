# 🚀 Ruchy Book Development Workflow - TDD Edition

**Test-Driven Development workflow for the Ruchy Programming Language Book**

## 🧪 TDD Workflow Overview

```
Write Test → Verify Test → Document Feature → Update Integration → Commit
```

**NEVER document untested features. ALWAYS test first.**

## Quick Start

```bash
# Clone and setup
git clone https://github.com/paiml/ruchy-book.git
cd ruchy-book

# Verify Ruchy version
ruchy --version  # Must be v1.96.0 or later

# Run existing tests
make test        # Should show: 11 passed, 0 failed

# Start development
git checkout -b feature/new-chapter
```

## 📝 Daily TDD Workflow

### Step 1: Write Test First

```bash
# Create test directory for new chapter
mkdir -p tests/ch04-control-flow

# Write test file
cat > tests/ch04-control-flow/test_01_if_statement.ruchy << 'EOF'
fun main() {
    let x = 10;
    if x > 5 {
        println("x is greater than 5");
    }
}
EOF
```

### Step 2: Verify Test Works

```bash
# Test compilation
ruchy compile tests/ch04-control-flow/test_01_if_statement.ruchy

# Run and verify output
./a.out
# Expected: x is greater than 5

# Use Makefile for convenience
make test-file FILE=tests/ch04-control-flow/test_01_if_statement.ruchy
```

### Step 3: Document Only After Test Passes

```bash
# Create documentation ONLY after test works
vim src/ch04-control-flow.md

# Reference the test file in documentation:
# "This example is tested in tests/ch04-control-flow/test_01_if_statement.ruchy"
```

### Step 4: Update Makefile for Chapter Testing

```bash
# Add new test target to Makefile
vim Makefile

# Add:
test-ch04:
    @echo "Testing Chapter 4: Control Flow..."
    @for file in tests/ch04-control-flow/*.ruchy; do ...
```

### Step 5: Update INTEGRATION.md

```bash
# Update single source of truth
vim INTEGRATION.md

# Add test results, update metrics, document progress
```

### Step 6: Validate Everything

```bash
# Run all quality checks
make validate  # Runs lint + test
make test      # All tests must pass
make lint      # No quality violations
```

### Step 7: Commit with Confidence

```bash
# Stage changes
git add tests/ src/ INTEGRATION.md Makefile

# Commit (will run quality gates)
git commit -m "feat: Add if statement support with test

- Created test: tests/ch04-control-flow/test_01_if_statement.ruchy
- Test passes with Ruchy v1.96.0
- Documented in ch04-control-flow.md
- Updated INTEGRATION.md metrics"

# Push to branch
git push origin feature/new-chapter
```

## 🔧 Testing Commands

### Essential Make Commands

```bash
# Test everything
make test              # All tests (currently 11/11)

# Test specific chapters
make test-ch01         # Hello World (3 tests)
make test-ch02         # Variables (4 tests)
make test-ch03         # Functions (4 tests)
make test-foundation   # Chapters 1-3

# Test specific file
make test-file FILE=path/to/test.ruchy

# Quality checks
make lint              # Check for issues
make format            # Check formatting
make validate          # All checks
```

### Manual Testing

```bash
# Compile specific test
ruchy compile tests/ch01-hello-world/test_01_basic.ruchy

# Run compiled output
./a.out

# Test with different flags
ruchy run tests/ch01-hello-world/test_01_basic.ruchy
ruchy check tests/ch01-hello-world/test_01_basic.ruchy
```

## 📊 Quality Gates

### Pre-Commit Checks (Automatic)

The pre-commit hook enforces:
1. ✅ All tests must pass
2. ✅ No SATD comments (TODO/FIXME/HACK)
3. ✅ No vaporware documentation
4. ✅ Function keyword compliance (`fun` not `fn`)
5. ✅ No large files or binaries

### Manual Override (Emergency Only)

```bash
# ONLY use if you know what you're doing
git commit --no-verify -m "message"

# Better: Fix the issues first
make validate
# Then commit normally
```

## 🏗️ Project Structure

```
ruchy-book/
├── tests/                    # Test-first examples
│   ├── ch01-hello-world/    # 3 passing tests
│   ├── ch02-variables/      # 4 passing tests
│   └── ch03-functions/      # 4 passing tests
├── src/                      # Documentation (from tests)
│   ├── ch01-02-hello-world-tdd.md
│   ├── ch02-00-variables-types-tdd.md
│   └── ch03-00-functions-tdd.md
├── INTEGRATION.md           # Single source of truth
├── Makefile                 # Automated testing
└── README.md               # TDD-focused readme
```

## 📈 Sprint Management

### Current Sprint Status
- Sprint 1-3: ✅ Complete (Foundation)
- Sprint 4: 🔄 Starting (Control Flow)
- Sprint 5-12: ⏳ Planned

### Sprint Workflow

```bash
# 1. Start sprint
git checkout -b sprint-4-control-flow

# 2. Write tests for sprint goals
mkdir tests/ch04-control-flow
# Create 5-10 test files

# 3. Verify all tests pass
make test-ch04

# 4. Document from tests
vim src/ch04-control-flow.md

# 5. Update metrics
vim INTEGRATION.md

# 6. Complete sprint
git add -A
git commit -m "feat: Complete Sprint 4 - Control Flow"
git push
```

## 🚫 Common Mistakes to Avoid

### ❌ DON'T Do This:
```bash
# Writing documentation without test
vim src/new-feature.md  # NO! Test first!

# Documenting aspirational features
"This will work in future versions"  # NO!

# Skipping quality gates
git commit --no-verify  # NO! Fix issues!

# Using wrong function keyword
fn main() {  # NO! Use 'fun' for Ruchy
```

### ✅ DO This Instead:
```bash
# Always test first
vim tests/new-feature/test_01.ruchy
make test-file FILE=tests/new-feature/test_01.ruchy
# THEN document

# Document only what works
"This example is tested in tests/..."

# Fix quality issues
make validate
# Then commit

# Use correct keywords
fun main() {  # YES! Ruchy uses 'fun'
```

## 🔄 Continuous Integration

### GitHub Actions (Planned)
```yaml
# .github/workflows/test.yml
name: TDD Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: make test
      - run: make lint
      - run: make validate
```

### Local CI Simulation
```bash
# Before pushing, simulate CI
make clean
make test
make lint
make validate
make build
```

## 📞 Getting Help

### When Tests Fail
1. Check Ruchy version: `ruchy --version` (must be v1.96.0)
2. Verify test isolation: Run test alone
3. Check compilation output: Look for warnings
4. Compare with working tests: See tests/ch01-03/

### Resources
- INTEGRATION.md - Current test status
- QA_CHECKLIST.md - Quality requirements
- README.md - Project overview
- Makefile - See `make help`

## 🎯 Success Metrics

### Per Developer Session
- Tests Written: 2-5 examples
- Pass Rate: 100% required
- Documentation: From tests only
- Quality: All gates green

### Per Sprint
- Tests: 15-20 examples
- Chapters: 1-2 complete
- Coverage: 100% of documented features
- Integration: INTEGRATION.md updated

## 📝 Commit Message Format

```bash
# Feature with test
git commit -m "feat: Add [feature] with [N] tests

- Tests: tests/ch*/test_*.ruchy
- Pass rate: 100% (N/N)
- Ruchy version: v1.96.0
- Documentation: src/ch*.md"

# Fix with test
git commit -m "fix: Correct [issue] in [chapter]

- Updated test: tests/ch*/test_*.ruchy
- Verification: make test-chXX passes
- Documentation updated"

# Refactor (tests unchanged)
git commit -m "refactor: Improve [what]

- Tests still pass: make test
- No functionality change
- Quality improved"
```

---

**Golden Rule**: If it's not tested, it doesn't exist in the documentation.

**Last Updated**: 2025-08-23
**Workflow Version**: 2.0-TDD
**Ruchy Version**: v1.96.0