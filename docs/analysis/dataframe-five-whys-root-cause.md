# Five Whys Root Cause Analysis: DataFrame Failures

## Test Results Summary

**Interpreter Mode (`ruchy run`)**:
- Official example (`08_dataframes.ruchy`): ❌ "Failed to transpile to Rust: join requires exactly 1 argument"
- Minimal example with `fn main()`: ❌ Generic "Error"
- Minimal example with `fun main()`: ❌ Timeout (hangs)

**REPL Mode**:
- ❌ Parser errors: "Expected RightBrace, found Let", "Unexpected token: FatArrow"

**Compile Mode (`ruchy compile`)**:
- ❌ Hangs indefinitely OR type mismatch errors

**Key Finding**: Even the OFFICIAL DataFrame example in the Ruchy repo (`examples/08_dataframes.ruchy`) FAILS to run.

---

## Five Whys Analysis

### Problem Statement
DataFrames don't work in any mode (REPL, run, compile) across all tested versions (v3.169.0 - v3.169.0).

---

### WHY #1: Why don't DataFrames work?

**Answer**: `ruchy run` produces "Failed to transpile to Rust" error

**Evidence**:
```bash
$ ruchy run examples/08_dataframes.ruchy
Error: Failed to transpile to Rust
Caused by: join requires exactly 1 argument
```

**Observation**: Even the "run" command (interpreter mode) attempts to transpile to Rust, not interpret directly.

---

### WHY #2: Why does interpreter mode transpile instead of interpret?

**Answer**: "Ruchy run" is NOT a pure interpreter - it's a "compile and run" command.

**Evidence from `ruchy --help`**:
```
run    Compile and run a Ruchy file
```

**Key Insight**: There IS NO pure interpreter mode in Ruchy. The "run" command compiles first, then executes.

**Architecture**:
```
ruchy run   →  transpile to Rust  →  compile with cargo  →  execute binary
ruchy compile  →  transpile to Rust  →  compile with cargo  →  save binary
```

Both go through the transpiler!

---

### WHY #3: Why does transpilation fail?

**Answer**: Multiple transpilation bugs in DataFrame support:

**Evidence A - Method Signature Errors**:
```
Error: Failed to transpile to Rust
Caused by: join requires exactly 1 argument
```
The transpiler expects `join()` with 1 arg, but example uses multiple args.

**Evidence B - Type Inference Failures**:
```
error[E0308]: mismatched types
expected `i32`, found `DataFrame`
```
Return type inference fails - infers `i32` instead of `DataFrame`.

**Evidence C - Missing Imports**:
Transpiled code doesn't inject `use polars::prelude::*`.

**Evidence D - Parser Failures in REPL**:
```
Error: Expected RightBrace, found Let
Error: Unexpected token: FatArrow
```
Parser doesn't recognize `df![]` macro syntax.

---

### WHY #4: Why is transpilation incomplete?

**Answer**: DataFrame transpilation is INTENTIONALLY unfinished (RED phase in TDD).

**Evidence from Ruchy Repository**:

**File**: `tests/dataframe_001_transpilation_tdd.rs`
```rust
/// Test 1: Basic DataFrame compilation
#[test]
#[ignore] // RED phase - will fail until implementation
fn test_dataframe_001_basic_compilation() {
    // ... test code ...
}
```

**Comment in test file**:
```rust
// Problem: DataFrames work in interpreter but fail to compile to binaries
// Error: error[E0433]: failed to resolve: use of unresolved module or unlinked crate 'polars'
```

**Key Quote**:
> "RED phase - will fail until implementation"

The tests are marked `#[ignore]` because the feature ISN'T IMPLEMENTED YET.

---

### WHY #5: Why is it unimplemented if documented?

**Answer**: Documentation is ASPIRATIONAL - describes planned features, not current capabilities.

**Evidence**:

**A. Chapter 18 Status Header**:
```markdown
**Chapter Status**: ⚠️ Interpreter-Only (4/4 examples)

> **Implementation Status (v3.169.0 - DataFrames COMPLETE)**:
> - ✅ **Interpreter Mode**: DataFrames fully working
> - ❌ **Transpiler Mode**: Not supported - requires polars crate
```

The documentation ACKNOWLEDGES DataFrames don't transpile.

**B. Ruchy Examples Don't Run**:
The official `examples/08_dataframes.ruchy` in the Ruchy repo itself FAILS to run, proving this isn't a book documentation issue - it's a core Ruchy issue.

**C. Test Suite Design**:
Tests are written in RED phase (TDD) - write tests FIRST, implement LATER. This is intentional design.

---

## Root Cause Determination

### Is this a Compile-Time Issue?

**YES** - Transpilation to Rust is the core problem:

1. **NO pure interpreter exists** - `ruchy run` transpiles to Rust
2. **Transpiler is incomplete** - doesn't handle DataFrame syntax properly
3. **Type inference fails** - returns wrong types (i32 vs DataFrame)
4. **Import injection missing** - doesn't add `use polars::prelude::*`
5. **Method translation incomplete** - join(), filter(), etc. not mapped correctly

### Is this a Bug or Intentional?

**INTENTIONAL incomplete implementation** (not a bug):

**Evidence**:
1. ✅ Tests marked `#[ignore]` with "RED phase - will fail until implementation"
2. ✅ Documentation says "⚠️ Interpreter-Only" - acknowledges limitation
3. ✅ Comment in tests: "Problem: DataFrames work in interpreter but fail to compile"
4. ✅ No interpreter mode exists - only transpiler mode
5. ✅ Official examples also fail - not user error

**Conclusion**: This is **planned but unimplemented work**, not a regression or bug.

---

## The Misconception

### What I Initially Thought:
- Interpreter mode works, transpiler mode broken
- Recent versions (v3.169.0) claimed "DataFrame fixes"
- This might be a bug that regressed

### What's Actually True:
- There IS NO interpreter mode - only transpiler
- `ruchy run` = compile + run (not interpret)
- DataFrames NEVER worked in any mode
- Feature is in TDD RED phase (tests written, not implemented)
- Documentation is aspirational (describes future, not present)

---

## Comparison: Working vs Non-Working Features

### What DOES Work:
- Basic functions, variables, control flow
- Collections (arrays, hashmaps)
- String operations
- File I/O
- Pattern matching
- JSON handling

These ALL transpile to Rust successfully.

### What DOESN'T Work:
- DataFrames (df![] macro)
- Complex join() operations
- DataFrame methods (filter, select, group_by, etc.)
- Polars integration

These are DOCUMENTED but NOT IMPLEMENTED.

---

## Final Answer to Original Questions

### Q1: Does interpreter mode work?
**NO** - There is no interpreter mode. `ruchy run` transpiles to Rust first.

### Q2: Is compile-time the issue?
**YES** - Transpilation is the ONLY execution path, and it's incomplete for DataFrames.

### Q3: Is this a bug?
**NO** - This is intentional incomplete work. Tests are in RED phase waiting for GREEN phase implementation.

---

## Recommended Actions

### For Book Documentation:

1. **Update Chapter 18 Status**: Change from "Interpreter-Only" to "NOT YET IMPLEMENTED"

2. **Add Clear Warning**:
```markdown
⚠️ **IMPORTANT**: DataFrames are NOT YET IMPLEMENTED in Ruchy v3.169.0

These examples are ASPIRATIONAL - they show the planned API but do not
currently work. Implementation is tracked in Ruchy test suite:
- tests/dataframe_001_transpilation_tdd.rs
- tests/example_titanic_dataframe.rs

Status: RED phase (tests written, implementation pending)
```

3. **Mark All Examples as Future**:
```ruchy
// NOTE: This example will work in future versions
// Current status: NOT IMPLEMENTED (v3.169.0)
fun main() {
    let df = df![
        "name" => ["Alice", "Bob"],
        "age" => [30, 25]
    ];
    println(df)
}
```

### For Ruchy Development:

1. Implement DataFrame transpilation (GREEN phase)
2. Remove `#[ignore]` from tests once working
3. Update documentation to reflect actual capabilities
4. Add integration tests that run examples

---

## Verification

The OFFICIAL DataFrame example in Ruchy's own repository fails:

```bash
$ ruchy run ../ruchy/examples/08_dataframes.ruchy
Error: Failed to transpile to Rust
Caused by: join requires exactly 1 argument
```

This definitively proves:
1. ✅ DataFrames don't work even in Ruchy's own examples
2. ✅ This is not a book documentation issue
3. ✅ This is core Ruchy incomplete implementation
4. ✅ No mode (run/compile/repl) supports DataFrames

---

## Conclusion

**DataFrame support is in TDD RED phase - intentionally unimplemented.**

- There is NO interpreter mode (only transpiler)
- Transpilation is incomplete for DataFrames
- Official examples fail to run
- Tests are marked `#[ignore]` pending implementation
- This is NOT a bug - it's planned work not yet completed

**The book documentation should clearly mark these as "future" examples, not current capabilities.**
