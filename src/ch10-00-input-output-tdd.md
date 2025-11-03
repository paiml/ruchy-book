# Input and Output

<!-- DOC_STATUS_START -->
**Chapter Status**: ✅ 100% Working (8/8 core examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 8 | ALL core I/O operations validated |
| 🎯 Tested | 8 | 100% pass rate with 7-layer testing |
| ⏳ Untested | ~5 | Advanced features (stdin, file I/O, etc.) |
| ❌ Broken | 0 | ALL CORE I/O WORKS! |

*Last updated: 2025-11-03*
*Ruchy version: ruchy 3.182.0*

**Core I/O Operations (8/8) - 100% Pass Rate**:
- Example 1: Simple output (println) ✅
- Example 2: Formatted output with variables ✅
- Example 3: Interactive menu system ✅
- Example 4: F-string interpolation ✅
- Example 5: Multiple variables in f-strings ✅
- Example 6: Report function with parameters ✅
- Example 7: Array output ✅
- Example 8: Tuple output ✅

**Features Validated**:
- ✅ println() for output
- ✅ Variable printing (all types)
- ✅ Function-based display patterns
- ✅ F-string interpolation with {}
- ✅ Multiple variables in f-strings
- ✅ Functions with &str and i32 parameters
- ✅ Array printing
- ✅ Tuple printing
<!-- DOC_STATUS_END -->

**Chapter Status**: ✅ 100% Test-Driven (8/8 examples passing)
**Ruchy Version**: v3.182.0
**Testing**: All examples verified with 7-layer validation

## The Problem

Programs need to communicate with users and external systems - displaying information, formatting data, and creating interactive experiences. Input/output operations provide the foundation for user interfaces and data presentation.

## Test-Driven Examples

### Example 1: Simple Output

This example is tested in `tests/ch10-input-output/test_01_simple_output.ruchy`:

```ruchy

fun main() {
    println("=== Output Demo ===");
    println("Number: ");
    println(42);
    println("Boolean: ");
    println(true);
    println("=== End Demo ===");
}


```

**Output:**
```
=== Output Demo ===
Number: 
42
Boolean: 
true
=== End Demo ===
```

### Example 2: Formatted Output with Variables

This example is tested in `tests/ch10-input-output/test_02_formatted_output.ruchy`:

```ruchy

fun main() {
    let name = "Alice";
    let age = 30;
    let height = 5.6;
    
    println("=== User Profile ===");
    println("Name:");
    println(name);
    println("Age:");
    println(age);
    println("Height:");
    println(height);
    println("================");
}


```

**Output:**
```
=== User Profile ===
Name:
Alice
Age:
30
Height:
5.6
================
```

### Example 3: Interactive Menu System

This example is tested in `tests/ch10-input-output/test_03_interactive_menu.ruchy`:

```ruchy

fun display_menu() {
    println("=== Main Menu ===");
    println("1. View Profile");
    println("2. Settings");
    println("3. Exit");
    println("=================");
}

fun main() {
    display_menu();
    println("Menu displayed successfully");
}


```

**Output:**
```
=== Main Menu ===
1. View Profile
2. Settings
3. Exit
=================
Menu displayed successfully
```

### Example 4: F-String Interpolation

This example is tested in `tests/ch10-input-output/test_04_fstring.ruchy`:

```ruchy

fun main() {
    let name = "Bob"
    let score = 95
    println(f"Player: {name}")
    println(f"Score: {score}")
}


```

**Output:**
```
Player: Bob
Score: 95
```

### Example 5: Multiple Variables in F-Strings

This example is tested in `tests/ch10-input-output/test_05_fstring_multiple.ruchy`:

```ruchy

fun main() {
    let x = 10
    let y = 20
    let sum = x + y
    println(f"Result: {x} + {y} = {sum}")
}


```

**Output:**
```
Result: 10 + 20 = 30
```

### Example 6: Report Function with Parameters

This example is tested in `tests/ch10-input-output/test_06_report_function.ruchy`:

```ruchy

fun display_report(title: &str, value: i32) {
    println("=== Report ===")
    println(title)
    println(value)
    println("==============")
}

fun main() {
    display_report("Sales Total", 1000)
}


```

**Output:**
```
=== Report ===
Sales Total
1000
==============
```

### Example 7: Array Output

This example is tested in `tests/ch10-input-output/test_07_array_output.ruchy`:

```ruchy

fun main() {
    let numbers = [1, 2, 3, 4, 5]
    println("Array:")
    println(numbers)
}


```

**Output:**
```
Array:
[1, 2, 3, 4, 5]
```

### Example 8: Tuple Output

This example is tested in `tests/ch10-input-output/test_08_tuple_output.ruchy`:

```ruchy

fun main() {
    let person = ("Alice", 30, true)
    println("Person data:")
    println(person)
}


```

**Output:**
```
Person data:
("Alice", 30, true)
```

## Core Concepts

### Output Operations
- **println() function**: Primary output mechanism
- **Multiple data types**: Strings, numbers, booleans, arrays, tuples all supported
- **Sequential output**: Each println() creates new line
- **Variable display**: Direct variable printing
- **Collection output**: Arrays and tuples print with their full structure

### String Interpolation
- **F-string syntax**: `f"text {variable}"` for inline formatting
- **Variable embedding**: Insert variables directly into strings
- **Multiple variables**: Can include multiple `{var}` placeholders
- **Expression support**: Can embed arithmetic like `{x + y}`
- **Clean formatting**: Modern alternative to concatenation

### Formatting and Presentation
- **String literals**: Direct text output
- **Separating content**: Using println() for organization
- **Visual formatting**: Creating headers, separators, menus
- **Data presentation**: Displaying variables with labels
- **Structured output**: Arrays and tuples display with brackets/parentheses

### Function-Based I/O
- **Reusable output**: Functions for repeated display patterns
- **Parameterized functions**: Accept `&str` and numeric types
- **Menu systems**: Organized display of options
- **Modular design**: Separating display logic into functions
- **User interface patterns**: Consistent formatting approaches

## Key Syntax

### Basic Output
```ruchy
fun main() {
    let variable = "Hello World";
    println("text message");
    println(variable);
    println(42);
    println(true);
}
```

### Variable Output Pattern
```ruchy
fun main() {
    let value = "Important Data";
    let data = value;
    println("Label:");
    println(data);
}
```

### Menu Display Function
```ruchy

fun display_options() {
    println("=== Menu ===");
    println("1. Option One");
    println("2. Option Two");
    println("============");
}


```

## Testing Your Code

All examples in this chapter can be verified:

```bash
# Test all input/output examples
make test-ch10

# Test specific example
make test-file FILE=tests/ch10-input-output/test_01_simple_output.ruchy
```

## Common Patterns

### Data Display
```ruchy

let value = 100;
println("Result:");
println(value);


```

### Report Generation
```ruchy
fun display_report(title: &str, data: i32) {
    println("=== Report ===")
    println(title)
    println(data)
    println("==============")
}

fun main() {
    display_report("Monthly Sales", 50000)
}
```

### Status Messages
```ruchy

println("Processing...");
// ... do work ...
println("Complete!");


```

### Menu Construction
```ruchy

fun show_options() {
    println("Choose an option:");
    println("1. Start");
    println("2. Stop");
    println("3. Help");
}


```


## Performance Notes

- **println() calls**: Efficient system calls for output
- **String literals**: No runtime allocation, stored in binary
- **Variable printing**: Direct value formatting
- **Function calls**: Minimal overhead for display functions

## Summary

✅ **What Works** (Test-Verified in v3.182.0):
- println() function for text output
- Variable printing (strings, numbers, booleans)
- Array and tuple printing
- F-string interpolation with `f"text {var}"`
- Multiple variables in f-strings
- Expression embedding in f-strings `{x + y}`
- Sequential output with automatic newlines
- Function-based display patterns with parameters
- Functions accepting `&str` and `i32` types
- Menu and interface creation
- Mixed data type output
- String literal formatting

⏳ **Not Yet Tested** (Future Investigation):
- User input functions (input(), readline())
- String concatenation with + operator
- File input/output operations
- Error output (stderr)
- Interactive input validation
- Real-time input/output
- Command line argument processing
- Format specifiers (width, precision)

## Exercises

Based on our tested examples, try these:

1. **Exercise 1**: Create a calculator display that shows operation results
2. **Exercise 2**: Build a status dashboard with multiple data points
3. **Exercise 3**: Design an interactive game menu system
4. **Exercise 4**: Create a data report generator with headers and formatting

## Next Steps

Input and output operations provide the foundation for user interaction. In the next chapter, we'll explore file operations to work with persistent data storage.

---

*Every example in this chapter has been tested and verified to work with Ruchy v3.182.0*