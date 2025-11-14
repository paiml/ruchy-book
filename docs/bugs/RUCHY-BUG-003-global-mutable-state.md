# RUCHY-BUG-003: Global Mutable State Does Not Persist Across Function Calls

**Filed**: 2025-11-02
**Ruchy Version**: v3.193.0
**Platform**: Linux 6.8.0-85-generic
**Severity**: High
**Status**: Open
**Related**: Issue #119 (global let mut syntax) - PARTIALLY RESOLVED

## Description

Global mutable variables (`let mut`) are now syntactically supported (Issue #119 resolved), but their state does NOT persist across function calls. Each access to a global mutable variable returns its initial value, making stateful global variables non-functional.

## Reproduction Steps

### Test Case 1: Simple Counter
```bash
cat > test_global_mut.ruchy << 'EOF'
let mut global_counter = 0

fun increment() {
    global_counter = global_counter + 1
    global_counter
}

fun main() {
    println(increment())  // Should print 1
    println(increment())  // Should print 2
    println(increment())  // Should print 3
    println(global_counter)  // Should print 3
}

main()
EOF

ruchy run test_global_mut.ruchy
```

### Test Case 2: BENCH-002 Matrix Multiplication
```bash
cd test/ch21-benchmarks
ruchy run bench-002-matrix-multiply.ruchy
```

## Expected vs Actual Behavior

### Test Case 1 Expected:
```
1
2
3
3
```

### Test Case 1 Actual:
```
1
1
1
0
```

**Analysis**: Each `increment()` call prints `1` (not 1, 2, 3), and `global_counter` remains `0` (not 3).

### Test Case 2 Expected:
```
248683.505429
```

### Test Case 2 Actual:
```
0.00003304627079793454
```

**Analysis**: The LCG random number generator state (`lcg_state`) resets on each access, producing incorrect matrix values.

## Root Cause Analysis

Global mutable variables are:
- ✅ **Syntactically valid** (Issue #119 resolved)
- ❌ **Semantically broken** - state does NOT persist across function boundaries

Hypothesis: Global mutable variables may be:
1. Re-initialized on each function call
2. Not sharing state between function scopes
3. Resetting to initial value on each read

## Impact on Book Examples

### Blocked Benchmarks:
- **BENCH-002**: Matrix multiplication - produces incorrect output due to broken RNG state
- **Potentially others**: Any benchmark requiring stateful global variables

### Working Workarounds:
- Pass mutable state as function parameters (not global)
- Use function-local mutable variables only
- Avoid global `let mut` entirely until fixed

## Verification Script

```bash
#!/usr/bin/env bashrs
# File: verify-bug-003.sh

echo "=== Testing Bug #003: Global Mutable State ==="
echo ""

echo "Test 1: Simple counter (expect: 1,2,3,3 | actual: 1,1,1,0)"
cat > /tmp/test_counter.ruchy << 'EOF'
let mut counter = 0

fun inc() {
    counter = counter + 1
    counter
}

fun main() {
    println(inc())
    println(inc())
    println(inc())
    println(counter)
}

main()
EOF

echo "Output:"
ruchy run /tmp/test_counter.ruchy
echo ""

echo "Test 2: BENCH-002 checksum (expect: 248683.505429 | actual: wrong)"
cd test/ch21-benchmarks 2>/dev/null || { echo "ERROR: Not in ruchy-book directory"; exit 1; }
echo "Output:"
ruchy run bench-002-matrix-multiply.ruchy

echo ""
echo "=== Bug #003 Status: CONFIRMED ==="
```

## Workaround for BENCH-002

Replace global mutable LCG state with encapsulated generator:

```ruchy
// WORKAROUND: Use closure to encapsulate state (if closures support mutable captures)
fun create_lcg_generator(seed) {
    let mut state = seed

    fun next() {
        state = (state * 1103515245 + 12345) % 2147483648
        state / 2147483648.0
    }

    next
}

// Usage:
let rng = create_lcg_generator(42)
let value = rng()  // Get next random value
```

**Status**: Workaround NOT YET TESTED (may also be affected by mutable capture issues)

## Related GitHub Issues

- **Issue #119**: Global `let mut` syntax support - RESOLVED (syntax works)
- **Bug #003** (this bug): Global mutable state persistence - OPEN (semantics broken)

## Next Steps

1. File GitHub issue with this bug report
2. Update BENCH-002 status: "⚠️ Blocked (Bug #003 - global mutable state)"
3. Document this limitation in relevant chapters
4. Test closure workaround viability
5. Consider avoiding global mutable state in all book examples until fixed

## Toyota Way Analysis (Five Whys)

**Why does BENCH-002 produce wrong output?**
→ Because the LCG random state doesn't persist across calls

**Why doesn't the random state persist?**
→ Because global mutable variables reset to initial values

**Why do global mutable variables reset?**
→ Because the interpreter doesn't maintain global mutable state correctly

**Why doesn't the interpreter maintain state?**
→ [ROOT CAUSE] Implementation of global mutable variables is incomplete

**Why is implementation incomplete?**
→ Issue #119 only addressed syntax parsing, not semantic execution

**Prevention**: All global mutable variable examples MUST be tested end-to-end before documenting as working features.
