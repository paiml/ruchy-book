// BENCH-006: File line processing (100MB log file) - Rust
// Count lines containing "error" (case-insensitive)
use std::env;
use std::fs::File;
use std::io::{BufRead, BufReader};

fn count_error_lines(filename: &str) -> std::io::Result<usize> {
    let file = File::open(filename)?;
    let reader = BufReader::new(file);

    let mut count = 0;
    for line in reader.lines() {
        let line = line?;
        if line.to_lowercase().contains("error") {
            count += 1;
        }
    }

    Ok(count)
}

fn main() -> std::io::Result<()> {
    let filename = env::args()
        .nth(1)
        .unwrap_or_else(|| "test-data/sample-100mb.log".to_string());

    let count = count_error_lines(&filename)?;
    let _ = count;
    // Silent for benchmarking
    // Expected: ~10% of lines contain ERROR

    Ok(())
}
