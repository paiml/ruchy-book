# TICKET-026: Remove std::env Vaporware (1 Failure → 0)

**Date**: 2025-10-30
**Priority**: HIGH (Impact: +1% pass rate to 99%/100%)
**Type**: Vaporware Removal / Rust Stdlib Not Available
**Status**: NOT STARTED
**Estimated Time**: 10 minutes
**Follows**: TICKET-025 (continuing to 100%)

## Problem

Ch15 example 2 fails with error: `Runtime error: Object has no field named 'env'`

The example uses `std::env::args()` from Rust standard library, which is not available in Ruchy.

**Error**:
```
Error: Evaluation error: Runtime error: Object has no field named 'env'
```

## Root Cause

The example attempts to access Rust's standard library directly:
```ruchy
let args = std::env::args();
```

**What doesn't work**:
- ❌ `std::env::args()` - Rust standard library not available
- ❌ `std::env::*` - No Rust stdlib access in Ruchy
- ❌ Command-line argument access (not implemented in v3.169.0)

**What works in Ruchy**:
- ✅ `ruchy compile` transpiles to Rust
- ✅ Rust code can use std::env after transpilation
- ❌ But Ruchy interpreter doesn't provide CLI args access

## Investigation Results

```bash
# std::env::args() doesn't work in Ruchy interpreter
$ echo 'std::env::args()' | ruchy
Error: Runtime error: Object has no field named 'env'

# std module exists but env doesn't
$ echo 'std' | ruchy
Error: Runtime error: Object has no field named 'env'

# No alternative API exists in Ruchy for CLI args
# This is a feature gap in the interpreter
```

**The problem**: Example documents a feature (CLI argument access) that doesn't exist in Ruchy interpreter.

## CLAUDE.md Violation

```markdown
1. **NEVER Document Unimplemented Features**: Zero tolerance for vaporware.
   If it doesn't compile in current `ruchy`, it doesn't go in the book.
```

This example doesn't work in Ruchy v3.169.0 interpreter.

## Impact

**Current State** (after TICKET-025):
- Total examples: 136
- Passing: 134 (99%)
- Failing: 2 (1%)

**After Fix**:
- Total examples: 135 (-1 removed)
- Passing: 134 (99.3%) **+0.3% improvement**
- Failing: 1 (0.7%)

## Solution (EXTREME TDD)

### Phase 1: TDD RED (Verify Failure)
```bash
# Confirm std::env failure exists
grep -n "std::env" src/ch15-00-binary-compilation-deployment.md

# Test actual behavior
echo 'std::env::args()' | ruchy
# Expected: Error - Object has no field named 'env'

# Verify no alternative exists
cat test/extracted-examples/failing.log | grep ch15
```

### Phase 2: TDD GREEN (Remove Vaporware)

Remove example 2 that uses std::env::args().

**File**: `src/ch15-00-binary-compilation-deployment.md`
**Lines**: ~57-95 (approximate)

**Section to Remove**: "Command-Line Tool Example"
```ruchy
fun main() {
    let args = std::env::args();  // ❌ Doesn't work

    if args.len() < 2 {
        println("Usage: calculator <expression>");
        return;
    }

    let expr = args[1];
    let result = evaluate_expression(expr);
    println("Result: {}", result);
}

fun evaluate_expression(expr: String) -> f64 {
    // Calculator implementation...
}
```

**Issue**: `std::env::args()` not available in Ruchy interpreter

**Action**: Remove entire "Command-Line Tool Example" section

### Phase 3: REFACTOR (Verify Fixes)
```bash
# Verify no std::env usage remains
! grep "std::env" src/ch15-00-binary-compilation-deployment.md

# Test updated chapter
deno task extract-examples | grep ch15

# Expected:
# - Ch15: 4 → 3 examples (1 removed)
# - Ch15: 3/3 passing (100%)
# - Overall: 135 examples, 134 passing (99.3%)
```

## Detailed Changes

### Ch15 Example 2: Remove CLI Args Example
**File**: `src/ch15-00-binary-compilation-deployment.md`
**Lines**: ~57-95 (approximate)
**Section**: "Command-Line Tool Example"

**Removed Code**:
```ruchy
fun main() {
    let args = std::env::args();  // Doesn't work
    // ... rest of example
}
```

**Reason**: Rust standard library not accessible in Ruchy interpreter

## Acceptance Criteria

- [ ] std::env example removed
- [ ] No "std::env" strings in ch15
- [ ] Ch15: 3/3 passing (was 3/4)
- [ ] Overall: 135 examples, 134 passing (99.3%)
- [ ] Book builds successfully
- [ ] Pre-commit hooks pass

## Why Remove vs Fix?

**Considered**: Show how it works after `ruchy compile`

**Rejected because**:
1. The example only works AFTER transpilation to Rust
2. Cannot test it with `ruchy run` or REPL
3. Violates "test-first" principle - can't verify it works
4. Chapter is about compilation but examples must work in interpreter
5. No alternative Ruchy API exists for CLI args

**Better approach**:
- Remove example that can't be tested
- Document limitation clearly in chapter text
- When Ruchy adds CLI args API, add example back

## Future Enhancement

When Ruchy implements CLI argument access, could add example like:
```ruchy
fun main() {
    let args = ruchy::args();  // Future Ruchy API
    // ... rest of implementation
}
```

But for now, this doesn't exist.

## Success Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Ch15 examples | 4 | 3 | -1 |
| Ch15 passing | 3/4 (75%) | 3/3 (100%) | +25% ✅ |
| Overall examples | 136 | 135 | -1 |
| Overall passing | 134/136 (99%) | 134/135 (99.3%) | +0.3% ✅ |
| std::env vaporware | 1 | 0 | -1 ✅ |

## Toyota Way Alignment

- **EXTREME TDD**: RED (confirm failure) → GREEN (remove vaporware) → REFACTOR (verify)
- **Zero defects**: Remove untestable examples
- **Genchi Genbutsu**: Only document what actually works in Ruchy
- **Kaizen**: Continuing vaporware elimination (5th iteration)
- **Jidoka**: Quality gate enforcement (pre-commit)

## Files to Modify

1. `src/ch15-00-binary-compilation-deployment.md` - Remove CLI args example

## Risks

**Low Risk**:
- Following proven vaporware removal pattern
- Chapter still has 3 working examples
- No logic changes, only removing non-working example
- Clear evidence that std::env doesn't work

**Note for Ruchy Team**:
- This reveals missing feature: CLI argument access in interpreter
- Consider adding `ruchy::args()` or similar API
- Would enable CLI tool examples to work in interpreter

## Timeline

- **Ticket creation**: 2025-10-30
- **Phase 1 RED**: 2 minutes (verify failure)
- **Phase 2 GREEN**: 5 minutes (remove 1 section)
- **Phase 3 REFACTOR**: 2 minutes (test and verify)
- **Documentation**: 1 minute
- **Total**: 10 minutes

---

**Status**: NOT STARTED
**Next Action**: Wait for TICKET-025 completion
**Depends On**: TICKET-025 (execute in sequence)
