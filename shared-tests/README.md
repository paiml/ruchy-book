# Shared Test Suite Between Ruchy Book and Compiler

## Purpose
This directory contains test cases extracted from the book that should pass with the Ruchy compiler.

## Structure
```
shared-tests/
├── passing/        # Examples that currently work
├── failing/        # Examples that should work but don't
├── future/         # Examples for planned features
└── test-runner.sh  # Script to run all tests
```

## Integration with Ruchy Compiler

Add to Ruchy's CI:

```yaml
- name: Book Integration Tests
  run: |
    # Clone book tests
    git clone https://github.com/paiml/ruchy-book
    
    # Run shared test suite
    ./ruchy-book/shared-tests/test-runner.sh
    
    # Report results
    if [ $? -eq 0 ]; then
      echo "✅ All book examples pass"
    else
      echo "⚠️ Some book examples fail - see report"
    fi
```

## Test Format

Each test file contains:
- `input.ruchy` - The Ruchy source code
- `expected.rs` - Expected Rust output
- `metadata.json` - Test metadata (chapter, line, priority)

## Synchronization

Run weekly sync:
```bash
# In ruchy-book repo
./shared-tests/export-to-ruchy.sh

# In ruchy repo  
./import-book-tests.sh
```