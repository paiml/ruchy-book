# Ruchy Language Specification

**Version**: Based on Ruchy compiler source analysis
**Status**: Living document
**Last Updated**: 2025-10-13

## Table of Contents

1. [Introduction](#introduction)
2. [Lexical Structure](#lexical-structure)
3. [Type System](#type-system)
4. [Expressions](#expressions)
5. [Statements and Declarations](#statements-and-declarations)
6. [Functions](#functions)
7. [Structs and Classes](#structs-and-classes)
8. [Enums and Pattern Matching](#enums-and-pattern-matching)
9. [Traits and Implementations](#traits-and-implementations)
10. [Modules and Imports](#modules-and-imports)
11. [Error Handling](#error-handling)
12. [Async and Concurrency](#async-and-concurrency)
13. [Actors](#actors)
14. [DataFrames](#dataframes)
15. [Standard Library](#standard-library)
16. [Grammar Reference](#grammar-reference)

---

## 1. Introduction

Ruchy is a modern systems programming language that combines functional programming with systems programming capabilities. It features:

- **ML-style syntax** with modern enhancements
- **Strong static typing** with type inference
- **Zero-cost abstractions** via transpilation to Rust
- **Gradual typing** support
- **Actor model** for concurrency
- **Built-in DataFrame** support for data processing
- **Pattern matching** and destructuring
- **Async/await** for asynchronous programming

### Design Philosophy

- **Expression-oriented**: Nearly everything is an expression that returns a value
- **Safety without ceremony**: Strong static typing with inference to reduce boilerplate
- **Modern syntax**: Clean, readable syntax inspired by functional languages
- **Practical systems programming**: Real-world systems programming with modern abstractions

---

## 2. Lexical Structure

### 2.1 Character Set

Ruchy source files are UTF-8 encoded text files.

### 2.2 Comments

```ruchy
// Single-line comment

/* Multi-line
   comment */
```

Comments are ignored by the lexer and do not appear in the token stream.

### 2.3 Whitespace

Whitespace characters include:
- Space (U+0020)
- Tab (U+0009)
- Newline (U+000A)
- Form feed (U+000C)

Whitespace is ignored except as a token separator.

### 2.4 Shebang

Ruchy supports shebangs for executable scripts:

```ruchy
#!/usr/bin/env ruchy

println("Hello, World!")
```

The shebang line is automatically skipped by the lexer.

### 2.5 Keywords

Reserved keywords in Ruchy:

#### Control Flow
```
if, else, match, for, in, while, loop
break, continue, return
```

#### Declarations
```
let, var, fun, fn, struct, enum, trait, impl
type, class, interface, actor
```

#### Modifiers
```
pub, mut, const, static, unsafe
async, await
abstract, final, sealed, override
private, protected
```

#### Module System
```
mod, module, import, use, export, default
from, as, with, crate, self, super
```

#### Error Handling
```
try, catch, finally, throw
Ok, Err, Some, None, Result, Option
```

#### Actor Model
```
actor, spawn, send, ask, receive, state
```

#### Operators and Special
```
operator, mixin, extend, extends, implements, property
df (DataFrame keyword)
command
```

#### Literals
```
true, false, null
```

### 2.6 Identifiers

```
Identifier ::= [a-zA-Z_][a-zA-Z0-9_]*
```

Identifiers start with a letter or underscore, followed by any number of letters, digits, or underscores.

Examples:
```ruchy
x
myVariable
_private
snake_case
CamelCase
CONSTANT_VALUE
```

### 2.7 Literals

#### Integer Literals

```ruchy
42          // Decimal integer
42i32       // 32-bit signed integer
42u64       // 64-bit unsigned integer
42isize     // Platform-sized signed integer
42usize     // Platform-sized unsigned integer
```

Type suffixes supported:
- Signed: `i8`, `i16`, `i32`, `i64`, `i128`, `isize`
- Unsigned: `u8`, `u16`, `u32`, `u64`, `u128`, `usize`

#### Float Literals

```ruchy
3.14        // Float literal
3.14e10     // Scientific notation (3.14 × 10^10)
2e-5        // 2 × 10^-5
```

#### String Literals

```ruchy
"Hello, World!"              // Regular string
f"Hello, {name}!"            // Interpolated string (f-string)
r"C:\path\to\file"           // Raw string (no escape processing)
```

Escape sequences in regular strings:
- `\n` - newline
- `\t` - tab
- `\r` - carriage return
- `\\` - backslash
- `\"` - double quote
- `\'` - single quote
- `\0` - null character
- `\u{XXXX}` - Unicode escape (hex code point)

#### Character Literals

```ruchy
'a'         // Character
'\n'        // Escaped character
'\u{41}'    // Unicode character (A)
```

#### Byte Literals

```ruchy
b'A'        // Byte literal (u8)
b'\n'       // Escaped byte
```

#### Boolean Literals

```ruchy
true
false
```

#### Unit and Null

```ruchy
()          // Unit value (empty tuple)
null        // Null value
```

### 2.8 Operators

#### Arithmetic Operators
```
+   (addition)
-   (subtraction)
*   (multiplication)
/   (division)
%   (modulo)
**  (exponentiation/power)
```

#### Comparison Operators
```
==  (equal)
!=  (not equal)
<   (less than)
<=  (less than or equal)
>   (greater than)
>=  (greater than or equal)
```

#### Logical Operators
```
&&  (logical AND)
||  (logical OR)
!   (logical NOT)
```

#### Bitwise Operators
```
&   (bitwise AND)
|   (bitwise OR)
^   (bitwise XOR)
~   (bitwise NOT)
<<  (left shift)
>>  (right shift)
```

#### Assignment Operators
```
=   (assignment)
+=  (add and assign)
-=  (subtract and assign)
*=  (multiply and assign)
/=  (divide and assign)
%=  (modulo and assign)
**= (power and assign)
&=  (bitwise AND and assign)
|=  (bitwise OR and assign)
^=  (bitwise XOR and assign)
<<= (left shift and assign)
```

#### Increment/Decrement
```
++  (increment)
--  (decrement)
```

#### Special Operators
```
|>  (pipeline)
->  (arrow/function type)
=>  (fat arrow/lambda)
..  (range, exclusive)
..= (range, inclusive)
... (spread/rest)
??  (null coalesce)
?   (optional/try)
?.  (safe navigation)
<-  (actor send/left arrow)
<?  (actor query)
@   (attribute/decorator)
```

### 2.9 Delimiters and Punctuation

```
(   )   (parentheses)
[   ]   (brackets)
{   }   (braces)
,       (comma)
.       (dot)
:       (colon)
::      (double colon/path separator)
;       (semicolon)
_       (underscore/wildcard)
#       (hash/attribute marker)
```

### 2.10 Lifetimes

```
'a, 'b, 'static, etc.
```

Lifetimes start with a single quote followed by an identifier.

---

## 3. Type System

### 3.1 Primitive Types

#### Integer Types
- **Signed**: `i8`, `i16`, `i32`, `i64`, `i128`, `isize`
- **Unsigned**: `u8`, `u16`, `u32`, `u64`, `u128`, `usize`

#### Floating Point Types
- `f32` - 32-bit floating point
- `f64` - 64-bit floating point (default)

#### Other Primitives
- `bool` - Boolean type
- `char` - Unicode character
- `()` - Unit type (empty tuple)

### 3.2 Compound Types

#### Tuples

```ruchy
let point: (i32, i32) = (10, 20)
let mixed: (string, i32, bool) = ("hello", 42, true)
```

#### Arrays

```ruchy
let arr: [i32; 5] = [1, 2, 3, 4, 5]
```

#### Lists (Dynamic Arrays)

```ruchy
let list: List<i32> = [1, 2, 3]
```

#### Sets

```ruchy
let set: Set<string> = {"apple", "banana", "orange"}
```

### 3.3 Type Annotations

```ruchy
// Variable type annotation
let x: i32 = 42

// Function parameter and return type
fun add(a: i32, b: i32) -> i32 {
    a + b
}
```

### 3.4 Generic Types

```ruchy
// Generic struct
struct Container<T> {
    value: T
}

// Generic function
fun identity<T>(x: T) -> T {
    x
}

// Multiple type parameters
struct Pair<A, B> {
    first: A,
    second: B
}
```

### 3.5 Optional Types

```ruchy
// Optional type syntax
let maybe_value: Option<i32> = Some(42)
let no_value: Option<i32> = None

// Shorthand syntax
let x: i32? = Some(42)
```

### 3.6 Result Types

```ruchy
// Result type for error handling
fun divide(a: i32, b: i32) -> Result<i32, string> {
    if b == 0 {
        Err("Division by zero")
    } else {
        Ok(a / b)
    }
}
```

### 3.7 Reference Types

```ruchy
// Immutable reference
let x: &i32 = &value

// Mutable reference
let x: &mut i32 = &mut value

// Reference with lifetime
let x: &'a i32 = &value
```

### 3.8 Function Types

```ruchy
// Function type syntax
let f: (i32, i32) -> i32 = add

// Higher-order function
fun apply(f: (i32) -> i32, x: i32) -> i32 {
    f(x)
}
```

### 3.9 DataFrame Types

```ruchy
// DataFrame with typed columns
let df: DataFrame<{
    name: string,
    age: i32,
    salary: f64
}>

// Series (single column)
let series: Series<i32>
```

### 3.10 Type Aliases

```ruchy
type UserId = i64
type Point = (f64, f64)
type Result<T> = Result<T, string>
```

### 3.11 Type Inference

Ruchy features strong type inference:

```ruchy
// Type inferred as i32
let x = 42

// Type inferred from context
let numbers = [1, 2, 3, 4, 5]

// Type inferred from function return
fun double(x) { x * 2 }
```

---

## 4. Expressions

### 4.1 Literal Expressions

```ruchy
42              // Integer literal
3.14            // Float literal
"Hello"         // String literal
true            // Boolean literal
()              // Unit literal
```

### 4.2 Identifier Expressions

```ruchy
x               // Simple identifier
std::println    // Qualified identifier
```

### 4.3 Binary Expressions

```ruchy
a + b           // Addition
x * y           // Multiplication
a == b          // Equality
x && y          // Logical AND
```

### 4.4 Unary Expressions

```ruchy
-x              // Negation
!flag           // Logical NOT
~bits           // Bitwise NOT
&value          // Reference
*ptr            // Dereference
```

### 4.5 Function Call Expressions

```ruchy
println("Hello")
add(3, 4)
object.method(arg1, arg2)
```

### 4.6 Method Call Expressions

```ruchy
"hello".len()
[1, 2, 3].map(|x| x * 2)
value.unwrap()
```

### 4.7 Field Access Expressions

```ruchy
point.x
person.name
config.settings.timeout
```

### 4.8 Safe Navigation

```ruchy
optional?.field
maybe_object?.method()
```

### 4.9 Index Access Expressions

```ruchy
array[0]
list[i]
map["key"]
```

### 4.10 Slice Expressions

```ruchy
array[1..5]     // Exclusive range
array[..3]      // From start
array[2..]      // To end
array[..]       // Full slice
```

### 4.11 Range Expressions

```ruchy
1..10           // Exclusive range (1 to 9)
1..=10          // Inclusive range (1 to 10)
```

### 4.12 Tuple Expressions

```ruchy
(1, 2)
("hello", 42, true)
```

### 4.13 List Expressions

```ruchy
[1, 2, 3, 4, 5]
["apple", "banana", "orange"]
```

### 4.14 Set Expressions

```ruchy
{1, 2, 3}
{"apple", "banana", "orange"}
```

### 4.15 Struct Literal Expressions

```ruchy
Point { x: 10, y: 20 }
Person { name: "Alice", age: 30 }

// With struct update syntax
let p2 = Point { x: 5, ..p1 }
```

### 4.16 Object Literal Expressions

```ruchy
{
    key1: value1,
    key2: value2,
    ...spread_object
}
```

### 4.17 Lambda Expressions

```ruchy
|x| x * 2
|a, b| a + b
|x| {
    let y = x * 2
    y + 1
}
```

### 4.18 Async Lambda

```ruchy
async |x| {
    let result = await fetch(x)
    result
}
```

### 4.19 Block Expressions

```ruchy
{
    let x = 10
    let y = 20
    x + y
}
```

### 4.20 If Expressions

```ruchy
if condition {
    expr1
} else {
    expr2
}

// If-let expression
if let Some(value) = optional {
    value
} else {
    default
}
```

### 4.21 Match Expressions

```ruchy
match value {
    0 => "zero",
    1 => "one",
    n if n > 1 => "many",
    _ => "negative"
}
```

### 4.22 Loop Expressions

```ruchy
// Infinite loop
loop {
    // ...
    break
}

// While loop
while condition {
    // ...
}

// While-let loop
while let Some(value) = iter.next() {
    // ...
}

// For loop
for item in collection {
    // ...
}

// Labeled loops
'outer: for x in 0..10 {
    'inner: for y in 0..10 {
        if x * y > 50 {
            break 'outer
        }
    }
}
```

### 4.23 Try Expression

```ruchy
try {
    risky_operation()
} catch IOError(msg) {
    println("IO error: {msg}")
} catch e {
    println("Error: {e}")
} finally {
    cleanup()
}
```

### 4.24 Throw Expression

```ruchy
throw "Error message"
throw CustomError { code: 404 }
```

### 4.25 Async/Await Expressions

```ruchy
async {
    let result = await fetch_data()
    result
}

await async_function()
```

### 4.26 Spawn Expression

```ruchy
spawn MyActor { state: 0 }
```

### 4.27 Pipeline Expression

```ruchy
[1, 2, 3, 4, 5]
    |> map(|x| x * 2)
    |> filter(|x| x > 5)
    |> sum()
```

### 4.28 String Interpolation

```ruchy
f"Hello, {name}!"
f"The value is {x:.2}"  // With format specifier
```

### 4.29 List Comprehension

```ruchy
[x * 2 for x in numbers if x > 0]
[x + y for x in xs for y in ys]
```

### 4.30 Set Comprehension

```ruchy
{x * 2 for x in numbers if x > 0}
```

### 4.31 Dictionary Comprehension

```ruchy
{k: v * 2 for k, v in dict if v > 0}
```

### 4.32 Ternary Expression

```ruchy
condition ? true_expr : false_expr
```

### 4.33 Null Coalesce

```ruchy
optional ?? default_value
```

### 4.34 Type Cast Expression

```ruchy
value as i32
value as string
```

### 4.35 Spread Expression

```ruchy
[1, 2, ...rest]
{ ...defaults, key: value }
```

---

## 5. Statements and Declarations

### 5.1 Let Bindings

```ruchy
// Immutable binding
let x = 42
let name = "Alice"

// With type annotation
let count: i32 = 10

// Mutable binding
let mut counter = 0

// Pattern destructuring
let (a, b) = (1, 2)
let [first, ...rest] = list
let Point { x, y } = point
```

### 5.2 Variable Declaration

```ruchy
// Alternative syntax
var x = 42      // Mutable by default
var y: i32 = 10
```

### 5.3 Assignment

```ruchy
x = 42
point.x = 10
array[0] = value
```

### 5.4 Compound Assignment

```ruchy
x += 10
count *= 2
value %= 7
```

### 5.5 Increment/Decrement

```ruchy
++counter       // Pre-increment
counter++       // Post-increment
--counter       // Pre-decrement
counter--       // Post-decrement
```

### 5.6 Expression Statements

Any expression can be used as a statement:

```ruchy
println("Hello")
calculate_result()
x + y
```

---

## 6. Functions

### 6.1 Function Definition

```ruchy
// Basic function
fun add(a: i32, b: i32) -> i32 {
    a + b
}

// Without return type (inferred)
fun greet(name: string) {
    println(f"Hello, {name}!")
}

// Generic function
fun identity<T>(x: T) -> T {
    x
}

// Multiple type parameters
fun pair<A, B>(first: A, second: B) -> (A, B) {
    (first, second)
}
```

### 6.2 Function Parameters

```ruchy
// Simple parameters
fun add(a: i32, b: i32) -> i32

// Pattern parameters
fun process((x, y): (i32, i32)) -> i32

// Default parameters
fun greet(name: string = "World") {
    println(f"Hello, {name}!")
}

// Mutable parameters
fun increment(mut value: i32) -> i32 {
    value += 1
    value
}
```

### 6.3 Return Values

```ruchy
// Explicit return
fun max(a: i32, b: i32) -> i32 {
    if a > b {
        return a
    }
    return b
}

// Implicit return (last expression)
fun min(a: i32, b: i32) -> i32 {
    if a < b { a } else { b }
}

// Early return
fun find(list: List<i32>, target: i32) -> Option<i32> {
    for item in list {
        if item == target {
            return Some(item)
        }
    }
    None
}
```

### 6.4 Async Functions

```ruchy
async fun fetch_data(url: string) -> Result<string, Error> {
    let response = await http::get(url)
    Ok(response.text())
}
```

### 6.5 Public Functions

```ruchy
pub fun public_api() {
    // Visible to other modules
}

fun private_helper() {
    // Private to this module
}
```

### 6.6 Lambda Functions

```ruchy
let add = |a, b| a + b
let double = |x| x * 2
let complex = |x| {
    let y = x * 2
    let z = y + 1
    z
}
```

### 6.7 Higher-Order Functions

```ruchy
fun apply_twice(f: (i32) -> i32, x: i32) -> i32 {
    f(f(x))
}

fun compose<A, B, C>(f: (B) -> C, g: (A) -> B) -> (A) -> C {
    |x| f(g(x))
}
```

---

## 7. Structs and Classes

### 7.1 Struct Definition

```ruchy
// Basic struct
struct Point {
    x: f64,
    y: f64
}

// Generic struct
struct Container<T> {
    value: T
}

// Struct with visibility
struct Person {
    pub name: string,
    age: i32
}

// Tuple struct
struct Color(u8, u8, u8)
```

### 7.2 Struct Instantiation

```ruchy
let point = Point { x: 10.0, y: 20.0 }
let color = Color(255, 0, 0)

// With struct update
let point2 = Point { x: 5.0, ..point }

// Shorthand field initialization
let x = 10.0
let y = 20.0
let point = Point { x, y }
```

### 7.3 Implementation Blocks

```ruchy
impl Point {
    // Associated function (constructor-like)
    fun new(x: f64, y: f64) -> Point {
        Point { x, y }
    }

    // Method with immutable self
    fun distance_from_origin(self) -> f64 {
        sqrt(self.x * self.x + self.y * self.y)
    }

    // Method with mutable self
    fun translate(mut self, dx: f64, dy: f64) {
        self.x += dx
        self.y += dy
    }
}

// Generic impl
impl<T> Container<T> {
    fun new(value: T) -> Container<T> {
        Container { value }
    }

    fun get(self) -> T {
        self.value
    }
}
```

### 7.4 Class Definition (OOP Style)

```ruchy
class BankAccount {
    name: string,
    balance: f64

    // Constructor
    new(name: string, initial: f64) {
        BankAccount { name, balance: initial }
    }

    // Methods
    fun deposit(mut self, amount: f64) {
        self.balance += amount
    }

    fun get_balance(self) -> f64 {
        self.balance
    }

    // Properties
    property balance: f64 {
        get => self.balance,
        set(value) => {
            if value >= 0 {
                self.balance = value
            }
        }
    }

    // Constants
    const MIN_BALANCE: f64 = 0.0

    // Static methods
    static fun create_default() -> BankAccount {
        BankAccount::new("Default", 0.0)
    }
}

// Class with inheritance
class SavingsAccount extends BankAccount {
    interest_rate: f64

    new(name: string, initial: f64, rate: f64) {
        super(name, initial)
        self.interest_rate = rate
    }

    override fun deposit(mut self, amount: f64) {
        super.deposit(amount)
        self.balance += amount * self.interest_rate
    }
}
```

### 7.5 Visibility Modifiers

```ruchy
struct Example {
    pub public_field: i32,          // Public
    private_field: i32,             // Private (default)
    protected protected_field: i32  // Protected
}
```

### 7.6 Derives

```ruchy
#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: i32,
    y: i32
}
```

### 7.7 Decorators

```ruchy
@Serializable
@Table("users")
class User {
    @PrimaryKey
    id: i64,

    @Column("user_name")
    name: string
}
```

---

## 8. Enums and Pattern Matching

### 8.1 Enum Definition

```ruchy
// Simple enum
enum Color {
    Red,
    Green,
    Blue
}

// Enum with data
enum Option<T> {
    Some(T),
    None
}

// Enum with struct variants
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Triangle { base: f64, height: f64 }
}

// Enum with discriminants (for TypeScript/JS compat)
enum StatusCode {
    Ok = 200,
    NotFound = 404,
    ServerError = 500
}
```

### 8.2 Pattern Matching

```ruchy
// Basic match
match value {
    0 => "zero",
    1 => "one",
    2 => "two",
    _ => "many"
}

// Enum pattern matching
match color {
    Color::Red => "red",
    Color::Green => "green",
    Color::Blue => "blue"
}

// Destructuring enum variants
match shape {
    Shape::Circle { radius } =>
        f"Circle with radius {radius}",
    Shape::Rectangle { width, height } =>
        f"Rectangle {width}x{height}",
    Shape::Triangle { base, height } =>
        f"Triangle {base}x{height}"
}

// Pattern matching with guards
match value {
    n if n < 0 => "negative",
    0 => "zero",
    n if n > 0 => "positive"
}

// Multiple patterns (OR patterns)
match value {
    1 | 2 | 3 => "small",
    4 | 5 | 6 => "medium",
    _ => "large"
}

// Range patterns
match value {
    0..=10 => "small",
    11..=100 => "medium",
    _ => "large"
}

// Tuple patterns
match pair {
    (0, 0) => "origin",
    (x, 0) => f"on x-axis at {x}",
    (0, y) => f"on y-axis at {y}",
    (x, y) => f"at ({x}, {y})"
}

// List patterns
match list {
    [] => "empty",
    [x] => f"single element: {x}",
    [first, ...rest] => f"first: {first}, rest: {rest}",
    _ => "other"
}

// Struct patterns
match point {
    Point { x: 0, y: 0 } => "origin",
    Point { x, y } => f"point at ({x}, {y})",
    Point { x, .. } => f"x coordinate: {x}"
}

// At-binding (@)
match value {
    n @ 1..=10 => f"small number: {n}",
    n => f"other: {n}"
}

// Mutable patterns
match point {
    Point { mut x, y } => {
        x += 10
        Point { x, y }
    }
}
```

### 8.3 If-Let Expressions

```ruchy
if let Some(value) = optional {
    println(f"Got value: {value}")
}

if let Ok(result) = computation() {
    println(f"Success: {result}")
} else {
    println("Failed")
}
```

### 8.4 While-Let Loops

```ruchy
while let Some(item) = iterator.next() {
    println(item)
}
```

### 8.5 Pattern Matching in Let Bindings

```ruchy
let (x, y) = point
let [first, second, ...rest] = list
let Point { x, y } = coordinates
let Some(value) = optional else {
    return Err("No value")
}
```

---

## 9. Traits and Implementations

### 9.1 Trait Definition

```ruchy
trait Drawable {
    fun draw(self)
}

trait Summary {
    fun summarize(self) -> string

    // Default implementation
    fun summarize_author(self) -> string {
        f"(Read more from {self.author()}...)"
    }
}

// Generic trait
trait Container<T> {
    fun add(mut self, item: T)
    fun get(self, index: usize) -> Option<T>
}
```

### 9.2 Trait Implementation

```ruchy
impl Drawable for Point {
    fun draw(self) {
        println(f"Drawing point at ({self.x}, {self.y})")
    }
}

// Generic trait implementation
impl<T> Container<T> for Vec<T> {
    fun add(mut self, item: T) {
        self.push(item)
    }

    fun get(self, index: usize) -> Option<T> {
        self.get(index)
    }
}
```

### 9.3 Type Bounds

```ruchy
// Function with trait bound
fun print_all<T: Display>(items: List<T>) {
    for item in items {
        println(item)
    }
}

// Multiple trait bounds
fun complex<T: Display + Clone>(value: T) {
    // ...
}

// Where clause
fun complex<T, U>(a: T, b: U)
    where T: Display + Clone,
          U: Debug
{
    // ...
}
```

### 9.4 Associated Types

```ruchy
trait Iterator {
    type Item

    fun next(mut self) -> Option<Self::Item>
}

impl Iterator for Counter {
    type Item = i32

    fun next(mut self) -> Option<i32> {
        // ...
    }
}
```

### 9.5 Extension Methods

```ruchy
extend List<i32> {
    fun sum(self) -> i32 {
        let mut total = 0
        for item in self {
            total += item
        }
        total
    }
}
```

### 9.6 Mixins

```ruchy
mixin TimestampMixin {
    created_at: DateTime,
    updated_at: DateTime

    fun update_timestamp(mut self) {
        self.updated_at = DateTime::now()
    }
}

class Article with TimestampMixin {
    title: string,
    content: string
}
```

---

## 10. Modules and Imports

### 10.1 Module Definition

```ruchy
mod math {
    pub fun add(a: i32, b: i32) -> i32 {
        a + b
    }

    fun internal_helper() {
        // Private to this module
    }
}
```

### 10.2 Import Statements

```ruchy
// Import specific items
import std::collections::HashMap
import std::io::{read, write}

// Import with alias
import std::collections::HashMap as Map

// Import all
import std::math::*

// Import from URL
import "https://example.com/module.ruchy"
```

### 10.3 Use Statements (Rust-style)

```ruchy
use std::collections::HashMap
use std::io::{Read, Write}
use std::collections::HashMap as Map
```

### 10.4 Module Paths

```ruchy
std::println          // Absolute path from std
self::helper          // Relative to current module
super::parent_fn      // Parent module
crate::root_fn        // Crate root
```

### 10.5 Export Statements

```ruchy
// Export specific items
export { add, subtract }

// Export all
export *

// Export default
export default fun main() {
    // ...
}

// Re-export
export { HashMap } from std::collections
```

---

## 11. Error Handling

### 11.1 Result Type

```ruchy
enum Result<T, E> {
    Ok(T),
    Err(E)
}

fun divide(a: i32, b: i32) -> Result<i32, string> {
    if b == 0 {
        Err("Division by zero")
    } else {
        Ok(a / b)
    }
}
```

### 11.2 Option Type

```ruchy
enum Option<T> {
    Some(T),
    None
}

fun find(list: List<i32>, target: i32) -> Option<i32> {
    for (i, item) in list.enumerate() {
        if item == target {
            return Some(i)
        }
    }
    None
}
```

### 11.3 Try-Catch

```ruchy
try {
    let result = risky_operation()
    println(result)
} catch IOError(msg) {
    println(f"IO error: {msg}")
} catch NetworkError { code, message } {
    println(f"Network error {code}: {message}")
} catch e {
    println(f"Unexpected error: {e}")
} finally {
    cleanup()
}
```

### 11.4 Throw Expression

```ruchy
fun validate(age: i32) {
    if age < 0 {
        throw "Age cannot be negative"
    }
    if age > 150 {
        throw ValidationError { field: "age", message: "Too old" }
    }
}
```

### 11.5 Try Operator (?)

```ruchy
fun process() -> Result<i32, Error> {
    let x = operation1()?  // Propagates error
    let y = operation2()?
    Ok(x + y)
}

// With Option
fun get_value() -> Option<i32> {
    let obj = find_object()?
    let value = obj.get_value()?
    Some(value * 2)
}
```

### 11.6 Custom Error Types

```ruchy
error ValidationError {
    field: string,
    message: string
} extends Error

error NetworkError {
    code: i32,
    url: string,
    message: string
} extends Error
```

### 11.7 Result Unwrapping

```ruchy
// Unwrap (panics on error)
let value = result.unwrap()

// Unwrap with message
let value = result.expect("Failed to get value")

// Unwrap or default
let value = result.unwrap_or(0)

// Unwrap or else
let value = result.unwrap_or_else(|e| {
    println(f"Error: {e}")
    0
})
```

---

## 12. Async and Concurrency

### 12.1 Async Functions

```ruchy
async fun fetch_data(url: string) -> Result<string, Error> {
    let response = await http::get(url)
    let text = await response.text()
    Ok(text)
}
```

### 12.2 Await Expression

```ruchy
let result = await async_function()

// In async block
let value = async {
    let data = await fetch_data("https://api.example.com")
    await process(data)
}
```

### 12.3 Async Blocks

```ruchy
let future = async {
    let x = await operation1()
    let y = await operation2()
    x + y
}

let result = await future
```

### 12.4 Async Lambda

```ruchy
let fetch = async |url| {
    let response = await http::get(url)
    response.text()
}

let result = await fetch("https://example.com")
```

### 12.5 Parallel Execution

```ruchy
// Spawn multiple tasks
let task1 = spawn(async { operation1() })
let task2 = spawn(async { operation2() })

// Wait for all
let results = await all([task1, task2])
```

---

## 13. Actors

### 13.1 Actor Definition

```ruchy
actor Counter {
    state {
        count: i32
    }

    receive Increment {
        self.count += 1
    }

    receive Decrement {
        self.count -= 1
    }

    receive GetCount => i32 {
        self.count
    }
}
```

### 13.2 Spawning Actors

```ruchy
let counter = spawn Counter { count: 0 }
```

### 13.3 Sending Messages (Fire-and-Forget)

```ruchy
// Using send keyword
send counter Increment

// Using <- operator
counter <- Increment

// Using ! operator
counter ! Increment
```

### 13.4 Asking Actors (Request-Reply)

```ruchy
// Using ask keyword
let count = ask counter GetCount

// Using <? operator
let count = counter <? GetCount

// With timeout
let count = ask counter GetCount timeout 5s
```

### 13.5 Actor Supervision

```ruchy
actor Supervisor {
    state {
        children: Vec<ActorRef>
    }

    receive SpawnChild {
        let child = spawn Worker { id: self.children.len() }
        self.children.push(child)
    }

    receive ChildFailed(child_id) {
        // Restart strategy
        let child = spawn Worker { id: child_id }
        self.children[child_id] = child
    }
}
```

---

## 14. DataFrames

### 14.1 DataFrame Creation

```ruchy
// Literal syntax
let df = df {
    name: ["Alice", "Bob", "Charlie"],
    age: [25, 30, 35],
    salary: [50000.0, 60000.0, 70000.0]
}

// From CSV
let df = DataFrame::read_csv("data.csv")

// From JSON
let df = DataFrame::read_json("data.json")
```

### 14.2 DataFrame Operations

```ruchy
// Filter
let adults = df.filter(|row| row.age >= 18)

// Select columns
let names = df.select(["name", "age"])

// Sort
let sorted = df.sort(["age"])

// Group by
let by_dept = df.group_by(["department"])

// Aggregate
let stats = df.aggregate([
    Sum("salary"),
    Mean("age"),
    Count("*")
])

// Join
let combined = df1.join(df2, on: ["id"], how: Inner)
```

### 14.3 Pipeline Operations

```ruchy
let result = df
    |> filter(|row| row.age > 25)
    |> select(["name", "salary"])
    |> sort(["salary"], desc: true)
    |> limit(10)
```

### 14.4 DataFrame Methods

```ruchy
df.head(10)           // First 10 rows
df.tail(5)            // Last 5 rows
df.shape()            // (rows, columns)
df.columns()          // Column names
df.dtypes()           // Column data types
df.describe()         // Summary statistics
```

---

## 15. Standard Library

### 15.1 Core Modules

#### std::io
- `println` - Print with newline
- `print` - Print without newline
- `read_line` - Read line from stdin
- `read_file` - Read file contents
- `write_file` - Write to file

#### std::collections
- `List` - Dynamic array
- `Map` - Hash map
- `Set` - Hash set
- `Queue` - Queue data structure
- `Stack` - Stack data structure

#### std::string
- `len` - String length
- `split` - Split string
- `trim` - Remove whitespace
- `to_upper` - Convert to uppercase
- `to_lower` - Convert to lowercase
- `contains` - Check substring
- `replace` - Replace substring

#### std::math
- `abs` - Absolute value
- `sqrt` - Square root
- `pow` - Power
- `sin`, `cos`, `tan` - Trigonometric functions
- `floor`, `ceil`, `round` - Rounding
- `min`, `max` - Min/max values

#### std::fs
- `read_file` - Read file
- `write_file` - Write file
- `exists` - Check file exists
- `remove` - Delete file
- `copy` - Copy file
- `rename` - Rename file

#### std::path
- `join` - Join paths
- `extension` - Get file extension
- `parent` - Get parent directory
- `is_absolute` - Check if absolute
- `normalize` - Normalize path

#### std::env
- `var` - Get environment variable
- `set_var` - Set environment variable
- `current_dir` - Current directory
- `args` - Command line arguments

#### std::http
- `get` - HTTP GET request
- `post` - HTTP POST request
- `put` - HTTP PUT request
- `delete` - HTTP DELETE request

#### std::json
- `parse` - Parse JSON
- `stringify` - Convert to JSON
- `from_file` - Read JSON file
- `to_file` - Write JSON file

#### std::time
- `now` - Current timestamp
- `sleep` - Sleep for duration
- `DateTime` - Date and time type
- `Duration` - Time duration

#### std::regex
- `Regex::new` - Create regex
- `match` - Test match
- `find` - Find matches
- `replace` - Replace with regex

### 15.2 DataFrame Module

#### std::dataframe
- `DataFrame` - DataFrame type
- `Series` - Series (column) type
- `read_csv` - Read CSV file
- `read_json` - Read JSON file
- `read_excel` - Read Excel file

### 15.3 Process Module

#### std::process
- `Command` - Run external command
- `spawn` - Spawn child process
- `exit` - Exit process

---

## 16. Grammar Reference

### 16.1 Program Structure

```
Program ::= Item*

Item ::= Function
       | Struct
       | Enum
       | Trait
       | Impl
       | Class
       | Actor
       | TypeAlias
       | Import
       | Export
       | Module
```

### 16.2 Expressions

```
Expr ::= Literal
       | Identifier
       | QualifiedName
       | BinaryExpr
       | UnaryExpr
       | CallExpr
       | MethodCallExpr
       | FieldAccessExpr
       | IndexAccessExpr
       | SliceExpr
       | LambdaExpr
       | IfExpr
       | MatchExpr
       | LoopExpr
       | BlockExpr
       | TupleExpr
       | ListExpr
       | StructLiteralExpr
       | TryCatchExpr
       | AsyncExpr
       | AwaitExpr
       | PipelineExpr
       | RangeExpr
       | StringInterpolation
```

### 16.3 Patterns

```
Pattern ::= Wildcard
          | Literal
          | Identifier
          | TuplePattern
          | ListPattern
          | StructPattern
          | RangePattern
          | OrPattern
          | RestPattern
          | AtBindingPattern
```

### 16.4 Types

```
Type ::= Named
       | Generic
       | Tuple
       | List
       | Optional
       | Function
       | Reference
```

### 16.5 Operator Precedence (Highest to Lowest)

1. Field access (`.`), method calls, indexing
2. Unary operators (`!`, `-`, `~`, `&`, `*`)
3. Power (`**`)
4. Multiplication, division, modulo (`*`, `/`, `%`)
5. Addition, subtraction (`+`, `-`)
6. Bitwise shifts (`<<`, `>>`)
7. Bitwise AND (`&`)
8. Bitwise XOR (`^`)
9. Bitwise OR (`|`)
10. Comparison (`<`, `<=`, `>`, `>=`, `==`, `!=`)
11. Logical AND (`&&`)
12. Logical OR (`||`)
13. Null coalesce (`??`)
14. Range (`..`, `..=`)
15. Assignment (`=`, `+=`, `-=`, etc.)
16. Pipeline (`|>`)

---

## Appendix A: Reserved Words

Complete list of reserved keywords:

```
abstract, actor, as, ask, async, await, break, catch, class,
command, const, continue, crate, default, df, else, enum,
err, export, extend, extends, false, final, finally, fn, for,
from, fun, if, impl, implements, import, in, interface, let,
loop, match, mixin, mod, module, mut, none, null, ok, operator,
option, override, private, property, protected, pub, receive,
result, return, sealed, self, send, some, spawn, state, static,
struct, super, throw, trait, true, try, type, unsafe, use,
var, where, while, with
```

---

## Appendix B: Escape Sequences

String and character escape sequences:

```
\n      - Newline (U+000A)
\r      - Carriage return (U+000D)
\t      - Tab (U+0009)
\\      - Backslash
\"      - Double quote
\'      - Single quote
\0      - Null character (U+0000)
\u{XXXX} - Unicode character (hex code point)
```

---

## Appendix C: Format Specifiers

Format specifiers for string interpolation:

```
{}          - Default formatting
{:.2}       - Float with 2 decimal places
{:04}       - Integer with leading zeros (width 4)
{:b}        - Binary
{:o}        - Octal
{:x}        - Lowercase hex
{:X}        - Uppercase hex
```

---

## Appendix D: File Extensions

- `.ruchy` - Ruchy source files
- `.ry` - Alternative extension (not standard)

---

## Revision History

- **2025-10-13**: Initial specification based on compiler source analysis
