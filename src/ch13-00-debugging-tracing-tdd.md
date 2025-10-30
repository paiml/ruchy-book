# Chapter 13: Debugging and Tracing

When developing programs, understanding how your code executes is crucial. Ruchy provides powerful debugging and tracing tools that help you see exactly what your functions are doing, what values they receive, and what they return—all with full type information.

## Why Debugging Tools Matter

Debugging is not just about fixing errors—it's about understanding program flow, validating assumptions, and learning how your code behaves. Traditional print debugging (`println!`) scatters your code with temporary statements that you must remember to remove. Ruchy's built-in tracing gives you professional debugging capabilities without modifying your source code.

## Type-Aware Function Tracing

Ruchy's `--trace` flag enables automatic tracing of all function calls with complete type information. Every function entry and exit is logged, showing argument values with their types and return values with their types.

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
$ ruchy --trace -e 'fun square(x) { x * x }; square(5)'
TRACE: → square(5: integer)
TRACE: ← square = 25: integer
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
$ ruchy --trace -e 'fun greet(name) { "Hello, " + name }; greet("Alice")'
TRACE: → greet("Alice": string)
TRACE: ← greet = "Hello, Alice": string
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
$ ruchy --trace -e 'fun add(a, b) { a + b }; add(10, 20)'
TRACE: → add(10: integer, 20: integer)
TRACE: ← add = 30: integer
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
$ ruchy --trace -e 'fun is_even(n) { n % 2 == 0 }; is_even(42)'
TRACE: → is_even(42: integer)
TRACE: ← is_even = true: boolean
```

**Floating-point numbers:**
```ruchy
fun divide(a, b) {
    a / b
}

divide(10.5, 2.5)
```

```bash
$ ruchy --trace -e 'fun divide(a, b) { a / b }; divide(10.5, 2.5)'
TRACE: → divide(10.5: float, 2.5: float)
TRACE: ← divide = 4.2: float
```

**Arrays:**
```ruchy
fun process(arr) {
    arr
}

process([1, 2, 3])
```

```bash
$ ruchy --trace -e 'fun process(arr) { arr }; process([1, 2, 3])'
TRACE: → process([1, 2, 3]: array)
TRACE: ← process = [1, 2, 3]: array
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
$ ruchy --trace -e 'fun factorial(n) { if n <= 1 { 1 } else { n * factorial(n - 1) } }; factorial(4)'
TRACE: → factorial(4: integer)
TRACE: → factorial(3: integer)
TRACE: → factorial(2: integer)
TRACE: → factorial(1: integer)
TRACE: ← factorial = 1: integer
TRACE: ← factorial = 2: integer
TRACE: ← factorial = 6: integer
TRACE: ← factorial = 24: integer
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
$ ruchy --trace -e 'fun fibonacci(n) { if n <= 1 { n } else { fibonacci(n-1) + fibonacci(n-2) } }; fibonacci(5)'
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
$ ruchy --trace -e 'fun compute(x) { let y = x * 2; y + 10 }; compute(5)'
TRACE: → compute(5: integer)
TRACE: ← compute = 20: integer
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

Current limitations (v3.149.0):
- No visual indentation for call depth
- All traced output goes to stdout (mixed with program output)
- No conditional tracing (all functions are traced when enabled)
- No execution time per function

For more advanced debugging needs, consider:
- Ruchy's built-in testing framework (`ruchy test`)
- Performance analysis tools (`ruchy runtime`, `ruchy bench`)
- Quality scoring (`ruchy score`)

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
