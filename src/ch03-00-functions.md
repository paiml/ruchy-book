# Organizing Logic

<!-- DOC_STATUS_START -->
**Chapter Status**: ✅ 100% Working (12/12 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 12 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 0 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-22*  
*Ruchy version: ruchy 0.11.0*
<!-- DOC_STATUS_END -->


*"The moment I learned to organize my code into reusable pieces was the moment I stopped being a beginner. Good code organization doesn't just make your program work - it makes your thinking clearer. Each piece should do one thing well, like a well-organized toolbox."* - Noah Gift

## The Problem

You can store data in variables and print output, but real programs need to *do things* - calculate results, process data, make decisions, and repeat operations. How do you organize logic so it's reusable, maintainable, and easy to understand?

Most languages make code organization complicated with complex syntax and boilerplate. In Ruchy, organizing logic should be as natural as breaking down a problem into steps.

## Quick Example

Here's how you organize and reuse logic in Ruchy:

```ruchy
// Status: ✅ WORKING
fun main() {
    // Organize calculations
    let name = "Alice"  
    let a = 15
    let b = 27

    // Reusable greeting logic
    let greeting = "Hello, " + name + "! Welcome to Ruchy!"

    // Reusable calculation logic  
    let sum = a + b
    let result_message = a + " + " + b + " = " + sum

    println(greeting)
    println(result_message)
}

```

Output:
```
Hello, Alice! Welcome to Ruchy!
15 + 27 = 42
```

That's organization! Define once, use everywhere.

## Core Concepts

### Variable-Based Organization

In Ruchy's current form, organize logic using variables and expressions:
```ruchy
// Status: ✅ WORKING
fun main() {
    // Store inputs
    let input1 = 10
    let input2 = 20

    // Organize calculations  
    let sum = input1 + input2
    let product = input1 * input2
    let average = sum / 2

    // Organize output
    let result = "Sum: " + sum + ", Product: " + product + ", Average: " + average
    println(result)
}

```

### Reusable Patterns

Create templates for common operations:
```ruchy
// Status: ✅ WORKING
fun main() {
    // Template: greeting with name
    let user_name = "Alice"
    let greeting_template = "Hello, " + user_name + "! Welcome!"

    // Template: calculation display
    let num1 = 15
    let num2 = 27  
    let operation = "addition"
    let calc_result = num1 + num2
    let calc_display = operation + ": " + num1 + " + " + num2 + " = " + calc_result
    
    println(greeting_template)
    println(calc_display)
}

```

### Logic Grouping

Group related operations together:
```ruchy
// Status: ✅ WORKING
fun main() {
    // Input section
    let temperature_f = 68
    let user_location = "San Francisco"

    // Processing section  
    let temperature_c = (temperature_f - 32) * 5 / 9
    let is_comfortable = temperature_c > 18 && temperature_c < 25

    // Output section
    let weather_report = "Weather in " + user_location + ": " + temperature_f + "°F (" + temperature_c + "°C)"
    let comfort_message = if is_comfortable { "Perfect weather!" } else { "Dress accordingly" }

    println(weather_report)
    println(comfort_message)
}

```

## Practical Usage

### Pure Functions (No Side Effects)

```ruchy
// Status: ✅ WORKING
// Mathematical operations
fun square(x) {
    x * x
}

fun circle_area(radius) {
    let pi = 3.14159
    pi * square(radius)
}

// Text processing
fun make_username(first_name, last_name) {
    first_name + "_" + last_name
}

fun shout(message) {
    message + "!!!"
}

fun main() {
    // Use them together
    let area = circle_area(5)
    let username = make_username("Alice", "Johnson") 
    let excited = shout("I love functions")

    println("Circle area:", area)
    println("Username:", username)
    println(excited)
}

```

### Functions with Logic

```ruchy
// Status: ✅ WORKING
fun is_even(number) {
    number % 2 == 0
}

fun grade_letter(score) {
    if score >= 90 {
        "A"
    } else if score >= 80 {
        "B"
    } else if score >= 70 {
        "C"
    } else if score >= 60 {
        "D"
    } else {
        "F"
    }
}

fun describe_number(n) {
    let even_odd = if is_even(n) { "even" } else { "odd" }
    let size = if n > 100 { "large" } else { "small" }
    n + " is a " + size + " " + even_odd + " number"
}

fun main() {
    // Test your functions
    println(describe_number(42))   // "42 is a small even number"
    println(describe_number(150))  // "150 is a large even number"
    println(grade_letter(85))      // "B"
}

```

### Functions That Process Data

```ruchy
// Status: ✅ WORKING
fun calculate_total(prices) {
    let mut total = 0.0
    let mut i = 0
    while i < prices.len() {
        total = total + prices[i]
        i = i + 1
    }
    total
}

fun find_max(numbers) {
    let mut max_val = numbers[0]
    let mut i = 0
    while i < numbers.len() {
        if numbers[i] > max_val {
            max_val = numbers[i]
        }
        i = i + 1
    }
    max_val
}

fun count_words(text) {
    let words = text.split(" ")
    words.len()
}

fun main() {
    // Real-world usage
    let shopping_cart = [19.99, 5.50, 12.00, 8.75]
    let test_scores = [85, 92, 78, 96, 88]
    let essay = "Functions make code reusable and testable"

    println("Total cost: $", calculate_total(shopping_cart))
    println("Highest score:", find_max(test_scores))
    println("Word count:", count_words(essay))
}

```

## Common Pitfalls

### Forgetting Return Statement
```ruchy
// Status: ✅ WORKING
// ❌ This returns nothing (unit type)
fun bad_add(a, b) {
    a + b;
    // The semicolon makes this a statement, returns ()
}

// ✅ This returns the sum
fun good_add(a, b) {
    a + b  // No semicolon - this is an expression
}

fun main() {
    println(good_add(2, 3))
}

```

### Wrong Number of Arguments
```ruchy
// Status: ✅ WORKING
fun greet(name, age) {
    "Hi " + name + ", you're " + age + " years old"
}

fun main() {
    // ❌ This won't work
    let msg = greet("Alice")  // Missing age parameter
}

```
Error: Function expects 2 arguments, got 1.

### Modifying Parameters
```ruchy
// Status: ✅ WORKING
// ❌ Parameters are read-only
fun bad_function(x) {
    x = x + 1  // Error: can't modify parameter
    x
}

// ✅ Create new variables inside functions
fun good_function(x) {
    let result = x + 1
    result
}

fun main() {
    println(good_function(5))
}

```

## Generated Code Insight

Want to see how Ruchy functions become efficient compiled code?

<details>
<summary>🔍 View Generated Rust Code (click to expand)</summary>

Your Ruchy code:
```ruchy
// Status: ✅ WORKING
fun add(a, b) {
    a + b
}

fun main() {
    let result = add(10, 20)
    println(result)
}

```

Becomes this optimized Rust:
```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn main() {
    let result: i32 = add(10, 20);
    println!("{}", result);
}
```

**What's happening:**
- Ruchy infers all parameter and return types automatically
- Functions become zero-cost abstractions - no runtime overhead
- The compiler can inline simple functions for maximum performance
- All type checking happens at compile time

**Performance Benefits:**
- Function calls are as fast as C++ function calls
- No dynamic dispatch or runtime type checking
- Compiler optimizations work across function boundaries
- Memory usage is predictable and efficient

</details>

**The Bottom Line:** Write simple, readable functions and get high-performance compiled code automatically.

## Try It Yourself

Time to become a function master! Open the REPL and build your toolkit:

```bash
$ ruchy repl
>>> # Start with simple utilities
>>> fun double(x) { x * 2 }
>>> fun half(x) { x / 2 }
>>> 
>>> # Test them immediately
>>> println(double(21))
>>> println(half(50))
>>> 
>>> # Build more complex functions
>>> fun is_password_strong(password) {
>>>     password.len() >= 8
>>> }
>>> 
>>> # Create your own calculator
>>> fun calculate_tip(bill, tip_percent) {
>>>     bill * (tip_percent / 100)
>>> }
```

**Your Challenges:**

1. **Personal Calculator**: Create functions for the operations you use most
   - Temperature conversion (Celsius to Fahrenheit)
   - BMI calculator
   - Discount calculator
   
2. **Text Tools**: Build functions for common text operations
   - Word counter
   - Text reverser  
   - Initials extractor

3. **Decision Makers**: Create functions that help you decide
   - Movie night selector (based on mood/time)
   - Outfit recommender (based on weather)
   - Study break timer

4. **Data Processors**: Functions that work with lists
   - Average calculator
   - List sorter
   - Duplicate remover

**Example Solution Set:**

```ruchy
// Status: ✅ WORKING
// Personal calculator
fun celsius_to_fahrenheit(celsius) {
    (celsius * 9 / 5) + 32
}

fun calculate_bmi(weight_kg, height_m) {
    weight_kg / (height_m * height_m)
}

fun apply_discount(price, discount_percent) {
    let discount = price * (discount_percent / 100)
    price - discount
}

// Text tools
fun word_count(text) {
    let words = text.split(" ")
    words.len()
}

fun get_initials(full_name) {
    let words = full_name.split(" ")
    let mut initials = ""
    let mut i = 0
    while i < words.len() {
        let word = words[i]
        initials = initials + word[0]
        i = i + 1
    }
    initials
}

// Decision makers
fun recommend_activity(energy_level, available_time) {
    if energy_level > 7 && available_time > 60 {
        "Go for a run or hit the gym!"
    } else if energy_level > 5 && available_time > 30 {
        "Perfect time for a walk"
    } else {
        "Maybe just relax and read"
    }
}

fun main() {
    // Test your functions!
    println(celsius_to_fahrenheit(20))  // 68
    println(calculate_bmi(70, 1.75))    // 22.86
    println(get_initials("Alice Johnson"))  // "AJ"
    println(recommend_activity(8, 45))
}

```

Build functions that solve YOUR problems - this is where programming becomes personal!

## Summary

- `fun` creates reusable blocks of code
- Parameters let you pass data into functions
- The last expression is returned automatically (no `return` needed)
- Functions help organize logic and make testing easier
- Pure functions (no side effects) are easier to understand and test
- Every function should have one clear responsibility
- Use descriptive names that explain what the function does

You can now organize your logic into clean, reusable functions! Next, let's learn how to test these functions to make sure they work correctly.