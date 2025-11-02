// BENCH-006: File Line Processing - Rust
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
    let result = count_error_lines("testdata/bench-006-logs-100mb.txt")?;
    println!("{}", result);
    // Expected: 126076
    Ok(())
}
