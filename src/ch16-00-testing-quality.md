# Testing & Quality

<!-- DOC_STATUS_START -->
**Chapter Status**: ❌ 0% Working (0/11 examples)

| Status | Count | Examples |
|--------|-------|----------|
| ✅ Working | 0 | Ready for production use |
| ⚠️ Not Implemented | 0 | Planned for future versions |
| ❌ Broken | 11 | Known issues, needs fixing |
| 📋 Planned | 0 | Future roadmap features |

*Last updated: 2025-08-24*  
*Ruchy version: ruchy 1.8.0*
<!-- DOC_STATUS_END -->


*"I learned to love testing the day it saved me from shipping a bug that would have cost millions. Tests aren't about proving your code works - they're about proving it still works after you change it. Write tests like your future self will thank you, because they will."* - Noah Gift

## The Problem

Your code works today, but will it work tomorrow? After refactoring? With new features? How do you ensure quality at scale? How do you test complex systems? How do you measure and maintain code quality?

Most developers test manually and hope for the best. In Ruchy, testing is built into the development process, with powerful tools that make quality assurance automatic, comprehensive, and even enjoyable.

## Quick Example

Here's comprehensive testing in Ruchy:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Unit test with multiple assertions
#[test]
fun test_user_validation() {
    // Arrange
    let valid_user = User {
        name: "Alice",
        email: "alice@example.com",
        age: 25
    }
    
    // Act
    let result = validate_user(valid_user)
    
    // Assert
    assert!(result.is_ok())
    assert_eq!(result.unwrap().name, "Alice")
}

// Property-based testing
#[proptest]
fun test_serialization_roundtrip(user: User) {
    let serialized = user.serialize()
    let deserialized = User::deserialize(serialized)
    assert_eq!(user, deserialized)
}

// Integration test
#[integration_test]
async fun test_api_workflow() {
    // Start test server
    let server = TestServer::new()
    
    // Create user
    let response = server.post("/users")
        .json(new_user)
        .send()
        .await
    
    assert_eq!(response.status(), 201)
    let user: User = response.json().await
    
    // Verify user exists
    let get_response = server.get("/users/" + user.id.to_s())
        .send()
        .await
    
    assert_eq!(get_response.status(), 200)
}

// Benchmark
#[bench]
fun bench_data_processing(b: &mut Bencher) {
    let data = generate_test_data(10000)
    b.iter(|| {
        process_data(data.clone())
    })
}





```

That's testing with confidence!

## Core Concepts

### Unit Testing

Test individual components:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Basic test
#[test]
fun test_addition() {
    assert_eq!(2 + 2, 4)
}

// Test with setup
#[test]
fun test_calculator() {
    // Arrange
    let calc = Calculator::new()
    
    // Act
    let result = calc.add(5, 3)
    
    // Assert
    assert_eq!(result, 8)
}

// Test expected failures
#[test]
#[should_panic(expected = "Division by zero")]
fun test_divide_by_zero() {
    divide(10, 0)
}

// Async tests
#[async_test]
async fun test_async_operation() {
    let result = fetch_data().await
    assert!(result.is_ok())
}

// Parameterized tests
#[test_case(0, 0, 0)]
#[test_case(1, 1, 2)]
#[test_case(-1, 1, 0)]
#[test_case(100, 200, 300)]
fun test_add_parameterized(a: i32, b: i32, expected: i32) {
    assert_eq!(add(a, b), expected)
}

// Test groups
mod calculator_tests {
    use super::*
    
    #[test]
    fun test_add() { /* ... */ }
    
    #[test]
    fun test_subtract() { /* ... */ }
    
    #[test]
    fun test_multiply() { /* ... */ }
}





```

### Test Fixtures

Reusable test setup:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Fixture trait
trait TestFixture {
    fun setup() -> Self
    fun teardown(self)
}

// Database fixture
struct DatabaseFixture {
    db: Database
    test_data: Vec<User>
}

impl TestFixture for DatabaseFixture {
    fun setup() -> Self {
        let db = Database::connect(":memory:")
        db.migrate()
        
        let test_data = vec![
            User::new("Alice", "alice@example.com"),
            User::new("Bob", "bob@example.com")
        ]
        
        for user in &test_data {
            db.insert(user)
        }
        
        DatabaseFixture { db, test_data }
    }
    
    fun teardown(self) {
        self.db.drop_all_tables()
        self.db.disconnect()
    }
}

// Use fixture in tests
#[test]
fun test_user_query() {
    let fixture = DatabaseFixture::setup()
    
    let users = fixture.db.query("SELECT * FROM users")
    assert_eq!(users.len(), 2)
    
    fixture.teardown()
}

// Fixture macro for automatic cleanup
#[with_fixture(DatabaseFixture)]
fun test_with_auto_cleanup(fixture: DatabaseFixture) {
    // Fixture automatically cleaned up after test
    let user = fixture.db.find_user("Alice")
    assert!(user.is_some())
}





```

### Mocking

Test in isolation:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Mock trait
trait EmailService {
    fun send_email(to: String, subject: String, body: String) -> Result<(), Error>
}

// Mock implementation
#[mockable]
struct MockEmailService {
    sent_emails: RefCell<Vec<Email>>
}

impl EmailService for MockEmailService {
    fun send_email(to: String, subject: String, body: String) -> Result<(), Error> {
        self.sent_emails.borrow_mut().push(Email { to, subject, body })
        Ok(())
    }
}

// Test with mock
#[test]
fun test_user_registration() {
    let email_service = MockEmailService::new()
    let user_service = UserService::new(email_service)
    
    user_service.register_user("alice@example.com")
    
    // Verify email was sent
    assert_eq!(email_service.sent_emails.borrow().len(), 1)
    assert_eq!(email_service.sent_emails.borrow()[0].subject, "Welcome!")
}

// Spy to verify behavior
#[test]
fun test_with_spy() {
    let spy = Spy::new(RealService::new())
    
    spy.method_call()
    
    assert!(spy.was_called("method_call"))
    assert_eq!(spy.call_count("method_call"), 1)
    assert_eq!(spy.last_args("method_call"), expected_args)
}

// Stub for predetermined responses
#[test]
fun test_with_stub() {
    let stub = Stub::new()
        .with_response("get_user", User::test_user())
        .with_error("network_call", NetworkError)
    
    let result = service_using_stub.process()
    assert_eq!(result, expected)
}





```

### Property-Based Testing

Test with generated inputs:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
use proptest::prelude::*

// Generate arbitrary test data
#[derive(Arbitrary)]
struct TestUser {
    #[proptest(regex = "[a-z]{3,10}")]
    name: String
    
    #[proptest(range = 0..150)]
    age: u8
    
    #[proptest(strategy = "email_strategy()")]
    email: String
}

// Property test
#[proptest]
fun test_user_serialization(user: TestUser) {
    // Property: serialization round-trip preserves data
    let json = to_json(user)
    let restored: TestUser = from_json(json)
    prop_assert_eq!(user, restored)
}

// Custom strategies
fun email_strategy() -> impl Strategy<Value = String> {
    "[a-z]{3,10}@[a-z]{3,10}\\.(com|org|net)"
        .prop_map(|s| s.to_string())
}

// Shrinking for minimal failing case
#[proptest]
fun test_no_panic(input: Vec<u8>) {
    // Proptest will find minimal input that causes panic
    process_bytes(input)  // Should never panic
}

// Stateful property testing
#[proptest]
fun test_database_consistency(operations: Vec<DbOperation>) {
    let db = Database::new()
    
    for op in operations {
        op.apply(&db)
    }
    
    // Properties that should always hold
    prop_assert!(db.is_consistent())
    prop_assert_eq!(db.total_balance(), INITIAL_BALANCE)
}





```

## Integration Testing

Test complete workflows:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Integration test in tests/ directory
#[integration_test]
async fun test_full_api_flow() {
    // Start services
    let db = TestDatabase::new()
    let cache = TestCache::new()
    let server = TestServer::with_services(db, cache)
    
    // Register user
    let register_response = server
        .post("/api/register")
        .json(json!({
            "email": "test@example.com",
            "password": "secure123"
        }))
        .send()
        .await
    
    assert_eq!(register_response.status(), 201)
    let user: User = register_response.json().await
    
    // Login
    let login_response = server
        .post("/api/login")
        .json(json!({
            "email": "test@example.com",
            "password": "secure123"
        }))
        .send()
        .await
    
    assert_eq!(login_response.status(), 200)
    let token = login_response.header("Authorization")
    
    // Use authenticated endpoint
    let profile_response = server
        .get("/api/profile")
        .header("Authorization", token)
        .send()
        .await
    
    assert_eq!(profile_response.status(), 200)
    let profile: Profile = profile_response.json().await
    assert_eq!(profile.email, "test@example.com")
}

// Database integration test
#[test]
fun test_database_transactions() {
    let db = Database::connect(TEST_DATABASE_URL)
    
    db.transaction(|tx| {
        tx.insert_user(user1)?
        tx.insert_user(user2)?
        
        // Verify within transaction
        let count = tx.count_users()?
        assert_eq!(count, 2)
        
        // Rollback for test isolation
        Err(TestRollback)
    })
    
    // Verify rollback worked
    assert_eq!(db.count_users(), 0)
}





```

## Performance Testing

Measure and optimize:

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Benchmarks
#[bench]
fun bench_sorting_algorithms(b: &mut Bencher) {
    let data = generate_random_vec(10000)
    
    b.iter(|| {
        let mut copy = data.clone()
        copy.sort()
    })
}

// Comparative benchmarks
#[bench_group]
mod sorting_benchmarks {
    #[bench]
    fun quick_sort(b: &mut Bencher) {
        let data = generate_data()
        b.iter(|| quick_sort(data.clone()))
    }
    
    #[bench]
    fun merge_sort(b: &mut Bencher) {
        let data = generate_data()
        b.iter(|| merge_sort(data.clone()))
    }
    
    #[bench]
    fun heap_sort(b: &mut Bencher) {
        let data = generate_data()
        b.iter(|| heap_sort(data.clone()))
    }
}

// Load testing
#[load_test]
async fun test_api_under_load() {
    let config = LoadTestConfig {
        concurrent_users: 1000,
        requests_per_user: 100,
        ramp_up_time: Duration::from_secs(10)
    }
    
    let results = load_test(config, |client| async {
        client.get("/api/endpoint").send().await
    }).await
    
    assert!(results.median_response_time < Duration::from_millis(100))
    assert!(results.p99_response_time < Duration::from_millis(500))
    assert!(results.error_rate < 0.01)
}

// Profiling in tests
#[test]
#[profile]
fun test_with_profiling() {
    let profiler = CpuProfiler::start()
    
    expensive_operation()
    
    let report = profiler.report()
    assert!(report.total_time < Duration::from_secs(1))
    
    // Generate flame graph
    report.save_flamegraph("profile.svg")
}





```

## Quality Tools

### Code Coverage

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Run tests with coverage
$ ruchy test --coverage

// Coverage report
================================
File            Lines  Covered  %
src/lib.rs      245    238     97.1%
src/parser.rs   512    487     95.1%
src/executor.rs 380    360     94.7%
================================
Total           1137   1085    95.4%

// Coverage annotations
#[test]
fun test_all_branches() {
    // Tool shows which branches are not covered
    if condition {      // ✓ true branch covered
        do_something()
    } else {           // ✗ false branch not covered
        do_other()
    }
}

// Exclude from coverage
#[cfg(not(tarpaulin_include))]
fun debug_function() {
    // Not included in coverage metrics
}





```

### Mutation Testing

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Mutation testing finds gaps in tests
$ ruchy mutate

// Mutations that survived (tests didn't catch)
src/calculator.rs:15
- Original: x + y
+ Mutation: x - y
Status: SURVIVED ❌

// Add test to catch mutation
#[test]
fun test_addition_not_subtraction() {
    assert_ne!(add(5, 3), subtract(5, 3))
}





```

### Fuzzing

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// Fuzz testing for security
#[fuzz_test]
fun fuzz_parser(data: &[u8]) {
    // Fuzzer generates random inputs
    if let Ok(s) = std::str::from_utf8(data) {
        // Should never panic or crash
        let _ = parse_input(s)
    }
}

// Run fuzzer
$ ruchy fuzz parser_fuzz
=== Fuzzing parser_fuzz ===
Iterations: 1000000
Crashes found: 0
Hangs found: 0
Coverage: 95%

// Targeted fuzzing
#[fuzz_target]
fun fuzz_api_endpoint(input: FuzzInput) {
    let request = Request::from_fuzz(input)
    let response = handle_request(request)
    
    // Properties that should hold
    assert!(response.status() < 600)
    assert!(response.body().len() < 10_000_000)
}





```

## Continuous Quality

### CI/CD Integration

```yaml
# .github/workflows/quality.yml
name: Quality Checks

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run tests
        run: ruchy test --all
        
      - name: Check coverage
        run: |
          ruchy test --coverage
          ruchy coverage --fail-under 80
      
      - name: Run benchmarks
        run: ruchy bench --save-baseline
      
      - name: Security audit
        run: ruchy audit
      
      - name: Lint code
        run: ruchy lint --strict
```

### Quality Gates

```ruchy
// Status: ❌ BROKEN
// Error: ✗ Compilation failed: Failed to parse Ruchy source
// quality.ruchy - Quality gate script
fun main() {
    let mut passed = true
    
    // Test coverage gate
    let coverage = run_coverage_analysis()
    if coverage.percentage < 80.0 {
        println("❌ Coverage too low: " + coverage.percentage.to_s() + "%")
        passed = false
    }
    
    // Performance gate
    let benchmarks = run_benchmarks()
    for (name, result) in benchmarks {
        if result.regression > 0.1 {  // 10% regression
            println("❌ Performance regression in " + name + ": " + (result.regression * 100).to_s() + "%")
            passed = false
        }
    }
    
    // Complexity gate
    let complexity = analyze_complexity()
    if complexity.max_cyclomatic > 10 {
        println("❌ Complexity too high: " + complexity.max_cyclomatic.to_s())
        passed = false
    }
    
    // Security gate
    let vulnerabilities = security_scan()
    if !vulnerabilities.is_empty() {
        println("❌ Security vulnerabilities found: " + vulnerabilities.len().to_s())
        passed = false
    }
    
    if !passed {
        exit(1)
    }
    
    println("✅ All quality gates passed!")
}





```

## Try It Yourself

Start testing like a pro:

```bash
$ ruchy test --watch
=== Running tests (watching for changes) ===
Running 42 tests...
test math::test_addition ... ok
test math::test_division ... ok
...
Test result: ok. 42 passed; 0 failed

$ ruchy bench
Running 5 benchmarks...
test bench_parse ... bench: 125 ns/iter (+/- 10)
test bench_execute ... bench: 450 ns/iter (+/- 25)

$ ruchy coverage
Generating coverage report...
Overall coverage: 94.2%
```

**Your Testing Challenges:**

1. **Test Suites**:
   - Unit test suite
   - Integration tests
   - End-to-end tests
   - Performance benchmarks

2. **Testing Tools**:
   - Mock framework
   - Fixture library
   - Assertion helpers
   - Test data generators

3. **Quality Metrics**:
   - Coverage analyzer
   - Complexity checker
   - Performance tracker
   - Security scanner

4. **Advanced Testing**:
   - Property tests
   - Mutation testing
   - Fuzz testing
   - Chaos testing

## Summary

- Write tests first or alongside code
- Unit tests for components, integration for workflows
- Mock dependencies for isolation
- Property testing finds edge cases
- Benchmarks prevent performance regressions
- Coverage shows untested code
- Quality gates maintain standards
- Automate everything in CI/CD

You now build bulletproof, high-quality software! Next, let's document it properly.