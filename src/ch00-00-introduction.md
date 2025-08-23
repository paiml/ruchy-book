# Introduction

## What is Ruchy?

Ruchy is a modern programming language that transpiles to Rust, combining ease of use with systems-level performance. It's designed for developers who want to write fast, safe code without wrestling with complex syntax or lifetime annotations.

## Key Features

### Simplicity First
Write code that reads like Python but runs like Rust:

```text
fun greet(name: str) -> str {
    "Hello, " + name + "!"
}
```

### Zero-Cost Abstractions
Every Ruchy feature compiles to optimal Rust code with no runtime overhead.

### Progressive Complexity
Start simple, add complexity only when needed. You can write entire programs without thinking about ownership, then gradually adopt advanced features as your needs grow.

### First-Class Data Science Support
Built-in DataFrame support via Polars integration makes data manipulation as easy as Python pandas but with Rust's performance.

## Who Should Read This Book?

This book is for you if you:
- Want to write high-performance code without the complexity
- Are coming from Python and want compiled language benefits
- Know Rust but want a more ergonomic syntax for rapid development
- Need to process data efficiently without sacrificing safety

## What This Book Covers

We'll take you on a journey from "Hello, World!" to building complex systems:

1. **Basics**: Variables, functions, control flow
2. **Ownership**: Simplified memory management
3. **Collections**: Lists, dictionaries, and functional operations
4. **Error Handling**: Robust error management with Result types
5. **Concurrency**: Async/await and actor systems
6. **Data Science**: DataFrame operations and analytics
7. **Advanced**: Macros, unsafe code, and Rust interop

## Prerequisites

You should be comfortable with:
- Basic programming concepts (variables, functions, loops)
- Using a terminal/command line
- A text editor or IDE

You don't need to know Rust - we'll explain everything as we go.

## How to Read This Book

This book is designed to be read in order if you're new to Ruchy. However, each chapter is self-contained enough that experienced programmers can jump to topics of interest.

Code examples build on each other within chapters but not necessarily between chapters, so you can start fresh with each new topic.

## Conventions Used

Throughout this book, we use the following conventions:

- **Code blocks** show Ruchy code that you can compile and run
- **Output blocks** show what the code produces
- **Transpilation insights** reveal the generated Rust code
- **Exercises** help reinforce concepts (solutions in Appendix G)

## Getting Help

If you have questions:
- Check the error messages - Ruchy provides helpful, actionable errors
- Visit the official documentation at docs.ruchy.org
- Join our community at community.ruchy.org
- Report issues at github.com/paiml/ruchy

Let's get started!