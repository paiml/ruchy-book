# Advanced Patterns

<!-- DOC_STATUS_START -->
**Chapter Status**: ❌ 0% Working (0/12 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 0 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 12 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 1.8.3*
<!-- DOC_STATUS_END -->


*"After 20 years of programming, I've learned that patterns aren't rules to follow blindly - they're tools in your toolbox. The art is knowing which tool to use when. Master the patterns, understand their trade-offs, then break them when it makes sense. That's when programming becomes poetry."* - Noah Gift

## The Problem

You've learned the basics and built applications, but how do you write code that scales? How do you design systems that are maintainable, testable, and elegant? How do you solve complex problems with simple, reusable patterns?

Most developers either ignore patterns (creating chaos) or over-engineer (creating complexity). In Ruchy, patterns should emerge naturally from solving real problems, not from dogma.

## Quick Example

Here's elegant pattern usage in Ruchy:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// File: event_system.ruchy
// Event-driven architecture with multiple patterns

use std::patterns;

// Observer pattern for events
class EventBus {
    let subscribers = {}
    
    fun on(event, handler) {
        if !subscribers.has_key(event) {
            subscribers[event] = []
        }
        subscribers[event].push(handler)
        
        // Return unsubscribe function (closure pattern)
        return || {
            subscribers[event] = subscribers[event].filter(|h| h != handler)
        }
    }
    
    fun emit(event, data) {
        if subscribers.has_key(event) {
            for handler in subscribers[event] {
                spawn { handler(data) }  // Async pattern
            }
        }
    }
}

// Singleton pattern for global event bus
let events = EventBus::singleton()

// Decorator pattern for logging
fun with_logging(handler) {
    return |data| {
        println("[" + current_datetime() + "] Event triggered: " + data)
        let result = handler(data)
        println("[" + current_datetime() + "] Event completed")
        return result
    }
}

// Usage combining patterns
let unsubscribe = events.on("user.login", with_logging(|user| {
    println("User " + user.name + " logged in")
    update_last_login(user)
}))

events.emit("user.login", {name: "Alice", id: 123})






```

That's patterns working together harmoniously!

## Core Patterns

### Builder Pattern

Construct complex objects step by step:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Fluent interface for configuration
class ServerBuilder {
    let config = {
        port: 8080,
        host: "localhost",
        threads: 4,
        timeout: 30000,
        middleware: [],
        routes: {}
    }
    
    fun port(p) {
        config.port = p
        return self  // Enable chaining
    }
    
    fun host(h) {
        config.host = h
        return self
    }
    
    fun threads(t) {
        config.threads = t
        return self
    }
    
    fun use(middleware) {
        config.middleware.push(middleware)
        return self
    }
    
    fun route(path, handler) {
        config.routes[path] = handler
        return self
    }
    
    fun build() {
        validate_config()
        return Server::new(config)
    }
}

// Clean, readable configuration
let server = ServerBuilder::new()
    .port(3000)
    .host("0.0.0.0")
    .threads(8)
    .use(cors())
    .use(auth())
    .use(logging())
    .route("/", home_handler)
    .route("/api", api_handler)
    .build()






```

### Strategy Pattern

Swap algorithms at runtime:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Different compression strategies
class CompressionContext {
    let strategy
    
    fun set_strategy(s) {
        strategy = s
    }
    
    fun compress(data) {
        return strategy.compress(data)
    }
}

class GzipStrategy {
    fun compress(data) {
        return gzip::compress(data, level: 6)
    }
}

class BrotliStrategy {
    fun compress(data) {
        return brotli::compress(data, quality: 4)
    }
}

class NoCompressionStrategy {
    fun compress(data) {
        return data
    }
}

// Choose strategy based on context
let compressor = CompressionContext::new()

if file_size > mb(10) {
    compressor.set_strategy(BrotliStrategy::new())  // Better for large files
} else if client_supports_gzip {
    compressor.set_strategy(GzipStrategy::new())
} else {
    compressor.set_strategy(NoCompressionStrategy::new())
}

let compressed = compressor.compress(file_data)






```

### Chain of Responsibility

Process requests through a chain of handlers:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Middleware chain for request processing
class MiddlewareChain {
    let middlewares = []
    
    fun use(middleware) {
        middlewares.push(middleware)
    }
    
    fun execute(request, response) {
        let index = 0
        
        fun next() {
            if index < middlewares.len() {
                let middleware = middlewares[index]
                index += 1
                middleware(request, response, next)
            }
        }
        
        next()
    }
}

// Define middleware
fun auth_middleware(req, res, next) {
    let token = req.header("Authorization")
    if !token {
        return res.status(401).json({error: "Unauthorized"})
    }
    
    req.user = validate_token(token)
    next()
}

fun rate_limit_middleware(req, res, next) {
    let key = req.ip
    if rate_limiter.exceeded(key) {
        return res.status(429).json({error: "Too many requests"})
    }
    
    rate_limiter.increment(key)
    next()
}

fun cache_middleware(req, res, next) {
    let cache_key = req.url
    if cache.has(cache_key) {
        return res.send(cache.get(cache_key))
    }
    
    // Intercept response to cache it
    let original_send = res.send
    res.send = |data| {
        cache.set(cache_key, data)
        original_send(data)
    }
    
    next()
}

// Build the chain
let chain = MiddlewareChain::new()
chain.use(rate_limit_middleware)
chain.use(auth_middleware)
chain.use(cache_middleware)
chain.use(route_handler)

chain.execute(request, response)






```

## Functional Patterns

### Composition

Build complex behavior from simple functions:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Function composition
fun compose(...functions) {
    return |x| {
        let result = x
        for f in functions.reverse() {
            result = f(result)
        }
        return result
    }
}

// Pipeline operator
fun pipeline(value, ...functions) {
    let result = value
    for f in functions {
        result = f(result)
    }
    return result
}

// Example: Data transformation pipeline
let process_data = compose(
    validate,
    normalize,
    enrich,
    transform,
    format
)

let result = process_data(raw_data)

// Or using pipeline
let result = pipeline(
    raw_data,
    validate,
    normalize,
    enrich,
    transform,
    format
)






```

### Monadic Patterns

Handle errors and async elegantly:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Result monad for error handling
class Result {
    let value
    let error
    
    static fun ok(val) {
        return Result{value: val, error: null}
    }
    
    static fun err(e) {
        return Result{value: null, error: e}
    }
    
    fun is_ok() {
        return error == null
    }
    
    fun map(f) {
        if is_ok() {
            return Result::ok(f(value))
        }
        return self
    }
    
    fun flat_map(f) {
        if is_ok() {
            return f(value)
        }
        return self
    }
    
    fun unwrap_or(default) {
        if is_ok() {
            return value
        }
        return default
    }
}

// Chain operations safely
fun process_user(id) {
    return fetch_user(id)
        .map(|user| validate_user(user))
        .flat_map(|user| enrich_user_data(user))
        .map(|user| format_user(user))
        .unwrap_or({error: "Processing failed"})
}






```

### Lazy Evaluation

Defer computation until needed:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Lazy sequences
class LazySeq {
    let generator
    let cache = []
    let index = 0
    
    fun next() {
        if index >= cache.len() {
            let value = generator()
            if value != null {
                cache.push(value)
            }
        }
        
        if index < cache.len() {
            let value = cache[index]
            index += 1
            return value
        }
        
        return null
    }
    
    fun take(n) {
        let result = []
        for i in range(n) {
            let value = next()
            if value == null {
                break
            }
            result.push(value)
        }
        return result
    }
    
    fun map(f) {
        return LazySeq::new(|| {
            let value = next()
            if value != null {
                return f(value)
            }
            return null
        })
    }
    
    fun filter(predicate) {
        return LazySeq::new(|| {
            loop {
                let value = next()
                if value == null {
                    return null
                }
                if predicate(value) {
                    return value
                }
            }
        })
    }
}

// Infinite sequence
let fibonacci = LazySeq::new(|| {
    static let a = 0
    static let b = 1
    let next = a
    a = b
    b = next + b
    return next
})

// Only computes what's needed
let first_10_even = fibonacci
    .filter(|n| n % 2 == 0)
    .take(10)






```

## Architectural Patterns

### Repository Pattern

Abstract data access:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Generic repository interface
class Repository {
    fun find(id)
    fun find_all()
    fun find_where(conditions)
    fun save(entity)
    fun delete(id)
}

// Concrete implementation
class UserRepository < Repository {
    let db
    
    fun find(id) {
        let row = db.query_one("SELECT * FROM users WHERE id = ?", [id])
        return row ? User::from_row(row) : null
    }
    
    fun find_where(conditions) {
        let query = QueryBuilder::new("users")
            .where(conditions)
            .build()
        
        return db.query(query).map(|row| User::from_row(row))
    }
    
    fun save(user) {
        if user.id {
            db.execute("UPDATE users SET ... WHERE id = ?", user.to_row())
        } else {
            user.id = db.execute("INSERT INTO users ... VALUES ...", user.to_row())
        }
        return user
    }
}

// Use repository in service layer
class UserService {
    let repository
    
    fun get_active_users() {
        return repository.find_where({active: true})
    }
    
    fun create_user(data) {
        let user = User::new(data)
        user.validate()
        return repository.save(user)
    }
}






```

### Event Sourcing

Store events, not state:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Event sourcing system
class EventStore {
    let events = []
    let snapshots = {}
    let projections = {}
    
    fun append(event) {
        event.id = generate_id()
        event.timestamp = current_time()
        event.version = events.len() + 1
        
        events.push(event)
        update_projections(event)
        
        // Create snapshot every 100 events
        if events.len() % 100 == 0 {
            create_snapshot()
        }
    }
    
    fun replay(from_version = 0) {
        let state = snapshots.get_latest_before(from_version) || {}
        
        for event in events.filter(|e| e.version > from_version) {
            state = apply_event(state, event)
        }
        
        return state
    }
    
    fun get_projection(name) {
        return projections[name]
    }
}

// Domain events
class OrderPlaced {
    let order_id
    let customer_id
    let items
    let total
}

class PaymentReceived {
    let order_id
    let amount
    let method
}

// Event handlers update projections
fun handle_order_placed(event) {
    projections.orders[event.order_id] = {
        status: "pending",
        customer: event.customer_id,
        total: event.total
    }
    
    projections.customer_orders[event.customer_id].push(event.order_id)
}

// Rebuild state from events
let current_state = event_store.replay()






```

### CQRS (Command Query Responsibility Segregation)

Separate reads from writes:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Command side - writes
class CommandBus {
    let handlers = {}
    
    fun register(command_type, handler) {
        handlers[command_type] = handler
    }
    
    fun dispatch(command) {
        let handler = handlers[command.type]
        if !handler {
            throw "No handler for command: " + command.type
        }
        
        return handler(command)
    }
}

// Query side - reads
class QueryBus {
    let handlers = {}
    
    fun register(query_type, handler) {
        handlers[query_type] = handler
    }
    
    fun query(query) {
        let handler = handlers[query.type]
        if !handler {
            throw "No handler for query: " + query.type
        }
        
        return handler(query)
    }
}

// Commands modify state
command_bus.register("CreateOrder", |cmd| {
    let order = Order::new(cmd.data)
    order.validate()
    event_store.append(OrderPlaced::new(order))
    return order.id
})

// Queries read projections
query_bus.register("GetOrdersByCustomer", |query| {
    return read_model.get_customer_orders(query.customer_id)
})

// Usage
let order_id = command_bus.dispatch({
    type: "CreateOrder",
    data: {customer: 123, items: [...]}
})

let orders = query_bus.query({
    type: "GetOrdersByCustomer",
    customer_id: 123
})






```

## Concurrent Patterns

### Actor Model

Isolated units of computation:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Actor system
class Actor {
    let mailbox = Queue::new()
    let running = true
    
    fun receive(message) {
        mailbox.push(message)
    }
    
    fun start() {
        spawn {
            while running {
                let message = mailbox.pop()
                if message {
                    handle_message(message)
                }
                sleep(1)
            }
        }
    }
    
    fun handle_message(message) {
        // Override in subclass
    }
}

// Concrete actor
class WorkerActor < Actor {
    let state = {}
    
    fun handle_message(message) {
        match message.type {
            "process" => {
                let result = process_work(message.data)
                message.reply_to.receive({
                    type: "result",
                    data: result
                })
            }
            "get_state" => {
                message.reply_to.receive({
                    type: "state",
                    data: state
                })
            }
            "shutdown" => {
                running = false
            }
        }
    }
}

// Actor system
let system = ActorSystem::new()
let worker = system.spawn(WorkerActor)

worker.send({
    type: "process",
    data: work_item,
    reply_to: self
})






```

### Circuit Breaker

Prevent cascading failures:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
class CircuitBreaker {
    let failure_threshold = 5
    let timeout = 30000
    let failure_count = 0
    let last_failure_time = 0
    let state = "closed"  // closed, open, half_open
    
    fun call(operation) {
        if state == "open" {
            if current_time() - last_failure_time > timeout {
                state = "half_open"
            } else {
                throw "Circuit breaker is open"
            }
        }
        
        try {
            let result = operation()
            
            if state == "half_open" {
                state = "closed"
                failure_count = 0
            }
            
            return result
        } catch error {
            failure_count += 1
            last_failure_time = current_time()
            
            if failure_count >= failure_threshold {
                state = "open"
                println("Circuit breaker opened after " + failure_count.to_s() + " failures")
            }
            
            throw error
        }
    }
}

// Use circuit breaker for external service
let api_breaker = CircuitBreaker::new()

fun call_external_api(data) {
    return api_breaker.call(|| {
        http::post("https://api.external.com/endpoint")
            .json(data)
            .timeout(5000)
            .send()
    })
}






```

## Try It Yourself

Time to apply advanced patterns! Start experimenting:

```bash
$ ruchy repl
>>> # Create a simple event system
>>> let events = EventBus::new()
>>> events.on("test", |data| println("Got: " + data))
>>> events.emit("test", "Hello patterns!")
>>> 
>>> # Try functional composition
>>> let process = compose(
>>>     |x| x * 2,
>>>     |x| x + 10,
>>>     |x| x.to_s()
>>> )
>>> process(5)  // "20"
```

**Your Pattern Challenges:**

1. **Design Patterns**:
   - Plugin system (Strategy)
   - Undo/redo system (Command)
   - Game state machine (State)
   - Data transformer (Visitor)

2. **Architectural Patterns**:
   - Microservice framework
   - Event-driven system
   - Message queue
   - Workflow engine

3. **Concurrent Patterns**:
   - Thread pool
   - Producer-consumer
   - Read-write lock
   - Parallel pipeline

4. **Functional Patterns**:
   - Parser combinator
   - Validation chain
   - Async coordinator
   - Reactive streams

## Summary

- Patterns are tools, not rules
- Choose patterns that solve your actual problem
- Combine patterns for powerful solutions
- Keep it simple - don't over-engineer
- Functional patterns reduce complexity
- Concurrent patterns enable scalability
- Test patterns with real use cases
- Refactor to patterns, don't start with them

You now have mastery of advanced patterns! You're ready to build sophisticated, scalable systems.

## Conclusion

*"You've come far. From 'Hello World' to advanced patterns, from simple scripts to sophisticated systems. But remember - the best code is the code that ships and helps people. Keep learning, keep building, keep shipping. The world needs what you're going to create."* - Noah Gift

Welcome to the community of Ruchy developers. Your journey continues from here!