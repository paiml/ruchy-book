// BENCH-011: Nested Loops (1000x1000 iterations) - Rust

fn nested_loops(outer: i64, inner: i64) -> i64 {
    let mut total: i64 = 0;
    for i in 0..outer {
        for j in 0..inner {
            total += i * j;
        }
    }
    total
}

fn main() {
    let _result = nested_loops(1000, 1000);
    // Expected: 249500250000
}
