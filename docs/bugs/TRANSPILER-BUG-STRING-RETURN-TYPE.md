# Transpiler Bug: Return Type Inference Failure (Multiple Types)

**Filed**: 2025-11-02
**Ruchy Version**: v3.193.0
**Platform**: Linux 6.8.0-85-generic (AMD Ryzen Threadripper 7960X)
**Severity**: High
**Status**: Open - BLOCKING BENCH-003 + BENCH-008
**GitHub Issue**: https://github.com/paiml/ruchy/issues/114
**Impact**: Blocks benchmarks in transpile/compile modes - affects String, bool, Vec return types

---

## Description

The Ruchy transpiler incorrectly infers return types for functions, causing the generated Rust code to fail compilation. This affects multiple types:

- **String returns**: Incorrectly inferred as `i32`
- **bool returns**: Incorrectly inferred as `i32`
- **Vec returns**: Incorrectly inferred as `i32`

**Expected Behavior**: Functions should have return types matching their actual return expressions

**Actual Behavior**: Functions often get incorrectly typed as `-> i32` regardless of what they return

---

## Reproduction Steps

### Case 1: String Return Type (BENCH-003)

#### 1. Create Test File
```bash
cat > test-string-return.ruchy << 'EOF'
fun string_concatenation(iterations) {
    let mut result = ""
    let mut i = 0

    while i < iterations {
        result = result + "x"
        i = i + 1
    }

    result  // Returns String
}

fun main() {
    let iterations = 10
    let result = string_concatenation(iterations)
}
EOF
```

### 2. Transpile to Rust
```bash
ruchy transpile test-string-return.ruchy > generated.rs
```

### 3. Observe Generated Code
```rust
fn string_concatenation(iterations: i32) -> i32 {  // ❌ WRONG: Should be -> String
    let mut result = String::from("");
    let mut i = 0;
    while i < iterations {
        {
            result = format!("{}{}", result, "x");
            i = i + 1;
        }
    }
    result  // Type error: expected i32, found String
}
```

### 4. Attempt Compilation
```bash
rustc generated.rs
```

**Error Output**:
```
error[E0308]: mismatched types
  --> generated.rs:10:5
   |
 1 | fn string_concatenation(iterations: i32) -> i32 {
   |                                             --- expected `i32` because of return type
...
10 |     result
   |     ^^^^^^ expected `i32`, found `String`

error: aborting due to 1 previous error
```

---

### Case 2: bool and Vec Return Types (BENCH-008)

#### 1. Create Test File
```bash
cat > test-primes.ruchy << 'EOF'
fun is_prime(n) {
    if n < 2 { return false }
    if n == 2 { return true }
    if n % 2 == 0 { return false }

    let mut i = 3
    while i * i <= n {
        if n % i == 0 { return false }
        i = i + 2
    }
    true  // Returns bool
}

fun generate_primes(count) {
    let mut primes = []
    let mut candidate = 2

    while primes.len() < count {
        if is_prime(candidate) {
            primes.push(candidate)
        }
        candidate = candidate + 1
    }

    primes  // Returns Vec
}

fun main() {
    let primes = generate_primes(10)
}
EOF
```

#### 2. Transpile to Rust
```bash
ruchy transpile test-primes.ruchy > generated-primes.rs
```

#### 3. Observe Generated Code
```rust
fn is_prime(n: i32) -> i32 {  // ❌ WRONG: Should be -> bool
    if n < 2 {
        return false;  // Type error: expected i32, found bool
    }
    // ... more type errors
    true  // Type error: expected i32, found bool
}

fn generate_primes(count: &str) -> i32 {  // ❌ WRONG: Should be (i32) -> Vec<i32>
    let mut primes = vec![];
    // ...
    primes  // Type error: expected i32, found Vec
}
```

#### 4. Attempt Compilation
```bash
rustc generated-primes.rs
```

**Error Output**:
```
error[E0308]: mismatched types
 --> generated-primes.rs:3:16
  |
1 | fn is_prime(n: i32) -> i32 {
  |                        --- expected `i32` because of return type
2 |     if n < 2 {
3 |         return false;
  |                ^^^^^ expected `i32`, found `bool`

error[E0308]: mismatched types
  --> generated-primes.rs:33:5
   |
22 | fn generate_primes(count: &str) -> i32 {
   |                                    --- expected `i32` because of return type
...
33 |     primes
   |     ^^^^^^ expected `i32`, found `Vec<i32>`

error: aborting due to 2 previous errors
```

---

## Root Cause Analysis

The type inference engine appears to:
1. Correctly identify the parameter type as `i32` (from integer literal)
2. **Incorrectly** propagate this to the return type
3. Fail to infer return type from the actual return expression (`result: String`)

**Hypothesis**: Type inference may be using the first encountered type (`i32` from parameter) instead of analyzing the return expression.

---

## Impact on Book Testing

### Blocked Benchmarks
- **BENCH-003**: String concatenation (10K operations)
  - AST mode: ✅ Works
  - Bytecode mode: ✅ Works
  - Transpile mode: ❌ **BLOCKED** by this bug (String return)
  - Compile mode: ❌ **BLOCKED** by this bug (String return)

- **BENCH-008**: Prime generation (first 10K primes)
  - AST mode: ✅ Works
  - Bytecode mode: ✅ Works
  - Transpile mode: ❌ **BLOCKED** by this bug (bool + Vec returns)
  - Compile mode: ❌ **BLOCKED** by this bug (bool + Vec returns)

### Current Workaround
**None available** - The transpiler must be fixed to properly infer String return types.

### Test Results Without Fix
```json
{
  "benchmark": "BENCH-003",
  "modes": {
    "python": { "mean_ms": 16.75 },
    "julia": { "mean_ms": 1.30 },
    "go": { "mean_ms": 2.25 },
    "rust": { "mean_ms": 1.84 },
    "ruchy-ast": { "mean_ms": 14.22 },
    "ruchy-bytecode": { "mean_ms": 3.58 },
    "ruchy-transpiled": "ERROR - transpiler bug",
    "ruchy-compiled": "ERROR - transpiler bug"
  }
}
```

---

## Proposed Fix

### Option 1: Improve Type Inference
Update the type inference engine to:
1. Analyze the return expression type
2. Use that as the primary source for function return type
3. Only fall back to parameter types if return is ambiguous

### Option 2: Require Type Annotations (Breaking Change)
Require explicit return type annotations for functions:
```ruchy
fun string_concatenation(iterations: Int) -> String {
    // ...
}
```

**Recommendation**: Option 1 (fix inference) to maintain Ruchy's ergonomic design goals.

---

## Test Cases for Validation

Once fixed, these should all compile successfully:

### Test 1: String Return
```ruchy
fun returns_string() {
    "hello"  // Should infer -> String
}
```

### Test 2: Int Return
```ruchy
fun returns_int() {
    42  // Should infer -> i32
}
```

### Test 3: String Concatenation
```ruchy
fun concat(n) {
    let mut s = ""
    let mut i = 0
    while i < n {
        s = s + "x"
        i = i + 1
    }
    s  // Should infer -> String
}
```

### Test 4: Mixed Types
```ruchy
fun mixed(flag) {
    let s = "hello"
    let n = 42
    s  // Should infer -> String (not i32 from earlier binding)
}
```

---

## Related Issues

- **Type Inference**: General type system improvements needed
- **BENCH-008**: Similar issues may exist with array/vector return types
- **Documentation**: Chapter 21 benchmarks incomplete until resolved

---

## Verification Steps (After Fix)

```bash
# 1. Transpile test case
ruchy transpile test-string-return.ruchy > generated.rs

# 2. Verify correct return type
grep "fn string_concatenation" generated.rs
# Expected: fn string_concatenation(iterations: i32) -> String

# 3. Compile successfully
rustc -O generated.rs -o test-output

# 4. Run and verify
./test-output
# Should complete without errors

# 5. Complete BENCH-003
cd test/ch21-benchmarks
./run-bench-003-full.sh
# Should generate complete JSON with all 9 modes
```

---

## Priority Justification

**Priority: High** because:
1. Blocks critical benchmark testing (2 of 9 execution modes)
2. Fundamental type system issue (affects many use cases beyond benchmarks)
3. Breaks "Rust-level performance" narrative (can't test transpiled mode)
4. No workaround available (requires transpiler fix)

---

## GitHub Issue Template

```markdown
**Title**: Transpiler generates wrong return type for String-returning functions

**Labels**: bug, transpiler, type-inference, priority-high

**Description**:
The Ruchy transpiler incorrectly infers the return type of functions that return String as `i32`, causing compilation failures in the generated Rust code.

**Steps to Reproduce**:
[See full details above]

**Expected**: `fn name(...) -> String`
**Actual**: `fn name(...) -> i32`

**Impact**: Blocks benchmark testing and real-world usage of transpile/compile modes for string operations.

**Version**: ruchy 3.171.0
**Platform**: Linux
```

---

## Temporary Status for Benchmarks

Until fixed, BENCH-003 results will be reported as:
- ✅ 7 modes complete (Python, Deno, Julia, Go, Rust, Ruchy AST, Ruchy Bytecode)
- ⏳ 2 modes blocked (Ruchy Transpiled, Ruchy Compiled) - waiting on transpiler fix

**Geometric mean calculation**: Will exclude transpiled/compiled modes until bug is resolved.
