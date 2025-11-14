# Bug Report: --trace Flag Doesn't Show Output, RUCHY_TRACE Does

**Filed**: 2025-10-30
**Ruchy Version**: v3.193.0
**Platform**: Linux 6.8.0-85-generic
**Severity**: Medium (workaround available)
**Status**: Documented (Related to TICKET-019)
**Parent**: ruchy-v3.193.0-eval-flag-bug.md

## Description

The `--trace` flag and `RUCHY_TRACE` environment variable have inconsistent behavior. RUCHY_TRACE works correctly with stdin piping, but --trace flag does NOT show TRACE output.

## Reproduction Steps

### Test 1: --trace flag with stdin (FAILS to show TRACE)
```bash
echo "fun square(x) { x * x }; square(5)" | ruchy --trace
# Expected: TRACE output + result
# Actual: 25 (no TRACE output)
```

### Test 2: RUCHY_TRACE with stdin (WORKS)
```bash
echo "fun square(x) { x * x }; square(5)" | RUCHY_TRACE=1 ruchy
# Expected: TRACE output + result
# Actual:
# TRACE: → square(5: integer)
# TRACE: ← square = 25: integer
# 25
# ✅ WORKS CORRECTLY!
```

### Test 3: --trace with -e flag (FAILS completely)
```bash
ruchy --trace -e "fun square(x) { x * x }; square(5)"
# Expected: TRACE output + result
# Actual: (no output at all)
# ❌ Broken by TICKET-019 issue
```

## Expected vs Actual

**Expected Behavior**:
All three methods should produce identical output:
```
TRACE: → square(5: integer)
TRACE: ← square = 25: integer
25
```

**Actual Behavior**:
- `--trace` flag: Only shows `25` (no TRACE lines)
- `RUCHY_TRACE=1`: Shows complete TRACE output ✅
- `--trace -e`: No output at all (TICKET-019 bug)

## Impact

- **Documentation**: Chapter 13 examples show `--trace -e` which is broken
- **User Experience**: Users trying `--trace` flag won't see debugging output
- **Workaround**: Use `RUCHY_TRACE=1` environment variable instead

## Workaround

**WORKING Method**:
```bash
# Use RUCHY_TRACE environment variable with stdin piping
echo "EXPR" | RUCHY_TRACE=1 ruchy
```

**Example**:
```bash
echo "fun factorial(n) { if n <= 1 { 1 } else { n * factorial(n - 1) } }; factorial(5)" | RUCHY_TRACE=1 ruchy

# Output:
# TRACE: → factorial(5: integer)
# TRACE: → factorial(4: integer)
# TRACE: → factorial(3: integer)
# TRACE: → factorial(2: integer)
# TRACE: → factorial(1: integer)
# TRACE: ← factorial = 1: integer
# TRACE: ← factorial = 2: integer
# TRACE: ← factorial = 6: integer
# TRACE: ← factorial = 24: integer
# TRACE: ← factorial = 120: integer
# 120
```

## Investigation

### Hypothesis
1. `--trace` flag may only enable tracing for compiled/transpiled mode
2. RUCHY_TRACE may be the intended way to enable tracing in REPL mode
3. Flag precedence issue: --trace may be getting overridden

### Test Evidence
```bash
# Test with both flag AND environment variable
echo "fun add(a, b) { a + b }; add(3, 4)" | RUCHY_TRACE=1 ruchy --trace
# Result: Shows TRACE output (environment variable works)
```

## Documentation Issues

**Chapter 13** (`src/ch13-00-debugging-tracing-tdd.md`) shows examples using:
```bash
$ ruchy --trace -e 'EXPR'
```

This is **DOUBLY BROKEN**:
1. `-e` flag produces no output (TICKET-019)
2. `--trace` flag doesn't show TRACE output

**Correction Needed**:
All examples should use:
```bash
$ echo 'EXPR' | RUCHY_TRACE=1 ruchy
```

## Resolution

**TICKET-020 Phase 2 Actions**:
1. ✅ Document --trace flag inconsistency
2. ✅ Identify RUCHY_TRACE as working method
3. ⏭️ Update Chapter 13 examples to use RUCHY_TRACE=1
4. ⏭️ Update test infrastructure to use RUCHY_TRACE=1
5. ⏭️ Test all 129 working examples with RUCHY_TRACE=1

## Recommendations for Ruchy Team

1. Make `--trace` flag work consistently with REPL mode
2. Document RUCHY_TRACE as primary way to enable tracing
3. Either fix or deprecate `-e` flag (currently broken)
4. Add integration tests for flag behavior

## Links

- TICKET-019: One-Liner Test Infrastructure Fix
- TICKET-020: Debugging Tools Mandatory
- docs/bugs/ruchy-v3.193.0-eval-flag-bug.md
- src/ch13-00-debugging-tracing-tdd.md (needs updates)

## Toyota Way Analysis (5 Whys)

**WHY #1**: Why doesn't --trace show output?
- Flag may not enable tracing in REPL interpreter mode

**WHY #2**: Why does RUCHY_TRACE work?
- Environment variable checked directly by interpreter

**WHY #3**: Why are there two methods?
- Historical: flag for compiled mode, env var for REPL mode

**WHY #4**: Why wasn't this caught?
- No tests comparing --trace vs RUCHY_TRACE behavior

**WHY #5**: Why do we have inconsistent interfaces?
- Flag and environment variable implemented separately without coordination

**Root Cause**: Lack of unified tracing interface design and testing
