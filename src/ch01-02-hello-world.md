# Hello, World!

<!-- DOC_STATUS_START -->
**Chapter Status**: ✅ 100% Working (8/8 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 8 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 0 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 3.38.0*
<!-- DOC_STATUS_END -->


*"I still remember the first time I made a computer print 'Hello, World!' It was magical - like teaching a very literal friend to speak. That same feeling of wonder drove me to create Ruchy, where your first program works immediately, not after hours of setup."* - Noah Gift

## The Problem

Every programming journey begins with a simple question: "How do I make the computer say something?" The "Hello, World!" program is more than tradition—it's your first proof that you can communicate with a computer in its own language.

In Ruchy, we believe this first step should be immediate and rewarding, not buried under complexity.

## Quick Example

Here's your first Ruchy program:

```ruchy

fun main() {
    println("Hello, World!");
}






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

fun main() {
    println("Hello", "World", "from", "Ruchy");
}






```

Output:
```
Hello World from Ruchy
```

### Variables and Interpolation

```ruchy

fun main() {
    let name = "Alice";
    println("Hello,", name);
    
    // String concatenation (interpolation coming in future versions)
    println("Hello, " + name + "!");
}






```

Output:
```
Hello, Alice
Hello, Alice!
```

### Numbers and Other Types

```ruchy

fun main() {
    println("The answer is", 42);
    println("Pi is approximately", 3.14159);
    println("Is Ruchy awesome?", true);
}






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

// ❌ This won't work - intentional error example
// println(Hello, World!);
//

// Always use quotes for literal text.

fun main() {
    // ✅ Correct way:
    println("Hello, World!");
}





```

### Mixing Quote Types
```ruchy

// ❌ Quotes don't match - intentional error example
// println("Hello, World!');
//

// Use either "..." or '...' but be consistent.

fun main() {
    // ✅ Correct way:
    println("Hello, World!");
}





```

### Case Sensitivity
```ruchy

// ❌ Wrong capitalization - intentional error example
// PrintLn("Hello, World!");
//


fun main() {
    // ✅ Correct way:
    println("Hello, World!");
}





```

## Generated Code Insight

Ever wonder what happens "under the hood" when you write Ruchy code? Let's peek behind the curtain.

<details>
<summary>🔍 View Generated Rust Code (click to expand)</summary>

Your Ruchy code:
```ruchy

fun main() {
    println("Hello, World!");
}






```

Transpiles to this optimized Rust:
```rust
fn main() {
    println!("Hello, World!");
}
```

**What's happening:**
- Ruchy's `println` function becomes Rust's `println!` macro  
- Ruchy automatically wraps top-level code in a `main()` function
- The string literal stays exactly the same
- No runtime overhead - this compiles to native machine code

**Why this matters:**
- You get Rust's performance without Rust's complexity
- Your code can integrate seamlessly with existing Rust libraries
- The generated code is readable and debuggable

</details>

**The Bottom Line:** Ruchy gives you Python-like simplicity with Rust-like performance. You're not sacrificing speed for ease of use.

## Try It Yourself

Time to get your hands dirty! Fire up the REPL and experiment:

```bash
$ ruchy repl
>>> # Start with your own greeting
>>> println("Hello, [YOUR NAME]!")
>>> 
>>> # Try multiple arguments
>>> println("My favorite number is", 42)
>>> 
>>> # Mix different types
>>> println("Learning Ruchy:", true, "Progress:", 100, "%")
>>>
>>> # Personal touch - make it yours!
>>> let my_language = "Ruchy" 
>>> let excitement_level = "maximum"
>>> println("I'm learning " + my_language + " with " + excitement_level + " enthusiasm!")
```

**Your Challenge:**
1. **Personal Greeting**: Create a greeting that includes your name, age, and why you're learning Ruchy
2. **Data Mix**: Use `println` with at least 4 different data types in one call
3. **String Concatenation**: Use the `+` operator to create a personalized message

**Example Output:**
```
Hi! I'm Alex, 28 years old, learning Ruchy for data science
Mixing types: text 42 3.14 true null
My goal: I want to build fast applications with Ruchy!
```

The REPL is your playground - break things, experiment, learn!

## Summary

- `println(...)` is your tool for displaying output
- String literals use double quotes: `"text"`
- Function calls use parentheses: `function_name(arguments)`
- Ruchy transpiles to clean, efficient Rust code
- The REPL is perfect for quick experiments

Now that you can make Ruchy speak, let's learn about storing and manipulating information with variables and types.