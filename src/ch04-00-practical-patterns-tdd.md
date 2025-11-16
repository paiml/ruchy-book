# Chapter 4: Practical Programming Patterns

<!-- DOC_STATUS_START -->
**Chapter Status**: 🟢 67% Working (6/9 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 6 | Validated with 7-layer testing |
| 🎯 Tested | 6 | All basic patterns work perfectly |
| ⏳ Untested | 3 | Advanced features (arrays, mut, String construction) |
| 📋 Requires Implementation | 3 | Waiting for compiler features |

*Last updated: 2025-11-03*
*Ruchy version: ruchy 3.213.0*

**Working Examples (6/9) - 100% Pass Rate**:
- Example 1: Calculator with if/else ✅
- Example 2: User validation (string .len(), .contains()) ✅
- Example 3: Score processing (type casting to f64) ✅
- Example 4: Configuration pattern ✅
- Example 5: State machine pattern ✅
- Example 6: Test-driven pattern (assertions) ✅

**Requires Advanced Features (3/9)**:
- Example 7: Accumulator pattern - needs arrays `[i32; 5]`, `let mut`
- Example 8: Builder pattern - needs `String::new()`
- Example 9: Pattern composition - needs `String::from()`, `.to_string()`

**Next Steps**: File feature requests for arrays, mut, String construction methods
<!-- DOC_STATUS_END -->

## The Problem

You know variables, functions, and control flow, but how do you combine them to solve real problems? Programming isn't just about syntax—it's about recognizing patterns that appear repeatedly and expressing them clearly and efficiently.

## Quick Example

```ruchy
// Calculator with validation and error handling
fun safe_calculate(operation: &str, a: i32, b: i32) -> i32 {
    if operation == "add" {
        a + b
    } else if operation == "subtract" {
        a - b
    } else if operation == "multiply" {
        a * b
    } else if operation == "divide" {
        if b == 0 {
            println("Error: Division by zero");
            0  // Safe default
        } else {
            a / b
        }
    } else {
        println("Error: Unknown operation '{}'", operation);
        0  // Safe default
    }
}

fun main() {
    let result1 = safe_calculate("add", 10, 5);
    let result2 = safe_calculate("divide", 12, 3);
    let result3 = safe_calculate("divide", 10, 0);
    
    println("10 + 5 = {}", result1);
    println("12 / 3 = {}", result2);
    println("10 / 0 = {}", result3);
}
```

```bash
$ ruchy calculator.ruchy
10 + 5 = 15
12 / 3 = 4
Error: Division by zero
10 / 0 = 0
```

## Core Concepts

### Common Programming Patterns
1. **Input Validation**: Check parameters before processing
2. **Guard Clauses**: Handle edge cases early
3. **Default Values**: Provide safe fallbacks
4. **Pattern Matching**: Handle multiple cases systematically
5. **State Transformation**: Transform data step by step

### Why Patterns Matter
- **Reliability**: Consistent error handling
- **Readability**: Familiar structures
- **Maintainability**: Standard approaches
- **Reusability**: Templates for similar problems

## Practical Usage

### Validation and Guard Patterns

```ruchy
fun validate_user_input(name: &str, age: i32, email: &str) -> bool {
    // Guard clause: check for empty name
    if name.len() == 0 {
        println("Error: Name cannot be empty");
        return false;
    }
    
    // Guard clause: check age range
    if age < 0 || age > 150 {
        println("Error: Age must be between 0 and 150");
        return false;
    }
    
    // Guard clause: basic email validation
    if !email.contains('@') {
        println("Error: Invalid email format");
        return false;
    }
    
    // All validations passed
    println("User input is valid");
    return true;
}

fun create_user_profile(name: &str, age: i32, email: &str) -> &str {
    if validate_user_input(name, age, email) {
        println("Creating profile for: {}", name);
        return "Profile created successfully";
    } else {
        return "Profile creation failed";
    }
}

fun main() {
    let result1 = create_user_profile("Alice", 25, "alice@example.com");
    let result2 = create_user_profile("", 30, "bob@example.com");
    let result3 = create_user_profile("Charlie", -5, "charlie@example.com");
    
    println("Result 1: {}", result1);
    println("Result 2: {}", result2); 
    println("Result 3: {}", result3);
}
```

### Multi-Step Processing Patterns

```ruchy
fun process_score(raw_score: i32, max_score: i32) -> f64 {
    // Step 1: Validate inputs
    if max_score <= 0 {
        println("Error: Max score must be positive");
        return 0.0;
    }
    
    if raw_score < 0 {
        println("Warning: Negative score adjusted to 0");
        return 0.0;
    }
    
    if raw_score > max_score {
        println("Warning: Score exceeds maximum, capping at {}", max_score);
        return 100.0;
    }
    
    // Step 2: Calculate percentage
    let percentage = (raw_score as f64) / (max_score as f64) * 100.0;
    
    // Step 3: Round to reasonable precision
    let rounded = (percentage * 10.0).round() / 10.0;
    
    // Step 4: Return result
    rounded
}

fun grade_assignment(student: &str, raw_score: i32, max_score: i32) -> &str {
    let percentage = process_score(raw_score, max_score);
    
    println("Student: {}", student);
    println("Score: {}/{} ({:.1}%)", raw_score, max_score, percentage);
    
    // Letter grade assignment
    if percentage >= 90.0 {
        return "A";
    } else if percentage >= 80.0 {
        return "B";
    } else if percentage >= 70.0 {
        return "C";
    } else if percentage >= 60.0 {
        return "D";
    } else {
        return "F";
    }
}

fun main() {
    let grade1 = grade_assignment("Alice", 95, 100);
    let grade2 = grade_assignment("Bob", 42, 50);
    let grade3 = grade_assignment("Charlie", 150, 100);
    
    println("Grades: {}, {}, {}", grade1, grade2, grade3);
}
```

### Configuration and Default Patterns

```ruchy
fun get_setting(setting_name: &str, default_value: i32) -> i32 {
    // Simulate configuration lookup
    if setting_name == "timeout" {
        return 30;
    } else if setting_name == "max_retries" {
        return 3;
    } else if setting_name == "buffer_size" {
        return 1024;
    } else {
        println("Warning: Unknown setting '{}', using default {}", setting_name, default_value);
        return default_value;
    }
}

fun initialize_system() -> bool {
    println("Initializing system...");
    
    // Get settings with defaults
    let timeout = get_setting("timeout", 15);
    let retries = get_setting("max_retries", 1);
    let buffer = get_setting("buffer_size", 512);
    let unknown = get_setting("cache_size", 256);
    
    // Display configuration
    println("Configuration:");
    println("  Timeout: {} seconds", timeout);
    println("  Max retries: {}", retries);
    println("  Buffer size: {} bytes", buffer);
    println("  Cache size: {} MB", unknown);
    
    // Validate critical settings
    if timeout <= 0 {
        println("Error: Timeout must be positive");
        return false;
    }
    
    if retries < 0 {
        println("Error: Retries cannot be negative");
        return false;
    }
    
    println("✅ System initialized successfully");
    return true;
}

fun main() {
    let success = initialize_system();
    
    if success {
        println("System is ready for operation");
    } else {
        println("System initialization failed");
    }
}
```

## Problem-Solving Templates

### The Accumulator Pattern

```ruchy
fun calculate_total(prices: [i32; 5]) -> i32 {
    let mut total = 0;  // Accumulator starts at zero
    let mut i = 0;
    
    while i < 5 {
        total = total + prices[i];  // Accumulate each value
        i = i + 1;
    }
    
    total  // Return accumulated result
}

fun find_maximum(numbers: [i32; 5]) -> i32 {
    let mut max_value = numbers[0];  // Accumulator starts with first value
    let mut i = 1;
    
    while i < 5 {
        if numbers[i] > max_value {
            max_value = numbers[i];  // Update accumulator if better value found
        }
        i = i + 1;
    }
    
    max_value  // Return best value found
}

fun count_positives(numbers: [i32; 5]) -> i32 {
    let mut count = 0;  // Counter accumulator
    let mut i = 0;
    
    while i < 5 {
        if numbers[i] > 0 {
            count = count + 1;  // Increment counter for matches
        }
        i = i + 1;
    }
    
    count  // Return count
}

fun main() {
    let prices = [10, 25, 5, 15, 8];
    let numbers = [-3, 7, -1, 12, 0];
    
    let total = calculate_total(prices);
    let maximum = find_maximum(prices);
    let positive_count = count_positives(numbers);
    
    println("Total: {}", total);
    println("Maximum: {}", maximum);
    println("Positive numbers: {}", positive_count);
}
```

### The State Machine Pattern

```ruchy
fun process_order_state(current_state: &str, action: &str) -> &str {
    if current_state == "pending" {
        if action == "pay" {
            println("Payment received, order confirmed");
            return "confirmed";
        } else if action == "cancel" {
            println("Order cancelled");
            return "cancelled";
        } else {
            println("Invalid action '{}' for pending order", action);
            return current_state;
        }
    } else if current_state == "confirmed" {
        if action == "ship" {
            println("Order shipped");
            return "shipped";
        } else if action == "cancel" {
            println("Confirmed order cancelled, refund processed");
            return "cancelled";
        } else {
            println("Invalid action '{}' for confirmed order", action);
            return current_state;
        }
    } else if current_state == "shipped" {
        if action == "deliver" {
            println("Order delivered");
            return "delivered";
        } else {
            println("Cannot modify shipped order");
            return current_state;
        }
    } else if current_state == "delivered" {
        println("Order already completed");
        return current_state;
    } else if current_state == "cancelled" {
        println("Order was cancelled");
        return current_state;
    } else {
        println("Unknown order state: {}", current_state);
        return "error";
    }
}

fun track_order() -> &str {
    let mut state = "pending";
    
    println("Order tracking simulation:");
    println("Initial state: {}", state);
    
    // Process sequence of actions
    state = process_order_state(state, "pay");
    println("Current state: {}", state);
    
    state = process_order_state(state, "ship");
    println("Current state: {}", state);
    
    state = process_order_state(state, "deliver");
    println("Current state: {}", state);
    
    state
}

fun main() {
    let final_state = track_order();
    println("Final order state: {}", final_state);
}
```

### The Builder Pattern (Simple Version)

```ruchy
fun build_greeting(name: &str, formal: bool, include_time: bool) -> String {
    let mut greeting = String::new();
    
    // Start with appropriate formality
    if formal {
        greeting = greeting + "Good day, ";
    } else {
        greeting = greeting + "Hello, ";
    }
    
    // Add the name
    greeting = greeting + name;
    
    // Add time information if requested
    if include_time {
        greeting = greeting + "! Hope you're having a great day";
    } else {
        greeting = greeting + "!";
    }
    
    greeting
}

fun build_email_subject(priority: &str, department: &str, topic: &str) -> String {
    let mut subject = String::new();
    
    // Add priority prefix
    if priority == "urgent" {
        subject = subject + "[URGENT] ";
    } else if priority == "high" {
        subject = subject + "[HIGH] ";
    }
    
    // Add department prefix
    subject = subject + "[" + department + "] ";
    
    // Add main topic
    subject = subject + topic;
    
    subject
}

fun main() {
    let greeting1 = build_greeting("Alice", true, true);
    let greeting2 = build_greeting("Bob", false, false);
    
    let subject1 = build_email_subject("urgent", "IT", "Server maintenance required");
    let subject2 = build_email_subject("normal", "HR", "Team meeting scheduled");
    
    println("Greetings:");
    println("  {}", greeting1);
    println("  {}", greeting2);
    
    println("Email subjects:");
    println("  {}", subject1);
    println("  {}", subject2);
}
```

## Pattern Composition

### Combining Multiple Patterns

```ruchy
fun process_student_data(name: &str, scores: [i32; 3]) -> String {
    // Pattern 1: Input validation
    if name.len() == 0 {
        return String::from("Error: Student name required");
    }
    
    // Pattern 2: Accumulator for total
    let mut total = 0;
    let mut i = 0;
    while i < 3 {
        if scores[i] < 0 || scores[i] > 100 {
            return String::from("Error: Scores must be between 0 and 100");
        }
        total = total + scores[i];
        i = i + 1;
    }
    
    // Pattern 3: Calculation with validation
    let average = total / 3;
    
    // Pattern 4: State-based classification
    let grade = if average >= 90 {
        "A"
    } else if average >= 80 {
        "B"
    } else if average >= 70 {
        "C"
    } else if average >= 60 {
        "D"
    } else {
        "F"
    };
    
    // Pattern 5: Builder pattern for result
    let mut result = String::from("Student Report\n");
    result = result + "Name: " + name + "\n";
    result = result + "Scores: ";
    
    // Add individual scores
    let mut i = 0;
    while i < 3 {
        if i > 0 {
            result = result + ", ";
        }
        result = result + &scores[i].to_string();
        i = i + 1;
    }
    
    result = result + "\n";
    result = result + "Average: " + &average.to_string() + "\n";
    result = result + "Grade: " + grade;
    
    result
}

fun main() {
    let report1 = process_student_data("Alice Johnson", [95, 87, 92]);
    let report2 = process_student_data("Bob Smith", [78, 82, 75]);
    let report3 = process_student_data("", [85, 90, 88]);
    
    println("{}\n", report1);
    println("{}\n", report2);  
    println("{}\n", report3);
}
```

## Testing Patterns

### Test-Driven Pattern Development

```ruchy
// Test helper function
fun assert_equal(actual: i32, expected: i32, test_name: &str) {
    if actual == expected {
        println("✅ {}: {} == {}", test_name, actual, expected);
    } else {
        println("❌ {}: {} != {} (expected)", test_name, actual, expected);
    }
}

fun assert_string_equal(actual: &str, expected: &str, test_name: &str) {
    if actual == expected {
        println("✅ {}: strings match", test_name);
    } else {
        println("❌ {}: '{}' != '{}' (expected)", test_name, actual, expected);
    }
}

// Function to test
fun calculate_discount(price: i32, discount_percent: i32) -> i32 {
    if discount_percent < 0 || discount_percent > 100 {
        return price;  // No discount for invalid percentage
    }
    
    let discount_amount = (price * discount_percent) / 100;
    price - discount_amount
}

// Test suite
fun test_discount_calculation() {
    println("Testing discount calculation...");
    
    // Normal cases
    assert_equal(calculate_discount(100, 10), 90, "10% discount on $100");
    assert_equal(calculate_discount(50, 20), 40, "20% discount on $50");
    assert_equal(calculate_discount(200, 0), 200, "0% discount on $200");
    
    // Edge cases
    assert_equal(calculate_discount(100, -5), 100, "Negative discount");
    assert_equal(calculate_discount(100, 150), 100, "Over 100% discount");
    assert_equal(calculate_discount(0, 50), 0, "50% discount on $0");
    
    println("Discount tests completed.\n");
}

fun main() {
    test_discount_calculation();
    
    // Demo the actual function
    println("Discount examples:");
    println("$100 with 15% discount: ${}", calculate_discount(100, 15));
    println("$250 with 25% discount: ${}", calculate_discount(250, 25));
}
```

## Summary

- **Validation patterns** catch errors early and provide clear feedback
- **Guard clauses** simplify control flow and improve readability
- **Accumulator patterns** process collections systematically
- **State machines** model complex workflows reliably
- **Builder patterns** construct complex data step by step
- **Pattern composition** combines simple patterns for complex solutions
- **Test-driven development** ensures patterns work correctly
- **Performance patterns** optimize common operations

These patterns form the foundation of reliable, maintainable Ruchy programs. Master them, and you'll recognize solutions to most programming problems you encounter.