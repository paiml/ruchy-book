# Chapter 13: Debugging and Tracing

When developing programs, understanding how your code executes is crucial. Ruchy provides powerful debugging and tracing tools that help you see exactly what your functions are doing, what values they receive, and what they return—all with full type information.

> **⚠️ Important Note (v3.149.0)**: This chapter's examples originally showed `ruchy --trace -e`, but in v3.149.0, the `-e` flag has [known issues](../docs/bugs/ruchy-v3.149.0-eval-flag-bug.md). The **working method** is:
> ```bash
> echo 'EXPR' | RUCHY_TRACE=1 ruchy
> ```
> All examples below work correctly with this approach. See [trace flag inconsistency bug](../docs/bugs/ruchy-v3.149.0-trace-flag-inconsistency.md) for details.

## Why Debugging Tools Matter

Debugging is not just about fixing errors—it's about understanding program flow, validating assumptions, and learning how your code behaves. Traditional print debugging (`println!`) scatters your code with temporary statements that you must remember to remove. Ruchy's built-in tracing gives you professional debugging capabilities without modifying your source code.

## Type-Aware Function Tracing

Ruchy's `RUCHY_TRACE` environment variable enables automatic tracing of all function calls with complete type information. Every function entry and exit is logged, showing argument values with their types and return values with their types.

### Basic Tracing

Let's start with a simple example:

```ruchy
fun square(x) {
    x * x
}

square(5)
```

Run this with tracing enabled:

```bash
$ echo 'fun square(x) { x * x }; square(5)' | RUCHY_TRACE=1 ruchy
TRACE: → square(5: integer)
TRACE: ← square = 25: integer
25
```

The trace output shows:
- `→` indicates function entry with arguments and their types
- `←` indicates function exit with return value and its type
- Each value is annotated with its type (`: integer`, `: string`, etc.)

### Understanding Type Annotations

Ruchy's tracer automatically determines and displays the type of every value:

```ruchy
fun greet(name) {
    "Hello, " + name
}

greet("Alice")
```

```bash
$ echo 'fun greet(name) { "Hello, " + name }; greet("Alice")' | RUCHY_TRACE=1 ruchy
TRACE: → greet("Alice": string)
TRACE: ← greet = "Hello, Alice": string
"Hello, Alice"
```

Notice how string values are shown in quotes with `: string` type annotation.

### Multiple Arguments

Functions with multiple arguments show all parameters with their types:

```ruchy
fun add(a, b) {
    a + b
}

add(10, 20)
```

```bash
$ echo 'fun add(a, b) { a + b }; add(10, 20)' | RUCHY_TRACE=1 ruchy
TRACE: → add(10: integer, 20: integer)
TRACE: ← add = 30: integer
30
```

### Different Types

The tracer supports all Ruchy types. Here are some common examples:

**Boolean values:**
```ruchy
fun is_even(n) {
    n % 2 == 0
}

is_even(42)
```

```bash
$ echo 'fun is_even(n) { n % 2 == 0 }; is_even(42)' | RUCHY_TRACE=1 ruchy
TRACE: → is_even(42: integer)
TRACE: ← is_even = true: boolean
true
```

**Floating-point numbers:**
```ruchy
fun divide(a, b) {
    a / b
}

divide(10.5, 2.5)
```

```bash
$ echo 'fun divide(a, b) { a / b }; divide(10.5, 2.5)' | RUCHY_TRACE=1 ruchy
TRACE: → divide(10.5: float, 2.5: float)
TRACE: ← divide = 4.2: float
4.2
```

**Arrays:**
```ruchy
fun process(arr) {
    arr
}

process([1, 2, 3])
```

```bash
$ echo 'fun process(arr) { arr }; process([1, 2, 3])' | RUCHY_TRACE=1 ruchy
TRACE: → process([1, 2, 3]: array)
TRACE: ← process = [1, 2, 3]: array
[1, 2, 3]
```

## Tracing Recursive Functions

One of the most powerful uses of tracing is understanding recursive function calls. The tracer shows the complete call stack as your function recurses:

### Factorial Example

```ruchy
fun factorial(n) {
    if n <= 1 {
        1
    } else {
        n * factorial(n - 1)
    }
}

factorial(4)
```

```bash
$ echo 'fun factorial(n) { if n <= 1 { 1 } else { n * factorial(n - 1) } }; factorial(4)' | RUCHY_TRACE=1 ruchy
TRACE: → factorial(4: integer)
TRACE: → factorial(3: integer)
TRACE: → factorial(2: integer)
TRACE: → factorial(1: integer)
TRACE: ← factorial = 1: integer
TRACE: ← factorial = 2: integer
TRACE: ← factorial = 6: integer
TRACE: ← factorial = 24: integer
24
```

The trace reveals the recursive call pattern:
1. `factorial(4)` calls `factorial(3)`
2. `factorial(3)` calls `factorial(2)`
3. `factorial(2)` calls `factorial(1)`
4. `factorial(1)` returns `1` (base case)
5. Results propagate back: `2`, `6`, `24`

### Fibonacci Sequence

The Fibonacci sequence demonstrates a more complex recursive pattern with multiple recursive calls:

```ruchy
fun fibonacci(n) {
    if n <= 1 {
        n
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}

fibonacci(5)
```

```bash
$ echo 'fun fibonacci(n) { if n <= 1 { n } else { fibonacci(n-1) + fibonacci(n-2) } }; fibonacci(5)' | RUCHY_TRACE=1 ruchy
TRACE: → fibonacci(5: integer)
TRACE: → fibonacci(4: integer)
TRACE: → fibonacci(3: integer)
TRACE: → fibonacci(2: integer)
TRACE: → fibonacci(1: integer)
TRACE: ← fibonacci = 1: integer
TRACE: → fibonacci(0: integer)
TRACE: ← fibonacci = 0: integer
TRACE: ← fibonacci = 1: integer
TRACE: → fibonacci(1: integer)
TRACE: ← fibonacci = 1: integer
TRACE: ← fibonacci = 2: integer
TRACE: → fibonacci(2: integer)
TRACE: → fibonacci(1: integer)
TRACE: ← fibonacci = 1: integer
TRACE: → fibonacci(0: integer)
TRACE: ← fibonacci = 0: integer
TRACE: ← fibonacci = 1: integer
TRACE: ← fibonacci = 3: integer
TRACE: → fibonacci(3: integer)
TRACE: → fibonacci(2: integer)
TRACE: → fibonacci(1: integer)
TRACE: ← fibonacci = 1: integer
TRACE: → fibonacci(0: integer)
TRACE: ← fibonacci = 0: integer
TRACE: ← fibonacci = 1: integer
TRACE: → fibonacci(1: integer)
TRACE: ← fibonacci = 1: integer
TRACE: ← fibonacci = 2: integer
TRACE: ← fibonacci = 5: integer
```

This trace shows:
- Each recursive call spawns two more calls
- The computation tree is visible in the trace
- You can see duplicate computations (e.g., `fibonacci(3)` is computed twice)
- This visualization makes optimization opportunities obvious

## Practical Debugging Scenarios

### Debugging Logic Errors

When your function returns unexpected results, tracing helps identify where things go wrong:

```ruchy
fun compute(x) {
    let y = x * 2
    y + 10
}

compute(5)
```

```bash
$ echo 'fun compute(x) { let y = x * 2; y + 10 }; compute(5)' | RUCHY_TRACE=1 ruchy
TRACE: → compute(5: integer)
TRACE: ← compute = 20: integer
20
```

You can verify:
- Input value and type (5: integer)
- Return value and type (20: integer)
- The computation: 5 * 2 = 10, then 10 + 10 = 20 ✓

### Tracing with Script Files

For larger programs, you can trace script files:

**debug_example.ruchy:**
```ruchy
fun calculate_discount(price, percent) {
    price * (1.0 - percent / 100.0)
}

calculate_discount(100.0, 20.0)
```

Run with tracing:
```bash
$ ruchy --trace debug_example.ruchy
TRACE: → calculate_discount(100.0: float, 20.0: float)
TRACE: ← calculate_discount = 80.0: float
```

## Type Reference

Ruchy's tracer supports all 20+ built-in types. Here's a quick reference:

| Type | Example Value | Trace Format |
|------|---------------|--------------|
| integer | 42 | `42: integer` |
| float | 3.14 | `3.14: float` |
| boolean | true | `true: boolean` |
| string | "hello" | `"hello": string` |
| array | [1, 2, 3] | `[1, 2, 3]: array` |
| nil | nil | `nil: nil` |
| function | (user-defined) | `function: function` |

## Performance Considerations

The `--trace` flag is designed with zero overhead when disabled:
- No performance cost when tracing is off
- Minimal impact when tracing is on (just I/O for output)
- No code changes required—enable/disable via command line

For performance profiling, use Ruchy's dedicated tools:
```bash
ruchy runtime script.ruchy    # BigO complexity analysis
ruchy bench script.ruchy      # Performance benchmarking
```

## Best Practices

1. **Start Simple**: Begin with tracing small functions before complex programs
2. **Understand Recursion**: Use tracing to visualize recursive algorithms
3. **Type Validation**: Verify your functions receive and return expected types
4. **Script Files**: For production debugging, trace entire script files
5. **Combine with Tests**: Use tracing to understand test failures

## Limitations and Future Features

Current limitations (v3.182.0):
- No visual indentation for call depth
- All traced output goes to stdout (mixed with program output)
- No conditional tracing (all functions are traced when enabled)
- No execution time per function

For more advanced debugging needs, consider:
- Ruchy's built-in testing framework (`ruchy test`)
- Performance analysis tools (`ruchy runtime`, `ruchy bench`)
- Quality scoring (`ruchy score`)

## Advanced Debugging: ruchydbg debug (v1.20.0+)

For deep debugging scenarios that require interactive inspection and breakpoint debugging, Ruchy provides `ruchydbg debug`—a powerful rust-gdb wrapper that gives you full symbolic debugging capabilities.

### What is ruchydbg debug?

`ruchydbg debug` is an interactive debugger that provides:
- **Interactive rust-gdb sessions** with automatic setup
- **Pre-configured breakpoints** at key interpreter functions
- **Automated trace capture** for reproducible debugging
- **Variable scope inspection** to understand state changes
- **Method dispatch analysis** to trace execution flow

### When to Use ruchydbg debug

✅ **Use for**:
- Investigating runtime bugs (like global variable issues)
- Understanding method dispatch behavior
- Inspecting variable scope and lifetime
- Analyzing stack traces and call patterns
- Debugging complex interpreter behavior

⚠️ **Not for**:
- Regular development (use `--trace` instead)
- Performance testing (use `ruchy bench` instead)
- Quick debugging (512x performance overhead)

### Interactive Debugging Session

Launch an interactive rust-gdb session with automatic breakpoint:

```bash
# Interactive debugging with default breakpoint
$ ruchydbg debug run test.ruchy

# Interactive with custom breakpoint
$ ruchydbg debug run test.ruchy --break eval_expression
```

**Available GDB commands**:
```bash
(gdb) run              # Start program execution
(gdb) bt               # Show call stack (backtrace)
(gdb) info locals      # Display local variables
(gdb) print variable   # Print specific variable
(gdb) continue         # Continue to next breakpoint
(gdb) quit             # Exit debugger
```

### Automated Trace Capture

For reproducible debugging without interaction:

```bash
# Capture complete trace to file
$ ruchydbg debug analyze test.ruchy > trace.log

# Analyze specific issues
$ cat trace.log | grep "method_call"
$ cat trace.log | grep "variable_assignment"
```

### Common Breakpoints

| Breakpoint | Purpose | Use Case |
|-----------|---------|----------|
| `dispatch_method_call` | Method dispatch entry (default) | Method resolution issues |
| `eval_expression` | Expression evaluation | Variable assignment bugs |
| `eval_method_dispatch` | Method evaluation | Execution flow tracing |
| `parse_function` | Function parsing | Syntax issues |

### Example: Debugging Global Variable Issue

Let's debug a global variable mutation issue:

**test_global.ruchy:**
```ruchy
let mut counter = 0

fun increment() {
    counter = counter + 1
    counter
}

increment()
increment()
println("Final: ", counter)
```

**Debug with breakpoint at variable assignment**:
```bash
$ ruchydbg debug run test_global.ruchy --break eval_expression

# GDB will stop at each variable assignment
# You can inspect the scope and verify mutations
(gdb) bt                    # See call stack
(gdb) print env             # Inspect environment/scope
(gdb) print variable_name   # Check variable value
(gdb) continue              # Proceed to next assignment
```

### Example: Method Dispatch Debugging

Debug method resolution:

**test_method.ruchy:**
```bash
# Example debugging session (conceptual)
# This demonstrates the debugging approach for
# investigating method dispatch issues
```

**Debug method dispatch**:
```bash
$ ruchydbg debug run test_method.ruchy --break dispatch_method_call

# Inspect object structure at method call
(gdb) print self            # See the object
(gdb) print self.__type     # Verify __type marker
(gdb) print method_name     # See which method is called
```

### Performance Characteristics

**Overhead**: ~512x compared to normal execution
- Standard execution: ~3ms
- Debug execution: ~1.5s

**Comparison to industry tools**:
- gdb: 100-1000x overhead
- lldb: 100-1000x overhead
- valgrind: 10-50x overhead
- **ruchydbg debug**: 512x (within expected range)

### Real-World Use Cases

#### 1. Investigating Global Mutation (Issue #119)
```bash
# Debug why global variables don't persist
$ ruchydbg debug run test.ruchy --break eval_expression
# Inspect scope at each assignment
# Verify global vs local scope handling
```

#### 2. Method Dispatch Issues (Issue #121)
```bash
# Debug missing __type markers
$ ruchydbg debug run test.ruchy --break dispatch_method_call
# Inspect object structure
# Verify __type field exists
```

#### 3. Stack Overflow (Issue #123)
```bash
# Monitor recursion depth
$ ruchydbg debug run test.ruchy --break eval_expression
# Set conditional breakpoints
(gdb) condition 1 recursion_depth > 45
(gdb) continue
```

### Best Practices

1. **Start with automated analysis** (`ruchydbg debug analyze`) before interactive
2. **Use appropriate breakpoints** for your debugging scenario
3. **Capture traces to files** for later analysis and sharing
4. **Combine with --trace** for comprehensive understanding
5. **Document findings** for reproducible bug reports

### Integration with Development Workflow

```bash
# Normal development: Fast feedback with --trace
$ echo 'fun test() { 42 }; test()' | RUCHY_TRACE=1 ruchy

# Serious debugging: Deep inspection with ruchydbg
$ ruchydbg debug analyze complex_bug.ruchy > trace.log

# Critical issues: Interactive debugging
$ ruchydbg debug run failing_test.ruchy --break dispatch_method_call
```

### Tool Maturity

**Status**: ✅ Production Ready (v1.20.0+)
- 100% test success rate
- Validated on real book examples
- Multiple use cases confirmed
- Consistent performance

## Summary

Ruchy's type-aware tracing provides professional debugging capabilities:

- **`--trace` flag**: Enable automatic function tracing
- **Type annotations**: Every value shows its type
- **Recursive support**: Understand complex recursive algorithms
- **Zero overhead**: No performance cost when disabled
- **Production ready**: Use in development and debugging workflows

The tracer helps you:
- Understand program flow
- Debug logic errors
- Validate type assumptions
- Learn recursive algorithms
- Optimize performance

Next, you'll learn about Ruchy's testing framework, which builds on these debugging capabilities to help you write reliable, well-tested code.
