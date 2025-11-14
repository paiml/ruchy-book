# TICKET-022: Fix Ch5 Type Coercion Errors (4 Failures → 4 Passes)

**Date**: 2025-10-30
**Priority**: HIGH (Impact: +3% pass rate)
**Type**: Bug Fix / Documentation
**Status**: IN PROGRESS
**Estimated Time**: 30 minutes

## Problem

4 examples in Chapter 5 (Control Flow) are failing with type coercion errors:
- Example 9 (line 272-286): 2 instances of string + integer
- Example 11 (line 316-327): 2 instances of string + integer
- Example 12 (line 330-338): 1 instance of string + integer
- Example 13 (line 341-347): 1 instance of string + integer

**Error**: `Type error: Cannot add string and integer`

**Root Cause**: Attempting to concatenate strings with integers using `+` operator:
```ruchy
println("Count: " + count);  // ❌ count is integer
```

Ruchy doesn't support implicit type coercion for string + integer concatenation.

## Impact

**Current State**:
- Total examples: 142
- Passing: 129 (91%)
- Failing: 13 (9%)

**After Fix**:
- Total examples: 142
- Passing: 133 (94%) **+3% improvement**
- Failing: 9 (6%)

## Solution (EXTREME TDD)

### Phase 1: TDD RED (Verify Failures)
```bash
# Run Ch5 tests to confirm 4 type coercion failures
deno task extract-examples | grep "ch05-00-control-flow-tdd"

# Expected: examples 9, 11, 12, 13 fail with "Cannot add string and integer"
```

### Phase 2: TDD GREEN (Fix Examples)

Ruchy's `println` accepts multiple comma-separated arguments:
```bash
$ echo 'println("Count:", 5)' | ruchy
Count: 5
```

**Fix Pattern**: Change from `+` concatenation to `,` separation

**Example 9 (2 fixes)**:
```ruchy
// Before
println("Count: " + count);
println("Iteration: " + i);

// After
println("Count:", count);
println("Iteration:", i);
```

**Example 11 (2 fixes)**:
```ruchy
// Before
println("High value: " + user_input);
println("Normal value: " + user_input);

// After
println("High value:", user_input);
println("Normal value:", user_input);
```

**Example 12 (1 fix)**:
```ruchy
// Before
println("Count is: " + count);

// After
println("Count is:", count);
```

**Example 13 (1 fix)**:
```ruchy
// Before
println("Processing item " + i);

// After
println("Processing item", i);
```

### Phase 3: REFACTOR (Verify Fixes)
```bash
# Test all Ch5 examples
deno task extract-examples | grep "ch05-00-control-flow-tdd"

# Expected:
# - Examples 9, 11, 12, 13 now PASS ✅
# - Pass rate: 10/17 (was 6/17)
# - Overall: 133/142 = 94% (was 129/142 = 91%)
```

## Detailed Changes

### Example 9: Loops (lines 272-286)
**Location**: `src/ch05-00-control-flow-tdd.md:277, 283`

```ruchy
fun main() {
    // While loop
    let mut count = 0;
    while count < 3 {
        println("Count:", count);  // ← FIXED
        count = count + 1;
    }

    // For loop with range
    for i in 1..4 {
        println("Iteration:", i);  // ← FIXED
    }
}
```

### Example 11: Decision Making (lines 316-327)
**Location**: `src/ch05-00-control-flow-tdd.md:322, 324`

```ruchy
fun main() {
    let user_input = 75;
    let threshold = 50;

    if user_input > threshold {
        println("High value:", user_input);  // ← FIXED
    } else {
        println("Normal value:", user_input);  // ← FIXED
    }
}
```

### Example 12: Counting Loop (lines 330-338)
**Location**: `src/ch05-00-control-flow-tdd.md:334`

```ruchy
fun main() {
    let mut count = 0;
    while count < 10 {
        println("Count is:", count);  // ← FIXED
        count = count + 1;
    }
}
```

### Example 13: Range Processing (lines 341-347)
**Location**: `src/ch05-00-control-flow-tdd.md:344`

```ruchy
fun main() {
    for i in 1..5 {
        println("Processing item", i);  // ← FIXED
    }
}
```

## Acceptance Criteria

- [ ] All 4 examples fixed (6 total string + integer instances)
- [ ] Examples 9, 11, 12, 13 pass tests
- [ ] No regressions in other Ch5 examples (examples 1-8, 10, 14 still pass)
- [ ] Overall pass rate increases from 91% to 94%
- [ ] Book builds successfully
- [ ] Pre-commit hooks pass

## Testing Plan

```bash
# Phase 1: Confirm failures (RED)
deno task extract-examples 2>&1 | grep -A 1 "ch05-00-control-flow-tdd example \(9\|11\|12\|13\)"

# Phase 2: Apply fixes (GREEN)
# Edit src/ch05-00-control-flow-tdd.md
# Change 6 instances of string + integer to comma-separated args

# Phase 3: Verify fixes (REFACTOR)
deno task extract-examples 2>&1 | grep "ch05-00-control-flow-tdd"
# Should show: 10/17 passing (was 6/17)

# Check overall improvement
deno task extract-examples 2>&1 | grep "Examples working"
# Should show: 133/142 (94%, was 129/142 = 91%)
```

## Success Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Ch5 passing | 10/17 (59%) | 14/17 (82%) | +4 ✅ |
| Overall passing | 129/142 (91%) | 133/142 (94%) | +3% ✅ |
| Type coercion errors | 4 | 0 | -4 ✅ |
| Total failures | 13 | 9 | -4 ✅ |

## Toyota Way Alignment

- **EXTREME TDD**: RED (confirm failures) → GREEN (fix all 4) → REFACTOR (verify no regressions)
- **Genchi Genbutsu**: Tested actual Ruchy behavior (`println` with commas works)
- **Zero defects**: Fix all 4 instances of the same issue
- **Root cause**: Type system doesn't support string + integer, use idiomatic Ruchy pattern

## Files to Modify

1. `src/ch05-00-control-flow-tdd.md` - 6 line changes across 4 examples

## Risks

**Low Risk**:
- Simple find/replace changes
- Using idiomatic Ruchy pattern (comma-separated println args)
- No logic changes, only output formatting

**Potential Issues**:
- Output format changes slightly (space after colon vs no space)
  - Before: `"Count: " + 5` → `"Count: 5"`
  - After: `"Count:", 5` → `"Count: 5"`
  - Result: Identical output!

## Timeline

- **Ticket creation**: 2025-10-30
- **Phase 1 RED**: 5 minutes (verify failures)
- **Phase 2 GREEN**: 10 minutes (apply 6 fixes)
- **Phase 3 REFACTOR**: 10 minutes (test and verify)
- **Documentation**: 5 minutes
- **Total**: 30 minutes

---

**Status**: IN PROGRESS
**Next Action**: Phase 1 RED - Verify the 4 failures exist
