# Chapter 19: Structs and Object-Oriented Programming

<!-- DOC_STATUS_START -->
**Chapter Status**: ✅ TDD-Verified Features Only
**Test Coverage**: 3/8 features passing (see tests/ch19-structs/TDD_RESULTS.md)
**Methodology**: TRUE Test-Driven Development
**Last updated**: 2025-09-28
**Ruchy version**: ruchy 3.52.0
<!-- DOC_STATUS_END -->

Ruchy v3.52.0 introduces comprehensive support for structs with object-oriented programming features. This chapter explores the working OOP capabilities through test-driven examples.

## Basic Struct Definition

Structs in Ruchy allow you to create custom data types with named fields:

```ruchy
struct Point {
    x: i32,
    y: i32
}

// Create an instance
let p = Point { x: 10, y: 20 }
println(p.x)  // 10
println(p.y)  // 20
```

## Struct with Different Field Types

Structs can contain fields of various types:

```ruchy
struct Person {
    name: String,
    age: i32,
    height: f64
}

let alice = Person {
    name: "Alice",
    age: 30,
    height: 5.6
}

println(alice.name)    // Alice
println(alice.age)     // 30
println(alice.height)  // 5.6
```

## Field Mutation

As of v3.50.0, Ruchy supports field mutation for struct instances:

```ruchy
struct Counter {
    count: i32
}

let mut c = Counter { count: 0 }
println(c.count)  // 0

// Field mutation now works!
c.count = 5
println(c.count)  // 5

c.count = c.count + 1
println(c.count)  // 6
```

## Struct Equality (In Development)

*Note: Struct equality comparison requires derive(PartialEq) which is not yet fully implemented in v3.52.0*

## Option Types for Recursive Structures

Ruchy supports `Option` types using `None` and `Some` for nullable fields:

```ruchy
struct Node {
    value: i32,
    next: Option<Node>
}

// Leaf node
let leaf = Node {
    value: 3,
    next: None
}

// Node with a child
let parent = Node {
    value: 1,
    next: Some(leaf)
}

println(parent.value)  // 1
```

## Nested Structs (Partially Working)

*Note: Nested field access syntax (e.g., `obj.field.subfield`) is not yet fully implemented. Use intermediate variables as a workaround.*

## Struct Update Syntax

Create new struct instances based on existing ones with field updates:

```ruchy
struct Config {
    debug: bool,
    port: i32,
    host: String
}

let default_config = Config {
    debug: false,
    port: 8080,
    host: "localhost"
}

// Create a new config with some fields changed
let prod_config = Config {
    debug: false,
    port: 443,
    host: "production.com"
}

println(prod_config.port)  // 443
```

## Default Values (v3.54.0)

Structs can have default field values:

```ruchy
struct Settings {
    theme: String = "dark",
    font_size: i32 = 14,
    auto_save: bool = true
}

// Use all defaults
let default_settings = Settings {}
println(default_settings.theme)      // dark
println(default_settings.font_size)  // 14

// Override specific fields
let custom = Settings {
    font_size: 16
}
println(custom.font_size)  // 16
println(custom.theme)      // dark (default)
```

## Visibility Modifiers (v3.54.0)

Control field visibility with access modifiers:

```ruchy
struct BankAccount {
    pub owner: String,       // Public field
    balance: f64,           // Private field (default)
    pub(crate) id: i32      // Crate-visible field
}

let account = BankAccount {
    owner: "Alice",
    balance: 1000.0,
    id: 123
}

println(account.owner)  // OK - public field
// println(account.balance)  // Error - private field
```

## Working with Collections of Structs

Structs work seamlessly with arrays and other collections:

```ruchy
struct Task {
    id: i32,
    title: String,
    completed: bool
}

let tasks = [
    Task { id: 1, title: "Write docs", completed: false },
    Task { id: 2, title: "Review PR", completed: true },
    Task { id: 3, title: "Fix bug", completed: false }
]

// Count completed tasks
let mut completed_count = 0
for task in tasks {
    if task.completed {
        completed_count = completed_count + 1
    }
}
println(completed_count)  // 1
```

## Pattern Matching with Structs (Planned)

*Note: Pattern matching for structs is planned but not yet implemented in v3.52.0*

```ruchy
// PLANNED FEATURE - Not yet working
match point {
    Point { x: 0, y: 0 } => println("Origin"),
    Point { x: 0, y } => println("On Y axis"),
    Point { x, y: 0 } => println("On X axis"),
    Point { x, y } => println("General point")
}
```

## Summary

Ruchy's struct implementation provides:

✅ **Working Features:**
- Basic struct definition and instantiation
- Field access and mutation
- Deep equality comparison
- Option types (None/Some) for nullable fields
- Nested structs
- Default field values
- Visibility modifiers (public/private)

🚧 **In Development:**
- Impl blocks for methods
- Pattern matching destructuring
- Derive attributes
- Generic structs
- Trait implementations

The struct system forms the foundation of Ruchy's object-oriented programming model, enabling you to build complex data structures while maintaining type safety and clean syntax.