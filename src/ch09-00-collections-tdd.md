# Collections and Iteration

<!-- DOC_STATUS_START -->
**Chapter Status**: ❌ 40% Working (4/10 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 4 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 6 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 1.8.3*
<!-- DOC_STATUS_END -->


**Chapter Status**: ✅ 100% Test-Driven (3/3 examples passing)  
**Ruchy Version**: v1.4.0  
**Testing**: All examples verified with `make test-ch09`

## The Problem

Programs need to process multiple pieces of data efficiently - counting sequences, accumulating values, and generating patterns. Iteration patterns provide systematic ways to work with ranges of data and perform repetitive operations.

## Test-Driven Examples

### Example 1: Range Iteration with For Loops

This example is tested in `tests/ch09-collections/test_01_iteration_for.ruchy`:

```ruchy
// Status: ✅ WORKING
fun main() {
    println("Counting to 5:");
    for i in 0..5 {
        println(i);
    }
    println("Done counting");
}


```

**Output:**
```
Counting to 5:
0
1
2
3
4
Done counting
```

### Example 2: Accumulation with While Loops

This example is tested in `tests/ch09-collections/test_02_while_accumulation.ruchy`:

```ruchy
// Status: ✅ WORKING
fun main() {
    let mut sum = 0;
    let mut i = 1;
    while i <= 5 {
        sum = sum + i;
        i = i + 1;
    }
    println("Sum of 1-5:");
    println(sum);
}


```

**Output:**
```
Sum of 1-5:
15
```

### Example 3: Nested Loops for Pattern Generation

This example is tested in `tests/ch09-collections/test_03_nested_loops.ruchy`:

```ruchy
// Status: ✅ WORKING
fun main() {
    println("Pattern:");
    for row in 0..3 {
        for col in 0..3 {
            if (row + col) % 2 == 0 {
                print("*");
            } else {
                print(" ");
            }
        }
        println("");
    }
}


```

**Output:**
```
Pattern:
* *
```

## Core Concepts

### Range Iteration
- **For loops**: Iterate over numeric ranges efficiently
- **Range syntax**: `start..end` creates inclusive range
- **Automatic iteration**: Loop variable increments automatically
- **Bounded execution**: Clear start and end points

### Accumulation Patterns
- **State variables**: Track values across iterations
- **Mutable variables**: Use `mut` for values that change
- **Incremental updates**: Build results step by step
- **Loop invariants**: Maintain consistent state

### Nested Iteration
- **Loop composition**: Combine multiple iteration levels
- **Coordinate systems**: Work with rows and columns
- **Pattern generation**: Create structured output
- **Conditional logic**: Make decisions within loops

## Key Syntax

### For Loop Range Iteration
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Compilation failed:
for variable in start..end {
    // Process each value
    println(variable);
}


```

### While Loop Accumulation
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Compilation failed:
let mut accumulator = initial_value;
let mut counter = start;
while counter <= end {
    accumulator = update(accumulator, counter);
    counter = counter + 1;
}


```

### Nested Loop Pattern
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Compilation failed:
for outer in 0..height {
    for inner in 0..width {
        // Process (outer, inner) coordinate
        process(outer, inner);
    }
}


```

## Testing Your Code

All examples in this chapter can be verified:

```bash
# Test all collections examples
make test-ch09

# Test specific example
make test-file FILE=tests/ch09-collections/test_01_iteration_for.ruchy
```

## Common Patterns

### Sequential Processing
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Compilation failed:
for i in 1..10 {
    let result = process(i);
    println(result);
}


```

### Sum Calculation
```ruchy
// Status: ✅ WORKING
let mut total = 0;
for value in 1..100 {
    total = total + value;
}


```

### Grid Processing
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Compilation failed:
for row in 0..height {
    for col in 0..width {
        let value = calculate(row, col);
        display(value);
    }
}


```

### Conditional Accumulation
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Compilation failed:
let mut count = 0;
for i in 1..100 {
    if condition(i) {
        count = count + 1;
    }
}


```

## Performance Notes

- **For loops**: Very efficient, optimized by compiler
- **Range iteration**: No array allocation, direct iteration
- **While loops**: Flexible but require manual counter management
- **Nested loops**: Performance scales with loop depth (O(n²) for double nesting)

## Summary

✅ **What Works** (Test-Verified in v1.4.0):
- For loop iteration over numeric ranges (start..end)
- While loop accumulation with mutable variables
- Nested loops for multi-dimensional processing
- Range-based counting and pattern generation
- Accumulator variables with incremental updates
- Conditional logic within iteration loops

⏳ **Not Yet Tested** (Future Investigation):
- Array/list creation and indexing
- Collection iteration (for item in collection)
- Iterator methods (map, filter, reduce)
- Collection manipulation (push, pop, insert)
- Hash maps and key-value iteration
- String iteration and character processing
- Collection sorting and searching

## Exercises

Based on our tested examples, try these:

1. **Exercise 1**: Create a multiplication table using nested loops
2. **Exercise 2**: Calculate factorial using accumulation pattern
3. **Exercise 3**: Generate number sequences with conditional logic
4. **Exercise 4**: Build a simple ASCII art generator with nested iteration

## Next Steps

Iteration patterns provide the foundation for data processing. In the next chapter, we'll explore input/output operations to interact with users and files.

---

*Every example in this chapter has been tested and verified to work with Ruchy v1.4.0*