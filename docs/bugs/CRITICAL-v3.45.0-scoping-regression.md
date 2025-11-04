# 🚨 CRITICAL BUG: Variable Scoping Regression in v3.193.0

**Issue Title**: [CRITICAL] Variable scoping completely broken in v3.193.0 - 52% of examples fail

**Severity**: 🔴 CRITICAL - Blocks basic functionality
**Version Affected**: v3.193.0
**Version Working**: v3.193.0
**Regression**: Yes - Previously fixed bug has returned
**Impact**: 52% of Ruchy Book examples now fail (58/111)

## Executive Summary

Ruchy v3.193.0 has reintroduced a critical variable scoping bug that was previously fixed. The transpiler now wraps each statement in its own block scope, making variables inaccessible across statements. This breaks even the most basic multi-statement programs and represents a 26% regression in compatibility.

## Environment

- **OS**: Linux 6.8.0-79-generic x86_64
- **Ruchy Version**: 3.45.0 (git commit: b111c583)
- **Previous Working Version**: 3.38.0
- **Test Date**: 2025-09-24
- **Test Suite**: Ruchy Book comprehensive test suite (111 examples)

## Bug Description

The transpiler incorrectly wraps each `let` statement in its own block scope `{ }`, making variables inaccessible to subsequent statements. This specifically affects **top-level statements outside of function definitions**. The bug manifests when:
- Sequential variable assignments at top level
- Variables used in calculations without function wrapper
- Variables passed to print statements in script-style code
- Any multi-statement program logic not wrapped in `fun main()`

**Important**: The bug does NOT occur when code is properly wrapped in a function. This explains why some examples pass while others fail.

## Reproduction Steps

### Minimal Reproducible Example

```bash
# Create a simple multi-statement program
echo 'let x = 42; let y = x * 2; println(y)' > test.ruchy

# Attempt to compile
ruchy compile test.ruchy
```

### Expected Behavior
Should compile successfully and when run, print: `84`

### Actual Behavior
```
✗ Compilation failed: Compilation failed:
error[E0425]: cannot find value `x` in this scope
 --> /tmp/.tmpEHJZY1/main.rs:1:49
  |
1 | fn main () { { let x = 42i32 ; () } ; { let y = x * 2i32 ; () } ; println ! ("{:?}" , y) ; }
  |                                                 ^
  |
help: the binding `x` is available in a different scope in the same function
 --> /tmp/.tmpEHJZY1/main.rs:1:20
  |
1 | fn main () { { let x = 42i32 ; () } ; { let y = x * 2i32 ; () } ; println ! ("{:?}" , y) ; }
  |                    ^

error[E0425]: cannot find value `y` in this scope
 --> /tmp/.tmpEHJZY1/main.rs:1:87
  |
1 | fn main () { { let x = 42i32 ; () } ; { let y = x * 2i32 ; () } ; println ! ("{:?}" , y) ; }
  |                                                                                       ^
```

## Root Cause Analysis

### Transpiler Output Comparison

**v3.193.0 (Working):**
```rust
fn main() {
    let x = 42i32;
    let y = x * 2i32;
    println!("{:?}", y);
}
```

**v3.193.0 (Broken):**
```rust
fn main() {
    { let x = 42i32; () };     // x is trapped in this scope!
    { let y = x * 2i32; () };  // x is not accessible here!
    println!("{:?}", y);       // y is not accessible here!
}
```

Each statement is wrapped in `{ ... ; () }` creating isolated scopes.

## Clarification: Works in Functions, Fails at Top Level

### Working Example (Inside Function)
```ruchy
fun main() {
    let x = 42;
    let y = x * 2;
    println(y)
}
```
**Result**: ✅ COMPILES AND RUNS CORRECTLY

### Failing Example (Top Level / Script Style)
```ruchy
let x = 42;
let y = x * 2;
println(y)
```
**Result**: ❌ FAILS - Variables trapped in separate scopes

This distinction is critical because many book examples use the script-style format for simplicity, which is why they fail in v3.193.0.

## Additional Test Cases

### Test Case 1: Simple Variable with Type Annotation
```ruchy
fun main() {
    let x: i32 = 42;
    println(x)
}
```
**Result**: ❌ FAILS - Same scoping issue

### Test Case 2: Multiple Variables
```ruchy
fun main() {
    let a = 10;
    let b = 20;
    let c = a + b;
    println(c)
}
```
**Result**: ❌ FAILS - Variables a and b not accessible for c

### Test Case 3: Variable in Control Flow
```ruchy
fun main() {
    let x = 5;
    if x > 3 {
        println("x is greater than 3")
    }
}
```
**Result**: ❌ FAILS - x not accessible in if condition

### Test Case 4: For Loop with External Variable
```ruchy
fun main() {
    let limit = 5;
    for i in 0..limit {
        println(i)
    }
}
```
**Result**: ❌ FAILS - limit not accessible in range expression

## Impact Analysis

### Ruchy Book Test Results

| Chapter | v3.193.0 | v3.193.0 | Impact |
|---------|---------|---------|--------|
| Ch01: Hello World | 14/14 (100%) | 13/14 (93%) | -1 example |
| Ch02: Variables & Types | 8/8 (100%) | 4/8 (50%) | -50% regression |
| Ch03: Functions | 9/11 (82%) | 9/11 (82%) | No change |
| Ch04: Practical Patterns | 5/10 (50%) | 1/10 (10%) | -40% regression |
| Ch05: Control Flow | 11/17 (65%) | 5/17 (29%) | -36% regression |
| Ch06: Data Structures | 8/8 (100%) | 5/8 (63%) | -37% regression |
| Ch10: Input/Output | 10/10 (100%) | 7/10 (70%) | -30% regression |
| Ch17: Error Handling | 5/11 (45%) | 0/11 (0%) | Complete failure |
| **TOTAL** | **82/111 (74%)** | **53/111 (48%)** | **-26% regression** |

### Categories of Failures

1. **Variable Declaration & Usage** (100% failure rate)
   - Any program with `let x = value; use(x)`

2. **Multi-step Calculations** (100% failure rate)
   - Any program with dependent calculations

3. **Variable-based Control Flow** (100% failure rate)
   - If statements, loops using external variables

4. **I/O with Variables** (70% failure rate)
   - Reading input and using it later

## Related Issues

### Async/Await Also Broken
The async/await implementation also has issues (missing Rust 2018+ edition):
```
error[E0670]: `async fn` is not permitted in Rust 2015
error[E0609]: no field `await` on type `impl Future<Output = i32>`
```

## Suspected Cause

Based on git history, the regression appears to be introduced by:
- Commit: `2e4842c5` - [LANG-003] EXTREME TDD Type Annotation Implementation Complete

The type annotation feature implementation likely modified the transpiler's statement handling, inadvertently adding scope wrapping to all statements.

## Workaround

**None available**. This is a fundamental transpiler issue that breaks basic language functionality.

## Recommendations

1. **URGENT**: Revert or fix the statement scoping in the transpiler
2. **Add regression test**: The test suite should include multi-statement variable usage
3. **Consider**: Adding integration tests that compile and run actual programs
4. **Edition flag**: Add Rust 2018+ edition flag for async/await support

## Test Script for Verification

```bash
#!/bin/bash
# Save as test_scoping.sh

echo "Testing Ruchy v$(ruchy --version) variable scoping..."

# Test 1: Basic variable usage
echo 'let x = 42; println(x)' > test1.ruchy
if ruchy compile test1.ruchy 2>/dev/null; then
    echo "✅ Test 1: Basic variable - PASS"
else
    echo "❌ Test 1: Basic variable - FAIL"
fi

# Test 2: Variable dependency
echo 'let x = 42; let y = x * 2; println(y)' > test2.ruchy
if ruchy compile test2.ruchy 2>/dev/null; then
    echo "✅ Test 2: Variable dependency - PASS"
else
    echo "❌ Test 2: Variable dependency - FAIL"
fi

# Test 3: Multiple variables
echo 'let a = 1; let b = 2; let c = a + b; println(c)' > test3.ruchy
if ruchy compile test3.ruchy 2>/dev/null; then
    echo "✅ Test 3: Multiple variables - PASS"
else
    echo "❌ Test 3: Multiple variables - FAIL"
fi

# Test 4: Variable in control flow
echo 'let x = 5; if x > 3 { println("ok") }' > test4.ruchy
if ruchy compile test4.ruchy 2>/dev/null; then
    echo "✅ Test 4: Variable in control flow - PASS"
else
    echo "❌ Test 4: Variable in control flow - FAIL"
fi

# Clean up
rm -f test*.ruchy a.out
```

## Expected Timeline

This is a **CRITICAL** regression that makes Ruchy unusable for any non-trivial program. It should be treated as a P0 release blocker.

## References

- Previous similar bug: [CRITICAL-v3.193.0-transpiler-bugs.md](https://github.com/paiml/ruchy-book/blob/main/docs/bugs/CRITICAL-v3.193.0-transpiler-bugs.md)
- Ruchy Book Repository: https://github.com/paiml/ruchy-book
- Test Suite Results: 53/111 passing (48%) vs 82/111 (74%) in v3.193.0

---

**Reported by**: Ruchy Book Test Suite
**Contact**: [Book maintainers]
**Test Coverage**: Comprehensive test of 111 book examples + 20 one-liners

## Appendix: Full Transpiler Debug Output

When compiling `let x = 42; let y = x * 2; println(y)` with DEBUG output:

```
→ Compiling test.ruchy...
DEBUG: About to call transpile_to_program
DEBUG: transpile_to_program completed
Generated Rust code:
fn main () { { let x = 42i32 ; () } ; { let y = x * 2i32 ; () } ; println ! ("{:?}" , y) ; }
```

Note the extra `{ }` blocks and `()` unit expressions that create the isolated scopes.