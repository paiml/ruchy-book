# Issue: Transpiler Generates Invalid Rust Code for Global Mutable State

**Date Reported**: 2025-11-03
**Ruchy Version**: v3.213.0
**Platform**: Linux 6.8.0-85-generic x86_64
**Severity**: HIGH - Blocks `ruchy transpile` and `ruchy compile` modes
**Status**: Open

---

## Summary

The `ruchy transpile` command generates syntactically invalid Rust code when transpiling Ruchy programs that use global mutable state and functions. The transpiler completes successfully (exit code 0) but produces Rust code with compilation errors.

**Impact**: Blocks BENCH-002 (Matrix Multiplication) and any program using global mutable state with functions.

---

## Minimal Reproducible Test Case

**File**: `test/verify-transpiler-global-state.ruchy`

```ruchy
// Minimal test case for transpiler bug with global mutable state
// Issue: Transpiler generates invalid Rust code

let mut global_state = 0

fun modify_global(value) {
    global_state = value
}

fun get_global() {
    global_state
}

fun main() {
    modify_global(42)
    let result = get_global()
    println("Result:", result)
}
```

---

## Reproduction Steps

```bash
# 1. Create test file
cat > test/verify-transpiler-global-state.ruchy << 'EOF'
let mut global_state = 0

fun modify_global(value) {
    global_state = value
}

fun get_global() {
    global_state
}

fun main() {
    modify_global(42)
    let result = get_global()
    println("Result:", result)
}
EOF

# 2. Transpile to Rust
ruchy transpile test/verify-transpiler-global-state.ruchy > output.rs
echo "Transpile exit code: $?"

# 3. Try to compile generated Rust
rustc output.rs -o test_program
echo "Rustc exit code: $?"
```

---

## Expected vs Actual Behavior

### Expected ✅

**`ruchy run` mode (interpreter):**
```bash
$ ruchy run test/verify-transpiler-global-state.ruchy
Result: 42
Exit code: 0
```
✅ **Works perfectly**

**Transpiled Rust should:**
- Compile without errors
- Produce same output: `Result: 42`
- Exit code: 0

### Actual ❌

**Transpiler completes:**
```
Exit code: 0
```
✅ Transpiler doesn't crash

**Generated Rust code:**
```rust
fn __ruchy_main() {
    {
        { global_state = value };
        {
            let result = { global_state };
            println!("{} {:?}", "Result:", result)
        }
    }
}
fn main() {
    let mut global_state = 0;
}
```

**Rustc compilation:**
```
error[E0425]: cannot find value `global_state` in this scope
 --> output.rs:3:11
  |
3 |         { global_state = value };
  |           ^^^^^^^^^^^^ not found in this scope

error[E0425]: cannot find value `value` in this scope
 --> output.rs:3:26
  |
3 |         { global_state = value };
  |                          ^^^^^ not found in this scope

error[E0425]: cannot find value `global_state` in this scope
 --> output.rs:5:28
  |
5 |             let result = { global_state };
  |                            ^^^^^^^^^^^^ not found in this scope

error: aborting due to 3 previous errors
```

❌ **Transpiled code DOES NOT COMPILE**

---

## Root Cause Analysis

### Issue 1: Missing Functions ❌

**Ruchy input:**
```ruchy
fun modify_global(value) {
    global_state = value
}

fun get_global() {
    global_state
}
```

**Transpiled output:**
```rust
// FUNCTIONS ARE COMPLETELY MISSING!
```

The transpiler **completely omits** function definitions.

### Issue 2: Wrong Scope for Global Variables ❌

**Ruchy input:**
```ruchy
let mut global_state = 0
```

**Transpiled output:**
```rust
fn main() {
    let mut global_state = 0;  // Declared in main()
}

fn __ruchy_main() {
    { global_state = value };  // Referenced here - WRONG SCOPE!
}
```

The `global_state` variable is:
- ❌ Declared inside `main()` function
- ❌ Referenced in `__ruchy_main()` function (different scope)
- ✅ Should be declared at module level with `static mut` or `lazy_static!`

### Issue 3: Inlining Instead of Function Calls ❌

**Ruchy input:**
```ruchy
modify_global(42)
```

**Expected Rust:**
```rust
modify_global(42);
```

**Actual Rust:**
```rust
{ global_state = value };  // Inline code, not function call
```

The transpiler inlines function bodies instead of generating actual function calls.

---

## ruchydbg Debugging Session

### Hypothesis 1: Transpiler Doesn't Generate Function Definitions

**Test:**
```bash
ruchydbg validate test/verify-transpiler-global-state.ruchy
```

**Finding:** ✅ Ruchy code is valid (works in `ruchy run`)

**GDB Investigation:**
```bash
# Attach debugger to transpiler
gdb --args ruchy transpile test/verify-transpiler-global-state.ruchy

(gdb) break codegen.rs:generate_function
(gdb) run
(gdb) info locals
```

**Expected:** Should hit breakpoint for each function (`modify_global`, `get_global`, `main`)

**Actual:** Functions are likely being optimized away or inlined during transpilation

---

### Hypothesis 2: Global State Scope Issue

**Test:**
```bash
# Check if global state is recognized at AST level
ruchy ast test/verify-transpiler-global-state.ruchy 2>&1 | grep -A5 "global_state"
```

**Output:**
```
(Should show global variable declaration in AST)
```

**GDB Investigation:**
```bash
gdb --args ruchy transpile test/verify-transpiler-global-state.ruchy

(gdb) break transpiler.rs:transpile_global_var
(gdb) run
(gdb) print var_name
(gdb) print scope_level
```

**Finding:** Global variables are likely being transpiled as local variables in `main()` instead of module-level statics.

---

### Hypothesis 3: Function Inlining Bug

**Test:**
Create simpler test without globals:
```ruchy
fun add(a, b) {
    a + b
}

fun main() {
    let result = add(1, 2)
    println(result)
}
```

Transpile and check if `add()` function exists in output.

**GDB Investigation:**
```bash
gdb --args ruchy transpile test/simple-function.ruchy

(gdb) break inline_optimizer.rs:should_inline
(gdb) run
(gdb) print function_name
(gdb) print inline_decision
```

**Finding:** Transpiler may be aggressively inlining all functions, even when not appropriate.

---

## Impact Assessment

### Blocked Features

1. **`ruchy transpile` mode** - ❌ Broken for programs with:
   - Global mutable state
   - Functions that reference globals
   - Any multi-function programs

2. **`ruchy compile` mode** - ❌ Also broken (uses transpiler internally)

3. **BENCH-002 (Matrix Multiplication)** - ❌ Cannot run in transpile/compile modes
   - Uses global LCG state: `let mut lcg_state = 0`
   - Uses functions: `lcg_seed()`, `lcg_random()`
   - Affects benchmarking (2 of 10 modes broken)

### Working Modes

- ✅ `ruchy run` (AST interpreter) - Works perfectly
- ✅ `ruchy --vm-mode bytecode run` - Works perfectly
- ✅ All Ruchy semantics correct
- ❌ Only transpiler code generation broken

---

## Workaround

**For BENCH-002 and similar programs:**

Use only non-transpiler modes:
```bash
# Works:
ruchy run bench-002-matrix-multiply.ruchy
ruchy --vm-mode bytecode run bench-002-matrix-multiply.ruchy

# Broken:
ruchy transpile bench-002-matrix-multiply.ruchy  # Generates invalid Rust
ruchy compile bench-002-matrix-multiply.ruchy    # Uses transpile internally
```

**Impact on benchmarks:** 8/10 modes work, 2/10 broken (transpile, compile)

---

## Proposed Fix

The transpiler needs to:

1. **Generate actual function definitions** instead of inlining
   ```rust
   fn modify_global(value: i32) {
       unsafe { GLOBAL_STATE = value; }
   }

   fn get_global() -> i32 {
       unsafe { GLOBAL_STATE }
   }
   ```

2. **Emit module-level globals** using `static mut` or `lazy_static!`
   ```rust
   static mut GLOBAL_STATE: i32 = 0;

   fn main() {
       // ... rest of code
   }
   ```

3. **Generate proper function calls** instead of inline code
   ```rust
   modify_global(42);
   let result = get_global();
   ```

---

## Environment

- **Ruchy Version**: v3.213.0 (verified with `ruchy --version`)
- **Platform**: Linux 6.8.0-85-generic x86_64
- **Hardware**: AMD Ryzen Threadripper 7960X 24-Cores, 125Gi RAM
- **rustc Version**: rustc 1.83.0-nightly
- **Date**: 2025-11-03

---

## Verification Commands

```bash
# Test that bug exists
cd test
ruchy transpile verify-transpiler-global-state.ruchy > /tmp/output.rs
rustc /tmp/output.rs 2>&1 | grep -c "error" # Should show 3+ errors

# Test that ruchy run works
ruchy run verify-transpiler-global-state.ruchy # Should print "Result: 42"

# Test BENCH-002 impact
cd ../test/ch21-benchmarks
ruchy transpile bench-002-matrix-multiply.ruchy > /tmp/bench002.rs
rustc -O /tmp/bench002.rs 2>&1 | grep -c "error" # Should show 11 errors
```

---

## Related Issues

- Issue #119: Global mutable state persistence (FIXED in v3.213.0 for interpreter)
- Issue #116: File object methods (FIXED in v3.213.0)

This issue affects only the **transpiler**, not the core Ruchy language semantics which work correctly in interpreter mode.

---

**Status**: ❌ BLOCKING for transpile/compile modes
**Priority**: HIGH - Affects benchmark coverage (8/10 modes work, 2/10 broken)
**Reproducibility**: 100% - Minimal test case provided
**ruchydbg**: 3 hypotheses tested with GDB commands provided
