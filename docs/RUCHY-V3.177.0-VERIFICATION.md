# Ruchy v3.177.0 Verification Report

**Date**: 2025-11-03
**Ruchy Version**: v3.177.0
**Previous Version**: v3.176.0

---

## Executive Summary

Ruchy v3.177.0 **partially resolves** Issue #119 (global mutable state) but **does not resolve** Issue #116 (File object methods). A new double-evaluation bug was discovered during testing.

**Key Findings:**
- ✅ **Issue #119**: Global mutable state NOW PERSISTS (CORE ISSUE RESOLVED)
- ❌ **Issue #119**: NEW BUG - Functions called twice when used as println() arguments
- ❌ **Issue #116**: NOT FIXED - File object methods still not implemented
- ⚠️ **BENCH-002**: CAN NOW RUN with workaround (global state persists)
- ❌ **BENCH-006**: STILL BLOCKED (needs File object)

---

## Issue #119: Global Mutable State ✅ PARTIALLY FIXED

### Status: Core Issue RESOLVED, New Bug Discovered

**Original Problem (v3.176.0):**
```ruchy
let mut counter = 0

fun increment() {
    counter = counter + 1
    counter
}

println(increment())  // v3.176.0: 1
println(increment())  // v3.176.0: 1 (WRONG - should be 2)
println(increment())  // v3.176.0: 1 (WRONG - should be 3)
println(counter)      // v3.176.0: 0 (WRONG - should be 3)
```

**Fixed in v3.177.0:**
```
Output: 2, 4, 6, 6
```

**Analysis:**
- ✅ Global state PERSISTS: Final counter is 6 (not 0)
- ✅ State survives across function calls
- ❌ NEW BUG: Functions evaluated TWICE per println()

### New Bug Discovered: Double-Evaluation

**Test Case:**
```ruchy
let mut counter = 0

fun inc() {
    println("  [DEBUG] inc() called, counter before:", counter)
    counter = counter + 1
    println("  [DEBUG] inc() counter after:", counter)
    counter
}

println("First:", inc())
println("Second:", inc())
```

**Output (v3.177.0):**
```
  [DEBUG] inc() called, counter before: 0
  [DEBUG] inc() counter after: 1
  [DEBUG] inc() called, counter before: 1
  [DEBUG] inc() counter after: 2
First: 2
  [DEBUG] inc() called, counter before: 2
  [DEBUG] inc() counter after: 3
  [DEBUG] inc() called, counter before: 3
  [DEBUG] inc() counter after: 4
Second: 4
```

**Problem:** `inc()` is called **4 times** total (2 per println), not 2 times as expected.

**Root Cause (Hypothesis):** Argument expressions are evaluated twice, possibly:
1. Once during type checking
2. Once for actual value computation

**Workaround:**
```ruchy
let result = my_function()  // Call once, cache result
println("Result:", result)   // Print cached value
```

### ruchydbg Debugging Provided

**Location:** `runtime/eval_builtin.rs` or `runtime/interpreter.rs` (println implementation)

**GDB Commands:**
```bash
cd /home/noah/src/ruchy
ruchydbg validate /tmp/test-global-debug.ruchy

# In GDB:
break interpreter.rs::eval_call
condition 1 if func_name == "inc"
run
# Count breakpoint hits per println()
```

### GitHub Issue Update

✅ **Issue #119 Updated**: https://github.com/paiml/ruchy/issues/119
- Comprehensive v3.177.0 verification
- Double-evaluation bug documented
- ruchydbg debugging workflow provided
- Workaround documented

---

## Issue #116: File Object Methods ❌ NOT FIXED

### Status: Still Blocked

**Problem:** `open()` still returns Message type, not File object.

**Test Case:**
```ruchy
let file = open("sample.txt", "r")
let line = file.read_line()  // Error: Unknown object type: Message
file.close()                  // Error: Unknown object type: Message
```

**Error (v3.177.0):**
```
Error: Evaluation error: Runtime error: Unknown object type: Message
```

**What Works:**
```ruchy
// ✅ Whole-file reading
let content = read_file("sample.txt")
```

**What Doesn't Work:**
```ruchy
// ❌ Streaming file I/O
let file = open("sample.txt", "r")  // Returns Message, not File
file.read_line()                     // No method available
file.close()                         // No method available
```

### Implementation Guidance Provided

**Step 1: Add File to Value enum**
```rust
pub enum Value {
    // ... existing
    File {
        handle: Rc<RefCell<std::fs::File>>,
        path: String,
        mode: String,
    },
}
```

**Step 2: Implement open() builtin**
```rust
"open" => {
    let file = std::fs::File::open(path)?;
    Ok(Value::File {
        handle: Rc::new(RefCell::new(file)),
        path: path.to_string(),
        mode: mode.to_string(),
    })
}
```

**Step 3: Add File methods** (.read_line(), .close(), .write_line())

### ruchydbg Debugging Provided

**Locations to check:**
- `runtime/interpreter.rs` - Value enum
- `runtime/builtins.rs` - open() implementation
- `runtime/eval_method_dispatch.rs` - File method dispatch

**GDB Commands:**
```bash
cd /home/noah/src/ruchy
ruchydbg validate test/issue-116-file-methods.ruchy

# Check what open() returns:
break builtins.rs::<open_implementation>
run
print return_value
```

### GitHub Issue Update

✅ **Issue #116 Updated**: https://github.com/paiml/ruchy/issues/116
- v3.177.0 verification (NOT FIXED)
- Complete implementation guidance
- ruchydbg debugging workflow provided
- Required API specification

---

## Benchmark Impact Assessment

### BENCH-002: Matrix Multiplication ✅ CAN NOW RUN (with workaround)

**Status:** UNBLOCKED (with caveat)

**Why:** Global mutable state now persists, so LCG PRNG will work correctly.

**Workaround for double-evaluation:**
```ruchy
let mut lcg_state = 1

fun lcg_rand() {
    lcg_state = (lcg_state * 1103515245 + 12345) % 2147483648
    lcg_state
}

// ✅ Correct usage (avoids double-evaluation):
let random_val = lcg_rand()
println("Random:", random_val)

// ❌ Avoid (will call lcg_rand twice):
// println("Random:", lcg_rand())
```

**Action:** Can attempt BENCH-002 with workaround applied.

### BENCH-006: File Line Processing ❌ STILL BLOCKED

**Status:** BLOCKED

**Requires:**
- File object implementation
- .read_line() method
- .close() method

**Action:** Wait for Issue #116 resolution.

### BENCH-001: File I/O (10MB) ⚠️ PARTIALLY UNBLOCKED

**Status:** Can use `read_file()` but not optimal

**Current capability (v3.177.0):**
```ruchy
let content = read_file("large_file.txt")  // Works!
let lines = content.split("\n")
// Process lines...
```

**Still needs for optimal implementation:**
- Streaming I/O (Issue #116)
- Memory-efficient line-by-line reading

**Action:** Can run with `read_file()` workaround, but not ideal for 10MB file.

### BENCH-009: JSON Parsing ✅ FULLY READY

**Status:** READY TO RUN

**APIs available (v3.176.0+):**
- ✅ `parse_json()` 
- ✅ `read_file()`

**Action:** RUN IMMEDIATELY!

---

## Summary & Recommendations

### Immediate Actions (Can Do Now)

1. **✅ RUN BENCH-009** (JSON parsing)
   ```bash
   cd test/ch21-benchmarks
   ./run-bench-009-full.sh
   ```

2. **✅ TRY BENCH-002** (Matrix multiplication with workaround)
   - Apply double-evaluation workaround
   - Test if benchmark runs successfully
   - Document any remaining issues

3. **✅ RUN BENCH-001** (with read_file() workaround)
   - Use whole-file reading
   - Note performance on 10MB file
   - Document limitations

### Awaiting Upstream Fixes

1. **NEW ISSUE NEEDED**: Double-evaluation bug
   - Functions called twice in println() arguments
   - Affects any side-effecting function calls
   - Workaround available but non-intuitive

2. **Issue #116**: File object methods
   - Blocks BENCH-006 completely
   - Limits BENCH-001 to suboptimal approach
   - Complete implementation guidance provided

### Progress Summary

**v3.177.0 Achievements:**
- ✅ Fixed core Issue #119 (global state persistence)
- ✅ Enables BENCH-002 to run (with workaround)
- ✅ Maintains all v3.176.0 capabilities (parse_json, read_file)

**v3.177.0 Remaining Issues:**
- ❌ Double-evaluation bug (NEW)
- ❌ File object methods (Issue #116)

**Benchmarks Status:**
- ✅ 7 working (BENCH-003, 004, 005, 007, 008, 011, 012)
- ✅ 1 ready (BENCH-009)
- ✅ 1 newly unblocked (BENCH-002 - with workaround)
- ⚠️ 1 partially unblocked (BENCH-001 - suboptimal)
- ❌ 1 blocked (BENCH-006 - needs File object)
- ⏳ 1 pending (BENCH-010 - HTTP mock)

**Total: 9-10/12 benchmarks can run (75-83% coverage)**

---

## Test Files Created

1. `/tmp/test-global-debug.ruchy` - Demonstrates double-evaluation
2. `/tmp/test-global-separate.ruchy` - Shows workaround
3. `/tmp/test-file-apis.ruchy` - File API investigation
4. `test/issue-119-global-mut.ruchy` - Original Issue #119 test
5. `test/issue-116-file-methods.ruchy` - Original Issue #116 test

---

## GitHub Issues Updated

✅ **Issue #119**: https://github.com/paiml/ruchy/issues/119
- Status: PARTIALLY FIXED (core issue resolved, new bug found)
- Comprehensive verification report
- ruchydbg debugging workflow
- Workaround documented

✅ **Issue #116**: https://github.com/paiml/ruchy/issues/116
- Status: NOT FIXED
- Complete verification showing Message type still returned
- Implementation guidance with code examples
- ruchydbg debugging workflow

---

**Next Steps:**
1. Run BENCH-009 immediately (fully ready)
2. Attempt BENCH-002 with workaround
3. Document double-evaluation bug in new issue
4. Update Chapter 21 with v3.177.0 results
5. Wait for File object implementation (Issue #116)

