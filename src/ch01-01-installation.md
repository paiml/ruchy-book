# Installation

Getting Ruchy installed and ready for development is straightforward. This chapter covers all installation methods and sets up the complete development environment with Ruchy's professional tooling.

## Quick Start (Recommended)

The fastest way to get Ruchy running:

```bash
# Clone and install from source
git clone https://github.com/paiml/ruchy.git
cd ruchy
cargo install --path . --force

# Verify installation
ruchy --version
# Should show: ruchy 1.10.0
```

## Installation Methods

### Method 1: Install from Source (Recommended)

This is the current recommended approach for Ruchy v1.10.0:

```bash
# Prerequisites: Rust toolchain
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Ruchy
git clone https://github.com/paiml/ruchy.git
cd ruchy
cargo install --path . --force

# This installs to ~/.cargo/bin/ruchy automatically
```

### Method 2: Development Build

For active development or trying the latest features:

```bash
git clone https://github.com/paiml/ruchy.git
cd ruchy

# Build in development mode
cargo build

# Use directly from target/debug/
./target/debug/ruchy --version

# Or build optimized version
cargo build --release
./target/release/ruchy --version
```

### Method 3: Package Managers (Future)

*Coming soon:*
- `cargo install ruchy` (when published to crates.io)
- Homebrew formula for macOS
- APT packages for Ubuntu/Debian

## Editor Setup (Optional but Recommended)

Install professional syntax highlighting and editor support:

```bash
# Install comprehensive editor support
npm install ruchy-syntax-tools

# For VS Code users (recommended)
code --install-extension ruchy-syntax-tools
```

This provides syntax highlighting, IntelliSense, and code snippets across 9+ editors including VS Code, Monaco, highlight.js, and more. See [Chapter 20: Developer Tooling](ch20-00-tooling.md) for complete editor setup.

## Verification & Setup

After installation, verify your complete Ruchy development environment:

### Basic Verification

```bash
# Check compiler is accessible
ruchy --version
# Output: ruchy 1.10.0

# View available commands
ruchy --help
# Should show all subcommands including lint, fmt, test, etc.
```

### Test Core Functionality

```bash
# Test REPL
echo '2 + 2' | ruchy repl
# Output: 4

# Test one-liner evaluation  
ruchy -e '3 * 14'
# Output: 42

# Test JSON output
ruchy -e '{"name": "Ruchy", "version": "0.11.3"}' --format json
# Output: {"name":"Ruchy","version":"0.11.3"}
```

### Create Your First Program

```bash
# Create a test file
cat > hello.ruchy << 'EOF'
fun greet(name: string) -> string {
    "Hello, " + name + "!"
}

fun main() {
    let message = greet("World");
    println(message);
}
EOF

# Check syntax
ruchy check hello.ruchy
# No output = success

# Run the program  
ruchy run hello.ruchy
# Output: Hello, World!
```

## Development Tools Setup

Ruchy v1.10.0 includes professional development tools. Set them up:

### Code Quality Tools

```bash
# Test linting
ruchy lint hello.ruchy
# Shows any style or quality issues

# Test formatting
ruchy fmt hello.ruchy --check
# Checks if code is properly formatted

# Auto-format code
ruchy fmt hello.ruchy
# Formats the file in place
```

### Testing Framework

```bash
# Create a test file
cat > math_test.ruchy << 'EOF'
fun add(a: int, b: int) -> int {
    a + b
}

fun test_add() {
    assert_eq(add(2, 2), 4);
    assert_eq(add(-1, 1), 0);
}
EOF

# Run tests
ruchy test math_test.ruchy
# Shows test results
```

### Advanced Tools

```bash
# AST inspection
ruchy ast hello.ruchy
# Shows abstract syntax tree

# Documentation generation
ruchy doc hello.ruchy
# Generates documentation from comments

# Performance analysis
ruchy bench hello.ruchy  
# Benchmarks your code
```

## IDE Integration

### VS Code Setup

1. Install the Rust extension
2. Configure for Ruchy files:

```json
// .vscode/settings.json
{
    "files.associations": {
        "*.ruchy": "rust"
    },
    "rust-analyzer.server.extraEnv": {
        "RUCHY_MODE": "1"
    }
}
```

### Vim/Neovim Setup

```vim
" Add to your .vimrc or init.vim
autocmd BufNewFile,BufRead *.ruchy set filetype=rust
```

## Troubleshooting

### "ruchy: command not found"

The binary isn't in your PATH:

```bash
# Check if cargo bin is in PATH
echo $PATH | grep -q "$HOME/.cargo/bin" && echo "✅ Cargo bin in PATH" || echo "❌ Need to add cargo bin to PATH"

# Add to PATH permanently
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Or for immediate session
export PATH="$HOME/.cargo/bin:$PATH"
```

### Build Failures

```bash
# Update Rust toolchain
rustup update stable

# Clean and rebuild
cd ruchy
cargo clean
cargo build --release

# Check system dependencies (Ubuntu/Debian)
sudo apt update && sudo apt install build-essential pkg-config

# Check system dependencies (macOS)
xcode-select --install
```

### Permission Issues

```bash
# Make binary executable (if needed)
chmod +x ~/.cargo/bin/ruchy

# Or if using development build
chmod +x ./target/release/ruchy
```

### Version Mismatches

```bash
# Ensure you have the latest version
cd ruchy
git pull origin main
cargo install --path . --force

# Verify version
ruchy --version
```

## Environment Configuration

### Shell Completion

Set up auto-completion for better productivity:

```bash
# For Bash
ruchy completions bash > ~/.ruchy_completions
echo 'source ~/.ruchy_completions' >> ~/.bashrc

# For Zsh  
ruchy completions zsh > ~/.ruchy_completions
echo 'source ~/.ruchy_completions' >> ~/.zshrc

# For Fish
ruchy completions fish > ~/.config/fish/completions/ruchy.fish
```

### Environment Variables

Useful environment variables:

```bash
# Enable verbose output
export RUCHY_VERBOSE=1

# Set custom lint rules
export RUCHY_LINT_CONFIG=~/.ruchy-lint.toml

# Development mode settings
export RUST_LOG=debug          # For detailed logging
export RUCHY_BACKTRACE=1       # Show backtraces on errors
```

## Next Steps

With Ruchy properly installed, you're ready to:

1. **Write your first program** → [Hello World](ch01-02-hello-world.md)
2. **Explore the REPL** → [Interactive Scripting](ch01-03-interpreter-scripting.md)
3. **Set up development workflow** → [Developer Tooling](ch20-00-tooling.md)
4. **Learn the language basics** → [Variables and Types](ch02-00-variables-types.md)

## Professional Development Checklist

Ensure you have a complete setup:

- [ ] ✅ `ruchy --version` shows v1.10.0
- [ ] ✅ `ruchy repl` starts interactive mode
- [ ] ✅ `ruchy lint --help` shows linting options
- [ ] ✅ `ruchy fmt --help` shows formatting options  
- [ ] ✅ `ruchy test --help` shows testing framework
- [ ] ✅ Shell completion configured
- [ ] ✅ IDE/Editor configured for .ruchy files
- [ ] ✅ Can run and lint example programs

**Your Ruchy development environment is now ready for professional use!**