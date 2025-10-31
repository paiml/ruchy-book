# Getting Started

Let's get Ruchy installed and write our first program!

## Why Ruchy?

If you've used Python, you know the joy of thinking directly in code without ceremony or compilation steps. But you've also felt the pain of performance bottlenecks, type safety issues, and deployment complexity. If you've used Rust, you appreciate the safety and performance, but miss the quick iteration and interactive exploration.

**Ruchy gives you both: Rust without the compilation step.**

### Three Ways to Use Ruchy

**A. Script quickly without compilation** - Just like Python or Ruby, write Ruchy for sysadmin tasks, automation scripts, or quick prototypes. No build step, no waiting, just run:

```bash
$ ruchy my_script.ruchy
```

**B. Compile for performance when you need it** - When your script becomes performance-critical, Ruchy transpiles to pure Rust. You can take the generated Rust code and optimize further, or simply compile it:

```bash
$ ruchy compile my_script.ruchy
$ ./my_script  # Fast, optimized binary
```

**C. Explore interactively like IPython** - The Ruchy REPL provides an interactive development experience similar to IPython, letting you experiment, debug, and understand your code in real-time:

```bash
$ ruchy repl
>>> fun factorial(n) { if n <= 1 { 1 } else { n * factorial(n - 1) } }
>>> factorial(5)
120
```

### The Best of Both Worlds

Ruchy bridges the gap between scripting languages and systems programming:

- **Think in code** - Express ideas naturally without fighting the language
- **Safety by default** - Rust's memory safety without the complexity
- **Performance when needed** - Start scripting, compile when it matters
- **Modern tooling** - Quality analysis, formal verification, and debugging built-in

Whether you're writing quick automation scripts, building production systems, or exploring ideas interactively, Ruchy adapts to your workflow.

## Quick Start

The fastest way to try Ruchy is with the REPL:

```bash
$ ruchy repl
Ruchy 0.4.11 - Interactive REPL
>>> println("Hello, Ruchy!")
Hello, Ruchy!
```

In this chapter, we'll cover:
- Installing Ruchy on your system
- Writing your first Ruchy program
- Understanding how Ruchy works

By the end of this chapter, you'll have a working Ruchy installation and will have written, compiled, and run your first program.

## Chapter Outline

- [Installation](ch01-01-installation.md) - Get Ruchy on your system
- [Hello, World!](ch01-02-hello-world.md) - Your first program

Let's begin!