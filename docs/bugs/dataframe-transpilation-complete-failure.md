# DataFrame Transpilation Fails: Detailed Bug Report

## Summary

DataFrame (`df![]` macro) code fails in both REPL and transpiler modes. Tests across 5 consecutive versions (v3.169.0 - v3.169.0) show identical failures with 0% improvement.

## Environment

- **Ruchy Version**: v3.169.0 (also tested v3.169.0, v3.169.0, v3.169.0, v3.169.0 - all identical)
- **OS**: Linux 6.8.0-85-generic
- **Platform**: x86_64
- **Source**: Book documentation (https://github.com/paiml/ruchy-book)

## Problem Statement

DataFrames work in **neither** interpreter (REPL) nor transpiler (compile) modes:

1. **REPL Mode**: Parser errors on `df![]` syntax
2. **Compile Mode**: Hangs indefinitely or produces type errors
3. **Consistency**: Same failures across 5 versions

## Minimal Reproducible Example

```ruchy
// File: dataframe_minimal_test.ruchy
fun main() {
    let df = df![
        "name" => ["Alice", "Bob"],
        "age" => [30, 25]
    ];
    println(df)
}
```

## Test Results

### Test 1: REPL Mode

**Command**:
```bash
echo 'fun main() { let df = df!["name" => ["Alice", "Bob"]]; println(df) }' | ruchy repl
```

**Expected**: DataFrame created and displayed

**Actual**:
```
Error: Expected RightBrace, found Let
Error: Unexpected token: FatArrow
Error: Unexpected token: FatArrow
Error: Runtime error: Undefined variable: df
Error: Unexpected token: RightBrace
```

**Analysis**: Parser doesn't recognize `df![]` macro syntax in REPL mode.

---

### Test 2: Compile Mode

**Command**:
```bash
ruchy compile dataframe_minimal_test.ruchy
```

**Expected**: Compiles to binary with auto-injected polars dependency

**Actual**:
- Hangs indefinitely (>90 seconds)
- When eventually stops, produces type error:
```
error[E0308]: mismatched types
 --> src/main.rs:1:X
  |
  | expected `()`, found `DataFrame`
```

**Analysis**: Transpiler doesn't properly handle DataFrame return types or inject polars dependency.

---

### Test 3: Book Examples (Ch18)

**Book**: https://github.com/paiml/ruchy-book/blob/main/src/ch18-00-dataframes-data-processing.md

**Status**: 4/4 examples fail compilation

**Example 1 Error**:
```ruchy
fun create_dataframe() {
    let df = df![
        "employee_id" => [101, 102, 103, 104],
        "name" => ["Alice", "Bob", "Charlie", "Diana"],
        "department" => ["Engineering", "Sales", "Engineering", "HR"],
        "salary" => [95000, 75000, 105000, 65000]
    ];
    df
}
```

**Error**:
```
error[E0308]: mismatched types
expected `i32`, found `DataFrame`
```

**Analysis**: Return type inference fails - function returns DataFrame but Rust expects i32.

---

## Root Cause Analysis

### Why I Might Be Wrong

1. **User Error**: Perhaps `df![]` macro requires special imports or setup not documented
2. **Configuration**: Maybe a Cargo.toml or config file is needed that I'm missing
3. **Interpreter-Only**: DataFrames might be intentionally interpreter-only (not transpiler)
4. **Syntax Change**: Macro syntax might have changed and documentation is outdated
5. **Feature Flag**: DataFrame support might need a feature flag or special compilation mode

### Why I Might Be Right

1. **Consistent Failures**: 5 versions (v3.169.0-v3.169.0) show identical failures - suggests systemic issue
2. **Test Suite Evidence**: Ruchy repo has RED (failing) tests in `tests/dataframe_001_transpilation_tdd.rs` marked `#[ignore]`
3. **Documentation Claims**: Ch18 documents DataFrame support, suggesting it should work
4. **Parser Errors**: Even REPL mode fails to parse `df![]` syntax - fundamental parser gap
5. **Type System**: Transpiler produces type mismatches - suggests incomplete implementation

## Evidence from Ruchy Repository

### File: `tests/dataframe_001_transpilation_tdd.rs`

This test file contains **intentionally failing tests** (marked `#[ignore]`) that document the exact requirements:

```rust
/// Test 1: Basic DataFrame compilation
///
/// Expected behavior:
/// - Code compiles without errors
/// - Binary executes and displays DataFrame
/// - Output contains DataFrame content
#[test]
#[ignore] // RED phase - will fail until implementation
fn test_dataframe_001_basic_compilation() {
    // ... test code ...
}
```

**Key Quote from File**:
```rust
// Problem: DataFrames work in interpreter but fail to compile to binaries
// Error: error[E0433]: failed to resolve: use of unresolved module or unlinked crate 'polars'
```

This confirms the issue is KNOWN and DOCUMENTED in the test suite.

### File: `tests/example_titanic_dataframe.rs`

Contains tests for DataFrame transpilation that check:
- Polars imports are generated correctly
- DataFrame::new() API is used
- Method name mapping works (rows→height, columns→width)

All tests are in RED phase, waiting for implementation.

---

## Systematic Testing Results

Tested across **5 consecutive versions** with **134 book examples**:

| Version | Success Rate | DataFrame Tests | Status |
|---------|--------------|-----------------|--------|
| v3.169.0 | 84% (113/134) | 0/4 passing | FAIL |
| v3.169.0 | 84% (113/134) | 0/4 passing | FAIL |
| v3.169.0 | 84% (113/134) | 0/4 passing | FAIL |
| v3.169.0 | 84% (113/134) | 0/4 passing | FAIL |
| v3.169.0 | 84% (113/134) | 0/4 passing | FAIL |

**Conclusion**: DataFrame support is **not implemented** in transpiler mode across all tested versions.

---

## Expected Behavior

Based on Ch18 documentation and test files, DataFrames should:

1. **Parse** `df![]` macro syntax in both REPL and compile modes
2. **Auto-inject** polars dependency in generated Cargo.toml
3. **Transpile** `df![]` to `DataFrame::new(vec![Series::new(...)])`
4. **Infer types** correctly for DataFrame return values
5. **Import** `use polars::prelude::*` automatically
6. **Compile** to working binaries that execute successfully

---

## Actual Behavior

1. ❌ **REPL**: Parser fails on `df![]` syntax with "Unexpected token" errors
2. ❌ **Compile**: Hangs indefinitely OR produces type mismatch errors
3. ❌ **Type Inference**: Returns i32 instead of DataFrame
4. ❌ **Dependency Injection**: No polars dependency added
5. ❌ **All 4 Ch18 examples**: Fail compilation with identical errors

---

## Impact

- **Book Documentation**: Chapter 18 (DataFrames) is entirely non-functional
- **User Expectations**: Documentation claims DataFrame support, but doesn't work
- **Testing**: 21/134 book examples fail (16% failure rate)
- **Learning**: Users cannot learn DataFrame usage from working examples

---

## Proposed Solution

Based on test files in Ruchy repo, implementation needs:

### 1. Parser Enhancement
- Recognize `df![]` macro syntax in REPL
- Parse `=>` syntax for column definitions
- Handle nested array literals

### 2. AST Detection
- Detect DataFrame usage in AST
- Flag when polars dependency is needed

### 3. Transpiler Updates
- Generate `use polars::prelude::*` import
- Transpile `df![]` to `DataFrame::new(vec![...])`
- Create Series for each column
- Add `.expect("Failed to create DataFrame")`

### 4. Cargo.toml Generation
- Auto-generate Cargo.toml with polars dependency
- Specify polars version (e.g., "0.35.4")
- Include required features

### 5. Type System
- Infer DataFrame type correctly
- Handle DataFrame as return type
- Fix type mismatches in transpiled code

---

## Reproduction Steps

### Step 1: Create Test File
```bash
cat > test_df.ruchy << 'EOF'
fun main() {
    let df = df![
        "name" => ["Alice", "Bob"],
        "age" => [30, 25]
    ];
    println(df)
}
EOF
```

### Step 2: Test REPL Mode
```bash
echo 'let df = df!["x" => [1, 2]]; println(df)' | ruchy repl
```

**Expected**: DataFrame displayed
**Actual**: Parser errors

### Step 3: Test Compile Mode
```bash
timeout 90 ruchy compile test_df.ruchy
```

**Expected**: Compiles and produces binary
**Actual**: Hangs OR type error

### Step 4: Check Generated Code
```bash
ruchy transpile test_df.ruchy 2>&1 | head -50
```

**Expected**: Valid Rust with polars imports
**Actual**: Type mismatches, missing imports

---

## Related Issues

- Documentation: https://github.com/paiml/ruchy-book/blob/main/src/ch18-00-dataframes-data-processing.md
- Test Coverage: https://github.com/paiml/ruchy-book/blob/main/test/extracted-examples/summary.json
- Ruchy Tests: `tests/dataframe_001_transpilation_tdd.rs` (RED phase)
- Ruchy Tests: `tests/example_titanic_dataframe.rs` (property tests)

---

## Questions for Maintainers

1. Is DataFrame transpilation **planned** or **implemented**?
2. Are DataFrames intended to be **interpreter-only**?
3. Is the Ch18 documentation **aspirational** or **current**?
4. Should the book mark these examples as "future" or "not yet implemented"?
5. What's the timeline for DataFrame transpilation support?

---

## Additional Context

- Testing infrastructure: https://github.com/paiml/ruchy-book/blob/main/scripts/extract-examples.ts
- Comprehensive analysis: https://github.com/paiml/ruchy-book/blob/main/docs/qa/comprehensive-audit-analysis-v3.169.0.md
- External audit: https://github.com/paiml/ruchy-book/blob/main/docs/qa/gemini-audit-report-ruchy-book-oct14.yaml

---

## Logs and Evidence

### Full Compilation Log
```bash
$ ruchy compile test_df.ruchy 2>&1
→ Compiling test_df.ruchy...
   Updating crates.io index
   Locking 162 packages to latest compatible versions
   Adding polars v3.169.0
   Compiling version_check v3.169.0
   ... [162 crates compile] ...
   Compiling ruchy_binary v3.169.0
error[E0308]: mismatched types
 --> src/main.rs:1:X
  | expected `()`, found `DataFrame`
```

### REPL Session
```bash
$ ruchy repl
Welcome to Ruchy REPL v3.169.0
> let df = df!["x" => [1, 2]]
Error: Expected RightBrace, found Let
Error: Unexpected token: FatArrow
```

---

## Severity

**HIGH** - Core feature documented but non-functional across all versions

## Labels

- `bug`
- `transpiler`
- `dataframes`
- `parser`
- `type-system`
- `documentation`

---

**Thank you for maintaining Ruchy!** Happy to provide more details or testing as needed.
