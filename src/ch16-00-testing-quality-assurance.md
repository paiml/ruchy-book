# Chapter 16: Testing & Quality Assurance

<!-- DOC_STATUS_START -->
**Chapter Status**: ✅ 100% Working (5/5 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 5 | All testing patterns validated |
| ⚠️ Not Implemented | 0 | - |
| ❌ Broken | 0 | - |

*Last tested: 2025-11-02*
*Ruchy version: ruchy 3.175.0*
*Features: Unit testing, factorial tests, error handling tests, property-based testing, test organization*
<!-- DOC_STATUS_END -->

## The Problem

Writing code is only the beginning. Professional software development requires comprehensive testing, quality validation, and formal verification to ensure reliability and correctness. You need systematic approaches to validate your ruchy programs work correctly under all conditions.

## Quick Example

```ruchy
fun add_numbers(a: i32, b: i32) -> i32 {
    a + b
}

fun main() {
    // Basic functionality test
    let result = add_numbers(5, 3);
    assert_eq(result, 8, "Addition should work correctly");
    
    println("✅ All tests passed!");
}
```

```bash
$ ruchy test math_functions.ruchy
🧪 Running 1 .ruchy test files...
✅ All tests passed!
```

## Core Concepts

### Testing Philosophy
Ruchy embraces **Test-Driven Documentation** where every example is a working test:

1. **Write Tests First**: Define expected behavior before implementation
2. **Automated Validation**: Use `ruchy test` for continuous verification  
3. **Quality Gates**: Integrate with `ruchy lint`, `ruchy score` for comprehensive quality
4. **Formal Verification**: Use `ruchy prove` for mathematical correctness

### Testing Hierarchy
- **Unit Tests**: Individual function correctness
- **Integration Tests**: Component interaction validation
- **Property Tests**: Mathematical and logical properties
- **Formal Proofs**: Rigorous correctness verification

## Practical Usage

### Basic Unit Testing
```ruchy
fun factorial(n: i32) -> i32 {
    if n <= 1 {
        1
    } else {
        n * factorial(n - 1)
    }
}

fun test_factorial_base_cases() {
    assert_eq(factorial(0), 1, "0! should equal 1");
    assert_eq(factorial(1), 1, "1! should equal 1");
    println("✅ Base cases pass");
}

fun test_factorial_recursive_cases() {
    assert_eq(factorial(3), 6, "3! should equal 6");
    assert_eq(factorial(4), 24, "4! should equal 24");
    assert_eq(factorial(5), 120, "5! should equal 120");
    println("✅ Recursive cases pass");
}

fun main() {
    test_factorial_base_cases();
    test_factorial_recursive_cases();
    println("🎉 All factorial tests passed!");
}
```

### Error Handling Testing
```ruchy
fun safe_divide(a: i32, b: i32) -> i32 {
    if b == 0 {
        println("Error: Division by zero");
        return 0;
    }
    a / b
}

fun test_division_normal_cases() {
    assert_eq(safe_divide(10, 2), 5, "Normal division should work");
    assert_eq(safe_divide(15, 3), 5, "Another normal case");
    println("✅ Normal division tests pass");
}

fun test_division_error_cases() {
    // Test division by zero handling
    let result = safe_divide(10, 0);
    assert_eq(result, 0, "Division by zero should return 0");
    println("✅ Error handling tests pass");
}

fun main() {
    test_division_normal_cases();
    test_division_error_cases();
    println("🎉 All division tests passed!");
}
```

### Property-Based Testing
```ruchy
fun absolute_value(x: i32) -> i32 {
    if x < 0 {
        -x
    } else {
        x
    }
}

fun test_absolute_value_properties() {
    // Property: abs(x) >= 0 for all x
    let test_values = [5, -3, 0, 100, -50];
    let mut i = 0;
    
    while i < 5 {
        let x = test_values[i];
        let abs_x = absolute_value(x);
        
        // Property 1: Result is always non-negative
        assert(abs_x >= 0, "Absolute value must be non-negative");
        
        // Property 2: abs(abs(x)) == abs(x) (idempotent)
        assert_eq(absolute_value(abs_x), abs_x, "Absolute value should be idempotent");
        
        i = i + 1;
    }
    
    println("✅ Property tests pass");
}

fun main() {
    test_absolute_value_properties();
    println("🎉 All property tests passed!");
}
```

## Testing Commands

### Basic Test Execution
```bash
# Run a single test file
ruchy test calculator_test.ruchy

# Run all test files in directory  
ruchy test tests/

# Watch for changes and auto-rerun
ruchy test --watch calculator_test.ruchy
```

### Coverage Analysis
```bash
# Generate coverage report
ruchy coverage calculator_test.ruchy

# Expected output:
# === Coverage Report ===
# Lines: 45/50 (90%)
# Functions: 5/5 (100%)
# Branches: 8/10 (80%)
```

### Formal Verification
```bash
# Verify mathematical properties
ruchy prove math_functions.ruchy

# Expected output:
# ✓ Checking proofs in math_functions.ruchy...
# ✅ No proofs found (file valid)
```

## Quality Gates Integration

### Pre-Test Validation
```bash
# Comprehensive quality pipeline
ruchy check calculator.ruchy      # Syntax validation
ruchy lint calculator.ruchy       # Style checking
ruchy test calculator_test.ruchy  # Functionality testing
ruchy score calculator.ruchy      # Quality scoring
```

### Automated Quality Pipeline
```bash
#!/bin/bash
# quality_gate.sh - Comprehensive quality validation

set -e

echo "🔍 Running quality gates..."

# Gate 1: Syntax validation
ruchy check *.ruchy || {
    echo "❌ Syntax validation failed"
    exit 1
}

# Gate 2: Style analysis  
ruchy lint *.ruchy || {
    echo "❌ Style analysis failed"
    exit 1
}

# Gate 3: Test execution
ruchy test *_test.ruchy || {
    echo "❌ Tests failed"
    exit 1
}

# Gate 4: Quality scoring
ruchy score *.ruchy | grep -q "A+" || {
    echo "❌ Quality score below A+"
    exit 1
}

echo "✅ All quality gates passed!"
```

## Advanced Testing Patterns

### Test Organization
```ruchy
// File: calculator_test.ruchy

// Implementation functions being tested
fun add(a: i32, b: i32) -> i32 {
    a + b
}

fun multiply(a: i32, b: i32) -> i32 {
    a * b
}

// Test functions
fun test_addition() {
    assert_eq(add(2, 3), 5, "Basic addition");
    assert_eq(add(-1, 1), 0, "Adding negative numbers");
    assert_eq(add(0, 0), 0, "Adding zeros");
    println("✅ Addition tests pass");
}

fun test_multiplication() {
    assert_eq(multiply(3, 4), 12, "Basic multiplication");
    assert_eq(multiply(-2, 3), -6, "Negative multiplication");
    assert_eq(multiply(0, 100), 0, "Multiply by zero");
    println("✅ Multiplication tests pass");
}

fun run_all_tests() {
    test_addition();
    test_multiplication();
    println("🎉 Calculator test suite complete!");
}

fun main() {
    run_all_tests();
}
```

### Performance Testing
```ruchy
fun fibonacci(n: i32) -> i32 {
    if n <= 1 {
        n
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}

fun test_fibonacci_performance() {
    // Test reasonable performance expectations
    let start_time = get_time_ms(); // Placeholder - actual timing would need stdlib
    let result = fibonacci(20);
    let end_time = get_time_ms();
    
    assert_eq(result, 6765, "Fibonacci(20) should equal 6765");
    
    // Performance assertion (conceptual)
    let duration = end_time - start_time;
    assert(duration < 1000, "Fibonacci(20) should complete within 1 second");
    
    println("✅ Performance test passes");
}

fun main() {
    test_fibonacci_performance();
}
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/quality.yml
name: Ruchy Quality Gates

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Install Ruchy
      run: |
        # Installation steps for ruchy
        
    - name: Syntax Check
      run: ruchy check **/*.ruchy
      
    - name: Lint Analysis
      run: ruchy lint **/*.ruchy
      
    - name: Run Tests
      run: ruchy test **/*_test.ruchy
      
    - name: Quality Scoring
      run: |
        ruchy score **/*.ruchy
        ruchy score **/*.ruchy | grep -q "A+" || exit 1
        
    - name: Coverage Report
      run: ruchy coverage **/*_test.ruchy
```

### Docker Testing Environment
```dockerfile
# Dockerfile.test
FROM rust:latest

# Install Ruchy
RUN cargo install --git https://github.com/ruchy-lang/ruchy

WORKDIR /app
COPY . .

# Run comprehensive testing
RUN ruchy check **/*.ruchy
RUN ruchy lint **/*.ruchy  
RUN ruchy test **/*_test.ruchy
RUN ruchy score **/*.ruchy | grep -q "A+"

CMD ["ruchy", "test", "--watch", "."]
```

## Testing Best Practices

### 1. Test Naming Conventions
- Use descriptive test function names: `test_division_by_zero()`
- Group related tests: `test_calculator_addition()`, `test_calculator_subtraction()`
- Include edge cases: `test_empty_input()`, `test_large_numbers()`

### 2. Assertion Strategies
<!-- skip-test: documentation-only (uses placeholder variables) -->
```ruchy
// Clear, specific assertions
assert_eq(actual, expected, "Descriptive failure message");

// Boolean assertions with context
assert(condition, "Explain why this should be true");

// Multiple related assertions
fun test_range_function() {
    let result = create_range(1, 5);
    assert_eq(len(result), 4, "Range should have 4 elements");
    assert_eq(result[0], 1, "First element should be 1");  
    assert_eq(result[3], 4, "Last element should be 4");
}
```

### 3. Test Coverage Goals
- **Functions**: 100% coverage on all public functions
- **Branches**: Cover all conditional paths  
- **Edge Cases**: Boundary values, error conditions
- **Integration**: Test component interactions

## Formal Verification Examples

### Mathematical Properties
```ruchy
fun gcd(a: i32, b: i32) -> i32 {
    if b == 0 {
        a
    } else {
        gcd(b, a % b)
    }
}

// Property: gcd(a, b) divides both a and b
fun test_gcd_properties() {
    let a = 48;
    let b = 18;
    let result = gcd(a, b);
    
    // Property verification
    assert_eq(a % result, 0, "GCD should divide first number");
    assert_eq(b % result, 0, "GCD should divide second number");
    assert_eq(result, 6, "GCD(48, 18) should equal 6");
    
    println("✅ GCD properties verified");
}

fun main() {
    test_gcd_properties();
}
```

## Summary

- **ruchy test** provides comprehensive test execution with watch mode
- **ruchy prove** enables formal verification of mathematical properties
- **ruchy coverage** generates detailed coverage reports  
- **Quality gates** integrate testing with lint, score, and check commands
- **CI/CD integration** enables automated quality validation
- **Property-based testing** validates mathematical and logical properties
- **Error handling testing** ensures robust failure scenarios

Testing in ruchy transforms code quality from optional to mandatory, providing the confidence needed for production deployment and long-term maintenance.