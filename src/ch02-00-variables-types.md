# Variables and Types

*"The biggest mistake I made learning programming was thinking variables were like algebra. In programming, variables are more like labeled boxes where you can store different things. Once I understood this, everything clicked."* - Noah Gift

## The Problem

You've mastered printing output, but programs need memory - places to store information, work with data, and build complex logic. How do you tell a computer to "remember this number" or "store this name for later"?

In most languages, this involves type declarations, memory management, and complex syntax. In Ruchy, storing information should be as natural as thinking it.

## Quick Example

Here's how you store and use data in Ruchy:

```ruchy
let name = "Alice"
let age = 25
let is_learning = true

println(f"Hi {name}, you're {age} years old!")
println(f"Currently learning Ruchy: {is_learning}")
```

Output:
```
Hi Alice, you're 25 years old!
Currently learning Ruchy: true
```

That's it! No type annotations, no memory management, just store and use.

## Core Concepts

### The let Keyword

`let` creates a new variable in Ruchy. It:
- Declares a new variable name
- Stores a value in memory
- Automatically infers the type from the value
- Makes the variable available for the rest of the scope

### Type Inference

Ruchy looks at your value and figures out the type:
- `"text"` → String type
- `42` → Integer type  
- `3.14` → Float type
- `true`/`false` → Boolean type

### Variable Naming

Variables in Ruchy follow simple rules:
- Start with a letter or underscore
- Use letters, numbers, and underscores
- Case sensitive (`name` ≠ `Name`)
- Use snake_case by convention

## Practical Usage

### Different Data Types

```ruchy
// Text data
let first_name = "John"
let last_name = "Doe"
let full_name = f"{first_name} {last_name}"

// Numeric data
let score = 95
let percentage = 95.5
let temperature = -10

// Boolean (true/false) data
let is_student = true
let has_graduated = false
let is_enrolled = !has_graduated

println(f"Student: {full_name}")
println(f"Score: {score} ({percentage}%)")
println(f"Temperature: {temperature}°C")
println(f"Status: student={is_student}, graduated={has_graduated}")
```

### Working with Variables

```ruchy
// Store user information
let username = "programmer2024"
let login_count = 1
let is_premium = false

// Use variables in calculations
let welcome_bonus = 100
let total_points = welcome_bonus + (login_count * 10)

// Update information (variables are mutable by default)
login_count = login_count + 1
is_premium = total_points > 150

println(f"Welcome back, {username}!")
println(f"Logins: {login_count}, Points: {total_points}")
println(f"Premium status: {is_premium}")
```

### Collections and Lists

```ruchy
// Store multiple values
let favorite_languages = ["Python", "Rust", "Ruchy"]
let daily_temperatures = [22.5, 25.0, 23.8, 26.2]
let task_completed = [true, false, true, true]

// Access items by index (starting from 0)
println(f"First language: {favorite_languages[0]}")
println(f"Today's temp: {daily_temperatures[0]}°C")

// Get list length
println(f"I know {favorite_languages.len()} languages")
```

## Common Pitfalls

### Forgetting let for New Variables
```ruchy
// ❌ This won't work
user_name = "Alice"
```
Error: `user_name` is not declared. Use `let user_name = "Alice"` first.

### Mixing Data Types Incorrectly
```ruchy
// ❌ This might not work as expected
let age = "25"
let next_year = age + 1
```
Error: Can't add number to string. Use `let age = 25` (without quotes).

### Case Sensitivity Confusion
```ruchy
// ❌ These are different variables
let userName = "Alice"
let username = "Bob"
println(userName)  // Prints "Alice", not "Bob"
```
Warning: Stick to snake_case: `user_name`.

## Generated Code Insight

Ever wonder how Ruchy's simple variables become efficient compiled code?

<details>
<summary>🔍 View Generated Rust Code (click to expand)</summary>

Your Ruchy code:
```ruchy
let name = "Alice"
let age = 25
println(f"Hi {name}, age {age}")
```

Becomes this optimized Rust:
```rust
fn main() {
    let name: &str = "Alice";
    let age: i32 = 25;
    println!("Hi {}, age {}", name, age);
}
```

**What's happening:**
- Ruchy's type inference becomes explicit Rust types
- String interpolation becomes format string macros
- All types are resolved at compile time for maximum performance
- Zero runtime overhead for type checking

**Why this matters:**
- You get static typing benefits without writing types
- Compiler catches type errors before your code runs
- Performance is identical to hand-written Rust
- Your simple code becomes memory-safe systems code

</details>

**The Bottom Line:** Write Python-simple variable code, get C++-fast compiled performance.

## Try It Yourself

Time for hands-on experimentation! Open the REPL and create your own data:

```bash
$ ruchy repl
>>> # Start with personal info
>>> let my_name = "[YOUR NAME]"
>>> let my_age = [YOUR AGE]
>>> let my_hobby = "[SOMETHING YOU ENJOY]"
>>> 
>>> # Try different types
>>> let lucky_number = 7
>>> let pi_estimate = 3.14
>>> let is_learning_fast = true
>>> 
>>> # Combine them creatively
>>> println(f"I'm {my_name}, {my_age}, and I love {my_hobby}")
>>> println(f"My lucky number {lucky_number} is {'even' if lucky_number % 2 == 0 else 'odd'}")
```

**Your Challenges:**
1. **Personal Profile**: Create 5 variables that describe you (name, age, city, hobby, goal)
2. **Data Calculator**: Store two numbers, calculate their sum, difference, and average
3. **Text Manipulation**: Store your first and last name, create username and email
4. **Boolean Logic**: Create variables for different conditions and combine them

**Example Solution:**
```ruchy
// Personal profile
let name = "Alex"
let age = 28
let city = "San Francisco"
let hobby = "rock climbing"
let goal = "master Ruchy in 30 days"

// Data calculator  
let num1 = 15
let num2 = 25
let sum = num1 + num2
let difference = num1 - num2
let average = (num1 + num2) / 2

// Text manipulation
let first_name = "Alex"
let last_name = "Johnson"
let username = f"{first_name.lower()}_{last_name.lower()}"
let email = f"{username}@example.com"

// Boolean logic
let is_adult = age >= 18
let lives_in_tech_city = city == "San Francisco"
let ready_for_job = is_adult && lives_in_tech_city
```

Play with different combinations - this is where programming gets creative!

## Summary

- `let` creates variables that store data
- Ruchy automatically figures out data types for you
- Variables can store text, numbers, true/false values, and collections
- Use `f""` strings to combine variables with text
- Variables are mutable by default - you can change their values
- All type checking happens at compile time for maximum performance

You now have the power to store and manipulate information! Next, let's learn how to organize this logic into reusable functions.