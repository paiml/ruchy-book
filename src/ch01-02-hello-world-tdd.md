# Hello, World!

<!-- DOC_STATUS_START -->
**Chapter Status**: ✅ 100% Working (6/6 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 6 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 0 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 1.10.0*
<!-- DOC_STATUS_END -->


**Chapter Status**: ✅ 100% Test-Driven (3/3 examples passing)  
**Ruchy Version**: v1.10.0  
**Testing**: All examples verified with `make test-ch01`

## The Problem

Every programming journey begins with "Hello, World!" - your first proof that you can make a computer speak. In Ruchy, this first step is immediate and works exactly as tested.

## Test-Driven Examples

### Example 1: Basic Hello World

This example is tested in `tests/ch01-hello-world/test_01_basic.ruchy`:

```ruchy
// Status: ✅ WORKING
fun main() {
    println("Hello, World!");
}


```

**Output:**
```
Hello, World!
```

**How to run:**
```bash
ruchy compile hello.ruchy && ./a.out
```

### Example 2: Multiple Print Statements

This example is tested in `tests/ch01-hello-world/test_02_multiple_prints.ruchy`:

```ruchy
// Status: ✅ WORKING
fun main() {
    println("Hello,");
    println("World!");
}


```

**Output:**
```
Hello,
World!
```

### Example 3: Using Variables

This example is tested in `tests/ch01-hello-world/test_03_with_variable.ruchy`:

```ruchy
// Status: ✅ WORKING
fun main() {
    let greeting = "Hello, World!";
    println(greeting);
}


```

**Output:**
```
Hello, World!
```

## Core Concepts

### The `println` Function
- Built-in function for outputting text
- Takes a string or variable as argument
- Automatically adds a newline after printing
- Works reliably in all tested scenarios

### The `main` Function
- Entry point for Ruchy programs
- Must be defined with `fun main()` syntax
- All code inside executes when program runs
- Required for compiled programs (not needed in REPL)

### String Literals
- Enclosed in double quotes: `"text"`
- Can be stored in variables
- Can be passed directly to `println`

## Testing Your Code

All examples in this chapter can be verified:

```bash
# Test all Chapter 1 examples
make test-ch01

# Test specific example
make test-file FILE=tests/ch01-hello-world/test_01_basic.ruchy
```

## Common Patterns

### Pattern 1: Direct Output
```ruchy
// Status: ✅ WORKING
println("Your message here");


```

### Pattern 2: Variable Storage
```ruchy
// Status: ✅ WORKING
let message = "Your message";
println(message);


```

### Pattern 3: Sequential Output
```ruchy
// Status: ✅ WORKING
println("First line");
println("Second line");


```

## Summary

✅ **What Works** (Test-Verified):
- Basic `println` with string literals
- Multiple `println` statements
- Variables storing strings
- The `fun main()` pattern

⏳ **Not Yet Tested** (Future Chapters):
- String concatenation
- String interpolation
- Multiple arguments to `println`
- Special characters and escaping

## Exercises

Based on our tested examples, try these variations:

1. **Exercise 1**: Modify the basic Hello World to print your name
2. **Exercise 2**: Create a program with three `println` statements
3. **Exercise 3**: Store two different greetings in variables and print both

## Next Steps

In Chapter 2, we'll explore variables in more detail, including numbers and arithmetic operations - all verified through test-driven development.

---

*Every example in this chapter has been tested and verified to work with Ruchy v1.10.0*