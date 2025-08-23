# Error Handling

<!-- DOC_STATUS_START -->
**Chapter Status**: ❌ 0% Working (0/12 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 0 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 12 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-22*  
*Ruchy version: ruchy 1.1.0*
<!-- DOC_STATUS_END -->


*"Errors aren't failures - they're information. The best code doesn't avoid errors; it embraces them, learns from them, and handles them gracefully. I've seen more systems fail from ignored errors than from actual bugs. Handle your errors like a professional, and your software will run like a dream."* - Noah Gift

## The Problem

Your code will fail. Networks drop, files disappear, users input garbage. How do you write code that expects failure and handles it elegantly? How do you propagate errors without losing information? How do you recover gracefully?

Most languages treat errors as afterthoughts - exceptions thrown into the void. In Ruchy, errors are values, explicit and impossible to ignore. Handle them properly, and your code becomes bulletproof.

## Quick Example

Here's robust error handling in Ruchy:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected RightBrace, found Identifier("ParseError")
// Define error types
enum AppError {
    NetworkError(String)
    ParseError(String)
    NotFound(String)
    Unauthorized
}

// Functions return Result
fun fetch_user(id: i32) -> Result<User, AppError> {
    // Note: In v0.11.0, the ? operator is removed. Use match for error handling:
    let response = match http::get("/api/users/" + id.to_s()) {
        Ok(r) => r,
        Err(e) => return Err(AppError::NetworkError(e))
    }
    
    if response.status == 404 {
        return Err(AppError::NotFound("User " + id.to_s() + " not found"))
    }
    
    if response.status == 401 {
        return Err(AppError::Unauthorized)
    }
    
    let user = match parse_json(response.body) {
        Ok(u) => u,
        Err(e) => return Err(AppError::ParseError(e.to_string()))
    }
    
    return Ok(user)
}

// Handle errors explicitly
match fetch_user(123) {
    Ok(user) => {
        println("Found user: " + user.name)
    }
    Err(AppError::NotFound(msg)) => {
        println("User not found: " + msg)
    }
    Err(AppError::NetworkError(e)) => {
        println("Network problem: " + e.to_s())
        retry_with_backoff()
    }
    Err(e) => {
        log_error(e)
        return_default_user()
    }
}




```

That's explicit, recoverable error handling!

## Core Concepts

### Result Type

The foundation of error handling:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected enum name
// Result is an enum with two variants
enum Result<T, E> {
    Ok(T)    // Success with value
    Err(E)   // Error with error value
}

// Functions that can fail return Result
fun divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        return Err("Division by zero")
    }
    return Ok(a / b)
}

// Check and handle results
let result = divide(10.0, 2.0)
if result.is_ok() {
    println("Result: " + result.unwrap().to_s())
} else {
    println("Error: " + result.unwrap_err().to_s())
}

// Pattern matching
match divide(10.0, 0.0) {
    Ok(value) => println("Success: " + value.to_s())
    Err(error) => println("Failed: " + error.to_s())
}




```

### Option Type

Handle absent values safely:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected enum name
// Option represents nullable values
enum Option<T> {
    Some(T)  // Value present
    None     // Value absent
}

// Functions that might not return a value
fun find_user(name: String) -> Option<User> {
    let users = load_users()
    for user in users {
        if user.name == name {
            return Some(user)
        }
    }
    return None
}

// Safe handling of missing values
let user = find_user("Alice")
if let Some(u) = user {
    println("Found: " + u.email)
} else {
    println("User not found")
}

// Chain operations safely
let email = find_user("Bob")
    .map(|u| u.email)
    .unwrap_or("no-email@example.com")




```

### Error Propagation

Note: The ? operator was removed in v0.11.0. Use explicit match statements for error handling:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected type
// Without ? operator - verbose
fun process_file_verbose(path: String) -> Result<String, Error> {
    let file = match open_file(path) {
        Ok(f) => f
        Err(e) => return Err(e)
    }
    
    let contents = match read_all(file) {
        Ok(c) => c
        Err(e) => return Err(e)
    }
    
    let processed = match process(contents) {
        Ok(p) => p
        Err(e) => return Err(e)
    }
    
    return Ok(processed)
}

// In v0.11.0 - use explicit error handling
fun process_file(path: String) -> Result<String, Error> {
    let file = match open_file(path) {
        Ok(f) => f,
        Err(e) => return Err(e)
    }
    let contents = match read_all(file) {
        Ok(c) => c,
        Err(e) => return Err(e)
    }
    let processed = match process(contents) {
        Ok(p) => p,
        Err(e) => return Err(e)
    }
    return Ok(processed)
}

// Chain multiple operations with explicit handling
fun complex_operation() -> Result<Data, Error> {
    let data = match fetch_data() {
        Ok(d) => d,
        Err(e) => return Err(e)
    }
    let validated = match data.validate() {
        Ok(v) => v,
        Err(e) => return Err(e)
    }
    let transformed = match validated.transform() {
        Ok(t) => t,
        Err(e) => return Err(e)
    }
    let optimized = match transformed.optimize() {
        Ok(o) => o,
        Err(e) => return Err(e)
    }
    
    return Ok(optimized)
}




```

### Custom Error Types

Build rich error information:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected RightBrace, found LeftBrace
// Detailed error enum
enum DatabaseError {
    ConnectionFailed { host: String, port: i32 }
    QueryFailed { query: String, error: String }
    Timeout { duration: i32 }
    InvalidCredentials
}

impl Display for DatabaseError {
    fun fmt(self, f: Formatter) -> Result {
        match self {
            ConnectionFailed{host, port} => 
                write(f, "Failed to connect to " + host + ":" + port.to_s())
            QueryFailed{query, error} => 
                write(f, "Query failed: " + query + "\nError: " + error)
            Timeout{duration} => 
                write(f, "Operation timed out after " + duration.to_s() + "ms")
            InvalidCredentials => 
                write(f, "Invalid database credentials")
        }
    }
}

// Error with context
struct Error {
    kind: ErrorKind
    message: String
    source: Option<Box<Error>>
    backtrace: Backtrace
}

impl Error {
    fun new(kind: ErrorKind, message: String) -> Error {
        return Error{
            kind,
            message,
            source: None,
            backtrace: Backtrace::capture()
        }
    }
    
    fun with_source(mut self, source: Error) -> Error {
        self.source = Some(Box::new(source))
        return self
    }
    
    fun chain(self) -> Vec<String> {
        let mut messages = vec![self.message]
        let mut current = self.source
        
        while let Some(error) = current {
            messages.push(error.message)
            current = error.source
        }
        
        return messages
    }
}




```

## Error Handling Patterns

### Early Returns

Exit early on errors:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected type
fun validate_user(user: User) -> Result<User, ValidationError> {
    // Early return on validation failures
    if user.name.is_empty() {
        return Err(ValidationError::EmptyName)
    }
    
    if !is_valid_email(user.email) {
        return Err(ValidationError::InvalidEmail(user.email))
    }
    
    if user.age < 0 || user.age > 150 {
        return Err(ValidationError::InvalidAge(user.age))
    }
    
    // All validations passed
    return Ok(user)
}




```

### Error Recovery

Gracefully recover from errors:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected RightParen, found LeftParen
// Retry with exponential backoff
fun fetch_with_retry<T>(
    operation: Fn() -> Result<T, Error>,
    max_attempts: i32
) -> Result<T, Error> {
    let mut attempt = 0
    let mut delay = 1000  // Start with 1 second
    
    loop {
        match operation() {
            Ok(result) => return Ok(result)
            Err(e) if attempt >= max_attempts => {
                return Err(e)
            }
            Err(e) => {
                println("Attempt " + (attempt + 1).to_s() + " failed: " + e.to_s())
                sleep(delay)
                delay *= 2  // Exponential backoff
                attempt += 1
            }
        }
    }
}

// Fallback strategies
fun get_config() -> Config {
    load_config_file()
        .or_else(|| load_env_config())
        .or_else(|| fetch_remote_config())
        .unwrap_or_else(|| Config::default())
}

// Circuit breaker pattern
struct CircuitBreaker {
    failure_count: i32
    last_failure: Option<Instant>
    state: State
}

impl CircuitBreaker {
    fn call<T>(mut self, f: Fn() -> Result<T, Error>) -> Result<T, Error> {
        match self.state {
            State::Open => {
                if self.should_attempt() {
                    self.state = State::HalfOpen
                } else {
                    return Err(Error::CircuitOpen)
                }
            }
            _ => {}
        }
        
        match f() {
            Ok(result) => {
                self.reset()
                Ok(result)
            }
            Err(e) => {
                self.record_failure()
                Err(e)
            }
        }
    }
}




```

### Error Context

Add context to errors:

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected type
// Trait for adding context
trait Context<T> {
    fun context(self, msg: String) -> Result<T, Error>
    fun with_context<F>(self, f: F) -> Result<T, Error>
        where F: FnOnce() -> String
}

impl<T, E: Into<Error>> Context<T> for Result<T, E> {
    fun context(self, msg: String) -> Result<T, Error> {
        self.map_err(|e| {
            Error::new(e.into())
                .with_message(msg)
        })
    }
    
    fun with_context<F>(self, f: F) -> Result<T, Error>
        where F: FnOnce() -> String
    {
        self.map_err(|e| {
            Error::new(e.into())
                .with_message(f())
        })
    }
}

// Use context for better errors
fun process_order(order_id: i32) -> Result<Order, Error> {
    let order = fetch_order(order_id)
        .context("Failed to fetch order " + order_id)??
    
    let validated = validate_order(order)
        .context("Order validation failed")?
    
    let processed = process_payment(validated)
        .with_context(|| "Payment processing failed for $" + validated.total.to_s())??
    
    return Ok(processed)
}




```

## Real-World Error Handling

### API Error Responses

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected RightBrace, found Identifier("code")
// Structured API errors
struct ApiError {
    status: i32
    code: String
    message: String
    details: Option<Map<String, Any>>
}

impl ApiError {
    fun bad_request(message: String) -> ApiError {
        ApiError{
            status: 400,
            code: "BAD_REQUEST",
            message,
            details: None
        }
    }
    
    fun unauthorized() -> ApiError {
        ApiError{
            status: 401,
            code: "UNAUTHORIZED",
            message: "Authentication required",
            details: None
        }
    }
    
    fun internal_error(error: Error) -> ApiError {
        // Log full error internally
        log::error("Internal error: " + error.chain().join(" -> "))
        
        // Return sanitized error to client
        ApiError{
            status: 500,
            code: "INTERNAL_ERROR",
            message: "An internal error occurred",
            details: None
        }
    }
}

// Convert to HTTP response
impl IntoResponse for ApiError {
    fun into_response(self) -> Response {
        Response::builder()
            .status(self.status)
            .json(self)
    }
}




```

### Validation Pipeline

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Unexpected token: Type
// Composable validators
type Validator<T> = Fn(T) -> Result<T, ValidationError>

fun validate_pipeline<T>(
    value: T,
    validators: Vec<Validator<T>>
) -> Result<T, Vec<ValidationError>> {
    let mut errors = Vec::new()
    let mut current = value
    
    for validator in validators {
        match validator(current) {
            Ok(validated) => current = validated
            Err(e) => errors.push(e)
        }
    }
    
    if errors.is_empty() {
        Ok(current)
    } else {
        Err(errors)
    }
}

// Use validation pipeline
let user_validators = vec![
    validate_required_fields,
    validate_email_format,
    validate_age_range,
    validate_unique_username
]

match validate_pipeline(user, user_validators) {
    Ok(valid_user) => save_user(valid_user)
    Err(errors) => {
        for error in errors {
            println("Validation error: " + error.to_s())
        }
    }
}




```

### Async Error Handling

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Expected type
// Async Result type
async fun fetch_data(url: String) -> Result<Data, Error> {
    let response = http::get(url).await?
    let parsed = parse_response(response).await?
    return Ok(parsed)
}

// Try multiple sources
async fun get_data_with_fallback() -> Result<Data, Error> {
    // Try primary source
    if let Ok(data) = fetch_data(PRIMARY_URL).await {
        return Ok(data)
    }
    
    // Try backup source
    if let Ok(data) = fetch_data(BACKUP_URL).await {
        return Ok(data)
    }
    
    // Try cache
    if let Some(cached) = get_cached_data().await {
        log::warn("Using stale cached data")
        return Ok(cached)
    }
    
    return Err(Error::NoDataAvailable)
}

// Parallel error handling
async fun fetch_all(urls: Vec<String>) -> Vec<Result<Data, Error>> {
    let futures = urls.map(|url| fetch_data(url))
    return join_all(futures).await
}




```

## Testing Error Cases

```ruchy
// Status: ❌ BROKEN
// Error: Parse error: Unexpected token: Underscore
#[test]
fun test_error_handling() {
    // Test expected errors
    let result = divide(10.0, 0.0)
    assert!(result.is_err())
    assert_eq!(result.unwrap_err(), "Division by zero")
    
    // Test error propagation
    let result = process_invalid_file()
    assert!(matches!(result, Err(FileError::NotFound(_))))
    
    // Test recovery
    let config = get_config_with_fallback()
    assert!(config.is_valid())  // Should always succeed
}

#[test]
#[should_panic(expected = "assertion failed")]
fun test_panic_condition() {
    unsafe_operation()
}

// Property-based testing for error conditions
#[property_test]
fun never_panics(input: RandomInput) {
    let _ = safe_process(input)  // Should never panic
}




```

## Try It Yourself

Practice error handling patterns:

```bash
$ ruchy repl
>>> # Create Result types
>>> fun safe_divide(a, b) {
>>>     if b == 0 {
>>>         return Err("Cannot divide by zero")
>>>     }
>>>     return Ok(a / b)
>>> }
>>> 
>>> safe_divide(10, 2)
Ok(5)
>>> safe_divide(10, 0)
Err("Cannot divide by zero")
>>> 
>>> # Chain operations with ?
>>> fun calculation() -> Result<i32, String> {
>>>     let a = safe_divide(20, 2)?
>>>     let b = safe_divide(a, 5)?
>>>     return Ok(b * 10)
>>> }
```

**Your Error Handling Challenges:**

1. **Robust Applications**:
   - File processor with recovery
   - Network client with retries
   - Parser with detailed errors
   - Validator with error accumulation

2. **Error Frameworks**:
   - Custom error types
   - Error reporting system
   - Debugging helpers
   - Error analytics

3. **Recovery Strategies**:
   - Circuit breakers
   - Retry mechanisms
   - Fallback chains
   - Graceful degradation

4. **Testing**:
   - Error injection
   - Chaos testing
   - Recovery testing
   - Error metrics

## Summary

- Errors are values, not exceptions
- Result and Option make errors explicit
- The ? operator propagates errors cleanly
- Custom error types provide rich context
- Early returns keep code readable
- Recovery strategies prevent cascading failures
- Test error paths as thoroughly as success paths
- Good error messages help debugging

You now write bulletproof code! Next, let's explore concurrency.