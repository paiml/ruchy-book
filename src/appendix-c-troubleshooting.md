# Appendix C: Troubleshooting Guide

<!-- DOC_STATUS_START -->
**Chapter Status**: ❌ 5% Working (1/20 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 1 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 19 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 1.9.0*
<!-- DOC_STATUS_END -->


*"Every error message is a teacher, every crash is a lesson. The best programmers aren't those who never encounter problems - they're the ones who solve them fastest. This guide is your debugging companion when things go wrong."* - Noah Gift

## Common Compilation Errors

### Syntax Errors

#### Missing Semicolons
```ruchy
// Status: ❌ BROKEN

// ❌ Error
let x = 42
let y = 24

// ✅ Fixed
let x = 42;
let y = 24;

// Note: Semicolons needed for statements, not expressions






// Error: ✗ Compilation failed: Compilation failed:

```

#### Unmatched Braces/Parentheses
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// ❌ Error
if condition {
    do_something()
// Missing closing brace

// ✅ Fixed  
if condition {
    do_something()
}






```

#### Invalid Variable Names
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// ❌ Error
let 123invalid = "nope"
let my-var = "no hyphens"
let fn = "keyword"

// ✅ Fixed
let invalid_123 = "ok"
let my_var = "underscores ok"
let function_name = "not keyword"






```

### Type Errors

#### Type Mismatch
```ruchy
// Status: ❌ BROKEN

// ❌ Error
let x: i32 = "string"



// ✅ Fixed
let x: i32 = 42
// or
let x = "string"  // Let compiler infer type






// Error: ✗ Compilation failed: Compilation failed:

```

#### Cannot Move Out of Borrowed Content
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// ❌ Error
let s = String::from("hello")
let r = &s
let moved = *r  // Cannot move out of borrowed content

// ✅ Fixed
let s = String::from("hello")
let r = &s
let copied = r.clone()  // Clone instead of move






```

#### Use After Move
```ruchy
// Status: ❌ BROKEN

// ❌ Error
let s = String::from("hello")
takes_ownership(s)
println(s)  

// ✅ Fixed - Option 1: Clone
let s = String::from("hello")
takes_ownership(s.clone())
println(s)  // s still valid

// ✅ Fixed - Option 2: Borrow
let s = String::from("hello")
borrows_value(&s)
println(s)  // s still valid






// Error: ✗ Compilation failed: Compilation failed:

```

### Lifetime Errors

#### Borrowed Value Does Not Live Long Enough
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// ❌ Error
fun dangle() -> &String {
    let s = String::from("hello")
    &s  // s goes out of scope
}

// ✅ Fixed - Return owned value
fun not_dangle() -> String {
    let s = String::from("hello")
    s  // Move ownership
}

// ✅ Fixed - Use static lifetime
fun static_str() -> &'static str {
    "hello"  // String literals have static lifetime
}






```

#### Multiple Mutable References
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// ❌ Error
let mut s = String::from("hello")
let r1 = &mut s
let r2 = &mut s  // Error: ✗ Compilation failed: Failed to parse Ruchy source
println(r1)
println(r2)

// ✅ Fixed - Use references sequentially
let mut s = String::from("hello")
{
    let r1 = &mut s
    // r1 scope ends here
}
let r2 = &mut s  // Now ok






```

## Runtime Errors

### Panics

#### Index Out of Bounds
```ruchy
// Status: ❌ BROKEN

// ❌ Runtime panic
let v = vec![1, 2, 3]
let item = v[5]  // Panic: index out of bounds

// ✅ Safe access
let v = vec![1, 2, 3]
match v.get(5) {
    Some(item) => println("Item: {}", item),
    None => println("Index out of bounds"),
}

// ✅ Or use safe indexing
if let Some(item) = v.get(5) {
    println("Item: {}", item)
}






// Error: ✗ Compilation failed: Compilation failed:

```

#### Unwrap on None/Err
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// ❌ Runtime panic
let maybe_value: Option<i32> = None
let value = maybe_value.unwrap()  // Panic: called unwrap on None

// ✅ Safe handling
let maybe_value: Option<i32> = None
match maybe_value {
    Some(value) => println("Value: {}", value),
    None => println("No value"),
}

// ✅ Or provide default
let value = maybe_value.unwrap_or(0)






```

#### Division by Zero
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// ❌ Runtime panic
fun divide(a: i32, b: i32) -> i32 {
    a / b  // Panic if b is 0
}

// ✅ Safe division
fun safe_divide(a: i32, b: i32) -> Option<i32> {
    if b != 0 {
        Some(a / b)
    } else {
        None
    }
}

// ✅ Or return Result
fun divide_result(a: i32, b: i32) -> Result<i32, String> {
    if b != 0 {
        Ok(a / b)
    } else {
        Err("Division by zero".to_string())
    }
}






```

### Memory Issues

#### Stack Overflow
```ruchy
// Status: ✅ WORKING

// ❌ Infinite recursion causes stack overflow
fun infinite_recursion(n: i32) -> i32 {
    infinite_recursion(n + 1)  // No base case
}

// ✅ Proper recursion with base case
fun factorial(n: i32) -> i32 {
    if n <= 1 {
        1  // Base case
    } else {
        n * factorial(n - 1)
    }
}

// ✅ Or use iteration
fun factorial_iterative(n: i32) -> i32 {
    let mut result = 1
    for i in 1..=n {
        result *= i
    }
    result
}







```

#### Large Stack Allocations
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// ❌ May cause stack overflow
fun large_array() {
    let big_array: [i32; 1_000_000] = [0; 1_000_000]  // 4MB on stack
}

// ✅ Use heap allocation
fun large_vector() {
    let big_vector: Vec<i32> = vec![0; 1_000_000]  // Allocated on heap
}

// ✅ Or use Box for single large items
fun boxed_array() {
    let big_array: Box<[i32; 1_000_000]> = Box::new([0; 1_000_000])
}






```

## Performance Issues

### Unnecessary Cloning
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// ❌ Inefficient - unnecessary clones
fun process_strings(strings: Vec<String>) -> Vec<String> {
    strings.iter()
        .map(|s| s.clone().to_uppercase())  // Unnecessary clone
        .collect()
}

// ✅ More efficient - work with references
fun process_strings_efficient(strings: &[String]) -> Vec<String> {
    strings.iter()
        .map(|s| s.to_uppercase())  // to_uppercase() works on &str
        .collect()
}






```

### Inefficient String Concatenation
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// ❌ Inefficient - creates many temporary strings
fun concat_inefficient(strings: &[&str]) -> String {
    let mut result = String::new()
    for s in strings {
        result = result + s  // Creates new string each time
    }
    result
}

// ✅ Efficient - reuses buffer
fun concat_efficient(strings: &[&str]) -> String {
    let mut result = String::new()
    for s in strings {
        result.push_str(s)  // Appends to existing string
    }
    result
}

// ✅ Even better - pre-allocate capacity
fun concat_with_capacity(strings: &[&str]) -> String {
    let total_len: usize = strings.iter().map(|s| s.len()).sum()
    let mut result = String::with_capacity(total_len)
    for s in strings {
        result.push_str(s)
    }
    result
}






```

### Inefficient Collections
```ruchy
// Status: ❌ BROKEN

// ❌ Wrong collection for use case
use std::collections::VecDeque

let mut list = Vec::new()
// Frequent insertions at beginning - O(n) for each insert
for i in 0..1000 {
    list.insert(0, i)
}

// ✅ Better collection choice
let mut deque = VecDeque::new()
// Efficient insertion at front - O(1)
for i in 0..1000 {
    deque.push_front(i)
}






// Error: ✗ Compilation failed: Compilation failed:

```

## Dependency Issues

### Version Conflicts
```toml
# ❌ Conflicting versions in Cargo.toml
[dependencies]
serde = "1.0"
some_crate = "0.5"  # Depends on serde 0.9

# ✅ Compatible versions
[dependencies]
serde = "1.0"
some_crate = "1.2"  # Updated to use serde 1.0
```

### Missing Features
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Compilation failed:
// ❌ Error: no method named `json` found for type `Response`
let response = reqwest::get(url).await?
let data = response.json().await?  // Feature not enabled

// ✅ Enable required features in Cargo.toml
// [dependencies]
// reqwest = { version = "0.11", features = ["json"] }






```

### Platform-Specific Dependencies
```toml
# ✅ Conditional dependencies
[target.'cfg(windows)'.dependencies]
winapi = "0.3"

[target.'cfg(unix)'.dependencies]
libc = "0.2"
```

## IDE and Tooling Issues

### Rust-Analyzer Not Working
```bash
# Check if rust-analyzer is installed
which rust-analyzer

# Install if missing
rustup component add rust-analyzer

# Check VS Code extension
code --list-extensions | grep rust-analyzer

# Reload VS Code workspace
# Ctrl+Shift+P -> "Developer: Reload Window"
```

### Cargo Issues
```bash
# Clear cargo cache
cargo clean

# Update dependencies
cargo update

# Check for outdated dependencies
cargo outdated

# Fix formatting
cargo fmt

# Fix common issues
cargo clippy --fix
```

### Build Performance
```toml
# Optimize build performance in Cargo.toml
[profile.dev]
opt-level = 1        # Light optimization for dev builds
incremental = true   # Enable incremental compilation

[profile.dev.package."*"]
opt-level = 3        # Full optimization for dependencies

# Use faster linker (macOS/Linux)
[target.x86_64-unknown-linux-gnu]
linker = "clang"
rustflags = ["-C", "link-arg=-fuse-ld=lld"]
```

## Environment Issues

### PATH Problems
```bash
# Check if cargo/rustc are in PATH
echo $PATH | grep -o '[^:]*cargo[^:]*'

# Add to PATH (Linux/macOS)
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Windows PowerShell
$env:PATH += ";$env:USERPROFILE\.cargo\bin"
```

### Proxy Issues
```bash
# Configure cargo for corporate proxy
mkdir -p ~/.cargo
cat > ~/.cargo/config.toml << 'EOF'
[http]
proxy = "http://proxy.company.com:8080"

[https]
proxy = "http://proxy.company.com:8080"

[net]
git-fetch-with-cli = true
EOF
```

### Permission Issues
```bash
# Fix ownership (Linux/macOS)
sudo chown -R $(whoami) ~/.cargo
sudo chown -R $(whoami) ~/.rustup

# Windows - run as administrator or check antivirus
```

## Debugging Techniques

### Print Debugging
```ruchy
// Status: ❌ BROKEN

// Simple debug prints
println!("Debug: x = {}", x)
println!("Debug: {:?}", complex_struct)  // Debug formatting
println!("Debug: {:#?}", nested_struct)  // Pretty debug formatting

// Conditional debug prints
#[cfg(debug_assertions)]
println!("This only prints in debug builds")

// Debug macro
debug!("Variable state: x={}, y={}", x, y)






// Error: ✗ Compilation failed: Failed to transpile to Rust

```

### Using Debugger
```bash
# Install debugger
rustup component add llvm-tools-preview
cargo install cargo-llvm-cov

# Debug build with symbols
cargo build --debug

# Run with debugger (GDB on Linux)
rust-gdb target/debug/my_program

# Or use IDE debugging in VS Code with CodeLLDB extension
```

### Logging
```ruchy
// Status: ❌ BROKEN

use log::{debug, info, warn, error}

fun main() {
    env_logger::init()
    
    debug!("This is a debug message")
    info!("This is info")
    warn!("This is a warning")
    error!("This is an error")
}

// Control log level with environment variable
// RUST_LOG=debug cargo run






// Error: ✗ Compilation failed: Failed to transpile to Rust

```

### Testing and Debugging
```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
#[cfg(test)]
mod tests {
    use super::*
    
    #[test]
    fun test_with_debug_output() {
        let result = my_function(42)
        
        // Print for debugging (use -- --nocapture to see output)
        println!("Result: {:?}", result)
        
        assert_eq!(result, expected)
    }
    
    // Run with: cargo test -- --nocapture
}






```

## Getting Help

### Documentation Resources
```bash
# Local documentation
rustup doc
rustup doc --book

# Command help
cargo --help
rustc --help

# Crate documentation
cargo doc --open
```

### Community Resources
- **Rust Users Forum**: https://users.rust-lang.org/
- **Stack Overflow**: Tag questions with `rust`
- **Reddit**: r/rust community
- **Discord**: Rust Programming Language server
- **GitHub**: File issues on relevant repositories

### Error Message Lookup
```bash
# Get detailed error explanation
rustc --explain E0382

# Search by error code
# Most error codes are well documented online
```

### Compiler Suggestions
```bash
# Rust compiler often provides helpful suggestions
error[E0382]: borrow of moved value: `s`
  --> src/main.rs:4:20
   |
2  |     let s = String::from("hello");
   |         - move occurs because `s` has type `String`
3  |     takes_ownership(s);
   |                     - value moved here
4  |     println!("{}", s);
   |                    ^ value borrowed here after move
   |
help: consider cloning the value if the performance cost is acceptable
   |
3  |     takes_ownership(s.clone());
   |                      ++++++++
```

## Quick Reference Commands

### Diagnostic Commands
```bash
# Check installation
rustc --version
cargo --version

# Environment info
rustc --print cfg
rustc --print target-list

# Dependency tree
cargo tree

# Check for updates
cargo outdated

# Security audit
cargo audit

# Code coverage
cargo tarpaulin
```

### Common Fixes
```bash
# Reset everything
cargo clean
rm -rf target/
rm Cargo.lock

# Update toolchain
rustup update

# Fix common issues
cargo fmt
cargo clippy
cargo check

# Force rebuild
cargo build --release --force-rebuild
```

Remember: The Rust compiler is your friend. Its error messages are among the best in any programming language. Read them carefully - they often contain the exact solution to your problem!