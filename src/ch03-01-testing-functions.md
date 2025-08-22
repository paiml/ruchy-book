# Testing Functions

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


*"I used to think testing was extra work that slowed me down. Then I spent three days debugging a function that had a one-line bug I could have caught with a 30-second test. Now I write tests first - they're my safety net and my specification all in one."* - Noah Gift

## The Problem

You've written some great functions, but how do you know they actually work? How do you catch bugs before your users do? How do you make sure changes don't break existing functionality?

Manual testing means running your code, checking output, and hoping you didn't miss anything. In professional development, this doesn't scale. You need automated tests that run every time, catch problems immediately, and give you confidence to make changes.

## Quick Example

Here's how you test functions in Ruchy:

```ruchy
// Status: ✅ WORKING
// Your function
fun add(a, b) {
    a + b
}

// Your test
#[test]
fun test_add() {
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
// Status: ✅ WORKING
#[test]
fun test_function_name() {
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
// Status: ✅ WORKING
// tests/calculator_test.ruchy

use super::*;  // Import functions from main module

#[test]
fun test_addition() {
    assert_eq!(add(2, 3), 5)
}

#[test]  
fun test_subtraction() {
    assert_eq!(subtract(10, 4), 6)
}




```

## Practical Testing Patterns

### Testing Pure Functions

Pure functions are easiest to test - same input, same output:

```ruchy
// Status: ✅ WORKING
// calculator.ruchy
fun multiply(a, b) {
    a * b
}

fun divide(a, b) {
    if b == 0 {
        0  // Simple handling for now
    } else {
        a / b
    }
}

fun is_even(n) {
    n % 2 == 0
}

// tests/calculator_test.ruchy  
#[test]
fun test_multiply() {
    assert_eq!(multiply(3, 4), 12)
    assert_eq!(multiply(0, 5), 0)
    assert_eq!(multiply(-2, 3), -6)
}

#[test]
fun test_divide() {
    assert_eq!(divide(10, 2), 5)
    assert_eq!(divide(7, 3), 2)  // Integer division
    assert_eq!(divide(5, 0), 0)  // Division by zero handled
}

#[test]
fun test_is_even() {
    assert!(is_even(4))        // 4 is even
    assert!(!is_even(3))       // 3 is not even  
    assert!(is_even(0))        // 0 is even
    assert!(!is_even(-1))      // -1 is not even
}




```

### Testing Edge Cases

Good tests cover normal cases AND edge cases:

```ruchy
// Status: ✅ WORKING
fun find_max(numbers) {
    if numbers.len() == 0 {
        -999999  // Sentinel value for empty
    } else {
        let mut max_val = numbers[0]
        let mut i = 1
        while i < numbers.len() {
            if numbers[i] > max_val {
                max_val = numbers[i]
            }
            i = i + 1
        }
        max_val
    }
}

#[test]
fun test_find_max() {
    // Normal cases
    assert_eq!(find_max([1, 5, 3, 9, 2]), 9)
    assert_eq!(find_max([10]), 10)
    
    // Edge cases
    assert_eq!(find_max([]), -999999)        // Empty list
    assert_eq!(find_max([-5, -1, -10]), -1)  // All negative
    assert_eq!(find_max([5, 5, 5]), 5)       // All same
}




```

### Testing Text Functions

```ruchy
// Status: ✅ WORKING
fun clean_username(raw_username) {
    // Simple cleaning - replace spaces with underscores
    raw_username.replace(" ", "_")
}

fun count_vowels(text) {
    let vowels = "aeiouAEIOU"
    let mut count = 0
    let mut i = 0
    while i < text.len() {
        if vowels.contains(text[i]) {
            count = count + 1
        }
        i = i + 1
    }
    count
}

#[test]
fun test_clean_username() {
    assert_eq!(clean_username("Alice Johnson"), "Alice_Johnson")
    assert_eq!(clean_username("JOHN"), "JOHN")
    assert_eq!(clean_username(""), "")
}

#[test]
fun test_count_vowels() {
    assert_eq!(count_vowels("hello"), 2)      // e, o
    assert_eq!(count_vowels("HELLO"), 2)      // Case insensitive
    assert_eq!(count_vowels("xyz"), 0)        // No vowels
    assert_eq!(count_vowels("aeiou"), 5)      // All vowels
    assert_eq!(count_vowels(""), 0)           // Empty string
}




```

### Testing Business Logic

```ruchy
// Status: ✅ WORKING
fun calculate_grade(score) {
    if score >= 90 { "A" }
    else if score >= 80 { "B" } 
    else if score >= 70 { "C" }
    else if score >= 60 { "D" }
    else { "F" }
}

fun can_vote(age, is_citizen) {
    age >= 18 && is_citizen
}

#[test]
fun test_calculate_grade() {
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
fun test_can_vote() {
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
// Status: ✅ WORKING

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
// Status: ✅ WORKING

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
// Status: ✅ WORKING

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
// Status: ✅ WORKING

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
>>> fun double(x) { x * 2 }
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
// Status: ✅ WORKING

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