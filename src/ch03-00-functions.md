# Organizing Logic

*"The moment I learned to organize my code into reusable pieces was the moment I stopped being a beginner. Good code organization doesn't just make your program work - it makes your thinking clearer. Each piece should do one thing well, like a well-organized toolbox."* - Noah Gift

## The Problem

You can store data in variables and print output, but real programs need to *do things* - calculate results, process data, make decisions, and repeat operations. How do you organize logic so it's reusable, maintainable, and easy to understand?

Most languages make code organization complicated with complex syntax and boilerplate. In Ruchy, organizing logic should be as natural as breaking down a problem into steps.

## Quick Example

Here's how you organize and reuse logic in Ruchy:

```ruchy
// Organize calculations
let name = "Alice"  
let a = 15
let b = 27

// Reusable greeting logic
let greeting = f"Hello, {name}! Welcome to Ruchy!"

// Reusable calculation logic  
let sum = a + b
let result_message = f"{a} + {b} = {sum}"

println(greeting)
println(result_message)
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
// Store inputs
let input1 = 10
let input2 = 20

// Organize calculations  
let sum = input1 + input2
let product = input1 * input2
let average = sum / 2

// Organize output
let result = f"Sum: {sum}, Product: {product}, Average: {average}"
```

### Reusable Patterns

Create templates for common operations:
```ruchy
// Template: greeting with name
let user_name = "Alice"
let greeting_template = f"Hello, {user_name}! Welcome!"

// Template: calculation display
let num1 = 15
let num2 = 27  
let operation = "addition"
let calc_result = num1 + num2
let calc_display = f"{operation}: {num1} + {num2} = {calc_result}"
```

### Logic Grouping

Group related operations together:
```ruchy
// Input section
let temperature_f = 68
let user_location = "San Francisco"

// Processing section  
let temperature_c = (temperature_f - 32) * 5 / 9
let is_comfortable = temperature_c > 18 && temperature_c < 25

// Output section
let weather_report = f"Weather in {user_location}: {temperature_f}°F ({temperature_c}°C)"
let comfort_message = if is_comfortable { "Perfect weather!" } else { "Dress accordingly" }

println(weather_report)
println(comfort_message)
```

## Practical Usage

### Pure Functions (No Side Effects)

```ruchy
// Mathematical operations
fn square(x) {
    return x * x
}

fn circle_area(radius) {
    let pi = 3.14159
    return pi * square(radius)
}

// Text processing
fn make_username(first_name, last_name) {
    return f"{first_name.lower()}_{last_name.lower()}"
}

fn shout(message) {
    return message.upper() + "!!!"
}

// Use them together
let area = circle_area(5)
let username = make_username("Alice", "Johnson") 
let excited = shout("I love functions")

println(f"Circle area: {area}")
println(f"Username: {username}")
println(excited)
```

### Functions with Logic

```ruchy
fn is_even(number) {
    return number % 2 == 0
}

fn grade_letter(score) {
    if score >= 90 {
        return "A"
    } else if score >= 80 {
        return "B"
    } else if score >= 70 {
        return "C"
    } else if score >= 60 {
        return "D"
    } else {
        return "F"
    }
}

fn describe_number(n) {
    let even_odd = if is_even(n) { "even" } else { "odd" }
    let size = if n > 100 { "large" } else { "small" }
    return f"{n} is a {size} {even_odd} number"
}

// Test your functions
println(describe_number(42))   // "42 is a small even number"
println(describe_number(150))  // "150 is a large even number"
println(grade_letter(85))      // "B"
```

### Functions That Process Data

```ruchy
fn calculate_total(prices) {
    let total = 0
    for price in prices {
        total = total + price
    }
    return total
}

fn find_max(numbers) {
    let max_val = numbers[0]
    for num in numbers {
        if num > max_val {
            max_val = num
        }
    }
    return max_val
}

fn count_words(text) {
    return text.split(" ").len()
}

// Real-world usage
let shopping_cart = [19.99, 5.50, 12.00, 8.75]
let test_scores = [85, 92, 78, 96, 88]
let essay = "Functions make code reusable and testable"

println(f"Total cost: ${calculate_total(shopping_cart)}")
println(f"Highest score: {find_max(test_scores)}")
println(f"Word count: {count_words(essay)}")
```

## Common Pitfalls

### Forgetting Return Statement
```ruchy
// ❌ This returns nothing (unit type)
fn bad_add(a, b) {
    a + b  // Missing 'return'
}

// ✅ This returns the sum
fn good_add(a, b) {
    return a + b
}
```

### Wrong Number of Arguments
```ruchy
fn greet(name, age) {
    return f"Hi {name}, you're {age} years old"
}

// ❌ This won't work
let msg = greet("Alice")  // Missing age parameter
```
Error: Function expects 2 arguments, got 1.

### Modifying Parameters
```ruchy
// ❌ Parameters are read-only
fn bad_function(x) {
    x = x + 1  // Error: can't modify parameter
    return x
}

// ✅ Create new variables inside functions
fn good_function(x) {
    let result = x + 1
    return result
}
```

## Generated Code Insight

Want to see how Ruchy functions become efficient compiled code?

<details>
<summary>🔍 View Generated Rust Code (click to expand)</summary>

Your Ruchy code:
```ruchy
fn add(a, b) {
    return a + b
}

let result = add(10, 20)
println(result)
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
>>> fn double(x) { return x * 2 }
>>> fn half(x) { return x / 2 }
>>> 
>>> # Test them immediately
>>> println(double(21))
>>> println(half(50))
>>> 
>>> # Build more complex functions
>>> fn is_password_strong(password) {
>>>     return password.len() >= 8 && password.contains("!")
>>> }
>>> 
>>> # Create your own calculator
>>> fn calculate_tip(bill, tip_percent) {
>>>     return bill * (tip_percent / 100)
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
// Personal calculator
fn celsius_to_fahrenheit(celsius) {
    return (celsius * 9 / 5) + 32
}

fn calculate_bmi(weight_kg, height_m) {
    return weight_kg / (height_m * height_m)
}

fn apply_discount(price, discount_percent) {
    let discount = price * (discount_percent / 100)
    return price - discount
}

// Text tools
fn word_count(text) {
    return text.split(" ").len()
}

fn reverse_text(text) {
    return text.chars().reverse().collect().join("")
}

fn get_initials(full_name) {
    let words = full_name.split(" ")
    let initials = ""
    for word in words {
        initials = initials + word[0].upper()
    }
    return initials
}

// Decision makers
fn recommend_activity(energy_level, available_time) {
    if energy_level > 7 && available_time > 60 {
        return "Go for a run or hit the gym!"
    } else if energy_level > 5 && available_time > 30 {
        return "Perfect time for a walk"
    } else {
        return "Maybe just relax and read"
    }
}

// Test your functions!
println(celsius_to_fahrenheit(20))  // 68
println(calculate_bmi(70, 1.75))    // 22.86
println(get_initials("Alice Johnson"))  // "AJ"
println(recommend_activity(8, 45))
```

Build functions that solve YOUR problems - this is where programming becomes personal!

## Summary

- `fn` creates reusable blocks of code
- Parameters let you pass data into functions
- `return` sends results back to the caller
- Functions help organize logic and make testing easier
- Pure functions (no side effects) are easier to understand and test
- Every function should have one clear responsibility
- Use descriptive names that explain what the function does

You can now organize your logic into clean, reusable functions! Next, let's learn how to test these functions to make sure they work correctly.