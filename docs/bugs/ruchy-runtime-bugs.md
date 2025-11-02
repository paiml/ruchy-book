# Ruchy Runtime Bug Reports

This document tracks bugs discovered in the Ruchy compiler/runtime while testing book examples.

---

## Bug #003: Array Index Assignment Not Supported in v3.173.0

**Filed**: 2025-11-02
**Ruchy Version**: v3.173.0
**Platform**: Linux 6.8.0-85-generic x86_64
**Severity**: High - Blocks matrix/array benchmarks
**Status**: ⏳ **OPEN**

### Description
Ruchy v3.173.0 does not support assignment to array indices (e.g., `arr[i][j] = value`), failing with "Invalid assignment target" error. This blocks implementation of matrix operations and array-based algorithms.

### Reproduction Steps

```bash
# Environment
$ ruchy --version
ruchy 3.173.0

# Step 1: Create minimal test case
$ cat > test-array-assignment.ruchy <<'EOF'
let matrix = [[0, 1], [2, 3]]
matrix[0][1] = 99  // Should work but fails
println(matrix[0][1])
EOF

# Step 2: Attempt to run (FAILS)
$ ruchy run test-array-assignment.ruchy
Error: Evaluation error: Runtime error: Invalid assignment target
```

### Expected vs Actual
- **Expected**: `matrix[0][1] = 99` should update the array element
- **Actual**: Runtime error "Invalid assignment target"

### Impact
- **Blocks BENCH-002** (Matrix Multiplication 100x100)
- **Blocks all array-based algorithms** requiring element updates
- **Prevents implementation of**:
  - Matrix operations
  - In-place array sorting
  - Dynamic programming algorithms
  - Graph adjacency matrices

### Workaround
None currently. Array manipulation requiring in-place updates is not possible.

### Related Files
- `/home/noah/src/ruchy-book/test/ch21-benchmarks/bench-002-matrix-multiply.ruchy` (blocked)
- `/home/noah/src/ruchy-book/test/bugs/array-index-assignment.ruchy` (minimal test case)

### Additional Context
- Array **reading** works: `let x = matrix[0][1]` ✅
- Array **assignment** fails: `matrix[0][1] = 99` ❌
- This appears to be a limitation in the assignment statement parser/evaluator

---

## Bug #002: Main Function Incorrect Return Type in v3.169.0

**Filed**: August 26, 2025
**Ruchy Version**: v3.169.0
**Platform**: Linux 6.8.0-78-lowlatency x86_64
**Severity**: Critical - Breaks all basic examples
**Status**: ✅ **FIXED** (Verified 2025-10-06)

### Description
The Ruchy compiler v3.169.0 incorrectly generates `fn main() -> i32` instead of `fn main()` in the transpiled Rust code, causing all basic programs to fail compilation with type mismatch errors.

### Reproduction Steps

```bash
# Environment
$ ruchy --version
ruchy 1.18.0

# Step 1: Create simple test
$ echo 'fun main() {
    println("Hello, World!");
}' > test.ruchy

# Step 2: Attempt to compile (FAILS)
$ ruchy compile test.ruchy
→ Compiling test.ruchy...
✗ Compilation failed: Compilation failed:
error[E0277]: `main` has invalid return type `i32`
error[E0308]: mismatched types - expected `i32`, found `()`

# Step 3: Check generated Rust (incorrect)
# Generated: fn main() -> i32 { { println!("Hello, World!") } }
# Expected:  fn main() { println!("Hello, World!"); }
```

### Expected vs Actual
- **Expected**: `fn main() { ... }` with no return type
- **Actual**: `fn main() -> i32 { ... }` with incorrect i32 return type

### Impact
- Breaks ALL basic examples in the book
- 100% failure rate for simple programs
- Regression from v3.169.0 which worked correctly

### Workaround
None available. Must revert to v3.169.0 or wait for fix.

### Related Commit
- 901910b [BUG-002] v3.169.0 - Fix higher-order function transpilation
- This "fix" appears to have broken basic main function transpilation

### Resolution
**Fixed in ruchy v3.169.0!** The main function compilation now works correctly:

```bash
$ ruchy --version
ruchy 3.67.0

$ echo 'fun main() {
    println("Hello, World!");
}' > test.ruchy

$ ruchy compile test.ruchy
→ Compiling test.ruchy...
✓ Successfully compiled to: a.out

$ ./a.out
Hello, World!
```

**Test Verification (2025-10-06)**:
- Main function generates correct Rust code without return type
- Compilation succeeds without type mismatch errors
- Programs execute correctly

---

## Bug #001: File Operations Hang Indefinitely

**Filed**: December 20, 2024  
**Ruchy Version**: v3.169.0  
**Platform**: Linux 6.8.0-71-generic x86_64  
**Severity**: Critical - Blocks 94% of example testing  
**Status**: ✅ FIXED in v3.169.0  
**Resolution Date**: December 20, 2024

### Description
The `ruchy check` and `ruchy transpile` commands hang indefinitely when processing any file input, making it impossible to test multi-line examples or validate syntax for files. However, the `-e` evaluation mode works perfectly for single-line expressions.

### Reproduction Steps

```bash
# Environment
$ ruchy --version
ruchy 0.7.7

$ uname -a
Linux 6.8.0-71-generic #71-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux

# Step 1: Create a simple test file
$ echo 'println("Hello, World!")' > test.ruchy

# Step 2: Attempt to check syntax (HANGS)
$ ruchy check test.ruchy
# No output, process hangs indefinitely
# Must use Ctrl+C to terminate

# Step 3: Attempt to transpile (HANGS)
$ ruchy transpile test.ruchy
# No output, process hangs indefinitely
# Must use Ctrl+C to terminate

# Step 4: Verify -e evaluation works (SUCCESS)
$ ruchy -e 'println("Hello, World!")'
Hello, World!

# Step 5: Test with timeout to confirm hanging
$ timeout 5s ruchy check test.ruchy
$ echo $?
124  # Exit code 124 indicates timeout killed the process

# Step 6: Verify it's not file permissions
$ ls -la test.ruchy
-rw-rw-r-- 1 user user 25 Dec 20 15:30 test.ruchy

# Step 7: Test with different file content (ALL HANG)
$ echo '2 + 2' > simple.ruchy
$ timeout 5s ruchy check simple.ruchy
# Hangs

$ echo 'let x = 42' > variable.ruchy  
$ timeout 5s ruchy check variable.ruchy
# Hangs
```

### Expected Behavior
- `ruchy check test.ruchy` should validate syntax and return exit code 0 for valid code
- `ruchy transpile test.ruchy` should output Rust code or compilation result

### Actual Behavior
- Both commands hang indefinitely with no output
- Process must be manually terminated with Ctrl+C or timeout
- No error messages or diagnostics provided

### Impact on Book Testing
- **244 out of 259 examples** cannot be properly tested
- Only simple one-line expressions testable via `-e` flag
- Cannot validate multi-line code blocks, functions, or complex examples
- Forces fallback to syntax-based classification instead of actual testing

### Workaround
Currently using evaluation mode for simple expressions only:
```bash
# Works for simple cases
ruchy -e "2 + 2"              # ✅ Returns: 4
ruchy -e 'println("Hello")'   # ✅ Prints: Hello

# Cannot test multi-line examples
ruchy -e 'fn main() {
  println("Hello")
}'                             # ❌ Syntax error
```

### Additional Information
- The `ruchy run` command also hangs when given a file
- The `ruchy parse` command similarly hangs  
- The `ruchy ast` command exhibits the same hanging behavior
- Only commands that work: `--version`, `--help`, and `-e` evaluation
- REPL mode (`ruchy repl`) starts but becomes unresponsive after first input

### Hypothesis
Possible causes:
1. File I/O blocking issue in the Ruchy runtime
2. Infinite loop in the parser when processing file input
3. Missing error handling for file operations
4. Platform-specific issue with Linux file handling

### Test Matrix

| Command | File Input | Stdin Input | -e Flag | Result |
|---------|------------|-------------|---------|---------|
| check   | ❌ Hangs   | ❌ Hangs    | N/A     | BROKEN |
| transpile| ❌ Hangs  | ❌ Hangs    | N/A     | BROKEN |
| run     | ❌ Hangs   | ❌ Hangs    | N/A     | BROKEN |
| parse   | ❌ Hangs   | ❌ Hangs    | N/A     | BROKEN |
| ast     | ❌ Hangs   | ❌ Hangs    | N/A     | BROKEN |
| eval    | N/A        | N/A         | ✅ Works| OK |
| repl    | N/A        | ❌ Hangs    | N/A     | BROKEN |

### Related Issues
- Affects Documentation Status Testing system accuracy
- Blocks comprehensive integration testing
- Prevents proper example validation in CI/CD

### Resolution
Fixed in ruchy v3.169.0! The file operations now work correctly:
```bash
$ ruchy --version
ruchy 0.7.10

$ echo 'println("Hello, World!")' > test.ruchy
$ ruchy check test.ruchy
✓ Syntax is valid

$ ruchy transpile test.ruchy
# Successfully generates output
```

**Impact of Fix**:
- Book example testing improved from 6% → 22% success rate
- Can now properly test all 259 examples with actual syntax checking
- CI/CD pipeline fully functional

---

## Bug #002: Function Definitions Cannot Be Executed

**Filed**: August 21, 2025  
**Ruchy Version**: v3.169.0  
**Platform**: Linux 6.8.0-78-lowlatency x86_64  
**Severity**: High - Functions can be parsed but not executed  
**Status**: Open  

### Description
While the v3.169.0 parser can successfully parse function definitions using the `fun` keyword, the interpreter fails to execute files containing function definitions. The parser generates correct AST but execution fails with "Failed to parse input" error.

### Reproduction Steps

```bash
# Environment
$ ruchy --version
ruchy 0.8.0

# Step 1: Create a function definition file
$ cat > test_function.ruchy << 'EOF'
fun add(x, y) {
    x + y
}

add(10, 20)
EOF

# Step 2: Parse the file (SUCCESS - generates AST)
$ ruchy parse test_function.ruchy
AST:
Expr {
    kind: Block([
        Expr { kind: Function { name: "add", params: [...], ... }, ... },
        Expr { kind: Call { func: Expr { kind: Identifier("add"), ... }, args: [...] }, ... }
    ]),
    ...
}

# Step 3: Execute the file (FAILS)
$ ruchy test_function.ruchy
Error at line: fun add(x, y) {
  Failed to parse input

# Step 4: Alternative function syntax also fails
$ echo 'let add = fun(x, y) { x + y }; add(10, 20)' | ruchy
Error at line: let add = fun(x, y) {
  Failed to parse input
```

### Expected Behavior
- Function should be defined and callable
- `add(10, 20)` should return 30

### Actual Behavior
- Parser successfully generates AST
- Interpreter fails with "Failed to parse input" error
- Disconnect between parser and interpreter

### Impact on Book Testing
- All examples with function definitions fail execution
- Affects approximately 40+ examples across multiple chapters
- Can parse but not run functional programming examples

### Workaround
None currently available. Functions cannot be executed in v3.169.0.

---

## Bug #003: Array Indexing Not Implemented

**Filed**: August 21, 2025  
**Ruchy Version**: v3.169.0  
**Platform**: Linux 6.8.0-78-lowlatency x86_64  
**Severity**: Medium - Arrays exist but cannot be accessed  
**Status**: Open  

### Description
Arrays can be created and displayed, but indexing into arrays fails with "Unknown function: get" error, suggesting missing implementation of array access operations.

### Reproduction Steps

```bash
# Environment
$ ruchy --version
ruchy 0.8.0

# Step 1: Create array (SUCCESS)
$ ruchy -e '[1, 2, 3]'
[1, 2, 3]

# Step 2: Attempt to access array element (FAILS)
$ ruchy -e 'let x = [1, 2, 3]; x[0]'
Error: Unknown function: get

# Step 3: Array exists but is not accessible
$ ruchy -e 'let x = [1, 2, 3]; x'
[1, 2, 3]
```

### Expected Behavior
- `x[0]` should return `1`
- Array indexing should work

### Actual Behavior
- Array indexing fails with "Unknown function: get"
- Arrays can only be created and displayed, not accessed

### Impact on Book Testing
- All data processing examples using arrays fail
- Collection manipulation examples cannot be demonstrated
- Affects chapters on data structures and algorithms

### Workaround
None available. Arrays cannot be accessed by index.

**Resolution**: Fixed in ruchy v3.169.0! Array indexing now works correctly:
```bash
$ ruchy --version
ruchy 0.9.0

$ ruchy -e 'let x = [1, 2, 3]; x[0]'
1
```

---

## Bug #004: CRITICAL - v3.169.0 Release Compilation Failure

**Filed**: August 21, 2025  
**Ruchy Version**: v3.169.0  
**Platform**: Linux 6.8.0-78-lowlatency x86_64  
**Severity**: **CRITICAL** - Blocking Release, Cannot Install  
**Status**: **OPEN** - Immediate Action Required  

### Description
The v3.169.0 release cannot compile due to incomplete macro system implementation. The `Macro` variant was added to `ExprKind` enum and the type inference match arm calls `self.infer_macro(name, args)`, but the `infer_macro` method is not implemented in the `InferenceContext` struct.

### Compilation Error
```
error[E0599]: no method named `infer_macro` found for struct `InferenceContext`
   --> src/middleend/infer.rs:188:18
    |
188 |                 self.infer_macro(name, args)
    |                      ^^^^^^^^^^^ method not found in `InferenceContext`
```

### Root Cause Analysis
1. **Incomplete Implementation**: Macro match arm added but helper method forgotten
2. **Missing Method**: `infer_macro(&mut self, name: &str, args: &[Expr]) -> Result<MonoType>` not implemented  
3. **Testing Gap**: Code committed without compilation verification
4. **Quality Gate Failure**: This should have been caught by `cargo check` before commit

### Impact Assessment
- **BREAKING**: v3.169.0 cannot be installed or used
- **BLOCKING**: All downstream users cannot upgrade  
- **REPUTATION**: Published broken release on crates.io
- **WORKFLOW**: Development workflow compromised

### Immediate Actions Required
1. **URGENT**: Revert v3.169.0 from crates.io if possible
2. **FIX**: Implement missing `infer_macro` method
3. **TEST**: Verify compilation before any future releases
4. **PROCESS**: Strengthen quality gates to prevent this

### Required Fix
Add the missing `infer_macro` method to `src/middleend/infer.rs`:

```rust
fn infer_macro(&mut self, name: &str, args: &[Expr]) -> Result<MonoType> {
    // Type check macro arguments
    for arg in args {
        let _arg_ty = self.infer_expr(arg)?;
    }
    
    // Handle common macros
    match name {
        "println" | "print" | "eprintln" | "eprint" => {
            // Print macros return Unit
            Ok(MonoType::Unit)
        }
        "vec" => {
            // vec! macro returns a Vec<T> where T is inferred from elements
            if args.is_empty() {
                // vec![] - empty vec with fresh type variable
                Ok(MonoType::List(Box::new(MonoType::Var(self.gen.fresh()))))
            } else {
                // vec![elements...] - infer element type
                let first_ty = self.infer_expr(&args[0])?;
                for arg in &args[1..] {
                    let arg_ty = self.infer_expr(arg)?;
                    self.unifier.unify(&first_ty, &arg_ty)?;
                }
                Ok(MonoType::List(Box::new(first_ty)))
            }
        }
        _ => {
            // Unknown macro - return fresh type variable
            Ok(MonoType::Var(self.gen.fresh()))
        }
    }
}
```

### Prevention
- [ ] Add compilation check to CI/CD pipeline
- [ ] Require `cargo check` pass before any commit  
- [ ] Implement pre-commit hooks for compilation verification
- [ ] Never commit without testing basic compilation

**This is a mission-critical issue requiring immediate resolution before any further development.**

**Resolution**: Fixed in ruchy v3.169.0! The missing `infer_macro` method was implemented:
```bash
$ ruchy --version
ruchy 0.9.8

$ ruchy -e "println!(\"Macro system works!\")"
"Macro system works!"
()

$ ruchy -e "vec![1, 2, 3]"
[1, 2, 3]
```

**Impact of Fix**:
- v3.169.0 compiles and runs correctly
- Macro system functional with `println!` and `vec!` support
- Maintains 40% book compatibility (110/274 examples)
- 100% one-liner support preserved

---

## Bug Reporting Guidelines

When filing a new bug:

1. **Version Information**: Always include `ruchy --version` output
2. **Platform Details**: Include OS, architecture (`uname -a`)
3. **Reproduction**: Provide exact commands that reproduce the issue
4. **Expected vs Actual**: Clearly state what should happen vs what does happen
5. **Impact**: Describe how this affects book testing/documentation
6. **Workaround**: If you found one, document it
7. **Test Date**: Include the date of testing

## Bug Status Tracking

| Bug # | Title | Severity | Status | Ruchy Version | Filed |
|-------|-------|----------|--------|---------------|-------|
| 001 | File Operations Hang | Critical | **FIXED** | v3.169.0 | 2024-12-20 |
| 002 | Main Function Incorrect Return Type | Critical | **FIXED** | v3.169.0 | 2025-08-26 |
| 002b | Function Definitions Cannot Be Executed | High | **Open** | v3.169.0 | 2025-08-21 |
| 003 | Array Indexing Not Implemented | Medium | **FIXED** | v3.169.0 | 2025-08-21 |
| 004 | v3.169.0 Release Compilation Failure | **CRITICAL** | **FIXED** | v3.169.0 | 2025-08-21 |

---

*This document is part of the Ruchy Book Documentation Status Testing system*