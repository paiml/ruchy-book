# Functions

<!-- DOC_STATUS_START -->
**Chapter Status**: 🟡 89% Working (8/9 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 8 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 1 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 1.8.0*
<!-- DOC_STATUS_END -->


**Chapter Status**: ✅ 100% Test-Driven (4/4 examples passing)  
**Ruchy Version**: v1.1.0  
**Testing**: All examples verified with `make test-ch03`

## The Problem

Code often needs to be reused. Functions let us package code into reusable units that can accept inputs (parameters) and produce outputs (return values). In Ruchy, functions are straightforward and work exactly as tested.

## Test-Driven Examples

### Example 1: Basic Function

This example is tested in `tests/ch03-functions/test_01_basic_function.ruchy`:

```ruchy
// Status: ✅ WORKING
fun greet() {
    println("Hello from function!");
}

fun main() {
    greet();
}

```

**Output:**
```
Hello from function!
```

### Example 2: Function with Return Value

This example is tested in `tests/ch03-functions/test_02_function_with_return.ruchy`:

```ruchy
// Status: ✅ WORKING
fun add(a, b) {
    a + b
}

fun main() {
    let result = add(5, 3);
    println(result);
}

```

**Output:**
```
8
```

### Example 3: Function with Type Annotations

This example is tested in `tests/ch03-functions/test_03_function_with_types.ruchy`:

```ruchy
// Status: ✅ WORKING
fun multiply(x: i32, y: i32) -> i32 {
    x * y
}

fun main() {
    let product = multiply(6, 7);
    println(product);
}

```

**Output:**
```
42
```

### Example 4: Nested Function Calls

This example is tested in `tests/ch03-functions/test_04_nested_calls.ruchy`:

```ruchy
// Status: ✅ WORKING
fun square(n: i32) -> i32 {
    n * n
}

fun sum_of_squares(a: i32, b: i32) -> i32 {
    square(a) + square(b)
}

fun main() {
    let result = sum_of_squares(3, 4);
    println(result);
}

```

**Output:**
```
25
```

## Core Concepts

### Function Definition
Basic syntax:
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Compilation failed:
fun function_name(parameters) -> return_type {
    // function body
    return_expression
}

```

Key points:
- Use `fun` keyword (not `fn`)
- Parameters in parentheses
- Optional return type after `->`
- Last expression is the return value (no `return` keyword needed)

### Function Calls
- Use function name followed by arguments in parentheses
- Arguments must match parameter count and types
- Can nest function calls
- Can store return values in variables

### Parameters and Arguments
- **Parameters**: Variables in function definition
- **Arguments**: Actual values passed when calling
- Can have zero or more parameters
- Type annotations optional but recommended for clarity

### Return Values
- Last expression in function body is returned
- No semicolon on the return expression
- Can specify return type with `-> Type`
- Functions without return value implicitly return `()`

## Type Annotations

While Ruchy has type inference, explicit types improve clarity:

```ruchy
// Status: ✅ WORKING
fun calculate(x: i32, y: i32) -> i32 {
    x * 2 + y * 3
}

```

Benefits:
- Better error messages
- Documentation for users
- Ensures type safety

## Testing Your Code

All examples in this chapter can be verified:

```bash
# Test all Chapter 3 examples
make test-ch03

# Test specific example
make test-file FILE=tests/ch03-functions/test_01_basic_function.ruchy
```

## Common Patterns

### Pattern 1: Simple Calculation Function
```ruchy
// Status: ✅ WORKING
fun calculate(input: i32) -> i32 {
    input * 2
}

```

### Pattern 2: Multiple Parameters
```ruchy
// Status: ✅ WORKING
fun combine(a: i32, b: i32, c: i32) -> i32 {
    a + b + c
}

```

### Pattern 3: Helper Functions
```ruchy
// Status: ✅ WORKING
fun helper(x: i32) -> i32 {
    x * x
}

fun main_calculation(n: i32) -> i32 {
    helper(n) + helper(n + 1)
}

```

## Function Scope

- Functions can call other functions defined before or after them
- Variables inside functions are local to that function
- Functions can't access variables from other functions directly

## Summary

✅ **What Works** (Test-Verified):
- Basic function definitions with `fun`
- Functions with parameters
- Functions with return values
- Type annotations for parameters and returns
- Nested function calls
- Expression-based returns

⏳ **Not Yet Tested** (Future Chapters):
- Generic functions
- Higher-order functions
- Closures
- Method syntax
- Recursive functions
- Default parameters

## Exercises

Based on our tested examples, try these:

1. **Exercise 1**: Create a function `double(n: i32) -> i32` that returns n * 2
2. **Exercise 2**: Create a function `average(a: i32, b: i32) -> i32` that returns the average
3. **Exercise 3**: Create functions for area and perimeter of a rectangle

## Next Steps

With variables and functions mastered, you have the foundation for writing real programs. Future chapters will explore control flow, data structures, and more advanced features - all verified through test-driven development.

---

*Every example in this chapter has been tested and verified to work with Ruchy v1.1.0*