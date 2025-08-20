# Appendix A: Installation Guide

*"The best programming language is useless if you can't install it. Make installation trivial, and adoption follows. Make it hard, and even great technology dies in obscurity."* - Noah Gift

## Current Status

**⚠️ Important:** Ruchy is currently in early development. The compiler exists as a Rust project that transpiles Ruchy code to Rust. There are no official installers or package manager distributions yet.

## Building from Source

### Prerequisites

You'll need Rust installed on your system:

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Clone and Build

```bash
# Clone the Ruchy compiler repository
git clone https://github.com/paiml/ruchy.git
cd ruchy

# Build the compiler
cargo build --release

# After building, the compiled binary is located at:
# target/release/ruchy
```

### Manual Installation

```bash
# Copy to a location in your PATH (Unix-like systems)
sudo cp target/release/ruchy /usr/local/bin/

# Or add to PATH
export PATH="$PWD/target/release:$PATH"
```

## Using Ruchy

Once built, you can use the Ruchy compiler to transpile `.ruchy` files to Rust:

```bash
# Transpile a Ruchy file to Rust
ruchy transpile input.ruchy -o output.rs

# Then compile the Rust code
rustc output.rs -o program
./program
```

## Development Setup

### Running Tests

```bash
# In the ruchy directory
cargo test
```

### Using Ruchy REPL

```bash
# Start the REPL
cargo run --bin ruchy repl
```

## IDE Support

Currently, there is no official IDE support for Ruchy. However:

1. **Syntax Highlighting**: You can use Rust syntax highlighting as a temporary solution since Ruchy syntax is similar
2. **This Book**: The Ruchy book (this documentation) includes custom syntax highlighting for viewing Ruchy code

## Future Installation Plans

The following installation methods are planned but **not yet available**:

- [ ] Official binary releases
- [ ] Package manager support (Homebrew, apt, etc.)
- [ ] One-line installers
- [ ] VS Code extension
- [ ] Language server protocol (LSP) implementation

## Getting Help

- **GitHub Issues**: https://github.com/paiml/ruchy/issues
- **Source Code**: https://github.com/paiml/ruchy

## Important Notes

1. **No Official Releases**: There are no official release binaries yet
2. **No Package Managers**: Ruchy is not available through any package manager
3. **Build from Source**: Currently, building from source is the only way to use Ruchy
4. **Experimental**: The language is experimental and the syntax/features may change

## Verifying Your Installation

After building from source:

```bash
# Check if ruchy is accessible
ruchy --help

# Try transpiling a simple program
echo 'fun main() { println("Hello from Ruchy!") }' > test.ruchy
ruchy transpile test.ruchy -o test.rs
rustc test.rs -o test
./test
```

If you encounter issues, please report them at the GitHub repository.