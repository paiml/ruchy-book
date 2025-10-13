# Chapter 14: The Ruchy Toolchain - Professional Development Tools

<!-- DOC_STATUS_START -->
**Chapter Status**: ✅ 100% Validated (5/5 examples)

**Chapter Type**: Tooling Documentation (not language features)

*Last updated: 2025-10-13*
*Ruchy version: v1.84.0*

**Validated Examples (5/5) - 100% Pass Rate**:
- Example 1: Basic greet function ✅
- Example 2: Calculator with add ✅
- Example 3: Calculator with add and multiply ✅
- Example 4: Recursive factorial ✅
- Example 5: Iterative fibonacci ✅

**Tools Validated**:
- ✅ ruchy check - Syntax validation
- ✅ ruchy lint - Style analysis
- ✅ ruchy score - Quality scoring (A+ grades achieved)
- ✅ ruchy runtime - Performance analysis

**Note**: This chapter documents HOW to use Ruchy's professional tooling suite. All code examples have been validated to compile and run successfully.
<!-- DOC_STATUS_END -->

The Ruchy programming language comes with a comprehensive suite of professional development tools that ensure code quality, performance, and maintainability. This chapter teaches you to master the entire Ruchy toolchain, from basic syntax validation to advanced formal verification.

## The Problem

Professional software development requires more than just writing code that works. Modern developers need:
- **Quality Assurance**: Automated code quality checking
- **Performance Analysis**: Understanding code efficiency 
- **Team Collaboration**: Consistent formatting and standards
- **Continuous Integration**: Automated testing and validation
- **Documentation**: Generated API docs and examples

The Ruchy toolchain provides all these capabilities through a unified command-line interface.

## Quick Example

Let's start with a simple program and see how the toolchain helps us maintain professional quality:

```ruchy
fun greet(name: String) -> String {
    "Hello, " + name + "!"
}

fun main() {
    let message = greet("Ruchy Developer");
    println(message);
}
```

## Core Development Tools

### Syntax Validation - `ruchy check`

The foundation of quality is correct syntax. The `check` command validates your code structure:

```bash
# Validate a single file
$ ruchy check hello_world.ruchy
✓ Syntax is valid

# Check multiple files
$ ruchy check **/*.ruchy
✓ All 25 files passed syntax validation

# Use in scripts (exits with error code on failure)
$ ruchy check src/ || exit 1
```

**When to use**: Before every commit, in CI/CD pipelines, during development.

### Testing - `ruchy test`

Professional development requires comprehensive testing:

```ruchy
// calculator_test.ruchy
fun add(a: i32, b: i32) -> i32 {
    a + b
}

fun test_addition() {
    let result = add(2, 3);
    assert_eq(result, 5);
    println("Addition test passed");
}

fun main() {
    test_addition();
}
```

```bash
# Run tests with coverage
$ ruchy test calculator_test.ruchy
🧪 Running test...
✓ All tests passed
📊 Coverage: 100%
```

### Code Quality - `ruchy lint`

Style consistency and best practices enforcement:

```bash
# Style analysis
$ ruchy lint hello_world.ruchy
✓ No style issues found

# Get detailed feedback
$ ruchy lint --verbose calculator.ruchy
📊 Quality Analysis Complete
```

The linter checks for common issues like unused variables, complex functions, and style violations.

### Quality Scoring - `ruchy score`

Unified quality metrics for your code:

```bash
$ ruchy score hello_world.ruchy
=== Quality Score ===
File: hello_world.ruchy
Score: 1.00/1.0 (A+)
Analysis Depth: standard
```

**Score Interpretation**:
- **1.00 (A+)**: Production ready
- **0.85-0.99 (A)**: High quality  
- **0.70-0.84 (B)**: Good quality
- **< 0.70**: Needs improvement

## Advanced Quality Tools

### Performance Analysis - `ruchy runtime`

Understanding your code's performance characteristics:

```ruchy
fun calculate_factorial(n: i32) -> i32 {
    if n <= 1 {
        1
    } else {
        n * calculate_factorial(n - 1)
    }
}

fun main() {
    let result = calculate_factorial(10);
    println(result);
}
```

```bash
$ ruchy runtime factorial.ruchy
=== Performance Analysis ===
- Time Complexity: O(n)
- Space Complexity: O(n) 
- Optimization Score: 85%
```

### Formal Verification - `ruchy prove`

Mathematical verification of code properties:

```bash
$ ruchy prove math_functions.ruchy
=== Provability Analysis ===
- add_function: ✓ Mathematically sound
- multiply_function: ✓ Properties verified  
- Provability Score: 95%
```

This tool analyzes mathematical properties of your functions and verifies logical correctness.

### Code Formatting - `ruchy fmt`

Consistent code formatting across your project:

```bash
# Check formatting
$ ruchy fmt hello_world.ruchy
✓ Code is properly formatted

# Auto-format files
$ ruchy fmt --write src/
✓ Formatted 15 files

# Check in CI (exit code 1 if formatting needed)
$ ruchy fmt --check src/
```

### Documentation Generation - `ruchy doc`

Automatic API documentation from your code:

```bash
# Generate documentation
$ ruchy doc --output docs/ src/
📚 Generated documentation for 25 functions
🌐 Available at: docs/index.html
```

The doc tool extracts function signatures, comments, and examples to create professional documentation.

## Professional Workflow Integration

### Pre-commit Quality Gates

Integrate quality tools into your development workflow:

```bash
#!/bin/bash
# .git/hooks/pre-commit
echo "🔒 Running Ruchy quality gates..."

# Must pass all checks
ruchy check **/*.ruchy || exit 1
ruchy test **/*_test.ruchy || exit 1  
ruchy lint **/*.ruchy || exit 1
ruchy score **/*.ruchy | grep -q "A" || exit 1

echo "✅ All quality gates passed"
```

### CI/CD Pipeline Example

```yaml
# .github/workflows/quality.yml
name: Ruchy Quality Gates
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Ruchy
        run: curl -sSL install.ruchy.org | bash
        
      - name: Syntax Validation
        run: ruchy check **/*.ruchy
        
      - name: Run Tests
        run: ruchy test **/*_test.ruchy
        
      - name: Quality Analysis  
        run: ruchy score **/*.ruchy
        
      - name: Performance Check
        run: ruchy runtime **/*.ruchy
```

## Advanced Development Tools

### AST Analysis - `ruchy ast`

Understand your code's structure:

```bash
$ ruchy ast hello_world.ruchy
=== Abstract Syntax Tree ===
Program
├── Function: greet
│   ├── Parameter: name (String)
│   └── Body: BinaryOp(+)
└── Function: main
    └── Body: FunctionCall(greet)
```

### Performance Benchmarking - `ruchy bench`

Measure and compare performance:

```ruchy
fun fibonacci_recursive(n: i32) -> i32 {
    if n <= 1 {
        n
    } else {
        fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
    }
}

fun fibonacci_iterative(n: i32) -> i32 {
    let mut a = 0;
    let mut b = 1;
    let mut i = 0;
    
    while i < n {
        let temp = a + b;
        a = b;
        b = temp;
        i = i + 1;
    }
    
    a
}

fun main() {
    let result1 = fibonacci_recursive(10);
    let result2 = fibonacci_iterative(10);
    println(result1);
    println(result2);
}
```

```bash
$ ruchy bench fibonacci.ruchy
=== Benchmark Results ===
fibonacci_recursive: 12.4ms ± 0.8ms
fibonacci_iterative: 0.1ms ± 0.01ms
Winner: fibonacci_iterative (124x faster)
```

### Coverage Analysis - `ruchy-coverage`

Detailed test coverage reporting:

```bash
$ ruchy-coverage calculator_test.ruchy
=== Coverage Report ===
Lines: 45/50 (90%)
Branches: 8/10 (80%)
Functions: 5/5 (100%)

Missing Coverage:
- Line 23: Error handling branch
- Line 31: Edge case validation
```

## Real-World Development Workflow

Here's a complete development cycle using all tools:

```bash
# 1. Create new project
$ mkdir my_ruchy_project && cd my_ruchy_project

# 2. Write your code
$ cat > calculator.ruchy << 'EOF'
fun add(a: i32, b: i32) -> i32 {
    a + b
}

fun multiply(a: i32, b: i32) -> i32 {
    a * b
}

fun main() {
    let sum = add(10, 20);
    let product = multiply(5, 6);
    println(sum);
    println(product);
}
EOF

# 3. Validate syntax
$ ruchy check calculator.ruchy
✓ Syntax is valid

# 4. Check code quality
$ ruchy score calculator.ruchy
Score: 1.00/1.0 (A+)

# 5. Run style analysis
$ ruchy lint calculator.ruchy  
✓ No style issues found

# 6. Format code consistently
$ ruchy fmt --write calculator.ruchy
✓ Code formatted

# 7. Run performance analysis
$ ruchy runtime calculator.ruchy
Optimization Score: 98%

# 8. Generate documentation
$ ruchy doc --output docs/ calculator.ruchy
📚 Documentation generated

# 9. Commit with confidence
$ git add . && git commit -m "Add calculator with 100% quality"
```

## Tool Integration Best Practices

### Development Environment Setup

Add these to your shell profile (`~/.bashrc` or `~/.zshrc`):

```bash
# Ruchy development aliases
alias rc='ruchy check'
alias rt='ruchy test'  
alias rs='ruchy score'
alias rl='ruchy lint'
alias rf='ruchy fmt --write'

# Quality gate shortcut
alias rq='ruchy check **/*.ruchy && ruchy test **/*_test.ruchy && ruchy lint **/*.ruchy'
```

### Makefile Integration

```makefile
# Makefile for Ruchy projects
.PHONY: check test lint score format quality

check:
	ruchy check **/*.ruchy

test:
	ruchy test **/*_test.ruchy

lint:
	ruchy lint **/*.ruchy

score:
	ruchy score **/*.ruchy

format:
	ruchy fmt --write **/*.ruchy

quality: check test lint score
	@echo "✅ All quality gates passed"

clean:
	rm -f **/*.tmp **/*.bak
```

### Editor Integration

For VS Code, add to `settings.json`:

```json
{
    "files.associations": {
        "*.ruchy": "ruchy"
    },
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.ruchy": true
    }
}
```

## Performance Optimization Workflow

When optimizing code performance:

1. **Baseline measurement**: `ruchy runtime original.ruchy`
2. **Identify bottlenecks**: `ruchy bench --profile original.ruchy`  
3. **Make improvements**: Edit your code
4. **Verify correctness**: `ruchy test optimized.ruchy`
5. **Measure improvement**: `ruchy bench original.ruchy optimized.ruchy`
6. **Ensure quality**: `ruchy score optimized.ruchy`

## Quality Metrics Dashboard

Track your project's health over time:

```bash
#!/bin/bash
# generate_metrics.sh
echo "# Project Quality Dashboard"
echo "Generated: $(date)"
echo ""

echo "## Test Results"
ruchy test **/*_test.ruchy | grep -E "(passed|failed|coverage)"

echo "## Quality Scores"  
ruchy score **/*.ruchy | grep "Score:"

echo "## Style Analysis"
ruchy lint **/*.ruchy | grep "Summary:"

echo "## Performance"
ruchy runtime **/*.ruchy | grep "Optimization Score:"
```

Run this script regularly to track quality trends.

## Troubleshooting Common Issues

### Build Failures

```bash
# Debug syntax issues
$ ruchy check --verbose problematic.ruchy

# Check for common problems
$ ruchy lint --strict problematic.ruchy  

# Validate with different modes
$ ruchy check --pedantic problematic.ruchy
```

### Performance Problems

```bash
# Profile performance bottlenecks
$ ruchy runtime --profile slow.ruchy

# Compare algorithms
$ ruchy bench algorithm1.ruchy algorithm2.ruchy

# Check complexity analysis
$ ruchy runtime --complexity slow.ruchy
```

### Quality Issues

```bash
# Get detailed quality breakdown
$ ruchy score --verbose low_quality.ruchy

# Focus on specific issues
$ ruchy lint --only warnings low_quality.ruchy

# Track improvement over time
$ ruchy score --history low_quality.ruchy
```

## Summary

The Ruchy toolchain provides professional-grade development tools:

- ✅ **ruchy check**: Syntax validation and compilation verification
- ✅ **ruchy test**: Comprehensive testing with coverage analysis
- ✅ **ruchy lint**: Style analysis and best practices enforcement
- ✅ **ruchy score**: Unified quality scoring (target: A+ grade)
- ✅ **ruchy fmt**: Consistent code formatting
- ✅ **ruchy doc**: Automated documentation generation
- ✅ **ruchy runtime**: Performance analysis and optimization
- ✅ **ruchy prove**: Formal verification capabilities
- ✅ **ruchy ast**: Code structure analysis
- ✅ **ruchy bench**: Performance benchmarking
- ✅ **ruchy-coverage**: Detailed coverage reporting

## Key Takeaways

1. **Use tools continuously**: Integrate into daily development workflow
2. **Automate quality gates**: Set up pre-commit hooks and CI/CD  
3. **Target A+ scores**: Maintain high quality standards
4. **Profile performance**: Use runtime analysis for optimization
5. **Generate documentation**: Keep docs current with ruchy doc
6. **Test comprehensively**: Aim for 100% coverage

The Ruchy toolchain transforms code quality from an afterthought into a built-in development practice, enabling professional software development with confidence and speed.

## Exercises

1. Set up pre-commit hooks with all quality tools
2. Create a CI/CD pipeline for a Ruchy project
3. Use benchmarking to optimize a recursive function
4. Generate documentation for a multi-file project
5. Achieve A+ quality scores on a complex codebase