# Installation

## The Problem

Before you can write Ruchy code, you need the Ruchy compiler installed on your system. We'll get you set up quickly so you can start coding in minutes, not hours.

## Quick Start

The fastest way to get Ruchy:

```bash
# Install via cargo (requires Rust toolchain)
cargo install ruchy

# Verify installation
ruchy --version
```

## Installation Methods

### Method 1: Cargo Install (Recommended)

If you have Rust installed:

```bash
cargo install ruchy
```

This installs the latest stable version from crates.io.

### Method 2: Download Pre-built Binaries

Visit [https://github.com/paiml/ruchy/releases](https://github.com/paiml/ruchy/releases) and download the binary for your platform:

- **Linux**: `ruchy-x86_64-unknown-linux-gnu.tar.gz`
- **macOS**: `ruchy-x86_64-apple-darwin.tar.gz`  
- **Windows**: `ruchy-x86_64-pc-windows-msvc.zip`

Extract and add to your PATH.

### Method 3: Build from Source

For the latest development version:

```bash
git clone https://github.com/paiml/ruchy.git
cd ruchy
cargo build --release

# The binary is at target/release/ruchy
```

## Prerequisites

Ruchy requires:
- **Rust toolchain** (for compilation backend)
- **LLVM** (provided by rustc)

### Installing Rust

If you don't have Rust:

```bash
# Install rustup (Rust installer)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Verify
rustc --version
```

## Verification

Test your installation:

```bash
# Check version
ruchy --version

# Start the REPL
ruchy repl

# Run a quick test
echo 'println("Ruchy is working!")' | ruchy repl
```

You should see:
```
Ruchy is working!
```

## Development Environment Setup

### VS Code (Recommended)

Install the Ruchy extension for syntax highlighting:

1. Open VS Code
2. Install "Ruchy Language Support" extension
3. Create a file with `.ruchy` extension
4. Enjoy syntax highlighting and basic IntelliSense

### Other Editors

- **Vim/Neovim**: Use the `ruchy.vim` syntax file from the repository
- **Emacs**: Basic syntax highlighting available in `ruchy-mode`
- **Sublime Text**: Package available through Package Control

## Project Setup

Create your first Ruchy project:

```bash
mkdir my-ruchy-project
cd my-ruchy-project

# Create main file
echo 'println("Hello from my project!")' > main.ruchy

# Run it
ruchy run main.ruchy
```

## Troubleshooting

### Command not found

If `ruchy` command isn't found:

```bash
# Check if it's in PATH
which ruchy

# If installed via cargo, add to PATH:
export PATH="$HOME/.cargo/bin:$PATH"

# Make permanent by adding to ~/.bashrc or ~/.zshrc
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
```

### Compilation Errors

If you see "rustc not found":

```bash
# Install Rust if missing
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Update if outdated
rustup update
```

### Permission Errors

On Unix systems:

```bash
# Make binary executable
chmod +x ruchy

# Or install with proper permissions
sudo cargo install ruchy
```

## What's Next

Now that Ruchy is installed, let's write your first program: [Hello, World!](ch01-02-hello-world.md)