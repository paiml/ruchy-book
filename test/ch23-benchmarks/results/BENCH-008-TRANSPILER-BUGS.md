# BENCH-008: Critical Transpiler Type Inference Bugs

**Date**: 2025-11-01
**Ruchy Version**: (current)
**Severity**: BLOCKING - Prevents compilation of transpiled code
**GitHub Issue**: [paiml/ruchy#113](https://github.com/paiml/ruchy/issues/113)

## Summary

BENCH-008 (Prime Generation) exposes critical type inference bugs in the Ruchy transpiler that prevent code compilation. The transpiler incorrectly infers types for:
1. Boolean return values → inferred as `i32`
2. Integer parameters → inferred as `&str`
3. Vector return types → inferred as `i32`

## Ruchy Source Code (Correct)

```ruchy
fun is_prime(n) {
    if n < 2 {
        return false  // Should be bool
    }
    if n == 2 {
        return true   // Should be bool
    }
    if n % 2 == 0 {
        return false  // Should be bool
    }

    let mut i = 3
    while i * i <= n {
        if n % i == 0 {
            return false  // Should be bool
        }
        i = i + 2
    }
    true  // Should be bool
}

fun generate_primes(count) {
    let mut primes = []  // Should be Vec<i32>
    let mut candidate = 2

    while primes.len() < count {  // count should be i32
        if is_prime(candidate) {
            primes.push(candidate)
        }
        candidate = candidate + 1
    }

    primes  // Should return Vec<i32>
}
```

## Transpiled Rust Code (INCORRECT)

```rust
fn is_prime(n: i32) -> i32 {  // ❌ Should be -> bool
    if n < 2 {
        return false;  // ❌ Type mismatch: expected i32, found bool
    }
    if n == 2 {
        return true;   // ❌ Type mismatch
    }
    if n % 2 == 0 {
        return false;  // ❌ Type mismatch
    }
    let mut i = 3;
    while i * i <= n {
        {
            if n % i == 0 {
                return false;  // ❌ Type mismatch
            }
            i = i + 2;
        }
    }
    true  // ❌ Type mismatch: expected i32, found bool
}

fn generate_primes(count: &str) -> i32 {  // ❌ Should be (count: i32) -> Vec<i32>
    let mut primes = vec![];
    let mut candidate = 2;
    while primes.len() < count {  // ❌ cannot compare usize with &str
        {
            if is_prime(candidate.clone()) {  // ❌ is_prime returns i32, expected bool
                primes.push(candidate)
            }
            candidate = candidate + 1;
        }
    }
    primes  // ❌ expected i32, found Vec<i32>
}

fn main() {
    let primes = generate_primes(10000);  // ❌ expected &str, found integer
}
```

## Compilation Errors

```
error[E0308]: mismatched types
 --> bench-008-primes.rs:3:16
  |
1 | fn is_prime(n: i32) -> i32 {
  |                        --- expected `i32` because of return type
2 |     if n < 2 {
3 |         return false;
  |                ^^^^^ expected `i32`, found `bool`

error[E0308]: mismatched types
  --> bench-008-primes.rs:25:26
   |
25 |     while primes.len() < count {
   |           ------------   ^^^^^ expected `usize`, found `&str`

error[E0308]: mismatched types
  --> bench-008-primes.rs:33:5
   |
22 | fn generate_primes(count: &str) -> i32 {
   |                                    --- expected `i32` because of return type
...
33 |     primes
   |     ^^^^^^ expected `i32`, found `Vec<i32>`
```

## Root Cause Analysis

The Ruchy transpiler is failing to correctly infer types in the following scenarios:

### Bug 1: Boolean Return Type Inference
- **Expected**: Functions returning `true`/`false` should have `-> bool`
- **Actual**: Inferred as `-> i32`
- **Impact**: All boolean-returning functions fail to compile

### Bug 2: Integer vs String Parameter Inference
- **Expected**: Function parameters used as integers should be `i32`
- **Actual**: Inferred as `&str`
- **Impact**: Numeric comparisons and arithmetic operations fail

### Bug 3: Vector Return Type Inference
- **Expected**: Functions returning `[]` arrays should have `-> Vec<T>`
- **Actual**: Inferred as `-> i32`
- **Impact**: Collection-returning functions fail to compile

## Impact on Benchmarking

- ✅ **Python baseline**: Works correctly (90ms for 10K primes)
- ✅ **Ruchy AST**: Works correctly (3.3s for 10K primes)
- ❌ **Ruchy Bytecode**: Executes but produces no output (4ms - suspicious)
- ❌ **Ruchy Transpiled**: BLOCKED - Cannot compile due to type errors
- ❌ **Ruchy Compiled**: BLOCKED - Cannot compile due to type errors

## Recommended Fixes

The Ruchy transpiler type inference engine needs to:

1. **Detect boolean literals** (`true`, `false`) and infer `bool` return type
2. **Analyze numeric operations** and infer `i32`/`i64` parameter types
3. **Detect array/vector usage** and infer `Vec<T>` return types
4. **Improve type propagation** through control flow (if/while/return)

## Workaround

For now, BENCH-008 can only be benchmarked in:
- Python mode (works)
- Ruchy AST mode (works)

Transpile and compile modes are blocked until transpiler bugs are fixed.

## Next Steps

1. File detailed bug report with Ruchy compiler team
2. Continue with other benchmarks that may not trigger these bugs
3. Revisit BENCH-008 transpile/compile modes after fixes
4. Document these limitations in Chapter 23

---

*This is excellent TDD! We discovered real bugs through comprehensive testing.*
