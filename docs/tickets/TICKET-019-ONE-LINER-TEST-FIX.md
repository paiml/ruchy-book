# TICKET-019: Fix One-Liner Test Infrastructure (CRITICAL REGRESSION)

**Status**: OPEN
**Priority**: CRITICAL (BLOCKING)
**Assigned**: Book Development Team
**Created**: 2025-10-30
**Target**: Sprint Q4 2025 (Immediate)
**Approach**: EXTREME TDD (Test-Driven Development)

## Problem Statement

One-liner tests have completely regressed from 100% passing (v3.67.0) to 0% passing (v3.149.0). This is a CRITICAL BLOCKING issue preventing verification of Chapter 4.1 one-liner examples.

### Current State
- **One-liner tests**: 0/20 passing (0%)
- **Previous state**: 100% passing (v3.67.0)
- **Regression**: COMPLETE FAILURE
- **Impact**: Cannot verify one-liner functionality

### Evidence
```
📈 Results Summary (v3.149.0 - CURRENT)
========================================
Tests Passed: 0/20   ❌ (REGRESSION!)
Tests Failed: 20/20  ❌
Success Rate: 0%     ❌ (CRITICAL REGRESSION from 100%)
```

## Root Cause Analysis (5 Whys)

**WHY #1**: Why are all one-liners failing?
- Test infrastructure is not running properly

**WHY #2**: Why is the test infrastructure not running?
- Test script may have wrong expectations or invocation method

**WHY #3**: Why might expectations be wrong?
- Ruchy version changed from v3.67.0 to v3.149.0
- Output format may have changed
- Test infrastructure may need updating

**WHY #4**: Why wasn't this caught earlier?
- One-liner tests are separate from main example tests
- No continuous validation of one-liner suite

**WHY #5**: Why is validation separate?
- Historical artifact - one-liners are in different chapter
- Need to integrate one-liner testing into main pipeline

## Extreme TDD Approach

### Phase 1: RED - Write Failing Tests (Test First)
1. Create test fixture for one simple one-liner
2. Write test that expects correct behavior
3. Run test - VERIFY IT FAILS (RED state)
4. Document why it fails

### Phase 2: GREEN - Make Tests Pass (Minimal Fix)
1. Fix the test infrastructure to handle one-liners
2. Run test - VERIFY IT PASSES (GREEN state)
3. No refactoring yet - just make it work

### Phase 3: REFACTOR - Improve (Clean Up)
1. Refactor test code for clarity
2. Add comprehensive one-liner test coverage
3. Integrate into main test pipeline
4. Update documentation

## Test Fixtures (TDD RED Phase)

### Fixture 1: Simple Addition
```ruchy
2 + 2
```
**Expected Output**: `4`
**Current Result**: Unknown (test failing)

### Fixture 2: String Concatenation
```ruchy
"Hello " + "World"
```
**Expected Output**: `"Hello World"` or `Hello World`
**Current Result**: Unknown (test failing)

### Fixture 3: Boolean Expression
```ruchy
10 > 5
```
**Expected Output**: `true`
**Current Result**: Unknown (test failing)

## Acceptance Criteria (Definition of Done)

### Must Have (BLOCKING)
- [ ] All 20 one-liner tests pass (100% success rate)
- [ ] Test infrastructure properly invokes ruchy
- [ ] Output validation matches ruchy v3.149.0 format
- [ ] Tests documented with expected vs actual output
- [ ] INTEGRATION.md updated with results

### Should Have
- [ ] One-liner tests integrated into main test suite
- [ ] Automated testing via `make test-oneliners`
- [ ] Clear error messages when tests fail
- [ ] Test results logged to test/extracted-examples/

### Nice to Have
- [ ] Per-oneliner pass/fail reporting
- [ ] Performance metrics for one-liners
- [ ] Integration with TICKET-018 18-tool testing

## Implementation Plan (Extreme TDD)

### Step 1: Create Test Infrastructure (RED) - 30 min
```bash
# Create test file for TDD
touch test/test-oneliner-infrastructure.sh

# Write minimal failing test
echo '#!/usr/bin/env -S ../../bashrs/target/release/bashrs' > test/test-oneliner-infrastructure.sh
echo 'ruchy -e "2 + 2" | grep -q "4" || exit 1' >> test/test-oneliner-infrastructure.sh

# Run test - should FAIL initially
bash test/test-oneliner-infrastructure.sh
# Expected: FAIL (RED state)
```

### Step 2: Research Actual Behavior (ANALYSIS) - 30 min
```bash
# Test what ruchy actually outputs
ruchy -e "2 + 2"
# Document actual output format

# Test with different one-liners
ruchy -e '"Hello " + "World"'
ruchy -e '10 > 5'

# Compare with v3.67.0 expectations
# Document differences
```

### Step 3: Fix Test Infrastructure (GREEN) - 1 hour
- Update test-oneliners.ts to match actual ruchy behavior
- Fix output expectations
- Fix invocation method if needed
- Run tests - should PASS (GREEN state)

### Step 4: Extend to All One-Liners (REFACTOR) - 1 hour
- Add all 20 one-liner tests
- Refactor for clarity and maintainability
- Integrate into main test suite
- Update documentation

### Step 5: Verify and Document (COMPLETE) - 30 min
- Run full test suite
- Verify 100% pass rate
- Update INTEGRATION.md
- Commit with detailed message

## Test Cases (All 20 One-Liners)

### Basic Mathematics (4 tests)
1. Simple addition: `2 + 2` → `4`
2. Percentage calculation: `100.0 * 1.08` → `108`
3. Compound interest: `1000.0 * 1.05 * 1.05` → `1102.5`
4. Multi-step calculation: `let price = 99.99; let tax = 0.08; price * (1.0 + tax)` → `107.9892`

### Boolean Logic (4 tests)
5. Greater than comparison: `10 > 5` → `true`
6. Boolean AND operation: `true && false` → `false`
7. Boolean OR operation: `true || false` → `true`
8. Conditional expression: `if 100 > 50 { "expensive" } else { "cheap" }` → `"expensive"`

### String Operations (2 tests)
9. String concatenation: `"Hello " + "World"` → `"Hello World"`
10. String with variables: `let name = "Ruchy"; "Hello " + name` → `"Hello Ruchy"`

### Mathematical Functions (2 tests)
11. Square root function: `let x = 10.0; let y = 20.0; (x * x + y * y).sqrt()` → `22.36...`
12. Trigonometric sine: (if implemented)

### Real-World Calculations (3 tests)
13. Physics: E=mc²
14. Electrical power P=VI
15. Investment return %

### Output Functions (1 test)
16. Basic text operations

### JSON Output (2 tests)
17. Basic JSON output
18. Float JSON output

### Shell Integration (1 test)
19. Shell script integration

### Performance (1 test)
20. Manual exponentiation (2^32)

## Success Metrics

### Sprint Success (Immediate)
- [ ] All 20 one-liner tests passing (100%)
- [ ] Test infrastructure fixed and documented
- [ ] Regression eliminated
- [ ] INTEGRATION.md updated

### Long-term Success
- [ ] One-liners integrated into main test pipeline
- [ ] Continuous validation (no future regressions)
- [ ] Clear documentation of test expectations
- [ ] Automated testing on every commit

## Risks and Mitigations

### Risk: Ruchy behavior changed
**Mitigation**: Document actual v3.149.0 behavior, update expectations

### Risk: Test infrastructure fundamentally broken
**Mitigation**: Rewrite from scratch if needed, using TDD approach

### Risk: One-liners actually broken in ruchy
**Mitigation**: Test manually first, file ruchy bugs if needed

### Risk: Time estimate too optimistic
**Mitigation**: Focus on critical path - 20 passing tests, skip nice-to-haves

## Dependencies

- Ruchy v3.149.0 (current)
- test-oneliners.ts (TypeScript test script)
- deno runtime (for running TypeScript)
- bashrs (for test script quality)

## References

- INTEGRATION.md (current status)
- scripts/test-oneliners.ts (test infrastructure)
- src/ch04-01-one-liners.md (one-liner examples)

## TDD Workflow Summary

```
1. RED:   Write failing test for simple one-liner
2. GREEN: Fix to make that one test pass
3. REFACTOR: Clean up implementation
4. REPEAT: For all 20 one-liners
5. INTEGRATE: Into main test suite
6. DOCUMENT: Update all docs
```

**EXTREME TDD**: Test first, ALWAYS. No code without failing test first.

---

**CRITICAL**: This ticket is BLOCKING for release. Must be completed immediately with extreme TDD discipline.
