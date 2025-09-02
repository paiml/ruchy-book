# Chapter 23: REPL & Object Inspection

The Ruchy REPL (Read-Eval-Print Loop) provides powerful tools for interactive development and debugging. With the Object Inspection Protocol introduced in v1.26.0, you can explore data structures, check types, and understand memory usage interactively.

## Starting the REPL

Launch the interactive REPL:

```bash
$ ruchy repl
Welcome to Ruchy REPL v1.26.0
Type :help for commands, :quit to exit
```

## Basic REPL Usage

### Evaluating Expressions

```bash
# Simple expressions (REPL session)
> 2 + 2
4

> "Hello, " + "World!"
"Hello, World!"

> [1, 2, 3]
[1, 2, 3]
```

### Defining Variables

```bash
# Defining Variables (REPL session)
> let name = "Alice"
"Alice"

> let numbers = [1, 2, 3, 4, 5]
[1, 2, 3, 4, 5]

> let person = {"name": "Bob", "age": 25}
{"name": "Bob", "age": 25}
```

## REPL Commands

The REPL provides special commands prefixed with `:`:

### Getting Help

```
> :help
🔧 Ruchy REPL Help Menu

📋 COMMANDS:
  :help [topic]  - Show help for specific topic or this menu
  :quit, :q      - Exit the REPL
  :clear         - Clear variables and history
  :history       - Show command history  
  :env           - Show environment variables
  :type <expr>   - Show type of expression
  :ast <expr>    - Show abstract syntax tree
  :inspect <var> - Detailed variable inspection
```

## Type Inspection

Use `:type` to check the type of any expression:

```bash
# Type Inspection (REPL session)
> let arr = [1, 2, 3]
[1, 2, 3]

> :type arr
Type: List

> let num = 42
42

> :type num
Type: Integer

> let text = "Hello"
"Hello"

> :type text
Type: String
```

## Object Inspection Protocol

The `:inspect` command provides detailed information about objects:

### Inspecting Arrays

```bash
# Inspecting Arrays (REPL session)
> let data = [10, 20, 30, 40, 50]
[10, 20, 30, 40, 50]

> :inspect data
┌─ Inspector ────────────────┐
│ Variable: data              │
│ Type: List                  │
│ Length: 5                   │
│ Memory: ~40 bytes          │
│                            │
│ Options:                   │
│ [Enter] Browse entries     │
│ [S] Statistics             │
│ [M] Memory layout          │
└────────────────────────────┘
```

### Inspecting Objects

```bash
# Inspecting Objects (REPL session)
> let user = {"name": "Alice", "age": 30, "email": "alice@example.com"}
{"name": "Alice", "age": 30, "email": "alice@example.com"}

> :inspect user
┌─ Inspector ────────────────┐
│ Variable: user              │
│ Type: Object               │
│ Fields: 3                  │
│ Memory: ~120 bytes         │
│                            │
│ Options:                   │
│ [Enter] Browse entries     │
│ [S] Statistics             │
│ [M] Memory layout          │
└────────────────────────────┘
```

## Advanced Inspection Features

### Nested Structure Inspection

The inspector handles nested structures with depth limiting:

```bash
# Nested Structure Inspection (REPL session)
> let nested = {"user": {"name": "Bob", "prefs": {"theme": "dark"}}}
{"user": {"name": "Bob", "prefs": {"theme": "dark"}}}

> :inspect nested
┌─ Inspector ────────────────┐
│ Variable: nested            │
│ Type: Object               │
│ Fields: 1                  │
│ Depth: 3                   │
│ Memory: ~160 bytes         │
│                            │
│ Structure:                 │
│ └─ user: Object            │
│    └─ name: String         │
│    └─ prefs: Object        │
│       └─ theme: String     │
└────────────────────────────┘
```

### Cycle Detection

The inspector detects and handles circular references:

```bash
# Cycle Detection (REPL session)
> let a = {"name": "A"}
{"name": "A"}

> let b = {"name": "B", "ref": a}
{"name": "B", "ref": {"name": "A"}}

> a["ref"] = b  // Creates a cycle
<circular reference detected>
```

## AST Visualization

View the Abstract Syntax Tree of expressions:

```bash
# AST Visualization (REPL session)
> :ast 2 + 3 * 4
BinaryOp {
  left: Literal(2),
  op: Add,
  right: BinaryOp {
    left: Literal(3),
    op: Multiply,
    right: Literal(4)
  }
}
```

## REPL Modes

The REPL supports different modes:

### Normal Mode
Standard evaluation mode (default)

### Debug Mode
Shows detailed execution information:

```bash
# Debug Mode (REPL session)
> :debug
Debug mode enabled

> let x = 5
[DEBUG] Binding 'x' to value 5
[DEBUG] Type: Integer
[DEBUG] Memory: 8 bytes
5
```

## Practical Use Cases

### Data Exploration

```bash
# Data Exploration (REPL session)
> let data = [1, 2, 3, 4, 5]
[1, 2, 3, 4, 5]

> data.map(|x| x * 2)
[2, 4, 6, 8, 10]

> :type data.map(|x| x * 2)
Type: List
```

### Quick Calculations

```bash
# Quick Calculations (REPL session)
> let prices = [10.50, 25.00, 15.75]
[10.50, 25.00, 15.75]

> prices.sum()
51.25

> prices.sum() * 1.08  // With 8% tax
55.35
```

### Object Manipulation

```bash
# Object Manipulation (REPL session)
> let config = {"debug": false, "port": 8080}
{"debug": false, "port": 8080}

> config["debug"] = true
true

> config
{"debug": true, "port": 8080}
```

## Tips and Tricks

### Command History
- Use up/down arrows to navigate command history
- `:history` shows full command history

### Clear Environment
- `:clear` removes all variables and starts fresh
- Useful when experimenting with different approaches

### Quick Exit
- `:q` or `:quit` exits the REPL
- Ctrl+D also works on Unix systems

## Performance Considerations

The Object Inspection Protocol includes:
- **Complexity Budget**: Prevents resource exhaustion on large structures
- **Depth Limiting**: Configurable maximum depth for nested structures
- **Cycle Detection**: Handles circular references gracefully
- **Memory Estimation**: Shows approximate memory usage

## Summary

The Ruchy REPL with Object Inspection Protocol provides:
- ✅ Interactive expression evaluation
- ✅ Type checking with `:type`
- ✅ Detailed object inspection with `:inspect`
- ✅ AST visualization with `:ast`
- ✅ Debug mode for detailed execution info
- ✅ Cycle detection and depth limiting
- ✅ Memory usage estimation

This makes the REPL an essential tool for:
- Learning Ruchy syntax
- Debugging complex data structures
- Prototyping algorithms
- Exploring API responses
- Understanding memory usage

## Exercises

1. Start the REPL and create a nested object with at least 3 levels
2. Use `:inspect` to explore its structure
3. Check the types of different expressions using `:type`
4. Enable debug mode and observe the additional information
5. Create an array of objects and inspect it