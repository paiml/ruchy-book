# Developer Tooling & Professional Workflow

<!-- DOC_STATUS_START -->
**Chapter Status**: 🚧 NOT IMPLEMENTED - Future Feature

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 0 | No support yet |
| ⚠️ Not Implemented | All | Entire feature planned |
| ❌ Broken | 0 | N/A |
| 📋 Planned | All | Target: v2.0+ |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 1.9.3*
<!-- DOC_STATUS_END -->

## ⚠️ IMPORTANT: Feature Not Yet Implemented

**Advanced developer tooling is a planned feature for Ruchy v2.0+**. This chapter describes the intended design but **none of these examples currently work**.

## What You Can Do Today

Instead of waiting for this feature, you can:
- Use the working features documented in TDD chapters
- Contribute to the implementation at [github.com/paiml/ruchy](https://github.com/paiml/ruchy)
- See the [roadmap](../appendix-roadmap.md) for timeline

## Original Content (For Reference Only)

⚠️ The content below is aspirational and does not work in current Ruchy:

---



Ruchy v0.11.0 provides a comprehensive suite of professional development tools that rival those of established languages like Rust, Go, and Python. This chapter covers the complete developer experience from linting and testing to CI/CD integration.

## The Modern Development Experience

Ruchy's tooling philosophy follows the principle of **"Quality by Default"** - all tools work together seamlessly to catch errors early, maintain code quality, and provide fast feedback loops.

### Professional Editor Support

Ruchy provides comprehensive syntax highlighting and language support across 9 major platforms through the **Ruchy Syntax Tools** project. This ensures a consistent, professional development experience regardless of your preferred editor.

```bash
# Install syntax highlighting support
npm install ruchy-syntax-tools
```

**Supported Platforms:**
- ✅ **VS Code** - Complete extension with IntelliSense, themes, and snippets
- ✅ **TextMate** - Native macOS editor support
- ✅ **Tree-sitter** - High-performance parsing for modern editors
- ✅ **Monaco** - Web-based code editor (VS Code's engine)
- ✅ **CodeMirror 6** - Modern web-based text editor
- ✅ **highlight.js** - Syntax highlighting for web applications
- ✅ **Prism.js** - Lightweight syntax highlighter
- ✅ **Rouge** - Ruby-based syntax highlighter (Jekyll, GitLab)
- ✅ **Pygments** - Python-based syntax highlighter (GitHub, Sphinx)

**Performance:** Average syntax processing time of 1.8ms with 85%+ language construct coverage.

**Repository:** https://github.com/paiml/ruchy-syntax-tools

#### VS Code Extension Setup

For the complete VS Code development experience:

```bash
# Install via VS Code marketplace or command line
code --install-extension ruchy-syntax-tools
```

Features include:
- **Syntax Highlighting** - Full Ruchy language support with proper tokenization
- **IntelliSense** - Code completion and error detection
- **Code Snippets** - Common patterns and boilerplate generation
- **Theme Support** - Optimized for popular VS Code themes

#### Web Integration

For documentation sites and online code examples:

```javascript
// highlight.js integration
const hljs = require('ruchy-syntax-tools/highlight');
hljs.highlightAll(); // Automatically highlights all <code class="ruchy"> blocks

// Prism.js integration
const prism = require('ruchy-syntax-tools/prism');
Prism.highlightAll();

// CodeMirror 6 integration
import { ruchy } from 'ruchy-syntax-tools/codemirror6';
const editor = new EditorView({
    extensions: [ruchy()]
});
```

#### Language Server Protocol

For advanced editor features and IDE integration:

```bash
# Start the Ruchy language server
ruchy-lsp --stdio

# Or use via the syntax tools package
node -e "require('ruchy-syntax-tools/lsp').start()"
```

### Tool Overview

```bash
ruchy --help
# Core development tools:
#   check    - Fast syntax validation
#   lint     - Advanced code quality analysis
#   fmt      - Automatic code formatting
#   test     - Comprehensive testing framework
#   run      - Quick execution with hot reload
#   repl     - Interactive development
#   doc      - Documentation generation
#   bench    - Performance benchmarking
#   ast      - AST inspection and analysis
```

## Code Quality Tools

### Linting with `ruchy lint`

Ruchy's linter provides professional-grade code analysis with auto-fix capabilities:

#### Basic Linting

```bash
# Lint a single file
ruchy lint src/main.ruchy

# Lint entire project
ruchy lint --all

# Get detailed explanations
ruchy lint --verbose src/main.ruchy
```

#### Advanced Features

```bash
# Auto-fix issues where possible
ruchy lint --fix src/main.ruchy

# Strict mode (all rules enabled)
ruchy lint --strict --all

# JSON output for CI/CD integration
ruchy lint --format json src/ > lint-report.json

# Target specific rule categories
ruchy lint --rules unused,style,complexity src/
```

#### Example: Comprehensive Linting

Let's create a file with various issues and see the linter in action:

```ruchy
// Status: ❌ BROKEN
// bad_code.ruchy - Multiple issues for demonstration
fun calculate_something(x: int) {
    let unused_var = 42;
    let y = x + 1;
    return y;
}

fun main() {
    let result=calculate_something(10);
    println(result);
}





// Error: ✗ Compilation failed: Compilation failed:

```

```bash
# Run linter
ruchy lint bad_code.ruchy --verbose
# Output shows:
# - unused_var is never used (unused category)
# - Missing spaces around = (style category) 
# - Missing documentation (docs category)
# - Function could be const (optimization category)

# Auto-fix what's possible
ruchy lint --fix bad_code.ruchy
# Fixes formatting, removes unused variables
```

#### Linting Configuration

Create a project-wide linting configuration:

```bash
# Generate default config
ruchy lint --init-config
# Creates .ruchy-lint.toml
```

```toml
# .ruchy-lint.toml
[rules]
unused = "error"           # Unused variables/functions
style = "warn"             # Code style issues  
complexity = "warn"        # Complex functions
security = "error"         # Security anti-patterns
performance = "warn"       # Performance issues

[settings]
max_complexity = 10        # Maximum function complexity
max_line_length = 100      # Line length limit
prefer_explicit_types = true
```

### Code Formatting with `ruchy fmt`

Consistent, beautiful code formatting with zero configuration:

```bash
# Format a single file (in-place)
ruchy fmt src/main.ruchy

# Format entire project
ruchy fmt --all

# Check formatting without modifying files
ruchy fmt --check src/

# Show what would be formatted
ruchy fmt --diff src/main.ruchy
```

#### Example: Before and After Formatting

```ruchy
// Status: ❌ BROKEN
// Before formatting (messy)
fun fibonacci(n:int)->int{if n<=1{n}else{fibonacci(n-1)+fibonacci(n-2)}}

// After running: ruchy fmt fibonacci.ruchy
fun fibonacci(n: int) -> int {
    if n <= 1 {
        n
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}





// Error: ✗ Compilation failed: Compilation failed:

```

### Syntax Checking with `ruchy check`

Fast syntax validation without compilation:

```bash
# Check syntax quickly
ruchy check src/main.ruchy

# Check all files in project
ruchy check --all

# JSON output for tooling integration
ruchy check --format json src/
```

## Testing Framework

### Comprehensive Testing with `ruchy test`

Ruchy's testing framework provides everything needed for professional testing:

#### Basic Testing

```ruchy
// Status: ❌ BROKEN
// math_utils.ruchy
fun add(a: int, b: int) -> int {
    a + b
}

fun multiply(a: int, b: int) -> int {
    a * b
}

// Tests can be in the same file or separate test files
fun test_add() {
    assert_eq(add(2, 3), 5);
    assert_eq(add(-1, 1), 0);
    assert_eq(add(0, 0), 0);
}

fun test_multiply() {
    assert_eq(multiply(2, 3), 6);
    assert_eq(multiply(-1, 5), -5);
    assert_eq(multiply(0, 100), 0);
}





// Error: ✗ Compilation failed: Compilation failed:

```

```bash
# Run all tests
ruchy test math_utils.ruchy

# Run with verbose output
ruchy test --verbose math_utils.ruchy

# Filter tests by name
ruchy test --filter "test_add" math_utils.ruchy
```

#### Advanced Testing Features

```bash
# Run tests in parallel (faster)
ruchy test --parallel src/

# Generate coverage report
ruchy test --coverage src/

# Coverage with HTML output
ruchy test --coverage --coverage-format html src/
# Generates coverage-report.html

# JSON output for CI systems
ruchy test --format json src/ > test-results.json

# JUnit XML for CI integration
ruchy test --format junit src/ > junit-results.xml
```

#### Watch Mode for Development

```bash
# Automatically rerun tests when files change
ruchy test --watch src/

# Watch with coverage
ruchy test --watch --coverage src/
```

#### Property-Based Testing

```ruchy
// Status: ❌ BROKEN
// property_test.ruchy
fun reverse_string(s: string) -> string {
    // Implementation details...
    s  // Placeholder
}

fun property_test_reverse_twice_is_identity() {
    // Property: reverse(reverse(s)) == s
    property_test(|s: string| {
        assert_eq(reverse_string(reverse_string(s)), s);
    });
}





// Error: ✗ Compilation failed: Compilation failed:

```

## Interactive Development

### REPL for Rapid Prototyping

The Ruchy REPL provides an excellent interactive development experience:

```bash
# Start REPL
ruchy repl

# Load code from file into REPL
ruchy repl --load src/math_utils.ruchy

# REPL with predefined variables
ruchy repl --prelude "let x = 42; let y = 'hello';"
```

#### REPL Commands

```
Welcome to Ruchy REPL v0.11.0
Type :help for commands

> let x = 42
42

> :help
Available commands:
  :help    - Show this help
  :quit    - Exit REPL  
  :load    - Load file
  :save    - Save session
  :clear   - Clear session
  :type    - Show type of expression

> :type x
int

> add(2, 3)  // Using function from loaded file
5
```

### Quick Execution with `ruchy run`

For rapid iteration during development:

```bash
# Run file directly (compiles and executes)
ruchy run src/main.ruchy

# Run with arguments
ruchy run src/cli_tool.ruchy arg1 arg2

# Run with environment variables
RUCHY_DEBUG=1 ruchy run src/main.ruchy

# Watch mode (rerun on file changes)
ruchy run --watch src/main.ruchy
```

## Documentation Tools

### Automated Documentation with `ruchy doc`

Generate beautiful documentation from your code:

```ruchy
// Status: ❌ BROKEN
// documented_code.ruchy

/// Calculates the factorial of a positive integer
/// 
/// # Examples
/// ```ruchy
/// let result = factorial(5);
/// assert_eq(result, 120);
/// ```
///
/// # Panics
/// Panics if n is negative
fun factorial(n: int) -> int {
    if n < 0 {
        panic("Factorial not defined for negative numbers");
    }
    
    if n == 0 || n == 1 {
        1
    } else {
        n * factorial(n - 1)
    }
}





// Error: ✗ Compilation failed: Compilation failed:

```

```bash
# Generate documentation
ruchy doc src/

# Generate with examples tested
ruchy doc --test-examples src/

# HTML output
ruchy doc --format html --output docs/ src/

# JSON output for tooling
ruchy doc --format json src/ > api-docs.json
```

## Performance Tools

### Benchmarking with `ruchy bench`

Professional benchmarking for performance optimization:

```ruchy
// Status: ❌ BROKEN
// bench_test.ruchy
fun fibonacci_recursive(n: int) -> int {
    if n <= 1 { n } else { fibonacci_recursive(n-1) + fibonacci_recursive(n-2) }
}

fun fibonacci_iterative(n: int) -> int {
    let mut a = 0;
    let mut b = 1;
    for i in range(n) {
        let temp = a + b;
        a = b;
        b = temp;
    }
    a
}

// Benchmark functions
fun bench_recursive_fib() {
    bench("fibonacci_recursive_20", || fibonacci_recursive(20));
}

fun bench_iterative_fib() {
    bench("fibonacci_iterative_20", || fibonacci_iterative(20));
}





// Error: ✗ Compilation failed: Compilation failed:

```

```bash
# Run benchmarks
ruchy bench bench_test.ruchy

# Output statistical analysis
ruchy bench --stats bench_test.ruchy

# JSON output for analysis
ruchy bench --format json bench_test.ruchy > bench-results.json

# Compare against baseline
ruchy bench --baseline previous-results.json bench_test.ruchy
```

### AST Analysis with `ruchy ast`

Inspect and analyze your code's structure:

```bash
# Show AST for file
ruchy ast src/main.ruchy

# Pretty-printed AST
ruchy ast --pretty src/main.ruchy

# JSON AST for tooling
ruchy ast --format json src/main.ruchy

# Focus on specific constructs
ruchy ast --filter functions src/main.ruchy
```

## CI/CD Integration

### GitHub Actions Workflows

Create professional CI/CD pipelines using Ruchy's tools:

```yaml
# .github/workflows/ruchy-ci.yml
name: Ruchy CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Install Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
        
    - name: Install Ruchy
      run: |
        git clone https://github.com/paiml/ruchy.git
        cd ruchy
        cargo install --path . --force
        
    - name: Check formatting
      run: ruchy fmt --check src/
      
    - name: Lint code
      run: |
        ruchy lint --format json src/ > lint-report.json
        ruchy lint --deny-warnings src/
        
    - name: Check syntax
      run: ruchy check --all
      
    - name: Run tests with coverage
      run: |
        ruchy test --coverage --format junit --coverage-format json src/
        
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: coverage.json
        
    - name: Run benchmarks
      run: ruchy bench --format json src/ > bench-results.json
      
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: |
          lint-report.json
          junit-results.xml
          coverage.json
          bench-results.json
```

### Pre-commit Hooks

Set up automatic quality checks before commits:

```bash
# Install pre-commit (if not already installed)
pip install pre-commit

# Create .pre-commit-config.yaml
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: local
    hooks:
      - id: ruchy-fmt
        name: Ruchy Format
        entry: ruchy fmt --check
        language: system
        files: \.ruchy$
        
      - id: ruchy-lint
        name: Ruchy Lint
        entry: ruchy lint --deny-warnings
        language: system
        files: \.ruchy$
        
      - id: ruchy-test
        name: Ruchy Test
        entry: ruchy test
        language: system
        files: \.ruchy$
        pass_filenames: false
EOF

# Install the hooks
pre-commit install
```

## Development Workflow Examples

### Complete Project Setup

Setting up a new Ruchy project with full tooling:

```bash
# Create project structure
mkdir my-ruchy-app
cd my-ruchy-app

# Initialize with tooling
ruchy lint --init-config
git init
touch .gitignore

# Create basic structure
mkdir -p src tests docs
echo 'target/' >> .gitignore
echo '*.log' >> .gitignore

# Create main application
cat > src/main.ruchy << 'EOF'
/// Main application entry point
fun main() {
    println("Hello, Ruchy!");
}
EOF

# Create test file
cat > tests/main_test.ruchy << 'EOF'
fun test_placeholder() {
    assert_eq(1 + 1, 2);
}
EOF

# Format all code
ruchy fmt --all

# Run initial checks
ruchy lint --all
ruchy test tests/
ruchy doc src/

# Set up CI/CD
mkdir -p .github/workflows
# ... copy CI workflow from above
```

### Daily Development Workflow

A typical development session with Ruchy tools:

```bash
# 1. Start with clean formatted code
ruchy fmt --all

# 2. Make changes to src/feature.ruchy
# ... edit code ...

# 3. Quick syntax check
ruchy check src/feature.ruchy

# 4. Run relevant tests with watch mode
ruchy test --watch --filter "feature" tests/

# 5. Lint with auto-fix
ruchy lint --fix src/feature.ruchy

# 6. Generate documentation  
ruchy doc src/

# 7. Run full test suite before commit
ruchy test --coverage tests/

# 8. Final format check
ruchy fmt --check --all

# 9. Commit (pre-commit hooks run automatically)
git commit -m "Add new feature with tests"
```

## Integration with External Tools

### VS Code Integration

```json
// .vscode/settings.json
{
  "files.associations": {
    "*.ruchy": "rust"
  },
  "editor.formatOnSave": false,
  "[ruchy]": {
    "editor.defaultFormatter": "rust-lang.rust",
    "editor.formatOnSave": true
  },
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "rust-analyzer.server.extraEnv": {
    "RUCHY_MODE": "1"
  }
}

// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Ruchy: Lint",
      "type": "shell",
      "command": "ruchy",
      "args": ["lint", "${file}"],
      "group": "build"
    },
    {
      "label": "Ruchy: Test",
      "type": "shell", 
      "command": "ruchy",
      "args": ["test", "${file}"],
      "group": "test"
    },
    {
      "label": "Ruchy: Format",
      "type": "shell",
      "command": "ruchy", 
      "args": ["fmt", "${file}"],
      "group": "build"
    }
  ]
}
```

### Makefile Integration

```makefile
# Makefile
.PHONY: check lint test fmt doc bench clean

# Quick development checks
check:
	ruchy check --all

lint:
	ruchy lint --all

test:
	ruchy test --parallel src/

fmt:
	ruchy fmt --all

# Documentation generation
doc:
	ruchy doc --format html --output docs/ src/

# Performance benchmarking  
bench:
	ruchy bench --stats src/

# Full quality gate (for CI)
quality: fmt lint test doc

# Clean build artifacts
clean:
	rm -rf target/
	rm -f *.log
	rm -rf docs/

# Development server with watch mode
dev:
	ruchy run --watch src/main.ruchy

# Coverage report
coverage:
	ruchy test --coverage --coverage-format html src/
	open coverage-report.html
```

## Best Practices

### Tool Configuration

1. **Linting**: Use strict mode in CI, warning mode for development
2. **Testing**: Run with coverage locally, parallel execution in CI
3. **Formatting**: Format on save in editor, check formatting in CI
4. **Documentation**: Generate docs with tested examples

### Performance Optimization

```bash
# Profile before optimizing
ruchy bench src/

# Use AST analysis to understand complexity
ruchy ast --filter complexity src/

# Test performance after changes
ruchy bench --baseline before.json src/
```

### Code Quality Metrics

Track these metrics over time:
- Test coverage percentage
- Lint warnings count
- Documentation coverage
- Performance benchmark trends
- Code complexity scores

## Summary

Ruchy v0.11.0's tooling provides a complete professional development experience:

- **Code Quality**: Advanced linting with auto-fix
- **Testing**: Comprehensive framework with coverage
- **Formatting**: Consistent, beautiful code
- **Documentation**: Automated generation with examples
- **Performance**: Built-in benchmarking and profiling
- **CI/CD**: Full integration with modern workflows

These tools work together seamlessly to catch errors early, maintain code quality, and provide fast feedback loops - essential for professional software development.

**Next**: Learn how to set up [GitHub Actions workflows](ch18-00-deployment-devops.md) that leverage these tools for automated quality assurance.