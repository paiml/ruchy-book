# Hello, World!

## The Problem

Every programming journey begins with a simple question: "How do I make the computer say something?" The "Hello, World!" program is more than tradition—it's your first proof that you can communicate with a computer in its own language.

In Ruchy, we believe this first step should be immediate and rewarding, not buried under complexity.

## Quick Example

Here's your first Ruchy program:

```ruchy
println("Hello, World!")
```

That's it! Save this in a file called `hello.ruchy` and run it with:

```bash
$ ruchy run hello.ruchy
Hello, World!
```

Or try it instantly in the REPL:

```bash
$ ruchy repl
>>> println("Hello, World!")
Hello, World!
```

## Core Concepts

### The println Function

`println` is Ruchy's built-in function for printing text to the screen. It:
- Takes any number of arguments
- Prints them separated by spaces
- Automatically adds a newline at the end
- Returns `()` (unit type) when done

### String Literals

In `"Hello, World!"`:
- Double quotes `"` mark the beginning and end of text
- Everything inside is treated literally as text
- This creates a `str` type in Ruchy

### Function Calls

The syntax `println(...)` is a function call:
- `println` is the function name
- Parentheses `()` contain the arguments
- Multiple arguments are separated by commas

## Practical Usage

### Multiple Arguments

```ruchy
println("Hello", "World", "from", "Ruchy")
```

Output:
```
Hello World from Ruchy
```

### Variables and Interpolation

```ruchy
let name = "Alice"
println("Hello,", name)

// Or with string interpolation
println(f"Hello, {name}!")
```

Output:
```
Hello, Alice
Hello, Alice!
```

### Numbers and Other Types

```ruchy
println("The answer is", 42)
println("Pi is approximately", 3.14159)
println("Is Ruchy awesome?", true)
```

Output:
```
The answer is 42
Pi is approximately 3.14159
Is Ruchy awesome? true
```

## Common Pitfalls

### Forgetting Quotes
```ruchy
// ❌ This won't work
println(Hello, World!)
```
Error: `Hello` and `World` are treated as variables, not text.

### Mixing Quote Types
```ruchy
// ❌ Quotes don't match
println("Hello, World!')
```
Error: String not properly closed.

### Case Sensitivity
```ruchy
// ❌ Wrong capitalization
PrintLn("Hello, World!")
```
Error: `PrintLn` is not defined. Ruchy function names are lowercase.

## Transpilation Insight

<details>
<summary>Generated Rust (click to expand)</summary>

Your Ruchy code:
```ruchy
println("Hello, World!")
```

Transpiles to this Rust:
```rust
fn main() {
    println!("Hello, World!");
}
```

Key differences:
- Ruchy's `println` function becomes Rust's `println!` macro
- Ruchy automatically wraps top-level code in a `main()` function
- The string literal stays exactly the same

</details>

## Exercises

1. **Greeting Program**: Write a program that prints a personalized greeting with your name.

2. **Multiple Lines**: Create a program that prints a short poem or message across multiple lines.

3. **Calculator**: Print the result of a simple math calculation along with explanatory text.

**Solutions are in [Appendix G](appendix-07-solutions.md#chapter-1-exercises)**

## Summary

- `println(...)` is your tool for displaying output
- String literals use double quotes: `"text"`
- Function calls use parentheses: `function_name(arguments)`
- Ruchy transpiles to clean, efficient Rust code
- The REPL is perfect for quick experiments

Now that you can make Ruchy speak, let's learn about storing and manipulating information with variables and types.