# CLAUDE.md - Ruchy Book Implementation Protocol

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Prime Directive

**Generate correct documentation where every example compiles on first attempt. Quality is built-in, not bolted-on.**

## Core Principles (Toyota Way)

- **Kaizen (改善)**: Continuous incremental improvement - one chapter at a time
- **Genchi Genbutsu (現地現物)**: Go and see - test every example in real REPL before documenting
- **Jidoka (自働化)**: Quality at the source - automated validation prevents broken examples

## MANDATORY Development Approach (BLOCKING - Not Optional)

### A. Test-Driven Documentation (TDD)
- **ALL work must be TDD**: Every example written test-first, then documentation
- **NO exceptions**: Documentation follows working code, never precedes it
- **Immediate feedback**: Tests run continuously during development

### B. Professional Quality Gates with PMAT
- **ALL work must pass PMAT TDG**: Use `pmat analyze` for quality verification
- **Quality score requirement**: Minimum A+ grade on all code examples
- **BLOCKING gate**: No commits allowed without PMAT approval

### C. 100% Coverage Approach Only
- **Complete coverage mandatory**: Every code path tested and documented  
- **Use ruchy coverage tool**: `ruchy coverage [file]` validates 100% coverage
- **No partial examples**: All examples must be complete, working programs

### D. Ruchy Tooling Integration (MANDATORY)
- **Use ALL ruchy tools**: check, lint, test, coverage, fmt, score, provability
- **Tool-driven workflow**: Let tools guide development and validation
- **Quality verification**: `make dogfood-full` must pass before any commit

### E. Roadmap-Driven Development with Tickets
- **Work via tickets only**: All work assigned from roadmap tickets
- **Roadmap updates mandatory**: Update roadmap after each ticket completion  
- **Progress tracking**: Link all changes to specific roadmap tickets
- **No ad-hoc work**: Every change traces back to planned roadmap item

## MANDATORY Quality Gates (BLOCKING - Not Advisory)

### Pre-Commit Hooks (MANDATORY) - Enhanced with Dogfooding
```bash
#!/bin/bash
# .git/hooks/pre-commit - BLOCKS commits that violate quality
set -e

echo "🔒 MANDATORY Book Quality Gates..."

# GATE 1: All listings must compile
cargo test --manifest-path book/Cargo.toml || {
    echo "❌ BLOCKED: Code examples don't compile"
    exit 1
}

# GATE 2: MANDATORY Dogfooding Quality Gates
echo "🐕 Running MANDATORY dogfooding quality gates..."
make dogfood-check >/dev/null || {
    echo "❌ BLOCKED: Syntax validation failed"
    exit 1
}

make dogfood-lint >/dev/null || {
    echo "❌ BLOCKED: Style analysis failed" 
    exit 1
}

make dogfood-score | grep -q "A+" || {
    echo "❌ BLOCKED: Quality score below A+ grade"
    exit 1
}

# GATE 3: Strict mode validation
MDBOOK_PREPROCESSOR__RUCHY__STRICT=true mdbook build || {
    echo "❌ BLOCKED: Examples fail strict validation"
    exit 1
}

# GATE 4: Zero broken links
mdbook-linkcheck || {
    echo "❌ BLOCKED: Broken links found"
    exit 1
}

# GATE 5: No vaporware documentation
! grep -r "coming soon\|not yet implemented\|TODO" src/ || {
    echo "❌ BLOCKED: Vaporware documentation found"
    exit 1
}

echo "✅ All quality gates passed (including dogfooding)"
```

## Absolute Rules

1. **NEVER Document Unimplemented Features**: Zero tolerance for vaporware. If it doesn't compile in current `ruchy`, it doesn't go in the book.

2. **ALWAYS Test in REPL First**: Before documenting ANY code example:
   ```bash
   echo 'your_code_here' | ruchy repl
   # MUST see expected output before documenting
   ```

2b. **MANDATORY Dogfooding**: Every mini-sprint MUST include comprehensive dogfooding:
   ```bash
   # MANDATORY before any commit
   make dogfood-quick
   
   # MANDATORY at sprint completion  
   make dogfood-full
   
   # MANDATORY: All quality gates must pass
   make dogfood-check && make dogfood-lint && make dogfood-score | grep -q "A+"
   ```

2a. **ALWAYS Check Ruchy Compiler Status**: Before working on book content, verify the compiler state:
   ```bash
   # Check if ruchy compiler is available in parent directory
   ls -la ../ruchy/target/release/ruchy 2>/dev/null || echo "No local ruchy build"
   
   # Check current ruchy version being used
   ruchy --version
   
   # If local build exists, compare versions
   if [ -f ../ruchy/target/release/ruchy ]; then
       echo "Local build: $(../ruchy/target/release/ruchy --version)"
       echo "System ruchy: $(ruchy --version)"
   fi
   
   # Check compiler development status
   cd ../ruchy 2>/dev/null && git log --oneline -5 && cd - || echo "No ../ruchy directory"
   ```

3. **NEVER Leave SATD Comments**: No TODO, FIXME, HACK comments. File GitHub issues instead.

4. **ALWAYS Use Exact Version Pinning**: 
   ```toml
   ruchy = "=0.3.0"  # EXACT version, no ranges
   ```

5. **NEVER Skip Testing**: Every listing MUST have a test that verifies compilation and output.

6. **Zero Cruft Tolerance**: No temporary files, no debug artifacts. Clean workspace always.

7. **ALWAYS Use 'fun' for Ruchy Functions**: Use `fun` keyword for all Ruchy function definitions. Only use `fn` in Rust code examples:
   ```ruchy
   // ✅ Correct - Ruchy functions use 'fun'
   fun calculate(x, y) {
       x + y
   }
   ```
   ```rust  
   // ✅ Correct - Rust examples use 'fn'
   fn main() {
       println!("Hello, World!");
   }
   ```

## Repository Structure

```
ruchy-book/
├── .github/
│   ├── workflows/
│   │   ├── test.yml         # Test all examples
│   │   ├── deploy.yml       # Deploy to book.ruchy.org
│   │   └── sync.yml         # Sync with ruchy releases
│   └── CODEOWNERS
├── book.toml                # mdBook configuration
├── src/                     # Book content (markdown)
│   ├── SUMMARY.md
│   └── ch*.md
├── listings/                # Testable code examples
│   └── ch*/listing-*/
│       ├── src/main.ruchy
│       ├── Cargo.toml
│       └── output.txt
├── tests/                   # Integration tests
└── tools/                   # Build tools
    ├── ruchy-preprocessor/  # Custom validation
    └── update_version.sh    # Version sync script
```

## Development Commands

### Essential Commands
```bash
# Build and validate book
make build           # mdbook build with validation
make serve          # Local preview with auto-reload
make test           # Test all listings compile

# Quality gates
make lint           # Check for vaporware/SATD
make validate       # Run ALL quality checks
make clean          # Remove all build artifacts

# Version management
make sync-version   # Update to latest ruchy version
make verify-version # Check version consistency
```

### The Kaizen Loop for Documentation

#### Step 1: Identify Gap (Genchi Genbutsu)
```bash
# Find undocumented features
diff <(ruchy --help) <(grep -h "##" src/ch*.md)

# Find failing examples
cargo test --manifest-path book/Cargo.toml 2>&1 | grep FAILED
```

#### Step 2: Validate Before Documenting
```bash
# Test the example works
echo 'example_code' | ruchy repl

# Create listing with test
mkdir -p listings/ch03/listing-03-01/src
echo 'example_code' > listings/ch03/listing-03-01/src/main.ruchy
echo 'expected_output' > listings/ch03/listing-03-01/output.txt

# Verify it passes
cargo test --manifest-path book/Cargo.toml
```

#### Step 3: Document with Validation
```markdown
<!-- In chapter file -->
```ruchy
// This will be validated by preprocessor
fn main() {
    println("Hello, Ruchy!")
}
```

<details>
<summary>Generated Rust (click to expand)</summary>

```rust
// Show actual transpiled code
fn main() {
    println!("Hello, Ruchy!");
}
```
</details>
```

## Architecture & Progressive Disclosure

### Level 0: Immediate (Chapters 1-3)
- **Goal**: Write useful scripts in 2 hours
- **Topics**: Hello world, variables, functions, control flow
- **Max Pages**: 60
- **Validation**: Every example runs in REPL

### Level 1: Productive (Chapters 4-7)
- **Goal**: Real-world programs in 1 week
- **Topics**: Ownership (simplified), collections, errors, modules
- **Max Pages**: 100
- **Validation**: Build complete programs

### Level 2: Systems (Chapters 8-12)
- **Goal**: Performance code in 1 month
- **Topics**: Rust interop, async, dataframes, actors
- **Max Pages**: 150
- **Validation**: Benchmarks included

### Level 3: Advanced (Chapters 13+)
- **Goal**: Language mastery in 3 months
- **Topics**: Macros, unsafe, refinement types, MCP
- **Max Pages**: 200
- **Validation**: Integration tests

## Chapter Template (MANDATORY Structure)

```markdown
# Chapter N: Title

## The Problem
[1-2 paragraphs: Why does this matter?]

## Quick Example
```ruchy
// Simplest possible WORKING example
// MUST compile with current ruchy version
```

## Core Concepts
[Theory and mental model, 2-3 pages max]

## Practical Usage
```ruchy
// Real-world example showing the feature
// Include performance characteristics if relevant
```

## Common Pitfalls
[What mistakes do people make?]

## Transpilation Insight
<details>
<summary>Generated Rust (click to expand)</summary>
```rust
// Show the ACTUAL generated Rust code
```
</details>

## Exercises
[2-3 exercises with solutions in appendix]

## Summary
- Key takeaway 1
- Key takeaway 2
- Key takeaway 3
```

## Testing Infrastructure

### Listing Validation
```rust
// tests/integration.rs
#[test]
fn test_all_listings() {
    for listing in find_listings() {
        // MUST compile without errors
        let result = compile(&source, Config::default());
        assert!(result.is_ok(), "Failed: {}", path);
        
        // MUST produce expected output
        if output_path.exists() {
            assert_eq!(actual.trim(), expected.trim());
        }
    }
}
```

### Version Synchronization
```yaml
# .github/workflows/sync.yml
- name: Check latest ruchy version
- name: Update if needed
- name: Test with new version
- name: Create PR if all tests pass
```

## Success Metrics

### Quality Metrics (MANDATORY)
- **Example Compilation Rate**: 100% (BLOCKING)
- **Link Validity**: 100% (BLOCKING)
- **CI Green Rate**: 100% (BLOCKING)
- **Zero Vaporware**: 0 "coming soon" references

### Adoption Metrics
- **Time to Hello World**: <5 minutes
- **Chapter 1-3 Completion**: >80%
- **Issue Resolution**: <48 hours

### Maintenance Metrics
- **Version Sync Lag**: <24 hours
- **PR Merge Time**: <4 hours
- **Test Execution**: <2 minutes

## Non-Goals (What NOT to Document)

- **Theoretical features**: Only what ships
- **Alternative syntaxes**: One way to do things
- **Implementation details**: Usage, not internals
- **Opinion pieces**: Technical facts only
- **Versioned docs**: Always track latest stable

## Sprint Hygiene Protocol

### Pre-Sprint Cleanup
```bash
# Remove all temporary files
rm -f test_* debug_* *.tmp
find . -name "*.bak" -delete

# Clean build artifacts
rm -rf book/
cargo clean

# Verify clean state
git status --ignored
```

### **MANDATORY Mini-Sprint Dogfooding** (Toyota Way)
**EVERY sprint must include comprehensive dogfooding - no exceptions.**

```bash
# 1. MANDATORY: Run complete dogfooding suite
make dogfood-full

# 2. MANDATORY: Analyze and document any regressions
# If any tool shows degraded performance, file issues immediately

# 3. MANDATORY: Update INTEGRATION.md with dogfooding results
echo "## Dogfooding Results ($(date))" >> INTEGRATION.md
echo "- ruchy check: $(make dogfood-check 2>&1 | grep Summary)" >> INTEGRATION.md  
echo "- ruchy lint: $(make dogfood-lint 2>&1 | grep Summary)" >> INTEGRATION.md
echo "- ruchy fmt: $(make dogfood-fmt 2>&1 | grep Summary)" >> INTEGRATION.md

# 4. MANDATORY: Quick dogfood before any major changes
make dogfood-quick
```

### Post-Sprint Checklist (Enhanced with Dogfooding)
```bash
# Update tracking
git add docs/

# MANDATORY: Final dogfooding verification
make dogfood-quality

# Verify no cruft
find . -type f -size +100M

# MANDATORY: Commit dogfooding results if changed
git add INTEGRATION.md
git commit -m "chore: Update dogfooding results for sprint"

# Push with clean history  
git push origin main
```

### **Dogfooding Quality Gates** (BLOCKING)
These gates must pass before any sprint completion:

```bash
# GATE 1: Syntax validation must be 100%
make dogfood-check || exit 1

# GATE 2: Style analysis must be 100% 
make dogfood-lint || exit 1

# GATE 3: Quality scores must maintain A+ grade
make dogfood-score | grep -q "A+" || exit 1

# GATE 4: Performance analysis must show O(1) or better
make dogfood-runtime | grep -q "O(1)" || exit 1

# GATE 5: Provability must be >90%
make dogfood-provability | grep -q "100.0" || exit 1
```

## The Make Commands Contract

All commands are now implemented in the comprehensive Makefile. Key commands:

### Heavy Dogfooding (Toyota Way - Use Every Tool)
```makefile
# Comprehensive dogfooding - use ALL ruchy tools against our codebase
make dogfood-full      # COMPLETE suite - all 15 tools
make dogfood-quick     # Essential tools only (check, lint, fmt, score) 
make dogfood-quality   # Quality-focused (check, lint, provability, score, quality-gate)
make dogfood-performance # Performance-focused (runtime, optimize, bench)

# Individual tool dogfooding
make dogfood-check         # Syntax validation on all .ruchy files
make dogfood-test          # Enhanced testing with coverage 
make dogfood-fmt           # Format validation (expect failures - needs work)
make dogfood-lint          # Style analysis (currently 100% pass rate)
make dogfood-provability   # Formal verification analysis
make dogfood-runtime       # Performance and BigO analysis
make dogfood-score         # Quality scoring (A+ grades achieved)
make dogfood-quality-gate  # Quality gate enforcement
make dogfood-optimize      # Hardware-aware optimization
make dogfood-prove         # Interactive theorem prover
make dogfood-doc           # Documentation generation
make dogfood-bench         # Performance benchmarking
make dogfood-ast           # AST analysis and visualization
make dogfood-coverage      # Coverage reporting with ruchy-coverage
make dogfood-mcp           # MCP server quality analysis
```

### Standard Development Commands  
```makefile
all: validate build
build: mdbook build
serve: mdbook serve --open
test: # Test all TDD examples
validate: lint test  # Run ALL quality checks
lint: # Check for SATD, vaporware, function keywords
clean: # Remove all build artifacts
sync-version: # AUTOMATED: Update to latest ruchy version
pre-commit: validate # Run pre-commit quality gates
```

### Quality Gate Results (Current v1.9.8)
- **ruchy check**: ✅ 38/38 files pass syntax validation
- **ruchy lint**: ✅ 38/38 files pass style analysis  
- **ruchy fmt**: ❌ 0/38 files pass formatting (consistent with professional tooling results)
- **ruchy score**: ✅ A+ quality scores (1.000/1.000)
- **ruchy provability**: ✅ 100% provability score on simple functions
- **ruchy runtime**: ✅ O(1) complexity, 100% optimization score

## Bug Reporting Protocol

When encountering issues with the Ruchy compiler/runtime:

1. **File bugs locally first**: Create detailed reports in `docs/bugs/ruchy-runtime-bugs.md`
2. **Include reproducibility**: Every bug must have exact steps to reproduce
3. **Document workarounds**: If found, include them to unblock progress
4. **Track impact**: Describe how the bug affects book testing and documentation
5. **Version specificity**: Always include `ruchy --version` and platform details

### Bug Report Template
```markdown
## Bug #XXX: [Title]

**Filed**: [Date]
**Ruchy Version**: v[X.Y.Z]
**Platform**: [OS and architecture]
**Severity**: Critical/High/Medium/Low
**Status**: Open/Fixed/Workaround

### Description
[Clear description of the issue]

### Reproduction Steps
[Exact commands to reproduce]

### Expected vs Actual
[What should happen vs what does happen]

### Impact
[How this affects book testing]

### Workaround
[If any]
```

## Testing Commands

When testing examples, always run comprehensive test suites:

```bash
# Test all 381 book examples
deno task extract-examples

# Test 20 one-liner examples  
deno task test-oneliners

# Test Ruchy binary tooling integration (NEW)
deno task test-tooling

# Update documentation status
deno task update-status

# Generate status reports
deno task generate-report

# Validate documentation quality
deno task lint-markdown
```

## POST-QUALIFICATION PROTOCOL (MANDATORY)

**CRITICAL**: After every Ruchy version qualification, ALWAYS execute this protocol:

### Step 1: Run Complete Test Suite
```bash
# Run all tests and generate reports
make sync-version
deno task extract-examples
deno task test-oneliners
deno task generate-report
```

### Step 2: Update Single Source of Truth
```bash
# Update INTEGRATION.md with qualification results
# This is the ONLY status report that matters
```

### Step 3: Commit and Push Results (MANDATORY)
```bash
# Stage qualification results
git add INTEGRATION.md test/extracted-examples/ reports/

# Commit with descriptive message including:
# - Ruchy version tested
# - Pass/fail rates
# - Key findings
# - Test counts
git commit -m "feat: Complete vX.Y.Z qualification with comprehensive testing

- Tested N examples across M chapters against Ruchy vX.Y.Z
- Results: X working (Y%), Z failing (W%)
- Key findings: [brief summary]
- Updated INTEGRATION.md as single source of truth

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# ALWAYS push to GitHub after qualification
git push origin main
```

### Step 4: Verification
```bash
# Verify commit was successful
git log --oneline -1

# Verify GitHub sync
git status
```

**WHY THIS IS MANDATORY:**
- **Traceability**: Every version qualification must be recorded
- **Collaboration**: Team needs to see qualification results
- **History**: Track progress/regression across versions
- **Automation**: Enables automated tracking and reporting
- **Accountability**: Clear audit trail of what was tested when

**NO EXCEPTIONS**: This protocol runs after EVERY version qualification, whether pass rates improve or decline. The goal is complete transparency and historical tracking.

## POST-COMPLETION PROTOCOL (MANDATORY)

**CRITICAL**: After ALL work completion, ALWAYS execute this protocol:

### Step 1: Zero Defects Verification
```bash
# MANDATORY: No failing tests allowed
deno task extract-examples
deno task test-oneliners  
# All tests MUST pass - no exceptions

# MANDATORY: All ruchy tooling passes
make dogfood-full
# All tools MUST show A+ grades

# MANDATORY: Full coverage achieved
ruchy coverage **/*.ruchy
# MUST show 100% coverage on all examples

# MANDATORY: PMAT quality gates pass
pmat analyze **/*.ruchy | grep -q "A+"
# MUST achieve A+ quality grade
```

### Step 2: Roadmap and Documentation Updates  
```bash
# Update roadmap status
echo "## Work Completed: [Date]" >> docs/ROADMAP.md
echo "- Fixed X syntax issues across Y chapters" >> docs/ROADMAP.md
echo "- Achieved 100% test pass rate" >> docs/ROADMAP.md
echo "- All quality gates passing" >> docs/ROADMAP.md

# Update INTEGRATION.md with final results
make generate-reports
git add INTEGRATION.md
```

### Step 3: Commit and Push Changes (MANDATORY)
```bash
# Stage all changes
git add -A

# MANDATORY: Comprehensive commit message with metrics
git commit -m "feat: Fix syntax issues - achieve 100% pass rate

- Fixed N REPL examples in chapter 23 
- Fixed M incomplete code examples
- Fixed P placeholder syntax examples
- Fixed Q unit type display issues
- Test results: X/X passing (100%)
- Quality: A+ grade achieved
- Coverage: 100% achieved
- All ruchy tools passing

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# MANDATORY: Push to ensure work is preserved
git push origin main
```

**WHY THIS IS MANDATORY:**
- **Zero tolerance for defects**: No work is complete with failing tests
- **Quality accountability**: Every change must meet professional standards  
- **Progress tracking**: All improvements must be documented and pushed
- **Collaboration**: Team needs visibility into what was accomplished
- **Audit trail**: Complete history of what was tested and verified

## TDD-DRIVEN BOOK TRANSFORMATION (MANDATORY - TOP PRIORITY)

### 🚨 CRITICAL PIVOT: Test-Driven Documentation + Heavy Dogfooding

**Every change must be validated with comprehensive dogfooding of ALL ruchy tools. We are implementing Test-Driven Documentation (TDD) + Heavy Dogfooding as mandatory practices.**

### SINGLE SOURCE OF TRUTH: INTEGRATION.md

**ONE and ONLY ONE status report going forward:**
- **File**: `/home/noah/src/ruchy-book/INTEGRATION.md`
- **Location**: Root of repository  
- **Content**: Time-stamped, version-stamped test/lint/coverage/provability report
- **Update**: Automatically generated from actual test runs
- **Evidence**: Tests themselves are the proof of what works

**NO OTHER STATUS REPORTS ALLOWED**. Delete all legacy reports. INTEGRATION.md is the single source of truth.

### Quality Tools Integration (MANDATORY)
```bash
# Every example MUST pass ALL quality gates:
ruchy test [file]           # Basic correctness
ruchy lint --strict [file]  # Code quality
ruchy coverage [file]       # Test coverage
ruchy prove [file]          # Formal verification (where applicable)
pmat analyze [file]         # Quality metrics

# Results → INTEGRATION.md (automated)
```

### INTEGRATION.md Format Specification
```markdown
# Ruchy Book Integration Report

**Generated**: [ISO-8601 timestamp]
**Ruchy Version**: [exact version]
**Book Commit**: [git hash]

## Executive Summary
- Total Examples: X
- Passing: Y (Z%)
- Test Coverage: A%
- Lint Grade: B
- Provability: C% formally verified

## Test Results
[Detailed test output from ruchy test]

## Lint Analysis  
[Output from ruchy lint --strict]

## Coverage Report
[Output from ruchy coverage]

## Formal Verification
[Output from ruchy prove where applicable]

## Quality Metrics
[Output from pmat analyze]

## Version-Specific Notes
[What works, what doesn't, known issues]
```

### TDD Book Roadmap - IMMEDIATE PRIORITIES

**Sprint 0: Testing Infrastructure Fix (CRITICAL - NOW)**
- [ ] **TEST-001** Fix extract-examples.ts to only extract ```ruchy blocks, skip ```rust blocks
- [ ] **TEST-002** Add language detection to properly identify Ruchy vs Rust code
- [ ] **TEST-003** Update test runner to validate language type before execution
- [ ] **TEST-004** Re-run all tests with fixed extractor to get true pass rate
- [ ] **TEST-005** Update INTEGRATION.md with corrected v1.17.0 results

**Sprint 1: Infrastructure (COMPLETED)**
- [x] **TDD-001** INTEGRATION.md template exists and is updated
- [x] **TDD-002** Legacy examples preserved in test directories
- [x] **TDD-003** Test harness operational with ruchy tools
- [x] **TDD-004** Quality gates via Makefile implemented
- [x] **TDD-005** INTEGRATION.md is single source of truth

**Sprint 2: Foundation Chapters (VALIDATED)**
- [x] **TDD-006** Ch01 (Hello World) - 100% passing (6/6)
- [x] **TDD-007** Ch02 (Variables) - Partially working (5/8)
- [x] **TDD-008** Ch03 (Functions) - Mostly working (8/9)
- [x] **TDD-009** INTEGRATION.md updated with results

**Sprint 3: Core Features (IN PROGRESS)**
- [x] **TDD-010** Tested Ch04-06 - mixed results documented
- [x] **TDD-011** Working features documented in INTEGRATION.md
- [ ] **TDD-012** Integrate provability testing where applicable
- [x] **TDD-013** INTEGRATION.md continuously updated

**Sprint 4: Advanced Features (ONGOING)**
- [x] **TDD-014** Advanced features tested - most failing as expected
- [x] **TDD-015** Only working features documented
- [ ] **TDD-016** Mark future features clearly as "NOT IMPLEMENTED"
- [x] **TDD-017** INTEGRATION.md with complete coverage maintained

### Old Roadmap Items (DEPRECATED - DO NOT USE)
~~Testing Quality Crisis Resolution~~
~~Enhanced Testing Infrastructure~~
~~Real Gap Identification~~

**COMPLETED ITEMS (Historical Reference Only):**
✅ v1.0.3 Critical Transpiler Bugs Fixed
✅ Toyota Way Implementation 
✅ Five-Whys Analysis Completed

### TICKET ASSIGNMENT PROTOCOL

**NEVER START WORK WITHOUT:**
1. Ticket number clearly assigned
2. Acceptance criteria defined
3. Previous ticket marked complete
4. Quality gates verified

## FOOLPROOF VERSION UPDATE PROCESS (Toyota Way)

### Single Command Update (AUTOMATED)

```bash
# Updates everything automatically - FOOLPROOF
make sync-version
```

**What this does:**
1. ✅ **Auto-detects** latest Ruchy version (from ../ruchy or installed ruchy)
2. ✅ **Updates all version references** across all files  
3. ✅ **Converts function keywords** from fn → fun in all Ruchy code blocks
4. ✅ **Tests all examples** with new version
5. ✅ **Generates updated reports** (JSON, Markdown, HTML dashboard)
6. ✅ **Updates integration docs** automatically

### Manual Process (If Needed)

If the automated process fails, follow these EXACT steps:

#### Step 1: Version Detection
```bash
# Method 1: From parent ruchy directory
cd ../ruchy && cargo metadata --format-version 1 | jq -r '.packages[] | select(.name == "ruchy") | .version'

# Method 2: From installed ruchy  
ruchy --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+'
```

#### Step 2: Update All Version References
```bash
# Update chapter headers
find src -name "*.md" -exec sed -i "s/ruchy [0-9]\+\.[0-9]\+\.[0-9]\+/ruchy NEW_VERSION/g" {} \;

# Update reports and test files  
find reports test -name "*.json" -o -name "*.md" -o -name "*.html" -o -name "*.log" -exec sed -i "s/ruchy [0-9]\+\.[0-9]\+\.[0-9]\+/ruchy NEW_VERSION/g" {} \;

# Update documentation
find docs -name "*.md" -exec sed -i "s/v[0-9]\+\.[0-9]\+\.[0-9]\+/vNEW_VERSION/g" {} \;
```

#### Step 3: Convert Function Keywords
```bash
# Convert fn → fun in all Ruchy code blocks
for file in src/*.md; do
    sed -i '/```ruchy/,/```/{s/\(\s*\)fn \([a-zA-Z_][a-zA-Z0-9_]*\)\s*(/\1fun \2(/g}' "$file"
done
```

#### Step 4: Test and Validate
```bash
make test-comprehensive
make generate-reports  
make update-integration-docs
```

### Quality Gates (MANDATORY)

Every version update MUST pass:

```bash
# GATE 1: Version consistency
make verify-version

# GATE 2: All examples compile  
make test-comprehensive

# GATE 3: Function keyword compliance
! grep -r "fn [a-zA-Z_]" src/ | grep -v "```rust"

# GATE 4: No version mismatches
! grep -r "0\.1[0-9]\.[0-9]" src/ | grep -v "NEW_VERSION"

# GATE 5: Book builds successfully
make build
```

### Automation Success Metrics

- 🎯 **One Command**: `make sync-version` handles everything
- ⏱️ **Time**: Complete update in <2 minutes  
- 🔒 **Reliability**: Zero manual steps required
- ✅ **Verification**: Automated testing of all changes
- 📊 **Reporting**: Auto-generated status reports

## Remember

**Implementation-first documentation**: Every line of example code must compile and run correctly with the current Ruchy compiler. The book is a living proof that Ruchy works, not a promise of what it might do.
- toyota way.  never allow shortcuts.
- if it isn't automated. consider it broken.  no manual "hacks".
- never use any scripting language but ruchy, if you cannot use ruchy, use Deno TypeScript/Node/Javascript.
- when bugs are found in ruchy, document them thoroughly in `docs/bugs/ruchy-runtime-bugs.md`
- always push changes frequently, i.e. after a chapter, etc.
- if it isn't automated it is broken.  never do tasks manually. fix root cause.
- always rebuild book automatically on each push, i.e. each validation of the language
- all code must be TDD, and cannot contain SATD.  Can use PMAT for verification.
- all examples require 100% coverage since this is a book. must use ruchy coverage tool.
- all bugs with ruchy language must be detailed bug reports that are reproducible and are github tickets