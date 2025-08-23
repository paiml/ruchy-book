# Appendix B: Syntax Reference

<!-- DOC_STATUS_START -->
**Chapter Status**: ❌ 14% Working (5/35 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 5 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 30 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-22*  
*Ruchy version: ruchy 1.1.0*
<!-- DOC_STATUS_END -->


*"Syntax is the vocabulary of programming. Master the fundamentals, and complex programs become simple compositions of familiar patterns. This reference is your quick guide when memory fails and Stack Overflow is down."* - Noah Gift

## Lexical Structure

### Comments
```ruchy
// Status: ✅ WORKING

// Single line comment

/* 
   Multi-line comment
   Can span multiple lines
*/

/// Documentation comment for the following item
fun documented_function() {}

//! Inner documentation comment for containing item





```

### Identifiers
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '(' or '[' after macro name
// Valid identifiers
variable_name
camelCase
PascalCase
_private
_internal
snake_case_123
τ  // Unicode allowed

// Keywords (reserved)
let mut fn if else match while for loop break continue
return true false null struct enum trait impl use mod
async await type where const static pub super self




```

### Literals

#### Numeric Literals
```ruchy
// Status: ✅ WORKING

// Integers
42          // Decimal
0xFF        // Hexadecimal  
0o77        // Octal
0b1010      // Binary
1_000_000   // With separators

// Floating point
3.14
2.0
1e6         // Scientific notation
1.5e-10

// Type suffixes
42i32       // 32-bit integer
3.14f64     // 64-bit float
100u8       // Unsigned 8-bit





```

#### String Literals
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '[' after '#'
// String literals
"hello world"
"unicode: αβγ"
"escapes: \n \t \r \\ \" \'"

// Raw strings (no escapes)
r"raw string with \n literal backslashes"
r#"can contain "quotes" with # delimiters"#
r##"even more "# nested # delimiters"##

// Multi-line strings
"line one\
line two"

// Format strings
"Hello, " + name + "!"
"Result: " + value.to_s()




```

#### Character Literals
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected Arrow, found Bang
'a'         // ASCII character
'\n'        // Escape sequence
'\x41'      // Hex escape
'\u{1F600}' // Unicode escape




```

## Type System

### Primitive Types
```ruchy
// Status: ✅ WORKING

// Boolean
let flag: bool = true

// Integers
let small: i8 = -128           // 8-bit signed
let byte: u8 = 255             // 8-bit unsigned  
let short: i16 = -32768        // 16-bit signed
let word: u16 = 65535          // 16-bit unsigned
let int: i32 = -2147483648     // 32-bit signed
let uint: u32 = 4294967295     // 32-bit unsigned
let long: i64 = -9223372036854775808  // 64-bit signed
let ulong: u64 = 18446744073709551615 // 64-bit unsigned
let size: isize = -1           // Pointer-sized signed
let usize: usize = 1           // Pointer-sized unsigned

// Floating point
let single: f32 = 3.14         // 32-bit float
let double: f64 = 2.718281828  // 64-bit float

// Character
let ch: char = 'A'             // Unicode scalar value

// String
let text: str = "hello"        // String slice
let owned: String = "world"    // Owned string





```

### Compound Types
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected RightBracket, found Semicolon
// Arrays (fixed size)
let arr: [i32; 5] = [1, 2, 3, 4, 5]
let zeros: [i32; 100] = [0; 100]

// Slices (dynamic size)
let slice: &[i32] = &arr[1..3]

// Tuples
let tuple: (i32, str, bool) = (42, "hello", true)
let unit: () = ()  // Unit type

// Vectors (dynamic arrays)
let vec: Vec<i32> = vec![1, 2, 3, 4, 5]

// Hash maps
let map: HashMap<String, i32> = HashMap::new()

// Options
let maybe: Option<i32> = Some(42)
let nothing: Option<i32> = None

// Results  
let ok: Result<i32, String> = Ok(42)
let err: Result<i32, String> = Err("error message")




```

## Variable Declaration

### Let Bindings
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected identifier after 'let' or 'let mut'
// Immutable by default
let x = 42
let name = "Alice"

// Explicit type annotation
let count: i32 = 100
let score: f64 = 95.5

// Mutable variables
let mut counter = 0
counter += 1

// Pattern destructuring
let (x, y) = (10, 20)
let [first, second, ..] = [1, 2, 3, 4, 5]

// Shadowing
let x = 42
let x = "now a string"  // Shadows previous x




```

### Constants
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Unexpected token: Const
// Compile-time constants
const MAX_SIZE: usize = 1024
const PI: f64 = 3.14159265359

// Static variables
static GLOBAL_COUNTER: AtomicUsize = AtomicUsize::new(0)
static mut GLOBAL_STATE: i32 = 0  // Unsafe to mutate




```

## Control Flow

### Conditional Expressions
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected identifier after 'let' or 'let mut'
// If expressions
let result = if condition {
    "true branch"
} else {
    "false branch"
}

// Multiple conditions
if x > 0 {
    "positive"
} else if x < 0 {
    "negative"  
} else {
    "zero"
}

// Let-else pattern
let Some(value) = optional else {
    return Err("No value")
}




```

### Pattern Matching
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected FatArrow, found If
// Match expressions
match value {
    0 => "zero",
    1 | 2 => "one or two",
    3..=10 => "three through ten",
    n if n > 100 => "big number",
    _ => "something else"
}

// Destructuring patterns
match point {
    Point { x: 0, y: 0 } => "origin",
    Point { x, y: 0 } => "on x-axis at " + x.to_s() + ",",
    Point { x: 0, y } => "on y-axis at " + y.to_s() + ",",
    Point { x, y } => "point at (" + x.to_s() + ", " + y.to_s() + ")"
}

// Guards
match number {
    n if n < 0 => "negative",
    n if n > 0 => "positive", 
    _ => "zero"
}




```

### Loops
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected identifier after 'for'
// Infinite loop
loop {
    // Code here
    if condition {
        break
    }
}

// While loop
while condition {
    // Code here
}

// For loop with iterators
for item in collection {
    // Process item
}

// For loop with range
for i in 0..10 {
    println("Count: " + i.to_s())
}

// For loop with enumerate
for (index, item) in collection.enumerate() {
    println(index.to_s() + ": " + item)
}

// Loop labels and break/continue
'outer: loop {
    loop {
        if condition {
            break 'outer  // Break outer loop
        }
        if other_condition {
            continue 'outer  // Continue outer loop
        }
    }
}




```

## Functions

> **Note**: Ruchy uses `fun` as the primary function keyword for visual distinction from Rust. While `fn` is also accepted for Rust developers transitioning to Ruchy, all documentation uses `fun` and the linter will recommend `fun` over `fn` in future versions.

### Function Definition
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected FatArrow, found Char('+')
// Basic function
fun greet(name: String) -> String {
    return "Hello, " + name + "!"
}

// Implicit return (no semicolon)
fun add(a: i32, b: i32) -> i32 {
    a + b  // Last expression is returned
}

// Unit return type (no return value)
fun print_message(msg: String) {
    println(msg)
}

// Multiple parameters
fun calculate(x: f64, y: f64, operation: char) -> f64 {
    match operation {
        '+' => x + y,
        '-' => x - y,
        '*' => x * y,
        '/' => x / y,
        _ => panic("Invalid operation")
    }
}




```

### Function Parameters
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected type
// By value (move)
fun take_ownership(s: String) {
    // s is moved here
}

// By reference (borrow)
fun borrow_value(s: &String) -> usize {
    s.len()  // s is borrowed
}

// Mutable reference
fun modify_value(s: &mut String) {
    s.push_str(" modified")
}

// Default parameters
fun connect(host: String, port: u16 = 8080, timeout: u64 = 5000) {
    // Implementation
}

// Variable arguments
fun sum(numbers: &[i32]) -> i32 {
    numbers.iter().sum()
}




```

### Closures
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected type
// Closure syntax
let add = |a, b| a + b
let result = add(5, 3)

// Explicit types
let multiply: fn(i32, i32) -> i32 = |a, b| a * b

// Capturing environment
let x = 10
let add_x = |y| x + y  // Captures x
let result = add_x(5)  // 15

// Move capture
let name = String::from("Alice")
let greeter = move |greeting| {
    greeting + ", " + name + "!"  // name is moved into closure
}




```

### Higher-Order Functions
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected type
// Function as parameter
fun apply_operation(x: i32, y: i32, op: fn(i32, i32) -> i32) -> i32 {
    op(x, y)
}

// Function returning function
fun make_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

// Generic function
fun map_over<T, U, F>(items: Vec<T>, f: F) -> Vec<U>
where F: Fn(T) -> U
{
    items.into_iter().map(f).collect()
}




```

## Structs and Enums

### Struct Definition
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected LeftBrace, found LeftParen
// Basic struct
struct Point {
    x: f64,
    y: f64,
}

// Tuple struct
struct Color(u8, u8, u8)

// Unit struct
struct Marker

// Generic struct
struct Container<T> {
    value: T,
}

// Struct with lifetime
struct Excerpt<'a> {
    text: &'a str,
}




```

### Struct Usage
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected field name
// Creating instances
let origin = Point { x: 0.0, y: 0.0 }
let red = Color(255, 0, 0)

// Field access
let x_coord = origin.x

// Struct update syntax
let point2 = Point { x: 1.0, ..origin }

// Destructuring
let Point { x, y } = origin
let Color(r, g, b) = red




```

### Enum Definition
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected RightBrace, found LeftBrace
// Basic enum
enum Direction {
    North,
    South,
    East,
    West,
}

// Enum with data
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

// Generic enum
enum Result<T, E> {
    Ok(T),
    Err(E),
}




```

### Implementation Blocks
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected Colon, found Comma
impl Point {
    // Associated function (constructor)
    fun new(x: f64, y: f64) -> Point {
        Point { x, y }
    }
    
    // Method (takes &self)
    fun distance_from_origin(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
    
    // Mutable method (takes &mut self)
    fun translate(&mut self, dx: f64, dy: f64) {
        self.x += dx
        self.y += dy
    }
    
    // Consuming method (takes self)
    fun into_tuple(self) -> (f64, f64) {
        (self.x, self.y)
    }
}




```

## Traits

### Trait Definition
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected 'fun' or 'fn' keyword
// Basic trait
trait Draw {
    fun draw(&self)
}

// Trait with default implementation
trait Summary {
    fun summarize_author(&self) -> String
    
    fun summarize(&self) -> String {
        "(Read more from " + self.summarize_author() + "...)"
    }
}

// Trait with associated types
trait Iterator {
    type Item
    
    fun next(&mut self) -> Option<Self::Item>
}

// Trait with generic parameters
trait From<T> {
    fun from(value: T) -> Self
}




```

### Trait Implementation
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected Greater, found Colon
impl Draw for Point {
    fun draw(&self) {
        println("Drawing point at (" + self.x.to_s() + ", " + self.y.to_s() + ")")
    }
}

// Conditional implementation
impl<T: Display> ToString for T {
    fun to_string(&self) -> String {
        // Implementation
    }
}

// Blanket implementation
impl<T: Clone> Clone for Box<T> {
    fun clone(&self) -> Box<T> {
        // Implementation  
    }
}




```

## Generics

### Generic Functions
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected Greater, found Colon
fun largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0]
    for item in list {
        if item > largest {
            largest = item
        }
    }
    largest
}




```

### Generic Structs
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected LeftBrace, found Less
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fun new(x: T, y: T) -> Point<T> {
        Point { x, y }
    }
}

impl Point<f64> {
    fun distance_from_origin(&self) -> f64 {
        (self.x.powi(2) + self.y.powi(2)).sqrt()
    }
}




```

### Trait Bounds
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected Greater, found Colon
// Single bound
fun print_it<T: Display>(item: T) {
    println("{}", item)
}

// Multiple bounds
fun compare_and_print<T: Display + PartialOrd>(a: T, b: T) {
    if a > b {
        println("a is greater")
    } else {
        println("b is greater or equal")
    }
}

// Where clause
fun some_function<T, U>(t: T, u: U) -> i32
where
    T: Display + Clone,
    U: Clone + Debug,
{
    // Implementation
}




```

## Modules and Visibility

### Module Definition
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected LeftBrace, found Semicolon
// Inline module
mod network {
    fun connect() {
        // Implementation
    }
    
    pub fun public_function() {
        // Can be called from outside module
    }
}

// File-based modules
mod utils;  // Looks for utils.rs or utils/mod.rs

// Nested modules
mod graphics {
    pub mod shapes {
        pub fun draw_circle() {}
    }
}




```

### Visibility
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected 'fn', 'struct', 'enum', 'trait', 'impl', or 'mod' after 'pub'
pub fun public_function() {}           // Public
fun private_function() {}              // Private to module

pub struct PublicStruct {
    pub public_field: i32,            // Public field
    private_field: i32,               // Private field
}

pub(crate) fun crate_visible() {}      // Visible within crate
pub(super) fun parent_visible() {}     // Visible to parent module
pub(in crate::utils) fun limited() {} // Visible within specific path




```

### Use Declarations
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected 'fn', 'struct', 'enum', 'trait', 'impl', or 'mod' after 'pub'
use std::collections::HashMap         // Single import
use std::fs::{File, OpenOptions}      // Multiple imports
use std::io::*                        // Glob import
use std::collections::HashMap as Map  // Alias

// Re-exports
pub use internal::public_api

// Conditional compilation
#[cfg(unix)]
use unix_specific::module

#[cfg(windows)]  
use windows_specific::module




```

## Error Handling

### Result and Option
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected enum name
// Result type
enum Result<T, E> {
    Ok(T),
    Err(E),
}

// Option type
enum Option<T> {
    Some(T),
    None,
}

// Using ? operator
fun read_file(path: &str) -> Result<String, std::io::Error> {
    let content = std::fs::read_to_string(path)?
    Ok(content.to_uppercase())
}

// Combining with match
match result {
    Ok(value) => println("Success: {}", value),
    Err(error) => eprintln("Error: {}", error),
}




```

### Panic
```ruchy
// Status: ✅ WORKING

// Unconditional panic
panic!("Something went wrong!")

// Conditional panic
assert!(condition, "Condition must be true")
assert_eq!(left, right, "Values must be equal")

// Debug assertions (only in debug builds)
debug_assert!(expensive_check())





```

## Macros

### Macro Invocation
```ruchy
// Status: ✅ WORKING

// Function-like macros
println!("Hello, {}!", name)
vec![1, 2, 3, 4, 5]
format!("Value: {}", x)

// Attribute-like macros
#[derive(Debug, Clone)]
struct MyStruct {}

#[cfg(test)]
mod tests {}

// Derive macros
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct Point { x: i32, y: i32 }





```

### Macro Definition
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '(' or '[' after macro name
// Declarative macro
macro_rules! say_hello {
    () => {
        println!("Hello!")
    };
    ($name:expr) => {
        println!("Hello, {}!", $name)
    };
}

// Usage
say_hello!()
say_hello!("World")




```

## Attributes

### Common Attributes
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Unexpected token: RightParen
// Conditional compilation
#[cfg(target_os = "linux")]
fun linux_only() {}

#[cfg(feature = "network")]
mod networking {}

// Testing
#[test]
fun test_function() {}

#[ignore]
#[test]
fun expensive_test() {}

// Documentation
#[doc = "This is a documented function"]
fun documented() {}

// Deprecation
#[deprecated(note = "Use new_function instead")]
fun old_function() {}

// Allow/deny lints
#[allow(dead_code)]
fun unused_function() {}

#[deny(missing_docs)]
mod well_documented {}

// Inline hints
#[inline]
fun small_function() {}

#[inline(always)]
fun always_inline() {}




```

## Async/Await

### Async Functions
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected type
// Async function
async fun fetch_data(url: &str) -> Result<String, reqwest::Error> {
    let response = reqwest::get(url).await?
    let text = response.text().await?
    Ok(text)
}

// Async blocks
let future = async {
    let result = some_async_operation().await
    process_result(result)
}

// Async closures
let async_closure = async |x| {
    expensive_async_operation(x).await
}




```

### Futures and Streams
```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected 'fun' or 'fn' keyword
use futures::{Future, Stream}

// Implementing Future
impl Future for MyFuture {
    type Output = i32
    
    fun poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        // Implementation
    }
}

// Working with streams
let stream = async_stream::stream! {
    for i in 0..10 {
        yield i
        tokio::time::sleep(Duration::from_millis(100)).await
    }
}




```

This reference covers the essential syntax of Ruchy. For complete details, see the language specification.