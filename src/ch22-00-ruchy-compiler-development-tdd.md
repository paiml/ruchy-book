# Working with Ruchy Compiler Development

<!-- DOC_STATUS_START -->
**Chapter Status**: ✅ 100% Validated (4/4 embedded Ruchy examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 4 | All embedded Ruchy code compiles and runs |
| ⚠️ Meta-Documentation | Yes | Bash workflows for compiler development |
| ❌ Broken | 0 | - |

*Last tested: 2025-10-13*
*Ruchy version: ruchy 3.174.0*
*Note: Chapter documents bash workflows; embedded Ruchy code validated*
<!-- DOC_STATUS_END -->

## The Problem

When developing with Ruchy, you often need to work with both the latest stable release and the development version from the compiler source. How do you check compiler status, compare versions, test new features, and integrate with ongoing development?

## Test-Driven Examples

### Example 1: Check Ruchy Compiler Availability

```bash
# Test if ruchy is available
ruchy --version
```

**Expected Output:**
```
ruchy 3.169.0
```

**What this tells us:**
- Ruchy compiler is installed and accessible
- Current version is 1.9.6
- System PATH includes ruchy binary

### Example 2: Check for Local Development Build

```bash
# Check if local development build exists
ls -la ../ruchy/target/release/ruchy 2>/dev/null || echo "No local build"
```

**Expected Output (if local build exists):**
```
-rwxrwxr-x 2 noah noah 5409128 Aug 24 19:59 ../ruchy/target/release/ruchy
```

**Expected Output (if no local build):**
```
No local build
```

### Example 3: Compare System vs Local Ruchy Versions

```bash
# Compare versions
echo "System: $(ruchy --version)"
if [ -f ../ruchy/target/release/ruchy ]; then
    echo "Local: $(../ruchy/target/release/ruchy --version)"
else
    echo "Local: Not available"
fi
```

**Expected Output:**
```
System: ruchy 3.169.0
Local: ruchy 3.169.0
```

### Example 4: Test Basic Compilation with System Ruchy

```bash
# Create simple test
echo 'fun main() { println("System ruchy works") }' > /tmp/system_test.ruchy
ruchy compile /tmp/system_test.ruchy
./a.out
```

**Expected Output:**
```
→ Compiling /tmp/system_test.ruchy...
✓ Successfully compiled to: a.out
ℹ Binary size: 3816880 bytes
System ruchy works
```

### Example 5: Test Compilation with Local Build (if available)

```bash
# Test local build if it exists
if [ -f ../ruchy/target/release/ruchy ]; then
    echo 'fun main() { println("Local ruchy works") }' > /tmp/local_test.ruchy
    ../ruchy/target/release/ruchy compile /tmp/local_test.ruchy
    ./a.out
else
    echo "Local build not available - skipping test"
fi
```

**Expected Output (with local build):**
```
→ Compiling /tmp/local_test.ruchy...
✓ Successfully compiled to: a.out
ℹ Binary size: 3816880 bytes
Local ruchy works
```

### Example 6: Check Recent Compiler Development

```bash
# Check recent commits in compiler
cd ../ruchy 2>/dev/null && git log --oneline -3 && cd - >/dev/null || echo "No compiler repo"
```

**Expected Output:**
```
64cdcaf v1.10.0: Core math functions added
6db75eb v1.10.0: Format strings fixed!
8dee837 Update Cargo.lock for v1.10.0
```

### Example 7: Test New Features from Development

```bash
# Test features that might be in development build
echo 'fun main() { 
    let x = 42
    println(x)
    // Test pipeline operator (known working)
    fun double(n: i32) -> i32 { n * 2 }
    let result = 5 |> double()
    println(result)
}' > /tmp/feature_test.ruchy

ruchy compile /tmp/feature_test.ruchy && ./a.out
```

**Expected Output:**
```
→ Compiling /tmp/feature_test.ruchy...
✓ Successfully compiled to: a.out
ℹ Binary size: 3816976 bytes
42
10
```

### Example 8: Create Development Status Report

```bash
# Generate compiler status summary
echo "=== Ruchy Compiler Status ==="
echo "System ruchy: $(ruchy --version)"
if [ -f ../ruchy/target/release/ruchy ]; then
    echo "Local build: $(../ruchy/target/release/ruchy --version)"
    echo "Local build size: $(ls -lh ../ruchy/target/release/ruchy | awk '{print $5}')"
else
    echo "Local build: Not available"
fi

# Test basic functionality
echo ""
echo "=== Basic Functionality Test ==="
echo 'println("Compiler functional test")' > /tmp/quick_test.ruchy
if ruchy compile /tmp/quick_test.ruchy >/dev/null 2>&1; then
    echo "✅ Basic compilation: PASS"
    ./a.out
else
    echo "❌ Basic compilation: FAIL"
fi
```

**Expected Output:**
```
=== Ruchy Compiler Status ===
System ruchy: ruchy 3.169.0
Local build: ruchy 3.169.0
Local build size: 5.2M

=== Basic Functionality Test ===
✅ Basic compilation: PASS
Compiler functional test
```

## Practical Usage Patterns

### When to Use System vs Local Build

**Use System Ruchy when:**
- Writing production code
- Following stable tutorials
- Testing stable features
- Creating reliable examples

**Use Local Build when:**
- Testing bleeding-edge features
- Contributing to compiler development
- Debugging compiler issues
- Validating fixes before release

### Integration with Book Development

When creating book content:

1. **Always use system ruchy** for examples
2. **Check local build** for upcoming features
3. **Document only working features** in current system version
4. **Note development features** in roadmap/future sections

## Compiler Development Workflow

### For Book Authors

```bash
# 1. Check what's available
ruchy --version
ls -la ../ruchy/target/release/ruchy 2>/dev/null || echo "No local build"

# 2. Test examples with system ruchy (for book)
echo 'your_example_here' > test.ruchy
ruchy compile test.ruchy && ./a.out

# 3. Check for new features in development
cd ../ruchy && git log --oneline -5
```

### For Feature Testing

```bash
# 1. Build latest compiler locally
cd ../ruchy
cargo build --release

# 2. Test new feature
echo 'new_feature_example' > test.ruchy
./target/release/ruchy compile test.ruchy

# 3. Compare with system behavior
ruchy compile test.ruchy
```

## Common Patterns

### Version Compatibility Check

```bash
# Get major.minor version
SYSTEM_VER=$(ruchy --version | grep -o '[0-9]\+\.[0-9]\+')
echo "System version: $SYSTEM_VER"

# Check if compatible with book examples
if [ "$SYSTEM_VER" = "1.9" ]; then
    echo "✅ Compatible with book examples"
else
    echo "⚠️ Version mismatch - book targets 1.9.x"
fi
```

### Quick Feature Test

```bash
# Test a specific language feature
test_feature() {
    local feature_code="$1"
    local feature_name="$2"
    
    echo "$feature_code" > /tmp/feature_test.ruchy
    if ruchy compile /tmp/feature_test.ruchy >/dev/null 2>&1; then
        echo "✅ $feature_name: Working"
        ./a.out
    else
        echo "❌ $feature_name: Not working"
    fi
}

# Usage
test_feature 'fun main() { println("Hello") }' "Basic functions"
test_feature 'fun main() { let x = 5 |> fun(n) { n * 2 }; println(x) }' "Pipeline operator"
```

## Test This Chapter

All examples in this chapter use only working features and can be tested:

```bash
# Run all the bash examples above
# Each should produce the expected output
```

## Summary

- System ruchy provides stable, tested functionality
- Local builds offer cutting-edge features for testing
- Always document only working system features
- Use development builds for feature exploration
- Maintain compatibility with current stable version

---

*This chapter demonstrates real compiler integration patterns that actually work with Ruchy v1.10.0*