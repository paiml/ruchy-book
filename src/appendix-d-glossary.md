# Appendix D: Glossary

*"A shared vocabulary is the foundation of understanding. When we all speak the same language, complex ideas become simple conversations. This glossary is your reference for the terms that matter in Ruchy programming."* - Noah Gift

## A

**Allocation**
The process of reserving memory for data. In Ruchy, memory can be allocated on the stack (automatic, fast) or heap (manual, flexible).

**Arc (Atomically Reference Counted)**
A thread-safe reference counting pointer that allows multiple owners of the same data. Used for sharing data across threads safely.

**Async/Await**
A programming model for handling asynchronous operations. `async` functions return futures, and `await` suspends execution until the future completes.

**Attribute**
Metadata applied to modules, functions, structs, or other items. Written as `#[attribute_name]`. Examples: `#[derive(Debug)]`, `#[test]`.

## B

**Borrowing**
The process of creating references to data without taking ownership. Enables reading or modifying data without moving it.

**Box**
A smart pointer that allocates data on the heap. `Box<T>` provides owned heap allocation for any type `T`.

**Borrow Checker**
Ruchy's compile-time system that ensures memory safety by tracking ownership, borrowing, and lifetimes of all references.

## C

**Cargo**
Ruchy's build system and package manager. Handles dependencies, compilation, testing, and publishing of Ruchy packages.

**Channel**
A communication mechanism between threads. Data sent on one end can be received on the other end, enabling safe message passing.

**Closure**
An anonymous function that can capture variables from its surrounding environment. Defined using `|args| expression` syntax.

**Crate**
A compilation unit in Ruchy. Can be a binary (executable) or library. The top-level module of a package.

## D

**Deref Coercion**
Automatic conversion of references to types that implement the `Deref` trait. Allows `&String` to be used where `&str` is expected.

**Drop**
The process of cleaning up a value when it goes out of scope. The `Drop` trait allows custom cleanup logic.

**Dynamic Dispatch**
Runtime method resolution using trait objects. Enables polymorphism at the cost of slight performance overhead.

## E

**Enum**
A type that can be one of several variants. Each variant can optionally contain data. Example: `enum Option<T> { Some(T), None }`.

**Error Handling**
Ruchy's approach to handling failures using `Result<T, E>` and `Option<T>` types instead of exceptions.

## F

**Future**
A value that represents an asynchronous computation. Futures are lazy and must be driven by an executor to completion.

**Function Pointer**
A variable that stores the address of a function. Type notation: `fn(i32) -> i32` for a function taking an i32 and returning an i32.

## G

**Generic**
A programming construct that allows writing code that works with multiple types. Enables code reuse while maintaining type safety.

**Guard**
An object that provides access to protected data and automatically releases the protection when dropped. Used with mutexes and locks.

## H

**Heap**
A region of memory used for dynamic allocation. Data can be allocated and freed in any order, but access is slower than stack.

**Higher-Order Function**
A function that takes other functions as parameters or returns functions. Enables functional programming patterns.

## I

**Immutable**
Data that cannot be changed after creation. Ruchy variables are immutable by default unless marked with `mut`.

**Iterator**
An object that can traverse a collection of items. Implements the `Iterator` trait with a `next()` method.

## L

**Lifetime**
A name for a scope during which a reference is valid. Ensures that references don't outlive the data they point to.

**Lifetime Elision**
Compiler rules that automatically infer lifetimes in common patterns, reducing the need for explicit lifetime annotations.

## M

**Macro**
Code that generates other code at compile time. Two types: declarative (`macro_rules!`) and procedural (custom derive, function-like, attribute).

**Match**
Pattern matching construct that compares a value against patterns and executes code based on which pattern matches.

**Module**
A namespace that contains functions, types, constants, and other modules. Organizes code and controls visibility.

**Move Semantics**
The transfer of ownership of data from one variable to another. The original variable can no longer be used after a move.

**Mutex (Mutual Exclusion)**
A synchronization primitive that ensures only one thread can access shared data at a time.

## N

**Newtype Pattern**
Wrapping an existing type in a new struct to create a distinct type. Provides type safety and enables implementing traits.

## O

**Option**
An enum that represents a value that might be present (`Some(T)`) or absent (`None`). Used instead of null pointers.

**Ownership**
Ruchy's system for managing memory safety. Each value has exactly one owner, and the value is dropped when the owner goes out of scope.

## P

**Panic**
An unrecoverable error that causes the program to abort. Can be caused by bugs, failed assertions, or explicit `panic!()` calls.

**Pattern Matching**
The process of checking if a value matches a specific pattern. Used in `match` expressions, `if let`, and function parameters.

**Prelude**
A set of commonly used items that are automatically imported into every Ruchy program. Includes basic types and traits.

## R

**Reference**
A way to refer to a value without taking ownership. Immutable references (`&T`) allow reading, mutable references (`&mut T`) allow modification.

**Reference Counting**
A memory management technique where objects track how many references point to them. Used by `Rc` and `Arc`.

**Result**
An enum that represents either success (`Ok(T)`) or failure (`Err(E)`). Used for error handling instead of exceptions.

## S

**Slice**
A view into a contiguous sequence of elements. `&[T]` is an immutable slice, `&mut [T]` is a mutable slice.

**Smart Pointer**
A data structure that acts like a pointer but provides additional metadata and capabilities. Examples: `Box`, `Rc`, `Arc`.

**Stack**
A region of memory that stores local variables and function call information. Fast access but limited size.

**Static Dispatch**
Compile-time method resolution. The compiler knows exactly which function to call, enabling optimization.

**Struct**
A custom data type that groups related values together. Can have named fields or be tuple-like.

## T

**Trait**
A collection of methods that types can implement. Similar to interfaces in other languages. Enables polymorphism and code reuse.

**Trait Bound**
A constraint that specifies a generic type must implement certain traits. Written as `T: Display + Clone`.

**Trait Object**
A way to use traits for dynamic dispatch. Written as `dyn Trait`. Enables runtime polymorphism.

**Turbofish**
The `::<>` syntax used to explicitly specify generic type parameters. Example: `collect::<Vec<i32>>()`.

## U

**Unit Type**
The type `()` that has exactly one value, also written `()`. Used when no meaningful value needs to be returned.

**Unsafe**
Ruchy code that bypasses the compiler's safety checks. Must be explicitly marked with the `unsafe` keyword.

**Use Declaration**
A statement that brings items from other modules into scope. Example: `use std::collections::HashMap`.

## V

**Variable**
A named storage location for data. Variables are immutable by default but can be made mutable with the `mut` keyword.

**Vector**
A growable array type (`Vec<T>`) that stores elements on the heap. Can dynamically resize as elements are added or removed.

## Z

**Zero-Cost Abstraction**
A programming principle where high-level abstractions compile down to the same code as if written by hand at a low level.

**Zero-Sized Type (ZST)**
A type that takes up no memory space. Examples: unit type `()`, empty structs, and certain enums. Optimized away at runtime.

## Common Acronyms

**API** - Application Programming Interface  
**CLI** - Command Line Interface  
**FFI** - Foreign Function Interface  
**RAII** - Resource Acquisition Is Initialization  
**WASM** - WebAssembly  

## Symbols and Operators

**`&`** - Reference operator (borrowing)  
**`*`** - Dereference operator  
**`?`** - Error propagation operator  
**`!`** - Macro invocation or never type  
**`::<>`** - Turbofish (explicit type parameters)  
**`..`** - Range (exclusive end)  
**`..=`** - Range (inclusive end)  
**`_`** - Placeholder/wildcard pattern  

## Memory-Related Terms

**Dangling Pointer**
A pointer that references memory that has been freed. Prevented by Ruchy's borrow checker.

**Memory Leak**
Memory that is allocated but never freed. Rare in Ruchy due to automatic memory management.

**Stack Overflow**
When the stack runs out of space, usually due to infinite recursion or very deep call chains.

**Segmentation Fault**
A crash caused by accessing invalid memory. Prevented in safe Ruchy code.

## Concurrency Terms

**Data Race**
When two threads access the same memory location concurrently with at least one write and no synchronization. Prevented by Ruchy's type system.

**Deadlock**
A situation where threads are blocked forever, each waiting for the other. Can still occur in Ruchy but is less common.

**Thread Safety**
The property that code can be safely executed by multiple threads simultaneously.

## Pattern Types

**Destructuring**
Breaking down complex data types into their component parts using pattern matching.

**Guard**
An additional condition in a match arm, written as `pattern if condition`.

**Irrefutable Pattern**
A pattern that always matches, like variable names or `_`.

**Refutable Pattern**
A pattern that might not match, like `Some(x)` or specific values.

This glossary covers the essential terminology you'll encounter while programming in Ruchy. For more detailed explanations, refer to the relevant chapters in this book.