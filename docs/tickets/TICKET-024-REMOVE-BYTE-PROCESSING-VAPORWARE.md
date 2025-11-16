# TICKET-024: Remove Byte Processing Vaporware (2 Failures → 0)

**Date**: 2025-10-30
**Priority**: HIGH (Impact: +1% pass rate to 97%)
**Type**: Vaporware Removal / Quality Gate
**Status**: IN PROGRESS
**Estimated Time**: 15 minutes
**Follows**: TICKET-021, TICKET-023 (same pattern)

## Problem

2 examples document low-level byte processing that doesn't work properly in v3.213.0:
- Ch04 example 10: Word frequency counting with byte processing
- Ch17 example 8: Integer parsing with byte processing

**Errors**:
- Ch04: `Type error: Cannot cast integer to usize`
- Ch17: `Type error: Cannot compare integer and byte for ordering`

## Root Cause

These examples use low-level byte processing features that are incompletely implemented:

**What partially works**:
- ✅ `text.as_bytes()` - returns array of integers
- ✅ `b'h'` - byte literals exist
- ✅ Array indexing with integers

**What doesn't work**:
- ❌ Comparing integers and bytes (`ch >= b'0'` fails)
- ❌ Type compatibility between as_bytes() result and byte literals
- ❌ as_bytes() returns integers, not bytes (type mismatch)

## Investigation Results

```bash
# as_bytes() works but returns integers
$ echo 'let bytes = "hello".as_bytes(); bytes' | ruchy
[104, 101, 108, 108, 111]  # Returns integers, not bytes

# Byte literals work
$ echo "b'h'" | ruchy
104

# But you can't compare them
$ echo "104 == b'h'" | ruchy
false  # Type mismatch: integer != byte

# The comparison fails with ordering error
$ echo "104 >= b'0'" | ruchy
Error: Cannot compare integer and byte for ordering
```

**The problem**: `as_bytes()` returns integers, but byte literals create byte type. Ruchy's type system doesn't allow comparing them.

## CLAUDE.md Violation

```markdown
1. **NEVER Document Unimplemented Features**: Zero tolerance for vaporware.
   If it doesn't compile in current `ruchy`, it doesn't go in the book.
```

These examples don't compile/run successfully in v3.213.0.

## Impact

**Current State**:
- Total examples: 138
- Passing: 133 (96%)
- Failing: 5 (4%)

**After Fix**:
- Total examples: 136 (-2 removed)
- Passing: 133 (98%) **+2% improvement**
- Failing: 3 (2%)

## Solution (EXTREME TDD)

### Phase 1: TDD RED (Verify Failures)
```bash
# Confirm 2 byte processing failures exist
cat test/extracted-examples/failing.log | grep -E "ch04.*example 10|ch17.*example 8"

# Expected: Both failing with type errors
```

### Phase 2: TDD GREEN (Remove Vaporware)

Remove 2 examples using broken byte processing:

**Ch04 example 10** (~lines 586-625):
- Section: "Efficient Processing Patterns"
- Uses: as_bytes(), byte literals, byte comparisons
- Issue: Cannot compare integers from as_bytes() with byte literals
- Action: Remove entire section

**Ch17 example 8** (~lines 384-430):
- Section: "Numeric Input Validation"
- Uses: as_bytes(), byte literals, byte comparisons `ch >= b'0' && ch <= b'9'`
- Issue: Same type mismatch problem
- Action: Remove entire section

### Phase 3: REFACTOR (Verify Fixes)
```bash
# Verify examples removed
! grep "as_bytes" src/ch04-00-practical-patterns-tdd.md
! grep -A 5 "parse_positive_integer" src/ch17-00-error-handling-robustness.md

# Test updated chapters
deno task extract-examples | grep -E "ch04|ch17"

# Expected:
# - Ch04: 10 → 9 examples (1 removed)
# - Ch17: 11 → 10 examples (1 removed)
# - Both at 100% pass rate

# Overall
deno task extract-examples | grep "Examples working"
# Expected: 133/136 = 98% (was 133/138 = 96%)
```

## Detailed Changes

### Ch04: Remove "Efficient Processing Patterns"
**File**: `src/ch04-00-practical-patterns-tdd.md`
**Lines**: ~586-625 (approximate)

Remove section showing:
```ruchy
fun count_word_frequencies(text: &str) -> i32 {
    let chars = text.as_bytes();
    let ch = chars[i];
    if ch == b' ' || ch == b'\n' { ... }
}
```

**Issue**: Cannot compare `chars[i]` (integer) with `b' '` (byte)

### Ch17: Remove "Numeric Input Validation"
**File**: `src/ch17-00-error-handling-robustness.md`
**Lines**: ~384-430 (approximate)

Remove section showing:
```ruchy
fun parse_positive_integer(input: &str) -> i32 {
    let chars = input.as_bytes();
    if ch >= b'0' && ch <= b'9' { ... }
}
```

**Issue**: Cannot compare `ch` (integer) with `b'0'` (byte)

## Acceptance Criteria

- [ ] Both byte processing examples removed
- [ ] Ch04: 9/9 passing (was 9/10)
- [ ] Ch17: 10/10 passing (was 9/11)
- [ ] Overall: 136 examples, 133 passing (98%)
- [ ] Book builds successfully
- [ ] Pre-commit hooks pass

## Why Remove vs Fix?

**Considered**: Fix type mismatches by casting or converting

**Rejected because**:
1. The type system limitation is in Ruchy itself, not fixable in examples
2. as_bytes() returning integers instead of bytes seems like a design issue
3. Workarounds would make examples contrived and not idiomatic
4. No simple string processing alternative exists for these use cases

**Better approach**:
- Remove examples that demonstrate non-working patterns
- Wait for Ruchy to implement proper byte type compatibility
- When fixed, add examples back demonstrating correct byte processing

## Success Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Ch04 examples | 10 | 9 | -1 ✅ |
| Ch04 passing | 9/10 (90%) | 9/9 (100%) | +10% ✅ |
| Ch17 examples | 11 | 10 | -1 ✅ |
| Ch17 passing | 9/11 (82%) | 10/10 (100%) | +18% ✅ |
| Overall examples | 138 | 136 | -2 |
| Overall passing | 133/138 (96%) | 133/136 (98%) | +2% ✅ |
| Byte processing vaporware | 2 | 0 | -2 ✅ |

## Toyota Way Alignment

- **EXTREME TDD**: RED (confirm failures) → GREEN (remove vaporware) → REFACTOR (verify)
- **Zero defects**: Remove untestable/failing examples
- **Genchi Genbutsu**: Tested actual Ruchy behavior - byte processing doesn't work
- **Kaizen**: Third iteration of vaporware removal (TICKET-021, 023, 024)
- **Jidoka**: Quality gate enforcement (pre-commit)

## Files to Modify

1. `src/ch04-00-practical-patterns-tdd.md` - Remove 1 byte processing section
2. `src/ch17-00-error-handling-robustness.md` - Remove 1 byte processing section

## Risks

**Low Risk**:
- Following proven TICKET-021/023 pattern (3rd iteration)
- No logic changes, only removing non-working examples
- Clear evidence that byte processing doesn't work

**For Ruchy Team**:
- This reveals a type system issue: as_bytes() returns integers, but byte literals are byte type
- Should either:
  1. Make as_bytes() return byte array
  2. Allow comparing integers and bytes
  3. Remove byte literals if they're not fully supported

## Timeline

- **Ticket creation**: 2025-10-30
- **Phase 1 RED**: 3 minutes (verify failures)
- **Phase 2 GREEN**: 8 minutes (remove 2 sections)
- **Phase 3 REFACTOR**: 4 minutes (test and verify)
- **Total**: 15 minutes

---

**Status**: IN PROGRESS
**Next Action**: Phase 1 RED - Verify the 2 byte processing failures exist
