# Testing Functions

*"I used to think testing was extra work that slowed me down. Then I spent three days debugging a function that had a one-line bug I could have caught with a 30-second test. Now I write tests first - they're my safety net and my specification all in one."* - Noah Gift

## The Problem

You've written some great functions, but how do you know they actually work? How do you catch bugs before your users do? How do you make sure changes don't break existing functionality?

Manual testing means running your code, checking output, and hoping you didn't miss anything. In professional development, this doesn't scale. You need automated tests that run every time, catch problems immediately, and give you confidence to make changes.

## Quick Example

Here's how you test functions in Ruchy:

```ruchy
// Your function
fn add(a, b) {
    return a + b
}

// Your test
#[test]
fn test_add() {
    assert_eq!(add(2, 3), 5)
    assert_eq!(add(0, 0), 0)
    assert_eq!(add(-1, 1), 0)
}
```

Run it:
```bash
$ ruchy test
Running 1 test...
test_add ... PASS
✅ All tests passed!
```

That's it! Write tests, run tests, ship with confidence.

## Core Concepts

### Test Functions

Test functions in Ruchy use the `#[test]` attribute:
```ruchy
#[test]
fn test_function_name() {
    // Test code here
    assert_eq!(actual, expected)
}
```

- `#[test]` marks the function as a test
- Test functions take no parameters
- Use `assert_eq!` to check if values match
- Test function names should describe what they test

### Assertions

Ruchy provides several assertion macros:
- `assert_eq!(actual, expected)` - values must be equal
- `assert!(condition)` - condition must be true
- `assert_ne!(actual, expected)` - values must NOT be equal

### Test Organization

```ruchy
// tests/calculator_test.ruchy

use super::*;  // Import functions from main module

#[test]
fn test_addition() {
    assert_eq!(add(2, 3), 5)
}

#[test]  
fn test_subtraction() {
    assert_eq!(subtract(10, 4), 6)
}
```

## Practical Testing Patterns

### Testing Pure Functions

Pure functions are easiest to test - same input, same output:

```ruchy
// calculator.ruchy
fn multiply(a, b) {
    return a * b
}

fn divide(a, b) {
    if b == 0 {
        return None
    }
    return Some(a / b)
}

fn is_even(n) {
    return n % 2 == 0
}

// tests/calculator_test.ruchy  
#[test]
fn test_multiply() {
    assert_eq!(multiply(3, 4), 12)
    assert_eq!(multiply(0, 5), 0)
    assert_eq!(multiply(-2, 3), -6)
}

#[test]
fn test_divide() {
    assert_eq!(divide(10, 2), Some(5))
    assert_eq!(divide(7, 3), Some(2))  // Integer division
    assert_eq!(divide(5, 0), None)     // Division by zero
}

#[test]
fn test_is_even() {
    assert!(is_even(4))        // 4 is even
    assert!(!is_even(3))       // 3 is not even  
    assert!(is_even(0))        // 0 is even
    assert!(!is_even(-1))      // -1 is not even
}
```

### Testing Edge Cases

Good tests cover normal cases AND edge cases:

```ruchy
fn find_max(numbers) {
    if numbers.is_empty() {
        return None
    }
    
    let max_val = numbers[0]
    for num in numbers {
        if num > max_val {
            max_val = num
        }
    }
    return Some(max_val)
}

#[test]
fn test_find_max() {
    // Normal cases
    assert_eq!(find_max([1, 5, 3, 9, 2]), Some(9))
    assert_eq!(find_max([10]), Some(10))
    
    // Edge cases
    assert_eq!(find_max([]), None)           // Empty list
    assert_eq!(find_max([-5, -1, -10]), Some(-1))  // All negative
    assert_eq!(find_max([5, 5, 5]), Some(5))       // All same
}
```

### Testing Text Functions

```ruchy
fn clean_username(raw_username) {
    return raw_username.trim().lower().replace(" ", "_")
}

fn count_vowels(text) {
    let vowels = "aeiou"
    let count = 0
    for char in text.lower().chars() {
        if vowels.contains(char) {
            count = count + 1
        }
    }
    return count
}

#[test]
fn test_clean_username() {
    assert_eq!(clean_username("  Alice Johnson  "), "alice_johnson")
    assert_eq!(clean_username("JOHN"), "john")
    assert_eq!(clean_username(""), "")
}

#[test]
fn test_count_vowels() {
    assert_eq!(count_vowels("hello"), 2)      // e, o
    assert_eq!(count_vowels("HELLO"), 2)      // Case insensitive
    assert_eq!(count_vowels("xyz"), 0)        // No vowels
    assert_eq!(count_vowels("aeiou"), 5)      // All vowels
    assert_eq!(count_vowels(""), 0)           // Empty string
}
```

### Testing Business Logic

```ruchy
fn calculate_grade(score) {
    if score >= 90 { return "A" }
    if score >= 80 { return "B" } 
    if score >= 70 { return "C" }
    if score >= 60 { return "D" }
    return "F"
}

fn can_vote(age, is_citizen) {
    return age >= 18 && is_citizen
}

#[test]
fn test_calculate_grade() {
    // Boundary testing
    assert_eq!(calculate_grade(95), "A")
    assert_eq!(calculate_grade(90), "A")  // Exactly 90
    assert_eq!(calculate_grade(89), "B")  // Just below A
    assert_eq!(calculate_grade(80), "B")  // Exactly 80
    assert_eq!(calculate_grade(79), "C")  // Just below B
    assert_eq!(calculate_grade(59), "F")  // Failing grade
    assert_eq!(calculate_grade(0), "F")   // Very low
}

#[test]
fn test_can_vote() {
    // All combinations
    assert!(can_vote(18, true))      // Minimum age, citizen
    assert!(can_vote(25, true))      // Adult citizen
    assert!(!can_vote(17, true))     // Too young
    assert!(!can_vote(25, false))    // Not citizen
    assert!(!can_vote(17, false))    // Too young AND not citizen
}
```

## Test-Driven Development (TDD)

Write tests BEFORE you write code:

1. **Write a failing test** (Red)
2. **Write minimal code to pass** (Green)  
3. **Refactor and improve** (Refactor)

```ruchy
// Step 1: Write the test first
#[test]
fn test_fahrenheit_to_celsius() {
    assert_eq!(fahrenheit_to_celsius(32), 0)    // Freezing point
    assert_eq!(fahrenheit_to_celsius(212), 100) // Boiling point
    assert_eq!(fahrenheit_to_celsius(98.6), 37) // Body temperature
}

// Step 2: Write minimal code to pass
fn fahrenheit_to_celsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9
}

// Step 3: Run tests, refactor if needed
// All tests pass! Code is ready to use.
```

## Common Testing Mistakes

### Not Testing Edge Cases
```ruchy
// ❌ Only testing happy path
#[test]
fn test_divide_bad() {
    assert_eq!(divide(10, 2), 5)  // What about divide by zero?
}

// ✅ Testing edge cases
#[test]
fn test_divide_good() {
    assert_eq!(divide(10, 2), 5)      // Normal case
    assert_eq!(divide(0, 5), 0)       // Zero dividend
    // Should handle divide by zero gracefully
}
```

### Tests That Don't Actually Test
```ruchy
// ❌ This test will always pass
#[test]
fn test_useless() {
    let result = add(2, 3)
    assert!(result > 0)  // Too vague!
}

// ✅ This test verifies exact behavior
#[test]  
fn test_useful() {
    assert_eq!(add(2, 3), 5)  // Exact expectation
}
```

### Poor Test Names
```ruchy
// ❌ Unclear what this tests
#[test]
fn test1() {
    assert_eq!(is_valid("abc"), false)
}

// ✅ Clear, descriptive name
#[test]
fn test_password_too_short() {
    assert_eq!(is_valid_password("abc"), false)
}
```

## Try It Yourself

Time to become a testing expert! Test-drive some functions:

```bash
$ ruchy repl
>>> # Start with a simple function and test
>>> fn double(x) { return x * 2 }
>>> 
>>> # Test it immediately
>>> assert_eq!(double(5), 10)
>>> assert_eq!(double(0), 0)
>>> assert_eq!(double(-3), -6)
>>> 
>>> println("All double() tests pass!")
```

**Your Testing Challenges:**

1. **Test Your Previous Functions**: Go back to functions you created earlier and write comprehensive tests

2. **TDD Practice**: Use test-driven development to create:
   - Password strength validator
   - Email format checker
   - Age category classifier (child/teen/adult/senior)

3. **Edge Case Hunter**: For each function, identify and test:
   - Empty inputs
   - Boundary values  
   - Invalid inputs
   - Extreme values

4. **Business Logic Testing**: Create and test functions for:
   - Shipping cost calculator
   - Tax calculator
   - Discount eligibility checker

**Example TDD Session:**

```ruchy
// 1. Write failing tests first
#[test]
fn test_is_strong_password() {
    assert!(is_strong_password("MyPass123!"))      // Valid
    assert!(!is_strong_password("weak"))           // Too short
    assert!(!is_strong_password("NoNumbers!"))     // No digits
    assert!(!is_strong_password("nonumbers123"))   // No special chars
}

// 2. Write minimal code to pass
fn is_strong_password(password) {
    if password.len() < 8 { return false }
    
    let has_digit = password.chars().any(|c| c.is_digit())
    let has_special = password.chars().any(|c| "!@#$%^&*".contains(c))
    
    return has_digit && has_special
}

// 3. Run tests - they should all pass now!

// 4. Add more edge case tests
#[test]
fn test_password_edge_cases() {
    assert!(!is_strong_password(""))              // Empty
    assert!(!is_strong_password("12345678"))      // Only digits
    assert!(!is_strong_password("!!!!!!!!"))      // Only special
}
```

Testing is your superpower - use it to build software with confidence!

## Summary

- Use `#[test]` to mark test functions
- `assert_eq!` checks if values match exactly
- Test normal cases AND edge cases
- Write descriptive test names
- Test-driven development: test first, then code
- Good tests are your safety net for changes
- Every function should have at least one test
- Testing catches bugs before users find them

You now have the tools to write reliable, tested code! Next, let's learn how to build complete applications using these foundational skills.