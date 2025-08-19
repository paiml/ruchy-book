# Error Handling

*"Errors aren't failures - they're information. The best code doesn't avoid errors; it embraces them, learns from them, and handles them gracefully. I've seen more systems fail from ignored errors than from actual bugs. Handle your errors like a professional, and your software will run like a dream."* - Noah Gift

## The Problem

Your code will fail. Networks drop, files disappear, users input garbage. How do you write code that expects failure and handles it elegantly? How do you propagate errors without losing information? How do you recover gracefully?

Most languages treat errors as afterthoughts - exceptions thrown into the void. In Ruchy, errors are values, explicit and impossible to ignore. Handle them properly, and your code becomes bulletproof.

## Quick Example

Here's robust error handling in Ruchy:

```ruchy
// Define error types
enum AppError {
    NetworkError(String)
    ParseError(String)
    NotFound(String)
    Unauthorized
}

// Functions return Result
fn fetch_user(id: i32) -> Result<User, AppError> {
    let response = http::get(f"/api/users/{id}")?  // ? propagates errors
    
    if response.status == 404 {
        return Err(AppError::NotFound(f"User {id} not found"))
    }
    
    if response.status == 401 {
        return Err(AppError::Unauthorized)
    }
    
    let user = parse_json(response.body)
        .map_err(|e| AppError::ParseError(e.to_string()))?
    
    return Ok(user)
}

// Handle errors explicitly
match fetch_user(123) {
    Ok(user) => {
        println(f"Found user: {user.name}")
    }
    Err(AppError::NotFound(msg)) => {
        println(f"User not found: {msg}")
    }
    Err(AppError::NetworkError(e)) => {
        println(f"Network problem: {e}")
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
// Result is an enum with two variants
enum Result<T, E> {
    Ok(T)    // Success with value
    Err(E)   // Error with error value
}

// Functions that can fail return Result
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        return Err("Division by zero")
    }
    return Ok(a / b)
}

// Check and handle results
let result = divide(10.0, 2.0)
if result.is_ok() {
    println(f"Result: {result.unwrap()}")
} else {
    println(f"Error: {result.unwrap_err()}")
}

// Pattern matching
match divide(10.0, 0.0) {
    Ok(value) => println(f"Success: {value}")
    Err(error) => println(f"Failed: {error}")
}
```

### Option Type

Handle absent values safely:

```ruchy
// Option represents nullable values
enum Option<T> {
    Some(T)  // Value present
    None     // Value absent
}

// Functions that might not return a value
fn find_user(name: String) -> Option<User> {
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
    println(f"Found: {u.email}")
} else {
    println("User not found")
}

// Chain operations safely
let email = find_user("Bob")
    .map(|u| u.email)
    .unwrap_or("no-email@example.com")
```

### Error Propagation

The ? operator makes error handling elegant:

```ruchy
// Without ? operator - verbose
fn process_file_verbose(path: String) -> Result<String, Error> {
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

// With ? operator - clean
fn process_file(path: String) -> Result<String, Error> {
    let file = open_file(path)?
    let contents = read_all(file)?
    let processed = process(contents)?
    return Ok(processed)
}

// Chain multiple operations
fn complex_operation() -> Result<Data, Error> {
    let data = fetch_data()?
        .validate()?
        .transform()?
        .optimize()?
    
    return Ok(data)
}
```

### Custom Error Types

Build rich error information:

```ruchy
// Detailed error enum
enum DatabaseError {
    ConnectionFailed { host: String, port: i32 }
    QueryFailed { query: String, error: String }
    Timeout { duration: i32 }
    InvalidCredentials
}

impl Display for DatabaseError {
    fn fmt(self, f: Formatter) -> Result {
        match self {
            ConnectionFailed{host, port} => 
                write(f, f"Failed to connect to {host}:{port}")
            QueryFailed{query, error} => 
                write(f, f"Query failed: {query}\nError: {error}")
            Timeout{duration} => 
                write(f, f"Operation timed out after {duration}ms")
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
    fn new(kind: ErrorKind, message: String) -> Error {
        return Error{
            kind,
            message,
            source: None,
            backtrace: Backtrace::capture()
        }
    }
    
    fn with_source(mut self, source: Error) -> Error {
        self.source = Some(Box::new(source))
        return self
    }
    
    fn chain(self) -> Vec<String> {
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
fn validate_user(user: User) -> Result<User, ValidationError> {
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
// Retry with exponential backoff
fn fetch_with_retry<T>(
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
                println(f"Attempt {attempt + 1} failed: {e}")
                sleep(delay)
                delay *= 2  // Exponential backoff
                attempt += 1
            }
        }
    }
}

// Fallback strategies
fn get_config() -> Config {
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
// Trait for adding context
trait Context<T> {
    fn context(self, msg: String) -> Result<T, Error>
    fn with_context<F>(self, f: F) -> Result<T, Error>
        where F: FnOnce() -> String
}

impl<T, E: Into<Error>> Context<T> for Result<T, E> {
    fn context(self, msg: String) -> Result<T, Error> {
        self.map_err(|e| {
            Error::new(e.into())
                .with_message(msg)
        })
    }
    
    fn with_context<F>(self, f: F) -> Result<T, Error>
        where F: FnOnce() -> String
    {
        self.map_err(|e| {
            Error::new(e.into())
                .with_message(f())
        })
    }
}

// Use context for better errors
fn process_order(order_id: i32) -> Result<Order, Error> {
    let order = fetch_order(order_id)
        .context(f"Failed to fetch order {order_id}")?
    
    let validated = validate_order(order)
        .context("Order validation failed")?
    
    let processed = process_payment(validated)
        .with_context(|| f"Payment processing failed for ${validated.total}")?
    
    return Ok(processed)
}
```

## Real-World Error Handling

### API Error Responses

```ruchy
// Structured API errors
struct ApiError {
    status: i32
    code: String
    message: String
    details: Option<Map<String, Any>>
}

impl ApiError {
    fn bad_request(message: String) -> ApiError {
        ApiError{
            status: 400,
            code: "BAD_REQUEST",
            message,
            details: None
        }
    }
    
    fn unauthorized() -> ApiError {
        ApiError{
            status: 401,
            code: "UNAUTHORIZED",
            message: "Authentication required",
            details: None
        }
    }
    
    fn internal_error(error: Error) -> ApiError {
        // Log full error internally
        log::error(f"Internal error: {error.chain().join(' -> ')}")
        
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
    fn into_response(self) -> Response {
        Response::builder()
            .status(self.status)
            .json(self)
    }
}
```

### Validation Pipeline

```ruchy
// Composable validators
type Validator<T> = Fn(T) -> Result<T, ValidationError>

fn validate_pipeline<T>(
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
            println(f"Validation error: {error}")
        }
    }
}
```

### Async Error Handling

```ruchy
// Async Result type
async fn fetch_data(url: String) -> Result<Data, Error> {
    let response = http::get(url).await?
    let parsed = parse_response(response).await?
    return Ok(parsed)
}

// Try multiple sources
async fn get_data_with_fallback() -> Result<Data, Error> {
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
async fn fetch_all(urls: Vec<String>) -> Vec<Result<Data, Error>> {
    let futures = urls.map(|url| fetch_data(url))
    return join_all(futures).await
}
```

## Testing Error Cases

```ruchy
#[test]
fn test_error_handling() {
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
fn test_panic_condition() {
    unsafe_operation()
}

// Property-based testing for error conditions
#[property_test]
fn never_panics(input: RandomInput) {
    let _ = safe_process(input)  // Should never panic
}
```

## Try It Yourself

Practice error handling patterns:

```bash
$ ruchy repl
>>> # Create Result types
>>> fn safe_divide(a, b) {
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
>>> fn calculation() -> Result<i32, String> {
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