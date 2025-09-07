# Test Status Dashboard

## Real-Time Test Coverage

<div align="center">

![Tests](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/paiml/ruchy-book/badges/tests.json)
![Book Examples](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/paiml/ruchy-book/badges/book-examples.json)
![One-liners](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/paiml/ruchy-book/badges/oneliners.json)
![Quality](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/paiml/ruchy-book/badges/quality.json)

[![CI Status](https://github.com/paiml/ruchy-book/actions/workflows/test-book.yml/badge.svg)](https://github.com/paiml/ruchy-book/actions/workflows/test-book.yml)

</div>

## Test Breakdown by Chapter

Based on the latest test run against **Ruchy v1.69.0**:

| Chapter | Examples | Passing | Failing | Success Rate | Status |
|---------|----------|---------|---------|--------------|--------|
| **Ch01: Hello World** | 14 | 14 | 0 | 100% | 🟢 Perfect |
| **Ch02: Variables & Types** | 10 | 8 | 2 | 80% | 🟢 Good |
| **Ch03: Functions** | 11 | 9 | 2 | 82% | 🟢 Good |
| **Ch04: Practical Patterns** | 10 | 4 | 6 | 40% | 🟡 Needs Work |
| **Ch05: Control Flow** | 17 | 14 | 3 | 82% | 🟢 Good |
| **Ch06: Data Structures** | 8 | 8 | 0 | 100% | 🟢 Perfect |
| **Ch10: Input/Output** | 13 | 10 | 3 | 77% | 🟢 Good |
| **Ch14: Toolchain Mastery** | 4 | 4 | 0 | 100% | 🟢 Perfect |
| **Ch15: Binary Compilation** | 4 | 1 | 3 | 25% | 🔴 Critical |
| **Ch16: Testing & QA** | 8 | 5 | 3 | 63% | 🟡 Moderate |
| **Ch17: Error Handling** | 11 | 4 | 7 | 36% | 🔴 Poor |
| **Ch18: DataFrames** | 24 | 0 | 24 | 0% | 🔴 Not Working |
| **Ch21: Professional Tooling** | 1 | 1 | 0 | 100% | 🟢 Perfect |

## One-Liner Tests

| Category | Tests | Passing | Status |
|----------|-------|---------|--------|
| Basic Mathematics | 4 | 4 | 🟢 100% |
| Boolean Logic | 4 | 4 | 🟢 100% |
| String Operations | 2 | 2 | 🟢 100% |
| Mathematical Functions | 2 | 2 | 🟢 100% |
| Real-World Calculations | 3 | 3 | 🟢 100% |
| Output Functions | 1 | 0 | 🔴 0% |
| JSON Output | 2 | 0 | 🔴 0% |
| Shell Integration | 1 | 1 | 🟢 100% |
| Performance | 1 | 1 | 🟢 100% |

## Quality Gates

All valid Ruchy files in the test suite pass:
- ✅ **Syntax Check**: 100% pass
- ✅ **Style Lint**: 100% pass
- ✅ **Quality Score**: A+ grade
- ⚠️ **Formatting**: Known issue with formatter

## Test Infrastructure

### Continuous Integration
- Tests run on every push to main
- Tests run on all pull requests
- Daily scheduled runs at midnight UTC
- Manual workflow dispatch available

### How to Run Tests Locally

```bash
# Run all tests (comprehensive)
make test

# Run book examples only
deno task extract-examples

# Run one-liner tests
deno task test-oneliners

# Run dogfooding quality gates
make dogfood-quick
```

### View Full Reports

- **[Latest CI Run →](https://github.com/paiml/ruchy-book/actions/workflows/test-book.yml)**
- **[Test History →](https://github.com/paiml/ruchy-book/actions)**
- **[Integration Report →](https://github.com/paiml/ruchy-book/blob/main/INTEGRATION.md)**

## Contributing

When adding new examples to the book:

1. Test your example locally first:
   ```bash
   echo 'your_code_here' | ruchy repl
   ```

2. Add it to the appropriate chapter

3. Run tests to verify:
   ```bash
   make test
   ```

4. Submit a PR - tests will run automatically

## Known Issues

### Features Not Yet Implemented
- DataFrame support (Chapter 18)
- Some error handling patterns (Chapter 17)
- Binary compilation features (Chapter 15)
- Advanced output formatting

### Workarounds Available
- Use basic I/O instead of advanced formatting
- Use Result types for error handling
- Compile via `ruchy compile` instead of binary features

---

*Last updated: Automatically updated by CI*
*Testing against: Ruchy v1.69.0 from crates.io*