#!/bin/bash
# Script to report book test failures to Ruchy compiler repo

set -e

echo "📝 Generating Ruchy Compiler Compatibility Report..."

# Generate markdown report
cat > ruchy-compatibility-report.md << 'EOF'
# Ruchy Book Example Compatibility Report

## Summary
- **Book Examples**: 259 total
- **Passing**: 57 (22%)
- **Failing**: 202 (78%)
- **Book Commit**: $(git rev-parse HEAD)
- **Date**: $(date -I)

## Top 10 Most Common Failures

### 1. Fat Arrow Syntax (23 occurrences)
```ruchy
// Book example (failing):
bench::suite("Test", {
    "name" => || { }
})

// Error: Unexpected token: FatArrow
```

### 2. String Interpolation (18 occurrences)
```ruchy
// Book example (failing):
println(f"Hello, {name}!")

// Error: Unknown prefix 'f' for string literal
```

### 3. Async/Await (12 occurrences)
```ruchy
// Book example (failing):
async { 
    http::get(url).await()
}

// Error: Unexpected token: Async
```

## Proposed Fixes

1. **Priority 1**: Fat arrow syntax for closures/lambdas
2. **Priority 2**: F-string interpolation 
3. **Priority 3**: Async/await blocks

## Test Cases for Validation

Each failing example from the book can serve as a test case.
Run the book test suite against your branch:

```bash
cd ../ruchy-book
cargo test test_all_examples
```

## Automated Testing

Add to Ruchy CI:
```yaml
- name: Test against book examples
  run: |
    git clone https://github.com/paiml/ruchy-book
    cd ruchy-book
    cargo test --test test_all_examples || true
    # Parse results and track progress
```
EOF

echo "✅ Report generated: ruchy-compatibility-report.md"

# Option to create GitHub issue
read -p "Create GitHub issue? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    gh issue create \
        --repo paiml/ruchy \
        --title "Book Example Compatibility: 202 failures (78%)" \
        --body-file ruchy-compatibility-report.md \
        --label "compatibility,book-examples,testing"
fi