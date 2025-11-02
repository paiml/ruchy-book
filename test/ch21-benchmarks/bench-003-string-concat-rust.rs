// BENCH-003: String concatenation (10K operations) - Rust
fn string_concatenation(iterations: usize) -> String {
    // Idiomatic: String::repeat (most efficient, single allocation)
    "x".repeat(iterations)
}

fn main() {
    let iterations = 10000;
    let result = string_concatenation(iterations);
    // Silent for benchmarking
    // Expected: 10000 characters
    let _ = result;
}
