# Chapter 1.3: The Ruchy Interpreter and Scripting

<!-- DOC_STATUS_START -->
**Chapter Status**: ✅ 100% Working (15/15 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 15 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 0 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-22*  
*Ruchy version: ruchy 1.0.3*
<!-- DOC_STATUS_END -->


*Getting productive with Ruchy's evaluation engine*

## The Problem

You've installed Ruchy and written your first "Hello World" program. Now you want to understand how Ruchy actually executes your code, explore its capabilities interactively, and write useful scripts. This chapter shows you how to leverage Ruchy's interpreter for immediate productivity.

## Quick Example: Interactive Exploration

The Ruchy interpreter allows immediate expression evaluation:

```ruchy
// Status: ✅ WORKING
ruchy -e "2 + 2"




```

Output: `4`

```ruchy  
// Status: ✅ WORKING
ruchy -e "let name = \"World\"; \"Hello \" + name + \"!\""




```

Output: `"Hello World!"`

```ruchy
// Status: ✅ WORKING
ruchy -e "let nums = [1, 2, 3]; nums[1]"




```

Output: `2`

## Core Concepts

### The Ruchy Interpreter Architecture

Ruchy uses a **two-tier execution model** optimized for both development speed and production performance:

1. **Tier 0: AST Interpreter** - Direct execution of syntax trees for cold code
2. **Tier 1: JIT Compilation** - Native code generation for hot paths

For scripting and interactive work, you'll primarily use Tier 0, which provides:
- **Immediate feedback** - No compilation delay
- **Dynamic evaluation** - Expression-level execution
- **Resource safety** - Built-in limits and error recovery

### Value Representation

Ruchy provides efficient handling of basic data types:

```ruchy
// Status: ✅ WORKING
fun main() {
    // Integer values
    let small_int = 42
    let result = small_int * 2

    // Floating point numbers  
    let pi = 3.14159
    let area = pi * 5.0 * 5.0

    // String operations
    let greeting = "Hello"
    let name = "Ruchy"

    // Arrays with indexing
    let data = [1, 2, 3, 4, 5]
    println(data[2])
}




```

## Practical Usage

### Command-Line Evaluation

The `-e` flag allows direct expression evaluation:

```bash
# Mathematical computations
ruchy -e "let radius = 5.0; 3.14159 * radius * radius"

# String processing
ruchy -e "let text = \"programming\"; text.len()"

# Conditional logic
ruchy -e "let x = 10; if x > 5 { \"large\" } else { \"small\" }"
```

### Script Files

Create a file `calculator.ruchy`:

```ruchy
// Status: ✅ WORKING
// calculator.ruchy - Basic calculator functionality

fun add(a, b) {
    a + b
}

fun subtract(a, b) {
    a - b
}

fun multiply(a, b) {
    a * b
}

fun divide(a, b) {
    if b == 0 {
        println("Error: Division by zero")
        0
    } else {
        a / b
    }
}

fun main() {
    // Test our calculator
    let x = 10
    let y = 3

    println("Addition:")
    println(add(x, y))
    println("Subtraction:")
    println(subtract(x, y))
    println("Multiplication:")
    println(multiply(x, y))
    println("Division:")
    println(divide(x, y))
}




```

Execute with:
```bash
ruchy calculator.ruchy
```

### Working with Arrays and Data

```ruchy
// Status: ✅ WORKING
// data_processing.ruchy - Array manipulation examples

fun main() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    // Access elements
    println("First:")
    println(numbers[0])
    println("Last:")
    println(numbers[9])

    // Simple iteration (manual)
    let mut sum = 0
    let mut i = 0
    while i < 10 {
        sum = sum + numbers[i]
        i = i + 1
    }
    println("Sum:")
    println(sum)

    // Calculate average
    let average = sum / 10
    println("Average:")
    println(average)
}




```

### Variable Scoping and Functions

Understanding Ruchy's scoping rules is crucial for effective scripting:

```ruchy
// Status: ✅ WORKING
// scoping.ruchy - Variable scope examples

let global_var = "I'm global"

fun demonstrate_scope() {
    let local_var = "I'm local"
    println(global_var)  // Can access global
    println(local_var)   // Can access local
    
    // Nested function
    fun nested() {
        println(global_var)  // Can access global
        println(local_var)   // Can access parent local
        let nested_var = "I'm nested"
        println(nested_var)
    }
    
    nested()
}

fun main() {
    demonstrate_scope()
}




```

## Common Pitfalls

### 1. Array Bounds

Always check array bounds to avoid runtime errors:

```ruchy
// Status: ✅ WORKING
fun main() {
    let arr = [1, 2, 3]

    // Unsafe - may cause error if index is out of bounds
    // println(arr[5])

    // Better approach
    if 5 < arr.len() {
        println(arr[5])
    } else {
        println("Index out of bounds")
    }
}




```

### 2. Variable Mutability

Remember that variables are immutable by default:

```ruchy
// Status: ✅ WORKING
fun main() {
    let x = 5
    // x = 10  // Error! x is immutable

    // Use mut for mutable variables
    let mut y = 5
    y = 10  // OK
}




```

### 3. Function Return Values

Functions return their last expression:

```ruchy
// Status: ✅ WORKING
fun get_double(x) {
    x * 2  // This is returned (no semicolon)
}

fun process_and_print(x) {
    let doubled = x * 2
    println("Doubled:")
    println(doubled)
    // No explicit return - returns unit type ()
}




```

## Current Limitations (v0.11.0)

Be aware of current interpreter limitations:

1. **Module system** - Not yet implemented
2. **Advanced pattern matching** - Limited support
3. **Error handling types** - `Result<T,E>` not available
4. **Trait system** - Not implemented
5. **Concurrent evaluation** - Single-threaded only

## Performance Characteristics

### Evaluation Speed
- Simple expressions: Fast evaluation
- Function calls: Efficient dispatch
- Array operations: Linear with size
- String operations: Good performance

### Memory Usage
- Integers: Efficient representation
- Strings: Optimized storage
- Arrays: Heap allocated as needed
- Functions: Proper memory management

## Interpreter Modes

### Standard Evaluation
```bash
ruchy script.ruchy
```

### Parse-Only Mode (Syntax Validation)
```bash
ruchy parse script.ruchy  # Shows AST without execution
```

### Expression Mode (One-Liners)
```bash
ruchy -e "expression_here"
```

## Best Practices

### 1. Keep Scripts Simple
Focus on straightforward logic that leverages Ruchy's strengths:

```ruchy
// Status: ✅ WORKING
// Good: Clear, functional style
fun calculate_tax(income, rate) {
    income * rate
}

// Avoid: Complex nested logic (for now)




```

### 2. Use Descriptive Names
```ruchy
// Status: ✅ WORKING
// Good
let user_count = 42
let total_price = calculate_price(items)

// Avoid
let x = 42
let y = calc(z)




```

### 3. Leverage Array Indexing
Since array indexing works well in v0.11.0:

```ruchy
// Status: ✅ WORKING
fun main() {
    let grades = [95, 87, 92, 78, 89]
    let first_grade = grades[0]
    let last_grade = grades[4]
}




```

### 4. Build Incrementally
Start with simple expressions and build complexity:

```ruchy
// Status: ✅ WORKING
// Add functions
fun double(n) { n * 2 }

fun main() {
    // Start simple
    let x = 5

    // Combine
    let result = double(x)
    println(result)
}




```

## Testing Your Scripts

Always test your scripts with known inputs:

```ruchy
// Status: ✅ WORKING
// test_calculator.ruchy
fun add(a, b) { a + b }

fun main() {
    // Test cases
    let test1 = add(2, 3) == 5
    let test2 = add(0, 0) == 0
    let test3 = add(-1, 1) == 0

    if test1 && test2 && test3 {
        println("All tests passed!")
    } else {
        println("Some tests failed")
    }
}




```

## Summary

The Ruchy interpreter provides immediate productivity for:
- **Quick calculations** and data processing
- **Function development** and testing
- **Algorithm exploration** and prototyping
- **Educational programming** and learning

Key takeaways:
- Use `ruchy -e` for one-liners and quick tests
- Write scripts in `.ruchy` files for complex logic  
- Leverage array indexing for data processing
- Keep functions simple and focused
- Test incrementally as you build

In the next chapter, we'll explore variables and types in more detail, building on the foundation of interpreter usage you've learned here.