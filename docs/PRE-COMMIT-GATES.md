# Pre-Commit Quality Gates Documentation

**Last Updated**: 2025-11-02
**Ruchy Version**: v3.213.0
**Methodology**: Extreme TDD + Toyota Way (Jidoka)

## Overview

The Ruchy Book enforces **10 comprehensive quality gates** on every commit to prevent regressions and maintain professional documentation standards. These gates implement **Jidoka** (automation with quality at source) from the Toyota Production System.

## Quality Gate Philosophy

**Zero Tolerance for Defects**: All quality issues must be fixed before commit.
**Automation with Intelligence**: Gates detect issues automatically but provide clear guidance for fixes.
**Continuous Improvement (Kaizen)**: Gates evolve based on discovered issues.

## The 10 Quality Gates

### GATE 1: Modified Book Examples Detection
**Purpose**: Determine if quality checks are needed
**Action**: Scans git staging for modified `.md` files in `src/`
**Result**: If no markdown changes, skip remaining gates

### GATE 2: 18-Tool Testing Infrastructure
**Purpose**: Verify comprehensive testing capability exists
**Checks**: Presence of `scripts/extract-examples.ts`
**Blocking**: YES - Required for TICKET-018 comprehensive testing

### GATE 3: Ruchy Installation
**Purpose**: Verify ruchy is available for testing
**Checks**: `ruchy` command available in PATH
**Blocking**: YES - Cannot test examples without ruchy

### GATE 4: Extract and Test All Examples ⭐ CRITICAL ⭐
**Purpose**: Validate all code examples compile and run correctly
**Process**:
1. Extracts all Ruchy code blocks from markdown
2. Runs each example with `ruchy run`
3. Verifies output matches expected results
4. Calculates pass rate

**Requirements**:
- Minimum 90% pass rate required
- All changed examples must pass
- No new failures introduced

**Blocking**: YES - Primary quality gate

### GATE 5: Vaporware Documentation Detection
**Purpose**: Detect promises of unimplemented features
**Checks**:
- "coming soon" phrases
- "not yet implemented" markers
- TODO/FIXME/HACK comments

**Blocking**: NO - Warning only
**Rationale**: File GitHub issues instead of inline TODOs

### GATE 6: Function Keyword Verification
**Purpose**: Ensure correct syntax in Ruchy vs Rust examples
**Checks**: Ruchy code blocks use `fun`, not `fn`
**Pattern**: `^\s*fn\s+[a-zA-Z_]` in ````ruchy` blocks
**Blocking**: YES - Causes compilation failures

### GATE 7: TICKET-018/020 Status (Informational)
**Purpose**: Track progress toward 19-tool comprehensive testing
**Status**: Currently tests with `ruchy run` only
**Target**: All 19 tools per example
**Blocking**: NO - Future enhancement

### GATE 8: Debugging Tools Validation
**Purpose**: Verify debugging infrastructure
**Checks**:
- `ruchydbg validate` (if available)
- `ruchy --trace` flag functionality

**Blocking**: NO - Informational only

### GATE 9: Version Consistency Check 🆕
**Purpose**: Prevent version inconsistencies across documentation
**Process**:
1. Detects current ruchy version
2. Scans changed files for version references
3. Flags mismatches (allows historical context versions)

**Allowed Historical Versions**: v3.213.0, v3.213.0, v3.213.0
**Blocking**: YES - Version drift causes confusion

**Example Detection**:
```
Found version inconsistencies (should be 3.175.0):
File: src/ch10-00-input-output-tdd.md
38:*Ruchy version: v3.213.0*
```

### GATE 10: Enhanced Vaporware & Quality Regression 🆕
**Purpose**: Multi-layer quality issue detection
**Checks**:

**Pattern 1: Future Promises**
- Detects: "will be", "planned feature", "upcoming", "soon"
- Allows: Inside comments, notes, blockquotes (historical context)

**Pattern 2: Example Output Verification**
- Detects: Ruchy code blocks without `**Output:**` sections
- Ensures: Examples show expected behavior

**Pattern 3: Function Syntax (Duplicate Check)**
- Detects: `fn` instead of `fun` in Ruchy code
- Provides: File-specific feedback

**Blocking**: Conditional
- 0 issues: ✅ PASS
- 1-2 issues: ⚠️ WARNING (not blocking)
- 3+ issues: ❌ FAIL (blocking)

## Quality Metrics Tracked

| Metric | Target | Enforcement |
|--------|--------|-------------|
| Example Pass Rate | ≥90% | BLOCKING |
| Version Consistency | 100% | BLOCKING |
| Function Keyword Correctness | 100% | BLOCKING |
| SATD Violations | 0 | WARNING |
| Vaporware Patterns | <3 | CONDITIONAL |
| Debugging Tools | Available | INFORMATIONAL |

## Bypass Protocol (Emergency Only)

```bash
git commit --no-verify
```

**ONLY use for:**
- Emergency hotfixes
- Documentation-only changes (no code examples)
- Hook infrastructure fixes

**NEVER bypass for:**
- Failing examples
- Version inconsistencies
- Function keyword errors

## Gate Development History

### Nov 2, 2025: Enhanced Gates (GATE 9 & 10)
**Motivation**: Systematic chapter verification revealed version inconsistencies in 6/21 chapters
**Solution**: Automated version checking + enhanced vaporware detection
**Result**: Prevents recurrence of issues found during manual verification

**Issues Prevented by New Gates:**
- 15 version inconsistencies across Ch02, Ch03, Ch05, Ch06, Ch10, Ch13
- 2 vaporware code blocks in Ch02, Ch03
- Multiple `fn` vs `fun` errors

### Oct 31, 2025: TICKET-018 Implementation
**Added**: Comprehensive 18-tool testing gates
**Result**: 100% validation coverage across all tools

### Oct 30, 2025: Initial Quality Gates
**Added**: Basic example testing, SATD detection, function keywords
**Result**: 90% pass rate enforcement

## Toyota Way Principles Applied

### Jidoka (自働化) - Automation with Intelligence
**Implementation**: Gates detect issues automatically but provide context for fixes
**Example**: GATE 9 shows exact line numbers and file locations for version issues

### Kaizen (改善) - Continuous Improvement
**Implementation**: Gates evolve based on discovered patterns
**Example**: GATE 10 added after systematic verification revealed vaporware patterns

### Genchi Genbutsu (現地現物) - Go and See
**Implementation**: GATE 4 actually runs every example with real ruchy
**Example**: Not just syntax check, but full execution with output verification

## Troubleshooting Common Issues

### "Pass rate below 90% threshold"
**Cause**: Examples failing compilation or producing wrong output
**Fix**:
1. Test example locally: `ruchy run path/to/example.ruchy`
2. Fix syntax errors or update expected output
3. Verify fix: `deno task extract-examples`

### "Found version inconsistencies"
**Cause**: Chapter references old ruchy version
**Fix**:
1. Check current version: `ruchy --version`
2. Update all references: `v3.213.0` → `v3.213.0`
3. Keep historical versions for context (v3.213.0, v3.213.0, v3.213.0)

### "Found 'fn' in Ruchy code"
**Cause**: Using Rust syntax `fn` instead of Ruchy syntax `fun`
**Fix**: Change `fn function_name()` to `fun function_name()`
**Note**: Only affects Ruchy code blocks, Rust examples correctly use `fn`

### "Quality issues found"
**Cause**: Multiple vaporware or quality patterns detected
**Fix**:
1. Remove "coming soon" promises
2. Add `**Output:**` sections to examples
3. File GitHub issues for unimplemented features

## Performance

**Typical Execution Time**: 15-30 seconds for full gate suite
**Breakdown**:
- GATE 1-3: <1 second (detection)
- GATE 4: 10-25 seconds (example testing)
- GATE 5-10: 2-5 seconds (pattern detection)

## References

- **TICKET-018**: Comprehensive 18-Tool Testing
- **TICKET-020**: Debugging Tools Integration
- **Toyota Way**: Quality at source (Jidoka)
- **Extreme TDD**: RED-GREEN-REFACTOR methodology

## Maintenance

**Review Gates**: After every 10 commits
**Update Gates**: When new patterns discovered
**Test Gates**: On every pre-commit hook change
**Document Changes**: In this file + commit message
