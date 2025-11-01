# Extreme TDD Refactoring Plan: Reality-Based Documentation Only

**Version**: 1.0
**Status**: Active
**Date**: 2025-10-13
**Methodology**: Extreme TDD + 15-Tool Validation + Notebook Integration

## Mission Statement

**Document ONLY what actually works in the current Ruchy compiler. Zero tolerance for vaporware.**

## Core Principles

### 1. Reality-Based Documentation
- ✅ **DO**: Document features that compile and run TODAY
- ❌ **DON'T**: Document "coming soon", "will be", "future" features
- ✅ **DO**: Test EVERY example with all 15 tools
- ❌ **DON'T**: Include ANY unverified examples

### 2. Language Spec as Source of Truth
- Cross-reference `docs/specifications/ruchy-language-spec.md`
- Validate every feature against actual compiler implementation
- Test against `../ruchy/src/frontend/lexer.rs` and `ast.rs`

### 3. Extreme TDD Workflow
```
SPEC → TEST → DOCUMENT → VALIDATE (15 tools) → NOTEBOOK → COMMIT
```

### 4. Zero SATD Tolerance
- NO TODO comments
- NO FIXME comments
- NO "coming soon" text
- NO "not yet implemented"
- NO "will be" or "future"

## Validation Stack (7 Layers)

### Layer 1: Syntax Validation
```bash
ruchy check example.ruchy
# MUST pass 100%
```

### Layer 2: Compilation
```bash
ruchy compile example.ruchy
# MUST produce binary
```

### Layer 3: Execution
```bash
ruchy run example.ruchy
# MUST execute with expected output
```

### Layer 4: Quality Gates (15 Tools)
```bash
make dogfood-full
# All 15 tools MUST pass their thresholds
```

### Layer 5: Notebook Execution
```bash
# Start notebook server
ruchy notebook --port 8080 &

# Execute via API
curl -X POST http://localhost:8080/api/execute \
  -H "Content-Type: application/json" \
  -d '{"source": "println(\"Hello\")"}'

# MUST return success + correct output
```

### Layer 6: Language Spec Validation
```bash
# Cross-reference with language spec
grep -A 10 "feature_name" docs/specifications/ruchy-language-spec.md
# Feature MUST be documented in spec
```

### Layer 7: Integration Test
```bash
# Run full test suite
deno task extract-examples
deno task test-examples
# Example MUST be in passing set
```

## Refactoring Sprints

### Sprint Structure
Each sprint = 1 chapter = Multiple tickets
Each ticket = Atomic unit of work = Single commit

### Sprint Ticket Template
```yaml
- id: REFACTOR-XXX
  title: "Ch0X: [Chapter Name] - Reality Check"
  priority: critical
  status: pending

  phase_1_audit:
    - "Extract all examples"
    - "Run through language spec validator"
    - "Identify vaporware (coming soon, TODO, etc.)"
    - "Test with all 15 tools"
    - "Test in notebook"
    - "Document pass/fail rate"

  phase_2_triage:
    - "KEEP: Examples that pass all 7 layers"
    - "FIX: Examples that fail but feature exists"
    - "REMOVE: Examples for unimplemented features"
    - "BUG: File compiler bugs found"

  phase_3_refactor:
    - "Remove all vaporware documentation"
    - "Fix failing examples"
    - "Add missing test coverage"
    - "Validate with 15 tools"
    - "Test in notebook"

  phase_4_validation:
    - "Run make dogfood-full"
    - "Run notebook validation tests"
    - "Update INTEGRATION.md"
    - "Verify 100% pass rate"

  phase_5_commit:
    - "Atomic commit per chapter"
    - "Push to GitHub"
    - "Update roadmap status"

  acceptance_criteria:
    - "Zero vaporware references"
    - "100% examples compile"
    - "100% examples run correctly"
    - "100% pass all 15 tools (blocking gates)"
    - "100% work in notebook"
    - "All features cross-referenced to language spec"
    - "INTEGRATION.md updated"
```

## Chapter-by-Chapter Plan

### Priority 1: Foundation (Weeks 1-2)

#### REFACTOR-001: Ch01 - Installation & Hello World
**Current State**: Has TODO comments, may reference future features
**Target State**: Only document current installation, working hello world

**Validation**:
- [ ] `ruchy --version` works
- [ ] Hello world compiles: `ruchy compile hello.ruchy`
- [ ] Hello world runs: `ruchy run hello.ruchy`
- [ ] Notebook execution: Works via API
- [ ] All 15 tools pass

**Expected Bugs**: None (hello world is stable)

#### REFACTOR-002: Ch02 - Variables & Types
**Current State**: 8 examples, 5/8 passing (62.5%)
**Target State**: 100% passing examples only

**Validation**:
- [ ] Cross-ref language spec: Primitive types section
- [ ] Test all type examples: i32, f64, bool, string
- [ ] Test type inference
- [ ] Test mutable vs immutable
- [ ] Notebook execution for each type
- [ ] All 15 tools pass

**Expected Bugs**: Type system edge cases

#### REFACTOR-003: Ch03 - Functions
**Current State**: 9 examples, 8/9 passing (88.9%)
**Target State**: 100% passing examples only

**Validation**:
- [ ] Cross-ref language spec: Functions section
- [ ] Verify `fun` keyword (NOT `fn`)
- [ ] Test parameter types
- [ ] Test return types
- [ ] Test lambdas
- [ ] Notebook execution
- [ ] All 15 tools pass

**Expected Bugs**: Lambda syntax issues

### Priority 2: Core Features (Weeks 3-4)

#### REFACTOR-004: Ch04 - Practical Patterns
**Audit Required**: Check for vaporware patterns

#### REFACTOR-005: Ch05 - Control Flow
**Current State**: Has TODO/future references
**Action**: Remove vaporware, keep only working control flow

**Validation**:
- [ ] if/else expressions
- [ ] match expressions
- [ ] for loops
- [ ] while loops
- [ ] loop with break/continue
- [ ] Notebook execution
- [ ] All 15 tools pass

**Expected Bugs**: Pattern matching edge cases

#### REFACTOR-006: Ch06 - Data Structures
**Current State**: Has vaporware references
**Action**: Document only implemented structures

**Validation**:
- [ ] Arrays/lists
- [ ] Tuples
- [ ] Structs (basic)
- [ ] Notebook execution
- [ ] All 15 tools pass

**Expected Bugs**: Collection method availability

### Priority 3: Advanced (Weeks 5-6)

#### REFACTOR-007: Ch10 - Input/Output
**Current State**: Has TODO comments
**Action**: Remove unimplemented I/O features

#### REFACTOR-008: Ch14 - Toolchain Mastery
**Action**: Document actual toolchain (15 tools)

#### REFACTOR-009: Ch15 - Binary Compilation
**Action**: Verify compilation actually works

#### REFACTOR-010: Ch16 - Testing & QA
**Action**: Document current testing capabilities

#### REFACTOR-011: Ch17 - Error Handling
**Action**: Document Result/Option if they work

#### REFACTOR-012: Ch18 - DataFrames
**Current State**: May have incomplete features
**Action**: Test actual DataFrame API

#### REFACTOR-013: Ch19 - Structs & OOP
**Action**: Validate struct features work

#### REFACTOR-014: Ch21 - Professional Tooling
**Action**: Document all 15 tools comprehensively

#### REFACTOR-015: Ch22 - Compiler Development
**Action**: Ensure accuracy of compiler internals

#### REFACTOR-016: Ch23 - REPL & Object Inspection
**Action**: Document actual REPL capabilities

## Bug Filing Protocol

### When to File a Bug

File a bug when:
1. Language spec says feature exists
2. Example SHOULD work based on spec
3. Example FAILS in reality
4. OR: Compiler crashes/panics

### Bug Report Template

```markdown
## Bug Report: [Feature Name]

**Filed**: [Date]
**Ruchy Version**: vX.Y.Z
**Platform**: [OS and arch]
**Severity**: Critical/High/Medium/Low
**Status**: Open/Investigating/Fixed/Wontfix

### Issue Summary
[One-line description]

### Language Spec Reference
Section: [Section in ruchy-language-spec.md]
Expected: [What spec says should work]

### Reproduction Steps
```ruchy
// Minimal reproducible example
fun main() {
    // Code that should work but doesn't
}
```

### Expected Behavior
[What SHOULD happen according to spec]

### Actual Behavior
[What ACTUALLY happens]

```
Error output here
```

### Impact on Book
- Chapter X, Section Y
- Blocks N examples
- Affects M% of chapter content

### Workaround
[If any workaround exists]

### Validation Checklist
- [ ] Tested with latest Ruchy version
- [ ] Cross-referenced language spec
- [ ] Minimal example provided
- [ ] Error output captured
- [ ] Workaround documented (if exists)

### Testing Evidence
```bash
# All 15 tools tested
ruchy check example.ruchy       # PASS/FAIL
ruchy run example.ruchy         # PASS/FAIL
ruchy lint example.ruchy        # PASS/FAIL
# ... etc
```
```

### Bug Tracking

**Location**: `docs/bugs/refactoring-bugs.md`

**Format**:
```markdown
# Refactoring Bug Tracker

## Active Bugs

### BUG-001: [Title]
- **Status**: Open
- **Ticket**: REFACTOR-XXX
- **Blocking**: ChXX Section Y
- **Workaround**: [Yes/No]

### BUG-002: [Title]
...
```

## Notebook Integration

### Test Every Example in Notebook

```javascript
// scripts/test-in-notebook.ts
import { assertEquals } from "https://deno.land/std/assert/mod.ts";

async function testInNotebook(code: string, expectedOutput: string) {
  const response = await fetch('http://localhost:8080/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source: code })
  });

  const result = await response.json();

  assertEquals(result.success, true, "Code should execute successfully");
  assertEquals(result.output.trim(), expectedOutput.trim(), "Output should match");
}

// Test all book examples
for (const example of extractedExamples) {
  await testInNotebook(example.code, example.expected);
}
```

### Notebook Test Target

```makefile
# Makefile
test-notebook:
	@echo "🎓 Testing all examples in Ruchy notebook..."
	@ruchy notebook --port 8765 & \
	NOTEBOOK_PID=$$!; \
	sleep 2; \
	deno run --allow-net --allow-read scripts/test-in-notebook.ts; \
	kill $$NOTEBOOK_PID
	@echo "✅ Notebook testing complete"
```

### Add to CI/CD

```yaml
# .github/workflows/test.yml
- name: Test in Notebook
  run: |
    ruchy notebook --port 8765 &
    NOTEBOOK_PID=$!
    sleep 2
    deno task test-notebook
    kill $NOTEBOOK_PID
```

## Quality Metrics

### Per-Chapter Targets

| Chapter | Current Pass Rate | Target Pass Rate | 15-Tool Pass | Notebook Pass |
|---------|-------------------|------------------|--------------|---------------|
| Ch01 | 100% (6/6) | ✅ 100% | ⚠️ TBD | ⚠️ TBD |
| Ch02 | 62.5% (5/8) | 🎯 100% | ⚠️ TBD | ⚠️ TBD |
| Ch03 | 88.9% (8/9) | 🎯 100% | ⚠️ TBD | ⚠️ TBD |
| Ch04 | TBD | 🎯 100% | ⚠️ TBD | ⚠️ TBD |
| Ch05 | TBD | 🎯 100% | ⚠️ TBD | ⚠️ TBD |
| ... | ... | ... | ... | ... |

### Overall Targets

**Current State** (v3.169.0):
- Book Examples: 231/381 (61%)
- One-liners: 17/20 (85%)
- Quality Gates: 0 files pass

**Sprint 1 Target**:
- Book Examples: 100/100 (100%) for audited chapters
- One-liners: 20/20 (100%)
- Quality Gates: 100 files pass

**Final Target** (v2.0):
- Book Examples: 500/500 (100%)
- One-liners: 20/20 (100%)
- Quality Gates: 500 files pass all 15 tools
- Notebook Pass: 500/500 (100%)

## Success Criteria

### Per Ticket
- [ ] Zero vaporware text
- [ ] 100% examples compile
- [ ] 100% examples run correctly
- [ ] 100% pass blocking quality gates (6/15 tools)
- [ ] 90%+ pass advisory gates (9/15 tools)
- [ ] 100% work in notebook
- [ ] All bugs filed with proper format
- [ ] INTEGRATION.md updated
- [ ] Atomic commit pushed

### Per Sprint
- [ ] All tickets complete
- [ ] No open bugs blocking next sprint
- [ ] Documentation accurate to reality
- [ ] make dogfood-full passes
- [ ] make test-notebook passes

### Project Complete
- [ ] All 25 chapters refactored
- [ ] Zero vaporware documentation
- [ ] 100% examples validated
- [ ] All bugs filed (or fixed)
- [ ] Complete language spec coverage
- [ ] Book = Comprehensive compiler test suite

## Workflow Example

### REFACTOR-001: Ch01 Hello World

**Day 1: Audit**
```bash
# Extract examples
deno task extract-examples

# Test with 15 tools
make dogfood-check
make dogfood-lint
make dogfood-score
# ... all 15 tools

# Test in notebook
make test-notebook

# Check against spec
grep -A 20 "Hello World" docs/specifications/ruchy-language-spec.md
```

**Day 1: Results**
```
Ch01 Audit Results:
- Examples: 6 total
- Compiling: 6/6 (100%)
- Running: 6/6 (100%)
- 15-Tool Pass: 6/6 (100%)
- Notebook Pass: 6/6 (100%)
- Vaporware Found: 2 instances of "future feature"
- Bugs Found: 0
```

**Day 1: Refactor**
```bash
# Remove vaporware text
sed -i '/future feature/d' src/ch01-*.md

# Re-test
make dogfood-full
make test-notebook

# Verify 100% pass
```

**Day 1: Commit**
```bash
git add src/ch01-*.md
git commit -m "refactor(ch01): Remove vaporware, achieve 100% validation

- Removed 2 instances of future feature references
- All 6 examples pass all 15 tools
- All 6 examples work in notebook
- Zero bugs found
- 100% pass rate achieved

Validation:
- ruchy check: 6/6 ✅
- ruchy lint: 6/6 ✅
- ruchy score: 6/6 A+ ✅
- Notebook: 6/6 ✅

[REFACTOR-001]
"
git push origin main
```

## Timeline

### Week 1-2: Foundation
- REFACTOR-001: Ch01 (1 day)
- REFACTOR-002: Ch02 (2 days)
- REFACTOR-003: Ch03 (2 days)

### Week 3-4: Core
- REFACTOR-004: Ch04 (2 days)
- REFACTOR-005: Ch05 (2 days)
- REFACTOR-006: Ch06 (2 days)

### Week 5-6: Advanced
- REFACTOR-007 through REFACTOR-016 (10 chapters, 2-3 days each)

**Total Duration**: 6-8 weeks for complete refactoring

## Automation

### Pre-Commit Hook
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check for vaporware
if grep -r "coming soon\|not yet\|will be\|TODO\|FIXME" src/; then
    echo "❌ BLOCKED: Vaporware documentation found"
    exit 1
fi

# Run quality gates
make dogfood-quick || exit 1

echo "✅ Quality gates passed"
```

### Continuous Monitoring
```bash
# Daily cron job
0 0 * * * cd /path/to/ruchy-book && make sync-version && make dogfood-full
```

## Conclusion

This extreme TDD refactoring will transform the book from aspirational documentation to **battle-tested reality**. Every example will be proven to work through 7 layers of validation including notebook execution.

**Zero tolerance for vaporware. Document only what works. Test everything.**
