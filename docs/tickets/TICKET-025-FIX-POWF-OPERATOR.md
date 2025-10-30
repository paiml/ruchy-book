# TICKET-025: Fix Float Power Method (1 Failure → 0)

**Date**: 2025-10-30
**Priority**: HIGH (Impact: +1% pass rate to 99%)
**Type**: API Mismatch / Simple Fix
**Status**: IN PROGRESS
**Estimated Time**: 10 minutes
**Follows**: TICKET-024 (continuing to 100%)

## Problem

Ch17 example 10 fails with error: `Float method 'powf' takes no arguments`

The example uses `.powf()` method (Rust standard library) which doesn't exist in Ruchy.

**Error**:
```
Error: Evaluation error: Runtime error: Float method 'powf' takes no arguments
```

## Root Cause

The example uses Rust-style power method:
```ruchy
((1.0 + monthly_rate).powf(months as f64))
```

**What doesn't work**:
- ❌ `.powf(exponent)` - Rust method not available in Ruchy

**What works in Ruchy**:
- ✅ `base ** exponent` - Standard power operator

## Investigation Results

```bash
# Rust-style powf() doesn't work
$ echo '(2.0).powf(3.0)' | ruchy
Error: Runtime error: Float method 'powf' takes no arguments

# Ruchy power operator works perfectly
$ echo '2.0 ** 3.0' | ruchy
8.0

# Works with expressions
$ echo '(1.0 + 0.05) ** 360.0' | ruchy
# Returns calculated result
```

**The problem**: Example uses Rust API instead of Ruchy operators.

## Impact

**Current State**:
- Total examples: 136
- Passing: 133 (98%)
- Failing: 3 (2%)

**After Fix**:
- Total examples: 136 (no change)
- Passing: 134 (99%) **+1% improvement**
- Failing: 2 (1%)

## Solution (EXTREME TDD)

### Phase 1: TDD RED (Verify Failure)
```bash
# Confirm powf failure exists
grep -n "powf" src/ch17-00-error-handling-robustness.md

# Test current behavior
echo '(2.0).powf(3.0)' | ruchy
# Expected: Error

# Test correct operator
echo '2.0 ** 3.0' | ruchy
# Expected: 8.0
```

### Phase 2: TDD GREEN (Fix API Usage)

Replace 2 instances of `.powf()` with `**` operator in ch17 example 10.

**File**: `src/ch17-00-error-handling-robustness.md`
**Lines**: ~553-554

**Before**:
```ruchy
let payment = principal * monthly_rate *
    ((1.0 + monthly_rate).powf(months as f64)) /
    (((1.0 + monthly_rate).powf(months as f64)) - 1.0);
```

**After**:
```ruchy
let payment = principal * monthly_rate *
    ((1.0 + monthly_rate) ** (months as f64)) /
    (((1.0 + monthly_rate) ** (months as f64)) - 1.0);
```

**Changes**:
- Replace `.powf(` with ` ** (` (2 instances)

### Phase 3: REFACTOR (Verify Fixes)
```bash
# Verify no powf usage remains
! grep "powf" src/ch17-00-error-handling-robustness.md

# Test updated example
deno task extract-examples | grep ch17

# Expected:
# - Ch17: 10/10 passing (was 9/10)
# - Overall: 134/136 = 99% (was 133/136 = 98%)

# Verify power calculation works
echo 'let months = 360; let rate = 0.05; (1.0 + rate) ** (months as f64)' | ruchy
# Should return calculated result
```

## Detailed Changes

### Ch17 Example 10: Fix Power Calculation
**File**: `src/ch17-00-error-handling-robustness.md`
**Section**: "Design by Contract"
**Lines**: 553-554

**Issue**: Using Rust `.powf()` method instead of Ruchy `**` operator

**Fix**: Replace method calls with operator

## Acceptance Criteria

- [ ] `.powf()` replaced with `**` operator (2 instances)
- [ ] No "powf" strings in ch17
- [ ] Ch17: 10/10 passing (was 9/10)
- [ ] Overall: 134/136 examples passing (99%)
- [ ] Book builds successfully
- [ ] Pre-commit hooks pass

## Why Fix vs Remove?

**This is a simple API fix, not vaporware.**

**Correct approach**:
- Power operation IS implemented in Ruchy
- Just using wrong syntax (Rust method vs Ruchy operator)
- Example demonstrates valid pattern (Design by Contract)
- Fix is trivial: replace method with operator

**Not vaporware because**:
- Feature (exponentiation) fully works in Ruchy
- Example logic is sound
- Just needs syntax correction

## Success Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Ch17 examples | 10 | 10 | no change |
| Ch17 passing | 9/10 (90%) | 10/10 (100%) | +10% ✅ |
| Overall examples | 136 | 136 | no change |
| Overall passing | 133/136 (98%) | 134/136 (99%) | +1% ✅ |
| API mismatches | 1 | 0 | -1 ✅ |

## Toyota Way Alignment

- **EXTREME TDD**: RED (confirm failure) → GREEN (fix syntax) → REFACTOR (verify)
- **Zero defects**: Fix incorrect API usage
- **Genchi Genbutsu**: Tested actual Ruchy operators - `**` works perfectly
- **Kaizen**: Small improvement toward 100% pass rate
- **Jidoka**: Quality gate enforcement (pre-commit)

## Files to Modify

1. `src/ch17-00-error-handling-robustness.md` - Replace `.powf()` with `**` (2 instances)

## Risks

**Low Risk**:
- Simple text replacement
- Feature fully works in Ruchy
- No logic changes required
- Quick verification via REPL

## Timeline

- **Ticket creation**: 2025-10-30
- **Phase 1 RED**: 2 minutes (verify failure and test operator)
- **Phase 2 GREEN**: 3 minutes (replace 2 instances)
- **Phase 3 REFACTOR**: 3 minutes (test and verify)
- **Documentation**: 2 minutes
- **Total**: 10 minutes

---

**Status**: IN PROGRESS
**Next Action**: Phase 1 RED - Verify powf failure and test ** operator
