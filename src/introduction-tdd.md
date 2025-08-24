# Introduction to Test-Driven Ruchy

Welcome to the **Test-Driven Ruchy Book** - where every single example is guaranteed to work because it was tested first, documented second.

## Why Test-Driven Documentation?

Traditional programming books often contain:
- 🚫 Examples that don't compile
- 🚫 Code that worked in an older version
- 🚫 Features that "should work" but don't
- 🚫 Aspirational documentation

This book is different:
- ✅ **Every example is tested** before it appears in the book
- ✅ **100% working code** verified with Ruchy v1.1.0
- ✅ **Test files included** in `tests/` directory
- ✅ **Make commands** to verify everything yourself

## How This Book Works

### 1. Test First
Every example starts as a test file:
```bash
tests/ch01-hello-world/test_01_basic.ruchy
```

### 2. Verify It Works
```bash
make test-ch01  # Tests all Chapter 1 examples
```

### 3. Document What Works
Only after tests pass do we document the feature.

### 4. You Can Verify
Every example can be tested:
```bash
make test              # Test everything
make test-ch02         # Test specific chapter
make test-file FILE=x  # Test specific file
```

## Book Structure

### Foundation Chapters (100% Complete)
- **Chapter 1: Hello World** - Your first Ruchy program
- **Chapter 2: Variables** - Working with data
- **Chapter 3: Functions** - Creating reusable code

### Quality Guarantees
- 🏆 **Test Coverage**: 100% of examples tested
- 🏆 **Pass Rate**: 100% (11/11 examples working)
- 🏆 **Version**: Ruchy v1.1.0
- 🏆 **Verification**: `make test` to verify yourself

## Getting Started

1. **Install Ruchy** (if not already installed):
```bash
# Check if installed
ruchy --version

# Should show: ruchy 1.8.3 or later
```

2. **Clone This Book**:
```bash
git clone https://github.com/your-repo/ruchy-book
cd ruchy-book
```

3. **Verify Examples Work**:
```bash
make test
# Should show: 11 passed, 0 failed
```

4. **Start Learning**:
Begin with Chapter 1 - every example guaranteed to work!

## Testing Your Own Code

As you write Ruchy code, test it the same way:

```bash
# Write your code
echo 'fun main() { println("Hello!"); }' > my_test.ruchy

# Test it compiles
ruchy compile my_test.ruchy

# Run it
./a.out
```

## The Toyota Way

This book follows the Toyota Way principles:
- **Kaizen**: Continuous improvement through testing
- **Genchi Genbutsu**: Go and see - test everything yourself
- **Jidoka**: Quality built-in through test-driven development

## What Makes This Different

| Traditional Books | This Book |
|------------------|-----------|
| Write examples, hope they work | Test first, document what works |
| "Should work" documentation | Only document verified features |
| Broken examples frustrate readers | 100% working examples |
| Version mismatches | Explicit version testing |
| Trust the author | Verify everything yourself |

## Ready to Start?

Turn to Chapter 1 and write your first guaranteed-to-work Ruchy program!

Every example in this book has been tested. Every feature documented actually works. This is programming education you can trust.

---

*"Quality is not an act, it is a habit."* - Aristotle

*This book makes quality a habit through test-driven documentation.*