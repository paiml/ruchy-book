# Traits and Generics

<!-- DOC_STATUS_START -->
**Chapter Status**: 🚧 NOT IMPLEMENTED - Future Feature

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 0 | No support yet |
| ⚠️ Not Implemented | All | Entire feature planned |
| ❌ Broken | 0 | N/A |
| 📋 Planned | All | Target: v2.5+ |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 1.9.2*
<!-- DOC_STATUS_END -->

## ⚠️ IMPORTANT: Feature Not Yet Implemented

**Traits and generic programming is a planned feature for Ruchy v2.5+**. This chapter describes the intended design but **none of these examples currently work**.

## What You Can Do Today

Instead of waiting for this feature, you can:
- Use the working features documented in TDD chapters
- Contribute to the implementation at [github.com/paiml/ruchy](https://github.com/paiml/ruchy)
- See the [roadmap](../appendix-roadmap.md) for timeline

## Original Content (For Reference Only)

⚠️ The content below is aspirational and does not work in current Ruchy:

---



*"The moment I understood traits and generics, programming became like building with LEGO blocks - every piece fits perfectly with every other piece. It's not about writing less code; it's about writing code once that works everywhere. That's the real power of abstraction."* - Noah Gift

## The Problem

You've written similar code multiple times for different types. How do you write functions that work with any type? How do you define shared behavior across different structures? How do you build truly reusable components?

Most languages force you to choose between type safety and flexibility. In Ruchy, traits and generics give you both - write once, use everywhere, with zero runtime cost.

## Quick Example

Here's the power of traits and generics:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Define behavior with traits
trait Serializable {
    fun serialize(self) -> String
    fun deserialize(String) -> Self
}

// Generic function works with any Serializable type
fun save_to_file<T: Serializable>(item: T, path: String) {
    let serialized = item.serialize()
    write_file(path, serialized)
}

fun load_from_file<T: Serializable>(path: String) -> T {
    let content = read_file(path)
    return T::deserialize(content)
}

// Implement trait for your types
struct User {
    name: String
    email: String
    age: i32
}

impl Serializable for User {
    fun serialize(self) -> String {
        return to_json(self)
    }
    
    fun deserialize(data: String) -> User {
        return parse_json(data)
    }
}

// Now it just works!
let user = User{name: "Alice", email: "alice@example.com", age: 30}
save_to_file(user, "user.json")  // Generic function, specific type
let loaded: User = load_from_file("user.json")  // Type safe!






```

That's abstraction without compromise!

## Core Concepts

### Defining Traits

Traits define shared behavior:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Simple trait
trait Drawable {
    fun draw(self)
}

// Trait with multiple methods
trait Container {
    fun len(self) -> i32
    fun is_empty(self) -> bool {
        return self.len() == 0  // Default implementation
    }
    fun clear(mut self)
}

// Traits with associated types
trait Iterator {
    type Item
    
    fun next(mut self) -> Option<Item>
    
    fun collect(mut self) -> Vec<Item> {
        let result = Vec::new()
        while let Some(item) = self.next() {
            result.push(item)
        }
        return result
    }
}

// Traits with constraints
trait Comparable: Eq {
    fun compare(self, other: Self) -> Ordering
}

// Trait inheritance
trait Animal {
    fun speak(self)
}

trait Dog: Animal {
    fun wag_tail(self)
}






```

### Implementing Traits

Give types new capabilities:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
struct Point {
    x: f64
    y: f64
}

impl Drawable for Point {
    fun draw(self) {
        println("Point at (" + self.x.to_s() + ", " + self.y.to_s() + ")")
    }
}

struct Circle {
    center: Point
    radius: f64
}

impl Drawable for Circle {
    fun draw(self) {
        println("Circle at (" + self.center.x.to_s() + ", " + self.center.y.to_s() + ") with radius " + self.radius.to_s())
    }
}

// Now both types can be drawn
let p = Point{x: 10, y: 20}
let c = Circle{center: p, radius: 5}

p.draw()  // Trait method
c.draw()  // Same interface, different implementation

// Implement traits for existing types
impl Drawable for String {
    fun draw(self) {
        println("Text: " + self)
    }
}

"Hello".draw()  // Extension methods!






```

### Generic Functions

Write once, use with any type:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Simple generic function
fun swap<T>(a: mut T, b: mut T) {
    let temp = a
    a = b
    b = temp
}

// Multiple type parameters
fun pair<K, V>(key: K, value: V) -> (K, V) {
    return (key, value)
}

// Trait bounds
fun print_all<T: Display>(items: Vec<T>) {
    for item in items {
        println(item)  // Works because T implements Display
    }
}

// Multiple bounds
fun process<T: Clone + Debug + Send>(item: T) {
    let copy = item.clone()
    debug(copy)
    send_to_thread(item)
}

// Where clauses for complex bounds
fun complex_function<T, U>(x: T, y: U) -> Vec<T>
where
    T: Clone + From<U>,
    U: Display + Into<String>
{
    let converted: T = T::from(y)
    return vec![x.clone(), converted]
}






```

### Generic Types

Build flexible data structures:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Generic struct
struct Pair<T> {
    first: T
    second: T
}

impl<T> Pair<T> {
    fun new(first: T, second: T) -> Pair<T> {
        return Pair{first, second}
    }
    
    fun swap(mut self) {
        let temp = self.first
        self.first = self.second
        self.second = temp
    }
}

// Generic enum
enum Option<T> {
    Some(T)
    None
}

enum Result<T, E> {
    Ok(T)
    Err(E)
}

// Generic with constraints
struct SortedVec<T: Ord> {
    items: Vec<T>
}

impl<T: Ord> SortedVec<T> {
    fun insert(mut self, item: T) {
        let pos = self.items.binary_search(item)
        self.items.insert(pos, item)
    }
}






```

## Practical Applications

### Generic Collections

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Custom collection with traits
struct Cache<K: Hash + Eq, V> {
    map: HashMap<K, V>
    max_size: usize
    access_order: Vec<K>
}

impl<K: Hash + Eq + Clone, V: Clone> Cache<K, V> {
    fun new(max_size: usize) -> Cache<K, V> {
        return Cache{
            map: HashMap::new(),
            max_size,
            access_order: Vec::new()
        }
    }
    
    fun get(mut self, key: K) -> Option<V> {
        if let Some(value) = self.map.get(key) {
            // Update access order
            self.access_order.retain(|k| k != key)
            self.access_order.push(key.clone())
            return Some(value.clone())
        }
        return None
    }
    
    fun put(mut self, key: K, value: V) {
        if self.map.len() >= self.max_size && !self.map.contains_key(key) {
            // Evict least recently used
            let lru = self.access_order.remove(0)
            self.map.remove(lru)
        }
        
        self.map.insert(key.clone(), value)
        self.access_order.push(key)
    }
}

// Use with any hashable types
let cache: Cache<String, User> = Cache::new(100)
cache.put("alice", alice_user)

let cache2: Cache<i32, Vec<String>> = Cache::new(50)
cache2.put(1, vec!["data"])






```

### Trait Objects

Dynamic dispatch when needed:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Trait for plugins
trait Plugin {
    fun name(self) -> String
    fun execute(self, context: Context) -> Result<(), Error>
}

struct LogPlugin {
    level: String
}

impl Plugin for LogPlugin {
    fun name(self) -> String {
        return "Logger"
    }
    
    fun execute(self, context: Context) -> Result<(), Error> {
        log(self.level, context.message)
        return Ok(())
    }
}

// Store different plugin types
let plugins: Vec<Box<dyn Plugin>> = vec![
    Box::new(LogPlugin{level: "INFO"}),
    Box::new(MetricsPlugin{...}),
    Box::new(CachePlugin{...})
]

// Execute all plugins
for plugin in plugins {
    plugin.execute(context)?
}






```

### Builder Pattern with Generics

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Generic builder
struct Builder<T> {
    value: T
}

impl<T> Builder<T> {
    fun new(initial: T) -> Builder<T> {
        return Builder{value: initial}
    }
    
    fun with<F>(mut self, f: F) -> Builder<T>
    where F: FnOnce(mut T) -> T
    {
        self.value = f(self.value)
        return self
    }
    
    fun build(self) -> T {
        return self.value
    }
}

// Use with any type
let config = Builder::new(Config::default())
    .with(|c| { c.port = 8080; c })
    .with(|c| { c.host = "localhost"; c })
    .with(|c| { c.workers = 4; c })
    .build()

let user = Builder::new(User::new())
    .with(|u| { u.name = "Alice"; u })
    .with(|u| { u.role = Role::Admin; u })
    .build()






```

### Advanced Trait Patterns

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Associated types pattern
trait Graph {
    type Node
    type Edge
    
    fun nodes(self) -> Vec<Node>
    fun edges(self) -> Vec<Edge>
    fun neighbors(self, node: Node) -> Vec<Node>
}

struct SocialNetwork {
    users: Vec<User>
    connections: Vec<Friendship>
}

impl Graph for SocialNetwork {
    type Node = User
    type Edge = Friendship
    
    fun nodes(self) -> Vec<User> {
        return self.users
    }
    
    fun edges(self) -> Vec<Friendship> {
        return self.connections
    }
    
    fun neighbors(self, user: User) -> Vec<User> {
        self.connections
            .filter(|f| f.from == user.id || f.to == user.id)
            .map(|f| self.get_user(f.other_id(user.id)))
            .collect()
    }
}

// Phantom types for compile-time guarantees
struct Id<T> {
    value: String
    _phantom: PhantomData<T>
}

impl<T> Id<T> {
    fun new(value: String) -> Id<T> {
        return Id{value, _phantom: PhantomData}
    }
}

// Type-safe IDs
let user_id: Id<User> = Id::new("user_123")
let post_id: Id<Post> = Id::new("post_456")

// Won't compile - type safety!
// let wrong = user_id == post_id






```

## Performance Considerations

### Zero-Cost Abstractions

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Generics are monomorphized - no runtime cost
fun generic_add<T: Add>(a: T, b: T) -> T {
    return a + b  // Compiles to specific add instruction
}

// This generates two functions at compile time:
let int_result = generic_add(5, 10)      // Generates add_i32
let float_result = generic_add(5.0, 10.0) // Generates add_f64

// Trait bounds are checked at compile time
fun process<T: Send + Sync>(item: T) {
    // Can safely send to another thread
    spawn(|| {
        use_item(item)
    })
}

// Inline hints for performance
#[inline]
fun hot_path<T: Copy>(x: T) -> T {
    return x  // Will be inlined
}






```

### Static vs Dynamic Dispatch

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Static dispatch (faster)
fun static_dispatch<T: Display>(item: T) {
    println(item)  // Direct call, no indirection
}

// Dynamic dispatch (flexible)
fun dynamic_dispatch(item: Box<dyn Display>) {
    println(item)  // Virtual call through vtable
}

// Choose based on needs:
// - Static: Known types, performance critical
// - Dynamic: Plugin systems, heterogeneous collections






```

## Try It Yourself

Time to experiment with traits and generics:

```bash
$ ruchy repl
>>> # Define a trait
>>> trait Greetable {
>>>     fun greet(self) -> String
>>> }
>>> 
>>> # Implement for types
>>> impl Greetable for String {
>>>     fun greet(self) -> String {
>>>         return "Hello, " + self + "!"
>>>     }
>>> }
>>> 
>>> "World".greet()
"Hello, World!"
>>> 
>>> # Generic function
>>> fun duplicate<T: Clone>(x: T) -> (T, T) {
>>>     return (x.clone(), x.clone())
>>> }
>>> 
>>> duplicate(42)
(42, 42)
>>> duplicate("test")
("test", "test")
```

**Your Generics Challenges:**

1. **Generic Data Structures**:
   - Type-safe graph
   - Generic tree
   - Custom iterator
   - Smart pointers

2. **Trait Systems**:
   - Serialization framework
   - Plugin architecture  
   - ORM layer
   - Event system

3. **Advanced Patterns**:
   - Type state machine
   - Phantom types
   - Higher-kinded types
   - Trait objects

4. **Performance**:
   - Zero-cost abstractions
   - Specialization
   - Const generics
   - SIMD operations

## Summary

- Traits define shared behavior across types
- Generics enable code reuse without repetition
- Trait bounds ensure type safety at compile time
- Generic types build flexible data structures
- Zero-cost abstractions mean no runtime penalty
- Static dispatch for performance, dynamic for flexibility
- Traits can extend existing types with new methods
- Associated types simplify complex relationships

You now have the power of true abstraction! Next, let's master error handling.