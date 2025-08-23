# The Ruchy Programming Language Book 📚

**Test-Driven Documentation for the Ruchy Programming Language**

[![Test Status](https://img.shields.io/badge/Tests-13%2F13%20Passing-brightgreen)](./INTEGRATION.md)
[![Ruchy Version](https://img.shields.io/badge/Ruchy-v1.3.0-blue)](https://github.com/ruchy-lang/ruchy)
[![TDD Compliance](https://img.shields.io/badge/TDD-100%25-success)](./docs/specifications/tdd-driven-ruchy-book.md)

## 🎯 **CRITICAL: Test-Driven Transformation**

This book has undergone a complete Test-Driven Development (TDD) transformation. **Every example is tested BEFORE documentation.**

### Current Status (v1.3.0)
- ✅ **Foundation Chapters**: 100% tested (11/11 examples passing)
- ✅ **Module System**: 100% tested (2/2 examples passing)
- ✅ **Total Tests**: 13/13 passing (100%)
- ✅ **Quality Gates**: All passing
- ✅ **Single Source of Truth**: [`INTEGRATION.md`](./INTEGRATION.md)

## 🧪 **Verify Everything Works**

```bash
# Test all examples
make test
# Output: 11 passed, 0 failed

# Test specific chapters
make test-ch01  # Hello World (3/3 passing)
make test-ch02  # Variables (4/4 passing)
make test-ch03  # Functions (4/4 passing)

# Run quality checks
make lint       # Check code quality
make validate   # Run all validations
```

## 📖 **What Makes This Book Different**

| Traditional Documentation | This Book |
|--------------------------|-----------|
| Write docs, hope code works | Test first, document what works |
| "Should work" examples | 100% verified examples |
| Version mismatches | Explicit v1.1.0 testing |
| Broken examples frustrate readers | Every example guaranteed to work |
| Trust the author | Verify yourself with `make test` |

## 🚀 **Quick Start**

### 1. Install Ruchy v1.1.0
```bash
# Verify version
ruchy --version
# Should show: ruchy 1.1.0
```

### 2. Clone and Test
```bash
git clone https://github.com/paiml/ruchy-book.git
cd ruchy-book
make test  # Verify all examples work
```

### 3. Read with Confidence
Every example in the foundation chapters has been:
- ✅ Written as a test first
- ✅ Verified to compile
- ✅ Executed successfully
- ✅ Documented accurately

## 📚 **Book Structure**

### Test-Driven Foundation (100% Complete)
- **Chapter 1**: [Hello World](src/ch01-02-hello-world-tdd.md) - 3 tested examples
- **Chapter 2**: [Variables](src/ch02-00-variables-types-tdd.md) - 4 tested examples
- **Chapter 3**: [Functions](src/ch03-00-functions-tdd.md) - 4 tested examples

### Future Chapters (Test-First Development)
Chapters 4-20 will be developed using the same TDD methodology:
1. Write tests
2. Verify they pass
3. Document what works
4. Never document untested features

## 🔬 **Testing Infrastructure**

### Test Organization
```
tests/
├── ch01-hello-world/     # 3 passing tests
│   ├── test_01_basic.ruchy
│   ├── test_02_multiple_prints.ruchy
│   └── test_03_with_variable.ruchy
├── ch02-variables/       # 4 passing tests
│   ├── test_01_basic_let.ruchy
│   ├── test_02_string_var.ruchy
│   ├── test_03_multiple_vars.ruchy
│   └── test_04_float_vars.ruchy
└── ch03-functions/       # 4 passing tests
    ├── test_01_basic_function.ruchy
    ├── test_02_function_with_return.ruchy
    ├── test_03_function_with_types.ruchy
    └── test_04_nested_calls.ruchy
```

### Quality Metrics
- **Test Pass Rate**: 100% (11/11)
- **Compilation Success**: 100%
- **Runtime Success**: 100%
- **Documentation Accuracy**: 100%

## 🏗️ **Development Workflow**

### Adding New Content (TDD Required)
```bash
# 1. Write test first
echo 'fun main() { /* test code */ }' > tests/ch04-control-flow/test_01_if.ruchy

# 2. Verify it works
make test-file FILE=tests/ch04-control-flow/test_01_if.ruchy

# 3. Only then document it
# Edit src/ch04-control-flow.md

# 4. Validate everything
make validate
```

### Available Commands
```bash
make help              # Show all commands
make test              # Test all examples
make test-ch01         # Test Chapter 1
make lint              # Check code quality
make format            # Check formatting
make validate          # Run all checks
make build             # Build the book
make serve             # Preview locally
```

## 📊 **Single Source of Truth**

[`INTEGRATION.md`](./INTEGRATION.md) is the ONLY status report. It contains:
- Real-time test results
- Coverage metrics
- Quality scores
- Sprint progress
- Version tracking

**All other reports have been deprecated and deleted.**

## 🛡️ **Quality Gates (Toyota Way)**

Every commit must pass:
1. ✅ All tests compile (`make test`)
2. ✅ No SATD comments (TODO/FIXME/HACK)
3. ✅ No vaporware documentation
4. ✅ Function keyword compliance (`fun` not `fn`)
5. ✅ Version consistency (v1.1.0)

## 🤝 **Contributing**

### Rules for Contributors
1. **Test First**: Write test before documentation
2. **Verify Locally**: `make test` must pass
3. **No Untested Features**: Don't document what doesn't work
4. **Update INTEGRATION.md**: Track all changes
5. **Follow TDD Process**: No exceptions

### Contribution Process
```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/ruchy-book.git

# 2. Create test
vim tests/new-feature/test_01.ruchy

# 3. Verify it works
make test-file FILE=tests/new-feature/test_01.ruchy

# 4. Document it
vim src/new-feature.md

# 5. Validate and commit
make validate
git commit -m "feat: Add new tested feature"
```

## 📈 **Project Metrics**

### Current Sprint: Foundation Complete
- Sprint 1: ✅ Infrastructure (TDD harness, quality gates)
- Sprint 2: ✅ Test Creation (11 examples, 100% passing)
- Sprint 3: ✅ Documentation (3 chapters from tests)

### Next Sprint: Intermediate Chapters
- Sprint 4: Control Flow (if/else, loops)
- Sprint 5: Data Structures (arrays, structs)
- Sprint 6: Error Handling (Result, Option)

## 🔗 **Resources**

### Documentation
- **Live Book**: [paiml.github.io/ruchy-book](https://paiml.github.io/ruchy-book/) (being updated)
- **Test Results**: [`INTEGRATION.md`](./INTEGRATION.md)
- **TDD Specification**: [`docs/specifications/tdd-driven-ruchy-book.md`](./docs/specifications/tdd-driven-ruchy-book.md)

### Ruchy Compiler
- **Repository**: [github.com/ruchy-lang/ruchy](https://github.com/ruchy-lang/ruchy)
- **Version Used**: v1.1.0
- **Installation**: See [Appendix A](src/appendix-a-installation.md)

## 📄 **License**

MIT License - See [LICENSE](LICENSE) for details.

## 🙏 **Acknowledgments**

- **Toyota Way**: For quality principles (Kaizen, Genchi Genbutsu, Jidoka)
- **TDD Community**: For test-first methodology
- **Ruchy Team**: For fixing critical bugs in v1.1.0
- **Contributors**: Everyone who tests before documenting

---

**Philosophy**: *"Test first, document what works, never promise what doesn't exist."*

**Status**: 🟢 Foundation Complete | 🔄 Intermediate Chapters Next | 📊 11/11 Tests Passing

**Last Updated**: 2025-08-23 | **Ruchy Version**: v1.1.0 | **Book Version**: 2.0.0-TDD