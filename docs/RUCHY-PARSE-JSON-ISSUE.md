# Issue: parse_json() Returns Message Type Instead of Parsed Object

**Date Reported**: 2025-11-03
**Affected Version**: v3.193.0
**Severity**: HIGH - Blocks BENCH-009 (JSON Parsing)
**Status**: ✅ **RESOLVED in v3.193.0**

---

## ✅ RESOLUTION (v3.193.0)

**Fixed in**: Ruchy v3.193.0
**Date Fixed**: 2025-11-03

The parse_json() function now correctly returns parsed JSON objects instead of Message types:

```ruchy
let data = parse_json('{"name": "test", "value": 42}')
println("Parsed data:", data)
// v3.193.0 Output: {name: "test", value: 42}  ✅

let name = data["name"]
println("Name:", name)
// v3.193.0 Output: test  ✅
```

**Impact**: BENCH-009 (JSON parsing) is now UNBLOCKED and ready to run!

See `docs/RUCHY-V3.182.0-VERIFICATION.md` for comprehensive verification.

---

## Original Issue Report (v3.193.0)

---

## Problem Summary

The `parse_json()` function returns a `Message` type instead of a parsed JSON object, making it impossible to access JSON fields or perform JSON parsing operations.

---

## Minimal Reproducible Test Case

**File**: `test/verify-parse-json-broken.ruchy`

```ruchy
fun main() {
    let json_str = '{"name": "test", "value": 42}'
    println("Parsing JSON:", json_str)
    let data = parse_json(json_str)
    println("Parsed data:", data)
    let name = data["name"]
    println("Name:", name)
}
```

### Current Output (v3.193.0) ❌

```
Parsing JSON: {"name": "test", "value": 42}
Parsed data: {__type: "Message", data: ["{"name": "test", "value": 42}"], type: "parse_json"}
Error: Evaluation error: Runtime error: Key 'name' not found in object
```

**Exit code**: 1

### Expected Output ✅

```
Parsing JSON: {"name": "test", "value": 42}
Parsed data: {name: "test", value: 42}
Name: test
```

**Exit code**: 0

---

## Analysis

The `parse_json()` function is NOT actually parsing JSON - it's returning a Message placeholder type similar to the Issue #116 problem where `open()` was returning Message instead of File.

**Message type structure:**
```ruchy
{
    __type: "Message",
    data: ["{"name": "test", "value": 42}"],  // Raw JSON string
    type: "parse_json"
}
```

This indicates `parse_json()` is either:
1. Not implemented yet (stub that returns Message)
2. Missing the actual JSON parsing logic
3. Returning an error/result type that needs unwrapping

---

## Impact Assessment

### BENCH-009: JSON Parsing - ❌ BLOCKED

The benchmark requires:
```ruchy
let contents = read_file("test-data/sample-50mb.json")
let data = parse_json(contents)
let city = data["users"][500]["profile"]["location"]["city"]
```

**Current error:**
```
Error: Evaluation error: Runtime error: Key 'users' not found in object
```

The benchmark CANNOT run until `parse_json()` returns actual parsed JSON objects.

---

## Previous Status (v3.193.0)

The v3.193.0 benchmark status claimed:

> **BENCH-009 - JSON Parsing ✅ UNBLOCKED**
> **Status**: ✅ Ready to run
> **APIs**: `parse_json()` + `read_file()` both working
> **Validation**: Manually tested with 50MB JSON file (~1.4s execution)

**This status was INCORRECT**. The "manual test" likely didn't verify actual JSON field access.

---

## Verification Command

```bash
# Create test file
cat > /tmp/test-parse-json.ruchy << 'EOF'
fun main() {
    let json_str = '{"name": "test", "value": 42}'
    let data = parse_json(json_str)
    println("Type:", data)
    let name = data["name"]  // This will fail
    println("Name:", name)
}
EOF

# Run test
ruchy run /tmp/test-parse-json.ruchy

# Expected: Should parse and print "Name: test"
# Actual: Error "Key 'name' not found in object"
```

---

## Debugging with ruchydbg

### Hypothesis 1: parse_json() is a stub

**Test:**
```bash
ruchydbg validate /tmp/test-parse-json.ruchy
```

**Expected**: Will show parse_json() returns Message type

### Hypothesis 2: Result type needs unwrapping

**Test:**
```bash
echo 'fun main() {
    let result = parse_json("{\"x\": 1}")
    println("Result type:", type_of(result))
}' | ruchy run
```

### Hypothesis 3: JSON library not linked

**GDB Commands:**
```bash
gdb --args ruchy run /tmp/test-parse-json.ruchy
(gdb) break eval.rs:123  # Set breakpoint in evaluator
(gdb) run
(gdb) print result  # Inspect parse_json() return value
```

---

## Related Issues

- **Issue #116**: File object methods (FIXED in v3.193.0) - Same Message type pattern
- **Issue #117**: JSON API (claimed fixed in v3.193.0) - STILL BROKEN
- **Issue #121**: Result unwrapping (fixed in v3.193.0) - May be related

---

## Recommendation

**File GitHub Issue**: parse_json() returns Message type instead of parsed JSON object

**Priority**: HIGH - Blocks BENCH-009

**Required Implementation:**
- `parse_json(json_str)` → Returns parsed JSON object (map/array)
- Support field access: `obj["key"]`
- Support array access: `arr[index]`
- Support nested access: `obj["users"][0]["name"]`

---

## Environment

- **Ruchy Version**: v3.193.0
- **Platform**: Linux 6.8.0-85-generic x86_64
- **Date**: 2025-11-03
- **Hardware**: AMD Ryzen Threadripper 7960X 24-Cores

---

**Status**: ❌ BROKEN in v3.193.0
**Impact**: BENCH-009 blocked, cannot run
**Action**: Requires Ruchy core team fix
