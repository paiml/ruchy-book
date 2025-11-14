# [BUG] Critical Variable Scoping Regression in v3.193.0 - Top-level statements broken

## Bug Description
Variable scoping is completely broken for top-level (script-style) code in v3.193.0. Each `let` statement gets wrapped in its own block scope, making variables inaccessible to subsequent statements. This represents a **52% failure rate** in the Ruchy Book test suite.

## Version Information
- **Affected Version**: 3.45.0
- **Last Working Version**: 3.38.0
- **Regression**: Yes
- **Severity**: 🔴 CRITICAL

## Minimal Reproduction

```bash
# This FAILS in v3.193.0
echo 'let x = 42; let y = x * 2; println(y)' > test.ruchy
ruchy compile test.ruchy

# Error: cannot find value `x` in this scope
```

## Expected vs Actual

**Expected**: Variables should be accessible across statements
```rust
fn main() {
    let x = 42i32;
    let y = x * 2i32;
    println!("{:?}", y);
}
```

**Actual**: Each statement is isolated
```rust
fn main() {
    { let x = 42i32; () };     // x trapped here!
    { let y = x * 2i32; () };  // x not accessible!
    println!("{:?}", y);       // y not accessible!
}
```

## Important Discovery

The bug ONLY affects top-level code. This works:
```ruchy
fun main() {
    let x = 42;
    let y = x * 2;
    println(y)  // ✅ Works fine
}
```

But this fails:
```ruchy
let x = 42;
let y = x * 2;
println(y)  // ❌ Variables not in scope
```

## Impact Analysis

| Test Suite | v3.193.0 | v3.193.0 | Regression |
|------------|---------|---------|------------|
| Book Examples | 82/111 (74%) | 53/111 (48%) | -26% |
| One-liners | 9/20 (45%) | 9/20 (45%) | No change |
| Chapter 2 (Variables) | 8/8 (100%) | 4/8 (50%) | -50% |
| Chapter 5 (Control Flow) | 11/17 (65%) | 5/17 (29%) | -36% |

## Root Cause
The regression appears to be introduced by commit `2e4842c5` - [LANG-003] Type Annotation Implementation. The transpiler's statement handling was modified, inadvertently adding scope wrapping.

## Test Script

Save this as `test_scoping.sh`:

```bash
#!/bin/bash
echo "Testing Ruchy v$(ruchy --version) scoping..."

# Test 1: Basic (SHOULD PASS)
echo 'let x = 42; println(x)' > test.ruchy
if ruchy compile test.ruchy 2>/dev/null; then
    echo "✅ Basic variable: PASS"
else
    echo "❌ Basic variable: FAIL"
fi

# Test 2: Dependency (SHOULD PASS)
echo 'let x = 42; let y = x * 2; println(y)' > test.ruchy
if ruchy compile test.ruchy 2>/dev/null; then
    echo "✅ Variable dependency: PASS"
else
    echo "❌ Variable dependency: FAIL"
fi

# Test 3: In Function (SHOULD PASS)
echo 'fun main() { let x = 42; println(x) }' > test.ruchy
if ruchy compile test.ruchy 2>/dev/null; then
    echo "✅ Function scoping: PASS"
else
    echo "❌ Function scoping: FAIL"
fi

rm -f test.ruchy a.out
```

## Current Results
```
❌ Basic variable: FAIL
❌ Variable dependency: FAIL
✅ Function scoping: PASS
```

## Recommendation
1. **URGENT**: Fix transpiler to not wrap statements in block scopes
2. Add regression tests for top-level variable scoping
3. Consider if top-level code should auto-wrap in `main()` function

## Additional Issues Found

### Async/Await Not Configured
```
error[E0670]: `async fn` is not permitted in Rust 2015
```
Need to add `--edition 2021` flag to rustc invocation.

## References
- Full analysis: [CRITICAL-v3.193.0-scoping-regression.md](https://github.com/paiml/ruchy-book/blob/main/docs/bugs/CRITICAL-v3.193.0-scoping-regression.md)
- Test Suite: https://github.com/paiml/ruchy-book
- Previous similar bug in v3.193.0 (fixed in v3.193.0, regressed in v3.193.0)