# Macros and Metaprogramming

<!-- DOC_STATUS_START -->
**Chapter Status**: ❌ 0% Working (0/9 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 0 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 9 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-22*  
*Ruchy version: ruchy 0.11.0*
<!-- DOC_STATUS_END -->


*"The day I wrote my first macro, I realized I wasn't just writing code anymore - I was writing code that writes code. It's like teaching the compiler new tricks. Use macros wisely, and you can eliminate entire categories of boilerplate. Use them poorly, and you'll create a maintenance nightmare. The power is intoxicating; the responsibility is real."* - Noah Gift

## The Problem

You're writing the same patterns over and over. How do you teach the compiler new syntax? How do you generate code at compile time? How do you build domain-specific languages within your programs?

Most languages limit you to their built-in syntax. In Ruchy, macros let you extend the language itself, creating new abstractions that feel native. Write less, express more, maintain easily.

## Quick Example

Here's the magic of macros:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '(' or '[' after macro name
// Define a macro for JSON-like syntax
macro! json {
    // Match JSON-like input
    ({ $($key:ident : $value:expr),* }) => {
        {
            let mut map = HashMap::new()
            $(
                map.insert(stringify!($key), json!($value))
            )*
            Value::Object(map)
        }
    }
    ([ $($element:expr),* ]) => {
        Value::Array(vec![$(json!($element)),*])
    }
    ($other:expr) => {
        Value::from($other)
    }
}

// Use it like native syntax!
let user = json!({
    name: "Alice",
    age: 30,
    emails: ["alice@example.com", "alice@work.com"],
    active: true,
    metadata: {
        created: "2024-01-01",
        tags: ["premium", "verified"]
    }
})

// Macro for automatic implementation
#[derive(Debug, Clone, Serialize)]
struct User {
    name: String
    email: String
    age: i32
}

// The derive macro generates all the boilerplate!




```

That's code writing code!

## Core Concepts

### Declarative Macros

Pattern-based code generation:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '(' or '[' after macro name
// Simple macro
macro! say_hello {
    () => {
        println("Hello, World!")
    }
    ($name:expr) => {
        println(f"Hello, {$name}!")
    }
}

say_hello!()           // Prints: Hello, World!
say_hello!("Alice")    // Prints: Hello, Alice!

// Macro with repetition
macro! vec_of_strings {
    ($($x:expr),*) => {
        vec![$(String::from($x)),*]
    }
}

let strings = vec_of_strings!["one", "two", "three"]

// Recursive macro
macro! count {
    () => { 0 }
    ($head:expr) => { 1 }
    ($head:expr, $($tail:expr),*) => {
        1 + count!($($tail),*)
    }
}

let n = count!(a, b, c, d)  // 4

// Macro generating match arms
macro! handle_codes {
    ($($code:expr => $message:expr),*) => {
        match status_code {
            $($code => println($message)),*
            _ => println("Unknown status")
        }
    }
}

handle_codes! {
    200 => "OK",
    404 => "Not Found",
    500 => "Internal Error"
}




```

### Procedural Macros

Function-like macros with full power:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '(' or '[' after macro name
// Derive macro for automatic implementation
#[proc_macro_derive(Builder)]
fn derive_builder(input: TokenStream) -> TokenStream {
    let ast = parse(input)
    let name = ast.name
    let builder_name = f"{name}Builder"
    
    let fields = ast.fields.map(|f| {
        let name = f.name
        let ty = f.ty
        quote! {
            fn $name(mut self, value: $ty) -> Self {
                self.$name = Some(value)
                self
            }
        }
    })
    
    quote! {
        struct $builder_name {
            $($fields.name: Option<$fields.ty>),*
        }
        
        impl $builder_name {
            fn new() -> Self {
                Self {
                    $($fields.name: None),*
                }
            }
            
            $fields
            
            fn build(self) -> Result<$name, String> {
                Ok($name {
                    $($fields.name: self.$fields.name
                        .ok_or("Missing field: " + stringify!($fields.name))?,)*
                })
            }
        }
        
        impl $name {
            fn builder() -> $builder_name {
                $builder_name::new()
            }
        }
    }
}

// Use the derive macro
#[derive(Builder)]
struct Config {
    host: String
    port: u16
    workers: usize
}

// Generated builder pattern!
let config = Config::builder()
    .host("localhost")
    .port(8080)
    .workers(4)
    .build()?




```

### Attribute Macros

Modify items with attributes:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '(' or '[' after macro name
// Attribute macro for benchmarking
#[proc_macro_attribute]
fn bench(args: TokenStream, input: TokenStream) -> TokenStream {
    let func = parse(input)
    let name = func.name
    
    quote! {
        fn $name() {
            let start = Instant::now()
            let result = { $func.body }
            let duration = start.elapsed()
            println(stringify!($name) + " took " + duration.to_s())
            result
        }
    }
}

#[bench]
fn expensive_operation() {
    // Function body
    heavy_computation()
}
// Automatically prints timing!

// Route attribute for web framework
#[route(GET, "/users/:id")]
async fn get_user(id: i32) -> Response {
    let user = fetch_user(id).await?
    Response::json(user)
}

// Test attribute with custom behavior
#[test_case(1, 2, 3)]
#[test_case(10, 20, 30)]
#[test_case(-1, -2, -3)]
fn test_addition(a: i32, b: i32, expected: i32) {
    assert_eq!(a + b, expected)
}




```

### Syntax Extensions

Create domain-specific languages:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '(' or '[' after macro name
// SQL-like macro
macro! sql {
    (SELECT $($field:ident),* FROM $table:ident WHERE $($cond:tt)*) => {
        Query::select(vec![$(stringify!($field)),*])
            .from(stringify!($table))
            .where(parse_condition!($($cond)*))
    }
}

let query = sql! {
    SELECT name, email, age 
    FROM users 
    WHERE age > 18 AND active = true
}

// HTML templating
macro! html {
    (<$tag:ident $($attr:ident = $value:expr)*> $($content:tt)* </$close:ident>) => {
        Element::new(stringify!($tag))
            $(.attr(stringify!($attr), $value))*
            .children(vec![$(html!($content)),*])
    }
    ($text:expr) => {
        Text::new($text)
    }
}

let page = html! {
    <div class="container">
        <h1>"Welcome"</h1>
        <p>"This is "<strong>"Ruchy"</strong>" macros!"</p>
    </div>
}

// Regular expression literals
macro! regex {
    ($pattern:expr) => {
        {
            static REGEX: OnceCell<Regex> = OnceCell::new()
            REGEX.get_or_init(|| {
                Regex::new($pattern).expect("Invalid regex")
            })
        }
    }
}

let email_regex = regex!(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")




```

## Practical Macros

### Debugging Macros

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '(' or '[' after macro name
// Debug print with variable names
macro! dbg {
    ($($x:expr),*) => {
        $(
            eprintln!("{} = {:?}", stringify!($x), $x)
        )*
    }
}

let x = 42
let y = "hello"
dbg!(x, y, x + 10)
// Prints:
// x = 42
// y = "hello"
// x + 10 = 52

// Trace macro for function calls
macro! trace {
    ($func:expr) => {
        {
            println("Entering " + stringify!($func))
            let result = $func
            println("Leaving " + stringify!($func) + ": " + result.to_s())
            result
        }
    }
}

let result = trace!(expensive_calculation())

// Assert with custom messages
macro! assert_eq_msg {
    ($left:expr, $right:expr, $msg:expr) => {
        if $left != $right {
            panic($msg + "\nLeft: " + $left.to_s() + "\nRight: " + $right.to_s())
        }
    }
}




```

### Code Generation Macros

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '(' or '[' after macro name
// Generate getters and setters
macro! accessors {
    ($struct_name:ident { $($field:ident : $type:ty),* }) => {
        impl $struct_name {
            $(
                fn $field(&self) -> &$type {
                    &self.$field
                }
                
                fn set_$field(&mut self, value: $type) {
                    self.$field = value
                }
            )*
        }
    }
}

struct Person {
    name: String
    age: i32
}

accessors!(Person { name: String, age: i32 })

// Now person.name() and person.set_name() exist!

// Generate enum variants and matchers
macro! define_opcodes {
    ($($name:ident = $value:expr),*) => {
        enum Opcode {
            $($name = $value),*
        }
        
        impl Opcode {
            fn from_byte(byte: u8) -> Option<Opcode> {
                match byte {
                    $($value => Some(Opcode::$name)),*
                    _ => None
                }
            }
            
            fn to_string(&self) -> &str {
                match self {
                    $(Opcode::$name => stringify!($name)),*
                }
            }
        }
    }
}

define_opcodes! {
    ADD = 0x01,
    SUB = 0x02,
    MUL = 0x03,
    DIV = 0x04,
    JMP = 0x10,
    JEQ = 0x11
}




```

### DSL Macros

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '(' or '[' after macro name
// State machine DSL
macro! state_machine {
    (
        states: [$($state:ident),*]
        transitions: [
            $($from:ident -> $to:ident on $event:ident),*
        ]
        initial: $initial:ident
    ) => {
        enum State {
            $($state),*
        }
        
        enum Event {
            $($event),*
        }
        
        struct StateMachine {
            state: State
        }
        
        impl StateMachine {
            fn new() -> Self {
                Self { state: State::$initial }
            }
            
            fn transition(&mut self, event: Event) {
                self.state = match (&self.state, event) {
                    $(
                        (State::$from, Event::$event) => State::$to,
                    )*
                    _ => panic("Invalid transition")
                }
            }
        }
    }
}

state_machine! {
    states: [Idle, Running, Paused, Stopped]
    transitions: [
        Idle -> Running on Start,
        Running -> Paused on Pause,
        Paused -> Running on Resume,
        Running -> Stopped on Stop,
        Paused -> Stopped on Stop
    ]
    initial: Idle
}

// Configuration DSL
macro! config {
    {
        $($section:ident {
            $($key:ident : $value:expr),*
        })*
    } => {
        {
            let mut config = Config::new()
            $(
                let mut section = ConfigSection::new(stringify!($section))
                $(
                    section.set(stringify!($key), $value)
                )*
                config.add_section(section)
            )*
            config
        }
    }
}

let config = config! {
    server {
        host: "localhost",
        port: 8080,
        workers: 4
    }
    database {
        url: "postgres://localhost/myapp",
        pool_size: 20
    }
}




```

## Hygiene and Best Practices

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected '(' or '[' after macro name
// Hygienic macros prevent name collisions
macro! safe_swap {
    ($a:expr, $b:expr) => {
        {
            // Generated names won't conflict
            let __temp = $a
            $a = $b
            $b = __temp
        }
    }
}

// Best practices:
// 1. Keep macros simple
// 2. Provide good error messages
macro! validate {
    ($expr:expr) => {
        if !$expr {
            compile_error!(concat!(
                "Validation failed: ",
                stringify!($expr)
            ))
        }
    }
}

// 3. Document macro syntax
/// Creates a new vector with the given elements
/// 
/// # Example
/// ```
/// let v = vec![1, 2, 3]
/// ```
macro! vec {
    // Implementation
}

// 4. Use macro namespaces
mod macros {
    macro! internal_helper {
        // Not exported
    }
    
    #[macro_export]
    macro! public_macro {
        // Exported
    }
}

// 5. Test macros thoroughly
#[test]
fn test_macro() {
    let result = my_macro!(input)
    assert_eq!(result, expected)
}




```

## Try It Yourself

Experiment with macros:

```bash
$ ruchy repl
>>> # Simple macro
>>> macro! twice {
>>>     ($x:expr) => { $x * 2 }
>>> }
>>> twice!(21)
42
>>> 
>>> # Variadic macro
>>> macro! sum {
>>>     ($x:expr) => { $x }
>>>     ($x:expr, $($rest:expr),+) => {
>>>         $x + sum!($($rest),+)
>>>     }
>>> }
>>> sum!(1, 2, 3, 4, 5)
15
```

**Your Macro Challenges:**

1. **Utility Macros**:
   - Logging framework
   - Benchmarking suite
   - Error handling helpers
   - Test generators

2. **DSL Creation**:
   - Query builder
   - Configuration language
   - Routing framework
   - Command parser

3. **Code Generation**:
   - Serialization
   - ORM mappings
   - API clients
   - Protocol buffers

4. **Advanced Macros**:
   - Compile-time checks
   - Type-level programming
   - Syntax extensions
   - Custom derives

## Summary

- Macros generate code at compile time
- Declarative macros match patterns
- Procedural macros act like functions
- Attribute macros modify items
- Macros enable domain-specific languages
- Hygiene prevents name conflicts
- Use macros to eliminate boilerplate
- Test macros as thoroughly as regular code

You now command the power of metaprogramming! You've completed Level 3 - Advanced Features!