# Control Flow

<!-- DOC_STATUS_START -->
**Chapter Status**: ✅ 100% Working (7/7 core examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 7 | ALL core control flow validated |
| 🎯 Tested | 7 | 100% pass rate with 7-layer testing |
| ⏳ Untested | ~7 | DataFrame examples (advanced) |
| ❌ Broken | 0 | ALL CONTROL FLOW WORKS! |

*Last updated: 2025-11-02*
*Ruchy version: ruchy 3.175.0*

**Core Control Flow (7/7) - 100% Pass Rate**:
- Example 1: If/else ✅
- Example 2: If without else ✅
- Example 3: If/else if/else chains ✅
- Example 4: While loop (with let mut) ✅
- Example 5: For loop with range ✅
- Example 6: Match expression ✅
- Example 7: Break and continue ✅

**Features Validated**:
- ✅ let mut (mutable variables)
- ✅ while loops
- ✅ for..in with ranges (0..3)
- ✅ match expressions with wildcard
- ✅ break statement
- ✅ continue statement
- ✅ if/else conditionals

**DataFrame Examples**: Untested (require DataFrame, advanced iteration)
<!-- DOC_STATUS_END -->


**Chapter Status**: ✅ 100% Test-Driven (7/7 examples passing)
**Ruchy Version**: v1.84.0
**Testing**: All examples verified with `make test-ch05` and 7-layer validation

## The Problem

Programs need to make decisions and repeat actions. Control flow structures like conditionals, loops, and pattern matching allow programs to respond to different situations and process data efficiently.

## Test-Driven Examples

### Example 1: Basic If/Else

This example is tested in `tests/ch05-control-flow/test_01_if_else.ruchy`:

```ruchy

fun main() {
    let x = 10;
    if x > 5 {
        println("x is greater than 5");
    } else {
        println("x is not greater than 5");
    }
}


```

**Output:**
```
x is greater than 5
```

### Example 2: If Without Else

This example is tested in `tests/ch05-control-flow/test_02_if_only.ruchy`:

```ruchy

fun main() {
    let score = 85;
    if score >= 80 {
        println("Great job!");
    }
    println("Score processed");
}


```

**Output:**
```
Great job!
Score processed
```

### Example 3: If/Else If/Else Chains

This example is tested in `tests/ch05-control-flow/test_03_if_else_if.ruchy`:

```ruchy

fun main() {
    let grade = 75;
    if grade >= 90 {
        println("A grade");
    } else if grade >= 80 {
        println("B grade");
    } else if grade >= 70 {
        println("C grade");
    } else {
        println("Below C");
    }
}


```

**Output:**
```
C grade
```

### Example 4: While Loop

This example is tested in `tests/ch05-control-flow/test_04_while_loop.ruchy`:

```ruchy

fun main() {
    let mut i = 0;
    while i < 3 {
        println(i);
        i = i + 1;
    }
    println("Done");
}


```

**Output:**
```
0
1
2
Done
```

### Example 5: For Loop with Range

This example is tested in `tests/ch05-control-flow/test_05_for_loop.ruchy`:

```ruchy

fun main() {
    for i in 0..3 {
        println(i);
    }
    println("For loop done");
}


```

**Output:**
```
0
1
2
For loop done
```

### Example 6: Match Expression

This example is tested in `tests/ch05-control-flow/test_06_match.ruchy`:

```ruchy

fun main() {
    let number = 2;
    match number {
        1 => println("One"),
        2 => println("Two"),
        3 => println("Three"),
        _ => println("Other")
    }
}


```

**Output:**
```
Two
```

### Example 7: Break and Continue

This example is tested in `tests/ch05-control-flow/test_07_break_continue.ruchy`:

```ruchy

fun main() {
    let mut i = 0;
    while i < 10 {
        i = i + 1;
        if i == 3 {
            continue;
        }
        if i == 6 {
            break;
        }
        println(i);
    }
    println("Loop ended");
}


```

**Output:**
```
1
2
4
5
Loop ended
```

## Core Concepts

### Conditional Statements
- **If statements**: Execute code based on conditions
- **Else clauses**: Alternative execution path
- **Else if**: Chain multiple conditions
- **Syntax**: `if condition { ... } else { ... }`

### Loop Constructs
- **While loops**: Repeat while condition is true
- **For loops**: Iterate over ranges or collections
- **Break**: Exit loop early
- **Continue**: Skip to next iteration

### Pattern Matching
- **Match expressions**: Choose execution path based on value
- **Arms**: Each pattern => action pair
- **Wildcard**: `_` matches any value
- **Exhaustiveness**: All possible values must be covered

### Mutability
- Variables in loops often need `mut` keyword
- Allows modification of variable values
- Required for loop counters and accumulators

## Key Syntax

### Conditionals
```ruchy
fun main() {
    let x = 10;
    let y = 5;

    if x > y {
        println("x is greater");
    } else if x < y {
        println("y is greater");
    } else {
        println("they are equal");
    }
}
```

### Loops
```ruchy
fun main() {
    // While loop
    let mut count = 0;
    while count < 3 {
        println("Count:", count);
        count = count + 1;
    }

    // For loop with range
    for i in 1..4 {
        println("Iteration:", i);
    }
}
```

### Match
```ruchy
fun main() {
    let number = 2;
    match number {
        1 => println("One"),
        2 => println("Two"),
        3 => println("Three"),
        _ => println("Other")
    }
}
```

## Testing Your Code

All examples in this chapter can be verified:

```bash
# Test all control flow examples
make test-ch05

# Test specific example
make test-file FILE=tests/ch05-control-flow/test_01_if_else.ruchy
```

## Common Patterns

### Decision Making
```ruchy
fun main() {
    let user_input = 75;
    let threshold = 50;

    if user_input > threshold {
        println("High value:", user_input);
    } else {
        println("Normal value:", user_input);
    }
}
```

### Counting Loop
```ruchy
fun main() {
    let mut count = 0;
    while count < 10 {
        println("Count is:", count);
        count = count + 1;
    }
}
```

### Range Processing
```ruchy
fun main() {
    for i in 1..5 {
        println("Processing item", i);
    }
}
```

### Value Classification
```ruchy
fun main() {
    let status_code = 200;
    match status_code {
        200 => println("Success"),
        404 => println("Not Found"),
        500 => println("Server Error"),
        _ => println("Unknown Status")
    }
}
```

## Performance Notes

- **If statements**: Very fast, compile to conditional jumps
- **While loops**: Efficient for unknown iteration counts
- **For loops**: Optimized for known ranges
- **Match**: Often optimized to jump tables

## Summary

✅ **What Works** (Test-Verified in v1.10.0):
- If/else statements with boolean conditions
- If without else (optional else)
- If/else if/else chains
- While loops with mutable variables
- For loops with range syntax (start..end)
- Match expressions with multiple arms
- Break and continue statements
- Mutable variables with `mut` keyword

⏳ **Not Yet Tested** (Future Investigation):
- Match with complex patterns (structs, enums)
- Nested loops
- Loop labels
- For loops with collections (not ranges)
- Complex boolean logic (&&, ||)

## Exercises

Based on our tested examples, try these:

1. **Exercise 1**: Create a grade calculator using if/else if chains
2. **Exercise 2**: Write a countdown loop using while
3. **Exercise 3**: Use match to handle different menu choices
4. **Exercise 4**: Create a number guessing game with loops and conditionals

## Next Steps

Control flow gives you the tools to build interactive and dynamic programs. In the next chapter, we'll explore data structures to organize and manipulate collections of data.

---

*Every example in this chapter has been tested and verified to work with Ruchy v1.10.0*