# Ruchy Runtime Bug Reports

This document tracks bugs discovered in the Ruchy compiler/runtime while testing book examples.

---

## Bug #001: File Operations Hang Indefinitely

**Filed**: December 20, 2024  
**Ruchy Version**: v0.7.7  
**Platform**: Linux 6.8.0-71-generic x86_64  
**Severity**: Critical - Blocks 94% of example testing  
**Status**: ✅ FIXED in v0.7.10  
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
Fixed in ruchy v0.7.10! The file operations now work correctly:
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
**Ruchy Version**: v0.8.0  
**Platform**: Linux 6.8.0-78-lowlatency x86_64  
**Severity**: High - Functions can be parsed but not executed  
**Status**: Open  

### Description
While the v0.8.0 parser can successfully parse function definitions using the `fun` keyword, the interpreter fails to execute files containing function definitions. The parser generates correct AST but execution fails with "Failed to parse input" error.

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
None currently available. Functions cannot be executed in v0.8.0.

---

## Bug #003: Array Indexing Not Implemented

**Filed**: August 21, 2025  
**Ruchy Version**: v0.8.0  
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
| 001 | File Operations Hang | Critical | **FIXED** | v0.7.7 | 2024-12-20 |
| 002 | Function Definitions Cannot Be Executed | High | **Open** | v0.8.0 | 2025-08-21 |
| 003 | Array Indexing Not Implemented | Medium | **Open** | v0.8.0 | 2025-08-21 |

---

*This document is part of the Ruchy Book Documentation Status Testing system*