# Installation

## The Problem

Before you can write Ruchy code, you need the Ruchy compiler installed on your system. Currently, Ruchy must be built from source as there are no pre-built binaries or package manager distributions yet.

## Current Status

**⚠️ Important:** Ruchy is in early development. There are:
- ❌ No pre-built binaries
- ❌ No `cargo install ruchy` (not published to crates.io)
- ❌ No package manager support

You must build from source.

## Building from Source

### Prerequisites

You need the Rust toolchain installed:

```bash
# Install Rust if you don't have it
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Reload your shell configuration
source ~/.bashrc  # or ~/.zshrc on macOS

# Verify Rust is installed
rustc --version
cargo --version
```

### Build Steps

```bash
# Clone the Ruchy compiler repository
git clone https://github.com/paiml/ruchy.git
cd ruchy

# Build the compiler in release mode
cargo build --release

# After successful build, find the binary at:
# target/release/ruchy
```

### Installation Options

#### Option 1: Copy to System Path

```bash
# Copy the binary to a system location (Unix-like systems)
sudo cp target/release/ruchy /usr/local/bin/

# Verify it's accessible
ruchy --version
```

#### Option 2: Add to PATH

```bash
# Add the build directory to your PATH
export PATH="$PWD/target/release:$PATH"

# Make it permanent by adding to your shell profile
echo 'export PATH="'$PWD'/target/release:$PATH"' >> ~/.bashrc
```

#### Option 3: Create Alias

```bash
# Create an alias
alias ruchy="$PWD/target/release/ruchy"

# Add to shell profile for persistence
echo 'alias ruchy="'$PWD'/target/release/ruchy"' >> ~/.bashrc
```

## Verification

After installation, verify Ruchy works:

```bash
# Check the compiler is accessible
ruchy --help

# Create a test file
echo 'fun main() { println("Hello, Ruchy!") }' > test.ruchy

# Transpile to Rust
ruchy transpile test.ruchy -o test.rs

# View the generated Rust code
cat test.rs

# Compile and run
rustc test.rs -o test
./test
# Should output: Hello, Ruchy!
```

## Troubleshooting

### "ruchy: command not found"

The binary isn't in your PATH. Either:
1. Use the full path: `./target/release/ruchy`
2. Add to PATH as shown above
3. Copy to `/usr/local/bin/`

### Build Fails

Common issues:
- **Old Rust version**: Update with `rustup update`
- **Missing dependencies**: Install build-essential (Linux) or Xcode tools (macOS)
- **Compilation errors**: The main branch might be broken; try a tagged release

### Permission Denied

Make the binary executable:
```bash
chmod +x target/release/ruchy
```

## Development Setup

For active development:

```bash
# Run tests
cargo test

# Run with debug output
RUST_LOG=debug cargo run -- transpile test.ruchy

# Use the REPL
cargo run --bin ruchy repl
```

## Next Steps

With Ruchy installed, you're ready to:
1. Write your first program (next section)
2. Explore the REPL
3. Study how Ruchy transpiles to Rust

Remember: Ruchy is experimental. The installation process will improve as the project matures.