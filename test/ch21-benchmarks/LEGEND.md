# Benchmark Execution Modes - Explained Simply (ELI5)

## The 6 Ways We Run Code

### 🐍 Python (Baseline)
**What it is:** Python's built-in interpreter
**How it works:** Reads your code and runs it line-by-line
**Speed:** Medium (our comparison baseline)
**Like:** Reading a recipe while cooking

---

### 🦕 Deno (JIT - Just-In-Time)
**What it is:** TypeScript with JavaScript's V8 engine
**How it works:** Translates code to machine code as it runs
**Speed:** Fast for long runs, slow for short runs (warmup overhead)
**Like:** A translator who gets faster the more they practice

---

### 🌲 Ruchy AST (Abstract Syntax Tree)
**What it is:** Walk through the code structure directly
**How it works:** Builds a tree of your code and visits each node
**Speed:** Slowest (but useful for debugging)
**Like:** Following a flowchart one box at a time

---

### ⚡ Ruchy Bytecode (VM)
**What it is:** Pre-compiled instructions for a virtual machine
**How it works:** Converts code to compact bytecode, runs in VM
**Speed:** Fast startup, good execution (4-5x faster than Python)
**Like:** Following numbered instructions instead of reading paragraphs

---

### 🦀 Ruchy Transpiled (Source-to-Source)
**What it is:** Convert Ruchy → Rust → Machine Code
**How it works:** Translates your code to Rust, then compiles with rustc
**Speed:** Very fast (10x faster than Python)
**Like:** Translating a recipe to a different language, then following it

---

### 🚀 Ruchy Compiled (Direct)
**What it is:** Direct compilation to native machine code
**How it works:** One-step compilation to binary executable
**Speed:** Fastest (10x faster than Python)
**Like:** Having a pre-made meal ready to heat up

---

## Quick Comparison

| Mode | Startup | Execution | Best For |
|------|---------|-----------|----------|
| Python | Fast | Medium | Baseline comparison |
| Deno | Slow | Fast (after warmup) | Long-running servers |
| Ruchy AST | Fast | Slow | Development, debugging |
| Ruchy Bytecode | Fast | Fast | Scripts, CLI tools |
| Ruchy Transpiled | Slow | Very Fast | Performance-critical code |
| Ruchy Compiled | Slow | Very Fast | Production binaries |

---

## Key Terms Glossary

**AST (Abstract Syntax Tree):** A tree representation of your code structure. Like a family tree, but for code elements (functions, variables, loops, etc.).

**Bytecode:** Pre-compiled instructions that are faster to execute than source code but still need a virtual machine to run. Think: numbered steps instead of English sentences.

**Transpile:** Convert code from one programming language to another (e.g., Ruchy → Rust). Like translating a book to a different language.

**Compile:** Convert human-readable code directly to machine code (binary) that the CPU can execute. Like printing a book into a format only machines can read.

**JIT (Just-In-Time):** Compile code to machine code while the program is running, not before. Gets faster over time as it learns from execution.

**VM (Virtual Machine):** A software-based computer that runs bytecode. Not a "real" CPU, but pretends to be one.

**Machine Code:** Binary instructions (1s and 0s) that the CPU executes directly. The fastest possible code.

---

## Why Multiple Execution Modes?

Different modes optimize for different things:

- **Development:** Fast iteration (AST, bytecode)
- **Scripts:** Quick startup + good speed (bytecode)
- **Production:** Maximum performance (transpiled, compiled)
- **Comparison:** Show how each approach performs against established languages (Python, Deno)

---

*This legend helps understand Chapter 21 benchmarking results.*
